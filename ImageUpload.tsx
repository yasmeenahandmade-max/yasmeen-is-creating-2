'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import clsx from 'clsx';

type Props = {
  value?: string | null;
  onChange: (url: string | null) => void;
  bucket?: string;
  folder?: string;
  label?: string;
  hint?: string;
  accept?: Record<string, string[]>;
  maxSizeMB?: number;
  aspectRatio?: string; // e.g. "aspect-square", "aspect-video"
  className?: string;
};

export function ImageUpload({
  value,
  onChange,
  bucket = 'uploads',
  folder = 'images',
  label,
  hint,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.svg'] },
  maxSizeMB = 5,
  aspectRatio = 'aspect-video',
  className,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(value || null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File must be under ${maxSizeMB}MB`);
        return;
      }

      setError('');
      setUploading(true);

      // Show local preview immediately
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', bucket);
        formData.append('folder', folder);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        setPreview(data.url);
        onChange(data.url);
      } catch (err: any) {
        setError(err.message || 'Upload failed');
        setPreview(value || null);
        onChange(value || null);
      } finally {
        setUploading(false);
      }
    },
    [bucket, folder, maxSizeMB, onChange, value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled: uploading,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium tracking-wider uppercase text-brand-charcoal/40 mb-2">
          {label}
        </label>
      )}

      <div
        {...getRootProps()}
        className={clsx(
          'relative border-2 border-dashed rounded-brand transition-all duration-200 cursor-pointer overflow-hidden',
          isDragActive
            ? 'border-brand-rose bg-brand-rose/5'
            : 'border-brand-sky/40 hover:border-brand-rose/50',
          uploading && 'opacity-60 cursor-wait',
          !preview && aspectRatio
        )}
      >
        <input {...getInputProps()} />

        {preview ? (
          /* Image preview */
          <div className={clsx('relative group', aspectRatio)}>
            <Image
              src={preview}
              alt="Upload preview"
              fill
              className="object-cover"
              unoptimized={preview.startsWith('blob:')}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-brand-charcoal/0 group-hover:bg-brand-charcoal/40 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <span className="px-3 py-1.5 bg-white text-brand-charcoal text-xs font-medium rounded-brand">
                  Replace
                </span>
                <button
                  onClick={handleRemove}
                  className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-brand hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
            {/* Uploading spinner */}
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <svg className="w-6 h-6 animate-spin text-brand-rose" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center p-8">
            <svg
              className={clsx(
                'w-10 h-10 mb-3 transition-colors',
                isDragActive ? 'text-brand-rose' : 'text-brand-charcoal/20'
              )}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21zM8.25 8.25h.008v.008H8.25V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <p className="text-sm text-brand-charcoal/40 text-center">
              {isDragActive ? (
                <span className="text-brand-rose font-medium">Drop the file here</span>
              ) : (
                <>
                  <span className="text-brand-rose font-medium">Click to upload</span>
                  {' '}or drag and drop
                </>
              )}
            </p>
            {hint && (
              <p className="text-xs text-brand-charcoal/25 mt-1">{hint}</p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1.5">{error}</p>
      )}
    </div>
  );
}

// ----- Multi-image upload variant -----

type MultiProps = {
  values: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
  folder?: string;
  label?: string;
  maxImages?: number;
  className?: string;
};

export function MultiImageUpload({
  values,
  onChange,
  bucket = 'uploads',
  folder = 'images',
  label,
  maxImages = 6,
  className,
}: MultiProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (values.length + acceptedFiles.length > maxImages) return;

      setUploading(true);
      const newUrls: string[] = [];

      for (const file of acceptedFiles) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('bucket', bucket);
          formData.append('folder', folder);

          const res = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (res.ok) newUrls.push(data.url);
        } catch {
          // skip failed uploads
        }
      }

      onChange([...values, ...newUrls]);
      setUploading(false);
    },
    [values, onChange, bucket, folder, maxImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: maxImages - values.length,
    disabled: uploading || values.length >= maxImages,
  });

  const removeImage = (index: number) => {
    const updated = values.filter((_, i) => i !== index);
    onChange(updated);
  };

  const moveImage = (from: number, to: number) => {
    const updated = [...values];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium tracking-wider uppercase text-brand-charcoal/40 mb-2">
          {label} ({values.length}/{maxImages})
        </label>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Existing images */}
        {values.map((url, i) => (
          <div key={i} className="relative aspect-square group rounded-brand overflow-hidden border border-brand-sky/30">
            <Image src={url} alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-brand-charcoal/0 group-hover:bg-brand-charcoal/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
              {i > 0 && (
                <button
                  onClick={() => moveImage(i, i - 1)}
                  className="p-1 bg-white rounded text-brand-charcoal hover:bg-brand-blush"
                  title="Move left"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => removeImage(i)}
                className="p-1 bg-red-500 rounded text-white hover:bg-red-600"
                title="Remove"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {i < values.length - 1 && (
                <button
                  onClick={() => moveImage(i, i + 1)}
                  className="p-1 bg-white rounded text-brand-charcoal hover:bg-brand-blush"
                  title="Move right"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              )}
            </div>
            {i === 0 && (
              <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[9px] font-semibold bg-brand-rose text-white rounded">
                Main
              </span>
            )}
          </div>
        ))}

        {/* Add more button */}
        {values.length < maxImages && (
          <div
            {...getRootProps()}
            className={clsx(
              'aspect-square border-2 border-dashed rounded-brand flex flex-col items-center justify-center cursor-pointer transition-colors',
              isDragActive
                ? 'border-brand-rose bg-brand-rose/5'
                : 'border-brand-sky/30 hover:border-brand-rose/40',
              uploading && 'opacity-50 cursor-wait'
            )}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <svg className="w-5 h-5 animate-spin text-brand-rose" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                <svg className="w-5 h-5 text-brand-charcoal/20 mb-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="text-[10px] text-brand-charcoal/30">Add</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
