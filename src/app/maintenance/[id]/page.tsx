'use client';

import { useApp } from '@/lib/context';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  User,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { formatDate, formatDateLong, formatCurrency, isDateOverdue, cn } from '@/lib/utils';
import { statusColors, priorityColors, MaintenanceStatus } from '@/types';

export default function MaintenanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { maintenanceTasks, deleteMaintenanceTask, updateMaintenanceTask, getAsset } = useApp();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const task = maintenanceTasks.find((t) => t.id === params.id);

  if (!task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Task not found</h2>
        <p className="text-gray-500 mt-2">The maintenance task you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/maintenance" className="btn-primary mt-4 inline-flex">
          Back to Maintenance
        </Link>
      </div>
    );
  }

  const asset = getAsset(task.assetId);

  // Check if overdue
  const isOverdue =
    task.status === 'scheduled' && isDateOverdue(task.scheduledDate);
  const displayStatus: MaintenanceStatus = isOverdue ? 'overdue' : task.status;

  const handleDelete = () => {
    deleteMaintenanceTask(task.id);
    router.push('/maintenance');
  };

  const handleMarkComplete = () => {
    updateMaintenanceTask(task.id, {
      status: 'completed',
      completedDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleMarkInProgress = () => {
    updateMaintenanceTask(task.id, {
      status: 'in_progress',
    });
  };

  const typeLabels: Record<string, string> = {
    preventive: 'Preventive Maintenance',
    corrective: 'Corrective Maintenance',
    emergency: 'Emergency Repair',
    inspection: 'Inspection',
    replacement: 'Replacement',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href="/maintenance"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
              <Badge className={statusColors[displayStatus]}>
                {displayStatus.replace('_', ' ')}
              </Badge>
              <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
            </div>
            <p className="text-gray-500 mt-1">{typeLabels[task.type]}</p>
          </div>
        </div>
        <div className="flex gap-2 ml-12 sm:ml-0">
          <Link href={`/maintenance/${task.id}/edit`} className="btn btn-secondary">
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

      {/* Alert for overdue */}
      {isOverdue && (
        <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-danger-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-danger-700">This task is overdue</p>
            <p className="text-sm text-danger-600 mt-1">
              Scheduled for {formatDateLong(task.scheduledDate)}. Please complete or
              reschedule this maintenance task.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Details */}
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600">{task.description}</p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Package className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Asset</p>
                    <Link
                      href={`/assets/${task.assetId}`}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {task.assetName}
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Scheduled Date</p>
                    <p className="font-medium text-gray-900">
                      {formatDateLong(task.scheduledDate)}
                    </p>
                  </div>
                </div>

                {task.completedDate && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-success-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-success-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Completed Date</p>
                      <p className="font-medium text-gray-900">
                        {formatDateLong(task.completedDate)}
                      </p>
                    </div>
                  </div>
                )}

                {task.assignedTo && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Assigned To</p>
                      <p className="font-medium text-gray-900">{task.assignedTo}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Cost Information */}
          {(task.estimatedCost || task.actualCost) && (
            <Card>
              <CardHeader>
                <CardTitle>Cost Information</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {task.estimatedCost && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <DollarSign className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estimated Cost</p>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(task.estimatedCost)}
                        </p>
                      </div>
                    </div>
                  )}

                  {task.actualCost && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-success-100 rounded-lg">
                        <DollarSign className="h-5 w-5 text-success-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Actual Cost</p>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(task.actualCost)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {task.estimatedCost && task.actualCost && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {task.actualCost <= task.estimatedCost ? (
                        <span className="text-success-600">
                          Under budget by{' '}
                          {formatCurrency(task.estimatedCost - task.actualCost)}
                        </span>
                      ) : (
                        <span className="text-danger-600">
                          Over budget by{' '}
                          {formatCurrency(task.actualCost - task.estimatedCost)}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* Notes */}
          {task.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600 whitespace-pre-wrap">{task.notes}</p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardBody className="space-y-2">
              {task.status === 'scheduled' && (
                <>
                  <button
                    onClick={handleMarkInProgress}
                    className="btn btn-primary w-full justify-center"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Start Work
                  </button>
                  <button
                    onClick={handleMarkComplete}
                    className="btn btn-success w-full justify-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </button>
                </>
              )}

              {task.status === 'in_progress' && (
                <button
                  onClick={handleMarkComplete}
                  className="btn btn-success w-full justify-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </button>
              )}

              {task.status === 'completed' && (
                <div className="p-3 bg-success-50 rounded-lg text-center">
                  <CheckCircle className="h-8 w-8 text-success-500 mx-auto mb-2" />
                  <p className="font-medium text-success-700">Task Completed</p>
                  <p className="text-sm text-success-600 mt-1">
                    {task.completedDate && formatDate(task.completedDate)}
                  </p>
                </div>
              )}

              <Link
                href={`/assets/${task.assetId}`}
                className="btn btn-secondary w-full justify-center"
              >
                <Package className="h-4 w-4 mr-2" />
                View Asset
              </Link>
            </CardBody>
          </Card>

          {/* Asset Summary */}
          {asset && (
            <Card>
              <CardHeader>
                <CardTitle>Asset Summary</CardTitle>
              </CardHeader>
              <CardBody>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-500">Asset Name</dt>
                    <dd className="font-medium text-gray-900">{asset.name}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Location</dt>
                    <dd className="text-gray-900">{asset.location}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Condition</dt>
                    <dd className="text-gray-900 capitalize">{asset.condition}</dd>
                  </div>
                </dl>
              </CardBody>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardBody>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Task ID</dt>
                  <dd className="text-gray-900 font-mono text-xs">{task.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Created</dt>
                  <dd className="text-gray-900">{formatDate(task.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Last Updated</dt>
                  <dd className="text-gray-900">{formatDate(task.updatedAt)}</dd>
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
        title="Delete Maintenance Task"
      >
        <div className="modal-body">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{task.title}</strong>? This
            action cannot be undone.
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
            Delete Task
          </button>
        </div>
      </Modal>
    </div>
  );
}
