export interface Section {
  id: string;
  title: string;
  duration?: string;
  content: string[];
  subsections?: {
    title: string;
    content: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
  }[];
  quote?: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
  exercises?: string[];
}

export function parseMarkdownContent(markdown: string): Section[] {
  const lines = markdown.split('\n');
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let currentSubsection: { title: string; content: string[] } | null = null;
  let currentTable: { headers: string[]; rows: string[][] } | null = null;
  let inTable = false;
  let inQuote = false;
  let currentQuote = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines unless in quote
    if (!line && !inQuote) continue;

    // Header detection (## Title)
    if (line.startsWith('## ')) {
      // Save previous section if exists
      if (currentSection) {
        if (currentSubsection) {
          if (!currentSection.subsections) currentSection.subsections = [];
          currentSection.subsections.push(currentSubsection);
          currentSubsection = null;
        }
        if (currentQuote) {
          currentSection.quote = currentQuote.trim();
          currentQuote = '';
        }
        if (currentTable) {
          currentSection.table = currentTable;
          currentTable = null;
        }
        sections.push(currentSection);
      }

      // Parse title and duration
      const headerMatch = line.match(/^## (\d+)\.\s*(.+?)\s*(?:\((\d+\s*min)\))?$/);
      if (headerMatch) {
        const [, number, title, duration] = headerMatch;
        currentSection = {
          id: `section-${number}`,
          title,
          duration,
          content: []
        };
      } else {
        // Handle conclusion section
        const conclusionMatch = line.match(/^### (.+?)\s*(?:\((\d+\s*min)\))?$/);
        if (conclusionMatch) {
          const [, title, duration] = conclusionMatch;
          currentSection = {
            id: 'conclusion',
            title,
            duration,
            content: []
          };
        }
      }
      inQuote = false;
      inTable = false;
      continue;
    }

    // Subsection detection (### Title)
    if (line.startsWith('### ') && currentSection) {
      // Save previous subsection if exists
      if (currentSubsection) {
        if (!currentSection.subsections) currentSection.subsections = [];
        currentSection.subsections.push(currentSubsection);
      }
      
      const subsectionTitle = line.substring(4).trim();
      currentSubsection = {
        title: subsectionTitle,
        content: []
      };
      continue;
    }

    if (!currentSection) continue;

    // Quote detection (> text)
    if (line.startsWith('> ')) {
      if (!inQuote) {
        inQuote = true;
        currentQuote = '';
      }
      currentQuote += line.substring(2) + ' ';
      continue;
    } else if (inQuote && line === '') {
      continue;
    } else if (inQuote) {
      // End of quote
      if (currentQuote) {
        currentSection.quote = currentQuote.trim();
        currentQuote = '';
      }
      inQuote = false;
    }

    // Table detection
    if (line.includes('|') && !inQuote) {
      if (!inTable) {
        inTable = true;
        currentTable = { headers: [], rows: [] };
        // Parse headers
        const headers = line.split('|').map(h => h.trim()).filter(h => h);
        currentTable.headers = headers;
      } else if (line.includes('---')) {
        // Skip separator line
        continue;
      } else {
        // Parse table row
        const row = line.split('|').map(cell => cell.trim()).filter(cell => cell);
        if (row.length > 0 && currentTable) {
          currentTable.rows.push(row);
        }
      }
      continue;
    } else if (inTable) {
      // End of table - attach to current subsection if exists, otherwise to section
      if (currentTable) {
        if (currentSubsection) {
          currentSubsection.table = currentTable;
        } else if (currentSection) {
          currentSection.table = currentTable;
        }
        currentTable = null;
      }
      inTable = false;
    }

    // Horizontal rule (---) - end current subsection if exists
    if (line === '---') {
      if (currentSubsection) {
        if (currentTable) {
          currentSubsection.table = currentTable;
          currentTable = null;
        }
        if (!currentSection.subsections) currentSection.subsections = [];
        currentSection.subsections.push(currentSubsection);
        currentSubsection = null;
      }
      continue;
    }

    // List items and exercises
    if (line.startsWith('- ') || line.match(/^\d+\.\s/)) {
      if (currentSection.id === 'conclusion' && line.match(/^\d+\.\s/)) {
        // Handle exercises
        if (!currentSection.exercises) {
          currentSection.exercises = [];
        }
        currentSection.exercises.push(line);
      } else if (currentSubsection) {
        currentSubsection.content.push(line);
      } else {
        currentSection.content.push(line);
      }
      continue;
    }

    // Nested list items (spaces + -)
    if (line.match(/^\s+- /)) {
      if (currentSection.id === 'conclusion') {
        if (!currentSection.exercises) {
          currentSection.exercises = [];
        }
        currentSection.exercises.push(line);
      } else if (currentSubsection) {
        currentSubsection.content.push(line);
      } else {
        currentSection.content.push(line);
      }
      continue;
    }

    // Regular content
    if (line && !inQuote && !inTable) {
      if (currentSubsection) {
        currentSubsection.content.push(line);
      } else {
        currentSection.content.push(line);
      }
    }
  }

  // Don't forget the last section
  if (currentSection) {
    if (currentSubsection) {
      if (currentTable) {
        currentSubsection.table = currentTable;
        currentTable = null;
      }
      if (!currentSection.subsections) currentSection.subsections = [];
      currentSection.subsections.push(currentSubsection);
    }
    if (currentQuote) {
      currentSection.quote = currentQuote.trim();
    }
    if (currentTable) {
      currentSection.table = currentTable;
    }
    sections.push(currentSection);
  }

  return sections;
}