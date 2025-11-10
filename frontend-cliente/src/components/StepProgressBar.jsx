import React from "react";

export default function StepProgressBar({ steps, activeStep, onStepClick }) {
  return (
    <div className="flex justify-center mb-8 w-full">
      <ol className="flex w-full max-w-2xl items-center justify-between gap-6">
        {steps.map((etapa, idx) => (
          <li key={etapa} className="flex-1 flex flex-col items-center">
            <button
              type="button"
              disabled={idx > activeStep}
              onClick={() => {
                if (onStepClick && idx < activeStep) onStepClick(idx);
              }}
              className={`text-sm font-medium mb-2 focus:outline-none w-full text-center whitespace-nowrap ${activeStep === idx ? 'text-blue-700' : 'text-gray-400'} ${idx < activeStep ? 'hover:text-blue-500 cursor-pointer' : 'cursor-default'}`}
              style={{ minWidth: '120px', maxWidth: '300px' }}
            >
              {`${idx + 1} - ${etapa}`}
            </button>
            <span
              className={`block h-1 rounded-full transition-all duration-200 w-full text-center ${activeStep === idx ? 'bg-blue-600' : 'bg-gray-300'}`}
              style={{ minWidth: '120px', maxWidth: '300px' }}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
