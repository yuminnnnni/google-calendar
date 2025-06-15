export type CalendarView = "week" | "month"

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  allDay?: boolean
  color?: string
}
