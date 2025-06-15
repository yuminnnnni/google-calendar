import { useState, useEffect } from "react"
import { X, Clock, Menu, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { TimePicker } from "../TimePicker/TimePicker"
import { DatePickerModal } from "./DatePickerModal"
import { useDispatch } from "react-redux"
import { addEvent, updateEvent, deleteEvent } from "../../store/eventSlice"
import { getNearestTime, addMinutesToTime } from "../../utils/time"
import { v4 as uuidv4 } from "uuid"
import type { CalendarEvent } from "../../types/calendar"
import { RepeatDropdown } from "../Dropdown/RepeatDropdown"
import { RepeatType } from "../../types/repeat"
import { useSelector } from "react-redux"
import type { RootState } from "../../store"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  existingEvent?: CalendarEvent
}

export const EventModal = ({ isOpen, onClose, existingEvent }: EventModalProps) => {
  const dispatch = useDispatch()
  const selectedSlot = useSelector((state: RootState) => state.events.selectedSlot)

  const [title, setTitle] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [repeatType, setRepeatType] = useState<RepeatType>(RepeatType.NONE)

  useEffect(() => {
    if (!isOpen) return

    if (existingEvent) {
      const start = new Date(existingEvent.start)
      const end = new Date(existingEvent.end)

      setTitle(existingEvent.title)
      setSelectedDate(start)
      setStartTime(`${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`)
      setEndTime(`${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`)
    } else if (selectedSlot) {
      const slotDate = new Date(selectedSlot.date)
      setTitle("")
      setSelectedDate(slotDate)

      const slotHour = slotDate.getHours()
      const start = `${String(slotHour).padStart(2, "0")}:00`
      const end = addMinutesToTime(start, 60)

      setStartTime(start)
      setEndTime(end)
      setRepeatType(RepeatType.NONE)
    } else {
      const nearest = getNearestTime()
      setTitle("")
      setSelectedDate(new Date())
      setStartTime(nearest)
      setEndTime(addMinutesToTime(nearest, 60))
      setRepeatType(RepeatType.NONE)
    }
  }, [isOpen, existingEvent, selectedSlot])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)

    const start = new Date(selectedDate)
    start.setHours(startHour, startMinute, 0, 0)

    const end = new Date(selectedDate)
    end.setHours(endHour, endMinute, 0, 0)

    if (existingEvent) {
      dispatch(updateEvent({
        ...existingEvent,
        title,
        start: start.toISOString(),
        end: end.toISOString(),
        repeat: repeatType,
      }))
    } else {
      dispatch(addEvent({
        id: uuidv4(),
        title,
        start: start.toISOString(),
        end: end.toISOString(),
        color: "#4285F4",
        repeat: repeatType,
      }))
    }

    onClose()
  }

  const handleDelete = () => {
    if (existingEvent) {
      dispatch(deleteEvent(existingEvent.id))
      onClose()
    }
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
              <div className="flex items-center space-x-2">
                {existingEvent && (
                  <button type="button" onClick={handleDelete} className="p-2 hover:bg-gray-100 rounded">
                    <Trash2 className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="px-6 pt-4 text-base font-medium text-blue-600">이벤트</div>

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

              <div className="mb-4">
                <span className="block text-sm text-gray-600 mb-1">반복 설정</span>
                <RepeatDropdown value={repeatType} onChange={setRepeatType} />
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-base text-gray-600 hover:bg-gray-100 rounded-md"
              >
                취소
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
