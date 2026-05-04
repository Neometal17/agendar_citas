import { useMemo, useState } from 'react'
import { Alert, AppBar, Box, Button, Container, IconButton, Stack, TextField, Toolbar, Typography } from '@mui/material'
import ResponsiveDatePicker from './components/ResponsiveDatePicker.jsx'
import FormAgent from './components/FormAgent.jsx'
import ListAgent from './components/listAgent.tsx'
import { Router, Route, Switch, useLocation } from 'wouter'

const SESSION_KEY = 'agendar_citas_admin_session'
const ADMIN_USER = import.meta.env.VITE_ADMIN_USER ?? ''
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? ''

function LoginAdmin() {
  const [, setLocation] = useLocation()
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const hasCredentials = useMemo(() => Boolean(ADMIN_USER && ADMIN_PASSWORD), [])

  const onSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!hasCredentials) {
      setError('Faltan variables VITE_ADMIN_USER y VITE_ADMIN_PASSWORD')
      return
    }

    if (user === ADMIN_USER && password === ADMIN_PASSWORD) {
      localStorage.setItem(SESSION_KEY, 'true')
      setLocation('/app/agentes')
      return
    }

    setError('Usuario o contraseña incorrectos')
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
          <Typography variant="h5" fontWeight={700} textAlign="center">
            Login Administrador
          </Typography>
          <TextField
            label="Usuario"
            value={user}
            onChange={(event) => setUser(event.target.value)}
            fullWidth
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            fullWidth
          />
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Button type="submit" variant="contained" fullWidth>
            Ingresar
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

function AppRoutes() {
  const [, setLocation] = useLocation()
  const isLoggedIn = localStorage.getItem(SESSION_KEY) === 'true'

  return (
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
          <Box sx={{ minHeight: '100vh' }}>
            <AppBar position="static" color="transparent" elevation={0}>
              <Toolbar sx={{ justifyContent: 'flex-start' }}>
                <IconButton
                  aria-label="Ir a login"
                  onClick={() => setLocation('/app/login')}
                  edge="start"
                >
                  <span role="img" aria-hidden="true">🔐</span>
                </IconButton>
              </Toolbar>
            </AppBar>
            <Box
              sx={{
                minHeight: 'calc(100vh - 64px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
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
                  onClick={() => setLocation('/app/agendar/limpiar')}
                >
                  Limpieza de muebles
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ borderRadius: "20px", py: 2 }}
                  onClick={() => setLocation('/app/login')}
                >
                  Lista de agentes
                </Button>
              </Box>
            </Container>
            </Box>
          </Box>
        </Route>

        <Route path="/app/login">
          <LoginAdmin />
        </Route>

        <Route path="/app/agentes">
          {isLoggedIn ? <ListAgent /> : <LoginAdmin />}
        </Route>

        <Route path="/app/agendar/:typeAgent">
                {(params) => <FormAgent />}
        </Route>

        <Route>
          <div>Aqui no hay nada</div>
        </Route>
      </Switch>
  )
}
