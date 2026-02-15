import { requireAuth } from '@/lib/auth';
import { EmergencyBanner } from '@/components/EmergencyBanner';
import { Navigation } from '@/components/Navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <EmergencyBanner />
      <Navigation role={session.role} displayName={session.displayName} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
