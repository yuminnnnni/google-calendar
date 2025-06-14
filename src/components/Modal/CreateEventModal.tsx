import { useState } from "react"
import { X, Clock, Menu } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { TimePicker } from "../TimePicker/TimePicker"
import { DatePickerModal } from "./DatePickerModal"
import { useDispatch } from "react-redux"
import { addEvent } from "../../store/eventSlice"
import { getNearestTime, addMinutesToTime } from "../../utils/time"
import { v4 as uuidv4 } from "uuid"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateEventModal = ({ isOpen, onClose }: EventModalProps) => {
  const [title, setTitle] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [startTime, setStartTime] = useState(() => getNearestTime())
  const [endTime, setEndTime] = useState(() => addMinutesToTime(getNearestTime(), 60))
  const [isRecurring, setIsRecurring] = useState(false)
  const [activeTab, setActiveTab] = useState("이벤트")
  const [showDatePicker, setShowDatePicker] = useState(false)

  const tabs = ["이벤트", "할 일", "업무"]
  const dispatch = useDispatch()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)

    const start = new Date(selectedDate)
    start.setHours(startHour, startMinute, 0, 0)

    const end = new Date(selectedDate)
    end.setHours(endHour, endMinute, 0, 0)

    dispatch(addEvent({
      id: uuidv4(),
      title,
      start: start.toISOString(),
      end: end.toISOString(),
      color: "#4285F4",
    }))

    setTitle("")
    setSelectedDate(new Date())
    setStartTime("10:00")
    setEndTime("11:00")
    setIsRecurring(false)
    onClose()
  }

  const formatSelectedDate = () => {
    return format(selectedDate, "M월 d일 (EEEE)", { locale: ko })
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-4 flex-1">
                <Menu className="w-6 h-6 text-gray-600" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목 추가"
                  className="text-xl font-medium border-none outline-none flex-1 py-2"
                  autoFocus
                />
              </div>
              <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-base font-medium border-b-2 ${activeTab === tab
                    ? "text-blue-600 border-blue-600 bg-blue-50"
                    : "text-gray-600 border-transparent hover:text-gray-800"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <Clock className="w-6 h-6 text-gray-600 mt-2" />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <button
                      type="button"
                      onClick={() => setShowDatePicker(true)}
                      className="px-4 py-3 border border-blue-500 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-base font-medium"
                    >
                      {formatSelectedDate()}
                    </button>
                  </div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex-1">
                      <TimePicker value={startTime} onChange={setStartTime} placeholder="시작 시간" />
                    </div>
                    <span className="text-gray-500 text-lg">-</span>
                    <div className="flex-1">
                      <TimePicker value={endTime} onChange={setEndTime} placeholder="종료 시간" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">시간대 · 반복 안함</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-8">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="recurring" className="text-base text-gray-700">
                  반복 업무
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-base text-gray-600 hover:bg-gray-100 rounded-md"
              >
                옵션 더보기
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-6 py-3 text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      </div>

      <DatePickerModal
        isOpen={showDatePicker}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        onClose={() => setShowDatePicker(false)}
      />
    </>
  )
}
