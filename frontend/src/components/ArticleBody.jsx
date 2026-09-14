import { Fragment } from 'react'

function inline(text) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) =>
    part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> :
    part.startsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : <Fragment key={i}>{part}</Fragment>
  )
}

export default function ArticleBody({ content = '' }) {
  const lines = content.replace(/\r/g, '').split('\n')
  const blocks = []
  for (let i = 0; i < lines.length;) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }
    if (line.startsWith('```')) {
      const code = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++])
      i++
      blocks.push(<pre key={blocks.length}><code>{code.join('\n')}</code></pre>)
    } else if (/^#{1,3} /.test(line)) {
      const Heading = line.startsWith('### ') ? 'h3' : 'h2'
      blocks.push(<Heading key={blocks.length}>{inline(line.replace(/^#{1,3} /, ''))}</Heading>)
      i++
    } else if (/^[-*] |^\d+\. /.test(line)) {
      const ordered = /^\d+\. /.test(line)
      const pattern = ordered ? /^\d+\. / : /^[-*] /
      const items = []
      while (i < lines.length && pattern.test(lines[i])) items.push(lines[i++].replace(pattern, ''))
      const List = ordered ? 'ol' : 'ul'
      blocks.push(<List key={blocks.length}>{items.map((item, n) => <li key={n}>{inline(item)}</li>)}</List>)
    } else if (line.startsWith('> ')) {
      blocks.push(<blockquote key={blocks.length}>{inline(line.slice(2))}</blockquote>)
      i++
    } else {
      const paragraph = [line]
      i++
      while (i < lines.length && lines[i].trim() && !/^(#{1,3} |[-*] |\d+\. |> |```)/.test(lines[i])) paragraph.push(lines[i++])
      blocks.push(<p key={blocks.length}>{inline(paragraph.join(' '))}</p>)
    }
  }
  return <div className="article-prose">{blocks}</div>
}
