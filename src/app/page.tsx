'use client'

import { useProfile } from "@/contexts/profileContext";
import { Button, Box, ToggleButton, Typography } from "@mui/material";
import ImageGallery from "@/components/imageGallery"; 


export default function Home() {

  const { profile, signOut } = useProfile()

  return (
      <Box>
        <Typography>
          {
          profile ? `Hello, ${profile.full_name}` : `Hello World`
        }
        </Typography>
        <br/>
        <Button variant="contained" onClick={signOut}>Sign Out</Button>
        <ImageGallery />
      </Box>
  );
}
