'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface TorontoProfile {
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

interface ProfileEditorProps {
  profile?: TorontoProfile
  isOpen: boolean
  onClose: () => void
}

export default function ProfileEditor({ profile, isOpen, onClose }: ProfileEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    interests: profile?.interests?.join(', ') || '',
    neighbourhood: profile?.neighbourhood || '',
    currentProject: profile?.currentProject || '',
    twitterUrl: profile?.twitterUrl || '',
    instagramUrl: profile?.instagramUrl || '',
    githubUrl: profile?.githubUrl || '',
    linkedinUrl: profile?.linkedinUrl || '',
    websiteUrl: profile?.websiteUrl || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value)
      })

      const response = await fetch('/api/profile', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        onClose()
        // Give the server a moment to process the update
        setTimeout(() => {
          router.refresh()
        }, 100)
      } else {
        const error = await response.json()
        console.error('Failed to save profile:', error.error)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="card">
          <div className="modal-header">
            <h2>{profile ? 'Edit' : 'Create'} Your Toronto Profile</h2>
            <button type="button" className="close-button" onClick={onClose}>×</button>
          </div>
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Name or Online Alias *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="What do you go by?"
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Short Bio *</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Give us your one-liner. Who are you, what do you make, or what are you about?"
                required
                maxLength={300}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="interests">Interests *</label>
              <input
                type="text"
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="photography, climate tech, zines, experimental film"
                required
              />
              <small>Separate with commas</small>
            </div>

            <div className="form-group">
              <label htmlFor="neighbourhood">Neighbourhood</label>
              <input
                type="text"
                id="neighbourhood"
                name="neighbourhood"
                value={formData.neighbourhood}
                onChange={handleChange}
                placeholder="Parkdale, Scarborough, Downtown..."
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="currentProject">What I&apos;m Working On *</label>
              <textarea
                id="currentProject"
                name="currentProject"
                value={formData.currentProject}
                onChange={handleChange}
                placeholder="A short blurb about a project you&apos;re currently working on or something you&apos;re exploring"
                required
                maxLength={500}
                rows={4}
              />
            </div>

            <div className="form-section">
              <h3>Links</h3>
              
              <div className="form-group">
                <label htmlFor="twitterUrl">Twitter</label>
                <input
                  type="url"
                  id="twitterUrl"
                  name="twitterUrl"
                  value={formData.twitterUrl}
                  onChange={handleChange}
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="instagramUrl">Instagram</label>
                <input
                  type="url"
                  id="instagramUrl"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="githubUrl">GitHub</label>
                <input
                  type="url"
                  id="githubUrl"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="linkedinUrl">LinkedIn</label>
                <input
                  type="url"
                  id="linkedinUrl"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="websiteUrl">Personal Website</label>
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose}>Cancel</button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.6 : 1 }}
              >
                {isSubmitting ? 'Saving...' : (profile ? 'Update Profile' : 'Create Profile')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 