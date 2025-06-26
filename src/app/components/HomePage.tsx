'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ProfileEditor, { type TorontoProfile } from './ProfileEditor'
import Image from 'next/image'

interface HomePageProps {
  profiles: TorontoProfile[]
  didHandleMap: Record<string, string>
  currentUserProfile?: TorontoProfile
  currentUserDid?: string
  isLoggedIn: boolean
}

export default function HomePage({
  profiles,
  didHandleMap,
  currentUserProfile,
  currentUserDid,
  isLoggedIn,
}: HomePageProps) {
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false)

  return (
    <div id="root">
      <Header />
      
      <div className="container">
        {isLoggedIn ? (
          <UserSection 
            profile={currentUserProfile}
            onEditProfile={() => setIsProfileEditorOpen(true)}
          />
        ) : (
          <LoginPrompt />
        )}
        
        <ProfilesGrid 
          profiles={profiles}
          didHandleMap={didHandleMap}
          currentUserDid={currentUserDid}
        />
      </div>
      
      <ProfileEditor
        profile={currentUserProfile}
        isOpen={isProfileEditorOpen}
        onClose={() => setIsProfileEditorOpen(false)}
      />
    </div>
  )
}

function Header() {
  return (
    <div id="header">
      <div className="header-logo">
        <Image src="https://www.toronto.inc/logo.svg" alt="Toronto.inc" width={200} height={50} />
      </div>
      
      <p className="header-intro">&quot;DISCOVER&quot; c/o TORONTO™</p>
      
      <p>
      <ol className="header-list">
        <li>A directory of creators, builders and innovators in Toronto</li>
        <li>Connect with collaborators working at the intersection of art, design & tech</li>
      </ol>
      </p>
      
      <p className="header-description">
        We&apos;re bringing together the next generation of Toronto&apos;s creative community - designers,
        developers, artists and entrepreneurs.
      </p>
      
      <p className="header-cta">
        &quot;CREATE YOUR PROFILE&quot; - THE FUTURE IS WAITING.
      </p>
    </div>
  )
}

function UserSection({ 
  profile,
  onEditProfile
}: { 
  profile?: TorontoProfile
  onEditProfile: () => void
}) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="card user-section">
      <div className="user-actions">
        <div className="user-info">
          {profile ? (
            <div>
              <h3>Welcome back, {profile.name}!</h3>
            </div>
          ) : (
            <div>
              <h3>Create your Toronto profile</h3>
              <p><p>A NETWORK OF VISIONARIES, MAKERS & CULTURAL ARCHITECTS. JOIN THE MOVEMENT.</p></p>
            </div>
          )}
        </div>
        <div className="action-buttons">
          <button onClick={onEditProfile}>
            {profile ? 'Edit Profile' : 'Create Profile'}
          </button>
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="secondary"
          >
            {isLoggingOut ? 'Logging out...' : 'Log out'}
          </button>
        </div>
      </div>
    </div>
  )
}

function LoginPrompt() {
  return (
    <div className="card login-prompt">
      <div className="prompt-content">
        <p>A NETWORK OF VISIONARIES, MAKERS & CULTURAL ARCHITECTS. JOIN THE MOVEMENT.</p>
        <a href="/login" className="button">Sign in to create your profile</a>
      </div>
    </div>
  )
}

function ProfilesGrid({ 
  profiles, 
  didHandleMap, 
  currentUserDid 
}: { 
  profiles: TorontoProfile[]
  didHandleMap: Record<string, string>
  currentUserDid?: string
}) {
  if (profiles.length === 0) {
    return (
      <div className="empty-state">
        <h3>No profiles yet</h3>
        <p>Be the first to create a Toronto profile!</p>
      </div>
    )
  }

  return (
    <div className="profiles-section">
      <h2>Directory:</h2>
      <div className="profiles-grid">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.uri}
            profile={profile}
            handle={didHandleMap[profile.authorDid] || profile.authorDid}
            isCurrentUser={currentUserDid === profile.authorDid}
          />
        ))}
      </div>
    </div>
  )
}

function ProfileCard({ 
  profile, 
  handle, 
  isCurrentUser 
}: { 
  profile: TorontoProfile
  handle: string
  isCurrentUser: boolean
}) {
  return (
    <div className={`profile-card ${isCurrentUser ? 'current-user' : ''}`}>
      <div className="profile-header">
        <h3>{profile.name}</h3>
        {profile.neighbourhood && (
          <span className="neighbourhood">{profile.neighbourhood}</span>
        )}
        {isCurrentUser && <span className="you-badge">You</span>}
      </div>
      
      <p className="bio">{profile.bio}</p>
      
      <div className="current-project">
        <strong>Currently working on:</strong>
        <p>{profile.currentProject}</p>
      </div>
      
      <div className="interests">
        {profile.interests.slice(0, 5).map((interest, i) => (
          <span key={i} className="interest-tag">{interest}</span>
        ))}
        {profile.interests.length > 5 && (
          <span className="interest-tag more">+{profile.interests.length - 5} more</span>
        )}
      </div>
      
      <div className="profile-links">
        {profile.websiteUrl && (
          <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer">
            Website
          </a>
        )}
        {profile.githubUrl && (
          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        )}
        {profile.twitterUrl && (
          <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        )}
        {profile.linkedinUrl && (
          <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        )}
        <a href={`https://bsky.app/profile/${handle}`} target="_blank" rel="noopener noreferrer">
          @{handle}
        </a>
      </div>
    </div>
  )
}
