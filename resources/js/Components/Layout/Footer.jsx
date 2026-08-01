export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white px-6 py-4">
            <div className="flex flex-col items-center justify-between gap-2 text-xs text-gray-500 sm:flex-row">
                <p>
                    &copy; {new Date().getFullYear()} EduVoice. Empowering education through technology.
                </p>
                <p className="text-gray-400">Anonymous Q&A · Mentorship · Classroom</p>
            </div>
        </footer>
    );
}
