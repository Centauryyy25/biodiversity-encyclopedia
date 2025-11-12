"use client"

import { Badge } from '@/components/ui/badge'

export default function ConfidenceBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  const tone =
    pct >= 85 ? 'bg-emerald-600 text-white' : pct >= 70 ? 'bg-yellow-500 text-black' : 'bg-orange-500 text-white'

  return (
    <Badge className={`${tone} rounded-full px-3 py-1`}>{pct}%</Badge>
  )
}

