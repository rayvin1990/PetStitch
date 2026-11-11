/* Browser-local pattern math. Empty fabric is -1, never a white thread. */
'use strict';
const ThreadformEngine = (() => {
  function lab(rgb) {
    const [r,g,b]=rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});
    const f=t=>t>.008856?Math.cbrt(t):7.787*t+16/116;
    const x=f((r*.4124564+g*.3575761+b*.1804375)/.95047), y=f(r*.2126729+g*.7151522+b*.072175), z=f((r*.0193339+g*.119192+b*.9503041)/1.08883);
    return [116*y-16,500*(x-y),200*(y-z)];
  }
  const distance=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2;
  function dimensions(width,height,longest) {
    if(!(width>0&&height>0&&longest>=1))throw new Error('Invalid pattern dimensions');
    const scale=Math.min(240,Math.round(longest))/Math.max(width,height);
    return {w:Math.max(1,Math.round(width*scale)),h:Math.max(1,Math.round(height*scale))};
  }
  function quantize(pixels,floss,limit) {
    const hist=new Map();
    for(const p of pixels){if(!p)continue;const key=p.map(v=>Math.min(31,Math.floor(v/8))).join(',');let bin=hist.get(key);if(!bin){bin={rgb:[0,0,0],count:0};hist.set(key,bin);}bin.count++;for(let c=0;c<3;c++)bin.rgb[c]+=p[c];}
    if(!hist.size)throw new Error('No stitches remain. Restore part of your pet or keep the background.');
    const refs=floss.map(f=>({...f,lab:lab(f.rgb)}));
    const bins=[...hist.values()].map(b=>{b.rgb=b.rgb.map(v=>v/b.count);b.lab=lab(b.rgb);b.distances=refs.map(f=>distance(b.lab,f.lab));return b;});
    const candidates=[...new Set(bins.map(b=>b.distances.indexOf(Math.min(...b.distances))))];
    const selected=[];const errors=bins.map(()=>Infinity);
    while(selected.length<Math.min(limit,candidates.length)){
      let best=-1,bestError=Infinity;
      for(const i of candidates){if(selected.includes(i))continue;let error=0;for(let j=0;j<bins.length;j++)error+=Math.min(errors[j],bins[j].distances[i])*bins[j].count;if(error<bestError){bestError=error;best=i;}}
      if(best<0)break;selected.push(best);for(let j=0;j<bins.length;j++)errors[j]=Math.min(errors[j],bins[j].distances[best]);
    }
    const colors=selected.map(i=>refs[i]);
    const cache=new Map();
    const grid=pixels.map(p=>{if(!p)return -1;const key=p.join(',');if(cache.has(key))return cache.get(key);const l=lab(p);let best=0,d=Infinity;colors.forEach((f,i)=>{const n=distance(l,f.lab);if(n<d){d=n;best=i;}});cache.set(key,best);return best;});
    return {grid,colors};
  }
  function simplify(grid,w,h,colors) {
    const out=grid.slice();let changed=0;
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
      const i=y*w+x,own=grid[i];if(own<0)continue;let same=0;const counts=new Map();
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const k=grid[(y+dy)*w+x+dx];if(k===own)same++;if(k>=0)counts.set(k,(counts.get(k)||0)+1);}
      if(same)continue;const top=[...counts.entries()].sort((a,b)=>b[1]-a[1])[0];
      // Preserve isolated high-contrast eyes, noses and markings.
      if(top&&top[1]>=6&&distance(colors[own].lab,colors[top[0]].lab)<144){out[i]=top[0];changed++;}
    }
    return {grid:out,changed};
  }
  function summarize(grid,colors){const counts=new Map();for(const k of grid)if(k>=0)counts.set(k,(counts.get(k)||0)+1);const used=[...counts.keys()].sort((a,b)=>a-b);const remap=new Map(used.map((k,i)=>[k,i]));const mapped=grid.map(k=>k<0?-1:remap.get(k));const total=[...counts.values()].reduce((a,b)=>a+b,0);return {grid:mapped,colors:used.map(k=>({...colors[k],count:counts.get(k)})),total,blank:grid.length-total};}
  // Flood only from crop-border pixels similar to a corner color; never remove all white pixels globally.
  function plainBackground(data,width,height,crop,tolerance=12){
    const x0=Math.floor(crop.x*width),y0=Math.floor(crop.y*height),x1=Math.min(width-1,Math.ceil((crop.x+crop.w)*width)-1),y1=Math.min(height-1,Math.ceil((crop.y+crop.h)*height)-1);
    const labs=new Array(width*height);const at=i=>labs[i]||(labs[i]=lab([data[i*4],data[i*4+1],data[i*4+2]]));
    const corners=[y0*width+x0,y0*width+x1,y1*width+x0,y1*width+x1].map(at);
    const removed=new Uint8Array(width*height),seen=new Uint8Array(width*height),queue=[];
    const matches=i=>corners.some(c=>distance(at(i),c)<=tolerance*tolerance);
    const add=i=>{if(!seen[i]){seen[i]=1;if(matches(i)){removed[i]=1;queue.push(i);}}};
    for(let x=x0;x<=x1;x++){add(y0*width+x);add(y1*width+x);}for(let y=y0;y<=y1;y++){add(y*width+x0);add(y*width+x1);}
    for(let q=0;q<queue.length;q++){const i=queue[q],x=i%width,y=Math.floor(i/width);if(x>x0)add(i-1);if(x<x1)add(i+1);if(y>y0)add(i-width);if(y<y1)add(i+width);}
    return removed;
  }
  return {lab,distance,dimensions,quantize,simplify,summarize,plainBackground};
})();
if(typeof module!=='undefined')module.exports=ThreadformEngine;
