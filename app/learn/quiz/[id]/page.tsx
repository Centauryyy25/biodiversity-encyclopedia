"use client"

import { use } from 'react'
import { useSearchParams } from 'next/navigation'
import QuizRunner from '@/components/domain/learn/QuizRunner'
import type { QuizTopic } from '@/lib/supabase/learn'

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const sp = useSearchParams()
  const topic = (sp.get('topic') as QuizTopic) || 'Taxonomy'
  const difficulty = (sp.get('difficulty') as 'Beginner' | 'Intermediate' | 'Advanced') || 'Beginner'
  const { id } = use(params)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E9F1E8] to-white dark:from-[#051F20] dark:to-[#163832] py-12">
      <div className="mx-auto max-w-[900px] px-4 md:px-8 lg:px-12">
        <QuizRunner quizId={id} topic={topic} difficulty={difficulty} />
      </div>
    </div>
  )
}
