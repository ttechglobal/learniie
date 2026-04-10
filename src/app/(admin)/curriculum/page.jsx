'use client'
// /admin/curriculum — Curriculum list with filters and status

import Link from 'next/link'
import { useState } from 'react'

const A = { bg:'#F8F9FA', card:'#FFFFFF', border:'#E2E8F0', accent:'#2D3CE6', success:'#16A34A', warning:'#D97706', muted:'#64748B', text:'#0F172A' }
const F = "'Inter', -apple-system, sans-serif"

const CURRICULA = [
  { id:'c1', country:'🇳🇬 Nigeria', subject:'Physics',     classLvl:'SS2',  term:'1st Term', standard:'NERDC', uploaded:'2 Jan 2026', status:'confirmed', subtopics:24 },
  { id:'c2', country:'🇳🇬 Nigeria', subject:'Mathematics', classLvl:'SS1',  term:'1st Term', standard:'NERDC', uploaded:'3 Jan 2026', status:'confirmed', subtopics:31 },
  { id:'c3', country:'🇳🇬 Nigeria', subject:'Chemistry',   classLvl:'JSS3', term:'2nd Term', standard:'NERDC', uploaded:'5 Jan 2026', status:'pending',   subtopics:null },
  { id:'c4', country:'🇳🇬 Nigeria', subject:'Biology',     classLvl:'SS2',  term:'1st Term', standard:'NERDC', uploaded:'8 Jan 2026', status:'confirmed', subtopics:26 },
  { id:'c5', country:'🇬🇧 UK',      subject:'Mathematics', classLvl:'Year9',term:'Autumn',   standard:'GCSE',  uploaded:'10 Jan 2026',status:'pending',   subtopics:null },
]

const STATUS_CFG = {
  confirmed: { bg:'#DCFCE7', color:'#16A34A', border:'#86EFAC', label:'✓ Confirmed' },
  pending:   { bg:'#FEF9C3', color:'#854D0E', border:'#FDE68A', label:'⏳ Pending Review' },
  processing:{ bg:'#DBEAFE', color:'#1D4ED8', border:'#BFDBFE', label:'⚙ Processing' },
}

function Badge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.pending
  return <span style={{ background:c.bg, color:c.color, border:`1px solid ${c.border}`, borderRadius:'6px', padding:'2px 8px', fontSize:'11px', fontWeight:600, whiteSpace:'nowrap' }}>{c.label}</span>
}

function Btn({ children, onClick, variant='ghost', style={} }) {
  const base = { padding:'6px 14px', borderRadius:'6px', fontSize:'13px', fontWeight:600, cursor:'pointer', border:'none', transition:'all 0.12s' }
  const styles = {
    primary: { background:A.accent, color:'#fff' },
    ghost:   { background:'transparent', color:A.accent, border:`1px solid ${A.border}` },
  }
  return <button onClick={onClick} style={{ ...base, ...styles[variant], ...style }}>{children}</button>
}

export default function CurriculumPage() {
  const [countryFilter, setCountry] = useState('All')
  const [subjectFilter, setSubject] = useState('All')
  const [statusFilter,  setStatus]  = useState('All')

  const filtered = CURRICULA.filter(c => {
    if (countryFilter !== 'All' && !c.country.includes(countryFilter)) return false
    if (subjectFilter !== 'All' && c.subject !== subjectFilter) return false
    if (statusFilter  !== 'All' && c.status !== statusFilter.toLowerCase()) return false
    return true
  })

  const sel = (val, cur, set) => (
    <select value={cur} onChange={e => set(e.target.value)} style={{ padding:'6px 10px', borderRadius:'6px', border:`1px solid ${A.border}`, fontSize:'13px', color:A.text, background:A.card, cursor:'pointer', fontFamily:F }}>
      {val.map(v => <option key={v}>{v}</option>)}
    </select>
  )

  return (
    <div style={{ fontFamily:F }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:A.text, margin:0, marginBottom:'4px' }}>Curricula</h1>
          <p style={{ fontSize:'13px', color:A.muted, margin:0 }}>{CURRICULA.length} curricula uploaded across all regions.</p>
        </div>
        <Link href="/admin/curriculum/upload" style={{ textDecoration:'none' }}>
          <Btn variant="primary">+ Upload Curriculum</Btn>
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'10px', alignItems:'center', marginBottom:'16px', padding:'12px 16px', background:A.card, borderRadius:'10px', border:`1px solid ${A.border}` }}>
        <span style={{ fontSize:'12px', fontWeight:600, color:A.muted }}>Filter:</span>
        {sel(['All','Nigeria','UK','US'], countryFilter, setCountry)}
        {sel(['All','Physics','Mathematics','Chemistry','Biology','English'], subjectFilter, setSubject)}
        {sel(['All','Confirmed','Pending'], statusFilter, setStatus)}
      </div>

      {/* Table */}
      <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${A.border}`, background:'#FAFAFA' }}>
              {['Country','Subject','Class','Term','Standard','Uploaded','Status','Subtopics','Actions'].map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'11px', fontWeight:600, color:A.muted, textTransform:'uppercase', letterSpacing:'0.5px', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} style={{ borderBottom:`1px solid ${A.border}`, transition:'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background='#FAFBFF'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                <td style={{ padding:'12px 14px', color:A.muted, whiteSpace:'nowrap' }}>{c.country}</td>
                <td style={{ padding:'12px 14px', fontWeight:600, color:A.text }}>{c.subject}</td>
                <td style={{ padding:'12px 14px', color:A.muted }}>{c.classLvl}</td>
                <td style={{ padding:'12px 14px', color:A.muted, whiteSpace:'nowrap' }}>{c.term}</td>
                <td style={{ padding:'12px 14px', color:A.muted }}>{c.standard}</td>
                <td style={{ padding:'12px 14px', color:A.muted, whiteSpace:'nowrap' }}>{c.uploaded}</td>
                <td style={{ padding:'12px 14px' }}><Badge status={c.status} /></td>
                <td style={{ padding:'12px 14px', color:A.muted }}>{c.subtopics ?? '—'}</td>
                <td style={{ padding:'12px 14px' }}>
                  <div style={{ display:'flex', gap:'8px' }}>
                    <Link href={`/admin/curriculum/${c.id}`} style={{ fontSize:'12px', fontWeight:600, color:A.accent, textDecoration:'none' }}>View</Link>
                    {c.status === 'confirmed' && (
                      <Link href="/admin/lessons/generate" style={{ fontSize:'12px', fontWeight:600, color:A.success, textDecoration:'none' }}>Generate</Link>
                    )}
                    {c.status === 'pending' && (
                      <Link href={`/admin/curriculum/${c.id}`} style={{ fontSize:'12px', fontWeight:600, color:A.warning, textDecoration:'none' }}>Review</Link>
                    )}
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