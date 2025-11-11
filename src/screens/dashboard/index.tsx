import DashboardLayout from './DashboardLayout';

/**
 * Dashboard page component.
 */
const Dashboard = () => {
  const sidebarItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Welcome to your admin dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
    </DashboardLayout>
  );
};

export default Dashboard;
