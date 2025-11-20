
import { createClient } from "@/utils/supabase/server";
import { put, list, del } from "@vercel/blob"


/** TODO: Instead of avatar, return photos */

export async function POST(request: Request){
    const supabase = await createClient()

    const user = await supabase.auth.getUser()

    if(!user || !user.data.user){
        return Response.json({message: "Must be logged in"})
    }

    
    const formData = await request.formData()

    // Get images array
    const images = formData.getAll('images') as Blob[]
    const id = formData.get("id")

    if (id !== user.data.user.id){
        return Response.json({message: "Invalid user ID"})
    }
    
    const userFolder = `${user.data.user.id}/`

    // Delete preexisting files
    const existingFiles = await list({ prefix: userFolder })
    for (const file of existingFiles.blobs){
        await del(file.pathname)
    }

    console.log(existingFiles)


    // Upload images
    const uploadedUrls: string[] = [];

    for (let i = 0; i < images.length; i++){
        const filename = `${userFolder}/image_${Date.now()}_${i}.webp`;
        const { url } = await put(filename, images[i], {
            access: "public",
            allowOverwrite: true
        });

        uploadedUrls.push(url);
    }

    
    return Response.json({ imageUrls: uploadedUrls })

}