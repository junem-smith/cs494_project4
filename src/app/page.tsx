'use client'

import { useProfile } from "@/contexts/profileContext"
import { Box, Button, TextField, ImageList, ImageListItem, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import Image from "next/image"

import imageCompression from "browser-image-compression"

export default function Home(){
    const { profile, updateProfile, signOut } = useProfile()


    const [fullName, setFullName] = useState<string>(profile ? profile.full_name ?? "" : "")
    const [ website, setWebsite ] = useState<string>(profile ? profile.website ?? "" : "")
    const [images, setImages] = useState<File[]>([]);
    const [ imageUrls, setImageUrls ] = useState<string[]>(profile?.image_urls ?? [] )
    // track locally-created object URLs so we can revoke them
    const [ localBlobUrls, setLocalBlobUrls ] = useState<string[]>([])

    // sync form state when profile loads/changes
    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name ?? "")
            setWebsite(profile.website ?? "")
            setImageUrls(profile.image_urls ?? [])
        }
    }, [profile])

    async function handleImages(e: React.ChangeEvent<HTMLInputElement>){
        if (!e.target.files) return
        const files = Array.from(e.target.files)
        const options = {
            maxWidthOrHeight: 256,
            fileType: 'image/webp'
        }

        const newImages: File[] = []
        const newUrls: string[] = []
        const newLocalUrls: string[] = []
        for (const file of files) {
            try {
                const compressed = await imageCompression(file, options)
                newImages.push(compressed)
                const objUrl = URL.createObjectURL(compressed)
                newUrls.push(objUrl)
                newLocalUrls.push(objUrl)
            } catch (err){
                console.log(err)
            }
        }
        setImages(prev => [...prev, ...newImages])
        setImageUrls(prev => [...prev, ...newUrls])
        setLocalBlobUrls(prev => [...prev, ...newLocalUrls])

    }


    function handleSave(){
        if (profile){
            profile.full_name = fullName
            profile.website = website  
            updateProfile(profile, images)
                .then(() => {
                    // clear local blobs after successful upload
                    localBlobUrls.forEach(url => URL.revokeObjectURL(url))
                    setLocalBlobUrls([])
                    setImages([])
                })
                .catch(err => console.error('Update failed', err))
        }
    }

    // revoke any local object URLs when component unmounts
    useEffect(() => {
        return () => {
            localBlobUrls.forEach(url => {
                try { URL.revokeObjectURL(url) } catch {}
            })
        }
    }, [localBlobUrls])

    
    if (!profile) return <></>

    return (
        <Box sx={{ display: "grid", gap: 2, maxWidth: 300}}>
            <Box>
                <Typography>
                    {
                    profile ? `Hello, ${profile.username}` : `Hello World`
                    }
                </Typography>
                <br/>
                <Button variant="contained" onClick={signOut}>Sign Out</Button> 
            </Box>

            <TextField
                id="Upload Images"
                value={"Upload Images"}
                label={"Upload Images"}
                slotProps={{
                    input: {readOnly: true}
                }}
            />

            <Button variant="contained" component="label">
                Choose Images
                <input type="file" hidden multiple accept="image/*" onChange={handleImages} />
            </Button>

            <Button onClick={handleSave} variant="contained">
                Upload Images
            </Button>

            <ImageList sx={{ width: 500, height: 450 }} variant="woven" cols={3} gap={8}>
                {imageUrls.map((item) => (
                    <ImageListItem key={item}>
                        <Image src={item} width={500} height={500} alt="" unoptimized />
                        
                    </ImageListItem>
                ))}
                </ImageList>

        </Box>
    )

}
