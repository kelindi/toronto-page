import pino from 'pino'
import type { OAuthClient } from '@atproto/oauth-client-node'
import { Firehose } from '@atproto/sync'
import {
  createBidirectionalResolver,
  createIdResolver,
  type BidirectionalResolver,
} from './id-resolver'
import { createIngester } from './ingester'
import { createClient } from '../auth/client'
import { createStatusStore, type StatusStore } from './status-store'
import { createProfileStore, type ProfileStore } from './profile-store'

export type AppContext = {
  statusStore: StatusStore
  profileStore: ProfileStore
  ingester: Firehose
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
  const ingester = createIngester(statusStore, baseIdResolver)
  const resolver = createBidirectionalResolver(baseIdResolver)
  ingester.start()
  return { statusStore, profileStore, ingester, logger, oauthClient, resolver }
}

export async function getContext(): Promise<AppContext> {
  if (!ctx) ctx = createContext()
  return ctx
}
