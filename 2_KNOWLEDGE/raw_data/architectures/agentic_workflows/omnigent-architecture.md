# Architecture Extract: omnigent

## Directory Structure
```text
omnigent/
    .gitignore
    .pre-commit-config.yaml
    .python-version
    CONTRIBUTING.md
    LICENSE
    NOTICE
    openapi.json
    pyproject.toml
    pyrefly.toml
    railway.toml
    README.md
    render.yaml
    SECURITY.md
    setup.py
    uv.lock
    uv.toml
    .github/
        MAINTAINER
        pull_request_template.md
        ci-deps/
            package.json
        scripts/
            merge-ready/
                compute-gate.sh
                enable-automerge-comment.sh
                enable-automerge-label.sh
                evaluate-checks.sh
                force-merge-eligibility.sh
                load-maintainers.sh
                required.sh
            pr-template/
                format_body.py
                validate.py
        workflows/
            ap-web-tests.yml
            autoformat-pr.yml
            ci.yml
            code-coverage.yml
            e2e-ui.yml
            e2e.yml
            flake-stress.yml
            integration.yml
            lint.yml
            maintainer-approval-rerun-run.yml
            maintainer-approval-rerun.yml
            maintainer-approval.yml
            merge-ready.yml
            oss-publish-images.yml
            oss-regen-on-comment.yml
            oss-regenerate-and-smoke.yml
            oss-scorecard.yml
            release-omnigent.yml
    ap-web/
        .gitignore
        .oxlintrc.json
        .prettierignore
        .prettierrc.json
        components.json
        index.html
        package-lock.json
        package.json
        README.md
        TIPTAP_MIGRATION_NOTES.md
        tsconfig.app.json
        tsconfig.json
        tsconfig.node.json
        vite.config.ts
        vite.embed.config.ts
        electron/
            .gitignore
            package.json
            README.md
            dmg/
                background.tiff
            find/
                index.html
            icons/
                Assets.car
                icon.icns
                icon.ico
                README.md
                AppIcon.icon/
                    icon.json
                    Assets/
            setup/
                index.html
                assets/
            signing/
                entitlements.mac.inherit.plist
                entitlements.mac.plist
                omnigent.provisionprofile
            src/
                find_preload.js
                localhost_cors.js
                main.js
                preload.js
        public/
        src/
            App.tsx
            embed.tsx
            index.css
            index.css.test.ts
            main.tsx
            test-setup.ts
            assets/
            components/
                AgentCard.test.tsx
                AgentCard.tsx
                AgentInfo.test.tsx
                AgentInfo.tsx
                ComposerMicButton.tsx
                CostRoutingControl.test.tsx
                CostRoutingControl.tsx
                OttoEyes.test.tsx
                OttoEyes.tsx
                PermissionsModal.safety.test.tsx
                PermissionsModal.test.tsx
                PermissionsModal.tsx
                PresenceAvatars.test.tsx
                PresenceAvatars.tsx
                RunningDot.tsx
                SessionImage.tsx
                SessionStateBadge.test.tsx
                SessionStateBadge.tsx
                SkillPills.tsx
                SlashCommandMenu.tsx
                UserMessageNav.test.tsx
                UserMessageNav.tsx
                ai-elements/
                    agent.tsx
                    artifact.tsx
                    attachments.tsx
                    audio-player.tsx
                    canvas.tsx
                    chain-of-thought.tsx
                    checkpoint.tsx
                    code-block.tsx
                    commit.tsx
                    confirmation.tsx
                    connection.tsx
                    context.tsx
                    controls.tsx
                    conversation.tsx
                    edge.tsx
                    environment-variables.tsx
                    file-tree.tsx
                    image.tsx
                    inline-citation.tsx
                    jsx-preview.tsx
                    message.test.tsx
                    message.tsx
                    mic-selector.tsx
                    model-selector.tsx
                    node.tsx
                    open-in-chat.tsx
                    package-info.tsx
                    panel.tsx
                    persona.tsx
                    plan.tsx
                    prompt-input.tsx
                    queue.tsx
                    reasoning.test.tsx
                    reasoning.tsx
                    sandbox.tsx
                    schema-display.tsx
                    shimmer.tsx
                    snippet.tsx
                    sources.tsx
                    speech-input.tsx
                    stack-trace.tsx
                    streamdown-security.ts
                    suggestion.tsx
                    task.tsx
                    terminal.tsx
                    test-results.tsx
                    tool.tsx
                    toolbar.tsx
                    transcription.tsx
                    voice-selector.tsx
                    web-preview.tsx
                blocks/
                    ApprovalCard.test.tsx
                    ApprovalCard.tsx
                    AskUserQuestionForm.tsx
                    BlockRenderer.test.tsx
                    BlockRenderer.tsx
                    ExitPlanModeReview.tsx
                    ReasoningView.test.tsx
                    ReasoningView.tsx
                    SlashCommandCard.test.tsx
                    SlashCommandCard.tsx
                    StatusBlocks.tsx
                    SystemMessage.test.tsx
                    SystemMessage.tsx
                    TerminalCommandCard.test.tsx
                    TerminalCommandCard.tsx
                    TerminalSession.test.ts
                    TerminalSession.ts
                    TerminalView.test.tsx
                    TerminalView.tsx
                    ToolCard.test.ts
                    ToolCard.tsx
                icons/
                    ClaudeIcon.tsx
                    CodexIcon.tsx
                    NessieIcon.tsx
                    OttoIcon.test.tsx
                    OttoIcon.tsx
                    PiIcon.tsx
                theme/
                    themeMode.test.ts
                    themeMode.ts
                    ThemeModeMenu.tsx
                    ThemeProvider.tsx
                ui/
                    accordion.tsx
                    alert.tsx
                    avatar.tsx
                    badge.tsx
                    button-group.tsx
                    button.test.tsx
                    button.tsx
                    card.tsx
                    carousel.tsx
                    collapsible.tsx
                    command.tsx
                    dialog.tsx
                    dropdown-menu.tsx
                    hover-card.tsx
                    input-group.tsx
                    input.tsx
                    popover.tsx
                    progress.tsx
                    scroll-area.tsx
                    select.tsx
                    separator.tsx
                    spinner.tsx
                    switch.tsx
                    tabs.tsx
                    textarea.tsx
                    tooltip.tsx
            hooks/
                CommentSenderContext.tsx
                RunnerHealthProvider.test.tsx
                RunnerHealthProvider.tsx
                SessionUpdatesProvider.test.tsx
                SessionUpdatesProvider.tsx
                useActiveConversationId.ts
                useAgents.ts
                useAutoGrowTextarea.test.tsx
                useAutoGrowTextarea.ts
                useAvailableAgents.test.tsx
                useAvailableAgents.ts
                useChildSessions.ts
                useCommentInbox.ts
                useComments.ts
                useConversations.test.ts
                useConversations.ts
                useDebugMode.ts
                useDefaultPolicies.ts
                useDirectorySessions.ts
                useFileContent.test.tsx
                useFileContent.ts
                useFileDiff.ts
                useHostFilesystem.test.ts
                useHostFilesystem.ts
                useHosts.test.tsx
                useHosts.ts
                useIdleNotifications.test.tsx
                useIdleNotifications.ts
                usePermissions.test.tsx
                usePermissions.ts
                usePolicies.ts
                usePromptHistory.test.ts
                usePromptHistory.ts
                useRecentWorkspaces.test.ts
                useRecentWorkspaces.ts
                useResizableColumn.ts
                useResizableCommentsPanel.test.tsx
                useResizableCommentsPanel.ts
                useResizableInlinePanel.test.tsx
                useResizableInlinePanel.ts
                useResizablePanel.test.tsx
                useResizablePanel.ts
                useResizableSidebar.test.tsx
                useResizableSidebar.ts
                useRunnerHealth.test.tsx
                useRunnerHealth.ts
                useSeenComments.test.ts
                useSeenComments.ts
                useSession.ts
                useSessionItems.ts
                useSessionLiveness.test.ts
                useSessionLiveness.ts
                useSessionState.test.ts
                useSessionState.ts
                useSessionSwitchHotkey.test.tsx
                useSessionSwitchHotkey.ts
                useSessionUpdatesConnected.ts
                useTerminals.test.ts
                useTerminals.ts
                useThrottledValue.test.ts
                useThrottledValue.ts
                useUnseenConversations.test.ts
                useUnseenConversations.ts
                useUserMessageNav.test.tsx
                useUserMessageNav.ts
                useUserSearch.ts
                useWorkspaceChangedFiles.test.tsx
                useWorkspaceChangedFiles.ts
                useWriteFileContent.test.tsx
                useWriteFileContent.ts
            lib/
                accountsApi.ts
                agentLabels.ts
                agentPreferences.test.ts
                agentPreferences.ts
                askUserQuestion.test.ts
                askUserQuestion.ts
                blocks.ts
                blockStream.test.ts
                blockStream.ts
                browserNotifications.test.ts
                browserNotifications.ts
                capabilities.ts
                CapabilitiesContext.tsx
                claudeNativeModels.ts
                clipboard.test.ts
                clipboard.ts
                conversationItems.ts
                embedded.tsx
                events.ts
                filesApi.ts
                filesPanelPreferences.test.ts
                filesPanelPreferences.ts
                fileViewPreferences.test.ts
                fileViewPreferences.ts
                forkHarness.test.ts
                forkHarness.ts
                host.test.ts
                host.ts
                identity.test.ts
                identity.ts
                idleTransitions.test.ts
                idleTransitions.ts
                inbox.test.ts
                inbox.ts
                itemsToBlocks.test.ts
                itemsToBlocks.ts
                lastAssistantText.test.ts
                lastAssistantText.ts
                messageAttribution.test.ts
                nativeBridge.test.ts
                nativeBridge.ts
                panelSizePreferences.test.ts
                panelSizePreferences.ts
                permissionsApi.test.ts
                permissionsApi.ts
                presenceIdle.test.ts
                presenceIdle.ts
                previewFormat.test.ts
                previewFormat.ts
                relativeTime.test.ts
                relativeTime.ts
                renderItems.test.ts
                renderItems.ts
                routing.test.tsx
                routing.tsx
                sessionCapabilities.ts
                sessionEvents.test.ts
                sessionListCache.test.ts
                sessionListCache.ts
                sessionsApi.test.ts
                sessionsApi.ts
                sessionStop.test.ts
                sessionStop.ts
                sessionUpdatesSocket.test.ts
                sessionUpdatesSocket.ts
                sessionWorkspaceState.test.ts
                sessionWorkspaceState.ts
                sse.test.ts
                sse.ts
                systemMessage.test.ts
                systemMessage.ts
                toolIcon.ts
                toolTitle.test.ts
                toolTitle.ts
                types.ts
                userBadge.test.ts
                userBadge.ts
                utils.ts
            loadtest/
                streamRenderBench.run.test.ts
                streamRenderBench.ts
            pages/
                ApprovePage.tsx
                ChatPage.composer.test.tsx
                ChatPage.historyLoad.test.tsx
                ChatPage.statusLine.test.tsx
                ChatPage.test.ts
                ChatPage.tsx
                ChatPage.userBubble.test.tsx
                ConnectionIndicator.test.tsx
                effortLevels.test.ts
                InboxPage.tsx
                LoginPage.test.tsx
                LoginPage.tsx
                MembersPage.tsx
                modelPicker.test.ts
                NotFoundPage.tsx
                PoliciesPage.tsx
                RegisterPage.tsx
                RunnerStartingIndicator.test.tsx
                SetupPage.tsx
            shell/
                AccountMenu.tsx
                AddAgentDialog.test.tsx
                AddAgentDialog.tsx
                AppShell.subagent-nav.test.tsx
                AppShell.test.tsx
                AppShell.tsx
                ChatHeader.test.tsx
                ChatHeader.tsx
                CliCommandBlock.tsx
                CodeViewer.test.tsx
                CodeViewer.tsx
                codeViewerHelpers.test.ts
                codeViewerHelpers.ts
                codeViewerRendering.tsx
                CommentsPanel.test.tsx
                CommentsPanel.tsx
                ExecutionLogsPanel.tsx
                FileDownloadButton.tsx
                FilesPanel.test.tsx
                FilesPanel.tsx
                FilesPanelDrawer.tsx
                fileStatusUtils.ts
                FileViewer.test.tsx
                FileViewer.tsx
                FileViewerContext.tsx
                FlatFileList.test.tsx
                FlatFileList.tsx
                FolderTree.test.tsx
                FolderTree.tsx
                ForkDialogContext.tsx
                ForkSessionDialog.test.tsx
                ForkSessionDialog.tsx
                InlineTerminalsSection.test.tsx
                InlineTerminalsSection.tsx
                MainTerminalView.test.tsx
                MainTerminalView.tsx
                MarkdownCommentPlugin.tsx
                MarkdownEditorToolbar.tableAlign.test.tsx
                MarkdownEditorToolbar.test.tsx
                MarkdownEditorToolbar.tsx
                MarkdownRichTextViewer.integration.test.tsx
                MarkdownRichTextViewer.teardown.test.tsx
                MarkdownRichTextViewer.test.tsx
                MarkdownRichTextViewer.tsx
                MobilePanelDrawer.tsx
                MonacoCodeEditor.autosave.test.tsx
                monacoCodeEditor.css
                MonacoCodeEditor.teardown.test.tsx
                MonacoCodeEditor.test.tsx
                MonacoCodeEditor.tsx
                MonacoDiffViewer.test.tsx
                MonacoDiffViewer.tsx
                monacoSetup.ts
                NewChatDialog.flow.test.tsx
                NewChatDialog.test.tsx
                NewChatDialog.tsx
                NewTerminalButton.test.tsx
                NewTerminalButton.tsx
                railTabs.ts
                ReconnectSessionDialog.test.tsx
                ReconnectSessionDialog.tsx
                ResumeWithDirectoryDialog.test.tsx
                ResumeWithDirectoryDialog.tsx
                RunnerAsleepHint.tsx
                SessionRail.tsx
                Sidebar.archive.test.tsx
                Sidebar.delete.test.tsx
                Sidebar.rowActions.test.tsx
                Sidebar.stop.test.tsx
                Sidebar.test.tsx
                Sidebar.tsx
                sidebarNav.test.ts
                sidebarNav.ts
                SubagentsPanel.test.tsx
                SubagentsPanel.tsx
                SwitchAgentDialog.test.tsx
                SwitchAgentDialog.tsx
                tableActions.test.ts
                TableBubbleMenu.tsx
                TerminalFirstContext.tsx
                TerminalsPanel.test.tsx
                TerminalsPanel.tsx
                terminalStatus.test.tsx
                terminalStatus.tsx
                TipTapCommentExtension.ts
                TipTapEditorHelpers.test.ts
                TipTapEditorHelpers.ts
                TipTapGitHubAlert.test.ts
                TipTapGitHubAlert.ts
                TipTapHtmlPassthrough.test.ts
                TipTapHtmlPassthrough.ts
                tiptapMarkdownPatches.ts
                TipTapWorkspaceImage.test.ts
                TipTapWorkspaceImage.ts
                TitleBarServerPicker.tsx
                TodoPanel.tsx
                TruncatedBanner.tsx
                useAutoSave.test.ts
                useAutoSave.ts
                useCursorTooltip.tsx
                useEditorAutoSave.ts
                useMarkdownEditorSync.test.ts
                useMarkdownEditorSync.ts
                useMonacoCommentLayer.tsx
                useTerminalSplit.ts
                useTerminalStatuses.test.tsx
                useTerminalStatuses.ts
                WorkspacePanel.test.tsx
                WorkspacePanel.tsx
                WorkspacePathField.test.tsx
                WorkspacePathField.tsx
                WorkspacePicker.test.tsx
                WorkspacePicker.tsx
            store/
                chatStore.test.ts
                chatStore.ts
                terminalActivity.ts
                types.ts
    deploy/
        README.md
        daytona/
            README.md
            wrangler.toml
            src/
                index.js
        docker/
            .env.example
            bootstrap.sh
            Caddyfile
            config.yaml.example
            docker-compose.https.yaml
            docker-compose.yaml
            Dockerfile
            Dockerfile.dockerignore
            Dockerfile.prebuilt
            entrypoint.py
            README.md
            SKILL.md
        fly/
            fly.toml
            README.md
        hf-spaces/
            Dockerfile
            README.md
        kubernetes/
            README.md
            base/
                configmap.yaml
                deployment.yaml
                ingress.yaml
                kustomization.yaml
                namespace.yaml
                pvc.yaml
                secret.yaml
                service.yaml
            overlays/
                postgres/
                    kustomization.yaml
                    secret-patch.yaml
                    service.yaml
                    statefulset.yaml
        modal/
            modal_app.py
            README.md
        railway/
            README.md
        render/
            README.md
    docs/
        AGENT_YAML_SPEC.md
        POLICIES.md
        images/
    examples/
        debby/
            config.yaml
            agents/
                claude/
                    config.yaml
                gpt/
                    config.yaml
            skills/
                debate/
                    SKILL.md
        polly/
            config.yaml
            agents/
                claude_code/
                    config.yaml
                codex/
                    config.yaml
                pi/
                    config.yaml
            skills/
                cross-review/
                    SKILL.md
                fanout/
                    SKILL.md
                investigate/
                    SKILL.md
    omnigent/
        chat.py
        claude_native.py
        claude_native_bridge.py
        claude_native_forwarder.py
        claude_native_hook.py
        claude_native_message_display_hook.py
        claude_native_state.py
        claude_native_status.py
        cli.py
        cli_auth.py
        cli_diagnostics.py
        cli_sandbox.py
        codex_native.py
        codex_native_app_server.py
        codex_native_bridge.py
        codex_native_elicitation.py
        codex_native_forwarder.py
        codex_native_hook.py
        codex_native_state.py
        conversation_browser.py
        cost_plan.py
        errors.py
        harness_aliases.py
        model_catalog.py
        model_override.py
        native_cost_popup.py
        native_policy_hook.py
        native_terminal.py
        py.typed
        reasoning_effort.py
        resume_dispatch.py
        session_lifecycle.py
        update_check.py
        _e2e_policy_callables.py
        _env_compat.py
        _native_post_delivery.py
        _native_resume_hint.py
        _runner_startup.py
        _startup_profile.py
        _terminal_picker_theme.py
        _wrapper_labels.py
        __init__.py
        __main__.py
        client_tools/
            async_demo.py
            coding.py
            __init__.py
        db/
            alembic.ini
            converters.py
            db_models.py
            utils.py
            __init__.py
            migrations/
                env.py
                script.py.mako
                versions/
                    2a4e0380be0c_add_created_by_to_comments.py
                    3b9be5d67c90_add_archived_to_conversations.py
                    43fb65b29464_initial_schema_agents_files_.py
                    5db033a3d4b7_replace_line_anchor_with_range.py
                    8a4f1e9c2b07_add_policies_table.py
                    93c04fcdff56_add_comments_table.py
                    a1b2c3d4e5f6_drop_inbox_closed_from_tasks.py
                    a2c7e8f19b34_agentic_conversations_schema.py
                    a3b4c5d6e7f8_add_session_policy_columns.py
                    a7b3c9d1e5f2_add_hosts_table_and_host_id.py
                    a7f3c2d18e94_add_terminal_launch_args_to_conversations.py
                    b2c3d4e5f6a7_add_session_usage_to_conversations.py
                    b3d5e7f91a23_add_session_fields_to_conversations.py
                    b5e8d2f1a7c3_add_session_id_to_files.py
                    b7f29e3a1c84_replace_line_col_with_content_offsets.py
                    b8c4f2e7a9d1_add_workspace_to_conversations.py
                    b9c0d1e2f3a4_drop_created_by_from_conversation_items.py
                    b9c1d2e3f4a5_drop_tasks_table.py
                    c1d2e3f4a5b6_add_model_override_to_conversations.py
                    c7f2a1d83e49_add_anchor_content_to_comments.py
                    c9d3a1f2e4b5_add_runner_id_to_conversations.py
                    cad9b3e1f7a2_add_user_daily_cost_table.py
                    caf81af91d9e_add_git_branch_to_conversations.py
                    d4e5f6a7b8c9_add_session_permissions.py
                    d4f1a9c2b8e3_add_ask_approved_to_user_daily_cost.py
                    d7a6b3c91f48_add_session_id_to_agents.py
                    d7e8f9a0b1c2_add_cost_control_mode_override_to_conversations.py
                    d8e2f3b4c910_add_root_conversation_id.py
                    e1c4a7b2f309_add_created_by_to_conversation_items.py
                    e3b1f2a4c9d7_drop_pending_tool_calls_table.py
                    e9f2a7c4d1b8_backfill_unbound_runner_id.py
                    ecc0e25727b0_add_updated_at_to_comments.py
                    f1a2b3c4d5e6_add_sub_agent_name_to_conversations.py
                    f2a3b4c5d6e7_add_session_state_to_conversations.py
                    f8e1a23d6c47_add_external_session_id_to_conversations.py
                    g1a2b3c4d5e6_add_accounts_auth_columns_and_tokens.py
                    h1a2b3c4d5e6_policies_nullable_session_id.py
                    i1a2b3c4d5e6_readd_created_by_to_conversation_items.py
                    j1a2b3c4d5e6_add_idx_conversations_parent.py
                    k1a2b3c4d5e6_add_managed_sandbox_columns_to_hosts.py
                    l1a2b3c4d5e6_add_configured_harnesses_to_hosts.py
                    m1a2b3c4d5e6_add_harness_override_to_conversations.py
        entities/
            account.py
            agent.py
            comment.py
            conversation.py
            environment_filesystem.py
            file.py
            pagination.py
            permission.py
            policy.py
            session_resources.py
            __init__.py
        environments/
            __init__.py
        host/
            connect.py
            daemon_launch.py
            frames.py
            git_worktree.py
            identity.py
            local_server.py
            _daemon_entry.py
            __init__.py
        inner/
            async_utils.py
            banner.py
            bundle_skills.py
            bwrap_sandbox.py
            claude_gateway_shim.py
            claude_native_executor.py
            claude_native_harness.py
            claude_sdk_executor.py
            claude_sdk_harness.py
            codex_executor.py
            codex_harness.py
            codex_native_executor.py
            codex_native_harness.py
            databricks_executor.py
            databricks_supervisor_executor.py
            databricks_supervisor_gateway.py
            databricks_supervisor_harness.py
            datamodel.py
            executor.py
            loader.py
            mascots.py
            native_attachments.py
            openai_agents_sdk_executor.py
            openai_agents_sdk_harness.py
            open_responses_sdk.py
            os_env.py
            pi_executor.py
            pi_harness.py
            policies.py
            sandbox.py
            seatbelt_sandbox.py
            terminal.py
            tools.py
            tracing.py
            _cwd_scan.py
            _seccomp.py
            _subprocess_lifecycle.py
            __init__.py
            egress/
                ca.py
                certs.py
                controller.py
                proxy.py
                relay.py
                rules.py
                __init__.py
            nessie/
                policies.py
                __init__.py
            static/
                chat.html
        llms/
            client.py
            context_window.py
            errors.py
            LLMCLIENT.md
            routing.py
            summarize.py
            types.py
            _responses_to_chat.py
            _usage_observer.py
            __init__.py
            adapters/
                anthropic.py
                base.py
                bedrock.py
                databricks.py
                gemini.py
                openai.py
                vertex.py
                _content.py
                __init__.py
        onboarding/
            ambient.py
            configure_models.py
            databricks_config.py
            detected.py
            harness_install.py
            harness_readiness.py
            interactive.py
            provider_config.py
            provider_selection.py
            secrets.py
            setup.py
            ucode_cleanup.py
            ucode_setup.py
            ucode_state.py
            wizard.py
            __init__.py
            agent/
                AGENTS.md
                config.yaml
                skills/
                    build-omnigent/
                        SKILL.md
                    detect-framework/
                        SKILL.md
                    omnigent-knowledge/
                        SKILL.md
                tools/
                    python/
                        list_builtin_tools.py
                        validate_agent.py
            providers/
                __init__.py
                model_catalog/
                    ai21.json
                    aleph_alpha.json
                    amazon_nova.json
                    anthropic.json
                    anyscale.json
                    azure.json
                    azure_ai.json
                    azure_text.json
                    bedrock.json
                    bedrock_mantle.json
                    cerebras.json
                    cloudflare.json
                    codestral.json
                    cohere.json
                    cohere_chat.json
                    dashscope.json
                    databricks.json
                    deepinfra.json
                    deepseek.json
                    featherless_ai.json
                    fireworks_ai-embedding-models.json
                    fireworks_ai.json
                    friendliai.json
                    gemini.json
                    gigachat.json
                    github_copilot.json
                    gmi.json
                    gradient_ai.json
                    groq.json
                    heroku.json
                    hyperbolic.json
                    lambda_ai.json
                    lemonade.json
                    llamagate.json
                    meta_llama.json
                    minimax.json
                    mistral.json
                    moonshot.json
                    morph.json
                    nebius.json
                    nlp_cloud.json
                    novita.json
                    nscale.json
                    oci.json
                    ollama.json
                    openai.json
                    openrouter.json
                    ovhcloud.json
                    palm.json
                    perplexity.json
                    publicai.json
                    replicate.json
                    sagemaker.json
                    sambanova.json
                    sarvam.json
                    snowflake.json
                    text-completion-codestral.json
                    text-completion-openai.json
                    together_ai.json
                    v0.json
                    vercel_ai_gateway.json
                    vertex_ai.json
                    volcengine.json
                    voyage.json
                    wandb.json
                    watsonx.json
                    xai.json
                    zai.json
                    __init__.py
            sandboxes/
                base.py
                bootstrap.py
                daytona.py
                modal.py
                __init__.py
        policies/
            base.py
            function.py
            registry.py
            schema.py
            types.py
            __init__.py
            builtins/
                cel.py
                cost.py
                github.py
                google.py
                prompt.py
                risk_score.py
                routing.py
                safety.py
                working_dir.py
                _shell.py
                __init__.py
        repl/
            _event_tape.py
            _repl.py
            _resume_picker.py
            _session_log.py
            _theme_picker.py
            _tmux_pane.py
            __init__.py
        resources/
            __init__.py
            examples/
                __init__.py
                debby/
                    config.yaml
                    agents/
                        claude/
                            config.yaml
                        gpt/
                            config.yaml
                    skills/
                        debate/
                            SKILL.md
                polly/
                    config.yaml
                    agents/
                        claude_code/
                            config.yaml
                        codex/
                            config.yaml
                        pi/
                            config.yaml
                    skills/
                        cross-review/
                            SKILL.md
                        fanout/
                            SKILL.md
                        investigate/
                            SKILL.md
        runner/
            app.py
            cost_advisor.py
            cost_judge.py
            environment_filesystem.py
            identity.py
            mcp_manager.py
            pending_approvals.py
            policy.py
            proxy_mcp_manager.py
            resource_registry.py
            routing.py
            tool_dispatch.py
            uc_function.py
            _entry.py
            __init__.py
            transports/
                tcp.py
                uds.py
                __init__.py
                ws_tunnel/
                    frames.py
                    limits.py
                    registry.py
                    serve.py
                    transport.py
                    __init__.py
        runtime/
            agent_cache.py
            caps.py
            compaction.py
            content_resolver.py
            filesystem_registry.py
            inflight_text.py
            llm_retry.py
            pending_elicitations.py
            pending_inputs.py
            prompt.py
            README.md
            session_stream.py
            subagent_block_notifier.py
            telemetry.py
            tool_output.py
            tool_retry.py
            user_session_stream.py
            workflow.py
            _globals.py
            __init__.py
            credentials/
                databricks.py
                __init__.py
            executors/
                base.py
                __init__.py
            harnesses/
                process_manager.py
                _executor_adapter.py
                _runner.py
                _scaffold.py
                __init__.py
            policies/
                approval.py
                builder.py
                enforcement.py
                engine.py
                __init__.py
        sandbox/
            bwrap.py
            seatbelt.py
            __init__.py
        server/
            accounts_bootstrap.py
            accounts_config.py
            accounts_secret.py
            accounts_store.py
            admin_list.py
            API.md
            app.py
            auth.py
            bundles.py
            DBSPEC.md
            host_registry.py
            identity_migration.py
            managed_hosts.py
            mcp_pool.py
            oidc.py
            oidc_access.py
            paas_env.py
            passwords.py
            performance_metrics.py
            permissions.py
            presence.py
            README.md
            schemas.py
            server_config.py
            _elicitation_registry.py
            _runner_transport.py
            _runner_ws_tunnel.py
            __init__.py
            routes/
                accounts_auth.py
                auth.py
                builtin_agents.py
                comments.py
                default_policies.py
                hosts.py
                host_tunnel.py
                policy_registry.py
                runner_tunnel.py
                sessions.py
                session_policies.py
                terminal_attach.py
                _auth_helpers.py
                _codex_elicitation.py
                _host_launch.py
                _host_worktree.py
                _workspace_validation.py
                __init__.py
        spec/
            AGENTSPEC.md
            omnigent.py
            parser.py
            README.md
            tar_utils.py
            types.py
            validator.py
            _omnigent_compat.py
            _omnigent_legacy_shim.py
            __init__.py
        stores/
            host_store.py
            __init__.py
            agent_store/
                sqlalchemy_store.py
                __init__.py
            artifact_store/
                databricks_volumes.py
                local.py
                __init__.py
            comment_store/
                sqlalchemy_store.py
                __init__.py
            conversation_store/
                sqlalchemy_store.py
                __init__.py
            file_store/
                sqlalchemy_store.py
                __init__.py
            permission_store/
                sqlalchemy_store.py
                __init__.py
            policy_store/
                sqlalchemy_store.py
                __init__.py
        terminals/
            registry.py
            ws_bridge.py
            __init__.py
        tools/
            base.py
            local.py
            local_callable.py
            manager.py
            mcp.py
            _elicitation_schema.py
            _pep723.py
            _runner.py
            _srt.py
            __init__.py
            builtins/
                agents.py
                async_inbox.py
                download_file.py
                export_agent.py
                list_comments.py
                list_files.py
                list_models.py
                load_skill.py
                os_env.py
                policy.py
                read_skill_file.py
                search_conversations.py
                spawn.py
                sys_terminal.py
                timer.py
                update_comment.py
                upload_file.py
                web_fetch.py
                web_search.py
                web_search_google.py
                web_search_perplexity.py
                __init__.py
            client_specified/
                __init__.py
    scripts/
        dump_openapi.py
        install_oss.sh
    sdks/
        README.md
        python-client/
            pyproject.toml
            omnigent_client/
                py.typed
                _blocks.py
                _client.py
                _errors.py
                _events.py
                _files.py
                _query.py
                _responses.py
                _server.py
                _session.py
                _sessions.py
                _sessions_chat.py
                _sse.py
                _stream.py
                _tool_handler.py
                _transforms.py
                _types.py
                __init__.py
                tools/
                    _decorator.py
                    _docstring.py
                    _handler.py
                    _schema.py
                    _state.py
                    _strict.py
                    __init__.py
        ui/
            pyproject.toml
            omnigent_ui_sdk/
                py.typed
                __init__.py
                terminal/
                    _completer.py
                    _config.py
                    _formatter.py
                    _host.py
                    _linkify.py
                    _theme.py
                    _tool_renderers.py
                    __init__.py
    tests/
        conftest.py
        known_failures.yaml
        test_claude_native.py
        test_claude_native_bridge.py
        test_claude_native_daemon.py
        test_claude_native_forwarder.py
        test_claude_native_hook.py
        test_claude_native_message_display_hook.py
        test_claude_native_state.py
        test_claude_native_status.py
        test_codex_native.py
        test_codex_native_app_server.py
        test_codex_native_bridge.py
        test_codex_native_forwarder.py
        test_codex_native_hook.py
        test_codex_native_state.py
        test_conversation_browser.py
        test_cost_plan.py
        test_errors.py
        test_harness_aliases.py
        test_integration_model_selection.py
        test_llm_flaky_marker.py
        test_model_catalog.py
        test_model_override.py
        test_model_pools.py
        test_native_codex_provider.py
        test_native_cost_popup.py
        test_native_policy_hook.py
        test_native_post_delivery.py
        test_native_resume_hint.py
        test_native_terminal.py
        test_resume_dispatch.py
        test_sessions_native_messages.py
        test_startup_profile.py
        test_wrapper_labels.py
        _model_pools.py
        _token_usage.py
        __init__.py
        cli/
            test_backend.py
            test_chat.py
            test_cli.py
            test_cli_auth.py
            test_cli_diagnostics.py
            test_configure_models.py
            test_login_databricks.py
            test_pane_picker.py
            test_runner_startup.py
            test_server_lifecycle.py
            test_update_check.py
            __init__.py
        client_tools/
            test_coding_d7_migration.py
            __init__.py
        db/
            test_migrations_sqlite_safe.py
            test_migration_agents_session_id.py
            test_migration_archived.py
            test_migration_comments_updated_at.py
            test_migration_drop_created_by.py
            test_migration_runner_id.py
            test_migration_runner_id_backfill.py
            test_migration_terminal_launch_args.py
            test_migration_workspace.py
            test_utils.py
            __init__.py
        e2e/
            AGENTS.md
            conftest.py
            helpers.py
            test_agents_sdk_basic.py
            test_agent_update.py
            test_archer_local_tool.py
            test_archer_output_files.py
            test_archer_skill_files.py
            test_archer_steering.py
            test_archer_task_queue.py
            test_archer_web_search.py
            test_async_tools_e2e.py
            test_cancel_history.py
            test_cancel_then_file_attachment.py
            test_chat_e2e.py
            test_claude_coder_auto_collect.py
            test_claude_coder_client_tools.py
            test_claude_coder_multi_turn.py
            test_claude_coder_sandbox.py
            test_claude_coder_skills.py
            test_claude_coder_subagent.py
            test_claude_native_cli_resume_e2e.py
            test_client_tool_cancellation_message_e2e.py
            test_client_tool_sse_status_e2e.py
            test_coder_subagent.py
            test_codex_native_cli_cwd_e2e.py
            test_codex_native_cli_resume_e2e.py
            test_codex_skills_filter_e2e.py
            test_comments_e2e.py
            test_comment_tools.py
            test_comment_tools_claude_native.py
            test_conversation_append_race_e2e.py
            test_d6_direct_cancel_e2e.py
            test_d6_parallel_fan_out_e2e.py
            test_d6_sdk_async_dispatch_e2e.py
            test_decorated_tools_e2e.py
            test_default_executor_auto_collect.py
            test_dispatch_fork_repl_e2e.py
            test_filesystem_changed_files_e2e.py
            test_files_upload_e2e.py
            test_file_tools.py
            test_harness_wrap_e2e.py
            test_host_claude_native_e2e.py
            test_host_claude_native_fork_e2e.py
            test_host_codex_native_e2e.py
            test_host_codex_native_fork_e2e.py
            test_host_cross_family_fork_e2e.py
            test_host_e2e.py
            test_image_upload_e2e.py
            test_local_server_lifecycle_e2e.py
            test_named_sub_agent_persistence.py
            test_native_tool_persistence.py
            test_non_git_changed_files_e2e.py
            test_openai_coder_client_tools.py
            test_openai_coder_codex_tools.py
            test_pi_skills_filter_e2e.py
            test_policies_e2e.py
            test_polly_cost_advisor_e2e.py
            test_polly_e2e.py
            test_polly_subagent_model_e2e.py
            test_repl_approval_e2e.py
            test_repl_sessions_approval_e2e.py
            test_run_with_group_timeout.py
            test_sandbox_dependencies.py
            test_sessions_fork_e2e.py
            test_sessions_live_smoke.py
            test_session_tools_claude_native.py
            test_sharing_permissions_e2e.py
            test_steering.py
            test_steering_during_async_drain_e2e.py
            test_subagent_autowake_e2e.py
            test_subagent_elicitation_forwarding_e2e.py
            test_sub_agent_async_client_tool_routing_e2e.py
            test_sub_agent_phase3_e2e.py
            test_switch_agent_e2e.py
            test_switch_agent_native_e2e.py
            test_sys_async_inbox_e2e.py
            test_sys_async_inbox_harness_e2e.py
            test_sys_terminal_e2e.py
            test_tool_dispatch_workflow_client_side_e2e.py
            test_web_fetch_e2e.py
            test_web_search_async_dispatch_e2e.py
            _harness_probes.py
            _native_resume_helpers.py
            _run_with_group_timeout.py
            __init__.py
            omnigent/
                conftest.py
                test_claude_harness_alias_e2e.py
                test_compaction_sessions_native_e2e.py
                test_config_defaults_e2e.py
                test_examples_coverage_sync.py
                test_example_agent_with_os_env.py
                test_example_agent_with_os_env_fork.py
                test_example_agent_with_subagent_session.py
                test_example_agent_with_uc_tools.py
                test_example_claude_code_agent.py
                test_example_coding_supervisor_with_forks.py
                test_example_polly.py
                test_example_rate_limited_search_agent.py
                test_example_secure_research_agent.py
                test_example_secure_research_agent_os_env.py
                test_host_ctrl_c_stop_server.py
                test_per_harness_claude_sdk.py
                test_per_harness_codex.py
                test_per_harness_openai_agents_sdk.py
                test_per_harness_pi.py
                test_pexpect_harness.py
                test_repl_ctrl_c_interrupt.py
                test_repl_ctrl_g_overview.py
                test_repl_ctrl_l_clear.py
                test_repl_ctrl_r_search.py
                test_repl_effort_e2e.py
                test_repl_history_recall.py
                test_repl_inline_tool_streaming.py
                test_repl_model_e2e.py
                test_repl_multiline.py
                test_repl_overview_subagent_visibility.py
                test_repl_overview_terminal_visibility.py
                test_repl_session_lifecycle.py
                test_repl_smoke.py
                test_run_harness_without_agent_e2e.py
                test_run_omnigent.py
                test_run_omnigent_adapter_rejections.py
                test_run_omnigent_coding_supervisor.py
                test_run_omnigent_ctrl_g_subagent_dedup.py
                test_run_omnigent_example_agents.py
                test_run_omnigent_instructions.py
                test_run_omnigent_monotonic_labels.py
                test_run_omnigent_omnigent_model_env.py
                test_run_omnigent_os_env_inherit.py
                test_run_omnigent_policy_enforcement.py
                test_run_omnigent_quiet_startup.py
                test_run_omnigent_rate_limit_approval.py
                test_run_omnigent_resumption.py
                test_run_omnigent_sessions_default.py
                test_run_omnigent_stdio_mcp.py
                test_run_omnigent_supervisor.py
                test_run_omnigent_twelve_shells.py
                test_run_omnigent_url_linkify.py
                test_server_remote_omnigent_autonomous_flows.py
                test_serve_omnigent_routes.py
                test_serve_smoke.py
                test_session_resources_e2e.py
                test_yaml_hello_world.py
                test_yaml_hello_world_real.py
                test_yaml_policies.py
                TODO_omnigent_coverage.md
                _example_helpers.py
                _pexpect_harness.py
                _repl_test_helpers.py
                _snapshot.py
                __init__.py
                snapshots/
                    test_per_harness_claude_sdk.json
                    test_per_harness_codex.json
                    test_per_harness_openai_agents_sdk.json
                    test_per_harness_pi.json
                    test_repl_ctrl_c_interrupt.json
                    test_repl_ctrl_g_overview.json
                    test_repl_ctrl_l_clear.json
                    test_repl_ctrl_r_search.json
                    test_repl_history_recall.json
                    test_repl_multiline.json
                    test_repl_overview_subagent_visibility.json
                    test_repl_overview_terminal_visibility.json
                    test_repl_smoke.json
                    test_serve_omnigent_routes.json
                    test_serve_smoke.json
                    test_yaml_hello_world.json
                    test_yaml_hello_world_real.json
                    test_yaml_policies.json
        e2e_ui/
            conftest.py
            test_agent_picker.py
            test_author_label.py
            test_chat_file_path_links.py
            test_clone_session.py
            test_collab_realtime.py
            test_comments_realtime.py
            test_comment_inbox.py
            test_cross_session_routing.py
            test_idle_notifications.py
            test_initial_prompt_session_switch.py
            test_markdown_editor_comments.py
            test_markdown_rich_rendering.py
            test_mobile_workflow.py
            test_multi_turn_chat.py
            test_queued_message_lifecycle.py
            test_reload_continue.py
            test_reload_persistence.py
            test_right_panel.py
            test_session_updates_stream.py
            test_sharing_journey.py
            test_smoke.py
            test_stale_stream.py
            test_switch_agent_files_tab.py
            test_switch_agent_terminals.py
            test_two_agent_chat.py
            test_working_indicator_reload.py
            __init__.py
        entities/
            test_conversation.py
            test_entities.py
            __init__.py
        environments/
            test_environments.py
            __init__.py
        frontends/
            conftest.py
            __init__.py
            repl/
                __init__.py
            sdk/
                test_async_client_tool_sdk.py
                test_blocks.py
                test_build_tool_handler_concurrency.py
                test_client_query_model.py
                test_client_query_reasoning.py
                test_csi_u_sequences.py
                test_ctrl_c.py
                test_display_width.py
                test_double_render.py
                test_errors.py
                test_file_completer.py
                test_formatter.py
                test_linkify.py
                test_markdown_boundary.py
                test_overflow_render.py
                test_overlay_actions.py
                test_overlay_builder_contract.py
                test_overlay_close_hint.py
                test_overlay_refresh.py
                test_overlay_search.py
                test_overlay_tab_refresh.py
                test_paste_abstraction.py
                test_prompt_expansion.py
                test_session.py
                test_sessions_chat.py
                test_sessions_namespace.py
                test_session_model.py
                test_session_reasoning.py
                test_stream.py
                test_terminal_host.py
                test_theme.py
                test_tool_renderers.py
                test_transforms.py
                test_tui_pipeline.py
                test_tui_resize.py
                test_user_config.py
                _ctrl_c_driver.py
                _double_render_driver.py
                _overflow_render_driver.py
                _overlay_refresh_driver.py
                _overlay_search_driver.py
                _overlay_tab_driver.py
                __init__.py
        host/
            test_cli_host.py
            test_connect.py
            test_daemon_launch.py
            test_frames.py
            test_git_worktree.py
            test_identity.py
            test_local_server.py
            __init__.py
        inner/
            conftest.py
            test_bundle_skills.py
            test_bwrap_sandbox.py
            test_claude_gateway_shim.py
            test_claude_native_executor.py
            test_claude_sdk_executor.py
            test_claude_sdk_harness.py
            test_codex_executor.py
            test_codex_harness.py
            test_codex_native_executor.py
            test_cwd_scan.py
            test_databricks_executor.py
            test_databricks_supervisor_harness.py
            test_datamodel.py
            test_executor.py
            test_loader.py
            test_mascots.py
            test_native_attachments.py
            test_openai_agents_sdk_executor.py
            test_openai_agents_sdk_harness.py
            test_open_responses_sdk.py
            test_os_env.py
            test_os_env_fork.py
            test_pi_executor.py
            test_pi_harness.py
            test_policies.py
            test_sandbox.py
            test_seatbelt_sandbox.py
            test_seccomp.py
            test_terminal.py
            __init__.py
            egress/
                test_ca.py
                test_certs.py
                test_parser_egress.py
                test_proxy.py
                test_relay.py
                test_rules.py
                __init__.py
            fixtures/
                fake_google_mcp_server.py
            nessie/
                test_policies.py
                __init__.py
            sandbox/
                conftest.py
                test_egress_e2e.py
                test_sandbox_behavior.py
                __init__.py
        integration/
            AGENTS.md
            conftest.py
            helpers.py
            model_selection.py
            test_client_tools.py
            test_multi_turn.py
            test_sharing.py
            test_smoke.py
            __init__.py
        llms/
            test_anthropic_adapter.py
            test_bedrock_adapter.py
            test_client.py
            test_content_helpers.py
            test_context_window.py
            test_databricks_adapter.py
            test_gemini_adapter.py
            test_openai_adapter.py
            test_responses_to_chat.py
            test_routing.py
            test_summarize.py
            test_usage_observer.py
            test_vertex_adapter.py
            __init__.py
        onboarding/
            test_ambient.py
            test_databricks_config.py
            test_detected.py
            test_harness_install.py
            test_harness_readiness.py
            test_interactive.py
            test_onboarding_agent.py
            test_providers.py
            test_provider_config.py
            test_provider_selection.py
            test_secrets.py
            test_ucode_cleanup.py
            test_ucode_setup.py
            test_ucode_state.py
            __init__.py
            sandboxes/
                test_bootstrap.py
                test_daytona.py
                test_modal.py
                __init__.py
        policies/
            test_engine.py
            test_engine_read_only.py
            test_registry.py
            __init__.py
            builtins/
                helpers.py
                test_cel.py
                test_cost.py
                test_enforce_sandbox.py
                test_github.py
                test_google.py
                test_prompt.py
                test_risk_score.py
                test_routing.py
                test_safety.py
                test_safety_pii.py
                test_user_daily_cost.py
                test_working_dir.py
                __init__.py
        repl/
            helpers.py
            test_agent_switch_refresh.py
            test_compact_command.py
            test_context_command.py
            test_effort_command.py
            test_elicitation_schema.py
            test_event_tape.py
            test_logs_command.py
            test_model_command.py
            test_repl.py
            test_repl_fork_command.py
            test_repl_pending_model_override.py
            test_report_command.py
            test_resume_picker.py
            test_sessions_chat_adapter.py
            test_session_log.py
            test_theme_command.py
            test_theme_picker.py
            test_tmux_pane.py
        resources/
            test.md
            test.pdf
            __init__.py
            agents/
                sdk-chat-builtin.yaml
                agent_with_os_env_fork/
                    agent_with_os_env_fork.yaml
                    __init__.py
                agent_with_subagent_session/
                    agent_with_subagent_session.yaml
                    __init__.py
                ask-demo/
                    ask-demo.yaml
                claude-coder/
                    claude-coder.yaml
                codex_skills_all/
                    codex_skills_all.yaml
                    skills/
                        codex_e2e_xyz_count_b8d4e7/
                            SKILL.md
                        codex_e2e_xyz_greet_a3f9c2/
                            SKILL.md
                codex_skills_list/
                    codex_skills_list.yaml
                    skills/
                        codex_e2e_xyz_count_b8d4e7/
                            SKILL.md
                        codex_e2e_xyz_greet_a3f9c2/
                            SKILL.md
                codex_skills_none/
                    codex_skills_none.yaml
                    skills/
                        codex_e2e_xyz_count_b8d4e7/
                            SKILL.md
                        codex_e2e_xyz_greet_a3f9c2/
                            SKILL.md
                coding-supervisor/
                    coding-supervisor.yaml
                coding_supervisor_with_forks/
                    coding_supervisor_with_forks.yaml
                    __init__.py
                compaction-test/
                    config.yaml
                inbox_test/
                    inbox_test.yaml
                    tool_functions.py
                    __init__.py
                pi_skills_all/
                    pi_skills_all.yaml
                    skills/
                        pi-e2e-xyz-count-d2f6e1/
                            SKILL.md
                        pi-e2e-xyz-greet-c4a8d5/
                            SKILL.md
                pi_skills_list/
                    pi_skills_list.yaml
                    skills/
                        pi-e2e-xyz-count-d2f6e1/
                            SKILL.md
                        pi-e2e-xyz-greet-c4a8d5/
                            SKILL.md
                pi_skills_none/
                    pi_skills_none.yaml
                    skills/
                        pi-e2e-xyz-count-d2f6e1/
                            SKILL.md
                        pi-e2e-xyz-greet-c4a8d5/
                            SKILL.md
                secure_research_agent_os_env/
                    secure_research_agent_os_env.yaml
                    __init__.py
                skills_all/
                    skills_all.yaml
                skills_list/
                    skills_list.yaml
                skills_none/
                    skills_none.yaml
                supervisor-terminal-test/
                    supervisor-terminal-test.yaml
                sys-terminal-test/
                    sys-terminal-test.yaml
                timer-test/
                    timer-test.yaml
                web-search-test/
                    config.yaml
                workspace-file-writer/
                    workspace-file-writer.yaml
            examples/
                agent_with_client_tools.yaml
                agent_with_os_env.yaml
                agent_with_os_env_bwrap.yaml
                agent_with_os_env_seatbelt.yaml
                agent_with_policies.yaml
                agent_with_tools.yaml
                agent_with_uc_tools.yaml
                chat_model.yaml
                claude_code_agent.yaml
                coding_supervisor.yaml
                hello_world.yaml
                rate_limited_search_agent.yaml
                risk_score_agent.yaml
                secure_research_agent.yaml
                server_config_with_policies.yaml
                swe_org.yaml
                terminal_workers.yaml
                __init__.py
                archer/
                    config.yaml
                    skills/
                        deep-research/
                            SKILL.md
                            references/
                                research-checklist.md
                    tools/
                        python/
                            task_queue.py
                            word_count.py
                coder/
                    coder.yaml
                databricks_supervisor/
                    config.yaml
                    README.md
                openai-coder/
                    openai-coder.yaml
                _shared/
                    native_tool_policies.py
                    rate_limit_policy.py
                    search_rate_limit_policy.py
                    secure_research_policies.py
                    sleep_mcp_server.py
                    tool_functions.py
                    __init__.py
        runner/
            helpers.py
            test_app_claude_native_launch_args.py
            test_app_request_client_tools.py
            test_app_scaffold.py
            test_app_schema_injection.py
            test_app_sessions_native.py
            test_comment_relay.py
            test_cost_advisor.py
            test_cost_judge.py
            test_enforce_sandbox_gate.py
            test_environment_filesystem.py
            test_filesystem_path_isolation_e2e.py
            test_file_tool_dispatch.py
            test_identity.py
            test_mcp_manager.py
            test_pending_approvals.py
            test_policy_tool_dispatch.py
            test_proxy_mcp_manager.py
            test_resource_registry.py
            test_routing.py
            test_runner_dispatch.py
            test_runner_entry.py
            test_runner_filesystem_hardening.py
            test_session_resources.py
            test_skills.py
            test_terminal_resource_attach_ws.py
            test_tool_dispatch_timer.py
            test_uc_function.py
            __init__.py
            transports/
                test_tcp_transport.py
                test_uds_transport.py
                __init__.py
                ws_tunnel/
                    test_frames.py
                    test_registry.py
                    test_serve.py
                    test_tunnel_e2e.py
                    test_ws_attach_e2e.py
                    __init__.py
        runtime/
            test_agent_cache.py
            test_async_completion_drain.py
            test_caps.py
            test_claude_sdk_spawn_env.py
            test_compaction.py
            test_content_resolver.py
            test_executor.py
            test_filesystem_registry.py
            test_inflight_text.py
            test_llm_retry.py
            test_model_override.py
            test_openai_agents_sdk_spawn_env.py
            test_pending_elicitations.py
            test_pending_inputs.py
            test_pi_spawn_env.py
            test_process_manager.py
            test_provider_spawn_env.py
            test_reasoning_effort_validation.py
            test_session_stream.py
            test_subagent_block_notifier.py
            test_telemetry.py
            test_telemetry_integration.py
            test_tool_output.py
            test_tool_retry.py
            test_workflow_history.py
            __init__.py
            credentials/
                test_databricks.py
                __init__.py
            executors/
                test_databricks_supervisor.py
                __init__.py
            harnesses/
                conftest.py
                test_executor_adapter.py
                test_process_manager.py
                test_runner.py
                test_scaffold.py
                test_scaffold_policy_evaluation.py
                _retry_test_harness.py
                _test_executor_adapter_harness.py
                _test_harness.py
                _test_scaffold_harnesses.py
                __init__.py
            policies/
                conftest.py
                test_approval.py
                test_ask_cycle_e2e.py
                test_ask_with_schema_validation.py
                test_builder.py
                test_builder_error_paths.py
                test_builder_session_policies.py
                test_combined_integration.py
                test_conversation_isolation.py
                test_edge_cases.py
                test_enforcement_integration.py
                test_engine_context_bundle.py
                test_engine_session_state.py
                test_engine_skeleton.py
                test_engine_trajectory.py
                test_example_omnigent_yamls.py
                test_four_phase_contract.py
                test_function_policy.py
                test_label_validation.py
                test_policy_llm_client.py
                test_policy_result_shapes.py
                test_sdk_elicitation_wiring.py
                test_session_cost_ask_routing.py
                test_user_daily_cost_routing.py
                test_yaml_full_roundtrip.py
                __init__.py
        sandbox/
            test_sandbox.py
            __init__.py
        server/
            conftest.py
            helpers.py
            test_accounts.py
            test_admin_list.py
            test_app.py
            test_bundles.py
            test_host_registry.py
            test_identity_migration.py
            test_managed_hosts.py
            test_mcp_pool.py
            test_normalize_database_url.py
            test_oidc.py
            test_oidc_access.py
            test_oidc_callback.py
            test_oidc_invites.py
            test_oidc_open_redirect.py
            test_openapi_drift.py
            test_paas_env.py
            test_performance_metrics.py
            test_permissions.py
            test_presence.py
            test_runner_transport.py
            test_schemas.py
            test_server_config.py
            test_stream_events.py
            __init__.py
            integration/
                helpers.py
                mock_llm_server.py
                mock_tool.py
                test_app.py
                test_builtin_agents.py
                test_comments_routes.py
                test_default_policy_routes.py
                test_external_runner_connects.py
                test_hosts_api.py
                test_hosts_filesystem.py
                test_host_liveness_staleness_e2e.py
                test_host_runner_launch_worktree.py
                test_host_session_binding.py
                test_host_tunnel_route.py
                test_lifespan.py
                test_mock_tool.py
                test_routes_sessions_aliases.py
                test_routes_sessions_title.py
                test_runner_ownership.py
                test_runner_tunnel_route.py
                test_sessions_add_agent.py
                test_sessions_attribution.py
                test_sessions_child_sessions.py
                test_sessions_compact.py
                test_sessions_cost_control_override.py
                test_sessions_elicitation_resolve_url.py
                test_sessions_endpoints.py
                test_sessions_fork.py
                test_sessions_harness_override.py
                test_sessions_model_override.py
                test_sessions_permissions.py
                test_sessions_permission_request_hook.py
                test_sessions_policy_evaluate.py
                test_sessions_policy_evaluate_read_only.py
                test_sessions_subagent_context.py
                test_sessions_tool_result_forward.py
                test_sessions_tunnel_three_layer.py
                test_session_host_launch.py
                test_session_policy_routes.py
                test_session_worktree_create.py
                test_session_worktree_delete.py
                __init__.py
            routes/
                test_add_comment_request.py
                test_auth_helpers.py
                test_format_message.py
                test_host_worktree.py
                test_runner_connect_wait.py
                test_sessions_cost_labels.py
                test_sessions_fork.py
                test_sessions_mcp_proxy.py
                test_sessions_mcp_proxy_policy_retry.py
                test_sessions_policy.py
                test_sessions_runner_relay.py
                test_sessions_snapshot.py
                test_sessions_switch_agent.py
                test_sessions_yolo_launch_args.py
                test_session_resources.py
                test_session_updates_ws.py
                test_shell_permission_gate.py
                test_subagent_block_wake.py
                test_terminal_attach.py
                test_workspace_validation.py
                __init__.py
        spec/
            test_load.py
            test_omnigent_adapter.py
            test_omnigent_legacy_shim.py
            test_omnigent_roundtrip.py
            test_omnigent_translator.py
            test_parser.py
            test_policy_parser.py
            test_policy_validator.py
            test_tar_utils.py
            test_tool_runtime.py
            test_types.py
            test_validator.py
            __init__.py
        stores/
            conftest.py
            test_agent_store.py
            test_artifact_store.py
            test_comment_store.py
            test_conversation_labels.py
            test_conversation_store.py
            test_databricks_volumes_artifact_store.py
            test_file_store.py
            test_host_store.py
            test_permission_store.py
            test_session_policy_store.py
            __init__.py
        terminals/
            test_registry.py
            test_ws_bridge.py
            __init__.py
        tools/
            conftest.py
            test_decorator.py
            test_docstring.py
            test_local.py
            test_manager.py
            test_mcp.py
            test_mcp_stdio_e2e.py
            test_pep723.py
            test_schema.py
            test_srt_wrap.py
            test_state.py
            test_strict.py
            test_tool_collision.py
            __init__.py
            builtins/
                test_async_inbox.py
                test_file_tools.py
                test_list_comments.py
                test_load_skill.py
                test_read_skill_file.py
                test_registry_unified.py
                test_sys_session.py
                test_sys_terminal.py
                test_timer.py
                test_update_comment.py
                test_upload_file.py
                test_web_fetch.py
                test_web_search.py
                __init__.py
            client_specified/
                test_client_specified.py
                __init__.py
            fixtures/
                echo_stdio_mcp_server.py
                env_probe_stdio_mcp_server.py
        _fixtures/
            runner_test_harness.py
            agents/
                combined_policies.py
                policies_demo_policies.py
                rate_limit_policies.py
                _async_tools.py
                _decorator_signatures_tools.py
                _echo_tool.py
                _inbox_tools.py
                async-tools-test/
                    async-tools-test.yaml
                client-tool-cancellation-message-test/
                    client-tool-cancellation-message-test.yaml
                combined-policies/
                    combined-policies.yaml
                d6-direct-cancel-test/
                    d6-direct-cancel-test.yaml
                d6-fan-out-test/
                    d6-fan-out-test.yaml
                d6-sdk-async-dispatch-test/
                    d6-sdk-async-dispatch-test.yaml
                decorator-signatures-test/
                    decorator-signatures-test.yaml
                e2e-label-ask-gate/
                    e2e-label-ask-gate.yaml
                e2e-label-gate/
                    e2e-label-gate.yaml
                e2e-output-gate/
                    e2e-output-gate.yaml
                e2e-policy-gate/
                    e2e-policy-gate.yaml
                e2e-prompt-policy/
                    e2e-prompt-policy.yaml
                e2e-subagent-gate/
                    e2e-subagent-gate.yaml
                e2e-subagent-tool-gate/
                    e2e-subagent-tool-gate.yaml
                e2e-tool-gate/
                    e2e-tool-gate.yaml
                e2e-tool-result-gate/
                    e2e-tool-result-gate.yaml
                named-sub-agent-test/
                    named-sub-agent-test.yaml
                policies-demo/
                    policies-demo.yaml
                prompt-policy-demo/
                    prompt-policy-demo.yaml
                rate-limited-search/
                    rate-limited-search.yaml
                secure-research/
                    secure-research.yaml
                sub-agent-async-client-tool-test/
                    sub-agent-async-client-tool-test.yaml
                sub-agent-test/
                    sub-agent-test.yaml
                sys-async-inbox-harness-test/
                    sys-async-inbox-harness-test.yaml
                sys-async-inbox-test/
                    sys-async-inbox-test.yaml
        _helpers/
            live_server.py
            __init__.py
```

## Core Logic Samples

### `openapi.json`
```
{
  "components": {
    "schemas": {
      "AddCommentRequest": {
        "description": "Request body for ``POST /sessions/{id}/comments``.\n\n:param path: File path relative to workspace root,\n    e.g. ``\"src/App.tsx\"``.\n:param body: The comment text.\n:param start_index: 0-based absolute character offset (inclusive)\n    within the file where the anchor range begins.\n:param end_index: 0-based absolute character offset (exclusive)\n    within the file where the anchor range ends.\n:param anchor_content: Plain-text snapshot of the selected range, used\n    to re-anchor the comment after file edits. ``None`` if not provided.",
        "properties": {
          "anchor_content": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Anchor Content"
          },
          "body": {
            "title": "Body",
            "type": "string"
          },
          "end_index": {
            "title": "End Index",
            "type": "integer"
          },
          "path": {
            "title": "Path",
            "type": "string"
          },
          "start_index": {
            "title": "Start Index",
            "type": "integer"
          }
        },
        "required": [
          "path",
          "body",
          "start_index",
          "end_index"
        ],
        "title": "AddCommentRequest",
        "type": "object"
      },
      "AgentObject": {
        "description": "API representation of a registered agent.\n\n:param id: Unique agent identifier, e.g. ``\"ag_abc123\"``.\n:param object: Fixed resource type, always ``\"agent\"``.\n:param name: Human-readable agent name,\n    e.g. ``\"research-agent\"``.\n:param version: Monotonic version counter. Starts at 1,\n    incremented on each update.\n:param description: Optional free-text description of the\n    agent's purpose.\n:param created_at: Unix epoch timestamp of creation.\n:param updated_at: Unix epoch timestamp of the last update,\n    or ``None`` if never updated.\n:param harness: The agent's harness/kind, e.g. ``\"codex\"``,\n    ``\"codex-native\"``, or ``\"claude-native\"`` for\n    ``executor.type: omnigent`` agents, otherwise the executor\n    type (``\"claude_sdk\"``, ``\"agents_sdk\"``). ``None`` when the\n    bundle cannot be loaded. Lets the Web UI Add Agent picker\n    recognise an agent's kind (Codex vs Claude) without\n    hardcoding by name slug.\n:param mcp_servers: MCP servers the agent is connected to\n    (secret fields omitted). Empty list when the spec\n    declares no MCP servers or when the bundle cannot be\n    loaded.\n:param policies: Guardrails policies declared on the agent.\n    Each entry summarises the policy name, type, and\n    phases. Empty list when the spec declares no policies\n    or when the bundle cannot be loaded.\n:param skills: Skills bundled in the agent spec\n    (``skills/<name>/SKILL.md``). Lets the Web UI's\n    new-session composer offer a slash-command menu before a\n    session (and its runner) exists. Host-discovered skills\n    are runner-owned, so they are NOT listed here \u2014 the\n    session snapshot's ``skills`` field carries the merged\n    set once a runner is bound. Empty list when the spec\n    bundles no skills or when the bundle cannot be loaded.\n:param terminals: Terminal names declared in the spec's\n    ``terminals:`` block, in declaration order, e.g.\n    ``[\"shell\"]``. The Web UI gates its \"new terminal\"\n    affordance on this list (creation is only offered for\n    agents with terminal access) and offers these names as\n    the launchable choices. Empty list when the spec\n    declares no terminals or when the bundle cannot be\n    loaded.",
        "properties": {
          "created_at": {
            "title": "Created At",
            "type": "integer"
          },
          "description": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Description"
          },
          "harness": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Harness"
          },
          "id": {
            "title": "Id",
            "type": "string"
          },
          "mcp_servers": {
            "items": {
              "$ref": "#/components/schemas/MCPServerSummary"
            },
            "title": "Mcp Servers",
            "type": "array"
          },
          "name": {
            "title": "Name",
            "type": "string"
          },
          "object": {
            "default": "agent",
            "title": "Object",
            "type": "string"
          },
          "policies": {
            "items": {
              "$ref": "#/components/schemas/PolicySummary"
            },
            "title": "Policies",
            "type": "array"
          },
          "skills": {
            "items": {
              "$ref": "#/components/schemas/SkillSummary"
            },
            "title": "Skills",
            "type": "array"
          },
          "terminals": {
            "items": {
              "type": "string"
            },
            "title": "Terminals",
            "type": "array"
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Updated At"
          },
          "version": {
            "default": 1,
            "title": "Version",
            "type": "integer"
          }
        },
        "required": [
          "id",
          "name",
          "created_at"
        ],
        "title": "AgentObject",
        "type": "object"
      },
      "Body_update_session_agent_v1_sessions__session_id__agent_put": {
        "properties": {
          "bundle": {
            "contentMediaType": "application/octet-stream",
            "title": "Bundle",
            "type": "string"
          }
        },
        "required": [
          "bundle"
        ],
        "title": "Body_update_session_agent_v1_sessions__session_id__agent_put",
        "type": "object"
      },
      "Body_upload_session_file_v1_sessions__session_id__resources_files_post": {
        "properties": {
          "file": {
            "contentMediaType": "application/octet-stream",
            "title": "File",
            "type": "string"
          }
        },
        "required": [
          "file"
        ],
        "title": "Body_upload_session_file_v1_sessions__session_id__resources_files_post",
        "type": "object"
      },
      "CancelledEvent": {
        "description": "Terminal event for a turn cancelled before completion.\n\n:param type: Always ``\"response.cancelled\"``.\n:param response: The final response object with\n    ``status=\"cancelled\"``.",
        "properties": {
          "response": {
            "$ref": "#/components/schemas/ResponseObject"
          },
          "sequence_number": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "default": null,
            "title": "Sequence Number"
          },
          "type": {
            "const": "response.cancelled",
            "title": "Type",
            "type": "string"
          }
        },
        "required": [
          "type",
          "response"
        ],
        "title": "CancelledEvent",
        "type": "object"
      },
      "ClientTaskCancelEvent": {
        "description": "Server-side request that the client cancel a tunneled tool call.\n\nEmitted by ``omnigent/runtime/workflow.py`` when a parent\ncancellation needs to propagate to a long-running async client\ntool. Wire shape matches ``workflow.py:4258-4266``.\n\n:param type: Always ``\"response.client_task.cancel\"``.\n:param task_id: Identifier of the client-side task being\n    cancelled, e.g. ``\"resp_async_abc\"``.\n:param call_id: Synthetic ``call_id`` the SDK uses to\n    reconcile the local task; ``None`` when no pending tool\n    call row exists for the task.",
        "properties": {

... [TRUNCATED] ...
```

### `setup.py`
```
"""Custom setuptools build for omnigent.

Generates ``omnigent/_build_info.py`` at wheel build time so the
CLI's update-check (``omnigent/update_check.py``) can tell the user
when their installed build is stale without having to consult
``git`` or hit a remote endpoint at startup.

All other build configuration lives in ``pyproject.toml``; this
file exists solely to register the cmdclass override that runs the
generator before ``build_py`` copies sources into the wheel.

The generated file is gitignored — it is recreated on every build
and only meaningful at install time, where it travels inside the
wheel alongside the rest of the package.
"""

from __future__ import annotations

import subprocess
import time
from pathlib import Path

from setuptools import setup
from setuptools.command.build_py import build_py


class _GenerateBuildInfo(build_py):
    """Subclass of ``build_py`` that writes ``_build_info.py``.

    The override is the smallest possible intervention: run the
    generator, then defer to the stock ``build_py`` to copy sources
    (including the freshly-written ``_build_info.py``) into the
    wheel's build directory. No other behavior of the build is
    changed.
    """

    def run(self) -> None:
        """Build the web UI, generate ``_build_info.py``, then run build_py."""
        self._build_web_ui()
        self._write_build_info()
        super().run()
        self._bundle_examples()

    def _bundle_examples(self) -> None:
        """Copy bundled example agents into the wheel as real directories.

        ``omnigent/resources/examples/{polly,debby}`` may exist as symlinks
        into the top-level ``examples/`` tree (or not at all) depending on
        the checkout, and setuptools' ``package-data`` never materializes
        symlinks into the built wheel — a directory symlink is not walked.
        A plain ``pip install`` / ``uv tool install`` would then ship a
        package whose ``omnigent.resources.examples`` has no ``polly`` /
        ``debby`` subdir, and bare ``omnigent`` (first-run default → polly)
        dies with "Agent path not found".

        Fix: after ``build_py`` has populated ``build_lib``, copy the real
        example trees from the top-level ``examples/`` dir (present in every
        checkout) into
        ``build_lib/omnigent/resources/examples/<name>`` so every wheel is
        self-contained. This honors the contract documented in cli.py's
        ``_bundled_polly_path``: a symlink in a checkout, a real directory in
        an installed wheel. Editable installs (``uv sync``) resolve the
        in-checkout symlink directly and don't need this.
        """
        import shutil

        root = Path(__file__).resolve().parent
        dest_root = Path(self.build_lib) / "omnigent" / "resources" / "examples"
        for name in ("debby", "polly"):
            src = root / "examples" / name
            if not src.is_dir():
                continue
            dst = dest_root / name
            if dst.is_symlink() or dst.is_file():
                dst.unlink()
            elif dst.is_dir():
                shutil.rmtree(dst)
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copytree(src, dst)

    def _build_web_ui(self) -> None:
        """Build the ap-web SPA into ``omnigent/server/static/web-ui/``.

        The server mounts that directory at ``/`` when present
        (``omnigent/server/app.py``); when absent it serves an
        API-only JSON landing page and the web UI is unreachable.
        The bundle is npm-build output, not tracked in git, so a
        plain ``pip install .`` / ``uv tool install`` from a checkout
        would otherwise ship no UI — the single most common "the web
        UI doesn't load" report.

        Build policy, chosen to fix that case without slowing the
        backend-only dev loop or breaking node-less CI:

        - Skip if ``ap-web/`` is absent (sdists that don't vendor it).
        - Skip if ``OMNIGENT_SKIP_WEB_UI=true``. The hardened CI
          runners ship a system ``npm`` but have no fast registry
          mirror configured for the lint/test shards, so ``npm
          install`` crawls against the public registry and hits the
          600s timeout — 10 wasted minutes per ``uv sync`` for a
          bundle those jobs never serve. They set this env var to opt
          out.
        - Skip if the bundle already exists, UNLESS
          ``OMNIGENT_BUILD_WEB_UI=1`` forces a rebuild. This keeps
          repeat ``uv sync`` fast for backend devs (build once, reuse)
          while letting release builds force a fresh bundle.
        - Otherwise the build MUST succeed: a missing ``npm`` or a
          failing ``npm install`` / ``npm run build`` aborts the
          install with an actionable error. Omnigent needs Node +
          npm at runtime anyway (the Claude / Codex / Pi harness
          CLIs are npm packages), so a node-less machine would get a
          broken install either way — failing here, with a message
          that says how to fix it, beats a silent API-only install
          that surfaces later as "the web UI doesn't load".

        :raises SystemExit: If ``npm`` is not on PATH or the web UI
            build fails, and no skip condition applies.
        """
        import os
        import shutil

        root = Path(__file__).resolve().parent
        web_src = root / "ap-web"
        bundle = root / "omnigent" / "server" / "static" / "web-ui" / "index.html"

        if not (web_src / "package.json").is_file():
            return
        # CI opt-out: exact "true" only — this is set by our own
        # workflows, not user-facing config.
        if os.environ.get("OMNIGENT_SKIP_WEB_UI") == "true":
            return
        force_raw = os.environ.get("OMNIGENT_BUILD_WEB_UI")
        force = force_raw is not None and force_raw.strip().lower() in (
            "1",
            "true",
            "yes",
        )
        if bundle.is_file() and not force:
            return
        npm = shutil.which("npm")
        if npm is None:
            raise SystemExit(
                "omnigent build: npm not found on PATH, so the web UI "
                "cannot be built. Omnigent requires Node.js 22 LTS or "
                "newer with npm (the Claude / Codex / Pi harness CLIs are "
                "npm packages). Install it from "
                "https://nodejs.org/en/download and rerun the install. "
                "To deliberately install without the web UI (API-only "
                "server), set OMNIGENT_SKIP_WEB_UI=true."
            )
        try:
            subprocess.run([npm, "install"], cwd=web_src, check=True, timeout=600)
            subprocess.run([npm, "run", "build"], cwd=web_src, check=True, timeout=600)
        except (subprocess.SubprocessError, OSError) as exc:
            raise SystemExit(
                f"omnigent build: web UI build failed ({exc}). Fix the "
                "failure above (it usually means Node.js is older than the "
                "required 22 LTS, or `npm install` could not reach the npm "
                "registry) and rerun the install. To deliberately install "
                "without the web UI (API-only server), set "
                "OMNIGENT_SKIP_WEB_UI=true."
            ) from exc

    def _write_build_info(self) -> None:
        """Write ``omnigent/_build_info.py`` into the source tree.

        Writing to the source tree (rather than directly into the
        build dir) means editable installs (``pip install -e .``,
        ``uv sync``) also get the file — they're a single
        ``build_py`` invocation against an in-place package — and
        any later non-build code path that does ``from omnigent
        import _build_info`` works without re-running the build.
        """
        target = Path(__file__).resolve().parent / "omnigent" / "_build_info.py"
        commit = _git_sha()
        # Use repr() for the SHA so quoting is always correct, even
        # for an empty fallback. The format is deliberately minimal
        # — anything more elaborate (version strings, branch names)
        # belongs in pyproject.toml or git tags, not here.
        target.write_text(
            '"""Auto-generated at wheel build time; do not edit.\n\n'
            "This module is created by ``setup.py`` immediately before\n"
            "``build_py`` packages the wheel, and is gitignored so it\n"
            "is recreated on every build. Consumers should import it\n"
            "defensively (``try: from omnigent import _build_info``)\n"
            "because source checkouts that have never been built will\n"
            "not have it on disk.\n"
            '"""\n'
            "from __future__ import annotations\n\n"
            f"BUILD_TIME_EPOCH: int = {int(time.time())}\n"
            f"COMMIT_SHA: str = {commit!r}\n"
        )


def _git_sha() -> str:
    """Return the current Git HEAD SHA, or empty string on failure.

    Empty-string fallback is intentional: when this is run inside a
    Docker build context with no ``git`` binary, or when the build
    happens from an sdist that has no ``.git/`` directory, the field

... [TRUNCATED] ...
```

### `.github\ci-deps\package.json`
```
{
  "name": "e2e-ci-deps",
  "version": "0.0.0",
  "private": true,
  "description": "Pinned npm CLIs the e2e workflow installs (claude-code, codex).",
  "dependencies": {
    "@anthropic-ai/claude-code": "2.1.124",
    "@openai/codex": "0.128.0-alpha.1"
  }
}
```

### `.github\scripts\pr-template\format_body.py`
```
#!/usr/bin/env python3
"""Add PR-template scaffolding without deleting the author's text."""

from __future__ import annotations

import re
import sys
from pathlib import Path

from validate import TEST_LABELS, TYPE_LABELS

_HEADING_RE = re.compile(r"(?im)^\s*##\s+(.+?)\s*$")


def _has_heading(body: str, heading: str) -> bool:
    wanted = heading.strip().lower()
    return any(match.group(1).strip().lower() == wanted for match in _HEADING_RE.finditer(body))


def _append_section(body: str, heading: str, content: str) -> str:
    if _has_heading(body, heading):
        return body
    return body.rstrip() + f"\n\n## {heading}\n\n{content.rstrip()}\n"


def _checkbox_block(labels: tuple[str, ...]) -> str:
    return "\n".join(f"- [ ] {label}" for label in labels) + "\n"


def format_body(body: str) -> str:
    """Return *body* with missing PR-template sections appended.

    Existing prose is preserved verbatim. When the body has no Summary
    heading, the existing text is placed under Summary so it remains the
    main description instead of being pushed below the template.
    """
    body = body.strip()
    if not body:
        body = "## Summary\n\n"
    elif not _has_heading(body, "Summary"):
        body = f"## Summary\n\n{body}"

    body = _append_section(
        body,
        "ELI5",
        "<!-- Optional: explain the change in plain language. -->",
    )
    body = _append_section(
        body,
        "Diagram",
        "```mermaid\nflowchart LR\n  A[Before] --> B[Change]\n  B --> C[After]\n```",
    )
    body = _append_section(body, "Type of change", _checkbox_block(TYPE_LABELS))
    body = _append_section(body, "Test coverage", _checkbox_block(TEST_LABELS))
    body = _append_section(
        body,
        "Coverage rationale",
        "Autoformat added this section; please add commands run or explain why "
        "coverage is sufficient.",
    )
    return body.rstrip() + "\n"


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: format_body.py INPUT OUTPUT", file=sys.stderr)
        return 2
    source = Path(sys.argv[1])
    dest = Path(sys.argv[2])
    dest.write_text(format_body(source.read_text()))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

### `.github\scripts\pr-template\validate.py`
```
#!/usr/bin/env python3
"""Validate that a PR description follows the repository template.

The GitHub workflow passes the PR body in PR_BODY. The script is also
unit-tested directly so changes to the template gate are reviewed like
normal code.
"""

from __future__ import annotations

import os
import re
import sys

REQUIRED_HEADINGS = (
    "Summary",
    "Type of change",
    "Test coverage",
    "Coverage rationale",
)

TYPE_LABELS = (
    "Bug fix",
    "Feature",
    "Refactor / chore",
    "Docs",
    "Test / CI",
    "Breaking change",
)

TEST_LABELS = (
    "Unit tests added / updated",
    "Integration tests added / updated",
    "E2E tests added / updated",
    "Manual verification completed",
    "Existing tests cover this change",
    "Not applicable",
)

PLACEHOLDER_FRAGMENTS = (
    "what changed and why",
    "check all that apply",
    "describe the exact commands",
    "describe below",
    "explain why",
    "if you did not add or run tests",
)


class ValidationResult:
    def __init__(self, ok: bool, errors: list[str]) -> None:
        self.ok = ok
        self.errors = errors


_HEADING_RE = re.compile(r"(?im)^\s*##\s+(.+?)\s*$")
_CHECKBOX_RE = re.compile(r"(?im)^\s*-\s*\[(?P<mark>[ xX])\]\s*(?P<label>.+?)\s*$")


def _strip_html_comments(text: str) -> str:
    return re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)


def _heading_spans(body: str) -> dict[str, tuple[int, int]]:
    matches = list(_HEADING_RE.finditer(body))
    spans: dict[str, tuple[int, int]] = {}
    for idx, match in enumerate(matches):
        title = match.group(1).strip().lower()
        start = match.end()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(body)
        spans[title] = (start, end)
    return spans


def _section(body: str, spans: dict[str, tuple[int, int]], heading: str) -> str:
    span = spans.get(heading.lower())
    if span is None:
        return ""
    return body[span[0] : span[1]]


def _checked_labels(section: str, expected_labels: tuple[str, ...]) -> set[str]:
    expected_by_lower = {label.lower(): label for label in expected_labels}
    checked: set[str] = set()
    for match in _CHECKBOX_RE.finditer(section):
        label = match.group("label").strip()
        canonical = expected_by_lower.get(label.lower())
        if canonical and match.group("mark").lower() == "x":
            checked.add(canonical)
    return checked


def _missing_labels(section: str, expected_labels: tuple[str, ...]) -> list[str]:
    present = {match.group("label").strip().lower() for match in _CHECKBOX_RE.finditer(section)}
    return [label for label in expected_labels if label.lower() not in present]


def _meaningful_text(section: str) -> str:
    text = _strip_html_comments(section)
    text = re.sub(r"(?im)^\s*-\s*\[[ xX]\].*$", "", text)
    return text.strip()


def _contains_placeholder(text: str) -> bool:
    lowered = text.lower()
    return any(fragment in lowered for fragment in PLACEHOLDER_FRAGMENTS)


def validate_pr_body(body: str) -> ValidationResult:
    errors: list[str] = []

    spans = _heading_spans(body)
    for heading in REQUIRED_HEADINGS:
        if heading.lower() not in spans:
            errors.append(f"Missing required section: ## {heading}")

    summary = _meaningful_text(_section(body, spans, "Summary"))
    if not summary:
        errors.append("Summary must describe what changed and why.")
    elif _contains_placeholder(summary):
        errors.append("Summary still contains template placeholder text.")

    type_section = _section(body, spans, "Type of change")
    missing_type_labels = _missing_labels(type_section, TYPE_LABELS)
    if missing_type_labels:
        errors.append(
            "Type of change is missing template checkbox(es): " + ", ".join(missing_type_labels)
        )
    checked_types = _checked_labels(type_section, TYPE_LABELS)
    if not checked_types:
        errors.append("Check at least one Type of change checkbox.")

    test_section = _section(body, spans, "Test coverage")
    missing_test_labels = _missing_labels(test_section, TEST_LABELS)
    if missing_test_labels:
        errors.append(
            "Test coverage is missing template checkbox(es): " + ", ".join(missing_test_labels)
        )
    checked_tests = _checked_labels(test_section, TEST_LABELS)
    if not checked_tests:
        errors.append("Check at least one Test coverage checkbox.")

    rationale = _meaningful_text(_section(body, spans, "Coverage rationale"))
    if not rationale:
        errors.append(
            "Coverage rationale must explain tests run/added, or why more coverage is not needed."
        )
    elif _contains_placeholder(rationale):
        errors.append("Coverage rationale still contains template placeholder text.")

    automated_tests = {
        "Unit tests added / updated",
        "Integration tests added / updated",
        "E2E tests added / updated",
        "Existing tests cover this change",
    }
    if checked_tests and checked_tests.isdisjoint(automated_tests):
        if len(rationale.split()) < 8:
            errors.append(
                "When no automated test coverage checkbox is selected, "
                "the rationale must explain why."
            )

    if "Not applicable" in checked_tests and rationale and len(rationale.split()) < 8:
        errors.append(
            "Not applicable test coverage requires a concrete explanation in Coverage rationale."
        )

    return ValidationResult(ok=not errors, errors=errors)


def main() -> int:
    body = os.environ["PR_BODY"]
    result = validate_pr_body(body)
    if result.ok:
        print("PR template validation passed.")
        return 0

    print("PR template validation failed:")
    for error in result.errors:
        print(f"- {error}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
```

### `ap-web\.oxlintrc.json`
```
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "react-hooks", "typescript", "import"],
  "categories": {
    "correctness": "error",
    "suspicious": "warn",
    "perf": "warn"
  },
  "rules": {
    "react/react-in-jsx-scope": "off",
    "import/no-unassigned-import": "off",
    "no-restricted-globals": [
      "error",
      {
        "name": "fetch",
        "message": "Don't call the bare global fetch(). Use hostFetch (@/lib/host) or authenticatedFetch (@/lib/identity) so requests route through the embed host transport. The only allowed bare fetch() is the choke point in src/lib/host.ts."
      }
    ],
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "react-router-dom",
            "importNames": ["useNavigate", "useParams", "useSearchParams", "useLocation", "Link", "Outlet"],
            "message": "Import routing primitives (useNavigate/useParams/useSearchParams/useLocation/Link/Outlet) from @/lib/routing — the routing IoC seam the embed overrides. Route/Routes/BrowserRouter/MemoryRouter are structural and may stay on react-router-dom."
          },
          {
            "name": "react-router",
            "importNames": ["useNavigate", "useParams", "useSearchParams", "useLocation", "Link", "Outlet"],
            "message": "Import routing primitives (useNavigate/useParams/useSearchParams/useLocation/Link/Outlet) from @/lib/routing — the routing IoC seam the embed overrides."
          }
        ]
      }
    ]
  },
  "overrides": [
    {
      "files": ["src/lib/host.ts", "src/lib/accountsApi.ts"],
      "rules": {
        "no-restricted-globals": "off"
      }
    },
    {
      "files": ["src/lib/routing.tsx"],
      "rules": {
        "no-restricted-imports": "off"
      }
    },
    {
      "files": ["**/*.test.ts", "**/*.test.tsx"],
      "rules": {
        "no-restricted-globals": "off",
        "no-restricted-imports": "off"
      }
    },
    {
      "files": ["electron/**"],
      "rules": {
        "no-restricted-globals": "off"
      }
    }
  ],
  "ignorePatterns": [
    "dist",
    "node_modules",
    "src/components/ui",
    "src/components/ai-elements"
  ]
}
```

### `ap-web\.prettierrc.json`
```
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

### `ap-web\components.json`
```
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
```

### `ap-web\package-lock.json`
```
{
  "name": "ap-web",
  "version": "0.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "ap-web",
      "version": "0.0.0",
      "dependencies": {
        "@databricks/sdk-experimental": "^0.17.0",
        "@fontsource-variable/geist-mono": "^5.2.7",
        "@lobehub/fluent-emoji": "^4.1.0",
        "@lobehub/icons": "^5.6.0",
        "@lobehub/ui": "^5.10.2",
        "@monaco-editor/react": "^4.7.0",
        "@radix-ui/react-use-controllable-state": "^1.2.2",
        "@rive-app/react-webgl2": "^4.28.3",
        "@shikijs/monaco": "^4.0.2",
        "@streamdown/cjk": "^1.0.3",
        "@streamdown/code": "^1.1.1",
        "@streamdown/math": "^1.0.2",
        "@streamdown/mermaid": "^1.0.2",
        "@tailwindcss/typography": "^0.5.19",
        "@tanstack/react-query": "^5.100.5",
        "@tiptap/extension-image": "3.23.4",
        "@tiptap/extension-link": "3.23.4",
        "@tiptap/extension-table": "3.23.4",
        "@tiptap/markdown": "3.23.4",
        "@tiptap/pm": "3.23.4",
        "@tiptap/react": "3.23.4",
        "@tiptap/starter-kit": "3.23.4",
        "@xterm/addon-fit": "^0.11.0",
        "@xterm/addon-web-links": "^0.12.0",
        "@xterm/addon-webgl": "^0.19.0",
        "@xterm/xterm": "^6.0.0",
        "@xyflow/react": "^12.10.2",
        "ai": "^6.0.169",
        "ansi-to-react": "^6.2.6",
        "antd": "^6.3.7",
        "class-variance-authority": "^0.7.1",
        "clsx": "^2.1.1",
        "cmdk": "^1.1.1",
        "embla-carousel-react": "^8.6.0",
        "lucide-react": "^1.12.0",
        "media-chrome": "^4.19.0",
        "monaco-editor": "^0.55.1",
        "motion": "^12.38.0",
        "nanoid": "^5.1.9",
        "next-themes": "^0.4.6",
        "radix-ui": "^1.4.3",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-hook-form": "^7.74.0",
        "react-hotkeys-hook": "^5.2.4",
        "react-jsx-parser": "^2.4.1",
        "react-markdown": "^10.1.0",
        "react-router": "6.30.4",
        "react-router-dom": "6.30.4",
        "remark-breaks": "^4.0.0",
        "remark-gfm": "^4.0.1",
        "shadcn": "0.0.0-beta.9d3f70e54",
        "shiki": "^4.0.2",
        "streamdown": "^2.5.0",
        "tailwind-merge": "^3.5.0",
        "tokenlens": "^1.3.1",
        "tw-animate-css": "^1.4.0",
        "use-stick-to-bottom": "^1.1.3",
        "zod": "^4.3.6",
        "zustand": "^5.0.12"
      },
      "devDependencies": {
        "@tailwindcss/vite": "^4.2.4",
        "@testing-library/dom": "^10.4.1",
        "@testing-library/jest-dom": "^6.9.1",
        "@testing-library/react": "^16.3.2",
        "@types/node": "^24.12.2",
        "@types/react": "^19.2.14",
        "@types/react-dom": "^19.2.3",
        "@vitejs/plugin-react": "^6.0.1",
        "ai-elements": "^1.9.0",
        "jsdom": "^29.1.1",
        "oxlint": "^1.62.0",
        "prettier": "^3.8.3",
        "tailwindcss": "^4.2.4",
        "typescript": "~6.0.2",
        "vite": "^8.0.10",
        "vitest": "^4.1.5"
      }
    },
    "node_modules/@adobe/css-tools": {
      "version": "4.5.0",
      "resolved": "https://registry.npmjs.org/@adobe/css-tools/-/css-tools-4.5.0.tgz",
      "integrity": "sha512-6OzddxPio9UiWTCemp4N8cYLV2ZN1ncRnV1cVGtve7dhPOtRkleRyx32GQCYSwDYgaHU3USMm84tNsvKzRCa1Q==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@ai-sdk/gateway": {
      "version": "3.0.126",
      "resolved": "https://registry.npmjs.org/@ai-sdk/gateway/-/gateway-3.0.126.tgz",
      "integrity": "sha512-OHwcwdVkzLo7Rx4eeFyyH3e/vlsYg11HIgKPf5yH6jkptI1Kzq8BX9xZPIBq4BrLBTF2p6pgvWqRfy6AvARGkQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@ai-sdk/provider": "3.0.10",
        "@ai-sdk/provider-utils": "4.0.27",
        "@vercel/oidc": "3.2.0"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "zod": "^3.25.76 || ^4.1.8"
      }
    },
    "node_modules/@ai-sdk/provider": {
      "version": "3.0.10",
      "resolved": "https://registry.npmjs.org/@ai-sdk/provider/-/provider-3.0.10.tgz",
      "integrity": "sha512-Q3BZ27qfpYqnCYGvE3vt+Qi6LGOF9R5Nmzn+9JoM1lCRsD9mYaIhfJLkSunN48nfGXJ6n+XNV0J/XVpqGQl7Dw==",
      "license": "Apache-2.0",
      "dependencies": {
        "json-schema": "^0.4.0"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@ai-sdk/provider-utils": {
      "version": "4.0.27",
      "resolved": "https://registry.npmjs.org/@ai-sdk/provider-utils/-/provider-utils-4.0.27.tgz",
      "integrity": "sha512-ubkAJ+xODouwtmN1tYlvTPphH1hPOBfZaEQe8U7skGvFAnIRs9PPpsq57bC2+Ky/MB4yzhd6YOsxTAx9sGpazw==",
      "license": "Apache-2.0",
      "dependencies": {
        "@ai-sdk/provider": "3.0.10",
        "@standard-schema/spec": "^1.1.0",
        "eventsource-parser": "^3.0.8"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "zod": "^3.25.76 || ^4.1.8"
      }
    },
    "node_modules/@ant-design/colors": {
      "version": "8.0.1",
      "resolved": "https://registry.npmjs.org/@ant-design/colors/-/colors-8.0.1.tgz",
      "integrity": "sha512-foPVl0+SWIslGUtD/xBr1p9U4AKzPhNYEseXYRRo5QSzGACYZrQbe11AYJbYfAWnWSpGBx6JjBmSeugUsD9vqQ==",
      "license": "MIT",
      "dependencies": {
        "@ant-design/fast-color": "^3.0.0"
      }
    },
    "node_modules/@ant-design/cssinjs": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/@ant-design/cssinjs/-/cssinjs-2.1.2.tgz",
      "integrity": "sha512-2Hy8BnCEH31xPeSLbhhB2ctCPXE2ZnASdi+KbSeS79BNbUhL9hAEe20SkUk+BR8aKTmqb6+FKFruk7w8z0VoRQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.11.1",
        "@emotion/hash": "^0.8.0",
        "@emotion/unitless": "^0.7.5",
        "@rc-component/util": "^1.4.0",
        "clsx": "^2.1.1",
        "csstype": "^3.1.3",
        "stylis": "^4.3.4"
      },
      "peerDependencies": {
        "react": ">=16.0.0",
        "react-dom": ">=16.0.0"
      }
    },
    "node_modules/@ant-design/cssinjs-utils": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/@ant-design/cssinjs-utils/-/cssinjs-utils-2.1.2.tgz",
      "integrity": "sha512-5fTHQ158jJJ5dC/ECeyIdZUzKxE/mpEMRZxthyG1sw/AKRHKgJBg00Yi6ACVXgycdje7KahRNvNET/uBccwCnA==",
      "license": "MIT",
      "dependencies": {
        "@ant-design/cssinjs": "^2.1.2",
        "@babel/runtime": "^7.23.2",
        "@rc-component/util": "^1.4.0"
      },
      "peerDependencies": {
        "react": ">=18",
        "react-dom": ">=18"
      }
    },
    "node_modules/@ant-design/fast-color": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/@ant-design/fast-color/-/fast-color-3.0.1.tgz",
      "integrity": "sha512-esKJegpW4nckh0o6kV3Tkb7NPIZYbPnnFxmQDUmL08ukXZAvV85TZBr70eGuke/CIArLaP6aw8lt9KILjnWuOw==",
      "license": "MIT",
      "engines": {
        "node": ">=8.x"
      }
    },
    "node_modules/@ant-design/icons": {
      "version": "6.2.5",
      "resolved": "https://registry.npmjs.org/@ant-design/icons/-/icons-6.2.5.tgz",
      "integrity": "sha512-0hKtoKqTjGFOndUyJLJmC9Cg6k4rEO7rLo6xmgbNJH+/ZX1C57RVals2v1j1knHl9n7Q+sBOveTvn931wLOCKw==",
      "license": "MIT",

... [TRUNCATED] ...
```

### `ap-web\package.json`
```
{
  "name": "ap-web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "build:embed": "vite build --config vite.embed.config.ts",
    "type-check": "tsc -b",
    "preview": "vite preview",
    "lint": "oxlint .",
    "lint:fix": "oxlint --fix .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@databricks/sdk-experimental": "^0.17.0",
    "@fontsource-variable/geist-mono": "^5.2.7",
    "@lobehub/fluent-emoji": "^4.1.0",
    "@lobehub/icons": "^5.6.0",
    "@lobehub/ui": "^5.10.2",
    "@monaco-editor/react": "^4.7.0",
    "@radix-ui/react-use-controllable-state": "^1.2.2",
    "@rive-app/react-webgl2": "^4.28.3",
    "@shikijs/monaco": "^4.0.2",
    "@streamdown/cjk": "^1.0.3",
    "@streamdown/code": "^1.1.1",
    "@streamdown/math": "^1.0.2",
    "@streamdown/mermaid": "^1.0.2",
    "@tailwindcss/typography": "^0.5.19",
    "@tanstack/react-query": "^5.100.5",
    "@tiptap/extension-image": "3.23.4",
    "@tiptap/extension-link": "3.23.4",
    "@tiptap/extension-table": "3.23.4",
    "@tiptap/markdown": "3.23.4",
    "@tiptap/pm": "3.23.4",
    "@tiptap/react": "3.23.4",
    "@tiptap/starter-kit": "3.23.4",
    "@xterm/addon-fit": "^0.11.0",
    "@xterm/addon-web-links": "^0.12.0",
    "@xterm/addon-webgl": "^0.19.0",
    "@xterm/xterm": "^6.0.0",
    "@xyflow/react": "^12.10.2",
    "ai": "^6.0.169",
    "ansi-to-react": "^6.2.6",
    "antd": "^6.3.7",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "embla-carousel-react": "^8.6.0",
    "lucide-react": "^1.12.0",
    "media-chrome": "^4.19.0",
    "monaco-editor": "^0.55.1",
    "motion": "^12.38.0",
    "nanoid": "^5.1.9",
    "next-themes": "^0.4.6",
    "radix-ui": "^1.4.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.74.0",
    "react-hotkeys-hook": "^5.2.4",
    "react-jsx-parser": "^2.4.1",
    "react-markdown": "^10.1.0",
    "react-router": "6.30.4",
    "react-router-dom": "6.30.4",
    "remark-breaks": "^4.0.0",
    "remark-gfm": "^4.0.1",
    "shadcn": "0.0.0-beta.9d3f70e54",
    "shiki": "^4.0.2",
    "streamdown": "^2.5.0",
    "tailwind-merge": "^3.5.0",
    "tokenlens": "^1.3.1",
    "tw-animate-css": "^1.4.0",
    "use-stick-to-bottom": "^1.1.3",
    "zod": "^4.3.6",
    "zustand": "^5.0.12"
  },
  "overrides": {
    "@tiptap/core": "3.23.4",
    "@tiptap/extension-blockquote": "3.23.4",
    "@tiptap/extension-bold": "3.23.4",
    "@tiptap/extension-bubble-menu": "3.23.4",
    "@tiptap/extension-bullet-list": "3.23.4",
    "@tiptap/extension-code": "3.23.4",
    "@tiptap/extension-code-block": "3.23.4",
    "@tiptap/extension-document": "3.23.4",
    "@tiptap/extension-dropcursor": "3.23.4",
    "@tiptap/extension-floating-menu": "3.23.4",
    "@tiptap/extension-gapcursor": "3.23.4",
    "@tiptap/extension-hard-break": "3.23.4",
    "@tiptap/extension-heading": "3.23.4",
    "@tiptap/extension-horizontal-rule": "3.23.4",
    "@tiptap/extension-image": "3.23.4",
    "@tiptap/extension-italic": "3.23.4",
    "@tiptap/extension-link": "3.23.4",
    "@tiptap/extension-list": "3.23.4",
    "@tiptap/extension-list-item": "3.23.4",
    "@tiptap/extension-list-keymap": "3.23.4",
    "@tiptap/extension-ordered-list": "3.23.4",
    "@tiptap/extension-paragraph": "3.23.4",
    "@tiptap/extension-strike": "3.23.4",
    "@tiptap/extension-table": "3.23.4",
    "@tiptap/extension-text": "3.23.4",
    "@tiptap/extension-underline": "3.23.4",
    "@tiptap/extensions": "3.23.4",
    "@tiptap/markdown": "3.23.4",
    "@tiptap/pm": "3.23.4",
    "@tiptap/react": "3.23.4",
    "@tiptap/starter-kit": "3.23.4",
    "dompurify": "^3.4.0",
    "express-rate-limit": {
      "ip-address": "^10.1.1"
    },
    "react": "$react",
    "react-dom": "$react-dom"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.2.4",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/node": "^24.12.2",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "ai-elements": "^1.9.0",
    "jsdom": "^29.1.1",
    "oxlint": "^1.62.0",
    "prettier": "^3.8.3",
    "tailwindcss": "^4.2.4",
    "typescript": "~6.0.2",
    "vite": "^8.0.10",
    "vitest": "^4.1.5"
  }
}
```
