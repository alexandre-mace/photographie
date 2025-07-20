import fs from 'fs'
import path from 'path'
import { Navigation } from '@/components/navigation'
import { Section } from '@/components/section'
import { parseMarkdownContent } from '@/lib/content-parser'

export default function Home() {
  // Read and parse markdown content at build time
  const markdownPath = path.join(process.cwd(), 'lib', 'content.md')
  const markdownContent = fs.readFileSync(markdownPath, 'utf8')
  const sections = parseMarkdownContent(markdownContent)

  // Create navigation items
  const navSections = sections.map(section => ({
    id: section.id,
    title: section.title
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation sections={navSections} />
      
      <main className="pt-[15vh]">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
            <p className="tracking-tighter leading-16 text-5xl mb-8 mx-auto">
              Maîtrisez les ☞ <span className={"underline underline-offset-4"}>bases techniques</span> pour transformer <br/> votre créativité en ✧ <span className={"underline underline-offset-4"}>images inoubliables</span>
            </p>
          </div>
        </section>

        {/* Content Sections */}
        {sections.map((section) => (
          <Section key={section.id} section={section} />
        ))}
      </main>
    </div>
  )
}
