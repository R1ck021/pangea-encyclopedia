import React, { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'

const m = {
  bg:"#FFFFFF", bgS:"#F7F6F3", bgM:"#EEEDE9", bd:"#E2E0D9", bdM:"#D0CEC6",
  tx:"#1A1917", txS:"#57534E", txM:"#A8A29E", txH:"#C4BFB8"
}
const D = {
  amber:{l:"#FAEEDA",m:"#EF9F27",d:"#633806",b:"#E8C07A"},
  teal:{l:"#E1F5EE",m:"#1D9E75",d:"#085041",b:"#7DCDB0"},
  coral:{l:"#FAECE7",m:"#D85A30",d:"#712B13",b:"#F0997B"},
  purple:{l:"#EEEDFE",m:"#7F77DD",d:"#3C3489",b:"#B0AAEC"},
  blue:{l:"#E6F1FB",m:"#378ADD",d:"#0C447C",b:"#87BDE8"},
  green:{l:"#EAF3DE",m:"#639922",d:"#27500A",b:"#99C45A"},
  gray:{l:"#F1EFE8",m:"#A8A29E",d:"#57534E",b:"#D0CEC6"},
  steel:{l:"#E8EAED",m:"#5B6470",d:"#1E2328",b:"#9AA0A6"},
  pink:{l:"#FBEAF0",m:"#D4537E",d:"#72243E",b:"#EE97B4"},
  poison:{l:"#F3E8FD",m:"#9B3DB8",d:"#4A1A6B",b:"#C98EE0"},
  dark:{l:"#EEE9E4",m:"#5C4A3A",d:"#2A1F15",b:"#A08070"},
  ice:{l:"#E8F6FB",m:"#3AAAC8",d:"#0E4F6B",b:"#82CDE0"}
}

function Txt({t,s}){
  if(!t) return null
  const parts = t.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return <span style={s}>{parts.map((p,i)=>
    p.startsWith('**')&&p.endsWith('**') ? <strong key={i} style={{fontWeight:600,color:m.tx}}>{p.slice(2,-2)}</strong> :
    p.startsWith('*')&&p.endsWith('*') ? <em key={i} style={{fontStyle:'italic',color:m.txS}}>{p.slice(1,-1)}</em> :
    p
  )}</span>
}

function Tag({color,label,sm}){
  const c=D[color]||D.gray
  return <span style={{display:'inline-flex',alignItems:'center',fontSize:sm?10:11,padding:sm?'1px 6px':'2px 8px',borderRadius:99,fontWeight:500,marginRight:3,marginBottom:sm?0:3,background:c.l,color:c.d,border:`1px solid ${c.b}`}}>{label}</span>
}

function statColor(v){
  if(v>=130) return '#00E850'; if(v>=115) return '#6AE000'; if(v>=90) return '#C8D400'
  if(v>=70) return '#FFAA00'; if(v>=50) return '#FF5800'; return '#CC0000'
}
function StatBar({label,value}){
  const pct = Math.min(100,Math.round(value/160*100))
  return <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:5}}>
    <span style={{fontSize:11,color:m.txM,width:58,textAlign:'right',flexShrink:0}}>{label}</span>
    <div style={{flex:1,height:5,background:m.bgM,borderRadius:3,overflow:'hidden'}}>
      <div style={{width:`${pct}%`,height:'100%',background:statColor(value),borderRadius:3}}/>
    </div>
    <span style={{fontSize:12,fontWeight:600,width:24,flexShrink:0,color:m.txS}}>{value}</span>
  </div>
}

const Lead = ({text}) => <p style={{fontSize:15,lineHeight:1.8,color:m.tx,margin:'0 0 18px',paddingBottom:16,borderBottom:`1px solid ${m.bd}`}}><Txt t={text}/></p>
const Para = ({text}) => <p style={{fontSize:14,lineHeight:1.75,color:m.txS,margin:'0 0 12px'}}><Txt t={text}/></p>
const H2 = ({text}) => <h3 style={{fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.1em',margin:'20px 0 10px',padding:0}}>{text}</h3>
const Divider = () => <div style={{height:1,background:m.bd,margin:'18px 0'}}/>
const Callout = ({color,text}) => {
  const c=D[color]||D.gray
  return <div style={{background:c.l,borderLeft:`2.5px solid ${c.m}`,borderRadius:'0 8px 8px 0',padding:'11px 15px',marginBottom:14}}>
    <p style={{fontSize:13.5,lineHeight:1.7,color:c.d,margin:0}}><Txt t={text}/></p>
  </div>
}
const Quote = ({text,author}) => <div style={{background:m.bgS,borderRadius:10,border:`1px solid ${m.bd}`,padding:'14px 18px',marginBottom:14}}>
  <p style={{fontSize:13.5,lineHeight:1.75,color:m.txS,fontStyle:'italic',margin:'0 0 8px'}}>&#34;{text}&#34;</p>
  {author&&<div style={{fontSize:11,color:m.txM,textAlign:'right'}}>&mdash; {author}</div>}
</div>
const Mechanic = ({title,icon,text,chain}) => <div style={{display:'flex',gap:12,marginBottom:14}}>
  <span style={{fontSize:13,width:18,flexShrink:0,color:m.txM,paddingTop:2}}>{icon||'◈'}</span>
  <div style={{flex:1}}>
    <div style={{fontSize:13,fontWeight:600,color:m.tx,marginBottom:3}}>{title}</div>
    <p style={{fontSize:13.5,lineHeight:1.65,color:m.txS,margin:0}}><Txt t={text}/></p>
    {chain&&<div style={{display:'flex',alignItems:'center',gap:4,flexWrap:'wrap',marginTop:9}}>
      {chain.map((s,i)=><span key={i} style={{display:'flex',alignItems:'center',gap:4}}>
        <span style={{fontSize:11,padding:'2px 9px',borderRadius:99,background:m.bgM,border:`1px solid ${m.bd}`,color:m.txS}}>{s}</span>
        {i<chain.length-1&&<span style={{fontSize:9,color:m.txH}}>&#8594;</span>}
      </span>)}
    </div>}
  </div>
</div>

const InfoRow = ({items}) => <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:7,marginBottom:14}}>
  {items.map((it,i)=><div key={i} style={{background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:8,padding:'9px 12px'}}>
    <div style={{fontSize:10,color:m.txM,marginBottom:4,textTransform:'uppercase',letterSpacing:'0.06em'}}>{it.label}</div>
    <div style={{fontSize:12,fontWeight:600,color:m.tx,lineHeight:1.3}}>{it.value}</div>
  </div>)}
</div>

function Cards({items,cols=3}){
  return <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:8,marginBottom:12}}>
    {items.map((it,i)=>{
      const tc=it.tagColor?D[it.tagColor]:null
      return <div key={i} style={{background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:10,padding:'12px 14px'}}>
        {it.icon&&<div style={{fontSize:16,marginBottom:6}}>{it.icon}</div>}
        <div style={{fontSize:13,fontWeight:600,color:m.tx,marginBottom:2}}>{it.name}</div>
        {it.sub&&<div style={{fontSize:11,color:m.txM,marginBottom:6}}>{it.sub}</div>}
        {it.tag&&tc&&<span style={{display:'inline-block',fontSize:10,padding:'1px 7px',borderRadius:99,marginBottom:6,background:tc.l,color:tc.d,border:`1px solid ${tc.b}`}}>{it.tag}</span>}
        <p style={{fontSize:13,lineHeight:1.55,color:m.txS,margin:0}}><Txt t={it.desc}/></p>
      </div>
    })}
  </div>
}

const SPRITES = {
  groudon:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/383.png',
  kyogre:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/382.png',
  rayquaza:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png',
  deoxys:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/386.png',
  regigigas:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/486.png',
  arceus:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/493.png',
}

function LegendaryGrid({items}){
  return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
    {items.map((it,i)=>{
      const c=D[it.color]||D.gray, img=SPRITES[it.imgKey]
      return <div key={i} style={{background:m.bgS,border:`1px solid ${m.bd}`,borderTop:`2.5px solid ${c.m}`,borderRadius:10,overflow:'hidden'}}>
        {img&&<div style={{background:c.l,padding:'16px 0 0',display:'flex',justifyContent:'center',alignItems:'flex-end',height:110}}>
          <img src={img} alt={it.name} style={{height:96,width:'auto',objectFit:'contain',filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.15))'}}/>
        </div>}
        <div style={{padding:'10px 14px 14px'}}>
          <div style={{fontSize:14,fontWeight:600,color:m.tx,marginBottom:1}}>{it.name}</div>
          <div style={{fontSize:11,color:m.txM,marginBottom:8}}>{it.sub}</div>
          <div style={{marginBottom:9}}>{it.types.map(([tc,tl],j)=><Tag key={j} color={tc} label={tl}/>)}</div>
          <p style={{fontSize:12.5,lineHeight:1.6,color:m.txS,margin:0}}><Txt t={it.text}/></p>
        </div>
      </div>
    })}
  </div>
}

function BiomeTable({items}){
  return <div style={{border:`1px solid ${m.bd}`,borderRadius:10,overflow:'hidden',marginBottom:14}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',background:m.bgM,borderBottom:`1px solid ${m.bd}`}}>
      {['Biome','M\u00e9t\u00e9o','Types Apex','Signal Apex'].map((h,i)=><div key={i} style={{padding:'7px 12px',fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.07em'}}>{h}</div>)}
    </div>
    {items.map((it,i)=>{
      const c=D[it.color]||D.gray
      return <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',borderBottom:i<items.length-1?`1px solid ${m.bd}`:'none',background:i%2===0?m.bg:m.bgS}}>
        <div style={{padding:'10px 12px'}}>
          <div style={{fontSize:12,fontWeight:600,color:m.tx,marginBottom:2}}>{it.biome}</div>
          <div style={{fontSize:10,color:m.txM}}>{it.zone}</div>
        </div>
        <div style={{padding:'10px 12px',display:'flex',alignItems:'center'}}>
          <span style={{fontSize:11,padding:'2px 8px',borderRadius:99,background:c.l,color:c.d,border:`1px solid ${c.b}`,fontWeight:500}}>{it.meteo}</span>
        </div>
        <div style={{padding:'10px 12px',display:'flex',alignItems:'center',gap:4,flexWrap:'wrap'}}>
          {it.types.map(([tc,tl],j)=><Tag key={j} color={tc} label={tl} sm/>)}
        </div>
        <div style={{padding:'10px 12px',fontSize:11,color:m.txS,display:'flex',alignItems:'center'}}>{it.signal}</div>
      </div>
    })}
  </div>
}

function HierarchieTable(){
  const rows=[
    {rang:'Sauvage',signal:'Aucun',entourage:'Meute d\'une esp\u00e8ce ou seul',combat:'Combat classique',capture:'Oui, directement',loot:'Objets courants',rc:'gray'},
    {rang:'Alpha',signal:'Yeux rouges',entourage:'Cong\u00e9n\u00e8res de m\u00eame famille',combat:'Horde famille \u2192 boss seul',capture:'Oui, difficile',loot:'Objets rares d\'esp\u00e8ce',rc:'coral'},
    {rang:'Apex',signal:'Marques blanches',entourage:'\u00c9quipe vari\u00e9e du biome',combat:'Raid 3 minions \u2192 boss seul',capture:'Non / Oui apr\u00e8s r\u00e9apparition',loot:'Mat\u00e9riaux exclusifs',rc:'amber'},
  ]
  const cols=['Rang','Signal visuel','Entourage','Format combat','Capturable','Loot notable']
  return <div style={{border:`1px solid ${m.bd}`,borderRadius:10,overflow:'hidden',marginBottom:14}}>
    <div style={{display:'grid',gridTemplateColumns:'80px 1fr 1fr 1fr 100px 1fr',background:m.bgM,borderBottom:`1px solid ${m.bd}`}}>
      {cols.map((h,i)=><div key={i} style={{padding:'7px 10px',fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.07em'}}>{h}</div>)}
    </div>
    {rows.map((r,i)=>{
      const c=D[r.rc]||D.gray
      return <div key={i} style={{display:'grid',gridTemplateColumns:'80px 1fr 1fr 1fr 100px 1fr',borderBottom:i<rows.length-1?`1px solid ${m.bd}`:'none',background:i%2===0?m.bg:m.bgS}}>
        <div style={{padding:'10px 10px',display:'flex',alignItems:'center'}}><span style={{fontSize:12,fontWeight:700,color:c.m}}>{r.rang}</span></div>
        <div style={{padding:'10px 10px',fontSize:12,color:m.txS,display:'flex',alignItems:'center'}}>{r.signal}</div>
        <div style={{padding:'10px 10px',fontSize:12,color:m.txS,display:'flex',alignItems:'center'}}>{r.entourage}</div>
        <div style={{padding:'10px 10px',fontSize:12,color:m.txS,display:'flex',alignItems:'center'}}>{r.combat}</div>
        <div style={{padding:'10px 10px',fontSize:12,color:m.txS,display:'flex',alignItems:'center'}}>{r.capture}</div>
        <div style={{padding:'10px 10px',fontSize:12,color:m.txS,display:'flex',alignItems:'center'}}>{r.loot}</div>
      </div>
    })}
  </div>
}

function StarterBlock({data}){
  const [tab,setTab] = useState('stats')
  const c=D[data.color]||D.gray
  return <div style={{border:`1px solid ${c.b}`,borderRadius:12,overflow:'hidden',marginBottom:22}}>
    <div style={{background:c.l,borderBottom:`1px solid ${c.b}`,padding:'14px 18px',display:'flex',alignItems:'center',gap:16}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:16,fontWeight:700,color:c.d,lineHeight:1.2}}>{data.name}</div>
        <div style={{fontSize:11,color:c.m,fontStyle:'italic',marginTop:2,marginBottom:7}}>{data.quote}</div>
        <div>{data.types.map(([tc,tl],i)=><Tag key={i} color={tc} label={tl}/>)}</div>
      </div>
      <div style={{textAlign:'right',flexShrink:0}}>
        <div style={{fontSize:10,color:c.m,textTransform:'uppercase',letterSpacing:'0.06em'}}>BST</div>
        <div style={{fontSize:22,fontWeight:700,color:c.d}}>{data.totalBST}</div>
      </div>
    </div>
    <div style={{padding:'11px 18px',borderBottom:`1px solid ${m.bd}`,background:m.bg}}>
      <p style={{fontSize:13.5,lineHeight:1.65,color:m.txS,margin:0}}><Txt t={data.desc}/></p>
    </div>
    <div style={{display:'flex',background:m.bgS,borderBottom:`1px solid ${m.bd}`}}>
      {['stats','capacit\u00e9','talent'].map(t=><button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:'8px 0',fontSize:11.5,fontWeight:tab===t?600:400,color:tab===t?c.d:m.txM,background:tab===t?m.bg:'transparent',border:'none',borderBottom:tab===t?`2px solid ${c.m}`:'2px solid transparent',cursor:'pointer',textTransform:'capitalize'}}>{t}</button>)}
    </div>
    <div style={{padding:'14px 18px',background:m.bg}}>
      {tab==='stats'&&Object.entries(data.stats).map(([k,v])=><StatBar key={k} label={k} value={v}/>)}
      {tab==='capacit\u00e9'&&<div>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:9,gap:8,flexWrap:'wrap'}}>
          <div style={{fontSize:13,fontWeight:600,color:m.tx}}>Signature : {data.signature.name}</div>
          <div style={{display:'flex',gap:4}}>
            {[`${data.signature.pwr} pwr`,`${data.signature.acc}%`,`${data.signature.pp} PP`].map((x,i)=><span key={i} style={{fontSize:10,padding:'2px 7px',borderRadius:99,background:m.bgM,border:`1px solid ${m.bd}`,color:m.txS}}>{x}</span>)}
          </div>
        </div>
        <p style={{fontSize:13.5,lineHeight:1.6,color:m.txS,marginBottom:12}}>{data.signature.desc}</p>
        <div style={{fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:9}}>Autres capacit\u00e9s</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
          {data.moves.map((mv,i)=>{
            const mc=D[mv.type]||D.gray
            return <div key={i} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 10px',background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:8}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:mc.l,border:`1.5px solid ${mc.b}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <div style={{width:10,height:10,borderRadius:'50%',background:mc.m}}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,color:m.tx,marginBottom:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{mv.name}</div>
                <div style={{display:'flex',gap:6,fontSize:10,color:m.txM}}>
                  <span>{mv.pwr!=null?mv.pwr:'\u2014'}</span><span style={{color:m.txH}}>\u00b7</span>
                  <span>{mv.acc!=null?`${mv.acc}%`:'\u2014%'}</span><span style={{color:m.txH}}>\u00b7</span>
                  <span>{mv.pp} PP</span>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>}
      {tab==='talent'&&<div>
        <div style={{fontSize:13,fontWeight:600,color:m.tx,marginBottom:5}}>Talent cach\u00e9 : {data.talent.name}</div>
        <p style={{fontSize:13.5,lineHeight:1.6,color:m.txS,margin:0}}>{data.talent.desc}</p>
      </div>}
    </div>
  </div>
}

function StarterChoice({items}){
  return <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:12}}>
    {items.map((it,i)=>{
      const c=D[it.color]||D.gray
      return <div key={i} style={{border:`1px solid ${c.b}`,borderTop:`2.5px solid ${c.m}`,borderRadius:10,padding:'12px 13px',background:c.l}}>
        <div style={{fontSize:13,fontWeight:600,color:c.d,marginBottom:1}}>{it.name}</div>
        <div style={{fontSize:10,color:c.m,marginBottom:8}}>{it.evolution}</div>
        <div style={{marginBottom:6}}>{it.types.map(([tc,tl],j)=><Tag key={j} color={tc} label={tl} sm/>)}</div>
        <p style={{fontSize:11.5,lineHeight:1.5,color:c.d,margin:0,opacity:.85}}>{it.desc}</p>
      </div>
    })}
  </div>
}

function Avatar({imgUrl, initials, color, size=72}){
  const c=D[color]||D.gray
  const [err,setErr] = useState(false)
  if(imgUrl && !err) return <img src={imgUrl} alt={initials} onError={()=>setErr(true)} style={{width:size,height:size,borderRadius:'50%',objectFit:'cover',objectPosition:'top center',border:`2px solid ${c.b}`,flexShrink:0}}/>
  return <div style={{width:size,height:size,borderRadius:'50%',background:c.l,border:`2px solid ${c.b}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:Math.round(size*0.3),fontWeight:700,color:c.d,flexShrink:0}}>{initials}</div>
}

function PersonCard({person}){
  const c=D[person.color]||D.gray
  return <div style={{border:`1px solid ${m.bd}`,borderRadius:12,overflow:'hidden',marginBottom:18}}>
    <div style={{background:c.l,borderBottom:`1px solid ${c.b}`,padding:'18px 20px',display:'flex',gap:16,alignItems:'flex-start'}}>
      <Avatar imgUrl={person.imgUrl} initials={person.initials} color={person.color} size={80}/>
      <div style={{flex:1}}>
        <div style={{fontSize:16,fontWeight:700,color:c.d}}>{person.name}</div>
        <div style={{fontSize:11,color:c.m,marginTop:2,marginBottom:8}}>{person.role}</div>
        {person.type&&<Tag color={person.color} label={person.type}/>}
      </div>
    </div>
    <div style={{padding:'14px 20px',background:m.bg}}>
      <p style={{fontSize:13.5,lineHeight:1.7,color:m.txS,margin:0}}><Txt t={person.desc}/></p>
      {person.arc&&<div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${m.bd}`}}>
        <div style={{fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Arc narratif</div>
        <p style={{fontSize:13,lineHeight:1.6,color:m.txS,margin:0}}>{person.arc}</p>
        {person.trigger&&<div style={{marginTop:8,fontSize:11,color:c.m,display:'flex',gap:5,alignItems:'center'}}><span style={{fontSize:9}}>&#9670;</span>{person.trigger}</div>}
      </div>}
    </div>
  </div>
}

function ExpediteurCard({e}){
  const [open, setOpen] = useState(false)
  const c=D[e.color]||D.gray
  const initials = e.name.split(' ').map(w=>w[0]).join('').slice(0,2)
  return <div style={{border:`1px solid ${m.bd}`,borderRadius:12,overflow:'hidden',marginBottom:14}}>
    <button onClick={()=>setOpen(o=>!o)} style={{width:'100%',background:open?c.l:m.bgS,border:'none',borderBottom:open?`1px solid ${c.b}`:'none',padding:'14px 18px',display:'flex',alignItems:'center',gap:14,cursor:'pointer',textAlign:'left',transition:'background 0.15s'}}>
      <Avatar imgUrl={e.imgUrl} initials={initials} color={e.color} size={52}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginBottom:3}}>
          <span style={{fontSize:15,fontWeight:700,color:open?c.d:m.tx}}>{e.name}</span>
          <span style={{fontSize:10,color:m.txM}}>{e.num} \u00e9clat{e.num==='\u00d72'?'s':''}</span>
        </div>
        <div style={{fontSize:11,color:open?c.m:m.txM}}>{e.role}</div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
        {e.type&&<Tag color={e.color} label={e.type} sm/>}
        <span style={{fontSize:10,padding:'2px 8px',borderRadius:99,background:e.status==='secure'?D.green.l:D.amber.l,color:e.status==='secure'?D.green.d:D.amber.d,border:`1px solid ${e.status==='secure'?D.green.b:D.amber.b}`}}>
          {e.status==='secure'?'S\u00e9curis\u00e9':'\u00c0 r\u00e9cup\u00e9rer'}
        </span>
        <span style={{fontSize:12,color:m.txM,width:16,textAlign:'center'}}>{open?'\u2191':'\u2193'}</span>
      </div>
    </button>
    {open&&<div style={{display:'grid',gridTemplateColumns:'200px 1fr',background:m.bg}}>
      <div style={{borderRight:`1px solid ${m.bd}`,display:'flex',flexDirection:'column',alignItems:'center',padding:'20px 16px',background:c.l,gap:10}}>
        <Avatar imgUrl={e.imgUrl} initials={initials} color={e.color} size={140}/>
        {e.type&&<div style={{marginTop:4}}><Tag color={e.color} label={e.type}/></div>}
        <div style={{fontSize:10,color:c.m,textAlign:'center',lineHeight:1.5,marginTop:4}}>{e.role}</div>
      </div>
      <div style={{padding:'18px 20px',display:'flex',flexDirection:'column',gap:0}}>
        {e.desc&&<>
          <div style={{fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:7}}>Profil</div>
          <p style={{fontSize:13.5,lineHeight:1.7,color:m.txS,margin:'0 0 16px'}}>{e.desc}</p>
        </>}
        {e.objective&&<>
          <div style={{fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:7}}>Objectif</div>
          <p style={{fontSize:13,lineHeight:1.6,color:m.txS,margin:'0 0 16px',paddingLeft:10,borderLeft:`2px solid ${c.b}`}}>{e.objective}</p>
        </>}
        {e.arc&&<>
          <div style={{height:1,background:m.bd,margin:'0 0 16px'}}/>
          <div style={{fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:7}}>Arc narratif</div>
          <p style={{fontSize:13,lineHeight:1.65,color:m.txS,margin:'0 0 10px'}}>{e.arc}</p>
        </>}
        {e.trigger&&<div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:c.m,marginTop:2}}>
          <span style={{fontSize:9}}>&#9670;</span>
          <span style={{fontStyle:'italic'}}>{e.trigger}</span>
        </div>}
      </div>
    </div>}
  </div>
}

function EclatTable({expediteurs}){
  const secure=expediteurs.filter(e=>e.status==='secure')
  const recover=expediteurs.filter(e=>e.status==='recover')
  return <div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:20}}>
      {[{label:'\u00c9clats s\u00e9curis\u00e9s',value:'4',c:'green'},{label:'\u00c0 r\u00e9cup\u00e9rer',value:'8',c:'amber'}].map((it,i)=><div key={i} style={{background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:8,padding:'9px 13px'}}>
        <div style={{fontSize:10,color:m.txM,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:3}}>{it.label}</div>
        <div style={{fontSize:24,fontWeight:700,color:D[it.c].m}}>{it.value}</div>
      </div>)}
    </div>
    <div style={{fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>S\u00e9curis\u00e9s au d\u00e9part</div>
    {secure.map((e,i)=><ExpediteurCard key={i} e={e}/>)}
    <div style={{height:10}}/>
    <div style={{fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>\u00c0 r\u00e9cup\u00e9rer dans la Pang\u00e9e</div>
    {recover.map((e,i)=><ExpediteurCard key={i} e={e}/>)}
  </div>
}

function ConnTable({items}){
  return <div style={{border:`1px solid ${m.bd}`,borderRadius:10,overflow:'hidden',marginBottom:12}}>
    {items.map((it,i)=><div key={i} style={{display:'flex',borderBottom:i<items.length-1?`1px solid ${m.bd}`:'none'}}>
      <div style={{width:130,flexShrink:0,padding:'9px 13px',borderRight:`1px solid ${m.bd}`,background:m.bgS}}>
        <div style={{fontSize:12,fontWeight:600,color:m.tx}}>{it.label}</div>
        <div style={{fontSize:10,color:m.txM,marginTop:1}}>{it.origin}</div>
      </div>
      <div style={{flex:1,padding:'9px 13px',background:m.bg}}>
        <p style={{fontSize:13,lineHeight:1.5,color:m.txS,margin:0}}>{it.desc}</p>
      </div>
    </div>)}
  </div>
}

function TypeGrid({items}){
  return <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:12}}>
    {items.map((it,i)=><div key={i} style={{background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:8,padding:'8px 10px',textAlign:'center'}}>
      <div style={{fontSize:12,fontWeight:600,color:m.tx,marginBottom:5}}>{it.name}</div>
      <Tag color={it.color} label={it.type} sm/>
    </div>)}
  </div>
}

function renderBlock(block, i, data){
  switch(block.type){
    case 'lead': return <Lead key={i} text={block.text}/>
    case 'para': return <Para key={i} text={block.text}/>
    case 'h2': return <H2 key={i} text={block.text}/>
    case 'divider': return <Divider key={i}/>
    case 'callout': return <Callout key={i} color={block.color} text={block.text}/>
    case 'mechanic': return <Mechanic key={i} title={block.title} icon={block.icon} text={block.text} chain={block.chain}/>
    case 'info-row': return <InfoRow key={i} items={block.items}/>
    case 'cards3': return <Cards key={i} items={block.items} cols={3}/>
    case 'cards2': return <Cards key={i} items={block.items} cols={2}/>
    case 'cards4': return <Cards key={i} items={block.items} cols={2}/>
    case 'legendary-grid': return <LegendaryGrid key={i} items={block.items}/>
    case 'starter-block': return <StarterBlock key={i} data={block.data}/>
    case 'starter-choice': return <StarterChoice key={i} items={block.items}/>
    case 'persons-grid': return <div key={i}>{block.items.map((p,j)=><PersonCard key={j} person={p}/>)}</div>
    case 'quote': return <Quote key={i} text={block.text} author={block.author}/>
    case 'eclat-table': return <EclatTable key={i} expediteurs={data.expediteurs}/>
    case 'conn-table': return <ConnTable key={i} items={block.items}/>
    case 'type-grid': return <TypeGrid key={i} items={block.items}/>
    case 'biome-table': return <BiomeTable key={i} items={block.items}/>
    case 'hierarchie-table': return <HierarchieTable key={i}/>
    default: return null
  }
}

function App(){
  const [data, setData] = useState(null)
  const [sectionId, setSectionId] = useState('monde')
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const mainRef = useRef(null)

  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<640)
    check(); window.addEventListener('resize',check)
    return ()=>window.removeEventListener('resize',check)
  },[])

  useEffect(()=>{
    async function load(){
      try{
        const r=await window.storage.get('pangea-enc-v14')
        setData(r&&r.value?JSON.parse(r.value):DEFAULT_DATA)
      }catch{ setData(DEFAULT_DATA) }
      setLoading(false)
    }
    load()
  },[])

  useEffect(()=>{ if(mainRef.current) mainRef.current.scrollTop=0 },[sectionId])

  if(loading) return <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:m.bg}}><div style={{fontSize:13,color:m.txM}}>Chargement\u2026</div></div>

  const groups=[...new Set(data.sections.map(s=>s.group))]
  const section=data.sections.find(s=>s.id===sectionId)||data.sections[0]
  const sc=D[section.badgeColor]||D.gray
  const sk=D[section.color]||D.gray
  const idx=data.sections.findIndex(s=>s.id===sectionId)
  const prev=data.sections[idx-1], next=data.sections[idx+1]

  const Nav=()=><nav style={{flex:1,overflowY:'auto',padding:'6px 0'}}>
    {groups.map(g=><div key={g}>
      <div style={{padding:'10px 14px 3px',fontSize:9.5,fontWeight:700,color:m.txM,textTransform:'uppercase',letterSpacing:'0.1em'}}>{g}</div>
      {data.sections.filter(s=>s.group===g).map(s=>{
        const sc2=D[s.color]||D.gray, active=s.id===sectionId
        return <button key={s.id} onClick={()=>{setSectionId(s.id);setMenuOpen(false)}} style={{width:'100%',display:'flex',alignItems:'center',gap:9,padding:'7px 14px',background:active?m.bg:'transparent',border:'none',borderLeft:active?`3px solid ${sc2.m}`:'3px solid transparent',cursor:'pointer',textAlign:'left'}}>
          <div style={{width:5,height:5,borderRadius:'50%',flexShrink:0,background:active?sc2.m:m.bdM}}/>
          <span style={{fontSize:12.5,color:active?m.tx:m.txS,fontWeight:active?600:400,lineHeight:1.3}}>{s.label}</span>
        </button>
      })}
    </div>)}
  </nav>

  const Content=()=><>
    {section.content.map((b,i)=>renderBlock(b,i,data))}
    <div style={{marginTop:28,paddingTop:14,borderTop:`1px solid ${m.bd}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      {prev?<button onClick={()=>setSectionId(prev.id)} style={{display:'flex',alignItems:'center',gap:6,background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:8,cursor:'pointer',color:m.txS,fontSize:12,padding:'7px 12px'}}>&#8592; {prev.label}</button>:<div/>}
      {next?<button onClick={()=>setSectionId(next.id)} style={{display:'flex',alignItems:'center',gap:6,background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:8,cursor:'pointer',color:m.txS,fontSize:12,padding:'7px 12px'}}>{next.label} &#8594;</button>:<div/>}
    </div>
  </>

  if(isMobile) return <div style={{position:'fixed',inset:0,display:'flex',flexDirection:'column',fontFamily:'system-ui,-apple-system,sans-serif',color:m.tx,background:m.bg}}>
    {menuOpen&&<div style={{position:'absolute',inset:0,zIndex:200}} onClick={()=>setMenuOpen(false)}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.3)'}}/>
      <div style={{position:'absolute',top:0,left:0,bottom:0,width:'80%',maxWidth:280,background:m.bg,borderRight:`1px solid ${m.bd}`,display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:'14px 16px 10px',borderBottom:`1px solid ${m.bd}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:m.tx}}>Pok\u00e9mon Legends \u00b7 Pang\u00e9e</div>
            <div style={{fontSize:10,color:m.txM,marginTop:1}}>Encyclop\u00e9die de conception</div>
          </div>
          <button onClick={()=>setMenuOpen(false)} style={{background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:6,fontSize:13,cursor:'pointer',color:m.txS,padding:'3px 8px',lineHeight:1.4}}>&#10005;</button>
        </div>
        <Nav/>
      </div>
    </div>}
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderBottom:`1px solid ${m.bd}`,background:m.bgS,flexShrink:0}}>
      <button onClick={()=>setMenuOpen(true)} style={{background:m.bg,border:`1px solid ${m.bd}`,borderRadius:7,padding:'6px 10px',cursor:'pointer',fontSize:15,lineHeight:1,color:m.tx,flexShrink:0}}>&#9776;</button>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:12,fontWeight:600,color:m.tx,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{section.title}</div>
        <div style={{fontSize:10,color:m.txM}}>{section.group} \u00b7 {section.label}</div>
      </div>
      <span style={{fontSize:10,padding:'2px 8px',borderRadius:99,background:sc.l,color:sc.d,border:`1px solid ${sc.b}`,fontWeight:600,flexShrink:0}}>{section.badge}</span>
    </div>
    {section.summary&&<div style={{padding:'9px 14px',background:sk.l,borderBottom:`1px solid ${sk.b}`,flexShrink:0}}>
      <p style={{fontSize:12,color:sk.d,margin:0,lineHeight:1.5}}>{section.summary}</p>
    </div>}
    <div ref={mainRef} style={{flex:1,overflowY:'auto',padding:'16px 14px 24px'}}><Content/></div>
    <div style={{padding:'10px 14px',borderTop:`1px solid ${m.bd}`,background:m.bgS,flexShrink:0}}>
      <div style={{fontSize:10,color:m.txM,textAlign:'center'}}>{data.meta.version} \u00b7 {data.meta.lastUpdated}</div>
    </div>
  </div>

  return <div style={{position:'fixed',inset:0,display:'flex',fontFamily:'system-ui,-apple-system,sans-serif',color:m.tx,background:m.bg}}>
    <div style={{width:200,flexShrink:0,borderRight:`1px solid ${m.bd}`,background:m.bgS,display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{padding:'16px 14px 12px',borderBottom:`1px solid ${m.bd}`,flexShrink:0}}>
        <div style={{fontSize:12,fontWeight:700,color:m.tx,lineHeight:1.3}}>Pok\u00e9mon Legends</div>
        <div style={{fontSize:10,color:m.txM,marginTop:2}}>Pang\u00e9e \u00b7 Encyclop\u00e9die</div>
      </div>
      <Nav/>
      <div style={{padding:'10px 10px 14px',borderTop:`1px solid ${m.bd}`,flexShrink:0}}>
        <span style={{fontSize:9.5,color:m.txM}}>{data.meta.version} \u00b7 {data.meta.lastUpdated}</span>
      </div>
    </div>
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minWidth:0,height:'100%'}}>
      <div style={{padding:'0 24px',height:40,display:'flex',alignItems:'center',gap:6,borderBottom:`1px solid ${m.bd}`,background:m.bgS,flexShrink:0}}>
        <span style={{fontSize:11,color:m.txM}}>{section.group}</span>
        <span style={{fontSize:11,color:m.txH}}>/</span>
        <span style={{fontSize:11,color:m.txS,fontWeight:600}}>{section.label}</span>
        <div style={{flex:1}}/>
        <span style={{fontSize:10.5,padding:'2px 9px',borderRadius:99,background:sc.l,color:sc.d,border:`1px solid ${sc.b}`,fontWeight:600}}>{section.badge}</span>
      </div>
      <div style={{padding:'16px 28px 14px',borderBottom:`1px solid ${m.bd}`,background:m.bg,flexShrink:0}}>
        <h1 style={{fontSize:22,fontWeight:700,color:m.tx,margin:'0 0 4px',lineHeight:1.2}}>{section.title}</h1>
        <p style={{fontSize:11.5,color:m.txM,margin:'0 0 10px'}}>{section.meta}</p>
        {section.summary&&<p style={{fontSize:13,color:m.txS,margin:0,paddingTop:9,borderTop:`1px solid ${m.bd}`,lineHeight:1.55}}>{section.summary}</p>}
      </div>
      <main ref={mainRef} style={{flex:1,overflowY:'auto',padding:'20px 28px 40px',background:m.bg}}><Content/></main>
    </div>
  </div>
}

const BASE = 'https://raw.githubusercontent.com/R1ck021/pangea-encyclopedia/main/public'

const DEFAULT_DATA = {
  meta:{title:"Pok\u00e9mon Legends : Pang\u00e9e",subtitle:"Encyclop\u00e9die de conception",version:"v4.0",lastUpdated:"2026-05-16"},
  sections:[
    {id:"monde",label:"La R\u00e9gion",group:"Univers",color:"amber",badge:"Cadre temporel",badgeColor:"amber",title:"Pang\u00e9e & Panthalassa",meta:"Plusieurs centaines de millions d'ann\u00e9es avant notre \u00e8re",summary:"Le continent unique et l'oc\u00e9an primordial \u2014 cadre g\u00e9ographique et temporel du jeu.",content:[
      {type:"lead",text:"Il y a des centaines de millions d'ann\u00e9es, existait **un seul continent** et **un seul oc\u00e9an**. La Pang\u00e9e \u2014 terre primordiale brute et hostile \u2014 et Panthalassa, l'oc\u00e9an infini qui l'enveloppait de toutes parts."},
      {type:"para",text:"Ce n'\u00e9tait pas un monde accueillant. Les volcans redessinaient les c\u00f4tes jour apr\u00e8s jour. Les temp\u00eates de Panthalassa duraient des ann\u00e9es enti\u00e8res. La fronti\u00e8re entre la terre et la mer n'\u00e9tait pas une ligne \u2014 c'\u00e9tait une *zone de tension permanente entre deux forces qui refusaient de coexister*."},
      {type:"para",text:"C'est dans ce chaos que la vie a trouv\u00e9 son chemin. Et c'est dans ce chaos qu'une chose venue de beaucoup plus loin que la mer ou la montagne s'est \u00e9cras\u00e9e sur la plan\u00e8te pour la premi\u00e8re fois."},
      {type:"divider"},
      {type:"h2",text:"Caract\u00e9ristiques du monde"},
      {type:"cards3",items:[{name:"Pang\u00e9e",icon:"\ud83c\udf0b",sub:"Le continent unique",desc:"Terre brute, volcanique, en formation permanente. Chaque \u00e9ruption redessine ses contours. Groudon en est l'\u00e2me consciente."},{name:"Panthalassa",icon:"\ud83c\udf0a",sub:"L'oc\u00e9an infini",desc:"Vaste et insondable. Ses abysses abritent des formes de vie que la lumi\u00e8re n'a jamais atteintes. Kyogre en est l'expression vivante."},{name:"Stratosph\u00e8re",icon:"\u26a1",sub:"L'espace entre les deux",desc:"Territoire de Rayquaza, arbitre des deux forces. Il est le premier \u00e0 d\u00e9tecter les anomalies venues du cosmos."}]},
      {type:"divider"},
      {type:"h2",text:"La tension fondamentale"},
      {type:"callout",color:"amber",text:"L'opposition entre Groudon et Kyogre n'est pas une guerre. C'est une tension fondamentale qui *d\u00e9finit la plan\u00e8te*. Depuis des \u00e9ons, un \u00e9quilibre pr\u00e9caire \u2014 hostile mais stable \u2014 maintient la vie possible. Le jeu commence au moment o\u00f9 cet \u00e9quilibre est rompu par l'arriv\u00e9e de Deoxys."}
    ]},
    {id:"biomes",label:"Les Biomes",group:"Univers",color:"teal",badge:"Exploration",badgeColor:"teal",title:"Les Biomes de la Pang\u00e9e",meta:"Cinq zones climatiques \u00b7 M\u00e9t\u00e9os distinctes \u00b7 Pok\u00e9mon Apex",summary:"La Pang\u00e9e est d\u00e9coup\u00e9e en biomes radicalement diff\u00e9rents, chacun gouvern\u00e9 par une m\u00e9t\u00e9o permanente et structur\u00e9 autour d'un Pok\u00e9mon Apex exclusif.",content:[
      {type:"lead",text:"La Pang\u00e9e n'est pas un monde uniforme. Sous la tension permanente entre Groudon et Kyogre, cinq zones climatiques majeures se sont form\u00e9es \u2014 chacune avec ses propres conditions m\u00e9t\u00e9orologiques, sa faune, et au sommet de sa cha\u00eene alimentaire, un **Pok\u00e9mon Apex** qui en structure l'\u00e9quilibre."},
      {type:"callout",color:"teal",text:"La m\u00e9t\u00e9o de chaque biome est *permanente et active* \u2014 elle affecte directement le gameplay, les capacit\u00e9s des Pok\u00e9mon et la difficult\u00e9 des rencontres. Les Formes Primo de Groudon et Kyogre, ainsi que M\u00e9ga-Rayquaza, peuvent temporairement **\u00e9craser** ces m\u00e9t\u00e9os locales avec leurs talents Terre Finale, Mer Primaire et Souffle Delta."},
      {type:"divider"},
      {type:"h2",text:"Tableau des biomes"},
      {type:"biome-table",items:[
        {biome:"Zone Volcanique",zone:"C\u0153ur de la Pang\u00e9e",meteo:"\u2600\ufe0f Z\u00e9nith",types:[["coral","Feu"],["green","Plante"]],signal:"Chaleur irradiante, sol fissu\u00e9",color:"coral"},
        {biome:"Zone C\u00f4ti\u00e8re",zone:"Fronti\u00e8re Panthalassa",meteo:"\ud83c\udf27\ufe0f Pluie battante",types:[["blue","Eau"],["gray","Vol"]],signal:"Temp\u00eates permanentes, embruns",color:"blue"},
        {biome:"Zone Aride",zone:"Int\u00e9rieur continental",meteo:"\ud83c\udf2a\ufe0f Temp\u00eate de sable",types:[["gray","Roche"],["amber","Sol"]],signal:"Cendres en suspension, visibilit\u00e9 r\u00e9duite",color:"amber"},
        {biome:"Zone Glaciaire",zone:"Hauts plateaux d'altitude",meteo:"\u2744\ufe0f Gr\u00eale",types:[["ice","Glace"],["purple","Spectre"]],signal:"Brume givr\u00e9e, silence total",color:"ice"},
        {biome:"Zone Cosmique",zone:"Site d'impact de la m\u00e9t\u00e9orite",meteo:"\u2b50 Radiations X",types:[["purple","Cosmique"],["purple","Psy"]],signal:"Aurores au sol, perturbations \u00e9lectromagn\u00e9tiques",color:"purple"}
      ]},
      {type:"divider"},
      {type:"h2",text:"La Zone Cosmique \u2014 cas particulier"},
      {type:"para",text:"La Zone Cosmique n'est pas accessible d\u00e8s le d\u00e9but du jeu. Elle se r\u00e9v\u00e8le progressivement \u00e0 mesure que le joueur suit les traces de Deoxys \u00e0 travers les autres biomes. Sa m\u00e9t\u00e9o \u2014 les *Radiations X* \u2014 est une nouveaut\u00e9 exclusive \u00e0 ce jeu : une \u00e9nergie cosmique concentr\u00e9e, r\u00e9sidu direct de l'impact de la m\u00e9t\u00e9orite, encore non diss\u00e9min\u00e9e dans les strates g\u00e9ologiques."},
      {type:"mechanic",title:"Radiations X \u2014 m\u00e9t\u00e9o exclusive",icon:"\u2b50",text:"Les Radiations X ne ressemblent \u00e0 aucune m\u00e9t\u00e9o connue dans le monde Pok\u00e9mon moderne. Elles affectent prioritairement les capacit\u00e9s de type Cosmique et Psy. Les Pok\u00e9mon qui y vivent ont absorb\u00e9 l'\u00e9nergie X directement \u2014 leur biologie porte la trace visible de cette exposition. C'est la seule zone du jeu o\u00f9 le type Cosmique existe \u00e0 l'\u00e9tat naturel."},
      {type:"callout",color:"purple",text:"Les Pok\u00e9mon de la Zone Cosmique sont les seuls anc\u00eatres directs des porteurs du Marqueur X. En les observant, Wollemi voit pour la premi\u00e8re fois, de ses propres yeux, la bifurcation \u00e9volutive qu'il a pass\u00e9 vingt ans \u00e0 reconstituer depuis un laboratoire."}
    ]},
    {id:"cosmogonie",label:"L\u00e9gendaires & Fabuleux",group:"Univers",color:"coral",badge:"L\u00e9gendaires",badgeColor:"coral",title:"L\u00e9gendaires & Fabuleux",meta:"L\u00e9gendaires fondateurs \u00b7 Le cycle \u00e9ternel et ce qui le brise",summary:"Groudon, Kyogre, Rayquaza, Deoxys, Arceus, Regigigas \u2014 les six entit\u00e9s qui d\u00e9finissent et transforment le monde primordial.",content:[
      {type:"lead",text:"Six entit\u00e9s structurent l'\u00e9quilibre du monde. Trois sont n\u00e9es de la plan\u00e8te. Une vient du vide interstellaire. Une observe de partout et de nulle part. Une a \u00e9t\u00e9 agglom\u00e9r\u00e9e par une intention trop grande pour rester sans forme."},
      {type:"h2",text:"Le cycle \u00e9ternel \u2014 Groudon, Kyogre, Rayquaza"},
      {type:"legendary-grid",items:[
        {name:"Groudon",imgKey:"groudon",sub:"L'\u00c2me de la Pang\u00e9e",types:[["coral","Feu"],["amber","Sol"]],color:"coral",text:"Groudon n'est pas n\u00e9 de la Pang\u00e9e. Il **est** la Pang\u00e9e. Dans sa Forme Primo, ses flancs sont couverts de fissures de lave, ses yeux comme deux crat\u00e8res actifs. Il ne se d\u00e9place pas : il est le sol lui-m\u00eame qui se soul\u00e8ve. C'est un **b\u00e2tisseur inconscient** \u2014 il cr\u00e9e la terre non par intention, mais parce que c'est sa nature. Son talent Terre Finale impose un Soleil Intense absolu qui \u00e9crase toutes les m\u00e9t\u00e9os locales."},
        {name:"Kyogre",imgKey:"kyogre",sub:"L'\u00c2me de Panthalassa",types:[["blue","Eau"]],color:"blue",text:"Kyogre est Panthalassa. Ses mouvements sont les courants oc\u00e9aniques, ses humeurs sont les temp\u00eates. Dans sa Forme Primo, ses motifs lumineux projettent des aurores sous-marines visibles depuis les c\u00f4tes la nuit. Il ne cherche pas \u00e0 d\u00e9truire la terre \u2014 il cherche \u00e0 *l'engloutir par nature*. Son talent Mer Primaire impose une Pluie Battante absolue qui \u00e9crase toutes les m\u00e9t\u00e9os locales."},
        {name:"Mega Rayquaza",imgKey:"rayquaza",sub:"L'Arbitre des Cieux",types:[["green","Dragon"],["gray","Vol"]],color:"green",text:"Rayquaza vit dans la stratosph\u00e8re. Il appartient \u00e0 *l'espace entre les deux* \u2014 ni Groudon ni Kyogre. \u00c0 cette \u00e9poque, il est en forme M\u00e9ga permanente. Son combat avec la m\u00e9t\u00e9orite a cr\u00e9\u00e9 son **mikado organ**. Pour la premi\u00e8re fois, l'arbitre est lui-m\u00eame modifi\u00e9 par ce qu'il arbitre. Il n'est plus neutre. Son talent Souffle Delta *supprime toutes les m\u00e9t\u00e9os* \u2014 y compris celles des biomes et des Formes Primo."},
        {name:"Deoxys \u2b50",imgKey:"deoxys",sub:"L'Intrus Cosmique \u2014 L\u00e9gendaire central",types:[["purple","Cosmique"]],color:"purple",text:"Virus interstellaire projet\u00e9 vers la plan\u00e8te par un \u00e9v\u00e9nement inconnu. Il combat Rayquaza dans la stratosph\u00e8re, survit mutant, et s'\u00e9crase sur la Pang\u00e9e. Ses quatre formes sont des \u00e9tats d'adaptation \u00e0 un monde qu'il ne comprend pas encore. Il n'est pas mauvais \u2014 il est *radicalement \u00e9tranger* \u00e0 tout ce qui existe ici. \u00c0 l'\u00e9poque moderne, il ne conserve que le type Psy \u2014 le type Cosmique ayant disparu avec le Syndrome X."}
      ]},
      {type:"callout",color:"coral",text:"Depuis des \u00e9ons, le m\u00eame sch\u00e9ma se r\u00e9p\u00e8te : la tension monte entre Groudon et Kyogre, le conflit \u00e9clate en Formes Primo, Rayquaza descend et arbitre, l'\u00e9quilibre revient. Arceus le sait. Il le tol\u00e8re. Il lui fait confiance. **Ce syst\u00e8me est brutal mais stable \u2014 il a toujours suffi.**"},
      {type:"mechanic",title:"Ce que Deoxys change",icon:"\u2b50",text:"L'arriv\u00e9e de Deoxys introduit trois variables simultan\u00e9es qu'aucun cycle pr\u00e9c\u00e9dent n'a connues : **Rayquaza est lui-m\u00eame alt\u00e9r\u00e9** par l'\u00e9nergie X. **L'\u00e9nergie X introduit une fr\u00e9quence** que le syst\u00e8me plan\u00e9taire ne peut pas absorber. **La vie sur la plan\u00e8te est d\u00e9sormais expos\u00e9e** \u00e0 une accumulation d'\u00e9nergie potentiellement irr\u00e9versible.",chain:["Tension habituelle","Conflit Formes Primo","Rayquaza arbitre","\u2192 Mais cette fois : impossible"]},
      {type:"divider"},
      {type:"h2",text:"Arceus \u2014 Le regard qui d\u00e9clenche"},
      {type:"legendary-grid",items:[
        {name:"Arceus",imgKey:"arceus",sub:"Pr\u00e9sence causale invisible \u2014 n'appara\u00eet jamais directement",types:[["gray","Normal"]],color:"amber",text:"Arceus n'appara\u00eet jamais directement dans les \u00e9v\u00e9nements du jeu. Il est une **pr\u00e9sence d\u00e9duite, pas observ\u00e9e**. Depuis des \u00e9ons, il fait confiance au cycle. Deoxys ne d\u00e9clenche pas son intervention parce qu'il est une menace imm\u00e9diate \u2014 mais parce que trois variables se cumulent pour la premi\u00e8re fois et rendent tout cycle futur potentiellement irr\u00e9versible. Sa r\u00e9ponse : *une mise \u00e0 jour du syst\u00e8me*."},
        {name:"Regigigas",imgKey:"regigigas",sub:"Le Golem Cosmique \u2014 R\u00e9ponse plan\u00e9taire",types:[["gray","Normal"]],color:"gray",text:"Regigigas n'a pas de cr\u00e9ateur au sens strict. Il a une **cause** (la volont\u00e9 d'Arceus) et un **mat\u00e9riau** (la Pang\u00e9e elle-m\u00eame). Pas sculpt\u00e9, pas con\u00e7u \u2014 **agglom\u00e9r\u00e9** par une intention trop grande pour rester sans forme. Sa mission : briser la Pang\u00e9e, tirer les masses continentales, disperser les \u00c9clats X dans des strates g\u00e9ologiques distinctes. Puis il entre en dormance \u2014 l\u00e0 o\u00f9 la Pang\u00e9e \u00e9tait la plus dense, ce qui deviendra Sinnoh."}
      ]},
      {type:"divider"},
      {type:"h2",text:"Les quatre formes de Deoxys"},
      {type:"cards4",items:[{name:"Normale",tag:"\u00c9veil",desc:"L'\u00e9tat d'observation. Deoxys tente de comprendre ce monde inconnu."},{name:"Attaque",tag:"R\u00e9action",desc:"La r\u00e9action d\u00e9fensive face \u00e0 l'agression. Instinct de survie activ\u00e9."},{name:"D\u00e9fense",tag:"Repli",desc:"Le repli, la survie. Deoxys se prot\u00e8ge d'un monde hostile."},{name:"Vitesse",tag:"Exploration",desc:"La fuite, la cartographie. Deoxys explore ce qu'il ne comprend pas."}]},
      {type:"divider"},
      {type:"mechanic",title:"Slow Start \u2014 Se r\u00e9veiller co\u00fbte quelque chose",icon:"\u25c7",text:"Regigigas n'est pas un \u00eatre vivant au sens plein. Chaque r\u00e9veil lui co\u00fbte quelque chose de fondamental \u2014 comme si la mati\u00e8re devait se rappeler d'elle-m\u00eame ce qu'elle est cens\u00e9e faire, sans avoir de m\u00e9moire pour s'en souvenir. Le **Slow Start** n'est pas une faiblesse m\u00e9canique. C'est la trace narrative de ce qu'il est : un golem qui doit se reconstituer \u00e0 chaque fois qu'une volont\u00e9 ext\u00e9rieure l'y force."}
    ]},
    {id:"apex",label:"Pok\u00e9mon Apex",group:"Univers",color:"amber",badge:"Boss de biome",badgeColor:"amber",title:"Les Pok\u00e9mon Apex",meta:"Esp\u00e8ces exclusives \u00b7 Pivots d'\u00e9cosyst\u00e8me \u00b7 Un par biome",summary:"Au sommet de chaque biome, une esp\u00e8ce exclusive dont la pr\u00e9sence structure tout l'\u00e9cosyst\u00e8me. Ni Alpha, ni L\u00e9gendaire \u2014 quelque chose d'autre.",content:[
      {type:"lead",text:"Dans chaque biome de la Pang\u00e9e, au-dessus des meutes et des Alphas, existe une esp\u00e8ce que les Pok\u00e9mon locaux reconnaissent instinctivement comme ant\u00e9rieure \u00e0 eux-m\u00eames. Ces esp\u00e8ces \u2014 les **Apex** \u2014 ne sont pas simplement des individus dominants. Elles sont les pivots biologiques autour desquels tout l'\u00e9cosyst\u00e8me s'est construit."},
      {type:"callout",color:"amber",text:"Les Pok\u00e9mon Apex sont des **esp\u00e8ces exclusives \u00e0 la Pang\u00e9e** \u2014 elles n'ont aucun descendant connu dans le monde moderne. Elles ont disparu lors de la fragmentation du continent, emportant avec elles un niveau de l'\u00e9cosyst\u00e8me que rien n'a remplac\u00e9. Les voir, c'est voir quelque chose que personne d'autre n'a jamais vu."},
      {type:"divider"},
      {type:"h2",text:"Signal distinctif \u2014 les marques blanches"},
      {type:"mechanic",title:"Leucisme partiel",icon:"\u25c8",text:"Chaque Apex porte des **zones de d\u00e9pigmentation blanche** \u2014 leucisme partiel sur la peau, le pelage, les \u00e9cailles ou les plumes. Ce n'est pas un effet artificiel : c'est la trace biologique de la survie et de la vieillesse extr\u00eame. Ces marques fonctionnent comme un signal social instinctif pour tous les Pok\u00e9mon du biome \u2014 leur pr\u00e9sence vide la zone avant m\u00eame que l'Apex soit visible."},
      {type:"mechanic",title:"Comportement",icon:"\u25ce",text:"Un Apex n'est pas agressif par d\u00e9faut. Il n'a pas besoin de l'\u00eatre. Il observe d'abord \u2014 sa menace n'est pas de l'agressivit\u00e9, c'est de l'indiff\u00e9rence calcul\u00e9e. C'est le silence qui pr\u00e9c\u00e8de qui dit au joueur qu'un Apex est proche : les Pok\u00e9mon sauvages de la zone disparaissent avant que l'Apex soit visible."},
      {type:"divider"},
      {type:"h2",text:"Les cinq Apex \u2014 aper\u00e7u"},
      {type:"cards3",items:[
        {name:"Apex Volcanique",icon:"\ud83c\udf0b",sub:"Zone Volcanique \u00b7 Z\u00e9nith",desc:"Types Feu/Plante. Esp\u00e8ce exclusive \u00e0 concevoir. R\u00e8gne sur la chaleur interne de la Pang\u00e9e.",tagColor:"coral",tag:"\u00c0 concevoir"},
        {name:"Apex C\u00f4tier",icon:"\ud83c\udf0a",sub:"Zone C\u00f4ti\u00e8re \u00b7 Pluie battante",desc:"Types Eau/Vol. Esp\u00e8ce exclusive \u00e0 concevoir. Ma\u00eetre des temp\u00eates permanentes de Panthalassa.",tagColor:"blue",tag:"\u00c0 concevoir"},
        {name:"Apex Aride",icon:"\ud83c\udf2a\ufe0f",sub:"Zone Aride \u00b7 Temp\u00eate de sable",desc:"Types Roche/Sol. Esp\u00e8ce exclusive \u00e0 concevoir. Seigneur du c\u0153ur sec du continent.",tagColor:"amber",tag:"\u00c0 concevoir"},
        {name:"Apex Glaciaire",icon:"\u2744\ufe0f",sub:"Zone Glaciaire \u00b7 Gr\u00eale",desc:"Types Glace/Spectre. Esp\u00e8ce exclusive \u00e0 concevoir. Pr\u00e9sence insaisissable des hauts plateaux.",tagColor:"ice",tag:"\u00c0 concevoir"},
        {name:"Apex Cosmique",icon:"\u2b50",sub:"Zone Cosmique \u00b7 Radiations X",desc:"Types Cosmique/Psy. Clin d'\u0153il \u00e0 Deoxys moderne (uniquement Psy). L'esp\u00e8ce la plus impr\u00e9gn\u00e9e d'\u00e9nergie X \u2014 anc\u00eatre direct des porteurs du Marqueur X.",tagColor:"purple",tag:"\u00c0 concevoir"}
      ]},
      {type:"divider"},
      {type:"h2",text:"Loot & r\u00e9apparition"},
      {type:"mechanic",title:"Mat\u00e9riaux biologiques exclusifs",icon:"\u25c6",text:"Vaincre un Apex rapporte des **mat\u00e9riaux biologiques impossibles \u00e0 obtenir ailleurs** \u2014 une \u00e9caille, une plume, un fragment d'os d'une esp\u00e8ce \u00e9teinte depuis 200 millions d'ann\u00e9es. Ces objets ont deux usages : rapport\u00e9s \u00e0 Wollemi et \u00c9lia au camp, ils font avancer la recherche et les dialogues. Conserv\u00e9s par le joueur, certains ont des effets passifs dans le biome concern\u00e9."},
      {type:"mechanic",title:"R\u00e9apparition temporis\u00e9e",icon:"\u25ce",text:"Un Apex vaincu ne r\u00e9appara\u00eet pas imm\u00e9diatement. Il revient apr\u00e8s un d\u00e9lai li\u00e9 \u00e0 la progression narrative \u2014 souvent en post-game. Cette r\u00e9apparition correspond \u00e0 la reconstitution naturelle de la hi\u00e9rarchie du biome. **Lors de la r\u00e9apparition, l'Apex est capturable** \u2014 seul, sans phase pr\u00e9liminaire, mais avec le m\u00eame set strat\u00e9gique que lors du raid."},
      {type:"callout",color:"amber",text:"Vaincre un Apex **d\u00e9s\u00e9quilibre temporairement le biome**. Les esp\u00e8ces qui d\u00e9pendaient de lui pour la r\u00e9gulation de l'\u00e9cosyst\u00e8me changent de comportement \u2014 proies plus nombreuses et agressives, certaines esp\u00e8ces disparaissent temporairement de la zone. Le joueur ressent le co\u00fbt de ce qu'il a fait. L'\u00e9quilibre se r\u00e9tablit \u00e0 la r\u00e9apparition de l'Apex."}
    ]},
    {id:"starters",label:"Starters",group:"Univers",color:"green",badge:"Starters",badgeColor:"green",title:"Les Starters de Pang\u00e9e",meta:"Les trois Pok\u00e9mon de d\u00e9part propos\u00e9s par le Pr. Wollemi",summary:"Typhlosion, Serperior et Primarina dans leurs formes r\u00e9gionales \u2014 n\u00e9es de l'\u00e9quilibre entre Groudon et Kyogre.",content:[
      {type:"lead",text:"N\u00e9es de l'\u00e9quilibre fragile entre Groudon et Kyogre, ces trois formes r\u00e9gionales sont les *manifestations vivantes* des conditions qui ont rendu la vie possible sur Pang\u00e9e."},
      {type:"starter-block",data:{name:"Typhlosion de Pang\u00e9e",quote:"La Terre en fusion",color:"coral",types:[["coral","Feu"],["gray","Roche"]],desc:"N\u00e9 des premi\u00e8res \u00e9ruptions de la Pang\u00e9e, sa fourrure s'est p\u00e9trifi\u00e9e en basalte incandescent. Ses flammes ne br\u00fblent plus vers le haut \u2014 elles *coulent vers le bas comme de la lave*. Il ne court pas : il avance comme une coul\u00e9e, in\u00e9vitable et implacable.",stats:{PV:98,Attaque:118,"D\u00e9fense":95,"Atq Sp\u00e9":74,"D\u00e9f Sp\u00e9":80,Vitesse:92},totalBST:557,signature:{name:"Frappe Magma",pwr:90,acc:100,pp:10,desc:"Le lanceur s'abat sur la cible avec un poing de roche en fusion. La lave qui se solidifie \u00e0 l'impact r\u00e9duit la Vitesse de la cible d'un cran."},talent:{name:"Corps Ardent",desc:"Les capacit\u00e9s directes re\u00e7ues ont 30% de chances de br\u00fbler leur lanceur."},moves:[{name:"Nitrocharge",type:"coral",pwr:50,acc:100,pp:20},{name:"\u00c9boulement",type:"gray",pwr:75,acc:90,pp:10},{name:"S\u00e9isme",type:"amber",pwr:100,acc:100,pp:10},{name:"Gyroballe",type:"gray",pwr:null,acc:100,pp:5}]}},
      {type:"starter-block",data:{name:"Serperior de Pang\u00e9e",quote:"La Nature v\u00e9n\u00e9rable",color:"green",types:[["green","Plante"],["blue","Dragon"]],desc:"Incarnation de la v\u00e9g\u00e9tation primordiale de la Pang\u00e9e \u2014 massive, primitive, indestructible. Ses \u00e9cailles ressemblent \u00e0 de l'\u00e9corce d'arbre mill\u00e9naire. Il ne combat jamais en premier. Il n'en a jamais eu besoin.",stats:{PV:75,Attaque:115,"D\u00e9fense":90,"Atq Sp\u00e9":60,"D\u00e9f Sp\u00e9":83,Vitesse:125},totalBST:548,signature:{name:"\u00c9treinte Sylvestre",pwr:100,acc:75,pp:10,desc:"Le lanceur s'enroule violemment autour de la cible et la broie dans ses \u00e9cailles. Emp\u00eache la cible de quitter le terrain tant que Serperior reste au combat."},talent:{name:"Multi\u00e9caille",desc:"Diminue les d\u00e9g\u00e2ts subis par les capacit\u00e9s offensives si le Pok\u00e9mon a tous ses PV."},moves:[{name:"Danse Draco",type:"blue",pwr:null,acc:null,pp:20},{name:"Lame Feuille",type:"green",pwr:90,acc:100,pp:15},{name:"Rafale \u00c9cailles",type:"blue",pwr:25,acc:90,pp:20},{name:"Vitesse Extr\u00eame",type:"gray",pwr:80,acc:100,pp:5}]}},
      {type:"starter-block",data:{name:"Primarina de Pang\u00e9e",quote:"L'Eau myst\u00e9rieuse",color:"blue",types:[["blue","Eau"],["purple","Spectre"]],desc:"N\u00e9e des abysses de Panthalassa, l\u00e0 o\u00f9 la lumi\u00e8re n'est jamais arriv\u00e9e. Elle est translucide, bioluminescente par intermittence, visible seulement quand elle le d\u00e9cide. Elle est la premi\u00e8re \u00e0 *sentir* l'arriv\u00e9e de Deoxys \u2014 avant m\u00eame que Rayquaza ne le d\u00e9tecte.",stats:{PV:100,Attaque:60,"D\u00e9fense":75,"Atq Sp\u00e9":112,"D\u00e9f Sp\u00e9":124,Vitesse:85},totalBST:556,signature:{name:"Mirage Abyssal",pwr:70,acc:100,pp:10,desc:"Le lanceur distord les reflets lumineux autour de lui pour frapper depuis un angle imperceptible. Inflige des d\u00e9g\u00e2ts et 50% de chances de rendre la cible confuse."},talent:{name:"M\u00e9dic Nature",desc:"Le Pok\u00e9mon soigne ses alt\u00e9rations de statut s'il switch ou en fin de combat."},moves:[{name:"Surf",type:"blue",pwr:90,acc:100,pp:15},{name:"Fontaine de Vie",type:"blue",pwr:null,acc:null,pp:10},{name:"Ch\u00e2timent",type:"purple",pwr:65,acc:100,pp:10},{name:"\u00c9clat Magique",type:"pink",pwr:80,acc:100,pp:10}]}}
    ]},
    {id:"eclats",label:"Les \u00c9clats X",group:"Science",color:"blue",badge:"Science",badgeColor:"blue",title:"Les \u00c9clats X",meta:"Fragments de la m\u00e9t\u00e9orite \u00b7 M\u00e9canique centrale du jeu",summary:"Les fragments cosmiques qui ont rendu la plan\u00e8te perm\u00e9able \u00e0 toutes les \u00e9nergies ext\u00e9rieures.",content:[
      {type:"lead",text:"La m\u00e9t\u00e9orite ne s'est pas vaporis\u00e9e \u00e0 l'impact. Elle s'est fragment\u00e9e. Chacun de ses \u00e9clats porte une quantit\u00e9 infime mais mesurable de l'**\u00e9nergie X** \u2014 l'\u00e9nergie cosmique originelle."},
      {type:"info-row",items:[{label:"Fragments dispers\u00e9s",value:"Des dizaines \u00e0 centaines"},{label:"Zone de dispersion",value:"Des milliers de km"},{label:"\u00c9clats n\u00e9cessaires",value:"12 exactement"}]},
      {type:"divider"},
      {type:"mechanic",title:"Signature dormante",icon:"\u25c7",text:"Pris isol\u00e9ment, un \u00c9clat X est dormant. Sa signature isotopique est impossible \u00e0 produire par des processus g\u00e9ologiques terrestres. Sa micro-structure cristalline ne ressemble \u00e0 rien de connu. Il attend."},
      {type:"mechanic",title:"R\u00e9sonance collective",icon:"\u25c8",text:"R\u00e9unis, les \u00c9clats entrent en r\u00e9sonance \u2014 une \u00e9mission d'\u00e9nergie basse fr\u00e9quence dont l'intensit\u00e9 cro\u00eet avec le nombre de fragments rassembl\u00e9s. Comme les morceaux d'un m\u00eame enregistrement qui cherche \u00e0 se rejouer.",chain:["1 \u00c9clat : dormant","Plusieurs : r\u00e9sonance","12 r\u00e9unis : seuil critique","La Fissure s'ouvre"]},
      {type:"mechanic",title:"Impr\u00e9gnation plan\u00e9taire",icon:"\u25c9",text:"L'\u00e9nergie X s'est diffus\u00e9e dans la cro\u00fbte terrestre, les oc\u00e9ans et l'atmosph\u00e8re. La plan\u00e8te est devenue *perm\u00e9able aux \u00e9nergies cosmiques ext\u00e9rieures*. Les \u00c9clats X ne sont pas la source des ph\u00e9nom\u00e8nes extraordinaires \u2014 ils sont la raison pour laquelle la plan\u00e8te \u00e9tait **capable de les absorber**."},
      {type:"divider"},
      {type:"h2",text:"Connexions inter-univers Pok\u00e9mon"},
      {type:"conn-table",items:[{label:"M\u00e9ga-\u00c9volution",origin:"Hoenn",desc:"Mikado organ de Rayquaza, \u00e9nergie X directe lors du combat originel"},{label:"Formes Primo",origin:"Hoenn",desc:"Groudon / Kyogre retrouvant l'\u00e9tat ant\u00e9rieur \u00e0 l'interf\u00e9rence X"},{label:"Dynamax",origin:"Galar",desc:"Eternatus (ast\u00e9ro\u00efde, -20 000 ans) \u2014 ancr\u00e9 via perm\u00e9abilit\u00e9 plan\u00e9taire"},{label:"T\u00e9racristallisation",origin:"Paldea",desc:"Terapagos, \u00e9nergie biologique intrins\u00e8que \u2014 ancr\u00e9e via perm\u00e9abilit\u00e9"},{label:"Cristaux-Z",origin:"Alola",desc:"Necrozma (Ultra-Espace), nature photonique distincte des \u00c9clats X"}]}
    ]},
    {id:"marqueur",label:"Le Marqueur X",group:"Science",color:"purple",badge:"Xenog\u00e9nomique",badgeColor:"purple",title:"Le Marqueur X & la Divergence",meta:"Th\u00e8se centrale du Pr. Wollemi \u00b7 L'origine humaine",summary:"La question que personne ne posait : d'o\u00f9 viennent les humains ?",content:[
      {type:"lead",text:"La communaut\u00e9 scientifique s'est accord\u00e9e sur un r\u00e9cit fondateur. Ce r\u00e9cit est coh\u00e9rent, document\u00e9, et accept\u00e9. Ce qu'il n'explique pas, c'est **les humains**."},
      {type:"callout",color:"purple",text:"Les humains ne descendent pas de Mew. Wollemi appelle ce probl\u00e8me *la Divergence*. Dans l'ADN humain se trouvent des s\u00e9quences dormantes qui n'appartiennent \u00e0 aucune lign\u00e9e \u00e9volutive terrestre identifiable \u2014 pr\u00e9sentes chez tous les humains, absentes de tous les Pok\u00e9mon."},
      {type:"mechanic",title:"La Source X \u2014 l'hypoth\u00e8se non publi\u00e9e",icon:"\u2b50",text:"Le Marqueur X partage avec l'ADN de Deoxys une logique structurelle que rien d'autre ne partage. L'hypoth\u00e8se : Deoxys, ou un anc\u00eatre cosmique de Deoxys, aurait introduit dans les premi\u00e8res formes de vie de la Pang\u00e9e un mat\u00e9riau g\u00e9n\u00e9tique exog\u00e8ne. Les humains seraient **le r\u00e9sultat d'une contamination cosmique accidentelle**."},
      {type:"para",text:"Ce que Wollemi n'a pas encore formul\u00e9 publiquement \u2014 mais que la Pang\u00e9e va lui permettre de voir de ses propres yeux \u2014 c'est la suite logique de cette hypoth\u00e8se. Le Marqueur X ne vient pas directement de Deoxys. Il vient d'une lign\u00e9e Pok\u00e9mon interm\u00e9diaire qui a absorb\u00e9 l'\u00e9nergie X lors de l'impact et en a fait quelque chose de durable. Ce chapitre complet est d\u00e9velopp\u00e9 dans la page **Syndrome X**."},
      {type:"quote",text:"Les ph\u00e9nom\u00e8nes extraordinaires de transformation que nous observons \u00e0 travers les r\u00e9gions \u2014 M\u00e9ga-\u00c9volution, Formes Primo, Dynamax, T\u00e9racristallisation \u2014 ne sont pas des accidents locaux. Ils sont des expressions r\u00e9gionales d'une perm\u00e9abilit\u00e9 plan\u00e9taire globale. Cette perm\u00e9abilit\u00e9 a une date. Elle a un crat\u00e8re.",author:"Pr. Wollemi, notes personnelles"}
    ]},
    {id:"syndrome-x",label:"Le Syndrome X",group:"Science",color:"poison",badge:"Lore fondateur",badgeColor:"poison",title:"Le Syndrome X \u2014 Naissance et disparition du type Cosmique",meta:"L'origine humaine compl\u00e8te \u00b7 Le type Cosmique disparu \u00b7 La boucle boucl\u00e9e",summary:"Pourquoi le type Cosmique n'existe plus \u00e0 l'\u00e9poque moderne, et comment les humains descendent d'une lign\u00e9e Pok\u00e9mon irradi\u00e9e par l'\u00e9nergie X.",content:[
      {type:"lead",text:"Quand la m\u00e9t\u00e9orite de Deoxys s'est \u00e9cras\u00e9e sur la Pang\u00e9e, l'\u00e9nergie X lib\u00e9r\u00e9e s'est diffus\u00e9e en ondes concentriques depuis le point d'impact. La quasi-totalit\u00e9 des organismes expos\u00e9s directement ont p\u00e9ri. Quelques esp\u00e8ces ont surv\u00e9cu \u2014 **transform\u00e9es**. Ce ph\u00e9nom\u00e8ne, le Professeur Wollemi l'appelle le **Syndrome X**."},
      {type:"divider"},
      {type:"h2",text:"Les trois caract\u00e9ristiques du Syndrome X"},
      {type:"mechanic",title:"Instabilit\u00e9 g\u00e9n\u00e9tique productive",icon:"\u25c8",text:"L'ADN des porteurs du Syndrome X mute \u00e0 un rythme radicalement sup\u00e9rieur \u00e0 la normale. L\u00e0 o\u00f9 deux membres d'une m\u00eame esp\u00e8ce Pok\u00e9mon sont biologiquement quasi-identiques, deux porteurs du Syndrome X peuvent pr\u00e9senter des diff\u00e9rences morphologiques, m\u00e9taboliques et comportementales consid\u00e9rables. Cette variabilit\u00e9 est exactement ce que Wollemi observe chez les humains modernes \u2014 et qu'il n'observe chez aucune esp\u00e8ce Pok\u00e9mon connue."},
      {type:"mechanic",title:"Perm\u00e9abilit\u00e9 aux \u00e9nergies cosmiques \u2014 le type Cosmique",icon:"\u2b50",text:"Les porteurs d\u00e9veloppent des r\u00e9cepteurs primitifs \u00e0 l'\u00e9nergie X. Cette propri\u00e9t\u00e9 se traduit en jeu par le **type Cosmique** : des capacit\u00e9s qui n'ob\u00e9issent \u00e0 aucune r\u00e8gle d'interaction terrestre, op\u00e9rant sur un registre \u00e9nerg\u00e9tique que rien d'autre ne reconna\u00eet. C'est pourquoi les Pok\u00e9mon de la Zone Cosmique ont ce type \u2014 ils vivent dans la zone de concentration maximale d'\u00e9nergie X r\u00e9siduelle."},
      {type:"mechanic",title:"Proto-conscience sociale \u00e9mergente",icon:"\u25ce",text:"Les porteurs du Syndrome X d\u00e9veloppent des formes de communication et d'organisation collective plus complexes que leurs cong\u00e9n\u00e8res non affect\u00e9s. Pas de l'intelligence au sens humain \u2014 quelque chose d'interm\u00e9diaire, de difficile \u00e0 cat\u00e9goriser. C'est pourquoi les Apex de la Zone Cosmique ont des comportements que les autres Apex n'ont pas."},
      {type:"divider"},
      {type:"h2",text:"Pourquoi le type Cosmique a disparu"},
      {type:"para",text:"Le Syndrome X est une bifurcation \u00e9volutive forc\u00e9e \u2014 mais pas une bifurcation stable. L'\u00e9nergie X ambiante autour du point d'impact, source de l'instabilit\u00e9 productive, se dissipe progressivement sur des dizaines de milliers d'ann\u00e9es. Sans cette source continue, l'instabilit\u00e9 g\u00e9n\u00e9tique qui \u00e9tait un avantage devient un d\u00e9savantage : chaque g\u00e9n\u00e9ration produit des variants moins marqu\u00e9s que la pr\u00e9c\u00e9dente."},
      {type:"callout",color:"poison",text:"Le type Cosmique ne s'est pas \u00e9teint brutalement. Il a fondu \u2014 g\u00e9n\u00e9ration apr\u00e8s g\u00e9n\u00e9ration, l'expression ph\u00e9notypique a diminu\u00e9 jusqu'\u00e0 dispara\u00eetre, tout en restant pr\u00e9sent \u00e0 l'\u00e9tat latent dans le g\u00e9nome. Ce r\u00e9sidu latent, c'est exactement ce que Wollemi appelle le **Marqueur X**."},
      {type:"h2",text:"Les deux destins des lign\u00e9es porteuses"},
      {type:"cards2",items:[
        {name:"L'extinction progressive",icon:"\ud83d\udc80",desc:"Pour la majorit\u00e9 des lign\u00e9es. L'instabilit\u00e9 g\u00e9n\u00e9tique sans \u00e9nergie X pour la soutenir produit trop de variants non-viables. Ces esp\u00e8ces s'\u00e9teignent en quelques centaines de milliers d'ann\u00e9es \u2014 leurs fossiles ne ressemblent \u00e0 aucune lign\u00e9e connue et restent non-identifi\u00e9s par la pal\u00e9ontologie moderne."},
        {name:"La stabilisation divergente",icon:"\ud83e\uddec",desc:"Pour une lign\u00e9e unique, dans des circonstances non enti\u00e8rement \u00e9lucid\u00e9es par Wollemi. Au lieu de s'\u00e9teindre, cette lign\u00e9e converge vers une stabilit\u00e9 in\u00e9dite : elle conserve l'instabilit\u00e9 g\u00e9n\u00e9tique productive comme caract\u00e9ristique permanente, perd le type Cosmique comme expression active mais le garde comme Marqueur X dormant, et d\u00e9veloppe progressivement les caract\u00e9ristiques humaines."}
      ]},
      {type:"divider"},
      {type:"h2",text:"Les humains comme h\u00e9ritiers du Syndrome X"},
      {type:"mechanic",title:"La variabilit\u00e9 g\u00e9n\u00e9tique humaine",icon:"\u25c6",text:"Ce qui \u00e9tait l'instabilit\u00e9 g\u00e9n\u00e9tique productive du Syndrome X est devenu la **variabilit\u00e9 g\u00e9n\u00e9tique humaine** \u2014 la caract\u00e9ristique la plus distinctive de l'esp\u00e8ce. Deux Ossatueur sont quasi-identiques biologiquement. Deux humains peuvent pr\u00e9senter des diff\u00e9rences g\u00e9n\u00e9tiques, morphologiques, cognitives et comportementales consid\u00e9rables. H\u00e9rit\u00e9 directement du Syndrome X, stabilis\u00e9 sur des centaines de millions d'ann\u00e9es."},
      {type:"mechanic",title:"Le Marqueur X comme vestige du type Cosmique",icon:"\u2b50",text:"Ce qui \u00e9tait le type Cosmique actif dans la biologie d'un Pok\u00e9mon est devenu le Marqueur X : une empreinte dormante, sans expression ph\u00e9notypique directe, pr\u00e9sente dans chaque cellule humaine sans exception. L'\u00e9nergie n'est plus active. Mais la trace structurelle dans le g\u00e9nome est ind\u00e9l\u00e9bile."},
      {type:"mechanic",title:"La cognition sociale humaine",icon:"\u25ce",text:"Ce qui \u00e9tait la proto-conscience sociale \u00e9mergente des porteurs du Syndrome X est devenu la **cognition sociale humaine** \u2014 la capacit\u00e9 \u00e0 construire des structures sociales complexes, \u00e0 transmettre des savoirs, \u00e0 coop\u00e9rer \u00e0 des \u00e9chelles qu'aucune esp\u00e8ce Pok\u00e9mon n'atteint."},
      {type:"callout",color:"purple",text:"Les humains ne descendent pas de Mew. Ils ne sont pas une cr\u00e9ation ind\u00e9pendante d'Arceus. Ils sont la **descendance stabilis\u00e9e d'une lign\u00e9e Pok\u00e9mon porteuse du Syndrome X** \u2014 la seule qui n'a ni perdu ses caract\u00e9ristiques cosmiques ni disparu, mais les a transform\u00e9es en quelque chose de durable. Deoxys n'a pas cr\u00e9\u00e9 les humains. Il a cr\u00e9\u00e9 les conditions qui ont rendu leur existence possible. *Par accident.*"},
      {type:"quote",text:"Pourquoi les humains ne sont-ils plus des Pok\u00e9mon, m\u00eame s'ils en descendent ? Parce que la divergence est trop ancienne et trop profonde. Une lign\u00e9e qui a bifurqu\u00e9 il y a plusieurs centaines de millions d'ann\u00e9es, sous une pression \u00e9volutive sans pr\u00e9c\u00e9dent, dans une direction que rien d'autre n'a prise, n'est plus la m\u00eame esp\u00e8ce. Ce n'est pas diff\u00e9rent de ce que la biologie terrestre r\u00e9elle enseigne.",author:"Pr. Wollemi, notes non publi\u00e9es \u2014 Source X"}
    ]},
    {id:"fissure",label:"La Fissure",group:"Science",color:"teal",badge:"M\u00e9canique centrale",badgeColor:"teal",title:"La Fissure",meta:"Le portail temporel \u00b7 Dispositif d'activation",summary:"La connexion directe entre le pr\u00e9sent et le sol de la Pang\u00e9e au moment de l'impact.",content:[
      {type:"lead",text:"En cartographiant la distribution des \u00c9clats Premiers et en remontant la d\u00e9rive des continents par mod\u00e9lisation g\u00e9ophysique, Wollemi et **Theo Marrant** ont calcul\u00e9 le point d'impact originel \u2014 aujourd'hui sous **quatre mille m\u00e8tres d'eau**, au fond de l'Atlantique."},
      {type:"mechanic",title:"Pas un voyage dans le temps",icon:"\u25ce",text:"La Fissure n'est pas un voyage dans le temps au sens abstrait. Une reconnexion directe entre deux points de la **m\u00eame plan\u00e8te** s\u00e9par\u00e9s par le temps : ici, aujourd'hui, et le sol de la Pang\u00e9e au moment pr\u00e9cis de l'impact de la m\u00e9t\u00e9orite."},
      {type:"mechanic",title:"Le seuil de r\u00e9sonance critique",icon:"\u2726",text:"Douze \u00c9clats X r\u00e9unis dans les bonnes conditions g\u00e9om\u00e9triques, activ\u00e9s par l'\u00e9nergie calcul\u00e9e dans les mod\u00e8les de **Theo Marrant**, atteignent un seuil de r\u00e9sonance critique. \u00c0 ce seuil, la r\u00e9sonance **rouvre** l'impact originel.",chain:["12 \u00c9clats r\u00e9unis","Configuration g\u00e9om\u00e9trique exacte","Seuil critique atteint","La Fissure s'ouvre"]},
      {type:"callout",color:"teal",text:"**Le portail de retour ne s'ouvre que lorsque les douze \u00c9clats sont r\u00e9unis et activ\u00e9s simultan\u00e9ment.** Ce que personne n'anticipe : que certains membres utiliseront leur fragment comme levier de pouvoir le moment venu."}
    ]},
    {id:"protagoniste",label:"Le Protagoniste",group:"Personnages",color:"amber",badge:"Joueur",badgeColor:"amber",title:"Le Protagoniste",meta:"L'homme de terrain \u00b7 Alter ego du joueur",summary:"Pas de dipl\u00f4me, pas de titre. Une m\u00e9thode que personne d'autre n'a.",content:[
      {type:"lead",text:"Tu n'es pas chercheur. Tu n'as jamais publi\u00e9 d'article. Ce que tu sais faire, c'est trouver des Pok\u00e9mon que personne d'autre ne trouve."},
      {type:"mechanic",title:"La m\u00e9thode",icon:"\u25ce",text:"Tu sais lire un territoire, comprendre ce qu'un Pok\u00e9mon sauvage tol\u00e8re ou refuse, sentir le moment o\u00f9 l'approche est possible et celui o\u00f9 elle ne l'est pas encore. Tu construis de la confiance sans la forcer."},
      {type:"mechanic",title:"La mission dans la Pang\u00e9e",icon:"\u25c6",text:"Wollemi te confie une mission claire : **explorer, cartographier, documenter**. Suivre la r\u00e9sonance des \u00c9clats X pour localiser les traces de Deoxys. Identifier les biomes et leurs esp\u00e8ces. Rapporter au camp \u2014 donn\u00e9es, observations, \u00e9chantillons. Tu es l'interface entre le terrain hostile et l'\u00e9quipe scientifique. C'est pour \u00e7a que tu es l\u00e0."},
      {type:"divider"},
      {type:"h2",text:"Le choix du starter"},
      {type:"para",text:"Wollemi t'emm\u00e8ne dans la serre d'\u00e9levage du laboratoire. Il se tourne vers toi et dit simplement : *Je t'en dois un depuis longtemps. Prends celui avec lequel tu te sens.* C'est seulement apr\u00e8s, Pok\u00e9mon en main, qu'il t'explique tout le reste."},
      {type:"starter-choice",items:[{name:"H\u00e9ricendre",evolution:"\u2192 Typhlosion de Pang\u00e9e",types:[["coral","Feu"],["gray","Roche"]],color:"coral",desc:"Le b\u00e2tisseur in\u00e9vitable. Puissance physique brute et endurance volcanique."},{name:"Vip\u00e9lierre",evolution:"\u2192 Serperior de Pang\u00e9e",types:[["green","Plante"],["blue","Dragon"]],color:"green",desc:"Le v\u00e9n\u00e9rable. Vitesse et contr\u00f4le \u2014 ne frappe jamais en premier."},{name:"Otaquin",evolution:"\u2192 Primarina de Pang\u00e9e",types:[["blue","Eau"],["purple","Spectre"]],color:"purple",desc:"L'invisible. Attaque sp\u00e9ciale \u2014 toujours un coup d'avance."}]},
      {type:"divider"},
      {type:"h2",text:"\u00c9lia \u2014 La rivale silencieuse"},
      {type:"callout",color:"purple",text:"\u00c9lia a investi dans Wollemi comme on investit dans quelqu'un dont on attend une validation explicite en retour. Quand elle te voit arriver \u2014 sans dipl\u00f4me, avec ta fa\u00e7on informelle d'exister dans l'espace du Professeur \u2014 elle enregistre la chaleur qu'il a pour toi. Elle ne dit rien. Elle stocke. **Elle est jalouse de ta l\u00e9g\u00e8ret\u00e9.**"}
    ]},
    {id:"wollemi-elia",label:"Wollemi & \u00c9lia",group:"Personnages",color:"gray",badge:"PNJ fondateurs",badgeColor:"gray",title:"Professeur Wollemi & \u00c9lia",meta:"Chef d'exp\u00e9dition \u00b7 Doctorante \u00b7 Le bin\u00f4me scientifique",summary:"Le chercheur qui cherche ce que tout le monde a cess\u00e9 de chercher, et l'assistante qui a tout investi pour \u00eatre l\u00e0.",content:[
      {type:"lead",text:"Le *Wollemia nobilis* \u2014 surnomm\u00e9 le dinosaure botanique \u2014 a \u00e9t\u00e9 d\u00e9couvert vivant en 1994. Morphologiquement inchang\u00e9 depuis 200 millions d'ann\u00e9es, il a vu la Pang\u00e9e. Le Professeur Wollemi partage quelque chose avec l'arbre qui lui a donn\u00e9 son nom."},
      {type:"persons-grid",items:[{initials:"W",color:"gray",imgUrl:`${BASE}/Professeur%20Wollemi.png`,name:"Professeur Wollemi",role:"Chef d'exp\u00e9dition \u00b7 Xenog\u00e9nomique \u00b7 Biologie \u00e9volutive compar\u00e9e",desc:"Sp\u00e9cialis\u00e9 en biologie \u00e9volutive compar\u00e9e et en *xenog\u00e9nomique* \u2014 l'\u00e9tude des s\u00e9quences g\u00e9n\u00e9tiques pr\u00e9sentes chez les humains et les Pok\u00e9mon qui ne s'expliquent par aucun m\u00e9canisme \u00e9volutif terrestre connu. Sa th\u00e8se publi\u00e9e en 2012 a \u00e9t\u00e9 accueillie avec scepticisme poli."}]},
      {type:"quote",text:"Les ph\u00e9nom\u00e8nes extraordinaires de transformation que nous observons \u00e0 travers les r\u00e9gions \u2014 M\u00e9ga-\u00c9volution, Formes Primo, Dynamax, T\u00e9racristallisation \u2014 ne sont pas des accidents locaux. Ils sont des expressions r\u00e9gionales d'une perm\u00e9abilit\u00e9 plan\u00e9taire globale.",author:"Pr. Wollemi, notes personnelles"},
      {type:"divider"},
      {type:"h2",text:"\u00c9lia"},
      {type:"callout",color:"purple",text:"Doctorante brillante, deux articles publi\u00e9s \u00e0 24 ans. Elle a choisi Wollemi parce qu'elle croyait en sa th\u00e8se avant m\u00eame de le rencontrer. Ce qui la ronge : elle attend une validation explicite que Wollemi exprime par la confiance, pas par les mots. Son arc : comprendre progressivement que la vraie question est ce qu'elle veut, elle, ind\u00e9pendamment de lui."}
    ]},
    {id:"expedition",label:"L'exp\u00e9dition",group:"Personnages",color:"gray",badge:"8 personnages",badgeColor:"gray",title:"Les 8 Exp\u00e9diteurs",meta:"Porteurs des \u00c9clats X \u00b7 Confrontations narratives",summary:"Chaque membre d\u00e9tient un \u00c9clat. Chaque arc r\u00e9v\u00e8le une limite humaine. Chaque confrontation est in\u00e9vitable.",content:[
      {type:"lead",text:"Chaque membre porte un \u00c9clat X \u2014 sans lequel le groupe ne peut pas rentrer. Cliquer sur une carte pour voir le profil complet, les objectifs et l'arc narratif."},
      {type:"eclat-table"}
    ]},
    {id:"mecanique",label:"M\u00e9caniques de jeu",group:"Conception",color:"purple",badge:"Game Design",badgeColor:"purple",title:"M\u00e9caniques de jeu",meta:"Syst\u00e8mes de combat \u00b7 Progression narrative \u00b7 Types",summary:"Le type Cosmique, la m\u00e9canique des \u00c9clats, et les connexions entre ph\u00e9nom\u00e8nes.",content:[
      {type:"lead",text:"Le c\u0153ur m\u00e9canique du jeu repose sur trois syst\u00e8mes imbriqu\u00e9s : le **type Cosmique**, la **progression par \u00c9clats**, et la **perm\u00e9abilit\u00e9 plan\u00e9taire** qui relie tous les ph\u00e9nom\u00e8nes extraordinaires du monde Pok\u00e9mon."},
      {type:"mechanic",title:"Le type Cosmique",icon:"\u2b50",text:"Deoxys re\u00e7oit le **type Cosmique** \u2014 un type qui n'ob\u00e9it pas aux r\u00e8gles des types terrestres. \u00c0 l'\u00e9poque de la Pang\u00e9e, ce type existe aussi chez les Pok\u00e9mon de la Zone Cosmique, porteurs du Syndrome X. Il a disparu \u00e0 l'\u00e9poque moderne \u2014 voir la page *Syndrome X* pour l'explication compl\u00e8te."},
      {type:"mechanic",title:"8 \u00c9clats = 8 arcs narratifs",icon:"\u25c6",text:"Chaque \u00c9clat X est d\u00e9tenu par un membre de l'exp\u00e9dition. Les r\u00e9cup\u00e9rer n'est pas une suite de combats \u2014 c'est une suite de *confrontations humaines*. Chaque arc r\u00e9v\u00e8le pourquoi ce personnage a choisi de prioriser ses propres objectifs sur la coh\u00e9sion du groupe.",chain:["Trouver le membre","Comprendre son arc","Confrontation","R\u00e9cup\u00e9rer l'\u00c9clat"]},
      {type:"divider"},
      {type:"h2",text:"Types des exp\u00e9diteurs \u2014 aucun overlap avec les Apex"},
      {type:"para",text:"Les types des 8 membres d'exp\u00e9dition ont \u00e9t\u00e9 choisis pour ne jamais recouper les types des Pok\u00e9mon Apex rencontr\u00e9s dans les biomes. Cette d\u00e9cision garantit une diversit\u00e9 totale des m\u00e9caniques adverses tout au long du jeu."},
      {type:"type-grid",items:[
        {name:"Hana",type:"Poison",color:"poison"},
        {name:"Vael",type:"Acier",color:"steel"},
        {name:"Solano",type:"Normal",color:"gray"},
        {name:"Marrant",type:"\u00c9lectrik",color:"amber"},
        {name:"Carvalho",type:"F\u00e9e",color:"pink"},
        {name:"Ashida",type:"Combat",color:"coral"},
        {name:"Shore",type:"Dragon",color:"teal"},
        {name:"Vasi",type:"T\u00e9n\u00e8bre",color:"dark"}
      ]}
    ]},
    {id:"hierarchie",label:"Hi\u00e9rarchie Sauvage",group:"Conception",color:"green",badge:"Game Design",badgeColor:"green",title:"Hi\u00e9rarchie Sauvage \u2014 Sauvage / Alpha / Apex",meta:"Trois niveaux de rencontre \u00b7 Formats de combat distincts \u00b7 Progression d'exploration",summary:"Trois rangs distincts structurent la faune de la Pang\u00e9e, chacun avec son format de combat, son signal visuel et ses m\u00e9caniques propres.",content:[
      {type:"lead",text:"La Pang\u00e9e n'a pas de dresseurs. Ce qui donne du rythme \u00e0 l'exploration, c'est la **hi\u00e9rarchie vivante du monde sauvage** \u2014 trois niveaux de rencontre clairement distincts, chacun avec un format de combat diff\u00e9rent, un signal visuel imm\u00e9diatement lisible, et une logique propre."},
      {type:"h2",text:"Vue d'ensemble"},
      {type:"hierarchie-table"},
      {type:"divider"},
      {type:"h2",text:"Sauvage \u2014 l'unit\u00e9 de base"},
      {type:"mechanic",title:"Signal visuel",icon:"\u25c7",text:"Aucun marqueur particulier. Se lisent par leur comportement naturel \u2014 certains fuient, d'autres chargent selon l'esp\u00e8ce. Le joueur apprend \u00e0 les lire par l'observation."},
      {type:"mechanic",title:"Combat",icon:"\u25c8",text:"Combat Pok\u00e9mon classique, un contre un ou en horde selon l'esp\u00e8ce. Pas de m\u00e9canique sp\u00e9ciale. La difficult\u00e9 vient du niveau et du type, pas de la structure."},
      {type:"mechanic",title:"Capture & Loot",icon:"\u25c9",text:"Capture standard \u2014 affaiblir, lancer une Pok\u00e9 Ball. Loot : objets courants propres \u00e0 l'esp\u00e8ce. Certaines esp\u00e8ces sont approchables en furtif sans combat pr\u00e9alable."},
      {type:"divider"},
      {type:"h2",text:"Alpha \u2014 le chef de meute"},
      {type:"mechanic",title:"Signal visuel",icon:"\u25c7",text:"**Yeux rouges** \u2014 signal de dominance et d'agressivit\u00e9. Taille sup\u00e9rieure \u00e0 la normale. Charge imm\u00e9diatement \u00e0 vue. Toujours entour\u00e9 de Pok\u00e9mon de sa propre famille \u00e9volutive."},
      {type:"mechanic",title:"Combat",icon:"\u25c8",text:"**Horde puis boss.** La meute de m\u00eame esp\u00e8ce engage en premier. L'Alpha reste en retrait jusqu'\u00e0 ce que ses cong\u00e9n\u00e8res soient dispers\u00e9s ou vaincus, puis entre au combat seul. Deux temps naturels, pas de phases formelles."},
      {type:"mechanic",title:"Capture & Loot",icon:"\u25c9",text:"Capture difficile mais possible. Taux r\u00e9duit, stats sup\u00e9rieures, niveau \u00e9lev\u00e9. Loot : objets rares de l'esp\u00e8ce \u00e0 taux augment\u00e9, mat\u00e9riaux d'\u00e9volution, Bonbons Exp. L'Alpha revient \u00e0 son emplacement fixe apr\u00e8s d\u00e9faite."},
      {type:"divider"},
      {type:"h2",text:"Apex \u2014 le pivot d'\u00e9cosyst\u00e8me"},
      {type:"mechanic",title:"Signal visuel",icon:"\u25c7",text:"**Marques blanches** \u2014 leucisme partiel sur la peau, le pelage, les \u00e9cailles ou les plumes. Signal biologique instinctif pour toute la faune locale. La zone se vide avant m\u00eame que l'Apex soit visible. Il n'a pas besoin de charger pour imposer sa pr\u00e9sence."},
      {type:"mechanic",title:"Combat \u2014 structure Raid",icon:"\u25c8",text:"Combat en **deux phases distinctes**. Phase 1 : trois Pok\u00e9mon embl\u00e9matiques du biome, chacun avec un set strat\u00e9gique, en s\u00e9quence. L'Apex dirige depuis l'arri\u00e8re mais reste hors d'atteinte. Phase 2 : l'Apex seul entre au combat une fois ses alli\u00e9s dispers\u00e9s \u2014 esp\u00e8ce exclusive, patterns in\u00e9dits, joueur entam\u00e9 par la phase 1. La difficult\u00e9 est cumulative, pas artificielle.",chain:["Minion 1","Minion 2","Minion 3","Boss Apex"]},
      {type:"mechanic",title:"Les 3 minions \u2014 vari\u00e9t\u00e9 strat\u00e9gique",icon:"\u25c6",text:"Les trois minions ne suivent pas toujours le m\u00eame sch\u00e9ma. Selon l'Apex : un trio asym\u00e9trique (rapide/tank/attaquant), un trio synergique (set pens\u00e9 pour fonctionner ensemble mais affront\u00e9 s\u00e9par\u00e9ment), un trio narratif (du plus commun au plus rare de la zone \u2014 le raid devient une lecture du biome), ou un trio \u00e0 inversion (le plus dur n'est pas le dernier). Chaque minion a une identit\u00e9 lisible en un tour."},
      {type:"mechanic",title:"Capture & Loot",icon:"\u25c9",text:"**Incapturable lors du raid.** Loot : mat\u00e9riaux biologiques exclusifs \u00e0 l'esp\u00e8ce Apex, objets de craft uniques introuvables ailleurs, donn\u00e9es utilisables par Wollemi et \u00c9lia au camp (avancement de la recherche). **R\u00e9apparition temporis\u00e9e** : apr\u00e8s un d\u00e9lai li\u00e9 \u00e0 la progression narrative, l'Apex revient seul dans le biome \u2014 capturable dans cette configuration, avec le m\u00eame set strat\u00e9gique."},
      {type:"callout",color:"green",text:"Vaincre un Apex d\u00e9s\u00e9quilibre temporairement le biome. Les proies habituelles de l'Apex deviennent plus nombreuses et plus agressives. Certaines esp\u00e8ces disparaissent temporairement. L'\u00e9quilibre se r\u00e9tablit \u00e0 la r\u00e9apparition de l'Apex \u2014 signal narratif visible du co\u00fbt de chaque victoire."}
    ]}
  ],
  expediteurs:[
    {num:"\u00d72",name:"Pr. Wollemi",role:"Chef d'exp\u00e9dition \u2014 redondance de s\u00e9curit\u00e9",type:null,color:"gray",status:"secure",
     imgUrl:`${BASE}/Professeur%20Wollemi.png`,
     desc:"Sp\u00e9cialiste en xenog\u00e9nomique et biologie \u00e9volutive compar\u00e9e. Cherche ce que tout le monde a cess\u00e9 de chercher \u2014 l'origine non-terrestre du g\u00e9nome humain. Sa th\u00e8se sur la Divergence a \u00e9t\u00e9 publi\u00e9e en 2012 et accueillie avec scepticisme poli par la communaut\u00e9 scientifique.",
     objective:"Atteindre le point d'impact originel de la m\u00e9t\u00e9orite de Deoxys, collecter des preuves de la Source X, et prouver que les humains sont le r\u00e9sultat d'une contamination cosmique accidentelle."},
    {num:"\u00d71",name:"\u00c9lia",role:"Doctorante \u00b7 Rivale \u00e9motionnelle",type:null,color:"gray",status:"secure",
     imgUrl:`${BASE}/Assistante%20E%CC%81lia.png`,
     desc:"Doctorante brillante en troisi\u00e8me ann\u00e9e sous la direction de Wollemi. Deux articles publi\u00e9s \u00e0 24 ans. Elle a choisi Wollemi parce qu'elle croyait en sa th\u00e8se avant m\u00eame de le rencontrer.",
     objective:"Valider empiriquement les hypoth\u00e8ses de Wollemi sur le Marqueur X. En attente implicite : recevoir enfin la validation explicite que Wollemi exprime seulement par la confiance, jamais par les mots.",
     arc:"Sa jalousie n'est pas caricaturale \u2014 elle est jalouse de la l\u00e9g\u00e8ret\u00e9 du protagoniste, de son absence de besoin de prouver quelque chose. Son arc : comprendre que la vraie question est ce qu'elle veut, elle, ind\u00e9pendamment de Wollemi.",
     trigger:"La validation qu'on attend d'un seul \u00eatre"},
    {num:"\u00d71",name:"Le Protagoniste",role:"L'homme de terrain",type:null,color:"amber",status:"secure",
     imgUrl:`${BASE}/Protagoniste.png`,
     desc:"Pas de dipl\u00f4me, pas de titre. Ce qu'il sait faire, c'est trouver des Pok\u00e9mon que personne d'autre ne trouve \u2014 et \u00e9tablir avec eux une relation suffisamment stable pour les ramener vivants.",
     objective:"Explorer et cartographier la Pang\u00e9e. Suivre la r\u00e9sonance des \u00c9clats X pour localiser les traces de Deoxys. Rapporter donn\u00e9es, observations et \u00e9chantillons biologiques \u00e0 Wollemi et \u00c9lia."},
    {num:"\u00d71",name:"Dr. Sekine Hana",role:"Biologiste / M\u00e9decin",type:"Poison",color:"poison",status:"recover",
     imgUrl:`${BASE}/Dr.%20Sekine%20Hana.png`,
     desc:"Biologiste sp\u00e9cialis\u00e9e en biologie primitive et biochimie environnementale, \u00e9galement m\u00e9decin attitr\u00e9e de l'exp\u00e9dition. Son type Poison refl\u00e8te sa sp\u00e9cialit\u00e9 : les organismes primitifs, toxiques, chimiquement complexes \u2014 la biologie comme force qui colonise tout espace disponible sans se soucier des limites. Brillante et instable face aux opportunit\u00e9s trop grandes.",
     objective:"Documentation biologique des \u00e9cosyst\u00e8mes primitifs de la Pang\u00e9e. Soins m\u00e9dicaux de l'\u00e9quipe.",
     arc:"Face aux \u00e9cosyst\u00e8mes primitifs intacts \u2014 des esp\u00e8ces \u00e9teintes depuis 200 millions d'ann\u00e9es \u2014 elle perd tout sens \u00e9thique et des priorit\u00e9s. Commence \u00e0 pr\u00e9lever des \u00e9chantillons sans autorisation, s'isole du groupe pour des observations non planifi\u00e9es. Refuse d'abandonner un site lors d'une alerte de s\u00e9curit\u00e9.",
     trigger:"Incapacit\u00e9 \u00e0 hi\u00e9rarchiser face \u00e0 l'unique"},
    {num:"\u00d71",name:"Cdt. Oreste Vael",role:"Militaire \u2014 agenda cach\u00e9",type:"Acier",color:"steel",status:"recover",
     imgUrl:`${BASE}/Commandant%20Oreste%20Vael.png`,
     desc:"D\u00e9l\u00e9gu\u00e9 officiellement pour assurer la s\u00e9curit\u00e9 de l'exp\u00e9dition. Calme, d\u00e9cisif, techniquement comp\u00e9tent dans des environnements hostiles.",
     objective:"Officiel : s\u00e9curit\u00e9 de l'exp\u00e9dition. R\u00e9el : \u00e9valuer les applications strat\u00e9giques de la Fissure et de l'\u00e9nergie de Deoxys pour une agence gouvernementale non mentionn\u00e9e dans les accr\u00e9ditations.",
     arc:"Sa cr\u00e9dibilit\u00e9 est r\u00e9elle, ses objectifs dissimul\u00e9s derri\u00e8re elle. Commence \u00e0 prendre des d\u00e9cisions unilat\u00e9rales au nom de la s\u00e9curit\u00e9 collective \u2014 certaines servent le groupe, d'autres servent ses ordres. Quand confront\u00e9, il explique \u2014 et son explication est presque convaincante.",
     trigger:"La loyaut\u00e9 a plusieurs ma\u00eetres"},
    {num:"\u00d71",name:"Mira Solano",role:"Journaliste / Attach\u00e9e",type:"Normal",color:"gray",status:"recover",
     imgUrl:`${BASE}/Mira%20Solano.png`,
     desc:"Officiellement envoy\u00e9e par un gouvernement r\u00e9gional pour documenter l'exp\u00e9dition. En r\u00e9alit\u00e9 sous contrat exclusif avec un grand r\u00e9seau m\u00e9diatique.",
     objective:"Officiel : archivage public de l'exp\u00e9dition. R\u00e9el : livrer toutes les donn\u00e9es \u2014 analyses, images, d\u00e9couvertes biologiques, observations sur Deoxys \u2014 \u00e0 son r\u00e9seau avant toute publication scientifique.",
     arc:"Copie m\u00e9thodiquement toutes les donn\u00e9es depuis le premier jour. Quand d\u00e9couverte, elle ne fuit pas \u2014 elle n\u00e9gocie, et instille des demi-v\u00e9rit\u00e9s dans le groupe pour que sa propre trahison disparaisse dans le bruit g\u00e9n\u00e9ral.",
     trigger:"Le journalisme comme pr\u00e9dation"},
    {num:"\u00d71",name:"Theo Marrant",role:"Logicien \u2014 22 ans",type:"\u00c9lectrik",color:"amber",status:"recover",
     imgUrl:`${BASE}/Theo%20Marrant.png`,
     desc:"22 ans. Co-auteur anonyme des mod\u00e8les math\u00e9matiques qui ont permis \u00e0 Wollemi de calculer la localisation de la Fissure. A construit les \u00e9quations en 6 semaines seul dans une chambre d'h\u00f4tel \u00e0 Gen\u00e8ve.",
     objective:"Valider sur le terrain les mod\u00e8les de pr\u00e9diction du comportement de Deoxys. Traiter la Pang\u00e9e comme un environnement de donn\u00e9es.",
     arc:"Une erreur de calcul \u2014 une variable qu'il a sous-\u00e9valu\u00e9e parce qu'elle n'\u00e9tait pas quantifiable, relevant du comportement \u00e9motionnel de Deoxys \u2014 met directement en danger un membre du groupe. Il ne sait pas comment exister dans un monde o\u00f9 ses erreurs ont des cons\u00e9quences physiques.",
     trigger:"L'effondrement de la grille de lecture"},
    {num:"\u00d71",name:"S\u0153ur In\u00eas Carvalho",role:"Th\u00e9ologienne",type:"F\u00e9e",color:"pink",status:"recover",
     imgUrl:`${BASE}/S%C5%93ur%20Ine%CC%82s%20Carvalho.png`,
     desc:"Repr\u00e9sentante d'une institution religieuse majeure. Femme de fort caract\u00e8re, directe, dr\u00f4le, d\u00e9brouillarde, rod\u00e9e au terrain par des ann\u00e9es de missions humanitaires.",
     objective:"Caution \u00e9thique et politique de l'exp\u00e9dition. Garantir qu'on ne 'joue pas \u00e0 Arceus'. R\u00e9sister avec des faits et des questions, pas avec de l'obstruction.",
     arc:"Une crise de foi personnelle et silencieuse \u2014 ce qu'elle voit de ses propres yeux confirme des \u00e9l\u00e9ments de la th\u00e8se de Wollemi qu'elle avait r\u00e9fut\u00e9s avec des arguments th\u00e9ologiques solides. Elle ne cesse pas de croire. Mais ce en quoi elle croit se transforme sous ses pieds. Refuse de rendre son \u00c9clat parce qu'elle n'est pas encore pr\u00eate \u00e0 rentrer.",
     trigger:"La foi qui mue, pas qui c\u00e8de"},
    {num:"\u00d71",name:"Riku Ashida",role:"Ancien Champion \u2014 ami de Wollemi",type:"Combat",color:"coral",status:"recover",
     imgUrl:`${BASE}/Riku%20Ashida.png`,
     desc:"Ancien finaliste de plusieurs Ligues majeures, ancien yakuza repenti. Ami de longue date de Wollemi depuis l'universit\u00e9. \u00c0 la retraite depuis plusieurs ann\u00e9es.",
     objective:"S\u00e9curit\u00e9 de combat et expertise dresseur dans un environnement inconnu. \u00catre l\u00e0 si \u00e7a tourne mal.",
     arc:"Sa vision du dressage \u2014 fond\u00e9e sur la ma\u00eetrise technique \u2014 entre en friction avec l'approche du protagoniste. Dans la Pang\u00e9e, les r\u00e8gles du dressage classique ne fonctionnent pas. Puis, face \u00e0 Deoxys, une vieille ambition qu'il croyait morte se rallume : capturer l'incapturable. Prouver que le titre de Ma\u00eetre lui avait toujours appartenu.",
     trigger:"L'ambition que l'on croyait morte"},
    {num:"\u00d71",name:"Caspian Shore",role:"Milliardaire \u2014 financement",type:"Dragon",color:"teal",status:"recover",
     imgUrl:`${BASE}/Caspian%20Shore.png`,
     desc:"58 ans. Fortune construite dans les technologies d'exploration g\u00e9ophysique. A financ\u00e9 l'acquisition des \u00c9clats manquants, le recrutement de l'\u00e9quipe et la construction du dispositif d'activation.",
     objective:"Officiel : financement et logistique. R\u00e9el : \u00eatre l\u00e0 pour voir. Et peut-\u00eatre poss\u00e9der.",
     arc:"A pass\u00e9 sa vie \u00e0 poss\u00e9der des choses uniques. La Pang\u00e9e est remplie de choses uniques. Et Deoxys est la chose la plus unique que quiconque ait jamais approch\u00e9e. L'id\u00e9e de le capturer germe lentement, sans se formuler \u2014 elle existe juste, dans ses d\u00e9cisions et ses d\u00e9placements.",
     trigger:"Poss\u00e9der comme r\u00e9flexe identitaire"},
    {num:"\u00d71",name:"Arjun Vasi",role:"Artiste / Documentariste",type:"T\u00e9n\u00e8bre",color:"dark",status:"recover",
     imgUrl:`${BASE}/Arjun%20Vasi.png`,
     desc:"Peintre, \u00e9crivain, philosophe selon les jours. Invit\u00e9 personnellement par Shore contre l'avis de Wollemi. Son art est r\u00e9aliste et n'a pas peur de montrer la cruaut\u00e9 du monde \u2014 c'est pr\u00e9cis\u00e9ment pour \u00e7a qu'il est l\u00e0. Le type T\u00e9n\u00e8bre ne dit pas le mal : il dit l'absence de filtre, l'instinct de regarder ce que les autres pr\u00e9f\u00e8rent ne pas voir.",
     objective:"Documenter ce que \u00e7a fait d'\u00eatre l\u00e0 \u2014 pas ce que \u00e7a signifie. Ses carnets accumulent des croquis naturalistes d'une pr\u00e9cision remarquable et des pages de r\u00e9flexions sur ce que c'est qu'\u00eatre humain dans un monde qui existait avant l'humanit\u00e9.",
     arc:"Sa dissolution est progressive. Il commence \u00e0 dispara\u00eetre seul dans la Pang\u00e9e pour des p\u00e9riodes de plus en plus longues \u2014 non pas pour accomplir quelque chose, mais parce que ce qu'il voit le consume d'une mani\u00e8re qu'il n'essaie pas de contenir. Pour le retrouver, il faut d'abord comprendre ce qu'il cherchait.",
     trigger:"L'observateur consum\u00e9 par ce qu'il observe"}
  ]
}

if(!window.storage){
  const _s={}
  window.storage={
    get:async k=>{const v=_s[k];return v?{key:k,value:v}:null},
    set:async(k,v)=>(_s[k]=v,{key:k,value:v}),
    delete:async k=>(delete _s[k],{key:k,deleted:true}),
    list:async p=>({keys:Object.keys(_s).filter(k=>!p||k.startsWith(p))})
  }
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
