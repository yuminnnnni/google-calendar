import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CalendarEvent } from '../types/calendar'

interface SelectedSlot {
  date: string
}

interface EventState {
  eventList: CalendarEvent[]
  selectedEvent: CalendarEvent | null
  selectedSlot: SelectedSlot | null
}

const initialState: EventState = {
  eventList: [],
  selectedEvent: null,
  selectedSlot: null,
}

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent(state, action: PayloadAction<CalendarEvent>) {
      state.eventList.push(action.payload)
    },
    deleteEvent(state, action: PayloadAction<string>) {
      state.eventList = state.eventList.filter(event => event.id !== action.payload)
    },
    updateEvent(state, action: PayloadAction<CalendarEvent>) {
      const index = state.eventList.findIndex(event => event.id === action.payload.id)
      if (index !== -1) {
        state.eventList[index] = action.payload
      }
    },
    selectEvent(state, action: PayloadAction<CalendarEvent>) {
      state.selectedEvent = action.payload
      state.selectedSlot = null
    },
    clearSelectedEvent(state) {
      state.selectedEvent = null
    },
    selectSlot(state, action: PayloadAction<SelectedSlot>) {
      state.selectedSlot = action.payload
      state.selectedEvent = null
    },
    clearSelectedSlot(state) {
      state.selectedSlot = null
    },
  },
})

export const { addEvent, deleteEvent, updateEvent, selectEvent, clearSelectedEvent, selectSlot, clearSelectedSlot } = eventSlice.actions
export default eventSlice.reducer
