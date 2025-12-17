'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import { Asset, AssetCategory, AssetCondition, categoryLabels } from '@/types';

interface AssetFormProps {
  asset?: Asset;
  mode: 'create' | 'edit';
}

export default function AssetForm({ asset, mode }: AssetFormProps) {
  const router = useRouter();
  const { addAsset, updateAsset } = useApp();

  const [formData, setFormData] = useState({
    name: asset?.name || '',
    category: asset?.category || 'other' as AssetCategory,
    description: asset?.description || '',
    location: asset?.location || '',
    installDate: asset?.installDate || '',
    expectedLifespan: asset?.expectedLifespan || 20,
    condition: asset?.condition || 'good' as AssetCondition,
    replacementCost: asset?.replacementCost || 0,
    manufacturer: asset?.manufacturer || '',
    model: asset?.model || '',
    serialNumber: asset?.serialNumber || '',
    notes: asset?.notes || '',
    lastInspection: asset?.lastInspection || '',
    nextInspection: asset?.nextInspection || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.installDate) {
      newErrors.installDate = 'Install date is required';
    }
    if (formData.expectedLifespan <= 0) {
      newErrors.expectedLifespan = 'Expected lifespan must be greater than 0';
    }
    if (formData.replacementCost < 0) {
      newErrors.replacementCost = 'Replacement cost cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const assetData = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      location: formData.location.trim(),
      installDate: formData.installDate,
      expectedLifespan: formData.expectedLifespan,
      condition: formData.condition,
      replacementCost: formData.replacementCost,
      manufacturer: formData.manufacturer.trim() || undefined,
      model: formData.model.trim() || undefined,
      serialNumber: formData.serialNumber.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      lastInspection: formData.lastInspection || null,
      nextInspection: formData.nextInspection || null,
    };

    if (mode === 'create') {
      addAsset(assetData);
    } else if (asset) {
      updateAsset(asset.id, assetData);
    }

    router.push('/assets');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="name" className="label">
              Asset Name <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g., Main Well #1"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-danger-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="label">
              Category <span className="text-danger-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select"
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="condition" className="label">
              Current Condition <span className="text-danger-500">*</span>
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="select"
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="critical">Critical</option>
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
              placeholder="Describe the asset, its purpose, and specifications..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-danger-600">{errors.description}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="location" className="label">
              Location <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`input ${errors.location ? 'input-error' : ''}`}
              placeholder="e.g., North Section, Well Field A"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-danger-600">{errors.location}</p>
            )}
          </div>
        </div>
      </div>

      {/* Life Cycle Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Life Cycle Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="installDate" className="label">
              Install Date <span className="text-danger-500">*</span>
            </label>
            <input
              type="date"
              id="installDate"
              name="installDate"
              value={formData.installDate}
              onChange={handleChange}
              className={`input ${errors.installDate ? 'input-error' : ''}`}
            />
            {errors.installDate && (
              <p className="mt-1 text-sm text-danger-600">{errors.installDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="expectedLifespan" className="label">
              Expected Lifespan (years) <span className="text-danger-500">*</span>
            </label>
            <input
              type="number"
              id="expectedLifespan"
              name="expectedLifespan"
              value={formData.expectedLifespan}
              onChange={handleChange}
              min="1"
              className={`input ${errors.expectedLifespan ? 'input-error' : ''}`}
            />
            {errors.expectedLifespan && (
              <p className="mt-1 text-sm text-danger-600">{errors.expectedLifespan}</p>
            )}
          </div>

          <div>
            <label htmlFor="replacementCost" className="label">
              Replacement Cost ($) <span className="text-danger-500">*</span>
            </label>
            <input
              type="number"
              id="replacementCost"
              name="replacementCost"
              value={formData.replacementCost}
              onChange={handleChange}
              min="0"
              className={`input ${errors.replacementCost ? 'input-error' : ''}`}
            />
            {errors.replacementCost && (
              <p className="mt-1 text-sm text-danger-600">{errors.replacementCost}</p>
            )}
          </div>
        </div>
      </div>

      {/* Equipment Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Details</h3>
        <p className="text-sm text-gray-500 mb-4">Optional equipment identification information</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="manufacturer" className="label">
              Manufacturer
            </label>
            <input
              type="text"
              id="manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Goulds Pumps"
            />
          </div>

          <div>
            <label htmlFor="model" className="label">
              Model
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="input"
              placeholder="e.g., VIT-200"
            />
          </div>

          <div>
            <label htmlFor="serialNumber" className="label">
              Serial Number
            </label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              className="input"
              placeholder="e.g., GP2010-4521"
            />
          </div>
        </div>
      </div>

      {/* Inspection Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inspection Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="lastInspection" className="label">
              Last Inspection Date
            </label>
            <input
              type="date"
              id="lastInspection"
              name="lastInspection"
              value={formData.lastInspection}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="nextInspection" className="label">
              Next Inspection Due
            </label>
            <input
              type="date"
              id="nextInspection"
              name="nextInspection"
              value={formData.nextInspection}
              onChange={handleChange}
              className="input"
            />
          </div>
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
          placeholder="Add any additional notes, observations, or maintenance history..."
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
          {mode === 'create' ? 'Create Asset' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
