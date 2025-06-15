import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../../store"
import type { CalendarEvent, CalendarView } from "../../types/calendar"
import { selectEvent, selectSlot } from "../../store/eventSlice"

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
      ? "h-12 sm:h-14 md:h-16 border-b border-gray-200 hover:bg-blue-50 cursor-pointer relative overflow-visible"
      : "h-20 sm:h-24 md:h-32 border border-gray-200 p-0.5 sm:p-1 relative overflow-hidden"

  const handleCellClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && view === "week" && hour !== null) {
      const slotDate = new Date(date)
      slotDate.setHours(hour, 0, 0, 0)
      dispatch(selectSlot({ date: slotDate.toISOString() }))
    }
  }

  const renderWeekEvent = (event: CalendarEvent) => {
    const start = new Date(event.start)
    const end = new Date(event.end)

    const eventStartHour = start.getHours()
    const eventStartMinute = start.getMinutes()
    const eventEndHour = end.getHours()
    const eventEndMinute = end.getMinutes()

    const startOffset = (eventStartMinute / 60) * 100

    let totalDurationHours: number

    const isSameDay =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate()

    if (isSameDay) {
      totalDurationHours = eventEndHour + eventEndMinute / 60 - (eventStartHour + eventStartMinute / 60)
    } else {
      totalDurationHours = 24 - (eventStartHour + eventStartMinute / 60)
    }

    totalDurationHours = Math.max(0.5, Math.min(totalDurationHours, 24 - eventStartHour))

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

    const displayEndTime = isSameDay ? endStr : "다음날"

    return (
      <div
        key={event.id}
        className="absolute left-0.5 right-0.5 rounded text-xs overflow-hidden bg-blue-500 text-white shadow-sm cursor-pointer hover:bg-blue-600 transition-colors"
        onClick={(e) => {
          e.stopPropagation()
          dispatch(selectEvent(event))
        }}
        style={{
          top: `${startOffset}%`,
          height: `calc(${totalDurationHours} * (100% / 1))`,
          zIndex: 10,
        }}
        title={`${event.title} ${startStr} ~ ${isSameDay ? endStr : "다음날 " + endStr}`}
      >
        <div className="p-0.5 sm:p-1 h-full flex items-center">
          <div className="flex flex-col justify-center w-full min-h-0">
            <span className="font-medium truncate text-xs sm:text-sm">{event.title}</span>
            <span className="text-xs opacity-90 truncate hidden sm:block">
              {startStr} ~ {displayEndTime}
            </span>
            {!isSameDay && <span className="text-xs opacity-75 truncate">(다음날 계속)</span>}
          </div>
        </div>
      </div>
    )
  }

  const renderMonthEvent = (event: CalendarEvent, index: number) => {
    return (
      <div
        key={event.id}
        className="absolute left-0 right-0 mx-0.5 sm:mx-1 rounded overflow-hidden bg-blue-100 border-l-2 sm:border-l-4 border-blue-500 text-xs p-0.5 sm:p-1 cursor-pointer hover:bg-blue-200 transition-colors"
        onClick={(e) => {
          e.stopPropagation()
          dispatch(selectEvent(event))
        }}
        style={{
          top: `${index * 18 + 16}px`,
          height: "16px",
          borderLeftColor: "#4285F4",
          zIndex: 10,
        }}
        title={`${event.title}`}
      >
        <div className="font-medium truncate text-xs">
          <span className="sm:hidden">
            {event.title.length > 8 ? event.title.substring(0, 8) + "..." : event.title}
          </span>
          <span className="hidden sm:inline">{event.title}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cellClass} onClick={handleCellClick}>
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
