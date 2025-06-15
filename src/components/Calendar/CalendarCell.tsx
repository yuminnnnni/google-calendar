import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../../store"
import type { CalendarEvent, CalendarView } from "../../types/calendar"
import { selectEvent } from "../../store/eventSlice"

interface CalendarCellProps {
  date: Date
  hour: number | null
  view: CalendarView
  events: CalendarEvent[]
}

export const CalendarCell = ({ date, hour, view, events }: CalendarCellProps) => {
  const currentDate = new Date(useSelector((state: RootState) => state.calendar.currentDate))
  const dispatch = useDispatch()

  const cellEvents = events.filter((event: CalendarEvent) => {
    const eventStart = new Date(event.start)

    if (view === "week" && hour !== null) {
      const eventStartsOnThisDate =
        eventStart.getFullYear() === date.getFullYear() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getDate() === date.getDate()

      if (!eventStartsOnThisDate) return false

      const eventStartHour = eventStart.getHours()
      return eventStartHour === hour
    } else if (view === "month") {
      return (
        eventStart.getFullYear() === date.getFullYear() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getDate() === date.getDate()
      )
    }
    return false
  })

  const isToday = date.toDateString() === new Date().toDateString()
  const isSelected = date.toDateString() === new Date(currentDate).toDateString()

  const cellClass =
    view === "week"
      ? "h-16 border-b border-gray-200 hover:bg-blue-50 cursor-pointer relative overflow-visible"
      : "h-32 border border-gray-200 p-1 relative overflow-hidden"

  const renderWeekEvent = (event: CalendarEvent) => {
    const start = new Date(event.start)
    const end = new Date(event.end)

    const eventStartHour = start.getHours()
    const eventStartMinute = start.getMinutes()
    const eventEndHour = end.getHours()
    const eventEndMinute = end.getMinutes()

    const startOffset = (eventStartMinute / 60) * 100
    const totalDurationHours = eventEndHour + eventEndMinute / 60 - (eventStartHour + eventStartMinute / 60)
    const blockHeight = totalDurationHours * 64
    const MIN_HEIGHT = 24
    const appliedHeight = Math.max(blockHeight, MIN_HEIGHT)

    const startStr = start.toLocaleTimeString("ko-KR", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    const endStr = end.toLocaleTimeString("ko-KR", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    return (
      <div
        key={event.id}
        className="absolute left-0.5 right-0.5 rounded text-xs overflow-hidden bg-blue-500 text-white shadow-sm"
        onClick={() => dispatch(selectEvent(event))}
        style={{
          top: `${startOffset}%`,
          height: `${blockHeight}px`,
          zIndex: 10,
        }}
        title={`${event.title} ${startStr} ~ ${endStr}`}
      >
        <div className="p-1 h-full flex items-center">
          {appliedHeight < 28 ? (
            <span className="truncate">
              {event.title} {startStr}~{endStr}
            </span>
          ) : (
            <div className="flex flex-col justify-center w-full">
              <span className="font-medium truncate">{event.title}</span>
              <span className="text-xs opacity-90 truncate">
                {startStr} ~ {endStr}
              </span>
            </div>
          )}
        </div>

      </div>
    )
  }

  const renderMonthEvent = (event: CalendarEvent, index: number) => {
    const GAP = 4
    const HEIGHT = 20

    return (
      <div
        key={event.id}
        className="absolute left-0 right-0 mx-1 rounded overflow-hidden bg-blue-100 border-l-4 border-blue-500 text-xs p-1"
        onClick={() => dispatch(selectEvent(event))}
        style={{
          top: `${index * (HEIGHT + GAP) + 20}px`,
          height: `${HEIGHT}px`,
          marginTop: "10px",
          borderLeftColor: "#4285F4",
          zIndex: 10,
        }}
        title={`${event.title}`}
      >
        <div className="font-medium truncate">{event.title}</div>
      </div>
    )
  }

  return (
    <div className={cellClass} >
      {view === "month" && (
        <div className="text-xs text-gray-500">
          <span
            className={`inline-block w-6 h-6 leading-6 text-center rounded-full ${isToday ? "bg-blue-100 text-blue-700" : isSelected ? "bg-gray-200 text-gray-800" : ""
              }`}
          >
            {date.getDate()}
          </span>
        </div>
      )}
      {view === "week"
        ? cellEvents.map(renderWeekEvent)
        : cellEvents.map((event: CalendarEvent, index: number) => renderMonthEvent(event, index))
      }
    </div>
  )
}
