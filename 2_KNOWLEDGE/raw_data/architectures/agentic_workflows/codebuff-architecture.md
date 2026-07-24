# Architecture Extract: codebuff

## Directory Structure
```text
codebuff/
    .bun-version
    .codebuffignore
    .gitignore
    .prettierrc
    AGENTS.md
    bun.lock
    bunfig.toml
    CONTRIBUTING.md
    eslint.config.js
    LICENSE
    NOTICE
    package.json
    README.md
    README.zh-CN.md
    SECURITY.md
    tsconfig.base.json
    tsconfig.json
    WINDOWS.md
    agents/
        base-chat.ts
        basher.ts
        constants.ts
        context-pruner.ts
        package.json
        tmux-cli.ts
        tsconfig.json
        base2/
            base-deep-evals.ts
            base-deep.ts
            base2-evals.ts
            base2-fast-no-validation.ts
            base2-fast.ts
            base2-free-deepseek-flash.ts
            base2-free-deepseek.ts
            base2-free-evals.ts
            base2-free-kimi.ts
            base2-free-mimo-pro.ts
            base2-free-mimo.ts
            base2-free-minimax-m3.ts
            base2-free.ts
            base2-gemini-evals.ts
            base2-kimi-2-7-code.ts
            base2-lite.ts
            base2-max-evals.ts
            base2-max.ts
            base2-mimo.ts
            base2-plan.ts
            base2.ts
        browser-use/
            browser-use.test.ts
            browser-use.ts
        e2e/
            base-deep.e2e.test.ts
            base2-free-summary-format.e2e.test.ts
            context-pruner.e2e.test.ts
            context-pruning-threshold.e2e.test.ts
            editor-best-of-n.e2e.test.ts
            file-explorer.e2e.test.ts
            gravity-index.e2e.test.ts
        editor/
            editor-gpt-5.ts
            editor.ts
            best-of-n/
                best-of-n-selector2.ts
                editor-implementor-fable.ts
                editor-implementor-gpt-5.ts
                editor-implementor.ts
                editor-multi-prompt.ts
        file-explorer/
            code-searcher.ts
            directory-lister.ts
            file-lister-max.ts
            file-lister.ts
            file-picker-max.ts
            file-picker.ts
            glob-matcher.ts
        general-agent/
            general-agent.ts
            gpt-5-agent.ts
            opus-agent.ts
        librarian/
            librarian.test.ts
            librarian.ts
        researcher/
            researcher-docs.ts
            researcher-web.ts
        reviewer/
            code-reviewer-deepseek-flash.ts
            code-reviewer-deepseek.ts
            code-reviewer-fable.ts
            code-reviewer-gpt.ts
            code-reviewer-kimi.ts
            code-reviewer-lite.ts
            code-reviewer-mimo-pro.ts
            code-reviewer-mimo.ts
            code-reviewer-minimax-m3.ts
            code-reviewer-minimax.ts
            code-reviewer.ts
            multi-prompt/
                code-reviewer-multi-prompt.ts
        thinker/
            thinker-gemini.ts
            thinker-gpt.ts
            thinker-with-files-gemini.ts
            thinker.ts
            best-of-n/
                thinker-best-of-n-fable.ts
                thinker-best-of-n.ts
                thinker-selector-fable.ts
                thinker-selector.ts
        types/
            agent-definition.ts
            secret-agent-definition.ts
            tools.ts
            util-types.ts
        __tests__/
            base2.test.ts
            basher.test.ts
            context-pruner.test.ts
            editor.test.ts
            file-picker.test.ts
            thinker.test.ts
    assets/
    cli/
        .gitignore
        package.json
        README.md
        tsconfig.json
        release/
            http.js
            index.js
            package.json
            postinstall.js
            README.md
        release-staging/
            http.js
            index.js
            package.json
            postinstall.js
            README.md
        scripts/
            build-binary.ts
            prebuild-agents.ts
            release.ts
            smoke-binary.ts
            test-sdk-file-hooks.sh
            validate-cli-with-tmux.sh
        src/
            app.tsx
            chat.tsx
            cli-args.ts
            index.tsx
            project-files.ts
            agents/
                bundled-agents.generated.d.ts
            commands/
                ads.ts
                command-registry.ts
                help.ts
                image.ts
                init.ts
                prompt-builders.ts
                publish.ts
                router-utils.ts
                router.ts
                usage.ts
                __tests__/
                    bash-command.test.ts
                    command-args.test.ts
                    freebuff-command-aliases.test.ts
                    image.test.ts
                    init.test.ts
                    router-connect-chatgpt.test.ts
                    router-input.test.ts
            components/
                ad-banner.tsx
                agent-checklist.tsx
                agent-mode-toggle.tsx
                attachment-card.tsx
                bottom-banner.tsx
                build-mode-buttons.tsx
                button.tsx
                chat-history-screen.tsx
                chat-input-bar.tsx
                chatgpt-connect-banner.tsx
                clickable.tsx
                collapse-button.tsx
                copy-button.tsx
                elapsed-timer.tsx
                error-boundary.tsx
                feedback-container.tsx
                feedback-icon-button.tsx
                feedback-input-mode.tsx
                file-attachment-card.tsx
                freebuff-active-session-summary.tsx
                freebuff-model-selector.tsx
                freebuff-superseded-screen.tsx
                grid-layout.tsx
                help-banner.tsx
                highlighted-text.tsx
                image-card.tsx
                image-thumbnail.tsx
                input-cursor.tsx
                input-mode-banner.tsx
                load-previous-button.tsx
                login-modal.tsx
                message-block.tsx
                message-footer.tsx
                message-with-agents.tsx
                mode-divider.tsx
                multiline-input.tsx
                out-of-credits-banner.tsx
                pending-attachments-banner.tsx
                pending-bash-message.tsx
                progress-bar.tsx
                project-picker-screen.tsx
                publish-confirmation.tsx
                publish-container.tsx
                raised-pill.tsx
                review-screen.tsx
                scroll-to-bottom-button.tsx
                segmented-control.tsx
                selectable-list.tsx
                selected-chips.tsx
                separator.tsx
                session-ended-banner.tsx
                shimmer-text.tsx
                status-bar.tsx
                subscription-limit-banner.tsx
                suggestion-menu.tsx
                terminal-command-display.tsx
                terminal-link.tsx
                text-attachment-card.tsx
                thinking.tsx
                top-banner.tsx
                usage-banner.tsx
                user-error-banner.tsx
                validation-error-popover.tsx
                waiting-room-screen.tsx
                ask-user/
                    constants.ts
                    index.tsx
                    components/
                        accordion-question.tsx
                        custom-answer-input.tsx
                        options-list.tsx
                        question-header.tsx
                        question-option.tsx
                    utils/
                        validation.ts
                    __tests__/
                        multiple-choice-form.test.ts
                        validation.test.ts
                blocks/
                    agent-block-grid.tsx
                    agent-branch-item.tsx
                    agent-branch-wrapper.tsx
                    agent-list-branch.tsx
                    ask-user-branch.tsx
                    block-helpers.ts
                    blocks-renderer.tsx
                    content-with-markdown.tsx
                    image-block.tsx
                    implementor-row.tsx
                    single-block.tsx
                    thinking-block.tsx
                    tool-block-group.tsx
                    tool-branch.tsx
                    user-content-copy.tsx
                renderers/
                    plan-box.tsx
                tools/
                    apply-patch.tsx
                    code-search.tsx
                    composio.tsx
                    diff-viewer.tsx
                    glob.tsx
                    gravity-index.tsx
                    list-directory.tsx
                    read-docs.tsx
                    read-files.tsx
                    read-subtree.tsx
                    read-url.tsx
                    registry.ts
                    render-ui.tsx
                    run-terminal-command.tsx
                    skill.tsx
                    str-replace.tsx
                    suggest-followups.tsx
                    task-completed.tsx
                    tool-call-item.tsx
                    types.ts
                    web-search.tsx
                    write-file.tsx
                    write-todos.tsx
                    __tests__/
                        apply-patch.test.tsx
                        code-search.test.tsx
                        gravity-index.test.ts
                        render-ui.test.tsx
                        run-terminal-command.test.ts
                __tests__/
                    ad-banner.test.tsx
                    grid-layout.integration.test.tsx
                    grid-layout.test.tsx
                    message-block.completion.test.tsx
                    message-block.streaming.test.tsx
                    message-with-agents.test.tsx
                    multiline-input.test.tsx
                    selectable-list.test.ts
                    status-indicator.test.tsx
                    user-error-banner.test.tsx
            data/
                slash-commands.ts
            hooks/
                stream-state.ts
                use-activity-query.ts
                use-agent-validation.ts
                use-ask-user-bridge.ts
                use-auth-query.ts
                use-auth-state.ts
                use-chat-input.ts
                use-chat-keyboard.ts
                use-chat-messages.ts
                use-chat-state.ts
                use-chat-streaming.ts
                use-chat-ui.ts
                use-clipboard.ts
                use-connection-status.ts
                use-directory-browser.ts
                use-elapsed-time.ts
                use-event.ts
                use-exit-handler.ts
                use-fetch-login-url.ts
                use-fingerprint.ts
                use-freebuff-ctrl-c-exit.ts
                use-freebuff-session-progress.ts
                use-freebuff-session.ts
                use-freebuff-streak-query.ts
                use-gravity-ad.ts
                use-grid-layout.ts
                use-input-history.ts
                use-login-keyboard-handlers.ts
                use-login-polling.ts
                use-logo.tsx
                use-message-queue.ts
                use-now.ts
                use-path-tab-completion.ts
                use-publish-mutation.ts
                use-queue-controls.ts
                use-queue-ui.ts
                use-scroll-management.ts
                use-searchable-list.ts
                use-send-message.ts
                use-sheen-animation.tsx
                use-subscription-query.ts
                use-suggestion-engine.ts
                use-terminal-breakpoints.ts
                use-terminal-dimensions.ts
                use-terminal-focus.ts
                use-terminal-layout.ts
                use-theme.tsx
                use-timeout.ts
                use-update-preference.ts
                use-usage-monitor.ts
                use-usage-query.ts
                use-user-details-query.ts
                use-why-did-you-update.ts
                helpers/
                    send-message.ts
                    __tests__/
                        send-message.test.ts
                __tests__/
                    use-activity-query.test.ts
                    use-ask-user-bridge.test.ts
                    use-auth-query.test.ts
                    use-connection-status.test.ts
                    use-directory-browser.test.ts
                    use-grid-layout.test.ts
                    use-input-history.test.ts
                    use-path-tab-completion.test.ts
                    use-queue-controls.test.ts
                    use-searchable-list.test.ts
                    use-send-message-timer.test.ts
                    use-suggestion-engine-mention.test.ts
                    use-suggestion-engine.test.ts
                    use-terminal-layout.test.ts
                    use-timeout.test.ts
                    use-usage-query.test.ts
                    use-user-details-query.test.ts
            init/
                init-app.ts
                init-direnv.ts
                __tests__/
                    init-direnv.test.ts
            login/
                constants.ts
                login-flow.ts
                plain-login.ts
                utils.ts
            native/
                ripgrep.ts
            polyfills/
                bun-strip-ansi.ts
            pre-init/
                tree-sitter-wasm.ts
            state/
                chat-history-store.ts
                chat-store.ts
                feedback-store.ts
                freebuff-model-store.ts
                freebuff-session-store.ts
                login-store.ts
                message-block-store.ts
                publish-store.ts
                review-store.ts
                __tests__/
                    feedback-store.test.ts
            testing/
                env.ts
            types/
                chat-state.ts
                chat.ts
                env.ts
                freebuff-session.ts
                function-params.ts
                react19-compat.d.ts
                store.ts
                theme-system.ts
                utils.ts
                contracts/
                    send-message.ts
            utils/
                activity-tracker.ts
                agent-display.ts
                agent-helpers.ts
                agent-id-utils.ts
                analytics.ts
                arrays.ts
                auth.ts
                bash-context-processor.ts
                bash-messages.ts
                block-margins.ts
                block-operations.ts
                block-processor.ts
                chat-history.ts
                chat-input-key-intercept.ts
                chat-scroll-accel.ts
                chatgpt-oauth.ts
                clipboard-image.ts
                clipboard.ts
                code-search-summary.ts
                codebuff-api.ts
                codebuff-client.ts
                collapse-helpers.ts
                constants.ts
                create-event-handler-state.ts
                create-run-config.ts
                detect-shell.ts
                directory-browser.ts
                env.ts
                error-handling.ts
                error-messages.ts
                feedback-helpers.ts
                feedback-submission.ts
                fetch-usage.ts
                fingerprint.ts
                format-elapsed-time.ts
                format-session-units.ts
                format-timeout.ts
                format-validation-errors-for-message.ts
                freebuff-agent-selection.ts
                freebuff-exit.ts
                freebuff-instance-owner.ts
                freebuff-model-navigation.ts
                freebuff-premium-reset.ts
                freebuff-session-display.ts
                git.ts
                helpers.ts
                image-display.ts
                image-handler.ts
                image-processor.ts
                image-thumbnail.ts
                implementor-helpers.ts
                input-modes.ts
                keyboard-actions.ts
                keypad-keys.ts
                layout-helpers.ts
                local-agent-registry.ts
                logger.ts
                markdown-renderer.tsx
                math.ts
                message-block-helpers.ts
                message-history.ts
                message-tree-utils.ts
                message-updater.ts
                open-file.ts
                open-url.ts
                path-completion.ts
                path-helpers.ts
                pending-attachments.ts
                project-picker.ts
                recent-projects.ts
                renderer-cleanup.ts
                run-state-storage.ts
                sdk-event-handlers.ts
                send-message-helpers.ts
                send-message-timer.ts
                settings.ts
                skill-registry.ts
                spawn-agent-matcher.ts
                status-indicator-state.ts
                stream-chunk-processor.ts
                strings.ts
                subscription.ts
                syntax-highlighter.tsx
                terminal-color-detection.ts
                terminal-enter-detection.ts
                terminal-images.ts
                terminal-title.ts
                text-layout.ts
                theme-config.ts
                theme-system.ts
                think-tag-parser.ts
                time-format.ts
                trace-writer.ts
                ui-constants.ts
                usage-banner-state.ts
                validation-error-formatting.ts
                validation-error-helpers.ts
                word-wrap-utils.ts
                yield-to-event-loop.ts
                __tests__/
                    activity-tracker.test.ts
                    agent-display.test.ts
                    analytics-client.test.ts
                    arrays.test.ts
                    bash-context-processor.test.ts
                    block-processor.test.ts
                    chat-history.test.ts
                    chat-input-key-intercept.test.ts
                    chatgpt-oauth.test.ts
                    clipboard.test.ts
                    code-search-summary.test.ts
                    codebuff-api.test.ts
                    collapse-helpers.test.ts
                    error-handling.test.ts
                    feedback-helpers.test.ts
                    feedback-submission.test.ts
                    fetch-usage.test.ts
                    fingerprint.test.ts
                    format-elapsed-time.test.ts
                    format-timeout.test.ts
                    freebuff-instance-owner.test.ts
                    freebuff-model-navigation.test.ts
                    freebuff-premium-reset.test.ts
                    freebuff-session-display.test.ts
                    image-dimensions.test.ts
                    image-processor.test.ts
                    implementor-helpers.test.ts
                    keyboard-actions.test.ts
                    layout-helpers.test.ts
                    markdown-renderer.test.tsx
                    message-block-helpers.test.ts
                    message-updater.test.ts
                    osc-timeout-scenarios.test.ts
                    pending-attachments.test.ts
                    run-state-storage.test.ts
                    sdk-event-handlers.test.ts
                    send-message-helpers.test.ts
                    send-message-timer.test.ts
                    strings.test.ts
                    terminal-color-detection.test.ts
                    terminal-enter-detection.test.ts
                    text-layout.test.ts
                    think-tag-parser.test.ts
                    trace-writer.test.ts
                    trim-chat-logs.test.ts
                    usage-banner-state.test.ts
                    validation-error-formatting.test.ts
            __tests__/
                bash-mode.test.ts
                cli-args.test.ts
                e2e-cli.test.ts
                home-directory-detection.test.ts
                integration-tmux.test.ts
                path-completion.test.ts
                README.md
                rerender-perf.integration.test.ts
                test-utils.ts
                tmux-poc.ts
                e2e/
                    first-time-login.test.ts
                    logout-relogin-flow.test.ts
                    returning-user-auth.test.ts
                helpers/
                    mock-api-client.ts
                integration/
                    api-integration.test.ts
                    credentials-storage.test.ts
                    local-agents.test.ts
                    login-polling-working.test.ts
                    usage-refresh-on-completion.test.ts
                mocks/
                    hover-toggle-controller.ts
                release/
                    proxy-http-get.test.ts
                unit/
                    agent-mode-toggle.test.ts
                    copy-button.test.ts
                    create-run-config.test.ts
                    publish-confirmation.test.ts
                    segmented-control.test.ts
                utils/
                    env.test.ts
                    project-picker.test.ts
    common/
        package.json
        tsconfig.json
        src/
            actions.ts
            analytics-core.ts
            analytics.ts
            browser-actions.ts
            env-ci.ts
            env-process.ts
            env-schema.ts
            env.ts
            old-constants.ts
            project-file-tree.ts
            testing-env-ci.ts
            testing-env-process.ts
            api-keys/
                constants.ts
            constants/
                agents.ts
                analytics-events.ts
                anthropic.ts
                byok.ts
                chatgpt-oauth.ts
                composio.ts
                feedback.ts
                free-agents.ts
                freebuff-gemini-thinker.ts
                freebuff-models.ts
                freebuff-referral-tiers.ts
                grant-priorities.ts
                images.ts
                index.ts
                knowledge.ts
                limits.ts
                model-config.ts
                paths.ts
                skills.ts
                subscription-plans.ts
                ui.ts
            mcp/
                client.ts
            schemas/
                feedback.ts
            templates/
                agent-validation.ts
                initial-agents-dir/
                    LICENSE
                    my-custom-agent.ts
                    package.json
                    README.md
                    examples/
                        01-basic-diff-reviewer.ts
                        02-intermediate-git-committer.ts
                        03-advanced-file-explorer.ts
                    skills/
                        README.md
                        example-skill/
                            SKILL.md
                    types/
                        agent-definition.ts
                        tools.ts
                        util-types.ts
            testing/
                errors.ts
                index.ts
                mock-modules.ts
                mock-types.ts
                setup.ts
                TESTING_PATTERNS.md
                fixtures/
                    agent-runtime.ts
                impl/
                    agent-runtime.ts
                mocks/
                    analytics.ts
                    child-process.ts
                    crypto.ts
                    database.ts
                    fetch.ts
                    filesystem.ts
                    index.ts
                    logger.ts
                    stream.ts
                    timers.ts
                    tree-sitter.ts
            tools/
                compile-tool-definitions.ts
                constants.ts
                list.ts
                utils.ts
                params/
                    utils.ts
                    tool/
                        add-message.ts
                        add-subgoal.ts
                        apply-patch.ts
                        ask-user.ts
                        browser-logs.ts
                        code-search.ts
                        composio.ts
                        create-plan.ts
                        end-turn.ts
                        find-files.ts
                        glob.ts
                        gravity-index.ts
                        list-directory.ts
                        lookup-agent-info.ts
                        propose-str-replace.ts
                        propose-write-file.ts
                        read-docs.ts
                        read-files.ts
                        read-subtree.ts
                        read-url.ts
                        render-ui.ts
                        run-file-change-hooks.ts
                        run-terminal-command.ts
                        set-messages.ts
                        set-output.ts
                        skill.ts
                        spawn-agent-inline.ts
                        spawn-agents.ts
                        str-replace.ts
                        suggest-followups.ts
                        task-completed.ts
                        think-deeply.ts
                        update-subgoal.ts
                        web-search.ts
                        write-file.ts
                        write-todos.ts
                    __tests__/
                        coerce-to-array.test.ts
                __tests__/
                    compile-tool-definitions.test.ts
            types/
                agent-template.ts
                bun-test.d.ts
                dynamic-agent-template.ts
                filesystem.ts
                freebuff-session.ts
                freebuff-streak.ts
                function-params.ts
                grant.ts
                gravity-index.ts
                json.ts
                mcp.ts
                organization.ts
                print-mode.ts
                publisher.ts
                session-state.ts
                skill.ts
                source.ts
                spawn.ts
                subscription.ts
                usage.ts
                util.ts
                api/
                    agents/
                        publish.ts
                contracts/
                    agent-runtime.ts
                    analytics.ts
                    bigquery.ts
                    billing.ts
                    client.ts
                    database.ts
                    env.ts
                    llm.ts
                    logger.ts
                    trace.ts
                messages/
                    codebuff-message.ts
                    content-part.ts
                    data-content.ts
                    provider-metadata.ts
                __tests__/
                    dynamic-agent-template.test.ts
            util/
                agent-file-utils.ts
                agent-id-parsing.ts
                agent-name-normalization.ts
                agent-name-resolver.ts
                analytics-dispatcher.ts
                analytics-log.ts
                analytics-sampling.ts
                array.ts
                cache-debug.ts
                credentials.ts
                currency.ts
                dates.ts
                error.ts
                file.ts
                format-code-search.ts
                freebuff-privacy.ts
                freebuff-streak.ts
                lru-cache.ts
                messages.ts
                min-heap.ts
                model-utils.ts
                object.ts
                partial-json-delta.ts
                promise.ts
                random.ts
                saxy.ts
                skills.ts
                split-data.ts
                stop-sequence.ts
                string.ts
                system-info.ts
                xml-parser.ts
                xml.ts
                zod-schema.ts
                zoned-time.ts
                __tests__/
                    analytics-dispatcher.test.ts
                    analytics-log.test.ts
                    analytics-sampling.test.ts
                    error-abort.test.ts
                    error-api-details.test.ts
                    format-code-search.test.ts
                    freebuff-streak.test.ts
                    messages.test.ts
                    partial-json-delta.test.ts
                    promise.test.ts
                    saxy.test.ts
                    split-data.test.ts
                    string.test.ts
                    zoned-time.test.ts
            utils/
                ask-user-bridge.ts
            __tests__/
                agent-validation.test.ts
                dynamic-agent-template-schema.test.ts
                env-ci.test.ts
                env-process.test.ts
                free-agents.test.ts
                freebuff-models.test.ts
                freebuff-referral-tiers.test.ts
                handlesteps-parsing.test.ts
                model-config.test.ts
                project-file-tree.test.ts
                user-state.test.ts
    docs/
        agents-and-tools.md
        testing.md
    evals/
        logger.ts
        package.json
        tsconfig.json
        buffbench/
            agent-runner.ts
            analyze-task-scores.ts
            eval-codebuff-hard.json
            eval-codebuff.json
            eval-codebuff2.json
            eval-manifold-hard.json
            eval-manifold.json
            eval-manifold2.json
            eval-plane-hard.json
            eval-plane.json
            eval-plane2.json
            eval-saleor-hard.json
            eval-saleor.json
            eval-saleor2.json
            eval-task-generator.ts
            filter-supplemental-files.ts
            format-output.ts
            gen-evals.ts
            gen-repo-eval.ts
            judge.ts
            lessons-extractor.ts
            main-hard-tasks.ts
            main-single-eval.ts
            main.ts
            meta-analyzer.ts
            pick-commits.ts
            README.md
            run-buffbench.ts
            setup-test-repo.ts
            trace-analyzer.ts
            trace-utils.ts
            types.ts
            runners/
                claude.ts
                codebuff.ts
                codex.ts
                index.ts
                opencode.ts
                runner.ts
        subagents/
            test-repo-utils.ts
    freebuff/
        package.json
        README.md
        SPEC.md
        cli/
            build.ts
            release.ts
            smoke-test.test.ts
            release/
                http.js
                index.js
                package.json
                postinstall.js
                README.md
        e2e/
            README.md
            agent/
                freebuff-tester.ts
            tests/
                ads-behavior.e2e.test.ts
                agent-startup.e2e.test.ts
                code-edit.e2e.test.ts
                help-command.e2e.test.ts
                knowledge-file.e2e.test.ts
                slash-commands.e2e.test.ts
                startup.e2e.test.ts
                terminal-command.e2e.test.ts
                version.e2e.test.ts
            utils/
                binary-helpers.ts
                freebuff-session.ts
                index.ts
                tmux-custom-tools.ts
                tmux-helpers.ts
    packages/
        agent-runtime/
            bunfig.toml
            package.json
            tsconfig.json
            src/
                constants.ts
                generate-diffs-prompt.ts
                get-file-reading-updates.ts
                main-prompt.ts
                mcp-constants.ts
                mcp.ts
                process-file-block.ts
                process-str-replace.ts
                prompt-agent-stream.ts
                run-agent-step.ts
                run-programmatic-step.ts
                tool-stream-parser.old.ts
                tool-stream-parser.ts
                find-files/
                    custom-file-picker-config.ts
                    request-files-prompt.ts
                    __tests__/
                        request-files-prompt.test.ts
                llm-api/
                    claude.ts
                    codebuff-web-api.ts
                    context7-api.ts
                    gemini-with-fallbacks.ts
                    serper-api.ts
                    __tests__/
                        gemini-with-fallbacks.test.ts
                        serper-api.test.ts
                system-prompt/
                    prompts.ts
                    search-system-prompt.ts
                    truncate-file-tree.ts
                templates/
                    agent-registry.ts
                    prompts.ts
                    README.md
                    strings.ts
                    types.ts
                    __tests__/
                        agent-registry.test.ts
                        strings.test.ts
                tools/
                    prompts.ts
                    stream-parser.ts
                    tool-executor.ts
                    handlers/
                        handler-function-type.ts
                        list.ts
                        tool/
                            add-message.ts
                            add-subgoal.ts
                            apply-patch.ts
                            ask-user.ts
                            browser-logs.ts
                            code-search.ts
                            composio.ts
                            create-plan.ts
                            end-turn.ts
                            find-files.ts
                            glob.ts
                            gravity-index.ts
                            list-directory.ts
                            lookup-agent-info.ts
                            propose-str-replace.ts
                            propose-write-file.ts
                            proposed-content-store.ts
                            read-docs.ts
                            read-files.ts
                            read-subtree.ts
                            read-url.ts
                            render-ui.ts
                            run-file-change-hooks.ts
                            run-terminal-command.ts
                            set-messages.ts
                            set-output.ts
                            skill.ts
                            spawn-agent-inline.ts
                            spawn-agent-utils.ts
                            spawn-agents.ts
                            str-replace.ts
                            suggest-followups.ts
                            task-completed.ts
                            think-deeply.ts
                            update-subgoal.ts
                            web-search.ts
                            write-file.ts
                            write-todos.ts
                            __tests__/
                                write-file.test.ts
                        __tests__/
                            glob.test.ts
                            read-subtree.test.ts
                util/
                    agent-output.ts
                    cache-debug.ts
                    format-value.ts
                    messages.ts
                    parse-tool-calls-from-text.ts
                    render-read-files-result.ts
                    simplify-tool-results.ts
                    stream-xml-parser.ts
                    token-counter.ts
                    __tests__/
                        messages.test.ts
                        parse-tool-calls-from-text.test.ts
                        simplify-tool-results.test.ts
                        stream-xml-parser.test.ts
                __tests__/
                    cost-aggregation.test.ts
                    generate-diffs-prompt.test.ts
                    get-file-reading-updates.test.ts
                    gravity-index-tool.test.ts
                    loop-agent-steps.test.ts
                    main-prompt.test.ts
                    n-parameter.test.ts
                    process-file-block.test.ts
                    process-str-replace.test.ts
                    prompt-caching-subagents.test.ts
                    prompts-schema-handling.test.ts
                    propose-tools.test.ts
                    read-docs-tool.test.ts
                    run-agent-step-prefill.test.ts
                    run-agent-step-tools.test.ts
                    run-programmatic-step.test.ts
                    sandbox-generator.test.ts
                    spawn-agents-image-content.test.ts
                    spawn-agents-message-history.test.ts
                    spawn-agents-permissions.test.ts
                    stream-parser-abort.test.ts
                    stream-parser-reasoning.test.ts
                    subagent-streaming.test.ts
                    test-utils.ts
                    tool-stream-parser.test.ts
                    tool-validation-error.test.ts
                    web-search-tool.test.ts
                    xml-tool-result-ordering.test.ts
        code-map/
            package.json
            tsconfig.json
            src/
                index.ts
                init-node.ts
                languages.ts
                parse.ts
                types.ts
                utils.ts
                tree-sitter-queries/
                    readme.md
                    tree-sitter-c-tags.scm
                    tree-sitter-cpp-tags.scm
                    tree-sitter-c_sharp-tags.scm
                    tree-sitter-go-tags.scm
                    tree-sitter-java-tags.scm
                    tree-sitter-javascript-tags.scm
                    tree-sitter-php-tags.scm
                    tree-sitter-python-tags.scm
                    tree-sitter-ruby-tags.scm
                    tree-sitter-rust-tags.scm
                    tree-sitter-typescript-tags.scm
            __tests__/
                integration.test.ts
                languages.test.ts
                parse.test.ts
                test-langs/
                    test.c
                    test.cpp
                    test.cs
                    test.go
                    test.java
                    test.js
                    test.php
                    test.py
                    test.rb
                    test.rs
                    test.ts
        llm-providers/
            package.json
            tsconfig.json
            src/
                openai-compatible/
                    index.ts
                    openai-compatible-error.ts
                    openai-compatible-provider.ts
                    version.ts
                    chat/
                        convert-to-openai-compatible-chat-messages.test.ts
                        convert-to-openai-compatible-chat-messages.ts
                        get-response-metadata.ts
                        map-openai-compatible-finish-reason.ts
                        openai-compatible-api-types.ts
                        openai-compatible-chat-language-model.ts
                        openai-compatible-chat-options.ts
                        openai-compatible-metadata-extractor.ts
                        openai-compatible-prepare-tools.ts
                    completion/
                        convert-to-openai-compatible-completion-prompt.ts
                        get-response-metadata.ts
                        map-openai-compatible-finish-reason.ts
                        openai-compatible-completion-language-model.ts
                        openai-compatible-completion-options.ts
                    embedding/
                        openai-compatible-embedding-model.ts
                        openai-compatible-embedding-options.ts
                    image/
                        openai-compatible-image-model.ts
                        openai-compatible-image-settings.ts
                    internal/
                        index.ts
    scripts/
        tmux/
            package.json
            README.md
            tmux-capture.sh
            tmux-cli.sh
            tmux-send.sh
            tmux-start.sh
            tmux-stop.sh
            tmux-viewer/
                gif-encoder-2.d.ts
                gif-exporter.ts
                index.tsx
                package.json
                README.md
                session-loader.ts
                tsconfig.json
                types.ts
                components/
                    session-viewer.tsx
                    theme.ts
    sdk/
        .gitignore
        .npmignore
        bunfig.toml
        CHANGELOG.md
        package.json
        PUBLISHING.md
        README.md
        smoke-test-dist.ts
        tsconfig.build.json
        tsconfig.json
        e2e/
            README.md
            custom-agents/
                api-integration-agent.e2e.test.ts
                apply-patch-tool.e2e.test.ts
                database-query-agent.e2e.test.ts
                weather-agent.e2e.test.ts
            examples/
                code-explainer.example.ts
                code-reviewer.example.ts
                commit-message-generator.example.ts
                sdk-lint.example.ts
                sdk-refactor.example.ts
                sdk-test-gen.example.ts
            features/
                knowledge-files.e2e.test.ts
                max-agent-steps.e2e.test.ts
                project-files.e2e.test.ts
            integration/
                connection-check.integration.test.ts
                event-ordering.integration.test.ts
                event-types.integration.test.ts
                stream-chunks.integration.test.ts
            streaming/
                concurrent-streams.e2e.test.ts
                subagent-streaming.e2e.test.ts
            utils/
                e2e-mocks.ts
                event-collector.ts
                get-api-key.ts
                index.ts
                test-fixtures.ts
                __tests__/
                    event-collector.test.ts
            workflows/
                error-recovery.e2e.test.ts
                multi-turn-conversation.e2e.test.ts
        examples/
            readme-example-1.ts
            readme-example-2.ts
        scripts/
            build.ts
            fetch-ripgrep.ts
            publish.ts
            release.js
            verify.ts
        src/
            client.ts
            composio.ts
            constants.ts
            credentials.ts
            custom-tool.ts
            env.ts
            error-utils.ts
            index.ts
            retry-config.ts
            run-state.ts
            run.ts
            validate-agents.ts
            agents/
                load-agents.ts
                load-mcp-config.ts
            impl/
                agent-runtime.ts
                chatgpt-backend-fetch.ts
                database.ts
                llm.ts
                model-provider.ts
                __tests__/
                    llm-chatgpt-oauth-policy.test.ts
                    model-provider-free-mode.test.ts
                    prompt-result.test.ts
                    provider-options-metadata.test.ts
            native/
                ripgrep.ts
            skills/
                load-skills.ts
            testing/
                env.ts
            tools/
                apply-patch.ts
                change-file.ts
                code-search.ts
                glob.ts
                index.ts
                list-directory.ts
                path-utils.ts
                read-files.ts
                read-url.ts
                run-file-change-hooks.ts
                run-terminal-command.ts
                ssrf.ts
            types/
                env.ts
            __tests__/
                apply-patch.test.ts
                change-file.test.ts
                client.test.ts
                code-search.test.ts
                composio.test.ts
                credentials.test.ts
                database.test.ts
                env.test.ts
                error-utils.test.ts
                initial-session-state.test.ts
                knowledge-file-selection.test.ts
                load-agents.test.ts
                load-mcp-config.test.ts
                load-skills.test.ts
                model-provider.test.ts
                path-utils.test.ts
                read-files.test.ts
                read-url.test.ts
                researcher-web.integration.test.ts
                run-cancellation.test.ts
                run-error-preserves-history.test.ts
                run-file-filter.test.ts
                run-handle-event.test.ts
                run-mcp-tool-filter.test.ts
                run.integration.test.ts
                user-knowledge-files.test.ts
                validate-agents.test.ts
        test/
            setup-env.ts
            test-sdk.ts
            cjs-compatibility/
                package-lock.json
                package.json
                test-imports.js
                test-types.ts
                tsconfig.json
            esm-compatibility/
                package-lock.json
                package.json
                test-imports.js
                test-types.ts
                tsconfig.json
            ripgrep-bundling/
                package-lock.json
                package.json
                test-ripgrep-types.ts
                test-ripgrep.js
                tsconfig.json
            tree-sitter-queries/
                package-lock.json
                package.json
                test-query-files.js
        vendor/
            ripgrep/
                arm64-darwin/
                    rg
                arm64-linux/
                    rg
                x64-darwin/
                    rg
                x64-linux/
                    rg
                x64-win32/
                    rg.exe
```

## Core Logic Samples

### `AGENTS.md`
```
# Freebuff

Freebuff is the public, free coding agent built from the Codebuff agent framework.

## Key Technologies

- TypeScript monorepo
- Bun runtime and package manager
- OpenTUI + React CLI
- JS/TS SDK
- Composable agent runtime

## Repo Map

- `cli/` - TUI client and local UX
- `sdk/` - JS/TS SDK used by the CLI and external users
- `common/` - shared types, tools, schemas, and utilities
- `agents/` - public agent definitions
- `packages/agent-runtime/` - agent runtime and tool handling
- `packages/code-map/` - source parsing helpers
- `packages/llm-providers/` - public LLM provider shims
- `freebuff/` - Freebuff CLI, release files, and e2e tests
- `scripts/tmux/` - tmux helpers for CLI testing

## Conventions

- Use `bun install` and `bun run`.
- Prefer dependency injection over module mocking.
- Run interactive CLI tests in tmux.
- Do not force-push `main`.

## Docs

- `docs/agents-and-tools.md`
- `docs/testing.md`
```

### `CONTRIBUTING.md`
```
# Contributing

This repository is a public mirror of the Freebuff/Codebuff source tree. The private repository is the source of truth, so accepted public contributions are ported into the private repo and then exported back here.

## Public Contributions

Good public PRs are usually scoped to:

- `cli/`
- `sdk/`
- `common/`
- `agents/`
- `packages/agent-runtime/`
- `packages/code-map/`
- `packages/llm-providers/`
- `freebuff/`, excluding the private web app
- `scripts/tmux/`
- public docs

Please do not add backend, database, billing, deployment, or secret-management code to the public repo.

## Development

Install dependencies:

```bash
bun install
```

Build the SDK:

```bash
bun run build:sdk
```

Build the Freebuff binary:

```bash
bun run build:freebuff
```

## Pull Request Flow

1. Open the PR against the public repo.
2. Public CI validates the exported public packages.
3. A maintainer reviews the change.
4. If accepted, a maintainer ports the patch into the private source repo.
5. The next public export brings the accepted change back into this repo.
```

### `eslint.config.js`
```
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginImport from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      '**/dist/*',
      '**/.next/*',
      '**/.contentlayer/*',
      '**/node_modules/*',
      'agents-graveyard/**', // Archived/deprecated agents - no need to lint
    ],
  },

  // CLI package: enforce using CliProcessEnv instead of ProcessEnv
  {
    files: ['cli/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@codebuff/common/env-process',
              importNames: ['getProcessEnv', 'processEnv'],
              message:
                'CLI should use getCliEnv() from "../utils/env" or "./env" instead of getProcessEnv() from common. This ensures CLI uses CliEnv type.',
            },
          ],
          patterns: [
            {
              group: ['@codebuff/common/types/contracts/env'],
              importNames: ['ProcessEnv'],
              message:
                'CLI should use CliEnv from "../types/env" instead of ProcessEnv from common.',
            },
          ],
        },
      ],
    },
  },

  // SDK package: enforce using SdkProcessEnv instead of ProcessEnv
  {
    files: ['sdk/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@codebuff/common/env-process',
              importNames: ['getProcessEnv', 'processEnv'],
              message:
                'SDK should use getSdkEnv() from "./env" instead of getProcessEnv() from common. This ensures SDK uses SdkEnv type.',
            },
          ],
          patterns: [
            {
              group: ['@codebuff/common/types/contracts/env'],
              importNames: ['ProcessEnv'],
              message:
                'SDK should use SdkEnv from "./types/env" instead of ProcessEnv from common.',
            },
          ],
        },
      ],
    },
  },

  // Base config for JS/TS files
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      import: pluginImport,
      'unused-imports': unusedImports,
      '@typescript-eslint': tseslint.plugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],
      'import/no-unresolved': 'off', // Disabled: TypeScript/Bun handles module resolution; this rule produces false positives with path aliases
      'import/no-duplicates': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_', // Allow unused args prefixed with _
          varsIgnorePattern: '^_', // Allow unused vars prefixed with _
          args: 'none', // Don't check function arguments (common in callbacks with required signatures)
        },
      ],
      'react-hooks/exhaustive-deps': 'off', // Disabled: plugin not configured for all packages
      '@next/next/no-img-element': 'off', // Disabled: plugin not configured for all packages
    },
  },

  // Prettier config (last to override formatting rules)
  eslintConfigPrettier,
)
```

### `package.json`
```
{
  "name": "codebuff-project",
  "version": "1.0.0",
  "private": true,
  "license": "Apache-2.0",
  "type": "module",
  "workspaces": [
    "agents",
    "cli",
    "common",
    "evals",
    "freebuff",
    "packages/agent-runtime",
    "packages/code-map",
    "packages/llm-providers",
    "scripts/tmux",
    "sdk"
  ],
  "scripts": {
    "start-cli": "bun --cwd cli dev",
    "dev": "bun start-cli",
    "dev:freebuff": "FREEBUFF_MODE=true bun --cwd cli dev",
    "release:cli": "bun run --cwd=cli release",
    "release:sdk": "bun run --cwd=sdk release",
    "release:freebuff": "bun run --cwd=freebuff release",
    "build:sdk": "cd sdk && bun run build",
    "build:freebuff": "bun freebuff/cli/build.ts 0.0.0-dev",
    "buffbench": "bun --cwd evals run-buffbench",
    "ci": "bun run build:sdk && bun run build:freebuff"
  },
  "dependencies": {
    "canvas": "^3.2.0",
    "gif-encoder-2": "^1.0.5",
    "zod": "^4.2.1"
  },
  "overrides": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@types/react": "19.2.14",
    "@types/react-dom": "19.2.3",
    "ai": "5.0.122",
    "@ai-sdk/gateway": "2.0.28",
    "@ai-sdk/provider": "2.0.1",
    "@ai-sdk/provider-utils": "3.0.20",
    "baseline-browser-mapping": "^2.9.14",
    "caniuse-lite": "^1.0.30001792",
    "zod": "^4.2.1",
    "signal-exit": "3.0.7"
  },
  "devDependencies": {
    "@tanstack/react-query": "^5.90.12",
    "@types/bun": "1.3.11",
    "@types/js-yaml": "^4.0.9",
    "@types/lodash": "^4.17.21",
    "@types/node": "^22.9.0",
    "@types/node-fetch": "^2.6.12",
    "@types/parse-path": "^7.1.0",
    "@typescript-eslint/eslint-plugin": "^6.17",
    "bun-types": "1.3.11",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "^2.29.1",
    "eslint-plugin-unused-imports": "^4.1.4",
    "ignore": "^6.0.2",
    "lodash": "4.17.23",
    "prettier": "^3.7.4",
    "ts-node": "^10.9.2",
    "ts-pattern": "^5.9.0",
    "tsc-alias": "^1.8.16",
    "tsconfig-paths": "4.2.0",
    "typescript": "5.5.4",
    "typescript-eslint": "^7.17.0"
  },
  "engines": {
    "bun": "1.3.11"
  },
  "packageManager": "bun@1.3.11"
}
```

### `README.md`
```
# Codebuff & Freebuff

English | [简体中文](./README.zh-CN.md)

**[Codebuff](https://codebuff.com)** is an open-source AI coding assistant that edits your codebase through natural language instructions. **[Freebuff](https://www.npmjs.com/package/freebuff)** is the free, ad-supported version — no subscription, no credits, no configuration.

Instead of using one model for everything, Codebuff coordinates specialized agents that work together to understand your project and make precise changes.

<div align="center">
  <img src="./assets/codebuff-vs-claude-code.png" alt="Codebuff vs Claude Code" width="400">
</div>

Codebuff beats Claude Code at 61% vs 53% on [our evals](evals/README.md) across 175+ coding tasks over multiple open-source repos that simulate real-world tasks.


## How it works

When you ask Codebuff to "add authentication to my API," it might invoke:

1. A **File Picker Agent** to scan your codebase to understand the architecture and find relevant files
2. A **Planner Agent** to plan which files need changes and in what order
3. An **Editor Agent** to make precise edits
4. A **Reviewer Agent** to validate changes

<div align="center">
  <img src="./assets/multi-agents.png" alt="Codebuff Multi-Agents" width="250">
</div>

This multi-agent approach gives you better context understanding, more accurate edits, and fewer errors compared to single-model tools.

## CLI: Install and start coding

Install:

```bash
npm install -g codebuff
```

Run:

```bash
cd your-project
codebuff
```

Then just tell Codebuff what you want and it handles the rest:

- "Fix the SQL injection vulnerability in user registration"
- "Add rate limiting to all API endpoints"
- "Refactor the database connection code for better performance"

Codebuff will find the right files, makes changes across your codebase, and runs tests to make sure nothing breaks.

## Create custom agents

To get started building your own agents, start Codebuff and run the `/init` command:

```bash
codebuff
```

Then inside the CLI:

```
/init
```

This creates:
```
knowledge.md               # Project context for Codebuff
.agents/
└── types/                 # TypeScript type definitions
    ├── agent-definition.ts
    ├── tools.ts
    └── util-types.ts
```

You can write agent definition files that give you maximum control over agent behavior.

Implement your workflows by specifying tools, which agents can be spawned, and prompts. We even have TypeScript generators for more programmatic control.

For example, here's a `git-committer` agent that creates git commits based on the current git state. Notice that it runs `git diff` and `git log` to analyze changes, but then hands control over to the LLM to craft a meaningful commit message and perform the actual commit.

```typescript
export default {
  id: 'git-committer',
  displayName: 'Git Committer',
  model: 'openai/gpt-5-nano',
  toolNames: ['read_files', 'run_terminal_command', 'end_turn'],

  instructionsPrompt:
    'You create meaningful git commits by analyzing changes, reading relevant files for context, and crafting clear commit messages that explain the "why" behind changes.',

  async *handleSteps() {
    // Analyze what changed
    yield { tool: 'run_terminal_command', command: 'git diff' }
    yield { tool: 'run_terminal_command', command: 'git log --oneline -5' }

    // Stage files and create commit with good message
    yield 'STEP_ALL'
  },
}
```

## SDK: Run agents in production

Install the [SDK package](https://www.npmjs.com/package/@codebuff/sdk) -- note this is different than the CLI codebuff package.

```bash
npm install @codebuff/sdk
```

Import the client and run agents!

```typescript
import { CodebuffClient } from '@codebuff/sdk'

// 1. Initialize the client
const client = new CodebuffClient({
  apiKey: 'your-api-key',
  cwd: '/path/to/your/project',
  onError: (error) => console.error('Codebuff error:', error.message),
})

// 2. Do a coding task...
const result = await client.run({
  agent: 'base', // Codebuff's base coding agent
  prompt: 'Add error handling to all API endpoints',
  handleEvent: (event) => {
    console.log('Progress', event)
  },
})

// 3. Or, run a custom agent!
const myCustomAgent: AgentDefinition = {
  id: 'greeter',
  displayName: 'Greeter',
  model: 'openai/gpt-5.1',
  instructionsPrompt: 'Say hello!',
}
await client.run({
  agent: 'greeter',
  agentDefinitions: [myCustomAgent],
  prompt: 'My name is Bob.',
  customToolDefinitions: [], // Add custom tools too!
  handleEvent: (event) => {
    console.log('Progress', event)
  },
})
```

Learn more about the SDK [here](https://www.npmjs.com/package/@codebuff/sdk).

## Freebuff: The free coding agent

Don't want a subscription? **[Freebuff](https://www.npmjs.com/package/freebuff)** is a free variant of Codebuff — no subscription, no credits, no configuration. Just install and start coding.

```bash
npm install -g freebuff
cd your-project
freebuff
```

Freebuff is ad-supported and uses models optimized for fast, high-quality assistance. It includes built-in web research, browser use, and more. Learn more in the [Freebuff README](./freebuff/README.md).

## Why choose Codebuff

**Custom workflows**: TypeScript generators let you mix AI generation with programmatic control. Agents can spawn subagents, branch on conditions, and run multi-step processes.

**Any model on OpenRouter**: Unlike Claude Code which locks you into Anthropic's models, Codebuff supports any model available on [OpenRouter](https://openrouter.ai/models) - from Claude and GPT to specialized models like Qwen, DeepSeek, and others. Switch models for different tasks or use the latest releases without waiting for platform updates.

**Reuse any published agent**: Compose existing [published agents](https://www.codebuff.com/store) to get a leg up. Codebuff agents are the new MCP!

**SDK**: Build Codebuff into your applications. Create custom tools, integrate with CI/CD, or embed coding assistance into your products.

## Advanced Usage

### Custom Agent Workflows

Create your own agents with specialized workflows using the `/init` command:

```bash
codebuff
/init
```

This creates a custom agent structure in `.agents/` that you can customize.

## Contributing to Codebuff

We ❤️ contributions from the community - whether you're fixing bugs, tweaking our agents, or improving documentation.

**Want to contribute?** Check out our [Contributing Guide](./CONTRIBUTING.md) to get started.

### Running Tests

To run the test suite:

```bash
cd cli
bun test
```

**For interactive E2E testing**, install tmux:

```bash
# macOS
brew install tmux

# Ubuntu/Debian
sudo apt-get install tmux

# Windows (via WSL)
wsl --install
sudo apt-get install tmux
```

See [cli/src/__tests__/README.md](cli/src/__tests__/README.md) for comprehensive testing documentation.

Some ways you can help:

- 🐛 **Fix bugs** or add features
- 🤖 **Create specialized agents** and publish them to the Agent Store
- 📚 **Improve documentation** or write tutorials
- 💡 **Share ideas** in our [GitHub Issues](https://github.com/CodebuffAI/codebuff/issues)

## Get started

### Install

**CLI**: `npm install -g codebuff`

**SDK**: `npm install @codebuff/sdk`

**Freebuff (free)**: `npm install -g freebuff`

### Resources

**Documentation**: [codebuff.com/docs](https://codebuff.com/docs)

**Community**: [Discord](https://codebuff.com/discord)

**Issues & Ideas**: [GitHub Issues](https://github.com/CodebuffAI/codebuff/issues)

**Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md) - Start here to contribute!

**Support**: [support@codebuff.com](mailto:support@codebuff.com)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=CodebuffAI/codebuff&type=Date)](https://www.star-history.com/#CodebuffAI/codebuff&Date)
```

### `README.zh-CN.md`
```
# Codebuff & Freebuff

[English](./README.md) | 简体中文

**[Codebuff](https://codebuff.com)** 是一款开源的 AI 编程助手，能根据自然语言指令直接修改你的代码库。**[Freebuff](https://www.npmjs.com/package/freebuff)** 是它的免费、广告支持版本——无需订阅、无需积分、零配置。

与那种"一个模型干所有事"的工具不同，Codebuff 会协调多个专业化的智能体（agent）协同工作，理解你的项目并做出精准的改动。

<div align="center">
  <img src="./assets/codebuff-vs-claude-code.png" alt="Codebuff vs Claude Code" width="400">
</div>

在我们的[评测](evals/README.md)中，Codebuff 在 175+ 个真实开源仓库的编码任务上以 61% 对 53% 的成绩领先 Claude Code。


## 工作原理

当你让 Codebuff "给我的 API 加上身份验证"时，它可能会调用：

1. **File Picker Agent** —— 扫描代码库、理解架构、找出相关文件
2. **Planner Agent** —— 规划哪些文件需要改、按什么顺序改
3. **Editor Agent** —— 执行精确的修改
4. **Reviewer Agent** —— 校验改动是否正确

<div align="center">
  <img src="./assets/multi-agents.png" alt="Codebuff Multi-Agents" width="250">
</div>

相比单模型工具，这种多智能体方案能带来更准的上下文理解、更精确的修改，以及更少的错误。

## CLI：装好就能写代码

安装：

```bash
npm install -g codebuff
```

运行：

```bash
cd your-project
codebuff
```

然后直接告诉 Codebuff 你想做什么，剩下的它自己搞定：

- "修掉用户注册里的 SQL 注入漏洞"
- "给所有 API 端点加上限流"
- "重构数据库连接代码，提升性能"

Codebuff 会找到对应的文件，跨多个文件做改动，并跑测试确认没有破坏现有功能。

## 创建自定义智能体

要开始构建自己的智能体，先启动 Codebuff 然后执行 `/init`：

```bash
codebuff
```

进入 CLI 后：

```
/init
```

这会生成：
```
knowledge.md               # Codebuff 用的项目上下文
.agents/
└── types/                 # TypeScript 类型定义
    ├── agent-definition.ts
    ├── tools.ts
    └── util-types.ts
```

通过编写智能体定义文件，你可以最大程度地控制智能体的行为。

通过指定工具、可派生的子智能体和提示词来实现自己的工作流。我们还提供了 TypeScript 生成器，方便你以更程序化的方式控制流程。

下面是一个 `git-committer` 智能体的例子，它会基于当前的 git 状态生成提交。注意它先跑 `git diff` 和 `git log` 分析改动，然后再把决策权交给 LLM，让它撰写有意义的 commit message 并完成实际提交。

```typescript
export default {
  id: 'git-committer',
  displayName: 'Git Committer',
  model: 'openai/gpt-5-nano',
  toolNames: ['read_files', 'run_terminal_command', 'end_turn'],

  instructionsPrompt:
    'You create meaningful git commits by analyzing changes, reading relevant files for context, and crafting clear commit messages that explain the "why" behind changes.',

  async *handleSteps() {
    // 分析改动
    yield { tool: 'run_terminal_command', command: 'git diff' }
    yield { tool: 'run_terminal_command', command: 'git log --oneline -5' }

    // 暂存文件，并用合适的 message 生成提交
    yield 'STEP_ALL'
  },
}
```

## SDK：在生产环境里跑智能体

安装 [SDK 包](https://www.npmjs.com/package/@codebuff/sdk)——注意这跟 CLI 用的 codebuff 包是两个不同的包。

```bash
npm install @codebuff/sdk
```

引入 client，开始跑智能体：

```typescript
import { CodebuffClient } from '@codebuff/sdk'

// 1. 初始化 client
const client = new CodebuffClient({
  apiKey: 'your-api-key',
  cwd: '/path/to/your/project',
  onError: (error) => console.error('Codebuff error:', error.message),
})

// 2. 跑一个编码任务……
const result = await client.run({
  agent: 'base', // Codebuff 默认的基础编码智能体
  prompt: 'Add error handling to all API endpoints',
  handleEvent: (event) => {
    console.log('Progress', event)
  },
})

// 3. 也可以跑自定义智能体！
const myCustomAgent: AgentDefinition = {
  id: 'greeter',
  displayName: 'Greeter',
  model: 'openai/gpt-5.1',
  instructionsPrompt: 'Say hello!',
}
await client.run({
  agent: 'greeter',
  agentDefinitions: [myCustomAgent],
  prompt: 'My name is Bob.',
  customToolDefinitions: [], // 也可以加自定义工具！
  handleEvent: (event) => {
    console.log('Progress', event)
  },
})
```

更多 SDK 用法请看[这里](https://www.npmjs.com/package/@codebuff/sdk)。

## Freebuff：免费的编程智能体

不想订阅？**[Freebuff](https://www.npmjs.com/package/freebuff)** 是 Codebuff 的免费版本——无需订阅、无需积分、零配置，装上就能用。

```bash
npm install -g freebuff
cd your-project
freebuff
```

Freebuff 由广告支持，使用经过优化、兼顾速度与质量的模型。内置网页检索、浏览器使用等能力。详情见 [Freebuff README](./freebuff/README.md)。

## 为什么选 Codebuff

**自定义工作流**：用 TypeScript 生成器把 AI 生成和程序化控制混着用。智能体可以派生子智能体、按条件分支、跑多步流程。

**OpenRouter 上的任何模型**：Claude Code 把你锁死在 Anthropic 的模型上，Codebuff 不一样——它支持 [OpenRouter](https://openrouter.ai/models) 上的所有模型，从 Claude、GPT 到 Qwen、DeepSeek 这类专用模型都行。可以按任务切换模型，也能随时用上最新发布的模型，不必等平台跟进。

**复用已发布的智能体**：把社区[已发布的智能体](https://www.codebuff.com/store)拼起来用，少走弯路。Codebuff 智能体就是新一代的 MCP！

**SDK**：把 Codebuff 嵌进你自己的应用里。可以创建自定义工具、对接 CI/CD，或把编码能力内嵌进你的产品。

## 进阶用法

### 自定义智能体工作流

用 `/init` 命令创建带专门工作流的智能体：

```bash
codebuff
/init
```

这会在 `.agents/` 下生成一套可自定义的智能体结构。

## 参与贡献

我们 ❤️ 来自社区的贡献——无论是修 bug、调整智能体、还是改进文档。

**想参与？** 看一眼[贡献指南](./CONTRIBUTING.md) 就能上手。

### 运行测试

跑测试套件：

```bash
cd cli
bun test
```

**交互式端到端测试**需要 tmux：

```bash
# macOS
brew install tmux

# Ubuntu/Debian
sudo apt-get install tmux

# Windows（通过 WSL）
wsl --install
sudo apt-get install tmux
```

更完整的测试文档见 [cli/src/__tests__/README.md](cli/src/__tests__/README.md)。

可以帮忙的方向：

- 🐛 **修 bug** 或新增功能
- 🤖 **打造专用智能体**并发布到 Agent Store
- 📚 **完善文档**或撰写教程
- 💡 **分享想法**：在 [GitHub Issues](https://github.com/CodebuffAI/codebuff/issues) 留言

## 开始使用

### 安装

**CLI**：`npm install -g codebuff`

**SDK**：`npm install @codebuff/sdk`

**Freebuff（免费版）**：`npm install -g freebuff`

### 资源

**文档**：[codebuff.com/docs](https://codebuff.com/docs)

**社区**：[Discord](https://codebuff.com/discord)

**Issue 与想法**：[GitHub Issues](https://github.com/CodebuffAI/codebuff/issues)

**贡献指南**：[CONTRIBUTING.md](./CONTRIBUTING.md) ——想贡献从这里开始！

**支持**：[support@codebuff.com](mailto:support@codebuff.com)

## Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=CodebuffAI/codebuff&type=Date)](https://www.star-history.com/#CodebuffAI/codebuff&Date)
```

### `SECURITY.md`
```
# Reporting Security Issues

If you believe you have found a security vulnerability in CodeBuff, we encourage you to let us know right away. We will investigate all legitimate reports and do our best to quickly fix the problem.

Email us at: `support@codebuff.com`

Please do not report security vulnerabilities through public GitHub issues.```

### `tsconfig.base.json`
```
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,

    "strict": true,
    "noImplicitReturns": true,

    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### `tsconfig.json`
```
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@codebuff/common/*": ["./common/src/*"],
      "@codebuff/evals/*": ["./evals/*"],
      "@codebuff/sdk": ["./sdk/src/index.ts"],
      "@codebuff/sdk/*": ["./sdk/*"],
      "@codebuff/agent-runtime/*": ["./packages/agent-runtime/src/*"],
      "@codebuff/llm-providers/*": ["./packages/llm-providers/src/*"],
      "@codebuff/code-map/*": ["./packages/code-map/*"]
    }
  },
  "files": [],
  "references": [
    { "path": "./common" },
    { "path": "./agents" },
    { "path": "./sdk" },
    { "path": "./cli" },
    { "path": "./evals" },
    { "path": "./packages/agent-runtime" },
    { "path": "./packages/code-map" },
    { "path": "./packages/llm-providers" }
  ]
}
```

### `WINDOWS.md`
```
## Codebuff for Windows dev setup

Welcome!

For development, we have a shared windows machine, via shadow.tech.

### Accessing the machine

You can access the machine either from the browser or with the desktop app:

1. Shadow.tech Web viewer:

- Go to https://pc.shadow.tech/home

2. Shadow.tech desktop app:

- They claim its better, idk.
- https://shadow.tech/download/

Supposedly you can also use Window's Remote Desktop to access the machine instead, but I've not tried it. Shadow.tech claims their protocol is better optimized for lower bandwidth use & hence smoother performance.

## Set-up guide:

You shouldn't need this - but just in case you stop using Shadow.tech, or make a new account, here's a guide on how to get from a blank Windows install to a Codebuff install.

Surprisingly: most guides in fact recommend running everything in an Admin PowerShell, contra to advice to not use sudo on eg: Linux/macOS.

- Install Choco: Open PowerShell as Admin, and run the command from https://chocolatey.org/install
- Install NVM: Restart PowerShell (still as Admin) and run `choco install nvm -y`
- Install Node: Restart PowerShell (still as Admin) and run `nvm install node`
- Install Codebuff: Run `npm i -g codebuff`

---

## Common Windows Issues & Troubleshooting

Running into problems? Here are solutions to the most common Windows-specific issues.

### Issue: "Failed to determine latest version" on First Run

**Symptom**:
```powershell
PS C:\> codebuff
❌ Failed to determine latest version
Please check your internet connection and try again
```

**Cause**:
Codebuff checks GitHub for the latest release on first run. This fails when:
- Corporate firewall blocks `github.com`
- Proxy settings not configured
- Network connectivity issues
- VPN required for external access

**Solutions**:

1. **Set the `HTTPS_PROXY` environment variable** (if behind corporate proxy):

   Codebuff natively supports proxy environment variables. This is the recommended fix:

   **PowerShell:**
   ```powershell
   $env:HTTPS_PROXY = "http://your-proxy-server:port"
   codebuff
   ```

   **CMD:**
   ```cmd
   set HTTPS_PROXY=http://your-proxy-server:port
   codebuff
   ```

   To make it permanent, add `HTTPS_PROXY` to your Windows System Environment Variables (Settings → System → Advanced → Environment Variables).

2. **Verify network access**:
   ```powershell
   curl https://registry.npmjs.org/codebuff/latest
   ```
   If this fails, you have a network/firewall issue.

3. **Configure npm proxy** (for the `npm install` step only):
   ```powershell
   npm config set proxy http://your-proxy-server:port
   npm config set https-proxy http://your-proxy-server:port
   ```
   Note: This only helps with `npm install`. Codebuff's own downloads use `HTTPS_PROXY` instead.

4. **Disable VPN temporarily** or whitelist `registry.npmjs.org` and `codebuff.com` in your firewall

5. **Clear npm cache and reinstall**:
   ```powershell
   npm cache clean --force
   npm uninstall -g codebuff
   npm install -g codebuff
   ```

**Reference**: Issue [#294](https://github.com/CodebuffAI/codebuff/issues/294)

---

### Issue: "Bash is required but was not found" Error

**Symptom**:
```
Bash is required but was not found on this Windows system.
```

**Cause**:
Codebuff requires bash for command execution. This error appears when:
- Git for Windows is not installed
- You're not running inside WSL
- bash.exe is not in your PATH

**Solutions**:

1. **Install Git for Windows** (recommended):
   - Download from https://git-scm.com/download/win
   - This installs `bash.exe` which Codebuff will automatically detect
   - Works in PowerShell, CMD, or Git Bash terminals

2. **Use WSL (Windows Subsystem for Linux)**:
   - Provides full Linux environment with native bash
   - Install: `wsl --install` in PowerShell (Admin)
   - Run codebuff inside WSL for best compatibility

3. **Set custom bash path** (advanced):
   - If bash.exe is installed in a non-standard location:
   ```powershell
   set CODEBUFF_GIT_BASH_PATH=C:\path\to\bash.exe
   ```

**Reference**: Issue [#274](https://github.com/CodebuffAI/codebuff/issues/274)

---

### Issue: Git Commands Fail on Windows

**Symptom**:
Git operations (commit, rebase, complex commands) fail with syntax errors or unexpected behavior.

**Cause**:
Complex git commands may have issues with Windows path handling or shell escaping.

**Solutions**:

1. **Ensure Git for Windows is installed**:
   - Download from https://git-scm.com/download/win
   - Codebuff uses bash.exe from Git for Windows for command execution

2. **Use WSL for complex operations**:
   - Provides full Linux environment with native bash
   - Install: `wsl --install` in PowerShell (Admin)
   - Run codebuff inside WSL for best compatibility

**Reference**: Issue [#274](https://github.com/CodebuffAI/codebuff/issues/274)

---

### Issue: Login Browser Window Fails to Open

**Symptom**:
```
Press ENTER to open your browser and finish logging in...

Caught exception: Error: Executable not found in $PATH: "start"
Error: Executable not found in $PATH: "start"
TLCWeb > Unable to login. Please try again by typing "login" in the terminal.
```

**Cause**:
When running Codebuff in Git Bash (MINGW64), the `start` command is not available in PATH. The browser auto-open feature fails.

**Solutions**:

1. **Manually open the login URL** (easiest):
   - Codebuff displays the login URL after the error
   - Copy the full URL starting with `https://codebuff.com/login?auth_code=...`
   - Paste into your browser
   - Complete login in browser
   - Return to terminal - login will succeed

2. **Use native Windows terminals**:
   - PowerShell: `powershell`
   - Command Prompt: `cmd`
   - These have `start` command available

3. **Clear cache if login still fails** (per issue #299):
   ```powershell
   npm cache clean --force
   npm uninstall -g codebuff
   npm install -g codebuff
   ```

**Reference**: Issue [#299](https://github.com/CodebuffAI/codebuff/issues/299)

---

### Message: "Update available: error → [version]"

**What it means**:
This is **not an error** - it's an informational message indicating:
- Your local binary needs to be downloaded/updated
- "error" is a placeholder version (not a real error state)
- Codebuff will automatically download the correct version

**What to do**:
- Wait for the download to complete: "Download complete! Starting Codebuff..."
- If download fails, check your internet connection
- If it persists, try the solutions in "Failed to determine latest version" above

**Reference**: Issue [#299](https://github.com/CodebuffAI/codebuff/issues/299)

---

### Still Having Issues?

If these solutions don't resolve your problem:

1. **Search existing issues**: https://github.com/CodebuffAI/codebuff/issues
2. **Open a new issue**: https://github.com/CodebuffAI/codebuff/issues/new
3. **Join Discord community**: https://codebuff.com/discord

When reporting issues, please include:
- Windows version: `winver` command
- PowerShell/Git Bash/CMD
- Node version: `node --version`
- Full error message
- Steps to reproduce
```

### `agents\base-chat.ts`
```
import { FREEBUFF_DEEPSEEK_V4_FLASH_FIREWORKS_MODEL_ID } from '@codebuff/common/constants/freebuff-models'

import { publisher } from './constants'

import type { SecretAgentDefinition } from './types/secret-agent-definition'

/**
 * Conversational agent behind freebuff.com/chat. Runs with no filesystem, but
 * can spawn researcher-web to look things up on the live internet and call
 * gravity_index to recommend third-party developer services. The chat server
 * may override `model` per request (DeepSeek Flash vs Pro for full-access
 * users).
 */
const definition: SecretAgentDefinition = {
  id: 'base-chat',
  publisher,
  model: FREEBUFF_DEEPSEEK_V4_FLASH_FIREWORKS_MODEL_ID,
  displayName: 'Freebuff Chat',
  spawnerPrompt: 'General-purpose chat assistant for freebuff.com/chat.',
  inputSchema: {
    prompt: {
      type: 'string',
      description: 'The user message to respond to.',
    },
  },
  outputMode: 'last_message',
  toolNames: ['spawn_agents', 'gravity_index'],
  spawnableAgents: ['researcher-web'],

  systemPrompt: `You are Freebuff Chat, a friendly, sharp assistant made by Freebuff (freebuff.com), the home of free AI coding tools. You are chatting with a user in a web interface that renders markdown.`,
  instructionsPrompt: `Be direct and helpful. Use markdown when it improves clarity (code blocks, lists, tables), and keep answers as short as they can be while fully answering the question.

When the user is choosing a third-party developer service (database, auth, payments, hosting, email, monitoring, analytics, AI APIs, storage, CMS, search, etc.) or asks what provider to use for something, use the gravity_index tool instead of answering from memory: \`search\` with a query that includes their stack and constraints when they want a recommendation, or \`browse\`/\`list_categories\`/\`get_service\` to explore options. Ground your answer in the result. When a search result includes a tracked setup link (\`credential_request.setup_url\` or \`click_url\`), present that exact URL prominently as a markdown link like "Get your {service} API key" — never swap in the vendor homepage for it. Since you can't edit the user's files, share the relevant setup steps and env vars in chat instead of trying to install anything.

You can search the live internet by spawning the researcher-web agent. Spawn it whenever the answer depends on current or recent information (news, prices, releases, versions, schedules, scores, docs), whenever the user asks you to look something up, or whenever you are not confident in your knowledge. Give it a focused question; you can spawn several in parallel for independent questions. After it reports back, answer the user in your own words and cite source URLs when useful. Don't spawn it for questions you can already answer well (general knowledge, coding help, writing, math).

You do not have access to the user's files or a filesystem — if asked to do something that requires those, say so briefly and help with what you can instead.`,
}

export default definition
```

### `agents\basher.ts`
```
import { publisher } from './constants'

import type {
  AgentDefinition,
  AgentStepContext,
} from './types/agent-definition'

const basher: AgentDefinition = {
  id: 'basher',
  publisher,
  model: 'google/gemini-3.1-flash-lite-preview',
  displayName: 'Basher',
  spawnerPrompt:
    'Runs a single terminal command and (recommended) describes its output using an LLM using the what_to_summarize field. A lightweight shell command executor. Every basher spawn MUST include params: { command: "<shell>" }.',

  inputSchema: {
    params: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'The terminal command to run in bash shell. Don\'t forget this field!',
        },
        what_to_summarize: {
          type: 'string',
          description:
            'What information from the command output is desired. Be specific about what to look for or extract. This is optional, and if not provided, the basher will return the full command output without summarization.',
        },
        timeout_seconds: {
          type: 'number',
          description: 'Set to -1 for no timeout. Default 30',
        },
      },
      required: ['command'],
    },
  },
  outputMode: 'last_message',
  includeMessageHistory: false,
  toolNames: ['run_terminal_command'],
  systemPrompt: `You are an expert at analyzing the output of a terminal command.

Your job is to:
1. Review the terminal command and its output
2. Analyze the output based on what the user requested
3. Provide a clear, concise description of the relevant information

When describing command output:
- Use excerpts from the actual output when possible (especially for errors, key values, or specific data)
- Focus on the information the user requested
- Be concise but thorough
- If the output is very long, summarize the key points rather than reproducing everything
- Don't include any follow up recommendations, suggestions, or offers to help`,
  instructionsPrompt: `The user has provided a command to run and specified what information they want from the output.

Run the command and then describe the relevant information from the output, following the user's instructions about what to focus on.

Do not use any tools! Only analyze the output of the command.`,
  handleSteps: function* ({ params }: AgentStepContext) {
    const command = params?.command as string | undefined
    if (!command) {
      // Using console.error because agents run in a sandboxed environment without access to structured logger
      console.error('Basher agent: missing required "command" parameter')
      yield {
        toolName: 'set_output',
        input: { output: 'Error: Missing required "command" parameter' },
      }
      return
    }

    const timeout_seconds = params?.timeout_seconds as number | undefined
    const what_to_summarize = params?.what_to_summarize as string | undefined

    // Run the command
    const { toolResult } = yield {
      toolName: 'run_terminal_command',
      input: {
        command,
        ...(timeout_seconds !== undefined && { timeout_seconds }),
      },
    }

    if (!what_to_summarize) {
      // Return the raw command output without summarization
      const result = toolResult?.[0]
      // Only return object values (command output objects), not plain strings
      const output = result?.type === 'json' && typeof result.value === 'object' ? result.value : ''
      yield {
        toolName: 'set_output',
        input: { output },
        includeToolCall: false,
      }
      return
    }

    // Let the model analyze and describe the output
    yield 'STEP'
  },
}

export default basher
```

### `agents\constants.ts`
```
export const publisher = 'codebuff'
```

### `agents\context-pruner.ts`
```
import { publisher } from './constants'

import type { AgentDefinition, ToolCall } from './types/agent-definition'
import type {
  FilePart,
  ImagePart,
  Message,
  TextPart,
  ToolMessage,
  UserMessage,
} from './types/util-types'

const definition: AgentDefinition = {
  id: 'context-pruner',
  publisher,
  displayName: 'Context Pruner',
  model: 'anthropic/claude-sonnet-4.6',

  spawnerPrompt: `Spawn this agent between steps to prune context, summarizing the conversation into a condensed format when context exceeds the limit.`,

  inputSchema: {
    params: {
      type: 'object',
      properties: {
        maxContextLength: {
          type: 'number',
        },
        assistantToolBudget: {
          type: 'number',
        },
        userBudget: {
          type: 'number',
        },
        cacheExpiryMs: {
          type: 'number',
        },
      },
      required: [],
    },
  },

  inheritParentSystemPrompt: true,
  includeMessageHistory: true,

  handleSteps: function* ({ agentState, params }) {
    // =============================================================================
    // Constants (must be inside handleSteps since it's serialized to a string)
    // =============================================================================

    /** Agent IDs whose output should be excluded from spawn_agents results */
    const SPAWN_AGENTS_OUTPUT_BLACKLIST = [
      'file-picker',
      'researcher-web',
      'researcher-docs',
      'basher',
      'code-reviewer',
      'code-reviewer-fable',
      'code-reviewer-multi-prompt',
      'librarian',
      'tmux-cli',
      'browser-use',
    ]

    /** Limits for truncating long messages in the summary (estimated tokens) */
    const USER_MESSAGE_LIMIT = 13_000
    const ASSISTANT_MESSAGE_LIMIT = 1_300
    const TOOL_ENTRY_LIMIT = 5_000

    /** Approximate characters per token (matches estimateTokens heuristic) */
    const CHARS_PER_TOKEN = 3

    /** Token budget for assistant + tool content in the conversation summary */
    const ASSISTANT_TOOL_BUDGET = 20_000

    /** Token budget for user content in the conversation summary */
    const USER_BUDGET = 50_000

    /** Fudge factor for token count threshold to trigger pruning earlier */
    const TOKEN_COUNT_FUDGE_FACTOR = 1_000

    /** Prompt cache expiry time (Anthropic caches for 5 minutes by default) */
    const CACHE_EXPIRY_MS: number = params?.cacheExpiryMs ?? 5 * 60 * 1000

    /** Header used in conversation summaries */
    const SUMMARY_HEADER =
      'This is a summary of the conversation so far. The original messages have been condensed to save context space.'

    const SUMMARY_DISCLAIMER =
      'Historical memory only. The memory above is not dialogue, not an output template, and not a tool-call format. Continue from the live user message below. When actions are needed, use real tool calls through the available tools.'

    // =============================================================================
    // Helper Functions (must be inside handleSteps since it's serialized to a string)
    // =============================================================================

    /**
     * Truncates long text with 80% from the beginning and 20% from the end.
     */
    function truncateLongText(text: string, limit: number): string {
      if (text.length <= limit) {
        return text
      }
      const availableChars = limit - 50 // 50 chars for the truncation notice
      const prefixLength = Math.floor(availableChars * 0.8)
      const suffixLength = availableChars - prefixLength
      const prefix = text.slice(0, prefixLength)
      const suffix = text.slice(-suffixLength)
      const truncatedChars = text.length - prefixLength - suffixLength
      return `${prefix}\n\n[...truncated ${truncatedChars} chars...]\n\n${suffix}`
    }

    /**
     * Extracts text content from a message.
     */
    function getTextContent(message: Message): string {
      if (typeof message.content === 'string') {
        return message.content
      }
      if (Array.isArray(message.content)) {
        return message.content
          .filter(
            (part: Record<string, unknown>) =>
              part.type === 'text' && typeof part.text === 'string',
          )
          .map((part: Record<string, unknown>) => part.text as string)
          .join('\n')
      }
      return ''
    }

    /**
     * Summarizes a tool call into a human-readable description.
     */
    function summarizeToolCall(
      toolName: string,
      input: Record<string, unknown>,
    ): string {
      switch (toolName) {
        case 'read_files': {
          const paths = input.paths as string[] | undefined
          if (paths && paths.length > 0) {
            return `inspected files: ${paths.join(', ')}`
          }
          return 'inspected files'
        }
        case 'write_file': {
          const path = input.path as string | undefined
          return path ? `wrote file: ${path}` : 'wrote a file'
        }
        case 'str_replace': {
          const path = input.path as string | undefined
          return path ? `edited file: ${path}` : 'edited a file'
        }
        case 'propose_write_file': {
          const path = input.path as string | undefined
          return path
            ? `proposed writing: ${path}`
            : 'proposed a file write'
        }
        case 'propose_str_replace': {
          const path = input.path as string | undefined
          return path
            ? `proposed editing: ${path}`
            : 'proposed a file edit'
        }
        case 'read_subtree': {
          const paths = input.paths as string[] | undefined
          if (paths && paths.length > 0) {
            return `inspected subtrees: ${paths.join(', ')}`
          }
          return 'inspected a subtree'
        }
        case 'code_search': {
          const pattern = input.pattern as string | undefined
          const flags = input.flags as string | undefined
          if (pattern && flags) {
            return `code search for "${pattern}" (${flags})`
          }
          return pattern
            ? `code search for "${pattern}"`
            : 'code search'
        }
        case 'glob': {
          const pattern = input.pattern as string | undefined
          return pattern
            ? `glob search for ${pattern}`
            : 'glob search'
        }
        case 'list_directory': {
          const path = input.path as string | undefined
          return path
            ? `listed directory: ${path}`
            : 'listed a directory'
        }
        case 'find_files': {
          const prompt = input.prompt as string | undefined
          return prompt
            ? `file-finding request: "${prompt}"`
            : 'file-finding request'
        }
        case 'run_terminal_command': {
          const command = input.command as string | undefined
          if (command) {
            const shortCmd =
              command.length > 50 ? command.slice(0, 50) + '...' : command
            return `ran command: ${shortCmd}`
          }
          return 'ran a terminal command'
        }
        case 'spawn_agents':
        case 'spawn_agent_inline': {
          const agents = input.agents as
            | Array<{
                agent_type: string
                prompt?: string
                params?: Record<string, unknown>
              }>
            | undefined
          const agentType = input.agent_type as string | undefined
          const prompt = input.prompt as string | undefined
          const agentParams = input.params as
            | Record<string, unknown>
            | undefined

          if (agents && agents.length > 0) {
            const agentDetails = agents.map((a) => {
              let detail = a.agent_type
              const extras: string[] = []
              if (a.prompt) {
                const truncatedPrompt =
                  a.prompt.length > 1000
                    ? a.prompt.slice(0, 1000) + '...'
                    : a.prompt
                extras.push(`prompt: "${truncatedPrompt}"`)
              }
              if (a.params && Object.keys(a.params).length > 0) {
                const paramsStr = JSON.stringify(a.params)
                const truncatedParams =
                  paramsStr.length > 1000
                    ? paramsStr.slice(0, 1000) + '...'
                    : paramsStr
                extras.push(`params: ${truncatedParams}`)
              }
              if (extras.length > 0) {
                detail += ` (${extras.join(', ')})`
              }
              return detail
            })
            return `delegated agents:\n${agentDetails.map((d) => `- ${d}`).join('\n')}`
          }
          if (agentType) {
            const extras: string[] = []
            if (prompt) {
              const truncatedPrompt =
                prompt.length > 1000 ? prompt.slice(0, 1000) + '...' : prompt
              extras.push(`prompt: "${truncatedPrompt}"`)
            }
            if (agentParams && Object.keys(agentParams).length > 0) {
              const paramsStr = JSON.stringify(agentParams)
              const truncatedParams =
                paramsStr.length > 1000
                  ? paramsStr.slice(0, 1000) + '...'
                  : paramsStr
              extras.push(`params: ${truncatedParams}`)
            }
            if (extras.length > 0) {
              return `delegated agent ${agentType} (${extras.join(', ')})`
            }
            return `delegated agent ${agentType}`
          }
          return 'delegated agent work'
        }
        case 'write_todos': {
          const todos = input.todos as
            | Array<{ task: string; completed: boolean }>
            | undefined
          if (todos) {
            const completed = todos.filter((t) => t.completed).length
            const incomplete = todos.filter((t) => !t.completed)
            if (incomplete.length === 0) {
              return `Todos: ${completed}/${todos.length} complete (all done!)`
            }
            const remainingTasks = incomplete
              .map((t) => `- ${t.task}`)
              .join('\n')
            return `Todos: ${completed}/${todos.length} complete. Remaining:\n${remainingTasks}`
          }
          return 'Updated todos'
        }
        case 'ask_user': {
          const questions = input.questions as
            | Array<{ question: string }>
            | undefined
          if (questions && questions.length > 0) {
            const questionTexts = questions.map((q) => q.question).join('; ')
            const truncated =
              questionTexts.length > 200
                ? questionTexts.slice(0, 200) + '...'
                : questionTexts
            return `Asked user: ${truncated}`
          }

... [TRUNCATED] ...
```

### `agents\package.json`
```
{
  "name": "@codebuff/agents",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "typecheck": "bun x tsc --noEmit -p tsconfig.json",
    "test": "bun test __tests__",
    "test:e2e": "bun test e2e"
  }
}
```
