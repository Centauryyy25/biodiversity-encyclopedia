"use client"

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LegendPanel from '@/components/domain/map/LegendPanel'
import LayerToggle from '@/components/domain/map/LayerToggle'

// Dynamic import to avoid SSR; MapView is a placeholder that does not require external deps
const MapView = dynamic(() => import('@/components/domain/map/MapView'), { ssr: false })

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E9F1E8] to-white dark:from-[#051F20] dark:to-[#163832] py-6">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: 'easeInOut' }}>
          <Card className="rounded-2xl shadow-md">
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-[#2F5233] dark:text-[#DAF1DE]">Interactive Map</CardTitle>
              <LayerToggle />
            </CardHeader>
            <CardContent className="relative">
              <div className="relative h-[70vh] rounded-2xl overflow-hidden">
                <MapView />
                <div className="absolute right-3 top-3"><LegendPanel /></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

