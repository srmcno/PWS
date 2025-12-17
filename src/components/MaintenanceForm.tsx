'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context';
import {
  MaintenanceTask,
  MaintenanceType,
  MaintenancePriority,
  MaintenanceStatus,
} from '@/types';

interface MaintenanceFormProps {
  task?: MaintenanceTask;
  mode: 'create' | 'edit';
}

export default function MaintenanceForm({ task, mode }: MaintenanceFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { assets, addMaintenanceTask, updateMaintenanceTask } = useApp();

  const preselectedAssetId = searchParams.get('assetId');
  const preselectedAsset = preselectedAssetId
    ? assets.find((a) => a.id === preselectedAssetId)
    : null;

  const [formData, setFormData] = useState({
    assetId: task?.assetId || preselectedAssetId || '',
    title: task?.title || '',
    description: task?.description || '',
    type: task?.type || ('preventive' as MaintenanceType),
    priority: task?.priority || ('medium' as MaintenancePriority),
    status: task?.status || ('scheduled' as MaintenanceStatus),
    scheduledDate: task?.scheduledDate || '',
    completedDate: task?.completedDate || '',
    assignedTo: task?.assignedTo || '',
    estimatedCost: task?.estimatedCost || 0,
    actualCost: task?.actualCost || 0,
    notes: task?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedAsset = assets.find((a) => a.id === formData.assetId);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.assetId) {
      newErrors.assetId = 'Please select an asset';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }
    if (formData.status === 'completed' && !formData.completedDate) {
      newErrors.completedDate = 'Completed date is required for completed tasks';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const taskData = {
      assetId: formData.assetId,
      assetName: selectedAsset?.name || '',
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      priority: formData.priority,
      status: formData.status,
      scheduledDate: formData.scheduledDate,
      completedDate: formData.completedDate || undefined,
      assignedTo: formData.assignedTo.trim() || undefined,
      estimatedCost: formData.estimatedCost || undefined,
      actualCost: formData.actualCost || undefined,
      notes: formData.notes.trim() || undefined,
    };

    if (mode === 'create') {
      addMaintenanceTask(taskData);
    } else if (task) {
      updateMaintenanceTask(task.id, taskData);
    }

    router.push('/maintenance');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const typeLabels: Record<MaintenanceType, string> = {
    preventive: 'Preventive Maintenance',
    corrective: 'Corrective Maintenance',
    emergency: 'Emergency Repair',
    inspection: 'Inspection',
    replacement: 'Replacement',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Asset Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Selection</h3>
        <div>
          <label htmlFor="assetId" className="label">
            Select Asset <span className="text-danger-500">*</span>
          </label>
          <select
            id="assetId"
            name="assetId"
            value={formData.assetId}
            onChange={handleChange}
            className={`select ${errors.assetId ? 'input-error' : ''}`}
          >
            <option value="">Choose an asset...</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name} - {asset.location}
              </option>
            ))}
          </select>
          {errors.assetId && (
            <p className="mt-1 text-sm text-danger-600">{errors.assetId}</p>
          )}
        </div>
      </div>

      {/* Task Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="label">
              Task Title <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g., Annual Pump Maintenance"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-danger-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="type" className="label">
              Maintenance Type <span className="text-danger-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="select"
            >
              {Object.entries(typeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="label">
              Priority <span className="text-danger-500">*</span>
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="label">
              Description <span className="text-danger-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`textarea ${errors.description ? 'input-error' : ''}`}
              placeholder="Describe the maintenance work to be performed..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-danger-600">{errors.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Scheduling */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduling</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="status" className="label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="select"
            >
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label htmlFor="scheduledDate" className="label">
              Scheduled Date <span className="text-danger-500">*</span>
            </label>
            <input
              type="date"
              id="scheduledDate"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              className={`input ${errors.scheduledDate ? 'input-error' : ''}`}
            />
            {errors.scheduledDate && (
              <p className="mt-1 text-sm text-danger-600">{errors.scheduledDate}</p>
            )}
          </div>

          {formData.status === 'completed' && (
            <div>
              <label htmlFor="completedDate" className="label">
                Completed Date <span className="text-danger-500">*</span>
              </label>
              <input
                type="date"
                id="completedDate"
                name="completedDate"
                value={formData.completedDate}
                onChange={handleChange}
                className={`input ${errors.completedDate ? 'input-error' : ''}`}
              />
              {errors.completedDate && (
                <p className="mt-1 text-sm text-danger-600">{errors.completedDate}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="assignedTo" className="label">
              Assigned To
            </label>
            <input
              type="text"
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="input"
              placeholder="e.g., In-house Crew, Contractor Name"
            />
          </div>
        </div>
      </div>

      {/* Cost Tracking */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="estimatedCost" className="label">
              Estimated Cost ($)
            </label>
            <input
              type="number"
              id="estimatedCost"
              name="estimatedCost"
              value={formData.estimatedCost}
              onChange={handleChange}
              min="0"
              className="input"
            />
          </div>

          {formData.status === 'completed' && (
            <div>
              <label htmlFor="actualCost" className="label">
                Actual Cost ($)
              </label>
              <input
                type="number"
                id="actualCost"
                name="actualCost"
                value={formData.actualCost}
                onChange={handleChange}
                min="0"
                className="input"
              />
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="textarea"
          placeholder="Add any additional notes, parts required, special instructions..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {mode === 'create' ? 'Schedule Maintenance' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
