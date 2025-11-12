"use client"

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import TagBadge from './TagBadge'
import { motion } from 'framer-motion'
import { formatDateUTC } from '@/utils/date'

import type { ArticleItem } from './ArticleGrid'

export default function ArticlePreview({ article }: { article: ArticleItem }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative aspect-video">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover hover:brightness-105 transition-all duration-300"
            priority={false}
          />
        </div>
        <CardContent className="p-5">
          <div className="text-xs text-gray-600 dark:text-[#8EB69B] mb-1">{formatDateUTC(article.date)} • {article.author}</div>
          <h3 className="text-lg font-serif text-[#2F5233] dark:text-[#DAF1DE]">{article.title}</h3>
          {article.tags && (
            <div className="mt-3 flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <TagBadge key={t} label={t} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
