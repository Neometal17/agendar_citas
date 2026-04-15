import React from 'react'
import { Container, Typography, Box, Button } from '@mui/material'
import ResponsiveDatePicker from './components/ResponsiveDatePicker.jsx'
import { Router, Route, Switch } from 'wouter'

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/app/agendar">
          <Container maxWidth="sm">
            <Box sx={{ mt: 5 }}>
              <Typography variant="h4" gutterBottom>
                Demo de Reservas
              </Typography>
              <ResponsiveDatePicker />
            </Box>
          </Container>
        </Route>

        <Route path="/app/inicio">
          <Box
            sx={{
              minHeight: "100vh",        // ocupa toda la pantalla
              display: "flex",
              justifyContent: "center", // centra horizontal
              alignItems: "center",     // centra vertical
            }}
          >
            <Container maxWidth="sm">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ borderRadius: "20px", py: 2 }}
                >
                  Mayas
                </Button>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ borderRadius: "20px", py: 2 }}
                >
                  Limpieza de muebles
                </Button>
              </Box>
            </Container>
          </Box>
        </Route>

        <Route>
          <div>Aqui no hay nada</div>
        </Route>
      </Switch>
    </Router>
  )
}
