import React, { useRef, useState } from 'react';
import { Upload, File, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadZoneProps {
  label: string;
  required?: boolean;
  accept?: string;
  compact?: boolean;
  onFileSelect: (file: File | null) => void;
}

const FileUploadZone = ({ label, required, accept, compact, onFileSelect }: FileUploadZoneProps) => {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div 
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-muted/50",
          file ? "border-primary bg-primary/5" : "border-muted-foreground/20",
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
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium truncate max-w-[150px]">{file.name}</span>
              <button onClick={removeFile} className="text-muted-foreground hover:text-destructive">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className={cn("text-muted-foreground", compact ? "w-5 h-5" : "w-8 h-8")} />
            <p className="text-xs text-muted-foreground">
              {compact ? "Upload" : "Click to upload or drag and drop"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadZone;