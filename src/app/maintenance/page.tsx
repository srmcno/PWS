'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/context';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Wrench,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, formatCurrency, isDateOverdue, cn } from '@/lib/utils';
import {
  MaintenanceTask,
  MaintenanceStatus,
  MaintenancePriority,
  MaintenanceType,
  statusColors,
  priorityColors,
} from '@/types';

type TabType = 'all' | 'scheduled' | 'in_progress' | 'completed' | 'overdue';

export default function MaintenancePage() {
  const { maintenanceTasks } = useApp();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [priorityFilter, setPriorityFilter] = useState<MaintenancePriority | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<MaintenanceType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Update tasks to mark overdue ones
  const tasksWithUpdatedStatus = useMemo(() => {
    return maintenanceTasks.map((task) => {
      if (task.status === 'scheduled' && isDateOverdue(task.scheduledDate)) {
        return { ...task, status: 'overdue' as MaintenanceStatus };
      }
      return task;
    });
  }, [maintenanceTasks]);

  const filteredTasks = useMemo(() => {
    let result = [...tasksWithUpdatedStatus];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.assetName.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
      );
    }

    // Tab filter
    if (activeTab !== 'all') {
      result = result.filter((task) => task.status === activeTab);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((task) => task.type === typeFilter);
    }

    // Sort by date (overdue first, then by scheduled date)
    result.sort((a, b) => {
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      if (a.status !== 'overdue' && b.status === 'overdue') return 1;
      return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
    });

    return result;
  }, [tasksWithUpdatedStatus, search, activeTab, priorityFilter, typeFilter]);

  // Count tasks by status
  const counts = useMemo(() => {
    const c = {
      all: tasksWithUpdatedStatus.length,
      scheduled: 0,
      in_progress: 0,
      completed: 0,
      overdue: 0,
    };
    tasksWithUpdatedStatus.forEach((task) => {
      if (task.status in c) {
        c[task.status as keyof typeof c]++;
      }
    });
    return c;
  }, [tasksWithUpdatedStatus]);

  const tabs: { key: TabType; label: string; icon: typeof Wrench }[] = [
    { key: 'all', label: 'All', icon: Wrench },
    { key: 'overdue', label: 'Overdue', icon: AlertCircle },
    { key: 'scheduled', label: 'Scheduled', icon: Calendar },
    { key: 'in_progress', label: 'In Progress', icon: Clock },
    { key: 'completed', label: 'Completed', icon: CheckCircle },
  ];

  const typeLabels: Record<MaintenanceType, string> = {
    preventive: 'Preventive',
    corrective: 'Corrective',
    emergency: 'Emergency',
    inspection: 'Inspection',
    replacement: 'Replacement',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Maintenance</h1>
            <p className="page-description">
              Track and schedule maintenance tasks for your assets
            </p>
          </div>
          <Link href="/maintenance/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Maintenance
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs',
                  activeTab === tab.key
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600',
                  tab.key === 'overdue' && counts.overdue > 0 && 'bg-danger-100 text-danger-700'
                )}
              >
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search maintenance tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn('btn btn-secondary', showFilters && 'bg-gray-100')}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as MaintenancePriority | 'all')}
                  className="select"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="label">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as MaintenanceType | 'all')}
                  className="select"
                >
                  <option value="all">All Types</option>
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No maintenance tasks found"
          description={
            search || priorityFilter !== 'all' || typeFilter !== 'all' || activeTab !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by scheduling your first maintenance task'
          }
          action={
            !search &&
            priorityFilter === 'all' &&
            typeFilter === 'all' &&
            activeTab === 'all' && (
              <Link href="/maintenance/new" className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Maintenance
              </Link>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <MaintenanceCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

function MaintenanceCard({ task }: { task: MaintenanceTask }) {
  const typeLabels: Record<MaintenanceType, string> = {
    preventive: 'Preventive',
    corrective: 'Corrective',
    emergency: 'Emergency',
    inspection: 'Inspection',
    replacement: 'Replacement',
  };

  return (
    <Link href={`/maintenance/${task.id}`}>
      <Card className="hover:border-primary-300 hover:shadow-md transition-all">
        <CardBody>
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    task.status === 'overdue'
                      ? 'bg-danger-100'
                      : task.status === 'completed'
                      ? 'bg-success-100'
                      : 'bg-primary-100'
                  )}
                >
                  <Wrench
                    className={cn(
                      'h-5 w-5',
                      task.status === 'overdue'
                        ? 'text-danger-600'
                        : task.status === 'completed'
                        ? 'text-success-600'
                        : 'text-primary-600'
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.assetName}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {task.status === 'completed' && task.completedDate
                    ? `Completed ${formatDate(task.completedDate)}`
                    : `Scheduled ${formatDate(task.scheduledDate)}`}
                </div>
                {task.estimatedCost && task.status !== 'completed' && (
                  <span className="text-gray-500">
                    Est. {formatCurrency(task.estimatedCost)}
                  </span>
                )}
                {task.actualCost && task.status === 'completed' && (
                  <span className="text-gray-500">
                    Cost: {formatCurrency(task.actualCost)}
                  </span>
                )}
                {task.assignedTo && (
                  <span className="text-gray-500">Assigned: {task.assignedTo}</span>
                )}
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-2">
              <Badge className={statusColors[task.status]}>
                {task.status.replace('_', ' ')}
              </Badge>
              <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
              <Badge variant="neutral">{typeLabels[task.type]}</Badge>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
