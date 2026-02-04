<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Service;
use App\Models\Staff;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class BookingAvailabilityService
{
    /**
     * Calculate available slots for a service and optionally a specific staff member.
     *
     * @param Service $service
     * @param Carbon $date
     * @param Staff|null $staff
     * @return array
     */
    public function calculateAvailability(Service $service, Carbon $date, ?Staff $staff = null): array
    {
        // If no staff specified, we might aggregate availability of all eligible staff.
        // For MVP, let's assume staff is required or we pick the first one. 
        // Or better: Return a combined list.
        
        $staffMembers = $staff ? collect([$staff]) : $service->business->staff; 
        
        $availableSlots = [];

        foreach ($staffMembers as $member) {
            $slots = $this->getSlotsForStaff($member, $service, $date);
            $availableSlots = array_merge($availableSlots, $slots);
        }

        // Deduplicate slots and sort
        $availableSlots = array_unique($availableSlots);
        sort($availableSlots);

        return $availableSlots;
    }

    private function getSlotsForStaff(Staff $staff, Service $service, Carbon $date): array
    {
        $dayOfWeek = $date->dayOfWeek; // 0 (Sunday) to 6 (Saturday)
        
        // 1. Get working hours for this day
        $availability = $staff->availabilities()->where('day_of_week', $dayOfWeek)->first();

        if (!$availability) {
            return [];
        }

        $workStart = Carbon::parse($date->format('Y-m-d') . ' ' . $availability->start_time);
        $workEnd = Carbon::parse($date->format('Y-m-d') . ' ' . $availability->end_time);

        // 2. Get existing bookings
        $bookings = $staff->bookings()
            ->whereDate('start_time', $date)
            ->where('status', '!=', 'cancelled')
            ->get();

        // 3. Generate slots
        $slots = [];
        $interval = 30; // 30 minutes interval, could be config or service duration based? 
        // Ideally interval should match service duration or a standard block (e.g. 15 mins)
        // Let's use 30 mins for now as a standard grid.
        
        $currentSlot = $workStart->copy();

        while ($currentSlot->copy()->addMinutes($service->duration_minutes)->lte($workEnd)) {
            $slotEnd = $currentSlot->copy()->addMinutes($service->duration_minutes);
            
            if ($this->isSlotAvailable($currentSlot, $slotEnd, $bookings)) {
                $slots[] = $currentSlot->format('H:i');
            }

            $currentSlot->addMinutes($interval);
        }

        return $slots;
    }

    private function isSlotAvailable(Carbon $start, Carbon $end, $bookings): bool
    {
        foreach ($bookings as $booking) {
            // Check for overlap
            // Overlap exists if (StartA < EndB) and (EndA > StartB)
            if ($start->lt($booking->end_time) && $end->gt($booking->start_time)) {
                return false;
            }
        }
        return true;
    }
}
