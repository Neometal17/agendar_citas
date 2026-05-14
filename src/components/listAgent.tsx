import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ResponsiveDatePicker from './ResponsiveDatePicker'
// import agents from '../data/agents.json'

type Agent = {
  _id: string
  code: string
  name: string
  phone: string
  direction: string
  status: string
  typeClient: string
  dateRegister: string
  dateAgent: string
  detail?: string
}

type Status = 'Pendiente' | 'Confirmado' | 'Cancelado' | 'Reagendado' | 'Culminado'
type AvailabilityDay = {
  date: string
  capacity: number
}

const statusColor: Record<string, 'success' | 'secondary' | 'primary' | 'default' | 'warning' | 'error' | 'info' > = {
  pendiente: 'warning',
  confirmado: 'primary',
  cancelado: 'error',
  reagendado: 'secondary',
  culminado: 'success',
}

const formatDate = (
  isoDate: string,
  timeZone: string = 'America/Lima'
) => {
  const date = new Date(isoDate)

  const formatter = new Intl.DateTimeFormat('es-PE', {
    timeZone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })

  // Esto devuelve algo como: "28/04/2026, 06:50 p. m."
  const parts = formatter.formatToParts(date)

  const get = (type: string) =>
    parts.find(p => p.type === type)?.value || ''

  const day = get('day')
  const month = get('month')
  const year = get('year')
  const hour = get('hour')
  const minute = get('minute')
  const dayPeriod = get('dayPeriod').toUpperCase().replace('.', '')

  return `${day}/${month}/${year} ${hour}:${minute} ${dayPeriod}`
}

const statusOptions: Status[] = ['Pendiente', 'Confirmado', 'Cancelado', 'Reagendado', 'Culminado']
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} textAlign="right">
        {value}
      </Typography>
    </Stack>
  )
}

export default function ListAgent() {
  // const [items, setItems] = useState<Agent[]>(agents as Agent[])
  const [items, setItems] = useState<Agent[]>([])
  const [activeFilter, setActiveFilter] = useState<'Todos' | Status>('Todos')
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [draftStatus, setDraftStatus] = useState<Status>('Pendiente')
  const [draftDetails, setDraftDetails] = useState('')
  const [draftDateAgent, setDraftDateAgent] = useState('')
  const [availabilityDays, setAvailabilityDays] = useState<AvailabilityDay[]>([])
  const [savingAvailability, setSavingAvailability] = useState(false)

  const startDate = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const endDate = useMemo(() => {
    const value = new Date()
    /**
     * EG: Ajuste del numero de dias a futuro disponible
     */
    value.setDate(value.getDate() + 30)
    return value.toISOString().slice(0, 10)
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agend/admin/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data: Agent[] = await response.json()
      setItems(data)
    } catch (err: any) {
      console.log(`ListAgente - ${err}`)
    }
  }

  useEffect(() => {
    fetchAgents()
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/agend/admin/availability?start=${startDate}&end=${endDate}`
      )
      if (!response.ok) {
        return
      }
      const data = await response.json()
      setAvailabilityDays(data.days ?? [])
    } catch (err: any) {
      console.log(`Error loading availability - ${err}`)
    }
  }

  const handleCapacityChange = (date: string, value: string) => {
    const parsed = Number(value)
    const capacity = Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0
    setAvailabilityDays((prev) =>
      prev.map((day) => (day.date === date ? { ...day, capacity } : day))
    )
  }

  const saveAvailability = async () => {
    try {
      setSavingAvailability(true)
      const response = await fetch(`${API_BASE_URL}/api/agend/admin/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          days: availabilityDays
        })
      })
      if (response.ok) {
        fetchAvailability()
      }
    } catch (err: any) {
      console.log(`Error saving availability - ${err}`)
    } finally {
      setSavingAvailability(false)
    }
  }

  const filteredItems = useMemo(() => {
    if (activeFilter === 'Todos') {
      return items
    }
    return items.filter((agent) => agent.status.toLowerCase() === activeFilter.toLowerCase())
  }, [items, activeFilter])

  const availabilityByDate = useMemo(() => {
    return availabilityDays.reduce((acc, day) => {
      acc[day.date] = day.capacity
      return acc
    }, {} as Record<string, number>)
  }, [availabilityDays])

  const openEditDialog = (agent: Agent) => {
    setSelectedCode(agent._id)
    setDraftStatus(agent.status as Status)
    setDraftDetails(agent.direction ?? '')
    setDraftDateAgent(agent.dateAgent)
    setDialogOpen(true)
  }

  const closeEditDialog = () => {
    setDialogOpen(false)
    setSelectedCode(null)
  }

  const handleDateChange = (newValue) => {
    setDraftDateAgent(newValue ? newValue.format('YYYY-MM-DD') : '')
  }

  const saveAgentChanges = async () => {
    if (!selectedCode) {
      return
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/agend/admin?code=${selectedCode}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: draftStatus,
          direction: draftDetails.trim(),
          dateAgent: draftDateAgent
        })
      })
      if (response.ok) {
        const updatedAgent = await response.json()
        setItems((prev) =>
          prev.map((agent) =>
            agent.code === selectedCode ? updatedAgent : agent
          )
        )
        closeEditDialog()
        fetchAgents()
      }
    } catch (err: any) {
      console.log(`Error updating agent - ${err}`)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Typography variant="h5" fontWeight={700} textAlign={{ xs: 'left', sm: 'center' }} mb={3}>
        Agent List
      </Typography>

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            gap={2}
            mb={2}
          >
            <Typography variant="h6" fontWeight={700}>
              Cupos por día (60 días)
            </Typography>
            <Button variant="contained" onClick={saveAvailability} disabled={savingAvailability}>
              {savingAvailability ? 'Guardando...' : 'Guardar cupos'}
            </Button>
          </Stack>
          <Grid container spacing={1.2}>
            {availabilityDays.map((day) => (
              <Grid item xs={6} sm={4} md={3} key={day.date}>
                <TextField
                  label={day.date}
                  type="number"
                  inputProps={{ min: 0 }}
                  value={day.capacity}
                  onChange={(event) => handleCapacityChange(day.date, event.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" mb={3}>
        <Chip
          label="Todos"
          clickable
          color={activeFilter === 'Todos' ? 'info' : 'default'}
          onClick={() => setActiveFilter('Todos')}
        />
        {statusOptions.map((status) => (
          <Chip
            key={status}
            label={status}
            clickable
            color={activeFilter === status ? statusColor[status.toLowerCase()] : 'default'}
            onClick={() => setActiveFilter(status)}
          />
        ))}
      </Stack>

      <Grid container spacing={2}>
        {filteredItems.map((agent) => (
          <Grid key={agent.code} item xs={12} sm={6} md={4}>
            <Card
              onClick={() => openEditDialog(agent)}
              sx={{ height: '100%', borderRadius: 3, cursor: 'pointer' }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {agent.name}
                  </Typography>
                  <Chip
                    size="small"
                    label={agent.status}
                    color={statusColor[agent.status.toLowerCase()] ?? 'error'}
                  />
                </Stack>

                <Box sx={{ display: 'grid', gap: 1.1 }}>
                  <InfoRow label="Código" value={agent.code} />
                  <InfoRow label="Teléfono" value={agent.phone} />
                  <InfoRow label="Dirección" value={agent.direction} />
                  <InfoRow label="Tipo Cliente" value={agent.typeClient} />
                  <InfoRow label="Fecha Registro" value={formatDate(agent.dateRegister)} />
                  <InfoRow label="Fecha Agenda" value={agent.dateAgent} />
                  {agent.detail ? <InfoRow label="Detalles" value={agent.detail} /> : null}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={closeEditDialog} fullWidth maxWidth="xs">
        <DialogTitle>Editar agente</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
          <TextField
            select
            label="Estado"
            value={draftStatus}
            onChange={(event) => setDraftStatus(event.target.value as Status)}
            fullWidth
          >
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <ResponsiveDatePicker
            onChange={handleDateChange}
            initialValue={draftDateAgent}
            availabilityByDate={availabilityByDate}
            minDate={startDate}
            maxDate={endDate}
          />
          <TextField
            label="Detalles"
            value={draftDetails}
            onChange={(event) => setDraftDetails(event.target.value)}
            multiline
            minRows={3}
            placeholder="Escribe una nota para este agente"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancelar</Button>
          <Button variant="contained" onClick={saveAgentChanges}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
