"use client"

import { motion } from 'framer-motion'
import ArticleGrid from '@/components/domain/articles/ArticleGrid'

const demoArticles = [
  { id: 'a1', title: 'The Secret Life of Oaks', date: '2024-10-05', author: 'J. Howard', image: '/api/placeholder/800/450', tags: ['Botany', 'Ecosystems'] },
  { id: 'a2', title: 'Understanding IUCN Categories', date: '2024-09-18', author: 'L. Chen', image: '/api/placeholder/800/450', tags: ['Conservation'] },
  { id: 'a3', title: 'Migratory Patterns of Shorebirds', date: '2024-08-10', author: 'A. Singh', image: '/api/placeholder/800/450', tags: ['Ornithology', 'Migration'] },
  { id: 'a4', title: 'Coral Reefs: Cities Underwater', date: '2024-07-22', author: 'M. Torres', image: '/api/placeholder/800/450', tags: ['Marine'] },
]

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E9F1E8] to-white dark:from-[#051F20] dark:to-[#163832] py-12">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeInOut' }}>
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-serif text-[#2F5233] dark:text-[#DAF1DE]">Articles</h1>
            <p className="text-gray-600 dark:text-[#8EB69B] mt-2">Latest writing on biodiversity, conservation, and research.</p>
          </div>
          <ArticleGrid articles={demoArticles} />
        </motion.div>
      </div>
    </div>
  )
}

