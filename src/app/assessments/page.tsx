'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/context';
import Link from 'next/link';
import {
  Plus,
  Search,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, cn } from '@/lib/utils';
import { ConditionAssessment, AssetCondition, conditionTextColors } from '@/types';

export default function AssessmentsPage() {
  const { assessments, assets } = useApp();
  const [search, setSearch] = useState('');

  const filteredAssessments = useMemo(() => {
    let result = [...assessments];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (assessment) =>
          assessment.assetName.toLowerCase().includes(searchLower) ||
          assessment.assessor.toLowerCase().includes(searchLower) ||
          assessment.findings.toLowerCase().includes(searchLower)
      );
    }

    // Sort by date (newest first)
    result.sort(
      (a, b) =>
        new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime()
    );

    return result;
  }, [assessments, search]);

  // Group assessments by month
  const groupedAssessments = useMemo(() => {
    const groups: Record<string, ConditionAssessment[]> = {};

    filteredAssessments.forEach((assessment) => {
      const date = new Date(assessment.assessmentDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(assessment);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, items]) => ({
        key,
        label: new Date(items[0].assessmentDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        }),
        items,
      }));
  }, [filteredAssessments]);

  const getConditionChange = (prev: AssetCondition, next: AssetCondition) => {
    const order = ['critical', 'poor', 'fair', 'good', 'excellent'];
    const prevIndex = order.indexOf(prev);
    const nextIndex = order.indexOf(next);

    if (nextIndex > prevIndex) return 'improved';
    if (nextIndex < prevIndex) return 'declined';
    return 'unchanged';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Condition Assessments</h1>
            <p className="page-description">
              Track and record asset condition assessments
            </p>
          </div>
          <Link href="/assessments/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <ClipboardCheck className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.length}
                </p>
                <p className="text-sm text-gray-500">Total Assessments</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    assessments.filter(
                      (a) => getConditionChange(a.previousCondition, a.newCondition) === 'improved'
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-500">Improved</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-danger-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-danger-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    assessments.filter(
                      (a) => getConditionChange(a.previousCondition, a.newCondition) === 'declined'
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-500">Declined</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search assessments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Assessments List */}
      {filteredAssessments.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No assessments found"
          description={
            search
              ? 'Try adjusting your search'
              : 'Get started by recording your first condition assessment'
          }
          action={
            !search && (
              <Link href="/assessments/new" className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Assessment
              </Link>
            )
          }
        />
      ) : (
        <div className="space-y-8">
          {groupedAssessments.map((group) => (
            <div key={group.key}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {group.label}
              </h2>
              <div className="space-y-4">
                {group.items.map((assessment) => (
                  <AssessmentCard
                    key={assessment.id}
                    assessment={assessment}
                    getConditionChange={getConditionChange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AssessmentCard({
  assessment,
  getConditionChange,
}: {
  assessment: ConditionAssessment;
  getConditionChange: (prev: AssetCondition, next: AssetCondition) => string;
}) {
  const change = getConditionChange(
    assessment.previousCondition,
    assessment.newCondition
  );

  return (
    <Card className="hover:border-primary-300 hover:shadow-md transition-all">
      <CardBody>
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'p-2 rounded-lg',
                  change === 'improved'
                    ? 'bg-success-100'
                    : change === 'declined'
                    ? 'bg-danger-100'
                    : 'bg-gray-100'
                )}
              >
                {change === 'improved' ? (
                  <TrendingUp
                    className={cn(
                      'h-5 w-5',
                      change === 'improved' ? 'text-success-600' : 'text-gray-600'
                    )}
                  />
                ) : change === 'declined' ? (
                  <TrendingDown className="h-5 w-5 text-danger-600" />
                ) : (
                  <ArrowRight className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/assets/${assessment.assetId}`}
                  className="font-semibold text-gray-900 hover:text-primary-600"
                >
                  {assessment.assetName}
                </Link>
                <p className="text-sm text-gray-500">
                  Assessed by {assessment.assessor} on{' '}
                  {formatDate(assessment.assessmentDate)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-sm font-medium capitalize',
                    conditionTextColors[assessment.previousCondition]
                  )}
                >
                  {assessment.previousCondition}
                </span>
                <span className="text-gray-400">→</span>
                <span
                  className={cn(
                    'text-sm font-medium capitalize',
                    conditionTextColors[assessment.newCondition]
                  )}
                >
                  {assessment.newCondition}
                </span>
              </div>
              <Badge
                variant={
                  change === 'improved'
                    ? 'success'
                    : change === 'declined'
                    ? 'danger'
                    : 'neutral'
                }
              >
                {change}
              </Badge>
            </div>

            <p className="text-sm text-gray-600 mt-3 line-clamp-2">
              {assessment.findings}
            </p>

            {assessment.recommendations && (
              <p className="text-sm text-primary-600 mt-2">
                <strong>Recommendation:</strong> {assessment.recommendations}
              </p>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
