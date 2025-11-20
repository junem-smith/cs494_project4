"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Profile } from "@/types/profile"
import { useRouter } from "next/navigation"

type ProfileProps = {
  profile: Profile | undefined
  updateProfile: (profile: Profile, images: File[]) => Promise<void>
  signOut: () => void
}

const ProfileContext = createContext<ProfileProps | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | undefined>(undefined)

  // 🔥 Load user on first mount (client-only)
  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/profile")
      if (!res.ok) {
        setProfile(undefined)
        return
      }
      const { profile } = await res.json()
      setProfile(profile)
    })()
  }, [])

  async function updateProfile(updated: Profile, images: File[]) {
    let imageUrls: string[] | null = null

    if (images.length > 0) {
      const formData = new FormData()
      formData.append("id", updated.id)
      images.forEach((img) => formData.append("images", img))

      const res = await fetch("/api/image", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      imageUrls = data.imageUrls
    }

    const newProfile = { ...updated }
    if (imageUrls) newProfile.image_urls = imageUrls

    await fetch("/api/profile", {
      method: "PUT",
      body: JSON.stringify({ profile: newProfile }),
    })

    // 🔥 update local state so UI re-renders!
    setProfile(newProfile)
  }

  async function signOut() {
    await fetch("/api/auth/signout")
    setProfile(undefined)
    router.push("/login")
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, signOut }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context)
    throw new Error("useProfile must be used within ProfileProvider")
  return context
}