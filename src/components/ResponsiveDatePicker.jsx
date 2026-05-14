import React, { useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { PickersDay } from '@mui/x-date-pickers/PickersDay'
import { esES } from '@mui/x-date-pickers/locales'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

const isSameDay = (dateA, dateB) => dayjs(dateA).isSame(dayjs(dateB), 'day')

export default function ResponsiveDatePicker({
  onChange,
  initialValue,
  availabilityByDate,
  minDate,
  maxDate,
}) {
  const [value, setValue] = useState(initialValue ? dayjs(initialValue) : null)

  const isBooked = (date) => {
    if (!availabilityByDate) {
      return false
    }
    const key = dayjs(date).format('YYYY-MM-DD')
    return (availabilityByDate[key] ?? 0) <= 0
  }

  const handleInternalChange = (newValue) => {
    setValue(newValue)
    if(onChange){
      onChange(newValue)
    }
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="es"
      localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <DatePicker
        label="Selecciona fecha"
        value={value}
        onChange={handleInternalChange}
        shouldDisableDate={isBooked}
        disablePast
        minDate={minDate ? dayjs(minDate) : undefined}
        maxDate={maxDate ? dayjs(maxDate) : undefined}
        slots={{
          day: (props) => {
            const booked = isBooked(props.day)
            const past = dayjs(props.day).isBefore(dayjs(), 'day')
            const selected = value ? isSameDay(props.day, value) : false

            return (
              <PickersDay
                {...props}
                sx={{
                  ...(past
                    ? {
                        backgroundColor: 'rgba(21, 101, 192, 0.16)',
                        color: '#0d47a1',
                        '&.Mui-disabled': {
                          color: '#0d47a1',
                          opacity: 1,
                        },
                      }
                    : booked
                    ? {
                        backgroundColor: 'rgba(211, 47, 47, 0.16)',
                        color: '#b71c1c',
                        '&.Mui-disabled': {
                          color: '#b71c1c',
                          opacity: 1,
                        },
                      }
                    : {
                        backgroundColor: 'rgba(46, 125, 50, 0.16)',
                        color: '#1b5e20',
                      }),
                  ...(selected
                    ? {
                        backgroundColor: past ? '#1565c0' : booked ? '#d32f2f' : '#2e7d32',
                        color: '#fff',
                        '&:hover, &:focus': {
                          backgroundColor: past ? '#0d47a1' : booked ? '#b71c1c' : '#1b5e20',
                        },
                      }
                    : {}),
                }}
              />
            )
          },
        }}
        slotProps={{
          textField: {
            fullWidth: true,
          },
        }}
        sx={{
          width: '100%',
        }}
      />
    </LocalizationProvider>
  )
}
