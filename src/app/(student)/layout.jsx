import { StudentNav } from '@/components/layout/StudentNav'
export default function StudentLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', fontFamily: "'Nunito', sans-serif" }}>
      <StudentNav />
      <main className="pb-24 md:pb-8 md:pl-[72px] lg:pl-[224px]" style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </main>
    </div>
  )
}