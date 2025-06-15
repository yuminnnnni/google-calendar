import { useState } from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { ko } from "date-fns/locale"
import { format } from "date-fns"
import { useSelector, useDispatch } from "react-redux"
import { Calendar, X } from "lucide-react"
import type { RootState } from "../../store"
import { setCurrentDate } from "../../store/calendarSlice"
import { CreateEventButton } from "../Button/CreateEventButton"

export const DatePicker = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const selectedDate = useSelector((state: RootState) => state.calendar.currentDate)
  const selected = new Date(selectedDate)

  return (
    <>
      <aside className="hidden sm:block w-72 md:w-80 lg:w-80 xl:w-80 border-r p-3 md:p-4 bg-white flex-shrink-0 overflow-y-auto h-full">
        <div className="p-2 sm:p-3 md:p-4 mb-2">
          <CreateEventButton variant="full" />
        </div>

        <div className="w-full box-border">
          <DayPicker
            mode="single"
            selected={new Date(selectedDate)}
            month={selected}
            showOutsideDays
            locale={ko}
            onSelect={(day) => {
              if (day) {
                dispatch(setCurrentDate(day.toISOString()))
              }
            }}
            onMonthChange={(newMonth) => {
              dispatch(setCurrentDate(newMonth.toISOString()))
            }}
            formatters={{
              formatCaption: (month, options) => format(month, "yyyy년 M월", { locale: options?.locale }),
            }}
            modifiersClassNames={{
              selected: "bg-blue-100 text-blue-800 font-medium rounded-full",
              today: "text-blue-600 font-semibold",
              outside: "text-gray-400",
            }}
            className="w-full"
            classNames={{
              months: "flex flex-col",
              caption: "flex justify-between items-center px-3 md:px-4 py-2",
              caption_label: "text-base font-semibold",
              nav: "flex space-x-2",
              nav_button: "p-1.5 hover:bg-gray-100 rounded text-sm",
              table: "w-full border-collapse mt-2",
              head_row: "flex justify-between px-2 text-gray-500 mb-1",
              head_cell: "w-7 md:w-8 text-center text-sm font-medium",
              row: "flex justify-between px-2 mb-1",
              cell: `
                w-7 h-7 md:w-8 md:h-8 
                text-center 
                text-sm 
                leading-7 md:leading-8 
                rounded 
                cursor-pointer 
                hover:bg-gray-100 
                transition-colors
                flex items-center justify-center
              `,
            }}
          />
        </div>
      </aside>

      <div className="sm:hidden fixed bottom-4 right-4 flex flex-col space-y-3 z-40">
        <CreateEventButton variant="icon" />

        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
          aria-label="날짜 선택기 열기"
        >
          <Calendar className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col">
          <div className="bg-white p-4 flex items-center justify-between border-b">
            <h2 className="text-lg font-semibold">날짜 선택</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <CreateEventButton variant="compact" />
            </div>

            <DayPicker
              mode="single"
              selected={new Date(selectedDate)}
              month={selected}
              showOutsideDays
              locale={ko}
              onSelect={(day) => {
                if (day) {
                  dispatch(setCurrentDate(day.toISOString()))
                  setIsOpen(false)
                }
              }}
              onMonthChange={(newMonth) => {
                dispatch(setCurrentDate(newMonth.toISOString()))
              }}
              formatters={{
                formatCaption: (month, options) => format(month, "yyyy년 M월", { locale: options?.locale }),
              }}
              modifiersClassNames={{
                selected: "bg-blue-100 text-blue-800 font-medium rounded-full",
                today: "text-blue-600 font-semibold",
                outside: "text-gray-400",
              }}
              className="w-full"
              classNames={{
                months: "flex flex-col",
                caption: "flex justify-between items-center px-4 py-3",
                caption_label: "text-lg font-semibold",
                nav: "flex space-x-2",
                nav_button: "p-2 hover:bg-gray-100 rounded text-base",
                table: "w-full border-collapse mt-3",
                head_row: "flex justify-between px-2 text-gray-500 mb-2",
                head_cell: "w-10 text-center text-base font-medium",
                row: "flex justify-between px-2 mb-2",
                cell: `
                  w-10 h-10
                  text-center 
                  text-base
                  leading-10
                  rounded 
                  cursor-pointer 
                  hover:bg-gray-100 
                  transition-colors
                  flex items-center justify-center
                `,
              }}
            />

            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">선택된 날짜</p>
              <p className="text-lg font-semibold text-gray-800">
                {format(selected, "yyyy년 M월 d일 (E)", { locale: ko })}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 border-t">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  )
}
