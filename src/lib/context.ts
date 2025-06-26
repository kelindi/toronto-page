import pino from 'pino'
import type { OAuthClient } from '@atproto/oauth-client-node'
import {
  createBidirectionalResolver,
  createIdResolver,
  type BidirectionalResolver,
} from './id-resolver'
import { createClient } from '../auth/client'
import { createStatusStore, type StatusStore } from './status-store'
import { createProfileStore, type ProfileStore } from './profile-store'

export type AppContext = {
  statusStore: StatusStore
  profileStore: ProfileStore
  logger: pino.Logger
  oauthClient: OAuthClient
  resolver: BidirectionalResolver
}

let ctx: Promise<AppContext> | null = null

async function createContext(): Promise<AppContext> {
  const logger = pino({ name: 'nextjs-app' })
  const oauthClient = await createClient()
  const baseIdResolver = createIdResolver()
  const statusStore = createStatusStore()
  const profileStore = createProfileStore()
  const resolver = createBidirectionalResolver(baseIdResolver)
  return { statusStore, profileStore, logger, oauthClient, resolver }
}

export async function getContext(): Promise<AppContext> {
  if (!ctx) ctx = createContext()
  return ctx
}
