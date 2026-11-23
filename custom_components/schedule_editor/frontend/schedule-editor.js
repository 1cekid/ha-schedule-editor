var Qe=Object.defineProperty;var ts=(s,t,e)=>t in s?Qe(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var dt=(s,t,e)=>ts(s,typeof t!="symbol"?t+"":t,e);var q=globalThis,F=q.ShadowRoot&&(q.ShadyCSS===void 0||q.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ut=Symbol(),jt=new WeakMap,M=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==ut)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(F&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=jt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&jt.set(e,t))}return t}toString(){return this.cssText}},Kt=s=>new M(typeof s=="string"?s:s+"",void 0,ut),pt=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((i,r,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[n+1],s[0]);return new M(e,s,ut)},Yt=(s,t)=>{if(F)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),r=q.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}},ft=F?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return Kt(e)})(s):s;var{is:es,defineProperty:ss,getOwnPropertyDescriptor:is,getOwnPropertyNames:rs,getOwnPropertySymbols:ns,getPrototypeOf:os}=Object,J=globalThis,Xt=J.trustedTypes,as=Xt?Xt.emptyScript:"",cs=J.reactiveElementPolyfillSupport,N=(s,t)=>s,_t={toAttribute(s,t){switch(t){case Boolean:s=s?as:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},qt=(s,t)=>!es(s,t),Wt={attribute:!0,type:String,converter:_t,reflect:!1,useDefault:!1,hasChanged:qt};Symbol.metadata??=Symbol("metadata"),J.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Wt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),r=this.getPropertyDescriptor(t,i,e);r!==void 0&&ss(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){let{get:r,set:n}=is(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){let c=r?.call(this);n?.call(this,o),this.requestUpdate(t,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Wt}static _$Ei(){if(this.hasOwnProperty(N("elementProperties")))return;let t=os(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(N("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(N("properties"))){let e=this.properties,i=[...rs(e),...ns(e)];for(let r of i)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,r]of e)this.elementProperties.set(i,r)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let r=this._$Eu(e,i);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let r of i)e.unshift(ft(r))}else t!==void 0&&e.push(ft(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Yt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:_t).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,e){let i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let n=i.getPropertyOptions(r),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:_t;this._$Em=r;let c=o.fromAttribute(e,n.type);this[r]=c??this._$Ej?.get(r)??c,this._$Em=null}}requestUpdate(t,e,i,r=!1,n){if(t!==void 0){let o=this.constructor;if(r===!1&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??qt)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[r,n]of i){let{wrapped:o}=n,c=this[r];o!==!0||this._$AL.has(r)||c===void 0||this.C(r,void 0,n,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[N("elementProperties")]=new Map,x[N("finalized")]=new Map,cs?.({ReactiveElement:x}),(J.reactiveElementVersions??=[]).push("2.1.2");var wt=globalThis,Ft=s=>s,Z=wt.trustedTypes,Jt=Z?Z.createPolicy("lit-html",{createHTML:s=>s}):void 0,ie="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,re="?"+w,hs=`<${re}>`,k=document,U=()=>k.createComment(""),R=s=>s===null||typeof s!="object"&&typeof s!="function",$t=Array.isArray,ls=s=>$t(s)||typeof s?.[Symbol.iterator]=="function",mt=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Zt=/-->/g,Qt=/>/g,A=RegExp(`>|${mt}(?:([^\\s"'>=/]+)(${mt}*=${mt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),te=/'/g,ee=/"/g,ne=/^(?:script|style|textarea|title)$/i,Et=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),_=Et(1),wi=Et(2),$i=Et(3),T=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),se=new WeakMap,S=k.createTreeWalker(k,129);function oe(s,t){if(!$t(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Jt!==void 0?Jt.createHTML(t):t}var ds=(s,t)=>{let e=s.length-1,i=[],r,n=t===2?"<svg>":t===3?"<math>":"",o=L;for(let c=0;c<e;c++){let a=s[c],l,h,d=-1,f=0;for(;f<a.length&&(o.lastIndex=f,h=o.exec(a),h!==null);)f=o.lastIndex,o===L?h[1]==="!--"?o=Zt:h[1]!==void 0?o=Qt:h[2]!==void 0?(ne.test(h[2])&&(r=RegExp("</"+h[2],"g")),o=A):h[3]!==void 0&&(o=A):o===A?h[0]===">"?(o=r??L,d=-1):h[1]===void 0?d=-2:(d=o.lastIndex-h[2].length,l=h[1],o=h[3]===void 0?A:h[3]==='"'?ee:te):o===ee||o===te?o=A:o===Zt||o===Qt?o=L:(o=A,r=void 0);let y=o===A&&s[c+1].startsWith("/>")?" ":"";n+=o===L?a+hs:d>=0?(i.push(l),a.slice(0,d)+ie+a.slice(d)+w+y):a+w+(d===-2?c:y)}return[oe(s,n+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},H=class s{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let n=0,o=0,c=t.length-1,a=this.parts,[l,h]=ds(t,e);if(this.el=s.createElement(l,i),S.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=S.nextNode())!==null&&a.length<c;){if(r.nodeType===1){if(r.hasAttributes())for(let d of r.getAttributeNames())if(d.endsWith(ie)){let f=h[o++],y=r.getAttribute(d).split(w),b=/([.?@])?(.*)/.exec(f);a.push({type:1,index:n,name:b[2],strings:y,ctor:b[1]==="."?yt:b[1]==="?"?vt:b[1]==="@"?bt:C}),r.removeAttribute(d)}else d.startsWith(w)&&(a.push({type:6,index:n}),r.removeAttribute(d));if(ne.test(r.tagName)){let d=r.textContent.split(w),f=d.length-1;if(f>0){r.textContent=Z?Z.emptyScript:"";for(let y=0;y<f;y++)r.append(d[y],U()),S.nextNode(),a.push({type:2,index:++n});r.append(d[f],U())}}}else if(r.nodeType===8)if(r.data===re)a.push({type:2,index:n});else{let d=-1;for(;(d=r.data.indexOf(w,d+1))!==-1;)a.push({type:7,index:n}),d+=w.length-1}n++}}static createElement(t,e){let i=k.createElement("template");return i.innerHTML=t,i}};function P(s,t,e=s,i){if(t===T)return t;let r=i!==void 0?e._$Co?.[i]:e._$Cl,n=R(t)?void 0:t._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),n===void 0?r=void 0:(r=new n(s),r._$AT(s,e,i)),i!==void 0?(e._$Co??=[])[i]=r:e._$Cl=r),r!==void 0&&(t=P(s,r._$AS(s,t.values),r,i)),t}var gt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,r=(t?.creationScope??k).importNode(e,!0);S.currentNode=r;let n=S.nextNode(),o=0,c=0,a=i[0];for(;a!==void 0;){if(o===a.index){let l;a.type===2?l=new B(n,n.nextSibling,this,t):a.type===1?l=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(l=new xt(n,this,t)),this._$AV.push(l),a=i[++c]}o!==a?.index&&(n=S.nextNode(),o++)}return S.currentNode=k,r}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},B=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=P(this,t,e),R(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==T&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ls(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=H.createElement(oe(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{let n=new gt(r,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=se.get(t.strings);return e===void 0&&se.set(t.strings,e=new H(t)),e}k(t){$t(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,r=0;for(let n of t)r===e.length?e.push(i=new s(this.O(U()),this.O(U()),this,this.options)):i=e[r],i._$AI(n),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=Ft(t).nextSibling;Ft(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,n){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=u}_$AI(t,e=this,i,r){let n=this.strings,o=!1;if(n===void 0)t=P(this,t,e,0),o=!R(t)||t!==this._$AH&&t!==T,o&&(this._$AH=t);else{let c=t,a,l;for(t=n[0],a=0;a<n.length-1;a++)l=P(this,c[i+a],e,a),l===T&&(l=this._$AH[a]),o||=!R(l)||l!==this._$AH[a],l===u?t=u:t!==u&&(t+=(l??"")+n[a+1]),this._$AH[a]=l}o&&!r&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},yt=class extends C{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},vt=class extends C{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},bt=class extends C{constructor(t,e,i,r,n){super(t,e,i,r,n),this.type=5}_$AI(t,e=this){if((t=P(this,t,e,0)??u)===T)return;let i=this._$AH,r=t===u&&i!==u||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==u&&(i===u||r);r&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},xt=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t)}};var us=wt.litHtmlPolyfillSupport;us?.(H,B),(wt.litHtmlVersions??=[]).push("3.3.3");var ae=(s,t,e)=>{let i=e?.renderBefore??t,r=i._$litPart$;if(r===void 0){let n=e?.renderBefore??null;i._$litPart$=r=new B(t.insertBefore(U(),n),n,void 0,e??{})}return r._$AI(s),r};var At=globalThis,$=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ae(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return T}};$._$litElement$=!0,$.finalized=!0,At.litElementHydrateSupport?.({LitElement:$});var ps=At.litElementPolyfillSupport;ps?.({LitElement:$});(At.litElementVersions??=[]).push("4.2.2");function fs(s,t,e){return Math.max(t,Math.min(s,e))}var m={toVector(s,t){return s===void 0&&(s=t),Array.isArray(s)?s:[s,s]},add(s,t){return[s[0]+t[0],s[1]+t[1]]},sub(s,t){return[s[0]-t[0],s[1]-t[1]]},addTo(s,t){s[0]+=t[0],s[1]+=t[1]},subTo(s,t){s[0]-=t[0],s[1]-=t[1]}};function ce(s,t,e){return t===0||Math.abs(t)===1/0?Math.pow(s,e*5):s*t*e/(t+e*s)}function he(s,t,e,i=.15){return i===0?fs(s,t,e):s<t?-ce(t-s,e-t,i)+t:s>e?+ce(s-e,e-t,i)+e:s}function le(s,[t,e],[i,r]){let[[n,o],[c,a]]=s;return[he(t,n,o,i),he(e,c,a,r)]}function _s(s,t){if(typeof s!="object"||s===null)return s;var e=s[Symbol.toPrimitive];if(e!==void 0){var i=e.call(s,t||"default");if(typeof i!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(s)}function ms(s){var t=_s(s,"string");return typeof t=="symbol"?t:String(t)}function g(s,t,e){return t=ms(t),t in s?Object.defineProperty(s,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):s[t]=e,s}function de(s,t){var e=Object.keys(s);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(s);t&&(i=i.filter(function(r){return Object.getOwnPropertyDescriptor(s,r).enumerable})),e.push.apply(e,i)}return e}function p(s){for(var t=1;t<arguments.length;t++){var e=arguments[t]!=null?arguments[t]:{};t%2?de(Object(e),!0).forEach(function(i){g(s,i,e[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(s,Object.getOwnPropertyDescriptors(e)):de(Object(e)).forEach(function(i){Object.defineProperty(s,i,Object.getOwnPropertyDescriptor(e,i))})}return s}var ye={pointer:{start:"down",change:"move",end:"up"},mouse:{start:"down",change:"move",end:"up"},touch:{start:"start",change:"move",end:"end"},gesture:{start:"start",change:"change",end:"end"}};function ue(s){return s?s[0].toUpperCase()+s.slice(1):""}var gs=["enter","leave"];function ys(s=!1,t){return s&&!gs.includes(t)}function ve(s,t="",e=!1){let i=ye[s],r=i&&i[t]||t;return"on"+ue(s)+ue(r)+(ys(e,r)?"Capture":"")}var vs=["gotpointercapture","lostpointercapture"];function be(s){let t=s.substring(2).toLowerCase(),e=!!~t.indexOf("passive");e&&(t=t.replace("passive",""));let i=vs.includes(t)?"capturecapture":"capture",r=!!~t.indexOf(i);return r&&(t=t.replace("capture","")),{device:t,capture:r,passive:e}}function xe(s,t=""){let e=ye[s],i=e&&e[t]||t;return s+i}function G(s){return"touches"in s}function we(s){return G(s)?"touch":"pointerType"in s?s.pointerType:"mouse"}function bs(s){return Array.from(s.touches).filter(t=>{var e,i;return t.target===s.currentTarget||((e=s.currentTarget)===null||e===void 0||(i=e.contains)===null||i===void 0?void 0:i.call(e,t.target))})}function xs(s){return s.type==="touchend"||s.type==="touchcancel"?s.changedTouches:s.targetTouches}function $e(s){return G(s)?xs(s)[0]:s}function Ee(s){return bs(s).map(t=>t.identifier)}function St(s){let t=$e(s);return G(s)?t.identifier:t.pointerId}function pe(s){let t=$e(s);return[t.clientX,t.clientY]}function ws(s){let t={};if("buttons"in s&&(t.buttons=s.buttons),"shiftKey"in s){let{shiftKey:e,altKey:i,metaKey:r,ctrlKey:n}=s;Object.assign(t,{shiftKey:e,altKey:i,metaKey:r,ctrlKey:n})}return t}function Q(s,...t){return typeof s=="function"?s(...t):s}function $s(){}function Ae(...s){return s.length===0?$s:s.length===1?s[0]:function(){let t;for(let e of s)t=e.apply(this,arguments)||t;return t}}function fe(s,t){return Object.assign({},t,s||{})}var Es=32,kt=class{constructor(t,e,i){this.ctrl=t,this.args=e,this.key=i,this.state||(this.state={},this.computeValues([0,0]),this.computeInitial(),this.init&&this.init(),this.reset())}get state(){return this.ctrl.state[this.key]}set state(t){this.ctrl.state[this.key]=t}get shared(){return this.ctrl.state.shared}get eventStore(){return this.ctrl.gestureEventStores[this.key]}get timeoutStore(){return this.ctrl.gestureTimeoutStores[this.key]}get config(){return this.ctrl.config[this.key]}get sharedConfig(){return this.ctrl.config.shared}get handler(){return this.ctrl.handlers[this.key]}reset(){let{state:t,shared:e,ingKey:i,args:r}=this;e[i]=t._active=t.active=t._blocked=t._force=!1,t._step=[!1,!1],t.intentional=!1,t._movement=[0,0],t._distance=[0,0],t._direction=[0,0],t._delta=[0,0],t._bounds=[[-1/0,1/0],[-1/0,1/0]],t.args=r,t.axis=void 0,t.memo=void 0,t.elapsedTime=t.timeDelta=0,t.direction=[0,0],t.distance=[0,0],t.overflow=[0,0],t._movementBound=[!1,!1],t.velocity=[0,0],t.movement=[0,0],t.delta=[0,0],t.timeStamp=0}start(t){let e=this.state,i=this.config;e._active||(this.reset(),this.computeInitial(),e._active=!0,e.target=t.target,e.currentTarget=t.currentTarget,e.lastOffset=i.from?Q(i.from,e):e.offset,e.offset=e.lastOffset,e.startTime=e.timeStamp=t.timeStamp)}computeValues(t){let e=this.state;e._values=t,e.values=this.config.transform(t)}computeInitial(){let t=this.state;t._initial=t._values,t.initial=t.values}compute(t){let{state:e,config:i,shared:r}=this;e.args=this.args;let n=0;if(t&&(e.event=t,i.preventDefault&&t.cancelable&&e.event.preventDefault(),e.type=t.type,r.touches=this.ctrl.pointerIds.size||this.ctrl.touchIds.size,r.locked=!!document.pointerLockElement,Object.assign(r,ws(t)),r.down=r.pressed=r.buttons%2===1||r.touches>0,n=t.timeStamp-e.timeStamp,e.timeStamp=t.timeStamp,e.elapsedTime=e.timeStamp-e.startTime),e._active){let E=e._delta.map(Math.abs);m.addTo(e._distance,E)}this.axisIntent&&this.axisIntent(t);let[o,c]=e._movement,[a,l]=i.threshold,{_step:h,values:d}=e;if(i.hasCustomTransform?(h[0]===!1&&(h[0]=Math.abs(o)>=a&&d[0]),h[1]===!1&&(h[1]=Math.abs(c)>=l&&d[1])):(h[0]===!1&&(h[0]=Math.abs(o)>=a&&Math.sign(o)*a),h[1]===!1&&(h[1]=Math.abs(c)>=l&&Math.sign(c)*l)),e.intentional=h[0]!==!1||h[1]!==!1,!e.intentional)return;let f=[0,0];if(i.hasCustomTransform){let[E,Ze]=d;f[0]=h[0]!==!1?E-h[0]:0,f[1]=h[1]!==!1?Ze-h[1]:0}else f[0]=h[0]!==!1?o-h[0]:0,f[1]=h[1]!==!1?c-h[1]:0;this.restrictToAxis&&!e._blocked&&this.restrictToAxis(f);let y=e.offset,b=e._active&&!e._blocked||e.active;b&&(e.first=e._active&&!e.active,e.last=!e._active&&e.active,e.active=r[this.ingKey]=e._active,t&&(e.first&&("bounds"in i&&(e._bounds=Q(i.bounds,e)),this.setup&&this.setup()),e.movement=f,this.computeOffset()));let[X,W]=e.offset,[[lt,We],[qe,Fe]]=e._bounds;e.overflow=[X<lt?-1:X>We?1:0,W<qe?-1:W>Fe?1:0],e._movementBound[0]=e.overflow[0]?e._movementBound[0]===!1?e._movement[0]:e._movementBound[0]:!1,e._movementBound[1]=e.overflow[1]?e._movementBound[1]===!1?e._movement[1]:e._movementBound[1]:!1;let Je=e._active?i.rubberband||[0,0]:[0,0];if(e.offset=le(e._bounds,e.offset,Je),e.delta=m.sub(e.offset,y),this.computeMovement(),b&&(!e.last||n>Es)){e.delta=m.sub(e.offset,y);let E=e.delta.map(Math.abs);m.addTo(e.distance,E),e.direction=e.delta.map(Math.sign),e._direction=e._delta.map(Math.sign),!e.first&&n>0&&(e.velocity=[E[0]/n,E[1]/n],e.timeDelta=n)}}emit(){let t=this.state,e=this.shared,i=this.config;if(t._active||this.clean(),(t._blocked||!t.intentional)&&!t._force&&!i.triggerAllEvents)return;let r=this.handler(p(p(p({},e),t),{},{[this.aliasKey]:t.values}));r!==void 0&&(t.memo=r)}clean(){this.eventStore.clean(),this.timeoutStore.clean()}};function As([s,t],e){let i=Math.abs(s),r=Math.abs(t);if(i>r&&i>e)return"x";if(r>i&&r>e)return"y"}var Tt=class extends kt{constructor(...t){super(...t),g(this,"aliasKey","xy")}reset(){super.reset(),this.state.axis=void 0}init(){this.state.offset=[0,0],this.state.lastOffset=[0,0]}computeOffset(){this.state.offset=m.add(this.state.lastOffset,this.state.movement)}computeMovement(){this.state.movement=m.sub(this.state.offset,this.state.lastOffset)}axisIntent(t){let e=this.state,i=this.config;if(!e.axis&&t){let r=typeof i.axisThreshold=="object"?i.axisThreshold[we(t)]:i.axisThreshold;e.axis=As(e._movement,r)}e._blocked=(i.lockDirection||!!i.axis)&&!e.axis||!!i.axis&&i.axis!==e.axis}restrictToAxis(t){if(this.config.axis||this.config.lockDirection)switch(this.state.axis){case"x":t[1]=0;break;case"y":t[0]=0;break}}},Ss=s=>s,_e=.15,Se={enabled(s=!0){return s},eventOptions(s,t,e){return p(p({},e.shared.eventOptions),s)},preventDefault(s=!1){return s},triggerAllEvents(s=!1){return s},rubberband(s=0){switch(s){case!0:return[_e,_e];case!1:return[0,0];default:return m.toVector(s)}},from(s){if(typeof s=="function")return s;if(s!=null)return m.toVector(s)},transform(s,t,e){let i=s||e.shared.transform;return this.hasCustomTransform=!!i,i||Ss},threshold(s){return m.toVector(s,0)}},ks=0,z=p(p({},Se),{},{axis(s,t,{axis:e}){if(this.lockDirection=e==="lock",!this.lockDirection)return e},axisThreshold(s=ks){return s},bounds(s={}){if(typeof s=="function")return n=>z.bounds(s(n));if("current"in s)return()=>s.current;if(typeof HTMLElement=="function"&&s instanceof HTMLElement)return s;let{left:t=-1/0,right:e=1/0,top:i=-1/0,bottom:r=1/0}=s;return[[t,e],[i,r]]}}),me={ArrowRight:(s,t=1)=>[s*t,0],ArrowLeft:(s,t=1)=>[-1*s*t,0],ArrowUp:(s,t=1)=>[0,-1*s*t],ArrowDown:(s,t=1)=>[0,s*t]},Ot=class extends Tt{constructor(...t){super(...t),g(this,"ingKey","dragging")}reset(){super.reset();let t=this.state;t._pointerId=void 0,t._pointerActive=!1,t._keyboardActive=!1,t._preventScroll=!1,t._delayed=!1,t.swipe=[0,0],t.tap=!1,t.canceled=!1,t.cancel=this.cancel.bind(this)}setup(){let t=this.state;if(t._bounds instanceof HTMLElement){let e=t._bounds.getBoundingClientRect(),i=t.currentTarget.getBoundingClientRect(),r={left:e.left-i.left+t.offset[0],right:e.right-i.right+t.offset[0],top:e.top-i.top+t.offset[1],bottom:e.bottom-i.bottom+t.offset[1]};t._bounds=z.bounds(r)}}cancel(){let t=this.state;t.canceled||(t.canceled=!0,t._active=!1,setTimeout(()=>{this.compute(),this.emit()},0))}setActive(){this.state._active=this.state._pointerActive||this.state._keyboardActive}clean(){this.pointerClean(),this.state._pointerActive=!1,this.state._keyboardActive=!1,super.clean()}pointerDown(t){let e=this.config,i=this.state;if(t.buttons!=null&&(Array.isArray(e.pointerButtons)?!e.pointerButtons.includes(t.buttons):e.pointerButtons!==-1&&e.pointerButtons!==t.buttons))return;let r=this.ctrl.setEventIds(t);e.pointerCapture&&t.target.setPointerCapture(t.pointerId),!(r&&r.size>1&&i._pointerActive)&&(this.start(t),this.setupPointer(t),i._pointerId=St(t),i._pointerActive=!0,this.computeValues(pe(t)),this.computeInitial(),e.preventScrollAxis&&we(t)!=="mouse"?(i._active=!1,this.setupScrollPrevention(t)):e.delay>0?(this.setupDelayTrigger(t),e.triggerAllEvents&&(this.compute(t),this.emit())):this.startPointerDrag(t))}startPointerDrag(t){let e=this.state;e._active=!0,e._preventScroll=!0,e._delayed=!1,this.compute(t),this.emit()}pointerMove(t){let e=this.state,i=this.config;if(!e._pointerActive)return;let r=St(t);if(e._pointerId!==void 0&&r!==e._pointerId)return;let n=pe(t);if(document.pointerLockElement===t.target?e._delta=[t.movementX,t.movementY]:(e._delta=m.sub(n,e._values),this.computeValues(n)),m.addTo(e._movement,e._delta),this.compute(t),e._delayed&&e.intentional){this.timeoutStore.remove("dragDelay"),e.active=!1,this.startPointerDrag(t);return}if(i.preventScrollAxis&&!e._preventScroll)if(e.axis)if(e.axis===i.preventScrollAxis||i.preventScrollAxis==="xy"){e._active=!1,this.clean();return}else{this.timeoutStore.remove("startPointerDrag"),this.startPointerDrag(t);return}else return;this.emit()}pointerUp(t){this.ctrl.setEventIds(t);try{this.config.pointerCapture&&t.target.hasPointerCapture(t.pointerId)&&t.target.releasePointerCapture(t.pointerId)}catch{}let e=this.state,i=this.config;if(!e._active||!e._pointerActive)return;let r=St(t);if(e._pointerId!==void 0&&r!==e._pointerId)return;this.state._pointerActive=!1,this.setActive(),this.compute(t);let[n,o]=e._distance;if(e.tap=n<=i.tapsThreshold&&o<=i.tapsThreshold,e.tap&&i.filterTaps)e._force=!0;else{let[c,a]=e._delta,[l,h]=e._movement,[d,f]=i.swipe.velocity,[y,b]=i.swipe.distance,X=i.swipe.duration;if(e.elapsedTime<X){let W=Math.abs(c/e.timeDelta),lt=Math.abs(a/e.timeDelta);W>d&&Math.abs(l)>y&&(e.swipe[0]=Math.sign(c)),lt>f&&Math.abs(h)>b&&(e.swipe[1]=Math.sign(a))}}this.emit()}pointerClick(t){!this.state.tap&&t.detail>0&&(t.preventDefault(),t.stopPropagation())}setupPointer(t){let e=this.config,i=e.device;e.pointerLock&&t.currentTarget.requestPointerLock(),e.pointerCapture||(this.eventStore.add(this.sharedConfig.window,i,"change",this.pointerMove.bind(this)),this.eventStore.add(this.sharedConfig.window,i,"end",this.pointerUp.bind(this)),this.eventStore.add(this.sharedConfig.window,i,"cancel",this.pointerUp.bind(this)))}pointerClean(){this.config.pointerLock&&document.pointerLockElement===this.state.currentTarget&&document.exitPointerLock()}preventScroll(t){this.state._preventScroll&&t.cancelable&&t.preventDefault()}setupScrollPrevention(t){this.state._preventScroll=!1,Ts(t);let e=this.eventStore.add(this.sharedConfig.window,"touch","change",this.preventScroll.bind(this),{passive:!1});this.eventStore.add(this.sharedConfig.window,"touch","end",e),this.eventStore.add(this.sharedConfig.window,"touch","cancel",e),this.timeoutStore.add("startPointerDrag",this.startPointerDrag.bind(this),this.config.preventScrollDelay,t)}setupDelayTrigger(t){this.state._delayed=!0,this.timeoutStore.add("dragDelay",()=>{this.state._step=[0,0],this.startPointerDrag(t)},this.config.delay)}keyDown(t){let e=me[t.key];if(e){let i=this.state,r=t.shiftKey?10:t.altKey?.1:1;this.start(t),i._delta=e(this.config.keyboardDisplacement,r),i._keyboardActive=!0,m.addTo(i._movement,i._delta),this.compute(t),this.emit()}}keyUp(t){t.key in me&&(this.state._keyboardActive=!1,this.setActive(),this.compute(t),this.emit())}bind(t){let e=this.config.device;t(e,"start",this.pointerDown.bind(this)),this.config.pointerCapture&&(t(e,"change",this.pointerMove.bind(this)),t(e,"end",this.pointerUp.bind(this)),t(e,"cancel",this.pointerUp.bind(this)),t("lostPointerCapture","",this.pointerUp.bind(this))),this.config.keys&&(t("key","down",this.keyDown.bind(this)),t("key","up",this.keyUp.bind(this))),this.config.filterTaps&&t("click","",this.pointerClick.bind(this),{capture:!0,passive:!1})}};function Ts(s){"persist"in s&&typeof s.persist=="function"&&s.persist()}var V=typeof window<"u"&&window.document&&window.document.createElement;function ke(){return V&&"ontouchstart"in window}function Os(){return ke()||V&&window.navigator.maxTouchPoints>1}function Ps(){return V&&"onpointerdown"in window}function Cs(){return V&&"exitPointerLock"in window.document}function Ds(){try{return"constructor"in GestureEvent}catch{return!1}}var v={isBrowser:V,gesture:Ds(),touch:ke(),touchscreen:Os(),pointer:Ps(),pointerLock:Cs()},Is=250,Ms=180,Ns=.5,Ls=50,Us=250,Rs=10,ge={mouse:0,touch:0,pen:8},Hs=p(p({},z),{},{device(s,t,{pointer:{touch:e=!1,lock:i=!1,mouse:r=!1}={}}){return this.pointerLock=i&&v.pointerLock,v.touch&&e?"touch":this.pointerLock?"mouse":v.pointer&&!r?"pointer":v.touch?"touch":"mouse"},preventScrollAxis(s,t,{preventScroll:e}){if(this.preventScrollDelay=typeof e=="number"?e:e||e===void 0&&s?Is:void 0,!(!v.touchscreen||e===!1))return s||(e!==void 0?"y":void 0)},pointerCapture(s,t,{pointer:{capture:e=!0,buttons:i=1,keys:r=!0}={}}){return this.pointerButtons=i,this.keys=r,!this.pointerLock&&this.device==="pointer"&&e},threshold(s,t,{filterTaps:e=!1,tapsThreshold:i=3,axis:r=void 0}){let n=m.toVector(s,e?i:r?1:0);return this.filterTaps=e,this.tapsThreshold=i,n},swipe({velocity:s=Ns,distance:t=Ls,duration:e=Us}={}){return{velocity:this.transform(m.toVector(s)),distance:this.transform(m.toVector(t)),duration:e}},delay(s=0){switch(s){case!0:return Ms;case!1:return 0;default:return s}},axisThreshold(s){return s?p(p({},ge),s):ge},keyboardDisplacement(s=Rs){return s}});var Ri=p(p({},Se),{},{device(s,t,{shared:e,pointer:{touch:i=!1}={}}){if(e.target&&!v.touch&&v.gesture)return"gesture";if(v.touch&&i)return"touch";if(v.touchscreen){if(v.pointer)return"pointer";if(v.touch)return"touch"}},bounds(s,t,{scaleBounds:e={},angleBounds:i={}}){let r=o=>{let c=fe(Q(e,o),{min:-1/0,max:1/0});return[c.min,c.max]},n=o=>{let c=fe(Q(i,o),{min:-1/0,max:1/0});return[c.min,c.max]};return typeof e!="function"&&typeof i!="function"?[r(),n()]:o=>[r(o),n(o)]},threshold(s,t,e){return this.lockDirection=e.axis==="lock",m.toVector(s,this.lockDirection?[.1,3]:0)},modifierKey(s){return s===void 0?"ctrlKey":s},pinchOnWheel(s=!0){return s}});var Hi=p(p({},z),{},{mouseOnly:(s=!0)=>s});var Bi=p(p({},z),{},{mouseOnly:(s=!0)=>s}),tt=new Map,j=new Map;function Pt(s){tt.set(s.key,s.engine),j.set(s.key,s.resolver)}var Ct={key:"drag",engine:Ot,resolver:Hs};function Ks(s,t){if(s==null)return{};var e={},i=Object.keys(s),r,n;for(n=0;n<i.length;n++)r=i[n],!(t.indexOf(r)>=0)&&(e[r]=s[r]);return e}function Ys(s,t){if(s==null)return{};var e=Ks(s,t),i,r;if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(s);for(r=0;r<n.length;r++)i=n[r],!(t.indexOf(i)>=0)&&Object.prototype.propertyIsEnumerable.call(s,i)&&(e[i]=s[i])}return e}var Xs={target(s){if(s)return()=>"current"in s?s.current:s},enabled(s=!0){return s},window(s=v.isBrowser?window:void 0){return s},eventOptions({passive:s=!0,capture:t=!1}={}){return{passive:s,capture:t}},transform(s){return s}},Ws=["target","eventOptions","window","enabled","transform"];function et(s={},t){let e={};for(let[i,r]of Object.entries(t))switch(typeof r){case"function":e[i]=r.call(e,s[i],i,s);break;case"object":e[i]=et(s[i],r);break;case"boolean":r&&(e[i]=s[i]);break}return e}function qs(s,t,e={}){let i=s,{target:r,eventOptions:n,window:o,enabled:c,transform:a}=i,l=Ys(i,Ws);if(e.shared=et({target:r,eventOptions:n,window:o,enabled:c,transform:a},Xs),t){let h=j.get(t);e[t]=et(p({shared:e.shared},l),h)}else for(let h in l){let d=j.get(h);d&&(e[h]=et(p({shared:e.shared},l[h]),d))}return e}var st=class{constructor(t,e){g(this,"_listeners",new Set),this._ctrl=t,this._gestureKey=e}add(t,e,i,r,n){let o=this._listeners,c=xe(e,i),a=this._gestureKey?this._ctrl.config[this._gestureKey].eventOptions:{},l=p(p({},a),n);t.addEventListener(c,r,l);let h=()=>{t.removeEventListener(c,r,l),o.delete(h)};return o.add(h),h}clean(){this._listeners.forEach(t=>t()),this._listeners.clear()}},Dt=class{constructor(){g(this,"_timeouts",new Map)}add(t,e,i=140,...r){this.remove(t),this._timeouts.set(t,window.setTimeout(e,i,...r))}remove(t){let e=this._timeouts.get(t);e&&window.clearTimeout(e)}clean(){this._timeouts.forEach(t=>{window.clearTimeout(t)}),this._timeouts.clear()}},it=class{constructor(t){g(this,"gestures",new Set),g(this,"_targetEventStore",new st(this)),g(this,"gestureEventStores",{}),g(this,"gestureTimeoutStores",{}),g(this,"handlers",{}),g(this,"config",{}),g(this,"pointerIds",new Set),g(this,"touchIds",new Set),g(this,"state",{shared:{shiftKey:!1,metaKey:!1,ctrlKey:!1,altKey:!1}}),Fs(this,t)}setEventIds(t){if(G(t))return this.touchIds=new Set(Ee(t)),this.touchIds;if("pointerId"in t)return t.type==="pointerup"||t.type==="pointercancel"?this.pointerIds.delete(t.pointerId):t.type==="pointerdown"&&this.pointerIds.add(t.pointerId),this.pointerIds}applyHandlers(t,e){this.handlers=t,this.nativeHandlers=e}applyConfig(t,e){this.config=qs(t,e,this.config)}clean(){this._targetEventStore.clean();for(let t of this.gestures)this.gestureEventStores[t].clean(),this.gestureTimeoutStores[t].clean()}effect(){return this.config.shared.target&&this.bind(),()=>this._targetEventStore.clean()}bind(...t){let e=this.config.shared,i={},r;if(!(e.target&&(r=e.target(),!r))){if(e.enabled){for(let o of this.gestures){let c=this.config[o],a=Te(i,c.eventOptions,!!r);if(c.enabled){let l=tt.get(o);new l(this,t,o).bind(a)}}let n=Te(i,e.eventOptions,!!r);for(let o in this.nativeHandlers)n(o,"",c=>this.nativeHandlers[o](p(p({},this.state.shared),{},{event:c,args:t})),void 0,!0)}for(let n in i)i[n]=Ae(...i[n]);if(!r)return i;for(let n in i){let{device:o,capture:c,passive:a}=be(n);this._targetEventStore.add(r,o,"",i[n],{capture:c,passive:a})}}}};function D(s,t){s.gestures.add(t),s.gestureEventStores[t]=new st(s,t),s.gestureTimeoutStores[t]=new Dt}function Fs(s,t){t.drag&&D(s,"drag"),t.wheel&&D(s,"wheel"),t.scroll&&D(s,"scroll"),t.move&&D(s,"move"),t.pinch&&D(s,"pinch"),t.hover&&D(s,"hover")}var Te=(s,t,e)=>(i,r,n,o={},c=!1)=>{var a,l;let h=(a=o.capture)!==null&&a!==void 0?a:t.capture,d=(l=o.passive)!==null&&l!==void 0?l:t.passive,f=c?i:ve(i,r,h);e&&d&&(f+="Passive"),s[f]=s[f]||[],s[f].push(n)};function Js(s,t){if(typeof s!="object"||s===null)return s;var e=s[Symbol.toPrimitive];if(e!==void 0){var i=e.call(s,t||"default");if(typeof i!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(s)}function Zs(s){var t=Js(s,"string");return typeof t=="symbol"?t:String(t)}function Qs(s,t,e){return t=Zs(t),t in s?Object.defineProperty(s,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):s[t]=e,s}function Oe(s,t){var e=Object.keys(s);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(s);t&&(i=i.filter(function(r){return Object.getOwnPropertyDescriptor(s,r).enumerable})),e.push.apply(e,i)}return e}function rt(s){for(var t=1;t<arguments.length;t++){var e=arguments[t]!=null?arguments[t]:{};t%2?Oe(Object(e),!0).forEach(function(i){Qs(s,i,e[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(s,Object.getOwnPropertyDescriptors(e)):Oe(Object(e)).forEach(function(i){Object.defineProperty(s,i,Object.getOwnPropertyDescriptor(e,i))})}return s}var It=class{constructor(t,e,i,r,n){this._target=t,this._gestureKey=r,this._ctrl=new it(e),this._ctrl.applyHandlers(e,n),this._ctrl.applyConfig(rt(rt({},i),{},{target:t}),r),this._ctrl.effect()}destroy(){this._ctrl.clean()}setConfig(t){this._ctrl.clean(),this._ctrl.applyConfig(rt(rt({},t),{},{target:this._target}),this._gestureKey),this._ctrl.effect()}},Pe=function(t,e,i){return Pt(Ct),new It(t,{drag:e},i||{},"drag")};var Me=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],ti=0,Ne=()=>++ti,O=(s,t,e)=>Math.min(Math.max(s,t),e);function Mt(s){let[t="0",e="0"]=String(s).split(":"),i=Number(t)*60+Number(e);return Number.isFinite(i)?O(i,0,1440):NaN}var Ce=s=>String(s).padStart(2,"0");function I(s){return`${Ce(Math.floor(s/60))}:${Ce(s%60)}`}function De(s){return`${I(s)}:00`}function Lt(s){return s>=1440?"00:00":I(s)}function Ut(s,t=!1){if(!/^\d{1,2}:\d{2}/.test(s||""))return NaN;let e=Mt(s);return t&&e===0?1440:e}var Rt=s=>[...s].sort((t,e)=>t.from-e.from||t.to-e.to);function Le(s){return Me.map(t=>Rt((s[t]||[]).map(e=>{let i=Mt(e.from),r=Mt(e.to)||1440,n={id:Ne(),from:i,to:r};return e.data&&Object.keys(e.data).length&&(n.data=e.data),n})))}function nt(s){let t={};return Me.forEach((e,i)=>{t[e]=s[i].map(r=>{let n={from:De(r.from),to:De(r.to)};return r.data&&(n.data=r.data),n})}),t}var ot=(s,t)=>s/30*t,Ue=(s,t)=>s/t*30,Nt=s=>Math.round(s/30)*30,Ie=s=>Math.floor(s/30)*30;function Re(s,t,e,i){return s.some(r=>r.id!==i&&t<r.to&&e>r.from)}function He(s,t,e){let i=0,r=1440;for(let n of s)n.id!==e&&(n.to<=t?i=Math.max(i,n.to):n.from>t&&(r=Math.min(r,n.from)));return{lo:i,hi:r}}function Be(s,t,e,i){let r=s.find(h=>t>=h.from&&t<h.to);if(!r)return null;let n=(r.to-r.from)*e,o=Math.min(i,n/3),c=(t-r.from)*e,a=(r.to-t)*e,l=c<=o?"start":a<=o?"end":"body";return{block:r,zone:l}}function Ht(s,t,e){let i=Ie(t),r=Ie(e),{lo:n,hi:o}=He(s,t),c=Math.max(Math.min(i,r),n),a=Math.min(Math.max(i,r)+30,o);return a>c?{from:c,to:a}:null}function Ge(s,t,e,i){let{lo:r,hi:n}=He(s,(t.from+t.to)/2,t.id),o=Math.min(30,t.to-t.from);return e==="start"?{from:O(Nt(i),r,t.to-o),to:t.to}:{from:t.from,to:O(Nt(i),t.from+o,n)}}function ze(s,t,e,i,r){let n=t.to-t.from,o=O(Nt(i-r),0,1440-n),c=o+n;return{day:e,from:o,to:c,valid:!Re(s[e],o,c,t.id)}}function Ve(s,t,e,i){return!Number.isFinite(e)||!Number.isFinite(i)?"invalid":i<=e?"order":Re(s,e,i,t)?"overlap":null}var Bt=(s,t,e)=>s.map((i,r)=>r===t?Rt(e):i);function Gt(s,t,e,i){return Bt(s,t,[...s[t],{id:Ne(),from:e,to:i}])}function at(s,t,e,i,r){return Bt(s,t,s[t].map(n=>n.id===e?{...n,from:i,to:r}:n))}function je(s,t,e){return Bt(s,t,s[t].filter(i=>i.id!==e))}function Ke(s,t,e,i,r,n){let o=s[t].find(a=>a.id===e);if(!o)return s;if(t===i)return at(s,t,e,r,n);let c={...o,from:r,to:n};return s.map((a,l)=>l===t?a.filter(h=>h.id!==e):l===i?Rt([...a,c]):a)}var Ye={title:"Schedules",none:"No schedules are enabled for editing. Add one of the labels configured in the Schedule Editor integration to a schedule helper.",not_found:"This schedule does not exist or is not enabled for editing.",loading:"Loading\u2026",back:"Back",undo:"Undo",redo:"Redo",save:"Save",saving:"Saving\u2026",saved:"Saved",unsaved:"Unsaved changes",edit_block:"Edit time block",from:"From",to:"To",end_hint:"00:00 as end time means the end of the day.",has_data:"This block has additional data. It is kept unchanged.",apply:"Apply",cancel:"Cancel",delete:"Delete",err_order:"The end must be after the start.",err_overlap:"The block overlaps another block.",err_invalid:"Please enter valid times.",discard:"Discard changes",discard_confirm:"Discard unsaved changes?",save_failed:"Saving failed",load_failed:"Could not load schedules"},si={title:"Zeitpl\xE4ne",none:"Es sind keine Zeitpl\xE4ne zur Bearbeitung freigegeben. Vergib eines der in der Integration \u201ESchedule Editor\u201C eingestellten Labels an einen Zeitplan-Helfer.",not_found:"Dieser Zeitplan existiert nicht oder ist nicht zur Bearbeitung freigegeben.",loading:"L\xE4dt \u2026",back:"Zur\xFCck",undo:"R\xFCckg\xE4ngig",redo:"Wiederholen",save:"Speichern",saving:"Speichert \u2026",saved:"Gespeichert",unsaved:"Ungespeicherte \xC4nderungen",edit_block:"Zeitblock bearbeiten",from:"Von",to:"Bis",end_hint:"00:00 als Ende bedeutet das Tagesende.",has_data:"Dieser Block hat zus\xE4tzliche Daten. Sie bleiben unver\xE4ndert.",apply:"\xDCbernehmen",cancel:"Abbrechen",delete:"L\xF6schen",err_order:"Das Ende muss nach dem Beginn liegen.",err_overlap:"Der Block \xFCberschneidet sich mit einem anderen Block.",err_invalid:"Bitte g\xFCltige Zeiten eingeben.",discard:"\xC4nderungen verwerfen",discard_confirm:"Ungespeicherte \xC4nderungen verwerfen?",save_failed:"Speichern fehlgeschlagen",load_failed:"Zeitpl\xE4ne konnten nicht geladen werden"},ii={en:Ye,de:si},K=s=>ii[s]||Ye;var oi=5,ai=400,ci=9,hi=16,li=28,di=24,ct=56,Xe=18,ui=48,pi=100,fi=()=>!!customElements.get("ha-icon"),_i=s=>s?.locale?.language||s?.language||"en",ht=new Map,Y=class extends ${constructor(){super(),this._config=null,this._hass=void 0,this._locale="en",this._lang="en",this._status="loading",this._error="",this._name="",this._entityId=null,this._days=null,this._savedJson="",this._history=[],this._future=[],this._ghost=null,this._sheet=null,this._saving=!1,this._toast="",this._sheetOpenedAt=0,this._loadStarted=!1,this._scrolled=!1,this._gridEl=null,this._gesture=null,this._op=null,this._startXY=[0,0],this._lastXY=[0,0],this._raf=0,this._coarse=window.matchMedia("(pointer: coarse)").matches,this._press=null,this._onPress=t=>{this._gridEl&&(this._press=this._point(t.clientX,t.clientY))},this._onKey=t=>this._handleKey(t),this._onBeforeUnload=t=>{this._dirty&&(t.preventDefault(),t.returnValue="")},this._tick=()=>this._autoScroll()}set hass(t){let e=!this._hass,i=_i(t),r=i!==this._locale;this._hass=t,this._locale=i,this._lang=i.split("-")[0],e&&this.isConnected&&this._config?this._load():r&&this.requestUpdate()}get hass(){return this._hass}setConfig(t){if(!t?.entity)throw new Error("entity is required");let e=t.entity!==this._config?.entity;this._config=t,e&&this._hass&&this.isConnected&&this._load()}getCardSize(){return 12}getGridOptions(){return{columns:"full",rows:"auto"}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey),window.addEventListener("beforeunload",this._onBeforeUnload),this._hass&&this._config&&!this._loadStarted?this._load():this._days&&(this._scrolled=!1)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKey),window.removeEventListener("beforeunload",this._onBeforeUnload),this._storeDraft(),cancelAnimationFrame(this._raf),this._gesture?.destroy(),this._gesture=null,this._gridEl?.removeEventListener("pointerdown",this._onPress,!0),this._gridEl=null}get _t(){return K(this._lang)}get _slotH(){return this._coarse?di:li}get _dirty(){return!!this._days&&JSON.stringify(nt(this._days))!==this._savedJson}async _load(){this._loadStarted=!0,this._status="loading";let t=this._config.entity;try{let e=await this._hass.callWS({type:"schedule_editor/list"});if(t!==this._config.entity)return;let i=e.find(r=>r.entity_id===t);this._status="ready",this._error="",this._entityId=t,this._name=i?.name??"",this._days=i?Le(i):null,this._savedJson=this._days?JSON.stringify(nt(this._days)):"",this._history=[],this._future=[],this._sheet=null,this._ghost=null,this._scrolled=!1,this._restoreDraft()}catch(e){this._status="error",this._error=`${this._t.load_failed}: ${e?.message||e}`}}_storeDraft(){this._entityId&&(this._dirty?ht.set(this._entityId,{days:this._days,savedJson:this._savedJson,history:this._history,future:this._future}):ht.delete(this._entityId))}_restoreDraft(){let t=ht.get(this._entityId);ht.delete(this._entityId),!(!t||!this._days||t.savedJson!==this._savedJson)&&(this._days=t.days,this._history=t.history,this._future=t.future)}_discard(){window.confirm(this._t.discard_confirm)&&this._load()}_commit(t){this._history=[...this._history,this._days].slice(-pi),this._future=[],this._days=t}_undo(){this._history.length&&(this._future=[this._days,...this._future],this._days=this._history[this._history.length-1],this._history=this._history.slice(0,-1))}_redo(){this._future.length&&(this._history=[...this._history,this._days],this._days=this._future[0],this._future=this._future.slice(1))}async _save(){if(this._saving||!this._dirty)return;this._saving=!0,this._error="";let t=nt(this._days);try{await this._hass.callWS({type:"schedule_editor/update",entity_id:this._entityId,...t}),this._savedJson=JSON.stringify(t),this._showToast(this._t.saved)}catch(e){this._error=`${this._t.save_failed}: ${e?.message||e}`}finally{this._saving=!1}}_showToast(t){this._toast=t,clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{this._toast=""},2500)}_handleKey(t){if(this._sheet){t.key==="Escape"&&this._closeSheet();return}if(!this._days)return;let e=t.ctrlKey||t.metaKey,i=t.key.toLowerCase();e&&!t.shiftKey&&i==="z"?(t.preventDefault(),this._undo()):e&&(i==="y"||t.shiftKey&&i==="z")&&(t.preventDefault(),this._redo())}_gestureConfig(){let t={filterTaps:!0};return this._coarse&&(t.preventScroll=ai,t.pointer={touch:!0}),t}_point(t,e){let i=this._gridEl.getBoundingClientRect(),r=O(Math.floor((t-i.left)/i.width*7),0,6),n=O(Ue(e-i.top,this._slotH),0,1440-.001);return{day:r,minute:n}}_onDrag(t){if(t.tap){this._beginOp(t.initial);let i=this._op;this._op=null,this._tap(i);return}t.first&&this._beginOp(t.initial);let e=this._op;e&&(this._lastXY=t.xy,e.moved||Math.hypot(t.xy[0]-this._startXY[0],t.xy[1]-this._startXY[1])>oi&&(e.moved=!0,this._raf=requestAnimationFrame(this._tick)),e.moved&&!t.last&&this._updateGhost(e),t.last&&this._endOp())}_beginOp(t){this._startXY=[t[0],t[1]],this._lastXY=this._startXY;let e=this._press??this._point(t[0],t[1]),i=Be(this._days[e.day],e.minute,this._slotH/30,this._coarse?hi:ci),r={day:e.day,anchor:e.minute,moved:!1,hitId:i?.block.id??null};i?i.zone==="body"?this._op={...r,type:"move",id:i.block.id,grab:e.minute-i.block.from}:this._op={...r,type:"resize",id:i.block.id,edge:i.zone}:this._op={...r,type:"create"}}_updateGhost(t){if(!t)return;let e=this._point(this._lastXY[0],this._lastXY[1]),i=this._days[t.day];if(t.type==="create"){let n=Ht(i,t.anchor,e.minute);this._ghost=n?{kind:"create",day:t.day,...n,valid:!0}:null;return}let r=i.find(n=>n.id===t.id);if(r)if(t.type==="resize"){let n=Ge(i,r,t.edge,e.minute);this._ghost={kind:"resize",id:t.id,day:t.day,...n,valid:!0}}else{let n=ze(this._days,r,e.day,e.minute,t.grab);this._ghost={kind:"move",id:t.id,...n}}}_endOp(){let t=this._op;this._op=null,cancelAnimationFrame(this._raf),this._raf=0,t&&(t.moved?this._finishDrag(t):this._tap(t))}_finishDrag(t){this._updateGhost(t);let e=this._ghost;if(this._ghost=null,!e||!e.valid)return;if(e.kind==="create"){this._commit(Gt(this._days,e.day,e.from,e.to));return}let i=this._days[t.day].find(r=>r.id===t.id);if(i){if(e.kind==="resize"){if(e.from===i.from&&e.to===i.to)return;this._commit(at(this._days,e.day,e.id,e.from,e.to));return}e.day===t.day&&e.from===i.from&&e.to===i.to||this._commit(Ke(this._days,t.day,e.id,e.day,e.from,e.to))}}_tap(t){this._ghost=null;let e=this._days[t.day];if(t.hitId!=null){let r=e.find(n=>n.id===t.hitId);r&&this._openSheet(t.day,r);return}let i=Ht(e,t.anchor,t.anchor);i&&this._commit(Gt(this._days,t.day,i.from,i.to))}_autoScroll(){if(this._raf=0,!this._op?.moved)return;let t=this.renderRoot.querySelector(".scroller"),e=this.renderRoot.querySelector(".head");if(t){let i=t.getBoundingClientRect(),r=i.top+(e?.offsetHeight||0)+ct,n=i.bottom-ct,o=this._lastXY[1],c=0;o<r?c=-Math.min(1,(r-o)/ct)*Xe:o>n&&(c=Math.min(1,(o-n)/ct)*Xe),c&&(t.scrollTop+=c,this._updateGhost(this._op))}this._raf=requestAnimationFrame(this._tick)}_openSheet(t,e){this._sheetOpenedAt=performance.now(),this._sheet={day:t,id:e.id,from:Lt(e.from),to:Lt(e.to),hasData:!!e.data,error:""}}_closeSheet(){this._sheet=null}_onBackdrop(){performance.now()-this._sheetOpenedAt<450||this._closeSheet()}_sheetInput(t,e){this._sheet={...this._sheet,[t]:e.target.value,error:""}}_applySheet(){let t=this._sheet,e=Ut(t.from,!1),i=Ut(t.to,!0),r=Ve(this._days[t.day],t.id,e,i);if(r){this._sheet={...t,error:this._t[`err_${r}`]};return}let n=this._days[t.day].find(o=>o.id===t.id);n&&(n.from!==e||n.to!==i)&&this._commit(at(this._days,t.day,t.id,e,i)),this._sheet=null}_deleteFromSheet(){let t=this._sheet;this._commit(je(this._days,t.day,t.id)),this._sheet=null}updated(){let t=this.renderRoot.querySelector(".grid");if(t!==this._gridEl&&(this._gesture?.destroy(),this._gesture=null,this._gridEl?.removeEventListener("pointerdown",this._onPress,!0),this._gridEl=t,t&&(t.addEventListener("pointerdown",this._onPress,!0),this._gesture=new Pe(t,e=>this._onDrag(e),this._gestureConfig()))),t&&!this._scrolled){let e=this.renderRoot.querySelector(".scroller");e&&(e.scrollTop=ot(360,this._slotH),this._scrolled=!0)}}_dayName(t,e){return new Date(2024,0,1+t).toLocaleDateString(this._locale,{weekday:e})}_btn({icon:t,label:e,onClick:i,disabled:r=!1,primary:n=!1,iconOnly:o=!1,glyph:c}){let a=fi(),l=o&&a?"hidden":a?"optional":"";return _`<button
      class="btn ${n?"primary":""}"
      ?disabled=${r}
      title=${e}
      aria-label=${e}
      @click=${i}
    >
      ${a?_`<ha-icon icon=${t}></ha-icon>`:u}
      <span class=${l}>${a?e:c??e}</span>
    </button>`}render(){let t=this._t,e;return this._status==="loading"?e=_`<p class="notice">${t.loading}</p>`:this._status==="error"?e=_`<p class="notice error">${this._error}</p>`:this._days?e=this._renderEditor():e=_`<p class="notice">${t.not_found}</p>`,_`<ha-card class="page">
      ${this._days?this._renderBar():u}
      ${this._error&&this._status==="ready"?_`<div class="banner">
            <span>${this._error}</span>
            <button class="btn" @click=${()=>this._error=""}>×</button>
          </div>`:u}
      ${e} ${this._sheet?this._renderSheet():u}
      ${this._toast?_`<div class="toast">${this._toast}</div>`:u}
    </ha-card>`}_renderBar(){let t=this._t,e=this._dirty;return _`<header class="bar">
      <div class="title">
        ${e?_`<span class="dot"></span><span>${t.unsaved}</span>`:_`<span>${this._name}</span>`}
      </div>
      ${e?this._btn({icon:"mdi:close",label:t.discard,onClick:this._discard,iconOnly:!0,glyph:"\xD7"}):u}
      ${this._btn({icon:"mdi:undo",label:t.undo,onClick:this._undo,disabled:!this._history.length,iconOnly:!0,glyph:"\u21B6"})}
      ${this._btn({icon:"mdi:redo",label:t.redo,onClick:this._redo,disabled:!this._future.length,iconOnly:!0,glyph:"\u21B7"})}
      ${this._btn({icon:"mdi:content-save",label:this._saving?t.saving:t.save,onClick:this._save,disabled:!e||this._saving,primary:!0})}
    </header>`}_renderEditor(){let t=this._slotH,e=(new Date().getDay()+6)%7,i=[0,1,2,3,4,5,6].map(r=>_`<span class="long">${this._dayName(r,"long")}</span
        ><span class="short">${this._dayName(r,"short")}</span>`);return _`<div class="scroller" style="--slot-h:${t}px; --gutter:${ui}px">
      <div class="head">
        <div></div>
        ${i.map((r,n)=>_`<div class="dayname ${n===e?"today":""}">${r}</div>`)}
      </div>
      <div class="body">
        <div class="gutter">
          ${Array.from({length:23},(r,n)=>n+1).map(r=>_`<span style="top:${r*2*t}px">${I(r*60)}</span>`)}
        </div>
        <div class="grid" @contextmenu=${r=>r.preventDefault()}>
          ${this._days.map((r,n)=>_`<div class="col ${n===e?"today":""}">
              ${r.map(o=>this._renderBlock(o))}
              ${this._ghost&&this._ghost.day===n?this._renderGhost(this._ghost):u}
            </div>`)}
        </div>
      </div>
    </div>`}_blockStyle(t,e){let i=this._slotH,r=ot(t,i)+1,n=Math.max(ot(e-t,i)-2,4);return`top:${r}px;height:${n}px`}_timeLabel(t,e){return _`<span class="time"><span>${I(t)}</span><span>${I(e)}</span></span>`}_renderBlock(t){let e=this._ghost&&this._ghost.id===t.id;return _`<div class="block ${e?"source":""}" style=${this._blockStyle(t.from,t.to)}>
      ${this._timeLabel(t.from,t.to)}
    </div>`}_renderGhost(t){return _`<div class="block ghost ${t.valid?"":"invalid"}" style=${this._blockStyle(t.from,t.to)}>
      ${this._timeLabel(t.from,t.to)}
    </div>`}_renderSheet(){let t=this._sheet,e=this._t;return _`<div class="backdrop" @click=${this._onBackdrop}>
      <div class="sheet" role="dialog" aria-modal="true" @click=${i=>i.stopPropagation()}>
        <h2>${e.edit_block} · ${this._dayName(t.day,"long")}</h2>
        <div class="fields">
          <label
            >${e.from}
            <input type="time" .value=${t.from} @input=${i=>this._sheetInput("from",i)} />
          </label>
          <label
            >${e.to}
            <input type="time" .value=${t.to} @input=${i=>this._sheetInput("to",i)} />
          </label>
        </div>
        <p class="hint">${e.end_hint}</p>
        ${t.hasData?_`<p class="hint">${e.has_data}</p>`:u}
        ${t.error?_`<p class="hint error">${t.error}</p>`:u}
        <div class="actions">
          <button class="sheet-btn danger" @click=${this._deleteFromSheet}>${e.delete}</button>
          <span class="spacer"></span>
          <button class="sheet-btn" @click=${this._closeSheet}>${e.cancel}</button>
          <button class="sheet-btn primary" @click=${this._applySheet}>${e.apply}</button>
        </div>
      </div>
    </div>`}};dt(Y,"properties",{_status:{state:!0},_error:{state:!0},_name:{state:!0},_days:{state:!0},_savedJson:{state:!0},_history:{state:!0},_future:{state:!0},_ghost:{state:!0},_sheet:{state:!0},_saving:{state:!0},_toast:{state:!0}}),dt(Y,"styles",pt`
    :host {
      display: block;
      /* fill the view below the dashboard header */
      height: calc(100vh - var(--header-height, 56px) - env(safe-area-inset-top) - env(safe-area-inset-bottom));
      height: calc(100dvh - var(--header-height, 56px) - env(safe-area-inset-top) - env(safe-area-inset-bottom));
      min-height: 320px;
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family, Roboto, Noto, sans-serif);
      -webkit-tap-highlight-color: transparent;
    }
    .page {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      position: relative;
      overflow: hidden;
    }

    /* top bar */
    .bar {
      flex: none;
      display: flex;
      align-items: center;
      gap: 4px;
      height: 52px;
      padding: 0 8px;
      box-sizing: border-box;
      border-bottom: 1px solid var(--divider-color);
    }
    .title {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 8px;
      font-size: 16px;
      font-weight: 500;
    }
    .title span:last-child {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dot {
      flex: none;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--warning-color, #ffa600);
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 40px;
      padding: 0 10px;
      border: 0;
      border-radius: 20px;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 14px;
      cursor: pointer;
    }
    .btn:hover:not([disabled]) {
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }
    .btn[disabled] {
      opacity: 0.4;
      cursor: default;
    }
    .btn.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .btn .optional {
      display: none;
    }
    .btn .hidden {
      display: none;
    }
    @media (min-width: 700px) {
      .btn .optional {
        display: inline;
      }
    }
    ha-icon {
      --mdc-icon-size: 22px;
      display: inline-flex;
    }

    .banner {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 4px 8px 4px 16px;
      background: var(--error-color, #db4437);
      color: #fff;
      font-size: 14px;
    }
    .notice {
      padding: 24px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .notice.error {
      color: var(--error-color, #db4437);
    }

    /* week grid */
    .scroller {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      background: var(--card-background-color);
    }
    .head {
      position: sticky;
      top: 0;
      z-index: 3;
      display: grid;
      grid-template-columns: var(--gutter) repeat(7, minmax(0, 1fr));
      background: var(--card-background-color);
      border-bottom: 1px solid var(--divider-color);
    }
    .dayname {
      padding: 10px 2px;
      text-align: center;
      font-size: 13px;
      font-weight: 500;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dayname .long {
      display: none;
    }
    @media (min-width: 700px) {
      .dayname .long {
        display: inline;
      }
      .dayname .short {
        display: none;
      }
    }
    .dayname.today {
      color: var(--primary-color);
      font-weight: 700;
    }
    .body {
      display: flex;
      position: relative;
      height: calc(48 * var(--slot-h));
      user-select: none;
      -webkit-user-select: none;
    }
    .gutter {
      position: relative;
      flex: none;
      width: var(--gutter);
    }
    .gutter span {
      position: absolute;
      right: 6px;
      transform: translateY(-50%);
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .grid {
      flex: 1;
      min-width: 0;
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      touch-action: pan-y;
      background-image:
        linear-gradient(var(--divider-color) 1px, transparent 1px),
        linear-gradient(color-mix(in srgb, var(--divider-color) 45%, transparent) 1px, transparent 1px);
      background-size:
        100% calc(var(--slot-h) * 2),
        100% var(--slot-h);
    }
    .col {
      position: relative;
      border-left: 1px solid var(--divider-color);
    }
    .col.today {
      background: color-mix(in srgb, var(--primary-color) 7%, transparent);
    }
    .block {
      position: absolute;
      left: 2px;
      right: 2px;
      box-sizing: border-box;
      padding: 2px 4px;
      overflow: hidden;
      border-radius: 6px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-size: 11px;
      line-height: 1.25;
      cursor: grab;
      --edge: min(9px, 33.3%);
    }
    @media (pointer: coarse) {
      .block {
        --edge: min(16px, 33.3%);
      }
    }
    .block::before,
    .block::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      height: var(--edge);
      cursor: ns-resize;
    }
    .block::before {
      top: 0;
    }
    .block::after {
      bottom: 0;
    }
    .block.source {
      opacity: 0.25;
    }
    .block.ghost {
      z-index: 2;
      pointer-events: none;
      opacity: 0.9;
      outline: 2px solid var(--text-primary-color, #fff);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    }
    .block.ghost.invalid {
      background: var(--error-color, #db4437);
    }
    .time {
      display: flex;
      flex-direction: column;
      pointer-events: none;
    }
    @media (min-width: 900px) {
      .time {
        flex-direction: row;
        gap: 0.25em;
      }
      .time span:first-child::after {
        content: " –";
      }
    }

    /* edit sheet */
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.45);
    }
    .sheet {
      box-sizing: border-box;
      width: min(420px, 92vw);
      padding: 16px 20px;
      border-radius: 12px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }
    .sheet h2 {
      margin: 0 0 12px;
      font-size: 18px;
      font-weight: 500;
    }
    .fields {
      display: flex;
      gap: 12px;
    }
    .fields label {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .fields input {
      box-sizing: border-box;
      width: 100%;
      padding: 10px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 16px;
    }
    .hint {
      margin: 10px 0 0;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .hint.error {
      color: var(--error-color, #db4437);
      font-size: 13px;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
    }
    .spacer {
      flex: 1;
    }
    .sheet-btn {
      padding: 10px 16px;
      border: 1px solid var(--divider-color);
      border-radius: 20px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
      cursor: pointer;
    }
    .sheet-btn.primary {
      border-color: var(--primary-color);
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .sheet-btn.danger {
      color: var(--error-color, #db4437);
    }
    @media (max-width: 600px) {
      .backdrop {
        align-items: flex-end;
      }
      .sheet {
        width: 100%;
        border-radius: 16px 16px 0 0;
        padding-bottom: calc(16px + env(safe-area-inset-bottom));
      }
    }

    .toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%);
      z-index: 11;
      padding: 10px 18px;
      border-radius: 20px;
      background: var(--primary-text-color);
      color: var(--card-background-color);
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  `);customElements.get("schedule-editor-card")||customElements.define("schedule-editor-card",Y);var zt=s=>s.split(".")[1];function mi(s,t){let e=K(t),i={title:e.title,path:"overview",icon:"mdi:calendar-clock",cards:s.length?s.map(n=>({type:"tile",entity:n.entity_id,name:n.name,tap_action:{action:"navigate",navigation_path:`/schedule-editor/${zt(n.entity_id)}`},icon_tap_action:{action:"navigate",navigation_path:`/schedule-editor/${zt(n.entity_id)}`}})):[{type:"markdown",content:e.none}]},r=s.map(n=>({title:n.name,path:zt(n.entity_id),icon:n.icon||"mdi:calendar-clock",subview:!0,type:"panel",cards:[{type:"custom:schedule-editor-card",entity:n.entity_id}]}));return{title:e.title,views:[i,...r]}}var Vt=class extends HTMLElement{static async generate(t,e){let i=(e.locale?.language||e.language||"en").split("-")[0],r=[];try{r=await e.callWS({type:"schedule_editor/list"})}catch(n){let o=K(i);return{title:o.title,views:[{title:o.title,cards:[{type:"markdown",content:`${o.load_failed}: ${n?.message||n}`}]}]}}return mi(r,i)}};customElements.get("ll-strategy-dashboard-schedule-editor")||customElements.define("ll-strategy-dashboard-schedule-editor",Vt);
