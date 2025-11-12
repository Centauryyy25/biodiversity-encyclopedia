"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function LayerToggle() {
  const [layer, setLayer] = useState<'terrain' | 'satellite' | 'streets'>('streets')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" aria-label="Toggle map layer">Layer: {layer}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl">
        {(['streets', 'terrain', 'satellite'] as const).map((l) => (
          <DropdownMenuItem key={l} onClick={() => setLayer(l)} aria-label={`Set layer ${l}`}>
            {l}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

