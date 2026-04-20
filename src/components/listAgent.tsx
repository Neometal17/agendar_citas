import { Box, Card, CardContent, Chip, Container, Grid, Stack, Typography } from '@mui/material'
import agents from '../data/agents.json'

type Agent = {
  code: string
  name: string
  phone: string
  address: string
  status: string
  clientType: string
}

const statusColor: Record<string, 'success' | 'default' | 'warning' | 'error'> = {
  active: 'success',
  inactive: 'default',
  pending: 'warning',
}

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
  const items = agents as Agent[]

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Typography variant="h5" fontWeight={700} textAlign={{ xs: 'left', sm: 'center' }} mb={3}>
        Agent List
      </Typography>

      <Grid container spacing={2}>
        {items.map((agent) => (
          <Grid key={agent.code} item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
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
                  <InfoRow label="Code" value={agent.code} />
                  <InfoRow label="Phone" value={agent.phone} />
                  <InfoRow label="Address" value={agent.address} />
                  <InfoRow label="Client Type" value={agent.clientType} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
