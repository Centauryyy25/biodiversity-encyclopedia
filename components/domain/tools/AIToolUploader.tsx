"use client"

import { useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, UploadCloud } from 'lucide-react'

export default function AIToolUploader({ onUpload, loading }: { onUpload: (file: File) => void; loading?: boolean }) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFile = (file?: File | null) => {
    if (!file) return
    onUpload(file)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="w-full rounded-2xl border-dashed border-2 p-6 text-center">
        <div className="space-y-3">
          <UploadCloud className="mx-auto h-8 w-8 text-[#2F5233] dark:text-[#8EB69B]" />
          <p className="text-sm text-gray-600 dark:text-[#8EB69B]">Drag and drop an image here, or select from your device</p>
        </div>
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            type="button"
            aria-label="Choose image"
            onClick={() => inputRef.current?.click()}
            className="rounded-2xl"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Select Image
          </Button>
          <Input
            ref={inputRef}
            id="ai-image-input"
            aria-label="Upload image for AI recognition"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      </Card>
    </div>
  )
}

