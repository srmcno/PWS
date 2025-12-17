'use client';

import { useApp } from '@/lib/context';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Wrench,
  ClipboardCheck,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Modal from '@/components/ui/Modal';
import {
  formatCurrency,
  formatDate,
  formatDateLong,
  calculateAge,
  calculateLifePercentage,
  calculateRemainingLife,
} from '@/lib/utils';
import { categoryLabels, conditionTextColors, statusColors, priorityColors } from '@/types';

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getAsset, deleteAsset, maintenanceTasks, assessments } = useApp();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const age = calculateAge(asset.installDate);
  const lifeUsed = calculateLifePercentage(asset.installDate, asset.expectedLifespan);
  const remainingLife = calculateRemainingLife(asset.installDate, asset.expectedLifespan);

  // Get related maintenance tasks
  const relatedMaintenance = maintenanceTasks.filter((t) => t.assetId === asset.id);

  // Get related assessments
  const relatedAssessments = assessments.filter((a) => a.assetId === asset.id);

  const handleDelete = () => {
    deleteAsset(asset.id);
    router.push('/assets');
  };

  const getConditionBadgeVariant = (condition: string) => {
    switch (condition) {
      case 'excellent':
      case 'good':
        return 'success';
      case 'fair':
        return 'warning';
      case 'poor':
      case 'critical':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href="/assets"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
              <Badge variant={getConditionBadgeVariant(asset.condition)}>
                {asset.condition}
              </Badge>
            </div>
            <p className="text-gray-500 mt-1">{categoryLabels[asset.category]}</p>
          </div>
        </div>
        <div className="flex gap-2 ml-12 sm:ml-0">
          <Link
            href={`/assets/${asset.id}/edit`}
            className="btn btn-secondary"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-danger"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600">{asset.description}</p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{asset.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Install Date</p>
                    <p className="font-medium text-gray-900">
                      {formatDateLong(asset.installDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Replacement Cost</p>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(asset.replacementCost)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expected Lifespan</p>
                    <p className="font-medium text-gray-900">
                      {asset.expectedLifespan} years
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Equipment Details */}
          {(asset.manufacturer || asset.model || asset.serialNumber) && (
            <Card>
              <CardHeader>
                <CardTitle>Equipment Details</CardTitle>
              </CardHeader>
              <CardBody>
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {asset.manufacturer && (
                    <div>
                      <dt className="text-sm text-gray-500">Manufacturer</dt>
                      <dd className="font-medium text-gray-900">{asset.manufacturer}</dd>
                    </div>
                  )}
                  {asset.model && (
                    <div>
                      <dt className="text-sm text-gray-500">Model</dt>
                      <dd className="font-medium text-gray-900">{asset.model}</dd>
                    </div>
                  )}
                  {asset.serialNumber && (
                    <div>
                      <dt className="text-sm text-gray-500">Serial Number</dt>
                      <dd className="font-medium text-gray-900">{asset.serialNumber}</dd>
                    </div>
                  )}
                </dl>
              </CardBody>
            </Card>
          )}

          {/* Notes */}
          {asset.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600 whitespace-pre-wrap">{asset.notes}</p>
              </CardBody>
            </Card>
          )}

          {/* Maintenance History */}
          <Card>
            <CardHeader
              action={
                <Link
                  href={`/maintenance/new?assetId=${asset.id}`}
                  className="btn btn-sm btn-secondary"
                >
                  <Wrench className="h-3 w-3 mr-1" />
                  Schedule
                </Link>
              }
            >
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardBody>
              {relatedMaintenance.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No maintenance records for this asset
                </p>
              ) : (
                <div className="space-y-3">
                  {relatedMaintenance.map((task) => (
                    <Link
                      key={task.id}
                      href={`/maintenance/${task.id}`}
                      className="block p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(task.scheduledDate)}
                            {task.completedDate && ` • Completed ${formatDate(task.completedDate)}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={priorityColors[task.priority]}>
                            {task.priority}
                          </Badge>
                          <Badge className={statusColors[task.status]}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Assessment History */}
          <Card>
            <CardHeader
              action={
                <Link
                  href={`/assessments/new?assetId=${asset.id}`}
                  className="btn btn-sm btn-secondary"
                >
                  <ClipboardCheck className="h-3 w-3 mr-1" />
                  New Assessment
                </Link>
              }
            >
              <CardTitle>Assessment History</CardTitle>
            </CardHeader>
            <CardBody>
              {relatedAssessments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No assessments recorded for this asset
                </p>
              ) : (
                <div className="space-y-3">
                  {relatedAssessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatDate(assessment.assessmentDate)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Assessed by {assessment.assessor}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={conditionTextColors[assessment.previousCondition]}>
                            {assessment.previousCondition}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className={conditionTextColors[assessment.newCondition]}>
                            {assessment.newCondition}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{assessment.findings}</p>
                      {assessment.recommendations && (
                        <p className="text-sm text-primary-600 mt-2">
                          <strong>Recommendation:</strong> {assessment.recommendations}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Life Cycle Status */}
          <Card>
            <CardHeader>
              <CardTitle>Life Cycle Status</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Life Used</span>
                    <span className="font-medium text-gray-900">{lifeUsed}%</span>
                  </div>
                  <ProgressBar value={lifeUsed} />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">Current Age</p>
                    <p className="text-2xl font-bold text-gray-900">{age}</p>
                    <p className="text-sm text-gray-500">years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Remaining Life</p>
                    <p className="text-2xl font-bold text-gray-900">{remainingLife}</p>
                    <p className="text-sm text-gray-500">years (est.)</p>
                  </div>
                </div>

                {lifeUsed > 80 && (
                  <div className="p-3 bg-warning-50 rounded-lg border border-warning-200">
                    <div className="flex items-center gap-2 text-warning-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Nearing End of Life</span>
                    </div>
                    <p className="text-sm text-warning-600 mt-1">
                      Consider planning for replacement
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Inspection Status */}
          <Card>
            <CardHeader>
              <CardTitle>Inspection Status</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Last Inspection</p>
                  <p className="font-medium text-gray-900">
                    {asset.lastInspection
                      ? formatDate(asset.lastInspection)
                      : 'Not recorded'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Next Inspection</p>
                  <p className="font-medium text-gray-900">
                    {asset.nextInspection
                      ? formatDate(asset.nextInspection)
                      : 'Not scheduled'}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardBody className="space-y-2">
              <Link
                href={`/maintenance/new?assetId=${asset.id}`}
                className="btn btn-secondary w-full justify-center"
              >
                <Wrench className="h-4 w-4 mr-2" />
                Schedule Maintenance
              </Link>
              <Link
                href={`/assessments/new?assetId=${asset.id}`}
                className="btn btn-secondary w-full justify-center"
              >
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Record Assessment
              </Link>
            </CardBody>
          </Card>

          {/* Metadata */}
          <Card>
            <CardBody>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Asset ID</dt>
                  <dd className="text-gray-900 font-mono text-xs">{asset.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Created</dt>
                  <dd className="text-gray-900">{formatDate(asset.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Last Updated</dt>
                  <dd className="text-gray-900">{formatDate(asset.updatedAt)}</dd>
                </div>
              </dl>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Asset"
      >
        <div className="modal-body">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{asset.name}</strong>? This action
            cannot be undone and will also remove all related maintenance tasks.
          </p>
        </div>
        <div className="modal-footer">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete Asset
          </button>
        </div>
      </Modal>
    </div>
  );
}
