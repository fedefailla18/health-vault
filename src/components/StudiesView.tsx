import React, { useState, useMemo } from 'react';
import { 
  FolderOpen, 
  FileText, 
  Image as ImageIcon, 
  Search, 
  Filter, 
  Calendar, 
  HardDrive, 
  Info 
} from 'lucide-react';
import { StudyRecord } from '../types';

interface StudiesViewProps {
  studies: StudyRecord[];
}

export const StudiesView: React.FC<StudiesViewProps> = ({ studies }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['ALL', 'MRI', 'Bloodwork', 'Reports'];

  const filteredStudies = useMemo(() => {
    return studies.filter(s => {
      const matchCat = selectedCategory === 'ALL' || s.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchQuery = s.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [studies, selectedCategory, searchQuery]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'mri':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'bloodwork':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'reports':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <FolderOpen size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Medical Studies & Raw Documents</h2>
            <p className="text-xs text-slate-400">Diagnostic imaging (MRI/X-Ray), official bloodwork lab sheets, and clinical reports.</p>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search studies..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700 w-48"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter size={14} className="text-slate-400" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-xs text-white cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-slate-900">
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Directory Guidance Callout */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <Info size={18} className="text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Local-First Document Repository:</span> Drop medical imaging (DICOM/PDF/JPG) into{' '}
          <code className="text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono">studies/MRI/</code>,{' '}
          official lab sheets into{' '}
          <code className="text-indigo-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono">studies/Bloodwork/</code>, and doctor notes into{' '}
          <code className="text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono">studies/Reports/</code>. The UI automatically indexes them.
        </div>
      </div>

      {/* Studies Grid */}
      {filteredStudies.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/20 border border-slate-800/60 text-center space-y-3">
          <FolderOpen size={36} className="mx-auto text-slate-600" />
          <h4 className="text-sm font-semibold text-slate-300">No study documents found</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Place your MRI scans, lab report PDFs, and clinical findings into the respective <code className="text-slate-400">studies/</code> folders.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudies.map((study, idx) => {
            const isImage = /\.(jpe?g|png|webp|gif|svg)$/i.test(study.fileName);
            const FileIcon = isImage ? ImageIcon : FileText;

            return (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-3 shadow-sm group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 group-hover:text-emerald-400 transition-colors">
                      <FileIcon size={20} />
                    </div>
                    <div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryColor(study.category)}`}>
                        {study.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-white truncate group-hover:text-emerald-300 transition-colors" title={study.fileName}>
                    {study.fileName}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                    <span className="flex items-center gap-1 font-mono">
                      <HardDrive size={11} />
                      {formatFileSize(study.sizeBytes)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(study.modifiedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
