import{J as ye,r as s,V as Se,b8 as J,x as i,j as r,M as m,a9 as k,O as Z,av as A,aR as N,ba as w,$ as v,ay as P,aS as Ce,bm as ke,ac as G}from"../multikey/multikey.BhREcByE.js";import{b as Ae,u as Ne,g as we,k as _,h as ve,c as _e,a as l,M as De,i as Ee}from"../multikey/multikey.PuU20_-i.js";import{P as Te}from"../multikey/multikey.oz1jl10X.js";import{u as Pe}from"../multikey/multikey.D6cbcHWc.js";const je=()=>{const{t:n}=ye(),[e,X]=s.useState(null),[c,f]=s.useState(null),[h,x]=s.useState(null),[u,j]=s.useState(""),[F,K]=s.useState(""),[Q,Y]=s.useState(0),[I,ee]=s.useState(1),[p,y]=s.useState(null),[D,W]=s.useState(""),[te,E]=s.useState(!1),ae=Se(),ne=Ae(),z=Ne(we),{id:d,keyId:b,tokenSymbol:T}=J(),[S,M]=s.useState(_.addressString(b)),[C,H]=s.useState(J().amount),re=s.useMemo(()=>({jsonrpc:"2.0",method:"ibax.getList",id:1,params:[{name:"@1multi_sign_proposals",where:`{"wallet": ${z.wallet},"status": "ongoing"}`,limit:10,columns:"id"}]}),[z.wallet]),B=s.useMemo(()=>[{jsonrpc:"2.0",method:"ibax.getBalance",id:1,params:[_.addressString(b),Number(d)]}],[d,b]),L=s.useCallback(async()=>{const t=await ve(B);if(t&&t[0].result){const a=t[0].result;X(a)}},[B]),R=s.useMemo(()=>({jsonrpc:"2.0",method:"ibax.getList",id:1,params:[{name:"@1ecosystems",where:`{id:${d}}`}]}),[d]),U=s.useCallback(async()=>{const t=await _e(R);if(t&&t.list){const a=t.list[0];if(a.fee_mode_info){const o=JSON.parse(a.fee_mode_info);Number(o.fee_mode_detail.expedite_fee.flag)===2&&(ee(Number(o.fee_mode_detail.expedite_fee.flag)),Y(Number(o.follow_fuel)))}}},[R]);s.useEffect(()=>{L(),U()},[L,U]);const V=s.useCallback(t=>{if(t.trim().length<=0){const o={text:n("home.recipient"),boo:!0};return f(o),!1}else{if(l.validateAddress(t))return f({text:"",boo:!1}),!0;{const o={text:n("home.addreeType"),boo:!0};return f(o),!1}}},[n]),se=t=>{const{value:a}=t.target;M(a),V(a)},q=s.useCallback(t=>{const a=l.formatUnits(e==null?void 0:e.amount,e==null?void 0:e.digits);if(Number(t)<=0){const o={text:n("home.maxZero"),boo:!0};return x(o),!1}else if(l.comparedTo(t,a)){const o={text:n("home.maxAmount",{num:a,tokenSymbol:e==null?void 0:e.token_symbol}),boo:!0};return x(o),!1}else return x({text:"",boo:!1}),!0},[e==null?void 0:e.amount,e==null?void 0:e.digits,e==null?void 0:e.token_symbol,n]),oe=t=>{const{value:a}=t.target;Number(a)>=0&&(H(l.formatDecimalPlaces(a,e.digits)),q(a))},O=s.useCallback(t=>{const a=l.formatUnits(e==null?void 0:e.amount,e==null?void 0:e.digits);if(t.trim().length>0)if(Number(t)<=0){const g={text:n("home.maxZero"),boo:!0};return y(g),!1}else if(l.comparedTo(t,a)){const g={text:n("home.maxAmount",{num:a,tokenSymbol:e==null?void 0:e.token_symbol}),boo:!0};return y(g),!1}else return y({text:"",boo:!1}),!0;else return!0},[e==null?void 0:e.amount,e==null?void 0:e.digits,e==null?void 0:e.token_symbol,n]),ie=t=>{const{value:a}=t.target;if(Number(a)>=0){j(l.formatDecimalPlaces(a,e.digits));const o=l.formatFixed(Number(a)/(Q*10**e.digits),0);K(o),O(a)}},le=t=>{const{value:a}=t.target;W(a)},me=Pe(()=>{try{const t=V(S),a=q(C),o=O(u);if(t&&a&&o)if(l.getCacheToken("type")==="jutkey_connect"){const ce=l.currNetwork(),{walletId:he}=ce,pe=he,{host:be,origin:ge}=document.location,fe={host:be,origin:ge},xe={contractName:"MultiSignPropose",Wallet:_.addressString(b),To:S,Amount:l.parseUnits(C,Number(e==null?void 0:e.digits)),digits:Number(e==null?void 0:e.digits),Ecosystem:d,Expedite:String(u)?String(u):"0",Proposal:D};chrome.runtime.sendMessage(pe,{path:"notice/contract",params:{pageInfo:fe,contractParams:xe}},We=>{})}else E(!0)}catch{}}),ue=()=>{M(""),H(""),j(""),W(""),f(null),x(null),y(null)},de=()=>{E(!1)},$=async()=>{E(!1),await ne(Ee(re)),ae("/",{replace:!0})};return s.useEffect(()=>{document.addEventListener("jutkeyEvent",async({detail:t})=>{l.getCacheToken("type"),t.type==="jutkey_contract"&&$()})}),i(De,{children:[r(m,{variant:"h5",mb:3,children:n("home.transfer")}),i(k,{textAlign:"center",direction:"row",justifyContent:"center",mb:2,children:[r(m,{variant:"h6",children:T}),i(m,{variant:"h6",ml:1,children:["# ",d]})]}),i(k,{textAlign:"center",direction:"row",justifyContent:"center",mb:2,children:[i(m,{variant:"h6",children:[n("home.balance"),":"]}),r(m,{variant:"h6",ml:1,children:l.formatFixed(e==null?void 0:e.amount,e==null?void 0:e.digits)}),r(m,{variant:"h6",ml:1,children:T})]}),r(Z,{display:"flex",justifyContent:"center",children:i(Z,{sx:{width:{md:"80%",sm:"100%"}},children:[i(A,{fullWidth:!0,sx:{mb:2},children:[r(N,{htmlFor:"outlined-adornment-address",required:!0,sx:{fontSize:16},error:c?c.boo:!1,children:n("home.send")}),r(w,{fullWidth:!0,disabled:!0,placeholder:n("home.recipient"),size:"medium",autoComplete:"off",value:S,id:"outlined-adornment-address",onChange:se,startAdornment:r(v,{position:"start"}),label:n("home.send"),error:c?c.boo:!1}),r(P,{error:!0,children:c?c.text:""})]}),i(A,{fullWidth:!0,sx:{mb:2},children:[r(N,{htmlFor:"outlined-adornment-count",required:!0,sx:{fontSize:16},error:h?h.boo:!1,children:n("home.count")}),r(w,{id:"outlined-adornment-count",placeholder:n("home.dir"),type:"InputNumber",autoComplete:"off",size:"medium",fullWidth:!0,value:C,onChange:oe,startAdornment:r(v,{position:"start"}),label:n("home.count"),error:h?h.boo:!1}),r(P,{error:!0,children:h?h.text:""})]}),i(A,{fullWidth:!0,sx:{mb:2},children:[r(N,{htmlFor:"outlined-adornment-comment",sx:{fontSize:16},children:n("home.comment")}),r(w,{id:"outlined-adornment-comment",placeholder:n("home.commentInput"),fullWidth:!0,multiline:!0,autoComplete:"off",minRows:3,maxRows:5,value:D,onChange:le,startAdornment:r(v,{position:"start"}),label:n("home.comment"),inputProps:{maxLength:150}})]}),i(A,{fullWidth:!0,sx:{mb:2},children:[r(N,{htmlFor:"outlined-adornment-expedit",sx:{fontSize:16},error:p?p.boo:!1,children:n("home.expedit")}),r(w,{id:"outlined-adornment-expedit",placeholder:n("home.expeditInput"),type:"InputNumber",size:"medium",autoComplete:"off",fullWidth:!0,value:u,onChange:ie,startAdornment:r(v,{position:"start"}),label:n("home.expedit"),error:p?p.boo:!1}),r(P,{error:!0,children:p?p.text:""})]}),I===2&&Number(F)!==0?i(k,{direction:"row",mb:3,alignItems:"center",children:[i(m,{mr:.5,variant:"body2",children:[n("home.expedited"),":"]}),i(m,{variant:"body2",children:[u," ",T]}),r(m,{mx:.5,children:"≈"}),i(m,{variant:"body2",mr:1,children:[F," IBXC"]}),r(Ce,{title:n("user.urgentpay"),placement:"bottom",children:r(ke,{fontSize:"medium",sx:{cursor:"pointer"}})})]}):"",i(k,{direction:"row",justifyContent:"space-around",children:[r(G,{variant:"outlined",onClick:ue,sx:{minWidth:150,lineHeight:2.4},size:"large",children:n("login.cancel")}),r(G,{variant:"filled",onClick:me,sx:{minWidth:150,lineHeight:2.4},size:"large",children:n("login.confirm")})]})]})}),r(Te,{isCheck:te,params:{contractName:"MultiSignPropose",Wallet:_.addressString(b),To:S,Amount:l.parseUnits(C,Number(e==null?void 0:e.digits)),digits:Number(e==null?void 0:e.digits),Ecosystem:d,Expedite:String(u)?String(u):"0",Proposal:D},close:de,confirm:$})]})};je.displayName="CollectionPage";export{je as Component};