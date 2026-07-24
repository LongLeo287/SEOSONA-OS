# Architecture Extract: unsloth

## Directory Structure
```text
unsloth/
    .git-blame-ignore-revs
    .gitattributes
    .gitignore
    .pre-commit-ci.yaml
    .pre-commit-config.yaml
    build.sh
    cli.py
    CODE_OF_CONDUCT.md
    CONTRIBUTING.md
    COPYING
    install.ps1
    install.sh
    LICENSE
    pyproject.toml
    README.md
    unsloth-cli.py
    .github/
        CODEOWNERS
        dependabot.yml
        FUNDING.yml
        ISSUE_TEMPLATE/
            bug---issue.md
            feature-request.md
        scripts/
            assert-llama-loads.sh
            hf-download-with-retry.sh
        workflows/
            consolidated-tests-ci.yml
            cross-platform-parity-ci.yml
            lint-ci.yml
            lockfile-audit.yml
            mlx-ci.yml
            notebooks-ci.yml
            release-desktop.yml
            security-audit.yml
            stale.yml
            studio-api-smoke.yml
            studio-backend-ci.yml
            studio-frontend-ci.yml
            studio-inference-smoke.yml
            studio-load-orchestrator-ci.yml
            studio-mac-api-smoke.yml
            studio-mac-inference-smoke.yml
            studio-mac-install-matrix.yml
            studio-mac-ui-smoke.yml
            studio-mac-update-smoke.yml
            studio-tauri-smoke.yml
            studio-ui-smoke.yml
            studio-update-smoke.yml
            studio-windows-api-smoke.yml
            studio-windows-inference-smoke.yml
            studio-windows-ui-smoke.yml
            studio-windows-update-smoke.yml
            version-compat-ci.yml
            wheel-smoke.yml
    images/
    scripts/
        check_frontend_dep_removal.py
        check_new_install_scripts.py
        enforce_kwargs_spacing.py
        install_gemma4_mlx.sh
        install_qwen3_6_mlx.sh
        install_rocm_wsl_strixhalo.sh
        lint_workflow_triggers.py
        lockfile_supply_chain_audit.py
        notebook_to_python.py
        notebook_validator.py
        run_ruff_format.py
        scan_npm_packages.py
        scan_packages.py
        stamp_studio_release.py
        sync_allow_scripts_pins.py
        uninstall.ps1
        uninstall.sh
        verify_comment_only_diff.py
        verify_import_hoist.py
        data/
            colab_apt_list.gpu.txt
            colab_os_info.gpu.txt
            colab_pip_freeze.gpu.txt
            colab_to_cpu_pin.json
    studio/
        install_llama_prebuilt.py
        install_python_stack.py
        LICENSE.AGPL-3.0
        package-lock.json
        package.json
        setup.bat
        setup.ps1
        setup.sh
        Unsloth_Studio_Colab.ipynb
        __init__.py
        backend/
            cloudflare_tunnel.py
            colab.py
            main.py
            run.py
            startup_banner.py
            _platform_compat.py
            __init__.py
            assets/
                __init__.py
                chat_templates/
                    gemma-4-edge.jinja
                    gemma-4.jinja
                configs/
                    full_finetune.yaml
                    inference_defaults.json
                    lora_text.yaml
                    vision_lora.yaml
                    __init__.py
                    model_defaults/
                        default.yaml
                        embedding/
                            unsloth_all-MiniLM-L6-v2.yaml
                            unsloth_bge-m3.yaml
                            unsloth_embeddinggemma-300m.yaml
                            unsloth_gte-modernbert-base.yaml
                            unsloth_Qwen3-Embedding-0.6B.yaml
                        ernie/
                            unsloth_ERNIE-4.5-21B-A3B-PT.yaml
                            unsloth_ERNIE-4.5-VL-28B-A3B-PT.yaml
                        falcon/
                            tiiuae_Falcon-H1-0.5B-Instruct.yaml
                        gemma/
                            unsloth_codegemma-7b-bnb-4bit.yaml
                            unsloth_functiongemma-270m-it.yaml
                            unsloth_gemma-2-27b-bnb-4bit.yaml
                            unsloth_gemma-2-2b.yaml
                            unsloth_gemma-3-270m-it.yaml
                            unsloth_gemma-3-27b-it.yaml
                            unsloth_gemma-3-4b-it.yaml
                            unsloth_gemma-3-4b-pt.yaml
                            unsloth_gemma-3n-E4B-it.yaml
                            unsloth_gemma-3n-E4B.yaml
                            unsloth_gemma-4-26B-A4B-it.yaml
                            unsloth_gemma-4-26B-A4B.yaml
                            unsloth_gemma-4-31B-it.yaml
                            unsloth_gemma-4-31B.yaml
                            unsloth_gemma-4-E2B-it.yaml
                            unsloth_gemma-4-E2B.yaml
                            unsloth_gemma-4-E4B-it.yaml
                            unsloth_gemma-4-E4B.yaml
                        gpt-oss/
                            unsloth_gpt-oss-120b.yaml
                            unsloth_gpt-oss-20b.yaml
                        granite/
                            unsloth_granite-4.0-350m-unsloth-bnb-4bit.yaml
                            unsloth_granite-4.0-h-micro.yaml
                        llama/
                            unsloth_llama-3-8b-bnb-4bit.yaml
                            unsloth_llama-3-8b-Instruct-bnb-4bit.yaml
                            unsloth_Llama-3.2-11B-Vision-Instruct.yaml
                            unsloth_Llama-3.2-1B-Instruct.yaml
                            unsloth_Llama-3.2-3B-Instruct.yaml
                            unsloth_Llama-3.3-70B-Instruct.yaml
                            unsloth_Meta-Llama-3.1-70B-bnb-4bit.yaml
                            unsloth_Meta-Llama-3.1-8B-Instruct-bnb-4bit.yaml
                        llasa/
                            unsloth_Llasa-3B.yaml
                        mistral/
                            unsloth_Magistral-Small-2509-unsloth-bnb-4bit.yaml
                            unsloth_Ministral-3-3B-Instruct-2512.yaml
                            unsloth_mistral-7b-instruct-v0.3-bnb-4bit.yaml
                            unsloth_mistral-7b-v0.3-bnb-4bit.yaml
                            unsloth_Mistral-Nemo-Base-2407-bnb-4bit.yaml
                            unsloth_Mistral-Small-Instruct-2409.yaml
                            unsloth_Pixtral-12B-2409.yaml
                        other/
                            OuteAI_Llama-OuteTTS-1.0-1B.yaml
                            sesame_csm-1b.yaml
                            Spark-TTS-0.5B_LLM.yaml
                            unsloth_answerdotai_ModernBERT-large.yaml
                            unsloth_GLM-4.7-Flash.yaml
                            unsloth_LFM2-1.2B.yaml
                            unsloth_Nemotron-3-Nano-30B-A3B.yaml
                            unsloth_orpheus-3b-0.1-ft.yaml
                            unsloth_PaddleOCR-VL.yaml
                            unsloth_tinyllama-bnb-4bit.yaml
                            unsloth_whisper-large-v3.yaml
                        phi/
                            unsloth_Phi-3-medium-4k-instruct.yaml
                            unsloth_Phi-3.5-mini-instruct.yaml
                            unsloth_Phi-4.yaml
                        qwen/
                            imdatta0_tiny_qwen3_moe_2.8B_0.7B.yaml
                            unsloth_Qwen2-7B.yaml
                            unsloth_Qwen2-VL-7B-Instruct.yaml
                            unsloth_Qwen2.5-1.5B-Instruct.yaml
                            unsloth_Qwen2.5-7B.yaml
                            unsloth_Qwen2.5-Coder-1.5B-Instruct.yaml
                            unsloth_Qwen2.5-Coder-14B-Instruct.yaml
                            unsloth_Qwen2.5-Coder-7B-Instruct-bnb-4bit.yaml
                            unsloth_Qwen2.5-VL-7B-Instruct-bnb-4bit.yaml
                            unsloth_Qwen3-0.6B.yaml
                            unsloth_Qwen3-14B-Base-unsloth-bnb-4bit.yaml
                            unsloth_Qwen3-14B.yaml
                            unsloth_Qwen3-30B-A3B-Instruct-2507.yaml
                            unsloth_Qwen3-32B.yaml
                            unsloth_Qwen3-4B-Instruct-2507.yaml
                            unsloth_Qwen3-4B-Thinking-2507.yaml
                            unsloth_Qwen3-VL-8B-Instruct-unsloth-bnb-4bit.yaml
                datasets/
                    alpaca_unsloth.json
            auth/
                .gitkeep
                authentication.py
                hashing.py
                storage.py
                __init__.py
            core/
                tool_healing.py
                _torchao_stub.py
                __init__.py
                data_recipe/
                    huggingface.py
                    jsonable.py
                    local_callable_validators.py
                    service.py
                    __init__.py
                    jobs/
                        constants.py
                        manager.py
                        parse.py
                        types.py
                        worker.py
                        __init__.py
                    oxc-validator/
                        package-lock.json
                        package.json
                        validate.mjs
                export/
                    export.py
                    orchestrator.py
                    worker.py
                    __init__.py
                inference/
                    anthropic_compat.py
                    audio_codecs.py
                    chat_templates.py
                    chat_template_helpers.py
                    defaults.py
                    external_provider.py
                    inference.py
                    key_exchange.py
                    llama_cpp.py
                    llama_server_args.py
                    mcp_client.py
                    mcp_config_import.py
                    mlx_inference.py
                    orchestrator.py
                    pricing.py
                    providers.py
                    runtime_context.py
                    safetensors_agentic.py
                    tensor_fallback.py
                    tools.py
                    tool_call_parser.py
                    tool_loop_controller.py
                    worker.py
                    _html_to_md.py
                    __init__.py
                rag/
                    captioner.py
                    chunking.py
                    config.py
                    embeddings.py
                    embed_llama_server.py
                    ingestion.py
                    locators.py
                    parsers.py
                    retrieval.py
                    store.py
                    tool.py
                    __init__.py
                training/
                    resume.py
                    s3_dataset.py
                    trainer.py
                    training.py
                    worker.py
                    __init__.py
            hub/
                dependencies.py
                __init__.py
                routes/
                    datasets.py
                    inventory.py
                    __init__.py
                schemas/
                    datasets.py
                    downloads.py
                    inventory.py
                    __init__.py
                services/
                    download_lifecycle.py
                    snapshot_progress.py
                    __init__.py
                    datasets/
                        cache_inventory.py
                        downloads.py
                        formatting.py
                        local.py
                        __init__.py
                    models/
                        cache_inventory.py
                        common.py
                        deletion.py
                        downloads.py
                        folder_browser.py
                        gguf_variants.py
                        local_inventory.py
                        ollama.py
                        __init__.py
                storage/
                    scan_folders.py
                    __init__.py
                tests/
                    conftest.py
                    test_dataset_services.py
                    test_model_services.py
                utils/
                    dataset_cache.py
                    dataset_format.py
                    download_manifest.py
                    download_registry.py
                    gguf.py
                    gguf_plan.py
                    hf_cache_state.py
                    hf_errors.py
                    inventory_scan.py
                    llm_assist.py
                    paths.py
                    snapshot_filters.py
                    state_dir.py
                    __init__.py
                workers/
                    hf_download.py
                    __init__.py
            loggers/
                .gitkeep
                config.py
                handlers.py
                __init__.py
            models/
                .gitkeep
                auth.py
                datasets.py
                data_recipe.py
                export.py
                inference.py
                mcp_servers.py
                models.py
                providers.py
                responses.py
                training.py
                users.py
                __init__.py
            plugins/
                __init__.py
                data-designer-github-repo-seed/
                    pyproject.toml
                    README.md
                    src/
                        data_designer_github_repo_seed/
                            config.py
                            impl.py
                            plugin.py
                            scraper.py
                            __init__.py
                            scraper_impl/
                                gh_client.py
                                queries.py
                                scraper.py
                                state_store.py
                                __init__.py
                data-designer-unstructured-seed/
                    pyproject.toml
                    __init__.py
                    src/
                        data_designer_unstructured_seed/
                            chunking.py
                            config.py
                            impl.py
                            plugin.py
                            __init__.py
            requirements/
                base.txt
                extras-no-deps.txt
                extras.txt
                no-torch-runtime.txt
                overrides.txt
                studio.txt
                triton-kernels.txt
                __init__.py
                single-env/
                    constraints.txt
                    data-designer-deps.txt
                    data-designer.txt
                    overrides-darwin-arm64.txt
                    patch_metadata.py
            routes/
                .gitkeep
                auth.py
                chat_history.py
                datasets.py
                export.py
                inference.py
                llama.py
                mcp_servers.py
                models.py
                prompts.py
                providers.py
                rag.py
                settings.py
                training.py
                training_history.py
                __init__.py
                data_recipe/
                    jobs.py
                    mcp.py
                    seed.py
                    validate.py
                    __init__.py
            state/
                .gitkeep
                tool_approvals.py
                tool_policy.py
                __init__.py
            storage/
                mcp_servers_db.py
                providers_db.py
                rag_db.py
                studio_db.py
                __init__.py
            tests/
                conftest.py
                test_amd_apu_unified_memory.py
                test_anthropic_cache_ttl.py
                test_anthropic_citations.py
                test_anthropic_citations_edge.py
                test_anthropic_code_execution.py
                test_anthropic_compaction.py
                test_anthropic_fast_mode_and_refusal.py
                test_anthropic_fast_mode_edge.py
                test_anthropic_messages.py
                test_anthropic_thinking_translation.py
                test_anthropic_tool_versions.py
                test_anthropic_web_fetch.py
                test_apple_gpu_sensors.py
                test_audio_token_detection.py
                test_browse_folders_route.py
                test_cached_gguf_routes.py
                test_cache_case_resolution.py
                test_chat_history_routes.py
                test_chat_history_storage.py
                test_cleanup_cancelled_checkpoints.py
                test_cloudflare_tunnel.py
                test_context_overflow_truncation.py
                test_cpu_threads.py
                test_datacenter_gpu_tuning.py
                test_dataset_upload_limits.py
                test_data_recipe_github_progress.py
                test_data_recipe_seed.py
                test_default_output_dir_name.py
                test_desktop_auth.py
                test_detect_mmproj_file.py
                test_export_absolute_paths.py
                test_export_log_cursor.py
                test_external_provider_proxy_env.py
                test_external_provider_usage_chunk.py
                test_frontend_resolution.py
                test_gemini_provider.py
                test_gemma4_chat_template_override.py
                test_gguf_completion_usage.py
                test_gguf_metadata.py
                test_gguf_reload_inheritance.py
                test_gguf_route_cursor_reset.py
                test_gguf_routing.py
                test_gpu_selection.py
                test_gpu_selection_sandbox.py
                test_host_defaults.py
                test_index_bootstrap_origin.py
                test_index_bootstrap_origin_extra.py
                test_inference_model_validation.py
                test_inference_orchestrator_crash_message.py
                test_install_resolve_prebuilt.py
                test_kv_cache_estimation.py
                test_llama_cpp_cache_aware_disk_check.py
                test_llama_cpp_context_fit.py
                test_llama_cpp_freshness.py
                test_llama_cpp_load_progress.py
                test_llama_cpp_load_progress_live.py
                test_llama_cpp_load_progress_matrix.py
                test_llama_cpp_max_context_threshold.py
                test_llama_cpp_mmproj_fallback.py
                test_llama_cpp_mtp_detection.py
                test_llama_cpp_no_context_shift.py
                test_llama_cpp_props_readback.py
                test_llama_cpp_start_failure_classification.py
                test_llama_cpp_tool_loop.py
                test_llama_cpp_update.py
                test_llama_cpp_wait_for_health.py
                test_llama_cpp_wait_for_vram_settle.py
                test_llama_cpp_windows_nvidia_path.py
                test_llama_route.py
                test_llama_route_timeouts.py
                test_llama_server_args.py
                test_llm_assist_startup_opt_in.py
                test_login_rate_limit.py
                test_log_filter_no_truncation.py
                test_mcp_config_import.py
                test_mcp_servers.py
                test_mcp_stdio_improvements.py
                test_mcp_stdio_pr5863.py
                test_middleware.py
                test_mlx_inference_backend.py
                test_mlx_training_worker_config.py
                test_mmproj_vram_accounting.py
                test_models_get_model_config_case_resolution.py
                test_mtp_drafter_companion.py
                test_multimodal_document.py
                test_native_context_length.py
                test_offline_gguf_cache_fallback.py
                test_offline_inference_parent.py
                test_openai_citation_markers.py
                test_openai_citation_markers_edge.py
                test_openai_code_execution.py
                test_openai_compaction.py
                test_openai_container_crud.py
                test_openai_image_generation.py
                test_openai_responses_translation.py
                test_openai_tool_passthrough.py
                test_openai_tool_result_fallbacks.py
                test_pricing.py
                test_pricing_edge.py
                test_providers_api.py
                test_pytorch_mirror.py
                test_rag_captioning.py
                test_rag_chunking.py
                test_rag_embeddings.py
                test_rag_embed_llama_server.py
                test_rag_ingestion.py
                test_rag_preview.py
                test_rag_retrieval.py
                test_rag_store.py
                test_recommended_folders_permission.py
                test_responses_api.py
                test_responses_tool_passthrough.py
                test_rocm_oom_guard.py
                test_s3_dataset.py
                test_safetensors_capability_advertise.py
                test_safetensors_tool_loop.py
                test_sandbox_tools.py
                test_server_disk_logging.py
                test_startup_banner_loopback.py
                test_studio_api.py
                test_studio_train_validation.py
                test_tensor_parallel.py
                test_tool_approvals.py
                test_tool_call_parser_strict.py
                test_tool_confirm_loop.py
                test_tool_confirm_stream.py
                test_tool_loop_controller.py
                test_tool_message_empty_content.py
                test_tool_policy_gates.py
                test_tool_policy_state.py
                test_tool_xml_strip.py
                test_trained_model_scan.py
                test_training_history_update.py
                test_training_nan_loss_handling.py
                test_training_progress_stream_nan.py
                test_training_raw_support.py
                test_training_resume.py
                test_training_worker_flash_attn.py
                test_transformers_version.py
                test_utils.py
                test_vision_cache.py
                test_vram_estimation.py
                test_windows_gpu_detection_mock.py
                __init__.py
            utils/
                .gitkeep
                api_errors.py
                cache_cleanup.py
                cpu_threads.py
                downsample.py
                helper_precache_settings.py
                host_policy.py
                llama_cpp_freshness.py
                llama_cpp_update.py
                native_path_leases.py
                studio_version.py
                subprocess_compat.py
                transformers_version.py
                update_status.py
                upload_limits.py
                utils.py
                wheel_utils.py
                _studio_release_build.py
                __init__.py
                datasets/
                    cache_safe.py
                    chat_templates.py
                    dataset_none_detect.py
                    dataset_utils.py
                    data_collators.py
                    format_conversion.py
                    format_detection.py
                    llm_assist.py
                    model_mappings.py
                    raw_text.py
                    vlm_processing.py
                    __init__.py
                hardware/
                    amd.py
                    apple.py
                    hardware.py
                    nvidia.py
                    VRAM_ESTIMATION.md
                    vram_estimation.py
                    __init__.py
                inference/
                    inference_config.py
                    __init__.py
                models/
                    checkpoints.py
                    gguf_metadata.py
                    model_config.py
                    __init__.py
                paths/
                    path_utils.py
                    storage_roots.py
                    __init__.py
        frontend/
            .gitignore
            .gitkeep
            .npmrc
            biome.json
            components.json
            data-designer.openapi (1).yaml
            eslint.config.js
            index.html
            package-lock.json
            package.json
            tsconfig.app.json
            tsconfig.json
            tsconfig.node.json
            vite.config.ts
            public/
                unsloth.ico
                fonts/
                    FiraCode-VariableFont_wght.ttf
                    Hellix-Medium.woff
                    Hellix-Regular.woff
                    Hellix-SemiBold.woff
                    Hellix-SemiBold.woff2
                Hellix font official/
                    OTF/
                        Hellix-SemiBold.otf
                    TTF/
                        Hellix-SemiBold.ttf
                    WEB/
                        Hellix-SemiBold.woff
                        Hellix-SemiBold.woff2
                hub/
                    profile/
                        logo/
                provider-logos/
                    misc/
                Sloth emojis/
            src/
                asset-queries.d.ts
                index.css
                main.tsx
                speech-recognition.d.ts
                app/
                    app.tsx
                    auth-guards.ts
                    provider.tsx
                    router.tsx
                    routes/
                        change-password.tsx
                        chat.tsx
                        data-recipes.$recipeId.tsx
                        data-recipes.tsx
                        export.tsx
                        grid-test.tsx
                        hub.tsx
                        index.tsx
                        login.tsx
                        onboarding.tsx
                        projects.tsx
                        settings.tsx
                        studio.tsx
                        __root.tsx
                assets/
                components/
                    app-sidebar.tsx
                    example.tsx
                    llama-update-banner.tsx
                    mascot-img.tsx
                    navbar.tsx
                    section-card.tsx
                    shutdown-dialog.tsx
                    assistant-ui/
                        attachment.tsx
                        audio-player.tsx
                        badge.tsx
                        citation-utils.ts
                        code-plugin.ts
                        code-themes.ts
                        code-toggle-icon.tsx
                        generated-image-overlay-context.tsx
                        image.tsx
                        markdown-text.tsx
                        message-timing.tsx
                        model-selector.tsx
                        rag-sources.tsx
                        reasoning.tsx
                        sources.tsx
                        think-aria-label.ts
                        thread.tsx
                        tool-call-spinner.tsx
                        tool-confirmation-controls.tsx
                        tool-fallback.tsx
                        tool-group.tsx
                        tool-ui-code-execution.tsx
                        tool-ui-image-generation.tsx
                        tool-ui-knowledge-base.tsx
                        tool-ui-python.tsx
                        tool-ui-render-html.tsx
                        tool-ui-terminal.tsx
                        tool-ui-web-search.tsx
                        tooltip-icon-button.tsx
                        use-intent-aware-autoscroll.tsx
                        model-selector/
                            folder-browser.tsx
                            model-delete-action.tsx
                            pickers.tsx
                            types.ts
                    layout/
                        dashboard-grid.tsx
                        dashboard-layout.tsx
                        index.ts
                    markdown/
                        markdown-preview.tsx
                        mermaid-error.tsx
                    tauri/
                        startup-screen.tsx
                        update-banner.tsx
                        update-screen.tsx
                        window-titlebar.tsx
                    ui/
                        accordion.tsx
                        alert-dialog.tsx
                        alert.tsx
                        animated-shiny-text.tsx
                        animated-theme-toggler.tsx
                        aspect-ratio.tsx
                        avatar.tsx
                        badge.tsx
                        breadcrumb.tsx
                        button.tsx
                        calendar.tsx
                        card.tsx
                        chart.tsx
                        checkbox.tsx
                        collapsible.tsx
                        combobox.tsx
                        command.tsx
                        confetti.tsx
                        context-menu.tsx
                        copyable-error-chip.tsx
                        data-table.tsx
                        dialog.tsx
                        dropdown-menu.tsx
                        empty.tsx
                        field.tsx
                        hover-card.tsx
                        input-group.tsx
                        input.tsx
                        label.tsx
                        light-rays.tsx
                        menubar.tsx
                        navigation-menu.tsx
                        pagination.tsx
                        popover.tsx
                        progress.tsx
                        radio-group.tsx
                        resizable.tsx
                        scroll-area.tsx
                        select.tsx
                        separator.tsx
                        sheet.tsx
                        shimmer-button.tsx
                        shine-border.tsx
                        sidebar.tsx
                        skeleton.tsx
                        slider.tsx
                        sonner.tsx
                        sparkles-text.tsx
                        spinner.tsx
                        switch.tsx
                        table.tsx
                        tabs.tsx
                        terminal.tsx
                        textarea.tsx
                        toggle-group.tsx
                        toggle.tsx
                        tooltip.tsx
                    web/
                        update-banner.tsx
                config/
                    env.ts
                    training.ts
                features/
                    auth/
                        api.ts
                        change-password-page.tsx
                        index.ts
                        login-page.tsx
                        session.ts
                        tauri-auto-auth.ts
                        components/
                            auth-form.tsx
                    chat/
                        api-provider-logo.tsx
                        audio-attachment-adapter.ts
                        chat-mcp-servers-dialog.tsx
                        chat-page.tsx
                        chat-providers-dialog.tsx
                        chat-settings-sheet.tsx
                        db.ts
                        external-providers.ts
                        index.ts
                        mcp-composer-button.tsx
                        open-document.ts
                        projects-page.tsx
                        provider-capabilities.ts
                        runtime-provider.tsx
                        shared-composer.tsx
                        thread-sidebar.tsx
                        types.ts
                        adapters/
                            studio-web-speech-dictation-adapter.ts
                        api/
                            chat-adapter.ts
                            chat-api.ts
                            chat-settings-api.ts
                            mcp-servers-api.ts
                            openai-containers.ts
                            prompts-api.ts
                            providers-api.ts
                        artifacts/
                            artifact-card.tsx
                            artifact-surface.tsx
                            html-frame.tsx
                            store.ts
                            types.ts
                        components/
                            chat-search-dialog.tsx
                            context-usage-bar.tsx
                            model-load-status.tsx
                            new-project-dialog.tsx
                            openai-code-exec-section.tsx
                            project-switcher.tsx
                        hooks/
                            use-chat-model-runtime.ts
                            use-chat-projects.ts
                            use-chat-search-index.ts
                            use-chat-sidebar-items.ts
                            use-pill-activation-order.ts
                            use-rag-tool-disabled.ts
                            use-transfer-stats.ts
                        lib/
                            apply-inference-status-to-store.ts
                            friendly-names.ts
                            training-compare-handoff.ts
                        presets/
                            preset-policy.ts
                        prompt-storage/
                            prompt-storage-dialog.tsx
                        stores/
                            chat-preferences-store.ts
                            chat-runtime-store.ts
                            chat-search-store.ts
                            external-providers-store.ts
                            pinned-chats-store.ts
                            plus-menu-prefs-store.ts
                        tour/
                            index.ts
                            steps.tsx
                        types/
                            api.ts
                            runtime.ts
                        utils/
                            chat-history-storage.ts
                            chat-settings-storage.ts
                            chat-thread-tombstones.ts
                            clear-all-chats.ts
                            composer-draft.ts
                            delete-thread-message.ts
                            export-chat-history.ts
                            format-transfer.ts
                            image-input-support.ts
                            parse-assistant-content.ts
                            qwen-params.ts
                            thread-ids.ts
                            transfer-stats.ts
                    data-recipes/
                        index.ts
                        types.ts
                        data/
                            recipes-db.ts
                        hooks/
                            use-recipe-sidebar-items.ts
                        learning-recipes/
                            conversation.json
                            github-support-bot.json
                            index.ts
                            instruction-from-answer.json
                            ocr-document-extraction.json
                            pdf-grounded-qa.json
                            structured-outputs-jinja.json
                            text-to-python.json
                            text-to-sql.json
                        pages/
                            data-recipes-page.tsx
                            edit-recipe-page.tsx
                    export/
                        anim.ts
                        constants.ts
                        export-page.tsx
                        index.ts
                        api/
                            export-api.ts
                        components/
                            export-dialog.tsx
                            method-picker.tsx
                            quant-picker.tsx
                        tour/
                            index.ts
                            steps.tsx
                    hub/
                        hub-page.tsx
                        hub.css
                        types.ts
                        catalog/
                            catalog-states.tsx
                            dataset-download-section.tsx
                            dot-tag.tsx
                            download-cancel-indicator.tsx
                            download-card.tsx
                            download-section.tsx
                            external-link-confirm-dialog.tsx
                            gguf-download-card.tsx
                            gguf-live-variant-states.ts
                            gguf-status-cards.tsx
                            hub-option-menu.tsx
                            local-dataset-card.tsx
                            local-on-device-card.tsx
                            model-inspector.tsx
                            model-readme.tsx
                            models-catalog-lists.tsx
                            models-catalog-rows.tsx
                            models-catalog.tsx
                            models-header.tsx
                            models-toolbar.tsx
                            on-device-folders-dialog.tsx
                            owner-avatar.tsx
                            path-info-button.tsx
                            safetensors-download-card.tsx
                            shared.tsx
                            transport-conflict-dialog.tsx
                            transport-toggle.tsx
                            use-card-delete.ts
                            use-delete-confirm-action.ts
                            use-download-card-state.ts
                            use-gguf-variant-fetch-state.ts
                        components/
                            hf-token-indicator.tsx
                            page-heading.tsx
                            train-icon.ts
                        download-manager/
                            api.ts
                            constants.ts
                            download-api-adapter.ts
                            download-manager-config.ts
                            download-manager-controller.ts
                            download-manager-panel.tsx
                            download-manager-state.ts
                            download-manager-types.ts
                            download-progress-bar.tsx
                            hydration.ts
                            index.ts
                            poll-loop.ts
                            runtime-registry.ts
                            transport-conflict.ts
                            transport-preference.ts
                            types.ts
                            use-repo-download.ts
                        hooks/
                            use-copy-feedback.ts
                            use-dataset-size.ts
                            use-discover-search.ts
                            use-hub-dataset-search.ts
                            use-hub-infinite-scroll.ts
                            use-hub-model-search.ts
                            use-hub-model-vram.ts
                            use-hub-paginated-search.ts
                            use-is-hub-desktop.ts
                            use-latest-ref.ts
                            use-models-selection.ts
                            use-online-status.ts
                            use-selected-model-metadata.ts
                            use-selected-model-view.ts
                        inventory/
                            api.ts
                            constants.ts
                            gguf-variants-cache-events.ts
                            index.ts
                            inventory-dedupe.ts
                            inventory-hint-store.ts
                            inventory-hints.ts
                            resource-resolver.ts
                            types.ts
                            use-device-inventory.ts
                            use-gguf-variants-cache-version.ts
                            use-hub-inventory.ts
                            view-models.ts
                        lib/
                            abort-signals.ts
                            channels.ts
                            dataset-size.ts
                            format-filters.ts
                            format.ts
                            gguf-fit.ts
                            gguf-variant-sort.ts
                            hf-cache.ts
                            hf-model-meta.ts
                            hf-owner-avatar.ts
                            hf-readme.ts
                            hub-feature-flags.ts
                            hub-token-header.ts
                            inventory-search.ts
                            local-path.ts
                            lru-map.ts
                            model-capabilities.ts
                            model-identifiers.ts
                            model-identity.ts
                            network.ts
                            provider-logos.ts
                            search-text.ts
                            selection-resolution.ts
                            token-fingerprint.ts
                            unsloth-support.ts
                            view-models.ts
                        stores/
                            external-link-confirm.ts
                            hf-token-store.ts
                            inventory-events.ts
                    native-intents/
                        api.ts
                        index.ts
                        native-intent-drain.tsx
                        store.ts
                        types.ts
                        use-native-dialogs.ts
                        use-native-drop.ts
                        use-native-readiness.ts
                        components/
                            native-model-chip.tsx
                            native-model-drop-overlay.tsx
                    onboarding/
                        index.ts
                        components/
                            splash-screen.tsx
                            wizard-content.tsx
                            wizard-footer.tsx
                            wizard-layout.tsx
                            wizard-sidebar.tsx
                            wizard-step-item.tsx
                            steps/
                                dataset-step.tsx
                                hyperparameters-step.tsx
                                model-selection-step.tsx
                                model-type-step.tsx
                                summary-step.tsx
                    profile/
                        index.ts
                        sloth-avatars.ts
                        components/
                            profile-personalization-panel.tsx
                            user-avatar.tsx
                        hooks/
                            use-effective-profile.ts
                        stores/
                            user-profile-store.ts
                        utils/
                            avatar-initials.ts
                            jwt-subject.ts
                            resize-image-file.ts
                    rag/
                        index.ts
                        api/
                            rag-api.ts
                        components/
                            document-preview-mount.tsx
                            document-preview-sheet.tsx
                            document-status-chip.tsx
                            knowledge-base-composer-button.tsx
                            knowledge-base-dialog.tsx
                            preview-store.ts
                            project-sources-panel.tsx
                            retrieval-settings-section.tsx
                            thread-documents-bar.tsx
                            use-rag-documents.ts
                        types/
                            rag.ts
                    recipe-studio/
                        constants.ts
                        execution-types.ts
                        index.ts
                        recipe-studio-page.tsx
                        api/
                            index.ts
                        blocks/
                            definitions.ts
                            registry.ts
                            render-dialog.tsx
                        components/
                            block-sheet.tsx
                            chip-input.tsx
                            recipe-floating-icon-button-class.ts
                            recipe-graph-aux-node.tsx
                            recipe-graph-node.tsx
                            recipe-graph-semantic-edge.tsx
                            recipe-studio-header.tsx
                            controls/
                                layout-controls.tsx
                                run-validate-floating-controls.tsx
                                viewport-controls.tsx
                            executions/
                                execution-columns-tab.tsx
                                execution-data-tab.tsx
                                execution-overview-tab.tsx
                                execution-raw-tab.tsx
                                execution-sidebar.tsx
                                executions-view-helpers.ts
                                executions-view.tsx
                                publish-execution-dialog.tsx
                            graph/
                                internals-sync.tsx
                            inline/
                                inline-category-badges.tsx
                                inline-expression.tsx
                                inline-field.tsx
                                inline-llm.tsx
                                inline-model.tsx
                                inline-policy.ts
                                inline-sampler.tsx
                                inline-seed.tsx
                            rf-ui/
                                base-handle.tsx
                                base-node.tsx
                                data-edge.tsx
                                labeled-handle.tsx
                            runtime/
                                execution-progress-island.tsx
                            shared/
                                available-references-inline.tsx
                                hf-dataset-combobox.tsx
                        data/
                            executions-db.ts
                        dialogs/
                            config-dialog.tsx
                            import-dialog.tsx
                            preview-dialog.tsx
                            processors-dialog.tsx
                            expression/
                                expression-dialog.tsx
                            llm/
                                general-tab.tsx
                                llm-dialog.tsx
                                scores-tab.tsx
                            markdown-note/
                                markdown-note-dialog.tsx
                            models/
                                local-recipe-model-selector.tsx
                                model-config-dialog.tsx
                                model-provider-dialog.tsx
                            samplers/
                                bernoulli-dialog.tsx
                                category-dialog.tsx
                                datetime-dialog.tsx
                                gaussian-dialog.tsx
                                person-dialog.tsx
                                subcategory-dialog.tsx
                                timedelta-dialog.tsx
                                uniform-dialog.tsx
                                uuid-dialog.tsx
                            seed/
                                seed-dialog.tsx
                                unstructured-drop-zone.tsx
                                upload-limits.ts
                            shared/
                                available-variables.tsx
                                collapsible-section-trigger.tsx
                                dialog-shell.tsx
                                field-label.tsx
                                name-field.tsx
                                validation-banner.tsx
                            tool-profile/
                                helpers.ts
                                tool-profile-dialog.tsx
                            validators/
                                validator-dialog.tsx
                        easy/
                            github-crawler-easy-view.tsx
                        executions/
                            execution-helpers.ts
                            hydration.ts
                            run-settings.ts
                            runtime.ts
                            tracker.ts
                        hooks/
                            use-node-connection-status.ts
                            use-recipe-editor-graph.ts
                            use-recipe-executions.ts
                            use-recipe-persistence.ts
                            use-recipe-runtime-visuals.ts
                            use-recipe-studio-actions.ts
                        stores/
                            recipe-executions.ts
                            recipe-studio-helpers.ts
                            recipe-studio.ts
                            helpers/
                                edge-sync.ts
                                model-infra-layout.ts
                                node-updates.ts
                                reference-sync.ts
                                removals.ts
                        types/
                            index.ts
                        utils/
                            config-factories.ts
                            config-labels.ts
                            config-type-guards.ts
                            graph-warnings.ts
                            graph.ts
                            handle-layout.ts
                            handles.ts
                            image-preview.ts
                            index.ts
                            layout.ts
                            naming.ts
                            node-data.ts
                            parse.ts
                            processors.ts
                            reactflow-changes.ts
                            recipe-studio-view.ts
                            refs.ts
                            rf-node-dimensions.ts
                            ui-tones.ts
                            validation.ts
                            variables.ts
                            graph/
                                derive-display-graph.ts
                                fit-view.ts
                                recipe-graph-connection.ts
                                relations.ts
                                runtime-visual-state.ts
                            import/
                                edges.ts
                                helpers.ts
                                importer.ts
                                index.ts
                                parsers.ts
                                types.ts
                                ui.ts
                                parsers/
                                    expression-parser.ts
                                    llm-parser.ts
                                    model-parser.ts
                                    sampler-parser.ts
                                    seed-config-parser.ts
                                    validator-parser.ts
                            payload/
                                build-payload.ts
                                builders-llm.ts
                                builders-model.ts
                                builders-processors.ts
                                builders-sampler.ts
                                builders-seed.ts
                                builders-validator.ts
                                builders.ts
                                empty.ts
                                index.ts
                                parse.ts
                                types.ts
                                validate.ts
                            validators/
                                code-lang.ts
                                oxc-code-shape.ts
                                oxc-mode.ts
                    settings/
                        index.ts
                        settings-dialog.tsx
                        api/
                            api-keys.ts
                            helper-precache.ts
                            upload-limit.ts
                        components/
                            api-key-row.tsx
                            archived-chats-dialog.tsx
                            create-key-form.tsx
                            key-reveal-card.tsx
                            language-select.tsx
                            settings-row.tsx
                            settings-section.tsx
                            studio-version-section.tsx
                            theme-segmented.tsx
                            update-studio-instructions.tsx
                            usage-examples.tsx
                        stores/
                            settings-dialog-store.ts
                            theme-store.ts
                        tabs/
                            about-tab.tsx
                            api-keys-tab.tsx
                            appearance-tab.tsx
                            chat-tab.tsx
                            connections-tab.tsx
                            general-tab.tsx
                            profile-tab.tsx
                    studio/
                        historical-training-view.tsx
                        history-card-grid.tsx
                        index.ts
                        live-training-view.tsx
                        studio-page.tsx
                        training-start-overlay.tsx
                        sections/
                            charts-content.tsx
                            charts-section.tsx
                            dataset-preview-dialog-mapping.tsx
                            dataset-preview-dialog-utils.ts
                            dataset-preview-dialog.tsx
                            dataset-section.tsx
                            document-upload-redirect-dialog.tsx
                            model-section.tsx
                            params-section.tsx
                            progress-section-lib.ts
                            progress-section.tsx
                            s3-config-form.tsx
                            training-section.tsx
                            charts/
                                chart-preferences-store.ts
                                chart-settings-sheet.tsx
                                eval-loss-chart-card.tsx
                                grad-norm-chart-card.tsx
                                learning-rate-chart-card.tsx
                                training-loss-chart-card.tsx
                                types.ts
                                utils.ts
                        tour/
                            index.ts
                            steps/
                                base-model.tsx
                                dataset.tsx
                                index.tsx
                                local-model.tsx
                                method.tsx
                                nav.tsx
                                params.tsx
                                save.tsx
                                start.tsx
                            training/
                                index.ts
                                steps.tsx
                    tour/
                        index.ts
                        types.ts
                        components/
                            guided-tour.tsx
                            read-more.tsx
                            spotlight-overlay.tsx
                        hooks/
                            use-guided-tour-controller.ts
                        lib/
                            confetti-fireworks.ts
                            dom.ts
                            layout.ts
                    training/
                        events.ts
                        index.ts
                        api/
                            datasets-api.ts
                            history-api.ts
                            mappers.ts
                            models-api.ts
                            train-api.ts
                        components/
                            hf-dataset-subset-split-selectors.tsx
                        hooks/
                            use-max-steps-epochs-toggle.ts
                            use-training-actions.ts
                            use-training-history-sidebar.ts
                            use-training-runtime-lifecycle.ts
                            use-training-unload-guard.ts
                        lib/
                            model-defaults.ts
                            sync-runtime.ts
                            training-methods.ts
                            validation.ts
                            yaml-config.ts
                        stores/
                            dataset-preview-dialog-store.ts
                            training-config-store.ts
                            training-runtime-store.ts
                        types/
                            api.ts
                            config.ts
                            datasets.ts
                            history.ts
                            runtime.ts
                hooks/
                    index.ts
                    use-collapse-scroll-lock.ts
                    use-debounced-value.ts
                    use-gpu-info.ts
                    use-gpu-utilization.ts
                    use-hardware-info.ts
                    use-hf-dataset-search.ts
                    use-hf-dataset-splits.ts
                    use-hf-model-search.ts
                    use-hf-paginated-search.ts
                    use-hf-token-validation.ts
                    use-infinite-scroll.ts
                    use-llama-update-check.ts
                    use-llama-update-pref.ts
                    use-mobile.ts
                    use-recommended-model-vram.ts
                    use-sidebar-pin.ts
                    use-tauri-backend.ts
                    use-tauri-update.ts
                    use-web-update-check.ts
                i18n/
                    AGENTS.md
                    check-parity.ts
                    index.ts
                    locale-store.ts
                    messages.ts
                    types.ts
                    locales/
                        en.ts
                        zh-CN.ts
                lib/
                    api-base.ts
                    audio-utils.ts
                    chevron-icons.ts
                    copy-to-clipboard.ts
                    format-fastapi-error.ts
                    hf-cache.ts
                    latex.ts
                    model-size.ts
                    native-notifications.ts
                    open-link.ts
                    tauri-diagnostics.ts
                    tick-icon.ts
                    toast.ts
                    utils.ts
                    vram.ts
                shared/
                    toast.ts
                stores/
                    index.ts
                    training.ts
                types/
                    index.ts
                    training.ts
                utils/
                    index.ts
                    strings.ts
        src-tauri/
            build.rs
            Cargo.lock
            Cargo.toml
            Entitlements.plist
            tauri.conf.json
            tauri.macos.conf.json
            tauri.windows.conf.json
            capabilities/
                default.json
            icons/
                icon.icns
                icon.ico
            linux/
                postremove.sh
            src/
                commands.rs
                desktop_auth.rs
                desktop_backend_owner.rs
                desktop_update_policy.rs
                install.rs
                main.rs
                native_backend_lease.rs
                native_intents.rs
                native_path_policy.rs
                preflight.rs
                process.rs
                update.rs
                windows_job.rs
                diagnostics/
                    mod.rs
                    phase_log.rs
                    redaction.rs
                    report.rs
                    state.rs
                preflight/
                    backend.rs
                    managed.rs
                    types.rs
                    version.rs
            windows/
                hooks.nsh
                installer.nsi
                sign-with-trusted-signing.ps1
                branding/
                    nsis-header.bmp
                    nsis-sidebar.bmp
    tests/
        conftest.py
        run_all.sh
        test_attention_implementation.py
        test_callback_signature_drift.py
        test_cli_export_unpacking.py
        test_enforce_kwargs_spacing.py
        test_finetune_last_n_layers.py
        test_gemma4_chat_template.py
        test_get_model_name.py
        test_import_fixes_drift.py
        test_loader_glob_skip.py
        test_model_registry.py
        test_moe_lora_targets.py
        test_multi_image_grpo_chunking.py
        test_nvfp4_quant_load.py
        test_peft_weight_converter_compat.py
        test_public_api_surface.py
        test_raw_text.py
        test_resolve_model_class.py
        test_studio_install_workspace_guard.py
        test_studio_root_resilience.py
        test_tool_mask_zoo_compat.py
        test_video_path_validation.py
        test_windows_rocm_bnb_version.py
        _zoo_aggressive_cuda_spoof.py
        __init__.py
        notebooks/
            test_validator_fixtures.py
            __init__.py
        python/
            conftest.py
            test_construct_chat_template_validation.py
            test_cross_platform_parity.py
            test_dpo_vision_processor_passthrough.py
            test_e2e_no_torch_sandbox.py
            test_fast_language_model_text_only.py
            test_fast_model_config_passthrough.py
            test_fast_sentence_transformer_redirect_lifecycle.py
            test_flash_attn_install_python_stack.py
            test_gpu_init_ldconfig_guard.py
            test_install_python_stack.py
            test_no_torch_filtering.py
            test_orpo_processor_text_tokenizer.py
            test_patch_trl_rl_trainers_defensive.py
            test_studio_import_no_torch.py
            test_tokenizers_and_torch_constraint.py
            test_unsloth_run_tool_policy_resolver.py
            test_vision_lora_targeting.py
            __init__.py
        qlora/
            README.md
            test_hf_qlora_train_and_merge.py
            test_unsloth_qlora_train_and_merge.py
        saving/
            test_fix_sentencepiece_gguf_robustness.py
            test_patch_saving_none_tokenizer.py
            test_preserve_tokenizer_eos_token.py
            test_qwen3_5_vlm_full_finetune_key_remap.py
            test_save_shell_injection.py
            test_save_subprocess_utf8_encoding.py
            test_unsloth_save.py
            gpt-oss-merge/
                run_test.sh
                test_merged_model.py
                train_and_merge.py
            language_models/
                test_merged_model_perplexity_llama-3.1-8b.py
                test_merged_model_perplexity_qwen_2.5.py
                test_merge_4bit_validation.py
                test_merge_model_perplexity_llama-3.2.py
                test_merge_model_perplexity_mistral.py
                test_merge_model_perplexity_phi_4.py
                test_push_to_hub_merged.py
                test_push_to_hub_merged_sharded_index_file.py
                test_save_merged_grpo_model.py
            non_peft/
                test_mistral_non_peft.py
                test_whisper_non_peft.py
            text_to_speech_models/
                test_csm.py
                test_lasa.py
                test_orpheus.py
                test_whisper.py
            vision_models/
                test_index_file_sharded_model.py
                test_push_to_hub_merged.py
                test_save_merge_qwen2.5vl32B_model_ocr_benchmark.py
                test_save_merge_vision_model_ocr_benchmark.py
        security/
            conftest.py
            test_lint_workflow_triggers.py
            test_lockfile_supply_chain_audit.py
            test_new_install_scripts.py
            test_scan_npm_packages.py
            test_scan_packages.py
            __init__.py
            fixtures/
                clean_lockfile.json
                clean_wheel.whl
                malicious_lockfile.json
                malicious_sdist.tar.gz
                malicious_wheel.whl
                structural_only_lockfile.json
                _build.py
                __init__.py
        sh/
            test_get_torch_index_url.sh
            test_install_host_defaults.sh
            test_mac_intel_compat.sh
            test_nvcc_meets_llama_minimum.sh
            test_tauri_install_exit_order.sh
            test_torch_constraint.sh
        studio/
            playwright_chat_ime_i18n.py
            playwright_chat_ui.py
            playwright_extra_ui.py
            run_real_mlx_smoke.py
            studio_api_smoke.py
            test_auth_form_input_count.py
            test_cancel_atomicity.py
            test_cancel_id_wiring.py
            test_chat_preset_builtin_invariants.py
            test_cli_repo_variant.py
            test_cli_run_alias.py
            test_cli_studio_defaults.py
            test_cli_studio_stop_windows.py
            test_composer_rtl_bidi_attribute.py
            test_export_output_path_contract.py
            test_frontend_dep_removal.py
            test_hardware_dispatch_matrix.py
            test_is_mlx_dispatch_gate.py
            test_llama_cpp_wall_clock_cap.py
            test_mlx_training_worker_behaviors.py
            test_resolve_cuda_toolkit.ps1
            test_stream_cancel_registration_timing.py
            test_studio_gguf_export_script_pin.py
            test_studio_text_descender_clipping.py
            test_sync_allow_scripts_pins.py
            _playwright_robust.py
            install/
                conftest.py
                smoke_test_llama_prebuilt.py
                smoke_test_parallel_studio_home.py
                test_cuda_repair.py
                test_gpu_detection_followups.py
                test_hf_auth.py
                test_install_llama_prebuilt_logic.py
                test_launch_studio_launcher.py
                test_llama_pr_force_and_source.py
                test_macos_version_compat.py
                test_pr4562_bugfixes.py
                test_pr5940_followups.py
                test_probe_timeouts.py
                test_rocm_support.py
                test_selection_logic.py
            load_freeze/
                llama_server_shim.py
                test_load_orchestrator.py
                __init__.py
        utils/
            aime_eval.md
            aime_eval.py
            cleanup_utils.py
            data_utils.py
            generate_dataset_with_none.py
            hf_utils.py
            ocr_eval.md
            ocr_eval.py
            os_utils.py
            perplexity_eval.md
            perplexity_eval.py
            run_none_detect_tests.py
            test_attention_masks.py
            test_batched_leftpad_generation_gpu.py
            test_packing.py
            test_prepare_inputs_leftpad.py
            test_qat.py
            test_q_galore.py
            test_rope_scaling_drift.py
            test_trunc_normal_patch.py
            __init__.py
        version_compat/
            test_bitsandbytes_pinned_symbols.py
            test_peft_pinned_symbols.py
            test_sentence_transformers_pinned_symbols.py
            test_transformers_pinned_symbols.py
            test_trl_grpo_pinned_symbols.py
            test_unsloth_zoo_save_merged_pinned_symbols.py
            _fetch.py
            __init__.py
        vllm_compat/
            test_extended_module_imports.py
            test_unsloth_zoo_imports.py
            test_vllm_pinned_symbols.py
            __init__.py
    unsloth/
        chat_templates.py
        device_type.py
        import_fixes.py
        ollama_template_mappers.py
        save.py
        tokenizer_utils.py
        trainer.py
        _auto_install.py
        _gpu_init.py
        __init__.py
        dataprep/
            raw_text.py
            synthetic.py
            synthetic_configs.py
            __init__.py
        kernels/
            cross_entropy_loss.py
            fast_lora.py
            flex_attention.py
            fp8.py
            geglu.py
            layernorm.py
            rms_layernorm.py
            rope_embedding.py
            swiglu.py
            utils.py
            __init__.py
            moe/
                autotune_cache.py
                LICENSE
                README.md
                requirements.txt
                __init__.py
                benchmark/
                    benchmark_fused_moe.py
                    utils.py
                grouped_gemm/
                    interface.py
                    LICENSE
                    __init__.py
                    kernels/
                        autotuning.py
                        backward.py
                        forward.py
                        tuning.py
                        __init__.py
                    reference/
                        moe_block.py
                        moe_ops.py
                        __init__.py
                        layers/
                            llama4_moe.py
                            qwen3_moe.py
                tests/
                    common.py
                    moe_utils.py
                    run_qwen3_moe_tests.sh
                    test_grouped_gemm.py
                    test_llama4_moe.py
                    test_qwen3_moe.py
                    __init__.py
        models/
            cohere.py
            diffusion.py
            dpo.py
            falcon_h1.py
            gemma.py
            gemma2.py
            glm4_moe.py
            granite.py
            llama.py
            llama4.py
            loader.py
            loader_utils.py
            mapper.py
            mistral.py
            qwen2.py
            qwen3.py
            qwen3_moe.py
            rl.py
            rl_replacements.py
            sentence_transformer.py
            vision.py
            _utils.py
            __init__.py
        optimizers/
            q_galore_adamw.py
            q_galore_projector.py
            __init__.py
        registry/
            REGISTRY.md
            registry.py
            _deepseek.py
            _gemma.py
            _llama.py
            _mistral.py
            _phi.py
            _qwen.py
            __init__.py
        utils/
            attention_dispatch.py
            hf_hub.py
            packing.py
            __init__.py
    unsloth_cli/
        config.py
        options.py
        _inference.py
        _tool_policy.py
        __init__.py
        commands/
            chat.py
            export.py
            inference.py
            studio.py
            train.py
            __init__.py
        tests/
            test_inference_chat.py
            test_studio_cloudflare_flag.py
            test_studio_run_parallel_flag.py
            test_studio_run_short_alias_clashes.py
```

## Core Logic Samples

### `cli.py`
```
# SPDX-License-Identifier: AGPL-3.0-only
# Copyright 2026-present the Unsloth AI Inc. team. All rights reserved. See /studio/LICENSE.AGPL-3.0

from unsloth_cli import app

if __name__ == "__main__":
    app()
```

### `CODE_OF_CONDUCT.md`
```

# Contributor Covenant Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in our
community a harassment-free experience for everyone, regardless of age, body
size, visible or invisible disability, ethnicity, sex characteristics, gender
identity and expression, level of experience, education, socio-economic status,
nationality, personal appearance, race, caste, color, religion, or sexual
identity and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming,
diverse, inclusive, and healthy community.

## Our Standards

Examples of behavior that contributes to a positive environment for our
community include:

* Demonstrating empathy and kindness toward other people
* Being respectful of differing opinions, viewpoints, and experiences
* Giving and gracefully accepting constructive feedback
* Accepting responsibility and apologizing to those affected by our mistakes,
  and learning from the experience
* Focusing on what is best not just for us as individuals, but for the overall
  community

Examples of unacceptable behavior include:

* The use of sexualized language or imagery, and sexual attention or advances of
  any kind
* Trolling, insulting or derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or email address,
  without their explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

## Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards of
acceptable behavior and will take appropriate and fair corrective action in
response to any behavior that they deem inappropriate, threatening, offensive,
or harmful.

Community leaders have the right and responsibility to remove, edit, or reject
comments, commits, code, wiki edits, issues, and other contributions that are
not aligned to this Code of Conduct, and will communicate reasons for moderation
decisions when appropriate.

## Scope

This Code of Conduct applies within all community spaces, and also applies when
an individual is officially representing the community in public spaces.
Examples of representing our community include using an official e-mail address,
posting via an official social media account, or acting as an appointed
representative at an online or offline event.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported to the community leaders responsible for enforcement at support@unsloth.ai.
All complaints will be reviewed and investigated promptly and fairly.

All community leaders are obligated to respect the privacy and security of the
reporter of any incident.

## Enforcement Guidelines

Community leaders will follow these Community Impact Guidelines in determining
the consequences for any action they deem in violation of this Code of Conduct:

### 1. Correction

**Community Impact**: Use of inappropriate language or other behavior deemed
unprofessional or unwelcome in the community.

**Consequence**: A private, written warning from community leaders, providing
clarity around the nature of the violation and an explanation of why the
behavior was inappropriate. A public apology may be requested.

### 2. Warning

**Community Impact**: A violation through a single incident or series of
actions.

**Consequence**: A warning with consequences for continued behavior. No
interaction with the people involved, including unsolicited interaction with
those enforcing the Code of Conduct, for a specified period of time. This
includes avoiding interactions in community spaces as well as external channels
like social media. Violating these terms may lead to a temporary or permanent
ban.

### 3. Temporary Ban

**Community Impact**: A serious violation of community standards, including
sustained inappropriate behavior.

**Consequence**: A temporary ban from any sort of interaction or public
communication with the community for a specified period of time. No public or
private interaction with the people involved, including unsolicited interaction
with those enforcing the Code of Conduct, is allowed during this period.
Violating these terms may lead to a permanent ban.

### 4. Permanent Ban

**Community Impact**: Demonstrating a pattern of violation of community
standards, including sustained inappropriate behavior, harassment of an
individual, or aggression toward or disparagement of classes of individuals.

**Consequence**: A permanent ban from any sort of public interaction within the
community.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage],
version 2.1, available at
[https://www.contributor-covenant.org/version/2/1/code_of_conduct.html][v2.1].

Community Impact Guidelines were inspired by
[Mozilla's code of conduct enforcement ladder][Mozilla CoC].

For answers to common questions about this code of conduct, see the FAQ at
[https://www.contributor-covenant.org/faq][FAQ]. Translations are available at
[https://www.contributor-covenant.org/translations][translations].

[homepage]: https://www.contributor-covenant.org
[v2.1]: https://www.contributor-covenant.org/version/2/1/code_of_conduct.html
[Mozilla CoC]: https://github.com/mozilla/diversity
[FAQ]: https://www.contributor-covenant.org/faq
[translations]: https://www.contributor-covenant.org/translations
```

### `CONTRIBUTING.md`
```
# 🦥 Contributing to Unsloth

Thank you for not only using Unsloth but also for being interested in helping out! We value all contributions, whether they come in the form of code, ideas, support for others or just by simply spreading the word of Unsloth! 💕

- **[Support the Community](https://github.com/unslothai/unsloth/issues)**: Answer questions, review pull requests, or assist others in discussions.
- **Fix Bugs**: Identify and resolve issues with the existing codebase.
- **Submit Ideas**: Request new features or share enhancements you'd like to see.
- **Develop Features**: Implement new functionality or improve existing tools which can be done via PRs.
- **[Improve Documentation](https://docs.unsloth.ai/)**: Help by creating guides, FAQs, or enhancing clarity.

One of the best ways to support us is by spreading the word about Unsloth! Share how it’s powering your amazing projects in blog posts or social media, and inspire others to explore its potential. Even a simple star on our repo goes a long way in showing your support and helping the community grow. 🌟

## Submitting Issues
If you find a bug or have a feature idea, we’d love to hear from you! Here’s how to make your submission stand out:

### Reporting Bugs
1. **Search First**: Check if the issue has already been reported using GitHub’s search bar under Issues.
2. **Details Matter**: Is this on Google Colab, Kaggle, or on another platform service? Are you using Unsloth's official notebook? Include your OS, Python version, and other relevant details. For bugs, a concise code snippet that reproduces the issue is incredibly helpful.
3. **Be Thorough**: Attach screenshots, traceback logs, or any additional information that might speed up resolution.

## Spread the Word
Your support extends beyond code:
- Spread the word by writing about Unsloth in blogs or social media.
- Share how Unsloth powers your projects.
- Star our repository to show your appreciation.

Finally, please be mindful of our [Code of Conduct](https://github.com/unslothai/unsloth/blob/main/CODE_OF_CONDUCT.md) to ensure a welcoming and inclusive environment for everyone.

Thank you so much for reading and we hope you have lots of fun using Unsloth! 🦥


## Pull Request Guidelines
- Keep PRs focused on a single change
- Include a concise description and motivation
- Link related issues when applicable
```

### `README.md`
```
<h1 align="center" style="margin:0;">
  <a href="https://unsloth.ai/docs"><picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/unslothai/unsloth/main/images/unsloth%20logo%20white%20text.png">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/unslothai/unsloth/main/images/unsloth%20logo%20black%20text.png">
    <img alt="Unsloth logo" src="https://raw.githubusercontent.com/unslothai/unsloth/main/images/unsloth%20logo%20black%20text.png" height="80" style="max-width:100%;">
  </picture></a>
</h1>
<h3 align="center" style="margin: 0; margin-top: 0;">
Unsloth Studio lets you run and train models locally.
</h3>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-install">Quickstart</a> •
  <a href="#-free-notebooks">Notebooks</a> •
  <a href="https://unsloth.ai/docs">Documentation</a>
</p>
<br>
<a href="https://unsloth.ai/docs/new/studio">
<img alt="unsloth studio ui homepage" src="https://github.com/user-attachments/assets/53ae17a9-d975-44ef-9686-efb4ebd0454d" style="max-width: 100%; margin-bottom: 0;"></a>

## ⚡ Get started

#### macOS, Linux, WSL:
```bash
curl -fsSL https://unsloth.ai/install.sh | sh
```
#### Windows:
```powershell
irm https://unsloth.ai/install.ps1 | iex
```
#### Community:

- [Discord](https://discord.gg/unsloth)
- [𝕏 (Twitter)](https://x.com/UnslothAI)
- [Reddit](https://reddit.com/r/unsloth)

## ⭐ Features
Unsloth Studio (Beta) lets you run and train text, [audio](https://unsloth.ai/docs/basics/text-to-speech-tts-fine-tuning), [embedding](https://unsloth.ai/docs/new/embedding-finetuning), [vision](https://unsloth.ai/docs/basics/vision-fine-tuning) models on Windows, Linux and macOS.

### Inference
* **Search + download + run models** including GGUF, LoRA adapters, safetensors
* **Export models**: [Save or export](https://unsloth.ai/docs/new/studio/export) models to GGUF, 16-bit safetensors and other formats.
* **Tool calling**: Support for [self-healing tool calling](https://unsloth.ai/docs/new/studio/chat#auto-healing-tool-calling) and web search
* **[Code execution](https://unsloth.ai/docs/new/studio/chat#code-execution)**: lets LLMs test code in Claude artifacts and sandbox environments
* **[API inference endpoint](https://unsloth.ai/docs/basics/api)**: Deploy and run local LLMs in Claude Code, Codex tools with Unsloth
* [Auto set inference settings](https://unsloth.ai/docs/new/studio/chat#auto-parameter-tuning) and customize chat templates.
* We work directly with teams behind [gpt-oss](https://docs.unsloth.ai/new/gpt-oss-how-to-run-and-fine-tune#unsloth-fixes-for-gpt-oss), [Qwen3](https://www.reddit.com/r/LocalLLaMA/comments/1kaodxu/qwen3_unsloth_dynamic_ggufs_128k_context_bug_fixes/), [Llama 4](https://github.com/ggml-org/llama.cpp/pull/12889), [Mistral](https://huggingface.co/mistralai/Mistral-Medium-3.5-128B/discussions/18), [Gemma 1-3](https://news.ycombinator.com/item?id=39671146), and [Phi-4](https://unsloth.ai/blog/phi4), where we’ve fixed bugs that improve model accuracy.
* Chat with images, audio, PDFs, code, DOCX and more. [Connect API providers](https://unsloth.ai/docs/integrations/connections) (OpenAI, Anthropic) or servers (vLLM, Ollama).
### Training
* Train and RL **500+ models** up to **2x faster** with up to **70% less VRAM**, with no accuracy loss.
* Custom Triton and mathematical **kernels**. See some collabs we did with [PyTorch](https://unsloth.ai/docs/get-started/reinforcement-learning-rl-guide/fp8-reinforcement-learning) and [Hugging Face](https://unsloth.ai/docs/new/faster-moe).
* **Data Recipes**: [Auto-create datasets](https://unsloth.ai/docs/new/studio/data-recipe) from **PDF, CSV, DOCX** etc. Edit data in a visual-node workflow.
* **[Reinforcement Learning](https://unsloth.ai/docs/get-started/reinforcement-learning-rl-guide)** (RL): The most efficient [RL](https://unsloth.ai/docs/get-started/reinforcement-learning-rl-guide) library, using **80% less VRAM** for GRPO, [FP8](https://unsloth.ai/docs/get-started/reinforcement-learning-rl-guide/fp8-reinforcement-learning) etc.
* Supports full fine-tuning, RL, pretraining, 4-bit, 16-bit and, FP8 training.
* **Observability**: Monitor training live, track loss and GPU usage and customize graphs.
* [Multi-GPU](https://unsloth.ai/docs/basics/multi-gpu-training-with-unsloth) training is supported, with major improvements coming soon.

## 📥 Install
Unsloth can be used in two ways: through **[Unsloth Studio](https://unsloth.ai/docs/new/studio/)**, the web UI, or through **Unsloth Core**, the code-based version. Each has different requirements.

### Unsloth Studio (web UI)
Unsloth Studio (Beta) works on **Windows, Linux, WSL** and **macOS**.

* **CPU:** Supported for Chat and Data Recipes currently
* **NVIDIA:** Training works on RTX 30/40/50, Blackwell, DGX Spark, Station and more
* **macOS:** Training, MLX and GGUF inference are ALL supported.
* **AMD:** Chat + Data works. Train with [Unsloth Core](#unsloth-core-code-based). Studio support is out soon.
* **Multi-GPU:** Available now, with a major upgrade on the way

#### macOS, Linux, WSL:
```bash
curl -fsSL https://unsloth.ai/install.sh | sh
```
Use the same command to update.

#### Windows:
```powershell
irm https://unsloth.ai/install.ps1 | iex
```
Use the same command to update.

#### Launch
```bash
unsloth studio -p 8888
```
For cloud or global access, add `-H 0.0.0.0`. By default, Unsloth is accessible only locally.

#### Docker
Use our [Docker image](https://hub.docker.com/r/unsloth/unsloth) ```unsloth/unsloth``` container. Run:
```bash
docker run -d -e JUPYTER_PASSWORD="mypassword" \
  -p 8888:8888 -p 8000:8000 -p 2222:22 \
  -v $(pwd)/work:/workspace/work \
  --gpus all \
  unsloth/unsloth
  ```

#### Developer, Nightly, Uninstall
To see developer, nightly and uninstallation etc. instructions, see [advanced installation](#-advanced-installation).

### Unsloth Core (code-based)
#### Linux, WSL:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv unsloth_env --python 3.13
source unsloth_env/bin/activate
uv pip install unsloth --torch-backend=auto
```
#### Windows:
```powershell
winget install -e --id Python.Python.3.13
winget install --id=astral-sh.uv  -e
uv venv unsloth_env --python 3.13
.\unsloth_env\Scripts\activate
uv pip install unsloth --torch-backend=auto
```
For Windows, `pip install unsloth` works only if you have PyTorch installed. Read our [Windows Guide](https://unsloth.ai/docs/get-started/install/windows-installation).
You can use the same Docker image as Unsloth Studio.

#### AMD, Intel:
For RTX 50x, B200, 6000 GPUs: `uv pip install unsloth --torch-backend=auto`. Read our guides for: [Blackwell](https://unsloth.ai/docs/blog/fine-tuning-llms-with-blackwell-rtx-50-series-and-unsloth) and [DGX Spark](https://unsloth.ai/docs/blog/fine-tuning-llms-with-nvidia-dgx-spark-and-unsloth). <br>
To install Unsloth on **AMD** and **Intel** GPUs, follow our [AMD Guide](https://unsloth.ai/docs/get-started/install/amd) and [Intel Guide](https://unsloth.ai/docs/get-started/install/intel).

## 📒 Free Notebooks

Train for free with our notebooks. You can use our new [free Unsloth Studio notebook](https://colab.research.google.com/github/unslothai/unsloth/blob/main/studio/Unsloth_Studio_Colab.ipynb) to run and train models for free in a web UI.
Read our [guide](https://unsloth.ai/docs/get-started/fine-tuning-llms-guide). Add dataset, run, then deploy your trained model.

| Model | Free Notebooks | Performance | Memory use |
|-----------|---------|--------|----------|
| **Gemma 4 (E2B)**      | [▶️ Start for free](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Gemma4_(E2B)-Vision.ipynb)               | 1.5x faster | 50% less |
| **Qwen3.5 (4B)**      | [▶️ Start for free](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_5_(4B)_Vision.ipynb)               | 1.5x faster | 60% less |
| **gpt-oss (20B)**      | [▶️ Start for free](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-(20B)-Fine-tuning.ipynb)               | 2x faster | 70% less |
| **Qwen3.5 GSPO**      | [▶️ Start for free](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_5_(4B)_Vision_GRPO.ipynb)               | 2x faster | 70% less |
| **gpt-oss (20B): GRPO**      | [▶️ Start for free](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/gpt-oss-(20B)-GRPO.ipynb)               | 2x faster | 80% less |
| **Qwen3: Advanced GRPO**      | [▶️ Start for free](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Qwen3_(4B)-GRPO.ipynb)               | 2x faster | 70% less |
| **embeddinggemma (300M)**    | [▶️ Start for free](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/EmbeddingGemma_(300M).ipynb)               | 2x faster | 20% less |
| **Mistral Ministral 3 (3B)**      | [▶️ Start for free](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Ministral_3_VL_(3B)_Vision.ipynb)               | 1.5x faster | 60% less |
| **Llama 3.1 (8B) Alpaca**      | [▶️ Start for free](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.1_(8B)-Alpaca.ipynb)               | 2x faster | 70% less |
| **Llama 3.2 Conversational**      | [▶️ Start for free](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Llama3.2_(1B_and_3B)-Conversational.ipynb)               | 2x faster | 70% less |
| **Orpheus-TTS (3B)**     | [▶️ Start for free](https://colab.research.google.com/github/unslothai/notebooks/blob/main/nb/Orpheus_(3B)-TTS.ipynb)               | 1.5x faster | 50% less |

- See all our notebooks for: [Kaggle](https://github.com/unslothai/notebooks?tab=readme-ov-file#-kaggle-notebooks), [GRPO](https://unsloth.ai/docs/get-started/unsloth-notebooks#grpo-reasoning-rl-notebooks), [TTS](https://unsloth.ai/docs/get-started/unsloth-notebooks#text-to-speech-tts-notebooks), [embedding](https://unsloth.ai/docs/new/embedding-finetuning) & [Vision](https://unsloth.ai/docs/get-started/unsloth-notebooks#vision-multimodal-notebooks)
- See [all our models](https://unsloth.ai/docs/get-started/unsloth-model-catalog) and [all our notebooks](https://unsloth.ai/docs/get-started/unsloth-notebooks)
- See detailed documentation for Unsloth [here](https://unsloth.ai/docs)

## 🦥 Unsloth News
- **Connections**: Connect any API provider (OpenAI, Anthropic) or server (vLLM, Ollama). [Guide](https://unsloth.ai/docs/integrations/connections)
- **MTP**: Run Qwen3.6 MTP in Unsloth. MTP settings are autoset specific to your hardware. [Guide](https://unsloth.ai/docs/models/qwen3.6#mtp-guide)
- **API inference endpoint**: Deploy and run local LLMs in Claude Code, Codex tools. [Guide](https://unsloth.ai/docs/basics/api)
- **Qwen3.6**: Qwen3.6-35B-A3B can now be trained and run in Unsloth Studio. [Blog](https://unsloth.ai/docs/models/qwen3.6)
- **Gemma 4**: Run and train Google’s new models directly in Unsloth. [Blog](https://unsloth.ai/docs/models/gemma-4)
- **Introducing Unsloth Studio**: our new web UI for running and training LLMs. [Blog](https://unsloth.ai/docs/new/studio)
- **Qwen3.5** - 0.8B, 2B, 4B, 9B, 27B, 35-A3B, 112B-A10B are now supported. [Guide + notebooks](https://unsloth.ai/docs/models/qwen3.5/fine-tune)
- Train **MoE LLMs 12x faster** with 35% less VRAM - DeepSeek, GLM, Qwen and gpt-oss. [Blog](https://unsloth.ai/docs/new/faster-moe)
- **Embedding models**: Unsloth now supports ~1.8-3.3x faster embedding fine-tuning. [Blog](https://unsloth.ai/docs/new/embedding-finetuning) • [Notebooks](https://unsloth.ai/docs/get-started/unsloth-notebooks#embedding-models)
- New **7x longer context RL** vs. all other setups, via our new batching algorithms. [Blog](https://unsloth.ai/docs/new/grpo-long-context)
- New RoPE & MLP **Triton Kernels** & **Padding Free + Packing**: 3x faster training & 30% less VRAM. [Blog](https://unsloth.ai/docs/new/3x-faster-training-packing)
- **500K Context**: Training a 20B model with >500K context is now possible on an 80GB GPU. [Blog](https://unsloth.ai/docs/blog/500k-context-length-fine-tuning)
- **FP8 & Vision RL**: You can now do FP8 & VLM GRPO on consumer GPUs. [FP8 Blog](https://unsloth.ai/docs/get-started/reinforcement-learning-rl-guide/fp8-reinforcement-learning) • [Vision RL](https://unsloth.ai/docs/get-started/reinforcement-learning-rl-guide/vision-reinforcement-learning-vlm-rl)

## 📥 Advanced Installation
The below advanced instructions are for Unsloth Studio. For Unsloth Core advanced installation, [view our docs](https://unsloth.ai/docs/get-started/install/pip-install#advanced-pip-installation).
#### Developer installs: macOS, Linux, WSL:
```bash
git clone https://github.com/unslothai/unsloth
cd unsloth
./install.sh --local
unsloth studio -p 8888
```
Then to update :
```bash
cd unsloth && git pull
./install.sh --local
unsloth studio -p 8888
```

#### Developer installs: Windows PowerShell:
```powershell
git clone https://github.com/unslothai/unsloth.git
cd unsloth
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\install.ps1 --local
unsloth studio -p 8888
```
Then to update :
```bash
cd unsloth && git pull
./install.sh --local
unsloth studio -p 8888
```

#### Nightly: MacOS, Linux, WSL:
```bash
git clone https://github.com/unslothai/unsloth
cd unsloth
git checkout nightly
./install.sh --local
unsloth studio -p 8888
```
Then to launch every time:
```bash
unsloth studio -p 8888
```

#### Nightly: Windows:
Run in Windows Powershell:
```powershell
git clone https://github.com/unslothai/unsloth.git
cd unsloth
git checkout nightly
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\install.ps1 --local
unsloth studio -p 8888
```
Then to launch every time:
```bash
unsloth studio -p 8888
```

#### Advanced launch options
Installer options can be passed as environment variables. On macOS, Linux and WSL place the variable after the pipe so the shell passes it to `sh`; on Windows set it with `$env:` before piping to `iex`.

Skip PyTorch (GGUF-only mode):
```bash
curl -fsSL https://unsloth.ai/install.sh | UNSLOTH_NO_TORCH=1 sh
```
```powershell
$env:UNSLOTH_NO_TORCH=1; irm https://unsloth.ai/install.ps1 | iex
```

Pin the Python version:
```bash
curl -fsSL https://unsloth.ai/install.sh | UNSLOTH_PYTHON=3.12 sh
```
```powershell
$env:UNSLOTH_PYTHON='3.12'; irm https://unsloth.ai/install.ps1 | iex
```

Install to a custom location with `UNSLOTH_STUDIO_HOME`:
```bash
curl -fsSL https://unsloth.ai/install.sh | UNSLOTH_STUDIO_HOME=/abs/path sh
```
```powershell
$env:UNSLOTH_STUDIO_HOME='C:\path'; irm https://unsloth.ai/install.ps1 | iex
```

Cap Studio's native CPU thread pools on high-core hosts: `UNSLOTH_CPU_THREADS=8 unsloth studio -p 8888`.

#### Uninstall
The recommended way to fully remove Unsloth Studio is the matching uninstall script for your OS. It stops any running servers, removes the install dir, the launcher data dir, the desktop shortcut, and any platform-specific entries (macOS `.app` bundle + Launch Services on Mac; Start Menu, `HKCU\Software\Unsloth` registry key and user `PATH` entries on Windows):

* ​ **MacOS, WSL, Linux:** `curl -fsSL https://raw.githubusercontent.com/unslothai/unsloth/main/scripts/uninstall.sh | sh`
* ​ **Windows (PowerShell):** `irm https://raw.githubusercontent.com/unslothai/unsloth/main/scripts/uninstall.ps1 | iex`

If you only want to drop the install dir and keep the launcher/shortcut for a later reinstall, you can instead run `rm -rf ~/.unsloth/studio` (Mac/Linux/WSL) or `Remove-Item -Recurse -Force "$HOME\.unsloth\studio"` (Windows). The model cache at `~/.cache/huggingface` is not touched by any of these.

For more info, [see our docs](https://unsloth.ai/docs/new/studio/install#uninstall).

#### Deleting model files

You can delete old model files either from the bin icon in model search or by removing the relevant cached model folder from the default Hugging Face cache directory. By default, HF uses:

* ​ **MacOS, Linux, WSL:** `~/.cache/huggingface/hub/`
* ​ **Windows:** `%USERPROFILE%\.cache\huggingface\hub\`

## 💚 Community and Links
| Type                                                                                                                                      | Links                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| <img width="16" src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/66e3d80db9971f10a9757c99_Symbol.svg" />  **Discord**                       | [Join Discord server](https://discord.com/invite/unsloth)                          |
| <img width="15" src="https://redditinc.com/hs-fs/hubfs/Reddit%20Inc/Brand/Reddit_Logo.png" />  **r/unsloth Reddit**                       | [Join Reddit community](https://reddit.com/r/unsloth)                          |
| 📚 **Documentation & Wiki**                                                                                                               | [Read Our Docs](https://unsloth.ai/docs)                                       |
| <img width="13" src="https://upload.wikimedia.org/wikipedia/commons/0/09/X_(formerly_Twitter)_logo_late_2025.svg" />  **Twitter (aka X)** | [Follow us on X](https://twitter.com/unslothai)                                |
| 🔮 **Our Models**                                                                                                                         | [Unsloth Catalog](https://unsloth.ai/docs/get-started/unsloth-model-catalog)   |
| ✍️ **Blog**                                                                                                                               | [Read our Blogs](https://unsloth.ai/blog)                                      |

### Citation

You can cite the Unsloth repo as follows:
```bibtex
@software{unsloth,
  author = {Daniel Han, Michael Han and Unsloth team},
  title = {Unsloth},
  url = {https://github.com/unslothai/unsloth},
  year = {2023}
}
```
If you trained a model with 🦥Unsloth, you can use this cool sticker!   <img src="https://raw.githubusercontent.com/unslothai/unsloth/main/images/made with unsloth.png" width="200" align="center" />

### License
Unsloth uses a dual-licensing model of Apache 2.0 and AGPL-3.0. The core Unsloth package remains licensed under **[Apache 2.0](https://github.com/unslothai/unsloth?tab=Apache-2.0-1-ov-file)**, while certain optional components, such as the Unsloth Studio UI are licensed under the open-source license **[AGPL-3.0](https://github.com/unslothai/unsloth?tab=AGPL-3.0-2-ov-file)**.

This structure helps support ongoing Unsloth development while keeping the project open source and enabling the broader ecosystem to continue growing.

### Thank You to
- The [llama.cpp library](https://github.com/ggml-org/llama.cpp) that lets users run and save models with Unsloth
- The Hugging Face team and their libraries: [transformers](https://github.com/huggingface/transformers) and [TRL](https://github.com/huggingface/trl)
- The Pytorch and [Torch AO](https://github.com/unslothai/unsloth/pull/3391) team for their contributions
- NVIDIA for their [NeMo DataDesigner](https://github.com/NVIDIA-NeMo/DataDesigner) library and their contributions

... [TRUNCATED] ...
```

### `unsloth-cli.py`
```
#!/usr/bin/env python3

"""
🦥 Starter Script for Fine-Tuning FastLanguageModel with Unsloth

Configurable options for model loading, PEFT, training, and saving/pushing.
Customize the dataset loading/preprocessing and the save/push config for your case.

Usage (most options have sensible defaults; this is an extended example):
    python unsloth-cli.py --model_name "unsloth/llama-3-8b" --max_seq_length 8192 --dtype None --load_in_4bit \
    --r 64 --lora_alpha 32 --lora_dropout 0.1 --bias "none" --use_gradient_checkpointing "unsloth" \
    --random_state 3407 --use_rslora --per_device_train_batch_size 4 --gradient_accumulation_steps 8 \
    --warmup_steps 5 --max_steps 400 --learning_rate 2e-6 --logging_steps 1 --optim "adamw_8bit" \
    --weight_decay 0.005 --lr_scheduler_type "linear" --seed 3407 --output_dir "outputs" \
    --report_to "tensorboard" --save_model --save_path "model" --quantization_method "f16" \
    --push_model --hub_path "hf/model" --hub_token "your_hf_token"

Run `python unsloth-cli.py --help` for the full list of options.
"""

import argparse
import os


def run(args):
    from unsloth import FastLanguageModel
    from datasets import load_dataset
    from transformers.utils import strtobool
    from trl import SFTTrainer, SFTConfig
    from unsloth import is_bfloat16_supported
    from unsloth.models.loader_utils import prepare_device_map
    import logging
    from unsloth import RawTextDataLoader

    logging.getLogger("hf-to-gguf").setLevel(logging.WARNING)

    # Load model and tokenizer
    device_map, distributed = prepare_device_map()
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name = args.model_name,
        max_seq_length = args.max_seq_length,
        dtype = args.dtype,
        load_in_4bit = args.load_in_4bit,
        device_map = device_map,
    )

    # Configure PEFT model
    model = FastLanguageModel.get_peft_model(
        model,
        r = args.r,
        target_modules = [
            "q_proj",
            "k_proj",
            "v_proj",
            "o_proj",
            "gate_proj",
            "up_proj",
            "down_proj",
        ],
        lora_alpha = args.lora_alpha,
        lora_dropout = args.lora_dropout,
        bias = args.bias,
        use_gradient_checkpointing = args.use_gradient_checkpointing,
        random_state = args.random_state,
        use_rslora = args.use_rslora,
        loftq_config = args.loftq_config,
    )

    alpaca_prompt = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

    ### Instruction:
    {}

    ### Input:
    {}

    ### Response:
    {}"""

    EOS_TOKEN = tokenizer.eos_token  # Must add EOS_TOKEN

    def formatting_prompts_func(examples):
        instructions = examples["instruction"]
        inputs = examples["input"]
        outputs = examples["output"]
        texts = []
        for instruction, input, output in zip(instructions, inputs, outputs):
            text = alpaca_prompt.format(instruction, input, output) + EOS_TOKEN
            texts.append(text)
        return {"text": texts}

    def load_dataset_smart(args):
        from transformers.utils import strtobool
        if args.raw_text_file:
            loader = RawTextDataLoader(tokenizer, args.chunk_size, args.stride)
            dataset = loader.load_from_file(args.raw_text_file)
        elif args.dataset.endswith((".txt", ".md", ".json", ".jsonl")):
            # Auto-detect local raw text files
            loader = RawTextDataLoader(tokenizer)
            dataset = loader.load_from_file(args.dataset)
        else:
            use_modelscope = strtobool(os.environ.get("UNSLOTH_USE_MODELSCOPE", "False"))
            if use_modelscope:
                from modelscope import MsDataset
                dataset = MsDataset.load(args.dataset, split = "train")
            else:
                dataset = load_dataset(args.dataset, split = "train")

            # Format structured datasets
            dataset = dataset.map(formatting_prompts_func, batched = True)
        return dataset

    # Load dataset using smart loader
    dataset = load_dataset_smart(args)
    print("Data is formatted and ready!")

    # Configure training arguments
    training_args = SFTConfig(
        per_device_train_batch_size = args.per_device_train_batch_size,
        per_device_eval_batch_size = args.per_device_eval_batch_size,
        gradient_accumulation_steps = args.gradient_accumulation_steps,
        warmup_steps = args.warmup_steps,
        max_steps = args.max_steps,
        learning_rate = args.learning_rate,
        fp16 = not is_bfloat16_supported(),
        bf16 = is_bfloat16_supported(),
        logging_steps = args.logging_steps,
        optim = args.optim,
        weight_decay = args.weight_decay,
        lr_scheduler_type = args.lr_scheduler_type,
        seed = args.seed,
        output_dir = args.output_dir,
        report_to = args.report_to,
        max_length = args.max_seq_length,
        dataset_num_proc = 2,
        ddp_find_unused_parameters = False if distributed else None,
        packing = args.packing,
    )

    # Initialize trainer
    trainer = SFTTrainer(
        model = model,
        processing_class = tokenizer,
        train_dataset = dataset,
        args = training_args,
    )

    trainer.train()

    # Save model
    if args.save_model:
        # If args.quantization is a list, save once per quantization method
        if args.save_gguf:
            if isinstance(args.quantization, list):
                for quantization_method in args.quantization:
                    print(f"Saving model with quantization method: {quantization_method}")
                    model.save_pretrained_gguf(
                        args.save_path,
                        tokenizer,
                        quantization_method = quantization_method,
                    )
                    if args.push_model:
                        model.push_to_hub_gguf(
                            hub_path = args.hub_path,
                            hub_token = args.hub_token,
                            quantization_method = quantization_method,
                        )
            else:
                print(f"Saving model with quantization method: {args.quantization}")
                model.save_pretrained_gguf(
                    args.save_path,
                    tokenizer,
                    quantization_method = args.quantization,
                )
                if args.push_model:
                    model.push_to_hub_gguf(
                        hub_path = args.hub_path,
                        hub_token = args.hub_token,
                        quantization_method = args.quantization,
                    )
        else:
            model.save_pretrained_merged(args.save_path, tokenizer, args.save_method)
            if args.push_model:
                model.push_to_hub_merged(args.save_path, tokenizer, args.hub_token)
    else:
        print("Warning: The model is not saved!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description = "🦥 Fine-tune your llm faster using unsloth!")

    model_group = parser.add_argument_group("🤖 Model Options")
    model_group.add_argument(
        "--model_name",
        type = str,
        default = "unsloth/llama-3-8b",
        help = "Model name to load",
    )
    model_group.add_argument(
        "--max_seq_length",
        type = int,
        default = 2048,
        help = "Maximum sequence length, default is 2048. We auto support RoPE Scaling internally!",
    )
    model_group.add_argument(
        "--dtype",
        type = str,
        default = None,
        help = "Data type for model (None for auto detection)",
    )
    model_group.add_argument(
        "--load_in_4bit",
        action = "store_true",
        help = "Use 4bit quantization to reduce memory usage",
    )
    model_group.add_argument(
        "--dataset",
        type = str,
        default = "yahma/alpaca-cleaned",
        help = "Huggingface dataset to use for training",
    )

    lora_group = parser.add_argument_group(
        "🧠 LoRA Options",
        "These options are used to configure the LoRA model.",
    )
    lora_group.add_argument(
        "--r",
        type = int,
        default = 16,
        help = "Rank for Lora model, default is 16.  (common values: 8, 16, 32, 64, 128)",
    )
    lora_group.add_argument(
        "--lora_alpha",
        type = int,
        default = 16,
        help = "LoRA alpha parameter, default is 16. (common values: 8, 16, 32, 64, 128)",
    )
    lora_group.add_argument(
        "--lora_dropout",
        type = float,
        default = 0.0,
        help = "LoRA dropout rate, default is 0.0 which is optimized.",
    )
    lora_group.add_argument(
        "--bias",
        type = str,
        default = "none",
        help = "Bias setting for LoRA",
    )
    lora_group.add_argument(
        "--use_gradient_checkpointing",
        type = str,
        default = "unsloth",
        help = "Use gradient checkpointing",
    )
    lora_group.add_argument(
        "--random_state",
        type = int,
        default = 3407,
        help = "Random state for reproducibility, default is 3407.",
    )
    lora_group.add_argument(
        "--use_rslora",
        action = "store_true",
        help = "Use rank stabilized LoRA",
    )
    lora_group.add_argument(
        "--loftq_config",
        type = str,
        default = None,
        help = "Configuration for LoftQ",
    )

    training_group = parser.add_argument_group("🎓 Training Options")
    training_group.add_argument(
        "--per_device_train_batch_size",
        type = int,
        default = 2,
        help = "Batch size per device during training, default is 2.",
    )
    training_group.add_argument(
        "--per_device_eval_batch_size",
        type = int,
        default = 4,
        help = "Batch size per device during evaluation, default is 4.",
    )
    training_group.add_argument(
        "--gradient_accumulation_steps",
        type = int,
        default = 4,
        help = "Number of gradient accumulation steps, default is 4.",
    )
    training_group.add_argument(
        "--warmup_steps",
        type = int,
        default = 5,
        help = "Number of warmup steps, default is 5.",
    )
    training_group.add_argument(

... [TRUNCATED] ...
```

### `.github\ISSUE_TEMPLATE\bug---issue.md`
```
---
name: Bug / Issue
about: Bug / Issue
title: "[Bug] Please fill in your issue title here."
labels: bug
assignees: ''

---
Note: Please do not remove the questions. Answer beside them.
1. Did you update? `pip install --upgrade unsloth unsloth_zoo`
2. `Colab` or `Kaggle` or local / cloud
3. Number GPUs used, use `nvidia-smi`
4. Which notebook? Please link!
5. Which Unsloth version, TRL version, transformers version, PyTorch version?
6. Which trainer? `SFTTrainer`, `GRPOTrainer` etc

```python
Put Minimal code to reproduce error here ###Remove Hugging Face token###
###Please make sure to check formatting properly, edit if needed.###
```

🦥 You can also ask via our Reddit page: https://reddit.com/r/unsloth/
```

### `.github\ISSUE_TEMPLATE\feature-request.md`
```
---
name: Feature Request
about: New features, model support, ideas
title: "[Feature]"
labels: feature request
assignees: ''

---

For new models, have you tried:
```python
from unsloth import FastModel
model, tokenizer = FastModel.from_pretrained(
    "microsoft/Phi-4-multimodal-instruct",
    trust_remote_code = True,
)
from transformers import AutoModelForSequenceClassification
model, tokenizer = FastModel.from_pretrained(
    auto_model = AutoModelForSequenceClassification,
)
```
```

### `scripts\check_frontend_dep_removal.py`
```
#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-only
# Copyright 2026-present the Unsloth AI Inc. team. All rights reserved.
"""Guard against breaking npm dependency removals in studio/frontend.

Diffs the current package.json against a git base, finds every package
that was removed, and confirms each is no longer referenced anywhere
in the repo. If a removed package is still imported and is not
transitively resolvable through the new lockfile, exits non-zero with
file:line citations.

Usage:
  python scripts/check_frontend_dep_removal.py
  python scripts/check_frontend_dep_removal.py --base origin/main
  python scripts/check_frontend_dep_removal.py --base HEAD~1
  python scripts/check_frontend_dep_removal.py --base-pkg PATH --head-lock PATH

Exit codes:
  0  every removed dep is safe (no source refs or still resolvable)
  1  at least one removed dep is referenced and not resolvable
  2  invocation error (bad args, missing file, git error)
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_PKG = "studio/frontend/package.json"
FRONTEND_LOCK = "studio/frontend/package-lock.json"

DEP_FIELDS = (
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
)

# Files where seeing a package name does NOT count as usage.
EXPECTED_NOISE_FILES = {
    "studio/frontend/package.json",
    "studio/frontend/package-lock.json",
    "studio/backend/core/data_recipe/oxc-validator/package.json",
    "studio/backend/core/data_recipe/oxc-validator/package-lock.json",
}

# File types where a quoted string can be a module specifier.
JS_LIKE_EXT = re.compile(r"\.(ts|tsx|js|jsx|mjs|cjs|html|htm|css|scss|sass|json|jsonc)$")
# Files where JS import patterns could be a real module reference (.mdx is
# real ESM; .md code fences are not).
SCRIPT_LIKE_EXT = re.compile(r"\.(ts|tsx|js|jsx|mjs|cjs|mdx)$")
STYLE_EXT = re.compile(r"\.(css|scss|sass)$")
HTML_EXT = re.compile(r"\.(html|htm)$")
TS_LIKE_EXT = re.compile(r"\.(ts|tsx|mts|cts|mdx)$")
# Files where a removed package's CLI binary could be invoked.
COMMAND_LIKE_EXT = re.compile(r"(\.(ya?ml|sh|ps1|bat)$|(^|/)Dockerfile[^/]*$)")

GREP_INCLUDES = [
    "--include=*.ts",
    "--include=*.tsx",
    "--include=*.js",
    "--include=*.jsx",
    "--include=*.mjs",
    "--include=*.cjs",
    "--include=*.html",
    "--include=*.htm",
    "--include=*.css",
    "--include=*.scss",
    "--include=*.sass",
    "--include=*.json",
    "--include=*.jsonc",
    "--include=*.md",
    "--include=*.mdx",
    "--include=*.py",
    "--include=*.rs",
    "--include=*.toml",
    "--include=*.yml",
    "--include=*.yaml",
    "--include=*.sh",
    "--include=*.ps1",
    "--include=*.bat",
    "--include=Dockerfile*",
]
GREP_EXCLUDES = [
    "--exclude-dir=node_modules",
    "--exclude-dir=dist",
    "--exclude-dir=.git",
    "--exclude-dir=__pycache__",
    "--exclude-dir=target",
    "--exclude-dir=.next",
    "--exclude-dir=build",
    "--exclude-dir=.venv",
    "--exclude-dir=venv",
]

# A pip-installed playwright ref is the PyPI package, not npm.
PIP_PLAYWRIGHT = re.compile(
    r"(pip\s+install\s+['\"]?playwright"
    r"|python\s+-m\s+playwright"
    r"|from\s+playwright"
    r"|^\s*import\s+playwright)"
)


@dataclass
class Hit:
    file: str
    line: int
    kind: str
    snippet: str


def run(cmd: list[str], cwd: Path | None = None) -> str:
    """Run a command, return stdout. On non-zero exit, return ''."""
    res = subprocess.run(
        cmd,
        cwd = cwd or REPO_ROOT,
        stdout = subprocess.PIPE,
        stderr = subprocess.PIPE,
        text = True,
    )
    return res.stdout if res.returncode == 0 else ""


def read_pkg_at(base: str, path: str) -> dict:
    """Read JSON at `base:path` via git show. Empty dict if missing."""
    out = run(["git", "show", f"{base}:{path}"])
    if not out.strip():
        return {}
    return json.loads(out)


def read_pkg_file(path: Path) -> dict:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding = "utf-8"))


def all_decl_names(pkg: dict) -> set[str]:
    names: set[str] = set()
    for field in DEP_FIELDS:
        names.update((pkg.get(field) or {}).keys())
    return names


def _resolve_install_path(parent_path: str, name: str, pkgs: dict) -> str | None:
    """Walk up the nested node_modules chain from `parent_path` to find where
    `name` resolves, mirroring Node module resolution."""
    parts = parent_path.split("/node_modules/")
    for i in range(len(parts), 0, -1):
        prefix = "/node_modules/".join(parts[:i])
        trial = (prefix + "/node_modules/" if prefix else "node_modules/") + name
        if trial in pkgs:
            return trial
    if f"node_modules/{name}" in pkgs:
        return f"node_modules/{name}"
    return None


def _deps_of(meta: dict) -> dict:
    """Deps npm actually installs. Optional peers are skipped: they can't keep
    a removed top-level dep reachable on their own."""
    out = {}
    for field in ("dependencies", "optionalDependencies"):
        out.update(meta.get(field) or {})
    peer_meta = meta.get("peerDependenciesMeta") or {}
    for name, spec in (meta.get("peerDependencies") or {}).items():
        if (peer_meta.get(name) or {}).get("optional"):
            continue
        out[name] = spec
    return out


def reachable_from_head(head_pkg: dict, lock: dict) -> set[str]:
    """BFS the lockfile dep graph from `head_pkg`'s top-level deps. Returns the
    surviving install paths, excluding stale (orphaned) lockfile entries."""
    pkgs = lock.get("packages", {})
    if not pkgs:
        return set()
    roots = all_decl_names(head_pkg)
    seen: set[str] = set()
    frontier: list[str] = []
    for name in roots:
        p = _resolve_install_path("", name, pkgs)
        if p:
            frontier.append(p)
    while frontier:
        path = frontier.pop()
        if path in seen:
            continue
        seen.add(path)
        meta = pkgs.get(path, {})
        for dep_name in _deps_of(meta):
            p = _resolve_install_path(path, dep_name, pkgs)
            if p and p not in seen:
                frontier.append(p)
    return seen


def classify(pkg: str, file: str, content: str) -> str | None:
    """Return why `content` references `pkg`, or None.

    `content` may span multiple lines (multi-line imports/exports use re.DOTALL).
    Bare-spec regexes word-boundary the package name so `foobar` doesn't match
    `foo`. File-type gating restricts JS patterns to .ts/.tsx/.js/.jsx/.mjs/
    .cjs/.mdx, CSS to .css/.scss/.sass, HTML to .html/.htm, so a snippet inside
    a Python fixture or Markdown code block isn't mistaken for real npm usage.
    """
    if file in EXPECTED_NOISE_FILES:
        return None

    esc = re.escape(pkg)
    # Subpath gate: pkg must be followed by quote, `/`, or end-of-string.
    sub = r"(?:/[^'\"`]*)?"

    flags_dotall = re.DOTALL | re.MULTILINE

    is_script = bool(SCRIPT_LIKE_EXT.search(file))
    is_style = bool(STYLE_EXT.search(file))
    is_html = bool(HTML_EXT.search(file))
    is_ts = bool(TS_LIKE_EXT.search(file))

    # Gate out Python fixtures, Markdown code blocks, shell snippets, etc.
    is_json = file.endswith(".json") or file.endswith(".jsonc")
    if not (is_script or is_style or is_html or is_json):
        return None

    # CSS @import first so it doesn't collide with side-effect-import below.
    if is_style and re.search(rf"@import\s+['\"]{esc}{sub}['\"]", content):
        return "css_import"
    # Static imports, including multi-line `import { ... } from "pkg"`.
    if is_script and re.search(
        rf"(?<!@)\bimport\b[^;'\"]*?\bfrom\s+['\"]{esc}{sub}['\"]",
        content,
        flags_dotall,
    ):
        return "static_import"
    # Side-effect import `import "pkg"` (no `from`); lookbehind rules out @import.
    if is_script and re.search(rf"(?<!@)\bimport\s+['\"]{esc}{sub}['\"]", content):
        return "side_effect_import"
    # Dynamic import: `import("pkg")` and `await import("pkg")`.
    if is_script and re.search(rf"\bimport\(\s*['\"]{esc}{sub}['\"]\s*\)", content):
        return "dynamic_import"
    # require / require.resolve
    if is_script and re.search(rf"\brequire(?:\.resolve)?\(\s*['\"]{esc}{sub}['\"]\s*\)", content):
        return "require"
    # Re-exports: `export * from`, `export { x } from`, `export type { Foo } from`.
    if is_script and re.search(
        rf"\bexport\b[^;'\"]*?\bfrom\s+['\"]{esc}{sub}['\"]",
        content,
        flags_dotall,
    ):
        return "re_export"
    # HTML script / link. Match pkg as a complete path segment so
    # `/node_modules/foo-extra/...` is not treated as usage of `foo`.
    html_pkg = rf"{esc}(?:/[^'\"#?]*)?(?=['\"#?])"
    if is_html and re.search(rf"<script[^>]*src\s*=\s*['\"][^'\"]*/{html_pkg}", content):
        return "html_script"
    if is_html and re.search(rf"<link[^>]*href\s*=\s*['\"][^'\"]*/{html_pkg}", content):
        return "html_link"
    # TypeScript triple-slash
    if is_ts and re.search(rf"///\s*<reference\s+types\s*=\s*['\"]{esc}{sub}['\"]", content):
        return "tsc_triple_slash"
    # new URL("pkg/...", import.meta.url)
    if is_script and re.search(rf"\bnew\s+URL\(\s*['\"]{esc}{sub}['\"]", content):
        return "new_url"
    # CSS url(...), quoted and unquoted, bounded so `pkg-extra` doesn't match.
    if is_style and re.search(
        rf"\burl\(\s*['\"]?(?:[^)'\"\s]+/)?{esc}(?:/[^)'\"`]*)?['\"]?\s*\)",
        content,
    ):
        return "css_url"
    # Template literal containing the package as the leading specifier
    if is_script and re.search(rf"`{esc}{sub}`", content):
        return "template_literal"
    # JSDoc / TS @import comment: `@import("pkg")`
    if is_script and re.search(rf"@import\(\s*['\"]{esc}{sub}['\"]\s*\)", content):
        return "jsdoc_import"
    # Bare quoted-string fallback (config plugin lists, vite aliases,
    # tsconfig paths, biome plugin arrays, shadcn registries).
    if not JS_LIKE_EXT.search(file):
        return None
    # pkg must be followed by `'`, `"`, or `/` so `foo` doesn't match `foobar`.
    if re.search(rf"['\"]{esc}(?:['\"]|/)", content):
        return "string_literal"
    return None


def lockfile_root_sync(head_pkg: dict, head_lock: dict) -> list[str]:
    """Warn if package-lock.json's <root> dep map disagrees with package.json
    (i.e. npm install was not re-run)."""
    warnings = []
    if not head_lock:

... [TRUNCATED] ...
```

### `scripts\check_new_install_scripts.py`
```
#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-only
# Copyright 2026-present the Unsloth AI Inc. team. All rights reserved.

"""Diff two `package-lock.json` files and flag NEW install-script deps.

A `"hasInstallScript": true` package runs preinstall/install/postinstall
hooks on every `npm ci` -- the lever behind recent npm supply-chain
compromises (attacker publishes a malicious version of a trusted dep).
This refuses to land a newly-introduced install-script dep without a
maintainer eyeball; pre-existing ones are not re-flagged.

Supports lockfileVersion 1 (recursive `dependencies`) and 2/3 (flat
`packages` with `node_modules/.../node_modules/...` nesting). For each
new entry we best-effort fetch the registry metadata to recover the
postinstall command body; the finding is still emitted if unreachable.

Exit codes: 0 = none; 1 = one or more (on stderr); 2 = internal error.
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

REGISTRY_BASE = "https://registry.npmjs.org/"
REGISTRY_TIMEOUT_SECS = 5

CRITICAL = "CRITICAL"
HIGH = "HIGH"


class Finding:
    __slots__ = ("severity", "name", "version", "kind", "detail")

    def __init__(self, severity: str, name: str, version: str, kind: str, detail: str) -> None:
        self.severity = severity
        self.name = name
        self.version = version
        self.kind = kind
        self.detail = detail

    def __str__(self) -> str:
        return (
            f"  [{self.severity}] {self.name}@{self.version}\n"
            f"    kind:   {self.kind}\n"
            f"    detail: {self.detail}"
        )


# Lockfile parsing.


def _strip_nm_prefix(key: str) -> str:
    """Convert a v2/v3 `packages` key into a bare package name (leaf after last `node_modules/`)."""
    if not key:
        return ""
    # LAST node_modules/ segment so transitives map to their leaf name.
    marker = "node_modules/"
    idx = key.rfind(marker)
    if idx == -1:
        return key
    return key[idx + len(marker) :]


def _collect_install_script_entries(lock: dict) -> dict[str, str]:
    """Return {name@version: name} for entries with hasInstallScript (v2/v3) or a lifecycle script (v1).

    Keyed by name@version so dup copies at different versions aren't lost.
    """
    seen: dict[str, str] = {}
    version = lock.get("lockfileVersion")

    # v2 / v3: flat `packages` map.
    packages = lock.get("packages") or {}
    for key, entry in packages.items():
        if key == "" or not isinstance(entry, dict):
            continue
        if entry.get("link"):
            continue
        if not entry.get("hasInstallScript"):
            continue
        name = _strip_nm_prefix(key)
        if not name:
            continue
        ver = entry.get("version") or "<unversioned>"
        seen[f"{name}@{ver}"] = name

    # v1 has no hasInstallScript flag; detect lifecycle scripts directly.
    def _walk_v1(deps: dict, depth: int = 0) -> None:
        if depth > 64 or not isinstance(deps, dict):
            return
        for name, entry in deps.items():
            if not isinstance(entry, dict):
                continue
            scripts = entry.get("scripts") or {}
            lifecycle = any(
                isinstance(scripts, dict) and scripts.get(hook)
                for hook in ("preinstall", "install", "postinstall")
            )
            if lifecycle:
                ver = entry.get("version") or "<unversioned>"
                seen[f"{name}@{ver}"] = name
            _walk_v1(entry.get("dependencies"), depth = depth + 1)

    if version == 1 or "dependencies" in lock:
        _walk_v1(lock.get("dependencies") or {})

    return seen


def _load_lockfile(path: Path) -> dict:
    if not path.exists():
        raise FileNotFoundError(f"lockfile not found: {path}")
    try:
        return json.loads(path.read_text(encoding = "utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"{path}: not valid JSON: {exc}") from exc


# Registry lookup for the postinstall command body (best-effort).


def _fetch_registry_scripts(name: str, version: str) -> dict[str, str] | None:
    """Return {hook: command} for lifecycle hooks in registry metadata; None on any error (never raises)."""
    safe_name = urllib.parse.quote(name, safe = "@/")
    url = f"{REGISTRY_BASE}{safe_name}/{urllib.parse.quote(version)}"
    try:
        with urllib.request.urlopen(url, timeout = REGISTRY_TIMEOUT_SECS) as resp:
            body = resp.read()
    except (urllib.error.URLError, OSError, ValueError, TimeoutError):
        return None
    try:
        meta = json.loads(body)
    except json.JSONDecodeError:
        return None
    scripts = meta.get("scripts") or {}
    if not isinstance(scripts, dict):
        return None
    keep = {}
    for hook in ("preinstall", "install", "postinstall"):
        cmd = scripts.get(hook)
        if isinstance(cmd, str) and cmd.strip():
            keep[hook] = cmd
    return keep or None


# Diff.


def diff_new_install_scripts(base_lock: dict, head_lock: dict) -> list[Finding]:
    base = _collect_install_script_entries(base_lock)
    head = _collect_install_script_entries(head_lock)
    findings: list[Finding] = []
    for key in sorted(head):
        if key in base:
            continue  # pre-existing install-script dep; not in scope
        name = head[key]
        version = key[len(name) + 1 :] if key.startswith(name + "@") else "<unversioned>"
        scripts = _fetch_registry_scripts(name, version)
        if scripts:
            detail = "; ".join(f"{h}={cmd!r}" for h, cmd in scripts.items())
        else:
            detail = (
                "newly added with hasInstallScript=true; registry "
                "metadata unreachable -- inspect the package's "
                "scripts.{preinstall,install,postinstall} manually"
            )
        findings.append(
            Finding(
                severity = CRITICAL,
                name = name,
                version = version,
                kind = "new-install-script",
                detail = detail,
            )
        )
    return findings


# CLI.


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description = (
            "Diff two package-lock.json files and refuse any newly-added install-script dep."
        ),
    )
    parser.add_argument(
        "--base",
        required = True,
        help = "Path to the BASE package-lock.json (e.g. main branch).",
    )
    parser.add_argument(
        "--head",
        required = True,
        help = "Path to the HEAD package-lock.json (this PR).",
    )
    args = parser.parse_args(argv)

    try:
        base_lock = _load_lockfile(Path(args.base))
        head_lock = _load_lockfile(Path(args.head))
    except (FileNotFoundError, ValueError) as exc:
        print(f"[install-script-diff] ERROR: {exc}", file = sys.stderr)
        return 2

    findings = diff_new_install_scripts(base_lock, head_lock)
    if not findings:
        print(
            "[install-script-diff] OK: no newly-added install-script "
            "dependencies between base and head",
            flush = True,
        )
        return 0

    print(
        f"\n[install-script-diff] FAIL: {len(findings)} newly-added "
        f"install-script dependency(ies):\n",
        file = sys.stderr,
    )
    for f in findings:
        print(str(f), file = sys.stderr)
        print(file = sys.stderr)
    print(
        "[install-script-diff] Refusing to proceed. Every new "
        "install-script dep is a postinstall lifecycle hook that "
        "would run on the next `npm ci`. Review each finding above, "
        "confirm the maintainer + version, and re-run.",
        file = sys.stderr,
    )
    return 1


if __name__ == "__main__":
    sys.exit(main())
```

### `scripts\enforce_kwargs_spacing.py`
```
#!/usr/bin/env python3
"""Ensure keyword arguments use spaces around '=', prune redundant pass statements,
drop the blank line after a short indented import block, merge adjacent same-line
string literals, normalize def-signature magic commas (pre-ruff) so a def with
>= 3 params and a default goes one-per-line while everything else stays
collapsible, and collapse a short multi-line assert onto one line (pre-ruff) by
stripping the magic trailing comma that holds it open."""

from __future__ import annotations

import ast
import argparse
import io
import os
import sys
import tempfile
import tokenize
from collections import defaultdict
from pathlib import Path


def _atomic_write_text(path: Path, data: str, encoding: str) -> None:
    """Write ``data`` to ``path`` atomically via same-dir tmp + fsync + os.replace,
    so a crash mid-write leaves either the old or full new content, never a truncation."""
    dirpath = str(path.parent) or "."
    fd, tmp_path = tempfile.mkstemp(prefix=".kwargs_fix.", dir=dirpath)
    try:
        with os.fdopen(fd, "w", encoding=encoding) as handle:
            handle.write(data)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(tmp_path, path)
    except Exception:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
        raise


def enforce_spacing(text: str) -> tuple[str, bool]:
    """Return updated text with keyword '=' padded by spaces, plus change flag."""
    lines = text.splitlines(keepends=True)
    if not lines:
        return text, False

    offsets: dict[int, int] = defaultdict(int)
    changed = False

    reader = io.StringIO(text).readline
    for token in tokenize.generate_tokens(reader):
        if token.type != tokenize.OP or token.string != "=":
            continue

        line_index = token.start[0] - 1
        col = token.start[1] + offsets[line_index]

        if line_index < 0 or line_index >= len(lines):
            continue

        line = lines[line_index]
        if col >= len(line) or line[col] != "=":
            continue

        line_changed = False

        # Insert a space before '=' when missing and not preceded by whitespace.
        if col > 0 and line[col - 1] not in {" ", "\t"}:
            line = f"{line[:col]} {line[col:]}"
            offsets[line_index] += 1
            col += 1
            line_changed = True
            changed = True

        # Insert a space after '=' when missing and not followed by whitespace or newline.
        next_index = col + 1
        if next_index < len(line) and line[next_index] not in {" ", "\t", "\n", "\r"}:
            line = f"{line[:next_index]} {line[next_index:]}"
            offsets[line_index] += 1
            line_changed = True
            changed = True

        if line_changed:
            lines[line_index] = line

    if not changed:
        return text, False

    return "".join(lines), True


def remove_redundant_passes(text: str) -> tuple[str, bool]:
    """Drop pass statements that share a block with other executable code."""

    try:
        tree = ast.parse(text)
    except SyntaxError:
        return text, False

    redundant: list[ast.Pass] = []

    def visit(node: ast.AST) -> None:
        for attr in ("body", "orelse", "finalbody"):
            value = getattr(node, attr, None)
            if not isinstance(value, list) or len(value) <= 1:
                continue
            for stmt in value:
                if isinstance(stmt, ast.Pass):
                    redundant.append(stmt)
            for stmt in value:
                if isinstance(stmt, ast.AST):
                    visit(stmt)
        handlers = getattr(node, "handlers", None)
        if handlers:
            for handler in handlers:
                visit(handler)

    visit(tree)

    if not redundant:
        return text, False

    lines = text.splitlines(keepends=True)
    changed = False

    for node in sorted(redundant, key=lambda item: (item.lineno, item.col_offset), reverse=True):
        start = node.lineno - 1
        end = (node.end_lineno or node.lineno) - 1
        if start >= len(lines):
            continue
        changed = True
        if start == end:
            line = lines[start]
            col_start = node.col_offset
            col_end = node.end_col_offset or (col_start + 4)
            segment = line[:col_start] + line[col_end:]
            lines[start] = segment if segment.strip() else ""
            continue

        # Fall-back for unexpected multi-line 'pass'.
        prefix = lines[start][: node.col_offset]
        lines[start] = prefix if prefix.strip() else ""
        for idx in range(start + 1, end):
            lines[idx] = ""
        suffix = lines[end][(node.end_col_offset or 0) :]
        lines[end] = suffix

    # Normalise to ensure lines end with newlines except at EOF.
    result_lines: list[str] = []
    for index, line in enumerate(lines):
        if not line:
            continue
        if index < len(lines) - 1 and not line.endswith("\n"):
            result_lines.append(f"{line}\n")
        else:
            result_lines.append(line)

    return "".join(result_lines), changed


def remove_blank_after_short_import(text: str) -> tuple[str, bool]:
    """Drop blank line(s) after an import block in a small nested suite.

    In an indented suite of <= 3 statements (never module level), when consecutive
    imports are followed across blank lines (nothing else) by another statement,
    remove those blanks. A comment in the gap blocks the rule. Removing blank lines
    never changes the AST.
    """
    try:
        tree = ast.parse(text)
    except SyntaxError:
        return text, False

    lines = text.splitlines(keepends=True)
    import_types = (ast.Import, ast.ImportFrom)
    drop: set[int] = set()  # 1-based physical line numbers to delete

    def suites_of(node: ast.AST) -> list[list[ast.stmt]]:
        if isinstance(node, ast.Module):
            return []  # module-level import spacing is left alone
        out: list[list[ast.stmt]] = []
        for attr in ("body", "orelse", "finalbody"):
            val = getattr(node, attr, None)
            if isinstance(val, list) and val and all(isinstance(s, ast.stmt) for s in val):
                out.append(val)
        return out

    for node in ast.walk(tree):
        for suite in suites_of(node):
            if len(suite) > 3:  # only small blocks
                continue
            i = 0
            while i < len(suite):
                if not isinstance(suite[i], import_types):
                    i += 1
                    continue
                j = i
                while j + 1 < len(suite) and isinstance(suite[j + 1], import_types):
                    j += 1
                if j + 1 < len(suite):  # an import block followed by another statement
                    last_imp, nxt = suite[j], suite[j + 1]
                    gap = range((last_imp.end_lineno or last_imp.lineno) + 1, nxt.lineno)
                    nums = [n for n in gap if 1 <= n <= len(lines)]
                    if nums and all(lines[n - 1].strip() == "" for n in nums):
                        drop.update(nums)
                i = j + 1

    if not drop:
        return text, False
    kept = [ln for idx, ln in enumerate(lines, start=1) if idx not in drop]
    return "".join(kept), True


_STRING_TRIVIA = (tokenize.NL, tokenize.NEWLINE, tokenize.COMMENT, tokenize.INDENT, tokenize.DEDENT)


_DEF_MIN_PARAMS_FOR_MULTILINE = 3  # signatures with < this many params stay one line


def _def_specs_by_line(tree: ast.AST) -> dict[int, tuple[int, bool]]:
    """Map each def keyword line to (param count, has-any-default).

    ``*`` / ``/`` markers aren't counted. A default exists if any positional default
    is present or any keyword-only default is not ``None`` (``None`` in ``kw_defaults``
    means a required keyword-only arg).
    """
    out: dict[int, tuple[int, bool]] = {}
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            a = node.args
            count = (
                len(a.posonlyargs)
                + len(a.args)
                + len(a.kwonlyargs)
                + (1 if a.vararg else 0)
                + (1 if a.kwarg else 0)
            )
            has_default = bool(a.defaults) or any(d is not None for d in a.kw_defaults)
            out[node.lineno] = (count, has_default)
    return out


def normalize_def_trailing_comma(text: str) -> tuple[str, bool]:
    """Force a def signature one-per-line iff >= 3 params AND a default; else collapsible.

    A qualifying signature gets a magic trailing comma added (ruff wraps it
    one-per-line); every other signature has its trailing comma stripped so ruff
    collapses it when it fits. Def parameter lists only, never call sites or
    collection literals. Run BEFORE ruff format. Never changes the AST (re-checked).
    """
    try:
        tree = ast.parse(text)
        toks = list(tokenize.generate_tokens(io.StringIO(text).readline))
    except (tokenize.TokenError, IndentationError, SyntaxError):
        return text, False

    specs = _def_specs_by_line(tree)
    n = len(toks)
    edits: list[tuple[int, int, str]] = []  # (row, col, "del" | "ins")
    i = 0
    while i < n:
        t = toks[i]
        if t.type == tokenize.NAME and t.string == "def" and t.start[0] in specs:
            cnt, has_default = specs[t.start[0]]
            force_multiline = cnt >= _DEF_MIN_PARAMS_FOR_MULTILINE and has_default
            j = i + 1
            while j < n and not (toks[j].type == tokenize.OP and toks[j].string == "("):
                if toks[j].type == tokenize.NEWLINE:
                    break
                j += 1
            if j < n and toks[j].type == tokenize.OP and toks[j].string == "(":
                depth = 0
                k = j
                while k < n:
                    tk = toks[k]
                    if tk.type == tokenize.OP and tk.string == "(":
                        depth += 1
                    elif tk.type == tokenize.OP and tk.string == ")":
                        depth -= 1
                        if depth == 0:
                            m = k - 1
                            while m > j and toks[m].type in _STRING_TRIVIA:
                                m -= 1
                            last = toks[m]
                            has_comma = last.type == tokenize.OP and last.string == ","
                            empty = m == j  # nothing between ( and )
                            if force_multiline and not has_comma and not empty:
                                edits.append((last.end[0], last.end[1], "ins"))
                            elif not force_multiline and has_comma:
                                edits.append((last.start[0], last.start[1], "del"))
                            break
                    k += 1
                i = k + 1
                continue
        i += 1

    if not edits:
        return text, False

    lines = text.splitlines(keepends=True)

... [TRUNCATED] ...
```

### `scripts\lint_workflow_triggers.py`
```
#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-only
# Copyright 2026-present the Unsloth AI Inc. team. All rights reserved.

"""Refuse dangerous GitHub Actions trigger patterns at PR time.

Bans patterns behind the TanStack GHSA-g7cv-rxg3-hmpx compromise:

1.  `pull_request_target` -- runs a fork's workflow against the base
    repo's secrets/permissions; use `pull_request` instead.
2.  `workflow_run` chained to a PR-triggered workflow -- same trust
    boundary problem one hop later (poisoned artifacts/caches run with
    elevated permissions).
3.  Cache keys shared between PR-triggered and publish/release/push
    workflows -- a fork PR could poison a cache the publish workflow
    restores. Partition the key namespaces.

Exit codes: 0 = no findings, 1 = findings (listed on stderr).
Run from repo root: python3 scripts/lint_workflow_triggers.py
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML is required. Install with 'pip install pyyaml'", file = sys.stderr)
    sys.exit(2)

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_WORKFLOWS_DIR = REPO_ROOT / ".github" / "workflows"

BANNED_TRIGGERS: tuple[str, ...] = ("pull_request_target",)
RESTRICTED_TRIGGERS: tuple[str, ...] = ("workflow_run",)
PUBLISH_WORKFLOW_NAMES: tuple[str, ...] = ("release-desktop.yml",)


def _normalise_on(on_field):
    if isinstance(on_field, str):
        return {on_field}
    if isinstance(on_field, list):
        return set(on_field)
    if isinstance(on_field, dict):
        return set(on_field.keys())
    return set()


def _load_workflow(path: Path):
    try:
        return yaml.safe_load(path.read_text())
    except Exception as exc:
        print(f"ERROR: failed to parse {path}: {exc}", file = sys.stderr)
        sys.exit(2)


def _extract_cache_keys(path: Path) -> list[str]:
    text = path.read_text()
    keys: list[str] = []
    for m in re.finditer(r"(?:^|\n)\s*key:\s*([^\n]+)", text):
        keys.append(m.group(1).strip())
    return keys


def _trigger_set(yaml_doc) -> set[str]:
    on = yaml_doc.get(True)
    if on is None:
        on = yaml_doc.get("on")
    return _normalise_on(on)


def main() -> int:
    parser = argparse.ArgumentParser(description = __doc__)
    parser.add_argument(
        "--workflows-dir",
        type = Path,
        default = DEFAULT_WORKFLOWS_DIR,
        help = "Override the workflows directory (used by tests).",
    )
    args = parser.parse_args()
    workflows_dir = args.workflows_dir

    findings: list[str] = []
    workflows = sorted(workflows_dir.glob("*.yml"))
    pr_triggered: list[tuple[Path, list[str]]] = []
    publish_triggered: list[tuple[Path, list[str]]] = []

    for path in workflows:
        doc = _load_workflow(path)
        triggers = _trigger_set(doc)

        for t in BANNED_TRIGGERS:
            if t in triggers:
                findings.append(
                    f"{path.name}: BANNED trigger '{t}' (GHSA-g7cv-rxg3-hmpx "
                    "pattern: fork PRs run in base-repo context). Switch to "
                    "'pull_request' and use a deploy-on-merge workflow for "
                    "any privileged step."
                )

        for t in RESTRICTED_TRIGGERS:
            if t in triggers:
                text = path.read_text()
                if "lint:workflow_triggers-allow-workflow_run" not in text:
                    findings.append(
                        f"{path.name}: RESTRICTED trigger '{t}' requires an "
                        "explicit `# lint:workflow_triggers-allow-workflow_run` "
                        "comment somewhere in the file, with a justification."
                    )

        if "pull_request" in triggers:
            pr_triggered.append((path, _extract_cache_keys(path)))
        is_dispatch_only = "workflow_dispatch" in triggers and not (
            "push" in triggers or "pull_request" in triggers
        )
        if path.name in PUBLISH_WORKFLOW_NAMES or is_dispatch_only:
            publish_triggered.append((path, _extract_cache_keys(path)))

    pr_keys = {key for _, keys in pr_triggered for key in keys}
    for pub_path, pub_keys in publish_triggered:
        for k in pub_keys:
            if k in pr_keys:
                findings.append(
                    f"{pub_path.name}: cache key {k!r} is also declared in a "
                    "PR-triggered workflow. A fork PR could poison this cache "
                    "and the publish workflow would restore it on next run. "
                    "Add a unique suffix (e.g. '-publish-only') to partition "
                    "the namespaces."
                )

    if findings:
        print("Workflow trigger lint failed with the following issues:", file = sys.stderr)
        for f in findings:
            print(f"  - {f}", file = sys.stderr)
        return 1

    print(
        f"OK: scanned {len(workflows)} workflow file(s); "
        f"no pull_request_target, no unjustified workflow_run, "
        f"no PR/publish cache-key collision."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

### `scripts\lockfile_supply_chain_audit.py`
```
#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-only
# Copyright 2026-present the Unsloth AI Inc. team. All rights reserved.

"""Lockfile supply-chain audit for the Studio frontend and Tauri shell.

Runs BEFORE `npm ci` / `cargo fetch` in CI. Refuses to proceed when a
lockfile contains patterns indicating supply-chain injection (npm
Shai-Hulud waves, cargo crates.io brand-squats).

Checks package-lock.json (lockfileVersion 2/3): `resolved` URL must be
the npm registry (direct git/github/file refs are the injection vector);
`integrity` SHA must be present; known IOC substrings grepped from the
body. Checks Cargo.lock: `source` must be the crates.io registry index;
known cargo IOC substrings.

Exit codes: 0 = clean (or skip env var set to a justification >=5 chars,
not '1'/'true'); 1 = findings; 2 = internal error.

Only PARSES the lockfiles, never executes or networks. Complements (not
replaces) `npm audit` / OSV-Scanner / the advisory-DB pipeline. Fires
before any third-party install script runs on the runner.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]


# Known IOC strings (case-sensitive substring match). Each is tied to a
# public advisory; speculative/generic patterns would false-positive on
# upgrades.
NPM_IOC_STRINGS: tuple[str, ...] = (
    # Shai-Hulud TanStack wave -- May 11, 2026 (GHSA-g7cv-rxg3-hmpx).
    "router_init.js",
    "tanstack_runner.js",
    "router_runtime.js",
    "@tanstack/setup",
    "github:tanstack/router#79ac49eedf774dd4b0cfa308722bc463cfe5885c",
    # Exfiltration endpoints observed across both Shai-Hulud waves.
    "filev2.getsession.org",
    "getsession.org/file/",
    # Campaign markers; the worm tarballs print this to stdout on run.
    "A Mini Shai-Hulud has Appeared",
    # Mini Shai-Hulud May-12 2026 wave.
    "git-tanstack.com",
    "transformers.pyz",
    "/tmp/transformers.pyz",
    "With Love TeamPCP",
    # Aikido (May-12 wave): payload SHA-256 hashes + Bun marker.
    "ab4fcadaec49c03278063dd269ea5eef82d24f2124a8e15d7b90f2fa8601266c",
    "2ec78d556d696e208927cc503d48e4b5eb56b31abc2870c2ed2e98d6be27fc96",
    "bun run tanstack_runner.js",
    "We've been online over 2 hours",
)

# Hard pin-blocks for publicly confirmed malicious versions.
# keep in sync with scripts/scan_npm_packages.py
BLOCKED_NPM_VERSIONS: dict[str, set[str]] = {
    # GHSA-g7cv-rxg3-hmpx -- TanStack May-11 2026 (84 versions).
    "@tanstack/arktype-adapter": {"1.166.12", "1.166.15"},
    "@tanstack/eslint-plugin-router": {"1.161.9", "1.161.12"},
    "@tanstack/eslint-plugin-start": {"0.0.4", "0.0.7"},
    "@tanstack/history": {"1.161.9", "1.161.12"},
    "@tanstack/nitro-v2-vite-plugin": {"1.154.12", "1.154.15"},
    "@tanstack/react-router": {"1.169.5", "1.169.8"},
    "@tanstack/react-router-devtools": {"1.166.16", "1.166.19"},
    "@tanstack/react-router-ssr-query": {"1.166.15", "1.166.18"},
    "@tanstack/react-start": {"1.167.68", "1.167.71"},
    "@tanstack/react-start-client": {"1.166.51", "1.166.54"},
    "@tanstack/react-start-rsc": {"0.0.47", "0.0.50"},
    "@tanstack/react-start-server": {"1.166.55", "1.166.58"},
    "@tanstack/router-cli": {"1.166.46", "1.166.49"},
    "@tanstack/router-core": {"1.169.5", "1.169.8"},
    "@tanstack/router-devtools": {"1.166.16", "1.166.19"},
    "@tanstack/router-devtools-core": {"1.167.6", "1.167.9"},
    "@tanstack/router-generator": {"1.166.45", "1.166.48"},
    "@tanstack/router-plugin": {"1.167.38", "1.167.41"},
    "@tanstack/router-ssr-query-core": {"1.168.3", "1.168.6"},
    "@tanstack/router-utils": {"1.161.11", "1.161.14"},
    "@tanstack/router-vite-plugin": {"1.166.53", "1.166.56"},
    "@tanstack/solid-router": {"1.169.5", "1.169.8"},
    "@tanstack/solid-router-devtools": {"1.166.16", "1.166.19"},
    "@tanstack/solid-router-ssr-query": {"1.166.15", "1.166.18"},
    "@tanstack/solid-start": {"1.167.65", "1.167.68"},
    "@tanstack/solid-start-client": {"1.166.50", "1.166.53"},
    "@tanstack/solid-start-server": {"1.166.54", "1.166.57"},
    "@tanstack/start-client-core": {"1.168.5", "1.168.8"},
    "@tanstack/start-fn-stubs": {"1.161.9", "1.161.12"},
    "@tanstack/start-plugin-core": {"1.169.23", "1.169.26"},
    "@tanstack/start-server-core": {"1.167.33", "1.167.36"},
    "@tanstack/start-static-server-functions": {"1.166.44", "1.166.47"},
    "@tanstack/start-storage-context": {"1.166.38", "1.166.41"},
    "@tanstack/valibot-adapter": {"1.166.12", "1.166.15"},
    "@tanstack/virtual-file-routes": {"1.161.10", "1.161.13"},
    "@tanstack/vue-router": {"1.169.5", "1.169.8"},
    "@tanstack/vue-router-devtools": {"1.166.16", "1.166.19"},
    "@tanstack/vue-router-ssr-query": {"1.166.15", "1.166.18"},
    "@tanstack/vue-start": {"1.167.61", "1.167.64"},
    "@tanstack/vue-start-client": {"1.166.46", "1.166.49"},
    "@tanstack/vue-start-server": {"1.166.50", "1.166.53"},
    "@tanstack/zod-adapter": {"1.166.12", "1.166.15"},
    # Mini Shai-Hulud May-12 wave: OpenSearch JS client.
    "@opensearch-project/opensearch": {"3.5.3", "3.6.2", "3.7.0", "3.8.0"},
    # Mini Shai-Hulud May-12 wave: @squawk/* (22 packages, 5 versions each;
    # https://safedep.io/mass-npm-supply-chain-attack-tanstack-mistral/).
    "@squawk/airport-data": {"0.7.4", "0.7.5", "0.7.6", "0.7.7", "0.7.8"},
    "@squawk/airports": {"0.6.2", "0.6.3", "0.6.4", "0.6.5", "0.6.6"},
    "@squawk/airspace": {"0.8.1", "0.8.2", "0.8.3", "0.8.4", "0.8.5"},
    "@squawk/airspace-data": {"0.5.3", "0.5.4", "0.5.5", "0.5.6", "0.5.7"},
    "@squawk/airway-data": {"0.5.4", "0.5.5", "0.5.6", "0.5.7", "0.5.8"},
    "@squawk/airways": {"0.4.2", "0.4.3", "0.4.4", "0.4.5", "0.4.6"},
    "@squawk/fix-data": {"0.6.4", "0.6.5", "0.6.6", "0.6.7", "0.6.8"},
    "@squawk/fixes": {"0.3.2", "0.3.3", "0.3.4", "0.3.5", "0.3.6"},
    "@squawk/flight-math": {"0.5.4", "0.5.5", "0.5.6", "0.5.7", "0.5.8"},
    "@squawk/flightplan": {"0.5.2", "0.5.3", "0.5.4", "0.5.5", "0.5.6"},
    "@squawk/geo": {"0.4.4", "0.4.5", "0.4.6", "0.4.7", "0.4.8"},
    "@squawk/icao-registry": {"0.5.2", "0.5.3", "0.5.4", "0.5.5", "0.5.6"},
    "@squawk/icao-registry-data": {"0.8.4", "0.8.5", "0.8.6", "0.8.7", "0.8.8"},
    "@squawk/mcp": {"0.9.1", "0.9.2", "0.9.3", "0.9.4", "0.9.5"},
    "@squawk/navaid-data": {"0.6.4", "0.6.5", "0.6.6", "0.6.7", "0.6.8"},
    "@squawk/navaids": {"0.4.2", "0.4.3", "0.4.4", "0.4.5", "0.4.6"},
    "@squawk/notams": {"0.3.6", "0.3.7", "0.3.8", "0.3.9", "0.3.10"},
    "@squawk/procedure-data": {"0.7.3", "0.7.4", "0.7.5", "0.7.6", "0.7.7"},
    "@squawk/procedures": {"0.5.2", "0.5.3", "0.5.4", "0.5.5", "0.5.6"},
    "@squawk/types": {"0.8.1", "0.8.2", "0.8.3", "0.8.4", "0.8.5"},
    "@squawk/units": {"0.4.3", "0.4.4", "0.4.5", "0.4.6", "0.4.7"},
    "@squawk/weather": {"0.5.6", "0.5.7", "0.5.8", "0.5.9", "0.5.10"},
    # Mini Shai-Hulud May-12 wave: @uipath/* (64 packages, single version each;
    # https://www.aikido.dev/blog/mini-shai-hulud-is-back-tanstack-compromised).
    "@uipath/apollo-react": {"4.24.5"},
    "@uipath/apollo-wind": {"2.16.2"},
    "@uipath/cli": {"1.0.1"},
    "@uipath/rpa-tool": {"0.9.5"},
    "@uipath/apollo-core": {"5.9.2"},
    "@uipath/filesystem": {"1.0.1"},
    "@uipath/solutionpackager-tool-core": {"0.0.34"},
    "@uipath/solution-tool": {"1.0.1"},
    "@uipath/maestro-tool": {"1.0.1"},
    "@uipath/codedapp-tool": {"1.0.1"},
    "@uipath/agent-tool": {"1.0.1"},
    "@uipath/orchestrator-tool": {"1.0.1"},
    "@uipath/integrationservice-tool": {"1.0.2"},
    "@uipath/rpa-legacy-tool": {"1.0.1"},
    "@uipath/vertical-solutions-tool": {"1.0.1"},
    "@uipath/flow-tool": {"1.0.2"},
    "@uipath/codedagent-tool": {"1.0.1"},
    "@uipath/common": {"1.0.1"},
    "@uipath/resource-tool": {"1.0.1"},
    "@uipath/auth": {"1.0.1"},
    "@uipath/docsai-tool": {"1.0.1"},
    "@uipath/case-tool": {"1.0.1"},
    "@uipath/api-workflow-tool": {"1.0.1"},
    "@uipath/test-manager-tool": {"1.0.2"},
    "@uipath/robot": {"1.3.4"},
    "@uipath/traces-tool": {"1.0.1"},
    "@uipath/agent-sdk": {"1.0.2"},
    "@uipath/integrationservice-sdk": {"1.0.2"},
    "@uipath/maestro-sdk": {"1.0.1"},
    "@uipath/data-fabric-tool": {"1.0.2"},
    "@uipath/tasks-tool": {"1.0.1"},
    "@uipath/insights-tool": {"1.0.1"},
    "@uipath/insights-sdk": {"1.0.1"},
    "@uipath/uipath-python-bridge": {"1.0.1"},
    "@uipath/ap-chat": {"1.5.7"},
    "@uipath/project-packager": {"1.1.16"},
    "@uipath/packager-tool-case": {"0.0.9"},
    "@uipath/packager-tool-workflowcompiler-browser": {"0.0.34"},
    "@uipath/packager-tool-connector": {"0.0.19"},
    "@uipath/packager-tool-workflowcompiler": {"0.0.16"},
    "@uipath/packager-tool-webapp": {"1.0.6"},
    "@uipath/packager-tool-apiworkflow": {"0.0.19"},
    "@uipath/packager-tool-functions": {"0.1.1"},
    "@uipath/widget.sdk": {"1.2.3"},
    "@uipath/resources-tool": {"0.1.11"},
    "@uipath/agent.sdk": {"0.0.18"},
    "@uipath/codedagents-tool": {"0.1.12"},
    "@uipath/aops-policy-tool": {"0.3.1"},
    "@uipath/solution-packager": {"0.0.35"},
    "@uipath/packager-tool-bpmn": {"0.0.9"},
    "@uipath/packager-tool-flow": {"0.0.19"},
    "@uipath/telemetry": {"0.0.7"},
    "@uipath/tool-workflowcompiler": {"0.0.12"},
    "@uipath/vss": {"0.1.6"},
    "@uipath/solutionpackager-sdk": {"1.0.11"},
    "@uipath/ui-widgets-multi-file-upload": {"1.0.1"},
    "@uipath/access-policy-tool": {"0.3.1"},
    "@uipath/context-grounding-tool": {"0.1.1"},
    "@uipath/gov-tool": {"0.3.1"},
    "@uipath/admin-tool": {"0.1.1"},
    "@uipath/identity-tool": {"0.1.1"},
    "@uipath/llmgw-tool": {"1.0.1"},
    "@uipath/resourcecatalog-tool": {"0.1.1"},
    "@uipath/functions-tool": {"1.0.1"},
    "@uipath/access-policy-sdk": {"0.3.1"},
    "@uipath/platform-tool": {"1.0.1"},
    # Mini Shai-Hulud May-12 wave: @mistralai/* (npm) — separate from PyPI mistralai
    # (https://www.aikido.dev/blog/mini-shai-hulud-is-back-tanstack-compromised).
    "@mistralai/mistralai": {"2.2.2", "2.2.3", "2.2.4"},
    "@mistralai/mistralai-gcp": {"1.7.1", "1.7.2", "1.7.3"},
    "@mistralai/mistralai-azure": {"1.7.1", "1.7.2", "1.7.3"},
    # Mini Shai-Hulud May-12 wave: @tallyui/* (30 entries, 10 packages)
    # (Aikido enumeration).
    "@tallyui/components": {"1.0.1", "1.0.2", "1.0.3"},
    "@tallyui/connector-medusa": {"1.0.1", "1.0.2", "1.0.3"},
    "@tallyui/connector-shopify": {"1.0.1", "1.0.2", "1.0.3"},
    "@tallyui/connector-vendure": {"1.0.1", "1.0.2", "1.0.3"},
    "@tallyui/connector-woocommerce": {"1.0.1", "1.0.2", "1.0.3"},
    "@tallyui/core": {"0.2.1", "0.2.2", "0.2.3"},
    "@tallyui/database": {"1.0.1", "1.0.2", "1.0.3"},
    "@tallyui/pos": {"0.1.1", "0.1.2", "0.1.3"},
    "@tallyui/storage-sqlite": {"0.2.1", "0.2.2", "0.2.3"},
    "@tallyui/theme": {"0.2.1", "0.2.2", "0.2.3"},
    # Mini Shai-Hulud May-12 wave: @beproduct/nestjs-auth (18 versions)
    # (Aikido enumeration).
    "@beproduct/nestjs-auth": {
        "0.1.2",
        "0.1.3",
        "0.1.4",
        "0.1.5",
        "0.1.6",
        "0.1.7",
        "0.1.8",
        "0.1.9",
        "0.1.10",
        "0.1.11",
        "0.1.12",
        "0.1.13",
        "0.1.14",
        "0.1.15",
        "0.1.16",
        "0.1.17",
        "0.1.18",
        "0.1.19",
    },
    # Mini Shai-Hulud May-12 wave: @draftlab/* + @draftauth/*
    # (Aikido enumeration).
    "@draftauth/client": {"0.2.1", "0.2.2"},
    "@draftauth/core": {"0.13.1", "0.13.2"},
    "@draftlab/auth": {"0.24.1", "0.24.2"},
    "@draftlab/auth-router": {"0.5.1", "0.5.2"},
    "@draftlab/db": {"0.16.1"},
    # Mini Shai-Hulud May-12 wave: @taskflow-corp/cli + @tolka/cli
    # (Aikido enumeration).
    "@taskflow-corp/cli": {"0.1.24", "0.1.25", "0.1.26", "0.1.27", "0.1.28", "0.1.29"},
    "@tolka/cli": {"1.0.2", "1.0.3", "1.0.4", "1.0.5", "1.0.6"},
    # Mini Shai-Hulud May-12 wave: @ml-toolkit-ts/* + @mesadev/* + @dirigible-ai/sdk + @supersurkhet/*
    # (Aikido enumeration).
    "@dirigible-ai/sdk": {"0.6.2", "0.6.3"},
    "@mesadev/rest": {"0.28.3"},
    "@mesadev/saguaro": {"0.4.22"},
    "@mesadev/sdk": {"0.28.3"},
    "@ml-toolkit-ts/preprocessing": {"1.0.2", "1.0.3"},
    "@ml-toolkit-ts/xgboost": {"1.0.3", "1.0.4"},
    "@supersurkhet/cli": {"0.0.2", "0.0.3", "0.0.4", "0.0.5", "0.0.6", "0.0.7"},
    "@supersurkhet/sdk": {"0.0.2", "0.0.3", "0.0.4", "0.0.5", "0.0.6", "0.0.7"},
    # Mini Shai-Hulud May-12 wave: Unscoped packages (10 entries)
    # (Aikido enumeration).
    "safe-action": {"0.8.3", "0.8.4"},
    "ts-dna": {"3.0.1", "3.0.2", "3.0.3", "3.0.4"},
    "cross-stitch": {"1.1.3", "1.1.4", "1.1.5", "1.1.6"},
    "cmux-agent-mcp": {"0.1.3", "0.1.4", "0.1.5", "0.1.6", "0.1.7", "0.1.8"},
    "agentwork-cli": {"0.1.4", "0.1.5"},
    "git-branch-selector": {"1.3.3", "1.3.4", "1.3.5", "1.3.6", "1.3.7"},
    "wot-api": {"0.8.1", "0.8.2", "0.8.3", "0.8.4"},
    "git-git-git": {"1.0.8", "1.0.9", "1.0.10", "1.0.11", "1.0.12"},
    "nextmove-mcp": {"0.1.3", "0.1.4", "0.1.5", "0.1.6", "0.1.7"},
    "ml-toolkit-ts": {"1.0.4", "1.0.5"},
    # Cross-ecosystem Mini Shai-Hulud (Apr-30 wave): npm counterpart of
    # PyPI lightning 2.6.2/2.6.3. Same threat actor (TeamPCP) per Semgrep,
    # Aikido, OX Security, Resecurity. Safe version: 7.0.3 and earlier.
    "intercom-client": {"7.0.4"},
}

CARGO_IOC_STRINGS: tuple[str, ...] = (
    # Empty by default; the `source` origin check catches the structural
    # pattern. Reserved for future cargo-side incidents.
)


# Allowed lockfile origins.
NPM_REGISTRY_PREFIX = "https://registry.npmjs.org/"
NPM_REGISTRY_PREFIXES_ALLOWED: tuple[str, ...] = (NPM_REGISTRY_PREFIX,)

CARGO_REGISTRY_SOURCE = "registry+https://github.com/rust-lang/crates.io-index"


# Cargo non-registry source allowlist: `(crate_name, exact_source_string)`.
# Both must match verbatim; bumping the pinned SHA forces a re-review.
# Studio's Tauri shell pulls `fix-path-env` from git because it is not
# published to crates.io; commit c4c45d5 was reviewed when it landed.
CARGO_SOURCE_ALLOWLIST: tuple[tuple[str, str], ...] = (
    (

... [TRUNCATED] ...
```

### `scripts\notebook_to_python.py`
```
#!/usr/bin/env python
# coding: utf-8
"""
Convert Jupyter notebooks (.ipynb) to executable Python scripts (.py).

Converts IPython magics to plain Python:
    !command          -> subprocess.run('command', shell=True)
    %cd path          -> os.chdir('path')
    %env VAR=value    -> os.environ['VAR'] = 'value'
    %%file filename   -> with open('filename', 'w') as f: f.write(...)
    %%capture         -> (skipped)
    /content/...      -> _WORKING_DIR + /...
"""

import nbformat
import re
import shlex
import sys
import os
import urllib.request
import urllib.parse
from pathlib import Path


# Allowlist of hosts for raw notebook fetches; anything else rejected before urlopen.
_ALLOWED_NOTEBOOK_HOSTS = {
    "raw.githubusercontent.com",
    "gist.githubusercontent.com",
}


# Metacharacters that mean a `!cmd` line can't be a flat argv -> keep shell=True + review marker.
_SHELL_METACHARS_RE = re.compile(r"\$\(|`|\|\||\||&&|>>?|<<?|\*|\?|;")


def needs_fstring(cmd: str) -> bool:
    """Check if command has Python variable interpolation like {var_name}."""
    pattern = r"(?<!\$)\{([a-zA-Z_][a-zA-Z0-9_]*)\}"
    return bool(re.search(pattern, cmd))


def github_blob_to_raw(url: str) -> str:
    """Convert GitHub blob URL to raw URL."""
    # github.com/user/repo/blob/branch/path -> raw.githubusercontent.com/user/repo/branch/path
    # Exact host match (not substring) so attacker.example.com/github.com/blob/... is not rewritten.
    parsed = urllib.parse.urlparse(url)
    if parsed.netloc != "github.com" or "/blob/" not in parsed.path:
        return url
    new_path = parsed.path.replace("/blob/", "/", 1)
    return urllib.parse.urlunparse(
        parsed._replace(netloc = "raw.githubusercontent.com", path = new_path)
    )


def download_notebook(url: str) -> tuple[str, str]:
    """Download notebook from URL. Returns (content, filename)."""
    raw_url = github_blob_to_raw(url)

    parsed = urllib.parse.urlparse(raw_url)
    filename = os.path.basename(urllib.parse.unquote(parsed.path))

    # Host allowlist: refuse to fetch from anything we don't recognise.
    host = parsed.hostname
    if host not in _ALLOWED_NOTEBOOK_HOSTS:
        raise ValueError(
            f"Refused notebook fetch from {host!r}: not in allowlist "
            f"{sorted(_ALLOWED_NOTEBOOK_HOSTS)}"
        )

    print(f"Downloading {url}...")
    with urllib.request.urlopen(raw_url, timeout = 60) as response:
        content = response.read().decode("utf-8")

    return content, filename


def is_url(path: str) -> bool:
    """Check if path is a URL."""
    return path.startswith("http://") or path.startswith("https://")


def replace_colab_paths(source: str) -> str:
    """Replace Colab-specific /content/ paths with current working directory."""
    source = source.replace('"/content/', 'f"{_WORKING_DIR}/')
    source = source.replace("'/content/", "f'{_WORKING_DIR}/")
    return source


def _emit_shell_command(indent: str, full_cmd: str, *, allow_shell: bool) -> list[str]:
    """Render a `!cmd` notebook line as Python statements.

    f-string interpolation, shell metacharacters, or multiline force
    shell=True (shlex.split would drop operators), flagged with a
    WARNING comment. Otherwise emit shell=False argv form. allow_shell
    False makes shell=True emission a hard error.
    """
    needs_f = needs_fstring(full_cmd)
    has_meta = bool(_SHELL_METACHARS_RE.search(full_cmd))
    multiline = "\n" in full_cmd

    must_use_shell = needs_f or has_meta or multiline

    if must_use_shell:
        if not allow_shell:
            raise ValueError(
                "Cell uses shell metacharacters / interpolation but "
                "--no-allow-shell was set; refusing to emit shell=True"
            )
        warn = f"{indent}# WARNING: shell=True; reviewed for hostile input"
        f_prefix = "f" if needs_f else ""
        if multiline:
            escaped_cmd = full_cmd.replace('"""', r"\"\"\"")
            if escaped_cmd.rstrip().endswith('"'):
                escaped_cmd = escaped_cmd.rstrip() + " "
            stmt = f'{indent}subprocess.run({f_prefix}"""{escaped_cmd}""", shell=True)'
        else:
            stmt = f"{indent}subprocess.run({f_prefix}{full_cmd!r}, shell=True)"
        return [warn, stmt]

    return [f"{indent}subprocess.run(shlex.split({full_cmd!r}), shell=False)"]


def convert_cell_to_python(source: str, *, allow_shell: bool = True) -> str:
    """Convert a cell's IPython magics to plain Python."""
    lines = source.split("\n")
    result = []
    i = 0

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        indent = line[: len(line) - len(line.lstrip())]

        if stripped.startswith("%%capture"):
            i += 1
            continue

        if stripped.startswith("%%file "):
            filename = stripped[7:].strip()
            file_lines = []
            i += 1
            while i < len(lines):
                file_lines.append(lines[i])
                i += 1
            file_content = "\n".join(file_lines)
            file_content = file_content.replace('"""', r"\"\"\"")
            result.append(f'{indent}with open({filename!r}, "w") as _f:')
            result.append(f'{indent}    _f.write("""{file_content}""")')
            continue

        if stripped.startswith("!"):
            cmd_lines = [stripped[1:]]
            while cmd_lines[-1].rstrip().endswith("\\") and i + 1 < len(lines):
                i += 1
                cmd_lines.append(lines[i].strip())
            full_cmd = "\n".join(cmd_lines)

            result.extend(_emit_shell_command(indent, full_cmd, allow_shell = allow_shell))

        # %cd path -> os.chdir(path)
        elif stripped.startswith("%cd "):
            path = stripped[4:].strip()
            result.append(f"{indent}os.chdir({path!r})")

        # %env VAR=value
        elif stripped.startswith("%env ") and "=" in stripped:
            match = re.match(r"%env\s+(\w+)=(.+)", stripped)
            if match:
                var, val = match.groups()
                result.append(f"{indent}os.environ[{var!r}] = {val!r}")

        # %env VAR
        elif stripped.startswith("%env "):
            var = stripped[5:].strip()
            result.append(f"{indent}os.environ.get({var!r})")

        # %pwd
        elif stripped == "%pwd":
            result.append(f"{indent}os.getcwd()")

        else:
            result.append(line)

        i += 1

    return "\n".join(result)


def convert_notebook(
    notebook_content: str,
    source_name: str = "notebook",
    *,
    allow_shell: bool = True,
) -> str:
    """Convert notebook JSON content to Python script."""
    # Parse notebook
    if isinstance(notebook_content, str):
        notebook = nbformat.reads(notebook_content, as_version = 4)
    else:
        notebook = notebook_content

    lines = [
        "#!/usr/bin/env python",
        "# coding: utf-8",
        f"# Converted from: {source_name}",
        "",
        "import shlex",
        "import subprocess",
        "import os",
        "import sys",
        "import re",
        "",
        "# Capture original packages before any installs",
        "_original_packages = subprocess.run(",
        "    [sys.executable, '-m', 'pip', 'freeze'],",
        "    capture_output=True, text=True",
        ").stdout",
        "",
        "# Working directory (replaces Colab's /content/)",
        "_WORKING_DIR = os.getcwd()",
        "",
    ]

    for cell in notebook.cells:
        source = cell.source.strip()
        if not source:
            continue

        if cell.cell_type == "code":
            converted = convert_cell_to_python(source, allow_shell = allow_shell)
            converted = replace_colab_paths(converted)
            lines.append(converted)
            lines.append("")

        elif cell.cell_type == "markdown":
            for line in source.split("\n"):
                lines.append(f"# {line}")
            lines.append("")

    # Add package restoration at the end
    lines.extend(
        [
            "",
            "# Restore original packages (install one by one, skip failures)",
            "for _pkg in _original_packages.strip().split('\\n'):",
            "    if _pkg:",
            "        subprocess.run([sys.executable, '-m', 'pip', 'install', _pkg, '-q'],",
            "                       stderr=subprocess.DEVNULL)",
            "",
        ]
    )

    return "\n".join(lines)


def convert_notebook_to_script(
    source: str,
    output_dir: str | None = None,
    *,
    allow_shell: bool = True,
):
    """
    Convert a notebook to Python script.

    Args:
        source: Local file path or URL to notebook
        output_dir: Output directory (optional, defaults to current directory)
        allow_shell: When False, refuse to emit `shell=True` for any
            `!cmd` cell that uses metacharacters / interpolation.
    """
    if is_url(source):
        content, filename = download_notebook(source)
        source_name = source
    else:
        filename = os.path.basename(source)
        with open(source, "r", encoding = "utf-8") as f:
            content = f.read()
        source_name = source

    output_filename = filename.replace(".ipynb", ".py")
    output_filename = output_filename.replace("(", "").replace(")", "").replace("-", "_")

    if output_dir:
        output_path = os.path.join(output_dir, output_filename)
    else:
        output_path = output_filename

    script = convert_notebook(content, source_name, allow_shell = allow_shell)

    with open(output_path, "w", encoding = "utf-8") as f:
        f.write(script)

    print(f"Converted {source} -> {output_path}")
    return output_path


def main():
    import argparse

    class Formatter(argparse.ArgumentDefaultsHelpFormatter, argparse.RawDescriptionHelpFormatter):

... [TRUNCATED] ...
```

### `scripts\notebook_validator.py`
```
#!/usr/bin/env python3
# coding: utf-8
# SPDX-License-Identifier: AGPL-3.0-only
# Copyright 2026-present the Unsloth AI Inc. team.
"""
Static + lightweight-dynamic validator for unslothai/notebooks.

Built to catch the bug classes that landed in (at minimum):
- unslothai/notebooks#258  (Colab torchao 0.10 vs peft 0.19 floor)
- unslothai/notebooks#260  (DONT_UPDATE_EXCEPTIONS coverage drift)
- unslothai/notebooks#261  (torch/torchcodec ABI; --no-deps tokenizers)
- unslothai/notebooks#264  (transformers/tokenizers window with --no-deps)
- unslothai/notebooks#221  (removed unsloth APIs in user cells, git+ install)
- unslothai/notebooks  commit 51b1462 (template/notebook drift)

CPU-only by design: never imports torch / unsloth at module load. The
api subcommand introspects unsloth under the existing
tests/_zoo_aggressive_cuda_spoof.py harness (PR #5312) so it works on
ubuntu-latest without a GPU.

Usage:
  python scripts/notebook_validator.py drift       --notebooks-dir <dir>
  python scripts/notebook_validator.py convert     --notebooks-dir <dir> --out _converted
  python scripts/notebook_validator.py lint        --notebooks-dir <dir> [--colab-pin <file>]
  python scripts/notebook_validator.py exceptions  --notebooks-dir <dir>
  python scripts/notebook_validator.py api         --converted-dir _converted --surface _api_surface.json
  python scripts/notebook_validator.py all         --notebooks-dir <dir>
  python scripts/notebook_validator.py refresh-colab --out scripts/data/colab_pip_freeze.gpu.txt
"""

from __future__ import annotations

import argparse
import ast
import dataclasses
import json
import os
import pathlib
import re
import shlex
import subprocess
import sys
import tempfile
import textwrap
import time
import urllib.error
import urllib.request
from typing import Any, Iterable, Iterator


def _atomic_write_bytes(path: pathlib.Path, data: bytes) -> None:
    """Atomic write (see scripts/scan_packages.py::update_req_file). A crash
    between mkstemp and os.replace leaves the prior file intact, so a
    half-downloaded cache file can't poison later runs."""
    path.parent.mkdir(parents = True, exist_ok = True)
    dirpath = str(path.parent) or "."
    fd, tmp_path = tempfile.mkstemp(prefix = ".nb_val.", dir = dirpath)
    try:
        with os.fdopen(fd, "wb") as handle:
            handle.write(data)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(tmp_path, path)
    except Exception:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
        raise


HERE = pathlib.Path(__file__).resolve().parent
DATA_DIR = HERE / "data"
PYPI_CACHE_DIR = DATA_DIR / "pypi_cache"

COLAB_PIP_FREEZE_URL = (
    "https://raw.githubusercontent.com/googlecolab/backend-info/main/pip-freeze.gpu.txt"
)
COLAB_FALLBACK_FILE = DATA_DIR / "colab_pip_freeze.gpu.txt"

# Oracle files snapshotted from googlecolab/backend-info. The colab-diff
# subcommand surfaces NEW/REMOVED/CHANGED entries so upstream Colab base
# image rotations land in CI within ~24h, giving R-INST-002/003/004/005
# earlier signal.
COLAB_ORACLE_FILES: dict[str, str] = {
    "pip-freeze.gpu.txt": "colab_pip_freeze.gpu.txt",
    "apt-list-gpu.txt": "colab_apt_list.gpu.txt",
    "os-info-gpu.txt": "colab_os_info.gpu.txt",
}
COLAB_ORACLE_BASE_URL = "https://raw.githubusercontent.com/googlecolab/backend-info/main/"

# ----- Compat tables. PRs add rows as new releases land. ----- #

# torch.minor -> set of compatible torchcodec.minor strings.
# Source: pytorch/torchcodec compatibility matrix on its README.
TORCH_TORCHCODEC: dict[str, set[str]] = {
    "2.10": {"0.10"},
    "2.9": {"0.7", "0.8", "0.9"},
    "2.8": {"0.6"},
    "2.7": {"0.3", "0.4", "0.5"},
    "2.6": {"0.2", "0.3"},
    "2.5": {"0.1", "0.2"},
}

# When peft >= trigger is on the resolved set, torchao >= floor must also be.
PEFT_TORCHAO_FLOOR: list[dict[str, str]] = [
    {"trigger_peft": "0.19", "torchao_floor": "0.16.0"},
]

# git+ allowlist: install lines that legitimately fetch from GitHub. Anything
# else flags R-INST-001.
GIT_PLUS_ALLOWLIST = (
    "github.com/SparkAudio/Spark-TTS",
    "github.com/state-spaces/mamba",
    "github.com/Dao-AILab/causal-conv1d",
    "github.com/unslothai/unsloth-zoo",
    "github.com/unslothai/unsloth",
)

# ----- Findings ----- #


@dataclasses.dataclass
class Finding:
    rule: str
    file: str
    cell: int | None = None
    line: int | None = None
    severity: str = "error"  # error | warning
    message: str = ""
    hint: str = ""

    def to_dict(self) -> dict[str, Any]:
        return dataclasses.asdict(self)


# ----- Notebook walking ----- #


def iter_notebooks(
    notebooks_dir: pathlib.Path, include_templates: bool = False
) -> Iterator[pathlib.Path]:
    """Yield user-facing .ipynb files under nb/ and kaggle/.
    include_templates=True also walks original_template/ (for convert)."""
    subs = ("nb", "kaggle")
    if include_templates:
        subs = ("nb", "kaggle", "original_template")
    candidates = []
    for sub in subs:
        d = notebooks_dir / sub
        if d.is_dir():
            for p in sorted(d.glob("*.ipynb")):
                candidates.append(p)
    seen = set()
    for p in candidates:
        if p.resolve() in seen:
            continue
        seen.add(p.resolve())
        yield p


def load_notebook(path: pathlib.Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding = "utf-8"))


def cell_source(cell: dict[str, Any]) -> str:
    src = cell.get("source", "")
    if isinstance(src, list):
        return "".join(src)
    return src


def code_cells(nb: dict[str, Any]) -> list[tuple[int, str]]:
    out = []
    for i, c in enumerate(nb.get("cells", [])):
        if c.get("cell_type") == "code":
            out.append((i, cell_source(c)))
    return out


def install_cells(nb: dict[str, Any]) -> list[tuple[int, str]]:
    """Heuristic: any code cell that contains a `pip install`, `pip uninstall`
    or `uv pip install` shell command, or a top-line `%%capture` magic."""
    out = []
    for i, src in code_cells(nb):
        first = src.lstrip().splitlines()[:1]
        if first and first[0].strip().startswith("%%capture"):
            out.append((i, src))
            continue
        if re.search(r"^[ \t]*!\s*(uv\s+)?pip\s+(install|uninstall)\b", src, re.MULTILINE):
            out.append((i, src))
    return out


# Colab oracle only applies to notebooks that run on Colab; AMD, Kaggle,
# DGX-Spark have their own preinstalls and the Colab-vs-cell rules don't apply.
def target_environment(notebook_name: str) -> str:
    parts = pathlib.PurePath(notebook_name).parts
    base = parts[-1] if parts else notebook_name
    parent = parts[-2] if len(parts) >= 2 else ""
    if parent == "kaggle" or base.startswith("Kaggle-"):
        return "kaggle"
    if base.startswith("AMD-") or "_AMD_" in base:
        return "amd"
    if base.startswith("HuggingFace Course-") or base.startswith("HuggingFace_Course-"):
        return "colab"  # HF Course notebooks still run on Colab.
    if "DGX_Spark" in base:
        return "dgx_spark"
    return "colab"


# ----- Pip-freeze parsing ----- #

PINNED_RE = re.compile(r"^\s*([A-Za-z0-9._-]+)\s*==\s*([^\s;#]+)")


def parse_pip_freeze(path: pathlib.Path) -> dict[str, str]:
    """Return {name_lower: version_str_with_local_version}."""
    out: dict[str, str] = {}
    if not path.is_file():
        return out
    for line in path.read_text(encoding = "utf-8").splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        m = PINNED_RE.match(line)
        if m:
            out[m.group(1).lower()] = m.group(2)
    return out


def normalise_version(v: str) -> str:
    """Strip +cu128 / +cpu / -dev local-version metadata."""
    return re.split(r"[+\-]", v, maxsplit = 1)[0]


def version_minor(v: str) -> str:
    parts = normalise_version(v).split(".")
    return ".".join(parts[:2]) if len(parts) >= 2 else parts[0]


def cmp_versions(a: str, b: str) -> int:
    """Return -1/0/+1. Compares dotted numeric components only."""

    def to_tuple(v: str) -> tuple[int, ...]:
        return tuple(int(x) for x in re.findall(r"\d+", normalise_version(v)))

    ta, tb = to_tuple(a), to_tuple(b)
    if ta < tb:
        return -1
    if ta > tb:
        return 1
    return 0


# ----- Install-cell parsing ----- #


@dataclasses.dataclass
class PipInvocation:
    tool: str  # "pip" | "uv-pip"
    flags: set[str]  # {'--no-deps', '--upgrade', '--force-reinstall', ...}
    packages: list[str]  # raw package specifiers (e.g. 'transformers==5.5.0')
    raw: str
    line_no: int = 0


PIP_LINE_RE = re.compile(
    r"^\s*!\s*(?P<tool>(?:uv\s+)?pip)\s+(?:install|uninstall)\b(?P<rest>.*)$",
    re.IGNORECASE,
)
NON_PKG_FLAG_TAKES_VAL = {
    "-r",
    "--requirement",
    "-c",
    "--constraint",
    "-i",
    "--index-url",
    "--extra-index-url",
    "--find-links",
    "-e",
    "--editable",
    "--target",
    "--prefix",
}


def parse_pip_line(line: str, line_no: int = 0) -> PipInvocation | None:
    m = PIP_LINE_RE.match(line)
    if not m:
        return None
    tool = "uv-pip" if "uv" in m.group("tool") else "pip"
    rest = m.group("rest")
    # Strip trailing comment.
    rest = re.split(r"(?<!\S)#", rest, maxsplit = 1)[0]
    try:
        tokens = shlex.split(rest, posix = True)
    except ValueError:
        # f-string interpolation like {xformers}: replace braces with placeholders.
        rest_safe = re.sub(r"\{[^}]+\}", "PLACEHOLDER", rest)
        try:

... [TRUNCATED] ...
```

### `scripts\run_ruff_format.py`
```
#!/usr/bin/env python3
"""Run a pre-pass (normalize def-signature magic commas + collapse short
multi-line asserts), then `ruff format`, then the kwarg-spacing / import /
string-merge post-pass."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def main(argv: list[str]) -> int:
    files = [arg for arg in argv if Path(arg).exists()]
    if not files:
        return 0

    spacing_script = HERE / "enforce_kwargs_spacing.py"

    # Pre-ruff: normalize def-signature magic commas and strip the magic comma
    # from short multi-line asserts so ruff wraps/joins accordingly.
    pre_cmd = [sys.executable, str(spacing_script), "--pre", *files]
    pre_proc = subprocess.run(pre_cmd)
    if pre_proc.returncode != 0:
        return pre_proc.returncode

    ruff_cmd = [sys.executable, "-m", "ruff", "format", *files]
    ruff_proc = subprocess.run(ruff_cmd)
    if ruff_proc.returncode != 0:
        return ruff_proc.returncode

    spacing_cmd = [sys.executable, str(spacing_script), *files]
    spacing_proc = subprocess.run(spacing_cmd)
    return spacing_proc.returncode


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
```
