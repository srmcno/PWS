'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context';
import { AssetCondition } from '@/types';

export default function AssessmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { assets, addAssessment } = useApp();

  const preselectedAssetId = searchParams.get('assetId');
  const preselectedAsset = preselectedAssetId
    ? assets.find((a) => a.id === preselectedAssetId)
    : null;

  const [formData, setFormData] = useState({
    assetId: preselectedAssetId || '',
    assessmentDate: new Date().toISOString().split('T')[0],
    newCondition: preselectedAsset?.condition || ('good' as AssetCondition),
    assessor: '',
    findings: '',
    recommendations: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedAsset = assets.find((a) => a.id === formData.assetId);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.assetId) {
      newErrors.assetId = 'Please select an asset';
    }
    if (!formData.assessmentDate) {
      newErrors.assessmentDate = 'Assessment date is required';
    }
    if (!formData.assessor.trim()) {
      newErrors.assessor = 'Assessor name is required';
    }
    if (!formData.findings.trim()) {
      newErrors.findings = 'Findings are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!selectedAsset) {
      return;
    }

    addAssessment({
      assetId: formData.assetId,
      assetName: selectedAsset.name,
      assessmentDate: formData.assessmentDate,
      previousCondition: selectedAsset.condition,
      newCondition: formData.newCondition,
      assessor: formData.assessor.trim(),
      findings: formData.findings.trim(),
      recommendations: formData.recommendations.trim() || undefined,
    });

    router.push('/assessments');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assetId = e.target.value;
    const asset = assets.find((a) => a.id === assetId);
    setFormData((prev) => ({
      ...prev,
      assetId,
      newCondition: asset?.condition || 'good',
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Asset Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Selection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="assetId" className="label">
              Select Asset <span className="text-danger-500">*</span>
            </label>
            <select
              id="assetId"
              name="assetId"
              value={formData.assetId}
              onChange={handleAssetChange}
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

          {selectedAsset && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Current Condition</p>
              <p className="font-medium text-gray-900 capitalize mt-1">
                {selectedAsset.condition}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Assessment Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="assessmentDate" className="label">
              Assessment Date <span className="text-danger-500">*</span>
            </label>
            <input
              type="date"
              id="assessmentDate"
              name="assessmentDate"
              value={formData.assessmentDate}
              onChange={handleChange}
              className={`input ${errors.assessmentDate ? 'input-error' : ''}`}
            />
            {errors.assessmentDate && (
              <p className="mt-1 text-sm text-danger-600">{errors.assessmentDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="assessor" className="label">
              Assessor Name <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              id="assessor"
              name="assessor"
              value={formData.assessor}
              onChange={handleChange}
              className={`input ${errors.assessor ? 'input-error' : ''}`}
              placeholder="e.g., John Smith, Tank Inspection Services"
            />
            {errors.assessor && (
              <p className="mt-1 text-sm text-danger-600">{errors.assessor}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="newCondition" className="label">
              New Condition Assessment <span className="text-danger-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['excellent', 'good', 'fair', 'poor', 'critical'] as AssetCondition[]).map(
                (condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, newCondition: condition }))
                    }
                    className={`p-3 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                      formData.newCondition === condition
                        ? condition === 'excellent' || condition === 'good'
                          ? 'border-success-500 bg-success-50 text-success-700'
                          : condition === 'fair'
                          ? 'border-warning-500 bg-warning-50 text-warning-700'
                          : 'border-danger-500 bg-danger-50 text-danger-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {condition}
                  </button>
                )
              )}
            </div>
            {selectedAsset && formData.newCondition !== selectedAsset.condition && (
              <p className="mt-2 text-sm text-primary-600">
                Condition will change from{' '}
                <span className="font-medium capitalize">{selectedAsset.condition}</span> to{' '}
                <span className="font-medium capitalize">{formData.newCondition}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Findings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Findings</h3>
        <div className="space-y-6">
          <div>
            <label htmlFor="findings" className="label">
              Assessment Findings <span className="text-danger-500">*</span>
            </label>
            <textarea
              id="findings"
              name="findings"
              value={formData.findings}
              onChange={handleChange}
              rows={5}
              className={`textarea ${errors.findings ? 'input-error' : ''}`}
              placeholder="Describe what was observed during the assessment. Include details about the asset's physical condition, performance, any defects or issues found..."
            />
            {errors.findings && (
              <p className="mt-1 text-sm text-danger-600">{errors.findings}</p>
            )}
          </div>

          <div>
            <label htmlFor="recommendations" className="label">
              Recommendations
            </label>
            <textarea
              id="recommendations"
              name="recommendations"
              value={formData.recommendations}
              onChange={handleChange}
              rows={3}
              className="textarea"
              placeholder="Optional: Provide recommendations for maintenance, repairs, or other actions based on the findings..."
            />
          </div>
        </div>
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
          Save Assessment
        </button>
      </div>
    </form>
  );
}
