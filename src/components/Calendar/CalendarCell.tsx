import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../../store"

interface CalendarCellProps {
  date: Date
  hour: number | null
  view: "week" | "month"
}

export const CalendarCell = ({ date, hour, view }: CalendarCellProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const events = useSelector((state: RootState) => state.events)

  const cellEvents = events.filter((event) => {
    const eventStart = new Date(event.start)

    if (view === "week" && hour !== null) {
      return (
        eventStart.getFullYear() === date.getFullYear() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getDate() === date.getDate() &&
        eventStart.getHours() === hour
      )
    } else if (view === "month") {
      return (
        eventStart.getFullYear() === date.getFullYear() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getDate() === date.getDate()
      )
    }
    return false
  })

  const handleMouseDown = () => {
    setIsDragging(true)
    console.log("Drag start:", date, hour)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    console.log("Drag end:", date, hour)
  }

  const handleMouseEnter = () => {
    if (isDragging) {
      console.log("Dragging over:", date, hour)
    }
  }

  const cellClass =
    view === "week"
      ? "h-16 border-b border-gray-200 hover:bg-blue-50 cursor-pointer relative"
      : "h-24 border border-gray-200 p-1 relative"

  return (
    <div className={cellClass} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseEnter={handleMouseEnter}>
      {view === "month" && <div className="text-xs text-gray-500">{date.getDate()}</div>}

      {cellEvents.map((event) => (
        <div
          key={event.id}
          className="absolute left-0 right-0 mx-1 rounded overflow-hidden bg-blue-100 border-l-4 border-blue-500 text-xs p-1"
          style={{
            top: view === "week" ? "0%" : "20px",
            height: view === "week" ? "90%" : "20px",
            borderLeftColor: event.color || "#4285F4",
            zIndex: 10,
          }}
        >
          <div className="font-medium truncate">{event.title}</div>
          {view === "week" && (
            <div className="truncate text-gray-600">
              {event.start.toLocaleTimeString("ko-KR", {
                hour: "numeric",
                minute: "2-digit",
                hour12: false,
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
