'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/context';
import MaintenanceForm from '@/components/MaintenanceForm';
import { Suspense } from 'react';

function EditMaintenanceContent() {
  const params = useParams();
  const { maintenanceTasks } = useApp();
  const task = maintenanceTasks.find((t) => t.id === params.id);

  if (!task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Task not found</h2>
        <p className="text-gray-500 mt-2">
          The maintenance task you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/maintenance" className="btn-primary mt-4 inline-flex">
          Back to Maintenance
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/maintenance/${task.id}`}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Maintenance Task</h1>
          <p className="text-gray-500">{task.title}</p>
        </div>
      </div>

      <MaintenanceForm task={task} mode="edit" />
    </div>
  );
}

export default function EditMaintenancePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditMaintenanceContent />
    </Suspense>
  );
}
