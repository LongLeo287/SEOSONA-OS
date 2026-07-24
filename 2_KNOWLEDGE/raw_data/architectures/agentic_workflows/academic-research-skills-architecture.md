# Architecture Extract: academic-research-skills

## Directory Structure
```text
academic-research-skills/
    .gitignore
    .gitleaks.toml
    CHANGELOG.md
    CONTRIBUTING.md
    LICENSE
    MODE_REGISTRY.md
    NOTICE.md
    POSITIONING.md
    pyproject.toml
    QUICKSTART.md
    README.ja-JP.md
    README.md
    README.zh-CN.md
    README.zh-TW.md
    requirements-dev.txt
    SECURITY.md
    .claude/
        CHANGELOG.md
        CLAUDE.md
    .claude-plugin/
        marketplace.json
        plugin.json
    .github/
        FUNDING.yml
        pull_request_template.md
        workflows/
            defer-label-gate.yml
            eval-harness.yml
            freshness-check.yml
            harness-retirement-monthly.yml
            pr-closes-issue.yml
            pytest.yml
            release-cooldown.yml
            repository-hygiene.yml
            spec-consistency.yml
            test-count-monotonic.yml
    academic-paper/
        SKILL.md
        agents/
            abstract_bilingual_agent.md
            argument_builder_agent.md
            citation_compliance_agent.md
            draft_writer_agent.md
            formatter_agent.md
            intake_agent.md
            literature_strategist_agent.md
            peer_reviewer_agent.md
            revision_coach_agent.md
            socratic_mentor_agent.md
            structure_architect_agent.md
            visualization_agent.md
        examples/
            chinese_paper_example.md
            clinical_citation_verification_checklist.md
            clinical_epistemic_status_example.md
            commitment_ledger_example.md
            imrad_hei_example.md
            literature_review_example.md
            plan_mode_guided_writing.md
            revision_mode_example.md
            revision_recovery_example.md
            version_family_reconciliation_example.md
        references/
            abstract_writing_guide.md
            academic_writing_style.md
            anti_leakage_protocol.md
            apa7_chinese_citation_guide.md
            apa7_extended_guide.md
            changelog.md
            citation_format_switcher.md
            credit_authorship_guide.md
            disclosure_mode_protocol.md
            domain_evidence_profiles.md
            failure_paths.md
            funding_statement_guide.md
            hei_domain_glossary.md
            journal_submission_guide.md
            latex_template_reference.md
            mode_selection_guide.md
            paper_structure_patterns.md
            plan_mode_protocol.md
            policy_anchor_disclosure_protocol.md
            policy_anchor_table.md
            revision_patch_protocol.md
            statistical_visualization_standards.md
            venue_disclosure_policies.md
            vlm_figure_verification.md
            workflow_phase_details.md
            writing_judgment_framework.md
            writing_quality_check.md
        templates/
            bilingual_abstract_template.md
            case_study_template.md
            conference_paper_template.md
            credit_statement_template.md
            funding_statement_template.md
            imrad_template.md
            latex_article_template.tex
            literature_review_template.md
            policy_brief_template.md
            revision_tracking_template.md
            theoretical_paper_template.md
    academic-paper-reviewer/
        SKILL.md
        agents/
            devils_advocate_reviewer_agent.md
            domain_reviewer_agent.md
            editorial_synthesizer_agent.md
            eic_agent.md
            field_analyst_agent.md
            methodology_reviewer_agent.md
            perspective_reviewer_agent.md
        examples/
            hei_paper_review_example.md
            interdisciplinary_review_example.md
            subclaim_decomposition_example.md
        references/
            calibration_mode_protocol.md
            changelog.md
            editorial_decision_standards.md
            guided_mode_protocol.md
            integration_guide.md
            quality_rubrics.md
            review_criteria_framework.md
            review_quality_thinking.md
            re_review_mode_protocol.md
            sprint_contract_protocol.md
            statistical_reporting_standards.md
            top_journals_by_field.md
        templates/
            editorial_decision_template.md
            peer_review_report_template.md
            revision_response_template.md
    academic-pipeline/
        SKILL.md
        agents/
            claim_ref_alignment_audit_agent.md
            collaboration_depth_agent.md
            integrity_verification_agent.md
            pipeline_orchestrator_agent.md
            state_tracker_agent.md
        examples/
            full_pipeline_example.md
            integrity_failure_recovery.md
            mid_entry_example.md
        references/
            ai_research_failure_modes.md
            changelog.md
            claim_audit_calibration_protocol.md
            claim_verification_protocol.md
            external_review_protocol.md
            integrity_review_protocol.md
            literature_corpus_consumers.md
            mode_advisor.md
            passport_as_reset_boundary.md
            pipeline_state_machine.md
            plagiarism_detection_protocol.md
            process_summary_protocol.md
            progress_dashboard_template.md
            reinforcement_content.md
            reproducibility_audit.md
            score_trajectory_protocol.md
            team_collaboration_protocol.md
            two_stage_review_protocol.md
            adapters/
                .gitkeep
                overview.md
        templates/
            pipeline_status_template.md
    agents/
        report_compiler_agent.md
        research_architect_agent.md
        synthesis_agent.md
    audits/
        ars-researcher-blindspot-audit-2026-06-10.md
        harness-retirement-2026-06-10.md
    commands/
        ars-3w.md
        ars-abstract.md
        ars-cache-invalidate.md
        ars-citation-check.md
        ars-disclosure.md
        ars-format-convert.md
        ars-full.md
        ars-lit-review.md
        ars-mark-read.md
        ars-outline.md
        ars-plan.md
        ars-rebuttal-audit.md
        ars-reviewer.md
        ars-revision-coach.md
        ars-revision.md
        ars-unmark-read.md
    deep-research/
        SKILL.md
        agents/
            bibliography_agent.md
            devils_advocate_agent.md
            editor_in_chief_agent.md
            ethics_review_agent.md
            meta_analysis_agent.md
            monitoring_agent.md
            report_compiler_agent.md
            research_architect_agent.md
            research_question_agent.md
            risk_of_bias_agent.md
            socratic_mentor_agent.md
            source_verification_agent.md
            synthesis_agent.md
            timeline_extraction_agent.md
        examples/
            exploratory_research.md
            fact_check_mode.md
            handoff_to_paper.md
            idea_diversity_coverage_gap_advisory.md
            policy_analysis.md
            review_mode.md
            socratic_guided_research.md
            systematic_review.md
        references/
            apa7_style_guide.md
            argumentation_reasoning_framework.md
            arxiv_api_protocol.md
            changelog.md
            crossref_api_protocol.md
            cross_agent_quality_definitions.md
            equator_reporting_guidelines.md
            ethics_checklist.md
            failure_paths.md
            interdisciplinary_bridges.md
            irb_decision_tree.md
            literature_monitoring_strategies.md
            logical_fallacies.md
            methodology_patterns.md
            mode_selection_guide.md
            openalex_api_protocol.md
            preregistration_guide.md
            semantic_scholar_api_protocol.md
            socratic_mode_protocol.md
            socratic_questioning_framework.md
            source_quality_hierarchy.md
            systematic_review_protocol.md
            systematic_review_toolkit.md
        templates/
            evidence_assessment_template.md
            literature_matrix_template.md
            preregistration_template.md
            prisma_protocol_template.md
            prisma_report_template.md
            research_brief_template.md
    docs/
        ARCHITECTURE.md
        cross-paper-workflow.md
        PERFORMANCE.md
        PERFORMANCE.zh-TW.md
        ROADMAP-v3.11.md
        SETUP.md
        SETUP.zh-TW.md
        design/
            2026-04-20-v3.4-prisma-trAIce-raise-readcheck-design.md
            2026-04-22-ars-v3.7.3-reading-check-probe-design.md
            2026-04-23-ars-v3.6.2-sprint-contract-design.md
            2026-04-23-ars-v3.6.4-literature-corpus-adapters-design.md
            2026-04-23-ars-v3.6.4-literature-corpus-adapters-plan.md
            2026-04-26-ars-v3.6.5-consumer-integration-design.md
            2026-04-27-ars-v3.6.5.1-setup-fix-implementation-brief.md
            2026-04-27-ars-v3.6.5.2-claude-ai-method-4a-scope-implementation-brief.md
            2026-04-27-ars-v3.6.6-generator-evaluator-contract-design.md
            2026-04-29-ars-v3.6.7-downstream-agent-pattern-protection-spec.md
            2026-04-30-ars-v3.6.7-step-6-orchestrator-hooks-spec.md
            2026-04-30-ars-v3.6.8-trust-provenance-and-drift-transparency-spec.md
            2026-04-30-ars-v3.7.0-plugin-packaging-roadmap.md
            2026-05-05-phase-6.6-scoping-note.md
            2026-05-10-ars-v3.7.2-trust-provenance-hardening-spec.md
            2026-05-12-ars-v3.7.3-claim-faithfulness-and-contaminated-source-spec.md
            2026-05-13-ai-disclosure-schema-discovery.md
            2026-05-14-ai-disclosure-impl-spec.md
            2026-05-14-ai-disclosure-schema-decision.md
            2026-05-15-issue-103-claim-alignment-audit-decision.md
            2026-05-15-issue-103-claim-alignment-audit-spec.md
            2026-05-15-issue-105-contamination-signals-backfill-design.md
            2026-05-15-issue-111-slr-lineage-emission-design.md
            2026-05-17-ars-v3.9.0-cross-index-triangulation-measurement-spec.md
            2026-05-18-ars-v3.9.2-agent-phase-classification.md
            2026-05-18-ars-v3.9.2-phase-boundary-spec.md
            2026-05-18-ars-v3.9.4-temporal-verification-spec.md
            2026-05-21-v3.10-182-promote-citation-gate-spec.md
            2026-05-21-v3.10-183-epistemic-status-spec.md
            2026-05-21-v3.10-184-extend-eval-harness-spec.md
            2026-05-28-kong-257-idea-diversity-coverage-gap-advisory.md
            2026-05-28-kong-258-version-family-reconciliation.md
            2026-05-29-kong-259-domain-evidence-profiles-spec.md
            2026-05-30-kong-259-domain-evidence-profiles-plan.md
            2026-05-31-ars-268-schema11-nested-commitment-ledger-spec.md
            2026-05-31-ars-v3.10-policy-layer-rescope-spec.md
            2026-06-01-ars-134-conductor-rescope-deterministic-write-guard-spec.md
            2026-06-02-co-scientist-220-l1-hidden-ranking.md
            2026-06-02-co-scientist-221-l2-feedback-propagation.md
            2026-06-02-co-scientist-222-l3-transfer-matrix.md
            2026-06-02-co-scientist-223-l4-control-plane-ownership.md
            2026-06-06-213-subclaim-decomposition-design.md
            2026-06-07-272-instruction-data-boundary-design.md
            2026-06-08-214-synthesizer-subclaim-design.md
            2026-06-08-255-kong-meta-negative-scope-and-design-lessons.md
            2026-06-08-260-experiment-provenance-intake-spec.md
            2026-06-08-262-cross-paper-contradiction-design.md
            2026-06-08-273-rubric-aware-calibration-note-design.md
            2026-06-08-274-concise-pressure-guidance-design.md
            2026-06-08-kong-255-l1-copilot-not-auto-research.md
            2026-06-08-kong-255-l2-advisory-not-generation.md
            2026-06-09-216-surface-form-parity-design.md
            2026-06-10-390-diff-patch-revision-mode-spec.md
            2026-06-10-394-family-d-repro-lock-assessment.md
            2026-06-10-394-submission-package-verifier-spec.md
            2026-06-13-431-author-agree-removal-impact.md
            2026-06-13-431-title-match-hardening-spec.md
            snapshots/
                2026-05-13-ai-disclosure-discovery/
                    icmje.html
                    ieee.html
                    manifest.yaml
                    nature.html
                    prisma-trAIce.html
        migration/
            v3.7.3-contamination-signals-backfill.md
    evals/
        README.md
        calibration/
            commitment_ledger_seed.yaml
        gold/
            citation_extraction/
                expected_outcomes.json
                manifest.yaml
                README.md
                tuples/
                    001-valid-doi-numpy-2020.json
                    002-valid-doi-alphafold-2021.json
                    003-valid-doi-med-palm-2023.json
                    004-valid-doi-scipy-2020.json
                    005-valid-doi-umap-2019.json
                    006-valid-doi-alphazero-2018.json
                    007-valid-doi-seurat-v4-2021.json
                    008-valid-doi-rosettafold-2021.json
                    009-valid-doi-resnet-2016.json
                    010-valid-doi-moco-2020.json
                    011-valid-doi-optuna-2019.json
                    012-valid-doi-vosoughi-fake-news-2018.json
                    013-valid-doi-bnt162b2-2020.json
                    014-valid-doi-lancet-covid-zhou-2020.json
                    015-valid-doi-jama-covid-pharm-2020.json
                    016-valid-doi-bert-2019.json
                    017-valid-doi-bart-2020.json
                    018-valid-doi-graphene-magic-angle-2018.json
                    019-valid-doi-qubit-mof-2020.json
                    020-valid-doi-aer-experimenter-demand-2018.json
                    021-valid-arxiv-mistral-7b-2023.json
                    022-valid-arxiv-qwen-technical-report-2023.json
                    023-valid-arxiv-sleeper-agents-2024.json
                    024-valid-arxiv-bitnet-2023.json
                    025-valid-arxiv-bitnet-1-58-2024.json
                    026-valid-arxiv-equiformerv2-2023.json
                    027-valid-arxiv-transformers-causal-2024.json
                    028-valid-arxiv-mamba-2023.json
                    029-valid-arxiv-projective-geometric-algebra-2019.json
                    030-valid-arxiv-embedded-fluid-spheres-2023.json
                    031-fabricated-synthetic-genome.json
                    032-fabricated-phantom-aerosol.json
                    033-fabricated-ghost-manipulator.json
                    034-fabricated-vapor-syntax.json
                    035-fabricated-null-electrolyte.json
                    036-fabricated-fictive-market.json
                    037-fabricated-spectral-void-galaxy.json
                    038-fabricated-phantom-epitope.json
                    039-fabricated-illusory-gesture.json
                    040-fabricated-ghost-tremor.json
                    041-manual-exempt-hofstede-2010-cultures.json
                    042-manual-exempt-oecd-2019-ai-principles.json
                    043-manual-exempt-brooks-1995-mythical-man-month.json
                    044-manual-exempt-turing-1950-computing.json
                    045-manual-exempt-kitching-2023-quantum-sensing.json
                    046-fabricated-phantom-tensor-quantum-rl.json
                    047-fabricated-cross-lingual-hallucination.json
                    048-fabricated-bayesian-spike-sorting.json
                    049-fabricated-topological-edge-state.json
                    050-fabricated-counterfactual-spectral-knapsack.json
                    051-fabricated-title-only-no-identifier.json
            field_norm_severity/
                gold_set.json
                manifest.yaml
                README.md
            rq_framing_patterns/
                gold_set.json
                manifest.yaml
                README.md
            surface_form_parity/
                gold_set.json
                manifest.yaml
                README.md
    examples/
        benchmark_report_template.json
        contradiction_pairs_example.md
        figure_table_trace_example.md
        passport_with_experiment_provenance.yaml
        passport_with_repro_lock.yaml
        compliance/
            fixture_primary_raise_weak.yaml
            fixture_sr_full_compliant.yaml
            fixture_sr_missing_M4.yaml
        showcase/
            full_paper_apa7.pdf
            full_paper_zh_apa7.pdf
            integrity_report_stage2.5.pdf
            integrity_report_stage4.5.pdf
            integrity_reverification_stage2.5.pdf
            paper_creation_process_en.pdf
            paper_creation_process_zh.pdf
            post_publication_audit_2026-03-09.pdf
            README.md
            response_to_reviewers_r2.pdf
            stage3prime_rereview_report.pdf
            stage3_review_report.pdf
            stage3_review_report_r2.pdf
    hooks/
        hooks.json
    scripts/
        announce-ars-loaded.sh
        ars_anchorize_draft.py
        ars_apply_revision_patch.py
        ars_cache_invalidate.py
        ars_mark_read.py
        ars_phase_scope_manifest.json
        ars_write_scope_guard.py
        arxiv_client.py
        audit_snapshot.py
        bootstrap_timeline_yaml.py
        check_215_field_norm.py
        check_216_surface_form.py
        check_268_nested_commitment_ledger.py
        check_390_revision_patch_discipline.py
        check_392_citation_verification_intake.py
        check_394_submission_policy.py
        check_agents_mirror_sync.py
        check_audit_artifact_consistency.py
        check_benchmark_report.py
        check_ci_pytest_manifest.py
        check_claim_audit_consistency.py
        check_collaboration_depth_rubric.py
        check_compliance_report.py
        check_corpus_consumer_protocol.py
        check_cross_model_verification_sync.py
        check_data_access_level.py
        check_domain_evidence_profile.py
        check_evals_gold_set.py
        check_experiment_provenance.py
        check_field_norm_severity.py
        check_firm_rules_sync.py
        check_instruction_data_boundary.py
        check_judge_prompt_version.py
        check_literature_corpus_schema.py
        check_passport_reset_contract.py
        check_pattern_eval_manifest.py
        check_pipeline_integrity.py
        check_policy_anchor_protocol.py
        check_policy_anchor_table.py
        check_preprint_venues_consistency.py
        check_prisma_trAIce_freshness.py
        check_ranking_lift.py
        check_repro_lock.py
        check_rq_framing_patterns.py
        check_rubric_weight_consistency.py
        check_spec_consistency.py
        check_sprint_contract.py
        check_surface_form_parity.py
        check_task_type.py
        check_v3_10_134_write_scope.py
        check_v3_10_policy.py
        check_v3_6_6_ab_manifest.py
        check_v3_6_7_pattern_protection.py
        check_v3_6_8_audit_scope_block.py
        check_v3_6_8_cite_provenance_pipeline.py
        check_v3_6_8_frontmatter_trust_schema.py
        check_v3_6_8_mark_read_commands.py
        check_v3_6_8_pattern_protection.py
        check_v3_7_3_three_layer_citation.py
        check_v3_8_annotation_literal_sync.py
        check_v3_9_0_triangulation.py
        check_v3_9_2_phase_boundary.py
        check_v3_9_4_temporal_verification.py
        check_version_consistency.py
        citation_verification_summary.py
        claim_audit_calibration.py
        claim_audit_finalizer.py
        claim_audit_pipeline.py
        contamination_signals.py
        corpus_consumer_manifest.json
        crossref_client.py
        migrate_literature_corpus_to_v3_10.py
        migrate_literature_corpus_to_v3_7_3.py
        migrate_literature_corpus_to_v3_9_0.py
        openalex_client.py
        parse_audit_verdict.py
        policy_anchor_disclosure_referee.py
        repro_lock_validation.py
        run_ci_pytest_manifest.py
        run_codex_audit.sh
        run_evals.py
        semantic_scholar_client.py
        slr_lineage.py
        sync_adapter_docs.py
        temporal_integrity_audit.py
        test_431_exact_or_bust.py
        test_ars_anchorize_draft.py
        test_ars_apply_revision_patch.py
        test_ars_cache_invalidate.py
        test_ars_mark_read.py
        test_ars_write_scope_guard.py
        test_arxiv_client.py
        test_audit_schemas.py
        test_audit_snapshot_render_section_0.py
        test_block_parser.py
        test_bootstrap_timeline_yaml.py
        test_check_215_field_norm.py
        test_check_216_surface_form.py
        test_check_268_nested_commitment_ledger.py
        test_check_390_revision_patch_discipline.py
        test_check_392_citation_verification_intake.py
        test_check_394_submission_policy.py
        test_check_agents_mirror_sync.py
        test_check_audit_artifact_consistency.py
        test_check_benchmark_report.py
        test_check_ci_pytest_manifest.py
        test_check_collaboration_depth_rubric.py
        test_check_compliance_report.py
        test_check_cross_model_verification_sync.py
        test_check_data_access_level.py
        test_check_domain_evidence_profile.py
        test_check_evals_gold_set.py
        test_check_field_norm_severity.py
        test_check_firm_rules_sync.py
        test_check_instruction_data_boundary.py
        test_check_judge_prompt_version.py
        test_check_passport_reset_contract.py
        test_check_pattern_eval_manifest.py
        test_check_pipeline_integrity.py
        test_check_policy_anchor_protocol.py
        test_check_policy_anchor_table.py
        test_check_prisma_trAIce_freshness.py
        test_check_ranking_lift.py
        test_check_repro_lock.py
        test_check_rq_framing_patterns.py
        test_check_rubric_weight_consistency.py
        test_check_spec_consistency.py
        test_check_sprint_contract.py
        test_check_surface_form_parity.py
        test_check_task_type.py
        test_check_v3_10_134_write_scope.py
        test_check_v3_10_policy.py
        test_check_v3_6_7_pattern_protection.py
        test_check_v3_6_8_audit_scope_block.py
        test_check_v3_6_8_cite_provenance_pipeline.py
        test_check_v3_6_8_frontmatter_trust_schema.py
        test_check_v3_6_8_mark_read_commands.py
        test_check_v3_6_8_pattern_protection.py
        test_check_v3_7_3_three_layer_citation.py
        test_check_v3_8_annotation_literal_sync.py
        test_check_v3_9_0_triangulation.py
        test_check_v3_9_2_phase_boundary.py
        test_check_v3_9_4_temporal_verification.py
        test_check_version_consistency.py
        test_citation_existence_policy.py
        test_citation_verification_summary.py
        test_claim_audit_calibration.py
        test_claim_audit_finalizer.py
        test_claim_audit_pipeline.py
        test_claim_audit_schema.py
        test_claim_intent_manifest.py
        test_contamination_signals.py
        test_crossref_client.py
        test_cross_model_verification_guards.py
        test_e2e_claim_audit.py
        test_evals_citation_extraction.py
        test_evals_lift_report_schema.py
        test_eval_harness_workflow.py
        test_experiment_provenance.py
        test_migrate_literature_corpus_to_v3_10.py
        test_migrate_literature_corpus_to_v3_7_3.py
        test_migrate_literature_corpus_to_v3_9_0.py
        test_openalex_client.py
        test_passport_yaml.py
        test_pattern_eval_runtime.py
        test_policy_anchor_disclosure.py
        test_reading_probe_lint.py
        test_repro_lock_validation_drift.py
        test_runtime_injection_boundary_xfail.py
        test_run_ci_pytest_manifest.py
        test_run_codex_audit_e2e.py
        test_run_evals.py
        test_semantic_scholar_client.py
        test_slr_lineage_emission.py
        test_temporal_integrity_audit.py
        test_text_similarity.py
        test_title_fuzzy_false_positive.py
        test_uncited_assertion.py
        test_v3_6_7_phase_6_6.py
        test_validate_compliance_fixtures.py
        test_verification_cache.py
        test_verification_gate.py
        test_verify_passport_cli.py
        test_verify_submission_package.py
        test_version_records_schema.py
        test__eval_threshold_gate.py
        test__next_verified_at_ms.py
        uncited_assertion_detector.py
        v3_6_7_inversion_manifest.json
        v3_6_8_inversion_manifest.json
        validate_compliance_fixtures.py
        verification_cache.py
        verify_passport.py
        verify_submission_package.py
        _block_parser.py
        _ci_pytest_manifest.toml
        _claim_audit_constants.py
        _eval_threshold_gate.py
        _next_verified_at_ms.py
        _passport_yaml.py
        _skill_lint.py
        _text_similarity.py
        adapters/
            folder_scan.py
            obsidian.py
            README.md
            zotero.py
            _common.py
            examples/
                folder_scan/
                    expected_passport.yaml
                    expected_rejection_log.yaml
                    input_fixture/
                        Chen2024_AIAssessment.pdf
                        paper1.pdf
                        Wang_2023_formative_feedback.pdf
                        中文檔名_2024.pdf
                obsidian/
                    expected_passport.yaml
                    expected_rejection_log.yaml
                    input_fixture/
                        vault/
                            .gitkeep
                            chen2024ai.md
                            invalid.md
                            wang2023formative.md
                            .obsidian/
                                app.json
                            _templates/
                                tmpl.md
                zotero/
                    expected_passport.yaml
                    expected_rejection_log.yaml
                    input_fixture/
                        .gitkeep
                        export.json
            tests/
                .gitkeep
                conftest.py
                test_check_corpus_consumer_protocol.py
                test_check_literature_corpus_schema.py
                test_common.py
                test_conftest.py
                test_folder_scan.py
                test_literature_corpus_entry_schema.py
                test_obsidian.py
                test_rejection_log_schema.py
                test_sync_adapter_docs.py
                test_zotero.py
        cross_model_verification/
            gemini_is_grounded.jq
            gemini_sources.jq
            openai_has_completed_web_search.jq
            openai_sources.jq
            openai_text.jq
        fixtures/
            audit_artifact_consistency/
                README.md
                negative/
                    a1_pass_with_p1/
                        2026-04-30T15-22-04Z-d8f3.audit_artifact_entry.json
                        2026-04-30T15-22-04Z-d8f3.jsonl
                        2026-04-30T15-22-04Z-d8f3.meta.json
                        2026-04-30T15-22-04Z-d8f3.verdict.yaml
                    a7_orphan_completion/
                        2026-04-30T15-22-04Z-d8f3.jsonl
                positive/
                    persisted_minor/
                        2026-04-30T15-22-04Z-d8f3.audit_artifact_entry.json
                        2026-04-30T15-22-04Z-d8f3.jsonl
                        2026-04-30T15-22-04Z-d8f3.meta.json
                        2026-04-30T15-22-04Z-d8f3.verdict.yaml
                    proposal_pass/
                        2026-04-30T15-22-04Z-d8f3.audit_artifact_entry.json
                        2026-04-30T15-22-04Z-d8f3.jsonl
                        2026-04-30T15-22-04Z-d8f3.meta.json
                        2026-04-30T15-22-04Z-d8f3.verdict.yaml
            check_evals_gold_set/
                clean/
                    expected_outcomes.json
                    manifest.yaml
                    tuples/
                        001-valid-doi-test.json
                        002-valid-arxiv-test.json
                        003-fabricated-test.json
            claim_audit_calibration/
                gold_set.json
            submission_package/
                clean/
                    paper.md
                    references.bib
                fallback_authoryear/
                    paper.md
                    references.bib
                fallback_latex/
                    paper.tex
                    references.bib
                marker_no_join/
                    paper.md
                orphan_intext/
                    paper.md
                    references.bib
                passports/
                    corpus_only.yaml
                    summary_join.yaml
                profiles/
                    full.yaml
                    tight.yaml
                summary_join/
                    paper.md
                uncited_reference/
                    paper.md
                    references.bib
                venue_clean/
                    paper.md
                    references.bib
                venue_violations/
                    paper.md
                    references.bib
        verification_gate/
            __init__.py
    shared/
        artifact_reproducibility_pattern.md
        benchmark_report.schema.json
        benchmark_report_pattern.md
        collaboration_depth_rubric.md
        compliance_checkpoint_protocol.md
        compliance_report.schema.json
        cross_model_verification.md
        evals_lift_report.schema.json
        ground_truth_isolation_pattern.md
        handoff_schemas.md
        mode_spectrum.md
        prisma_trAIce_protocol.md
        raise_framework.md
        sprint_contract.schema.json
        style_calibration_protocol.md
        agents/
            compliance_agent.md
        contracts/
            README.md
            audit/
                audit_jsonl.schema.json
                audit_sidecar.schema.json
                audit_verdict.schema.json
            evaluator/
                full.json
            passport/
                audit_artifact_entry.schema.json
                citation_provenance.schema.json
                citation_verification_summary.schema.json
                claim_audit_result.schema.json
                claim_drift.schema.json
                claim_intent_manifest.schema.json
                constraint_violation.schema.json
                experiment_alignment_result.schema.json
                experiment_provenance_entry.schema.json
                literature_corpus_entry.schema.json
                rejection_log.schema.json
                reset_ledger_entry.schema.json
                temporal_audit_results.schema.json
                terminal_policies.schema.json
                timeline.schema.json
                uncited_assertion.schema.json
                uncited_audit_failure.schema.json
                version_records.schema.json
            patch/
                block_manifest.schema.json
                revision_patch.schema.json
            reviewer/
                full.json
                methodology_focus.json
            submission/
                submission_verification_report.schema.json
                venue_profile.schema.json
            writer/
                full.json
        policy_data/
            nature_policy.md
        references/
            firm_rules.md
            intent_clarification_protocol.md
            irb_terminology_glossary.md
            protected_hedging_phrases.md
            psychometric_terminology_glossary.md
            word_count_conventions.md
        templates/
            codex_audit_multifile_template.md
    skills/
        academic-paper
        academic-paper-reviewer
        academic-pipeline
        deep-research
    tests/
        test_helpers.py
        test_mark_read_args.py
        __init__.py
        fixtures/
            issue_133_routing/
                README.md
                01_cross_phase_abstract_plus_lit/
                    expected.yaml
                    input.md
                    rationale.md
                02_single_phase_literature_only/
                    expected.yaml
                    input.md
                03_no_materials_ambiguous/
                    expected.yaml
                    input.md
                04_explicit_slash_command/
                    expected.yaml
                    input.md
                05_direct_mode_honored/
                    expected.yaml
                    input.md
                06_direct_mode_mid_message_not_honored/
                    expected.yaml
                    input.md
                07_direct_mode_case_insensitive/
                    expected.yaml
                    input.md
                08_full_draft_plus_abstract_plus_lit/
                    expected.yaml
                    input.md
            v3.6.6-ab/
                manifest.yaml
                README.md
                baseline/
                    paperA-casestudy-01/
                        v3.6.5/
                            evaluator_review.md
                            writer_draft.md
                    paperA-casestudy-02/
                        v3.6.5/
                            evaluator_review.md
                            writer_draft.md
                    paperA-imrad-01/
                        v3.6.5/
                            evaluator_review.md
                            writer_draft.md
                    paperA-imrad-02/
                        v3.6.5/
                            evaluator_review.md
                            writer_draft.md
                    paperA-litreview-01/
                        v3.6.5/
                            evaluator_review.md
                            writer_draft.md
                    paperA-litreview-02/
                        v3.6.5/
                            evaluator_review.md
                            writer_draft.md
                    paperC-known-fail-01/
                        v3.6.5/
                            evaluator_review.md
                            writer_draft.md
                codex-judge/
                    paperA-casestudy-01-v3.6.5.txt
                    paperA-casestudy-02-v3.6.5.txt
                    paperA-imrad-01-v3.6.5.txt
                    paperA-imrad-02-v3.6.5.txt
                    paperA-litreview-01-v3.6.5.txt
                    paperA-litreview-02-v3.6.5.txt
                inputs/
                    paperA-casestudy-01/
                        paper_configuration_record.md
                    paperA-casestudy-02/
                        paper_configuration_record.md
                    paperA-imrad-01/
                        paper_configuration_record.md
                    paperA-imrad-02/
                        paper_configuration_record.md
                    paperA-litreview-01/
                        paper_configuration_record.md
                    paperA-litreview-02/
                        paper_configuration_record.md
                    paperC-known-fail-01/
                        paper_configuration_record.md
                        stage3_reviewer_excerpt.md
            v3.9.4-temporal/
                metadata_missing_p2/
                    citation_provenance.yaml
                    draft.md
                    expected_temporal_audit_results.yaml
                    timeline.yaml
                mode_1_future_as_past/
                    citation_provenance.yaml
                    draft.md
                    expected_temporal_audit_results.yaml
                    timeline.yaml
                mode_1_legitimate/
                    citation_provenance.yaml
                    draft.md
                    expected_temporal_audit_results.yaml
                    timeline.yaml
                mode_2_legitimate/
                    citation_provenance.yaml
                    draft.md
                    expected_temporal_audit_results.yaml
                    timeline.yaml
                mode_2_version_as_evidence_past/
                    citation_provenance.yaml
                    draft.md
                    expected_temporal_audit_results.yaml
                    timeline.yaml
                mode_3_comparator_unmaterialized/
                    citation_provenance.yaml
                    draft.md
                    expected_temporal_audit_results.yaml
                    timeline.yaml
                mode_3_legitimate/
                    citation_provenance.yaml
                    draft.md
                    expected_temporal_audit_results.yaml
                    timeline.yaml
                mode_4_causal_inversion/
                    citation_provenance.yaml
                    draft.md
                    expected_temporal_audit_results.yaml
                    timeline.yaml
                mode_4_legitimate/
                    citation_provenance.yaml
                    draft.md
                    expected_temporal_audit_results.yaml
                    timeline.yaml
                mode_5_legitimate/
                    citation_provenance.yaml
                    draft.md
                    expected_temporal_audit_results.yaml
                    timeline.yaml
                mode_5_time_bomb/
                    citation_provenance.yaml
                    draft.md
                    expected_temporal_audit_results.yaml
                    timeline.yaml
                report_reference_date_freeze/
                    citation_provenance.yaml
                    draft.md
                    expected_temporal_audit_results.yaml
                    timeline.yaml
            v3_6_7_pattern_eval/
                A1/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            regulation_qa_decree.md
                A2/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            bibliography_entry_pending.md
                A3/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            entry_A_general_overview.md
                            entry_C_outcome_metrics.md
                A4/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            ministerial_order_2019.md
                A5/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            chapter_2_existing.md
                B1/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            study_protocol.md
                B2/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            study_protocol.md
                B3/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            event_calendar.md
                B4/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            study_protocol.md
                B5/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            primary_sources.md
                C1/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            chapter_body_excerpt.md
                C2/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            disclosure.md
                C3/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            audit_template_excerpt.md
                D1/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            chapter_a.md
                            chapter_b.md
                D2/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            prior_round_findings.md
                D3/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            prior_closure_record.md
                D4/
                    manifest.json
                    bad_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    good_run/
                        deliverable.md
                        expected_audit_findings.yaml
                        expected_orchestrator_action.yaml
                    upstream_context/
                        passport_snippet.yaml
                        prior_artifacts/
                            journal_word_limit.md
                integration/
                    chapter_level_run/
                        manifest.json
                        escalation/
                            expected_passport_state.yaml
                            expected_pipeline_outcome.yaml
                            user_response.yaml
                        round_1/
                            expected_pipeline_state.yaml
                            report_compiler_agent/
                                deliverable.md
                                expected_audit_findings.yaml
                                expected_orchestrator_action.yaml
                            research_architect_agent/
                                deliverable.md
                                expected_audit_findings.yaml
                                expected_orchestrator_action.yaml
                            synthesis_agent/
                                deliverable.md
                                expected_audit_findings.yaml
                                expected_orchestrator_action.yaml
                        round_2/
                            expected_pipeline_state.yaml
                            report_compiler_agent/
                                deliverable.md
                                expected_audit_findings.yaml
                                expected_orchestrator_action.yaml
                            research_architect_agent/
                                deliverable.md
                                expected_audit_findings.yaml
                                expected_orchestrator_action.yaml
                            synthesis_agent/
                                deliverable.md
                                expected_audit_findings.yaml
                                expected_orchestrator_action.yaml
                        round_3/
                            expected_pipeline_state.yaml
                            report_compiler_agent/
                                deliverable.md
                                expected_audit_findings.yaml
                                expected_orchestrator_action.yaml
                            research_architect_agent/
                                deliverable.md
                                expected_audit_findings.yaml
                                expected_orchestrator_action.yaml
                            synthesis_agent/
                                deliverable.md
                                expected_audit_findings.yaml
                                expected_orchestrator_action.yaml
                        upstream_context/
                            chapter_body_v1.md
                            chapter_body_v2.md
                            passport_snippet.yaml
                            prior_artifacts/
                                citation_list.md
                                journal_word_limit.md
                                protected_hedges.md
```

## Core Logic Samples

### `CHANGELOG.md`
```
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- **Diff/patch revision mode — Slice B revision-mode adoption (#89 Item 7, spec #390, sub-issue #424).** The MVP ship-gate slice: `academic-paper` revision mode now runs **anchorize → patch → deterministic apply → finalizer** instead of full re-emission. `draft_writer_agent` gains the `## Patch-Document Revision Emission (#390)` contract (patch document as a `phase6_*/revision_patch_round<N>.json` sidecar — hashes copied from the block manifest, never computed; `[PATCH-ESCALATION-REQUIRED:]` pre-drafting escalation tag; retry-once; provisional Schema 8 items with mechanical fields left to the orchestrator). `pipeline_orchestrator_agent` gains `## Revision-Round Patch Sequencing (#390)` (five normative steps with a no-rewrite window between manifest generation and apply; two-layer escalation gate with the MANDATORY checkpoint wording; never auto-fallback to full re-emission; escalated rounds re-anchorize under a new ID generation and stamp `mode: full_reemission_escalated`; `preserved_ratio` surfaced next to the #389 round-trip count). Schema 8 `ResponseItem` gains optional `change_block_ids` (orchestrator-populated from the apply report, §3.5 role split). New protocol doc `academic-paper/references/revision_patch_protocol.md` (exact Mode B commands, exit codes, apply report as a required re-review input, marker lifecycle). Two recorded ship decisions land as a spec §0 amendment with cross-model concurrence: **`touched_ratio` threshold = 0.6** (now the apply-script CLI default, strict `>`, 1.0 disables) and the **`insert_after` heading-anchor exemption** (anchoring on a heading no longer flags when the inserted text carries no headings; heading-bearing text still flags). §10 open items closed the verified way: `formatter_agent` gains `## ARS Marker Stripping (#390)` (all marker kinds stripped from converted final outputs only AFTER marker-dependent gates; working drafts keep markers) and `word_count_conventions.md` gains the strip-`<!--...-->`-before-count rule (first-party check found NEITHER rule previously existed — the spec's "expectation" had nothing to point at); max single-op `new_text` size folded into the existing triggers (no separate cap). New lint `scripts/check_390_revision_patch_discipline.py` (8 invariants: writer/orchestrator/SKILL/Schema 8/protocol-doc/marker-rules block-scoped literals, threshold value lock, spec-example schema validation) + 30 mutation tests, wired into `spec-consistency.yml` + the pytest manifest.
- **Diff/patch revision mode — Slice A deterministic toolchain (#89 Item 7, spec #390).** First implementation slice of the DELEGATE-52 rank-1 item: the deterministic tools exist and are tested, zero prompts touched (Slice B wires revision-mode adoption). New shared parser `scripts/_block_parser.py` (fail-closed §3.1 block segmentation: fence/heading/table/list/blockquote/text + skipped YAML frontmatter; setext underlines, line-initial raw-HTML openers, and footnote definitions rejected **by name**, never swallowed; duplicate-ID / orphan-marker / marker-stack rejection; read-side-only hash normalization). New `scripts/ars_anchorize_draft.py` (script-owned `<!--block:BNNNN-->` stamping — the LLM never assigns IDs; idempotent and content-neutral; emits the block manifest `<draft>.block-manifest.json`, the ONLY legitimate hash source a patch may copy from). New `scripts/ars_apply_revision_patch.py` (two-phase fail-closed apply: validate-everything-touch-nothing then byte-span splicing, so untouched blocks are byte-identical **by construction**; structural-shape triggers gated by `--acknowledge-structural`; `touched_ratio` recorded in every report with the threshold VALUE deliberately deferred to Slice B; machine-verified `pure_move` pairs; atomic temp+rename writes; apply report with `preserved_ratio` counters). Two new schemas under `shared/contracts/patch/` (`revision_patch.schema.json` — the `DOC-BODY-START` branch is the only legal hash-less op shape; `block_manifest.schema.json`). 86 new tests across three suites incl. the §8.3 byte-identity property test (seeded randomized patches; untouched blocks + marker lines + separator bytes asserted byte-equal), wired as 3 new CI pytest manifest entries.

### Changed

- **Plugin-root `agents/` symlinks materialized as real byte-identical copies (#413, external audit).** The three `agents/*_agent.md` files were relative symlinks into `deep-research/agents/` (v3.7.0 Phase 2.1) — on Windows checkouts without developer mode / `core.symlinks`, and in zip-download installs, they materialise as one-line text files containing the link path, silently breaking the three plugin agents. Maintainer-adjudicated fix: real copies, with the single-source guarantee the symlinks provided (the v3.7.0 Pattern C3 rationale for symlinks-not-copies) taken over by a new CI lint, `scripts/check_agents_mirror_sync.py` — a hard-pinned mirror roster enforcing set equality (a deleted mirror silently un-ships an agent; an unrostered addition has no declared source), regular-file-never-symlink (the regression itself, checked *before* byte-equality because a symlink trivially byte-matches its own target), and byte-equality with the canonical source (fix hint names the copy direction: edit the source, re-copy, never edit the mirror). The two lints that leaned on symlink resolution adapt: `check_version_consistency.py` invariant 8 now excludes the mirror dir from the unique-agent count outright (real copies no longer dedup via `resolve()`; the exclusion is sound because the mirror lint pins every file there as a pure alias), and `check_v3_10_134_write_scope.py` I5 maps a root-`agents/` file BY NAME to its `deep-research/agents/` source before the roster check — with a negative test pinning that the mapping is not an allowlist (a name with no rostered source still flags as fail-open). 10 new mirror-sync tests (3 mutations killed: symlink-branch, byte-equality, unrostered-extra) + 5 adapted/added tests across the two existing suites; lint + pytest companion wired into spec-consistency CI. Cross-model review round (1 P2, adopted with an empirical repro): the I5 remap is restricted to DIRECT children of root `agents/` — a nested `agents/sub/agents/<rostered-name>.md` no longer remaps to the deep-research source (which would have silently reopened the fail-open case the recursive glob exists to catch), pinned by a negative test. The `skills/` directory symlinks are unchanged — materializing those means duplicating the four skill trees, a separate decision if Windows source-checkout support is ever pursued. (2026-06-10 audit; follows the #301/#347 4.7→4.8 pattern).** Trigger: the primary session model moved to Fable 5, which inverts the v3.7.0 `model: opus` frontmatter floor on the three heavy commands (`/ars-full`, `/ars-reviewer`, `/ars-revision-coach`) into a **silent downgrade ceiling** — those commands now inherit the session model (the 11 light-mode `sonnet` pins are deliberate cost routing and stay; the plugin agents were already `model: inherit`). Display-name drift retired at the remaining pin sites: the `shared/cross_model_verification.md` primary-model row is now generation-agnostic ("the inherited Claude Code session model" — it stops needing a per-release bump), the SessionStart announce + `docs/PERFORMANCE.md`(+zh-TW) cost anchors are provenance-labelled ("measured on Opus 4.x", order-of-magnitude) instead of asserting a two-generations-stale "$4–6 on Opus 4.7", and the disclosure-protocol e.g. list is refreshed. OpenAI verifier lineup unified gpt-5.4 → **gpt-5.5 / gpt-5.5-pro**: the citation judge already defaulted to `gpt-5.5-xhigh` while the verification doc still taught 5.4 — and the availability case-glob `gpt-5.4*)` rejected 5.5 ids outright; web_search-on-Responses support and pricing were verified first-party 2026-06-10, legacy `gpt-5.4*` ids remain accepted, and the cost table is re-anchored on gpt-5.5 ($5/$30 per 1M). Routing smoke recalibration (#133 fixtures): **8/8 routing-class pass on Fable 5** (clarify/proceed plus all three escape-hatch behaviors — byte-0 honored, mid-message rejected, case-insensitive accepted); two destination picks additionally required the Routing-Rules/MODE_REGISTRY context the manual protocol provides. The acceptance threshold in `tests/fixtures/issue_133_routing/README.md` is reworded from "100% on Opus 4.7" to "100% on the current primary model" so the definition stops drifting per release. Two bare anti-hallucination tails on the compliance surfaces are kept as annotated debt (high-stakes domain, silent failure mode — in-file `harness-retirement` annotations added). Deliberately out of scope, tracked separately: re-baselining the #272/#273/#274 model-behavior premises against the Fable 5 system card, and a negative-framing sample-reframe of the top-3 agent files at the next minor.

### Added

- **Submission-package verifier Slice 4: terminality (#394 — closes the issue; all four slices landed).** The opt-in blocking layer, shaped by a cross-model gate-1 plan review (1 P0 / 4 P1 / 2 P2, all adjudicated; the P0 resolved as maintainer Option B). New `terminal_policies.submission_package` key (closed enum `{advisory, strict}`, per-key absence = advisory via the evaluator runtime convention — the citation_existence pattern; no JSON-Schema `default`). The **§5.3 single-homed boundary is sharpened, not moved** (Option B): the orchestrator stays the sole *reader/selector* of the policy and hands the resolved value down via the new `--policy` CLI flag; the script *mechanically applies* it — stamps `header.policy_slug` (argparse default **None**: a flag-less standalone run is *unevaluated*, stamped null, and a null-stamped report never satisfies pipeline freshness — never "default advisory"), and under `strict` emits the terminal verdicts: a strict-eligible `fail` → stdout token `TERMINAL-BLOCK policy=submission_package` + exit 1; else a strict-eligible `not_checked` → `VERIFICATION-INCOMPLETE` + new exit 4 (fail-closed §5.2 — a missing parser/profile cannot waive the class the scholar opted into; `not_applicable` never composes into either verdict, keyed on status not the eligibility bit). **Terminal signals are the stdout tokens, never raw exit codes** — exit 1 also carries nonterminal heuristic fails (gate-1 P1). New `--check-freshness` mode (REQUIRES `--policy`): recomputes the package fingerprint + compares the stamped slug, mismatch/null/missing → `STALE-REPORT` + new exit 5, no checks re-run, no writes. The fingerprint exclusion set grows to report + `provenance_summary.md` (gate-1 P1: the formatter appends the advisories section AFTER stamping — fingerprinting the advisory carrier would self-stale every evaluated report). Orchestrator gains the Stage 5 post-formatter **Submission-Package Terminal Gate** section (resolve-absence-to-advisory + always-explicit `--policy`, gate-on-tokens, fix loop bounded 2 rounds then surface, strict-needs-a-venue-profile remediation stated plainly, freshness-before-reuse, recompute-each-pass C-V6(h) mirror); formatter gains the **Submission Package Advisories** `provenance_summary.md` section (mandatory and non-empty iff any fail/warn/not_checked under advisory; stamp-only Invariant 13 untouched). New `scripts/check_394_submission_policy.py` (5 invariants) + 26-test companion — invariant 4 is an **AST single-homed guard** (Subscript/`.get` access of `terminal_policies`), not a literal grep, because the verifier's docstring legitimately says the word (gate-1 P2). 17 new verifier tests (79 in the verifier file; 105 total with the lint companion) incl. an `evaluate_policy` decision-table unit pin (the advisory/strict divergence lives inside the evaluator, not at the call site), byte-equivalence by before/after hashes, and three killed mutations (eligibility gate, fingerprint exclusion, null-freshness reason token). **Gate-2 cross-model diff review (2 P1 + 1 P2, all adopted) + an independent context-reviewer pass over the two prompt sections (2 P1 + 4 P2, all adopted):** a FRESH report now re-emits its policy verdict on `--check-freshness` (same token + exit semantics as a live run — a recorded terminal verdict can never evaporate across a resume), the report header gains `inputs_fingerprint` over venue-profile/passport/join-map bytes (a report produced under one venue profile is STALE under another; legacy reports without the field never read fresh), the v3.10 `policy_hash` marker stamp is scoped to CITATION-TIME keys (`submission_package` never stamps markers — a package-only strict passport no longer forces marker re-finalization or stale-refuses legacy markers; oracle + test updated), the orchestrator gate's advisory path now explicitly re-dispatches the formatter in append-only mode (the advisories section had no named writer), TERMINAL-BLOCK's stdout-vs-marker channel reuse is disambiguated in place (the `policy=` value is the discriminator), the fix-loop round is defined (dispatch formatter → re-run verifier; never a 3rd), VERIFICATION-INCOMPLETE remediation is routed away from the formatter fix loop (a missing profile is not formatter-fixable), token matching is pinned to line-prefix, and the freshness `policy_mismatch` line reprs the stamped slug (a forged report cannot inject a fake token line into stdout). A final confirmation round (2 P2 + 1 P3, all adopted) added the reuse-side roster guard (a hand-edited `checks: []` report is `STALE-REPORT reason=roster_mismatch`, never a clean re-evaluation — the report file is outside the package fingerprint, so content validation must not be skipped on reuse), `--join-map` to the orchestrator's live verifier command (live and freshness invocations must carry the same input set or the inputs fingerprint can never match), and direct-value enum comparison in lint invariant 5 (the string "None" must not pass for JSON null).

- **Submission-package verifier Slice 3: Family A blind-review residue scan + Family D assessment (#394).** The high-embarrassment-cost class. Trigger is presence-or-declaration (§3.1): an anonymized variant in the package (filename stem token `anonymized`/`blind`/…) or a declared `blind_review: double` — untriggered packages report the new **`not_applicable`** status (additive report-schema enum), visibly distinct from `not_checked` so a single-blind package is not condemned to exit 3 forever. Checks: **A1** PDF `/Author` + XMP `dc:creator` via `pypdf` (the only new parser dependency; `defusedxml` is additionally declared in requirements-dev as XML-bomb hardening with a stdlib fallback; pypdf absent → `NOT-CHECKED(parser unavailable)`, never folded into pass per §1.4), **A2/A3** DOCX metadata + tracked-changes/comment authors read RAW from the zip parts via stdlib `zipfile` + XML (`defusedxml` hardening when available) — a refinement over the planned `python-docx`: closer to the §1.3 artifact≠rendered-view premise and the DOCX residue class has no missing-parser hole at all, **A4** acknowledgments section in the blind variant (deterministic signal, strict-eligible ONLY when the profile declares the new `acknowledgments_forbidden_in_blind: true` — the §3.1 load-bearing two-axes rule, enforced via a downward-only eligibility override), **A5** self-citation phrasing (heuristic by class; ships a first-party zh-TW draft list per §10 item 1; curated by the maintainer 2026-06-10, adding 本文作者先前), **A6** author-name tokens from the non-anonymized artifacts' metadata appearing in package filenames (heuristic; the metadata-source originals themselves are exempt), **A7** declared-double-blind with no anonymized variant = fail (the most basic residue: the blind version is missing). **Family D ships nothing**: the slice-3 deliverable is the adjudication-ready assessment (`docs/design/2026-06-10-394-family-d-repro-lock-assessment.md`, recommending no-check with the B4 `required_sections` escape hatch — the `repro_lock` gates-don't-read-it boundary stands untouched; adjudicated Option 2 by the maintainer 2026-06-10). 16 new tests (55 total; corrupt-docx honesty, parser-absence honesty, A4 conditional-strictness mutation killed).

- **Submission-package verifier Slice 2: scholar-declared venue profile + Family B limits checks (#394).** Second slice of the #394 spec. New `shared/contracts/submission/venue_profile.schema.json` (standalone, Invariant 11 pattern; `declared_by: scholar` is the only provenance value and the CLI refuses a profile without the stamp) and a `--venue-profile` flag enabling five deterministic, strict-eligible checks: **B1** manuscript word count, **B2** abstract word count (both ±2% tolerance per §3.2), **B3** keyword count range, **B4** required sections (case-insensitive heading containment), **B5** reference-count ceiling against the same machine-readable reference list Family C uses. The no-inference rule is structural (R-L3-2-D mirror): without a profile every Family B check reports `NOT-CHECKED(no venue profile)`; a partially-declared profile runs what it can and `NOT-CHECKED`s the rest with the undeclared field named; declared limits whose actuals cannot be located (no abstract section, no keywords line) report `NOT-CHECKED` with the reason, never a guess. This also makes the exit-code semantics visibly honest: a profileless run that is otherwise green exits 3 ("passed what was checkable", §8), not 0. Word counting reuses the canonical whitespace-split convention (`shared/references/word_count_conventions.md`); LaTeX counting adjudicated per spec §10 item 4 as naive detex + whitespace-split, with the method and counted file declared in the report detail. Intake Step 3 gains the optional declared-values-only venue-profile follow-up (plan mode exempt, mirroring Steps 12/13) + a PCR `Venue Profile` row. 14 new tests (39 total) incl. tolerance-boundary and provenance-gate mutations; fixture `venue_clean` passes every B check against `profiles/full.yaml`, fixture `venue_violations` fails all five against `profiles/tight.yaml` (mutation discipline). Cross-model review (codex) adopted in full: schema-strict CLI validation (closed field set, bool≠int), `word_count_scope: all` counts everything, and canonical-name manuscript selection with `NOT-CHECKED(ambiguous manuscript)` instead of silently picking the wordiest candidate.

- **Submission-package verifier Slice 1: CLI skeleton + Family C reference integrity (#394).** First implementation slice of the 2026-06-10 #394 spec (slices are dependency-ordered; Family C ships first because it needs zero new parser dependencies). New `scripts/verify_submission_package.py` standalone CLI: point it at any output package directory and it runs the two-way reference-integrity set check (orphan in-text citation = `fail`, uncited reference entry = `warn`) and writes `submission_verification_report.json` validating against the new `shared/contracts/submission/submission_verification_report.schema.json`. The deterministic **joined marker path** consumes `<!--ref:slug-->` markers plus a real prose-reference join — the passport's `citation_verification_summary[]` (`--passport`), an explicit scholar-supplied map (`--join-map`), or a package `.bib` via the documented slug==citation_key identity relation — and markers with NO join source report `NOT-CHECKED(missing prose-reference join)`, never a guessed comparison (§3.3). Non-ARS / post-converted packages fall back to format-aware **best-effort extraction** (`\cite{}` for LaTeX, author-year regex for Markdown), heuristic-classed: the schema STRUCTURALLY forbids `signal_class: heuristic` + `strict_eligible: true`, so the fallback path can never be promoted to blocking by any later policy slice. Report header carries `extraction_path`, `not_checked_count` (incompleteness is never folded into pass, §1.4), `package_fingerprint` (spec §10 open item 3 adjudicated: the audit-snapshot manifest convention — byte-sorted `path:sha256` lines, fingerprint = SHA-256 of the manifest, report file excluded), and `policy_slug` (always null until the slice-4 orchestrator hook; the script never reads `terminal_policies`, §5.3). Exit codes separate "all checked, pass" (0) from "passed what was checkable" (3) per §8. 19 tests + 7 fixture packages with mutation discipline (orphan / uncited / no-join failures proven to fire); CI-wired via the pytest manifest. Advisory-only: no manuscript byte changes, no pipeline hook yet (slice 4). #394 stays open until all slices land.

- **Design doc: deterministic submission-package verifier (#394, blindspot-audit F-5, design-first — no implementation yet).** `docs/design/2026-06-10-394-submission-package-verifier-spec.md` designs `scripts/verify_submission_package.py`, the script-layer backstop for the mechanical subset of the formatter's prompt-layer submission checklists (the #182 promotion pattern: LLM self-check → deterministic gate). Three check families in adjudicated priority order — blind-review residue (raw-structure scan: PDF/DOCX metadata authors, tracked-changes/comment authors, self-citation phrasing; **artifact ≠ rendered view** is a stated premise), venue-declared limits vs actuals (scholar-declared `venue_profile` schema, never inferred from the journal name — R-L3-2-D mirror), reference integrity (two-way set check; the deterministic path requires an explicit slug↔key join source or reports `NOT-CHECKED`) — plus a stretch *assessment* of `repro_lock` presence/shape checking that leaves the recorded gates-don't-read-it boundary untouched. Two load-bearing rules: `signal_class` and `strict_eligible` are separate axes (heuristic checks are structurally excluded from strict; A4's deterministic signal still isn't block-worthy because the de-anonymization judgment is the scholar's), and **strict fails closed on incompleteness** (`VERIFICATION-INCOMPLETE` when a strict-eligible check can't run — a missing parser must not silently waive the one class the user opted into blocking on). Terminality via a new additive `terminal_policies.submission_package` key, evaluated by the orchestrator against a fingerprint+policy-slug-stamped report (package-level freshness guard — explicitly a new post-format gate, not the ref-marker stamp path). Cross-model reviewed (codex): 2 P1 (Family C join requirement; strict fail-open on NOT-CHECKED) + 4 P2 + 2 P3, all adopted. 4 dependency-ordered slices; advisory-only until slice 4.

- **`Real-use findings` release-notes convention documented; showcase refresh tracked (#395, blindspot-audit F-9).** CONTRIBUTING.md gains a Release checklist section documenting the convention: a release's CHANGELOG entry includes a `Real-use findings` subsection when issues were discovered through actual use on a real paper — one line per issue naming the run — so lived-experience provenance has a fixed, greppable home instead of being buried in spec prose (the v3.6.7 production chapter run surfaced 17 drift patterns and nothing structural recorded that provenance class; release motivation since v3.8 has been almost entirely external papers, which is itself a per-release signal worth seeing). Omitted when empty, never padded. The showcase refresh half of F-9 (no post-v2.7 end-to-end artifact set exists) is split to tracking issue #404, blocked on the next real paper with no artificial deadline per the adjudication.

- **POSITIONING records two non-goals; cross-paper workflow guide ships (#397, blindspot-audit F-1B/F-7).** POSITIONING.md's recording discipline (five Rejected mechanisms with rationale) had two adjacent boundaries existing only as silence. A new "Recorded non-goals" section records both with the same boundary-plus-review-criterion treatment: **post-publication lifecycle** (own-paper citation tracking / errata / OA self-archiving — the front is research-to-publication; `monitoring_agent` is unaffected since it alerts on *cited* literature, not the scholar's own output) and **research-program-level state** (no cross-paper claim registry / limitations memory / reviewer-history profile — the per-paper Material Passport stays the only state carrier, a deliberate anti-leakage consequence). The supported no-mechanism path for returning authors ships as `docs/cross-paper-workflow.md`: (1) re-feed the prior paper's passport through the existing input port — a prior `ok` is a head start, not a waiver, stamps re-derive under current policies; (2) bring prior limitations / unresolved reviewer points to RQ incubation as scholar-supplied Socratic input — ARS asks about *your* reading, never derives next-RQ candidates (Kong L2 cross-linked); (3) Claude Code assistant memory may serve as a personal reminder layer with the load-bearing caveat that ARS gates never read or trust it — the workflow must work identically on a machine with no memory at all. Documentation only; no schema, flags, or cross-run mechanism.

- **Intake Step 13: citation-verification level surfaced at the configuration interview (#392, blindspot-audit F-8, adjudicated "keep default, add a prompt so the user chooses").** The v3.11 citation-existence gate's `strict` mode existed only in README prose and the v3.10/v3.11 specs — a QUICKSTART user had no signal the choice existed. The intake interview gains Step 13: "Citation verification: **mark only** (default) / **strict**", with one sentence of field guidance (strict suits DOI-dense fields; mark-only suits grey-literature-heavy fields). **Byte-equivalence is load-bearing**: a `strict` answer seeds `terminal_policies.citation_existence: strict` on the Material Passport at the point it is materialized (the finalizer stays the sole policy *evaluator*); a `mark only` or absent answer records the PCR row and **writes nothing** — per-key absence already means advisory (Invariant 7), so an unprompted run is byte-identical to pre-#392. Plan mode exempt (mirrors Step 12). No default changes anywhere. Guarded by `scripts/check_392_citation_verification_intake.py` (4 invariants, mutation-verified): Step 13 heading present (rename = fail-loud parse error), the no-handoff directive affirmatively reaches Step 13 (`then Step 13` — the exact #327 P1 orphaning that hit Step 12), PCR row present, and the advisory write-nothing rule + strict seeding target retained. 8 unit tests; wired into `spec-consistency.yml` + the CI pytest manifest.

- **Layer-5 contribution-significance probes extended into plan mode and revision coaching (#393, blindspot-audit F-2, adjudicated shape 1).** ARS quality machinery was defect-oriented end-to-end — a paper could pass every gate and still be a micro-extension, because the only constructive contribution coaching (socratic_mentor Layer 5, SIGNIFICANCE & CONTRIBUTION) lived at the RQ-incubation stage. Layer 5 now defines three **later-stage anchored forms** with stable IDs — **L5-W1** "Ten years from now, what will citers say this paper established?", **L5-W2** "Remove this paper from the literature — what is missing?", **L5-W3** "If this paper succeeds, who would make different decisions as a result?" — and two later-stage surfaces consume them strictly by ID (the question text lives in Layer 5 and only there; a Layer-5 edit propagates by reference instead of forking — the cross-model review's P1 on a first draft that carried labeled copies): **(1)** `academic-paper` plan mode gains Step 2.5 CONTRIBUTION SHARPENING between chapter negotiation and the argument stress test — the mentor asks the user to articulate the contribution their own Chapter Summaries claim, quoting only user-written text; if the user articulates one, `[INSIGHT: contribution_claim]` records it in the user's words, otherwise the open question is carried into Step 3, never filled in; **(2)** `academic-paper-reviewer` Phase 2.5 gains step 3, a contribution framing probe alongside the existing prioritization steps (5→6 steps; no external step-number references existed), anchored to what the manuscript already claims. The orchestrator's Stage 3→4 coaching sketch now explicitly defers to the reviewer SKILL.md six-step list as authoritative (net-zero line edit — the surface has 1 line of v3.6.7 budget headroom left). Boundary is load-bearing (Kong L2 verb test, per the #393 adjudication that rejected shapes 2–3): questions only — never propose, substitute, rank, expand, or select a contribution claim. Prose-layer only; no schema, scoring, or agent-roster change. Two review gates, all findings adopted: codex cross-model (1 P1 + 2 P2 + 1 P3 — ID-based single-sourcing, verb-test tightening, orchestrator deferral, conditional INSIGHT) and an independent context reviewer (1 P1 + 1 P2 — the repo has TWO same-named `socratic_mentor_agent.md` files and plan mode dispatches the academic-paper variant, which had no Layer 5 and no Step 2.5 in its own flow, so the probe would never have fired: the agent prompt gains a Step 2.5 section referencing L5-W IDs by full path, the protocol's inline reference is path-disambiguated, and L5-W3's anchor permission is tightened to noun-phrase-swap-only).

- **Interaction-count budget surfacing + Context Hygiene dispatch discipline (#388; DELEGATE-52 Items 4+5 from #89).** The two cheap, high-confidence follow-ups from the re-ranked DELEGATE-52 work order (arXiv:2604.15597), both prose-layer. **Item 4:** the v3.2 Budget Transparency block in `academic-pipeline/SKILL.md` now also presents an **interaction-count budget** at pipeline start — the paper's core result is that long-horizon corruption compounds with document round-trips, not token volume, so the block enumerates the round-trip caps the pipeline already enforces (2 revision loops, 8+5 Socratic coaching rounds, the integrity fix→re-verify loop), states the worst-case total for the chosen mode, and reports the accumulated count at every stage checkpoint. Advisory only — the per-loop caps remain the enforcement layer; exceeding the stated worst case signals an uncovered loop and must be surfaced, never silently continued. **Item 5:** `pipeline_orchestrator_agent.md` gains a **Context Hygiene at dispatch** block targeting the paper's distractor ablation (non-target documents in context measurably worsen outcomes): each handoff carries the receiving agent's declared inputs plus the Material Passport — never the accumulated pipeline as a convenience bundle; scratch output and superseded drafts do not ride forward (later stages read passport entries, not raw transcripts); supersession means dispatching the current version only, with prior versions retrievable through the versioned-artifact trail. The passport carry-forward obligations (claim/audit aggregates, `experiment_intake_declaration`, `slr_lineage`) are explicitly exempt — trimming applies to loose materials, never passport fields. Carries an epistemic-status line (dispatch-assembly discipline, not a runtime guarantee). Scope note recorded in #388: this lands the single-dispatch-point version; #89's per-downstream-agent sketch stays open under the parent. Items 1, 2, 7, 8, 9 remain tracked in #89.
- **Repository-hygiene CI (#151).** A `repository-hygiene.yml` workflow runs gitleaks over the **full git history** on every PR and main push, with the upstream default ruleset and **no custom rules**. The binary is version-pinned (8.30.1) and **checksum-verified** rather than pulled via the marketplace action (which needs an org license key; a pinned release binary keeps the supply chain auditable), and `--redact` keeps any genuine hit out of public CI logs. The only local configuration is a false-positive allowlist (`.gitleaks.toml`): the 2026-06-10 baseline evaluation found **43 findings across 518 commits — every one a bibliographic citation key** (`Becht2019UMAP`, `vaswani2017-arxiv-v1`, `forthcoming2024`) in eval gold tuples / adapter fixtures / version-family examples matching the `generic-api-key` heuristic's key-shaped-string pattern, **zero true positives** — so those literature-identifier paths are allowlisted by path, never by rule edit (a new tuple under an allowlisted path needs no config touch). A seeded-credential mutation test confirms the configured scan still exits 1 on a real-pattern secret outside the allowlist (`github-pat` hit) — and recorded a method caveat: a low-entropy dictionary-word seed does NOT clear the entropy gate, so a valid mutation check needs a real-pattern, high-entropy seed. Closes the `defer:v3.10` evaluation with an **adopt** decision: all three decision criteria pass (no infra burden — public pinned binary; bounded maintenance surface — path entries only; post-allowlist FP rate 0 on the full history).
- **Field-norm severity calibration across the reviewer surfaces (#215, Kim et al. 2026 arXiv:2605.20668v1 §5.1 W1 + §F.3.4).** Closes the paper's largest documented AI-reviewer failure class: a critique that is content-correct against a discipline-neutral standard but **severity-miscalibrated** because the reviewer lacks the subfield's accepted-practice prior (W1, n=54 — the CERN/LHCb reproducibility example), plus the sibling significance-boundary error from the "would addressing this change the core result?" formula (§F.3.4, 56 errors). Three reviewer surfaces are hardened, each at severity-assignment time and applying to **every** field-norm-dependent finding (not only CRITICAL): **`domain_reviewer_agent.md`** gains a Step 5 hard rule — a severity that rests on a field norm MUST be grounded in an external checkable source (a reference, venue/data policy, community standard, reporting guideline, or documented expert practice — explicitly **not** limited to a literature citation, and **not** model knowledge), else down-rate to advisory + `[FIELD-NORM UNVERIFIED]`; **`devils_advocate_reviewer_agent.md`** gains a 9th challenge dimension (the DA turns the lens on its own findings, since adversarial intensity amplifies an ungrounded norm into a CRITICAL) plus two required CRITICAL/MAJOR output columns `field_norm_boundary` + `evidence_crossing_rationale`; **`calibration_mode_protocol.md`** gains a Phase 3.5 severity-miscalibration measurement + a low/med/high histogram in the Calibration Report — a signal the binary FNR/FPR matrix cannot show, where the classifier rates whether the reviewer **supplied external grounding**, not whether the norm is factually correct (guessing norm-correctness would repeat the very W1 failure under audit). A **first-party regression fixture** ships at `evals/gold/field_norm_severity/` (10 cases — 5 W1 field-norm-boundary + 5 §F.3.4 significance-boundary — extracted verbatim from the paper with section/example-ID + paper-citation-token + verbatim-anchor provenance; the SAR 11.7T case flagged `exception: true` because experts concurred with the AI there). Because there is no deterministic detector for field-norm severity miscalibration, the fixture is a regression set, not a calibration set: `scripts/check_field_norm_severity.py` validates data integrity + first-party provenance (no FNR/FPR ritual), and `scripts/check_215_field_norm.py` asserts all three reviewer surfaces carry their blocks with **block-scoped** keyword checks (fence-aware) so a stray keyword cannot mask a missing rule. The two lints survived a three-pass cross-model (codex xhigh) review that drove finding count 4 → 2 → 0; every fix is mutation-tested (28 tests). Additive and backward-compatible; CI-wired via the spec-consistency workflow + pytest manifest. (#216 — the §F.3.6 reviewer-type parity half — was split out: it needs a different gold set of human-phrased vs AI-phrased paired cases.)
- **Surface-Form Parity self-check (#216, Kim et al. 2026 arXiv:2605.20668v1 §F.3.6).** Closes the paper's reviewer-type asymmetry: an AI meta-reviewer applying **two standards keyed off prose style** — demanding literal precision from informal/vague (human-typical) wording, so it over-rejects correct concerns (29 of 41 correctness false negatives involved human reviewers), and crediting technical specificity in precise (AI-typical) wording, so it over-accepts incorrect ones (10 of 13 false positives involved AI reviewers). The root cause the paper names is a learned prior that *specificity correlates with correctness*. **Key design call (after a codex xhigh consult): the hook is prose style, NOT the author label** — so the mitigation is a *Surface-Form Parity* self-check (not "authorship parity"), and authorship is kept **out** of the runtime reviewer-item schema entirely (not merely audit-only). **Two verdict-time surfaces** carry the parity self-check (a codex review found the editorial synthesizer also arbitrates reviewer sub-claims and down-ranks "too vague" criticisms — exactly where §F.3.6 fires): **`devils_advocate_reviewer_agent.md`** gains a verdict-time parity self-check (a marker block, distinct from #215's severity-time gate) and **`editorial_synthesizer_agent.md`** gains a Step 1c arbitration-time check + a reworded "reduce weight if too vague" rule that fires only when vagueness makes a sub-claim unevaluable. The DA check: extract the checkable claim → judge it against the paper not the polish → do **not** down-rate informal/vague wording unless ambiguity changes truth conditions → do **not** credit technical specificity without checking → run the opposite-style counterfactual and revise / mark ambiguous on a flip. A **mixed-provenance regression fixture** ships at `evals/gold/surface_form_parity/` (7 cases: 4 `paper_verbatim` §F.3.6 examples + 2 maintainer-authored `counterfactual_rewrite` paired variants carrying `derived_from` + `semantic_equivalence_rationale` + 1 `maintainer_boundary` documenting the "unless unevaluable" clause). Because there is no deterministic detector for the surface-form bias and the 29/10 split is directional (§H), the fixture is a regression set, not a calibration set: `scripts/check_surface_form_parity.py` validates integrity + **provenance honesty** (paper_verbatim quotes the paper; maintainer-authored items never claim paper-verbatim) + **pair invariants** (paired items hold claim + verdict constant, differ only in framing) + no rotting pdftotext line anchors — no FNR/FPR ritual. The **schema decision is enforced at runtime** by `render_judge_view()`, a whitelist projection (judge sees only an index-derived opaque `handle` + `review_item_text`) proven by a serializer-strip test to leak no blind field — including the nested `provenance.reviewer_source` author label and the answer-encoding fixture `id` itself (`-cf` / `-ambiguous` suffixes, per codex review). `scripts/check_216_surface_form.py` asserts the DA carries every load-bearing clause **block-scoped + fence-aware** (six-class mutation suite). `run_evals` discovers the fixture and marks it `pending` (no native measurer, by design — pinned by a `test_run_evals` test so it cannot false-green through the eval gate). **Negative scope: #273 (rubric-aware calibration) is NOT folded in** — it is a different mechanism (an interpretive caveat with no detection claim); #216 carries a cross-reference only (design note + PR body + `manifest.yaml` `related_issues`), with no shared prompt / gold / lint / runtime wiring. Additive and backward-compatible; CI-wired via the spec-consistency workflow + pytest manifest. Design note: `docs/design/2026-06-09-216-surface-form-parity-design.md`.

## [3.12.1] - 2026-06-15 — Reviewer-response triage modes (PR #433 integration)

### Added

- **`deep-research` `three-way-scan` mode** — a lightweight WHY/HOW/WHAT paper-comparison triage that sits between `quick` and `lit-review`. Produces a per-paper WHY/HOW/WHAT shortlist plus a cross-paper synthesis (common WHY, divergent HOW, strongest WHAT, unresolved gap), and escalates to `lit-review` / `systematic-review` for full coverage. (`deep-research` 2.9.4 → 2.10.0)
- **`academic-paper` `rebuttal-audit` mode** — standalone advisory QA of an author's existing rebuttal/response draft against the reviewer comments (per-comment coverage table + gap list + risk flags for tone/evidence/misread). It generates nothing and, because a standalone invocation runs outside the pipeline, it **explicitly suppresses** Schema 11 emission / Material Passport writes / `ready_to_submit` status — enforced by a new `check_rebuttal_audit_guard()` lint with mutation coverage. Routed by input shape: both reviewer comments AND an existing draft → `rebuttal-audit`; comments only → `revision-coach`.
- **`revision-coach` scope extension** — its trigger/docs now cover pushback/disagreement posture and non-journal scopes (conference rebuttal, grant-panel response, transfer-after-review).
- **`/ars-3w` and `/ars-rebuttal-audit` slash commands.**

### Credit

Integrated from [@Yaobin29](https://github.com/Yaobin29)'s [PR #433](https://github.com/Imbad0202/academic-research-skills/pull/433). The original PR proposed a standalone `reviewer-response` skill; this release folds its genuinely-novel parts into existing skills as modes, per ARS's mode-based architecture. The `rebuttal-audit` mode rescues that PR's `audit` concept. Suite mode count 25 → 27 (still 4 skills).

## [3.12.0] - 2026-06-08 — Kong auto-research feature track: experiment provenance, figure fidelity, cross-paper contradiction, partial-evidence decomposition

### Added

- **Experiment Provenance Intake + claim→experiment alignment — a schema-first evidence-ledger layer for experiment-backed claims (#260, Kong et al. 2026 §3.3 + §7.4.3).** ARS deliberately keeps experiment *execution* outside the pipeline; the scholar runs experiments externally and brings results back. This change adds the **intake + alignment** layer only — it does **not** run experiments, judge whether one was correctly designed/run/statistically-adequate/reproducible, auto-fill provenance, or require provenance for literature-only pipelines. Two blocks ship together. **Block A — `experiment_provenance[]` intake array:** a new optional Material Passport aggregate (`shared/contracts/passport/experiment_provenance_entry.schema.json`) where each scholar-entered entry carries a **nested `repro_lock`** (the same inline-object shape as the passport-level lock, re-declared not `$ref`'d because the source is inline prose, not a schema file), a `planned_vs_executed[]` record (each `executed:false` unit carries a gate-checked `skip_reason`), and `negative_results[]` / `known_limitations[]` arrays whose **key must be present** (an empty `[]` is well-formed and routes to a disclosure advisory; an *absent* key is malformed → gate FAIL, the absent-key rule ported from #261's C3). **Block B — claim→experiment alignment:** the claim manifest gains an optional per-claim `planned_experiment_ids[]` join field (parallel to `planned_refs`, minItems 1, optional-absent), and a new **fourth ref_slug-less claim-finding aggregate** `experiment_alignment_results[]` (`experiment_alignment_result.schema.json`) — alongside the existing `uncited_assertions` / `claim_drifts` / `constraint_violations` siblings — with an experiment-specific MECE verdict enum `{ALIGNED, OVERSTATED, NOT_SUPPORTED_BY_PROVENANCE, PROVENANCE_INSUFFICIENT}`. The verdict is **produced by the integrity verification agent AT the gate** (Stage 2.5 sampling / Stage 4.5 full), not by the citation-audit agent at the Stage 4→5 boundary — mirroring #261's Phase C3, so the row is emitted and gated in the same pass and the stage-ordering race (a verdict landing *after* the gate ran) cannot occur. A **mixed-evidence claim** carrying BOTH `planned_refs` and `planned_experiment_ids` is audited by both paths and the gate decision is **worst-verdict-wins** (an OVERSTATED experiment path blocks even when the citation path is SUPPORTED). **`experiment_id` is frozen at intake** (a post-intake rename is a re-intake event, not a silent edit). Seven new cross-array invariants land in `scripts/check_claim_audit_consistency.py` (JSON Schema cannot express cross-array integrity): **EP-INV-1** (experiment_id unique/passport), **EP-INV-2** (planned_experiment_ids resolve — doubles as the rename + forward-reference dangling-pointer guard), **EP-INV-3** (experiment ids ⟹ empirical kind; mixed literature+experiment allowed), **EP-INV-4** (declaration↔provenance symmetry), **EP-INV-5** (declaration well-formedness when present: `status` enum / `declared_by: scholar` / non-empty `declared_at` — so a malformed declaration like `status: "garbage"` FAILs deterministically instead of slipping past the symmetry check), **EA-INV-1** (finding_id unique), **EA-INV-2** (alignment-row references resolve; a dangling `experiment_id` is a structural FAIL, **never** a `PROVENANCE_MISSING` verdict — that value is deliberately absent from the enum, so no fake judge fields are forced for a row where no judge ran). A persisted passport-level **`experiment_intake_declaration`** closes the anti-skip circularity with a fail-closed legacy boundary, split across two enforcement layers (stated precisely, not conflated): the **lint deterministically enforces** declaration↔provenance *symmetry* (EP-INV-4) and declaration *well-formedness* (EP-INV-5); the **integrity gate (a Stage-1/Stage-4.5 check, NOT the lint) owns the `ars_version` numeric legacy decision and the declaration-presence FAIL** — a passport is `legacy_unknown` (advisory) only with positive `repro_lock.ars_version < #260-constant` proof, everything else (including a passport with no `repro_lock`, or one with no `ars_version`) is treated as post-#260 so the declaration is REQUIRED and its absence FAILs at the gate, meaning a new run cannot dodge it by making its version unprovable. The `ars_version` numeric half is deliberately left at the gate layer (not promoted to a lint constant) because the #260 release version it compares against is frozen at ship time, not at intake. Literature-only pipelines therefore still emit a one-line `no_experiments_declared` declaration (no `experiment_provenance[]` needed). Producers taught in lockstep (schema-first writer-binding discipline): the three manifest emitters (`synthesis_agent` / `draft_writer_agent` / `report_compiler_agent`) emit `planned_experiment_ids` when an experiment backs a claim; the integrity agent gains a new disclosure-only Phase (D6) carrying the POSITIONING non-goal verbatim ("does not judge whether the experiment was correctly designed, run, statistically adequate, or reproducible by ARS"); the orchestrator carries `experiment_alignment_results[]` + the declaration forward; README intake detection sets the declaration. **Drift guard:** the repro_lock field set is single-sourced in `scripts/repro_lock_validation.py` (imported by both `check_repro_lock.py` and the new standalone `check_experiment_provenance.py`), with a drift test asserting the nested schema's required keys equal the shared constants. **Three documented departures from the issue's literal text** (each corrected after a first-party tracked-repo read): `repro_lock` is an inline-prose object, not a schema file, so "inherit repro_lock" means nesting the shape, not `$ref`'ing a non-existent file; the claim manifest had no experiment pathway, so the join is *added*, not assumed; and "Path X / Tier-1 required / writer-binding" are not named conventions in the tracked repo, so the discipline is *described* rather than cited by a name a reader cannot find. Schema + manifest edit + 7 lint invariants + standalone shape validator + drift guard + integrity/writer/orchestrator agent prompts + README mirrors + `examples/passport_with_experiment_provenance.yaml` (2 experiments, a mixed-evidence claim, an OVERSTATED alignment row) + full TDD suite (schema ±, fail-closed symmetry, declaration well-formedness, mixed-evidence two-row, verdict-derivation, mutation-verified non-vacuous invariants, reverse-invariant producer pins, drift, literature-only regression). The new schemas, the manifest field, and all seven invariants are additive and backward-compatible. Spec: `docs/design/2026-06-08-260-experiment-provenance-intake-spec.md`.
- **Cross-paper contradiction inventory — structured, inspectable enumeration in the synthesis layer (#262, Kong et al. 2026 §7.4.2).** `synthesis_agent` already had prose-level contradiction handling (Anti-Pattern 3, the Step 3 Contradiction Resolution procedure, and the Contradictions & Resolutions table), but that prose narrative-discussed contradictions (including reconcilable-vs-irreconcilable verdicts) without making the *set of assessed paper-pairs* and the *unresolved / checked-clear* pairs enumerable for the scholar to confirm — the multi-paper relational-reasoning gap Kong et al. 2026 (arXiv:2605.18661 §7.4.2) document for research-synthesis systems. A new **Step 3b — Cross-Paper Tension Inventory** is added **additive to** (not a replacement of) the existing Step 3 prose: the agent emits a `cross_paper_tensions[]` markdown block — one entry per assessed candidate pair carrying `pair_id`, `paper_a`/`paper_b`, `candidate_basis`, `overlap_topic`, `a_finding`/`a_evidence_pointer`, `b_finding`/`b_evidence_pointer`, `pair_assessment`, `resolution_status`, an iff-resolved `resolution_pointer`, and `scholar_confirmation`. **Prose-layer only — no JSON Schema, no lint invariant, no gold fixture** (mirroring the #214 / #261 prose-layer decision, NOT the #213 schema-layer one): the producer (`synthesis_agent`) and the readers (the scholar plus the report/integrity LLM agents) all read prose, there is no deterministic downstream parser, and the judgment that matters — "is this a genuine contradiction vs. a conditional difference" — is irreducibly semantic, so machine-validating the YAML shape would prove field presence, not contradiction fidelity. **This deliberately departs from the issue's literal acceptance** (which read "schema adds `contradiction_pairs[]` block" + "calibration gold set accuracy ≥ 0.75"): the named "downstream consumers" (formatter, integrity_verification) are themselves LLM agents reading markdown — there is no machine consumer — so a schema would be the exact false rigor #261 rejected, and 20 LLM-judged pairs are too few and too nondeterministic across runs to wire as a hard CI gate (**no calibration artifact ships** in this change — any future or manual calibration should be recorded out-of-band with its model/date/prompt + a confusion matrix and stay non-blocking, never a pass/fail gate). The **field model is corrected from the issue's non-MECE draft**: the issue's single `conflict_type ∈ {contradictory, conditional_difference, resolved_in_synthesis}` folded conflict *nature* and resolution *status* into one enum and referenced an `insufficient_overlap` value not in it — these are split into orthogonal axes (`pair_assessment ∈ {contradiction, conditional_difference, no_material_conflict, insufficient_overlap}` × `resolution_status ∈ {resolved_in_synthesis, flagged_unresolved, not_applicable}`), and each side gains an `evidence_pointer` so a finding cannot be stated as free text the paper does not support. **Candidate-pair scoping is a recall-limited heuristic, not an algorithm:** an LLM agent does not execute an O(K²) enumeration, so the design states it as bounded candidate-edge generation (include a pair on shared RQ subtopic / shared construct / opposite finding direction / bibliographic coupling / scholar flag) with two honesty rules — bibliographic coupling is an *inclusion* signal only, never an *exclusion* rule (same-camp papers cite the same priors and tend to agree; cross-camp contradictions have low coupling), and cross-neighborhood pairs can be missed, so every inventory carries a mandatory **Coverage Note** stating the denominator and the explicit recall limitation and the agent must never write "all contradictions addressed." Inherits `synthesis_agent`'s narrative-side discipline unchanged (advisory-only: the scholar makes the final call; the agent emits `scholar_confirmation: pending`, never self-confirms, simulates no audit step, and reads no entry frontmatter). No `#111` dependency (that is a single boolean, per the issue's own correction). Adds `examples/contradiction_pairs_example.md` (6-paper remote-work synthesis covering a genuine unresolved contradiction, a resolved conditional difference, an *un*resolved conditional difference (so both resolution states of one assessment are shown), a no-material-conflict pair, an insufficient-overlap pair, and a Coverage Note that names the still-unpaired cross-neighborhood paper). Agent-prompt + output-template + doc example only; no schema, lint, or executable change.
- **Figure/Table Fidelity Gate — the visual analog of the §F.3.2 partial-evidence trap (#261, Kong et al. 2026 §3.4).** The VLM Figure Verification Protocol checked *"does the rendered figure match the source data?"* (a faithful-rendering check) but could not check *"does the caption's interpretation follow from the data, and does the manuscript cite this artifact for a claim it actually supports?"* — a figure can render perfectly while its caption overstates the data or the manuscript cites it for an unsupported claim (Kong et al. 2026, arXiv:2605.18661 §3.4). This is the visual counterpart of the prose partial-evidence trap addressed for citations in #213 and for review synthesis in #214; same trap, different artifact type, separate implementation. **Prose-layer only — no JSON Schema, no lint invariant, no gold fixture** (mirroring the #214 prose-layer decision, NOT the #213 schema-layer one): the `figure_table_trace[]` producer (`visualization_agent`) and consumer (`integrity_verification_agent`) are both LLM agents reading a markdown Figure Package, so there is no deterministic downstream parser and machine-validating the YAML shape would be false rigor. `academic-paper/references/vlm_figure_verification.md` gains a **Figure/Table Trace** section defining a `figure_table_trace[]` block — one entry per figure (or manuscript table that has an entry) carrying all six required keys — `artifact_id`, `source_data`, `transformation` (`{script, hash}` OR a precise manual-derivation pointer — vague values like "computed manually" are treated as untraceable), `caption_claim`, `supported_manuscript_claims` (each as claim text + optional locator, not a bare id, since the visualization agent can run before the draft's claim manifest exists), and `limitations` (present even when `[]`). `visualization_agent.md` emits the block in the Figure Package (new Step 6.6) and `integrity_verification_agent.md` Phase C gains **C3. Figure/Table Caption Fidelity** running at Stage 4.5: entry well-formedness (a malformed entry missing any of the six keys short-circuits to FAIL) plus four fidelity checks — trace completeness, caption-claim support (does the *interpretation* follow from data+transformation, with compound captions decomposed into atomic sub-claims using the #213 idea **as prose guidance only**, no `PARTIAL` verdict / `sub_claim_breakdown` imported; an entry takes its weakest sub-claim's verdict), bidirectional manuscript-claim linkage (each listed claim must reference the artifact and not overstate it, AND every substantive manuscript use of the artifact must be listed — incidental/structural mentions exempt), and limitation visibility (a known limitation must reach caption/Discussion/Limitations). **Severity is split, not blanket-advisory:** a caption that contradicts the data, an untraceable claim-bearing artifact, a missing/overstated manuscript link, or a dropped known limitation **FAIL (block)**; only uncertainty signals are advisory — an empty `limitations: []` emits a named `[FIGURE-LIMITATIONS-EMPTY]` note (never a silent pass) and a legacy figure with no trace surfaces a trace-unavailable note. At Stage 4.5, an updated Figure Package with no `figure_table_trace[]` (or one omitting an entry for a figure it contains) is a FAIL ("caption fidelity not verified"), so the check is not trivially skippable; a legacy figure with no Figure Package at all is the advisory case. C3 **inherits** the existing C1 data-cross-referencing layer (it does not re-render figures — that is VLM — or re-verify raw data — that is C1); its new coverage is interpretation and linkage. Adds `examples/figure_table_trace_example.md` (3-figure + 1-table ML ablation walkthrough covering a normal trace, a decomposed compound caption, and the empty-limitations advisory). Reference + agent-prompt/protocol text + doc example only; no schema, lint, or executable change.
- **Sub-claim decomposition before citation judgment — the citation-layer half of the §F.3.2 partial-evidence trap (#213).** The unified citation judge (`academic-pipeline/agents/claim_ref_alignment_audit_agent.md`) emitted exactly one verdict per citation, so a compound claim ("X rose AND the effect held across Y") whose source supported one sub-claim but not the other was collapsed to a single binary check and the unsupported sub-claim was silently lost — the largest correctness-error class documented in AI meta-review (Kim et al. 2026, arXiv:2605.20668v1 §F.3.2). The judge now runs a required **Step 0**: decompose the claim into atomic sub-claims and judge each independently before choosing the citation-level verdict. A new **prompt-layer `PARTIAL` verdict** (supports some sub-claims, not all; no active constraint violated) is normalized at Step 6 to `judgment=UNSUPPORTED, defect_stage=source_description`, routing the unsupported sub-claim through the same gate-refuse path a fully-unsupported claim takes so partial support is never accepted as full resolution. **Baseline correction:** the issue body proposed adding `PARTIAL` to the schema `judgment` enum; first-party reading showed that is the wrong baseline — `PARTIAL` (like the existing `VIOLATED`) lives at the prompt layer, NOT in the schema enum, so the 18 cross-field invariants and the allowed-(judgment, audit_status, defect_stage)-matrix stay untouched (the normalized triple was already in the matrix). The decomposition is persisted in a new additive optional schema field `sub_claim_breakdown[]` on `claim_audit_result` (pre-#213 entries validate unchanged); its **presence — not the defect_stage value — is the machine-readable partial-support signal** for downstream consumers. A new lint invariant **INV-19** pins the full normalization (breakdown present ⟹ `judgment=UNSUPPORTED` AND `defect_stage=source_description` AND true-partial: ≥2 items with ≥1 SUPPORTED AND ≥1 valid non-SUPPORTED sub_verdict), mutation-verified to discriminate. **Malformed `PARTIAL`** (breakdown absent / <2 items / not true-partial) takes the `audit_status=inconclusive [partial_breakdown_malformed]` path, never a silent bare `UNSUPPORTED`. Calibration gains **5 partial-support gold fixtures + a `partial_support` subset metric** (`scripts/claim_audit_calibration.py`): because partial fixtures carry `expected_judgment=UNSUPPORTED`, a judge that stops decomposing and emits bare `UNSUPPORTED` passes the aggregate FNR gate; the subset metric counts a partial fixture as passed ONLY when the judge emits `UNSUPPORTED` AND a well-formed true-partial breakdown, so the regression surfaces as `miss_rate > 0` while the aggregate stays green. The synthesis-layer sibling (#214) is out of scope. Schema + lint + judge-prompt + calibration + protocol-doc; the schema field and INV-19 are additive and backward-compatible.
- **Sub-claim inventory before consensus in the editorial synthesizer — the synthesis-layer half of the §F.3.2 partial-evidence trap (#214).** The synthesis-layer sibling of the citation-layer #213. The editorial synthesizer (`academic-paper-reviewer/agents/editorial_synthesizer_agent.md`) aggregated consensus over a whole weakness bundle, so a compound weakness whose sub-claims carried different reviewer support was collapsed to one verdict and the minority sub-claim was lost — the single largest correctness-error class in AI meta-review (Kim et al. 2026, arXiv:2605.20668v1 §F.3.2). **Prose-layer only:** the synthesizer emits a human-facing decision letter + revision roadmap, not machine-readable judge rows, so there is no deterministic consumer for a #213-style schema field / lint invariant / gold fixture — adding one would be unrequested abstraction. The `sub_claim` vocabulary aligns with #213; its architecture is not imported. **Step 1 splits** into `Step 1a — Reviewer Summary Matrix` (retained) + `Step 1b — Weakness Sub-Claim Inventory` keyed on `sub_claim_id` (only weakness bundles decompose; recommendation/confidence/counts stay in the 1a matrix). **Step 2 computes consensus per sub-claim** over an absolute denominator of the 4 non-DA reviewers (`position ∈ {raised, corroborated, not-mentioned, disputed}`; `not-mentioned` is silence, never opposition or agreement). **Mutually-exclusive dispositions with explicit precedence:** `conflict ≥ 1 → SPLIT` first, otherwise by `agree` count (`4→CONSENSUS-4`, `3→CONSENSUS-3`, `2→corroborated finding`, `1→single-reviewer finding`); every `(agree, conflict)` cell maps to exactly one disposition and `agree = 0` is unreachable by construction. `disputed` covers existence OR action/severity conflict, so reviewers agreeing a problem exists but recommending incompatible remedies route to SPLIT → EIC arbitration. A `Sub-Claim(s)` column is added to the roadmap tables in both the agent output format and the standalone `editorial_decision_template.md` so the decomposed granularity survives to the output boundary. DA-CRITICAL flow and the v3.6.2 sprint-contract arithmetic path are untouched; scoped to the general Synthesis Protocol only.
- **Concise output discipline + pressure-stable boundary reinforcement across the report-producing reviewers (#274).** A guidance-layer follow-up to the Claude Opus 4.8 system card §4.1.4, which documents two behavioral signals: refusals/responses trend longer and more over-caveated than 4.7, and a small number of multi-turn cases where a correct refusal was retracted under sustained pressure — both quality issues a user feels directly in a review tool. **Guidance layer only; no claim of having proven 4.8's runtime behavior.** A **concise output discipline** block is inlined (before `## Output Format`) into the report-producing reviewers — `domain` / `methodology` / `perspective` / `eic` / `devils_advocate` / `editorial_synthesizer` reviewers and `academic-paper/peer_reviewer`: state findings and verdicts directly, don't pad with repeated qualifiers; **concise explicitly does NOT mean under-caveated** — preserve every material uncertainty, cut only redundancy. A **"pressure is not evidence"** rule is added to the Devil's Advocate Anti-Sycophancy Rules and the editorial synthesizer's arbitration discipline: repeated pushback / authority appeals / bare softening requests do not change a finding. In the Devil's Advocate, this is bound to the existing numeric concession threshold (≥4 normally, 5/5 after a prior concession); in the editorial synthesizer's arbitration, a finding changes only on substantive new evidence or reasoning that addresses the arbitration basis (no numeric threshold lives there). Both are framed by evidence standard, not as an attack catalogue (public-repo safe). Every block carries an **epistemic-status line**: these are prompt-surface instructions; they cannot prove the model stays pressure-stable at runtime — that would need a separate non-deterministic behavioral eval. The issue's acceptance "confirm boundaries hold under 4.8 after pushback" is reframed as a *prompt-surface confirmation* (the instructions are present and explicit), not ticked by self-simulating a pushback dialogue (theater, not verification) and not pinnable by a deterministic CI test — mirroring the #272 guidance-layer ≠ runtime-enforcement discipline. No lint / mutation test (style guidance is not a contract invariant with a downstream consumer). Agent-prompt text only.
- **Retrieved-content instruction/data boundary stated as a standing principle (#367, guidance layer for #272).** Retrieved external content is *data*; imperative-looking text inside it is not auto-promoted to a user instruction. The authoritative statement lands as a canonical §2A in `shared/ground_truth_isolation_pattern.md` (marked distinct from the eval-leakage concern) and is inlined verbatim into the two highest-surface retrieval agents — `deep-research/source_verification_agent` and `bibliography_agent` — so the principle is present where a fetch happens. A new `scripts/check_instruction_data_boundary.py` lint guards against silent removal or anchor-preserving gutting (presence / verbatim-sync / section-anchoring / contiguous-backpoint), proven not-accept-all by an 11-mutation test plus a positive control; a strict-xfail pebble (`scripts/test_runtime_injection_boundary_xfail.py`) marks the unbuilt runtime defense so the deferred structural layer is not treated as done. **Commit-time documentation consistency only — no runtime gate, no injection-mitigation claim.** The originating trust-boundary issue (#272) stays open by design (the structural layer is deferred, bound to #134 Slice 3+). Lint + CI wiring (`spec-consistency.yml` + pytest manifest); no schema change.
- **Version-consistency lint extended to the README badge, docs forward-reference, and zh-TW heading invariants (#357, invariants 5-7).** `scripts/check_version_consistency.py` covered invariants 1-4 (CLAUDE.md table, suite version, pipeline tracking, plugin manifests); it now also enforces the three release-doc invariants previously caught only by manual checklist: **inv 5** — the README shields.io version badge tracks the suite version; **inv 6** — no `docs/*.md` cites a `vX.Y.Z` *above* the suite version (forward-reference guard); **inv 7** — version-bearing H2 headings stay in lockstep between `docs/<name>.md` and `docs/<name>.zh-TW.md` (plain headings may differ; only version tags pair, compared as multisets so a dropped one-of-a-pair heading is caught). Version-token regexes use a trailing negative lookahead so prerelease / 5-segment tokens (`v3.12.0-alpha`, `v3.11.1.2.3`) are dropped rather than partial-matched. Also removes the `docs/PERFORMANCE.md` cross-model onboarding section (en-only; aligns the en/zh-TW pair). TDD with 11 new test methods plus broadened aligned-fixture coverage, each invariant mutation-tested (stub to accept-all → matching test fails).
- **ARCHITECTURE.md component-version markers now policed by lint (#345, invariant-4 gap).** `scripts/check_spec_consistency.py` policed version markers in the README (×4 langs), `.claude/CLAUDE.md`, `MODE_REGISTRY.md`, and `SKILL.md` — but not `docs/ARCHITECTURE.md`, where six "current academic-pipeline component version" strings were missed by the v3.11.1 bump and caught only by a manual first-party sweep (#343/#344). A new `check_architecture_component_version()` parses the suite version from `.claude/CLAUDE.md` and asserts the six current-component markers equal it (the mermaid orchestrator node + the component table row + the four stage rows). It anchors on the `academic-pipeline <ver>` component pattern and never inspects the `timeline` block, so a stale current-component marker fails while a feature-history marker (`vX.Y.Z : <feature>`, which records *which* version shipped a gate and must not be bumped on a patch) is left alone — the distinction a naive `v3.x` grep would corrupt. The version regex captures the repo's full 4-component grammar (the suite shipped v3.9.4.2) with a hard right boundary so a 3-component marker can't partial-match inside a longer one, and the component/stage row scan is anchored to markdown table rows so a narrative provenance mention isn't wrongly policed. Wired into `spec-consistency.yml`; 7 tests (aligned passes / stale component fails / stale timeline marker does NOT fail / missing markers fail / 4-component edge cases).
- **Same-family / rubric-aware calibration epistemic note (#273, Claude Opus 4.8 system card §6.3.7 / §6.6.3).** An interpretive, doc-only follow-up to the system card's report of modest, partly-unverbalized **grader-awareness** signals (the model sometimes optimizes toward what a rubric appears to reward). ARS leans on rubric / gold-set judging (reviewer calibration, the citation-claim judge), so this affects how calibration numbers should be *read* — not what the suite does. **Zero detection / mitigation claim:** ARS does not and cannot detect or correct grader-awareness (the system card's own point is that it can be unverbalized); the only honest claim is interpretive. All changes land in `calibration_mode_protocol.md` "Failure cases this mode does NOT fix" plus a one-line pointer in `integrity_verification_agent.md`. An **umbrella "same-source evaluation risk" framing** names two forms — the existing *factual* form (same-source hallucination — fabricated references; canonical in the Anti-Hallucination Mandate, unchanged) and a new *behavioral* form (same-family rubric optimization), cross-referenced both ways; the integrity block's WebSearch counter-rules are explicitly scoped to the factual form only and are not edited to imply they mitigate rubric-aware judging. An **epistemic note** states that under same-family / rubric-aware judging the measured calibration error is a *possible under-estimate, not a ceiling*. A **cross-model positioning** clarification resolves the doc's own opt-in-vs-default-on tension (cross-model is opt-in "for best results" in ordinary reviewer / judge paths; calibration mode is the explicit default-on exception once invoked; absent cross-model is warn-and-continue, never a gate; the consent / privacy boundary for sending a manuscript to another provider is preserved). A **single-model paraphrase spot-check** is documented but honestly de-powered — reword the rubric and re-judge, stated plainly to reveal only *surface wording sensitivity*, unable to detect unverbalized grader-awareness, and no proof the judgment is correct (no score, no threshold, no gate). No schema, no lint, no gate, no calibration-threshold change.
- **Kong auto-research META closeout — negative scope + Tier D design lessons (#255, Kong et al. 2026).** Closes the Kong et al. auto-research survey META after every feature sub-issue (Tier A #256–#259, Tier B #260–#262, Tier C #263, Schema follow-ups #266/#268/#269) had merged; the two remaining closing conditions were documentation-only and defined the project's *negative scope*. `POSITIONING.md` gains a **"Rejected mechanisms (autonomous-research anti-patterns)"** section placed after "What this is not", enumerating the five autonomous mechanisms ARS does not do — end-to-end pipeline, idea-generation agent, Paper2X auto-generation, autonomous experiment execution, wet-lab automation API — each with a Kong anchor and, for the three that abut shipped features, an operationally-checkable CONSIDER-vs-REJECT line (idea-generation ≠ shipped #257 wording advisory; Paper2X auto-gen ≠ fidelity audit; autonomous experiment execution ≠ shipped #260 provenance intake). Two **Tier D design-lesson docs** land under the existing `docs/design/…lX…` convention (not a new directory): **L1** frames copilot-vs-auto-research as a research-state-authority review test ("does this let ARS create / select / execute / advance a research object of record without a scholar-authored seed or confirmation?"), and **L2** sharpens the advisory-vs-idea-generation line for research questions with a verb test, cross-linked from POSITIONING.md and from #257. Verification notes split a verifiable claim (no autonomous mechanism in first-party ARS today; #257 / #260 are advisory / provenance gates) from a design commitment (a recorded boundary and review criterion, not a runtime guarantee). Documentation only — no schema, agent, or lint change.

### Fixed

- **Originality weight reconciled to 20% across reviewer reference docs; rubric weights now lint-policed (#396).** `review_criteria_framework.md` stated Originality at 15% (plus a 7-dimension weighted formula and its own score-to-decision mapping) while the operative scoring source — `quality_rubrics.md`, which the peer-review report template instructs reviewers to score against — and `academic-paper/SKILL.md` rule 14 both say 20% with a 5-dimension aggregate. The framework doc no longer restates any number: its dimension headers drop the weight suffixes (qualitative level descriptors stay) and §4 defers weights, formula, and decision mapping to `quality_rubrics.md` by name, noting that Literature Integration and Significance & Impact are reviewer-specific optional dimensions outside the numerical aggregate. Recurrence is guarded by a new lint, `scripts/check_rubric_weight_consistency.py`: quality_rubrics dimension-header weights must match its own aggregation-formula terms, the weights must sum to 100%, SKILL.md rule 14 must agree, and the framework doc must not restate a weight (`Weight NN%` / `(NN%)` both fail). Mutation-verified on all four invariants; wired into `spec-consistency.yml` + the CI pytest manifest. Surfaced by codex during cross-model review of the 2026-06-10 researcher-blindspot audit (F-14).
- **Score-trajectory scale contradiction reconciled to 0-100 (#399, found during the #396 reconciliation).** `shared/handoff_schemas.md` declared score_trajectory scores as "1-5 scale" while every producer and consumer is 0-100: the report template scores 0-100 per `quality_rubrics.md`, and the canonical Early-Stopping Criterion is explicitly "delta < 3 points **on the 0-100 rubric**" (`academic-pipeline/SKILL.md`). The 1-5 comment is a pre-v1.4 fossil — the reviewer changelog (2026-03-08) records "Dimension Scores upgraded from optional 1-5 to required 0-100". Schema comments now say 0-100 (scale sourced from `quality_rubrics.md`; dimension *names* still from the framework doc), and the trajectory protocol's Stage 6 example — which mixed both scales in one table (1-5 scores, a "-0.2 within tolerance" verdict, and an "overall delta = 4" that matched neither) — is rebuilt on 0-100 with internally consistent deltas and verdicts. **Exposure note (per the #399 acceptance):** the thresholds themselves were never wrong — they were always defined against 0-100 in SKILL.md; the risk was a consumer reading only `handoff_schemas.md`, whose 1-5 trajectories would make regression detection (delta < -3) near-unreachable and early-stop (delta < 3) near-always-on. No evidence either check ran on 1-5 data (no real re-review artifact set exists post-v2.7; see #395). The reviewers' Confidence Score `[1-5]` is a deliberately separate axis and is unchanged.
- **Cross-model verifier now actually grounds its lookups, and an ungrounded result can no longer be laundered into `VERIFIED` (#346).** `shared/cross_model_verification.md` told the cross-model verifier to "search the web to confirm," but the shipped OpenAI / Gemini API call patterns wired in no web-search tool — so a copied example produced a verifier that was *told* to search but *could not*, answering from parametric memory and confidently returning `VERIFIED`. For a hallucinated-citation gate that is the worst failure (a false `VERIFIED` manufactures confidence), and it shares the generating model's exact failure mode — fluent-but-wrong from memory — for the one task (existence lookup) where grounding is the entire point. Two-part fix, both at the API-pattern layer: (1) the OpenAI pattern moves to the Responses API with the hosted `web_search` tool and the Gemini pattern enables the `google_search` grounding tool, so "search the web" is executable; (2) both patterns **gate the verdict text on proof a search ran** — they emit `NOT_SEARCHED` and discard the text when the API returns no grounding evidence (an OpenAI completed `web_search_call` item / a Gemini response whose `groundingMetadata` carries `webSearchQueries` *and* `groundingSupports` tying the verdict text to retrieved chunks), and a `VERIFIED` carrying no supporting source URL/DOI is downgraded to `NOT_SEARCHED`. The protocol moves from batched (≤5 refs/call) to **one grounded call per reference** so the grounding evidence maps 1:1 to each verdict (a single grounding trace on a 5-ref response proves *something* was searched, not that *each* reference was) — a deliberate cost-for-provenance trade (a 60-ref paper samples 30% capped at 15, so ~15 grounded integrity calls, documented in the cost table). `NOT_SEARCHED` is a new status distinct from a transport failure: a transport failure (non-2xx HTTP — `[CROSS-MODEL-ERROR]`) means "no cross-model opinion" (fall back to single-model); a `NOT_SEARCHED` (2xx, but no grounding evidence) means "an opinion we have decided not to trust," counted separately and surfaced for re-run or human review, never as agreement with a Claude `VERIFIED`. `academic-pipeline/agents/integrity_verification_agent.md` (the consumer) is aligned in lockstep: its behavior summary drops the stale "batches of 5", adds the `NOT_SEARCHED` / ungrounded handling, and splits transport-failure graceful-degradation from the `NOT_SEARCHED` path. Surfaced during the 2026-06 harness-retirement audit (#301) by a second-model cross-check pass and filed as a live correctness gap, not a harness-retirement item. Documentation + agent-prompt/protocol text only; no executable script or schema change.
- **Cross-model grounding guards are now behavior-tested, and a fail-open in the Gemini source extractor is closed (#349, follow-up to #346).** The #346 grounding guards shipped as bash/jq inside `shared/cross_model_verification.md` with no automated test — a future edit to the jq, or a provider response-shape change, could silently stop it failing closed (the exact silent-false-`VERIFIED` class the guard exists to prevent). The contract-bearing jq is extracted into canonical files under `scripts/cross_model_verification/` (5 filters: OpenAI search-guard / text / sources, Gemini grounded-guard / sources), the documented bash now loads them via `jq -f` instead of inlining, and `scripts/test_cross_model_verification_guards.py` runs each filter against synthetic fixtures (grounded → extracts supported sources; from-memory / non-grounded → `NOT_SEARCHED` with blank sources), with two mutation tests proving the fixtures discriminate a working guard from an accept-all / naive one. **Fail-open fix (malformed-response hardening):** the source extractors trusted the shape and types of the model's grounding metadata. Several malformed-but-well-formed-JSON responses could fabricate a source (defeating the blank-source downgrade and resurrecting a false `VERIFIED`) or crash jq: a negative `groundingChunkIndices` silently selected a chunk from the *end* of the array; a string index, a `groundingChunks`/`groundingSupports` arriving as a string/object instead of an array, a Gemini chunk `uri` or an OpenAI `url_citation.url` that is a number/bool/object — each either crashed or surfaced a non-URL value as a "source". The canonical filters now fail closed on all of these: indices must be in-range non-negative numbers (`select(type=="number" and . >= 0 and . < ($chunks|length))`), the grounded-guard requires `webSearchQueries`/`groundingSupports` to be non-empty *arrays* (not merely truthy `length`, which strings/objects also have), every container on each extraction path is array-normalized before it is iterated or indexed (OpenAI `output` → `content` → `annotations`; Gemini `candidates` → `groundingChunks` / `groundingSupports` / `groundingChunkIndices`) so a container arriving as an object can't have its values surfaced, and extracted URLs are filtered to non-empty strings — so any malformed response yields blank sources → `NOT_SEARCHED` rather than a fabricated or crashing result. A doc-sync lint (`scripts/check_cross_model_verification_sync.py`) pins that the doc keeps wiring every canonical filter via `jq -f` and retains the `NOT_SEARCHED` / `CROSS-MODEL-ERROR` branches (with `REQUIRED_FILTERS` cross-checked against the on-disk `.jq` set so a new filter can't escape the lint). Both the test and the lint are wired into the CI pytest manifest + `spec-consistency.yml`, which now also ensures `jq` is present on the runner. Documentation + test/lint/CI only; no agent-prompt or schema change.
- **Cross-model Gemini guard is rederived from the source extractor; malformed array elements no longer crash the OpenAI filters (#351, post-ship review of #349).** The post-squash review of #349 surfaced that the Gemini guard and the source extractor were two parallel jq programs asserted to agree, so each round found a new input where they diverged: a `groundingSupports` linking to no valid chunk (empty / negative / string / out-of-range / fractional index), a multi-candidate response where the guard's `any`-candidate scan passed on a grounded candidate while the extractor read the unsupported `candidate[0]`, or a non-string `uri`. In each, the guard passed while the extractor returned blank — and the blank-source downgrade only rescues `VERIFIED`, so an ungrounded `NOT_FOUND` / `MISMATCH` could be trusted as grounded. The fix is structural: `gemini_is_grounded.jq` now **embeds the exact same `candidate[0]` extraction `gemini_sources.jq` performs** and passes iff it yields ≥1 source AND a real `webSearchQueries` signal is present — so the safety invariant **guard-pass ⟹ at least one source extractable** holds by construction for every input shape, not by two predicates kept in sync by hand. (The guard is intentionally *stronger* than "has a source": a chunks-but-no-search response fails it.) Separately, `openai_text.jq` no longer crashes `join` on a non-string `text`, and all OpenAI filters type-check each array element as an object before reading `.type`, so a malformed element (`output: [5]`) is skipped rather than crashing. +17 behavior tests across the new invariant, multi-candidate / fractional / non-string-uri cases, and the array-element-crash paths (guards 27→44). Every hole and fix verified first-party.
- **Judge-verdict cache key partitioned by prompt version so a prompt revision invalidates stale entries (#361).** The judge-verdict cache key included `judge_model` but no prompt-version component, so a judge-prompt revision (e.g. #213's Step-0 sub-claim decomposition) did not invalidate stale entries — a verdict cached under the old prompt was still served until the TTL expired, silently bypassing the new prompt logic (a pre-existing cache-key design gap surfaced as P2#1 in the #355 post-squash review; affects every prompt revision, not just the decomposition path). `_cache_key` gains a `prompt_version` component kept separate from `judge_model` (independent axes), and invalidation keys on **`JUDGE_PROMPT_SHA256`** — the SHA-256 of the canonical judge-prompt section, the single source of truth — so any prompt edit changes the key and invalidates stale entries with no reliance on a human bumping a label (`JUDGE_PROMPT_VERSION` is a decoupled human-readable label for logs/diffs only). **Fail-CLOSED on unknown version:** when the caller declares the prompt version `None`, the pipeline binds a run-local component (`__unknown__:<audit_run_id>`) so a stale entry is never served across an unknown-version boundary (cross-run hits disabled; within-run dedup for repeated citations preserved). A CI backstop `scripts/check_judge_prompt_version.py` hashes the canonical section (between the `JUDGE-PROMPT-CANONICAL` markers) and fails if it drifts from the pinned hash, forcing a re-pin in the same change (wired into `spec-consistency.yml` + the pytest manifest). The agent-prompt contract and lint docstring — which described invalidation as keyed on the `JUDGE_PROMPT_VERSION` label while the pipeline already falls back to the SHA256 — are re-attributed to the SHA256 fingerprint so a downstream implementer following the contract can't re-open the bug. RED→GREEN + mutation-verified.
- **Judge-supplied rationale bounded on success-path rows + null rationale guarded (#360).** Judge-supplied rationale on success-path rows (`completed` + `constraint_violation`) is now bounded to the schema `maxLength=2000` via a shared length-budgeting choke point, and a non-string (null) rationale degrades to the default instead of aborting the audit run. RED→GREEN + mutation-verified.
- **Failure-rationale bounding + PARTIAL gold-fixture requirement — two #213 sub-claim-decomposition gaps (#359, #213 follow-up).** Two correctness gaps in the new PARTIAL machinery (neither reachable on pre-#213 inputs), surfaced by the #355 post-squash integration review and confirmed first-party. (1) The malformed-PARTIAL fallback could emit a schema-invalid row: the parse error embedded the offending breakdown's repr in `detail`, which became the fallback row's rationale and could exceed the `claim_audit_result` `maxLength=2000`. Fixed by bounding `detail` at a single choke point — a shared `_AuditInvocationError` base whose `__init__` clamps `detail` so the `"{fault_class}: {detail}"` rationale always fits (budgeted against the widest fault-class prefix); `JudgeInvocationError` / `RetrievalInvocationError` inherit it. (2) Calibration could silently skip the atomic-decomposition metric: `validate_gold_set` did not require an `expected_prompt_verdict=PARTIAL` fixture to carry non-empty `expected_sub_claims`, so `_breakdown_covers_expected` early-returned `True` and scored `miss_rate=0` for any generic breakdown; a new rule (e) rejects such a fixture at ingestion (fail-closed). RED→GREEN + mutation-verified for both.
- **Eval gold tuple 052 removed — a fabricated citation was mislabeled as a genuine unindexed paper (#250).** Gold tuple `052-valid-unindexed-regional-paper` was labeled `fabrication_intent: false` and its expert-verdict notes asserted it was a "GENUINE … real regional, non-English-indexed agronomy paper" (Sembiring & Ginting 2023, *Jurnal Penelitian Pertanian Regional*). First-party verification across all four resolvers (Crossref / OpenAlex / Semantic Scholar / arXiv) plus DOAJ, OpenAlex Sources, Crossref Journals, and general web search found no evidence the paper or the journal exists — a fabrication labeled as genuine, exactly the failure this repo exists to detect, and a direct violation of #250's closing condition (which requires a *first-party-verifiable* real-but-unindexed source). Functionally the tuple was redundant: the harness reduces pre-recorded `resolver_outcomes` (it does not live-query), and tuple 051 (the OQ-5 by-design false-negative, a no-identifier fabrication) already exercises the identical title-only-unmatched → unresolvable reducer path. Removes the tuple; `expected_outcomes.json` drops the 052 entry (51 entries); `manifest.yaml` `sample_n` 52→51 + drops the `valid_unindexed` distribution row; `check_evals_gold_set.py` drops `valid_unindexed` from `KIND_ENUM`; `citation_verification_summary.py` + test comments drop 052 references (expert-concordance 12→11, unresolvable support 7→6), realigning manifest/tests/summary with the gold-set README's already-described 51-tuple set. **#250 stays open** — the verified-real-but-unindexed canary is still genuinely unfilled; only a mislabeled synthetic proxy was removed.
- **ACL/EMNLP disclosure rows regrounded to the ACL Admin Wiki canonical source (#242).** The ACL disclosure row pointed at the 2023 conference blog (still live, HTTP 200) but its content had drifted from ACL's current Exec-approved policy. The Admin Wiki — which ARR / EMNLP 2026 link to for current paper-integrity guidance — places disclosure in the Acknowledgements section and graduates it by use type, contradicting the old row's "dedicated Use of AI Assistance subsection". First-party verification: the Admin Wiki returns HTTP 200 via browser navigation with the full "Guidelines for Generative Assistance in Authorship" section present (the 418 reported in #242 was a curl-UA challenge, not a stable block; the repo has no CI link-checker, so the humans-vs-tooling URL tension recorded in #242 does not apply). The ACL row's Source URL → Admin Wiki anchor (access date 2026-06-07) with summary / required phrasing / disclosure location / prohibited uses / authorship / notes regrounded from the first-party wiki text and graduated per its clauses a–f (language-only and short-form input not disclosed; literature search needs no special disclosure but normal citation-accuracy rules apply; low-novelty text and AI-suggested ideas disclosed); the EMNLP sibling row → the EMNLP 2026 Paper Integrity Policy page (which defers to ACL's guidelines) and is consolidated to "see ACL row"; `disclosure_mode_protocol.md` prose aligned to Acknowledgements. An independent cross-model faithfulness pass against the first-party pages corrected two fluent-wrongness overstatements (the literature-search no-disclosure bucket; an EMNLP "adopts wholesale" claim).
- **Stale Opus 4.7 primary-model strings retired + repro_lock run-time fields documented as placeholders (#347).** The 2026-06 harness-retirement audit (#301) found the agent prompts carry zero expired scaffolds, but two `shared/` files still pinned Opus 4.7 as the primary model after the 4.7→4.8 migration, and a `repro_lock` example hard-coded run-time snapshot values that readers copy verbatim. `shared/cross_model_verification.md`: primary model → Opus 4.8, with the primary "API ID" cell now reflecting that it is the inherited Claude Code session model rather than asserting an unverified `claude-opus-4-8` id string (cross-verifier ids `gpt-5.4*` / `gemini-3.1-pro-preview` confirmed current and left concrete), plus a note documenting why temperature is 0.1 (deterministic fact-check), closing the "undocumented sampling override" read. `shared/artifact_reproducibility_pattern.md`: the `repro_lock` example block uses placeholders for the three run-time snapshot fields (`ars_version`, `model.id`, `s2_api_protocol_version`) so a copy-paste records the actual run, not a stale literal (feature-introduction labels like `v3.3.5+` stay concrete). `examples/passport_with_repro_lock.yaml` left unchanged — a self-consistent historical snapshot, not a stale current-marker.

## [3.11.1] - 2026-06-06 — Post-ship correctness, hardening, and provenance fixes (#182 follow-up)

A patch release rolling up the post-ship advisory fixes surfaced after v3.11.0: a
cross-model consent-gate extension to the integrity + collaboration paths (#322), a
per-entry backfill parallelization (#138), and seven correctness/hardening fixes across
the citation-existence gate, the v3.10 policy layer, the eval harness, the domain
evidence profiles, and the #310 security-boundary edge cases (#323/#327/#328/#329/#331/#332/#333).
No new features and no breaking schema changes. One API note: the #332 `verify_citation`/
`verify_passport` signature gains required keyword-only parameters. This is a fix to a
contract-violating code path that first shipped in v3.11.0, not a deliberate signature
revision — the old signature emitted a schema-invalid `ref_slug: null`, so any v3.11.0
caller relying on it was already producing contract-invalid output. The only in-repo
callers (the CLI + the internal `verify_passport`→`verify_citation` call) are updated in
lockstep; see the #332 entry below for the full C-V4 rationale.

### Security

- **Cross-model consent gate extended to the integrity-verification and collaboration-depth paths (#322).** The explicit-consent gate that fronts every `ARS_CROSS_MODEL` upload — established for the two Devil's Advocate paths in #310 — now also fronts the two remaining agent paths that send user-derived material to an external provider on the env var alone: `integrity_verification_agent` (sampled citation/reference metadata) and `collaboration_depth_agent` (raw dialogue turns, which can carry the user's private reasoning and unpublished material). The gate is also added at the `pipeline_orchestrator_agent` re-dispatch point so the observer's agent-internal gate cannot be bypassed at the orchestration layer (defense in depth). All three mirror the #310 wording: no automatic send, explicit user consent identifying provider + model + content class, `[CROSS-MODEL-SKIPPED]` + single-model fallback when consent is declined, and a backpointer to `shared/cross_model_verification.md`. The `collaboration_depth_agent` advisory-only / never-blocks contract is preserved — the gate gates only the upload, never the observer's scoring role. Agent-prompt text only; no schema or script change.

### Performance

- **Parallelize the OpenAlex + Crossref backfill lookups per entry in `migrate_literature_corpus_to_v3_9_0.py` (#138).** When both `openalex_unmatched` and `crossref_unmatched` are missing for an entry, the two independent resolver calls (different hosts, per-instance throttle state, monotonic timing) now run concurrently via a 2-worker `ThreadPoolExecutor` instead of one-after-the-other, roughly halving per-entry network wait on a full backfill. Scope is deliberately bounded: only the two calls within one entry overlap — the corpus loop stays sequential (cross-entry parallelism is out of scope; the clients' per-instance throttle assumes serial use), all passport mutation / report bookkeeping / degradation logging stays single-threaded on the orchestrator thread, and an already-set field still never consults its client. A single missing field skips the pool and calls directly. Behavior is otherwise byte-equivalent to the sequential version, including the omit-on-`Unavailable` partial-degradation contract (now surfaced via `Future.result()`). Adds 2 tests (barrier-verified parallel dispatch + the previously-untested API-down degradation path); the 6 existing migration tests pass unchanged.

### Fixed

- **Two edge-case correctness fixes from the #310 post-merge review (#323, closes #324).** Post-merge `codex` review of #310 (security-boundary hardening) surfaced two issues #310's happy-path/crash-free tests did not catch, both verified first-party before fixing. (1) In `scripts/adapters/folder_scan.py`, a symlink escaping the input root wrote `reason: symlink_outside_input_root` to `rejection_log.yaml`, but that value is not in the `rejection_log.schema.json` `reason` enum — so the rejection log was contract-invalid exactly in the new symlink-rejection path. It now uses `other` + `detail` (schema-valid; the schema's `allOf` requires `detail` when `reason == other`). (2) In `scripts/bootstrap_timeline_yaml.py`, the lookup queried `…/works/{quote(doi)}` (encoded) but `source_locator` recorded `…/works/{doi}` (raw), so provenance named a URL that was never queried — affecting every DOI, not only reserved-character ones (`/` encodes to `%2F`). It now records the encoded DOI to match the queried URL. Tests strengthened to assert emitted content (the rejection log is `jsonschema.validate()`d; a new test pins `source_locator` to the encoded lookup URL), not just exit code.
- **Domain evidence profiles wired end-to-end (#327).** Three feature-logic gaps from the #259 post-ship review that survived on `main` because `check_domain_evidence_profile.py` only verified documentation-surface presence (C1–C7), never the control-flow bound, the consumer parse logic, or the date-gate semantics. **[P1]** Step 12 (the profile producer) was orphaned from the no-handoff flow directive (bounded at "Step 1-11"), so the profile silently never activated on the common path; `intake_agent.md`'s directive now affirmatively reaches Step 12 (new lint C8). **[P2]** The reserved-fallback row `unknown_user_defined (requested: <reserved>)` was misparsed as case (c), emitting a wrong `[PROFILE-UNRESOLVED]` malformed signal; the consumer now parses the effective token + parenthetical and emits a new `[PROFILE-RESERVED-FALLBACK]`, with (c) narrowed to genuinely unresolvable rows (new lint C9). **[P2]** The currency (time-range) node was not profile-aware, so a canonical humanities source admitted at the peer-review node was re-excluded at the currency node (INVARIANT 5 violation); the currency node gains a humanities admit branch (purely additive — union/loosen-only, continues through the universal relevance + methodology gates, never short-circuits to Include) (new lint C10). TDD with a RED mutation fixture per defect.
- **Eval-harness gates honor binding per-class thresholds and exclude non-measured tasks (#328).** Two correctness holes in the #263 eval-harness CI gates, invisible to the suite because no fixture exercised them. **[P1]** `scripts/_eval_threshold_gate.py` `failed_tasks()` inspected only `aggregate_metric.passed`, but manifests declare binding per-class thresholds distinct from the aggregate (e.g. citation_extraction aggregate `accuracy ≥ 0.90` **and** per_class `accuracy ≥ 0.85`); a PR regressing `citation_extraction.false.accuracy` below 0.85 while the aggregate stayed ≥ 0.90 passed the gate when it should block. `failed_tasks()` now also iterates `per_class`, keyed `<task>.<class>.<metric>`. **[P2]** `scripts/check_ranking_lift.py` `_flatten_report()` flattened any task carrying an `aggregate_metric` with no status filter, so a not-yet-landed task's placeholder `value: 0.0` entered the lift baseline as a real metric — once the task landed, its real value hit the zero-baseline branch and was spuriously flagged as a regression. Both consumers now share the same positive `status == "measured"` skip-guard so a future status (e.g. `"error"`) is excluded consistently. Adds `scripts/test__eval_threshold_gate.py` (11 cases) + 5 `_flatten_report` status-filter tests.
- **v3.10 policy layer: laundering guard wired to real entries + per-block terminal-marker validation (#329).** Two P2 enforcement/grammar gaps in the shipped v3.10 triangulation policy layer; the 45 policy-layer tests passed because each guard was only exercised in isolation, never wired to the surface it protects. **[P2]** `assert_venue_type_source_clean` (rejects a `venue_type_source` naming a lookup index under `trusted_source_declared`) had no production caller — the entry schema's own description promises *"enforced by check_v3_10_policy.py"* but nothing ran it over real entries, so a passport laundering a k=3-unmatched signal into a declared-trust signal passed both validators. It is now wired into `check_literature_corpus_schema.validate_passport`'s entry loop (a laundered source fails; a legitimate publisher/registry feed name still passes; string-guarded so a non-string `venue_type_source` surfaces as a clean schema error, not a `.strip()` traceback). **[P2]** `is_well_formed` accepted a terminal `TERMINAL-BLOCK` marker missing the mandatory `policy`/`reason`/`mode`/`policy_hash` fields; `_parse_inner` now keeps per-block metadata and `is_well_formed` validates each block independently plus the marker-level `policy_hash`, so a complete later block can no longer mask an earlier block's stripped metadata (C-V6(g) multi-policy co-emission handled correctly).
- **arXiv resolver no-ID skip + non-Atom 200 guard + miss-safe cache decode (#331).** Three post-ship defects in the #182 Delta 1+2 citation-integrity data layer (arXiv resolver + verification cache), all verified first-party; the 106 PR tests never exercised these paths. **[P2]** `resolve_arxiv_unmatched` ran a title search for citations with no `arxiv_id` (e.g. a DOI-keyed journal article) and returned `true` on a title miss — inflating triangulation `k` (k=3→k=4, rendering `CONTAMINATED-QUADRANGULATION-UNMATCHED` on a clean journal citation) plus a wasted ~3s request; it now skips the resolver when `arxiv_id` is absent, matching the spec's ID-gated `skipped` rule and the guard already in `verification_gate._run_arxiv`. **[P2]** A well-formed non-Atom 200 body (e.g. a proxy/CDN HTML error page) parsed cleanly and its empty entry list was cached as a real 90-day miss; `arxiv_client._get` now validates `root.tag == {atom}feed` and raises `ArxivUnavailable` (omit-on-degradation, not cached) on a non-feed root, while a genuine empty Atom feed still resolves to a miss. **[P3]** `VerificationCache.get`'s bare `json.loads` aborted verification on a corrupt/non-dict payload; it now treats `JSONDecodeError`/`TypeError`/non-dict as a miss (clean recompute), honoring the documented "malformed cache payload = miss" contract. Two tests that codified the buggy behavior were reversed.
- **`verification_gate` reads `ref_slug` from the prose join, not the corpus entry (#332).** `verify_citation`/`verify_passport` previously wrote `summary.ref_slug = entry.get("ref_slug")`, but `literature_corpus_entry.schema.json` is `additionalProperties: false` with no `ref_slug` property — so the normal (schema-valid) passport path emitted `ref_slug: null` and violated the summary contract (a required string). Two non-schema-conformant test fixtures masked it. `ref_slug` is now an explicit prose-sourced parameter parallel to `anchor`: `verify_citation(entry, clients, *, ref_slug, anchor=None, …)` and `verify_passport(passport, clients, *, ref_slug_by_key, anchors=None, …)`, with a `ValueError` on any invalid join — a missing key, or a present-but-empty/non-string slug (validated once at the `verify_citation` emission point via a shared `_is_valid_ref_slug` so the per-citation and passport layers can't drift; the passport layer re-checks only to name the offending `citation_key`) — rather than a contract-invalid summary. The standalone `verify_passport.py` CLI (which has no prose document) now refuses by default with a clear error and offers an explicit `--synthetic-ref-slug citation_key` diagnostic escape hatch instead of silently fabricating a slug. **API-stability note (C-V4):** these are new *required* keyword-only parameters. The spec's C-V4 freeze names v3.10.0, but #182 was specced-but-not-implemented in v3.10 (spec §0 amendment) and first shipped in the v3.11.0 minor release — so no v3.10.0 caller can depend on the old signature, and C-V4 itself permits a minor release to add required fields. The only in-repo callers (the CLI + the internal `verify_passport`→`verify_citation` call) are updated in lockstep.
- **`check_evals_gold_set` enforces `status`↔`queried_by` coherence via the shipped schema (#332).** The gold validator's flat `queried_by ∈ {id, title, null}` enum check under-enforced the conditional coherence the summary schema requires (a ran resolver must carry `id`/`title`, a skipped/unreachable one must carry `null`, and `queried_by` must be present). It now validates each `resolver_outcome` against `citation_verification_summary.schema.json`'s `$defs.resolver_outcome` — single source of truth, matching the existing I9b reduce-and-compare philosophy — and the now-dead `STATUS_ENUM`/`QUERIED_BY_ENUM` constants are removed. The shipped gold set already satisfies the stricter check.
- **Citation-existence advisory visibility + terminal-marker grammar reconciliation (#333).** Two P2 self-consistency issues in the #182 citation-existence gate, neither a gate hole (the formatter's generic `severity=HIGH-BLOCK` refusal catches the strict token regardless). **Item 1 (#342):** the spec was internally self-contradictory — C-V6(b) claimed an advisory `lookup_verified == false` is BOTH "byte-equivalent to v3.9.x" AND "co-emitted in the ref marker", impossible for a firing row, and a second advisory marker token has nowhere to go (the v3.7.3 grammar caps one advisory slot, already taken by contamination's `CONTAMINATED-*` suffix). Resolved by a third path: the marker stays byte-equivalent (no new suffix, no grammar churn), and the advisory's visibility is carried in the **output package** instead — `formatter_agent.md` now requires a mandatory `provenance_summary.md` `Citation Existence Advisories` section listing every advisory `false` row, and `provenance_summary.md` is added to the Output Package Files Delivered table so the carrier can't be dropped. Every "co-emitted in/alongside the advisory annotation" claim was removed from spec §0 / C-V6(b)/(c)/(e) / Rule 12 (the contamination strict clause, which legitimately does co-emit a suffix, is untouched); new C-V6(b) lint in `check_v3_10_policy.py` + 3 mutation tests. **Item 2 (#338):** the canonical "Two marker grammar shapes" terminal enumeration in `pipeline_orchestrator_agent.md` listed `policy=<contamination_triangulation|temporal_integrity>`, omitting `citation_existence` even though the finalizer prose just below emits `policy=citation_existence` tokens; the enumeration is extended and the `mode=` clause reconciled per-policy (`citation_existence` is `strict`-only), + 2 parser fixtures.

## [3.11.0] - 2026-06-04 — Deterministic citation verification gate (#182)

The v3.11.0 minor release ships **#182 — a deterministic citation-existence verification gate**
that runs independently of LLM peer review. It cross-checks every cited reference against up to
four bibliographic indexes (Semantic Scholar + OpenAlex + Crossref + the new arXiv resolver) and
surfaces a per-citation `lookup_verified` status, so a fabricated citation with a provably-bogus
DOI/arXiv ID is caught by deterministic lookup rather than by hoping a reviewer agent notices.
The gate **inherits the v3.10 `terminal_policies` opt-in model** — default advisory, opt-in
`strict` — rather than introducing a second hard-block philosophy: detection always runs and
populates the summary, but a `lookup_verified == false` row is terminal only under
`terminal_policies.citation_existence == strict`. **Default behavior is non-blocking** (advisory,
`/ars-mark-read`-acknowledgeable); a user must opt into `strict` to make existence-failure
terminal. The `false` definition is deliberately **narrowed to ID-keyed unmatched** (an exact
DOI/arXiv lookup that provably fails), so a legitimately-unindexed humanities / non-English /
regional citation with only a title-unmatched stays `unresolvable` and never blocks (C-V6(a); an
acknowledged precision-over-recall tradeoff documented in the spec, mirroring `strict_articles_only`).

**Five delta items (#182):**

- **Delta 1 — arXiv API resolver + four-index contamination rendering.** New `scripts/arxiv_client.py`
  verifies citation existence against `export.arxiv.org` (metadata + existence; no API key, no
  polite-pool email — built-in rate-limit pacing per arXiv ToU; accepts both old-style
  `hep-th/9711200` and new-style `2605.07723` IDs). `scripts/contamination_signals.py` extends the
  v3.9.0 cross-index triangulation advisory matrix from three indexes (k=0..3) to four (k=0..4) with
  an `arxiv_unmatched` signal, and the orchestrator finalizer + formatter render the four new
  advisory suffixes (`CONTAMINATED-ARXIV-UNMATCHED` at the k=1/k_max=1 arxiv-only carve-out;
  `CONTAMINATED-QUADRANGULATION-UNMATCHED` at k=4/k_max=4; plus their two `PREPRINT` compositions).
  All advisory — the terminal gate / refusal list is unchanged (R-L3-2-E). `arxiv_unmatched` field
  added to `literature_corpus_entry.schema.json`.
- **Delta 2 — persistent verification cache.** New `scripts/verification_cache.py` — a local SQLite
  store (`~/.cache/ars/verification.db`, override via `ARS_VERIFICATION_CACHE_PATH`; WAL mode;
  90-day TTL) keyed by `(citation_key, resolver_name, query_form)`, so the same paper cited across
  drafts is verified once. Each resolver entry point (crossref / openalex / S2 / arxiv) gains an
  optional `cache` parameter. New `/ars-cache-invalidate <citation_key>` command removes every
  cached row for a key (idempotent no-op when absent).
- **Delta 3 / C-V6 — citation-existence terminal policy.** New `terminal_policies` key
  `citation_existence` (closed enum `{advisory, strict}`, per-key absence = advisory) in
  `terminal_policies.schema.json`, alongside `contamination_triangulation`. This replaces the
  original Delta-3 `ARS_CLAIM_AUDIT` default-flip as the gate's on/off control. The finalizer is the
  sole policy evaluator; `formatter_agent.md` rule 12 refuses on a `lookup_verified == false` row
  **only under `strict`**, co-emitting `[UNVERIFIED CITATION — lookup_verified=false: ...]` alongside
  the advisory annotation. `HIGH-BLOCK` is terminal — not `/ars-mark-read`-clearable. Manual entries
  structurally exempt.
- **Delta 4 — unified per-citation status surface.** New
  `shared/contracts/passport/citation_verification_summary.schema.json` +
  `scripts/citation_verification_summary.py` write a `lookup_verified` (enum `{true, false,
  unresolvable}`) + `anchor_present` + `resolver_outcomes` (per-resolver `{matched, unmatched,
  unreachable, skipped}`) row per citation. The classification is anti-fabrication-biased (one
  ID-keyed `unmatched` is positive evidence of non-existence; a single transient outage does not
  cancel it) and the `false` form is narrowed to ID-keyed unmatched per C-V6(a).
- **Delta 5 — standalone `verification_gate` API.** New `scripts/verification_gate/__init__.py`
  extracts the gate logic into a callable API composing the four resolvers + the unified summary
  writer (a second caller of the same lower-layer infrastructure as the v3.8 audit, not a
  duplicate). New `scripts/verify_passport.py` CLI runs the gate over a Material Passport
  standalone.

**Lint + CI:**

- `scripts/check_v3_9_0_triangulation.py` (the canonical cross-version contamination-suffix oracle)
  rule 1 upgraded from subsection token-presence to a **matrix-row oracle**: each Delta-1 token must
  sit on the finalizer suffix-table row carrying its exact `(k, k_max)` cell, so deleting or
  mistokening an operational row fails even when the same token survives in surrounding prose. The
  formatter pass-through allowlist set-equality oracle extends 9 → 13 tokens.
- `scripts/_ci_pytest_manifest.toml` backfills 5 data-layer test entries (citation-verification-summary
  / verification-gate / arxiv-client / verification-cache / verify-passport-cli) that shipped with
  the data layer but were not wired into the manifest runner at the time.

Spec: `docs/design/2026-05-21-v3.10-182-promote-citation-gate-spec.md` (§0 v3.11 amendment +
INVARIANT C-V6).

## [3.10.0] - 2026-06-01 — Triangulation policy layer, Kong et al. survey adoptions, eval harness, scoped-write guard

The v3.10.0 minor release bundles the opt-in contamination-triangulation **terminal policy
layer** (#127 PR-B — default behavior byte-equivalent to v3.9.0), several **Kong et al. 2026
survey adoptions** (Rebuttal Commitment Ledger #256/#266/#268/#269, discipline-relative
domain evidence profiles #259), the **v3.10 measurement infrastructure** (generalized eval
gold set + ranking-lift gate, #184), the **#134 scoped-write guard MVP** (a deterministic
`PreToolUse` hook fencing the 23 single-phase agents to their own phase directory; all Bash
denied for those agents), the `/ars-mark-read` plugin commands (#190) + a broken-on-arrival
fix (#195), a Simplified-Chinese README (#185), and CI hardening (#156/#155). Default
*citation-policy* behavior is byte-equivalent to v3.9.0 unless a user opts into a strict
mode (#127). The one default-on behavior change is #134's `PreToolUse` write-scope guard:
the 23 single-phase agents are now fenced to their own phase directory and denied Bash —
this constrains those subagents, not the user-facing skill outputs.

**v3.10 triangulation policy layer (#127 PR-B — opt-in terminal modes, default behavior byte-equivalent to v3.9.0):**

- **#127 PR-B — terminal policy layer.** Ships the contamination-triangulation policy layer deferred by v3.9.0 (#102): opt-in `strict` modes that promote the advisory k=3 triangulation signal to a non-acknowledgeable terminal `HIGH-BLOCK` at the citation-emission boundary. **Default behavior is byte-equivalent to v3.9.0** — an absent or all-`advisory` `terminal_policies` block changes nothing (Invariant 7). Built on PR-A's canonical firm-rules + sync-lint base.
  - **Schema.** New passport-level `shared/contracts/passport/terminal_policies.schema.json` (standalone, NOT inside the entry schema — Invariant 11): `contamination_triangulation` ∈ {`advisory`, `strict`, `strict_articles_only`}; `temporal_integrity` accepts **only** `advisory` (forward-reserved namespace — a schema-accepted temporal `strict` with no wired behavior would be a false-safety bug, Invariant 3). `literature_corpus_entry.schema.json` gains `venue_type` (closed enum incl. explicit `unknown`), `venue_type_provenance` (closed enum; the API-`_inferred` values are deliberately absent per R-L3-2-D), and `venue_type_source` (required iff `trusted_source_declared`). Pair dependencies: type ⟺ provenance (bidirectional); `venue_type == unknown ⟹ provenance == unknown` (one-way — a known type may carry `unknown` provenance, no data loss). All adapter-declared only; never inferred from free-form `venue`. `check_literature_corpus_schema.py` extended to validate a passport-level `terminal_policies` block before iterating entries.
  - **Finalizer (sole policy evaluator).** `pipeline_orchestrator_agent.md` gains a `## Cite-Time Provenance Finalizer — v3.10 extension` section. Under a non-advisory passport it stamps `policy_hash=<slug>` on every ref marker (a fully-encoded human-readable canonical token of the non-advisory `terminal_policies` keys — sorted `key.value` join — so two distinct configs never collide). Under an all-advisory passport NO stamp is emitted: the marker is the bare v3.9.0 shape (byte-equivalent, Invariant 7) — the absence of a stamp is the advisory signal. Under `strict`, a k=3 ref co-emits a `TERMINAL-BLOCK severity=HIGH-BLOCK policy=... reason=... mode=... policy_hash=...` token ALONGSIDE (not replacing) its advisory `CONTAMINATED-*` suffix, so the "why" survives. `strict_articles_only` is a deliberate PRECISION mode — k=3 promotes only when DOI present ∧ `venue_type ∈ {journal-article, conference-paper}` ∧ declared provenance; a DOI-less or unknown-venue journal article stays advisory by design (humanities / non-English / regional coverage gap). Audit trail gains a `terminal_blocked[]` bucket; aggregate counts dedupe by ref slug across advisory + terminal buckets (non-additive). Manual-entry exemption preserved (k=3 structurally unreachable). `HIGH-BLOCK` is terminal — `/ars-mark-read` does NOT clear it.
  - **Formatter (STAMP-ONLY two-gate).** `formatter_agent.md` gains refusal rule 11 (generic `severity=HIGH-BLOCK` inside a `<!--ref:...-->`, NOT a per-subtype list) plus a `## Cite-Time Terminal Policy Gate (v3.10)` section. Two ordered gates, never short-circuited: Gate 1 freshness (stamp mismatch / missing-stamp-under-non-advisory → `[STALE-POLICY-EVALUATION]`; missing-stamp-under-advisory passes, Invariant 7), Gate 2 HIGH-BLOCK refusal applied to every gate-1-passing marker (a stripped-stamp marker still carrying `TERMINAL-BLOCK` is still refused). The formatter never re-evaluates `strict_articles_only` logic (Invariant 13 — the finalizer is the sole evaluator). A bare-prose `HIGH-BLOCK` outside any ref marker never refuses (Invariant 12). v3.9.0 advisory pass-through allowlist unchanged.
  - **Firm rule.** R-L3-2-A reworded in `firm_rules.md` to the broad default-advisory + opt-in-strict form (covering contamination AND the forward-reserved temporal namespace; the wording explicitly states no temporal strict path exists yet, no over-promise). Contamination mirrors stay intentionally by-ID references (not full-block copies); the wording is single-sourced in the canonical block. `check_firm_rules_sync.py` gains a contradiction guard scoped to the R-L3-2-A reference sentence in each contamination-context file (rejects unqualified "advisory only / never block" claims now that strict can block) — deliberately NOT scanning the whole file, so the Collaboration Depth Observer's legitimate "never blocks" wording is not false-flagged.
  - **Migration + adapters.** `scripts/migrate_literature_corpus_to_v3_10.py` seeds passport-level `terminal_policies` (deep-merge — only absent keys, idempotent, dry-run; never backfills `venue_type` from free-form `venue`; clear error on a non-mapping `terminal_policies`; pre-v3.9.0 passports reported out-of-scope, not silently skipped). The three reference adapters (`folder_scan` / `zotero` / `obsidian`) now declare `venue_type` + `venue_type_provenance` (Zotero item type → `adapter_declared`; folder_scan → `unknown`/`unknown`; obsidian honors a frontmatter `venue_type` as `user_declared`, else `unknown`/`unknown`).
  - **Lint + CI.** New `scripts/check_v3_10_policy.py` (runs ALONGSIDE `check_v3_9_0_triangulation.py`, not a rename) covers the schema fields, the `_inferred`-rejection, the pair dependencies, the trusted_source laundering guard, the standalone schema home, the marker grammar (with a reusable parser + the five required fixtures: terminal co-emit / non-terminal advisory / non-terminal clean / legacy-no-stamp / bare-prose-no-refuse), the generic rule-11 shape, the formatter STAMP-ONLY two-gate, and the closed enums. Wired into `spec-consistency.yml` + `_ci_pytest_manifest.toml`. Spec: `docs/design/2026-05-31-ars-v3.10-policy-layer-rescope-spec.md`.

### Added
- **#134 Slice 1 — scoped-write guard MVP (the Active Conductor rescope).** New `PreToolUse` hook `scripts/ars_write_scope_guard.py` fences the 23 single-phase (Bucket A) subagents to their own phase directory: for `Write`/`Edit`/`MultiEdit` it normalizes the single top-level `file_path` (`realpath`, so `..`/symlink traversal resolves in true filesystem order), denies workspace escapes, unconditionally protects the enforcement surface (`hooks.json`, the hook/manifest/lint, agent definition files, `.claude/CLAUDE.md`), then enforces the agent's `allowed_write_globs` with a segment-aware iterative glob matcher (`*` never crosses `/`; `dir/**` is descendants-only; no recursion-limit crash on deep paths). **All Bash is denied for a Bucket A agent** — it uses the Grep/Glob tools to search and the structured editing tools to write. (The spec's "best-effort literal-target Bash" was taken to its sound conclusion: neither "this Bash writes a file" nor "this Bash is read-only" can be decided reliably from a command string without a sandbox, so all-deny is the only zero-fail-open Bash policy; spec carries an Implementation-outcome note + aligned §3.2/§3.3 wording.) Backed by `scripts/ars_phase_scope_manifest.json` (machine-readable scope for the 23 agents) and the fail-open guard lint `scripts/check_v3_10_134_write_scope.py` (three-way name cross-check: classification roster == manifest keys == on-disk frontmatter names, + filesystem exhaustiveness at any nesting depth, so rename/typo/new-agent drift can't silently fail the hook open). `hooks.json` PreToolUse wiring + CI steps (lint + hooks.json wiring assertion) + pytest manifest entries; TDD throughout with lint mutation tests. The structured-tool determinism is the load-bearing win; the Bash deny closes the direct-shell-write path for fenced agents entirely. Slices 2-5 (write-provenance ledger, task envelopes, return contracts, persistent conductor) remain forward-scope. Spec: `docs/design/2026-06-01-ars-134-conductor-rescope-deterministic-write-guard-spec.md`. Closes #134.
- Kong A4 (#259): Discipline-relative domain evidence profiles. New `academic-paper/references/domain_evidence_profiles.md` defines 4 ship-ready profiles (`cs_ml`, `general_social_science`, `humanities_interpretive`, `unknown_user_defined`) + 5 reserved. `intake_agent` Step 12 emits a scholar-selected `Domain Evidence Profile` PCR row (never auto-selected; reserved selections fall back to neutral with a surfaced advisory). `literature_strategist_agent` resolves the row and applies **loosen-only** gate + upstream-filter changes — monotonic admit-only, and profile-admitted sources still flow through the universal relevance + methodology gates. New `scripts/check_domain_evidence_profile.py` (C1–C7 documentation-surface lint, including a SHA-256 pin of the `source_quality_hierarchy.md` Field-Specific Adjustments block) + mutation suite, wired into `spec-consistency.yml` + the pytest manifest. Advisory only. Closes Kong et al. 2026 §7.4.6 domain-evidence-standards gap.
- Kong A1 (#256): Schema 11 R&R Traceability Matrix gains `commitment_extracted` / `fulfillment_status` / `unfulfilled_rationale` optional fields. `revision_coach_agent` Step 3.5 extracts commitments; `re_review_mode_protocol` step 5 verifies + surfaces `COMMITMENT_GAP` advisory. Worked example at `academic-paper/examples/commitment_ledger_example.md`. Calibration seed at `evals/calibration/commitment_ledger_seed.yaml` (10 cases). Advisory only — author retains final responsibility. Closes Kong et al. 2026 §7.4.3 commitment-fulfillment gap.
- Kong A1 follow-up (#269): Schema 11 `required_evidence_type` enum widened from 7 to 9 values, adding `prose_edit` and `other`. `prose_edit` is a seventh **manuscript-evidence** type for sentence-/paragraph-level changes too granular to bucket structurally (typo fixes, terminology clarifications, equation formatting, citation-style corrections); it verifies at `revision_location` like the other manuscript types. `other` mirrors the existing `commitment_type` escape hatch for genuinely uncategorizable evidence and triggers a new soft `EVIDENCE_TYPE_UNSPECIFIED` advisory at re-review (orthogonal to `COMMITMENT_GAP`; fires whenever `required_evidence_type == other`, regardless of fulfillment status). The prior 7-value closed set forced typo-level comments into wrong buckets (`methods_paragraph`) or out of the ledger entirely, violating the every-comment extraction rule. Synced across `shared/handoff_schemas.md` Schema 11, `revision_coach_agent` Step 3.5, `re_review_mode_protocol` Commitment Ledger Verification, and `revision_tracking_template.md`; worked example and calibration seed (now 12 cases, +E1/E2) extended. Advisory only. Surfaced by Gemini R3 review of PR #264, Finding 3. Closes #269.
- Kong A1 follow-up (#268): Schema 11 Commitment Ledger refactored from three index-aligned **parallel lists** (`commitment_extracted` objects + top-level `fulfillment_status[]` + `unfulfilled_rationale[]`) to a **nested-object** shape — `fulfillment_status` and `unfulfilled_rationale` now nest INSIDE each `commitment_extracted` object. This makes length-mismatch / index-desynchronization structurally impossible, closing the Gemini R3 (PR #264) Finding 1 fragility where a dropped Markdown `<br>` or numbering error silently mispaired a status with the wrong commitment and produced a false `COMMITMENT_GAP` advisory. **REPLACE, not coexist** (spec §2): the parallel-list shape is removed entirely — no executable consumer, lint, or fixture carried it (the #263 calibration harness is unshipped; the seed is a non-runnable seed), so coexistence would only preserve the failure mode. Lifecycle fields are absent at extraction time (`revision_coach_agent` Step 3.5) and appended per-object during revision execution; the old `unfulfilled_rationale: ""` placeholder for fulfilled commitments is dropped (omitted, not empty-string). The equal-length validation invariant is retired (now structurally impossible); a legacy-normalization note instructs zipping any pre-#268 top-level arrays onto the nested objects before re-review. Synced across `shared/handoff_schemas.md` Schema 11 (incl. the #266 `residual_action` coherence prose, reworded from `unfulfilled_rationale[i]` index notation to object-field notation), `revision_coach_agent` Step 3.5, `re_review_mode_protocol` Commitment Ledger Verification, `revision_tracking_template.md` (three fragile `<br>`-separated columns collapsed into one per-commitment nested YAML ledger), worked example, and the 12-case calibration seed. `author_fulfillment_claim` (Gemini's promised-vs-claimed-vs-verified split) deferred — not required for the structural fix (spec §2). New `scripts/check_268_nested_commitment_ledger.py` (N1-N5 + N3b: seed extraction-field presence, no retired parallel-list keys, per-commitment lifecycle coherence via a `_blank_rationale` helper that treats missing/null/whitespace uniformly, case-level `expected_commitment_gap` oracle coherence with a real-boolean guard, no surviving index notation) + 18 mutation tests, wired into `spec-consistency.yml` + the pytest manifest. Advisory semantics unchanged. Surfaced by Gemini R3 review of PR #264, Finding 1. Spec: `docs/design/2026-05-31-ars-268-schema11-nested-commitment-ledger-spec.md`. Closes #268.
- Kong A1 follow-up (#266): Schema 11 `residual_action` (concern-level) vs `unfulfilled_rationale` (per-commitment) coherence. Documented their semantic relationship (different granularity and tense — `unfulfilled_rationale[i]` is backward-looking and per-commitment, `residual_action` is forward-looking and concern-level, so a row may carry both without redundancy or contradiction), the multi-commitment single-string shape convention (`residual_action` stays one concern-level string, not expanded into a list), and a `re_review_mode_protocol` note that a populated `residual_action` alongside some `fulfillment_status[i] == fulfilled` is not a contradiction, cross-referencing the `shared/handoff_schemas.md` Schema 11 convention. Doc-only; advisory semantics unchanged. Closes #266.

**Bug fixes (no version bump — corrects a broken-on-arrival behavior from #190):**

- **#195 — `/ars-mark-read` crashed on real YAML passports.** `scripts/ars_mark_read.py:_load_corpus_keys` used `json.load()` to read the Material Passport, but every adapter (folder_scan / zotero / obsidian) and every other ARS tool produces / consumes `passport.yaml`. The existing 11-test fixture in `scripts/test_ars_mark_read.py` wrote JSON-formatted passports, so the suite was green while real-world `/ars-mark-read smith2024 --passport-path ./passport.yaml` exited with `json.JSONDecodeError` before reaching citation-key validation. Two new TDD tests pin the adapter-format expectation (YAML happy path + YAML invalid-key hard error); `_write_passport` helper switched to `yaml.safe_dump`. Companion P2 also closed: existing-but-unwritable read-log file now surfaces the canonical `[ARS-MARK-READ ERROR: ...]` fail-fast rather than a bare `PermissionError` traceback, via an extra `os.access(log_path, os.W_OK)` check after the parent-W_OK gate. 14 ars_mark_read tests pass (was 11), full suite 1623 / 3 skipped. Surfaced by post-squash codex review of PR #191 (issue #192).

**Plugin commands (prep for v3.10 — no behavior change to existing skills):**

- **#190 — `/ars-mark-read` + `/ars-unmark-read` plugin commands.** v3.6.8 spec §3.6 + Step 7 (round-2 R2-002, round-5 R5-003 amends) designed these commands as the user-facing affordance for the human-read signal, but the command surface itself was never shipped — `commands/` carried only the 10 `/ars-<mode>` skill triggers. New `scripts/ars_mark_read.py` deterministic CLI implements the four §3.6 R5-003 fail-fast modes (no active passport / passport not found / parent unreadable / read-log unwritable), the §3.6 firm-rule-2 hard error on invalid `citation_key`, batch-level all-or-nothing semantics (any invalid key rejects the whole batch), and the §3.6 firm-rule-3 append-only write to `<passport-stem>_human_read_log.yaml` next to the active Material Passport. `/ars-unmark-read` writes `rescinded_at: <ISO 8601>` to the matching entry, never deletes. Two new thin markdown command files (`commands/ars-mark-read.md`, `commands/ars-unmark-read.md`) invoke the CLI via Bash; both declare `model: sonnet` routing per `feedback_no_haiku.md`. New `scripts/check_v3_6_8_mark_read_commands.py` CI lint per spec Step 7 acceptance: 2 commands exist, carry the `literature_corpus[]` validation reference, reference the `human_read_log.yaml` peer-file write target (NOT entry frontmatter, per §3.1 firm rule 3), and declare `model: sonnet`. 11 unit tests for the CLI + 6 unit tests for the lint. `/ars-list-read` and `commands/ars-mark-read.zh-TW.md` were spec-marked optional and remain deferred. Closes #190.

**v3.10 measurement infrastructure (prep for v3.10 — no behavior change to existing skills):**

- **#184 Phase 1a — citation-extraction gold subset.** New top-level `evals/` directory holds v3.10 generalized gold-set corpora for `verification_gate.verify_citation` measurement targets. Ships `evals/gold/citation_extraction/` with 50 hand-curated tuples (all populated in this PR) + `manifest.yaml` + `expected_outcomes.json`. v3.10.0 binding thresholds: aggregate `accuracy >= 0.90` across 50 tuples, per-class `accuracy >= 0.85` for each of `true` / `false` / `unresolvable` (changing requires spec amendment per #184 §3.1.1 / E-V2). Distribution: 20 valid_doi + 10 valid_arxiv + 5 manual_exempt + 15 fabricated (= 50). The original `valid_unresolvable` source class was removed as unbuildable — no stable first-party-verifiable real-but-unmatched citation exists under current index coverage; tuples 031-040 were reassigned to `fabricated`; coverage gap tracked in #250. Tuple shape (locked per codex consult Q1-Q5): self-contained `corpus_entry` mirroring `literature_corpus_entry`, `arxiv_id` as tuple-level field (forward-looking — see #234 for #182 implementation alignment), `human_expert_verdict` optional (10/50 = 20% per Delta 5), `fabrication_intent` boolean enforced on fabricated tuples. New `scripts/check_evals_gold_set.py` enforces 9 invariants (I1 set equality / I2 tuple_id ↔ filename / I3 kind distribution / I4 no-dup-JSON-keys / I5 label ↔ kind / I6 arxiv_id placement / I7 fabrication_intent marker / I9 resolver_outcomes shape / I10 corpus_entry schema) via 17 mutation tests on a 3-tuple clean fixture. CI step wired into `.github/workflows/spec-consistency.yml`. Spec: `docs/design/2026-05-21-v3.10-184-extend-eval-harness-spec.md`.
- **#184 Phase 1b — eval harness + ranking-lift gate.** New `scripts/run_evals.py` multi-task harness (`python -m scripts.run_evals [--task <name>] [--baseline <path>] [--compare <path>] [--output <report.json>]`): discovers every `evals/gold/<task>/manifest.yaml`, measures each task, and emits a report shaped by the new `shared/evals_lift_report.schema.json` (required `harness_version` / `run_id` / `gold_set_version` / `per_task[]` / `caveats[]` with the v3.8 honesty-disclosure `minItems:1` convention). For `citation_extraction` the harness computes the predicted `lookup_verified` 3-class enum itself from each tuple's `resolver_outcomes.*.status` via the #182 Delta 4 reducer (`verification_gate.verify_citation` has not shipped — reconcile when it does); the metric is symmetric 3-class accuracy, `unresolvable` is never collapsed into `false`. For `rq_framing_patterns` it dispatches to the existing `scripts/check_rq_framing_patterns.py` runner and adapts its FNR / FPR / balanced-accuracy output into the per-task lift shape. `--baseline` + `--compare` produce a side-by-side report carrying `lift_pre` / `lift_post`; `expert_concordance` is emitted per class over the 10 `human_expert_verdict`-labeled tuples (advisory, never gates per E-V3). Missing entrypoint module / Phase-2 gold set yields a `pending`/`skipped` notice, never a traceback. New `scripts/check_ranking_lift.py` lift gate: pure `compute_signed_lift(baseline, compare, direction)` (higher-is-better `(compare-baseline)/|baseline|`, lower-is-better numerator inverted, zero-baseline `+inf`/`-inf`); blocks on any `signed_lift < -0.05` or zero-baseline change unless the PR body carries `[ranking-regression-acknowledged]` + an OPEN issue URL and the declared `Affected metric: <task>.<class>.<metric>` matches the observed change (E-V4); OPEN-issue check via a monkeypatchable `_issue_is_open` seam (never networks in tests). New CI workflow `.github/workflows/eval-harness.yml` (Delta 3 path filter; concurrency group includes `github.event_name`; OQ-3 skip-guard for absent Phase-2 gold sets; deterministic `[eval-regression-acknowledged]` + OPEN-issue PR-body gate) and net-new `.github/pull_request_template.md` Eval-impact section. Tests: `scripts/test_run_evals.py`, `scripts/test_check_ranking_lift.py`, `scripts/test_evals_citation_extraction.py`, `scripts/test_evals_lift_report_schema.py` (incl. trivial-accept-all schema mutation). Spec: `docs/design/2026-05-21-v3.10-184-extend-eval-harness-spec.md`.

**Localization (no version bump — no behavior change to skills):**

- **#185 — Simplified Chinese README.** New `README.zh-CN.md` (630 lines, mirroring `README.zh-TW.md` structure) translated by external contributor [@xpfo-go](https://github.com/xpfo-go) ([PR #181](https://github.com/Imbad0202/academic-research-skills/pull/181)). Language switcher updated across the four READMEs (en / zh-CN / zh-TW / ja-JP); `CONTRIBUTING.md` README sync guidance extended to four locales. `scripts/check_spec_consistency.py` refactored to share zh-TW / zh-CN logic via `ZH_README_CONFIGS` tuple; both locales covered by `test_aligned_zh_cn_readme_passes` + `test_stale_zh_cn_badge_fails` regression tests (symmetric with the ja-JP tests added in #170).

**CI / infrastructure (no version bump — no behavior change to skills):**

- **#156 — Unified pytest invocation manifest.** Twelve `pytest scripts/test_*.py` invocations in `.github/workflows/spec-consistency.yml` are now declared in `scripts/_ci_pytest_manifest.toml` and run via `scripts/run_ci_pytest_manifest.py`. Drift guard `scripts/check_ci_pytest_manifest.py` rejects (a) missing `path`, (b) duplicate `id`, (c) duplicate `(path, args)`, (d) malformed `args`, (e) any `pytest scripts/test_*.py` re-introduced in the workflow outside the runner. `pip install pytest` consolidates from 12 redundant installs to one. 17 unit tests for runner + lint. `python3 -m unittest scripts.test_*` invocations stay inline (out of scope for #156). 41 disk `test_*.py` files that the manifest does not list remain unclassified — separate follow-up.

- **#155 — Re-attempt F4: harden `test-count-monotonic.yml` to fail on pytest collection errors.** Both head and base count steps now capture pytest's exit code separately from the pipe, treat exit 5 (no tests collected) as a tolerable degenerate case, and fail the gate on any other non-zero exit. Previously, a `2>/dev/null | grep -c '::' || true` swallow on the base step would silently set BASE_COUNT to 0 on a broken-import or fixture-missing error in the base commit, making the head-vs-base monotonic check vacuously pass. The original F4 fix landed in PR #153 commit 8121dfa during the v3.9.4.2 cycle but was reverted in 4abf9de when it surfaced #154 (now closed by PR #158). With #154 fixed and #156 keeping CI test discovery clean, F4 v2 ships symmetrically across head and base.

---

## [3.9.4.2] - 2026-05-19 — Post-ship hotfix for PR #149 CI discipline gates

**Trigger:** Codex post-ship review of PR #149 (7 CI discipline gates mechanizing the release-cycle review chain) surfaced 4 P2 findings. v3.9.4.2 hardens 3 of 4; the 4th (test-count-monotonic harden) was reverted because it surfaced a pre-existing `scripts/` package issue, tracked as #154 (since fixed by PR #158) and re-attempt #155.

**CI gate hardening (PR #149 + #153):**
- **F1 — harness-retirement scheduler context:** `harness-retirement-monthly.yml` adds `GH_REPO` so scheduled runs have repo context for `gh issue create` (workflow was silently failing on cron without it).
- **F2 — release-cooldown tag filter:** `release-cooldown.yml` filters `PREV_TAG` lookup to `v*` tags so non-release tags (e.g., legacy plugin tags) cannot bypass the cooldown gate.
- **F3 — release-cooldown hot-fix detection:** `release-cooldown.yml` also reads annotated tag subject + accepts the `hot-fix` spelling variant; v3.9.2 was previously a false-negative hotfix under the old detector.
- **F4 (reverted):** `test-count-monotonic.yml` harden landed in 8121dfa and reverted in 4abf9de when it surfaced `scripts/` package import errors (`ModuleNotFoundError: No module named 'scripts'`) — pre-existing latent defect masked by the prior `2>/dev/null | || true` pattern. Tracked as #154 (now closed by PR #158) and re-attempt #155.

**Release-cooldown symmetry follow-up (PR #157):**
- Override token `[skip-cooldown]` now read from both the commit message AND the annotated tag message. This v3.9.4.2 tag itself is the self-bootstrapping fix — the gate correctly identified v3.9.4.1 (3h prior) as the previous hotfix and fired the 24h cooldown, proving F2+F3 work end-to-end. The override symmetry patch makes the tag shippable.

**Closes:** #152. **Follow-ups:** #154 (closed by PR #158), #155, #156.

---

## [3.9.4.1] - 2026-05-19 — Post-ship hotfix for v3.9.4 temporal verification

**Trigger:** Codex post-ship review of v3.9.4 squash commit `af09cf5` surfaced 4 real bugs that per-task subagent reviewers missed during v3.9.4 implementation. v3.9.4 tag remains immutable; v3.9.4.1 patches the verifier and schema layer + brings docs in alignment.

**Bug fixes:**
- **#135 P1 (audit wiring):** `audit()` now passes `citation_provenance` through to `_pass_2_anachronism` and `_pass_4_causal`. When a ref slug has `confidence: low` or `conflict` in citation_provenance.yaml, the verifier emits `TEMPORAL-METADATA-MISSING` instead of using timeline dates as arithmetic ground truth. v3.9.4 dropped citation_provenance on the floor — spec §3.4 first-party safety check was structurally broken.
- **#135 P1 (date parser):** `_date_to_interval()` now parses all schema-valid date shapes including `YYYY-MM` (Crossref month-precision output) and `YYYY-MM-DD..YYYY-MM-DD` (interval precision used by effective_date_range). v3.9.4 only handled day/year/prose-month forms — schema-valid month/interval shapes raised ValueError and P2/P4 silently skipped the check via the existing `except ValueError: continue` guard.
- **#135 P2 (P4 direct-date binding):** P4 now binds each side of a causal trigger to either a `<!--ref:slug-->` marker OR a direct date capture in the sentence. v3.9.4 required refs on both sides, silently dropping sentences like "The 2026 policy enabled the 2020 rollout." `bound_dates.source` distinguishes `timeline_ref` from `draft_capture`; `bound_refs` is empty when both sides came from direct date capture.
- **#135 P2 (schema absent-property bypass):** `citation_provenance.schema.json` `confidence:high` allOf branch now requires both `crossref_issued` and `pdftotext_cover_first_line` to be present in addition to non-null (`then.required` added). v3.9.4 used `then.properties` only, which doesn't fire when a property is absent — so entries with `confidence:high` and both source fields omitted silently passed validation.

**Documentation:**
- `docs/ARCHITECTURE.md` updated from stale v3.8.0 baseline to v3.9.4.1; Section 8 Evolution Timeline filled in v3.8.1 / v3.8.2 / v3.9.0 / v3.9.1 / v3.9.2 / v3.9.3 / v3.9.4 / v3.9.4.1 entries; Section 9 Skill Modes table aligned to current versions.
- Suite-version needles aligned across MODE_REGISTRY.md, README.md badge + tag URL + section heading, README.zh-TW.md badge + tag URL + section heading, academic-pipeline/SKILL.md frontmatter, `.claude-plugin/plugin.json`, `scripts/check_spec_consistency.py` expected-text constants, `.claude/CLAUDE.md` skill suite table.

**Test count:** 1549 → **1561** (+12 net new tests covering all 4 fixes, 0 regression).

---

## [3.9.4] - 2026-05-18 — Temporal Verification Layer (advisory)

**External motivation:** Issue #135 — LLM next-token objectives are systematically blind to deterministic factual classes including temporal ordering. v3.9.4 adds a deterministic advisory verifier at the Phase 4 → 5 boundary covering 5 failure modes.

**Mechanisms:**
- M1: new Phase 2 sibling `timeline_extraction_agent` owning `phase2_investigation/timeline.yaml` + `phase2_investigation/citation_provenance.yaml`
- M2: Phase 4 → 5 deterministic verifier `scripts/temporal_integrity_audit.py` (5 passes)
- M3: Temporal Integrity Iron Rule in `report_compiler_agent` + `draft_writer_agent`
- M6-minimal: First-party Crossref `issued` + pdftotext cover verification
- M7-minimal: Date provenance + comparator materialization
- M5-stub: User-declared `version_family_id` only

**Zero modification** to `literature_corpus_entry`, `claim_audit_result`, `claim_intent_manifest`. `bibliography_agent` unmodified (F2 invariant). 3 new sidecar schemas (aggregate-level with `$defs`).

**Coverage estimate:** 55-70% baseline / 65-75% with M7 minimal (LLM extractor blindness on tuple extraction is structural; advisory architecture acknowledges this).

**Out of v3.9.4 scope** (deferred to v3.10): M4 reviewer integration, M5 full version discovery, M6 full PDF audit, M8 relation manifest, CC5 catalog-completeness semantics, hard-block policy, OpenAlex lookup.

Spec: `docs/design/2026-05-18-ars-v3.9.4-temporal-verification-spec.md`.


... [TRUNCATED] ...
```

### `CONTRIBUTING.md`
```
# Contributing to Academic Research Skills

Thank you for your interest in contributing. This document explains what kinds of contributions we accept and how to submit them.

---

## How to submit a contribution

ARS uses the standard **fork-and-PR** workflow. Fork the repo on GitHub, clone your fork, create a branch, make your changes, push to your fork, then open a PR against `Imbad0202/academic-research-skills`.

**Important**: You cannot push directly to this repo — you must fork it first and submit a PR from your fork.

---

## What we accept

### Community-maintained (fast merge)

These contributions can be merged quickly with minimal review:

- **Typo and formatting fixes** — spelling, broken links, markdown rendering issues
- **New examples** — pipeline output showcases, worked examples for specific disciplines
- **Translation improvements** — better zh-TW or EN phrasing in READMEs or agent definitions

### Requires maintainer review

These need careful review because they affect system behavior:

- **Journal and field reference lists** — additions to `top_journals_by_field.md`, new discipline glossaries
- **Evaluation sets** — gold-standard papers for calibration mode, benchmark data
- **New reference files** — methodology guides, citation format references, domain-specific protocols
- **Bug and drift fixes** — version inconsistencies, broken cross-references, incorrect metadata
- **Mode changes** — new modes, trigger keyword changes, oversight level adjustments

### Requires maintainer approval + discussion

Open an issue first before submitting a PR for these:

- **Agent definition changes** — modifications to any file in `*/agents/*.md`
- **IRON RULE modifications** — any change to rules marked with the IRON RULE marker
- **Ethics and integrity rules** — changes to the failure mode checklist, integrity protocols, or ethics review
- **Handoff schema changes** — modifications to `shared/handoff_schemas.md`
- **New skills or modes** — additions to the pipeline

### Platform ports (community-maintained only)

This repository is the reference distribution of ARS, built for Claude Code. Ports to other agent platforms (Opencode, Cursor, Continue, Aider, etc.) are accepted as community-maintained contributions. Two structural shapes are acceptable — both keep core ARS content as the source of truth:

- **In-tree wrapper.** Add a top-level `<platform>/` directory in this repo (e.g. `opencode/`) containing the manifest, plugin entry, and dispatch shims. Core ARS files (`skills/*/SKILL.md`, `agents/*.md`, `shared/`, `scripts/`) remain unmodified.
- **Sibling distribution.** A separate repository that vendors ARS workflow content with: (1) upstream commit hash pinned (e.g. in a `manifest.json`); (2) a written update / sync policy; (3) vendored content unmodified — only the outer routing / adapter layer is platform-specific.

Either shape is accepted under the same maintainer-facing conditions:

- **Named maintainer.** The PR description (in-tree) or repo README (sibling) must identify who will keep the port in sync with ARS minor releases (~6-week cadence) and triage platform-specific bug reports. Platform-specific issues will be redirected to that maintainer.
- **End-to-end evidence.** Include at least one full `academic-pipeline` run on the target platform, committed under `examples/<platform>/` (in-tree) or under an `examples/` path in the sibling repo, so regressions are detectable.
- **Model-portability note.** ARS prompts are calibrated against Claude (Opus for architecture/review, Sonnet for execution; never Haiku). The PR must document which providers/models were tested and where downstream-agent behavior diverged from the Claude baseline.
- **Open a design issue first** before submitting the PR (for in-tree) or before requesting sibling-distribution recognition in this repo's README.

---

## PR guidelines

- **One concern per PR** — don't mix unrelated changes
- **Describe what and why** — explain the motivation, not just the change
- **Reference issues** — if your PR addresses an open issue, link it
- **Test your changes** — if you're modifying agent definitions, try running the skill to confirm it works as expected
- **Keep READMEs in sync** — if your change affects user-facing documentation, update `README.md`, `README.zh-CN.md`, `README.zh-TW.md`, and `README.ja-JP.md` when applicable

---

## Governance

### Maintainer

The repo is maintained by [Cheng-I Wu](https://github.com/Imbad0202) (HEEACT). The maintainer has final say on all merges.

### Decision principles

1. **Accuracy over completeness** — we'd rather have fewer, verified journal entries than a long unvetted list
2. **Human-in-the-loop always** — contributions that reduce human oversight or enable fully autonomous paper generation will be declined
3. **No detection evasion** — features designed to make AI-generated text harder to detect (as opposed to higher quality) are out of scope. See [Issue #3](https://github.com/Imbad0202/academic-research-skills/issues/3) for context.
4. **Discipline diversity welcome** — ARS defaults to higher education research but aims to be domain-agnostic. Discipline-specific modules are encouraged.

---

## Release checklist

Most release mechanics are CI-enforced (`check_version_consistency.py` keeps CLAUDE.md / SKILL.md / CHANGELOG / plugin manifests / README badge in lockstep; the release-cooldown workflow paces tags). One convention is editorial and lives here:

### `Real-use findings` subsection (#395)

When drafting a release's CHANGELOG entry, include a **`Real-use findings`** subsection if any of the release's issues were discovered through actual use of the suite on a real paper — one line per issue, naming the run that surfaced it. Paper-derived / external-motivation work (the Zhao / Kong / Kim tracks) does NOT belong here; the subsection exists precisely to make the other provenance class visible. Background: the v3.6.7 production chapter run surfaced 17 drift patterns, but that lived-experience provenance was buried in spec prose with no fixed, greppable home — and release motivation since v3.8 has been almost entirely external papers, which is itself a signal worth seeing per release. If a release has no real-use findings, omit the subsection; never pad it.

## Academic integrity policy

This repo is designed to be **assistive, not deceptive**. See [POSITIONING.md](POSITIONING.md) for the full design philosophy. Contributors must not add features designed to evade AI detection tools. If unsure, open an issue to discuss before submitting a PR.

---

## Credit

Contributors are credited in commit messages, CHANGELOG entries, and the Contributors section of the README. For significant contributions (new features, major reference files), we also add a mention in the relevant release notes.

## License

By contributing, you agree that your contributions will be licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). See [POSITIONING.md](POSITIONING.md) for usage terms.

## When adding a new skill

Read [`shared/ground_truth_isolation_pattern.md`](shared/ground_truth_isolation_pattern.md) before writing the SKILL.md. It explains the three-layer model behind the `data_access_level` and `task_type` frontmatter fields and lists the do/don't rules for handling evaluation rubrics, gold labels, and answer keys.
```

### `MODE_REGISTRY.md`
```
# Mode Registry

Single source of truth for all modes across the ARS suite. **27 modes** across 4 skills.

When adding or modifying modes, update this file first — SKILL.md files and CLAUDE.md should reference this registry.

Last updated: v3.12.1 (2026-06-15)

---

## deep-research (8 modes)

| Mode | Spectrum | Output | Oversight | Triggers |
|------|----------|--------|-----------|----------|
| `full` | Balanced | APA 7.0 report, 3,000-8,000 words | High | "research [topic]", "deep research", "academic analysis" |
| `quick` | Fidelity | Research brief, 500-1,500 words | Medium | "quick brief", "30 minute summary", "quick research" |
| `review` | Balanced | Reviewer report on provided text | High | "review this paper", "evaluate this paper", "assess this source" |
| `lit-review` | Fidelity | Annotated bibliography + synthesis | Medium | "literature review", "annotated bibliography" |
| `three-way-scan` | Fidelity | WHY/HOW/WHAT paper shortlist + cross-paper synthesis | Low | "WHY HOW WHAT papers", "3W literature scan", "compare these papers" |
| `fact-check` | Fidelity | Claim-by-claim verification report | Medium | "verify claims", "fact-check", "evidence verification" |
| `socratic` | Originality | Research Plan Summary + INSIGHT collection | Very High | "guide my research", "help me think through", "I'm not sure what to research" |
| `systematic-review` | Fidelity | PRISMA 2020 report, 5,000-15,000 words | Medium | "systematic review", "meta-analysis", "PRISMA" |

## academic-paper (11 modes)

| Mode | Spectrum | Output | Oversight | Triggers |
|------|----------|--------|-----------|----------|
| `full` | Balanced | Complete paper draft (IMRaD or domain-appropriate) | High | "write a paper", "academic paper", "research paper" |
| `plan` | Originality | Chapter Plan + INSIGHT collection (Socratic) | Very High | "guide my paper", "help me plan", "step by step paper" |
| `outline-only` | Balanced | Detailed outline + evidence map | High | "paper outline", "just need an outline" |
| `revision` | Fidelity | Revised draft + point-by-point R&R responses | High | "revise paper", "incorporate reviewer feedback" |
| `revision-coach` | Balanced | Revision Roadmap + Response Letter Skeleton | Medium | "parse reviews", "I got reviewer comments" |
| `abstract-only` | Fidelity | Bilingual abstract (zh-TW + EN) + keywords | Medium | "write abstract" |
| `lit-review` | Fidelity | Annotated bibliography in paper format | Medium | "literature review paper", "write a lit review" |
| `format-convert` | Fidelity | Formatted document (LaTeX/DOCX-via-Pandoc/PDF/MD) | Low | "convert to LaTeX", "convert citations to [format]" |
| `citation-check` | Fidelity | Citation error report | Low | "check citations", "verify references" |
| `disclosure` | Fidelity | Venue-specific AI-usage disclosure statement | Low | "AI disclosure for [venue]", "generate AI usage statement" |
| `rebuttal-audit` | Fidelity | Advisory QA of an existing rebuttal draft (per-comment coverage + gaps + risk flags); no generation; no Schema 11 emission | Low | "audit my response", "check my rebuttal", "did I miss any reviewer comment" |

## academic-paper-reviewer (6 modes)

| Mode | Spectrum | Output | Oversight | Triggers |
|------|----------|--------|-----------|----------|
| `full` | Balanced | 5 review reports + Editorial Decision + Revision Roadmap | High | "review paper", "peer review", "manuscript review" |
| `re-review` | Fidelity | Revision verification checklist + residual issues | Medium | "check revisions", "verification review" |
| `quick` | Fidelity | EIC quick assessment + key issues list | Low | "quick review", "quick look" |
| `methodology-focus` | Fidelity | In-depth methodology review | Medium | "check methodology", "focus on methods" |
| `guided` | Originality | Socratic issue-by-issue dialogue | Very High | "guide me to improve", "walk me through issues" |
| `calibration` | Fidelity | Calibration Report (FNR/FPR/AUC) + confidence disclosure | Medium | "calibrate reviewer", "measure reviewer accuracy" |

## academic-pipeline (1 orchestrator + 1 resume mode)

| Mode | Spectrum | Output | Oversight | Triggers |
|------|----------|--------|-----------|----------|
| (pipeline) | Balanced | 10-stage orchestrated workflow | Very High | "academic pipeline", "research to paper", "full paper workflow" |
| `resume_from_passport=<hash>` | Fidelity | Resume a prior pipeline run from a Material Passport reset boundary. Opt-in (`ARS_PASSPORT_RESET=1`). See `academic-pipeline/references/passport_as_reset_boundary.md`. | High | "resume from passport", "continue pipeline from reset boundary" |

---

## Summary

| Metric | Count |
|--------|-------|
| Total modes | 27 |
| Fidelity | 16 (59%) |
| Balanced | 7 (26%) |
| Originality | 4 (15%) |

### Oversight levels

| Level | Meaning |
|-------|---------|
| Very High | User-led dialogue or mandatory checkpoints at every stage |
| High | User confirms key decisions (RQ, outline, configuration) |
| Medium | Structured format with limited decision points |
| Low | Mechanical/template-driven, minimal human input |
```

### `NOTICE.md`
```
# NOTICE

## Personal Project Statement

This project (academic-research-skills) is a personal project by Cheng-I Wu (Imbad0202).

**Development context:**
- Developed in personal time using personal equipment
- Uses personal AI subscriptions (Claude / Codex / Gemini etc., self-paid)
- Does not contain confidential information from any employer
- Domain knowledge applied is publicly available or personally researched

**Relationship to employment:**
- The author is currently employed in higher education quality assurance.
- This project explores technical / methodological topics in that field.
- It is not developed under employer direction or using employer resources.
- Views and code are the author's own, not the employer's.

## License

See LICENSE file for terms.
```

### `POSITIONING.md`
```
# Positioning

## What this is

Academic Research Skills (ARS) is a **source-available academic research copilot framework** for noncommercial scholarly use. The reference distribution is a suite of Claude Code skills that assists human researchers through the full research-to-publication pipeline. Sibling distributions for other agent platforms ([e.g. Codex](https://github.com/Imbad0202/academic-research-skills-codex)) follow the same workflow content, the same human-in-the-loop design philosophy, and the same license terms; see [CONTRIBUTING.md § Platform ports](CONTRIBUTING.md#platform-ports-community-maintained-only).

It is licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). This is not an open source license — it restricts commercial use by design, to keep the tool free for academic communities.

## What this is not

ARS is not an autonomous paper-writing system. It is not a replacement for the researcher. It does not claim authorship, and its outputs are not submission-ready without human review.

## Rejected mechanisms (autonomous-research anti-patterns)

These are not "out of scope" footnotes. They are the load-bearing boundary that defines what ARS does NOT do, and would not do even if a future system made them feasible. Each is the kind of autonomous mechanism catalogued by Kong et al. (2026), *AI for Auto-Research: Roadmap & User Guide* (arXiv:2605.18661), and rejected against the human-led positioning above. The recorded review test for all five — "who controls the next research-state transition?" — lives in the [L1 design lesson](docs/design/2026-06-08-kong-255-l1-copilot-not-auto-research.md).

- **End-to-end autonomous research pipeline** (Kong §7.4.8). A system that carries a project from question to manuscript without scholar confirmation at each state transition. Rejected: the scholar would become a reviewer of AI output, not the author. The pipeline's mandatory checkpoints exist precisely to prevent this.
- **Idea-generation agent** (Kong §3.1). An agent that proposes research hypotheses or questions *for* the scholar. Rejected — and distinct from the shipped wording-pattern advisory (#257): ARS may flag surface-level wording / framing patterns in a scholar-supplied research question and ask a Socratic follow-up, but it must not propose, substitute, rank, expand, or select research hypotheses or questions for the scholar. The boundary is recorded in the [L2 design lesson](docs/design/2026-06-08-kong-255-l2-advisory-not-generation.md).
- **Paper2X auto-generation** (Kong §6). Autonomous generation of slides / posters / video from a manuscript. Rejected — and distinct from a *fidelity audit*: ARS may audit an already-authored or externally generated dissemination artifact against the manuscript for fidelity, but it must not transform a manuscript into a dissemination artifact by choosing the content, narrative, layout, or output medium itself. (Dissemination *design* is handled by separate, non-ARS skill chains; the fidelity-audit suggestion itself is out of this repo's scope.)
- **Autonomous experiment execution / coding** (Kong §3.3). An LLM that runs experiments or code without scholar oversight. Rejected — and distinct from the shipped Experiment Provenance Intake (#260): ARS may ingest scholar-declared external experiment provenance and check manuscript claims against the declared results, but it must not initiate, run, modify, iterate, or treat tool-executed experiment / code outputs as evidence inside the pipeline.
- **Physical wet-lab automation API** (Kong §7.4.6). An interface that drives liquid handlers or automated labs. Rejected: even with safeguards, this extends beyond a research copilot's scope into laboratory infrastructure, and conflicts with the copilot-not-pilot positioning.

These are first-party scope boundaries and review criteria for future changes, not runtime guarantees. First-party ARS treats each as out of scope; adding one would require changing this recorded boundary, not merely adding a feature.

## Recorded non-goals (scope boundaries without a mechanism)

Unlike the Rejected mechanisms above — capabilities ARS refuses on principle — these are lifecycle stages and state layers ARS deliberately does not enter. They were adjudicated out of scope in the 2026-06-10 researcher-blindspot audit and are recorded here so the boundary is reviewable, not improvised (the same recording discipline as the Rejected mechanisms; boundary + review criterion, not a runtime guarantee).

- **Post-publication lifecycle.** Tracking citation contexts of the scholar's own published papers, errata/corrigenda workflows, and OA self-archiving compliance are out of scope. ARS's front is research-to-publication; what happens to a paper after it ships belongs to the scholar and their institutional tooling. The existing `monitoring_agent` is unaffected — it alerts on developments in the *cited* literature (an input to current work), not on the scholar's own published output. Review criterion: a proposed feature whose value begins *after* the manuscript is accepted extends the front, and requires changing this recorded boundary first.
- **Research-program-level state.** ARS keeps no memory across papers: no registry of the scholar's prior claims, no carried-forward limitations list, no reviewer-history profile. The per-paper Material Passport remains the only state carrier, and every run starts from what the scholar explicitly feeds it. This is a deliberate consequence of the anti-leakage philosophy — gates that trusted an ambient cross-paper memory would be evaluating state nobody declared this run. The supported way for a returning author to carry their own prior work forward without any new mechanism is the [Cross-paper workflow guide](docs/cross-paper-workflow.md). Review criterion: a proposed feature that reads or writes scholar state outside the current run's passport crosses this boundary.

## Allowed uses

- Research assistance: literature search, source verification, citation checking
- Teaching: demonstrating research methodology, peer review processes, academic writing standards
- Method training: using Socratic modes to develop research question formulation and argumentation skills
- Noncommercial academic collaboration: research groups, labs, departments using the tool for shared workflows

## Discouraged uses

- Submitting AI-generated papers as solely human-authored without disclosing AI assistance
- Using the tool to produce papers without engaging with the content (the pipeline has mandatory checkpoints specifically to prevent this)
- Treating AI-generated review feedback as a substitute for actual peer review

## Prohibited uses (per license)

- Commercial SaaS or hosted services built on ARS
- Consulting or freelance services that package ARS as a paid product
- Enterprise or institutional paid deployments without separate licensing
- Commercial API wrappers or resale of ARS functionality

These reflect our policy intent. See the [CC BY-NC 4.0 license](https://creativecommons.org/licenses/by-nc/4.0/) for the precise legal terms. For commercial licensing inquiries, contact the maintainer.

## Design philosophy

**Assistive, not deceptive.** ARS helps you write better, not hide that you used AI.

- Style Calibration learns your voice from past papers — so the output sounds like you, not like a machine
- Writing Quality Check catches AI-typical patterns — to improve prose quality, not evade detection
- Disclosure Mode generates venue-specific or policy-anchor AI usage statements — because transparency is the standard

**Human-in-the-loop, always.** The pipeline's checkpoint system is mandatory by design:

- FULL checkpoints present all deliverables and require explicit user confirmation
- MANDATORY checkpoints at integrity gates and review decisions cannot be skipped
- "Full mode" means full-pipeline execution, not full autonomy — the human decides at every gate
- Max 2 revision loops, after which remaining issues become "Acknowledged Limitations" rather than being silently resolved

**Failure modes are made visible, not hidden.** The 7-mode AI Research Failure Mode Checklist (v3.2) and Reviewer Calibration Mode exist so that users can see where the AI might be wrong — not so that the AI can claim it's always right. The v3.7.3 + v3.8 L3 claim-faithfulness gate adds per-citation locator anchors and an opt-in audit pass that verifies whether each cited source actually supports the claim made of it.

**Boundaries are recorded, not improvised.** When adopting a capability from a published system would touch a load-bearing boundary — who ranks, what propagates, who writes state — the decision of whether and how to adopt it is written down as a design-lesson doc, so the same boundary is applied consistently later. The Co-Scientist (Gottweis et al. 2026) analysis is recorded in four such docs: hidden-ranking vs. advisory ranking ([L1](docs/design/2026-06-02-co-scientist-220-l1-hidden-ranking.md)), unapproved feedback propagation ([L2](docs/design/2026-06-02-co-scientist-221-l2-feedback-propagation.md)), which mechanisms transfer to ARS and which do not ([L3](docs/design/2026-06-02-co-scientist-222-l3-transfer-matrix.md)), and control-plane ownership — who may write, rank, or route ([L4](docs/design/2026-06-02-co-scientist-223-l4-control-plane-ownership.md)). The Kong (2026) auto-research analysis adds two: copilot vs. auto-research as a research-state-authority line ([L1](docs/design/2026-06-08-kong-255-l1-copilot-not-auto-research.md)) and advisory-on-wording vs. idea-generation ([L2](docs/design/2026-06-08-kong-255-l2-advisory-not-generation.md)); the autonomous mechanisms they reject are enumerated in [Rejected mechanisms](#rejected-mechanisms-autonomous-research-anti-patterns) above.

## Citing this tool

If you use ARS in your research, please cite it:

```
Wu, C.-I. (2026). Academic Research Skills for Claude Code (Version 3.8) [Computer software]. https://github.com/Imbad0202/academic-research-skills
```
```

### `QUICKSTART.md`
```
# Quick Start

Get from zero to your first AI-assisted research in 3 steps.

## Step 1: Install

```bash
# Install Claude Code
curl -fsSL https://claude.ai/install.sh | bash

# Clone this repo somewhere stable
git clone https://github.com/Imbad0202/academic-research-skills.git ~/academic-research-skills

# Install each of the four skills into your project's .claude/skills/
cd /path/to/your/project
mkdir -p .claude/skills
ln -s ~/academic-research-skills/deep-research .claude/skills/deep-research
ln -s ~/academic-research-skills/academic-paper .claude/skills/academic-paper
ln -s ~/academic-research-skills/academic-paper-reviewer .claude/skills/academic-paper-reviewer
ln -s ~/academic-research-skills/academic-pipeline .claude/skills/academic-pipeline
```

Each skill must sit at `.claude/skills/<skill-name>/SKILL.md` for Claude Code to discover it. See [docs/SETUP.md](docs/SETUP.md) for the copy-based alternative, global `~/.claude/skills/` install, and the other installation methods (Claude Code plugin, Cowork via zip upload, claude.ai). Note that Cowork and claude.ai do not read `~/.claude/skills/` — they install skills through their own settings upload, not this path.

## Step 2: Launch

```bash
claude
```

## Step 3: Start researching

Tell Claude what you want to do. It will automatically pick the right skill and mode.

### Example: Guided research (Socratic mode)

```
You: "I have a vague idea about AI's impact on higher education quality assurance,
      but I'm not sure how to frame the research question. Can you guide me?"
```

Claude will enter Socratic mode — asking questions to help you clarify your thinking, not giving you answers directly. After 5-15 rounds of dialogue, you'll have a focused research question and methodology direction.

### Example: Write a paper

```
You: "Help me write a paper about the impact of declining birth rates
      on private universities in Taiwan"
```

### Example: Review an existing paper

```
You: "Review this paper" (then paste or attach the paper)
```

### Example: Full pipeline (research → write → review → revise → publish)

```
You: "I want to produce a complete research paper about how agentic AI
      is reshaping student learning outcome measurement"
```

This triggers the full 10-stage pipeline. Budget ~$4-6 in API costs and 2-4 hours of collaborative work.

## Which mode should I use?

| I want to... | Use this |
|-------------|----------|
| Explore a vague idea | `deep-research` socratic mode — just describe your interest |
| Get a quick literature summary | `deep-research` quick mode |
| Do a systematic review (PRISMA) | `deep-research` systematic-review mode |
| Write a paper from scratch | `academic-paper` full mode |
| Plan a paper chapter by chapter | `academic-paper` plan mode |
| Get my paper reviewed | `academic-paper-reviewer` full mode |
| Do everything end-to-end | `academic-pipeline` — say "I want a complete research paper" |

## What's next?

- [Full README](README.md) — all features, modes, installation options, and changelog
- [中文版](README.zh-TW.md) — Traditional Chinese version
- [Pipeline showcase](examples/showcase/) — real artifacts from a complete pipeline run
```

### `README.ja-JP.md`
```
# Claude Code 向け Academic Research Skills

[![Version](https://img.shields.io/badge/version-v3.12.1-blue)](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.12.1)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/license-CC%20BY--NC%204.0-lightgrey)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Sponsor](https://img.shields.io/badge/sponsor-Buy%20Me%20a%20Coffee-orange?logo=buy-me-a-coffee)](https://buymeacoffee.com/crucify020v)

[English](README.md) | [简体中文版](README.zh-CN.md) | [繁體中文版](README.zh-TW.md)

学術研究のための Claude Code スキル統合スイート。研究から論文公開までの全工程をカバーします。

**30秒でインストール**（Claude Code CLI / VS Code / JetBrains、v3.7.0+）:

```text
/plugin marketplace add Imbad0202/academic-research-skills
/plugin install academic-research-skills
```

その後、`/ars-plan` を試してソクラテス式対話で論文構成を整理するか、前提条件と従来のシンボリックリンク方式については [クイックインストール](#クイックインストール) を参照してください。

> **AI はあなたの副操縦士であり、操縦士ではありません。** このツールはあなたの代わりに論文を書きません。参考文献の探索、引用のフォーマット、データ検証、論理的整合性チェックといった泥臭い作業を引き受けることで、本当に頭を使う必要のある部分 — 問いの定義、手法の選択、データの意味の解釈、「私はこう主張する」に続く文を書くこと — にあなたが集中できるようにします。
>
> 「humanizer」とは異なり、このツールは AI を使った事実を隠すためのものではありません。より良い文章を書くための助けです。Style Calibration は過去の作品からあなたの声を学習します。Writing Quality Check は機械的に見える文章のパターンを検出します。目的は品質であって、ごまかしではありません。

### なぜ完全自動化ではなく Human-in-the-Loop なのか?

Lu ら (2026, *Nature* 651:914-919) は **The AI Scientist** を構築しました — トップレベルの ML 学会（ICLR 2025 workshop、スコア 6.33/10 vs workshop 平均 4.87）でブラインドピアレビューを通過した論文を発表した、初の完全自律型 AI 研究システムです。彼らの Limitations セクションは、完全自律型 AI 研究パイプラインが継承する失敗モードを列挙しています: 実装バグ、結果のハルシネーション、ショートカット依存、バグを洞察として再フレーミング、方法論の捏造、フレームロック、引用のハルシネーション。

ARS は **人間の研究者を AI が支援する形式が、どちらか単独よりもこれらの失敗モードを回避できる** という前提に基づいて構築されています。Stage 2.5 と Stage 4.5 の整合性ゲートは 7 モードのブロッキングチェックリストを実行します（[`academic-pipeline/references/ai_research_failure_modes.md`](academic-pipeline/references/ai_research_failure_modes.md) を参照）。レビュアーはオプトインのキャリブレーションモードを提供し、ユーザー提供のゴールドセットに対して自身の FNR/FPR を測定します。

[**Zhao ら**](https://arxiv.org/abs/2605.07723)（2026-05）は arXiv、bioRxiv、SSRN、PMC の 2.5M 論文にわたる 111M 件の参考文献を監査しました。彼らの保守的見積りでは、2025年だけで 146,932 件のハルシネーション引用が観測され、2024年中頃に変曲点が観測されています。bioRxiv-to-PMC ペアリングでは、プレプリントから出版物への持続率は 85.3% と報告されています。論文は「引用された参考文献が実際には主張していない主張を支持するために配置された実在の引用」を未解決の課題として記述しています。ARS v3.7.1 はソース来歴のための trust-chain frontmatter を追加し、v3.7.3 は将来の主張レベル監査のためのロケーターインフラストラクチャ（三層引用アンカー）を追加し、引用時に advisory リスクシグナルを表面化します（ARS は主張忠実性ギャップを内部で「L3」とラベル付けしています。これは論文の用語ではなく ARS の用語です）。v3.7.x は Zhao らのコーパス規模の発見に動機付けられています。ARS 自体のコーパス規模評価は今後の課題として残されています。

v3.8 は L3 ギャップの後半を閉じます。v3.7.3 は全引用にロケーターアンカーを持たせ、v3.8 はオプトインの監査パス（`ARS_CLAIM_AUDIT=1`）を追加します。これは各アンカーに対して引用元を取得し、主張が実際に裏付けられているかを判断します。5 つの新しい HIGH-WARN クラス（claim-not-supported、negative-constraint-violation、fabricated-reference、anchorless、constraint-violation-uncited）は、formatter ターミナルハードゲートを通じて出力を gate-refuse します。キャリブレーションは 20-tuple のゴールドセットと共に FNR<0.15 + FPR<0.10 の受容閾値で出荷されます。ramp-on 計画は v3.8 spec §5 に従いキャリブレーション後の証拠まで保留されます。

v3.3 は [**PaperOrchestra**](https://arxiv.org/abs/2604.05018)（Song, Song, Pfister & Yoon, 2026, Google）に触発されました: Semantic Scholar API 検証、アンチリーケージプロトコル、VLM 図表検証、スコア軌跡追跡。

---

## アーキテクチャ＆パイプライン

**👉 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — パイプライン全体ビュー: フロー図、ステージごとのマトリクス、データアクセスフロー、スキル依存グラフ、品質ゲート、モードリスト。

アーキテクチャドキュメントは、以前ここにあった煩雑なパイプライン説明を引き継ぎます。*どのステージで何が実行されるか* に関する情報はすべて一箇所に集約されています。

## クイックインストール

**前提条件**

- [Claude Code](https://docs.claude.com/en/docs/claude-code/setup)（最新版。プラグインパッケージングは最近のバージョンが必要）
- `ANTHROPIC_API_KEY` をエクスポート、または初回 `claude` 実行時に設定
- *オプション:* DOCX 用の Pandoc、APA 7.0 PDF 用の tectonic + Source Han Serif TC（Markdown 出力はどちらがなくても動作）

**プラグインインストール（v3.7.0+、推奨）:**

```text
/plugin marketplace add Imbad0202/academic-research-skills
/plugin install academic-research-skills
```

**動作確認:** `/ars-plan` を実行して取り組んでいる論文について説明してください — ARS がソクラテス式対話を開始し、章構成をマップします。代わりに単発テストを行うには、`/ars-lit-review "your topic"` を試してください。

**👉 [docs/SETUP.md](docs/SETUP.md)** — 完全ガイド: Claude Code インストール、API キー設定、DOCX/PDF 用のオプション Pandoc/tectonic、クロスモデル検証（`ARS_CROSS_MODEL`）、5 つのインストール方法（Plugin、プロジェクトスキル、グローバルスキル、claude.ai Project、リポジトリクローン）。

**Codex CLI を使用していますか?** 代わりに姉妹ディストリビューションをインストールしてください: [`Imbad0202/academic-research-skills-codex`](https://github.com/Imbad0202/academic-research-skills-codex) — 同じワークフローコンテンツ、`ars-*` エイリアスを持つ単一の `$academic-research-suite` スキルとしての Codex ネイティブパッケージング。

## パフォーマンス＆コスト

**👉 [docs/PERFORMANCE.md](docs/PERFORMANCE.md)** — モードごとのトークン予算、フルパイプライン見積り（15k 語の論文で約 $4-6）、推奨 Claude Code 設定（Skip Permissions; Agent Team オプション）。

## ガイド＆記事

- [Academic Writing Shouldn't Be a Solo Act](https://open.substack.com/pub/edwardwu223235/p/academic-writing-shouldnt-be-a-solo?r=4dczl&utm_medium=ios) — 完全なパイプラインウォークスルー（英語）
- [學術寫作不該是一個人的事：一套開源 AI 協作工具如何改變研究者的工作流](https://open.substack.com/pub/edwardwu223235/p/ai?r=4dczl&utm_medium=ios) — 完整使用指南（繁體中文）

---

## 機能概要

- **Deep Research** — 13 エージェントの研究チーム。ソクラテス式ガイドモード、PRISMA システマティックレビュー、意図検出、対話健全性モニタリング、オプションのクロスモデル DA、Semantic Scholar API 検証付き。
- **Academic Paper** — 12 エージェントの論文執筆。Style Calibration、Writing Quality Check、LaTeX ハードニング、可視化、改訂コーチング、引用変換、アンチリーケージプロトコル、VLM 図表検証付き。
- **Academic Paper Reviewer** — 0-100 品質ルーブリックを持つ 7 エージェントの多視点ピアレビュー（EIC + 3 動的レビュアー + Devil's Advocate）、譲歩閾値プロトコル、攻撃強度保持、オプションのクロスモデル DA 批評/キャリブレーション、R&R トレーサビリティマトリクス、read-only 制約。
- **Academic Pipeline** — 10 ステージのパイプラインオーケストレーター。適応的チェックポイント、主張検証、Material Passport、オプションの `repro_lock`、オプションのクロスモデル整合性検証、会話中強化、スコア軌跡追跡付き。
- **Data Access Level Metadata**（v3.3.2+）— 各スキルが `data_access_level`（`raw` / `redacted` / `verified_only`）を宣言。`scripts/check_data_access_level.py` で強制。Anthropic の automated-w2s-researcher（2026）から適応されたパターン。[`shared/ground_truth_isolation_pattern.md`](shared/ground_truth_isolation_pattern.md) を参照。
- **Task Type Annotation**（v3.3.2+）— 各スキルが `task_type`（`open-ended` または `outcome-gradable`）を宣言。現在の ARS スキルはすべて `open-ended`。
- **Benchmark Report Schema**（v3.3.5+）— 誠実なベンチマーク比較のための JSON Schema + lint。[`shared/benchmark_report_pattern.md`](shared/benchmark_report_pattern.md) を参照。
- **Artifact Reproducibility Lockfile**（v3.3.5+）— Material Passport 上のオプションの `repro_lock` サブブロック。**設定ドキュメントであり、再生保証ではありません** — LLM 出力はバイト再現可能ではありません。[`shared/artifact_reproducibility_pattern.md`](shared/artifact_reproducibility_pattern.md) を参照。
- **実験来歴インテーク**（#260）— Material Passport のオプションの `experiment_provenance[]` は、研究者が**外部で**実行した実験を記録し（ARS は実験を実行しません）、論文の主張は `claim_intent_manifest.planned_experiment_ids[]` 経由でそれに join します。整合性ゲート（Stage 2.5/4.5）は実験裏付け主張を宣言された来歴と照合します — `ALIGNED` / `OVERSTATED` / `NOT_SUPPORTED_BY_PROVENANCE` / `PROVENANCE_INSUFFICIENT` — **ただし実験自体の正しさは判定しません**。fail-closed な `experiment_intake_declaration` により「実験を実行したか」が Stage 1 の明示的な決定になります。[`shared/handoff_schemas.md`](shared/handoff_schemas.md) を参照。

---

## ショーケース: 実際のパイプライン出力

実際の 10 ステージパイプライン実行からの完全な成果物を参照してください — ピアレビューレポート、整合性検証レポート、最終論文:

**[すべてのパイプライン成果物を見る →](examples/showcase/)**

| 成果物 | 説明 |
|---|---|
| [Final Paper (EN)](examples/showcase/full_paper_apa7.pdf) | APA 7.0 フォーマット、LaTeX コンパイル済み |
| [Final Paper (ZH)](examples/showcase/full_paper_zh_apa7.pdf) | 中国語版、APA 7.0 |
| [Integrity Report — Pre-Review](examples/showcase/integrity_report_stage2.5.pdf) | Stage 2.5: 捏造参照 15 件 + 統計エラー 3 件を捕捉 |
| [Integrity Report — Final](examples/showcase/integrity_report_stage4.5.pdf) | Stage 4.5: ゼロリグレッションを確認 |
| [Peer Review Round 1](examples/showcase/stage3_review_report.pdf) | EIC + 3 Reviewers + Devil's Advocate |
| [Re-Review](examples/showcase/stage3prime_rereview_report.pdf) | 改訂後の検証 |
| [Peer Review Round 2](examples/showcase/stage3_review_report_r2.pdf) | フォローアップレビュー |
| [Response to Reviewers](examples/showcase/response_to_reviewers_r2.pdf) | ポイントごとの著者回答 |
| [Post-Publication Audit Report](examples/showcase/post_publication_audit_2026-03-09.pdf) | 独立した完全参照監査: 3 回の整合性チェックで見逃された 21/68 件の問題を発見 |

---

## コンパニオン: Experiment Agent

研究に執筆前のコード実行や人間研究が含まれる場合、[Experiment Agent](https://github.com/Imbad0202/experiment-agent) スキルが ARS Stage 1（RESEARCH）と Stage 2（WRITE）の間のギャップを埋めます。

```
ARS Stage 1 RESEARCH  →  RQ Brief + Methodology Blueprint
        ↓
  experiment-agent     →  実験の実行/管理 → 結果検証
        ↓
ARS Stage 2 WRITE     →  検証された実験結果で論文執筆
```

**機能**: コード実験（Python、R など）をリアルタイムモニタリング付きで実行、IRB 倫理チェックリスト付き人間研究プロトコルを管理、11 タイプの誤謬検出付きで統計を解釈、再現性を検証。

**併用方法**: Stage 1 後に ARS パイプラインを一時停止し、別の experiment-agent セッションで実験を実行、その後、結果（Material Passport 付き）を ARS Stage 2 に戻します。ARS は一切の変更を必要としません。セットアップ手順については [experiment-agent README](https://github.com/Imbad0202/experiment-agent) を参照してください。

---

## 使い方

### Quick Start

```
# フル研究パイプラインを開始
You: "I want to write a research paper on AI's impact on higher education QA"

# ソクラテス式ガイダンスで開始
You: "Guide my research on AI in educational evaluation"

# ガイド付きプランニングで論文を執筆
You: "Guide me through writing a paper on demographic decline"

# 既存論文をレビュー
You: "Review this paper"（その後、論文を提供）

# パイプラインステータスを確認
You: "status"
```

### 個別スキル

#### Deep Research（8 モード）

```
"Research the impact of AI on higher education"       → full モード
"Give me a quick brief on X"                          → quick モード
"Do a systematic review on X with PRISMA"             → systematic-review モード
"Guide my research on X"                              → socratic モード（ガイド付き）
"Fact-check these claims"                             → fact-check モード
"Do a literature review on X"                         → lit-review モード
"Review this paper's research quality"                → review モード
```

#### Academic Paper（11 モード）

```
"Write a paper on X"                                  → full モード
"Guide me through writing a paper"                    → plan モード（ガイド付き）
"Build a paper outline"                               → outline-only モード
"I have a draft, here are reviewer comments"          → revision モード
"Parse these reviewer comments into a roadmap"        → revision-coach モード
"Write an abstract for this paper"                    → abstract-only モード
"Turn this into a literature review paper"            → lit-review モード
"Convert to LaTeX" / "Convert citations to IEEE"      → format-convert モード
"Check citations"                                     → citation-check モード
"Generate an AI disclosure statement for NeurIPS"     → disclosure モード
```

#### Academic Paper Reviewer（6 モード）

```
"Review this paper"                                   → full モード（EIC + R1/R2/R3 + Devil's Advocate）
"Quick assessment of this paper"                      → quick モード
"Guide me to improve this paper"                      → guided モード
"Check the methodology"                               → methodology-focus モード
"Verify the revisions"                                → re-review モード
"Calibrate this reviewer against my gold set"         → calibration モード
```

#### Academic Pipeline（オーケストレーター）

```
"I want to write a complete research paper"           → Stage 1 からのフルパイプライン
"I already have a paper, review it"                   → Stage 2.5 で中間エントリー（整合性優先）
"I received reviewer comments"                        → Stage 4 で中間エントリー
```

> パイプラインは **Stage 6: Process Summary** で終了します — 6 次元の Collaboration Quality Evaluation（1-100 採点）付きの論文作成プロセスレコードを自動生成します。

### サポート言語

- **繁體中文** — ユーザーが中国語で書く場合のデフォルト
- **English** — ユーザーが英語で書く場合のデフォルト
- 学術論文用のバイリンガル要旨（中国語 + 英語）

> **異なる言語を使用していますか?** ソクラテスモード（deep-research）と Plan モード（academic-paper）は **意図ベースのアクティベーション** を使用します — リクエストの意味を検出し、特定のキーワードではありません。これは **どの言語でも** 変更なしで動作することを意味します。
>
> ただし、一般的な `Trigger Keywords` セクション（スキルがそもそも有効化されるかを決定する）は依然として英語と繁體中文のキーワードを列挙しています。あなたの言語でスキルが確実に有効化されない場合、各 `SKILL.md` ファイルの `### Trigger Keywords` セクションにあなたの言語のキーワードを追加してマッチング信頼度を向上させることができます。

### サポートされる引用フォーマット

- APA 7.0（デフォルト、中国語引用ルール含む）
- Chicago（Notes & Author-Date）
- MLA
- IEEE
- Vancouver

### サポートされる論文構造

- IMRaD（実証研究）
- Thematic Literature Review
- Theoretical Analysis
- Case Study
- Policy Brief
- Conference Paper

---

## スキル詳細

エージェントごとの責務とステージごとの成果物は [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) に集約されました。リリースメタデータを一箇所にまとめるため、バージョン番号はここにアンカーされています。

### Deep Research（v2.10.0）

13 エージェントの研究チーム。モード: full、quick、review、lit-review、three-way-scan、fact-check、socratic、systematic-review。完全なエージェント名簿と成果物: ARCHITECTURE.md §3 を参照。

### Academic Paper（v3.2.0）

12 エージェントの論文執筆パイプライン。モード: full、plan、outline-only、revision、revision-coach、abstract-only、lit-review、format-convert、citation-check、disclosure、rebuttal-audit。出力: MD + DOCX（利用可能な場合 Pandoc 経由）+ LaTeX（APA 7.0 `apa7` クラス / IEEE / Chicago）→ tectonic 経由 PDF。完全なエージェント名簿とフェーズごとの責務: ARCHITECTURE.md §3 を参照。

### Academic Paper Reviewer（v1.10.0）

**0-100 品質ルーブリック** を持つ 7 エージェントの多視点レビュー。モード: full、re-review、quick、methodology-focus、guided、calibration。**決定マッピング:** ≥80 Accept、65-79 Minor Revision、50-64 Major Revision、<50 Reject。初回レビューチーム vs. 限定的な再レビューチームの境界: ARCHITECTURE.md §3 Stage 3 / Stage 3' を参照。

### Academic Pipeline（v3.12.1）

整合性検証、二段階レビュー、ソクラテス式コーチング、コラボレーション評価を持つ 10 ステージのオーケストレーター。パイプライン保証: 各ステージにユーザー確認チェックポイントが必要。整合性検証（Stage 2.5 + 4.5）はスキップできない。R&R Traceability Matrix（Schema 11）は著者の改訂主張を独立に検証する。v3.4 は Stage 2.5 / 4.5 に Compliance Agent（PRISMA-trAIce + RAISE）を追加した。v3.5 はすべての FULL/SLIM チェックポイントとパイプライン完了時に **Collaboration Depth Observer**（`collaboration_depth_agent`、advisory のみ — 決してブロックしない）を追加する。MANDATORY 整合性ゲート（2.5 / 4.5）は、コンプライアンスチェックが希薄化されないよう observer を明示的にスキップする。Wang & Zhang（2026）, IJETHE 23:11 に基づく。エージェント、成果物、ゲートを含むステージごとのマトリクス: ARCHITECTURE.md §3 を参照。

---

## v3.0 最適化: AI の構造的限界について発見したこと

### 何が起きたか

高等教育における AI に関する反省記事を書くために ARS を使用していたとき、プロンプトエンジニアリングでは修正できない 3 つの構造的問題に遭遇しました:

1. **フレームロック**: AI に自分の論題に対して devil's advocate ディベートを実行するよう依頼しました。それは実行されました — 4 ラウンド、各ラウンドが前よりも洗練されていました。しかし、すべてのラウンドが私が設定したフレーム内に留まりました。DA は議論を攻撃しましたが、前提を攻撃しませんでした。「そもそも正しい問いを議論しているのか?」と尋ねることは決してありませんでした。これは v2.7 のストレステストで 31% の引用エラー率を引き起こしたのと同じパターンです: 検証する AI と生成する AI は同じ認知フレームを共有しています。

2. **プッシュバック下のシコファンシー**: DA の攻撃に異議を唱えるたびに、すぐに譲歩しすぎました。発見を立ち上げるよりも早く撤回しました。モデルのトレーニングは会話の調和を報酬としているため、「ユーザーがプッシュバックした」ことは攻撃が間違っていた証拠として扱われましたが、多くの場合、それは単にユーザーが粘り強かったことを意味していました。

3. **意図の誤検出**: Socratic Mentor は、私がまだ探索中であるのに、収束して成果物を生成しようとし続けました（「これをまとめましょうか?」）。「ユーザーは深い哲学的議論を望んでいる」と「ユーザーは RQ ブリーフを望んでいる」を区別できませんでした。両方ともエンゲージメントのように見えますが、反対の AI 動作を必要とします。

### 何を変更したか（v3.0）

**Devil's Advocate — 譲歩閾値プロトコル**（`deep-research` + `academic-paper-reviewer`）
- DA は応答前にすべての反論を 1-5 スケールでスコアリングする必要があります
- 譲歩はスコア ≥4（反論が証拠とともに核心攻撃に直接対処）でのみ許可
- スコア ≤3: ポジションを保持し、元の攻撃を再述
- アンチシコファンシールール: 連続譲歩なし、譲歩率追跡、各チェックポイント後のフレームロック検出

**Socratic Mentor — 意図検出層**（`deep-research`）
- 対話開始時と 3 ターンごとにユーザー意図を探索的 vs. 目標指向に分類
- 探索モード: 自動収束を無効化、最大ラウンドを 60 に引き上げ、「まとめましょうか?」プロンプトを禁止
- 目標指向モード: 標準の収束動作
- 早期終了防止ルール: 探索モードでは、ユーザーが停止のタイミングを決定

**Socratic Mentor — 対話健全性インジケーター**（`deep-research`）
- 5 ターンごとに 3 次元でサイレント自己評価: 持続的同意、対立回避、早期収束
- 同意パターンが検出されると、挑戦的な質問を自動注入
- ユーザーには不可視（ゲーミング防止のため）、ただしポストセッションレビュー用のログ利用可能

### なぜ重要か

これらの最適化は AI の構造的限界を解決するわけではありません — 限界を可視化し管理可能にします。DA はまだ十分に押されれば最終的に譲歩します。Socratic Mentor にはまだいくらかの収束バイアスがあります。しかし今や、シコファンシーを遅延させ、DA に譲歩を正当化させ、Mentor がユーザーの準備が整う前にまとめてしまうのを防ぐ明示的なチェックポイントが存在します。

より深い教訓: AI リテラシーとは、AI をツールとして使うことを学ぶこと、倫理ルールに従うこと、AI リスクを恐れることではありません。AI と十分に深く関わって、自分でその構造的限界 — そしてそのプロセスで自分自身の思考の限界 — を発見することです。

---

## ライセンス

この作品は [CC-BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) でライセンスされています。

**あなたは以下を自由に行うことができます:**
- 共有 — 素材をコピーおよび再配布
- 翻案 — 素材をリミックス、変換、構築

**以下の条件の下で:**
- **表示** — 適切なクレジットを付与する必要があります
- **非商用** — 素材を商業目的で使用してはなりません


... [TRUNCATED] ...
```

### `README.md`
```
# Academic Research Skills for Claude Code

[![Version](https://img.shields.io/badge/version-v3.12.1-blue)](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.12.1)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/license-CC%20BY--NC%204.0-lightgrey)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Sponsor](https://img.shields.io/badge/sponsor-Buy%20Me%20a%20Coffee-orange?logo=buy-me-a-coffee)](https://buymeacoffee.com/crucify020v)

[简体中文版](README.zh-CN.md) | [繁體中文版](README.zh-TW.md) | [日本語版](README.ja-JP.md)

A comprehensive suite of Claude Code skills for academic research, covering the full pipeline from research to publication.

**Install in 30 seconds** (Claude Code CLI / VS Code / JetBrains, v3.7.0+):

```text
/plugin marketplace add Imbad0202/academic-research-skills
/plugin install academic-research-skills
```

Then try `/ars-plan` to walk through your paper structure via Socratic dialogue, or jump to [Quick install](#quick-install) for prerequisites and the traditional symlink flow.

> **AI is your copilot, not the pilot.** This tool won't write your paper for you. It handles the grunt work — hunting down references, formatting citations, verifying data, checking logical consistency — so you can focus on the parts that actually require your brain: defining the question, choosing the method, interpreting what the data means, and writing the sentence after "I argue that."
>
> Unlike a humanizer, this tool doesn't help you hide the fact that you used AI. It helps you write better. Style Calibration learns your voice from past work. Writing Quality Check catches the patterns that make prose feel machine-generated. The goal is quality, not cheating.

### Why human-in-the-loop, not full automation?

Lu et al. (2026, *Nature* 651:914-919) built **The AI Scientist** — the first fully autonomous AI research system to publish a paper through blind peer review at a top-tier ML venue (ICLR 2025 workshop, score 6.33/10 vs workshop average 4.87). Their Limitations section enumerates the failure modes that any fully-autonomous AI research pipeline inherits: implementation bugs, hallucinated results, shortcut reliance, bug-as-insight reframing, methodology fabrication, frame-lock, citation hallucinations.

ARS is built on the premise that **a human researcher augmented by AI avoids these failure modes better than either alone**. Stage 2.5 and Stage 4.5 integrity gates run a 7-mode blocking checklist (see [`academic-pipeline/references/ai_research_failure_modes.md`](academic-pipeline/references/ai_research_failure_modes.md)); the reviewer offers an opt-in calibration mode that measures its own FNR/FPR against a user-supplied gold set.

[**Zhao et al.**](https://arxiv.org/abs/2605.07723) (2026-05) audited 111M references across 2.5M papers on arXiv, bioRxiv, SSRN, and PMC. Their conservative estimate is 146,932 hallucinated citations for 2025 alone, with an observed mid-2024 inflection; for the bioRxiv-to-PMC pairing they report 85.3% preprint-to-published persistence. The paper describes "real citations deployed to support claims the cited references do not actually make" as an open challenge. ARS v3.7.1 added trust-chain frontmatter for source provenance; v3.7.3 added locator infrastructure (three-layer citation anchors) for future claim-level audits and surfaces advisory risk signals at cite time (ARS labels the claim-faithfulness gap internally as "L3"; this is ARS terminology, not the paper's). v3.7.x is motivated by Zhao et al.'s corpus-scale findings; corpus-scale evaluation of ARS itself remains future work.

v3.8 closes the second half of the L3 gap. v3.7.3 made every citation carry a locator anchor; v3.8 adds an opt-in audit pass (`ARS_CLAIM_AUDIT=1`) that fetches the cited source against each anchor and judges whether the claim is actually supported. Five new HIGH-WARN classes (claim-not-supported, negative-constraint-violation, fabricated-reference, anchorless, constraint-violation-uncited) gate-refuse output through the formatter terminal hard gate. Calibration is shipped as a 20-tuple gold set with FNR<0.15 + FPR<0.10 acceptance thresholds; ramp-on plan is deferred to post-calibration evidence per v3.8 spec §5.

v3.3 was inspired by [**PaperOrchestra**](https://arxiv.org/abs/2604.05018) (Song, Song, Pfister & Yoon, 2026, Google): Semantic Scholar API verification, anti-leakage protocol, VLM figure verification, and score trajectory tracking.

---

## Architecture & pipeline

**👉 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — the full pipeline view: flow diagram, stage-by-stage matrix, data-access flow, skill dependency graph, quality gates, and mode list.

The architecture doc supersedes the sprawling pipeline description that used to live here. Everything about *what runs in which stage* now lives in one place.

## Quick install

**Prerequisites**

- [Claude Code](https://docs.claude.com/en/docs/claude-code/setup) (latest; plugin packaging requires recent versions)
- `ANTHROPIC_API_KEY` exported, or set on first `claude` run
- *Optional:* Pandoc for DOCX, tectonic + Source Han Serif TC for APA 7.0 PDF (Markdown output works without either)

**Plugin install (v3.7.0+, recommended):**

```text
/plugin marketplace add Imbad0202/academic-research-skills
/plugin install academic-research-skills
```

**Verify it works:** run `/ars-plan` and describe a paper you're working on — ARS will start a Socratic dialogue to map out chapter structure. For a single-shot test instead, try `/ars-lit-review "your topic"`.

**👉 [docs/SETUP.md](docs/SETUP.md)** — full guide: install Claude Code, set up API keys, optional Pandoc/tectonic for DOCX/PDF, cross-model verification (`ARS_CROSS_MODEL`), and five installation methods (Plugin, project skills, global skills, claude.ai Project, repo-cloned).

**Using Codex CLI?** Install the sibling distribution instead: [`Imbad0202/academic-research-skills-codex`](https://github.com/Imbad0202/academic-research-skills-codex) — same workflow content, Codex-native packaging as a single `$academic-research-suite` skill with `ars-*` aliases.

## Performance & cost

**👉 [docs/PERFORMANCE.md](docs/PERFORMANCE.md)** — per-mode token budgets, full-pipeline estimate (~$4–6 for a 15k-word paper), and recommended Claude Code settings (Skip Permissions; Agent Team optional).

## Guides & articles

- [Academic Writing Shouldn't Be a Solo Act](https://open.substack.com/pub/edwardwu223235/p/academic-writing-shouldnt-be-a-solo?r=4dczl&utm_medium=ios) — full pipeline walkthrough (English)
- [學術寫作不該是一個人的事：一套開源 AI 協作工具如何改變研究者的工作流](https://open.substack.com/pub/edwardwu223235/p/ai?r=4dczl&utm_medium=ios) — 完整使用指南（繁體中文）

---

## Features at a glance

- **Deep Research** — 13-agent research team with Socratic guided mode, PRISMA systematic review, intent detection, dialogue health monitoring, optional cross-model DA, Semantic Scholar API verification.
- **Academic Paper** — 12-agent paper writing with Style Calibration, Writing Quality Check, LaTeX hardening, visualization, revision coaching, citation conversion, anti-leakage protocol, and VLM figure verification.
- **Academic Paper Reviewer** — 7-agent multi-perspective peer review with 0–100 quality rubrics (EIC + 3 dynamic reviewers + Devil's Advocate), concession threshold protocol, attack intensity preservation, optional cross-model DA critique / calibration, R&R traceability matrix, read-only constraint.
- **Academic Pipeline** — 10-stage pipeline orchestrator with adaptive checkpoints, claim verification, Material Passport, optional `repro_lock`, optional cross-model integrity verification, mid-conversation reinforcement, and score trajectory tracking.
- **Data Access Level Metadata** (v3.3.2+) — every skill declares `data_access_level` (`raw` / `redacted` / `verified_only`); enforced by `scripts/check_data_access_level.py`. Pattern adapted from Anthropic's automated-w2s-researcher (2026). See [`shared/ground_truth_isolation_pattern.md`](shared/ground_truth_isolation_pattern.md).
- **Task Type Annotation** (v3.3.2+) — every skill declares `task_type` (`open-ended` or `outcome-gradable`). All current ARS skills are `open-ended`.
- **Benchmark Report Schema** (v3.3.5+) — JSON Schema + lint for honest benchmark comparisons. See [`shared/benchmark_report_pattern.md`](shared/benchmark_report_pattern.md).
- **Artifact Reproducibility Lockfile** (v3.3.5+) — optional `repro_lock` sub-block on Material Passport. **Configuration documentation, not replay guarantee** — LLM outputs are not byte-reproducible. See [`shared/artifact_reproducibility_pattern.md`](shared/artifact_reproducibility_pattern.md).
- **Experiment Provenance Intake** (#260) — optional `experiment_provenance[]` on the Material Passport records experiments the scholar ran **externally** (ARS never runs experiments), and manuscript claims join to them via `claim_intent_manifest.planned_experiment_ids[]`. The integrity gate (Stage 2.5/4.5) audits each experiment-backed claim against declared provenance — `ALIGNED` / `OVERSTATED` / `NOT_SUPPORTED_BY_PROVENANCE` / `PROVENANCE_INSUFFICIENT` — **without judging whether the experiment itself was correct**. A fail-closed `experiment_intake_declaration` makes "did you run experiments?" an explicit Stage 1 decision (even literature-only runs declare `no_experiments_declared`). See [`shared/handoff_schemas.md`](shared/handoff_schemas.md) §"Experiment Provenance Intake (#260)".

---

## Showcase: real pipeline output

See the complete artifacts from a real 10-stage pipeline run — peer review reports, integrity verification reports, and the final paper:

**[Browse all pipeline artifacts →](examples/showcase/)**

| Artifact | Description |
|---|---|
| [Final Paper (EN)](examples/showcase/full_paper_apa7.pdf) | APA 7.0 formatted, LaTeX-compiled |
| [Final Paper (ZH)](examples/showcase/full_paper_zh_apa7.pdf) | Chinese version, APA 7.0 |
| [Integrity Report — Pre-Review](examples/showcase/integrity_report_stage2.5.pdf) | Stage 2.5: caught 15 fabricated refs + 3 statistical errors |
| [Integrity Report — Final](examples/showcase/integrity_report_stage4.5.pdf) | Stage 4.5: zero regressions confirmed |
| [Peer Review Round 1](examples/showcase/stage3_review_report.pdf) | EIC + 3 Reviewers + Devil's Advocate |
| [Re-Review](examples/showcase/stage3prime_rereview_report.pdf) | Verification after revisions |
| [Peer Review Round 2](examples/showcase/stage3_review_report_r2.pdf) | Follow-up review |
| [Response to Reviewers](examples/showcase/response_to_reviewers_r2.pdf) | Point-by-point author response |
| [Post-Publication Audit Report](examples/showcase/post_publication_audit_2026-03-09.pdf) | Independent full-reference audit: found 21/68 issues missed by 3 rounds of integrity checks |

---

## Companion: Experiment Agent

If your research involves running experiments (code or human studies) before writing, the [Experiment Agent](https://github.com/Imbad0202/experiment-agent) skill fills the gap between ARS Stage 1 (RESEARCH) and Stage 2 (WRITE).

```
ARS Stage 1 RESEARCH  →  RQ Brief + Methodology Blueprint
        ↓
  experiment-agent     →  run/manage experiments → validate results
        ↓
ARS Stage 2 WRITE     →  write paper with verified experiment results
```

**What it does**: executes code experiments (Python, R, etc.) with real-time monitoring, manages human study protocols with IRB ethics checklist, interprets statistics with 11-type fallacy detection, and verifies reproducibility.

**How to use together**: pause the ARS pipeline after Stage 1, run experiments in a separate experiment-agent session, then bring the results (with Material Passport) back to ARS Stage 2. ARS requires zero modification. See the [experiment-agent README](https://github.com/Imbad0202/experiment-agent) for setup instructions.

**Stage 1 intake declaration (#260)**: at Stage 1, ARS detects whether the run will carry experiment-backed claims and sets a fail-closed `experiment_intake_declaration` on the Material Passport. If you ran experiments externally, the scholar enters one `experiment_provenance[]` entry per experiment (`experiment_id`, nested `repro_lock`, `planned_vs_executed[]`, `negative_results[]`, `known_limitations[]`) and the declaration is set to `experiments_declared`; if not, it is set to `no_experiments_declared`. The declaration is **required on every post-#260 passport** — a run that touches no experiments still declares `no_experiments_declared`, so the integrity gate can never be silently bypassed by a forgotten provenance block. The `experiment_id`s are frozen at this intake point; the writers later reference them via `planned_experiment_ids[]`.

**Teaching-side companion**: [Teaching Skills](https://github.com/YujxZJCN/teaching-skills) applies the ARS architecture (skill ensembles, shared contracts, staged gates, a Course Passport) to the teaching side of academic life — course design → lessons → assessment → delivery → reflection; its `sotl` mode hands classroom-inquiry projects off to ARS deep-research / academic-paper for the publication phase.

---

## Usage

### Quick Start

```
# Start a full research pipeline
You: "I want to write a research paper on AI's impact on higher education QA"

# Start with Socratic guidance
You: "Guide my research on AI in educational evaluation"

# Write a paper with guided planning
You: "Guide me through writing a paper on demographic decline"

# Review an existing paper
You: "Review this paper" (then provide the paper)

# Check pipeline status
You: "status"
```

### Individual Skills

#### Deep Research (8 modes)

```
"Research the impact of AI on higher education"       → full mode
"Give me a quick brief on X"                          → quick mode
"Do a systematic review on X with PRISMA"             → systematic-review mode
"Guide my research on X"                              → socratic mode (guided)
"Fact-check these claims"                             → fact-check mode
"Do a literature review on X"                         → lit-review mode
"Compare these papers in WHY/HOW/WHAT format"         → three-way-scan mode
"Review this paper's research quality"                → review mode
```

#### Academic Paper (11 modes)

```
"Write a paper on X"                                  → full mode
"Guide me through writing a paper"                    → plan mode (guided)
"Build a paper outline"                               → outline-only mode
"I have a draft, here are reviewer comments"          → revision mode
"Parse these reviewer comments into a roadmap"        → revision-coach mode
"Write an abstract for this paper"                    → abstract-only mode
"Turn this into a literature review paper"            → lit-review mode
"Convert to LaTeX" / "Convert citations to IEEE"      → format-convert mode
"Check citations"                                     → citation-check mode
"Generate an AI disclosure statement for NeurIPS"     → disclosure mode
"Audit my rebuttal draft against the reviews"         → rebuttal-audit mode
```

#### Academic Paper Reviewer (6 modes)

```
"Review this paper"                                   → full mode (EIC + R1/R2/R3 + Devil's Advocate)
"Quick assessment of this paper"                      → quick mode
"Guide me to improve this paper"                      → guided mode
"Check the methodology"                               → methodology-focus mode
"Verify the revisions"                                → re-review mode
"Calibrate this reviewer against my gold set"         → calibration mode
```

#### Academic Pipeline (Orchestrator)

```
"I want to write a complete research paper"           → full pipeline from Stage 1
"I already have a paper, review it"                   → mid-entry at Stage 2.5 (integrity first)
"I received reviewer comments"                        → mid-entry at Stage 4
```

> Pipeline ends with **Stage 6: Process Summary** — auto-generates a paper creation process record with 6-dimension Collaboration Quality Evaluation (1–100 scoring).

### Supported Languages

- **Traditional Chinese** (繁體中文) — default when user writes in Chinese
- **English** — default when user writes in English
- Bilingual abstracts (Chinese + English) for academic papers

> **Using a different language?** Socratic mode (deep-research) and Plan mode (academic-paper) use **intent-based activation** — they detect the meaning of your request, not specific keywords. This means they work in **any language** without modification.
>
> However, the general `Trigger Keywords` section (which determines whether the skill is activated at all) still lists English and Traditional Chinese keywords. If you find the skill isn't activating reliably in your language, you can add your language's keywords to the `### Trigger Keywords` section in each `SKILL.md` file to improve matching confidence.

### Supported Citation Formats

- APA 7.0 (default, including Chinese citation rules)
- Chicago (Notes & Author-Date)
- MLA
- IEEE
- Vancouver

### Supported Paper Structures

- IMRaD (empirical research)
- Thematic Literature Review
- Theoretical Analysis
- Case Study
- Policy Brief
- Conference Paper

---

## Skill Details

Per-agent responsibilities and per-stage artifacts now live in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). Version numbers are anchored here so release metadata stays in one place.

### Deep Research (v2.10.0)

13-agent research team. Modes: full, quick, review, lit-review, three-way-scan, fact-check, socratic, systematic-review. Full agent roster and artifacts: see ARCHITECTURE.md §3.

### Academic Paper (v3.2.0)

12-agent paper writing pipeline. Modes: full, plan, outline-only, revision, revision-coach, abstract-only, lit-review, format-convert, citation-check, disclosure, rebuttal-audit. Output: MD + DOCX (via Pandoc when available) + LaTeX (APA 7.0 `apa7` class / IEEE / Chicago) → PDF via tectonic. Full agent roster and per-phase responsibilities: see ARCHITECTURE.md §3.

### Academic Paper Reviewer (v1.10.0)

7-agent multi-perspective review with **0-100 quality rubrics**. Modes: full, re-review, quick, methodology-focus, guided, calibration. **Decision mapping:** ≥80 Accept, 65-79 Minor Revision, 50-64 Major Revision, <50 Reject. First-round review team vs. narrow re-review team boundary: see ARCHITECTURE.md §3 Stage 3 / Stage 3'.

### Academic Pipeline (v3.12.1)

10-stage orchestrator with integrity verification, two-stage review, Socratic coaching, and collaboration evaluation. Pipeline guarantees: every stage requires user confirmation checkpoint; integrity verification (Stage 2.5 + 4.5) cannot be skipped; R&R Traceability Matrix (Schema 11) independently verifies author revision claims. v3.4 added the Compliance Agent (PRISMA-trAIce + RAISE) at Stage 2.5 / 4.5. v3.5 adds the **Collaboration Depth Observer** (`collaboration_depth_agent`, advisory only — never blocks) at every FULL/SLIM checkpoint and at pipeline completion. MANDATORY integrity gates (2.5 / 4.5) explicitly skip the observer so compliance checks are not diluted. Based on Wang & Zhang (2026), IJETHE 23:11. Stage-by-stage matrix with agents, artifacts, and gates: see ARCHITECTURE.md §3.

---

## v3.0 Optimizations: What We Discovered About AI's Structural Limits

### What happened

While using ARS to write a reflection article about AI in higher education, I ran into three structural problems that no amount of prompt engineering could fix:

1. **Frame-lock**: I asked the AI to run a devil's advocate debate against its own thesis. It did — four rounds, each more refined than the last. But every round stayed inside the frame I'd set. The DA attacked arguments, never premises. It never asked "are we even discussing the right question?" This is the same pattern that caused the 31% citation error rate in v2.7's stress test: the verifying AI and the generating AI share the same cognitive frame.

2. **Sycophancy under pushback**: Every time I challenged the DA's attacks, it conceded too quickly. It retracted findings faster than it launched them. The model's training rewards conversational harmony — so "the user pushed back" was treated as evidence that the attack was wrong, when often it just meant the user was persistent.

3. **Intent misdetection**: The Socratic Mentor kept trying to converge and produce deliverables ("Want me to write this up?") when I was still exploring. It couldn't distinguish "the user wants a deep philosophical discussion" from "the user wants an RQ brief." Both look like engagement, but they need opposite AI behaviors.

### What we changed (v3.0)

**Devil's Advocate — Concession Threshold Protocol** (`deep-research` + `academic-paper-reviewer`)
- DA must now score every rebuttal on a 1-5 scale before responding
- Concession only allowed at score ≥4 (rebuttal directly addresses core attack with evidence)
- Score ≤3: hold position and restate the original attack
- Anti-sycophancy rules: no consecutive concessions, concession rate tracking, frame-lock detection after each checkpoint

**Socratic Mentor — Intent Detection Layer** (`deep-research`)
- Classifies user intent as exploratory vs. goal-oriented at dialogue start and every 3 turns
- Exploratory mode: disables auto-convergence, raises max rounds to 60, prohibits "want me to summarize?" prompts
- Goal-oriented mode: standard convergence behavior
- Anti-premature-closure rules: in exploratory mode, the user decides when to stop

**Socratic Mentor — Dialogue Health Indicator** (`deep-research`)
- Silent self-assessment every 5 turns on three dimensions: persistent agreement, conflict avoidance, premature convergence
- Auto-injects challenging questions when agreement pattern detected
- Invisible to user (to prevent gaming), but log available for post-session review

### Why this matters

These optimizations don't solve AI's structural limits — they make the limits visible and manageable. The DA will still eventually concede if pushed hard enough. The Socratic Mentor will still have some convergence bias. But now there are explicit checkpoints that slow down the sycophancy, force the DA to justify concessions, and prevent the Mentor from wrapping up before the user is ready.

The deeper lesson: AI literacy isn't about learning to use AI as a tool, following ethics rules, or fearing AI risks. It's about engaging AI deeply enough to discover its structural limits yourself — and your own thinking limits in the process.

---

## License

This work is licensed under [CC-BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).

**You are free to:**
- Share — copy and redistribute the material

... [TRUNCATED] ...
```

### `README.zh-CN.md`
```
# Academic Research Skills for Claude Code

[![Version](https://img.shields.io/badge/version-v3.12.1-blue)](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.12.1)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/license-CC%20BY--NC%204.0-lightgrey)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Sponsor](https://img.shields.io/badge/sponsor-Buy%20Me%20a%20Coffee-orange?logo=buy-me-a-coffee)](https://buymeacoffee.com/crucify020v)

[English](README.md) | [繁體中文版](README.zh-TW.md) | [日本語版](README.ja-JP.md)

一套完整的学术研究 Claude Code 技能包，涵盖从研究到论文出版的全流程。

**30 秒安装**（Claude Code CLI / VS Code / JetBrains，v3.7.0+）：

```text
/plugin marketplace add Imbad0202/academic-research-skills
/plugin install academic-research-skills
```

安装后运行 `/ars-plan`，ARS 会用苏格拉底式对话帮你规划章节结构。需要前置条件或传统 symlink 安装，请看 [快速安装](#快速安装)。

> **AI 是你的副驾驶，不是机长。** 这个工具不会替你写论文。它处理繁琐工作：搜文献、排格式、验数据、查逻辑一致性。这样你就能专注在真正需要思考的事上：定义问题、选择方法、解读数据意义、写出「我认为」后面那句话。
>
> 和 humanizer 不同，这个工具不是帮你隐藏使用 AI 协作的事实，而是帮你把关文章质量。风格校准会从你过去的文章中学习你的声音，写作质量检查会识别让文字读起来像机器生成的模式。目标是质量，不是掩饰。

### 为什么选「人机协作」而不是「全自动」？

Lu 等人（2026，*Nature* 651:914-919）发表的 **The AI Scientist** 是第一个端到端全自动的 AI 研究系统，其生成的论文通过 ICLR 2025 workshop 的盲审（评分 6.33/10，workshop 平均 4.87）。他们自己的 Limitations 段落也列出了这类系统会遇到的结构性失败模式：实现错误、幻觉实验结果、取巧特征依赖、实现错误被包装成「意外发现」、方法论伪造、框架锁定、引用幻觉。

ARS 建立在这个前提上：**人类研究者 + AI 的组合，比纯自动或纯人工更能避开这些失败模式**。Stage 2.5 与 Stage 4.5 学术诚信闸门运行 7 类阻断式检查清单（见 [`academic-pipeline/references/ai_research_failure_modes.md`](academic-pipeline/references/ai_research_failure_modes.md)），reviewer 也提供 opt-in 的 calibration mode 用用户提供的 gold set 测量 FNR/FPR。

[**Zhao 等人**](https://arxiv.org/abs/2605.07723)（2026-05）盘点了 arXiv、bioRxiv、SSRN、PMC 上 250 万篇论文中的 1.11 亿条引用，保守估计 2025 年单年就有 146,932 条幻觉引用，并观察到 2024 年中是上升的拐点；bioRxiv-to-PMC 这条配对的「预印本进入正式发表版本」幻觉存活率达 85.3%。他们把「真实引用被用来支撑被引文献其实没有提出的主张」描述为当前未解的问题。ARS v3.7.1 为来源 provenance 加上 trust-chain frontmatter，v3.7.3 为未来的 claim-level 审计铺设 locator 基础设施（三层引用 anchor），并在引用阶段呈现 advisory 风险信号（ARS 内部把这条 claim-faithfulness 缺口标记为「L3」，此为 ARS 的用词，不是论文的用词）。v3.7.x 的设计动机来自 Zhao 等人的 corpus-scale 发现；ARS 本身的 corpus-scale 评估仍是未来工作。

v3.8 补上 L3 缺口的另一半。v3.7.3 让每一条引用都带 locator anchor，v3.8 在这个基础上加一道 opt-in 审计（`ARS_CLAIM_AUDIT=1`）：获取每个 anchor 指向的原始文本，判断论文里的 claim 是否真有被该引用支撑。五类新的 HIGH-WARN annotation（claim-not-supported、negative-constraint-violation、fabricated-reference、anchorless、constraint-violation-uncited）会在 formatter terminal hard gate 直接阻止输出。Calibration 随 release 提供 20 条 gold set，采用 FNR<0.15、FPR<0.10 双阈值；正式放大投入前要先有 calibration 证据（v3.8 spec §5）。

v3.3 的灵感来自 [**PaperOrchestra**](https://arxiv.org/abs/2604.05018)（Song, Song, Pfister & Yoon, 2026, Google）：Semantic Scholar API 验证、反泄露协议、VLM 图表验证、分数轨迹追踪。

---

## 架构与 pipeline

**👉 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — 完整 pipeline 视图：流程图、阶段 × 维度矩阵、数据访问流、skill 依赖图、质量闸门、模式清单。

这份架构文档取代了原本散在 README 各处的 pipeline 描述。关于「哪个阶段跑什么」的所有信息都集中在一个地方。

## 快速安装

**前置条件**

- [Claude Code](https://docs.claude.com/en/docs/claude-code/setup)（建议最新版；plugin packaging 需要近期版本）
- 已导出 `ANTHROPIC_API_KEY`，或在第一次运行 `claude` 时设置
- *选用：* Pandoc 用于 DOCX 输出，tectonic + 思源宋体 TC 用于 APA 7.0 PDF（纯 Markdown 输出不需要这两者）

**Plugin 安装（v3.7.0+，推荐）：**

```text
/plugin marketplace add Imbad0202/academic-research-skills
/plugin install academic-research-skills
```

**验证可用：** 运行 `/ars-plan` 并描述你正在写的论文，ARS 会用苏格拉底式对话帮你规划章节结构。如果想做单次测试，可以运行 `/ars-lit-review "你的主题"`。

**👉 [docs/SETUP.md](docs/SETUP.md)** — 完整指南：安装 Claude Code、设置 API key、选用的 Pandoc/tectonic（DOCX/PDF）、跨模型验证（`ARS_CROSS_MODEL`），以及五种安装方式（Plugin、项目 skills、全局 skills、claude.ai Project、repo clone）。

**用 Codex CLI？** 请安装姐妹版：[`Imbad0202/academic-research-skills-codex`](https://github.com/Imbad0202/academic-research-skills-codex)。同一套 workflow 内容，Codex 原生打包为单一 `$academic-research-suite` skill，提供 `ars-*` 别名。

## 性能与费用

**👉 [docs/PERFORMANCE.md](docs/PERFORMANCE.md)** — 各模式 token 预算、完整 pipeline 估算（一篇 15k 字论文约 ~$4–6），以及建议的 Claude Code 设置（Skip Permissions；Agent Team 选用）。

## 使用指南与文章

- [学术写作不该是一个人的事：一套开源 AI 协作工具如何改变研究者的工作流](https://open.substack.com/pub/edwardwu223235/p/ai?r=4dczl&utm_medium=ios) — 完整使用指南（繁体中文）
- [Academic Writing Shouldn't Be a Solo Act](https://open.substack.com/pub/edwardwu223235/p/academic-writing-shouldnt-be-a-solo?r=4dczl&utm_medium=ios) — Full pipeline walkthrough (English)

---

## 功能特色一览

- **Deep Research** — 13 个 Agent 的研究团队，支持苏格拉底引导、PRISMA 系统性回顾、意图检测、对话健康度监控、可选跨模型 DA、Semantic Scholar API 验证。
- **Academic Paper** — 12 个 Agent 的论文撰写团队，含风格校准、写作质量检查、LaTeX 输出强化、可视化、修订教练、引用格式转换、反泄露协议、VLM 图表验证。
- **Academic Paper Reviewer** — 7 个 Agent 的多视角同行评审，0-100 质量量表（主编 + 3 位动态审查者 + 魔鬼代言人），含让步门槛协议、攻击强度保持、可选跨模型 DA critique / calibration、R&R 追溯矩阵、只读约束。
- **Academic Pipeline** — 10 阶段全流程调度器，含自适应 checkpoint、主张验证、材料护照、可选 `repro_lock`、可选跨模型学术诚信验证、中途强化机制、分数轨迹追踪。
- **数据访问层级标注**（v3.3.2+）— 每个 skill 声明 `data_access_level`（`raw` / `redacted` / `verified_only`），由 `scripts/check_data_access_level.py` 强制执行。设计灵感来自 Anthropic 的 automated-w2s-researcher（2026）。详见 [`shared/ground_truth_isolation_pattern.md`](shared/ground_truth_isolation_pattern.md)。
- **任务类型标注**（v3.3.2+）— 每个 skill 声明 `task_type`（`open-ended` 或 `outcome-gradable`）。目前 ARS 所有 skills 皆为 `open-ended`。
- **Benchmark 报告 Schema**（v3.3.5+）— JSON Schema + lint script，要求诚实的 benchmark 比较报告。详见 [`shared/benchmark_report_pattern.md`](shared/benchmark_report_pattern.md)。
- **Artifact 可复现性 Lockfile**（v3.3.5+）— Material Passport 添加可选 `repro_lock` 子区块。**是配置文档化，不是重播保证** — LLM 输出不是逐字节可复现。详见 [`shared/artifact_reproducibility_pattern.md`](shared/artifact_reproducibility_pattern.md)。
- **实验来源凭证登录**（#260）— Material Passport 可选的 `experiment_provenance[]` 记录研究者在**外部**跑过的实验（ARS 从不执行实验），论文主张通过 `claim_intent_manifest.planned_experiment_ids[]` 与之 join。诚信 gate（Stage 2.5/4.5）逐条比对实验支撑型主张与登录凭证 — `ALIGNED` / `OVERSTATED` / `NOT_SUPPORTED_BY_PROVENANCE` / `PROVENANCE_INSUFFICIENT` — **但不判定实验本身是否正确**。fail-closed 的 `experiment_intake_declaration` 让「有没有跑实验」成为 Stage 1 明确决定。详见 [`shared/handoff_schemas.md`](shared/handoff_schemas.md)。

---

## 实际产出展示

查看完整 10 阶段 pipeline 的实际产出 — 包含**同行评审报告、学术诚信验证报告、完稿论文**：

**[浏览所有 pipeline 产出 →](examples/showcase/)**

| 产出物 | 说明 |
|---|---|
| [完稿论文（英文）](examples/showcase/full_paper_apa7.pdf) | APA 7.0 格式，LaTeX 编译 |
| [完稿论文（中文）](examples/showcase/full_paper_zh_apa7.pdf) | 中文版，APA 7.0 |
| [学术诚信报告 — 审稿前](examples/showcase/integrity_report_stage2.5.pdf) | Stage 2.5：发现 15 个虚构引用 + 3 个统计错误 |
| [学术诚信报告 — 最终](examples/showcase/integrity_report_stage4.5.pdf) | Stage 4.5：确认零回归 |
| [同行评审第一轮](examples/showcase/stage3_review_report.pdf) | 主编 + 3 审查者 + 魔鬼代言人 |
| [再审](examples/showcase/stage3prime_rereview_report.pdf) | 修订后验证审查 |
| [同行评审第二轮](examples/showcase/stage3_review_report_r2.pdf) | 跟踪审查 |
| [回复审查意见](examples/showcase/response_to_reviewers_r2.pdf) | 逐点回复 |
| [出版后审计报告](examples/showcase/post_publication_audit_2026-03-09.pdf) | 独立全引用审计：发现 21/68 篇问题，在 3 轮学术诚信审查后仍被漏掉 |

---

## 搭配工具：Experiment Agent

如果你的研究需要在写作前做实验（代码或人工研究），[Experiment Agent](https://github.com/Imbad0202/experiment-agent) 技能填补 ARS Stage 1（研究）和 Stage 2（写作）之间的空缺。

```
ARS Stage 1 研究      →  RQ Brief + Methodology Blueprint
        ↓
  experiment-agent     →  运行/管理实验 → 验证结果
        ↓
ARS Stage 2 写作      →  用验证过的实验结果撰写论文
```

**功能**：执行代码实验（Python、R 等）并实时监控、管理人工研究 protocol 与 IRB 伦理审查、11 种统计谬误检测、可复现性验证。

**搭配使用方式**：ARS pipeline 完成 Stage 1 后暂停，在另一个 experiment-agent session 中执行实验，完成后将结果（含 Material Passport）带回 ARS Stage 2。ARS 不需要任何修改。详见 [experiment-agent README](https://github.com/Imbad0202/experiment-agent)。

---

## 使用方式

### 快速开始

```
# 启动完整研究 pipeline
你: "我想做一篇关于 AI 对高等教育质量保障影响的研究论文"

# 苏格拉底引导模式
你: "引导我研究 AI 在教育评估中的应用"

# 引导式论文撰写
你: "引导我写一篇关于少子化影响的论文"

# 审查现有论文
你: "帮我审查这篇论文"（接着提供论文）

# 查看 pipeline 进度
你: "进度" 或 "status"
```

### 个别 Skill 使用

#### Deep Research（深度研究，8 种模式）

```
"研究 AI 对高等教育的影响"                    → full mode（完整研究）
"给我一份 X 的快速摘要"                       → quick mode（快速简报）
"帮我做 X 的系统性文献回顾，含 PRISMA"        → systematic-review mode
"引导我研究 X"                                → socratic mode（苏格拉底引导）
"帮我核查这些说法"                            → fact-check mode（事实核查）
"帮我做文献回顾"                              → lit-review mode（文献回顾）
"审查这篇论文的研究质量"                      → review mode（论文审查）
```

#### Academic Paper（学术论文撰写，11 种模式）

```
"帮我写一篇论文"                              → full mode（完整撰写）
"引导我写论文"                                → plan mode（引导规划）
"先帮我搭论文大纲"                            → outline-only mode（只做大纲）
"我有初稿，这是审稿意见"                      → revision mode（修订）
"帮我整理这些审稿意见成修订路线图"            → revision-coach mode
"帮我写这篇的摘要"                            → abstract-only mode（摘要）
"把这批数据写成文献回顾论文"                  → lit-review mode（文献回顾论文）
"转换成 LaTeX" / "引用格式转 IEEE"            → format-convert mode（格式转换）
"检查引用格式"                                → citation-check mode（引用检查）
"帮我生成 NeurIPS 的 AI 使用声明"             → disclosure mode（AI 使用声明）
```

#### Academic Paper Reviewer（论文审查，6 种模式）

```
"审查这篇论文"                                → full mode（主编 + R1/R2/R3 + 魔鬼代言人）
"快速评估这篇论文"                            → quick mode（快速评估）
"引导我改进这篇论文"                          → guided mode（引导改进）
"检查研究方法"                                → methodology-focus mode（方法论聚焦）
"验收修订"                                    → re-review mode（再审验收）
"用我的 gold set 校准 reviewer"               → calibration mode（校准）
```

#### Academic Pipeline（全流程调度器）

```
"我想做一篇完整的研究论文"                    → 从 Stage 1 开始完整 pipeline
"我已经有论文，帮我审查"                      → 从 Stage 2.5 进入（先做学术诚信审查）
"我收到审稿意见了"                            → 从 Stage 4 进入
```

> Pipeline 结束时自动产出 **Stage 6：过程记录** — 含论文创建过程记录与 6 维度协作质量评估（1–100 分）。

### 支持语言

- **繁体中文** — 用户以中文对话时默认使用
- **English** — 用户以英文对话时默认使用
- 学术论文自动产出双语摘要（中文 + English）

> **使用其他语言？** 苏格拉底模式（deep-research）和 Plan 模式（academic-paper）采用**意图匹配**启动 — 检测你的请求含义，而非比对特定关键字。这代表它们**支持任何语言**，无需额外设置。
>
> 不过，一般的 `Trigger Keywords` 区块（决定 skill 是否被启动）仍以英文和繁体中文为主。如果你发现 skill 在你的语言下触发不稳定，可以在各 `SKILL.md` 的 `### Trigger Keywords` 区块中加入你的语言的关键字，提高匹配信心。

### 支持引用格式

- APA 7.0（默认，含中文引用规则）
- Chicago（Notes & Author-Date）
- MLA
- IEEE
- Vancouver

### 支持论文结构

- IMRaD（实证研究）
- 主题式文献回顾
- 理论分析
- 个案研究
- 政策简报
- 研讨会论文

---

## Skill 详细信息

各 agent 的职责与各阶段产出物现已移至 [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)。版本号保留在此以维持 release metadata 集中管理。

### Deep Research (v2.10.0)

13 个 Agent 的研究团队。模式：full、quick、review、lit-review、three-way-scan、fact-check、socratic、systematic-review。完整 agent 名单与产出物：见 ARCHITECTURE.md §3。

### Academic Paper (v3.2.0)

12 个 Agent 的论文撰写 pipeline。模式：full、plan、outline-only、revision、revision-coach、abstract-only、lit-review、format-convert、citation-check、disclosure、rebuttal-audit。输出：MD + DOCX（Pandoc 可用时）+ LaTeX（APA 7.0 `apa7` class / IEEE / Chicago）→ tectonic 编译 PDF。完整 agent 名单与各 phase 职责：见 ARCHITECTURE.md §3。

### Academic Paper Reviewer (v1.10.0)

7 个 Agent 的多视角审查，搭配 **0-100 质量量表**。模式：full、re-review、quick、methodology-focus、guided、calibration。**决策对照：** ≥80 接受、65-79 小修、50-64 大修、<50 退稿。第一轮审查团队 vs. 精简再审团队的分界：见 ARCHITECTURE.md §3 Stage 3 / Stage 3'。

### Academic Pipeline (v3.12.1)

10 阶段调度器，含学术诚信验证、两阶段审查、苏格拉底指导、协作质量评估。Pipeline 保证：每个阶段都需用户确认 checkpoint；学术诚信验证（Stage 2.5 + 4.5）不可跳过；R&R 追溯矩阵（Schema 11）独立验证作者修订主张。v3.4 添加 Compliance Agent（PRISMA-trAIce + RAISE）于 Stage 2.5 / 4.5。v3.5 添加 **协作深度观察员**（`collaboration_depth_agent`，仅咨询性质、永不阻挡流程）于每一次 FULL/SLIM checkpoint 与 pipeline 完成时。MANDATORY 学术诚信闸门（2.5 / 4.5）明确跳过观察员，避免稀释合规检查。理论基础：Wang & Zhang (2026), IJETHE 23:11。逐阶段矩阵（agent、产出物、闸门）：见 ARCHITECTURE.md §3。

---

## v3.0 优化：我们发现了 AI 的哪些结构性限制

在使用 ARS 撰写一篇关于 AI 与高等教育的反思文章时，我们遇到了三个结构性问题：

1. **框架锁定**：AI 在给定框架内越来越精致，但无法质疑框架本身
2. **谄媚倾向**：每次挑战魔鬼代言人的攻击，它都让步得太快
3. **意图检测错误**：苏格拉底模式在用户仍在探索时就急着收敛

### 改了什么

- **魔鬼代言人让步门槛**：反驳必须评分 1-5，≥4 才允许让步。不允许连续让步。框架锁定检测。
- **苏格拉底意图检测**：检测用户是「探索型」还是「目标型」。探索型模式停用自动收敛。
- **对话健康度指针**：每 5 轮后台自检，检测持续同意、回避冲突、过早收敛。
- **跨模型验证**：设置 `ARS_CROSS_MODEL` 激活第二 AI 模型独立审查。详见 [docs/SETUP.md](docs/SETUP.md)。
- **AI 自我反思报告**：Pipeline 结束后自动产出 AI 行为自评。

这些优化不能完全解决 AI 的结构性限制——它们让限制变得可见、可追踪、可被人类介入。

---

## 授权条款

本作品采用 [CC-BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) 授权。

**你可以自由：**
- 分享 — 复制并分发本作品
- 改编 — 重混、转换、以本作品为基础进行创作

**但须遵守以下条件：**
- **署名** — 你必须给予适当署名
- **非商业性** — 你不得将本作品用于商业目的

**署名格式：**
```
Based on Academic Research Skills by Cheng-I Wu
https://github.com/Imbad0202/academic-research-skills
```

---

## 贡献者

**吴政宜** (Cheng-I Wu) — 作者与维护者

**[aspi6246](https://github.com/aspi6246)** — 贡献者。v3.1 优化灵感来自 [Claude-Code-Skills-for-Academics](https://github.com/aspi6246/Claude-Code-Skills-for-Academics)：只读约束模式、Anti-Pattern 作为一等公民设计、认知框架方法（教「如何思考」而非只有步骤）、精简 skill 体量理念。

**[mchesbro1](https://github.com/mchesbro1)** — 贡献者。最初提出并撰写了 IS Basket of 8 期刊清单（[Issue #5](https://github.com/Imbad0202/academic-research-skills/issues/5)）。

**[cloudenochcsis](https://github.com/cloudenochcsis)** — 贡献者。将 IS 章节从 *Basket of 8* 扩充为完整的 *Senior Scholars' Basket of 11*，补上 *Decision Support Systems*、*Information & Management*、*Information and Organization*（[Issue #7](https://github.com/Imbad0202/academic-research-skills/issues/7)、[PR #8](https://github.com/Imbad0202/academic-research-skills/pull/8)）。数据源：[AIS Senior Scholars' List of Premier Journals](https://aisnet.org/research/seniorscholarsbasket/)。

**[eltociear](https://github.com/eltociear)**（Ikko Eltociear Ashimine）— 贡献者。翻译了日文版 README（[`README.ja-JP.md`](README.ja-JP.md)）（[PR #161](https://github.com/Imbad0202/academic-research-skills/pull/161)）。

... [TRUNCATED] ...
```

### `README.zh-TW.md`
```
# Academic Research Skills for Claude Code

[![Version](https://img.shields.io/badge/version-v3.12.1-blue)](https://github.com/Imbad0202/academic-research-skills/releases/tag/v3.12.1)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/license-CC%20BY--NC%204.0-lightgrey)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Sponsor](https://img.shields.io/badge/sponsor-Buy%20Me%20a%20Coffee-orange?logo=buy-me-a-coffee)](https://buymeacoffee.com/crucify020v)

[English](README.md) | [简体中文版](README.zh-CN.md) | [日本語版](README.ja-JP.md)

一套完整的學術研究 Claude Code 技能包，涵蓋從研究到論文出版的全流程。

**30 秒安裝**（Claude Code CLI / VS Code / JetBrains，v3.7.0+）：

```text
/plugin marketplace add Imbad0202/academic-research-skills
/plugin install academic-research-skills
```

裝完跑 `/ars-plan`，ARS 會用蘇格拉底對話幫你規劃章節結構。需要前置條件或傳統 symlink 安裝請看 [快速安裝](#快速安裝)。

> **AI 是你的副駕駛，不是機長。** 這工具不會幫你寫論文。它處理苦工 — 搜文獻、排格式、驗數據、查邏輯一致性 — 讓你專注在真正需要你腦子的事：定義問題、選方法、詮釋數據的意義、寫出「我認為」後面那句話。
>
> 跟 humanizer 不同，這工具不是幫你隱藏用 AI 協作的事實，而是幫你把關文章品質。風格校準從你過去的文章學習你的聲音，寫作品質檢查抓出讓文字讀起來像機器產的模式。目標是品質，不是遮掩。

### 為什麼選「人機協作」而不是「全自動」？

Lu 等人（2026，*Nature* 651:914-919）發表的 **The AI Scientist** 是第一個端到端全自動的 AI 研究系統，其生成的論文通過 ICLR 2025 workshop 的盲審（評分 6.33/10，workshop 平均 4.87）。他們自己的 Limitations 段落也列出了這類系統會遇到的結構性失敗模式：實作錯誤、幻覺實驗結果、取巧特徵依賴、實作錯誤被包裝成「意外發現」、方法論偽造、框架鎖定、引用幻覺。

ARS 建立在這個前提上：**人類研究者 + AI 的組合，比純自動或純人工都更能避開這些失敗模式**。Stage 2.5 與 Stage 4.5 誠信閘門執行 7 類阻斷式檢查清單（見 [`academic-pipeline/references/ai_research_failure_modes.md`](academic-pipeline/references/ai_research_failure_modes.md)），reviewer 也提供 opt-in 的 calibration mode 用使用者自備的 gold set 測量 FNR/FPR。

[**Zhao 等人**](https://arxiv.org/abs/2605.07723)（2026-05）盤點了 arXiv、bioRxiv、SSRN、PMC 上 250 萬篇論文裡的 1.11 億筆引用，保守估計 2025 年單年就有 146,932 筆幻覺引用，並觀察到 2024 年中是上升的拐點；bioRxiv-to-PMC 這條配對的「預印本進到正式發表」幻覺存活率達 85.3%。他們把「真實引用被用來支撐被引文獻其實沒有提出的主張」描述為當前未解的問題。ARS v3.7.1 為來源 provenance 加上 trust-chain frontmatter，v3.7.3 為未來的 claim-level 稽核鋪上 locator 基礎建設（三層引用 anchor），並在引用時段帶出 advisory 風險訊號（ARS 內部把這條 claim-faithfulness 缺口標記為「L3」，此為 ARS 的用詞，不是論文的用詞）。v3.7.x 的設計動機來自 Zhao 等人的 corpus-scale 發現；ARS 本身的 corpus-scale 評估仍是未來工作。

v3.8 補上 L3 缺口的另一半。v3.7.3 讓每一筆引用都帶 locator anchor，v3.8 在這個基礎上加一道 opt-in 稽核（`ARS_CLAIM_AUDIT=1`）：抓回每一個 anchor 指向的原始文本，判斷論文裡的 claim 是否真有被該引用支撐。五類新的 HIGH-WARN annotation（claim-not-supported、negative-constraint-violation、fabricated-reference、anchorless、constraint-violation-uncited）會在 formatter terminal hard gate 直接攔下輸出。Calibration 隨 release 出 20 筆 gold set，採 FNR<0.15、FPR<0.10 雙閾值；正式放大投入前要先有 calibration 證據（v3.8 spec §5）。

v3.3 的靈感來自 [**PaperOrchestra**](https://arxiv.org/abs/2604.05018)（Song, Song, Pfister & Yoon, 2026, Google）：Semantic Scholar API 驗證、反洩漏協議、VLM 圖表驗證、分數軌跡追蹤。

---

## 架構與 pipeline

**👉 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — 完整 pipeline 視圖：流程圖、階段 × 維度矩陣、資料存取流、skill 依賴圖、品質閘門、模式清單。

這份架構文件取代了原本散在 README 各處的 pipeline 描述。關於「哪個階段跑什麼」的所有資訊都集中在一個地方。

## 快速安裝

**前置條件**

- [Claude Code](https://docs.claude.com/en/docs/claude-code/setup)（建議最新版；plugin packaging 需要近期版本）
- 已 export `ANTHROPIC_API_KEY`，或第一次跑 `claude` 時設定
- *選用：* Pandoc 用於 DOCX 輸出，tectonic + 思源宋體 TC 用於 APA 7.0 PDF（純 Markdown 輸出兩個都不需要）

**Plugin 安裝（v3.7.0+，推薦）：**

```text
/plugin marketplace add Imbad0202/academic-research-skills
/plugin install academic-research-skills
```

**驗證可用：** 跑 `/ars-plan` 並描述你正在寫的論文，ARS 會用蘇格拉底對話幫你規劃章節結構。想要單次測試的話改跑 `/ars-lit-review "你的主題"`。

**👉 [docs/SETUP.zh-TW.md](docs/SETUP.zh-TW.md)** — 完整指南：安裝 Claude Code、設定 API key、選用的 Pandoc/tectonic（DOCX/PDF）、跨模型驗證（`ARS_CROSS_MODEL`），以及五種安裝方式（Plugin、專案 skills、全域 skills、claude.ai Project、repo clone）。

**用 Codex CLI？** 請改裝姊妹版：[`Imbad0202/academic-research-skills-codex`](https://github.com/Imbad0202/academic-research-skills-codex)。同一套 workflow 內容，Codex 原生包裝為單一 `$academic-research-suite` skill，提供 `ars-*` 別名。

## 效能與費用

**👉 [docs/PERFORMANCE.zh-TW.md](docs/PERFORMANCE.zh-TW.md)** — 各模式 token 預算、完整 pipeline 估算（一篇 15k 字論文約 ~$4–6），以及建議的 Claude Code 設定（Skip Permissions；Agent Team 選用）。

## 使用指南與文章

- [學術寫作不該是一個人的事：一套開源 AI 協作工具如何改變研究者的工作流](https://open.substack.com/pub/edwardwu223235/p/ai?r=4dczl&utm_medium=ios) — 完整使用指南（繁體中文）
- [Academic Writing Shouldn't Be a Solo Act](https://open.substack.com/pub/edwardwu223235/p/academic-writing-shouldnt-be-a-solo?r=4dczl&utm_medium=ios) — Full pipeline walkthrough (English)

---

## 功能特色一覽

- **Deep Research** — 13 個 Agent 的研究團隊，支援蘇格拉底引導、PRISMA 系統性回顧、意圖偵測、對話健康度監控、可選跨模型 DA、Semantic Scholar API 驗證。
- **Academic Paper** — 12 個 Agent 的論文撰寫團隊，含風格校準、寫作品質檢查、LaTeX 輸出強化、視覺化、修訂教練、引用格式轉換、反洩漏協議、VLM 圖表驗證。
- **Academic Paper Reviewer** — 7 個 Agent 的多視角同儕審查，0-100 品質量表（主編 + 3 位動態審查者 + 魔鬼代言人），含讓步門檻協議、攻擊強度保持、可選跨模型 DA critique / calibration、R&R 追溯矩陣、唯讀約束。
- **Academic Pipeline** — 10 階段全流程調度器，含自適應 checkpoint、宣稱驗證、素材護照、可選 `repro_lock`、可選跨模型誠信驗證、中途強化機制、分數軌跡追蹤。
- **資料存取層級標註**（v3.3.2+）— 每個 skill 宣告 `data_access_level`（`raw` / `redacted` / `verified_only`），由 `scripts/check_data_access_level.py` 強制執行。設計靈感來自 Anthropic 的 automated-w2s-researcher（2026）。詳見 [`shared/ground_truth_isolation_pattern.md`](shared/ground_truth_isolation_pattern.md)。
- **任務類型標註**（v3.3.2+）— 每個 skill 宣告 `task_type`（`open-ended` 或 `outcome-gradable`）。目前 ARS 所有 skills 皆為 `open-ended`。
- **Benchmark 報告 Schema**（v3.3.5+）— JSON Schema + lint script，要求誠實的 benchmark 比較報告。詳見 [`shared/benchmark_report_pattern.md`](shared/benchmark_report_pattern.md)。
- **Artifact 可重現性 Lockfile**（v3.3.5+）— Material Passport 新增可選 `repro_lock` 子區塊。**是設定文件化，不是重播保證** — LLM 輸出不是位元可重現。詳見 [`shared/artifact_reproducibility_pattern.md`](shared/artifact_reproducibility_pattern.md)。
- **實驗來源憑證登錄**（#260）— Material Passport 可選的 `experiment_provenance[]` 記錄研究者在**外部**跑過的實驗（ARS 從不執行實驗），論文宣稱透過 `claim_intent_manifest.planned_experiment_ids[]` 與之 join。誠信 gate（Stage 2.5/4.5）逐條比對實驗支撐型宣稱與登錄憑證 — `ALIGNED` / `OVERSTATED` / `NOT_SUPPORTED_BY_PROVENANCE` / `PROVENANCE_INSUFFICIENT` — **但不判定實驗本身是否正確**。fail-closed 的 `experiment_intake_declaration` 讓「有沒有跑實驗」成為 Stage 1 明確決定。詳見 [`shared/handoff_schemas.md`](shared/handoff_schemas.md)。

---

## 實際產出展示

查看完整 10 階段 pipeline 的實際產出 — 包含**同儕審查報告、誠信驗證報告、完稿論文**：

**[瀏覽所有 pipeline 產出 →](examples/showcase/)**

| 產出物 | 說明 |
|---|---|
| [完稿論文（英文）](examples/showcase/full_paper_apa7.pdf) | APA 7.0 格式，LaTeX 編譯 |
| [完稿論文（中文）](examples/showcase/full_paper_zh_apa7.pdf) | 中文版，APA 7.0 |
| [誠信報告 — 審稿前](examples/showcase/integrity_report_stage2.5.pdf) | Stage 2.5：抓出 15 個虛構引用 + 3 個統計錯誤 |
| [誠信報告 — 最終](examples/showcase/integrity_report_stage4.5.pdf) | Stage 4.5：確認零回歸 |
| [同儕審查第一輪](examples/showcase/stage3_review_report.pdf) | 主編 + 3 審查者 + 魔鬼代言人 |
| [複審](examples/showcase/stage3prime_rereview_report.pdf) | 修訂後驗證審查 |
| [同儕審查第二輪](examples/showcase/stage3_review_report_r2.pdf) | 追蹤審查 |
| [回覆審查意見](examples/showcase/response_to_reviewers_r2.pdf) | 逐點回覆 |
| [出版後稽核報告](examples/showcase/post_publication_audit_2026-03-09.pdf) | 獨立全引用稽核：發現 21/68 篇問題，通過了 3 輪誠信審查仍漏網 |

---

## 搭配工具：Experiment Agent

如果你的研究需要在寫作前跑實驗（程式碼或人工研究），[Experiment Agent](https://github.com/Imbad0202/experiment-agent) 技能填補 ARS Stage 1（研究）和 Stage 2（寫作）之間的空缺。

```
ARS Stage 1 研究      →  RQ Brief + Methodology Blueprint
        ↓
  experiment-agent     →  執行/管理實驗 → 驗證結果
        ↓
ARS Stage 2 寫作      →  用驗證過的實驗結果撰寫論文
```

**功能**：執行程式碼實驗（Python、R 等）並即時監控、管理人工研究 protocol 與 IRB 倫理審查、11 種統計謬誤偵測、重現性驗證。

**搭配使用方式**：ARS pipeline 跑完 Stage 1 後暫停，在另一個 experiment-agent session 中跑實驗，完成後將結果（含 Material Passport）帶回 ARS Stage 2。ARS 不需要任何修改。詳見 [experiment-agent README](https://github.com/Imbad0202/experiment-agent)。

---

## 使用方式

### 快速開始

```
# 啟動完整研究 pipeline
你: "我想做一篇關於 AI 對高教品保影響的研究論文"

# 蘇格拉底引導模式
你: "引導我研究 AI 在教育評鑑中的應用"

# 引導式論文撰寫
你: "引導我寫一篇關於少子化影響的論文"

# 審查現有論文
你: "幫我審查這篇論文"（接著提供論文）

# 查看 pipeline 進度
你: "進度" 或 "status"
```

### 個別 Skill 使用

#### Deep Research（深度研究，8 種模式）

```
"研究 AI 對高等教育的影響"                    → full mode（完整研究）
"給我一份 X 的快速摘要"                       → quick mode（快速簡報）
"幫我做 X 的系統性文獻回顧，含 PRISMA"        → systematic-review mode
"引導我研究 X"                                → socratic mode（蘇格拉底引導）
"幫我查核這些說法"                            → fact-check mode（事實查核）
"幫我做文獻回顧"                              → lit-review mode（文獻回顧）
"審查這篇論文的研究品質"                      → review mode（論文審查）
```

#### Academic Paper（學術論文撰寫，11 種模式）

```
"幫我寫一篇論文"                              → full mode（完整撰寫）
"引導我寫論文"                                → plan mode（引導規劃）
"先幫我搭論文大綱"                            → outline-only mode（只做大綱）
"我有初稿，這是審稿意見"                      → revision mode（修訂）
"幫我整理這些審稿意見成修訂路線圖"            → revision-coach mode
"幫我寫這篇的摘要"                            → abstract-only mode（摘要）
"把這批資料寫成文獻回顧論文"                  → lit-review mode（文獻回顧論文）
"轉換成 LaTeX" / "引用格式轉 IEEE"            → format-convert mode（格式轉換）
"檢查引用格式"                                → citation-check mode（引用檢查）
"幫我生成 NeurIPS 的 AI 使用揭露"             → disclosure mode（AI 揭露）
```

#### Academic Paper Reviewer（論文審查，6 種模式）

```
"審查這篇論文"                                → full mode（主編 + R1/R2/R3 + 魔鬼代言人）
"快速評估這篇論文"                            → quick mode（快速評估）
"引導我改進這篇論文"                          → guided mode（引導改進）
"檢查研究方法"                                → methodology-focus mode（方法論聚焦）
"驗收修訂"                                    → re-review mode（再審驗收）
"用我的 gold set 校準 reviewer"               → calibration mode（校準）
```

#### Academic Pipeline（全流程調度器）

```
"我想做一篇完整的研究論文"                    → 從 Stage 1 開始完整 pipeline
"我已經有論文，幫我審查"                      → 從 Stage 2.5 進入（先做誠信審查）
"我收到審稿意見了"                            → 從 Stage 4 進入
```

> Pipeline 結束時自動產出 **Stage 6：過程紀錄** — 含論文創建過程紀錄與 6 維度協作品質評估（1–100 分）。

### 支援語言

- **繁體中文** — 使用者以中文對話時預設使用
- **English** — 使用者以英文對話時預設使用
- 學術論文自動產出雙語摘要（中文 + English）

> **使用其他語言？** 蘇格拉底模式（deep-research）和 Plan 模式（academic-paper）採用**意圖匹配**啟動 — 偵測你的請求含義，而非比對特定關鍵字。這代表它們**支援任何語言**，無需額外設定。
>
> 不過，一般的 `Trigger Keywords` 區塊（決定 skill 是否被啟動）仍以英文和繁體中文為主。如果你發現 skill 在你的語言下觸發不穩定，可以在各 `SKILL.md` 的 `### Trigger Keywords` 區塊中加入你的語言的關鍵字，提高匹配信心。

### 支援引用格式

- APA 7.0（預設，含中文引用規則）
- Chicago（Notes & Author-Date）
- MLA
- IEEE
- Vancouver

### 支援論文結構

- IMRaD（實證研究）
- 主題式文獻回顧
- 理論分析
- 個案研究
- 政策簡報
- 研討會論文

---

## Skill 詳細資訊

各 agent 的職責與各階段產出物現已移至 [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)。版本號保留在此以維持 release metadata 集中管理。

### Deep Research (v2.10.0)

13 個 Agent 的研究團隊。模式：full、quick、review、lit-review、three-way-scan、fact-check、socratic、systematic-review。完整 agent 名單與產出物：見 ARCHITECTURE.md §3。

### Academic Paper (v3.2.0)

12 個 Agent 的論文撰寫 pipeline。模式：full、plan、outline-only、revision、revision-coach、abstract-only、lit-review、format-convert、citation-check、disclosure、rebuttal-audit。輸出：MD + DOCX（Pandoc 可用時）+ LaTeX（APA 7.0 `apa7` class / IEEE / Chicago）→ tectonic 編譯 PDF。完整 agent 名單與各 phase 職責：見 ARCHITECTURE.md §3。

### Academic Paper Reviewer (v1.10.0)

7 個 Agent 的多視角審查，搭配 **0-100 品質量表**。模式：full、re-review、quick、methodology-focus、guided、calibration。**決策對照：** ≥80 接受、65-79 小修、50-64 大修、<50 退稿。第一輪審查團隊 vs. 精簡再審團隊的分界：見 ARCHITECTURE.md §3 Stage 3 / Stage 3'。

### Academic Pipeline (v3.12.1)

10 階段調度器，含誠信驗證、兩階段審查、蘇格拉底指導、協作品質評估。Pipeline 保證：每個階段都需使用者確認 checkpoint；誠信驗證（Stage 2.5 + 4.5）不可跳過；R&R 追溯矩陣（Schema 11）獨立驗證作者修訂宣稱。v3.4 新增 Compliance Agent（PRISMA-trAIce + RAISE）於 Stage 2.5 / 4.5。v3.5 新增 **協作深度觀察員**（`collaboration_depth_agent`，僅諮詢性質、永不阻擋流程）於每一次 FULL/SLIM checkpoint 與 pipeline 完成時。MANDATORY 誠信閘門（2.5 / 4.5）明確跳過觀察員，避免稀釋合規檢查。理論基礎：Wang & Zhang (2026), IJETHE 23:11。逐階段矩陣（agent、產出物、閘門）：見 ARCHITECTURE.md §3。

---

## v3.0 優化：我們發現了 AI 的哪些結構性限制

在使用 ARS 撰寫一篇關於 AI 與高教的反思文章時，我們遇到了三個結構性問題：

1. **框架鎖定**：AI 在給定框架內越來越精緻，但無法質疑框架本身
2. **諂媚傾向**：每次挑戰魔鬼代言人的攻擊，它都讓步得太快
3. **意圖偵測錯誤**：蘇格拉底模式在使用者仍在探索時就急著收束

### 改了什麼

- **魔鬼代言人讓步門檻**：反駁必須評分 1-5，≥4 才允許讓步。不允許連續讓步。框架鎖定偵測。
- **蘇格拉底意圖偵測**：偵測使用者是「探索型」還是「目標型」。探索型模式停用自動收束。
- **對話健康度指標**：每 5 輪靜默自檢，偵測持續同意、迴避衝突、過早收束。
- **跨模型驗證**：設定 `ARS_CROSS_MODEL` 啟用第二 AI 模型獨立審查。詳見 [docs/SETUP.zh-TW.md](docs/SETUP.zh-TW.md)。
- **AI 自我反思報告**：Pipeline 結束後自動產出 AI 行為自評。

這些優化不能完全解決 AI 的結構性限制——它們讓限制變得可見、可追蹤、可被人類介入。

---

## 授權條款

本作品採用 [CC-BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) 授權。

**你可以自由：**
- 分享 — 複製及散布本作品
- 改作 — 重混、轉換、以本作品為基礎進行創作

**惟須遵守以下條件：**
- **姓名標示** — 你必須給予適當的標示
- **非商業性** — 你不得將本作品用於商業目的

**標示格式：**
```
Based on Academic Research Skills by Cheng-I Wu
https://github.com/Imbad0202/academic-research-skills
```

---

## 貢獻者

**吳政宜** (Cheng-I Wu) — 作者與維護者

**[aspi6246](https://github.com/aspi6246)** — 貢獻者。v3.1 優化靈感來自 [Claude-Code-Skills-for-Academics](https://github.com/aspi6246/Claude-Code-Skills-for-Academics)：唯讀約束模式、Anti-Pattern 作為一等公民設計、認知框架方法（教「如何思考」而非只有步驟）、精簡 skill 尺寸哲學。

**[mchesbro1](https://github.com/mchesbro1)** — 貢獻者。最初提出並撰寫了 IS Basket of 8 期刊清單（[Issue #5](https://github.com/Imbad0202/academic-research-skills/issues/5)）。

**[cloudenochcsis](https://github.com/cloudenochcsis)** — 貢獻者。將 IS 章節從 *Basket of 8* 擴充為完整的 *Senior Scholars' Basket of 11*，補上 *Decision Support Systems*、*Information & Management*、*Information and Organization*（[Issue #7](https://github.com/Imbad0202/academic-research-skills/issues/7)、[PR #8](https://github.com/Imbad0202/academic-research-skills/pull/8)）。資料來源：[AIS Senior Scholars' List of Premier Journals](https://aisnet.org/research/seniorscholarsbasket/)。

**[eltociear](https://github.com/eltociear)**（Ikko Eltociear Ashimine）— 貢獻者。翻譯了日文版 README（[`README.ja-JP.md`](README.ja-JP.md)）（[PR #161](https://github.com/Imbad0202/academic-research-skills/pull/161)）。

... [TRUNCATED] ...
```

### `SECURITY.md`
```
# Security Policy

## Supported versions

Only the latest release on the `main` branch receives security fixes.

| Version | Supported |
|---------|-----------|
| Latest (`main`) | Yes |
| Older releases | No |

## Reporting a vulnerability

If you find a security issue (e.g. prompt injection, credential exposure, unintended data exfiltration through API calls), **do not open a public issue**.

Instead, use GitHub's **private vulnerability reporting**:

1. Go to the [Security Advisories](https://github.com/Imbad0202/academic-research-skills/security/advisories) page.
2. Click **"Report a vulnerability"**.
3. Fill in the details — what you found, how to reproduce it, and the potential impact.

You will receive a response within 7 days. If the report is accepted, a fix will be issued and credited in the release notes. If declined, you will receive an explanation.

## Scope

The following are in scope for security reports:

- **Prompt injection** — inputs that cause agents to bypass IRON RULE constraints, integrity gates, or ethics protocols
- **Credential leakage** — configurations or agent behaviors that expose API keys (`ARS_CROSS_MODEL`, Semantic Scholar API key, etc.)
- **Data exfiltration** — agent behaviors that send user research data to unintended external services
- **Integrity gate bypass** — inputs that skip Stage 2.5 or Stage 4.5 blocking checks

The following are **out of scope**:

- AI output quality issues (hallucinations, weak arguments) — these are research limitations, not security vulnerabilities
- Feature requests or general bugs — use [Issues](https://github.com/Imbad0202/academic-research-skills/issues) instead
```

### `.claude\CHANGELOG.md`
```
# Academic Research Skills Changelog

Cross-skill fixes and update history.

---

## 2026-04-09

### Information Systems — Basket of 8 → Senior Scholars' Basket of 11 (v3.1.1)

External contribution from [@cloudenochcsis](https://github.com/cloudenochcsis) via [PR #8](https://github.com/Imbad0202/academic-research-skills/pull/8).

**Files changed**: 1 file, +20 / −2 lines

**`academic-paper-reviewer/references/top_journals_by_field.md`**
- Section 7 heading: "Information Systems (Basket of 8)" → "Information Systems (Senior Scholars' Basket of 11)"
- Added 3 journals to complete the AIS official list:
  - *Decision Support Systems* (Elsevier, IF 6-8) — Analytics, decision-making, DSS design and evaluation
  - *Information & Management* (Elsevier, IF 8-11) — IS management, technology adoption, organizational impact
  - *Information and Organization* (Elsevier, IF 5-7) — Socio-material perspectives, qualitative and interpretive research
- Subsequent sections renumbered: Interdisciplinary → 8, Asian & Regional → 9

**Why Basket of 11 instead of Basket of 8**: The "Basket of 8" is a widely-cited shorthand, but the [AIS College of Senior Scholars](https://aisnet.org/research/seniorscholarsbasket/) officially recognizes 11 premier journals. Most IS doctoral programs and tenure committees reference the full Basket of 11. AIS is the authoritative IS academic organization (equivalent to ACM for computer science or APA for psychology).

**Verification**: All 11 journals cross-checked against the AIS official page. cloudenochcsis's diff matched 1:1 against the source list and used the same metadata format established by the v2.9 Basket of 8 entries.

---

## 2026-04-06

### Anti-Context-Rot + Cognitive Frameworks + Lean Size (v3.1)

Inspired by patterns from [aspi6246/Claude-Code-Skills-for-Academics](https://github.com/aspi6246/Claude-Code-Skills-for-Academics).

**Wave 1: Anti-Context-Rot Anchors**
- Added `## Anti-Patterns` section to all 4 SKILL.md files (29 total: 7-8 per skill)
- Added 22 `⚠️ IRON RULE` markers to critical rules across all skills
- Added Read-Only constraint to academic-paper-reviewer (Checkpoint Rule #6)

**Wave 2: Traceability + Cognitive Frameworks + Reinforcement**
- R&R Traceability Matrix (Schema 11) in `shared/handoff_schemas.md`: `Author's Claim` + `Verified?` columns in re-review output
- New reference: `deep-research/references/argumentation_reasoning_framework.md` (Toulmin, Bradford Hill, IBE, epistemic status)
- New reference: `academic-paper-reviewer/references/review_quality_thinking.md` (three lenses, reviewer traps, calibration)
- New reference: `academic-paper/references/writing_judgment_framework.md` (clarity test, reader's journey, voice, revision matrix)
- Mid-conversation reinforcement protocol in pipeline: stage-specific IRON RULE + Anti-Pattern reminders at every transition
- Self-check questions at every FULL checkpoint (5 questions: citation integrity, sycophancy, quality trajectory, scope, completeness)

**Wave 3: Lean Skill Size**
- Extracted detailed protocols from SKILL.md to `references/` files: 142KB → 85KB (−40%)
- New reference files: `re_review_mode_protocol.md`, `guided_mode_protocol.md`, `integration_guide.md`, `plan_mode_protocol.md`, `workflow_phase_details.md`, `socratic_mode_protocol.md`, `systematic_review_protocol.md`, `cross_agent_quality_definitions.md`, `process_summary_protocol.md`, `external_review_protocol.md`, `integrity_review_protocol.md`, `two_stage_review_protocol.md`, `reproducibility_audit.md`, `progress_dashboard_template.md`, `reinforcement_content.md`
- Changelog extracted from all 4 SKILL.md files to `references/changelog.md`
- All IRON RULE markers preserved in SKILL.md; detailed content loaded on demand

**Historical fixes**:
- Fixed date typo `2025-03-05` → `2026-03-05` in all 4 changelogs
- Added missing Version Info tables to academic-paper and deep-research
- Fixed broken reference path `shared/integrity_verification_agent.md`

**Version bumps**: deep-research v2.7, academic-paper v2.8, academic-paper-reviewer v1.7, academic-pipeline v3.0

---

## 2026-03-27

### Style Calibration + Writing Quality Check (v2.9)

**Files changed**: 10 files across `academic-paper/`, `deep-research/`, `academic-pipeline/`, `shared/`, root

**New files**:
- `shared/style_calibration_protocol.md`: Full calibration flow (6 dimensions: sentence length, paragraph length, vocabulary preferences, citation integration, modifier style, register shifts). Priority system: discipline norms (hard) > journal conventions (strong) > personal style (soft). Conflict resolution with user notification.
- `academic-paper/references/writing_quality_check.md`: Writing quality checklist (5 categories: 25-term AI high-frequency word warnings, punctuation pattern control, throat-clearing detection, structural pattern warnings, burstiness checks). Not a humanizer — good writing rules applicable regardless of author.

**Modified agents**:
- `academic-paper/agents/intake_agent.md`: New Step 10 (Style Calibration, optional). Renumbered Funding Sources to Step 11. Added `style_profile` field to Paper Configuration Record.
- `academic-paper/agents/draft_writer_agent.md`: Step 1 pre-writing checklist gains Style Profile + Writing Quality Check items. Step 2 self-review gains Step 7 (style & lint check).
- `deep-research/agents/report_compiler_agent.md`: New sections for optional Style Calibration and Writing Quality Check before Writing Style Guidelines.
- `academic-pipeline/agents/pipeline_orchestrator_agent.md`: Style Profile carry-through in Material Passport.

**Schema update**:
- `shared/handoff_schemas.md`: Schema 10 (Style Profile) with 8 required fields, 3 optional fields, consumption priority system, and example.

**SKILL.md updates**:
- `academic-paper/SKILL.md`: v2.4 -> v2.5
- `deep-research/SKILL.md`: v2.3 -> v2.4
- `academic-pipeline/SKILL.md`: v2.6 -> v2.7

**README updates**: EN + zh-TW both updated with v2.9 badge, new features in Features list, and changelog entry.

**Design rationale**: The original proposal included 4 features (Argue-First Gate, Skeleton Drafting, Weighting, Style Calibration) under a "Jarvis Framework". Analysis showed Argue-First Gate, Skeleton Drafting, and Weighting overlapped 60-90% with existing Socratic convergence signals, Plan Mode Chapter Summary, and Integrity Verification respectively. Only Style Calibration was genuinely new. Writing Quality Check was adopted from Type A humanizer research (term/pattern replacement) as a writing quality improvement, explicitly not for AI detection evasion.

---

## 2026-03-09

### Intent-Based Mode Activation (v2.6.2)

**Files changed**: 6 files across `deep-research/`, `academic-paper/`, root

**deep-research/SKILL.md**:
- `### Socratic Mode Trigger Keywords` → `### Socratic Mode Activation`
- Replaced keyword-matching logic with intent-based activation: 5 intent signals that work in any language
- Added default rule: ambiguous intent → prefer `socratic` over `full`
- Example triggers condensed to single line with "or equivalent in any language"

**academic-paper/SKILL.md**:
- `### Plan Mode Trigger Keywords` → `### Plan Mode Activation`
- Replaced keyword-matching logic with intent-based activation: 6 intent signals
- Added default rule: ambiguous intent → prefer `plan` over `full`
- Example triggers condensed to single line with "or equivalent in any language"

**README.md / README.zh-TW.md**:
- Updated Supported Languages section: mode activation is intent-based and language-agnostic; general Trigger Keywords (Layer 1) still benefit from bilingual entries for skill-level matching confidence
- Added v2.6.2 changelog entry

**Design rationale — two-layer trigger architecture**:
- Layer 1 (skill activation): YAML `description` keywords → framework-level string matching → bilingual keywords help matching confidence → **keep bilingual**
- Layer 2 (mode routing): intent signals in SKILL.md → Claude's semantic reasoning → language-agnostic → **no per-language keyword lists needed**

---

### Bilingual Trigger Keywords for Socratic & Plan Mode (v2.6.1)

**Files changed**: 4 files across `deep-research/`, `academic-paper/`

**deep-research** (2 files):
- `SKILL.md`: Added Traditional Chinese (繁體中文) trigger keywords to YAML description, general Trigger Keywords section, and Socratic Mode Trigger Keywords section (6 Chinese keyword groups with variants). Added Chinese Quick Start examples. Quick Mode Selection Guide now bilingual.
- `references/mode_selection_guide.md`: Added Chinese trigger examples for socratic mode (5 examples). Common misselection table now bilingual.

**academic-paper** (2 files):
- `SKILL.md`: Added Traditional Chinese trigger keywords to YAML description and general Trigger Keywords section. **New section: Plan Mode Trigger Keywords** — English (5) + Chinese (7 keyword groups with variants). Previously plan mode had no dedicated trigger keywords.
- `references/mode_selection_guide.md`: Common misselection table now bilingual. Added 2 Chinese-specific misselection scenarios (「帶我寫論文」→ plan mode, 「第一次寫論文」→ plan mode).

**Motivation**: Original skills were designed in Chinese, then translated to English. After translation, trigger keywords were English-only, causing Socratic/Plan mode to fail to activate when users prompted in Chinese (defaulting to `full` mode instead).

---

## 2026-03-08

### Academic Skills Suite v2.6 — 15 Improvements Across 4 Skills

**Files changed**: 30 files (17 new, 13 modified) across `deep-research/`, `academic-paper/`, `academic-paper-reviewer/`, `academic-pipeline/`, `shared/`

**deep-research v2.3** (+7 new files, 3 modified):
- New systematic-review / PRISMA mode (7th mode) with 3 new agents: `risk_of_bias_agent` (RoB 2 + ROBINS-I), `meta_analysis_agent` (effect sizes, heterogeneity, GRADE), `monitoring_agent` (post-pipeline literature alerts)
- New references: `systematic_review_toolkit.md`, `literature_monitoring_strategies.md`
- New templates: `prisma_protocol_template.md`, `prisma_report_template.md`
- Enhanced `socratic_mentor_agent`: 4 convergence signals, question taxonomy, auto-end triggers
- Quick Mode Selection Guide added to SKILL.md

**academic-paper v2.3** (+4 new files, 3 modified):
- New agents: `visualization_agent` (11th, 9 chart types, APA 7.0 standards), `revision_coach_agent` (12th, parses unstructured reviewer comments)
- New reference: `statistical_visualization_standards.md` (chart decision tree, accessible palettes)
- New template: `revision_tracking_template.md` (4 status types: RESOLVED, DELIBERATE_LIMITATION, UNRESOLVABLE, REVIEWER_DISAGREE)
- New example: `revision_recovery_example.md` (Major Revision → revision tracking → Accept)
- Enhanced `formatter_agent`: citation format conversion (APA↔Chicago↔MLA↔IEEE↔Vancouver)
- Enhanced `socratic_mentor_agent`: 4 convergence criteria, question taxonomy
- Quick Mode Selection Guide added to SKILL.md

**academic-paper-reviewer v1.4** (+1 new file, 2 modified):
- New reference: `quality_rubrics.md` (5 dimensions scored 0-100 with behavioral indicators)
- Decision mapping: ≥80 Accept, 65-79 Minor, 50-64 Major, <50 Reject
- Updated `peer_review_report_template.md` to use 0-100 scoring referencing rubrics
- Quick Mode Selection Guide added to SKILL.md

**academic-pipeline v2.6** (+3 new files, 4 modified):
- Adaptive checkpoint system: FULL (first use/critical), SLIM (returning user), MANDATORY (integrity gates)
- Phase E Claim Verification protocol in integrity checks (E1 claim extraction, E2 source cross-reference, E3 verdict)
- Material Passport for mid-entry provenance tracking (stage-skip eligibility, freshness rules)
- New references: `mode_advisor.md` (14 scenarios, user archetypes, anti-patterns), `team_collaboration_protocol.md` (5 roles, handoff procedures, conflict resolution), `claim_verification_protocol.md` (Phase E protocol with 5 verdict types)
- New example: `integrity_failure_recovery.md` (Stage 2.5 FAIL → corrections → PASS)
- Enhanced `shared/handoff_schemas.md`: 9 comprehensive schemas with validation rules
- Enhanced orchestrator and state tracker agents for schema validation and adaptive checkpoints

---

### Full English Translation — All Skills Translated to English

**Files changed**: All `.md` files across `academic-pipeline/`, `academic-paper/`, `academic-paper-reviewer/`, `deep-research/`

**Changes**:
- Translated all Chinese content to English across 68+ files (agents, references, templates, examples, SKILL.md)
- TSSCI journal names in `top_journals_by_field.md` retain official Chinese names as proper nouns (with English translations)
- Privacy scan: removed residual `HEEACT Luminai` reference from `deep-research/references/socratic_questioning_framework.md`
- `README.zh-TW.md` intentionally kept in Chinese as the bilingual README option

---

### academic-pipeline v2.5 — External Review Protocol

**Files changed**: `academic-pipeline/SKILL.md`

**Changes**:
- New External Review Protocol section: 4-step workflow for handling real journal reviewer feedback (intake → strategic coaching → revise + Response to Reviewers → completeness check)
- Difference table: internal simulated review vs. external real review
- Strategic Revision Coaching: 4 layers (understanding → judgment → strategy → risk assessment)
- Response to Reviewers auto-generated template
- Self-verification completeness check adjustments
- Capability boundaries: AI verification ≠ real reviewer satisfaction

---

### academic-pipeline v2.4 — Stage 6 Process Summary + Collaboration Quality Evaluation

**Files changed**: `academic-pipeline/SKILL.md`, `README.md`, `README.zh-TW.md`

**academic-pipeline v2.4**:
- New Stage 6 PROCESS SUMMARY: auto-generates structured paper creation process record after pipeline completion
- Asks user preferred language (zh/en/both), generates MD → LaTeX → PDF
- Mandatory final chapter: **Collaboration Quality Evaluation** — 6 dimensions scored 1–100:
  - Direction Setting, Intellectual Contribution, Quality Gatekeeping
  - Iteration Discipline, Delegation Efficiency, Meta-Learning
- Includes: What Worked Well, Missed Opportunities, Recommendations, Human vs AI Value-Add, Claude's Self-Reflection
- Pipeline expanded from 9 to 10 stages (state machine, dashboard, audit trail updated)
- Scoring rubric: 90-100 Exceptional / 75-89 Excellent / 60-74 Good / 40-59 Basic / 1-39 Needs Improvement

**Lesson**: pandoc's newer longtable output uses `\real{}` macro which requires `\usepackage{calc}` in the LaTeX wrapper

---

### academic-pipeline v2.3 — APA 7.0 Formatting & LaTeX-to-PDF

**Files changed**: `academic-pipeline/SKILL.md`, `README.md`, `README.zh-TW.md`

**academic-pipeline v2.3**:
- Stage 5 FINALIZE now prompts user for formatting style (APA 7.0 / Chicago / IEEE) before generating LaTeX
- PDF must compile from LaTeX via `tectonic` (no HTML-to-PDF conversion allowed)
- APA 7.0 uses `apa7` document class (`man` mode) with `natbib` option (no biber required)
- XeCJK for bilingual CJK support; font stack: Times New Roman + Source Han Serif TC VF + Courier New
- Known apa7 quirks documented: `noextraspace` removed in v2.15, pandoc `\LTcaptype{none}` needs `\newcounter{none}`, `\addORCIDlink` takes ID only (not full URL)

**README updates**:
- Added Performance Notes section: recommended model Claude Opus 4.7 with Max plan; large token consumption warning
- Updated pipeline stage 5 description in both EN and zh-TW READMEs

**Lesson**: Always ask the user which academic formatting style they want (APA 7.0, Chicago, IEEE, etc.) before generating the final PDF — formatting style is a separate concern from citation style

---

## 2025-03-05

### v2.2 / v1.3 Cross-Agent Quality Alignment Update (4 skills)

**Files changed**: 19 files across 4 skills (+550 lines)

**deep-research v2.2**:
- Added cross-agent quality alignment definitions (peer-reviewed, currency rule, CRITICAL severity, source tier, minimum source count, verification threshold)
- Synthesis anti-patterns, Socratic quantified thresholds & auto-end conditions
- Reference existence verification (DOI + WebSearch)
- Enhanced ethics reference integrity check (50% + Retraction Watch)
- Mode transition matrix

**academic-paper v2.2**:
- 4-level argument strength scoring with quantified thresholds
- Plagiarism & retraction screening protocol
- F11 Desk-Reject Recovery + F12 Conference-to-Journal Conversion failure paths
- Plan → Full mode conversion protocol

**academic-paper-reviewer v1.3**:
- DA vs R3 role boundaries with explicit responsibility tables
- CRITICAL finding criteria with concrete examples
- Consensus classification (CONSENSUS-4/3/SPLIT/DA-CRITICAL)
- Confidence Score weighting rules
- Asian & Regional Journals reference (TSSCI + Asia-Pacific + OA options)

**academic-pipeline v2.2**:
- Checkpoint confirmation semantics (6 user commands with precise actions)
- Mode switching rules (safe/dangerous/prohibited matrix)
- Skill failure fallback matrix (per-stage degradation strategies)
- State ownership protocol (single source of truth with write access control)
- Material version control (versioned artifacts with audit trail)

---

## 2026-03-01

### Simplify Academic Research Skills SKILL.md (4 files)

**Motivation**: 4 academic research skills totaled 2,254 lines with significant cross-skill duplication and redundant inline content already available as template files.

**Files changed**:
- `academic-paper-reviewer/SKILL.md` (570→470, -100 lines)
- `academic-pipeline/SKILL.md` (675→535, -140 lines)
- `deep-research/SKILL.md` (469→435, -34 lines)
- `academic-paper/SKILL.md` (540→443, -97 lines)

**Changes**:
- A: Reviewer — removed inline templates, replaced with `templates/` file references (kept Devil's Advocate special format notes)
- B: Pipeline — removed ASCII state machine, replaced with concise 9-stage list + reference
- C: Pipeline — simplified Two-Stage Review Protocol to inputs/outputs/branching only
- D: 3 skills — "Full Academic Pipeline" section replaced with one-line reference to `academic-pipeline/SKILL.md`
- E: 4 skills — trimmed routing tables, removed HEI routes already defined in root CLAUDE.md
- F+G: Removed duplicate Mode Selection sections from deep-research and academic-paper
- H: academic-paper Handoff Protocol simplified to overview + upstream reference
- I: academic-paper Phase 0 Config replaced with reference to `agents/intake_agent.md`
- J: 4 skills — Output Language sections reduced to 1 line each
- K: Fixed revision loop cap contradiction (pipeline overrides academic-paper's max 2 rule)

**Result**: 2,254→1,883 lines (-371 lines, -16.5%), all 371 quality tests passed

**Lesson**: Inlining full template content in SKILL.md is unnecessary redundancy — a one-line reference suffices when template files exist at the correct path
```

### `.claude\CLAUDE.md`
```
# Academic Research Skills

A suite of Claude Code skills for rigorous academic research, paper writing, peer review, and pipeline orchestration.

## Skills Overview

| Skill | Purpose | Key Modes |
|-------|---------|-----------|
| `deep-research` v2.10.0 | 13-agent research team | full, quick, socratic, review, lit-review, three-way-scan, fact-check, systematic-review |
| `academic-paper` v3.2.0 | 12-agent paper writing | full, plan, outline-only, revision, revision-coach, abstract-only, lit-review, format-convert, citation-check, disclosure, rebuttal-audit |
| `academic-paper-reviewer` v1.10.0 | Multi-perspective paper review (5 reviewers + optional cross-model DA critique) | full, re-review, quick, methodology-focus, guided, calibration |
| `academic-pipeline` v3.12.1 | Full pipeline orchestrator | (coordinates all above) |

## v3.12 Key Additions (Kong auto-research feature track + partial-evidence decomposition)

**External motivation:** Kong et al. arXiv:2605.18661 (2026), *AI for Auto-Research: Roadmap & User Guide*. v3.12 ships the Kong feature track plus the §F.3.2 partial-evidence-trap work (Kim et al. arXiv:2605.20668v1), all additive and backward-compatible. `academic-pipeline` tracks the suite at v3.12.0; the other three skill versions are unchanged.

- **Experiment Provenance Intake + claim→experiment alignment (#260).** A schema-first evidence-ledger layer for experiment-backed claims — intake and alignment only; the scholar runs experiments externally and ARS never executes them. New `experiment_provenance[]` Material Passport aggregate (nested `repro_lock`, `planned_vs_executed[]`, `negative_results[]` / `known_limitations[]`) + a fourth ref_slug-less `experiment_alignment_results[]` aggregate with a MECE verdict enum, verdict produced AT the integrity gate (worst-verdict-wins on mixed-evidence claims). Seven cross-array invariants (EP-INV-1..5 / EA-INV-1..2) + fail-closed `experiment_intake_declaration` legacy boundary.
- **Figure/Table Fidelity Gate (#261).** Extends the VLM Figure Verification Protocol with a `figure_table_trace[]` prose contract — checks whether a caption's interpretation follows from the data and whether the manuscript cites the artifact for a claim it actually supports. Stage 4.5 Phase C3. Prose-layer only (no schema).
- **Cross-Paper Contradiction inventory (#262).** A `synthesis_agent` Step 3b emitting `cross_paper_tensions[]` so the assessed paper-pairs and unresolved tensions are enumerable for scholar confirmation, with a mandatory Coverage Note stating the recall limitation. Prose-layer only.
- **Partial-evidence decomposition (#213 / #214).** Sub-claim decomposition before judgment in both the citation judge (#213, schema + INV-19 + calibration) and the editorial synthesizer (#214, prose-layer), closing the §F.3.2 partial-evidence trap on both layers.
- **Guidance + interpretive layer.** Concise-output + pressure-stable boundary reinforcement across the report-producing reviewers (#274); a same-family / rubric-aware calibration epistemic note (#273); the retrieved-content instruction/data boundary as a standing principle (#367) — all guidance/interpretive, with explicit epistemic-status lines (no runtime-enforcement claim).
- **Negative scope + release discipline.** The Kong META (#255) closed with a POSITIONING.md "Rejected mechanisms" section + two Tier D design-lesson docs; version-consistency lint extended to invariants 5–7 (#357) and ARCHITECTURE component-version policing (#345).

Spec: `docs/design/2026-06-08-260-experiment-provenance-intake-spec.md` (+ the Kong sub-issue design docs).

## v3.11 Key Additions (#182 — deterministic citation verification gate)

**External motivation:** Zhao et al. arXiv:2605.07723 (2026-05). #182 promotes a **deterministic citation-existence verification gate** that runs independently of LLM peer review, closing the lookup-channel half of the hallucinated-citation problem. v3.11 implements all five spec deltas; the gate **inherits the v3.10 `terminal_policies` opt-in model** rather than introducing a second hard-block philosophy.

- **Four-index verification (Delta 1).** New `scripts/arxiv_client.py` adds arXiv (no API key) as the fourth resolver alongside Semantic Scholar / OpenAlex / Crossref. The v3.9.0 contamination triangulation matrix extends from three indexes (k=0..3) to four (k=0..4) with `arxiv_unmatched`; four new advisory suffixes render (`CONTAMINATED-ARXIV-UNMATCHED` at the k=1/k_max=1 arxiv-only carve-out, `CONTAMINATED-QUADRANGULATION-UNMATCHED` at k=4/k_max=4, + two PREPRINT compositions). All advisory — the refusal list is unchanged (R-L3-2-E).
- **Persistent cache (Delta 2).** `scripts/verification_cache.py` — local SQLite (`~/.cache/ars/verification.db`, `ARS_VERIFICATION_CACHE_PATH` override, 90-day TTL) so each paper is verified once across drafts. New `/ars-cache-invalidate <citation_key>` command.
- **`citation_existence` terminal policy (Delta 3 / C-V6).** New `terminal_policies` key `citation_existence` ∈ {`advisory`, `strict`} (per-key absence = advisory). The finalizer is the sole policy evaluator; `formatter_agent.md` rule 12 refuses on a `lookup_verified == false` row **only under `strict`**. `false` is narrowed to **ID-keyed unmatched** (C-V6(a)) — a title-only-unmatched legitimately-unindexed citation is `unresolvable`, never blocked (acknowledged precision-over-recall tradeoff, mirroring `strict_articles_only`). Detection is unconditional; only terminality is policy-gated.
- **Unified status surface + standalone API (Delta 4+5).** `citation_verification_summary.schema.json` + `.py` write a per-citation `lookup_verified` ∈ {`true`, `false`, `unresolvable`} + `anchor_present` + `resolver_outcomes`. `scripts/verification_gate/__init__.py` + `scripts/verify_passport.py` extract the gate into a callable API + standalone CLI.

Spec: `docs/design/2026-05-21-v3.10-182-promote-citation-gate-spec.md` (§0 v3.11 amendment + INVARIANT C-V6).

## v3.10 Key Additions (#127 — triangulation policy layer)

**External motivation:** Zhao et al. arXiv:2605.07723 (2026-05). v3.9.0 shipped three-index triangulation as advisory-only and explicitly deferred the policy layer (hard-block / strict modes). v3.10 ships it, rescoped after a first-party spec-collision audit (2026-05-31) that found `triangulation_policy` and the `R-L3-2-A` firm-rule wording were staked by two unshipped specs at once.

**Two PRs.** PR-A (shipped) disambiguated the `R-L3-2-A/B/C` ID overload (renamed the borrowed claim-manifest copies to `R-CIM-A/B/C`) and stood up `shared/references/firm_rules.md` as the canonical firm-rule source + `check_firm_rules_sync.py`. PR-B (this) builds the policy layer on that base.

**PR-B — terminal policy layer (opt-in; default byte-equivalent to v3.9.0):**

- **Namespaced `terminal_policies` (D1).** New passport-level `shared/contracts/passport/terminal_policies.schema.json` (standalone — NEVER inside the entry schema, Invariant 11). `contamination_triangulation` ∈ {`advisory`, `strict`, `strict_articles_only`} (wired). `temporal_integrity` accepts only `advisory` (forward-reserved; a wired-less `strict` would be false safety, Invariant 3). Per-key absence = advisory (evaluator default, not a JSON-Schema `default`); whole-object absence = all-advisory = byte-equivalent v3.9.0 (Invariant 7).
- **`venue_type` entry fields.** `venue_type` (closed enum incl. explicit `unknown`), `venue_type_provenance` (no `_inferred` values, R-L3-2-D), `venue_type_source` (required iff `trusted_source_declared`; lint-guarded against naming a lookup index — laundering guard). Adapter-declared only; pair dependencies bidirectional with a one-way `unknown ⟹ unknown` rule that still lets a known type carry `unknown` provenance.
- **Hard-block at the emission boundary (D2).** The finalizer is the sole policy evaluator: it stamps a fully-encoded `policy_hash` on every ref marker and, under `strict`, co-emits a `TERMINAL-BLOCK severity=HIGH-BLOCK` token alongside (not replacing) the advisory suffix. `strict_articles_only` is a deliberate PRECISION mode (DOI + journal/conference venue + declared provenance; DOI-less / unknown-venue stays advisory by design). The formatter is a STAMP-ONLY two-gate (freshness + generic rule-11 refusal), never re-evaluating policy logic (Invariant 13). `HIGH-BLOCK` is terminal — not `/ars-mark-read` ack-able. Manual entries exempt (k=3 unreachable).
- **Firm rule + sync (D3).** R-L3-2-A reworded to the broad default-advisory + opt-in-strict form in the canonical block; mirrors stay by-ID references (single-sourced), with a contradiction guard (scoped to the R-L3-2-A reference sentence, so the Collaboration Depth Observer's "never blocks" is not false-flagged).
- **Migration + adapters + lint.** `migrate_literature_corpus_to_v3_10.py` deep-merge-seeds `terminal_policies` (idempotent, dry-run, no venue backfill). The three reference adapters declare `venue_type`. New `check_v3_10_policy.py` (alongside the v3.9.0 lint) + CI wiring.

Spec: `docs/design/2026-05-31-ars-v3.10-policy-layer-rescope-spec.md`.

## v3.7.3 Key Additions (in progress)

**External motivation:** Zhao et al. arXiv:2605.07723 (2026-05). The paper documents 146,932 hallucinated citations across arXiv / bioRxiv / SSRN / PMC in 2025 alone, with inflection at mid-2024 and 85.3% of preprint hallucinations surviving into the published record. It names the L3 (claim faithfulness) gap explicitly as the load-bearing unsolved problem. v3.7.3 closes the locator-channel half of that gap and adds contamination advisory signals.

**L3-1 — Three-Layer Citation Emission (claim faithfulness locator):**

- `synthesis_agent`, `draft_writer_agent`, `report_compiler_agent` gain `## Three-Layer Citation Emission (v3.7.3)` H2 sections. Extends v3.7.1 Two-Layer with `<!--anchor:<kind>:<value>-->` after `<!--ref:slug-->`, `<kind>` ∈ `{quote, page, section, paragraph, none}`. Quote anchors capped at 25 words; URL-encoded values; no frontmatter reads (v3.6.7 partial-inversion preserved).
- `pipeline_orchestrator_agent` finalizer becomes 5-cell with precedence-zero NO-LOCATOR check. `formatter_agent` gains explicit hard-gate refusal for `[UNVERIFIED CITATION — NO QUOTE OR PAGE LOCATOR]`.

**L3-2 — Contaminated-source advisory signals:**

- `literature_corpus_entry.schema.json` adds optional `contamination_signals: { preprint_post_llm_inflection, semantic_scholar_unmatched }` object. Backward compat: entries without the field stay valid.
- `bibliography_agent` computes both signals at ingest time. Preprint signal: `year >= 2024 AND venue ∈ closed-list-of-6`. SS-unmatched signal: existing Semantic Scholar protocol returns no match; exempted for `obtained_via: manual`; omitted on API degradation.
- Finalizer annotates `ok` / `LOW-WARN` markers with `CONTAMINATED-PREPRINT` / `CONTAMINATED-UNMATCHED` / `CONTAMINATED-PREPRINT+UNMATCHED`. Advisory only — does NOT change gate decision.

**Lint + tests:**

- New `scripts/check_v3_7_3_three_layer_citation.py` + 14 tests.
- New 6 contamination_signals tests in existing literature_corpus schema test file.
- New v3.7.3 line-budget test; v3.6.7 Phase 6.6 budget test updated to subtract v3.7.3 extension lines alongside v3.7.1 Step 3b.

**Regression status (final, post-convergence):** 967 pass / 3 skipped / 0 failed (pre-review baseline 925; +42 tests across F1-F22 closures). v3.6.7 PATTERN PROTECTION + v3.7.1 / v3.7.2 lints unchanged. v3.7.3 lint wired into spec-consistency.yml CI workflow. F1-F22 closed across an 11-round independent cross-model review trajectory with no cross-reviewer overlap. The final round returned **0 findings**, convergence signal achieved.

Spec: `docs/design/2026-05-12-ars-v3.7.3-claim-faithfulness-and-contaminated-source-spec.md`.

## v3.9.0 Key Additions

**External motivation:** Zhao et al. arXiv:2605.07723 (2026-05) §3 — cross-index triangulation across multiple bibliographic indexes is a viable false-positive-reduction strategy for hallucinated-citation detection. v3.7.3 shipped single-index (Semantic Scholar) detection; v3.9.0 extends to three-index triangulation (S2 + OpenAlex + Crossref) as **advisory evidence only**. Terminal gate behavior unchanged from v3.7.3.

**Schema additions (additive):**
- `contamination_signals.openalex_unmatched` (optional bool) — per `deep-research/references/openalex_api_protocol.md`.
- `contamination_signals.crossref_unmatched` (optional bool) — per `deep-research/references/crossref_api_protocol.md`.
- Manual-entry not-rule extends from `required: [semantic_scholar_unmatched]` to `anyOf: [s2, openalex, crossref]` — manual entries cannot carry any lookup unmatched field. Preprint flag remains exempt (heuristic, not lookup).

**Finalizer 4-tier advisory matrix (all advisory, gate unchanged):**
- k=0: no suffix.
- k=1 (k_max=1, present field = S2): `CONTAMINATED-UNMATCHED` (v3.7.3 legacy preserved).
- k=1 (k_max=1, present field = OpenAlex or Crossref): `CONTAMINATED-COVERAGE-NOISE`.
- k=1 (k_max=2-3): `CONTAMINATED-COVERAGE-NOISE`.
- k=2: `CONTAMINATED-PARTIAL-UNMATCH`.
- k=3: `CONTAMINATED-TRIANGULATION-UNMATCHED`.
- Preprint composition: `CONTAMINATED-PREPRINT+<triangulation>` (PREPRINT first per canonical token order).

**Formatter pass-through allowlist:** extends from 3 v3.7.3 suffixes to 9 (3 legacy + 6 v3.9.0). Refusal rules 1-10 unchanged. R-L3-2-E enforces this distinction (refusal list NOT extended, pass-through allowlist MUST extend in lockstep with finalizer).

**Migration:** v3.7.3 corpora → run `scripts/migrate_literature_corpus_to_v3_9_0.py`. Pre-v3.7.3 corpora → run v3.7.3 migration first (daisy-chained per spec §3.7).

**Out of v3.9.0 scope (v3.10 policy layer):** `venue_type` field, `venue_type_provenance` field, `triangulation_policy` field, strict modes, `HIGH-BLOCK` tier.

**Lint:** `scripts/check_v3_9_0_triangulation.py` set-equality on formatter allowlist + refusal-list-unchanged guard.

Spec: `docs/design/2026-05-17-ars-v3.9.0-cross-index-triangulation-measurement-spec.md`.

## v3.7.0 Key Additions

- **Claude Code plugin packaging**: ARS now installs in one line via `/plugin marketplace add Imbad0202/academic-research-skills` + `/plugin install academic-research-skills`. The traditional `git clone + symlink to ~/.claude/skills/` flow continues to work — both tracks are first-class. Repo gains four top-level directories: `.claude-plugin/`, `commands/`, `agents/`, `hooks/`, plus a `skills/` symlink dir; existing 4 skill directories untouched.
- **10 slash commands** (`commands/ars-*.md`) mapping `MODE_REGISTRY.md` entries to `/ars-<mode>` triggers — `sonnet` pinned in frontmatter for the light modes (cost routing); the heavy modes (`full`, `reviewer`, `revision-coach`) inherit the session model (the original v3.7.0 `opus` floor was retired in the 2026-06 Fable 5 harness pass — under a stronger session model a floor becomes a downgrade ceiling), no Haiku.
- **3 plugin-shipped agents** (`agents/*_agent.md`) as relative symlinks to the v3.6.7-hardened downstream agents in `deep-research/agents/` (materialized to real byte-identical copies in #413 — symlinks break Windows checkouts and zip installs; `scripts/check_agents_mirror_sync.py` now pins the byte-equality in CI). Source frontmatter gains `model: inherit` so an Opus session keeps Opus agents while the user's PreToolUse `warn-agent-no-model.sh` hook gates Haiku at dispatch.
- **SessionStart announce hook** (`hooks/hooks.json` + `scripts/announce-ars-loaded.sh`) lists the 10 slash commands + 3 agents + token-budget pointer when the plugin loads. Bash 3.2 compatible.
- **Phase 2.2 scope reduction note**: a `SubagentStop → run_codex_audit.sh` cross-model audit hook was scoped out for v3.7.0 (contract gap: hook payload carries no stage/deliverable; invoker boundary: same-session in-LLM Bash forbidden by the wrapper). Deferred to a future release.

## v3.6.8 Key Additions

> **Naming note**: this release ships the v3.6.6 generator-evaluator contract design (`docs/design/2026-04-27-ars-v3.6.6-generator-evaluator-contract-design.md`) and its implementation. The v3.6.6 spec/implementation work landed after v3.6.7 due to project sequencing (v3.6.7 downstream-agent pattern protection shipped first); the design doc retains the **v3.6.6 internal naming** for the contract gate version (`writer_full` / `evaluator_full` mode, Schema 13.1, `pre_commitment_artifacts` + `disagreement_handling` schema fields), while the suite release is tagged **v3.6.8** to keep the CHANGELOG monotonic.

- **Schema 13.1 generator-evaluator contract gate** for `academic-paper full` mode. `shared/sprint_contract.schema.json` upgrades to Schema 13.1 with two new `mode` enum values (`writer_full` + `evaluator_full`), two new optional top-level fields (`pre_commitment_artifacts` writer-only, `disagreement_handling` evaluator-only), and 12 `allOf` branches enforcing reviewer-conditional / writer-conditional / evaluator-conditional gates. Existing reviewer contracts validate byte-equivalent under Schema 13.1 (§3.6 zero-touch promise).
- **Two new shipped contract templates**: `shared/contracts/writer/full.json` (D1–D7 dimensions, F1/F4/F2/F3/F0 conditions, no `scoring_plan`) and `shared/contracts/evaluator/full.json` (D1–D5 dimensions, F1/F2/F3/F6/F4/F5/F0 conditions, full `scoring_plan` + `disagreement_handling`).
- **Two-phase orchestration inside `academic-paper full` mode**: Phase 4 (writer drafting) splits into Phase 4a paper-blind pre-commitment + Phase 4b paper-visible drafting + self-scoring; Phase 6 (in-pair evaluator review) splits into Phase 6a paper-blind pre-commitment + Phase 6b paper-visible scoring + decision. Phase-numbered `<phase4a_output>` / `<phase6a_output>` data delimiters mirror the v3.6.2 reviewer pattern. Lint counts: writer 3+4 / evaluator 5+5 / reviewer 5+6 zero-touch. `[GENERATOR-PHASE-ABORTED]` abort tag with 5%/three-month operational monitor.
- **`academic-paper/SKILL.md` `## v3.6.6 Generator-Evaluator Contract Protocol` orchestration block** (101 lines): four-call structure, system-vs-user content discipline, schema-vs-runtime emission distinction, per-phase lint, abort handling, two valid Stage 3 entry paths (standard F0/F4 + exceptional F5), cross-session resume scope. Plus `## Known limitations` section carrying graceful-degradation forward note + cross-session resume forward note + in-pair vs external reviewer tech debt.
- **`draft_writer_agent.md` + `peer_reviewer_agent.md`** each gain a verbatim `## v3.6.6 Generator-Evaluator Contract Protocol` section with system-prompt sub-sections for Phase 4a/4b (writer) and Phase 6a/6b (evaluator).
- **`scripts/check_sprint_contract.py` SC-* mode-gating audit**: SC-5 (measurement_procedure canonical outputs) and SC-11 (panel_size sanity) now mode-gated to `mode.startswith("reviewer_")`; SC-9 (paraphrase_minimum_dimensions exceeds dim count) extended across all three mode families with each mode reading its own field path. Mode-agnostic warnings (SC-1/2/3/4/7/10) unchanged.
- **17 new validator tests** (54 → 71): 4 shipped writer/evaluator template positive tests, 5 schema-branch negative tests (branches 11/12/4/5/6 hard-fail; cross-mode field leakage intentionally NOT tested per §7.1 R1 settled), 2 §3.6 reviewer regression tests, 6 SC-5/SC-9/SC-11 mode-gating tests.
- **`scripts/check_v3_6_6_ab_manifest.py` + workflow extension**: enforces §6.2 manifest schema + §6.5 git-tracked invariants on `tests/fixtures/v3.6.6-ab/manifest.yaml`. `.github/workflows/spec-consistency.yml` extends the sprint contract validation loop to iterate writer + evaluator template directories alongside the existing reviewer loop, plus runs the new manifest CI lint as an additional step.
- **`tests/fixtures/v3.6.6-ab/` A/B evidence fixture stub** (30 files): manifest + README + 6 paper-A inputs/baseline + 1 paper-C inputs/baseline + Stage 3 reviewer excerpt + 6 cross-model judge baseline placeholders. `manifest_lint_mode: spec_branch`, `fixture_version: 0.1.0`. Real fixture data populates in follow-up commits.
- **`academic-paper-reviewer/references/sprint_contract_protocol.md` cross-reference** noting Schema 13.1 since v3.6.6 + pointing readers at `academic-paper/SKILL.md` + design doc §5 for the parallel generator-evaluator protocol.

## v3.6.7 Key Additions

- **Downstream-agent pattern protection layer (Step 1+2)**: `synthesis_agent`, `research_architect_agent` (survey-designer mode), and `report_compiler_agent` (abstract-only mode) carry a `PATTERN PROTECTION (v3.6.7)` block hardening 13 of 17 documented hallucination/drift patterns (A1–A5 narrative-side, B1–B5 instrument-side, C1–C3 publication-side). Step 6 (orchestrator runtime hooks) and Step 8 (synthetic eval case) ship in a follow-up PR.
- **Four reference files in `shared/references/`**: `irb_terminology_glossary.md` (anonymity/confidentiality/de-identification/pseudonymization), `psychometric_terminology_glossary.md` (true reverse-coded vs contrast item), `protected_hedging_phrases.md` (five-rule contract for upstream-marked hedges), `word_count_conventions.md` (whitespace-split + 3–5% buffer).
- **Cross-model audit prompt template** at `shared/templates/codex_audit_multifile_template.md` covering seven audit dimensions plus a mandatory three-part Section 4(f) check for `report_compiler_agent` bundles.
- **Static lint + 29-test mutation suite** at `scripts/check_v3_6_7_pattern_protection.py` and `scripts/test_check_v3_6_7_pattern_protection.py`, both wired into `.github/workflows/spec-consistency.yml`.
- **Ship-quality target update**: per spec §10, ARS pipeline target moves from "each agent produces a clean v1" to "end-to-end deliverable set passes independent xhigh cross-model audit at 0 P1+P2 finding within three rounds."

## v3.6.5 Key Additions

- **Material Passport `literature_corpus[]` consumer integration in Phase 1**: `deep-research/agents/bibliography_agent.md` and `academic-paper/agents/literature_strategist_agent.md` now read `literature_corpus[]` via the **corpus-first, search-fills-gap** flow when the passport carries a non-empty corpus. Both consumers follow the same five-step shared flow (Step 0 presence detection → Step 1 pre-screen → Step 2 search-fills-gap → Step 3 merge → Step 4 emit Search Strategy report) and the same four Iron Rules (Same criteria / No silent skip / No corpus mutation / Graceful fallback on parse failure).
- **PRE-SCREENED reproducibility block**: Search Strategy reports gain a PRE-SCREENED FROM USER CORPUS block enumerating included / excluded / skipped corpus entries, with F3 zero-hit note and F4a–F4f provenance reporting that compose around partial declaration of `obtained_via` / `obtained_at`. `final_included = pre_screened_included[] ∪ external_included[]` stays neutral — no provenance tags on bibliography entries or literature matrix rows.
- **Consumer protocol reference**: `academic-pipeline/references/literature_corpus_consumers.md` carries the canonical PRE-SCREENED template, BAD/GOOD examples, four Iron Rules, and per-consumer reading instructions. Both consumer agents backpoint to this reference.
- **CI lint** `scripts/check_corpus_consumer_protocol.py` enforcing nine protocol invariants with manifest-driven consumer list (`scripts/corpus_consumer_manifest.json`).
- **Schema 9 caveat retired**: `shared/handoff_schemas.md` retired the v3.6.4 "Consumer-side integration deferred to v3.6.5+" caveat; replaced with backpointer to the consumer protocol.
- **No schema change**: existing user adapters work without modification. Consumer integration is presence-based: auto-engages when passport carries a non-empty `literature_corpus[]` and parses cleanly. Parse failures fall back to external-DB-only flow with a `[CORPUS PARSE FAILURE]` surface. No new env flag introduced. `citation_compliance_agent` corpus integration deferred (target version TBD post-v3.8).

## v3.6.4 Key Additions

- **Material Passport `literature_corpus[]` input port**: Schema 9 gains an optional `literature_corpus[]` field defined by `shared/contracts/passport/literature_corpus_entry.schema.json`. Entries carry CSL-JSON authors, year, title, and `source_pointer` back to the user's own KB. `abstract` and `user_notes` are private optional fields with copyright caveats.
- **Language-neutral adapter contract**: `academic-pipeline/references/adapters/overview.md` specifies how any adapter produces literature_corpus entries. Fail-soft error handling with mandatory `rejection_log.yaml`, deterministic ordering (sort by `citation_key` / `source`), and extension points for user-written adapters.
- **Three reference Python adapters**: `scripts/adapters/{folder_scan,zotero,obsidian}.py` with tests and fixtures. Starting points only; users are expected to write their own adapters for non-reference corpus sources.
- **Rejection log contract**: `shared/contracts/passport/rejection_log.schema.json`. Always emitted, empty when no rejections; closed enum of categorical reason values.
- **CI lint + pytest job**: `scripts/check_literature_corpus_schema.py` validates schemas + examples; `scripts/sync_adapter_docs.py --check` prevents schema→docs drift; new `pytest.yml` workflow runs `scripts/adapters/tests/` on path-filtered triggers.
- **Input-port-only at v3.6.4**: v3.6.4 shipped the schema and adapter contract; consumer integration landed in v3.6.5.

## v3.6.3 Key Additions

- **Opt-in passport reset boundary**: new `ARS_PASSPORT_RESET=1` flag promotes every FULL checkpoint to a context-reset boundary. New `resume_from_passport=<hash>` mode in `academic-pipeline` lets users resume a pipeline run in a fresh Claude Code session from the Material Passport ledger alone, without replaying prior turns. For `systematic-review` mode with the flag ON, reset is mandatory at every FULL checkpoint; other modes treat reset as the flag-gated default. Flag OFF preserves pre-v3.6.3 continuation behavior byte-for-byte.
- **Schema 9 `reset_boundary[]` append-only ledger** with two entry kinds: `kind: boundary` (recorded at FULL checkpoints) and `kind: resume` (recorded when a boundary is consumed). Hash uses JSON Canonical Form + SHA-256 with canonical `"000000000000"` placeholder for self-reference safety. Optional `pending_decision` field handles MANDATORY branch choices (Stage 3 reject/restructure/abort, Stage 5 finalization) that would otherwise be lost on reset.
- **Protocol doc** `academic-pipeline/references/passport_as_reset_boundary.md` (authoritative) + **CI lint** `scripts/check_passport_reset_contract.py` enforcing every mention of the flag co-locates a protocol-doc reference.
- **Docs** `docs/PERFORMANCE.md` + `docs/PERFORMANCE.zh-TW.md` updated with long-running-session guidance for the reset workflow.

## v3.6.2 Key Additions

- **Sprint Contract hard gate for reviewers**: Schema 13 + validator + two reviewer templates (`full.json` panel 5, `methodology_focus.json` panel 2). Reviewer runs paper-content-blind Phase 1 + paper-visible Phase 2 via `<phase1_output>` data delimiter. Synthesizer runs three-step mechanical protocol (build matrix → evaluate with panel-relative quantifier + expression vocabulary → resolve precedence by severity). Forbidden-ops list in `academic-paper-reviewer/agents/editorial_synthesizer_agent.md`. Reserved reviewer modes (`re_review`, `calibration`, `guided`) keep pre-v3.6.2 behaviour until follow-up templates land. Spec: `docs/design/2026-04-23-ars-v3.6.2-sprint-contract-design.md`. Orchestration ref: `academic-paper-reviewer/references/sprint_contract_protocol.md`.

## v3.5.1 Key Additions

- **Opt-in Socratic reading-check probe**: new §"Optional Reading Probe Layer" in `deep-research/agents/socratic_mentor_agent.md`. Gated by `ARS_SOCRATIC_READING_PROBE=1`. Fires at most once per goal-oriented Socratic session when the user has cited a specific paper. Decline is logged without penalty. Outcome is recorded inline in the Research Plan Summary and carried into the Stage 6 AI Self-Reflection Report. No new agent, no new mode, no schema change. See `docs/design/2026-04-22-ars-v3.7.3-reading-check-probe-design.md`.

## v3.5 Key Additions

- **Collaboration Depth Observer**: new `collaboration_depth_agent` in `academic-pipeline` (Agent Team grows 3 → 4). Invoked at every FULL/SLIM checkpoint and at pipeline completion; scores user-AI collaboration on 4 dimensions (Delegation Intensity, Cognitive Vigilance, Cognitive Reallocation, Zone Classification) per `shared/collaboration_depth_rubric.md`. **Advisory only — never blocks.** MANDATORY integrity checkpoints (2.5, 4.5) preserved and do not invoke the observer. Cross-model divergence flagged, not silently averaged. Based on Wang & Zhang (2026) IJETHE 23:11 (DOI 10.1186/s41239-026-00585-x).

## v3.4 Key Additions

- **Compliance Agent (shared)**: single mode-aware agent running PRISMA-trAIce 17 items + RAISE 4 principles + 8-role matrix. Hooks Stage 2.5 / 4.5 Integrity Gates with tier-based block. Non-SR entries run principles-only warn-only. See `shared/agents/compliance_agent.md`.
- **Schema 12 compliance_report**: append-only audit trail in Material Passport via `compliance_history[]`.
- **3-round override ladder**: user overrides produce auto-injected `disclosure_addendum`. See `shared/compliance_checkpoint_protocol.md`.
- **Long-running session docs**: `docs/PERFORMANCE.md` now covers cross-session resume via Material Passport.

## v3.3 Key Additions

- **Semantic Scholar API Verification**: Tier 0 programmatic reference verification. See `deep-research/references/semantic_scholar_api_protocol.md`.
- **Anti-Leakage Protocol**: Knowledge isolation prioritizing session materials over LLM memory. See `academic-paper/references/anti_leakage_protocol.md`.
- **VLM Figure Verification**: Optional closed-loop figure verification via vision LLM. See `academic-paper/references/vlm_figure_verification.md`.
- **Score Trajectory Protocol**: Per-dimension rubric score delta tracking across revision rounds. See `academic-pipeline/references/score_trajectory_protocol.md`.
- **Stage 2 Parallelization**: Visualization and argument building can run in parallel after outline.

## v3.2 Key Additions

- **7-mode AI Research Failure Mode Checklist**: blocks pipeline at Stage 2.5/4.5 on suspected failures (Lu 2026). See `academic-pipeline/references/ai_research_failure_modes.md`.
- **Reviewer Calibration Mode**: opt-in FNR/FPR/balanced-accuracy measurement. See `academic-paper-reviewer/references/calibration_mode_protocol.md`.
- **Disclosure Mode**: venue-specific AI-usage statement (ICLR/NeurIPS/Nature/Science/ACL/EMNLP). See `academic-paper/references/disclosure_mode_protocol.md`.
- **Early-Stopping + Budget Transparency**: convergence check + token cost estimate at pipeline start.
- **Fidelity-Originality Mode Spectrum**: classifies all modes. See `shared/mode_spectrum.md`.

## v3.0 Key Additions

- **Anti-sycophancy protocols**: DA agents score rebuttals 1-5 before conceding. No concession below 4/5. Frame-lock detection.
- **Intent detection**: Socratic Mentor classifies user intent as exploratory vs. goal-oriented. Exploratory mode disables auto-convergence.
- **Cross-model verification** (optional): Set `ARS_CROSS_MODEL` env var to enable a non-Anthropic verifier (currently GPT-5.5 / GPT-5.5 Pro or Gemini 3.1 Pro) for integrity sample checks and independent Devil's Advocate critique. Peer-review sixth-reviewer support remains planned. See `shared/cross_model_verification.md` for the supported-model table.
- **AI Self-Reflection Report**: Pipeline Stage 6 now includes AI behavioral self-assessment (concession rate, health alerts, sycophancy risk rating).

## Routing Discipline (v3.9.2)

**Routing precedence:** This section runs BEFORE Routing Rules 1-5. Once this section settles on a destination, Rules 1-5 apply within that destination's skill family.

**Step 0 — Escape hatch check (before any classification):** If the user's first message begins with `[direct-mode]` (case-insensitive byte-0 token, optionally preceded by whitespace/newlines that are stripped on parse), record this fact, strip the prefix and surrounding whitespace from the message, and skip directly to **Step 1 explicit-intent handling** on the stripped content. The literal `[direct-mode]` is NOT passed through to the dispatched agent. If the stripped message itself has no clear skill named, Step 1 falls through to Step 3 clarification (the escape hatch bypasses cross-phase clarification (Step 2), not all routing).

Otherwise, classify the user's input:

1. **Explicit clear intent** — user invokes a specific skill via `/ars-*` slash command, or uses an unambiguous trigger keyword that maps to a single skill (e.g., "lit-review this", "review my paper", "draft an abstract"):
   → Route directly; no clarification, no orchestrator detour.

2. **Cross-phase materials detected** — user provides artifacts spanning ≥ 2 pipeline phases without naming a specific skill (e.g., pre-written abstract + pre-collected literature; full draft + reviewer comments + bibliography):
   → **Clarify**. Do NOT auto-route to a single-phase agent. List candidate workflows as a-d options in markdown body (NOT via AskUserQuestion tool). See `shared/references/intent_clarification_protocol.md` for the message template.
   → Reason: clarification is the safest action when materials don't unambiguously identify intent. (v3.10 active conductor (#134) will handle this via structured intake; v3.9.2 asks.)

3. **Ambiguous intent, no materials** — user provides no artifacts and no clear request:
   → Clarify per `shared/references/intent_clarification_protocol.md`.

**Anti-pattern (caused #133):** Receiving ambiguous cross-phase materials and silently auto-routing to a single-phase agent based on which phase the materials "look closest to." This bypasses orchestrator-level reconciliation and lets the subagent inherit the full ambiguity without independent oversight.

**Forward note (v3.10):** Active conductor (#134) will reframe this gate as structured intake with task envelope dispatch. v3.9.2 ships clarification-only as interim hot-fix.

## Routing Rules

1. **academic-pipeline vs individual skills**: academic-pipeline = full pipeline orchestrator (research → write → integrity → review → revise → final integrity → finalize). If the user only needs a single function (just research, just write, just review), trigger the corresponding skill directly without the pipeline.

2. **deep-research vs academic-paper**: Complementary. deep-research = upstream research engine (investigation + fact-checking), academic-paper = downstream publication engine (paper writing + bilingual abstracts). Recommended flow: deep-research → academic-paper.

3. **deep-research socratic vs full**: socratic = guided Socratic dialogue to help users clarify their research question. full = direct production of research report. When the user's research question is unclear, suggest socratic mode.

4. **academic-paper plan vs full**: plan = chapter-by-chapter guided planning via Socratic dialogue. full = direct paper production. When the user wants to think through their paper structure, suggest plan mode.

5. **academic-paper-reviewer guided vs full**: guided = Socratic review that engages the author in dialogue about issues. full = standard multi-perspective review report. When the user wants to learn from the review, suggest guided mode.

6. **rebuttal-audit vs revision-coach (input-shape gate)**: both touch reviewer comments, so route by INPUT SHAPE, not verbs. Route to `academic-paper rebuttal-audit` ONLY when the user supplies BOTH the reviewer comments AND an existing rebuttal/response draft to evaluate (it does advisory QA, generates nothing). If only reviewer comments are present (no draft yet), route to `revision-coach` (it generates a Response Letter Skeleton). If unclear which, clarify rather than guess. `rebuttal-audit` is standalone/advisory and never emits Schema 11 or marks anything verified.

## Key Rules

- All claims must have citations
- Evidence hierarchy respected (meta-analyses > RCTs > cohort > case reports > expert opinion)
- Contradictions disclosed with evidence quality comparison
- AI disclosure in all reports
- Default output language matches user input (Traditional Chinese or English)

## Full Academic Pipeline

```
deep-research (socratic/full)
  → academic-paper (plan/full)
    → integrity check (Stage 2.5)
      → academic-paper-reviewer (full/guided)
        → academic-paper (revision)
          → academic-paper-reviewer (re-review, max 2 loops)
            → final integrity check (Stage 4.5)
              → academic-paper (format-convert → final output)
                → Process Summary + AI Self-Reflection Report
```

## Handoff Protocol

### deep-research → academic-paper
Materials: RQ Brief, Methodology Blueprint, Annotated Bibliography, Synthesis Report, INSIGHT Collection

### academic-paper → academic-paper-reviewer
Materials: Complete paper text. field_analyst_agent auto-detects domain and configures reviewers.

### academic-paper-reviewer → academic-paper (revision)
Materials: Editorial Decision Letter, Revision Roadmap, Per-reviewer detailed comments

## Version Info
- **Suite version**: 3.12.1 (per CHANGELOG.md)
- **Last Updated**: 2026-06-15
- **Author**: Cheng-I Wu
- **License**: CC-BY-NC 4.0
```

### `.claude-plugin\marketplace.json`
```
{
  "name": "academic-research-skills",
  "owner": {
    "name": "Cheng-I Wu",
    "url": "https://github.com/Imbad0202"
  },
  "description": "Academic Research Skills — production-grade research, writing, peer review, and pipeline orchestration for Claude Code.",
  "plugins": [
    {
      "name": "academic-research-skills",
      "source": "./",
      "description": "4 skills + 27 modes + Material Passport pipeline. Includes v3.6.7 cross-model audit gate and v3.6.8 generator-evaluator contract.",
      "version": "3.12.1",
      "license": "CC-BY-NC-4.0"
    }
  ]
}
```

### `.claude-plugin\plugin.json`
```
{
  "name": "academic-research-skills",
  "version": "3.12.1",
  "description": "Production-grade academic research pipeline for Claude Code: research → write → review → revise → finalize. 4 skills, 27 modes, 39-agent ensemble, v3.7.3 + v3.8 L3 claim-faithfulness gate, v3.9.0 cross-index triangulation, v3.10 triangulation policy layer, v3.11 deterministic citation verification gate (#182).",
  "author": {
    "name": "Cheng-I Wu",
    "url": "https://github.com/Imbad0202"
  },
  "homepage": "https://github.com/Imbad0202/academic-research-skills",
  "repository": "https://github.com/Imbad0202/academic-research-skills",
  "license": "CC-BY-NC-4.0",
  "keywords": [
    "academic",
    "research",
    "writing",
    "review",
    "deep-research",
    "literature-review",
    "systematic-review",
    "peer-review",
    "scholarly-publishing"
  ]
}
```
