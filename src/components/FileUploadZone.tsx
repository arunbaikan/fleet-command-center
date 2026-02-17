import React, { useState } from 'react';
import { Upload, File, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  label: string;
  required?: boolean;
  accept?: string;
  compact?: boolean;
  onFileSelect: (file: File | null) => void;
}

const FileUploadZone = ({ label, required, accept, compact, onFileSelect }: FileUploadZoneProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      
      <div className={cn(
        "relative border-2 border-dashed rounded-xl transition-all duration-200 flex flex-col items-center justify-center text-center",
        file ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50",
        compact ? "p-4 h-32" : "p-8 h-48"
      )}>
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs font-medium text-foreground truncate max-w-[150px]">{file.name}</p>
            <button 
              onClick={removeFile}
              className="text-[10px] text-destructive hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          </div>
        ) : (
          <>
            <Upload className={cn("text-muted-foreground mb-2", compact ? "w-6 h-6" : "w-8 h-8")} />
            <p className="text-xs text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {accept?.replace(/\./g, '').toUpperCase() || 'All files'}
            </p>
          </>
        )}
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default FileUploadZone;