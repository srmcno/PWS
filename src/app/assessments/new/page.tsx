'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import AssessmentForm from '@/components/AssessmentForm';

function AssessmentFormWrapper() {
  return <AssessmentForm />;
}

export default function NewAssessmentPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/assessments"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Assessment</h1>
          <p className="text-gray-500">Record a condition assessment for an asset</p>
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <AssessmentFormWrapper />
      </Suspense>
    </div>
  );
}
