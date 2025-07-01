import { useEffect } from 'react'

// Production-grade component preloader with aggressive optimization
const ComponentPreloader = () => {
  useEffect(() => {
    // Check if we should preload (avoid in low-memory scenarios)
    const shouldPreload = () => {
      if (typeof window === 'undefined') return false
      
      // Check memory and connection
      const nav = navigator as any
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection
      const memory = nav.deviceMemory
      
      // Skip preloading on slow connections or low memory devices
      if (connection?.effectiveType === '2g' || memory < 2) return false
      
      return true
    }

    if (!shouldPreload()) return

    // Immediate preloading for critical components
    const preloadCritical = () => {
      // Preload VerificationStep immediately (most likely to be used)
      import('../registration/steps/VerificationStep').catch(() => {})
      
      // Preload heavy dependencies in parallel
      Promise.all([
        import('@/features/registerForm/registerFormSlice'),
        import('@/components/auth/schemas/validationSchemas'),
        import('@/components/auth/registration/RegistrationProgress')
      ]).catch(() => {})
    }

    // Aggressive background preloading
    const preloadSecondary = () => {
      // Use different strategies based on browser capabilities
      const loadStrategy = 'requestIdleCallback' in window 
        ? window.requestIdleCallback 
        : (cb: () => void) => setTimeout(cb, 0)

      loadStrategy(() => {
        // Preload remaining steps in order of likelihood
        Promise.all([
          import('../registration/steps/UserDetailsStep'),
          import('../registration/steps/PersonalInfoStep'), 
          import('../registration/steps/ApprovalStep')
        ]).catch(() => {})
        
        // Preload form validation utilities
        Promise.all([
          import('../hooks/useFormValidation'),
          import('../utils/passwordSecurity')
        ]).catch(() => {})
      })
    }

    // Start preloading immediately
    preloadCritical()
    
    // Preload secondary components after a brief delay
    setTimeout(preloadSecondary, 100)

    // Warmup Redux store selectors
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        try {
          // Trigger selector creation without side effects
          const event = new CustomEvent('warmup-selectors')
          window.dispatchEvent(event)
        } catch (e) {
          // Silently handle any errors
        }
      }, 50)
    }

  }, [])

  return null
}

export default ComponentPreloader