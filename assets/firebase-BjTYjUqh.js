var jf=Object.defineProperty;var Gf=(r,t,e)=>t in r?jf(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var g=(r,t,e)=>Gf(r,typeof t!="symbol"?t+"":t,e);const zf=()=>{};var tc={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zl=function(r){const t=[];let e=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?t[e++]=s:s<2048?(t[e++]=s>>6|192,t[e++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.charCodeAt(++n)&1023),t[e++]=s>>18|240,t[e++]=s>>12&63|128,t[e++]=s>>6&63|128,t[e++]=s&63|128):(t[e++]=s>>12|224,t[e++]=s>>6&63|128,t[e++]=s&63|128)}return t},Wf=function(r){const t=[];let e=0,n=0;for(;e<r.length;){const s=r[e++];if(s<128)t[n++]=String.fromCharCode(s);else if(s>191&&s<224){const i=r[e++];t[n++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=r[e++],o=r[e++],u=r[e++],c=((s&7)<<18|(i&63)<<12|(o&63)<<6|u&63)-65536;t[n++]=String.fromCharCode(55296+(c>>10)),t[n++]=String.fromCharCode(56320+(c&1023))}else{const i=r[e++],o=r[e++];t[n++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return t.join("")},th={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,t){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const e=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<r.length;s+=3){const i=r[s],o=s+1<r.length,u=o?r[s+1]:0,c=s+2<r.length,h=c?r[s+2]:0,p=i>>2,_=(i&3)<<4|u>>4;let v=(u&15)<<2|h>>6,N=h&63;c||(N=64,o||(v=64)),n.push(e[p],e[_],e[v],e[N])}return n.join("")},encodeString(r,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(r):this.encodeByteArray(Zl(r),t)},decodeString(r,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(r):Wf(this.decodeStringToByteArray(r,t))},decodeStringToByteArray(r,t){this.init_();const e=t?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<r.length;){const i=e[r.charAt(s++)],u=s<r.length?e[r.charAt(s)]:0;++s;const h=s<r.length?e[r.charAt(s)]:64;++s;const _=s<r.length?e[r.charAt(s)]:64;if(++s,i==null||u==null||h==null||_==null)throw new Kf;const v=i<<2|u>>4;if(n.push(v),h!==64){const N=u<<4&240|h>>2;if(n.push(N),_!==64){const V=h<<6&192|_;n.push(V)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class Kf extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Yf=function(r){const t=Zl(r);return th.encodeByteArray(t,!0)},Oi=function(r){return Yf(r).replace(/\./g,"")},eh=function(r){try{return th.decodeString(r,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qf(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xf=()=>Qf().__FIREBASE_DEFAULTS__,Jf=()=>{if(typeof process>"u"||typeof tc>"u")return;const r=tc.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},Zf=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=r&&eh(r[1]);return t&&JSON.parse(t)},eo=()=>{try{return zf()||Xf()||Jf()||Zf()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},nh=r=>eo()?.emulatorHosts?.[r],td=r=>{const t=nh(r);if(!t)return;const e=t.lastIndexOf(":");if(e<=0||e+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const n=parseInt(t.substring(e+1),10);return t[0]==="["?[t.substring(1,e-1),n]:[t.substring(0,e),n]},rh=()=>eo()?.config,sh=r=>eo()?.[`_${r}`];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ih{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}wrapCallback(t){return(e,n)=>{e?this.reject(e):this.resolve(n),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(e):t(e,n))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ed(r,t){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const e={alg:"none",type:"JWT"},n=t||"demo-project",s=r.iat||0,i=r.sub||r.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${n}`,aud:n,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...r};return[Oi(JSON.stringify(e)),Oi(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function nd(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(jt())}function rd(){const r=eo()?.forceEnvironment;if(r==="node")return!0;if(r==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function sd(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function oh(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function id(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function od(){const r=jt();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function ad(){return!rd()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function ah(){try{return typeof indexedDB=="object"}catch{return!1}}function uh(){return new Promise((r,t)=>{try{let e=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),e||self.indexedDB.deleteDatabase(n),r(!0)},s.onupgradeneeded=()=>{e=!1},s.onerror=()=>{t(s.error?.message||"")}}catch(e){t(e)}})}function ud(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cd="FirebaseError";class Ae extends Error{constructor(t,e,n){super(e),this.code=t,this.customData=n,this.name=cd,Object.setPrototypeOf(this,Ae.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Jn.prototype.create)}}class Jn{constructor(t,e,n){this.service=t,this.serviceName=e,this.errors=n}create(t,...e){const n=e[0]||{},s=`${this.service}/${t}`,i=this.errors[t],o=i?ld(i,n):"Error",u=`${this.serviceName}: ${o} (${s}).`;return new Ae(s,u,n)}}function ld(r,t){return r.replace(hd,(e,n)=>{const s=t[n];return s!=null?String(s):`<${n}?>`})}const hd=/\{\$([^}]+)}/g;function fd(r){for(const t in r)if(Object.prototype.hasOwnProperty.call(r,t))return!1;return!0}function Gn(r,t){if(r===t)return!0;const e=Object.keys(r),n=Object.keys(t);for(const s of e){if(!n.includes(s))return!1;const i=r[s],o=t[s];if(ec(i)&&ec(o)){if(!Gn(i,o))return!1}else if(i!==o)return!1}for(const s of n)if(!e.includes(s))return!1;return!0}function ec(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xs(r){const t=[];for(const[e,n]of Object.entries(r))Array.isArray(n)?n.forEach(s=>{t.push(encodeURIComponent(e)+"="+encodeURIComponent(s))}):t.push(encodeURIComponent(e)+"="+encodeURIComponent(n));return t.length?"&"+t.join("&"):""}function Qr(r){const t={};return r.replace(/^\?/,"").split("&").forEach(n=>{if(n){const[s,i]=n.split("=");t[decodeURIComponent(s)]=decodeURIComponent(i)}}),t}function Xr(r){const t=r.indexOf("?");if(!t)return"";const e=r.indexOf("#",t);return r.substring(t,e>0?e:void 0)}function dd(r,t){const e=new pd(r,t);return e.subscribe.bind(e)}class pd{constructor(t,e){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=e,this.task.then(()=>{t(this)}).catch(n=>{this.error(n)})}next(t){this.forEachObserver(e=>{e.next(t)})}error(t){this.forEachObserver(e=>{e.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,e,n){let s;if(t===void 0&&e===void 0&&n===void 0)throw new Error("Missing Observer.");md(t,["next","error","complete"])?s=t:s={next:t,error:e,complete:n},s.next===void 0&&(s.next=na),s.error===void 0&&(s.error=na),s.complete===void 0&&(s.complete=na);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let e=0;e<this.observers.length;e++)this.sendOne(e,t)}sendOne(t,e){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{e(this.observers[t])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function md(r,t){if(typeof r!="object"||r===null)return!1;for(const e of t)if(e in r&&typeof r[e]=="function")return!0;return!1}function na(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gd=1e3,_d=2,Ed=14400*1e3,yd=.5;function nc(r,t=gd,e=_d){const n=t*Math.pow(e,r),s=Math.round(yd*n*(Math.random()-.5)*2);return Math.min(Ed,n+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rt(r){return r&&r._delegate?r._delegate:r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ls(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function ch(r){return(await fetch(r,{credentials:"include"})).ok}class we{constructor(t,e,n){this.name=t,this.instanceFactory=e,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fn="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Td{constructor(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){const n=new ih;if(this.instancesDeferred.set(e,n),this.isInitialized(e)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:e});s&&n.resolve(s)}catch{}}return this.instancesDeferred.get(e).promise}getImmediate(t){const e=this.normalizeInstanceIdentifier(t?.identifier),n=t?.optional??!1;if(this.isInitialized(e)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:e})}catch(s){if(n)return null;throw s}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(Id(t))try{this.getOrInitializeService({instanceIdentifier:Fn})}catch{}for(const[e,n]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(e);try{const i=this.getOrInitializeService({instanceIdentifier:s});n.resolve(i)}catch{}}}}clearInstance(t=Fn){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...t.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Fn){return this.instances.has(t)}getOptions(t=Fn){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t,n=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:n,options:e});for(const[i,o]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(i);n===u&&o.resolve(s)}return s}onInit(t,e){const n=this.normalizeInstanceIdentifier(e),s=this.onInitCallbacks.get(n)??new Set;s.add(t),this.onInitCallbacks.set(n,s);const i=this.instances.get(n);return i&&t(i,n),()=>{s.delete(t)}}invokeOnInitCallbacks(t,e){const n=this.onInitCallbacks.get(e);if(n)for(const s of n)try{s(t,e)}catch{}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let n=this.instances.get(t);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:wd(t),options:e}),this.instances.set(t,n),this.instancesOptions.set(t,e),this.invokeOnInitCallbacks(n,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,n)}catch{}return n||null}normalizeInstanceIdentifier(t=Fn){return this.component?this.component.multipleInstances?t:Fn:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function wd(r){return r===Fn?void 0:r}function Id(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ad{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new Td(t,this);return this.providers.set(t,e),e}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var it;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(it||(it={}));const vd={debug:it.DEBUG,verbose:it.VERBOSE,info:it.INFO,warn:it.WARN,error:it.ERROR,silent:it.SILENT},Rd=it.INFO,Sd={[it.DEBUG]:"log",[it.VERBOSE]:"log",[it.INFO]:"info",[it.WARN]:"warn",[it.ERROR]:"error"},Cd=(r,t,...e)=>{if(t<r.logLevel)return;const n=new Date().toISOString(),s=Sd[t];if(s)console[s](`[${n}]  ${r.name}:`,...e);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class no{constructor(t){this.name=t,this._logLevel=Rd,this._logHandler=Cd,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in it))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?vd[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,it.DEBUG,...t),this._logHandler(this,it.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,it.VERBOSE,...t),this._logHandler(this,it.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,it.INFO,...t),this._logHandler(this,it.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,it.WARN,...t),this._logHandler(this,it.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,it.ERROR,...t),this._logHandler(this,it.ERROR,...t)}}const Pd=(r,t)=>t.some(e=>r instanceof e);let rc,sc;function bd(){return rc||(rc=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Nd(){return sc||(sc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const lh=new WeakMap,ya=new WeakMap,hh=new WeakMap,ra=new WeakMap,za=new WeakMap;function Od(r){const t=new Promise((e,n)=>{const s=()=>{r.removeEventListener("success",i),r.removeEventListener("error",o)},i=()=>{e(fn(r.result)),s()},o=()=>{n(r.error),s()};r.addEventListener("success",i),r.addEventListener("error",o)});return t.then(e=>{e instanceof IDBCursor&&lh.set(e,r)}).catch(()=>{}),za.set(t,r),t}function kd(r){if(ya.has(r))return;const t=new Promise((e,n)=>{const s=()=>{r.removeEventListener("complete",i),r.removeEventListener("error",o),r.removeEventListener("abort",o)},i=()=>{e(),s()},o=()=>{n(r.error||new DOMException("AbortError","AbortError")),s()};r.addEventListener("complete",i),r.addEventListener("error",o),r.addEventListener("abort",o)});ya.set(r,t)}let Ta={get(r,t,e){if(r instanceof IDBTransaction){if(t==="done")return ya.get(r);if(t==="objectStoreNames")return r.objectStoreNames||hh.get(r);if(t==="store")return e.objectStoreNames[1]?void 0:e.objectStore(e.objectStoreNames[0])}return fn(r[t])},set(r,t,e){return r[t]=e,!0},has(r,t){return r instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in r}};function Vd(r){Ta=r(Ta)}function Dd(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...e){const n=r.call(sa(this),t,...e);return hh.set(n,t.sort?t.sort():[t]),fn(n)}:Nd().includes(r)?function(...t){return r.apply(sa(this),t),fn(lh.get(this))}:function(...t){return fn(r.apply(sa(this),t))}}function xd(r){return typeof r=="function"?Dd(r):(r instanceof IDBTransaction&&kd(r),Pd(r,bd())?new Proxy(r,Ta):r)}function fn(r){if(r instanceof IDBRequest)return Od(r);if(ra.has(r))return ra.get(r);const t=xd(r);return t!==r&&(ra.set(r,t),za.set(t,r)),t}const sa=r=>za.get(r);function fh(r,t,{blocked:e,upgrade:n,blocking:s,terminated:i}={}){const o=indexedDB.open(r,t),u=fn(o);return n&&o.addEventListener("upgradeneeded",c=>{n(fn(o.result),c.oldVersion,c.newVersion,fn(o.transaction),c)}),e&&o.addEventListener("blocked",c=>e(c.oldVersion,c.newVersion,c)),u.then(c=>{i&&c.addEventListener("close",()=>i()),s&&c.addEventListener("versionchange",h=>s(h.oldVersion,h.newVersion,h))}).catch(()=>{}),u}const Ld=["get","getKey","getAll","getAllKeys","count"],Md=["put","add","delete","clear"],ia=new Map;function ic(r,t){if(!(r instanceof IDBDatabase&&!(t in r)&&typeof t=="string"))return;if(ia.get(t))return ia.get(t);const e=t.replace(/FromIndex$/,""),n=t!==e,s=Md.includes(e);if(!(e in(n?IDBIndex:IDBObjectStore).prototype)||!(s||Ld.includes(e)))return;const i=async function(o,...u){const c=this.transaction(o,s?"readwrite":"readonly");let h=c.store;return n&&(h=h.index(u.shift())),(await Promise.all([h[e](...u),s&&c.done]))[0]};return ia.set(t,i),i}Vd(r=>({...r,get:(t,e,n)=>ic(t,e)||r.get(t,e,n),has:(t,e)=>!!ic(t,e)||r.has(t,e)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fd{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(Ud(e)){const n=e.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(e=>e).join(" ")}}function Ud(r){return r.getComponent()?.type==="VERSION"}const wa="@firebase/app",oc="0.15.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const He=new no("@firebase/app"),Bd="@firebase/app-compat",$d="@firebase/analytics-compat",qd="@firebase/analytics",Hd="@firebase/app-check-compat",jd="@firebase/app-check",Gd="@firebase/auth",zd="@firebase/auth-compat",Wd="@firebase/database",Kd="@firebase/data-connect",Yd="@firebase/database-compat",Qd="@firebase/functions",Xd="@firebase/functions-compat",Jd="@firebase/installations",Zd="@firebase/installations-compat",t0="@firebase/messaging",e0="@firebase/messaging-compat",n0="@firebase/performance",r0="@firebase/performance-compat",s0="@firebase/remote-config",i0="@firebase/remote-config-compat",o0="@firebase/storage",a0="@firebase/storage-compat",u0="@firebase/firestore",c0="@firebase/ai",l0="@firebase/firestore-compat",h0="firebase",f0="12.15.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ia="[DEFAULT]",d0={[wa]:"fire-core",[Bd]:"fire-core-compat",[qd]:"fire-analytics",[$d]:"fire-analytics-compat",[jd]:"fire-app-check",[Hd]:"fire-app-check-compat",[Gd]:"fire-auth",[zd]:"fire-auth-compat",[Wd]:"fire-rtdb",[Kd]:"fire-data-connect",[Yd]:"fire-rtdb-compat",[Qd]:"fire-fn",[Xd]:"fire-fn-compat",[Jd]:"fire-iid",[Zd]:"fire-iid-compat",[t0]:"fire-fcm",[e0]:"fire-fcm-compat",[n0]:"fire-perf",[r0]:"fire-perf-compat",[s0]:"fire-rc",[i0]:"fire-rc-compat",[o0]:"fire-gcs",[a0]:"fire-gcs-compat",[u0]:"fire-fst",[l0]:"fire-fst-compat",[c0]:"fire-vertex","fire-js":"fire-js",[h0]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ki=new Map,p0=new Map,Aa=new Map;function ac(r,t){try{r.container.addComponent(t)}catch(e){He.debug(`Component ${t.name} failed to register with FirebaseApp ${r.name}`,e)}}function De(r){const t=r.name;if(Aa.has(t))return He.debug(`There were multiple attempts to register component ${t}.`),!1;Aa.set(t,r);for(const e of ki.values())ac(e,r);for(const e of p0.values())ac(e,r);return!0}function Ms(r,t){const e=r.container.getProvider("heartbeat").getImmediate({optional:!0});return e&&e.triggerHeartbeat(),r.container.getProvider(t)}function ee(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const m0={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},dn=new Jn("app","Firebase",m0);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class g0{constructor(t,e,n){this._isDeleted=!1,this._options={...t},this._config={...e},this._name=e.name,this._automaticDataCollectionEnabled=e.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new we("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw dn.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ar=f0;function _0(r,t={}){let e=r;typeof t!="object"&&(t={name:t});const n={name:Ia,automaticDataCollectionEnabled:!0,...t},s=n.name;if(typeof s!="string"||!s)throw dn.create("bad-app-name",{appName:String(s)});if(e||(e=rh()),!e)throw dn.create("no-options");const i=ki.get(s);if(i){if(Gn(e,i.options)&&Gn(n,i.config))return i;throw dn.create("duplicate-app",{appName:s})}const o=new Ad(s);for(const c of Aa.values())o.addComponent(c);const u=new g0(e,n,o);return ki.set(s,u),u}function dh(r=Ia){const t=ki.get(r);if(!t&&r===Ia&&rh())return _0();if(!t)throw dn.create("no-app",{appName:r});return t}function de(r,t,e){let n=d0[r]??r;e&&(n+=`-${e}`);const s=n.match(/\s|\//),i=t.match(/\s|\//);if(s||i){const o=[`Unable to register library "${n}" with version "${t}":`];s&&o.push(`library name "${n}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${t}" contains illegal characters (whitespace or "/")`),He.warn(o.join(" "));return}De(new we(`${n}-version`,()=>({library:n,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const E0="firebase-heartbeat-database",y0=1,ds="firebase-heartbeat-store";let oa=null;function ph(){return oa||(oa=fh(E0,y0,{upgrade:(r,t)=>{switch(t){case 0:try{r.createObjectStore(ds)}catch(e){console.warn(e)}}}}).catch(r=>{throw dn.create("idb-open",{originalErrorMessage:r.message})})),oa}async function T0(r){try{const e=(await ph()).transaction(ds),n=await e.objectStore(ds).get(mh(r));return await e.done,n}catch(t){if(t instanceof Ae)He.warn(t.message);else{const e=dn.create("idb-get",{originalErrorMessage:t?.message});He.warn(e.message)}}}async function uc(r,t){try{const n=(await ph()).transaction(ds,"readwrite");await n.objectStore(ds).put(t,mh(r)),await n.done}catch(e){if(e instanceof Ae)He.warn(e.message);else{const n=dn.create("idb-set",{originalErrorMessage:e?.message});He.warn(n.message)}}}function mh(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const w0=1024,I0=30;class A0{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new R0(e),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){try{const e=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),n=cc();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===n||this._heartbeatsCache.heartbeats.some(s=>s.date===n))return;if(this._heartbeatsCache.heartbeats.push({date:n,agent:e}),this._heartbeatsCache.heartbeats.length>I0){const s=S0(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(s,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(t){He.warn(t)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=cc(),{heartbeatsToSend:e,unsentEntries:n}=v0(this._heartbeatsCache.heartbeats),s=Oi(JSON.stringify({version:2,heartbeats:e}));return this._heartbeatsCache.lastSentHeartbeatDate=t,n.length>0?(this._heartbeatsCache.heartbeats=n,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return He.warn(t),""}}}function cc(){return new Date().toISOString().substring(0,10)}function v0(r,t=w0){const e=[];let n=r.slice();for(const s of r){const i=e.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),lc(e)>t){i.dates.pop();break}}else if(e.push({agent:s.agent,dates:[s.date]}),lc(e)>t){e.pop();break}n=n.slice(1)}return{heartbeatsToSend:e,unsentEntries:n}}class R0{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return ah()?uh().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await T0(this.app);return e?.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){const n=await this.read();return uc(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){const n=await this.read();return uc(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...t.heartbeats]})}else return}}function lc(r){return Oi(JSON.stringify({version:2,heartbeats:r})).length}function S0(r){if(r.length===0)return-1;let t=0,e=r[0].date;for(let n=1;n<r.length;n++)r[n].date<e&&(e=r[n].date,t=n);return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function C0(r){De(new we("platform-logger",t=>new Fd(t),"PRIVATE")),De(new we("heartbeat",t=>new A0(t),"PRIVATE")),de(wa,oc,r),de(wa,oc,"esm2020"),de("fire-js","")}C0("");function gh(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const P0=gh,_h=new Jn("auth","Firebase",gh());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vi=new no("@firebase/auth");function b0(r,...t){Vi.logLevel<=it.WARN&&Vi.warn(`Auth (${Ar}): ${r}`,...t)}function wi(r,...t){Vi.logLevel<=it.ERROR&&Vi.error(`Auth (${Ar}): ${r}`,...t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function me(r,...t){throw Ka(r,...t)}function Te(r,...t){return Ka(r,...t)}function Wa(r,t,e){const n={...P0(),[t]:e};return new Jn("auth","Firebase",n).create(t,{appName:r.name})}function Pe(r){return Wa(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Eh(r,t,e){const n=e;if(!(t instanceof n))throw n.name!==t.constructor.name&&me(r,"argument-error"),Wa(r,"argument-error",`Type of ${t.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Ka(r,...t){if(typeof r!="string"){const e=t[0],n=[...t.slice(1)];return n[0]&&(n[0].appName=r.name),r._errorFactory.create(e,...n)}return _h.create(r,...t)}function Y(r,t,...e){if(!r)throw Ka(t,...e)}function Ue(r){const t="INTERNAL ASSERTION FAILED: "+r;throw wi(t),new Error(t)}function je(r,t){r||Ue(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function va(){return typeof self<"u"&&self.location?.href||""}function N0(){return hc()==="http:"||hc()==="https:"}function hc(){return typeof self<"u"&&self.location?.protocol||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function O0(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(N0()||oh()||"connection"in navigator)?navigator.onLine:!0}function k0(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fs{constructor(t,e){this.shortDelay=t,this.longDelay=e,je(e>t,"Short delay should be less than long delay!"),this.isMobile=nd()||id()}get(){return O0()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ya(r,t){je(r.emulator,"Emulator should always be set here");const{url:e}=r.emulator;return t?`${e}${t.startsWith("/")?t.slice(1):t}`:e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yh{static initialize(t,e,n){this.fetchImpl=t,e&&(this.headersImpl=e),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ue("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ue("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ue("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V0={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D0=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],x0=new Fs(3e4,6e4);function Pn(r,t){return r.tenantId&&!t.tenantId?{...t,tenantId:r.tenantId}:t}async function bn(r,t,e,n,s={}){return Th(r,s,async()=>{let i={},o={};n&&(t==="GET"?o=n:i={body:JSON.stringify(n)});const u=xs({...o,key:r.config.apiKey}).slice(1),c=await r._getAdditionalHeaders();c["Content-Type"]="application/json",r.languageCode&&(c["X-Firebase-Locale"]=r.languageCode);const h={method:t,headers:c,...i};return sd()||(h.referrerPolicy="strict-origin-when-cross-origin"),r.emulatorConfig&&Ls(r.emulatorConfig.host)&&(h.credentials="include"),yh.fetch()(await wh(r,r.config.apiHost,e,u),h)})}async function Th(r,t,e){r._canInitEmulator=!1;const n={...V0,...t};try{const s=new M0(r),i=await Promise.race([e(),s.promise]);s.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw di(r,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const u=i.ok?o.errorMessage:o.error.message,[c,h]=u.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw di(r,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw di(r,"email-already-in-use",o);if(c==="USER_DISABLED")throw di(r,"user-disabled",o);const p=n[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw Wa(r,p,h);me(r,p)}}catch(s){if(s instanceof Ae)throw s;me(r,"network-request-failed",{message:String(s)})}}async function Us(r,t,e,n,s={}){const i=await bn(r,t,e,n,s);return"mfaPendingCredential"in i&&me(r,"multi-factor-auth-required",{_serverResponse:i}),i}async function wh(r,t,e,n){const s=`${t}${e}?${n}`,i=r,o=i.config.emulator?Ya(r.config,s):`${r.config.apiScheme}://${s}`;return D0.includes(e)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(o).toString():o}function L0(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class M0{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(t){this.auth=t,this.timer=null,this.promise=new Promise((e,n)=>{this.timer=setTimeout(()=>n(Te(this.auth,"network-request-failed")),x0.get())})}}function di(r,t,e){const n={appName:r.name};e.email&&(n.email=e.email),e.phoneNumber&&(n.phoneNumber=e.phoneNumber);const s=Te(r,t,n);return s.customData._tokenResponse=e,s}function fc(r){return r!==void 0&&r.enterprise!==void 0}class F0{constructor(t){if(this.siteKey="",this.recaptchaEnforcementState=[],t.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=t.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=t.recaptchaEnforcementState}getProviderEnforcementState(t){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const e of this.recaptchaEnforcementState)if(e.provider&&e.provider===t)return L0(e.enforcementState);return null}isProviderEnabled(t){return this.getProviderEnforcementState(t)==="ENFORCE"||this.getProviderEnforcementState(t)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function U0(r,t){return bn(r,"GET","/v2/recaptchaConfig",Pn(r,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function B0(r,t){return bn(r,"POST","/v1/accounts:delete",t)}async function Di(r,t){return bn(r,"POST","/v1/accounts:lookup",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ns(r){if(r)try{const t=new Date(Number(r));if(!isNaN(t.getTime()))return t.toUTCString()}catch{}}async function $0(r,t=!1){const e=Rt(r),n=await e.getIdToken(t),s=Qa(n);Y(s&&s.exp&&s.auth_time&&s.iat,e.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,o=i?.sign_in_provider;return{claims:s,token:n,authTime:ns(aa(s.auth_time)),issuedAtTime:ns(aa(s.iat)),expirationTime:ns(aa(s.exp)),signInProvider:o||null,signInSecondFactor:i?.sign_in_second_factor||null}}function aa(r){return Number(r)*1e3}function Qa(r){const[t,e,n]=r.split(".");if(t===void 0||e===void 0||n===void 0)return wi("JWT malformed, contained fewer than 3 sections"),null;try{const s=eh(e);return s?JSON.parse(s):(wi("Failed to decode base64 JWT payload"),null)}catch(s){return wi("Caught error parsing JWT payload as JSON",s?.toString()),null}}function dc(r){const t=Qa(r);return Y(t,"internal-error"),Y(typeof t.exp<"u","internal-error"),Y(typeof t.iat<"u","internal-error"),Number(t.exp)-Number(t.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ps(r,t,e=!1){if(e)return t;try{return await t}catch(n){throw n instanceof Ae&&q0(n)&&r.auth.currentUser===r&&await r.auth.signOut(),n}}function q0({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H0{constructor(t){this.user=t,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(t){if(t){const e=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),e}else{this.errorBackoff=3e4;const n=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,n)}}schedule(t=!1){if(!this.isRunning)return;const e=this.getInterval(t);this.timerId=setTimeout(async()=>{await this.iteration()},e)}async iteration(){try{await this.user.getIdToken(!0)}catch(t){t?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ra{constructor(t,e){this.createdAt=t,this.lastLoginAt=e,this._initializeTime()}_initializeTime(){this.lastSignInTime=ns(this.lastLoginAt),this.creationTime=ns(this.createdAt)}_copy(t){this.createdAt=t.createdAt,this.lastLoginAt=t.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ms(r){const t=r.auth,e=await r.getIdToken(),n=await ps(r,Di(t,{idToken:e}));Y(n?.users.length,t,"internal-error");const s=n.users[0];r._notifyReloadListener(s);const i=s.providerUserInfo?.length?Ih(s.providerUserInfo):[],o=G0(r.providerData,i),u=r.isAnonymous,c=!(r.email&&s.passwordHash)&&!o?.length,h=u?c:!1,p={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new Ra(s.createdAt,s.lastLoginAt),isAnonymous:h};Object.assign(r,p)}async function j0(r){const t=Rt(r);await ms(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function G0(r,t){return[...r.filter(n=>!t.some(s=>s.providerId===n.providerId)),...t]}function Ih(r){return r.map(({providerId:t,...e})=>({providerId:t,uid:e.rawId||"",displayName:e.displayName||null,email:e.email||null,phoneNumber:e.phoneNumber||null,photoURL:e.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function z0(r,t){const e=await Th(r,{},async()=>{const n=xs({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:s,apiKey:i}=r.config,o=await wh(r,s,"/v1/token",`key=${i}`),u=await r._getAdditionalHeaders();u["Content-Type"]="application/x-www-form-urlencoded";const c={method:"POST",headers:u,body:n};return r.emulatorConfig&&Ls(r.emulatorConfig.host)&&(c.credentials="include"),yh.fetch()(o,c)});return{accessToken:e.access_token,expiresIn:e.expires_in,refreshToken:e.refresh_token}}async function W0(r,t){return bn(r,"POST","/v2/accounts:revokeToken",Pn(r,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(t){Y(t.idToken,"internal-error"),Y(typeof t.idToken<"u","internal-error"),Y(typeof t.refreshToken<"u","internal-error");const e="expiresIn"in t&&typeof t.expiresIn<"u"?Number(t.expiresIn):dc(t.idToken);this.updateTokensAndExpiration(t.idToken,t.refreshToken,e)}updateFromIdToken(t){Y(t.length!==0,"internal-error");const e=dc(t);this.updateTokensAndExpiration(t,null,e)}async getToken(t,e=!1){return!e&&this.accessToken&&!this.isExpired?this.accessToken:(Y(this.refreshToken,t,"user-token-expired"),this.refreshToken?(await this.refresh(t,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(t,e){const{accessToken:n,refreshToken:s,expiresIn:i}=await z0(t,e);this.updateTokensAndExpiration(n,s,Number(i))}updateTokensAndExpiration(t,e,n){this.refreshToken=e||null,this.accessToken=t||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(t,e){const{refreshToken:n,accessToken:s,expirationTime:i}=e,o=new cr;return n&&(Y(typeof n=="string","internal-error",{appName:t}),o.refreshToken=n),s&&(Y(typeof s=="string","internal-error",{appName:t}),o.accessToken=s),i&&(Y(typeof i=="number","internal-error",{appName:t}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(t){this.accessToken=t.accessToken,this.refreshToken=t.refreshToken,this.expirationTime=t.expirationTime}_clone(){return Object.assign(new cr,this.toJSON())}_performRefresh(){return Ue("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function en(r,t){Y(typeof r=="string"||typeof r>"u","internal-error",{appName:t})}class ye{constructor({uid:t,auth:e,stsTokenManager:n,...s}){this.providerId="firebase",this.proactiveRefresh=new H0(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=e,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Ra(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(t){const e=await ps(this,this.stsTokenManager.getToken(this.auth,t));return Y(e,this.auth,"internal-error"),this.accessToken!==e&&(this.accessToken=e,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),e}getIdTokenResult(t){return $0(this,t)}reload(){return j0(this)}_assign(t){this!==t&&(Y(this.uid===t.uid,this.auth,"internal-error"),this.displayName=t.displayName,this.photoURL=t.photoURL,this.email=t.email,this.emailVerified=t.emailVerified,this.phoneNumber=t.phoneNumber,this.isAnonymous=t.isAnonymous,this.tenantId=t.tenantId,this.providerData=t.providerData.map(e=>({...e})),this.metadata._copy(t.metadata),this.stsTokenManager._assign(t.stsTokenManager))}_clone(t){const e=new ye({...this,auth:t,stsTokenManager:this.stsTokenManager._clone()});return e.metadata._copy(this.metadata),e}_onReload(t){Y(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=t,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(t){this.reloadListener?this.reloadListener(t):this.reloadUserInfo=t}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(t,e=!1){let n=!1;t.idToken&&t.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(t),n=!0),e&&await ms(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ee(this.auth.app))return Promise.reject(Pe(this.auth));const t=await this.getIdToken();return await ps(this,B0(this.auth,{idToken:t})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(t=>({...t})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(t,e){const n=e.displayName??void 0,s=e.email??void 0,i=e.phoneNumber??void 0,o=e.photoURL??void 0,u=e.tenantId??void 0,c=e._redirectEventId??void 0,h=e.createdAt??void 0,p=e.lastLoginAt??void 0,{uid:_,emailVerified:v,isAnonymous:N,providerData:V,stsTokenManager:M}=e;Y(_&&M,t,"internal-error");const $=cr.fromJSON(this.name,M);Y(typeof _=="string",t,"internal-error"),en(n,t.name),en(s,t.name),Y(typeof v=="boolean",t,"internal-error"),Y(typeof N=="boolean",t,"internal-error"),en(i,t.name),en(o,t.name),en(u,t.name),en(c,t.name),en(h,t.name),en(p,t.name);const J=new ye({uid:_,auth:t,email:s,emailVerified:v,displayName:n,isAnonymous:N,photoURL:o,phoneNumber:i,tenantId:u,stsTokenManager:$,createdAt:h,lastLoginAt:p});return V&&Array.isArray(V)&&(J.providerData=V.map(ut=>({...ut}))),c&&(J._redirectEventId=c),J}static async _fromIdTokenResponse(t,e,n=!1){const s=new cr;s.updateFromServerResponse(e);const i=new ye({uid:e.localId,auth:t,stsTokenManager:s,isAnonymous:n});return await ms(i),i}static async _fromGetAccountInfoResponse(t,e,n){const s=e.users[0];Y(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?Ih(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!i?.length,u=new cr;u.updateFromIdToken(n);const c=new ye({uid:s.localId,auth:t,stsTokenManager:u,isAnonymous:o}),h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Ra(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!i?.length};return Object.assign(c,h),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pc=new Map;function Be(r){je(r instanceof Function,"Expected a class definition");let t=pc.get(r);return t?(je(t instanceof r,"Instance stored in cache mismatched with class"),t):(t=new r,pc.set(r,t),t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ah{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(t,e){this.storage[t]=e}async _get(t){const e=this.storage[t];return e===void 0?null:e}async _remove(t){delete this.storage[t]}_addListener(t,e){}_removeListener(t,e){}}Ah.type="NONE";const mc=Ah;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ii(r,t,e){return`firebase:${r}:${t}:${e}`}class lr{constructor(t,e,n){this.persistence=t,this.auth=e,this.userKey=n;const{config:s,name:i}=this.auth;this.fullUserKey=Ii(this.userKey,s.apiKey,i),this.fullPersistenceKey=Ii("persistence",s.apiKey,i),this.boundEventHandler=e._onStorageEvent.bind(e),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(t){return this.persistence._set(this.fullUserKey,t.toJSON())}async getCurrentUser(){const t=await this.persistence._get(this.fullUserKey);if(!t)return null;if(typeof t=="string"){const e=await Di(this.auth,{idToken:t}).catch(()=>{});return e?ye._fromGetAccountInfoResponse(this.auth,e,t):null}return ye._fromJSON(this.auth,t)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(t){if(this.persistence===t)return;const e=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=t,e)return this.setCurrentUser(e)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(t,e,n="authUser"){if(!e.length)return new lr(Be(mc),t,n);const s=(await Promise.all(e.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let i=s[0]||Be(mc);const o=Ii(n,t.config.apiKey,t.name);let u=null;for(const h of e)try{const p=await h._get(o);if(p){let _;if(typeof p=="string"){const v=await Di(t,{idToken:p}).catch(()=>{});if(!v)break;_=await ye._fromGetAccountInfoResponse(t,v,p)}else _=ye._fromJSON(t,p);h!==i&&(u=_),i=h;break}}catch{}const c=s.filter(h=>h._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new lr(i,t,n):(i=c[0],u&&await i._set(o,u.toJSON()),await Promise.all(e.map(async h=>{if(h!==i)try{await h._remove(o)}catch{}})),new lr(i,t,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gc(r){const t=r.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(Ch(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(vh(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(bh(t))return"Blackberry";if(Nh(t))return"Webos";if(Rh(t))return"Safari";if((t.includes("chrome/")||Sh(t))&&!t.includes("edge/"))return"Chrome";if(Ph(t))return"Android";{const e=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=r.match(e);if(n?.length===2)return n[1]}return"Other"}function vh(r=jt()){return/firefox\//i.test(r)}function Rh(r=jt()){const t=r.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function Sh(r=jt()){return/crios\//i.test(r)}function Ch(r=jt()){return/iemobile/i.test(r)}function Ph(r=jt()){return/android/i.test(r)}function bh(r=jt()){return/blackberry/i.test(r)}function Nh(r=jt()){return/webos/i.test(r)}function Xa(r=jt()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function K0(r=jt()){return Xa(r)&&!!window.navigator?.standalone}function Y0(){return od()&&document.documentMode===10}function Oh(r=jt()){return Xa(r)||Ph(r)||Nh(r)||bh(r)||/windows phone/i.test(r)||Ch(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kh(r,t=[]){let e;switch(r){case"Browser":e=gc(jt());break;case"Worker":e=`${gc(jt())}-${r}`;break;default:e=r}const n=t.length?t.join(","):"FirebaseCore-web";return`${e}/JsCore/${Ar}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q0{constructor(t){this.auth=t,this.queue=[]}pushCallback(t,e){const n=i=>new Promise((o,u)=>{try{const c=t(i);o(c)}catch(c){u(c)}});n.onAbort=e,this.queue.push(n);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(t){if(this.auth.currentUser===t)return;const e=[];try{for(const n of this.queue)await n(t),n.onAbort&&e.push(n.onAbort)}catch(n){e.reverse();for(const s of e)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n?.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function X0(r,t={}){return bn(r,"GET","/v2/passwordPolicy",Pn(r,t))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const J0=6;class Z0{constructor(t){const e=t.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=e.minPasswordLength??J0,e.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=e.maxPasswordLength),e.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=e.containsLowercaseCharacter),e.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=e.containsUppercaseCharacter),e.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=e.containsNumericCharacter),e.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=e.containsNonAlphanumericCharacter),this.enforcementState=t.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=t.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=t.forceUpgradeOnSignin??!1,this.schemaVersion=t.schemaVersion}validatePassword(t){const e={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(t,e),this.validatePasswordCharacterOptions(t,e),e.isValid&&(e.isValid=e.meetsMinPasswordLength??!0),e.isValid&&(e.isValid=e.meetsMaxPasswordLength??!0),e.isValid&&(e.isValid=e.containsLowercaseLetter??!0),e.isValid&&(e.isValid=e.containsUppercaseLetter??!0),e.isValid&&(e.isValid=e.containsNumericCharacter??!0),e.isValid&&(e.isValid=e.containsNonAlphanumericCharacter??!0),e}validatePasswordLengthOptions(t,e){const n=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;n&&(e.meetsMinPasswordLength=t.length>=n),s&&(e.meetsMaxPasswordLength=t.length<=s)}validatePasswordCharacterOptions(t,e){this.updatePasswordCharacterOptionsStatuses(e,!1,!1,!1,!1);let n;for(let s=0;s<t.length;s++)n=t.charAt(s),this.updatePasswordCharacterOptionsStatuses(e,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(t,e,n,s,i){this.customStrengthOptions.containsLowercaseLetter&&(t.containsLowercaseLetter||(t.containsLowercaseLetter=e)),this.customStrengthOptions.containsUppercaseLetter&&(t.containsUppercaseLetter||(t.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(t.containsNumericCharacter||(t.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(t.containsNonAlphanumericCharacter||(t.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tp{constructor(t,e,n,s){this.app=t,this.heartbeatServiceProvider=e,this.appCheckServiceProvider=n,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new _c(this),this.idTokenSubscription=new _c(this),this.beforeStateQueue=new Q0(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=_h,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=t.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(t,e){return e&&(this._popupRedirectResolver=Be(e)),this._initializationPromise=this.queue(async()=>{if(!this._deleted&&(this.persistenceManager=await lr.create(this,t),this._resolvePersistenceManagerAvailable?.(),!this._deleted)){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(e),this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const t=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!t)){if(this.currentUser&&t&&this.currentUser.uid===t.uid){this._currentUser._assign(t),await this.currentUser.getIdToken();return}await this._updateCurrentUser(t,!0)}}async initializeCurrentUserFromIdToken(t){try{const e=await Di(this,{idToken:t}),n=await ye._fromGetAccountInfoResponse(this,e,t);await this.directlySetCurrentUser(n)}catch(e){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",e),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(t){if(ee(this.app)){const i=this.app.settings.authIdToken;return i?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(i).then(o,o))}):this.directlySetCurrentUser(null)}const e=await this.assertedPersistence.getCurrentUser();let n=e,s=!1;if(t&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const i=this.redirectUser?._redirectEventId,o=n?._redirectEventId,u=await this.tryRedirectSignIn(t);(!i||i===o)&&u?.user&&(n=u.user,s=!0)}if(!n)return this.directlySetCurrentUser(null);if(!n._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(n)}catch(i){n=e,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(i))}return n?this.reloadAndSetCurrentUserOrClear(n):this.directlySetCurrentUser(null)}return Y(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===n._redirectEventId?this.directlySetCurrentUser(n):this.reloadAndSetCurrentUserOrClear(n)}async tryRedirectSignIn(t){let e=null;try{e=await this._popupRedirectResolver._completeRedirectFn(this,t,!0)}catch{await this._setRedirectUser(null)}return e}async reloadAndSetCurrentUserOrClear(t){try{await ms(t)}catch(e){if(e?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(t)}useDeviceLanguage(){this.languageCode=k0()}async _delete(){this._deleted=!0}async updateCurrentUser(t){if(ee(this.app))return Promise.reject(Pe(this));const e=t?Rt(t):null;return e&&Y(e.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(e&&e._clone(this))}async _updateCurrentUser(t,e=!1){if(!this._deleted)return t&&Y(this.tenantId===t.tenantId,this,"tenant-id-mismatch"),e||await this.beforeStateQueue.runMiddleware(t),this.queue(async()=>{await this.directlySetCurrentUser(t),this.notifyAuthListeners()})}async signOut(){return ee(this.app)?Promise.reject(Pe(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(t){return ee(this.app)?Promise.reject(Pe(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Be(t))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(t){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const e=this._getPasswordPolicyInternal();return e.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):e.validatePassword(t)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const t=await X0(this),e=new Z0(t);this.tenantId===null?this._projectPasswordPolicy=e:this._tenantPasswordPolicies[this.tenantId]=e}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(t){this._errorFactory=new Jn("auth","Firebase",t())}onAuthStateChanged(t,e,n){return this.registerStateListener(this.authStateSubscription,t,e,n)}beforeAuthStateChanged(t,e){return this.beforeStateQueue.pushCallback(t,e)}onIdTokenChanged(t,e,n){return this.registerStateListener(this.idTokenSubscription,t,e,n)}authStateReady(){return new Promise((t,e)=>{if(this.currentUser)t();else{const n=this.onAuthStateChanged(()=>{n(),t()},e)}})}async revokeAccessToken(t){if(this.currentUser){const e=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:t,idToken:e};this.tenantId!=null&&(n.tenantId=this.tenantId),await W0(this,n)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(t,e){const n=await this.getOrInitRedirectPersistenceManager(e);return t===null?n.removeCurrentUser():n.setCurrentUser(t)}async getOrInitRedirectPersistenceManager(t){if(!this.redirectPersistenceManager){const e=t&&Be(t)||this._popupRedirectResolver;Y(e,this,"argument-error"),this.redirectPersistenceManager=await lr.create(this,[Be(e._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(t){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===t?this._currentUser:this.redirectUser?._redirectEventId===t?this.redirectUser:null}async _persistUserIfCurrent(t){if(t===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(t))}_notifyListenersIfCurrent(t){t===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const t=this.currentUser?.uid??null;this.lastNotifiedUid!==t&&(this.lastNotifiedUid=t,this.authStateSubscription.next(this.currentUser))}registerStateListener(t,e,n,s){if(this._deleted)return()=>{};const i=typeof e=="function"?e:e.next.bind(e);let o=!1;const u=this._isInitialized?Promise.resolve():this._initializationPromise;if(Y(u,this,"internal-error"),u.then(()=>{o||i(this.currentUser)}),typeof e=="function"){const c=t.addObserver(e,n,s);return()=>{o=!0,c()}}else{const c=t.addObserver(e);return()=>{o=!0,c()}}}async directlySetCurrentUser(t){this.currentUser&&this.currentUser!==t&&this._currentUser._stopProactiveRefresh(),t&&this.isProactiveRefreshEnabled&&t._startProactiveRefresh(),this.currentUser=t,t?await this.assertedPersistence.setCurrentUser(t):await this.assertedPersistence.removeCurrentUser()}queue(t){return this.operations=this.operations.then(t,t),this.operations}get assertedPersistence(){return Y(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(t){!t||this.frameworks.includes(t)||(this.frameworks.push(t),this.frameworks.sort(),this.clientVersion=kh(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const e=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();e&&(t["X-Firebase-Client"]=e);const n=await this._getAppCheckToken();return n&&(t["X-Firebase-AppCheck"]=n),t}async _getAppCheckToken(){if(ee(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return t?.error&&b0(`Error while retrieving App Check token: ${t.error}`),t?.token}}function Ke(r){return Rt(r)}class _c{constructor(t){this.auth=t,this.observer=null,this.addObserver=dd(e=>this.observer=e)}get next(){return Y(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ro={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function ep(r){ro=r}function Vh(r){return ro.loadJS(r)}function np(){return ro.recaptchaEnterpriseScript}function rp(){return ro.gapiScript}function sp(r){return`__${r}${Math.floor(Math.random()*1e6)}`}class ip{constructor(){this.enterprise=new op}ready(t){t()}execute(t,e){return Promise.resolve("token")}render(t,e){return""}}class op{ready(t){t()}execute(t,e){return Promise.resolve("token")}render(t,e){return""}}const ap="recaptcha-enterprise",Dh="NO_RECAPTCHA",Ec="onFirebaseAuthREInstanceReady";class rn{constructor(t){this.type=ap,this.auth=Ke(t)}async verify(t="verify",e=!1){async function n(i){if(!e){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,u)=>{U0(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)u(new Error("recaptcha Enterprise site key undefined"));else{const h=new F0(c);return i.tenantId==null?i._agentRecaptchaConfig=h:i._tenantRecaptchaConfigs[i.tenantId]=h,o(h.siteKey)}}).catch(c=>{u(c)})})}function s(i,o,u){const c=window.grecaptcha;fc(c)?c.enterprise.ready(()=>{c.enterprise.execute(i,{action:t}).then(h=>{o(h)}).catch(()=>{o(Dh)})}):u(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new ip().execute("siteKey",{action:"verify"}):new Promise((i,o)=>{n(this.auth).then(async u=>{if(!e&&fc(window.grecaptcha)&&rn.scriptInjectionDeferred)await rn.scriptInjectionDeferred.promise,s(u,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let c=np();c.length!==0&&(c+=u+`&onload=${Ec}`),rn.scriptInjectionDeferred=new ih,window[Ec]=()=>{rn.scriptInjectionDeferred?.resolve()},Vh(c).then(()=>rn.scriptInjectionDeferred?.promise).then(()=>{s(u,i,o)}).catch(h=>{o(h)})}}).catch(u=>{o(u)})})}}rn.scriptInjectionDeferred=null;async function yc(r,t,e,n=!1,s=!1){const i=new rn(r);let o;if(s)o=Dh;else try{o=await i.verify(e)}catch{o=await i.verify(e,!0)}const u={...t};if(e==="mfaSmsEnrollment"||e==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in u){const c=u.phoneEnrollmentInfo.phoneNumber,h=u.phoneEnrollmentInfo.recaptchaToken;Object.assign(u,{phoneEnrollmentInfo:{phoneNumber:c,recaptchaToken:h,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in u){const c=u.phoneSignInInfo.recaptchaToken;Object.assign(u,{phoneSignInInfo:{recaptchaToken:c,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return u}return n?Object.assign(u,{captchaResp:o}):Object.assign(u,{captchaResponse:o}),Object.assign(u,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(u,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),u}async function Sa(r,t,e,n,s){if(r._getRecaptchaConfig()?.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await yc(r,t,e,e==="getOobCode");return n(r,i)}else return n(r,t).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${e} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await yc(r,t,e,e==="getOobCode");return n(r,o)}else return Promise.reject(i)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function up(r,t){const e=Ms(r,"auth");if(e.isInitialized()){const s=e.getImmediate(),i=e.getOptions();if(Gn(i,t??{}))return s;me(s,"already-initialized")}return e.initialize({options:t})}function cp(r,t){const e=t?.persistence||[],n=(Array.isArray(e)?e:[e]).map(Be);t?.errorMap&&r._updateErrorMap(t.errorMap),r._initializeWithPersistence(n,t?.popupRedirectResolver)}function lp(r,t,e){const n=Ke(r);Y(/^https?:\/\//.test(t),n,"invalid-emulator-scheme");const s=!1,i=xh(t),{host:o,port:u}=hp(t),c=u===null?"":`:${u}`,h={url:`${i}//${o}${c}/`},p=Object.freeze({host:o,port:u,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!n._canInitEmulator){Y(n.config.emulator&&n.emulatorConfig,n,"emulator-config-failed"),Y(Gn(h,n.config.emulator)&&Gn(p,n.emulatorConfig),n,"emulator-config-failed");return}n.config.emulator=h,n.emulatorConfig=p,n.settings.appVerificationDisabledForTesting=!0,Ls(o)?ch(`${i}//${o}${c}`):fp()}function xh(r){const t=r.indexOf(":");return t<0?"":r.substr(0,t+1)}function hp(r){const t=xh(r),e=/(\/\/)?([^?#/]+)/.exec(r.substr(t.length));if(!e)return{host:"",port:null};const n=e[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(n);if(s){const i=s[1];return{host:i,port:Tc(n.substr(i.length+1))}}else{const[i,o]=n.split(":");return{host:i,port:Tc(o)}}}function Tc(r){if(!r)return null;const t=Number(r);return isNaN(t)?null:t}function fp(){function r(){const t=document.createElement("p"),e=t.style;t.innerText="Running in emulator mode. Do not use with production credentials.",e.position="fixed",e.width="100%",e.backgroundColor="#ffffff",e.border=".1em solid #000000",e.color="#b50000",e.bottom="0px",e.left="0px",e.margin="0px",e.zIndex="10000",e.textAlign="center",t.classList.add("firebase-emulator-warning"),document.body.appendChild(t)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ja{constructor(t,e){this.providerId=t,this.signInMethod=e}toJSON(){return Ue("not implemented")}_getIdTokenResponse(t){return Ue("not implemented")}_linkToIdToken(t,e){return Ue("not implemented")}_getReauthenticationResolver(t){return Ue("not implemented")}}async function dp(r,t){return bn(r,"POST","/v1/accounts:signUp",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pp(r,t){return Us(r,"POST","/v1/accounts:signInWithPassword",Pn(r,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mp(r,t){return Us(r,"POST","/v1/accounts:signInWithEmailLink",Pn(r,t))}async function gp(r,t){return Us(r,"POST","/v1/accounts:signInWithEmailLink",Pn(r,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gs extends Ja{constructor(t,e,n,s=null){super("password",n),this._email=t,this._password=e,this._tenantId=s}static _fromEmailAndPassword(t,e){return new gs(t,e,"password")}static _fromEmailAndCode(t,e,n=null){return new gs(t,e,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(t){const e=typeof t=="string"?JSON.parse(t):t;if(e?.email&&e?.password){if(e.signInMethod==="password")return this._fromEmailAndPassword(e.email,e.password);if(e.signInMethod==="emailLink")return this._fromEmailAndCode(e.email,e.password,e.tenantId)}return null}async _getIdTokenResponse(t){switch(this.signInMethod){case"password":const e={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Sa(t,e,"signInWithPassword",pp);case"emailLink":return mp(t,{email:this._email,oobCode:this._password});default:me(t,"internal-error")}}async _linkToIdToken(t,e){switch(this.signInMethod){case"password":const n={idToken:e,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Sa(t,n,"signUpPassword",dp);case"emailLink":return gp(t,{idToken:e,email:this._email,oobCode:this._password});default:me(t,"internal-error")}}_getReauthenticationResolver(t){return this._getIdTokenResponse(t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hr(r,t){return Us(r,"POST","/v1/accounts:signInWithIdp",Pn(r,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _p="http://localhost";class zn extends Ja{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(t){const e=new zn(t.providerId,t.signInMethod);return t.idToken||t.accessToken?(t.idToken&&(e.idToken=t.idToken),t.accessToken&&(e.accessToken=t.accessToken),t.nonce&&!t.pendingToken&&(e.nonce=t.nonce),t.pendingToken&&(e.pendingToken=t.pendingToken)):t.oauthToken&&t.oauthTokenSecret?(e.accessToken=t.oauthToken,e.secret=t.oauthTokenSecret):me("argument-error"),e}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(t){const e=typeof t=="string"?JSON.parse(t):t,{providerId:n,signInMethod:s,...i}=e;if(!n||!s)return null;const o=new zn(n,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(t){const e=this.buildRequest();return hr(t,e)}_linkToIdToken(t,e){const n=this.buildRequest();return n.idToken=e,hr(t,n)}_getReauthenticationResolver(t){const e=this.buildRequest();return e.autoCreate=!1,hr(t,e)}buildRequest(){const t={requestUri:_p,returnSecureToken:!0};if(this.pendingToken)t.pendingToken=this.pendingToken;else{const e={};this.idToken&&(e.id_token=this.idToken),this.accessToken&&(e.access_token=this.accessToken),this.secret&&(e.oauth_token_secret=this.secret),e.providerId=this.providerId,this.nonce&&!this.pendingToken&&(e.nonce=this.nonce),t.postBody=xs(e)}return t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ep(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function yp(r){const t=Qr(Xr(r)).link,e=t?Qr(Xr(t)).deep_link_id:null,n=Qr(Xr(r)).deep_link_id;return(n?Qr(Xr(n)).link:null)||n||e||t||r}class Za{constructor(t){const e=Qr(Xr(t)),n=e.apiKey??null,s=e.oobCode??null,i=Ep(e.mode??null);Y(n&&s&&i,"argument-error"),this.apiKey=n,this.operation=i,this.code=s,this.continueUrl=e.continueUrl??null,this.languageCode=e.lang??null,this.tenantId=e.tenantId??null}static parseLink(t){const e=yp(t);try{return new Za(e)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vr{constructor(){this.providerId=vr.PROVIDER_ID}static credential(t,e){return gs._fromEmailAndPassword(t,e)}static credentialWithLink(t,e){const n=Za.parseLink(e);return Y(n,"argument-error"),gs._fromEmailAndCode(t,n.code,n.tenantId)}}vr.PROVIDER_ID="password";vr.EMAIL_PASSWORD_SIGN_IN_METHOD="password";vr.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class so{constructor(t){this.providerId=t,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(t){this.defaultLanguageCode=t}setCustomParameters(t){return this.customParameters=t,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bs extends so{constructor(){super(...arguments),this.scopes=[]}addScope(t){return this.scopes.includes(t)||this.scopes.push(t),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sn extends Bs{constructor(){super("facebook.com")}static credential(t){return zn._fromParams({providerId:sn.PROVIDER_ID,signInMethod:sn.FACEBOOK_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return sn.credentialFromTaggedObject(t)}static credentialFromError(t){return sn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return sn.credential(t.oauthAccessToken)}catch{return null}}}sn.FACEBOOK_SIGN_IN_METHOD="facebook.com";sn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class on extends Bs{constructor(){super("google.com"),this.addScope("profile")}static credential(t,e){return zn._fromParams({providerId:on.PROVIDER_ID,signInMethod:on.GOOGLE_SIGN_IN_METHOD,idToken:t,accessToken:e})}static credentialFromResult(t){return on.credentialFromTaggedObject(t)}static credentialFromError(t){return on.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthIdToken:e,oauthAccessToken:n}=t;if(!e&&!n)return null;try{return on.credential(e,n)}catch{return null}}}on.GOOGLE_SIGN_IN_METHOD="google.com";on.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class an extends Bs{constructor(){super("github.com")}static credential(t){return zn._fromParams({providerId:an.PROVIDER_ID,signInMethod:an.GITHUB_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return an.credentialFromTaggedObject(t)}static credentialFromError(t){return an.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return an.credential(t.oauthAccessToken)}catch{return null}}}an.GITHUB_SIGN_IN_METHOD="github.com";an.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class un extends Bs{constructor(){super("twitter.com")}static credential(t,e){return zn._fromParams({providerId:un.PROVIDER_ID,signInMethod:un.TWITTER_SIGN_IN_METHOD,oauthToken:t,oauthTokenSecret:e})}static credentialFromResult(t){return un.credentialFromTaggedObject(t)}static credentialFromError(t){return un.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthAccessToken:e,oauthTokenSecret:n}=t;if(!e||!n)return null;try{return un.credential(e,n)}catch{return null}}}un.TWITTER_SIGN_IN_METHOD="twitter.com";un.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Lh(r,t){return Us(r,"POST","/v1/accounts:signUp",Pn(r,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ge{constructor(t){this.user=t.user,this.providerId=t.providerId,this._tokenResponse=t._tokenResponse,this.operationType=t.operationType}static async _fromIdTokenResponse(t,e,n,s=!1){const i=await ye._fromIdTokenResponse(t,n,s),o=wc(n);return new Ge({user:i,providerId:o,_tokenResponse:n,operationType:e})}static async _forOperation(t,e,n){await t._updateTokensIfNecessary(n,!0);const s=wc(n);return new Ge({user:t,providerId:s,_tokenResponse:n,operationType:e})}}function wc(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function g5(r){if(ee(r.app))return Promise.reject(Pe(r));const t=Ke(r);if(await t._initializationPromise,t.currentUser?.isAnonymous)return new Ge({user:t.currentUser,providerId:null,operationType:"signIn"});const e=await Lh(t,{returnSecureToken:!0}),n=await Ge._fromIdTokenResponse(t,"signIn",e,!0);return await t._updateCurrentUser(n.user),n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xi extends Ae{constructor(t,e,n,s){super(e.code,e.message),this.operationType=n,this.user=s,Object.setPrototypeOf(this,xi.prototype),this.customData={appName:t.name,tenantId:t.tenantId??void 0,_serverResponse:e.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(t,e,n,s){return new xi(t,e,n,s)}}function Mh(r,t,e,n){return(t==="reauthenticate"?e._getReauthenticationResolver(r):e._getIdTokenResponse(r)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?xi._fromErrorAndOperation(r,i,t,n):i})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tp(r){return new Set(r.map(({providerId:t})=>t).filter(t=>!!t))}async function Fh(r,t,e=!1){const n=await ps(r,t._linkToIdToken(r.auth,await r.getIdToken()),e);return Ge._forOperation(r,"link",n)}async function wp(r,t,e){await ms(t);const n=Tp(t.providerData);Y(n.has(e)===r,t.auth,"provider-already-linked")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ip(r,t,e=!1){const{auth:n}=r;if(ee(n.app))return Promise.reject(Pe(n));const s="reauthenticate";try{const i=await ps(r,Mh(n,s,t,r),e);Y(i.idToken,n,"internal-error");const o=Qa(i.idToken);Y(o,n,"internal-error");const{sub:u}=o;return Y(r.uid===u,n,"user-mismatch"),Ge._forOperation(r,s,i)}catch(i){throw i?.code==="auth/user-not-found"&&me(n,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Uh(r,t,e=!1){if(ee(r.app))return Promise.reject(Pe(r));const n="signIn",s=await Mh(r,n,t),i=await Ge._fromIdTokenResponse(r,n,s);return e||await r._updateCurrentUser(i.user),i}async function Ap(r,t){return Uh(Ke(r),t)}async function _5(r,t){const e=Rt(r);return await wp(!1,e,t.providerId),Fh(e,t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bh(r){const t=Ke(r);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}async function E5(r,t,e){if(ee(r.app))return Promise.reject(Pe(r));const n=Ke(r),o=await Sa(n,{returnSecureToken:!0,email:t,password:e,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Lh).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&Bh(r),c}),u=await Ge._fromIdTokenResponse(n,"signIn",o);return await n._updateCurrentUser(u.user),u}function y5(r,t,e){return ee(r.app)?Promise.reject(Pe(r)):Ap(Rt(r),vr.credential(t,e)).catch(async n=>{throw n.code==="auth/password-does-not-meet-requirements"&&Bh(r),n})}function vp(r,t,e,n){return Rt(r).onIdTokenChanged(t,e,n)}function Rp(r,t,e){return Rt(r).beforeAuthStateChanged(t,e)}function T5(r,t,e,n){return Rt(r).onAuthStateChanged(t,e,n)}function w5(r){return Rt(r).signOut()}const Li="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $h{constructor(t,e){this.storageRetriever=t,this.type=e}_isAvailable(){try{return this.storage?(this.storage.setItem(Li,"1"),this.storage.removeItem(Li),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(t,e){return this.storage.setItem(t,JSON.stringify(e)),Promise.resolve()}_get(t){const e=this.storage.getItem(t);return Promise.resolve(e?JSON.parse(e):null)}_remove(t){return this.storage.removeItem(t),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sp=1e3,Cp=10;class qh extends $h{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(t,e)=>this.onStorageEvent(t,e),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Oh(),this._shouldAllowMigration=!0}forAllChangedKeys(t){for(const e of Object.keys(this.listeners)){const n=this.storage.getItem(e),s=this.localCache[e];n!==s&&t(e,s,n)}}onStorageEvent(t,e=!1){if(!t.key){this.forAllChangedKeys((o,u,c)=>{this.notifyListeners(o,c)});return}const n=t.key;e?this.detachListener():this.stopPolling();const s=()=>{const o=this.storage.getItem(n);!e&&this.localCache[n]===o||this.notifyListeners(n,o)},i=this.storage.getItem(n);Y0()&&i!==t.newValue&&t.newValue!==t.oldValue?setTimeout(s,Cp):s()}notifyListeners(t,e){this.localCache[t]=e;const n=this.listeners[t];if(n)for(const s of Array.from(n))s(e&&JSON.parse(e))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((t,e,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:t,oldValue:e,newValue:n}),!0)})},Sp)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(t,e){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[t]||(this.listeners[t]=new Set,this.localCache[t]=this.storage.getItem(t)),this.listeners[t].add(e)}_removeListener(t,e){this.listeners[t]&&(this.listeners[t].delete(e),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(t,e){await super._set(t,e),this.localCache[t]=JSON.stringify(e)}async _get(t){const e=await super._get(t);return this.localCache[t]=JSON.stringify(e),e}async _remove(t){await super._remove(t),delete this.localCache[t]}}qh.type="LOCAL";const Pp=qh;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hh extends $h{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(t,e){}_removeListener(t,e){}}Hh.type="SESSION";const jh=Hh;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bp(r){return Promise.all(r.map(async t=>{try{return{fulfilled:!0,value:await t}}catch(e){return{fulfilled:!1,reason:e}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class io{constructor(t){this.eventTarget=t,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(t){const e=this.receivers.find(s=>s.isListeningto(t));if(e)return e;const n=new io(t);return this.receivers.push(n),n}isListeningto(t){return this.eventTarget===t}async handleEvent(t){const e=t,{eventId:n,eventType:s,data:i}=e.data,o=this.handlersMap[s];if(!o?.size)return;e.ports[0].postMessage({status:"ack",eventId:n,eventType:s});const u=Array.from(o).map(async h=>h(e.origin,i)),c=await bp(u);e.ports[0].postMessage({status:"done",eventId:n,eventType:s,response:c})}_subscribe(t,e){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[t]||(this.handlersMap[t]=new Set),this.handlersMap[t].add(e)}_unsubscribe(t,e){this.handlersMap[t]&&e&&this.handlersMap[t].delete(e),(!e||this.handlersMap[t].size===0)&&delete this.handlersMap[t],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}io.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function t1(r="",t=10){let e="";for(let n=0;n<t;n++)e+=Math.floor(Math.random()*10);return r+e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Np{constructor(t){this.target=t,this.handlers=new Set}removeMessageHandler(t){t.messageChannel&&(t.messageChannel.port1.removeEventListener("message",t.onMessage),t.messageChannel.port1.close()),this.handlers.delete(t)}async _send(t,e,n=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((u,c)=>{const h=t1("",20);s.port1.start();const p=setTimeout(()=>{c(new Error("unsupported_event"))},n);o={messageChannel:s,onMessage(_){const v=_;if(v.data.eventId===h)switch(v.data.status){case"ack":clearTimeout(p),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),u(v.data.response);break;default:clearTimeout(p),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:t,eventId:h,data:e},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function be(){return window}function Op(r){be().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gh(){return typeof be().WorkerGlobalScope<"u"&&typeof be().importScripts=="function"}async function kp(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Vp(){return navigator?.serviceWorker?.controller||null}function Dp(){return Gh()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zh="firebaseLocalStorageDb",xp=1,Mi="firebaseLocalStorage",Wh="fbase_key";class $s{constructor(t){this.request=t}toPromise(){return new Promise((t,e)=>{this.request.addEventListener("success",()=>{t(this.request.result)}),this.request.addEventListener("error",()=>{e(this.request.error)})})}}function oo(r,t){return r.transaction([Mi],t?"readwrite":"readonly").objectStore(Mi)}function Lp(){const r=indexedDB.deleteDatabase(zh);return new $s(r).toPromise()}function Kh(){const r=indexedDB.open(zh,xp);return new Promise((t,e)=>{r.addEventListener("error",()=>{e(r.error)}),r.addEventListener("upgradeneeded",()=>{const n=r.result;try{n.createObjectStore(Mi,{keyPath:Wh})}catch(s){e(s)}}),r.addEventListener("success",async()=>{const n=r.result;n.objectStoreNames.contains(Mi)?t(n):(n.close(),await Lp(),t(await Kh()))})})}async function Ic(r,t,e){const n=oo(r,!0).put({[Wh]:t,value:e});return new $s(n).toPromise()}async function Mp(r,t){const e=oo(r,!1).get(t),n=await new $s(e).toPromise();return n===void 0?null:n.value}function Ac(r,t){const e=oo(r,!0).delete(t);return new $s(e).toPromise()}const Fp=800,Up=3;class Yh{constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=Kh(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(t){let e=0;for(;;)try{const n=await this._openDb();return await t(n)}catch(n){if(e++>Up)throw n;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return Gh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=io._getInstance(Dp()),this.receiver._subscribe("keyChanged",async(t,e)=>({keyProcessed:(await this._poll()).includes(e.key)})),this.receiver._subscribe("ping",async(t,e)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await kp(),!this.activeServiceWorker)return;this.sender=new Np(this.activeServiceWorker);const t=await this.sender._send("ping",{},800);t&&t[0]?.fulfilled&&t[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(t){if(!(!this.sender||!this.activeServiceWorker||Vp()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:t},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async t=>{await Ic(t,Li,"1"),await Ac(t,Li)}),!0):!1}catch{}return!1}async _withPendingWrite(t){this.pendingWrites++;try{await t()}finally{this.pendingWrites--}}async _set(t,e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Ic(n,t,e)),this.localCache[t]=e,this.notifyServiceWorker(t)))}async _get(t){const e=await this._withRetries(n=>Mp(n,t));return this.localCache[t]=e,e}async _remove(t){return this._withPendingWrite(async()=>(await this._withRetries(e=>Ac(e,t)),delete this.localCache[t],this.notifyServiceWorker(t)))}async _poll(){const t=await this._withRetries(s=>{const i=oo(s,!1).getAll();return new $s(i).toPromise()});if(!t)return[];if(this.pendingWrites!==0)return[];const e=[],n=new Set;if(t.length!==0)for(const{fbase_key:s,value:i}of t)n.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),e.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!n.has(s)&&(this.notifyListeners(s,null),e.push(s));return e}notifyListeners(t,e){this.localCache[t]=e;const n=this.listeners[t];if(n)for(const s of Array.from(n))s(e)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Fp)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(t,e){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[t]||(this.listeners[t]=new Set,this._get(t)),this.listeners[t].add(e)}_removeListener(t,e){this.listeners[t]&&(this.listeners[t].delete(e),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Yh.type="LOCAL";const Bp=Yh;new Fs(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function e1(r,t){return t?Be(t):(Y(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n1 extends Ja{constructor(t){super("custom","custom"),this.params=t}_getIdTokenResponse(t){return hr(t,this._buildIdpRequest())}_linkToIdToken(t,e){return hr(t,this._buildIdpRequest(e))}_getReauthenticationResolver(t){return hr(t,this._buildIdpRequest())}_buildIdpRequest(t){const e={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return t&&(e.idToken=t),e}}function $p(r){return Uh(r.auth,new n1(r),r.bypassAuthState)}function qp(r){const{auth:t,user:e}=r;return Y(e,t,"internal-error"),Ip(e,new n1(r),r.bypassAuthState)}async function Hp(r){const{auth:t,user:e}=r;return Y(e,t,"internal-error"),Fh(e,new n1(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qh{constructor(t,e,n,s,i=!1){this.auth=t,this.resolver=n,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(e)?e:[e]}execute(){return new Promise(async(t,e)=>{this.pendingPromise={resolve:t,reject:e};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(t){const{urlResponse:e,sessionId:n,postBody:s,tenantId:i,error:o,type:u}=t;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:e,sessionId:n,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(u)(c))}catch(h){this.reject(h)}}onError(t){this.reject(t)}getIdpTask(t){switch(t){case"signInViaPopup":case"signInViaRedirect":return $p;case"linkViaPopup":case"linkViaRedirect":return Hp;case"reauthViaPopup":case"reauthViaRedirect":return qp;default:me(this.auth,"internal-error")}}resolve(t){je(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(t),this.unregisterAndCleanUp()}reject(t){je(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(t),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jp=new Fs(2e3,1e4);async function I5(r,t,e){if(ee(r.app))return Promise.reject(Te(r,"operation-not-supported-in-this-environment"));const n=Ke(r);Eh(r,t,so);const s=e1(n,e);return new hn(n,"signInViaPopup",t,s).executeNotNull()}async function A5(r,t,e){const n=Rt(r);Eh(n.auth,t,so);const s=e1(n.auth,e);return new hn(n.auth,"linkViaPopup",t,s,n).executeNotNull()}class hn extends Qh{constructor(t,e,n,s,i){super(t,e,s,i),this.provider=n,this.authWindow=null,this.pollId=null,hn.currentPopupAction&&hn.currentPopupAction.cancel(),hn.currentPopupAction=this}async executeNotNull(){const t=await this.execute();return Y(t,this.auth,"internal-error"),t}async onExecution(){je(this.filter.length===1,"Popup operations only handle one event");const t=t1();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],t),this.authWindow.associatedEvent=t,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(Te(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(Te(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,hn.currentPopupAction=null}pollUserCancellation(){const t=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Te(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(t,jp.get())};t()}}hn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gp="pendingRedirect",Ai=new Map;class zp extends Qh{constructor(t,e,n=!1){super(t,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],e,void 0,n),this.eventId=null}async execute(){let t=Ai.get(this.auth._key());if(!t){try{const n=await Wp(this.resolver,this.auth)?await super.execute():null;t=()=>Promise.resolve(n)}catch(e){t=()=>Promise.reject(e)}Ai.set(this.auth._key(),t)}return this.bypassAuthState||Ai.set(this.auth._key(),()=>Promise.resolve(null)),t()}async onAuthEvent(t){if(t.type==="signInViaRedirect")return super.onAuthEvent(t);if(t.type==="unknown"){this.resolve(null);return}if(t.eventId){const e=await this.auth._redirectUserForId(t.eventId);if(e)return this.user=e,super.onAuthEvent(t);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Wp(r,t){const e=Qp(t),n=Yp(r);if(!await n._isAvailable())return!1;const s=await n._get(e)==="true";return await n._remove(e),s}function Kp(r,t){Ai.set(r._key(),t)}function Yp(r){return Be(r._redirectPersistence)}function Qp(r){return Ii(Gp,r.config.apiKey,r.name)}async function Xp(r,t,e=!1){if(ee(r.app))return Promise.reject(Pe(r));const n=Ke(r),s=e1(n,t),o=await new zp(n,s,e).execute();return o&&!e&&(delete o.user._redirectEventId,await n._persistUserIfCurrent(o.user),await n._setRedirectUser(null,t)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jp=600*1e3;class Zp{constructor(t){this.auth=t,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(t){this.consumers.add(t),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,t)&&(this.sendToConsumer(this.queuedRedirectEvent,t),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(t){this.consumers.delete(t)}onEvent(t){if(this.hasEventBeenHandled(t))return!1;let e=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(t,n)&&(e=!0,this.sendToConsumer(t,n),this.saveEventToCache(t))}),this.hasHandledPotentialRedirect||!t7(t)||(this.hasHandledPotentialRedirect=!0,e||(this.queuedRedirectEvent=t,e=!0)),e}sendToConsumer(t,e){if(t.error&&!Xh(t)){const n=t.error.code?.split("auth/")[1]||"internal-error";e.onError(Te(this.auth,n))}else e.onAuthEvent(t)}isEventForConsumer(t,e){const n=e.eventId===null||!!t.eventId&&t.eventId===e.eventId;return e.filter.includes(t.type)&&n}hasEventBeenHandled(t){return Date.now()-this.lastProcessedEventTime>=Jp&&this.cachedEventUids.clear(),this.cachedEventUids.has(vc(t))}saveEventToCache(t){this.cachedEventUids.add(vc(t)),this.lastProcessedEventTime=Date.now()}}function vc(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(t=>t).join("-")}function Xh({type:r,error:t}){return r==="unknown"&&t?.code==="auth/no-auth-event"}function t7(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Xh(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function e7(r,t={}){return bn(r,"GET","/v1/projects",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const n7=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,r7=/^https?/;async function s7(r){if(r.config.emulator)return;const{authorizedDomains:t}=await e7(r);for(const e of t)try{if(i7(e))return}catch{}me(r,"unauthorized-domain")}function i7(r){const t=va(),{protocol:e,hostname:n}=new URL(t);if(r.startsWith("chrome-extension://")){const o=new URL(r);return o.hostname===""&&n===""?e==="chrome-extension:"&&r.replace("chrome-extension://","")===t.replace("chrome-extension://",""):e==="chrome-extension:"&&o.hostname===n}if(!r7.test(e))return!1;if(n7.test(r))return n===r;const s=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const o7=new Fs(3e4,6e4);function Rc(){const r=be().___jsl;if(r?.H){for(const t of Object.keys(r.H))if(r.H[t].r=r.H[t].r||[],r.H[t].L=r.H[t].L||[],r.H[t].r=[...r.H[t].L],r.CP)for(let e=0;e<r.CP.length;e++)r.CP[e]=null}}function a7(r){return new Promise((t,e)=>{function n(){Rc(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{Rc(),e(Te(r,"network-request-failed"))},timeout:o7.get()})}if(be().gapi?.iframes?.Iframe)t(gapi.iframes.getContext());else if(be().gapi?.load)n();else{const s=sp("iframefcb");return be()[s]=()=>{gapi.load?n():e(Te(r,"network-request-failed"))},Vh(`${rp()}?onload=${s}`).catch(i=>e(i))}}).catch(t=>{throw vi=null,t})}let vi=null;function u7(r){return vi=vi||a7(r),vi}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const c7=new Fs(5e3,15e3),l7="__/auth/iframe",h7="emulator/auth/iframe",f7={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},d7=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function p7(r){const t=r.config;Y(t.authDomain,r,"auth-domain-config-required");const e=t.emulator?Ya(t,h7):`https://${r.config.authDomain}/${l7}`,n={apiKey:t.apiKey,appName:r.name,v:Ar},s=d7.get(r.config.apiHost);s&&(n.eid=s);const i=r._getFrameworks();return i.length&&(n.fw=i.join(",")),`${e}?${xs(n).slice(1)}`}async function m7(r){const t=await u7(r),e=be().gapi;return Y(e,r,"internal-error"),t.open({where:document.body,url:p7(r),messageHandlersFilter:e.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:f7,dontclear:!0},n=>new Promise(async(s,i)=>{await n.restyle({setHideOnLeave:!1});const o=Te(r,"network-request-failed"),u=be().setTimeout(()=>{i(o)},c7.get());function c(){be().clearTimeout(u),s(n)}n.ping(c).then(c,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const g7={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},_7=500,E7=600,y7="_blank",T7="http://localhost";class Sc{constructor(t){this.window=t,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function w7(r,t,e,n=_7,s=E7){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-n)/2,0).toString();let u="";const c={...g7,width:n.toString(),height:s.toString(),top:i,left:o},h=jt().toLowerCase();e&&(u=Sh(h)?y7:e),vh(h)&&(t=t||T7,c.scrollbars="yes");const p=Object.entries(c).reduce((v,[N,V])=>`${v}${N}=${V},`,"");if(K0(h)&&u!=="_self")return I7(t||"",u),new Sc(null);const _=window.open(t||"",u,p);Y(_,r,"popup-blocked");try{_.focus()}catch{}return new Sc(_)}function I7(r,t){const e=document.createElement("a");e.href=r,e.target=t;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),e.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const A7="__/auth/handler",v7="emulator/auth/handler",R7=encodeURIComponent("fac");async function Cc(r,t,e,n,s,i){Y(r.config.authDomain,r,"auth-domain-config-required"),Y(r.config.apiKey,r,"invalid-api-key");const o={apiKey:r.config.apiKey,appName:r.name,authType:e,redirectUrl:n,v:Ar,eventId:s};if(t instanceof so){t.setDefaultLanguage(r.languageCode),o.providerId=t.providerId||"",fd(t.getCustomParameters())||(o.customParameters=JSON.stringify(t.getCustomParameters()));for(const[p,_]of Object.entries({}))o[p]=_}if(t instanceof Bs){const p=t.getScopes().filter(_=>_!=="");p.length>0&&(o.scopes=p.join(","))}r.tenantId&&(o.tid=r.tenantId);const u=o;for(const p of Object.keys(u))u[p]===void 0&&delete u[p];const c=await r._getAppCheckToken(),h=c?`#${R7}=${encodeURIComponent(c)}`:"";return`${S7(r)}?${xs(u).slice(1)}${h}`}function S7({config:r}){return r.emulator?Ya(r,v7):`https://${r.authDomain}/${A7}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ua="webStorageSupport";class C7{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=jh,this._completeRedirectFn=Xp,this._overrideRedirectResult=Kp}async _openPopup(t,e,n,s){je(this.eventManagers[t._key()]?.manager,"_initialize() not called before _openPopup()");const i=await Cc(t,e,n,va(),s);return w7(t,i,t1())}async _openRedirect(t,e,n,s){await this._originValidation(t);const i=await Cc(t,e,n,va(),s);return Op(i),new Promise(()=>{})}_initialize(t){const e=t._key();if(this.eventManagers[e]){const{manager:s,promise:i}=this.eventManagers[e];return s?Promise.resolve(s):(je(i,"If manager is not set, promise should be"),i)}const n=this.initAndGetManager(t);return this.eventManagers[e]={promise:n},n.catch(()=>{delete this.eventManagers[e]}),n}async initAndGetManager(t){const e=await m7(t),n=new Zp(t);return e.register("authEvent",s=>(Y(s?.authEvent,t,"invalid-auth-event"),{status:n.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[t._key()]={manager:n},this.iframes[t._key()]=e,n}_isIframeWebStorageSupported(t,e){this.iframes[t._key()].send(ua,{type:ua},s=>{const i=s?.[0]?.[ua];i!==void 0&&e(!!i),me(t,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(t){const e=t._key();return this.originValidationPromises[e]||(this.originValidationPromises[e]=s7(t)),this.originValidationPromises[e]}get _shouldInitProactively(){return Oh()||Rh()||Xa()}}const P7=C7;var Pc="@firebase/auth",bc="1.13.3";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b7{constructor(t){this.auth=t,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(t){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(t)}:null}addAuthTokenListener(t){if(this.assertAuthConfigured(),this.internalListeners.has(t))return;const e=this.auth.onIdTokenChanged(n=>{t(n?.stsTokenManager.accessToken||null)});this.internalListeners.set(t,e),this.updateProactiveRefresh()}removeAuthTokenListener(t){this.assertAuthConfigured();const e=this.internalListeners.get(t);e&&(this.internalListeners.delete(t),e(),this.updateProactiveRefresh())}assertAuthConfigured(){Y(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function N7(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function O7(r){De(new we("auth",(t,{options:e})=>{const n=t.getProvider("app").getImmediate(),s=t.getProvider("heartbeat"),i=t.getProvider("app-check-internal"),{apiKey:o,authDomain:u}=n.options;Y(o&&!o.includes(":"),"invalid-api-key",{appName:n.name});const c={apiKey:o,authDomain:u,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:kh(r)},h=new tp(n,s,i,c);return cp(h,e),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,e,n)=>{t.getProvider("auth-internal").initialize()})),De(new we("auth-internal",t=>{const e=Ke(t.getProvider("auth").getImmediate());return(n=>new b7(n))(e)},"PRIVATE").setInstantiationMode("EXPLICIT")),de(Pc,bc,N7(r)),de(Pc,bc,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k7=300,V7=sh("authIdTokenMaxAge")||k7;let Nc=null;const D7=r=>async t=>{const e=t&&await t.getIdTokenResult(),n=e&&(new Date().getTime()-Date.parse(e.issuedAtTime))/1e3;if(n&&n>V7)return;const s=e?.token;Nc!==s&&(Nc=s,await fetch(r,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function v5(r=dh()){const t=Ms(r,"auth");if(t.isInitialized())return t.getImmediate();const e=up(r,{popupRedirectResolver:P7,persistence:[Bp,Pp,jh]}),n=sh("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(n,location.origin);if(location.origin===i.origin){const o=D7(i.toString());Rp(e,o,()=>o(e.currentUser)),vp(e,u=>o(u))}}const s=nh("auth");return s&&lp(e,`http://${s}`),e}function x7(){return document.getElementsByTagName("head")?.[0]??document}ep({loadJS(r){return new Promise((t,e)=>{const n=document.createElement("script");n.setAttribute("src",r),n.onload=t,n.onerror=s=>{const i=Te("internal-error");i.customData=s,e(i)},n.type="text/javascript",n.charset="UTF-8",x7().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});O7("Browser");var L7="firebase",M7="12.15.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */de(L7,M7,"app");const Jh="@firebase/installations",r1="0.6.22";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zh=1e4,t2=`w:${r1}`,e2="FIS_v2",F7="https://firebaseinstallations.googleapis.com/v1",U7=3600*1e3,B7="installations",$7="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const q7={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},Wn=new Jn(B7,$7,q7);function n2(r){return r instanceof Ae&&r.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function r2({projectId:r}){return`${F7}/projects/${r}/installations`}function s2(r){return{token:r.token,requestStatus:2,expiresIn:j7(r.expiresIn),creationTime:Date.now()}}async function i2(r,t){const n=(await t.json()).error;return Wn.create("request-failed",{requestName:r,serverCode:n.code,serverMessage:n.message,serverStatus:n.status})}function o2({apiKey:r}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":r})}function H7(r,{refreshToken:t}){const e=o2(r);return e.append("Authorization",G7(t)),e}async function a2(r){const t=await r();return t.status>=500&&t.status<600?r():t}function j7(r){return Number(r.replace("s","000"))}function G7(r){return`${e2} ${r}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function z7({appConfig:r,heartbeatServiceProvider:t},{fid:e}){const n=r2(r),s=o2(r),i=t.getImmediate({optional:!0});if(i){const h=await i.getHeartbeatsHeader();h&&s.append("x-firebase-client",h)}const o={fid:e,authVersion:e2,appId:r.appId,sdkVersion:t2},u={method:"POST",headers:s,body:JSON.stringify(o)},c=await a2(()=>fetch(n,u));if(c.ok){const h=await c.json();return{fid:h.fid||e,registrationStatus:2,refreshToken:h.refreshToken,authToken:s2(h.authToken)}}else throw await i2("Create Installation",c)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function u2(r){return new Promise(t=>{setTimeout(t,r)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W7(r){return btoa(String.fromCharCode(...r)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const K7=/^[cdef][\w-]{21}$/,Ca="";function Y7(){try{const r=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(r),r[0]=112+r[0]%16;const e=Q7(r);return K7.test(e)?e:Ca}catch{return Ca}}function Q7(r){return W7(r).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ao(r){return`${r.appName}!${r.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const c2=new Map;function l2(r,t){const e=ao(r);h2(e,t),X7(e,t)}function h2(r,t){const e=c2.get(r);if(e)for(const n of e)n(t)}function X7(r,t){const e=J7();e&&e.postMessage({key:r,fid:t}),Z7()}let Bn=null;function J7(){return!Bn&&"BroadcastChannel"in self&&(Bn=new BroadcastChannel("[Firebase] FID Change"),Bn.onmessage=r=>{h2(r.data.key,r.data.fid)}),Bn}function Z7(){c2.size===0&&Bn&&(Bn.close(),Bn=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const t4="firebase-installations-database",e4=1,Kn="firebase-installations-store";let ca=null;function s1(){return ca||(ca=fh(t4,e4,{upgrade:(r,t)=>{switch(t){case 0:r.createObjectStore(Kn)}}})),ca}async function Fi(r,t){const e=ao(r),s=(await s1()).transaction(Kn,"readwrite"),i=s.objectStore(Kn),o=await i.get(e);return await i.put(t,e),await s.done,(!o||o.fid!==t.fid)&&l2(r,t.fid),t}async function f2(r){const t=ao(r),n=(await s1()).transaction(Kn,"readwrite");await n.objectStore(Kn).delete(t),await n.done}async function uo(r,t){const e=ao(r),s=(await s1()).transaction(Kn,"readwrite"),i=s.objectStore(Kn),o=await i.get(e),u=t(o);return u===void 0?await i.delete(e):await i.put(u,e),await s.done,u&&(!o||o.fid!==u.fid)&&l2(r,u.fid),u}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function i1(r){let t;const e=await uo(r.appConfig,n=>{const s=n4(n),i=r4(r,s);return t=i.registrationPromise,i.installationEntry});return e.fid===Ca?{installationEntry:await t}:{installationEntry:e,registrationPromise:t}}function n4(r){const t=r||{fid:Y7(),registrationStatus:0};return d2(t)}function r4(r,t){if(t.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(Wn.create("app-offline"));return{installationEntry:t,registrationPromise:s}}const e={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},n=s4(r,e);return{installationEntry:e,registrationPromise:n}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:i4(r)}:{installationEntry:t}}async function s4(r,t){try{const e=await z7(r,t);return Fi(r.appConfig,e)}catch(e){throw n2(e)&&e.customData.serverCode===409?await f2(r.appConfig):await Fi(r.appConfig,{fid:t.fid,registrationStatus:0}),e}}async function i4(r){let t=await Oc(r.appConfig);for(;t.registrationStatus===1;)await u2(100),t=await Oc(r.appConfig);if(t.registrationStatus===0){const{installationEntry:e,registrationPromise:n}=await i1(r);return n||e}return t}function Oc(r){return uo(r,t=>{if(!t)throw Wn.create("installation-not-found");return d2(t)})}function d2(r){return o4(r)?{fid:r.fid,registrationStatus:0}:r}function o4(r){return r.registrationStatus===1&&r.registrationTime+Zh<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function a4({appConfig:r,heartbeatServiceProvider:t},e){const n=u4(r,e),s=H7(r,e),i=t.getImmediate({optional:!0});if(i){const h=await i.getHeartbeatsHeader();h&&s.append("x-firebase-client",h)}const o={installation:{sdkVersion:t2,appId:r.appId}},u={method:"POST",headers:s,body:JSON.stringify(o)},c=await a2(()=>fetch(n,u));if(c.ok){const h=await c.json();return s2(h)}else throw await i2("Generate Auth Token",c)}function u4(r,{fid:t}){return`${r2(r)}/${t}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function o1(r,t=!1){let e;const n=await uo(r.appConfig,i=>{if(!p2(i))throw Wn.create("not-registered");const o=i.authToken;if(!t&&h4(o))return i;if(o.requestStatus===1)return e=c4(r,t),i;{if(!navigator.onLine)throw Wn.create("app-offline");const u=d4(i);return e=l4(r,u),u}});return e?await e:n.authToken}async function c4(r,t){let e=await kc(r.appConfig);for(;e.authToken.requestStatus===1;)await u2(100),e=await kc(r.appConfig);const n=e.authToken;return n.requestStatus===0?o1(r,t):n}function kc(r){return uo(r,t=>{if(!p2(t))throw Wn.create("not-registered");const e=t.authToken;return p4(e)?{...t,authToken:{requestStatus:0}}:t})}async function l4(r,t){try{const e=await a4(r,t),n={...t,authToken:e};return await Fi(r.appConfig,n),e}catch(e){if(n2(e)&&(e.customData.serverCode===401||e.customData.serverCode===404))await f2(r.appConfig);else{const n={...t,authToken:{requestStatus:0}};await Fi(r.appConfig,n)}throw e}}function p2(r){return r!==void 0&&r.registrationStatus===2}function h4(r){return r.requestStatus===2&&!f4(r)}function f4(r){const t=Date.now();return t<r.creationTime||r.creationTime+r.expiresIn<t+U7}function d4(r){const t={requestStatus:1,requestTime:Date.now()};return{...r,authToken:t}}function p4(r){return r.requestStatus===1&&r.requestTime+Zh<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function m4(r){const t=r,{installationEntry:e,registrationPromise:n}=await i1(t);return n?n.catch(console.error):o1(t).catch(console.error),e.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function g4(r,t=!1){const e=r;return await _4(e),(await o1(e,t)).token}async function _4(r){const{registrationPromise:t}=await i1(r);t&&await t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function E4(r){if(!r||!r.options)throw la("App Configuration");if(!r.name)throw la("App Name");const t=["projectId","apiKey","appId"];for(const e of t)if(!r.options[e])throw la(e);return{appName:r.name,projectId:r.options.projectId,apiKey:r.options.apiKey,appId:r.options.appId}}function la(r){return Wn.create("missing-app-config-values",{valueName:r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const m2="installations",y4="installations-internal",T4=r=>{const t=r.getProvider("app").getImmediate(),e=E4(t),n=Ms(t,"heartbeat");return{app:t,appConfig:e,heartbeatServiceProvider:n,_delete:()=>Promise.resolve()}},w4=r=>{const t=r.getProvider("app").getImmediate(),e=Ms(t,m2).getImmediate();return{getId:()=>m4(e),getToken:s=>g4(e,s)}};function I4(){De(new we(m2,T4,"PUBLIC")),De(new we(y4,w4,"PRIVATE"))}I4();de(Jh,r1);de(Jh,r1,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vc="analytics",A4="firebase_id",v4="origin",R4=60*1e3,S4="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",a1="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qt=new no("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const C4={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},pe=new Jn("analytics","Analytics",C4);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function P4(r){if(!r.startsWith(a1)){const t=pe.create("invalid-gtag-resource",{gtagURL:r});return Qt.warn(t.message),""}return r}function g2(r){return Promise.all(r.map(t=>t.catch(e=>e)))}function b4(r,t){let e;return window.trustedTypes&&(e=window.trustedTypes.createPolicy(r,t)),e}function N4(r,t){const e=b4("firebase-js-sdk-policy",{createScriptURL:P4}),n=document.createElement("script"),s=`${a1}?l=${r}&id=${t}`;n.src=e?e?.createScriptURL(s):s,n.async=!0,document.head.appendChild(n)}function O4(r){let t=[];return Array.isArray(window[r])?t=window[r]:window[r]=t,t}async function k4(r,t,e,n,s,i){const o=n[s];try{if(o)await t[o];else{const c=(await g2(e)).find(h=>h.measurementId===s);c&&await t[c.appId]}}catch(u){Qt.error(u)}r("config",s,i)}async function V4(r,t,e,n,s){try{let i=[];if(s&&s.send_to){let o=s.send_to;Array.isArray(o)||(o=[o]);const u=await g2(e);for(const c of o){const h=u.find(_=>_.measurementId===c),p=h&&t[h.appId];if(p)i.push(p);else{i=[];break}}}i.length===0&&(i=Object.values(t)),await Promise.all(i),r("event",n,s||{})}catch(i){Qt.error(i)}}function D4(r,t,e,n){async function s(i,...o){try{if(i==="event"){const[u,c]=o;await V4(r,t,e,u,c)}else if(i==="config"){const[u,c]=o;await k4(r,t,e,n,u,c)}else if(i==="consent"){const[u,c]=o;r("consent",u,c)}else if(i==="get"){const[u,c,h]=o;r("get",u,c,h)}else if(i==="set"){const[u]=o;r("set",u)}else r(i,...o)}catch(u){Qt.error(u)}}return s}function x4(r,t,e,n,s){let i=function(...o){window[n].push(arguments)};return window[s]&&typeof window[s]=="function"&&(i=window[s]),window[s]=D4(i,r,t,e),{gtagCore:i,wrappedGtag:window[s]}}function L4(r){const t=window.document.getElementsByTagName("script");for(const e of Object.values(t))if(e.src&&e.src.includes(a1)&&e.src.includes(r))return e;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M4=30,F4=1e3;class U4{constructor(t={},e=F4){this.throttleMetadata=t,this.intervalMillis=e}getThrottleMetadata(t){return this.throttleMetadata[t]}setThrottleMetadata(t,e){this.throttleMetadata[t]=e}deleteThrottleMetadata(t){delete this.throttleMetadata[t]}}const _2=new U4;function B4(r){return new Headers({Accept:"application/json","x-goog-api-key":r})}async function $4(r){const{appId:t,apiKey:e}=r,n={method:"GET",headers:B4(e)},s=S4.replace("{app-id}",t),i=await fetch(s,n);if(i.status!==200&&i.status!==304){let o="";try{const u=await i.json();u.error?.message&&(o=u.error.message)}catch{}throw pe.create("config-fetch-failed",{httpStatus:i.status,responseMessage:o})}return i.json()}async function q4(r,t=_2,e){const{appId:n,apiKey:s,measurementId:i}=r.options;if(!n)throw pe.create("no-app-id");if(!s){if(i)return{measurementId:i,appId:n};throw pe.create("no-api-key")}const o=t.getThrottleMetadata(n)||{backoffCount:0,throttleEndTimeMillis:Date.now()},u=new G4;return setTimeout(async()=>{u.abort()},R4),E2({appId:n,apiKey:s,measurementId:i},o,u,t)}async function E2(r,{throttleEndTimeMillis:t,backoffCount:e},n,s=_2){const{appId:i,measurementId:o}=r;try{await H4(n,t)}catch(u){if(o)return Qt.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${u?.message}]`),{appId:i,measurementId:o};throw u}try{const u=await $4(r);return s.deleteThrottleMetadata(i),u}catch(u){const c=u;if(!j4(c)){if(s.deleteThrottleMetadata(i),o)return Qt.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${c?.message}]`),{appId:i,measurementId:o};throw u}const h=Number(c?.customData?.httpStatus)===503?nc(e,s.intervalMillis,M4):nc(e,s.intervalMillis),p={throttleEndTimeMillis:Date.now()+h,backoffCount:e+1};return s.setThrottleMetadata(i,p),Qt.debug(`Calling attemptFetch again in ${h} millis`),E2(r,p,n,s)}}function H4(r,t){return new Promise((e,n)=>{const s=Math.max(t-Date.now(),0),i=setTimeout(e,s);r.addEventListener(()=>{clearTimeout(i),n(pe.create("fetch-throttle",{throttleEndTimeMillis:t}))})})}function j4(r){if(!(r instanceof Ae)||!r.customData)return!1;const t=Number(r.customData.httpStatus);return t===429||t===500||t===503||t===504}class G4{constructor(){this.listeners=[]}addEventListener(t){this.listeners.push(t)}abort(){this.listeners.forEach(t=>t())}}async function z4(r,t,e,n,s){if(s&&s.global){r("event",e,n);return}else{const i=await t,o={...n,send_to:i};r("event",e,o)}}async function W4(r,t,e,n){if(n&&n.global){const s={};for(const i of Object.keys(e))s[`user_properties.${i}`]=e[i];return r("set",s),Promise.resolve()}else{const s=await t;r("config",s,{update:!0,user_properties:e})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function K4(){if(ah())try{await uh()}catch(r){return Qt.warn(pe.create("indexeddb-unavailable",{errorInfo:r?.toString()}).message),!1}else return Qt.warn(pe.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function Y4(r,t,e,n,s,i,o){const u=q4(r);u.then(v=>{e[v.measurementId]=v.appId,r.options.measurementId&&v.measurementId!==r.options.measurementId&&Qt.warn(`The measurement ID in the local Firebase config (${r.options.measurementId}) does not match the measurement ID fetched from the server (${v.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(v=>Qt.error(v)),t.push(u);const c=K4().then(v=>{if(v)return n.getId()}),[h,p]=await Promise.all([u,c]);L4(i)||N4(i,h.measurementId),s("js",new Date);const _=o?.config??{};return _[v4]="firebase",_.update=!0,p!=null&&(_[A4]=p),s("config",h.measurementId,_),h.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q4{constructor(t){this.app=t}_delete(){return delete fr[this.app.options.appId],Promise.resolve()}}let fr={},Dc=[];const xc={};let ha="dataLayer",X4="gtag",Lc,u1,Mc=!1;function J4(){const r=[];if(oh()&&r.push("This is a browser extension environment."),ud()||r.push("Cookies are not available."),r.length>0){const t=r.map((n,s)=>`(${s+1}) ${n}`).join(" "),e=pe.create("invalid-analytics-context",{errorInfo:t});Qt.warn(e.message)}}function Z4(r,t,e){J4();const n=r.options.appId;if(!n)throw pe.create("no-app-id");if(!r.options.apiKey)if(r.options.measurementId)Qt.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${r.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw pe.create("no-api-key");if(fr[n]!=null)throw pe.create("already-exists",{id:n});if(!Mc){O4(ha);const{wrappedGtag:i,gtagCore:o}=x4(fr,Dc,xc,ha,X4);u1=i,Lc=o,Mc=!0}return fr[n]=Y4(r,Dc,xc,t,Lc,ha,e),new Q4(r)}function t3(r,t,e){r=Rt(r),W4(u1,fr[r.app.options.appId],t,e).catch(n=>Qt.error(n))}function e3(r,t,e,n){r=Rt(r),z4(u1,fr[r.app.options.appId],t,e,n).catch(s=>Qt.error(s))}const Fc="@firebase/analytics",Uc="0.10.22";function n3(){De(new we(Vc,(t,{options:e})=>{const n=t.getProvider("app").getImmediate(),s=t.getProvider("installations-internal").getImmediate();return Z4(n,s,e)},"PUBLIC")),De(new we("analytics-internal",r,"PRIVATE")),de(Fc,Uc),de(Fc,Uc,"esm2020");function r(t){try{const e=t.getProvider(Vc).getImmediate();return{logEvent:(n,s,i)=>e3(e,n,s,i),setUserProperties:(n,s)=>t3(e,n,s)}}catch(e){throw pe.create("interop-component-reg-failed",{reason:e})}}}n3();var Bc=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var pn,y2;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(A,E){function T(){}T.prototype=E.prototype,A.F=E.prototype,A.prototype=new T,A.prototype.constructor=A,A.D=function(R,I,C){for(var y=Array(arguments.length-2),Jt=2;Jt<arguments.length;Jt++)y[Jt-2]=arguments[Jt];return E.prototype[I].apply(R,y)}}function e(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}t(n,e),n.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(A,E,T){T||(T=0);const R=Array(16);if(typeof E=="string")for(var I=0;I<16;++I)R[I]=E.charCodeAt(T++)|E.charCodeAt(T++)<<8|E.charCodeAt(T++)<<16|E.charCodeAt(T++)<<24;else for(I=0;I<16;++I)R[I]=E[T++]|E[T++]<<8|E[T++]<<16|E[T++]<<24;E=A.g[0],T=A.g[1],I=A.g[2];let C=A.g[3],y;y=E+(C^T&(I^C))+R[0]+3614090360&4294967295,E=T+(y<<7&4294967295|y>>>25),y=C+(I^E&(T^I))+R[1]+3905402710&4294967295,C=E+(y<<12&4294967295|y>>>20),y=I+(T^C&(E^T))+R[2]+606105819&4294967295,I=C+(y<<17&4294967295|y>>>15),y=T+(E^I&(C^E))+R[3]+3250441966&4294967295,T=I+(y<<22&4294967295|y>>>10),y=E+(C^T&(I^C))+R[4]+4118548399&4294967295,E=T+(y<<7&4294967295|y>>>25),y=C+(I^E&(T^I))+R[5]+1200080426&4294967295,C=E+(y<<12&4294967295|y>>>20),y=I+(T^C&(E^T))+R[6]+2821735955&4294967295,I=C+(y<<17&4294967295|y>>>15),y=T+(E^I&(C^E))+R[7]+4249261313&4294967295,T=I+(y<<22&4294967295|y>>>10),y=E+(C^T&(I^C))+R[8]+1770035416&4294967295,E=T+(y<<7&4294967295|y>>>25),y=C+(I^E&(T^I))+R[9]+2336552879&4294967295,C=E+(y<<12&4294967295|y>>>20),y=I+(T^C&(E^T))+R[10]+4294925233&4294967295,I=C+(y<<17&4294967295|y>>>15),y=T+(E^I&(C^E))+R[11]+2304563134&4294967295,T=I+(y<<22&4294967295|y>>>10),y=E+(C^T&(I^C))+R[12]+1804603682&4294967295,E=T+(y<<7&4294967295|y>>>25),y=C+(I^E&(T^I))+R[13]+4254626195&4294967295,C=E+(y<<12&4294967295|y>>>20),y=I+(T^C&(E^T))+R[14]+2792965006&4294967295,I=C+(y<<17&4294967295|y>>>15),y=T+(E^I&(C^E))+R[15]+1236535329&4294967295,T=I+(y<<22&4294967295|y>>>10),y=E+(I^C&(T^I))+R[1]+4129170786&4294967295,E=T+(y<<5&4294967295|y>>>27),y=C+(T^I&(E^T))+R[6]+3225465664&4294967295,C=E+(y<<9&4294967295|y>>>23),y=I+(E^T&(C^E))+R[11]+643717713&4294967295,I=C+(y<<14&4294967295|y>>>18),y=T+(C^E&(I^C))+R[0]+3921069994&4294967295,T=I+(y<<20&4294967295|y>>>12),y=E+(I^C&(T^I))+R[5]+3593408605&4294967295,E=T+(y<<5&4294967295|y>>>27),y=C+(T^I&(E^T))+R[10]+38016083&4294967295,C=E+(y<<9&4294967295|y>>>23),y=I+(E^T&(C^E))+R[15]+3634488961&4294967295,I=C+(y<<14&4294967295|y>>>18),y=T+(C^E&(I^C))+R[4]+3889429448&4294967295,T=I+(y<<20&4294967295|y>>>12),y=E+(I^C&(T^I))+R[9]+568446438&4294967295,E=T+(y<<5&4294967295|y>>>27),y=C+(T^I&(E^T))+R[14]+3275163606&4294967295,C=E+(y<<9&4294967295|y>>>23),y=I+(E^T&(C^E))+R[3]+4107603335&4294967295,I=C+(y<<14&4294967295|y>>>18),y=T+(C^E&(I^C))+R[8]+1163531501&4294967295,T=I+(y<<20&4294967295|y>>>12),y=E+(I^C&(T^I))+R[13]+2850285829&4294967295,E=T+(y<<5&4294967295|y>>>27),y=C+(T^I&(E^T))+R[2]+4243563512&4294967295,C=E+(y<<9&4294967295|y>>>23),y=I+(E^T&(C^E))+R[7]+1735328473&4294967295,I=C+(y<<14&4294967295|y>>>18),y=T+(C^E&(I^C))+R[12]+2368359562&4294967295,T=I+(y<<20&4294967295|y>>>12),y=E+(T^I^C)+R[5]+4294588738&4294967295,E=T+(y<<4&4294967295|y>>>28),y=C+(E^T^I)+R[8]+2272392833&4294967295,C=E+(y<<11&4294967295|y>>>21),y=I+(C^E^T)+R[11]+1839030562&4294967295,I=C+(y<<16&4294967295|y>>>16),y=T+(I^C^E)+R[14]+4259657740&4294967295,T=I+(y<<23&4294967295|y>>>9),y=E+(T^I^C)+R[1]+2763975236&4294967295,E=T+(y<<4&4294967295|y>>>28),y=C+(E^T^I)+R[4]+1272893353&4294967295,C=E+(y<<11&4294967295|y>>>21),y=I+(C^E^T)+R[7]+4139469664&4294967295,I=C+(y<<16&4294967295|y>>>16),y=T+(I^C^E)+R[10]+3200236656&4294967295,T=I+(y<<23&4294967295|y>>>9),y=E+(T^I^C)+R[13]+681279174&4294967295,E=T+(y<<4&4294967295|y>>>28),y=C+(E^T^I)+R[0]+3936430074&4294967295,C=E+(y<<11&4294967295|y>>>21),y=I+(C^E^T)+R[3]+3572445317&4294967295,I=C+(y<<16&4294967295|y>>>16),y=T+(I^C^E)+R[6]+76029189&4294967295,T=I+(y<<23&4294967295|y>>>9),y=E+(T^I^C)+R[9]+3654602809&4294967295,E=T+(y<<4&4294967295|y>>>28),y=C+(E^T^I)+R[12]+3873151461&4294967295,C=E+(y<<11&4294967295|y>>>21),y=I+(C^E^T)+R[15]+530742520&4294967295,I=C+(y<<16&4294967295|y>>>16),y=T+(I^C^E)+R[2]+3299628645&4294967295,T=I+(y<<23&4294967295|y>>>9),y=E+(I^(T|~C))+R[0]+4096336452&4294967295,E=T+(y<<6&4294967295|y>>>26),y=C+(T^(E|~I))+R[7]+1126891415&4294967295,C=E+(y<<10&4294967295|y>>>22),y=I+(E^(C|~T))+R[14]+2878612391&4294967295,I=C+(y<<15&4294967295|y>>>17),y=T+(C^(I|~E))+R[5]+4237533241&4294967295,T=I+(y<<21&4294967295|y>>>11),y=E+(I^(T|~C))+R[12]+1700485571&4294967295,E=T+(y<<6&4294967295|y>>>26),y=C+(T^(E|~I))+R[3]+2399980690&4294967295,C=E+(y<<10&4294967295|y>>>22),y=I+(E^(C|~T))+R[10]+4293915773&4294967295,I=C+(y<<15&4294967295|y>>>17),y=T+(C^(I|~E))+R[1]+2240044497&4294967295,T=I+(y<<21&4294967295|y>>>11),y=E+(I^(T|~C))+R[8]+1873313359&4294967295,E=T+(y<<6&4294967295|y>>>26),y=C+(T^(E|~I))+R[15]+4264355552&4294967295,C=E+(y<<10&4294967295|y>>>22),y=I+(E^(C|~T))+R[6]+2734768916&4294967295,I=C+(y<<15&4294967295|y>>>17),y=T+(C^(I|~E))+R[13]+1309151649&4294967295,T=I+(y<<21&4294967295|y>>>11),y=E+(I^(T|~C))+R[4]+4149444226&4294967295,E=T+(y<<6&4294967295|y>>>26),y=C+(T^(E|~I))+R[11]+3174756917&4294967295,C=E+(y<<10&4294967295|y>>>22),y=I+(E^(C|~T))+R[2]+718787259&4294967295,I=C+(y<<15&4294967295|y>>>17),y=T+(C^(I|~E))+R[9]+3951481745&4294967295,A.g[0]=A.g[0]+E&4294967295,A.g[1]=A.g[1]+(I+(y<<21&4294967295|y>>>11))&4294967295,A.g[2]=A.g[2]+I&4294967295,A.g[3]=A.g[3]+C&4294967295}n.prototype.v=function(A,E){E===void 0&&(E=A.length);const T=E-this.blockSize,R=this.C;let I=this.h,C=0;for(;C<E;){if(I==0)for(;C<=T;)s(this,A,C),C+=this.blockSize;if(typeof A=="string"){for(;C<E;)if(R[I++]=A.charCodeAt(C++),I==this.blockSize){s(this,R),I=0;break}}else for(;C<E;)if(R[I++]=A[C++],I==this.blockSize){s(this,R),I=0;break}}this.h=I,this.o+=E},n.prototype.A=function(){var A=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);A[0]=128;for(var E=1;E<A.length-8;++E)A[E]=0;E=this.o*8;for(var T=A.length-8;T<A.length;++T)A[T]=E&255,E/=256;for(this.v(A),A=Array(16),E=0,T=0;T<4;++T)for(let R=0;R<32;R+=8)A[E++]=this.g[T]>>>R&255;return A};function i(A,E){var T=u;return Object.prototype.hasOwnProperty.call(T,A)?T[A]:T[A]=E(A)}function o(A,E){this.h=E;const T=[];let R=!0;for(let I=A.length-1;I>=0;I--){const C=A[I]|0;R&&C==E||(T[I]=C,R=!1)}this.g=T}var u={};function c(A){return-128<=A&&A<128?i(A,function(E){return new o([E|0],E<0?-1:0)}):new o([A|0],A<0?-1:0)}function h(A){if(isNaN(A)||!isFinite(A))return _;if(A<0)return $(h(-A));const E=[];let T=1;for(let R=0;A>=T;R++)E[R]=A/T|0,T*=4294967296;return new o(E,0)}function p(A,E){if(A.length==0)throw Error("number format error: empty string");if(E=E||10,E<2||36<E)throw Error("radix out of range: "+E);if(A.charAt(0)=="-")return $(p(A.substring(1),E));if(A.indexOf("-")>=0)throw Error('number format error: interior "-" character');const T=h(Math.pow(E,8));let R=_;for(let C=0;C<A.length;C+=8){var I=Math.min(8,A.length-C);const y=parseInt(A.substring(C,C+I),E);I<8?(I=h(Math.pow(E,I)),R=R.j(I).add(h(y))):(R=R.j(T),R=R.add(h(y)))}return R}var _=c(0),v=c(1),N=c(16777216);r=o.prototype,r.m=function(){if(M(this))return-$(this).m();let A=0,E=1;for(let T=0;T<this.g.length;T++){const R=this.i(T);A+=(R>=0?R:4294967296+R)*E,E*=4294967296}return A},r.toString=function(A){if(A=A||10,A<2||36<A)throw Error("radix out of range: "+A);if(V(this))return"0";if(M(this))return"-"+$(this).toString(A);const E=h(Math.pow(A,6));var T=this;let R="";for(;;){const I=Xt(T,E).g;T=J(T,I.j(E));let C=((T.g.length>0?T.g[0]:T.h)>>>0).toString(A);if(T=I,V(T))return C+R;for(;C.length<6;)C="0"+C;R=C+R}},r.i=function(A){return A<0?0:A<this.g.length?this.g[A]:this.h};function V(A){if(A.h!=0)return!1;for(let E=0;E<A.g.length;E++)if(A.g[E]!=0)return!1;return!0}function M(A){return A.h==-1}r.l=function(A){return A=J(this,A),M(A)?-1:V(A)?0:1};function $(A){const E=A.g.length,T=[];for(let R=0;R<E;R++)T[R]=~A.g[R];return new o(T,~A.h).add(v)}r.abs=function(){return M(this)?$(this):this},r.add=function(A){const E=Math.max(this.g.length,A.g.length),T=[];let R=0;for(let I=0;I<=E;I++){let C=R+(this.i(I)&65535)+(A.i(I)&65535),y=(C>>>16)+(this.i(I)>>>16)+(A.i(I)>>>16);R=y>>>16,C&=65535,y&=65535,T[I]=y<<16|C}return new o(T,T[T.length-1]&-2147483648?-1:0)};function J(A,E){return A.add($(E))}r.j=function(A){if(V(this)||V(A))return _;if(M(this))return M(A)?$(this).j($(A)):$($(this).j(A));if(M(A))return $(this.j($(A)));if(this.l(N)<0&&A.l(N)<0)return h(this.m()*A.m());const E=this.g.length+A.g.length,T=[];for(var R=0;R<2*E;R++)T[R]=0;for(R=0;R<this.g.length;R++)for(let I=0;I<A.g.length;I++){const C=this.i(R)>>>16,y=this.i(R)&65535,Jt=A.i(I)>>>16,kn=A.i(I)&65535;T[2*R+2*I]+=y*kn,ut(T,2*R+2*I),T[2*R+2*I+1]+=C*kn,ut(T,2*R+2*I+1),T[2*R+2*I+1]+=y*Jt,ut(T,2*R+2*I+1),T[2*R+2*I+2]+=C*Jt,ut(T,2*R+2*I+2)}for(A=0;A<E;A++)T[A]=T[2*A+1]<<16|T[2*A];for(A=E;A<2*E;A++)T[A]=0;return new o(T,0)};function ut(A,E){for(;(A[E]&65535)!=A[E];)A[E+1]+=A[E]>>>16,A[E]&=65535,E++}function _t(A,E){this.g=A,this.h=E}function Xt(A,E){if(V(E))throw Error("division by zero");if(V(A))return new _t(_,_);if(M(A))return E=Xt($(A),E),new _t($(E.g),$(E.h));if(M(E))return E=Xt(A,$(E)),new _t($(E.g),E.h);if(A.g.length>30){if(M(A)||M(E))throw Error("slowDivide_ only works with positive integers.");for(var T=v,R=E;R.l(A)<=0;)T=_e(T),R=_e(R);var I=xt(T,1),C=xt(R,1);for(R=xt(R,2),T=xt(T,2);!V(R);){var y=C.add(R);y.l(A)<=0&&(I=I.add(T),C=y),R=xt(R,1),T=xt(T,1)}return E=J(A,I.j(E)),new _t(I,E)}for(I=_;A.l(E)>=0;){for(T=Math.max(1,Math.floor(A.m()/E.m())),R=Math.ceil(Math.log(T)/Math.LN2),R=R<=48?1:Math.pow(2,R-48),C=h(T),y=C.j(E);M(y)||y.l(A)>0;)T-=R,C=h(T),y=C.j(E);V(C)&&(C=v),I=I.add(C),A=J(A,y)}return new _t(I,A)}r.B=function(A){return Xt(this,A).h},r.and=function(A){const E=Math.max(this.g.length,A.g.length),T=[];for(let R=0;R<E;R++)T[R]=this.i(R)&A.i(R);return new o(T,this.h&A.h)},r.or=function(A){const E=Math.max(this.g.length,A.g.length),T=[];for(let R=0;R<E;R++)T[R]=this.i(R)|A.i(R);return new o(T,this.h|A.h)},r.xor=function(A){const E=Math.max(this.g.length,A.g.length),T=[];for(let R=0;R<E;R++)T[R]=this.i(R)^A.i(R);return new o(T,this.h^A.h)};function _e(A){const E=A.g.length+1,T=[];for(let R=0;R<E;R++)T[R]=A.i(R)<<1|A.i(R-1)>>>31;return new o(T,A.h)}function xt(A,E){const T=E>>5;E%=32;const R=A.g.length-T,I=[];for(let C=0;C<R;C++)I[C]=E>0?A.i(C+T)>>>E|A.i(C+T+1)<<32-E:A.i(C+T);return new o(I,A.h)}n.prototype.digest=n.prototype.A,n.prototype.reset=n.prototype.u,n.prototype.update=n.prototype.v,y2=n,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=p,pn=o}).apply(typeof Bc<"u"?Bc:typeof self<"u"?self:typeof window<"u"?window:{});var pi=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var T2,Jr,w2,Ri,Pa,I2,A2,v2;(function(){var r,t=Object.defineProperty;function e(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof pi=="object"&&pi];for(var l=0;l<a.length;++l){var f=a[l];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var n=e(this);function s(a,l){if(l)t:{var f=n;a=a.split(".");for(var m=0;m<a.length-1;m++){var S=a[m];if(!(S in f))break t;f=f[S]}a=a[a.length-1],m=f[a],l=l(m),l!=m&&l!=null&&t(f,a,{configurable:!0,writable:!0,value:l})}}s("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(a){return a||function(l){var f=[],m;for(m in l)Object.prototype.hasOwnProperty.call(l,m)&&f.push([m,l[m]]);return f}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},o=this||self;function u(a){var l=typeof a;return l=="object"&&a!=null||l=="function"}function c(a,l,f){return a.call.apply(a.bind,arguments)}function h(a,l,f){return h=c,h.apply(null,arguments)}function p(a,l){var f=Array.prototype.slice.call(arguments,1);return function(){var m=f.slice();return m.push.apply(m,arguments),a.apply(this,m)}}function _(a,l){function f(){}f.prototype=l.prototype,a.Z=l.prototype,a.prototype=new f,a.prototype.constructor=a,a.Ob=function(m,S,b){for(var F=Array(arguments.length-2),nt=2;nt<arguments.length;nt++)F[nt-2]=arguments[nt];return l.prototype[S].apply(m,F)}}var v=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function N(a){const l=a.length;if(l>0){const f=Array(l);for(let m=0;m<l;m++)f[m]=a[m];return f}return[]}function V(a,l){for(let m=1;m<arguments.length;m++){const S=arguments[m];var f=typeof S;if(f=f!="object"?f:S?Array.isArray(S)?"array":f:"null",f=="array"||f=="object"&&typeof S.length=="number"){f=a.length||0;const b=S.length||0;a.length=f+b;for(let F=0;F<b;F++)a[f+F]=S[F]}else a.push(S)}}class M{constructor(l,f){this.i=l,this.j=f,this.h=0,this.g=null}get(){let l;return this.h>0?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function $(a){o.setTimeout(()=>{throw a},0)}function J(){var a=A;let l=null;return a.g&&(l=a.g,a.g=a.g.next,a.g||(a.h=null),l.next=null),l}class ut{constructor(){this.h=this.g=null}add(l,f){const m=_t.get();m.set(l,f),this.h?this.h.next=m:this.g=m,this.h=m}}var _t=new M(()=>new Xt,a=>a.reset());class Xt{constructor(){this.next=this.g=this.h=null}set(l,f){this.h=l,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let _e,xt=!1,A=new ut,E=()=>{const a=Promise.resolve(void 0);_e=()=>{a.then(T)}};function T(){for(var a;a=J();){try{a.h.call(a.g)}catch(f){$(f)}var l=_t;l.j(a),l.h<100&&(l.h++,a.next=l.g,l.g=a)}xt=!1}function R(){this.u=this.u,this.C=this.C}R.prototype.u=!1,R.prototype.dispose=function(){this.u||(this.u=!0,this.N())},R.prototype[Symbol.dispose]=function(){this.dispose()},R.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function I(a,l){this.type=a,this.g=this.target=l,this.defaultPrevented=!1}I.prototype.h=function(){this.defaultPrevented=!0};var C=(function(){if(!o.addEventListener||!Object.defineProperty)return!1;var a=!1,l=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const f=()=>{};o.addEventListener("test",f,l),o.removeEventListener("test",f,l)}catch{}return a})();function y(a){return/^[\s\xa0]*$/.test(a)}function Jt(a,l){I.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,l)}_(Jt,I),Jt.prototype.init=function(a,l){const f=this.type=a.type,m=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=l,l=a.relatedTarget,l||(f=="mouseover"?l=a.fromElement:f=="mouseout"&&(l=a.toElement)),this.relatedTarget=l,m?(this.clientX=m.clientX!==void 0?m.clientX:m.pageX,this.clientY=m.clientY!==void 0?m.clientY:m.pageY,this.screenX=m.screenX||0,this.screenY=m.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&Jt.Z.h.call(this)},Jt.prototype.h=function(){Jt.Z.h.call(this);const a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var kn="closure_listenable_"+(Math.random()*1e6|0),ff=0;function df(a,l,f,m,S){this.listener=a,this.proxy=null,this.src=l,this.type=f,this.capture=!!m,this.ha=S,this.key=++ff,this.da=this.fa=!1}function Js(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Zs(a,l,f){for(const m in a)l.call(f,a[m],m,a)}function pf(a,l){for(const f in a)l.call(void 0,a[f],f,a)}function Z1(a){const l={};for(const f in a)l[f]=a[f];return l}const tu="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function eu(a,l){let f,m;for(let S=1;S<arguments.length;S++){m=arguments[S];for(f in m)a[f]=m[f];for(let b=0;b<tu.length;b++)f=tu[b],Object.prototype.hasOwnProperty.call(m,f)&&(a[f]=m[f])}}function ti(a){this.src=a,this.g={},this.h=0}ti.prototype.add=function(a,l,f,m,S){const b=a.toString();a=this.g[b],a||(a=this.g[b]=[],this.h++);const F=Vo(a,l,m,S);return F>-1?(l=a[F],f||(l.fa=!1)):(l=new df(l,this.src,b,!!m,S),l.fa=f,a.push(l)),l};function ko(a,l){const f=l.type;if(f in a.g){var m=a.g[f],S=Array.prototype.indexOf.call(m,l,void 0),b;(b=S>=0)&&Array.prototype.splice.call(m,S,1),b&&(Js(l),a.g[f].length==0&&(delete a.g[f],a.h--))}}function Vo(a,l,f,m){for(let S=0;S<a.length;++S){const b=a[S];if(!b.da&&b.listener==l&&b.capture==!!f&&b.ha==m)return S}return-1}var Do="closure_lm_"+(Math.random()*1e6|0),xo={};function nu(a,l,f,m,S){if(Array.isArray(l)){for(let b=0;b<l.length;b++)nu(a,l[b],f,m,S);return null}return f=iu(f),a&&a[kn]?a.J(l,f,u(m)?!!m.capture:!1,S):mf(a,l,f,!1,m,S)}function mf(a,l,f,m,S,b){if(!l)throw Error("Invalid event type");const F=u(S)?!!S.capture:!!S;let nt=Mo(a);if(nt||(a[Do]=nt=new ti(a)),f=nt.add(l,f,m,F,b),f.proxy)return f;if(m=gf(),f.proxy=m,m.src=a,m.listener=f,a.addEventListener)C||(S=F),S===void 0&&(S=!1),a.addEventListener(l.toString(),m,S);else if(a.attachEvent)a.attachEvent(su(l.toString()),m);else if(a.addListener&&a.removeListener)a.addListener(m);else throw Error("addEventListener and attachEvent are unavailable.");return f}function gf(){function a(f){return l.call(a.src,a.listener,f)}const l=_f;return a}function ru(a,l,f,m,S){if(Array.isArray(l))for(var b=0;b<l.length;b++)ru(a,l[b],f,m,S);else m=u(m)?!!m.capture:!!m,f=iu(f),a&&a[kn]?(a=a.i,b=String(l).toString(),b in a.g&&(l=a.g[b],f=Vo(l,f,m,S),f>-1&&(Js(l[f]),Array.prototype.splice.call(l,f,1),l.length==0&&(delete a.g[b],a.h--)))):a&&(a=Mo(a))&&(l=a.g[l.toString()],a=-1,l&&(a=Vo(l,f,m,S)),(f=a>-1?l[a]:null)&&Lo(f))}function Lo(a){if(typeof a!="number"&&a&&!a.da){var l=a.src;if(l&&l[kn])ko(l.i,a);else{var f=a.type,m=a.proxy;l.removeEventListener?l.removeEventListener(f,m,a.capture):l.detachEvent?l.detachEvent(su(f),m):l.addListener&&l.removeListener&&l.removeListener(m),(f=Mo(l))?(ko(f,a),f.h==0&&(f.src=null,l[Do]=null)):Js(a)}}}function su(a){return a in xo?xo[a]:xo[a]="on"+a}function _f(a,l){if(a.da)a=!0;else{l=new Jt(l,this);const f=a.listener,m=a.ha||a.src;a.fa&&Lo(a),a=f.call(m,l)}return a}function Mo(a){return a=a[Do],a instanceof ti?a:null}var Fo="__closure_events_fn_"+(Math.random()*1e9>>>0);function iu(a){return typeof a=="function"?a:(a[Fo]||(a[Fo]=function(l){return a.handleEvent(l)}),a[Fo])}function Ft(){R.call(this),this.i=new ti(this),this.M=this,this.G=null}_(Ft,R),Ft.prototype[kn]=!0,Ft.prototype.removeEventListener=function(a,l,f,m){ru(this,a,l,f,m)};function zt(a,l){var f,m=a.G;if(m)for(f=[];m;m=m.G)f.push(m);if(a=a.M,m=l.type||l,typeof l=="string")l=new I(l,a);else if(l instanceof I)l.target=l.target||a;else{var S=l;l=new I(m,a),eu(l,S)}S=!0;let b,F;if(f)for(F=f.length-1;F>=0;F--)b=l.g=f[F],S=ei(b,m,!0,l)&&S;if(b=l.g=a,S=ei(b,m,!0,l)&&S,S=ei(b,m,!1,l)&&S,f)for(F=0;F<f.length;F++)b=l.g=f[F],S=ei(b,m,!1,l)&&S}Ft.prototype.N=function(){if(Ft.Z.N.call(this),this.i){var a=this.i;for(const l in a.g){const f=a.g[l];for(let m=0;m<f.length;m++)Js(f[m]);delete a.g[l],a.h--}}this.G=null},Ft.prototype.J=function(a,l,f,m){return this.i.add(String(a),l,!1,f,m)},Ft.prototype.K=function(a,l,f,m){return this.i.add(String(a),l,!0,f,m)};function ei(a,l,f,m){if(l=a.i.g[String(l)],!l)return!0;l=l.concat();let S=!0;for(let b=0;b<l.length;++b){const F=l[b];if(F&&!F.da&&F.capture==f){const nt=F.listener,Pt=F.ha||F.src;F.fa&&ko(a.i,F),S=nt.call(Pt,m)!==!1&&S}}return S&&!m.defaultPrevented}function Ef(a,l){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=h(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(l)>2147483647?-1:o.setTimeout(a,l||0)}function ou(a){a.g=Ef(()=>{a.g=null,a.i&&(a.i=!1,ou(a))},a.l);const l=a.h;a.h=null,a.m.apply(null,l)}class yf extends R{constructor(l,f){super(),this.m=l,this.l=f,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:ou(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function kr(a){R.call(this),this.h=a,this.g={}}_(kr,R);var au=[];function uu(a){Zs(a.g,function(l,f){this.g.hasOwnProperty(f)&&Lo(l)},a),a.g={}}kr.prototype.N=function(){kr.Z.N.call(this),uu(this)},kr.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Uo=o.JSON.stringify,Tf=o.JSON.parse,wf=class{stringify(a){return o.JSON.stringify(a,void 0)}parse(a){return o.JSON.parse(a,void 0)}};function cu(){}function lu(){}var Vr={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Bo(){I.call(this,"d")}_(Bo,I);function $o(){I.call(this,"c")}_($o,I);var Vn={},hu=null;function ni(){return hu=hu||new Ft}Vn.Ia="serverreachability";function fu(a){I.call(this,Vn.Ia,a)}_(fu,I);function Dr(a){const l=ni();zt(l,new fu(l))}Vn.STAT_EVENT="statevent";function du(a,l){I.call(this,Vn.STAT_EVENT,a),this.stat=l}_(du,I);function Wt(a){const l=ni();zt(l,new du(l,a))}Vn.Ja="timingevent";function pu(a,l){I.call(this,Vn.Ja,a),this.size=l}_(pu,I);function xr(a,l){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){a()},l)}function Lr(){this.g=!0}Lr.prototype.ua=function(){this.g=!1};function If(a,l,f,m,S,b){a.info(function(){if(a.g)if(b){var F="",nt=b.split("&");for(let ht=0;ht<nt.length;ht++){var Pt=nt[ht].split("=");if(Pt.length>1){const kt=Pt[0];Pt=Pt[1];const Re=kt.split("_");F=Re.length>=2&&Re[1]=="type"?F+(kt+"="+Pt+"&"):F+(kt+"=redacted&")}}}else F=null;else F=b;return"XMLHTTP REQ ("+m+") [attempt "+S+"]: "+l+`
`+f+`
`+F})}function Af(a,l,f,m,S,b,F){a.info(function(){return"XMLHTTP RESP ("+m+") [ attempt "+S+"]: "+l+`
`+f+`
`+b+" "+F})}function nr(a,l,f,m){a.info(function(){return"XMLHTTP TEXT ("+l+"): "+Rf(a,f)+(m?" "+m:"")})}function vf(a,l){a.info(function(){return"TIMEOUT: "+l})}Lr.prototype.info=function(){};function Rf(a,l){if(!a.g)return l;if(!l)return null;try{const b=JSON.parse(l);if(b){for(a=0;a<b.length;a++)if(Array.isArray(b[a])){var f=b[a];if(!(f.length<2)){var m=f[1];if(Array.isArray(m)&&!(m.length<1)){var S=m[0];if(S!="noop"&&S!="stop"&&S!="close")for(let F=1;F<m.length;F++)m[F]=""}}}}return Uo(b)}catch{return l}}var ri={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},mu={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},gu;function qo(){}_(qo,cu),qo.prototype.g=function(){return new XMLHttpRequest},gu=new qo;function Mr(a){return encodeURIComponent(String(a))}function Sf(a){var l=1;a=a.split(":");const f=[];for(;l>0&&a.length;)f.push(a.shift()),l--;return a.length&&f.push(a.join(":")),f}function Ye(a,l,f,m){this.j=a,this.i=l,this.l=f,this.S=m||1,this.V=new kr(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new _u}function _u(){this.i=null,this.g="",this.h=!1}var Eu={},Ho={};function jo(a,l,f){a.M=1,a.A=ii(ve(l)),a.u=f,a.R=!0,yu(a,null)}function yu(a,l){a.F=Date.now(),si(a),a.B=ve(a.A);var f=a.B,m=a.S;Array.isArray(m)||(m=[String(m)]),ku(f.i,"t",m),a.C=0,f=a.j.L,a.h=new _u,a.g=Qu(a.j,f?l:null,!a.u),a.P>0&&(a.O=new yf(h(a.Y,a,a.g),a.P)),l=a.V,f=a.g,m=a.ba;var S="readystatechange";Array.isArray(S)||(S&&(au[0]=S.toString()),S=au);for(let b=0;b<S.length;b++){const F=nu(f,S[b],m||l.handleEvent,!1,l.h||l);if(!F)break;l.g[F.key]=F}l=a.J?Z1(a.J):{},a.u?(a.v||(a.v="POST"),l["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,l)):(a.v="GET",a.g.ea(a.B,a.v,null,l)),Dr(),If(a.i,a.v,a.B,a.l,a.S,a.u)}Ye.prototype.ba=function(a){a=a.target;const l=this.O;l&&Je(a)==3?l.j():this.Y(a)},Ye.prototype.Y=function(a){try{if(a==this.g)t:{const nt=Je(this.g),Pt=this.g.ya(),ht=this.g.ca();if(!(nt<3)&&(nt!=3||this.g&&(this.h.h||this.g.la()||Uu(this.g)))){this.K||nt!=4||Pt==7||(Pt==8||ht<=0?Dr(3):Dr(2)),Go(this);var l=this.g.ca();this.X=l;var f=Cf(this);if(this.o=l==200,Af(this.i,this.v,this.B,this.l,this.S,nt,l),this.o){if(this.U&&!this.L){e:{if(this.g){var m,S=this.g;if((m=S.g?S.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!y(m)){var b=m;break e}}b=null}if(a=b)nr(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,zo(this,a);else{this.o=!1,this.m=3,Wt(12),Dn(this),Fr(this);break t}}if(this.R){a=!0;let kt;for(;!this.K&&this.C<f.length;)if(kt=Pf(this,f),kt==Ho){nt==4&&(this.m=4,Wt(14),a=!1),nr(this.i,this.l,null,"[Incomplete Response]");break}else if(kt==Eu){this.m=4,Wt(15),nr(this.i,this.l,f,"[Invalid Chunk]"),a=!1;break}else nr(this.i,this.l,kt,null),zo(this,kt);if(Tu(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),nt!=4||f.length!=0||this.h.h||(this.m=1,Wt(16),a=!1),this.o=this.o&&a,!a)nr(this.i,this.l,f,"[Invalid Chunked Response]"),Dn(this),Fr(this);else if(f.length>0&&!this.W){this.W=!0;var F=this.j;F.g==this&&F.aa&&!F.P&&(F.j.info("Great, no buffering proxy detected. Bytes received: "+f.length),ta(F),F.P=!0,Wt(11))}}else nr(this.i,this.l,f,null),zo(this,f);nt==4&&Dn(this),this.o&&!this.K&&(nt==4?zu(this.j,this):(this.o=!1,si(this)))}else qf(this.g),l==400&&f.indexOf("Unknown SID")>0?(this.m=3,Wt(12)):(this.m=0,Wt(13)),Dn(this),Fr(this)}}}catch{}finally{}};function Cf(a){if(!Tu(a))return a.g.la();const l=Uu(a.g);if(l==="")return"";let f="";const m=l.length,S=Je(a.g)==4;if(!a.h.i){if(typeof TextDecoder>"u")return Dn(a),Fr(a),"";a.h.i=new o.TextDecoder}for(let b=0;b<m;b++)a.h.h=!0,f+=a.h.i.decode(l[b],{stream:!(S&&b==m-1)});return l.length=0,a.h.g+=f,a.C=0,a.h.g}function Tu(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function Pf(a,l){var f=a.C,m=l.indexOf(`
`,f);return m==-1?Ho:(f=Number(l.substring(f,m)),isNaN(f)?Eu:(m+=1,m+f>l.length?Ho:(l=l.slice(m,m+f),a.C=m+f,l)))}Ye.prototype.cancel=function(){this.K=!0,Dn(this)};function si(a){a.T=Date.now()+a.H,wu(a,a.H)}function wu(a,l){if(a.D!=null)throw Error("WatchDog timer not null");a.D=xr(h(a.aa,a),l)}function Go(a){a.D&&(o.clearTimeout(a.D),a.D=null)}Ye.prototype.aa=function(){this.D=null;const a=Date.now();a-this.T>=0?(vf(this.i,this.B),this.M!=2&&(Dr(),Wt(17)),Dn(this),this.m=2,Fr(this)):wu(this,this.T-a)};function Fr(a){a.j.I==0||a.K||zu(a.j,a)}function Dn(a){Go(a);var l=a.O;l&&typeof l.dispose=="function"&&l.dispose(),a.O=null,uu(a.V),a.g&&(l=a.g,a.g=null,l.abort(),l.dispose())}function zo(a,l){try{var f=a.j;if(f.I!=0&&(f.g==a||Wo(f.h,a))){if(!a.L&&Wo(f.h,a)&&f.I==3){try{var m=f.Ba.g.parse(l)}catch{m=null}if(Array.isArray(m)&&m.length==3){var S=m;if(S[0]==0){t:if(!f.v){if(f.g)if(f.g.F+3e3<a.F)li(f),ui(f);else break t;Zo(f),Wt(18)}}else f.xa=S[1],0<f.xa-f.K&&S[2]<37500&&f.F&&f.A==0&&!f.C&&(f.C=xr(h(f.Va,f),6e3));vu(f.h)<=1&&f.ta&&(f.ta=void 0)}else Ln(f,11)}else if((a.L||f.g==a)&&li(f),!y(l))for(S=f.Ba.g.parse(l),l=0;l<S.length;l++){let ht=S[l];const kt=ht[0];if(!(kt<=f.K))if(f.K=kt,ht=ht[1],f.I==2)if(ht[0]=="c"){f.M=ht[1],f.ba=ht[2];const Re=ht[3];Re!=null&&(f.ka=Re,f.j.info("VER="+f.ka));const Mn=ht[4];Mn!=null&&(f.za=Mn,f.j.info("SVER="+f.za));const Ze=ht[5];Ze!=null&&typeof Ze=="number"&&Ze>0&&(m=1.5*Ze,f.O=m,f.j.info("backChannelRequestTimeoutMs_="+m)),m=f;const tn=a.g;if(tn){const fi=tn.g?tn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(fi){var b=m.h;b.g||fi.indexOf("spdy")==-1&&fi.indexOf("quic")==-1&&fi.indexOf("h2")==-1||(b.j=b.l,b.g=new Set,b.h&&(Ko(b,b.h),b.h=null))}if(m.G){const ea=tn.g?tn.g.getResponseHeader("X-HTTP-Session-Id"):null;ea&&(m.wa=ea,ft(m.J,m.G,ea))}}f.I=3,f.l&&f.l.ra(),f.aa&&(f.T=Date.now()-a.F,f.j.info("Handshake RTT: "+f.T+"ms")),m=f;var F=a;if(m.na=Yu(m,m.L?m.ba:null,m.W),F.L){Ru(m.h,F);var nt=F,Pt=m.O;Pt&&(nt.H=Pt),nt.D&&(Go(nt),si(nt)),m.g=F}else ju(m);f.i.length>0&&ci(f)}else ht[0]!="stop"&&ht[0]!="close"||Ln(f,7);else f.I==3&&(ht[0]=="stop"||ht[0]=="close"?ht[0]=="stop"?Ln(f,7):Jo(f):ht[0]!="noop"&&f.l&&f.l.qa(ht),f.A=0)}}Dr(4)}catch{}}var bf=class{constructor(a,l){this.g=a,this.map=l}};function Iu(a){this.l=a||10,o.PerformanceNavigationTiming?(a=o.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Au(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function vu(a){return a.h?1:a.g?a.g.size:0}function Wo(a,l){return a.h?a.h==l:a.g?a.g.has(l):!1}function Ko(a,l){a.g?a.g.add(l):a.h=l}function Ru(a,l){a.h&&a.h==l?a.h=null:a.g&&a.g.has(l)&&a.g.delete(l)}Iu.prototype.cancel=function(){if(this.i=Su(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Su(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let l=a.i;for(const f of a.g.values())l=l.concat(f.G);return l}return N(a.i)}var Cu=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Nf(a,l){if(a){a=a.split("&");for(let f=0;f<a.length;f++){const m=a[f].indexOf("=");let S,b=null;m>=0?(S=a[f].substring(0,m),b=a[f].substring(m+1)):S=a[f],l(S,b?decodeURIComponent(b.replace(/\+/g," ")):"")}}}function Qe(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let l;a instanceof Qe?(this.l=a.l,Ur(this,a.j),this.o=a.o,this.g=a.g,Br(this,a.u),this.h=a.h,Yo(this,Vu(a.i)),this.m=a.m):a&&(l=String(a).match(Cu))?(this.l=!1,Ur(this,l[1]||"",!0),this.o=$r(l[2]||""),this.g=$r(l[3]||"",!0),Br(this,l[4]),this.h=$r(l[5]||"",!0),Yo(this,l[6]||"",!0),this.m=$r(l[7]||"")):(this.l=!1,this.i=new Hr(null,this.l))}Qe.prototype.toString=function(){const a=[];var l=this.j;l&&a.push(qr(l,Pu,!0),":");var f=this.g;return(f||l=="file")&&(a.push("//"),(l=this.o)&&a.push(qr(l,Pu,!0),"@"),a.push(Mr(f).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.u,f!=null&&a.push(":",String(f))),(f=this.h)&&(this.g&&f.charAt(0)!="/"&&a.push("/"),a.push(qr(f,f.charAt(0)=="/"?Vf:kf,!0))),(f=this.i.toString())&&a.push("?",f),(f=this.m)&&a.push("#",qr(f,xf)),a.join("")},Qe.prototype.resolve=function(a){const l=ve(this);let f=!!a.j;f?Ur(l,a.j):f=!!a.o,f?l.o=a.o:f=!!a.g,f?l.g=a.g:f=a.u!=null;var m=a.h;if(f)Br(l,a.u);else if(f=!!a.h){if(m.charAt(0)!="/")if(this.g&&!this.h)m="/"+m;else{var S=l.h.lastIndexOf("/");S!=-1&&(m=l.h.slice(0,S+1)+m)}if(S=m,S==".."||S==".")m="";else if(S.indexOf("./")!=-1||S.indexOf("/.")!=-1){m=S.lastIndexOf("/",0)==0,S=S.split("/");const b=[];for(let F=0;F<S.length;){const nt=S[F++];nt=="."?m&&F==S.length&&b.push(""):nt==".."?((b.length>1||b.length==1&&b[0]!="")&&b.pop(),m&&F==S.length&&b.push("")):(b.push(nt),m=!0)}m=b.join("/")}else m=S}return f?l.h=m:f=a.i.toString()!=="",f?Yo(l,Vu(a.i)):f=!!a.m,f&&(l.m=a.m),l};function ve(a){return new Qe(a)}function Ur(a,l,f){a.j=f?$r(l,!0):l,a.j&&(a.j=a.j.replace(/:$/,""))}function Br(a,l){if(l){if(l=Number(l),isNaN(l)||l<0)throw Error("Bad port number "+l);a.u=l}else a.u=null}function Yo(a,l,f){l instanceof Hr?(a.i=l,Lf(a.i,a.l)):(f||(l=qr(l,Df)),a.i=new Hr(l,a.l))}function ft(a,l,f){a.i.set(l,f)}function ii(a){return ft(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function $r(a,l){return a?l?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function qr(a,l,f){return typeof a=="string"?(a=encodeURI(a).replace(l,Of),f&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Of(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Pu=/[#\/\?@]/g,kf=/[#\?:]/g,Vf=/[#\?]/g,Df=/[#\?@]/g,xf=/#/g;function Hr(a,l){this.h=this.g=null,this.i=a||null,this.j=!!l}function xn(a){a.g||(a.g=new Map,a.h=0,a.i&&Nf(a.i,function(l,f){a.add(decodeURIComponent(l.replace(/\+/g," ")),f)}))}r=Hr.prototype,r.add=function(a,l){xn(this),this.i=null,a=rr(this,a);let f=this.g.get(a);return f||this.g.set(a,f=[]),f.push(l),this.h+=1,this};function bu(a,l){xn(a),l=rr(a,l),a.g.has(l)&&(a.i=null,a.h-=a.g.get(l).length,a.g.delete(l))}function Nu(a,l){return xn(a),l=rr(a,l),a.g.has(l)}r.forEach=function(a,l){xn(this),this.g.forEach(function(f,m){f.forEach(function(S){a.call(l,S,m,this)},this)},this)};function Ou(a,l){xn(a);let f=[];if(typeof l=="string")Nu(a,l)&&(f=f.concat(a.g.get(rr(a,l))));else for(a=Array.from(a.g.values()),l=0;l<a.length;l++)f=f.concat(a[l]);return f}r.set=function(a,l){return xn(this),this.i=null,a=rr(this,a),Nu(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[l]),this.h+=1,this},r.get=function(a,l){return a?(a=Ou(this,a),a.length>0?String(a[0]):l):l};function ku(a,l,f){bu(a,l),f.length>0&&(a.i=null,a.g.set(rr(a,l),N(f)),a.h+=f.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],l=Array.from(this.g.keys());for(let m=0;m<l.length;m++){var f=l[m];const S=Mr(f);f=Ou(this,f);for(let b=0;b<f.length;b++){let F=S;f[b]!==""&&(F+="="+Mr(f[b])),a.push(F)}}return this.i=a.join("&")};function Vu(a){const l=new Hr;return l.i=a.i,a.g&&(l.g=new Map(a.g),l.h=a.h),l}function rr(a,l){return l=String(l),a.j&&(l=l.toLowerCase()),l}function Lf(a,l){l&&!a.j&&(xn(a),a.i=null,a.g.forEach(function(f,m){const S=m.toLowerCase();m!=S&&(bu(this,m),ku(this,S,f))},a)),a.j=l}function Mf(a,l){const f=new Lr;if(o.Image){const m=new Image;m.onload=p(Xe,f,"TestLoadImage: loaded",!0,l,m),m.onerror=p(Xe,f,"TestLoadImage: error",!1,l,m),m.onabort=p(Xe,f,"TestLoadImage: abort",!1,l,m),m.ontimeout=p(Xe,f,"TestLoadImage: timeout",!1,l,m),o.setTimeout(function(){m.ontimeout&&m.ontimeout()},1e4),m.src=a}else l(!1)}function Ff(a,l){const f=new Lr,m=new AbortController,S=setTimeout(()=>{m.abort(),Xe(f,"TestPingServer: timeout",!1,l)},1e4);fetch(a,{signal:m.signal}).then(b=>{clearTimeout(S),b.ok?Xe(f,"TestPingServer: ok",!0,l):Xe(f,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(S),Xe(f,"TestPingServer: error",!1,l)})}function Xe(a,l,f,m,S){try{S&&(S.onload=null,S.onerror=null,S.onabort=null,S.ontimeout=null),m(f)}catch{}}function Uf(){this.g=new wf}function Qo(a){this.i=a.Sb||null,this.h=a.ab||!1}_(Qo,cu),Qo.prototype.g=function(){return new oi(this.i,this.h)};function oi(a,l){Ft.call(this),this.H=a,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}_(oi,Ft),r=oi.prototype,r.open=function(a,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=l,this.readyState=1,Gr(this)},r.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const l={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(l.body=a),(this.H||o).fetch(new Request(this.D,l)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,jr(this)),this.readyState=0},r.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Gr(this)),this.g&&(this.readyState=3,Gr(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Du(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function Du(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}r.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var l=a.value?a.value:new Uint8Array(0);(l=this.B.decode(l,{stream:!a.done}))&&(this.response=this.responseText+=l)}a.done?jr(this):Gr(this),this.readyState==3&&Du(this)}},r.Oa=function(a){this.g&&(this.response=this.responseText=a,jr(this))},r.Na=function(a){this.g&&(this.response=a,jr(this))},r.ga=function(){this.g&&jr(this)};function jr(a){a.readyState=4,a.l=null,a.j=null,a.B=null,Gr(a)}r.setRequestHeader=function(a,l){this.A.append(a,l)},r.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],l=this.h.entries();for(var f=l.next();!f.done;)f=f.value,a.push(f[0]+": "+f[1]),f=l.next();return a.join(`\r
`)};function Gr(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(oi.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function xu(a){let l="";return Zs(a,function(f,m){l+=m,l+=":",l+=f,l+=`\r
`}),l}function Xo(a,l,f){t:{for(m in f){var m=!1;break t}m=!0}m||(f=xu(f),typeof a=="string"?f!=null&&Mr(f):ft(a,l,f))}function Et(a){Ft.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}_(Et,Ft);var Bf=/^https?$/i,$f=["POST","PUT"];r=Et.prototype,r.Fa=function(a){this.H=a},r.ea=function(a,l,f,m){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);l=l?l.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():gu.g(),this.g.onreadystatechange=v(h(this.Ca,this));try{this.B=!0,this.g.open(l,String(a),!0),this.B=!1}catch(b){Lu(this,b);return}if(a=f||"",f=new Map(this.headers),m)if(Object.getPrototypeOf(m)===Object.prototype)for(var S in m)f.set(S,m[S]);else if(typeof m.keys=="function"&&typeof m.get=="function")for(const b of m.keys())f.set(b,m.get(b));else throw Error("Unknown input type for opt_headers: "+String(m));m=Array.from(f.keys()).find(b=>b.toLowerCase()=="content-type"),S=o.FormData&&a instanceof o.FormData,!(Array.prototype.indexOf.call($f,l,void 0)>=0)||m||S||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[b,F]of f)this.g.setRequestHeader(b,F);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(b){Lu(this,b)}};function Lu(a,l){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=l,a.o=5,Mu(a),ai(a)}function Mu(a){a.A||(a.A=!0,zt(a,"complete"),zt(a,"error"))}r.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,zt(this,"complete"),zt(this,"abort"),ai(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),ai(this,!0)),Et.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?Fu(this):this.Xa())},r.Xa=function(){Fu(this)};function Fu(a){if(a.h&&typeof i<"u"){if(a.v&&Je(a)==4)setTimeout(a.Ca.bind(a),0);else if(zt(a,"readystatechange"),Je(a)==4){a.h=!1;try{const b=a.ca();t:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break t;default:l=!1}var f;if(!(f=l)){var m;if(m=b===0){let F=String(a.D).match(Cu)[1]||null;!F&&o.self&&o.self.location&&(F=o.self.location.protocol.slice(0,-1)),m=!Bf.test(F?F.toLowerCase():"")}f=m}if(f)zt(a,"complete"),zt(a,"success");else{a.o=6;try{var S=Je(a)>2?a.g.statusText:""}catch{S=""}a.l=S+" ["+a.ca()+"]",Mu(a)}}finally{ai(a)}}}}function ai(a,l){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);const f=a.g;a.g=null,l||zt(a,"ready");try{f.onreadystatechange=null}catch{}}}r.isActive=function(){return!!this.g};function Je(a){return a.g?a.g.readyState:0}r.ca=function(){try{return Je(this)>2?this.g.status:-1}catch{return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.La=function(a){if(this.g){var l=this.g.responseText;return a&&l.indexOf(a)==0&&(l=l.substring(a.length)),Tf(l)}};function Uu(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function qf(a){const l={};a=(a.g&&Je(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let m=0;m<a.length;m++){if(y(a[m]))continue;var f=Sf(a[m]);const S=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();const b=l[S]||[];l[S]=b,b.push(f)}pf(l,function(m){return m.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function zr(a,l,f){return f&&f.internalChannelParams&&f.internalChannelParams[a]||l}function Bu(a){this.za=0,this.i=[],this.j=new Lr,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=zr("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=zr("baseRetryDelayMs",5e3,a),this.Za=zr("retryDelaySeedMs",1e4,a),this.Ta=zr("forwardChannelMaxRetries",2,a),this.va=zr("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new Iu(a&&a.concurrentRequestLimit),this.Ba=new Uf,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=Bu.prototype,r.ka=8,r.I=1,r.connect=function(a,l,f,m){Wt(0),this.W=a,this.H=l||{},f&&m!==void 0&&(this.H.OSID=f,this.H.OAID=m),this.F=this.X,this.J=Yu(this,null,this.W),ci(this)};function Jo(a){if($u(a),a.I==3){var l=a.V++,f=ve(a.J);if(ft(f,"SID",a.M),ft(f,"RID",l),ft(f,"TYPE","terminate"),Wr(a,f),l=new Ye(a,a.j,l),l.M=2,l.A=ii(ve(f)),f=!1,o.navigator&&o.navigator.sendBeacon)try{f=o.navigator.sendBeacon(l.A.toString(),"")}catch{}!f&&o.Image&&(new Image().src=l.A,f=!0),f||(l.g=Qu(l.j,null),l.g.ea(l.A)),l.F=Date.now(),si(l)}Ku(a)}function ui(a){a.g&&(ta(a),a.g.cancel(),a.g=null)}function $u(a){ui(a),a.v&&(o.clearTimeout(a.v),a.v=null),li(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&o.clearTimeout(a.m),a.m=null)}function ci(a){if(!Au(a.h)&&!a.m){a.m=!0;var l=a.Ea;_e||E(),xt||(_e(),xt=!0),A.add(l,a),a.D=0}}function Hf(a,l){return vu(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=l.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=xr(h(a.Ea,a,l),Wu(a,a.D)),a.D++,!0)}r.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;const S=new Ye(this,this.j,a);let b=this.o;if(this.U&&(b?(b=Z1(b),eu(b,this.U)):b=this.U),this.u!==null||this.R||(S.J=b,b=null),this.S)t:{for(var l=0,f=0;f<this.i.length;f++){e:{var m=this.i[f];if("__data__"in m.map&&(m=m.map.__data__,typeof m=="string")){m=m.length;break e}m=void 0}if(m===void 0)break;if(l+=m,l>4096){l=f;break t}if(l===4096||f===this.i.length-1){l=f+1;break t}}l=1e3}else l=1e3;l=Hu(this,S,l),f=ve(this.J),ft(f,"RID",a),ft(f,"CVER",22),this.G&&ft(f,"X-HTTP-Session-Id",this.G),Wr(this,f),b&&(this.R?l="headers="+Mr(xu(b))+"&"+l:this.u&&Xo(f,this.u,b)),Ko(this.h,S),this.Ra&&ft(f,"TYPE","init"),this.S?(ft(f,"$req",l),ft(f,"SID","null"),S.U=!0,jo(S,f,null)):jo(S,f,l),this.I=2}}else this.I==3&&(a?qu(this,a):this.i.length==0||Au(this.h)||qu(this))};function qu(a,l){var f;l?f=l.l:f=a.V++;const m=ve(a.J);ft(m,"SID",a.M),ft(m,"RID",f),ft(m,"AID",a.K),Wr(a,m),a.u&&a.o&&Xo(m,a.u,a.o),f=new Ye(a,a.j,f,a.D+1),a.u===null&&(f.J=a.o),l&&(a.i=l.G.concat(a.i)),l=Hu(a,f,1e3),f.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),Ko(a.h,f),jo(f,m,l)}function Wr(a,l){a.H&&Zs(a.H,function(f,m){ft(l,m,f)}),a.l&&Zs({},function(f,m){ft(l,m,f)})}function Hu(a,l,f){f=Math.min(a.i.length,f);const m=a.l?h(a.l.Ka,a.l,a):null;t:{var S=a.i;let nt=-1;for(;;){const Pt=["count="+f];nt==-1?f>0?(nt=S[0].g,Pt.push("ofs="+nt)):nt=0:Pt.push("ofs="+nt);let ht=!0;for(let kt=0;kt<f;kt++){var b=S[kt].g;const Re=S[kt].map;if(b-=nt,b<0)nt=Math.max(0,S[kt].g-100),ht=!1;else try{b="req"+b+"_"||"";try{var F=Re instanceof Map?Re:Object.entries(Re);for(const[Mn,Ze]of F){let tn=Ze;u(Ze)&&(tn=Uo(Ze)),Pt.push(b+Mn+"="+encodeURIComponent(tn))}}catch(Mn){throw Pt.push(b+"type="+encodeURIComponent("_badmap")),Mn}}catch{m&&m(Re)}}if(ht){F=Pt.join("&");break t}}F=void 0}return a=a.i.splice(0,f),l.G=a,F}function ju(a){if(!a.g&&!a.v){a.Y=1;var l=a.Da;_e||E(),xt||(_e(),xt=!0),A.add(l,a),a.A=0}}function Zo(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=xr(h(a.Da,a),Wu(a,a.A)),a.A++,!0)}r.Da=function(){if(this.v=null,Gu(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=xr(h(this.Wa,this),a)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Wt(10),ui(this),Gu(this))};function ta(a){a.B!=null&&(o.clearTimeout(a.B),a.B=null)}function Gu(a){a.g=new Ye(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var l=ve(a.na);ft(l,"RID","rpc"),ft(l,"SID",a.M),ft(l,"AID",a.K),ft(l,"CI",a.F?"0":"1"),!a.F&&a.ia&&ft(l,"TO",a.ia),ft(l,"TYPE","xmlhttp"),Wr(a,l),a.u&&a.o&&Xo(l,a.u,a.o),a.O&&(a.g.H=a.O);var f=a.g;a=a.ba,f.M=1,f.A=ii(ve(l)),f.u=null,f.R=!0,yu(f,a)}r.Va=function(){this.C!=null&&(this.C=null,ui(this),Zo(this),Wt(19))};function li(a){a.C!=null&&(o.clearTimeout(a.C),a.C=null)}function zu(a,l){var f=null;if(a.g==l){li(a),ta(a),a.g=null;var m=2}else if(Wo(a.h,l))f=l.G,Ru(a.h,l),m=1;else return;if(a.I!=0){if(l.o)if(m==1){f=l.u?l.u.length:0,l=Date.now()-l.F;var S=a.D;m=ni(),zt(m,new pu(m,f)),ci(a)}else ju(a);else if(S=l.m,S==3||S==0&&l.X>0||!(m==1&&Hf(a,l)||m==2&&Zo(a)))switch(f&&f.length>0&&(l=a.h,l.i=l.i.concat(f)),S){case 1:Ln(a,5);break;case 4:Ln(a,10);break;case 3:Ln(a,6);break;default:Ln(a,2)}}}function Wu(a,l){let f=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(f*=2),f*l}function Ln(a,l){if(a.j.info("Error code "+l),l==2){var f=h(a.bb,a),m=a.Ua;const S=!m;m=new Qe(m||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||Ur(m,"https"),ii(m),S?Mf(m.toString(),f):Ff(m.toString(),f)}else Wt(2);a.I=0,a.l&&a.l.pa(l),Ku(a),$u(a)}r.bb=function(a){a?(this.j.info("Successfully pinged google.com"),Wt(2)):(this.j.info("Failed to ping google.com"),Wt(1))};function Ku(a){if(a.I=0,a.ja=[],a.l){const l=Su(a.h);(l.length!=0||a.i.length!=0)&&(V(a.ja,l),V(a.ja,a.i),a.h.i.length=0,N(a.i),a.i.length=0),a.l.oa()}}function Yu(a,l,f){var m=f instanceof Qe?ve(f):new Qe(f);if(m.g!="")l&&(m.g=l+"."+m.g),Br(m,m.u);else{var S=o.location;m=S.protocol,l=l?l+"."+S.hostname:S.hostname,S=+S.port;const b=new Qe(null);m&&Ur(b,m),l&&(b.g=l),S&&Br(b,S),f&&(b.h=f),m=b}return f=a.G,l=a.wa,f&&l&&ft(m,f,l),ft(m,"VER",a.ka),Wr(a,m),m}function Qu(a,l,f){if(l&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return l=a.Aa&&!a.ma?new Et(new Qo({ab:f})):new Et(a.ma),l.Fa(a.L),l}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function Xu(){}r=Xu.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function hi(){}hi.prototype.g=function(a,l){return new ae(a,l)};function ae(a,l){Ft.call(this),this.g=new Bu(l),this.l=a,this.h=l&&l.messageUrlParams||null,a=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(a?a["X-WebChannel-Content-Type"]=l.messageContentType:a={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.sa&&(a?a["X-WebChannel-Client-Profile"]=l.sa:a={"X-WebChannel-Client-Profile":l.sa}),this.g.U=a,(a=l&&l.Qb)&&!y(a)&&(this.g.u=a),this.A=l&&l.supportsCrossDomainXhr||!1,this.v=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!y(l)&&(this.g.G=l,a=this.h,a!==null&&l in a&&(a=this.h,l in a&&delete a[l])),this.j=new sr(this)}_(ae,Ft),ae.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},ae.prototype.close=function(){Jo(this.g)},ae.prototype.o=function(a){var l=this.g;if(typeof a=="string"){var f={};f.__data__=a,a=f}else this.v&&(f={},f.__data__=Uo(a),a=f);l.i.push(new bf(l.Ya++,a)),l.I==3&&ci(l)},ae.prototype.N=function(){this.g.l=null,delete this.j,Jo(this.g),delete this.g,ae.Z.N.call(this)};function Ju(a){Bo.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var l=a.__sm__;if(l){t:{for(const f in l){a=f;break t}a=void 0}(this.i=a)&&(a=this.i,l=l!==null&&a in l?l[a]:void 0),this.data=l}else this.data=a}_(Ju,Bo);function Zu(){$o.call(this),this.status=1}_(Zu,$o);function sr(a){this.g=a}_(sr,Xu),sr.prototype.ra=function(){zt(this.g,"a")},sr.prototype.qa=function(a){zt(this.g,new Ju(a))},sr.prototype.pa=function(a){zt(this.g,new Zu)},sr.prototype.oa=function(){zt(this.g,"b")},hi.prototype.createWebChannel=hi.prototype.g,ae.prototype.send=ae.prototype.o,ae.prototype.open=ae.prototype.m,ae.prototype.close=ae.prototype.close,v2=function(){return new hi},A2=function(){return ni()},I2=Vn,Pa={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},ri.NO_ERROR=0,ri.TIMEOUT=8,ri.HTTP_ERROR=6,Ri=ri,mu.COMPLETE="complete",w2=mu,lu.EventType=Vr,Vr.OPEN="a",Vr.CLOSE="b",Vr.ERROR="c",Vr.MESSAGE="d",Ft.prototype.listen=Ft.prototype.J,Jr=lu,Et.prototype.listenOnce=Et.prototype.K,Et.prototype.getLastError=Et.prototype.Ha,Et.prototype.getLastErrorCode=Et.prototype.ya,Et.prototype.getStatus=Et.prototype.ca,Et.prototype.getResponseJson=Et.prototype.La,Et.prototype.getResponseText=Et.prototype.la,Et.prototype.send=Et.prototype.ea,Et.prototype.setWithCredentials=Et.prototype.Fa,T2=Et}).apply(typeof pi<"u"?pi:typeof self<"u"?self:typeof window<"u"?window:{});/*!
 * re2js
 * RE2JS is the JavaScript port of RE2, a regular expression engine that provides linear time matching
 *
 * @version v0.4.3
 * @author Alexey Vasiliev
 * @homepage https://github.com/le0pard/re2js#readme
 * @repository github:le0pard/re2js
 * @license MIT
 */const mt=class mt{};g(mt,"FOLD_CASE",1),g(mt,"LITERAL",2),g(mt,"CLASS_NL",4),g(mt,"DOT_NL",8),g(mt,"ONE_LINE",16),g(mt,"NON_GREEDY",32),g(mt,"PERL_X",64),g(mt,"UNICODE_GROUPS",128),g(mt,"WAS_DOLLAR",256),g(mt,"MATCH_NL",mt.CLASS_NL|mt.DOT_NL),g(mt,"PERL",mt.CLASS_NL|mt.ONE_LINE|mt.PERL_X|mt.UNICODE_GROUPS),g(mt,"POSIX",0),g(mt,"UNANCHORED",0),g(mt,"ANCHOR_START",1),g(mt,"ANCHOR_BOTH",2);let B=mt;class P{static toUpperCase(t){const e=String.fromCodePoint(t).toUpperCase();if(e.length>1)return t;const n=String.fromCodePoint(e.codePointAt(0)).toLowerCase();return n.length>1||n.codePointAt(0)!==t?t:e.codePointAt(0)}static toLowerCase(t){const e=String.fromCodePoint(t).toLowerCase();if(e.length>1)return t;const n=String.fromCodePoint(e.codePointAt(0)).toUpperCase();return n.length>1||n.codePointAt(0)!==t?t:e.codePointAt(0)}}g(P,"CODES",new Map([["\x07",7],["\b",8],["	",9],[`
`,10],["\v",11],["\f",12],["\r",13],[" ",32],['"',34],["$",36],["&",38],["(",40],[")",41],["*",42],["+",43],["-",45],[".",46],["0",48],["1",49],["2",50],["3",51],["4",52],["5",53],["6",54],["7",55],["8",56],["9",57],[":",58],["<",60],[">",62],["?",63],["A",65],["B",66],["C",67],["F",70],["P",80],["Q",81],["U",85],["Z",90],["[",91],["\\",92],["]",93],["^",94],["_",95],["a",97],["b",98],["f",102],["i",105],["m",109],["n",110],["r",114],["s",115],["t",116],["v",118],["x",120],["z",122],["{",123],["|",124],["}",125]]));const d=class d{};g(d,"CASE_ORBIT",new Map([[75,107],[107,8490],[8490,75],[83,115],[115,383],[383,83],[181,924],[924,956],[956,181],[197,229],[229,8491],[8491,197],[452,453],[453,454],[454,452],[455,456],[456,457],[457,455],[458,459],[459,460],[460,458],[497,498],[498,499],[499,497],[837,921],[921,953],[953,8126],[8126,837],[914,946],[946,976],[976,914],[917,949],[949,1013],[1013,917],[920,952],[952,977],[977,1012],[1012,920],[922,954],[954,1008],[1008,922],[928,960],[960,982],[982,928],[929,961],[961,1009],[1009,929],[931,962],[962,963],[963,931],[934,966],[966,981],[981,934],[937,969],[969,8486],[8486,937],[1042,1074],[1074,7296],[7296,1042],[1044,1076],[1076,7297],[7297,1044],[1054,1086],[1086,7298],[7298,1054],[1057,1089],[1089,7299],[7299,1057],[1058,1090],[1090,7300],[7300,7301],[7301,1058],[1066,1098],[1098,7302],[7302,1066],[1122,1123],[1123,7303],[7303,1122],[7304,42570],[42570,42571],[42571,7304],[7776,7777],[7777,7835],[7835,7776],[223,7838],[7838,223],[8064,8072],[8072,8064],[8065,8073],[8073,8065],[8066,8074],[8074,8066],[8067,8075],[8075,8067],[8068,8076],[8076,8068],[8069,8077],[8077,8069],[8070,8078],[8078,8070],[8071,8079],[8079,8071],[8080,8088],[8088,8080],[8081,8089],[8089,8081],[8082,8090],[8090,8082],[8083,8091],[8091,8083],[8084,8092],[8092,8084],[8085,8093],[8093,8085],[8086,8094],[8094,8086],[8087,8095],[8095,8087],[8096,8104],[8104,8096],[8097,8105],[8105,8097],[8098,8106],[8106,8098],[8099,8107],[8107,8099],[8100,8108],[8108,8100],[8101,8109],[8109,8101],[8102,8110],[8110,8102],[8103,8111],[8111,8103],[8115,8124],[8124,8115],[8131,8140],[8140,8131],[912,8147],[8147,912],[944,8163],[8163,944],[8179,8188],[8188,8179],[64261,64262],[64262,64261],[66560,66600],[66600,66560],[66561,66601],[66601,66561],[66562,66602],[66602,66562],[66563,66603],[66603,66563],[66564,66604],[66604,66564],[66565,66605],[66605,66565],[66566,66606],[66606,66566],[66567,66607],[66607,66567],[66568,66608],[66608,66568],[66569,66609],[66609,66569],[66570,66610],[66610,66570],[66571,66611],[66611,66571],[66572,66612],[66612,66572],[66573,66613],[66613,66573],[66574,66614],[66614,66574],[66575,66615],[66615,66575],[66576,66616],[66616,66576],[66577,66617],[66617,66577],[66578,66618],[66618,66578],[66579,66619],[66619,66579],[66580,66620],[66620,66580],[66581,66621],[66621,66581],[66582,66622],[66622,66582],[66583,66623],[66623,66583],[66584,66624],[66624,66584],[66585,66625],[66625,66585],[66586,66626],[66626,66586],[66587,66627],[66627,66587],[66588,66628],[66628,66588],[66589,66629],[66629,66589],[66590,66630],[66630,66590],[66591,66631],[66631,66591],[66592,66632],[66632,66592],[66593,66633],[66633,66593],[66594,66634],[66634,66594],[66595,66635],[66635,66595],[66596,66636],[66636,66596],[66597,66637],[66637,66597],[66598,66638],[66638,66598],[66599,66639],[66639,66599],[66736,66776],[66776,66736],[66737,66777],[66777,66737],[66738,66778],[66778,66738],[66739,66779],[66779,66739],[66740,66780],[66780,66740],[66741,66781],[66781,66741],[66742,66782],[66782,66742],[66743,66783],[66783,66743],[66744,66784],[66784,66744],[66745,66785],[66785,66745],[66746,66786],[66786,66746],[66747,66787],[66787,66747],[66748,66788],[66788,66748],[66749,66789],[66789,66749],[66750,66790],[66790,66750],[66751,66791],[66791,66751],[66752,66792],[66792,66752],[66753,66793],[66793,66753],[66754,66794],[66794,66754],[66755,66795],[66795,66755],[66756,66796],[66796,66756],[66757,66797],[66797,66757],[66758,66798],[66798,66758],[66759,66799],[66799,66759],[66760,66800],[66800,66760],[66761,66801],[66801,66761],[66762,66802],[66802,66762],[66763,66803],[66803,66763],[66764,66804],[66804,66764],[66765,66805],[66805,66765],[66766,66806],[66806,66766],[66767,66807],[66807,66767],[66768,66808],[66808,66768],[66769,66809],[66809,66769],[66770,66810],[66810,66770],[66771,66811],[66811,66771],[66928,66967],[66967,66928],[66929,66968],[66968,66929],[66930,66969],[66969,66930],[66931,66970],[66970,66931],[66932,66971],[66971,66932],[66933,66972],[66972,66933],[66934,66973],[66973,66934],[66935,66974],[66974,66935],[66936,66975],[66975,66936],[66937,66976],[66976,66937],[66938,66977],[66977,66938],[66940,66979],[66979,66940],[66941,66980],[66980,66941],[66942,66981],[66981,66942],[66943,66982],[66982,66943],[66944,66983],[66983,66944],[66945,66984],[66984,66945],[66946,66985],[66985,66946],[66947,66986],[66986,66947],[66948,66987],[66987,66948],[66949,66988],[66988,66949],[66950,66989],[66989,66950],[66951,66990],[66990,66951],[66952,66991],[66991,66952],[66953,66992],[66992,66953],[66954,66993],[66993,66954],[66956,66995],[66995,66956],[66957,66996],[66996,66957],[66958,66997],[66997,66958],[66959,66998],[66998,66959],[66960,66999],[66999,66960],[66961,67e3],[67e3,66961],[66962,67001],[67001,66962],[66964,67003],[67003,66964],[66965,67004],[67004,66965],[68736,68800],[68800,68736],[68737,68801],[68801,68737],[68738,68802],[68802,68738],[68739,68803],[68803,68739],[68740,68804],[68804,68740],[68741,68805],[68805,68741],[68742,68806],[68806,68742],[68743,68807],[68807,68743],[68744,68808],[68808,68744],[68745,68809],[68809,68745],[68746,68810],[68810,68746],[68747,68811],[68811,68747],[68748,68812],[68812,68748],[68749,68813],[68813,68749],[68750,68814],[68814,68750],[68751,68815],[68815,68751],[68752,68816],[68816,68752],[68753,68817],[68817,68753],[68754,68818],[68818,68754],[68755,68819],[68819,68755],[68756,68820],[68820,68756],[68757,68821],[68821,68757],[68758,68822],[68822,68758],[68759,68823],[68823,68759],[68760,68824],[68824,68760],[68761,68825],[68825,68761],[68762,68826],[68826,68762],[68763,68827],[68827,68763],[68764,68828],[68828,68764],[68765,68829],[68829,68765],[68766,68830],[68830,68766],[68767,68831],[68831,68767],[68768,68832],[68832,68768],[68769,68833],[68833,68769],[68770,68834],[68834,68770],[68771,68835],[68835,68771],[68772,68836],[68836,68772],[68773,68837],[68837,68773],[68774,68838],[68838,68774],[68775,68839],[68839,68775],[68776,68840],[68840,68776],[68777,68841],[68841,68777],[68778,68842],[68842,68778],[68779,68843],[68843,68779],[68780,68844],[68844,68780],[68781,68845],[68845,68781],[68782,68846],[68846,68782],[68783,68847],[68847,68783],[68784,68848],[68848,68784],[68785,68849],[68849,68785],[68786,68850],[68850,68786],[71840,71872],[71872,71840],[71841,71873],[71873,71841],[71842,71874],[71874,71842],[71843,71875],[71875,71843],[71844,71876],[71876,71844],[71845,71877],[71877,71845],[71846,71878],[71878,71846],[71847,71879],[71879,71847],[71848,71880],[71880,71848],[71849,71881],[71881,71849],[71850,71882],[71882,71850],[71851,71883],[71883,71851],[71852,71884],[71884,71852],[71853,71885],[71885,71853],[71854,71886],[71886,71854],[71855,71887],[71887,71855],[71856,71888],[71888,71856],[71857,71889],[71889,71857],[71858,71890],[71890,71858],[71859,71891],[71891,71859],[71860,71892],[71892,71860],[71861,71893],[71893,71861],[71862,71894],[71894,71862],[71863,71895],[71895,71863],[71864,71896],[71896,71864],[71865,71897],[71897,71865],[71866,71898],[71898,71866],[71867,71899],[71899,71867],[71868,71900],[71900,71868],[71869,71901],[71901,71869],[71870,71902],[71902,71870],[71871,71903],[71903,71871],[93760,93792],[93792,93760],[93761,93793],[93793,93761],[93762,93794],[93794,93762],[93763,93795],[93795,93763],[93764,93796],[93796,93764],[93765,93797],[93797,93765],[93766,93798],[93798,93766],[93767,93799],[93799,93767],[93768,93800],[93800,93768],[93769,93801],[93801,93769],[93770,93802],[93802,93770],[93771,93803],[93803,93771],[93772,93804],[93804,93772],[93773,93805],[93805,93773],[93774,93806],[93806,93774],[93775,93807],[93807,93775],[93776,93808],[93808,93776],[93777,93809],[93809,93777],[93778,93810],[93810,93778],[93779,93811],[93811,93779],[93780,93812],[93812,93780],[93781,93813],[93813,93781],[93782,93814],[93814,93782],[93783,93815],[93815,93783],[93784,93816],[93816,93784],[93785,93817],[93817,93785],[93786,93818],[93818,93786],[93787,93819],[93819,93787],[93788,93820],[93820,93788],[93789,93821],[93821,93789],[93790,93822],[93822,93790],[93791,93823],[93823,93791],[125184,125218],[125218,125184],[125185,125219],[125219,125185],[125186,125220],[125220,125186],[125187,125221],[125221,125187],[125188,125222],[125222,125188],[125189,125223],[125223,125189],[125190,125224],[125224,125190],[125191,125225],[125225,125191],[125192,125226],[125226,125192],[125193,125227],[125227,125193],[125194,125228],[125228,125194],[125195,125229],[125229,125195],[125196,125230],[125230,125196],[125197,125231],[125231,125197],[125198,125232],[125232,125198],[125199,125233],[125233,125199],[125200,125234],[125234,125200],[125201,125235],[125235,125201],[125202,125236],[125236,125202],[125203,125237],[125237,125203],[125204,125238],[125238,125204],[125205,125239],[125239,125205],[125206,125240],[125240,125206],[125207,125241],[125241,125207],[125208,125242],[125242,125208],[125209,125243],[125243,125209],[125210,125244],[125244,125210],[125211,125245],[125245,125211],[125212,125246],[125246,125212],[125213,125247],[125247,125213],[125214,125248],[125248,125214],[125215,125249],[125249,125215],[125216,125250],[125250,125216],[125217,125251],[125251,125217]])),g(d,"C",[[0,31,1],[127,159,1],[173,888,715],[889,896,7],[897,899,1],[907,909,2],[930,1328,398],[1367,1368,1],[1419,1420,1],[1424,1480,56],[1481,1487,1],[1515,1518,1],[1525,1541,1],[1564,1757,193],[1806,1807,1],[1867,1868,1],[1970,1983,1],[2043,2044,1],[2094,2095,1],[2111,2140,29],[2141,2143,2],[2155,2159,1],[2191,2199,1],[2274,2436,162],[2445,2446,1],[2449,2450,1],[2473,2481,8],[2483,2485,1],[2490,2491,1],[2501,2502,1],[2505,2506,1],[2511,2518,1],[2520,2523,1],[2526,2532,6],[2533,2559,26],[2560,2564,4],[2571,2574,1],[2577,2578,1],[2601,2609,8],[2612,2618,3],[2619,2621,2],[2627,2630,1],[2633,2634,1],[2638,2640,1],[2642,2648,1],[2653,2655,2],[2656,2661,1],[2679,2688,1],[2692,2702,10],[2706,2729,23],[2737,2740,3],[2746,2747,1],[2758,2766,4],[2767,2769,2],[2770,2783,1],[2788,2789,1],[2802,2808,1],[2816,2820,4],[2829,2830,1],[2833,2834,1],[2857,2865,8],[2868,2874,6],[2875,2885,10],[2886,2889,3],[2890,2894,4],[2895,2900,1],[2904,2907,1],[2910,2916,6],[2917,2936,19],[2937,2945,1],[2948,2955,7],[2956,2957,1],[2961,2966,5],[2967,2968,1],[2971,2973,2],[2976,2978,1],[2981,2983,1],[2987,2989,1],[3002,3005,1],[3011,3013,1],[3017,3022,5],[3023,3025,2],[3026,3030,1],[3032,3045,1],[3067,3071,1],[3085,3089,4],[3113,3130,17],[3131,3141,10],[3145,3150,5],[3151,3156,1],[3159,3163,4],[3164,3166,2],[3167,3172,5],[3173,3184,11],[3185,3190,1],[3213,3217,4],[3241,3252,11],[3258,3259,1],[3269,3273,4],[3278,3284,1],[3287,3292,1],[3295,3300,5],[3301,3312,11],[3316,3327,1],[3341,3345,4],[3397,3401,4],[3408,3411,1],[3428,3429,1],[3456,3460,4],[3479,3481,1],[3506,3516,10],[3518,3519,1],[3527,3529,1],[3531,3534,1],[3541,3543,2],[3552,3557,1],[3568,3569,1],[3573,3584,1],[3643,3646,1],[3676,3712,1],[3715,3717,2],[3723,3748,25],[3750,3774,24],[3775,3781,6],[3783,3791,8],[3802,3803,1],[3808,3839,1],[3912,3949,37],[3950,3952,1],[3992,4029,37],[4045,4059,14],[4060,4095,1],[4294,4296,2],[4297,4300,1],[4302,4303,1],[4681,4686,5],[4687,4695,8],[4697,4702,5],[4703,4745,42],[4750,4751,1],[4785,4790,5],[4791,4799,8],[4801,4806,5],[4807,4823,16],[4881,4886,5],[4887,4955,68],[4956,4989,33],[4990,4991,1],[5018,5023,1],[5110,5111,1],[5118,5119,1],[5789,5791,1],[5881,5887,1],[5910,5918,1],[5943,5951,1],[5972,5983,1],[5997,6001,4],[6004,6015,1],[6110,6111,1],[6122,6127,1],[6138,6143,1],[6158,6170,12],[6171,6175,1],[6265,6271,1],[6315,6319,1],[6390,6399,1],[6431,6444,13],[6445,6447,1],[6460,6463,1],[6465,6467,1],[6510,6511,1],[6517,6527,1],[6572,6575,1],[6602,6607,1],[6619,6621,1],[6684,6685,1],[6751,6781,30],[6782,6794,12],[6795,6799,1],[6810,6815,1],[6830,6831,1],[6863,6911,1],[6989,6991,1],[7039,7156,117],[7157,7163,1],[7224,7226,1],[7242,7244,1],[7305,7311,1],[7355,7356,1],[7368,7375,1],[7419,7423,1],[7958,7959,1],[7966,7967,1],[8006,8007,1],[8014,8015,1],[8024,8030,2],[8062,8063,1],[8117,8133,16],[8148,8149,1],[8156,8176,20],[8177,8181,4],[8191,8203,12],[8204,8207,1],[8234,8238,1],[8288,8303,1],[8306,8307,1],[8335,8349,14],[8350,8351,1],[8385,8399,1],[8433,8447,1],[8588,8591,1],[9255,9279,1],[9291,9311,1],[11124,11125,1],[11158,11508,350],[11509,11512,1],[11558,11560,2],[11561,11564,1],[11566,11567,1],[11624,11630,1],[11633,11646,1],[11671,11679,1],[11687,11743,8],[11870,11903,1],[11930,12020,90],[12021,12031,1],[12246,12271,1],[12352,12439,87],[12440,12544,104],[12545,12548,1],[12592,12687,95],[12772,12782,1],[12831,42125,29294],[42126,42127,1],[42183,42191,1],[42540,42559,1],[42744,42751,1],[42955,42959,1],[42962,42964,2],[42970,42993,1],[43053,43055,1],[43066,43071,1],[43128,43135,1],[43206,43213,1],[43226,43231,1],[43348,43358,1],[43389,43391,1],[43470,43482,12],[43483,43485,1],[43519,43575,56],[43576,43583,1],[43598,43599,1],[43610,43611,1],[43715,43738,1],[43767,43776,1],[43783,43784,1],[43791,43792,1],[43799,43807,1],[43815,43823,8],[43884,43887,1],[44014,44015,1],[44026,44031,1],[55204,55215,1],[55239,55242,1],[55292,63743,1],[64110,64111,1],[64218,64255,1],[64263,64274,1],[64280,64284,1],[64311,64317,6],[64319,64325,3],[64451,64466,1],[64912,64913,1],[64968,64974,1],[64976,65007,1],[65050,65055,1],[65107,65127,20],[65132,65135,1],[65141,65277,136],[65278,65280,1],[65471,65473,1],[65480,65481,1],[65488,65489,1],[65496,65497,1],[65501,65503,1],[65511,65519,8],[65520,65531,1],[65534,65535,1],[65548,65575,27],[65595,65598,3],[65614,65615,1],[65630,65663,1],[65787,65791,1],[65795,65798,1],[65844,65846,1],[65935,65949,14],[65950,65951,1],[65953,65999,1],[66046,66175,1],[66205,66207,1],[66257,66271,1],[66300,66303,1],[66340,66348,1],[66379,66383,1],[66427,66431,1],[66462,66500,38],[66501,66503,1],[66518,66559,1],[66718,66719,1],[66730,66735,1],[66772,66775,1],[66812,66815,1],[66856,66863,1],[66916,66926,1],[66939,66955,16],[66963,66966,3],[66978,66994,16],[67002,67005,3],[67006,67071,1],[67383,67391,1],[67414,67423,1],[67432,67455,1],[67462,67505,43],[67515,67583,1],[67590,67591,1],[67593,67638,45],[67641,67643,1],[67645,67646,1],[67670,67743,73],[67744,67750,1],[67760,67807,1],[67827,67830,3],[67831,67834,1],[67868,67870,1],[67898,67902,1],[67904,67967,1],[68024,68027,1],[68048,68049,1],[68100,68103,3],[68104,68107,1],[68116,68120,4],[68150,68151,1],[68155,68158,1],[68169,68175,1],[68185,68191,1],[68256,68287,1],[68327,68330,1],[68343,68351,1],[68406,68408,1],[68438,68439,1],[68467,68471,1],[68498,68504,1],[68509,68520,1],[68528,68607,1],[68681,68735,1],[68787,68799,1],[68851,68857,1],[68904,68911,1],[68922,69215,1],[69247,69290,43],[69294,69295,1],[69298,69372,1],[69416,69423,1],[69466,69487,1],[69514,69551,1],[69580,69599,1],[69623,69631,1],[69710,69713,1],[69750,69758,1],[69821,69827,6],[69828,69839,1],[69865,69871,1],[69882,69887,1],[69941,69960,19],[69961,69967,1],[70007,70015,1],[70112,70133,21],[70134,70143,1],[70162,70210,48],[70211,70271,1],[70279,70281,2],[70286,70302,16],[70314,70319,1],[70379,70383,1],[70394,70399,1],[70404,70413,9],[70414,70417,3],[70418,70441,23],[70449,70452,3],[70458,70469,11],[70470,70473,3],[70474,70478,4],[70479,70481,2],[70482,70486,1],[70488,70492,1],[70500,70501,1],[70509,70511,1],[70517,70655,1],[70748,70754,6],[70755,70783,1],[70856,70863,1],[70874,71039,1],[71094,71095,1],[71134,71167,1],[71237,71247,1],[71258,71263,1],[71277,71295,1],[71354,71359,1],[71370,71423,1],[71451,71452,1],[71468,71471,1],[71495,71679,1],[71740,71839,1],[71923,71934,1],[71943,71944,1],[71946,71947,1],[71956,71959,3],[71990,71993,3],[71994,72007,13],[72008,72015,1],[72026,72095,1],[72104,72105,1],[72152,72153,1],[72165,72191,1],[72264,72271,1],[72355,72367,1],[72441,72447,1],[72458,72703,1],[72713,72759,46],[72774,72783,1],[72813,72815,1],[72848,72849,1],[72872,72887,15],[72888,72959,1],[72967,72970,3],[73015,73017,1],[73019,73022,3],[73032,73039,1],[73050,73055,1],[73062,73065,3],[73103,73106,3],[73113,73119,1],[73130,73439,1],[73465,73471,1],[73489,73531,42],[73532,73533,1],[73562,73647,1],[73649,73663,1],[73714,73726,1],[74650,74751,1],[74863,74869,6],[74870,74879,1],[75076,77711,1],[77811,77823,1],[78896,78911,1],[78934,82943,1],[83527,92159,1],[92729,92735,1],[92767,92778,11],[92779,92781,1],[92863,92874,11],[92875,92879,1],[92910,92911,1],[92918,92927,1],[92998,93007,1],[93018,93026,8],[93048,93052,1],[93072,93759,1],[93851,93951,1],[94027,94030,1],[94088,94094,1],[94112,94175,1],[94181,94191,1],[94194,94207,1],[100344,100351,1],[101590,101631,1],[101641,110575,1],[110580,110588,8],[110591,110883,292],[110884,110897,1],[110899,110927,1],[110931,110932,1],[110934,110947,1],[110952,110959,1],[111356,113663,1],[113771,113775,1],[113789,113791,1],[113801,113807,1],[113818,113819,1],[113824,118527,1],[118574,118575,1],[118599,118607,1],[118724,118783,1],[119030,119039,1],[119079,119080,1],[119155,119162,1],[119275,119295,1],[119366,119487,1],[119508,119519,1],[119540,119551,1],[119639,119647,1],[119673,119807,1],[119893,119965,72],[119968,119969,1],[119971,119972,1],[119975,119976,1],[119981,119994,13],[119996,120004,8],[120070,120075,5],[120076,120085,9],[120093,120122,29],[120127,120133,6],[120135,120137,1],[120145,120486,341],[120487,120780,293],[120781,121484,703],[121485,121498,1],[121504,121520,16],[121521,122623,1],[122655,122660,1],[122667,122879,1],[122887,122905,18],[122906,122914,8],[122917,122923,6],[122924,122927,1],[122990,123022,1],[123024,123135,1],[123181,123183,1],[123198,123199,1],[123210,123213,1],[123216,123535,1],[123567,123583,1],[123642,123646,1],[123648,124111,1],[124154,124895,1],[124903,124908,5],[124911,124927,16],[125125,125126,1],[125143,125183,1],[125260,125263,1],[125274,125277,1],[125280,126064,1],[126133,126208,1],[126270,126463,1],[126468,126496,28],[126499,126501,2],[126502,126504,2],[126515,126520,5],[126522,126524,2],[126525,126529,1],[126531,126534,1],[126536,126540,2],[126544,126547,3],[126549,126550,1],[126552,126560,2],[126563,126565,2],[126566,126571,5],[126579,126589,5],[126591,126602,11],[126620,126624,1],[126628,126634,6],[126652,126703,1],[126706,126975,1],[127020,127023,1],[127124,127135,1],[127151,127152,1],[127168,127184,16],[127222,127231,1],[127406,127461,1],[127491,127503,1],[127548,127551,1],[127561,127567,1],[127570,127583,1],[127590,127743,1],[128728,128731,1],[128749,128751,1],[128765,128767,1],[128887,128890,1],[128986,128991,1],[129004,129007,1],[129009,129023,1],[129036,129039,1],[129096,129103,1],[129114,129119,1],[129160,129167,1],[129198,129199,1],[129202,129279,1],[129620,129631,1],[129646,129647,1],[129661,129663,1],[129673,129679,1],[129726,129734,8],[129735,129741,1],[129756,129759,1],[129769,129775,1],[129785,129791,1],[129939,129995,56],[129996,130031,1],[130042,131071,1],[173792,173823,1],[177978,177983,1],[178206,178207,1],[183970,183983,1],[191457,191471,1],[192094,194559,1],[195102,196607,1],[201547,201551,1],[205744,917759,1],[918e3,1114111,1]]),g(d,"Cc",[[0,31,1],[127,159,1]]),g(d,"Cf",[[173,1536,1363],[1537,1541,1],[1564,1757,193],[1807,2192,385],[2193,2274,81],[6158,8203,2045],[8204,8207,1],[8234,8238,1],[8288,8292,1],[8294,8303,1],[65279,65529,250],[65530,65531,1],[69821,69837,16],[78896,78911,1],[113824,113827,1],[119155,119162,1],[917505,917536,31],[917537,917631,1]]),g(d,"Co",[[57344,63743,1],[983040,1048573,1],[1048576,1114109,1]]),g(d,"Cs",[[55296,57343,1]]),g(d,"L",[[65,90,1],[97,122,1],[170,181,11],[186,192,6],[193,214,1],[216,246,1],[248,705,1],[710,721,1],[736,740,1],[748,750,2],[880,884,1],[886,887,1],[890,893,1],[895,902,7],[904,906,1],[908,910,2],[911,929,1],[931,1013,1],[1015,1153,1],[1162,1327,1],[1329,1366,1],[1369,1376,7],[1377,1416,1],[1488,1514,1],[1519,1522,1],[1568,1610,1],[1646,1647,1],[1649,1747,1],[1749,1765,16],[1766,1774,8],[1775,1786,11],[1787,1788,1],[1791,1808,17],[1810,1839,1],[1869,1957,1],[1969,1994,25],[1995,2026,1],[2036,2037,1],[2042,2048,6],[2049,2069,1],[2074,2084,10],[2088,2112,24],[2113,2136,1],[2144,2154,1],[2160,2183,1],[2185,2190,1],[2208,2249,1],[2308,2361,1],[2365,2384,19],[2392,2401,1],[2417,2432,1],[2437,2444,1],[2447,2448,1],[2451,2472,1],[2474,2480,1],[2482,2486,4],[2487,2489,1],[2493,2510,17],[2524,2525,1],[2527,2529,1],[2544,2545,1],[2556,2565,9],[2566,2570,1],[2575,2576,1],[2579,2600,1],[2602,2608,1],[2610,2611,1],[2613,2614,1],[2616,2617,1],[2649,2652,1],[2654,2674,20],[2675,2676,1],[2693,2701,1],[2703,2705,1],[2707,2728,1],[2730,2736,1],[2738,2739,1],[2741,2745,1],[2749,2768,19],[2784,2785,1],[2809,2821,12],[2822,2828,1],[2831,2832,1],[2835,2856,1],[2858,2864,1],[2866,2867,1],[2869,2873,1],[2877,2908,31],[2909,2911,2],[2912,2913,1],[2929,2947,18],[2949,2954,1],[2958,2960,1],[2962,2965,1],[2969,2970,1],[2972,2974,2],[2975,2979,4],[2980,2984,4],[2985,2986,1],[2990,3001,1],[3024,3077,53],[3078,3084,1],[3086,3088,1],[3090,3112,1],[3114,3129,1],[3133,3160,27],[3161,3162,1],[3165,3168,3],[3169,3200,31],[3205,3212,1],[3214,3216,1],[3218,3240,1],[3242,3251,1],[3253,3257,1],[3261,3293,32],[3294,3296,2],[3297,3313,16],[3314,3332,18],[3333,3340,1],[3342,3344,1],[3346,3386,1],[3389,3406,17],[3412,3414,1],[3423,3425,1],[3450,3455,1],[3461,3478,1],[3482,3505,1],[3507,3515,1],[3517,3520,3],[3521,3526,1],[3585,3632,1],[3634,3635,1],[3648,3654,1],[3713,3714,1],[3716,3718,2],[3719,3722,1],[3724,3747,1],[3749,3751,2],[3752,3760,1],[3762,3763,1],[3773,3776,3],[3777,3780,1],[3782,3804,22],[3805,3807,1],[3840,3904,64],[3905,3911,1],[3913,3948,1],[3976,3980,1],[4096,4138,1],[4159,4176,17],[4177,4181,1],[4186,4189,1],[4193,4197,4],[4198,4206,8],[4207,4208,1],[4213,4225,1],[4238,4256,18],[4257,4293,1],[4295,4301,6],[4304,4346,1],[4348,4680,1],[4682,4685,1],[4688,4694,1],[4696,4698,2],[4699,4701,1],[4704,4744,1],[4746,4749,1],[4752,4784,1],[4786,4789,1],[4792,4798,1],[4800,4802,2],[4803,4805,1],[4808,4822,1],[4824,4880,1],[4882,4885,1],[4888,4954,1],[4992,5007,1],[5024,5109,1],[5112,5117,1],[5121,5740,1],[5743,5759,1],[5761,5786,1],[5792,5866,1],[5873,5880,1],[5888,5905,1],[5919,5937,1],[5952,5969,1],[5984,5996,1],[5998,6e3,1],[6016,6067,1],[6103,6108,5],[6176,6264,1],[6272,6276,1],[6279,6312,1],[6314,6320,6],[6321,6389,1],[6400,6430,1],[6480,6509,1],[6512,6516,1],[6528,6571,1],[6576,6601,1],[6656,6678,1],[6688,6740,1],[6823,6917,94],[6918,6963,1],[6981,6988,1],[7043,7072,1],[7086,7087,1],[7098,7141,1],[7168,7203,1],[7245,7247,1],[7258,7293,1],[7296,7304,1],[7312,7354,1],[7357,7359,1],[7401,7404,1],[7406,7411,1],[7413,7414,1],[7418,7424,6],[7425,7615,1],[7680,7957,1],[7960,7965,1],[7968,8005,1],[8008,8013,1],[8016,8023,1],[8025,8031,2],[8032,8061,1],[8064,8116,1],[8118,8124,1],[8126,8130,4],[8131,8132,1],[8134,8140,1],[8144,8147,1],[8150,8155,1],[8160,8172,1],[8178,8180,1],[8182,8188,1],[8305,8319,14],[8336,8348,1],[8450,8455,5],[8458,8467,1],[8469,8473,4],[8474,8477,1],[8484,8490,2],[8491,8493,1],[8495,8505,1],[8508,8511,1],[8517,8521,1],[8526,8579,53],[8580,11264,2684],[11265,11492,1],[11499,11502,1],[11506,11507,1],[11520,11557,1],[11559,11565,6],[11568,11623,1],[11631,11648,17],[11649,11670,1],[11680,11686,1],[11688,11694,1],[11696,11702,1],[11704,11710,1],[11712,11718,1],[11720,11726,1],[11728,11734,1],[11736,11742,1],[11823,12293,470],[12294,12337,43],[12338,12341,1],[12347,12348,1],[12353,12438,1],[12445,12447,1],[12449,12538,1],[12540,12543,1],[12549,12591,1],[12593,12686,1],[12704,12735,1],[12784,12799,1],[13312,19903,1],[19968,42124,1],[42192,42237,1],[42240,42508,1],[42512,42527,1],[42538,42539,1],[42560,42606,1],[42623,42653,1],[42656,42725,1],[42775,42783,1],[42786,42888,1],[42891,42954,1],[42960,42961,1],[42963,42965,2],[42966,42969,1],[42994,43009,1],[43011,43013,1],[43015,43018,1],[43020,43042,1],[43072,43123,1],[43138,43187,1],[43250,43255,1],[43259,43261,2],[43262,43274,12],[43275,43301,1],[43312,43334,1],[43360,43388,1],[43396,43442,1],[43471,43488,17],[43489,43492,1],[43494,43503,1],[43514,43518,1],[43520,43560,1],[43584,43586,1],[43588,43595,1],[43616,43638,1],[43642,43646,4],[43647,43695,1],[43697,43701,4],[43702,43705,3],[43706,43709,1],[43712,43714,2],[43739,43741,1],[43744,43754,1],[43762,43764,1],[43777,43782,1],[43785,43790,1],[43793,43798,1],[43808,43814,1],[43816,43822,1],[43824,43866,1],[43868,43881,1],[43888,44002,1],[44032,55203,1],[55216,55238,1],[55243,55291,1],[63744,64109,1],[64112,64217,1],[64256,64262,1],[64275,64279,1],[64285,64287,2],[64288,64296,1],[64298,64310,1],[64312,64316,1],[64318,64320,2],[64321,64323,2],[64324,64326,2],[64327,64433,1],[64467,64829,1],[64848,64911,1],[64914,64967,1],[65008,65019,1],[65136,65140,1],[65142,65276,1],[65313,65338,1],[65345,65370,1],[65382,65470,1],[65474,65479,1],[65482,65487,1],[65490,65495,1],[65498,65500,1],[65536,65547,1],[65549,65574,1],[65576,65594,1],[65596,65597,1],[65599,65613,1],[65616,65629,1],[65664,65786,1],[66176,66204,1],[66208,66256,1],[66304,66335,1],[66349,66368,1],[66370,66377,1],[66384,66421,1],[66432,66461,1],[66464,66499,1],[66504,66511,1],[66560,66717,1],[66736,66771,1],[66776,66811,1],[66816,66855,1],[66864,66915,1],[66928,66938,1],[66940,66954,1],[66956,66962,1],[66964,66965,1],[66967,66977,1],[66979,66993,1],[66995,67001,1],[67003,67004,1],[67072,67382,1],[67392,67413,1],[67424,67431,1],[67456,67461,1],[67463,67504,1],[67506,67514,1],[67584,67589,1],[67592,67594,2],[67595,67637,1],[67639,67640,1],[67644,67647,3],[67648,67669,1],[67680,67702,1],[67712,67742,1],[67808,67826,1],[67828,67829,1],[67840,67861,1],[67872,67897,1],[67968,68023,1],[68030,68031,1],[68096,68112,16],[68113,68115,1],[68117,68119,1],[68121,68149,1],[68192,68220,1],[68224,68252,1],[68288,68295,1],[68297,68324,1],[68352,68405,1],[68416,68437,1],[68448,68466,1],[68480,68497,1],[68608,68680,1],[68736,68786,1],[68800,68850,1],[68864,68899,1],[69248,69289,1],[69296,69297,1],[69376,69404,1],[69415,69424,9],[69425,69445,1],[69488,69505,1],[69552,69572,1],[69600,69622,1],[69635,69687,1],[69745,69746,1],[69749,69763,14],[69764,69807,1],[69840,69864,1],[69891,69926,1],[69956,69959,3],[69968,70002,1],[70006,70019,13],[70020,70066,1],[70081,70084,1],[70106,70108,2],[70144,70161,1],[70163,70187,1],[70207,70208,1],[70272,70278,1],[70280,70282,2],[70283,70285,1],[70287,70301,1],[70303,70312,1],[70320,70366,1],[70405,70412,1],[70415,70416,1],[70419,70440,1],[70442,70448,1],[70450,70451,1],[70453,70457,1],[70461,70480,19],[70493,70497,1],[70656,70708,1],[70727,70730,1],[70751,70753,1],[70784,70831,1],[70852,70853,1],[70855,71040,185],[71041,71086,1],[71128,71131,1],[71168,71215,1],[71236,71296,60],[71297,71338,1],[71352,71424,72],[71425,71450,1],[71488,71494,1],[71680,71723,1],[71840,71903,1],[71935,71942,1],[71945,71948,3],[71949,71955,1],[71957,71958,1],[71960,71983,1],[71999,72001,2],[72096,72103,1],[72106,72144,1],[72161,72163,2],[72192,72203,11],[72204,72242,1],[72250,72272,22],[72284,72329,1],[72349,72368,19],[72369,72440,1],[72704,72712,1],[72714,72750,1],[72768,72818,50],[72819,72847,1],[72960,72966,1],[72968,72969,1],[72971,73008,1],[73030,73056,26],[73057,73061,1],[73063,73064,1],[73066,73097,1],[73112,73440,328],[73441,73458,1],[73474,73476,2],[73477,73488,1],[73490,73523,1],[73648,73728,80],[73729,74649,1],[74880,75075,1],[77712,77808,1],[77824,78895,1],[78913,78918,1],[82944,83526,1],[92160,92728,1],[92736,92766,1],[92784,92862,1],[92880,92909,1],[92928,92975,1],[92992,92995,1],[93027,93047,1],[93053,93071,1],[93760,93823,1],[93952,94026,1],[94032,94099,67],[94100,94111,1],[94176,94177,1],[94179,94208,29],[94209,100343,1],[100352,101589,1],[101632,101640,1],[110576,110579,1],[110581,110587,1],[110589,110590,1],[110592,110882,1],[110898,110928,30],[110929,110930,1],[110933,110948,15],[110949,110951,1],[110960,111355,1],[113664,113770,1],[113776,113788,1],[113792,113800,1],[113808,113817,1],[119808,119892,1],[119894,119964,1],[119966,119967,1],[119970,119973,3],[119974,119977,3],[119978,119980,1],[119982,119993,1],[119995,119997,2],[119998,120003,1],[120005,120069,1],[120071,120074,1],[120077,120084,1],[120086,120092,1],[120094,120121,1],[120123,120126,1],[120128,120132,1],[120134,120138,4],[120139,120144,1],[120146,120485,1],[120488,120512,1],[120514,120538,1],[120540,120570,1],[120572,120596,1],[120598,120628,1],[120630,120654,1],[120656,120686,1],[120688,120712,1],[120714,120744,1],[120746,120770,1],[120772,120779,1],[122624,122654,1],[122661,122666,1],[122928,122989,1],[123136,123180,1],[123191,123197,1],[123214,123536,322],[123537,123565,1],[123584,123627,1],[124112,124139,1],[124896,124902,1],[124904,124907,1],[124909,124910,1],[124912,124926,1],[124928,125124,1],[125184,125251,1],[125259,126464,1205],[126465,126467,1],[126469,126495,1],[126497,126498,1],[126500,126503,3],[126505,126514,1],[126516,126519,1],[126521,126523,2],[126530,126535,5],[126537,126541,2],[126542,126543,1],[126545,126546,1],[126548,126551,3],[126553,126561,2],[126562,126564,2],[126567,126570,1],[126572,126578,1],[126580,126583,1],[126585,126588,1],[126590,126592,2],[126593,126601,1],[126603,126619,1],[126625,126627,1],[126629,126633,1],[126635,126651,1],[131072,173791,1],[173824,177977,1],[177984,178205,1],[178208,183969,1],[183984,191456,1],[191472,192093,1],[194560,195101,1],[196608,201546,1],[201552,205743,1]]),g(d,"foldL",[[837,837,1]]),g(d,"Ll",[[97,122,1],[181,223,42],[224,246,1],[248,255,1],[257,311,2],[312,328,2],[329,375,2],[378,382,2],[383,384,1],[387,389,2],[392,396,4],[397,402,5],[405,409,4],[410,411,1],[414,417,3],[419,421,2],[424,426,2],[427,429,2],[432,436,4],[438,441,3],[442,445,3],[446,447,1],[454,460,3],[462,476,2],[477,495,2],[496,499,3],[501,505,4],[507,563,2],[564,569,1],[572,575,3],[576,578,2],[583,591,2],[592,659,1],[661,687,1],[881,883,2],[887,891,4],[892,893,1],[912,940,28],[941,974,1],[976,977,1],[981,983,1],[985,1007,2],[1008,1011,1],[1013,1019,3],[1020,1072,52],[1073,1119,1],[1121,1153,2],[1163,1215,2],[1218,1230,2],[1231,1327,2],[1376,1416,1],[4304,4346,1],[4349,4351,1],[5112,5117,1],[7296,7304,1],[7424,7467,1],[7531,7543,1],[7545,7578,1],[7681,7829,2],[7830,7837,1],[7839,7935,2],[7936,7943,1],[7952,7957,1],[7968,7975,1],[7984,7991,1],[8e3,8005,1],[8016,8023,1],[8032,8039,1],[8048,8061,1],[8064,8071,1],[8080,8087,1],[8096,8103,1],[8112,8116,1],[8118,8119,1],[8126,8130,4],[8131,8132,1],[8134,8135,1],[8144,8147,1],[8150,8151,1],[8160,8167,1],[8178,8180,1],[8182,8183,1],[8458,8462,4],[8463,8467,4],[8495,8505,5],[8508,8509,1],[8518,8521,1],[8526,8580,54],[11312,11359,1],[11361,11365,4],[11366,11372,2],[11377,11379,2],[11380,11382,2],[11383,11387,1],[11393,11491,2],[11492,11500,8],[11502,11507,5],[11520,11557,1],[11559,11565,6],[42561,42605,2],[42625,42651,2],[42787,42799,2],[42800,42801,1],[42803,42865,2],[42866,42872,1],[42874,42876,2],[42879,42887,2],[42892,42894,2],[42897,42899,2],[42900,42901,1],[42903,42921,2],[42927,42933,6],[42935,42947,2],[42952,42954,2],[42961,42969,2],[42998,43002,4],[43824,43866,1],[43872,43880,1],[43888,43967,1],[64256,64262,1],[64275,64279,1],[65345,65370,1],[66600,66639,1],[66776,66811,1],[66967,66977,1],[66979,66993,1],[66995,67001,1],[67003,67004,1],[68800,68850,1],[71872,71903,1],[93792,93823,1],[119834,119859,1],[119886,119892,1],[119894,119911,1],[119938,119963,1],[119990,119993,1],[119995,119997,2],[119998,120003,1],[120005,120015,1],[120042,120067,1],[120094,120119,1],[120146,120171,1],[120198,120223,1],[120250,120275,1],[120302,120327,1],[120354,120379,1],[120406,120431,1],[120458,120485,1],[120514,120538,1],[120540,120545,1],[120572,120596,1],[120598,120603,1],[120630,120654,1],[120656,120661,1],[120688,120712,1],[120714,120719,1],[120746,120770,1],[120772,120777,1],[120779,122624,1845],[122625,122633,1],[122635,122654,1],[122661,122666,1],[125218,125251,1]]),g(d,"foldLl",[[65,90,1],[192,214,1],[216,222,1],[256,302,2],[306,310,2],[313,327,2],[330,376,2],[377,381,2],[385,386,1],[388,390,2],[391,393,2],[394,395,1],[398,401,1],[403,404,1],[406,408,1],[412,413,1],[415,416,1],[418,422,2],[423,425,2],[428,430,2],[431,433,2],[434,435,1],[437,439,2],[440,444,4],[452,453,1],[455,456,1],[458,459,1],[461,475,2],[478,494,2],[497,498,1],[500,502,2],[503,504,1],[506,562,2],[570,571,1],[573,574,1],[577,579,2],[580,582,1],[584,590,2],[837,880,43],[882,886,4],[895,902,7],[904,906,1],[908,910,2],[911,913,2],[914,929,1],[931,939,1],[975,984,9],[986,1006,2],[1012,1015,3],[1017,1018,1],[1021,1071,1],[1120,1152,2],[1162,1216,2],[1217,1229,2],[1232,1326,2],[1329,1366,1],[4256,4293,1],[4295,4301,6],[5024,5109,1],[7312,7354,1],[7357,7359,1],[7680,7828,2],[7838,7934,2],[7944,7951,1],[7960,7965,1],[7976,7983,1],[7992,7999,1],[8008,8013,1],[8025,8031,2],[8040,8047,1],[8072,8079,1],[8088,8095,1],[8104,8111,1],[8120,8124,1],[8136,8140,1],[8152,8155,1],[8168,8172,1],[8184,8188,1],[8486,8490,4],[8491,8498,7],[8579,11264,2685],[11265,11311,1],[11360,11362,2],[11363,11364,1],[11367,11373,2],[11374,11376,1],[11378,11381,3],[11390,11392,1],[11394,11490,2],[11499,11501,2],[11506,42560,31054],[42562,42604,2],[42624,42650,2],[42786,42798,2],[42802,42862,2],[42873,42877,2],[42878,42886,2],[42891,42893,2],[42896,42898,2],[42902,42922,2],[42923,42926,1],[42928,42932,1],[42934,42948,2],[42949,42951,1],[42953,42960,7],[42966,42968,2],[42997,65313,22316],[65314,65338,1],[66560,66599,1],[66736,66771,1],[66928,66938,1],[66940,66954,1],[66956,66962,1],[66964,66965,1],[68736,68786,1],[71840,71871,1],[93760,93791,1],[125184,125217,1]]),g(d,"Lm",[[688,705,1],[710,721,1],[736,740,1],[748,750,2],[884,890,6],[1369,1600,231],[1765,1766,1],[2036,2037,1],[2042,2074,32],[2084,2088,4],[2249,2417,168],[3654,3782,128],[4348,6103,1755],[6211,6823,612],[7288,7293,1],[7468,7530,1],[7544,7579,35],[7580,7615,1],[8305,8319,14],[8336,8348,1],[11388,11389,1],[11631,11823,192],[12293,12337,44],[12338,12341,1],[12347,12445,98],[12446,12540,94],[12541,12542,1],[40981,42232,1251],[42233,42237,1],[42508,42623,115],[42652,42653,1],[42775,42783,1],[42864,42888,24],[42994,42996,1],[43e3,43001,1],[43471,43494,23],[43632,43741,109],[43763,43764,1],[43868,43871,1],[43881,65392,21511],[65438,65439,1],[67456,67461,1],[67463,67504,1],[67506,67514,1],[92992,92995,1],[94099,94111,1],[94176,94177,1],[94179,110576,16397],[110577,110579,1],[110581,110587,1],[110589,110590,1],[122928,122989,1],[123191,123197,1],[124139,125259,1120]]),g(d,"Lo",[[170,186,16],[443,448,5],[449,451,1],[660,1488,828],[1489,1514,1],[1519,1522,1],[1568,1599,1],[1601,1610,1],[1646,1647,1],[1649,1747,1],[1749,1774,25],[1775,1786,11],[1787,1788,1],[1791,1808,17],[1810,1839,1],[1869,1957,1],[1969,1994,25],[1995,2026,1],[2048,2069,1],[2112,2136,1],[2144,2154,1],[2160,2183,1],[2185,2190,1],[2208,2248,1],[2308,2361,1],[2365,2384,19],[2392,2401,1],[2418,2432,1],[2437,2444,1],[2447,2448,1],[2451,2472,1],[2474,2480,1],[2482,2486,4],[2487,2489,1],[2493,2510,17],[2524,2525,1],[2527,2529,1],[2544,2545,1],[2556,2565,9],[2566,2570,1],[2575,2576,1],[2579,2600,1],[2602,2608,1],[2610,2611,1],[2613,2614,1],[2616,2617,1],[2649,2652,1],[2654,2674,20],[2675,2676,1],[2693,2701,1],[2703,2705,1],[2707,2728,1],[2730,2736,1],[2738,2739,1],[2741,2745,1],[2749,2768,19],[2784,2785,1],[2809,2821,12],[2822,2828,1],[2831,2832,1],[2835,2856,1],[2858,2864,1],[2866,2867,1],[2869,2873,1],[2877,2908,31],[2909,2911,2],[2912,2913,1],[2929,2947,18],[2949,2954,1],[2958,2960,1],[2962,2965,1],[2969,2970,1],[2972,2974,2],[2975,2979,4],[2980,2984,4],[2985,2986,1],[2990,3001,1],[3024,3077,53],[3078,3084,1],[3086,3088,1],[3090,3112,1],[3114,3129,1],[3133,3160,27],[3161,3162,1],[3165,3168,3],[3169,3200,31],[3205,3212,1],[3214,3216,1],[3218,3240,1],[3242,3251,1],[3253,3257,1],[3261,3293,32],[3294,3296,2],[3297,3313,16],[3314,3332,18],[3333,3340,1],[3342,3344,1],[3346,3386,1],[3389,3406,17],[3412,3414,1],[3423,3425,1],[3450,3455,1],[3461,3478,1],[3482,3505,1],[3507,3515,1],[3517,3520,3],[3521,3526,1],[3585,3632,1],[3634,3635,1],[3648,3653,1],[3713,3714,1],[3716,3718,2],[3719,3722,1],[3724,3747,1],[3749,3751,2],[3752,3760,1],[3762,3763,1],[3773,3776,3],[3777,3780,1],[3804,3807,1],[3840,3904,64],[3905,3911,1],[3913,3948,1],[3976,3980,1],[4096,4138,1],[4159,4176,17],[4177,4181,1],[4186,4189,1],[4193,4197,4],[4198,4206,8],[4207,4208,1],[4213,4225,1],[4238,4352,114],[4353,4680,1],[4682,4685,1],[4688,4694,1],[4696,4698,2],[4699,4701,1],[4704,4744,1],[4746,4749,1],[4752,4784,1],[4786,4789,1],[4792,4798,1],[4800,4802,2],[4803,4805,1],[4808,4822,1],[4824,4880,1],[4882,4885,1],[4888,4954,1],[4992,5007,1],[5121,5740,1],[5743,5759,1],[5761,5786,1],[5792,5866,1],[5873,5880,1],[5888,5905,1],[5919,5937,1],[5952,5969,1],[5984,5996,1],[5998,6e3,1],[6016,6067,1],[6108,6176,68],[6177,6210,1],[6212,6264,1],[6272,6276,1],[6279,6312,1],[6314,6320,6],[6321,6389,1],[6400,6430,1],[6480,6509,1],[6512,6516,1],[6528,6571,1],[6576,6601,1],[6656,6678,1],[6688,6740,1],[6917,6963,1],[6981,6988,1],[7043,7072,1],[7086,7087,1],[7098,7141,1],[7168,7203,1],[7245,7247,1],[7258,7287,1],[7401,7404,1],[7406,7411,1],[7413,7414,1],[7418,8501,1083],[8502,8504,1],[11568,11623,1],[11648,11670,1],[11680,11686,1],[11688,11694,1],[11696,11702,1],[11704,11710,1],[11712,11718,1],[11720,11726,1],[11728,11734,1],[11736,11742,1],[12294,12348,54],[12353,12438,1],[12447,12449,2],[12450,12538,1],[12543,12549,6],[12550,12591,1],[12593,12686,1],[12704,12735,1],[12784,12799,1],[13312,19903,1],[19968,40980,1],[40982,42124,1],[42192,42231,1],[42240,42507,1],[42512,42527,1],[42538,42539,1],[42606,42656,50],[42657,42725,1],[42895,42999,104],[43003,43009,1],[43011,43013,1],[43015,43018,1],[43020,43042,1],[43072,43123,1],[43138,43187,1],[43250,43255,1],[43259,43261,2],[43262,43274,12],[43275,43301,1],[43312,43334,1],[43360,43388,1],[43396,43442,1],[43488,43492,1],[43495,43503,1],[43514,43518,1],[43520,43560,1],[43584,43586,1],[43588,43595,1],[43616,43631,1],[43633,43638,1],[43642,43646,4],[43647,43695,1],[43697,43701,4],[43702,43705,3],[43706,43709,1],[43712,43714,2],[43739,43740,1],[43744,43754,1],[43762,43777,15],[43778,43782,1],[43785,43790,1],[43793,43798,1],[43808,43814,1],[43816,43822,1],[43968,44002,1],[44032,55203,1],[55216,55238,1],[55243,55291,1],[63744,64109,1],[64112,64217,1],[64285,64287,2],[64288,64296,1],[64298,64310,1],[64312,64316,1],[64318,64320,2],[64321,64323,2],[64324,64326,2],[64327,64433,1],[64467,64829,1],[64848,64911,1],[64914,64967,1],[65008,65019,1],[65136,65140,1],[65142,65276,1],[65382,65391,1],[65393,65437,1],[65440,65470,1],[65474,65479,1],[65482,65487,1],[65490,65495,1],[65498,65500,1],[65536,65547,1],[65549,65574,1],[65576,65594,1],[65596,65597,1],[65599,65613,1],[65616,65629,1],[65664,65786,1],[66176,66204,1],[66208,66256,1],[66304,66335,1],[66349,66368,1],[66370,66377,1],[66384,66421,1],[66432,66461,1],[66464,66499,1],[66504,66511,1],[66640,66717,1],[66816,66855,1],[66864,66915,1],[67072,67382,1],[67392,67413,1],[67424,67431,1],[67584,67589,1],[67592,67594,2],[67595,67637,1],[67639,67640,1],[67644,67647,3],[67648,67669,1],[67680,67702,1],[67712,67742,1],[67808,67826,1],[67828,67829,1],[67840,67861,1],[67872,67897,1],[67968,68023,1],[68030,68031,1],[68096,68112,16],[68113,68115,1],[68117,68119,1],[68121,68149,1],[68192,68220,1],[68224,68252,1],[68288,68295,1],[68297,68324,1],[68352,68405,1],[68416,68437,1],[68448,68466,1],[68480,68497,1],[68608,68680,1],[68864,68899,1],[69248,69289,1],[69296,69297,1],[69376,69404,1],[69415,69424,9],[69425,69445,1],[69488,69505,1],[69552,69572,1],[69600,69622,1],[69635,69687,1],[69745,69746,1],[69749,69763,14],[69764,69807,1],[69840,69864,1],[69891,69926,1],[69956,69959,3],[69968,70002,1],[70006,70019,13],[70020,70066,1],[70081,70084,1],[70106,70108,2],[70144,70161,1],[70163,70187,1],[70207,70208,1],[70272,70278,1],[70280,70282,2],[70283,70285,1],[70287,70301,1],[70303,70312,1],[70320,70366,1],[70405,70412,1],[70415,70416,1],[70419,70440,1],[70442,70448,1],[70450,70451,1],[70453,70457,1],[70461,70480,19],[70493,70497,1],[70656,70708,1],[70727,70730,1],[70751,70753,1],[70784,70831,1],[70852,70853,1],[70855,71040,185],[71041,71086,1],[71128,71131,1],[71168,71215,1],[71236,71296,60],[71297,71338,1],[71352,71424,72],[71425,71450,1],[71488,71494,1],[71680,71723,1],[71935,71942,1],[71945,71948,3],[71949,71955,1],[71957,71958,1],[71960,71983,1],[71999,72001,2],[72096,72103,1],[72106,72144,1],[72161,72163,2],[72192,72203,11],[72204,72242,1],[72250,72272,22],[72284,72329,1],[72349,72368,19],[72369,72440,1],[72704,72712,1],[72714,72750,1],[72768,72818,50],[72819,72847,1],[72960,72966,1],[72968,72969,1],[72971,73008,1],[73030,73056,26],[73057,73061,1],[73063,73064,1],[73066,73097,1],[73112,73440,328],[73441,73458,1],[73474,73476,2],[73477,73488,1],[73490,73523,1],[73648,73728,80],[73729,74649,1],[74880,75075,1],[77712,77808,1],[77824,78895,1],[78913,78918,1],[82944,83526,1],[92160,92728,1],[92736,92766,1],[92784,92862,1],[92880,92909,1],[92928,92975,1],[93027,93047,1],[93053,93071,1],[93952,94026,1],[94032,94208,176],[94209,100343,1],[100352,101589,1],[101632,101640,1],[110592,110882,1],[110898,110928,30],[110929,110930,1],[110933,110948,15],[110949,110951,1],[110960,111355,1],[113664,113770,1],[113776,113788,1],[113792,113800,1],[113808,113817,1],[122634,123136,502],[123137,123180,1],[123214,123536,322],[123537,123565,1],[123584,123627,1],[124112,124138,1],[124896,124902,1],[124904,124907,1],[124909,124910,1],[124912,124926,1],[124928,125124,1],[126464,126467,1],[126469,126495,1],[126497,126498,1],[126500,126503,3],[126505,126514,1],[126516,126519,1],[126521,126523,2],[126530,126535,5],[126537,126541,2],[126542,126543,1],[126545,126546,1],[126548,126551,3],[126553,126561,2],[126562,126564,2],[126567,126570,1],[126572,126578,1],[126580,126583,1],[126585,126588,1],[126590,126592,2],[126593,126601,1],[126603,126619,1],[126625,126627,1],[126629,126633,1],[126635,126651,1],[131072,173791,1],[173824,177977,1],[177984,178205,1],[178208,183969,1],[183984,191456,1],[191472,192093,1],[194560,195101,1],[196608,201546,1],[201552,205743,1]]),g(d,"Lt",[[453,459,3],[498,8072,7574],[8073,8079,1],[8088,8095,1],[8104,8111,1],[8124,8140,16],[8188,8188,1]]),g(d,"foldLt",[[452,454,2],[455,457,2],[458,460,2],[497,499,2],[8064,8071,1],[8080,8087,1],[8096,8103,1],[8115,8131,16],[8179,8179,1]]),g(d,"Lu",[[65,90,1],[192,214,1],[216,222,1],[256,310,2],[313,327,2],[330,376,2],[377,381,2],[385,386,1],[388,390,2],[391,393,2],[394,395,1],[398,401,1],[403,404,1],[406,408,1],[412,413,1],[415,416,1],[418,422,2],[423,425,2],[428,430,2],[431,433,2],[434,435,1],[437,439,2],[440,444,4],[452,461,3],[463,475,2],[478,494,2],[497,500,3],[502,504,1],[506,562,2],[570,571,1],[573,574,1],[577,579,2],[580,582,1],[584,590,2],[880,882,2],[886,895,9],[902,904,2],[905,906,1],[908,910,2],[911,913,2],[914,929,1],[931,939,1],[975,978,3],[979,980,1],[984,1006,2],[1012,1015,3],[1017,1018,1],[1021,1071,1],[1120,1152,2],[1162,1216,2],[1217,1229,2],[1232,1326,2],[1329,1366,1],[4256,4293,1],[4295,4301,6],[5024,5109,1],[7312,7354,1],[7357,7359,1],[7680,7828,2],[7838,7934,2],[7944,7951,1],[7960,7965,1],[7976,7983,1],[7992,7999,1],[8008,8013,1],[8025,8031,2],[8040,8047,1],[8120,8123,1],[8136,8139,1],[8152,8155,1],[8168,8172,1],[8184,8187,1],[8450,8455,5],[8459,8461,1],[8464,8466,1],[8469,8473,4],[8474,8477,1],[8484,8490,2],[8491,8493,1],[8496,8499,1],[8510,8511,1],[8517,8579,62],[11264,11311,1],[11360,11362,2],[11363,11364,1],[11367,11373,2],[11374,11376,1],[11378,11381,3],[11390,11392,1],[11394,11490,2],[11499,11501,2],[11506,42560,31054],[42562,42604,2],[42624,42650,2],[42786,42798,2],[42802,42862,2],[42873,42877,2],[42878,42886,2],[42891,42893,2],[42896,42898,2],[42902,42922,2],[42923,42926,1],[42928,42932,1],[42934,42948,2],[42949,42951,1],[42953,42960,7],[42966,42968,2],[42997,65313,22316],[65314,65338,1],[66560,66599,1],[66736,66771,1],[66928,66938,1],[66940,66954,1],[66956,66962,1],[66964,66965,1],[68736,68786,1],[71840,71871,1],[93760,93791,1],[119808,119833,1],[119860,119885,1],[119912,119937,1],[119964,119966,2],[119967,119973,3],[119974,119977,3],[119978,119980,1],[119982,119989,1],[120016,120041,1],[120068,120069,1],[120071,120074,1],[120077,120084,1],[120086,120092,1],[120120,120121,1],[120123,120126,1],[120128,120132,1],[120134,120138,4],[120139,120144,1],[120172,120197,1],[120224,120249,1],[120276,120301,1],[120328,120353,1],[120380,120405,1],[120432,120457,1],[120488,120512,1],[120546,120570,1],[120604,120628,1],[120662,120686,1],[120720,120744,1],[120778,125184,4406],[125185,125217,1]]),g(d,"Upper",d.Lu),g(d,"foldLu",[[97,122,1],[181,223,42],[224,246,1],[248,255,1],[257,303,2],[307,311,2],[314,328,2],[331,375,2],[378,382,2],[383,384,1],[387,389,2],[392,396,4],[402,405,3],[409,410,1],[414,417,3],[419,421,2],[424,429,5],[432,436,4],[438,441,3],[445,447,2],[453,454,1],[456,457,1],[459,460,1],[462,476,2],[477,495,2],[498,499,1],[501,505,4],[507,543,2],[547,563,2],[572,575,3],[576,578,2],[583,591,2],[592,596,1],[598,599,1],[601,603,2],[604,608,4],[609,613,2],[614,616,2],[617,620,1],[623,625,2],[626,629,3],[637,640,3],[642,643,1],[647,652,1],[658,669,11],[670,837,167],[881,883,2],[887,891,4],[892,893,1],[940,943,1],[945,974,1],[976,977,1],[981,983,1],[985,1007,2],[1008,1011,1],[1013,1019,3],[1072,1119,1],[1121,1153,2],[1163,1215,2],[1218,1230,2],[1231,1327,2],[1377,1414,1],[4304,4346,1],[4349,4351,1],[5112,5117,1],[7296,7304,1],[7545,7549,4],[7566,7681,115],[7683,7829,2],[7835,7841,6],[7843,7935,2],[7936,7943,1],[7952,7957,1],[7968,7975,1],[7984,7991,1],[8e3,8005,1],[8017,8023,2],[8032,8039,1],[8048,8061,1],[8112,8113,1],[8126,8144,18],[8145,8160,15],[8161,8165,4],[8526,8580,54],[11312,11359,1],[11361,11365,4],[11366,11372,2],[11379,11382,3],[11393,11491,2],[11500,11502,2],[11507,11520,13],[11521,11557,1],[11559,11565,6],[42561,42605,2],[42625,42651,2],[42787,42799,2],[42803,42863,2],[42874,42876,2],[42879,42887,2],[42892,42897,5],[42899,42900,1],[42903,42921,2],[42933,42947,2],[42952,42954,2],[42961,42967,6],[42969,42998,29],[43859,43888,29],[43889,43967,1],[65345,65370,1],[66600,66639,1],[66776,66811,1],[66967,66977,1],[66979,66993,1],[66995,67001,1],[67003,67004,1],[68800,68850,1],[71872,71903,1],[93792,93823,1],[125218,125251,1]]),g(d,"M",[[768,879,1],[1155,1161,1],[1425,1469,1],[1471,1473,2],[1474,1476,2],[1477,1479,2],[1552,1562,1],[1611,1631,1],[1648,1750,102],[1751,1756,1],[1759,1764,1],[1767,1768,1],[1770,1773,1],[1809,1840,31],[1841,1866,1],[1958,1968,1],[2027,2035,1],[2045,2070,25],[2071,2073,1],[2075,2083,1],[2085,2087,1],[2089,2093,1],[2137,2139,1],[2200,2207,1],[2250,2273,1],[2275,2307,1],[2362,2364,1],[2366,2383,1],[2385,2391,1],[2402,2403,1],[2433,2435,1],[2492,2494,2],[2495,2500,1],[2503,2504,1],[2507,2509,1],[2519,2530,11],[2531,2558,27],[2561,2563,1],[2620,2622,2],[2623,2626,1],[2631,2632,1],[2635,2637,1],[2641,2672,31],[2673,2677,4],[2689,2691,1],[2748,2750,2],[2751,2757,1],[2759,2761,1],[2763,2765,1],[2786,2787,1],[2810,2815,1],[2817,2819,1],[2876,2878,2],[2879,2884,1],[2887,2888,1],[2891,2893,1],[2901,2903,1],[2914,2915,1],[2946,3006,60],[3007,3010,1],[3014,3016,1],[3018,3021,1],[3031,3072,41],[3073,3076,1],[3132,3134,2],[3135,3140,1],[3142,3144,1],[3146,3149,1],[3157,3158,1],[3170,3171,1],[3201,3203,1],[3260,3262,2],[3263,3268,1],[3270,3272,1],[3274,3277,1],[3285,3286,1],[3298,3299,1],[3315,3328,13],[3329,3331,1],[3387,3388,1],[3390,3396,1],[3398,3400,1],[3402,3405,1],[3415,3426,11],[3427,3457,30],[3458,3459,1],[3530,3535,5],[3536,3540,1],[3542,3544,2],[3545,3551,1],[3570,3571,1],[3633,3636,3],[3637,3642,1],[3655,3662,1],[3761,3764,3],[3765,3772,1],[3784,3790,1],[3864,3865,1],[3893,3897,2],[3902,3903,1],[3953,3972,1],[3974,3975,1],[3981,3991,1],[3993,4028,1],[4038,4139,101],[4140,4158,1],[4182,4185,1],[4190,4192,1],[4194,4196,1],[4199,4205,1],[4209,4212,1],[4226,4237,1],[4239,4250,11],[4251,4253,1],[4957,4959,1],[5906,5909,1],[5938,5940,1],[5970,5971,1],[6002,6003,1],[6068,6099,1],[6109,6155,46],[6156,6157,1],[6159,6277,118],[6278,6313,35],[6432,6443,1],[6448,6459,1],[6679,6683,1],[6741,6750,1],[6752,6780,1],[6783,6832,49],[6833,6862,1],[6912,6916,1],[6964,6980,1],[7019,7027,1],[7040,7042,1],[7073,7085,1],[7142,7155,1],[7204,7223,1],[7376,7378,1],[7380,7400,1],[7405,7412,7],[7415,7417,1],[7616,7679,1],[8400,8432,1],[11503,11505,1],[11647,11744,97],[11745,11775,1],[12330,12335,1],[12441,12442,1],[42607,42610,1],[42612,42621,1],[42654,42655,1],[42736,42737,1],[43010,43014,4],[43019,43043,24],[43044,43047,1],[43052,43136,84],[43137,43188,51],[43189,43205,1],[43232,43249,1],[43263,43302,39],[43303,43309,1],[43335,43347,1],[43392,43395,1],[43443,43456,1],[43493,43561,68],[43562,43574,1],[43587,43596,9],[43597,43643,46],[43644,43645,1],[43696,43698,2],[43699,43700,1],[43703,43704,1],[43710,43711,1],[43713,43755,42],[43756,43759,1],[43765,43766,1],[44003,44010,1],[44012,44013,1],[64286,65024,738],[65025,65039,1],[65056,65071,1],[66045,66272,227],[66422,66426,1],[68097,68099,1],[68101,68102,1],[68108,68111,1],[68152,68154,1],[68159,68325,166],[68326,68900,574],[68901,68903,1],[69291,69292,1],[69373,69375,1],[69446,69456,1],[69506,69509,1],[69632,69634,1],[69688,69702,1],[69744,69747,3],[69748,69759,11],[69760,69762,1],[69808,69818,1],[69826,69888,62],[69889,69890,1],[69927,69940,1],[69957,69958,1],[70003,70016,13],[70017,70018,1],[70067,70080,1],[70089,70092,1],[70094,70095,1],[70188,70199,1],[70206,70209,3],[70367,70378,1],[70400,70403,1],[70459,70460,1],[70462,70468,1],[70471,70472,1],[70475,70477,1],[70487,70498,11],[70499,70502,3],[70503,70508,1],[70512,70516,1],[70709,70726,1],[70750,70832,82],[70833,70851,1],[71087,71093,1],[71096,71104,1],[71132,71133,1],[71216,71232,1],[71339,71351,1],[71453,71467,1],[71724,71738,1],[71984,71989,1],[71991,71992,1],[71995,71998,1],[72e3,72002,2],[72003,72145,142],[72146,72151,1],[72154,72160,1],[72164,72193,29],[72194,72202,1],[72243,72249,1],[72251,72254,1],[72263,72273,10],[72274,72283,1],[72330,72345,1],[72751,72758,1],[72760,72767,1],[72850,72871,1],[72873,72886,1],[73009,73014,1],[73018,73020,2],[73021,73023,2],[73024,73029,1],[73031,73098,67],[73099,73102,1],[73104,73105,1],[73107,73111,1],[73459,73462,1],[73472,73473,1],[73475,73524,49],[73525,73530,1],[73534,73538,1],[78912,78919,7],[78920,78933,1],[92912,92916,1],[92976,92982,1],[94031,94033,2],[94034,94087,1],[94095,94098,1],[94180,94192,12],[94193,113821,19628],[113822,118528,4706],[118529,118573,1],[118576,118598,1],[119141,119145,1],[119149,119154,1],[119163,119170,1],[119173,119179,1],[119210,119213,1],[119362,119364,1],[121344,121398,1],[121403,121452,1],[121461,121476,15],[121499,121503,1],[121505,121519,1],[122880,122886,1],[122888,122904,1],[122907,122913,1],[122915,122916,1],[122918,122922,1],[123023,123184,161],[123185,123190,1],[123566,123628,62],[123629,123631,1],[124140,124143,1],[125136,125142,1],[125252,125258,1],[917760,917999,1]]),g(d,"foldM",[[921,953,32],[8126,8126,1]]),g(d,"Mc",[[2307,2363,56],[2366,2368,1],[2377,2380,1],[2382,2383,1],[2434,2435,1],[2494,2496,1],[2503,2504,1],[2507,2508,1],[2519,2563,44],[2622,2624,1],[2691,2750,59],[2751,2752,1],[2761,2763,2],[2764,2818,54],[2819,2878,59],[2880,2887,7],[2888,2891,3],[2892,2903,11],[3006,3007,1],[3009,3010,1],[3014,3016,1],[3018,3020,1],[3031,3073,42],[3074,3075,1],[3137,3140,1],[3202,3203,1],[3262,3264,2],[3265,3268,1],[3271,3272,1],[3274,3275,1],[3285,3286,1],[3315,3330,15],[3331,3390,59],[3391,3392,1],[3398,3400,1],[3402,3404,1],[3415,3458,43],[3459,3535,76],[3536,3537,1],[3544,3551,1],[3570,3571,1],[3902,3903,1],[3967,4139,172],[4140,4145,5],[4152,4155,3],[4156,4182,26],[4183,4194,11],[4195,4196,1],[4199,4205,1],[4227,4228,1],[4231,4236,1],[4239,4250,11],[4251,4252,1],[5909,5940,31],[6070,6078,8],[6079,6085,1],[6087,6088,1],[6435,6438,1],[6441,6443,1],[6448,6449,1],[6451,6456,1],[6681,6682,1],[6741,6743,2],[6753,6755,2],[6756,6765,9],[6766,6770,1],[6916,6965,49],[6971,6973,2],[6974,6977,1],[6979,6980,1],[7042,7073,31],[7078,7079,1],[7082,7143,61],[7146,7148,1],[7150,7154,4],[7155,7204,49],[7205,7211,1],[7220,7221,1],[7393,7415,22],[12334,12335,1],[43043,43044,1],[43047,43136,89],[43137,43188,51],[43189,43203,1],[43346,43347,1],[43395,43444,49],[43445,43450,5],[43451,43454,3],[43455,43456,1],[43567,43568,1],[43571,43572,1],[43597,43643,46],[43645,43755,110],[43758,43759,1],[43765,44003,238],[44004,44006,2],[44007,44009,2],[44010,44012,2],[69632,69634,2],[69762,69808,46],[69809,69810,1],[69815,69816,1],[69932,69957,25],[69958,70018,60],[70067,70069,1],[70079,70080,1],[70094,70188,94],[70189,70190,1],[70194,70195,1],[70197,70368,171],[70369,70370,1],[70402,70403,1],[70462,70463,1],[70465,70468,1],[70471,70472,1],[70475,70477,1],[70487,70498,11],[70499,70709,210],[70710,70711,1],[70720,70721,1],[70725,70832,107],[70833,70834,1],[70841,70843,2],[70844,70846,1],[70849,71087,238],[71088,71089,1],[71096,71099,1],[71102,71216,114],[71217,71218,1],[71227,71228,1],[71230,71340,110],[71342,71343,1],[71350,71456,106],[71457,71462,5],[71724,71726,1],[71736,71984,248],[71985,71989,1],[71991,71992,1],[71997,72e3,3],[72002,72145,143],[72146,72147,1],[72156,72159,1],[72164,72249,85],[72279,72280,1],[72343,72751,408],[72766,72873,107],[72881,72884,3],[73098,73102,1],[73107,73108,1],[73110,73461,351],[73462,73475,13],[73524,73525,1],[73534,73535,1],[73537,94033,20496],[94034,94087,1],[94192,94193,1],[119141,119142,1],[119149,119154,1]]),g(d,"Me",[[1160,1161,1],[6846,8413,1567],[8414,8416,1],[8418,8420,1],[42608,42610,1]]),g(d,"Mn",[[768,879,1],[1155,1159,1],[1425,1469,1],[1471,1473,2],[1474,1476,2],[1477,1479,2],[1552,1562,1],[1611,1631,1],[1648,1750,102],[1751,1756,1],[1759,1764,1],[1767,1768,1],[1770,1773,1],[1809,1840,31],[1841,1866,1],[1958,1968,1],[2027,2035,1],[2045,2070,25],[2071,2073,1],[2075,2083,1],[2085,2087,1],[2089,2093,1],[2137,2139,1],[2200,2207,1],[2250,2273,1],[2275,2306,1],[2362,2364,2],[2369,2376,1],[2381,2385,4],[2386,2391,1],[2402,2403,1],[2433,2492,59],[2497,2500,1],[2509,2530,21],[2531,2558,27],[2561,2562,1],[2620,2625,5],[2626,2631,5],[2632,2635,3],[2636,2637,1],[2641,2672,31],[2673,2677,4],[2689,2690,1],[2748,2753,5],[2754,2757,1],[2759,2760,1],[2765,2786,21],[2787,2810,23],[2811,2815,1],[2817,2876,59],[2879,2881,2],[2882,2884,1],[2893,2901,8],[2902,2914,12],[2915,2946,31],[3008,3021,13],[3072,3076,4],[3132,3134,2],[3135,3136,1],[3142,3144,1],[3146,3149,1],[3157,3158,1],[3170,3171,1],[3201,3260,59],[3263,3270,7],[3276,3277,1],[3298,3299,1],[3328,3329,1],[3387,3388,1],[3393,3396,1],[3405,3426,21],[3427,3457,30],[3530,3538,8],[3539,3540,1],[3542,3633,91],[3636,3642,1],[3655,3662,1],[3761,3764,3],[3765,3772,1],[3784,3790,1],[3864,3865,1],[3893,3897,2],[3953,3966,1],[3968,3972,1],[3974,3975,1],[3981,3991,1],[3993,4028,1],[4038,4141,103],[4142,4144,1],[4146,4151,1],[4153,4154,1],[4157,4158,1],[4184,4185,1],[4190,4192,1],[4209,4212,1],[4226,4229,3],[4230,4237,7],[4253,4957,704],[4958,4959,1],[5906,5908,1],[5938,5939,1],[5970,5971,1],[6002,6003,1],[6068,6069,1],[6071,6077,1],[6086,6089,3],[6090,6099,1],[6109,6155,46],[6156,6157,1],[6159,6277,118],[6278,6313,35],[6432,6434,1],[6439,6440,1],[6450,6457,7],[6458,6459,1],[6679,6680,1],[6683,6742,59],[6744,6750,1],[6752,6754,2],[6757,6764,1],[6771,6780,1],[6783,6832,49],[6833,6845,1],[6847,6862,1],[6912,6915,1],[6964,6966,2],[6967,6970,1],[6972,6978,6],[7019,7027,1],[7040,7041,1],[7074,7077,1],[7080,7081,1],[7083,7085,1],[7142,7144,2],[7145,7149,4],[7151,7153,1],[7212,7219,1],[7222,7223,1],[7376,7378,1],[7380,7392,1],[7394,7400,1],[7405,7412,7],[7416,7417,1],[7616,7679,1],[8400,8412,1],[8417,8421,4],[8422,8432,1],[11503,11505,1],[11647,11744,97],[11745,11775,1],[12330,12333,1],[12441,12442,1],[42607,42612,5],[42613,42621,1],[42654,42655,1],[42736,42737,1],[43010,43014,4],[43019,43045,26],[43046,43052,6],[43204,43205,1],[43232,43249,1],[43263,43302,39],[43303,43309,1],[43335,43345,1],[43392,43394,1],[43443,43446,3],[43447,43449,1],[43452,43453,1],[43493,43561,68],[43562,43566,1],[43569,43570,1],[43573,43574,1],[43587,43596,9],[43644,43696,52],[43698,43700,1],[43703,43704,1],[43710,43711,1],[43713,43756,43],[43757,43766,9],[44005,44008,3],[44013,64286,20273],[65024,65039,1],[65056,65071,1],[66045,66272,227],[66422,66426,1],[68097,68099,1],[68101,68102,1],[68108,68111,1],[68152,68154,1],[68159,68325,166],[68326,68900,574],[68901,68903,1],[69291,69292,1],[69373,69375,1],[69446,69456,1],[69506,69509,1],[69633,69688,55],[69689,69702,1],[69744,69747,3],[69748,69759,11],[69760,69761,1],[69811,69814,1],[69817,69818,1],[69826,69888,62],[69889,69890,1],[69927,69931,1],[69933,69940,1],[70003,70016,13],[70017,70070,53],[70071,70078,1],[70089,70092,1],[70095,70191,96],[70192,70193,1],[70196,70198,2],[70199,70206,7],[70209,70367,158],[70371,70378,1],[70400,70401,1],[70459,70460,1],[70464,70502,38],[70503,70508,1],[70512,70516,1],[70712,70719,1],[70722,70724,1],[70726,70750,24],[70835,70840,1],[70842,70847,5],[70848,70850,2],[70851,71090,239],[71091,71093,1],[71100,71101,1],[71103,71104,1],[71132,71133,1],[71219,71226,1],[71229,71231,2],[71232,71339,107],[71341,71344,3],[71345,71349,1],[71351,71453,102],[71454,71455,1],[71458,71461,1],[71463,71467,1],[71727,71735,1],[71737,71738,1],[71995,71996,1],[71998,72003,5],[72148,72151,1],[72154,72155,1],[72160,72193,33],[72194,72202,1],[72243,72248,1],[72251,72254,1],[72263,72273,10],[72274,72278,1],[72281,72283,1],[72330,72342,1],[72344,72345,1],[72752,72758,1],[72760,72765,1],[72767,72850,83],[72851,72871,1],[72874,72880,1],[72882,72883,1],[72885,72886,1],[73009,73014,1],[73018,73020,2],[73021,73023,2],[73024,73029,1],[73031,73104,73],[73105,73109,4],[73111,73459,348],[73460,73472,12],[73473,73526,53],[73527,73530,1],[73536,73538,2],[78912,78919,7],[78920,78933,1],[92912,92916,1],[92976,92982,1],[94031,94095,64],[94096,94098,1],[94180,113821,19641],[113822,118528,4706],[118529,118573,1],[118576,118598,1],[119143,119145,1],[119163,119170,1],[119173,119179,1],[119210,119213,1],[119362,119364,1],[121344,121398,1],[121403,121452,1],[121461,121476,15],[121499,121503,1],[121505,121519,1],[122880,122886,1],[122888,122904,1],[122907,122913,1],[122915,122916,1],[122918,122922,1],[123023,123184,161],[123185,123190,1],[123566,123628,62],[123629,123631,1],[124140,124143,1],[125136,125142,1],[125252,125258,1],[917760,917999,1]]),g(d,"foldMn",[[921,953,32],[8126,8126,1]]),g(d,"N",[[48,57,1],[178,179,1],[185,188,3],[189,190,1],[1632,1641,1],[1776,1785,1],[1984,1993,1],[2406,2415,1],[2534,2543,1],[2548,2553,1],[2662,2671,1],[2790,2799,1],[2918,2927,1],[2930,2935,1],[3046,3058,1],[3174,3183,1],[3192,3198,1],[3302,3311,1],[3416,3422,1],[3430,3448,1],[3558,3567,1],[3664,3673,1],[3792,3801,1],[3872,3891,1],[4160,4169,1],[4240,4249,1],[4969,4988,1],[5870,5872,1],[6112,6121,1],[6128,6137,1],[6160,6169,1],[6470,6479,1],[6608,6618,1],[6784,6793,1],[6800,6809,1],[6992,7001,1],[7088,7097,1],[7232,7241,1],[7248,7257,1],[8304,8308,4],[8309,8313,1],[8320,8329,1],[8528,8578,1],[8581,8585,1],[9312,9371,1],[9450,9471,1],[10102,10131,1],[11517,12295,778],[12321,12329,1],[12344,12346,1],[12690,12693,1],[12832,12841,1],[12872,12879,1],[12881,12895,1],[12928,12937,1],[12977,12991,1],[42528,42537,1],[42726,42735,1],[43056,43061,1],[43216,43225,1],[43264,43273,1],[43472,43481,1],[43504,43513,1],[43600,43609,1],[44016,44025,1],[65296,65305,1],[65799,65843,1],[65856,65912,1],[65930,65931,1],[66273,66299,1],[66336,66339,1],[66369,66378,9],[66513,66517,1],[66720,66729,1],[67672,67679,1],[67705,67711,1],[67751,67759,1],[67835,67839,1],[67862,67867,1],[68028,68029,1],[68032,68047,1],[68050,68095,1],[68160,68168,1],[68221,68222,1],[68253,68255,1],[68331,68335,1],[68440,68447,1],[68472,68479,1],[68521,68527,1],[68858,68863,1],[68912,68921,1],[69216,69246,1],[69405,69414,1],[69457,69460,1],[69573,69579,1],[69714,69743,1],[69872,69881,1],[69942,69951,1],[70096,70105,1],[70113,70132,1],[70384,70393,1],[70736,70745,1],[70864,70873,1],[71248,71257,1],[71360,71369,1],[71472,71483,1],[71904,71922,1],[72016,72025,1],[72784,72812,1],[73040,73049,1],[73120,73129,1],[73552,73561,1],[73664,73684,1],[74752,74862,1],[92768,92777,1],[92864,92873,1],[93008,93017,1],[93019,93025,1],[93824,93846,1],[119488,119507,1],[119520,119539,1],[119648,119672,1],[120782,120831,1],[123200,123209,1],[123632,123641,1],[124144,124153,1],[125127,125135,1],[125264,125273,1],[126065,126123,1],[126125,126127,1],[126129,126132,1],[126209,126253,1],[126255,126269,1],[127232,127244,1],[130032,130041,1]]),g(d,"Nd",[[48,57,1],[1632,1641,1],[1776,1785,1],[1984,1993,1],[2406,2415,1],[2534,2543,1],[2662,2671,1],[2790,2799,1],[2918,2927,1],[3046,3055,1],[3174,3183,1],[3302,3311,1],[3430,3439,1],[3558,3567,1],[3664,3673,1],[3792,3801,1],[3872,3881,1],[4160,4169,1],[4240,4249,1],[6112,6121,1],[6160,6169,1],[6470,6479,1],[6608,6617,1],[6784,6793,1],[6800,6809,1],[6992,7001,1],[7088,7097,1],[7232,7241,1],[7248,7257,1],[42528,42537,1],[43216,43225,1],[43264,43273,1],[43472,43481,1],[43504,43513,1],[43600,43609,1],[44016,44025,1],[65296,65305,1],[66720,66729,1],[68912,68921,1],[69734,69743,1],[69872,69881,1],[69942,69951,1],[70096,70105,1],[70384,70393,1],[70736,70745,1],[70864,70873,1],[71248,71257,1],[71360,71369,1],[71472,71481,1],[71904,71913,1],[72016,72025,1],[72784,72793,1],[73040,73049,1],[73120,73129,1],[73552,73561,1],[92768,92777,1],[92864,92873,1],[93008,93017,1],[120782,120831,1],[123200,123209,1],[123632,123641,1],[124144,124153,1],[125264,125273,1],[130032,130041,1]]),g(d,"Nl",[[5870,5872,1],[8544,8578,1],[8581,8584,1],[12295,12321,26],[12322,12329,1],[12344,12346,1],[42726,42735,1],[65856,65908,1],[66369,66378,9],[66513,66517,1],[74752,74862,1]]),g(d,"No",[[178,179,1],[185,188,3],[189,190,1],[2548,2553,1],[2930,2935,1],[3056,3058,1],[3192,3198,1],[3416,3422,1],[3440,3448,1],[3882,3891,1],[4969,4988,1],[6128,6137,1],[6618,8304,1686],[8308,8313,1],[8320,8329,1],[8528,8543,1],[8585,9312,727],[9313,9371,1],[9450,9471,1],[10102,10131,1],[11517,12690,1173],[12691,12693,1],[12832,12841,1],[12872,12879,1],[12881,12895,1],[12928,12937,1],[12977,12991,1],[43056,43061,1],[65799,65843,1],[65909,65912,1],[65930,65931,1],[66273,66299,1],[66336,66339,1],[67672,67679,1],[67705,67711,1],[67751,67759,1],[67835,67839,1],[67862,67867,1],[68028,68029,1],[68032,68047,1],[68050,68095,1],[68160,68168,1],[68221,68222,1],[68253,68255,1],[68331,68335,1],[68440,68447,1],[68472,68479,1],[68521,68527,1],[68858,68863,1],[69216,69246,1],[69405,69414,1],[69457,69460,1],[69573,69579,1],[69714,69733,1],[70113,70132,1],[71482,71483,1],[71914,71922,1],[72794,72812,1],[73664,73684,1],[93019,93025,1],[93824,93846,1],[119488,119507,1],[119520,119539,1],[119648,119672,1],[125127,125135,1],[126065,126123,1],[126125,126127,1],[126129,126132,1],[126209,126253,1],[126255,126269,1],[127232,127244,1]]),g(d,"P",[[33,35,1],[37,42,1],[44,47,1],[58,59,1],[63,64,1],[91,93,1],[95,123,28],[125,161,36],[167,171,4],[182,183,1],[187,191,4],[894,903,9],[1370,1375,1],[1417,1418,1],[1470,1472,2],[1475,1478,3],[1523,1524,1],[1545,1546,1],[1548,1549,1],[1563,1565,2],[1566,1567,1],[1642,1645,1],[1748,1792,44],[1793,1805,1],[2039,2041,1],[2096,2110,1],[2142,2404,262],[2405,2416,11],[2557,2678,121],[2800,3191,391],[3204,3572,368],[3663,3674,11],[3675,3844,169],[3845,3858,1],[3860,3898,38],[3899,3901,1],[3973,4048,75],[4049,4052,1],[4057,4058,1],[4170,4175,1],[4347,4960,613],[4961,4968,1],[5120,5742,622],[5787,5788,1],[5867,5869,1],[5941,5942,1],[6100,6102,1],[6104,6106,1],[6144,6154,1],[6468,6469,1],[6686,6687,1],[6816,6822,1],[6824,6829,1],[7002,7008,1],[7037,7038,1],[7164,7167,1],[7227,7231,1],[7294,7295,1],[7360,7367,1],[7379,8208,829],[8209,8231,1],[8240,8259,1],[8261,8273,1],[8275,8286,1],[8317,8318,1],[8333,8334,1],[8968,8971,1],[9001,9002,1],[10088,10101,1],[10181,10182,1],[10214,10223,1],[10627,10648,1],[10712,10715,1],[10748,10749,1],[11513,11516,1],[11518,11519,1],[11632,11776,144],[11777,11822,1],[11824,11855,1],[11858,11869,1],[12289,12291,1],[12296,12305,1],[12308,12319,1],[12336,12349,13],[12448,12539,91],[42238,42239,1],[42509,42511,1],[42611,42622,11],[42738,42743,1],[43124,43127,1],[43214,43215,1],[43256,43258,1],[43260,43310,50],[43311,43359,48],[43457,43469,1],[43486,43487,1],[43612,43615,1],[43742,43743,1],[43760,43761,1],[44011,64830,20819],[64831,65040,209],[65041,65049,1],[65072,65106,1],[65108,65121,1],[65123,65128,5],[65130,65131,1],[65281,65283,1],[65285,65290,1],[65292,65295,1],[65306,65307,1],[65311,65312,1],[65339,65341,1],[65343,65371,28],[65373,65375,2],[65376,65381,1],[65792,65794,1],[66463,66512,49],[66927,67671,744],[67871,67903,32],[68176,68184,1],[68223,68336,113],[68337,68342,1],[68409,68415,1],[68505,68508,1],[69293,69461,168],[69462,69465,1],[69510,69513,1],[69703,69709,1],[69819,69820,1],[69822,69825,1],[69952,69955,1],[70004,70005,1],[70085,70088,1],[70093,70107,14],[70109,70111,1],[70200,70205,1],[70313,70731,418],[70732,70735,1],[70746,70747,1],[70749,70854,105],[71105,71127,1],[71233,71235,1],[71264,71276,1],[71353,71484,131],[71485,71486,1],[71739,72004,265],[72005,72006,1],[72162,72255,93],[72256,72262,1],[72346,72348,1],[72350,72354,1],[72448,72457,1],[72769,72773,1],[72816,72817,1],[73463,73464,1],[73539,73551,1],[73727,74864,1137],[74865,74868,1],[77809,77810,1],[92782,92783,1],[92917,92983,66],[92984,92987,1],[92996,93847,851],[93848,93850,1],[94178,113823,19645],[121479,121483,1],[125278,125279,1]]),g(d,"Pc",[[95,8255,8160],[8256,8276,20],[65075,65076,1],[65101,65103,1],[65343,65343,1]]),g(d,"Pd",[[45,1418,1373],[1470,5120,3650],[6150,8208,2058],[8209,8213,1],[11799,11802,3],[11834,11835,1],[11840,11869,29],[12316,12336,20],[12448,65073,52625],[65074,65112,38],[65123,65293,170],[69293,69293,1]]),g(d,"Pe",[[41,93,52],[125,3899,3774],[3901,5788,1887],[8262,8318,56],[8334,8969,635],[8971,9002,31],[10089,10101,2],[10182,10215,33],[10217,10223,2],[10628,10648,2],[10713,10715,2],[10749,11811,1062],[11813,11817,2],[11862,11868,2],[12297,12305,2],[12309,12315,2],[12318,12319,1],[64830,65048,218],[65078,65092,2],[65096,65114,18],[65116,65118,2],[65289,65341,52],[65373,65379,3]]),g(d,"Pf",[[187,8217,8030],[8221,8250,29],[11779,11781,2],[11786,11789,3],[11805,11809,4]]),g(d,"Pi",[[171,8216,8045],[8219,8220,1],[8223,8249,26],[11778,11780,2],[11785,11788,3],[11804,11808,4]]),g(d,"Po",[[33,35,1],[37,39,1],[42,46,2],[47,58,11],[59,63,4],[64,92,28],[161,167,6],[182,183,1],[191,894,703],[903,1370,467],[1371,1375,1],[1417,1472,55],[1475,1478,3],[1523,1524,1],[1545,1546,1],[1548,1549,1],[1563,1565,2],[1566,1567,1],[1642,1645,1],[1748,1792,44],[1793,1805,1],[2039,2041,1],[2096,2110,1],[2142,2404,262],[2405,2416,11],[2557,2678,121],[2800,3191,391],[3204,3572,368],[3663,3674,11],[3675,3844,169],[3845,3858,1],[3860,3973,113],[4048,4052,1],[4057,4058,1],[4170,4175,1],[4347,4960,613],[4961,4968,1],[5742,5867,125],[5868,5869,1],[5941,5942,1],[6100,6102,1],[6104,6106,1],[6144,6149,1],[6151,6154,1],[6468,6469,1],[6686,6687,1],[6816,6822,1],[6824,6829,1],[7002,7008,1],[7037,7038,1],[7164,7167,1],[7227,7231,1],[7294,7295,1],[7360,7367,1],[7379,8214,835],[8215,8224,9],[8225,8231,1],[8240,8248,1],[8251,8254,1],[8257,8259,1],[8263,8273,1],[8275,8277,2],[8278,8286,1],[11513,11516,1],[11518,11519,1],[11632,11776,144],[11777,11782,5],[11783,11784,1],[11787,11790,3],[11791,11798,1],[11800,11801,1],[11803,11806,3],[11807,11818,11],[11819,11822,1],[11824,11833,1],[11836,11839,1],[11841,11843,2],[11844,11855,1],[11858,11860,1],[12289,12291,1],[12349,12539,190],[42238,42239,1],[42509,42511,1],[42611,42622,11],[42738,42743,1],[43124,43127,1],[43214,43215,1],[43256,43258,1],[43260,43310,50],[43311,43359,48],[43457,43469,1],[43486,43487,1],[43612,43615,1],[43742,43743,1],[43760,43761,1],[44011,65040,21029],[65041,65046,1],[65049,65072,23],[65093,65094,1],[65097,65100,1],[65104,65106,1],[65108,65111,1],[65119,65121,1],[65128,65130,2],[65131,65281,150],[65282,65283,1],[65285,65287,1],[65290,65294,2],[65295,65306,11],[65307,65311,4],[65312,65340,28],[65377,65380,3],[65381,65792,411],[65793,65794,1],[66463,66512,49],[66927,67671,744],[67871,67903,32],[68176,68184,1],[68223,68336,113],[68337,68342,1],[68409,68415,1],[68505,68508,1],[69461,69465,1],[69510,69513,1],[69703,69709,1],[69819,69820,1],[69822,69825,1],[69952,69955,1],[70004,70005,1],[70085,70088,1],[70093,70107,14],[70109,70111,1],[70200,70205,1],[70313,70731,418],[70732,70735,1],[70746,70747,1],[70749,70854,105],[71105,71127,1],[71233,71235,1],[71264,71276,1],[71353,71484,131],[71485,71486,1],[71739,72004,265],[72005,72006,1],[72162,72255,93],[72256,72262,1],[72346,72348,1],[72350,72354,1],[72448,72457,1],[72769,72773,1],[72816,72817,1],[73463,73464,1],[73539,73551,1],[73727,74864,1137],[74865,74868,1],[77809,77810,1],[92782,92783,1],[92917,92983,66],[92984,92987,1],[92996,93847,851],[93848,93850,1],[94178,113823,19645],[121479,121483,1],[125278,125279,1]]),g(d,"Ps",[[40,91,51],[123,3898,3775],[3900,5787,1887],[8218,8222,4],[8261,8317,56],[8333,8968,635],[8970,9001,31],[10088,10100,2],[10181,10214,33],[10216,10222,2],[10627,10647,2],[10712,10714,2],[10748,11810,1062],[11812,11816,2],[11842,11861,19],[11863,11867,2],[12296,12304,2],[12308,12314,2],[12317,64831,52514],[65047,65077,30],[65079,65091,2],[65095,65113,18],[65115,65117,2],[65288,65339,51],[65371,65375,4],[65378,65378,1]]),g(d,"S",[[36,43,7],[60,62,1],[94,96,2],[124,126,2],[162,166,1],[168,169,1],[172,174,2],[175,177,1],[180,184,4],[215,247,32],[706,709,1],[722,735,1],[741,747,1],[749,751,2],[752,767,1],[885,900,15],[901,1014,113],[1154,1421,267],[1422,1423,1],[1542,1544,1],[1547,1550,3],[1551,1758,207],[1769,1789,20],[1790,2038,248],[2046,2047,1],[2184,2546,362],[2547,2554,7],[2555,2801,246],[2928,3059,131],[3060,3066,1],[3199,3407,208],[3449,3647,198],[3841,3843,1],[3859,3861,2],[3862,3863,1],[3866,3871,1],[3892,3896,2],[4030,4037,1],[4039,4044,1],[4046,4047,1],[4053,4056,1],[4254,4255,1],[5008,5017,1],[5741,6107,366],[6464,6622,158],[6623,6655,1],[7009,7018,1],[7028,7036,1],[8125,8127,2],[8128,8129,1],[8141,8143,1],[8157,8159,1],[8173,8175,1],[8189,8190,1],[8260,8274,14],[8314,8316,1],[8330,8332,1],[8352,8384,1],[8448,8449,1],[8451,8454,1],[8456,8457,1],[8468,8470,2],[8471,8472,1],[8478,8483,1],[8485,8489,2],[8494,8506,12],[8507,8512,5],[8513,8516,1],[8522,8525,1],[8527,8586,59],[8587,8592,5],[8593,8967,1],[8972,9e3,1],[9003,9254,1],[9280,9290,1],[9372,9449,1],[9472,10087,1],[10132,10180,1],[10183,10213,1],[10224,10626,1],[10649,10711,1],[10716,10747,1],[10750,11123,1],[11126,11157,1],[11159,11263,1],[11493,11498,1],[11856,11857,1],[11904,11929,1],[11931,12019,1],[12032,12245,1],[12272,12287,1],[12292,12306,14],[12307,12320,13],[12342,12343,1],[12350,12351,1],[12443,12444,1],[12688,12689,1],[12694,12703,1],[12736,12771,1],[12783,12800,17],[12801,12830,1],[12842,12871,1],[12880,12896,16],[12897,12927,1],[12938,12976,1],[12992,13311,1],[19904,19967,1],[42128,42182,1],[42752,42774,1],[42784,42785,1],[42889,42890,1],[43048,43051,1],[43062,43065,1],[43639,43641,1],[43867,43882,15],[43883,64297,20414],[64434,64450,1],[64832,64847,1],[64975,65020,45],[65021,65023,1],[65122,65124,2],[65125,65126,1],[65129,65284,155],[65291,65308,17],[65309,65310,1],[65342,65344,2],[65372,65374,2],[65504,65510,1],[65512,65518,1],[65532,65533,1],[65847,65855,1],[65913,65929,1],[65932,65934,1],[65936,65948,1],[65952,66e3,48],[66001,66044,1],[67703,67704,1],[68296,71487,3191],[73685,73713,1],[92988,92991,1],[92997,113820,20823],[118608,118723,1],[118784,119029,1],[119040,119078,1],[119081,119140,1],[119146,119148,1],[119171,119172,1],[119180,119209,1],[119214,119274,1],[119296,119361,1],[119365,119552,187],[119553,119638,1],[120513,120539,26],[120571,120597,26],[120629,120655,26],[120687,120713,26],[120745,120771,26],[120832,121343,1],[121399,121402,1],[121453,121460,1],[121462,121475,1],[121477,121478,1],[123215,123647,432],[126124,126128,4],[126254,126704,450],[126705,126976,271],[126977,127019,1],[127024,127123,1],[127136,127150,1],[127153,127167,1],[127169,127183,1],[127185,127221,1],[127245,127405,1],[127462,127490,1],[127504,127547,1],[127552,127560,1],[127568,127569,1],[127584,127589,1],[127744,128727,1],[128732,128748,1],[128752,128764,1],[128768,128886,1],[128891,128985,1],[128992,129003,1],[129008,129024,16],[129025,129035,1],[129040,129095,1],[129104,129113,1],[129120,129159,1],[129168,129197,1],[129200,129201,1],[129280,129619,1],[129632,129645,1],[129648,129660,1],[129664,129672,1],[129680,129725,1],[129727,129733,1],[129742,129755,1],[129760,129768,1],[129776,129784,1],[129792,129938,1],[129940,129994,1]]),g(d,"Sc",[[36,162,126],[163,165,1],[1423,1547,124],[2046,2047,1],[2546,2547,1],[2555,2801,246],[3065,3647,582],[6107,8352,2245],[8353,8384,1],[43064,65020,21956],[65129,65284,155],[65504,65505,1],[65509,65510,1],[73693,73696,1],[123647,126128,2481]]),g(d,"Sk",[[94,96,2],[168,175,7],[180,184,4],[706,709,1],[722,735,1],[741,747,1],[749,751,2],[752,767,1],[885,900,15],[901,2184,1283],[8125,8127,2],[8128,8129,1],[8141,8143,1],[8157,8159,1],[8173,8175,1],[8189,8190,1],[12443,12444,1],[42752,42774,1],[42784,42785,1],[42889,42890,1],[43867,43882,15],[43883,64434,20551],[64435,64450,1],[65342,65344,2],[65507,127995,62488],[127996,127999,1]]),g(d,"Sm",[[43,60,17],[61,62,1],[124,126,2],[172,177,5],[215,247,32],[1014,1542,528],[1543,1544,1],[8260,8274,14],[8314,8316,1],[8330,8332,1],[8472,8512,40],[8513,8516,1],[8523,8592,69],[8593,8596,1],[8602,8603,1],[8608,8614,3],[8622,8654,32],[8655,8658,3],[8660,8692,32],[8693,8959,1],[8992,8993,1],[9084,9115,31],[9116,9139,1],[9180,9185,1],[9655,9665,10],[9720,9727,1],[9839,10176,337],[10177,10180,1],[10183,10213,1],[10224,10239,1],[10496,10626,1],[10649,10711,1],[10716,10747,1],[10750,11007,1],[11056,11076,1],[11079,11084,1],[64297,65122,825],[65124,65126,1],[65291,65308,17],[65309,65310,1],[65372,65374,2],[65506,65513,7],[65514,65516,1],[120513,120539,26],[120571,120597,26],[120629,120655,26],[120687,120713,26],[120745,120771,26],[126704,126705,1]]),g(d,"So",[[166,169,3],[174,176,2],[1154,1421,267],[1422,1550,128],[1551,1758,207],[1769,1789,20],[1790,2038,248],[2554,2928,374],[3059,3064,1],[3066,3199,133],[3407,3449,42],[3841,3843,1],[3859,3861,2],[3862,3863,1],[3866,3871,1],[3892,3896,2],[4030,4037,1],[4039,4044,1],[4046,4047,1],[4053,4056,1],[4254,4255,1],[5008,5017,1],[5741,6464,723],[6622,6655,1],[7009,7018,1],[7028,7036,1],[8448,8449,1],[8451,8454,1],[8456,8457,1],[8468,8470,2],[8471,8478,7],[8479,8483,1],[8485,8489,2],[8494,8506,12],[8507,8522,15],[8524,8525,1],[8527,8586,59],[8587,8597,10],[8598,8601,1],[8604,8607,1],[8609,8610,1],[8612,8613,1],[8615,8621,1],[8623,8653,1],[8656,8657,1],[8659,8661,2],[8662,8691,1],[8960,8967,1],[8972,8991,1],[8994,9e3,1],[9003,9083,1],[9085,9114,1],[9140,9179,1],[9186,9254,1],[9280,9290,1],[9372,9449,1],[9472,9654,1],[9656,9664,1],[9666,9719,1],[9728,9838,1],[9840,10087,1],[10132,10175,1],[10240,10495,1],[11008,11055,1],[11077,11078,1],[11085,11123,1],[11126,11157,1],[11159,11263,1],[11493,11498,1],[11856,11857,1],[11904,11929,1],[11931,12019,1],[12032,12245,1],[12272,12287,1],[12292,12306,14],[12307,12320,13],[12342,12343,1],[12350,12351,1],[12688,12689,1],[12694,12703,1],[12736,12771,1],[12783,12800,17],[12801,12830,1],[12842,12871,1],[12880,12896,16],[12897,12927,1],[12938,12976,1],[12992,13311,1],[19904,19967,1],[42128,42182,1],[43048,43051,1],[43062,43063,1],[43065,43639,574],[43640,43641,1],[64832,64847,1],[64975,65021,46],[65022,65023,1],[65508,65512,4],[65517,65518,1],[65532,65533,1],[65847,65855,1],[65913,65929,1],[65932,65934,1],[65936,65948,1],[65952,66e3,48],[66001,66044,1],[67703,67704,1],[68296,71487,3191],[73685,73692,1],[73697,73713,1],[92988,92991,1],[92997,113820,20823],[118608,118723,1],[118784,119029,1],[119040,119078,1],[119081,119140,1],[119146,119148,1],[119171,119172,1],[119180,119209,1],[119214,119274,1],[119296,119361,1],[119365,119552,187],[119553,119638,1],[120832,121343,1],[121399,121402,1],[121453,121460,1],[121462,121475,1],[121477,121478,1],[123215,126124,2909],[126254,126976,722],[126977,127019,1],[127024,127123,1],[127136,127150,1],[127153,127167,1],[127169,127183,1],[127185,127221,1],[127245,127405,1],[127462,127490,1],[127504,127547,1],[127552,127560,1],[127568,127569,1],[127584,127589,1],[127744,127994,1],[128e3,128727,1],[128732,128748,1],[128752,128764,1],[128768,128886,1],[128891,128985,1],[128992,129003,1],[129008,129024,16],[129025,129035,1],[129040,129095,1],[129104,129113,1],[129120,129159,1],[129168,129197,1],[129200,129201,1],[129280,129619,1],[129632,129645,1],[129648,129660,1],[129664,129672,1],[129680,129725,1],[129727,129733,1],[129742,129755,1],[129760,129768,1],[129776,129784,1],[129792,129938,1],[129940,129994,1]]),g(d,"Z",[[32,160,128],[5760,8192,2432],[8193,8202,1],[8232,8233,1],[8239,8287,48],[12288,12288,1]]),g(d,"Zl",[[8232,8232,1]]),g(d,"Zp",[[8233,8233,1]]),g(d,"Zs",[[32,160,128],[5760,8192,2432],[8193,8202,1],[8239,8287,48],[12288,12288,1]]),g(d,"Adlam",[[125184,125259,1],[125264,125273,1],[125278,125279,1]]),g(d,"Ahom",[[71424,71450,1],[71453,71467,1],[71472,71494,1]]),g(d,"Anatolian_Hieroglyphs",[[82944,83526,1]]),g(d,"Arabic",[[1536,1540,1],[1542,1547,1],[1549,1562,1],[1564,1566,1],[1568,1599,1],[1601,1610,1],[1622,1647,1],[1649,1756,1],[1758,1791,1],[1872,1919,1],[2160,2190,1],[2192,2193,1],[2200,2273,1],[2275,2303,1],[64336,64450,1],[64467,64829,1],[64832,64911,1],[64914,64967,1],[64975,65008,33],[65009,65023,1],[65136,65140,1],[65142,65276,1],[69216,69246,1],[69373,69375,1],[126464,126467,1],[126469,126495,1],[126497,126498,1],[126500,126503,3],[126505,126514,1],[126516,126519,1],[126521,126523,2],[126530,126535,5],[126537,126541,2],[126542,126543,1],[126545,126546,1],[126548,126551,3],[126553,126561,2],[126562,126564,2],[126567,126570,1],[126572,126578,1],[126580,126583,1],[126585,126588,1],[126590,126592,2],[126593,126601,1],[126603,126619,1],[126625,126627,1],[126629,126633,1],[126635,126651,1],[126704,126705,1]]),g(d,"Armenian",[[1329,1366,1],[1369,1418,1],[1421,1423,1],[64275,64279,1]]),g(d,"Avestan",[[68352,68405,1],[68409,68415,1]]),g(d,"Balinese",[[6912,6988,1],[6992,7038,1]]),g(d,"Bamum",[[42656,42743,1],[92160,92728,1]]),g(d,"Bassa_Vah",[[92880,92909,1],[92912,92917,1]]),g(d,"Batak",[[7104,7155,1],[7164,7167,1]]),g(d,"Bengali",[[2432,2435,1],[2437,2444,1],[2447,2448,1],[2451,2472,1],[2474,2480,1],[2482,2486,4],[2487,2489,1],[2492,2500,1],[2503,2504,1],[2507,2510,1],[2519,2524,5],[2525,2527,2],[2528,2531,1],[2534,2558,1]]),g(d,"Bhaiksuki",[[72704,72712,1],[72714,72758,1],[72760,72773,1],[72784,72812,1]]),g(d,"Bopomofo",[[746,747,1],[12549,12591,1],[12704,12735,1]]),g(d,"Brahmi",[[69632,69709,1],[69714,69749,1],[69759,69759,1]]),g(d,"Braille",[[10240,10495,1]]),g(d,"Buginese",[[6656,6683,1],[6686,6687,1]]),g(d,"Buhid",[[5952,5971,1]]),g(d,"Canadian_Aboriginal",[[5120,5759,1],[6320,6389,1],[72368,72383,1]]),g(d,"Carian",[[66208,66256,1]]),g(d,"Caucasian_Albanian",[[66864,66915,1],[66927,66927,1]]),g(d,"Chakma",[[69888,69940,1],[69942,69959,1]]),g(d,"Cham",[[43520,43574,1],[43584,43597,1],[43600,43609,1],[43612,43615,1]]),g(d,"Cherokee",[[5024,5109,1],[5112,5117,1],[43888,43967,1]]),g(d,"Chorasmian",[[69552,69579,1]]),g(d,"Common",[[0,64,1],[91,96,1],[123,169,1],[171,185,1],[187,191,1],[215,247,32],[697,735,1],[741,745,1],[748,767,1],[884,894,10],[901,903,2],[1541,1548,7],[1563,1567,4],[1600,1757,157],[2274,2404,130],[2405,3647,1242],[4053,4056,1],[4347,5867,1520],[5868,5869,1],[5941,5942,1],[6146,6147,1],[6149,7379,1230],[7393,7401,8],[7402,7404,1],[7406,7411,1],[7413,7415,1],[7418,8192,774],[8193,8203,1],[8206,8292,1],[8294,8304,1],[8308,8318,1],[8320,8334,1],[8352,8384,1],[8448,8485,1],[8487,8489,1],[8492,8497,1],[8499,8525,1],[8527,8543,1],[8585,8587,1],[8592,9254,1],[9280,9290,1],[9312,10239,1],[10496,11123,1],[11126,11157,1],[11159,11263,1],[11776,11869,1],[12272,12292,1],[12294,12296,2],[12297,12320,1],[12336,12343,1],[12348,12351,1],[12443,12444,1],[12448,12539,91],[12540,12688,148],[12689,12703,1],[12736,12771,1],[12783,12832,49],[12833,12895,1],[12927,13007,1],[13055,13144,89],[13145,13311,1],[19904,19967,1],[42752,42785,1],[42888,42890,1],[43056,43065,1],[43310,43471,161],[43867,43882,15],[43883,64830,20947],[64831,65040,209],[65041,65049,1],[65072,65106,1],[65108,65126,1],[65128,65131,1],[65279,65281,2],[65282,65312,1],[65339,65344,1],[65371,65381,1],[65392,65438,46],[65439,65504,65],[65505,65510,1],[65512,65518,1],[65529,65533,1],[65792,65794,1],[65799,65843,1],[65847,65855,1],[65936,65948,1],[66e3,66044,1],[66273,66299,1],[113824,113827,1],[118608,118723,1],[118784,119029,1],[119040,119078,1],[119081,119142,1],[119146,119162,1],[119171,119172,1],[119180,119209,1],[119214,119274,1],[119488,119507,1],[119520,119539,1],[119552,119638,1],[119648,119672,1],[119808,119892,1],[119894,119964,1],[119966,119967,1],[119970,119973,3],[119974,119977,3],[119978,119980,1],[119982,119993,1],[119995,119997,2],[119998,120003,1],[120005,120069,1],[120071,120074,1],[120077,120084,1],[120086,120092,1],[120094,120121,1],[120123,120126,1],[120128,120132,1],[120134,120138,4],[120139,120144,1],[120146,120485,1],[120488,120779,1],[120782,120831,1],[126065,126132,1],[126209,126269,1],[126976,127019,1],[127024,127123,1],[127136,127150,1],[127153,127167,1],[127169,127183,1],[127185,127221,1],[127232,127405,1],[127462,127487,1],[127489,127490,1],[127504,127547,1],[127552,127560,1],[127568,127569,1],[127584,127589,1],[127744,128727,1],[128732,128748,1],[128752,128764,1],[128768,128886,1],[128891,128985,1],[128992,129003,1],[129008,129024,16],[129025,129035,1],[129040,129095,1],[129104,129113,1],[129120,129159,1],[129168,129197,1],[129200,129201,1],[129280,129619,1],[129632,129645,1],[129648,129660,1],[129664,129672,1],[129680,129725,1],[129727,129733,1],[129742,129755,1],[129760,129768,1],[129776,129784,1],[129792,129938,1],[129940,129994,1],[130032,130041,1],[917505,917536,31],[917537,917631,1]]),g(d,"foldCommon",[[924,956,32]]),g(d,"Coptic",[[994,1007,1],[11392,11507,1],[11513,11519,1]]),g(d,"Cuneiform",[[73728,74649,1],[74752,74862,1],[74864,74868,1],[74880,75075,1]]),g(d,"Cypriot",[[67584,67589,1],[67592,67594,2],[67595,67637,1],[67639,67640,1],[67644,67647,3]]),g(d,"Cypro_Minoan",[[77712,77810,1]]),g(d,"Cyrillic",[[1024,1156,1],[1159,1327,1],[7296,7304,1],[7467,7544,77],[11744,11775,1],[42560,42655,1],[65070,65071,1],[122928,122989,1],[123023,123023,1]]),g(d,"Deseret",[[66560,66639,1]]),g(d,"Devanagari",[[2304,2384,1],[2389,2403,1],[2406,2431,1],[43232,43263,1],[72448,72457,1]]),g(d,"Dives_Akuru",[[71936,71942,1],[71945,71948,3],[71949,71955,1],[71957,71958,1],[71960,71989,1],[71991,71992,1],[71995,72006,1],[72016,72025,1]]),g(d,"Dogra",[[71680,71739,1]]),g(d,"Duployan",[[113664,113770,1],[113776,113788,1],[113792,113800,1],[113808,113817,1],[113820,113823,1]]),g(d,"Egyptian_Hieroglyphs",[[77824,78933,1]]),g(d,"Elbasan",[[66816,66855,1]]),g(d,"Elymaic",[[69600,69622,1]]),g(d,"Ethiopic",[[4608,4680,1],[4682,4685,1],[4688,4694,1],[4696,4698,2],[4699,4701,1],[4704,4744,1],[4746,4749,1],[4752,4784,1],[4786,4789,1],[4792,4798,1],[4800,4802,2],[4803,4805,1],[4808,4822,1],[4824,4880,1],[4882,4885,1],[4888,4954,1],[4957,4988,1],[4992,5017,1],[11648,11670,1],[11680,11686,1],[11688,11694,1],[11696,11702,1],[11704,11710,1],[11712,11718,1],[11720,11726,1],[11728,11734,1],[11736,11742,1],[43777,43782,1],[43785,43790,1],[43793,43798,1],[43808,43814,1],[43816,43822,1],[124896,124902,1],[124904,124907,1],[124909,124910,1],[124912,124926,1]]),g(d,"Georgian",[[4256,4293,1],[4295,4301,6],[4304,4346,1],[4348,4351,1],[7312,7354,1],[7357,7359,1],[11520,11557,1],[11559,11565,6]]),g(d,"Glagolitic",[[11264,11359,1],[122880,122886,1],[122888,122904,1],[122907,122913,1],[122915,122916,1],[122918,122922,1]]),g(d,"Gothic",[[66352,66378,1]]),g(d,"Grantha",[[70400,70403,1],[70405,70412,1],[70415,70416,1],[70419,70440,1],[70442,70448,1],[70450,70451,1],[70453,70457,1],[70460,70468,1],[70471,70472,1],[70475,70477,1],[70480,70487,7],[70493,70499,1],[70502,70508,1],[70512,70516,1]]),g(d,"Greek",[[880,883,1],[885,887,1],[890,893,1],[895,900,5],[902,904,2],[905,906,1],[908,910,2],[911,929,1],[931,993,1],[1008,1023,1],[7462,7466,1],[7517,7521,1],[7526,7530,1],[7615,7936,321],[7937,7957,1],[7960,7965,1],[7968,8005,1],[8008,8013,1],[8016,8023,1],[8025,8031,2],[8032,8061,1],[8064,8116,1],[8118,8132,1],[8134,8147,1],[8150,8155,1],[8157,8175,1],[8178,8180,1],[8182,8190,1],[8486,43877,35391],[65856,65934,1],[65952,119296,53344],[119297,119365,1]]),g(d,"foldGreek",[[181,837,656]]),g(d,"Gujarati",[[2689,2691,1],[2693,2701,1],[2703,2705,1],[2707,2728,1],[2730,2736,1],[2738,2739,1],[2741,2745,1],[2748,2757,1],[2759,2761,1],[2763,2765,1],[2768,2784,16],[2785,2787,1],[2790,2801,1],[2809,2815,1]]),g(d,"Gunjala_Gondi",[[73056,73061,1],[73063,73064,1],[73066,73102,1],[73104,73105,1],[73107,73112,1],[73120,73129,1]]),g(d,"Gurmukhi",[[2561,2563,1],[2565,2570,1],[2575,2576,1],[2579,2600,1],[2602,2608,1],[2610,2611,1],[2613,2614,1],[2616,2617,1],[2620,2622,2],[2623,2626,1],[2631,2632,1],[2635,2637,1],[2641,2649,8],[2650,2652,1],[2654,2662,8],[2663,2678,1]]),g(d,"Han",[[11904,11929,1],[11931,12019,1],[12032,12245,1],[12293,12295,2],[12321,12329,1],[12344,12347,1],[13312,19903,1],[19968,40959,1],[63744,64109,1],[64112,64217,1],[94178,94179,1],[94192,94193,1],[131072,173791,1],[173824,177977,1],[177984,178205,1],[178208,183969,1],[183984,191456,1],[191472,192093,1],[194560,195101,1],[196608,201546,1],[201552,205743,1]]),g(d,"Hangul",[[4352,4607,1],[12334,12335,1],[12593,12686,1],[12800,12830,1],[12896,12926,1],[43360,43388,1],[44032,55203,1],[55216,55238,1],[55243,55291,1],[65440,65470,1],[65474,65479,1],[65482,65487,1],[65490,65495,1],[65498,65500,1]]),g(d,"Hanifi_Rohingya",[[68864,68903,1],[68912,68921,1]]),g(d,"Hanunoo",[[5920,5940,1]]),g(d,"Hatran",[[67808,67826,1],[67828,67829,1],[67835,67839,1]]),g(d,"Hebrew",[[1425,1479,1],[1488,1514,1],[1519,1524,1],[64285,64310,1],[64312,64316,1],[64318,64320,2],[64321,64323,2],[64324,64326,2],[64327,64335,1]]),g(d,"Hiragana",[[12353,12438,1],[12445,12447,1],[110593,110879,1],[110898,110928,30],[110929,110930,1],[127488,127488,1]]),g(d,"Imperial_Aramaic",[[67648,67669,1],[67671,67679,1]]),g(d,"Inherited",[[768,879,1],[1157,1158,1],[1611,1621,1],[1648,2385,737],[2386,2388,1],[6832,6862,1],[7376,7378,1],[7380,7392,1],[7394,7400,1],[7405,7412,7],[7416,7417,1],[7616,7679,1],[8204,8205,1],[8400,8432,1],[12330,12333,1],[12441,12442,1],[65024,65039,1],[65056,65069,1],[66045,66272,227],[70459,118528,48069],[118529,118573,1],[118576,118598,1],[119143,119145,1],[119163,119170,1],[119173,119179,1],[119210,119213,1],[917760,917999,1]]),g(d,"foldInherited",[[921,953,32],[8126,8126,1]]),g(d,"Inscriptional_Pahlavi",[[68448,68466,1],[68472,68479,1]]),g(d,"Inscriptional_Parthian",[[68416,68437,1],[68440,68447,1]]),g(d,"Javanese",[[43392,43469,1],[43472,43481,1],[43486,43487,1]]),g(d,"Kaithi",[[69760,69826,1],[69837,69837,1]]),g(d,"Kannada",[[3200,3212,1],[3214,3216,1],[3218,3240,1],[3242,3251,1],[3253,3257,1],[3260,3268,1],[3270,3272,1],[3274,3277,1],[3285,3286,1],[3293,3294,1],[3296,3299,1],[3302,3311,1],[3313,3315,1]]),g(d,"Katakana",[[12449,12538,1],[12541,12543,1],[12784,12799,1],[13008,13054,1],[13056,13143,1],[65382,65391,1],[65393,65437,1],[110576,110579,1],[110581,110587,1],[110589,110590,1],[110592,110880,288],[110881,110882,1],[110933,110948,15],[110949,110951,1]]),g(d,"Kawi",[[73472,73488,1],[73490,73530,1],[73534,73561,1]]),g(d,"Kayah_Li",[[43264,43309,1],[43311,43311,1]]),g(d,"Kharoshthi",[[68096,68099,1],[68101,68102,1],[68108,68115,1],[68117,68119,1],[68121,68149,1],[68152,68154,1],[68159,68168,1],[68176,68184,1]]),g(d,"Khitan_Small_Script",[[94180,101120,6940],[101121,101589,1]]),g(d,"Khmer",[[6016,6109,1],[6112,6121,1],[6128,6137,1],[6624,6655,1]]),g(d,"Khojki",[[70144,70161,1],[70163,70209,1]]),g(d,"Khudawadi",[[70320,70378,1],[70384,70393,1]]),g(d,"Lao",[[3713,3714,1],[3716,3718,2],[3719,3722,1],[3724,3747,1],[3749,3751,2],[3752,3773,1],[3776,3780,1],[3782,3784,2],[3785,3790,1],[3792,3801,1],[3804,3807,1]]),g(d,"Latin",[[65,90,1],[97,122,1],[170,186,16],[192,214,1],[216,246,1],[248,696,1],[736,740,1],[7424,7461,1],[7468,7516,1],[7522,7525,1],[7531,7543,1],[7545,7614,1],[7680,7935,1],[8305,8319,14],[8336,8348,1],[8490,8491,1],[8498,8526,28],[8544,8584,1],[11360,11391,1],[42786,42887,1],[42891,42954,1],[42960,42961,1],[42963,42965,2],[42966,42969,1],[42994,43007,1],[43824,43866,1],[43868,43876,1],[43878,43881,1],[64256,64262,1],[65313,65338,1],[65345,65370,1],[67456,67461,1],[67463,67504,1],[67506,67514,1],[122624,122654,1],[122661,122666,1]]),g(d,"Lepcha",[[7168,7223,1],[7227,7241,1],[7245,7247,1]]),g(d,"Limbu",[[6400,6430,1],[6432,6443,1],[6448,6459,1],[6464,6468,4],[6469,6479,1]]),g(d,"Linear_A",[[67072,67382,1],[67392,67413,1],[67424,67431,1]]),g(d,"Linear_B",[[65536,65547,1],[65549,65574,1],[65576,65594,1],[65596,65597,1],[65599,65613,1],[65616,65629,1],[65664,65786,1]]),g(d,"Lisu",[[42192,42239,1],[73648,73648,1]]),g(d,"Lycian",[[66176,66204,1]]),g(d,"Lydian",[[67872,67897,1],[67903,67903,1]]),g(d,"Mahajani",[[69968,70006,1]]),g(d,"Makasar",[[73440,73464,1]]),g(d,"Malayalam",[[3328,3340,1],[3342,3344,1],[3346,3396,1],[3398,3400,1],[3402,3407,1],[3412,3427,1],[3430,3455,1]]),g(d,"Mandaic",[[2112,2139,1],[2142,2142,1]]),g(d,"Manichaean",[[68288,68326,1],[68331,68342,1]]),g(d,"Marchen",[[72816,72847,1],[72850,72871,1],[72873,72886,1]]),g(d,"Masaram_Gondi",[[72960,72966,1],[72968,72969,1],[72971,73014,1],[73018,73020,2],[73021,73023,2],[73024,73031,1],[73040,73049,1]]),g(d,"Medefaidrin",[[93760,93850,1]]),g(d,"Meetei_Mayek",[[43744,43766,1],[43968,44013,1],[44016,44025,1]]),g(d,"Mende_Kikakui",[[124928,125124,1],[125127,125142,1]]),g(d,"Meroitic_Cursive",[[68e3,68023,1],[68028,68047,1],[68050,68095,1]]),g(d,"Meroitic_Hieroglyphs",[[67968,67999,1]]),g(d,"Miao",[[93952,94026,1],[94031,94087,1],[94095,94111,1]]),g(d,"Modi",[[71168,71236,1],[71248,71257,1]]),g(d,"Mongolian",[[6144,6145,1],[6148,6150,2],[6151,6169,1],[6176,6264,1],[6272,6314,1],[71264,71276,1]]),g(d,"Mro",[[92736,92766,1],[92768,92777,1],[92782,92783,1]]),g(d,"Multani",[[70272,70278,1],[70280,70282,2],[70283,70285,1],[70287,70301,1],[70303,70313,1]]),g(d,"Myanmar",[[4096,4255,1],[43488,43518,1],[43616,43647,1]]),g(d,"Nabataean",[[67712,67742,1],[67751,67759,1]]),g(d,"Nag_Mundari",[[124112,124153,1]]),g(d,"Nandinagari",[[72096,72103,1],[72106,72151,1],[72154,72164,1]]),g(d,"New_Tai_Lue",[[6528,6571,1],[6576,6601,1],[6608,6618,1],[6622,6623,1]]),g(d,"Newa",[[70656,70747,1],[70749,70753,1]]),g(d,"Nko",[[1984,2042,1],[2045,2047,1]]),g(d,"Nushu",[[94177,110960,16783],[110961,111355,1]]),g(d,"Nyiakeng_Puachue_Hmong",[[123136,123180,1],[123184,123197,1],[123200,123209,1],[123214,123215,1]]),g(d,"Ogham",[[5760,5788,1]]),g(d,"Ol_Chiki",[[7248,7295,1]]),g(d,"Old_Hungarian",[[68736,68786,1],[68800,68850,1],[68858,68863,1]]),g(d,"Old_Italic",[[66304,66339,1],[66349,66351,1]]),g(d,"Old_North_Arabian",[[68224,68255,1]]),g(d,"Old_Permic",[[66384,66426,1]]),g(d,"Old_Persian",[[66464,66499,1],[66504,66517,1]]),g(d,"Old_Sogdian",[[69376,69415,1]]),g(d,"Old_South_Arabian",[[68192,68223,1]]),g(d,"Old_Turkic",[[68608,68680,1]]),g(d,"Old_Uyghur",[[69488,69513,1]]),g(d,"Oriya",[[2817,2819,1],[2821,2828,1],[2831,2832,1],[2835,2856,1],[2858,2864,1],[2866,2867,1],[2869,2873,1],[2876,2884,1],[2887,2888,1],[2891,2893,1],[2901,2903,1],[2908,2909,1],[2911,2915,1],[2918,2935,1]]),g(d,"Osage",[[66736,66771,1],[66776,66811,1]]),g(d,"Osmanya",[[66688,66717,1],[66720,66729,1]]),g(d,"Pahawh_Hmong",[[92928,92997,1],[93008,93017,1],[93019,93025,1],[93027,93047,1],[93053,93071,1]]),g(d,"Palmyrene",[[67680,67711,1]]),g(d,"Pau_Cin_Hau",[[72384,72440,1]]),g(d,"Phags_Pa",[[43072,43127,1]]),g(d,"Phoenician",[[67840,67867,1],[67871,67871,1]]),g(d,"Psalter_Pahlavi",[[68480,68497,1],[68505,68508,1],[68521,68527,1]]),g(d,"Rejang",[[43312,43347,1],[43359,43359,1]]),g(d,"Runic",[[5792,5866,1],[5870,5880,1]]),g(d,"Samaritan",[[2048,2093,1],[2096,2110,1]]),g(d,"Saurashtra",[[43136,43205,1],[43214,43225,1]]),g(d,"Sharada",[[70016,70111,1]]),g(d,"Shavian",[[66640,66687,1]]),g(d,"Siddham",[[71040,71093,1],[71096,71133,1]]),g(d,"SignWriting",[[120832,121483,1],[121499,121503,1],[121505,121519,1]]),g(d,"Sinhala",[[3457,3459,1],[3461,3478,1],[3482,3505,1],[3507,3515,1],[3517,3520,3],[3521,3526,1],[3530,3535,5],[3536,3540,1],[3542,3544,2],[3545,3551,1],[3558,3567,1],[3570,3572,1],[70113,70132,1]]),g(d,"Sogdian",[[69424,69465,1]]),g(d,"Sora_Sompeng",[[69840,69864,1],[69872,69881,1]]),g(d,"Soyombo",[[72272,72354,1]]),g(d,"Sundanese",[[7040,7103,1],[7360,7367,1]]),g(d,"Syloti_Nagri",[[43008,43052,1]]),g(d,"Syriac",[[1792,1805,1],[1807,1866,1],[1869,1871,1],[2144,2154,1]]),g(d,"Tagalog",[[5888,5909,1],[5919,5919,1]]),g(d,"Tagbanwa",[[5984,5996,1],[5998,6e3,1],[6002,6003,1]]),g(d,"Tai_Le",[[6480,6509,1],[6512,6516,1]]),g(d,"Tai_Tham",[[6688,6750,1],[6752,6780,1],[6783,6793,1],[6800,6809,1],[6816,6829,1]]),g(d,"Tai_Viet",[[43648,43714,1],[43739,43743,1]]),g(d,"Takri",[[71296,71353,1],[71360,71369,1]]),g(d,"Tamil",[[2946,2947,1],[2949,2954,1],[2958,2960,1],[2962,2965,1],[2969,2970,1],[2972,2974,2],[2975,2979,4],[2980,2984,4],[2985,2986,1],[2990,3001,1],[3006,3010,1],[3014,3016,1],[3018,3021,1],[3024,3031,7],[3046,3066,1],[73664,73713,1],[73727,73727,1]]),g(d,"Tangsa",[[92784,92862,1],[92864,92873,1]]),g(d,"Tangut",[[94176,94208,32],[94209,100343,1],[100352,101119,1],[101632,101640,1]]),g(d,"Telugu",[[3072,3084,1],[3086,3088,1],[3090,3112,1],[3114,3129,1],[3132,3140,1],[3142,3144,1],[3146,3149,1],[3157,3158,1],[3160,3162,1],[3165,3168,3],[3169,3171,1],[3174,3183,1],[3191,3199,1]]),g(d,"Thaana",[[1920,1969,1]]),g(d,"Thai",[[3585,3642,1],[3648,3675,1]]),g(d,"Tibetan",[[3840,3911,1],[3913,3948,1],[3953,3991,1],[3993,4028,1],[4030,4044,1],[4046,4052,1],[4057,4058,1]]),g(d,"Tifinagh",[[11568,11623,1],[11631,11632,1],[11647,11647,1]]),g(d,"Tirhuta",[[70784,70855,1],[70864,70873,1]]),g(d,"Toto",[[123536,123566,1]]),g(d,"Ugaritic",[[66432,66461,1],[66463,66463,1]]),g(d,"Vai",[[42240,42539,1]]),g(d,"Vithkuqi",[[66928,66938,1],[66940,66954,1],[66956,66962,1],[66964,66965,1],[66967,66977,1],[66979,66993,1],[66995,67001,1],[67003,67004,1]]),g(d,"Wancho",[[123584,123641,1],[123647,123647,1]]),g(d,"Warang_Citi",[[71840,71922,1],[71935,71935,1]]),g(d,"Yezidi",[[69248,69289,1],[69291,69293,1],[69296,69297,1]]),g(d,"Yi",[[40960,42124,1],[42128,42182,1]]),g(d,"Zanabazar_Square",[[72192,72263,1]]),g(d,"CATEGORIES",new Map([["C",d.C],["Cc",d.Cc],["Cf",d.Cf],["Co",d.Co],["Cs",d.Cs],["L",d.L],["Ll",d.Ll],["Lm",d.Lm],["Lo",d.Lo],["Lt",d.Lt],["Lu",d.Lu],["M",d.M],["Mc",d.Mc],["Me",d.Me],["Mn",d.Mn],["N",d.N],["Nd",d.Nd],["Nl",d.Nl],["No",d.No],["P",d.P],["Pc",d.Pc],["Pd",d.Pd],["Pe",d.Pe],["Pf",d.Pf],["Pi",d.Pi],["Po",d.Po],["Ps",d.Ps],["S",d.S],["Sc",d.Sc],["Sk",d.Sk],["Sm",d.Sm],["So",d.So],["Z",d.Z],["Zl",d.Zl],["Zp",d.Zp],["Zs",d.Zs]])),g(d,"SCRIPTS",new Map([["Adlam",d.Adlam],["Ahom",d.Ahom],["Anatolian_Hieroglyphs",d.Anatolian_Hieroglyphs],["Arabic",d.Arabic],["Armenian",d.Armenian],["Avestan",d.Avestan],["Balinese",d.Balinese],["Bamum",d.Bamum],["Bassa_Vah",d.Bassa_Vah],["Batak",d.Batak],["Bengali",d.Bengali],["Bhaiksuki",d.Bhaiksuki],["Bopomofo",d.Bopomofo],["Brahmi",d.Brahmi],["Braille",d.Braille],["Buginese",d.Buginese],["Buhid",d.Buhid],["Canadian_Aboriginal",d.Canadian_Aboriginal],["Carian",d.Carian],["Caucasian_Albanian",d.Caucasian_Albanian],["Chakma",d.Chakma],["Cham",d.Cham],["Cherokee",d.Cherokee],["Chorasmian",d.Chorasmian],["Common",d.Common],["Coptic",d.Coptic],["Cuneiform",d.Cuneiform],["Cypriot",d.Cypriot],["Cypro_Minoan",d.Cypro_Minoan],["Cyrillic",d.Cyrillic],["Deseret",d.Deseret],["Devanagari",d.Devanagari],["Dives_Akuru",d.Dives_Akuru],["Dogra",d.Dogra],["Duployan",d.Duployan],["Egyptian_Hieroglyphs",d.Egyptian_Hieroglyphs],["Elbasan",d.Elbasan],["Elymaic",d.Elymaic],["Ethiopic",d.Ethiopic],["Georgian",d.Georgian],["Glagolitic",d.Glagolitic],["Gothic",d.Gothic],["Grantha",d.Grantha],["Greek",d.Greek],["Gujarati",d.Gujarati],["Gunjala_Gondi",d.Gunjala_Gondi],["Gurmukhi",d.Gurmukhi],["Han",d.Han],["Hangul",d.Hangul],["Hanifi_Rohingya",d.Hanifi_Rohingya],["Hanunoo",d.Hanunoo],["Hatran",d.Hatran],["Hebrew",d.Hebrew],["Hiragana",d.Hiragana],["Imperial_Aramaic",d.Imperial_Aramaic],["Inherited",d.Inherited],["Inscriptional_Pahlavi",d.Inscriptional_Pahlavi],["Inscriptional_Parthian",d.Inscriptional_Parthian],["Javanese",d.Javanese],["Kaithi",d.Kaithi],["Kannada",d.Kannada],["Katakana",d.Katakana],["Kawi",d.Kawi],["Kayah_Li",d.Kayah_Li],["Kharoshthi",d.Kharoshthi],["Khitan_Small_Script",d.Khitan_Small_Script],["Khmer",d.Khmer],["Khojki",d.Khojki],["Khudawadi",d.Khudawadi],["Lao",d.Lao],["Latin",d.Latin],["Lepcha",d.Lepcha],["Limbu",d.Limbu],["Linear_A",d.Linear_A],["Linear_B",d.Linear_B],["Lisu",d.Lisu],["Lycian",d.Lycian],["Lydian",d.Lydian],["Mahajani",d.Mahajani],["Makasar",d.Makasar],["Malayalam",d.Malayalam],["Mandaic",d.Mandaic],["Manichaean",d.Manichaean],["Marchen",d.Marchen],["Masaram_Gondi",d.Masaram_Gondi],["Medefaidrin",d.Medefaidrin],["Meetei_Mayek",d.Meetei_Mayek],["Mende_Kikakui",d.Mende_Kikakui],["Meroitic_Cursive",d.Meroitic_Cursive],["Meroitic_Hieroglyphs",d.Meroitic_Hieroglyphs],["Miao",d.Miao],["Modi",d.Modi],["Mongolian",d.Mongolian],["Mro",d.Mro],["Multani",d.Multani],["Myanmar",d.Myanmar],["Nabataean",d.Nabataean],["Nag_Mundari",d.Nag_Mundari],["Nandinagari",d.Nandinagari],["New_Tai_Lue",d.New_Tai_Lue],["Newa",d.Newa],["Nko",d.Nko],["Nushu",d.Nushu],["Nyiakeng_Puachue_Hmong",d.Nyiakeng_Puachue_Hmong],["Ogham",d.Ogham],["Ol_Chiki",d.Ol_Chiki],["Old_Hungarian",d.Old_Hungarian],["Old_Italic",d.Old_Italic],["Old_North_Arabian",d.Old_North_Arabian],["Old_Permic",d.Old_Permic],["Old_Persian",d.Old_Persian],["Old_Sogdian",d.Old_Sogdian],["Old_South_Arabian",d.Old_South_Arabian],["Old_Turkic",d.Old_Turkic],["Old_Uyghur",d.Old_Uyghur],["Oriya",d.Oriya],["Osage",d.Osage],["Osmanya",d.Osmanya],["Pahawh_Hmong",d.Pahawh_Hmong],["Palmyrene",d.Palmyrene],["Pau_Cin_Hau",d.Pau_Cin_Hau],["Phags_Pa",d.Phags_Pa],["Phoenician",d.Phoenician],["Psalter_Pahlavi",d.Psalter_Pahlavi],["Rejang",d.Rejang],["Runic",d.Runic],["Samaritan",d.Samaritan],["Saurashtra",d.Saurashtra],["Sharada",d.Sharada],["Shavian",d.Shavian],["Siddham",d.Siddham],["SignWriting",d.SignWriting],["Sinhala",d.Sinhala],["Sogdian",d.Sogdian],["Sora_Sompeng",d.Sora_Sompeng],["Soyombo",d.Soyombo],["Sundanese",d.Sundanese],["Syloti_Nagri",d.Syloti_Nagri],["Syriac",d.Syriac],["Tagalog",d.Tagalog],["Tagbanwa",d.Tagbanwa],["Tai_Le",d.Tai_Le],["Tai_Tham",d.Tai_Tham],["Tai_Viet",d.Tai_Viet],["Takri",d.Takri],["Tamil",d.Tamil],["Tangsa",d.Tangsa],["Tangut",d.Tangut],["Telugu",d.Telugu],["Thaana",d.Thaana],["Thai",d.Thai],["Tibetan",d.Tibetan],["Tifinagh",d.Tifinagh],["Tirhuta",d.Tirhuta],["Toto",d.Toto],["Ugaritic",d.Ugaritic],["Vai",d.Vai],["Vithkuqi",d.Vithkuqi],["Wancho",d.Wancho],["Warang_Citi",d.Warang_Citi],["Yezidi",d.Yezidi],["Yi",d.Yi],["Zanabazar_Square",d.Zanabazar_Square]])),g(d,"FOLD_CATEGORIES",new Map([["L",d.foldL],["Ll",d.foldLl],["Lt",d.foldLt],["Lu",d.foldLu],["M",d.foldM],["Mn",d.foldMn]])),g(d,"FOLD_SCRIPT",new Map([["Common",d.foldCommon],["Greek",d.foldGreek],["Inherited",d.foldInherited]]));let Bt=d;class Q{static is32(t,e){let n=0,s=t.length;for(;n<s;){let i=n+Math.floor((s-n)/2),o=t[i];if(o[0]<=e&&e<=o[1])return(e-o[0])%o[2]===0;e<o[0]?s=i:n=i+1}return!1}static is(t,e){if(e<=this.MAX_LATIN1){for(let n of t)if(!(e>n[1]))return e<n[0]?!1:(e-n[0])%n[2]===0;return!1}return t.length>0&&e>=t[0][0]&&this.is32(t,e)}static isUpper(t){if(t<=this.MAX_LATIN1){const e=String.fromCodePoint(t);return e.toUpperCase()===e&&e.toLowerCase()!==e}return this.is(Bt.Upper,t)}static isPrint(t){return t<=this.MAX_LATIN1?t>=32&&t<127||t>=161&&t!==173:this.is(Bt.L,t)||this.is(Bt.M,t)||this.is(Bt.N,t)||this.is(Bt.P,t)||this.is(Bt.S,t)}static simpleFold(t){if(Bt.CASE_ORBIT.has(t))return Bt.CASE_ORBIT.get(t);const e=P.toLowerCase(t);return e!==t?e:P.toUpperCase(t)}static equalsIgnoreCase(t,e){if(t<0||e<0||t===e)return!0;if(t<=this.MAX_ASCII&&e<=this.MAX_ASCII)return P.CODES.get("A")<=t&&t<=P.CODES.get("Z")&&(t|=32),P.CODES.get("A")<=e&&e<=P.CODES.get("Z")&&(e|=32),t===e;for(let n=this.simpleFold(t);n!==t;n=this.simpleFold(n))if(n===e)return!0;return!1}}g(Q,"MAX_RUNE",1114111),g(Q,"MAX_ASCII",127),g(Q,"MAX_LATIN1",255),g(Q,"MAX_BMP",65535),g(Q,"MIN_FOLD",65),g(Q,"MAX_FOLD",125251);class tt{static emptyInts(){return[]}static isalnum(t){return P.CODES.get("0")<=t&&t<=P.CODES.get("9")||P.CODES.get("a")<=t&&t<=P.CODES.get("z")||P.CODES.get("A")<=t&&t<=P.CODES.get("Z")}static unhex(t){return P.CODES.get("0")<=t&&t<=P.CODES.get("9")?t-P.CODES.get("0"):P.CODES.get("a")<=t&&t<=P.CODES.get("f")?t-P.CODES.get("a")+10:P.CODES.get("A")<=t&&t<=P.CODES.get("F")?t-P.CODES.get("A")+10:-1}static escapeRune(t){let e="";if(Q.isPrint(t))this.METACHARACTERS.indexOf(String.fromCodePoint(t))>=0&&(e+="\\"),e+=String.fromCodePoint(t);else switch(t){case P.CODES.get('"'):e+='\\"';break;case P.CODES.get("\\"):e+="\\\\";break;case P.CODES.get("	"):e+="\\t";break;case P.CODES.get(`
`):e+="\\n";break;case P.CODES.get("\r"):e+="\\r";break;case P.CODES.get("\b"):e+="\\b";break;case P.CODES.get("\f"):e+="\\f";break;default:{let n=t.toString(16);t<256?(e+="\\x",n.length===1&&(e+="0"),e+=n):e+=`\\x{${n}}`;break}}return e}static stringToRunes(t){return String(t).split("").map(e=>e.codePointAt(0))}static runeToString(t){return String.fromCodePoint(t)}static isWordRune(t){return P.CODES.get("a")<=t&&t<=P.CODES.get("z")||P.CODES.get("A")<=t&&t<=P.CODES.get("Z")||P.CODES.get("0")<=t&&t<=P.CODES.get("9")||t===P.CODES.get("_")}static emptyOpContext(t,e){let n=0;return t<0&&(n|=this.EMPTY_BEGIN_TEXT|this.EMPTY_BEGIN_LINE),t===P.CODES.get(`
`)&&(n|=this.EMPTY_BEGIN_LINE),e<0&&(n|=this.EMPTY_END_TEXT|this.EMPTY_END_LINE),e===P.CODES.get(`
`)&&(n|=this.EMPTY_END_LINE),this.isWordRune(t)!==this.isWordRune(e)?n|=this.EMPTY_WORD_BOUNDARY:n|=this.EMPTY_NO_WORD_BOUNDARY,n}static quoteMeta(t){return t.split("").map(e=>this.METACHARACTERS.indexOf(e)>=0?`\\${e}`:e).join("")}static charCount(t){return t>Q.MAX_BMP?2:1}static stringToUtf8ByteArray(t){if(globalThis.TextEncoder)return Array.from(new TextEncoder().encode(t));{let e=[],n=0;for(let s=0;s<t.length;s++){let i=t.charCodeAt(s);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e}}static utf8ByteArrayToString(t){if(globalThis.TextDecoder)return new TextDecoder("utf-8").decode(new Uint8Array(t));{let e=[],n=0,s=0;for(;n<t.length;){let i=t[n++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){let o=t[n++];e[s++]=String.fromCharCode((i&31)<<6|o&63)}else if(i>239&&i<365){let o=t[n++],u=t[n++],c=t[n++],h=((i&7)<<18|(o&63)<<12|(u&63)<<6|c&63)-65536;e[s++]=String.fromCharCode(55296+(h>>10)),e[s++]=String.fromCharCode(56320+(h&1023))}else{let o=t[n++],u=t[n++];e[s++]=String.fromCharCode((i&15)<<12|(o&63)<<6|u&63)}}return e.join("")}}}g(tt,"METACHARACTERS","\\.+*?()|[]{}^$"),g(tt,"EMPTY_BEGIN_LINE",1),g(tt,"EMPTY_END_LINE",2),g(tt,"EMPTY_BEGIN_TEXT",4),g(tt,"EMPTY_END_TEXT",8),g(tt,"EMPTY_WORD_BOUNDARY",16),g(tt,"EMPTY_NO_WORD_BOUNDARY",32),g(tt,"EMPTY_ALL",-1);const R2=(r=[],t=0)=>{const e={};for(let n=0;n<r.length;n++){const s=r[n],i=t+n;e[s]=i,e[i]=s}return Object.freeze(e)},fs=class fs{getEncoding(){throw Error("not implemented")}isUTF8Encoding(){return this.getEncoding()===fs.Encoding.UTF_8}isUTF16Encoding(){return this.getEncoding()===fs.Encoding.UTF_16}};g(fs,"Encoding",R2(["UTF_16","UTF_8"]));let En=fs;class $c extends En{constructor(t=null){super(),this.bytes=t}getEncoding(){return En.Encoding.UTF_8}asCharSequence(){return tt.utf8ByteArrayToString(this.bytes)}asBytes(){return this.bytes}length(){return this.bytes.length}}class r3 extends En{constructor(t=null){super(),this.charSequence=t}getEncoding(){return En.Encoding.UTF_16}asCharSequence(){return this.charSequence}asBytes(){return this.charSequence.toString().split("").map(t=>t.codePointAt(0))}length(){return this.charSequence.length}}class Ui{static utf16(t){return new r3(t)}static utf8(t){return Array.isArray(t)?new $c(t):new $c(tt.stringToUtf8ByteArray(t))}}class co extends Error{constructor(t){super(t),this.name="RE2JSException"}}class yt extends co{constructor(t,e=null){let n=`error parsing regexp: ${t}`;e&&(n+=`: \`${e}\``),super(n),this.name="RE2JSSyntaxException",this.message=n,this.error=t,this.input=e}getDescription(){return this.error}getPattern(){return this.input}}class s3 extends co{constructor(t){super(t),this.name="RE2JSCompileException"}}class Fe extends co{constructor(t){super(t),this.name="RE2JSGroupException"}}class i3 extends co{constructor(t){super(t),this.name="RE2JSFlagsException"}}class o3{static quoteReplacement(t){return t.indexOf("\\")<0&&t.indexOf("$")<0?t:t.split("").map(e=>{const n=e.codePointAt(0);return n===P.CODES["\\"]||n===P.CODES.$?`\\${e}`:e}).join("")}constructor(t,e){if(t===null)throw new Error("pattern is null");this.patternInput=t;const n=this.patternInput.re2();this.patternGroupCount=n.numberOfCapturingGroups(),this.groups=[],this.namedGroups=n.namedGroups,e instanceof En?this.resetMatcherInput(e):Array.isArray(e)?this.resetMatcherInput(Ui.utf8(e)):this.resetMatcherInput(Ui.utf16(e))}pattern(){return this.patternInput}reset(){return this.matcherInputLength=this.matcherInput.length(),this.appendPos=0,this.hasMatch=!1,this.hasGroups=!1,this.anchorFlag=0,this}resetMatcherInput(t){if(t===null)throw new Error("input is null");return this.matcherInput=t,this.reset(),this}start(t=0){if(typeof t=="string"){const e=this.namedGroups[t];if(!Number.isFinite(e))throw new Fe(`group '${t}' not found`);t=e}return this.loadGroup(t),this.groups[2*t]}end(t=0){if(typeof t=="string"){const e=this.namedGroups[t];if(!Number.isFinite(e))throw new Fe(`group '${t}' not found`);t=e}return this.loadGroup(t),this.groups[2*t+1]}group(t=0){if(typeof t=="string"){const s=this.namedGroups[t];if(!Number.isFinite(s))throw new Fe(`group '${t}' not found`);t=s}const e=this.start(t),n=this.end(t);return e<0&&n<0?null:this.substring(e,n)}groupCount(){return this.patternGroupCount}loadGroup(t){if(t<0||t>this.patternGroupCount)throw new Fe(`Group index out of bounds: ${t}`);if(!this.hasMatch)throw new Fe("perhaps no match attempted");if(t===0||this.hasGroups)return;let e=this.groups[1]+1;e>this.matcherInputLength&&(e=this.matcherInputLength);const n=this.patternInput.re2().matchMachineInput(this.matcherInput,this.groups[0],e,this.anchorFlag,1+this.patternGroupCount);if(!n[0])throw new Fe("inconsistency in matching group data");this.groups=n[1],this.hasGroups=!0}matches(){return this.genMatch(0,B.ANCHOR_BOTH)}lookingAt(){return this.genMatch(0,B.ANCHOR_START)}find(t=null){if(t!==null){if(t<0||t>this.matcherInputLength)throw new Fe(`start index out of bounds: ${t}`);return this.reset(),this.genMatch(t,0)}return t=0,this.hasMatch&&(t=this.groups[1],this.groups[0]===this.groups[1]&&t++),this.genMatch(t,B.UNANCHORED)}genMatch(t,e){const n=this.patternInput.re2().matchMachineInput(this.matcherInput,t,this.matcherInputLength,e,1);return n[0]?(this.groups=n[1],this.hasMatch=!0,this.hasGroups=!1,this.anchorFlag=e,!0):!1}substring(t,e){return this.matcherInput.isUTF8Encoding()?tt.utf8ByteArrayToString(this.matcherInput.asBytes().slice(t,e)):this.matcherInput.asCharSequence().substring(t,e).toString()}inputLength(){return this.matcherInputLength}appendReplacement(t,e=!1){let n="";const s=this.start(),i=this.end();return this.appendPos<s&&(n+=this.substring(this.appendPos,s)),this.appendPos=i,n+=e?this.appendReplacementInternalPerl(t):this.appendReplacementInternal(t),n}appendReplacementInternal(t){let e="",n=0;const s=t.length;for(let i=0;i<s-1;i++){if(t.codePointAt(i)===P.CODES.get("\\")){n<i&&(e+=t.substring(n,i)),i++,n=i;continue}if(t.codePointAt(i)===P.CODES.get("$")){let o=t.codePointAt(i+1);if(P.CODES.get("0")<=o&&o<=P.CODES.get("9")){let u=o-P.CODES.get("0");for(n<i&&(e+=t.substring(n,i)),i+=2;i<s&&(o=t.codePointAt(i),!(o<P.CODES.get("0")||o>P.CODES.get("9")||u*10+o-P.CODES.get("0")>this.patternGroupCount));i++)u=u*10+o-P.CODES.get("0");if(u>this.patternGroupCount)throw new Fe(`n > number of groups: ${u}`);const c=this.group(u);c!==null&&(e+=c),n=i,i--;continue}else if(o===P.CODES.get("{")){n<i&&(e+=t.substring(n,i)),i++;let u=i+1;for(;u<t.length&&t.codePointAt(u)!==P.CODES.get("}")&&t.codePointAt(u)!==P.CODES.get(" ");)u++;if(u===t.length||t.codePointAt(u)!==P.CODES.get("}"))throw new Fe("named capture group is missing trailing '}'");const c=t.substring(i+1,u);e+=this.group(c),n=u+1}}}return n<s&&(e+=t.substring(n,s)),e}appendReplacementInternalPerl(t){let e="",n=0;const s=t.length;for(let i=0;i<s-1;i++)if(t.codePointAt(i)===P.CODES.get("$")){let o=t.codePointAt(i+1);if(P.CODES.get("$")===o){n<i&&(e+=t.substring(n,i)),e+="$",i++,n=i+1;continue}else if(P.CODES.get("&")===o){n<i&&(e+=t.substring(n,i));const u=this.group(0);u!==null?e+=u:e+="$&",i++,n=i+1;continue}else if(P.CODES.get("1")<=o&&o<=P.CODES.get("9")){let u=o-P.CODES.get("0");for(n<i&&(e+=t.substring(n,i)),i+=2;i<s&&(o=t.codePointAt(i),!(o<P.CODES.get("0")||o>P.CODES.get("9")||u*10+o-P.CODES.get("0")>this.patternGroupCount));i++)u=u*10+o-P.CODES.get("0");if(u>this.patternGroupCount){e+=`$${u}`,n=i,i--;continue}const c=this.group(u);c!==null&&(e+=c),n=i,i--;continue}else if(o===P.CODES.get("<")){n<i&&(e+=t.substring(n,i)),i++;let u=i+1;for(;u<t.length&&t.codePointAt(u)!==P.CODES.get(">")&&t.codePointAt(u)!==P.CODES.get(" ");)u++;if(u===t.length||t.codePointAt(u)!==P.CODES.get(">")){e+=t.substring(i-1,u+1),n=u+1;continue}const c=t.substring(i+1,u);Object.prototype.hasOwnProperty.call(this.namedGroups,c)?e+=this.group(c):e+=`$<${c}>`,n=u+1}}return n<s&&(e+=t.substring(n,s)),e}appendTail(){return this.substring(this.appendPos,this.matcherInputLength)}replaceAll(t,e=!1){return this.replace(t,!0,e)}replaceFirst(t,e=!1){return this.replace(t,!1,e)}replace(t,e=!0,n=!1){let s="";for(this.reset();this.find()&&(s+=this.appendReplacement(t,n),!!e););return s+=this.appendTail(),s}}class cn{static EOF(){return-8}canCheckPrefix(){return!0}endPos(){return this.end}}class a3 extends cn{constructor(t,e=0,n=t.length){super(),this.bytes=t,this.start=e,this.end=n}step(t){if(t+=this.start,t>=this.end)return cn.EOF();let e=this.bytes[t++]&255;return(e&128)===0?e<<3|1:(e&224)===192?(e=e&31,t>=this.end?cn.EOF():(e=e<<6|this.bytes[t++]&63,e<<3|2)):(e&240)===224?(e=e&15,t+1>=this.end?cn.EOF():(e=e<<6|this.bytes[t++]&63,e=e<<6|this.bytes[t++]&63,e<<3|3)):(e=e&7,t+2>=this.end?cn.EOF():(e=e<<6|this.bytes[t++]&63,e=e<<6|this.bytes[t++]&63,e=e<<6|this.bytes[t++]&63,e<<3|4))}index(t,e){e+=this.start;const n=this.indexOf(this.bytes,t.prefixUTF8,e);return n<0?n:n-e}context(t){t+=this.start;let e=-1;if(t>this.start&&t<=this.end){let s=t-1;if(e=this.bytes[s--],e>=128){let i=t-4;for(i<this.start&&(i=this.start);s>=i&&(this.bytes[s]&192)===128;)s--;s<this.start&&(s=this.start),e=this.step(s)>>3}}const n=t<this.end?this.step(t)>>3:-1;return tt.emptyOpContext(e,n)}indexOf(t,e,n=0){let s=e.length;if(s===0)return-1;let i=t.length;for(let o=n;o<=i-s;o++)for(let u=0;u<s&&t[o+u]===e[u];u++)if(u===s-1)return o;return-1}}class u3 extends cn{constructor(t,e=0,n=t.length){super(),this.charSequence=t,this.start=e,this.end=n}step(t){if(t+=this.start,t<this.end){const e=this.charSequence.codePointAt(t);return e<<3|tt.charCount(e)}else return cn.EOF()}index(t,e){e+=this.start;const n=this.charSequence.indexOf(t.prefix,e);return n<0?n:n-e}context(t){t+=this.start;const e=t>0&&t<=this.charSequence.length?this.charSequence.codePointAt(t-1):-1,n=t<this.charSequence.length?this.charSequence.codePointAt(t):-1;return tt.emptyOpContext(e,n)}}class Tt{static fromUTF8(t,e=0,n=t.length){return new a3(t,e,n)}static fromUTF16(t,e=0,n=t.length){return new u3(t,e,n)}}const K=class K{static isPseudoOp(t){return t>=K.Op.LEFT_PAREN}static emptySubs(){return[]}static quoteIfHyphen(t){return t===P.CODES.get("-")?"\\":""}static fromRegexp(t){const e=new K(t.op);return e.flags=t.flags,e.subs=t.subs,e.runes=t.runes,e.cap=t.cap,e.min=t.min,e.max=t.max,e.name=t.name,e.namedGroups=t.namedGroups,e}constructor(t){this.op=t,this.flags=0,this.subs=K.emptySubs(),this.runes=null,this.min=0,this.max=0,this.cap=0,this.name=null,this.namedGroups={}}reinit(){this.flags=0,this.subs=K.emptySubs(),this.runes=null,this.cap=0,this.min=0,this.max=0,this.name=null,this.namedGroups={}}toString(){return this.appendTo()}appendTo(){let t="";switch(this.op){case K.Op.NO_MATCH:t+="[^\\x00-\\x{10FFFF}]";break;case K.Op.EMPTY_MATCH:t+="(?:)";break;case K.Op.STAR:case K.Op.PLUS:case K.Op.QUEST:case K.Op.REPEAT:{const e=this.subs[0];switch(e.op>K.Op.CAPTURE||e.op===K.Op.LITERAL&&e.runes.length>1?t+=`(?:${e.appendTo()})`:t+=e.appendTo(),this.op){case K.Op.STAR:t+="*";break;case K.Op.PLUS:t+="+";break;case K.Op.QUEST:t+="?";break;case K.Op.REPEAT:t+=`{${this.min}`,this.min!==this.max&&(t+=",",this.max>=0&&(t+=this.max)),t+="}";break}(this.flags&B.NON_GREEDY)!==0&&(t+="?");break}case K.Op.CONCAT:{for(let e of this.subs)e.op===K.Op.ALTERNATE?t+=`(?:${e.appendTo()})`:t+=e.appendTo();break}case K.Op.ALTERNATE:{let e="";for(let n of this.subs)t+=e,e="|",t+=n.appendTo();break}case K.Op.LITERAL:(this.flags&B.FOLD_CASE)!==0&&(t+="(?i:");for(let e of this.runes)t+=tt.escapeRune(e);(this.flags&B.FOLD_CASE)!==0&&(t+=")");break;case K.Op.ANY_CHAR_NOT_NL:t+="(?-s:.)";break;case K.Op.ANY_CHAR:t+="(?s:.)";break;case K.Op.CAPTURE:this.name===null||this.name.length===0?t+="(":t+=`(?P<${this.name}>`,this.subs[0].op!==K.Op.EMPTY_MATCH&&(t+=this.subs[0].appendTo()),t+=")";break;case K.Op.BEGIN_TEXT:t+="\\A";break;case K.Op.END_TEXT:(this.flags&B.WAS_DOLLAR)!==0?t+="(?-m:$)":t+="\\z";break;case K.Op.BEGIN_LINE:t+="^";break;case K.Op.END_LINE:t+="$";break;case K.Op.WORD_BOUNDARY:t+="\\b";break;case K.Op.NO_WORD_BOUNDARY:t+="\\B";break;case K.Op.CHAR_CLASS:if(this.runes.length%2!==0){t+="[invalid char class]";break}if(t+="[",this.runes.length===0)t+="^\\x00-\\x{10FFFF}";else if(this.runes[0]===0&&this.runes[this.runes.length-1]===Q.MAX_RUNE){t+="^";for(let e=1;e<this.runes.length-1;e+=2){const n=this.runes[e]+1,s=this.runes[e+1]-1;t+=K.quoteIfHyphen(n),t+=tt.escapeRune(n),n!==s&&(t+="-",t+=K.quoteIfHyphen(s),t+=tt.escapeRune(s))}}else for(let e=0;e<this.runes.length;e+=2){const n=this.runes[e],s=this.runes[e+1];t+=K.quoteIfHyphen(n),t+=tt.escapeRune(n),n!==s&&(t+="-",t+=K.quoteIfHyphen(s),t+=tt.escapeRune(s))}t+="]";break;default:t+=this.op;break}return t}maxCap(){let t=0;if(this.op===K.Op.CAPTURE&&(t=this.cap),this.subs!==null)for(let e of this.subs){const n=e.maxCap();t<n&&(t=n)}return t}equals(t){if(!(t!==null&&t instanceof K)||this.op!==t.op)return!1;switch(this.op){case K.Op.END_TEXT:{if((this.flags&B.WAS_DOLLAR)!==(t.flags&B.WAS_DOLLAR))return!1;break}case K.Op.LITERAL:case K.Op.CHAR_CLASS:{if(this.runes===null&&t.runes===null)break;if(this.runes===null||t.runes===null||this.runes.length!==t.runes.length)return!1;for(let e=0;e<this.runes.length;e++)if(this.runes[e]!==t.runes[e])return!1;break}case K.Op.ALTERNATE:case K.Op.CONCAT:{if(this.subs.length!==t.subs.length)return!1;for(let e=0;e<this.subs.length;++e)if(!this.subs[e].equals(t.subs[e]))return!1;break}case K.Op.STAR:case K.Op.PLUS:case K.Op.QUEST:{if((this.flags&B.NON_GREEDY)!==(t.flags&B.NON_GREEDY)||!this.subs[0].equals(t.subs[0]))return!1;break}case K.Op.REPEAT:{if((this.flags&B.NON_GREEDY)!==(t.flags&B.NON_GREEDY)||this.min!==t.min||this.max!==t.max||!this.subs[0].equals(t.subs[0]))return!1;break}case K.Op.CAPTURE:{if(this.cap!==t.cap||(this.name===null?t.name!==null:this.name!==t.name)||!this.subs[0].equals(t.subs[0]))return!1;break}}return!0}};g(K,"Op",R2(["NO_MATCH","EMPTY_MATCH","LITERAL","CHAR_CLASS","ANY_CHAR_NOT_NL","ANY_CHAR","BEGIN_LINE","END_LINE","BEGIN_TEXT","END_TEXT","WORD_BOUNDARY","NO_WORD_BOUNDARY","CAPTURE","STAR","PLUS","QUEST","REPEAT","CONCAT","ALTERNATE","LEFT_PAREN","VERTICAL_BAR"]));let k=K;const ct=class ct{static isRuneOp(t){return ct.RUNE<=t&&t<=ct.RUNE_ANY_NOT_NL}static escapeRunes(t){let e='"';for(let n of t)e+=tt.escapeRune(n);return e+='"',e}constructor(t){this.op=t,this.out=0,this.arg=0,this.runes=null}matchRune(t){if(this.runes.length===1){const s=this.runes[0];return(this.arg&B.FOLD_CASE)!==0?Q.equalsIgnoreCase(s,t):t===s}for(let s=0;s<this.runes.length&&s<=8;s+=2){if(t<this.runes[s])return!1;if(t<=this.runes[s+1])return!0}let e=0,n=this.runes.length/2|0;for(;e<n;){const s=e+((n-e)/2|0);if(this.runes[2*s]<=t){if(t<=this.runes[2*s+1])return!0;e=s+1}else n=s}return!1}toString(){switch(this.op){case ct.ALT:return`alt -> ${this.out}, ${this.arg}`;case ct.ALT_MATCH:return`altmatch -> ${this.out}, ${this.arg}`;case ct.CAPTURE:return`cap ${this.arg} -> ${this.out}`;case ct.EMPTY_WIDTH:return`empty ${this.arg} -> ${this.out}`;case ct.MATCH:return"match";case ct.FAIL:return"fail";case ct.NOP:return`nop -> ${this.out}`;case ct.RUNE:return this.runes===null?"rune <null>":["rune ",ct.escapeRunes(this.runes),(this.arg&B.FOLD_CASE)!==0?"/i":""," -> ",this.out].join("");case ct.RUNE1:return`rune1 ${ct.escapeRunes(this.runes)} -> ${this.out}`;case ct.RUNE_ANY:return`any -> ${this.out}`;case ct.RUNE_ANY_NOT_NL:return`anynotnl -> ${this.out}`;default:throw new Error("unhandled case in Inst.toString")}}};g(ct,"ALT",1),g(ct,"ALT_MATCH",2),g(ct,"CAPTURE",3),g(ct,"EMPTY_WIDTH",4),g(ct,"FAIL",5),g(ct,"MATCH",6),g(ct,"NOP",7),g(ct,"RUNE",8),g(ct,"RUNE1",9),g(ct,"RUNE_ANY",10),g(ct,"RUNE_ANY_NOT_NL",11);let et=ct;class c3{constructor(){this.inst=[],this.start=0,this.numCap=2}getInst(t){return this.inst[t]}numInst(){return this.inst.length}addInst(t){this.inst.push(new et(t))}skipNop(t){let e=this.inst[t];for(;e.op===et.NOP||e.op===et.CAPTURE;)e=this.inst[t],t=e.out;return e}prefix(){let t="",e=this.skipNop(this.start);if(!et.isRuneOp(e.op)||e.runes.length!==1)return[e.op===et.MATCH,t];for(;et.isRuneOp(e.op)&&e.runes.length===1&&(e.arg&B.FOLD_CASE)===0;)t+=String.fromCodePoint(e.runes[0]),e=this.skipNop(e.out);return[e.op===et.MATCH,t]}startCond(){let t=0,e=this.start;t:for(;;){const n=this.inst[e];switch(n.op){case et.EMPTY_WIDTH:t|=n.arg;break;case et.FAIL:return-1;case et.CAPTURE:case et.NOP:break;default:break t}e=n.out}return t}next(t){const e=this.inst[t>>1];return(t&1)===0?e.out:e.arg}patch(t,e){for(;t!==0;){const n=this.inst[t>>1];(t&1)===0?(t=n.out,n.out=e):(t=n.arg,n.arg=e)}}append(t,e){if(t===0)return e;if(e===0)return t;let n=t;for(;;){const i=this.next(n);if(i===0)break;n=i}const s=this.inst[n>>1];return(n&1)===0?s.out=e:s.arg=e,t}toString(){let t="";for(let e=0;e<this.inst.length;e++){const n=t.length;t+=e,e===this.start&&(t+="*"),t+="        ".substring(t.length-n),t+=this.inst[e],t+=`
`}return t}}class mi{constructor(t=0,e=0,n=!1){this.i=t,this.out=e,this.nullable=n}}class rs{static ANY_RUNE_NOT_NL(){return[0,P.CODES.get(`
`)-1,P.CODES.get(`
`)+1,Q.MAX_RUNE]}static ANY_RUNE(){return[0,Q.MAX_RUNE]}static compileRegexp(t){const e=new rs,n=e.compile(t);return e.prog.patch(n.out,e.newInst(et.MATCH).i),e.prog.start=n.i,e.prog}constructor(){this.prog=new c3,this.newInst(et.FAIL)}newInst(t){return this.prog.addInst(t),new mi(this.prog.numInst()-1,0,!0)}nop(){const t=this.newInst(et.NOP);return t.out=t.i<<1,t}fail(){return new mi}cap(t){const e=this.newInst(et.CAPTURE);return e.out=e.i<<1,this.prog.getInst(e.i).arg=t,this.prog.numCap<t+1&&(this.prog.numCap=t+1),e}cat(t,e){return t.i===0||e.i===0?this.fail():(this.prog.patch(t.out,e.i),new mi(t.i,e.out,t.nullable&&e.nullable))}alt(t,e){if(t.i===0)return e;if(e.i===0)return t;const n=this.newInst(et.ALT),s=this.prog.getInst(n.i);return s.out=t.i,s.arg=e.i,n.out=this.prog.append(t.out,e.out),n.nullable=t.nullable||e.nullable,n}loop(t,e){const n=this.newInst(et.ALT),s=this.prog.getInst(n.i);return e?(s.arg=t.i,n.out=n.i<<1):(s.out=t.i,n.out=n.i<<1|1),this.prog.patch(t.out,n.i),n}quest(t,e){const n=this.newInst(et.ALT),s=this.prog.getInst(n.i);return e?(s.arg=t.i,n.out=n.i<<1):(s.out=t.i,n.out=n.i<<1|1),n.out=this.prog.append(n.out,t.out),n}star(t,e){return t.nullable?this.quest(this.plus(t,e),e):this.loop(t,e)}plus(t,e){return new mi(t.i,this.loop(t,e).out,t.nullable)}empty(t){const e=this.newInst(et.EMPTY_WIDTH);return this.prog.getInst(e.i).arg=t,e.out=e.i<<1,e}rune(t,e){const n=this.newInst(et.RUNE);n.nullable=!1;const s=this.prog.getInst(n.i);return s.runes=t,e&=B.FOLD_CASE,(t.length!==1||Q.simpleFold(t[0])===t[0])&&(e&=-2),s.arg=e,n.out=n.i<<1,(e&B.FOLD_CASE)===0&&t.length===1||t.length===2&&t[0]===t[1]?s.op=et.RUNE1:t.length===2&&t[0]===0&&t[1]===Q.MAX_RUNE?s.op=et.RUNE_ANY:t.length===4&&t[0]===0&&t[1]===P.CODES.get(`
`)-1&&t[2]===P.CODES.get(`
`)+1&&t[3]===Q.MAX_RUNE&&(s.op=et.RUNE_ANY_NOT_NL),n}compile(t){switch(t.op){case k.Op.NO_MATCH:return this.fail();case k.Op.EMPTY_MATCH:return this.nop();case k.Op.LITERAL:if(t.runes.length===0)return this.nop();{let e=null;for(let n of t.runes){const s=this.rune([n],t.flags);e=e===null?s:this.cat(e,s)}return e}case k.Op.CHAR_CLASS:return this.rune(t.runes,t.flags);case k.Op.ANY_CHAR_NOT_NL:return this.rune(rs.ANY_RUNE_NOT_NL(),0);case k.Op.ANY_CHAR:return this.rune(rs.ANY_RUNE(),0);case k.Op.BEGIN_LINE:return this.empty(tt.EMPTY_BEGIN_LINE);case k.Op.END_LINE:return this.empty(tt.EMPTY_END_LINE);case k.Op.BEGIN_TEXT:return this.empty(tt.EMPTY_BEGIN_TEXT);case k.Op.END_TEXT:return this.empty(tt.EMPTY_END_TEXT);case k.Op.WORD_BOUNDARY:return this.empty(tt.EMPTY_WORD_BOUNDARY);case k.Op.NO_WORD_BOUNDARY:return this.empty(tt.EMPTY_NO_WORD_BOUNDARY);case k.Op.CAPTURE:{const e=this.cap(t.cap<<1),n=this.compile(t.subs[0]),s=this.cap(t.cap<<1|1);return this.cat(this.cat(e,n),s)}case k.Op.STAR:return this.star(this.compile(t.subs[0]),(t.flags&B.NON_GREEDY)!==0);case k.Op.PLUS:return this.plus(this.compile(t.subs[0]),(t.flags&B.NON_GREEDY)!==0);case k.Op.QUEST:return this.quest(this.compile(t.subs[0]),(t.flags&B.NON_GREEDY)!==0);case k.Op.CONCAT:{if(t.subs.length===0)return this.nop();{let e=null;for(let n of t.subs){const s=this.compile(n);e=e===null?s:this.cat(e,s)}return e}}case k.Op.ALTERNATE:{if(t.subs.length===0)return this.nop();{let e=null;for(let n of t.subs){const s=this.compile(n);e=e===null?s:this.alt(e,s)}return e}}default:throw new s3("regexp: unhandled case in compile")}}}class Ee{static simplify(t){if(t===null)return null;switch(t.op){case k.Op.CAPTURE:case k.Op.CONCAT:case k.Op.ALTERNATE:{let e=t;for(let n=0;n<t.subs.length;n++){const s=t.subs[n],i=Ee.simplify(s);e===t&&i!==s&&(e=k.fromRegexp(t),e.runes=null,e.subs=t.subs.slice(0,t.subs.length)),e!==t&&(e.subs[n]=i)}return e}case k.Op.STAR:case k.Op.PLUS:case k.Op.QUEST:{const e=Ee.simplify(t.subs[0]);return Ee.simplify1(t.op,t.flags,e,t)}case k.Op.REPEAT:{if(t.min===0&&t.max===0)return new k(k.Op.EMPTY_MATCH);const e=Ee.simplify(t.subs[0]);if(t.max===-1){if(t.min===0)return Ee.simplify1(k.Op.STAR,t.flags,e,null);if(t.min===1)return Ee.simplify1(k.Op.PLUS,t.flags,e,null);const s=new k(k.Op.CONCAT),i=[];for(let o=0;o<t.min-1;o++)i.push(e);return i.push(Ee.simplify1(k.Op.PLUS,t.flags,e,null)),s.subs=i.slice(0),s}if(t.min===1&&t.max===1)return e;let n=null;if(t.min>0){n=[];for(let s=0;s<t.min;s++)n.push(e)}if(t.max>t.min){let s=Ee.simplify1(k.Op.QUEST,t.flags,e,null);for(let i=t.min+1;i<t.max;i++){const o=new k(k.Op.CONCAT);o.subs=[e,s],s=Ee.simplify1(k.Op.QUEST,t.flags,o,null)}if(n===null)return s;n.push(s)}if(n!==null){const s=new k(k.Op.CONCAT);return s.subs=n.slice(0),s}return new k(k.Op.NO_MATCH)}}return t}static simplify1(t,e,n,s){return n.op===k.Op.EMPTY_MATCH||t===n.op&&(e&B.NON_GREEDY)===(n.flags&B.NON_GREEDY)?n:(s!==null&&s.op===t&&(s.flags&B.NON_GREEDY)===(e&B.NON_GREEDY)&&n===s.subs[0]||(s=new k(t),s.flags=e,s.subs=[n]),s)}}class at{constructor(t,e){this.sign=t,this.cls=e}}const qc=[48,57],Hc=[9,10,12,13,32,32],jc=[48,57,65,90,95,95,97,122],Gc=new Map([["\\d",new at(1,qc)],["\\D",new at(-1,qc)],["\\s",new at(1,Hc)],["\\S",new at(-1,Hc)],["\\w",new at(1,jc)],["\\W",new at(-1,jc)]]),zc=[48,57,65,90,97,122],Wc=[65,90,97,122],Kc=[0,127],Yc=[9,9,32,32],Qc=[0,31,127,127],Xc=[48,57],Jc=[33,126],Zc=[97,122],tl=[32,126],el=[33,47,58,64,91,96,123,126],nl=[9,13,32,32],rl=[65,90],sl=[48,57,65,90,95,95,97,122],il=[48,57,65,70,97,102],ol=new Map([["[:alnum:]",new at(1,zc)],["[:^alnum:]",new at(-1,zc)],["[:alpha:]",new at(1,Wc)],["[:^alpha:]",new at(-1,Wc)],["[:ascii:]",new at(1,Kc)],["[:^ascii:]",new at(-1,Kc)],["[:blank:]",new at(1,Yc)],["[:^blank:]",new at(-1,Yc)],["[:cntrl:]",new at(1,Qc)],["[:^cntrl:]",new at(-1,Qc)],["[:digit:]",new at(1,Xc)],["[:^digit:]",new at(-1,Xc)],["[:graph:]",new at(1,Jc)],["[:^graph:]",new at(-1,Jc)],["[:lower:]",new at(1,Zc)],["[:^lower:]",new at(-1,Zc)],["[:print:]",new at(1,tl)],["[:^print:]",new at(-1,tl)],["[:punct:]",new at(1,el)],["[:^punct:]",new at(-1,el)],["[:space:]",new at(1,nl)],["[:^space:]",new at(-1,nl)],["[:upper:]",new at(1,rl)],["[:^upper:]",new at(-1,rl)],["[:word:]",new at(1,sl)],["[:^word:]",new at(-1,sl)],["[:xdigit:]",new at(1,il)],["[:^xdigit:]",new at(-1,il)]]);class $t{static charClassToString(t,e){let n="[";for(let s=0;s<e;s+=2){s>0&&(n+=" ");const i=t[s],o=t[s+1];i===o?n+=`0x${i.toString(16)}`:n+=`0x${i.toString(16)}-0x${o.toString(16)}`}return n+="]",n}static cmp(t,e,n,s){const i=t[e]-n;return i!==0?i:s-t[e+1]}static qsortIntPair(t,e,n){const s=((e+n)/2|0)&-2,i=t[s],o=t[s+1];let u=e,c=n;for(;u<=c;){for(;u<n&&$t.cmp(t,u,i,o)<0;)u+=2;for(;c>e&&$t.cmp(t,c,i,o)>0;)c-=2;if(u<=c){if(u!==c){let h=t[u];t[u]=t[c],t[c]=h,h=t[u+1],t[u+1]=t[c+1],t[c+1]=h}u+=2,c-=2}}e<c&&$t.qsortIntPair(t,e,c),u<n&&$t.qsortIntPair(t,u,n)}constructor(t=tt.emptyInts()){this.r=t,this.len=t.length}toArray(){return this.len===this.r.length?this.r:this.r.slice(0,this.len)}cleanClass(){if(this.len<4)return this;$t.qsortIntPair(this.r,0,this.len-2);let t=2;for(let e=2;e<this.len;e+=2){const n=this.r[e],s=this.r[e+1];if(n<=this.r[t-1]+1){s>this.r[t-1]&&(this.r[t-1]=s);continue}this.r[t]=n,this.r[t+1]=s,t+=2}return this.len=t,this}appendLiteral(t,e){return(e&B.FOLD_CASE)!==0?this.appendFoldedRange(t,t):this.appendRange(t,t)}appendRange(t,e){if(this.len>0){for(let n=2;n<=4;n+=2)if(this.len>=n){const s=this.r[this.len-n],i=this.r[this.len-n+1];if(t<=i+1&&s<=e+1)return t<s&&(this.r[this.len-n]=t),e>i&&(this.r[this.len-n+1]=e),this}}return this.r[this.len++]=t,this.r[this.len++]=e,this}appendFoldedRange(t,e){if(t<=Q.MIN_FOLD&&e>=Q.MAX_FOLD)return this.appendRange(t,e);if(e<Q.MIN_FOLD||t>Q.MAX_FOLD)return this.appendRange(t,e);t<Q.MIN_FOLD&&(this.appendRange(t,Q.MIN_FOLD-1),t=Q.MIN_FOLD),e>Q.MAX_FOLD&&(this.appendRange(Q.MAX_FOLD+1,e),e=Q.MAX_FOLD);for(let n=t;n<=e;n++){this.appendRange(n,n);for(let s=Q.simpleFold(n);s!==n;s=Q.simpleFold(s))this.appendRange(s,s)}return this}appendClass(t){for(let e=0;e<t.length;e+=2)this.appendRange(t[e],t[e+1]);return this}appendFoldedClass(t){for(let e=0;e<t.length;e+=2)this.appendFoldedRange(t[e],t[e+1]);return this}appendNegatedClass(t){let e=0;for(let n=0;n<t.length;n+=2){const s=t[n],i=t[n+1];e<=s-1&&this.appendRange(e,s-1),e=i+1}return e<=Q.MAX_RUNE&&this.appendRange(e,Q.MAX_RUNE),this}appendTable(t){for(let e of t){const n=e[0],s=e[1],i=e[2];if(i===1){this.appendRange(n,s);continue}for(let o=n;o<=s;o+=i)this.appendRange(o,o)}return this}appendNegatedTable(t){let e=0;for(let n of t){const s=n[0],i=n[1],o=n[2];if(o===1){e<=s-1&&this.appendRange(e,s-1),e=i+1;continue}for(let u=s;u<=i;u+=o)e<=u-1&&this.appendRange(e,u-1),e=u+1}return e<=Q.MAX_RUNE&&this.appendRange(e,Q.MAX_RUNE),this}appendTableWithSign(t,e){return e<0?this.appendNegatedTable(t):this.appendTable(t)}negateClass(){let t=0,e=0;for(let n=0;n<this.len;n+=2){const s=this.r[n],i=this.r[n+1];t<=s-1&&(this.r[e]=t,this.r[e+1]=s-1,e+=2),t=i+1}return this.len=e,t<=Q.MAX_RUNE&&(this.r[this.len++]=t,this.r[this.len++]=Q.MAX_RUNE),this}appendClassWithSign(t,e){return e<0?this.appendNegatedClass(t):this.appendClass(t)}appendGroup(t,e){let n=t.cls;return e&&(n=new $t().appendFoldedClass(n).cleanClass().toArray()),this.appendClassWithSign(n,t.sign)}toString(){return $t.charClassToString(this.r,this.len)}}class ss{static of(t,e){return new ss(t,e)}constructor(t,e){this.first=t,this.second=e}}class l3{constructor(t){this.str=t,this.position=0}pos(){return this.position}rewindTo(t){this.position=t}more(){return this.position<this.str.length}peek(){return this.str.codePointAt(this.position)}skip(t){this.position+=t}skipString(t){this.position+=t.length}pop(){const t=this.str.codePointAt(this.position);return this.position+=tt.charCount(t),t}lookingAt(t){return this.rest().startsWith(t)}rest(){return this.str.substring(this.position)}from(t){return this.str.substring(t,this.position)}toString(){return this.rest()}}const j=class j{static ANY_TABLE(){return[[0,Q.MAX_RUNE,1]]}static unicodeTable(t){return t==="Any"?ss.of(j.ANY_TABLE(),j.ANY_TABLE()):Bt.CATEGORIES.has(t)?ss.of(Bt.CATEGORIES.get(t),Bt.FOLD_CATEGORIES.get(t)):Bt.SCRIPTS.has(t)?ss.of(Bt.SCRIPTS.get(t),Bt.FOLD_SCRIPT.get(t)):null}static minFoldRune(t){if(t<Q.MIN_FOLD||t>Q.MAX_FOLD)return t;let e=t;const n=t;for(t=Q.simpleFold(t);t!==n;t=Q.simpleFold(t))e>t&&(e=t);return e}static leadingRegexp(t){if(t.op===k.Op.EMPTY_MATCH)return null;if(t.op===k.Op.CONCAT&&t.subs.length>0){const e=t.subs[0];return e.op===k.Op.EMPTY_MATCH?null:e}return t}static literalRegexp(t,e){const n=new k(k.Op.LITERAL);return n.flags=e,n.runes=tt.stringToRunes(t),n}static parse(t,e){return new j(t,e).parseInternal()}static parseRepeat(t){const e=t.pos();if(!t.more()||!t.lookingAt("{"))return-1;t.skip(1);const n=j.parseInt(t);if(n===-1||!t.more())return-1;let s;if(!t.lookingAt(","))s=n;else{if(t.skip(1),!t.more())return-1;if(t.lookingAt("}"))s=-1;else if((s=j.parseInt(t))===-1)return-1}if(!t.more()||!t.lookingAt("}"))return-1;if(t.skip(1),n<0||n>1e3||s===-2||s>1e3||s>=0&&n>s)throw new yt(j.ERR_INVALID_REPEAT_SIZE,t.from(e));return n<<16|s&Q.MAX_BMP}static isValidCaptureName(t){if(t.length===0)return!1;for(let e=0;e<t.length;e++){const n=t.codePointAt(e);if(n!==P.CODES.get("_")&&!tt.isalnum(n))return!1}return!0}static parseInt(t){const e=t.pos();for(;t.more()&&t.peek()>=P.CODES.get("0")&&t.peek()<=P.CODES.get("9");)t.skip(1);const n=t.from(e);return n.length===0||n.length>1&&n.codePointAt(0)===P.CODES.get("0")?-1:n.length>8?-2:parseFloat(n,10)}static isCharClass(t){return t.op===k.Op.LITERAL&&t.runes.length===1||t.op===k.Op.CHAR_CLASS||t.op===k.Op.ANY_CHAR_NOT_NL||t.op===k.Op.ANY_CHAR}static matchRune(t,e){switch(t.op){case k.Op.LITERAL:return t.runes.length===1&&t.runes[0]===e;case k.Op.CHAR_CLASS:for(let n=0;n<t.runes.length;n+=2)if(t.runes[n]<=e&&e<=t.runes[n+1])return!0;return!1;case k.Op.ANY_CHAR_NOT_NL:return e!==P.CODES.get(`
`);case k.Op.ANY_CHAR:return!0}return!1}static mergeCharClass(t,e){switch(t.op){case k.Op.ANY_CHAR:break;case k.Op.ANY_CHAR_NOT_NL:j.matchRune(e,P.CODES.get(`
`))&&(t.op=k.Op.ANY_CHAR);break;case k.Op.CHAR_CLASS:e.op===k.Op.LITERAL?t.runes=new $t(t.runes).appendLiteral(e.runes[0],e.flags).toArray():t.runes=new $t(t.runes).appendClass(e.runes).toArray();break;case k.Op.LITERAL:if(e.runes[0]===t.runes[0]&&e.flags===t.flags)break;t.op=k.Op.CHAR_CLASS,t.runes=new $t().appendLiteral(t.runes[0],t.flags).appendLiteral(e.runes[0],e.flags).toArray();break}}static parseEscape(t){const e=t.pos();if(t.skip(1),!t.more())throw new yt(j.ERR_TRAILING_BACKSLASH);let n=t.pop();t:switch(n){case P.CODES.get("1"):case P.CODES.get("2"):case P.CODES.get("3"):case P.CODES.get("4"):case P.CODES.get("5"):case P.CODES.get("6"):case P.CODES.get("7"):if(!t.more()||t.peek()<P.CODES.get("0")||t.peek()>P.CODES.get("7"))break;case P.CODES.get("0"):{let s=n-P.CODES.get("0");for(let i=1;i<3&&!(!t.more()||t.peek()<P.CODES.get("0")||t.peek()>P.CODES.get("7"));i++)s=s*8+t.peek()-P.CODES.get("0"),t.skip(1);return s}case P.CODES.get("x"):{if(!t.more())break;if(n=t.pop(),n===P.CODES.get("{")){let o=0,u=0;for(;;){if(!t.more())break t;if(n=t.pop(),n===P.CODES.get("}"))break;const c=tt.unhex(n);if(c<0||(u=u*16+c,u>Q.MAX_RUNE))break t;o++}if(o===0)break t;return u}const s=tt.unhex(n);if(!t.more())break;n=t.pop();const i=tt.unhex(n);if(s<0||i<0)break;return s*16+i}case P.CODES.get("a"):return P.CODES.get("\x07");case P.CODES.get("f"):return P.CODES.get("\f");case P.CODES.get("n"):return P.CODES.get(`
`);case P.CODES.get("r"):return P.CODES.get("\r");case P.CODES.get("t"):return P.CODES.get("	");case P.CODES.get("v"):return P.CODES.get("\v");default:if(!tt.isalnum(n))return n;break}throw new yt(j.ERR_INVALID_ESCAPE,t.from(e))}static parseClassChar(t,e){if(!t.more())throw new yt(j.ERR_MISSING_BRACKET,t.from(e));return t.lookingAt("\\")?j.parseEscape(t):t.pop()}static concatRunes(t,e){return[...t,...e]}constructor(t,e=0){this.wholeRegexp=t,this.flags=e,this.numCap=0,this.namedGroups={},this.stack=[],this.free=null}newRegexp(t){let e=this.free;return e!==null&&e.subs!==null&&e.subs.length>0?(this.free=e.subs[0],e.reinit(),e.op=t):e=new k(t),e}reuse(t){t.subs!==null&&t.subs.length>0&&(t.subs[0]=this.free),this.free=t}pop(){return this.stack.pop()}popToPseudo(){const t=this.stack.length;let e=t;for(;e>0&&!k.isPseudoOp(this.stack[e-1].op);)e--;const n=this.stack.slice(e,t);return this.stack=this.stack.slice(0,e),n}push(t){if(t.op===k.Op.CHAR_CLASS&&t.runes.length===2&&t.runes[0]===t.runes[1]){if(this.maybeConcat(t.runes[0],this.flags&-2))return null;t.op=k.Op.LITERAL,t.runes=[t.runes[0]],t.flags=this.flags&-2}else if(t.op===k.Op.CHAR_CLASS&&t.runes.length===4&&t.runes[0]===t.runes[1]&&t.runes[2]===t.runes[3]&&Q.simpleFold(t.runes[0])===t.runes[2]&&Q.simpleFold(t.runes[2])===t.runes[0]||t.op===k.Op.CHAR_CLASS&&t.runes.length===2&&t.runes[0]+1===t.runes[1]&&Q.simpleFold(t.runes[0])===t.runes[1]&&Q.simpleFold(t.runes[1])===t.runes[0]){if(this.maybeConcat(t.runes[0],this.flags|B.FOLD_CASE))return null;t.op=k.Op.LITERAL,t.runes=[t.runes[0]],t.flags=this.flags|B.FOLD_CASE}else this.maybeConcat(-1,0);return this.stack.push(t),t}maybeConcat(t,e){const n=this.stack.length;if(n<2)return!1;const s=this.stack[n-1],i=this.stack[n-2];return s.op!==k.Op.LITERAL||i.op!==k.Op.LITERAL||(s.flags&B.FOLD_CASE)!==(i.flags&B.FOLD_CASE)?!1:(i.runes=j.concatRunes(i.runes,s.runes),t>=0?(s.runes=[t],s.flags=e,!0):(this.pop(),this.reuse(s),!1))}newLiteral(t,e){const n=this.newRegexp(k.Op.LITERAL);return n.flags=e,(e&B.FOLD_CASE)!==0&&(t=j.minFoldRune(t)),n.runes=[t],n}literal(t){this.push(this.newLiteral(t,this.flags))}op(t){const e=this.newRegexp(t);return e.flags=this.flags,this.push(e)}repeat(t,e,n,s,i,o){let u=this.flags;if((u&B.PERL_X)!==0&&(i.more()&&i.lookingAt("?")&&(i.skip(1),u^=B.NON_GREEDY),o!==-1))throw new yt(j.ERR_INVALID_REPEAT_OP,i.from(o));const c=this.stack.length;if(c===0)throw new yt(j.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));const h=this.stack[c-1];if(k.isPseudoOp(h.op))throw new yt(j.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));const p=this.newRegexp(t);p.min=e,p.max=n,p.flags=u,p.subs=[h],this.stack[c-1]=p}concat(){this.maybeConcat(-1,0);const t=this.popToPseudo();return t.length===0?this.push(this.newRegexp(k.Op.EMPTY_MATCH)):this.push(this.collapse(t,k.Op.CONCAT))}alternate(){const t=this.popToPseudo();return t.length>0&&this.cleanAlt(t[t.length-1]),t.length===0?this.push(this.newRegexp(k.Op.NO_MATCH)):this.push(this.collapse(t,k.Op.ALTERNATE))}cleanAlt(t){t.op===k.Op.CHAR_CLASS&&(t.runes=new $t(t.runes).cleanClass().toArray(),t.runes.length===2&&t.runes[0]===0&&t.runes[1]===Q.MAX_RUNE?(t.runes=null,t.op=k.Op.ANY_CHAR):t.runes.length===4&&t.runes[0]===0&&t.runes[1]===P.CODES.get(`
`)-1&&t.runes[2]===P.CODES.get(`
`)+1&&t.runes[3]===Q.MAX_RUNE&&(t.runes=null,t.op=k.Op.ANY_CHAR_NOT_NL))}collapse(t,e){if(t.length===1)return t[0];let n=0;for(let u of t)n+=u.op===e?u.subs.length:1;let s=new Array(n).fill(null),i=0;for(let u of t)u.op===e?(s.splice(i,u.subs.length,...u.subs),i+=u.subs.length,this.reuse(u)):s[i++]=u;let o=this.newRegexp(e);if(o.subs=s,e===k.Op.ALTERNATE&&(o.subs=this.factor(o.subs),o.subs.length===1)){const u=o;o=o.subs[0],this.reuse(u)}return o}factor(t){if(t.length<2)return t;let e=0,n=t.length,s=0,i=null,o=0,u=0,c=0;for(let p=0;p<=n;p++){let _=null,v=0,N=0;if(p<n){let V=t[e+p];if(V.op===k.Op.CONCAT&&V.subs.length>0&&(V=V.subs[0]),V.op===k.Op.LITERAL&&(_=V.runes,v=V.runes.length,N=V.flags&B.FOLD_CASE),N===u){let M=0;for(;M<o&&M<v&&i[M]===_[M];)M++;if(M>0){o=M;continue}}}if(p!==c)if(p===c+1)t[s++]=t[e+c];else{const V=this.newRegexp(k.Op.LITERAL);V.flags=u,V.runes=i.slice(0,o);for(let J=c;J<p;J++)t[e+J]=this.removeLeadingString(t[e+J],o);const M=this.collapse(t.slice(e+c,e+p),k.Op.ALTERNATE),$=this.newRegexp(k.Op.CONCAT);$.subs=[V,M],t[s++]=$}c=p,i=_,o=v,u=N}n=s,e=0,c=0,s=0;let h=null;for(let p=0;p<=n;p++){let _=null;if(!(p<n&&(_=j.leadingRegexp(t[e+p]),h!==null&&h.equals(_)&&(j.isCharClass(h)||h.op===k.Op.REPEAT&&h.min===h.max&&j.isCharClass(h.subs[0]))))){if(p!==c)if(p===c+1)t[s++]=t[e+c];else{const v=h;for(let M=c;M<p;M++){const $=M!==c;t[e+M]=this.removeLeadingRegexp(t[e+M],$)}const N=this.collapse(t.slice(e+c,e+p),k.Op.ALTERNATE),V=this.newRegexp(k.Op.CONCAT);V.subs=[v,N],t[s++]=V}c=p,h=_}}n=s,e=0,c=0,s=0;for(let p=0;p<=n;p++)if(!(p<n&&j.isCharClass(t[e+p]))){if(p!==c)if(p===c+1)t[s++]=t[e+c];else{let _=c;for(let N=c+1;N<p;N++){const V=t[e+_],M=t[e+N];(V.op<M.op||V.op===M.op&&(V.runes!==null?V.runes.length:0)<(M.runes!==null?M.runes.length:0))&&(_=N)}const v=t[e+c];t[e+c]=t[e+_],t[e+_]=v;for(let N=c+1;N<p;N++)j.mergeCharClass(t[e+c],t[e+N]),this.reuse(t[e+N]);this.cleanAlt(t[e+c]),t[s++]=t[e+c]}p<n&&(t[s++]=t[e+p]),c=p+1}n=s,e=0,c=0,s=0;for(let p=0;p<n;++p)p+1<n&&t[e+p].op===k.Op.EMPTY_MATCH&&t[e+p+1].op===k.Op.EMPTY_MATCH||(t[s++]=t[e+p]);return n=s,e=0,t.slice(e,n)}removeLeadingString(t,e){if(t.op===k.Op.CONCAT&&t.subs.length>0){const n=this.removeLeadingString(t.subs[0],e);if(t.subs[0]=n,n.op===k.Op.EMPTY_MATCH)switch(this.reuse(n),t.subs.length){case 0:case 1:t.op=k.Op.EMPTY_MATCH,t.subs=null;break;case 2:{const s=t;t=t.subs[1],this.reuse(s);break}default:t.subs=t.subs.slice(1,t.subs.length);break}return t}return t.op===k.Op.LITERAL&&(t.runes=t.runes.slice(e,t.runes.length),t.runes.length===0&&(t.op=k.Op.EMPTY_MATCH)),t}removeLeadingRegexp(t,e){if(t.op===k.Op.CONCAT&&t.subs.length>0){switch(e&&this.reuse(t.subs[0]),t.subs=t.subs.slice(1,t.subs.length),t.subs.length){case 0:{t.op=k.Op.EMPTY_MATCH,t.subs=k.emptySubs();break}case 1:{const n=t;t=t.subs[0],this.reuse(n);break}}return t}return e&&this.reuse(t),this.newRegexp(k.Op.EMPTY_MATCH)}parseInternal(){if((this.flags&B.LITERAL)!==0)return j.literalRegexp(this.wholeRegexp,this.flags);let t=-1,e=-1,n=-1;const s=new l3(this.wholeRegexp);for(;s.more();){let o=-1;t:switch(s.peek()){case P.CODES.get("("):if((this.flags&B.PERL_X)!==0&&s.lookingAt("(?")){this.parsePerlFlags(s);break}this.op(k.Op.LEFT_PAREN).cap=++this.numCap,s.skip(1);break;case P.CODES.get("|"):this.parseVerticalBar(),s.skip(1);break;case P.CODES.get(")"):this.parseRightParen(),s.skip(1);break;case P.CODES.get("^"):(this.flags&B.ONE_LINE)!==0?this.op(k.Op.BEGIN_TEXT):this.op(k.Op.BEGIN_LINE),s.skip(1);break;case P.CODES.get("$"):(this.flags&B.ONE_LINE)!==0?this.op(k.Op.END_TEXT).flags|=B.WAS_DOLLAR:this.op(k.Op.END_LINE),s.skip(1);break;case P.CODES.get("."):(this.flags&B.DOT_NL)!==0?this.op(k.Op.ANY_CHAR):this.op(k.Op.ANY_CHAR_NOT_NL),s.skip(1);break;case P.CODES.get("["):this.parseClass(s);break;case P.CODES.get("*"):case P.CODES.get("+"):case P.CODES.get("?"):{o=s.pos();let u=null;switch(s.pop()){case P.CODES.get("*"):u=k.Op.STAR;break;case P.CODES.get("+"):u=k.Op.PLUS;break;case P.CODES.get("?"):u=k.Op.QUEST;break}this.repeat(u,e,n,o,s,t);break}case P.CODES.get("{"):{o=s.pos();const u=j.parseRepeat(s);if(u<0){s.rewindTo(o),this.literal(s.pop());break}e=u>>16,n=(u&Q.MAX_BMP)<<16>>16,this.repeat(k.Op.REPEAT,e,n,o,s,t);break}case P.CODES.get("\\"):{const u=s.pos();if(s.skip(1),(this.flags&B.PERL_X)!==0&&s.more())switch(s.pop()){case P.CODES.get("A"):this.op(k.Op.BEGIN_TEXT);break t;case P.CODES.get("b"):this.op(k.Op.WORD_BOUNDARY);break t;case P.CODES.get("B"):this.op(k.Op.NO_WORD_BOUNDARY);break t;case P.CODES.get("C"):throw new yt(j.ERR_INVALID_ESCAPE,"\\C");case P.CODES.get("Q"):{let _=s.rest();const v=_.indexOf("\\E");v>=0&&(_=_.substring(0,v)),s.skipString(_),s.skipString("\\E");let N=0;for(;N<_.length;){const V=_.codePointAt(N);this.literal(V),N+=tt.charCount(V)}break t}case P.CODES.get("z"):this.op(k.Op.END_TEXT);break t;default:s.rewindTo(u);break}const c=this.newRegexp(k.Op.CHAR_CLASS);if(c.flags=this.flags,s.lookingAt("\\p")||s.lookingAt("\\P")){const p=new $t;if(this.parseUnicodeClass(s,p)){c.runes=p.toArray(),this.push(c);break t}}const h=new $t;if(this.parsePerlClassEscape(s,h)){c.runes=h.toArray(),this.push(c);break t}s.rewindTo(u),this.reuse(c),this.literal(j.parseEscape(s));break}default:this.literal(s.pop());break}t=o}if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length!==1)throw new yt(j.ERR_MISSING_PAREN,this.wholeRegexp);return this.stack[0].namedGroups=this.namedGroups,this.stack[0]}parsePerlFlags(t){const e=t.pos(),n=t.rest();if(n.startsWith("(?P<")||n.startsWith("(?<")){const u=n.charAt(2)==="P"?4:3,c=n.indexOf(">");if(c<0)throw new yt(j.ERR_INVALID_NAMED_CAPTURE,n);const h=n.substring(u,c);if(t.skipString(h),t.skip(u+1),!j.isValidCaptureName(h))throw new yt(j.ERR_INVALID_NAMED_CAPTURE,n.substring(0,c+1));const p=this.op(k.Op.LEFT_PAREN);if(p.cap=++this.numCap,this.namedGroups[h])throw new yt(j.ERR_DUPLICATE_NAMED_CAPTURE,h);this.namedGroups[h]=this.numCap,p.name=h;return}t.skip(2);let s=this.flags,i=1,o=!1;t:for(;t.more();){const u=t.pop();switch(u){case P.CODES.get("i"):s|=B.FOLD_CASE,o=!0;break;case P.CODES.get("m"):s&=-17,o=!0;break;case P.CODES.get("s"):s|=B.DOT_NL,o=!0;break;case P.CODES.get("U"):s|=B.NON_GREEDY,o=!0;break;case P.CODES.get("-"):if(i<0)break t;i=-1,s=~s,o=!1;break;case P.CODES.get(":"):case P.CODES.get(")"):if(i<0){if(!o)break t;s=~s}u===P.CODES.get(":")&&this.op(k.Op.LEFT_PAREN),this.flags=s;return;default:break t}}throw new yt(j.ERR_INVALID_PERL_OP,t.from(e))}parseVerticalBar(){this.concat(),this.swapVerticalBar()||this.op(k.Op.VERTICAL_BAR)}swapVerticalBar(){const t=this.stack.length;if(t>=3&&this.stack[t-2].op===k.Op.VERTICAL_BAR&&j.isCharClass(this.stack[t-1])&&j.isCharClass(this.stack[t-3])){let e=this.stack[t-1],n=this.stack[t-3];if(e.op>n.op){const s=n;n=e,e=s,this.stack[t-3]=n}return j.mergeCharClass(n,e),this.reuse(e),this.pop(),!0}if(t>=2){const e=this.stack[t-1],n=this.stack[t-2];if(n.op===k.Op.VERTICAL_BAR)return t>=3&&this.cleanAlt(this.stack[t-3]),this.stack[t-2]=e,this.stack[t-1]=n,!0}return!1}parseRightParen(){if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length<2)throw new yt(j.ERR_INTERNAL_ERROR,"stack underflow");const e=this.pop(),n=this.pop();if(n.op!==k.Op.LEFT_PAREN)throw new yt(j.ERR_MISSING_PAREN,this.wholeRegexp);this.flags=n.flags,n.cap===0?this.push(e):(n.op=k.Op.CAPTURE,n.subs=[e],this.push(n))}parsePerlClassEscape(t,e){const n=t.pos();if((this.flags&B.PERL_X)===0||!t.more()||t.pop()!==P.CODES.get("\\")||!t.more())return!1;t.pop();const s=t.from(n),i=Gc.has(s)?Gc.get(s):null;return i===null?!1:(e.appendGroup(i,(this.flags&B.FOLD_CASE)!==0),!0)}parseNamedClass(t,e){const n=t.rest(),s=n.indexOf(":]");if(s<0)return!1;const i=n.substring(0,s+2);t.skipString(i);const o=ol.has(i)?ol.get(i):null;if(o===null)throw new yt(j.ERR_INVALID_CHAR_RANGE,i);return e.appendGroup(o,(this.flags&B.FOLD_CASE)!==0),!0}parseUnicodeClass(t,e){const n=t.pos();if((this.flags&B.UNICODE_GROUPS)===0||!t.lookingAt("\\p")&&!t.lookingAt("\\P"))return!1;t.skip(1);let s=1,i=t.pop();if(i===P.CODES.get("P")&&(s=-1),!t.more())throw t.rewindTo(n),new yt(j.ERR_INVALID_CHAR_RANGE,t.rest());i=t.pop();let o;if(i!==P.CODES.get("{"))o=tt.runeToString(i);else{const p=t.rest(),_=p.indexOf("}");if(_<0)throw t.rewindTo(n),new yt(j.ERR_INVALID_CHAR_RANGE,t.rest());o=p.substring(0,_),t.skipString(o),t.skip(1)}o.length!==0&&o.codePointAt(0)===P.CODES.get("^")&&(s=0-s,o=o.substring(1));const u=j.unicodeTable(o);if(u===null)throw new yt(j.ERR_INVALID_CHAR_RANGE,t.from(n));const c=u.first,h=u.second;if((this.flags&B.FOLD_CASE)===0||h===null)e.appendTableWithSign(c,s);else{const p=new $t().appendTable(c).appendTable(h).cleanClass().toArray();e.appendClassWithSign(p,s)}return!0}parseClass(t){const e=t.pos();t.skip(1);const n=this.newRegexp(k.Op.CHAR_CLASS);n.flags=this.flags;const s=new $t;let i=1;t.more()&&t.lookingAt("^")&&(i=-1,t.skip(1),(this.flags&B.CLASS_NL)===0&&s.appendRange(P.CODES.get(`
`),P.CODES.get(`
`)));let o=!0;for(;!t.more()||t.peek()!==P.CODES.get("]")||o;){if(t.more()&&t.lookingAt("-")&&(this.flags&B.PERL_X)===0&&!o){const p=t.rest();if(p==="-"||!p.startsWith("-]"))throw t.rewindTo(e),new yt(j.ERR_INVALID_CHAR_RANGE,t.rest())}o=!1;const u=t.pos();if(t.lookingAt("[:")){if(this.parseNamedClass(t,s))continue;t.rewindTo(u)}if(this.parseUnicodeClass(t,s)||this.parsePerlClassEscape(t,s))continue;t.rewindTo(u);const c=j.parseClassChar(t,e);let h=c;if(t.more()&&t.lookingAt("-")){if(t.skip(1),t.more()&&t.lookingAt("]"))t.skip(-1);else if(h=j.parseClassChar(t,e),h<c)throw new yt(j.ERR_INVALID_CHAR_RANGE,t.from(u))}(this.flags&B.FOLD_CASE)===0?s.appendRange(c,h):s.appendFoldedRange(c,h)}t.skip(1),s.cleanClass(),i<0&&s.negateClass(),n.runes=s.toArray(),this.push(n)}};g(j,"ERR_INTERNAL_ERROR","regexp/syntax: internal error"),g(j,"ERR_INVALID_CHAR_RANGE","invalid character class range"),g(j,"ERR_INVALID_ESCAPE","invalid escape sequence"),g(j,"ERR_INVALID_NAMED_CAPTURE","invalid named capture"),g(j,"ERR_INVALID_PERL_OP","invalid or unsupported Perl syntax"),g(j,"ERR_INVALID_REPEAT_OP","invalid nested repetition operator"),g(j,"ERR_INVALID_REPEAT_SIZE","invalid repeat count"),g(j,"ERR_MISSING_BRACKET","missing closing ]"),g(j,"ERR_MISSING_PAREN","missing closing )"),g(j,"ERR_MISSING_REPEAT_ARGUMENT","missing argument to repetition operator"),g(j,"ERR_TRAILING_BACKSLASH","trailing backslash at end of expression"),g(j,"ERR_DUPLICATE_NAMED_CAPTURE","duplicate capture group name");let ba=j;class h3{constructor(){this.inst=null,this.cap=[]}}class al{constructor(){this.sparse=[],this.densePcs=[],this.denseThreads=[],this.size=0}contains(t){const e=this.sparse[t];return e<this.size&&this.densePcs[e]===t}isEmpty(){return this.size===0}add(t){const e=this.size++;return this.sparse[t]=e,this.denseThreads[e]=null,this.densePcs[e]=t,e}clear(){this.sparse=[],this.densePcs=[],this.denseThreads=[],this.size=0}toString(){let t="{";for(let e=0;e<this.size;e++)e!==0&&(t+=", "),t+=this.densePcs[e];return t+="}",t}}class dr{static fromRE2(t){const e=new dr;return e.prog=t.prog,e.re2=t,e.q0=new al(e.prog.numInst()),e.q1=new al(e.prog.numInst()),e.pool=[],e.poolSize=0,e.matched=!1,e.matchcap=Array(e.prog.numCap<2?2:e.prog.numCap).fill(0),e.ncap=0,e}static fromMachine(t){const e=new dr;return e.re2=t.re2,e.prog=t.prog,e.q0=t.q0,e.q1=t.q1,e.pool=t.pool,e.poolSize=t.poolSize,e.matched=t.matched,e.matchcap=t.matchcap,e.ncap=t.ncap,e}init(t){this.ncap=t,t>this.matchcap.length?this.initNewCap(t):this.resetCap(t)}resetCap(t){for(let e=0;e<this.poolSize;e++){const n=this.pool[e];n.cap=Array(t).fill(0)}}initNewCap(t){for(let e=0;e<this.poolSize;e++){const n=this.pool[e];n.cap=Array(t).fill(0)}this.matchcap=Array(t).fill(0)}submatches(){return this.ncap===0?tt.emptyInts():this.matchcap.slice(0,this.ncap)}alloc(t){let e;return this.poolSize>0?(this.poolSize--,e=this.pool[this.poolSize]):e=new h3,e.inst=t,e}freeQueue(t,e=0){const n=t.size-e,s=this.poolSize+n;this.pool.length<s&&(this.pool=this.pool.slice(0,Math.max(this.pool.length*2,s)));for(let i=e;i<t.size;i++){const o=t.denseThreads[i];o!==null&&(this.pool[this.poolSize]=o,this.poolSize++)}t.clear()}freeThread(t){this.pool.length<=this.poolSize&&(this.pool=this.pool.slice(0,this.pool.length*2)),this.pool[this.poolSize]=t,this.poolSize++}match(t,e,n){const s=this.re2.cond;if(s===tt.EMPTY_ALL||(n===B.ANCHOR_START||n===B.ANCHOR_BOTH)&&e!==0)return!1;this.matched=!1,this.matchcap=Array(this.prog.numCap).fill(-1);let i=this.q0,o=this.q1,u=t.step(e),c=u>>3,h=u&7,p=-1,_=0;u!==cn.EOF()&&(u=t.step(e+h),p=u>>3,_=u&7);let v;for(e===0?v=tt.emptyOpContext(-1,c):v=t.context(e);;){if(i.isEmpty()){if((s&tt.EMPTY_BEGIN_TEXT)!==0&&e!==0||this.matched)break;if(this.re2.prefix.length!==0&&p!==this.re2.prefixRune&&t.canCheckPrefix()){const M=t.index(this.re2,e);if(M<0)break;e+=M,u=t.step(e),c=u>>3,h=u&7,u=t.step(e+h),p=u>>3,_=u&7}}!this.matched&&(e===0||n===B.UNANCHORED)&&(this.ncap>0&&(this.matchcap[0]=e),this.add(i,this.prog.start,e,this.matchcap,v,null));const N=e+h;if(v=t.context(N),this.step(i,o,e,N,c,v,n,e===t.endPos()),h===0||this.ncap===0&&this.matched)break;e+=h,c=p,h=_,c!==-1&&(u=t.step(e+h),p=u>>3,_=u&7);const V=i;i=o,o=V}return this.freeQueue(o),this.matched}step(t,e,n,s,i,o,u,c){const h=this.re2.longest;for(let p=0;p<t.size;p++){let _=t.denseThreads[p];if(_===null)continue;if(h&&this.matched&&this.ncap>0&&this.matchcap[0]<_.cap[0]){this.freeThread(_);continue}const v=_.inst;let N=!1;switch(v.op){case et.MATCH:if(u===B.ANCHOR_BOTH&&!c)break;this.ncap>0&&(!h||!this.matched||this.matchcap[1]<n)&&(_.cap[1]=n,this.matchcap=_.cap.slice(0,this.ncap)),h||this.freeQueue(t,p+1),this.matched=!0;break;case et.RUNE:N=v.matchRune(i);break;case et.RUNE1:N=i===v.runes[0];break;case et.RUNE_ANY:N=!0;break;case et.RUNE_ANY_NOT_NL:N=i!==P.CODES.get(`
`);break;default:throw new Error("bad inst")}N&&(_=this.add(e,v.out,s,_.cap,o,_)),_!==null&&(this.freeThread(_),t.denseThreads[p]=null)}t.clear()}add(t,e,n,s,i,o){if(e===0||t.contains(e))return o;const u=t.add(e),c=this.prog.inst[e];switch(c.op){case et.FAIL:break;case et.ALT:case et.ALT_MATCH:o=this.add(t,c.out,n,s,i,o),o=this.add(t,c.arg,n,s,i,o);break;case et.EMPTY_WIDTH:(c.arg&~i)===0&&(o=this.add(t,c.out,n,s,i,o));break;case et.NOP:o=this.add(t,c.out,n,s,i,o);break;case et.CAPTURE:if(c.arg<this.ncap){const h=s[c.arg];s[c.arg]=n,this.add(t,c.out,n,s,i,null),s[c.arg]=h}else o=this.add(t,c.out,n,s,i,o);break;case et.MATCH:case et.RUNE:case et.RUNE1:case et.RUNE_ANY:case et.RUNE_ANY_NOT_NL:o===null?o=this.alloc(c):o.inst=c,this.ncap>0&&o.cap!==s&&(o.cap=s.slice(0,this.ncap)),t.denseThreads[u]=o,o=null;break;default:throw new Error("unhandled")}return o}}class f3{constructor(t){this.value=t}get(){return this.value}set(t){this.value=t}compareAndSet(t,e){return this.value===t?(this.value=e,!0):!1}}class nn{static initTest(t){const e=nn.compile(t),n=new nn(e.expr,e.prog,e.numSubexp,e.longest);return n.cond=e.cond,n.prefix=e.prefix,n.prefixUTF8=e.prefixUTF8,n.prefixComplete=e.prefixComplete,n.prefixRune=e.prefixRune,n}static compile(t){return nn.compileImpl(t,B.PERL,!1)}static compilePOSIX(t){return nn.compileImpl(t,B.POSIX,!0)}static compileImpl(t,e,n){let s=ba.parse(t,e);const i=s.maxCap();s=Ee.simplify(s);const o=rs.compileRegexp(s),u=new nn(t,o,i,n),[c,h]=o.prefix();return u.prefixComplete=c,u.prefix=h,u.prefixUTF8=tt.stringToUtf8ByteArray(u.prefix),u.prefix.length>0&&(u.prefixRune=u.prefix.codePointAt(0)),u.namedGroups=s.namedGroups,u}static match(t,e){return nn.compile(t).match(e)}constructor(t,e,n=0,s=0){this.expr=t,this.prog=e,this.numSubexp=n,this.longest=s,this.cond=e.startCond(),this.prefix=null,this.prefixUTF8=null,this.prefixComplete=!1,this.prefixRune=0,this.pooled=new f3}numberOfCapturingGroups(){return this.numSubexp}get(){let t;do t=this.pooled.get();while(t&&!this.pooled.compareAndSet(t,t.next));return t}reset(){this.pooled.set(null)}put(t,e){let n=this.pooled.get();do n=this.pooled.get(),!e&&n&&(t=dr.fromMachine(t),e=!0),t.next!==n&&(t.next=n);while(!this.pooled.compareAndSet(n,t))}toString(){return this.expr}doExecute(t,e,n,s){let i=this.get(),o=!1;i?i.next!==null&&(i=dr.fromMachine(i),o=!0):(i=dr.fromRE2(this),o=!0),i.init(s);const u=i.match(t,e,n)?i.submatches():null;return this.put(i,o),u}match(t){return this.doExecute(Tt.fromUTF16(t),0,B.UNANCHORED,0)!==null}matchWithGroup(t,e,n,s,i){return t instanceof En||(t=Ui.utf16(t)),this.matchMachineInput(t,e,n,s,i)}matchMachineInput(t,e,n,s,i){if(e>n)return[!1,null];const o=t.isUTF16Encoding()?Tt.fromUTF16(t.asCharSequence(),0,n):Tt.fromUTF8(t.asBytes(),0,n),u=this.doExecute(o,e,s,2*i);return u===null?[!1,null]:[!0,u]}matchUTF8(t){return this.doExecute(Tt.fromUTF8(t),0,B.UNANCHORED,0)!==null}replaceAll(t,e){return this.replaceAllFunc(t,()=>e,2*t.length+1)}replaceFirst(t,e){return this.replaceAllFunc(t,()=>e,1)}replaceAllFunc(t,e,n){let s=0,i=0,o="";const u=Tt.fromUTF16(t);let c=0;for(;i<=t.length;){const h=this.doExecute(u,i,B.UNANCHORED,2);if(h===null||h.length===0)break;o+=t.substring(s,h[0]),(h[1]>s||h[0]===0)&&(o+=e(t.substring(h[0],h[1])),c++),s=h[1];const p=u.step(i)&7;if(i+p>h[1]?i+=p:i+1>h[1]?i++:i=h[1],c>=n)break}return o+=t.substring(s),o}pad(t){if(t===null)return null;let e=(1+this.numSubexp)*2;if(t.length<e){let n=new Array(e).fill(-1);for(let s=0;s<t.length;s++)n[s]=t[s];t=n}return t}allMatches(t,e,n=s=>s){let s=[];const i=t.endPos();e<0&&(e=i+1);let o=0,u=0,c=-1;for(;u<e&&o<=i;){const h=this.doExecute(t,o,B.UNANCHORED,this.prog.numCap);if(h===null||h.length===0)break;let p=!0;if(h[1]===o){h[0]===c&&(p=!1);const _=t.step(o);_<0?o=i+1:o+=_&7}else o=h[1];c=h[1],p&&(s.push(n(this.pad(h))),u++)}return s}findUTF8(t){const e=this.doExecute(Tt.fromUTF8(t),0,B.UNANCHORED,2);return e===null?null:t.slice(e[0],e[1])}findUTF8Index(t){const e=this.doExecute(Tt.fromUTF8(t),0,B.UNANCHORED,2);return e===null?null:e.slice(0,2)}find(t){const e=this.doExecute(Tt.fromUTF16(t),0,B.UNANCHORED,2);return e===null?"":t.substring(e[0],e[1])}findIndex(t){return this.doExecute(Tt.fromUTF16(t),0,B.UNANCHORED,2)}findUTF8Submatch(t){const e=this.doExecute(Tt.fromUTF8(t),0,B.UNANCHORED,this.prog.numCap);if(e===null)return null;const n=new Array(1+this.numSubexp).fill(null);for(let s=0;s<n.length;s++)2*s<e.length&&e[2*s]>=0&&(n[s]=t.slice(e[2*s],e[2*s+1]));return n}findUTF8SubmatchIndex(t){return this.pad(this.doExecute(Tt.fromUTF8(t),0,B.UNANCHORED,this.prog.numCap))}findSubmatch(t){const e=this.doExecute(Tt.fromUTF16(t),0,B.UNANCHORED,this.prog.numCap);if(e===null)return null;const n=new Array(1+this.numSubexp).fill(null);for(let s=0;s<n.length;s++)2*s<e.length&&e[2*s]>=0&&(n[s]=t.substring(e[2*s],e[2*s+1]));return n}findSubmatchIndex(t){return this.pad(this.doExecute(Tt.fromUTF16(t),0,B.UNANCHORED,this.prog.numCap))}findAllUTF8(t,e){const n=this.allMatches(Tt.fromUTF8(t),e,s=>t.slice(s[0],s[1]));return n.length===0?null:n}findAllUTF8Index(t,e){const n=this.allMatches(Tt.fromUTF8(t),e,s=>s.slice(0,2));return n.length===0?null:n}findAll(t,e){const n=this.allMatches(Tt.fromUTF16(t),e,s=>t.substring(s[0],s[1]));return n.length===0?null:n}findAllIndex(t,e){const n=this.allMatches(Tt.fromUTF16(t),e,s=>s.slice(0,2));return n.length===0?null:n}findAllUTF8Submatch(t,e){const n=this.allMatches(Tt.fromUTF8(t),e,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=t.slice(s[2*o],s[2*o+1]));return i});return n.length===0?null:n}findAllUTF8SubmatchIndex(t,e){const n=this.allMatches(Tt.fromUTF8(t),e);return n.length===0?null:n}findAllSubmatch(t,e){const n=this.allMatches(Tt.fromUTF16(t),e,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=t.substring(s[2*o],s[2*o+1]));return i});return n.length===0?null:n}findAllSubmatchIndex(t,e){const n=this.allMatches(Tt.fromUTF16(t),e);return n.length===0?null:n}}const Kt=class Kt{static quote(t){return tt.quoteMeta(t)}static compile(t,e=0){let n=t;if((e&Kt.CASE_INSENSITIVE)!==0&&(n=`(?i)${n}`),(e&Kt.DOTALL)!==0&&(n=`(?s)${n}`),(e&Kt.MULTILINE)!==0&&(n=`(?m)${n}`),(e&-32)!==0)throw new i3("Flags should only be a combination of MULTILINE, DOTALL, CASE_INSENSITIVE, DISABLE_UNICODE_GROUPS, LONGEST_MATCH");let s=B.PERL;(e&Kt.DISABLE_UNICODE_GROUPS)!==0&&(s&=-129);const i=new Kt(t,e);return i.re2Input=nn.compileImpl(n,s,(e&Kt.LONGEST_MATCH)!==0),i}static matches(t,e){return Kt.compile(t).matcher(e).matches()}static initTest(t,e,n){if(t==null)throw new Error("pattern is null");if(n==null)throw new Error("re2 is null");const s=new Kt(t,e);return s.re2Input=n,s}constructor(t,e){this.patternInput=t,this.flagsInput=e}reset(){this.re2Input.reset()}flags(){return this.flagsInput}pattern(){return this.patternInput}re2(){return this.re2Input}matches(t){return this.matcher(t).matches()}matcher(t){return Array.isArray(t)&&(t=Ui.utf8(t)),new o3(this,t)}split(t,e=0){const n=this.matcher(t),s=[];let i=0,o=0;for(;n.find();){if(o===0&&n.end()===0){o=n.end();continue}if(e>0&&s.length===e-1)break;if(o===n.start()){if(e===0){i+=1,o=n.end();continue}}else for(;i>0;)s.push(""),i-=1;s.push(n.substring(o,n.start())),o=n.end()}if(e===0&&o!==n.inputLength()){for(;i>0;)s.push(""),i-=1;s.push(n.substring(o,n.inputLength()))}return(e!==0||s.length===0)&&s.push(n.substring(o,n.inputLength())),s}toString(){return this.patternInput}groupCount(){return this.re2Input.numberOfCapturingGroups()}namedGroups(){return this.re2Input.namedGroups}equals(t){return this===t?!0:t===null||this.constructor!==t.constructor?!1:this.flagsInput===t.flagsInput&&this.patternInput===t.patternInput}};g(Kt,"CASE_INSENSITIVE",1),g(Kt,"DOTALL",2),g(Kt,"MULTILINE",4),g(Kt,"DISABLE_UNICODE_GROUPS",8),g(Kt,"LONGEST_MATCH",16);let _s=Kt;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}qt.UNAUTHENTICATED=new qt(null),qt.GOOGLE_CREDENTIALS=new qt("google-credentials-uid"),qt.FIRST_PARTY=new qt("first-party-uid"),qt.MOCK_USER=new qt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Rr="12.15.0";function d3(r){Rr=r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yn=new no("@firebase/firestore");function ir(){return Yn.logLevel}function U(r,...t){if(Yn.logLevel<=it.DEBUG){const e=t.map(c1);Yn.debug(`Firestore (${Rr}): ${r}`,...e)}}function ze(r,...t){if(Yn.logLevel<=it.ERROR){const e=t.map(c1);Yn.error(`Firestore (${Rr}): ${r}`,...e)}}function Ie(r,...t){if(Yn.logLevel<=it.WARN){const e=t.map(c1);Yn.warn(`Firestore (${Rr}): ${r}`,...e)}}function c1(r){if(typeof r=="string")return r;try{return(function(e){return JSON.stringify(e)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function G(r,t,e){let n="Unexpected state";typeof t=="string"?n=t:e=t,S2(r,n,e)}function S2(r,t,e){let n=`FIRESTORE (${Rr}) INTERNAL ASSERTION FAILED: ${t} (ID: ${r.toString(16)})`;if(e!==void 0)try{n+=" CONTEXT: "+JSON.stringify(e)}catch{n+=" CONTEXT: "+e}throw ze(n),new Error(n)}function H(r,t,e,n){let s="Unexpected state";typeof e=="string"?s=e:n=e,r||S2(t,s,n)}function Z(r,t){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class q extends Ae{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mn{constructor(){this.promise=new Promise(((t,e)=>{this.resolve=t,this.reject=e}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class C2{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class p3{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable((()=>e(qt.UNAUTHENTICATED)))}shutdown(){}}class m3{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable((()=>e(this.token.user)))}shutdown(){this.changeListener=null}}class g3{constructor(t){this.t=t,this.currentUser=qt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){H(this.o===void 0,42304);let n=this.i;const s=c=>this.i!==n?(n=this.i,e(c)):Promise.resolve();let i=new mn;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new mn,t.enqueueRetryable((()=>s(this.currentUser)))};const o=()=>{const c=i;t.enqueueRetryable((async()=>{await c.promise,await s(this.currentUser)}))},u=c=>{U("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit((c=>u(c))),setTimeout((()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?u(c):(U("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new mn)}}),0),o()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then((n=>this.i!==t?(U("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(H(typeof n.accessToken=="string",31837,{l:n}),new C2(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return H(t===null||typeof t=="string",2055,{h:t}),new qt(t)}}class _3{constructor(t,e,n){this.T=t,this.P=e,this.R=n,this.type="FirstParty",this.user=qt.FIRST_PARTY,this.I=new Map}A(){return this.R?this.R():null}get headers(){this.I.set("X-Goog-AuthUser",this.T);const t=this.A();return t&&this.I.set("Authorization",t),this.P&&this.I.set("X-Goog-Iam-Authorization-Token",this.P),this.I}}class E3{constructor(t,e,n){this.T=t,this.P=e,this.R=n}getToken(){return Promise.resolve(new _3(this.T,this.P,this.R))}start(t,e){t.enqueueRetryable((()=>e(qt.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class ul{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class y3{constructor(t,e){this.V=e,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,ee(t)&&t.settings.appCheckToken&&(this.p=t.settings.appCheckToken)}start(t,e){H(this.o===void 0,3512);const n=i=>{i.error!=null&&U("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.m;return this.m=i.token,U("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?e(i.token):Promise.resolve()};this.o=i=>{t.enqueueRetryable((()=>n(i)))};const s=i=>{U("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?s(i):U("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new ul(this.p));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then((e=>e?(H(typeof e.token=="string",44558,{tokenResult:e}),this.m=e.token,new ul(e.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function T3(r){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(r);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let n=0;n<r;n++)e[n]=Math.floor(256*Math.random());return e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l1{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=T3(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<e&&(n+=t.charAt(s[i]%62))}return n}}function st(r,t){return r<t?-1:r>t?1:0}function Na(r,t){const e=Math.min(r.length,t.length);for(let n=0;n<e;n++){const s=r.charAt(n),i=t.charAt(n);if(s!==i)return fa(s)===fa(i)?st(s,i):fa(s)?1:-1}return st(r.length,t.length)}const w3=55296,I3=57343;function fa(r){const t=r.charCodeAt(0);return t>=w3&&t<=I3}function mr(r,t,e){return r.length===t.length&&r.every(((n,s)=>e(n,t[s])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gr="__name__";class Se{constructor(t,e,n){e===void 0?e=0:e>t.length&&G(637,{offset:e,range:t.length}),n===void 0?n=t.length-e:n>t.length-e&&G(1746,{length:n,range:t.length-e}),this.segments=t,this.offset=e,this.len=n}get length(){return this.len}isEqual(t){return Se.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof Se?t.forEach((n=>{e.push(n)})):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,n=this.limit();e<n;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const n=Math.min(t.length,e.length);for(let s=0;s<n;s++){const i=Se.compareSegments(t.get(s),e.get(s));if(i!==0)return i}return st(t.length,e.length)}static compareSegments(t,e){const n=Se.isNumericId(t),s=Se.isNumericId(e);return n&&!s?-1:!n&&s?1:n&&s?Se.extractNumericId(t).compare(Se.extractNumericId(e)):Na(t,e)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return pn.fromString(t.substring(4,t.length-2))}}class lt extends Se{construct(t,e,n){return new lt(t,e,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const n of t){if(n.indexOf("//")>=0)throw new q(x.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);e.push(...n.split("/").filter((s=>s.length>0)))}return new lt(e)}static emptyPath(){return new lt([])}}const A3=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class bt extends Se{construct(t,e,n){return new bt(t,e,n)}static isValidIdentifier(t){return A3.test(t)}canonicalString(){return this.toArray().map((t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),bt.isValidIdentifier(t)||(t="`"+t+"`"),t))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===gr}static keyField(){return new bt([gr])}static fromServerFormat(t){const e=[];let n="",s=0;const i=()=>{if(n.length===0)throw new q(x.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(n),n=""};let o=!1;for(;s<t.length;){const u=t[s];if(u==="\\"){if(s+1===t.length)throw new q(x.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const c=t[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new q(x.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);n+=c,s+=2}else u==="`"?(o=!o,s++):u!=="."||o?(n+=u,s++):(i(),s++)}if(i(),o)throw new q(x.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new bt(e)}static emptyPath(){return new bt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z{constructor(t){this.path=t}static fromPath(t){return new z(lt.fromString(t))}static fromName(t){return new z(lt.fromString(t).popFirst(5))}static empty(){return new z(lt.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&lt.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return lt.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new z(new lt(t.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function v3(r,t,e){if(!e)throw new q(x.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${t}.`)}function R3(r,t,e,n){if(t===!0&&n===!0)throw new q(x.INVALID_ARGUMENT,`${r} and ${e} cannot be used together.`)}function cl(r){if(!z.isDocumentKey(r))throw new q(x.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function qs(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function h1(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const t=(function(n){return n.constructor?n.constructor.name:null})(r);return t?`a custom ${t} object`:"an object"}}return typeof r=="function"?"a function":G(12329,{type:typeof r})}function Qn(r,t){if("_delegate"in r&&(r=r._delegate),!(r instanceof t)){if(t.name===r.constructor.name)throw new q(x.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=h1(r);throw new q(x.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${e}`)}}return r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function It(r,t){const e={typeString:r};return t&&(e.value=t),e}function Hs(r,t){if(!qs(r))throw new q(x.INVALID_ARGUMENT,"JSON must be an object");let e;for(const n in t)if(t[n]){const s=t[n].typeString,i="value"in t[n]?{value:t[n].value}:void 0;if(!(n in r)){e=`JSON missing required field: '${n}'`;break}const o=r[n];if(s&&typeof o!==s){e=`JSON field '${n}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){e=`Expected '${n}' field to equal '${i.value}'`;break}}if(e)throw new q(x.INVALID_ARGUMENT,e);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ll=-62135596800,hl=1e6;class dt{static now(){return dt.fromMillis(Date.now())}static fromDate(t){return dt.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),n=Math.floor((t-1e3*e)*hl);return new dt(e,n)}constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new q(x.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new q(x.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<ll)throw new q(x.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new q(x.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/hl}_compareTo(t){return this.seconds===t.seconds?st(this.nanoseconds,t.nanoseconds):st(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:dt._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if(Hs(t,dt._jsonSchema))return new dt(t.seconds,t.nanoseconds)}valueOf(){const t=this.seconds-ll;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}dt._jsonSchemaVersion="firestore/timestamp/1.0",dt._jsonSchema={type:It("string",dt._jsonSchemaVersion),seconds:It("number"),nanoseconds:It("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{static fromTimestamp(t){return new X(t)}static min(){return new X(new dt(0,0))}static max(){return new X(new dt(253402300799,999999999))}constructor(t){this.timestamp=t}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Es=-1;function S3(r,t){const e=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=X.fromTimestamp(n===1e9?new dt(e+1,0):new dt(e,n));return new yn(s,z.empty(),t)}function C3(r){return new yn(r.readTime,r.key,Es)}class yn{constructor(t,e,n){this.readTime=t,this.documentKey=e,this.largestBatchId=n}static min(){return new yn(X.min(),z.empty(),Es)}static max(){return new yn(X.max(),z.empty(),Es)}}function P3(r,t){let e=r.readTime.compareTo(t.readTime);return e!==0?e:(e=z.comparator(r.documentKey,t.documentKey),e!==0?e:st(r.largestBatchId,t.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b3="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class N3{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((t=>t()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sr(r){if(r.code!==x.FAILED_PRECONDITION||r.message!==b3)throw r;U("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t((e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)}),(e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)}))}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&G(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new D(((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(t,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(e,i).next(n,s)}}))}toPromise(){return new Promise(((t,e)=>{this.next(t,e)}))}wrapUserFunction(t){try{const e=t();return e instanceof D?e:D.resolve(e)}catch(e){return D.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction((()=>t(e))):D.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction((()=>t(e))):D.reject(e)}static resolve(t){return new D(((e,n)=>{e(t)}))}static reject(t){return new D(((e,n)=>{n(t)}))}static waitFor(t){return new D(((e,n)=>{let s=0,i=0,o=!1;t.forEach((u=>{++s,u.next((()=>{++i,o&&i===s&&e()}),(c=>n(c)))})),o=!0,i===s&&e()}))}static or(t){let e=D.resolve(!1);for(const n of t)e=e.next((s=>s?D.resolve(s):n()));return e}static forEach(t,e){const n=[];return t.forEach(((s,i)=>{n.push(e.call(this,s,i))})),this.waitFor(n)}static mapArray(t,e){return new D(((n,s)=>{const i=t.length,o=new Array(i);let u=0;for(let c=0;c<i;c++){const h=c;e(t[h]).next((p=>{o[h]=p,++u,u===i&&n(o)}),(p=>s(p)))}}))}static doWhile(t,e){return new D(((n,s)=>{const i=()=>{t()===!0?e().next((()=>{i()}),s):n()};i()}))}}function O3(r){const t=r.match(/Android ([\d.]+)/i),e=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(e)}function Cr(r){return r.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lo{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=n=>this.ae(n),this.ue=n=>e.writeSequenceNumber(n))}ae(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.ue&&this.ue(t),t}}lo.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f1=-1;function ho(r){return r==null}function ys(r){return r===0&&1/r==-1/0}function k3(r){return typeof r=="number"&&Number.isInteger(r)&&!ys(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}function V3(r){return typeof r=="string"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P2="";function D3(r){let t="";for(let e=0;e<r.length;e++)t.length>0&&(t=fl(t)),t=x3(r.get(e),t);return fl(t)}function x3(r,t){let e=t;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":e+="";break;case P2:e+="";break;default:e+=i}}return e}function fl(r){return r+P2+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt{constructor(t,e){this.comparator=t,this.root=e||Lt.EMPTY}insert(t,e){return new pt(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,Lt.BLACK,null,null))}remove(t){return new pt(this.comparator,this.root.remove(t,this.comparator).copy(null,null,Lt.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const n=this.comparator(t,e.key);if(n===0)return e.value;n<0?e=e.left:n>0&&(e=e.right)}return null}indexOf(t){let e=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(t,n.key);if(s===0)return e+n.left.size;s<0?n=n.left:(e+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal(((e,n)=>(t(e,n),!1)))}toString(){const t=[];return this.inorderTraversal(((e,n)=>(t.push(`${e}:${n}`),!1))),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new gi(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new gi(this.root,t,this.comparator,!1)}getReverseIterator(){return new gi(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new gi(this.root,t,this.comparator,!0)}}class gi{constructor(t,e,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!t.isEmpty();)if(i=e?n(t.key,e):1,e&&s&&(i*=-1),i<0)t=this.isReverse?t.left:t.right;else{if(i===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class Lt{constructor(t,e,n,s,i){this.key=t,this.value=e,this.color=n??Lt.RED,this.left=s??Lt.EMPTY,this.right=i??Lt.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,n,s,i){return new Lt(t??this.key,e??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,n){let s=this;const i=n(t,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(t,e,n),null):i===0?s.copy(null,e,null,null,null):s.copy(null,null,null,null,s.right.insert(t,e,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Lt.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let n,s=this;if(e(t,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(t,e),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),e(t,s.key)===0){if(s.right.isEmpty())return Lt.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(t,e))}return s.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,Lt.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,Lt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw G(43730,{key:this.key,value:this.value});if(this.right.isRed())throw G(14113,{key:this.key,value:this.value});const t=this.left.check();if(t!==this.right.check())throw G(27949);return t+(this.isRed()?0:1)}}Lt.EMPTY=null,Lt.RED=!0,Lt.BLACK=!1;Lt.EMPTY=new class{constructor(){this.size=0}get key(){throw G(57766)}get value(){throw G(16141)}get color(){throw G(16727)}get left(){throw G(29726)}get right(){throw G(36894)}copy(t,e,n,s,i){return this}insert(t,e,n){return new Lt(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(t){this.comparator=t,this.data=new pt(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal(((e,n)=>(t(e),!1)))}forEachInRange(t,e){const n=this.data.getIteratorFrom(t[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,t[1])>=0)return;e(s.key)}}forEachWhile(t,e){let n;for(n=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();n.hasNext();)if(!t(n.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new dl(this.data.getIterator())}getIteratorFrom(t){return new dl(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach((n=>{e=e.add(n)})),e}isEqual(t){if(!(t instanceof vt)||this.size!==t.size)return!1;const e=this.data.getIterator(),n=t.data.getIterator();for(;e.hasNext();){const s=e.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const t=[];return this.forEach((e=>{t.push(e)})),t}toString(){const t=[];return this.forEach((e=>t.push(e))),"SortedSet("+t.toString()+")"}copy(t){const e=new vt(this.comparator);return e.data=t,e}}class dl{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce{constructor(t){this.fields=t,t.sort(bt.comparator)}static empty(){return new ce([])}unionWith(t){let e=new vt(bt.comparator);for(const n of this.fields)e=e.add(n);for(const n of t)e=e.add(n);return new ce(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return mr(this.fields,t.fields,((e,n)=>e.isEqual(n)))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bi(r){let t=0;for(const e in r)Object.prototype.hasOwnProperty.call(r,e)&&t++;return t}function Nn(r,t){for(const e in r)Object.prototype.hasOwnProperty.call(r,e)&&t(e,r[e])}function L3(r,t){const e=[];for(const n in r)Object.prototype.hasOwnProperty.call(r,n)&&e.push(t(r[n],n,r));return e}function b2(r){for(const t in r)if(Object.prototype.hasOwnProperty.call(r,t))return!1;return!0}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N2 extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St{constructor(t){this.binaryString=t}static fromBase64String(t){const e=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new N2("Invalid base64 string: "+i):i}})(t);return new St(e)}static fromUint8Array(t){const e=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(t);return new St(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(e){return btoa(e)})(this.binaryString)}toUint8Array(){return(function(e){const n=new Uint8Array(e.length);for(let s=0;s<e.length;s++)n[s]=e.charCodeAt(s);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return st(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}St.EMPTY_BYTE_STRING=new St("");const M3=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Tn(r){if(H(!!r,39018),typeof r=="string"){let t=0;const e=M3.exec(r);if(H(!!e,46558,{timestamp:r}),e[1]){let s=e[1];s=(s+"000000000").substr(0,9),t=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:t}}return{seconds:gt(r.seconds),nanos:gt(r.nanos)}}function gt(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function wn(r){return typeof r=="string"?St.fromBase64String(r):St.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const O2="server_timestamp",k2="__type__",V2="__previous_value__",D2="__local_write_time__";function fo(r){return(r?.mapValue?.fields||{})[k2]?.stringValue===O2}function js(r){const t=r.mapValue.fields[V2];return fo(t)?js(t):t}function _r(r){const t=Tn(r.mapValue.fields[D2].timestampValue);return new dt(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F3{constructor(t,e,n,s,i,o,u,c,h,p,_){this.databaseId=t,this.appId=e,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=u,this.longPollingOptions=c,this.useFetchStreams=h,this.isUsingEmulator=p,this.apiKey=_}}const $i="(default)";class Ts{constructor(t,e){this.projectId=t,this.database=e||$i}static empty(){return new Ts("","")}get isDefaultDatabase(){return this.database===$i}isEqual(t){return t instanceof Ts&&t.projectId===this.projectId&&t.database===this.database}}function U3(r,t){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new q(x.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ts(r.options.projectId,t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x2="__type__",B3="__max__",_i={mapValue:{}},L2="__vector__",ws="value",Er={nullValue:"NULL_VALUE"},se={booleanValue:!0},Dt={booleanValue:!1};function Ct(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?fo(r)?4:$3(r)?9007199254740991:qi(r)?10:11:G(28295,{value:r})}function ge(r,t,e){if(r===t)return!0;const n=Ct(r);if(n!==Ct(t))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===t.booleanValue;case 4:return _r(r).isEqual(_r(t));case 3:return(function(i,o){if(typeof i.timestampValue=="string"&&typeof o.timestampValue=="string"&&i.timestampValue.length===o.timestampValue.length)return i.timestampValue===o.timestampValue;const u=Tn(i.timestampValue),c=Tn(o.timestampValue);return u.seconds===c.seconds&&u.nanos===c.nanos})(r,t);case 5:return r.stringValue===t.stringValue;case 6:return(function(i,o){return wn(i.bytesValue).isEqual(wn(o.bytesValue))})(r,t);case 7:return r.referenceValue===t.referenceValue;case 8:return(function(i,o){return gt(i.geoPointValue.latitude)===gt(o.geoPointValue.latitude)&&gt(i.geoPointValue.longitude)===gt(o.geoPointValue.longitude)})(r,t);case 2:return(function(i,o,u){if("integerValue"in i&&"integerValue"in o)return gt(i.integerValue)===gt(o.integerValue);let c,h;if("doubleValue"in i&&"doubleValue"in o)c=gt(i.doubleValue),h=gt(o.doubleValue);else{if(!u?.Ee)return!1;c=gt(i.integerValue??i.doubleValue),h=gt(o.integerValue??o.doubleValue)}return c===h?!!u?.he||ys(c)===ys(h):!!(u===void 0||u.Te)&&isNaN(c)&&isNaN(h)})(r,t,e);case 9:return mr(r.arrayValue.values||[],t.arrayValue.values||[],((s,i)=>ge(s,i,e)));case 10:case 11:return(function(i,o,u){const c=i.mapValue.fields||{},h=o.mapValue.fields||{};if(Bi(c)!==Bi(h))return!1;for(const p in c)if(c.hasOwnProperty(p)&&(h[p]===void 0||!ge(c[p],h[p],u)))return!1;return!0})(r,t,e);default:return G(52216,{left:r})}}function Is(r,t){return(r.values||[]).find((e=>ge(e,t)))!==void 0}function ie(r,t){if(r===t)return 0;const e=Ct(r),n=Ct(t);if(e!==n)return st(e,n);switch(e){case 0:case 9007199254740991:return 0;case 1:return st(r.booleanValue,t.booleanValue);case 2:return(function(i,o){const u=gt(i.integerValue||i.doubleValue),c=gt(o.integerValue||o.doubleValue);return u<c?-1:u>c?1:u===c?0:isNaN(u)?isNaN(c)?0:-1:1})(r,t);case 3:return pl(r.timestampValue,t.timestampValue);case 4:return pl(_r(r),_r(t));case 5:return Na(r.stringValue,t.stringValue);case 6:return(function(i,o){const u=wn(i),c=wn(o);return u.compareTo(c)})(r.bytesValue,t.bytesValue);case 7:return(function(i,o){const u=i.split("/"),c=o.split("/");for(let h=0;h<u.length&&h<c.length;h++){const p=st(u[h],c[h]);if(p!==0)return p}return st(u.length,c.length)})(r.referenceValue,t.referenceValue);case 8:return(function(i,o){const u=st(gt(i.latitude),gt(o.latitude));return u!==0?u:st(gt(i.longitude),gt(o.longitude))})(r.geoPointValue,t.geoPointValue);case 9:return ml(r.arrayValue,t.arrayValue);case 10:return(function(i,o){const u=i.fields||{},c=o.fields||{},h=u[ws]?.arrayValue,p=c[ws]?.arrayValue,_=st(h?.values?.length||0,p?.values?.length||0);return _!==0?_:ml(h,p)})(r.mapValue,t.mapValue);case 11:return(function(i,o){if(i===_i.mapValue&&o===_i.mapValue)return 0;if(i===_i.mapValue)return 1;if(o===_i.mapValue)return-1;const u=i.fields||{},c=Object.keys(u),h=o.fields||{},p=Object.keys(h);c.sort(),p.sort();for(let _=0;_<c.length&&_<p.length;++_){const v=Na(c[_],p[_]);if(v!==0)return v;const N=ie(u[c[_]],h[p[_]]);if(N!==0)return N}return st(c.length,p.length)})(r.mapValue,t.mapValue);default:throw G(23264,{Pe:e})}}function pl(r,t){if(typeof r=="string"&&typeof t=="string"&&r.length===t.length)return st(r,t);const e=Tn(r),n=Tn(t),s=st(e.seconds,n.seconds);return s!==0?s:st(e.nanos,n.nanos)}function ml(r,t){const e=r.values||[],n=t.values||[];for(let s=0;s<e.length&&s<n.length;++s){const i=ie(e[s],n[s]);if(i!==void 0&&i!==0)return i}return st(e.length,n.length)}function yr(r){return Oa(r)}function Oa(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(e){const n=Tn(e);return`time(${n.seconds},${n.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(e){return wn(e).toBase64()})(r.bytesValue):"referenceValue"in r?(function(e){return z.fromName(e).toString()})(r.referenceValue):"geoPointValue"in r?(function(e){return`geo(${e.latitude},${e.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(e){let n="[",s=!0;for(const i of e.values||[])s?s=!1:n+=",",n+=Oa(i);return n+"]"})(r.arrayValue):"mapValue"in r?(function(e){const n=Object.keys(e.fields||{}).sort();let s="{",i=!0;for(const o of n)i?i=!1:s+=",",s+=`${o}:${Oa(e.fields[o])}`;return s+"}"})(r.mapValue):G(61005,{value:r})}function Si(r){switch(Ct(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=js(r);return t?16+Si(t):16;case 5:return 2*r.stringValue.length;case 6:return wn(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(n){return(n.values||[]).reduce(((s,i)=>s+Si(i)),0)})(r.arrayValue);case 10:case 11:return(function(n){let s=0;return Nn(n.fields,((i,o)=>{s+=i.length+Si(o)})),s})(r.mapValue);default:throw G(13486,{value:r})}}function Ce(r){return!!r&&"integerValue"in r}function $n(r){return!!r&&"doubleValue"in r}function In(r){return Ce(r)||$n(r)}function Tr(r){return!!r&&"arrayValue"in r}function le(r){return!!r&&"nullValue"in r}function oe(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function qn(r){return!!r&&"mapValue"in r}function qi(r){return(r?.mapValue?.fields||{})[x2]?.stringValue===L2}function ka(r){return(r?.mapValue?.fields||{})[ws]?.arrayValue}function is(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const t={mapValue:{fields:{}}};return Nn(r.mapValue.fields,((e,n)=>t.mapValue.fields[e]=is(n))),t}if(r.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(r.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=is(r.arrayValue.values[e]);return t}return{...r}}function $3(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===B3}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yt{constructor(t){this.value=t}static empty(){return new Yt({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let n=0;n<t.length-1;++n)if(e=(e.mapValue.fields||{})[t.get(n)],!qn(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=is(e)}setAll(t){let e=bt.emptyPath(),n={},s=[];t.forEach(((o,u)=>{if(!e.isImmediateParentOf(u)){const c=this.getFieldsMap(e);this.applyChanges(c,n,s),n={},s=[],e=u.popLast()}o?n[u.lastSegment()]=is(o):s.push(u.lastSegment())}));const i=this.getFieldsMap(e);this.applyChanges(i,n,s)}delete(t){const e=this.field(t.popLast());qn(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return ge(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let n=0;n<t.length;++n){let s=e.mapValue.fields[t.get(n)];qn(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},e.mapValue.fields[t.get(n)]=s),e=s}return e.mapValue.fields}applyChanges(t,e,n){Nn(e,((s,i)=>t[s]=i));for(const s of n)delete t[s]}clone(){return new Yt(is(this.value))}}function M2(r){const t=[];return Nn(r.fields,((e,n)=>{const s=new bt([e]);if(qn(n)){const i=M2(n.mapValue).fields;if(i.length===0)t.push(s);else for(const o of i)t.push(s.child(o))}else t.push(s)})),new ce(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function po(r,t){if(r.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ys(t)?"-0":t}}function d1(r){return{integerValue:""+r}}function p1(r,t,e){return Number.isInteger(t)&&e?.preferIntegers||k3(t)?d1(t):po(r,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mo{constructor(){this._=void 0}}function q3(r,t,e){return r instanceof As?(function(s,i){const o={fields:{[k2]:{stringValue:O2},[D2]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&fo(i)&&(i=js(i)),i&&(o.fields[V2]=i),{mapValue:o}})(e,t):r instanceof vs?U2(r,t):r instanceof Rs?B2(r,t):r instanceof Ss?(function(s,i){const o=F2(s,i),u=Gi(o)+Gi(s.Re);return Ce(o)&&Ce(s.Re)?d1(u):po(s.serializer,u)})(r,t):r instanceof Hi?(function(s,i){return gl(s,i,Math.min)})(r,t):r instanceof ji?(function(s,i){return gl(s,i,Math.max)})(r,t):void 0}function H3(r,t,e){return r instanceof vs?U2(r,t):r instanceof Rs?B2(r,t):e}function F2(r,t){return r instanceof Ss?In(t)?t:{integerValue:0}:null}class As extends mo{}class vs extends mo{constructor(t){super(),this.elements=t}}function U2(r,t){const e=$2(t);for(const n of r.elements)e.some((s=>ge(s,n)))||e.push(n);return{arrayValue:{values:e}}}class Rs extends mo{constructor(t){super(),this.elements=t}}function B2(r,t){let e=$2(t);for(const n of r.elements)e=e.filter((s=>!ge(s,n)));return{arrayValue:{values:e}}}class m1 extends mo{constructor(t,e){super(),this.serializer=t,this.Re=e}}class Ss extends m1{}class Hi extends m1{}class ji extends m1{}function gl(r,t,e){if(!In(t))return r.Re;const n=e(Gi(t),Gi(r.Re));return Ce(t)&&Ce(r.Re)?d1(n):po(r.serializer,n)}function Gi(r){return gt(r.integerValue||r.doubleValue)}function $2(r){return Tr(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j3{constructor(t,e){this.field=t,this.transform=e}}function G3(r,t){return r.field.isEqual(t.field)&&(function(n,s){return n instanceof vs&&s instanceof vs||n instanceof Rs&&s instanceof Rs?mr(n.elements,s.elements,ge):n instanceof Ss&&s instanceof Ss||n instanceof Hi&&s instanceof Hi||n instanceof ji&&s instanceof ji?ge(n.Re,s.Re):n instanceof As&&s instanceof As})(r.transform,t.transform)}class z3{constructor(t,e){this.version=t,this.transformResults=e}}class Ne{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new Ne}static exists(t){return new Ne(void 0,t)}static updateTime(t){return new Ne(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function Ci(r,t){return r.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(r.updateTime):r.exists===void 0||r.exists===t.isFoundDocument()}class go{}function q2(r,t){if(!r.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return r.isNoDocument()?new j2(r.key,Ne.none()):new Gs(r.key,r.data,Ne.none());{const e=r.data,n=Yt.empty();let s=new vt(bt.comparator);for(let i of t.fields)if(!s.has(i)){let o=e.field(i);o===null&&i.length>1&&(i=i.popLast(),o=e.field(i)),o===null?n.delete(i):n.set(i,o),s=s.add(i)}return new On(r.key,n,new ce(s.toArray()),Ne.none())}}function W3(r,t,e){r instanceof Gs?(function(s,i,o){const u=s.value.clone(),c=El(s.fieldTransforms,i,o.transformResults);u.setAll(c),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(r,t,e):r instanceof On?(function(s,i,o){if(!Ci(s.precondition,i))return void i.convertToUnknownDocument(o.version);const u=El(s.fieldTransforms,i,o.transformResults),c=i.data;c.setAll(H2(s)),c.setAll(u),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()})(r,t,e):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,t,e)}function os(r,t,e,n){return r instanceof Gs?(function(i,o,u,c){if(!Ci(i.precondition,o))return u;const h=i.value.clone(),p=yl(i.fieldTransforms,c,o);return h.setAll(p),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null})(r,t,e,n):r instanceof On?(function(i,o,u,c){if(!Ci(i.precondition,o))return u;const h=yl(i.fieldTransforms,c,o),p=o.data;return p.setAll(H2(i)),p.setAll(h),o.convertToFoundDocument(o.version,p).setHasLocalMutations(),u===null?null:u.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((_=>_.field)))})(r,t,e,n):(function(i,o,u){return Ci(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):u})(r,t,e)}function K3(r,t){let e=null;for(const n of r.fieldTransforms){const s=t.data.field(n.field),i=F2(n.transform,s||null);i!=null&&(e===null&&(e=Yt.empty()),e.set(n.field,i))}return e||null}function _l(r,t){return r.type===t.type&&!!r.key.isEqual(t.key)&&!!r.precondition.isEqual(t.precondition)&&!!(function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&mr(n,s,((i,o)=>G3(i,o)))})(r.fieldTransforms,t.fieldTransforms)&&(r.type===0?r.value.isEqual(t.value):r.type!==1||r.data.isEqual(t.data)&&r.fieldMask.isEqual(t.fieldMask))}class Gs extends go{constructor(t,e,n,s=[]){super(),this.key=t,this.value=e,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class On extends go{constructor(t,e,n,s,i=[]){super(),this.key=t,this.data=e,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function H2(r){const t=new Map;return r.fieldMask.fields.forEach((e=>{if(!e.isEmpty()){const n=r.data.field(e);t.set(e,n)}})),t}function El(r,t,e){const n=new Map;H(r.length===e.length,32656,{Ie:e.length,Ae:r.length});for(let s=0;s<e.length;s++){const i=r[s],o=i.transform,u=t.data.field(i.field);n.set(i.field,H3(o,u,e[s]))}return n}function yl(r,t,e){const n=new Map;for(const s of r){const i=s.transform,o=e.data.field(s.field);n.set(s.field,q3(i,o,t))}return n}class j2 extends go{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Y3 extends go{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zi{constructor(t,e){this.position=t,this.inclusive=e}}function Tl(r,t,e){let n=0;for(let s=0;s<r.position.length;s++){const i=t[s],o=r.position[s];if(i.field.isKeyField()?n=z.comparator(z.fromName(o.referenceValue),e.key):n=ie(o,e.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function wl(r,t){if(r===null)return t===null;if(t===null||r.inclusive!==t.inclusive||r.position.length!==t.position.length)return!1;for(let e=0;e<r.position.length;e++)if(!ge(r.position[e],t.position[e]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G2{}class Nt extends G2{constructor(t,e,n){super(),this.field=t,this.op=e,this.value=n}static create(t,e,n){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,n):new X3(t,e,n):e==="array-contains"?new t9(t,n):e==="in"?new e9(t,n):e==="not-in"?new n9(t,n):e==="array-contains-any"?new r9(t,n):new Nt(t,e,n)}static createKeyFieldInFilter(t,e,n){return e==="in"?new J3(t,n):new Z3(t,n)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&e.nullValue===void 0&&this.matchesComparison(ie(e,this.value)):e!==null&&Ct(this.value)===Ct(e)&&this.matchesComparison(ie(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return G(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class xe extends G2{constructor(t,e){super(),this.filters=t,this.op=e,this.Ve=null}static create(t,e){return new xe(t,e)}matches(t){return z2(this)?this.filters.find((e=>!e.matches(t)))===void 0:this.filters.find((e=>e.matches(t)))!==void 0}getFlattenedFilters(){return this.Ve!==null||(this.Ve=this.filters.reduce(((t,e)=>t.concat(e.getFlattenedFilters())),[])),this.Ve}getFilters(){return Object.assign([],this.filters)}}function z2(r){return r.op==="and"}function W2(r){return Q3(r)&&z2(r)}function Q3(r){for(const t of r.filters)if(t instanceof xe)return!1;return!0}function Va(r){if(r instanceof Nt)return r.field.canonicalString()+r.op.toString()+yr(r.value);if(W2(r))return r.filters.map((t=>Va(t))).join(",");{const t=r.filters.map((e=>Va(e))).join(",");return`${r.op}(${t})`}}function K2(r,t){return r instanceof Nt?(function(n,s){return s instanceof Nt&&n.op===s.op&&n.field.isEqual(s.field)&&ge(n.value,s.value)})(r,t):r instanceof xe?(function(n,s){return s instanceof xe&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce(((i,o,u)=>i&&K2(o,s.filters[u])),!0):!1})(r,t):void G(19439)}function Y2(r){return r instanceof Nt?(function(e){return`${e.field.canonicalString()} ${e.op} ${yr(e.value)}`})(r):r instanceof xe?(function(e){return e.op.toString()+" {"+e.getFilters().map(Y2).join(" ,")+"}"})(r):"Filter"}class X3 extends Nt{constructor(t,e,n){super(t,e,n),this.key=z.fromName(n.referenceValue)}matches(t){const e=z.comparator(t.key,this.key);return this.matchesComparison(e)}}class J3 extends Nt{constructor(t,e){super(t,"in",e),this.keys=Q2("in",e)}matches(t){return this.keys.some((e=>e.isEqual(t.key)))}}class Z3 extends Nt{constructor(t,e){super(t,"not-in",e),this.keys=Q2("not-in",e)}matches(t){return!this.keys.some((e=>e.isEqual(t.key)))}}function Q2(r,t){return(t.arrayValue?.values||[]).map((e=>z.fromName(e.referenceValue)))}class t9 extends Nt{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return Tr(e)&&Is(e.arrayValue,this.value)}}class e9 extends Nt{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&Is(this.value.arrayValue,e)}}class n9 extends Nt{constructor(t,e){super(t,"not-in",e)}matches(t){if(Is(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&e.nullValue===void 0&&!Is(this.value.arrayValue,e)}}class r9 extends Nt{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!Tr(e)||!e.arrayValue.values)&&e.arrayValue.values.some((n=>Is(this.value.arrayValue,n)))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi{constructor(t,e="asc"){this.field=t,this.dir=e}}function s9(r,t){return r.dir===t.dir&&r.field.isEqual(t.field)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(t,e,n,s,i,o,u){this.key=t,this.documentType=e,this.version=n,this.readTime=s,this.createTime=i,this.data=o,this.documentState=u}static newInvalidDocument(t){return new Ht(t,0,X.min(),X.min(),X.min(),Yt.empty(),0)}static newFoundDocument(t,e,n,s){return new Ht(t,1,e,X.min(),n,s,0)}static newNoDocument(t,e){return new Ht(t,2,e,X.min(),X.min(),Yt.empty(),0)}static newUnknownDocument(t,e){return new Ht(t,3,e,X.min(),X.min(),Yt.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(X.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=Yt.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=Yt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=X.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof Ht&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new Ht(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i9{constructor(t,e=null,n=[],s=[],i=null,o=null,u=null){this.path=t,this.collectionGroup=e,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=o,this.endAt=u,this.de=null}}function Il(r,t=null,e=[],n=[],s=null,i=null,o=null){return new i9(r,t,e,n,s,i,o)}function X2(r){const t=Z(r);if(t.de===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map((n=>Va(n))).join(","),e+="|ob:",e+=t.orderBy.map((n=>(function(i){return i.field.canonicalString()+i.dir})(n))).join(","),ho(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map((n=>yr(n))).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map((n=>yr(n))).join(",")),t.de=e}return t.de}function J2(r,t){if(r.limit!==t.limit||r.orderBy.length!==t.orderBy.length)return!1;for(let e=0;e<r.orderBy.length;e++)if(!s9(r.orderBy[e],t.orderBy[e]))return!1;if(r.filters.length!==t.filters.length)return!1;for(let e=0;e<r.filters.length;e++)if(!K2(r.filters[e],t.filters[e]))return!1;return r.collectionGroup===t.collectionGroup&&!!r.path.isEqual(t.path)&&!!wl(r.startAt,t.startAt)&&wl(r.endAt,t.endAt)}function Un(r){return!!r.isCorePipeline}function Z2(r){return!!r.path&&z.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _o{constructor(t,e=null,n=[],s=[],i=null,o="F",u=null,c=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=o,this.startAt=u,this.endAt=c,this.fe=null,this.me=null,this.pe=null,this.startAt,this.endAt}}function o9(r,t,e,n,s,i,o,u){return new _o(r,t,e,n,s,i,o,u)}function g1(r){return new _o(r)}function Al(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function a9(r){return z.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function u9(r){return r.collectionGroup!==null}function as(r){const t=Z(r);if(t.fe===null){t.fe=[];const e=new Set;for(const i of t.explicitOrderBy)t.fe.push(i),e.add(i.field.canonicalString());const n=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(o){let u=new vt(bt.comparator);return o.filters.forEach((c=>{c.getFlattenedFilters().forEach((h=>{h.isInequality()&&(u=u.add(h.field))}))})),u})(t).forEach((i=>{e.has(i.canonicalString())||i.isKeyField()||t.fe.push(new Wi(i,n))})),e.has(bt.keyField().canonicalString())||t.fe.push(new Wi(bt.keyField(),n))}return t.fe}function Oe(r){const t=Z(r);return t.me||(t.me=c9(t,as(r))),t.me}function c9(r,t){if(r.limitType==="F")return Il(r.path,r.collectionGroup,t,r.filters,r.limit,r.startAt,r.endAt);{t=t.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new Wi(s.field,i)}));const e=r.endAt?new zi(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new zi(r.startAt.position,r.startAt.inclusive):null;return Il(r.path,r.collectionGroup,t,r.filters,r.limit,e,n)}}function Da(r,t,e){return new _o(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),t,e,r.startAt,r.endAt)}function l9(r,t){return J2(Oe(r),Oe(t))&&r.limitType===t.limitType}function us(r){return`Query(target=${(function(e){let n=e.path.canonicalString();return e.collectionGroup!==null&&(n+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(n+=`, filters: [${e.filters.map((s=>Y2(s))).join(", ")}]`),ho(e.limit)||(n+=", limit: "+e.limit),e.orderBy.length>0&&(n+=`, orderBy: [${e.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),e.startAt&&(n+=", startAt: ",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map((s=>yr(s))).join(",")),e.endAt&&(n+=", endAt: ",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map((s=>yr(s))).join(",")),`Target(${n})`})(Oe(r))}; limitType=${r.limitType})`}function Eo(r,t){return t.isFoundDocument()&&(function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):z.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)})(r,t)&&(function(n,s){for(const i of as(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(r,t)&&(function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0})(r,t)&&(function(n,s){return!(n.startAt&&!(function(o,u,c){const h=Tl(o,u,c);return o.inclusive?h<=0:h<0})(n.startAt,as(n),s)||n.endAt&&!(function(o,u,c){const h=Tl(o,u,c);return o.inclusive?h>=0:h>0})(n.endAt,as(n),s))})(r,t)}function _1(r){return(t,e)=>{let n=!1;for(const s of as(r)){const i=h9(s,t,e);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function h9(r,t,e){const n=r.field.isKeyField()?z.comparator(t.key,e.key):(function(i,o,u){const c=o.data.field(i),h=u.data.field(i);return c!==null&&h!==null?ie(c,h):G(42886)})(r.field,t,e);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return G(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f9{constructor(t,e){this.count=t,this.unchangedNames=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var wt,ot;function d9(r){switch(r){case x.OK:return G(64938);case x.CANCELLED:case x.UNKNOWN:case x.DEADLINE_EXCEEDED:case x.RESOURCE_EXHAUSTED:case x.INTERNAL:case x.UNAVAILABLE:case x.UNAUTHENTICATED:return!1;case x.INVALID_ARGUMENT:case x.NOT_FOUND:case x.ALREADY_EXISTS:case x.PERMISSION_DENIED:case x.FAILED_PRECONDITION:case x.ABORTED:case x.OUT_OF_RANGE:case x.UNIMPLEMENTED:case x.DATA_LOSS:return!0;default:return G(15467,{code:r})}}function t6(r){if(r===void 0)return ze("GRPC error has no .code"),x.UNKNOWN;switch(r){case wt.OK:return x.OK;case wt.CANCELLED:return x.CANCELLED;case wt.UNKNOWN:return x.UNKNOWN;case wt.DEADLINE_EXCEEDED:return x.DEADLINE_EXCEEDED;case wt.RESOURCE_EXHAUSTED:return x.RESOURCE_EXHAUSTED;case wt.INTERNAL:return x.INTERNAL;case wt.UNAVAILABLE:return x.UNAVAILABLE;case wt.UNAUTHENTICATED:return x.UNAUTHENTICATED;case wt.INVALID_ARGUMENT:return x.INVALID_ARGUMENT;case wt.NOT_FOUND:return x.NOT_FOUND;case wt.ALREADY_EXISTS:return x.ALREADY_EXISTS;case wt.PERMISSION_DENIED:return x.PERMISSION_DENIED;case wt.FAILED_PRECONDITION:return x.FAILED_PRECONDITION;case wt.ABORTED:return x.ABORTED;case wt.OUT_OF_RANGE:return x.OUT_OF_RANGE;case wt.UNIMPLEMENTED:return x.UNIMPLEMENTED;case wt.DATA_LOSS:return x.DATA_LOSS;default:return G(39323,{code:r})}}(ot=wt||(wt={}))[ot.OK=0]="OK",ot[ot.CANCELLED=1]="CANCELLED",ot[ot.UNKNOWN=2]="UNKNOWN",ot[ot.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ot[ot.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ot[ot.NOT_FOUND=5]="NOT_FOUND",ot[ot.ALREADY_EXISTS=6]="ALREADY_EXISTS",ot[ot.PERMISSION_DENIED=7]="PERMISSION_DENIED",ot[ot.UNAUTHENTICATED=16]="UNAUTHENTICATED",ot[ot.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ot[ot.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ot[ot.ABORTED=10]="ABORTED",ot[ot.OUT_OF_RANGE=11]="OUT_OF_RANGE",ot[ot.UNIMPLEMENTED=12]="UNIMPLEMENTED",ot[ot.INTERNAL=13]="INTERNAL",ot[ot.UNAVAILABLE=14]="UNAVAILABLE",ot[ot.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zn{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),n=this.inner[e];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,t))return i}}has(t){return this.get(t)!==void 0}set(t,e){const n=this.mapKeyFn(t),s=this.inner[n];if(s===void 0)return this.inner[n]=[[t,e]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],t))return void(s[i]=[t,e]);s.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),n=this.inner[e];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],t))return n.length===1?delete this.inner[e]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(t){Nn(this.inner,((e,n)=>{for(const[s,i]of n)t(s,i)}))}isEmpty(){return b2(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const p9=new pt(z.comparator);function ne(){return p9}const e6=new pt(z.comparator);function or(...r){let t=e6;for(const e of r)t=t.insert(e.key,e);return t}function n6(r){let t=e6;return r.forEach(((e,n)=>t=t.insert(e,n.overlayedDocument))),t}function ln(){return cs()}function r6(){return cs()}function cs(){return new Zn((r=>r.toString()),((r,t)=>r.isEqual(t)))}const m9=new pt(z.comparator),g9=new vt(z.comparator);function rt(...r){let t=g9;for(const e of r)t=t.add(e);return t}const _9=new vt(st);function E9(){return _9}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function y9(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const T9=new pn([4294967295,4294967295],0);function vl(r){const t=y9().encode(r),e=new y2;return e.update(t),new Uint8Array(e.digest())}function Rl(r){const t=new DataView(r.buffer),e=t.getUint32(0,!0),n=t.getUint32(4,!0),s=t.getUint32(8,!0),i=t.getUint32(12,!0);return[new pn([e,n],0),new pn([s,i],0)]}class E1{constructor(t,e,n){if(this.bitmap=t,this.padding=e,this.hashCount=n,e<0||e>=8)throw new Zr(`Invalid padding: ${e}`);if(n<0)throw new Zr(`Invalid hash count: ${n}`);if(t.length>0&&this.hashCount===0)throw new Zr(`Invalid hash count: ${n}`);if(t.length===0&&e!==0)throw new Zr(`Invalid padding when bitmap length is 0: ${e}`);this.ge=8*t.length-e,this.ye=pn.fromNumber(this.ge)}we(t,e,n){let s=t.add(e.multiply(pn.fromNumber(n)));return s.compare(T9)===1&&(s=new pn([s.getBits(0),s.getBits(1)],0)),s.modulo(this.ye).toNumber()}be(t){return!!(this.bitmap[Math.floor(t/8)]&1<<t%8)}mightContain(t){if(this.ge===0)return!1;const e=vl(t),[n,s]=Rl(e);for(let i=0;i<this.hashCount;i++){const o=this.we(n,s,i);if(!this.be(o))return!1}return!0}static create(t,e,n){const s=t%8==0?0:8-t%8,i=new Uint8Array(Math.ceil(t/8)),o=new E1(i,s,e);return n.forEach((u=>o.insert(u))),o}insert(t){if(this.ge===0)return;const e=vl(t),[n,s]=Rl(e);for(let i=0;i<this.hashCount;i++){const o=this.we(n,s,i);this.ve(o)}}ve(t){const e=Math.floor(t/8),n=t%8;this.bitmap[e]|=1<<n}}class Zr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zs{constructor(t,e,n,s,i,o){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=n,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(t,e,n){const s=new Map;return s.set(t,Ws.createSynthesizedTargetChangeForCurrentChange(t,e,n)),new zs(X.min(),s,new pt(st),ne(),ne(),rt())}}class Ws{constructor(t,e,n,s,i){this.resumeToken=t,this.current=e,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(t,e,n){return new Ws(n,e,rt(),rt(),rt())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pi{constructor(t,e,n,s){this.Se=t,this.removedTargetIds=e,this.key=n,this.De=s}}class s6{constructor(t,e){this.targetId=t,this.xe=e}}class i6{constructor(t,e,n=St.EMPTY_BYTE_STRING,s=null){this.state=t,this.targetIds=e,this.resumeToken=n,this.cause=s}}class Sl{constructor(t){this.targetId=t,this.Ce=0,this.Fe=Cl(),this.Oe=St.EMPTY_BYTE_STRING,this.Me=!1,this.Ne=!0}get current(){return this.Me}get resumeToken(){return this.Oe}get Le(){return this.Ce!==0}get Be(){return this.Ne}Ue(t){t.approximateByteSize()>0&&(this.Ne=!0,this.Oe=t)}ke(){let t=rt(),e=rt(),n=rt();return this.Fe.forEach(((s,i)=>{switch(i){case 0:t=t.add(s);break;case 2:e=e.add(s);break;case 1:n=n.add(s);break;default:G(38017,{changeType:i})}})),new Ws(this.Oe,this.Me,t,e,n)}qe(){this.Ne=!1,this.Fe=Cl()}$e(t,e){this.Ne=!0,this.Fe=this.Fe.insert(t,e)}Ke(t){this.Ne=!0,this.Fe=this.Fe.remove(t)}We(){this.Ce+=1}Qe(){this.Ce-=1,H(this.Ce>=0,3241,{Ce:this.Ce,targetId:this.targetId})}Ge(){this.Ne=!0,this.Me=!0}}const Kr="WatchChangeAggregator";class w9{constructor(t){this.ze=t,this.je=new Map,this.He=ne(),this.Je=Ei(),this.Ye=ne(),this.Ze=Ei(),this.Xe=new pt(st)}et(t){for(const e of t.Se)t.De&&t.De.isFoundDocument()?this.tt(e,t.De):this.nt(e,t.key,t.De);for(const e of t.removedTargetIds)this.nt(e,t.key,t.De)}rt(t){this.forEachTarget(t,(e=>{const n=this.je.get(e);if(n)switch(t.state){case 0:this.it(e)&&n.Ue(t.resumeToken);break;case 1:n.Qe(),n.Le||n.qe(),n.Ue(t.resumeToken);break;case 2:n.Qe(),n.Le||this.removeTarget(e);break;case 3:this.it(e)&&(n.Ge(),n.Ue(t.resumeToken));break;case 4:this.it(e)&&(this.st(e),n.Ue(t.resumeToken));break;default:G(56790,{state:t.state})}else U(Kr,`handleTargetChange received targetChange for untracked target ID (${e}) with state (${t.state})`)}))}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.je.forEach(((n,s)=>{this.it(s)&&e(s)}))}_t(t){return Un(t)?t.getPipelineSourceType()==="documents"&&t.getPipelineDocuments()?.length===1:Z2(t)}ot(t){const e=t.targetId,n=t.xe.count,s=this.ut(e);if(s){const i=s.target;if(this._t(i))if(n===0){const o=new z(Un(i)?lt.fromString(i.getPipelineDocuments()[0]):i.path);this.nt(e,o,Ht.newNoDocument(o,X.min()))}else H(n===1,20013,"Single document existence filter with count: "+n);else{const o=this.ct(e);if(o!==n){const u=this.lt(t),c=u?this.Et(u,t,o):1;if(c!==0){this.st(e);const h=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Xe=this.Xe.insert(e,h)}}}}}lt(t){const e=t.xe.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=e;let o,u;try{o=wn(n).toUint8Array()}catch(c){if(c instanceof N2)return Ie("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{u=new E1(o,s,i)}catch(c){return Ie(c instanceof Zr?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return u.ge===0?null:u}Et(t,e,n){return e.xe.count===n-this.Pt(t,e.targetId)?0:2}Pt(t,e){const n=this.ze.getRemoteKeysForTarget(e);let s=0;return n.forEach((i=>{const o=this.ze.Tt(),u=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;t.mightContain(u)||(this.nt(e,i,null),s++)})),s}Rt(t){const e=new Map;this.je.forEach(((i,o)=>{const u=this.ut(o);if(u){if(i.current&&this._t(u.target)){const c=Un(u.target)?lt.fromString(u.target.getPipelineDocuments()[0]):u.target.path,h=new z(c);this.It(h).has(o)||this.At(o,h)||this.nt(o,h,Ht.newNoDocument(h,t))}i.Be&&(e.set(o,i.ke()),i.qe())}}));let n=rt();this.Ze.forEach(((i,o)=>{let u=!0;o.forEachWhile((c=>{const h=this.ut(c);return!h||h.purpose==="TargetPurposeLimboResolution"||(u=!1,!1)})),u&&(n=n.add(i))})),this.He.forEach(((i,o)=>o.setReadTime(t))),this.Ye.forEach(((i,o)=>o.setReadTime(t)));const s=new zs(t,e,this.Xe,this.He,this.Ye,n);return this.He=ne(),this.Je=Ei(),this.Ye=ne(),this.Ze=Ei(),this.Xe=new pt(st),s}tt(t,e){const n=this.je.get(t);if(!n||!this.it(t))return void U(Kr,`addDocumentToTarget received document for unknown inactive target (${t})`);const s=this.At(t,e.key)?2:0;n.$e(e.key,s),Un(this.ut(t).target)&&this.ut(t).target.getPipelineFlavor()!=="exact"?this.Ye=this.Ye.insert(e.key,e):this.He=this.He.insert(e.key,e),this.Je=this.Je.insert(e.key,this.It(e.key).add(t)),this.Ze=this.Ze.insert(e.key,this.Vt(e.key).add(t))}nt(t,e,n){const s=this.je.get(t);s&&this.it(t)?(this.At(t,e)?s.$e(e,1):s.Ke(e),this.Ze=this.Ze.insert(e,this.Vt(e).delete(t)),this.Ze=this.Ze.insert(e,this.Vt(e).add(t)),n&&(Un(this.ut(t).target)&&this.ut(t).target.getPipelineFlavor()!=="exact"?this.Ye=this.Ye.insert(e,n):this.He=this.He.insert(e,n))):U(Kr,`removeDocumentFromTarget received document for unknown or inactive target (${t})`)}removeTarget(t){this.je.delete(t)}ct(t){const e=this.je.get(t);if(!e)return 0;const n=e.ke();return this.ze.getRemoteKeysForTarget(t).size+n.addedDocuments.size-n.removedDocuments.size}We(t){let e=this.je.get(t);e||(U(Kr,`recordPendingTargetRequest set up tracking for target ID ${t}`),e=new Sl(t),this.je.set(t,e)),e.We()}Vt(t){let e=this.Ze.get(t);return e||(e=new vt(st),this.Ze=this.Ze.insert(t,e)),e}It(t){let e=this.Je.get(t);return e||(e=new vt(st),this.Je=this.Je.insert(t,e)),e}it(t){const e=this.ut(t)!==null;return e||U(Kr,"Detected inactive target",t),e}ut(t){const e=this.je.get(t);return e===void 0||e.Le?null:this.ze.dt(t)}st(t){this.je.set(t,new Sl(t)),this.ze.getRemoteKeysForTarget(t).forEach((e=>{this.nt(t,e,null)}))}At(t,e){return this.ze.getRemoteKeysForTarget(t).has(e)}}function Ei(){return new pt(z.comparator)}function Cl(){return new pt(z.comparator)}const I9={asc:"ASCENDING",desc:"DESCENDING"},A9={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},v9={and:"AND",or:"OR"};class R9{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function xa(r,t){return r.useProto3Json||ho(t)?t:{value:t}}function Ki(r,t){return r.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function y1(r){const t=Tn(r);return new dt(t.seconds,t.nanos)}function o6(r,t){return r.useProto3Json?t.toBase64():t.toUint8Array()}function bi(r,t){return Ki(r,t.toTimestamp())}function ke(r){return H(!!r,49232),X.fromTimestamp(y1(r))}function T1(r,t){return La(r,t).canonicalString()}function La(r,t){const e=(function(s){return new lt(["projects",s.projectId,"databases",s.database])})(r).child("documents");return t===void 0?e:e.child(t)}function a6(r){const t=lt.fromString(r);return H(f6(t),10190,{key:t.toString()}),t}function Yi(r,t){return T1(r.databaseId,t.path)}function da(r,t){const e=a6(t);if(e.get(1)!==r.databaseId.projectId)throw new q(x.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+e.get(1)+" vs "+r.databaseId.projectId);if(e.get(3)!==r.databaseId.database)throw new q(x.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+e.get(3)+" vs "+r.databaseId.database);return new z(c6(e))}function u6(r,t){return T1(r.databaseId,t)}function S9(r){const t=a6(r);return t.length===4?lt.emptyPath():c6(t)}function Ma(r){return new lt(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function c6(r){return H(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function Pl(r,t,e){return{name:Yi(r,t),fields:e.value.mapValue.fields}}function C9(r,t){let e;if("targetChange"in t){t.targetChange;const n=(function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:G(39313,{state:h})})(t.targetChange.targetChangeType||"NO_CHANGE"),s=t.targetChange.targetIds||[],i=(function(h,p){return h.useProto3Json?(H(p===void 0||typeof p=="string",58123),St.fromBase64String(p||"")):(H(p===void 0||p instanceof Buffer||p instanceof Uint8Array,16193),St.fromUint8Array(p||new Uint8Array))})(r,t.targetChange.resumeToken),o=t.targetChange.cause,u=o&&(function(h){const p=h.code===void 0?x.UNKNOWN:t6(h.code);return new q(p,h.message||"")})(o);e=new i6(n,s,i,u||null)}else if("documentChange"in t){t.documentChange;const n=t.documentChange;n.document,n.document.name,n.document.updateTime;const s=da(r,n.document.name),i=ke(n.document.updateTime),o=n.document.createTime?ke(n.document.createTime):X.min(),u=new Yt({mapValue:{fields:n.document.fields}}),c=Ht.newFoundDocument(s,i,o,u),h=n.targetIds||[],p=n.removedTargetIds||[];e=new Pi(h,p,c.key,c)}else if("documentDelete"in t){t.documentDelete;const n=t.documentDelete;n.document;const s=da(r,n.document),i=n.readTime?ke(n.readTime):X.min(),o=Ht.newNoDocument(s,i),u=n.removedTargetIds||[];e=new Pi([],u,o.key,o)}else if("documentRemove"in t){t.documentRemove;const n=t.documentRemove;n.document;const s=da(r,n.document),i=n.removedTargetIds||[];e=new Pi([],i,s,null)}else{if(!("filter"in t))return G(11601,{ft:t});{t.filter;const n=t.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,o=new f9(s,i),u=n.targetId;e=new s6(u,o)}}return e}function P9(r,t){let e;if(t instanceof Gs)e={update:Pl(r,t.key,t.value)};else if(t instanceof j2)e={delete:Yi(r,t.key)};else if(t instanceof On)e={update:Pl(r,t.key,t.data),updateMask:F9(t.fieldMask)};else{if(!(t instanceof Y3))return G(16599,{gt:t.type});e={verify:Yi(r,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map((n=>(function(i,o){const u=o.transform;if(u instanceof As)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof vs)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof Rs)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof Ss)return{fieldPath:o.field.canonicalString(),increment:u.Re};if(u instanceof Hi)return{fieldPath:o.field.canonicalString(),minimum:u.Re};if(u instanceof ji)return{fieldPath:o.field.canonicalString(),maximum:u.Re};throw G(20930,{transform:o.transform})})(0,n)))),t.precondition.isNone||(e.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:bi(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:G(27497)})(r,t.precondition)),e}function b9(r,t){return r&&r.length>0?(H(t!==void 0,14353),r.map((e=>(function(s,i){let o=s.updateTime?ke(s.updateTime):ke(i);return o.isEqual(X.min())&&(o=ke(i)),new z3(o,s.transformResults||[])})(e,t)))):[]}function N9(r,t){return{documents:[u6(r,t.path)]}}function O9(r,t){const e={structuredQuery:{}},n=t.path;let s;t.collectionGroup!==null?(s=n,e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=n.popLast(),e.structuredQuery.from=[{collectionId:n.lastSegment()}]),e.parent=u6(r,s);const i=(function(h){if(h.length!==0)return h6(xe.create(h,"and"))})(t.filters);i&&(e.structuredQuery.where=i);const o=(function(h){if(h.length!==0)return h.map((p=>(function(v){return{field:ar(v.field),direction:x9(v.dir)}})(p)))})(t.orderBy);o&&(e.structuredQuery.orderBy=o);const u=xa(r,t.limit);return u!==null&&(e.structuredQuery.limit=u),t.startAt&&(e.structuredQuery.startAt=(function(h){return{before:h.inclusive,values:h.position}})(t.startAt)),t.endAt&&(e.structuredQuery.endAt=(function(h){return{before:!h.inclusive,values:h.position}})(t.endAt)),{yt:e,parent:s}}function k9(r){let t=S9(r.parent);const e=r.structuredQuery,n=e.from?e.from.length:0;let s=null;if(n>0){H(n===1,65062);const p=e.from[0];p.allDescendants?s=p.collectionId:t=t.child(p.collectionId)}let i=[];e.where&&(i=(function(_){const v=l6(_);return v instanceof xe&&W2(v)?v.getFilters():[v]})(e.where));let o=[];e.orderBy&&(o=(function(_){return _.map((v=>(function(V){return new Wi(ur(V.field),(function($){switch($){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(V.direction))})(v)))})(e.orderBy));let u=null;e.limit&&(u=(function(_){let v;return v=typeof _=="object"?_.value:_,ho(v)?null:v})(e.limit));let c=null;e.startAt&&(c=(function(_){const v=!!_.before,N=_.values||[];return new zi(N,v)})(e.startAt));let h=null;return e.endAt&&(h=(function(_){const v=!_.before,N=_.values||[];return new zi(N,v)})(e.endAt)),o9(t,s,o,i,u,"F",c,h)}function V9(r,t){const e=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return G(28987,{purpose:s})}})(t.purpose);return e==null?null:{"goog-listen-tags":e}}function D9(r,t){return{structuredPipeline:{pipeline:{stages:t.stages.map((e=>e._toProto(r)))}}}}function l6(r){return r.unaryFilter!==void 0?(function(e){switch(e.unaryFilter.op){case"IS_NAN":const n=ur(e.unaryFilter.field);return Nt.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=ur(e.unaryFilter.field);return Nt.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=ur(e.unaryFilter.field);return Nt.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=ur(e.unaryFilter.field);return Nt.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return G(61313);default:return G(60726)}})(r):r.fieldFilter!==void 0?(function(e){return Nt.create(ur(e.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return G(58110);default:return G(50506)}})(e.fieldFilter.op),e.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(e){return xe.create(e.compositeFilter.filters.map((n=>l6(n))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return G(1026)}})(e.compositeFilter.op))})(r):G(30097,{filter:r})}function x9(r){return I9[r]}function L9(r){return A9[r]}function M9(r){return v9[r]}function ar(r){return{fieldPath:r.canonicalString()}}function ur(r){return bt.fromServerFormat(r.fieldPath)}function h6(r){return r instanceof Nt?(function(e){if(e.op==="=="){if(oe(e.value))return{unaryFilter:{field:ar(e.field),op:"IS_NAN"}};if(le(e.value))return{unaryFilter:{field:ar(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if(oe(e.value))return{unaryFilter:{field:ar(e.field),op:"IS_NOT_NAN"}};if(le(e.value))return{unaryFilter:{field:ar(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ar(e.field),op:L9(e.op),value:e.value}}})(r):r instanceof xe?(function(e){const n=e.getFilters().map((s=>h6(s)));return n.length===1?n[0]:{compositeFilter:{op:M9(e.op),filters:n}}})(r):G(54877,{filter:r})}function F9(r){const t=[];return r.fields.forEach((e=>t.push(e.canonicalString()))),{fieldPaths:t}}function f6(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}function d6(r){return!!r&&typeof r._toProto=="function"&&r._protoValueType==="ProtoValue"}function Cs(r,t){const e={fields:{}};return t.forEach(((n,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);e.fields[s]=n._toProto(r)})),{mapValue:e}}function p6(r){return{stringValue:r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yo(r){return new R9(r,!0)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fe{constructor(t){this._byteString=t}static fromBase64String(t){try{return new fe(St.fromBase64String(t))}catch(e){throw new q(x.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new fe(St.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}toJSON(){return{type:fe._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if(Hs(t,fe._jsonSchema))return fe.fromBase64String(t.bytes)}}fe._jsonSchemaVersion="firestore/bytes/1.0",fe._jsonSchema={type:It("string",fe._jsonSchemaVersion),bytes:It("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class To{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new q(x.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new bt(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}function U9(){return new To(gr)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wo{constructor(t){this._methodName=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ve{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new q(x.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new q(x.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}_compareTo(t){return st(this._lat,t._lat)||st(this._long,t._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Ve._jsonSchemaVersion}}static fromJSON(t){if(Hs(t,Ve._jsonSchema))return new Ve(t.latitude,t.longitude)}}function m6(r){const t={};return r.timeoutSeconds!==void 0&&(t.timeoutSeconds=r.timeoutSeconds),t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ve._jsonSchemaVersion="firestore/geoPoint/1.0",Ve._jsonSchema={type:It("string",Ve._jsonSchemaVersion),latitude:It("number"),longitude:It("number")};class B9{bt(t){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bl="ConnectivityMonitor";class Nl{constructor(){this.vt=()=>this.St(),this.Dt=()=>this.xt(),this.Ct=[],this.Ft()}bt(t){this.Ct.push(t)}shutdown(){window.removeEventListener("online",this.vt),window.removeEventListener("offline",this.Dt)}Ft(){window.addEventListener("online",this.vt),window.addEventListener("offline",this.Dt)}St(){U(bl,"Network connectivity changed: AVAILABLE");for(const t of this.Ct)t(0)}xt(){U(bl,"Network connectivity changed: UNAVAILABLE");for(const t of this.Ct)t(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let yi=null;function Fa(){return yi===null?yi=(function(){return 268435456+Math.round(2147483648*Math.random())})():yi++,"0x"+yi.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pa="RestConnection",$9={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class q9{get Ot(){return!1}constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const e=t.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Mt=e+"://"+t.host,this.Nt=`projects/${n}/databases/${s}`,this.Lt=this.databaseId.database===$i?`project_id=${n}`:`project_id=${n}&database_id=${s}`}Bt(t,e,n,s,i){const o=Fa(),u=this.Ut(t,e.toUriEncodedString());U(pa,`Sending RPC '${t}' ${o}:`,u,n);const c={"google-cloud-resource-prefix":this.Nt,"x-goog-request-params":this.Lt};this.kt(c,s,i);const{host:h}=new URL(u),p=Ls(h);return this.qt(t,u,c,n,p).then((_=>(U(pa,`Received RPC '${t}' ${o}: `,_),_)),(_=>{throw Ie(pa,`RPC '${t}' ${o} failed with error: `,_,"url: ",u,"request:",n),_}))}$t(t,e,n,s,i,o){return this.Bt(t,e,n,s,i)}kt(t,e,n){t["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Rr})(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),e&&e.headers.forEach(((s,i)=>t[i]=s)),n&&n.headers.forEach(((s,i)=>t[i]=s))}Ut(t,e){const n=$9[t];let s=`${this.Mt}/v1/${e}:${n}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H9{constructor(t){this.Kt=t.Kt,this.Wt=t.Wt}Qt(t){this.Gt=t}zt(t){this.jt=t}Ht(t){this.Jt=t}onMessage(t){this.Yt=t}close(){this.Wt()}send(t){this.Kt(t)}Zt(){this.Gt()}Xt(){this.jt()}en(t){this.Jt(t)}tn(t){this.Yt(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ut="WebChannelConnection",Yr=(r,t,e)=>{r.listen(t,(n=>{try{e(n)}catch(s){setTimeout((()=>{throw s}),0)}}))};class pr extends q9{constructor(t){super(t),this.nn=[],this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}static rn(){if(!pr.sn){const t=A2();Yr(t,I2.STAT_EVENT,(e=>{e.stat===Pa.PROXY?U(Ut,"STAT_EVENT: detected buffering proxy"):e.stat===Pa.NOPROXY&&U(Ut,"STAT_EVENT: detected no buffering proxy")})),pr.sn=!0}}qt(t,e,n,s,i){const o=Fa();return new Promise(((u,c)=>{const h=new T2;h.setWithCredentials(!0),h.listenOnce(w2.COMPLETE,(()=>{try{switch(h.getLastErrorCode()){case Ri.NO_ERROR:const _=h.getResponseJson();U(Ut,`XHR for RPC '${t}' ${o} received:`,JSON.stringify(_)),u(_);break;case Ri.TIMEOUT:U(Ut,`RPC '${t}' ${o} timed out`),c(new q(x.DEADLINE_EXCEEDED,"Request time out"));break;case Ri.HTTP_ERROR:const v=h.getStatus();if(U(Ut,`RPC '${t}' ${o} failed with status:`,v,"response text:",h.getResponseText()),v>0){let N=h.getResponseJson();Array.isArray(N)&&(N=N[0]);const V=N?.error;if(V&&V.status&&V.message){const M=(function(J){const ut=J.toLowerCase().replace(/_/g,"-");return Object.values(x).indexOf(ut)>=0?ut:x.UNKNOWN})(V.status);c(new q(M,V.message))}else c(new q(x.UNKNOWN,"Server responded with status "+h.getStatus()))}else c(new q(x.UNAVAILABLE,"Connection failed."));break;default:G(9055,{_n:t,streamId:o,an:h.getLastErrorCode(),un:h.getLastError()})}}finally{U(Ut,`RPC '${t}' ${o} completed.`)}}));const p=JSON.stringify(s);U(Ut,`RPC '${t}' ${o} sending request:`,s),h.send(e,"POST",p,n,15)}))}cn(t,e,n){const s=Fa(),i=[this.Mt,"/","google.firestore.v1.Firestore","/",t,"/channel"],o=this.createWebChannelTransport(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;c!==void 0&&(u.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(u.useFetchStreams=!0),this.kt(u.initMessageHeaders,e,n),u.encodeInitMessageHeaders=!0;const h=i.join("");U(Ut,`Creating RPC '${t}' stream ${s}: ${h}`,u);const p=o.createWebChannel(h,u);this.En(p);let _=!1,v=!1;const N=new H9({Kt:V=>{v?U(Ut,`Not sending because RPC '${t}' stream ${s} is closed:`,V):(_||(U(Ut,`Opening RPC '${t}' stream ${s} transport.`),p.open(),_=!0),U(Ut,`RPC '${t}' stream ${s} sending:`,V),p.send(V))},Wt:()=>p.close()});return Yr(p,Jr.EventType.OPEN,(()=>{v||(U(Ut,`RPC '${t}' stream ${s} transport opened.`),N.Zt())})),Yr(p,Jr.EventType.CLOSE,(()=>{v||(v=!0,U(Ut,`RPC '${t}' stream ${s} transport closed`),N.en(),this.hn(p))})),Yr(p,Jr.EventType.ERROR,(V=>{v||(v=!0,Ie(Ut,`RPC '${t}' stream ${s} transport errored. Name:`,V.name,"Message:",V.message),N.en(new q(x.UNAVAILABLE,"The operation could not be completed")))})),Yr(p,Jr.EventType.MESSAGE,(V=>{if(!v){const M=V.data[0];H(!!M,16349);const $=M,J=$?.error||$[0]?.error;if(J){U(Ut,`RPC '${t}' stream ${s} received error:`,J);const ut=J.status;let _t=(function(xt){const A=wt[xt];if(A!==void 0)return t6(A)})(ut),Xt=J.message;ut==="NOT_FOUND"&&Xt.includes("database")&&Xt.includes("does not exist")&&Xt.includes(this.databaseId.database)&&Ie(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),_t===void 0&&(_t=x.INTERNAL,Xt="Unknown error status: "+ut+" with message "+J.message),v=!0,N.en(new q(_t,Xt)),p.close()}else U(Ut,`RPC '${t}' stream ${s} received:`,M),N.tn(M)}})),pr.rn(),setTimeout((()=>{N.Xt()}),0),N}terminate(){this.nn.forEach((t=>t.close())),this.nn=[]}En(t){this.nn.push(t)}hn(t){this.nn=this.nn.filter((e=>e===t))}kt(t,e,n){super.kt(t,e,n),this.databaseInfo.apiKey&&(t["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return v2()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function j9(r){return new pr(r)}pr.sn=!1;class g6{constructor(t,e,n=1e3,s=1.5,i=6e4){this.Tn=t,this.timerId=e,this.Pn=n,this.Rn=s,this.In=i,this.An=0,this.Vn=null,this.dn=Date.now(),this.reset()}reset(){this.An=0}fn(){this.An=this.In}mn(t){this.cancel();const e=Math.floor(this.An+this.pn()),n=Math.max(0,Date.now()-this.dn),s=Math.max(0,e-n);s>0&&U("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.An} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`),this.Vn=this.Tn.enqueueAfterDelay(this.timerId,s,(()=>(this.dn=Date.now(),t()))),this.An*=this.Rn,this.An<this.Pn&&(this.An=this.Pn),this.An>this.In&&(this.An=this.In)}gn(){this.Vn!==null&&(this.Vn.skipDelay(),this.Vn=null)}cancel(){this.Vn!==null&&(this.Vn.cancel(),this.Vn=null)}pn(){return(Math.random()-.5)*this.An}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ol="PersistentStream";class _6{constructor(t,e,n,s,i,o,u,c){this.Tn=t,this.yn=n,this.wn=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=u,this.listener=c,this.state=0,this.bn=0,this.vn=null,this.Sn=null,this.stream=null,this.Dn=0,this.xn=new g6(t,e)}Cn(){return this.state===1||this.state===5||this.Fn()}Fn(){return this.state===2||this.state===3}start(){this.Dn=0,this.state!==4?this.auth():this.On()}async stop(){this.Cn()&&await this.close(0)}Mn(){this.state=0,this.xn.reset()}Nn(){this.Fn()&&this.vn===null&&(this.vn=this.Tn.enqueueAfterDelay(this.yn,6e4,(()=>this.Ln())))}Bn(t){this.Un(),this.stream.send(t)}async Ln(){if(this.Fn())return this.close(0)}Un(){this.vn&&(this.vn.cancel(),this.vn=null)}kn(){this.Sn&&(this.Sn.cancel(),this.Sn=null)}async close(t,e){this.Un(),this.kn(),this.xn.cancel(),this.bn++,t!==4?this.xn.reset():e&&e.code===x.RESOURCE_EXHAUSTED?(ze(e.toString()),ze("Using maximum backoff delay to prevent overloading the backend."),this.xn.fn()):e&&e.code===x.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.qn(),this.stream.close(),this.stream=null),this.state=t,await this.listener.Ht(e)}qn(){}auth(){this.state=1;const t=this.$n(this.bn),e=this.bn;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([n,s])=>{this.bn===e&&this.Kn(n,s)}),(n=>{t((()=>{const s=new q(x.UNKNOWN,"Fetching auth token failed: "+n.message);return this.Wn(s)}))}))}Kn(t,e){const n=this.$n(this.bn);this.stream=this.Qn(t,e),this.stream.Qt((()=>{n((()=>this.listener.Qt()))})),this.stream.zt((()=>{n((()=>(this.state=2,this.Sn=this.Tn.enqueueAfterDelay(this.wn,1e4,(()=>(this.Fn()&&(this.state=3),Promise.resolve()))),this.listener.zt())))})),this.stream.Ht((s=>{n((()=>this.Wn(s)))})),this.stream.onMessage((s=>{n((()=>++this.Dn==1?this.Gn(s):this.onNext(s)))}))}On(){this.state=5,this.xn.mn((async()=>{this.state=0,this.start()}))}Wn(t){return U(Ol,`close with error: ${t}`),this.stream=null,this.close(4,t)}$n(t){return e=>{this.Tn.enqueueAndForget((()=>this.bn===t?e():(U(Ol,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class G9 extends _6{constructor(t,e,n,s,i,o){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,n,s,o),this.serializer=i}Qn(t,e){return this.connection.cn("Listen",t,e)}Gn(t){return this.onNext(t)}onNext(t){this.xn.reset();const e=C9(this.serializer,t),n=(function(i){if(!("targetChange"in i))return X.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?X.min():o.readTime?ke(o.readTime):X.min()})(t);return this.listener.zn(e,n)}jn(t){const e={};e.database=Ma(this.serializer),e.addTarget=(function(i,o){let u;const c=o.target;if(u=Un(c)?{pipelineQuery:D9(i,c)}:Z2(c)?{documents:N9(i,c)}:{query:O9(i,c).yt},u.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){u.resumeToken=o6(i,o.resumeToken);const h=xa(i,o.expectedCount);h!==null&&(u.expectedCount=h)}else if(o.snapshotVersion.compareTo(X.min())>0){u.readTime=Ki(i,o.snapshotVersion.toTimestamp());const h=xa(i,o.expectedCount);h!==null&&(u.expectedCount=h)}return u})(this.serializer,t);const n=V9(this.serializer,t);n&&(e.labels=n),this.Bn(e)}Hn(t){const e={};e.database=Ma(this.serializer),e.removeTarget=t,this.Bn(e)}}class z9 extends _6{constructor(t,e,n,s,i,o){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,n,s,o),this.serializer=i}get Jn(){return this.Dn>0}start(){this.lastStreamToken=void 0,super.start()}qn(){this.Jn&&this.Yn([])}Qn(t,e){return this.connection.cn("Write",t,e)}Gn(t){return H(!!t.streamToken,31322),this.lastStreamToken=t.streamToken,H(!t.writeResults||t.writeResults.length===0,55816),this.listener.Zn()}onNext(t){H(!!t.streamToken,12678),this.lastStreamToken=t.streamToken,this.xn.reset();const e=b9(t.writeResults,t.commitTime),n=ke(t.commitTime);return this.listener.Xn(n,e)}er(){const t={};t.database=Ma(this.serializer),this.Bn(t)}Yn(t){const e={streamToken:this.lastStreamToken,writes:t.map((n=>P9(this.serializer,n)))};this.Bn(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W9{}class K9 extends W9{constructor(t,e,n,s){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=n,this.serializer=s,this.tr=!1}nr(){if(this.tr)throw new q(x.FAILED_PRECONDITION,"The client has already been terminated.")}Bt(t,e,n,s){return this.nr(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.Bt(t,La(e,n),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===x.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new q(x.UNKNOWN,i.toString())}))}$t(t,e,n,s,i){return this.nr(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,u])=>this.connection.$t(t,La(e,n),s,o,u,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===x.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new q(x.UNKNOWN,o.toString())}))}terminate(){this.tr=!0,this.connection.terminate()}}function Y9(r,t,e,n){return new K9(r,t,e,n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Q9="ComponentProvider",kl=new Map;function X9(r,t,e,n,s){return new F3(r,t,e,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,m6(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,n)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vl={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},E6=41943040;class Zt{static withCacheSize(t){return new Zt(t,Zt.DEFAULT_COLLECTION_PERCENTILE,Zt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(t,e,n){this.cacheSizeCollectionThreshold=t,this.percentileToCollect=e,this.maximumSequenceNumbersToCollect=n}}Zt.DEFAULT_COLLECTION_PERCENTILE=10,Zt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Zt.DEFAULT=new Zt(E6,Zt.DEFAULT_COLLECTION_PERCENTILE,Zt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Zt.DISABLED=new Zt(-1,0,0);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dl="LruGarbageCollector",J9=1048576;function xl([r,t],[e,n]){const s=st(r,e);return s===0?st(t,n):s}class Z9{constructor(t){this.rr=t,this.buffer=new vt(xl),this.ir=0}sr(){return++this.ir}_r(t){const e=[t,this.sr()];if(this.buffer.size<this.rr)this.buffer=this.buffer.add(e);else{const n=this.buffer.last();xl(e,n)<0&&(this.buffer=this.buffer.delete(n).add(e))}}get maxValue(){return this.buffer.last()[0]}}class t8{constructor(t,e,n){this.garbageCollector=t,this.asyncQueue=e,this.localStore=n,this.ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.ur(6e4)}stop(){this.ar&&(this.ar.cancel(),this.ar=null)}get started(){return this.ar!==null}ur(t){U(Dl,`Garbage collection scheduled in ${t}ms`),this.ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",t,(async()=>{this.ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){Cr(e)?U(Dl,"Ignoring IndexedDB error during garbage collection: ",e):await Sr(e)}await this.ur(3e5)}))}}class e8{constructor(t,e){this.cr=t,this.params=e}calculateTargetCount(t,e){return this.cr.lr(t).next((n=>Math.floor(e/100*n)))}nthSequenceNumber(t,e){if(e===0)return D.resolve(lo.ce);const n=new Z9(e);return this.cr.forEachTarget(t,(s=>n._r(s.sequenceNumber))).next((()=>this.cr.Er(t,(s=>n._r(s))))).next((()=>n.maxValue))}removeTargets(t,e,n){return this.cr.removeTargets(t,e,n)}removeOrphanedDocuments(t,e){return this.cr.removeOrphanedDocuments(t,e)}collect(t,e){return this.params.cacheSizeCollectionThreshold===-1?(U("LruGarbageCollector","Garbage collection skipped; disabled"),D.resolve(Vl)):this.getCacheSize(t).next((n=>n<this.params.cacheSizeCollectionThreshold?(U("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Vl):this.hr(t,e)))}getCacheSize(t){return this.cr.getCacheSize(t)}hr(t,e){let n,s,i,o,u,c,h;const p=Date.now();return this.calculateTargetCount(t,this.params.percentileToCollect).next((_=>(_>this.params.maximumSequenceNumbersToCollect?(U("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${_}`),s=this.params.maximumSequenceNumbersToCollect):s=_,o=Date.now(),this.nthSequenceNumber(t,s)))).next((_=>(n=_,u=Date.now(),this.removeTargets(t,n,e)))).next((_=>(i=_,c=Date.now(),this.removeOrphanedDocuments(t,n)))).next((_=>(h=Date.now(),ir()<=it.DEBUG&&U("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-p}ms
	Determined least recently used ${s} in `+(u-o)+`ms
	Removed ${i} targets in `+(c-u)+`ms
	Removed ${_} documents in `+(h-c)+`ms
Total Duration: ${h-p}ms`),D.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:_}))))}}function n8(r,t){return new e8(r,t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const y6="firestore.googleapis.com",Ll=!0;class Ml{constructor(t){if(t.host===void 0){if(t.ssl!==void 0)throw new q(x.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=y6,this.ssl=Ll}else this.host=t.host,this.ssl=t.ssl??Ll;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=E6;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<J9)throw new q(x.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}R3("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=m6(t.experimentalLongPollingOptions??{}),(function(n){if(n.timeoutSeconds!==void 0){if(isNaN(n.timeoutSeconds))throw new q(x.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (must not be NaN)`);if(n.timeoutSeconds<5)throw new q(x.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (minimum allowed value is 5)`);if(n.timeoutSeconds>30)throw new q(x.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&(function(n,s){return n.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class w1{constructor(t,e,n,s){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ml({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new q(x.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new q(x.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ml(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new p3;switch(n.type){case"firstParty":return new E3(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new q(x.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(e){const n=kl.get(e);n&&(U(Q9,"Removing Datastore"),kl.delete(e),n.terminate())})(this),Promise.resolve()}}function r8(r,t,e,n={}){r=Qn(r,w1);const s=Ls(t),i=r._getSettings(),o={...i,emulatorOptions:r._getEmulatorOptions()},u=`${t}:${e}`;s&&ch(`https://${u}`),i.host!==y6&&i.host!==u&&Ie("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const c={...i,host:u,ssl:s,emulatorOptions:n};if(!Gn(c,o)&&(r._setSettings(c),n.mockUserToken)){let h,p;if(typeof n.mockUserToken=="string")h=n.mockUserToken,p=qt.MOCK_USER;else{h=ed(n.mockUserToken,r._app?.options.projectId);const _=n.mockUserToken.sub||n.mockUserToken.user_id;if(!_)throw new q(x.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");p=new qt(_)}r._authCredentials=new m3(new C2(h,p))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class I1{constructor(t,e,n){this.converter=e,this._query=n,this.type="query",this.firestore=t}withConverter(t){return new I1(this.firestore,t,this._query)}}class At{constructor(t,e,n){this.converter=e,this._key=n,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Ps(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new At(this.firestore,t,this._key)}toJSON(){return{type:At._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,e,n){if(Hs(e,At._jsonSchema))return new At(t,n||null,new z(lt.fromString(e.referencePath)))}}At._jsonSchemaVersion="firestore/documentReference/1.0",At._jsonSchema={type:It("string",At._jsonSchemaVersion),referencePath:It("string")};class Ps extends I1{constructor(t,e,n){super(t,e,g1(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new At(this.firestore,null,new z(t))}withConverter(t){return new Ps(this.firestore,t,this._path)}}function S5(r,t,...e){if(r=Rt(r),arguments.length===1&&(t=l1.newId()),v3("doc","path",t),r instanceof w1){const n=lt.fromString(t,...e);return cl(n),new At(r,null,new z(n))}{if(!(r instanceof At||r instanceof Ps))throw new q(x.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(lt.fromString(t,...e));return cl(n),new At(r.firestore,r instanceof Ps?r.converter:null,new z(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(t){this._values=(t||[]).map((e=>e))}toArray(){return this._values.map((t=>t))}isEqual(t){return(function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0})(this._values,t._values)}toJSON(){return{type:re._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if(Hs(t,re._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every((e=>typeof e=="number")))return new re(t.vectorValues);throw new q(x.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}re._jsonSchemaVersion="firestore/vectorValue/1.0",re._jsonSchema={type:It("string",re._jsonSchemaVersion),vectorValues:It("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const s8=/^__.*__$/;class i8{constructor(t,e,n){this.data=t,this.fieldMask=e,this.fieldTransforms=n}toMutation(t,e){return this.fieldMask!==null?new On(t,this.data,this.fieldMask,e,this.fieldTransforms):new Gs(t,this.data,e,this.fieldTransforms)}}class T6{constructor(t,e,n){this.data=t,this.fieldMask=e,this.fieldTransforms=n}toMutation(t,e){return new On(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function w6(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw G(40011,{dataSource:r})}}class A1{constructor(t,e,n,s,i,o){this.settings=t,this.databaseId=e,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(t){return new A1({...this.settings,...t},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(t){const e=this.path?.child(t),n=this.contextWith({path:e,arrayElement:!1});return n.validatePathSegment(t),n}childContextForFieldPath(t){const e=this.path?.child(t),n=this.contextWith({path:e,arrayElement:!1});return n.validatePath(),n}childContextForArray(t){return this.contextWith({path:void 0,arrayElement:!0})}createError(t){return Qi(t,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(t){return this.fieldMask.find((e=>t.isPrefixOf(e)))!==void 0||this.fieldTransforms.find((e=>t.isPrefixOf(e.field)))!==void 0}validatePath(){if(this.path)for(let t=0;t<this.path.length;t++)this.validatePathSegment(this.path.get(t))}validatePathSegment(t){if(t.length===0)throw this.createError("Document fields must not be empty");if(w6(this.dataSource)&&s8.test(t))throw this.createError('Document fields cannot begin and end with "__"')}}class o8{constructor(t,e,n){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=n||yo(t)}createContext(t,e,n,s=!1){return new A1({dataSource:t,methodName:e,targetDoc:n,path:bt.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function I6(r){const t=r._freezeSettings(),e=yo(r._databaseId);return new o8(r._databaseId,!!t.ignoreUndefinedProperties,e)}function a8(r,t,e,n,s,i={}){const o=r.createContext(i.merge||i.mergeFields?2:0,t,e,s);R1("Data must be an object, but it was:",o,n);const u=A6(n,o);let c,h;if(i.merge)c=new ce(o.fieldMask),h=o.fieldTransforms;else if(i.mergeFields){const p=[];for(const _ of i.mergeFields){const v=wr(t,_,e);if(!o.contains(v))throw new q(x.INVALID_ARGUMENT,`Field '${v}' is specified in your field mask but missing from your input data.`);S6(p,v)||p.push(v)}c=new ce(p),h=o.fieldTransforms.filter((_=>c.covers(_.field)))}else c=null,h=o.fieldTransforms;return new i8(new Yt(u),c,h)}class Io extends wo{_toFieldTransform(t){if(t.dataSource!==2)throw t.dataSource===1?t.createError(`${this._methodName}() can only appear at the top level of your update data`):t.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof Io}}class v1 extends wo{_toFieldTransform(t){return new j3(t.path,new As)}isEqual(t){return t instanceof v1}}function u8(r,t,e,n){const s=r.createContext(1,t,e);R1("Data must be an object, but it was:",s,n);const i=[],o=Yt.empty();Nn(n,((c,h)=>{const p=R6(t,c,e);h=Rt(h);const _=s.childContextForFieldPath(p);if(h instanceof Io)i.push(p);else{const v=Xn(h,_);v!=null&&(i.push(p),o.set(p,v))}}));const u=new ce(i);return new T6(o,u,s.fieldTransforms)}function c8(r,t,e,n,s,i){const o=r.createContext(1,t,e),u=[wr(t,n,e)],c=[s];if(i.length%2!=0)throw new q(x.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let v=0;v<i.length;v+=2)u.push(wr(t,i[v])),c.push(i[v+1]);const h=[],p=Yt.empty();for(let v=u.length-1;v>=0;--v)if(!S6(h,u[v])){const N=u[v];let V=c[v];V=Rt(V);const M=o.childContextForFieldPath(N);if(V instanceof Io)h.push(N);else{const $=Xn(V,M);$!=null&&(h.push(N),p.set(N,$))}}const _=new ce(h);return new T6(p,_,o.fieldTransforms)}function Xn(r,t,e){if(v6(r=Rt(r)))return R1("Unsupported field value:",t,r),A6(r,t);if(r instanceof wo)return(function(s,i){if(!w6(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);const o=s._toFieldTransform(i);o&&i.fieldTransforms.push(o)})(r,t),null;if(r===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),r instanceof Array){if(t.settings.arrayElement&&t.dataSource!==4)throw t.createError("Nested arrays are not supported");return(function(s,i){const o=[];let u=0;for(const c of s){let h=Xn(c,i.childContextForArray(u));h==null&&(h={nullValue:"NULL_VALUE"}),o.push(h),u++}return{arrayValue:{values:o}}})(r,t)}return(function(s,i,o){if((s=Rt(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return p1(i.serializer,s,o);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const u=dt.fromDate(s);return{timestampValue:Ki(i.serializer,u)}}if(s instanceof dt){const u=new dt(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Ki(i.serializer,u)}}if(s instanceof Ve)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof fe)return{bytesValue:o6(i.serializer,s._byteString)};if(s instanceof At){const u=i.databaseId,c=s.firestore._databaseId;if(!c.isEqual(u))throw i.createError(`Document reference is for database ${c.projectId}/${c.database} but should be for database ${u.projectId}/${u.database}`);return{referenceValue:T1(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof re)return(function(c,h){const p=c instanceof re?c.toArray():c;return{mapValue:{fields:{[x2]:{stringValue:L2},[ws]:{arrayValue:{values:p.map((v=>{if(typeof v!="number")throw h.createError("VectorValues must only contain numeric values.");return po(h.serializer,v)}))}}}}}})(s,i);if(d6(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${h1(s)}`)})(r,t,e)}function A6(r,t){const e={};return b2(r)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):Nn(r,((n,s)=>{const i=Xn(s,t.childContextForField(n));i!=null&&(e[n]=i)})),{mapValue:{fields:e}}}function v6(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof dt||r instanceof Ve||r instanceof fe||r instanceof At||r instanceof wo||r instanceof re||d6(r))}function R1(r,t,e){if(!v6(e)||!qs(e)){const n=h1(e);throw n==="an object"?t.createError(r+" a custom object"):t.createError(r+" "+n)}}function wr(r,t,e){if((t=Rt(t))instanceof To)return t._internalPath;if(typeof t=="string")return R6(r,t);throw Qi("Field path arguments must be of type string or ",r,!1,void 0,e)}const l8=new RegExp("[~\\*/\\[\\]]");function R6(r,t,e){if(t.search(l8)>=0)throw Qi(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,e);try{return new To(...t.split("."))._internalPath}catch{throw Qi(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,e)}}function Qi(r,t,e,n,s){const i=n&&!n.isEmpty(),o=s!==void 0;let u=`Function ${t}() called with invalid data`;e&&(u+=" (via `toFirestore()`)"),u+=". ";let c="";return(i||o)&&(c+=" (found",i&&(c+=` in field ${n}`),o&&(c+=` in document ${s}`),c+=")"),new q(x.INVALID_ARGUMENT,u+r+c)}function S6(r,t){return r.some((e=>e.isEqual(t)))}function h8(r){return typeof r._readUserData=="function"}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gt{constructor(t){this.optionDefinitions=t}_getKnownOptions(t,e){const n=Yt.empty();for(const s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){const i=this.optionDefinitions[s];if(s in t){const o=t[s];let u;i.nestedOptions&&qs(o)?u={mapValue:{fields:new Gt(i.nestedOptions).getOptionsProto(e,o)}}:o&&(u=Xn(o,e)??void 0),u&&n.set(bt.fromServerFormat(i.serverName),u)}}return n}getOptionsProto(t,e,n){const s=this._getKnownOptions(e,t);if(n){const i=new Map(L3(n,((o,u)=>[bt.fromServerFormat(u),o!==void 0?Xn(o,t):null])));s.setAll(i)}return s.value.mapValue.fields??{}}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function f8(r){return typeof r=="object"&&r!==null&&!!("nullValue"in r&&(r.nullValue===null||r.nullValue==="NULL_VALUE")||"booleanValue"in r&&(r.booleanValue===null||typeof r.booleanValue=="boolean")||"integerValue"in r&&(r.integerValue===null||typeof r.integerValue=="number"||typeof r.integerValue=="string")||"doubleValue"in r&&(r.doubleValue===null||typeof r.doubleValue=="number")||"timestampValue"in r&&(r.timestampValue===null||(function(e){return typeof e=="object"&&e!==null&&"seconds"in e&&(e.seconds===null||typeof e.seconds=="number"||typeof e.seconds=="string")&&"nanos"in e&&(e.nanos===null||typeof e.nanos=="number")})(r.timestampValue))||"stringValue"in r&&(r.stringValue===null||typeof r.stringValue=="string")||"bytesValue"in r&&(r.bytesValue===null||r.bytesValue instanceof Uint8Array)||"referenceValue"in r&&(r.referenceValue===null||typeof r.referenceValue=="string")||"geoPointValue"in r&&(r.geoPointValue===null||(function(e){return typeof e=="object"&&e!==null&&"latitude"in e&&(e.latitude===null||typeof e.latitude=="number")&&"longitude"in e&&(e.longitude===null||typeof e.longitude=="number")})(r.geoPointValue))||"arrayValue"in r&&(r.arrayValue===null||(function(e){return typeof e=="object"&&e!==null&&!(!("values"in e)||e.values!==null&&!Array.isArray(e.values))})(r.arrayValue))||"mapValue"in r&&(r.mapValue===null||(function(e){return typeof e=="object"&&e!==null&&!(!("fields"in e)||e.fields!==null&&!qs(e.fields))})(r.mapValue))||"fieldReferenceValue"in r&&(r.fieldReferenceValue===null||typeof r.fieldReferenceValue=="string")||"functionValue"in r&&(r.functionValue===null||(function(e){return typeof e=="object"&&e!==null&&!(!("name"in e)||e.name!==null&&typeof e.name!="string"||!("args"in e)||e.args!==null&&!Array.isArray(e.args))})(r.functionValue))||"pipelineValue"in r&&(r.pipelineValue===null||(function(e){return typeof e=="object"&&e!==null&&!(!("stages"in e)||e.stages!==null&&!Array.isArray(e.stages))})(r.pipelineValue)))}function C5(){return new v1("serverTimestamp")}function d8(r){return new re(r)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function L(r){let t;return r instanceof tr?r:(t=qs(r)?y8(r):r instanceof Array?T8(r):C6(r,void 0),t)}function ma(r){if(r instanceof tr)return r;if(r instanceof re)return bs(r);if(Array.isArray(r))return bs(d8(r));throw new Error("Unsupported value: "+typeof r)}function S1(r){return V3(r)?g8(r):L(r)}class tr{constructor(){this._protoValueType="ProtoValue"}add(t){return new O("add",[this,L(t)],"add")}asBoolean(){if(this instanceof An)return this;if(this instanceof Pr)return new b6(this);if(this instanceof Ks)return new E8(this);if(this instanceof O)return new P6(this);throw new q("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(t){return new O("subtract",[this,L(t)],"subtract")}multiply(t){return new O("multiply",[this,L(t)],"multiply")}divide(t){return new O("divide",[this,L(t)],"divide")}mod(t){return new O("mod",[this,L(t)],"mod")}equal(t){return new O("equal",[this,L(t)],"equal").asBoolean()}notEqual(t){return new O("not_equal",[this,L(t)],"notEqual").asBoolean()}lessThan(t){return new O("less_than",[this,L(t)],"lessThan").asBoolean()}lessThanOrEqual(t){return new O("less_than_or_equal",[this,L(t)],"lessThanOrEqual").asBoolean()}greaterThan(t){return new O("greater_than",[this,L(t)],"greaterThan").asBoolean()}greaterThanOrEqual(t){return new O("greater_than_or_equal",[this,L(t)],"greaterThanOrEqual").asBoolean()}arrayConcat(t,...e){const n=[t,...e].map((s=>L(s)));return new O("array_concat",[this,...n],"arrayConcat")}arrayContains(t){return new O("array_contains",[this,L(t)],"arrayContains").asBoolean()}arrayContainsAll(t){const e=Array.isArray(t)?new ts(t.map(L),"arrayContainsAll"):t;return new O("array_contains_all",[this,e],"arrayContainsAll").asBoolean()}arrayContainsAny(t){const e=Array.isArray(t)?new ts(t.map(L),"arrayContainsAny"):t;return new O("array_contains_any",[this,e],"arrayContainsAny").asBoolean()}arrayReverse(){return new O("array_reverse",[this])}arrayLength(){return new O("array_length",[this],"arrayLength")}equalAny(t){const e=Array.isArray(t)?new ts(t.map(L),"equalAny"):t;return new O("equal_any",[this,e],"equalAny").asBoolean()}notEqualAny(t){const e=Array.isArray(t)?new ts(t.map(L),"notEqualAny"):t;return new O("not_equal_any",[this,e],"notEqualAny").asBoolean()}exists(){return new O("exists",[this],"exists").asBoolean()}charLength(){return new O("char_length",[this],"charLength")}like(t){return new O("like",[this,L(t)],"like").asBoolean()}regexContains(t){return new O("regex_contains",[this,L(t)],"regexContains").asBoolean()}regexFind(t){return new O("regex_find",[this,L(t)],"regexFind")}regexFindAll(t){return new O("regex_find_all",[this,L(t)],"regexFindAll")}regexMatch(t){return new O("regex_match",[this,L(t)],"regexMatch").asBoolean()}stringContains(t){return new O("string_contains",[this,L(t)],"stringContains").asBoolean()}startsWith(t){return new O("starts_with",[this,L(t)],"startsWith").asBoolean()}endsWith(t){return new O("ends_with",[this,L(t)],"endsWith").asBoolean()}toLower(){return new O("to_lower",[this],"toLower")}toUpper(){return new O("to_upper",[this],"toUpper")}trim(t){const e=[this];return t&&e.push(L(t)),new O("trim",e,"trim")}ltrim(t){const e=[this];return t&&e.push(L(t)),new O("ltrim",e,"ltrim")}rtrim(t){const e=[this];return t&&e.push(L(t)),new O("rtrim",e,"rtrim")}type(){return new O("type",[this])}isType(t){return new O("is_type",[this,bs(t)],"isType").asBoolean()}stringConcat(t,...e){const n=[t,...e].map(L);return new O("string_concat",[this,...n],"stringConcat")}stringIndexOf(t){return new O("string_index_of",[this,L(t)],"stringIndexOf")}stringRepeat(t){return new O("string_repeat",[this,L(t)],"stringRepeat")}stringReplaceAll(t,e){return new O("string_replace_all",[this,L(t),L(e)],"stringReplaceAll")}stringReplaceOne(t,e){return new O("string_replace_one",[this,L(t),L(e)],"stringReplaceOne")}concat(t,...e){const n=[t,...e].map(L);return new O("concat",[this,...n],"concat")}reverse(){return new O("reverse",[this],"reverse")}arrayFilter(t,e){return new O("array_filter",[this,L(t),e],"arrayFilter")}arrayTransform(t,e){return new O("array_transform",[this,L(t),e],"arrayTransform")}arrayTransformWithIndex(t,e,n){return new O("array_transform",[this,L(t),L(e),n],"arrayTransformWithIndex")}arraySlice(t,e){const n=[this,L(t)];return e!==void 0&&n.push(L(e)),new O("array_slice",n,"arraySlice")}arrayFirst(){return new O("array_first",[this],"arrayFirst")}arrayFirstN(t){return new O("array_first_n",[this,L(t)],"arrayFirstN")}arrayLast(){return new O("array_last",[this],"arrayLast")}arrayLastN(t){return new O("array_last_n",[this,L(t)],"arrayLastN")}arrayMaximum(){return new O("maximum",[this],"arrayMaximum")}arrayMaximumN(t){return new O("maximum_n",[this,L(t)],"arrayMaximumN")}arrayMinimum(){return new O("minimum",[this],"arrayMinimum")}arrayMinimumN(t){return new O("minimum_n",[this,L(t)],"arrayMinimumN")}arrayIndexOf(t){return new O("array_index_of",[this,L(t),L("first")],"arrayIndexOf")}arrayLastIndexOf(t){return new O("array_index_of",[this,L(t),L("last")],"arrayLastIndexOf")}arrayIndexOfAll(t){return new O("array_index_of_all",[this,L(t)],"arrayIndexOfAll")}byteLength(){return new O("byte_length",[this],"byteLength")}ceil(){return new O("ceil",[this])}floor(){return new O("floor",[this])}abs(){return new O("abs",[this])}exp(){return new O("exp",[this])}mapGet(t){return new O("map_get",[this,bs(t)],"mapGet")}mapSet(t,e,...n){const s=[this,L(t),L(e),...n.map(L)];return new O("map_set",s,"mapSet")}mapKeys(){return new O("map_keys",[this],"mapKeys")}mapValues(){return new O("map_values",[this],"mapValues")}mapEntries(){return new O("map_entries",[this],"mapEntries")}getField(t){return new O("get_field",[this,L(t)],"get_field")}count(){return ue._create("count",[this],"count")}sum(){return ue._create("sum",[this],"sum")}average(){return ue._create("average",[this],"average")}minimum(){return ue._create("minimum",[this],"minimum")}maximum(){return ue._create("maximum",[this],"maximum")}first(){return ue._create("first",[this],"first")}last(){return ue._create("last",[this],"last")}arrayAgg(){return ue._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return ue._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return ue._create("count_distinct",[this],"countDistinct")}logicalMaximum(t,...e){const n=[t,...e];return new O("maximum",[this,...n.map(L)],"logicalMaximum")}logicalMinimum(t,...e){const n=[t,...e];return new O("minimum",[this,...n.map(L)],"minimum")}vectorLength(){return new O("vector_length",[this],"vectorLength")}cosineDistance(t){return new O("cosine_distance",[this,ma(t)],"cosineDistance")}dotProduct(t){return new O("dot_product",[this,ma(t)],"dotProduct")}euclideanDistance(t){return new O("euclidean_distance",[this,ma(t)],"euclideanDistance")}unixMicrosToTimestamp(){return new O("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new O("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new O("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new O("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new O("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new O("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(t,e){return new O("timestamp_add",[this,L(t),L(e)],"timestampAdd")}timestampSubtract(t,e){return new O("timestamp_subtract",[this,L(t),L(e)],"timestampSubtract")}timestampDiff(t,e){return new O("timestamp_diff",[this,S1(t),L(e)],"timestampDiff")}timestampExtract(t,e){const n=[this,L(t)];return e&&n.push(L(e)),new O("timestamp_extract",n,"timestampExtract")}documentId(){return new O("document_id",[this],"documentId")}parent(){return new O("parent",[this],"parent")}substring(t,e){const n=L(t);return new O("substring",e===void 0?[this,n]:[this,n,L(e)],"substring")}arrayGet(t){return new O("array_get",[this,L(t)],"arrayGet")}isError(){return new O("is_error",[this],"isError").asBoolean()}ifError(t){const e=new O("if_error",[this,L(t)],"ifError");return t instanceof An?e.asBoolean():e}isAbsent(){return new O("is_absent",[this],"isAbsent").asBoolean()}mapRemove(t){return new O("map_remove",[this,L(t)],"mapRemove")}mapMerge(t,...e){const n=L(t),s=e.map(L);return new O("map_merge",[this,n,...s],"mapMerge")}pow(t){return new O("pow",[this,L(t)])}trunc(t){return t===void 0?new O("trunc",[this]):new O("trunc",[this,L(t)],"trunc")}round(t){return t===void 0?new O("round",[this]):new O("round",[this,L(t)],"round")}collectionId(){return new O("collection_id",[this])}length(){return new O("length",[this])}ln(){return new O("ln",[this])}sqrt(){return new O("sqrt",[this])}stringReverse(){return new O("string_reverse",[this])}ifAbsent(t){return new O("if_absent",[this,L(t)],"ifAbsent")}ifNull(t){return new O("if_null",[this,L(t)],"ifNull")}coalesce(t,...e){return new O("coalesce",[this,L(t),...e.map(L)],"coalesce")}join(t){return new O("join",[this,L(t)],"join")}log10(){return new O("log10",[this])}arraySum(){return new O("sum",[this])}split(t){return new O("split",[this,L(t)])}timestampTruncate(t,e){const n=[this,L(t)];return e&&n.push(L(e)),new O("timestamp_trunc",n)}ascending(){return w8(this)}descending(){return I8(this)}as(t){return new m8(this,t,"as")}}class ue{constructor(t,e){this.name=t,this.params=e,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(t,e,n){const s=new ue(t,e);return s._methodName=n,s}as(t){return new p8(this,t,"as")}_toProto(t){return{functionValue:{name:this.name,args:this.params.map((e=>e._toProto(t)))}}}_readUserData(t){t=this._methodName?t.contextWith({methodName:this._methodName}):t,this.params.forEach((e=>e._readUserData(t)))}}class p8{constructor(t,e,n){this.aggregate=t,this.alias=e,this._methodName=n}_readUserData(t){this.aggregate._readUserData(t)}}class m8{constructor(t,e,n){this.expr=t,this.alias=e,this._methodName=n,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(t){this.expr._readUserData(t)}}class ts extends tr{constructor(t,e){super(),this.Rr=t,this._methodName=e,this.expressionType="ListOfExpressions"}_toProto(t){return{arrayValue:{values:this.Rr.map((e=>e._toProto(t)))}}}_readUserData(t){this.Rr.forEach((e=>e._readUserData(t)))}}class Ks extends tr{constructor(t,e){super(),this.fieldPath=t,this._methodName=e,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(t){return new O("geo_distance",[this,L(t)],"geoDistance")}_toProto(t){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(t){}}function g8(r){return _8(r,"field")}function _8(r,t){return new Ks(typeof r=="string"?gr===r?U9()._internalPath:wr("field",r):r._internalPath,t)}class Pr extends tr{constructor(t,e){super(),this.value=t,this._methodName=e,this.expressionType="Constant"}static _fromProto(t){const e=new Pr(t,void 0);return e._protoValue=t,e}_toProto(t){return H(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(t){t=this._methodName?t.contextWith({methodName:this._methodName}):t,f8(this._protoValue)||(this._protoValue=Xn(this.value,t))}}function bs(r,t){return C6(r,"constant")}function C6(r,t){const e=new Pr(r,t);return typeof r=="boolean"?new b6(e):e}class O extends tr{constructor(t,e,n,s){super(),this.name=t,this.params=e,this.expressionType="Function",this._optionsProto=void 0,n!==void 0&&(this._methodName=n),s!==void 0&&(this._options=s)}get _optionsUtil(){return new Gt({})}_toProto(t){const e={functionValue:{name:this.name,args:this.params.map((n=>n._toProto(t)))}};return this._optionsProto&&(e.functionValue.options=this._optionsProto),e}_readUserData(t){t=this._methodName?t.contextWith({methodName:this._methodName}):t,this.params.forEach((e=>e._readUserData(t))),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(t,this._options))}}class An extends tr{get _methodName(){return this._expr._methodName}countIf(){return ue._create("count_if",[this],"countIf")}not(){return new O("not",[this],"not").asBoolean()}conditional(t,e){return new O("conditional",[this,t,e],"conditional")}ifError(t){const e=L(t),n=new O("if_error",[this,e],"ifError");return e instanceof An?n.asBoolean():n}_toProto(t){return this._expr._toProto(t)}_readUserData(t){this._expr._readUserData(t)}}class P6 extends An{constructor(t){super(),this._expr=t,this.expressionType="Function"}}class b6 extends An{constructor(t){super(),this._expr=t,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}}class E8 extends An{constructor(t){super(),this._expr=t,this.expressionType="Field"}}function y8(r,t){const e=[];for(const n in r)if(Object.prototype.hasOwnProperty.call(r,n)){const s=r[n];e.push(bs(n)),e.push(L(s))}return new O("map",e,"map")}function T8(r){return(function(e,n){return new O("array",e.map((s=>L(s))),n)})(r,"array")}function w8(r){return new N6(S1(r),"ascending","ascending")}function I8(r){return new N6(S1(r),"descending","descending")}class N6{constructor(t,e,n){this.expr=t,this.direction=e,this._methodName=n,this._protoValueType="ProtoValue"}_toProto(t){return{mapValue:{fields:{direction:p6(this.direction),expression:this.expr._toProto(t)}}}}_readUserData(t){this.expr._readUserData(t)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class he{constructor(t){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=t}_readUserData(t){this.optionsProto=this._optionsUtil.getOptionsProto(t,this.knownOptions,this.rawOptions)}_toProto(t){return{name:this._name,options:this.optionsProto}}}class O6 extends he{get _name(){return"add_fields"}get _optionsUtil(){return new Gt({})}constructor(t,e){super(e),this.fields=t}_toProto(t){return{...super._toProto(t),args:[Cs(t,this.fields)]}}_readUserData(t){super._readUserData(t),vn(this.fields,t)}}class k6 extends he{get _name(){return"aggregate"}get _optionsUtil(){return new Gt({})}constructor(t,e,n){super(n),this.groups=t,this.accumulators=e}_toProto(t){return{...super._toProto(t),args:[Cs(t,this.accumulators),Cs(t,this.groups)]}}_readUserData(t){super._readUserData(t),vn(this.groups,t),vn(this.accumulators,t)}}class V6 extends he{get _name(){return"distinct"}get _optionsUtil(){return new Gt({})}constructor(t,e){super(e),this.groups=t}_toProto(t){return{...super._toProto(t),args:[Cs(t,this.groups)]}}_readUserData(t){super._readUserData(t),vn(this.groups,t)}}class Ao extends he{get _name(){return"collection"}get _optionsUtil(){return new Gt({forceIndex:{serverName:"force_index"}})}constructor(t,e){super(e),this.Vr=t.startsWith("/")?t:"/"+t}_toProto(t){return{...super._toProto(t),args:[{referenceValue:this.Vr}]}}_readUserData(t){super._readUserData(t)}}class vo extends he{get _name(){return"collection_group"}get _optionsUtil(){return new Gt({forceIndex:{serverName:"force_index"}})}constructor(t,e){super(e),this.collectionId=t}_toProto(t){return{...super._toProto(t),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(t){super._readUserData(t)}}class C1 extends he{get _name(){return"database"}get _optionsUtil(){return new Gt({})}_toProto(t){return{...super._toProto(t)}}_readUserData(t){super._readUserData(t)}}class P1 extends he{get _name(){return"documents"}get _optionsUtil(){return new Gt({})}constructor(t,e){if(super(e),!t||t.length===0)throw new q(x.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");const n=t.map((i=>i.startsWith("/")?i:"/"+i)),s=new Set(n);if(s.size!==n.length)throw new q(x.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.dr=n,this.mr=s}_toProto(t){return{...super._toProto(t),args:this.dr.map((e=>({referenceValue:e})))}}_readUserData(t){super._readUserData(t)}}class b1 extends he{get _name(){return"where"}get _optionsUtil(){return new Gt({})}constructor(t,e){super(e),this.condition=t}_toProto(t){return{...super._toProto(t),args:[this.condition._toProto(t)]}}_readUserData(t){super._readUserData(t),vn(this.condition,t)}}class Ns extends he{get _name(){return"limit"}get _optionsUtil(){return new Gt({})}constructor(t,e){H(!isNaN(t)&&t!==1/0&&t!==-1/0,34860),super(e),this.limit=t}_toProto(t){return{...super._toProto(t),args:[p1(t,this.limit)]}}}class Fl extends he{get _name(){return"offset"}get _optionsUtil(){return new Gt({})}constructor(t,e){super(e),this.offset=t}_toProto(t){return{...super._toProto(t),args:[p1(t,this.offset)]}}}class A8 extends he{get _name(){return"select"}get _optionsUtil(){return new Gt({})}constructor(t,e){super(e),this.selections=t}_toProto(t){return{...super._toProto(t),args:[Cs(t,this.selections)]}}_readUserData(t){super._readUserData(t),vn(this.selections,t)}}class N1 extends he{get _name(){return"sort"}get _optionsUtil(){return new Gt({})}constructor(t,e){super(e),this.orderings=t}_toProto(t){return{...super._toProto(t),args:this.orderings.map((e=>e._toProto(t)))}}_readUserData(t){super._readUserData(t),vn(this.orderings,t)}}class O1 extends he{get _name(){return"replace_with"}get _optionsUtil(){return new Gt({})}constructor(t,e){super(e),this.map=t}_toProto(t){return{...super._toProto(t),args:[this.map._toProto(t),p6(O1.pr)]}}_readUserData(t){super._readUserData(t),vn(this.map,t)}}O1.pr="full_replace";function vn(r,t){return h8(r)?r._readUserData(t):Array.isArray(r)?r.forEach((e=>e._readUserData(t))):r instanceof Map?r.forEach((e=>e._readUserData(t))):Object.values(r).forEach((e=>e._readUserData(t))),r}// Copyright 2024 Google LLC* @license
class te{constructor(t,e,n){this.serializer=t,this.stages=e,this.listenOptions=n,this.isCorePipeline=!0}getPipelineCollection(){return Ro(this)}getPipelineCollectionGroup(){return k1(this)}getPipelineCollectionId(){return v8(this)}getPipelineDocuments(){return Ua(this)}getPipelineFlavor(){return(function(e){let n="exact";return e.stages.forEach(((s,i)=>{s._name!==V6.name&&s._name!==k6.name||(n="keyless"),s._name===A8.name&&n==="exact"&&(n="augmented"),s._name===O6.name&&i<e.stages.length-1&&n==="exact"&&(n="augmented")})),n})(this)}getPipelineSourceType(){return gn(this)}}function gn(r){const t=r.stages[0];return t instanceof Ao||t instanceof vo||t instanceof C1||t instanceof P1?t._name:"unknown"}function Ro(r){if(gn(r)==="collection")return r.stages[0].Vr}function k1(r){if(gn(r)==="collection_group")return r.stages[0].collectionId}function v8(r){switch(gn(r)){case"collection":return lt.fromString(Ro(r)).lastSegment();case"collection_group":return k1(r);default:return}}function Ua(r){if(gn(r)==="documents")return r.stages[0].dr}// Copyright 2024 Google LLC* @license
class w{constructor(t,e){this.type=t,this.value=e}static vr(){return new w("ERROR",void 0)}static Sr(){return new w("UNSET",void 0)}static Dr(){return new w("NULL",Er)}static newValue(t){return le(t)?new w("NULL",Er):(function(n){return!!n&&"booleanValue"in n})(t)?new w("BOOLEAN",t):Ce(t)?new w("INT",t):$n(t)?new w("DOUBLE",t):(function(n){return!!n&&"timestampValue"in n&&!!n.timestampValue})(t)?new w("TIMESTAMP",t):(function(n){return!!n&&"stringValue"in n})(t)?new w("STRING",t):(function(n){return!!n&&"bytesValue"in n})(t)?new w("BYTES",t):t.referenceValue?new w("REFERENCE",t):t.geoPointValue?new w("GEO_POINT",t):Tr(t)?new w("ARRAY",t):qi(t)?new w("VECTOR",t):qn(t)?new w("MAP",t):new w("ERROR",void 0)}Cr(){return this.type==="ERROR"||this.type==="UNSET"}Fr(){return this.type==="NULL"}}function ls(r){if(!r.Cr())return r.value}function D6(r){return r instanceof An?r._expr:r}function W(r){if((r=D6(r))instanceof Ks)return new R8(r);if(r instanceof Pr)return new S8(r);if(r instanceof ts)return new C8(r);if(r instanceof O){if(r.name==="add")return new N8(r);if(r.name==="subtract")return new O8(r);if(r.name==="multiply")return new k8(r);if(r.name==="divide")return new V8(r);if(r.name==="mod")return new D8(r);if(r.name==="and")return new x8(r);if(r.name==="equal")return new W8(r);if(r.name==="not_equal")return new K8(r);if(r.name==="less_than")return new Y8(r);if(r.name==="less_than_or_equal")return new Q8(r);if(r.name==="greater_than")return new X8(r);if(r.name==="greater_than_or_equal")return new J8(r);if(r.name==="array_concat")return new Z8(r);if(r.name==="array_reverse")return new tm(r);if(r.name==="array_contains")return new em(r);if(r.name==="array_contains_all")return new nm(r);if(r.name==="array_contains_any")return new rm(r);if(r.name==="array_length")return new sm(r);if(r.name==="array_element")return new im(r);if(r.name==="equal_any")return new x6(r);if(r.name==="not_equal_any")return new M8(r);if(r.name==="is_nan")return new F8(r);if(r.name==="is_not_nan")return new U8(r);if(r.name==="is_null")return new B8(r);if(r.name==="is_not_null")return new $8(r);if(r.name==="is_error")return new q8(r);if(r.name==="exists")return new H8(r);if(r.name==="not")return new So(r);if(r.name==="or")return new L8(r);if(r.name==="xor")return new V1(r);if(r.name==="conditional")return new j8(r);if(r.name==="maximum")return new G8(r);if(r.name==="minimum")return new z8(r);if(r.name==="reverse")return new om(r);if(r.name==="replace_first")return new am(r);if(r.name==="replace_all")return new um(r);if(r.name==="char_length")return new cm(r);if(r.name==="byte_length")return new lm(r);if(r.name==="like")return new hm(r);if(r.name==="regex_contains")return new fm(r);if(r.name==="regex_match")return new dm(r);if(r.name==="string_contains")return new pm(r);if(r.name==="starts_with")return new mm(r);if(r.name==="ends_with")return new gm(r);if(r.name==="to_lower")return new _m(r);if(r.name==="to_upper")return new Em(r);if(r.name==="trim")return new ym(r);if(r.name==="string_concat")return new Tm(r);if(r.name==="map_get")return new wm(r);if(r.name==="cosine_distance")return new Im(r);if(r.name==="dot_product")return new Am(r);if(r.name==="euclidean_distance")return new vm(r);if(r.name==="vector_length")return new Rm(r);if(r.name==="unix_micros_to_timestamp")return new Nm(r);if(r.name==="timestamp_to_unix_micros")return new Vm(r);if(r.name==="unix_millis_to_timestamp")return new Om(r);if(r.name==="timestamp_to_unix_millis")return new Dm(r);if(r.name==="unix_seconds_to_timestamp")return new km(r);if(r.name==="timestamp_to_unix_seconds")return new xm(r);if(r.name==="timestamp_add")return new Lm(r);if(r.name==="timestamp_subtract")return new Mm(r)}throw new Error(`Unknown Expr : ${r}`)}class R8{constructor(t){this.expr=t}evaluate(t,e){if(this.expr.fieldName===gr)return w.newValue({referenceValue:Yi(t.serializer,e.key)});if(this.expr.fieldName==="__update_time__")return w.newValue({timestampValue:bi(t.serializer,e.version)});if(this.expr.fieldName==="__create_time__")return w.newValue({timestampValue:bi(t.serializer,e.createTime)});const n=e.data.field(this.expr._fieldPath);return n?fo(n)?w.newValue((function(i,o){if(i.serverTimestampBehavior==="estimate")return{timestampValue:bi(i.serializer,X.fromTimestamp(_r(o)))};if(i.serverTimestampBehavior==="previous"){const u=js(o);if(u)return u}return{nullValue:"NULL_VALUE"}})(t,n)):w.newValue(n):w.Sr()}}class S8{constructor(t){this.expr=t}evaluate(t,e){return w.newValue(this.expr._getValue())}}class C8{constructor(t){this.expr=t}evaluate(t,e){const n=this.expr.Rr.map((s=>W(s).evaluate(t,e)));return n.some((s=>s.Cr()))?w.vr():w.newValue({arrayValue:{values:n.map((s=>s.value))}})}}function Mt(r){return $n(r)?Number(r.doubleValue):Number(r.integerValue)}function Le(r){return BigInt(r.integerValue)}const P8=BigInt("0x7fffffffffffffff"),b8=-BigInt("0x8000000000000000");class Ys{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length>=2,24778);const n=W(this.expr.params[0]).evaluate(t,e),s=W(this.expr.params[1]).evaluate(t,e);let i=this.Or(n,s);for(const o of this.expr.params.slice(2)){const u=W(o).evaluate(t,e);i=this.Or(i,u)}return i}Or(t,e){if(t.Cr()||e.Cr())return w.vr();if(t.Fr()||e.Fr())return w.Dr();const n=t.value,s=e.value;if(!$n(n)&&!Ce(n)||!$n(s)&&!Ce(s))return w.vr();if($n(n)||$n(s)){const i=this.Mr(n,s);return i?w.newValue(i):w.vr()}if(Ce(n)&&Ce(s)){const i=this.Nr(n,s);return i===void 0?w.vr():typeof i=="number"?w.newValue({doubleValue:i}):i<b8||i>P8?w.vr():w.newValue({integerValue:`${i}`})}return w.vr()}}function We(r,t){return Ct(r)!==Ct(t)?"TYPE_MISMATCH":oe(r)||oe(t)?"NOT_EQ":le(r)&&le(t)?"EQ":le(r)||le(t)?"NULL":Tr(r)&&Tr(t)?(function(n,s){if(n.values?.length!==s.values?.length)return"NOT_EQ";let i=!1;for(let o=0;o<(n.values?.length??0);o++){const u=n.values[o],c=s.values[o];switch(We(u,c)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:G(44609,{Lr:u,Br:c})}}return i?"NULL":"EQ"})(r.arrayValue,t.arrayValue):qi(r)&&qi(t)||qn(r)&&qn(t)?(function(n,s){const i=n.fields||{},o=s.fields||{};if(Bi(i)!==Bi(o))return"NOT_EQ";let u=!1;for(const c in i)if(i.hasOwnProperty(c)){if(o[c]===void 0)return"NOT_EQ";switch(We(i[c],o[c])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":u=!0}}return u?"NULL":"EQ"})(r.mapValue,t.mapValue):(function(n,s){return ge(n,s,{Te:!1,Ee:!0,he:!0})})(r,t)?"EQ":"NOT_EQ"}class N8 extends Ys{Nr(t,e){return Le(t)+Le(e)}Mr(t,e){return{doubleValue:Mt(t)+Mt(e)}}}class O8 extends Ys{constructor(t){super(t),this.expr=t}Nr(t,e){return Le(t)-Le(e)}Mr(t,e){return{doubleValue:Mt(t)-Mt(e)}}}class k8 extends Ys{constructor(t){super(t),this.expr=t}Nr(t,e){return Le(t)*Le(e)}Mr(t,e){return{doubleValue:Mt(t)*Mt(e)}}}class V8 extends Ys{constructor(t){super(t),this.expr=t}Nr(t,e){const n=Le(e);if(n!==BigInt(0))return Le(t)/n}Mr(t,e){const n=Mt(e);return n===0?{doubleValue:ys(n)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:Mt(t)/n}}}class D8 extends Ys{constructor(t){super(t),this.expr=t}Nr(t,e){const n=Le(e);if(n!==BigInt(0))return Le(t)%n}Mr(t,e){const n=Mt(e);if(n!==0)return{doubleValue:Mt(t)%n}}}class x8{constructor(t){this.expr=t}evaluate(t,e){let n=!1,s=!1;for(const i of this.expr.params){const o=W(i).evaluate(t,e);switch(o.type){case"BOOLEAN":if(!o.value?.booleanValue)return w.newValue(Dt);break;case"NULL":s=!0;break;default:n=!0}}return n?w.vr():s?w.Dr():w.newValue(se)}}class So{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===1,9634);const n=W(this.expr.params[0]).evaluate(t,e);switch(n.type){case"BOOLEAN":return w.newValue({booleanValue:!n.value?.booleanValue});case"NULL":return w.Dr();default:return w.vr()}}}class L8{constructor(t){this.expr=t}evaluate(t,e){let n=!1,s=!1;for(const i of this.expr.params){const o=W(i).evaluate(t,e);switch(o.type){case"BOOLEAN":if(o.value?.booleanValue)return w.newValue(se);break;case"NULL":s=!0;break;default:n=!0}}return n?w.vr():s?w.Dr():w.newValue(Dt)}}class V1{constructor(t){this.expr=t}evaluate(t,e){let n=!1,s=!1;for(const i of this.expr.params){const o=W(i).evaluate(t,e);switch(o.type){case"BOOLEAN":n=V1.xor(n,!!o.value?.booleanValue);break;case"NULL":s=!0;break;default:return w.vr()}}return s?w.Dr():w.newValue({booleanValue:n})}static xor(t,e){return(t||e)&&!(t&&e)}}class x6{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===2,55094);let n=!1;const s=W(this.expr.params[0]).evaluate(t,e);switch(s.type){case"NULL":n=!0;break;case"ERROR":case"UNSET":return w.vr()}const i=W(this.expr.params[1]).evaluate(t,e);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return w.vr()}if(n)return w.Dr();for(const o of i.value?.arrayValue?.values??[])switch(le(s.value)&&le(o)?"EQ":We(s.value,o)){case"EQ":return w.newValue(se);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:G(44608,{value:s.value,candidate:o})}return n?w.Dr():w.newValue(Dt)}}class M8{constructor(t){this.expr=t}evaluate(t,e){return new So(new O("not",[new O("equal_any",this.expr.params)])).evaluate(t,e)}}class F8{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===1,23322);const n=W(this.expr.params[0]).evaluate(t,e);switch(n.type){case"INT":return w.newValue(Dt);case"DOUBLE":return w.newValue({booleanValue:isNaN(Mt(n.value))});case"NULL":return w.Dr();default:return w.vr()}}}class U8{constructor(t){this.expr=t}evaluate(t,e){return H(this.expr.params.length===1,50406),new So(new O("not",[new O("is_nan",this.expr.params)])).evaluate(t,e)}}class B8{constructor(t){this.expr=t}evaluate(t,e){switch(H(this.expr.params.length===1,23123),W(this.expr.params[0]).evaluate(t,e).type){case"NULL":return w.newValue(se);case"UNSET":case"ERROR":return w.vr();default:return w.newValue(Dt)}}}class $8{constructor(t){this.expr=t}evaluate(t,e){return H(this.expr.params.length===1,23167),new So(new O("not",[new O("is_null",this.expr.params)])).evaluate(t,e)}}class q8{constructor(t){this.expr=t}evaluate(t,e){return H(this.expr.params.length===1,5228),W(this.expr.params[0]).evaluate(t,e).type==="ERROR"?w.newValue(se):w.newValue(Dt)}}class H8{constructor(t){this.expr=t}evaluate(t,e){switch(H(this.expr.params.length===1,6877),W(this.expr.params[0]).evaluate(t,e).type){case"ERROR":return w.vr();case"UNSET":return w.newValue(Dt);default:return w.newValue(se)}}}class j8{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===3,11706);const n=W(this.expr.params[0]).evaluate(t,e);switch(n.type){case"BOOLEAN":return n.value?.booleanValue?W(this.expr.params[1]).evaluate(t,e):W(this.expr.params[2]).evaluate(t,e);case"NULL":return W(this.expr.params[2]).evaluate(t,e);default:return w.vr()}}}class G8{constructor(t){this.expr=t}evaluate(t,e){const n=this.expr.params.map((i=>W(i).evaluate(t,e)));let s;for(const i of n)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||ie(i.value,s.value)>0?i:s}return s===void 0?w.Dr():s}}class z8{constructor(t){this.expr=t}evaluate(t,e){const n=this.expr.params.map((i=>W(i).evaluate(t,e)));let s;for(const i of n)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||ie(i.value,s.value)<0?i:s}return s===void 0?w.Dr():s}}class br{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);const n=W(this.expr.params[0]).evaluate(t,e);switch(n.type){case"ERROR":case"UNSET":return w.vr()}const s=W(this.expr.params[1]).evaluate(t,e);switch(s.type){case"ERROR":case"UNSET":return w.vr()}return this.Ur(n,s)}}class W8 extends br{constructor(t){super(t),this.expr=t}Ur(t,e){if(t.Fr()&&e.Fr())return w.newValue(se);if(t.Fr()||e.Fr()||oe(t.value)||oe(e.value)||Ct(t.value)!==Ct(e.value))return w.newValue(Dt);switch(We(t.value,e.value)){case"EQ":return w.newValue(se);case"NOT_EQ":return w.newValue(Dt);case"NULL":return w.Dr();default:G(44615,{left:t,right:e})}}}class K8 extends br{constructor(t){super(t),this.expr=t}Ur(t,e){switch(We(t.value,e.value)){case"EQ":return w.newValue(Dt);case"NOT_EQ":case"TYPE_MISMATCH":return w.newValue(se);case"NULL":return w.Dr();default:G(44614,{left:t,right:e})}}}class Y8 extends br{constructor(t){super(t),this.expr=t}Ur(t,e){return Ct(t.value)!==Ct(e.value)||oe(t.value)||oe(e.value)?w.newValue(Dt):w.newValue({booleanValue:ie(t.value,e.value)<0})}}class Q8 extends br{constructor(t){super(t),this.expr=t}Ur(t,e){return Ct(t.value)!==Ct(e.value)||oe(t.value)||oe(e.value)?w.newValue(Dt):We(t.value,e.value)==="EQ"?w.newValue(se):w.newValue({booleanValue:ie(t.value,e.value)<0})}}class X8 extends br{constructor(t){super(t),this.expr=t}Ur(t,e){return Ct(t.value)!==Ct(e.value)||oe(t.value)||oe(e.value)?w.newValue(Dt):w.newValue({booleanValue:ie(t.value,e.value)>0})}}class J8 extends br{constructor(t){super(t),this.expr=t}Ur(t,e){return Ct(t.value)!==Ct(e.value)||oe(t.value)||oe(e.value)?w.newValue(Dt):We(t.value,e.value)==="EQ"?w.newValue(se):w.newValue({booleanValue:ie(t.value,e.value)>0})}}class Z8{constructor(t){this.expr=t}evaluate(t,e){throw new Error("Unimplemented")}}class tm{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===1,216);const n=W(this.expr.params[0]).evaluate(t,e);switch(n.type){case"NULL":return w.Dr();case"ARRAY":{const s=n.value.arrayValue?.values??[];return w.newValue({arrayValue:{values:[...s].reverse()}})}default:return w.vr()}}}class em{constructor(t){this.expr=t}evaluate(t,e){return H(this.expr.params.length===2,52884),new x6(new O("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(t,e)}}class nm{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===2,1392);let n=!1;const s=W(this.expr.params[0]).evaluate(t,e);switch(s.type){case"ARRAY":break;case"NULL":n=!0;break;default:return w.vr()}const i=W(this.expr.params[1]).evaluate(t,e);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return w.vr()}if(n)return w.Dr();const o=i.value?.arrayValue?.values??[],u=s.value?.arrayValue?.values??[];for(const c of o){let h=!1;n=!1;for(const p of u){switch(le(c)&&le(p)?"EQ":We(c,p)){case"EQ":h=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:G(44613,{value:p,search:c})}if(h)break}if(!h)return w.newValue(Dt)}return w.newValue(se)}}class rm{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===2,2680);let n=!1;const s=W(this.expr.params[0]).evaluate(t,e);switch(s.type){case"ARRAY":break;case"NULL":n=!0;break;default:return w.vr()}const i=W(this.expr.params[1]).evaluate(t,e);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return w.vr()}if(n)return w.Dr();const o=i.value?.arrayValue?.values??[],u=s.value?.arrayValue?.values??[];for(const c of u)for(const h of o)switch(le(c)&&le(h)?"EQ":We(c,h)){case"EQ":return w.newValue(se);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:G(44608,{value:c,search:h})}return n?w.Dr():w.newValue(Dt)}}class sm{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===1,38605);const n=W(this.expr.params[0]).evaluate(t,e);switch(n.type){case"NULL":return w.Dr();case"ARRAY":return w.newValue({integerValue:`${n.value?.arrayValue?.values?.length??0}`});default:return w.vr()}}}class im{constructor(t){this.expr=t}evaluate(t,e){throw new Error("Unimplemented")}}class om{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===1,1508);const n=W(this.expr.params[0]).evaluate(t,e);switch(n.type){case"NULL":return w.Dr();case"BYTES":{const s=n.value?.bytesValue;if(typeof s=="string"){const i=St.fromBase64String(s).toUint8Array();return i.reverse(),w.newValue({bytesValue:St.fromUint8Array(i).toBase64()})}return w.newValue({bytesValue:new Uint8Array(s).reverse()})}case"STRING":{const s=n.value?.stringValue,i=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(s),o=Array.from(i,(u=>u.segment)).reverse();return w.newValue({stringValue:o.join("")})}default:return w.vr()}}}class am{constructor(t){this.expr=t}evaluate(t,e){throw new Error("Unimplemented")}}class um{constructor(t){this.expr=t}evaluate(t,e){throw new Error("Unimplemented")}}class cm{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===1,19400);const n=W(this.expr.params[0]).evaluate(t,e);switch(n.type){case"NULL":return w.Dr();case"STRING":{const s=(function(o){let u=0;for(let c=0;c<o.length;c++){const h=o.codePointAt(c);if(h===void 0)return;if(h<=65535)if(h>=55296&&h<=57343)if(h<=56319){const p=o.codePointAt(c+1);p!==void 0&&p>=56320&&p<=57343?(u+=1,c++):u+=1}else u+=1;else u+=1;else{if(!(h<=1114111))return;u+=1,c++}}return u})(n.value.stringValue);return s===void 0?w.vr():w.newValue({integerValue:s})}default:return w.vr()}}}class lm{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===1,8486);const n=W(this.expr.params[0]).evaluate(t,e);switch(n.type){case"BYTES":{const s=n.value?.bytesValue;return typeof s=="string"?w.newValue({integerValue:St.fromBase64String(s).toUint8Array().length}):w.newValue({integerValue:new Uint8Array(s).length})}case"STRING":{const s=(function(o){let u=0;for(let c=0;c<o.length;c++){const h=o.codePointAt(c);if(h===void 0)return;if(h>=55296&&h<=57343){if(!(h<=56319))return;{const p=o.codePointAt(c+1);if(p===void 0||!(p>=56320&&p<=57343))return;u+=4,c++}}else if(h<=127)u+=1;else if(h<=2047)u+=2;else if(h<=65535)u+=3;else{if(!(h<=1114111))return;u+=4,c++}}return u})(n.value?.stringValue);return s===void 0?w.vr():w.newValue({integerValue:s})}case"NULL":return w.Dr();default:return w.vr()}}}class Nr{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let n=!1;const s=W(this.expr.params[0]).evaluate(t,e);switch(s.type){case"STRING":break;case"NULL":n=!0;break;default:return w.vr()}const i=W(this.expr.params[1]).evaluate(t,e);switch(i.type){case"STRING":break;case"NULL":n=!0;break;default:return w.vr()}return n?w.Dr():this.kr(s.value?.stringValue,i.value?.stringValue)}}class hm extends Nr{kr(t,e){try{const n=(function(o){let u="";for(let c=0;c<o.length;c++){const h=o.charAt(c);switch(h){case"_":u+=".";break;case"%":u+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":u+="\\"+h;break;default:u+=h}}return"^"+u+"$"})(e),s=_s.compile(n);return w.newValue({booleanValue:s.matches(t)})}catch(n){return Ie(`Invalid LIKE pattern converted to regex: ${e}, returning error. Error: ${n}`),w.vr()}}}class fm extends Nr{kr(t,e){try{const n=_s.compile(e);return w.newValue({booleanValue:n.matcher(t).find()})}catch{return Ie(`Invalid regex pattern found in regex_contains: ${e}, returning error`),w.vr()}}}class dm extends Nr{kr(t,e){try{return w.newValue({booleanValue:_s.compile(e).matches(t)})}catch{return Ie(`Invalid regex pattern found in regex_match: ${e}, returning error`),w.vr()}}}class pm extends Nr{kr(t,e){return w.newValue({booleanValue:t.includes(e)})}}class mm extends Nr{kr(t,e){return w.newValue({booleanValue:t.startsWith(e)})}}class gm extends Nr{kr(t,e){return w.newValue({booleanValue:t.endsWith(e)})}}class _m{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===1,29079);const n=W(this.expr.params[0]).evaluate(t,e);switch(n.type){case"STRING":return w.newValue({stringValue:n.value?.stringValue?.toLowerCase()});case"NULL":return w.Dr();default:return w.vr()}}}class Em{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===1,60487);const n=W(this.expr.params[0]).evaluate(t,e);switch(n.type){case"STRING":return w.newValue({stringValue:n.value?.stringValue?.toUpperCase()});case"NULL":return w.Dr();default:return w.vr()}}}class ym{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===1,28544);const n=W(this.expr.params[0]).evaluate(t,e);switch(n.type){case"STRING":return w.newValue({stringValue:n.value?.stringValue?.trim()});case"NULL":return w.Dr();default:return w.vr()}}}class Tm{constructor(t){this.expr=t}evaluate(t,e){const n=this.expr.params.map((o=>W(o).evaluate(t,e)));let s="",i=!1;for(const o of n)switch(o.type){case"STRING":s+=o.value.stringValue;break;case"NULL":i=!0;break;default:return w.vr()}return i?w.Dr():w.newValue({stringValue:s})}}class wm{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===2,4483);const n=W(this.expr.params[0]).evaluate(t,e);switch(n.type){case"UNSET":return w.Sr();case"MAP":break;default:return w.vr()}const s=W(this.expr.params[1]).evaluate(t,e);if(s.type!=="STRING")return w.vr();const i=n.value?.mapValue?.fields?.[s.value?.stringValue];return i===void 0?w.Sr():w.newValue(i)}}class D1{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let n=!1;const s=W(this.expr.params[0]).evaluate(t,e);switch(s.type){case"VECTOR":break;case"NULL":n=!0;break;default:return w.vr()}const i=W(this.expr.params[1]).evaluate(t,e);switch(i.type){case"VECTOR":break;case"NULL":n=!0;break;default:return w.vr()}if(n)return w.Dr();const o=ka(s.value),u=ka(i.value);if(o===void 0||u===void 0||o.values?.length!==u.values?.length)return w.vr();const c=this.qr(o,u);return c===void 0||isNaN(c)?w.vr():w.newValue({doubleValue:c})}}class Im extends D1{qr(t,e){const n=t?.values??[],s=e?.values??[];if(n.length===0)return;let i=0,o=0,u=0;for(let h=0;h<n.length;h++){if(!In(n[h])||!In(s[h]))return;const p=Mt(n[h]),_=Mt(s[h]);i+=p*_,o+=p*p,u+=_*_}const c=Math.sqrt(o)*Math.sqrt(u);if(c!==0)return 1-Math.max(-1,Math.min(1,i/c))}}class Am extends D1{qr(t,e){const n=t?.values??[],s=e?.values??[];if(n.length===0)return 0;let i=0;for(let o=0;o<n.length;o++){if(!In(n[o])||!In(s[o]))return;i+=Mt(n[o])*Mt(s[o])}return i}}class vm extends D1{qr(t,e){const n=t?.values??[],s=e?.values??[];if(n.length===0)return 0;let i=0;for(let o=0;o<n.length;o++){if(!In(n[o])||!In(s[o]))return;const u=Mt(n[o]),c=Mt(s[o]);i+=Math.pow(u-c,2)}return Math.sqrt(i)}}class Rm{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===1,39044);const n=W(this.expr.params[0]).evaluate(t,e);switch(n.type){case"VECTOR":{const s=ka(n.value);return w.newValue({integerValue:s?.values?.length??0})}case"NULL":return w.Dr();default:return w.vr()}}}const Os=BigInt(-62135596800),ks=BigInt(253402300799),Xi=BigInt(1e3),_n=BigInt(1e6),Sm=Os*Xi,Cm=ks*Xi+BigInt(999),Pm=Os*_n,bm=ks*_n+BigInt(999999);function x1(r){return r>=Pm&&r<=bm}function L6(r){return r>=Os&&r<=ks}function Vs(r,t){const e=BigInt(r);return!(e<Os||e>ks)&&!(t<0||t>=1e9)&&(e!==Os||t===0)&&!(e===ks&&t>999999999)}function M6(r,t){return t<0?{seconds:r-1,nanos:t+1e9}:{seconds:r,nanos:t}}function L1(r){return BigInt(r.seconds)*_n+BigInt(Math.trunc(r.nanoseconds/1e3))}class M1{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);const n=W(this.expr.params[0]).evaluate(t,e);switch(n.type){case"INT":return this.toTimestamp(BigInt(n.value.integerValue));case"NULL":return w.Dr();default:return w.vr()}}}class Nm extends M1{toTimestamp(t){if(!x1(t))return w.vr();let e=Number(t/_n),n=Number(t%_n*BigInt(1e3));const s=M6(e,n);return e=s.seconds,n=s.nanos,Vs(e,n)?w.newValue({timestampValue:{seconds:e,nanos:n}}):w.vr()}}class Om extends M1{toTimestamp(t){if(!(function(o){return o>=Sm&&o<=Cm})(t))return w.vr();let e=Number(t/Xi),n=Number(t%Xi*BigInt(1e6));const s=M6(e,n);return e=s.seconds,n=s.nanos,Vs(e,n)?w.newValue({timestampValue:{seconds:e,nanos:n}}):w.vr()}}class km extends M1{toTimestamp(t){if(!L6(t))return w.vr();const e=Number(t);return w.newValue({timestampValue:{seconds:e,nanos:0}})}}class F1{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);const n=W(this.expr.params[0]).evaluate(t,e);switch(n.type){case"TIMESTAMP":break;case"NULL":return w.Dr();default:return w.vr()}const s=y1(n.value.timestampValue);return Vs(s.seconds,s.nanoseconds)?this.$r(s):w.vr()}}class Vm extends F1{$r(t){const e=L1(t);return x1(e)?w.newValue({integerValue:`${e.toString()}`}):w.vr()}}class Dm extends F1{$r(t){const e=L1(t),n=e/BigInt(1e3),s=e%BigInt(1e3);return n>BigInt(0)||s===BigInt(0)?w.newValue({integerValue:n.toString()}):w.newValue({integerValue:(n-BigInt(1)).toString()})}}class xm extends F1{$r(t){const e=BigInt(t.seconds);return L6(e)?w.newValue({integerValue:e.toString()}):w.vr()}}class F6{constructor(t){this.expr=t}evaluate(t,e){H(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let n=!1;const s=W(this.expr.params[0]).evaluate(t,e);switch(s.type){case"TIMESTAMP":break;case"NULL":n=!0;break;default:return w.vr()}const i=W(this.expr.params[1]).evaluate(t,e);let o;switch(i.type){case"STRING":if(o=(function(ut){switch(ut){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}})(i.value.stringValue),o===void 0)return w.vr();break;case"NULL":n=!0;break;default:return w.vr()}const u=W(this.expr.params[2]).evaluate(t,e);switch(u.type){case"INT":break;case"NULL":n=!0;break;default:return w.vr()}if(n)return w.Dr();const c=BigInt(u.value.integerValue);let h;try{switch(o){case"microsecond":h=c;break;case"millisecond":h=c*BigInt(1e3);break;case"second":h=c*BigInt(1e6);break;case"minute":h=c*BigInt(6e7);break;case"hour":h=c*BigInt(36e8);break;case"day":h=c*BigInt(864e8);break;default:return w.vr()}if(o!=="microsecond"&&c!==BigInt(0)&&h/c!==BigInt(this.Kr(o)))return w.vr()}catch(J){return Ie(`Error during timestamp arithmetic: ${J}`),w.vr()}const p=y1(s.value.timestampValue);if(!Vs(p.seconds,p.nanoseconds))return w.vr();const _=L1(p),v=this.Wr(_,h);if(!x1(v))return w.vr();const N=Number(v/_n),V=v%_n,M=Number((V<0?V+_n:V)*BigInt(1e3)),$=V<0?N-1:N;return Vs($,M)?w.newValue({timestampValue:{seconds:$,nanos:M}}):w.vr()}Kr(t){switch(t){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}}class Lm extends F6{Wr(t,e){return t+e}}class Mm extends F6{Wr(t,e){return t-e}}function Ds(r){if((r=D6(r))instanceof Ks)return`fld(${r.fieldName})`;if(r instanceof Pr)return`cst(${(function(e){return e===null?"null":typeof e=="number"?e.toString():typeof e=="string"?`"${e}"`:e instanceof At?`ref(${e.path})`:e instanceof re?`vec(${JSON.stringify(e)})`:JSON.stringify(e)})(r.value)})`;if(r instanceof O)return`fn(${r.name},[${r.params.map(Ds).join(",")}])`;if(r.expressionType==="ListOfExpressions")return`list([${r.Rr.map(Ds).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(r,null,2)}`)}function Fm(r){if(r instanceof O6)return`${r._name}(${Ti(r.fields)})`;if(r instanceof k6){let t=`${r._name}(${Ti(r.accumulators)})`;return r.groups.size>0&&(t+=`grouping(${Ti(r.groups)})`),t}if(r instanceof V6)return`${r._name}(${Ti(r.groups)})`;if(r instanceof Ao)return`${r._name}(${r.Vr})`;if(r instanceof vo)return`${r._name}(${r.collectionId})`;if(r instanceof C1)return`${r._name}()`;if(r instanceof P1)return`${r._name}(${r.dr.sort()})`;if(r instanceof b1)return`${r._name}(${Ds(r.condition)})`;if(r instanceof Ns)return`${r._name}(${r.limit})`;if(r instanceof N1)return`${r._name}(${(function(e){return e.map((n=>`${Ds(n.expr)}${n.direction}`)).join(",")})(r.orderings)})`;throw new Error(`Unrecognized stage ${r._name}`)}function Ti(r){return`${Array.from(r.entries()).sort().map((([t,e])=>`${t}=${Ds(e)}`)).join(",")}`}function qe(r){return r.stages.map((t=>Fm(t))).join("|")}function U6(r,t){return qe(r)===qe(t)}function Ot(r){return r instanceof te}function Ul(r){return Ot(r)?qe(r):us(r)}function B6(r){return Ot(r)?qe(r):(function(e){return`${X2(Oe(e))}|lt:${e.limitType}`})(r)}function Co(r,t){return r instanceof te&&t instanceof te?U6(r,t):!(r instanceof te&&!(t instanceof te)||!(r instanceof te)&&t instanceof te)&&l9(r,t)}function $6(r){return Un(r)?qe(r):X2(r)}function q6(r,t){return r instanceof te&&t instanceof te?U6(r,t):!(r instanceof te&&!(t instanceof te)||!(r instanceof te)&&t instanceof te)&&J2(r,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Um{constructor(t,e,n,s){this.batchId=t,this.localWriteTime=e,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(t,e){const n=e.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(t.key)&&W3(i,t,n[s])}}applyToLocalView(t,e){for(const n of this.baseMutations)n.key.isEqual(t.key)&&(e=os(n,t,e,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(t.key)&&(e=os(n,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const n=r6();return this.mutations.forEach((s=>{const i=t.get(s.key),o=i.overlayedDocument;let u=this.applyToLocalView(o,i.mutatedFields);u=e.has(s.key)?null:u;const c=q2(o,u);c!==null&&n.set(s.key,c),o.isValidDocument()||o.convertToNoDocument(X.min())})),n}keys(){return this.mutations.reduce(((t,e)=>t.add(e.key)),rt())}isEqual(t){return this.batchId===t.batchId&&mr(this.mutations,t.mutations,((e,n)=>_l(e,n)))&&mr(this.baseMutations,t.baseMutations,((e,n)=>_l(e,n)))}}class U1{constructor(t,e,n,s){this.batch=t,this.commitVersion=e,this.mutationResults=n,this.docVersions=s}static from(t,e,n){H(t.mutations.length===n.length,58842,{Qr:t.mutations.length,Gr:n.length});let s=(function(){return m9})();const i=t.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,n[o].version);return new U1(t,e,n,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bm{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e{constructor(t,e,n,s,i=X.min(),o=X.min(),u=St.EMPTY_BYTE_STRING,c=null){this.target=t,this.targetId=e,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=u,this.expectedCount=c}withSequenceNumber(t){return new $e(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new $e(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new $e(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new $e(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $m{constructor(t){this.zr=t}}function qm(r){const t=k9({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Da(t,t.limit,"L"):t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hm{constructor(){this.Hi=new jm}addToCollectionParentIndex(t,e){return this.Hi.add(e),D.resolve()}getCollectionParents(t,e){return D.resolve(this.Hi.getEntries(e))}addFieldIndex(t,e){return D.resolve()}deleteFieldIndex(t,e){return D.resolve()}deleteAllFieldIndexes(t){return D.resolve()}createTargetIndexes(t,e){return D.resolve()}getDocumentsMatchingTarget(t,e){return D.resolve(null)}getIndexType(t,e){return D.resolve(0)}getFieldIndexes(t,e){return D.resolve([])}getNextCollectionGroupToUpdate(t){return D.resolve(null)}getMinOffset(t,e){return D.resolve(yn.min())}getMinOffsetFromCollectionGroup(t,e){return D.resolve(yn.min())}updateCollectionGroup(t,e,n){return D.resolve()}updateIndexEntries(t,e){return D.resolve()}}class jm{constructor(){this.index={}}add(t){const e=t.lastSegment(),n=t.popLast(),s=this.index[e]||new vt(lt.comparator),i=!s.has(n);return this.index[e]=s.add(n),i}has(t){const e=t.lastSegment(),n=t.popLast(),s=this.index[e];return s&&s.has(n)}getEntries(t){return(this.index[t]||new vt(lt.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rn{constructor(t){this.Ds=t}next(){return this.Ds+=2,this.Ds}static xs(){return new Rn(0)}static Cs(){return new Rn(-1)}}// Copyright 2024 Google LLC* @license
function H6(r,t){let e=t;for(const n of r.stages)e=zm({serializer:r.serializer,serverTimestampBehavior:r.listenOptions?.serverTimestampBehavior},n,e);return e}function Po(r,t){return H6(r,[t]).length>0}function Gm(r,t){return Ot(r)?Po(r,t):Eo(r,t)}function zm(r,t,e){if(t instanceof Ao)return(function(s,i,o){return o.filter((u=>u.isFoundDocument()&&`/${u.key.getCollectionPath().canonicalString()}`===i.Vr))})(0,t,e);if(t instanceof b1)return(function(s,i,o){return o.filter((u=>{const c=ls(W(i.condition).evaluate(s,u));return c!==void 0&&ge(c,se)}))})(r,t,e);if(t instanceof vo)return(function(s,i,o){return o.filter((u=>u.isFoundDocument()&&u.key.getCollectionPath().lastSegment()===i.collectionId))})(0,t,e);if(t instanceof C1)return(function(s,i,o){return o.filter((u=>u.isFoundDocument()))})(0,0,e);if(t instanceof P1)return(function(s,i,o){return o.filter((u=>u.isFoundDocument()&&i.mr.has(u.key.path.toStringWithLeadingSlash())))})(0,t,e);if(t instanceof Ns)return(function(s,i,o){return o.slice(0,i.limit)})(0,t,e);if(t instanceof N1)return(function(s,i,o){const u=i.orderings.map((c=>({ks:W(c.expr),direction:c.direction})));return[...o].sort(((c,h)=>{for(const{ks:p,direction:_}of u){const v=ls(p.evaluate(s,c)),N=ls(p.evaluate(s,h)),V=ie(v??Er,N??Er);if(V!==0)return _==="ascending"?V:-V}return 0}))})(r,t,e);throw new Error(`Unknown stage: ${t._name}`)}function Ba(r){const t=(function(n){for(let s=n.stages.length-1;s>=0;s--){const i=n.stages[s];if(i instanceof N1)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")})(r);return(e,n)=>{for(const s of t){const i=ls(W(s.expr).evaluate({serializer:r.serializer},e)),o=ls(W(s.expr).evaluate({serializer:r.serializer},n)),u=ie(i||Er,o||Er);if(u!==0)return s.direction==="ascending"?u:-u}return 0}}function ga(r){for(let t=r.stages.length-1;t>=0;t--){const e=r.stages[t];if(e instanceof Ns)return{limit:e.limit}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wm{constructor(){this.changes=new Zn((t=>t.toString()),((t,e)=>t.isEqual(e))),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,Ht.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const n=this.changes.get(e);return n!==void 0?D.resolve(n):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Km{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ym{constructor(t,e,n,s){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=n,this.indexManager=s}getDocument(t,e){let n=null;return this.documentOverlayCache.getOverlay(t,e).next((s=>(n=s,this.remoteDocumentCache.getEntry(t,e)))).next((s=>(n!==null&&os(n.mutation,s,ce.empty(),dt.now()),s)))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next((n=>this.getLocalViewOfDocuments(t,n,rt()).next((()=>n))))}getLocalViewOfDocuments(t,e,n=rt()){const s=ln();return this.populateOverlays(t,s,e).next((()=>this.computeViews(t,e,s,n).next((i=>{let o=or();return i.forEach(((u,c)=>{o=o.insert(u,c.overlayedDocument)})),o}))))}getOverlayedDocuments(t,e){const n=ln();return this.populateOverlays(t,n,e).next((()=>this.computeViews(t,e,n,rt())))}populateOverlays(t,e,n){const s=[];return n.forEach((i=>{e.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(t,s).next((i=>{i.forEach(((o,u)=>{e.set(o,u)}))}))}computeViews(t,e,n,s){let i=ne();const o=cs(),u=(function(){return cs()})();return e.forEach(((c,h)=>{const p=n.get(h.key);s.has(h.key)&&(p===void 0||p.mutation instanceof On)?i=i.insert(h.key,h):p!==void 0?(o.set(h.key,p.mutation.getFieldMask()),os(p.mutation,h,p.mutation.getFieldMask(),dt.now())):o.set(h.key,ce.empty())})),this.recalculateAndSaveOverlays(t,i).next((c=>(c.forEach(((h,p)=>o.set(h,p))),e.forEach(((h,p)=>u.set(h,new Km(p,o.get(h)??null)))),u)))}recalculateAndSaveOverlays(t,e){const n=cs();let s=new pt(((o,u)=>o-u)),i=rt();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next((o=>{for(const u of o)u.keys().forEach((c=>{const h=e.get(c);if(h===null)return;let p=n.get(c)||ce.empty();p=u.applyToLocalView(h,p),n.set(c,p);const _=(s.get(u.batchId)||rt()).add(c);s=s.insert(u.batchId,_)}))})).next((()=>{const o=[],u=s.getReverseIterator();for(;u.hasNext();){const c=u.getNext(),h=c.key,p=c.value,_=r6();p.forEach((v=>{if(!i.has(v)){const N=q2(e.get(v),n.get(v));N!==null&&_.set(v,N),i=i.add(v)}})),o.push(this.documentOverlayCache.saveOverlays(t,h,_))}return D.waitFor(o)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next((n=>this.recalculateAndSaveOverlays(t,n)))}getDocumentsMatchingQuery(t,e,n,s){return Ot(e)?this.getDocumentsMatchingPipeline(t,e,n,s):a9(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):u9(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,n,s):this.getDocumentsMatchingCollectionQuery(t,e,n,s)}getNextDocuments(t,e,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,n,s).next((i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,n.largestBatchId,s-i.size):D.resolve(ln());let u=Es,c=i;return o.next((h=>D.forEach(h,((p,_)=>(u<_.largestBatchId&&(u=_.largestBatchId),i.get(p)?D.resolve():this.remoteDocumentCache.getEntry(t,p).next((v=>{c=c.insert(p,v)}))))).next((()=>this.populateOverlays(t,h,i))).next((()=>this.computeViews(t,c,h,rt()))).next((p=>({batchId:u,changes:n6(p)})))))}))}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new z(e)).next((n=>{let s=or();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s}))}getDocumentsMatchingCollectionGroupQuery(t,e,n,s){const i=e.collectionGroup;let o=or();return this.indexManager.getCollectionParents(t,i).next((u=>D.forEach(u,(c=>{const h=(function(_,v){return new _o(v,null,_.explicitOrderBy.slice(),_.filters.slice(),_.limit,_.limitType,_.startAt,_.endAt)})(e,c.child(i));return this.getDocumentsMatchingCollectionQuery(t,h,n,s).next((p=>{p.forEach(((_,v)=>{o=o.insert(_,v)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(t,e,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,n.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,n,i,s)))).next((o=>this.retrieveMatchingLocalDocuments(i,o,(u=>Eo(e,u)))))}getDocumentsMatchingPipeline(t,e,n,s){if(gn(e)==="collection_group"){const i=k1(e);let o=or();return this.indexManager.getCollectionParents(t,i).next((u=>D.forEach(u,(c=>{const h=(function(_,v){const N=_.stages.map((V=>V instanceof vo?new Ao(v.canonicalString(),{}):V));return new te(_.serializer,N)})(e,c.child(i));return this.getDocumentsMatchingPipeline(t,h,n,s).next((p=>{p.forEach(((_,v)=>{o=o.insert(_,v)}))}))})).next((()=>o))))}{let i;return this.getOverlaysForPipeline(t,e,n.largestBatchId).next((o=>{switch(i=o,gn(e)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,n,i,s);case"documents":let u=rt();for(const c of Ua(e))u=u.add(z.fromPath(c));return this.remoteDocumentCache.getEntries(t,u);case"database":return this.remoteDocumentCache.getAllEntries(t);default:throw new q("invalid-argument",`Invalid pipeline source to execute offline: ${qe(e)}`)}})).next((o=>this.retrieveMatchingLocalDocuments(i,o,(u=>Po(e,u)))))}}retrieveMatchingLocalDocuments(t,e,n){t.forEach(((i,o)=>{const u=o.getKey();e.get(u)===null&&(e=e.insert(u,Ht.newInvalidDocument(u)))}));let s=or();return e.forEach(((i,o)=>{const u=t.get(i);u!==void 0&&os(u.mutation,o,ce.empty(),dt.now()),n(o)&&(s=s.insert(i,o))})),s}getOverlaysForPipeline(t,e,n){switch(gn(e)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(t,lt.fromString(Ro(e)),n);case"collection_group":throw new q("invalid-argument",`Unexpected collection group pipeline: ${qe(e)}`);case"documents":return this.documentOverlayCache.getOverlays(t,Ua(e).map((s=>z.fromPath(s))));case"database":return this.documentOverlayCache.getAllOverlays(t,n);default:throw new q("invalid-argument",`Failed to get overlays for pipeline: ${qe(e)}`)}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qm{constructor(t){this.serializer=t,this.Hs=new Map,this.Js=new Map}getBundleMetadata(t,e){return D.resolve(this.Hs.get(e))}saveBundleMetadata(t,e){return this.Hs.set(e.id,(function(s){return{id:s.id,version:s.version,createTime:ke(s.createTime)}})(e)),D.resolve()}getNamedQuery(t,e){return D.resolve(this.Js.get(e))}saveNamedQuery(t,e){return this.Js.set(e.name,(function(s){return{name:s.name,query:qm(s.bundledQuery),readTime:ke(s.readTime)}})(e)),D.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xm{constructor(){this.overlays=new pt(z.comparator),this.Ys=new Map}getOverlay(t,e){return D.resolve(this.overlays.get(e))}getOverlays(t,e){const n=ln();return D.forEach(e,(s=>this.getOverlay(t,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}getAllOverlays(t,e){const n=ln();return this.overlays.forEach(((s,i)=>{i.largestBatchId>e&&n.set(s,i)})),D.resolve(n)}saveOverlays(t,e,n){return n.forEach(((s,i)=>{this.Hr(t,e,i)})),D.resolve()}removeOverlaysForBatchId(t,e,n){const s=this.Ys.get(n);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Ys.delete(n)),D.resolve()}getOverlaysForCollection(t,e,n){const s=ln(),i=e.length+1,o=new z(e.child("")),u=this.overlays.getIteratorFrom(o);for(;u.hasNext();){const c=u.getNext().value,h=c.getKey();if(!e.isPrefixOf(h.path))break;h.path.length===i&&c.largestBatchId>n&&s.set(c.getKey(),c)}return D.resolve(s)}getOverlaysForCollectionGroup(t,e,n,s){let i=new pt(((h,p)=>h-p));const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===e&&h.largestBatchId>n){let p=i.get(h.largestBatchId);p===null&&(p=ln(),i=i.insert(h.largestBatchId,p)),p.set(h.getKey(),h)}}const u=ln(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach(((h,p)=>u.set(h,p))),!(u.size()>=s)););return D.resolve(u)}Hr(t,e,n){const s=this.overlays.get(n.key);if(s!==null){const o=this.Ys.get(s.largestBatchId).delete(n.key);this.Ys.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new Bm(e,n));let i=this.Ys.get(e);i===void 0&&(i=rt(),this.Ys.set(e,i)),this.Ys.set(e,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jm{constructor(){this.sessionToken=St.EMPTY_BYTE_STRING}getSessionToken(t){return D.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,D.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B1{constructor(){this.Zs=new vt(Vt.Xs),this.e_=new vt(Vt.t_)}isEmpty(){return this.Zs.isEmpty()}addReference(t,e){const n=new Vt(t,e);this.Zs=this.Zs.add(n),this.e_=this.e_.add(n)}n_(t,e){t.forEach((n=>this.addReference(n,e)))}removeReference(t,e){this.r_(new Vt(t,e))}i_(t,e){t.forEach((n=>this.removeReference(n,e)))}s_(t){const e=new z(new lt([])),n=new Vt(e,t),s=new Vt(e,t+1),i=[];return this.e_.forEachInRange([n,s],(o=>{this.r_(o),i.push(o.key)})),i}__(){this.Zs.forEach((t=>this.r_(t)))}r_(t){this.Zs=this.Zs.delete(t),this.e_=this.e_.delete(t)}o_(t){const e=new z(new lt([])),n=new Vt(e,t),s=new Vt(e,t+1);let i=rt();return this.e_.forEachInRange([n,s],(o=>{i=i.add(o.key)})),i}containsKey(t){const e=new Vt(t,0),n=this.Zs.firstAfterOrEqual(e);return n!==null&&t.isEqual(n.key)}}class Vt{constructor(t,e){this.key=t,this.a_=e}static Xs(t,e){return z.comparator(t.key,e.key)||st(t.a_,e.a_)}static t_(t,e){return st(t.a_,e.a_)||z.comparator(t.key,e.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zm{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.gs=1,this.u_=new vt(Vt.Xs)}checkEmpty(t){return D.resolve(this.mutationQueue.length===0)}addMutationBatch(t,e,n,s){const i=this.gs;this.gs++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new Um(i,e,n,s);this.mutationQueue.push(o);for(const u of s)this.u_=this.u_.add(new Vt(u.key,i)),this.indexManager.addToCollectionParentIndex(t,u.key.path.popLast());return D.resolve(o)}lookupMutationBatch(t,e){return D.resolve(this.c_(e))}getNextMutationBatchAfterBatchId(t,e){const n=e+1,s=this.l_(n),i=s<0?0:s;return D.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return D.resolve(this.mutationQueue.length===0?f1:this.gs-1)}getAllMutationBatches(t){return D.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const n=new Vt(e,0),s=new Vt(e,Number.POSITIVE_INFINITY),i=[];return this.u_.forEachInRange([n,s],(o=>{const u=this.c_(o.a_);i.push(u)})),D.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(t,e){let n=new vt(st);return e.forEach((s=>{const i=new Vt(s,0),o=new Vt(s,Number.POSITIVE_INFINITY);this.u_.forEachInRange([i,o],(u=>{n=n.add(u.a_)}))})),D.resolve(this.E_(n))}getAllMutationBatchesAffectingQuery(t,e){const n=e.path,s=n.length+1;let i=n;z.isDocumentKey(i)||(i=i.child(""));const o=new Vt(new z(i),0);let u=new vt(st);return this.u_.forEachWhile((c=>{const h=c.key.path;return!!n.isPrefixOf(h)&&(h.length===s&&(u=u.add(c.a_)),!0)}),o),D.resolve(this.E_(u))}E_(t){const e=[];return t.forEach((n=>{const s=this.c_(n);s!==null&&e.push(s)})),e}removeMutationBatch(t,e){H(this.h_(e.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.u_;return D.forEach(e.mutations,(s=>{const i=new Vt(s.key,e.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(t,s.key)})).next((()=>{this.u_=n}))}bs(t){}containsKey(t,e){const n=new Vt(e,0),s=this.u_.firstAfterOrEqual(n);return D.resolve(e.isEqual(s&&s.key))}performConsistencyCheck(t){return this.mutationQueue.length,D.resolve()}h_(t,e){return this.l_(t)}l_(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}c_(t){const e=this.l_(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tg{constructor(t){this.T_=t,this.docs=(function(){return new pt(z.comparator)})(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const n=e.key,s=this.docs.get(n),i=s?s.size:0,o=this.T_(e);return this.docs=this.docs.insert(n,{document:e.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(t,n.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const n=this.docs.get(e);return D.resolve(n?n.document.mutableCopy():Ht.newInvalidDocument(e))}getEntries(t,e){let n=ne();return e.forEach((s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():Ht.newInvalidDocument(s))})),D.resolve(n)}getAllEntries(t){let e=ne();return this.docs.forEach(((n,s)=>{e=e.insert(n,s.document)})),D.resolve(e)}getDocumentsMatchingQuery(t,e,n,s){let i,o;Ot(e)?(i=lt.fromString(Ro(e)),o=p=>Po(e,p)):(i=e.path,o=p=>Eo(e,p));let u=ne();const c=new z(i.child("__id-9223372036854775808__")),h=this.docs.getIteratorFrom(c);for(;h.hasNext();){const{key:p,value:{document:_}}=h.getNext();if(!i.isPrefixOf(p.path))break;p.path.length>i.length+1||P3(C3(_),n)<=0||(s.has(_.key)||o(_))&&(u=u.insert(_.key,_.mutableCopy()))}return D.resolve(u)}getAllFromCollectionGroup(t,e,n,s){G(9500)}P_(t,e){return D.forEach(this.docs,(n=>e(n)))}newChangeBuffer(t){return new eg(this)}getSize(t){return D.resolve(this.size)}}class eg extends Wm{constructor(t){super(),this.zs=t}applyChanges(t){const e=[];return this.changes.forEach(((n,s)=>{s.isValidDocument()?e.push(this.zs.addEntry(t,s)):this.zs.removeEntry(n)})),D.waitFor(e)}getFromCache(t,e){return this.zs.getEntry(t,e)}getAllFromCache(t,e){return this.zs.getEntries(t,e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ng{constructor(t){this.persistence=t,this.R_=new Zn((e=>$6(e)),q6),this.lastRemoteSnapshotVersion=X.min(),this.highestTargetId=0,this.I_=0,this.A_=new B1,this.targetCount=0,this.V_=Rn.xs()}forEachTarget(t,e){return this.R_.forEach(((n,s)=>e(s))),D.resolve()}getLastRemoteSnapshotVersion(t){return D.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return D.resolve(this.I_)}allocateTargetId(t){return this.highestTargetId=this.V_.next(),D.resolve(this.highestTargetId)}setTargetsMetadata(t,e,n){return n&&(this.lastRemoteSnapshotVersion=n),e>this.I_&&(this.I_=e),D.resolve()}Ms(t){this.R_.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.V_=new Rn(e),this.highestTargetId=e),t.sequenceNumber>this.I_&&(this.I_=t.sequenceNumber)}addTargetData(t,e){return this.Ms(e),this.targetCount+=1,D.resolve()}updateTargetData(t,e){return this.Ms(e),D.resolve()}removeTargetData(t,e){return this.R_.delete(e.target),this.A_.s_(e.targetId),this.targetCount-=1,D.resolve()}removeTargets(t,e,n){let s=0;const i=[];return this.R_.forEach(((o,u)=>{u.sequenceNumber<=e&&n.get(u.targetId)===null&&(this.R_.delete(o),i.push(this.removeMatchingKeysForTargetId(t,u.targetId)),s++)})),D.waitFor(i).next((()=>s))}getTargetCount(t){return D.resolve(this.targetCount)}getTargetData(t,e){const n=this.R_.get(e)||null;return D.resolve(n)}addMatchingKeys(t,e,n){return this.A_.n_(e,n),D.resolve()}removeMatchingKeys(t,e,n){this.A_.i_(e,n);const s=this.persistence.referenceDelegate,i=[];return s&&e.forEach((o=>{i.push(s.markPotentiallyOrphaned(t,o))})),D.waitFor(i)}removeMatchingKeysForTargetId(t,e){return this.A_.s_(e),D.resolve()}getMatchingKeysForTargetId(t,e){const n=this.A_.o_(e);return D.resolve(n)}containsKey(t,e){return D.resolve(this.A_.containsKey(e))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j6{constructor(t,e){this.d_={},this.overlays={},this.f_=new lo(0),this.m_=!1,this.m_=!0,this.p_=new Jm,this.referenceDelegate=t(this),this.g_=new ng(this),this.indexManager=new Hm,this.remoteDocumentCache=(function(s){return new tg(s)})((n=>this.referenceDelegate.y_(n))),this.serializer=new $m(e),this.w_=new Qm(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.m_=!1,Promise.resolve()}get started(){return this.m_}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new Xm,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let n=this.d_[t.toKey()];return n||(n=new Zm(e,this.referenceDelegate),this.d_[t.toKey()]=n),n}getGlobalsCache(){return this.p_}getTargetCache(){return this.g_}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.w_}runTransaction(t,e,n){U("MemoryPersistence","Starting transaction:",t);const s=new rg(this.f_.next());return this.referenceDelegate.b_(),n(s).next((i=>this.referenceDelegate.v_(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}S_(t,e){return D.or(Object.values(this.d_).map((n=>()=>n.containsKey(t,e))))}}class rg extends N3{constructor(t){super(),this.currentSequenceNumber=t}}class $1{constructor(t){this.persistence=t,this.D_=new B1,this.x_=null}static C_(t){return new $1(t)}get F_(){if(this.x_)return this.x_;throw G(60996)}addReference(t,e,n){return this.D_.addReference(n,e),this.F_.delete(n.toString()),D.resolve()}removeReference(t,e,n){return this.D_.removeReference(n,e),this.F_.add(n.toString()),D.resolve()}markPotentiallyOrphaned(t,e){return this.F_.add(e.toString()),D.resolve()}removeTarget(t,e){this.D_.s_(e.targetId).forEach((s=>this.F_.add(s.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(t,e.targetId).next((s=>{s.forEach((i=>this.F_.add(i.toString())))})).next((()=>n.removeTargetData(t,e)))}b_(){this.x_=new Set}v_(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return D.forEach(this.F_,(n=>{const s=z.fromPath(n);return this.O_(t,s).next((i=>{i||e.removeEntry(s,X.min())}))})).next((()=>(this.x_=null,e.apply(t))))}updateLimboDocument(t,e){return this.O_(t,e).next((n=>{n?this.F_.delete(e.toString()):this.F_.add(e.toString())}))}y_(t){return 0}O_(t,e){return D.or([()=>D.resolve(this.D_.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.S_(t,e)])}}class Ji{constructor(t,e){this.persistence=t,this.M_=new Zn((n=>D3(n.path)),((n,s)=>n.isEqual(s))),this.garbageCollector=n8(this,e)}static C_(t,e){return new Ji(t,e)}b_(){}v_(t){return D.resolve()}forEachTarget(t,e){return this.persistence.getTargetCache().forEachTarget(t,e)}lr(t){const e=this.Ls(t);return this.persistence.getTargetCache().getTargetCount(t).next((n=>e.next((s=>n+s))))}Ls(t){let e=0;return this.Er(t,(n=>{e++})).next((()=>e))}Er(t,e){return D.forEach(this.M_,((n,s)=>this.Us(t,n,s).next((i=>i?D.resolve():e(s)))))}removeTargets(t,e,n){return this.persistence.getTargetCache().removeTargets(t,e,n)}removeOrphanedDocuments(t,e){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.P_(t,(o=>this.Us(t,o,e).next((u=>{u||(n++,i.removeEntry(o,X.min()))})))).next((()=>i.apply(t))).next((()=>n))}markPotentiallyOrphaned(t,e){return this.M_.set(e,t.currentSequenceNumber),D.resolve()}removeTarget(t,e){const n=e.withSequenceNumber(t.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(t,n)}addReference(t,e,n){return this.M_.set(n,t.currentSequenceNumber),D.resolve()}removeReference(t,e,n){return this.M_.set(n,t.currentSequenceNumber),D.resolve()}updateLimboDocument(t,e){return this.M_.set(e,t.currentSequenceNumber),D.resolve()}y_(t){let e=t.key.toString().length;return t.isFoundDocument()&&(e+=Si(t.data.value)),e}Us(t,e,n){return D.or([()=>this.persistence.S_(t,e),()=>this.persistence.getTargetCache().containsKey(t,e),()=>{const s=this.M_.get(e);return D.resolve(s!==void 0&&s>n)}])}getCacheSize(t){return this.persistence.getRemoteDocumentCache().getSize(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q1{constructor(t,e,n,s){this.targetId=t,this.fromCache=e,this.wo=n,this.bo=s}static vo(t,e){let n=rt(),s=rt();for(const i of e.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new q1(t,e.fromCache,n,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sg(r,t){return z.comparator(r.key,t.key)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ig{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class og{constructor(){this.So=!1,this.Do=!1,this.xo=100,this.Co=(function(){return ad()?8:O3(jt())>0?6:4})()}initialize(t,e){this.Fo=t,this.indexManager=e,this.So=!0}getDocumentsMatchingQuery(t,e,n,s){const i={result:null};return this.Oo(t,e).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.Mo(t,e,s,n).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;const o=new ig;return this.No(t,e,o).next((u=>{if(i.result=u,this.Do)return this.Lo(t,e,o,u.size)}))})).next((()=>i.result))}Lo(t,e,n,s){return Ot(e)?D.resolve():n.documentReadCount<this.xo?(ir()<=it.DEBUG&&U("QueryEngine","SDK will not create cache indexes for query:",us(e),"since it only creates cache indexes for collection contains","more than or equal to",this.xo,"documents"),D.resolve()):(ir()<=it.DEBUG&&U("QueryEngine","Query:",us(e),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.Co*s?(ir()<=it.DEBUG&&U("QueryEngine","The SDK decides to create cache indexes for query:",us(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,Oe(e))):D.resolve())}Oo(t,e){if(Ot(e))return D.resolve(null);let n=e;if(Al(n))return D.resolve(null);let s=Oe(n);return this.indexManager.getIndexType(t,s).next((i=>i===0?null:(n.limit!==null&&i===1&&(n=Da(n,null,"F"),s=Oe(n)),this.indexManager.getDocumentsMatchingTarget(t,s).next((o=>{const u=rt(...o);return this.Fo.getDocuments(t,u).next((c=>this.indexManager.getMinOffset(t,s).next((h=>{const p=this.Bo(n,c);return this.Uo(n,p,u,h.readTime)?this.Oo(t,Da(n,null,"F")):this.ko(t,p,n,h)}))))})))))}Mo(t,e,n,s){return(Ot(e)?(function(o){for(const u of o.stages){if(u instanceof Ns||u instanceof Fl)return!1;if(u instanceof b1){if(u.condition instanceof P6&&u.condition._expr.name==="exists"&&u.condition._expr.params[0]instanceof Ks&&u.condition._expr.params[0].fieldName===gr)continue;return!1}}return!0})(e):Al(e))||s.isEqual(X.min())?D.resolve(null):this.Fo.getDocuments(t,n).next((i=>{const o=this.Bo(e,i);return this.Uo(e,o,n,s)?D.resolve(null):(ir()<=it.DEBUG&&U("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Ul(e)),this.ko(t,o,e,S3(s,Es)).next((u=>u)))}))}Bo(t,e){let n,s;return Ot(t)?(n=new vt(sg),s=i=>Po(t,i)):(n=new vt(_1(t)),s=i=>Eo(t,i)),e.forEach(((i,o)=>{s(o)&&(n=n.add(o))})),n}Uo(t,e,n,s){if(Ot(t))return(function(u){return u.stages.some((c=>c instanceof Ns||c instanceof Fl))})(t);if(t.limit===null)return!1;if(n.size!==e.size)return!0;const i=t.limitType==="F"?e.last():e.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}No(t,e,n){return ir()<=it.DEBUG&&U("QueryEngine","Using full collection scan to execute query:",Ul(e)),this.Fo.getDocumentsMatchingQuery(t,e,yn.min(),n)}ko(t,e,n,s){return this.Fo.getDocumentsMatchingQuery(t,n,s).next((i=>(e.forEach((o=>{i=i.insert(o.key,o)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H1="LocalStore",ag=3e8;class ug{constructor(t,e,n,s){this.persistence=t,this.qo=e,this.serializer=s,this.$o=new pt(st),this.Ko=new Zn((i=>$6(i)),q6),this.Wo=new Map,this.Qo=t.getRemoteDocumentCache(),this.g_=t.getTargetCache(),this.w_=t.getBundleCache(),this.Go(n)}Go(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new Ym(this.Qo,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Qo.setIndexManager(this.indexManager),this.qo.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(e=>t.collect(e,this.$o)))}}function cg(r,t,e,n){return new ug(r,t,e,n)}async function G6(r,t){const e=Z(r);return await e.persistence.runTransaction("Handle user change","readonly",(n=>{let s;return e.mutationQueue.getAllMutationBatches(n).next((i=>(s=i,e.Go(t),e.mutationQueue.getAllMutationBatches(n)))).next((i=>{const o=[],u=[];let c=rt();for(const h of s){o.push(h.batchId);for(const p of h.mutations)c=c.add(p.key)}for(const h of i){u.push(h.batchId);for(const p of h.mutations)c=c.add(p.key)}return e.localDocuments.getDocuments(n,c).next((h=>({zo:h,removedBatchIds:o,addedBatchIds:u})))}))}))}function lg(r,t){const e=Z(r);return e.persistence.runTransaction("Acknowledge batch","readwrite-primary",(n=>{const s=t.batch.keys(),i=e.Qo.newChangeBuffer({trackRemovals:!0});return(function(u,c,h,p){const _=h.batch,v=_.keys();let N=D.resolve();return v.forEach((V=>{N=N.next((()=>p.getEntry(c,V))).next((M=>{const $=h.docVersions.get(V);H($!==null,48541),M.version.compareTo($)<0&&(_.applyToRemoteDocument(M,h),M.isValidDocument()&&(M.setReadTime(h.commitVersion),p.addEntry(M)))}))})),N.next((()=>u.mutationQueue.removeMutationBatch(c,_)))})(e,n,t,i).next((()=>i.apply(n))).next((()=>e.mutationQueue.performConsistencyCheck(n))).next((()=>e.documentOverlayCache.removeOverlaysForBatchId(n,s,t.batch.batchId))).next((()=>e.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,(function(u){let c=rt();for(let h=0;h<u.mutationResults.length;++h)u.mutationResults[h].transformResults.length>0&&(c=c.add(u.batch.mutations[h].key));return c})(t)))).next((()=>e.localDocuments.getDocuments(n,s)))}))}function z6(r){const t=Z(r);return t.persistence.runTransaction("Get last remote snapshot version","readonly",(e=>t.g_.getLastRemoteSnapshotVersion(e)))}function hg(r,t){const e=Z(r),n=t.snapshotVersion;let s=e.$o;return e.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const o=e.Qo.newChangeBuffer({trackRemovals:!0});s=e.$o;const u=[];t.targetChanges.forEach(((p,_)=>{const v=s.get(_);if(!v)return;u.push(e.g_.removeMatchingKeys(i,p.removedDocuments,_).next((()=>e.g_.addMatchingKeys(i,p.addedDocuments,_))));let N=v.withSequenceNumber(i.currentSequenceNumber);t.targetMismatches.get(_)!==null?N=N.withResumeToken(St.EMPTY_BYTE_STRING,X.min()).withLastLimboFreeSnapshotVersion(X.min()):p.resumeToken.approximateByteSize()>0&&(N=N.withResumeToken(p.resumeToken,n)),s=s.insert(_,N),(function(M,$,J){return M.resumeToken.approximateByteSize()===0||$.snapshotVersion.toMicroseconds()-M.snapshotVersion.toMicroseconds()>=ag?!0:J.addedDocuments.size+J.modifiedDocuments.size+J.removedDocuments.size>0})(v,N,p)&&u.push(e.g_.updateTargetData(i,N))}));let c=ne(),h=rt();if(t.documentUpdates.forEach((p=>{t.resolvedLimboDocuments.has(p)&&u.push(e.persistence.referenceDelegate.updateLimboDocument(i,p))})),u.push(fg(i,o,t.documentUpdates).next((p=>{c=p.jo,h=p.Ho}))),!n.isEqual(X.min())){const p=e.g_.getLastRemoteSnapshotVersion(i).next((_=>e.g_.setTargetsMetadata(i,i.currentSequenceNumber,n)));u.push(p)}return D.waitFor(u).next((()=>o.apply(i))).next((()=>e.localDocuments.getLocalViewOfDocuments(i,c,h))).next((()=>c))})).then((i=>(e.$o=s,i)))}function fg(r,t,e){let n=rt(),s=rt();return e.forEach((i=>n=n.add(i))),t.getEntries(r,n).next((i=>{let o=ne();return e.forEach(((u,c)=>{const h=i.get(u);c.isFoundDocument()!==h.isFoundDocument()&&(s=s.add(u)),c.isNoDocument()&&c.version.isEqual(X.min())?(t.removeEntry(u,c.readTime),o=o.insert(u,c)):!h.isValidDocument()||c.version.compareTo(h.version)>0||c.version.compareTo(h.version)===0&&h.hasPendingWrites?(t.addEntry(c),o=o.insert(u,c)):U(H1,"Ignoring outdated watch update for ",u,". Current version:",h.version," Watch version:",c.version)})),{jo:o,Ho:s}}))}function dg(r,t){const e=Z(r);return e.persistence.runTransaction("Get next mutation batch","readonly",(n=>(t===void 0&&(t=f1),e.mutationQueue.getNextMutationBatchAfterBatchId(n,t))))}function pg(r,t){const e=Z(r);return e.persistence.runTransaction("Allocate target","readwrite",(n=>{let s;return e.g_.getTargetData(n,t).next((i=>i?(s=i,D.resolve(s)):e.g_.allocateTargetId(n).next((o=>(s=new $e(t,o,"TargetPurposeListen",n.currentSequenceNumber),e.g_.addTargetData(n,s).next((()=>s)))))))})).then((n=>{const s=e.$o.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(e.$o=e.$o.insert(n.targetId,n),e.Ko.set(t,n.targetId)),n}))}async function $a(r,t,e){const n=Z(r),s=n.$o.get(t),i=e?"readwrite":"readwrite-primary";try{e||await n.persistence.runTransaction("Release target",i,(o=>n.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!Cr(o))throw o;U(H1,`Failed to update sequence numbers for target ${t}: ${o}`)}n.$o=n.$o.remove(t),n.Ko.delete(s.target)}function Bl(r,t,e){const n=Z(r);let s=X.min(),i=rt();return n.persistence.runTransaction("Execute query","readwrite",(o=>(function(c,h,p){const _=Z(c),v=_.Ko.get(p);return v!==void 0?D.resolve(_.$o.get(v)):_.g_.getTargetData(h,p)})(n,o,Ot(t)?t:Oe(t)).next((u=>{if(u)return s=u.lastLimboFreeSnapshotVersion,n.g_.getMatchingKeysForTargetId(o,u.targetId).next((c=>{i=c}))})).next((()=>n.qo.getDocumentsMatchingQuery(o,t,e?s:X.min(),e?i:rt()))).next((u=>(mg(n,u),{documents:u,Jo:i})))))}function mg(r,t){t.forEach(((e,n)=>{const s=n.key.getCollectionGroup(),i=r.Wo.get(s)||X.min();n.readTime.compareTo(i)>0&&r.Wo.set(s,n.readTime)}))}class $l{constructor(){this.activeTargetIds=E9()}na(t){this.activeTargetIds=this.activeTargetIds.add(t)}ra(t){this.activeTargetIds=this.activeTargetIds.delete(t)}ta(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class gg{constructor(){this.Ua=new $l,this.ka={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,n){}addLocalQueryTarget(t,e=!0){return e&&this.Ua.na(t),this.ka[t]||"not-current"}updateQueryState(t,e,n){this.ka[t]=e}removeLocalQueryTarget(t){this.Ua.ra(t)}isLocalQueryTarget(t){return this.Ua.activeTargetIds.has(t)}clearQueryState(t){delete this.ka[t]}getAllActiveQueryTargets(){return this.Ua.activeTargetIds}isActiveQueryTarget(t){return this.Ua.activeTargetIds.has(t)}start(){return this.Ua=new $l,Promise.resolve()}handleUserChange(t,e,n){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}function _a(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _g{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.qa=0,this.$a=null,this.Ka=!0}Wa(){this.qa===0&&(this.Qa("Unknown"),this.$a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.$a=null,this.Ga("Backend didn't respond within 10 seconds."),this.Qa("Offline"),Promise.resolve()))))}za(t){this.state==="Online"?this.Qa("Unknown"):(this.qa++,this.qa>=1&&(this.ja(),this.Ga(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.Qa("Offline")))}set(t){this.ja(),this.qa=0,t==="Online"&&(this.Ka=!1),this.Qa(t)}Qa(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}Ga(t){const e=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Ka?(ze(e),this.Ka=!1):U("OnlineStateTracker",e)}ja(){this.$a!==null&&(this.$a.cancel(),this.$a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Me="RemoteStore";class Eg{constructor(t,e,n,s,i){this.localStore=t,this.datastore=e,this.asyncQueue=n,this.remoteSyncer={},this.Ha=[],this.Ja=new Map,this.Ya=new Map,this.Za=new Map,this.Xa=new Rn(1e3),this.eu=new Rn(1001),this.tu=new Set,this.nu=[],this.ru=i,this.ru.bt((o=>{n.enqueueAndForget((async()=>{er(this)&&(U(Me,"Restarting streams for network reachability change."),await(async function(c){const h=Z(c);h.tu.add(4),await Qs(h),h.iu.set("Unknown"),h.tu.delete(4),await bo(h)})(this))}))})),this.iu=new _g(n,s)}}async function bo(r){if(er(r))for(const t of r.nu)await t(!0)}async function Qs(r){for(const t of r.nu)await t(!1)}function qa(r,t){return r.Ya.get(t)||void 0}function W6(r,t){const e=Z(r),n=qa(e,t.targetId);if(n!==void 0&&e.Ja.has(n))return;const s=(function(u,c){const h=qa(u,c);h!==void 0&&u.Za.delete(h);const p=(function(v,N){return N%2!=0?v.eu.next():v.Xa.next()})(u,c);return u.Ya.set(c,p),u.Za.set(p,c),p})(e,t.targetId);U(Me,"remoteStoreListen mapping SDK target ID to remote",t.targetId,s);const i=new $e(t.target,s,t.purpose,t.sequenceNumber,t.snapshotVersion,t.lastLimboFreeSnapshotVersion,t.resumeToken);e.Ja.set(s,i),W1(e)?z1(e):Or(e).Fn()&&G1(e,i)}function j1(r,t){const e=Z(r),n=Or(e),s=qa(e,t);U(Me,"remoteStoreUnlisten removing mapping of SDK target ID to remote",t,s),e.Ja.delete(s),e.Ya.delete(t),e.Za.delete(s),n.Fn()&&K6(e,s),e.Ja.size===0&&(n.Fn()?n.Nn():er(e)&&e.iu.set("Unknown"))}function G1(r,t){if(r.su.We(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(X.min())>0){const e=r.Za.get(t.targetId);if(e===void 0)return void U(Me,"SDK target ID not found for remote ID: "+t.targetId);const n=r.remoteSyncer.getRemoteKeysForTarget(e).size;t=t.withExpectedCount(n)}Or(r).jn(t)}function K6(r,t){r.su.We(t),Or(r).Hn(t)}function z1(r){r.su=new w9({getRemoteKeysForTarget:t=>{const e=r.Za.get(t);return e!==void 0?r.remoteSyncer.getRemoteKeysForTarget(e):rt()},dt:t=>r.Ja.get(t)||null,Tt:()=>r.datastore.serializer.databaseId}),Or(r).start(),r.iu.Wa()}function W1(r){return er(r)&&!Or(r).Cn()&&r.Ja.size>0}function er(r){return Z(r).tu.size===0}function Y6(r){r.su=void 0}async function yg(r){r.iu.set("Online")}async function Tg(r){r.Ja.forEach(((t,e)=>{G1(r,t)}))}async function wg(r,t){Y6(r),W1(r)?(r.iu.za(t),z1(r)):r.iu.set("Unknown")}async function Ig(r,t,e){if(r.iu.set("Online"),t instanceof i6&&t.state===2&&t.cause)try{await(async function(s,i){const o=i.cause;for(const u of i.targetIds){if(s.Ja.has(u)){const c=s.Za.get(u);c!==void 0&&(await s.remoteSyncer.rejectListen(c,o),s.Ya.delete(c),s.Za.delete(u)),s.Ja.delete(u)}s.su.removeTarget(u)}})(r,t)}catch(n){U(Me,"Failed to remove targets %s: %s ",t.targetIds.join(","),n),await Zi(r,n)}else if(t instanceof Pi?r.su.et(t):t instanceof s6?r.su.ot(t):r.su.rt(t),!e.isEqual(X.min()))try{const n=await z6(r.localStore);e.compareTo(n)>=0&&await(function(i,o){const u=i.su.Rt(o);u.targetChanges.forEach(((h,p)=>{if(h.resumeToken.approximateByteSize()>0){const _=i.Ja.get(p);_&&i.Ja.set(p,_.withResumeToken(h.resumeToken,o))}})),u.targetMismatches.forEach(((h,p)=>{const _=i.Ja.get(h);if(!_)return;i.Ja.set(h,_.withResumeToken(St.EMPTY_BYTE_STRING,_.snapshotVersion)),K6(i,h);const v=new $e(_.target,h,p,_.sequenceNumber);G1(i,v)}));const c=(function(p,_){const v=new Map;_.targetChanges.forEach(((V,M)=>{const $=p.Za.get(M);$!==void 0&&v.set($,V)}));let N=new pt(st);return _.targetMismatches.forEach(((V,M)=>{const $=p.Za.get(V);$!==void 0&&(N=N.insert($,M))})),new zs(_.snapshotVersion,v,N,_.documentUpdates,_.augmentedDocumentUpdates,_.resolvedLimboDocuments)})(i,u);return i.remoteSyncer.applyRemoteEvent(c)})(r,e)}catch(n){U(Me,"Failed to raise snapshot:",n),await Zi(r,n)}}async function Zi(r,t,e){if(!Cr(t))throw t;r.tu.add(1),await Qs(r),r.iu.set("Offline"),e||(e=()=>z6(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{U(Me,"Retrying IndexedDB access"),await e(),r.tu.delete(1),await bo(r)}))}function Q6(r,t){return t().catch((e=>Zi(r,e,t)))}async function No(r){const t=Z(r),e=Sn(t);let n=t.Ha.length>0?t.Ha[t.Ha.length-1].batchId:f1;for(;Ag(t);)try{const s=await dg(t.localStore,n);if(s===null){t.Ha.length===0&&e.Nn();break}n=s.batchId,vg(t,s)}catch(s){await Zi(t,s)}X6(t)&&J6(t)}function Ag(r){return er(r)&&r.Ha.length<10}function vg(r,t){r.Ha.push(t);const e=Sn(r);e.Fn()&&e.Jn&&e.Yn(t.mutations)}function X6(r){return er(r)&&!Sn(r).Cn()&&r.Ha.length>0}function J6(r){Sn(r).start()}async function Rg(r){Sn(r).er()}async function Sg(r){const t=Sn(r);for(const e of r.Ha)t.Yn(e.mutations)}async function Cg(r,t,e){const n=r.Ha.shift(),s=U1.from(n,t,e);await Q6(r,(()=>r.remoteSyncer.applySuccessfulWrite(s))),await No(r)}async function Pg(r,t){t&&Sn(r).Jn&&await(async function(n,s){if((function(o){return d9(o)&&o!==x.ABORTED})(s.code)){const i=n.Ha.shift();Sn(n).Mn(),await Q6(n,(()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s))),await No(n)}})(r,t),X6(r)&&J6(r)}async function ql(r,t){const e=Z(r);e.asyncQueue.verifyOperationInProgress(),U(Me,"RemoteStore received new credentials");const n=er(e);e.tu.add(3),await Qs(e),n&&e.iu.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.tu.delete(3),await bo(e)}async function bg(r,t){const e=Z(r);t?(e.tu.delete(2),await bo(e)):t||(e.tu.add(2),await Qs(e),e.iu.set("Unknown"))}function Or(r){return r._u||(r._u=(function(e,n,s){const i=Z(e);return i.nr(),new G9(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Qt:yg.bind(null,r),zt:Tg.bind(null,r),Ht:wg.bind(null,r),zn:Ig.bind(null,r)}),r.nu.push((async t=>{t?(r._u.Mn(),W1(r)?z1(r):r.iu.set("Unknown")):(await r._u.stop(),Y6(r))}))),r._u}function Sn(r){return r.ou||(r.ou=(function(e,n,s){const i=Z(e);return i.nr(),new z9(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Qt:()=>Promise.resolve(),zt:Rg.bind(null,r),Ht:Pg.bind(null,r),Zn:Sg.bind(null,r),Xn:Cg.bind(null,r)}),r.nu.push((async t=>{t?(r.ou.Mn(),await No(r)):(await r.ou.stop(),r.Ha.length>0&&(U(Me,`Stopping write stream with ${r.Ha.length} pending writes`),r.Ha=[]))}))),r.ou}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K1{constructor(t,e,n,s,i){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new mn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(t,e,n,s,i){const o=Date.now()+n,u=new K1(t,e,o,s,i);return u.start(n),u}start(t){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new q(x.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((t=>this.deferred.resolve(t)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Y1(r,t){if(ze("AsyncQueue",`${t}: ${r}`),Cr(r))return new q(x.UNAVAILABLE,`${t}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hn{static emptySet(t){return new Hn(t.comparator)}constructor(t){this.comparator=t?(e,n)=>t(e,n)||z.comparator(e.key,n.key):(e,n)=>z.comparator(e.key,n.key),this.keyedMap=or(),this.sortedSet=new pt(this.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal(((e,n)=>(t(e),!1)))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof Hn)||this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),n=t.sortedSet.getIterator();for(;e.hasNext();){const s=e.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const t=[];return this.forEach((e=>{t.push(e.toString())})),t.length===0?"DocumentSet ()":`DocumentSet (
  `+t.join(`  
`)+`
)`}copy(t,e){const n=new Hn;return n.comparator=this.comparator,n.keyedMap=t,n.sortedSet=e,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hl{constructor(){this.au=new pt(z.comparator)}track(t){const e=t.doc.key,n=this.au.get(e);n?t.type!==0&&n.type===3?this.au=this.au.insert(e,t):t.type===3&&n.type!==1?this.au=this.au.insert(e,{type:n.type,doc:t.doc}):t.type===2&&n.type===2?this.au=this.au.insert(e,{type:2,doc:t.doc}):t.type===2&&n.type===0?this.au=this.au.insert(e,{type:0,doc:t.doc}):t.type===1&&n.type===0?this.au=this.au.remove(e):t.type===1&&n.type===2?this.au=this.au.insert(e,{type:1,doc:n.doc}):t.type===0&&n.type===1?this.au=this.au.insert(e,{type:2,doc:t.doc}):G(63341,{ft:t,uu:n}):this.au=this.au.insert(e,t)}cu(){const t=[];return this.au.inorderTraversal(((e,n)=>{t.push(n)})),t}}class Ir{constructor(t,e,n,s,i,o,u,c,h){this.query=t,this.docs=e,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=u,this.excludesMetadataChanges=c,this.hasCachedResults=h}static fromInitialDocuments(t,e,n,s,i){const o=[];return e.forEach((u=>{o.push({type:0,doc:u})})),new Ir(t,e,Hn.emptySet(e),o,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&Co(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,n=t.docChanges;if(e.length!==n.length)return!1;for(let s=0;s<e.length;s++)if(e[s].type!==n[s].type||!e[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ng{constructor(){this.lu=void 0,this.Eu=[]}hu(){return this.Eu.some((t=>t.Tu()))}}class Og{constructor(){this.queries=jl(),this.onlineState="Unknown",this.Pu=new Set}terminate(){(function(e,n){const s=Z(e),i=s.queries;s.queries=jl(),i.forEach(((o,u)=>{for(const c of u.Eu)c.onError(n)}))})(this,new q(x.ABORTED,"Firestore shutting down"))}}function jl(){return new Zn((r=>B6(r)),Co)}async function kg(r,t){const e=Z(r);let n=3;const s=t.query;let i=e.queries.get(s);i?!i.hu()&&t.Tu()&&(n=2):(i=new Ng,n=t.Tu()?0:1);try{switch(n){case 0:i.lu=await e.onListen(s,!0);break;case 1:i.lu=await e.onListen(s,!1);break;case 2:await e.onFirstRemoteStoreListen(s)}}catch(o){const u=Y1(o,`Initialization of query '${Ot(t.query)?qe(t.query):us(t.query)}' failed`);return void t.onError(u)}e.queries.set(s,i),i.Eu.push(t),t.Ru(e.onlineState),i.lu&&t.Iu(i.lu)&&Q1(e)}async function Vg(r,t){const e=Z(r),n=t.query;let s=3;const i=e.queries.get(n);if(i){const o=i.Eu.indexOf(t);o>=0&&(i.Eu.splice(o,1),i.Eu.length===0?s=t.Tu()?0:1:!i.hu()&&t.Tu()&&(s=2))}switch(s){case 0:return e.queries.delete(n),e.onUnlisten(n,!0);case 1:return e.queries.delete(n),e.onUnlisten(n,!1);case 2:return e.onLastRemoteStoreUnlisten(n);default:return}}function Dg(r,t){const e=Z(r);let n=!1;for(const s of t){const i=s.query,o=e.queries.get(i);if(o){for(const u of o.Eu)u.Iu(s)&&(n=!0);o.lu=s}}n&&Q1(e)}function xg(r,t,e){const n=Z(r),s=n.queries.get(t);if(s)for(const i of s.Eu)i.onError(e);n.queries.delete(t)}function Q1(r){r.Pu.forEach((t=>{t.next()}))}var Ha;(function(r){r.Default="default",r.Cache="cache"})(Ha||(Ha={}));class Lg{constructor(t,e,n){this.query=t,this.Au=e,this.Vu=!1,this.du=null,this.onlineState="Unknown",this.options=n||{}}Iu(t){if(!this.options.includeMetadataChanges){const n=[];for(const s of t.docChanges)s.type!==3&&n.push(s);t=new Ir(t.query,t.docs,t.oldDocs,n,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.Vu?this.fu(t)&&(this.Au.next(t),e=!0):this.mu(t,this.onlineState)&&(this.pu(t),e=!0),this.du=t,e}onError(t){this.Au.error(t)}Ru(t){this.onlineState=t;let e=!1;return this.du&&!this.Vu&&this.mu(this.du,t)&&(this.pu(this.du),e=!0),e}mu(t,e){if(!t.fromCache||!this.Tu())return!0;const n=e!=="Offline";return(!this.options.waitForSyncWhenOnline||!n)&&(!t.docs.isEmpty()||t.hasCachedResults||e==="Offline")}fu(t){if(t.docChanges.length>0)return!0;const e=this.du&&this.du.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&this.options.includeMetadataChanges===!0}pu(t){t=Ir.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.Vu=!0,this.Au.next(t)}Tu(){return this.options.source!==Ha.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z6{constructor(t){this.key=t}}class tf{constructor(t){this.key=t}}class Mg{constructor(t,e){this.query=t,this.Ou=e,this.Mu=null,this.hasCachedResults=!1,this.current=!1,this.Nu=rt(),this.mutatedKeys=rt(),this.Lu=Ot(t)?Ba(t):_1(t),this.Bu=new Hn(this.Lu)}get Uu(){return this.Ou}ku(t,e){const n=e?e.qu:new Hl,s=e?e.Bu:this.Bu;let i=e?e.mutatedKeys:this.mutatedKeys,o=s,u=!1;const[c,h]=this.$u(this.query,s);t.inorderTraversal(((_,v)=>{const N=s.get(_),V=Gm(this.query,v)?v:null,M=!!N&&this.mutatedKeys.has(N.key),$=!!V&&(V.hasLocalMutations||this.mutatedKeys.has(V.key)&&V.hasCommittedMutations);let J=!1;N&&V?N.data.isEqual(V.data)?M!==$&&(n.track({type:3,doc:V}),J=!0):this.Ku(N,V)||(n.track({type:2,doc:V}),J=!0,(c&&this.Lu(V,c)>0||h&&this.Lu(V,h)<0)&&(u=!0)):!N&&V?(n.track({type:0,doc:V}),J=!0):N&&!V&&(n.track({type:1,doc:N}),J=!0,(c||h)&&(u=!0)),J&&(V?(o=o.add(V),i=$?i.add(_):i.delete(_)):(o=o.delete(_),i=i.delete(_)))}));const p=this.Wu(this.query);if(p)if(Ot(this.query)){const _=[];o.forEach((V=>_.push(V)));const v=H6(this.query,_);let N=new Hn(Ba(this.query));for(const V of v)N=N.add(V);o.forEach((V=>{N.has(V.key)||(i=i.delete(V.key),n.track({type:1,doc:V}))})),o=N}else{const _=this.Qu(this.query);for(;o.size>p;){const v=_==="F"?o.last():o.first();o=o.delete(v.key),i=i.delete(v.key),n.track({type:1,doc:v})}}return{Bu:o,qu:n,Uo:u,mutatedKeys:i}}Wu(t){return Ot(t)?ga(t)?.limit:t.limit||void 0}Qu(t){if(Ot(t)){const e=ga(t);return e&&e.limit<0?"L":"F"}return t.limitType}$u(t,e){if(Ot(t)){const n=ga(t)?.limit;return[e.size===n?e.last():null,null]}return[t.limitType==="F"&&e.size===this.Wu(this.query)?e.last():null,t.limitType==="L"&&e.size===this.Wu(this.query)?e.first():null]}Ku(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,n,s){const i=this.Bu;this.Bu=t.Bu,this.mutatedKeys=t.mutatedKeys;const o=t.qu.cu();o.sort(((p,_)=>(function(N,V){const M=$=>{switch($){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return G(20277,{ft:$})}};return M(N)-M(V)})(p.type,_.type)||this.Lu(p.doc,_.doc))),this.Gu(n),s=s??!1;const u=e&&!s?this.zu():[],c=this.Nu.size===0&&this.current&&!s?1:0,h=c!==this.Mu;return this.Mu=c,o.length!==0||h?{snapshot:new Ir(this.query,t.Bu,i,o,t.mutatedKeys,c===0,h,!1,!!n&&n.resumeToken.approximateByteSize()>0),ju:u}:{ju:u}}Ru(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({Bu:this.Bu,qu:new Hl,mutatedKeys:this.mutatedKeys,Uo:!1},!1)):{ju:[]}}Hu(t){return!this.Ou.has(t)&&!!this.Bu.has(t)&&!this.Bu.get(t).hasLocalMutations}Gu(t){t&&(t.addedDocuments.forEach((e=>this.Ou=this.Ou.add(e))),t.modifiedDocuments.forEach((e=>{})),t.removedDocuments.forEach((e=>this.Ou=this.Ou.delete(e))),this.current=t.current)}zu(){if(!this.current)return[];const t=this.Nu;this.Nu=rt(),this.Bu.forEach((n=>{this.Hu(n.key)&&(this.Nu=this.Nu.add(n.key))}));const e=[];return t.forEach((n=>{this.Nu.has(n)||e.push(new tf(n))})),this.Nu.forEach((n=>{t.has(n)||e.push(new Z6(n))})),e}Ju(t){this.Ou=t.Jo,this.Nu=rt();const e=this.ku(t.documents);return this.applyChanges(e,!0)}Yu(){return Ir.fromInitialDocuments(this.query,this.Bu,this.mutatedKeys,this.Mu===0,this.hasCachedResults)}}const X1="SyncEngine";class Fg{constructor(t,e,n){this.query=t,this.targetId=e,this.view=n}}class Ug{constructor(t){this.key=t,this.Zu=!1}}class Bg{constructor(t,e,n,s,i,o){this.localStore=t,this.remoteStore=e,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Xu={},this.ec=new Zn((u=>B6(u)),Co),this.tc=new Map,this.nc=new Set,this.rc=new pt(z.comparator),this.sc=new Map,this._c=new B1,this.oc={},this.ac=new Map,this.uc=Rn.Cs(),this.onlineState="Unknown",this.cc=void 0}get isPrimaryClient(){return this.cc===!0}}async function $g(r,t,e=!0){const n=af(r);let s;const i=n.ec.get(t);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Yu()):s=await ef(n,t,e,!0),s}async function qg(r,t){const e=af(r);await ef(e,t,!0,!1)}async function ef(r,t,e,n){const s=await pg(r.localStore,Ot(t)?t:Oe(t)),i=s.targetId,o=r.sharedClientState.addLocalQueryTarget(i,e);let u;return n&&(u=await Hg(r,t,i,o==="current",s.resumeToken)),r.isPrimaryClient&&e&&W6(r.remoteStore,s),u}async function Hg(r,t,e,n,s){r.lc=(_,v,N)=>(async function(M,$,J,ut){let _t=$.view.ku(J);_t.Uo&&(_t=await Bl(M.localStore,$.query,!1).then((({documents:A})=>$.view.ku(A,_t))));const Xt=ut&&ut.targetChanges.get($.targetId),_e=ut&&ut.targetMismatches.get($.targetId)!=null,xt=$.view.applyChanges(_t,M.isPrimaryClient,Xt,_e);return zl(M,$.targetId,xt.ju),xt.snapshot})(r,_,v,N);const i=await Bl(r.localStore,t,!0),o=new Mg(t,i.Jo),u=o.ku(i.documents),c=Ws.createSynthesizedTargetChangeForCurrentChange(e,n&&r.onlineState!=="Offline",s),h=o.applyChanges(u,r.isPrimaryClient,c);zl(r,e,h.ju);const p=new Fg(t,e,o);return r.ec.set(t,p),r.tc.has(e)?r.tc.get(e).push(t):r.tc.set(e,[t]),h.snapshot}async function jg(r,t,e){const n=Z(r),s=n.ec.get(t),i=n.tc.get(s.targetId);if(i.length>1)return n.tc.set(s.targetId,i.filter((o=>!Co(o,t)))),void n.ec.delete(t);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await $a(n.localStore,s.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(s.targetId),e&&j1(n.remoteStore,s.targetId),ja(n,s.targetId)})).catch(Sr)):(ja(n,s.targetId),await $a(n.localStore,s.targetId,!0))}async function Gg(r,t){const e=Z(r),n=e.ec.get(t),s=e.tc.get(n.targetId);e.isPrimaryClient&&s.length===1&&(e.sharedClientState.removeLocalQueryTarget(n.targetId),j1(e.remoteStore,n.targetId))}async function zg(r,t,e){const n=Zg(r);try{const s=await(function(o,u){const c=Z(o),h=dt.now(),p=u.reduce(((N,V)=>N.add(V.key)),rt());let _,v;return c.persistence.runTransaction("Locally write mutations","readwrite",(N=>{let V=ne(),M=rt();return c.Qo.getEntries(N,p).next(($=>{V=$,V.forEach(((J,ut)=>{ut.isValidDocument()||(M=M.add(J))}))})).next((()=>c.localDocuments.getOverlayedDocuments(N,V))).next(($=>{_=$;const J=[];for(const ut of u){const _t=K3(ut,_.get(ut.key).overlayedDocument);_t!=null&&J.push(new On(ut.key,_t,M2(_t.value.mapValue),Ne.exists(!0)))}return c.mutationQueue.addMutationBatch(N,h,J,u)})).next(($=>{v=$;const J=$.applyToLocalDocumentSet(_,M);return c.documentOverlayCache.saveOverlays(N,$.batchId,J)}))})).then((()=>({batchId:v.batchId,changes:n6(_)})))})(n.localStore,t);n.sharedClientState.addPendingMutation(s.batchId),(function(o,u,c){let h=o.oc[o.currentUser.toKey()];h||(h=new pt(st)),h=h.insert(u,c),o.oc[o.currentUser.toKey()]=h})(n,s.batchId,e),await Xs(n,s.changes),await No(n.remoteStore)}catch(s){const i=Y1(s,"Failed to persist write");e.reject(i)}}async function nf(r,t){const e=Z(r);try{const n=await hg(e.localStore,t);t.targetChanges.forEach(((s,i)=>{const o=e.sc.get(i);o&&(H(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.Zu=!0:s.modifiedDocuments.size>0?H(o.Zu,14607):s.removedDocuments.size>0&&(H(o.Zu,42227),o.Zu=!1))})),await Xs(e,n,t)}catch(n){await Sr(n)}}function Gl(r,t,e){const n=Z(r);if(n.isPrimaryClient&&e===0||!n.isPrimaryClient&&e===1){const s=[];n.ec.forEach(((i,o)=>{const u=o.view.Ru(t);u.snapshot&&s.push(u.snapshot)})),(function(o,u){const c=Z(o);c.onlineState=u;let h=!1;c.queries.forEach(((p,_)=>{for(const v of _.Eu)v.Ru(u)&&(h=!0)})),h&&Q1(c)})(n.eventManager,t),s.length&&n.Xu.zn(s),n.onlineState=t,n.isPrimaryClient&&n.sharedClientState.setOnlineState(t)}}async function Wg(r,t,e){const n=Z(r);n.sharedClientState.updateQueryState(t,"rejected",e);const s=n.sc.get(t),i=s&&s.key;if(i){let o=new pt(z.comparator);o=o.insert(i,Ht.newNoDocument(i,X.min()));const u=rt().add(i),c=new zs(X.min(),new Map,new pt(st),o,ne(),u);await nf(n,c),n.rc=n.rc.remove(i),n.sc.delete(t),J1(n)}else await $a(n.localStore,t,!1).then((()=>ja(n,t,e))).catch(Sr)}async function Kg(r,t){const e=Z(r),n=t.batch.batchId;try{const s=await lg(e.localStore,t);sf(e,n,null),rf(e,n),e.sharedClientState.updateMutationState(n,"acknowledged"),await Xs(e,s)}catch(s){await Sr(s)}}async function Yg(r,t,e){const n=Z(r);try{const s=await(function(o,u){const c=Z(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",(h=>{let p;return c.mutationQueue.lookupMutationBatch(h,u).next((_=>(H(_!==null,37113),p=_.keys(),c.mutationQueue.removeMutationBatch(h,_)))).next((()=>c.mutationQueue.performConsistencyCheck(h))).next((()=>c.documentOverlayCache.removeOverlaysForBatchId(h,p,u))).next((()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,p))).next((()=>c.localDocuments.getDocuments(h,p)))}))})(n.localStore,t);sf(n,t,e),rf(n,t),n.sharedClientState.updateMutationState(t,"rejected",e),await Xs(n,s)}catch(s){await Sr(s)}}function rf(r,t){(r.ac.get(t)||[]).forEach((e=>{e.resolve()})),r.ac.delete(t)}function sf(r,t,e){const n=Z(r);let s=n.oc[n.currentUser.toKey()];if(s){const i=s.get(t);i&&(e?i.reject(e):i.resolve(),s=s.remove(t)),n.oc[n.currentUser.toKey()]=s}}function ja(r,t,e=null){r.sharedClientState.removeLocalQueryTarget(t);for(const n of r.tc.get(t))r.ec.delete(n),e&&r.Xu.Ec(n,e);r.tc.delete(t),r.isPrimaryClient&&r._c.s_(t).forEach((n=>{r._c.containsKey(n)||of(r,n)}))}function of(r,t){r.nc.delete(t.path.canonicalString());const e=r.rc.get(t);e!==null&&(j1(r.remoteStore,e),r.rc=r.rc.remove(t),r.sc.delete(e),J1(r))}function zl(r,t,e){for(const n of e)n instanceof Z6?(r._c.addReference(n.key,t),Qg(r,n)):n instanceof tf?(U(X1,"Document no longer in limbo: "+n.key),r._c.removeReference(n.key,t),r._c.containsKey(n.key)||of(r,n.key)):G(19791,{hc:n})}function Qg(r,t){const e=t.key,n=e.path.canonicalString();r.rc.get(e)||r.nc.has(n)||(U(X1,"New document in limbo: "+e),r.nc.add(n),J1(r))}function J1(r){for(;r.nc.size>0&&r.rc.size<r.maxConcurrentLimboResolutions;){const t=r.nc.values().next().value;r.nc.delete(t);const e=new z(lt.fromString(t)),n=r.uc.next();r.sc.set(n,new Ug(e)),r.rc=r.rc.insert(e,n),W6(r.remoteStore,new $e(Oe(g1(e.path)),n,"TargetPurposeLimboResolution",lo.ce))}}async function Xs(r,t,e){const n=Z(r),s=[],i=[],o=[];n.ec.isEmpty()||(n.ec.forEach(((u,c)=>{o.push(n.lc(c,t,e).then((h=>{if((h||e)&&n.isPrimaryClient){const p=h?!h.fromCache:e?.targetChanges.get(c.targetId)?.current;n.sharedClientState.updateQueryState(c.targetId,p?"current":"not-current")}if(h){s.push(h);const p=q1.vo(c.targetId,h);i.push(p)}})))})),await Promise.all(o),n.Xu.zn(s),await(async function(c,h){const p=Z(c);try{await p.persistence.runTransaction("notifyLocalViewChanges","readwrite",(_=>D.forEach(h,(v=>D.forEach(v.wo,(N=>p.persistence.referenceDelegate.addReference(_,v.targetId,N))).next((()=>D.forEach(v.bo,(N=>p.persistence.referenceDelegate.removeReference(_,v.targetId,N)))))))))}catch(_){if(!Cr(_))throw _;U(H1,"Failed to update sequence numbers: "+_)}for(const _ of h){const v=_.targetId;if(!_.fromCache){const N=p.$o.get(v),V=N.snapshotVersion,M=N.withLastLimboFreeSnapshotVersion(V);p.$o=p.$o.insert(v,M)}}})(n.localStore,i))}async function Xg(r,t){const e=Z(r);if(!e.currentUser.isEqual(t)){U(X1,"User change. New user:",t.toKey());const n=await G6(e.localStore,t);e.currentUser=t,(function(i,o){i.ac.forEach((u=>{u.forEach((c=>{c.reject(new q(x.CANCELLED,o))}))})),i.ac.clear()})(e,"'waitForPendingWrites' promise is rejected due to a user change."),e.sharedClientState.handleUserChange(t,n.removedBatchIds,n.addedBatchIds),await Xs(e,n.zo)}}function Jg(r,t){const e=Z(r),n=e.sc.get(t);if(n&&n.Zu)return rt().add(n.key);{let s=rt();const i=e.tc.get(t);if(!i)return s;for(const o of i??[]){const u=e.ec.get(o);s=s.unionWith(u.view.Uu)}return s}}function af(r){const t=Z(r);return t.remoteStore.remoteSyncer.applyRemoteEvent=nf.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=Jg.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=Wg.bind(null,t),t.Xu.zn=Dg.bind(null,t.eventManager),t.Xu.Ec=xg.bind(null,t.eventManager),t}function Zg(r){const t=Z(r);return t.remoteStore.remoteSyncer.applySuccessfulWrite=Kg.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=Yg.bind(null,t),t}class to{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=yo(t.databaseInfo.databaseId),this.sharedClientState=this.Rc(t),this.persistence=this.Ic(t),await this.persistence.start(),this.localStore=this.Ac(t),this.gcScheduler=this.Vc(t,this.localStore),this.indexBackfillerScheduler=this.dc(t,this.localStore)}Vc(t,e){return null}dc(t,e){return null}Ac(t){return cg(this.persistence,new og,t.initialUser,this.serializer)}Ic(t){return new j6($1.C_,this.serializer)}Rc(t){return new gg}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}to.provider={build:()=>new to};class t5 extends to{constructor(t){super(),this.cacheSizeBytes=t}Vc(t,e){H(this.persistence.referenceDelegate instanceof Ji,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new t8(n,t.asyncQueue,e)}Ic(t){const e=this.cacheSizeBytes!==void 0?Zt.withCacheSize(this.cacheSizeBytes):Zt.DEFAULT;return new j6((n=>Ji.C_(n,e)),this.serializer)}}class Ga{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>Gl(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=Xg.bind(null,this.syncEngine),await bg(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return(function(){return new Og})()}createDatastore(t){const e=yo(t.databaseInfo.databaseId),n=j9(t.databaseInfo);return Y9(t.authCredentials,t.appCheckCredentials,n,e)}createRemoteStore(t){return(function(n,s,i,o,u){return new Eg(n,s,i,o,u)})(this.localStore,this.datastore,t.asyncQueue,(e=>Gl(this.syncEngine,e,0)),(function(){return Nl.C()?new Nl:new B9})())}createSyncEngine(t,e){return(function(s,i,o,u,c,h,p){const _=new Bg(s,i,o,u,c,h);return p&&(_.cc=!0),_})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){await(async function(e){const n=Z(e);U(Me,"RemoteStore shutting down."),n.tu.add(5),await Qs(n),n.ru.shutdown(),n.iu.set("Unknown")})(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}}Ga.provider={build:()=>new Ga};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e5{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.mc(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.mc(this.observer.error,t):ze("Uncaught Error in snapshot listener:",t.toString()))}gc(){this.muted=!0}mc(t,e){setTimeout((()=>{this.muted||t(e)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cn="FirestoreClient";class n5{constructor(t,e,n,s,i){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=n,this._databaseInfo=s,this.user=qt.UNAUTHENTICATED,this.clientId=l1.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,(async o=>{U(Cn,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(n,(o=>(U(Cn,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new mn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const n=Y1(e,"Failed to shutdown persistence");t.reject(n)}})),t.promise}}async function Ea(r,t){r.asyncQueue.verifyOperationInProgress(),U(Cn,"Initializing OfflineComponentProvider");const e=r.configuration;await t.initialize(e);let n=e.initialUser;r.setCredentialChangeListener((async s=>{n.isEqual(s)||(await G6(t.localStore,s),n=s)})),t.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=t}async function Wl(r,t){r.asyncQueue.verifyOperationInProgress();const e=await r5(r);U(Cn,"Initializing OnlineComponentProvider"),await t.initialize(e,r.configuration),r.setCredentialChangeListener((n=>ql(t.remoteStore,n))),r.setAppCheckTokenChangeListener(((n,s)=>ql(t.remoteStore,s))),r._onlineComponents=t}async function r5(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){U(Cn,"Using user provided OfflineComponentProvider");try{await Ea(r,r._uninitializedComponentsProvider._offline)}catch(t){const e=t;if(!(function(s){return s.name==="FirebaseError"?s.code===x.FAILED_PRECONDITION||s.code===x.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(e))throw e;Ie("Error using user provided cache. Falling back to memory cache: "+e),await Ea(r,new to)}}else U(Cn,"Using default OfflineComponentProvider"),await Ea(r,new t5(void 0));return r._offlineComponents}async function uf(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(U(Cn,"Using user provided OnlineComponentProvider"),await Wl(r,r._uninitializedComponentsProvider._online)):(U(Cn,"Using default OnlineComponentProvider"),await Wl(r,new Ga))),r._onlineComponents}function s5(r){return uf(r).then((t=>t.syncEngine))}async function i5(r){const t=await uf(r),e=t.eventManager;return e.onListen=$g.bind(null,t.syncEngine),e.onUnlisten=jg.bind(null,t.syncEngine),e.onFirstRemoteStoreListen=qg.bind(null,t.syncEngine),e.onLastRemoteStoreUnlisten=Gg.bind(null,t.syncEngine),e}function o5(r,t,e={}){const n=new mn;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,u,c,h){const p=new e5({next:v=>{p.gc(),o.enqueueAndForget((()=>Vg(i,_)));const N=v.docs.has(u);!N&&v.fromCache?h.reject(new q(x.UNAVAILABLE,"Failed to get document because the client is offline.")):N&&v.fromCache&&c&&c.source==="server"?h.reject(new q(x.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(v)},error:v=>h.reject(v)}),_=new Lg(g1(u.path),p,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return kg(i,_)})(await i5(r),r.asyncQueue,t,e,n))),n.promise}function a5(r,t){const e=new mn;return r.asyncQueue.enqueueAndForget((async()=>zg(await s5(r),t,e))),e.promise}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kl="AsyncQueue";class Yl{constructor(t=Promise.resolve()){this.qc=[],this.$c=!1,this.Kc=[],this.Wc=null,this.Qc=!1,this.Gc=!1,this.zc=[],this.xn=new g6(this,"async_queue_retry"),this.jc=()=>{const n=_a();n&&U(Kl,"Visibility state changed to "+n.visibilityState),this.xn.gn()},this.Hc=t;const e=_a();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.jc)}get isShuttingDown(){return this.$c}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.Jc(),this.Yc(t)}enterRestrictedMode(t){if(!this.$c){this.$c=!0,this.Gc=t||!1;const e=_a();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this.jc)}}enqueue(t){if(this.Jc(),this.$c)return new Promise((()=>{}));const e=new mn;return this.Yc((()=>this.$c&&this.Gc?Promise.resolve():(t().then(e.resolve,e.reject),e.promise))).then((()=>e.promise))}enqueueRetryable(t){this.enqueueAndForget((()=>(this.qc.push(t),this.Zc())))}async Zc(){if(this.qc.length!==0){try{await this.qc[0](),this.qc.shift(),this.xn.reset()}catch(t){if(!Cr(t))throw t;U(Kl,"Operation failed with retryable error: "+t)}this.qc.length>0&&this.xn.mn((()=>this.Zc()))}}Yc(t){const e=this.Hc.then((()=>(this.Qc=!0,t().catch((n=>{throw this.Wc=n,this.Qc=!1,ze("INTERNAL UNHANDLED ERROR: ",Ql(n)),n})).then((n=>(this.Qc=!1,n))))));return this.Hc=e,e}enqueueAfterDelay(t,e,n){this.Jc(),this.zc.indexOf(t)>-1&&(e=0);const s=K1.createAndSchedule(this,t,e,n,(i=>this.Xc(i)));return this.Kc.push(s),s}Jc(){this.Wc&&G(47125,{el:Ql(this.Wc)})}verifyOperationInProgress(){}async tl(){let t;do t=this.Hc,await t;while(t!==this.Hc)}nl(t){for(const e of this.Kc)if(e.timerId===t)return!0;return!1}rl(t){return this.tl().then((()=>{this.Kc.sort(((e,n)=>e.targetTimeMs-n.targetTimeMs));for(const e of this.Kc)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.tl()}))}il(t){this.zc.push(t)}Xc(t){const e=this.Kc.indexOf(t);this.Kc.splice(e,1)}}function Ql(r){let t=r.message||"";return r.stack&&(t=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),t}class Oo extends w1{constructor(t,e,n,s){super(t,e,n,s),this.type="firestore",this._queue=new Yl,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new Yl(t),this._firestoreClient=void 0,await t}}}function P5(r,t){const e=typeof r=="object"?r:dh(),n=typeof r=="string"?r:$i,s=Ms(e,"firestore").getImmediate({identifier:n});if(!s._initialized){const i=td("firestore");i&&r8(s,...i)}return s}function cf(r){if(r._terminated)throw new q(x.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||u5(r),r._firestoreClient}function u5(r){const t=r._freezeSettings(),e=X9(r._databaseId,r._app?.options.appId||"",r._persistenceKey,r._app?.options.apiKey,t);r._componentsProvider||t.localCache?._offlineComponentProvider&&t.localCache?._onlineComponentProvider&&(r._componentsProvider={_offline:t.localCache._offlineComponentProvider,_online:t.localCache._onlineComponentProvider}),r._firestoreClient=new n5(r._authCredentials,r._appCheckCredentials,r._queue,e,r._componentsProvider&&(function(s){const i=s?._online.build();return{_offline:s?._offline.build(i),_online:i}})(r._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class c5{convertValue(t,e="none"){switch(Ct(t)){case 0:return null;case 1:return t.booleanValue;case 2:return gt(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(wn(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 11:return this.convertObject(t.mapValue,e);case 10:return this.convertVectorValue(t.mapValue);default:throw G(62114,{value:t})}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const n={};return Nn(t,((s,i)=>{n[s]=this.convertValue(i,e)})),n}convertVectorValue(t){const e=t.fields?.[ws].arrayValue?.values?.map((n=>gt(n.doubleValue)));return new re(e)}convertGeoPoint(t){return new Ve(gt(t.latitude),gt(t.longitude))}convertArray(t,e){return(t.values||[]).map((n=>this.convertValue(n,e)))}convertServerTimestamp(t,e){switch(e){case"previous":const n=js(t);return n==null?null:this.convertValue(n,e);case"estimate":return this.convertTimestamp(_r(t));default:return null}}convertTimestamp(t){const e=Tn(t);return new dt(e.seconds,e.nanos)}convertDocumentKey(t,e){const n=lt.fromString(t);H(f6(n),9688,{name:t});const s=new Ts(n.get(1),n.get(3)),i=new z(n.popFirst(5));return s.isEqual(e)||ze(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),i}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l5 extends c5{constructor(t){super(),this.firestore=t}convertBytes(t){return new fe(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new At(this.firestore,null,e)}}const Xl="@firebase/firestore",Jl="4.16.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lf{constructor(t,e,n,s,i){this._firestore=t,this._userDataWriter=e,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new At(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new h5(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){return this._document?.data.clone().value.mapValue.fields??void 0}get(t){if(this._document){const e=this._document.data.field(wr("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class h5 extends lf{data(){return super.data()}}function f5(r,t,e){let n;return n=r?e&&(e.merge||e.mergeFields)?r.toFirestore(t,e):r.toFirestore(t):t,n}class es{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class jn extends lf{constructor(t,e,n,s,i,o){super(t,e,n,s,o),this._firestore=t,this._firestoreImpl=t,this.metadata=i}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new Ni(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const n=this._document.data.field(wr("DocumentSnapshot.get",t));if(n!==null)return this._userDataWriter.convertValue(n,e.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new q(x.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t=this._document,e={};return e.type=jn._jsonSchemaVersion,e.bundle="",e.bundleSource="DocumentSnapshot",e.bundleName=this._key.toString(),!t||!t.isValidDocument()||!t.isFoundDocument()?e:(this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields,"previous"),e.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),e)}}jn._jsonSchemaVersion="firestore/documentSnapshot/1.0",jn._jsonSchema={type:It("string",jn._jsonSchemaVersion),bundleSource:It("string","DocumentSnapshot"),bundleName:It("string"),bundle:It("string")};class Ni extends jn{data(t={}){return super.data(t)}}class hs{constructor(t,e,n,s){this._firestore=t,this._userDataWriter=e,this._snapshot=s,this.metadata=new es(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const t=[];return this.forEach((e=>t.push(e))),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach((n=>{t.call(e,new Ni(this._firestore,this._userDataWriter,n.key,n,new es(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new q(x.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((u=>{Ot(s._snapshot.query)?Ba(s._snapshot.query):_1(s.query._query);const c=new Ni(s._firestore,s._userDataWriter,u.doc.key,u.doc,new es(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);return u.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((u=>i||u.type!==3)).map((u=>{const c=new Ni(s._firestore,s._userDataWriter,u.doc.key,u.doc,new es(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);let h=-1,p=-1;return u.type!==0&&(h=o.indexOf(u.doc.key),o=o.delete(u.doc.key)),u.type!==1&&(o=o.add(u.doc),p=o.indexOf(u.doc.key)),{type:d5(u.type),doc:c,oldIndex:h,newIndex:p}}))}})(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new q(x.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t={};t.type=hs._jsonSchemaVersion,t.bundleSource="QuerySnapshot",t.bundleName=l1.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const e=[],n=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(e.push(i._document),n.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),t.bundle=(this._firestore,this.query._query,t.bundleName,"NOT SUPPORTED"),t}}function d5(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return G(61501,{type:r})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */hs._jsonSchemaVersion="firestore/querySnapshot/1.0",hs._jsonSchema={type:It("string",hs._jsonSchemaVersion),bundleSource:It("string","QuerySnapshot"),bundleName:It("string"),bundle:It("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function b5(r){r=Qn(r,At);const t=Qn(r.firestore,Oo),e=cf(t);return o5(e,r._key).then((n=>p5(t,r,n)))}function N5(r,t,e){r=Qn(r,At);const n=Qn(r.firestore,Oo),s=f5(r.converter,t,e),i=I6(n);return hf(n,[a8(i,"setDoc",r._key,s,r.converter!==null,e).toMutation(r._key,Ne.none())])}function O5(r,t,e,...n){r=Qn(r,At);const s=Qn(r.firestore,Oo),i=I6(s);let o;return o=typeof(t=Rt(t))=="string"||t instanceof To?c8(i,"updateDoc",r._key,t,e,n):u8(i,"updateDoc",r._key,t),hf(s,[o.toMutation(r._key,Ne.exists(!0))])}function hf(r,t){const e=cf(r);return a5(e,t)}function p5(r,t,e){const n=e.docs.get(t._key),s=new l5(r);return new jn(r,s,t._key,n,new es(e.hasPendingWrites,e.fromCache),t.converter)}(function(t,e=!0){d3(Ar),De(new we("firestore",((n,{instanceIdentifier:s,options:i})=>{const o=n.getProvider("app").getImmediate(),u=new Oo(new g3(n.getProvider("auth-internal")),new y3(o,n.getProvider("app-check-internal")),U3(o,s),o);return i={useFetchStreams:e,...i},u._setSettings(i),u}),"PUBLIC").setMultipleInstances(!0)),de(Xl,Jl,t),de(Xl,Jl,"esm2020")})();export{vr as E,on as G,y5 as a,I5 as b,w5 as c,_5 as d,E5 as e,S5 as f,b5 as g,N5 as h,C5 as i,v5 as j,P5 as k,A5 as l,_0 as m,T5 as o,g5 as s,O5 as u};
