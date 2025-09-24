import { signIn } from '@/app/actions/auth'

export const metadata = { title: 'Login' }

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <form action={signIn} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input name="email" type="email" required className="input" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input name="password" type="password" required className="input" />
        </div>
        <button className="btn btn-primary w-full">Sign in</button>
      </form>
      <p className="text-sm text-gray-600">
        Need an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
      </p>
    </div>
  )
}
