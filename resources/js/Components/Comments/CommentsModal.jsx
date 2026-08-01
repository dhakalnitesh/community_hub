import { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import CommentSection from './CommentSection';

export default function CommentsModal({ grievance, comments, onClose }) {
  const overlayRef = useRef(null);

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

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose?.();
  }

  return (
    <div ref={overlayRef} onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b bg-slate-50 border-gray-200">
          <h2 className="text-sm font-bold text-gray-900">
            Comments — {grievance.reference_code}
          </h2>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <CommentSection grievance={grievance} comments={comments} />
        </div>
      </div>
    </div>
  );
}
