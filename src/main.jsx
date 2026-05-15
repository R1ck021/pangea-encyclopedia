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
  pink:{l:"#FBEAF0",m:"#D4537E",d:"#72243E",b:"#EE97B4"}
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
  <p style={{fontSize:13.5,lineHeight:1.75,color:m.txS,fontStyle:'italic',margin:'0 0 8px'}}>"{text}"</p>
  {author&&<div style={{fontSize:11,color:m.txM,textAlign:'right'}}>— {author}</div>}
</div>
const Mechanic = ({title,icon,text,chain}) => <div style={{display:'flex',gap:12,marginBottom:14}}>
  <span style={{fontSize:13,width:18,flexShrink:0,color:m.txM,paddingTop:2}}>{icon||'◈'}</span>
  <div style={{flex:1}}>
    <div style={{fontSize:13,fontWeight:600,color:m.tx,marginBottom:3}}>{title}</div>
    <p style={{fontSize:13.5,lineHeight:1.65,color:m.txS,margin:0}}><Txt t={text}/></p>
    {chain&&<div style={{display:'flex',alignItems:'center',gap:4,flexWrap:'wrap',marginTop:9}}>
      {chain.map((s,i)=><span key={i} style={{display:'flex',alignItems:'center',gap:4}}>
        <span style={{fontSize:11,padding:'2px 9px',borderRadius:99,background:m.bgM,border:`1px solid ${m.bd}`,color:m.txS}}>{s}</span>
        {i<chain.length-1&&<span style={{fontSize:9,color:m.txH}}>→</span>}
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
      {['stats','capacité','talent'].map(t=><button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:'8px 0',fontSize:11.5,fontWeight:tab===t?600:400,color:tab===t?c.d:m.txM,background:tab===t?m.bg:'transparent',border:'none',borderBottom:tab===t?`2px solid ${c.m}`:'2px solid transparent',cursor:'pointer',textTransform:'capitalize'}}>{t}</button>)}
    </div>
    <div style={{padding:'14px 18px',background:m.bg}}>
      {tab==='stats'&&Object.entries(data.stats).map(([k,v])=><StatBar key={k} label={k} value={v}/>)}
      {tab==='capacité'&&<div>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:9,gap:8,flexWrap:'wrap'}}>
          <div style={{fontSize:13,fontWeight:600,color:m.tx}}>Signature : {data.signature.name}</div>
          <div style={{display:'flex',gap:4}}>
            {[`${data.signature.pwr} pwr`,`${data.signature.acc}%`,`${data.signature.pp} PP`].map((x,i)=><span key={i} style={{fontSize:10,padding:'2px 7px',borderRadius:99,background:m.bgM,border:`1px solid ${m.bd}`,color:m.txS}}>{x}</span>)}
          </div>
        </div>
        <p style={{fontSize:13.5,lineHeight:1.6,color:m.txS,marginBottom:12}}>{data.signature.desc}</p>
        <div style={{fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:9}}>Autres capacités</div>
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
                  <span>{mv.pwr!=null?mv.pwr:'—'}</span><span style={{color:m.txH}}>·</span>
                  <span>{mv.acc!=null?`${mv.acc}%`:'—%'}</span><span style={{color:m.txH}}>·</span>
                  <span>{mv.pp} PP</span>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>}
      {tab==='talent'&&<div>
        <div style={{fontSize:13,fontWeight:600,color:m.tx,marginBottom:5}}>Talent caché : {data.talent.name}</div>
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
        {person.trigger&&<div style={{marginTop:8,fontSize:11,color:c.m,display:'flex',gap:5,alignItems:'center'}}><span style={{fontSize:9}}>◆</span>{person.trigger}</div>}
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
          <span style={{fontSize:10,color:m.txM}}>{e.num} éclat{e.num==='×2'?'s':''}</span>
        </div>
        <div style={{fontSize:11,color:open?c.m:m.txM}}>{e.role}</div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
        {e.type&&<Tag color={e.color} label={e.type} sm/>}
        <span style={{fontSize:10,padding:'2px 8px',borderRadius:99,background:e.status==='secure'?D.green.l:D.amber.l,color:e.status==='secure'?D.green.d:D.amber.d,border:`1px solid ${e.status==='secure'?D.green.b:D.amber.b}`}}>
          {e.status==='secure'?'Sécurisé':'À récupérer'}
        </span>
        <span style={{fontSize:12,color:m.txM,width:16,textAlign:'center'}}>{open?'↑':'↓'}</span>
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
          <span style={{fontSize:9}}>◆</span>
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
      {[{label:'Éclats sécurisés',value:'4',c:'green'},{label:'À récupérer',value:'8',c:'amber'}].map((it,i)=><div key={i} style={{background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:8,padding:'9px 13px'}}>
        <div style={{fontSize:10,color:m.txM,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:3}}>{it.label}</div>
        <div style={{fontSize:24,fontWeight:700,color:D[it.c].m}}>{it.value}</div>
      </div>)}
    </div>
    <div style={{fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>Sécurisés au départ</div>
    {secure.map((e,i)=><ExpediteurCard key={i} e={e}/>)}
    <div style={{height:10}}/>
    <div style={{fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>À récupérer dans la Pangée</div>
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
        const r=await window.storage.get('pangea-enc-v13')
        setData(r&&r.value?JSON.parse(r.value):DEFAULT_DATA)
      }catch{ setData(DEFAULT_DATA) }
      setLoading(false)
    }
    load()
  },[])

  useEffect(()=>{ if(mainRef.current) mainRef.current.scrollTop=0 },[sectionId])

  if(loading) return <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:m.bg}}><div style={{fontSize:13,color:m.txM}}>Chargement…</div></div>

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
      {prev?<button onClick={()=>setSectionId(prev.id)} style={{display:'flex',alignItems:'center',gap:6,background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:8,cursor:'pointer',color:m.txS,fontSize:12,padding:'7px 12px'}}>← {prev.label}</button>:<div/>}
      {next?<button onClick={()=>setSectionId(next.id)} style={{display:'flex',alignItems:'center',gap:6,background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:8,cursor:'pointer',color:m.txS,fontSize:12,padding:'7px 12px'}}>{next.label} →</button>:<div/>}
    </div>
  </>

  if(isMobile) return <div style={{position:'fixed',inset:0,display:'flex',flexDirection:'column',fontFamily:'system-ui,-apple-system,sans-serif',color:m.tx,background:m.bg}}>
    {menuOpen&&<div style={{position:'absolute',inset:0,zIndex:200}} onClick={()=>setMenuOpen(false)}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.3)'}}/>
      <div style={{position:'absolute',top:0,left:0,bottom:0,width:'80%',maxWidth:280,background:m.bg,borderRight:`1px solid ${m.bd}`,display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:'14px 16px 10px',borderBottom:`1px solid ${m.bd}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:m.tx}}>Pokémon Legends · Pangée</div>
            <div style={{fontSize:10,color:m.txM,marginTop:1}}>Encyclopédie de conception</div>
          </div>
          <button onClick={()=>setMenuOpen(false)} style={{background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:6,fontSize:13,cursor:'pointer',color:m.txS,padding:'3px 8px',lineHeight:1.4}}>✕</button>
        </div>
        <Nav/>
      </div>
    </div>}
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderBottom:`1px solid ${m.bd}`,background:m.bgS,flexShrink:0}}>
      <button onClick={()=>setMenuOpen(true)} style={{background:m.bg,border:`1px solid ${m.bd}`,borderRadius:7,padding:'6px 10px',cursor:'pointer',fontSize:15,lineHeight:1,color:m.tx,flexShrink:0}}>☰</button>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:12,fontWeight:600,color:m.tx,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{section.title}</div>
        <div style={{fontSize:10,color:m.txM}}>{section.group} · {section.label}</div>
      </div>
      <span style={{fontSize:10,padding:'2px 8px',borderRadius:99,background:sc.l,color:sc.d,border:`1px solid ${sc.b}`,fontWeight:600,flexShrink:0}}>{section.badge}</span>
    </div>
    {section.summary&&<div style={{padding:'9px 14px',background:sk.l,borderBottom:`1px solid ${sk.b}`,flexShrink:0}}>
      <p style={{fontSize:12,color:sk.d,margin:0,lineHeight:1.5}}>{section.summary}</p>
    </div>}
    <div ref={mainRef} style={{flex:1,overflowY:'auto',padding:'16px 14px 24px'}}><Content/></div>
    <div style={{padding:'10px 14px',borderTop:`1px solid ${m.bd}`,background:m.bgS,flexShrink:0}}>
      <div style={{fontSize:10,color:m.txM,textAlign:'center'}}>{data.meta.version} · {data.meta.lastUpdated}</div>
    </div>
  </div>

  return <div style={{position:'fixed',inset:0,display:'flex',fontFamily:'system-ui,-apple-system,sans-serif',color:m.tx,background:m.bg}}>
    <div style={{width:200,flexShrink:0,borderRight:`1px solid ${m.bd}`,background:m.bgS,display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{padding:'16px 14px 12px',borderBottom:`1px solid ${m.bd}`,flexShrink:0}}>
        <div style={{fontSize:12,fontWeight:700,color:m.tx,lineHeight:1.3}}>Pokémon Legends</div>
        <div style={{fontSize:10,color:m.txM,marginTop:2}}>Pangée · Encyclopédie</div>
      </div>
      <Nav/>
      <div style={{padding:'10px 10px 14px',borderTop:`1px solid ${m.bd}`,flexShrink:0}}>
        <span style={{fontSize:9.5,color:m.txM}}>{data.meta.version} · {data.meta.lastUpdated}</span>
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
  meta:{title:"Pokémon Legends : Pangée",subtitle:"Encyclopédie de conception",version:"v3.0",lastUpdated:new Date().toISOString().split('T')[0]},
  sections:[
    {id:"monde",label:"La Région",group:"Univers",color:"amber",badge:"Cadre temporel",badgeColor:"amber",title:"Pangée & Panthalassa",meta:"Plusieurs centaines de millions d'années avant notre ère",summary:"Le continent unique et l'océan primordial — cadre géographique et temporel du jeu.",content:[
      {type:"lead",text:"Il y a des centaines de millions d'années, existait **un seul continent** et **un seul océan**. La Pangée — terre primordiale brute et hostile — et Panthalassa, l'océan infini qui l'enveloppait de toutes parts."},
      {type:"para",text:"Ce n'était pas un monde accueillant. Les volcans redessinaient les côtes jour après jour. Les tempêtes de Panthalassa duraient des années entières. La frontière entre la terre et la mer n'était pas une ligne — c'était une *zone de tension permanente entre deux forces qui refusaient de coexister*."},
      {type:"para",text:"C'est dans ce chaos que la vie a trouvé son chemin. Et c'est dans ce chaos qu'une chose venue de beaucoup plus loin que la mer ou la montagne s'est écrasée sur la planète pour la première fois."},
      {type:"divider"},
      {type:"h2",text:"Caractéristiques du monde"},
      {type:"cards3",items:[{name:"Pangée",icon:"🌋",sub:"Le continent unique",desc:"Terre brute, volcanique, en formation permanente. Chaque éruption redessine ses contours. Groudon en est l'âme consciente."},{name:"Panthalassa",icon:"🌊",sub:"L'océan infini",desc:"Vaste et insondable. Ses abysses abritent des formes de vie que la lumière n'a jamais atteintes. Kyogre en est l'expression vivante."},{name:"Stratosphère",icon:"⚡",sub:"L'espace entre les deux",desc:"Territoire de Rayquaza, arbitre des deux forces. Il est le premier à détecter les anomalies venues du cosmos."}]},
      {type:"divider"},
      {type:"h2",text:"La tension fondamentale"},
      {type:"callout",color:"amber",text:"L'opposition entre Groudon et Kyogre n'est pas une guerre. C'est une tension fondamentale qui *définit la planète*. Depuis des éons, un équilibre précaire — hostile mais stable — maintient la vie possible. Le jeu commence au moment où cet équilibre est rompu par l'arrivée de Deoxys."}
    ]},
    {id:"cosmogonie",label:"Légendaires & Fabuleux",group:"Univers",color:"coral",badge:"Légendaires",badgeColor:"coral",title:"Légendaires & Fabuleux",meta:"Légendaires fondateurs · Le cycle éternel et ce qui le brise",summary:"Groudon, Kyogre, Rayquaza, Deoxys, Arceus, Regigigas — les six entités qui définissent et transforment le monde primordial.",content:[
      {type:"lead",text:"Six entités structurent l'équilibre du monde. Trois sont nées de la planète. Une vient du vide interstellaire. Une observe de partout et de nulle part. Une a été agglomérée par une intention trop grande pour rester sans forme."},
      {type:"h2",text:"Le cycle éternel — Groudon, Kyogre, Rayquaza"},
      {type:"legendary-grid",items:[
        {name:"Groudon",imgKey:"groudon",sub:"L'Âme de la Pangée",types:[["coral","Feu"],["amber","Sol"]],color:"coral",text:"Groudon n'est pas né de la Pangée. Il **est** la Pangée. Dans sa Forme Primo, ses flancs sont couverts de fissures de lave, ses yeux comme deux cratères actifs. Il ne se déplace pas : il est le sol lui-même qui se soulève. C'est un **bâtisseur inconscient** — il crée la terre non par intention, mais parce que c'est sa nature."},
        {name:"Kyogre",imgKey:"kyogre",sub:"L'Âme de Panthalassa",types:[["blue","Eau"]],color:"blue",text:"Kyogre est Panthalassa. Ses mouvements sont les courants océaniques, ses humeurs sont les tempêtes. Dans sa Forme Primo, ses motifs lumineux projettent des aurores sous-marines visibles depuis les côtes la nuit. Il ne cherche pas à détruire la terre — il cherche à *l'engloutir par nature*."},
        {name:"Mega Rayquaza",imgKey:"rayquaza",sub:"L'Arbitre des Cieux",types:[["green","Dragon"],["gray","Vol"]],color:"green",text:"Rayquaza vit dans la stratosphère. Il appartient à *l'espace entre les deux* — ni Groudon ni Kyogre. À cette époque, il est en forme Méga permanente. Son combat avec la météorite a créé son **mikado organ**. Pour la première fois, l'arbitre est lui-même modifié par ce qu'il arbitre. Il n'est plus neutre."},
        {name:"Deoxys ⭐",imgKey:"deoxys",sub:"L'Intrus Cosmique — Légendaire central",types:[["purple","Cosmique"]],color:"purple",text:"Virus interstellaire projeté vers la planète par un événement inconnu. Il combat Rayquaza dans la stratosphère, survit mutant, et s'écrase sur la Pangée. Ses quatre formes sont des états d'adaptation à un monde qu'il ne comprend pas encore. Il n'est pas mauvais — il est *radicalement étranger* à tout ce qui existe ici."}
      ]},
      {type:"callout",color:"coral",text:"Depuis des éons, le même schéma se répète : la tension monte entre Groudon et Kyogre, le conflit éclate en Formes Primo, Rayquaza descend et arbitre, l'équilibre revient. Arceus le sait. Il le tolère. Il lui fait confiance. **Ce système est brutal mais stable — il a toujours suffi.**"},
      {type:"mechanic",title:"Ce que Deoxys change",icon:"⭐",text:"L'arrivée de Deoxys introduit trois variables simultanées qu'aucun cycle précédent n'a connues : **Rayquaza est lui-même altéré** par l'énergie X. **L'énergie X introduit une fréquence** que le système planétaire ne peut pas absorber. **La vie sur la planète est désormais exposée** à une accumulation d'énergie potentiellement irréversible.",chain:["Tension habituelle","Conflit Formes Primo","Rayquaza arbitre","→ Mais cette fois : impossible"]},
      {type:"divider"},
      {type:"h2",text:"Arceus — Le regard qui déclenche"},
      {type:"legendary-grid",items:[
        {name:"Arceus",imgKey:"arceus",sub:"Présence causale invisible — n'apparaît jamais directement",types:[["gray","Normal"]],color:"amber",text:"Arceus n'apparaît jamais directement dans les événements du jeu. Il est une **présence déduite, pas observée**. Depuis des éons, il fait confiance au cycle. Deoxys ne déclenche pas son intervention parce qu'il est une menace immédiate — mais parce que trois variables se cumulent pour la première fois et rendent tout cycle futur potentiellement irréversible. Sa réponse : *une mise à jour du système*."},
        {name:"Regigigas",imgKey:"regigigas",sub:"Le Golem Cosmique — Réponse planétaire",types:[["gray","Normal"]],color:"gray",text:"Regigigas n'a pas de créateur au sens strict. Il a une **cause** (la volonté d'Arceus) et un **matériau** (la Pangée elle-même). Pas sculpté, pas conçu — **aggloméré** par une intention trop grande pour rester sans forme. Sa mission : briser la Pangée, tirer les masses continentales, disperser les Éclats X dans des strates géologiques distinctes. Puis il entre en dormance — là où la Pangée était la plus dense, ce qui deviendra Sinnoh."}
      ]},
      {type:"divider"},
      {type:"h2",text:"Les quatre formes de Deoxys"},
      {type:"cards4",items:[{name:"Normale",tag:"Éveil",desc:"L'état d'observation. Deoxys tente de comprendre ce monde inconnu."},{name:"Attaque",tag:"Réaction",desc:"La réaction défensive face à l'agression. Instinct de survie activé."},{name:"Défense",tag:"Repli",desc:"Le repli, la survie. Deoxys se protège d'un monde hostile."},{name:"Vitesse",tag:"Exploration",desc:"La fuite, la cartographie. Deoxys explore ce qu'il ne comprend pas."}]},
      {type:"divider"},
      {type:"mechanic",title:"Slow Start — Se réveiller coûte quelque chose",icon:"◇",text:"Regigigas n'est pas un être vivant au sens plein. Chaque réveil lui coûte quelque chose de fondamental — comme si la matière devait se rappeler d'elle-même ce qu'elle est censée faire, sans avoir de mémoire pour s'en souvenir. Le **Slow Start** n'est pas une faiblesse mécanique. C'est la trace narrative de ce qu'il est : un golem qui doit se reconstituer à chaque fois qu'une volonté extérieure l'y force."}
    ]},
    {id:"starters",label:"Starters",group:"Univers",color:"green",badge:"Starters",badgeColor:"green",title:"Les Starters de Pangée",meta:"Les trois Pokémon de départ proposés par le Pr. Wollemi",summary:"Typhlosion, Serperior et Primarina dans leurs formes régionales — nées de l'équilibre entre Groudon et Kyogre.",content:[
      {type:"lead",text:"Nées de l'équilibre fragile entre Groudon et Kyogre, ces trois formes régionales sont les *manifestations vivantes* des conditions qui ont rendu la vie possible sur Pangée."},
      {type:"starter-block",data:{name:"Typhlosion de Pangée",quote:"La Terre en fusion",color:"coral",types:[["coral","Feu"],["gray","Roche"]],desc:"Né des premières éruptions de la Pangée, sa fourrure s'est pétrifiée en basalte incandescent. Ses flammes ne brûlent plus vers le haut — elles *coulent vers le bas comme de la lave*. Il ne court pas : il avance comme une coulée, inévitable et implacable.",stats:{PV:98,Attaque:118,Défense:95,"Atq Spé":74,"Déf Spé":80,Vitesse:92},totalBST:557,signature:{name:"Frappe Magma",pwr:90,acc:100,pp:10,desc:"Le lanceur s'abat sur la cible avec un poing de roche en fusion. La lave qui se solidifie à l'impact réduit la Vitesse de la cible d'un cran."},talent:{name:"Corps Ardent",desc:"Les capacités directes reçues ont 30% de chances de brûler leur lanceur."},moves:[{name:"Nitrocharge",type:"coral",pwr:50,acc:100,pp:20},{name:"Éboulement",type:"gray",pwr:75,acc:90,pp:10},{name:"Séisme",type:"amber",pwr:100,acc:100,pp:10},{name:"Gyroballe",type:"gray",pwr:null,acc:100,pp:5}]}},
      {type:"starter-block",data:{name:"Serperior de Pangée",quote:"La Nature vénérable",color:"green",types:[["green","Plante"],["blue","Dragon"]],desc:"Incarnation de la végétation primordiale de la Pangée — massive, primitive, indestructible. Ses écailles ressemblent à de l'écorce d'arbre millénaire. Il ne combat jamais en premier. Il n'en a jamais eu besoin.",stats:{PV:75,Attaque:115,Défense:90,"Atq Spé":60,"Déf Spé":83,Vitesse:125},totalBST:548,signature:{name:"Étreinte Sylvestre",pwr:100,acc:75,pp:10,desc:"Le lanceur s'enroule violemment autour de la cible et la broie dans ses écailles. Empêche la cible de quitter le terrain tant que Serperior reste au combat."},talent:{name:"Multiécaille",desc:"Diminue les dégâts subis par les capacités offensives si le Pokémon a tous ses PV."},moves:[{name:"Danse Draco",type:"blue",pwr:null,acc:null,pp:20},{name:"Lame Feuille",type:"green",pwr:90,acc:100,pp:15},{name:"Rafale Écailles",type:"blue",pwr:25,acc:90,pp:20},{name:"Vitesse Extrême",type:"gray",pwr:80,acc:100,pp:5}]}},
      {type:"starter-block",data:{name:"Primarina de Pangée",quote:"L'Eau mystérieuse",color:"blue",types:[["blue","Eau"],["purple","Spectre"]],desc:"Née des abysses de Panthalassa, là où la lumière n'est jamais arrivée. Elle est translucide, bioluminescente par intermittence, visible seulement quand elle le décide. Elle est la première à *sentir* l'arrivée de Deoxys — avant même que Rayquaza ne le détecte.",stats:{PV:100,Attaque:60,Défense:75,"Atq Spé":112,"Déf Spé":124,Vitesse:85},totalBST:556,signature:{name:"Mirage Abyssal",pwr:70,acc:100,pp:10,desc:"Le lanceur distord les reflets lumineux autour de lui pour frapper depuis un angle imperceptible. Inflige des dégâts et 50% de chances de rendre la cible confuse."},talent:{name:"Médic Nature",desc:"Le Pokémon soigne ses altérations de statut s'il switch ou en fin de combat."},moves:[{name:"Surf",type:"blue",pwr:90,acc:100,pp:15},{name:"Fontaine de Vie",type:"blue",pwr:null,acc:null,pp:10},{name:"Châtiment",type:"purple",pwr:65,acc:100,pp:10},{name:"Éclat Magique",type:"pink",pwr:80,acc:100,pp:10}]}}
    ]},
    {id:"eclats",label:"Les Éclats X",group:"Science",color:"blue",badge:"Science",badgeColor:"blue",title:"Les Éclats X",meta:"Fragments de la météorite · Mécanique centrale du jeu",summary:"Les fragments cosmiques qui ont rendu la planète perméable à toutes les énergies extérieures.",content:[
      {type:"lead",text:"La météorite ne s'est pas vaporisée à l'impact. Elle s'est fragmentée. Chacun de ses éclats porte une quantité infime mais mesurable de l'**énergie X** — l'énergie cosmique originelle."},
      {type:"info-row",items:[{label:"Fragments dispersés",value:"Des dizaines à centaines"},{label:"Zone de dispersion",value:"Des milliers de km"},{label:"Éclats nécessaires",value:"12 exactement"}]},
      {type:"divider"},
      {type:"mechanic",title:"Signature dormante",icon:"◇",text:"Pris isolément, un Éclat X est dormant. Sa signature isotopique est impossible à produire par des processus géologiques terrestres. Sa micro-structure cristalline ne ressemble à rien de connu. Il attend."},
      {type:"mechanic",title:"Résonance collective",icon:"◈",text:"Réunis, les Éclats entrent en résonance — une émission d'énergie basse fréquence dont l'intensité croît avec le nombre de fragments rassemblés. Comme les morceaux d'un même enregistrement qui cherche à se rejouer.",chain:["1 Éclat : dormant","Plusieurs : résonance","12 réunis : seuil critique","La Fissure s'ouvre"]},
      {type:"mechanic",title:"Imprégnation planétaire",icon:"◉",text:"L'énergie X s'est diffusée dans la croûte terrestre, les océans et l'atmosphère. La planète est devenue *perméable aux énergies cosmiques extérieures*. Les Éclats X ne sont pas la source des phénomènes extraordinaires — ils sont la raison pour laquelle la planète était **capable de les absorber**."},
      {type:"divider"},
      {type:"h2",text:"Connexions inter-univers Pokémon"},
      {type:"conn-table",items:[{label:"Méga-Évolution",origin:"Hoenn",desc:"Mikado organ de Rayquaza, énergie X directe lors du combat originel"},{label:"Formes Primo",origin:"Hoenn",desc:"Groudon / Kyogre retrouvant l'état antérieur à l'interférence X"},{label:"Dynamax",origin:"Galar",desc:"Eternatus (astéroïde, -20 000 ans) — ancré via perméabilité planétaire"},{label:"Téracristallisation",origin:"Paldea",desc:"Terapagos, énergie biologique intrinsèque — ancrée via perméabilité"},{label:"Cristaux-Z",origin:"Alola",desc:"Necrozma (Ultra-Espace), nature photonique distincte des Éclats X"}]}
    ]},
    {id:"marqueur",label:"Le Marqueur X",group:"Science",color:"purple",badge:"Xenogénomique",badgeColor:"purple",title:"Le Marqueur X & la Divergence",meta:"Thèse centrale du Pr. Wollemi · L'origine humaine",summary:"La question que personne ne posait : d'où viennent les humains ?",content:[
      {type:"lead",text:"La communauté scientifique s'est accordée sur un récit fondateur. Ce récit est cohérent, documenté, et accepté. Ce qu'il n'explique pas, c'est **les humains**."},
      {type:"callout",color:"purple",text:"Les humains ne descendent pas de Mew. Wollemi appelle ce problème *la Divergence*. Dans l'ADN humain se trouvent des séquences dormantes qui n'appartiennent à aucune lignée évolutive terrestre identifiable — présentes chez tous les humains, absentes de tous les Pokémon."},
      {type:"mechanic",title:"La Source X — l'hypothèse non publiée",icon:"⭐",text:"Le Marqueur X partage avec l'ADN de Deoxys une logique structurelle que rien d'autre ne partage. L'hypothèse : Deoxys, ou un ancêtre cosmique de Deoxys, aurait introduit dans les premières formes de vie de la Pangée un matériau génétique exogène. Les humains seraient **le résultat d'une contamination cosmique accidentelle**."},
      {type:"quote",text:"Les phénomènes extraordinaires de transformation que nous observons à travers les régions — Méga-Évolution, Formes Primo, Dynamax, Téracristallisation — ne sont pas des accidents locaux. Ils sont des expressions régionales d'une perméabilité planétaire globale. Cette perméabilité a une date. Elle a un cratère.",author:"Pr. Wollemi, notes personnelles"}
    ]},
    {id:"fissure",label:"La Fissure",group:"Science",color:"teal",badge:"Mécanique centrale",badgeColor:"teal",title:"La Fissure",meta:"Le portail temporel · Dispositif d'activation",summary:"La connexion directe entre le présent et le sol de la Pangée au moment de l'impact.",content:[
      {type:"lead",text:"En cartographiant la distribution des Éclats Premiers et en remontant la dérive des continents par modélisation géophysique, Wollemi et **Arjun Vasi** ont calculé le point d'impact originel — aujourd'hui sous **quatre mille mètres d'eau**, au fond de l'Atlantique."},
      {type:"mechanic",title:"Pas un voyage dans le temps",icon:"◎",text:"La Fissure n'est pas un voyage dans le temps au sens abstrait. Une reconnexion directe entre deux points de la **même planète** séparés par le temps : ici, aujourd'hui, et le sol de la Pangée au moment précis de l'impact de la météorite."},
      {type:"mechanic",title:"Le seuil de résonance critique",icon:"✦",text:"Douze Éclats X réunis dans les bonnes conditions géométriques, activés par l'énergie calculée dans les modèles de **Arjun Vasi**, atteignent un seuil de résonance critique. À ce seuil, la résonance **rouvre** l'impact originel.",chain:["12 Éclats réunis","Configuration géométrique exacte","Seuil critique atteint","La Fissure s'ouvre"]},
      {type:"callout",color:"teal",text:"**Le portail de retour ne s'ouvre que lorsque les douze Éclats sont réunis et activés simultanément.** Ce que personne n'anticipe : que certains membres utiliseront leur fragment comme levier de pouvoir le moment venu."}
    ]},
    {id:"protagoniste",label:"Le Protagoniste",group:"Personnages",color:"amber",badge:"Joueur",badgeColor:"amber",title:"Le Protagoniste",meta:"L'homme de terrain · Alter ego du joueur",summary:"Pas de diplôme, pas de titre. Une méthode que personne d'autre n'a.",content:[
      {type:"lead",text:"Tu n'es pas chercheur. Tu n'as jamais publié d'article. Ce que tu sais faire, c'est trouver des Pokémon que personne d'autre ne trouve."},
      {type:"mechanic",title:"La méthode",icon:"◎",text:"Tu sais lire un territoire, comprendre ce qu'un Pokémon sauvage tolère ou refuse, sentir le moment où l'approche est possible et celui où elle ne l'est pas encore. Tu construis de la confiance sans la forcer."},
      {type:"divider"},
      {type:"h2",text:"Le choix du starter"},
      {type:"para",text:"Wollemi t'emmène dans la serre d'élevage du laboratoire. Il se tourne vers toi et dit simplement : *Je t'en dois un depuis longtemps. Prends celui avec lequel tu te sens.* C'est seulement après, Pokémon en main, qu'il t'explique tout le reste."},
      {type:"starter-choice",items:[{name:"Héricendre",evolution:"→ Typhlosion de Pangée",types:[["coral","Feu"],["gray","Roche"]],color:"coral",desc:"Le bâtisseur inévitable. Puissance physique brute et endurance volcanique."},{name:"Vipélierre",evolution:"→ Serperior de Pangée",types:[["green","Plante"],["blue","Dragon"]],color:"green",desc:"Le vénérable. Vitesse et contrôle — ne frappe jamais en premier."},{name:"Otaquin",evolution:"→ Primarina de Pangée",types:[["blue","Eau"],["purple","Spectre"]],color:"purple",desc:"L'invisible. Attaque spéciale — toujours un coup d'avance."}]},
      {type:"divider"},
      {type:"h2",text:"Élia — La rivale silencieuse"},
      {type:"callout",color:"purple",text:"Élia a investi dans Wollemi comme on investit dans quelqu'un dont on attend une validation explicite en retour. Quand elle te voit arriver — sans diplôme, avec ta façon informelle d'exister dans l'espace du Professeur — elle enregistre la chaleur qu'il a pour toi. Elle ne dit rien. Elle stocke. **Elle est jalouse de ta légèreté.**"}
    ]},
    {id:"wollemi-elia",label:"Wollemi & Élia",group:"Personnages",color:"gray",badge:"PNJ fondateurs",badgeColor:"gray",title:"Professeur Wollemi & Élia",meta:"Chef d'expédition · Doctorante · Le binôme scientifique",summary:"Le chercheur qui cherche ce que tout le monde a cessé de chercher, et l'assistante qui a tout investi pour être là.",content:[
      {type:"lead",text:"Le *Wollemia nobilis* — surnommé le dinosaure botanique — a été découvert vivant en 1994. Morphologiquement inchangé depuis 200 millions d'années, il a vu la Pangée. Le Professeur Wollemi partage quelque chose avec l'arbre qui lui a donné son nom."},
      {type:"persons-grid",items:[{initials:"W",color:"gray",imgUrl:`${BASE}/Professeur%20Wollemi.png`,name:"Professeur Wollemi",role:"Chef d'expédition · Xenogénomique · Biologie évolutive comparée",desc:"Spécialisé en biologie évolutive comparée et en *xenogénomique* — l'étude des séquences génétiques présentes chez les humains et les Pokémon qui ne s'expliquent par aucun mécanisme évolutif terrestre connu. Sa thèse publiée en 2012 a été accueillie avec scepticisme poli."}]},
      {type:"quote",text:"Les phénomènes extraordinaires de transformation que nous observons à travers les régions — Méga-Évolution, Formes Primo, Dynamax, Téracristallisation — ne sont pas des accidents locaux. Ils sont des expressions régionales d'une perméabilité planétaire globale.",author:"Pr. Wollemi, notes personnelles"},
      {type:"divider"},
      {type:"h2",text:"Élia"},
      {type:"callout",color:"purple",text:"Doctorante brillante, deux articles publiés à 24 ans. Elle a choisi Wollemi parce qu'elle croyait en sa thèse avant même de le rencontrer. Ce qui la ronge : elle attend une validation explicite que Wollemi exprime par la confiance, pas par les mots. Son arc : comprendre progressivement que la vraie question est ce qu'elle veut, elle, indépendamment de lui."}
    ]},
    {id:"expedition",label:"L'expédition",group:"Personnages",color:"gray",badge:"8 personnages",badgeColor:"gray",title:"Les 8 Expéditeurs",meta:"Porteurs des Éclats X · Confrontations narratives",summary:"Chaque membre détient un Éclat. Chaque arc révèle une limite humaine. Chaque confrontation est inévitable.",content:[
      {type:"lead",text:"Chaque membre porte un Éclat X — sans lequel le groupe ne peut pas rentrer. Cliquer sur une carte pour voir le profil complet, les objectifs et l'arc narratif."},
      {type:"eclat-table"}
    ]},
    {id:"mecanique",label:"Mécaniques de jeu",group:"Conception",color:"purple",badge:"Game Design",badgeColor:"purple",title:"Mécaniques de jeu",meta:"Systèmes de combat · Progression narrative · Types",summary:"Le type Cosmique, la mécanique des Éclats et les connexions entre phénomènes.",content:[
      {type:"lead",text:"Le cœur mécanique du jeu repose sur trois systèmes imbriqués : le **type Cosmique**, la **progression par Éclats**, et la **perméabilité planétaire** qui relie tous les phénomènes extraordinaires du monde Pokémon."},
      {type:"mechanic",title:"Le type Cosmique",icon:"⭐",text:"Deoxys reçoit le **type Cosmique** — un type qui n'obéit pas aux règles des types terrestres, qui ne s'inscrit dans aucun des équilibres naturels établis par Groudon et Kyogre."},
      {type:"mechanic",title:"8 Éclats = 8 arcs narratifs",icon:"◆",text:"Chaque Éclat X est détenu par un membre de l'expédition. Les récupérer n'est pas une suite de combats — c'est une suite de *confrontations humaines*. Chaque arc révèle pourquoi ce personnage a choisi de prioriser ses propres objectifs sur la cohésion du groupe.",chain:["Trouver le membre","Comprendre son arc","Confrontation","Récupérer l'Éclat"]},
      {type:"divider"},
      {type:"h2",text:"Types des expéditeurs"},
      {type:"type-grid",items:[
        {name:"Hana",type:"Plante",color:"green"},
        {name:"Vael",type:"Acier",color:"steel"},
        {name:"Solano",type:"Normal",color:"gray"},
        {name:"Marrant",type:"Électrik",color:"amber"},
        {name:"Carvalho",type:"Fée",color:"pink"},
        {name:"Ashida",type:"Combat",color:"coral"},
        {name:"Shore",type:"Dragon",color:"teal"},
        {name:"Vasi",type:"Spectre",color:"purple"}
      ]}
    ]}
  ],
  expediteurs:[
    {num:"×2",name:"Pr. Wollemi",role:"Chef d'expédition — redondance de sécurité",type:null,color:"gray",status:"secure",
     imgUrl:`${BASE}/Professeur%20Wollemi.png`,
     desc:"Spécialiste en xenogénomique et biologie évolutive comparée. Cherche ce que tout le monde a cessé de chercher — l'origine non-terrestre du génome humain. Sa thèse sur la Divergence a été publiée en 2012 et accueillie avec scepticisme poli par la communauté scientifique.",
     objective:"Atteindre le point d'impact originel de la météorite de Deoxys, collecter des preuves de la Source X, et prouver que les humains sont le résultat d'une contamination cosmique accidentelle."},
    {num:"×1",name:"Élia",role:"Doctorante · Rivale émotionnelle",type:null,color:"gray",status:"secure",
     imgUrl:`${BASE}/Assistante%20E%CC%81lia.png`,
     desc:"Doctorante brillante en troisième année sous la direction de Wollemi. Deux articles publiés à 24 ans. Elle a choisi Wollemi parce qu'elle croyait en sa thèse avant même de le rencontrer.",
     objective:"Valider empiriquement les hypothèses de Wollemi sur le Marqueur X. En attente implicite : recevoir enfin la validation explicite que Wollemi exprime seulement par la confiance, jamais par les mots.",
     arc:"Sa jalousie n'est pas caricaturale — elle est jalouse de la légèreté du protagoniste, de son absence de besoin de prouver quelque chose. Son arc : comprendre que la vraie question est ce qu'elle veut, elle, indépendamment de Wollemi.",
     trigger:"La validation qu'on attend d'un seul être"},
    {num:"×1",name:"Le Protagoniste",role:"L'homme de terrain",type:null,color:"amber",status:"secure",
     imgUrl:`${BASE}/Protagoniste.png`,
     desc:"Pas de diplôme, pas de titre. Ce qu'il sait faire, c'est trouver des Pokémon que personne d'autre ne trouve — et établir avec eux une relation suffisamment stable pour les ramener vivants.",
     objective:"Servir d'interface entre les Pokémon de la Pangée et l'équipe. Construire du contact sans forcer. Travailler au rythme de l'autre."},
    {num:"×1",name:"Dr. Sekine Hana",role:"Biologiste / Médecin",type:"Plante",color:"green",status:"recover",
     imgUrl:`${BASE}/Dr.%20Sekine%20Hana.png`,
     desc:"Biologiste spécialisée en biologie primitive et biochimie environnementale, également médecin attitrée de l'expédition. Brillante et instable face aux opportunités trop grandes.",
     objective:"Documentation biologique des écosystèmes primitifs de la Pangée. Soins médicaux de l'équipe.",
     arc:"Face aux écosystèmes primitifs intacts — des espèces éteintes depuis 200 millions d'années — elle perd tout sens éthique et des priorités. Commence à prélever des échantillons sans autorisation, s'isole du groupe pour des observations non planifiées. Refuse d'abandonner un site lors d'une alerte de sécurité.",
     trigger:"Incapacité à hiérarchiser face à l'unique"},
    {num:"×1",name:"Cdt. Oreste Vael",role:"Militaire — agenda caché",type:"Acier",color:"steel",status:"recover",
     imgUrl:`${BASE}/Commandant%20Oreste%20Vael.png`,
     desc:"Délégué officiellement pour assurer la sécurité de l'expédition. Calme, décisif, techniquement compétent dans des environnements hostiles.",
     objective:"Officiel : sécurité de l'expédition. Réel : évaluer les applications stratégiques de la Fissure et de l'énergie de Deoxys pour une agence gouvernementale non mentionnée dans les accréditations.",
     arc:"Sa crédibilité est réelle, ses objectifs dissimulés derrière elle. Commence à prendre des décisions unilatérales au nom de la sécurité collective — certaines servent le groupe, d'autres servent ses ordres. Quand confronté, il explique — et son explication est presque convaincante.",
     trigger:"La loyauté a plusieurs maîtres"},
    {num:"×1",name:"Mira Solano",role:"Journaliste / Attachée",type:"Normal",color:"gray",status:"recover",
     imgUrl:`${BASE}/Mira%20Solano.png`,
     desc:"Officiellement envoyée par un gouvernement régional pour documenter l'expédition. En réalité sous contrat exclusif avec un grand réseau médiatique.",
     objective:"Officiel : archivage public de l'expédition. Réel : livrer toutes les données — analyses, images, découvertes biologiques, observations sur Deoxys — à son réseau avant toute publication scientifique.",
     arc:"Copie méthodiquement toutes les données depuis le premier jour. Quand découverte, elle ne fuit pas — elle négocie, et instille des demi-vérités dans le groupe pour que sa propre trahison disparaisse dans le bruit général.",
     trigger:"Le journalisme comme prédation"},
    {num:"×1",name:"Theo Marrant",role:"Logicien — 22 ans",type:"Électrik",color:"amber",status:"recover",
     imgUrl:`${BASE}/Theo%20Marrant.png`,
     desc:"22 ans. Co-auteur anonyme des modèles mathématiques qui ont permis à Wollemi de calculer la localisation de la Fissure. A construit les équations en 6 semaines seul dans une chambre d'hôtel à Genève.",
     objective:"Valider sur le terrain les modèles de prédiction du comportement de Deoxys. Traiter la Pangée comme un environnement de données.",
     arc:"Une erreur de calcul — une variable qu'il a sous-évaluée parce qu'elle n'était pas quantifiable, relevant du comportement émotionnel de Deoxys — met directement en danger un membre du groupe. Il ne sait pas comment exister dans un monde où ses erreurs ont des conséquences physiques.",
     trigger:"L'effondrement de la grille de lecture"},
    {num:"×1",name:"Sœur Inês Carvalho",role:"Théologienne",type:"Fée",color:"pink",status:"recover",
     imgUrl:`${BASE}/S%C5%93ur%20Ine%CC%82s%20Carvalho.png`,
     desc:"Représentante d'une institution religieuse majeure. Femme de fort caractère, directe, drôle, débrouillarde, rodée au terrain par des années de missions humanitaires.",
     objective:"Caution éthique et politique de l'expédition. Garantir qu'on ne 'joue pas à Arceus'. Résister avec des faits et des questions, pas avec de l'obstruction.",
     arc:"Une crise de foi personnelle et silencieuse — ce qu'elle voit de ses propres yeux confirme des éléments de la thèse de Wollemi qu'elle avait réfutés avec des arguments théologiques solides. Elle ne cesse pas de croire. Mais ce en quoi elle croit se transforme sous ses pieds. Refuse de rendre son Éclat parce qu'elle n'est pas encore prête à rentrer.",
     trigger:"La foi qui mue, pas qui cède"},
    {num:"×1",name:"Riku Ashida",role:"Ancien Champion — ami de Wollemi",type:"Combat",color:"coral",status:"recover",
     imgUrl:`${BASE}/Riku%20Ashida.png`,
     desc:"Ancien finaliste de plusieurs Ligues majeures, ancien yakuza repenti. Ami de longue date de Wollemi depuis l'université. À la retraite depuis plusieurs années.",
     objective:"Sécurité de combat et expertise dresseur dans un environnement inconnu. Être là si ça tourne mal.",
     arc:"Sa vision du dressage — fondée sur la maîtrise technique — entre en friction avec l'approche du protagoniste. Dans la Pangée, les règles du dressage classique ne fonctionnent pas. Puis, face à Deoxys, une vieille ambition qu'il croyait morte se rallume : capturer l'incapturable. Prouver que le titre de Maître lui avait toujours appartenu.",
     trigger:"L'ambition que l'on croyait morte"},
    {num:"×1",name:"Caspian Shore",role:"Milliardaire — financement",type:"Dragon",color:"teal",status:"recover",
     imgUrl:`${BASE}/Caspian%20Shore.png`,
     desc:"58 ans. Fortune construite dans les technologies d'exploration géophysique. A financé l'acquisition des Éclats manquants, le recrutement de l'équipe et la construction du dispositif d'activation.",
     objective:"Officiel : financement et logistique. Réel : être là pour voir. Et peut-être posséder.",
     arc:"A passé sa vie à posséder des choses uniques. La Pangée est remplie de choses uniques. Et Deoxys est la chose la plus unique que quiconque ait jamais approchée. L'idée de le capturer germe lentement, sans se formuler — elle existe juste, dans ses décisions et ses déplacements.",
     trigger:"Posséder comme réflexe identitaire"},
    {num:"×1",name:"Arjun Vasi",role:"Artiste / Documentariste",type:"Spectre",color:"purple",status:"recover",
     imgUrl:`${BASE}/Arjun%20Vasi.png`,
     desc:"Peintre, écrivain, philosophe selon les jours. Invité personnellement par Shore contre l'avis de Wollemi. Son rôle : témoigner, pas analyser. Un œil sans grille de lecture.",
     objective:"Documenter ce que ça fait d'être là — pas ce que ça signifie. Ses carnets accumulent des croquis naturalistes d'une précision remarquable et des pages de réflexions sur ce que c'est qu'être humain dans un monde qui existait avant l'humanité.",
     arc:"Sa dissolution est progressive. Il commence à disparaître seul dans la Pangée pour des périodes de plus en plus longues — non pas pour accomplir quelque chose, mais parce que ce qu'il voit le consume d'une manière qu'il n'essaie pas de contenir. Pour le retrouver, il faut d'abord comprendre ce qu'il cherchait.",
     trigger:"L'observateur consumé par ce qu'il observe"}
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
