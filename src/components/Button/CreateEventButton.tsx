import { useState } from "react"
import { Plus } from "lucide-react"
import type { CalendarEvent } from "../../types/calendar"
import { CreateEventModal } from "../Modal/CreateEventModal"

interface CreateEventButtonProps {
  onAddEvent: (event: CalendarEvent) => void
  className?: string
}

export const CreateEventButton = ({ onAddEvent, className = "" }: CreateEventButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCloseModal = () => setIsModalOpen(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center justify-center w-full space-x-2 px-4 py-2 mb-5 text-lg border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 ${className}`}
      >
        <Plus className="w-6 h-6 text-blue-600 " />
        <span>만들기</span>
      </button>
      <CreateEventModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={onAddEvent} />
    </>
  )
}
