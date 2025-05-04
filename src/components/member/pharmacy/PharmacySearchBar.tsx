
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface PharmacySearchBarProps {
  placeholder: string;
}

const PharmacySearchBar: React.FC<PharmacySearchBarProps> = ({ placeholder }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder={placeholder} 
          className="pl-8 w-full sm:w-[300px]"
        />
      </div>
    </div>
  );
};

export default PharmacySearchBar;
