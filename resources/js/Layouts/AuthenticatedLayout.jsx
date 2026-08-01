import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

import Navbar from '@/Components/Layout/Navbar';
import Sidebar from '@/Components/Layout/Sidebar';
import Footer from '@/Components/Layout/Footer';
import FlashToast from '@/Components/Layout/FlashToast';
import sidebarConfig from '@/Components/Layout/SidebarConfig';

const NAVBAR_HEIGHT = 64;
const SIDEBAR_EXPANDED = 256;
const SIDEBAR_COLLAPSED = 64;

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const role = user?.role || 'student';

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 1024,
    );

    const isMobile = windowWidth < 1024;

    const toggleSidebar = () => {
        if (isMobile) {
            setMobileSidebarOpen((prev) => !prev);
        } else {
            setSidebarCollapsed((prev) => !prev);
        }
    };

    const closeMobileSidebar = () => setMobileSidebarOpen(false);

    useEffect(() => {
        document.body.style.overflow = mobileSidebarOpen && isMobile ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileSidebarOpen, isMobile]);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWindowWidth(width);
            if (width >= 1024) {
                setMobileSidebarOpen(false);
            } else {
                setSidebarCollapsed(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') setMobileSidebarOpen(false);
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;
    const config = sidebarConfig[role] || [];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar
                collapsed={sidebarCollapsed}
                mobileOpen={mobileSidebarOpen}
                onToggleSidebar={toggleSidebar}
            />

            <Sidebar
                config={config}
                collapsed={sidebarCollapsed}
                isMobile={isMobile}
                mobileOpen={mobileSidebarOpen}
                onClose={closeMobileSidebar}
                onExpand={() => setSidebarCollapsed(false)}
            />

            {mobileSidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={closeMobileSidebar}
                />
            )}

            <FlashToast />

            <div
                className="flex min-h-screen flex-col transition-all duration-300 ease-in-out"
                style={{
                    paddingTop: `${NAVBAR_HEIGHT}px`,
                    paddingLeft: `${sidebarWidth}px`,
                }}
            >
                <main className="flex-1">
                    <div className="p-4 sm:p-6">
                        {header && (
                            <div className="mb-6 flex items-center justify-between gap-4">
                                {typeof header === 'string' ? (
                                    <h1 className="text-2xl font-bold text-slate-800">{header}</h1>
                                ) : (
                                    header
                                )}
                            </div>
                        )}
                        {children}
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}
