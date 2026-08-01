import { useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';

const TYPES = [
    { key: 'success', container: 'bg-green-50 text-green-700 border-green-200', icon: 'fa-circle-check' },
    { key: 'error', container: 'bg-red-50 text-red-700 border-red-200', icon: 'fa-circle-exclamation' },
    { key: 'warning', container: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'fa-triangle-exclamation' },
    { key: 'info', container: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'fa-circle-info' },
];

export default function FlashToast() {
    const flash = usePage().props.flash;
    const [toast, setToast] = useState(null);
    const timer = useRef(null);

    useEffect(() => {
        if (flash?.success || flash?.error || flash?.warning || flash?.info) {
            setToast(flash);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setToast(null), 5000);
        }
    }, [flash]);

    useEffect(() => () => clearTimeout(timer.current), []);

    if (!toast) return null;

    const type = TYPES.find((t) => toast[t.key]);
    const style = type || TYPES[3];

    return (
        <div className={`fixed right-4 top-20 z-[60] flex items-center gap-3 rounded-xl border px-5 py-3 shadow-lg ${style.container}`}>
            <i className={`fa-solid ${style.icon}`} />
            <span className="text-sm font-medium">{toast[style.key]}</span>
            <button type="button" onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100">
                <i className="fa-solid fa-xmark" />
            </button>
        </div>
    );
}
