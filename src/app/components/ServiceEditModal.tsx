"use client";

import { useEffect, useState } from "react";
import { servicesAPI } from "../services/api";
import { ServiceEditModalProps, ServiceFormData, ServiceFormErrors } from "../types";

export default function ServiceEditModal({ isOpen, onClose, service, onServiceUpdate }: ServiceEditModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isCreateMode = !service;
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    price: 0,
    durationMinutes: 0,
  });
  const [errors, setErrors] = useState<ServiceFormErrors>({});

  // Update form data when service changes or modal opens
  useEffect(() => {
    if (service) {
      // Edit mode - populate with existing service data
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price,
        durationMinutes: service.durationMinutes,
      });
    } else if (isOpen) {
      // Create mode - reset to empty form
      setFormData({
        name: "",
        description: "",
        price: 0,
        durationMinutes: 0,
      });
    }
    setErrors({});
  }, [service, isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const validateForm = (): boolean => {
    const newErrors: ServiceFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Service name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (Number(formData.durationMinutes) <= 0) {
      newErrors.durationMinutes = "Duration must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsUpdating(true);
    try {
      if (isCreateMode) {
        // Create new service
        const newService = await servicesAPI.create(formData);
        
        // Call the callback to update parent component with new service
        if (onServiceUpdate) {
          onServiceUpdate(newService.id, newService);
        }   
      } else {
        // Update existing service
        await servicesAPI.update(service!.id.toString(), formData);
        
        // Call the callback to update parent component
        if (onServiceUpdate) {
          onServiceUpdate(service!.id, formData);
        }
      }
      
      onClose();
      
    } catch (error) {
      console.error(`Failed to ${isCreateMode ? 'create' : 'update'} service:`, error);
      alert(`Failed to ${isCreateMode ? 'create' : 'update'} service. Please try again.`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (field: keyof ServiceFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleDelete = async () => {
    if (!service) return;

    // Show confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${service.name}"?\n\nThis action cannot be undone and will permanently remove this service from your system.`
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await servicesAPI.delete(service.id.toString());
      
      // Call the callback to update parent component (remove from list)
      if (onServiceUpdate) {
        onServiceUpdate(service.id, { deleted: true } as any);
      }
      

      onClose();
      
    } catch (error) {
      console.error('Failed to delete service:', error);
      alert('Failed to delete service. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-stone-800 rounded-lg shadow-xl max-w-md w-full border border-stone-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-stone-700">
            <h3 className="text-lg font-semibold text-stone-100">
              {isCreateMode ? 'Add New Service' : 'Edit Service'}
            </h3>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Service ID (Read-only) - Only show in edit mode */}
            {!isCreateMode && (
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Service ID
                </label>
                <p className="text-blue-400 font-medium">{service!.id}</p>
              </div>
            )}

            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-1">
                Service Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-stone-700 border rounded-md text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-stone-600'
                }`}
                placeholder="Enter service name"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 text-sm bg-stone-700 border rounded-md text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.description ? 'border-red-500' : 'border-stone-600'
                }`}
                placeholder="Enter service description"
              />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-1">
                Price (Rp)
              </label>
              <input
                type="number"
                value={formData.price === 0 ? '' : formData.price}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                min="0"
                className={`w-full px-3 py-2 text-sm bg-stone-700 border rounded-md text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-stone-600'
                }`}
                placeholder="Enter price"
              />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.durationMinutes === 0 ? '' : formData.durationMinutes}
                onChange={(e) => handleInputChange('durationMinutes', parseInt(e.target.value) || 0)}
                min="0"
                className={`w-full px-3 py-2 text-sm bg-stone-700 border rounded-md text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.durationMinutes ? 'border-red-500' : 'border-stone-600'
                }`}
                placeholder="Enter duration in minutes"
              />
              {errors.durationMinutes && <p className="text-red-400 text-xs mt-1">{errors.durationMinutes}</p>}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-stone-700">
              {!isCreateMode && (
                // Edit mode - Show Delete button
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isUpdating || isDeleting}
                  className="px-4 py-2 text-sm font-medium text-red-200 bg-red-900 hover:underline hover:cursor-pointer hover:bg-red-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Delete Service"}
                </button>
              )}
              
              <button
                type="submit"
                disabled={isUpdating || isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:underline hover:cursor-pointer hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating 
                  ? (isCreateMode ? "Creating..." : "Updating...") 
                  : (isCreateMode ? "Create Service" : "Update Service")
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
