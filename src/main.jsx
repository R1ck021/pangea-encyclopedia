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

const Lead=({text})=><p style={{fontSize:15,lineHeight:1.8,color:m.tx,margin:'0 0 18px',paddingBottom:16,borderBottom:`1px solid ${m.bd}`}}><Txt t={text}/></p>
const Para=({text})=><p style={{fontSize:14,lineHeight:1.75,color:m.txS,margin:'0 0 12px'}}><Txt t={text}/></p>
const H2=({text})=><h3 style={{fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.1em',margin:'20px 0 10px',padding:0}}>{text}</h3>
const Divider=()=><div style={{height:1,background:m.bd,margin:'18px 0'}}/>
const Callout=({color,text})=>{
  const c=D[color]||D.gray
  return <div style={{background:c.l,borderLeft:`2.5px solid ${c.m}`,borderRadius:'0 8px 8px 0',padding:'11px 15px',marginBottom:14}}>
    <p style={{fontSize:13.5,lineHeight:1.7,color:c.d,margin:0}}><Txt t={text}/></p>
  </div>
}
const Quote=({text,author})=><div style={{background:m.bgS,borderRadius:10,border:`1px solid ${m.bd}`,padding:'14px 18px',marginBottom:14}}>
  <p style={{fontSize:13.5,lineHeight:1.75,color:m.txS,fontStyle:'italic',margin:'0 0 8px'}}>&#34;{text}&#34;</p>
  {author&&<div style={{fontSize:11,color:m.txM,textAlign:'right'}}>&mdash; {author}</div>}
</div>
const Mechanic=({title,icon,text,chain})=><div style={{display:'flex',gap:12,marginBottom:14}}>
  <span style={{fontSize:13,width:18,flexShrink:0,color:m.txM,paddingTop:2}}>{icon||'\u25c8'}</span>
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

const InfoRow=({items})=><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:7,marginBottom:14}}>
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
        {it.imgUrl&&<div style={{marginBottom:8,borderRadius:8,overflow:'hidden',background:m.bgM,display:'flex',justifyContent:'center',padding:'8px 0'}}>
          <img src={it.imgUrl} alt={it.name} style={{height:80,width:'auto',objectFit:'contain',filter:'drop-shadow(0 1px 4px rgba(0,0,0,0.12))'}}/>
        </div>}
        <div style={{fontSize:13,fontWeight:600,color:m.tx,marginBottom:2}}>{it.name}</div>
        {it.sub&&<div style={{fontSize:11,color:m.txM,marginBottom:6}}>{it.sub}</div>}
        {it.tag&&tc&&<span style={{display:'inline-block',fontSize:10,padding:'1px 7px',borderRadius:99,marginBottom:6,background:tc.l,color:tc.d,border:`1px solid ${tc.b}`}}>{it.tag}</span>}
        <p style={{fontSize:13,lineHeight:1.55,color:m.txS,margin:0}}><Txt t={it.desc}/></p>
      </div>
    })}
  </div>
}

function LegendaryGrid({items}){
  return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
    {items.map((it,i)=>{
      const c=D[it.color]||D.gray
      return <div key={i} style={{background:m.bgS,border:`1px solid ${m.bd}`,borderTop:`2.5px solid ${c.m}`,borderRadius:10,overflow:'hidden'}}>
        {it.imgUrl&&<div style={{background:c.l,padding:'16px 0 0',display:'flex',justifyContent:'center',alignItems:'flex-end',height:130}}>
          <img src={it.imgUrl} alt={it.name} style={{height:116,width:'auto',objectFit:'contain',filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.15))'}}/>
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
      {['Biome','M\u00e9t\u00e9o','Types Apex','Signal'].map((h,i)=><div key={i} style={{padding:'7px 12px',fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.07em'}}>{h}</div>)}
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
    {rang:'Sauvage',signal:'Aucun',entourage:'Meute ou seul',combat:'Temps r\u00e9el libre',capture:'Oui, directement',loot:'Objets courants',rc:'gray'},
    {rang:'Alpha',signal:'Yeux rouges',entourage:'Cong\u00e9n\u00e8res famille',combat:'Horde \u2192 boss seul',capture:'Oui, difficile',loot:'Objets rares',rc:'coral'},
    {rang:'Apex',signal:'Marques blanches',entourage:'\u00c9quipe vari\u00e9e biome',combat:'Raid 3 phases',capture:'Non / Oui post-raid',loot:'Mat\u00e9riaux exclusifs',rc:'amber'},
  ]
  const cols=['Rang','Signal visuel','Entourage','Format combat','Capturable','Loot']
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

function TypeTableCosmique(){
  const rows=[
    {type:'Cosmique',fort:['Psy','Dragon','F\u00e9e'],faible:['Acier','Aucun connu'],immune:['Normal']},
  ]
  return <div style={{border:`1px solid ${m.bd}`,borderRadius:10,overflow:'hidden',marginBottom:14}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',background:m.bgM,borderBottom:`1px solid ${m.bd}`}}>
      {['Type','Efficace contre','Peu efficace contre','Immunis\u00e9'].map((h,i)=><div key={i} style={{padding:'7px 12px',fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.07em'}}>{h}</div>)}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',background:m.bg}}>
      <div style={{padding:'12px 12px',display:'flex',alignItems:'center'}}>
        <Tag color="purple" label="Cosmique"/>
      </div>
      <div style={{padding:'12px 12px',display:'flex',alignItems:'center',gap:4,flexWrap:'wrap'}}>
        {['Psy','Dragon','F\u00e9e'].map((t,i)=><Tag key={i} color={t==='Psy'?'purple':t==='Dragon'?'teal':'pink'} label={t} sm/>)}
      </div>
      <div style={{padding:'12px 12px',display:'flex',alignItems:'center',gap:4,flexWrap:'wrap'}}>
        {['Acier','Poison'].map((t,i)=><Tag key={i} color={t==='Acier'?'steel':'poison'} label={t} sm/>)}
      </div>
      <div style={{padding:'12px 12px',fontSize:12,color:m.txS,display:'flex',alignItems:'center',fontStyle:'italic'}}>Type Normal</div>
    </div>
    <div style={{padding:'8px 12px',background:m.bgS,borderTop:`1px solid ${m.bd}`,fontSize:11,color:m.txM,fontStyle:'italic'}}>
      Table provisoire \u2014 le type Cosmique n'ob\u00e9it \u00e0 aucune r\u00e8gle d'interaction terrestres connues. Ces correspondances sont des estimations lore-coh\u00e9rentes.
    </div>
  </div>
}

function StarterBlock({data}){
  const [tab,setTab]=useState('stats')
  const c=D[data.color]||D.gray
  return <div style={{border:`1px solid ${c.b}`,borderRadius:12,overflow:'hidden',marginBottom:22}}>
    <div style={{background:c.l,borderBottom:`1px solid ${c.b}`,padding:'0',display:'flex',alignItems:'stretch'}}>
      {data.imgUrl&&<div style={{width:140,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',padding:'12px 0',background:c.l}}>
        <img src={data.imgUrl} alt={data.name} style={{height:120,width:'auto',objectFit:'contain',filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.15))'}}/>
      </div>}
      <div style={{flex:1,padding:'14px 18px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <div style={{fontSize:16,fontWeight:700,color:c.d,lineHeight:1.2}}>{data.name}</div>
        <div style={{fontSize:11,color:c.m,fontStyle:'italic',marginTop:2,marginBottom:7}}>{data.quote}</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>{data.types.map(([tc,tl],i)=><Tag key={i} color={tc} label={tl}/>)}</div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:10,color:c.m,textTransform:'uppercase',letterSpacing:'0.06em'}}>BST</div>
            <div style={{fontSize:22,fontWeight:700,color:c.d}}>{data.totalBST}</div>
          </div>
        </div>
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

function Avatar({imgUrl,initials,color,size=72}){
  const c=D[color]||D.gray
  const [err,setErr]=useState(false)
  if(imgUrl&&!err) return <img src={imgUrl} alt={initials} onError={()=>setErr(true)} style={{width:size,height:size,borderRadius:'50%',objectFit:'cover',objectPosition:'top center',border:`2px solid ${c.b}`,flexShrink:0}}/>
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
  const [open,setOpen]=useState(false)
  const c=D[e.color]||D.gray
  const initials=e.name.split(' ').map(w=>w[0]).join('').slice(0,2)
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

function PhaseBlock({num,title,color,children}){
  const c=D[color]||D.amber
  return <div style={{border:`1px solid ${c.b}`,borderLeft:`3px solid ${c.m}`,borderRadius:'0 10px 10px 0',padding:'14px 18px',marginBottom:14,background:c.l}}>
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
      <span style={{fontSize:11,fontWeight:700,padding:'2px 9px',borderRadius:99,background:c.m,color:'white',letterSpacing:'0.05em'}}>Phase {num}</span>
      <span style={{fontSize:13,fontWeight:600,color:c.d}}>{title}</span>
    </div>
    <div style={{fontSize:13.5,lineHeight:1.65,color:c.d}}>{children}</div>
  </div>
}

function renderBlock(block,i,data){
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
    case 'type-table-cosmique': return <TypeTableCosmique key={i}/>
    case 'phase-block': return <PhaseBlock key={i} num={block.num} title={block.title} color={block.color}><Txt t={block.text}/></PhaseBlock>
    default: return null
  }
}

function App(){
  const [data,setData]=useState(null)
  const [sectionId,setSectionId]=useState('monde')
  const [loading,setLoading]=useState(true)
  const [menuOpen,setMenuOpen]=useState(false)
  const [isMobile,setIsMobile]=useState(false)
  const mainRef=useRef(null)

  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<640)
    check(); window.addEventListener('resize',check)
    return ()=>window.removeEventListener('resize',check)
  },[])

  useEffect(()=>{
    async function load(){
      try{
        const r=await window.storage.get('pangea-enc-v16')
        setData(r&&r.value?JSON.parse(r.value):DEFAULT_DATA)
      }catch{setData(DEFAULT_DATA)}
      setLoading(false)
    }
    load()
  },[])

  useEffect(()=>{if(mainRef.current) mainRef.current.scrollTop=0},[sectionId])

  if(loading) return <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'#FFFFFF'}}><div style={{fontSize:13,color:'#A8A29E'}}>Chargement\u2026</div></div>

  const groups=[...new Set(data.sections.map(s=>s.group))]
  const section=data.sections.find(s=>s.id===sectionId)||data.sections[0]
  const sc=D[section.badgeColor]||D.gray
  const sk=D[section.color]||D.gray
  const idx=data.sections.findIndex(s=>s.id===sectionId)
  const prev=data.sections[idx-1],next=data.sections[idx+1]

  const Nav=()=><nav style={{flex:1,overflowY:'auto',padding:'6px 0'}}>
    {groups.map(g=><div key={g}>
      <div style={{padding:'10px 14px 3px',fontSize:9.5,fontWeight:700,color:m.txM,textTransform:'uppercase',letterSpacing:'0.1em'}}>{g}</div>
      {data.sections.filter(s=>s.group===g).map(s=>{
        const sc2=D[s.color]||D.gray,active=s.id===sectionId
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
    <div style={{width:210,flexShrink:0,borderRight:`1px solid ${m.bd}`,background:m.bgS,display:'flex',flexDirection:'column',height:'100%'}}>
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

const BASE='https://raw.githubusercontent.com/R1ck021/pangea-encyclopedia/main/public'

const DEFAULT_DATA={
  meta:{title:"Pok\u00e9mon Legends : Pang\u00e9e",subtitle:"Encyclop\u00e9die de conception",version:"v6.0",lastUpdated:"2026-05-17"},
  sections:[
    // ===== R\u00c9GION =====
    {id:"monde",label:"La R\u00e9gion",group:"R\u00e9gion",color:"amber",badge:"Cadre temporel",badgeColor:"amber",title:"Pang\u00e9e & Panthalassa",meta:"Plusieurs centaines de millions d'ann\u00e9es avant notre \u00e8re",summary:"Le continent unique et l'oc\u00e9an primordial \u2014 cadre g\u00e9ographique et temporel du jeu.",content:[
      {type:"lead",text:"Il y a des centaines de millions d'ann\u00e9es, existait **un seul continent** et **un seul oc\u00e9an**. La Pang\u00e9e \u2014 terre primordiale brute et hostile \u2014 et Panthalassa, l'oc\u00e9an infini qui l'enveloppait de toutes parts."},
      {type:"para",text:"Ce n'\u00e9tait pas un monde accueillant. Les volcans redessinaient les c\u00f4tes jour apr\u00e8s jour. Les temp\u00eates de Panthalassa duraient des ann\u00e9es enti\u00e8res. La fronti\u00e8re entre la terre et la mer n'\u00e9tait pas une ligne \u2014 c'\u00e9tait une *zone de tension permanente entre deux forces qui refusaient de coexister*. Pas de saisons stables, pas de c\u00f4tes fixes : chaque s\u00e9isme de Groudon redessine la carte, chaque temp\u00eate de Kyogre avale des kilom\u00e8tres de littoral."},
      {type:"para",text:"C'est dans ce chaos que la vie a trouv\u00e9 son chemin. Et c'est dans ce chaos qu'une chose venue de beaucoup plus loin que la mer ou la montagne s'est \u00e9cras\u00e9e sur la plan\u00e8te pour la premi\u00e8re fois."},
      {type:"divider"},
      {type:"h2",text:"Les trois territoires"},
      {type:"cards3",items:[
        {name:"Pang\u00e9e",icon:"\ud83c\udf0b",sub:"Le continent unique",desc:"Terre brute, volcanique, en formation permanente. Le c\u0153ur br\u00fble encore \u2014 on le sent sous les pieds dans les zones centrales. Groudon en est l'\u00e2me consciente. Chaque \u00e9ruption dit quelque chose de son humeur."},
        {name:"Panthalassa",icon:"\ud83c\udf0a",sub:"L'oc\u00e9an infini",desc:"Vaste et insondable. Ses abysses abritent des formes de vie que la lumi\u00e8re n'a jamais atteintes. Les temp\u00eates c\u00f4ti\u00e8res ne sont pas des \u00e9v\u00e9nements \u2014 c'est l'\u00e9tat normal. Kyogre en est l'expression vivante."},
        {name:"Stratosph\u00e8re",icon:"\u26a1",sub:"L'espace entre les deux",desc:"Territoire de Rayquaza, arbitre des deux forces. Sa pr\u00e9sence se lit dans les aurores qui d\u00e9chirent parfois le ciel nocturne. Il est le premier \u00e0 d\u00e9tecter les anomalies venues du cosmos."}
      ]},
      {type:"divider"},
      {type:"callout",color:"amber",text:"L'opposition entre Groudon et Kyogre n'est pas une guerre. C'est une tension fondamentale qui *d\u00e9finit la plan\u00e8te*. Depuis des \u00e9ons, un \u00e9quilibre pr\u00e9caire \u2014 hostile mais stable \u2014 maintient la vie possible. Le jeu commence au moment o\u00f9 cet \u00e9quilibre est rompu par l'arriv\u00e9e de Deoxys."},
      {type:"mechanic",title:"Un monde sans cartes",icon:"\u25c8",text:"La carte du joueur est **incomplète et partiellement dynamique**. Les zones volcaniques se referment, les c\u00f4tes bougent. Explorer, c'est documenter un monde en formation permanente. Chaque donn\u00e9e terrain rapport\u00e9e \u00e0 Wollemi fait avancer la carte collective de l'exp\u00e9dition."}
    ]},
    {id:"biomes",label:"Les Biomes",group:"R\u00e9gion",color:"teal",badge:"Exploration",badgeColor:"teal",title:"Les Biomes de la Pang\u00e9e",meta:"Cinq zones climatiques \u00b7 M\u00e9t\u00e9os permanentes \u00b7 Faunes distinctes",summary:"Chaque biome est un monde en soi \u2014 m\u00e9t\u00e9o propre, faune propre, un Apex au sommet de sa cha\u00eene alimentaire.",content:[
      {type:"lead",text:"La Pang\u00e9e n'est pas un monde uniforme. Cinq zones climatiques majeures se sont form\u00e9es sous la tension permanente entre Groudon et Kyogre \u2014 chacune avec ses propres conditions m\u00e9t\u00e9orologiques, sa faune, et une atmosph\u00e8re sensorielle radicalement diff\u00e9rente."},
      {type:"callout",color:"teal",text:"La m\u00e9t\u00e9o de chaque biome est *permanente et active*. Quand Primo-Groudon ou Primo-Kyogre se manifestent, leurs talents **Terre Finale** et **Mer Primaire** \u00e9crasent toutes les m\u00e9t\u00e9os locales. M\u00e9ga-Rayquaza et son **Souffle Delta** les supprime toutes sans exception."},
      {type:"divider"},
      {type:"biome-table",items:[
        {biome:"Zone Volcanique",zone:"C\u0153ur de la Pang\u00e9e",meteo:"\u2600\ufe0f Z\u00e9nith",types:[["coral","Feu"],["green","Plante"]],signal:"Sol fissu\u00e9, chaleur irradiante, fum\u00e9e permanente",color:"coral"},
        {biome:"Zone C\u00f4ti\u00e8re",zone:"Fronti\u00e8re Panthalassa",meteo:"\ud83c\udf27\ufe0f Pluie battante",types:[["blue","Eau"],["gray","Vol"]],signal:"Embruns, vents violents, vagues sur les rochers",color:"blue"},
        {biome:"Zone Aride",zone:"Int\u00e9rieur continental",meteo:"\ud83c\udf2a\ufe0f Temp\u00eate de sable",types:[["gray","Roche"],["amber","Sol"]],signal:"Cendres en suspension, silence \u00e9crasant",color:"amber"},
        {biome:"Zone Glaciaire",zone:"Hauts plateaux d'altitude",meteo:"\u2744\ufe0f Gr\u00eale",types:[["ice","Glace"],["purple","Spectre"]],signal:"Brume givr\u00e9e, silence total, sol translucide",color:"ice"},
        {biome:"Zone Cosmique",zone:"Site d'impact m\u00e9t\u00e9orite",meteo:"\u2b50 Radiations X",types:[["purple","Cosmique"],["purple","Psy"]],signal:"Aurores au sol, perturbations magn\u00e9tiques",color:"purple"}
      ]},
      {type:"divider"},
      {type:"h2",text:"Textures sensorielles \u2014 ce que le joueur ressent"},
      {type:"cards3",items:[
        {name:"Zone Volcanique",icon:"\ud83c\udf0b",desc:"L'air br\u00fble avant m\u00eame qu'on touche quoi que ce soit. Les flammes coulent vers le bas. Aucun vent \u2014 tout monte. Le silence entre deux \u00e9ruptions est le plus \u00e9trange."},
        {name:"Zone C\u00f4ti\u00e8re",icon:"\ud83c\udf0a",desc:"On ne distingue pas o\u00f9 finit la mer et o\u00f9 commence le ciel. Les \u00e9clairs tombent dans l'eau. Les rochers sont polis depuis des millions d'ann\u00e9es."},
        {name:"Zone Aride",icon:"\ud83c\udf2a\ufe0f",desc:"Les cendres flottent comme de la neige. Visibilit\u00e9 \u00e0 dix m\u00e8tres. Des formations rocheuses surgissent soudain de la brume. La chaleur est s\u00e8che \u2014 pas de feu, juste la d\u00e9shydratation lente."},
        {name:"Zone Glaciaire",icon:"\u2744\ufe0f",desc:"Le silence d'ici est actif. On entend la glace se contracter la nuit. Les Pok\u00e9mon qu'on croise semblent translucides, comme s'ils appartenaient \u00e0 un autre niveau de r\u00e9alit\u00e9."},
        {name:"Zone Cosmique",icon:"\u2b50",desc:"Les boussoles ne fonctionnent plus. Les \u00c9clats X vibrent. L'herbe a une couleur l\u00e9g\u00e8rement violac\u00e9e. Certains Pok\u00e9mon ici ne r\u00e9agissent pas comme les autres. Ils regardent."}
      ]},
      {type:"divider"},
      {type:"mechanic",title:"Zone Cosmique \u2014 acc\u00e8s progressif",icon:"\u2b50",text:"Non accessible d\u00e8s le d\u00e9but. Se r\u00e9v\u00e8le \u00e0 mesure que le joueur suit les traces de Deoxys \u00e0 travers les autres biomes. Les \u00c9clats X portent le joueur vers elle \u2014 leur r\u00e9sonance s'intensifie \u00e0 mesure qu'il s'approche du point d'impact originel. C'est la seule zone du jeu o\u00f9 le type Cosmique existe \u00e0 l'\u00e9tat naturel."}
    ]},
    // ===== POK\u00c9MON =====
    {id:"cosmogonie",label:"L\u00e9gendaires",group:"Pok\u00e9mon",color:"coral",badge:"L\u00e9gendaires",badgeColor:"coral",title:"L\u00e9gendaires & Fabuleux",meta:"Les six entit\u00e9s qui d\u00e9finissent le monde primordial",summary:"Groudon, Kyogre, Rayquaza, Deoxys, Arceus, Regigigas \u2014 nature, r\u00f4les narratifs et relations avec l'\u00e9quilibre du monde.",content:[
      {type:"lead",text:"Six entit\u00e9s structurent l'\u00e9quilibre du monde. Trois sont n\u00e9es de la plan\u00e8te elle-m\u00eame. Une vient du vide interstellaire. Une observe de partout et de nulle part. Une a \u00e9t\u00e9 agglom\u00e9r\u00e9e par une intention trop grande pour rester sans forme."},
      {type:"h2",text:"Le trio fondateur \u2014 Formes Primo et M\u00e9ga"},
      {type:"legendary-grid",items:[
        {name:"Primo-Groudon",imgUrl:`${BASE}/Primo-Groudon.png`,sub:"L'\u00c2me de la Pang\u00e9e",types:[["coral","Feu"],["amber","Sol"]],color:"coral",text:"Groudon n'est pas n\u00e9 de la Pang\u00e9e. Il **est** la Pang\u00e9e. Dans sa Forme Primo, ses flancs sont couverts de fissures de lave, ses yeux comme deux crat\u00e8res actifs. Il est un **b\u00e2tisseur inconscient** \u2014 il cr\u00e9e la terre non par intention, mais parce que c'est sa nature. Talent **Terre Finale** : impose un Soleil Intense absolu qui \u00e9crase toutes les m\u00e9t\u00e9os locales."},
        {name:"Primo-Kyogre",imgUrl:`${BASE}/Primo-Kyogre.png`,sub:"L'\u00c2me de Panthalassa",types:[["blue","Eau"]],color:"blue",text:"Kyogre est Panthalassa. Ses mouvements sont les courants oc\u00e9aniques, ses humeurs les temp\u00eates. Dans sa Forme Primo, ses motifs lumineux projettent des aurores sous-marines visibles depuis les c\u00f4tes la nuit. Il cherche \u00e0 *l'engloutir par nature*, comme l'eau qui remplit tout espace vide. Talent **Mer Primaire** : impose une Pluie Battante absolue."},
        {name:"M\u00e9ga-Rayquaza",imgUrl:`${BASE}/Mega-Rayquaza.png`,sub:"L'Arbitre des Cieux",types:[["green","Dragon"],["gray","Vol"]],color:"green",text:"Rayquaza vit dans la stratosph\u00e8re, au-dessus du conflit. \u00c0 cette \u00e9poque, il est en forme M\u00e9ga permanente, l'\u00e9nergie X saturant son mikado organ en continu. Son combat avec la m\u00e9t\u00e9orite l'a marqu\u00e9 biologiquement \u2014 l'arbitre est lui-m\u00eame modifi\u00e9 par ce qu'il arbitre. Il n'est plus neutre. Talent **Souffle Delta** : *supprime toutes les m\u00e9t\u00e9os* sans exception."},
        {name:"Deoxys \u2b50",imgUrl:`${BASE}/Deoxys.png`,sub:"L'Intrus Cosmique \u2014 L\u00e9gendaire central",types:[["purple","Cosmique"]],color:"purple",text:"Virus interstellaire projet\u00e9 vers la plan\u00e8te par un \u00e9v\u00e9nement inconnu. Combat Rayquaza dans la stratosph\u00e8re, survit mutant, s'\u00e9crase sur la Pang\u00e9e. Ses quatre formes sont des \u00e9tats d'adaptation \u00e0 un monde qu'il ne comprend pas encore. Il n'est pas mauvais \u2014 il est *radicalement \u00e9tranger*. \u00c0 l'\u00e9poque moderne il ne conserve que le type Psy."}
      ]},
      {type:"callout",color:"coral",text:"Depuis des \u00e9ons, le m\u00eame sch\u00e9ma se r\u00e9p\u00e8te : tension \u2192 Formes Primo \u2192 Rayquaza arbitre \u2192 \u00e9quilibre revient. **Ce syst\u00e8me est brutal mais stable \u2014 il a toujours suffi.** Jusqu'\u00e0 l'arriv\u00e9e de Deoxys."},
      {type:"mechanic",title:"Ce que Deoxys change \u2014 trois variables simultan\u00e9es",icon:"\u2b50",text:"**Rayquaza est lui-m\u00eame alt\u00e9r\u00e9** par l'\u00e9nergie X \u2014 l'arbitre n'est plus neutre. **L'\u00e9nergie X introduit une fr\u00e9quence** que le syst\u00e8me plan\u00e9taire ne peut pas absorber. **La vie sur la plan\u00e8te est expos\u00e9e** \u00e0 une accumulation potentiellement irr\u00e9versible. Aucun cycle pr\u00e9c\u00e9dent n'a connu ces trois variables ensemble.",chain:["Tension habituelle","Formes Primo s'affrontent","Rayquaza arbitre","\u2192 Cette fois : impossible"]},
      {type:"divider"},
      {type:"h2",text:"Arceus & Regigigas \u2014 la r\u00e9ponse plan\u00e9taire"},
      {type:"legendary-grid",items:[
        {name:"Arceus",imgUrl:`${BASE}/Arceus.png`,sub:"Pr\u00e9sence causale invisible",types:[["gray","Normal"]],color:"amber",text:"Arceus n'appara\u00eet jamais directement. Il est une **pr\u00e9sence d\u00e9duite, pas observ\u00e9e**. Son intervention n'est pas d\u00e9clench\u00e9e par Deoxys comme menace imm\u00e9diate \u2014 mais parce que trois variables se cumulent pour la premi\u00e8re fois et rendent tout cycle futur potentiellement irr\u00e9versible. Sa r\u00e9ponse : *une mise \u00e0 jour du syst\u00e8me*."},
        {name:"Regigigas",imgUrl:`${BASE}/Regigigas.png`,sub:"Le Golem Cosmique \u2014 r\u00e9ponse plan\u00e9taire",types:[["gray","Normal"]],color:"gray",text:"Regigigas a une **cause** (la volont\u00e9 d'Arceus) et un **mat\u00e9riau** (la Pang\u00e9e). Agglom\u00e9r\u00e9 par une intention trop grande pour rester sans forme. Sa mission : briser la Pang\u00e9e, disperser les \u00c9clats X dans des strates g\u00e9ologiques distinctes. Puis dormance l\u00e0 o\u00f9 la Pang\u00e9e \u00e9tait la plus dense \u2014 ce qui deviendra Sinnoh."}
      ]},
      {type:"divider"},
      {type:"h2",text:"Les quatre formes de Deoxys \u2014 \u00e9tats d'adaptation"},
      {type:"cards4",items:[
        {name:"Forme Normale",imgUrl:`${BASE}/Deoxys.png`,tag:"\u00c9veil",desc:"L'\u00e9tat d'observation. Deoxys tente de comprendre ce monde inconnu. La plus calme, la plus difficile \u00e0 pr\u00e9voir."},
        {name:"Forme Attaque",imgUrl:`${BASE}/Deoxys%20-%20forme%20attaque.png`,tag:"R\u00e9action",desc:"La r\u00e9action d\u00e9fensive face \u00e0 l'agression. Instinct de survie activ\u00e9. Dangereux mais lisible."},
        {name:"Forme D\u00e9fense",imgUrl:`${BASE}/Deoxys%20-%20forme%20d%C3%A9fense.png`,tag:"Repli",desc:"Le repli, la survie. Deoxys se prot\u00e8ge d'un monde hostile. Presque impossible \u00e0 blesser."},
        {name:"Forme Vitesse",imgUrl:`${BASE}/Deoxys%20-%20forme%20vitesse.png`,tag:"Exploration",desc:"La fuite, la cartographie. Deoxys explore ce qu'il ne comprend pas. On ne le voit presque jamais."}
      ]}
    ]},
    {id:"apex",label:"Pok\u00e9mon Apex",group:"Pok\u00e9mon",color:"amber",badge:"Boss de biome",badgeColor:"amber",title:"Les Pok\u00e9mon Apex",meta:"Esp\u00e8ces exclusives \u00b7 Pivots d'\u00e9cosyst\u00e8me \u00b7 Un par biome",summary:"Qui sont les Apex, comment les reconna\u00eetre, et pourquoi leur pr\u00e9sence structure tout l'\u00e9cosyst\u00e8me. Les m\u00e9caniques de combat sont dans la page Raids Apex.",content:[
      {type:"lead",text:"Dans chaque biome de la Pang\u00e9e, au-dessus des meutes et des Alphas, existe une esp\u00e8ce que les Pok\u00e9mon locaux reconnaissent instinctivement comme ant\u00e9rieure \u00e0 eux-m\u00eames. Les **Apex** sont les pivots biologiques autour desquels tout l'\u00e9cosyst\u00e8me s'est construit, sur des centaines de millions d'ann\u00e9es."},
      {type:"callout",color:"amber",text:"Les Pok\u00e9mon Apex sont des **esp\u00e8ces exclusives \u00e0 la Pang\u00e9e** \u2014 aucun descendant connu dans le monde moderne. Elles ont disparu lors de la fragmentation du continent. Les voir, c'est voir quelque chose que personne d'autre n'a jamais vu et ne verra jamais."},
      {type:"divider"},
      {type:"h2",text:"Signal distinctif \u2014 leucisme partiel"},
      {type:"mechanic",title:"Les marques blanches",icon:"\u25c8",text:"Chaque Apex porte des **zones de d\u00e9pigmentation blanche** \u2014 leucisme partiel sur la peau, le pelage, les \u00e9cailles ou les plumes. Ce ph\u00e9nom\u00e8ne existe dans la nature : zones de repousse plus claires apr\u00e8s cicatrices, ou variation g\u00e9n\u00e9tique de lign\u00e9es tr\u00e8s anciennes. Chez les Apex, ces marques fonctionnent comme un **signal social instinctif** pour toute la faune locale \u2014 la zone se vide avant m\u00eame que l'Apex soit visible. Ce n'est pas de la peur apprise. C'est \u00e9volutif."},
      {type:"mechanic",title:"Comportement \u2014 l'indiff\u00e9rence calcul\u00e9e",icon:"\u25ce",text:"Un Apex n'est pas agressif par d\u00e9faut. Il observe d'abord \u2014 plusieurs secondes, parfois plus. Sa menace n'est pas de l'agressivit\u00e9, c'est de l'indiff\u00e9rence calcul\u00e9e. C'est le **silence qui pr\u00e9c\u00e8de** qui dit au joueur qu'un Apex est proche : les Pok\u00e9mon sauvages de la zone disparaissent avant que l'Apex soit visible."},
      {type:"divider"},
      {type:"h2",text:"Les cinq Apex \u2014 biologie et double type"},
      {type:"cards3",items:[
        {name:"Apex Volcanique",icon:"\ud83c\udf0b",sub:"Z\u00e9nith \u00b7 Feu/Plante",desc:"Le seul biome o\u00f9 la chaleur nourrit directement la vie v\u00e9g\u00e9tale. Cet Apex incarne ce paradoxe : destruction et croissance comme une seule force.",tagColor:"coral",tag:"\u00c0 concevoir"},
        {name:"Apex C\u00f4tier",icon:"\ud83c\udf0a",sub:"Pluie battante \u00b7 Eau/Vol",desc:"Ma\u00eetre d'un biome o\u00f9 la fronti\u00e8re entre mer et ciel n'existe presque pas. Aussi \u00e0 l'aise en altitude que dans les courants sous-marins.",tagColor:"blue",tag:"\u00c0 concevoir"},
        {name:"Apex Aride",icon:"\ud83c\udf2a\ufe0f",sub:"Temp\u00eate de sable \u00b7 Roche/Sol",desc:"Seigneur du c\u0153ur sec. Ce qui reste quand tout le reste a disparu. Anc\u00eatre de certaines formes g\u00e9ologiques qui persistent jusqu'\u00e0 l'\u00e9poque moderne.",tagColor:"amber",tag:"\u00c0 concevoir"},
        {name:"Apex Glaciaire",icon:"\u2744\ufe0f",sub:"Gr\u00eale \u00b7 Glace/Spectre",desc:"La pr\u00e9sence la plus insaisissable des cinq. Quelque chose qui existe entre les cat\u00e9gories. Il appara\u00eet et dispara\u00eet comme la brume. On n'est jamais certain de l'avoir vu.",tagColor:"ice",tag:"\u00c0 concevoir"},
        {name:"Apex Cosmique",icon:"\u2b50",sub:"Radiations X \u00b7 Cosmique/Psy",desc:"L'esp\u00e8ce la plus impr\u00e9gn\u00e9e d'\u00e9nergie X. Anc\u00eatre direct des lign\u00e9es porteuses du Marqueur X. Cet Apex a un comportement qu'aucun autre n'a : il observe le joueur en retour.",tagColor:"purple",tag:"\u00c0 concevoir"}
      ]},
      {type:"divider"},
      {type:"mechanic",title:"Impact \u00e9cologique \u2014 le co\u00fbt de la victoire",icon:"\u25c6",text:"Vaincre un Apex d\u00e9s\u00e9quilibre temporairement tout le biome. Proies plus nombreuses et agressives, esp\u00e8ces r\u00e9gulatrices qui disparaissent. L'\u00e9quilibre se r\u00e9tablit \u00e0 la r\u00e9apparition."},
      {type:"mechanic",title:"Loot \u2014 mat\u00e9riaux biologiques exclusifs",icon:"\u25ce",text:"\u00c9caille, plume, griffe \u2014 mat\u00e9riaux impossibles \u00e0 obtenir ailleurs. Rapport\u00e9s \u00e0 Wollemi et \u00c9lia : avancement de la recherche, d\u00e9blocage de dialogues. Conserv\u00e9s : effets passifs dans le biome d'origine."},
      {type:"mechanic",title:"R\u00e9apparition temporis\u00e9e",icon:"\u25c7",text:"Un Apex vaincu revient apr\u00e8s un d\u00e9lai li\u00e9 \u00e0 la progression narrative \u2014 souvent en post-game. **Lors de la r\u00e9apparition, l'Apex est capturable** \u2014 seul, sans phases de raid, m\u00eame set strat\u00e9gique. L'objectif n'est plus de vaincre, mais d'affaiblir sans KO."}
    ]},
    {id:"starters",label:"Starters",group:"Pok\u00e9mon",color:"green",badge:"Starters",badgeColor:"green",title:"Les Starters de Pang\u00e9e",meta:"Les trois Pok\u00e9mon de d\u00e9part propos\u00e9s par le Pr. Wollemi",summary:"Trois formes r\u00e9gionales n\u00e9es de l'\u00e9quilibre entre Groudon et Kyogre \u2014 manifestations vivantes des conditions qui ont rendu la vie possible.",content:[
      {type:"lead",text:"N\u00e9es de l'\u00e9quilibre fragile entre Groudon et Kyogre, ces trois formes r\u00e9gionales sont les *manifestations vivantes* des trois forces qui ont rendu la vie possible sur Pang\u00e9e : la chaleur interne, la v\u00e9g\u00e9tation primordiale, l'inconnu des abysses."},
      {type:"starter-block",data:{name:"Typhlosion de Pang\u00e9e",quote:"La Terre en fusion",color:"coral",imgUrl:`${BASE}/Pangean%20Typhlosion.jpg`,types:[["coral","Feu"],["gray","Roche"]],desc:"N\u00e9 des premi\u00e8res \u00e9ruptions de la Pang\u00e9e, sa fourrure s'est p\u00e9trifi\u00e9e en basalte incandescent. Ses flammes ne br\u00fblent plus vers le haut \u2014 elles *coulent vers le bas comme de la lave*. Il ne court pas : il avance comme une coul\u00e9e, in\u00e9vitable et implacable.",stats:{PV:98,Attaque:118,"D\u00e9fense":95,"Atq Sp\u00e9":74,"D\u00e9f Sp\u00e9":80,Vitesse:92},totalBST:557,signature:{name:"Frappe Magma",pwr:90,acc:100,pp:10,desc:"Le lanceur s'abat sur la cible avec un poing de roche en fusion. La lave qui se solidifie \u00e0 l'impact r\u00e9duit la Vitesse de la cible d'un cran."},talent:{name:"Corps Ardent",desc:"Les capacit\u00e9s directes re\u00e7ues ont 30% de chances de br\u00fbler leur lanceur."},moves:[{name:"Nitrocharge",type:"coral",pwr:50,acc:100,pp:20},{name:"\u00c9boulement",type:"gray",pwr:75,acc:90,pp:10},{name:"S\u00e9isme",type:"amber",pwr:100,acc:100,pp:10},{name:"Gyroballe",type:"gray",pwr:null,acc:100,pp:5}]}},
      {type:"starter-block",data:{name:"Serperior de Pang\u00e9e",quote:"La Nature v\u00e9n\u00e9rable",color:"green",imgUrl:`${BASE}/Pangean%20Serperior.jpg`,types:[["green","Plante"],["blue","Dragon"]],desc:"Incarnation de la v\u00e9g\u00e9tation primordiale \u2014 massive, primitive, indestructible. Ses \u00e9cailles ressemblent \u00e0 de l'\u00e9corce d'arbre mill\u00e9naire, ses yeux ambr\u00e9s ont tout observ\u00e9 depuis le d\u00e9but. Il ne combat jamais en premier. Il n'en a jamais eu besoin.",stats:{PV:75,Attaque:115,"D\u00e9fense":90,"Atq Sp\u00e9":60,"D\u00e9f Sp\u00e9":83,Vitesse:125},totalBST:548,signature:{name:"\u00c9treinte Sylvestre",pwr:100,acc:75,pp:10,desc:"Le lanceur s'enroule violemment autour de la cible et la broie dans ses \u00e9cailles. Emp\u00eache la cible de quitter le terrain tant que Serperior reste au combat."},talent:{name:"Multi\u00e9caille",desc:"Diminue les d\u00e9g\u00e2ts subis par les capacit\u00e9s offensives si le Pok\u00e9mon a tous ses PV."},moves:[{name:"Danse Draco",type:"blue",pwr:null,acc:null,pp:20},{name:"Lame Feuille",type:"green",pwr:90,acc:100,pp:15},{name:"Rafale \u00c9cailles",type:"blue",pwr:25,acc:90,pp:20},{name:"Vitesse Extr\u00eame",type:"gray",pwr:80,acc:100,pp:5}]}},
      {type:"starter-block",data:{name:"Primarina de Pang\u00e9e",quote:"L'Eau myst\u00e9rieuse",color:"blue",imgUrl:`${BASE}/Pangean%20Primarina.jpg`,types:[["blue","Eau"],["purple","Spectre"]],desc:"N\u00e9e des abysses de Panthalassa, l\u00e0 o\u00f9 la lumi\u00e8re n'est jamais arriv\u00e9e. Elle est translucide, bioluminescente par intermittence, visible seulement quand elle le d\u00e9cide. Elle est la premi\u00e8re \u00e0 *sentir* l'arriv\u00e9e de Deoxys \u2014 avant m\u00eame que Rayquaza ne le d\u00e9tecte.",stats:{PV:100,Attaque:60,"D\u00e9fense":75,"Atq Sp\u00e9":112,"D\u00e9f Sp\u00e9":124,Vitesse:85},totalBST:556,signature:{name:"Mirage Abyssal",pwr:70,acc:100,pp:10,desc:"Le lanceur distord les reflets lumineux autour de lui pour frapper depuis un angle imperceptible. Inflige des d\u00e9g\u00e2ts et 50% de chances de rendre la cible confuse."},talent:{name:"M\u00e9dic Nature",desc:"Le Pok\u00e9mon soigne ses alt\u00e9rations de statut s'il switch ou en fin de combat."},moves:[{name:"Surf",type:"blue",pwr:90,acc:100,pp:15},{name:"Fontaine de Vie",type:"blue",pwr:null,acc:null,pp:10},{name:"Ch\u00e2timent",type:"purple",pwr:65,acc:100,pp:10},{name:"\u00c9clat Magique",type:"pink",pwr:80,acc:100,pp:10}]}}
    ]},
    // ===== SCIENCE =====
    {id:"eclats",label:"Les \u00c9clats X",group:"Science",color:"blue",badge:"Science",badgeColor:"blue",title:"Les \u00c9clats X",meta:"Fragments de la m\u00e9t\u00e9orite \u00b7 Lore scientifique",summary:"Les fragments cosmiques qui ont rendu la plan\u00e8te perm\u00e9able \u00e0 toutes les \u00e9nergies ext\u00e9rieures. Leur lore est ici ; leur r\u00f4le dans la progression du jeu est dans la page \u00c9clats & Progression.",content:[
      {type:"lead",text:"La m\u00e9t\u00e9orite ne s'est pas vaporis\u00e9e \u00e0 l'impact. Elle s'est fragment\u00e9e. Des dizaines, peut-\u00eatre des centaines d'\u00e9clats se sont dispers\u00e9s sur des milliers de kilom\u00e8tres, enfonc\u00e9s dans la cro\u00fbte terrestre primitive. Chacun porte une quantit\u00e9 infime mais mesurable de l'**\u00e9nergie X** \u2014 l'\u00e9nergie cosmique originelle."},
      {type:"info-row",items:[{label:"Fragments dispers\u00e9s",value:"Des dizaines \u00e0 centaines"},{label:"Zone de dispersion",value:"Des milliers de km"},{label:"\u00c9clats n\u00e9cessaires",value:"12 exactement"}]},
      {type:"divider"},
      {type:"mechanic",title:"Signature dormante",icon:"\u25c7",text:"Pris isol\u00e9ment, un \u00c9clat X est dormant. Sa signature isotopique est impossible \u00e0 produire par des processus g\u00e9ologiques terrestres. Sa micro-structure cristalline ne ressemble \u00e0 rien de connu. Wollemi a pass\u00e9 quinze ans \u00e0 cartographier leur distribution mondiale. Seul, chaque \u00c9clat ne pointe vers rien. Ensemble, ils parlent."},
      {type:"mechanic",title:"R\u00e9sonance collective",icon:"\u25c8",text:"R\u00e9unis, les \u00c9clats entrent en r\u00e9sonance \u2014 une \u00e9mission d'\u00e9nergie basse fr\u00e9quence dont l'intensit\u00e9 cro\u00eet avec le nombre de fragments rassembl\u00e9s. Comme les morceaux d'un m\u00eame enregistrement qui cherche \u00e0 se rejouer.",chain:["1 \u00c9clat : dormant","Plusieurs : r\u00e9sonance","12 r\u00e9unis : seuil critique","La Fissure s'ouvre"]},
      {type:"mechanic",title:"Impr\u00e9gnation plan\u00e9taire",icon:"\u25c9",text:"L'\u00e9nergie X lib\u00e9r\u00e9e s'est diffus\u00e9e dans la cro\u00fbte terrestre, les oc\u00e9ans, l'atmosph\u00e8re naissante. La plan\u00e8te est devenue *perm\u00e9able aux \u00e9nergies cosmiques ext\u00e9rieures*. Les \u00c9clats X ne sont pas la source des ph\u00e9nom\u00e8nes extraordinaires \u2014 ils sont la raison pour laquelle la plan\u00e8te \u00e9tait **capable de les absorber**."},
      {type:"divider"},
      {type:"h2",text:"Connexions inter-univers Pok\u00e9mon"},
      {type:"conn-table",items:[
        {label:"M\u00e9ga-\u00c9volution",origin:"Hoenn",desc:"Mikado organ de Rayquaza, cr\u00e9\u00e9 lors du combat originel. \u00c9nergie X directe, concentr\u00e9e."},
        {label:"Formes Primo",origin:"Hoenn",desc:"Groudon et Kyogre retrouvant l'\u00e9tat ant\u00e9rieur \u00e0 l'interf\u00e9rence X cumul\u00e9e."},
        {label:"Dynamax",origin:"Galar",desc:"Eternatus, ast\u00e9ro\u00efde -20 000 ans. Nature diff\u00e9rente, ancr\u00e9e via la perm\u00e9abilit\u00e9 plan\u00e9taire."},
        {label:"T\u00e9racristallisation",origin:"Paldea",desc:"Terapagos, \u00e9nergie biologique intrins\u00e8que. Ancr\u00e9e via la perm\u00e9abilit\u00e9 plan\u00e9taire."},
        {label:"Cristaux-Z",origin:"Alola",desc:"Necrozma (Ultra-Espace), nature photonique distincte des \u00c9clats X."}
      ]}
    ]},
    {id:"origine",label:"Origine Humaine",group:"Science",color:"purple",badge:"Xenog\u00e9nomique",badgeColor:"purple",title:"Origine Humaine \u2014 Divergence, Marqueur X & Syndrome X",meta:"Th\u00e8se du Pr. Wollemi \u00b7 La boucle boucl\u00e9e",summary:"D'o\u00f9 viennent les humains, pourquoi le type Cosmique a disparu, et comment les deux sont li\u00e9s.",content:[
      {type:"lead",text:"La communaut\u00e9 scientifique s'est accord\u00e9e sur un r\u00e9cit fondateur : Arceus a cr\u00e9\u00e9 Mew, anc\u00eatre universel de toutes les esp\u00e8ces Pok\u00e9mon. Ce r\u00e9cit est coh\u00e9rent, document\u00e9, et accept\u00e9. Ce qu'il n'explique pas, c'est **les humains**."},
      {type:"h2",text:"La Divergence"},
      {type:"callout",color:"purple",text:"Les humains ne descendent pas de Mew. Ils ne s'inscrivent dans aucune lign\u00e9e \u00e9volutive tra\u00e7able. Leur biologie suit une logique radicalement diff\u00e9rente : deux Ossatueur sont quasi-identiques biologiquement, l\u00e0 o\u00f9 deux humains peuvent pr\u00e9senter des diff\u00e9rences consid\u00e9rables. Wollemi appelle ce probl\u00e8me **la Divergence**."},
      {type:"mechanic",title:"Le Marqueur X",icon:"\u25c8",text:"Apr\u00e8s vingt ans de cartographie g\u00e9nomique, Wollemi a isol\u00e9 dans l'ADN humain des s\u00e9quences dormantes qui n'appartiennent \u00e0 aucune lign\u00e9e \u00e9volutive terrestre identifiable. **Pr\u00e9sentes chez tous les humains sans exception, absentes de tous les Pok\u00e9mon sans exception.** Leur structure pointe vers une seule conclusion : elles ne sont pas d'origine terrestre."},
      {type:"mechanic",title:"La Source X \u2014 l'hypoth\u00e8se non publi\u00e9e",icon:"\u2b50",text:"Le Marqueur X partage avec l'ADN de Deoxys une logique structurelle que rien d'autre ne partage. L'hypoth\u00e8se : Deoxys aurait introduit dans les premi\u00e8res formes de vie de la Pang\u00e9e un mat\u00e9riau g\u00e9n\u00e9tique exog\u00e8ne. Les humains seraient **le r\u00e9sultat d'une contamination cosmique accidentelle**."},
      {type:"divider"},
      {type:"h2",text:"Le Syndrome X"},
      {type:"para",text:"\u00c0 l'impact, l'\u00e9nergie X a tu\u00e9 presque tout ce qui \u00e9tait expos\u00e9 directement. Quelques esp\u00e8ces ont surv\u00e9cu \u2014 transform\u00e9es. Wollemi appelle \u00e7a le **Syndrome X** : une bifurcation \u00e9volutive forc\u00e9e d'une intensit\u00e9 sans pr\u00e9c\u00e9dent."},
      {type:"mechanic",title:"Instabilit\u00e9 g\u00e9n\u00e9tique productive",icon:"\u25c8",text:"L'ADN des porteurs mute \u00e0 un rythme radicalement sup\u00e9rieur \u00e0 la normale, produisant une variabilit\u00e9 individuelle in\u00e9dite. C'est exactement la variabilit\u00e9 que Wollemi observe chez les humains modernes \u2014 et nulle part ailleurs dans le r\u00e8gne Pok\u00e9mon."},
      {type:"mechanic",title:"Perm\u00e9abilit\u00e9 aux \u00e9nergies cosmiques \u2014 le type Cosmique",icon:"\u2b50",text:"Les porteurs d\u00e9veloppent des r\u00e9cepteurs primitifs \u00e0 l'\u00e9nergie X. Cette propri\u00e9t\u00e9 se traduit en jeu par le **type Cosmique** : des capacit\u00e9s qui n'ob\u00e9issent \u00e0 aucune r\u00e8gle d'interaction terrestre. C'est pourquoi les Pok\u00e9mon de la Zone Cosmique ont ce type."},
      {type:"mechanic",title:"Proto-conscience sociale",icon:"\u25ce",text:"Les porteurs d\u00e9veloppent des formes de communication et d'organisation collective plus complexes \u2014 quelque chose d'interm\u00e9diaire, impossible \u00e0 cat\u00e9goriser."},
      {type:"divider"},
      {type:"callout",color:"poison",text:"Le type Cosmique ne s'est pas \u00e9teint brutalement. Il a **fondu** \u2014 g\u00e9n\u00e9ration apr\u00e8s g\u00e9n\u00e9ration, l'\u00e9nergie X ambiante se dissipant, l'expression ph\u00e9notypique a diminu\u00e9 jusqu'\u00e0 dispara\u00eetre. Ce r\u00e9sidu latent dans le g\u00e9nome \u2014 c'est le Marqueur X."},
      {type:"cards2",items:[
        {name:"L'extinction progressive",icon:"\ud83d\udc80",desc:"Pour la majorit\u00e9 des lign\u00e9es. L'instabilit\u00e9 sans \u00e9nergie X produit trop de variants non-viables. Ces esp\u00e8ces s'\u00e9teignent \u2014 leurs fossiles ne ressemblent \u00e0 aucune lign\u00e9e connue."},
        {name:"La stabilisation divergente",icon:"\ud83e\uddec",desc:"Pour une seule lign\u00e9e. Conserve l'instabilit\u00e9 g\u00e9n\u00e9tique comme caract\u00e9ristique permanente, perd le type Cosmique comme expression active, le garde comme Marqueur X dormant, et d\u00e9veloppe progressivement les caract\u00e9ristiques humaines."}
      ]},
      {type:"divider"},
      {type:"callout",color:"purple",text:"Les humains sont la **descendance stabilis\u00e9e d'une lign\u00e9e Pok\u00e9mon porteuse du Syndrome X** \u2014 la seule qui n'a ni disparu ni perdu ses caract\u00e9ristiques cosmiques, mais les a transform\u00e9es en quelque chose de durable. Deoxys n'a pas cr\u00e9\u00e9 les humains. Il a cr\u00e9\u00e9 les conditions qui ont rendu leur existence possible. *Par accident.*"},
      {type:"quote",text:"Pourquoi les humains ne sont-ils plus des Pok\u00e9mon, m\u00eame s'ils en descendent ? Parce que la divergence est trop ancienne et trop profonde. Ce n'est pas diff\u00e9rent de ce que la biologie terrestre r\u00e9elle enseigne.",author:"Pr. Wollemi, notes non publi\u00e9es \u2014 Source X"}
    ]},
    {id:"fissure",label:"La Fissure",group:"Science",color:"teal",badge:"M\u00e9canique centrale",badgeColor:"teal",title:"La Fissure",meta:"Le portail temporel \u00b7 Point de non-retour",summary:"La connexion directe entre le pr\u00e9sent et la Pang\u00e9e au moment pr\u00e9cis de l'impact.",content:[
      {type:"lead",text:"En cartographiant la distribution des \u00c9clats Premiers et en remontant la d\u00e9rive des continents par mod\u00e9lisation g\u00e9ophysique, Wollemi et **Theo Marrant** ont calcul\u00e9 le point d'impact originel \u2014 aujourd'hui sous **quatre mille m\u00e8tres d'eau**, au fond de l'Atlantique. Inaccessible physiquement. Accessible autrement."},
      {type:"mechanic",title:"Pas un voyage dans le temps",icon:"\u25ce",text:"La Fissure n'est pas un voyage dans le temps au sens abstrait. C'est une **reconnexion directe entre deux points de la m\u00eame plan\u00e8te s\u00e9par\u00e9s par le temps** : ici, aujourd'hui, et le sol de la Pang\u00e9e au moment pr\u00e9cis de l'impact. Pas d'univers parall\u00e8le. Pas de paradoxe."},
      {type:"mechanic",title:"Le seuil de r\u00e9sonance critique",icon:"\u2726",text:"Douze \u00c9clats X r\u00e9unis dans les bonnes conditions g\u00e9om\u00e9triques, activ\u00e9s par les mod\u00e8les de Theo Marrant, atteignent un seuil critique. \u00c0 ce seuil, la r\u00e9sonance ne simule plus l'impact originel \u2014 elle le **rouvre**.",chain:["12 \u00c9clats r\u00e9unis","Configuration g\u00e9om\u00e9trique exacte","Seuil critique","La Fissure s'ouvre"]},
      {type:"mechanic",title:"Ce que l'\u00e9quipe ressent en passant",icon:"\u25c6",text:"Le Marqueur X que chaque humain porte dans ses cellules **vibre diff\u00e9remment** dans un monde satur\u00e9 d'\u00e9nergie X libre. Pas de douleur \u2014 une reconnaissance. Comme si quelque chose de tr\u00e8s ancien dans leur biologie reconnaissait l'endroit."},
      {type:"callout",color:"teal",text:"**Le portail de retour ne s'ouvre que lorsque les douze \u00c9clats sont r\u00e9unis et activ\u00e9s simultan\u00e9ment.** Ce que personne n'anticipe : que certains membres utiliseront leur fragment comme levier de pouvoir le moment venu. Sans les douze, pas de retour. Jamais."}
    ]},
    // ===== PERSONNAGES =====
    {id:"protagoniste",label:"Le Protagoniste",group:"Personnages",color:"amber",badge:"Joueur",badgeColor:"amber",title:"Le Protagoniste",meta:"L'homme de terrain \u00b7 Alter ego du joueur",summary:"Pas de dipl\u00f4me, pas de titre. Une m\u00e9thode que personne d'autre n'a, et une mission que personne d'autre ne peut accomplir.",content:[
      {type:"lead",text:"Tu n'es pas chercheur. Tu n'as jamais publi\u00e9 d'article. Tu ne sais probablement pas \u00e9peler xenog\u00e9nomique. Ce que tu sais faire, c'est trouver des Pok\u00e9mon que personne d'autre ne trouve \u2014 et \u00e9tablir avec eux une relation suffisamment stable pour les ramener vivants, en bonne sant\u00e9, et suffisamment confiants pour \u00eatre observ\u00e9s."},
      {type:"mechanic",title:"La m\u00e9thode",icon:"\u25ce",text:"Tu sais lire un territoire, comprendre ce qu'un Pok\u00e9mon sauvage tol\u00e8re ou refuse, sentir le moment o\u00f9 l'approche est possible et celui o\u00f9 elle ne l'est pas encore. Tu construis de la confiance sans la forcer. C'est une comp\u00e9tence qui ne se documente pas \u2014 Wollemi l'a observ\u00e9e pendant des ann\u00e9es sans jamais demander comment tu fais."},
      {type:"mechanic",title:"La mission dans la Pang\u00e9e",icon:"\u25c6",text:"Wollemi te confie une mission claire : **explorer, cartographier, documenter**. Suivre la r\u00e9sonance des \u00c9clats X pour localiser les traces de Deoxys. Identifier les biomes et inventorier leurs esp\u00e8ces. Rapporter au camp \u2014 donn\u00e9es, observations, \u00e9chantillons biologiques. Tu es l'interface entre le terrain hostile et l'\u00e9quipe scientifique."},
      {type:"divider"},
      {type:"h2",text:"Le choix du starter \u2014 sans c\u00e9r\u00e9monie"},
      {type:"para",text:"Wollemi t'emm\u00e8ne dans la serre d'\u00e9levage du laboratoire. Il se tourne vers toi et dit simplement : *Je t'en dois un depuis longtemps. Prends celui avec lequel tu te sens.* C'est seulement apr\u00e8s, Pok\u00e9mon en main, qu'il t'explique tout le reste."},
      {type:"starter-choice",items:[
        {name:"H\u00e9ricendre",evolution:"\u2192 Typhlosion de Pang\u00e9e",types:[["coral","Feu"],["gray","Roche"]],color:"coral",desc:"Le b\u00e2tisseur in\u00e9vitable. Puissance physique brute, endurance volcanique."},
        {name:"Vip\u00e9lierre",evolution:"\u2192 Serperior de Pang\u00e9e",types:[["green","Plante"],["blue","Dragon"]],color:"green",desc:"Le v\u00e9n\u00e9rable. Vitesse et contr\u00f4le \u2014 ne frappe jamais en premier, mais ne rate jamais non plus."},
        {name:"Otaquin",evolution:"\u2192 Primarina de Pang\u00e9e",types:[["blue","Eau"],["purple","Spectre"]],color:"purple",desc:"L'invisible. Attaque sp\u00e9ciale \u2014 toujours un coup d'avance."}
      ]},
      {type:"divider"},
      {type:"callout",color:"purple",text:"\u00c9lia a investi dans Wollemi comme on investit dans quelqu'un dont on attend, sans se l'avouer, une validation explicite en retour. Quand elle te voit arriver \u2014 sans dipl\u00f4me, avec ta fa\u00e7on informelle d'exister dans l'espace du Professeur \u2014 elle enregistre la chaleur qu'il a pour toi. Elle ne dit rien. Elle stocke. **Elle est jalouse de ta l\u00e9g\u00e8ret\u00e9.** Tu n'as rien \u00e0 prouver, et \u00e7a ne semble pas te peser. Elle, si."}
    ]},
    {id:"wollemi-elia",label:"Professeur Wollemi & \u00c9lia",group:"Personnages",color:"gray",badge:"PNJ fondateurs",badgeColor:"gray",title:"Professeur Wollemi & \u00c9lia",meta:"Chef d'exp\u00e9dition \u00b7 Doctorante \u00b7 Le bin\u00f4me scientifique",summary:"Le chercheur qui cherche ce que tout le monde a cess\u00e9 de chercher, et l'assistante qui a tout investi pour \u00eatre l\u00e0.",content:[
      {type:"lead",text:"Le *Wollemia nobilis* \u2014 l'arbre Wollemi, surnomm\u00e9 le dinosaure botanique \u2014 a \u00e9t\u00e9 d\u00e9couvert vivant en 1994, morphologiquement inchang\u00e9 depuis 200 millions d'ann\u00e9es. Il a vu la Pang\u00e9e. Et pendant tout ce temps, personne ne savait qu'il existait encore. Le Professeur Wollemi partage quelque chose avec l'arbre qui lui a donn\u00e9 son nom."},
      {type:"persons-grid",items:[
        {initials:"W",color:"gray",imgUrl:`${BASE}/Professeur%20Wollemi.png`,name:"Professeur Wollemi",role:"Chef d'exp\u00e9dition \u00b7 Xenog\u00e9nomique \u00b7 Biologie \u00e9volutive compar\u00e9e",desc:"Sp\u00e9cialis\u00e9 en biologie \u00e9volutive compar\u00e9e et en *xenog\u00e9nomique* \u2014 l'\u00e9tude des s\u00e9quences g\u00e9n\u00e9tiques pr\u00e9sentes chez les humains et les Pok\u00e9mon qui ne s'expliquent par aucun m\u00e9canisme \u00e9volutif terrestre connu. Sa th\u00e8se publi\u00e9e en 2012 a \u00e9t\u00e9 accueillie avec scepticisme poli. Certains coll\u00e8gues ont poliment chang\u00e9 de sujet lors des conf\u00e9rences. D'autres ont \u00e9t\u00e9 moins polis. Il cherche ce que tout le monde a cess\u00e9 de chercher parce que personne ne pensait que \u00e7a pouvait encore exister.",arc:"Sa relation avec le protagoniste n'est pas celle d'un professeur et d'un \u00e9l\u00e8ve. C'est quelque chose de plus simple et de plus solide : une confiance mutuelle construite sur des ann\u00e9es de r\u00e9sultats r\u00e9ciproques, sans que l'un ait jamais trahi l'attente de l'autre. Wollemi est \u00e9conome de ses mots. Il ne dira pas souvent ce que le protagoniste repr\u00e9sente pour lui. Mais quand il l'invite sur l'\u00ee\u2019le \u2014 pour lui pr\u00e9senter le projet dans son entier\u00e9t\u00e9 \u2014 il commence par lui offrir un starter. Rien d'autre ne le dit mieux.",trigger:"Chercher ce que tout le monde a cess\u00e9 de chercher"}
      ]},
      {type:"quote",text:"Les ph\u00e9nom\u00e8nes extraordinaires de transformation que nous observons \u00e0 travers les r\u00e9gions ne sont pas des accidents locaux. Ils sont des expressions r\u00e9gionales d'une perm\u00e9abilit\u00e9 plan\u00e9taire globale. Cette perm\u00e9abilit\u00e9 a une date. Elle a un crat\u00e8re.",author:"Pr. Wollemi, notes personnelles"},
      {type:"divider"},
      {type:"persons-grid",items:[
        {initials:"E",color:"purple",imgUrl:`${BASE}/Assistante%20E%CC%81lia.png`,name:"\u00c9lia",role:"Doctorante 3\u00e8me ann\u00e9e \u00b7 Xenog\u00e9nomique \u00b7 Rivale \u00e9motionnelle",desc:"Doctorante brillante en troisi\u00e8me ann\u00e9e sous la direction de Wollemi. Deux articles publi\u00e9s \u00e0 24 ans, co-signataire d'un troisi\u00e8me qui a \u00e9t\u00e9 le plus cit\u00e9 de la carri\u00e8re r\u00e9cente de Wollemi. Elle ma\u00eetrise la xenog\u00e9nomique \u00e0 un niveau que la plupart de ses coll\u00e8gues n'atteignent pas. Elle n'a pas choisi Wollemi par d\u00e9faut \u2014 elle avait lu son article de 2012 en premi\u00e8re ann\u00e9e de master et avait eu l'impression que quelqu'un venait enfin de poser \u00e0 voix haute une question qu'elle n'arrivait pas \u00e0 formuler seule.",arc:"Ce qui la ronge : elle attend une validation explicite que Wollemi exprime seulement par la confiance, jamais par les mots. Elle est jalouse de la l\u00e9g\u00e8ret\u00e9 du protagoniste \u2014 il n'a rien \u00e0 prouver, et \u00e7a ne semble pas lui peser. Son arc : comprendre progressivement que la vraie question est ce qu'elle veut, elle, ind\u00e9pendamment de Wollemi. Ce n'est pas l'arc d'une antagoniste. C'est l'arc de quelqu'un qui grandit dans un environnement qui brise toutes les structures familiales.",trigger:"La validation qu'on attend d'un seul \u00eatre"}
      ]}
    ]},
    {id:"expedition",label:"Les membres de l'exp\u00e9dition",group:"Personnages",color:"gray",badge:"8 personnages",badgeColor:"gray",title:"Les membres de l'exp\u00e9dition",meta:"Porteurs des \u00c9clats X \u00b7 Confrontations narratives",summary:"Chaque membre d\u00e9tient un \u00c9clat. Chaque arc r\u00e9v\u00e8le une limite humaine. Chaque confrontation est in\u00e9vitable.",content:[
      {type:"lead",text:"La veille du d\u00e9part, Wollemi r\u00e9unit toute l'\u00e9quipe. Sur la table : douze \u00c9clats Premiers. **Le portail de retour ne s'ouvre que lorsque les douze \u00c9clats sont r\u00e9unis.** Ce que personne n'anticipe : que certains utiliseront leur fragment comme levier de pouvoir le moment venu. La m\u00e9canique de r\u00e9cup\u00e9ration des \u00c9clats est d\u00e9taill\u00e9e dans la page *\u00c9clats & Progression*."},
      {type:"eclat-table"}
    ]},
    // ===== M\u00c9CANIQUES =====
    {id:"type-cosmique",label:"Type Cosmique",group:"M\u00e9caniques",color:"purple",badge:"Game Design",badgeColor:"purple",title:"Le Type Cosmique",meta:"Nouveau type exclusif \u00b7 Origine lore \u00b7 Table des interactions",summary:"Un type qui n'existe qu'\u00e0 l'\u00e9poque de la Pang\u00e9e, qui n'ob\u00e9it \u00e0 aucune r\u00e8gle d'interaction terrestre, et qui a disparu avec le Syndrome X.",content:[
      {type:"lead",text:"Le type Cosmique est le seul type du jeu qui n'existe pas \u00e0 l'\u00e9poque moderne. Il est l'expression m\u00e9canique d'une r\u00e9alit\u00e9 lore : l'\u00e9nergie X, concentr\u00e9e et non diss\u00e9min\u00e9e, peut transformer la biologie d'un Pok\u00e9mon au point de le faire ob\u00e9ir \u00e0 des r\u00e8gles que les autres types ne reconna\u00eessent pas."},
      {type:"h2",text:"Origine \u2014 o\u00f9 et pourquoi il appara\u00eet"},
      {type:"mechanic",title:"Deoxys \u2014 le seul porteur permanent",icon:"\u2b50",text:"Deoxys re\u00e7oit le type Cosmique d\u00e8s son \u00e9mergence du crat\u00e8re d'impact. C'est le seul \u00eatre sur Terre \u00e0 avoir conserv\u00e9 la fr\u00e9quence cosmique originelle dans sa structure biologique sans la transmettre ni la diluer. Ses quatre formes sont toutes de type Cosmique. \u00c0 l'\u00e9poque moderne, Deoxys ne conserve que le type Psy \u2014 le Cosmique a disparu avec les lign\u00e9es du Syndrome X."},
      {type:"mechanic",title:"La Zone Cosmique \u2014 porteurs secondaires",icon:"\u25c8",text:"Les Pok\u00e9mon de la Zone Cosmique ont absorb\u00e9 l'\u00e9nergie X r\u00e9siduelle directement depuis le sol et l'atmosph\u00e8re autour du point d'impact. Ce sont les seuls Pok\u00e9mon ordinaires \u00e0 d\u00e9velopper le type Cosmique \u2014 et uniquement dans cette zone, tant que l'\u00e9nergie X reste concentr\u00e9e. L'Apex Cosmique (Cosmique/Psy) en est le cas le plus extr\u00eame."},
      {type:"callout",color:"purple",text:"Le type Cosmique n'est pas un type qu'on peut obtenir via une \u00e9volution ou un objet. Il est une condition biologique li\u00e9e \u00e0 une exposition directe \u00e0 l'\u00e9nergie X. C'est pour \u00e7a qu'il dispara\u00eet \u00e0 l'\u00e9poque moderne : l'\u00e9nergie X s'est dilu\u00e9e dans les strates g\u00e9ologiques, ne laissant que des traces dormantes \u2014 le Marqueur X chez les humains."},
      {type:"divider"},
      {type:"h2",text:"Impact dans le jeu"},
      {type:"mechanic",title:"Hors-syst\u00e8me",icon:"\u25c6",text:"Le type Cosmique n'ob\u00e9it \u00e0 aucune des r\u00e8gles d'interaction des types terrestres. Un joueur qui arrive dans la Zone Cosmique avec des strat\u00e9gies optimis\u00e9es pour les types Feu, Eau, Roche ou Glace se retrouve avec des outils partiellement inutiles. Il faut observer, adapter, comprendre \u2014 exactement ce que fait le protagoniste face \u00e0 tout Pok\u00e9mon sauvage."},
      {type:"mechanic",title:"Progression du joueur",icon:"\u25ce",text:"La Zone Cosmique est la derni\u00e8re zone accessible. Le joueur qui l'atteint a d\u00e9j\u00e0 affronts les cinq autres biomes et leurs Apex. La rencontre avec le type Cosmique est l'\u00e9preuve finale de sa capacit\u00e9 d'adaptation \u2014 un type inconnu, contre une esp\u00e8ce inconnue, dans un monde qui a d\u00e9j\u00e0 tout remis en question."},
      {type:"divider"},
      {type:"h2",text:"Table des interactions \u2014 estimation lore-coh\u00e9rente"},
      {type:"type-table-cosmique"},
      {type:"callout",color:"amber",text:"Cette table est provisoire et d\u00e9lib\u00e9r\u00e9ment incompl\u00e8te. Le type Cosmique n'ayant jamais exist\u00e9 dans les jeux officiels, ses interactions restent \u00e0 d\u00e9finir compl\u00e8tement lors du design d\u00e9taill\u00e9 des capacit\u00e9s. L'essentiel est qu'il **ne suive pas les r\u00e8gles connues** \u2014 c'est son identit\u00e9 m\u00e9canique."}
    ]},
    {id:"eclats-progression",label:"\u00c9clats & Progression",group:"M\u00e9caniques",color:"amber",badge:"Game Design",badgeColor:"amber",title:"\u00c9clats X & Progression",meta:"8 \u00c9clats \u00b7 8 confrontations \u00b7 Axe narratif principal",summary:"Comment les 8 \u00c9clats d\u00e9tenus par les membres de l'exp\u00e9dition structurent la progression du jeu \u2014 distinct du lore des \u00c9clats X (Science) et des profils des membres (Personnages).",content:[
      {type:"lead",text:"Dans la Pang\u00e9e, le joueur n'avance pas en obtenant des badges ou en battant des champions de Ligue. Il avance en r\u00e9cup\u00e9rant les **huit \u00c9clats X** d\u00e9tenus par les membres de l'exp\u00e9dition \u2014 sans lesquels le retour est impossible. Chaque \u00c9clat r\u00e9cup\u00e9r\u00e9 est une confrontation humaine, pas un combat de champion."},
      {type:"callout",color:"amber",text:"Cette page d\u00e9crit la **m\u00e9canique de progression**. Pour le lore scientifique des \u00c9clats X, voir la page *Les \u00c9clats X* dans Science. Pour les profils d\u00e9taill\u00e9s des membres, voir *Les membres de l'exp\u00e9dition* dans Personnages."},
      {type:"divider"},
      {type:"h2",text:"Principe \u2014 les \u00c9clats comme axe de progression"},
      {type:"mechanic",title:"12 \u00c9clats, 4 s\u00e9curis\u00e9s, 8 \u00e0 r\u00e9cup\u00e9rer",icon:"\u25c8",text:"Wollemi et \u00c9lia gardent 2 \u00c9clats chacun (s\u00e9curit\u00e9 redondante). Le protagoniste en poss\u00e8de 1. Les 8 membres r\u00e9cup\u00e8rent leur \u00c9clat, chacun l'utilise \u00e0 un moment ou \u00e0 un autre comme levier de pouvoir. **Aucun retour possible avant d'avoir rassembl\u00e9 les 12.**"},
      {type:"mechanic",title:"La r\u00e9sonance comme boussole",icon:"\u25c7",text:"Les \u00c9clats que porte le joueur vibrent diff\u00e9remment selon leur proximit\u00e9 avec d'autres \u00c9clats, avec Deoxys, et avec les sites d'impact secondaires. Cette r\u00e9sonance fonctionne comme une **boussole narrative** \u2014 elle donne toujours une direction sans imposer un chemin. Le joueur suit la r\u00e9sonance quand il veut, l'ignore quand il pr\u00e9f\u00e8re explorer librement."},
      {type:"divider"},
      {type:"h2",text:"Format des confrontations \u2014 pas des combats de champions"},
      {type:"para",text:"Chaque membre de l'exp\u00e9dition est un combat de dresseur au sens technique \u2014 mais narrativement, c'est autre chose. Ce ne sont pas des adversaires. Ce sont des coll\u00e8gues que la pression de la Pang\u00e9e, l'absence de structures sociales stabilisatrices, et leurs propres motivations ont conduits \u00e0 faire passer leurs objectifs avant le groupe."},
      {type:"mechanic",title:"Le processus en quatre temps",icon:"\u25c6",text:"**Trouver le membre** \u2014 explorer le biome o\u00f9 il s'est \u00e9loign\u00e9 (la r\u00e9sonance aide). **Comprendre son arc** \u2014 dialogues, indices, observations de terrain. **Confrontation** \u2014 combat de dresseur avec son \u00e9quipe mono-type, int\u00e9gr\u00e9 dans un contexte narratif. **R\u00e9cup\u00e9rer l'\u00c9clat** \u2014 la confrontation ne se termine pas toujours par une victoire nette ; parfois l'\u00c9clat vient d'un aveu, d'une r\u00e9conciliation, d'un choix.",chain:["Trouver le membre","Comprendre son arc","Confrontation dresseur","R\u00e9cup\u00e9rer l'\u00c9clat"]},
      {type:"mechanic",title:"Mono-type et diversit\u00e9 garantie",icon:"\u25ce",text:"Chaque membre a un type exclusif \u2014 Poison, Acier, Normal, \u00c9lectrik, F\u00e9e, Combat, Dragon, T\u00e9n\u00e8bre. Ces huit types ne recoupent jamais les types des cinq Apex (Feu/Plante, Eau/Vol, Roche/Sol, Glace/Spectre, Cosmique/Psy). Le r\u00e9sultat : **z\u00e9ro redondance de m\u00e9canique** entre les confrontations narratives et les raids de boss tout au long du jeu."},
      {type:"divider"},
      {type:"h2",text:"Les 8 membres \u2014 types et bascules narratives"},
      {type:"type-grid",items:[
        {name:"Hana",type:"Poison",color:"poison"},
        {name:"Vael",type:"Acier",color:"steel"},
        {name:"Solano",type:"Normal",color:"gray"},
        {name:"Marrant",type:"\u00c9lectrik",color:"amber"},
        {name:"Carvalho",type:"F\u00e9e",color:"pink"},
        {name:"Ashida",type:"Combat",color:"coral"},
        {name:"Shore",type:"Dragon",color:"teal"},
        {name:"Vasi",type:"T\u00e9n\u00e8bre",color:"dark"}
      ]},
      {type:"callout",color:"teal",text:"Les confrontations avec Wollemi et \u00c9lia arrivent en **late game** \u2014 apr\u00e8s que les 8 \u00c9clats ext\u00e9rieurs ont \u00e9t\u00e9 r\u00e9cup\u00e9r\u00e9s. Ce ne sont pas des ennemis. Ce sont des moments o\u00f9 la tension accumul\u00e9e depuis le d\u00e9but se r\u00e9sout \u2014 ou ne se r\u00e9sout pas. Les \u00c9clats de Wollemi et \u00c9lia sont les derniers \u00e0 obtenir."}
    ]},
    {id:"hierarchie",label:"Hi\u00e9rarchie Sauvage",group:"M\u00e9caniques",color:"green",badge:"Game Design",badgeColor:"green",title:"Hi\u00e9rarchie Sauvage",meta:"Trois rangs \u00b7 Signaux visuels \u00b7 Logique \u00e9cologique",summary:"La Pang\u00e9e n'a pas de dresseurs. Ce qui structure l'exploration, c'est la hi\u00e9rarchie vivante du monde sauvage \u2014 trois niveaux distincts, lisibles en un coup d'\u0153il.",content:[
      {type:"lead",text:"Trois rangs distincts structurent la faune de la Pang\u00e9e. Chacun a un signal visuel imm\u00e9diatement lisible, un format de rencontre diff\u00e9rent, et une logique propre. Les m\u00e9caniques de combat d\u00e9taill\u00e9es sont dans les pages *Combat Sauvage & Alpha* et *Raids Apex*."},
      {type:"hierarchie-table"},
      {type:"divider"},
      {type:"mechanic",title:"Sauvage \u2014 aucun marqueur",icon:"\u25c7",text:"Pas de signal particulier. Le joueur lit le Pok\u00e9mon par son comportement naturel : certains fuient \u00e0 l'approche, d'autres chargent. L'observation est la seule cl\u00e9 \u2014 c'est exactement la comp\u00e9tence du protagoniste."},
      {type:"mechanic",title:"Alpha \u2014 yeux rouges",icon:"\u25c8",text:"Vasodilatation oculaire li\u00e9e \u00e0 l'adr\u00e9naline \u2014 signal r\u00e9el chez certains pr\u00e9dateurs. L'Alpha charge \u00e0 vue, sans h\u00e9sitation. Sa taille est visiblement sup\u00e9rieure \u00e0 ses cong\u00e9n\u00e8res. Il est toujours entour\u00e9 de sa famille \u00e9volutive."},
      {type:"mechanic",title:"Apex \u2014 marques blanches (leucisme partiel)",icon:"\u25c9",text:"Des zones de d\u00e9pigmentation blanche selon l'esp\u00e8ce. Signal social instinctif pour toute la faune locale : **la zone se vide avant m\u00eame que l'Apex soit visible**. On lit le vide, pas la pr\u00e9sence. Et quand l'Apex appara\u00eet, le silence qui pr\u00e9c\u00e9dait a d\u00e9j\u00e0 dit l'essentiel."}
    ]},
    {id:"combat-sauvage",label:"Combat Sauvage & Alpha",group:"M\u00e9caniques",color:"coral",badge:"Game Design",badgeColor:"coral",title:"Combat Sauvage & Alpha",meta:"Temps r\u00e9el \u00b7 Pas de tour par tour \u00b7 Approche furtive",summary:"Comment les combats contre les Pok\u00e9mon sauvages et les Alphas fonctionnent \u2014 en temps r\u00e9el, avec une gestion active du terrain.",content:[
      {type:"lead",text:"Dans la Pang\u00e9e, aucun combat contre un Pok\u00e9mon sauvage n'est au tour par tour. Le monde ne s'arr\u00eate pas. Le joueur agit en temps r\u00e9el \u2014 attaque, esquive, protection, fuite, soin \u2014 et doit lire le comportement de l'adversaire pour survivre et capturer."},
      {type:"divider"},
      {type:"h2",text:"Pok\u00e9mon Sauvage"},
      {type:"mechanic",title:"Approche furtive",icon:"\u25c7",text:"Beaucoup d'esp\u00e8ces ne chargent pas automatiquement. Le joueur peut s'approcher en furtif \u2014 accroupi, dans le vent favorable. Une approche r\u00e9ussie permet de lancer une Pok\u00e9 Ball avant m\u00eame d'engager le combat. C'est le c\u0153ur de m\u00e9tier du protagoniste."},
      {type:"mechanic",title:"Combat en temps r\u00e9el",icon:"\u25c8",text:"Si le Pok\u00e9mon d\u00e9tecte le joueur ou charge, le combat est imm\u00e9diat. L'adversaire a ses propres patterns \u2014 certains pr\u00e9visibles, d'autres non. La difficult\u00e9 vient du niveau, du type et de l'agressivit\u00e9 de l'esp\u00e8ce, pas d'une structure artificielle."},
      {type:"mechanic",title:"Capture",icon:"\u25c9",text:"Affaiblir, puis lancer une Pok\u00e9 Ball au bon moment. Certains Pok\u00e9mon r\u00e9agissent mieux \u00e0 un statut (paralys\u00e9, endormi) ou \u00e0 des Ball sp\u00e9cifiques."},
      {type:"divider"},
      {type:"h2",text:"Alpha \u2014 le chef de meute"},
      {type:"callout",color:"coral",text:"Un Alpha n'est jamais seul. Il est toujours entour\u00e9 de sa propre famille \u00e9volutive. Le combat commence avec la meute \u2014 pas avec le chef."},
      {type:"mechanic",title:"Phase 1 \u2014 la meute",icon:"\u25c8",text:"Les cong\u00e9n\u00e8res engagent en premier. L'Alpha reste en retrait pendant que sa meute tient le joueur. Il n'intervient pas \u2014 il calcule. C'est un combat en m\u00e9l\u00e9e semi-organis\u00e9e : plusieurs adversaires, positionnement actif, gestion des priorit\u00e9s."},
      {type:"mechanic",title:"Phase 2 \u2014 l'Alpha seul",icon:"\u25c9",text:"Une fois la meute dispers\u00e9e ou vaincue, l'Alpha entre au combat. Plus puissant, plus rapide, patterns plus complexes. Le joueur arrive entam\u00e9. Capturable apr\u00e8s affaibli. Loot : objets rares de l'esp\u00e8ce \u00e0 taux augment\u00e9, mat\u00e9riaux d'\u00e9volution."},
      {type:"mechanic",title:"R\u00e9apparition fixe",icon:"\u25c7",text:"Un Alpha revient \u00e0 son emplacement apr\u00e8s un d\u00e9lai. Il n'est pas un \u00e9v\u00e9nement unique \u2014 c'est un chef de territoire."}
    ]},
    {id:"raids-apex",label:"Raids Apex",group:"M\u00e9caniques",color:"amber",badge:"Game Design",badgeColor:"amber",title:"Raids Apex \u2014 Combat de Boss en 3 Phases",meta:"Boss d'action RPG \u00b7 Temps r\u00e9el \u00b7 Phases progressives",summary:"Le combat le plus exigeant du jeu. Pas de tour par tour \u2014 un raid de boss en trois phases graduelles, o\u00f9 chaque phase r\u00e9v\u00e8le l'Apex un peu plus.",content:[
      {type:"lead",text:"Un combat Apex n'est pas une rencontre qu'on traverse en passant. C'est un **\u00e9v\u00e9nement qu'on pr\u00e9pare**. L'exploration du biome, la compr\u00e9hension de son \u00e9cosyst\u00e8me, l'observation des esp\u00e8ces qui vivent autour de l'Apex \u2014 tout \u00e7a est la pr\u00e9paration du raid. En temps r\u00e9el, sans tour par tour."},
      {type:"callout",color:"amber",text:"L'Apex ne combat qu'en dernier recours. Il envoie les autres d'abord parce que c'est sa logique de survie \u2014 **lui, il ne peut pas se permettre de tomber, parce que tout l'\u00e9cosyst\u00e8me tombe avec lui**. Les trois phases racontent cette logique : il d\u00e9l\u00e8gue, il s'implique, il se r\u00e9v\u00e8le."},
      {type:"divider"},
      {type:"phase-block",num:1,title:"La meute active, l'Apex en retrait",color:"green",text:"L'Apex est **pr\u00e9sent et visible** d\u00e8s le d\u00e9but \u2014 mais passif. Il observe, se d\u00e9place en arri\u00e8re-plan, intimide. Peut-\u00eatre un coup de semonce occasionnel. Les **trois minions** sont actifs : chacun a sa propre barre de vie, ses patterns, son r\u00f4le. Le joueur g\u00e8re en temps r\u00e9el \u2014 esquives, attaques, soins. *Objectif : disperser ou vaincre les minions pour d\u00e9clencher la Phase 2.*"},
      {type:"phase-block",num:2,title:"L'Apex entre en jeu",color:"amber",text:"L'Apex **active sa propre barre de vie** et participe activement. Les minions encore debout sont toujours l\u00e0 \u2014 plusieurs menaces simultan\u00e9es. L'Apex a ses propres patterns mais reste en mode \u00ab chef de meute \u00bb : il coordonne encore. La pression monte, les ressources sont entam\u00e9es. *D\u00e9cider quoi prioriser : finir les minions ou cibler l'Apex.*"},
      {type:"phase-block",num:3,title:"L'Apex seul \u2014 patterns complets",color:"coral",text:"Plus de minions. L'Apex l\u00e2che **tout son potentiel** \u2014 patterns complets, attaques in\u00e9dites qu'il retenait, comportements de pr\u00e9dateur apex pur. Le joueur arrive entam\u00e9. La Phase 3 r\u00e9compense d'avoir bien g\u00e9r\u00e9 les ressources depuis le d\u00e9but. *C'est le vrai combat de boss. L'Apex est incapturable dans cette phase.*"},
      {type:"divider"},
      {type:"h2",text:"Les 3 minions \u2014 composition vari\u00e9e"},
      {type:"mechanic",title:"Repr\u00e9sentants du biome",icon:"\u25c8",text:"Les trois minions sont des Pok\u00e9mon embl\u00e9matiques de la zone \u2014 esp\u00e8ces vari\u00e9es, pas la m\u00eame famille. Leur composition **d\u00e9crit le biome** : un joueur attentif peut anticiper la faune de la zone avant de l'avoir enti\u00e8rement explor\u00e9e."},
      {type:"mechanic",title:"Quatre configurations possibles",icon:"\u25c6",text:"**Trio asym\u00e9trique** : rapide/tank/attaquant. **Trio synergique** : les trois pens\u00e9s pour fonctionner ensemble, affront\u00e9s s\u00e9par\u00e9ment. **Trio narratif** : du plus commun au plus rare \u2014 le raid est une lecture du biome. **Trio \u00e0 inversion** : le plus dur n'est pas le dernier."},
      {type:"divider"},
      {type:"mechanic",title:"Loot",icon:"\u25c7",text:"Mat\u00e9riaux biologiques exclusifs \u00e0 l'esp\u00e8ce Apex. Rapport\u00e9s \u00e0 Wollemi et \u00c9lia : avancement de la recherche. Conserv\u00e9s : effets passifs dans le biome concern\u00e9."},
      {type:"mechanic",title:"R\u00e9apparition \u2014 la capture diff\u00e9r\u00e9e",icon:"\u25ce",text:"Quand l'Apex r\u00e9appara\u00eet (d\u00e9lai narratif, souvent post-game), il est **seul dans son biome**. Pas de phases. M\u00eame set strat\u00e9gique \u2014 le joueur sait \u00e0 quoi s'attendre, mais l'objectif change : affaiblir sans KO."},
      {type:"callout",color:"green",text:"Vaincre un Apex, c'est aussi **d\u00e9s\u00e9quilibrer temporairement le biome**. L'\u00e9cosyst\u00e8me r\u00e9agit \u2014 proies plus nombreuses et agressives, esp\u00e8ces qui disparaissent. L'\u00e9quilibre revient quand l'Apex revient."}
    ]}
  ],
  expediteurs:[
    {num:"\u00d72",name:"Pr. Wollemi",role:"Chef d'exp\u00e9dition \u2014 s\u00e9curit\u00e9 redondante",type:null,color:"gray",status:"secure",imgUrl:`${BASE}/Professeur%20Wollemi.png`,desc:"Sp\u00e9cialiste en xenog\u00e9nomique et biologie \u00e9volutive compar\u00e9e. Cherche ce que tout le monde a cess\u00e9 de chercher \u2014 l'origine non-terrestre du g\u00e9nome humain.",objective:"Atteindre le point d'impact originel de la m\u00e9t\u00e9orite de Deoxys, collecter des preuves de la Source X, prouver que les humains sont le r\u00e9sultat d'une contamination cosmique accidentelle."},
    {num:"\u00d71",name:"\u00c9lia",role:"Doctorante \u00b7 Rivale \u00e9motionnelle",type:null,color:"purple",status:"secure",imgUrl:`${BASE}/Assistante%20E%CC%81lia.png`,desc:"Doctorante brillante en troisi\u00e8me ann\u00e9e. Deux articles publi\u00e9s \u00e0 24 ans. Elle a choisi Wollemi parce qu'elle croyait en sa th\u00e8se avant m\u00eame de le rencontrer.",objective:"Valider empiriquement les hypoth\u00e8ses de Wollemi sur le Marqueur X. Attente implicite : recevoir enfin la validation explicite que Wollemi exprime seulement par la confiance.",arc:"Jalouse de la l\u00e9g\u00e8ret\u00e9 du protagoniste. Son arc : comprendre que la vraie question est ce qu'elle veut, elle, ind\u00e9pendamment de Wollemi. Ce n'est pas l'arc d'une antagoniste.",trigger:"La validation qu'on attend d'un seul \u00eatre"},
    {num:"\u00d71",name:"Le Protagoniste",role:"L'homme de terrain",type:null,color:"amber",status:"secure",imgUrl:`${BASE}/Protagoniste.png`,desc:"Pas de dipl\u00f4me, pas de titre. Ce qu'il sait faire, c'est trouver des Pok\u00e9mon que personne d'autre ne trouve.",objective:"Explorer et cartographier la Pang\u00e9e. Suivre la r\u00e9sonance des \u00c9clats X. Rapporter donn\u00e9es, observations et \u00e9chantillons biologiques \u00e0 Wollemi et \u00c9lia."},
    {num:"\u00d71",name:"Dr. Sekine Hana",role:"Biologiste / M\u00e9decin",type:"Poison",color:"poison",status:"recover",imgUrl:`${BASE}/Dr.%20Sekine%20Hana.png`,desc:"Biologiste sp\u00e9cialis\u00e9e en biologie primitive et biochimie environnementale, m\u00e9decin attitr\u00e9e. Son type Poison refl\u00e8te sa sp\u00e9cialit\u00e9 : la biologie comme force qui colonise tout espace disponible.",objective:"Documentation biologique des \u00e9cosyst\u00e8mes primitifs. Soins m\u00e9dicaux de l'\u00e9quipe.",arc:"Face aux \u00e9cosyst\u00e8mes intacts, elle perd tout sens des priorit\u00e9s. Pr\u00e9l\u00e8vements non autoris\u00e9s, isolement, refus d'abandonner un site lors d'une alerte.",trigger:"Incapacit\u00e9 \u00e0 hi\u00e9rarchiser face \u00e0 l'unique"},
    {num:"\u00d71",name:"Cdt. Oreste Vael",role:"Militaire \u2014 agenda cach\u00e9",type:"Acier",color:"steel",status:"recover",imgUrl:`${BASE}/Commandant%20Oreste%20Vael.png`,desc:"D\u00e9l\u00e9gu\u00e9 pour la s\u00e9curit\u00e9. Calme, d\u00e9cisif, techniquement comp\u00e9tent. Sa cr\u00e9dibilit\u00e9 est r\u00e9elle.",objective:"Officiel : s\u00e9curit\u00e9. R\u00e9el : \u00e9valuer les applications strat\u00e9giques de la Fissure pour une agence gouvernementale non mentionn\u00e9e.",arc:"D\u00e9cisions unilat\u00e9rales au nom de la s\u00e9curit\u00e9. Certaines servent le groupe, d'autres ses ordres. Quand confront\u00e9, il explique \u2014 et son explication est presque convaincante.",trigger:"La loyaut\u00e9 a plusieurs ma\u00eetres"},
    {num:"\u00d71",name:"Mira Solano",role:"Journaliste / Attach\u00e9e",type:"Normal",color:"gray",status:"recover",imgUrl:`${BASE}/Mira%20Solano.png`,desc:"Officiellement attach\u00e9e gouvernementale. R\u00e9ellement sous contrat exclusif avec un grand r\u00e9seau m\u00e9diatique.",objective:"R\u00e9el : livrer toutes les donn\u00e9es avant toute publication scientifique.",arc:"Quand d\u00e9couverte, elle ne fuit pas \u2014 elle n\u00e9gocie. Instille des demi-v\u00e9rit\u00e9s pour que sa trahison disparaisse dans le bruit g\u00e9n\u00e9ral.",trigger:"Le journalisme comme pr\u00e9dation"},
    {num:"\u00d71",name:"Theo Marrant",role:"Logicien \u2014 22 ans",type:"\u00c9lectrik",color:"amber",status:"recover",imgUrl:`${BASE}/Theo%20Marrant.png`,desc:"22 ans. Co-auteur anonyme des mod\u00e8les qui ont permis de calculer la Fissure. 6 semaines seul \u00e0 Gen\u00e8ve.",objective:"Valider sur le terrain les mod\u00e8les de pr\u00e9diction du comportement de Deoxys.",arc:"Une erreur de calcul \u2014 variable non quantifiable, comportement \u00e9motionnel de Deoxys \u2014 met un membre en danger. Il ne sait pas comment exister dans un monde o\u00f9 ses erreurs ont des cons\u00e9quences physiques.",trigger:"L'effondrement de la grille de lecture"},
    {num:"\u00d71",name:"S\u0153ur In\u00eas Carvalho",role:"Th\u00e9ologienne",type:"F\u00e9e",color:"pink",status:"recover",imgUrl:`${BASE}/S%C5%93ur%20Ine%CC%82s%20Carvalho.png`,desc:"Repr\u00e9sentante d'une institution religieuse majeure. Directe, dr\u00f4le, d\u00e9brouillarde, rod\u00e9e au terrain.",objective:"Caution \u00e9thique et politique. Garantir qu'on ne joue pas \u00e0 Arceus.",arc:"Crise de foi silencieuse \u2014 ce qu'elle voit confirme ce qu'elle avait r\u00e9fut\u00e9. Elle ne cesse pas de croire, mais ce en quoi elle croit se transforme. Refuse de rendre son \u00c9clat parce qu'elle n'est pas pr\u00eate \u00e0 rentrer.",trigger:"La foi qui mue, pas qui c\u00e8de"},
    {num:"\u00d71",name:"Riku Ashida",role:"Ancien Champion \u2014 ami de Wollemi",type:"Combat",color:"coral",status:"recover",imgUrl:`${BASE}/Riku%20Ashida.png`,desc:"Ancien finaliste de Ligues majeures. Ami de Wollemi depuis l'universit\u00e9. \u00c0 la retraite.",objective:"S\u00e9curit\u00e9 de combat, expertise dresseur dans un environnement inconnu.",arc:"Sa vision du dressage ne fonctionne pas dans la Pang\u00e9e. Face \u00e0 Deoxys, une vieille ambition se rallume : capturer l'incapturable, prouver que le titre de Ma\u00eetre lui avait toujours appartenu.",trigger:"L'ambition que l'on croyait morte"},
    {num:"\u00d71",name:"Caspian Shore",role:"Milliardaire \u2014 financement",type:"Dragon",color:"teal",status:"recover",imgUrl:`${BASE}/Caspian%20Shore.png`,desc:"58 ans. Fortune dans les technologies d'exploration g\u00e9ophysique. A tout financ\u00e9. A pos\u00e9 une seule condition : il part avec eux.",objective:"Officiel : financement et logistique. R\u00e9el : \u00eatre l\u00e0 pour voir. Et peut-\u00eatre poss\u00e9der.",arc:"A pass\u00e9 sa vie \u00e0 poss\u00e9der des choses uniques. Deoxys est la chose la plus unique que quiconque ait jamais approch\u00e9e. L'id\u00e9e de le capturer germe lentement, sans se formuler.",trigger:"Poss\u00e9der comme r\u00e9flexe identitaire"},
    {num:"\u00d71",name:"Arjun Vasi",role:"Artiste / Documentariste",type:"T\u00e9n\u00e8bre",color:"dark",status:"recover",imgUrl:`${BASE}/Arjun%20Vasi.png`,desc:"Peintre, \u00e9crivain, philosophe selon les jours. Invit\u00e9 par Shore contre l'avis de Wollemi. Son art n'a pas peur de montrer la cruaut\u00e9 du monde. Le type T\u00e9n\u00e8bre dit l'absence de filtre, pas le mal.",objective:"Documenter ce que \u00e7a fait d'\u00eatre l\u00e0 \u2014 pas ce que \u00e7a signifie.",arc:"Dissolution progressive. Dispara\u00eet seul pour des p\u00e9riodes de plus en plus longues \u2014 pas pour accomplir quelque chose, mais parce que ce qu'il voit le consume. Pour le retrouver, comprendre ce qu'il cherchait.",trigger:"L'observateur consum\u00e9 par ce qu'il observe"}
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
