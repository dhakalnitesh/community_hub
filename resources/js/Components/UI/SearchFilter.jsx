export default function SearchFilter({ value = '', onChange = () => {}, placeholder = 'Search…', className = '' }) {
    return (
        <div className={`relative w-full ${className}`}>
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-400" />
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
        </div>
    );
}
