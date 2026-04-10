'use client'
// /admin/curriculum/upload — 3-step curriculum upload wizard

import { useCallback, useRef, useState } from 'react'

const A = { bg:'#F8F9FA', card:'#FFFFFF', border:'#E2E8F0', accent:'#2D3CE6', success:'#16A34A', warning:'#D97706', danger:'#DC2626', muted:'#64748B', text:'#0F172A' }
const F = "'Inter', -apple-system, sans-serif"

const COUNTRIES   = [{ flag:'🇳🇬', name:'Nigeria' },{ flag:'🇬🇧', name:'UK' },{ flag:'🇺🇸', name:'US' }]
const STANDARDS   = { Nigeria:['NERDC','WAEC','JAMB'], UK:['GCSE','A-Level','IB'], US:['Common Core','SAT','AP'] }
const SUBJECTS    = ['Physics','Mathematics','Chemistry','Biology','English','Economics','Government','Literature','Geography']
const CLASS_LVLS  = { Nigeria:['JSS1','JSS2','JSS3','SS1','SS2','SS3'], UK:['Year7','Year8','Year9','Year10','Year11'], US:['Grade6','Grade7','Grade8','Grade9','Grade10','Grade11','Grade12'] }
const TERMS       = { Nigeria:['1st Term','2nd Term','3rd Term'], UK:['Autumn','Spring','Summer'], US:['Fall','Spring','Summer'] }

const buildExtractionPrompt = (form) => `You are a ${form.country} secondary school curriculum specialist.

I am going to give you a curriculum document for:
- Subject: ${form.subject || '[SUBJECT]'}
- Class Level: ${form.classLevel || '[CLASS]'}
- Term: ${form.term || '[TERM]'}
- Curriculum Standard: ${form.standard || '[STANDARD]'}
- Country: ${form.country}

Your task: Extract the full curriculum and return it as a single JSON object. Return ONLY the JSON — no markdown fences, no explanation, no preamble.

CRITICAL RULES:
1. Break every topic into the SMALLEST possible single concepts. Each subtopic must cover ONE concept only.
2. A topic like "Speed, Velocity and Acceleration" must become THREE separate subtopics.
3. Build concepts progressively — earlier subtopics lay the foundation for later ones.
4. difficultyLevel: easy = no formula; medium = formula or moderate complexity; hard = requires prior concepts.
5. estimatedSlides: minimum 4, maximum 10.

Required output format:
{
  "country": "${form.country}",
  "curriculumStandard": "${form.standard || '[STANDARD]'}",
  "subject": "${form.subject || '[SUBJECT]'}",
  "classLevel": "${form.classLevel || '[CLASS]'}",
  "term": "${form.term || '[TERM]'}",
  "schoolMode": {
    "chapters": [
      {
        "chapterNumber": 1,
        "chapterTitle": "string",
        "topics": [
          {
            "topicId": "slug-format",
            "topicTitle": "string",
            "subtopics": [
              {
                "subtopicId": "slug-format",
                "subtopicTitle": "string",
                "conceptSummary": "1-2 sentence plain-English description",
                "keyTerms": ["term1", "term2"],
                "hasFormula": true,
                "formula": "Formula = in plain text or null",
                "difficultyLevel": "easy | medium | hard",
                "estimatedSlides": 6,
                "buildingOn": ["prerequisite-subtopicId or null"]
              }
            ]
          }
        ]
      }
    ]
  },
  "examMode": {
    "topicGroups": [
      {
        "groupTitle": "string",
        "topics": [ { "topicId": "slug", "topicTitle": "string", "subtopics": [...] } ]
      }
    ]
  }
}

Attach your curriculum document and return the JSON.`

function StepIndicator({ step }) {
  const steps = ['Tag & Upload','Extract','Review & Confirm']
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'0', marginBottom:'28px' }}>
      {steps.map((label, i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', flex: i < steps.length-1 ? 1 : 'none' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
            <div style={{ width:'28px', height:'28px', borderRadius:'50%', background: i < step ? A.success : i === step ? A.accent : A.border, color: i <= step ? '#fff' : A.muted, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:700, transition:'all 0.2s' }}>
              {i < step ? '✓' : i + 1}
            </div>
            <span style={{ fontSize:'13px', fontWeight: i === step ? 600 : 500, color: i === step ? A.text : A.muted }}>{label}</span>
          </div>
          {i < steps.length - 1 && <div style={{ flex:1, height:'1px', background: i < step ? A.success : A.border, margin:'0 12px' }} />}
        </div>
      ))}
    </div>
  )
}

function FormField({ label, required, children }) {
  return (
    <div style={{ marginBottom:'16px' }}>
      <label style={{ display:'block', fontSize:'12px', fontWeight:600, color:A.text, marginBottom:'6px' }}>
        {label}{required && <span style={{ color:A.danger, marginLeft:'2px' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const selectStyle = { width:'100%', padding:'8px 10px', borderRadius:'6px', border:`1px solid ${A.border}`, fontSize:'13px', color:A.text, background:A.card, fontFamily:F, outline:'none' }

export default function UploadPage() {
  const [step, setStep]       = useState(0)
  const [form, setForm]       = useState({ country:'Nigeria', standard:'NERDC', subject:'', classLevel:'', term:'', schoolMode:true, examMode:true })
  const [file, setFile]       = useState(null)
  const [dragging, setDrag]   = useState(false)
  const [jsonInput, setJson]  = useState('')
  const [jsonError, setJErr]  = useState('')
  const [jsonOk,    setJOk]   = useState(false)
  const [curriculum, setCurr] = useState(null)
  const [extracting, setExtr] = useState(false)
  const [selected,  setSel]   = useState(null) // selected subtopic in review
  const [copied,    setCopied]= useState(false)
  const fileRef = useRef(null)

  const country     = form.country || 'Nigeria'
  const standards   = STANDARDS[country] || STANDARDS.Nigeria
  const classLevels = CLASS_LVLS[country] || CLASS_LVLS.Nigeria
  const termOptions = TERMS[country]     || TERMS.Nigeria
  const prompt      = buildExtractionPrompt(form)

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function handleFile(f) {
    if (!f) return
    if (f.size > 10 * 1024 * 1024) { alert('File must be under 10MB'); return }
    setFile(f)
  }

  function handleDrop(e) { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }

  function validateJson() {
    try {
      const parsed = JSON.parse(jsonInput)
      if (!parsed.schoolMode?.chapters && !parsed.examMode?.topicGroups) throw new Error('Missing schoolMode.chapters or examMode.topicGroups')
      setCurr(parsed); setJOk(true); setJErr('')
    } catch(e) { setJErr(e.message); setJOk(false) }
  }

  async function extractDirect() {
    if (!file && !jsonInput) return
    setExtr(true); setStep(1)
    await new Promise(r => setTimeout(r, 2000))
    // In production: call /api/admin/curriculum with file content
    const mockCurriculum = {
      country: form.country, subject: form.subject, classLevel: form.classLevel, term: form.term,
      schoolMode: { chapters: [
        { chapterNumber:1, chapterTitle:'Mechanics', topics:[
          { topicId:'motion', topicTitle:'Motion and Kinematics', subtopics:[
            { subtopicId:'intro-motion',    subtopicTitle:'Introduction to Motion',   difficultyLevel:'easy',   estimatedSlides:4, conceptSummary:'What motion is and how we observe it',             keyTerms:['motion','rest','reference point'],   hasFormula:false, formula:null, buildingOn:[] },
            { subtopicId:'types-of-motion', subtopicTitle:'Types of Motion',          difficultyLevel:'easy',   estimatedSlides:4, conceptSummary:'Linear, circular, and oscillatory motion types',    keyTerms:['linear','circular','oscillatory'],   hasFormula:false, formula:null, buildingOn:['intro-motion'] },
            { subtopicId:'speed',           subtopicTitle:'Speed',                    difficultyLevel:'medium', estimatedSlides:6, conceptSummary:'Speed measures distance covered per unit time',      keyTerms:['speed','distance','time','km/h'],    hasFormula:true,  formula:'Speed = Distance / Time', buildingOn:['types-of-motion'] },
            { subtopicId:'velocity',        subtopicTitle:'Velocity',                 difficultyLevel:'medium', estimatedSlides:6, conceptSummary:'Velocity is speed with a specified direction',       keyTerms:['velocity','vector','direction'],     hasFormula:true,  formula:'v = d/t', buildingOn:['speed'] },
            { subtopicId:'acceleration',    subtopicTitle:'Acceleration',             difficultyLevel:'hard',   estimatedSlides:7, conceptSummary:'Rate of change of velocity over time',               keyTerms:['acceleration','deceleration','m/s²'],hasFormula:true,  formula:'a = (v-u)/t', buildingOn:['velocity'] },
          ]},
          { topicId:'forces', topicTitle:'Forces', subtopics:[
            { subtopicId:'what-is-force',   subtopicTitle:'What is Force?',           difficultyLevel:'easy',   estimatedSlides:4, conceptSummary:'Forces as pushes and pulls that cause motion change',keyTerms:['force','Newton','push','pull'],      hasFormula:false, formula:null, buildingOn:[] },
            { subtopicId:'newtons-1st',     subtopicTitle:"Newton's First Law",       difficultyLevel:'medium', estimatedSlides:6, conceptSummary:'Objects remain at rest or in motion unless acted on', keyTerms:['inertia','balanced forces','rest'],  hasFormula:false, formula:null, buildingOn:['what-is-force'] },
          ]},
        ]},
      ]},
    }
    setCurr(mockCurriculum)
    setExtr(false); setStep(2)
  }

  function countSubtopics(c) {
    if (!c?.schoolMode?.chapters) return 0
    return c.schoolMode.chapters.reduce((n, ch) => n + ch.topics.reduce((m, t) => m + t.subtopics.length, 0), 0)
  }

  const DIFF_COLORS = { easy:{ bg:'#DCFCE7',color:'#16A34A' }, medium:{ bg:'#FEF9C3',color:'#854D0E' }, hard:{ bg:'#FEE2E2',color:'#DC2626' } }

  // ── STEP 0: Tag & Upload ───────────────────────────────────────────────────
  if (step === 0) return (
    <div style={{ fontFamily:F }}>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:A.text, margin:0, marginBottom:'4px' }}>Upload Curriculum</h1>
        <p style={{ fontSize:'13px', color:A.muted, margin:0 }}>Tag the curriculum metadata, upload your document, then extract with AI.</p>
      </div>
      <StepIndicator step={0} />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', alignItems:'start' }}>
        {/* Left: form fields */}
        <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', padding:'20px' }}>
          <div style={{ fontSize:'14px', fontWeight:600, color:A.text, marginBottom:'16px' }}>Curriculum Details</div>

          <FormField label="Country" required>
            <div style={{ display:'flex', gap:'8px' }}>
              {COUNTRIES.map(c => (
                <button key={c.name} onClick={() => { set('country',c.name); set('standard',STANDARDS[c.name][0]); set('classLevel',''); set('term','') }}
                  style={{ flex:1, padding:'8px', borderRadius:'6px', border:`1.5px solid ${form.country===c.name?A.accent:A.border}`, background:form.country===c.name?'#EEF0FF':A.card, cursor:'pointer', fontSize:'12px', fontWeight:600, color:form.country===c.name?A.accent:A.muted, fontFamily:F }}>
                  {c.flag} {c.name}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="Curriculum Standard" required>
            <select value={form.standard} onChange={e=>set('standard',e.target.value)} style={selectStyle}>
              {standards.map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>

          <FormField label="Subject" required>
            <select value={form.subject} onChange={e=>set('subject',e.target.value)} style={selectStyle}>
              <option value="">Select subject...</option>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>

          <FormField label="Class Level" required>
            <select value={form.classLevel} onChange={e=>set('classLevel',e.target.value)} style={selectStyle}>
              <option value="">Select level...</option>
              {classLevels.map(l => <option key={l}>{l}</option>)}
            </select>
          </FormField>

          <FormField label="Term" required>
            <select value={form.term} onChange={e=>set('term',e.target.value)} style={selectStyle}>
              <option value="">Select term...</option>
              {termOptions.map(t => <option key={t}>{t}</option>)}
            </select>
          </FormField>

          <div style={{ fontSize:'12px', fontWeight:600, color:A.text, marginBottom:'8px' }}>Mode Applicability</div>
          <div style={{ display:'flex', gap:'16px' }}>
            {['schoolMode','examMode'].map(k => (
              <label key={k} style={{ display:'flex', alignItems:'center', gap:'6px', cursor:'pointer', fontSize:'13px', color:A.text }}>
                <input type="checkbox" checked={form[k]} onChange={e=>set(k,e.target.checked)} style={{ accentColor:A.accent, width:'14px', height:'14px' }} />
                {k === 'schoolMode' ? '☑ School Mode' : '☑ Exam Mode'}
              </label>
            ))}
          </div>
        </div>

        {/* Right: dropzone + extraction prompt */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {/* Dropzone */}
          <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', padding:'20px' }}>
            <div style={{ fontSize:'14px', fontWeight:600, color:A.text, marginBottom:'14px' }}>Upload Document</div>
            <div
              onDragOver={e => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
              onClick={() => !file && fileRef.current?.click()}
              style={{ border:`2px dashed ${dragging ? A.accent : '#CBD5E1'}`, borderRadius:'10px', minHeight:'160px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px', cursor:file?'default':'pointer', background:dragging?'#EEF0FF':A.bg, transition:'all 0.15s', padding:'20px' }}
            >
              <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" style={{ display:'none' }} onChange={e=>handleFile(e.target.files?.[0]||null)} />
              {!file ? (
                <>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 16V8M12 8l-3 3M12 8l3 3" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="3" width="18" height="18" rx="4" stroke="#94A3B8" strokeWidth="1.5"/></svg>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:'13px', fontWeight:600, color:A.text }}>Drop your curriculum PDF or DOCX here</div>
                    <div style={{ fontSize:'12px', color:A.accent, marginTop:'4px' }}>or click to browse</div>
                    <div style={{ fontSize:'11px', color:A.muted, marginTop:'6px' }}>.pdf, .docx, .txt · Max 10MB</div>
                  </div>
                </>
              ) : (
                <div style={{ display:'flex', alignItems:'center', gap:'12px', width:'100%' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'8px', background:'#DCFCE7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>📄</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'13px', fontWeight:600, color:A.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{file.name}</div>
                    <div style={{ fontSize:'11px', color:A.muted }}>{(file.size/1024).toFixed(0)} KB</div>
                  </div>
                  <span style={{ color:'#16A34A', fontSize:'18px' }}>✓</span>
                  <button onClick={e=>{e.stopPropagation();setFile(null)}} style={{ fontSize:'12px', color:A.danger, background:'none', border:'none', cursor:'pointer', fontFamily:F }}>Remove</button>
                </div>
              )}
            </div>
          </div>

          {/* Extraction prompt panel */}
          <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:`1px solid ${A.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:'#FAFAFA' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <span>📋</span>
                <span style={{ fontSize:'13px', fontWeight:600, color:A.text }}>Curriculum Extraction Prompt</span>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(()=>setCopied(false),2000) }} style={{ padding:'4px 10px', borderRadius:'5px', border:`1px solid ${A.border}`, background:copied?'#DCFCE7':A.card, fontSize:'11px', fontWeight:600, color:copied?A.success:A.muted, cursor:'pointer', fontFamily:F }}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div style={{ padding:'12px 16px', fontSize:'11px', color:A.muted, borderBottom:`1px solid ${A.border}`, lineHeight:1.6 }}>
              Use this in Claude.ai — paste the prompt, attach your PDF, get the JSON back, then paste below.
            </div>
            <textarea readOnly value={prompt} style={{ width:'100%', padding:'12px 16px', border:'none', outline:'none', fontSize:'11px', fontFamily:'monospace', color:A.text, background:A.bg, resize:'none', height:'180px', boxSizing:'border-box', lineHeight:1.6 }} />
          </div>

          {/* JSON paste area */}
          <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:`1px solid ${A.border}`, fontSize:'13px', fontWeight:600, color:A.text }}>Paste Extracted JSON</div>
            <textarea value={jsonInput} onChange={e=>{setJson(e.target.value);setJOk(false);setJErr('')}} placeholder='{"country":"Nigeria","schoolMode":{"chapters":[...]}}'
              style={{ width:'100%', padding:'12px 16px', border:'none', outline:'none', fontSize:'12px', fontFamily:'monospace', color:A.text, resize:'vertical', minHeight:'120px', boxSizing:'border-box', lineHeight:1.6 }} />
            <div style={{ padding:'10px 16px', borderTop:`1px solid ${A.border}`, display:'flex', alignItems:'center', gap:'10px' }}>
              <button onClick={validateJson} style={{ padding:'6px 14px', borderRadius:'6px', border:`1px solid ${A.border}`, background:A.card, fontSize:'12px', fontWeight:600, cursor:'pointer', fontFamily:F, color:A.text }}>Validate JSON</button>
              {jsonOk  && <span style={{ fontSize:'12px', color:A.success, fontWeight:600 }}>✓ Valid JSON</span>}
              {jsonError&&<span style={{ fontSize:'12px', color:A.danger, fontWeight:600 }}>{jsonError}</span>}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={extractDirect} disabled={!file && !jsonInput} style={{ flex:1, padding:'10px', borderRadius:'6px', border:'none', background:(!file&&!jsonInput)?'#CBD5E1':A.accent, color:'#fff', fontSize:'13px', fontWeight:600, cursor:(!file&&!jsonInput)?'not-allowed':'pointer', fontFamily:F }}>
              {file ? 'Extract with Claude API →' : 'Extract directly →'}
            </button>
            {jsonOk && <button onClick={()=>{ setCurr(JSON.parse(jsonInput)); setStep(2) }} style={{ flex:1, padding:'10px', borderRadius:'6px', border:'none', background:A.success, color:'#fff', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:F }}>Next: Review →</button>}
          </div>
        </div>
      </div>
    </div>
  )

  // ── STEP 1: Extracting ─────────────────────────────────────────────────────
  if (step === 1) return (
    <div style={{ fontFamily:F }}>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:A.text, margin:0, marginBottom:'4px' }}>Extracting Curriculum</h1>
      </div>
      <StepIndicator step={1} />
      <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', padding:'48px', textAlign:'center' }}>
        <div style={{ fontSize:'32px', marginBottom:'16px', animation:'spin 1s linear infinite' }}>⚙</div>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        <div style={{ fontSize:'15px', fontWeight:600, color:A.text, marginBottom:'8px' }}>Extracting curriculum structure...</div>
        <div style={{ fontSize:'13px', color:A.muted }}>Claude is analysing your document and breaking it into individual subtopics.</div>
        <div style={{ marginTop:'24px', display:'flex', flexDirection:'column', gap:'6px', alignItems:'center' }}>
          {['Identified chapters...','Found topics...','Breaking into subtopics...'].map((msg,i) => (
            <div key={i} style={{ fontSize:'12px', color:A.success }}>✓ {msg}</div>
          ))}
        </div>
      </div>
    </div>
  )

  // ── STEP 2: Review & Confirm ───────────────────────────────────────────────
  const chapters = curriculum?.schoolMode?.chapters || []
  const totalSubs = countSubtopics(curriculum)

  return (
    <div style={{ fontFamily:F }}>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:A.text, margin:0, marginBottom:'4px' }}>Review Curriculum</h1>
        <p style={{ fontSize:'13px', color:A.muted, margin:0 }}>{totalSubs} subtopics extracted · {curriculum?.subject} {curriculum?.classLevel} · {curriculum?.term}</p>
      </div>
      <StepIndicator step={2} />

      <div style={{ display:'grid', gridTemplateColumns:'60% 40%', gap:'16px', alignItems:'start' }}>
        {/* Left: tree */}
        <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', overflow:'hidden', maxHeight:'calc(100vh - 260px)', overflowY:'auto' }}>
          <div style={{ padding:'12px 16px', borderBottom:`1px solid ${A.border}`, fontSize:'13px', fontWeight:600, color:A.text, background:'#FAFAFA', position:'sticky', top:0 }}>
            Curriculum Tree — School Mode
          </div>
          {chapters.map((ch, ci) => (
            <div key={ci}>
              <div style={{ padding:'10px 16px', background:'#F8F9FA', borderBottom:`1px solid ${A.border}`, fontSize:'12px', fontWeight:700, color:A.text }}>
                ▼ Chapter {ch.chapterNumber}: {ch.chapterTitle}
              </div>
              {ch.topics.map((topic, ti) => (
                <div key={ti}>
                  <div style={{ padding:'8px 24px', borderBottom:`1px solid ${A.border}`, fontSize:'12px', fontWeight:600, color:A.muted }}>
                    ▼ {topic.topicTitle}
                  </div>
                  {topic.subtopics.map((sub, si) => {
                    const dc = DIFF_COLORS[sub.difficultyLevel] || DIFF_COLORS.easy
                    const isSel = selected?.subtopicId === sub.subtopicId
                    return (
                      <div key={si} onClick={()=>setSel(sub)} style={{ padding:'9px 36px', borderBottom:`1px solid ${A.border}`, display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', background:isSel?'#EEF0FF':A.card, transition:'background 0.1s' }}>
                        <span style={{ fontSize:'8px', color:A.muted }}>◉</span>
                        <span style={{ flex:1, fontSize:'13px', color:A.text, fontWeight:isSel?600:400 }}>{sub.subtopicTitle}</span>
                        <span style={{ background:dc.bg, color:dc.color, borderRadius:'6px', padding:'1px 7px', fontSize:'10px', fontWeight:600, flexShrink:0 }}>{sub.difficultyLevel}</span>
                        <span style={{ fontSize:'11px', color:A.muted, flexShrink:0 }}>{sub.estimatedSlides} slides</span>
                        <button onClick={e=>{e.stopPropagation()}} style={{ fontSize:'11px', color:A.muted, background:'none', border:'none', cursor:'pointer', padding:'2px 4px', fontFamily:F }}>✏</button>
                        <button onClick={e=>{e.stopPropagation()}} style={{ fontSize:'11px', color:'#EF4444', background:'none', border:'none', cursor:'pointer', padding:'2px 4px', fontFamily:F }}>🗑</button>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right: detail panel */}
        <div style={{ position:'sticky', top:'80px', display:'flex', flexDirection:'column', gap:'14px' }}>
          {selected ? (
            <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', overflow:'hidden' }}>
              <div style={{ padding:'12px 16px', borderBottom:`1px solid ${A.border}`, background:'#FAFAFA' }}>
                <div style={{ fontSize:'13px', fontWeight:700, color:A.text }}>{selected.subtopicTitle}</div>
                <div style={{ fontSize:'11px', color:A.muted, marginTop:'2px' }}>{selected.difficultyLevel} · {selected.estimatedSlides} slides</div>
              </div>
              <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:'12px' }}>
                <div>
                  <div style={{ fontSize:'11px', fontWeight:600, color:A.muted, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'5px' }}>Concept Summary</div>
                  <div style={{ fontSize:'13px', color:A.text, lineHeight:1.6 }}>{selected.conceptSummary}</div>
                </div>
                {selected.keyTerms?.length > 0 && (
                  <div>
                    <div style={{ fontSize:'11px', fontWeight:600, color:A.muted, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'5px' }}>Key Terms</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'5px' }}>
                      {selected.keyTerms.map(t => <span key={t} style={{ background:'#F1F5F9', color:A.text, borderRadius:'5px', padding:'2px 8px', fontSize:'11px', fontWeight:500 }}>{t}</span>)}
                    </div>
                  </div>
                )}
                {selected.hasFormula && (
                  <div>
                    <div style={{ fontSize:'11px', fontWeight:600, color:A.muted, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'5px' }}>Formula</div>
                    <div style={{ background:'#F8F9FA', border:`1px solid ${A.border}`, borderRadius:'6px', padding:'8px 12px', fontSize:'13px', fontFamily:'monospace', color:A.accent }}>{selected.formula}</div>
                  </div>
                )}
                {selected.buildingOn?.length > 0 && selected.buildingOn[0] && (
                  <div>
                    <div style={{ fontSize:'11px', fontWeight:600, color:A.muted, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'5px' }}>Builds On</div>
                    {selected.buildingOn.map(b => <div key={b} style={{ fontSize:'12px', color:A.muted }}>→ {b}</div>)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', padding:'24px', textAlign:'center', color:A.muted }}>
              <div style={{ fontSize:'24px', marginBottom:'8px' }}>☝</div>
              <div style={{ fontSize:'13px' }}>Click a subtopic to see details and edit.</div>
            </div>
          )}

          {/* Action bar */}
          <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:'10px', padding:'14px 16px', display:'flex', gap:'8px' }}>
            <button onClick={()=>setStep(0)} style={{ flex:1, padding:'8px', borderRadius:'6px', border:`1px solid ${A.border}`, background:A.card, fontSize:'13px', fontWeight:600, cursor:'pointer', color:A.text, fontFamily:F }}>← Back</button>
            <button style={{ flex:1, padding:'8px', borderRadius:'6px', border:`1px solid ${A.border}`, background:A.card, fontSize:'13px', fontWeight:600, cursor:'pointer', color:A.muted, fontFamily:F }}>Save Draft</button>
            <button style={{ flex:1, padding:'8px', borderRadius:'6px', border:'none', background:A.accent, color:'#fff', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:F }}>Confirm →</button>
          </div>
        </div>
      </div>
    </div>
  )
}