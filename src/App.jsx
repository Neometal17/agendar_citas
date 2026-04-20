import { Container, Typography, Box, Button } from '@mui/material'
import ResponsiveDatePicker from './components/ResponsiveDatePicker.jsx'
import FormAgent from './components/FormAgent.jsx'
import ListAgent from './components/listAgent.tsx'
import { Router, Route, Switch, useLocation } from 'wouter'

export default function App() {
  const [, setLocation] = useLocation()

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
                  onClick={() => setLocation('/app/agendar/mayas')}
                >
                  Mallas
                </Button>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ borderRadius: "20px", py: 2 }}
                >
                  Limpieza de muebles
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ borderRadius: "20px", py: 2 }}
                  onClick={() => setLocation('/app/agentes')}
                >
                  Lista de agentes
                </Button>
              </Box>
            </Container>
          </Box>
        </Route>

        <Route path="/app/agentes">
          <ListAgent />
        </Route>

        <Route path="/app/agendar/:typeAgent">
                {(params) => <FormAgent />}
        </Route>

        <Route>
          <div>Aqui no hay nada</div>
        </Route>
      </Switch>
    </Router>
  )
}
