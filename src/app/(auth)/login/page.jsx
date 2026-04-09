'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input }  from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const update = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    if (err) { setError(err.message); setLoading(false); return }
    router.push('/home')
    router.refresh()
  }

  return (
    <div className="bg-white border border-border rounded-3xl p-6 shadow-card">
      <h2 className="font-heading text-xl font-black text-textPrimary mb-0.5">Welcome back 👋</h2>
      <p className="text-sm text-textSecondary mb-6">Log in to continue learning</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email"    type="email"    value={form.email}    onChange={update('email')}    placeholder="you@example.com" required />
        <Input label="Password" type="password" value={form.password} onChange={update('password')} placeholder="••••••••" required />
        {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
        <Button type="submit" loading={loading} className="w-full mt-1">Log in</Button>
      </form>

      <p className="text-center text-sm text-textSecondary mt-5">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
      </p>
    </div>
  )
}