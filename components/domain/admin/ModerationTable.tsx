"use client"

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDateUTC } from '@/utils/date'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import ActionButtons from './ActionButtons'

interface Submission {
  id: string
  title: string
  user: string
  type: 'image' | 'text'
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  createdAt: string
  url?: string | null
  content?: string | null
}

type StatusFilter = 'all' | Submission['status']

export default function ModerationTable({ submissions }: { submissions: ReadonlyArray<Submission> }) {
  const [rows, setRows] = useState<Submission[]>([...submissions])
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    let next = rows
    if (statusFilter !== 'all') next = next.filter((s) => s.status === statusFilter)
    const q = query.trim().toLowerCase()
    if (q) next = next.filter((s) => s.title.toLowerCase().includes(q) || s.user.toLowerCase().includes(q))
    return next
  }, [rows, statusFilter, query])

  const statusTone = (s: Submission['status']) =>
    s === 'pending' ? 'bg-yellow-500 text-black' : s === 'approved' ? 'bg-emerald-600 text-white' : s === 'rejected' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 justify-between">
        <div className="w-72">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title or user..." className="rounded-2xl" aria-label="Search submissions" />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
          <SelectTrigger aria-label="Filter by status" className="w-44">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-2xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.title}</TableCell>
                <TableCell>{s.user}</TableCell>
                <TableCell className="capitalize">{s.type}</TableCell>
                <TableCell>
                  <Badge className={`${statusTone(s.status)} rounded-full`}>{s.status}</Badge>
                </TableCell>
                <TableCell>{formatDateUTC(s.createdAt)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="px-3 py-1 rounded-md border hover:bg-muted transition" aria-label="View details">View</button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Submission Detail</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 text-sm">
                        <div><span className="font-medium">Title:</span> {s.title}</div>
                        <div><span className="font-medium">User:</span> {s.user}</div>
                        <div><span className="font-medium">Type:</span> {s.type}</div>
                        <div><span className="font-medium">Status:</span> {s.status}</div>
                        <div><span className="font-medium">Submitted:</span> {formatDateUTC(s.createdAt)}</div>
                        {s.type === 'image' && s.url ? (
                          <div>
                            <span className="font-medium">Image:</span>
                            <div className="mt-2 relative h-64">
                              <Image
                                src={s.url}
                                alt={`Preview ${s.title}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="rounded-xl object-contain"
                                unoptimized
                              />
                            </div>
                          </div>
                        ) : null}
                        {s.content ? (
                          <div>
                            <span className="font-medium">Content:</span>
                            <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{s.content}</p>
                          </div>
                        ) : null}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <ActionButtons id={s.id} onChange={async (next) => {
                    try {
                      const res = await fetch('/api/admin/moderate', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: s.id, status: next })
                      })
                      if (!res.ok) throw new Error(await res.text())
                      setRows(prev => prev.map(r => r.id === s.id ? { ...r, status: next } : r))
                    } catch (error) {
                      console.error('Failed to update status in ModerationTable', error)
                      // ignore; ActionButtons will toast
                    }
                  }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
