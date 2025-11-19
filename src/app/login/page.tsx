'use client'

import { login, signup } from './actions'
import { Box, Grid, Button, TextField, Typography, ListItem } from '@mui/material'

export default function LoginPage() {
  return (
    <Box  display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh" 
    >
      <Grid sx={{ display: 'inline-grid' }}>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <br/>
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        
        <br/>
        <Button variant="contained" onClick={() => { login }}>
          Log in
        </Button>
        <br/>
        <Button variant="contained" onClick={() => { signup }}>
          Sign up
        </Button>
      </Grid>
    </Box>
  )
}