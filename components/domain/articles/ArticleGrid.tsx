"use client"

import ArticlePreview from './ArticlePreview'

export interface ArticleItem {
  id: string
  title: string
  date: string
  author: string
  image: string
  tags?: string[]
}

export default function ArticleGrid({ articles }: { articles: ArticleItem[] }) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]
                    [--shadow:0_10px_30px_rgba(47,82,51,0.08)]">
      {articles.map((a) => (
        <div key={a.id} className="mb-6 break-inside-avoid">
          <ArticlePreview article={a} />
        </div>
      ))}
    </div>
  )
}

