import React, { useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

const bookedDates = [
  '2026-04-20',
  '2026-04-22',
]

export default function ResponsiveDatePicker() {
  const [value, setValue] = useState(null)

  const isBooked = (date) => {
    return bookedDates.includes(dayjs(date).format('YYYY-MM-DD'))
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Selecciona fecha"
        value={value}
        onChange={(newValue) => setValue(newValue)}
        shouldDisableDate={isBooked}
        disablePast
        slotProps={{
          textField: {
            fullWidth: true
          }
        }}
        sx={{
          width: '100%'
        }}
      />
    </LocalizationProvider>
  )
}
