"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export default function ContributionForm() {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'image' | 'text'>('text')
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, content, url }),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Submission received! Pending moderation.')
      setTitle(''); setContent(''); setUrl(''); setType('text')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="text-sm block mb-1">Title</label>
        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required className="rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm block mb-1">Type</label>
          <Select value={type} onValueChange={(value) => setType(value as 'image' | 'text')}>
            <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="text">Text/Note</SelectItem>
              <SelectItem value="image">Image/Photo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="url" className="text-sm block mb-1">Image URL (if any)</label>
          <Input id="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." className="rounded-2xl" />
        </div>
      </div>
      <div>
        <label htmlFor="content" className="text-sm block mb-1">Content</label>
        <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={6} required className="rounded-2xl" />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="rounded-2xl">{loading ? 'Submitting...' : 'Submit'}</Button>
      </div>
    </form>
  )
}
