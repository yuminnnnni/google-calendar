import { useState } from "react"
import { Menu, Search, HelpCircle, Settings, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../../store/index"
import { moveToNextWeek, moveToPrevWeek, moveToNextMonth, moveToPrevMonth, setCurrentDate, setView } from "../../store/calendarSlice"
import type { CalendarView } from "../../types/calendar"

export const Header = () => {
  const VIEWS = ["주", "월"] as const
  type ViewType = (typeof VIEWS)[number]

  const [viewDropdownOpen, setViewDropdownOpen] = useState(false)
  const dispatch = useDispatch()
  const view: CalendarView = useSelector((state: RootState) => state.calendar.view)
  const currentDate = new Date(useSelector((state: RootState) => state.calendar.currentDate))

  const formattedDateFull = format(new Date(currentDate), "yyyy년 M월", { locale: ko })
  const formattedDateShort = format(new Date(currentDate), "yy.M", { locale: ko })
  const formattedDateMobile = format(new Date(currentDate), "M월", { locale: ko })

  const toggleDropdown = () => setViewDropdownOpen((prev) => !prev)

  const selectView = (v: ViewType) => {
    dispatch(setView(v === "주" ? "week" : "month"))
    setViewDropdownOpen(false)
  }

  const handleToday = () => {
    dispatch(setCurrentDate(new Date().toISOString()))
  }

  const handlePrev = () => {
    if (view === "month") {
      dispatch(moveToPrevMonth())
    } else {
      dispatch(moveToPrevWeek())
    }
  }

  const handleNext = () => {
    if (view === "month") {
      dispatch(moveToNextMonth())
    } else {
      dispatch(moveToNextWeek())
    }
  }
  return (
    <header className="w-full h-16 sm:h-18 md:h-20 flex items-center bg-white justify-between px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 border-b shadow-sm">
      <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8">

        <button className="hidden md:block p-2 lg:p-3 rounded-full hover:bg-gray-100">
          <Menu className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
        </button>


        <div className="flex items-center">
          <img
            src="/icon/GoogleCalendar.svg"
            alt="Google Calendar"
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-1 sm:mr-2"
          />
          <span className="text-lg sm:text-xl md:text-2xl font-semibold hidden sm:block">Calendar</span>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 ml-2 sm:ml-4 md:ml-8 lg:ml-12">
          <button
            onClick={handleToday}
            className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 lg:px-6 lg:py-2 text-xs sm:text-sm md:text-base font-medium rounded hover:bg-gray-100 border border-gray-200"
          >
            <span className="hidden sm:inline">오늘</span>
            <span className="sm:hidden">오늘</span>
          </button>

          <button onClick={handlePrev} className="p-1 sm:p-1.5 md:p-2 lg:p-2.5 rounded-full hover:bg-gray-100">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
          </button>
          <button onClick={handleNext} className="p-1 sm:p-1.5 md:p-2 lg:p-2.5 rounded-full hover:bg-gray-100">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
          </button>

          <span className="text-sm sm:text-base md:text-lg font-medium ml-1 sm:ml-2">
            <span className="block sm:hidden">{formattedDateMobile}</span>
            <span className="hidden sm:block md:hidden">{formattedDateShort}</span>
            <span className="hidden md:block">{formattedDateFull}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6">
        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {[Search, HelpCircle, Settings].map((Icon, i) => (
            <button key={i} className="p-2 lg:p-3 rounded-full hover:bg-gray-100">
              <Icon className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
            </button>
          ))}
        </div>

        <button className="md:hidden p-2 rounded-full hover:bg-gray-100">
          <Settings className="w-5 h-5" />
        </button>

        <div className="relative z-90">
          <button
            onClick={toggleDropdown}
            className="flex items-center justify-between px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2 text-xs sm:text-sm md:text-base font-medium rounded border border-gray-300 hover:bg-gray-100 min-w-[60px] sm:min-w-[70px] md:min-w-[80px] lg:min-w-[90px]"
          >
            <span>{view === "week" ? "주" : "월"}</span>
            <ChevronDown className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
          {viewDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-[100]">
              {VIEWS.map((v) => (
                <button
                  key={v}
                  onClick={() => selectView(v)}
                  className={`w-full text-left px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base hover:bg-gray-100 ${v === (view === "week" ? "주" : "월") ? "bg-gray-50 font-medium" : ""
                    }`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
