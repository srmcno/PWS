'use client';

import { useApp } from '@/lib/context';
import {
  Package,
  Wrench,
  AlertTriangle,
  DollarSign,
  Droplets,
  TrendingUp,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Link from 'next/link';
import { formatCurrency, formatDate, calculateLifePercentage, isDateOverdue, isDateUpcoming } from '@/lib/utils';
import { categoryLabels, conditionTextColors, statusColors, priorityColors } from '@/types';

export default function Dashboard() {
  const { assets, maintenanceTasks, metrics, waterSystem } = useApp();

  // Get upcoming and overdue tasks
  const upcomingTasks = maintenanceTasks
    .filter(t => t.status === 'scheduled' && !isDateOverdue(t.scheduledDate))
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 5);

  const overdueTasks = maintenanceTasks
    .filter(t => t.status === 'overdue' || (t.status === 'scheduled' && isDateOverdue(t.scheduledDate)));

  // Get assets needing attention
  const criticalAssets = assets
    .filter(a => a.condition === 'critical' || a.condition === 'poor')
    .slice(0, 5);

  // Calculate condition distribution for chart
  const conditionData = [
    { name: 'Excellent', value: metrics.assetsByCondition.excellent, color: '#22c55e' },
    { name: 'Good', value: metrics.assetsByCondition.good, color: '#16a34a' },
    { name: 'Fair', value: metrics.assetsByCondition.fair, color: '#f59e0b' },
    { name: 'Poor', value: metrics.assetsByCondition.poor, color: '#d97706' },
    { name: 'Critical', value: metrics.assetsByCondition.critical, color: '#ef4444' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-description">
              Overview of {waterSystem.name}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Droplets className="h-4 w-4 text-water-500" />
            <span>PWS ID: {waterSystem.pwsId}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Assets"
          value={metrics.totalAssets}
          icon={Package}
          variant="primary"
        />
        <StatCard
          title="Replacement Value"
          value={formatCurrency(metrics.totalReplacementValue)}
          icon={DollarSign}
          variant="default"
        />
        <StatCard
          title="Scheduled Maintenance"
          value={metrics.upcomingMaintenance}
          icon={Wrench}
          variant="success"
        />
        <StatCard
          title="Needs Attention"
          value={metrics.assetsNeedingAttention}
          icon={AlertTriangle}
          variant={metrics.assetsNeedingAttention > 0 ? 'danger' : 'success'}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Condition Overview */}
        <Card className="lg:col-span-2">
          <CardHeader
            action={
              <Link href="/assets" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            }
          >
            <CardTitle>Asset Condition Overview</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {conditionData.map((item) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-600">{item.name}</div>
                  <div className="flex-1">
                    <div className="h-4 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(item.value / metrics.totalAssets) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-sm font-medium text-gray-900 text-right">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Category Breakdown */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Assets by Category</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {Object.entries(metrics.assetsByCategory)
                  .filter(([, count]) => count > 0)
                  .map(([category, count]) => (
                    <div key={category} className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {categoryLabels[category as keyof typeof categoryLabels]}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions & Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Actions</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {overdueTasks.length > 0 && (
              <div className="p-4 bg-danger-50 rounded-lg border border-danger-200">
                <div className="flex items-center gap-2 text-danger-700 font-medium">
                  <AlertTriangle className="h-4 w-4" />
                  Overdue Maintenance
                </div>
                <p className="text-sm text-danger-600 mt-1">
                  {overdueTasks.length} task{overdueTasks.length !== 1 ? 's' : ''} overdue
                </p>
                <Link
                  href="/maintenance"
                  className="text-sm text-danger-700 hover:underline mt-2 inline-block"
                >
                  View tasks →
                </Link>
              </div>
            )}

            {criticalAssets.length > 0 && (
              <div className="p-4 bg-warning-50 rounded-lg border border-warning-200">
                <div className="flex items-center gap-2 text-warning-700 font-medium">
                  <TrendingUp className="h-4 w-4" />
                  Assets Need Attention
                </div>
                <p className="text-sm text-warning-600 mt-1">
                  {criticalAssets.length} asset{criticalAssets.length !== 1 ? 's' : ''} in poor/critical condition
                </p>
                <Link
                  href="/assets?condition=poor,critical"
                  className="text-sm text-warning-700 hover:underline mt-2 inline-block"
                >
                  View assets →
                </Link>
              </div>
            )}

            {overdueTasks.length === 0 && criticalAssets.length === 0 && (
              <div className="p-4 bg-success-50 rounded-lg border border-success-200">
                <div className="flex items-center gap-2 text-success-700 font-medium">
                  <Package className="h-4 w-4" />
                  All Systems Normal
                </div>
                <p className="text-sm text-success-600 mt-1">
                  No immediate attention required
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Link
                  href="/assets/new"
                  className="btn btn-secondary w-full justify-center"
                >
                  Add New Asset
                </Link>
                <Link
                  href="/maintenance/new"
                  className="btn btn-secondary w-full justify-center"
                >
                  Schedule Maintenance
                </Link>
                <Link
                  href="/assessments/new"
                  className="btn btn-secondary w-full justify-center"
                >
                  New Assessment
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Maintenance & Critical Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Maintenance */}
        <Card>
          <CardHeader
            action={
              <Link href="/maintenance" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            }
          >
            <CardTitle>Upcoming Maintenance</CardTitle>
          </CardHeader>
          <CardBody>
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No upcoming maintenance scheduled
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/maintenance/${task.id}`}
                    className="block p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {task.assetName}
                        </p>
                      </div>
                      <Badge className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(task.scheduledDate)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Assets Requiring Attention */}
        <Card>
          <CardHeader
            action={
              <Link href="/assets" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            }
          >
            <CardTitle>Assets Requiring Attention</CardTitle>
          </CardHeader>
          <CardBody>
            {criticalAssets.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                All assets in good condition
              </p>
            ) : (
              <div className="space-y-3">
                {criticalAssets.map((asset) => {
                  const lifeUsed = calculateLifePercentage(asset.installDate, asset.expectedLifespan);
                  return (
                    <Link
                      key={asset.id}
                      href={`/assets/${asset.id}`}
                      className="block p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {asset.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {categoryLabels[asset.category]}
                          </p>
                        </div>
                        <span className={`text-sm font-medium capitalize ${conditionTextColors[asset.condition]}`}>
                          {asset.condition}
                        </span>
                      </div>
                      <div className="mt-3">
                        <ProgressBar
                          value={lifeUsed}
                          showLabel
                          label="Life Used"
                          size="sm"
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* System Info Footer */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">Population Served</p>
              <p className="text-lg font-semibold text-gray-900">
                {waterSystem.population.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Service Connections</p>
              <p className="text-lg font-semibold text-gray-900">
                {waterSystem.serviceConnections.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">System Type</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {waterSystem.systemType}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="text-lg font-semibold text-gray-900">
                {waterSystem.contactName}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
