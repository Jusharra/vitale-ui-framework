import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import { addDays, isBefore, startOfDay, parseISO } from 'date-fns';

interface TravelDatePickerProps {
  checkInDate: Date | null;
  checkOutDate: Date | null;
  onDateChange: (checkIn: Date | null, checkOut: Date | null) => void;
  availableDates: {
    start_date: string;
    end_date: string;
  };
}

const TravelDatePicker: React.FC<TravelDatePickerProps> = ({
  checkInDate,
  checkOutDate,
  onDateChange,
  availableDates,
}) => {
  const today = startOfDay(new Date());
  
  // Parse available date range
  const availableStart = availableDates.start_date ? parseISO(availableDates.start_date) : today;
  const availableEnd = availableDates.end_date ? parseISO(availableDates.end_date) : addDays(today, 365);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const selectedDate = startOfDay(date);

    // If no check-in date or selecting a date before check-in, set as check-in
    if (!checkInDate || isBefore(selectedDate, checkInDate)) {
      onDateChange(selectedDate, null);
    } 
    // If check-in is set and selecting a date after check-in, set as check-out
    else if (checkInDate && !isBefore(selectedDate, checkInDate)) {
      onDateChange(checkInDate, selectedDate);
    }
  };

  // Disable dates outside available range
  const isDateDisabled = (date: Date) => {
    const dateToCheck = startOfDay(date);
    return (
      isBefore(dateToCheck, today) ||
      isBefore(dateToCheck, availableStart) ||
      isBefore(availableEnd, dateToCheck)
    );
  };

  // Create date range for highlighting
  const selectedRange = checkInDate && checkOutDate ? {
    from: checkInDate,
    to: checkOutDate
  } : checkInDate ? {
    from: checkInDate,
    to: checkInDate
  } : undefined;

  const getNights = () => {
    if (checkInDate && checkOutDate) {
      return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Select Travel Dates
        </CardTitle>
        {getNights() > 0 && (
          <Badge variant="outline" className="w-fit">
            {getNights()} night{getNights() !== 1 ? 's' : ''}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={(range) => {
              if (range?.from) {
                onDateChange(range.from, range.to || null);
              }
            }}
            disabled={isDateDisabled}
            className="rounded-md border w-full"
            numberOfMonths={1}
          />
          
          <div className="text-sm text-muted-foreground space-y-1">
            {checkInDate && (
              <p><strong>Check-in:</strong> {checkInDate.toLocaleDateString()}</p>
            )}
            {checkOutDate && (
              <p><strong>Check-out:</strong> {checkOutDate.toLocaleDateString()}</p>
            )}
            {!checkInDate && (
              <p>Select your check-in date first</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelDatePicker;