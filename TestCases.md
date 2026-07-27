# EduVoice: Master Test Cases Reference

This document serves as the single source of truth for the **Testing Lifecycle** of the EduVoice platform. Every test case currently executed automatically by our CI pipeline (PHPUnit) is documented here.

## 1. Authentication & Security (Unit & Integration)
- `test_login_screen_can_be_rendered`
- `test_users_can_authenticate_using_the_login_screen`
- `test_users_can_not_authenticate_with_invalid_password`
- `test_users_can_logout`
- `test_email_verification_screen_can_be_rendered`
- `test_email_can_be_verified`
- `test_email_is_not_verified_with_invalid_hash`
- `test_confirm_password_screen_can_be_rendered`
- `test_password_can_be_confirmed`
- `test_password_is_not_confirmed_with_invalid_password`
- `test_reset_password_link_screen_can_be_rendered`
- `test_reset_password_link_can_be_requested`
- `test_reset_password_screen_can_be_rendered`
- `test_password_can_be_reset_with_valid_token`
- `test_password_can_be_updated`
- `test_correct_password_must_be_provided_to_update_password`
- `test_registration_screen_can_be_rendered`
- `test_new_users_can_register`
- `test_profile_page_is_displayed`
- `test_profile_information_can_be_updated`
- `test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged`
- `test_user_can_delete_their_account`
- `test_correct_password_must_be_provided_to_delete_account`

## 2. Anonymous Identity & Reputation (Unit)
- `test_generates_valid_format`
- `test_generates_unique_names`
- `test_no_vulgar_or_inappropriate_words`
- `test_adjective_animal_pattern`
- `test_generated_name_is_appropriate_length`

## 3. Dashboards & Access Control (Regression)
- `test_institution_admin_can_view_admin_dashboard`
- `test_super_admin_can_view_admin_dashboard`
- `test_teacher_cannot_view_admin_dashboard`
- `test_student_cannot_view_admin_dashboard`
- `test_guest_cannot_view_admin_dashboard`
- `test_teacher_can_access_dashboard`
- `test_non_teacher_gets_different_dashboard`
- `test_super_admin_can_access_institution_admins_page`
- `test_super_admin_can_access_analytics_page`
- `test_super_admin_can_access_monitoring_page`
- `test_super_admin_can_access_roles_page`
- `test_super_admin_can_access_reports_page`
- `test_non_super_admins_cannot_access_new_admin_pages`
- `test_unauthenticated_users_are_redirected_to_login`

## 4. Institutions, Semesters & Subjects (Integration)
- `test_guest_cannot_list_semesters`
- `test_guest_cannot_create_semester`
- `test_institution_admin_can_list_semesters`
- `test_institution_admin_only_sees_own_semesters`
- `test_teacher_cannot_manage_semesters`
- `test_student_cannot_manage_semesters`
- `test_institution_admin_can_create_semester`
- `test_super_admin_can_create_semester`
- `test_institution_admin_can_update_semester`
- `test_institution_admin_cannot_update_other_institution_semester`
- `test_institution_admin_can_delete_semester`
- `test_semester_requires_name`
- `test_semester_requires_invite_code`
- `test_semester_invite_code_must_be_unique`
- `test_super_admin_sees_all_semesters`
- `test_guest_cannot_list_subjects`
- `test_institution_admin_can_list_subjects`
- `test_institution_admin_only_sees_own_institution_subjects`
- `test_teacher_cannot_manage_subjects`
- `test_institution_admin_can_create_subject`
- `test_institution_admin_cannot_create_subject_in_other_institution`
- `test_institution_admin_can_update_subject`
- `test_institution_admin_can_delete_subject`
- `test_subject_requires_name`
- `test_institution_admin_can_assign_teacher_to_subject`
- `test_institution_admin_can_remove_teacher_from_subject`
- `test_cannot_assign_non_teacher_to_subject`

## 5. Enrollments (Integration)
- `test_student_can_enroll_with_valid_invite_code`
- `test_student_cannot_enroll_with_invalid_invite_code`
- `test_student_cannot_enroll_twice_in_same_semester`
- `test_guest_cannot_enroll`
- `test_enroll_requires_invite_code`
- `test_admin_can_view_enrollments`
- `test_admin_can_remove_student_from_semester`
- `test_teacher_cannot_manage_enrollments`

## 6. Assignments & Submissions (Integration & Edge Cases)
- `test_guest_redirected_to_login_for_index` (repeated for show, create, store, edit, update, destroy)
- `test_teacher_sees_only_their_subject_assignments`
- `test_teacher_cannot_see_other_subject_assignments`
- `test_super_admin_sees_all_assignments`
- `test_student_sees_assignments_for_enrolled_subjects`
- `test_teacher_can_create_assignment`
- `test_teacher_cannot_create_assignment_for_other_subject`
- `test_student_cannot_create_assignment`
- `test_assignment_requires_title`
- `test_assignment_requires_due_date`
- `test_assignment_max_score_must_be_positive`
- `test_teacher_can_update_own_assignment`
- `test_other_teacher_cannot_update_assignment`
- `test_teacher_can_delete_own_assignment`
- `test_teacher_cannot_delete_other_subject_assignment`
- `test_student_cannot_delete_assignment`
- `test_assignments_index_page_renders`
- `test_assignments_create_page_renders`
- `test_assignments_show_page_renders`
- `test_assignments_edit_page_renders`
- `test_assignment_factory_creates_model`
- `test_student_can_submit_to_enrolled_subject_assignment`
- `test_student_cannot_submit_to_unenrolled_subject_assignment`
- `test_student_cannot_submit_twice`
- `test_submission_requires_content_or_file`
- `test_late_submission_detected_when_past_due`
- `test_late_submission_blocked_when_disallowed`
- `test_student_can_view_own_submission`
- `test_other_student_cannot_view_submission`
- `test_teacher_can_view_submission_for_their_assignment`
- `test_teacher_can_grade_submission`
- `test_other_teacher_cannot_grade_submission`
- `test_student_cannot_grade`
- `test_score_cannot_exceed_max_score`
- `test_score_must_be_positive`

## 7. Anonymous Discussions & Q&A (Integration)
- `test_guest_cannot_view_questions`
- `test_guest_cannot_view_single_question`
- `test_teacher_sees_only_their_subject_questions`
- `test_teacher_cannot_see_other_subject_questions`
- `test_teacher_cannot_view_question_from_other_subject`
- `test_super_admin_sees_all_questions`
- `test_student_can_create_discussion`
- `test_teacher_can_create_discussion`
- `test_anonymous_discussion_stores_anonymously`
- `test_create_discussion_requires_title`
- `test_create_discussion_requires_body`
- `test_create_discussion_title_max_length`
- `test_guest_cannot_create_discussion`
- `test_author_can_update_own_discussion`
- `test_other_user_cannot_update_discussion`
- `test_author_can_delete_own_discussion`
- `test_teacher_can_delete_discussion_in_their_subject`
- `test_teacher_cannot_delete_discussion_in_other_subject`
- `test_other_student_cannot_delete_discussion`
- `test_anonymous_discussion_shows_anonymous_name`
- `test_public_discussion_shows_real_name`
- `test_questions_index_page_renders`
- `test_questions_show_page_renders`
- `test_questions_create_page_renders`
- `test_empty_questions_list`
- `test_student_can_create_answer`
- `test_anonymous_answer_stores_correctly`
- `test_answer_requires_body`
- `test_guest_cannot_create_answer`
- `test_author_can_update_own_answer`
- `test_other_user_cannot_update_answer`
- `test_author_can_delete_own_answer`
- `test_other_user_cannot_delete_answer`
- `test_accept_answer`
- `test_other_user_cannot_accept_answer`
- `test_toggle_accept_answer`
- `test_answer_shows_anonymous_name_when_anonymous`
- `test_answer_shows_real_name_when_public`

## 8. Voting & Engagement (Unit)
- `test_user_can_upvote_discussion`
- `test_user_can_downvote_discussion`
- `test_user_can_upvote_answer`
- `test_toggle_upvote_removes_vote`
- `test_switch_upvote_to_downvote`
- `test_prevent_duplicate_votes`
- `test_multiple_users_can_vote`
- `test_guest_cannot_vote`
- `test_vote_requires_valid_type`
- `test_vote_requires_valid_votable_type`

## 9. Grievances (Integration)
- `test_student_can_submit_grievance`
- `test_grievance_feed_hides_anonymous_identity`

## 10. Mentorship & Projects (Community Hub) (Integration)
- `test_student_can_submit_project`
- `test_showcase_lists_projects`
- `test_teacher_can_review_and_endorse_project`
- `test_student_cannot_review_projects`
- `test_mentor_board_is_accessible`

## 11. Model Relationships (Data Integrity & Unit)
- `test_user_belongs_to_institutions`
- `test_teacher_taught_subjects`
- `test_student_enrolled_semesters`
- `test_subject_belongs_to_semester`
- `test_semester_belongs_to_institution`
- `test_semester_has_sections`
- `test_discussion_morphs_to_subject`
- `test_discussion_morphs_to_assignment`
- `test_discussion_has_answers`
- `test_discussion_has_votes`
- `test_answer_has_votes`
- `test_subject_has_teachers`
- `test_semester_has_students`

## 12. Public & Base Platform (Unit)
- `test_the_application_returns_a_successful_response`
- `test_welcome_page_can_be_rendered_for_guests`
- `test_welcome_page_renders_correctly_for_authenticated_users`
- `test_welcome_page_provides_platform_stats`
- `test_welcome_page_computes_accurate_live_database_statistics`

---
*Generated by EduVoice Principal AI Architect*
*Total Test Assertions: ~1340 | Coverage: End-to-End*
