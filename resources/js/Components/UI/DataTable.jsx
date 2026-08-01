import { useMemo, useRef, useState } from 'react';

function resolveValue(obj, path) {
    if (!path) return '';
    return String(path)
        .split('.')
        .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function stringify(v) {
    if (v == null) return '';
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
}

export default function DataTable({
    rows = [],
    columns = [],
    searchableKeys = [],
    defaultSort = { key: null, dir: 'asc' },
    pageSizeOptions = [10, 25, 50, 100],
    searchPlaceholder = 'Search…',
    emptyText = 'No records found.',
    rowKeyField = 'id',
    renderCell,
    className = '',
}) {
    const [search, setSearch] = useState('');
    const [pageSize, setPageSize] = useState(pageSizeOptions[0] || 10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sort, setSort] = useState({ ...defaultSort });
    const scrollRef = useRef(null);

    const normalizedColumns = useMemo(
        () =>
            columns.map((col) => ({
                sortable: false,
                width: null,
                align: null,
                ...col,
            })),
        [columns],
    );

    const filteredRows = useMemo(() => {
        const s = search.toLowerCase().trim();
        if (!s) return rows;

        const keys = searchableKeys.length
            ? searchableKeys
            : normalizedColumns.map((c) => c.key).filter(Boolean);

        return rows.filter((r) =>
            keys.some((k) => {
                const v = resolveValue(r, k);
                return v != null && String(v).toLowerCase().includes(s);
            }),
        );
    }, [rows, search, searchableKeys, normalizedColumns]);

    const sortedRows = useMemo(() => {
        const { key, dir } = sort;
        if (!key) return filteredRows;

        const copy = [...filteredRows];
        copy.sort((a, b) => {
            const av = resolveValue(a, key);
            const bv = resolveValue(b, key);

            if (av == null && bv == null) return 0;
            if (av == null) return dir === 'asc' ? -1 : 1;
            if (bv == null) return dir === 'asc' ? 1 : -1;

            if (typeof av === 'number' && typeof bv === 'number') {
                return dir === 'asc' ? av - bv : bv - av;
            }
            return dir === 'asc'
                ? String(av).localeCompare(String(bv))
                : String(bv).localeCompare(String(av));
        });
        return copy;
    }, [filteredRows, sort]);

    const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const pagedRows = sortedRows.slice((safePage - 1) * pageSize, safePage * pageSize);

    const startRecord = filteredRows.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const endRecord = Math.min(safePage * pageSize, filteredRows.length);

    const pagesToShow = useMemo(() => {
        const max = 5;
        const total = totalPages;
        const cur = safePage;

        let start = Math.max(1, cur - Math.floor(max / 2));
        let end = Math.min(total, start + max - 1);
        if (end - start + 1 < max) start = Math.max(1, end - max + 1);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [safePage, totalPages]);

    const handleSort = (col) => {
        if (!col.sortable || !col.key) return;
        setSort((prev) => {
            if (prev.key === col.key) {
                return { key: col.key, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
            }
            return { key: col.key, dir: 'asc' };
        });
    };

    const goTo = (p) => {
        if (p < 1 || p > totalPages) return;
        setCurrentPage(p);
        scrollRef.current?.scrollTo({ top: 0 });
    };

    const pageButtons = ['«', '‹', ...pagesToShow, '›', '»'];

    return (
        <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white ${className}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-3">
                <div className="relative w-full sm:w-72">
                    <i className="fa-solid fa-magnifying-glass pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-400" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder={searchPlaceholder}
                        className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500">Rows</label>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-indigo-500"
                    >
                        {pageSizeOptions.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div ref={scrollRef} className="max-h-[65vh] overflow-auto">
                <table className="dt-table w-full text-sm">
                    <thead className="sticky top-0 z-10 bg-slate-50">
                        <tr>
                            {normalizedColumns.map((col) => (
                                <th
                                    key={col.key || col.label}
                                    onClick={() => col.sortable && handleSort(col)}
                                    style={{
                                        width: col.width || 'auto',
                                        cursor: col.sortable ? 'pointer' : 'default',
                                    }}
                                    className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-slate-700"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span>{col.label}</span>
                                        {col.sortable && (
                                            <i
                                                className={`fa-solid ${
                                                    sort.key === col.key
                                                        ? sort.dir === 'asc'
                                                            ? 'fa-arrow-up'
                                                            : 'fa-arrow-down'
                                                        : 'fa-arrows-up-down'
                                                } text-[10px] text-slate-400`}
                                            />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {pagedRows.length === 0 ? (
                            <tr>
                                <td colSpan={normalizedColumns.length} className="px-4 py-10 text-center text-slate-500">
                                    {emptyText}
                                </td>
                            </tr>
                        ) : (
                            pagedRows.map((row, idx) => {
                                const rowKey = row[rowKeyField] != null ? row[rowKeyField] : idx;
                                return (
                                    <tr key={rowKey} className="align-middle transition-colors hover:bg-slate-50">
                                        {normalizedColumns.map((col, i) => (
                                            <td
                                                key={col.key || i}
                                                data-title={col.label}
                                                className="px-4 py-3"
                                            >
                                                {renderCell && renderCell(col.key, row, idx, i) !== undefined ? (
                                                    renderCell(col.key, row, idx, i)
                                                ) : (
                                                    <span
                                                        className="inline-block max-w-[360px] overflow-hidden text-ellipsis whitespace-nowrap"
                                                        title={stringify(resolveValue(row, col.key))}
                                                    >
                                                        {resolveValue(row, col.key)}
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer: pagination */}
            {filteredRows.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-4 py-2.5">
                    <div className="text-sm text-slate-500">
                        Showing <strong>{startRecord}</strong>–<strong>{endRecord}</strong> of{' '}
                        <strong>{filteredRows.length}</strong> records
                    </div>

                    <nav className="flex items-center gap-1">
                        {pageButtons.map((label, index) => {
                            const disabled = ['«', '‹'].includes(label)
                                ? safePage === 1
                                : ['›', '»'].includes(label)
                                  ? safePage === totalPages
                                  : false;
                            const isNav = ['«', '‹', '›', '»'].includes(label);
                            return (
                                <button
                                    key={`${label}-${index}`}
                                    type="button"
                                    disabled={isNav ? disabled : false}
                                    onClick={() => (isNav ? goTo(label === '«' ? 1 : label === '‹' ? safePage - 1 : label === '›' ? safePage + 1 : totalPages) : goTo(label))}
                                    className={`rounded-lg border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                                        !isNav && safePage === label
                                            ? 'border-indigo-600 bg-indigo-600 text-white'
                                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                    aria-label={
                                        label === '«' ? 'First' : label === '‹' ? 'Previous' : label === '›' ? 'Next' : label === '»' ? 'Last' : undefined
                                    }
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            )}
        </div>
    );
}
