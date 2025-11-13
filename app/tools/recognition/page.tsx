"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UploadCloud, ImageIcon } from 'lucide-react'
import AIToolUploader from '@/components/domain/tools/AIToolUploader'
import ResultCard from '@/components/domain/tools/ResultCard'

interface Prediction {
  species: string
  commonName?: string
  confidence: number
  image?: string
}

export default function RecognitionToolPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)

  const handleUpload = async (file: File) => {
    void file
    setLoading(true)
    // Placeholder: simulate API inference
    setTimeout(() => {
      setPredictions([
        { species: 'Panthera leo', commonName: 'Lion', confidence: 0.93, image: '/api/placeholder/600/400' },
        { species: 'Panthera pardus', commonName: 'Leopard', confidence: 0.78, image: '/api/placeholder/600/400' },
        { species: 'Acinonyx jubatus', commonName: 'Cheetah', confidence: 0.64, image: '/api/placeholder/600/400' },
      ])
      setLoading(false)
    }, 900)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E9F1E8] to-white dark:from-[#051F20] dark:to-[#163832] py-14">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeInOut' }}>
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-[#2F5233] dark:text-[#8EB69B]">AI Assistant</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#2F5233] dark:text-[#DAF1DE] mt-2">Image Recognition</h1>
            <p className="text-gray-600 dark:text-[#8EB69B] mt-3">Upload a nature photo to identify likely species. Top 3 matches appear with confidence scores.</p>
          </div>

          <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2F5233] dark:text-[#DAF1DE]">
                <UploadCloud className="h-5 w-5" /> Upload Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AIToolUploader onUpload={handleUpload} loading={loading} />
              <Separator className="my-6" />
              {predictions.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10 text-gray-600 dark:text-[#8EB69B]">
                  <ImageIcon className="h-10 w-10 mb-2 opacity-60" />
                  <p className="max-w-md">No results yet. Upload a clear image with the subject centered for best accuracy.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {predictions.map((p, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: 'easeInOut', delay: idx * 0.05 }}>
                      <ResultCard species={p.species} commonName={p.commonName} confidence={p.confidence} image={p.image} />
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="outline" aria-label="Go to species search" asChild>
              <a href="/species">Browse Species</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
