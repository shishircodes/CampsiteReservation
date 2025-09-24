'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import CharacterCount from '@tiptap/extension-character-count'

interface TiptapProps {
  name: string
  initialContent?: string
}

type Props = {
  name: string
  initialContent?: string
  placeholder?: string
  className?: string
  limit?: number
}

const Tiptap: React.FC<Props> = ({
  name,
  initialContent = '',
  placeholder = 'Start writing your post…',
  className = '',
  limit,
}) => {
  const [html, setHtml] = useState(initialContent)
  const hiddenRef = useRef<HTMLInputElement | null>(null)

  const editor: Editor | null = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] }
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        protocols: ['http', 'https', 'mailto', 'tel'],
      }),
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder }),
      CharacterCount.configure(limit ? { limit } : {}),
    ],
    content: initialContent || '<p></p>',
    immediatelyRender: false,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  })

  useEffect(() => {
    if (hiddenRef.current) hiddenRef.current.value = html
  }, [html])

  

  const promptForLink = () => {
    if (!editor) return
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Enter URL', prev || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url, target: '_blank', rel: 'noopener noreferrer' })
        .run()
    }
  }

  const promptForImage = () => {
    if (!editor) return
    const url = window.prompt('Image URL (https://...)', 'https://')
    if (!url) return
    editor.chain().focus().setImage({ src: url }).run()
  }

  useEffect(() => {
  if (editor && typeof initialContent === 'string') {
    editor.commands.setContent(initialContent, { emitUpdate: false })
    setHtml(initialContent)
  }
}, [editor, initialContent])


  return (
    <div className={`rounded-xl border bg-white ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b p-2">
        <Btn onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()}>
          Undo
        </Btn>
        <Btn onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()}>
          Redo
        </Btn>

        <Sep />

        <Toggle active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()}>
          B
        </Toggle>
        <Toggle active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()}>
          I
        </Toggle>
        <Toggle active={editor?.isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()}>
          S
        </Toggle>
        <Toggle active={editor?.isActive('code')} onClick={() => editor?.chain().focus().toggleCode().run()}>
          {'</>'}
        </Toggle>

        <Sep />

        <Toggle active={editor?.isActive('heading', { level: 1 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </Toggle>
        <Toggle active={editor?.isActive('heading', { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </Toggle>
        <Toggle active={editor?.isActive('heading', { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </Toggle>
        <Btn onClick={() => editor?.chain().focus().setParagraph().run()}>P</Btn>

        <Sep />

        <Toggle active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          • List
        </Toggle>
        <Toggle active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          1. List
        </Toggle>
        <Toggle active={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
          ❝ Quote
        </Toggle>
        <Toggle active={editor?.isActive('codeBlock')} onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
          Code
        </Toggle>

        <Sep />

        <Btn onClick={promptForLink}>Link</Btn>
        <Btn onClick={() => editor?.chain().focus().unsetLink().run()} disabled={!editor?.isActive('link')}>
          Unlink
        </Btn>
        <Btn onClick={promptForImage}>Image</Btn>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="
          min-h-[220px] px-3 py-2
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold
          [&_.ProseMirror_h2]:text-xl  [&_.ProseMirror_h2]:font-semibold
          [&_.ProseMirror_h3]:text-lg  [&_.ProseMirror_h3]:font-semibold
          [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:pl-3 [&_.ProseMirror_blockquote]:text-gray-600
          [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-gray-100 [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5
          [&_.ProseMirror_pre]:rounded [&_.ProseMirror_pre]:bg-gray-900 [&_.ProseMirror_pre]:p-3 [&_.ProseMirror_pre]:text-gray-100
          focus:outline-none
        "
      />

      {/* Footer */}
      <div className="flex items-center justify-between border-t px-3 py-1 text-xs text-gray-500">
        <span>Rich text editor</span>
        {editor && (
          <span>
            {editor.storage.characterCount.characters()}
            {limit ? ` / ${limit}` : ''} chars
          </span>
        )}
      </div>

      {/* Hidden form field for server actions */}
      <input ref={hiddenRef} type="hidden" name={name} defaultValue={initialContent} />
    </div>
  )
}

function Btn({
  children,
  onClick,
  disabled,
}: React.PropsWithChildren<{ onClick?: () => void; disabled?: boolean }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-40"
    >
      {children}
    </button>
  )
}

function Toggle({
  children,
  onClick,
  active,
}: React.PropsWithChildren<{ onClick?: () => void; active?: boolean }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-2 py-1 text-sm hover:bg-gray-50 ${active ? 'bg-gray-900 text-white hover:bg-gray-900' : ''}`}
    >
      {children}
    </button>
  )
}

function Sep() {
  return <span className="mx-1 inline-block h-5 w-px self-center bg-gray-300" />
}


export default Tiptap
