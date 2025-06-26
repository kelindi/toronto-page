import HomePage from '@/app/components/HomePage'
import { getContext } from '@/lib/context'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'
import { Agent } from '@atproto/api'

export default async function Page() {
  const ctx = await getContext()
  const cookieStore = await cookies()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- iron-session requires IncomingMessage-like object
  const req = { headers: { cookie: cookieStore.toString() } } as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- iron-session requires ServerResponse-like object  
  const res = {} as any
  const session = await getIronSession<SessionData>(req, res, sessionOptions)
  
  const agent = session.did
    ? await ctx.oauthClient
        .restore(session.did)
        .then((sess) => (sess ? new Agent(sess) : null))
        .catch((err) => {
          ctx.logger.warn({ err }, 'oauth restore failed')
          return null
        })
    : null

  // Get all profiles instead of statuses
  const profiles = await ctx.profileStore.listAll()

  const currentUserProfile = agent
    ? await ctx.profileStore.findByDid(agent.assertDid)
    : undefined

  const didHandleMap = await ctx.resolver.resolveDidsToHandles(
    profiles.map((p) => p.authorDid)
  )

  return (
    <HomePage
      profiles={profiles}
      didHandleMap={didHandleMap}
      currentUserProfile={currentUserProfile}
      currentUserDid={agent?.assertDid}
      isLoggedIn={!!agent}
    />
  )
}
