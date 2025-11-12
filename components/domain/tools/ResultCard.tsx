"use client"

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ConfidenceBadge from './ConfidenceBadge'

export default function ResultCard({ species, commonName, confidence, image }: {
  species: string
  commonName?: string
  confidence: number
  image?: string
}) {
  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden rounded-t-2xl">
        <Image
          src={image || '/api/placeholder/600/600'}
          alt={commonName || species}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-[#2F5233] dark:text-[#DAF1DE]">
          <span className="truncate">{commonName || species}</span>
          <ConfidenceBadge score={confidence} />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-sm text-gray-600 dark:text-[#8EB69B] italic">
        {commonName ? species : 'Predicted species'}
      </CardContent>
    </Card>
  )
}

