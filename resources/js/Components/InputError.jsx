export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'mt-1 text-xs text-red-600 ' + className}
        >
            {message}
        </p>
    ) : null;
}
