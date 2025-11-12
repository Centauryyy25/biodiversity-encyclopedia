import type { Tables } from '@/types/database.types'
import type { QuizTopic } from '@/lib/supabase/learn'

export type QuizKind = 'common_to_scientific' | 'scientific_to_common'

export interface QuizQuestion {
  id: string
  prompt: string
  choices: string[]
  correctIndex: number
  speciesId: string
  kind: QuizKind
  image?: string | null
}

export function shuffleInPlace<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function buildQuestionsFromSpecies(records: Tables<'species'>[], count = 10, opts?: { includeImages?: boolean; topic?: QuizTopic }): QuizQuestion[] {
  const includeImages = opts?.includeImages ?? true
  const topic = opts?.topic
  const pool = records.filter(r => r.scientific_name)
  const withCommon = pool.filter(r => r.common_name && r.common_name.trim().length > 0)
  const questions: QuizQuestion[] = []
  const used = new Set<string>()

  const take = Math.min(count, pool.length)
  for (let i = 0; i < take; i++) {
    // Topic-specific generation shortcuts
    if (topic === 'Habitats') {
      const q = buildHabitatQuestion(pool, used, includeImages)
      if (q) { questions.push(q); continue }
    }
    if (topic === 'Conservation') {
      const q = buildConservationQuestion(pool, used)
      if (q) { questions.push(q); continue }
    }
    if (topic === 'Classification') {
      const q = buildClassificationQuestion(pool, used)
      if (q) { questions.push(q); continue }
    }
    if (topic === 'SpeciesSpec') {
      const q = buildGenusQuestion(pool, used)
      if (q) { questions.push(q); continue }
    }

    // Alternate types when possible
    const preferCommonToScientific = i % 2 === 0 || withCommon.length < 4
    let q: QuizQuestion | null = null

    if (preferCommonToScientific) {
      const base = pickUnique(pool, used)
      if (!base) break
      const correct = base.scientific_name
      const prompt = base.common_name ? `Apa nama ilmiah untuk "${base.common_name}"?` : `Pilih nama ilmiah yang benar.`
      const distractors = pickDistinct(pool, (s) => s.scientific_name !== correct, 3).map(s => s.scientific_name)
      const choices = shuffleInPlace([correct, ...distractors])
      const correctIndex = choices.indexOf(correct)
      q = {
        id: base.id,
        prompt,
        choices,
        correctIndex,
        speciesId: base.id,
        kind: 'common_to_scientific',
        image: includeImages ? pickImage(base) : null,
      }
    } else {
      const base = pickUnique(withCommon, used)
      if (!base) {
        // fallback
        i--
        continue
      }
      const correct = (base.common_name as string)
      const prompt = `Apa nama umum dari "${base.scientific_name}"?`
      const others = withCommon.filter(s => s.id !== base.id && s.common_name && s.common_name.trim().length > 0)
      const distractors = pickDistinct(others, () => true, 3).map(s => s.common_name as string)
      const choices = shuffleInPlace([correct, ...distractors])
      const correctIndex = choices.indexOf(correct)
      q = {
        id: base.id,
        prompt,
        choices,
        correctIndex,
        speciesId: base.id,
        kind: 'scientific_to_common',
        image: includeImages ? pickImage(base) : null,
      }
    }

    questions.push(q)
  }
  return questions
}

function pickUnique<T extends { id: string }>(arr: T[], used: Set<string>): T | null {
  const candidates = arr.filter(a => !used.has(a.id))
  if (candidates.length === 0) return null
  const item = candidates[Math.floor(Math.random() * candidates.length)]
  used.add(item.id)
  return item
}

function pickDistinct<T>(arr: T[], predicate: (x: T) => boolean, n: number): T[] {
  const filtered = arr.filter(predicate)
  shuffleInPlace(filtered)
  return filtered.slice(0, n)
}

function pickImage(row: Tables<'species'>): string | null {
  const urls = Array.isArray(row.image_urls) ? row.image_urls : []
  return urls.length > 0 ? urls[0] : null
}

// --- Topic-specific question builders ---
// Conservation status question (IUCN)
const IUCN_CODES = ['CR','EN','VU','NT','LC','EW','EX'] as const
const IUCN_LABEL: Record<(typeof IUCN_CODES)[number], string> = {
  CR: 'Critically Endangered',
  EN: 'Endangered',
  VU: 'Vulnerable',
  NT: 'Near Threatened',
  LC: 'Least Concern',
  EW: 'Extinct in the Wild',
  EX: 'Extinct',
}

function codeToLabel(code: string | null | undefined): string | null {
  if (!code) return null
  const up = code.toUpperCase() as (typeof IUCN_CODES)[number]
  return (IUCN_LABEL as any)[up] ?? null
}

function buildConservationQuestion(pool: Tables<'species'>[], used: Set<string>): QuizQuestion | null {
  const candidates = pool.filter(s => s.iucn_status && codeToLabel(s.iucn_status) !== null)
  if (candidates.length < 1) return null
  const base = pickUnique(candidates, used)
  if (!base) return null
  const correctLabel = codeToLabel(base.iucn_status)
  if (!correctLabel) return null

  const available = IUCN_CODES.map(c => IUCN_LABEL[c]).filter(l => l !== correctLabel)
  const distractors = shuffleInPlace(available).slice(0, 3)
  const choices = shuffleInPlace([correctLabel, ...distractors])
  const correctIndex = choices.indexOf(correctLabel)
  const prompt = base.common_name
    ? `Status IUCN untuk "${base.common_name}" adalah ...`
    : `Status IUCN spesies ini adalah ...`

  return {
    id: base.id,
    prompt,
    choices,
    correctIndex,
    speciesId: base.id,
    kind: 'common_to_scientific',
    image: null,
  }
}

const HABITAT_LABELS = [
  'Hutan', 'Gurun', 'Padang rumput', 'Rawa/Wetland', 'Air tawar', 'Laut/Marine', 'Tundra', 'Pegunungan', 'Savanna', 'Pesisir'
] as const

function classifyHabitat(desc?: string | null): (typeof HABITAT_LABELS)[number] | null {
  if (!desc) return null
  const d = desc.toLowerCase()
  if (/(rain|tropical|temperate|forest|wood)/.test(d)) return 'Hutan'
  if (/(desert|arid|dune|xeric)/.test(d)) return 'Gurun'
  if (/(grassland|prairie|steppe)/.test(d)) return 'Padang rumput'
  if (/(wetland|swamp|bog|marsh)/.test(d)) return 'Rawa/Wetland'
  if (/(river|lake|freshwater|stream)/.test(d)) return 'Air tawar'
  if (/(ocean|marine|reef|sea|coral)/.test(d)) return 'Laut/Marine'
  if (/(tundra|permafrost)/.test(d)) return 'Tundra'
  if (/(mountain|alpine)/.test(d)) return 'Pegunungan'
  if (/(savanna|savannah)/.test(d)) return 'Savanna'
  if (/(coast|coastal|shore)/.test(d)) return 'Pesisir'
  return null
}

function buildHabitatQuestion(pool: Tables<'species'>[], used: Set<string>, includeImages: boolean): QuizQuestion | null {
  const candidates = pool.filter(s => classifyHabitat(s.habitat_description) !== null)
  if (candidates.length < 1) return null
  const base = pickUnique(candidates, used)
  if (!base) return null
  const label = classifyHabitat(base.habitat_description)
  if (!label) return null
  const distractorLabels = HABITAT_LABELS.filter(l => l !== label)
  shuffleInPlace(distractorLabels)
  const choices = shuffleInPlace([label, ...distractorLabels.slice(0, 3)])
  const correctIndex = choices.indexOf(label)
  const prompt = base.common_name
    ? `Habitat/bioma yang paling sesuai untuk "${base.common_name}" adalah ...`
    : `Habitat/bioma spesies ini adalah ...`
  return {
    id: base.id,
    prompt,
    choices,
    correctIndex,
    speciesId: base.id,
    kind: 'scientific_to_common',
    image: includeImages ? pickImage(base) : null,
  }
}

function buildClassificationQuestion(pool: Tables<'species'>[], used: Set<string>): QuizQuestion | null {
  const candidates = pool.filter(s => s.family)
  if (candidates.length < 1) return null
  const base = pickUnique(candidates, used)
  if (!base || !base.family) return null
  const families = Array.from(new Set(pool.map(s => s.family).filter(Boolean))) as string[]
  const distractors = shuffleInPlace(families.filter(f => f !== base.family)).slice(0, 3)
  const choices = shuffleInPlace([base.family, ...distractors])
  const correctIndex = choices.indexOf(base.family)
  const prompt = `"${base.scientific_name}" termasuk famili ...`
  return {
    id: base.id,
    prompt,
    choices,
    correctIndex,
    speciesId: base.id,
    kind: 'common_to_scientific',
    image: null,
  }
}

function buildGenusQuestion(pool: Tables<'species'>[], used: Set<string>): QuizQuestion | null {
  const candidates = pool.filter(s => s.genus)
  if (candidates.length < 1) return null
  const base = pickUnique(candidates, used)
  if (!base || !base.genus) return null
  const genera = Array.from(new Set(pool.map(s => s.genus).filter(Boolean))) as string[]
  const distractors = shuffleInPlace(genera.filter(g => g !== base.genus)).slice(0, 3)
  const choices = shuffleInPlace([base.genus, ...distractors])
  const correctIndex = choices.indexOf(base.genus)
  const prompt = `"${base.scientific_name}" termasuk genus ...`
  return {
    id: base.id,
    prompt,
    choices,
    correctIndex,
    speciesId: base.id,
    kind: 'common_to_scientific',
    image: null,
  }
}
