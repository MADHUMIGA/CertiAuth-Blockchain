import { Check } from "lucide-react"

const ProcessSteps = ({ steps = [], currentStep = 1 }) => {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = currentStep > stepNumber
          const isActive = currentStep === stepNumber

          return (
            <div
              key={index}
              className="flex-1 flex items-center relative"
            >
              {/* Connector Line */}
              {index !== 0 && (
                <div
                  className={`absolute top-5 left-0 w-full h-1 -z-10 transition-all duration-300
                  ${
                    currentStep > stepNumber
                      ? "bg-primary"
                      : "bg-slate-700"
                  }`}
                />
              )}

              {/* Step Content */}
              <div className="flex flex-col items-center w-full">
                
                {/* Circle */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-primary text-white shadow-glow"
                      : isActive
                      ? "bg-primary text-white scale-110 shadow-glow"
                      : "bg-slate-700 text-muted"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={18} />
                  ) : (
                    stepNumber
                  )}
                </div>

                {/* Label */}
                <p
                  className={`mt-3 text-lg text-center font-medium
                  ${
                    isActive
                      ? "text-white"
                      : isCompleted
                      ? "text-primary"
                      : "text-muted"
                  }`}
                >
                  {step}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProcessSteps

// import { Check } from "lucide-react";

// const steps = [
//   "Upload",
//   "OCR Extraction",
//   "Normalize Text",
//   "Keccak256 Hash",
//   "Store on Blockchain"
// ];

// const ProcessSteps = ({ currentStep = 0 }) => {
//   return (
//     <div className="mt-10">
//       <div className="flex items-center justify-between relative">

//         {steps.map((step, index) => {
//           const isCompleted = index < currentStep;
//           const isActive = index === currentStep;

//           return (
//             <div
//               key={index}
//               className="flex flex-col items-center flex-1 relative"
//             >
//               {/* Line Connector */}
//               {index !== 0 && (
//                 <div
//                   className={`absolute top-5 -left-1/2 w-full h-1 
//                   ${isCompleted ? "bg-emerald-500" : "bg-slate-300"}`}
//                 />
//               )}

//               {/* Step Circle */}
//               <div
//                 className={`z-10 w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
//                 ${
//                   isCompleted
//                     ? "bg-emerald-500 text-white"
//                     : isActive
//                     ? "bg-indigo-600 text-white scale-110"
//                     : "bg-slate-200 text-slate-600"
//                 }`}
//               >
//                 {isCompleted ? <Check size={18} /> : index + 1}
//               </div>

//               {/* Label */}
//               <p
//                 className={`mt-3 text-xs text-center font-medium
//                 ${
//                   isActive
//                     ? "text-indigo-600"
//                     : isCompleted
//                     ? "text-emerald-600"
//                     : "text-slate-500"
//                 }`}
//               >
//                 {step}
//               </p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ProcessSteps;