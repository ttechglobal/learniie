import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LearniiBuddy } from '@/components/mascot/LearniiBuddy'
import { ChevronRight, Flame, Star, BookOpen, CheckCircle, LogOut } from 'lucide-react'

const MODE_LABELS = { school:'School Mode', exam:'Exam Mode', school_exam:'School + Exam' }
const MODE_COLORS = { school:'#0D5C2E', exam:'#4A3ADB', school_exam:'#F5A623' }

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient()
  const { data:{ user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data:student } = await supabase
    .from('students').select('*, school:schools(canonical_name)').eq('id', user.id).single()
  if (!student) redirect('/onboarding/mode')

  const stats = [
    { icon:Flame,       label:'Streak',    value:student.streak_days    || 0, color:'#F04E37', bg:'#FEE2E2' },
    { icon:Star,        label:'XP',        value:student.xp             || 0, color:'#F5A623', bg:'#FFF5E0' },
    { icon:BookOpen,    label:'Lessons',   value:student.lessons_done   || 0, color:'#0D5C2E', bg:'#E8F5EE' },
    { icon:CheckCircle, label:'Questions', value:student.questions_done || 0, color:'#4A3ADB', bg:'#EEEDF9' },
  ]
  const modeColor = MODE_COLORS[student.mode] || '#0D5C2E'

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white flex flex-col">
      <div className="px-5 pt-14 pb-2">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:'#9A8C78' }}>Account</p>
        <h1 className="font-heading text-[32px] font-black text-[#1A1209] leading-tight">Profile</h1>
      </div>

      <div className="px-5 mb-6 mt-4">
        <div className="rounded-3xl overflow-hidden p-5"
          style={{ background:'linear-gradient(145deg, #093D1E 0%, #0D5C2E 100%)' }}>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0"><LearniiBuddy size={80} expression="proud" /></div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading text-xl font-black text-white truncate">{student.display_name}</h2>
              <p className="text-white/50 text-sm mt-0.5 truncate">
                {student.school?.canonical_name || 'No school added'}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {student.class_level && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{ background:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.85)' }}>
                    {student.class_level}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: modeColor + '30', color:'#fff', border:`1px solid ${modeColor}60` }}>
                  {MODE_LABELS[student.mode]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5 px-5 mb-6">
        {stats.map(({ icon:Icon, label, value, color, bg }) => (
          <div key={label} className="rounded-2xl p-3 text-center border border-[#E8E0D4]"
            style={{ background: bg }}>
            <Icon size={16} className="mx-auto mb-1.5" style={{ color }} />
            <p className="font-heading font-black text-lg text-[#1A1209] leading-none">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-wide mt-1" style={{ color:'#9A8C78' }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="px-5 mb-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:'#9A8C78' }}>Settings</p>
        <div className="rounded-3xl overflow-hidden border border-[#E8E0D4]">
          {[
            { label:'Learning Mode',  sub:MODE_LABELS[student.mode],                      emoji:'🎯' },
            { label:'My Subjects',    sub:'Manage enrolled subjects',                       emoji:'📚' },
            { label:'My School',      sub:student.school?.canonical_name || 'Add school',  emoji:'🏫' },
            { label:'Notifications',  sub:'On',                                             emoji:'🔔' },
            { label:'About Learniie', sub:'Version 1.0',                                   emoji:'ℹ️'  },
          ].map((item, i, arr) => (
            <div key={item.label}
              className="flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-[#F9F6F0] transition-colors"
              style={{ borderBottom: i < arr.length-1 ? '1px solid #E8E0D4' : 'none' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                style={{ background:'#F3EFE8' }}>{item.emoji}</div>
              <div className="flex-1">
                <p className="font-semibold text-[15px] text-[#1A1209]">{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color:'#9A8C78' }}>{item.sub}</p>
              </div>
              <ChevronRight size={14} style={{ color:'#9A8C78' }} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-28">
        <form action="/api/auth/signout" method="POST">
          <button type="submit"
            className="w-full h-14 rounded-2xl font-heading font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ background:'#FEE2E2', color:'#B91C1C', border:'1px solid rgba(239,68,68,0.2)' }}>
            <LogOut size={17} /> Sign out
          </button>
        </form>
      </div>
    </div>
  )
}