import { Header } from "../components/Header/Header"
import { DatePicker } from "../components/DatePicker/DatePicker"
import { CalendarGrid } from "../components/Calendar/CalendarGrid"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../store"
import { EventModal } from "../components/Modal/EventModal"
import { clearSelectedEvent } from "../store/eventSlice"
import { endOfWeek } from "date-fns"
import { useMemo } from "react"
import { repeatEvents } from "../utils/repeatEvents"
import { addDays } from "date-fns"

export const CalendarPage = () => {
  const selectedEvent = useSelector((state: RootState) => state.events.selectedEvent)
  const dispatch = useDispatch()

  const currentDate = useSelector((state: RootState) => state.calendar.currentDate)
  const allEvents = useSelector((state: RootState) => state.events.eventList)

  const calendarViewEnd = endOfWeek(new Date(currentDate), { weekStartsOn: 0 })
  const expandedEnd = addDays(calendarViewEnd, 60)

  const visibleEvents = useMemo(() => {
    return repeatEvents(allEvents, expandedEnd)
  }, [allEvents, expandedEnd])

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <DatePicker />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <CalendarGrid events={visibleEvents} />
          </div>
        </main>
      </div>

      {selectedEvent && (
        <EventModal
          isOpen={true}
          onClose={() => dispatch(clearSelectedEvent())}
          existingEvent={selectedEvent}
        />
      )}
    </div>
  )
}
