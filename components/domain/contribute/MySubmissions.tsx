"use client"

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateUTC } from '@/utils/date'

type Row = {
  id: string
  title: string
  type: 'text' | 'image'
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  created_at: string
  url?: string | null
}

export default function MySubmissions() {
  const { data } = useQuery({
    queryKey: ['contrib', 'mine'],
    queryFn: async () => {
      const r = await fetch('/api/contributions', { cache: 'no-store' })
      if (!r.ok) return []
      const json = await r.json()
      return (json.data ?? []) as Row[]
    },
  })

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>My Submissions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!data || data.length === 0 ? (
          <div className="text-sm text-muted-foreground">No submissions yet.</div>
        ) : (
          data.map((row) => (
            <div key={row.id} className="flex items-center justify-between border rounded-xl px-4 py-3">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">{row.title}</div>
                <div className="text-xs text-muted-foreground">{row.type} • {formatDateUTC(row.created_at)}</div>
                {row.type === 'image' && row.url ? (
                  <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-xs underline">Open image</a>
                ) : null}
              </div>
              <Badge className="rounded-full capitalize">{row.status}</Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
