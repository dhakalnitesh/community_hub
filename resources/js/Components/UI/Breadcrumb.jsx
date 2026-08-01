import { Link } from '@inertiajs/react';

export default function Breadcrumb({ items = [] }) {
    if (!items.length) return null;

    return (
        <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={index} className="flex items-center gap-1.5">
                            {item.href && !isLast ? (
                                <Link href={item.href} className="font-medium text-indigo-600 hover:text-indigo-700">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className={isLast ? 'font-semibold text-gray-900' : ''}>{item.label}</span>
                            )}
                            {!isLast && <i className="fa-solid fa-chevron-right text-[10px] text-gray-300" />}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
