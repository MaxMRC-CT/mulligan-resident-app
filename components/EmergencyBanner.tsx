import Link from 'next/link';

export function EmergencyBanner() {
  return (
    <div className="bg-red-600 text-white px-4 py-3 text-center font-medium">
      <p className="text-sm">
        ⚠️ Not for emergencies. If you need immediate assistance, speak with staff directly.{' '}
        <Link href="/crisis-resources" className="underline hover:text-red-100">
          View crisis resources
        </Link>
      </p>
    </div>
  );
}
