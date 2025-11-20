import { createClient } from "@/utils/supabase/server";
import { Profile } from "@/types/profile";

export async function PUT(request: Request) {
    try {
        const data = await request.json()
        const profile = data.profile as Profile

        if (!profile){
            return Response.json({message: "No profile in body"}, { status: 400 })
        }

        const supabase = await createClient()

        const user = await supabase.auth.getUser()

        if(!user || !user.data.user){
            return Response.json({message: "Must be logged in"}, { status: 401 })
        }

        if (profile.id !== user.data.user.id){
            return Response.json({message: "Invalid user ID"}, { status: 403 })
        }

        const { error } = await supabase
            .from('profiles')
            .update(profile)
            .eq('id', profile.id)

        if (error){
            console.error(error)
            return Response.json({message: "Failed to update profile"}, { status: 500 })
        }
        return Response.json({message: "Success"}, { status: 200 })
    } catch (err) {
        console.error(err)
        return Response.json({ message: "Server error" }, { status: 500 })
    }

    
}