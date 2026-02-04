<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Business;

class BusinessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Platform Admin
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@servihub.test',
            'role' => 'platform_admin',
            'password' => bcrypt('password'),
        ]);

        // 2. Create Demo Client
        User::factory()->create([
            'name' => 'Bob Client',
            'email' => 'client@servihub.test',
            'role' => 'client',
            'password' => bcrypt('password'),
        ]);

        // 3. Create 'Luxe Salon' (Beauty)
        $this->createBusiness(
            ownerEmail: 'john@salon.test',
            businessName: 'Luxe Salon',
            slug: 'luxe-salon',
            color: '#D946EF', // Fuchsia
            services: [
                ['name' => 'Haircut', 'duration_minutes' => 30, 'price' => 50.00],
                ['name' => 'Coloring', 'duration_minutes' => 90, 'price' => 120.00],
                ['name' => 'Manicure', 'duration_minutes' => 45, 'price' => 40.00],
            ],
            staffNames: ['Alice Stylist', 'Bob Colorist']
        );

        // 4. Create 'Urban Barber' (Men's Grooming)
        $this->createBusiness(
            ownerEmail: 'mike@barber.test',
            businessName: 'Urban Barber',
            slug: 'urban-barber',
            color: '#3B82F6', // Blue
            services: [
                ['name' => 'Men\'s Cut', 'duration_minutes' => 30, 'price' => 35.00],
                ['name' => 'Beard Trim', 'duration_minutes' => 20, 'price' => 25.00],
                ['name' => 'Hot Towel Shave', 'duration_minutes' => 45, 'price' => 55.00],
            ],
            staffNames: ['Dave Barber', 'Sam Cuts']
        );

        // 5. Create 'Zen Yoga Studio' (Wellness)
        $this->createBusiness(
            ownerEmail: 'sarah@yoga.test',
            businessName: 'Zen Yoga Studio',
            slug: 'zen-yoga',
            color: '#10B981', // Emerald
            services: [
                ['name' => 'Drop-in Class', 'duration_minutes' => 60, 'price' => 20.00],
                ['name' => 'Private Session', 'duration_minutes' => 60, 'price' => 80.00],
                ['name' => 'Meditation Workshop', 'duration_minutes' => 90, 'price' => 45.00],
            ],
            staffNames: ['Emma Instructor', 'Liam Guru']
        );
    }

    private function createBusiness($ownerEmail, $businessName, $slug, $color, $services, $staffNames)
    {
        // Owner
        $owner = User::factory()->create([
            'name' => $businessName . ' Owner',
            'email' => $ownerEmail,
            'role' => 'business_admin',
            'password' => bcrypt('password'),
        ]);

        // Business
        $business = Business::create([
            'name' => $businessName,
            'slug' => $slug,
            'brand_color' => $color,
            'status' => 'active',
        ]);

        $business->users()->attach($owner->id, ['role' => 'owner']);

        // Services
        foreach ($services as $serviceData) {
            $business->services()->create($serviceData);
        }

        // Staff
        foreach ($staffNames as $index => $name) {
            $staffUser = User::factory()->create([
                'name' => $name,
                'email' => strtolower(str_replace(' ', '.', $name)) . '@' . $slug . '.test',
                'role' => 'staff',
                'password' => bcrypt('password'),
            ]);

            $staffMember = $business->staff()->create([
                'user_id' => $staffUser->id,
                'name' => $name,
                'bio' => "Professional at $businessName",
            ]);

            // Availability (Mon-Fri 9-5)
            for ($i = 1; $i <= 5; $i++) {
                $staffMember->availabilities()->create([
                    'day_of_week' => $i,
                    'start_time' => '09:00',
                    'end_time' => '17:00',
                ]);
            }

            $business->users()->attach($staffUser->id, ['role' => 'staff']);
        }
    }
}
