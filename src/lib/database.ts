import { Kysely, PostgresDialect, SqliteDialect, ColumnType } from 'kysely'
import { Pool } from 'pg'
import Database from 'better-sqlite3'

// Database schema interface
export interface DatabaseSchema {
  sessions: SessionTable
  statuses: StatusTable
  profile: ProfileTable
}

export interface SessionTable {
  id: string
  data: string
  expires_at: ColumnType<Date | null, string | null, string | null>
}

export interface StatusTable {
  uri: string
  author_did: string
  status: string
  created_at: string
  indexed_at: string
}

export interface ProfileTable {
  uri: string
  author_did: string
  name: string
  bio: string
  interests: string // JSON string array
  neighbourhood: string | null
  current_project: string
  twitter_url: string | null
  instagram_url: string | null
  github_url: string | null
  linkedin_url: string | null
  website_url: string | null
  created_at: string
  updated_at: string | null
}

export interface Profile {
  uri: string
  authorDid: string
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

// Create Kysely database instance
export function createDatabase(): Kysely<DatabaseSchema> {
  const dbUrl = process.env.DATABASE_URL || 'file:./dev.db'

  if (dbUrl.startsWith('postgres')) {
    // PostgreSQL dialect with SSL support
    const dialect = new PostgresDialect({
      pool: new Pool({ 
        connectionString: dbUrl,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      })
    })
    return new Kysely<DatabaseSchema>({ dialect })
  } else {
    // SQLite dialect
    const dialect = new SqliteDialect({
      database: new Database(dbUrl.replace('file:', ''))
    })
    return new Kysely<DatabaseSchema>({ dialect })
  }
}

// Initialize database and create tables
export async function initializeDatabase(db: Kysely<DatabaseSchema>) {
  try {
    // Create sessions table
    await db.schema
      .createTable('sessions')
      .ifNotExists()
      .addColumn('id', 'text', (col) => col.primaryKey())
      .addColumn('data', 'text', (col) => col.notNull())
      .addColumn('expires_at', 'timestamp')
      .execute()

    // Create statuses table
    await db.schema
      .createTable('statuses')
      .ifNotExists()
      .addColumn('uri', 'text', (col) => col.primaryKey())
      .addColumn('author_did', 'text', (col) => col.notNull())
      .addColumn('status', 'text', (col) => col.notNull())
      .addColumn('created_at', 'text', (col) => col.notNull())
      .addColumn('indexed_at', 'text', (col) => col.notNull())
      .execute()

    // Create index on author_did for faster lookups
    await db.schema
      .createIndex('idx_statuses_author_did')
      .ifNotExists()
      .on('statuses')
      .column('author_did')
      .execute()

    // Create index on indexed_at for faster sorting
    await db.schema
      .createIndex('idx_statuses_indexed_at')
      .ifNotExists()
      .on('statuses')
      .column('indexed_at')
      .execute()

    // Create profile table
    await db.schema
      .createTable('profile')
      .ifNotExists()
      .addColumn('uri', 'text', (col) => col.primaryKey())
      .addColumn('author_did', 'text', (col) => col.notNull())
      .addColumn('name', 'text', (col) => col.notNull())
      .addColumn('bio', 'text', (col) => col.notNull())
      .addColumn('interests', 'text', (col) => col.notNull())
      .addColumn('neighbourhood', 'text')
      .addColumn('current_project', 'text', (col) => col.notNull())
      .addColumn('twitter_url', 'text')
      .addColumn('instagram_url', 'text')
      .addColumn('github_url', 'text')
      .addColumn('linkedin_url', 'text')
      .addColumn('website_url', 'text')
      .addColumn('created_at', 'text', (col) => col.notNull())
      .addColumn('updated_at', 'text')
      .execute()

    // Create index on author_did for faster profile lookups
    await db.schema
      .createIndex('idx_profile_author_did')
      .ifNotExists()
      .on('profile')
      .column('author_did')
      .execute()

  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}

// Global database instance
let dbInstance: Kysely<DatabaseSchema> | null = null

export function getDatabase(): Kysely<DatabaseSchema> {
  if (!dbInstance) {
    dbInstance = createDatabase()
  }
  return dbInstance
} 