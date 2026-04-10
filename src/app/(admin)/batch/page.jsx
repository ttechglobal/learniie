'use client'
// /admin/batch — Batch job history and status

import { useEffect, useState } from 'react'

const A = { bg:'#F8F9FA', card:'#FFFFFF', border:'#E2E8F0', accent:'#2D3CE6', success:'#16A34A', warning:'#D97706', danger:'#DC2626', muted:'#64748B', text:'#0F172A' }
const F = "'Inter', -apple-system, sans-serif"

const MOCK_BATCHES = [
  { id:'msgbatch_0195abc', subject:'Physics', classLevel:'SS2', term:'1st Term', total:8,  completed:8,  failed:0, status:'complete',   startedAt:'2026-01-10T14:30:00Z', completedAt:'2026-01-10T14:34:12Z' },
  { id:'msgbatch_0194def', subject:'Maths',   classLevel:'SS1', term:'1st Term', total:12, completed:12, failed:0, status:'complete',   startedAt:'2026-01-09T10:00:00Z', completedAt:'2026-01-09T10:06:45Z' },
  { id:'msgbatch_0193ghi', subject:'Physics', classLevel:'SS2', term:'1st Term', total:5,  completed:3,  failed:2, status:'failed',     startedAt:'2026-01-08T16:00:00Z', completedAt:'2026-01-08T16:02:01Z' },
  { id:'msgbatch_0192jkl', subject:'Chemistry',classLevel:'JSS3',term:'2nd Term',total:6,  completed:6,  failed:0, status:'complete',   startedAt:'2026-01-07T09:00:00Z', completedAt:'2026-01-07T09:03:30Z' },
  { id:'msgbatch_0191mno', subject:'Maths',   classLevel:'SS1', term:'1st Term', total:9,  completed:9,  failed:0, status:'complete',   startedAt:'2026-01-05T11:00:00Z', completedAt:'2026-01-05T11:05:55Z' },
]

function StatusBadge({ status }) {
  const cfg = { complete:{ bg:'#DCFCE7',color:'#16A34A',border:'#86EFAC',label:'Complete' }, failed:{ bg:'#FEE2E2',color:'#DC2626',border:'#FCA5A5',label:'Failed' }, processing:{ bg:'#DBEAFE',color:'#1D4ED8',border:'#BFDBFE',label:'Processing' } }[status] || { bg:'#F1F5F9',color:'#64748B',border:'#E2E8F0',label:status }
  return <span style={{ background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, borderRadius:'6px', padding:'2px 8px', fontSize:'11px', fontWeight:600 }}>{cfg.label}</span>
}

function duration(start, end) {
  if (!start || !end) return '—'
  const secs = Math.round((new Date(end) - new Date(start)) / 1000)
  const m = Math.floor(secs / 60), s = secs % 60
  return `${m}m ${s}s`
}

function relTime(dt) {
  if (!dt) return '—'
  const diff = Date.now() - new Date(dt).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours/24)}d ago`
}

export default function BatchPage() {
  const [batchId, setId] = useState('')
  const [polled,  setPoll] = useState(null)
  const [polling, setPolling] = useState(false)

  async function checkBatch() {
    if (!batchId.trim()) return
    setPolling(true)
    await new Promise(r => setTimeout(r, 800))
    setPoll({ batchId, status:'processing', requestCounts:{ processing:3, succeded:2, errored:0, canceled:0, expired:0 } })
    setPolling(false)
  }

  return (
    <div style={{ fontFamily:F }}>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:A.text, margin:0, marginBottom:'4px' }}>Batch Jobs</h1>
        <p style={{ fontSize:'13px', color:A.muted, margin:0 }}>History of all Anthropic Batches API generation jobs.</p>
      </div>

      {/* Quick status check */}
      <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', padding:'16px 20px', marginBottom:'20px' }}>
        <div style={{ fontSize:'13px', fontWeight:600, color:A.text, marginBottom:'10px' }}>Check Batch Status</div>
        <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
          <input value={batchId} onChange={e=>setId(e.target.value)} placeholder="msgbatch_01..." style={{ flex:1, padding:'8px 12px', borderRadius:'6px', border:`1px solid ${A.border}`, fontSize:'13px', color:A.text, fontFamily:'monospace', outline:'none' }} />
          <button onClick={checkBatch} disabled={polling} style={{ padding:'8px 16px', borderRadius:'6px', border:'none', background:A.accent, color:'#fff', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:F }}>
            {polling ? 'Checking...' : 'Check'}
          </button>
        </div>
        {polled && (
          <div style={{ marginTop:'12px', padding:'12px', background:'#F8F9FA', borderRadius:'6px', border:`1px solid ${A.border}`, fontSize:'13px', color:A.text }}>
            <strong>{polled.batchId}</strong> — Status: <StatusBadge status={polled.status} /><br/>
            <span style={{ color:A.muted, fontSize:'12px' }}>Processing: {polled.requestCounts.processing} · Succeeded: {polled.requestCounts.succeded}</span>
          </div>
        )}
      </div>

      {/* History table */}
      <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${A.border}`, fontSize:'14px', fontWeight:600, color:A.text }}>
          All Batch Jobs ({MOCK_BATCHES.length})
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${A.border}`, background:'#FAFAFA' }}>
              {['Batch ID','Subject','Subtopics','Complete/Total','Status','Started','Duration','Actions'].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:A.muted, textTransform:'uppercase', letterSpacing:'0.5px', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_BATCHES.map((job, i) => (
              <tr key={job.id} style={{ borderBottom:`1px solid ${A.border}`, transition:'background 0.1s' }}
                onMouseEnter={e=>e.currentTarget.style.background='#FAFBFF'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td style={{ padding:'12px 16px', fontFamily:'monospace', fontSize:'11px', color:A.muted }}>{job.id}</td>
                <td style={{ padding:'12px 16px', fontWeight:600, color:A.text }}>{job.subject} {job.classLevel}</td>
                <td style={{ padding:'12px 16px', color:A.muted }}>{job.total}</td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ fontSize:'12px', color:A.text }}>{job.completed}/{job.total}</div>
                  {job.failed > 0 && <div style={{ fontSize:'11px', color:A.danger }}>{job.failed} failed</div>}
                </td>
                <td style={{ padding:'12px 16px' }}><StatusBadge status={job.status} /></td>
                <td style={{ padding:'12px 16px', color:A.muted, whiteSpace:'nowrap' }}>{relTime(job.startedAt)}</td>
                <td style={{ padding:'12px 16px', color:A.muted }}>{duration(job.startedAt, job.completedAt)}</td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', gap:'8px' }}>
                    <button onClick={()=>setId(job.id)} style={{ fontSize:'12px', fontWeight:600, color:A.accent, background:'none', border:'none', cursor:'pointer', fontFamily:F }}>Details</button>
                    {job.failed > 0 && <button style={{ fontSize:'12px', fontWeight:600, color:A.danger, background:'none', border:'none', cursor:'pointer', fontFamily:F }}>Retry failed</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}