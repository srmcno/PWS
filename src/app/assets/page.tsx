'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/context';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Package,
  ChevronDown,
  Grid,
  List,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import EmptyState from '@/components/ui/EmptyState';
import {
  formatCurrency,
  formatDate,
  calculateAge,
  calculateLifePercentage,
  cn,
} from '@/lib/utils';
import {
  Asset,
  AssetCategory,
  AssetCondition,
  categoryLabels,
  conditionTextColors,
} from '@/types';

type ViewMode = 'grid' | 'list';
type SortField = 'name' | 'category' | 'condition' | 'installDate' | 'replacementCost';
type SortDirection = 'asc' | 'desc';

export default function AssetsPage() {
  const { assets } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory | 'all'>('all');
  const [conditionFilter, setConditionFilter] = useState<AssetCondition | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAssets = useMemo(() => {
    let result = [...assets];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchLower) ||
          asset.description.toLowerCase().includes(searchLower) ||
          asset.location.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((asset) => asset.category === categoryFilter);
    }

    // Condition filter
    if (conditionFilter !== 'all') {
      result = result.filter((asset) => asset.condition === conditionFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'condition':
          const conditionOrder = ['critical', 'poor', 'fair', 'good', 'excellent'];
          comparison = conditionOrder.indexOf(a.condition) - conditionOrder.indexOf(b.condition);
          break;
        case 'installDate':
          comparison = new Date(a.installDate).getTime() - new Date(b.installDate).getTime();
          break;
        case 'replacementCost':
          comparison = a.replacementCost - b.replacementCost;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [assets, search, categoryFilter, conditionFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getConditionBadgeVariant = (condition: AssetCondition) => {
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
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Assets</h1>
            <p className="page-description">
              Manage your water system infrastructure
            </p>
          </div>
          <Link href="/assets/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'btn btn-secondary',
              showFilters && 'bg-gray-100'
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {(categoryFilter !== 'all' || conditionFilter !== 'all') && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary-100 text-primary-700 rounded">
                {(categoryFilter !== 'all' ? 1 : 0) + (conditionFilter !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'grid'
                  ? 'bg-primary-50 text-primary-600'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              )}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 transition-colors border-l border-gray-300',
                viewMode === 'list'
                  ? 'bg-primary-50 text-primary-600'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as AssetCategory | 'all')}
                  className="select"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Condition</label>
                <select
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value as AssetCondition | 'all')}
                  className="select"
                >
                  <option value="all">All Conditions</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="label">Sort By</label>
                <select
                  value={`${sortField}-${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSortField(field as SortField);
                    setSortDirection(direction as SortDirection);
                  }}
                  className="select"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="condition-asc">Condition (Worst First)</option>
                  <option value="condition-desc">Condition (Best First)</option>
                  <option value="installDate-asc">Oldest First</option>
                  <option value="installDate-desc">Newest First</option>
                  <option value="replacementCost-desc">Highest Value</option>
                  <option value="replacementCost-asc">Lowest Value</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setConditionFilter('all');
                  setSortField('name');
                  setSortDirection('asc');
                }}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Reset filters
              </button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-500">
        Showing {filteredAssets.length} of {assets.length} assets
      </p>

      {/* Assets Display */}
      {filteredAssets.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No assets found"
          description={
            search || categoryFilter !== 'all' || conditionFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first asset'
          }
          action={
            !search && categoryFilter === 'all' && conditionFilter === 'all' && (
              <Link href="/assets/new" className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Link>
            )
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <Card>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <span className="flex items-center gap-1">
                      Name
                      {sortField === 'name' && (
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform',
                            sortDirection === 'desc' && 'rotate-180'
                          )}
                        />
                      )}
                    </span>
                  </th>
                  <th
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('category')}
                  >
                    <span className="flex items-center gap-1">
                      Category
                      {sortField === 'category' && (
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform',
                            sortDirection === 'desc' && 'rotate-180'
                          )}
                        />
                      )}
                    </span>
                  </th>
                  <th
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('condition')}
                  >
                    <span className="flex items-center gap-1">
                      Condition
                      {sortField === 'condition' && (
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform',
                            sortDirection === 'desc' && 'rotate-180'
                          )}
                        />
                      )}
                    </span>
                  </th>
                  <th>Location</th>
                  <th
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('installDate')}
                  >
                    <span className="flex items-center gap-1">
                      Age
                      {sortField === 'installDate' && (
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform',
                            sortDirection === 'desc' && 'rotate-180'
                          )}
                        />
                      )}
                    </span>
                  </th>
                  <th
                    className="cursor-pointer hover:bg-gray-100 text-right"
                    onClick={() => handleSort('replacementCost')}
                  >
                    <span className="flex items-center gap-1 justify-end">
                      Value
                      {sortField === 'replacementCost' && (
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform',
                            sortDirection === 'desc' && 'rotate-180'
                          )}
                        />
                      )}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td>
                      <Link
                        href={`/assets/${asset.id}`}
                        className="font-medium text-gray-900 hover:text-primary-600"
                      >
                        {asset.name}
                      </Link>
                    </td>
                    <td className="text-gray-500">
                      {categoryLabels[asset.category]}
                    </td>
                    <td>
                      <Badge variant={getConditionBadgeVariant(asset.condition)}>
                        {asset.condition}
                      </Badge>
                    </td>
                    <td className="text-gray-500">{asset.location}</td>
                    <td className="text-gray-500">
                      {calculateAge(asset.installDate)} years
                    </td>
                    <td className="text-gray-900 text-right font-medium">
                      {formatCurrency(asset.replacementCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function AssetCard({ asset }: { asset: Asset }) {
  const age = calculateAge(asset.installDate);
  const lifeUsed = calculateLifePercentage(asset.installDate, asset.expectedLifespan);

  const getConditionBadgeVariant = (condition: AssetCondition) => {
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
    <Link href={`/assets/${asset.id}`}>
      <Card className="h-full hover:border-primary-300 hover:shadow-md transition-all">
        <CardBody>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{asset.name}</h3>
              <p className="text-sm text-gray-500">{categoryLabels[asset.category]}</p>
            </div>
            <Badge variant={getConditionBadgeVariant(asset.condition)}>
              {asset.condition}
            </Badge>
          </div>

          <p className="text-sm text-gray-600 mt-3 line-clamp-2">{asset.description}</p>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Life Used</span>
              <span className="font-medium text-gray-900">{lifeUsed}%</span>
            </div>
            <ProgressBar value={lifeUsed} size="sm" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Age</p>
              <p className="font-medium text-gray-900">{age} years</p>
            </div>
            <div>
              <p className="text-gray-500">Value</p>
              <p className="font-medium text-gray-900">
                {formatCurrency(asset.replacementCost)}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
