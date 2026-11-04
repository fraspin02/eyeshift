(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,10646,e=>{"use strict";var t=e.i(43476),i=e.i(79877);function r({tier:e,bloom:r=1.1,vignette:o=!0}){return"low"===e?null:(0,t.jsxs)(i.EffectComposer,{multisampling:4*("high"===e),children:[(0,t.jsx)(i.Bloom,{intensity:r,luminanceThreshold:1,luminanceSmoothing:.2,mipmapBlur:!0,radius:.7}),o?(0,t.jsx)(i.Vignette,{eskil:!1,offset:.25,darkness:.75}):(0,t.jsx)(t.Fragment,{})]})}e.s(["Effects",()=>r])},39355,72697,e=>{"use strict";var t=e.i(31067),i=e.i(71645),r=e.i(90072),o=e.i(73949),n=e.i(49774);let s={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

    	vec4 sum = vec4( 0.0 );

    	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    	gl_FragColor = sum;

    }
  `},a={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`

  uniform sampler2D tDiffuse;
  uniform float v;

  varying vec2 vUv;

  void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

    gl_FragColor = sum;

  }
  `},v=i.forwardRef(({scale:e=10,frames:v=1/0,opacity:c=1,width:u=1,height:l=1,blur:m=1,near:f=0,far:h=10,resolution:x=512,smooth:g=!0,color:d="#000000",depthWrite:y=!1,renderOrder:p,...j},D)=>{let U,L,M=i.useRef(null),b=(0,o.useThree)(e=>e.scene),P=(0,o.useThree)(e=>e.gl),F=i.useRef(null);u*=Array.isArray(e)?e[0]:e||1,l*=Array.isArray(e)?e[1]:e||1;let[w,I,S,E,T,C,R]=i.useMemo(()=>{let e=new r.WebGLRenderTarget(x,x),t=new r.WebGLRenderTarget(x,x);t.texture.generateMipmaps=e.texture.generateMipmaps=!1;let i=new r.PlaneGeometry(u,l).rotateX(Math.PI/2),o=new r.Mesh(i),n=new r.MeshDepthMaterial;n.depthTest=n.depthWrite=!1,n.onBeforeCompile=e=>{e.uniforms={...e.uniforms,ucolor:{value:new r.Color(d)}},e.fragmentShader=e.fragmentShader.replace("void main() {",`uniform vec3 ucolor;
           void main() {
          `),e.fragmentShader=e.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );","vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );")};let v=new r.ShaderMaterial(s),c=new r.ShaderMaterial(a);return c.depthTest=v.depthTest=!1,[e,i,n,o,v,c,t]},[x,u,l,e,d]),k=e=>{E.visible=!0,E.material=T,T.uniforms.tDiffuse.value=w.texture,T.uniforms.h.value=e/256,P.setRenderTarget(R),P.render(E,F.current),E.material=C,C.uniforms.tDiffuse.value=R.texture,C.uniforms.v.value=e/256,P.setRenderTarget(w),P.render(E,F.current),E.visible=!1},A=0;return(0,n.useFrame)(()=>{F.current&&(v===1/0||A<v)&&(A++,U=b.background,L=b.overrideMaterial,M.current.visible=!1,b.background=null,b.overrideMaterial=S,P.setRenderTarget(w),P.render(b,F.current),k(m),g&&k(.4*m),P.setRenderTarget(null),M.current.visible=!0,b.overrideMaterial=L,b.background=U)}),i.useImperativeHandle(D,()=>M.current,[]),i.createElement("group",(0,t.default)({"rotation-x":Math.PI/2},j,{ref:M}),i.createElement("mesh",{renderOrder:p,geometry:I,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},i.createElement("meshBasicMaterial",{transparent:!0,map:w.texture,opacity:c,depthWrite:y})),i.createElement("orthographicCamera",{ref:F,args:[-u/2,u/2,l/2,-l/2,f,h]}))});e.s(["ContactShadows",()=>v],39355);var c=e.i(43476),u=e.i(43257),l=e.i(48455);function m({mood:e="hero",intensity:t=1,accent:i="#00E5FF"}){return"studio"===e?(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("ambientLight",{intensity:.25*t}),(0,c.jsx)("directionalLight",{position:[2,3,3],intensity:2.2*t,castShadow:!0,"shadow-mapSize":[1024,1024],"shadow-bias":-4e-4}),(0,c.jsx)("directionalLight",{position:[-3,1,-2],intensity:1.2*t,color:"#cfe8ff"}),(0,c.jsxs)(u.Environment,{resolution:256,frames:1,children:[(0,c.jsx)("color",{attach:"background",args:["#0b0c10"]}),(0,c.jsx)(l.Lightformer,{form:"rect",intensity:3*t,position:[0,4,2],scale:[6,2,1],"rotation-x":Math.PI/2}),(0,c.jsx)(l.Lightformer,{form:"rect",intensity:2*t,position:[-4,1,2],scale:[2,5,1],"rotation-y":Math.PI/2}),(0,c.jsx)(l.Lightformer,{form:"rect",intensity:2*t,position:[4,1,2],scale:[2,5,1],"rotation-y":-Math.PI/2}),(0,c.jsx)(l.Lightformer,{form:"rect",intensity:1.2*t,position:[0,1,-5],scale:[8,3,1]})]})]}):"graphite"===e?(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("ambientLight",{intensity:.2*t}),(0,c.jsx)("directionalLight",{position:[2,2.5,3],intensity:1.8*t}),(0,c.jsx)("pointLight",{position:[-1.2,.4,.8],intensity:3*t,color:i,distance:4}),(0,c.jsxs)(u.Environment,{resolution:128,frames:1,children:[(0,c.jsx)("color",{attach:"background",args:["#121419"]}),(0,c.jsx)(l.Lightformer,{form:"rect",intensity:2.5*t,position:[0,4,1],scale:[5,2,1],"rotation-x":Math.PI/2}),(0,c.jsx)(l.Lightformer,{form:"rect",intensity:2*t,color:i,position:[-4,.5,1],scale:[1,4,1],"rotation-y":Math.PI/2}),(0,c.jsx)(l.Lightformer,{form:"rect",intensity:1.4*t,position:[4,.5,1],scale:[1,4,1],"rotation-y":-Math.PI/2})]})]}):"macro"===e?(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("ambientLight",{intensity:.05*t}),(0,c.jsx)("directionalLight",{position:[3,.4,.6],intensity:3.5*t}),(0,c.jsx)("pointLight",{position:[-.6,.2,.5],intensity:2*t,color:i,distance:2}),(0,c.jsxs)(u.Environment,{resolution:128,frames:1,children:[(0,c.jsx)("color",{attach:"background",args:["#020203"]}),(0,c.jsx)(l.Lightformer,{form:"rect",intensity:4*t,position:[4,.5,1],scale:[.6,4,1],"rotation-y":-Math.PI/2}),(0,c.jsx)(l.Lightformer,{form:"rect",intensity:1.5*t,color:i,position:[-4,.5,1],scale:[.4,4,1],"rotation-y":Math.PI/2})]})]}):"night"===e?(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("ambientLight",{intensity:.08*t,color:"#7aa0ff"}),(0,c.jsx)("pointLight",{position:[-2.5,1.5,-1],intensity:14*t,color:"#00E5FF",distance:8}),(0,c.jsx)("pointLight",{position:[2.5,1.2,-1.5],intensity:14*t,color:"#FF243E",distance:8}),(0,c.jsx)("directionalLight",{position:[0,4,2],intensity:.35*t,color:"#9fb4ff"}),(0,c.jsxs)(u.Environment,{resolution:128,frames:1,children:[(0,c.jsx)("color",{attach:"background",args:["#030407"]}),(0,c.jsx)(l.Lightformer,{form:"rect",intensity:2.4*t,color:"#00E5FF",position:[-5,1,-1],scale:[1,6,1],"rotation-y":Math.PI/2}),(0,c.jsx)(l.Lightformer,{form:"rect",intensity:2.4*t,color:"#FF243E",position:[5,1,-1],scale:[1,6,1],"rotation-y":-Math.PI/2}),(0,c.jsx)(l.Lightformer,{form:"rect",intensity:.6*t,position:[0,5,0],scale:[8,3,1],"rotation-x":Math.PI/2})]})]}):(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("ambientLight",{intensity:.06*t}),(0,c.jsx)("spotLight",{position:[0,3.2,2.2],angle:.45,penumbra:1,intensity:30*t,distance:8,castShadow:!0,"shadow-mapSize":[1024,1024]}),(0,c.jsx)("pointLight",{position:[-1.4,.6,-.6],intensity:3*t,color:i,distance:5}),(0,c.jsx)("pointLight",{position:[1.4,.4,-.6],intensity:2*t,color:i,distance:5}),(0,c.jsxs)(u.Environment,{resolution:256,frames:1,children:[(0,c.jsx)("color",{attach:"background",args:["#020203"]}),(0,c.jsx)(l.Lightformer,{form:"rect",intensity:2.2*t,position:[0,5,1],scale:[4,2,1],"rotation-x":Math.PI/2}),(0,c.jsx)(l.Lightformer,{form:"rect",intensity:1.4*t,color:i,position:[-5,.6,-1],scale:[.3,5,1],"rotation-y":Math.PI/2}),(0,c.jsx)(l.Lightformer,{form:"rect",intensity:1.2*t,position:[5,.6,-1],scale:[.3,5,1],"rotation-y":-Math.PI/2}),(0,c.jsx)(l.Lightformer,{form:"rect",intensity:.8*t,position:[0,1,5],scale:[3,1.5,1]})]})]})}e.s(["Lighting",()=>m],72697)},88556,e=>{e.n(e.i(98250))}]);