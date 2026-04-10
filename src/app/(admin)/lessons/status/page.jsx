'use client'

// ─────────────────────────────────────────────────────────────────────────────
// /admin/lessons/status — Live batch generation status
// Polls /api/admin/batch-status every 30s while batch is processing.
// When complete, shows results and offers preview/publish actions per lesson.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'

const F  = "'Nunito', sans-serif"
const C  = {
  white:'#FFFFFF', surface:'#F7F8FA', blue:'#2D3CE6', blueLt:'#EEF0FF',
  green:'#6DC77A', greenLt:'#EBF9EE', dark:'#1A1A1A', muted:'#888', border:'#EBEBEB',
  red:'#E63946', redLt:'#FFF0F1', amber:'#F59E0B', amberLt:'#FFFBEA',
}

const STATUS_LABELS = {
  processing: { label: 'Processing',  color: C.amber, icon: '⏳' },
  ended:      { label: 'Complete',    color: C.green, icon: '✅' },
  canceling:  { label: 'Canceling',   color: C.red,   icon: '⛔' },
  expired:    { label: 'Expired',     color: C.muted, icon: '💀' },
}

// Demo batch data — in production this would come from your database
const DEMO_BATCH = {
  batchId:   'msgbatch_01Demo123',
  topicId:   'mechanics',
  topicTitle:'Chapter 1: Mechanics',
  subject:   'Physics',
  classLevel:'SS1',
  term:      '1st Term',
  subtopics: [
    { id:'intro-motion',   title:'Introduction to Motion',   status:'generated', difficulty:'easy'   },
    { id:'speed-distance', title:'Speed, Distance and Time', status:'generated', difficulty:'medium' },
    { id:'newtons-laws',   title:"Newton's Laws of Motion",  status:'processing',difficulty:'medium' },
    { id:'work-energy',    title:'Work and Energy',          status:'queued',    difficulty:'medium' },
    { id:'power',          title:'Power',                    status:'queued',    difficulty:'easy'   },
  ],
}

function StatusDot({ status }) {
  const colors = { generated:'#6DC77A', processing:'#F59E0B', queued:'#AAAAAA', failed:'#E63946', published:'#2D3CE6' }
  return <span style={{ display:'inline-block', width:'8px', height:'8px', borderRadius:'50%', background:colors[status]||'#ccc', marginRight:'6px' }} />
}

function StatusBadge({ status }) {
  const cfg = {
    generated:  { label:'✓ Done',       bg:C.greenLt, color:C.green  },
    processing: { label:'Generating...', bg:C.amberLt, color:C.amber  },
    queued:     { label:'Queued',        bg:C.surface, color:C.muted  },
    failed:     { label:'Failed',        bg:C.redLt,   color:C.red    },
    published:  { label:'Published',     bg:C.blueLt,  color:C.blue   },
  }[status] || { label: status, bg: C.surface, color: C.muted }

  return (
    <span style={{ background:cfg.bg, color:cfg.color, borderRadius:'20px', padding:'3px 11px', fontSize:'11px', fontWeight:800, fontFamily:F }}>
      {cfg.label}
    </span>
  )
}

export default function StatusPage() {
  const [batchId,    setBatchId]    = useState('')
  const [batchData,  setBatchData]  = useState(null)
  const [polling,    setPolling]    = useState(false)
  const [error,      setError]      = useState('')
  const [lastPoll,   setLastPoll]   = useState(null)

  // Simulate live polling — replace with real batchId from DB
  function startDemo() {
    setBatchData(DEMO_BATCH)
    setPolling(true)
  }

  async function pollStatus() {
    if (!batchId.trim()) { setError('Enter a batch ID'); return }
    setError(''); setPolling(true)
    try {
      const res  = await fetch(`/api/admin/batch-status?batchId=${batchId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBatchData(data)
      setLastPoll(new Date())

      // Auto-poll every 30s if still processing
      if (data.status === 'processing') {
        setTimeout(pollStatus, 30_000)
      } else {
        setPolling(false)
      }
    } catch(e) {
      setError(e.message); setPolling(false)
    }
  }

  const doneCount = batchData?.subtopics?.filter(s => s.status === 'generated').length || 0
  const total     = batchData?.subtopics?.length || 0
  const pct       = total > 0 ? Math.round((doneCount / total) * 100) : 0

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto', padding:'32px 24px', fontFamily:F }}>
      <div style={{ marginBottom:'28px' }}>
        <div style={{ fontSize:'11px', fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'6px' }}>Admin Panel</div>
        <h1 style={{ fontSize:'26px', fontWeight:900, color:C.dark, margin:0 }}>Generation Status</h1>
        <p style={{ fontSize:'14px', color:C.muted, marginTop:'6px' }}>
          Track the progress of batch lesson generation jobs.
        </p>
      </div>

      {/* Batch ID input */}
      {!batchData && (
        <div style={{ background:C.white, borderRadius:'14px', border:`1px solid ${C.border}`, padding:'20px', marginBottom:'20px' }}>
          <div style={{ fontSize:'13px', fontWeight:700, color:C.muted, fontFamily:F, marginBottom:'8px' }}>Batch ID</div>
          <div style={{ display:'flex', gap:'10px' }}>
            <input
              value={batchId}
              onChange={e => setBatchId(e.target.value)}
              placeholder="msgbatch_01..."
              style={{ flex:1, padding:'10px 14px', borderRadius:'10px', border:`1.5px solid ${C.border}`, fontFamily:F, fontSize:'14px', color:C.dark }}
            />
            <button onClick={pollStatus} style={{ padding:'10px 20px', borderRadius:'10px', border:'none', background:C.blue, color:'#fff', fontFamily:F, fontWeight:800, fontSize:'13px', cursor:'pointer' }}>
              Check Status
            </button>
            <button onClick={startDemo} style={{ padding:'10px 16px', borderRadius:'10px', border:`1.5px solid ${C.border}`, background:C.white, color:C.muted, fontFamily:F, fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
              Demo
            </button>
          </div>
          {error && <div style={{ color:C.red, fontSize:'13px', fontWeight:700, fontFamily:F, marginTop:'8px' }}>{error}</div>}
        </div>
      )}

      {batchData && (
        <>
          {/* Batch overview card */}
          <div style={{ background:C.white, borderRadius:'14px', border:`1px solid ${C.border}`, padding:'18px 20px', marginBottom:'16px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'14px' }}>
              <div>
                <div style={{ fontSize:'16px', fontWeight:900, color:C.dark, fontFamily:F }}>
                  {batchData.topicTitle || 'Batch Generation'}
                </div>
                <div style={{ fontSize:'13px', color:C.muted, fontFamily:F, marginTop:'3px' }}>
                  {batchData.subject} · {batchData.classLevel} · {batchData.term}
                  {batchData.batchId && <span style={{ marginLeft:'10px', fontSize:'11px', fontFamily:'monospace', background:C.surface, padding:'2px 8px', borderRadius:'6px' }}>{batchData.batchId}</span>}
                </div>
              </div>
              <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                {lastPoll && (
                  <span style={{ fontSize:'11px', color:C.muted, fontFamily:F }}>
                    Last checked: {lastPoll.toLocaleTimeString()}
                  </span>
                )}
                <button onClick={() => { setBatchData(null); setBatchId('') }} style={{ padding:'6px 14px', borderRadius:'8px', border:`1.5px solid ${C.border}`, background:C.white, fontFamily:F, fontWeight:700, fontSize:'12px', cursor:'pointer', color:C.muted }}>
                  ← New batch
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom:'10px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                <span style={{ fontSize:'13px', fontWeight:700, color:C.dark, fontFamily:F }}>{doneCount} of {total} lessons generated</span>
                <span style={{ fontSize:'13px', fontWeight:800, color:pct===100?C.green:C.blue, fontFamily:F }}>{pct}%</span>
              </div>
              <div style={{ height:'8px', background:C.surface, borderRadius:'50px', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${pct}%`, background:pct===100?C.green:C.blue, borderRadius:'50px', transition:'width 0.5s ease' }} />
              </div>
            </div>

            {polling && batchData.status === 'processing' && (
              <div style={{ fontSize:'12px', color:C.amber, fontWeight:700, fontFamily:F }}>
                ⏳ Polling every 30 seconds...
              </div>
            )}
          </div>

          {/* Subtopic results table */}
          <div style={{ background:C.white, borderRadius:'14px', border:`1px solid ${C.border}`, overflow:'hidden' }}>
            <div style={{ padding:'12px 18px', background:C.surface, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontSize:'13px', fontWeight:900, color:C.dark, fontFamily:F }}>Subtopics</div>
              <div style={{ display:'flex', gap:'8px' }}>
                <button style={{ padding:'6px 14px', borderRadius:'8px', border:'none', background:C.green, color:'#fff', fontFamily:F, fontWeight:800, fontSize:'12px', cursor:'pointer' }}>
                  Publish all done
                </button>
                <button style={{ padding:'6px 14px', borderRadius:'8px', border:`1.5px solid ${C.border}`, background:C.white, color:C.muted, fontFamily:F, fontWeight:700, fontSize:'12px', cursor:'pointer' }}>
                  Export JSON
                </button>
              </div>
            </div>

            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                  {['Subtopic','Difficulty','Status','Actions'].map(h => (
                    <th key={h} style={{ padding:'9px 16px', textAlign:'left', fontSize:'11px', fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.8px', fontFamily:F }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(batchData.subtopics || batchData.lessons || []).map((item, i) => {
                  const id     = item.id || item.subtopicId
                  const title  = item.title || item.subtopicTitle || id
                  const status = item.status
                  const diff   = item.difficulty
                  return (
                    <tr key={id} style={{ borderBottom:`1px solid ${C.border}`, background:i%2===0?C.white:C.surface }}>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ fontSize:'14px', fontWeight:700, color:C.dark, fontFamily:F }}>{title}</div>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ fontSize:'12px', fontWeight:700, color:diff==='easy'?C.green:diff==='hard'?C.red:C.amber, fontFamily:F }}>{diff || '—'}</span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <StatusBadge status={status} />
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', gap:'8px' }}>
                          {status === 'generated' && (
                            <>
                              <a href={`/admin/lessons/${id}/preview`} style={{ fontSize:'12px', fontWeight:800, color:C.blue, textDecoration:'none', fontFamily:F }}>Preview</a>
                              <span style={{ color:C.border }}>·</span>
                              <button style={{ fontSize:'12px', fontWeight:800, color:C.green, background:'none', border:'none', cursor:'pointer', fontFamily:F }}>Publish</button>
                            </>
                          )}
                          {status === 'failed' && (
                            <button style={{ fontSize:'12px', fontWeight:800, color:C.red, background:'none', border:'none', cursor:'pointer', fontFamily:F }}>Retry</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}