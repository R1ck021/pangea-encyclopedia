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