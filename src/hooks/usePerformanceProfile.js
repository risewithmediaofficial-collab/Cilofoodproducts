import { useMemo } from 'react'

/**
 * Hook to detect low-end devices and manage performance settings
 * Returns performance profile to conditionally render/disable features
 */
export function usePerformanceProfile() {
  return useMemo(() => {
    // Check device memory (if available)
    const deviceMemory = navigator.deviceMemory
    const isLowRAM = deviceMemory && deviceMemory <= 4

    // Check connection type
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    const isSlow = connection && connection.effectiveType === '4g' && connection.saveData

    // Check CPU cores
    const cores = navigator.hardwareConcurrency || 1
    const isLowCPU = cores <= 2

    // Check if user prefers reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Determine overall profile
    const isLowEnd = (isLowRAM || isLowCPU || isSlow) && import.meta.env.PROD

    return {
      isLowEnd,
      isLowRAM: Boolean(isLowRAM),
      isSlow4G: Boolean(isSlow),
      supportsWebGL: checkWebGLSupport(),
      shouldReduceAnimations: isLowEnd || prefersReduced,
    }
  }, [])
}

/**
 * Check if WebGL is supported (for GPU acceleration)
 */
function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

/**
 * Optimize animation configuration based on device profile
 */
export function getAnimationConfig(profile, defaultConfig) {
  if (profile.shouldReduceAnimations) {
    return {
      ...defaultConfig,
      duration: (defaultConfig.duration || 0.6) * 0.5,
      delay: 0,
      repeat: 0,
    }
  }
  return defaultConfig
}
