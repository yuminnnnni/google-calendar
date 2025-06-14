import { CalendarCell } from "./CalendarCell"
import type { CalendarEvent } from "../../types/calendar"

interface CalendarGridProps {
  view: "week" | "month"
  currentDate: Date
  events: CalendarEvent[]
}

export const CalendarGrid = ({ view, currentDate, events }: CalendarGridProps) => {

  const getStartDate = () => {
    if (view === "week") {
      const day = currentDate.getDay()
      const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1)
      return new Date(new Date(currentDate).setDate(diff))
    } else {
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const dayOfWeek = firstDayOfMonth.getDay()
      const diff = firstDayOfMonth.getDate() - dayOfWeek
      return new Date(firstDayOfMonth.setDate(diff))
    }
  }

  const calculatedStartDate = getStartDate()

  const days = Array.from({ length: view === "week" ? 7 : 42 }, (_, i) => {
    const date = new Date(calculatedStartDate)
    date.setDate(date.getDate() + i)
    return date
  })

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const renderDayHeaders = () => {
    return days.slice(0, 7).map((day, i) => (
      <div key={i} className="text-center py-2 border-b border-gray-200">
        <div className="text-sm text-gray-500">{day.toLocaleDateString("ko-KR", { weekday: "short" })}</div>
        <div className="text-lg font-medium">{day.getDate()}</div>
      </div>
    ))
  }

  return (
    <div className="relative w-full h-full overflow-auto">
      {view === "week" && (
        <>
          <div className="sticky top-0 z-10 bg-white grid grid-cols-[60px_1fr] w-full">
            <div className="border-b border-r border-gray-200"></div>
            <div className="grid grid-cols-7">{renderDayHeaders()}</div>
          </div>
          <div className="grid grid-cols-[60px_1fr]">
            <div className="border-r border-gray-200">
              {hours.map((hour) => (
                <div key={hour} className="h-16 border-b border-gray-200 text-right pr-2">
                  <span className="text-xs text-gray-500">{hour}:00</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((day, i) => (
                <div key={i} className="border-l border-gray-200">
                  {hours.map((hour) => (
                    <CalendarCell key={hour} date={day} hour={hour} view={view} events={events} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {view === "month" && (
        <>
          <div className="sticky top-0 z-10 bg-white grid grid-cols-7 w-full">
            {days.slice(0, 7).map((day, i) => (
              <div key={i} className="text-center py-2 border-b border-gray-200">
                {day.toLocaleDateString("ko-KR", { weekday: "short" })}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 grid-rows-6">
            {days.map((day, i) => (
              <CalendarCell key={i} date={day} hour={null} view={view} events={events} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
