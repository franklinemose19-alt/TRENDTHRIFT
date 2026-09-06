import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(email, password)
      navigate('/admin')
    } catch {
      setError('Incorrect email or password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f10] px-5 text-[#e8e8e6]">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-white/10 p-8">
        <h1 className="font-display text-2xl">Admin login</h1>
        <p className="mt-1 text-sm text-white/50">THRIFT WEARs dashboard</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-white/60">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/60">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-white/40"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-lg bg-white py-2.5 text-sm font-medium text-black disabled:opacity-50"
        >
          {busy ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
