import { useSelector, useDispatch } from "react-redux"
import { CalendarCell } from "./CalendarCell"
import { EventModal } from "../Modal/EventModal"
import { clearSelectedEvent, clearSelectedSlot } from "../../store/eventSlice"
import type { RootState } from "../../store"
import type { CalendarEvent } from "../../types/calendar"

interface CalendarGridProps {
  events: CalendarEvent[]
}

export const CalendarGrid = ({ events }: CalendarGridProps) => {
  const view = useSelector((state: RootState) => state.calendar.view)
  const currentDate = new Date(useSelector((state: RootState) => state.calendar.currentDate))
  const selectedSlot = useSelector((state: RootState) => state.events.selectedSlot)
  const selectedEvent = useSelector((state: RootState) => state.events.selectedEvent)
  const dispatch = useDispatch()

  const isModalOpen = Boolean(selectedEvent || selectedSlot)

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
    const today = new Date()

    return days.slice(0, 7).map((day, i) => {
      const isToday =
        day.getFullYear() === today.getFullYear() &&
        day.getMonth() === today.getMonth() &&
        day.getDate() === today.getDate()

      const isSelected =
        day.getFullYear() === currentDate.getFullYear() &&
        day.getMonth() === currentDate.getMonth() &&
        day.getDate() === currentDate.getDate()

      const bgClass = isToday ? "bg-blue-100 text-blue-700" : isSelected ? "bg-gray-200 text-gray-800" : ""

      return (
        <div key={i} className="text-center py-1 sm:py-2 border-b border-gray-200">
          <div className="text-xs sm:text-sm text-gray-500">
            <span className="hidden sm:inline">{day.toLocaleDateString("ko-KR", { weekday: "short" })}</span>
            <span className="sm:hidden">{day.toLocaleDateString("ko-KR", { weekday: "narrow" })}</span>
          </div>
          <div
            className={`text-sm sm:text-lg font-medium inline-block w-6 h-6 sm:w-8 sm:h-8 leading-6 sm:leading-8 rounded-full ${bgClass}`}
          >
            {day.getDate()}
          </div>
        </div>
      )
    })
  }

  const formatHour = (hour: number) => {
    const date = new Date()
    date.setHours(hour)
    date.setMinutes(0)
    return date.toLocaleTimeString("ko-KR", {
      hour: "numeric",
      hour12: true,
    })
  }

  const handleModalClose = () => {
    dispatch(clearSelectedEvent())
    dispatch(clearSelectedSlot())
  }

  return (
    <>
      <div className="relative w-full h-full overflow-auto">
        {view === "week" && (
          <>
            <div className="sticky top-0 z-10 bg-white grid grid-cols-[40px_1fr] sm:grid-cols-[50px_1fr] md:grid-cols-[60px_1fr] w-full">
              <div className="border-b border-r border-gray-200"></div>
              <div className="grid grid-cols-7">{renderDayHeaders()}</div>
            </div>

            <div className="grid grid-cols-[40px_1fr] sm:grid-cols-[50px_1fr] md:grid-cols-[60px_1fr]">
              <div className="border-r border-gray-200">
                {hours.map((hour) => (
                  <div key={hour} className="h-12 sm:h-14 md:h-16 border-b border-gray-200 text-right pr-1 sm:pr-2">
                    <span className="text-xs sm:text-xs text-gray-500">
                      <span className="hidden sm:inline">{formatHour(hour)}</span>
                      <span className="sm:hidden">{hour}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {days.map((day, i) => (
                  <div key={i} className="border-l border-gray-200">
                    {hours.map((hour) => {
                      const cellEvents = events.filter((event) => {
                        const eventDate = new Date(event.start)
                        return (
                          eventDate.getFullYear() === day.getFullYear() &&
                          eventDate.getMonth() === day.getMonth() &&
                          eventDate.getDate() === day.getDate() &&
                          eventDate.getHours() === hour
                        )
                      })

                      return <CalendarCell key={hour} date={day} hour={hour} view={view} events={cellEvents} />
                    })}
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
                <div key={i} className="text-center py-1 sm:py-2 border-b border-gray-200">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    <span className="hidden sm:inline">{day.toLocaleDateString("ko-KR", { weekday: "short" })}</span>
                    <span className="sm:hidden">{day.toLocaleDateString("ko-KR", { weekday: "narrow" })}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 grid-rows-6">
              {days.map((day, i) => {
                const cellEvents = events.filter((event) => {
                  const eventDate = new Date(event.start)
                  return (
                    eventDate.getFullYear() === day.getFullYear() &&
                    eventDate.getMonth() === day.getMonth() &&
                    eventDate.getDate() === day.getDate()
                  )
                })
                return <CalendarCell key={i} date={day} hour={null} view={view} events={cellEvents} />
              })}
            </div>
          </>
        )}
      </div>

      <EventModal isOpen={isModalOpen} existingEvent={selectedEvent || undefined} onClose={handleModalClose} />
    </>
  )
}
