import SidebarContent from './SidebarContent';

export default function Sidebar({
    config = [],
    collapsed = false,
    isMobile = false,
    mobileOpen = false,
    onClose = () => {},
    onExpand = () => {},
}) {
    return (
        <>
            {/* Mobile drawer */}
            <aside
                className={`fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 lg:hidden ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <SidebarContent
                    config={config}
                    collapsed={false}
                    isMobile
                    onClose={onClose}
                    onExpand={onExpand}
                />
            </aside>

            {/* Desktop sidebar */}
            <aside
                className={`fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] flex-col border-r border-gray-200 bg-white transition-all duration-300 lg:flex ${
                    collapsed ? 'w-16' : 'w-64'
                }`}
            >
                <SidebarContent
                    config={config}
                    collapsed={collapsed}
                    isMobile={false}
                    onClose={onClose}
                    onExpand={onExpand}
                />
            </aside>
        </>
    );
}
