import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CalendarView } from '../types/calendar'

const initialState = {
  currentDate: new Date().toISOString(),
  view: "week" as CalendarView
}

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCurrentDate(state, action: PayloadAction<string | Date>) {
      state.currentDate =
        typeof action.payload === "string"
          ? action.payload
          : action.payload.toISOString()
    },
    moveToNextWeek(state) {
      const next = new Date(state.currentDate)
      next.setDate(next.getDate() + 7)
      state.currentDate = next.toISOString()
    },
    moveToPrevWeek(state) {
      const prev = new Date(state.currentDate)
      prev.setDate(prev.getDate() - 7)
      state.currentDate = prev.toISOString()
    },
    moveToNextMonth(state) {
      const next = new Date(state.currentDate)
      next.setMonth(next.getMonth() + 1)
      state.currentDate = next.toISOString()
    },
    moveToPrevMonth(state) {
      const prev = new Date(state.currentDate)
      prev.setMonth(prev.getMonth() - 1)
      state.currentDate = prev.toISOString()
    },
    setView(state, action: PayloadAction<CalendarView>) {
      state.view = action.payload
    },
  },
})

export const {
  setCurrentDate,
  moveToNextWeek,
  moveToPrevWeek,
  moveToNextMonth,
  moveToPrevMonth,
  setView,
} = calendarSlice.actions

export default calendarSlice.reducer
