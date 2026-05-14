import React, { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'

// âââ THEME âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
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
  gray:{l:"#F1EFE8",m:"#888780",d:"#3A3935",b:"#C4C2B8"},
  pink:{l:"#FBEAF0",m:"#D4537E",d:"#72243E",b:"#EE97B4"}
}

// âââ SIMPLE TEXT RENDERER ââââââââââââââââââââââââââââââââââââââââââââââââââââ
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

// âââ BLOCK RENDERERS âââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
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
  {author&&<div style={{fontSize:11,color:m.txM,textAlign:'right'}}>â {author}</div>}
</div>
const Mechanic = ({title,icon,text,chain}) => <div style={{display:'flex',gap:12,marginBottom:14}}>
  <span style={{fontSize:13,width:18,flexShrink:0,color:m.txM,paddingTop:2}}>{icon||'â'}</span>
  <div style={{flex:1}}>
    <div style={{fontSize:13,fontWeight:600,color:m.tx,marginBottom:3}}>{title}</div>
    <p style={{fontSize:13.5,lineHeight:1.65,color:m.txS,margin:0}}><Txt t={text}/></p>
    {chain&&<div style={{display:'flex',alignItems:'center',gap:4,flexWrap:'wrap',marginTop:9}}>
      {chain.map((s,i)=><span key={i} style={{display:'flex',alignItems:'center',gap:4}}>
        <span style={{fontSize:11,padding:'2px 9px',borderRadius:99,background:m.bgM,border:`1px solid ${m.bd}`,color:m.txS}}>{s}</span>
        {i<chain.length-1&&<span style={{fontSize:9,color:m.txH}}>â</span>}
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

// Starter images (base64 from original bundle - using placeholder approach)
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
      {['stats','capacitÃ©','talent'].map(t=><button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:'8px 0',fontSize:11.5,fontWeight:tab===t?600:400,color:tab===t?c.d:m.txM,background:tab===t?m.bg:'transparent',border:'none',borderBottom:tab===t?`2px solid ${c.m}`:'2px solid transparent',cursor:'pointer',textTransform:'capitalize'}}>{t}</button>)}
    </div>
    <div style={{padding:'14px 18px',background:m.bg}}>
      {tab==='stats'&&Object.entries(data.stats).map(([k,v])=><StatBar key={k} label={k} value={v}/>)}
      {tab==='capacitÃ©'&&<div>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:9,gap:8,flexWrap:'wrap'}}>
          <div style={{fontSize:13,fontWeight:600,color:m.tx}}>Signature : {data.signature.name}</div>
          <div style={{display:'flex',gap:4}}>
            {[`${data.signature.pwr} pwr`,`${data.signature.acc}%`,`${data.signature.pp} PP`].map((x,i)=><span key={i} style={{fontSize:10,padding:'2px 7px',borderRadius:99,background:m.bgM,border:`1px solid ${m.bd}`,color:m.txS}}>{x}</span>)}
          </div>
        </div>
        <p style={{fontSize:13.5,lineHeight:1.6,color:m.txS,marginBottom:12}}>{data.signature.desc}</p>
        <div style={{fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:9}}>Autres capacitÃ©s</div>
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
                  <span>{mv.pwr!=null?mv.pwr:'â'}</span><span style={{color:m.txH}}>Â·</span>
                  <span>{mv.acc!=null?`${mv.acc}%`:'â%'}</span><span style={{color:m.txH}}>Â·</span>
                  <span>{mv.pp} PP</span>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>}
      {tab==='talent'&&<div>
        <div style={{fontSize:13,fontWeight:600,color:m.tx,marginBottom:5}}>Talent cachÃ© : {data.talent.name}</div>
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

function PersonCard({person}){
  const c=D[person.color]||D.gray
  return <div style={{border:`1px solid ${m.bd}`,borderRadius:12,overflow:'hidden',marginBottom:18}}>
    <div style={{background:c.l,borderBottom:`1px solid ${c.b}`,padding:'18px 20px',display:'flex',gap:16,alignItems:'flex-start'}}>
      <div style={{width:72,height:72,borderRadius:'50%',background:c.l,border:`2px solid ${c.b}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,color:c.d,flexShrink:0}}>{person.initials}</div>
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
        {person.trigger&&<div style={{marginTop:8,fontSize:11,color:c.m,display:'flex',gap:5,alignItems:'center'}}><span style={{fontSize:9}}>â</span>{person.trigger}</div>}
      </div>}
    </div>
  </div>
}

function EclatTable({expediteurs}){
  const [open,setOpen] = useState(null)
  const secure=expediteurs.filter(e=>e.status==='secure')
  const recover=expediteurs.filter(e=>e.status==='recover')
  return <div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:16}}>
      {[{label:'Ãclats sÃ©curisÃ©s',value:'4',c:'green'},{label:'Ã rÃ©cupÃ©rer',value:'8',c:'amber'}].map((it,i)=><div key={i} style={{background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:8,padding:'9px 13px'}}>
        <div style={{fontSize:10,color:m.txM,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:3}}>{it.label}</div>
        <div style={{fontSize:24,fontWeight:700,color:D[it.c].m}}>{it.value}</div>
      </div>)}
    </div>
    <div style={{fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>SÃ©curisÃ©s au dÃ©part</div>
    {secure.map((e,i)=>{
      const c=D[e.color]||D.gray
      return <div key={i} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 12px',background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:8,marginBottom:5}}>
        <span style={{fontSize:10,color:m.txM,width:20}}>{e.num}</span>
        <div style={{width:28,height:28,borderRadius:'50%',background:c.l,color:c.d,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:600,flexShrink:0,border:`1.5px solid ${c.b}`}}>{e.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:600,color:m.tx}}>{e.name}</div>
          <div style={{fontSize:11,color:m.txM}}>{e.role}</div>
        </div>
        <span style={{fontSize:10,padding:'2px 8px',borderRadius:99,background:D.green.l,color:D.green.d,border:`1px solid ${D.green.b}`}}>SÃ©curisÃ©</span>
      </div>
    })}
    <div style={{height:14}}/>
    <div style={{fontSize:10,fontWeight:600,color:m.txM,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Ã rÃ©cupÃ©rer dans la PangÃ©e</div>
    {recover.map((e,i)=>{
      const isOpen=open===i, c=D[e.color]||D.gray
      return <div key={i} style={{marginBottom:5,border:`1px solid ${m.bd}`,borderRadius:8,overflow:'hidden'}}>
        <button onClick={()=>setOpen(isOpen?null:i)} style={{width:'100%',display:'flex',alignItems:'center',gap:9,padding:'8px 12px',background:m.bgS,border:'none',cursor:'pointer',textAlign:'left'}}>
          <span style={{fontSize:10,color:m.txM,width:20}}>{e.num}</span>
          <div style={{width:28,height:28,borderRadius:'50%',background:c.l,color:c.d,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:600,flexShrink:0,border:`1.5px solid ${c.b}`}}>{e.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
          <div style={{flex:1,textAlign:'left'}}>
            <div style={{fontSize:13,fontWeight:600,color:m.tx}}>{e.name}</div>
            <div style={{fontSize:11,color:m.txM}}>{e.role}</div>
          </div>
          {e.type&&<Tag color={e.color} label={e.type} sm/>}
          <span style={{fontSize:10,padding:'2px 8px',borderRadius:99,background:D.amber.l,color:D.amber.d,border:`1px solid ${D.amber.b}`,flexShrink:0}}>Ã rÃ©cupÃ©rer</span>
          <span style={{fontSize:11,color:m.txM,marginLeft:2,flexShrink:0}}>{isOpen?'â':'â'}</span>
        </button>
        {isOpen&&<div style={{padding:'10px 12px 12px 49px',background:m.bg,borderTop:`1px solid ${m.bd}`}}>
          <p style={{fontSize:13,lineHeight:1.6,color:m.txS,margin:'0 0 7px'}}>{e.arc}</p>
          {e.trigger&&<div style={{fontSize:11,color:c.m,display:'flex',gap:5,alignItems:'center'}}><span style={{fontSize:9}}>â</span>{e.trigger}</div>}
        </div>}
      </div>
    })}
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

// âââ BLOCK DISPATCHER ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
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

// âââ MAIN APP âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
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

  if(loading) return <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:m.bg}}><div style={{fontSize:13,color:m.txM}}>Chargementâ¦</div></div>

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
      {prev?<button onClick={()=>setSectionId(prev.id)} style={{display:'flex',alignItems:'center',gap:6,background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:8,cursor:'pointer',color:m.txS,fontSize:12,padding:'7px 12px'}}>â {prev.label}</button>:<div/>}
      {next?<button onClick={()=>setSectionId(next.id)} style={{display:'flex',alignItems:'center',gap:6,background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:8,cursor:'pointer',color:m.txS,fontSize:12,padding:'7px 12px'}}>{next.label} â</button>:<div/>}
    </div>
  </>

  if(isMobile) return <div style={{position:'fixed',inset:0,display:'flex',flexDirection:'column',fontFamily:'system-ui,-apple-system,sans-serif',color:m.tx,background:m.bg}}>
    {menuOpen&&<div style={{position:'absolute',inset:0,zIndex:200}} onClick={()=>setMenuOpen(false)}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.3)'}}/>
      <div style={{position:'absolute',top:0,left:0,bottom:0,width:'80%',maxWidth:280,background:m.bg,borderRight:`1px solid ${m.bd}`,display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:'14px 16px 10px',borderBottom:`1px solid ${m.bd}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:m.tx}}>PokÃ©mon Legends Â· PangÃ©e</div>
            <div style={{fontSize:10,color:m.txM,marginTop:1}}>EncyclopÃ©die de conception</div>
          </div>
          <button onClick={()=>setMenuOpen(false)} style={{background:m.bgS,border:`1px solid ${m.bd}`,borderRadius:6,fontSize:13,cursor:'pointer',color:m.txS,padding:'3px 8px',lineHeight:1.4}}>â</button>
        </div>
        <Nav/>
      </div>
    </div>}
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderBottom:`1px solid ${m.bd}`,background:m.bgS,flexShrink:0}}>
      <button onClick={()=>setMenuOpen(true)} style={{background:m.bg,border:`1px solid ${m.bd}`,borderRadius:7,padding:'6px 10px',cursor:'pointer',fontSize:15,lineHeight:1,color:m.tx,flexShrink:0}}>â°</button>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:12,fontWeight:600,color:m.tx,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{section.title}</div>
        <div style={{fontSize:10,color:m.txM}}>{section.group} Â· {section.label}</div>
      </div>
      <span style={{fontSize:10,padding:'2px 8px',borderRadius:99,background:sc.l,color:sc.d,border:`1px solid ${sc.b}`,fontWeight:600,flexShrink:0}}>{section.badge}</span>
    </div>
    {section.summary&&<div style={{padding:'9px 14px',background:sk.l,borderBottom:`1px solid ${sk.b}`,flexShrink:0}}>
      <p style={{fontSize:12,color:sk.d,margin:0,lineHeight:1.5}}>{section.summary}</p>
    </div>}
    <div ref={mainRef} style={{flex:1,overflowY:'auto',padding:'16px 14px 24px'}}><Content/></div>
    <div style={{padding:'10px 14px',borderTop:`1px solid ${m.bd}`,background:m.bgS,flexShrink:0}}>
      <div style={{fontSize:10,color:m.txM,textAlign:'center'}}>{data.meta.version} Â· {data.meta.lastUpdated}</div>
    </div>
  </div>

  return <div style={{position:'fixed',inset:0,display:'flex',fontFamily:'system-ui,-apple-system,sans-serif',color:m.tx,background:m.bg}}>
    <div style={{width:200,flexShrink:0,borderRight:`1px solid ${m.bd}`,background:m.bgS,display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{padding:'16px 14px 12px',borderBottom:`1px solid ${m.bd}`,flexShrink:0}}>
        <div style={{fontSize:12,fontWeight:700,color:m.tx,lineHeight:1.3}}>PokÃ©mon Legends</div>
        <div style={{fontSize:10,color:m.txM,marginTop:2}}>PangÃ©e Â· EncyclopÃ©die</div>
      </div>
      <Nav/>
      <div style={{padding:'10px 10px 14px',borderTop:`1px solid ${m.bd}`,flexShrink:0}}>
        <span style={{fontSize:9.5,color:m.txM}}>{data.meta.version} Â· {data.meta.lastUpdated}</span>
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

// âââ DATA ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const DEFAULT_DATA = {
  meta:{title:"PokÃ©mon Legends : PangÃ©e",subtitle:"EncyclopÃ©die de conception",version:"v3.0",lastUpdated:new Date().toISOString().split('T')[0]},
  sections:[
    {id:"monde",label:"La RÃ©gion",group:"Univers",color:"amber",badge:"Cadre temporel",badgeColor:"amber",title:"PangÃ©e & Panthalassa",meta:"Plusieurs centaines de millions d'annÃ©es avant notre Ã¨re",summary:"Le continent unique et l'ocÃ©an primordial â cadre gÃ©ographique et temporel du jeu.",content:[
      {type:"lead",text:"Il y a des centaines de millions d'annÃ©es, existait **un seul continent** et **un seul ocÃ©an**. La PangÃ©e â terre primordiale brute et hostile â et Panthalassa, l'ocÃ©an infini qui l'enveloppait de toutes parts."},
      {type:"para",text:"Ce n'Ã©tait pas un monde accueillant. Les volcans redessinaient les cÃ´tes jour aprÃ¨s jour. Les tempÃªtes de Panthalassa duraient des annÃ©es entiÃ¨res. La frontiÃ¨re entre la terre et la mer n'Ã©tait pas une ligne â c'Ã©tait une *zone de tension permanente entre deux forces qui refusaient de coexister*."},
      {type:"para",text:"C'est dans ce chaos que la vie a trouvÃ© son chemin. Et c'est dans ce chaos qu'une chose venue de beaucoup plus loin que la mer ou la montagne s'est Ã©crasÃ©e sur la planÃ¨te pour la premiÃ¨re fois."},
      {type:"divider"},
      {type:"h2",text:"CaractÃ©ristiques du monde"},
      {type:"cards3",items:[{name:"PangÃ©e",icon:"ð",sub:"Le continent unique",desc:"Terre brute, volcanique, en formation permanente. Chaque Ã©ruption redessine ses contours. Groudon en est l'Ã¢me consciente."},{name:"Panthalassa",icon:"ð",sub:"L'ocÃ©an infini",desc:"Vaste et insondable. Ses abysses abritent des formes de vie que la lumiÃ¨re n'a jamais atteintes. Kyogre en est l'expression vivante."},{name:"StratosphÃ¨re",icon:"â¡",sub:"L'espace entre les deux",desc:"Territoire de Rayquaza, arbitre des deux forces. Il est le premier Ã  dÃ©tecter les anomalies venues du cosmos."}]},
      {type:"divider"},
      {type:"h2",text:"La tension fondamentale"},
      {type:"callout",color:"amber",text:"L'opposition entre Groudon et Kyogre n'est pas une guerre. C'est une tension fondamentale qui *dÃ©finit la planÃ¨te*. Depuis des Ã©ons, un Ã©quilibre prÃ©caire â hostile mais stable â maintient la vie possible. Le jeu commence au moment oÃ¹ cet Ã©quilibre est rompu par l'arrivÃ©e de Deoxys."}
    ]},
    {id:"cosmogonie",label:"LÃ©gendaires & Fabuleux",group:"Univers",color:"coral",badge:"LÃ©gendaires",badgeColor:"coral",title:"LÃ©gendaires & Fabuleux",meta:"LÃ©gendaires fondateurs Â· Le cycle Ã©ternel et ce qui le brise",summary:"Groudon, Kyogre, Rayquaza, Deoxys, Arceus, Regigigas â les six entitÃ©s qui dÃ©finissent et transforment le monde primordial.",content:[
      {type:"lead",text:"Six entitÃ©s structurent l'Ã©quilibre du monde. Trois sont nÃ©es de la planÃ¨te. Une vient du vide interstellaire. Une observe de partout et de nulle part. Une a Ã©tÃ© agglomÃ©rÃ©e par une intention trop grande pour rester sans forme."},
      {type:"h2",text:"Le cycle Ã©ternel â Groudon, Kyogre, Rayquaza"},
      {type:"legendary-grid",items:[
        {name:"Groudon",imgKey:"groudon",sub:"L'Ãme de la PangÃ©e",types:[["coral","Feu"],["amber","Sol"]],color:"coral",text:"Groudon n'est pas nÃ© de la PangÃ©e. Il **est** la PangÃ©e. Dans sa Forme Primo, ses flancs sont couverts de fissures de lave, ses yeux comme deux cratÃ¨res actifs. Il ne se dÃ©place pas : il est le sol lui-mÃªme qui se soulÃ¨ve. C'est un **bÃ¢tisseur inconscient** â il crÃ©e la terre non par intention, mais parce que c'est sa nature."},
        {name:"Kyogre",imgKey:"kyogre",sub:"L'Ãme de Panthalassa",types:[["blue","Eau"]],color:"blue",text:"Kyogre est Panthalassa. Ses mouvements sont les courants ocÃ©aniques, ses humeurs sont les tempÃªtes. Dans sa Forme Primo, ses motifs lumineux projettent des aurores sous-marines visibles depuis les cÃ´tes la nuit. Il ne cherche pas Ã  dÃ©truire la terre â il cherche Ã  *l'engloutir par nature*."},
        {name:"Mega Rayquaza",imgKey:"rayquaza",sub:"L'Arbitre des Cieux",types:[["green","Dragon"],["gray","Vol"]],color:"green",text:"Rayquaza vit dans la stratosphÃ¨re. Il appartient Ã  *l'espace entre les deux* â ni Groudon ni Kyogre. Ã cette Ã©poque, il est en forme MÃ©ga permanente. Son combat avec la mÃ©tÃ©orite a crÃ©Ã© son **mikado organ**. Pour la premiÃ¨re fois, l'arbitre est lui-mÃªme modifiÃ© par ce qu'il arbitre. Il n'est plus neutre."},
        {name:"Deoxys â­",imgKey:"deoxys",sub:"L'Intrus Cosmique â LÃ©gendaire central",types:[["purple","Cosmique"]],color:"purple",text:"Virus interstellaire projetÃ© vers la planÃ¨te par un Ã©vÃ©nement inconnu. Il combat Rayquaza dans la stratosphÃ¨re, survit mutant, et s'Ã©crase sur la PangÃ©e. Ses quatre formes sont des Ã©tats d'adaptation Ã  un monde qu'il ne comprend pas encore. Il n'est pas mauvais â il est *radicalement Ã©tranger* Ã  tout ce qui existe ici."}
      ]},
      {type:"callout",color:"coral",text:"Depuis des Ã©ons, le mÃªme schÃ©ma se rÃ©pÃ¨te : la tension monte entre Groudon et Kyogre, le conflit Ã©clate en Formes Primo, Rayquaza descend et arbitre, l'Ã©quilibre revient. Arceus le sait. Il le tolÃ¨re. Il lui fait confiance. **Ce systÃ¨me est brutal mais stable â il a toujours suffi.**"},
      {type:"mechanic",title:"Ce que Deoxys change",icon:"â­",text:"L'arrivÃ©e de Deoxys introduit trois variables simultanÃ©es qu'aucun cycle prÃ©cÃ©dent n'a connues : **Rayquaza est lui-mÃªme altÃ©rÃ©** par l'Ã©nergie X. **L'Ã©nergie X introduit une frÃ©quence** que le systÃ¨me planÃ©taire ne peut pas absorber. **La vie sur la planÃ¨te est dÃ©sormais exposÃ©e** Ã  une accumulation d'Ã©nergie potentiellement irrÃ©versible.",chain:["Tension habituelle","Conflit Formes Primo","Rayquaza arbitre","â Mais cette fois : impossible"]},
      {type:"divider"},
      {type:"h2",text:"Arceus â Le regard qui dÃ©clenche"},
      {type:"legendary-grid",items:[
        {name:"Arceus",imgKey:"arceus",sub:"PrÃ©sence causale invisible â n'apparaÃ®t jamais directement",types:[["gray","Normal"]],color:"amber",text:"Arceus n'apparaÃ®t jamais directement dans les Ã©vÃ©nements du jeu. Il est une **prÃ©sence dÃ©duite, pas observÃ©e**. Depuis des Ã©ons, il fait confiance au cycle. Deoxys ne dÃ©clenche pas son intervention parce qu'il est une menace immÃ©diate â mais parce que trois variables se cumulent pour la premiÃ¨re fois et rendent tout cycle futur potentiellement irrÃ©versible. Sa rÃ©ponse : *une mise Ã  jour du systÃ¨me*."},
        {name:"Regigigas",imgKey:"regigigas",sub:"Le Golem Cosmique â RÃ©ponse planÃ©taire",types:[["gray","Normal"]],color:"gray",text:"Regigigas n'a pas de crÃ©ateur au sens strict. Il a une **cause** (la volontÃ© d'Arceus) et un **matÃ©riau** (la PangÃ©e elle-mÃªme). Pas sculptÃ©, pas conÃ§u â **agglomÃ©rÃ©** par une intention trop grande pour rester sans forme. Sa mission : briser la PangÃ©e, tirer les masses continentales, disperser les Ãclats X dans des strates gÃ©ologiques distinctes. Puis il entre en dormance â lÃ  oÃ¹ la PangÃ©e Ã©tait la plus dense, ce qui deviendra Sinnoh."}
      ]},
      {type:"divider"},
      {type:"h2",text:"Les quatre formes de Deoxys"},
      {type:"cards4",items:[{name:"Normale",tag:"Ãveil",desc:"L'Ã©tat d'observation. Deoxys tente de comprendre ce monde inconnu."},{name:"Attaque",tag:"RÃ©action",desc:"La rÃ©action dÃ©fensive face Ã  l'agression. Instinct de survie activÃ©."},{name:"DÃ©fense",tag:"Repli",desc:"Le repli, la survie. Deoxys se protÃ¨ge d'un monde hostile."},{name:"Vitesse",tag:"Exploration",desc:"La fuite, la cartographie. Deoxys explore ce qu'il ne comprend pas."}]},
      {type:"divider"},
      {type:"mechanic",title:"Slow Start â Se rÃ©veiller coÃ»te quelque chose",icon:"â",text:"Regigigas n'est pas un Ãªtre vivant au sens plein. Chaque rÃ©veil lui coÃ»te quelque chose de fondamental â comme si la matiÃ¨re devait se rappeler d'elle-mÃªme ce qu'elle est censÃ©e faire, sans avoir de mÃ©moire pour s'en souvenir. Le **Slow Start** n'est pas une faiblesse mÃ©canique. C'est la trace narrative de ce qu'il est : un golem qui doit se reconstituer Ã  chaque fois qu'une volontÃ© extÃ©rieure l'y force."}
    ]},
    {id:"starters",label:"Starters",group:"Univers",color:"green",badge:"Starters",badgeColor:"green",title:"Les Starters de PangÃ©e",meta:"Les trois PokÃ©mon de dÃ©part proposÃ©s par le Pr. Wollemi",summary:"Typhlosion, Serperior et Primarina dans leurs formes rÃ©gionales â nÃ©es de l'Ã©quilibre entre Groudon et Kyogre.",content:[
      {type:"lead",text:"NÃ©es de l'Ã©quilibre fragile entre Groudon et Kyogre, ces trois formes rÃ©gionales sont les *manifestations vivantes* des conditions qui ont rendu la vie possible sur PangÃ©e."},
      {type:"starter-block",data:{name:"Typhlosion de PangÃ©e",quote:"La Terre en fusion",color:"coral",types:[["coral","Feu"],["gray","Roche"]],desc:"NÃ© des premiÃ¨res Ã©ruptions de la PangÃ©e, sa fourrure s'est pÃ©trifiÃ©e en basalte incandescent. Ses flammes ne brÃ»lent plus vers le haut â elles *coulent vers le bas comme de la lave*. Il ne court pas : il avance comme une coulÃ©e, inÃ©vitable et implacable.",stats:{PV:98,Attaque:118,DÃ©fense:95,"Atq SpÃ©":74,"DÃ©f SpÃ©":80,Vitesse:92},totalBST:557,signature:{name:"Frappe Magma",pwr:90,acc:100,pp:10,desc:"Le lanceur s'abat sur la cible avec un poing de roche en fusion. La lave qui se solidifie Ã  l'impact rÃ©duit la Vitesse de la cible d'un cran."},talent:{name:"Corps Ardent",desc:"Les capacitÃ©s directes reÃ§ues ont 30% de chances de brÃ»ler leur lanceur."},moves:[{name:"Nitrocharge",type:"coral",pwr:50,acc:100,pp:20},{name:"Ãboulement",type:"gray",pwr:75,acc:90,pp:10},{name:"SÃ©isme",type:"amber",pwr:100,acc:100,pp:10},{name:"Gyroballe",type:"gray",pwr:null,acc:100,pp:5}]}},
      {type:"starter-block",data:{name:"Serperior de PangÃ©e",quote:"La Nature vÃ©nÃ©rable",color:"green",types:[["green","Plante"],["blue","Dragon"]],desc:"Incarnation de la vÃ©gÃ©tation primordiale de la PangÃ©e â massive, primitive, indestructible. Ses Ã©cailles ressemblent Ã  de l'Ã©corce d'arbre millÃ©naire. Il ne combat jamais en premier. Il n'en a jamais eu besoin.",stats:{PV:75,Attaque:115,DÃ©fense:90,"Atq SpÃ©":60,"DÃ©f SpÃ©":83,Vitesse:125},totalBST:548,signature:{name:"Ãtreinte Sylvestre",pwr:100,acc:75,pp:10,desc:"Le lanceur s'enroule violemment autour de la cible et la broie dans ses Ã©cailles. EmpÃªche la cible de quitter le terrain tant que Serperior reste au combat."},talent:{name:"MultiÃ©caille",desc:"Diminue les dÃ©gÃ¢ts subis par les capacitÃ©s offensives si le PokÃ©mon a tous ses PV."},moves:[{name:"Danse Draco",type:"blue",pwr:null,acc:null,pp:20},{name:"Lame Feuille",type:"green",pwr:90,acc:100,pp:15},{name:"Rafale Ãcailles",type:"blue",pwr:25,acc:90,pp:20},{name:"Vitesse ExtrÃªme",type:"gray",pwr:80,acc:100,pp:5}]}},
      {type:"starter-block",data:{name:"Primarina de PangÃ©e",quote:"L'Eau mystÃ©rieuse",color:"blue",types:[["blue","Eau"],["purple","Spectre"]],desc:"NÃ©e des abysses de Panthalassa, lÃ  oÃ¹ la lumiÃ¨re n'est jamais arrivÃ©e. Elle est translucide, bioluminescente par intermittence, visible seulement quand elle le dÃ©cide. Elle est la premiÃ¨re Ã  *sentir* l'arrivÃ©e de Deoxys â avant mÃªme que Rayquaza ne le dÃ©tecte.",stats:{PV:100,Attaque:60,DÃ©fense:75,"Atq SpÃ©":112,"DÃ©f SpÃ©":124,Vitesse:85},totalBST:556,signature:{name:"Mirage Abyssal",pwr:70,acc:100,pp:10,desc:"Le lanceur distord les reflets lumineux autour de lui pour frapper depuis un angle imperceptible. Inflige des dÃ©gÃ¢ts et 50% de chances de rendre la cible confuse."},talent:{name:"MÃ©dic Nature",desc:"Le PokÃ©mon soigne ses altÃ©rations de statut s'il switch ou en fin de combat."},moves:[{name:"Surf",type:"blue",pwr:90,acc:100,pp:15},{name:"Fontaine de Vie",type:"blue",pwr:null,acc:null,pp:10},{name:"ChÃ¢timent",type:"purple",pwr:65,acc:100,pp:10},{name:"Ãclat Magique",type:"pink",pwr:80,acc:100,pp:10}]}}
    ]},
    {id:"eclats",label:"Les Ãclats X",group:"Science",color:"blue",badge:"Science",badgeColor:"blue",title:"Les Ãclats X",meta:"Fragments de la mÃ©tÃ©orite Â· MÃ©canique centrale du jeu",summary:"Les fragments cosmiques qui ont rendu la planÃ¨te permÃ©able Ã  toutes les Ã©nergies extÃ©rieures.",content:[
      {type:"lead",text:"La mÃ©tÃ©orite ne s'est pas vaporisÃ©e Ã  l'impact. Elle s'est fragmentÃ©e. Chacun de ses Ã©clats porte une quantitÃ© infime mais mesurable de l'**Ã©nergie X** â l'Ã©nergie cosmique originelle."},
      {type:"info-row",items:[{label:"Fragments dispersÃ©s",value:"Des dizaines Ã  centaines"},{label:"Zone de dispersion",value:"Des milliers de km"},{label:"Ãclats nÃ©cessaires",value:"12 exactement"}]},
      {type:"divider"},
      {type:"mechanic",title:"Signature dormante",icon:"â",text:"Pris isolÃ©ment, un Ãclat X est dormant. Sa signature isotopique est impossible Ã  produire par des processus gÃ©ologiques terrestres. Sa micro-structure cristalline ne ressemble Ã  rien de connu. Il attend."},
      {type:"mechanic",title:"RÃ©sonance collective",icon:"â",text:"RÃ©unis, les Ãclats entrent en rÃ©sonance â une Ã©mission d'Ã©nergie basse frÃ©quence dont l'intensitÃ© croÃ®t avec le nombre de fragments rassemblÃ©s. Comme les morceaux d'un mÃªme enregistrement qui cherche Ã  se rejouer.",chain:["1 Ãclat : dormant","Plusieurs : rÃ©sonance","12 rÃ©unis : seuil critique","La Fissure s'ouvre"]},
      {type:"mechanic",title:"ImprÃ©gnation planÃ©taire",icon:"â",text:"L'Ã©nergie X s'est diffusÃ©e dans la croÃ»te terrestre, les ocÃ©ans et l'atmosphÃ¨re. La planÃ¨te est devenue *permÃ©able aux Ã©nergies cosmiques extÃ©rieures*. Les Ãclats X ne sont pas la source des phÃ©nomÃ¨nes extraordinaires â ils sont la raison pour laquelle la planÃ¨te Ã©tait **capable de les absorber**."},
      {type:"divider"},
      {type:"h2",text:"Connexions inter-univers PokÃ©mon"},
      {type:"conn-table",items:[{label:"MÃ©ga-Ãvolution",origin:"Hoenn",desc:"Mikado organ de Rayquaza, Ã©nergie X directe lors du combat originel"},{label:"Formes Primo",origin:"Hoenn",desc:"Groudon / Kyogre retrouvant l'Ã©tat antÃ©rieur Ã  l'interfÃ©rence X"},{label:"Dynamax",origin:"Galar",desc:"Eternatus (astÃ©roÃ¯de, -20 000 ans) â ancrÃ© via permÃ©abilitÃ© planÃ©taire"},{label:"TÃ©racristallisation",origin:"Paldea",desc:"Terapagos, Ã©nergie biologique intrinsÃ¨que â ancrÃ©e via permÃ©abilitÃ©"},{label:"Cristaux-Z",origin:"Alola",desc:"Necrozma (Ultra-Espace), nature photonique distincte des Ãclats X"}]}
    ]},
    {id:"marqueur",label:"Le Marqueur X",group:"Science",color:"purple",badge:"XenogÃ©nomique",badgeColor:"purple",title:"Le Marqueur X & la Divergence",meta:"ThÃ¨se centrale du Pr. Wollemi Â· L'origine humaine",summary:"La question que personne ne posait : d'oÃ¹ viennent les humains ?",content:[
      {type:"lead",text:"La communautÃ© scientifique s'est accordÃ©e sur un rÃ©cit fondateur. Ce rÃ©cit est cohÃ©rent, documentÃ©, et acceptÃ©. Ce qu'il n'explique pas, c'est **les humains**."},
      {type:"callout",color:"purple",text:"Les humains ne descendent pas de Mew. Wollemi appelle ce problÃ¨me *la Divergence*. Dans l'ADN humain se trouvent des sÃ©quences dormantes qui n'appartiennent Ã  aucune lignÃ©e Ã©volutive terrestre identifiable â prÃ©sentes chez tous les humains, absentes de tous les PokÃ©mon."},
      {type:"mechanic",title:"La Source X â l'hypothÃ¨se non publiÃ©e",icon:"â­",text:"Le Marqueur X partage avec l'ADN de Deoxys une logique structurelle que rien d'autre ne partage. L'hypothÃ¨se : Deoxys, ou un ancÃªtre cosmique de Deoxys, aurait introduit dans les premiÃ¨res formes de vie de la PangÃ©e un matÃ©riau gÃ©nÃ©tique exogÃ¨ne. Les humains seraient **le rÃ©sultat d'une contamination cosmique accidentelle**."},
      {type:"quote",text:"Les phÃ©nomÃ¨nes extraordinaires de transformation que nous observons Ã  travers les rÃ©gions â MÃ©ga-Ãvolution, Formes Primo, Dynamax, TÃ©racristallisation â ne sont pas des accidents locaux. Ils sont des expressions rÃ©gionales d'une permÃ©abilitÃ© planÃ©taire globale. Cette permÃ©abilitÃ© a une date. Elle a un cratÃ¨re.",author:"Pr. Wollemi, notes personnelles"}
    ]},
    {id:"fissure",label:"La Fissure",group:"Science",color:"teal",badge:"MÃ©canique centrale",badgeColor:"teal",title:"La Fissure",meta:"Le portail temporel Â· Dispositif d'activation",summary:"La connexion directe entre le prÃ©sent et le sol de la PangÃ©e au moment de l'impact.",content:[
      {type:"lead",text:"En cartographiant la distribution des Ãclats Premiers et en remontant la dÃ©rive des continents par modÃ©lisation gÃ©ophysique, Wollemi et **Arjun Vasi** ont calculÃ© le point d'impact originel â aujourd'hui sous **quatre mille mÃ¨tres d'eau**, au fond de l'Atlantique."},
      {type:"mechanic",title:"Pas un voyage dans le temps",icon:"â",text:"La Fissure n'est pas un voyage dans le temps au sens abstrait. Une reconnexion directe entre deux points de la **mÃªme planÃ¨te** sÃ©parÃ©s par le temps : ici, aujourd'hui, et le sol de la PangÃ©e au moment prÃ©cis de l'impact de la mÃ©tÃ©orite."},
      {type:"mechanic",title:"Le seuil de rÃ©sonance critique",icon:"â¦",text:"Douze Ãclats X rÃ©unis dans les bonnes conditions gÃ©omÃ©triques, activÃ©s par l'Ã©nergie calculÃ©e dans les modÃ¨les de **Arjun Vasi**, atteignent un seuil de rÃ©sonance critique. Ã ce seuil, la rÃ©sonance **rouvre** l'impact originel.",chain:["12 Ãclats rÃ©unis","Configuration gÃ©omÃ©trique exacte","Seuil critique atteint","La Fissure s'ouvre"]},
      {type:"callout",color:"teal",text:"**Le portail de retour ne s'ouvre que lorsque les douze Ãclats sont rÃ©unis et activÃ©s simultanÃ©ment.** Ce que personne n'anticipe : que certains membres utiliseront leur fragment comme levier de pouvoir le moment venu."}
    ]},
    {id:"protagoniste",label:"Le Protagoniste",group:"Personnages",color:"amber",badge:"Joueur",badgeColor:"amber",title:"Le Protagoniste",meta:"L'homme / la femme de terrain Â· Alter ego du joueur",summary:"Pas de diplÃ´me, pas de titre. Une mÃ©thode que personne d'autre n'a.",content:[
      {type:"lead",text:"Tu n'es pas chercheur. Tu n'as jamais publiÃ© d'article. Ce que tu sais faire, c'est trouver des PokÃ©mon que personne d'autre ne trouve."},
      {type:"mechanic",title:"La mÃ©thode",icon:"â",text:"Tu sais lire un territoire, comprendre ce qu'un PokÃ©mon sauvage tolÃ¨re ou refuse, sentir le moment oÃ¹ l'approche est possible et celui oÃ¹ elle ne l'est pas encore. Tu construis de la confiance sans la forcer."},
      {type:"divider"},
      {type:"h2",text:"Le choix du starter"},
      {type:"para",text:"Wollemi t'emmÃ¨ne dans la serre d'Ã©levage du laboratoire. Il se tourne vers toi et dit simplement : *Je t'en dois un depuis longtemps. Prends celui avec lequel tu te sens.* C'est seulement aprÃ¨s, PokÃ©mon en main, qu'il t'explique tout le reste."},
      {type:"starter-choice",items:[{name:"HÃ©ricendre",evolution:"â Typhlosion de PangÃ©e",types:[["coral","Feu"],["gray","Roche"]],color:"coral",desc:"Le bÃ¢tisseur inÃ©vitable. Puissance physique brute et endurance volcanique."},{name:"VipÃ©lierre",evolution:"â Serperior de PangÃ©e",types:[["green","Plante"],["blue","Dragon"]],color:"green",desc:"Le vÃ©nÃ©rable. Vitesse et contrÃ´le â ne frappe jamais en premier."},{name:"Otaquin",evolution:"â Primarina de PangÃ©e",types:[["blue","Eau"],["purple","Spectre"]],color:"purple",desc:"L'invisible. Attaque spÃ©ciale â toujours un coup d'avance."}]},
      {type:"divider"},
      {type:"h2",text:"Ãlia â La rivale silencieuse"},
      {type:"callout",color:"purple",text:"Ãlia a investi dans Wollemi comme on investit dans quelqu'un dont on attend une validation explicite en retour. Quand elle te voit arriver â sans diplÃ´me, avec ta faÃ§on informelle d'exister dans l'espace du Professeur â elle enregistre la chaleur qu'il a pour toi. Elle ne dit rien. Elle stocke. **Elle est jalouse de ta lÃ©gÃ¨retÃ©.**"}
    ]},
    {id:"wollemi-elia",label:"Wollemi & Ãlia",group:"Personnages",color:"gray",badge:"PNJ fondateurs",badgeColor:"gray",title:"Professeur Wollemi & Ãlia",meta:"Chef d'expÃ©dition Â· Doctorante Â· Le binÃ´me scientifique",summary:"Le chercheur qui cherche ce que tout le monde a cessÃ© de chercher, et l'assistante qui a tout investi pour Ãªtre lÃ .",content:[
      {type:"lead",text:"Le *Wollemia nobilis* â surnommÃ© le dinosaure botanique â a Ã©tÃ© dÃ©couvert vivant en 1994. Morphologiquement inchangÃ© depuis 200 millions d'annÃ©es, il a vu la PangÃ©e. Le Professeur Wollemi partage quelque chose avec l'arbre qui lui a donnÃ© son nom."},
      {type:"persons-grid",items:[{initials:"W",color:"gray",imgUrl:"https://raw.githubusercontent.com/R1ck021/pangea-encyclopedia/main/public/wollemi.png",name:"Professeur Wollemi",role:"Chef d'expÃ©dition Â· XenogÃ©nomique Â· Biologie Ã©volutive comparÃ©e",desc:"SpÃ©cialisÃ© en biologie Ã©volutive comparÃ©e et en *xenogÃ©nomique* â l'Ã©tude des sÃ©quences gÃ©nÃ©tiques prÃ©sentes chez les humains et les PokÃ©mon qui ne s'expliquent par aucun mÃ©canisme Ã©volutif terrestre connu. Sa thÃ¨se publiÃ©e en 2012 a Ã©tÃ© accueillie avec scepticisme poli."}]},
      {type:"quote",text:"Les phÃ©nomÃ¨nes extraordinaires de transformation que nous observons Ã  travers les rÃ©gions â MÃ©ga-Ãvolution, Formes Primo, Dynamax, TÃ©racristallisation â ne sont pas des accidents locaux. Ils sont des expressions rÃ©gionales d'une permÃ©abilitÃ© planÃ©taire globale.",author:"Pr. Wollemi, notes personnelles"},
      {type:"divider"},
      {type:"h2",text:"Ãlia (ou Ãlio)"},
      {type:"callout",color:"purple",text:"Doctorante brillante, deux articles publiÃ©s Ã  24 ans. Elle a choisi Wollemi parce qu'elle croyait en sa thÃ¨se avant mÃªme de le rencontrer. Ce qui la ronge : elle attend une validation explicite que Wollemi exprime par la confiance, pas par les mots. Son arc : comprendre progressivement que la vraie question est ce qu'elle veut, elle, indÃ©pendamment de lui."}
    ]},
    {id:"expedition",label:"L'expÃ©dition",group:"Personnages",color:"gray",badge:"8 personnages",badgeColor:"gray",title:"Les 8 ExpÃ©diteurs",meta:"Porteurs des Ãclats X Â· Confrontations narratives",summary:"Chaque membre dÃ©tient un Ãclat. Chaque arc rÃ©vÃ¨le une limite humaine. Chaque confrontation est inÃ©vitable.",content:[
      {type:"lead",text:"Chaque membre porte un Ãclat X â sans lequel le groupe ne peut pas rentrer. Dans la PangÃ©e, Ã  mesure que le groupe se fragmente, chaque confrontation est une collision humaine rendue inÃ©vitable par la pression d'un environnement hostile."},
      {type:"eclat-table"}
    ]},
    {id:"mecanique",label:"MÃ©caniques de jeu",group:"Conception",color:"purple",badge:"Game Design",badgeColor:"purple",title:"MÃ©caniques de jeu",meta:"SystÃ¨mes de combat Â· Progression narrative Â· Types",summary:"Le type Cosmique, la mÃ©canique des Ãclats et les connexions entre phÃ©nomÃ¨nes.",content:[
      {type:"lead",text:"Le cÅur mÃ©canique du jeu repose sur trois systÃ¨mes imbriquÃ©s : le **type Cosmique**, la **progression par Ãclats**, et la **permÃ©abilitÃ© planÃ©taire** qui relie tous les phÃ©nomÃ¨nes extraordinaires du monde PokÃ©mon."},
      {type:"mechanic",title:"Le type Cosmique",icon:"â­",text:"Deoxys reÃ§oit le **type Cosmique** â un type qui n'obÃ©it pas aux rÃ¨gles des types terrestres, qui ne s'inscrit dans aucun des Ã©quilibres naturels Ã©tablis par Groudon et Kyogre."},
      {type:"mechanic",title:"8 Ãclats = 8 arcs narratifs",icon:"â",text:"Chaque Ãclat X est dÃ©tenu par un membre de l'expÃ©dition. Les rÃ©cupÃ©rer n'est pas une suite de combats â c'est une suite de *confrontations humaines*. Chaque arc rÃ©vÃ¨le pourquoi ce personnage a choisi de prioriser ses propres objectifs sur la cohÃ©sion du groupe.",chain:["Trouver le membre","Comprendre son arc","Confrontation","RÃ©cupÃ©rer l'Ãclat"]},
      {type:"divider"},
      {type:"h2",text:"Types des expÃ©diteurs"},
      {type:"type-grid",items:[{name:"Hana",type:"Plante",color:"green"},{name:"Vael",type:"Acier",color:"gray"},{name:"Solano",type:"Normal",color:"amber"},{name:"Marrant",type:"Ãlectrik",color:"blue"},{name:"Carvalho",type:"FÃ©e",color:"pink"},{name:"Ashida",type:"Combat",color:"coral"},{name:"Shore",type:"Dragon",color:"teal"},{name:"Vasari",type:"Spectre",color:"purple"}]}
    ]}
  ],
  expediteurs:[
    {num:"Ã2",name:"Pr. Wollemi",role:"Chef d'expÃ©dition â redondance de sÃ©curitÃ©",type:null,color:"gray",status:"secure"},
    {num:"Ã1",name:"Ãlia / Ãlio",role:"Doctorante Â· Rivale Ã©motionnelle",type:null,color:"gray",status:"secure"},
    {num:"Ã1",name:"Protagoniste (Toi)",role:"L'homme / la femme de terrain",type:null,color:"amber",status:"secure"},
    {num:"Ã1",name:"Dr. Sekine Hana",role:"Biologiste / MÃ©decin",type:"Plante",color:"green",status:"recover",arc:"Face aux Ã©cosystÃ¨mes primitifs intacts, elle perd tout sens Ã©thique et des prioritÃ©s. Refuse d'abandonner un site lors d'une alerte de sÃ©curitÃ©.",trigger:"IncapacitÃ© Ã  hiÃ©rarchiser face Ã  l'unique"},
    {num:"Ã1",name:"Cdt. Oreste Vael",role:"Militaire â agenda cachÃ©",type:"Acier",color:"gray",status:"recover",arc:"Ordres parallÃ¨les d'une agence non mentionnÃ©e. Sa crÃ©dibilitÃ© est rÃ©elle, ses objectifs dissimulÃ©s derriÃ¨re elle. Quand confrontÃ©, il explique â et son explication est presque convaincante.",trigger:"La loyautÃ© a plusieurs maÃ®tres"},
    {num:"Ã1",name:"Mira Solano",role:"Journaliste / AttachÃ©e",type:"Normal",color:"amber",status:"recover",arc:"Copie toutes les donnÃ©es depuis le premier jour. Quand dÃ©couverte, elle nÃ©gocie â et instille des doutes sur les autres membres.",trigger:"Le journalisme comme prÃ©dation"},
    {num:"Ã1",name:"Theo Marrant",role:"Logicien â 22 ans",type:"Ãlectrik",color:"blue",status:"recover",arc:"A conÃ§u les modÃ¨les de la Fissure seul en 6 semaines. Une erreur de calcul sur Deoxys met un membre en danger. Il ne sait pas comment exister dans un monde oÃ¹ ses erreurs ont des consÃ©quences physiques.",trigger:"L'effondrement de la grille de lecture"},
    {num:"Ã1",name:"SÅur InÃªs Carvalho",role:"ThÃ©ologienne",type:"FÃ©e",color:"pink",status:"recover",arc:"Caution Ã©thique et politique. Ne bloque rien â rÃ©siste avec des faits. Son arc : une crise de foi silencieuse qui transforme ce en quoi elle croit.",trigger:"La foi qui mue, pas qui cÃ¨de"},
    {num:"Ã1",name:"Riku Ashida",role:"Ancien Champion",type:"Combat",color:"coral",status:"recover",arc:"Ami de Wollemi depuis l'universitÃ©. Sa vision du dressage entre en friction avec l'approche du protagoniste. Une vieille ambition se rallume face Ã  Deoxys â capturer l'incapturable.",trigger:"L'ambition que l'on croyait morte"},
    {num:"Ã1",name:"Caspian Shore",role:"Milliardaire â financement",type:"Dragon",color:"teal",status:"recover",arc:"A passÃ© sa vie Ã  possÃ©der des choses uniques. La PangÃ©e est remplie de choses uniques. Et Deoxys est la plus unique de toutes. L'idÃ©e de le capturer germe lentement, sans se formuler.",trigger:"PossÃ©der comme rÃ©flexe identitaire"},
    {num:"Ã1",name:"Arjun Vasi",role:"Artiste / Documentariste",type:"Spectre",color:"purple",status:"recover",arc:"Observe, dessine, note. Sa dissolution est progressive â il disparaÃ®t seul dans la PangÃ©e de plus en plus longtemps. Pour le retrouver, il faut d'abord comprendre ce qu'il cherchait.",trigger:"L'observateur consumÃ© par ce qu'il observe"}
  ]
}

// âââ STORAGE POLYFILL ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
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
