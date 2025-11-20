
import { createClient } from "@/utils/supabase/server";
import { put, list, del } from "@vercel/blob"


/** TODO: Instead of avatar, return photos */

export async function POST(request: Request){
    try {
        const supabase = await createClient()

        const user = await supabase.auth.getUser()

        if(!user || !user.data.user){
            return Response.json({message: "Must be logged in"}, { status: 401 })
        }

        const formData = await request.formData()

        // Get images array
        const images = formData.getAll('images') as Blob[]
        const id = String(formData.get("id") ?? "")

        if (id !== user.data.user.id){
            return Response.json({message: "Invalid user ID"}, { status: 403 })
        }
        
        const userFolder = `${user.data.user.id}`

        // Delete preexisting files (if any)
        const existingFiles = await list({ prefix: `${userFolder}/` })
        for (const file of existingFiles?.blobs ?? []){
            await del(file.pathname)
        }

        // Upload images
        const uploadedUrls: string[] = [];

        for (let i = 0; i < images.length; i++){
            const filename = `${userFolder}/image_${Date.now()}_${i}.webp`;
            const blob = images[i]

            const { url } = await put(filename, blob, {
                access: "public",
                allowOverwrite: true,
                contentType: "image/webp"
            });

            uploadedUrls.push(url);
        }

        return Response.json({ imageUrls: uploadedUrls }, { status: 200 })
    } catch (err) {
        console.error(err)
        return Response.json({ message: "Upload failed" }, { status: 500 })
    }

}