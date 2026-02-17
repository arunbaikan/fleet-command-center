import React, { useState } from "react";
import { Upload, File, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  label: string;
  required?: boolean;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  compact?: boolean;
}

const FileUploadZone = ({ label, required, accept, onFileSelect, compact }: FileUploadZoneProps) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileName(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer",
          fileName ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50",
          compact ? "p-4 min-h-[100px]" : "p-8 min-h-[160px]"
        )}
        onClick={() => document.getElementById(`file-input-${label}`)?.click()}
      >
        <input
          id={`file-input-${label}`}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
        
        {fileName ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{fileName}</p>
            <button
              onClick={clearFile}
              className="text-xs text-destructive hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-foreground">Click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">
              {accept?.replace(/\./g, '').toUpperCase() || 'All files'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploadZone;