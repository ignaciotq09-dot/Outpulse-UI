import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { getDimensionStyle } from "@/lib/dimensions";
import type { ICPDimension } from "@/types";
import { cn } from "@/lib/utils";

interface TagInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  dimension: ICPDimension;
  placeholder?: string;
}

export function TagInput({ values, onChange, dimension, placeholder }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const style = getDimensionStyle(dimension);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!values.includes(inputValue.trim())) {
        onChange([...values, inputValue.trim()]);
      }
      setInputValue("");
    }
    if (e.key === "Backspace" && !inputValue && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    onChange(values.filter((v) => v !== tag));
  }

  return (
    <div className="flex flex-wrap gap-1.5 rounded-md border border-input bg-background px-2 py-1.5">
      {values.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className={cn("gap-1 rounded-full border", style.bg, style.text, style.border)}
        >
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="hover:opacity-70">
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={values.length === 0 ? placeholder : "Add..."}
        className="h-6 min-w-[120px] flex-1 border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
