import{J as oe,bo as re,r as d,V as ie,x as a,j as e,M as t,Y as se,a9 as i,O as f,aS as P,am as $,a4 as H,a3 as k,aO as F,ac as y,aj as ce,bw as le}from"../multikey/multikey.D1_AnZj2.js";import{a as s,u as de,g as me,b as he,m as pe,S as O,M as ue,i as be}from"../multikey/multikey.DANc9zrZ.js";import{P as ge}from"../multikey/multikey.CSfMaGzx.js";import{u as R}from"../multikey/multikey.Dix-r58g.js";import{h as I,c as M}from"../multikey/multikey.CsbyK74s.js";const fe=()=>{const{t:o}=oe(),[c]=re(),u=c.get("id"),v=c.get("status"),S=c.get("amount"),J=c.get("to"),q=c.get("wallet"),j=c.get("digits"),N=c.get("tokenSymbol"),U=c.get("tx_hash"),V=s.currNetwork(),z=c.get("created_at"),r=de(me),D=s.getCache("current"),[b,Y]=d.useState(null),[G,x]=d.useState(!1),[K,A]=d.useState({contractName:"MultiSignConfirm",ProposalId:0,Status:""}),Q=ie(),X=he(),L=d.useMemo(()=>({jsonrpc:"2.0",method:"ibax.getList",id:1,params:[{name:"@1multi_sign_confirmations",where:`{"proposal_id": ${u}}`,order:{id:-1},offset:0}]}),[u]),Z=d.useMemo(()=>({jsonrpc:"2.0",method:"ibax.getList",id:1,params:[{name:"@1multi_sign_proposals",where:`{"wallet": ${r.wallet},"status": "ongoing"}`,limit:10,columns:"id"}]}),[r.wallet]),T=d.useCallback(async()=>{const n=await pe(L);Y(n)},[L]),w=d.useMemo(()=>{if(r.owners){const n=JSON.parse(r.owners),l=Object.keys(n),m=b?b.list:[];return l.map(p=>{const h=m?m.find(g=>g.creator===p):"";return{account:p,status:h?h.status:"",time:h?h.created_at:"",isBtn:v==="ongoing"&&p===D.account}})}return[]},[D.account,b,v,r.owners]);d.useEffect(()=>{T()},[T]);const ee=()=>{try{const n=s.getCacheToken("type"),l={contractName:"MultiSignConfirm",ProposalId:Number(u),Status:"rejected"};if(n==="jutkey_connect"){const m=s.currNetwork(),{walletId:C}=m,p=C,{host:h,origin:g}=document.location,_={host:h,origin:g};chrome.runtime.sendMessage(p,{path:"notice/contract",params:{pageInfo:_,contractParams:l}},ae=>{})}else x(!0),A({contractName:"MultiSignConfirm",ProposalId:Number(u),Status:"rejected"})}catch{}},te=()=>{try{const n=s.getCacheToken("type"),l={contractName:"MultiSignConfirm",ProposalId:Number(u),Status:"approved"};if(n==="jutkey_connect"){const m=s.currNetwork(),{walletId:C}=m,p=C,{host:h,origin:g}=document.location,_={host:h,origin:g};chrome.runtime.sendMessage(p,{path:"notice/contract",params:{pageInfo:_,contractParams:l}},ae=>{})}else x(!0),A({contractName:"MultiSignConfirm",ProposalId:Number(u),Status:"approved"})}catch{}},ne=()=>{x(!1)},W=async()=>{x(!1),Q("/message",{replace:!0}),await X(be(Z))},B=R(ee),E=R(te);return d.useEffect(()=>{document.addEventListener("jutkeyEvent",async({detail:n})=>{s.getCacheToken("type"),n.type==="jutkey_contract"&&W()})}),a(ue,{children:[e(t,{variant:"h5",mb:3,children:o("home.messageDetails")}),J===r.wallet?a(se,{children:[a(i,{direction:"row",justifyContent:"center",mb:1,children:[e(t,{variant:"body2",component:"span",fontWeight:600,children:r.team_name}),e(t,{variant:"body2",component:"span",ml:1,children:o("home.achieve",{to:q})})]}),a(i,{direction:"row",justifyContent:"center",children:[e(t,{variant:"body2",component:"span",ml:.5,children:s.formatFixed(S,Number(j))}),e(t,{variant:"body2",component:"span",ml:.5,children:N})]})]}):a(f,{children:[e(f,{display:"flex",justifyContent:"center",children:a(f,{sx:{width:{md:"60%",sm:"100%"}},children:[e(t,{variant:"h6",mb:1,textAlign:"center",children:o("home.notice")}),e(P,{title:I(Number(z)*1e3),placement:"bottom",children:e(t,{variant:"body2",mb:1,textAlign:"center",sx:{cursor:"pointer"},children:M(Number(z))})}),v==="ongoing"?a(i,{direction:"row",justifyContent:"center",mb:1,children:[e(t,{variant:"body2",component:"span",children:r.team_name}),e(t,{variant:"body2",component:"span",ml:1,children:o("home.initiate")}),e(t,{variant:"body2",component:"span",ml:.5,children:s.formatFixed(S,Number(j))}),e(t,{variant:"body2",component:"span",ml:.5,children:N}),e(t,{variant:"body2",component:"span",ml:1,children:o("home.wait")})]}):v==="finished"?a(i,{direction:"row",justifyContent:"center",mb:1,children:[e(t,{variant:"body2",component:"span",children:r.team_name}),e(t,{variant:"body2",component:"span",ml:1,children:o("home.initiate")}),e(t,{variant:"body2",component:"span",ml:.5,children:s.formatFixed(S,Number(j))}),e(t,{variant:"body2",component:"span",ml:.5,children:N}),e(t,{variant:"body2",component:"span",ml:1,children:o("home.finish")})]}):"",a(i,{direction:"row",justifyContent:"space-around",mb:3,children:[a(i,{direction:"row",children:[a(t,{variant:"body2",children:[o("home.current"),":"]}),e(t,{variant:"body2",ml:.5,children:b?b.count:0})]}),a(i,{direction:"row",children:[a(t,{variant:"body2",children:[o("home.tactics"),":"]}),a(t,{variant:"body2",ml:.5,children:[r.threshold,"-",r.owner_quantity]})]})]}),e($,{sx:{display:{xs:"none",sm:"block",md:"block",mb:5},minWidth:600},children:w.length?w.map((n,l)=>e(H,{children:a(i,{width:"100%",direction:"row",justifyContent:"space-between",alignItems:"center",children:[e(t,{component:"span",variant:"body1",flex:3,children:n.account}),e(t,{component:"span",variant:"body1",ml:1,flex:.5,children:n.status==="approved"?e(k,{color:"success",fontSize:"large"}):n.status==="rejected"?e(F,{color:"error",fontSize:"large"}):e(k,{fontSize:"large"})}),n.time?e(P,{title:I(Number(n.time)*1e3),placement:"bottom",children:e(t,{variant:"body2",mb:1,textAlign:"right",flex:3,sx:{cursor:"pointer"},children:M(Number(n.time))})}):e(t,{component:"span",variant:"body1",ml:.5,flex:3,textAlign:"center",children:n.isBtn?a(t,{component:"span",variant:"body1",ml:.5,display:"inline-flex",justifyContent:"space-between",children:[e(y,{variant:"filled",onClick:E,sx:{minWidth:100,lineHeight:2.4,ml:2},size:"large",children:o("home.approved")}),e(y,{variant:"outlined",onClick:B,sx:{minWidth:100,lineHeight:2.4,ml:2},size:"large",children:o("home.rejected")})]}):""})]})},l)):e(O,{num:3})})]})}),e($,{sx:{display:{xs:"block",sm:"none",md:"none",mb:5}},children:w.length?w.map((n,l)=>e(H,{sx:{width:{sm:"100%",md:"48%"},px:3,py:2,backgroundColor:m=>m.palette.surfaceContainer.main,borderRadius:5,mb:2,cursor:"pointer"},children:a(f,{width:"100%",children:[a(i,{width:"100%",direction:"row",justifyContent:"space-between",alignItems:"center",mb:1,children:[e(t,{component:"span",variant:"body2",children:n.account}),e(t,{component:"span",variant:"body2",ml:1,children:n.status==="approved"?e(k,{color:"success",fontSize:"medium"}):n.status==="rejected"?e(F,{color:"error",fontSize:"medium"}):e(k,{fontSize:"medium"})})]}),e(i,{children:n.time?e(P,{title:I(Number(n.time)*1e3),placement:"bottom",children:e(t,{variant:"body2",mb:1,flex:2,sx:{cursor:"pointer"},children:M(Number(n.time))})}):e(t,{component:"span",variant:"body1",ml:.5,flex:2,children:n.isBtn?a(t,{component:"span",variant:"body1",ml:.5,display:"inline-flex",justifyContent:"space-between",children:[e(y,{variant:"filled",onClick:E,sx:{minWidth:120,lineHeight:2.4},size:"large",children:o("home.approved")}),e(y,{variant:"outlined",onClick:B,sx:{minWidth:120,lineHeight:2.4,ml:1},size:"large",children:o("home.rejected")})]}):""})})]})},l)):e(O,{num:3})})]}),e(f,{sx:{py:2,textAlign:"center"},children:e(y,{variant:"outlined",sx:{minWidth:150,lineHeight:2.4,height:52},component:ce,to:`${V.blockexplorer}/blockchain/hash/${U}`,target:"_blank",fullWidth:!1,endIcon:e(le,{}),size:"large",children:e(t,{variant:"body2",sx:{ml:1},children:o("home.explore")})})}),e(ge,{isCheck:G,params:K,close:ne,confirm:W})]})};fe.displayName="detailsPage";export{fe as Component};
