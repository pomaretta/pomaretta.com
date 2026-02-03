import { ReactNode } from 'react'

// Notion block parser with proper list grouping
interface NotionBlock {
  type: string
  [key: string]: any
}

export function parseNotionBlocks(blocks: NotionBlock[]): ReactNode {
  const result: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]
    const { type, id } = block

    switch (type) {
      case 'paragraph':
        result.push(
          <p key={id || `p-${i}`}>
            {block.paragraph?.rich_text?.map((text: any) => text.plain_text).join('') || ''}
          </p>
        )
        i++
        break

      case 'heading_1':
        result.push(
          <h1 key={id || `h1-${i}`}>
            {block.heading_1?.rich_text?.map((text: any) => text.plain_text).join('') || ''}
          </h1>
        )
        i++
        break

      case 'heading_2':
        result.push(
          <h2 key={id || `h2-${i}`}>
            {block.heading_2?.rich_text?.map((text: any) => text.plain_text).join('') || ''}
          </h2>
        )
        i++
        break

      case 'heading_3':
        result.push(
          <h3 key={id || `h3-${i}`}>
            {block.heading_3?.rich_text?.map((text: any) => text.plain_text).join('') || ''}
          </h3>
        )
        i++
        break

      case 'bulleted_list_item': {
        // Group consecutive bulleted list items
        const listItems: ReactNode[] = []
        let j = i
        while (j < blocks.length && blocks[j].type === 'bulleted_list_item') {
          const item = blocks[j]
          listItems.push(
            <li key={item.id || `bli-${j}`}>
              {item.bulleted_list_item?.rich_text?.map((text: any) => text.plain_text).join('') || ''}
            </li>
          )
          j++
        }
        result.push(
          <ul key={`ul-${i}`} className="list-disc pl-6 space-y-2 mb-4">
            {listItems}
          </ul>
        )
        i = j
        break
      }

      case 'numbered_list_item': {
        // Group consecutive numbered list items
        const listItems: ReactNode[] = []
        let j = i
        while (j < blocks.length && blocks[j].type === 'numbered_list_item') {
          const item = blocks[j]
          listItems.push(
            <li key={item.id || `nli-${j}`}>
              {item.numbered_list_item?.rich_text?.map((text: any) => text.plain_text).join('') || ''}
            </li>
          )
          j++
        }
        result.push(
          <ol key={`ol-${i}`} className="list-decimal pl-6 space-y-2 mb-4">
            {listItems}
          </ol>
        )
        i = j
        break
      }

      case 'code':
        result.push(
          <pre key={id || `code-${i}`} className="overflow-x-auto">
            <code>{block.code?.rich_text?.map((text: any) => text.plain_text).join('') || ''}</code>
          </pre>
        )
        i++
        break

      case 'quote':
        result.push(
          <blockquote key={id || `quote-${i}`}>
            {block.quote?.rich_text?.map((text: any) => text.plain_text).join('') || ''}
          </blockquote>
        )
        i++
        break

      default:
        i++
    }
  }

  return result
}
