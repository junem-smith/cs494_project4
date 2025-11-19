'use client'

import { login, signup } from './actions'
import { Box, Grid, Button, Typography, Card, CardContent, Stack, TextField } from '@mui/material'
// TextField, ListItem
export default function LoginPage() {
  return (
    <Box  display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          bgcolor="#c0fdffff"
          padding={2}
    >
      <Card sx={{ width: 350, padding: 2, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center"> Welcome </Typography>
          

          <form action={login}>
             <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  required
                />
             </Stack>
            <br/>
            <Button type="submit" variant="contained" fullWidth>
              Log in
            </Button>
          
            <Button
              variant="outlined"
              type="submit"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Sign up
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}