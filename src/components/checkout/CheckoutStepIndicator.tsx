import { Check } from 'lucide-react'

const STEPS = [
  { id: 1 as const, label: 'Carrello' },
  { id: 2 as const, label: 'Consegna e Pagamento' },
] as const

type CheckoutStepIndicatorProps = {
  currentStep: 1 | 2
}

export function CheckoutStepIndicator({ currentStep }: CheckoutStepIndicatorProps) {
  return (
    <nav aria-label="Progresso checkout" className="mb-8">
      <ol className="mx-auto flex w-full max-w-2xl items-center justify-between gap-2 sm:gap-4">
        {STEPS.map((step, index) => {
          const done = currentStep > step.id
          const active = currentStep === step.id
          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <span
                  className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition sm:size-10 sm:text-base ${
                    done
                      ? 'bg-brand-700 text-white'
                      : active
                        ? 'bg-brand-700 text-white ring-4 ring-brand-100'
                        : 'bg-slate-200 text-slate-600'
                  }`}
                  aria-current={active ? 'step' : undefined}
                >
                  {done ? <Check className="size-4 stroke-[3] sm:size-5" aria-hidden /> : step.id}
                </span>
                <span
                  className={`min-w-0 text-xs font-semibold leading-snug sm:text-sm ${
                    active || done ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  <span className="mr-1 tabular-nums">{step.id}.</span>
                  <span className="inline sm:whitespace-nowrap">{step.label}</span>
                </span>
              </div>
              {index < STEPS.length - 1 ? (
                <div
                  className={`mx-1 hidden h-0.5 min-w-[1.5rem] flex-1 rounded-full sm:block ${
                    currentStep > step.id ? 'bg-brand-500' : 'bg-slate-200'
                  }`}
                  aria-hidden
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
