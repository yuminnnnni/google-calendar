import { createSlice } from '@reduxjs/toolkit'
import type { CalendarView } from '../types/calendar'

const initialState = {
  currentDate: new Date(),
  view: "week" as CalendarView
}

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCurrentDate(state, action) {
      state.currentDate = action.payload
    },
    moveToNextWeek(state) {
      const next = new Date(state.currentDate)
      next.setDate(next.getDate() + 7)
      state.currentDate = next
    },
    moveToPrevWeek(state) {
      const prev = new Date(state.currentDate)
      prev.setDate(prev.getDate() - 7)
      state.currentDate = prev
    },
    moveToNextMonth(state) {
      const next = new Date(state.currentDate)
      next.setMonth(next.getMonth() + 1)
      state.currentDate = next
    },
    moveToPrevMonth(state) {
      const prev = new Date(state.currentDate)
      prev.setMonth(prev.getMonth() - 1)
      state.currentDate = prev
    },
    setView(state, action) {
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
