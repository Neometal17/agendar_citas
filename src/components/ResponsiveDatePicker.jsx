import React, { useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { PickersDay } from '@mui/x-date-pickers/PickersDay'
import { esES } from '@mui/x-date-pickers/locales'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

const bookedDates = ['2026-04-20', '2026-04-22']

const isSameDay = (dateA, dateB) => dayjs(dateA).isSame(dayjs(dateB), 'day')

export default function ResponsiveDatePicker() {
  const [value, setValue] = useState(null)

  const isBooked = (date) => {
    return bookedDates.includes(dayjs(date).format('YYYY-MM-DD'))
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
        onChange={(newValue) => setValue(newValue)}
        shouldDisableDate={isBooked}
        disablePast
        slots={{
          day: (props) => {
            const booked = isBooked(props.day)
            const selected = value ? isSameDay(props.day, value) : false

            return (
              <PickersDay
                {...props}
                sx={{
                  ...(booked
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
                        backgroundColor: booked ? '#d32f2f' : '#2e7d32',
                        color: '#fff',
                        '&:hover, &:focus': {
                          backgroundColor: booked ? '#b71c1c' : '#1b5e20',
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
