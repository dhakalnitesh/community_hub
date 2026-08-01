import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function DeleteConfirmModal({ show, onClose, name = '', href, onConfirm }) {
    const handleConfirm = () => {
        if (href) {
            router.delete(href);
        } else if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            maxWidth="sm"
            title="Delete Confirmation"
            subtitle="This action cannot be undone."
        >
            <div className="px-4 py-5">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <i className="fa-solid fa-triangle-exclamation" />
                    </div>
                    <p className="text-sm text-slate-600">
                        Are you sure you want to delete <span className="font-semibold text-slate-900">{name}</span>? This action cannot be undone.
                    </p>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
}
