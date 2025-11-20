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
    // const [ image, setImage ] = useState<File | undefined>(undefined);
    const [images, setImages] = useState<File[]>([]);
    const [ imageUrls, setImageUrls ] = useState<string[]>(profile?.image_urls ?? [] )

    async function handleImages(e: React.ChangeEvent<HTMLInputElement>){
        if (!e.target.files) return
        const files = Array.from(e.target.files)
        const options = {
            maxWidthOrHeight: 256,
            fileType: 'image/webp'
        }

        const newImages: File[] = []
        const newUrls: string[] = []
        for (const file of files) {
            try {
                const compressed = await imageCompression(file, options)
                newImages.push(compressed)
                newUrls.push(URL.createObjectURL(compressed))
            } catch (err){
                console.log(err)
            }
        }
        setImages(prev => [...prev, ...newImages])
        setImageUrls(prev => [...prev, ...newUrls])

    }


    function handleSave(){
        if (profile){
            profile.full_name = fullName
            profile.website = website  
            updateProfile(profile, images)
        }
    }

    // useEffect(()=>{
    //     profile.full_name = fullName
    //     profile.website = website
    //     updateProfile(profile, avatar)
    // },[website, fullName])

    // useEffect(()=>{
    //     if (images){
    //         const previewUrl = URL.createObjectURL(images)
    //         console.log(images)
    //         setImageUrls([...imageUrls, previewUrl])
        
    //         return () => URL.revokeObjectURL(previewUrl)
    //     }
        
    // },[images])
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
                        <Image
                        src={item}
                        width={500}
                        height={500}
                        alt={item}
                        loading={"lazy"}
                        />
                        
                    </ImageListItem>
                ))}
                </ImageList>

        </Box>
    )

}