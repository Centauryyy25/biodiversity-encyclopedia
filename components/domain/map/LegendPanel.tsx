"use client"

import { Card } from '@/components/ui/card'

export default function LegendPanel() {
  return (
    <Card className="rounded-2xl shadow-md px-4 py-3 bg-white/90 dark:bg-[#163832]/90 backdrop-blur">
      <div className="text-sm font-medium mb-2 text-[#2F5233] dark:text-[#DAF1DE]">Legend</div>
      <ul className="space-y-1 text-xs text-gray-700 dark:text-[#8EB69B]">
        <li><span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2" /> Flora</li>
        <li><span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2" /> Fauna</li>
        <li><span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2" /> Vulnerable</li>
        <li><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2" /> Endangered</li>
      </ul>
    </Card>
  )
}

