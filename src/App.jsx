import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import ResponsiveDatePicker from './components/ResponsiveDatePicker.jsx'

export default function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Booking Demo
        </Typography>
        <ResponsiveDatePicker />
      </Box>
    </Container>
  )
}