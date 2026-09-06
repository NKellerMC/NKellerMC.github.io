window.THERAN=window.THERAN||{};
window.THERAN.cleanups=window.THERAN.cleanups||{};
window.THERAN.mountOcean=()=>{
window.THERAN.cleanups.ocean?.();
const controller=new AbortController(),signal=controller.signal;
let destroyed=false,renderRAF=0,sequenceObserver=null,renderObserver=null;
const story=document.querySelector('.ocean-story'),canvas=document.getElementById('oceanCanvas'),qualityBtn=document.querySelector('.ocean-quality'),statusText=document.getElementById('oceanStatusText'),playbackBtn=document.querySelector('.ocean-playback'),playbackLabel=document.querySelector('.play-label');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,EN=document.documentElement.lang.toLowerCase().startsWith('en');let quality='auto';
const STAGES=EN?[{stage:1,ms:3300,status:'network stable'},{stage:2,ms:4300,status:'anomaly detected'},{stage:3,ms:Infinity,status:'anomaly detected'}]:[{stage:1,ms:3300,status:'rede estável'},{stage:2,ms:4300,status:'anomalia detectada'},{stage:3,ms:Infinity,status:'anomalia detectada'}];
let seqIndex=reduced?2:0,stageStarted=performance.now(),paused=false,pauseStarted=0,pauseCarry=0,sequenceActive=false,sequenceRAF=0,autoPaused=false;
function applyStoryStage(){if(!story)return;const entry=STAGES[seqIndex];story.dataset.stage=String(entry.stage);story.dataset.exit='0';if(statusText)statusText.textContent=entry.status;document.querySelectorAll('.hero-panel').forEach((el,i)=>el.setAttribute('aria-hidden',String(i!==seqIndex)));}
function setPaused(next){paused=next;if(playbackBtn){playbackBtn.dataset.paused=String(paused);playbackBtn.setAttribute('aria-label',paused?(EN?'Resume opening':'Retomar abertura'):(EN?'Pause opening':'Pausar abertura'))}if(playbackLabel)playbackLabel.textContent=paused?(EN?'Resume':'Retomar'):(EN?'Pause':'Pausar');if(paused)pauseStarted=performance.now();else if(pauseStarted){pauseCarry+=performance.now()-pauseStarted;pauseStarted=0}}
function advanceSequence(now){if(!sequenceActive||reduced)return;if(paused){sequenceRAF=requestAnimationFrame(advanceSequence);return}const elapsed=now-stageStarted-pauseCarry;if(elapsed>=STAGES[seqIndex].ms&&seqIndex<STAGES.length-1){seqIndex++;stageStarted=now;pauseCarry=0;applyStoryStage();if(seqIndex>=STAGES.length-1){sequenceActive=false;sequenceRAF=0;return}}sequenceRAF=requestAnimationFrame(advanceSequence)}
function startSequence(){if(sequenceActive||reduced||seqIndex>=STAGES.length-1)return;sequenceActive=true;stageStarted=performance.now();pauseCarry=0;applyStoryStage();sequenceRAF=requestAnimationFrame(advanceSequence)}
function stopSequence(){sequenceActive=false;if(sequenceRAF)cancelAnimationFrame(sequenceRAF);sequenceRAF=0}
applyStoryStage();
if(story&&!reduced){sequenceObserver=new IntersectionObserver(([e])=>{if(e.isIntersecting){startSequence()}},{threshold:.2});sequenceObserver.observe(story)}
playbackBtn?.addEventListener('click',()=>setPaused(!paused),{signal});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!paused){autoPaused=true;setPaused(true)}else if(!document.hidden&&autoPaused){autoPaused=false;setPaused(false)}},{signal});

let gl,profile='medium',ratio=1,targetFPS=60,active=true,lastFrame=0;
qualityBtn?.addEventListener('click',()=>{quality=quality==='auto'?'eco':quality==='eco'?'alta':'auto';qualityBtn.textContent=`${EN?'GRAPHICS':'GRÁFICOS'} · ${quality.toUpperCase()}`;applyQuality()},{signal});
function applyQuality(){if(!gl)return;const coarse=matchMedia('(pointer:coarse)').matches,cores=navigator.hardwareConcurrency||4,mem=navigator.deviceMemory||4;if(quality==='eco')profile='low';else if(quality==='alta')profile='high';else profile=(coarse||innerWidth<900||mem<=6||cores<=4)?'medium':'high';if(profile==='low'){ratio=.72;targetFPS=30}else if(profile==='medium'){ratio=1;targetFPS=45}else{ratio=1.28;targetFPS=60}resize()}
function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||'shader');return s}
function program(vs,fs,bindings={}){const p=gl.createProgram();gl.attachShader(p,shader(gl.VERTEX_SHADER,vs));gl.attachShader(p,shader(gl.FRAGMENT_SHADER,fs));Object.entries(bindings).forEach(([name,loc])=>gl.bindAttribLocation(p,loc,name));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||'link');return p}
const M={
 perspective(out,fovy,aspect,near,far){const f=1/Math.tan(fovy/2),nf=1/(near-far);out.set([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);return out},
 lookAt(out,e,c,u){let zx=e[0]-c[0],zy=e[1]-c[1],zz=e[2]-c[2],l=Math.hypot(zx,zy,zz)||1;zx/=l;zy/=l;zz/=l;let xx=u[1]*zz-u[2]*zy,xy=u[2]*zx-u[0]*zz,xz=u[0]*zy-u[1]*zx;l=Math.hypot(xx,xy,xz)||1;xx/=l;xy/=l;xz/=l;let yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;out.set([xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,-(xx*e[0]+xy*e[1]+xz*e[2]),-(yx*e[0]+yy*e[1]+yz*e[2]),-(zx*e[0]+zy*e[1]+zz*e[2]),1]);return out},
 mul(o,a,b){const r=new Float32Array(16);for(let c=0;c<4;c++)for(let rr=0;rr<4;rr++)r[c*4+rr]=a[rr]*b[c*4]+a[4+rr]*b[c*4+1]+a[8+rr]*b[c*4+2]+a[12+rr]*b[c*4+3];o.set(r);return o},
 model(o,x,y,z,rz,rx,ry,scale=1){const cz=Math.cos(rz),sz=Math.sin(rz),cx=Math.cos(rx),sx=Math.sin(rx),cy=Math.cos(ry),sy=Math.sin(ry),rzM=new Float32Array([cz,sz,0,0,-sz,cz,0,0,0,0,1,0,0,0,0,1]),rxM=new Float32Array([1,0,0,0,0,cx,sx,0,0,-sx,cx,0,0,0,0,1]),ryM=new Float32Array([cy,0,-sy,0,0,1,0,0,sy,0,cy,0,0,0,0,1]),t=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1]),a=new Float32Array(16),b=new Float32Array(16);M.mul(a,rzM,rxM);M.mul(b,a,ryM);M.mul(o,t,b);if(scale!==1){o[0]*=scale;o[1]*=scale;o[2]*=scale;o[4]*=scale;o[5]*=scale;o[6]*=scale;o[8]*=scale;o[9]*=scale;o[10]*=scale}return o}
};
const shipVS=`precision highp float;attribute vec3 aP;attribute vec3 aN;attribute vec4 aC;attribute vec2 aMR;uniform mat4 uVP,uM;varying vec3 vP,vN;varying vec4 vC;varying vec2 vMR;void main(){vec4 w=uM*vec4(aP,1.0);vP=w.xyz;vN=normalize(mat3(uM)*aN);vC=aC;vMR=aMR;gl_Position=uVP*w;}`;
const shipFS=`precision highp float;varying vec3 vP,vN;varying vec4 vC;varying vec2 vMR;uniform vec3 uCam,uSun,uTint;vec3 sky(vec3 r){float h=clamp(r.z*.5+.5,0.,1.);return mix(vec3(.55,.64,.63),vec3(.25,.40,.42),pow(h,.7));}void main(){vec3 N=normalize(vN),V=normalize(uCam-vP),L=normalize(uSun),H=normalize(L+V);float ndl=max(dot(N,L),0.),ndh=max(dot(N,H),0.),rough=clamp(vMR.y,.06,1.),metal=vMR.x;vec3 base=vC.rgb*uTint;vec3 diffuse=base*(.36+.64*ndl);float sp=pow(ndh,mix(180.,10.,rough));vec3 F0=mix(vec3(.035),base,metal);float fres=pow(1.-max(dot(N,V),0.),5.);vec3 env=sky(reflect(-V,N));vec3 warm=vec3(1.0,.91,.78);vec3 c=diffuse*(1.-metal*.68)+F0*sp*(1.25+1.0*ndl)*warm+env*(.11+.24*fres)*(1.-rough*.38);float fog=smoothstep(900.,4300.,length(vP.xy-uCam.xy));c=mix(c,vec3(.56,.65,.64),fog*.92);gl_FragColor=vec4(c,vC.a);}`;
const decalVS=`precision highp float;attribute vec3 aP;attribute vec3 aN;attribute vec2 aUV;uniform mat4 uVP,uM;varying vec2 vUV;varying vec3 vN;void main(){vUV=aUV;vN=normalize(mat3(uM)*aN);gl_Position=uVP*uM*vec4(aP,1.0);}`;
const decalFS=`precision highp float;varying vec2 vUV;varying vec3 vN;uniform sampler2D uTex;uniform vec3 uSun;void main(){vec4 c=texture2D(uTex,vUV);if(c.a<.035)discard;float l=.68+.32*max(dot(normalize(vN),normalize(uSun)),0.);gl_FragColor=vec4(c.rgb*l,c.a);}`;
const waterVS=`precision highp float;attribute vec2 aP;uniform mat4 uVP;uniform float uT;varying vec3 vP,vN;const float TAU=6.28318530718;void addWave(vec2 d,float a,float wl,float sp,inout vec3 p,inout vec2 g){float k=TAU/wl;d=normalize(d);float ph=k*dot(d,p.xy)-uT*sp;p.xy+=d*(a*.34*cos(ph));p.z+=a*sin(ph);g+=a*k*cos(ph)*d;}void main(){vec3 p=vec3(aP,0.);vec2 g=vec2(0.);addWave(vec2(.94,.34),.78,92.,.55,p,g);addWave(vec2(-.3,.95),.46,48.,.8,p,g);addWave(vec2(.62,-.78),.25,25.,1.08,p,g);addWave(vec2(-.86,-.51),.12,12.,1.55,p,g);vP=p;vN=normalize(vec3(-g.x,-g.y,1.));gl_Position=uVP*vec4(p,1.);}`;
const waterFS=`precision highp float;varying vec3 vP,vN;uniform vec3 uCam,uSun;uniform float uT;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec3 sky(vec3 r){float h=clamp(r.z*.5+.5,0.,1.);vec3 horizon=vec3(.58,.67,.66),zenith=vec3(.24,.39,.42);return mix(horizon,zenith,pow(h,.72));}
void main(){
 vec3 V=normalize(uCam-vP),N=normalize(vN);
 vec2 q=vP.xy;
 float a=dot(q,vec2(.118,.051))+uT*1.85;
 float b=dot(q,vec2(-.073,.164))-uT*1.46;
 float c=dot(q,vec2(.238,-.109))+uT*2.63;
 float d=dot(q,vec2(-.31,-.172))-uT*3.08;
 vec2 micro=vec2(cos(a)*.030-cos(b)*.026+cos(c)*.014,cos(a)*.013+cos(b)*.030-cos(d)*.012);
 N=normalize(N+vec3(micro,0.));
 float nv=max(dot(N,V),.001);
 float fres=.022+.978*pow(1.-nv,5.);
 vec3 R=reflect(-V,N);
 float trough=clamp(.50-vP.z*.18,0.,1.);
 vec3 deep=vec3(.018,.115,.142),shallow=vec3(.055,.255,.278);
 vec3 col=mix(deep,shallow,.30+nv*.30-trough*.09);
 col=mix(col,sky(R),.12+fres*.76);
 float sg=max(dot(R,normalize(uSun)),0.);
 float glitter=pow(sg,520.)*5.2+pow(sg,92.)*.18;
 float sparkle=step(.82,hash(floor(q*1.15)+floor(uT*3.)))*pow(sg,170.)*.24;
 col+=vec3(1.,.79,.58)*(glitter+sparkle);
 float crest=smoothstep(.50,.90,vP.z);
 float broken=hash(floor(q*.44)+floor(uT*.65));
 col+=vec3(.73,.84,.82)*crest*smoothstep(.56,.92,broken)*.07;
 float dist=length(vP.xy-uCam.xy),fog=smoothstep(900.,5200.,dist);
 col=mix(col,vec3(.58,.67,.66),fog*.96);
 col=col/(col+vec3(.72));
 col=pow(col,vec3(.94));
 gl_FragColor=vec4(col,1.);
}`;
function makeProgram(vs,fs,bindings){const p=program(vs,fs,bindings);return{p,VP:gl.getUniformLocation(p,'uVP'),M:gl.getUniformLocation(p,'uM'),cam:gl.getUniformLocation(p,'uCam'),sun:gl.getUniformLocation(p,'uSun'),tint:gl.getUniformLocation(p,'uTint')}}
function buffer(data,target=gl.ARRAY_BUFFER){const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b}
function index16(u32){const x=new Uint16Array(u32.length);for(let i=0;i<u32.length;i++)x[i]=u32[i];return x}
async function loadMetaMesh(url,md,kind){const ab=await fetch(url).then(r=>{if(!r.ok)throw new Error(url);return r.arrayBuffer()}),a=md.attributes;const v=(n,C)=>{const m=a[n];return new C(ab,m.offset,m.bytes/C.BYTES_PER_ELEMENT)};const mesh={kind,count:md.indexCount};mesh.p=buffer(v('position',Float32Array));mesh.n=buffer(v('normal',Float32Array));if(kind==='opaque'){mesh.c=buffer(v('color',Uint8Array));mesh.mr=buffer(v('params',Uint8Array))}else mesh.uv=buffer(v('uv',Float32Array));mesh.i=buffer(index16(v('index',Uint32Array)),gl.ELEMENT_ARRAY_BUFFER);return mesh}
function bindOpaque(m){gl.bindBuffer(gl.ARRAY_BUFFER,m.p);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,m.n);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,m.c);gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,4,gl.UNSIGNED_BYTE,true,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,m.mr);gl.enableVertexAttribArray(3);gl.vertexAttribPointer(3,2,gl.UNSIGNED_BYTE,true,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.i)}
function bindDecal(m){gl.bindBuffer(gl.ARRAY_BUFFER,m.p);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,m.n);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,m.uv);gl.enableVertexAttribArray(4);gl.vertexAttribPointer(4,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.i)}
async function texture(url){const blob=await fetch(url).then(r=>r.blob()),bmp=await createImageBitmap(blob),t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,bmp);const pot=n=>(n&(n-1))===0;if(pot(bmp.width)&&pot(bmp.height)){gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR)}else{gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)}gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);return t}
function waterGrid(rings=80,sectors=128,maxR=12000){
 const verts=(rings+1)*sectors,v=new Float32Array(verts*2),idx=new Uint16Array(rings*sectors*6);let k=0;
 const innerRings=56,innerR=1400;
 for(let r=0;r<=rings;r++){
   let rad;
   if(r<=innerRings)rad=innerR*(r/innerRings);
   else{const q=(r-innerRings)/(rings-innerRings);rad=innerR+(maxR-innerR)*(q*q)}
   for(let a=0;a<sectors;a++){const t=a/sectors*Math.PI*2;v[k++]=Math.cos(t)*rad;v[k++]=Math.sin(t)*rad}
 }
 k=0;
 for(let r=0;r<rings;r++)for(let a=0;a<sectors;a++){
   const b=(a+1)%sectors,p0=r*sectors+a,p1=r*sectors+b,p2=(r+1)*sectors+a,p3=(r+1)*sectors+b;
   idx[k++]=p0;idx[k++]=p1;idx[k++]=p3;idx[k++]=p0;idx[k++]=p3;idx[k++]=p2;
 }
 return{p:buffer(v),i:buffer(idx,gl.ELEMENT_ARRAY_BUFFER),count:idx.length}
}
function bindWater(m){gl.bindBuffer(gl.ARRAY_BUFFER,m.p);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.i)}
function boxGeo(out,cx,cy,cz,sx,sy,sz,rz,color){const C=Math.cos(rz),S=Math.sin(rz),pts=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],faces=[[0,1,2,3,[0,0,-1]],[4,7,6,5,[0,0,1]],[0,4,5,1,[0,-1,0]],[1,5,6,2,[1,0,0]],[2,6,7,3,[0,1,0]],[3,7,4,0,[-1,0,0]]];for(const f of faces){const base=out.p.length/3;for(let j=0;j<4;j++){let q=pts[f[j]],x=q[0]*sx/2,y=q[1]*sy/2,z=q[2]*sz/2;out.p.push(cx+C*x-S*y,cy+S*x+C*y,cz+z);let n=f[4];out.n.push(C*n[0]-S*n[1],S*n[0]+C*n[1],n[2]);out.c.push(...color,255);out.m.push(20,190)}out.i.push(base,base+1,base+2,base,base+2,base+3)}}
function fleetLayout(){
 return [
  [-338,258,Math.PI+.18,.60,[.96,.99,1.]], [132,296,Math.PI-.15,.57,[1.,.96,.92]], [-96,386,Math.PI+.075,.55,[.92,.99,.97]],
  [322,448,Math.PI-.21,.53,[.95,.98,1.]], [-268,506,Math.PI-.055,.55,[1.,.95,.92]], [42,612,Math.PI+.16,.50,[.94,1.,.96]],
  [-418,706,Math.PI+.24,.48,[.96,.98,1.]], [238,754,Math.PI-.09,.47,[1.,.96,.93]], [-118,872,Math.PI-.19,.45,[.93,1.,.97]],
  [378,996,Math.PI+.12,.43,[.96,.98,1.]], [-326,1098,Math.PI-.14,.42,[1.,.95,.93]], [86,1214,Math.PI+.22,.40,[.94,1.,.97]],
  [-182,1372,Math.PI+.035,.39,[.95,.98,1.]], [304,1496,Math.PI-.23,.37,[1.,.96,.94]], [-402,1628,Math.PI+.13,.36,[.94,1.,.97]],
  [18,1786,Math.PI-.10,.34,[.96,.98,1.]], [226,1992,Math.PI+.19,.32,[1.,.96,.94]]
 ];
}
function resize(){if(!gl)return;const r=Math.min(devicePixelRatio||1,ratio),w=Math.max(1,Math.floor(innerWidth*r)),h=Math.max(1,Math.floor(innerHeight*r));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';gl.viewport(0,0,w,h)}}
async function boot(){gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'high-performance',premultipliedAlpha:false})||canvas.getContext('experimental-webgl');if(!gl)throw new Error('WebGL indisponível');applyQuality();gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);const shipP=makeProgram(shipVS,shipFS,{aP:0,aN:1,aC:2,aMR:3}),decalP=makeProgram(decalVS,decalFS,{aP:0,aN:1,aUV:4}),waterP=program(waterVS,waterFS,{aP:0}),w={VP:gl.getUniformLocation(waterP,'uVP'),T:gl.getUniformLocation(waterP,'uT'),cam:gl.getUniformLocation(waterP,'uCam'),sun:gl.getUniformLocation(waterP,'uSun')};const meta=await fetch('assets/ship/ship_meta.json').then(r=>r.json()),opaque=await loadMetaMesh('assets/ship/ship_opaque.bin',meta.opaque,'opaque'),dec=[];for(const [key,md] of Object.entries(meta.decals))dec.push({mesh:await loadMetaMesh('assets/ship/'+key+'.bin',md,'decal'),tex:await texture('assets/ship/'+md.texture)});const water=waterGrid(),fleet=fleetLayout();if(destroyed)return;story.setAttribute('data-3d','ready');const cam=[260,-430,124],target=[-4,24,7],up=[0,0,1],sun=[-.38,-.58,.72],proj=new Float32Array(16),view=new Float32Array(16),vp=new Float32Array(16),model=new Float32Array(16),identity=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);function calcVP(t){const aspect=canvas.width/canvas.height;let fov=41;if(aspect<.72){cam[0]=300+Math.sin(t*.055)*4;cam[1]=-675;cam[2]=182;target[0]=-8;target[1]=42;target[2]=8;fov=55}else if(aspect<1.08){cam[0]=280+Math.sin(t*.055)*5;cam[1]=-565;cam[2]=154;target[0]=-5;target[1]=34;target[2]=8;fov=49}else{cam[0]=255+Math.sin(t*.055)*6;cam[1]=-455;cam[2]=126;target[0]=0;target[1]=25;target[2]=7;fov=43}M.perspective(proj,fov*Math.PI/180,aspect,.2,9000);M.lookAt(view,cam,target,up);M.mul(vp,proj,view)}function waveHeight(x,y,t){const W=[[[.94,.34],.78,92,.55],[[-.3,.95],.46,48,.8],[[.62,-.78],.25,25,1.08],[[-.86,-.51],.12,12,1.55]];let z=0;for(const [d,a,wv,s] of W){const l=Math.hypot(d[0],d[1]),k=6.28318530718/wv;z+=a*Math.sin(k*((d[0]/l)*x+(d[1]/l)*y)-t*s)}return z}renderObserver=new IntersectionObserver(([e])=>active=e.isIntersecting,{threshold:.01});renderObserver.observe(story);const t0=performance.now();function frame(now){if(destroyed)return;renderRAF=requestAnimationFrame(frame);if(!active||now-lastFrame<1000/targetFPS)return;lastFrame=now;const t=(now-t0)/1000;resize();calcVP(t);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.disable(gl.CULL_FACE);gl.useProgram(waterP);gl.uniformMatrix4fv(w.VP,false,vp);gl.uniform1f(w.T,t);gl.uniform3fv(w.cam,new Float32Array(cam));gl.uniform3fv(w.sun,new Float32Array(sun));bindWater(water);gl.drawElements(gl.TRIANGLES,water.count,gl.UNSIGNED_SHORT,0);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.useProgram(shipP.p);gl.uniformMatrix4fv(shipP.VP,false,vp);gl.uniform3fv(shipP.cam,new Float32Array(cam));gl.uniform3fv(shipP.sun,new Float32Array(sun));bindOpaque(opaque);for(let i=0;i<fleet.length;i++){const [x,y,heading,scale,tint]=fleet[i],fz=waveHeight(x,y,t)*.14+.22;M.model(model,x,y,fz,heading,0,0,scale);gl.uniformMatrix4fv(shipP.M,false,model);gl.uniform3f(shipP.tint,tint[0],tint[1],tint[2]);gl.drawElements(gl.TRIANGLES,opaque.count,gl.UNSIGNED_SHORT,0)}const z=waveHeight(0,0,t)*.22+.25,pitch=(waveHeight(0,-16,t)-waveHeight(0,16,t))/32*.045,roll=(waveHeight(-76,0,t)-waveHeight(76,0,t))/152*.055;M.model(model,0,0,z,Math.PI-.08,pitch,roll);gl.uniformMatrix4fv(shipP.M,false,model);gl.uniform3f(shipP.tint,1,1,1);gl.drawElements(gl.TRIANGLES,opaque.count,gl.UNSIGNED_SHORT,0);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.useProgram(decalP.p);gl.uniformMatrix4fv(decalP.VP,false,vp);gl.uniformMatrix4fv(decalP.M,false,model);gl.uniform3fv(decalP.sun,new Float32Array(sun));const texLoc=gl.getUniformLocation(decalP.p,'uTex');for(const d of dec){gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,d.tex);gl.uniform1i(texLoc,0);bindDecal(d.mesh);gl.drawElements(gl.TRIANGLES,d.mesh.count,gl.UNSIGNED_SHORT,0)}gl.depthMask(true);gl.disable(gl.BLEND)}renderRAF=requestAnimationFrame(frame);addEventListener('resize',resize,{passive:true,signal})}
if(!canvas||reduced){story?.setAttribute('data-3d','fallback')}else boot().catch(err=>{if(destroyed)return;console.error('THERAN WebGL:',err);story?.setAttribute('data-3d','fallback');if(statusText)statusText.textContent=EN?'compatible mode':'modo compatível'});
const cleanup=()=>{destroyed=true;stopSequence();if(renderRAF)cancelAnimationFrame(renderRAF);sequenceObserver?.disconnect();renderObserver?.disconnect();controller.abort();try{gl?.getExtension('WEBGL_lose_context')?.loseContext()}catch{}};
window.THERAN.cleanups.ocean=cleanup;
return cleanup;
};
window.THERAN.mountOcean();
export {};
