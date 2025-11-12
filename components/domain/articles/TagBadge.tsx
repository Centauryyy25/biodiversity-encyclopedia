"use client"

import { Badge } from '@/components/ui/badge'

export default function TagBadge({ label }: { label: string }) {
  return <Badge variant="secondary" className="rounded-full">{label}</Badge>
}

