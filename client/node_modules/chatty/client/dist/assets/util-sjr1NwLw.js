import{c}from"./index-BELNGNtz.js";/**
 * @license lucide-react v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],h=c("x",u);function m(r){return new Date(r).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!1})}function M(r){const s=new Date,i=new Date(r),a=Math.floor((s-i)/1e3);if(a<60)return"just now";const o=Math.floor(a/60);if(o<60)return`${o} ${o===1?"minute":"minutes"} ago`;const t=Math.floor(o/60);if(t<24)return`${t} ${t===1?"hour":"hours"} ago`;const n=Math.floor(t/24);if(n<30)return`${n} ${n===1?"day":"days"} ago`;const e=Math.floor(n/30);if(e<12)return`${e} ${e===1?"month":"months"} ago`;const f=Math.floor(e/12);return`${f} ${f===1?"year":"years"} ago`}export{h as X,M as a,m as f};
//# sourceMappingURL=util-sjr1NwLw.js.map
