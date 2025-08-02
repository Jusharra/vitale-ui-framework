import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Upload, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { VacationPackage } from '@/hooks/useVacationPackages';
import MediaUploader from '@/components/common/MediaUploader';
import { generateBookingLink, validateBookingLink } from '@/utils/bookingLinkUtils';

interface EditVacationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacationPackage: VacationPackage | null;
  onSave: (id: string, updates: Partial<VacationPackage>) => Promise<any>;
}

const EditVacationModal: React.FC<EditVacationModalProps> = ({
  isOpen,
  onClose,
  vacationPackage,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<VacationPackage>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (vacationPackage) {
      setFormData({
        destination_name: vacationPackage.destination_name,
        region: vacationPackage.region,
        description_short: vacationPackage.description_short,
        description_full: vacationPackage.description_full,
        price: vacationPackage.price,
        duration: vacationPackage.duration,
        package_type: vacationPackage.package_type,
        image_url: vacationPackage.image_url,
        status: vacationPackage.status,
        amenities: vacationPackage.amenities,
        available_dates: vacationPackage.available_dates,
        featured: vacationPackage.featured,
        booking_link: vacationPackage.booking_link
      });
    }
  }, [vacationPackage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate booking link when destination name changes
    if (name === 'destination_name' && value.trim()) {
      const newBookingLink = generateBookingLink(value.trim());
      setFormData(prev => ({ ...prev, [name]: value, booking_link: newBookingLink }));
    }
  };

  const handleGenerateBookingLink = () => {
    if (formData.destination_name) {
      const newBookingLink = generateBookingLink(formData.destination_name);
      setFormData(prev => ({ ...prev, booking_link: newBookingLink }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleDateChange = (dateType: 'start_date' | 'end_date', value: string) => {
    setFormData(prev => ({
      ...prev,
      available_dates: {
        ...prev.available_dates,
        [dateType]: value
      } as { start_date: string; end_date: string }
    }));
  };

  const handleSubmit = async () => {
    if (!vacationPackage || !formData.destination_name || !formData.region || !formData.description_short) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);
      await onSave(vacationPackage.id, formData);
      onClose();
    } catch (error) {
      console.error('Error saving vacation package:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!vacationPackage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Vacation Package</DialogTitle>
          <DialogDescription>
            Update the details for "{vacationPackage.destination_name}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destination_name">Destination Name *</Label>
              <Input
                id="destination_name"
                name="destination_name"
                value={formData.destination_name || ''}
                onChange={handleInputChange}
                placeholder="e.g., Bali Serenity Retreat"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select 
                value={formData.region} 
                onValueChange={(value) => handleSelectChange('region', value)}
              >
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="South America">South America</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Asia">Asia</SelectItem>
                  <SelectItem value="Africa">Africa</SelectItem>
                  <SelectItem value="Oceania">Oceania</SelectItem>
                  <SelectItem value="Caribbean">Caribbean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price?.toString() || ''}
                onChange={handleInputChange}
                placeholder="e.g., 2499"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration || ''}
                onChange={handleInputChange}
                placeholder="e.g., 7 days"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="package_type">Package Type</Label>
              <Select 
                value={formData.package_type} 
                onValueChange={(value) => handleSelectChange('package_type', value)}
              >
                <SelectTrigger id="package_type">
                  <SelectValue placeholder="Select package type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="cruise">Cruise</SelectItem>
                  <SelectItem value="beach">Beach</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label>Package Image</Label>
              <MediaUploader
                currentUrl={formData.image_url || ''}
                onUpload={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                onRemove={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                folder="vacation-packages"
                maxSize={10}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.available_dates?.start_date || ''}
                onChange={(e) => handleDateChange('start_date', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.available_dates?.end_date || ''}
                onChange={(e) => handleDateChange('end_date', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description_short">Short Description *</Label>
            <Input
              id="description_short"
              name="description_short"
              value={formData.description_short || ''}
              onChange={handleInputChange}
              placeholder="Brief overview of the package"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description_full">Full Description</Label>
            <Textarea
              id="description_full"
              name="description_full"
              value={formData.description_full || ''}
              onChange={handleInputChange}
              placeholder="Detailed description of the vacation package"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="booking_link">Booking Link</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="booking_link"
                  name="booking_link"
                  value={formData.booking_link || ''}
                  onChange={handleInputChange}
                  placeholder="https://vitalehealthconcierge.doctor/book/destination-name"
                  className={validateBookingLink(formData.booking_link || '') ? 'pr-8' : ''}
                />
                {validateBookingLink(formData.booking_link || '') && (
                  <LinkIcon className="absolute right-2 top-2.5 h-4 w-4 text-green-500" />
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateBookingLink}
                disabled={!formData.destination_name?.trim()}
                title="Generate booking link from destination name"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            {formData.booking_link && !validateBookingLink(formData.booking_link) && (
              <p className="text-sm text-amber-600">
                ⚠️ Link should use the format: https://vitalehealthconcierge.doctor/book/destination-name
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="status">Status:</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status" className="w-[110px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="featured" 
                checked={formData.featured || false} 
                onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
              />
              <Label htmlFor="featured">Featured Package</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditVacationModal;