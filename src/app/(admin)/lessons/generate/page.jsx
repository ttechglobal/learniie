'use client'
// /admin/lessons/generate — Primary lesson generation workspace

import { useEffect, useRef, useState } from 'react'

const A = { bg:'#F8F9FA', card:'#FFFFFF', border:'#E2E8F0', accent:'#2D3CE6', success:'#16A34A', warning:'#D97706', danger:'#DC2626', muted:'#64748B', text:'#0F172A' }
const F = "'Inter', -apple-system, sans-serif"

// Mock curriculum data
const CURRICULA = [
  { id:'c1', label:'Physics SS2 1st Term', subject:'Physics', classLevel:'SS2', term:'1st Term', confirmed:true },
  { id:'c2', label:'Maths SS1 1st Term',   subject:'Maths',   classLevel:'SS1', term:'1st Term', confirmed:true },
  { id:'c3', label:'Chemistry JSS3 2nd',   subject:'Chem',    classLevel:'JSS3',term:'2nd Term', confirmed:false },
]

const TOPICS_DATA = [
  { id:'t1', title:'Motion and Kinematics', subtopics:[
    { id:'s1', title:'Introduction to Motion', diff:'easy',   slides:4, status:'published'  },
    { id:'s2', title:'Types of Motion',        diff:'easy',   slides:4, status:'published'  },
    { id:'s3', title:'Speed',                  diff:'medium', slides:6, status:'generated'  },
    { id:'s4', title:'Velocity',               diff:'medium', slides:6, status:'not_generated' },
    { id:'s5', title:'Acceleration',           diff:'hard',   slides:7, status:'not_generated' },
  ]},
  { id:'t2', title:'Forces', subtopics:[
    { id:'s6', title:'What is Force?',         diff:'easy',   slides:4, status:'generated'  },
    { id:'s7', title:"Newton's First Law",     diff:'medium', slides:6, status:'not_generated' },
    { id:'s8', title:"Newton's Second Law",    diff:'medium', slides:6, status:'not_generated' },
    { id:'s9', title:"Newton's Third Law",     diff:'medium', slides:6, status:'not_generated' },
  ]},
  { id:'t3', title:'Work, Energy and Power', subtopics:[
    { id:'s10', title:'Work Done',             diff:'medium', slides:5, status:'not_generated' },
    { id:'s11', title:'Kinetic Energy',        diff:'medium', slides:5, status:'not_generated' },
    { id:'s12', title:'Potential Energy',      diff:'medium', slides:5, status:'not_generated' },
    { id:'s13', title:'Power',                 diff:'easy',   slides:4, status:'not_generated' },
  ]},
]

const STATUS_CFG = {
  not_generated: { icon:'○', color:'#CBD5E1', label:'Not generated' },
  generating:    { icon:'◑', color:A.accent,  label:'Generating...' },
  generated:     { icon:'●', color:A.accent,  label:'Generated'     },
  published:     { icon:'✓', color:A.success, label:'Published'     },
  failed:        { icon:'✗', color:A.danger,  label:'Failed'        },
}

const DIFF_CFG = {
  easy:   { bg:'#DCFCE7', color:'#16A34A' },
  medium: { bg:'#FEF9C3', color:'#854D0E' },
  hard:   { bg:'#FEE2E2', color:'#DC2626' },
}

export default function GeneratePage() {
  const [activeCurr,  setActive]     = useState('c1')
  const [expanded,    setExpanded]   = useState({ t1:true, t2:false, t3:false })
  const [selected,    setSelected]   = useState(new Set())
  const [statuses,    setStatuses]   = useState(() => {
    const m = {}; TOPICS_DATA.forEach(t => t.subtopics.forEach(s => { m[s.id] = s.status })); return m
  })
  const [batchJob,    setBatch]      = useState(null)
  const [showDropdown,setDropdown]   = useState(false)
  const pollRef = useRef(null)

  function toggleExpand(id) { setExpanded(e => ({ ...e, [id]: !e[id] })) }
  function toggleSelect(id) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function selectAll() {
    const all = TOPICS_DATA.flatMap(t => t.subtopics.filter(s => statuses[s.id] !== 'published').map(s => s.id))
    setSelected(new Set(all))
  }

  async function generateSingle(subId) {
    setStatuses(p => ({ ...p, [subId]:'generating' }))
    await new Promise(r => setTimeout(r, 2500))
    setStatuses(p => ({ ...p, [subId]:'generated' }))
  }

  async function generateBatch() {
    const ids = Array.from(selected).filter(id => statuses[id] !== 'published' && statuses[id] !== 'generated')
    if (!ids.length) return
    const job = { id:'batch_' + Math.random().toString(36).slice(2,8), total:ids.length, done:0, items:ids.map(id => ({ id, status:'queued' })) }
    setBatch(job)
    setSelected(new Set())

    for (const id of ids) {
      setBatch(j => ({ ...j, items: j.items.map(i => i.id===id ? { ...i, status:'generating' } : i) }))
      setStatuses(p => ({ ...p, [id]:'generating' }))
      await new Promise(r => setTimeout(r, 1500))
      setBatch(j => ({ ...j, done: j.done+1, items: j.items.map(i => i.id===id ? { ...i, status:'done' } : i) }))
      setStatuses(p => ({ ...p, [id]:'generated' }))
    }
  }

  const selectedArr = Array.from(selected)
  const allSubtopics = TOPICS_DATA.flatMap(t => t.subtopics)

  function getSubById(id) { return allSubtopics.find(s => s.id === id) }

  const notGenCount = allSubtopics.filter(s => statuses[s.id] === 'not_generated').length

  return (
    <div style={{ fontFamily:F }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'20px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:A.text, margin:0, marginBottom:'4px' }}>Lesson Generation</h1>
          <p style={{ fontSize:'13px', color:A.muted, margin:0 }}>{CURRICULA.find(c=>c.id===activeCurr)?.label} · {notGenCount} not yet generated</p>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <select value={activeCurr} onChange={e=>setActive(e.target.value)} style={{ padding:'6px 10px', borderRadius:'6px', border:`1px solid ${A.border}`, fontSize:'13px', color:A.text, background:A.card, fontFamily:F }}>
            {CURRICULA.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
      </div>

      {/* Curriculum pills */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
        {CURRICULA.map(c => (
          <button key={c.id} onClick={()=>setActive(c.id)} style={{ padding:'6px 14px', borderRadius:'20px', border:`1.5px solid ${activeCurr===c.id?A.accent:A.border}`, background:activeCurr===c.id?'#EEF0FF':A.card, color:activeCurr===c.id?A.accent:A.muted, fontSize:'12px', fontWeight:600, cursor:'pointer', fontFamily:F }}>
            {c.label} {c.confirmed?'✓':'⏳'}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'65% 35%', gap:'16px', alignItems:'start' }}>
        {/* Left: topic tree */}
        <div>
          {/* Controls bar */}
          <div style={{ display:'flex', gap:'8px', alignItems:'center', padding:'10px 14px', background:A.card, border:`1px solid ${A.border}`, borderRadius:'8px', marginBottom:'12px' }}>
            <button onClick={selectAll} style={{ padding:'5px 10px', borderRadius:'5px', border:`1px solid ${A.border}`, background:A.card, fontSize:'12px', fontWeight:600, cursor:'pointer', color:A.text, fontFamily:F }}>☑ Select All</button>
            <button onClick={()=>setSelected(new Set())} style={{ padding:'5px 10px', borderRadius:'5px', border:`1px solid ${A.border}`, background:A.card, fontSize:'12px', fontWeight:600, cursor:'pointer', color:A.text, fontFamily:F }}>☐ Deselect All</button>
            <div style={{ position:'relative' }}>
              <button onClick={()=>setDropdown(d=>!d)} disabled={!selected.size} style={{ padding:'5px 12px', borderRadius:'5px', border:'none', background:selected.size?A.accent:'#CBD5E1', color:'#fff', fontSize:'12px', fontWeight:600, cursor:selected.size?'pointer':'not-allowed', fontFamily:F }}>Generate Selected ▼</button>
              {showDropdown && selected.size > 0 && (
                <div style={{ position:'absolute', top:'100%', left:0, zIndex:50, background:A.card, border:`1px solid ${A.border}`, borderRadius:'8px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)', marginTop:'4px', minWidth:'200px', overflow:'hidden' }}>
                  <div onClick={()=>{setDropdown(false);selectedArr.forEach(id=>generateSingle(id))}} style={{ padding:'10px 14px', fontSize:'13px', cursor:'pointer', color:A.text, borderBottom:`1px solid ${A.border}` }} onMouseEnter={e=>e.currentTarget.style.background=A.bg} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>Generate now (sequential)</div>
                  <div onClick={()=>{setDropdown(false);generateBatch()}} style={{ padding:'10px 14px', fontSize:'13px', cursor:'pointer', color:A.text }} onMouseEnter={e=>e.currentTarget.style.background=A.bg} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>Generate as batch (Anthropic)</div>
                </div>
              )}
            </div>
            <button onClick={()=>{ const all=TOPICS_DATA.flatMap(t=>t.subtopics.filter(s=>statuses[s.id]==='not_generated').map(s=>s.id)); setSelected(new Set(all)); setTimeout(generateBatch,100) }} style={{ padding:'5px 12px', borderRadius:'5px', border:'none', background:notGenCount?'#0F172A':'#CBD5E1', color:'#fff', fontSize:'12px', fontWeight:600, cursor:notGenCount?'pointer':'not-allowed', fontFamily:F }}>
              Batch All Remaining ({notGenCount})
            </button>
          </div>

          {/* Tree */}
          <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', overflow:'hidden' }}>
            {TOPICS_DATA.map(topic => {
              const genCount = topic.subtopics.filter(s => statuses[s.id]==='generated'||statuses[s.id]==='published').length
              const pubCount = topic.subtopics.filter(s => statuses[s.id]==='published').length
              return (
                <div key={topic.id}>
                  {/* Topic header */}
                  <div onClick={()=>toggleExpand(topic.id)} style={{ padding:'11px 16px', borderBottom:`1px solid ${A.border}`, display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', background:'#FAFAFA', transition:'background 0.1s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#F1F5F9'} onMouseLeave={e=>e.currentTarget.style.background='#FAFAFA'}>
                    <span style={{ fontSize:'12px', color:A.muted }}>{expanded[topic.id]?'▼':'▶'}</span>
                    <span style={{ flex:1, fontSize:'13px', fontWeight:700, color:A.text }}>{topic.title}</span>
                    <span style={{ fontSize:'12px', color:A.muted }}>{genCount}/{topic.subtopics.length} generated · {pubCount} published</span>
                    {notGenCount > 0 && <button onClick={e=>{e.stopPropagation();topic.subtopics.filter(s=>statuses[s.id]==='not_generated').forEach(s=>generateSingle(s.id))}} style={{ fontSize:'11px', color:A.accent, background:'none', border:'none', cursor:'pointer', fontFamily:F, opacity:0, transition:'opacity 0.15s' }}
                      onMouseEnter={e=>{e.currentTarget.style.opacity='1'}} onMouseLeave={e=>{e.currentTarget.style.opacity='0'}}>Generate remaining</button>}
                  </div>

                  {/* Subtopic rows */}
                  {expanded[topic.id] && topic.subtopics.map(sub => {
                    const sc  = STATUS_CFG[statuses[sub.id]] || STATUS_CFG.not_generated
                    const dc  = DIFF_CFG[sub.diff] || DIFF_CFG.easy
                    const sel = selected.has(sub.id)
                    return (
                      <div key={sub.id} style={{ padding:'10px 16px 10px 36px', borderBottom:`1px solid ${A.border}`, display:'flex', alignItems:'center', gap:'10px', background:sel?'#EEF0FF':A.card, transition:'background 0.1s' }}>
                        <input type="checkbox" checked={sel} onChange={()=>toggleSelect(sub.id)} style={{ accentColor:A.accent, width:'14px', height:'14px', cursor:'pointer', flexShrink:0 }} />
                        <span style={{ fontSize:'14px', color:sc.color, flexShrink:0 }}>{sc.icon}</span>
                        <span style={{ flex:1, fontSize:'13px', color:A.text }}>{sub.title}</span>
                        <span style={{ background:dc.bg, color:dc.color, borderRadius:'5px', padding:'1px 7px', fontSize:'10px', fontWeight:600, flexShrink:0 }}>{sub.diff}</span>
                        <span style={{ fontSize:'11px', color:A.muted, flexShrink:0 }}>{sub.slides} slides</span>
                        {statuses[sub.id]==='not_generated' && <button onClick={()=>generateSingle(sub.id)} style={{ padding:'3px 10px', borderRadius:'5px', border:'none', background:A.accent, color:'#fff', fontSize:'11px', fontWeight:600, cursor:'pointer', fontFamily:F, flexShrink:0 }}>Generate</button>}
                        {statuses[sub.id]==='generated'     && <a href={`/admin/lessons/${sub.id}/preview`} style={{ fontSize:'11px', fontWeight:600, color:A.accent, textDecoration:'none' }}>Preview</a>}
                        {statuses[sub.id]==='generated'     && <button onClick={()=>setStatuses(p=>({...p,[sub.id]:'published'}))} style={{ padding:'3px 10px', borderRadius:'5px', border:'none', background:A.success, color:'#fff', fontSize:'11px', fontWeight:600, cursor:'pointer', fontFamily:F, flexShrink:0 }}>Publish</button>}
                        {statuses[sub.id]==='failed'        && <button onClick={()=>generateSingle(sub.id)} style={{ padding:'3px 10px', borderRadius:'5px', border:'none', background:A.danger, color:'#fff', fontSize:'11px', fontWeight:600, cursor:'pointer', fontFamily:F, flexShrink:0 }}>Retry</button>}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: action panel */}
        <div style={{ position:'sticky', top:'80px' }}>
          {batchJob ? (
            <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', overflow:'hidden' }}>
              <div style={{ padding:'12px 16px', borderBottom:`1px solid ${A.border}`, background:'#FAFAFA' }}>
                <div style={{ fontSize:'13px', fontWeight:700, color:A.text }}>Batch Job Running</div>
                <div style={{ fontSize:'11px', fontFamily:'monospace', color:A.muted, marginTop:'2px' }}>{batchJob.id}</div>
              </div>
              <div style={{ padding:'14px 16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                  <span style={{ fontSize:'13px', color:A.text }}>{batchJob.done} / {batchJob.total} complete</span>
                  <span style={{ fontSize:'13px', fontWeight:600, color:A.accent }}>{Math.round((batchJob.done/batchJob.total)*100)}%</span>
                </div>
                <div style={{ height:'6px', background:'#F1F5F9', borderRadius:'3px', overflow:'hidden', marginBottom:'14px' }}>
                  <div style={{ height:'100%', width:`${(batchJob.done/batchJob.total)*100}%`, background:A.accent, borderRadius:'3px', transition:'width 0.4s' }} />
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
                  {batchJob.items.map(item => {
                    const sub = getSubById(item.id)
                    return (
                      <div key={item.id} style={{ display:'flex', justifyContent:'space-between', fontSize:'12px' }}>
                        <span style={{ color:A.text }}>{sub?.title || item.id}</span>
                        <span style={{ color:item.status==='done'?A.success:item.status==='generating'?A.accent:A.muted, fontWeight:600 }}>
                          {item.status==='done'?'✓ Done':item.status==='generating'?'◑ ...':'○ Queue'}
                        </span>
                      </div>
                    )
                  })}
                </div>
                {batchJob.done === batchJob.total && (
                  <button onClick={()=>setBatch(null)} style={{ marginTop:'14px', width:'100%', padding:'8px', borderRadius:'6px', border:'none', background:A.success, color:'#fff', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:F }}>Done ✓</button>
                )}
              </div>
            </div>
          ) : selectedArr.length === 0 ? (
            <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', padding:'24px', textAlign:'center', color:A.muted }}>
              <div style={{ fontSize:'24px', marginBottom:'10px' }}>☑</div>
              <div style={{ fontSize:'13px', lineHeight:1.6 }}>Select subtopics to generate, or use the generate buttons on each topic row.</div>
            </div>
          ) : selectedArr.length === 1 ? (
            <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', overflow:'hidden' }}>
              {(() => { const sub=getSubById(selectedArr[0]); const dc=DIFF_CFG[sub?.diff]||DIFF_CFG.easy; const sc=STATUS_CFG[statuses[selectedArr[0]]]||STATUS_CFG.not_generated; return (
                <>
                  <div style={{ padding:'14px 16px', borderBottom:`1px solid ${A.border}`, background:'#FAFAFA' }}>
                    <div style={{ fontSize:'14px', fontWeight:700, color:A.text }}>{sub?.title}</div>
                    <div style={{ fontSize:'12px', color:A.muted, marginTop:'3px' }}>Physics · SS2 · 1st Term</div>
                    <div style={{ display:'flex', gap:'6px', marginTop:'8px' }}>
                      <span style={{ background:dc.bg, color:dc.color, borderRadius:'5px', padding:'2px 8px', fontSize:'11px', fontWeight:600 }}>{sub?.diff}</span>
                      <span style={{ background:'#F1F5F9', color:A.muted, borderRadius:'5px', padding:'2px 8px', fontSize:'11px', fontWeight:600 }}>{sub?.slides} slides</span>
                    </div>
                  </div>
                  <div style={{ padding:'14px 16px', borderBottom:`1px solid ${A.border}` }}>
                    <span style={{ fontSize:'12px', color:A.muted }}>Status: </span>
                    <span style={{ fontSize:'12px', fontWeight:600, color:sc.color }}>{sc.label}</span>
                  </div>
                  <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:'8px' }}>
                    <button onClick={()=>generateSingle(selectedArr[0])} style={{ padding:'9px', borderRadius:'6px', border:'none', background:A.accent, color:'#fff', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:F }}>Generate this lesson</button>
                    <button disabled={statuses[selectedArr[0]]==='not_generated'} style={{ padding:'9px', borderRadius:'6px', border:`1px solid ${A.border}`, background:A.card, color:statuses[selectedArr[0]]==='not_generated'?'#CBD5E1':A.text, fontSize:'13px', fontWeight:600, cursor:statuses[selectedArr[0]]==='not_generated'?'not-allowed':'pointer', fontFamily:F }}>Preview</button>
                  </div>
                </>
              )})()}
            </div>
          ) : (
            <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', overflow:'hidden' }}>
              <div style={{ padding:'12px 16px', borderBottom:`1px solid ${A.border}`, background:'#FAFAFA', fontSize:'13px', fontWeight:700, color:A.text }}>{selectedArr.length} subtopics selected</div>
              <div style={{ padding:'4px 0', maxHeight:'200px', overflowY:'auto' }}>
                {selectedArr.map(id => { const sub=getSubById(id); return <div key={id} style={{ padding:'7px 16px', fontSize:'13px', color:A.text, borderBottom:`1px solid ${A.border}` }}>{sub?.title||id}</div> })}
              </div>
              <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:'8px' }}>
                <button onClick={generateBatch} style={{ padding:'9px', borderRadius:'6px', border:'none', background:A.accent, color:'#fff', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:F }}>Generate as Batch</button>
                <button onClick={()=>setSelected(new Set())} style={{ padding:'9px', borderRadius:'6px', border:`1px solid ${A.border}`, background:A.card, color:A.muted, fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:F }}>Clear selection</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}