import { useEffect, useState } from 'react'

export const MAX_MOBILE_WIDTH = 767
export const MIN_NOTEBOOK_WIDTH = 1024

type UseScreenResize = {
  isDesktop: boolean | undefined
  isMobile: boolean | undefined
  isTablet: boolean | undefined
  loading: boolean
}

function useScreenResize(): UseScreenResize {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)
  const [isTablet, setIsTablet] = useState<boolean | undefined>(undefined)
  const [isDesktop, setIsDesktop] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MAX_MOBILE_WIDTH)
      setIsTablet(
        window.innerWidth > MAX_MOBILE_WIDTH &&
          window.innerWidth < MIN_NOTEBOOK_WIDTH,
      )
      setIsDesktop(window.innerWidth >= MIN_NOTEBOOK_WIDTH)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return {
    isDesktop,
    isMobile,
    isTablet,
    loading:
      isMobile === undefined ||
      isTablet === undefined ||
      isDesktop === undefined,
  }
}

export default useScreenResize
