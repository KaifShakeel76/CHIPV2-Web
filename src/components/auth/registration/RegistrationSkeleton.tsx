
// Ultra-lightweight skeleton for instant rendering
const RegistrationSkeleton = () => (
  <div className="space-y-6">
    {/* Progress skeleton */}
    <div className="flex justify-between items-center py-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-center">
          <div className="w-8 h-8 bg-muted rounded-full" />
          {i < 3 && <div className="w-12 h-0.5 bg-muted mx-2" />}
        </div>
      ))}
    </div>
    
    {/* Form skeleton */}
    <div className="space-y-4">
      <div className="h-4 bg-muted rounded w-1/4" />
      <div className="h-10 bg-muted rounded" />
      <div className="h-4 bg-muted rounded w-1/4" />
      <div className="h-10 bg-muted rounded" />
      <div className="h-4 bg-muted rounded w-1/4" />
      <div className="h-10 bg-muted rounded" />
    </div>
    
    {/* Button skeleton */}
    <div className="flex justify-between pt-4">
      <div className="h-10 bg-muted rounded w-20" />
      <div className="h-10 bg-muted rounded w-20" />
    </div>
  </div>
)

export default RegistrationSkeleton