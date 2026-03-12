import React, { useRef, useState } from 'react';
import { Upload, X, CheckCircle, AlertTriangle, FileText, Download } from 'lucide-react';
import { Button } from './Button';

export interface CsvImportResult<T> {
  valid: T[];
  errors: { row: number; message: string }[];
}

interface CsvImportModalProps<T> {
  title: string;
  description: string;
  templateHeaders: string[];
  templateRows: string[][];
  parseRow: (row: Record<string, string>, index: number) => T | { error: string };
  onImport: (records: T[]) => void;
  onClose: () => void;
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ''; });
    return row;
  });
}

function downloadTemplate(headers: string[], rows: string[][], filename: string) {
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function CsvImportModal<T>({
  title,
  description,
  templateHeaders,
  templateRows,
  parseRow,
  onImport,
  onClose,
}: CsvImportModalProps<T>) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ valid: T[]; errors: { row: number; message: string }[] } | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const processFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseCsv(text);
      const valid: T[] = [];
      const errors: { row: number; message: string }[] = [];
      rows.forEach((row, i) => {
        const result = parseRow(row, i);
        if (result && typeof result === 'object' && 'error' in (result as object)) {
          errors.push({ row: i + 2, message: (result as { error: string }).error });
        } else {
          valid.push(result as T);
        }
      });
      setPreview({ valid, errors });
    };
    reader.readAsText(file);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Template download */}
          <div className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <FileText size={15} className="text-slate-400" />
              Download the CSV template to get started
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={<Download size={13} />}
              onClick={() => downloadTemplate(templateHeaders, templateRows, `${title.toLowerCase().replace(/\s+/g, '-')}-template.csv`)}
            >
              Template
            </Button>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
            }`}
          >
            <Upload size={24} className={`mx-auto mb-2 ${dragging ? 'text-blue-500' : 'text-slate-400'}`} />
            <p className="text-sm font-medium text-slate-700">{fileName ?? 'Drop a CSV file here, or click to browse'}</p>
            <p className="text-xs text-slate-400 mt-1">Accepts .csv files only</p>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
          </div>

          {/* Preview */}
          {preview && (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                  <CheckCircle size={14} />
                  <span className="font-medium">{preview.valid.length} rows ready to import</span>
                </div>
                {preview.errors.length > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                    <AlertTriangle size={14} />
                    <span className="font-medium">{preview.errors.length} rows skipped</span>
                  </div>
                )}
              </div>

              {preview.errors.length > 0 && (
                <div className="bg-amber-50 rounded-lg border border-amber-200 p-3 max-h-28 overflow-y-auto">
                  {preview.errors.map(e => (
                    <p key={e.row} className="text-xs text-amber-700">Row {e.row}: {e.message}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
          <Button variant="secondary" size="md" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            size="md"
            disabled={!preview || preview.valid.length === 0}
            onClick={() => { if (preview) { onImport(preview.valid); onClose(); } }}
          >
            Import {preview && preview.valid.length > 0 ? `${preview.valid.length} records` : ''}
          </Button>
        </div>
      </div>
    </div>
  );
}
