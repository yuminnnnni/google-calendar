import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { ko } from "date-fns/locale"
import { format } from "date-fns"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../../store"
import { setCurrentDate } from "../../store/calendarSlice"
import { CreateEventButton } from "../Button/CreateEventButton"

export const DatePicker = () => {
  const dispatch = useDispatch()
  const selectedDate = useSelector((state: RootState) => state.calendar.currentDate)
  const selected = new Date(selectedDate)

  return (
    <aside className="w-80 border-r p-4 bg-white flex-shrink-0 overflow-y-auto h-full">
      <div className="p-4">
        <CreateEventButton />
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
              dispatch(setCurrentDate(day))
            }
          }}
          onMonthChange={(newMonth) => {
            dispatch(setCurrentDate(newMonth))
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
            caption: "flex justify-between items-center px-4 py-2",
            caption_label: "text-base font-semibold",
            nav: "flex space-x-2",
            nav_button: "p-1 hover:bg-gray-100 rounded",
            table: "w-full border-collapse",
            head_row: "flex justify-between px-2 text-gray-500",
            head_cell: "w-8 text-center text-sm",
            row: "flex justify-between px-2",
            cell: "w-8 h-8 text-center text-sm leading-8 rounded cursor-pointer hover:bg-gray-100",
          }}
        />
      </div>
    </aside>
  )
}
