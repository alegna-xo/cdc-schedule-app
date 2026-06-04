import AdminSidebar from '@/features/admin/AdminSidebar';
import colors from '@/styles/colors';

/**
 * AdminLayout
 * Wraps every page under /admin/** with the shared sidebar.
 *
 * AdminSidebar is rendered once here — not in each individual page.
 * Next.js App Router automatically applies this layout to:
 *   /admin
 *   /admin/upload
 *   /admin/schedule
 *   /admin/schedule/[id]
 *   /admin/employees
 *
 * Phase 2: Add auth check here — redirect non-admin users to /login.
 */
export default function AdminLayout({ children }) {
  return (
    <div style={styles.shell}>
      <AdminSidebar />
      <div style={styles.main}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  shell: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    background: colors.offWhite,
  },
  main: {
    flex: 1,
    overflowY: 'auto',
  },
};
