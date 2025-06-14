import { createSlice } from '@reduxjs/toolkit'
import type { CalendarEvent } from '../types/calendar'

const initialState: CalendarEvent[] = []

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent(state, action) {
      state.push(action.payload)
    },
    deleteEvent(state, action) {
      return state.filter(event => event.id !== action.payload)
    },
  },
})

export const { addEvent, deleteEvent } = eventSlice.actions
export default eventSlice.reducer
