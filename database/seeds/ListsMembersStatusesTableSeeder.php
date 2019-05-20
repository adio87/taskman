<?php

use Illuminate\Database\Seeder;

class ListsMembersStatusesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'id' => 1,
                'title' => 'Is Not Sent'
            ],
            [
                'id' => 2,
                'title' => 'Is Sent'
            ],
            [
                'id' => 3,
                'title' => 'Approved'
            ],
        ];
        DB::table('lists_members_statuses')->insert($data);
    }
}
