import { getDatabase, Profile, ProfileTable } from './database'

function transformDbToProfile(dbProfile: ProfileTable): Profile {
  return {
    uri: dbProfile.uri,
    authorDid: dbProfile.author_did,
    name: dbProfile.name,
    bio: dbProfile.bio,
    interests: JSON.parse(dbProfile.interests),
    neighbourhood: dbProfile.neighbourhood || undefined,
    currentProject: dbProfile.current_project,
    twitterUrl: dbProfile.twitter_url || undefined,
    instagramUrl: dbProfile.instagram_url || undefined,
    githubUrl: dbProfile.github_url || undefined,
    linkedinUrl: dbProfile.linkedin_url || undefined,
    websiteUrl: dbProfile.website_url || undefined,
    createdAt: dbProfile.created_at,
    updatedAt: dbProfile.updated_at || undefined,
  }
}

export type ProfileStore = {
  create: (profile: Profile) => Promise<void>
  update: (did: string, profile: Partial<Profile>) => Promise<void>
  findByDid: (did: string) => Promise<Profile | undefined>
  listAll: () => Promise<Profile[]>
  listByNeighbourhood: (neighbourhood: string) => Promise<Profile[]>
  searchByInterests: (interests: string[]) => Promise<Profile[]>
}

export function createProfileStore(): ProfileStore {
  return {
    async create(profile: Profile) {
      const db = getDatabase()
      await db
        .insertInto('profile')
        .values({
          uri: profile.uri,
          author_did: profile.authorDid,
          name: profile.name,
          bio: profile.bio,
          interests: JSON.stringify(profile.interests),
          neighbourhood: profile.neighbourhood || null,
          current_project: profile.currentProject,
          twitter_url: profile.twitterUrl || null,
          instagram_url: profile.instagramUrl || null,
          github_url: profile.githubUrl || null,
          linkedin_url: profile.linkedinUrl || null,
          website_url: profile.websiteUrl || null,
          created_at: profile.createdAt,
          updated_at: profile.updatedAt || null,
        })
        .execute()
    },

    async update(did: string, profileData: Partial<Profile>) {
      const db = getDatabase()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Dynamic object with varying database column types
      const updateData: any = {}
      
      if (profileData.name) updateData.name = profileData.name
      if (profileData.bio) updateData.bio = profileData.bio
      if (profileData.interests) updateData.interests = JSON.stringify(profileData.interests)
      if (profileData.neighbourhood !== undefined) updateData.neighbourhood = profileData.neighbourhood
      if (profileData.currentProject) updateData.current_project = profileData.currentProject
      if (profileData.twitterUrl !== undefined) updateData.twitter_url = profileData.twitterUrl
      if (profileData.instagramUrl !== undefined) updateData.instagram_url = profileData.instagramUrl
      if (profileData.githubUrl !== undefined) updateData.github_url = profileData.githubUrl
      if (profileData.linkedinUrl !== undefined) updateData.linkedin_url = profileData.linkedinUrl
      if (profileData.websiteUrl !== undefined) updateData.website_url = profileData.websiteUrl
      
      updateData.updated_at = new Date().toISOString()

      await db
        .updateTable('profile')
        .set(updateData)
        .where('author_did', '=', did)
        .execute()
    },

    async findByDid(did: string) {
      const db = getDatabase()
      const result = await db
        .selectFrom('profile')
        .selectAll()
        .where('author_did', '=', did)
        .orderBy('created_at', 'desc')
        .limit(1)
        .executeTakeFirst()
      
      if (!result) return undefined
      
      return {
        uri: result.uri,
        authorDid: result.author_did,
        name: result.name,
        bio: result.bio,
        interests: JSON.parse(result.interests),
        neighbourhood: result.neighbourhood || undefined,
        currentProject: result.current_project,
        twitterUrl: result.twitter_url || undefined,
        instagramUrl: result.instagram_url || undefined,
        githubUrl: result.github_url || undefined,
        linkedinUrl: result.linkedin_url || undefined,
        websiteUrl: result.website_url || undefined,
        createdAt: result.created_at,
        updatedAt: result.updated_at || undefined,
      }
    },

    async listAll() {
      const db = getDatabase()
      const results = await db
        .selectFrom('profile')
        .selectAll()
        .orderBy('created_at', 'desc')
        .execute()
      
      return results.map(transformDbToProfile)
    },

    async listByNeighbourhood(neighbourhood: string) {
      const db = getDatabase()
      const results = await db
        .selectFrom('profile')
        .selectAll()
        .where('neighbourhood', '=', neighbourhood)
        .orderBy('created_at', 'desc')
        .execute()
      
      return results.map(transformDbToProfile)
    },

    async searchByInterests(interests: string[]) {
      const db = getDatabase()
      const results = await db
        .selectFrom('profile')
        .selectAll()
        .where((eb) => {
          const conditions = interests.map(interest =>
            eb('interests', 'like', `%${interest}%`)
          )
          return eb.or(conditions)
        })
        .orderBy('created_at', 'desc')
        .execute()
      
      return results.map(transformDbToProfile)
    },
  }
} 