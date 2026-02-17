import React, { useRef } from "react";
import { Upload, File, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  label: string;
  required?: boolean;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  compact?: boolean;
}

const FileUploadZone = ({ label, required, accept, onFileSelect, compact }: FileUploadZoneProps) => {
  const [file, setFile] = React.useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    onFileSelect(selected);
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-secondary/50",
          file ? "border-primary bg-primary/5" : "border-border",
          compact ? "p-4" : "p-8"
        )}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
        
        {file ? (
          <div className="flex flex-col items-center text-center">
            <File className="h-8 w-8 text-primary mb-2" />
            <p className="text-xs font-medium text-foreground truncate max-w-[150px]">{file.name}</p>
            <button 
              onClick={removeFile}
              className="mt-2 text-[10px] text-destructive font-bold uppercase hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <Upload className={cn("text-muted-foreground mb-2", compact ? "h-5 w-5" : "h-8 w-8")} />
            <p className="text-xs text-muted-foreground font-medium">
              {compact ? "Upload" : "Click to upload or drag and drop"}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploadZone;