'use client'

import Image from 'next/image'

export default function LoginPage({ error }: { error?: string }) {


  function Header() {
    return (
      <div id="header">
        <div className="header-logo">
          <Image src="https://www.toronto.inc/logo.svg" alt="Toronto.inc" width={200} height={50} />
        </div>

        <p className="header-intro">&quot;DISCOVER&quot; c/o TORONTO™</p>
        <p>A DIRECTORY OF CREATORS, BUILDERS AND INNOVATORS IN TORONTO</p>

      </div>
    )
  }
  return (
    <div id="root">
      <Header />
      <div className="container">
        <form action="/api/login" method="post" className="login-form">
          <input
            type="text"
            name="handle"
            placeholder="Enter your handle (e.g. alice.bsky.social)"
            required
          />
          <button type="submit">Sign in</button>
        </form>
        {error ? (
          <div style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '14px' }}>
            Error: {error}
          </div>
        ) : null}
        <div className="signup-cta">
          Don&apos;t have an account?{' '}
          <a href="https://bsky.app">Join Bluesky</a> to create one.
        </div>
      </div>
    </div>
  )
}
