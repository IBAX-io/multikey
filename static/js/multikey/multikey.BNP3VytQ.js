import{bw as n,bx as o,by as r,bz as m,bA as u}from"./multikey.B-gp-w2q.js";n.extend(o);n.extend(r);n.extend(m);n.extend(u);if(typeof window<"u"){const e=window.localStorage.getItem("lang")||"en";n.locale(e)}function s(e){return e?n.utc(Number(e)).format("YYYY-MM-DD HH:mm:ss"):""}function f(e){return n(Number(e)).format("YYYY-MM-DD HH:mm:ss")}function b(e){return e?n(Number(e)*1e3).format("DD/MM YY HH:mm"):""}function i(e){const a=Number(new Date().getTime()/1e3),t=Math.trunc(a-Number(e));return t<=60?t:n(Number(e)*1e3).fromNow()}export{f as a,i as b,b as c,s as h};
