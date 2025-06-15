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

    const baseHeight = window.innerWidth < 640 ? 48 : window.innerWidth < 768 ? 56 : 64 // h-12, h-14, h-16
    const blockHeight = totalDurationHours * baseHeight
    const MIN_HEIGHT = window.innerWidth < 640 ? 20 : 24
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
        className="absolute left-0.5 right-0.5 rounded text-xs overflow-hidden bg-blue-500 text-white shadow-sm cursor-pointer hover:bg-blue-600 transition-colors"
        onClick={() => dispatch(selectEvent(event))}
        style={{
          top: `${startOffset}%`,
          height: `${blockHeight}px`,
          zIndex: 10,
        }}
        title={`${event.title} ${startStr} ~ ${endStr}`}
      >
        <div className="p-0.5 sm:p-1 h-full flex items-center">
          {appliedHeight < (window.innerWidth < 640 ? 24 : 28) ? (
            <span className="truncate text-xs">
              <span className="hidden sm:inline">
                {event.title} {startStr}~{endStr}
              </span>
              <span className="sm:hidden">{event.title}</span>
            </span>
          ) : (
            <div className="flex flex-col justify-center w-full">
              <span className="font-medium truncate text-xs sm:text-sm">{event.title}</span>
              <span className="text-xs opacity-90 truncate hidden sm:block">
                {startStr} ~ {endStr}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderMonthEvent = (event: CalendarEvent, index: number) => {
    const GAP = window.innerWidth < 640 ? 2 : 4
    const HEIGHT = window.innerWidth < 640 ? 16 : 20

    return (
      <div
        key={event.id}
        className="absolute left-0 right-0 mx-0.5 sm:mx-1 rounded overflow-hidden bg-blue-100 border-l-2 sm:border-l-4 border-blue-500 text-xs p-0.5 sm:p-1 cursor-pointer hover:bg-blue-200 transition-colors"
        onClick={() => dispatch(selectEvent(event))}
        style={{
          top: `${index * (HEIGHT + GAP) + (window.innerWidth < 640 ? 16 : 20)}px`,
          height: `${HEIGHT}px`,
          marginTop: window.innerWidth < 640 ? "6px" : "10px",
          borderLeftColor: "#4285F4",
          zIndex: 10,
        }}
        title={`${event.title}`}
      >
        <div className="font-medium truncate text-xs">
          <span className="hidden sm:inline">{event.title}</span>
          <span className="sm:hidden">
            {event.title.length > 8 ? event.title.substring(0, 8) + "..." : event.title}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={cellClass}>
      {view === "month" && (
        <div className="text-xs text-gray-500">
          <span
            className={`inline-block w-4 h-4 sm:w-6 sm:h-6 leading-4 sm:leading-6 text-center rounded-full text-xs sm:text-sm ${isToday ? "bg-blue-100 text-blue-700" : isSelected ? "bg-gray-200 text-gray-800" : ""
              }`}
          >
            {date.getDate()}
          </span>
        </div>
      )}
      {view === "week"
        ? cellEvents.map(renderWeekEvent)
        : cellEvents.map((event: CalendarEvent, index: number) => renderMonthEvent(event, index))}
    </div>
  )
}
