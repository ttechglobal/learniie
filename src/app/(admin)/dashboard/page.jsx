'use client'
// /admin/dashboard — Command centre: stats, generation progress, recent batches

import Link from 'next/link'

const A = { bg:'#F8F9FA', card:'#FFFFFF', border:'#E2E8F0', accent:'#2D3CE6', success:'#16A34A', warning:'#D97706', danger:'#DC2626', muted:'#64748B', text:'#0F172A' }
const F = "'Inter', -apple-system, sans-serif"

const STATS = [
  { label:'Total Curricula',    value:'12',   delta:'+2 this month',  up:true  },
  { label:'Lessons Generated',  value:'347',  delta:'+28 this week',  up:true  },
  { label:'Lessons Published',  value:'289',  delta:'83% published',  up:null  },
  { label:'Active Students',    value:'1,402',delta:'+114 this week', up:true  },
]

const PROGRESS_DATA = [
  { subject:'Physics',   classLvl:'SS2', term:'1st', curriculum:true,  subtopics:24, generated:18, published:14 },
  { subject:'Maths',     classLvl:'SS1', term:'1st', curriculum:true,  subtopics:31, generated:31, published:28 },
  { subject:'Chemistry', classLvl:'JSS3',term:'2nd', curriculum:true,  subtopics:19, generated:0,  published:0  },
  { subject:'Biology',   classLvl:'SS2', term:'1st', curriculum:false, subtopics:0,  generated:0,  published:0  },
]

const BATCH_JOBS = [
  { id:'msgbatch_0195a', subject:'Physics SS2',  subtopics:8, status:'complete', started:'2h ago',   duration:'4m 12s' },
  { id:'msgbatch_0194f', subject:'Maths SS1',    subtopics:12,status:'complete', started:'1d ago',   duration:'6m 45s' },
  { id:'msgbatch_0193e', subject:'Physics SS2',  subtopics:5, status:'failed',   started:'2d ago',   duration:'2m 01s' },
  { id:'msgbatch_0192c', subject:'Chemistry J3', subtopics:6, status:'complete', started:'3d ago',   duration:'3m 30s' },
  { id:'msgbatch_0191a', subject:'Maths SS1',    subtopics:9, status:'complete', started:'5d ago',   duration:'5m 55s' },
]

function progressBarColor(pct) {
  if (pct === 0) return '#F1F5F9'
  if (pct < 31) return '#FEF3C7'
  if (pct < 71) return '#DBEAFE'
  return '#DCFCE7'
}

function StatCard({ label, value, delta, up }) {
  return (
    <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', padding:'16px 20px', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ fontSize:'12px', fontWeight:500, color:A.muted, marginBottom:'8px' }}>{label}</div>
      <div style={{ fontSize:'28px', fontWeight:700, color:A.text, lineHeight:1, marginBottom:'8px' }}>{value}</div>
      {delta && (
        <div style={{ fontSize:'12px', fontWeight:500, color: up === true ? A.success : up === false ? A.danger : A.muted }}>
          {up === true ? '↑' : up === false ? '↓' : ''} {delta}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const cfg = {
    complete: { bg:'#DCFCE7', color:'#16A34A', border:'#86EFAC', label:'Complete' },
    processing:{ bg:'#DBEAFE', color:'#1D4ED8', border:'#BFDBFE', label:'Processing' },
    failed:   { bg:'#FEE2E2', color:'#DC2626', border:'#FCA5A5', label:'Failed' },
  }[status] || { bg:'#F1F5F9', color:'#64748B', border:'#E2E8F0', label:status }
  return (
    <span style={{ background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, borderRadius:'6px', padding:'2px 8px', fontSize:'11px', fontWeight:600 }}>
      {cfg.label}
    </span>
  )
}

export default function DashboardPage() {
  return (
    <div style={{ fontFamily:F }}>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:A.text, margin:0, marginBottom:'4px' }}>Dashboard</h1>
        <p style={{ fontSize:'13px', color:A.muted, margin:0 }}>Platform overview and content generation status.</p>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'24px' }}>
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Generation progress table */}
      <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', marginBottom:'20px', overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${A.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:'14px', fontWeight:600, color:A.text }}>Generation Progress</div>
          <Link href="/admin/lessons/generate" style={{ fontSize:'12px', fontWeight:600, color:A.accent, textDecoration:'none' }}>Open workspace →</Link>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${A.border}` }}>
              {['Subject','Class','Term','Curriculum','Subtopics','Generated','Published','Action'].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:A.muted, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROGRESS_DATA.map((row, i) => {
              const genPct = row.subtopics > 0 ? Math.round((row.generated/row.subtopics)*100) : 0
              const pubPct = row.subtopics > 0 ? Math.round((row.published/row.subtopics)*100) : 0
              return (
                <tr key={i} style={{ borderBottom:`1px solid ${A.border}`, background: i%2===0 ? A.card : A.bg }}>
                  <td style={{ padding:'12px 16px', fontWeight:600, color:A.text }}>{row.subject}</td>
                  <td style={{ padding:'12px 16px', color:A.muted }}>{row.classLvl}</td>
                  <td style={{ padding:'12px 16px', color:A.muted }}>{row.term}st</td>
                  <td style={{ padding:'12px 16px' }}>
                    {row.curriculum
                      ? <span style={{ color:A.success, fontWeight:600 }}>✓ Confirmed</span>
                      : <span style={{ color:A.warning, fontWeight:600 }}>⏳ Pending</span>}
                  </td>
                  <td style={{ padding:'12px 16px', color:A.muted }}>{row.subtopics || '—'}</td>
                  <td style={{ padding:'12px 16px', minWidth:'120px' }}>
                    {row.subtopics > 0 ? (
                      <div>
                        <div style={{ fontSize:'12px', fontWeight:600, color:A.text, marginBottom:'4px' }}>{row.generated} ({genPct}%)</div>
                        <div style={{ height:'4px', background:'#F1F5F9', borderRadius:'2px', overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${genPct}%`, background: progressBarColor(genPct), borderRadius:'2px', transition:'width 0.4s' }} />
                        </div>
                      </div>
                    ) : <span style={{ color:A.muted }}>—</span>}
                  </td>
                  <td style={{ padding:'12px 16px', color:A.muted }}>
                    {row.subtopics > 0 ? `${row.published} (${pubPct}%)` : '—'}
                  </td>
                  <td style={{ padding:'12px 16px' }}>
                    {!row.curriculum && <Link href="/admin/curriculum/upload" style={{ fontSize:'12px', fontWeight:600, color:'#D97706', textDecoration:'none' }}>Upload</Link>}
                    {row.curriculum && row.generated === 0 && <Link href="/admin/lessons/generate" style={{ fontSize:'12px', fontWeight:600, color:A.accent, textDecoration:'none' }}>Generate</Link>}
                    {row.curriculum && row.generated > 0 && row.generated < row.subtopics && <Link href="/admin/lessons/generate" style={{ fontSize:'12px', fontWeight:600, color:A.accent, textDecoration:'none' }}>Continue</Link>}
                    {row.curriculum && row.generated === row.subtopics && <Link href="/admin/lessons" style={{ fontSize:'12px', fontWeight:600, color:A.success, textDecoration:'none' }}>Review</Link>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Recent batch jobs */}
      <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${A.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:'14px', fontWeight:600, color:A.text }}>Recent Batch Jobs</div>
          <Link href="/admin/batch" style={{ fontSize:'12px', fontWeight:600, color:A.accent, textDecoration:'none' }}>View all →</Link>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${A.border}` }}>
              {['Batch ID','Subject','Subtopics','Status','Started','Duration'].map(h => (
                <th key={h} style={{ padding:'9px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:A.muted, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BATCH_JOBS.map((job, i) => (
              <tr key={i} style={{ borderBottom:`1px solid ${A.border}` }}>
                <td style={{ padding:'11px 16px', fontFamily:'monospace', fontSize:'12px', color:A.muted }}>{job.id}</td>
                <td style={{ padding:'11px 16px', fontWeight:500, color:A.text }}>{job.subject}</td>
                <td style={{ padding:'11px 16px', color:A.muted }}>{job.subtopics}</td>
                <td style={{ padding:'11px 16px' }}><StatusBadge status={job.status} /></td>
                <td style={{ padding:'11px 16px', color:A.muted }}>{job.started}</td>
                <td style={{ padding:'11px 16px', color:A.muted }}>{job.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}