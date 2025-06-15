import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { RepeatType } from "../../types/repeat"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

interface RepeatDropdownProps {
  value: RepeatType
  onChange: (value: RepeatType) => void
}

const getLabel = (type: RepeatType, today: Date): string => {
  const dayOfWeek = format(today, "EEEE", { locale: ko })
  const dateLabel = format(today, "M월 d일", { locale: ko })

  switch (type) {
    case RepeatType.NONE:
      return "반복 안함"
    case RepeatType.DAILY:
      return "매일"
    case RepeatType.WEEKLY:
      return `매주 ${dayOfWeek}`
    case RepeatType.MONTHLY: {
      const weekOfMonth = Math.ceil(today.getDate() / 7)
      return `매월 ${weekOfMonth}번째 ${dayOfWeek}`
    }
    case RepeatType.YEARLY:
      return `매년 ${dateLabel}`
    case RepeatType.WEEKDAYS:
      return "주중 매일(월–금)"
    default:
      return "선택"
  }
}

export const RepeatDropdown = ({ value, onChange }: RepeatDropdownProps) => {
  const [open, setOpen] = useState(false)
  const today = new Date()

  const repeatOptions: RepeatType[] = [
    RepeatType.NONE,
    RepeatType.DAILY,
    RepeatType.WEEKLY,
    RepeatType.MONTHLY,
    RepeatType.YEARLY,
    RepeatType.WEEKDAYS,
  ]

  const currentLabel = getLabel(value, today)

  return (
    <div className="relative inline-block text-left min-w-[220px]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 border rounded bg-white text-sm hover:bg-gray-50"
      >
        <span>{currentLabel}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow text-sm max-h-60 overflow-auto">
          {repeatOptions.map((type) => (
            <li
              key={type}
              onClick={() => {
                onChange(type)
                setOpen(false)
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {getLabel(type, today)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
