import { Check } from 'lucide-react'
import { BOOKING_STEPS } from '../../utils/constants'
import clsx from 'clsx'

export default function BookingSteps({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {BOOKING_STEPS.map((item, i) => {
        const isDone = item.step < currentStep
        const isActive = item.step === currentStep

        return (
          <div key={item.step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  'w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                  isDone && 'bg-amber-500 text-black',
                  isActive && 'bg-amber-500/20 border-2 border-amber-500 text-amber-400',
                  !isDone && !isActive && 'bg-white/5 border border-white/20 text-zinc-600'
                )}
              >
                {isDone ? <Check size={16} /> : item.step}
              </div>
              <span
                className={clsx(
                  'text-xs mt-1.5 font-medium hidden sm:block',
                  isActive ? 'text-amber-400' : isDone ? 'text-zinc-400' : 'text-zinc-600'
                )}
              >
                {item.label}
              </span>
            </div>

            {/* Connector */}
            {i < BOOKING_STEPS.length - 1 && (
              <div
                className={clsx(
                  'w-8 md:w-16 h-0.5 mx-1 mb-5 sm:mb-0 transition-all duration-300',
                  item.step < currentStep ? 'bg-amber-500' : 'bg-white/10'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
