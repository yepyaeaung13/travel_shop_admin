"use client"

import { useState, useRef, type KeyboardEvent } from "react"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface Tag {
  id: string
  value: string
  color: string
}

interface TagInputProps {
  tags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  placeholder?: string
  color?: string
}

export default function TagInput({
  tags,
  onTagsChange,
  placeholder = "Type and press space or enter",
  color = "bg-purple-500",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const createTag = (value: string) => {
    const trimmedValue = value.trim()
    if (!trimmedValue) return

    // Check if tag already exists
    if (tags.some((tag) => tag.value.toLowerCase() === trimmedValue.toLowerCase())) {
      setInputValue("")
      return
    }

    const newTag: Tag = {
      id: Date.now().toString(),
      value: trimmedValue,
      color: color,
    }

    onTagsChange([...tags, newTag])
    setInputValue("")
  }

  const removeTag = (tagId: string) => {
    onTagsChange(tags.filter((tag) => tag.id !== tagId))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      createTag(inputValue)
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      const lastTag = tags[tags.length - 1]
      removeTag(lastTag.id)
    }
  }

  const handleInputClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div
      className="min-h-[40px] w-full border border-gray-300 rounded-md px-3 py-2 cursor-text flex flex-wrap items-center gap-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
      onClick={handleInputClick}
    >
      {tags.map((tag) => (
        <Badge key={tag.id} className={`${tag.color} text-white text-xs px-2 py-1 flex items-center gap-1`}>
          {tag.value}
          <button
            onClick={(e) => {
              e.stopPropagation()
              removeTag(tag.id)
            }}
            className="hover:bg-black/20 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
      />
    </div>
  )
}
