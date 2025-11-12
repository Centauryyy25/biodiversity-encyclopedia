"use client"

import { Progress } from '@/components/ui/progress'

export default function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div>
      {label ? <div className="mb-2 text-sm text-gray-600 dark:text-[#8EB69B]">{label}</div> : null}
      <Progress value={value} className="h-3 rounded-full" />
    </div>
  )
}

