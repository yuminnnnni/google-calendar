import { useState } from "react"
import { Header } from "../components/Header/Header"
import { DatePicker } from "../components/DatePicker/DatePicker"
import { CalendarGrid } from "../components/Calendar/CalendarGrid"
import type { CalendarEvent } from "../types/calendar"

export const CalendarPage = () => {
  const [view, setView] = useState<"week" | "month">("week")
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])

  const handleViewChange = (selected: "주" | "월") => {
    const mapped = selected === "주" ? "week" : "month"
    setView(mapped)
  }

  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (view === "week") {
      newDate.setDate(currentDate.getDate() - 7)
    } else if (view === "month") {
      newDate.setMonth(currentDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (view === "week") {
      newDate.setDate(currentDate.getDate() + 7)
    } else if (view === "month") {
      newDate.setMonth(currentDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const addEvent = (event: CalendarEvent) => {
    setEvents([...events, event])
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        onChangeView={handleViewChange}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        currentDate={currentDate}
      />
      <div className="flex flex-1 overflow-hidden">
        <DatePicker selectedDate={selectedDate} onSelectDate={setSelectedDate} onAddEvent={addEvent} />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <CalendarGrid view={view} currentDate={currentDate} events={events} />
          </div>
        </main>
      </div>
    </div>
  )
}
