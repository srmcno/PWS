'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AssetForm from '@/components/AssetForm';

export default function NewAssetPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/assets"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Asset</h1>
          <p className="text-gray-500">Register a new asset in your water system</p>
        </div>
      </div>

      <AssetForm mode="create" />
    </div>
  );
}
