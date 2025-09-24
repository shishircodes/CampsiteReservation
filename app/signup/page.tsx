import { signUp } from '@/app/actions/auth'

export const metadata = { title: 'Create account' }

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Create account</h1>
      <form action={signUp} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input name="email" type="email" required className="input" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input name="password" type="password" required className="input" />
        </div>
        <button className="btn btn-primary w-full">Sign up</button>
      </form>
      <p className="text-sm text-gray-600">
        Already have an account? <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
      </p>
      <p className="text-xs text-gray-500">Check your email if confirmation is required.</p>
    </div>
  )
}
