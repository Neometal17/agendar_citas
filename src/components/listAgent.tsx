import { useMemo, useState } from 'react'
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
import agents from '../data/agents.json'

type Agent = {
  code: string
  name: string
  phone: string
  address: string
  status: string
  clientType: string
  dateTime: string
  dateAgent: string
  detail?: string
}

type Status = 'Pendiente' | 'Confirmado' | 'Cancelado' | 'Reagendado' | 'Culminado'

const statusColor: Record<string, 'success' | 'secondary' | 'primary' | 'default' | 'warning' | 'error' | 'info' > = {
  pendiente: 'warning',
  confirmado: 'primary',
  cancelado: 'error',
  reagendado: 'secondary',
  culminado: 'success',
}

const statusOptions: Status[] = ['Pendiente', 'Confirmado', 'Cancelado', 'Reagendado', 'Culminado']

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
  const [items, setItems] = useState<Agent[]>(agents as Agent[])
  const [activeFilter, setActiveFilter] = useState<'Todos' | Status>('Todos')
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [draftStatus, setDraftStatus] = useState<Status>('Pendiente')
  const [draftDetails, setDraftDetails] = useState('')

  const filteredItems = useMemo(() => {
    if (activeFilter === 'Todos') {
      return items
    }
    return items.filter((agent) => agent.status.toLowerCase() === activeFilter.toLowerCase())
  }, [items, activeFilter])

  const openEditDialog = (agent: Agent) => {
    setSelectedCode(agent.code)
    setDraftStatus(agent.status as Status)
    setDraftDetails(agent.detail ?? '')
    setDialogOpen(true)
  }

  const closeEditDialog = () => {
    setDialogOpen(false)
    setSelectedCode(null)
  }

  const saveAgentChanges = () => {
    if (!selectedCode) {
      return
    }
    setItems((prev) =>
      prev.map((agent) =>
        agent.code === selectedCode
          ? {
              ...agent,
              status: draftStatus,
              detail: draftDetails.trim(),
            }
          : agent,
      ),
    )
    closeEditDialog()
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Typography variant="h5" fontWeight={700} textAlign={{ xs: 'left', sm: 'center' }} mb={3}>
        Agent List
      </Typography>

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
                  <InfoRow label="Dirección" value={agent.address} />
                  <InfoRow label="Tipo Cliente" value={agent.clientType} />
                  <InfoRow label="Fecha Registro" value={agent.dateTime} />
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
