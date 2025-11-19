'use client'

import { useProfile } from "@/contexts/profileContext";
import { Button, Box, ToggleButton } from "@mui/material";
import Image from "next/image";

export default function Home() {

  const { profile, signOut } = useProfile()

  return (
      <Box>
        {
          profile ? `Hello, ${profile.full_name}` : `Hello World`
        }
        <Button variant="contained" onClick={() => { signOut }}>Sign Out</Button>
        
      </Box>
  );
}
