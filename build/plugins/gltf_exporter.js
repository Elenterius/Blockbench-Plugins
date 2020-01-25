!function(e){var t={};function r(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(n,a,function(t){return e[t]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){e.exports=r(1)},function(e,t,r){"use strict";r.r(t);r(2);!function(){const e=new Codec("gltf",{name:"GL Transmission Format",extension:"gltf",compile:e=>new Promise(t=>{const r=(new THREE.Vector3).copy(scene.position);scene.position.set(0,0,0),new Promise(t=>{const r=new THREE.GLTFExporter,n=["vertex_handles","outline_group","grid_group","side_grid_x","side_grid_y","sun","lights"],a=[];scene.children.forEach(e=>{if(!(n.includes(e.name)||e instanceof THREE.TransformControls)){if(e instanceof THREE.Mesh){const t=elements.findInArray("uuid",e.name);if(!t)return;if(!1===t.export)return}a.push(e)}}),void 0===e&&(e={});new THREE.Vector3(1,1,1);const i=e.animations?function(){const e=[];return Animator.animations.forEach(t=>{const r=[];for(const e in t.animators){const n=t.animators[e];if(!(n instanceof EffectAnimator)&&n.keyframes.length&&n.group){const e=n.group,t=e.mesh,a={rotation:{},position:{},scale:{}};if(n.keyframes.forEach(e=>{let t=Math.clamp(trimFloatNumber(Math.round(60*e.time)/60),0);a[e.channel][t]=e.getArray()}),Object.keys(a.position).length>0){const n=[],i=[];Object.keys(a.position).sort().forEach(e=>{const r=new THREE.Vector3;r.copy(t.fix_position);const o=(new THREE.Vector3).fromArray(a.position[e]);o.x*=-1,r.add(o),n.push(e),i.push(r.x,r.y,r.z)}),i.length>0&&r.push(new THREE.VectorKeyframeTrack(e.name+".position",n,i))}if(Object.keys(a.rotation).length>0){const n=[],i=[];Object.keys(a.rotation).sort().forEach(e=>{const r=new THREE.Vector3;r.copy(t.fix_rotation);const o=a.rotation[e],s=new THREE.Quaternion;if(4===o.length){const e=(new THREE.Euler).setFromQuaternion((new THREE.Quaternion).fromArray(o),"ZYX");r.x-=e.x,r.y-=e.y,r.z+=e.z,s.setFromEuler(new THREE.Euler(r.x,r.y,r.z,"ZYX"))}else s.setFromEuler(new THREE.Euler(THREE.Math.degToRad(-o[0]),THREE.Math.degToRad(-o[1]),THREE.Math.degToRad(o[2])));i.push(s.x,s.y,s.z,s.w),n.push(e)}),i.length>0&&r.push(new THREE.QuaternionKeyframeTrack(e.name+".quaternion",n,i))}if(Object.keys(a.scale).length>0){const e=[],r=[];Object.keys(a.scale).sort().forEach(n=>{const i=new THREE.Vector3;i.copy(t.scale);const o=a.scale[n];i.x*=o[0]||1e-5,i.y*=o[1]||1e-5,i.z*=o[2]||1e-5,r.push(i.x,i.y,i.z),e.push(n)})}}}r.length>0&&e.push(new THREE.AnimationClip(t.name,t.length,r))}),e}():[];r.parse(a,e=>t(e),{binary:!1,embedImages:!0,animations:i})}).then(e=>{scene.position.copy(r),t(JSON.stringify(e))})}),export(e){const t=this;isApp?Blockbench.export({type:this.name,extensions:[this.extension],name:this.fileName(),startpath:this.startPath(),custom_writer:(r,n)=>{t.compile(e).then(e=>{r=e,Blockbench.writeFile(n,{content:r},e=>t.afterSave(e))})}}):this.compile(e).then(e=>{Blockbench.export({type:this.name,extensions:[this.extension],name:this.fileName(),content:e},e=>t.afterDownload(e))})}});e.export_action=new Action({id:"export_gltf",name:"Export GLTF",icon:"icon-objects",description:"Export Model to GLTF",category:"file",click:()=>{new Dialog({id:"gltf_export_options",title:"Export glTF",lines:["<style>\n                        .dialog_bar {\n                            display: grid;\n                            grid-template-columns: 2fr 1fr;\n                        }\n                        .dialog_bar > :first-child:not(button) {\n                            width: min-content !important;\n                        }\n                        .dialog_bar > :last-child:not(button) {\n                            width: 100% !important;\n                            display: block !important;\n                        }\n                        #gltf_export_options > div:nth-child(10) {\n                            display: block;\n                            margin-top: 1rem;\n                        }\n                        input:read-only {\n                            cursor: not-allowed;\n                        }\n                    </style>","<h1>Export Settings</h1>"],form:{animations:{label:"Animations",type:"checkbox",value:!0}},onConfirm:function(t){e.export({scale:new THREE.Vector3(t.scaleX,t.scaleY,t.scaleZ),binary:"binary"===t.binary,embedImages:t.embedImages,animations:t.animations}),this.hide()}}).show()}}),Plugin.register("gltf_exporter",{title:"glTF Exporter",author:"Elenterius",icon:"icon-objects",description:"Export Model to glTF Fileformat",version:"1.0.0-alpha.4",variant:"both",onload(){MenuBar.addAction(e.export_action,"file.export"),console.log("glTF Exporter [1.0.0-alpha.4] loaded!")},onunload(){e.export_action.delete(),delete THREE.GLTFExporter}})}()},function(e,t){var r=0,n=1,a=2,i=3,o=4,s=5,l=6,u=5121,c=5123,f=5126,p=5125,h=34962,m=34963,g=9728,d=9729,E=9984,y=9985,T=9986,v=9987,b=33071,x=33648,w=10497,R={};R[THREE.NearestFilter]=g,R[THREE.NearestMipMapNearestFilter]=E,R[THREE.NearestMipMapLinearFilter]=T,R[THREE.LinearFilter]=d,R[THREE.LinearMipMapNearestFilter]=y,R[THREE.LinearMipMapLinearFilter]=v,R[THREE.ClampToEdgeWrapping]=b,R[THREE.RepeatWrapping]=w,R[THREE.MirroredRepeatWrapping]=x;var M={scale:"scale",position:"translation",quaternion:"rotation",morphTargetInfluences:"weights"};THREE.GLTFExporter=function(){},THREE.GLTFExporter.prototype={constructor:THREE.GLTFExporter,parse:function(e,t,g){(g=Object.assign({},{binary:!1,trs:!1,onlyVisible:!0,truncateDrawRange:!0,embedImages:!0,animations:[],forceIndices:!1,forcePowerOfTwoTextures:!1,includeCustomExtensions:!1},g)).animations.length>0&&(g.trs=!0);var d,E={asset:{version:"2.0",generator:"THREE.GLTFExporter"}},y=0,T=[],v=[],b=new Map,x=[],w={},H={meshes:new Map,attributes:new Map,attributesNormalized:new Map,materials:new Map,textures:new Map,images:new Map},L=new Map,A=0;function F(e){return L.has(e)||L.set(e,A++),L.get(e)}function I(e,t){return e.length===t.length&&e.every((function(e,r){return e===t[r]}))}function S(e){return 4*Math.ceil(e/4)}function _(e,t){t=t||0;var r=S(e.byteLength);if(r!==e.byteLength){var n=new Uint8Array(r);if(n.set(new Uint8Array(e)),0!==t)for(var a=e.byteLength;a<r;a++)n[a]=t;return n.buffer}return e}function O(e,t){if(0!==Object.keys(e.userData).length)try{var r=JSON.parse(JSON.stringify(e.userData));if(g.includeCustomExtensions&&r.gltfExtensions){for(var n in void 0===t.extensions&&(t.extensions={}),r.gltfExtensions)t.extensions[n]=r.gltfExtensions[n],w[n]=!0;delete r.gltfExtensions}Object.keys(r).length>0&&(t.extras=r)}catch(t){console.warn("THREE.GLTFExporter: userData of '"+e.name+"' won't be serialized because of JSON.stringify error - "+t.message)}}function N(e,t){var r=!1,n={};0===t.offset.x&&0===t.offset.y||(n.offset=t.offset.toArray(),r=!0),0!==t.rotation&&(n.rotation=t.rotation,r=!0),1===t.repeat.x&&1===t.repeat.y||(n.scale=t.repeat.toArray(),r=!0),r&&(e.extensions=e.extensions||{},e.extensions.KHR_texture_transform=n,w.KHR_texture_transform=!0)}function k(e){return E.buffers||(E.buffers=[{byteLength:0}]),T.push(e),0}function B(e,t,r,n){var a;if(e.array.constructor===Float32Array)a=f;else if(e.array.constructor===Uint32Array)a=p;else if(e.array.constructor===Uint16Array)a=c;else{if(e.array.constructor!==Uint8Array)throw new Error("THREE.GLTFExporter: Unsupported bufferAttribute component type.");a=u}if(void 0===r&&(r=0),void 0===n&&(n=e.count),g.truncateDrawRange&&void 0!==t&&null===t.index){var i=r+n,o=t.drawRange.count===1/0?e.count:t.drawRange.start+t.drawRange.count;r=Math.max(r,t.drawRange.start),(n=Math.min(i,o)-r)<0&&(n=0)}if(0===n)return null;var s,l=function(e,t,r){for(var n={min:new Array(e.itemSize).fill(Number.POSITIVE_INFINITY),max:new Array(e.itemSize).fill(Number.NEGATIVE_INFINITY)},a=t;a<t+r;a++)for(var i=0;i<e.itemSize;i++){var o=e.array[a*e.itemSize+i];n.min[i]=Math.min(n.min[i],o),n.max[i]=Math.max(n.max[i],o)}return n}(e,r,n);void 0!==t&&(s=e===t.index?m:h);var d=function(e,t,r,n,a){var i;E.bufferViews||(E.bufferViews=[]),i=t===u?1:t===c?2:4;for(var o=S(n*e.itemSize*i),s=new DataView(new ArrayBuffer(o)),l=0,m=r;m<r+n;m++)for(var g=0;g<e.itemSize;g++){var d=e.array[m*e.itemSize+g];t===f?s.setFloat32(l,d,!0):t===p?s.setUint32(l,d,!0):t===c?s.setUint16(l,d,!0):t===u&&s.setUint8(l,d),l+=i}var T={buffer:k(s.buffer),byteOffset:y,byteLength:o};return void 0!==a&&(T.target=a),a===h&&(T.byteStride=e.itemSize*i),y+=o,E.bufferViews.push(T),{id:E.bufferViews.length-1,byteLength:0}}(e,a,r,n,s),T={bufferView:d.id,byteOffset:d.byteOffset,componentType:a,count:n,max:l.max,min:l.min,type:{1:"SCALAR",2:"VEC2",3:"VEC3",4:"VEC4",16:"MAT4"}[e.itemSize]};return E.accessors||(E.accessors=[]),E.accessors.push(T),E.accessors.length-1}function G(e,t,r){H.images.has(e)||H.images.set(e,{});var n=H.images.get(e),a=t===THREE.RGBAFormat?"image/png":"image/jpeg",i=a+":flipY/"+r.toString();if(void 0!==n[i])return n[i];E.images||(E.images=[]);var o={mimeType:a};if(g.embedImages){var s=d=d||document.createElement("canvas");s.width=e.width,s.height=e.height,g.forcePowerOfTwoTextures&&!function(e){return THREE.Math.isPowerOfTwo(e.width)&&THREE.Math.isPowerOfTwo(e.height)}(e)&&(console.warn("GLTFExporter: Resized non-power-of-two image.",e),s.width=THREE.Math.floorPowerOfTwo(s.width),s.height=THREE.Math.floorPowerOfTwo(s.height));var l=s.getContext("2d");!0===r&&(l.translate(0,s.height),l.scale(1,-1)),l.drawImage(e,0,0,s.width,s.height),!0===g.binary?v.push(new Promise((function(e){s.toBlob((function(t){(function(e){return E.bufferViews||(E.bufferViews=[]),new Promise((function(t){var r=new window.FileReader;r.readAsArrayBuffer(e),r.onloadend=function(){var e=_(r.result),n={buffer:k(e),byteOffset:y,byteLength:e.byteLength};y+=e.byteLength,E.bufferViews.push(n),t(E.bufferViews.length-1)}}))})(t).then((function(t){o.bufferView=t,e()}))}),a)}))):o.uri=s.toDataURL(a)}else o.uri=e.src;E.images.push(o);var u=E.images.length-1;return n[i]=u,u}function C(e){E.samplers||(E.samplers=[]);var t={magFilter:R[e.magFilter],minFilter:R[e.minFilter],wrapS:R[e.wrapS],wrapT:R[e.wrapT]};return E.samplers.push(t),E.samplers.length-1}function V(e){if(H.textures.has(e))return H.textures.get(e);E.textures||(E.textures=[]);var t={sampler:C(e),source:G(e.image,e.format,e.flipY)};E.textures.push(t);var r=E.textures.length-1;return H.textures.set(e,r),r}function z(e){if(H.materials.has(e))return H.materials.get(e);if(E.materials||(E.materials=[]),e.isShaderMaterial)return console.warn("GLTFExporter: THREE.ShaderMaterial not supported."),null;var t={pbrMetallicRoughness:{}};e.isMeshBasicMaterial?(t.extensions={KHR_materials_unlit:{}},w.KHR_materials_unlit=!0):e.isMeshStandardMaterial||console.warn("GLTFExporter: Use MeshStandardMaterial or MeshBasicMaterial for best results.");var r=e.color.toArray().concat([e.opacity]);if(I(r,[1,1,1,1])||(t.pbrMetallicRoughness.baseColorFactor=r),e.isMeshStandardMaterial?(t.pbrMetallicRoughness.metallicFactor=e.metalness,t.pbrMetallicRoughness.roughnessFactor=e.roughness):e.isMeshBasicMaterial?(t.pbrMetallicRoughness.metallicFactor=0,t.pbrMetallicRoughness.roughnessFactor=.9):(t.pbrMetallicRoughness.metallicFactor=.5,t.pbrMetallicRoughness.roughnessFactor=.5),e.metalnessMap||e.roughnessMap)if(e.metalnessMap===e.roughnessMap){var n={index:V(e.metalnessMap)};N(n,e.metalnessMap),t.pbrMetallicRoughness.metallicRoughnessTexture=n}else console.warn("THREE.GLTFExporter: Ignoring metalnessMap and roughnessMap because they are not the same Texture.");if(e.map){var a={index:V(e.map)};N(a,e.map),t.pbrMetallicRoughness.baseColorTexture=a}if(e.isMeshBasicMaterial||e.isLineBasicMaterial||e.isPointsMaterial);else{var i=e.emissive.clone().multiplyScalar(e.emissiveIntensity).toArray();if(I(i,[0,0,0])||(t.emissiveFactor=i),e.emissiveMap){var o={index:V(e.emissiveMap)};N(o,e.emissiveMap),t.emissiveTexture=o}}if(e.normalMap){var s={index:V(e.normalMap)};-1!==e.normalScale.x&&(e.normalScale.x!==e.normalScale.y&&console.warn("THREE.GLTFExporter: Normal scale components are different, ignoring Y and exporting X."),s.scale=e.normalScale.x),N(s,e.normalMap),t.normalTexture=s}if(e.aoMap){var l={index:V(e.aoMap),texCoord:1};1!==e.aoMapIntensity&&(l.strength=e.aoMapIntensity),N(l,e.aoMap),t.occlusionTexture=l}(e.transparent||e.alphaTest>0)&&(t.alphaMode=e.opacity<1?"BLEND":"MASK",e.alphaTest>0&&.5!==e.alphaTest&&(t.alphaCutoff=e.alphaTest)),e.side===THREE.DoubleSide&&(t.doubleSided=!0),""!==e.name&&(t.name=e.name),O(e,t),E.materials.push(t);var u=E.materials.length-1;return H.materials.set(e,u),u}function D(e){var t=e.geometry.uuid+":"+e.material.uuid;if(H.meshes.has(t))return H.meshes.get(t);var u,c=e.geometry;e.isLineSegments?u=n:e.isLineLoop?u=a:e.isLine?u=i:e.isPoints?u=r:(c.isBufferGeometry||(c=(new THREE.BufferGeometry).fromGeometry(c)),e.drawMode===THREE.TriangleFanDrawMode?(console.warn("GLTFExporter: TriangleFanDrawMode and wireframe incompatible."),u=l):u=e.drawMode===THREE.TriangleStripDrawMode?e.material.wireframe?i:s:e.material.wireframe?n:o);var f={},p={},h=[],m=[],d={uv:"TEXCOORD_0",uv2:"TEXCOORD_1",color:"COLOR_0",skinWeight:"WEIGHTS_0",skinIndex:"JOINTS_0"},y=void 0;try{y=c.getAttribute("normal")}catch(e){if(!(e instanceof TypeError))throw e;console.warn(e)}void 0===y||function(e){if(H.attributesNormalized.has(e))return!1;for(var t=new THREE.Vector3,r=0,n=e.count;r<n;r++)if(Math.abs(t.fromArray(e.array,3*r).length()-1)>5e-4)return!1;return!0}(y)||(console.warn("THREE.GLTFExporter: Creating normalized normal attribute from the non-normalized one."),c.addAttribute("normal",function(e){if(H.attributesNormalized.has(e))return H.attributesNormalized.get(e);for(var t=e.clone(),r=new THREE.Vector3,n=0,a=t.count;n<a;n++)r.fromArray(t.array,3*n),0===r.x&&0===r.y&&0===r.z?r.setX(1):r.normalize(),r.toArray(t.array,3*n);return H.attributesNormalized.set(e,t),t}(y)));var T=null;for(var v in c.attributes)if("morph"!==v.substr(0,5)){var b=c.attributes[v];v=d[v]||v.toUpperCase();if(/^(POSITION|NORMAL|TANGENT|TEXCOORD_\d+|COLOR_\d+|JOINTS_\d+|WEIGHTS_\d+)$/.test(v)||(v="_"+v),H.attributes.has(F(b)))p[v]=H.attributes.get(F(b));else{T=null;var x=b.array;"JOINTS_0"!==v||x instanceof Uint16Array||x instanceof Uint8Array||(console.warn('GLTFExporter: Attribute "skinIndex" converted to type UNSIGNED_SHORT.'),T=new THREE.BufferAttribute(new Uint16Array(x),b.itemSize,b.normalized));var w=B(T||b,c);null!==w&&(p[v]=w,H.attributes.set(F(b),w))}}if(void 0!==y&&c.addAttribute("normal",y),0===Object.keys(p).length)return null;if(void 0!==e.morphTargetInfluences&&e.morphTargetInfluences.length>0){var R=[],M=[],L={};if(void 0!==e.morphTargetDictionary)for(var A in e.morphTargetDictionary)L[e.morphTargetDictionary[A]]=A;for(var I=0;I<e.morphTargetInfluences.length;++I){var S={},_=!1;for(var v in c.morphAttributes)if("position"===v||"normal"===v){b=c.morphAttributes[v][I];var N=v.toUpperCase(),k=c.attributes[v];if(H.attributes.has(F(b)))S[N]=H.attributes.get(F(b));else{for(var G=b.clone(),C=0,V=b.count;C<V;C++)G.setXYZ(C,b.getX(C)-k.getX(C),b.getY(C)-k.getY(C),b.getZ(C)-k.getZ(C));S[N]=B(G,c),H.attributes.set(F(k),S[N])}}else _||(console.warn("GLTFExporter: Only POSITION and NORMAL morph are supported."),_=!0);m.push(S),R.push(e.morphTargetInfluences[I]),void 0!==e.morphTargetDictionary&&M.push(L[I])}f.weights=R,M.length>0&&(f.extras={},f.extras.targetNames=M)}var D=g.forceIndices,P=Array.isArray(e.material);if(P&&0===c.groups.length)return null;!D&&null===c.index&&P&&(console.warn("THREE.GLTFExporter: Creating index for non-indexed multi-material mesh."),D=!0);var U=!1;if(null===c.index&&D){for(var j=[],K=(I=0,c.attributes.position.count);I<K;I++)j[I]=I;c.setIndex(j),U=!0}var X=P?e.material:[e.material],Y=P?c.groups:[{materialIndex:0,start:void 0,count:void 0}];for(I=0,K=Y.length;I<K;I++){var J={mode:u,attributes:p};if(O(c,J),m.length>0&&(J.targets=m),null!==c.index){t=F(c.index);void 0===Y[I].start&&void 0===Y[I].count||(t+=":"+Y[I].start+":"+Y[I].count),H.attributes.has(t)?J.indices=H.attributes.get(t):(J.indices=B(c.index,c,Y[I].start,Y[I].count),H.attributes.set(t,J.indices)),null===J.indices&&delete J.indices}var W=z(X[Y[I].materialIndex]);null!==W&&(J.material=W),h.push(J)}U&&c.setIndex(null),f.primitives=h,E.meshes||(E.meshes=[]),E.meshes.push(f);var Z=E.meshes.length-1;return H.meshes.set(t,Z),Z}function P(e,t){E.animations||(E.animations=[]);for(var r=(e=THREE.GLTFExporter.Utils.mergeMorphTargetTracks(e.clone(),t)).tracks,n=[],a=[],i=0;i<r.length;++i){var o=r[i],s=THREE.PropertyBinding.parseTrackName(o.name),l=THREE.PropertyBinding.findNode(t,s.nodeName),u=M[s.propertyName];if("bones"===s.objectName&&(l=!0===l.isSkinnedMesh?l.skeleton.getBoneByName(s.objectIndex):void 0),!l||!u)return console.warn('THREE.GLTFExporter: Could not export animation track "%s".',o.name),null;var c,f=o.values.length/o.times.length;u===M.morphTargetInfluences&&(f/=l.morphTargetInfluences.length),!0===o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline?(c="CUBICSPLINE",f/=3):c=o.getInterpolation()===THREE.InterpolateDiscrete?"STEP":"LINEAR",a.push({input:B(new THREE.BufferAttribute(o.times,1)),output:B(new THREE.BufferAttribute(o.values,f)),interpolation:c}),n.push({sampler:a.length-1,target:{node:b.get(l),path:u}})}return E.animations.push({name:e.name||"clip_"+E.animations.length,samplers:a,channels:n}),E.animations.length-1}function U(e){var t=E.nodes[b.get(e)],r=e.skeleton,n=e.skeleton.bones[0];if(void 0===n)return null;for(var a=[],i=new Float32Array(16*r.bones.length),o=0;o<r.bones.length;++o)a.push(b.get(r.bones[o])),r.boneInverses[o].toArray(i,16*o);return void 0===E.skins&&(E.skins=[]),E.skins.push({inverseBindMatrices:B(new THREE.BufferAttribute(i,16)),joints:a,skeleton:b.get(n)}),t.skin=E.skins.length-1}function j(e){var t={};e.name&&(t.name=e.name),t.color=e.color.toArray(),t.intensity=e.intensity,e.isDirectionalLight?t.type="directional":e.isPointLight?(t.type="point",e.distance>0&&(t.range=e.distance)):e.isSpotLight&&(t.type="spot",e.distance>0&&(t.range=e.distance),t.spot={},t.spot.innerConeAngle=(e.penumbra-1)*e.angle*-1,t.spot.outerConeAngle=e.angle),void 0!==e.decay&&2!==e.decay&&console.warn("THREE.GLTFExporter: Light decay may be lost. glTF is physically-based, and expects light.decay=2."),!e.target||e.target.parent===e&&0===e.target.position.x&&0===e.target.position.y&&-1===e.target.position.z||console.warn("THREE.GLTFExporter: Light direction may be lost. For best results, make light.target a child of the light with position 0,0,-1.");var r=E.extensions.KHR_lights_punctual.lights;return r.push(t),r.length-1}function K(e){E.nodes||(E.nodes=[]);var t={};if(g.trs){var r=e.quaternion.toArray(),n=e.position.toArray(),a=e.scale.toArray();I(r,[0,0,0,1])||(t.rotation=r),I(n,[0,0,0])||(t.translation=n),I(a,[1,1,1])||(t.scale=a)}else e.matrixAutoUpdate&&e.updateMatrix(),I(e.matrix.elements,[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])||(t.matrix=e.matrix.elements);if(""!==e.name&&(t.name=String(e.name)),O(e,t),e.isMesh||e.isLine||e.isPoints){var i=D(e);null!==i&&(t.mesh=i)}else if(e.isCamera)t.camera=function(e){E.cameras||(E.cameras=[]);var t=e.isOrthographicCamera,r={type:t?"orthographic":"perspective"};return t?r.orthographic={xmag:2*e.right,ymag:2*e.top,zfar:e.far<=0?.001:e.far,znear:e.near<0?0:e.near}:r.perspective={aspectRatio:e.aspect,yfov:THREE.Math.degToRad(e.fov),zfar:e.far<=0?.001:e.far,znear:e.near<0?0:e.near},""!==e.name&&(r.name=e.type),E.cameras.push(r),E.cameras.length-1}(e);else if(e.isDirectionalLight||e.isPointLight||e.isSpotLight)w.KHR_lights_punctual||(E.extensions=E.extensions||{},E.extensions.KHR_lights_punctual={lights:[]},w.KHR_lights_punctual=!0),t.extensions=t.extensions||{},t.extensions.KHR_lights_punctual={light:j(e)};else if(e.isLight)return console.warn("THREE.GLTFExporter: Only directional, point, and spot lights are supported.",e),null;if(e.isSkinnedMesh&&x.push(e),e.children.length>0){for(var o=[],s=0,l=e.children.length;s<l;s++){var u=e.children[s];if(u.visible||!1===g.onlyVisible){var c=K(u);null!==c&&o.push(c)}}o.length>0&&(t.children=o)}E.nodes.push(t);var f=E.nodes.length-1;return b.set(e,f),f}function X(e){E.scenes||(E.scenes=[],E.scene=0);var t={nodes:[]};""!==e.name&&(t.name=e.name),e.userData&&Object.keys(e.userData).length>0&&(t.extras=O(e)),E.scenes.push(t);for(var r=[],n=0,a=e.children.length;n<a;n++){var i=e.children[n];if(i.visible||!1===g.onlyVisible){var o=K(i);null!==o&&r.push(o)}}r.length>0&&(t.nodes=r),O(e,t)}!function(e){e=e instanceof Array?e:[e];for(var t=[],r=0;r<e.length;r++)e[r]instanceof THREE.Scene?X(e[r]):t.push(e[r]);for(t.length>0&&function(e){var t=new THREE.Scene;t.name="AuxScene";for(var r=0;r<e.length;r++)t.children.push(e[r]);X(t)}(t),r=0;r<x.length;++r)U(x[r]);for(r=0;r<g.animations.length;++r)P(g.animations[r],e[0])}(e),Promise.all(v).then((function(){var e=new Blob(T,{type:"application/octet-stream"}),r=Object.keys(w);if(r.length>0&&(E.extensionsUsed=r),E.buffers&&E.buffers.length>0){E.buffers[0].byteLength=e.size;var n=new window.FileReader;if(!0===g.binary){n.readAsArrayBuffer(e),n.onloadend=function(){var e=_(n.result),r=new DataView(new ArrayBuffer(8));r.setUint32(0,e.byteLength,!0),r.setUint32(4,5130562,!0);var a=_(function(e){if(void 0!==window.TextEncoder)return(new TextEncoder).encode(e).buffer;for(var t=new Uint8Array(new ArrayBuffer(e.length)),r=0,n=e.length;r<n;r++){var a=e.charCodeAt(r);t[r]=a>255?32:a}return t.buffer}(JSON.stringify(E)),32),i=new DataView(new ArrayBuffer(8));i.setUint32(0,a.byteLength,!0),i.setUint32(4,1313821514,!0);var o=new ArrayBuffer(12),s=new DataView(o);s.setUint32(0,1179937895,!0),s.setUint32(4,2,!0);var l=12+i.byteLength+a.byteLength+r.byteLength+e.byteLength;s.setUint32(8,l,!0);var u=new Blob([o,i,a,r,e],{type:"application/octet-stream"}),c=new window.FileReader;c.readAsArrayBuffer(u),c.onloadend=function(){t(c.result)}}}else n.readAsDataURL(e),n.onloadend=function(){var e=n.result;E.buffers[0].uri=e,t(E)}}else t(E)}))}},THREE.GLTFExporter.Utils={insertKeyframe:function(e,t){var r,n=e.getValueSize(),a=new e.TimeBufferType(e.times.length+1),i=new e.ValueBufferType(e.values.length+n),o=e.createInterpolant(new e.ValueBufferType(n));if(0===e.times.length){a[0]=t;for(var s=0;s<n;s++)i[s]=0;r=0}else if(t<e.times[0]){if(Math.abs(e.times[0]-t)<.001)return 0;a[0]=t,a.set(e.times,1),i.set(o.evaluate(t),0),i.set(e.values,n),r=0}else if(t>e.times[e.times.length-1]){if(Math.abs(e.times[e.times.length-1]-t)<.001)return e.times.length-1;a[a.length-1]=t,a.set(e.times,0),i.set(e.values,0),i.set(o.evaluate(t),e.values.length),r=a.length-1}else for(s=0;s<e.times.length;s++){if(Math.abs(e.times[s]-t)<.001)return s;if(e.times[s]<t&&e.times[s+1]>t){a.set(e.times.slice(0,s+1),0),a[s+1]=t,a.set(e.times.slice(s+1),s+2),i.set(e.values.slice(0,(s+1)*n),0),i.set(o.evaluate(t),(s+1)*n),i.set(e.values.slice((s+1)*n),(s+2)*n),r=s+1;break}}return e.times=a,e.values=i,r},mergeMorphTargetTracks:function(e,t){for(var r=[],n={},a=e.tracks,i=0;i<a.length;++i){var o=a[i],s=THREE.PropertyBinding.parseTrackName(o.name),l=THREE.PropertyBinding.findNode(t,s.nodeName);if("morphTargetInfluences"===s.propertyName&&void 0!==s.propertyIndex){if(o.createInterpolant!==o.InterpolantFactoryMethodDiscrete&&o.createInterpolant!==o.InterpolantFactoryMethodLinear){if(o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline)throw new Error("THREE.GLTFExporter: Cannot merge tracks with glTF CUBICSPLINE interpolation.");console.warn("THREE.GLTFExporter: Morph target interpolation mode not yet supported. Using LINEAR instead."),(o=o.clone()).setInterpolation(THREE.InterpolateLinear)}var u,c=l.morphTargetInfluences.length,f=l.morphTargetDictionary[s.propertyIndex];if(void 0===f)throw new Error("THREE.GLTFExporter: Morph target name not found: "+s.propertyIndex);if(void 0!==n[l.uuid]){var p=o.createInterpolant(new o.ValueBufferType(1));u=n[l.uuid];for(g=0;g<u.times.length;g++)u.values[g*c+f]=p.evaluate(u.times[g]);for(g=0;g<o.times.length;g++){var h=this.insertKeyframe(u,o.times[g]);u.values[h*c+f]=o.values[g]}}else{for(var m=new((u=o.clone()).ValueBufferType)(c*u.times.length),g=0;g<u.times.length;g++)m[g*c+f]=u.values[g];u.name=".morphTargetInfluences",u.values=m,n[l.uuid]=u,r.push(u)}}else r.push(o)}return e.tracks=r,e}}}]);