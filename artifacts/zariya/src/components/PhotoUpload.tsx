import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";

const MAX_PHOTOS = 5;

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 480;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.src = url;
  });
}

interface PhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  label?: string;
}

export default function PhotoUpload({ photos, onChange, label = "Photos" }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) return;
    const toProcess = Array.from(files).slice(0, remaining);
    const compressed = await Promise.all(toProcess.map(compressImage));
    onChange([...photos, ...compressed]);
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="text-sm font-semibold text-foreground mb-2 block">
        {label}
        <span className="text-muted-foreground font-normal ml-2">({photos.length}/{MAX_PHOTOS} photos)</span>
      </label>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
        {photos.map((src, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
            <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove photo"
            >
              <X className="w-3 h-3" />
            </button>
            {i === 0 && (
              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[9px] font-bold">
                Cover
              </div>
            )}
          </div>
        ))}

        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-1.5 transition-colors group"
          >
            <ImagePlus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[10px] text-muted-foreground group-hover:text-primary font-medium transition-colors">
              Add Photo
            </span>
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Upload up to {MAX_PHOTOS} photos. First photo is your cover image.
        Supported: JPG, PNG, WebP.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        onClick={(e) => { (e.target as HTMLInputElement).value = ""; }}
      />
    </div>
  );
}
