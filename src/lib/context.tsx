'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Asset, MaintenanceTask, ConditionAssessment, WaterSystemInfo, SystemMetrics, AssetCategory, AssetCondition } from '@/types';
import { sampleAssets, sampleMaintenanceTasks, sampleAssessments, defaultWaterSystem } from './data';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  // Water System Info
  waterSystem: WaterSystemInfo;
  updateWaterSystem: (info: Partial<WaterSystemInfo>) => void;

  // Assets
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  getAsset: (id: string) => Asset | undefined;

  // Maintenance Tasks
  maintenanceTasks: MaintenanceTask[];
  addMaintenanceTask: (task: Omit<MaintenanceTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMaintenanceTask: (id: string, updates: Partial<MaintenanceTask>) => void;
  deleteMaintenanceTask: (id: string) => void;

  // Condition Assessments
  assessments: ConditionAssessment[];
  addAssessment: (assessment: Omit<ConditionAssessment, 'id' | 'createdAt'>) => void;

  // Computed Metrics
  metrics: SystemMetrics;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [waterSystem, setWaterSystem] = useState<WaterSystemInfo>(defaultWaterSystem);
  const [assets, setAssets] = useState<Asset[]>(sampleAssets);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(sampleMaintenanceTasks);
  const [assessments, setAssessments] = useState<ConditionAssessment[]>(sampleAssessments);

  // Water System
  const updateWaterSystem = useCallback((info: Partial<WaterSystemInfo>) => {
    setWaterSystem(prev => ({ ...prev, ...info }));
  }, []);

  // Assets
  const addAsset = useCallback((asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newAsset: Asset = {
      ...asset,
      id: `asset-${uuidv4()}`,
      createdAt: now,
      updatedAt: now,
    };
    setAssets(prev => [...prev, newAsset]);
  }, []);

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    setAssets(prev =>
      prev.map(asset =>
        asset.id === id
          ? { ...asset, ...updates, updatedAt: new Date().toISOString() }
          : asset
      )
    );
  }, []);

  const deleteAsset = useCallback((id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
    // Also delete related maintenance tasks
    setMaintenanceTasks(prev => prev.filter(task => task.assetId !== id));
  }, []);

  const getAsset = useCallback((id: string) => {
    return assets.find(asset => asset.id === id);
  }, [assets]);

  // Maintenance Tasks
  const addMaintenanceTask = useCallback((task: Omit<MaintenanceTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: MaintenanceTask = {
      ...task,
      id: `maint-${uuidv4()}`,
      createdAt: now,
      updatedAt: now,
    };
    setMaintenanceTasks(prev => [...prev, newTask]);
  }, []);

  const updateMaintenanceTask = useCallback((id: string, updates: Partial<MaintenanceTask>) => {
    setMaintenanceTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  }, []);

  const deleteMaintenanceTask = useCallback((id: string) => {
    setMaintenanceTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  // Condition Assessments
  const addAssessment = useCallback((assessment: Omit<ConditionAssessment, 'id' | 'createdAt'>) => {
    const newAssessment: ConditionAssessment = {
      ...assessment,
      id: `assess-${uuidv4()}`,
      createdAt: new Date().toISOString(),
    };
    setAssessments(prev => [...prev, newAssessment]);

    // Update the asset's condition
    updateAsset(assessment.assetId, {
      condition: assessment.newCondition,
      lastInspection: assessment.assessmentDate,
    });
  }, [updateAsset]);

  // Compute metrics
  const metrics: SystemMetrics = React.useMemo(() => {
    const assetsByCategory = {} as Record<AssetCategory, number>;
    const assetsByCondition = {} as Record<AssetCondition, number>;
    let totalReplacementValue = 0;

    const categories: AssetCategory[] = ['source', 'treatment', 'storage', 'distribution', 'pumping', 'metering', 'hydrants', 'valves', 'electrical', 'other'];
    const conditions: AssetCondition[] = ['excellent', 'good', 'fair', 'poor', 'critical'];

    categories.forEach(cat => { assetsByCategory[cat] = 0; });
    conditions.forEach(cond => { assetsByCondition[cond] = 0; });

    assets.forEach(asset => {
      assetsByCategory[asset.category]++;
      assetsByCondition[asset.condition]++;
      totalReplacementValue += asset.replacementCost;
    });

    const now = new Date();
    const upcomingMaintenance = maintenanceTasks.filter(t =>
      t.status === 'scheduled' && new Date(t.scheduledDate) > now
    ).length;
    const overdueMaintenance = maintenanceTasks.filter(t =>
      t.status === 'overdue' || (t.status === 'scheduled' && new Date(t.scheduledDate) < now)
    ).length;
    const assetsNeedingAttention = assets.filter(a =>
      a.condition === 'poor' || a.condition === 'critical'
    ).length;

    return {
      totalAssets: assets.length,
      assetsByCategory,
      assetsByCondition,
      totalReplacementValue,
      upcomingMaintenance,
      overdueMaintenance,
      assetsNeedingAttention,
    };
  }, [assets, maintenanceTasks]);

  return (
    <AppContext.Provider value={{
      waterSystem,
      updateWaterSystem,
      assets,
      addAsset,
      updateAsset,
      deleteAsset,
      getAsset,
      maintenanceTasks,
      addMaintenanceTask,
      updateMaintenanceTask,
      deleteMaintenanceTask,
      assessments,
      addAssessment,
      metrics,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
