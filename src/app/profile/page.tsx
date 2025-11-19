'use client'

import { useProfile } from "@/contexts/profileContext"
import { Avatar, Box, Button, TextField, ImageList, ImageListItem } from "@mui/material"
import { useState, useEffect } from "react"
import Image from "next/image"

import imageCompression from "browser-image-compression"

export default function Home(){
    const { profile, updateProfile } = useProfile()


    const [fullName, setFullName] = useState<string>(profile ? profile.full_name ?? "" : "")
    const [ website, setWebsite ] = useState<string>(profile ? profile.website ?? "" : "")
    const [ image, setImage ] = useState<File | undefined>(undefined);
    const [ imageUrls, setImageUrls ] = useState<string[]>(profile?.image_urls ?? [] )

    async function handleImages(e: React.ChangeEvent<HTMLInputElement>){
        const file = e.target.files?.[0]
        if (!file) return

        const options = {
            maxWidthOrHeight: 256,
            fileType: 'image/webp'
        }

        const controller = new AbortController();

        imageCompression(file, options)
            .then((compressedFile)=>setImage(compressedFile))
            .catch((error)=>console.log(error))
        
        setTimeout(function () {
        controller.abort(new Error('Abort Compression'));
        }, 1500);

    }

    function handleSave(){
        if (profile){
            profile.full_name = fullName
            profile.website = website  
            updateProfile(profile, image)
        }
    }

    // useEffect(()=>{
    //     profile.full_name = fullName
    //     profile.website = website
    //     updateProfile(profile, avatar)
    // },[website, fullName])

    useEffect(()=>{
        if (image){
            const previewUrl = URL.createObjectURL(image)
            console.log(image)
            setImageUrls([...imageUrls, previewUrl])
        
            return () => URL.revokeObjectURL(previewUrl)
        }
        
    },[image])

    if (!profile) return <></>

    return (
        <Box sx={{ display: "grid", gap: 2, maxWidth: 300}}>

            <TextField
                id="Upload Images"
                value={"Upload Images"}
                label={"Upload Images"}
                slotProps={{
                    input: {readOnly: true}
                }}
            />
            <Button variant="contained" component="label">
                {image ? image.name : "Choose Images"}
                <input type="file" hidden accept="image/*" onChange={handleImages} />
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
                        />
                        {/* <img
                            srcSet={`${item}?w=161&fit=crop&auto=format&dpr=2 2x`}
                            src={`${item}?w=161&fit=crop&auto=format`}
                            alt={item}
                            loading="lazy"
                        /> */}
                    </ImageListItem>
                ))}
                </ImageList>




            {/* <Avatar src={imageUrls[0]} sx={{ width: 100, height: 100 }}/>
            <Button variant="contained" component="label">
                {image ? image.name : "Upload Image"}
                <input type="file" hidden accept="image/*" onChange={handleImages} />
            </Button>
            <TextField
                id="email"
                defaultValue={profile.username ?? ""}
                label={"Email"}
                slotProps={{
                    input: {readOnly: true}
                }}
            />
            <TextField
                id="full name"
                defaultValue={fullName}
                label="Full Name"
                onChange={e => setFullName(e.target.value)}
                
            />
            <TextField
                id="website"
                defaultValue={website}
                label="Website"
                onChange={e => setWebsite(e.target.value)}
            />
            <Button onClick={handleSave} variant="contained">
                Save Profile
            </Button> */}

        </Box>
    )

}