import { useMemo, type ReactNode } from 'react'
import { normalizeSearchText, tokenizeSearchQuery } from './fuzzySearch'

type Segment = { text: string; highlight: boolean }

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function prefixHighlightEnd(word: string, term: string): number {
  const wordNorm = normalizeSearchText(word)
  if (!wordNorm.startsWith(term)) return 0
  for (let end = 1; end <= word.length; end++) {
    const pref = normalizeSearchText(word.slice(0, end))
    if (pref.length >= term.length && pref.startsWith(term)) return end
  }
  return 0
}

export function buildSearchHighlightSegments(text: string, query: string): Segment[] {
  const terms = tokenizeSearchQuery(query).filter((t) => t.length >= 2)
  if (!terms.length || !text) return [{ text, highlight: false }]

  const highlight = new Set<number>()
  const wordRe = /\S+/g
  let match: RegExpExecArray | null

  while ((match = wordRe.exec(text)) !== null) {
    const word = match[0]
    const wordStart = match.index
    for (const term of terms) {
      const hl = prefixHighlightEnd(word, term)
      for (let i = 0; i < hl; i++) highlight.add(wordStart + i)
    }
  }

  for (const term of terms) {
    const re = new RegExp(escapeRegex(term), 'gi')
    let m: RegExpExecArray | null
    while ((m = re.exec(text)) !== null) {
      for (let i = m.index; i < m.index + m[0].length; i++) highlight.add(i)
    }
  }

  if (!highlight.size) return [{ text, highlight: false }]

  const segments: Segment[] = []
  let buf = ''
  let bufHl = false
  for (let i = 0; i < text.length; i++) {
    const isHl = highlight.has(i)
    if (i === 0) {
      buf = text[i] ?? ''
      bufHl = isHl
      continue
    }
    if (isHl === bufHl) {
      buf += text[i]
    } else {
      segments.push({ text: buf, highlight: bufHl })
      buf = text[i] ?? ''
      bufHl = isHl
    }
  }
  if (buf) segments.push({ text: buf, highlight: bufHl })
  return segments.length ? segments : [{ text, highlight: false }]
}

type SearchHighlightTextProps = {
  text: string
  query: string
  className?: string
  highlightClassName?: string
}

export function SearchHighlightText({
  text,
  query,
  className,
  highlightClassName = 'rounded-sm bg-amber-100 font-bold text-brand-900',
}: SearchHighlightTextProps): ReactNode {
  const segments = useMemo(() => buildSearchHighlightSegments(text, query), [text, query])
  return (
    <span className={className}>
      {segments.map((seg, idx) =>
        seg.highlight ? (
          <mark key={idx} className={highlightClassName}>
            {seg.text}
          </mark>
        ) : (
          <span key={idx}>{seg.text}</span>
        ),
      )}
    </span>
  )
}
