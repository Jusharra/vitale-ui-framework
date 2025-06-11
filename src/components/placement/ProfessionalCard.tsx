import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PlacementRequestButton from './PlacementRequestButton';

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
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/4 p-6 flex justify-center items-start">
          <Avatar className="h-32 w-32">
            <AvatarImage src={professional.profile_image} alt={professional.name} />
            <AvatarFallback className="text-2xl">{getInitials(professional.name)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="md:w-3/4 p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{professional.name}</h3>
                {professional.verified && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">{professional.credentials}</p>
              {professional.service_area && (
                <div className="flex items-center text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{professional.service_area}</span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              {professional.rating && (
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-medium">{professional.rating}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {professional.specialties?.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
          
          <p className="mt-4 text-gray-600 line-clamp-2">{professional.bio}</p>
          
          <div className="mt-4 flex flex-wrap gap-4">
            {professional.languages && professional.languages.length > 0 && (
              <div>
                <span className="text-sm font-medium">Languages:</span>
                <span className="text-sm text-gray-600 ml-1">{professional.languages.join(', ')}</span>
              </div>
            )}
            
            {professional.hourly_rate && (
              <div>
                <span className="text-sm font-medium">Rate:</span>
                <span className="text-sm text-gray-600 ml-1">{professional.hourly_rate}</span>
              </div>
            )}
            
            {professional.telehealth_enabled !== undefined && (
              <div>
                <span className="text-sm font-medium">Telehealth:</span>
                <span className="text-sm text-gray-600 ml-1">{professional.telehealth_enabled ? 'Available' : 'Not available'}</span>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div>
              {professional.accepting_new_patients !== undefined && (
                <Badge variant={professional.accepting_new_patients ? "outline" : "secondary"} className={professional.accepting_new_patients ? "border-green-500 text-green-700" : ""}>
                  {professional.accepting_new_patients ? 'Accepting New Patients' : 'Not Accepting New Patients'}
                </Badge>
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
                <Button 
                  variant="outline" 
                  asChild
                >
                  <Link to={`/professional/${professional.slug}`}>View Profile</Link>
                </Button>
              )}
              <PlacementRequestButton 
                professionalId={professional.id}
                professionalName={professional.name}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfessionalCard;