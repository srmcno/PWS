'use client';

import { useMemo } from 'react';
import { useApp } from '@/lib/context';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  DollarSign,
  Calendar,
  Package,
  AlertTriangle,
  FileText,
  Download,
} from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import {
  formatCurrency,
  formatDate,
  calculateAge,
  calculateLifePercentage,
} from '@/lib/utils';
import { categoryLabels, AssetCategory, AssetCondition } from '@/types';

export default function ReportsPage() {
  const { assets, maintenanceTasks, assessments, metrics, waterSystem } = useApp();

  // Calculate various report data
  const reportData = useMemo(() => {
    // Assets by category with values
    const categoryData = Object.entries(metrics.assetsByCategory)
      .filter(([, count]) => count > 0)
      .map(([category, count]) => {
        const categoryAssets = assets.filter((a) => a.category === category);
        const totalValue = categoryAssets.reduce((sum, a) => sum + a.replacementCost, 0);
        const avgAge =
          categoryAssets.reduce((sum, a) => sum + calculateAge(a.installDate), 0) /
          categoryAssets.length;
        return {
          category: category as AssetCategory,
          label: categoryLabels[category as AssetCategory],
          count,
          totalValue,
          avgAge: Math.round(avgAge),
        };
      })
      .sort((a, b) => b.totalValue - a.totalValue);

    // Condition breakdown
    const conditionData = [
      {
        condition: 'excellent',
        count: metrics.assetsByCondition.excellent,
        color: '#22c55e',
      },
      { condition: 'good', count: metrics.assetsByCondition.good, color: '#16a34a' },
      { condition: 'fair', count: metrics.assetsByCondition.fair, color: '#f59e0b' },
      { condition: 'poor', count: metrics.assetsByCondition.poor, color: '#d97706' },
      {
        condition: 'critical',
        count: metrics.assetsByCondition.critical,
        color: '#ef4444',
      },
    ];

    // Assets nearing end of life (>80% life used)
    const agingAssets = assets
      .map((asset) => ({
        ...asset,
        age: calculateAge(asset.installDate),
        lifeUsed: calculateLifePercentage(asset.installDate, asset.expectedLifespan),
      }))
      .filter((a) => a.lifeUsed >= 70)
      .sort((a, b) => b.lifeUsed - a.lifeUsed);

    // Maintenance stats
    const completedTasks = maintenanceTasks.filter((t) => t.status === 'completed');
    const totalMaintenanceCost = completedTasks.reduce(
      (sum, t) => sum + (t.actualCost || 0),
      0
    );
    const avgMaintenanceCost =
      completedTasks.length > 0 ? totalMaintenanceCost / completedTasks.length : 0;

    // Replacement planning (next 5 years)
    const replacementPlanning = [1, 2, 3, 4, 5].map((year) => {
      const yearAssets = assets.filter((asset) => {
        const remaining =
          asset.expectedLifespan - calculateAge(asset.installDate);
        return remaining > (year - 1) * 1 && remaining <= year * 1;
      });
      return {
        year: `Year ${year}`,
        assets: yearAssets,
        count: yearAssets.length,
        cost: yearAssets.reduce((sum, a) => sum + a.replacementCost, 0),
      };
    });

    return {
      categoryData,
      conditionData,
      agingAssets,
      completedTasks,
      totalMaintenanceCost,
      avgMaintenanceCost,
      replacementPlanning,
    };
  }, [assets, maintenanceTasks, metrics]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Reports & Analytics</h1>
            <p className="page-description">
              Comprehensive analysis of your water system assets
            </p>
          </div>
          <button className="btn btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Package className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.totalAssets}
                </p>
                <p className="text-sm text-gray-500">Total Assets</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.totalReplacementValue)}
                </p>
                <p className="text-sm text-gray-500">Total Asset Value</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.agingAssets.length}
                </p>
                <p className="text-sm text-gray-500">Aging Assets (70%+)</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-water-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-water-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.length}
                </p>
                <p className="text-sm text-gray-500">Assessments Recorded</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Condition Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-gray-500" />
              Asset Condition Distribution
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {reportData.conditionData.map((item) => {
                const percentage =
                  metrics.totalAssets > 0
                    ? Math.round((item.count / metrics.totalAssets) * 100)
                    : 0;
                return (
                  <div key={item.condition}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 capitalize">{item.condition}</span>
                      <span className="font-medium text-gray-900">
                        {item.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>
                  {Math.round(
                    ((metrics.assetsByCondition.excellent +
                      metrics.assetsByCondition.good) /
                      metrics.totalAssets) *
                      100
                  )}
                  %
                </strong>{' '}
                of assets are in good or excellent condition
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Assets by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gray-500" />
              Assets by Category
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {reportData.categoryData.map((item) => (
                <div key={item.category} className="flex items-center gap-4">
                  <div className="w-28 text-sm text-gray-600 truncate">
                    {item.label}
                  </div>
                  <div className="flex-1">
                    <div className="h-6 rounded bg-primary-100 overflow-hidden">
                      <div
                        className="h-full bg-primary-500 flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.max(
                            10,
                            (item.totalValue / metrics.totalReplacementValue) * 100
                          )}%`,
                        }}
                      >
                        <span className="text-xs font-medium text-white">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-24 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(item.totalValue)}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* 5-Year Replacement Planning */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              5-Year Capital Planning Forecast
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-5 gap-4">
              {reportData.replacementPlanning.map((year) => (
                <div
                  key={year.year}
                  className="text-center p-4 bg-gray-50 rounded-lg"
                >
                  <p className="text-sm font-medium text-gray-700">{year.year}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {year.count}
                  </p>
                  <p className="text-xs text-gray-500">assets</p>
                  <p className="text-sm font-semibold text-primary-600 mt-2">
                    {formatCurrency(year.cost)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-700">
                <strong>5-Year Total:</strong>{' '}
                {formatCurrency(
                  reportData.replacementPlanning.reduce((sum, y) => sum + y.cost, 0)
                )}{' '}
                for{' '}
                {reportData.replacementPlanning.reduce((sum, y) => sum + y.count, 0)}{' '}
                assets expected to reach end of life
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Aging Assets Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning-500" />
              Aging Assets Report
            </CardTitle>
          </CardHeader>
          <CardBody>
            {reportData.agingAssets.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No assets at 70% or more of expected life
              </p>
            ) : (
              <div className="space-y-3">
                {reportData.agingAssets.slice(0, 5).map((asset) => (
                  <div
                    key={asset.id}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{asset.name}</p>
                        <p className="text-sm text-gray-500">
                          {asset.age} years old • {formatCurrency(asset.replacementCost)}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          asset.lifeUsed >= 90
                            ? 'text-danger-600'
                            : asset.lifeUsed >= 80
                            ? 'text-warning-600'
                            : 'text-warning-500'
                        }`}
                      >
                        {asset.lifeUsed}%
                      </span>
                    </div>
                    <div className="mt-2">
                      <ProgressBar value={asset.lifeUsed} size="sm" />
                    </div>
                  </div>
                ))}
                {reportData.agingAssets.length > 5 && (
                  <p className="text-sm text-gray-500 text-center pt-2">
                    +{reportData.agingAssets.length - 5} more assets
                  </p>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Maintenance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              Maintenance Summary
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {maintenanceTasks.length}
                </p>
                <p className="text-sm text-gray-500">Total Tasks</p>
              </div>
              <div className="p-4 bg-success-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-success-700">
                  {reportData.completedTasks.length}
                </p>
                <p className="text-sm text-success-600">Completed</p>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary-700">
                  {formatCurrency(reportData.totalMaintenanceCost)}
                </p>
                <p className="text-sm text-primary-600">Total Spent</p>
              </div>
              <div className="p-4 bg-water-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-water-700">
                  {formatCurrency(reportData.avgMaintenanceCost)}
                </p>
                <p className="text-sm text-water-600">Avg per Task</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">By Status</h4>
              <div className="space-y-1">
                {[
                  {
                    status: 'Scheduled',
                    count: maintenanceTasks.filter((t) => t.status === 'scheduled')
                      .length,
                  },
                  {
                    status: 'In Progress',
                    count: maintenanceTasks.filter((t) => t.status === 'in_progress')
                      .length,
                  },
                  {
                    status: 'Overdue',
                    count: maintenanceTasks.filter((t) => t.status === 'overdue')
                      .length,
                  },
                  {
                    status: 'Completed',
                    count: maintenanceTasks.filter((t) => t.status === 'completed')
                      .length,
                  },
                ].map((item) => (
                  <div
                    key={item.status}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600">{item.status}</span>
                    <span className="font-medium text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">System Name</p>
              <p className="font-medium text-gray-900">{waterSystem.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">PWS ID</p>
              <p className="font-medium text-gray-900">{waterSystem.pwsId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Population Served</p>
              <p className="font-medium text-gray-900">
                {waterSystem.population.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Service Connections</p>
              <p className="font-medium text-gray-900">
                {waterSystem.serviceConnections.toLocaleString()}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
