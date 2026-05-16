function t(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:h,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,f=g.trustedTypes,m=f?f.emptyScript:"",v=g.reactiveElementPolyfillSupport,b=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!h(t,e),y={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);n?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=s;const o=n.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const o=this.constructor;if(!1===s&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??$)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[b("elementProperties")]=new Map,w[b("finalized")]=new Map,v?.({ReactiveElement:w}),(g.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,E=t=>t,A=x.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+k,T=`<${O}>`,L=document,P=()=>L.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,z=Array.isArray,U="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,R=/>/g,H=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,F=/"/g,j=/^(?:script|style|textarea|title)$/i,q=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),B=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),G=new WeakMap,V=L.createTreeWalker(L,129);function J(t,e){if(!z(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":3===e?"<math>":"",r=D;for(let e=0;e<i;e++){const i=t[e];let a,h,c=-1,l=0;for(;l<i.length&&(r.lastIndex=l,h=r.exec(i),null!==h);)l=r.lastIndex,r===D?"!--"===h[1]?r=N:void 0!==h[1]?r=R:void 0!==h[2]?(j.test(h[2])&&(n=RegExp("</"+h[2],"g")),r=H):void 0!==h[3]&&(r=H):r===H?">"===h[0]?(r=n??D,c=-1):void 0===h[1]?c=-2:(c=r.lastIndex-h[2].length,a=h[1],r=void 0===h[3]?H:'"'===h[3]?F:I):r===F||r===I?r=H:r===N||r===R?r=D:(r=H,n=void 0);const d=r===H&&t[e+1].startsWith("/>")?" ":"";o+=r===D?i+T:c>=0?(s.push(a),i.slice(0,c)+C+i.slice(c)+k+d):i+k+(-2===c?e:d)}return[J(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Y{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[h,c]=K(t,e);if(this.el=Y.createElement(h,i),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=V.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=c[o++],i=s.getAttribute(t).split(k),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?et:"?"===r[1]?it:"@"===r[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(j.test(s.tagName)){const t=s.textContent.split(k),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],P()),V.nextNode(),a.push({type:2,index:++n});s.append(t[e],P())}}}else if(8===s.nodeType)if(s.data===O)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(k,t+1));)a.push({type:7,index:n}),t+=k.length-1}n++}}static createElement(t,e){const i=L.createElement("template");return i.innerHTML=t,i}}function Z(t,e,i=t,s){if(e===B)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=M(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=Z(t,n._$AS(t,e.values),n,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??L).importNode(e,!0);V.currentNode=s;let n=V.nextNode(),o=0,r=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new X(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new nt(n,this,t)),this._$AV.push(e),a=i[++r]}o!==a?.index&&(n=V.nextNode(),o++)}return V.currentNode=L,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),M(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>z(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(L.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new Y(t)),e}k(t){z(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new X(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=E(t).nextSibling;E(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=Z(this,t,e,0),o=!M(t)||t!==this._$AH&&t!==B,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=Z(this,s[i+r],e,r),a===B&&(a=this._$AH[r]),o||=!M(a)||a!==this._$AH[r],a===W?t=W:t!==W&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class st extends tt{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??W)===B)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const ot=x.litHtmlPolyfillSupport;ot?.(Y,X),(x.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class at extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new X(e.insertBefore(P(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const ht=rt.litElementPolyfillSupport;ht?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ct=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},lt={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:$},dt=(t=lt,e,i)=>{const{kind:s,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pt(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ut(t){return pt({...t,state:!0,attribute:!1})}function gt(t,e){const i={fan:e},s=e.indexOf(".");if(-1===s)return i;const n=e.substring(s+1),o={light:`light.${n}_light`,color:`select.${n}_color`,direction:`switch.${n}_direction`,mute:`switch.${n}_mute`,timer:`sensor.${n}_timer`,cooldown1h:`button.${n}_cooldown_1h`,cooldown2h:`button.${n}_cooldown_2h`,cooldown4h:`button.${n}_cooldown_4h`};for(const[e,s]of Object.entries(o))t.states[s]&&(i[e]=s);return i}function ft(t,e){return t.states[e]?.state}function mt(t,e){const i=ft(t,e);return"on"===i||"ON"===i}function vt(t,e){return t.states[e]?.attributes?.preset_mode}function bt(t,e){const i=ft(t,e);if(i)try{const t=JSON.parse(i);return{duration:t.duration??0,remaining:t.remaining??0}}catch{return}}function _t(t,e){t.callService("fan","toggle",{entity_id:e})}function $t(t,e,i){t.callService("fan","set_preset_mode",{entity_id:e,preset_mode:i})}function yt(t,e){t.callService("fan","turn_on",{entity_id:e})}function wt(t,e){t.callService("fan","turn_off",{entity_id:e})}function xt(t,e){t.callService("light","toggle",{entity_id:e})}function Et(t,e,i){t.callService("select","select_option",{entity_id:e,option:i})}function At(t,e){const i=e.split(".")[0];t.callService(i,"toggle",{entity_id:e})}function St(t,e){t.callService("button","press",{entity_id:e})}const Ct=r`
  :host {
    --mush-spacing: 12px;
    --mush-card-primary-color: var(--primary-text-color);
    --mush-card-secondary-color: var(--secondary-text-color);
    --mush-card-bg-color: var(--card-background-color);
    --mush-border-radius: 12px;
    --mush-control-border-radius: 12px;
    --mush-control-height: 42px;
    --mush-control-icon-size: 0.5em;
    --mush-icon-size: 40px;
    --mush-shape-size: 48px;
    --mush-shape-threshold: 1;
    --mush-shape-border-radius: 50%;
    --mush-badge-size: 16px;
    --mush-badge-border-radius: 50%;
    --mush-rgb-state-fan: var(--rgb-state-fan-color, 61, 153, 230);
    --mush-rgb-state-light: var(--rgb-state-light-color, 255, 197, 71);
    --mush-rgb-state-switch: var(--rgb-state-switch-color, 211, 129, 53);
    --mush-rgb-active: var(--rgb-active-color, 255, 197, 71);
    --mush-rgb-unavailable: var(--rgb-unavailable-color, 189, 189, 189);
    --mush-rgb-info: var(--rgb-info-color, 158, 158, 158);
  }
`,kt=r`
  ha-card {
    display: flex;
    flex-direction: column;
    padding: var(--mush-spacing);
    background: var(--mush-card-bg-color);
    border-radius: var(--mush-border-radius);
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }
  
  .card-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--mush-spacing);
  }

  .card-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--mush-spacing);
    cursor: pointer;
  }

  .card-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding-top: var(--mush-spacing);
  }

  .shape-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--mush-shape-size);
    height: var(--mush-shape-size);
    border-radius: var(--mush-shape-border-radius);
    background: rgba(var(--mush-rgb-state-fan), 0.2);
    flex-shrink: 0;
  }

  .shape-icon.light {
    background: rgba(var(--mush-rgb-state-light), 0.2);
  }

  .state-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .primary {
    color: var(--mush-card-primary-color);
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .secondary {
    color: var(--mush-card-secondary-color);
    font-size: 12px;
    font-weight: 400;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .toggle-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--mush-control-height);
    height: var(--mush-control-height);
    border-radius: var(--mush-control-border-radius);
    border: none;
    background: rgba(var(--mush-rgb-info), 0.2);
    cursor: pointer;
    transition: background 0.2s ease;
    flex-shrink: 0;
    color: var(--mush-card-secondary-color);
  }

  .toggle-button.active {
    background: rgba(var(--mush-rgb-active), 0.25);
    color: var(--primary-color);
  }

  .toggle-button:hover {
    background: rgba(var(--mush-rgb-info), 0.3);
  }

  .toggle-button.active:hover {
    background: rgba(var(--mush-rgb-active), 0.35);
  }

  ha-icon {
    --mdi-icon-size: 20px;
  }
`;let Ot=class extends at{constructor(){super(...arguments),this.speed=0}static get styles(){return[Ct,r`
        :host {
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(var(--mush-rgb-info), 0.3);
          transition: background 0.2s ease;
        }
        .dot.active {
          background: rgba(var(--mush-rgb-state-fan), 0.9);
        }
      `]}render(){return q`
      ${[1,2,3,4,5,6].map(t=>q`<div class="dot ${t<=this.speed?"active":""}"></div>`)}
    `}};t([pt({type:Number})],Ot.prototype,"speed",void 0),Ot=t([ct("create-fan-speed-dots")],Ot);let Tt=class extends at{constructor(){super(...arguments),this.duration=0,this.remaining=0}static get styles(){return[Ct,r`
        :host {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--mush-card-secondary-color);
          font-size: 12px;
        }
        :host([hidden]) {
          display: none;
        }
        ha-icon {
          --mdi-icon-size: 14px;
          color: var(--mush-card-secondary-color);
        }
      `]}_formatTime(t){if(t<=0)return"0m";const e=Math.floor(t/60),i=t%60;return e>0&&i>0?`${e}h ${i}m`:e>0?`${e}h`:`${i}m`}render(){return 0===this.duration||this.remaining<=0?q``:q`
      <ha-icon .icon=${"mdi:timer-outline"}></ha-icon>
      <span>${this._formatTime(this.remaining)}</span>
    `}};t([pt({type:Number})],Tt.prototype,"duration",void 0),t([pt({type:Number})],Tt.prototype,"remaining",void 0),Tt=t([ct("create-fan-timer-display")],Tt);let Lt=class extends at{constructor(){super(...arguments),this.entityId="",this.name=""}static get styles(){return[Ct,kt,r`
        :host {
          display: block;
          max-width: 320px;
        }
        ha-card {
          padding: 10px 12px;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .icons-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .shape-icon {
          cursor: pointer;
        }
        .shape-icon.on {
          background: rgba(var(--mush-rgb-state-fan), 0.25);
          color: rgb(var(--mush-rgb-state-fan));
        }
        .shape-icon.on ha-icon {
          animation: spin 1.5s linear infinite;
        }
        .shape-icon.light-on {
          background: rgba(var(--mush-rgb-state-light), 0.25);
          color: rgb(var(--mush-rgb-state-light));
        }
        .secondary-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }
      `]}_getDisplayName(){return this.name?this.name:this.hass&&this.entityId?this.hass.states[this.entityId]?.attributes?.friendly_name??this.entityId:""}_isFanOn(){return!(!this.hass||!this.entityId)&&mt(this.hass,this.entityId)}_getSpeed(){if(!this.hass||!this.entityId)return 0;const t=vt(this.hass,this.entityId);if(!t)return 0;const e=t.match(/\d+/);return e?parseInt(e[0],10):0}_isLightOn(){return!(!this.hass||!this.entities?.light)&&mt(this.hass,this.entities.light)}_getTimerData(){if(!this.hass||!this.entities?.timer)return{duration:0,remaining:0};return bt(this.hass,this.entities.timer)??{duration:0,remaining:0}}_onFanToggle(t){t.stopPropagation(),this.hass&&this.entities?.fan&&_t(this.hass,this.entities.fan)}_onLightToggle(t){t.stopPropagation(),this.hass&&this.entities?.light&&xt(this.hass,this.entities.light)}_openRemote(){this.dispatchEvent(new CustomEvent("open-remote",{bubbles:!0,composed:!0,detail:{entityId:this.entityId,entities:this.entities}}))}render(){if(!this.hass||!this.entityId)return q``;const t=this._getDisplayName(),e=this._isFanOn(),i=this._getSpeed(),s=this._isLightOn(),n=!!this.entities?.light,o=!!this.entities?.timer,r=this._getTimerData();return q`
      <ha-card>
        <div class="card-content" @click=${this._openRemote}>
          <div class="icons-row">
            <div class="shape-icon ${e?"on":""}" @click=${this._onFanToggle}>
              <ha-icon .icon=${"mdi:fan"}></ha-icon>
            </div>
            ${n?q`<div class="shape-icon light ${s?"light-on":""}" @click=${this._onLightToggle}>
                  <ha-icon .icon=${"mdi:lightbulb"}></ha-icon>
                </div>`:""}
          </div>
          <div class="state-info">
            <span class="primary">${t}</span>
            <div class="secondary-row">
              <create-fan-speed-dots .speed=${i}></create-fan-speed-dots>
              ${o?q`<create-fan-timer-display
                    .duration=${r.duration}
                    .remaining=${r.remaining}
                  ></create-fan-timer-display>`:""}
            </div>
          </div>
        </div>
      </ha-card>
    `}};t([pt({attribute:!1})],Lt.prototype,"hass",void 0),t([pt({type:String})],Lt.prototype,"entityId",void 0),t([pt({type:String})],Lt.prototype,"name",void 0),t([pt({attribute:!1})],Lt.prototype,"entities",void 0),Lt=t([ct("create-fan-compact-card")],Lt);let Pt=class extends at{static get styles(){return[Ct,r`
        :host {
          display: block;
          padding: 8px 0;
        }
        .section {
          margin-bottom: 16px;
        }
        .section-label {
          font-size: 11px;
          text-transform: uppercase;
          color: var(--mush-card-secondary-color);
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        /* Power button */
        .power-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 48px;
          border-radius: var(--mush-control-border-radius);
          border: none;
          background: rgba(var(--mush-rgb-info), 0.15);
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          color: var(--mush-card-secondary-color);
          transition: all 0.2s;
        }
        .power-btn.active {
          background: rgba(var(--mush-rgb-state-fan), 0.25);
          color: var(--primary-color);
        }
        .power-btn:hover {
          filter: brightness(1.1);
        }

        /* Speed grid */
        .speed-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
        }
        .speed-btn {
          height: var(--mush-control-height);
          border-radius: var(--mush-control-border-radius);
          border: none;
          background: rgba(var(--mush-rgb-info), 0.15);
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          color: var(--mush-card-secondary-color);
          transition: all 0.2s;
        }
        .speed-btn.active {
          background: rgba(var(--mush-rgb-state-fan), 0.25);
          color: var(--primary-color);
        }
        .speed-btn:hover {
          filter: brightness(1.1);
        }

        /* Toggle rows */
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
        }
        .toggle-row-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--mush-card-primary-color);
          font-size: 14px;
        }

        /* Pill groups */
        .pill-group {
          display: flex;
          gap: 4px;
        }
        .pill {
          padding: 6px 16px;
          border-radius: 20px;
          border: none;
          background: rgba(var(--mush-rgb-info), 0.15);
          cursor: pointer;
          font-size: 13px;
          color: var(--mush-card-secondary-color);
          transition: all 0.2s;
        }
        .pill.active {
          background: rgba(var(--mush-rgb-active), 0.25);
          color: var(--primary-color);
        }

        /* Timer */
        .timer-row {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        .timer-btn {
          padding: 6px 16px;
          border-radius: 20px;
          border: none;
          background: rgba(var(--mush-rgb-info), 0.15);
          cursor: pointer;
          font-size: 13px;
          color: var(--mush-card-secondary-color);
          transition: all 0.2s;
        }
        .timer-btn:hover {
          filter: brightness(1.1);
        }
      `]}_isFanOn(){return!(!this.hass||!this.entities?.fan)&&mt(this.hass,this.entities.fan)}_getCurrentSpeed(){if(this.hass&&this.entities?.fan)return vt(this.hass,this.entities.fan)}_getSelectedColor(){if(this.hass&&this.entities?.color)return this.hass.states[this.entities.color]?.state}_isDirectionClockwise(){return!this.hass||!this.entities?.direction||mt(this.hass,this.entities.direction)}_isMuteOn(){return!(!this.hass||!this.entities?.mute)&&mt(this.hass,this.entities.mute)}_getTimerData(){if(this.hass&&this.entities?.timer)return bt(this.hass,this.entities.timer)}_handlePowerClick(){this.hass&&this.entities?.fan&&_t(this.hass,this.entities.fan)}_handleSpeedClick(t){if(!this.hass||!this.entities?.fan)return;const e=!this._isFanOn(),i=`speed${t}`;$t(this.hass,this.entities.fan,i),e&&yt(this.hass,this.entities.fan)}_handleLightToggle(){this.hass&&this.entities?.light&&xt(this.hass,this.entities.light)}_handleColorSelect(t){this.hass&&this.entities?.color&&Et(this.hass,this.entities.color,t)}_handleDirectionToggle(){this.hass&&this.entities?.direction&&At(this.hass,this.entities.direction)}_handleMuteToggle(){this.hass&&this.entities?.mute&&At(this.hass,this.entities.mute)}_handleTimerPress(t){this.hass&&St(this.hass,t)}_hasCooldowns(){return!!(this.entities?.cooldown1h||this.entities?.cooldown2h||this.entities?.cooldown4h)}render(){if(!this.hass||!this.entities)return q``;const t=this._isFanOn(),e=this._getCurrentSpeed();return q`
      <!-- Section 1: Fan Power -->
      <div class="section">
        <div class="section-label">Power</div>
        <button
          class="power-btn ${t?"active":""}"
          @click=${this._handlePowerClick}
          aria-label="Fan power toggle"
        >
          ${t?"ON":"OFF"}
        </button>
      </div>

      <!-- Section 2: Speed Selector -->
      <div class="section">
        <div class="section-label">Speed</div>
        <div class="speed-grid">
          ${[1,2,3,4,5,6].map(t=>q`
              <button
                class="speed-btn ${e===`speed${t}`?"active":""}"
                @click=${()=>this._handleSpeedClick(t)}
                aria-label="Speed ${t}"
              >
                ${t}
              </button>
            `)}
        </div>
      </div>

      <!-- Section 3: Light -->
      ${this.entities.light?q`
            <div class="section">
              <div class="section-label">Light</div>
              <div class="toggle-row">
                <div class="toggle-row-label">
                  <ha-icon .icon=${"mdi:lightbulb"}></ha-icon>
                  <span>Light</span>
                </div>
                <button
                  class="power-btn ${mt(this.hass,this.entities.light)?"active":""}"
                  style="width: auto; padding: 0 16px; height: 36px; font-size: 13px;"
                  @click=${this._handleLightToggle}
                  aria-label="Light toggle"
                >
                  ${mt(this.hass,this.entities.light)?"ON":"OFF"}
                </button>
              </div>
            </div>
          `:""}

      <!-- Section 4: Color -->
      ${this.entities.color?q`
            <div class="section">
              <div class="section-label">Color</div>
              <div class="pill-group">
                <button
                  class="pill ${"white"===this._getSelectedColor()?"active":""}"
                  @click=${()=>this._handleColorSelect("white")}
                >
                  White
                </button>
                <button
                  class="pill ${"yellow"===this._getSelectedColor()?"active":""}"
                  @click=${()=>this._handleColorSelect("yellow")}
                >
                  Yellow
                </button>
              </div>
            </div>
          `:""}

      <!-- Section 5: Direction -->
      ${this.entities.direction?q`
            <div class="section">
              <div class="section-label">Direction</div>
              <div class="toggle-row">
                <div class="toggle-row-label">
                  <ha-icon .icon=${"mdi:rotate-3d-variant"}></ha-icon>
                  <span>${this._isDirectionClockwise()?"Clockwise":"Counter-clockwise"}</span>
                </div>
                <button
                  class="power-btn"
                  style="width: auto; padding: 0 16px; height: 36px; font-size: 13px;"
                  @click=${this._handleDirectionToggle}
                  aria-label="Direction toggle"
                >
                  Toggle
                </button>
              </div>
            </div>
          `:""}

      <!-- Section 6: Mute -->
      ${this.entities.mute?q`
            <div class="section">
              <div class="section-label">Mute</div>
              <div class="toggle-row">
                <div class="toggle-row-label">
                  <ha-icon .icon=${"mdi:volume-off"}></ha-icon>
                  <span>Mute</span>
                </div>
                <button
                  class="power-btn ${this._isMuteOn()?"active":""}"
                  style="width: auto; padding: 0 16px; height: 36px; font-size: 13px;"
                  @click=${this._handleMuteToggle}
                  aria-label="Mute toggle"
                >
                  ${this._isMuteOn()?"ON":"OFF"}
                </button>
              </div>
            </div>
          `:""}

      <!-- Section 7: Timers -->
      ${this._hasCooldowns()?q`
            <div class="section">
              <div class="section-label">Timer</div>
              <div class="timer-row">
                ${this.entities.cooldown1h?q`
                      <button
                        class="timer-btn"
                        @click=${()=>this._handleTimerPress(this.entities.cooldown1h)}
                      >
                        1h
                      </button>
                    `:""}
                ${this.entities.cooldown2h?q`
                      <button
                        class="timer-btn"
                        @click=${()=>this._handleTimerPress(this.entities.cooldown2h)}
                      >
                        2h
                      </button>
                    `:""}
                ${this.entities.cooldown4h?q`
                      <button
                        class="timer-btn"
                        @click=${()=>this._handleTimerPress(this.entities.cooldown4h)}
                      >
                        4h
                      </button>
                    `:""}
                ${this._getTimerData()?.remaining?q`
                      <create-fan-timer-display
                        .duration=${this._getTimerData().duration}
                        .remaining=${this._getTimerData().remaining}
                      ></create-fan-timer-display>
                    `:""}
              </div>
            </div>
          `:""}
    `}};function Mt(t){if(!t)return 0;const e=t.match(/(\d+)/);return e?parseInt(e[1],10):0}function zt(t,e){if(0===e.length)return{fanOn:!1,speed:0,speedPreset:"",speedLabel:"Off",lightOn:!1,hasLight:!1,hasColor:!1,directionClockwise:!0,hasDirection:!1,muteOn:!1,hasMute:!1,hasTimer:!1,hasCooldowns:!1,hasCooldown1h:!1,hasCooldown2h:!1,hasCooldown4h:!1};const i=e.every(e=>mt(t,e.fan)),s=e.map(e=>vt(t,e.fan)),n=s.map(Mt),o=n.length>0&&n.every(t=>t===n[0]),r=i&&o?n[0]:0,a=i&&o?s[0]??"":"",h=i?o?`Speed ${r}`:"Mixed":"Off",c=e.filter(t=>null!=t.light),l=c.length>0,d=l&&c.every(e=>mt(t,e.light)),p=e.filter(t=>null!=t.color),u=p.length>0;let g;if(u){const e=p.map(e=>ft(t,e.color)),i=e.length>0&&e.every(t=>t===e[0]);g=i?e[0]:void 0}const f=e.filter(t=>null!=t.direction),m=f.length>0;let v=!0;if(m){const e=f.map(e=>mt(t,e.direction)),i=e.every(t=>t===e[0]);v=!i||e[0]}const b=e.filter(t=>null!=t.mute),_=b.length>0,$=_&&b.every(e=>mt(t,e.mute));let y;for(const i of e)if(i.timer){const e=bt(t,i.timer);if(e){y=e;break}}const w=e.some(t=>null!=t.timer),x=e.some(t=>null!=t.cooldown1h),E=e.some(t=>null!=t.cooldown2h),A=e.some(t=>null!=t.cooldown4h);return{fanOn:i,speed:r,speedPreset:a,speedLabel:h,lightOn:d,hasLight:l,color:g,hasColor:u,directionClockwise:v,hasDirection:m,muteOn:$,hasMute:_,timerData:y,hasTimer:w,hasCooldowns:x||E||A,hasCooldown1h:x,hasCooldown2h:E,hasCooldown4h:A}}function Ut(t,e){const i=e.length>0&&e.every(e=>mt(t,e.fan));for(const s of e)i?wt(t,s.fan):yt(t,s.fan)}function Dt(t,e){for(const i of e)i.light&&xt(t,i.light)}t([pt({attribute:!1})],Pt.prototype,"hass",void 0),t([pt({attribute:!1})],Pt.prototype,"entities",void 0),Pt=t([ct("create-fan-remote-popup")],Pt);let Nt=class extends at{constructor(){super(...arguments),this.name=""}static get styles(){return[Ct,kt,r`
        :host {
          display: block;
          max-width: 320px;
        }
        ha-card {
          padding: 10px 12px;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .icons-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .shape-icon {
          cursor: pointer;
        }
        .shape-icon.on {
          background: rgba(var(--mush-rgb-state-fan), 0.25);
          color: rgb(var(--mush-rgb-state-fan));
        }
        .shape-icon.on ha-icon {
          animation: spin 1.5s linear infinite;
        }
        .shape-icon.light-on {
          background: rgba(var(--mush-rgb-state-light), 0.25);
          color: rgb(var(--mush-rgb-state-light));
        }
        .secondary-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }
      `]}_getGroupState(){return this.hass&&this.fanEntitiesList?.length?zt(this.hass,this.fanEntitiesList):null}_onFanToggle(t){t.stopPropagation(),this.hass&&this.fanEntitiesList?.length&&Ut(this.hass,this.fanEntitiesList)}_onLightToggle(t){t.stopPropagation(),this.hass&&this.fanEntitiesList?.length&&Dt(this.hass,this.fanEntitiesList)}_openRemote(){this.dispatchEvent(new CustomEvent("open-remote",{bubbles:!0,composed:!0,detail:{fanEntitiesList:this.fanEntitiesList}}))}render(){if(!this.hass||!this.fanEntitiesList?.length)return q``;const t=this._getGroupState();if(!t)return q``;const e=t.fanOn,i=t.speed,s=t.lightOn,n=t.hasLight,o=t.hasTimer,r=t.timerData;return q`
      <ha-card>
        <div class="card-content" @click=${this._openRemote}>
          <div class="icons-row">
            <div class="shape-icon ${e?"on":""}" @click=${this._onFanToggle}>
              <ha-icon .icon=${"mdi:fan"}></ha-icon>
            </div>
            ${n?q`<div class="shape-icon light ${s?"light-on":""}" @click=${this._onLightToggle}>
                  <ha-icon .icon=${"mdi:lightbulb"}></ha-icon>
                </div>`:""}
          </div>
          <div class="state-info">
            <span class="primary">${this.name}</span>
            <div class="secondary-row">
              <create-fan-speed-dots .speed=${-1===i?0:i}></create-fan-speed-dots>
              ${o?q`<create-fan-timer-display
                    .duration=${r.duration}
                    .remaining=${r.remaining}
                  ></create-fan-timer-display>`:""}
            </div>
          </div>
        </div>
      </ha-card>
    `}};t([pt({attribute:!1})],Nt.prototype,"hass",void 0),t([pt({type:String})],Nt.prototype,"name",void 0),t([pt({attribute:!1})],Nt.prototype,"fanEntitiesList",void 0),Nt=t([ct("create-fan-group-compact-card")],Nt);let Rt=class extends at{static get styles(){return[Ct,r`
        :host {
          display: block;
          padding: 8px 0;
        }
        .section {
          margin-bottom: 16px;
        }
        .section-label {
          font-size: 11px;
          text-transform: uppercase;
          color: var(--mush-card-secondary-color);
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .power-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 48px;
          border-radius: var(--mush-control-border-radius);
          border: none;
          background: rgba(var(--mush-rgb-info), 0.15);
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          color: var(--mush-card-secondary-color);
          transition: all 0.2s;
        }
        .power-btn.active {
          background: rgba(var(--mush-rgb-state-fan), 0.25);
          color: var(--primary-color);
        }
        .power-btn:hover {
          filter: brightness(1.1);
        }

        .speed-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
        }
        .speed-btn {
          height: var(--mush-control-height);
          border-radius: var(--mush-control-border-radius);
          border: none;
          background: rgba(var(--mush-rgb-info), 0.15);
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          color: var(--mush-card-secondary-color);
          transition: all 0.2s;
        }
        .speed-btn.active {
          background: rgba(var(--mush-rgb-state-fan), 0.25);
          color: var(--primary-color);
        }
        .speed-btn:hover {
          filter: brightness(1.1);
        }

        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
        }
        .toggle-row-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--mush-card-primary-color);
          font-size: 14px;
        }

        .pill-group {
          display: flex;
          gap: 4px;
        }
        .pill {
          padding: 6px 16px;
          border-radius: 20px;
          border: none;
          background: rgba(var(--mush-rgb-info), 0.15);
          cursor: pointer;
          font-size: 13px;
          color: var(--mush-card-secondary-color);
          transition: all 0.2s;
        }
        .pill.active {
          background: rgba(var(--mush-rgb-active), 0.25);
          color: var(--primary-color);
        }

        .timer-row {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        .timer-btn {
          padding: 6px 16px;
          border-radius: 20px;
          border: none;
          background: rgba(var(--mush-rgb-info), 0.15);
          cursor: pointer;
          font-size: 13px;
          color: var(--mush-card-secondary-color);
          transition: all 0.2s;
        }
        .timer-btn:hover {
          filter: brightness(1.1);
        }
      `]}_getGroupState(){return this.hass&&this.fanEntitiesList?.length?zt(this.hass,this.fanEntitiesList):null}_handlePowerClick(){this.hass&&this.fanEntitiesList?.length&&Ut(this.hass,this.fanEntitiesList)}_handleSpeedClick(t){if(!this.hass||!this.fanEntitiesList?.length)return;const e=this._getGroupState(),i=e&&!e.fanOn;!function(t,e,i){for(const s of e)$t(t,s.fan,i)}(this.hass,this.fanEntitiesList,`speed${t}`),i&&function(t,e){for(const i of e)yt(t,i.fan)}(this.hass,this.fanEntitiesList)}_handleLightToggle(){this.hass&&this.fanEntitiesList?.length&&Dt(this.hass,this.fanEntitiesList)}_handleColorSelect(t){this.hass&&this.fanEntitiesList?.length&&function(t,e,i){for(const s of e)s.color&&Et(t,s.color,i)}(this.hass,this.fanEntitiesList,t)}_handleDirectionToggle(){this.hass&&this.fanEntitiesList?.length&&function(t,e){for(const i of e)i.direction&&At(t,i.direction)}(this.hass,this.fanEntitiesList)}_handleMuteToggle(){this.hass&&this.fanEntitiesList?.length&&function(t,e){for(const i of e)i.mute&&At(t,i.mute)}(this.hass,this.fanEntitiesList)}_handleTimerPress(){this.hass&&this.fanEntitiesList?.length&&function(t,e){for(const i of e){const e=i.cooldown1h??i.cooldown2h??i.cooldown4h;e&&St(t,e)}}(this.hass,this.fanEntitiesList)}_hasCooldowns(t){return t.hasCooldowns}render(){if(!this.hass||!this.fanEntitiesList?.length)return q``;const t=this._getGroupState();if(!t)return q``;const e=t.fanOn,i=t.speedPreset;return q`
      <div class="section">
        <div class="section-label">Power</div>
        <button
          class="power-btn ${e?"active":""}"
          @click=${this._handlePowerClick}
          aria-label="Fan power toggle"
        >
          ${e?"ON":"OFF"}
        </button>
      </div>

      <div class="section">
        <div class="section-label">Speed</div>
        <div class="speed-grid">
          ${[1,2,3,4,5,6].map(t=>q`
              <button
                class="speed-btn ${i===`speed${t}`?"active":""}"
                @click=${()=>this._handleSpeedClick(t)}
                aria-label="Speed ${t}"
              >
                ${t}
              </button>
            `)}
        </div>
      </div>

      ${t.hasLight?q`
            <div class="section">
              <div class="section-label">Light</div>
              <div class="toggle-row">
                <div class="toggle-row-label">
                  <ha-icon .icon=${"mdi:lightbulb"}></ha-icon>
                  <span>Light</span>
                </div>
                <button
                  class="power-btn ${t.lightOn?"active":""}"
                  style="width: auto; padding: 0 16px; height: 36px; font-size: 13px;"
                  @click=${this._handleLightToggle}
                  aria-label="Light toggle"
                >
                  ${t.lightOn?"ON":"OFF"}
                </button>
              </div>
            </div>
          `:""}

      ${t.hasColor?q`
            <div class="section">
              <div class="section-label">Color</div>
              <div class="pill-group">
                <button
                  class="pill ${"white"===t.color?"active":""}"
                  @click=${()=>this._handleColorSelect("white")}
                >
                  White
                </button>
                <button
                  class="pill ${"yellow"===t.color?"active":""}"
                  @click=${()=>this._handleColorSelect("yellow")}
                >
                  Yellow
                </button>
              </div>
            </div>
          `:""}

      ${t.hasDirection?q`
            <div class="section">
              <div class="section-label">Direction</div>
              <div class="toggle-row">
                <div class="toggle-row-label">
                  <ha-icon .icon=${"mdi:rotate-3d-variant"}></ha-icon>
                  <span>${t.directionClockwise?"Clockwise":"Counter-clockwise"}</span>
                </div>
                <button
                  class="power-btn"
                  style="width: auto; padding: 0 16px; height: 36px; font-size: 13px;"
                  @click=${this._handleDirectionToggle}
                  aria-label="Direction toggle"
                >
                  Toggle
                </button>
              </div>
            </div>
          `:""}

      ${t.hasMute?q`
            <div class="section">
              <div class="section-label">Mute</div>
              <div class="toggle-row">
                <div class="toggle-row-label">
                  <ha-icon .icon=${"mdi:volume-off"}></ha-icon>
                  <span>Mute</span>
                </div>
                <button
                  class="power-btn ${t.muteOn?"active":""}"
                  style="width: auto; padding: 0 16px; height: 36px; font-size: 13px;"
                  @click=${this._handleMuteToggle}
                  aria-label="Mute toggle"
                >
                  ${t.muteOn?"ON":"OFF"}
                </button>
              </div>
            </div>
          `:""}

      ${this._hasCooldowns(t)?q`
            <div class="section">
              <div class="section-label">Timer</div>
              <div class="timer-row">
                ${t.hasCooldown1h?q`
                      <button
                        class="timer-btn"
                        @click=${()=>this._handleTimerPress()}
                      >
                        1h
                      </button>
                    `:""}
                ${t.hasCooldown2h?q`
                      <button
                        class="timer-btn"
                        @click=${()=>this._handleTimerPress()}
                      >
                        2h
                      </button>
                    `:""}
                ${t.hasCooldown4h?q`
                      <button
                        class="timer-btn"
                        @click=${()=>this._handleTimerPress()}
                      >
                        4h
                      </button>
                    `:""}
                ${t.timerData.remaining?q`
                      <create-fan-timer-display
                        .duration=${t.timerData.duration}
                        .remaining=${t.timerData.remaining}
                      ></create-fan-timer-display>
                    `:""}
              </div>
            </div>
          `:""}
    `}};function Ht(t,e){if(void 0!==window.browser_mod){const t=new CustomEvent("ll-custom",{bubbles:!0,composed:!0,detail:{browser_mod:{service:"browser_mod.popup",data:{title:e.title,content:e.content}}}});document.body.dispatchEvent(t)}else{const i=e.content.entity;if(i){const e=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:i}});t.dispatchEvent(e)}}}t([pt({attribute:!1})],Rt.prototype,"hass",void 0),t([pt({attribute:!1})],Rt.prototype,"fanEntitiesList",void 0),Rt=t([ct("create-fan-group-remote-popup")],Rt);let It=class extends at{set hass(t){const e=this._hass;this._hass=t,this.requestUpdate("hass",e)}get hass(){return this._hass}setConfig(t){this._config=t,this._fanEntitiesList=t.fanEntitiesList}getCardSize(){return 6}render(){return this._hass&&this._fanEntitiesList?q`
      <ha-card>
        <create-fan-group-remote-popup
          .hass=${this._hass}
          .fanEntitiesList=${this._fanEntitiesList}
        ></create-fan-group-remote-popup>
      </ha-card>
    `:q``}};It.styles=r`
    :host {
      display: block;
    }

    ha-card {
      display: block;
      padding: 16px;
    }
  `,t([ut()],It.prototype,"_config",void 0),t([ut()],It.prototype,"_fanEntitiesList",void 0),It=t([ct("create-fan-group-remote-popup-card")],It);let Ft=class extends at{static getStubConfig(){return{entities:[]}}set hass(t){const e=this._hass;this._hass=t,t&&this._config&&(this._fanEntitiesList=this._resolveEntities(t,this._config)),this.requestUpdate("hass",e)}get hass(){return this._hass}setConfig(t){if(!t.entities||!Array.isArray(t.entities)||0===t.entities.length)throw new Error("entities must be a non-empty array of fan entity IDs");this._config=t,this._fanEntitiesList=this._hass?this._resolveEntities(this._hass,t):void 0}getCardSize(){return 3}_resolveEntities(t,e){return e.entities.map(e=>gt(t,e))}_getTitle(){return this._config?this._config.name??"Fan Group":"Fan Group"}_handleOpenRemote(t){const e=t.detail.fanEntitiesList[0]?.fan;Ht(this,{title:this._getTitle(),content:{type:"custom:create-fan-group-remote-popup-card",entity:e,fanEntitiesList:t.detail.fanEntitiesList}})}render(){return this._config&&this._hass?q`
      <create-fan-group-compact-card
        .hass=${this._hass}
        .name=${this._config.name??""}
        .fanEntitiesList=${this._fanEntitiesList??[]}
        @open-remote=${this._handleOpenRemote}
      ></create-fan-group-compact-card>
    `:q``}};Ft.styles=r`
    :host {
      display: block;
    }
  `,t([ut()],Ft.prototype,"_config",void 0),t([ut()],Ft.prototype,"_fanEntitiesList",void 0),Ft=t([ct("create-fan-group-card")],Ft);const jt=window;jt.customCards=jt.customCards||[];const qt=jt.customCards;qt.some(t=>"create-fan-group-card"===t.type)||qt.push({type:"create-fan-group-card",name:"Create Fan Group Card",description:"A Mushroom-styled group card for controlling multiple Create Ikohs ceiling fans"});let Bt=class extends at{set hass(t){const e=this._hass;this._hass=t,t&&this._config&&(this._entities=this._resolveEntities(t,this._config)),this.requestUpdate("hass",e)}get hass(){return this._hass}setConfig(t){if(!t.entity&&!t.entities?.fan)throw new Error("entity is required");this._config=t,this._hass&&(this._entities=this._resolveEntities(this._hass,t))}getCardSize(){return 6}_resolveEntities(t,e){return e.entities?e.entities:gt(t,e.entity)}render(){return this._hass&&this._entities?q`
      <ha-card>
        <create-fan-remote-popup
          .hass=${this._hass}
          .entities=${this._entities}
        ></create-fan-remote-popup>
      </ha-card>
    `:q``}};Bt.styles=r`
    :host {
      display: block;
    }

    ha-card {
      display: block;
      padding: 16px;
    }
  `,t([ut()],Bt.prototype,"_config",void 0),t([ut()],Bt.prototype,"_entities",void 0),Bt=t([ct("create-fan-remote-popup-card")],Bt);let Wt=class extends at{static getStubConfig(){return{entity:""}}set hass(t){const e=this._hass;this._hass=t,t&&this._config&&(this._entities=this._resolveEntities(t,this._config)),this.requestUpdate("hass",e)}get hass(){return this._hass}setConfig(t){if(!t.entity)throw new Error("entity is required");this._config=t,this._entities=this._hass?this._resolveEntities(this._hass,t):void 0}getCardSize(){return 3}_resolveEntities(t,e){const i=gt(t,e.entity);return e.light_entity?{...i,light:e.light_entity}:i}_getTitle(){return this._config?this._config.name??this._hass?.states[this._config.entity]?.attributes?.friendly_name??"Fan Remote":"Fan Remote"}_handleOpenRemote(t){Ht(this,{title:this._getTitle(),content:{type:"custom:create-fan-remote-popup-card",entity:t.detail.entityId,entities:t.detail.entities}})}render(){return this._config&&this._hass?q`
      <create-fan-compact-card
        .hass=${this._hass}
        .entityId=${this._config.entity}
        .name=${this._config.name??""}
        .entities=${this._entities}
        @open-remote=${this._handleOpenRemote}
      ></create-fan-compact-card>
    `:q``}};Wt.styles=r`
    :host {
      display: block;
    }
  `,t([ut()],Wt.prototype,"_config",void 0),t([ut()],Wt.prototype,"_entities",void 0),Wt=t([ct("create-fan-card")],Wt);const Gt=window;Gt.customCards=Gt.customCards||[];const Vt=Gt.customCards;Vt.some(t=>"create-fan-card"===t.type)||Vt.push({type:"create-fan-card",name:"Create Fan Card",description:"A Mushroom-styled card for controlling Create Ikohs ceiling fans"});export{Wt as CreateFanCard,Bt as CreateFanRemotePopupCard};
//# sourceMappingURL=create-fan-card.js.map
