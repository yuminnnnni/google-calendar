import { useState } from "react"
import { Menu, Search, HelpCircle, Settings, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

interface HeaderProps {
  onChangeView: (view: "주" | "월") => void
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  currentDate: Date
}

export const Header = ({ onChangeView, onPrevious, onNext, onToday, currentDate }: HeaderProps) => {
  const VIEWS = ["주", "월"] as const
  type ViewType = (typeof VIEWS)[number]
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false)
  const [selectedView, setSelectedView] = useState<ViewType>("주")

  const toggleDropdown = () => setViewDropdownOpen((prev) => !prev)

  const selectView = (view: ViewType) => {
    setSelectedView(view)
    setViewDropdownOpen(false)
    onChangeView(view)
  }

  const renderDropdownMenu = () => (
    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-[100]">
      {VIEWS.map((view) => (
        <button
          key={view}
          onClick={() => selectView(view)}
          className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedView === view ? "bg-gray-50 font-medium" : ""
            }`}
        >
          {view}
        </button>
      ))}
    </div>
  )

  const formattedDate = format(currentDate, "yyyy년 M월", { locale: ko })

  return (
    <header className="w-full h-20 flex items-center bg-white justify-between px-8 py-4 border-b shadow-sm">
      <div className="flex items-center space-x-8">
        <button className="p-3 rounded-full hover:bg-gray-100">
          <Menu className="w-7 h-7" />
        </button>

        <div className="flex items-center">
          <img src="/icon/GoogleCalendar.svg" alt="Google Calendar" className="w-8 h-8 mr-2" />
          <span className="text-2xl font-semibold">캘린더</span>
        </div>

        <div className="flex items-center space-x-4 ml-12">
          <button
            onClick={onToday}
            className="px-6 py-2 text-base font-medium rounded hover:bg-gray-100 border border-gray-200"
          >
            오늘
          </button>
          <button onClick={onPrevious} className="p-2.5 rounded-full hover:bg-gray-100">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button onClick={onNext} className="p-2.5 rounded-full hover:bg-gray-100">
            <ChevronRight className="w-7 h-7" />
          </button>
          <span className="text-lg font-medium ml-1">{formattedDate}</span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {[Search, HelpCircle, Settings].map((Icon, i) => (
          <button key={i} className="p-3 rounded-full hover:bg-gray-100">
            <Icon className="w-7 h-7" />
          </button>
        ))}

        <div className="relative z-90">
          <button
            onClick={toggleDropdown}
            className="flex items-center justify-between px-5 py-2 text-base font-medium rounded border border-gray-300 hover:bg-gray-100 min-w-[90px]"
          >
            <span>{selectedView}</span>
            <ChevronDown className="ml-2 w-5 h-5" />
          </button>
          {viewDropdownOpen && renderDropdownMenu()}
        </div>
      </div>
    </header>
  )
}
