'use client'

import { login, signup } from './actions'
import { Box, Grid, Button, Typography } from '@mui/material'
// TextField, ListItem
export default function LoginPage() {
  return (
    <Box  display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh" 
    >
      <Grid display="inline-grid">
        <Typography align="center">Welcome</Typography>

        <form action={login}>
          <label htmlFor="email">Email:</label>
          <input id="email" name="email" type="email" required />

          <br />

          <label htmlFor="password">Password:</label>
          <input id="password" name="password" type="password" required />

          <br />

          <Box alignItems="center">
          <Button type="submit" variant="contained" size="small">
          Log in
          </Button>
          </Box>
        </form>

        <form action={signup}>
          <Box mt={2} alignItems="center">
            <Button type="submit" variant="contained" size="small">
              Sign up
            </Button>
          </Box>
        </form>

      </Grid>
    </Box>
  )
}