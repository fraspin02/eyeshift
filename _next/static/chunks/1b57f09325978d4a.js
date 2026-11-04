(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,10646,e=>{"use strict";var t=e.i(43476),r=e.i(79877);function i({tier:e,bloom:i=1.1,vignette:n=!0}){return"low"===e?null:(0,t.jsxs)(r.EffectComposer,{multisampling:4*("high"===e),children:[(0,t.jsx)(r.Bloom,{intensity:i,luminanceThreshold:1,luminanceSmoothing:.2,mipmapBlur:!0,radius:.7}),n?(0,t.jsx)(r.Vignette,{eskil:!1,offset:.25,darkness:.75}):(0,t.jsx)(t.Fragment,{})]})}e.s(["Effects",()=>i])},24621,33324,e=>{"use strict";var t=e.i(31067),r=e.i(71645),i=e.i(90072),n=e.i(74702),o=e.i(73949),a=e.i(49774),s=i;let l=parseInt(i.REVISION.replace(/\D+/g,""));class u extends s.ShaderMaterial{constructor(e=new s.Vector2){super({uniforms:{inputBuffer:new s.Uniform(null),depthBuffer:new s.Uniform(null),resolution:new s.Uniform(new s.Vector2),texelSize:new s.Uniform(new s.Vector2),halfTexelSize:new s.Uniform(new s.Vector2),kernel:new s.Uniform(0),scale:new s.Uniform(1),cameraNear:new s.Uniform(0),cameraFar:new s.Uniform(1),minDepthThreshold:new s.Uniform(0),maxDepthThreshold:new s.Uniform(1),depthScale:new s.Uniform(0),depthToBlurRatioBias:new s.Uniform(.25)},fragmentShader:`#include <common>
        #include <dithering_pars_fragment>      
        uniform sampler2D inputBuffer;
        uniform sampler2D depthBuffer;
        uniform float cameraNear;
        uniform float cameraFar;
        uniform float minDepthThreshold;
        uniform float maxDepthThreshold;
        uniform float depthScale;
        uniform float depthToBlurRatioBias;
        varying vec2 vUv;
        varying vec2 vUv0;
        varying vec2 vUv1;
        varying vec2 vUv2;
        varying vec2 vUv3;

        void main() {
          float depthFactor = 0.0;
          
          #ifdef USE_DEPTH
            vec4 depth = texture2D(depthBuffer, vUv);
            depthFactor = smoothstep(minDepthThreshold, maxDepthThreshold, 1.0-(depth.r * depth.a));
            depthFactor *= depthScale;
            depthFactor = max(0.0, min(1.0, depthFactor + 0.25));
          #endif
          
          vec4 sum = texture2D(inputBuffer, mix(vUv0, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv1, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv2, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv3, vUv, depthFactor));
          gl_FragColor = sum * 0.25 ;

          #include <dithering_fragment>
          #include <tonemapping_fragment>
          #include <${l>=154?"colorspace_fragment":"encodings_fragment"}>
        }`,vertexShader:`uniform vec2 texelSize;
        uniform vec2 halfTexelSize;
        uniform float kernel;
        uniform float scale;
        varying vec2 vUv;
        varying vec2 vUv0;
        varying vec2 vUv1;
        varying vec2 vUv2;
        varying vec2 vUv3;

        void main() {
          vec2 uv = position.xy * 0.5 + 0.5;
          vUv = uv;

          vec2 dUv = (texelSize * vec2(kernel) + halfTexelSize) * scale;
          vUv0 = vec2(uv.x - dUv.x, uv.y + dUv.y);
          vUv1 = vec2(uv.x + dUv.x, uv.y + dUv.y);
          vUv2 = vec2(uv.x + dUv.x, uv.y - dUv.y);
          vUv3 = vec2(uv.x - dUv.x, uv.y - dUv.y);

          gl_Position = vec4(position.xy, 1.0, 1.0);
        }`,blending:s.NoBlending,depthWrite:!1,depthTest:!1}),this.toneMapped=!1,this.setTexelSize(e.x,e.y),this.kernel=new Float32Array([0,1,2,2,3])}setTexelSize(e,t){this.uniforms.texelSize.value.set(e,t),this.uniforms.halfTexelSize.value.set(e,t).multiplyScalar(.5)}setResolution(e){this.uniforms.resolution.value.copy(e)}}class c{constructor({gl:e,resolution:t,width:r=500,height:n=500,minDepthThreshold:o=0,maxDepthThreshold:a=1,depthScale:s=0,depthToBlurRatioBias:l=.25}){this.renderToScreen=!1,this.renderTargetA=new i.WebGLRenderTarget(t,t,{minFilter:i.LinearFilter,magFilter:i.LinearFilter,stencilBuffer:!1,depthBuffer:!1,type:i.HalfFloatType}),this.renderTargetB=this.renderTargetA.clone(),this.convolutionMaterial=new u,this.convolutionMaterial.setTexelSize(1/r,1/n),this.convolutionMaterial.setResolution(new i.Vector2(r,n)),this.scene=new i.Scene,this.camera=new i.Camera,this.convolutionMaterial.uniforms.minDepthThreshold.value=o,this.convolutionMaterial.uniforms.maxDepthThreshold.value=a,this.convolutionMaterial.uniforms.depthScale.value=s,this.convolutionMaterial.uniforms.depthToBlurRatioBias.value=l,this.convolutionMaterial.defines.USE_DEPTH=s>0;const c=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),h=new Float32Array([0,0,2,0,0,2]),d=new i.BufferGeometry;d.setAttribute("position",new i.BufferAttribute(c,3)),d.setAttribute("uv",new i.BufferAttribute(h,2)),this.screen=new i.Mesh(d,this.convolutionMaterial),this.screen.frustumCulled=!1,this.scene.add(this.screen)}render(e,t,r){let i,n,o,a=this.scene,s=this.camera,l=this.renderTargetA,u=this.renderTargetB,c=this.convolutionMaterial,h=c.uniforms;h.depthBuffer.value=t.depthTexture;let d=c.kernel,m=t;for(n=0,o=d.length-1;n<o;++n)i=(1&n)==0?l:u,h.kernel.value=d[n],h.inputBuffer.value=m.texture,e.setRenderTarget(i),e.render(a,s),m=i;h.kernel.value=d[n],h.inputBuffer.value=m.texture,e.setRenderTarget(this.renderToScreen?null:r),e.render(a,s)}}var h=i;class d extends h.MeshStandardMaterial{constructor(e={}){super(e),this._tDepth={value:null},this._distortionMap={value:null},this._tDiffuse={value:null},this._tDiffuseBlur={value:null},this._textureMatrix={value:null},this._hasBlur={value:!1},this._mirror={value:0},this._mixBlur={value:0},this._blurStrength={value:.5},this._minDepthThreshold={value:.9},this._maxDepthThreshold={value:1},this._depthScale={value:0},this._depthToBlurRatioBias={value:.25},this._distortion={value:1},this._mixContrast={value:1},this.setValues(e)}onBeforeCompile(e){var t;null!=(t=e.defines)&&t.USE_UV||(e.defines.USE_UV=""),e.uniforms.hasBlur=this._hasBlur,e.uniforms.tDiffuse=this._tDiffuse,e.uniforms.tDepth=this._tDepth,e.uniforms.distortionMap=this._distortionMap,e.uniforms.tDiffuseBlur=this._tDiffuseBlur,e.uniforms.textureMatrix=this._textureMatrix,e.uniforms.mirror=this._mirror,e.uniforms.mixBlur=this._mixBlur,e.uniforms.mixStrength=this._blurStrength,e.uniforms.minDepthThreshold=this._minDepthThreshold,e.uniforms.maxDepthThreshold=this._maxDepthThreshold,e.uniforms.depthScale=this._depthScale,e.uniforms.depthToBlurRatioBias=this._depthToBlurRatioBias,e.uniforms.distortion=this._distortion,e.uniforms.mixContrast=this._mixContrast,e.vertexShader=`
        uniform mat4 textureMatrix;
        varying vec4 my_vUv;
      ${e.vertexShader}`,e.vertexShader=e.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
        my_vUv = textureMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );`),e.fragmentShader=`
        uniform sampler2D tDiffuse;
        uniform sampler2D tDiffuseBlur;
        uniform sampler2D tDepth;
        uniform sampler2D distortionMap;
        uniform float distortion;
        uniform float cameraNear;
			  uniform float cameraFar;
        uniform bool hasBlur;
        uniform float mixBlur;
        uniform float mirror;
        uniform float mixStrength;
        uniform float minDepthThreshold;
        uniform float maxDepthThreshold;
        uniform float mixContrast;
        uniform float depthScale;
        uniform float depthToBlurRatioBias;
        varying vec4 my_vUv;
        ${e.fragmentShader}`,e.fragmentShader=e.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>

      float distortionFactor = 0.0;
      #ifdef USE_DISTORTION
        distortionFactor = texture2D(distortionMap, vUv).r * distortion;
      #endif

      vec4 new_vUv = my_vUv;
      new_vUv.x += distortionFactor;
      new_vUv.y += distortionFactor;

      vec4 base = texture2DProj(tDiffuse, new_vUv);
      vec4 blur = texture2DProj(tDiffuseBlur, new_vUv);

      vec4 merge = base;

      #ifdef USE_NORMALMAP
        vec2 normal_uv = vec2(0.0);
        vec4 normalColor = texture2D(normalMap, vUv * normalScale);
        vec3 my_normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );
        vec3 coord = new_vUv.xyz / new_vUv.w;
        normal_uv = coord.xy + coord.z * my_normal.xz * 0.05;
        vec4 base_normal = texture2D(tDiffuse, normal_uv);
        vec4 blur_normal = texture2D(tDiffuseBlur, normal_uv);
        merge = base_normal;
        blur = blur_normal;
      #endif

      float depthFactor = 0.0001;
      float blurFactor = 0.0;

      #ifdef USE_DEPTH
        vec4 depth = texture2DProj(tDepth, new_vUv);
        depthFactor = smoothstep(minDepthThreshold, maxDepthThreshold, 1.0-(depth.r * depth.a));
        depthFactor *= depthScale;
        depthFactor = max(0.0001, min(1.0, depthFactor));

        #ifdef USE_BLUR
          blur = blur * min(1.0, depthFactor + depthToBlurRatioBias);
          merge = merge * min(1.0, depthFactor + 0.5);
        #else
          merge = merge * depthFactor;
        #endif

      #endif

      float reflectorRoughnessFactor = roughness;
      #ifdef USE_ROUGHNESSMAP
        vec4 reflectorTexelRoughness = texture2D( roughnessMap, vUv );
        reflectorRoughnessFactor *= reflectorTexelRoughness.g;
      #endif

      #ifdef USE_BLUR
        blurFactor = min(1.0, mixBlur * reflectorRoughnessFactor);
        merge = mix(merge, blur, blurFactor);
      #endif

      vec4 newMerge = vec4(0.0, 0.0, 0.0, 1.0);
      newMerge.r = (merge.r - 0.5) * mixContrast + 0.5;
      newMerge.g = (merge.g - 0.5) * mixContrast + 0.5;
      newMerge.b = (merge.b - 0.5) * mixContrast + 0.5;

      diffuseColor.rgb = diffuseColor.rgb * ((1.0 - min(1.0, mirror)) + newMerge.rgb * mixStrength);
      `)}get tDiffuse(){return this._tDiffuse.value}set tDiffuse(e){this._tDiffuse.value=e}get tDepth(){return this._tDepth.value}set tDepth(e){this._tDepth.value=e}get distortionMap(){return this._distortionMap.value}set distortionMap(e){this._distortionMap.value=e}get tDiffuseBlur(){return this._tDiffuseBlur.value}set tDiffuseBlur(e){this._tDiffuseBlur.value=e}get textureMatrix(){return this._textureMatrix.value}set textureMatrix(e){this._textureMatrix.value=e}get hasBlur(){return this._hasBlur.value}set hasBlur(e){this._hasBlur.value=e}get mirror(){return this._mirror.value}set mirror(e){this._mirror.value=e}get mixBlur(){return this._mixBlur.value}set mixBlur(e){this._mixBlur.value=e}get mixStrength(){return this._blurStrength.value}set mixStrength(e){this._blurStrength.value=e}get minDepthThreshold(){return this._minDepthThreshold.value}set minDepthThreshold(e){this._minDepthThreshold.value=e}get maxDepthThreshold(){return this._maxDepthThreshold.value}set maxDepthThreshold(e){this._maxDepthThreshold.value=e}get depthScale(){return this._depthScale.value}set depthScale(e){this._depthScale.value=e}get depthToBlurRatioBias(){return this._depthToBlurRatioBias.value}set depthToBlurRatioBias(e){this._depthToBlurRatioBias.value=e}get distortion(){return this._distortion.value}set distortion(e){this._distortion.value=e}get mixContrast(){return this._mixContrast.value}set mixContrast(e){this._mixContrast.value=e}}let m=r.forwardRef(({mixBlur:e=0,mixStrength:s=1,resolution:l=256,blur:u=[0,0],minDepthThreshold:h=.9,maxDepthThreshold:m=1,depthScale:f=0,depthToBlurRatioBias:p=.25,mirror:v=0,distortion:x=1,mixContrast:g=1,distortionMap:y,reflectorOffset:M=0,...S},_)=>{(0,n.extend)({MeshReflectorMaterialImpl:d});let w=(0,o.useThree)(({gl:e})=>e),T=(0,o.useThree)(({camera:e})=>e),b=(0,o.useThree)(({scene:e})=>e),D=(u=Array.isArray(u)?u:[u,u])[0]+u[1]>0,U=u[0],B=u[1],F=r.useRef(null);r.useImperativeHandle(_,()=>F.current,[]);let[R]=r.useState(()=>new i.Plane),[E]=r.useState(()=>new i.Vector3),[P]=r.useState(()=>new i.Vector3),[j]=r.useState(()=>new i.Vector3),[C]=r.useState(()=>new i.Matrix4),[z]=r.useState(()=>new i.Vector3(0,0,-1)),[k]=r.useState(()=>new i.Vector4),[I]=r.useState(()=>new i.Vector3),[W]=r.useState(()=>new i.Vector3),[A]=r.useState(()=>new i.Vector4),[V]=r.useState(()=>new i.Matrix4),[L]=r.useState(()=>new i.PerspectiveCamera),$=r.useCallback(()=>{var e;let t=F.current.parent||(null==(e=F.current)||null==(e=e.__r3f.parent)?void 0:e.object);if(!t||(P.setFromMatrixPosition(t.matrixWorld),j.setFromMatrixPosition(T.matrixWorld),C.extractRotation(t.matrixWorld),E.set(0,0,1),E.applyMatrix4(C),P.addScaledVector(E,M),I.subVectors(P,j),I.dot(E)>0))return;I.reflect(E).negate(),I.add(P),C.extractRotation(T.matrixWorld),z.set(0,0,-1),z.applyMatrix4(C),z.add(j),W.subVectors(P,z),W.reflect(E).negate(),W.add(P),L.position.copy(I),L.up.set(0,1,0),L.up.applyMatrix4(C),L.up.reflect(E),L.lookAt(W),L.far=T.far,L.updateMatrixWorld(),L.projectionMatrix.copy(T.projectionMatrix),V.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),V.multiply(L.projectionMatrix),V.multiply(L.matrixWorldInverse),V.multiply(t.matrixWorld),R.setFromNormalAndCoplanarPoint(E,P),R.applyMatrix4(L.matrixWorldInverse),k.set(R.normal.x,R.normal.y,R.normal.z,R.constant);let r=L.projectionMatrix;A.x=(Math.sign(k.x)+r.elements[8])/r.elements[0],A.y=(Math.sign(k.y)+r.elements[9])/r.elements[5],A.z=-1,A.w=(1+r.elements[10])/r.elements[14],k.multiplyScalar(2/k.dot(A)),r.elements[2]=k.x,r.elements[6]=k.y,r.elements[10]=k.z+1,r.elements[14]=k.w},[T,M]),[H,N,O,G]=r.useMemo(()=>{let t={minFilter:i.LinearFilter,magFilter:i.LinearFilter,type:i.HalfFloatType},r=new i.WebGLRenderTarget(l,l,t);r.depthBuffer=!0,r.depthTexture=new i.DepthTexture(l,l),r.depthTexture.format=i.DepthFormat,r.depthTexture.type=i.UnsignedShortType;let n=new i.WebGLRenderTarget(l,l,t),o=new c({gl:w,resolution:l,width:U,height:B,minDepthThreshold:h,maxDepthThreshold:m,depthScale:f,depthToBlurRatioBias:p}),a={mirror:v,textureMatrix:V,mixBlur:e,tDiffuse:r.texture,tDepth:r.depthTexture,tDiffuseBlur:n.texture,hasBlur:D,mixStrength:s,minDepthThreshold:h,maxDepthThreshold:m,depthScale:f,depthToBlurRatioBias:p,distortion:x,distortionMap:y,mixContrast:g,"defines-USE_BLUR":D?"":void 0,"defines-USE_DEPTH":f>0?"":void 0,"defines-USE_DISTORTION":y?"":void 0};return[r,n,o,a]},[w,U,B,V,l,v,D,e,s,h,m,f,p,x,y,g]);return(0,a.useFrame)(()=>{var e;let t=F.current.parent||(null==(e=F.current)||null==(e=e.__r3f.parent)?void 0:e.object);if(!t)return;t.visible=!1;let r=w.xr.enabled,i=w.shadowMap.autoUpdate;$(),w.xr.enabled=!1,w.shadowMap.autoUpdate=!1,w.setRenderTarget(H),w.state.buffers.depth.setMask(!0),w.autoClear||w.clear(),w.render(b,L),D&&O.render(w,H,N),w.xr.enabled=r,w.shadowMap.autoUpdate=i,t.visible=!0,w.setRenderTarget(null)}),r.createElement("meshReflectorMaterialImpl",(0,t.default)({attach:"material",key:"key"+G["defines-USE_BLUR"]+G["defines-USE_DEPTH"]+G["defines-USE_DISTORTION"],ref:F},G,S))});e.s(["MeshReflectorMaterial",()=>m],24621);var f=e.i(43476);let p=null;function v({count:e=10,color:t="#8fa6c8",opacity:n=.35,spread:o=[2.4,.5,1.2],y:s=-.3}){let l=(0,r.useRef)(null),u=(0,r.useMemo)(()=>Array.from({length:e},()=>({x:(Math.random()-.5)*o[0],y:s+Math.random()*o[1],z:-.4-Math.random()*o[2],s:.9+1.2*Math.random(),sp:.01+.025*Math.random(),r:Math.random()*Math.PI})),[e,o,s]),c=(0,r.useMemo)(()=>new i.SpriteMaterial({map:function(){if(p)return p;let e=document.createElement("canvas");e.width=e.height=128;let t=e.getContext("2d");for(let e=0;e<26;e++){let e=64+(Math.random()-.5)*51.2,r=64+(Math.random()-.5)*51.2,i=128*(.15+.25*Math.random()),n=t.createRadialGradient(e,r,0,e,r,i);n.addColorStop(0,"rgba(255,255,255,0.12)"),n.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=n,t.fillRect(0,0,128,128)}return p=new i.CanvasTexture(e)}(),color:t,transparent:!0,opacity:n,depthWrite:!1,blending:i.AdditiveBlending}),[t,n]);return(0,a.useFrame)((e,t)=>{let r=l.current;r&&r.children.forEach((e,r)=>{e.position.x+=u[r].sp*t*(r%2?1:-1),e.position.x>o[0]/2&&(e.position.x=-o[0]/2),e.position.x<-o[0]/2&&(e.position.x=o[0]/2),e.material.rotation+=.01*t})}),(0,f.jsx)("group",{ref:l,children:u.map((e,t)=>(0,f.jsx)("sprite",{position:[e.x,e.y,e.z],scale:[e.s,.6*e.s,1],material:c},t))})}e.s(["Smoke",()=>v],33324)},78993,e=>{"use strict";let t,r;var i=e.i(43476),n=e.i(71645),o=e.i(90072),a=e.i(49774),s=e.i(73949),l=e.i(43257),u=e.i(48455),c=e.i(24621),h=e.i(67920),d=e.i(31067),m=e.i(88014);let f=new o.Vector3,p=new o.Vector3,v=new o.Vector3,x=new o.Vector2;function g(e,t,r){let i=f.setFromMatrixPosition(e.matrixWorld);i.project(t);let n=r.width/2,o=r.height/2;return[i.x*n+n,-(i.y*o)+o]}let y=e=>1e-10>Math.abs(e)?0:e;function M(e,t,r=""){let i="matrix3d(";for(let r=0;16!==r;r++)i+=y(t[r]*e.elements[r])+(15!==r?",":")");return r+i}let S=(t=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>M(e,t)),_=(r=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>M(e,r(t),"translate(-50%,-50%)")),w=n.forwardRef(({children:e,eps:t=.001,style:r,className:i,prepend:l,center:u,fullscreen:c,portal:h,distanceFactor:M,sprite:w=!1,transform:T=!1,occlude:b,onOcclude:D,castShadow:U,receiveShadow:B,material:F,geometry:R,zIndexRange:E=[0x1000037,0],calculatePosition:P=g,as:j="div",wrapperClass:C,pointerEvents:z="auto",...k},I)=>{let{gl:W,camera:A,scene:V,size:L,raycaster:$,events:H,viewport:N}=(0,s.useThree)(),[O]=n.useState(()=>document.createElement(j)),G=n.useRef(null),K=n.useRef(null),Y=n.useRef(0),Z=n.useRef([0,0]),q=n.useRef(null),J=n.useRef(null),Q=(null==h?void 0:h.current)||H.connected||W.domElement.parentNode,X=n.useRef(null),ee=n.useRef(!1),et=n.useMemo(()=>{var e;return b&&"blending"!==b||Array.isArray(b)&&b.length&&(e=b[0])&&"object"==typeof e&&"current"in e},[b]);n.useLayoutEffect(()=>{let e=W.domElement;b&&"blending"===b?(e.style.zIndex=`${Math.floor(E[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[b]),n.useLayoutEffect(()=>{if(K.current){let e=G.current=m.createRoot(O);if(V.updateMatrixWorld(),T)O.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=P(K.current,A,L);O.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return Q&&(l?Q.prepend(O):Q.appendChild(O)),()=>{Q&&Q.removeChild(O),e.unmount()}}},[Q,T]),n.useLayoutEffect(()=>{C&&(O.className=C)},[C]);let er=n.useMemo(()=>T?{position:"absolute",top:0,left:0,width:L.width,height:L.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:u?"translate3d(-50%,-50%,0)":"none",...c&&{top:-L.height/2,left:-L.width/2,width:L.width,height:L.height},...r},[r,u,c,L,T]),ei=n.useMemo(()=>({position:"absolute",pointerEvents:z}),[z]);n.useLayoutEffect(()=>{var t,o;ee.current=!1,T?null==(t=G.current)||t.render(n.createElement("div",{ref:q,style:er},n.createElement("div",{ref:J,style:ei},n.createElement("div",{ref:I,className:i,style:r,children:e})))):null==(o=G.current)||o.render(n.createElement("div",{ref:I,style:er,className:i,children:e}))});let en=n.useRef(!0);(0,a.useFrame)(e=>{if(K.current){A.updateMatrixWorld(),K.current.updateWorldMatrix(!0,!1);let e=T?Z.current:P(K.current,A,L);if(T||Math.abs(Y.current-A.zoom)>t||Math.abs(Z.current[0]-e[0])>t||Math.abs(Z.current[1]-e[1])>t){var r;let t,i,n,a,s=(r=K.current,t=f.setFromMatrixPosition(r.matrixWorld),i=p.setFromMatrixPosition(A.matrixWorld),n=t.sub(i),a=A.getWorldDirection(v),n.angleTo(a)>Math.PI/2),l=!1;et&&(Array.isArray(b)?l=b.map(e=>e.current):"blending"!==b&&(l=[V]));let u=en.current;l?en.current=function(e,t,r,i){let n=f.setFromMatrixPosition(e.matrixWorld),o=n.clone();o.project(t),x.set(o.x,o.y),r.setFromCamera(x,t);let a=r.intersectObjects(i,!0);if(a.length){let e=a[0].distance;return n.distanceTo(r.ray.origin)<e}return!0}(K.current,A,$,l)&&!s:en.current=!s,u!==en.current&&(D?D(!en.current):O.style.display=en.current?"block":"none");let c=Math.floor(E[0]/2),h=b?et?[E[0],c]:[c-1,0]:E;if(O.style.zIndex=`${function(e,t,r){if(t instanceof o.PerspectiveCamera||t instanceof o.OrthographicCamera){let i=f.setFromMatrixPosition(e.matrixWorld),n=p.setFromMatrixPosition(t.matrixWorld),o=i.distanceTo(n),a=(r[1]-r[0])/(t.far-t.near),s=r[1]-a*t.far;return Math.round(a*o+s)}}(K.current,A,h)}`,T){let[e,t]=[L.width/2,L.height/2],r=A.projectionMatrix.elements[5]*t,{isOrthographicCamera:i,top:n,left:o,bottom:a,right:s}=A,l=S(A.matrixWorldInverse),u=i?`scale(${r})translate(${y(-(s+o)/2)}px,${y((n+a)/2)}px)`:`translateZ(${r}px)`,c=K.current.matrixWorld;w&&((c=A.matrixWorldInverse.clone().transpose().copyPosition(c).scale(K.current.scale)).elements[3]=c.elements[7]=c.elements[11]=0,c.elements[15]=1),O.style.width=L.width+"px",O.style.height=L.height+"px",O.style.perspective=i?"":`${r}px`,q.current&&J.current&&(q.current.style.transform=`${u}${l}translate(${e}px,${t}px)`,J.current.style.transform=_(c,1/((M||10)/400)))}else{let t=void 0===M?1:function(e,t){if(t instanceof o.OrthographicCamera)return t.zoom;if(!(t instanceof o.PerspectiveCamera))return 1;{let r=f.setFromMatrixPosition(e.matrixWorld),i=p.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*r.distanceTo(i))}}(K.current,A)*M;O.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}Z.current=e,Y.current=A.zoom}}if(!et&&X.current&&!ee.current)if(T){if(q.current){let e=q.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=A;if(t||R)k.scale&&(Array.isArray(k.scale)?k.scale instanceof o.Vector3?X.current.scale.copy(k.scale.clone().divideScalar(1)):X.current.scale.set(1/k.scale[0],1/k.scale[1],1/k.scale[2]):X.current.scale.setScalar(1/k.scale));else{let t=(M||10)/400,r=e.clientWidth*t,i=e.clientHeight*t;X.current.scale.set(r,i,1)}ee.current=!0}}}else{let t=O.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/N.factor,r=t.clientWidth*e,i=t.clientHeight*e;X.current.scale.set(r,i,1),ee.current=!0}X.current.lookAt(e.camera.position)}});let eo=n.useMemo(()=>({vertexShader:T?void 0:`
          /*
            This shader is from the THREE's SpriteMaterial.
            We need to turn the backing plane into a Sprite
            (make it always face the camera) if "transfrom"
            is false.
          */
          #include <common>

          void main() {
            vec2 center = vec2(0., 1.);
            float rotation = 0.0;

            // This is somewhat arbitrary, but it seems to work well
            // Need to figure out how to derive this dynamically if it even matters
            float size = 0.03;

            vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
            vec2 scale;
            scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
            scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

            bool isPerspective = isPerspectiveMatrix( projectionMatrix );
            if ( isPerspective ) scale *= - mvPosition.z;

            vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale * size;
            vec2 rotatedPosition;
            rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
            rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
            mvPosition.xy += rotatedPosition;

            gl_Position = projectionMatrix * mvPosition;
          }
      `,fragmentShader:`
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
      `}),[T]);return n.createElement("group",(0,d.default)({},k,{ref:K}),b&&!et&&n.createElement("mesh",{castShadow:U,receiveShadow:B,ref:X},R||n.createElement("planeGeometry",null),F||n.createElement("shaderMaterial",{side:o.DoubleSide,vertexShader:eo.vertexShader,fragmentShader:eo.fragmentShader})))});function T({position:e,label:t,index:r,active:n,visible:o,onSelect:a}){return(0,i.jsx)(w,{position:e,center:!0,zIndexRange:[20,10],style:{pointerEvents:o?"auto":"none"},children:(0,i.jsxs)("button",{type:"button",onClick:a,"aria-label":`${t} — mostra dettagli`,"aria-pressed":n,tabIndex:o?0:-1,className:`group relative flex h-9 w-9 items-center justify-center transition-all duration-500 ${o?"scale-100 opacity-100":"scale-50 opacity-0"}`,children:[(0,i.jsx)("span",{className:`absolute inset-0 rounded-full border ${n?"border-danger":"border-ice/50"} animate-ping opacity-30`}),(0,i.jsx)("span",{className:`relative flex h-6 w-6 items-center justify-center rounded-full border font-grotesk text-[9px] backdrop-blur-md transition ${n?"border-danger bg-danger text-ice":"border-ice/60 bg-obsidian/60 text-ice group-hover:border-cyan group-hover:text-cyan"}`,children:String(r+1).padStart(2,"0")})]})})}var b=e.i(33324),D=e.i(10646),U=e.i(13206),B=e.i(90635),F=e.i(30489),R=e.i(6898),E=e.i(4421),P=e.i(28);let j=new o.Color("#FF243E"),C=new o.Color("#00E5FF"),z=new o.Color;function k({tier:e,reduced:t}){let r=(0,E.useResolvedLook)(),d=(0,n.useMemo)(()=>new U.EyeEngine({dot:"low"===e?7:10,alive:!t}),[e,t]);(0,n.useEffect)(()=>()=>d.dispose(),[d]);let m=(0,n.useRef)(null),f=(0,n.useRef)(null),p=(0,n.useRef)(null),v=(0,n.useRef)(null),x=(0,n.useRef)(null),g=(0,n.useRef)(null),{camera:y,scene:M}=(0,s.useThree)(),S=(0,n.useMemo)(()=>new o.Vector3,[]),_=(0,B.getBackpackGeometries)(),w=(0,P.useHomeUI)(e=>e.hotspots),k=(0,P.useHomeUI)(e=>e.activeHotspot),I=(0,P.useHomeUI)(e=>e.setActive),W=(0,n.useRef)(-1);return(0,a.useFrame)((e,i)=>{let n=e.clock.elapsedTime;P.pointer.dragging||(P.pointer.dragRy+=P.pointer.dragVel,P.pointer.dragVel*=.92,P.pointer.dragRy*=1-Math.min(1,.6*i));let o=m.current;if(o){let e=t?0:P.rig.float;o.position.set(P.rig.mx,P.rig.my+.008*Math.sin(.8*n)*e,P.rig.mz),o.rotation.y=P.rig.ry+P.intro.ry+P.pointer.dragRy+(t?0:.12*P.pointer.x),o.rotation.x=P.rig.rx+(t?0:-(.05*P.pointer.y)+.012*Math.sin(.6*n)*e)}y.position.set(P.rig.cx+.02*P.pointer.x,P.rig.cy+.015*P.pointer.y,P.rig.cz*(1+P.intro.cz)),S.set(P.rig.lx,P.rig.ly,0),y.lookAt(S);let a=P.intro.light;f.current&&(f.current.intensity=26*a),p.current&&(p.current.intensity=3*a),v.current&&(v.current.intensity=2*a),M.environmentIntensity=.04+a*P.rig.env,x.current&&(x.current.intensity=.9*a),g.current&&(g.current.visible=P.rig.floor>.01,g.current.material.opacity=P.rig.floor),d.power=P.intro.power,d.stripPower=P.intro.strip,d.setPointer(P.pointer.x,P.pointer.y);let s=Math.round(40*P.rig.eyeShift)/40;s!==W.current&&(W.current=s,s>.001?(z.copy(j).lerp(C,s),d.setLook({color:`#${z.getHexString()}`})):d.setLook({color:R.LED_BY_ID[r.led].hex}))}),(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("fog",{attach:"fog",args:["#08090D",1.8,4.2]}),(0,i.jsx)("ambientLight",{intensity:.05}),(0,i.jsx)("spotLight",{ref:f,position:[.3,3.2,2.4],angle:.42,penumbra:1,intensity:0,distance:9,castShadow:"high"===e,"shadow-mapSize":[1024,1024]}),(0,i.jsx)("pointLight",{ref:p,position:[-1.3,.5,-.7],intensity:0,color:"#00E5FF",distance:5}),(0,i.jsx)("pointLight",{ref:x,position:[0,-.25,1.1],intensity:0,color:"#b9c4dd",distance:3}),(0,i.jsx)("pointLight",{ref:v,position:[1.4,.3,-.7],intensity:0,color:"#8D46FF",distance:5}),(0,i.jsxs)(l.Environment,{resolution:"low"===e?64:256,frames:1,children:[(0,i.jsx)("color",{attach:"background",args:["#020203"]}),(0,i.jsx)(u.Lightformer,{form:"rect",intensity:2.4,position:[0,5,1],scale:[4,2,1],"rotation-x":Math.PI/2}),(0,i.jsx)(u.Lightformer,{form:"rect",intensity:1.6,color:"#00E5FF",position:[-5,.6,-1],scale:[.3,5,1],"rotation-y":Math.PI/2}),(0,i.jsx)(u.Lightformer,{form:"rect",intensity:1.1,position:[5,.6,-1],scale:[.3,5,1],"rotation-y":-Math.PI/2}),(0,i.jsx)(u.Lightformer,{form:"rect",intensity:.7,position:[0,1,5],scale:[3,1.5,1]})]}),(0,i.jsx)("group",{ref:m,children:(0,i.jsx)(h.BackpackModel,{ref:void 0,look:r,engine:d,alive:!t,fps:"low"===e?20:30,children:F.FEATURES.map((e,t)=>(0,i.jsx)(T,{index:t,label:e.title,position:_.anchors[e.anchor],visible:w,active:k===e.id,onSelect:()=>I(k===e.id?null:e.id)},e.id))})}),"high"===e?(0,i.jsxs)("mesh",{ref:g,"rotation-x":-Math.PI/2,position:[0,-.36,0],children:[(0,i.jsx)("planeGeometry",{args:[12,12]}),(0,i.jsx)(c.MeshReflectorMaterial,{transparent:!0,resolution:512,mixBlur:1.2,mixStrength:1.6,blur:[400,120],roughness:.9,depthScale:1,minDepthThreshold:.6,maxDepthThreshold:1.2,color:"#08090D",metalness:.6,mirror:.6})]}):(0,i.jsxs)("mesh",{ref:g,"rotation-x":-Math.PI/2,position:[0,-.36,0],children:[(0,i.jsx)("planeGeometry",{args:[12,12]}),(0,i.jsx)("meshStandardMaterial",{color:"#08090D",roughness:.35,metalness:.5,transparent:!0})]}),"low"!==e&&!t&&(0,i.jsx)(b.Smoke,{count:"high"===e?12:6,y:-.34}),(0,i.jsx)(D.Effects,{tier:e,bloom:1.25})]})}e.s(["HeroScene",()=>k],78993)},32594,e=>{e.n(e.i(78993))}]);