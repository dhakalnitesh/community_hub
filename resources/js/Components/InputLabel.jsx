export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
