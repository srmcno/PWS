'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/context';
import AssetForm from '@/components/AssetForm';

export default function EditAssetPage() {
  const params = useParams();
  const { getAsset } = useApp();
  const asset = getAsset(params.id as string);

  if (!asset) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Asset not found</h2>
        <p className="text-gray-500 mt-2">The asset you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/assets" className="btn-primary mt-4 inline-flex">
          Back to Assets
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/assets/${asset.id}`}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Asset</h1>
          <p className="text-gray-500">{asset.name}</p>
        </div>
      </div>

      <AssetForm asset={asset} mode="edit" />
    </div>
  );
}
