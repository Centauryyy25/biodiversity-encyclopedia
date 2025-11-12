"use client"

import { useEffect, useRef } from 'react'

// Lightweight placeholder map using OpenStreetMap static iframe to avoid extra deps.
// Swap for react-leaflet once installed; keep API the same for easy replacement.
export default function MapView() {
  const ref = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    // noop placeholder
  }, [])

  return (
    <iframe
      ref={ref}
      title="Species Map"
      aria-label="Species distribution map"
      className="w-full h-full"
      loading="lazy"
      src="https://www.openstreetmap.org/export/embed.html?bbox=-3.7%2C40.3%2C-3.6%2C40.5&layer=mapnik"
    />
  )
}

