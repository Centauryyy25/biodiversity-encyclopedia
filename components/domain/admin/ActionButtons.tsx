"use client"

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ActionButtons({ id, onChange }: { id: string; onChange?: (status: 'approved' | 'rejected' | 'flagged') => void }) {
  const update = async (status: 'approved' | 'rejected' | 'flagged') => {
    try {
      const res = await fetch('/api/admin/moderate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      if (!res.ok) throw new Error(await res.text())
      onChange?.(status)
      toast.success(`${status[0].toUpperCase()}${status.slice(1)} submission`)
    } catch (e) {
      toast.error('Failed to update')
    }
  }

  return (
    <div className="inline-flex gap-2">
      <Button size="sm" variant="secondary" aria-label="Approve" onClick={() => update('approved')}>Approve</Button>
      <Button size="sm" variant="outline" aria-label="Reject" onClick={() => update('rejected')}>Reject</Button>
      <Button size="sm" variant="destructive" aria-label="Flag" onClick={() => update('flagged')}>Flag</Button>
    </div>
  )
}
