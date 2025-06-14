import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

interface DatePickerModalProps {
  isOpen: boolean
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onClose: () => void
}

export const DatePickerModal = ({ isOpen, selectedDate, onDateSelect, onClose }: DatePickerModalProps) => {
  const [displayMonth, setDisplayMonth] = useState(new Date(selectedDate))

  if (!isOpen) return null

  const year = displayMonth.getFullYear()
  const month = displayMonth.getMonth()

  const getDaysInMonth = () => {
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push(date)
    }
    return days
  }

  const days = getDaysInMonth()
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"]

  const handlePrevMonth = () => {
    setDisplayMonth(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setDisplayMonth(new Date(year, month + 1, 1))
  }

  const handleDateClick = (date: Date) => {
    onDateSelect(date)
    onClose()
  }

  const isSelectedDate = (date: Date) => {
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    )
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium">{format(displayMonth, "yyyy년 M월", { locale: ko })}</h3>
          <div className="flex space-x-2">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-3">
          {weekdays.map((day) => (
            <div key={day} className="text-center text-base font-medium text-gray-500 py-3">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              className={`
                p-3 text-base rounded hover:bg-gray-100
                ${!isCurrentMonth(date) ? "text-gray-400" : ""}
                ${isSelectedDate(date) ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
              `}
            >
              {date.getDate()}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
