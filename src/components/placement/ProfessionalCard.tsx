import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Professional {
  id: string;
  name: string;
  first_name?: string;
  credentials?: string;
  email?: string;
  phone?: string;
  practice_name?: string;
  specialties?: string[];
  languages?: string[];
  specializations?: string[];
  service_area?: string;
  hourly_rate?: string;
  bio?: string;
  accepting_new_patients?: boolean;
  telehealth_enabled?: boolean;
  status: string;
  profile_image?: string;
  rating?: number;
  verified?: boolean;
  slug?: string;
}

interface ProfessionalCardProps {
  professional: Professional;
  onViewDetails: () => void;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional, onViewDetails }) => {
  // Early return if professional is not provided
  if (!professional) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Professional information not available.
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/4 p-6 flex flex-col items-center justify-center">
          <Avatar className="h-32 w-32">
            <AvatarImage src={professional.profile_image || ''} alt={professional.name || 'Professional'} />
            <AvatarFallback className="text-2xl">{getInitials(professional.name || '')}</AvatarFallback>
          </Avatar>
          {professional.rating && (
            <div className="flex items-center mt-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 font-medium">{professional.rating}</span>
            </div>
          )}
          {professional.verified && (
            <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
        <div className="md:w-3/4 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{professional.name || 'Professional'}</h3>
              {professional.credentials && (
                <p className="text-sm text-gray-600">{professional.credentials}</p>
              )}
              {professional.practice_name && (
                <p className="text-base font-medium mt-1">{professional.practice_name}</p>
              )}
              {professional.service_area && (
                <div className="flex items-center text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{professional.service_area}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              {professional.specialties && professional.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-end">
                  {professional.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              )}
              {professional.accepting_new_patients !== undefined && (
                <Badge variant={professional.accepting_new_patients ? "default" : "secondary"}>
                  {professional.accepting_new_patients ? "Accepting New Patients" : "Not Accepting Patients"}
                </Badge>
              )}
            </div>
          </div>
          
          <p className="mt-4 text-gray-600 line-clamp-3">{professional.bio || 'No bio available.'}</p>
          
          <div className="mt-4">
            {professional.languages && professional.languages.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Languages:</span>
                <span>{professional.languages.join(', ')}</span>
              </div>
            )}
            {professional.hourly_rate && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <span className="font-medium">Rate:</span>
                <span>{professional.hourly_rate}</span>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div className="flex gap-2">
              {professional.telehealth_enabled && (
                <Badge variant="secondary">Telehealth Available</Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onViewDetails}
              >
                View Details
              </Button>
              {professional.slug && (
                <Button asChild>
                  <Link to={`/professional/${professional.slug}`}>
                    Book Appointment
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfessionalCard;