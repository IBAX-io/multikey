import{U as F,r,j as e,bv as ie,x as u,a2 as p,aI as B,aw as X,bu as ce,aD as y,G as D,a3 as re,ac as se,a_ as de,Y as ue,H as W,ad as q,ae as oe,av as he,aY as R,$ as J,ay as me,a1 as ge,aZ as _,b6 as V,aL as Y,X as Q,aC as ee,bB as ae}from"../.pnpm/.pnpm.B-gp-w2q.js";import{a as i,k as te,q as ne,b as pe,u as fe,r as we,s as G,v as be,w as Ce,M as ve}from"../multikey/index.BlJOL7H-.js";const xe=({isCheck:t,close:m,confirm:n})=>{const{t:a}=F(),[s,d]=r.useState("text"),[S,x]=r.useState(""),[A,v]=r.useState(!1),[C,f]=r.useState(a("login.pwEmpty")),P=()=>{x(""),v(!1),f(""),d(""),m()},$=r.useCallback(w=>{const z=i.getCache("current");return w==""?(v(!0),f(a("login.pwEmpty")),!1):w!==z.password?(v(!0),f(a("login.incorrect")),!1):(v(!1),f(""),!0)},[a]),k=w=>{const{value:z}=w.target;d("password"),x(w.target.value),$(z)},I=()=>{$(S)&&(x(""),d("text"),n())};return e(re,{children:e(ie,{open:t,onClose:P,"aria-labelledby":"modal-modal-title","aria-describedby":"modal-modal-description",children:u(D,{sx:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",bgcolor:"background.paper",boxShadow:24,p:2,borderRadius:2,width:{xs:"90%",md:"50%",lg:"30%",xl:"20%"}},children:[e(p,{id:"modal-modal-title",variant:"h6",component:"h2",mb:3,children:a("home.check")}),e(B,{sx:{minWidth:120,width:"100%",mb:3},required:!0,children:e(X,{required:!0,label:a("login.password"),onChange:k,size:"medium",autoComplete:"off",inputMode:"none",variant:"outlined",color:"secondary",type:s,value:S,error:A,fullWidth:!0,helperText:A?C:""})}),u(ce,{children:[e(y,{onClick:P,size:"large",children:a("login.cancel")}),e(y,{onClick:I,size:"large",children:a("login.confirm")})]})]})})})},ye=()=>{const{t}=F(),[m,n]=r.useState(null),[a,s]=r.useState(null),[d,S]=r.useState(!1),[x,A]=r.useState(!1),[v,C]=r.useState(""),[f,P]=r.useState(null),$=r.useCallback(c=>{if(c.trim().length<=0){const g={text:t("home.inputAccount"),boo:!0};return P(g),!1}else return P({text:"",boo:!1}),!0},[t]),k=c=>{const{value:h}=c.target;C(h),$(h)},I=()=>{x?S(!0):A(!0)},w=async()=>{const c=$(v),h=i.getCache("hasher"),g=te.getKeyring(h);if(c){const H=m[m.length-1],E=H.index+1,{privateKey:M}=ne.wallet(H.mnemonic,E),K=ne.publicKey(M),L=g.publicToID(K),l=te.addressString(L),o={id:i.uuid(),index:E,selectId:a.selectId,name:v,mnemonic:H.mnemonic,password:H.password,networkId:a.networkId,privateKey:M,publicKey:K,account:l,isShow:!0,isLogin:!1};m.push(o),n(()=>[...m]),i.setCache(`${a.mnemonic}-${a.selectId}`,m),A(!1),C("")}},z=(c,h)=>{h!=="clickaway"&&S(!1)},T=async c=>{if(m){const h=m.map(g=>(g.id===c&&(g.isShow=!1),g));n(()=>[...h]),i.setCache(`${a.mnemonic}-${a.selectId}`,h)}},O=async c=>{if(m){const h=m.map(g=>(g.id===c&&(g.isShow=!0),g));n(()=>[...h]),i.setCache(`${a.mnemonic}-${a.selectId}`,h)}};return r.useEffect(()=>{(()=>{const h=i.getCache("current");try{const g=i.getCache(`${h.mnemonic}-${h.selectId}`);n(g),s(h)}catch{}})()},[]),u(D,{mb:3,children:[e(p,{variant:"h6",mb:1,children:t("login.loacl")}),e(p,{variant:"body2",mb:3,children:t("login.now")}),e(ue,{sx:{maxHeight:"300px",overflowY:"auto",width:{md:"40%",sm:"100%"}},children:m?m.map(c=>u(se,{sx:{mb:2,p:0},children:[e(de,{title:c.name,placement:"bottom-start",children:e(p,{width:"60%",variant:"body2",sx:{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",cursor:"pointer"},children:c.name})}),c.isLogin?e(y,{disabled:c.isLogin,variant:"text",sx:{mx:1},size:"large",children:t("manage.current")}):c.isShow?e(y,{variant:"outlined",sx:{mx:1},onClick:()=>{T(c.id)},size:"large",children:t("manage.close")}):e(y,{sx:{mx:1},variant:"filled",onClick:()=>{O(c.id)},size:"large",children:t("manage.use")})]},c.id)):""}),x?e(B,{sx:{width:{md:"40%",sm:"100%"},display:"block",mb:1},children:u(W,{direction:"row",children:[e(X,{sx:{width:"60%"},placeholder:t("home.inputAccount"),size:"medium",fullWidth:!0,autoComplete:"off",value:v,variant:"standard",onChange:k,error:f?f.boo:!1,helperText:f?f.text:""}),e(y,{variant:"outlined",sx:{mx:1},onClick:w,size:"large",children:t("login.confirm")})]})}):"",e(D,{children:e(y,{variant:"filled",onClick:I,size:"large",children:t("manage.add")})}),e(oe,{open:d,autoHideDuration:3e3,onClose:z,anchorOrigin:{vertical:"top",horizontal:"center"},children:e(q,{onClose:z,severity:"warning",sx:{width:"100%"},children:t("manage.create")})})]})},Pe=window,Se=()=>{const{i18n:t}=F(),m=pe(),n=fe(we),a=async s=>{t.changeLanguage(s.value),await m(be(s.value)),await m(Ce(s.value)),localStorage.setItem("lang",s.value),Pe.location.reload()};return e(re,{children:e(he,{freeSolo:!0,id:"language-change",sx:{width:300},size:"medium",value:G.find(s=>s.value===n),options:G,getOptionLabel:s=>s.label,onChange:(s,d)=>{a(d)},disableClearable:!0,clearIcon:"",renderInput:s=>{var d;return e(X,{variant:"outlined",className:"team-search",...s,InputProps:{...s.InputProps,type:"search",startAdornment:e(R,{position:"start",children:e(J,{alt:"Remy Sharp",src:(d=G.find(S=>S.value===n))==null?void 0:d.logo,sx:{width:25,height:25}})})}})},renderOption:(s,d)=>u(se,{...s,children:[n===d.value?e(me,{color:"success"}):e(p,{fontSize:20,width:20}),e(J,{alt:"Remy Sharp",src:d.logo,sx:{width:25,height:25}}),e(ge,{primary:d.label,sx:{ml:1}})]})})})},ke=(t,m)=>{const{t:n}=F(),{success:a}=t,[s,d]=r.useState(null),[S,x]=r.useState(null),[A,v]=r.useState(""),[C,f]=r.useState(null),[P,$]=r.useState(""),[k,I]=r.useState(null),[w,z]=r.useState(""),[T,O]=r.useState(null),c=r.useCallback(l=>{if(l.trim().length<=0){const b={text:n("manage.oldPassword"),boo:!0};return f(b),!1}else if(l!==(s==null?void 0:s.password)){const b={text:n("manage.oldError"),boo:!0};return f(b),!1}else return f({text:"",boo:!1}),!0},[s==null?void 0:s.password,n]),h=l=>{const{value:o}=l.target;c(o),v(o)},g=r.useCallback(l=>{const o=l.trim();if(o.length<=0){const b={text:n("manage.inputPassword"),boo:!0};return I(b),!1}else if(o.length>50){const b={text:n("manage.longPassword"),boo:!0};return I(b),!1}else return I({text:"",boo:!1}),!0},[n]),H=l=>{const{value:o}=l.target;g(o),$(o)},E=r.useCallback(l=>{if(l.trim().length<=0){const b={text:n("manage.againPassword"),boo:!0};return O(b),!1}else if(l!==P){const b={text:n("manage.againNot"),boo:!0};return O(b),!1}else return O({text:"",boo:!1}),!0},[P,n]),M=l=>{const{value:o}=l.target;E(o),z(o)},K=()=>{v(""),$(""),z(""),O(null),I(null),f(null)};r.useImperativeHandle(m,()=>({handleCancel:K}));const L=()=>{const l=c(A),o=g(P),b=E(w),Z=i.getCache("accountList");if(l&&o&&b){d({...s,password:w});const le=Z.map(N=>(N.id===s.selectId&&(N.password=w),N));if(i.setCache("accountList",le),i.setCache("current",{...s,password:w}),S){const N=S.map(j=>(j.privateKey&&(j.password=w),j));x(()=>[...N]),i.setCache(`${s.mnemonic}-${s.selectId}`,N)}a()}};return r.useEffect(()=>{(()=>{const o=i.getCache("current"),b=i.getCache(`${o.mnemonic}-${o.selectId}`);i.getCache("accountList");try{d(o),x(b)}catch{}})()},[]),u(D,{mb:3,children:[e(p,{variant:"h6",mb:1,children:n("manage.safety")}),e(p,{variant:"body2",mb:2,children:n("manage.setting")}),u(D,{sx:{width:{md:"30%",sm:"100%"}},children:[u(B,{fullWidth:!0,sx:{mb:2},children:[e(_,{htmlFor:"outlined-adornment-oldPassword",required:!0,sx:{fontSize:16},error:C?C.boo:!1,children:n("manage.check")}),e(V,{fullWidth:!0,placeholder:n("manage.old"),size:"medium",autoComplete:"off",type:"password",value:A,id:"outlined-adornment-oldPassword",onChange:h,startAdornment:e(R,{position:"start"}),label:n("manage.check"),error:C?C.boo:!1}),e(Y,{error:!0,children:C?C.text:""})]}),u(B,{fullWidth:!0,sx:{mb:2},children:[e(_,{htmlFor:"outlined-adornment-newPassword",required:!0,sx:{fontSize:16},error:k?k.boo:!1,children:n("manage.newPassword")}),e(V,{fullWidth:!0,placeholder:n("manage.new"),size:"medium",autoComplete:"off",type:"password",value:P,id:"outlined-adornment-newPassword",onChange:H,startAdornment:e(R,{position:"start"}),label:n("manage.newPassword"),error:k?k.boo:!1}),e(Y,{error:!0,children:k?k.text:""})]}),u(B,{fullWidth:!0,sx:{mb:2},children:[e(_,{htmlFor:"outlined-adornment-againPassword",required:!0,sx:{fontSize:16},error:T?T.boo:!1,children:n("manage.again")}),e(V,{fullWidth:!0,placeholder:n("manage.new"),size:"medium",autoComplete:"off",type:"password",value:w,id:"outlined-adornment-againPassword",onChange:M,startAdornment:e(R,{position:"start"}),label:n("manage.again"),error:T?T.boo:!1}),e(Y,{error:!0,children:T?T.text:""})]}),u(W,{direction:"row",justifyContent:"space-around",children:[e(y,{variant:"outlined",onClick:K,sx:{width:"30%"},size:"large",children:n("login.cancel")}),e(y,{variant:"filled",onClick:L,sx:{width:"30%"},size:"large",children:n("login.confirm")})]})]})]})},Ie=r.forwardRef(ke),U=window,ze=()=>{const{t}=F(),[m,n]=r.useState(!1),[a,s]=r.useState(null),[d,S]=r.useState(!1),[x,A]=r.useState(!1),[v,C]=r.useState(!1),[f,P]=r.useState("mnemonic"),[$,k]=r.useState(t("login.cody")),I=r.useRef(),w=()=>{n(!1),I.current&&I.current.handleCancel()},z=()=>{P("mnemonic"),!v&&!x&&C(!0),x&&A(!1)},T=()=>{C(!1)},O=()=>{P("private"),!v&&!d&&C(!0),d&&S(!1)},c=()=>{n(!0),k(t("manage.success")),U.location.reload()},h=()=>{const L="privateKey.txt",l=new Blob([a.privateKey],{type:"text/plain;charset=utf-8"});ae.saveAs(l,L)},g=()=>{const L="mnemonic.txt",l=new Blob([a.mnemonic],{type:"text/plain;charset=utf-8"});ae.saveAs(l,L)};r.useEffect(()=>{(()=>{const l=i.getCache("current");try{s(l)}catch{}})()},[]);const H=()=>{if(i.removeCacheToken("token"),i.removeCache("teamSelect"),a!=null&&a.mnemonic){const l=(i.getCache(`${a.mnemonic}-${a.selectId}`)||[]).map(o=>(o.index===0?o.isLogin=!0:o.isLogin=!1,o));i.setCache(`${a.mnemonic}-${a.selectId}`,l)}U.location.href="/login"},E=()=>{P("cleanAccount"),v||C(!0)},M=()=>{const l=(i.getCache("accountList")||[]).filter(o=>o.id!==a.selectId);i.setCache("accountList",l),i.removeCacheToken("token"),a!=null&&a.mnemonic&&i.removeCache(`${a.mnemonic}-${a.selectId}`),U.location.href="/login"},K=()=>{if(C(!1),f==="mnemonic")return A(!0),!1;if(f==="private")return S(!0),!1;f==="cleanAccount"&&M()};return u(ve,{children:[e(p,{variant:"h5",mb:3,children:t("nav.manage")}),a&&a.mnemonic?e(ye,{}):"",e(Ie,{ref:I,success:c}),a&&a.mnemonic?u(D,{mb:2,children:[e(p,{variant:"h6",mb:1,children:t("manage.phrase")}),e(p,{variant:"body2",mb:2,children:t("manage.custody")}),x?e(W,{direction:"row",children:u(q,{severity:"success",sx:{mb:2,display:"flex",alignItems:"center"},children:[a.mnemonic,e(Q,{"aria-label":"ContentCopyIcon",onClick:()=>{n(!0),i.copyToClipboard(a.mnemonic),k(t("login.cody"))},size:"medium",children:e(ee,{})})]})}):"",u(W,{direction:"row",children:[e(y,{variant:"filled",onClick:z,size:"large",children:t(x?"manage.hide":"manage.show")}),x?e(y,{variant:"filled",onClick:g,sx:{mx:5},size:"large",children:t("manage.import")}):""]})]}):"",u(D,{mb:2,children:[e(p,{variant:"h6",mb:1,children:t("manage.private")}),e(p,{variant:"body2",mb:2,children:t("manage.custodyKey")}),d?e(W,{direction:"row",children:u(q,{severity:"success",sx:{mb:2,display:"flex",alignItems:"center"},children:[a.privateKey,e(Q,{"aria-label":"ContentCopyIcon",onClick:()=>{n(!0),i.copyToClipboard(a.privateKey)},size:"medium",children:e(ee,{})})]})}):"",u(W,{direction:"row",children:[e(y,{variant:"filled",onClick:O,size:"large",children:t(d?"manage.hidePrivate":"manage.showPrivate")}),d?e(y,{variant:"filled",onClick:h,sx:{mx:5},size:"large",children:t("manage.import")}):""]})]}),u(D,{mb:3,children:[e(p,{variant:"h6",mb:2,children:t("manage.language")}),e(p,{variant:"body2",mb:2,children:t("manage.select")}),e(Se,{})]}),u(D,{mb:3,children:[e(p,{variant:"h6",mb:2,children:t("manage.help")}),e(p,{variant:"body2",mb:2,children:t("manage.user")})]}),u(D,{mb:3,children:[e(p,{variant:"h6",mb:2,children:t("manage.about")}),e(p,{variant:"body2",mb:2,children:t("manage.open")})]}),u(D,{mb:3,children:[e(y,{variant:"filled",sx:{mb:2},onClick:E,size:"large",children:t("manage.clean")}),e(p,{variant:"body2",mb:2,children:t("manage.all")})]}),e(D,{mb:3,children:e(y,{variant:"filled",onClick:H,size:"large",children:t("exit")})}),e(oe,{anchorOrigin:{vertical:"top",horizontal:"center"},open:m,onClose:w,autoHideDuration:2e3,children:e(q,{onClose:w,severity:"success",variant:"filled",sx:{width:"100%"},children:$})}),e(xe,{isCheck:v,close:T,confirm:K})]})};export{ze as Component};