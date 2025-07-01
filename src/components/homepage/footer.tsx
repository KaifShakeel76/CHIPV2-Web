import { FooterProps } from '../../types/state';
import { useStateConfig } from '../../hooks/useStateConfig';

export function Footer({ stateConfig: propStateConfig }: FooterProps = {}) {
  // Use prop stateConfig if provided, otherwise fetch from API
  const { stateConfig: apiStateConfig, loading, error } = useStateConfig();
  
  const currentStateConfig = propStateConfig || apiStateConfig;

  if (loading) {
    return (
      <footer className="bg-white border-t border-[rgba(2,2,2,0.15)] overflow-x-hidden">
        <div className="flex justify-center items-center py-8">
          <div className="animate-pulse text-gray-500">Loading state configuration...</div>
        </div>
      </footer>
    );
  }

  if (error) {
    console.warn('Failed to load state config, using fallback:', error);
  }
  return (
    <footer className="bg-white border-t border-[rgba(2,2,2,0.15)] overflow-x-hidden">
      {/* Desktop layout - matches Figma exactly */}
      <div className="hidden lg:flex justify-between items-center px-4 xl:px-16 py-8 gap-4 xl:gap-16 max-w-full mx-auto min-h-[120px]">
        {/* Left section - Helpline */}
        <div className="flex flex-col items-start gap-[6px] min-w-0 flex-shrink-0">
          <div className="font-['Poppins'] font-normal text-base leading-6 text-[#303030] whitespace-nowrap">
            Helpline No. : {currentStateConfig.helplineNumber || '+91-9999999999'}
          </div>
          <div className="font-['Poppins'] font-normal text-base leading-6 text-[#303030] whitespace-nowrap">
            <a href="#" className="hover:underline">
              Watch : Training Videos
            </a>
          </div>
        </div>

        {/* Center section - Content info */}
        <div className="flex flex-col items-center gap-2 flex-1 min-w-0 px-4">
          <div className="font-['Poppins'] font-normal text-base leading-6 text-[#303030] text-center">
            Content Owned & Managed by : National Health Mission (NHM), Dept. of Medical, Health & Family Welfare, Govt.
            of {currentStateConfig?.stateName || 'Karnataka'}
          </div>
          <div className="font-['Poppins'] font-normal text-base leading-6 text-[#303030] text-center">
            Supported by : Software designed and developed by Khushi Baby
          </div>
        </div>

        {/* Right section - Nodal Officer */}
        <div className="flex flex-col items-start gap-[6px] min-w-0 flex-shrink-0">
          <div className="font-['Poppins'] font-normal text-base leading-6 text-[#303030] whitespace-nowrap">
            Nodal Officer : {currentStateConfig.nodalOfficer || 'Dr. Khanna, IAS (AMD-NHM)'}
          </div>
          <div className="font-['Poppins'] font-normal text-base leading-6 text-[#303030] whitespace-nowrap">
            <a href={`mailto:${currentStateConfig.email || 'HealthOfficials@karnataka.gov.in'}`} className="hover:underline">
              Email : {currentStateConfig.email || 'HealthOfficials@karnataka.gov.in'}
            </a>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet layout - responsive */}
      <div className="lg:hidden px-4 py-6">
        <div className="flex flex-col gap-6 text-center">
          {/* Mobile - Helpline */}
          <div className="flex flex-col items-center gap-2">
            <div className="font-['Poppins'] font-normal text-sm leading-5 text-[#303030]">
              Helpline No. : {currentStateConfig.helplineNumber || '+91-9999999999'}
            </div>
            <div className="font-['Poppins'] font-normal text-sm leading-5 text-[#303030]">
              <a href="#" className="hover:underline">
                Watch : Training Videos
              </a>
            </div>
          </div>

          {/* Mobile - Content info */}
          <div className="flex flex-col items-center gap-2">
            <div className="font-['Poppins'] font-normal text-sm leading-5 text-[#303030]">
              Content Owned & Managed by : National Health Mission (NHM), Dept. of Medical, Health & Family Welfare,
              Govt. of {currentStateConfig?.stateName || 'Karnataka'}
            </div>
            <div className="font-['Poppins'] font-normal text-sm leading-5 text-[#303030]">
              Supported by : Software designed and developed by Khushi Baby
            </div>
          </div>

          {/* Mobile - Nodal Officer */}
          <div className="flex flex-col items-center gap-2">
            <div className="font-['Poppins'] font-normal text-sm leading-5 text-[#303030]">
              Nodal Officer : {currentStateConfig.nodalOfficer || 'Dr. Khanna, IAS (AMD-NHM)'}
            </div>
            <div className="font-['Poppins'] font-normal text-sm leading-5 text-[#303030]">
              <a href={`mailto:${currentStateConfig.email || 'HealthOfficials@karnataka.gov.in'}`} className="hover:underline">
                Email : {currentStateConfig.email || 'HealthOfficials@karnataka.gov.in'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
