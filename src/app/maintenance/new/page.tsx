'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import MaintenanceForm from '@/components/MaintenanceForm';

function MaintenanceFormWrapper() {
  return <MaintenanceForm mode="create" />;
}

export default function NewMaintenancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/maintenance"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Maintenance</h1>
          <p className="text-gray-500">Create a new maintenance task</p>
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <MaintenanceFormWrapper />
      </Suspense>
    </div>
  );
}
