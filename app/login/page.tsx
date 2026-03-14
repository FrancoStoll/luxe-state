import { getTranslation } from '@/lib/i18n-server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GoogleSignIn from '@/components/auth/GoogleSignIn'
import GithubSignIn from '@/components/auth/GithubSignIn'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  const { t } = await getTranslation()

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <main className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-mosque rounded-xl mb-6 shadow-soft text-white">
            <span className="material-icons text-3xl">real_estate_agent</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-nordic-dark mb-2">
            {t('auth.welcome')}
          </h1>
          <p className="text-nordic-muted/80">
            {t('auth.subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-8 sm:p-10 border border-white/50 backdrop-blur-sm">
          <div className="space-y-4">
            <GoogleSignIn />
            <GithubSignIn />
          </div>

          <p className="mt-8 text-center text-sm text-nordic-muted">
            {t('auth.no_account')}{' '}
            <a className="font-semibold text-mosque hover:text-mosque/80 transition-colors" href="#">
              {t('auth.sign_up')}
            </a>
          </p>
        </div>

        <div className="mt-8 text-center">
          <nav className="flex justify-center gap-6 text-xs text-nordic-muted/60">
            <a className="hover:text-nordic-dark transition-colors" href="#">{t('auth.privacy')}</a>
            <a className="hover:text-nordic-dark transition-colors" href="#">{t('auth.terms')}</a>
            <a className="hover:text-nordic-dark transition-colors" href="#">{t('auth.help')}</a>
          </nav>
        </div>
      </main>
    </div>
  )
}
