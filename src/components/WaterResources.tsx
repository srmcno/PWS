'use client';

import { useState } from 'react';
import { Info, Waves, TrendingDown, TrendingUp, Minus, ExternalLink, X } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';

interface LakeReading {
  name: string;
  code: string;
  elevation: number;
  normalElevation: number;
  percentFull: number;
  storage: number; // acre-feet
  release: number; // cubic feet per second
  lastUpdated: string;
  gateInfo?: {
    lastChange: string;
    settings: string;
  };
}

// Sample data based on provided readings
const sardisLake: LakeReading = {
  name: 'Sardis Lake',
  code: 'SARD',
  elevation: 598.46,
  normalElevation: 599.0,
  percentFull: 97.19,
  storage: 261439,
  release: 0,
  lastUpdated: '15 Dec 2025 18:00',
  gateInfo: {
    lastChange: '22 Jul 2025 11:38',
    settings: '2 Conduit Gates open 0.0 FT',
  },
};

export default function WaterResources() {
  const [showSettlementInfo, setShowSettlementInfo] = useState(false);
  const lake = sardisLake;

  const deviation = lake.elevation - lake.normalElevation;
  const isBelow = deviation < 0;
  const isAbove = deviation > 0;

  return (
    <>
      <Card>
        <CardHeader
          action={
            <button
              onClick={() => setShowSettlementInfo(true)}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              <Info className="h-4 w-4" />
              Water Settlement Info
            </button>
          }
        >
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-water-500" />
            Water Resources - {lake.name}
          </CardTitle>
        </CardHeader>
        <CardBody>
          {/* Status Banner */}
          <div
            className={`p-4 rounded-lg mb-4 ${
              isBelow
                ? 'bg-warning-50 border border-warning-200'
                : isAbove
                ? 'bg-primary-50 border border-primary-200'
                : 'bg-success-50 border border-success-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {isBelow ? (
                <TrendingDown className="h-5 w-5 text-warning-600" />
              ) : isAbove ? (
                <TrendingUp className="h-5 w-5 text-primary-600" />
              ) : (
                <Minus className="h-5 w-5 text-success-600" />
              )}
              <span
                className={`font-semibold ${
                  isBelow
                    ? 'text-warning-700'
                    : isAbove
                    ? 'text-primary-700'
                    : 'text-success-700'
                }`}
              >
                {Math.abs(deviation).toFixed(2)} ft {isBelow ? 'BELOW' : isAbove ? 'ABOVE' : 'AT'} normal
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Pool elevation is {lake.elevation.toFixed(2)} feet • Last updated: {lake.lastUpdated}
            </p>
          </div>

          {/* Current Readings Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Pool Elevation</p>
              <p className="text-xl font-bold text-gray-900">{lake.elevation.toFixed(2)}</p>
              <p className="text-xs text-gray-500">feet</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Conservation Pool</p>
              <p className="text-xl font-bold text-water-600">{lake.percentFull.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">full</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total Storage</p>
              <p className="text-xl font-bold text-gray-900">{lake.storage.toLocaleString()}</p>
              <p className="text-xs text-gray-500">acre-feet</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Release Rate</p>
              <p className="text-xl font-bold text-gray-900">{lake.release}</p>
              <p className="text-xs text-gray-500">cfs</p>
            </div>
          </div>

          {/* Gate Information */}
          {lake.gateInfo && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Gate Status</p>
              <p className="text-sm text-gray-600 mt-1">
                Last change: {lake.gateInfo.lastChange}
              </p>
              <p className="text-sm text-gray-600">
                Settings: {lake.gateInfo.settings}
              </p>
            </div>
          )}

          {/* Data Source */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Data source: U.S. Army Corps of Engineers, Tulsa District
            </p>
            <a
              href="https://www.swt-wc.usace.army.mil/SARD.lakepage.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View Full Report <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardBody>
      </Card>

      {/* Water Settlement Agreement Modal */}
      <Modal
        isOpen={showSettlementInfo}
        onClose={() => setShowSettlementInfo(false)}
        title="Oklahoma Water Settlement Agreement"
        size="lg"
      >
        <div className="modal-body space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="p-4 bg-water-50 rounded-lg border border-water-200">
            <h4 className="font-semibold text-water-800">About the Settlement</h4>
            <p className="text-sm text-water-700 mt-1">
              The Oklahoma Water Settlement, enacted in 2016, resolved long-standing water rights
              disputes between the State of Oklahoma and the Choctaw and Chickasaw Nations.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900">Background</h4>
            <p className="text-sm text-gray-600 mt-2">
              The Choctaw and Chickasaw Nations hold treaty rights to water resources in southeastern
              Oklahoma, including the waters of Sardis Lake and other reservoirs in the region.
              These rights stem from treaties signed in the 1830s, including the Treaty of Dancing
              Rabbit Creek (1830) and the Treaty of Doaksville (1837).
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900">Sardis Lake</h4>
            <p className="text-sm text-gray-600 mt-2">
              Sardis Lake is a reservoir located in Pushmataha and Latimer Counties, Oklahoma.
              It was constructed by the U.S. Army Corps of Engineers and impounds the Jackfork Creek.
              Key specifications:
            </p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc pl-5">
              <li>Normal pool elevation: 599.0 feet above sea level</li>
              <li>Conservation pool capacity: approximately 268,875 acre-feet</li>
              <li>Surface area at conservation pool: 13,610 acres</li>
              <li>Primary purposes: Water supply, flood control, and recreation</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900">Key Provisions of the Settlement</h4>
            <ul className="text-sm text-gray-600 mt-2 space-y-2">
              <li className="flex gap-2">
                <span className="font-medium text-primary-600">1.</span>
                <span>
                  <strong>Recognition of Rights:</strong> The settlement acknowledges the Nations'
                  rights to water within their historic treaty territory.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-primary-600">2.</span>
                <span>
                  <strong>Sardis Lake Water:</strong> The settlement addresses the storage and
                  use of water in Sardis Lake, including provisions for future water supply needs.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-primary-600">3.</span>
                <span>
                  <strong>Revenue Sharing:</strong> Provides for revenue sharing from water sales
                  and establishes a framework for joint management.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-primary-600">4.</span>
                <span>
                  <strong>Future Development:</strong> Establishes procedures for addressing
                  future water needs while protecting the Nations' interests.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900">How This Applies to PWS Operations</h4>
            <p className="text-sm text-gray-600 mt-2">
              Public Water Systems operating within the Choctaw Nation's service area benefit from
              the water resources protected under this settlement. Understanding lake levels and
              storage capacity is essential for:
            </p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc pl-5">
              <li>Long-term water supply planning</li>
              <li>Emergency preparedness during drought conditions</li>
              <li>Coordination with regional water authorities</li>
              <li>Sustainable community development</li>
            </ul>
          </div>

          <div className="p-4 bg-earth-50 rounded-lg border border-earth-200">
            <h4 className="font-semibold text-earth-800">Legal References</h4>
            <ul className="text-sm text-earth-700 mt-2 space-y-1">
              <li>
                • <strong>Public Law 114-322</strong> - Water Infrastructure Improvements for the
                Nation Act (WIIN Act), Title III, Subtitle B (2016)
              </li>
              <li>
                • Oklahoma Senate Bill 469 (2013) - State enabling legislation
              </li>
              <li>
                • Treaty of Dancing Rabbit Creek (1830) - Original treaty establishing Choctaw
                lands in Oklahoma
              </li>
            </ul>
          </div>

          <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
            <p>
              For more information, contact the Choctaw Nation Water Resources Department or visit
              the official Choctaw Nation website.
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <button
            onClick={() => setShowSettlementInfo(false)}
            className="btn btn-primary"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}
