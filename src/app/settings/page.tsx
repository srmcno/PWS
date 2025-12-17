'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Save,
  Droplets,
  Users,
  Home,
} from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

export default function SettingsPage() {
  const { waterSystem, updateWaterSystem } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: waterSystem.name,
    pwsId: waterSystem.pwsId,
    population: waterSystem.population,
    serviceConnections: waterSystem.serviceConnections,
    systemType: waterSystem.systemType,
    address: waterSystem.address,
    contactName: waterSystem.contactName,
    contactPhone: waterSystem.contactPhone,
    contactEmail: waterSystem.contactEmail,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate save delay
    setTimeout(() => {
      updateWaterSystem(formData);
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">
          Manage your water system information and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-water-500" />
              Water System Information
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="name" className="label">
                  System Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter water system name"
                />
              </div>

              <div>
                <label htmlFor="pwsId" className="label">
                  PWS ID
                </label>
                <input
                  type="text"
                  id="pwsId"
                  name="pwsId"
                  value={formData.pwsId}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., OK0000001"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Public Water System Identification Number
                </p>
              </div>

              <div>
                <label htmlFor="systemType" className="label">
                  System Type
                </label>
                <select
                  id="systemType"
                  name="systemType"
                  value={formData.systemType}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="community">Community Water System</option>
                  <option value="non-transient">
                    Non-Transient Non-Community
                  </option>
                  <option value="transient">Transient Non-Community</option>
                </select>
              </div>

              <div>
                <label htmlFor="population" className="label">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    Population Served
                  </div>
                </label>
                <input
                  type="number"
                  id="population"
                  name="population"
                  value={formData.population}
                  onChange={handleChange}
                  className="input"
                  min="0"
                />
              </div>

              <div>
                <label htmlFor="serviceConnections" className="label">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-gray-500" />
                    Service Connections
                  </div>
                </label>
                <input
                  type="number"
                  id="serviceConnections"
                  name="serviceConnections"
                  value={formData.serviceConnections}
                  onChange={handleChange}
                  className="input"
                  min="0"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="label">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    Address
                  </div>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter full address"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              Primary Contact
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="contactName" className="label">
                  Contact Name
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter contact name"
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="label">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    Phone Number
                  </div>
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="input"
                  placeholder="(xxx) xxx-xxxx"
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="label">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Email Address
                  </div>
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="input"
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-500" />
              About This Application
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600">
                This Asset Management application is provided by the{' '}
                <strong>Choctaw Nation Sustainable Communities Program</strong> to help
                public water systems effectively manage their infrastructure assets.
              </p>
              <p className="text-gray-600 mt-4">
                Key features include:
              </p>
              <ul className="text-gray-600 mt-2 space-y-1">
                <li>Complete asset inventory management</li>
                <li>Maintenance scheduling and tracking</li>
                <li>Condition assessment recording</li>
                <li>Financial planning and replacement cost tracking</li>
                <li>Comprehensive reports and analytics</li>
              </ul>
              <p className="text-gray-600 mt-4">
                For support or questions, please contact the Sustainable Communities
                team.
              </p>
            </div>

            <div className="mt-6 p-4 bg-earth-50 rounded-lg border border-earth-200">
              <div className="flex items-center gap-3">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%238f5d34'/%3E%3Ctext x='50' y='60' text-anchor='middle' fill='white' font-size='30' font-weight='bold'%3ECN%3C/text%3E%3C/svg%3E"
                  alt="Choctaw Nation"
                  className="h-12 w-12"
                />
                <div>
                  <p className="font-semibold text-earth-800">
                    Choctaw Nation of Oklahoma
                  </p>
                  <p className="text-sm text-earth-600">
                    Sustainable Communities Program
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-between">
          <div>
            {showSaved && (
              <p className="text-success-600 text-sm flex items-center gap-2 animate-fade-in">
                <Save className="h-4 w-4" />
                Settings saved successfully
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
