# EduVoice: Master Test Cases Reference

This document serves as the single source of truth for the **Testing Lifecycle** of the EduVoice platform. Every test case currently executed automatically by our CI pipeline (PHPUnit) is documented here, following standard enterprise test case ID conventions.

## 1. Authentication & Security (`TC_AUTH`)
- **TC_AUTH_001** | `test_login_screen_can_be_rendered`
- **TC_AUTH_002** | `test_users_can_authenticate_using_the_login_screen`
- **TC_AUTH_003** | `test_users_can_not_authenticate_with_invalid_password`
- **TC_AUTH_004** | `test_users_can_logout`
- **TC_AUTH_005** | `test_email_verification_screen_can_be_rendered`
- **TC_AUTH_006** | `test_email_can_be_verified`
- **TC_AUTH_007** | `test_email_is_not_verified_with_invalid_hash`
- **TC_AUTH_008** | `test_confirm_password_screen_can_be_rendered`
- **TC_AUTH_009** | `test_password_can_be_confirmed`
- **TC_AUTH_010** | `test_password_is_not_confirmed_with_invalid_password`
- **TC_AUTH_011** | `test_reset_password_link_screen_can_be_rendered`
- **TC_AUTH_012** | `test_reset_password_link_can_be_requested`
- **TC_AUTH_013** | `test_reset_password_screen_can_be_rendered`
- **TC_AUTH_014** | `test_password_can_be_reset_with_valid_token`
- **TC_AUTH_015** | `test_password_can_be_updated`
- **TC_AUTH_016** | `test_correct_password_must_be_provided_to_update_password`
- **TC_AUTH_017** | `test_registration_screen_can_be_rendered`
- **TC_AUTH_018** | `test_new_users_can_register`
- **TC_AUTH_019** | `test_profile_page_is_displayed`
- **TC_AUTH_020** | `test_profile_information_can_be_updated`
- **TC_AUTH_021** | `test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged`
- **TC_AUTH_022** | `test_user_can_delete_their_account`
- **TC_AUTH_023** | `test_correct_password_must_be_provided_to_delete_account`

## 2. Anonymous Identity & Reputation (`TC_ANON`)
- **TC_ANON_001** | `test_generates_valid_format`
- **TC_ANON_002** | `test_generates_unique_names`
- **TC_ANON_003** | `test_no_vulgar_or_inappropriate_words`
- **TC_ANON_004** | `test_adjective_animal_pattern`
- **TC_ANON_005** | `test_generated_name_is_appropriate_length`

## 3. Dashboards & Access Control (`TC_DASH`)
- **TC_DASH_001** | `test_institution_admin_can_view_admin_dashboard`
- **TC_DASH_002** | `test_super_admin_can_view_admin_dashboard`
- **TC_DASH_003** | `test_teacher_cannot_view_admin_dashboard`
- **TC_DASH_004** | `test_student_cannot_view_admin_dashboard`
- **TC_DASH_005** | `test_guest_cannot_view_admin_dashboard`
- **TC_DASH_006** | `test_teacher_can_access_dashboard`
- **TC_DASH_007** | `test_non_teacher_gets_different_dashboard`
- **TC_DASH_008** | `test_super_admin_can_access_institution_admins_page`
- **TC_DASH_009** | `test_super_admin_can_access_analytics_page`
- **TC_DASH_010** | `test_super_admin_can_access_monitoring_page`
- **TC_DASH_011** | `test_super_admin_can_access_roles_page`
- **TC_DASH_012** | `test_super_admin_can_access_reports_page`
- **TC_DASH_013** | `test_non_super_admins_cannot_access_new_admin_pages`
- **TC_DASH_014** | `test_unauthenticated_users_are_redirected_to_login`

## 4. Institutions, Semesters & Subjects (`TC_ORG`)
- **TC_ORG_001** | `test_guest_cannot_list_semesters`
- **TC_ORG_002** | `test_guest_cannot_create_semester`
- **TC_ORG_003** | `test_institution_admin_can_list_semesters`
- **TC_ORG_004** | `test_institution_admin_only_sees_own_semesters`
- **TC_ORG_005** | `test_teacher_cannot_manage_semesters`
- **TC_ORG_006** | `test_student_cannot_manage_semesters`
- **TC_ORG_007** | `test_institution_admin_can_create_semester`
- **TC_ORG_008** | `test_super_admin_can_create_semester`
- **TC_ORG_009** | `test_institution_admin_can_update_semester`
- **TC_ORG_010** | `test_institution_admin_cannot_update_other_institution_semester`
- **TC_ORG_011** | `test_institution_admin_can_delete_semester`
- **TC_ORG_012** | `test_semester_requires_name`
- **TC_ORG_013** | `test_semester_requires_invite_code`
- **TC_ORG_014** | `test_semester_invite_code_must_be_unique`
- **TC_ORG_015** | `test_super_admin_sees_all_semesters`
- **TC_ORG_016** | `test_guest_cannot_list_subjects`
- **TC_ORG_017** | `test_institution_admin_can_list_subjects`
- **TC_ORG_018** | `test_institution_admin_only_sees_own_institution_subjects`
- **TC_ORG_019** | `test_teacher_cannot_manage_subjects`
- **TC_ORG_020** | `test_institution_admin_can_create_subject`
- **TC_ORG_021** | `test_institution_admin_cannot_create_subject_in_other_institution`
- **TC_ORG_022** | `test_institution_admin_can_update_subject`
- **TC_ORG_023** | `test_institution_admin_can_delete_subject`
- **TC_ORG_024** | `test_subject_requires_name`
- **TC_ORG_025** | `test_institution_admin_can_assign_teacher_to_subject`
- **TC_ORG_026** | `test_institution_admin_can_remove_teacher_from_subject`
- **TC_ORG_027** | `test_cannot_assign_non_teacher_to_subject`

## 5. Enrollments (`TC_ENR`)
- **TC_ENR_001** | `test_student_can_enroll_with_valid_invite_code`
- **TC_ENR_002** | `test_student_cannot_enroll_with_invalid_invite_code`
- **TC_ENR_003** | `test_student_cannot_enroll_twice_in_same_semester`
- **TC_ENR_004** | `test_guest_cannot_enroll`
- **TC_ENR_005** | `test_enroll_requires_invite_code`
- **TC_ENR_006** | `test_admin_can_view_enrollments`
- **TC_ENR_007** | `test_admin_can_remove_student_from_semester`
- **TC_ENR_008** | `test_teacher_cannot_manage_enrollments`

## 6. Assignments & Submissions (`TC_ASM`)
- **TC_ASM_001** | `test_guest_redirected_to_login_for_assignment_routes`
- **TC_ASM_002** | `test_teacher_sees_only_their_subject_assignments`
- **TC_ASM_003** | `test_teacher_cannot_see_other_subject_assignments`
- **TC_ASM_004** | `test_super_admin_sees_all_assignments`
- **TC_ASM_005** | `test_student_sees_assignments_for_enrolled_subjects`
- **TC_ASM_006** | `test_teacher_can_create_assignment`
- **TC_ASM_007** | `test_teacher_cannot_create_assignment_for_other_subject`
- **TC_ASM_008** | `test_student_cannot_create_assignment`
- **TC_ASM_009** | `test_assignment_requires_title`
- **TC_ASM_010** | `test_assignment_requires_due_date`
- **TC_ASM_011** | `test_assignment_max_score_must_be_positive`
- **TC_ASM_012** | `test_teacher_can_update_own_assignment`
- **TC_ASM_013** | `test_other_teacher_cannot_update_assignment`
- **TC_ASM_014** | `test_teacher_can_delete_own_assignment`
- **TC_ASM_015** | `test_teacher_cannot_delete_other_subject_assignment`
- **TC_ASM_016** | `test_student_cannot_delete_assignment`
- **TC_ASM_017** | `test_assignments_index_page_renders`
- **TC_ASM_018** | `test_assignments_create_page_renders`
- **TC_ASM_019** | `test_assignments_show_page_renders`
- **TC_ASM_020** | `test_assignments_edit_page_renders`
- **TC_ASM_021** | `test_assignment_factory_creates_model`
- **TC_ASM_022** | `test_student_can_submit_to_enrolled_subject_assignment`
- **TC_ASM_023** | `test_student_cannot_submit_to_unenrolled_subject_assignment`
- **TC_ASM_024** | `test_student_cannot_submit_twice`
- **TC_ASM_025** | `test_submission_requires_content_or_file`
- **TC_ASM_026** | `test_late_submission_detected_when_past_due`
- **TC_ASM_027** | `test_late_submission_blocked_when_disallowed`
- **TC_ASM_028** | `test_student_can_view_own_submission`
- **TC_ASM_029** | `test_other_student_cannot_view_submission`
- **TC_ASM_030** | `test_teacher_can_view_submission_for_their_assignment`
- **TC_ASM_031** | `test_teacher_can_grade_submission`
- **TC_ASM_032** | `test_other_teacher_cannot_grade_submission`
- **TC_ASM_033** | `test_student_cannot_grade`
- **TC_ASM_034** | `test_score_cannot_exceed_max_score`
- **TC_ASM_035** | `test_score_must_be_positive`

## 7. Anonymous Discussions & Q&A (`TC_DISC`)
- **TC_DISC_001** | `test_guest_cannot_view_questions`
- **TC_DISC_002** | `test_guest_cannot_view_single_question`
- **TC_DISC_003** | `test_teacher_sees_only_their_subject_questions`
- **TC_DISC_004** | `test_teacher_cannot_see_other_subject_questions`
- **TC_DISC_005** | `test_teacher_cannot_view_question_from_other_subject`
- **TC_DISC_006** | `test_super_admin_sees_all_questions`
- **TC_DISC_007** | `test_student_can_create_discussion`
- **TC_DISC_008** | `test_teacher_can_create_discussion`
- **TC_DISC_009** | `test_anonymous_discussion_stores_anonymously`
- **TC_DISC_010** | `test_create_discussion_requires_title`
- **TC_DISC_011** | `test_create_discussion_requires_body`
- **TC_DISC_012** | `test_create_discussion_title_max_length`
- **TC_DISC_013** | `test_guest_cannot_create_discussion`
- **TC_DISC_014** | `test_author_can_update_own_discussion`
- **TC_DISC_015** | `test_other_user_cannot_update_discussion`
- **TC_DISC_016** | `test_author_can_delete_own_discussion`
- **TC_DISC_017** | `test_teacher_can_delete_discussion_in_their_subject`
- **TC_DISC_018** | `test_teacher_cannot_delete_discussion_in_other_subject`
- **TC_DISC_019** | `test_other_student_cannot_delete_discussion`
- **TC_DISC_020** | `test_anonymous_discussion_shows_anonymous_name`
- **TC_DISC_021** | `test_public_discussion_shows_real_name`
- **TC_DISC_022** | `test_questions_index_page_renders`
- **TC_DISC_023** | `test_questions_show_page_renders`
- **TC_DISC_024** | `test_questions_create_page_renders`
- **TC_DISC_025** | `test_empty_questions_list`
- **TC_DISC_026** | `test_student_can_create_answer`
- **TC_DISC_027** | `test_anonymous_answer_stores_correctly`
- **TC_DISC_028** | `test_answer_requires_body`
- **TC_DISC_029** | `test_guest_cannot_create_answer`
- **TC_DISC_030** | `test_author_can_update_own_answer`
- **TC_DISC_031** | `test_other_user_cannot_update_answer`
- **TC_DISC_032** | `test_author_can_delete_own_answer`
- **TC_DISC_033** | `test_other_user_cannot_delete_answer`
- **TC_DISC_034** | `test_accept_answer`
- **TC_DISC_035** | `test_other_user_cannot_accept_answer`
- **TC_DISC_036** | `test_toggle_accept_answer`
- **TC_DISC_037** | `test_answer_shows_anonymous_name_when_anonymous`
- **TC_DISC_038** | `test_answer_shows_real_name_when_public`

## 8. Voting & Engagement (`TC_VOT`)
- **TC_VOT_001** | `test_user_can_upvote_discussion`
- **TC_VOT_002** | `test_user_can_downvote_discussion`
- **TC_VOT_003** | `test_user_can_upvote_answer`
- **TC_VOT_004** | `test_toggle_upvote_removes_vote`
- **TC_VOT_005** | `test_switch_upvote_to_downvote`
- **TC_VOT_006** | `test_prevent_duplicate_votes`
- **TC_VOT_007** | `test_multiple_users_can_vote`
- **TC_VOT_008** | `test_guest_cannot_vote`
- **TC_VOT_009** | `test_vote_requires_valid_type`
- **TC_VOT_010** | `test_vote_requires_valid_votable_type`

## 9. Grievances (`TC_GRV`)
- **TC_GRV_001** | `test_student_can_submit_grievance`
- **TC_GRV_002** | `test_grievance_feed_hides_anonymous_identity`

## 10. Mentorship & Projects (`TC_MNT`)
- **TC_MNT_001** | `test_student_can_submit_project`
- **TC_MNT_002** | `test_showcase_lists_projects`
- **TC_MNT_003** | `test_teacher_can_review_and_endorse_project`
- **TC_MNT_004** | `test_student_cannot_review_projects`
- **TC_MNT_005** | `test_mentor_board_is_accessible`

## 11. Model Relationships (`TC_REL`)
- **TC_REL_001** | `test_user_belongs_to_institutions`
- **TC_REL_002** | `test_teacher_taught_subjects`
- **TC_REL_003** | `test_student_enrolled_semesters`
- **TC_REL_004** | `test_subject_belongs_to_semester`
- **TC_REL_005** | `test_semester_belongs_to_institution`
- **TC_REL_006** | `test_semester_has_sections`
- **TC_REL_007** | `test_discussion_morphs_to_subject`
- **TC_REL_008** | `test_discussion_morphs_to_assignment`
- **TC_REL_009** | `test_discussion_has_answers`
- **TC_REL_010** | `test_discussion_has_votes`
- **TC_REL_011** | `test_answer_has_votes`
- **TC_REL_012** | `test_subject_has_teachers`
- **TC_REL_013** | `test_semester_has_students`

## 12. Public & Base Platform (`TC_PUB`)
- **TC_PUB_001** | `test_the_application_returns_a_successful_response`
- **TC_PUB_002** | `test_welcome_page_can_be_rendered_for_guests`
- **TC_PUB_003** | `test_welcome_page_renders_correctly_for_authenticated_users`
- **TC_PUB_004** | `test_welcome_page_provides_platform_stats`
- **TC_PUB_005** | `test_welcome_page_computes_accurate_live_database_statistics`

---
*Generated by EduVoice Principal AI Architect*
*Total Test Assertions: ~1340 | Coverage: End-to-End | Status: Fully Operational*
