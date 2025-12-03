import React from "react";

export default function StepProgressBar({ steps, activeStep, onStepClick }) {
  return (
    // El w-full en el div principal es correcto
    <div className="flex justify-center mb-8 w-full"> 
      {/* El max-w-2xl limita el ancho en desktop */}
      <ol className="flex w-full max-w-2xl items-center justify-between gap-2 sm:gap-6 px-4"> 
        {steps.map((etapa, idx) => (
          // flex-1 asegura que ocupe el espacio disponible
          <li key={etapa} className="flex-1 flex flex-col items-center">
            <button
              type="button"
              disabled={idx > activeStep}
              onClick={() => {
                if (onStepClick && idx < activeStep) onStepClick(idx);
              }}
              // Clases del texto: Ajustamos el 'whitespace-nowrap' si es muy largo
              className={`text-sm font-medium mb-2 focus:outline-none w-full text-center 
                ${activeStep === idx ? 'text-blue-700' : 'text-gray-400'} 
                ${idx < activeStep ? 'hover:text-blue-500 cursor-pointer' : 'cursor-default'}
                
                // Mantenemos el texto en una línea en desktop, pero lo permitimos envolver en móvil si es necesario:
                hidden sm:block // Oculta el texto de los pasos en móvil y lo muestra en sm
                `}              
            >
                {/* Alternativa para texto largo: 
                <span className="truncate">{`${idx + 1} - ${etapa}`}</span>
                O, mejor, solo mostrar el número en móvil: 
                */}
                <span className="hidden sm:inline">{`${idx + 1} - `}</span>
                {etapa}
            </button>
            
            {/* Si necesitas mostrar algo en móvil, haz que sea solo el número */}
            <span className="sm:hidden text-xs font-semibold mb-2 block text-center">
                {idx + 1}
            </span>

            {/* BARRA DE PROGRESO */}
            <span
              className={`block h-1 rounded-full transition-all duration-200 w-full text-center ${activeStep === idx ? 'bg-blue-600' : 'bg-gray-300'}`}              
            />
          </li>
        ))}
      </ol>
    </div>
  );
}