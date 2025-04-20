"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import Typography from "@mui/material/Typography"
import Link from "@mui/material/Link"
import Box from "@mui/material/Box"

const MarkdownRenderer = ({ children }) => {
  const [content, setContent] = useState(children)

  useEffect(() => {
    // Преобразуем обычный текст в Markdown, если он не содержит Markdown-разметки
    if (children && !containsMarkdown(children)) {
      // Добавляем переносы строк для абзацев
      const formattedText = children
        .split("\n")
        .map((line) => line.trim())
        .join("\n\n")
      setContent(formattedText)
    } else {
      setContent(children)
    }
  }, [children])

  // Проверка наличия Markdown-разметки
  const containsMarkdown = (text) => {
    const markdownPatterns = [
      /#{1,6}\s+.+/m, // Заголовки
      /\*\*.+\*\*/m, // Жирный текст
      /\*.+\*/m, // Курсив
      /\[.+\]$$.+$$/m, // Ссылки
      /```[\s\S]*?```/m, // Блоки кода
      /`[^`]+`/m, // Инлайн-код
      /^\s*[-*+]\s+.+/m, // Списки
      /^\s*\d+\.\s+.+/m, // Нумерованные списки
      /^\s*>\s+.+/m, // Цитаты
    ]

    return text && markdownPatterns.some((pattern) => pattern.test(text))
  }

  if (!content) return null

  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => <Typography variant="h4" component="h1" gutterBottom fontWeight={700} {...props} />,
        h2: ({ node, ...props }) => <Typography variant="h5" component="h2" gutterBottom fontWeight={600} {...props} />,
        h3: ({ node, ...props }) => <Typography variant="h6" component="h3" gutterBottom fontWeight={600} {...props} />,
        h4: ({ node, ...props }) => (
          <Typography variant="subtitle1" component="h4" gutterBottom fontWeight={600} {...props} />
        ),
        h5: ({ node, ...props }) => (
          <Typography variant="subtitle2" component="h5" gutterBottom fontWeight={600} {...props} />
        ),
        h6: ({ node, ...props }) => (
          <Typography variant="subtitle2" component="h6" gutterBottom fontWeight={500} {...props} />
        ),
        p: ({ node, ...props }) => <Typography variant="body1" paragraph {...props} />,
        a: ({ node, ...props }) => <Link color="primary" {...props} />,
        ul: ({ node, ...props }) => <Box component="ul" sx={{ pl: 2, mb: 2 }} {...props} />,
        ol: ({ node, ...props }) => <Box component="ol" sx={{ pl: 2, mb: 2 }} {...props} />,
        li: ({ node, ...props }) => <Typography component="li" variant="body1" {...props} />,
        blockquote: ({ node, ...props }) => (
          <Box
            component="blockquote"
            sx={{
              borderLeft: "4px solid",
              borderColor: "primary.main",
              pl: 2,
              py: 0.5,
              my: 2,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
            {...props}
          />
        ),
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "")
          return !inline && match ? (
            <SyntaxHighlighter
              style={materialLight}
              language={match[1]}
              PreTag="div"
              {...props}
              customStyle={{ borderRadius: "8px", marginBottom: "16px", marginTop: "8px" }}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <Box
              component="code"
              sx={{
                backgroundColor: "background.paper",
                padding: inline ? "0.2em 0.4em" : "0.8em",
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "0.875em",
                display: inline ? "inline" : "block",
                overflowX: "auto",
              }}
              {...props}
            >
              {children}
            </Box>
          )
        },
        hr: ({ node, ...props }) => <Box component="hr" sx={{ my: 2, borderColor: "divider" }} {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer
