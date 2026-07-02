import fs from 'fs'
import path from 'path'

export interface SiteConfig {
  pageTitle: string
  pageDescription: string
  deceasedName: string
  organizerName: string
  goal: number
  zelle: {
    contact: string
    instructions: string
  }
  story: string[]
}

export function getSiteConfig(): SiteConfig {
  const filePath = path.join(process.cwd(), 'data', 'site.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}
