import { router } from '@inertiajs/react';

function toPath(url) {
    if (!url) return null;
    try {
        return new URL(url).pathname + new URL(url).search;
    } catch (e) {
        return url;
    }
}

export default function TablePagination({ links = [], from = 0, to = 0, total = 0, preserveScroll = true }) {
    if (!links || links.length === 0) return null;

    return (
        <div className="flex flex-col gap-4 border-t border-gray-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{from || 0}</span> to <span className="font-medium">{to || 0}</span> of{' '}
                <span className="font-medium">{total}</span> results
            </div>
            <div className="flex flex-wrap items-center gap-1">
                {links.map((link, index) => {
                    const active = link.active;
                    const disabled = !link.url;
                    return (
                        <button
                            key={`${link.label}-${index}`}
                            type="button"
                            disabled={disabled}
                            onClick={() => link.url && router.visit(toPath(link.url), { preserveScroll })}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                                active
                                    ? 'border-indigo-600 bg-indigo-600 text-white'
                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        />
                    );
                })}
            </div>
        </div>
    );
}
