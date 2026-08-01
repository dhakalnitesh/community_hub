import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SuperAdminLayout({ header, children, activeItem = '' }) {
    return <AuthenticatedLayout header={header}>{children}</AuthenticatedLayout>;
}
