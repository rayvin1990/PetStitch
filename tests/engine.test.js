'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const floss=[{code:'white',rgb:[250,250,250]},{code:'black',rgb:[15,15,15]},{code:'gray',rgb:[240,240,240]},{code:'brown',rgb:[120,80,40]}];
test('portrait and landscape respect the selected longest side, including the former 107x161 rounding case',()=>{
  assert.deepEqual(E.dimensions(1280,1920,160),{w:107,h:160});
  assert.deepEqual(E.dimensions(1920,1280,160),{w:160,h:107});
  for(const [w,h]of [[1,900],[900,1],[123,456],[800,800]])for(const target of [40,120,240]){const d=E.dimensions(w,h,target);assert.equal(Math.max(d.w,d.h),target);assert.ok(d.w>=1&&d.h>=1);}
});
test('white fur is a thread; explicit blank fabric is not counted or assigned a symbol',()=>{
  const q=E.quantize([[250,250,250],null,[15,15,15],[250,250,250]],floss,4);
  const s=E.summarize(q.grid,q.colors);assert.equal(s.total,3);assert.equal(s.blank,1);assert.equal(s.grid[1],-1);assert.equal(s.colors.find(f=>f.code==='white').count,2);assert.equal(s.colors.reduce((n,c)=>n+c.count,0),s.total);
});
test('palette keeps spatial positions and uses no more than the requested colors',()=>{
  const px=[[15,15,15],[250,250,250],[120,80,40],[15,15,15]];
  const before=JSON.stringify(px),q=E.quantize(px,floss,3);assert.equal(JSON.stringify(px),before);assert.equal(q.grid[0],q.grid[3]);assert.notEqual(q.grid[0],q.grid[1]);assert.ok(q.colors.length<=3);assert.equal(new Set(q.colors.map(f=>f.code)).size,q.colors.length);
});
test('simplification preserves high contrast eyes and never fills blank background',()=>{
  const colors=floss.map(f=>({...f,lab:E.lab(f.rgb)}));
  const eye=Array(9).fill(0);eye[4]=1;assert.equal(E.simplify(eye,3,3,colors).grid[4],1);
  const blank=Array(9).fill(0);blank[4]=-1;assert.equal(E.simplify(blank,3,3,colors).grid[4],-1);
  const subtle=Array(9).fill(0);subtle[4]=2;assert.equal(E.simplify(subtle,3,3,colors).changed,1);
});
test('plain background removal is connected to the border and preserves an enclosed white marking',()=>{
  const w=7,h=7,data=new Uint8ClampedArray(w*h*4);for(let i=0;i<w*h;i++)data.set([250,250,250,255],i*4);
  for(let y=1;y<6;y++)for(let x=1;x<6;x++)data.set([15,15,15,255],(y*w+x)*4);data.set([250,250,250,255],(3*w+3)*4);
  const mask=E.plainBackground(data,w,h,{x:0,y:0,w:1,h:1},8);assert.equal(mask[0],1);assert.equal(mask[3*w+3],0);assert.equal(mask[2*w+2],0);assert.equal(mask.reduce((a,b)=>a+b,0),24);
});
test('an entirely erased image is rejected instead of exporting a stale or empty pattern',()=>{
  assert.throws(()=>E.quantize([null,null],floss,4),/No stitches remain/);
});
