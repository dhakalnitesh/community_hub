import { useEffect } from 'react';

export default function UpvotersModal({ upvoters = [], onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[70vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b bg-slate-50 border-gray-200">
          <h2 className="text-sm font-bold text-gray-900">Reactions ({upvoters.length})</h2>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {upvoters.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">No reactions yet</p>
          ) : upvoters.map((u, i) => (
            <div key={u.id || i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-bold text-red-600 shrink-0">
                {u.name?.[0]?.toUpperCase() || '?'}
              </div>
              <span className="text-xs font-medium text-gray-700">{u.name || 'Anonymous'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
