import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Quote, Clock } from 'lucide-react'
import type { Section as SectionType } from '@/lib/content-parser'

// Force component reload - updated formatting

interface SectionProps {
  section: SectionType
}

export function Section({ section }: SectionProps) {
  const renderContent = (content: string[]) => {
    return content.map((item, index) => {
      if (item.startsWith('- ')) {
        return (
          <li key={index} className="ml-4">
            {formatText(item.substring(2))}
          </li>
        )
      }
      if (item.match(/^\s+- /)) {
        return (
          <li key={index} className="ml-8 text-sm">
            {formatText(item.trim().substring(2))}
          </li>
        )
      }
      if (item.startsWith('**') && item.endsWith('**')) {
        return (
          <div key={index} className="text-center text-lg font-semibold my-4 p-4 bg-gray-50 rounded-lg">
            {item.slice(2, -2)}
          </div>
        )
      }
      return (
        <p key={index} className="mb-3 leading-relaxed">
          {formatText(item)}
        </p>
      )
    })
  }

  const formatText = (text: string) => {
    // First, handle code to avoid conflicts
    text = text.replace(/`([^`]+)`/g, '___CODE_START___$1___CODE_END___')
    
    // Handle bold text **text** first (more specific pattern)
    text = text.replace(/\*\*([^*]+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    
    // Handle italic text *text* (single asterisk, not preceded or followed by another asterisk)
    text = text.replace(/(^|[^*])\*([^*]+?)\*([^*]|$)/g, '$1<em class="italic">$2</em>$3')
    
    // Restore code with proper styling
    text = text.replace(/___CODE_START___([^_]+?)___CODE_END___/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    
    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }

  const renderExercises = (exercises: string[]) => {
    return (
      <div className="mt-6">
        <h4 className="font-semibold text-lg mb-3">Exercices pratiques</h4>
        <ol className="space-y-2">
          {exercises.map((exercise, index) => {
            if (exercise.match(/^\d+\.\s/)) {
              return (
                <li key={index} className="font-medium">
                  {exercise}
                </li>
              )
            } else if (exercise.match(/^\s+- /)) {
              return (
                <ul key={index} className="ml-6">
                  <li className="text-sm text-gray-600">
                    {exercise.trim().substring(2)}
                  </li>
                </ul>
              )
            }
            return (
              <p key={index} className="text-sm text-gray-600 ml-6">
                {formatText(exercise)}
              </p>
            )
          })}
        </ol>
      </div>
    )
  }

  return (
    <section id={section.id} className="min-h-screen py-20">
      <div className="max-w-4xl my-auto mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-xl md:text-2xl font-medium tracking-tight">
                {section.title}
              </CardTitle>
              {section.duration && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {section.duration}
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Main content */}
            {renderContent(section.content).length > 0 && (
              <div className="prose prose-gray max-w-none mb-8">
                {renderContent(section.content)}
              </div>
            )}

            {/* Subsections if present */}
            {section.subsections && section.subsections.map((subsection, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  {subsection.title}
                </h3>
                <div className="prose prose-gray max-w-none ml-4">
                  {renderContent(subsection.content)}
                </div>
                
                {/* Table in subsection if present */}
                {subsection.table && (
                  <div className="ml-4 mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {subsection.table.headers.map((header, headerIndex) => (
                            <TableHead key={headerIndex} className="font-semibold">
                              {formatText(header)}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subsection.table.rows.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex}>
                                {formatText(cell)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ))}

            {/* Table if present */}
            {section.table && (
              <div className="mb-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {section.table.headers.map((header, index) => (
                        <TableHead key={index} className="font-semibold">
                          {formatText(header)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {section.table.rows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>
                            {formatText(cell)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Quote if present */}
            {section.quote && (
              <div className="mt-8 p-6 bg-neutral-50 border-l-4 border-black rounded-r-lg">
                <div className="flex items-start gap-3">
                  <Quote className="h-4 w-4 mt-1 flex-shrink-0" />
                  <blockquote className="italic leading-relaxed">
                    {formatText(section.quote)}
                  </blockquote>
                </div>
              </div>
            )}

            {/* Exercises if present */}
            {section.exercises && renderExercises(section.exercises)}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}