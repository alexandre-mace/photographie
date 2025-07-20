'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

interface NavigationProps {
  sections: Array<{
    id: string
    title: string
  }>
}

export function Navigation({ sections }: NavigationProps) {
  const [activeSection, setActiveSection] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [sections])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-1">
              <span className="font-semibold tracking-tight text-lg">Photographie</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {sections.map(({ id, title }) => (
                <Button
                  key={id}
                  variant={activeSection === id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => scrollToSection(id)}
                  className="text-sm"
                >
                  {title}
                </Button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg">
            <div className="p-4 space-y-2">
              {sections.map(({ id, title }) => (
                <Button
                  key={id}
                  variant={activeSection === id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => scrollToSection(id)}
                >
                  {title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}