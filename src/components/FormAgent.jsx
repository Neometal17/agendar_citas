import React, { useEffect, useMemo, useState } from 'react'
import {
  Container,
  Typography,
  TextField,
  Box,
  Stack,
  Button
} from '@mui/material'
import { useParams } from 'wouter'
import ResponsiveDatePicker from '../components/ResponsiveDatePicker'

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

export default function FormAgent() {
  const { typeAgent } = useParams()
  const [availabilityByDate, setAvailabilityByDate] = useState({})

  const [form, setForm] = useState({
    name: '',
    phone: '',
    direction: '',
    dateAgend: null
  })

  const handleChange = (field) => (event) => {
    setForm({
      ...form,
      [field]: event.target.value
    })
  }

  // 👇 Esto depende de cómo implementaste tu DatePicker
  const handleDateChange = (newDate) => {
    // console.log("Cambio Fecha")
    setForm({
      ...form,
      dateAgend: newDate ? newDate.format('YYYY-MM-DD') : null
    })
  }

  const startDate = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const endDate = useMemo(() => {
    const value = new Date()
    /**
     * EG: Ajuste del numero de dias a futuro disponible
     */
    value.setDate(value.getDate() + 30)
    return value.toISOString().slice(0, 10)
  }, [])

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/agend/admin/availability?start=${startDate}&end=${endDate}`
        )
        if (!response.ok) {
          return
        }
        const data = await response.json()
        const map = (data?.days ?? []).reduce((acc, item) => {
          acc[item.date] = item.capacity
          return acc
        }, {})
        setAvailabilityByDate(map)
      } catch (error) {
        console.error('Error loading availability', error)
      }
    }
    fetchAvailability()
  }, [startDate, endDate])

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert('Nombre requerido')
      return
    }

    if (!form.direction.trim()) {
      alert('Dirección requerida')
      return
    }

    if (!form.phone.trim()) {
      alert('Teléfono requerido')
      return
    }

    if (!form.dateAgend) {
      alert('Fecha requerida')
      return
    }

    const payload = {
      name: form.name,
      phone: form.phone,
      direction: form.direction,
      dateAgent: form.dateAgend,
      typeClient: typeAgent,
    }

    console.log('Enviando:', payload)

    try {
      const response = await fetch(`${API_BASE_URL}/api/agend/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Error en la petición')
      }

      const data = await response.json()
      console.log('Respuesta:', data)

      alert('La Agenda fue realizada')
    } catch (error) {
      console.error(error)
      alert('Error al enviar el formulario')
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 4,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        {/* Título */}
        <Typography variant="h5" textAlign="center" fontWeight="bold">
          Formulario - {typeAgent == 'limpiar' ? 'Limpieza de Muebles' : typeAgent}
        </Typography>

        {/* Inputs */}
        <Stack spacing={2}>
          <TextField
            label="Nombre"
            fullWidth
            value={form.name}
            onChange={handleChange('name')}
          />

          <TextField
            label="Número telefónico"
            fullWidth
            type="tel"
            value={form.phone}
            onChange={handleChange('phone')}
          />

          <TextField
            label="Dirección"
            fullWidth
            multiline
            rows={3}
            value={form.direction}
            onChange={handleChange('direction')}
          />
        </Stack>

        {/* Date Picker */}
        <Box>
          <ResponsiveDatePicker
            onChange={handleDateChange}
            availabilityByDate={availabilityByDate}
            minDate={startDate}
            maxDate={endDate}
          />
        </Box>

        {/* Botón */}
        <Button
          variant="contained"
          fullWidth
          sx={{ borderRadius: '20px', py: 1.5 }}
          onClick={handleSubmit}
        >
          Enviar
        </Button>
      </Box>
    </Container>
  )
}
