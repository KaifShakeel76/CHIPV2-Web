// import { HeaderProps } from '../../types/state';
// import { getStateConfig } from '../../config/stateConfigs';

// export function Header({ stateConfig }: HeaderProps = {}) {
//   const currentStateConfig = stateConfig || getStateConfig('KA');
//   return (
//     <header className="bg-background shadow-[0_2px_8px_rgba(2,2,2,0.15)] py-2 md:py-3 lg:py-[10px] px-4 md:px-8 lg:px-[60px]">
//       <div className="flex flex-col items-center gap-[10px] max-w-[1800px] mx-auto">
//         <div className="flex w-full lg:hidden justify-between items-center">
//           {/* Left Logo */}
//           <img
//             src={currentStateConfig.leftLogoUrl || '/src/assets/logos/default-left.svg'}
//             alt={`${currentStateConfig.stateName} Left Logo`}
//             className="h-8 w-auto sm:h-10 md:h-12 flex-shrink-0"
//             loading="lazy"
//           />

//           {/* Center content */}
//           <div className="flex flex-col items-center flex-1 mx-4">
//             <img
//                src="src/assets/icons/Indian Govt. Sign.svg"
//               alt="Government of India Emblem"
//               className="h-6 w-auto sm:h-8 md:h-10 mb-1"
//               loading="lazy"
//             />
//             <div className="text-center">
//               <h1 className="text-sm sm:text-base md:text-lg font-['K2D'] font-medium text-[#303030] leading-tight">
//                 CHIP
//               </h1>
//               <p className="text-[10px] sm:text-xs md:text-sm font-['K2D'] font-semibold text-[#020202] leading-tight">
//                 Community Health Integrated Platform
//               </p>
//             </div>
//           </div>

//           {/* Right Logo */}
//           <img
//             src={currentStateConfig.rightLogoUrl || 'src/assets/icons/NHM PNG Logo.svg'}
//             alt={`${currentStateConfig.stateName} Right Logo`}
//             className="h-8 w-auto sm:h-10 md:h-12 flex-shrink-0"
//             loading="lazy"
//           />
//         </div>

//         {/* Desktop layout - following Figma specs exactly */}
//         <div className="hidden lg:flex lg:items-center lg:justify-between lg:w-full lg:h-[90px]">
//           {/* Left Logo - State Emblem */}
//           <div className="flex flex-col justify-center items-center w-[80px] h-[80px]">
//             <img
//               src={currentStateConfig.leftLogoUrl || '/src/assets/logos/default-left.svg'}
//               alt={`${currentStateConfig.stateName} Left Logo`}
//               className="w-[93px] h-[80px]"
//               loading="lazy"
//             />
//           </div>

//           {/* Center - Main Logo with Indian Emblem and Title */}
//           <div className="flex items-center gap-[40px] w-[378px] h-[90px]">
//             <img
//               src="src/assets/icons/Indian Govt. Sign.svg"
//               alt="Government of India Emblem"
//               className="w-[56px] h-[90px]"
//               loading="lazy"
//             />
//             <div className="flex flex-col items-center w-[282px] h-[73px]">
//               <h1 className="w-[75px] h-[42px] font-['K2D'] font-medium text-[32px] leading-[42px] text-center text-[#303030]">
//                 CHIP
//               </h1>
//               <p className="w-[282px] h-[21px] font-['K2D'] font-semibold text-[16px] leading-[21px] text-center text-[#020202]">
//                 Community Health Integrated Platform
//               </p>
//             </div>
//           </div>

//           {/* Right Logo - NHM */}
//           <div className="flex flex-col items-start w-[60px] h-[60px]">
//             <img
//               src={currentStateConfig.rightLogoUrl || 'src/assets/icons/NHM PNG Logo.svg'}
//               alt={`${currentStateConfig.stateName} Right Logo`}
//               className="w-[63px] h-[60px]"
//               loading="lazy"
//             />
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }
