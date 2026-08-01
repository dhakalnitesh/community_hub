const sidebarConfig = {
    student: [
        {
            section: 'Main Menu',
            items: [
                { name: 'Dashboard', icon: 'fa-gauge-high', route: 'student.dashboard', fallback: '/student/dashboard', pattern: '/student/dashboard' },
                { name: 'My Subjects', icon: 'fa-book-open', route: 'student.subjects', fallback: '/student/mysubject', pattern: '/student/mysubject' },
            ],
        },
        {
            section: 'Learning',
            items: [
                { name: 'Assignments', icon: 'fa-clipboard-list', route: 'assignments.index', fallback: '/assignments', pattern: '/assignments' },
                { name: 'Resources', icon: 'fa-folder-open', route: 'resources.index', fallback: '/resources', pattern: '/resources' },
                { name: 'Announcements', icon: 'fa-bullhorn', route: 'announcements.index', fallback: '/announcements', pattern: '/announcements' },
            ],
        },
        {
            section: 'Community',
            items: [
                { name: 'Anonymous Q&A', icon: 'fa-comments', route: 'questions.index', fallback: '/questions', pattern: '/questions' },
                { name: 'Grievances', icon: 'fa-flag', route: 'grievances.feed', fallback: '/grievances/feed', pattern: '/grievances' },
                { name: 'Talent Showcase', icon: 'fa-trophy', route: 'projects.index', fallback: '/talent-showcase', pattern: '/talent-showcase' },
                { name: 'Mentorship', icon: 'fa-handshake', route: 'mentorship.index', fallback: '/mentor-board', pattern: '/mentor-board' },
            ],
        },
        {
            section: 'Account',
            items: [
                { name: 'Profile', icon: 'fa-user', route: 'profile.edit', fallback: '/profile', pattern: '/profile' },
            ],
        },
    ],

    teacher: [
        {
            section: 'Main Menu',
            items: [
                { name: 'Dashboard', icon: 'fa-gauge-high', route: 'dashboard', fallback: '/dashboard', pattern: '/dashboard' },
                { name: 'My Classes', icon: 'fa-school', route: 'classes.index', fallback: '/classes', pattern: '/classes' },
            ],
        },
        {
            section: 'Teaching',
            items: [
                { name: 'Assignments', icon: 'fa-clipboard-list', route: 'assignments.index', fallback: '/assignments', pattern: '/assignments' },
                { name: 'Resources', icon: 'fa-folder-open', route: 'resources.index', fallback: '/resources', pattern: '/resources' },
                { name: 'Announcements', icon: 'fa-bullhorn', route: 'announcements.index', fallback: '/announcements', pattern: '/announcements' },
            ],
        },
        {
            section: 'Community',
            items: [
                { name: 'Anonymous Q&A', icon: 'fa-comments', route: 'questions.index', fallback: '/questions', pattern: '/questions' },
                { name: 'Grievances', icon: 'fa-flag', route: 'grievances.feed', fallback: '/grievances/feed', pattern: '/grievances' },
                { name: 'Talent Showcase', icon: 'fa-trophy', route: 'projects.index', fallback: '/talent-showcase', pattern: '/talent-showcase' },
                { name: 'Mentorship', icon: 'fa-handshake', route: 'mentorship.index', fallback: '/mentor-board', pattern: '/mentor-board' },
            ],
        },
        {
            section: 'Account',
            items: [
                { name: 'Profile', icon: 'fa-user', route: 'profile.edit', fallback: '/profile', pattern: '/profile' },
            ],
        },
    ],

    institution_admin: [
        {
            section: 'Main Menu',
            items: [
                { name: 'Dashboard', icon: 'fa-gauge-high', route: 'admin.dashboard', fallback: '/admin', pattern: '/admin', exact: true },
                { name: 'Students', icon: 'fa-user-graduate', route: 'admin.enrollments.index', fallback: '/admin/enrollments', pattern: '/admin/enrollments' },
            ],
        },
        {
            section: 'Administration',
            items: [
                { name: 'Semesters', icon: 'fa-layer-group', route: 'admin.semesters.index', fallback: '/admin/semesters', pattern: '/admin/semesters' },
                { name: 'Subjects', icon: 'fa-book', route: 'admin.subjects.index', fallback: '/admin/subjects', pattern: '/admin/subjects' },
                { name: 'Assignments', icon: 'fa-clipboard-list', route: 'assignments.index', fallback: '/assignments', pattern: '/assignments' },
                { name: 'Resources', icon: 'fa-folder-open', route: 'resources.index', fallback: '/resources', pattern: '/resources' },
                { name: 'Announcements', icon: 'fa-bullhorn', route: 'announcements.index', fallback: '/announcements', pattern: '/announcements' },
            ],
        },
        {
            section: 'Communication',
            items: [
                { name: 'Anonymous Q&A', icon: 'fa-comments', route: 'questions.index', fallback: '/questions', pattern: '/questions' },
                { name: 'Grievances', icon: 'fa-flag', route: 'admin.grievances.index', fallback: '/admin/grievances', pattern: '/admin/grievances' },
                { name: 'Moderation', icon: 'fa-gavel', route: 'admin.moderation', fallback: '/admin/moderation', pattern: '/admin/moderation' },
                { name: 'Talent Showcase', icon: 'fa-trophy', route: 'projects.index', fallback: '/talent-showcase', pattern: '/talent-showcase' },
                { name: 'Mentorship', icon: 'fa-handshake', route: 'mentorship.index', fallback: '/mentor-board', pattern: '/mentor-board' },
            ],
        },
        {
            section: 'Account',
            items: [
                { name: 'Profile', icon: 'fa-user', route: 'profile.edit', fallback: '/profile', pattern: '/profile' },
            ],
        },
    ],

    super_admin: [
        {
            section: 'Main Menu',
            items: [
                { name: 'Dashboard', icon: 'fa-gauge-high', route: 'dashboard', fallback: '/dashboard', pattern: '/dashboard' },
            ],
        },
        {
            section: 'Tenant Management',
            items: [
                { name: 'Institutions', icon: 'fa-building-columns', route: 'admin.institutions', fallback: '/admin/institutions', pattern: '/admin/institutions' },
                { name: 'Institution Admins', icon: 'fa-user-shield', route: 'admin.institution_admins', fallback: '/admin/institution_admins', pattern: '/admin/institution_admins' },
                { name: 'Users', icon: 'fa-users', route: 'admin.users', fallback: '/admin/users', pattern: '/admin/users' },
                { name: 'Roles & Permissions', icon: 'fa-shield-halved', route: 'admin.roles', fallback: '/admin/roles', pattern: '/admin/roles' },
            ],
        },
        {
            section: 'Platform Operations',
            items: [
                { name: 'Analytics', icon: 'fa-chart-line', route: 'admin.analytics', fallback: '/admin/analytics', pattern: '/admin/analytics' },
                { name: 'Reports', icon: 'fa-file-lines', route: 'admin.reports', fallback: '/admin/reports', pattern: '/admin/reports' },
                { name: 'Monitoring', icon: 'fa-heart-pulse', route: 'admin.monitoring', fallback: '/admin/monitoring', pattern: '/admin/monitoring' },
                { name: 'User Activity', icon: 'fa-user-clock', route: 'admin.useractivity', fallback: '/admin/useractivity', pattern: '/admin/useractivity' },
                { name: 'Announcements', icon: 'fa-bullhorn', route: 'announcements.index', fallback: '/announcements', pattern: '/announcements' },
            ],
        },
        {
            section: 'Community',
            items: [
                { name: 'Anonymous Q&A', icon: 'fa-comments', route: 'questions.index', fallback: '/questions', pattern: '/questions' },
                { name: 'Talent Showcase', icon: 'fa-trophy', route: 'projects.index', fallback: '/talent-showcase', pattern: '/talent-showcase' },
                { name: 'Mentorship', icon: 'fa-handshake', route: 'mentorship.index', fallback: '/mentor-board', pattern: '/mentor-board' },
            ],
        },
        {
            section: 'Support & Security',
            items: [
                { name: 'Grievances', icon: 'fa-flag', route: 'admin.grievances.index', fallback: '/admin/grievances', pattern: '/admin/grievances' },
                { name: 'Moderation', icon: 'fa-gavel', route: 'admin.moderation', fallback: '/admin/moderation', pattern: '/admin/moderation' },
                { name: 'Spam Logs', icon: 'fa-bug-slash', route: 'admin.spam-logs', fallback: '/admin/spam-logs', pattern: '/admin/spam-logs' },
            ],
        },
        {
            section: 'Account',
            items: [
                { name: 'Profile', icon: 'fa-user', route: 'profile.edit', fallback: '/profile', pattern: '/profile' },
            ],
        },
    ],
};

export default sidebarConfig;
