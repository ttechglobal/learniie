'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input }  from '@/components/ui/Input'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm]     = useState({ name:'', email:'', password:'' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const update = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    // 1. Create auth account
    const { data, error: signupErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (signupErr) {
      setError(signupErr.message)
      setLoading(false)
      return
    }

    // 2. Create student profile — upsert so it never 404s
    const { error: profileErr } = await supabase
      .from('students')
      .upsert({
        id:           data.user.id,
        display_name: form.name || form.email.split('@')[0],
        mode:         'school',
      }, { onConflict: 'id' })

    if (profileErr) {
      setError('Account created but profile setup failed: ' + profileErr.message)
      setLoading(false)
      return
    }

    router.push('/onboarding/mode')
    router.refresh()
  }

  return (
    <div className="bg-white border border-border rounded-3xl p-6 shadow-card">
      <h2 className="font-heading text-xl font-black text-textPrimary mb-0.5">
        Create your account
      </h2>
      <p className="text-sm text-textSecondary mb-6">Start your learning journey today</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Your name" value={form.name}
          onChange={update('name')} placeholder="Temi Adeyemi" required
        />
        <Input
          label="Email" type="email" value={form.email}
          onChange={update('email')} placeholder="you@example.com" required
        />
        <Input
          label="Password" type="password" value={form.password}
          onChange={update('password')} helperText="At least 8 characters"
          required minLength={8}
        />
        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>
        )}
        <Button type="submit" loading={loading} className="w-full mt-1">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-textSecondary mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}