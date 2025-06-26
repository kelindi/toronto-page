import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { Agent } from '@atproto/api'
import { TID } from '@atproto/common'

import { getContext } from '@/lib/context'
import { sessionOptions, SessionData } from '@/lib/session'
import * as Profile from '@/lexicon/types/inc/toronto/discover/beta/profile'

interface ProfileRecord {
  $type: string
  name: string
  bio: string
  interests: string[]
  neighbourhood?: string
  currentProject: string
  twitterUrl?: string
  instagramUrl?: string
  githubUrl?: string
  linkedinUrl?: string
  websiteUrl?: string
  createdAt: string
  updatedAt?: string
}

const PROFILE_COLLECTION = 'inc.toronto.discover.beta.profile'
const PROFILE_TYPE = 'inc.toronto.discover.beta.profile'

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const ctx = await getContext()
    const url = new URL(req.url)
    const did = url.searchParams.get('did')
    
    if (!did) {
      return NextResponse.json(
        { error: 'DID parameter is required' },
        { status: 400 }
      )
    }

    const profile = await ctx.profileStore.findByDid(did)
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile })

  } catch (error) {
    console.error('Error in profile GET API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const ctx = await getContext()
    
    // Create a response object for session handling
    const res = NextResponse.redirect(new URL('/', req.url))
    const session = await getIronSession<SessionData>(req, res, sessionOptions)

    // Check if user is authenticated
    if (!session.did) {
      return NextResponse.json(
        { error: 'Session required' }, 
        { status: 401 }
      )
    }

    // Parse the request body
    const formData = await req.formData()
    const name = formData.get('name') as string
    const bio = formData.get('bio') as string
    const interests = formData.get('interests') as string
    const neighbourhood = formData.get('neighbourhood') as string
    const currentProject = formData.get('currentProject') as string
    const twitterUrl = formData.get('twitterUrl') as string
    const instagramUrl = formData.get('instagramUrl') as string
    const githubUrl = formData.get('githubUrl') as string
    const linkedinUrl = formData.get('linkedinUrl') as string
    const websiteUrl = formData.get('websiteUrl') as string

    if (!name || !bio || !interests || !currentProject) {
      return NextResponse.json(
        { error: 'Name, bio, interests, and current project are required' },
        { status: 400 }
      )
    }

    // Parse interests from comma-separated string
    const interestsArray = interests.split(',').map(i => i.trim()).filter(i => i.length > 0)

    // Restore the user's AT Protocol session
    const agentSession = await ctx.oauthClient.restore(session.did)
    if (!agentSession) {
      return NextResponse.json(
        { error: 'No valid session found' }, 
        { status: 401 }
      )
    }

    const agent = new Agent(agentSession)
    
    // Check if profile already exists
    const existingProfile = await ctx.profileStore.findByDid(agent.assertDid)
    const recordKey = existingProfile ? 'self' : TID.nextStr()
    const isUpdate = !!existingProfile
    
    // Create the profile record
    const record: ProfileRecord = {
      $type: PROFILE_TYPE,
      name,
      bio,
      interests: interestsArray,
      neighbourhood: neighbourhood || undefined,
      currentProject,
      twitterUrl: twitterUrl || undefined,
      instagramUrl: instagramUrl || undefined,
      githubUrl: githubUrl || undefined,
      linkedinUrl: linkedinUrl || undefined,
      websiteUrl: websiteUrl || undefined,
      createdAt: existingProfile?.createdAt || new Date().toISOString(),
      updatedAt: isUpdate ? new Date().toISOString() : undefined,
    }

    // Validate the record
    if (!Profile.validateRecord(record).success) {
      return NextResponse.json(
        { error: 'Invalid profile format' }, 
        { status: 400 }
      )
    }

    // Write the record to AT Protocol
    let uri: string
    try {
      const putResult = await agent.com.atproto.repo.putRecord({
        repo: agent.assertDid,
        collection: PROFILE_COLLECTION,
        rkey: recordKey,
        record,
        validate: false,
      })
      uri = putResult.data.uri
    } catch (err) {
      ctx.logger.warn({ err }, 'Failed to write profile record to AT Protocol')
      return NextResponse.json(
        { error: 'Failed to save profile' }, 
        { status: 500 }
      )
    }

    // Add/update in local profile store
    const profileData = {
      uri,
      authorDid: agent.assertDid,
      name: record.name,
      bio: record.bio,
      interests: record.interests,
      neighbourhood: record.neighbourhood,
      currentProject: record.currentProject,
      twitterUrl: record.twitterUrl,
      instagramUrl: record.instagramUrl,
      githubUrl: record.githubUrl,
      linkedinUrl: record.linkedinUrl,
      websiteUrl: record.websiteUrl,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }

    if (isUpdate) {
      await ctx.profileStore.update(agent.assertDid, profileData)
    } else {
      await ctx.profileStore.create(profileData)
    }

    return NextResponse.json({ 
      success: true, 
      uri,
      profile: profileData,
      isUpdate
    })

  } catch (error) {
    console.error('Error in profile API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 