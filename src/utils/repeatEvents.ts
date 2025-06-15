import { RepeatType } from "../types/repeat"
import type { CalendarEvent } from "../types/calendar"

// 반복 일정을 현재 달력에 보여줄 날짜들에 맞춰 여러 개로 복사해서 반환하는 함수
export const repeatEvents = (events: CalendarEvent[], viewStart: Date, viewEnd: Date): CalendarEvent[] => {
  const result: CalendarEvent[] = []

  for (const event of events) {
    if (!event.repeat || event.repeat === RepeatType.NONE) {
      result.push(event)
      continue
    }

    const start = new Date(event.start)
    const end = new Date(event.end)
    const duration = end.getTime() - start.getTime()
    const currentDatePointer = new Date(viewStart)

    while (currentDatePointer <= viewEnd) {
      let shouldAdd = false

      switch (event.repeat) {
        case RepeatType.DAILY:
          shouldAdd = true
          break

        case RepeatType.WEEKLY:
          shouldAdd = currentDatePointer.getDay() === start.getDay()
          break

        case RepeatType.WEEKDAYS:
          shouldAdd = currentDatePointer.getDay() >= 1 && currentDatePointer.getDay() <= 5
          break

        case RepeatType.MONTHLY: {
          const weekOfMonth = Math.ceil(start.getDate() / 7)
          const currentWeek = Math.ceil(currentDatePointer.getDate() / 7)
          shouldAdd = currentWeek === weekOfMonth && currentDatePointer.getDay() === start.getDay()
          break
        }
        case RepeatType.YEARLY:
          shouldAdd =
            currentDatePointer.getMonth() === start.getMonth() &&
            currentDatePointer.getDate() === start.getDate()
          break

        default:
          shouldAdd = false
      }

      if (shouldAdd) {
        const newStart = new Date(currentDatePointer)
        newStart.setHours(start.getHours(), start.getMinutes(), 0, 0)

        const newEnd = new Date(newStart.getTime() + duration)

        result.push({
          ...event,
          start: newStart.toISOString(),
          end: newEnd.toISOString(),
        })
      }

      currentDatePointer.setDate(currentDatePointer.getDate() + 1)
    }
  }

  return result
}
