import{U as se,bk as ce,a6 as le,r as h,x as t,j as e,a2 as r,a3 as g,H as a,a0 as O,$,G as x,a8 as C,aD as z,bl as de,bm as he,bn as me,bo as I,bp as o,bq as pe,a_ as P,br as ue,Y as fe,ac as be,X as F,aC as q,a4 as ge,ad as ye,ae as xe}from"../.pnpm/.pnpm.B-gp-w2q.js";import{u as ve,g as we,k as v,j,a as m,S as D,M as Se}from"../multikey/index.BlJOL7H-.js";import{h as U,a as A}from"../day/day.cNqXafCC.js";const $e=()=>{const{t:i}=se(),[W]=ce(),E=W.get("query"),{id:p,keyId:c,amount:G,digits:f,logoURI:R,tokenSymbol:l,assets:Y}=JSON.parse(decodeURIComponent(E)),J=le(),K=ve(we),b=v.addressToID(K.wallet),[s,k]=h.useState(null),[V,w]=h.useState(!1),[X,N]=h.useState(0),S=h.useRef(1),[_,B]=h.useState(!1),[Q,L]=h.useState(!1),y=10,u=h.useMemo(()=>({jsonrpc:"2.0",method:"ibax.getList",id:Date.now(),params:[{name:"@1history",where:`{ $or: [{ sender_id: ${c} }, { recipient_id: ${c} }], ecosystem: ${Number(p)} }`,order:{id:-1},offset:0,limit:y}]}),[p,c]),[Z,ee]=h.useState(u.params[0].limit),H=h.useCallback(async()=>{if(Number(c)){const n=await j(u);n&&k(n)}},[c,u]);h.useEffect(()=>{H()},[p,c,b,J,H,l,f]);const ne=async(n,d)=>{u.params[0].offset=d*y,N(d);const T=await j(u);k(T)},te=n=>{ee(+n.target.value),N(0)},re=async n=>{if(_)return;const{target:d}=n,T=d,{scrollHeight:ie,scrollTop:ae,offsetHeight:oe}=T;ae+oe>=ie-25&&Math.ceil(s.count/y)>S.current&&!_&&(B(!0),S.current+=1,u.params[0].offset=(S.current-1)*y,setTimeout(async()=>{const M=await j(u);Math.ceil(s.count/y)>S.current?L(!0):L(!1),k(()=>({count:M.count,list:[...s.list,...M.list]})),B(!1)},500))};return t(Se,{children:[e(r,{variant:"h5",mb:2,children:i("home.details")}),t(g,{children:[t(a,{direction:"row",justifyContent:"space-between",alignItems:"center",borderBottom:2,pb:2,mb:2,borderColor:n=>n.palette.surfaceVariant.main,children:[t(a,{direction:"row",alignItems:"center",flex:1,justifyContent:"space-between",children:[t(a,{direction:"row",alignItems:"center",children:[Number(p)===1?e($,{src:"/logo-big.png",sx:{width:30,height:30},children:e(O,{})}):e(g,{children:R?e($,{src:R,sx:{width:30,height:30}}):e($,{sx:{width:30,height:30},children:e(O,{fontSize:"medium"})})}),e(r,{variant:"body1",ml:2,children:l})]}),t(x,{children:[t(r,{ml:1,component:"div",children:["$ ",Y]}),e(r,{ml:1,component:"div",children:m.formatFixed(G,Number(f))})]})]}),t(a,{direction:"row",spacing:3,flex:1,justifyContent:"flex-end",sx:{display:{xs:"none",sm:"none",md:"flex"}},children:[e(z,{variant:"filled",to:`/receive/${l}/${p}/${c}`,component:C,size:"large",children:i("home.receive")}),e(z,{variant:"filled",to:`/transfer/${l}/${p}/${c}`,component:C,size:"large",children:i("home.transfer")})]})]}),t(a,{direction:"row",mb:3,spacing:3,justifyContent:"space-around",sx:{display:{xs:"flex",sm:"flex",md:"none"}},children:[e(z,{variant:"filled",to:`/receive/${l}/${p}/${c}`,component:C,size:"large",children:i("home.receive")}),e(z,{variant:"filled",to:`/transfer/${l}/${p}/${c}`,component:C,size:"large",children:i("home.transfer")})]})]}),e(x,{sx:{display:{xs:"none",sm:"none",md:"block"}},children:s?t(g,{children:[e(de,{sx:{minHeight:440},children:t(he,{sx:{minWidth:650},stickyHeader:!0,"aria-label":"sticky table",children:[e(me,{children:t(I,{children:[e(o,{width:150,align:"left",children:i("home.block")}),e(o,{align:"center",children:i("home.hash")}),e(o,{align:"center",children:i("home.address")}),e(o,{align:"center",children:i("home.date")}),e(o,{align:"center",children:i("home.type")}),e(o,{align:"center",children:i("home.amount")})]})}),e(pe,{children:s.list?s.list.map(n=>t(I,{sx:{"& > *":{borderBottom:"unset"}},children:[e(o,{align:"left",children:n.block_id}),e(o,{align:"center",sx:{maxWidth:150},children:e(P,{title:n.txhash,placement:"bottom",children:e(r,{variant:"body2",sx:{display:"block",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",cursor:"pointer"},children:n.txhash})})}),e(o,{align:"center",children:b===n.sender_id?v.addressString(n.recipient_id):v.addressString(n.sender_id)}),e(o,{align:"center",children:e(P,{title:U(n.created_at),placement:"bottom",children:e(r,{variant:"body2",sx:{cursor:"pointer"},children:A(n.created_at)})})}),e(o,{align:"center",children:i(m.eventType(Number(n.type)))}),e(o,{align:"center",children:b===n.sender_id?t(r,{variant:"body2",component:"span",color:d=>d.palette.success.light,children:["- ",m.formatFixed(n.amount,Number(f))," ",l]}):b===n.recipient_id?t(r,{variant:"body2",component:"span",color:d=>d.palette.error.light,children:["+ ",m.formatFixed(n.amount,Number(f))," ",l]}):t(r,{variant:"body2",component:"span",ml:.5,children:[m.formatFixed(n.amount,Number(f))," ",l]})})]},n.id)):e(I,{sx:{"& > *":{borderBottom:"unset"}},children:e(o,{align:"center",colSpan:6,children:e(r,{variant:"body1",children:i("login.no")})})})})]})}),s&&s.count?e(ue,{rowsPerPageOptions:[u.params[0].limit],component:"div",count:s.count,rowsPerPage:Z,page:X,onPageChange:ne,onRowsPerPageChange:te,sx:{"& .MuiButtonBase-root.Mui-disabled":{color:n=>n.palette.surfaceContainerHigh.main}}}):""]}):e(D,{num:3})}),e(x,{sx:{display:{xs:"block",sm:"block",md:"none"}},width:"100%",children:s?t(fe,{sx:{width:"100%",maxWidth:"100%",height:"60vh",overflowY:"auto",pb:5},onScroll:re,children:[s.list?s.list.map(n=>e(be,{sx:{p:2,backgroundColor:d=>d.palette.surfaceContainer.main,borderRadius:5,mb:2,cursor:"pointer"},children:t(x,{width:"100%",children:[t(a,{direction:"row",justifyContent:"space-between",mb:.5,width:"100%",spacing:2,children:[t(a,{direction:"row",flexShrink:0,children:[t(r,{mr:1,variant:"body2",fontSize:12,children:[i("home.block"),":"]}),e(r,{variant:"body2",fontSize:12,children:n.id})]}),t(a,{direction:"row",flex:1,children:[t(r,{mr:1,variant:"body2",fontSize:12,children:[i("home.amount"),":"]}),b===n.sender_id?"-":b===n.recipient_id?"+":"",e(r,{variant:"body2",component:"span",fontSize:12,ml:.5,children:m.formatFixed(n.amount,Number(f))}),e(r,{variant:"body2",component:"span",ml:1,fontSize:12,children:l})]})]}),t(a,{direction:"row",justifyContent:"space-between",width:"100%",spacing:2,children:[t(a,{direction:"row",flexShrink:0,children:[t(r,{mr:1,variant:"body2",fontSize:12,children:[i("home.date"),":"]}),e(P,{title:U(n.created_at),placement:"bottom",children:e(r,{variant:"body2",sx:{cursor:"pointer"},fontSize:12,children:A(n.created_at)})})]}),t(a,{direction:"row",flex:1,children:[t(r,{mr:1,variant:"body2",fontSize:12,children:[i("home.type"),":"]}),e(r,{variant:"body2",component:"span",fontSize:12,children:i(m.eventType(Number(n.type)))})]})]}),e(a,{direction:"row",justifyContent:"space-between",width:"100%",spacing:2,children:t(a,{direction:"row",flexShrink:0,alignItems:"center",children:[t(r,{mr:1,variant:"body2",fontSize:12,children:[i("home.address"),":"]}),e(r,{variant:"body2",sx:{cursor:"pointer"},fontSize:12,children:v.addressString(n.recipient_id)}),e(F,{"aria-label":"ContentCopyIcon",onClick:()=>{m.copyToClipboard(v.addressString(n.recipient_id)),w(!0)},size:"medium",children:e(q,{fontSize:"medium",sx:{fontSize:14}})})]})}),t(a,{direction:"row",alignItems:"center",children:[t(r,{mr:1,variant:"body2",component:"span",fontSize:12,children:[i("home.hash"),":"]}),e(r,{fontSize:12,variant:"body2",component:"span",sx:{cursor:"pointer",display:"block",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",width:"200px"},children:n.txhash}),e(F,{sx:{fontSize:14},"aria-label":"ContentCopyIcon",onClick:()=>{m.copyToClipboard(n.txhash),w(!0)},size:"medium",children:e(q,{fontSize:"medium",sx:{fontSize:14}})})]})]})},n.id)):e(r,{variant:"body1",children:i("login.no")}),e(x,{sx:{display:"flex",justifyContent:"center",alignItems:"center",mt:3},children:_?t(g,{children:[e(ge,{size:20}),e(r,{variant:"body2",ml:2,children:i("nav.load")})]}):Q?e(g,{children:e(r,{variant:"body2",ml:2,children:i("nav.drop")})}):e(g,{children:e(r,{variant:"body2",ml:2,children:i("nav.nomore")})})})]}):e(D,{num:3})}),e(xe,{open:V,autoHideDuration:6e3,onClose:()=>{w(!1)},anchorOrigin:{vertical:"top",horizontal:"center"},children:e(ye,{onClose:()=>{w(!1)},severity:"success",sx:{width:"100%"},children:i("login.cody")})})]})};export{$e as Component};
