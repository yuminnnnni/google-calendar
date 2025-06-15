import { useState } from "react"
import { Plus } from "lucide-react"
import { EventModal } from "../Modal/EventModal"

interface CreateEventButtonProps {
  className?: string
  variant?: "full" | "compact" | "icon"
}

export const CreateEventButton = ({ className = "", variant = "full" }: CreateEventButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleCloseModal = () => setIsModalOpen(false)

  const getButtonStyles = () => {
    const baseStyles = "flex items-center justify-center transition-colors duration-200"

    switch (variant) {
      case "compact":
        return `${baseStyles} w-full space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100`

      case "icon":
        return `${baseStyles} w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full shadow-lg`

      default:
        return `${baseStyles} w-full space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 mb-3 sm:mb-4 md:mb-5 text-base sm:text-lg border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100`
    }
  }

  const renderButtonContent = () => {
    switch (variant) {
      case "compact":
        return (
          <>
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="hidden sm:inline">만들기</span>
            <span className="sm:hidden text-xs">추가</span>
          </>
        )

      case "icon":
        return <Plus className="w-5 h-5 sm:w-6 sm:h-6" />

      default:
        return (
          <>
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <span className="text-sm sm:text-base md:text-lg">만들기</span>
          </>
        )
    }
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`${getButtonStyles()} ${className}`}
        aria-label="새 이벤트 만들기"
      >
        {renderButtonContent()}
      </button>
      <EventModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}
