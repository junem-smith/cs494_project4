"use client"

import { createContext, useContext } from "react"
import { Profile } from "@/types/profile"

import { useRouter } from "next/navigation"

// data structure
type ProfileProps = {
    profile: Profile | null,
    updateProfile: (profile: Profile, images: File[]) => Promise<void>
    signOut: () => void
}

// create context
const ProfileContext = createContext<ProfileProps | null>(null)

// provider
export function ProfileProvider(props: {
    profile: Profile | null, children: React.ReactNode 
}) {
    const router = useRouter()

    async function updateProfile(profile: Profile, images: File[]) {

        let imageUrls: string[] | null = null

        if (images && images.length > 0){
            const formData = new FormData()
            formData.append("id", profile.id)

            images.forEach(img => formData.append("images", img))
            const res = await fetch("/api/image",
                {
                    method: "POST",
                    body: formData
                }
            )

            const data = await res.json()
            imageUrls = data.imageUrls
        }

        if (imageUrls){
            profile.image_urls = imageUrls
        }
        
        await fetch("/api/profile", {
            method: "PUT",
            body: JSON.stringify({profile: profile})
        })
        
    }

    async function signOut(){
        await fetch("/api/auth/signout")
        router.push("/login")
    }

    return (
        <ProfileContext.Provider value={{ profile: props.profile, updateProfile, signOut }}>
            {props.children}
        </ProfileContext.Provider>
    )
}

// use
export function useProfile(){
    const context = useContext(ProfileContext)
    if (!context){
        throw new Error("useProfile must be used within ProfileProvider")
    }
    return context
}
