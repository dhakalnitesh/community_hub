<?php

namespace Database\Seeders;

use App\Models\Platform\Announcement;
use App\Models\Academic\Assignment;
use App\Models\Community\Discussion;
use App\Models\Community\DiscussionAnswer;
use App\Models\Core\Institution;
use App\Models\Academic\Resource;
use App\Models\Academic\Section;
use App\Models\Academic\Semester;
use App\Models\Academic\Subject;
use App\Models\Academic\Submission;
use App\Models\Core\User;
use App\Models\Community\Vote;
use App\Services\AnonymousNameGenerator;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'super@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'anonymous_name' => AnonymousNameGenerator::generate(),
        ]);
        $superAdmin->assignRole('super_admin');

        // Institution
        $institution = Institution::create([
            'name' => 'Gomendra Multiple College',
            'type' => 'college',
            'address' => 'Birtamode, Nepal',
            'created_by' => $superAdmin->id,
        ]);

        // Institution Admin
        $instAdmin = User::create([
            'name' => 'Admin Sharma',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'institution_admin',
            'anonymous_name' => AnonymousNameGenerator::generate(),
        ]);
        $instAdmin->assignRole('institution_admin');
        $institution->users()->attach($instAdmin->id, ['role' => 'institution_admin']);

        // Semesters
        $sem3 = Semester::create([
            'institution_id' => $institution->id,
            'name' => 'BCA 3rd Semester',
            'academic_year' => '2026',
            'invite_code' => 'BCA3SPJ',
        ]);

        $sem4 = Semester::create([
            'institution_id' => $institution->id,
            'name' => 'BCA 4th Semester',
            'academic_year' => '2026',
            'invite_code' => 'BCA4KLM',
        ]);

        $sem6 = Semester::create([
            'institution_id' => $institution->id,
            'name' => 'BCA 6th Semester',
            'academic_year' => '2026',
            'invite_code' => 'BCA6PQR',
        ]);

        // Sections
        $sectionA = Section::create(['semester_id' => $sem3->id, 'name' => 'A']);
        $sectionB = Section::create(['semester_id' => $sem3->id, 'name' => 'B']);
        $section6A = Section::create(['semester_id' => $sem6->id, 'name' => 'A']);

        // Subjects
        $java = Subject::create(['semester_id' => $sem3->id, 'name' => 'Java Programming', 'code' => 'BCA301']);
        $dl = Subject::create(['semester_id' => $sem3->id, 'name' => 'Digital Logic', 'code' => 'BCA302']);
        $dbms = Subject::create(['semester_id' => $sem4->id, 'name' => 'Database Management System', 'code' => 'BCA401']);
        $web = Subject::create(['semester_id' => $sem4->id, 'name' => 'Web Technology', 'code' => 'BCA402']);

        // 6th Semester Subjects
        $se = Subject::create(['semester_id' => $sem6->id, 'name' => 'Software Engineering', 'code' => 'BCA601']);
        $oop = Subject::create(['semester_id' => $sem6->id, 'name' => 'Advance OOP', 'code' => 'BCA602']);
        $ai = Subject::create(['semester_id' => $sem6->id, 'name' => 'AI', 'code' => 'BCA603']);
        $rm = Subject::create(['semester_id' => $sem6->id, 'name' => 'Research Methodology', 'code' => 'BCA604']);
        $cs = Subject::create(['semester_id' => $sem6->id, 'name' => 'Cyber Security', 'code' => 'BCA605']);

        // Teachers
        $teacherRam = User::create([
            'name' => 'Ram Pandey',
            'email' => 'ram@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'anonymous_name' => AnonymousNameGenerator::generate(),
        ]);
        $teacherRam->assignRole('teacher');
        $institution->users()->attach($teacherRam->id, ['role' => 'teacher']);

        $teacherSita = User::create([
            'name' => 'Sita Adhikari',
            'email' => 'sita@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'anonymous_name' => AnonymousNameGenerator::generate(),
        ]);
        $teacherSita->assignRole('teacher');
        $institution->users()->attach($teacherSita->id, ['role' => 'teacher']);

        // Assign teachers to subjects (with sections)
        $java->teachers()->attach($teacherRam->id, ['section_id' => $sectionA->id]);
        $java->teachers()->attach($teacherSita->id, ['section_id' => $sectionB->id]);
        $dl->teachers()->attach($teacherRam->id);
        $dbms->teachers()->attach($teacherSita->id);
        $web->teachers()->attach($teacherRam->id);

        // Assign 6th sem subjects to Sita Adhikari (and Ram for a few)
        $se->teachers()->attach($teacherSita->id, ['section_id' => $section6A->id]);
        $oop->teachers()->attach($teacherSita->id, ['section_id' => $section6A->id]);
        $ai->teachers()->attach($teacherRam->id, ['section_id' => $section6A->id]);
        $rm->teachers()->attach($teacherSita->id, ['section_id' => $section6A->id]);
        $cs->teachers()->attach($teacherSita->id, ['section_id' => $section6A->id]);

        // Students
        $studentNames = [
            'Arun Gurung',
            'Bina Rai',
            'Chandra Thapa',
            'Deepa Sharma',
            'Ekaraj Limbu',
            'Gita Mishra',
            'Hari Poudel',
            'Indira Basnet',
            'Jeevan Khadka',
            'Kabita Tamang',
        ];

        $students = [];
        foreach ($studentNames as $name) {
            $email = strtolower(str_replace(' ', '.', $name)) . '@student.edu';
            $student = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => 'student',
                'anonymous_name' => AnonymousNameGenerator::generate(),
            ]);
            $student->assignRole('student');
            $institution->users()->attach($student->id, ['role' => 'student']);
            $students[] = $student;
        }

        // Enroll students in semesters (with sections)
        foreach (array_slice($students, 0, 4) as $i => $student) {
            $sem3->students()->attach($student->id, [
                'section_id' => $i < 2 ? $sectionA->id : $sectionB->id,
                'status' => 'active',
            ]);
        }
        foreach (array_slice($students, 4, 3) as $student) {
            $sem4->students()->attach($student->id, ['status' => 'active']);
        }
        foreach (array_slice($students, 7) as $student) {
            $sem6->students()->attach($student->id, [
                'section_id' => $section6A->id,
                'status' => 'active',
            ]);
        }

        // Discussions
        $discussionData = [
            ['title' => 'What is the difference between abstract class and interface?', 'body' => 'I am really confused about when to use abstract class vs interface in Java. Can someone explain with examples?', 'subject' => $java, 'student' => $students[0], 'anonymous' => false],
            ['title' => 'Help me understand recursion!', 'body' => 'I cannot wrap my head around recursive functions. The factorial example makes sense but tree traversal is confusing.', 'subject' => $java, 'student' => $students[1], 'anonymous' => true],
            ['title' => 'K-map simplification doubt', 'body' => 'How do I simplify 4-variable K-map? The textbook example is not clear.', 'subject' => $dl, 'student' => $students[2], 'anonymous' => true],
            ['title' => 'Difference between WHERE and HAVING clause', 'body' => 'Both seem similar to me. When should I use HAVING instead of WHERE?', 'subject' => $dbms, 'student' => $students[5], 'anonymous' => false],
            ['title' => 'Normalization forms confusion', 'body' => '1NF, 2NF, 3NF, BCNF — I keep mixing them up. Any mnemonic or trick to remember?', 'subject' => $dbms, 'student' => $students[6], 'anonymous' => true],
            ['title' => 'CSS Flexbox vs Grid', 'body' => 'Which one should I use for a responsive navbar layout? Both seem to work.', 'subject' => $web, 'student' => $students[7], 'anonymous' => false],
            ['title' => 'JavaScript closures — still confused', 'body' => 'I have read the chapter twice but closures still feel magical. Can someone explain with a real example?', 'subject' => $web, 'student' => $students[8], 'anonymous' => true],
            ['title' => 'Assignment 1 help — Binary Tree implementation', 'body' => 'I am stuck on the delete operation in Binary Search Tree. The code compiles but gives wrong output for edge cases.', 'subject' => $java, 'student' => $students[3], 'anonymous' => false],
        ];

        $discussions = [];
        foreach ($discussionData as $data) {
            $disc = Discussion::create([
                'user_id' => $data['student']->id,
                'discussionable_id' => $data['subject']->id,
                'discussionable_type' => 'subject',
                'title' => $data['title'],
                'body' => $data['body'],
                'category' => 'conceptual',
                'is_anonymous' => $data['anonymous'],
                'status' => 'open',
            ]);
            $discussions[] = $disc;
        }

        // Answers
        $answersData = [
            ['discussion' => $discussions[0], 'user' => $teacherRam, 'body' => 'Great question. Abstract class: use when classes share a common base with partial implementation. Interface: use to define a contract/capability that unrelated classes can implement.', 'anonymous' => false],
            ['discussion' => $discussions[0], 'user' => $students[4], 'body' => 'Think of it this way: "is-a" relationship → abstract class. "can-do" capability → interface.', 'anonymous' => false],
            ['discussion' => $discussions[1], 'user' => $teacherRam, 'body' => 'Recursion = function calling itself. Key insight: every recursive function needs a base case to stop. Trace through a simple example on paper first.', 'anonymous' => false],
            ['discussion' => $discussions[1], 'user' => $students[0], 'body' => 'I found this helpful: visualize the call stack. Each recursive call pushes a frame. When base case hits, frames unwind.', 'anonymous' => true],
            ['discussion' => $discussions[2], 'user' => $teacherRam, 'body' => 'For 4-variable K-map, group adjacent 1s in powers of 2 (1, 2, 4, 8, 16). The larger the group, the simpler the term.', 'anonymous' => false],
            ['discussion' => $discussions[3], 'user' => $teacherSita, 'body' => 'WHERE filters rows BEFORE grouping. HAVING filters groups AFTER aggregation. Example: WHERE age > 18, HAVING COUNT(*) > 5.', 'anonymous' => false],
            ['discussion' => $discussions[4], 'user' => $teacherSita, 'body' => 'Mnemonic: "1NF is atomic, 2NF is partial-free, 3NF is transitive-free, BCNF is super-key only."', 'anonymous' => false],
            ['discussion' => $discussions[5], 'user' => $teacherRam, 'body' => 'For navbar: use Flexbox (1D layout). For full page layout: use Grid (2D). Both work but Flexbox is simpler for this case.', 'anonymous' => false],
            ['discussion' => $discussions[6], 'user' => $teacherRam, 'body' => 'A closure is a function that remembers its outer variables even after the outer function returns. Think of it as "function + its environment bundled together."', 'anonymous' => false],
            ['discussion' => $discussions[7], 'user' => $teacherRam, 'body' => 'Check your pointer manipulation in the delete function. Common mistake: not updating the parent\'s child reference after deletion.', 'anonymous' => false],
        ];

        $createdAnswers = [];
        foreach ($answersData as $data) {
            $answer = DiscussionAnswer::create([
                'discussion_id' => $data['discussion']->id,
                'user_id' => $data['user']->id,
                'body' => $data['body'],
                'is_anonymous' => $data['anonymous'],
            ]);
            $createdAnswers[] = $answer;
        }

        // Mark some discussions as answered
        $discussions[0]->update(['status' => 'answered']);
        $discussions[3]->update(['status' => 'answered']);

        // Votes on discussions
        $votePairs = [
            ['votable' => $discussions[1], 'user' => $students[0], 'type' => 'upvote'],
            ['votable' => $discussions[1], 'user' => $students[2], 'type' => 'upvote'],
            ['votable' => $discussions[1], 'user' => $students[3], 'type' => 'upvote'],
            ['votable' => $discussions[0], 'user' => $students[1], 'type' => 'upvote'],
            ['votable' => $discussions[0], 'user' => $students[3], 'type' => 'upvote'],
            ['votable' => $discussions[4], 'user' => $students[5], 'type' => 'upvote'],
            ['votable' => $discussions[4], 'user' => $students[7], 'type' => 'upvote'],
            ['votable' => $createdAnswers[0], 'user' => $students[1], 'type' => 'upvote'],
            ['votable' => $createdAnswers[0], 'user' => $students[2], 'type' => 'upvote'],
            ['votable' => $createdAnswers[0], 'user' => $students[3], 'type' => 'upvote'],
            ['votable' => $createdAnswers[2], 'user' => $students[0], 'type' => 'upvote'],
            ['votable' => $createdAnswers[5], 'user' => $students[6], 'type' => 'upvote'],
        ];

        foreach ($votePairs as $pair) {
            $pair['votable']->votes()->create([
                'user_id' => $pair['user']->id,
                'type' => $pair['type'],
            ]);
        }

        // Assignments
        $assignJava = Assignment::create([
            'subject_id' => $java->id,
            'teacher_id' => $teacherRam->id,
            'title' => 'Binary Search Tree Implementation',
            'description' => 'Implement a BST with insert, delete, search, and inorder traversal. Submit your .java file.',
            'max_score' => 100,
            'due_date' => now()->addDays(7),
            'allow_late_submission' => false,
        ]);

        $assignDbms = Assignment::create([
            'subject_id' => $dbms->id,
            'teacher_id' => $teacherSita->id,
            'title' => 'Database Design for Library System',
            'description' => 'Design an ER diagram and create the normalized tables for a library management system.',
            'max_score' => 50,
            'due_date' => now()->addDays(5),
            'allow_late_submission' => true,
        ]);

        $assignWeb = Assignment::create([
            'subject_id' => $web->id,
            'teacher_id' => $teacherRam->id,
            'title' => 'Personal Portfolio Page',
            'description' => 'Build a responsive personal portfolio page using HTML, CSS, and JavaScript.',
            'max_score' => 75,
            'due_date' => now()->addDays(3),
            'allow_late_submission' => true,
        ]);

        // Submissions
        Submission::create([
            'assignment_id' => $assignJava->id,
            'student_id' => $students[0]->id,
            'content' => 'Here is my BST implementation with all required operations.',
            'submitted_at' => now()->subDay(),
            'is_late' => false,
            'status' => 'submitted',
        ]);

        Submission::create([
            'assignment_id' => $assignDbms->id,
            'student_id' => $students[5]->id,
            'content' => 'ER diagram attached. Tables normalized up to 3NF.',
            'submitted_at' => now()->subHours(2),
            'is_late' => false,
            'status' => 'submitted',
        ]);

        // Resources
        Resource::create([
            'subject_id' => $java->id,
            'teacher_id' => $teacherRam->id,
            'title' => 'Java OOP Concepts Notes',
            'description' => 'Comprehensive notes on inheritance, polymorphism, encapsulation, and abstraction.',
            'file_url' => '/storage/resources/java-oop-notes.pdf',
            'type' => 'pdf',
        ]);

        Resource::create([
            'subject_id' => $java->id,
            'teacher_id' => $teacherRam->id,
            'title' => 'Java Tutorial Video Series',
            'description' => 'YouTube playlist covering core Java concepts.',
            'file_url' => 'https://youtube.com/playlist?example=java',
            'type' => 'video',
        ]);

        Resource::create([
            'subject_id' => $dbms->id,
            'teacher_id' => $teacherSita->id,
            'title' => 'SQL Cheat Sheet',
            'description' => 'Quick reference for all SQL commands covered in class.',
            'file_url' => '/storage/resources/sql-cheatsheet.pdf',
            'type' => 'pdf',
        ]);

        // Announcements
        Announcement::create([
            'subject_id' => $java->id,
            'user_id' => $teacherRam->id,
            'title' => 'Mid-term exam postponed',
            'content' => 'The mid-term exam for Java Programming is postponed to next Friday. More details to follow.',
        ]);

        Announcement::create([
            'subject_id' => $dbms->id,
            'user_id' => $teacherSita->id,
            'title' => 'Guest lecture this Saturday',
            'content' => 'We have a guest lecture on "NoSQL Databases" this Saturday at 2 PM. Attendance is mandatory.',
        ]);
    }
}
