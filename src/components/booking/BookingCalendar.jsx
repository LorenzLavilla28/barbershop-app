import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, isToday, isPast,
  addMonths, subMonths, parseISO,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

export default function BookingCalendar({ selectedDate, onSelectDate, bookedDates = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const isDateBooked = (date) =>
    bookedDates.some((d) => isSameDay(parseISO(d), date))

  const isDisabled = (date) =>
    isPast(date) && !isToday(date)

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="text-white font-semibold text-lg">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-zinc-500 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isCurrent = isToday(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const disabled = isDisabled(day)

          return (
            <motion.button
              key={day.toISOString()}
              whileHover={!disabled ? { scale: 1.1 } : {}}
              whileTap={!disabled ? { scale: 0.95 } : {}}
              onClick={() => !disabled && onSelectDate(day)}
              disabled={disabled}
              className={clsx(
                'aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all',
                !isCurrentMonth && 'opacity-25',
                disabled && 'opacity-25 cursor-not-allowed',
                isSelected && 'bg-amber-500 text-black font-bold',
                !isSelected && isCurrent && 'border-2 border-amber-500 text-amber-400',
                !isSelected && !isCurrent && !disabled && isCurrentMonth && 'text-zinc-300 hover:bg-white/10 hover:text-white',
                !isSelected && !isCurrent && !disabled && !isCurrentMonth && 'text-zinc-600'
              )}
            >
              {format(day, 'd')}
            </motion.button>
          )
        })}
      </div>

      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-amber-400 text-sm font-medium text-center">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
      )}
    </div>
  )
}
