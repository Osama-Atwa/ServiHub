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
        // Create Platform Admin
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@servihub.test',
            'role' => 'platform_admin',
            'password' => bcrypt('password'),
        ]);

        // Create a Demo Business Owner
        $businessOwner = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@salon.test',
            'role' => 'business_admin',
            'password' => bcrypt('password'),
        ]);

        // Create a Business
        $business = Business::create([
            'name' => 'Luxe Salon',
            'slug' => 'luxe-salon',
            'brand_color' => '#D946EF', // Fuchsia
            'status' => 'active',
        ]);

        // Link Owner to Business
        $business->users()->attach($businessOwner->id, ['role' => 'owner']);

        // Create Services
        $services = [
            ['name' => 'Haircut', 'duration_minutes' => 30, 'price' => 50.00],
            ['name' => 'Coloring', 'duration_minutes' => 90, 'price' => 120.00],
            ['name' => 'Manicure', 'duration_minutes' => 45, 'price' => 40.00],
        ];

        foreach ($services as $serviceData) {
            $business->services()->create($serviceData);
        }

        // Create Staff
        $staffUser = User::factory()->create([
            'name' => 'Alice Stylist',
            'email' => 'alice@salon.test',
            'role' => 'staff',
            'password' => bcrypt('password'),
        ]);

        $staff = $business->staff()->create([
            'user_id' => $staffUser->id,
            'name' => 'Alice',
            'bio' => 'Senior Stylist with 5 years experience.',
        ]);

        // Add Staff Availability (Mon-Fri, 9-5)
        for ($i = 1; $i <= 5; $i++) {
            $staff->availabilities()->create([
                'day_of_week' => $i,
                'start_time' => '09:00',
                'end_time' => '17:00',
            ]);
        }
        
        // Link Staff User to Business
        $business->users()->attach($staffUser->id, ['role' => 'staff']);
    }
}
