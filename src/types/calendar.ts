import type { RepeatType } from "./repeat"

export type CalendarView = "week" | "month"

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  color?: string
  repeat?: RepeatType
}
