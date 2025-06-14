import { Header } from "../components/Header/Header"
import { DatePicker } from "../components/DatePicker/DatePicker"
import { CalendarGrid } from "../components/Calendar/CalendarGrid"

export const CalendarPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <DatePicker />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <CalendarGrid />
          </div>
        </main>
      </div>
    </div>
  )
}
