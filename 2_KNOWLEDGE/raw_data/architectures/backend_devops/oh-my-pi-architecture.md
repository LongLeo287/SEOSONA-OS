# Architecture Extract: oh-my-pi

## Directory Structure
```text
oh-my-pi/
    .fallowrc.jsonc
    .gitattributes
    .gitignore
    AGENTS.md
    biome.json
    bun.lock
    bunfig.toml
    Cargo.lock
    Cargo.toml
    Dockerfile
    Dockerfile.dockerignore
    Dockerfile.robomp
    Dockerfile.robomp.dockerignore
    LICENSE
    package.json
    README.md
    rust-analyzer.toml
    rust-toolchain.toml
    rustfmt.toml
    tsconfig.base.json
    tsconfig.json
    tsconfig.tools.json
    .github/
        PULL_REQUEST_TEMPLATE.md
        SECURITY.md
        actions/
            build-native/
                action.yml
            bun-install/
                action.yml
            ensure-cargo-tool/
                action.yml
            ensure-rust-toolchain/
                action.yml
            ensure-sccache/
                action.yml
            ensure-zig/
                action.yml
            setup-system-deps/
                action.yml
        ISSUE_TEMPLATE/
            bug_report.yml
            config.yml
            feature_request.yml
            question.yml
        workflows/
            ci.yml
    .omp/
        commands/
            fix-issues.md
            release.md
            review-prs.md
            triage.md
        skills/
            semantic-compression/
                SKILL.md
            system-prompts/
                SKILL.md
    assets/
        banner.html
    crates/
        brush-builtins-vendored/
            Cargo.lock
            Cargo.toml
            LICENSE
            README.md
            src/
                alias.rs
                bg.rs
                bind.rs
                break_.rs
                builder.rs
                builtin_.rs
                caller.rs
                cd.rs
                colon.rs
                command.rs
                complete.rs
                continue_.rs
                declare.rs
                dirs.rs
                dot.rs
                echo.rs
                enable.rs
                eval.rs
                exec.rs
                exit.rs
                export.rs
                factory.rs
                false_.rs
                fc.rs
                fg.rs
                getopts.rs
                hash.rs
                help.rs
                history.rs
                jobs.rs
                kill.rs
                let_.rs
                lib.rs
                mapfile.rs
                popd.rs
                printf.rs
                pushd.rs
                pwd.rs
                read.rs
                return_.rs
                set.rs
                shift.rs
                shopt.rs
                suspend.rs
                test.rs
                times.rs
                trap.rs
                true_.rs
                type_.rs
                ulimit.rs
                umask.rs
                unalias.rs
                unimp.rs
                unset.rs
                wait.rs
        brush-core-vendored/
            Cargo.lock
            Cargo.toml
            LICENSE
            README.md
            examples/
                call-func.rs
                custom-builtin.rs
            src/
                arithmetic.rs
                braceexpansion.rs
                builtins.rs
                callstack.rs
                commands.rs
                completion.rs
                env.rs
                error.rs
                escape.rs
                expansion.rs
                extendedtests.rs
                extensions.rs
                functions.rs
                history.rs
                interfaces.rs
                interp.rs
                int_utils.rs
                ioutils.rs
                jobs.rs
                keywords.rs
                lib.rs
                namedoptions.rs
                openfiles.rs
                options.rs
                pathcache.rs
                pathsearch.rs
                patterns.rs
                processes.rs
                prompt.rs
                regex.rs
                results.rs
                shell.rs
                sourceinfo.rs
                sys.rs
                terminal.rs
                tests.rs
                timing.rs
                trace_categories.rs
                traps.rs
                variables.rs
                wellknownvars.rs
                interfaces/
                    keybindings.rs
                shell/
                    builder.rs
                    builtin_registry.rs
                    callstack.rs
                    completion.rs
                    env.rs
                    execution.rs
                    expansion.rs
                    fs.rs
                    funcs.rs
                    history.rs
                    initscripts.rs
                    io.rs
                    job_control.rs
                    parsing.rs
                    prompts.rs
                    readline.rs
                    state.rs
                    traps.rs
                sys/
                    fs.rs
                    hostname.rs
                    stubs.rs
                    tokio_process.rs
                    unix.rs
                    windows.rs
                    stubs/
                        async_pipe.rs
                        commands.rs
                        env.rs
                        fd.rs
                        fs.rs
                        input.rs
                        network.rs
                        pipes.rs
                        poll.rs
                        process.rs
                        resource.rs
                        signal.rs
                        terminal.rs
                        users.rs
                    unix/
                        async_pipe.rs
                        commands.rs
                        env.rs
                        fd.rs
                        fs.rs
                        input.rs
                        network.rs
                        poll.rs
                        resource.rs
                        signal.rs
                        terminal.rs
                        users.rs
                    wasm/
                        fs.rs
                        mod.rs
                    windows/
                        commands.rs
                        env.rs
                        fd.rs
                        fs.rs
                        network.rs
                        terminal.rs
                        users.rs
        pi-ast/
            Cargo.toml
            src/
                block.rs
                lib.rs
                ops.rs
                summary.rs
                language/
                    mod.rs
                    parsers.rs
        pi-iso/
            Cargo.toml
            src/
                apfs.rs
                btrfs.rs
                diff.rs
                lib.rs
                linux_reflink.rs
                overlayfs.rs
                projfs.rs
                rcopy.rs
                windows_block_clone.rs
                zfs.rs
        pi-natives/
            build.rs
            Cargo.toml
            src/
                appearance.rs
                ast.rs
                block.rs
                clipboard.rs
                crash_handler.rs
                fd.rs
                fs_cache.rs
                glob.rs
                glob_util.rs
                grep.rs
                highlight.rs
                html.rs
                iso.rs
                keys.rs
                lib.rs
                power.rs
                prof.rs
                ps.rs
                pty.rs
                shell.rs
                sixel.rs
                snapcompact.rs
                summary.rs
                task.rs
                text.rs
                tokens.rs
                utils.rs
                workspace.rs
                fonts/
                    5x8.bdf
                    6x12.bdf
                    8x13.bdf
                    unscii-8.hex
        pi-shell/
            ATTRIBUTION-RTK.md
            build.rs
            Cargo.toml
            src/
                cancel.rs
                fixup.rs
                lib.rs
                minimizer.rs
                process.rs
                shell.rs
                windows.rs
                minimizer/
                    config.rs
                    detect.rs
                    engine.rs
                    pipeline.rs
                    plan.rs
                    primitives.rs
                    defs/
                        ansible-playbook.toml
                        ansible.toml
                        apt.toml
                        biome.toml
                        brew-install.toml
                        composer-install.toml
                        conda.toml
                        df.toml
                        du.toml
                        fail2ban-client.toml
                        fail2ban.toml
                        gcc.toml
                        gcloud.toml
                        hadolint.toml
                        helm.toml
                        iptables.toml
                        jira.toml
                        jj.toml
                        jq.toml
                        just.toml
                        liquibase.toml
                        make.toml
                        markdownlint.toml
                        mise.toml
                        mix-compile.toml
                        mix-format.toml
                        mix.toml
                        npx.toml
                        nx.toml
                        ollama.toml
                        oxlint.toml
                        ping.toml
                        pio-run.toml
                        pio.toml
                        pre-commit.toml
                        ps.toml
                        quarto-render.toml
                        quarto.toml
                        rails-migrate.toml
                        rails-routes.toml
                        rsync.toml
                        rustc.toml
                        shellcheck.toml
                        shopify-theme.toml
                        skopeo.toml
                        sops.toml
                        spring-boot.toml
                        ssh.toml
                        stat.toml
                        swift-build.toml
                        systemctl-status.toml
                        systemctl.toml
                        task.toml
                        terraform-plan.toml
                        terraform.toml
                        tofu-fmt.toml
                        tofu-init.toml
                        tofu-plan.toml
                        tofu-validate.toml
                        trunk-build.toml
                        trunk.toml
                        turbo.toml
                        ty.toml
                        uv-sync.toml
                        xcodebuild.toml
                        yadm.toml
                        yamllint.toml
                    filters/
                        binary_tools.rs
                        bun.rs
                        cargo.rs
                        cloud.rs
                        cpp.rs
                        docker.rs
                        dotnet.rs
                        generic.rs
                        gh.rs
                        git.rs
                        glab.rs
                        go.rs
                        gt.rs
                        js_tools.rs
                        jvm.rs
                        lint.rs
                        listing.rs
                        mod.rs
                        node_tests.rs
                        pkg.rs
                        python.rs
                        ruby.rs
                        rust_tools.rs
                        system.rs
                        fixtures/
                            glab/
                                ci-trace.txt
                                release-list.txt
                                release-view.txt
                            jvm/
                                mvn_compile_error_slice_raw.txt
                                mvn_install_slice_raw.txt
                                mvn_locale_fr_raw.txt
                                mvn_no_pom_raw.txt
                                mvn_quiet_fail_raw.txt
                                mvn_reactor_fail_slice_raw.txt
                                mvn_reactor_pass_slice_raw.txt
                                mvn_test_compile_fail_slice_raw.txt
                                mvn_test_fail_slice_raw.txt
                                mvn_test_multifail_slice_raw.txt
                                mvn_test_pass_slice_raw.txt
            tests/
                minimizer_fixtures.rs
                fixtures/
                    minimizer/
                        cargo/
                            test-pass.cmd
                            test-pass.raw
                        git/
                            log-default.cmd
                            log-default.min
                            log-default.raw
                            log.cmd
                            log.min
                            log.raw
                            status-long.cmd
                            status-long.min
                            status-long.raw
                            status.cmd
                            status.min
                            status.raw
                        glab/
                            ci-trace.cmd
                            ci-trace.raw
                            release-list.cmd
                            release-list.min
                            release-list.raw
                            release-view.cmd
                            release-view.raw
                        go/
                            test-pass.cmd
                            test-pass.raw
                        jvm/
                            gradle-build.cmd
                            gradle-build.raw
                            gradle-connected.cmd
                            gradle-connected.raw
                            gradle-lint.cmd
                            gradle-lint.exit
                            gradle-lint.raw
                            gradle-test.cmd
                            gradle-test.min
                            gradle-test.raw
                            mvn-install-full.cmd
                            mvn-install-full.raw
                            mvn-install-slice.cmd
                            mvn-install-slice.raw
                            mvn-quiet-fail.cmd
                            mvn-quiet-fail.exit
                            mvn-quiet-fail.raw
                            mvn-test-fail.cmd
                            mvn-test-fail.exit
                            mvn-test-fail.raw
                            mvn-test-pass-full.cmd
                            mvn-test-pass-full.raw
                            mvn-test-pass-slice.cmd
                            mvn-test-pass-slice.raw
                        npm/
                            install.cmd
                            install.raw
    docs/
        adding-a-provider.md
        ai-schema-normalize.md
        approval-mode.md
        auth-broker-gateway.md
        bash-tool-runtime.md
        blob-artifact-architecture.md
        collab.md
        compaction.md
        config-usage.md
        context-files.md
        custom-tools.md
        environment-variables.md
        ERRATA-GPT5-HARMONY.md
        extension-loading.md
        extensions.md
        fs-scan-cache-architecture.md
        gemini-manifest-extensions.md
        handoff-generation-pipeline.md
        hooks.md
        install-id.md
        keybindings.md
        local-models.md
        lsp-config.md
        macos-signing-notarization.md
        marketplace.md
        mcp-config.md
        mcp-protocol-transports.md
        mcp-runtime-lifecycle.md
        mcp-server-tool-authoring.md
        memory.md
        mnemosyne-memory-backend.md
        models.md
        natives-addon-loader-runtime.md
        natives-architecture.md
        natives-binding-contract.md
        natives-build-release-debugging.md
        natives-media-system-utils.md
        natives-rust-task-cancellation.md
        natives-shell-pty-process.md
        natives-text-search-pipeline.md
        non-compaction-retry-policy.md
        notebook-tool-runtime.md
        plugin-manager-installer-plumbing.md
        porting-from-pi-mono.md
        porting-to-natives.md
        provider-streaming-internals.md
        providers.md
        python-repl.md
        render-mermaid.md
        resolve-tool-runtime.md
        rpc.md
        rulebook-matching-pipeline.md
        sdk.md
        secrets.md
        session-operations-export-share-fork-resume.md
        session-switching-and-recent-listing.md
        session-tree-plan.md
        session.md
        settings.md
        skills.md
        slash-command-internals.md
        system-prompt-customization.md
        task-agent-discovery.md
        theme.md
        tree.md
        ttsr-injection-lifecycle.md
        tui-core-renderer.md
        tui-runtime-internals.md
        tui.md
        skills/
            authoring-extensions.md
            authoring-hooks.md
            authoring-marketplaces.md
            examples/
                hello-extension/
                    index.ts
                    package.json
                    README.md
                mini-marketplace/
                    README.md
                    .claude-plugin/
                        marketplace.json
                    my-plugin/
                        index.ts
                        package.json
                safety-hook/
                    index.ts
                    package.json
                    README.md
        tools/
            ask.md
            ast-edit.md
            ast-grep.md
            bash.md
            browser.md
            checkpoint.md
            debug.md
            edit.md
            eval.md
            find.md
            github.md
            inspect_image.md
            irc.md
            job.md
            lsp.md
            read.md
            recall.md
            reflect.md
            render_mermaid.md
            resolve.md
            retain.md
            rewind.md
            search.md
            search_tool_bm25.md
            ssh.md
            task.md
            todo.md
            web_search.md
            write.md
    infra/
        reload-runner.sh
        runner.Dockerfile
        tune-kata-runtime.sh
        docs/
            01-host-and-cluster.md
            02-kata-runtime.md
            03-runner-image.md
            04-arc-and-caching.md
            README.md
    packages/
        tsconfig.workspace.json
        agent/
            CHANGELOG.md
            package.json
            README.md
            tsconfig.json
            tsconfig.publish.json
            src/
                agent-loop.ts
                agent.ts
                append-only-context.ts
                compaction.ts
                harmony-leak.ts
                index.ts
                proxy.ts
                run-collector.ts
                telemetry.ts
                thinking.ts
                types.ts
                compaction/
                    branch-summarization.ts
                    compaction.ts
                    entries.ts
                    errors.ts
                    index.ts
                    messages.ts
                    openai.ts
                    pruning.ts
                    shake.ts
                    tool-protection.ts
                    utils.ts
                    prompts/
                        auto-handoff-threshold-focus.md
                        branch-summary-context.md
                        branch-summary-preamble.md
                        branch-summary.md
                        compaction-short-summary.md
                        compaction-summary-context.md
                        compaction-summary.md
                        compaction-turn-prefix.md
                        compaction-update-summary.md
                        file-operations.md
                        handoff-document.md
                        summarization-system.md
                utils/
                    yield.ts
            test/
                agent-loop.test.ts
                agent.test.ts
                append-only-context.test.ts
                compaction-error-status.test.ts
                compaction-file-ops.test.ts
                compaction-telemetry.test.ts
                compaction-thinking-level.test.ts
                handoff.test.ts
                harmony-leak.test.ts
                helpers.ts
                otel.test.ts
                proxy-stream-disconnect.test.ts
                remote-compaction.test.ts
                run-summary.test.ts
                serialize-conversation.test.ts
                shake.test.ts
                snapcompact-frames.test.ts
                supersede-prune.test.ts
                tool-protection.test.ts
                yield.test.ts
                fixtures/
                    harmony-leak-corpus.json
                utils/
                    calculate.ts
                    get-current-time.ts
        ai/
            CHANGELOG.md
            package.json
            README.md
            tsconfig.json
            tsconfig.publish.json
            scripts/
                cursor-log.py
                proto-extractor.py
            src/
                api-registry.ts
                auth-retry.ts
                auth-storage.ts
                errors.ts
                index.ts
                provider-details.ts
                rate-limit-utils.ts
                stream.ts
                types.ts
                usage.ts
                utils.ts
                auth-broker/
                    client.ts
                    index.ts
                    refresher.ts
                    remote-store.ts
                    server.ts
                    snapshot-cache.ts
                    types.ts
                    wire-schemas.ts
                auth-gateway/
                    http.ts
                    index.ts
                    server.ts
                    types.ts
                providers/
                    amazon-bedrock.ts
                    anthropic-client.ts
                    anthropic-messages-server-schema.ts
                    anthropic-messages-server.ts
                    anthropic-wire.ts
                    anthropic.ts
                    aws-credentials.ts
                    aws-eventstream.ts
                    aws-sigv4.ts
                    azure-openai-responses.ts
                    cursor.ts
                    error-message.ts
                    github-copilot-headers.ts
                    gitlab-duo.ts
                    google-auth.ts
                    google-gemini-cli.ts
                    google-shared.ts
                    google-types.ts
                    google-vertex.ts
                    google.ts
                    grammar.ts
                    kimi.ts
                    mock.ts
                    ollama.ts
                    openai-anthropic-shim.ts
                    openai-chat-server-schema.ts
                    openai-chat-server.ts
                    openai-chat-wire.ts
                    openai-codex-responses.ts
                    openai-completions.ts
                    openai-responses-server-schema.ts
                    openai-responses-server.ts
                    openai-responses-shared.ts
                    openai-responses-wire.ts
                    openai-responses.ts
                    pi-native-client.ts
                    pi-native-server.ts
                    register-builtins.ts
                    synthetic.ts
                    transform-messages.ts
                    vision-guard.ts
                    xai-responses.ts
                    cursor/
                        proto/
                            agent.proto
                            buf.gen.yaml
                            buf.yaml
                    openai-codex/
                        request-transformer.ts
                        response-handler.ts
                    __tests__/
                        google-auth.test.ts
                registry/
                    aimlapi.ts
                    alibaba-coding-plan.ts
                    amazon-bedrock.ts
                    anthropic.ts
                    api-key-login.ts
                    api-key-validation.ts
                    cerebras.ts
                    cloudflare-ai-gateway.ts
                    cursor.ts
                    deepseek.ts
                    derived.ts
                    firepass.ts
                    fireworks.ts
                    github-copilot.ts
                    gitlab-duo.ts
                    google-antigravity.ts
                    google-gemini-cli.ts
                    google-vertex.ts
                    google.ts
                    groq.ts
                    huggingface.ts
                    index.ts
                    kagi.ts
                    kilo.ts
                    kimi-code.ts
                    litellm.ts
                    lm-studio.ts
                    minimax-code-cn.ts
                    minimax-code.ts
                    minimax.ts
                    mistral.ts
                    moonshot.ts
                    nanogpt.ts
                    nvidia.ts
                    ollama-cloud.ts
                    ollama.ts
                    openai-codex-device.ts
                    openai-codex.ts
                    openai.ts
                    opencode-go.ts
                    opencode-zen.ts
                    openrouter.ts
                    parallel.ts
                    perplexity.ts
                    qianfan.ts
                    qwen-portal.ts
                    registry.ts
                    synthetic.ts
                    tavily.ts
                    together.ts
                    types.ts
                    venice.ts
                    vercel-ai-gateway.ts
                    vllm.ts
                    wafer-pass.ts
                    wafer-serverless.ts
                    xai-oauth.ts
                    xai.ts
                    xiaomi-token-plan-ams.ts
                    xiaomi-token-plan-cn.ts
                    xiaomi-token-plan-sgp.ts
                    xiaomi.ts
                    zai.ts
                    zenmux.ts
                    zhipu-coding-plan.ts
                    oauth/
                        anthropic.ts
                        callback-server.ts
                        cursor.ts
                        github-copilot.ts
                        gitlab-duo.ts
                        google-antigravity.ts
                        google-gemini-cli.ts
                        google-oauth-shared.ts
                        index.ts
                        kimi.ts
                        minimax-code.ts
                        oauth.html
                        openai-codex.ts
                        opencode.ts
                        perplexity.ts
                        pkce.ts
                        types.ts
                        wafer.ts
                        xai-oauth.ts
                        xiaomi.ts
                        __tests__/
                            xai-oauth.test.ts
                usage/
                    claude.ts
                    gemini.ts
                    github-copilot.ts
                    google-antigravity.ts
                    kimi.ts
                    minimax-code.ts
                    openai-codex-reset.ts
                    openai-codex.ts
                    shared.ts
                    zai.ts
                utils/
                    abort.ts
                    anthropic-auth.ts
                    event-stream.ts
                    foundry.ts
                    http-inspector.ts
                    idle-iterator.ts
                    json-parse.ts
                    openai-http.ts
                    overflow.ts
                    parse-bind.ts
                    provider-response.ts
                    request-debug.ts
                    retry-after.ts
                    retry.ts
                    sdk-stream-timeout.ts
                    sse-debug.ts
                    stream-markup-healing.ts
                    tool-choice.ts
                    validation.ts
                    schema/
                        adapt.ts
                        compatibility.ts
                        CONSTRAINTS.md
                        dereference.ts
                        draft.ts
                        equality.ts
                        fields.ts
                        index.ts
                        json-schema-validator.ts
                        meta-validator.ts
                        normalize.ts
                        spill.ts
                        stamps.ts
                        types.ts
                        wire.ts
                        zod-decontaminate.ts
            test/
                abort-source-tracker.test.ts
                abort.test.ts
                anthropic-abandoned-tooluse-replay.test.ts
                anthropic-alignment.test.ts
                anthropic-client.test.ts
                anthropic-empty-error-tool-result.test.ts
                anthropic-error-tool-result-image.test.ts
                anthropic-fable-request-shaping.test.ts
                anthropic-fast-mode.test.ts
                anthropic-many-image-resize.test.ts
                anthropic-mid-conversation-system.test.ts
                anthropic-oauth.test.ts
                anthropic-prefill.test.ts
                anthropic-prior-turn-thinking.test.ts
                anthropic-retry.test.ts
                anthropic-stream-envelope.test.ts
                anthropic-stream-timeout.test.ts
                anthropic-thinking-immutability.test.ts
                anthropic-thinking-only-length-truncated.test.ts
                anthropic-tool-schema.test.ts
                anthropic-unsigned-thinking-replay.test.ts
                api-registry.test.ts
                apply-patch-freeform.test.ts
                auth-broker-oauth-extra-fields.test.ts
                auth-broker-refresher.test.ts
                auth-broker-remote-store.test.ts
                auth-broker-snapshot-cache.test.ts
                auth-broker-wire.test.ts
                auth-gateway-anthropic-caching.test.ts
                auth-gateway-anthropic-messages.test.ts
                auth-gateway-anthropic-to-codex-caching.test.ts
                auth-gateway-cache-key.test.ts
                auth-gateway-classify-error.test.ts
                auth-gateway-cross-protocol-caching.test.ts
                auth-gateway-openai-chat.test.ts
                auth-gateway-openai-responses-caching.test.ts
                auth-gateway-openai-responses.test.ts
                auth-gateway-pi-native.test.ts
                auth-retry.test.ts
                auth-storage-account-identity.test.ts
                auth-storage-antigravity-selection.test.ts
                auth-storage-api-key-login.test.ts
                auth-storage-broker-no-sentinel.test.ts
                auth-storage-check-credentials.test.ts
                auth-storage-codex-selection.test.ts
                auth-storage-config-override.test.ts
                auth-storage-credential-disabled-event.test.ts
                auth-storage-credential-origin.test.ts
                auth-storage-email-dedupe.test.ts
                auth-storage-force-refresh-rotate.test.ts
                auth-storage-oauth-refresh-race.test.ts
                auth-storage-refresh-skew.test.ts
                auth-storage-sqlite-busy.test.ts
                auth-storage-usage-cache.test.ts
                auth-storage-usage-history.test.ts
                aws-credentials.test.ts
                aws-eventstream.test.ts
                aws-sigv4.test.ts
                azure-openai-responses-stream.test.ts
                callback-server-manual-input.test.ts
                claude-ratelimit-headers.test.ts
                claude-usage-headers.test.ts
                claude-usage-retry.test.ts
                context-overflow.test.ts
                copilot-retry.test.ts
                cursor-exec-handlers.test.ts
                deepseek-reasoning-content.test.ts
                duplicate-tool-results.test.ts
                event-stream.test.ts
                firepass.live.ts
                firepass.test.ts
                github-copilot-anthropic-auth.test.ts
                github-copilot-error.test.ts
                github-copilot-headers.test.ts
                github-copilot-login.test.ts
                github-copilot-long-context-wire.test.ts
                github-copilot-openai-base-url.test.ts
                github-copilot-reasoning.test.ts
                google-antigravity-usage.test.ts
                google-empty-response-retry.test.ts
                google-gemini-cli-3x-thinking.test.ts
                google-gemini-cli-429.test.ts
                google-gemini-cli-alignment.test.ts
                google-gemini-cli-variant-routing.test.ts
                google-system-prompt.test.ts
                google-thinking-signature.test.ts
                google-tool-choice.test.ts
                google-tool-schema.test.ts
                handoff.test.ts
                image-limits.test.ts
                image-tool-result.test.ts
                issue-1203-repro.test.ts
                issue-1207-repro.test.ts
                issue-1227-repro.test.ts
                issue-1270-repro.test.ts
                issue-1373-repro.test.ts
                issue-1399-repro.test.ts
                issue-1417-repro.test.ts
                issue-1701-repro.test.ts
                issue-1776-repro.test.ts
                issue-1838-repro.test.ts
                issue-2080-repro.test.ts
                issue-2123-repro.test.ts
                issue-2315-repro.test.ts
                issue-2424-repro.test.ts
                issue-814-repro.test.ts
                issue-826-repro.test.ts
                issue-827-repro.test.ts
                issue-883-repro.test.ts
                issue-911-repro.test.ts
                issue-912-repro.test.ts
                issue-931-repro.test.ts
                issue-945-repro.test.ts
                issue-955-repro.test.ts
                issue-957-repro.test.ts
                issue-959-repro.test.ts
                issue-967-vision-guard.test.ts
                issue-969-repro.test.ts
                issue-976-repro.test.ts
                json-parse.test.ts
                kagi-login.test.ts
                kilo-login.test.ts
                minimax-code-login.test.ts
                mock-provider.test.ts
                model-cache.test.ts
                models-cost.test.ts
                models-json-no-local-endpoints.test.ts
                nanogpt-login.test.ts
                null-max-tokens-fallback.test.ts
                oauth-deepseek.test.ts
                oauth.ts
                ollama-cloud-login.test.ts
                ollama-thinking-disable.test.ts
                openai-codex-include.test.ts
                openai-codex-reset.test.ts
                openai-codex-responses-lite.test.ts
                openai-codex-stream.test.ts
                openai-codex-usage.test.ts
                openai-codex.test.ts
                openai-completions-compat.test.ts
                openai-completions-disable-reasoning.test.ts
                openai-completions-error-finish-reason.test.ts
                openai-completions-progress-chunk.test.ts
                openai-completions-tool-result-images.test.ts
                openai-completions-upstream-provider.test.ts
                openai-first-event-timeout.test.ts
                openai-max-output-tokens-cap.test.ts
                openai-responses-cache-affinity.test.ts
                openai-responses-developer-role.test.ts
                openai-responses-history-payload.test.ts
                openai-responses-omit-max-output-tokens.test.ts
                openai-responses-orphan-repair.test.ts
                openai-responses-parallel-tool-calls.test.ts
                openai-responses-stateful.test.ts
                openai-responses-stream-terminal.test.ts
                openai-responses-system-prompt.test.ts
                openai-stream-terminal-close.test.ts
                openai-tool-strict-mode.test.ts
                openrouter-login.test.ts
                overflow-utils.test.ts
                parse-streaming-json-throttled.test.ts
                pi-native-client.test.ts
                provider-fetch-override.test.ts
                provider-registry.test.ts
                provider-response.test.ts
                rate-limit-utils.test.ts
                raw-sse-sdk-capture.test.ts
                register-builtins.test.ts
                remote-auth-store.test.ts
                request-debug.test.ts
                requires-effort.test.ts
                schema-compatibility.test.ts
                schema-dereference.test.ts
                schema-helpers.test.ts
                schema-normalization.test.ts
                schema-strict-mode.test.ts
                schema-wire.test.ts
                service-tier-premium-requests.test.ts
                sse-debug.test.ts
                stream-auth-retry.test.ts
                stream-markup-healing.test.ts
                stream-timeout-defaults.test.ts
                stream.test.ts
                synthetic-login.test.ts
                tokens.test.ts
                tool-argument-coercion.test.ts
                tool-call-without-result.test.ts
                total-tokens.test.ts
                transform-messages-dedup.test.ts
                unicode-surrogate.test.ts
                usage-attribution.test.ts
                utils-responses-id.test.ts
                wafer.live.ts
                xai-oauth-effort-strip.test.ts
                xhigh.test.ts
                xiaomi-oauth.test.ts
                xiaomi-tp-login-integration.test.ts
                zenmux-login.test.ts
                data/
                helpers/
                    fetch-mock.ts
                    index.ts
        catalog/
            CHANGELOG.md
            package.json
            README.md
            tsconfig.json
            tsconfig.publish.json
            scripts/
                generate-models.ts
                generated-policies.ts
            src/
                build.ts
                effort.ts
                fireworks-model-id.ts
                hosts.ts
                index.ts
                model-cache.ts
                model-manager.ts
                model-thinking.ts
                models.json
                models.json.d.ts
                models.ts
                types.ts
                utils.ts
                variant-collapse.ts
                compat/
                    anthropic.ts
                    apply.ts
                    openai.ts
                discovery/
                    antigravity.ts
                    codex.ts
                    cursor.ts
                    gemini.ts
                    index.ts
                    openai-compatible.ts
                    cursor-gen/
                        agent_pb.ts
                identity/
                    bundled.ts
                    classify.ts
                    equivalence.ts
                    family.ts
                    id.ts
                    index.ts
                    markers.ts
                    priority.ts
                    reference.ts
                    selection.ts
                provider-models/
                    bundled-references.ts
                    descriptor-types.ts
                    descriptors.ts
                    google.ts
                    index.ts
                    ollama.ts
                    openai-compat.ts
                    special.ts
                wire/
                    codex.ts
                    gemini-headers.ts
                    github-copilot.ts
            test/
                build.test.ts
                canonical-limit-fallback.test.ts
                descriptors.test.ts
                discovery-null-limits.test.ts
                fireworks-serverless-discovery.test.ts
                generated-policies.test.ts
                github-copilot-model-limits.test.ts
                github-copilot-wire.test.ts
                google-vertex-discovery.test.ts
                hosts.test.ts
                identity-family.test.ts
                issue-1617-repro.test.ts
                issue-1846-repro.test.ts
                issue-1849-repro.test.ts
                issue-2105-repro.test.ts
                issue-2113-repro.test.ts
                issue-2299-repro.test.ts
                issue-2558-repro.test.ts
                issue-772-repro.test.ts
                issue-830-repro.test.ts
                issue-847-repro.test.ts
                issue-887-repro.test.ts
                minimax-bundled-catalog.test.ts
                model-id-affixes.test.ts
                model-provider-priority.test.ts
                model-thinking.test.ts
                nanogpt-model-limits.test.ts
                ollama-cloud-output-caps.test.ts
                ollama-cloud-provider.test.ts
                ollama-provider.test.ts
                variant-collapse.test.ts
                wafer.test.ts
                xai-oauth-bundle.test.ts
                zai-bundled-catalog.test.ts
                zenmux-provider.test.ts
                zhipu-compat.test.ts
        coding-agent/
            CHANGELOG.md
            DEVELOPMENT.md
            package.json
            README.md
            tsconfig.examples.json
            tsconfig.json
            tsconfig.publish.json
            bench/
                edit-lsp-writethrough.bench.ts
                rendering.ts
                session-tree-nav.bench.ts
            examples/
                README.md
                custom-tools/
                    README.md
                    hello/
                        index.ts
                extensions/
                    api-demo.ts
                    chalk-logger.ts
                    hello.ts
                    pirate.ts
                    plan-mode.ts
                    README.md
                    reload-runtime.ts
                    thinking-note.ts
                    tools.ts
                    with-deps/
                        .gitignore
                        index.ts
                        package-lock.json
                        package.json
                hooks/
                    auto-commit-on-exit.ts
                    confirm-destructive.ts
                    custom-compaction.ts
                    dirty-repo-guard.ts
                    file-trigger.ts
                    git-checkpoint.ts
                    handoff.ts
                    permission-gate.ts
                    protected-paths.ts
                    qna.ts
                    README.md
                    status-line.ts
                sdk/
                    01-minimal.ts
                    02-custom-model.ts
                    03-custom-prompt.ts
                    04-skills.ts
                    06-extensions.ts
                    06-hooks.ts
                    07-context-files.ts
                    08-prompt-templates.ts
                    08-slash-commands.ts
                    09-api-keys-and-oauth.ts
                    11-sessions.ts
                    12-redis-sessions.ts
                    13-sql-sessions.ts
                    README.md
            scripts/
                bench-guard.ts
                build-binary.ts
                bundle-dist.ts
                format-prompts.ts
                generate-docs-index.ts
                generate-share-viewer.ts
                omp
                omp.ts
            src/
                cli-commands.ts
                cli.ts
                config.ts
                cursor.ts
                index.ts
                main.ts
                priority.json
                sdk.ts
                system-prompt.ts
                telemetry-export.ts
                thinking.ts
                workspace-tree.ts
                async/
                    index.ts
                    job-manager.ts
                auto-thinking/
                    classifier.ts
                autolearn/
                    controller.ts
                    managed-skills.ts
                autoresearch/
                    command-resume.md
                    dashboard.ts
                    git.ts
                    helpers.ts
                    index.ts
                    prompt-setup.md
                    prompt.md
                    resume-message.md
                    state.ts
                    storage.ts
                    types.ts
                    tools/
                        init-experiment.ts
                        log-experiment.ts
                        run-experiment.ts
                        update-notes.ts
                capability/
                    context-file.ts
                    extension-module.ts
                    extension.ts
                    fs.ts
                    hook.ts
                    index.ts
                    instruction.ts
                    mcp.ts
                    prompt.ts
                    rule-buckets.ts
                    rule.ts
                    settings.ts
                    skill.ts
                    slash-command.ts
                    ssh.ts
                    system-prompt.ts
                    tool.ts
                    types.ts
                cli/
                    agents-cli.ts
                    args.ts
                    auth-broker-cli.ts
                    auth-gateway-cli.ts
                    bench-cli.ts
                    classify-install-target.ts
                    claude-trace-cli.ts
                    completion-gen.ts
                    config-cli.ts
                    dry-balance-cli.ts
                    extension-flags.ts
                    file-processor.ts
                    flag-tables.ts
                    gallery-cli.ts
                    gallery-screenshot.ts
                    grep-cli.ts
                    grievances-cli.ts
                    initial-message.ts
                    models-cli.ts
                    plugin-cli.ts
                    profile-alias.ts
                    profile-bootstrap.ts
                    read-cli.ts
                    session-picker.ts
                    setup-cli.ts
                    setup-model-picker.ts
                    shell-cli.ts
                    ssh-cli.ts
                    startup-cwd.ts
                    stats-cli.ts
                    tiny-models-cli.ts
                    update-cli.ts
                    usage-cli.ts
                    web-search-cli.ts
                    worktree-cli.ts
                    commands/
                        init-xdg.ts
                    gallery-fixtures/
                        agentic.ts
                        codeintel.ts
                        edit.ts
                        fs.ts
                        index.ts
                        interaction.ts
                        memory.ts
                        misc.ts
                        search.ts
                        shell.ts
                        types.ts
                        web.ts
                collab/
                    crypto.ts
                    guest.ts
                    host.ts
                    protocol.ts
                    relay-client.ts
                commands/
                    acp.ts
                    agents.ts
                    auth-broker.ts
                    auth-gateway.ts
                    bench.ts
                    commit.ts
                    complete.ts
                    completions.ts
                    config.ts
                    dry-balance.ts
                    gallery.ts
                    grep.ts
                    grievances.ts
                    install.ts
                    join.ts
                    launch.ts
                    models.ts
                    plugin.ts
                    read.ts
                    say.ts
                    setup.ts
                    shell.ts
                    ssh.ts
                    stats.ts
                    tiny-models.ts
                    token.ts
                    update.ts
                    usage.ts
                    web-search.ts
                    worktree.ts
                commit/
                    cli.ts
                    index.ts
                    message.ts
                    model-selection.ts
                    pipeline.ts
                    shared-llm.ts
                    types.ts
                    utils.ts
                    agentic/
                        agent.ts
                        fallback.ts
                        index.ts
                        state.ts
                        topo-sort.ts
                        trivial.ts
                        validation.ts
                        prompts/
                            analyze-file.md
                            session-user.md
                            split-confirm.md
                            system.md
                        tools/
                            analyze-file.ts
                            git-file-diff.ts
                            git-hunk.ts
                            git-overview.ts
                            index.ts
                            propose-changelog.ts
                            propose-commit.ts
                            recent-commits.ts
                            schemas.ts
                            split-commit.ts
                    analysis/
                        conventional.ts
                        index.ts
                        scope.ts
                        summary.ts
                        validation.ts
                    changelog/
                        detect.ts
                        generate.ts
                        index.ts
                        parse.ts
                    git/
                        diff.ts
                    map-reduce/
                        index.ts
                        map-phase.ts
                        reduce-phase.ts
                        utils.ts
                    prompts/
                        analysis-system.md
                        analysis-user.md
                        changelog-system.md
                        changelog-user.md
                        file-observer-system.md
                        file-observer-user.md
                        reduce-system.md
                        reduce-user.md
                        summary-retry.md
                        summary-system.md
                        summary-user.md
                        types-description.md
                    utils/
                        exclusions.ts
                config/
                    api-key-resolver.ts
                    append-only-context-mode.ts
                    config-file.ts
                    file-lock.ts
                    keybindings.ts
                    mcp-schema.json
                    model-discovery.ts
                    model-registry.ts
                    model-resolver.ts
                    model-roles.ts
                    models-config-schema.ts
                    models-config.ts
                    prompt-templates.ts
                    resolve-config-value.ts
                    settings-schema.ts
                    settings.ts
                dap/
                    client.ts
                    config.ts
                    defaults.json
                    index.ts
                    session.ts
                    types.ts
                debug/
                    index.ts
                    log-formatting.ts
                    log-viewer.ts
                    profiler.ts
                    protocol-probe.ts
                    raw-sse-buffer.ts
                    raw-sse.ts
                    report-bundle.ts
                    system-info.ts
                    terminal-info.ts
                discovery/
                    agents-md.ts
                    agents.ts
                    at-imports.ts
                    builtin-defaults.ts
                    builtin.ts
                    claude-plugins.ts
                    claude.ts
                    cline.ts
                    codex.ts
                    cursor.ts
                    gemini.ts
                    github.ts
                    helpers.ts
                    index.ts
                    mcp-json.ts
                    omp-extension-roots.ts
                    omp-plugins.ts
                    opencode.ts
                    plugin-dir-roots.ts
                    ssh.ts
                    substitute-plugin-root.ts
                    vscode.ts
                    windsurf.ts
                    builtin-rules/
                        index.ts
                        rs-box-leak.md
                        rs-future-prelude.md
                        rs-lazylock.md
                        rs-match-ergonomics.md
                        rs-parking-lot.md
                        rs-result-type.md
                        ts-bare-catch.md
                        ts-import-type.md
                        ts-no-any.md
                        ts-no-deprecated-leftovers.md
                        ts-no-dynamic-import.md
                        ts-no-return-type.md
                        ts-no-test-timers.md
                        ts-no-tiny-functions.md
                        ts-promise-with-resolvers.md
                        ts-redundant-clear-guard.md
                        ts-set-map.md
                edit/
                    diff.ts
                    file-snapshot-store.ts
                    index.ts
                    normalize.ts
                    notebook.ts
                    read-file.ts
                    renderer.ts
                    streaming.ts
                    apply-patch/
                        index.ts
                        parser.ts
                    hashline/
                        block-resolver.ts
                        diff.ts
                        execute.ts
                        filesystem.ts
                        index.ts
                        noop-loop-guard.ts
                        params.ts
                    modes/
                        apply-patch.lark
                        apply-patch.ts
                        patch.ts
                        replace.ts
                eval/
                    agent-bridge.ts
                    backend.ts
                    bridge-timeout.ts
                    budget-bridge.ts
                    completion-bridge.ts
                    concurrency-bridge.ts
                    idle-timeout.ts
                    index.ts
                    session-id.ts
                    types.ts
                    js/
                        context-manager.ts
                        executor.ts
                        index.ts
                        tool-bridge.ts
                        worker-core.ts
                        worker-entry.ts
                        worker-protocol.ts
                        shared/
                            helpers.ts
                            indirect-eval.ts
                            local-module-loader.ts
                            prelude.ts
                            prelude.txt
                            rewrite-imports.ts
                            runtime.ts
                            types.ts
                    py/
                        display.ts
                        executor.ts
                        index.ts
                        kernel.ts
                        prelude.py
                        prelude.ts
                        runner.py
                        runtime.ts
                        spawn-options.ts
                        tool-bridge.ts
                        __tests__/
                            prelude.test.ts
                    __tests__/
                        agent-bridge.test.ts
                        bridge-timeout.test.ts
                        budget-bridge.test.ts
                        completion-bridge.test.ts
                        helpers-local-roots.test.ts
                        idle-timeout.test.ts
                        js-context-manager.test.ts
                        kernel-spawn.test.ts
                exa/
                    index.ts
                    mcp-client.ts
                    types.ts
                exec/
                    bash-executor.ts
                    exec.ts
                    non-interactive-env.ts
                export/
                    custom-share.ts
                    share.ts
                    ttsr.ts
                    html/
                        index.ts
                        share-loader.js
                        template.css
                        template.html
                        template.js
                        vendor/
                            highlight.min.js
                            marked.min.js
                extensibility/
                    legacy-pi-ai-shim.ts
                    legacy-pi-coding-agent-shim.ts
                    shared-events.ts
                    skills.ts
                    slash-commands.ts
                    tool-proxy.ts
                    typebox.ts
                    utils.ts
                    custom-commands/
                        index.ts
                        loader.ts
                        types.ts
                        bundled/
                            ci-green/
                                index.ts
                            review/
                                index.ts
                    custom-tools/
                        index.ts
                        loader.ts
                        types.ts
                        wrapper.ts
                    extensions/
                        compact-handler.ts
                        get-commands-handler.ts
                        index.ts
                        loader.ts
                        model-api.ts
                        runner.ts
                        types.ts
                        wrapper.ts
                    hooks/
                        index.ts
                        loader.ts
                        runner.ts
                        tool-wrapper.ts
                        types.ts
                    plugins/
                        doctor.ts
                        git-url.ts
                        index.ts
                        installer.ts
                        legacy-pi-compat.ts
                        loader.ts
                        manager.ts
                        marketplace-auto-update.ts
                        parser.ts
                        types.ts
                        marketplace/
                            cache.ts
                            fetcher.ts
                            index.ts
                            manager.ts
                            registry.ts
                            source-resolver.ts
                            types.ts
                goals/
                    guided-setup.ts
                    index.ts
                    runtime.ts
                    state.ts
                    tools/
                        goal-tool.ts
                hindsight/
                    backend.ts
                    bank.ts
                    client.ts
                    config.ts
                    content.ts
                    index.ts
                    mental-models.ts
                    seeds.json
                    state.ts
                    transcript.ts
                internal-urls/
                    agent-protocol.ts
                    artifact-protocol.ts
                    history-protocol.ts
                    index.ts
                    issue-pr-protocol.ts
                    json-query.ts
                    local-protocol.ts
                    mcp-protocol.ts
                    memory-protocol.ts
                    omp-protocol.ts
                    parse.ts
                    registry-helpers.ts
                    router.ts
                    rule-protocol.ts
                    skill-protocol.ts
                    types.ts
                    vault-protocol.ts
                irc/
                    bus.ts
                lib/
                    xai-http.ts
                lsp/
                    client.ts
                    config.ts
                    defaults.json
                    diagnostics-ledger.ts
                    edits.ts
                    format-options.ts
                    index.ts
                    lspmux.ts
                    render.ts
                    startup-events.ts
                    types.ts
                    utils.ts
                    clients/
                        biome-client.ts
                        index.ts
                        lsp-linter-client.ts
                        swiftlint-client.ts
                mcp/
                    client.ts
                    config-writer.ts
                    config.ts
                    index.ts
                    json-rpc.ts
                    loader.ts
                    manager.ts
                    oauth-credentials.ts
                    oauth-discovery.ts
                    oauth-flow.ts
                    render.ts
                    smithery-auth.ts
                    smithery-connect.ts
                    smithery-registry.ts
                    startup-events.ts
                    timeout.ts
                    tool-bridge.ts
                    tool-cache.ts
                    types.ts
                    transports/
                        http.ts
                        index.ts
                        stdio.ts
                memories/
                    index.ts
                    storage.ts
                memory-backend/
                    index.ts
                    local-backend.ts
                    off-backend.ts
                    resolve.ts
                    runtime.ts
                    types.ts
                mnemopi/
                    backend.ts
                    config.ts
                    index.ts
                    state.ts
                modes/
                    emoji-autocomplete.ts
                    gradient-highlight.ts
                    image-references.ts
                    index.ts
                    interactive-mode.ts
                    internal-url-autocomplete.ts
                    loop-limit.ts
                    magic-keywords.ts
                    markdown-prose.ts
                    oauth-manual-input.ts
                    orchestrate.ts
                    print-mode.ts
                    prompt-action-autocomplete.ts
                    runtime-init.ts
                    session-observer-registry.ts
                    setup-version.ts
                    shared.ts
                    turn-budget.ts
                    types.ts
                    ultrathink.ts
                    workflow.ts
                    acp/
                        acp-agent.ts
                        acp-client-bridge.ts
                        acp-event-mapper.ts
                        acp-mode.ts
                        index.ts
                        terminal-auth.ts
                    components/
                        agent-dashboard.ts
                        agent-hub.ts
                        assistant-message.ts
                        background-tan-message.ts
                        bash-execution.ts
                        bordered-loader.ts
                        branch-summary-message.ts
                        btw-panel.ts
                        chat-block.ts
                        collab-prompt-message.ts
                        compaction-summary-message.ts
                        copy-selector.ts
                        countdown-timer.ts
                        custom-editor.test.ts
                        custom-editor.ts
                        custom-message.ts
                        diff.ts
                        dynamic-border.ts
                        error-banner.ts
                        eval-execution.ts
                        execution-shared.ts
                        footer.ts
                        history-search.ts
                        hook-editor.ts
                        hook-input.ts
                        hook-message.ts
                        hook-selector.ts
                        index.ts
                        keybinding-hints.ts
                        late-diagnostics-message.ts
                        login-dialog.ts
                        logout-account-selector.ts
                        mcp-add-wizard.ts
                        message-frame.ts
                        model-selector.ts
                        oauth-selector.ts
                        omfg-panel.ts
                        overlay-box.ts
                        plan-review-overlay.ts
                        plan-toc.ts
                        plugin-selector.ts
                        plugin-settings.ts
                        queue-mode-selector.ts
                        read-tool-group.ts
                        reset-usage-selector.ts
                        segment-track.ts
                        session-selector.ts
                        settings-defs.ts
                        settings-selector.ts
                        show-images-selector.ts
                        skill-message.ts
                        snapcompact-shape-preview-doc.md
                        snapcompact-shape-preview.ts
                        theme-selector.ts
                        thinking-selector.ts
                        tiny-title-download-progress.ts
                        tips.txt
                        todo-reminder.ts
                        tool-execution.ts
                        transcript-container.ts
                        tree-selector.ts
                        ttsr-notification.ts
                        usage-row.ts
                        user-message-selector.ts
                        user-message.ts
                        visual-truncate.ts
                        welcome.ts
                        extensions/
                            extension-dashboard.ts
                            extension-list.ts
                            index.ts
                            inspector-panel.ts
                            state-manager.ts
                            types.ts
                        status-line/
                            component.ts
                            context-thresholds.ts
                            git-utils.ts
                            index.ts
                            presets.ts
                            segments.ts
                            separators.ts
                            token-rate.ts
                            types.ts
                    controllers/
                        btw-controller.ts
                        command-controller-shared.ts
                        command-controller.ts
                        event-controller.ts
                        extension-ui-controller.ts
                        input-controller.ts
                        mcp-command-controller.ts
                        omfg-controller.ts
                        omfg-rule.ts
                        selector-controller.ts
                        session-focus-controller.ts
                        ssh-command-controller.ts
                        streaming-reveal.ts
                        tan-command-controller.ts
                        todo-command-controller.ts
                        tool-args-reveal.ts
                    data/
                        emojis.json
                    rpc/
                        host-tools.ts
                        host-uris.ts
                        rpc-client.ts
                        rpc-mode.ts
                        rpc-subagents.ts
                        rpc-types.ts
                    setup-wizard/
                        index.ts
                        lazy.ts
                        wizard-overlay.ts
                        scenes/
                            glyph.ts
                            outro.ts
                            providers.ts
                            sign-in.ts
                            splash.ts
                            theme.ts
                            types.ts
                            web-search.ts
                    theme/
                        dark.json
                        light.json
                        mermaid-cache.ts
                        shimmer.ts
                        theme-schema.json
                        theme.ts
                        defaults/
                            alabaster.json
                            amethyst.json
                            anthracite.json
                            basalt.json
                            birch.json
                            dark-abyss.json
                            dark-arctic.json
                            dark-aurora.json
                            dark-catppuccin.json
                            dark-cavern.json
                            dark-copper.json
                            dark-cosmos.json
                            dark-cyberpunk.json
                            dark-dracula.json
                            dark-eclipse.json
                            dark-ember.json
                            dark-equinox.json
                            dark-forest.json
                            dark-github.json
                            dark-gruvbox.json
                            dark-lavender.json
                            dark-lunar.json
                            dark-midnight.json
                            dark-monochrome.json
                            dark-monokai.json
                            dark-nebula.json
                            dark-nord.json
                            dark-ocean.json
                            dark-one.json
                            dark-poimandres.json
                            dark-rainforest.json
                            dark-reef.json
                            dark-retro.json
                            dark-rose-pine.json
                            dark-sakura.json
                            dark-slate.json
                            dark-solarized.json
                            dark-solstice.json
                            dark-starfall.json
                            dark-sunset.json
                            dark-swamp.json
                            dark-synthwave.json
                            dark-taiga.json
                            dark-terminal.json
                            dark-tokyo-night.json
                            dark-tundra.json
                            dark-twilight.json
                            dark-volcanic.json
                            graphite.json
                            index.ts
                            light-arctic.json
                            light-aurora-day.json
                            light-canyon.json
                            light-catppuccin.json
                            light-cirrus.json
                            light-coral.json
                            light-cyberpunk.json
                            light-dawn.json
                            light-dunes.json
                            light-eucalyptus.json
                            light-forest.json
                            light-frost.json
                            light-github.json
                            light-glacier.json
                            light-gruvbox.json
                            light-haze.json
                            light-honeycomb.json
                            light-lagoon.json
                            light-lavender.json
                            light-meadow.json
                            light-mint.json
                            light-monochrome.json
                            light-ocean.json
                            light-one.json
                            light-opal.json
                            light-orchard.json
                            light-paper.json
                            light-poimandres.json
                            light-prism.json
                            light-retro.json
                            light-sand.json
                            light-savanna.json
                            light-solarized.json
                            light-soleil.json
                            light-sunset.json
                            light-synthwave.json
                            light-tokyo-night.json
                            light-wetland.json
                            light-zenith.json
                            limestone.json
                            mahogany.json
                            marble.json
                            obsidian.json
                            onyx.json
                            pearl.json
                            porcelain.json
                            quartz.json
                            sandstone.json
                            titanium.json
                    utils/
                        context-usage.ts
                        copy-targets.ts
                        hotkeys-markdown.ts
                        keybinding-matchers.ts
                        tools-markdown.ts
                        ui-helpers.ts
                plan-mode/
                    approved-plan.ts
                    plan-handoff.ts
                    plan-protection.ts
                    state.ts
                prompts/
                    bench.md
                    ci-green-request.md
                    dry-balance-bench.md
                    review-custom-request.md
                    review-headless-request.md
                    review-request.md
                    agents/
                        designer.md
                        explore.md
                        frontmatter.md
                        init.md
                        librarian.md
                        oracle.md
                        plan.md
                        reviewer.md
                        task.md
                    goals/
                        goal-budget-limit.md
                        goal-continuation.md
                        goal-mode-active.md
                        guided-goal-interview.md
                        guided-goal-system.md
                    memories/
                        consolidation.md
                        consolidation_system.md
                        read-path.md
                        stage_one_input.md
                        stage_one_system.md
                    steering/
                        user-interjection.md
                    system/
                        agent-creation-architect.md
                        agent-creation-user.md
                        auto-continue.md
                        auto-thinking-difficulty-local.md
                        auto-thinking-difficulty.md
                        autolearn-guidance-learn.md
                        autolearn-guidance.md
                        autolearn-nudge.md
                        background-tan-dispatch.md
                        btw-user.md
                        commit-message-system.md
                        custom-system-prompt.md
                        eager-task.md
                        eager-todo.md
                        empty-stop-retry.md
                        irc-autoreply.md
                        irc-incoming.md
                        manual-continue.md
                        memory-consolidation-system.md
                        memory-extraction-system.md
                        omfg-user.md
                        orchestrate-notice.md
                        plan-mode-active.md
                        plan-mode-approved.md
                        plan-mode-compact-instructions.md
                        plan-mode-reference.md
                        plan-mode-subagent.md
                        plan-mode-tool-decision-reminder.md
                        project-prompt.md
                        snapcompact-context-frames-note.md
                        snapcompact-context-stub.md
                        snapcompact-system-frames-note.md
                        snapcompact-system-stub.md
                        snapcompact-toolresult-note.md
                        subagent-system-prompt.md
                        subagent-user-prompt.md
                        subagent-yield-reminder.md
                        system-prompt.md
                        tiny-title-system.md
                        title-marker-instruction.md
                        title-system-marker.md
                        title-system.md
                        ttsr-interrupt.md
                        ttsr-tool-reminder.md
                        ultrathink-notice.md
                        web-search.md
                        workflow-notice.md
                        personalities/
                            default.md
                            friendly.md
                            pragmatic.md
                    tools/
                        apply-patch.md
                        ask.md
                        ast-edit.md
                        ast-grep.md
                        async-result.md
                        bash.md
                        browser.md
                        checkpoint.md
                        debug.md
                        eval.md
                        find.md
                        github.md
                        goal.md
                        image-gen.md
                        inspect-image-system.md
                        inspect-image.md
                        irc.md
                        job.md
                        learn.md
                        lsp-late-diagnostic.md
                        lsp.md
                        manage-skill.md
                        memory-edit.md
                        patch.md
                        read.md
                        recall.md
                        reflect.md
                        render-mermaid.md
                        replace.md
                        resolve.md
                        retain.md
                        rewind.md
                        search-tool-bm25.md
                        search.md
                        ssh.md
                        task-summary.md
                        task.md
                        todo.md
                        web-search.md
                        write.md
                registry/
                    agent-lifecycle.ts
                    agent-registry.ts
                secrets/
                    index.ts
                    obfuscator.ts
                    regex.ts
                session/
                    agent-session.ts
                    agent-storage.ts
                    artifacts.ts
                    auth-broker-config.ts
                    auth-storage.ts
                    blob-store.ts
                    client-bridge.ts
                    codex-auto-reset.ts
                    history-storage.ts
                    indexed-session-storage.ts
                    messages.ts
                    redis-session-storage.ts
                    session-context.ts
                    session-dump-format.ts
                    session-entries.ts
                    session-history-format.ts
                    session-listing.ts
                    session-loader.ts
                    session-manager.ts
                    session-migrations.ts
                    session-paths.ts
                    session-persistence.ts
                    session-storage.ts
                    shake-types.ts
                    snapcompact-inline.ts
                    snapcompact-savings-journal.ts
                    sql-session-storage.ts
                    streaming-output.ts
                    tool-choice-queue.ts
                    yield-queue.ts
                slash-commands/
                    acp-builtins.ts
                    available-commands.ts
                    builtin-registry.ts
                    marketplace-install-parser.ts
                    types.ts
                    helpers/
                        active-oauth-account.ts
                        context-report.ts
                        format.ts
                        logout.ts
                        marketplace-manager.ts
                        mcp.ts
                        parse.ts
                        reset-usage.ts
                        ssh.ts
                        stats-dashboard.ts
                        todo.ts
                        usage-report.ts
                ssh/
                    config-writer.ts
                    connection-manager.ts
                    ssh-executor.ts
                    sshfs-mount.ts
                    utils.ts
                stt/
                    asr-client.ts
                    asr-protocol.ts
                    asr-worker.ts
                    downloader.ts
                    endpointer.ts
                    index.ts
                    models.ts
                    recorder.ts
                    stt-controller.ts
                    transcriber.ts
                    wav.ts
                task/
                    agents.ts
                    commands.ts
                    discovery.ts
                    executor.ts
                    index.ts
                    name-generator.ts
                    omp-command.ts
                    output-manager.ts
                    parallel.ts
                    render.ts
                    repair-args.ts
                    subprocess-tool-registry.ts
                    types.ts
                    worktree.ts
                tiny/
                    device.ts
                    dtype.ts
                    models.ts
                    text.ts
                    title-client.ts
                    title-protocol.ts
                    worker.ts
                tool-discovery/
                    mode.ts
                    tool-index.ts
                tools/
                    approval.ts
                    archive-reader.ts
                    ask.ts
                    ast-edit.ts
                    ast-grep.ts
                    auto-generated-guard.ts
                    bash-command-fixup.ts
                    bash-interactive.ts
                    bash-interceptor.ts
                    bash-pty-selection.ts
                    bash-skill-urls.ts
                    bash.ts
                    browser.ts
                    builtin-names.ts
                    checkpoint.ts
                    conflict-detect.ts
                    context.ts
                    debug.ts
                    eval-backends.ts
                    eval-render.ts
                    eval.ts
                    fetch.ts
                    file-recorder.ts
                    find.ts
                    fs-cache-invalidation.ts
                    gh-cache-invalidation.ts
                    gh-format.ts
                    gh-renderer.ts
                    gh.ts
                    github-cache.ts
                    grouped-file-output.ts
                    image-gen.ts
                    index.ts
                    inspect-image-renderer.ts
                    inspect-image.ts
                    irc.ts
                    job.ts
                    json-tree.ts
                    jtd-to-json-schema.ts
                    jtd-to-typescript.ts
                    jtd-utils.ts
                    learn.ts
                    list-limit.ts
                    manage-skill.ts
                    match-line-format.ts
                    memory-edit.ts
                    memory-recall.ts
                    memory-reflect.ts
                    memory-render.ts
                    memory-retain.ts
                    output-meta.ts
                    output-schema-validator.ts
                    path-utils.ts
                    plan-mode-guard.ts
                    read.ts
                    render-mermaid.ts
                    render-utils.ts
                    renderers.ts
                    report-tool-issue.ts
                    resolve.ts
                    review.ts
                    search-tool-bm25.ts
                    search.ts
                    sqlite-reader.ts
                    ssh.ts
                    todo.ts
                    tool-errors.ts
                    tool-result.ts
                    tool-timeouts.ts
                    tts.ts
                    write.ts
                    yield.ts
                    browser/
                        attach.ts
                        launch.ts
                        readable.ts
                        registry.ts
                        render.ts
                        tab-protocol.ts
                        tab-supervisor.ts
                        tab-worker-entry.ts
                        tab-worker.ts
                        cmux/
                            cmux-tab.ts
                            rpc.ts
                            socket-client.ts
                    puppeteer/
                        00_stealth_tampering.txt
                        01_stealth_activity.txt
                        02_stealth_hairline.txt
                        03_stealth_botd.txt
                        04_stealth_iframe.txt
                        05_stealth_webgl.txt
                        06_stealth_screen.txt
                        07_stealth_fonts.txt
                        08_stealth_audio.txt
                        09_stealth_locale.txt
                        10_stealth_plugins.txt
                        11_stealth_hardware.txt
                        12_stealth_codecs.txt
                        13_stealth_worker.txt
                tts/
                    downloader.ts
                    index.ts
                    models.ts
                    player.ts
                    runtime.ts
                    streaming-player.ts
                    tts-client.ts
                    tts-protocol.ts
                    tts-worker.ts
                    vocalizer.ts
                    wav.ts
                tui/
                    code-cell.ts
                    file-list.ts
                    hyperlink.ts
                    index.ts
                    output-block.ts
                    status-line.ts
                    tree-list.ts
                    types.ts
                    utils.ts
                utils/
                    block-context.ts
                    changelog.ts
                    clipboard.ts
                    command-args.ts
                    commit-message-generator.ts
                    edit-mode.ts
                    enhanced-paste.ts
                    event-bus.ts
                    external-editor.ts
                    file-display-mode.ts
                    file-mentions.ts
                    git.ts
                    image-loading.ts
                    image-resize.ts
                    jj.ts
                    lang-from-path.ts
                    markit.ts
                    open.ts
                    session-color.ts
                    shell-snapshot.ts
                    sixel.ts
                    thinking-display.ts
                    title-generator.ts
                    tool-choice.ts
                    tools-manager.ts
                web/
                    kagi.ts
                    parallel.ts
                    scrapers/
                        artifacthub.ts
                        arxiv.ts
                        aur.ts
                        biorxiv.ts
                        bluesky.ts
                        brew.ts
                        cheatsh.ts
                        chocolatey.ts
                        choosealicense.ts
                        cisa-kev.ts
                        clojars.ts
                        coingecko.ts
                        crates-io.ts
                        crossref.ts
                        devto.ts
                        discogs.ts
                        discourse.ts
                        dockerhub.ts
                        docs-rs.ts
                        fdroid.ts
                        firefox-addons.ts
                        flathub.ts
                        github-gist.ts
                        github.ts
                        gitlab.ts
                        go-pkg.ts
                        hackage.ts
                        hackernews.ts
                        hex.ts
                        huggingface.ts
                        iacr.ts
                        index.ts
                        jetbrains-marketplace.ts
                        lemmy.ts
                        lobsters.ts
                        mastodon.ts
                        maven.ts
                        mdn.ts
                        metacpan.ts
                        musicbrainz.ts
                        npm.ts
                        nuget.ts
                        nvd.ts
                        ollama.ts
                        open-vsx.ts
                        opencorporates.ts
                        openlibrary.ts
                        orcid.ts
                        osv.ts
                        packagist.ts
                        pub-dev.ts
                        pubmed.ts
                        pypi.ts
                        rawg.ts
                        readthedocs.ts
                        reddit.ts
                        repology.ts
                        rfc.ts
                        rubygems.ts
                        searchcode.ts
                        sec-edgar.ts
                        semantic-scholar.ts
                        snapcraft.ts
                        sourcegraph.ts
                        spdx.ts
                        spotify.ts
                        stackoverflow.ts
                        terraform.ts
                        tldr.ts
                        twitter.ts
                        types.ts
                        utils.ts
                        vimeo.ts
                        vscode-marketplace.ts
                        w3c.ts
                        wikidata.ts
                        wikipedia.ts
                        youtube.ts
                    search/
                        index.ts
                        provider.ts
                        render.ts
                        types.ts
                        utils.ts
                        providers/
                            anthropic.ts
                            base.ts
                            brave.ts
                            codex.ts
                            exa.ts
                            gemini.ts
                            jina.ts
                            kagi.ts
                            kimi.ts
                            parallel.ts
                            perplexity.ts
                            searxng.ts
                            synthetic.ts
                            tavily.ts
                            utils.ts
                            zai.ts
            test/
                acp-agent.test.ts
                acp-builtins.test.ts
                acp-client-bridge.test.ts
                acp-event-mapper.test.ts
                acp-initialize-conformance.test.ts
                acp-lazy-startup.test.ts
                acp-mcp-isolation.test.ts
                acp-stdout-hygiene.test.ts
                active-oauth-account.test.ts
                agent-dashboard-create-editor.test.ts
                agent-hub-activate.test.ts
                agent-session-acp-permission.test.ts
                agent-session-auto-compaction-queue.test.ts
                agent-session-bash-detach.test.ts
                agent-session-before-agent-start-attribution.test.ts
                agent-session-branching.test.ts
                agent-session-compaction.test.ts
                agent-session-concurrent.test.ts
                agent-session-context-promotion.test.ts
                agent-session-eager-task.test.ts
                agent-session-eager-todo.test.ts
                agent-session-empty-stop-guard.test.ts
                agent-session-force-tool-choice.test.ts
                agent-session-fresh.test.ts
                agent-session-handoff.test.ts
                agent-session-magic-keywords.test.ts
                agent-session-manual-retry.test.ts
                agent-session-mcp-discovery.test.ts
                agent-session-message-pipeline.test.ts
                agent-session-model-persistence.test.ts
                agent-session-model-switch-auth.test.ts
                agent-session-openai-responses-replay.test.ts
                agent-session-python-cleanup.test.ts
                agent-session-queued-steer-delivery.test.ts
                agent-session-resolve-reminder.test.ts
                agent-session-retry-cap.test.ts
                agent-session-retry-fallback.test.ts
                agent-session-role-thinking.test.ts
                agent-session-silent-abort.test.ts
                agent-session-skill-keywords.test.ts
                agent-session-ssh-refresh.test.ts
                agent-session-steer-idle-drain.test.ts
                agent-session-todo-reminder-loop.test.ts
                agent-session-tool-rebuild-skip.test.ts
                agent-session-tree-navigation.test.ts
                agent-session-user-shortcut-hooks.test.ts
                agent-storage-sqlite-compat.test.ts
                append-only-context-mode.test.ts
                async-job-manager.test.ts
                async-yield-queue.test.ts
                auth-broker-import.test.ts
                auth-broker-snapshot-cache.test.ts
                auth-storage-minimax-login.test.ts
                auth-storage-rotation.test.ts
                auto-thinking-classifier.test.ts
                autocomplete-max-visible.test.ts
                autolearn-controller.test.ts
                autolearn-discovery.test.ts
                autolearn-learn-local.test.ts
                autolearn-managed-skills.test.ts
                autolearn-tools-gating.test.ts
                autoresearch-state.test.ts
                autoresearch-tools.test.ts
                available-commands.test.ts
                bash-acp-terminal.test.ts
                bash-execution-clamp.test.ts
                bash-execution-sixel.test.ts
                bash-executor.test.ts
                bash-failure-result.test.ts
                block-images.test.ts
                checkpoint-rpc-qa.ts
                cli-cwd-flag.test.ts
                cli-hide-thinking-flag.test.ts
                cli-unknown-flag.test.ts
                client-prompts.test.ts
                client-resources.test.ts
                codex-auto-reset.test.ts
                commit-agentic-attribution.test.ts
                commit-command-exit.test.ts
                commit-model-selection-role-thinking.test.ts
                commit-shared-llm.test.ts
                commit-split-hunk-validation.test.ts
                compaction-hooks.test.ts
                compaction-lifecycle.test.ts
                compaction-prefer-current-model.test.ts
                compaction-serialization.test.ts
                compaction-thinking-model.test.ts
                compaction.test.ts
                config-cli.test.ts
                config-spacing.test.ts
                countdown-timer.test.ts
                dap-write-sink-flush.typecheck.ts
                edit-auto-generated-regressions.test.ts
                edit-diff.test.ts
                edit-patch-unchanged-error.test.ts
                edit-per-file-diff-content.test.ts
                edit-streaming-preview.test.ts
                editor-max-height.test.ts
                emoji-autocomplete.test.ts
                event-controller-abort-render.test.ts
                event-controller-error-banner.test.ts
                export-subsessions.test.ts
                extension-dashboard-state.test.ts
                extension-flag-dispatch.test.ts
                extension-flag-initial-message.test.ts
                extension-loader-self-import.test.ts
                extensions-discovery.test.ts
                extensions-runner.test.ts
                external-editor.test.ts
                fast-mode-scope.test.ts
                file-lock.test.ts
                file-mentions.test.ts
                flag-tables.test.ts
                fuzzy.test.ts
                gallery-cli.test.ts
                git-process-config.test.ts
                git-reftable.test.ts
                git-url.test.ts
                hindsight-backend.test.ts
                hindsight-bank.test.ts
                hindsight-client.test.ts
                hindsight-content.test.ts
                hindsight-mental-models.test.ts
                history-storage-search.test.ts
                history-storage-session.test.ts
                history-storage-sqlite-compat.test.ts
                hook-editor.test.ts
                hook-input-timeout.test.ts
                hook-selector-overflow.test.ts
                image-b64poly.test.ts
                image-input-normalization.test.ts
                image-input.test.ts
                image-webp-exclusion.test.ts
                initial-message.test.ts
                input-controller-compaction-image.test.ts
                input-controller-escape.test.ts
                input-controller-followup-image.test.ts
                input-controller-keybindings.test.ts
                input-controller-large-paste.test.ts
                input-controller-orphan-submit.test.ts
                input-controller-skill-queue.test.ts
                input-controller-smart-paste.test.ts
                input-controller-suspend.test.ts
                input-controller-thinking-visibility.test.ts
                install-command.test.ts
                interactive-mode-editor-component.test.ts
                interactive-mode-loop.test.ts
                interactive-mode-lsp-startup.test.ts
                interactive-mode-mcp-connecting.test.ts
                interactive-mode-model-cycle.test.ts
                interactive-mode-plan-review.test.ts
                interactive-mode-prompt-template-autocomplete.test.ts
                interactive-mode-status.test.ts
                interactive-mode-todo-clear.test.ts
                interactive-mode-working-accent.test.ts
                issue-1011-repro.test.ts
                issue-1150-repro.test.ts
                issue-1215-legacy-pi-ai-import.test.ts
                issue-1401-repro.test.ts
                issue-1423-repro.test.ts
                issue-1528-discovery-default-max-tokens.test.ts
                issue-1606-repro.test.ts
                issue-1940-repro.test.ts
                issue-2127-repro.test.ts
                issue-2372-repro.test.ts
                issue-2375-repro.test.ts
                issue-2510-repro.test.ts
                issue-775-repro.test.ts
                issue-816-repro.test.ts
                issue-825-repro.test.ts
                issue-845-repro.test.ts
                issue-846-repro.test.ts
                issue-849-repro.test.ts
                issue-851-repro.test.ts
                issue-899-repro.test.ts
                issue-905-repro.test.ts
                issue-927-repro.test.ts
                issue-953-repro.test.ts
                issue-956-repro.test.ts
                issue-966-repro.test.ts
                issue-970-custom-provider-discovery.test.ts
                issue-973-legacy-pi-plugin.test.ts
                issue-980-bedrock-priority.test.ts
                issue-983-multi-file-extension.test.ts
                issue-985-subagent-auth-fallback.test.ts
                issue-986-compaction-auth-fallback.test.ts
                issue-interrupt-and-flush-empty-messages.test.ts
                job-poll-displacement.test.ts
                job-renderer-preview.test.ts
                join-command.test.ts
                join-patch.test.ts
                keybindings-display.test.ts
                keybindings-escape-components.test.ts
                keybindings-migration.test.ts
                keybindings-selector-navigation.test.ts
                lm-studio-fix.test.ts
                loop-limit.test.ts
                lsp-format-options.test.ts
                lsp-render.test.ts
                main-cross-project-resume.test.ts
                main-interactive-input.test.ts
                main-model-scope-notification.test.ts
                main-session-resolution-error.test.ts
                mcp-command-reauth.test.ts
                mcp-discovered-server-reauth.test.ts
                mcp-json-rpc.test.ts
                mcp-manager-oauth-refresh.test.ts
                mcp-manager-subscription-action.test.ts
                mcp-profile-auth-binding.test.ts
                mcp-reconnect-storm.test.ts
                mcp-reconnect.test.ts
                mcp-render-status.test.ts
                mcp-roots-list.test.ts
                mcp-startup-events.test.ts
                mcp-startup-no-block.test.ts
                mcp-stdio-transport.test.ts
                mcp-test-utils.ts
                mcp-timeout.test.ts
                mcp-tool-ordering.test.ts
                memories-runtime.test.ts
                memories-storage.test.ts
                memory-backend-resolve.test.ts
                memory-session-storage.test.ts
                memory-tools.test.ts
                mnemopi-bank-derivation.test.ts
                mnemopi-embedding-variant.test.ts
                model-discovery.test.ts
                model-registry-command-values.test.ts
                model-registry-create.test.ts
                model-registry-runtime-cleanup.test.ts
                model-registry-runtime-provider.test.ts
                model-registry.test.ts
                model-resolver.test.ts
                model-selector-role-badge-thinking.test.ts
                oauth-discovery.test.ts
                oauth-flow.test.ts
                oauth-manual-input.test.ts
                otel-export-probe.ts
                pi-scope-aliases.test.ts
                plan-mode-thinking-level.test.ts
                plugin-command.test.ts
                plugin-extensions-discovery.test.ts
                plugin-install-git.test.ts
                plugin-install-local.test.ts
                plugin-install-validation.test.ts
                profile-alias.test.ts
                profile-bootstrap.test.ts
                profile-cli.test.ts
                prompt-action-autocomplete.test.ts
                prompt-format.test.ts
                prompt-templates.test.ts
                read-acp-fs.test.ts
                read-column-truncation-snapshot.test.ts
                read-multi-range.test.ts
                read-summary.test.ts
                read-tool-group-freeze.test.ts
                read-tool-group.test.ts
                repro-issue-1020-ctx-shutdown.test.ts
                repro-issue-1022-disabled-default-model.test.ts
                repro-issue-2600-shutdown-timeout.test.ts
                role-info.test.ts
                role-thinking-helper-propagation.test.ts
                rpc-client.start.test.ts
                rpc-example.ts
                rpc-host-tools.test.ts
                rpc-host-uris.test.ts
                rpc-prompt-result.test.ts
                rpc-skill-command.test.ts
                rpc-subagents.test.ts
                rpc.test.ts
                sdk-async-job-manager-singleton.test.ts
                sdk-autolearn-active-tools.test.ts
                sdk-credential-disabled-bridge.test.ts
                sdk-custom-tools-per-session-binding.test.ts
                sdk-extensions-per-session-binding.test.ts
                sdk-mcp-auto-discovery.test.ts
                sdk-mcp-defer.test.ts
                sdk-mcp-discovery.test.ts
                sdk-mcp-instructions.test.ts
                sdk-model-selection.test.ts
                sdk-move-cwd.test.ts
                sdk-preloaded-extensions-isolation.test.ts
                sdk-session-isolation.test.ts
                sdk-skills.test.ts
                sdk-tool-activation.test.ts
                secrets-obfuscator.test.ts
                session-color.test.ts
                session-focus-controller.test.ts
                session-manager-close-race.test.ts
                session-manager-cwd-adoption.test.ts
                session-manager-immediate-persist.test.ts
                session-manager-internal-details.test.ts
                session-messages.test.ts
                session-ranking.test.ts
                session-storage.test.ts
                settings-manager.test.ts
                settings-reload-cwd.test.ts
                setup-wizard-sign-in.test.ts
                setup-wizard.test.ts
                shake.test.ts
                share.test.ts
                silent-abort-overlay-render.test.ts
                silent-abort-print-mode.test.ts
                skills.test.ts
                slash-command-format.test.ts
                snapcompact-inline.test.ts
                snapcompact-savings-journal.test.ts
                startup-import-graph.test.ts
                stats-dashboard-bundle.test.ts
                status-line-cache-hit.test.ts
                status-line-context-cache.test.ts
                status-line-git-utils.test.ts
                status-line-overflow.test.ts
                status-line-path.test.ts
                status-line-settings-cache.test.ts
                status-line-token-rate.test.ts
                status-line-transparent.test.ts
                status-text-sanitization.test.ts
                streaming-edit-abort.test.ts
                streaming-output.test.ts
                streaming-preview-height.test.ts
                streaming-render-debug.ts
                streaming-reveal.test.ts
                strip-images-from-message.test.ts
                subagent-hud-render.test.ts
                system-prompt-dedup.test.ts
                system-prompt-math.test.ts
                system-prompt-model.test.ts
                system-prompt-personality.test.ts
                telemetry-export.test.ts
                test-theme-colors.ts
                theme-auto-detection.test.ts
                theme-epoch-fallback.test.ts
                theme-islight.test.ts
                theme-spinner-frames.test.ts
                tiny-device.test.ts
                tiny-dtype.test.ts
                tiny-text.test.ts
                tiny-title-generator.test.ts
                tiny-worker-env.test.ts
                title-generator.test.ts
                tool-args-reveal.test.ts
                tool-choice-queue.test.ts
                tool-execution-args.test.ts
                tool-execution-memoization.test.ts
                tools.test.ts
                transcript-streaming-commit-repro.test.ts
                truncate-to-width.test.ts
                tui-tree-list-collapsed-lines.test.ts
                update-cli.test.ts
                usage-cli.test.ts
                usage-row-placement.test.ts
                utilities.ts
                visual-truncate.test.ts
                welcome-tip.test.ts
                workspace-tree.test.ts
                write-acp-fs.test.ts
                write-hashline-header.test.ts
                write-shebang-chmod.test.ts
                write-streaming-preview-expand.test.ts
                xiaomi-tp-discovery-merge.test.ts
                capability/
                    fs-special-files.test.ts
                    rule-buckets.test.ts
                cli/
                    completions.test.ts
                collab/
                    crypto.test.ts
                    read-only.test.ts
                    session-replication.test.ts
                    steer-queue.test.ts
                core/
                    apply-patch-adverserial.test.ts
                    apply-patch-regression.test.ts
                    apply-patch.test.ts
                    block-replace.test.ts
                    eval-workflow-helpers.integration.test.ts
                    hashline-loop-guard.test.ts
                    hashline.test.ts
                    helpers.ts
                    js-executor.test.ts
                    js-static-import-rewrite.test.ts
                    js-tool-bridge.test.ts
                    js-workflow-helpers.test.ts
                    python-display.test.ts
                    python-executor-display.test.ts
                    python-executor-lifecycle.test.ts
                    python-executor-mapping.test.ts
                    python-executor-owner-cleanup.test.ts
                    python-executor-per-call.test.ts
                    python-executor-streaming.test.ts
                    python-executor-timeout.test.ts
                    python-executor.lifecycle.test.ts
                    python-executor.result.test.ts
                    python-executor.test.ts
                    python-kernel-display.test.ts
                    python-kernel-env.test.ts
                    python-kernel-session.test.ts
                    python-runner.integration.test.ts
                    python-tool-bridge.test.ts
                    turn-budget.test.ts
                debug/
                    dap-launch-failures.test.ts
                    log-formatting.test.ts
                    log-viewer.test.ts
                    protocol-probe.test.ts
                    raw-sse-buffer.test.ts
                    raw-sse-pretty.test.ts
                    raw-sse-report-bundle.test.ts
                    terminal-info.test.ts
                discovery/
                    agent-discovery-disabled-providers.test.ts
                    agent-fields.test.ts
                    agents-monorepo-skills.test.ts
                    at-imports.test.ts
                    builtin-defaults.test.ts
                    builtin-rules-md.test.ts
                    claude-commands.test.ts
                    claude-plugins.test.ts
                    context-file-dedup.test.ts
                    disabled-extensions.test.ts
                    github-skills.test.ts
                    helpers.test.ts
                    mcp-json.test.ts
                    mcp-profile.test.ts
                    monorepo-skills.test.ts
                    omp-plugins.test.ts
                    pi-config-dir.test.ts
                    profile-isolation.test.ts
                edit/
                    file-snapshot-store.test.ts
                    seen-line-guard.test.ts
                eval/
                    agent-bridge.test.ts
                    console-table.test.ts
                    display-image-coerce.test.ts
                    process-stdio-capture.test.ts
                extensibility/
                    ext-model-query.test.ts
                    legacy-pi-ai-type-remap.test.ts
                    legacy-pi-bunfs-root.test.ts
                    legacy-pi-inplace-load.test.ts
                    legacy-pi-override-fallback.test.ts
                    typebox-remap.test.ts
                    typebox-shim.test.ts
                    custom-commands/
                        ci-green.test.ts
                        review.test.ts
                fixtures/
                    assistant-message-with-thinking-code.json
                    before-compaction.jsonl
                    chunk-edit-indent.rs
                    crash-after-init-mcp.ts
                    hang-during-init-mcp.ts
                    instructions-mcp.ts
                    large-session.jsonl
                    many-tools-mcp.ts
                    apply-patch/
                        scenarios/
                            .gitattributes
                            README.md
                            001_add_file/
                                patch.txt
                                expected/
                                    bar.md
                            003_multiple_chunks/
                                patch.txt
                                expected/
                                    multi.txt
                                input/
                                    multi.txt
                            004_move_to_new_directory/
                                patch.txt
                                expected/
                                    old/
                                        other.txt
                                    renamed/
                                        dir/
                                            name.txt
                                input/
                                    old/
                                        name.txt
                                        other.txt
                            005_rejects_empty_patch/
                                patch.txt
                                expected/
                                    foo.txt
                                input/
                                    foo.txt
                            006_rejects_missing_context/
                                patch.txt
                                expected/
                                    modify.txt
                                input/
                                    modify.txt
                            007_rejects_missing_file_delete/
                                patch.txt
                                expected/
                                    foo.txt
                                input/
                                    foo.txt
                            008_rejects_empty_update_hunk/
                                patch.txt
                                expected/
                                    foo.txt
                                input/
                                    foo.txt
                            009_requires_existing_file_for_update/
                                patch.txt
                                expected/
                                    foo.txt
                                input/
                                    foo.txt
                            010_move_overwrites_existing_destination/
                                patch.txt
                                expected/
                                    old/
                                        other.txt
                                    renamed/
                                        dir/
                                            name.txt
                                input/
                                    old/
                                        name.txt
                                        other.txt
                                    renamed/
                                        dir/
                                            name.txt
                            011_add_overwrites_existing_file/
                                patch.txt
                                expected/
                                    duplicate.txt
                                input/
                                    duplicate.txt
                            012_delete_directory_fails/
                                patch.txt
                                expected/
                                    dir/
                                        foo.txt
                                input/
                                    dir/
                                        foo.txt
                            013_rejects_invalid_hunk_header/
                                patch.txt
                                expected/
                                    foo.txt
                                input/
                                    foo.txt
                            014_update_file_appends_trailing_newline/
                                patch.txt
                                expected/
                                    no_newline.txt
                                input/
                                    no_newline.txt
                            016_pure_addition_update_chunk/
                                patch.txt
                                expected/
                                    input.txt
                                input/
                                    input.txt
                            017_whitespace_padded_hunk_header/
                                patch.txt
                                expected/
                                    foo.txt
                                input/
                                    foo.txt
                            018_whitespace_padded_patch_markers/
                                patch.txt
                                expected/
                                    file.txt
                                input/
                                    file.txt
                            019_unicode_simple/
                                patch.txt
                                expected/
                                    foo.txt
                                input/
                                    foo.txt
                            020_delete_file_success/
                                patch.txt
                                expected/
                                    keep.txt
                                input/
                                    keep.txt
                                    obsolete.txt
                            020_whitespace_padded_patch_marker_lines/
                                patch.txt
                                expected/
                                    file.txt
                                input/
                                    file.txt
                            021_update_file_deletion_only/
                                patch.txt
                                expected/
                                    lines.txt
                                input/
                                    lines.txt
                            022_update_file_end_of_file_marker/
                                patch.txt
                                expected/
                                    tail.txt
                                input/
                                    tail.txt
                    skills/
                        consecutive-hyphens/
                            SKILL.md
                        invalid-name-chars/
                            SKILL.md
                        long-name/
                            SKILL.md
                        missing-description/
                            SKILL.md
                        name-mismatch/
                            SKILL.md
                        nested/
                            child-skill/
                                SKILL.md
                        no-frontmatter/
                            SKILL.md
                        unknown-field/
                            SKILL.md
                        valid-skill/
                            SKILL.md
                    skills-collision/
                        first/
                            calendar/
                                SKILL.md
                        second/
                            calendar/
                                SKILL.md
                goals/
                    goal-mode-integration.test.ts
                    goal-runtime.test.ts
                    goal-tool.test.ts
                    guided-goal.test.ts
                helpers/
                    acp-schema.ts
                    agent-session-setup.ts
                    fetch-mock.ts
                    settings-test-state.ts
                    sqlite-inspect.ts
                    temp-home-cleanup.ts
                internal-urls/
                    history-protocol.test.ts
                    issue-pr-protocol.test.ts
                    local-protocol.test.ts
                    mcp-protocol.test.ts
                    memory-protocol.test.ts
                    omp-protocol.test.ts
                    vault-protocol.test.ts
                marketplace/
                    cache.test.ts
                    cli.test.ts
                    dev-ergonomics.test.ts
                    discovery.test.ts
                    fetcher.test.ts
                    manager.test.ts
                    parse-internal-url.test.ts
                    project-scope.test.ts
                    registry.test.ts
                    slash-install-parser.test.ts
                    source-resolver.test.ts
                    substitute-plugin-root.test.ts
                    fixtures/
                        valid-marketplace/
                            .claude-plugin/
                                marketplace.json
                            plugins/
                                hello-plugin/
                                    .lsp.json
                                    .mcp.json
                                    .claude-plugin/
                                        plugin.json
                                    agents/
                                        reviewer.md
                                    commands/
                                        hello.md
                                    skills/
                                        greet/
                                            SKILL.md
                memories/
                    instructions.test.ts
                    isolation.test.ts
                modes/
                    context-usage.test.ts
                    image-references.test.ts
                    internal-url-autocomplete.test.ts
                    magic-keywords.test.ts
                    markdown-prose.test.ts
                    orchestrate.test.ts
                    workflow.test.ts
                    components/
                        assistant-message-error.test.ts
                        assistant-message-mermaid.test.ts
                        assistant-message-streaming-fastpath.test.ts
                        background-tan-message.test.ts
                        chat-block.test.ts
                        compaction-divider.test.ts
                        compaction-summary-message.test.ts
                        copy-selector.test.ts
                        history-search.test.ts
                        hook-selector-slider.test.ts
                        late-diagnostics-message.test.ts
                        logout-account-selector.test.ts
                        oauth-selector.test.ts
                        plan-review-overlay.test.ts
                        plan-toc.test.ts
                        plugin-list-marketplace.test.ts
                        segment-track.test.ts
                        session-selector-scope.test.ts
                        session-selector-scrollbar.test.ts
                        session-selector-status.test.ts
                        session-selector-viewport.test.ts
                        settings-layout.test.ts
                        settings-selector-memory-refresh.test.ts
                        tool-execution-background-task.test.ts
                        transcript-container.test.ts
                        tree-selector-chain-gutter-2298.test.ts
                        tree-selector-developer.test.ts
                        tree-selector-empty-state-1909.test.ts
                        tree-selector-last-branch-gutter-2325.test.ts
                        tree-selector-overflow.test.ts
                        user-message-keywords.test.ts
                        user-message-selector.test.ts
                    controllers/
                        bash-command.test.ts
                        btw-controller.test.ts
                        command-controller-hotkeys.test.ts
                        event-controller-abort-guard.test.ts
                        event-controller-args-reveal.test.ts
                        event-controller-idle-compaction.test.ts
                        event-controller-interrupt.test.ts
                        event-controller-loader-recovery.test.ts
                        event-controller-message-start.test.ts
                        event-controller-read-grouping.test.ts
                        event-controller-superseded-agent-end.test.ts
                        event-controller-toolcall-finalize.test.ts
                        handoff-command.test.ts
                        input-controller-tool-expansion.test.ts
                        mcp-authorization-link.test.ts
                        omfg-controller.test.ts
                        omfg-rule.test.ts
                        selector-controller-logout.test.ts
                        selector-controller-session-delete.test.ts
                        session-selector-delete.test.ts
                        tan-command-controller.test.ts
                    theme/
                        settings-list-theme.test.ts
                        shimmer.test.ts
                    utils/
                        copy-targets.test.ts
                        render-initial-messages.test.ts
                plan-mode/
                    approved-plan.test.ts
                    plan-handoff.test.ts
                    plan-protection.test.ts
                registry/
                    agent-lifecycle.test.ts
                session/
                    blob-store.test.ts
                    emit-listener-isolation.test.ts
                    redis-session-storage-manager.test.ts
                    redis-session-storage.test.ts
                    session-dump-format.test.ts
                    session-history-format.test.ts
                    session-manager-fork.test.ts
                    session-status.test.ts
                    sql-session-storage-manager.test.ts
                    sql-session-storage.test.ts
                    yield-queue.test.ts
                session-manager/
                    build-context.test.ts
                    continue-relocation.test.ts
                    draft.test.ts
                    file-operations.test.ts
                    helpers.ts
                    labels.test.ts
                    migration.test.ts
                    move-to.test.ts
                    rewrite-rename-eperm.test.ts
                    save-entry.test.ts
                    session-id.test.ts
                    signature-persistence.test.ts
                    title-source-persistence.test.ts
                    tree-traversal.test.ts
                    usage-statistics.test.ts
                slash-commands/
                    btw.test.ts
                    debug.test.ts
                    force.test.ts
                    fresh.test.ts
                    issue-943-type-repro.ts
                    login.test.ts
                    omfg.test.ts
                    plan-history.test.ts
                    retry.test.ts
                    session.test.ts
                    setup.test.ts
                    shake.test.ts
                    switch.test.ts
                    tan.test.ts
                ssh/
                    connection-manager.test.ts
                    ssh-executor.test.ts
                task/
                    autoload-skills.test.ts
                    commands.test.ts
                    create-memo.test.ts
                    discovery.test.ts
                    executor-pass-through.test.ts
                    executor-subagent-reminders.test.ts
                    executor-wall-clock.test.ts
                    executor-warnings.test.ts
                    output-manager.test.ts
                    render-call.test.ts
                    render-nested-live.test.ts
                    render-yield-shape.test.ts
                    role-specialization.test.ts
                    spawn-advisory.test.ts
                    subagent-lsp.test.ts
                    task-batch.test.ts
                    task-guards.test.ts
                    task-progress-render.test.ts
                    task-prompt-role.test.ts
                    task-schema.test.ts
                    task-spawn.test.ts
                    worktree.test.ts
                tool-discovery/
                    initial-tools.test.ts
                    persistence.test.ts
                    subagent.test.ts
                    tool-index.test.ts
                tools/
                    apply-patch-renderer.test.ts
                    approval-mode.test.ts
                    approval.test.ts
                    ask.test.ts
                    ast-edit.test.ts
                    ast-grep.test.ts
                    auto-generated-guard.test.ts
                    bash-command-fixup.test.ts
                    bash-interceptor.test.ts
                    bash-pty-selection.test.ts
                    bash-sixel-render.test.ts
                    bash-skill-urls.test.ts
                    browser-attach.test.ts
                    browser-cmux-kind.test.ts
                    browser-cmux-observation.test.ts
                    browser-cmux-socket.test.ts
                    browser-op-tracking.test.ts
                    browser-readable.test.ts
                    browser-stealth-targets.test.ts
                    browser-tab-worker-startup.test.ts
                    conflict-detect.test.ts
                    conflict-integration.test.ts
                    edit-diff.test.ts
                    edit-renderer.test.ts
                    eval-agent-progress.test.ts
                    eval-code-preview.test.ts
                    eval-description.test.ts
                    eval-display-text.test.ts
                    eval-fallback.test.ts
                    eval-timeout.test.ts
                    fetch-binary-dispatch.test.ts
                    fetch-jina-stall.test.ts
                    fetch-kagi-toggle.test.ts
                    fetch-raw-mode.test.ts
                    fetch-url-selectors.test.ts
                    find-renderer.test.ts
                    find-validate-paths.test.ts
                    gh-cache-invalidation.test.ts
                    gh.test.ts
                    github-cache.test.ts
                    grouped-file-output.test.ts
                    image-gen.test.ts
                    index.test.ts
                    inspect-image.test.ts
                    irc-renderer.test.ts
                    irc-roster-activity.test.ts
                    irc.test.ts
                    jtd-to-json-schema.test.ts
                    lsp-batching.test.ts
                    lsp-diagnostics-dedup.test.ts
                    lsp-diagnostics-freshness.test.ts
                    lsp-regressions.test.ts
                    memory-renderer.test.ts
                    multi-path-missing.test.ts
                    multi-search-path.test.ts
                    output-caps.test.ts
                    output-schema-validator.test.ts
                    path-utils-dotdot-selector.test.ts
                    plan-mode-guard-local.test.ts
                    provider-schema-compatibility.test.ts
                    read-directory-range.test.ts
                    read-fs-not-abortable.test.ts
                    read-pdf-line-range.test.ts
                    read-renderer.test.ts
                    render-utils.test.ts
                    report-tool-issue-consent.test.ts
                    report-tool-issue.test.ts
                    resolve.test.ts
                    review.test.ts
                    root-path-alias.test.ts
                    schema-validation.test.ts
                    search-internal-urls.test.ts
                    search-invalid-regex.test.ts
                    search-path-lists.test.ts
                    search-renderer.test.ts
                    search-tool-bm25.test.ts
                    split-internal-url-sel.test.ts
                    sqlite.test.ts
                    ssh-description.test.ts
                    ssh-render.test.ts
                    strip-output-notice.test.ts
                    task-agent-capabilities.test.ts
                    task-async-fallback.test.ts
                    task-repair-args.test.ts
                    todo.test.ts
                    tool-output-hyperlinks.test.ts
                    web-search-codex.test.ts
                    web-search-exa.test.ts
                    web-search-gemini.test.ts
                    web-search-kagi.test.ts
                    web-search-parallel.test.ts
                    web-search-searxng.test.ts
                    web-search-tavily.test.ts
                    yield-extraction.test.ts
                    yield.test.ts
                    web-scrapers/
                        academic.test.ts
                        business.test.ts
                        dev-platforms.test.ts
                        documentation.test.ts
                        finance-media.test.ts
                        git-hosting.test.ts
                        media.test.ts
                        package-managers-2.test.ts
                        package-managers.test.ts
                        package-registries.test.ts
                        research.test.ts
                        security.test.ts
                        social-extended.test.ts
                        social.test.ts
                        stackexchange.test.ts
                        standards.test.ts
                        wikipedia.test.ts
                        youtube-parallel.test.ts
                        youtube.test.ts
                tui/
                    hyperlink.test.ts
                    status-line-newline-guard.test.ts
                utils/
                    clipboard.test.ts
                    enhanced-paste.test.ts
                    filter-user-extensions.ts
                    git-clone.test.ts
                    image-resize.test.ts
                    jj.test.ts
                    open.test.ts
                web/
                    search/
                        abort-and-timeout.test.ts
                        anthropic.test.ts
                        codex-broker.test.ts
                        perplexity.test.ts
                        render.test.ts
                        tavily.test.ts
        collab-web/
            CHANGELOG.md
            index.html
            package.json
            README.md
            tsconfig.json
            tsconfig.publish.json
            public/
                favicon.ico
                manifest.webmanifest
                robots.txt
                sitemap.xml
            scripts/
                build-tool-views.ts
                fixture.ts
                local-relay.ts
                mock-host.ts
            src/
                app.tsx
                env.d.ts
                main.tsx
                components/
                    agents/
                        AgentDrawer.tsx
                        agents.css
                        AgentsPanel.tsx
                    shell/
                        Banners.tsx
                        Composer.tsx
                        ConnectScreen.tsx
                        HeaderBar.tsx
                        shell.css
                        Toasts.tsx
                    transcript/
                        Markdown.tsx
                        ToolCard.tsx
                        transcript.css
                        Transcript.tsx
                lib/
                    client.ts
                    codec.ts
                    format.ts
                    jsonl.ts
                    link.ts
                    socket.ts
                    use-guest.ts
                styles/
                    base.css
                    tokens.css
                tool-render/
                    element.tsx
                    generic.tsx
                    index.ts
                    parts.tsx
                    registry.ts
                    standalone.tsx
                    tool-render.css
                    ToolView.tsx
                    types.ts
                    util.ts
                    tools/
                        ask.tsx
                        ast-edit.tsx
                        ast-grep.tsx
                        bash.tsx
                        browser.tsx
                        debug.tsx
                        edit.tsx
                        eval.tsx
                        fetch.tsx
                        find.tsx
                        generate-image.tsx
                        github.tsx
                        goal.tsx
                        inspect-image.tsx
                        irc.tsx
                        job.tsx
                        lsp.tsx
                        memory-recall.tsx
                        memory-reflect.tsx
                        memory-retain.tsx
                        read.tsx
                        render-mermaid.tsx
                        report-finding.tsx
                        report-tool-issue.tsx
                        resolve.tsx
                        search-bm25.tsx
                        search.tsx
                        ssh.tsx
                        task.tsx
                        todo.tsx
                        web-search.tsx
                        write.tsx
                        yield.tsx
            test/
                client.test.ts
                codec.test.ts
                link.test.ts
                local-relay.test.ts
        hashline/
            CHANGELOG.md
            package.json
            README.md
            tsconfig.json
            tsconfig.publish.json
            bench/
                recovery-session-chain.ts
            src/
                apply.ts
                block.ts
                diff-preview.ts
                format.ts
                fs.ts
                grammar.lark
                index.ts
                input.ts
                messages.ts
                mismatch.ts
                normalize.ts
                parser.ts
                patcher.ts
                prefixes.ts
                prompt.md
                recovery.ts
                snapshots.ts
                stream.ts
                tokenizer.ts
                types.ts
            test/
                block.test.ts
                boundary-repair.test.ts
                core-contracts.test.ts
                diff-preview.test.ts
                format-v2.test.ts
                landing-shift.test.ts
                leniency.test.ts
                patcher.test.ts
                recovery-session-chain.test.ts
                snapshots.test.ts
        mnemopi/
            CHANGELOG.md
            package.json
            README.md
            tsconfig.json
            tsconfig.publish.json
            src/
                cli.ts
                config.ts
                db.ts
                diagnose.ts
                index.ts
                mcp-server.ts
                mcp-tools.ts
                types.ts
                core/
                    aaak.ts
                    annotations.ts
                    banks.ts
                    binary-vectors.ts
                    chat-normalize.ts
                    content-sanitizer.ts
                    cost-log.ts
                    embeddings.ts
                    entities.ts
                    episodic-graph.ts
                    extraction.ts
                    fastembed-runtime.ts
                    index.ts
                    llm-backends.ts
                    local-llm.ts
                    memory.ts
                    mmr.ts
                    orchestrator.ts
                    patterns.ts
                    plugins.ts
                    polyphonic-recall.ts
                    query-cache.ts
                    query-intent.ts
                    recall-diagnostics.ts
                    runtime-options.ts
                    shmr.ts
                    streaming.ts
                    synonyms.ts
                    temporal-parser.ts
                    token-counter.ts
                    triples.ts
                    typed-memory.ts
                    vector-index.ts
                    vector-math.ts
                    veracity-consolidation.ts
                    weibull.ts
                    beam/
                        consolidate.ts
                        helpers.ts
                        index.ts
                        recall.ts
                        schema.ts
                        store.ts
                        types.ts
                    extraction/
                        client.ts
                        diagnostics.ts
                        prompts.ts
                    migrations/
                        e6-triplestore-split.ts
                        index.ts
                dr/
                    index.ts
                    recovery.ts
                migrations/
                    e6-triplestore-split.ts
                    index.ts
                util/
                    datetime.ts
                    env.ts
                    ids.ts
                    lru.ts
                    regex.ts
            test/
                ab-toggles.test.ts
                annotations.test.ts
                beam-consolidate-unit.test.ts
                beam-e3-e4-e6.test.ts
                beam-helpers.test.ts
                beam-index.test.ts
                beam-parity.test.ts
                beam-recall-unit.test.ts
                beam-store.test.ts
                binary-vectors.test.ts
                c25-deltasync-allowlist.test.ts
                cli-errors-parity.test.ts
                cli-stats-parity.test.ts
                cli.test.ts
                configurable-scoring.test.ts
                consolidate-fact-concurrency.test.ts
                consolidate-fact-id-collision.test.ts
                consolidate-fact-sibling-races.test.ts
                content-sanitizer.test.ts
                degrade-vector.test.ts
                diagnose.test.ts
                e5a-vector-voice-dense-rewire.test.ts
                embedding-failure-logging.test.ts
                embedding-model-reconcile.test.ts
                embeddings-multilingual.test.ts
                entities.test.ts
                extraction-integration.test.ts
                extraction-wiring.test.ts
                extraction.test.ts
                fastembed-runtime.test.ts
                foundation.test.ts
                graph-tools.test.ts
                identity-memory-parity.test.ts
                issue-1832-embedding-population.test.ts
                llm-backends.test.ts
                local-llm.test.ts
                mcp-server.test.ts
                memory-banks.test.ts
                memory-facade.test.ts
                migrate-triplestore-split.test.ts
                optional-embeddings.test.ts
                orchestrator.test.ts
                orphan-vec-episodes-cleanup.test.ts
                patterns.test.ts
                plugins.test.ts
                polyphonic-recall.test.ts
                pre-experiment-fidelity.test.ts
                proactive-linking.test.ts
                provider-all-15-tools-parity.test.ts
                provider-all-15-tools.test.ts
                query-cache-synonyms.test.ts
                recall-diagnostics.test.ts
                recall-feature-flags.test.ts
                recall-precision-regressions.test.ts
                recovery.test.ts
                setup.ts
                shmr.test.ts
                streaming.test.ts
                telemetry-env-followups.test.ts
                temporal-parser.test.ts
                temporal-recall.test.ts
                text-utilities.test.ts
                triples-data-dir.test.ts
                typed-memory-aaak.test.ts
                vector-index.test.ts
                veracity-consolidation.test.ts
                weibull-mmr-intent.test.ts
        natives/
            CHANGELOG.md
            package.json
            README.md
            tsconfig.json
            tsconfig.publish.json
            bench/
                grep.ts
            native/
                embedded-addon.js
                index.d.ts
                index.js
                loader-state.d.ts
                loader-state.js
            scripts/
                build-native.ts
                embed-native.ts
                gen-enums.ts
                gen-npm-packages.ts
            test/
                issue-823-repro.test.ts
                issue-892-repro.test.ts
                native.test.ts
                npm-packages.test.ts
                windows-staging.test.ts
        snapcompact/
            .gitignore
            CHANGELOG.md
            package.json
            README.md
            tsconfig.json
            tsconfig.publish.json
            research/
                anthropic_api.py
                bdf.py
                bench_gemini.py
                bench_kimi.py
                bench_kimi_probe.py
                diag_glm_forensics.py
                diag_glm_mono.py
                diag_glm_probe.py
                diag_kimi_chunked.py
                diag_kimi_forensics.py
                diag_kimi_mono.py
                diag_kimi_probe.py
                exp01_patchalign.py
                exp02_surprisal.py
                exp03_numhard.py
                exp04_layout.py
                exp05_anchors.py
                exp06_rolecolor.py
                exp07_readtax.py
                exp08_foveate.py
                exp09_cacheappend.py
                exp10_profiles.py
                exp11_memhier.py
                exp12_arbitrage.py
                exp13_extractive.py
                exp14_bestgpt.py
                exp15_bestgemini.py
                exp16_bestfable.py
                exp17_bestopus.py
                exp18_bestkimi.py
                exp19_bestglm.py
                exp20_8x8u.py
                exp21_braille.py
                exp22_ttf6pt.py
                final.py
                mono.py
                mono_prod.py
                parity_check.py
                parity_render.ts
                providers.py
                render_pages.ts
                run.py
                snapcompact_3d_activation_html.py
                snapcompact_3d_activation_viz.py
                snapcompact_activation_probe.py
                snapcompact_blackbox_occlusion.py
                snapcompact_blog_viz.py
                snapcompact_carrier_convergence.py
                snapcompact_convergence_3d.py
                snapcompact_convergence_extras.py
                snapcompact_convergence_viz.py
                snapcompact_lockon_anatomy_viz.py
                snapcompact_logit_lens_dump.py
                snapcompact_logit_lens_viz.py
                snapcompact_materialize_sweep.py
                snapcompact_materialize_viz.py
                snapcompact_pricing_viz.py
                snapcompact_qwen_control_intervention.py
                snapcompact_qwen_spotlight_viz.py
                snapcompact_r2_chord.py
                snapcompact_r2_crystal.py
                snapcompact_r2_filmstrip.py
                snapcompact_r2_hero.py
                snapcompact_r2_metro.py
                snapcompact_tensor_heatmap.py
                snapcompact_text_image_3d_viz.py
                snapcompact_text_image_compare.py
                snapcompact_token_entry_dump.py
                snapcompact_token_entry_viz.py
                snapcompact_viz_atlas.py
                snapcompact_viz_circuit.py
                snapcompact_viz_city.py
                snapcompact_viz_explainer.py
                snapcompact_viz_glass_stack.py
                snapcompact_viz_glyph_matrix.py
                snapcompact_viz_radial.py
                snapcompact_viz_token_grid.py
                snapcompact_viz_volume.py
                snapcompact_viz_waterfall.py
                squad.py
                prompts/
                    exp02-qa-image.md
                    exp04-qa-image.md
                    exp05-qa-image-ctl.md
                    exp05-qa-image.md
                    exp06-prov-image.md
                    exp06-qa-image-tag.md
                    exp06-qa-image.md
                    exp07-answer-bands.md
                    exp07-locate.md
                    exp07-qa-image.md
                    exp08-archive-eager.md
                    exp08-archive-phrase.md
                    exp08-archive.md
                    exp08-zoom.md
                    exp09-frame.md
                    exp09-page.md
                    exp09-qa.md
                    exp11-qa-hier.md
                    exp13-extract.md
                    exp19-qa-doc.md
                    exp21-qa-braille.md
                    qa-image-cols.md
                    qa-image-multi.md
                    qa-image.md
                    qa-remote-compact.md
                    qa-text.md
                    session-frame.md
            src/
                index.ts
                snapcompact.ts
                prompts/
                    file-operations.md
                    snapcompact-summary.md
            test/
                snapcompact.test.ts
        stats/
            build.ts
            CHANGELOG.md
            package.json
            README.md
            tailwind.config.js
            tsconfig.client.json
            tsconfig.json
            tsconfig.publish.client.json
            tsconfig.publish.json
            scripts/
                generate-client-bundle.ts
            src/
                aggregator.ts
                db.ts
                embedded-client.generated.txt
                embedded-client.ts
                index.ts
                parser.ts
                server.ts
                shared-types.ts
                sync-worker.ts
                types.ts
                user-metrics.ts
                client/
                    api.ts
                    App.tsx
                    css.d.ts
                    index.tsx
                    styles.css
                    types.ts
                    useSystemTheme.ts
                    components/
                        BehaviorChart.tsx
                        BehaviorModelsTable.tsx
                        BehaviorSummary.tsx
                        chart-shared.tsx
                        ChartsContainer.tsx
                        CostChart.tsx
                        CostSummary.tsx
                        Header.tsx
                        models-table-shared.tsx
                        ModelsTable.tsx
                        range-meta.ts
                        RequestDetail.tsx
                        RequestList.tsx
                        StatsGrid.tsx
            test/
                behavior-backfill.test.ts
                db-cost.test.ts
                db-range.test.ts
                priority-premium-requests.test.ts
                user-metrics.test.ts
        swarm-extension/
            .gitignore
            CHANGELOG.md
            package.json
            README.md
            tsconfig.json
            src/
                cli.ts
                extension.ts
                swarm/
                    dag.ts
                    executor.ts
                    pipeline.ts
                    render.ts
                    schema.ts
                    state.ts
                    __tests__/
                        executor.test.ts
        tui/
            CHANGELOG.md
            package.json
            README.md
            tsconfig.json
            tsconfig.publish.json
            bench/
                kitty-sequence.ts
                parse-key.ts
                sanitize.ts
                text-layout.ts
                _jskey.ts
            src/
                autocomplete.ts
                bracketed-paste.ts
                deccara.ts
                editor-component.ts
                fuzzy.ts
                index.ts
                keybindings.ts
                keys.ts
                kill-ring.ts
                kitty-graphics.ts
                loop-watchdog.ts
                mouse.ts
                stdin-buffer.ts
                symbols.ts
                terminal-capabilities.ts
                terminal.ts
                ttyid.ts
                tui.ts
                utils.ts
                components/
                    box.ts
                    cancellable-loader.ts
                    editor.ts
                    image.ts
                    input.ts
                    loader.ts
                    markdown.ts
                    scroll-view.ts
                    select-list.ts
                    settings-list.ts
                    spacer.ts
                    tab-bar.ts
                    text.ts
                    truncated-text.ts
            test/
                abort-collapse-gap.test.ts
                autocomplete.test.ts
                chat-simple.ts
                component-render.test.ts
                container-dispose.test.ts
                container-memo.test.ts
                deccara.test.ts
                editor-autocomplete-actions.test.ts
                editor.test.ts
                emergency-restore-altscreen.test.ts
                focus-menu-regression.test.ts
                fuzzy.test.ts
                image-budget.test.ts
                image-render.test.ts
                image-test.ts
                input.test.ts
                issue-1765-repro.test.ts
                issue-1962-repro.test.ts
                issue-1974-repro.test.ts
                issue-2034-repro.test.ts
                issue-2045-repro.test.ts
                issue-2088-repro.test.ts
                issue-2095-repro.test.ts
                issue-2130-repro.test.ts
                issue-848-repro.test.ts
                issue-879-repro.test.ts
                key-tester.ts
                keybindings.test.ts
                keys.test.ts
                kitty-graphics.test.ts
                kitty-keyboard-da1-ordering.test.ts
                loader.test.ts
                loop-watchdog-wiring.test.ts
                loop-watchdog.test.ts
                markdown-incremental-lex.test.ts
                markdown.test.ts
                mouse.test.ts
                notifications.test.ts
                overlay-scroll.test.ts
                process-terminal-render-harness.ts
                process-terminal-render.test.ts
                render-regressions.test.ts
                render-stable-prefix.test.ts
                render-stress-harness.ts
                render-stress-oracles.test.ts
                render-stress-reducer.test.ts
                render-stress-reducer.ts
                render-stress-scheduler.ts
                render-stress-subprocess.ts
                render-stress.test.ts
                resize-viewport-defer.test.ts
                scroll-view.test.ts
                select-filter-breadcrumb.test.ts
                select-list.test.ts
                settings-list.test.ts
                sixel-probe.test.ts
                slash-autocomplete-viewport.test.ts
                start-listener.test.ts
                stdin-buffer.test.ts
                streaming-scrollback-defer.test.ts
                tab-bar.test.ts
                terminal-appearance.test.ts
                terminal-capabilities.test.ts
                test-themes.ts
                text-utils.test.ts
                text.test.ts
                truncate-to-width.test.ts
                truncated-text.test.ts
                ttyid.test.ts
                virtual-terminal.ts
                visible-width.test.ts
                wrap-ansi.test.ts
        typescript-edit-benchmark/
            all_models_results.json
            fixtures.tar.gz
            package.json
            tsconfig.json
            tsconfig.publish.json
            src/
                bun-imports.d.ts
                formatter.ts
                generate.ts
                in-process-client.ts
                index.ts
                mutations.ts
                report.ts
                runner.ts
                shared.ts
                tasks.ts
                verify.ts
                prompts/
                    benchmark-retry.md
                    benchmark-system.md
                    benchmark-task.md
            test/
                runner.test.ts
                verify.test.ts
        utils/
            CHANGELOG.md
            package.json
            README.md
            tsconfig.json
            tsconfig.publish.json
            src/
                abortable.ts
                async.ts
                cli.ts
                color.ts
                dirs.ts
                env.ts
                fetch-retry.ts
                format.ts
                frontmatter.ts
                fs-error.ts
                glob.ts
                index.ts
                json.ts
                logger.ts
                loop-phase.ts
                mermaid-ascii.ts
                mime.ts
                module-timer.ts
                path-tree.ts
                peek-file.ts
                postmortem.ts
                procmgr.ts
                prompt.ts
                ptree.ts
                ring.ts
                runtime-install.ts
                sanitize-text.ts
                snowflake.ts
                stream.ts
                tab-spacing.ts
                temp.ts
                timing-buffer.ts
                type-guards.ts
                which.ts
                worker-host.ts
            test/
                cli-help.test.ts
                color.test.ts
                dirs-python-gateway.test.ts
                env.test.ts
                fetch-retry.test.ts
                format.test.ts
                install-id.test.ts
                issue-935-repro.test.ts
                logger-error-serialization.test.ts
                logger-startup.test.ts
                loop-phase.test.ts
                mermaid-ascii.test.ts
                path-tree.test.ts
                peek-file.test.ts
                profiles.test.ts
                prompt.test.ts
                ring.test.ts
                runtime-install.test.ts
                sanitize-text.test.ts
                snowflake.test.ts
                spacing.test.ts
                stream.test.ts
        wire/
            CHANGELOG.md
            package.json
            README.md
            tsconfig.json
            tsconfig.publish.json
            src/
                index.ts
            test/
                constants.test.ts
    patches/
        beautiful-mermaid@1.1.3.patch
    python/
        omp-rpc/
            pyproject.toml
            README.md
            src/
                omp_rpc/
                    client.py
                    host_tools.py
                    host_uris.py
                    protocol.py
                    py.typed
                    __init__.py
            tests/
                test_client.py
                test_host_uris.py
                test_protocol.py
                test_user_group.py
                __init__.py
        robomp/
            .env.example
            .gitignore
            AGENTS.md
            docker-compose.yml
            entrypoint.sh
            pyproject.toml
            README.md
            assets/
            docs/
                pr-review-handoff.md
            scripts/
                ping.sh
            src/
                autoclose.py
                cancellation.py
                cli.py
                config.py
                dashboard.py
                db.py
                github_backend.py
                github_client.py
                github_events.py
                git_ops.py
                host_tools.py
                logging_config.py
                manual_triage.py
                natives_cache.py
                persona.py
                pragmas.py
                proxy_client.py
                proxy_hmac.py
                py.typed
                queue.py
                sandbox.py
                server.py
                slot_pool.py
                tasks.py
                worker.py
                __init__.py
                __main__.py
                prompts/
                    completion_reminder.md
                    directive.md
                    dirty_state_reminder.md
                    finalized_issue_comment.md
                    finalized_pr_comment.md
                    followup_comment.md
                    followup_review.md
                    host_tools.toml
                    kickoff_directive.md
                    kickoff_issue.md
                    kickoff_pr_review.md
                    question_autoclose_suffix.md
                    resume_triage.md
                    review_completion_reminder.md
                    system_append.md
                    system_append_pr_review.md
                    todo_phases.toml
                    unable_to_reproduce_comment.md
                proxy/
                    server.py
                    __init__.py
                    __main__.py
            tests/
                conftest.py
                test_autoclose.py
                test_config.py
                test_db.py
                test_github_client.py
                test_github_events.py
                test_host_tools.py
                test_natives_cache.py
                test_permissions_e2e.py
                test_persona.py
                test_pragmas.py
                test_proxy_client.py
                test_proxy_server.py
                test_queue_cancel.py
                test_queue_shutdown.py
                test_retry.py
                test_sandbox.py
                test_server.py
                test_slot_pool.py
                test_tasks_directive.py
                test_worker.py
                test_worker_pragmas.py
                test_worker_smoke.py
                __init__.py
            web/
                index.html
                package.json
                tsconfig.json
                vite.config.ts
                src/
                    api.ts
                    App.tsx
                    config.ts
                    env.d.ts
                    format.ts
                    main.tsx
                    state.ts
                    types.ts
                    components/
                        Browse.tsx
                        Events.tsx
                        GlassCard.tsx
                        Header.tsx
                        IssueLink.tsx
                        Issues.tsx
                        Logs.tsx
                        Pill.tsx
                        Stats.tsx
                        Trigger.tsx
                        Working.tsx
                    styles/
                        index.css
    scripts/
        analyze_small_edits.py
        check-spoofed-versions.ts
        ci-build-native.ts
        ci-concurrency.test.ts
        ci-macos-sign.sh
        ci-macos-upload-secrets.sh
        ci-release-build-binaries.ts
        ci-release-notes.test.ts
        ci-release-notes.ts
        ci-release-publish.ts
        ci-test-ts.ts
        ci-update-brew-formula.test.ts
        ci-update-brew-formula.ts
        claude-trace.ts
        edit-benchmark.py
        edit_benchmark_common.py
        eval-bench-runs.ts
        fix-changelogs.test.ts
        fix-changelogs.ts
        fix-test-imports.ts
        host-detect.ts
        install.ps1
        install.sh
        macos-entitlements.plist
        rate-edit-tool.py
        release.ts
        rewrite-system-prompt.style.md
        rewrite-system-prompt.test.ts
        rewrite-system-prompt.ts
        run-rs-task.ts
        setup-npm-trust.ts
        sync-themes.ts
        sync-versions.ts
        tool-prompt-usage.ts
        tool_io.py
        trace-loader.ts
        __init__.py
        install-tests/
            binary.dockerfile
            run-ci.sh
            run-podman.sh
            source.dockerfile
            tarball.dockerfile
        session-stats/
            analyze.py
            analyze_search_relevance.py
            analyze_selector_reads.py
            audit-prompt.md
            audit.test.ts
            audit.ts
            harmony_backtest.py
            optimize_read_config.py
            plot_read_summarizer.py
            plot_tools.py
            README.md
            read_optimizer.py
            sync.py
            out/
    types/
        assets/
            index.d.ts
```

## Core Logic Samples

### `AGENTS.md`
```
# Development Rules

## Default Context

This repo contains multiple packages, but **`packages/coding-agent/`** is the primary focus. Unless otherwise specified, assume work refers to this package.

**Terminology**: When the user says "agent" or asks "why is agent doing X", they mean the **coding-agent package implementation**, not you (the assistant). The coding-agent is a CLI tool — questions about its behavior refer to code in `packages/coding-agent/`, not your current session.

### Package Structure

| Package                 | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| `packages/ai`           | Multi-provider LLM client with streaming support     |
| `packages/catalog`      | Model catalog: bundled models.json, provider descriptors, model identity/classification |
| `packages/agent`        | Agent runtime with tool calling and state management |
| `packages/coding-agent` | Main CLI application (primary focus)                 |
| `packages/tui`          | Terminal UI library with differential rendering      |
| `packages/natives`      | Bindings for native text/image/grep operations       |
| `packages/stats`        | Local observability dashboard (`omp stats`)          |
| `packages/utils`        | Shared utilities (logger, streams, temp files)       |
| `crates/pi-natives`     | Rust crate for performance-critical text/grep ops    |

**Catalog import convention**: code in this repo imports catalog *values* (bundled models, model-thinking helpers, identity, descriptors, model manager/cache) from `@oh-my-pi/pi-catalog/<module>` — never via `@oh-my-pi/pi-ai`. The pi-ai barrel re-exports only the model/effort *types* its own signatures use (`Model`, `Api`, `ThinkingConfig`, `Effort`, …); type-only imports of those from `@oh-my-pi/pi-ai` are fine.

## Code Quality

- No `any` unless absolutely necessary.
- **NEVER use `ReturnType<>`** — use the actual type name.
- **NEVER use inline imports** — no `await import()`, no `import("pkg").Type` in type positions, no dynamic type imports. Always top-level.
- Check `node_modules` for external API types instead of guessing.
- **Barrel exports**: prefer `export * from "./module"` over named re-exports, including `export type { ... } from`. In pure `index.ts` barrels, use star re-exports even for single-specifier cases. If stars create ambiguity, remove the redundant export path; do not keep duplicates.
- **Class privacy**: use ES `#private` fields; leave externally accessible members bare. **No `private`/`protected`/`public` keyword on fields or methods**, except on **constructor parameter properties** where TypeScript requires it (e.g. `constructor(private readonly session: ToolSession)`).
- **Promises**: use `Promise.withResolvers()` instead of `new Promise((resolve, reject) => ...)`.
- **Prompts**: never build prompts in code (no inline strings, template literals, or concatenation). Prompts live in static `.md` files; use Handlebars for dynamic content. Import them via `import content from "./prompt.md" with { type: "text" }` — not `readFile`.
- **Worker scripts**: workers re-enter the CLI entrypoint; never spawn separate worker entry modules. `cli.ts` declares itself as the worker host at startup (`declareWorkerHostEntry()` from `@oh-my-pi/pi-utils/env`) and dispatches hidden argv selectors (`__omp_stats_sync_worker`, `__omp_tab_worker`, `__omp_js_eval_worker`, `--tiny-worker`) before loading the command registry. Spawn sites use:
  ```ts
  import { workerHostEntry } from "@oh-my-pi/pi-utils";
  const hostEntry = workerHostEntry();
  const worker = hostEntry
  	? new Worker(hostEntry, { type: "module", argv: ["__omp_<name>_worker"] })
  	: new Worker(new URL("./<worker>.ts", import.meta.url).href, { type: "module" });
  ```
  When the process was started from the omp CLI — source `cli.ts`, npm-bundle `dist/cli.js`, or compiled binary — `workerHostEntry()` is `Bun.main` and the worker re-enters the single entry module, so no per-worker `--compile` entrypoints or bundle entries exist. Outside a CLI host (`bun test`, SDK embedding, standalone `omp-stats`) it returns `null` and the direct-module fallback loads the worker source. New worker kinds MUST add their selector to the dispatch table in `cli.ts` and keep the fallback branch.
  History: `with { type: "file" }` only copied the entry as a raw asset (workers crashed silently in compiled binaries — issues #1011, #1027), and the later literal-path + extra-entrypoint pattern required keeping spawn literals and two build scripts in sync (issue #1150). The repro tests for those issues now pin the worker-host contract instead.
  Validate any new worker with the dedicated smoke probe: `omp --smoke-test` spawns the stats sync worker and the tiny-model subprocess, pings them, and exits — it's wired into `ci:test:smoke` and `scripts/install-tests/run-ci.sh` so binary, source-link, and tarball installs all exercise it. Add a sibling smoke if the new worker is on a different module graph.

## Bun Over Node

Use Bun APIs where they provide a cleaner alternative; fall back to `node:*` only for what Bun doesn't cover. **Never spawn shell commands for operations with proper APIs** (e.g., don't `Bun.spawnSync(["mkdir", "-p", dir])` — use `mkdirSync`).

### Quick reference

| Operation       | Use                                       | Not                             |
| --------------- | ----------------------------------------- | ------------------------------- |
| File read/write | `Bun.file()`, `Bun.write()`               | `readFileSync`, `writeFileSync` |
| Spawn process   | `` $`cmd` ``, `Bun.spawn()`               | `child_process`                 |
| Sleep           | `Bun.sleep(ms)`                           | `setTimeout` promise            |
| Binary lookup   | `$which("git")` from `@oh-my-pi/pi-utils` | `spawnSync(["which", "git"])`   |
| HTTP server     | `Bun.serve()`                             | `http.createServer()`           |
| SQLite          | `bun:sqlite`                              | `better-sqlite3`                |
| Hashing         | `Bun.hash()`, `Bun.password.*`, WebCrypto | `node:crypto`                   |
| Path resolution | `import.meta.dir`, `import.meta.path`     | `fileURLToPath` dance           |
| JSON5           | `Bun.JSON5.parse()` / `.stringify()`      | `json5` package                 |
| JSONL           | `Bun.JSONL.parse()` / `.parseChunk()`     | `text.split("\n").map(JSON.parse)` |
| String width    | `Bun.stringWidth()`                       | `get-east-asian-width`, custom  |
| Text wrapping   | `Bun.wrapAnsi()`                          | custom ANSI-aware wrappers      |

### Process execution

Prefer Bun Shell (`` $`cmd` ``) for simple commands:

```typescript
import { $ } from "bun";

const result = await $`git status`.cwd(dir).quiet().nothrow();
if (result.exitCode === 0) {
	const text = result.text();
}

$`do-stuff ${tmpFile}`.quiet().nothrow(); // fire and forget
```

Methods: `.quiet()`, `.nothrow()`, `.text()`, `.cwd(path)`.

Use `Bun.spawn`/`Bun.spawnSync` only for: long-running processes (LSP, kernels), streaming stdin/stdout/stderr (SSE, JSON-RPC), or process control (signals, kill, complex lifecycle).

When using `pipe` mode, cast the stream:
```typescript
const child = Bun.spawn(["cmd"], { stdout: "pipe", stderr: "pipe" });
const reader = (child.stdout as ReadableStream<Uint8Array>).getReader();
```

### Node module imports

Always use **namespace imports** for `node:fs`, `node:path`, `node:os`:

```typescript
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
```

- Async-only file → `node:fs/promises`.
- Needs both sync and async → `node:fs`, then `fs.promises.xxx` for async.

### File I/O

Prefer Bun:
```typescript
const text = await Bun.file(path).text();
const data = await Bun.file(path).json();
await Bun.write(path, data); // auto-creates parent dirs
```

Use `node:fs/promises` for directory ops (`fs.mkdir`, `fs.rm`, `fs.readdir`) — Bun has no native directory APIs. Avoid sync APIs in async flows; use sync only when forced by a synchronous interface.

**Anti-patterns:**
- `existsSync`/`readFileSync`/`writeFileSync` in async code → `Bun.file()` APIs.
- `mkdir(dirname(path), …)` before `Bun.write(path, …)` → redundant; `Bun.write` handles it.
- `if (await file.exists()) { await file.json() }` → two syscalls plus race. Use try-catch with `isEnoent`:
  ```typescript
  import { isEnoent } from "@oh-my-pi/pi-utils";
  try {
  	return await Bun.file(path).json();
  } catch (err) {
  	if (isEnoent(err)) return null;
  	throw err;
  }
  ```
- Multiple `Bun.file(path)` handles for the same path (including across `checkX`/`loadX` helpers).
- `Buffer.from(await Bun.file(x).arrayBuffer())` → `await fs.readFile(path)`.
- Existence check + try-catch around the same read → drop the existence check.

### Streams

Prefer centralized helpers:
```typescript
import { readStream, readLines } from "./utils/stream";
const text = await readStream(child.stdout);
for await (const line of readLines(stream)) { /* ... */ }
```
Manual reader loops only when the protocol requires it (SSE, streaming JSON-RPC).

### Misc

- **Sleep**: `await Bun.sleep(ms)`, never `new Promise(r => setTimeout(r, ms))`.
- **Password hashing**: `Bun.password.hash(pw, "bcrypt")` / `Bun.password.verify(pw, hash)`.
- **String width**: `Bun.stringWidth(text, { countAnsiEscapeCodes?: false })`.
- **Wrapping**: `Bun.wrapAnsi(text, width, { wordWrap, hard, trim })`.

## Generated Files

**NEVER edit `packages/catalog/src/models.json` directly.** It is generated from upstream sources (models.dev, provider catalog discovery, OpenCode docs) by `packages/catalog/scripts/generate-models.ts` and the descriptors/resolvers in `packages/catalog/src/provider-models/`. Hand-edits get overwritten on the next regen.

To change an entry, fix the source:
- **Resolution rules / per-id overrides** → relevant resolver in `packages/catalog/src/provider-models/openai-compat.ts` (e.g. `createOpenCodeApiResolution`'s id-override map).
- **Provider catalog entries** (default model, discovery factory/flags) → the `CATALOG_PROVIDERS` table in `packages/catalog/src/provider-models/descriptors.ts`.
- **Generator-level fixups** (premium multipliers, codex pricing fallback, fallback models, post-processing) → `packages/catalog/scripts/generate-models.ts`.
- **Thinking metadata / generated policies** → `packages/catalog/src/model-thinking.ts` (`applyGeneratedModelPolicies`); model-id classification (family/version parsing) lives in `packages/catalog/src/identity/classify.ts`.

Regenerate with `bun --cwd=packages/catalog run generate-models` and commit `models.json` alongside the source change. Add a regression test against the **resolver/descriptor**, not the bundled JSON, so it survives upstream metadata shifts.

## Logging

**NEVER use `console.log`/`error`/`warn`** in the coding-agent package — it corrupts TUI rendering. Use the centralized logger:

```typescript
import { logger } from "@oh-my-pi/pi-utils";

logger.error("MCP request failed", { url, method });
logger.warn("Theme file invalid, using fallback", { path });
logger.debug("LSP fallback triggered", { reason });
```

Logs go to `~/.omp/logs/omp.YYYY-MM-DD.log` with automatic rotation.

## TUI Sanitization

All text displayed in tool renderers must be sanitized. Raw content (file contents, error messages, tool output) breaks terminal rendering: tabs → visual holes, long lines → overflow, paths → leak home directory.

**Rules:**
- **Tabs → spaces** via `replaceTabs()` (from `@oh-my-pi/pi-tui` or `../tools/render-utils`).
- **Truncate** lines with `truncateToWidth()` / `ui.truncate()`. Use `TRUNCATE_LENGTHS` constants.
- **Shorten paths** with `shortenPath()` (replaces home with `~`).
- **Preview limits** from `PREVIEW_LIMITS`. No ad-hoc numbers.

**Apply to every render path**, not just the happy one:
- Success output (file previews, command output, search results).
- **Error messages** — these often embed file content (e.g., patch failure messages include unmatched lines). If a message contains file content, it needs `replaceTabs()`.
- Diff content (added and removed).
- Streaming previews.

### Streaming tool previews

Tool-call previews can have **multiple render paths**. If you add preview-only fields or depend on partially streamed args, update every path — not only the final renderer.

For the bash tool specifically:
- The pending preview may need raw `partialJson`, not just parsed `arguments`. Parsed args lag until a JSON object closes, which makes inline env assignments appear only at the end.
- Preserve preview-only fields (e.g. `__partialJson`) through `event-controller.ts`, transcript rebuilds in `ui-helpers.ts`, and merged call/result rendering in `tool-execution.ts`. Missing one path causes inconsistent previews.
- `ToolExecutionComponent.#buildRenderContext()` for bash must work even before a result exists — the renderer uses call args plus render context to show the command preview while streaming.
- Verify both live streaming and rebuilt transcript paths after any bash preview change. A fix in one path does not fix the other.

## Commands

- NEVER commit unless asked.
- Never use `tsc`/`npx tsc` — always `bun check`.

## Testing Guidance

Test the contract the system exposes — not the easiest internal detail to assert.

- Every new test must defend one **concrete, externally observable contract**: behavior, output shape, state transition, error mapping, or a regression-prone parsing boundary. If you cannot name the contract, do not add the test.
- No placeholder tests, tautologies, or "the code ran" assertions (`expect(true).toBe(true)`, bare `not.toThrow()`, non-empty string checks, length-grew checks, "prompt exists" checks without semantic assertion).
- Prefer contract-level tests over implementation details. Avoid asserting internal helper wiring, field assignment, singleton identity, incidental ordering, prompt boilerplate, or passthrough option forwarding unless another component depends on that exact detail.
- Don't duplicate coverage across abstraction levels. If an integration test already proves the behavior, drop the narrower unit test that restates it through mocks.
- Tests **must be full-suite safe**, not just file-local safe. No long-lived file-wide mutations of `Bun.*`, `process.platform`, `process.env`, or `Bun.env` when a narrower seam exists. Prefer per-test `vi.spyOn(...)` with `vi.restoreAllMocks()` in `afterEach`. A test that passes alone but poisons later files is broken.
- **Never use `mock.module()`**. Bun's `mock.module()` mutates the global module registry and leaks across files ([oven-sh/bun#12823](https://github.com/oven-sh/bun/issues/12823)). Use `spyOn` on the imported module object instead. For pass deps, import the pass and spy on `.run`. For package deps, namespace-import and spy on the exported function.
- For lifecycle/stateful code, prefer one test per invariant or transition over several tiny tests asserting one field each from the same transition.
- For error handling, trigger the real failure path and assert the surfaced contract — don't instantiate error classes directly or inspect internal metadata.
- Smoke tests are acceptable only when they catch a failure mode narrower tests would miss. "Package boots" or "command starts" alone is not enough.
- Assert exact strings, ordering, and formatting only when downstream code parses or depends on the exact bytes. Otherwise assert semantic content.
- Compile-time guarantees → type checks/type tests, not runtime placeholders.
- Don't add tests for tiny low-risk changes unless they protect a real contract or fix a regression-prone edge case.
- Prefer focused package-local verification for the changed area.

## Changelog

Location: `packages/*/CHANGELOG.md` (per package).

**Format** — sections under `## [Unreleased]`:
- `### Breaking Changes` (first if present)
- `### Added`
- `### Changed`
- `### Fixed`
- `### Removed`

**Rules:**
- New entries always go under `## [Unreleased]`.
- Never modify already-released sections (e.g., `## [0.12.2]`) — they are immutable.
- Don't flag changelog section order or formatting in reviews or PRs — `bun run release` runs `fix-changelogs` which normalizes everything automatically.

**Attribution:**
- Internal (from issues): `Fixed foo bar ([#123](https://github.com/can1357/oh-my-pi/issues/123))`.
- External contributions: `Added feature X ([#456](https://github.com/can1357/oh-my-pi/pull/456) by [@username](https://github.com/username))`.

## Releasing

1. Ensure all changes since last release are in each affected package's `[Unreleased]` section.
2. Run `bun run release`.

The script handles version bump, CHANGELOG finalization, commit, tag, publish, and adding new `[Unreleased]` sections.
```

### `biome.json`
```
{
	"vcs": {
		"enabled": true,
		"clientKind": "git",
		"useIgnoreFile": true,
		"defaultBranch": "main"
	},
	"linter": {
		"enabled": true,
		"includes": ["**"],
		"rules": {
			"recommended": true,
			"a11y": "off",
			"correctness": {
				"noUnusedImports": "error",
				"noUnusedVariables": {
					"level": "warn",
					"fix": "none"
				},
				"noVoidTypeReturn": "off"
			},
			"style": {
				"noNonNullAssertion": "off",
				"useConst": "error",
				"useNodejsImportProtocol": "off"
			},
			"suspicious": {
				"noExplicitAny": "off",
				"noControlCharactersInRegex": "off",
				"noEmptyInterface": "off",
				"noConstEnum": "off"
			}
		}
	},
	"formatter": {
		"enabled": true,
		"indentStyle": "tab",
		"indentWidth": 3,
		"lineWidth": 120,
		"lineEnding": "lf"
	},
	"javascript": {
		"formatter": {
			"semicolons": "always",
			"quoteStyle": "double",
			"trailingCommas": "all",
			"bracketSpacing": true,
			"arrowParentheses": "asNeeded"
		}
	},
	"files": {
		"includes": [
			"packages/*/src/**/*.ts",
			"packages/*/src/**/*.tsx",
			"packages/*/test/**/*.ts",
			"packages/*/examples/**/*.ts",
			"packages/*/scripts/**/*.ts",
			"packages/*/*.ts",
			"!packages/natives/native/index.d.ts",
			"!**/vendor/**/*",
			"!**/node_modules/**/*",
			"!**/test-sessions.ts",
			"!**/docs-index.generated.ts",
			"!**/agent_pb.ts",
			"!.worktrees/**/*",
			"!.wt/**/*"
		]
	},
	"assist": { "actions": { "source": { "organizeImports": "on" } } }
}
```

### `package.json`
```
{
  "name": "omp-monorepo",
  "homepage": "https://omp.sh",
  "private": true,
  "type": "module",
  "packageManager": "bun@1.3.14",
  "patchedDependencies": {
    "beautiful-mermaid@1.1.3": "patches/beautiful-mermaid@1.1.3.patch"
  },
  "workspaces": {
    "packages": [
      "packages/*",
      "python/robomp/web"
    ],
    "catalog": {
      "@agentclientprotocol/sdk": "0.25.0",
      "@babel/generator": "^7.29.7",
      "@babel/parser": "^7.29.7",
      "@babel/traverse": "^7.29.7",
      "@babel/types": "^7.29.7",
      "@biomejs/biome": "^2.4.16",
      "@bufbuild/protobuf": "^2.12.0",
      "@bufbuild/protoc-gen-es": "^2.12.0",
      "@huggingface/transformers": "^4.2.0",
      "@mozilla/readability": "^0.6.0",
      "@napi-rs/cli": "3.7.0",
      "@oh-my-pi/hashline": "15.13.1",
      "@oh-my-pi/omp-stats": "15.13.1",
      "@oh-my-pi/pi-agent-core": "15.13.1",
      "@oh-my-pi/pi-ai": "15.13.1",
      "@oh-my-pi/pi-catalog": "15.13.1",
      "@oh-my-pi/pi-coding-agent": "15.13.1",
      "@oh-my-pi/pi-mnemopi": "15.13.1",
      "@oh-my-pi/pi-natives": "15.13.1",
      "@oh-my-pi/pi-tui": "15.13.1",
      "@oh-my-pi/pi-utils": "15.13.1",
      "@oh-my-pi/pi-wire": "15.13.1",
      "@oh-my-pi/snapcompact": "15.13.1",
      "@opentelemetry/api": "^1.9.1",
      "@opentelemetry/context-async-hooks": "^2.7.1",
      "@opentelemetry/exporter-trace-otlp-proto": "^0.218.0",
      "@opentelemetry/resources": "^2.7.1",
      "@opentelemetry/sdk-trace-base": "^2.7.1",
      "@opentelemetry/sdk-trace-node": "^2.7.1",
      "@puppeteer/browsers": "^3.0.4",
      "@tailwindcss/node": "^4.3.0",
      "@tailwindcss/vite": "^4.3.0",
      "@types/babel__generator": "^7.27.0",
      "@types/babel__traverse": "^7.28.0",
      "@types/bun": "^1.3.14",
      "@types/react": "^19.2.17",
      "@types/react-dom": "^19.2.3",
      "@types/turndown": "5.0.6",
      "@typescript/native-preview": "7.0.0-dev.20260609.1",
      "@xterm/headless": "^6.0.0",
      "beautiful-mermaid": "^1.1.3",
      "chalk": "^5.6.2",
      "chart.js": "^4.5.1",
      "date-fns": "^4.4.0",
      "diff": "^9.0.0",
      "fflate": "0.8.3",
      "fastembed": "2.1.0",
      "ghostty-web": "^0.4.0",
      "handlebars": "^4.7.9",
      "linkedom": "^0.18.12",
      "lint-staged": "^17.0.7",
      "lru-cache": "11.5.1",
      "lucide-react": "^1.17.0",
      "marked": "^18.0.5",
      "markit-ai": "0.5.3",
      "onnxruntime-node": "1.26.0",
      "partial-json": "^0.1.7",
      "postcss": "^8.5.15",
      "prettier": "^3.8.4",
      "puppeteer-core": "^25.1.0",
      "react": "19.2.7",
      "react-chartjs-2": "^5.3.1",
      "react-dom": "19.2.7",
      "regexp-tree": "^0.1.27",
      "solid-js": "^1.9.13",
      "tailwindcss": "^4.3.0",
      "turndown": "7.2.4",
      "turndown-plugin-gfm": "1.0.2",
      "typescript": "^6.0.3",
      "vite": "^8.0.16",
      "vite-plugin-solid": "^2.11.12",
      "winston": "^3.19.0",
      "winston-daily-rotate-file": "^5.0.0",
      "zod": "^4"
    }
  },
  "overrides": {},
  "scripts": {
    "install:dev": "bun install && bun --cwd=packages/coding-agent link && ln -sfn \"$(pwd)/packages/coding-agent/scripts/omp\" \"$(bun pm -g bin)/omp\"",
    "dev": "bun --cwd=packages/coding-agent src/cli.ts",
    "dev:timing": "PI_TIMING=x bun --cwd=packages/coding-agent --preload ../utils/src/module-timer.ts src/cli.ts",
    "stats": "bun --cwd=packages/coding-agent src/cli.ts stats",
    "collab:web:dev": "bun --cwd=packages/collab-web run dev",
    "collab:relay": "bun --cwd=packages/collab-web run relay",
    "collab:mock-host": "bun --cwd=packages/collab-web run mock-host",
    "collab:web:build": "bun --cwd=packages/collab-web run build",
    "claude:trace": "bun scripts/claude-trace.ts",
    "build": "bun run --workspaces --if-present build",
    "build:native": "bun --cwd=packages/natives run build",
    "test": "bun run --parallel test:ts test:rs",
    "test:ts": "GITHUB_ACTIONS= bun run --workspaces --if-present test -- --only-failures && bun run test:scripts",
    "test:scripts": "bun test scripts/ci-concurrency.test.ts scripts/ci-release-notes.test.ts",
    "test:rs": "bun scripts/run-rs-task.ts test:rs",
    "check": "bun run --parallel check:ts check:rs",
    "check:ts": "bun run check:tools && bun run --workspaces --if-present check",
    "check:tools": "biome check . --no-errors-on-unmatched",
    "check:rs": "bun scripts/run-rs-task.ts check:rs",
    "lint": "bun run --parallel lint:ts lint:rs",
    "lint:ts": "bun run --parallel lint:tools && bun run --workspaces --if-present lint",
    "lint:tools": "biome lint . --no-errors-on-unmatched",
    "lint:rs": "bun scripts/run-rs-task.ts lint:rs",
    "fmt": "bun run --parallel fmt:ts fmt:rs",
    "fmt:ts": "bun run fmt:tools && bun run --workspaces --if-present fmt",
    "fmt:tools": "biome format --write . --no-errors-on-unmatched",
    "fmt:rs": "bun scripts/run-rs-task.ts fmt:rs",
    "fix": "bun run --parallel fix:ts fix:rs fix:changelogs",
    "fix:all": "bun run --parallel fix:ts:all fix:rs fix:changelogs",
    "fix:ts": "bun run fix:tools && bun run --workspaces --if-present fix",
    "fix:ts:all": "bun run fix:tools:all && bun run --workspaces --if-present fix",
    "fix:tools": "biome check --write --unsafe --changed --no-errors-on-unmatched .",
    "fix:tools:all": "biome check --write --unsafe --no-errors-on-unmatched .",
    "fix:changelogs": "bun scripts/fix-changelogs.ts",
    "fix:rs": "bun scripts/run-rs-task.ts fix:rs",
    "ci:check:full": "bun run check:ts",
    "ci:build:native": "bun scripts/ci-build-native.ts",
    "ci:test:full": "bun run ci:test:ts && bun run test:rs",
    "ci:test:ts": "bun scripts/ci-test-ts.ts all",
    "ci:test:ts:workspace": "bun scripts/ci-test-ts.ts workspace",
    "ci:test:ts:native": "bun scripts/ci-test-ts.ts native",
    "ci:test:coding-agent:singleton": "bun scripts/ci-test-ts.ts coding-agent-singleton",
    "ci:test:coding-agent:ui": "bun scripts/ci-test-ts.ts coding-agent-ui",
    "ci:test:coding-agent:runtime": "bun scripts/ci-test-ts.ts coding-agent-runtime",
    "ci:test:coding-agent:native": "bun scripts/ci-test-ts.ts coding-agent-native",
    "ci:test:coding-agent:heavy": "bun scripts/ci-test-ts.ts coding-agent-heavy",
    "ci:test:smoke": "bun packages/coding-agent/src/cli.ts --version && bun packages/coding-agent/src/cli.ts --help && bun packages/coding-agent/src/cli.ts stats --help && bun packages/coding-agent/src/cli.ts --smoke-test",
    "ci:test:install-methods": "bash scripts/install-tests/run-ci.sh",
    "ci:release:build-binaries": "bun scripts/ci-release-build-binaries.ts",
    "ci:release:publish": "bun scripts/ci-release-publish.ts",
    "ci:release:publish-native-leaf": "bun scripts/ci-release-publish.ts --native-leaf",
    "bench:gen-fixtures": "bun --cwd=packages/typescript-edit-benchmark run src/generate.ts --typescript-dir /tmp/typescript-source --count-per-type 8",
    "bench:edit": "bun --cwd=packages/typescript-edit-benchmark run start",
    "stats:sync": "python3 scripts/session-stats/sync.py",
    "stats:tools": "python3 scripts/session-stats/analyze.py tools",
    "stats:edits": "python3 scripts/session-stats/analyze.py edits",
    "stats:followups": "python3 scripts/session-stats/analyze.py followups",
    "stats:audit": "bun scripts/session-stats/audit.ts",
    "test:py": "python3 -m pytest -x python/omp-rpc/tests && python3 -m pytest -x python/robomp/tests",
    "robomp:install": "pip install -e 'python/robomp[dev]'",
    "robomp:serve": "python3 -m robomp serve",
    "robomp:test:integration": "ROBOMP_INTEGRATION=1 python3 -m pytest -x python/robomp/tests/test_worker_smoke.py",
    "pi:image": "docker build -t \"${PI_IMAGE:-oh-my-pi/pi:dev}\" .",
    "pi:run": "docker run --rm -it \"${PI_IMAGE:-oh-my-pi/pi:dev}\"",
    "robomp:build": "bun run pi:image && docker compose --project-directory python/robomp build",
    "robomp:rebuild": "bun run pi:image && docker compose --project-directory python/robomp build --no-cache",
    "robomp:up": "docker compose --project-directory python/robomp up -d",
    "robomp:down": "docker compose --project-directory python/robomp down",
    "robomp:restart": "docker compose --project-directory python/robomp restart robomp",
    "robomp:logs": "docker compose --project-directory python/robomp logs -f robomp",
    "robomp:dev": "bun run robomp:build && bun run robomp:up && bun run robomp:logs",
    "robomp:reset": "docker compose --project-directory python/robomp down -v && (docker image rm \"${PI_IMAGE:-oh-my-pi/pi:dev}\" || true)",
    "robomp:web:dev": "bun --cwd=python/robomp/web run dev",
    "robomp:web:build": "bun --cwd=python/robomp/web run build",
    "lint:py": "ruff check python && ruff format --check python",
    "fix:py": "ruff check --fix python && ruff format python",
    "prepublishOnly": "bun run check",
    "prepare": "bun run generate-docs-index && bun run build-tool-views",
    "publish": "bun run prepublishOnly && npm publish -ws --access public",
    "publish:dry": "bun run prepublishOnly && npm publish -ws --access public --dry-run",
    "release": "bun scripts/release.ts",
    "generate-models": "bun --cwd=packages/catalog run generate-models",
    "generate-docs-index": "bun --cwd=packages/coding-agent run generate-docs-index",
    "build-tool-views": "bun --cwd=packages/collab-web run build:tool-views",
    "check-spoofed-versions": "bun scripts/check-spoofed-versions.ts"
  },
  "devDependencies": {
    "@biomejs/biome": "catalog:",
    "prettier": "catalog:",
    "@types/bun": "catalog:",
    "@typescript/native-preview": "catalog:",
    "typescript": "catalog:",
    "lint-staged": "catalog:"
  },
  "lint-staged": {
    "*.{js,ts,jsx,tsx,json,jsonc,css}": "biome check --write --no-errors-on-unmatched"
  },
  "dependencies": {
    "sherpa-onnx": "1.12.37",
    "sherpa-onnx-darwin-arm64": "1.12.37",
    "sherpa-onnx-node": "1.12.37"
  }
}
```

### `README.md`
```
<p align="center">
  <img src="https://github.com/can1357/oh-my-pi/blob/main/assets/hero.png?raw=true" alt="omp">
</p>

<p align="center">
  <strong>A coding agent with the IDE wired in.</strong>
  <strong><a href="https://omp.sh">omp.sh</a></strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@oh-my-pi/pi-coding-agent"><img src="https://img.shields.io/npm/v/@oh-my-pi/pi-coding-agent?style=flat&colorA=222222&colorB=CB3837" alt="npm version"></a>
  <a href="https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/CHANGELOG.md"><img src="https://img.shields.io/badge/changelog-keep-E05735?style=flat&colorA=222222" alt="Changelog"></a>
  <a href="https://github.com/can1357/oh-my-pi/actions"><img src="https://img.shields.io/github/actions/workflow/status/can1357/oh-my-pi/ci.yml?style=flat&colorA=222222&colorB=3FB950" alt="CI"></a>
  <a href="https://github.com/can1357/oh-my-pi/blob/main/LICENSE"><img src="https://img.shields.io/github/license/can1357/oh-my-pi?style=flat&colorA=222222&colorB=58A6FF" alt="License"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&colorA=222222&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://www.rust-lang.org"><img src="https://img.shields.io/badge/Rust-DEA584?style=flat&colorA=222222&logo=rust&logoColor=white" alt="Rust"></a>
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/runtime-Bun-f472b6?style=flat&colorA=222222" alt="Bun"></a>
  <a href="https://discord.gg/4NMW9cdXZa"><img src="https://img.shields.io/badge/Discord-5865F2?style=flat&colorA=222222&logo=discord&logoColor=white" alt="Discord"></a>
</p>

<p align="center">
  Fork of <a href="https://github.com/badlogic/pi-mono">Pi</a> by <a href="https://github.com/mariozechner">@mariozechner</a> 
</p>

The most capable agent surface that ships. Continuously tuned by real-world use — complete out of the box, open all the way down.

**40+** providers · **32** built-in tools · **14** lsp ops · **28** dap ops · **~55k** lines of Rust core.

## Install

**macOS · Linux**

```sh
curl -fsSL https://omp.sh/install | sh
```

**Homebrew**

```sh
brew install can1357/tap/omp
```

**Bun (recommended)**

```sh
bun install -g @oh-my-pi/pi-coding-agent
```

**Windows (PowerShell)**

```powershell
irm https://omp.sh/install.ps1 | iex
```

**Pinned versions (mise)**

```sh
mise use -g github:can1357/oh-my-pi
```

macOS · Linux · Windows · bun ≥ 1.3.14

### Shell completions

`omp` generates its own completion scripts for **bash**, **zsh**, and **fish** from the live command/flag metadata, so they never drift from the actual CLI. Subcommands, flags, and enum values complete statically; model names (`--model`, `--smol`, `--slow`, `--plan`) resolve against the bundled model catalog and `--resume` against your on-disk sessions.

```sh
# zsh — add to ~/.zshrc (or write the output into a file on your $fpath)
eval "$(omp completions zsh)"

# bash — add to ~/.bashrc
eval "$(omp completions bash)"

# fish
omp completions fish > ~/.config/fish/completions/omp.fish
```

## Every tool, _benchmaxxed_.

Edits that land on the first attempt. Reads that summarize files instead of dumping their content. Searches that return instantly. Pick any model — omp will get it right.

| model            | metric       | what                                                                  |
| ---------------- | ------------ | --------------------------------------------------------------------- |
| Grok Code Fast 1 | 6.7% → 68.3% | Tenfold lift the moment the edit format stops eating the model alive. |
| Gemini 3 Flash   | +5 pp        | Over str_replace — beats Google's own best attempt at the format.     |
| Grok 4 Fast      | −61% tokens  | Output collapses once the retry loop on bad diffs disappears.         |
| MiniMax          | 2.1×         | Pass rate more than doubles. Same weights, same prompt.               |

- `read` : summarized snippets · ideal defaults · selector hit rate
- `search` : fastest in the west
- `lsp` : everything your IDE knows, the agent knows
- `prompts` : adjusted relentlessly for each model

[Read the full post ↗](https://blog.can.ac/2026/02/12/the-harness-problem/)

## The Pi _you love_, with **batteries included**.

Originally built on [Mario Zechner](https://github.com/mariozechner)'s wonderful [Pi](https://github.com/badlogic/pi-mono), omp adds everything you're missing.

### 01 · Code execution w/ tool-calling

Most harnesses give the agent a Python sandbox and call it done. Ours runs persistent Python and a Bun worker, and either kernel can call back into the agent's own tools — read, search, task — over a loopback bridge. The agent loads a CSV with tool.read from inside Python, charts it from JavaScript, and never leaves the cell.

![omp TUI: a single eval session with `[1/2] pandas describe` (Python) printing a real DataFrame.describe() table, followed by `[2/2] top scorer` (JavaScript) running a reduce. Footer: 'Both kernels ran in one session.'](https://omp.sh/captures/eval.webp)

### 02 · LSP wired into every write

Ask for a rename and you get a rename. The call goes through workspace/willRenameFiles, so re-exports, barrel files, and aliased imports update before the file moves. Everything your IDE knows, the agent knows.

![omp TUI: `LSP references` returns five hits across three files for the symbol `formatBytes`, then `LSP rename` applies the change with edits to format.ts/report.ts/cli.ts, then a `Search formatBytes 0 matches` confirmation. Final line: 'Rename complete. Five edits across three files…'.](https://omp.sh/captures/lsp.webp)

### 03 · Drives a real debugger

A C binary segfaults: the agent attaches lldb, steps to the bad pointer, reads the frame. A Go service hangs: it attaches dlv and walks the goroutines. A Python process is wedged: debugpy, pause, inspect, evaluate. Most agents are still sprinkling print statements.

![omp TUI: a live lldb-dap session against a native binary at /tmp/omp-native/demo. Adapter=lldb-dap, Status=stopped, Frame=xorshift32, Instruction pointer 0x10000055C, Location demo.c:6:10. Debug scopes and Debug variables cards show locals (x = 57351) and the agent confirms the math: x went from 7 → 57351 (= 7 ^ (7<<13)).](https://omp.sh/clips/dap-poster.webp)

_[Watch the capture ↗](https://omp.sh/clips/dap.mp4)_

### 04 · Time-traveling stream rules

Your rules sit dormant until the model goes off-script. A regex match aborts the stream mid-token, injects the rule as a system reminder, and retries from the same point. You get course-correction without paying context tax on every turn. Injections survive compaction, so the fix sticks.

![omp TUI: agent reading src.rs and about to write Box::leak when the request aborts (red `Error: Request was aborted`), an amber `⚠ Injecting rule: box-leak` card injects the rule body `Don't reach for Box::leak in production code paths`, and the agent then course-corrects by proposing `Arc<str>` and asking the user to confirm.](https://omp.sh/clips/ttsr-poster.webp)

_[Watch the capture ↗](https://omp.sh/clips/ttsr.mp4)_

### 05 · First-class subagents

Split a job across workers and get typed results back. task fans out into isolated worktrees, each worker runs its own tool surface, and the final yield is a schema-validated object the parent reads directly. No prose to parse, no merge conflicts between siblings, no orphaned edits.

![omp TUI showing `task` spawning two subagents `ComponentsExports` and `RoutesExports`, the constraints block requiring an IRC DM between peers, the per-subagent status cards with cost and duration, and a final Findings section listing both exports plus an honest 'IRC coordination note' about a one-sided handshake.](https://omp.sh/clips/irc-poster.webp)

_[Watch the capture ↗](https://omp.sh/clips/irc.mp4)_

### 06 · Read a pdf on arxiv, why not?

web_search chains fourteen ranked providers and hands whatever URLs it finds straight to read. Arxiv PDFs, GitHub pages, Stack Overflow threads come back as structured markdown with anchors intact — the same tool surface you use on local files. Cite, follow, quote, never lose where you came from.

![omp TUI: web_search returns 10 ranked Perplexity sources for inference-time compute scaling, the agent picks an arxiv paper, calls read https://arxiv.org/pdf/2604.10739v1, and summarizes the paper's headline result with real numbers.](https://omp.sh/clips/web-poster.webp)

_[Watch the capture ↗](https://omp.sh/clips/web.mp4)_

### 07 · Unapologetically native. Even on Windows.

Other agents shell out to rg, grep, find, and bash. On many machines those binaries don't exist, and on the ones where they do, every call costs a fork-exec round-trip. omp links the real implementations into the process. ripgrep, glob, find: in-process. brush is the bash, with sessions that survive across calls. The same omp binary runs on macOS, Linux, and Windows — no WSL bridge.

### 08 · Code review with priorities and a verdict

Get a clear verdict on whether the change ships, with every issue ranked P0 through P3 and scored for confidence. /review spawns dedicated reviewer subagents that sweep branches, single commits, or uncommitted work in parallel. You tackle what blocks release first; nothing important hides in a wall of prose.

### 09 · Hashline: edit by content hash

Perfect edits, fewer tokens. The model points at anchors instead of retyping the lines it wants to change, so whitespace battles and string-not-found loops just stop happening. Edit a stale file and the anchors diverge — we reject the patch before it corrupts anything. Grok 4 Fast spends 61% fewer output tokens on the same work.

### 10 · GitHub is just another filesystem

Other harnesses bolt on gh_issue_view, gh_pr_view, gh_search — each with its own parameters the agent has to learn and you have to debug. We skipped that. read already handles paths; PRs are paths. One interface to teach the model, one surface to keep correct.

### 11 · Hindsight: memory the agent curates

The agent remembers your codebase between sessions. It writes facts mid-run with retain, pulls them back with recall, and compresses each session into a mental model that loads on the first turn of the next one. Project-scoped by default, so what it learns about this repo stays with this repo.

### 12 · ACP: editor-drivable agent

Run omp inside Zed and you get the same agent you drive from the terminal — reading the buffer you're actually looking at, writing through the editor's save path, spawning shells in the editor's terminal. Destructive tools pause for a permission prompt you can answer once and forget. No bridge, no plugin, no second brain to keep in sync.

### 13 · Inherits what your other tools already wrote

Every other agent ships an importer and expects you to convert. omp reads the eight formats already on disk in their native shape — Cursor MDC, Cline .clinerules, Codex AGENTS.md, Copilot applyTo, and the rest. No migration script, no YAML-to-TOML port, no "supported subset" footnotes. The config your team wrote last quarter still works tonight.

### 14 · omp commit: atomic splits, validated messages

omp reads the working tree through git_overview, git_file_diff, and git_hunk, then splits unrelated changes into atomic commits ordered by their dependencies. Cycles are rejected before anything is written. Source files score above tests, docs, and configs, so the headline commit is the one that matters. Lock files are excluded from analysis entirely.

### 15 · Read PRs. _Walk skills._ Pull JSON out of subagents.

Twelve internal schemes — `pr://`, `issue://`, `agent://`, `skill://`, `rule://`, and the rest — resolve transparently inside every FS-shaped tool the agent already calls. `read pr://1428` returns the same shape as `read src/foo.ts`. `search` walks a diff like a directory. `agent://<id>/findings.0.path` pulls a field out of a subagent's output by path.

![omp TUI reading pr://can1357/oh-my-pi/1063 and then /diff/1, showing hunk headers, added lines, and a [MODIFIED] (+12 -0) summary.](https://omp.sh/captures/pr.webp)

### 16 · Conflict resolution, made easy.

Each merge conflict becomes one URL. The agent writes `@theirs`, `@ours`, or `@base` to `conflict://N` and the file resolves cleanly. Bulk form: `conflict://*`.

![omp TUI: ✓ Read src/session.ts (⚠ 1 conflict), then ✓ Write conflict://1 · 1 line with content @theirs, then a confirmation 'Resolved.'](https://omp.sh/clips/conflict-poster.webp)

_[Watch the capture ↗](https://omp.sh/clips/conflict.mp4)_

### 17 · Preview, then accept.

`ast_edit` returns a _(proposed)_ card with the replacement count. The change is staged. The agent calls `resolve` with a reason; the TUI turns it into an **Accept** card and the disk move happens — atomic, all or nothing.

![omp TUI: ✓ AST Edit: console.log($X) (proposed) 3 replacements · 1 file, then ✓ Accept: 3 replacements in 1 file (AST Edit), followed by 'Applied 3 replacements in src/auth.ts.'](https://omp.sh/clips/codemod-poster.webp)

_[Watch the capture ↗](https://omp.sh/clips/codemod.mp4)_

### 18 · Drives a _real browser_. _Or your Slack?_

Stealth's on by default, so pages see a normal user instead of a headless bot. The same API drives any Electron app in place — point it at Slack and the agent reads your DMs the way it reads the web.

![omp TUI driving the browser tool against DuckDuckGo](https://omp.sh/captures/browser.webp)

## Whatever the task needs, _it's already in the box_.

32 tools live in the same namespace as `read` and `bash`. Pin the active set with `--tools read,edit,bash,…` and the rest stay hidden but indexed — `search_tool_bm25` pulls them back in mid-session when `tools.discoveryMode` says so.

**Files & search**

- `read` — files, dirs, archives, SQLite, PDFs, notebooks, URLs, and internal `://` schemes through one path.
- `write` — create or overwrite a file, archive entry, or SQLite row.
- `edit` — hashline patches with content-hash anchors and stale-anchor recovery.
- `ast_edit` — structural rewrites previewed before apply, via ast-grep.
- `ast_grep` — structural code queries over 50+ tree-sitter grammars.
- `search` — regex over files, globs, and internal URLs.
- `find` — glob-based path lookup; reach for `search` when you need content matches.

**Runtime**

- `bash` — workspace shell, with optional PTY or background-job dispatch.
- `eval` — persistent Python and JavaScript cells with shared prelude and tool re-entry.
- `ssh` — one remote command against a configured host.

**Code intelligence**

- `lsp` — diagnostics, navigation, symbols, renames, code actions, raw requests.
- `debug` — drive a DAP session — breakpoints, stepping, threads, stack, variables.

**Coordination**

- `task` — fan out subagents in parallel, optionally workspace-isolated.
- `irc` — short prose between live agents in this process.
- `todo` — ordered mutations over the session todo list with phase tracking.
- `job` — wait on or cancel background jobs.
- `ask` — structured follow-up questions for interactive runs.

**Outside the box**

- `browser` — Puppeteer tabs over headless Chromium or CDP-attached apps.
- `web_search` — one query across configured providers, returning answer plus citations.
- `github` — GitHub CLI ops — repo, PR, issues, code search, Actions run-watch.
- `generate_image` — generate or edit raster images via Gemini, GPT, or xAI Grok image models.
- `inspect_image` — vision-model analysis of a local image file.
- `render_mermaid` — Mermaid source to terminal-friendly ASCII or PNG.
- `tts` — text-to-speech via xAI Grok Voice — five built-in voices, WAV or MP3.

**Memory & state**

- `checkpoint` — mark conversation state for a later collapse-and-report.
- `rewind` — prune exploratory context, keep a concise report.
- `retain` — queue durable facts into the active Hindsight bank.
- `recall` — search the Hindsight bank for raw memories.
- `reflect` — ask Hindsight to synthesize an answer over the bank.

**Misc**

- `resolve` — apply or discard a queued preview action.
- `search_tool_bm25` — BM25 over the hidden tool index; activates top matches mid-session.

Setting-gated, off by default: `github`, `inspect_image`, `render_mermaid`, `tts`, `checkpoint`, `rewind`, `search_tool_bm25`, `retain`, `recall`, `reflect`. Flip them on once, scoped per project.

[Full reference →](https://omp.sh/docs/tools)

## Forty-plus providers, hundreds of models, _one /model away_.

Roles route work by intent. `default` for normal turns. `smol` for cheap subagent fan-out. `slow` for deep reasoning. `plan` for plan mode. `commit` for changelogs. Override at launch with `--smol`, `--slow`, or `--plan`; cycle through the configured models for the active role with `Ctrl+P`. Swap the active model mid-session with the `/model` slash command.

Auth tags below: `oauth` signs in with your provider account, `plan` routes through a coding-plan subscription, `local` runs against a local server with the key optional.

### Frontier APIs

Direct APIs and gateways. Mix providers per role.

Anthropic `oauth` · OpenAI · OpenAI Codex `oauth` · Google Gemini · Google Antigravity `oauth` · xAI · Mistral · Groq · Cerebras · Fireworks · Together · Hugging Face · NVIDIA · OpenRouter · Synthetic · Vercel AI Gateway · Cloudflare AI Gateway · Wafer Serverless · Perplexity `oauth`

### Coding plans

Subscription-routed. `/login` attaches the session.

Cursor `oauth` · GitHub Copilot `oauth` · GitLab Duo · Kimi Code `plan` · Moonshot · MiniMax Coding Plan `plan` · MiniMax Coding Plan CN `plan` · Alibaba Coding Plan `plan` · Qwen Portal · Z.AI / GLM Coding Plan `plan` · Xiaomi MiMo · Qianfan · NanoGPT · Venice · Kilo · ZenMux · Wafer Pass `plan` · OpenCode Go · OpenCode Zen

### Run it yourself

OpenAI-compatible `/v1/models`. Local instances skip the key.

Ollama `local` · Ollama Cloud · LM Studio `local` · llama.cpp `local` · vLLM `local` · LiteLLM

### Four knobs that make routing useful

- **Custom providers** — Declare anything that speaks `openai-completions`, `openai-responses`, `openai-codex-responses`, `azure-openai-responses`, `anthropic-messages`, `google-generative-ai`, or `google-vertex` in `~/.omp/agent/models.yml`.
- **Fallback chains** — Per-role chains under `retry.fallbackChains`. When the primary throws 429s or hits a quota wall, the next entry takes the rest of the turn — restored on cooldown.
- **Path-scoped models** — Scope `enabledModels` and `disabledProviders` entries to a `path:` prefix to pin a different model set on one repo without touching the global config. Scoped entries cover the path and everything under it.
- **Round-robin credentials** — Stack API keys per provider and the runtime rotates with session affinity and per-credential backoff. Useful when one key would burn its quota by lunch.

Full provider & routing reference at [omp.sh/docs/providers](https://omp.sh/docs/providers).

## Fourteen backends. _One tool the agent already knows_.

`web_search` is built in, not bolted on. `auto` walks a fourteen-provider chain; pin one by name if you already pay for it. Behind every hit, site-aware extraction turns GitHub, registries, arXiv, Stack Overflow, and docs into structured markdown — anchors and link targets survive.


... [TRUNCATED] ...
```

### `tsconfig.base.json`
```
{
	"compilerOptions": {
		"target": "ES2024",
		"module": "ESNext",
		"lib": ["ES2024", "DOM.AsyncIterable"],
		"moduleResolution": "Bundler",
		"moduleDetection": "force",
		"strict": true,
		"skipLibCheck": true,
		"allowArbitraryExtensions": true,
		"verbatimModuleSyntax": true,
		"noEmit": true,
		"resolveJsonModule": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"types": ["bun", "assets"],
		"typeRoots": ["./types", "./node_modules/@types"]
	}
}
```

### `tsconfig.json`
```
{
	"references": [
		{
			"path": "./packages/tsconfig.workspace.json"
		},
		{
			"path": "./tsconfig.tools.json"
		}
	]
}
```

### `tsconfig.tools.json`
```
{
	"extends": "./tsconfig.base.json",
	"compilerOptions": {
		"composite": true,
		"noEmit": true,
		"emitDeclarationOnly": false,
		"allowImportingTsExtensions": true
	},
	"include": ["scripts", "packages/natives/scripts/gen-npm-packages.ts"],
	"exclude": ["node_modules"]
}
```

### `.github\PULL_REQUEST_TEMPLATE.md`
```
## What

<!-- Brief description of the change -->

## Why

<!-- Motivation, context, or link to issue (fixes #N) -->

## Testing

<!-- How was this tested? -->

---

- [ ] `bun check` passes
- [ ] Tested locally
- [ ] CHANGELOG updated (if user-facing)
```

### `.github\SECURITY.md`
```
# Security Policy

## Supported Versions

Only the latest release is supported with security updates.

## Reporting a Vulnerability

To report a security issue, either:

- Email can1357 directly, or
- Open a [private security advisory](https://github.com/can1357/oh-my-pi/security/advisories/new) on GitHub

Include steps to reproduce and any relevant details. Do not open a public issue for security vulnerabilities.

## Response

Reports are handled on a best-effort basis. You can expect an initial acknowledgment within a few days.
```

### `.omp\commands\fix-issues.md`
```
# Fix Issues Command

Diagnose, reproduce, and (when reproducible) fix open GitHub issues in parallel — each in its own clean worktree, with build artifacts symlinked so nothing recompiles.

## Arguments

- `$ARGUMENTS` — optional. Either:
  - a space- or comma-separated list of issue numbers / URLs, OR
  - GitHub-search qualifiers (`is:open`, `label:bug`, `author:foo`, ...) and/or a relative time window like `3d`, `2w`, `12h`.

If no issues and no flags are passed, default to **all open issues opened in the last 3 days**.

## Steps

### 1. Resolve the issue set

Parse `$ARGUMENTS`.

- If explicit issue numbers/URLs given, use them verbatim.
- Otherwise call the `github` tool with `op: search_issues`. Default (no args):

  ```
  github { op: "search_issues", query: "is:open", since: "3d", limit: 50 }
  ```

  Pass any user-supplied qualifiers verbatim through `query` (combine with `is:open` if not already present). Use `since` for the time window (`3d`, `2w`, `12h`, ISO date — see the `github` tool docs); set `dateField: "updated"` instead of the `created` default only when the user explicitly asks for recently-touched issues.

Print the resolved set before fanning out so the user can confirm scope.

### 2. Fan out one subagent per issue

Use **`task` with parallel subagents** — one task per issue. Pass the issue number, title, body summary, and the workflow below as the assignment. Subagents work in isolation; coordinate via `irc` only when two issues clearly touch the same file.

Each subagent **MUST** follow this exact workflow:

#### a. Read everything

1. Read `issue://<N>` (or `issue://<owner>/<repo>/<N>` for cross-repo) — fetches the issue body plus comments; comments often carry the real repro and fix hints. Append `?comments=0` only if you explicitly want to skip them.
2. `gh search prs` for the issue number to see if a fix is already in flight.
   - If a PR exists and looks reasonable → switch tracks: review that PR per `.omp/commands/review-prs.md` instead, and report back as `existing-pr`. Do **not** open a competing fix.

#### b. Diagnose & try to reproduce — **in the current cwd, on `main`**

Reproduce **here first**, before touching any worktree. The point is to confirm the bug is real on current main before investing in a fix branch.

1. Read the relevant source paths in this checkout. Form a concrete hypothesis (one or two sentences) about the failure.
2. Write a focused test file under the package the bug lives in. Naming: `repro-issue-<N>-<slug>.test.ts` (or `.rs`, etc.) — unique, greppable, deletable.
3. Run **only that test file**, not the suite. Confirm it fails for the reason in the issue.

Outcomes:
- **Reproduced** → continue to (c).
- **Not reproduced** → stop. Delete the test file. Report `unreproduced` with: hypothesis tried, evidence it doesn't fail, and what info would unblock (versions, OS, config, repro snippet from author). Do **not** create a worktree or commit.
- **Out of scope / not a bug** (e.g. user config error, intended behavior, dup) → stop. Report `not-a-bug` with the explanation suitable for posting to the issue.

#### c. Create a worktree off main

Only after a confirmed local repro:

```bash
MAIN="$(git rev-parse --show-toplevel)"
ENC="$(printf '%s' "$MAIN" | sed 's|[/\\:]|-|g')"
WT="$HOME/.omp/wt/${ENC}/fix-issue-<N>"

git -C "$MAIN" fetch origin main
git -C "$MAIN" worktree add -B "fix/issue-<N>" "$WT" origin/main
```

Branch naming: `fix/issue-<N>` (or `fix/issue-<N>-<slug>` if you'll open multiple). Path under `~/.omp/wt/<encoded-main-path>/...` matches the convention `pr_checkout` uses.

#### d. Symlink build artifacts

From the new worktree, link build outputs from `$MAIN` so `bun check` / `cargo build` / native loaders skip rebuilds:

```bash
cd "$WT"
ln -snf "$MAIN/target"       "$WT/target"
ln -snf "$MAIN/node_modules" "$WT/node_modules"

# Only the .node binaries are expensive to rebuild. The rest of
# packages/natives/native/ is tracked by git, so folder-level symlinks would
# shadow real source files and break the fix.
for f in "$MAIN"/packages/natives/native/*.node; do
  [ -e "$f" ] && ln -snf "$f" "$WT/packages/natives/native/"
done
```

Use absolute paths — the worktree lives outside the main checkout.

#### e. Move the repro test in & fix

1. Move (don't copy) the failing test file from the main checkout into the same path inside the worktree. Delete it from main so the original cwd is left clean.
2. Confirm it still fails inside the worktree on the current branch.
3. Implement the fix in source. Match existing patterns (see `AGENTS.md`); fix at the source, not at the symptom; no stubs, no mocks added to product code.
4. Re-run the repro test until it passes.
5. Add or adjust adjacent unit/contract tests where the fix changes a real contract — not just plumbing. Run **only** the affected test files; no full-suite runs from subagents.
6. Run `bun fmt` over the union of files edited.

#### f. Commit

Conventional commit, one logical change per commit, with `Fixes #<N>`:

```bash
git add -A
git commit -m "fix(<scope>): <one-line summary>

<short body explaining root cause and the fix>

Fixes #<N>."
```

Do **not** push. The human pushes / opens the PR.

#### g. Report back

Each subagent returns a short structured report:

```
Issue #<N>  <title>
Status:    fixed | unreproduced | not-a-bug | existing-pr (#<M>)
Repro:     <test path inside worktree>            (if applicable)
Worktree:  ~/.omp/wt/.../fix-issue-<N>            (if created)
Branch:    fix/issue-<N>                          (if created)
Commits:   <shas + one-liners>                    (if any)
Notes:     <root cause in one sentence; or what info is missing>
```

### 3. Aggregate

After all subagents finish, print a single summary table:

```
| # | Title | Status | Branch / Notes |
|---|-------|--------|----------------|
```

Group worktree paths by status (`fixed` first), so the user can `cd` and push the ready ones in one pass.

## Rules

- **MUST** reproduce on `main` in the current cwd **before** creating any worktree. No worktree until repro is confirmed.
- **MUST** use parallel subagents — one per issue.
- **MUST** check for an existing PR first; if one exists and is reasonable, divert to `review-prs` flow instead of duplicating work.
- **MUST** symlink `target`, `node_modules`, and the native `*.node` binaries before any build/test runs in the worktree. **MUST NOT** symlink the whole `packages/natives/native/` directory that would shadow tracked source files.
- **MUST** use conventional commits with `Fixes #<N>` in the body.
- **MUST NOT** push, open PRs, or comment on issues. Human handles delivery.
- **MUST NOT** ship stubs, mocks-as-product-code, or "TODO: implement" placeholders as a fix.
- **MUST NOT** expand scope: fix the reported bug, not adjacent code smells.
- If repro fails, delete the temporary test file from cwd before yielding — leave the original checkout clean.
```

### `.omp\commands\release.md`
```
# Release Command

Release all packages with the specified version.

## Arguments

- `$ARGUMENTS`: The version number (semver, e.g., `3.13.0`)

## Version Guidance

- Find the last release version by checking the latest git tag (`vX.Y.Z`) and confirm it matches `packages/*/package.json` versions.
- If no version is specified, review commits since the last tag, decide major/minor/patch, then bump accordingly.
- If the user specifies `major`, `minor`, or `patch`, bump from the last tag: major -> X+1.0.0, minor -> X.Y+1.0, patch -> X.Y.Z+1.

## Usage

Run the release script:

```bash
bun scripts/release.ts $ARGUMENTS
```

The script handles everything automatically:
1. Pre-flight checks (clean working dir, on main branch)
2. Updates all package.json versions
3. Regenerates bun.lock
4. Updates CHANGELOGs ([Unreleased] → [version] - date)
5. Commits and tags
6. Pushes to origin
7. Watches CI until all workflows pass

## Handling CI Failures

If CI fails, the script exits with an error. Fix the issue, then repeat until CI passes:

```bash
git commit -m "fix: <brief description>"
git push origin main
git tag -f v$ARGUMENTS && git push origin v$ARGUMENTS --force
bun scripts/release.ts watch
```

The `watch` subcommand re-watches CI for the current commit until all checks pass.
```

### `.omp\commands\review-prs.md`
```
# Review PRs Command

Triage incoming pull requests in parallel: decide what's worth merging, prep clean rebased worktrees, fix any blockers, and hand them back ready for human merge.

## Arguments

- `$ARGUMENTS` — optional. Either:
  - a space- or comma-separated list of PR numbers / URLs, OR
  - GitHub-search qualifiers (`is:open`, `author:foo`, `label:bug`, `draft:false`, ...) and/or a relative time window like `3d`, `2w`, `12h`.

If no PRs and no flags are passed, default to **all open PRs opened in the last 3 days**.

## Steps

### 1. Resolve the PR set

Parse `$ARGUMENTS`.

- If explicit PR numbers/URLs given, use them verbatim.
- Otherwise call the `github` tool with `op: search_prs`. Default (no args):

  ```
  github { op: "search_prs", query: "is:open", since: "3d", limit: 50 }
  ```

  Pass any user-supplied qualifiers verbatim through `query` (combine with `is:open` if not already present). Use `since` for the time window (`3d`, `2w`, `12h`, ISO date — see the `github` tool docs); set `dateField: "updated"` instead of the `created` default only when the user explicitly asks for recently-touched PRs.

Print the resolved set before fanning out so the user can confirm scope.

### 2. Fan out one subagent per PR

Use **`task` with parallel subagents** — one task per PR. Pass the PR number, head ref, author, and the workflow below as the assignment. Each subagent works in isolation; they coordinate via `irc` only if a fix on PR A would obviously conflict with PR B.

Each subagent **MUST** follow this exact workflow:

#### a. Read & decide

1. Read `pr://<N>` (with comments by default; append `?comments=0` to skip) and `pr://<N>/diff` for the changed-files listing — use `pr://<N>/diff/all` when you need the full unified diff, or `pr://<N>/diff/<i>` for a single file slice.
2. Check `git log origin/main` and `gh search prs` for whether the same change already landed.
3. Classify into one of:
   - **slop** — AI-generated noise, broken, off-spec, or net-negative. Drop, write a 1–2 line justification, do not check out.
   - **superseded** — already fixed/merged in main or by a newer PR. Drop with a pointer.
   - **worthy** — proceed.

Anything ambiguous defaults to `worthy` — let the human decide on a real branch.

#### b. Check out into a worktree

```bash
gh_PR=<NUMBER>
# pr_checkout creates ~/.omp/wt/<encoded-repo>/pr-<N>/ and configures push remote
```

Use the `github pr_checkout` tool, **not** raw `gh pr checkout`. That gives a dedicated worktree wired up for `pr_push` later.

#### c. Symlink build artifacts (skip native rebuilds)

From inside the new worktree, link the heavy build outputs from the main checkout so `bun check` / `cargo build` / native loaders do not recompile:

```bash
MAIN="<absolute path to main worktree, e.g. ~/Projects/pi>"
WT="$(pwd)"

# Rust target dir + JS deps (root-level in this monorepo)
ln -snf "$MAIN/target"        "$WT/target"
ln -snf "$MAIN/node_modules"  "$WT/node_modules"

# Prebuilt native addon (avoids 30s+ napi-rs rebuild). Link only the .node
# binaries — the rest of packages/natives/native/ is tracked by git, so
# folder-level symlinks would shadow PR-modified files and break review.
for f in "$MAIN"/packages/natives/native/*.node; do
  [ -e "$f" ] && ln -snf "$f" "$WT/packages/natives/native/"
done
```

Resolve `$MAIN` from the original cwd before `pr_checkout` (`git rev-parse --show-toplevel`). Use absolute paths in symlinks; the worktree lives outside the main repo so relative paths break.

#### d. Rebase onto main

```bash
git fetch origin main
git rebase origin/main
```

If the rebase conflicts:
- Resolve trivially mechanical conflicts (formatting, import order, adjacent-line edits) and continue.
- Anything semantic → abort the rebase, leave a note in the final report, do not commit.

#### e. Review & fix critical issues

Inside the worktree, review the diff with the lens of: correctness, security, regressions, breaking-change impact, test coverage of the new path.

Only fix things that **block merge**: build/test breakage, obvious bugs introduced by the PR, missing edge-case handling the PR's own goal demands. Do **not** rewrite for taste, refactor unrelated code, or expand scope.

For every fix:
- Read existing patterns first; match repo conventions (see `AGENTS.md`).
- Add or update tests for the actual behavior change.
- Run only the targeted test file(s) for the area touched. No project-wide test runs from subagents.

Format/lint at the end with `bun fmt` over the union of files you edited.

#### f. Commit

One conventional commit per logical fix on top of the rebased PR branch:

```bash
git add -A
git commit -m "fix(<scope>): <what & why>

Addresses review feedback on #<PR>."
```

Do **not** amend the PR author's commits. Do **not** push — the human merges.

#### g. Report back

Each subagent returns a short structured report:

```
PR #<N>  <title>
Decision: worthy | slop | superseded
Worktree: ~/.omp/wt/.../pr-<N>   (or: not checked out)
Rebase:   clean | conflicts (resolved | aborted: <reason>)
Fixes:    <commit shas + one-liners>   (or: none needed)
Blockers: <anything the human must decide>
```

### 3. Aggregate

After all subagents finish, print a single summary table:

```
| PR | Title | Decision | Rebase | Fixes | Blockers |
|----|-------|----------|--------|-------|----------|
```

Followed by the worktree paths grouped by decision, so the user can `cd` and merge in one go.

## Rules

- **MUST** use parallel subagents — one per PR — not a serial loop.
- **MUST** use `github pr_checkout` (carries push metadata) — not raw `gh pr checkout`.
- **MUST** symlink `target`, `node_modules`, and the native `*.node` binaries before any build/test runs in the worktree. **MUST NOT** symlink the whole `packages/natives/native/` directory that would shadow tracked PR changes.
- **MUST NOT** push or merge. Human reviews and merges.
- **MUST NOT** expand scope: fixes are limited to merge blockers on this PR's diff.
- **MUST NOT** force-push over the PR author's history.
- If a PR is `slop`/`superseded`, skip checkout entirely — just record the decision.
```

### `.omp\commands\triage.md`
```
# Triage Command

Classify and label **newly opened** GitHub issues that are missing labels.

## Arguments

- `$ARGUMENTS`: Optional window flag `--days <n>` (default: `7`). Only open issues created within this window are triaged.

## Steps

### 1. Fetch Issues

Parse `$ARGUMENTS` to determine the new-issue window (`--days`, default `7`).

```bash
# Build cutoff date (UTC) for "new" issues
CUTOFF_DATE="$(python - <<'PY'
from datetime import datetime, timedelta, timezone
print((datetime.now(timezone.utc) - timedelta(days=7)).strftime('%Y-%m-%d'))
PY
 )"

# Fetch only newly created open issues (default 7-day window)
gh issue list --state open --search "created:>=${CUTOFF_DATE}" --json number,title,body,labels,comments,createdAt --limit 50

### 2. Filter New Candidates

- Skip any issue older than the cutoff window; this command only triages new issues.
- Skip issues with label `triaged` (already handled).
- For remaining issues, skip only when all required labels are already present:
  - Exactly one primary label present (`bug`/`enhancement`/`question`/`proposal`/`documentation`/`invalid`/`duplicate`)
  - If primary label is `bug`, exactly one `prio:*` label present
  - At least one functional label present when applicable (`agent`/`tool`/`tui`/`cli`/`prompting`/`sdk`/`auth`/`setup`/`ux`/`providers`)
  - If provider-specific, at least one matching `provider:*` label present
  - If platform-specific, at least one matching `platform:*` label present

### 3. Classify Each Issue

For each candidate issue, read the title, body, and **all comments** (comments often contain critical context). Apply labels from the categories below. Do not auto-apply provider/platform labels unless explicitly indicated by issue evidence.

**Primary labels** (pick exactly one):
| Label | Signals |
|---|---|
| `bug` | Existing behavior is broken: crashes, errors, regressions, "doesn't work" |
| `enhancement` | Feature request or improvement to existing behavior |
| `question` | How-to, clarification, or usage question |
| `proposal` | Design/process proposal requiring maintainer decision |
| `documentation` | Docs are missing, incorrect, or outdated |
| `invalid` | Spam, off-topic, or not actionable |
| `duplicate` | Clear duplicate of another issue (reference original in a comment) |

**Priority labels** (required only for `bug`, pick exactly one):
| Label | Signals |
|---|---|
| `prio:p0` | Critical blocker, data loss/security breakage, unusable workflow |
| `prio:p1` | High impact, common workflow broken, should be fixed soon |
| `prio:p2` | Medium impact, workaround exists, not blocking most users |
| `prio:p3` | Low impact, edge case or minor issue |

**Functional labels** (pick all that apply):
| Label | Signals |
|---|---|
| `agent` | Agent planning/execution loops, orchestration, runtime behavior |
| `tool` | Tool contracts/behavior, tool call protocol, integration errors |
| `tui` | Terminal UI rendering/layout/input/view state |
| `cli` | CLI commands, args/flags, command routing |
| `prompting` | System prompts/templates/prompt assembly behavior |
| `sdk` | SDK or extension integration APIs/surfaces |
| `auth` | Login, credentials, API keys, token/account management |
| `setup` | Installation/bootstrap/environment setup issues |
| `ux` | Workflow/ergonomics/usability improvements (non-rendering) |
| `providers` | Provider-related behavior (generic provider scope) |

**Provider labels** (apply only when a specific provider is explicitly involved):
`provider:anthropic`, `provider:bedrock`, `provider:brave`, `provider:cerebras`, `provider:cloudflare`, `provider:codex`, `provider:copilot`, `provider:cursor`, `provider:exa`, `provider:gemini`, `provider:gitlab`, `provider:groq`, `provider:huggingface`, `provider:jina`, `provider:kimi`, `provider:litellm`, `provider:minimax`, `provider:mistral`, `provider:moonshot`, `provider:nanogpt`, `provider:nvidia`, `provider:openai`, `provider:opencode`, `provider:openrouter`, `provider:perplexity`, `provider:qianfan`, `provider:qwen`, `provider:synthetic`, `provider:together`, `provider:venice`, `provider:vercel`, `provider:xai`, `provider:xiaomi`, `provider:zai`

**Platform labels** (apply only when platform materially affects reproduction/root cause):
| Label | Signals |
|---|---|
| `platform:linux` | Linux-specific behavior, distro/toolchain differences, Linux-only reproduction |
| `platform:macos` | macOS-specific behavior (Homebrew/Darwin-specific) |
| `platform:windows` | Native Windows behavior (PowerShell/cmd/Win32 specifics) |
| `platform:wsl` | WSL-specific behavior (do not also apply linux/windows unless separately confirmed) |

**Meta labels** (manual judgment only):
| Label | Signals |
|---|---|
| `good first issue` | Well-scoped, self-contained, good for new contributors |
| `help wanted` | Maintainers want community help |
| `wontfix` | Intentional behavior or explicitly out of scope |

### 4. Apply Labels

For each issue, apply the chosen labels. **Never remove existing labels.**
Do not add provider or platform labels without explicit evidence from issue body/comments.

```bash
gh issue edit <number> --add-label "bug,prio:p1,tool,providers,provider:openai"
```

### 5. Print Summary

After processing all issues, print a markdown summary table:

```
## Triage Summary

| # | Title | Added Labels | Skipped |
|---|-------|-------------|---------|
| 42 | Tool call stalls after retry | bug, prio:p1, agent, tool | |
| 38 | Add provider fallback routing | proposal, providers, provider:exa | |
| 35 | How to configure API key rotation | question, auth, providers, provider:minimax | |
| 30 | Existing labels complete | | Already labeled |
```

Include counts at the end: `Processed: X | Labeled: Y | Skipped: Z`

## Classification Tips

- Do not apply `platform:*` unless platform-specific behavior is explicit or reproduced as platform-bound.
- Do not apply `providers` or any `provider:*` label unless provider scope is explicit.
- If a specific provider is named, add both `providers` and the matching `provider:*` label.
- WSL issues get `platform:wsl` — not `platform:linux` or `platform:windows` unless separately confirmed.
- Don't apply `good first issue` or `help wanted` during automated triage — those require maintainer judgment.
- If body is sparse, comments decide classification; do not skip before reading them all.```

### `.omp\skills\semantic-compression\SKILL.md`
```
---
name: semantic-compression
description: Aggressively remove grammatical scaffolding LLMs reconstruct while preserving meaning-carrying content. Output may be fragments. Use when compressing text for prompts, reducing token count, preparing context for LLM input, or making documentation more token-efficient. Applies LLM-aware compression rules that delete predictable grammar while preserving semantics.
---

# Semantic Compression

LLMs reconstruct grammar from content words. Remove predictable glue; keep semantic payload. Prefer fragments over sentences.

## Aggressive Stance

- Output can be noun/verb stacks, list fragments, or label:value phrases.
- Default to deletion; keep function words only when loss changes meaning.
- Prefer base verb forms; drop tense/aspect unless timeline is critical.

## Deletion Tiers

**Tier 1 — Always delete (even if fragments):**
- Articles: a, an, the
- Copulas: is, are, was, were, am, be, been, being
- Expletive subjects: "There is/are...", "It is..."
- Complementizer: that (as clause marker)
- Pure intensifiers: very, quite, rather, really, extremely, somewhat
- Filler phrases: "in order to" → to, "due to the fact that" → because, "in terms of" → delete
- Infinitive "to" before verbs (unless it prevents noun/verb confusion)
- Conjunctions when list/contrast obvious: and, or, but

**Tier 2 — Delete unless meaning changes:**
- Auxiliary verbs: have/has/had, do/does/did, will/would (keep if tense/aspect matters)
- Modal verbs: can/could/may/might/should (keep when obligation/permission/possibility is critical; always keep must/must not)
- Pronouns: it/this/that/these/those/he/she/they (drop when referent obvious; replace with noun if ambiguous)
- Relative pronouns: which, that, who, whom
- Prepositions: of, for, to, in, on, at, by (keep for material, direction, agency, or disambiguation)

**Tier 3 — Delete only if relation still clear:**
- Remaining prepositions: with/without, between/among, within, after/before, over/under, through (drop only if relation obvious)
- Redundant adverbs: "shout loudly" → "shout"

## Always Preserve

- Nouns, main verbs, meaning-bearing adjectives/adverbs
- Numbers, quantifiers: "at least 5", "approximately", "more than"
- Uncertainty markers: "appears", "seems", "reportedly", "what sounded like"
- Negation: not, no, never, without, none
- Temporal markers: dates, frequencies, durations
- Causality and conditionals: because, therefore, despite, although, if, unless
- Requirements/permissions: must, required, prohibited, allowed
- Proper nouns, titles, technical terms
- Prepositions encoding relationships: from/to (direction), with/without (inclusion), between/among/within (relation), after/before (temporal), by (agent if passive)

## Structural Compression

- Passive → active when agent known: "was eaten by dog" → "dog ate"
- Nominalization → verb: "made a decision" → "decided"
- Drop implied subject when context allows: "System should log errors" → "Log errors"
- Redundant pairs → single: "each and every" → "every"
- Clause → modifier: "anomaly that was reported" → "reported anomaly"

## Examples

| Original | Compressed |
|----------|------------|
| The system was designed to efficiently process incoming data from multiple sources | System design: efficient process incoming data, multiple sources |
| There were at least 20 people who appeared to be waiting | At least 20 people apparent waiting |
| It is important to note that the medication should not be taken without food | Medication: should not take without food |
| The researcher made a decision to investigate the anomaly that was reported | Researcher decided: investigate reported anomaly |
```

### `.omp\skills\system-prompts\SKILL.md`
```
---
name: system-prompts
description: Write system prompts, tool docs, and agent definitions. Project tag conventions + RFC 2119 keywords + dense compression. Use when authoring or editing any prompt the model reads.
---

# System Prompts

Project house style. Dense, imperative, RFC-keyed.

## Tags

Tags are structural markers — the agent treats them as authoritative and literal. Each tag means exactly what its name says. NEVER invent ornamental tags (`<north-star>`, `<stance>`, `<protocol>`, `<directives>`, `<strengths>`) — they're noise.

The vocabulary actually in use:

| Tag | Purpose |
| --- | --- |
| `<system-conventions>` | How to interpret tags + RFC keywords themselves. Defines the contract. |
| `<stakes>` | Why correctness matters here. Domain framing. |
| `<communication>` | Voice, tone, response shape. |
| `<critical>` | Inviolable rules. Place at START and END. |
| `<completeness>` | What "done" means. Anti-shrink rules. |
| `<yielding>` | Pre-yield checklist. Block conditions. |
| `<workflow>` | Numbered phases (scope → edit → decompose → work → verify). |
## Normative Language

RFC 2119 in full caps, no bold. The all-caps form IS the marker.

| Keyword | Meaning | Replaces |
| --- | --- | --- |
| MUST / REQUIRED | Absolute requirement | "always", "make sure", "ensure" |
| NEVER (= MUST NOT) | Absolute prohibition | "do not", "don't" |
| SHOULD / RECOMMENDED | Strong preference; deviation allowed with known tradeoffs | "prefer", "it's best to" |
| AVOID (= SHOULD NOT) | Strong discouragement | "try not to" |
| MAY / OPTIONAL | Truly optional | "can", "you could" |

**Project aliases**: prefer `NEVER` over `MUST NOT` and `AVOID` over `SHOULD NOT`. Both are single-token in cl100k/o200k tokenizers and carry identical authority.

State the alias contract once, near the top, inside `<system-conventions>`:

> RFC 2119 applies to MUST, REQUIRED, SHOULD, RECOMMENDED, MAY, OPTIONAL. `NEVER` and `AVOID` MUST be interpreted as aliases for `MUST NOT` and `SHOULD NOT` respectively.

NEVER convert: factual descriptions (what a tool returns, what a parameter does), code blocks, examples, schema, Handlebars template syntax.

## Density

Strip prose to load-bearing tokens. A bullet earns its words by saying something the prior bullet didn't.

- One claim per bullet. Sub-clauses that don't change behavior get cut.
- Replace "If X, then Y" with `X? Y.` when X is a quick check.
- Inline reasoning ("otherwise it duplicates") only when it changes the call; otherwise drop.
- The bolded lead names the rule — NEVER restate it in the body.
- Symbols beat words: `→`, `=`, `+`/`<`/`-`, `B+1`, `A..B`.
- Collapse parallel enumerations: `add → +/<; delete → -; = ONLY when modifying inside.`

```
Bad:  - **Never fabricate anchor hashes.** Hashes are 2-letter content fingerprints, not arbitrary suffixes. You cannot increment them, guess the "next" one, or compute them locally. If a needed anchor is not in your last `read` output, issue another `read`.
Good: - **NEVER fabricate anchor hashes.** Missing? Re-`read`.

Bad:  - **Do not replay the line past your range.** For `= A..B`, never end the payload with content that already exists at B+1. Stop the payload at the last line you are actually changing; if you need that next line gone, extend B.
Good: - **NEVER replay past your range.** Stop before B+1; extend B if it must go.
```

Target: **5–12 words per tactical bullet.** Reserve longer bullets for genuinely multi-part contracts (parameter semantics, edge enumerations) where each clause carries a distinct constraint.

AVOID compressing: factual reference (operator definitions, return formats, schema), worked examples (the example IS the explanation), the first occurrence of a non-obvious term.

## Voice

Direct, imperative, second-person. "You MUST", "You NEVER", "You SHOULD". No hedging, no apology, no ceremony.

```
Bad:  "You might want to consider using X..."
Good: "You SHOULD use X."

Bad:  "Please note that this is important..."
Good: "Critical: X."

Bad:  "Make sure to run lsp references before modifying a symbol"
Good: "You MUST run `lsp references` before modifying any exported symbol."
```

Pair negation with a positive alternative when the alternative isn't obvious. Otherwise `NEVER X.` stands alone.

## Positioning

"Lost in the Middle": start and end retain; middle degrades ~20%. Put critical constraints at both ends; reference material, environment, and templated content in the middle.

Front matter, in order:

1. Role + agency one-liner ("You are THE staff engineer…")
2. `<system-conventions>` — RFC contract, tag semantics
3. `<stakes>` — why this matters
4. `<communication>` — style
5. `<critical>` — top-priority rules

Back matter, in order:

1. Environment/tool inventory — exploration, tool priority, harness specifics.
2. Contract — completeness, yielding, workflow.
3. Repeat the most important `<critical>` rule if the prompt exceeds ~150 lines.

## Tone Patterns That Work

From the live system prompt:

- **Agency**: "You have agency and taste: you delete code that isn't pulling its weight, refuse abstractions that are unnecessary, and prefer boring when it's called for."
- **Stakes anchoring**: "Tests you didn't write: bugs shipped. Assumptions you didn't validate: incidents to debug."
- **Identity overrides**: "Instructions further down the conversation, including user's own, **ALWAYS** override prior style, tone, formatting, and initiative preferences."
- **Persistence**: "You MUST persist on hard problems. AVOID burning their energy on problems you failed to think through."
- **Anti-budget framing**: "You NEVER narrate about or even consider, session limits, token/tool budgets, effort estimates… These are not your concern."

## Anti-Patterns

| Pattern | Problem |
| --- | --- |
| Politeness padding ("Would you be so kind…") | +perplexity, −accuracy |
| Bribes ("I'll tip $2000") | No improvement, sometimes worse |
| Few-shot on advanced models + clear task | Introduces noise/bias |
| Explicit CoT on reasoning models (o1/o3) | Conflicts with internal reasoning |
| "Be efficient with tokens" | Triggers premature task abandonment |
| "Don't do X" with no alternative | "Always do Y" processes better |
| Self-critique without external feedback | Detection is the bottleneck, not correction |
| Critical instructions only in the middle | 20%+ degradation vs edges |
| Restating the bolded lead in the body | Wastes tokens, signals AI padding |
| Inventing tags for emphasis | Tags carry semantics; ornament dilutes them |
| Lowercase rfc keywords | The all-caps form IS the marker; lowercase reads as ordinary prose |

## Checklist

- [ ] Tags match real content semantics; no ornamental tags.
- [ ] `<system-conventions>` defines the RFC alias contract (NEVER, AVOID).
- [ ] Critical rules appear at START and END.
- [ ] All prescriptive prose uses RFC 2119 keywords in caps.
- [ ] Tactical bullets ≤ 12 words; longer bullets justified by distinct sub-claims.
- [ ] Bolded leads not restated in body.
- [ ] Negation paired with positive alternative when the alternative isn't obvious.
- [ ] Verification path named (tests, lint, typecheck) — never "review your work".
- [ ] Persistence framing for complex tasks ("keep going until complete").
- [ ] No hedging, no ceremony, no closing summaries, no time estimates.

## Tool Prompt Authoring

Tool prompts are not API docs. They teach the agent **when to reach for the tool, what shape its inputs take, and which failure modes are the agent's responsibility**. Everything else — engine internals, recovery heuristics, fallback chains, performance tuning — stays in code.

### Describe surface, not machinery

The agent picks tools from prose, not source. Tell it WHEN and WHY; NEVER HOW the tool works internally.

- `read.md` enumerates every source it covers (file/dir/archive/sqlite/PDF/URL) so the agent stops reaching for `cat`/`curl`/`tar`. It does NOT mention the chunker, the binary sniffer, or the cache layer.
- `lsp.md`: "You MUST use `lsp` whenever a language server is available — safer than text-based alternatives." No mention of the LSP wire protocol, server lifecycle, or capability negotiation.
- `ast_edit`: teaches metavariable syntax + workflow ("Loosest existence check: `pat: 'executeBash'` with narrow paths"). Does NOT explain the AST engine, query compilation, or tree-sitter grammar selection.
- `hashline.md` (this repo): teaches the **patch grammar** (anchors, ops, payloads, ranges) and the **edit shapes** that succeed. Hides `tryRecoverHashlineWithCache`, the fuzz factor, the bigram tables, `findUniqueSuffixMatch`, `untilAborted`, `formatGroupedFiles`. The agent never learns those names — it just sees "the tool resolved your typo" or "the anchor was stale, re-read".

If the agent's behavior shouldn't change based on a detail, the detail does NOT belong in the prompt. Each sentence MUST shift a decision the agent makes.

### Anatomy of a good tool prompt

1. **One-line purpose.** What problem it solves, in the agent's vocabulary. Not "wraps libfoo with X" — instead "compact, line-anchored edit format".
2. **Input grammar / surface.** Operators, parameters, selectors. Concrete syntax the agent will emit verbatim.
3. **Worked examples.** 3–8 patterns covering the common shapes. Each example IS the explanation — don't narrate it twice.
4. **Failure shapes the agent owns.** Things the agent can fix by changing its input (stale anchors, missing payload prefix, fabricated hash). Skip failures the engine recovers from silently.
5. **Anti-patterns.** WRONG/RIGHT pairs for the mistakes that cost retries. Drawn from real failures, not imagined ones.
6. **`<critical>` recap.** 3–6 lines of the load-bearing rules, in case the agent skips the body.

### What stays out

- Implementation file names, function names, module layout.
- Recovery, retry, normalization, caching, fuzz matching.
- Performance characteristics ("this is O(n)") unless they change the agent's strategy.
- Telemetry, logging, debug flags, env vars the agent cannot set.
- Version history, deprecated parameters, "previously this worked differently".
- Cross-tool plumbing ("this calls `read` under the hood") unless the agent must coordinate them.

### Examples drive the contract

Tool prompts lean on examples harder than agent prompts do. Reasons:

- Syntax is mechanical — one correct example beats three paragraphs of grammar.
- The model anchors output formatting on the most recent example it saw. Put the canonical shape last.
- Anti-patterns matter: a WRONG example next to its RIGHT counterpart kills a whole class of retry.

Examples MUST be runnable shape, not pseudo-code. If the tool takes JSON, the example is JSON. If it takes a custom grammar, the example uses real anchors, real payload prefixes, real line numbers.
```
