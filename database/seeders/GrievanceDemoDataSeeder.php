<?php

namespace Database\Seeders;

use App\Models\Grievance\Grievance;
use App\Models\Grievance\GrievanceCategory;
use App\Models\Grievance\GrievanceComment;
use App\Models\Grievance\GrievanceEvent;
use App\Models\Grievance\GrievanceUpvote;
use App\Services\IpAnonymizer;
use Illuminate\Database\Seeder;

class GrievanceDemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Harassment', 'institution_id' => 1, 'sort_order' => 1],
            ['name' => 'Discrimination', 'institution_id' => 1, 'sort_order' => 2],
            ['name' => 'Teacher Conduct', 'institution_id' => 1, 'sort_order' => 3],
            ['name' => 'Exam Concern', 'institution_id' => 1, 'sort_order' => 4],
            ['name' => 'Facilities', 'institution_id' => 1, 'sort_order' => 5],
            ['name' => 'Admin Delay', 'institution_id' => 1, 'sort_order' => 6],
            ['name' => 'Other', 'institution_id' => 1, 'sort_order' => 7],
        ];

        foreach ($categories as $cat) {
            GrievanceCategory::create($cat);
        }

        $institutionId = 1;
        $categoryIds = GrievanceCategory::pluck('id')->toArray();
        $now = now();

        $grievancesData = [
            [
                'title' => 'Toilet facilities are inadequate for female students',
                'description' => 'The girls\' toilet on the second floor has been locked for two weeks. Only one toilet is functional for over 200 female students. This is unhygienic and causes long waiting times between classes.',
                'priority' => 'high',
                'category_index' => 4,
                'upvotes' => 24,
                'comments' => [
                    ['body' => 'Same issue on the first floor too!', 'is_approved' => true],
                    ['body' => 'We submitted a complaint to the admin last month but nothing happened.', 'is_approved' => true],
                ],
                'events' => [
                    ['type' => 'created', 'description' => 'Grievance submitted', 'is_public' => true],
                    ['type' => 'status_change', 'description' => 'Status changed to In Progress', 'is_public' => true],
                ],
                'created_at' => $now->subDays(5),
            ],
            [
                'title' => 'Partiality in grading practical exams',
                'description' => 'Some students received higher marks in the Java practical exam despite submitting incomplete work. We suspect favoritism. The grading rubric was not shared beforehand.',
                'priority' => 'critical',
                'category_index' => 2,
                'upvotes' => 42,
                'comments' => [
                    ['body' => 'I witnessed this too. My code worked perfectly but I got only 60%.', 'is_approved' => true],
                    ['body' => 'We should request a re-evaluation from HOD.', 'is_approved' => true],
                    ['body' => 'The same teacher did this last semester too.', 'is_approved' => true],
                ],
                'events' => [
                    ['type' => 'created', 'description' => 'Grievance submitted', 'is_public' => true],
                    ['type' => 'escalated', 'description' => 'Auto-escalated: reached 20 upvote milestone', 'is_public' => true],
                ],
                'created_at' => $now->subDays(3),
            ],
            [
                'title' => 'Teacher uses derogatory language in class',
                'description' => 'The DBMS professor frequently makes inappropriate comments about students who ask questions. He told a student "you\'ll never pass this subject" in front of the entire class. This creates a hostile learning environment.',
                'priority' => 'critical',
                'category_index' => 2,
                'upvotes' => 56,
                'comments' => [
                    ['body' => 'He said the same thing to me last week. I feel humiliated.', 'is_approved' => true],
                ],
                'events' => [
                    ['type' => 'created', 'description' => 'Grievance submitted', 'is_public' => true],
                    ['type' => 'escalated', 'description' => 'Auto-escalated: reached 50 upvote milestone', 'is_public' => true],
                ],
                'created_at' => $now->subDays(7),
            ],
            [
                'title' => 'Exam schedule clash — two subjects on same day',
                'description' => 'The mid-term schedule has Mathematics and English exams on the same day with only a 1-hour gap. Students cannot prepare adequately for both. Requesting rescheduling.',
                'priority' => 'high',
                'category_index' => 3,
                'upvotes' => 18,
                'comments' => [
                    ['body' => 'This affects all BCA 3rd semester students.', 'is_approved' => true],
                ],
                'events' => [
                    ['type' => 'created', 'description' => 'Grievance submitted', 'is_public' => true],
                ],
                'created_at' => $now->subDays(2),
            ],
            [
                'title' => 'Canteen food quality has deteriorated',
                'description' => 'The canteen food quality has gone down significantly. Several students reported stomach issues after eating there last week. The menu hasn\'t changed in months and portions have shrunk.',
                'priority' => 'medium',
                'category_index' => 4,
                'upvotes' => 31,
                'comments' => [
                    ['body' => 'I got food poisoning last Tuesday!', 'is_approved' => true],
                    ['body' => 'The prices increased but quality dropped. Not fair.', 'is_approved' => true],
                ],
                'events' => [
                    ['type' => 'created', 'description' => 'Grievance submitted', 'is_public' => true],
                    ['type' => 'status_change', 'description' => 'Status changed to In Progress', 'is_public' => true],
                ],
                'created_at' => $now->subDays(4),
            ],
            [
                'title' => 'Library hours are insufficient during exam season',
                'description' => 'The library closes at 5 PM even during exam season. Students need evening hours to study. Other colleges in the area keep their libraries open until 8 PM during exams.',
                'priority' => 'medium',
                'category_index' => 4,
                'upvotes' => 15,
                'comments' => [],
                'events' => [
                    ['type' => 'created', 'description' => 'Grievance submitted', 'is_public' => true],
                ],
                'created_at' => $now->subDays(1),
            ],
            [
                'title' => 'Scholarship distribution lacks transparency',
                'description' => 'The merit-based scholarship list was published without any criteria explanation. Several deserving students were excluded while others who don\'t meet the stated GPA requirement received it. Requesting a transparent review process.',
                'priority' => 'high',
                'category_index' => 5,
                'upvotes' => 37,
                'comments' => [
                    ['body' => 'I applied with 85% but didn\'t get it. Someone with 72% did.', 'is_approved' => true],
                    ['body' => 'This happens every year. Nothing changes.', 'is_approved' => true],
                ],
                'events' => [
                    ['type' => 'created', 'description' => 'Grievance submitted', 'is_public' => true],
                ],
                'created_at' => $now->subDays(6),
            ],
        ];

        foreach ($grievancesData as $i => $data) {
            $catId = $categoryIds[$data['category_index'] % count($categoryIds)];
            $grievance = Grievance::create([
                'institution_id' => $institutionId,
                'category_id' => $catId,
                'title' => $data['title'],
                'description' => $data['description'],
                'priority' => $data['priority'],
                'user_priority' => $data['priority'],
                'status' => $i < 3 ? 'in_progress' : 'received',
                'is_anonymous' => true,
                'reporter_ip' => '127.0.0.1',
                'reporter_ip_hash' => IpAnonymizer::hash('127.0.0.' . ($i + 1)),
                'spam_score' => 0,
                'moderation_status' => 'approved',
                'created_at' => $data['created_at'],
                'updated_at' => $data['created_at'],
            ]);

            $grievance->update(['reference_code' => Grievance::generateReferenceCode($institutionId)]);

            foreach ($data['events'] as $eventData) {
                GrievanceEvent::create(array_merge($eventData, [
                    'grievance_id' => $grievance->id,
                    'metadata' => [],
                    'created_at' => $data['created_at'],
                ]));
            }

            for ($u = 0; $u < $data['upvotes']; $u++) {
                GrievanceUpvote::create([
                    'grievance_id' => $grievance->id,
                    'session_id' => 'demo-session-' . $u,
                    'created_at' => $data['created_at']->addMinutes($u * 10),
                ]);
            }

            foreach ($data['comments'] as $ci => $commentData) {
                GrievanceComment::create(array_merge($commentData, [
                    'grievance_id' => $grievance->id,
                    'session_id' => 'demo-session-comment-' . $ci,
                    'is_public' => true,
                    'created_at' => $data['created_at']->addHours($ci + 1),
                    'updated_at' => $data['created_at']->addHours($ci + 1),
                ]));
            }
        }
    }
}