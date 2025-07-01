// src/components/MapSection.tsx
import { useStateConfig } from '../../hooks/useStateConfig';

export function MapSection() {
  const { stateConfig, loading, error } = useStateConfig();

  if (loading) {
    return (
      <div className="w-full max-w-xl flex items-center justify-center h-[400px]">
        <div className="animate-pulse text-gray-500">Loading map...</div>
      </div>
    );
  }

  if (error) {
    console.warn('Failed to load state config:', error);
  }
  
  return (
    <div className="w-full max-w-xl">
      <img
        src={stateConfig.mapUrl || "src/assets/Map.svg"}
        alt={`${stateConfig.stateName} Region Map`}
        width={800}
        height={600}
        className="w-full h-auto"
        loading="lazy"
      />
    </div>
  );
}



  