import{U as X,bk as Z,r as c,a6 as ee,x as a,j as e,a2 as t,a3 as te,H as i,G as m,a_ as k,Y as D,ac as $,ay as v,W as T,aD as h,a8 as ne,bs as ae}from"../.pnpm/.pnpm.B-gp-w2q.js";import{a as p,u as oe,g as re,b as ie,m as se,S as F,M as ce,i as le}from"../multikey/index.BlJOL7H-.js";import{h as N,c as _}from"../day/day.cNqXafCC.js";import{P as de}from"../PasswordBox/PasswordBox.By85GjYI.js";const me=()=>{const{t:o}=X(),[s]=Z(),u=s.get("id"),b=s.get("status"),w=s.get("amount"),W=s.get("to"),E=s.get("wallet"),C=s.get("digits"),S=s.get("tokenSymbol"),O=s.get("tx_hash"),R=p.currNetwork(),P=s.get("created_at"),r=oe(re),z=p.getCache("current"),[l,U]=c.useState(null),[q,f]=c.useState(!1),[G,M]=c.useState({contractName:"MultiSignConfirm",ProposalId:0,Status:""}),H=ee(),J=ie(),I=c.useMemo(()=>({jsonrpc:"2.0",method:"ibax.getList",id:1,params:[{name:"@1multi_sign_confirmations",where:`{"proposal_id": ${u}}`,order:{id:-1},offset:0}]}),[u]),Y=c.useMemo(()=>({jsonrpc:"2.0",method:"ibax.getList",id:1,params:[{name:"@1multi_sign_proposals",where:`{"wallet": ${r.wallet},"status": "ongoing"}`,limit:10,columns:"id"}]}),[r.wallet]),A=c.useCallback(async()=>{const n=await se(I);U(n)},[I]),g=c.useMemo(()=>{if(r.owners){const n=JSON.parse(r.owners),d=Object.keys(n),y=l?l.list:[];return d.map(j=>{const x=y?y.find(V=>V.creator===j):"";return{account:j,status:x?x.status:"",time:x?x.created_at:"",isBtn:b==="ongoing"&&j===z.account}})}return[]},[z.account,l,b,r.owners]);c.useEffect(()=>{A()},[A]);const L=()=>{f(!0),M({contractName:"MultiSignConfirm",ProposalId:Number(u),Status:"rejected"})},B=()=>{f(!0),M({contractName:"MultiSignConfirm",ProposalId:Number(u),Status:"approved"})},K=()=>{f(!1)},Q=async()=>{f(!1),H("/message",{replace:!0}),await J(le(Y))};return a(ce,{children:[e(t,{variant:"h5",mb:3,children:o("home.messageDetails")}),W===r.wallet?a(te,{children:[a(i,{direction:"row",justifyContent:"center",mb:1,children:[e(t,{variant:"body2",component:"span",fontWeight:600,children:r.team_name}),e(t,{variant:"body2",component:"span",ml:1,children:o("home.achieve",{to:E})})]}),a(i,{direction:"row",justifyContent:"center",children:[e(t,{variant:"body2",component:"span",ml:.5,children:p.formatFixed(w,Number(C))}),e(t,{variant:"body2",component:"span",ml:.5,children:S})]})]}):a(m,{children:[e(m,{display:"flex",justifyContent:"center",children:a(m,{sx:{width:{md:"60%",sm:"100%"}},children:[e(t,{variant:"h6",mb:1,textAlign:"center",children:o("home.notice")}),e(k,{title:N(Number(P)*1e3),placement:"bottom",children:e(t,{variant:"body2",mb:1,textAlign:"center",sx:{cursor:"pointer"},children:_(Number(P))})}),b==="ongoing"?a(i,{direction:"row",justifyContent:"center",mb:1,children:[e(t,{variant:"body2",component:"span",children:r.team_name}),e(t,{variant:"body2",component:"span",ml:1,children:o("home.initiate")}),e(t,{variant:"body2",component:"span",ml:.5,children:p.formatFixed(w,Number(C))}),e(t,{variant:"body2",component:"span",ml:.5,children:S}),e(t,{variant:"body2",component:"span",ml:1,children:o("home.wait")})]}):b==="finished"?a(i,{direction:"row",justifyContent:"center",mb:1,children:[e(t,{variant:"body2",component:"span",children:r.team_name}),e(t,{variant:"body2",component:"span",ml:1,children:o("home.initiate")}),e(t,{variant:"body2",component:"span",ml:.5,children:p.formatFixed(w,Number(C))}),e(t,{variant:"body2",component:"span",ml:.5,children:S}),e(t,{variant:"body2",component:"span",ml:1,children:o("home.finish")})]}):"",a(i,{direction:"row",justifyContent:"space-around",mb:3,children:[a(i,{direction:"row",children:[a(t,{variant:"body2",children:[o("home.current"),":"]}),e(t,{variant:"body2",ml:.5,children:l?l.count:0})]}),a(i,{direction:"row",children:[a(t,{variant:"body2",children:[o("home.tactics"),":"]}),a(t,{variant:"body2",ml:.5,children:[r.threshold,"-",r.owner_quantity]})]})]}),e(D,{sx:{display:{xs:"none",sm:"none",md:"block",mb:5}},children:g.length?g.map((n,d)=>e($,{children:a(i,{width:"100%",direction:"row",justifyContent:"space-between",alignItems:"center",children:[e(t,{component:"span",variant:"body1",flex:3,children:n.account}),e(t,{component:"span",variant:"body1",ml:1,flex:.5,children:n.status==="approved"?e(v,{color:"success",fontSize:"large"}):n.status==="rejected"?e(T,{color:"error",fontSize:"large"}):e(v,{fontSize:"large"})}),n.time?e(k,{title:N(Number(n.time)*1e3),placement:"bottom",children:e(t,{variant:"body2",mb:1,textAlign:"right",flex:3,sx:{cursor:"pointer"},children:_(Number(n.time))})}):e(t,{component:"span",variant:"body1",ml:.5,flex:3,textAlign:"center",children:n.isBtn?a(t,{component:"span",variant:"body1",ml:.5,display:"inline-flex",justifyContent:"space-between",children:[e(h,{variant:"filled",onClick:B,sx:{width:"auto",ml:2},size:"large",children:o("home.approved")}),e(h,{variant:"outlined",onClick:L,sx:{width:"auto",ml:2},size:"large",children:o("home.rejected")})]}):""})]})},d)):e(F,{num:3})})]})}),e(D,{sx:{display:{xs:"block",sm:"none",md:"none",mb:5}},children:g.length?g.map((n,d)=>e($,{sx:{width:{sm:"100%",md:"48%"},px:3,py:2,backgroundColor:y=>y.palette.surfaceContainer.main,borderRadius:5,mb:2,cursor:"pointer"},children:a(m,{width:"100%",children:[a(i,{width:"100%",direction:"row",justifyContent:"space-between",alignItems:"center",mb:1,children:[e(t,{component:"span",variant:"body2",children:n.account}),e(t,{component:"span",variant:"body2",ml:1,children:n.status==="approved"?e(v,{color:"success",fontSize:"medium"}):n.status==="rejected"?e(T,{color:"error",fontSize:"medium"}):e(v,{fontSize:"medium"})})]}),e(i,{children:n.time?e(k,{title:N(Number(n.time)*1e3),placement:"bottom",children:e(t,{variant:"body2",mb:1,flex:2,sx:{cursor:"pointer"},children:_(Number(n.time))})}):e(t,{component:"span",variant:"body1",ml:.5,flex:2,children:n.isBtn?a(t,{component:"span",variant:"body1",ml:.5,display:"inline-flex",justifyContent:"space-between",children:[e(h,{variant:"filled",onClick:B,sx:{width:"auto"},size:"large",children:o("home.approved")}),e(h,{variant:"outlined",onClick:L,sx:{width:"auto",ml:1},size:"large",children:o("home.rejected")})]}):""})})]})},d)):e(F,{num:3})})]}),e(m,{sx:{py:2,textAlign:"center"},children:e(h,{component:ne,to:`${R.blockexplorer}/blockchain/hash/${O}`,target:"_blank",fullWidth:!1,endIcon:e(ae,{}),size:"large",children:e(t,{variant:"body2",sx:{ml:1},children:o("home.explore")})})}),e(de,{isCheck:q,params:G,close:K,confirm:Q})]})};me.displayName="detailsPage";export{me as Component};