import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { getNearestTime } from "../../utils/time"

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  placeholder?: string
  baseTime?: Date
}

export const TimePicker = ({ value, onChange, placeholder = "시간 선택", baseTime }: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const generateTimeOptions = () => {
    const times = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        const displayTime = `${hour < 12 ? "오전" : "오후"} ${hour % 12 || 12}:${minute.toString().padStart(2, "0")}`
        times.push({ value: timeString, display: displayTime })
      }
    }

    const nearest = getNearestTime(baseTime || new Date())
    const index = times.findIndex((t) => t.value === nearest)
    return index !== -1 ? [...times.slice(index), ...times.slice(0, index)] : times
  }

  const timeOptions = generateTimeOptions()
  const selectedTime = timeOptions.find((time) => time.value === value)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-between"
      >
        <span>{selectedTime ? selectedTime.display : placeholder}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {timeOptions.map((time) => (
            <button
              key={time.value}
              type="button"
              onClick={() => {
                onChange(time.value)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-3 hover:bg-gray-100 text-base ${value === time.value ? "bg-blue-100 text-blue-600" : ""
                }`}
            >
              {time.display}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
