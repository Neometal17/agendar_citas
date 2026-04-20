import React, { useState } from 'react'
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

export default function FormAgent() {
  const { typeAgent } = useParams()

  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    fecha: null
  })

  const handleChange = (field) => (event) => {
    setForm({
      ...form,
      [field]: event.target.value
    })
  }

  // 👇 Esto depende de cómo implementaste tu DatePicker
  const handleDateChange = (newDate) => {
    setForm({
      ...form,
      fecha: newDate
    })
  }

  const handleSubmit = async () => {
    const payload = {
      ...form,
      tipoAgente: typeAgent
    }

    console.log('Enviando:', payload)

    try {
      const response = await fetch('http://localhost:8080/api/agendar', {
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

      alert('Formulario enviado correctamente')
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
          Formulario - {typeAgent}
        </Typography>

        {/* Inputs */}
        <Stack spacing={2}>
          <TextField
            label="Nombre"
            fullWidth
            value={form.nombre}
            onChange={handleChange('nombre')}
          />

          <TextField
            label="Número telefónico"
            fullWidth
            type="tel"
            value={form.telefono}
            onChange={handleChange('telefono')}
          />

          <TextField
            label="Dirección"
            fullWidth
            multiline
            rows={3}
            value={form.direccion}
            onChange={handleChange('direccion')}
          />
        </Stack>

        {/* Date Picker */}
        <Box>
          <ResponsiveDatePicker onChange={handleDateChange} />
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