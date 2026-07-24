# Architecture Extract: MiMo-Code

## Directory Structure
```text
MiMo-Code/
    .editorconfig
    .gitignore
    .oxlintrc.json
    .prettierignore
    AGENTS.md
    bun.lock
    bunfig.toml
    CLAUDE.md
    CONTRIBUTING.md
    flake.lock
    flake.nix
    install
    LICENSE
    package.json
    README.md
    README.zh.md
    SECURITY.md
    sst-env.d.ts
    sst.config.ts
    STATS.md
    tsconfig.json
    turbo.json
    USE_RESTRICTIONS.md
    .github/
        pull_request_template.md
        actions/
            setup-bun/
                action.yml
        ISSUE_TEMPLATE/
            bug-report.yml
            config.yml
            feature-request.yml
            question.yml
        workflows/
            typecheck.yml
    .husky/
        pre-push
    .mimocode/
        .gitignore
        env.d.ts
        mimocode.jsonc
        tui.json
        agent/
            translator.md
        command/
            ai-deps.md
            changelog.md
            commit.md
            issues.md
            learn.md
            rmslop.md
            spellcheck.md
        glossary/
            ar.md
            br.md
            bs.md
            da.md
            de.md
            es.md
            fr.md
            ja.md
            ko.md
            no.md
            pl.md
            README.md
            ru.md
            th.md
            tr.md
            zh-cn.md
            zh-tw.md
        plugins/
            smoke-theme.json
            tui-smoke.tsx
        skills/
            effect/
                SKILL.md
        themes/
            .gitignore
            mytheme.json
    .vscode/
        launch.example.json
        settings.example.json
    .zed/
        settings.json
    assets/
        readme/
    docs/
        build-release.md
    infra/
        app.ts
        console.ts
        enterprise.ts
        secret.ts
        stage.ts
    nix/
        desktop.nix
        hashes.json
        node_modules.nix
        opencode.nix
        scripts/
            canonicalize-node-modules.ts
            normalize-bun-binaries.ts
    packages/
        app/
            .gitignore
            AGENTS.md
            bunfig.toml
            happydom.ts
            index.html
            package.json
            playwright.config.ts
            README.md
            sst-env.d.ts
            tsconfig.json
            vite.config.ts
            vite.js
            e2e/
                todo.spec.ts
                tsconfig.json
            public/
                favicon-v3.ico
                favicon.ico
                oc-theme-preload.js
                site.webmanifest
                _headers
                assets/
                    JetBrainsMonoNerdFontMono-Regular.woff2
            src/
                app.tsx
                custom-elements.d.ts
                entry.tsx
                env.d.ts
                index.css
                index.ts
                sst-env.d.ts
                theme-preload.test.ts
                addons/
                    serialize.test.ts
                    serialize.ts
                components/
                    debug-bar.tsx
                    dialog-connect-provider.tsx
                    dialog-custom-provider-form.ts
                    dialog-custom-provider.test.ts
                    dialog-custom-provider.tsx
                    dialog-edit-project.tsx
                    dialog-fork.tsx
                    dialog-manage-models.tsx
                    dialog-release-notes.tsx
                    dialog-select-directory.tsx
                    dialog-select-file.tsx
                    dialog-select-mcp.tsx
                    dialog-select-model-unpaid.tsx
                    dialog-select-model.tsx
                    dialog-select-provider.tsx
                    dialog-select-server.tsx
                    dialog-settings.tsx
                    file-tree.test.ts
                    file-tree.tsx
                    link.tsx
                    model-tooltip.tsx
                    prompt-input.tsx
                    session-context-usage.tsx
                    settings-general.tsx
                    settings-keybinds.tsx
                    settings-list.tsx
                    settings-models.tsx
                    settings-providers.tsx
                    status-popover-body.tsx
                    status-popover.tsx
                    terminal.tsx
                    titlebar-history.test.ts
                    titlebar-history.ts
                    titlebar.tsx
                    prompt-input/
                        attachments.test.ts
                        attachments.ts
                        build-request-parts.test.ts
                        build-request-parts.ts
                        context-items.tsx
                        drag-overlay.tsx
                        editor-dom.test.ts
                        editor-dom.ts
                        files.ts
                        history.test.ts
                        history.ts
                        image-attachments.tsx
                        paste.ts
                        placeholder.test.ts
                        placeholder.ts
                        slash-popover.tsx
                        submit.test.ts
                        submit.ts
                    server/
                        server-row.tsx
                    session/
                        index.ts
                        session-context-breakdown.test.ts
                        session-context-breakdown.ts
                        session-context-format.ts
                        session-context-metrics.test.ts
                        session-context-metrics.ts
                        session-context-tab.tsx
                        session-header.tsx
                        session-new-view.tsx
                        session-sortable-tab.tsx
                        session-sortable-terminal-tab.tsx
                constants/
                    file-picker.ts
                context/
                    command-keybind.test.ts
                    command.test.ts
                    command.tsx
                    comments.test.ts
                    comments.tsx
                    file-content-eviction-accounting.test.ts
                    file.tsx
                    global-sdk.tsx
                    global-sync.test.ts
                    global-sync.tsx
                    highlights.tsx
                    language.tsx
                    layout-scroll.test.ts
                    layout-scroll.ts
                    layout.test.ts
                    layout.tsx
                    local.tsx
                    model-variant.test.ts
                    model-variant.ts
                    models.tsx
                    notification.tsx
                    permission-auto-respond.test.ts
                    permission-auto-respond.ts
                    permission.tsx
                    platform.tsx
                    prompt.tsx
                    sdk.tsx
                    server.tsx
                    settings.tsx
                    sync-optimistic.test.ts
                    sync.tsx
                    terminal-title.ts
                    terminal.test.ts
                    terminal.tsx
                    file/
                        content-cache.ts
                        path.test.ts
                        path.ts
                        tree-store.ts
                        types.ts
                        view-cache.ts
                        watcher.test.ts
                        watcher.ts
                    global-sync/
                        bootstrap.ts
                        child-store.test.ts
                        child-store.ts
                        event-reducer.test.ts
                        event-reducer.ts
                        eviction.ts
                        queue.ts
                        session-cache.test.ts
                        session-cache.ts
                        session-load.ts
                        session-prefetch.test.ts
                        session-prefetch.ts
                        session-trim.test.ts
                        session-trim.ts
                        types.ts
                        utils.test.ts
                        utils.ts
                hooks/
                    use-providers.ts
                i18n/
                    ar.ts
                    br.ts
                    bs.ts
                    da.ts
                    de.ts
                    en.ts
                    es.ts
                    fr.ts
                    ja.ts
                    ko.ts
                    no.ts
                    parity.test.ts
                    pl.ts
                    ru.ts
                    th.ts
                    tr.ts
                    zh.ts
                    zht.ts
                pages/
                    directory-layout.tsx
                    error.tsx
                    home.tsx
                    layout.tsx
                    session.tsx
                    layout/
                        deep-links.ts
                        helpers.test.ts
                        helpers.ts
                        inline-editor.tsx
                        sidebar-items.tsx
                        sidebar-project.tsx
                        sidebar-shell.tsx
                        sidebar-workspace.tsx
                    session/
                        file-tab-scroll.test.ts
                        file-tab-scroll.ts
                        file-tabs.tsx
                        handoff.ts
                        helpers.test.ts
                        helpers.ts
                        message-gesture.test.ts
                        message-gesture.ts
                        message-id-from-hash.ts
                        message-timeline.tsx
                        review-tab.tsx
                        session-layout.ts
                        session-model-helpers.test.ts
                        session-model-helpers.ts
                        session-side-panel.tsx
                        terminal-label.ts
                        terminal-panel.test.ts
                        terminal-panel.tsx
                        use-session-commands.tsx
                        use-session-hash-scroll.test.ts
                        use-session-hash-scroll.ts
                        composer/
                            index.ts
                            session-composer-region.tsx
                            session-composer-state.test.ts
                            session-composer-state.ts
                            session-followup-dock.tsx
                            session-permission-dock.tsx
                            session-question-dock.tsx
                            session-request-tree.ts
                            session-revert-dock.tsx
                            session-todo-dock.tsx
                utils/
                    agent.ts
                    aim.ts
                    base64.ts
                    comment-note.ts
                    diffs.test.ts
                    diffs.ts
                    id.ts
                    notification-click.test.ts
                    notification-click.ts
                    persist.test.ts
                    persist.ts
                    prompt.test.ts
                    prompt.ts
                    runtime-adapters.test.ts
                    runtime-adapters.ts
                    same.ts
                    scoped-cache.test.ts
                    scoped-cache.ts
                    server-errors.test.ts
                    server-errors.ts
                    server-health.test.ts
                    server-health.ts
                    server.ts
                    session-title.ts
                    solid-dnd.tsx
                    sound.ts
                    terminal-writer.test.ts
                    terminal-writer.ts
                    time.ts
                    uuid.test.ts
                    uuid.ts
                    worktree.test.ts
                    worktree.ts
        console/
            app/
                .gitignore
                package.json
                README.md
                sst-env.d.ts
                tsconfig.json
                vite.config.ts
                .opencode/
                    agent/
                        css.md
                public/
                    email
                    favicon-v3.ico
                    favicon.ico
                    opencode-brand-assets.zip
                    robots.txt
                    site.webmanifest
                    theme.json
                script/
                    generate-sitemap.ts
                src/
                    app.css
                    app.tsx
                    config.ts
                    entry-client.tsx
                    entry-server.tsx
                    global.d.ts
                    middleware.ts
                    asset/
                        black/
                        brand/
                            opencode-brand-assets.zip
                        lander/
                    component/
                        dropdown.css
                        dropdown.tsx
                        email-signup.tsx
                        faq.tsx
                        footer.tsx
                        header-context-menu.css
                        header.tsx
                        icon.tsx
                        language-picker.css
                        language-picker.tsx
                        legal.tsx
                        locale-links.tsx
                        modal.css
                        modal.tsx
                        spotlight.css
                        spotlight.tsx
                    context/
                        auth.session.ts
                        auth.ts
                        auth.withActor.ts
                        i18n.tsx
                        language.tsx
                    i18n/
                        ar.ts
                        br.ts
                        da.ts
                        de.ts
                        en.ts
                        es.ts
                        fr.ts
                        index.ts
                        it.ts
                        ja.ts
                        ko.ts
                        no.ts
                        pl.ts
                        ru.ts
                        th.ts
                        tr.ts
                        zh.ts
                        zht.ts
                    lib/
                        changelog.ts
                        form-error.ts
                        github.ts
                        language.ts
                        salesforce.ts
                    routes/
                        black.css
                        black.tsx
                        changelog.json.ts
                        desktop-feedback.ts
                        discord.ts
                        feishu.ts
                        index.css
                        index.tsx
                        openapi.json.ts
                        temp.tsx
                        user-menu.css
                        user-menu.tsx
                        workspace-picker.css
                        workspace-picker.tsx
                        workspace.css
                        workspace.tsx
                        [...404].css
                        [...404].tsx
                        api/
                            enterprise.ts
                        auth/
                            authorize.ts
                            index.ts
                            logout.ts
                            status.ts
                            [...callback].ts
                        bench/
                            index.tsx
                            submission.ts
                            [id].tsx
                        black/
                            common.tsx
                            index.tsx
                            workspace.css
                            workspace.tsx
                            subscribe/
                                [plan].tsx
                        brand/
                            index.css
                            index.tsx
                        changelog/
                            index.css
                            index.tsx
                        debug/
                            index.ts
                        docs/
                            index.ts
                            [...path].ts
                        download/
                            index.css
                            index.tsx
                            types.ts
                            [channel]/
                                [platform].ts
                        enterprise/
                            index.css
                            index.tsx
                        go/
                            index.css
                            index.tsx
                        legal/
                            privacy-policy/
                                index.css
                                index.tsx
                            terms-of-service/
                                index.css
                                index.tsx
                        s/
                            [id].ts
                        stripe/
                            webhook.ts
                        t/
                            [...path].tsx
                        workspace/
                            common.tsx
                            [id].css
                            [id].tsx
                            [id]/
                                index.tsx
                                model-section.module.css
                                model-section.tsx
                                new-user-section.module.css
                                new-user-section.tsx
                                provider-section.module.css
                                provider-section.tsx
                                billing/
                                    billing-section.module.css
                                    billing-section.tsx
                                    black-section.module.css
                                    black-section.tsx
                                    black-waitlist-section.module.css
                                    index.tsx
                                    monthly-limit-section.module.css
                                    monthly-limit-section.tsx
                                    payment-section.module.css
                                    payment-section.tsx
                                    redeem-section.module.css
                                    redeem-section.tsx
                                    reload-section.module.css
                                    reload-section.tsx
                                go/
                                    index.tsx
                                    lite-section.module.css
                                    lite-section.tsx
                                keys/
                                    index.tsx
                                    key-section.module.css
                                    key-section.tsx
                                members/
                                    index.tsx
                                    member-section.module.css
                                    member-section.tsx
                                    role-dropdown.css
                                    role-dropdown.tsx
                                settings/
                                    index.tsx
                                    settings-section.module.css
                                    settings-section.tsx
                                usage/
                                    graph-section.module.css
                                    graph-section.tsx
                                    index.tsx
                                    usage-section.module.css
                                    usage-section.tsx
                        zen/
                            index.css
                            index.tsx
                            go/
                                v1/
                                    messages.ts
                                    chat/
                                        completions.ts
                            util/
                                dataDumper.ts
                                error.ts
                                handler.ts
                                ipRateLimiter.ts
                                keyRateLimiter.ts
                                logger.ts
                                modelTpmLimiter.ts
                                stickyProviderTracker.ts
                                trialLimiter.ts
                                provider/
                                    anthropic.ts
                                    google.ts
                                    openai-compatible.ts
                                    openai.ts
                                    provider.ts
                            v1/
                                messages.ts
                                models.ts
                                responses.ts
                                chat/
                                    completions.ts
                                models/
                                    [model].ts
                    style/
                        base.css
                        index.css
                        reset.css
                        component/
                            button.css
                        token/
                            color.css
                            font.css
                            space.css
                test/
                    rateLimiter.test.ts
            core/
                .gitignore
                drizzle.config.ts
                package.json
                sst-env.d.ts
                tsconfig.json
                migrations/
                    20250902065410_fluffy_raza/
                        migration.sql
                        snapshot.json
                    20250903035359_serious_whistler/
                        migration.sql
                        snapshot.json
                    20250911133331_violet_loners/
                        migration.sql
                        snapshot.json
                    20250911141957_dusty_clint_barton/
                        migration.sql
                        snapshot.json
                    20250911214917_first_mockingbird/
                        migration.sql
                        snapshot.json
                    20250911231144_jazzy_skrulls/
                        migration.sql
                        snapshot.json
                    20250912021148_parallel_gauntlet/
                        migration.sql
                        snapshot.json
                    20250912161749_familiar_nightshade/
                        migration.sql
                        snapshot.json
                    20250914213824_eminent_ultimatum/
                        migration.sql
                        snapshot.json
                    20250914222302_redundant_piledriver/
                        migration.sql
                        snapshot.json
                    20250914232505_needy_sue_storm/
                        migration.sql
                        snapshot.json
                    20250915150801_freezing_phil_sheldon/
                        migration.sql
                        snapshot.json
                    20250915172014_bright_photon/
                        migration.sql
                        snapshot.json
                    20250915172258_absurd_hobgoblin/
                        migration.sql
                        snapshot.json
                    20250919135159_demonic_princess_powerful/
                        migration.sql
                        snapshot.json
                    20250921042124_cloudy_revanche/
                        migration.sql
                        snapshot.json
                    20250923213126_cold_la_nuit/
                        migration.sql
                        snapshot.json
                    20250924230623_woozy_thaddeus_ross/
                        migration.sql
                        snapshot.json
                    20250928163425_nervous_iron_lad/
                        migration.sql
                        snapshot.json
                    20250928235456_dazzling_cable/
                        migration.sql
                        snapshot.json
                    20250929181457_supreme_jack_power/
                        migration.sql
                        snapshot.json
                    20250929224703_flawless_clea/
                        migration.sql
                        snapshot.json
                    20251002175032_nice_dreadnoughts/
                        migration.sql
                        snapshot.json
                    20251002223020_optimal_paibok/
                        migration.sql
                        snapshot.json
                    20251003202205_early_black_crow/
                        migration.sql
                        snapshot.json
                    20251003210411_legal_joseph/
                        migration.sql
                        snapshot.json
                    20251004030300_numerous_prodigy/
                        migration.sql
                        snapshot.json
                    20251004045106_hot_wong/
                        migration.sql
                        snapshot.json
                    20251007024345_careful_cerise/
                        migration.sql
                        snapshot.json
                    20251007043715_panoramic_harrier/
                        migration.sql
                        snapshot.json
                    20251007230438_ordinary_ultragirl/
                        migration.sql
                        snapshot.json
                    20251008161718_outgoing_outlaw_kid/
                        migration.sql
                        snapshot.json
                    20251009021849_white_doctor_doom/
                        migration.sql
                        snapshot.json
                    20251016175624_cynical_jack_flag/
                        migration.sql
                        snapshot.json
                    20251016214520_short_bulldozer/
                        migration.sql
                        snapshot.json
                    20251017015733_narrow_blindfold/
                        migration.sql
                        snapshot.json
                    20251017024232_slimy_energizer/
                        migration.sql
                        snapshot.json
                    20251031163113_messy_jackal/
                        migration.sql
                        snapshot.json
                    20251125223403_famous_magik/
                        migration.sql
                        snapshot.json
                    20251228182259_striped_forge/
                        migration.sql
                        snapshot.json
                    20260105034337_broken_gamora/
                        migration.sql
                        snapshot.json
                    20260106204919_odd_misty_knight/
                        migration.sql
                        snapshot.json
                    20260107000117_flat_nightmare/
                        migration.sql
                        snapshot.json
                    20260107022356_lame_calypso/
                        migration.sql
                        snapshot.json
                    20260107041522_tiny_captain_midlands/
                        migration.sql
                        snapshot.json
                    20260107055817_cuddly_diamondback/
                        migration.sql
                        snapshot.json
                    20260108224422_charming_black_bolt/
                        migration.sql
                        snapshot.json
                    20260109000245_huge_omega_red/
                        migration.sql
                        snapshot.json
                    20260109001625_mean_frank_castle/
                        migration.sql
                        snapshot.json
                    20260109014234_noisy_domino/
                        migration.sql
                        snapshot.json
                    20260109040130_bumpy_mephistopheles/
                        migration.sql
                        snapshot.json
                    20260113215232_jazzy_green_goblin/
                        migration.sql
                        snapshot.json
                    20260113223840_aromatic_agent_zero/
                        migration.sql
                        snapshot.json
                    20260116213606_gigantic_hardball/
                        migration.sql
                        snapshot.json
                    20260116224745_numerous_annihilus/
                        migration.sql
                        snapshot.json
                    20260122190905_moaning_karnak/
                        migration.sql
                        snapshot.json
                    20260222233442_clever_toxin/
                        migration.sql
                        snapshot.json
                    20260224043338_nifty_starjammers/
                        migration.sql
                        snapshot.json
                    20260414235536_lame_wild_child/
                        migration.sql
                        snapshot.json
                    20260415002256_perpetual_karen_page/
                        migration.sql
                        snapshot.json
                    20260415002534_far_smasher/
                        migration.sql
                        snapshot.json
                    20260417071612_tidy_diamondback/
                        migration.sql
                        snapshot.json
                    20260418195905_shocking_marvel_zombies/
                        migration.sql
                        snapshot.json
                    20260420184535_aromatic_molten_man/
                        migration.sql
                        snapshot.json
                    20260420185813_supreme_roxanne_simpson/
                        migration.sql
                        snapshot.json
                    20260420191234_deep_scarecrow/
                        migration.sql
                        snapshot.json
                    20260421020842_bizarre_living_tribunal/
                        migration.sql
                        snapshot.json
                    20260421023950_nebulous_weapon_omega/
                        migration.sql
                        snapshot.json
                script/
                    black-cancel-waitlist.ts
                    black-gift.ts
                    black-onboard-waitlist.ts
                    black-select-workspaces.ts
                    black-stats.ts
                    black-transfer.ts
                    create-coupon.ts
                    credit-workspace.ts
                    disable-reload.ts
                    freeze-workspace.ts
                    lookup-user.ts
                    promote-limits.ts
                    promote-models.ts
                    pull-models.ts
                    reset-db.ts
                    update-limits.ts
                    update-models.ts
                src/
                    account.ts
                    actor.ts
                    aws.ts
                    billing.ts
                    black.ts
                    context.ts
                    identifier.ts
                    key.ts
                    lite.ts
                    model.ts
                    provider.ts
                    subscription.ts
                    user.ts
                    workspace.ts
                    drizzle/
                        index.ts
                        types.ts
                    schema/
                        account.sql.ts
                        auth.sql.ts
                        benchmark.sql.ts
                        billing.sql.ts
                        ip.sql.ts
                        key.sql.ts
                        model.sql.ts
                        provider.sql.ts
                        user.sql.ts
                        workspace.sql.ts
                    util/
                        date.ts
                        env.cloudflare.ts
                        fn.ts
                        log.ts
                        memo.ts
                        price.ts
                test/
                    date.test.ts
                    subscription.test.ts
            function/
                package.json
                sst-env.d.ts
                tsconfig.json
                src/
                    auth.ts
                    log-processor.ts
            mail/
                package.json
                sst-env.d.ts
                emails/
                    components.tsx
                    styles.ts
                    templates/
                        InviteEmail.tsx
                        static/
                            ibm-plex-mono-latin-400.woff2
                            ibm-plex-mono-latin-500.woff2
                            ibm-plex-mono-latin-600.woff2
                            ibm-plex-mono-latin-700.woff2
                            JetBrainsMono-Medium.woff2
                            JetBrainsMono-Regular.woff2
                            rubik-latin.woff2
            resource/
                bun.lock
                package.json
                resource.cloudflare.ts
                resource.node.ts
                sst-env.d.ts
                tsconfig.json
        containers/
            README.md
            tsconfig.json
            base/
                Dockerfile
            bun-node/
                Dockerfile
            publish/
                Dockerfile
            rust/
                Dockerfile
            script/
                build.ts
            tauri-linux/
                Dockerfile
        desktop/
            .gitignore
            AGENTS.md
            electron-builder.config.ts
            electron.vite.config.ts
            package.json
            README.md
            sst-env.d.ts
            tsconfig.json
            icons/
                README.md
                beta/
                    icon.icns
                    icon.ico
                    android/
                        mipmap-anydpi-v26/
                            ic_launcher.xml
                        mipmap-hdpi/
                        mipmap-mdpi/
                        mipmap-xhdpi/
                        mipmap-xxhdpi/
                        mipmap-xxxhdpi/
                        values/
                            ic_launcher_background.xml
                    ios/
                dev/
                    icon.icns
                    icon.ico
                    android/
                        mipmap-anydpi-v26/
                            ic_launcher.xml
                        mipmap-hdpi/
                        mipmap-mdpi/
                        mipmap-xhdpi/
                        mipmap-xxhdpi/
                        mipmap-xxxhdpi/
                        values/
                            ic_launcher_background.xml
                    ios/
                prod/
                    icon.icns
                    icon.ico
                    android/
                        mipmap-anydpi-v26/
                            ic_launcher.xml
                        mipmap-hdpi/
                        mipmap-mdpi/
                        mipmap-xhdpi/
                        mipmap-xxhdpi/
                        mipmap-xxxhdpi/
                        values/
                            ic_launcher_background.xml
                    ios/
            resources/
                entitlements.plist
            scripts/
                copy-bundles.ts
                copy-icons.ts
                finalize-latest-json.ts
                finalize-latest-yml.ts
                prebuild.ts
                predev.ts
                prepare.ts
                utils.ts
            src/
                main/
                    apps.ts
                    constants.ts
                    env.d.ts
                    index.ts
                    ipc.ts
                    logging.ts
                    markdown.ts
                    menu.ts
                    migrate.ts
                    server.ts
                    shell-env.test.ts
                    shell-env.ts
                    store.ts
                    windows.ts
                preload/
                    index.ts
                    types.ts
                renderer/
                    cli.ts
                    env.d.ts
                    html.test.ts
                    index.html
                    index.tsx
                    loading.html
                    loading.tsx
                    styles.css
                    updater.ts
                    webview-zoom.ts
                    i18n/
                        ar.ts
                        br.ts
                        bs.ts
                        da.ts
                        de.ts
                        en.ts
                        es.ts
                        fr.ts
                        index.ts
                        ja.ts
                        ko.ts
                        no.ts
                        pl.ts
                        ru.ts
                        zh.ts
                        zht.ts
        enterprise/
            .gitignore
            package.json
            README.md
            sst-env.d.ts
            test-debug.ts
            tsconfig.json
            vite.config.ts
            public/
                favicon-v3.ico
                favicon.ico
                site.webmanifest
            script/
                scrap.ts
            src/
                app.css
                app.tsx
                custom-elements.d.ts
                entry-client.tsx
                entry-server.tsx
                global.d.ts
                core/
                    share.ts
                    storage.ts
                routes/
                    index.tsx
                    share.tsx
                    [...404].tsx
                    api/
                        [...path].ts
                    share/
                        [shareID].tsx
            test/
                core/
                    share.test.ts
                    storage.test.ts
        extensions/
            zed/
                extension.toml
                LICENSE
                icons/
        function/
            package.json
            sst-env.d.ts
            tsconfig.json
            src/
                api.ts
        identity/
        opencode/
            .gitignore
            AGENTS.md
            bunfig.toml
            Dockerfile
            drizzle.config.ts
            git
            package.json
            parsers-config.ts
            README.md
            sst-env.d.ts
            tsconfig.json
            bin/
                mimo
            migration/
                20260127222353_familiar_lady_ursula/
                    migration.sql
                    snapshot.json
                20260211171708_add_project_commands/
                    migration.sql
                    snapshot.json
                20260213144116_wakeful_the_professor/
                    migration.sql
                    snapshot.json
                20260225215848_workspace/
                    migration.sql
                    snapshot.json
                20260227213759_add_session_workspace_id/
                    migration.sql
                    snapshot.json
                20260228203230_blue_harpoon/
                    migration.sql
                    snapshot.json
                20260303231226_add_workspace_fields/
                    migration.sql
                    snapshot.json
                20260309230000_move_org_to_state/
                    migration.sql
                    snapshot.json
                20260312043431_session_message_cursor/
                    migration.sql
                    snapshot.json
                20260323234822_events/
                    migration.sql
                    snapshot.json
                20260410174513_workspace-name/
                    migration.sql
                    snapshot.json
                20260413175956_chief_energizer/
                    migration.sql
                    snapshot.json
                20260422160000_context_inheritance/
                    migration.sql
                20260422170000_task_registry/
                    migration.sql
                20260423145421_remove_session_entry/
                    migration.sql
                20260515000000_actor_rename/
                    migration.sql
                20260515010000_memory_fts/
                    migration.sql
                20260515020000_user_task/
                    migration.sql
                20260519000000_last_checkpoint_message_id/
                    migration.sql
                20260521000000_message_agent_id/
                    migration.sql
                20260521000100_actor_registry_v6/
                    migration.sql
                20260521010000_memory_fts_v6/
                    migration.sql
                20260521020000_memory_fts_triggers/
                    migration.sql
                20260526000000_agent_id_main/
                    migration.sql
                20260527000000_actor_lifecycle/
                    migration.sql
                20260527000100_inbox/
                    migration.sql
                20260529000000_task_todo_redesign/
                    migration.sql
                20260603000000_task_in_progress_owner/
                    migration.sql
                20260603000000_workflow_run/
                    migration.sql
                20260604000000_workflow_script_sha/
                    migration.sql
                20260608000000_claude_import/
                    migration.sql
                20260608010000_claude_import_message_ids/
                    migration.sql
                20260609000000_history_fts/
                    migration.sql
                20260609230000_workflow_agent_timeout/
                    migration.sql
            script/
                build-node.ts
                build.ts
                check-migrations.ts
                fix-node-pty.ts
                generate.ts
                postinstall.mjs
                publish.ts
                run-workspace-server
                schema.ts
                time.ts
                trace-imports.ts
                upgrade-opentui.ts
            src/
                audio.d.ts
                index.ts
                node.ts
                npmcli-config.d.ts
                sql.d.ts
                temporary.ts
                account/
                    account.sql.ts
                    account.ts
                    repo.ts
                    schema.ts
                    url.ts
                acp/
                    agent.ts
                    README.md
                    session.ts
                    types.ts
                actor/
                    actor.sql.ts
                    events.ts
                    index.ts
                    registry.ts
                    return-header.ts
                    schema.ts
                    spawn-ref.ts
                    spawn.ts
                    turn.ts
                    waiter.ts
                agent/
                    agent.ts
                    config.ts
                    generate.txt
                    prompt/
                        checkpoint-writer.txt
                        compaction.txt
                        distill.txt
                        dream.txt
                        explore.txt
                        summary.txt
                        title.txt
                auth/
                    index.ts
                bus/
                    bus-event.ts
                    global.ts
                    index.ts
                cli/
                    bootstrap.ts
                    error.ts
                    heap.ts
                    i18n.ts
                    logo.ts
                    network.ts
                    ui.ts
                    upgrade.ts
                    cmd/
                        account.ts
                        acp.ts
                        agent.ts
                        cmd.ts
                        db.ts
                        export.ts
                        generate.ts
                        github.ts
                        import.ts
                        mcp.ts
                        models.ts
                        plug.ts
                        pr.ts
                        providers.ts
                        run-completion.ts
                        run.ts
                        serve.ts
                        session.ts
                        stats.ts
                        uninstall.ts
                        upgrade.ts
                        web.ts
                        debug/
                            agent.ts
                            config.ts
                            file.ts
                            index.ts
                            lsp.ts
                            ripgrep.ts
                            scrap.ts
                            skill.ts
                            snapshot.ts
                        tui/
                            app.tsx
                            attach.ts
                            event.ts
                            layer.ts
                            thread.ts
                            win32.ts
                            worker.ts
                            asset/
                                charge.wav
                                pulse-a.wav
                                pulse-b.wav
                                pulse-c.wav
                                ten_vad.wasm
                                TEN_VAD_LICENSE
                                ten_vad_loader.js
                            component/
                                background-image.tsx
                                bg-pulse.tsx
                                border.tsx
                                dialog-agent.tsx
                                dialog-command.tsx
                                dialog-console-org.tsx
                                dialog-go-upsell.tsx
                                dialog-image-list.tsx
                                dialog-logo-design.tsx
                                dialog-mcp.tsx
                                dialog-mimo-login.tsx
                                dialog-model.tsx
                                dialog-provider.tsx
                                dialog-session-delete-failed.tsx
                                dialog-session-list.tsx
                                dialog-session-rename.tsx
                                dialog-skill.tsx
                                dialog-stash.tsx
                                dialog-status.tsx
                                dialog-tag.tsx
                                dialog-theme-list.tsx
                                dialog-variant.tsx
                                dialog-workflows.tsx
                                dialog-workspace-create.tsx
                                dialog-workspace-unavailable.tsx
                                dialog-worktree.tsx
                                error-component.tsx
                                logo.tsx
                                plugin-route-missing.tsx
                                spinner.tsx
                                starry-background.tsx
                                startup-loading.tsx
                                task-item.tsx
                                textarea-keybindings.ts
                                todo-item.tsx
                                prompt/
                                    autocomplete.tsx
                                    cwd.ts
                                    frecency.tsx
                                    history.tsx
                                    index.tsx
                                    part.ts
                                    stash.tsx
                            config/
                                cwd.ts
                                tui-migrate.ts
                                tui-schema.ts
                                tui.ts
                            context/
                                args.tsx
                                directory.ts
                                event.ts
                                exit.tsx
                                helper.tsx
                                keybind.tsx
                                kv.tsx
                                language.tsx
                                local.tsx
                                plugin-keybinds.ts
                                project.tsx
                                prompt.tsx
                                route.tsx
                                sdk.tsx
                                sync.tsx
                                theme.tsx
                                thinking.ts
                                tui-config.tsx
                                theme/
                                    aura.json
                                    ayu.json
                                    carbonfox.json
                                    catppuccin-frappe.json
                                    catppuccin-macchiato.json
                                    catppuccin.json
                                    cobalt2.json
                                    cursor.json
                                    dracula.json
                                    everforest.json
                                    flexoki.json
                                    github.json
                                    gruvbox.json
                                    kanagawa.json
                                    lucent-orng.json
                                    material.json
                                    matrix.json
                                    mercury.json
                                    mimocode.json
                                    monokai.json
                                    nightowl.json
                                    nord.json
                                    one-dark.json
                                    orng.json
                                    osaka-jade.json
                                    palenight.json
                                    rosepine.json
                                    solarized.json
                                    synthwave84.json
                                    tokyonight.json
                                    vercel.json
                                    vesper.json
                                    zenburn.json
                            feature-plugins/
                                home/
                                    footer.tsx
                                    tips-view.tsx
                                    tips.tsx
                                sidebar/
                                    context.tsx
                                    cwd.tsx
                                    files.tsx
                                    footer.tsx
                                    goal.tsx
                                    instructions.tsx
                                    lsp.tsx
                                    mcp.tsx
                                    task.tsx
                                    todo.tsx
                                    tps.ts
                                system/
                                    plugins.tsx
                            i18n/
                                en.ts
                                es.ts
                                fr.ts
                                ja.ts
                                locales.ts
                                ru.ts
                                zh.ts
                                zht.ts
                            plugin/
                                api.tsx
                                index.ts
                                internal.ts
                                runtime.ts
                                slots.tsx
                            routes/
                                home.tsx
                                session/
                                    dialog-fork-from-timeline.tsx
                                    dialog-message.tsx
                                    dialog-subagent.tsx
                                    dialog-timeline.tsx
                                    footer.tsx
                                    index.tsx
                                    permission.tsx
                                    question.tsx
                                    sidebar.tsx
                                    subagent-footer.tsx
                            ui/
                                dialog-alert.tsx
                                dialog-confirm.tsx
                                dialog-export-options.tsx
                                dialog-help.tsx
                                dialog-prompt.tsx
                                dialog-select.tsx
                                dialog.tsx
                                link.tsx
                                spinner.ts
                                toast.tsx
                            util/
                                clipboard.ts
                                editor.ts
                                image-protocol.ts
                                index.ts
                                model.ts
                                provider-origin.ts
                                revert-diff.ts
                                scroll.ts
                                selection.ts
                                signal.ts
                                sound.ts
                                system-locale.ts
                                terminal.ts
                                transcript.ts
                                vad.ts
                                voice.ts
                    effect/
                        prompt.ts
                command/
                    index.ts
                    template/
                        initialize.txt
                        review.txt
                config/
                    agent.ts
                    command.ts
                    config.ts
                    console-state.ts
                    entry-name.ts
                    error.ts
                    formatter.ts
                    history.ts
                    index.ts
                    keybinds.ts
                    layout.ts
                    lsp.ts
                    managed.ts
                    markdown.ts
                    mcp.ts
                    model-id.ts
                    parse.ts
                    paths.ts
                    permission.ts
                    plugin.ts
                    provider.ts
                    server.ts
                    skills.ts
                    variable.ts
                control-plane/
                    schema.ts
                    sse.ts
                    types.ts
                    util.ts
                    workspace-context.ts
                    workspace.sql.ts
                    workspace.ts
                    adaptors/
                        index.ts
                        worktree.ts
                    dev/
                        debug-workspace-plugin.ts
                effect/
                    app-runtime.ts
                    bootstrap-runtime.ts
                    bridge.ts
                    cross-spawn-spawner.ts
                    index.ts
                    instance-ref.ts
                    instance-registry.ts
                    instance-state.ts
                    logger.ts
                    memo-map.ts
                    observability.ts
                    run-service.ts
                    runner.ts
                    runtime.ts
                env/
                    index.ts
                file/
                    ignore.ts
                    index.ts
                    protected.ts
                    ripgrep.ts
                    watcher.ts
                flag/
                    flag.ts
                format/
                    formatter.ts
                    index.ts
                git/
                    index.ts
                global/
                    index.ts
                history/
                    backfill.ts
                    extract.ts
                    fts-query.ts
                    fts.sql.ts
                    index.ts
                    resolve.ts
                    service.ts
                    writer.ts
                id/
                    id.ts
                ide/
                    index.ts
                inbox/
                    inbox-ref.ts
                    inbox.sql.ts
                    inbox.ts
                    index.ts
                    render.ts
                installation/
                    index.ts
                    version.ts
                lsp/
                    client.ts
                    diagnostic.ts
                    index.ts
                    language.ts
                    launch.ts
                    lsp.ts
                    server.ts
                mcp/
                    auth.ts
                    index.ts
                    oauth-callback.ts
                    oauth-provider.ts
                memory/
                    fts-query.ts
                    fts.sql.ts
                    index.ts
                    paths.ts
                    reconcile.ts
                    service.ts
                metrics/
                    client.ts
                    event.ts
                    index.ts
                    installation.ts
                    subscriber.ts
                    util.ts
                npm/
                    config.ts
                    index.ts
                patch/
                    index.ts
                permission/
                    arity.ts
                    evaluate.ts
                    index.ts
                    schema.ts
                plugin/
                    checkpoint-splitover.ts
                    cloudflare.ts
                    codex.ts
                    index.ts
                    install.ts
                    loader.ts
                    matcher.ts
                    meta.ts
                    mimo-free.ts
                    mimo.ts
                    shared.ts
                    subagent-progress-checker.ts
                    github-copilot/
                        copilot.ts
                        models.ts
                project/
                    bootstrap.ts
                    index.ts
                    instance.ts
                    project-id.ts
                    project.sql.ts
                    project.ts
                    schema.ts
                    vcs.ts
                provider/
                    auth.ts
                    error.ts
                    index.ts
                    models.ts
                    provider.ts
                    schema.ts
                    transform.ts
                    sdk/
                        copilot/
                            copilot-provider.ts
                            index.ts
                            openai-compatible-error.ts
                            README.md
                            chat/
                                convert-to-openai-compatible-chat-messages.ts
                                get-response-metadata.ts
                                map-openai-compatible-finish-reason.ts
                                openai-compatible-api-types.ts
                                openai-compatible-chat-language-model.ts
                                openai-compatible-chat-options.ts
                                openai-compatible-metadata-extractor.ts
                                openai-compatible-prepare-tools.ts
                            responses/
                                convert-to-openai-responses-input.ts
                                map-openai-responses-finish-reason.ts
                                openai-config.ts
                                openai-error.ts
                                openai-responses-api-types.ts
                                openai-responses-language-model.ts
                                openai-responses-prepare-tools.ts
                                openai-responses-settings.ts
                                tool/
                                    code-interpreter.ts
                                    file-search.ts
                                    image-generation.ts
                                    local-shell.ts
                                    web-search-preview.ts
                                    web-search.ts
                pty/
                    index.ts
                    pty.bun.ts
                    pty.node.ts
                    pty.ts
                    schema.ts
                question/
                    index.ts
                    schema.ts
                server/
                    adapter.bun.ts
                    adapter.node.ts
                    adapter.ts
                    error.ts
                    event.ts
                    fence.ts
                    mdns.ts
                    middleware.ts
                    projectors.ts
                    proxy.ts
                    server.ts
                    workspace.ts
                    routes/
                        global.ts
                        ui.ts
                        control/
                            index.ts
                            workspace.ts
                        instance/
                            bash-interactive.ts
                            config.ts
                            event.ts
                            experimental.ts
                            file.ts
                            index.ts
                            mcp.ts
                            middleware.ts
                            permission.ts
                            project.ts
                            provider.ts
                            pty.ts
                            question.ts
                            session.ts
                            sync.ts
                            trace.ts
                            tui.ts
                            workflows.ts
                            httpapi/
                                config.ts
                                permission.ts
                                project.ts
                                provider.ts
                                question.ts
                                server.ts
                session/
                    auto-dream.ts
                    boundary.ts
                    budgeted-read.ts
                    checkpoint-align.ts
                    checkpoint-context.ts
                    checkpoint-paths.ts
                    checkpoint-progress-reconcile.ts
                    checkpoint-retry.ts
                    checkpoint-templates.ts
                    checkpoint-validator.ts
                    checkpoint.ts
                    classify.ts
                    claude-import.sql.ts
                    claude-import.ts
                    compaction.ts
                    goal.ts
                    index.ts
                    instruction.ts
                    last-message-info.ts
                    llm-request-prefix.ts
                    llm.ts
                    max-mode.ts
                    message-v2.ts
                    message.ts
                    overflow.ts
                    prefix-capture-ref.ts
                    processor.ts
                    projectors.ts
                    prompt.ts
                    prune.ts
                    retry.ts
                    revert.ts
                    run-state.ts
                    schema.ts
                    session.sql.ts
                    session.ts
                    status.ts
                    summary.ts
                    system.ts
                    todo.ts
                    prompt/
                        anthropic.txt
                        beast.txt
                        build-switch.txt
                        codex.txt
                        compose.txt
                        copilot-gpt-5.txt
                        default.txt
                        gemini.txt
                        gpt.txt
                        kimi.txt
                        max-steps.txt
                        trinity.txt
                share/
                    index.ts
                    session.ts
                    share-next.ts
                    share.sql.ts
                shell/
                    shell.ts
                skill/
                    discovery.ts
                    index.ts
                    compose/
                        bundle.macro.ts
                        extract.ts
                        LICENSE-karpathy
                        LICENSE-superpowers
                        .bundle/
                            ask/
                                SKILL.md
                            brainstorm/
                                SKILL.md
                                spec-document-reviewer-prompt.md
                                visual-companion.md
                                scripts/
                                    frame-template.html
                                    helper.js
                                    server.cjs
                                    start-server.sh
                                    stop-server.sh
                            debug/
                                condition-based-waiting-example.ts
                                condition-based-waiting.md
                                CREATION-LOG.md
                                defense-in-depth.md
                                find-polluter.sh
                                root-cause-tracing.md
                                SKILL.md
                                test-academic.md
                                test-pressure-1.md
                                test-pressure-2.md
                                test-pressure-3.md
                            execute/
                                SKILL.md
                            feedback/
                                SKILL.md
                            merge/
                                SKILL.md
                            new-skill/
                                anthropic-best-practices.md
                                graphviz-conventions.dot
                                persuasion-principles.md
                                render-graphs.js
                                SKILL.md
                                testing-skills-with-subagents.md
                                examples/
                                    CLAUDE_MD_TESTING.md
                            parallel/
                                SKILL.md
                            plan/
                                plan-document-reviewer-prompt.md
                                SKILL.md
                            report/
                                SKILL.md
                            review/
                                code-reviewer.md
                                SKILL.md
                            subagent/
                                code-quality-reviewer-prompt.md
                                implementer-prompt.md
                                SKILL.md
                                spec-reviewer-prompt.md
                            tdd/
                                SKILL.md
                                testing-anti-patterns.md
                            verify/
                                SKILL.md
                            worktree/
                                SKILL.md
                snapshot/
                    index.ts
                storage/
                    db.bun.ts
                    db.node.ts
                    db.ts
                    index.ts
                    json-migration.ts
                    schema.sql.ts
                    schema.ts
                    storage.ts
                sync/
                    event.sql.ts
                    index.ts
                    README.md
                    schema.ts
                task/
                    events.ts
                    gate-state.ts
                    gate.ts
                    index.ts
                    registry.ts
                    schema.ts
                    task.sql.ts
                team/
                    events.ts
                    index.ts
                    schema.ts
                tool/
                    actor.shell.txt
                    actor.ts
                    actor.txt
                    apply_patch.ts
                    apply_patch.txt
                    bash-interactive.ts
                    bash.ts
                    bash.txt
                    change-directory.ts
                    codesearch.ts
                    codesearch.txt
                    edit.ts
                    edit.txt
                    external-directory.ts
                    glob.ts
                    glob.txt
                    grep.ts
                    grep.txt
                    history.ts
                    history.txt
                    index.ts
                    invalid.ts
                    invocation-style.ts
                    lsp.ts
                    lsp.txt
                    mcp-exa.ts
                    memory-path-guard.ts
                    memory.ts
                    memory.txt
                    multiedit.ts
                    multiedit.txt
                    plan-enter.txt
                    plan-exit.txt
                    plan.ts
                    question.ts
                    question.txt
                    read.ts
                    read.txt
                    registry.ts
                    schema.ts
                    session-cwd.ts
                    shell-tokenize.ts
                    shell-wrap.ts
                    skill.ts
                    skill.txt
                    task.shell.txt
                    task.ts
                    task.txt
                    tool.ts
                    truncate.ts
                    truncation-dir.ts
                    webfetch.ts
                    webfetch.txt
                    workflow.ts
                    workflow.txt
                    write.ts
                    write.txt
                    websearch/
                        index.ts
                        mimo.ts
                        websearch.txt
                util/
                    abort.ts
                    archive.ts
                    color.ts
                    data-url.ts
                    defer.ts
                    effect-http-client.ts
                    effect-zod.ts
                    error.ts
                    filesystem.ts
                    fn.ts
                    format.ts
                    iife.ts
                    index.ts
                    keybind.ts
                    lazy.ts
                    local-context.ts
                    locale.ts
                    lock.ts
                    log.ts
                    media.ts
                    mimo-process.ts
                    network.ts
                    process.ts
                    queue.ts
                    record.ts
                    rpc.ts
                    schema.ts
                    scrap.ts
                    signal.ts
                    timeout.ts
                    token.ts
                    update-schema.ts
                    which.ts
                    wildcard.ts
                workflow/
                    builtin.ts
                    events.ts
                    meta.ts
                    persistence.ts
                    resolve.ts
                    runtime-ref.ts
                    runtime.ts
                    sandbox.ts
                    workflow.sql.ts
                    workspace.ts
                    builtin/
                        deep-research.js
                worktree/
                    index.ts
            test/
                AGENTS.md
                keybind.test.ts
                npm.test.ts
                permission-task.test.ts
                preload.ts
                account/
                    repo.test.ts
                    service.test.ts
                acp/
                    agent-interface.test.ts
                    event-subscription.test.ts
                actor/
                    cancel-cascade.test.ts
                    no-completion-listener.test.ts
                    poststop-progress-write-permission.repro.test.ts
                    registry-render.test.ts
                    registry-status.test.ts
                    registry.test.ts
                    return-header.test.ts
                    spawn-lifecycle.test.ts
                    spawn-no-deadlock.test.ts
                    spawn-notification.test.ts
                    spawn-task-autostart.test.ts
                    spawn.test.ts
                    status-event-payload.test.ts
                    terminology.test.ts
                    turn.test.ts
                    waiter.test.ts
                agent/
                    agent.test.ts
                    allowlist.test.ts
                auth/
                    auth.test.ts
                bus/
                    bus-effect.test.ts
                    bus-integration.test.ts
                    bus.test.ts
                cli/
                    account.test.ts
                    error.test.ts
                    github-action.test.ts
                    github-remote.test.ts
                    import.test.ts
                    plugin-auth-picker.test.ts
                    run-completion.test.ts
                    cmd/
                        tui/
                            prompt-part.test.ts
                    tui/
                        keybind-plugin.test.ts
                        plugin-add.test.ts
                        plugin-install.test.ts
                        plugin-lifecycle.test.ts
                        plugin-loader-entrypoint.test.ts
                        plugin-loader-pure.test.ts
                        plugin-loader.test.ts
                        plugin-toggle.test.ts
                        revert-diff.test.ts
                        route-agent-id.test.ts
                        sidebar-tps.test.ts
                        slot-replace.test.tsx
                        sync-bucket.test.ts
                        theme-store.test.ts
                        thread.test.ts
                        transcript.test.ts
                        use-event.test.tsx
                        voice.test.ts
                command/
                    deep-research-command.test.ts
                config/
                    agent-color.test.ts
                    checkpoint-fork.test.ts
                    config.test.ts
                    lsp.test.ts
                    markdown.test.ts
                    plugin.test.ts
                    tui.test.ts
                    fixtures/
                        empty-frontmatter.md
                        frontmatter.md
                        markdown-header.md
                        no-frontmatter.md
                        weird-model-id.md
                control-plane/
                    adaptors.test.ts
                    sse.test.ts
                effect/
                    app-runtime-logger.test.ts
                    cross-spawn-spawner.test.ts
                    instance-state.test.ts
                    observability.test.ts
                    run-service.test.ts
                    runner-warn-log.test.ts
                    runner.test.ts
                fake/
                    provider.ts
                file/
                    fsmonitor.test.ts
                    ignore.test.ts
                    index.test.ts
                    path-traversal.test.ts
                    ripgrep.test.ts
                    watcher.test.ts
                filesystem/
                    filesystem.test.ts
                fixture/
                    db.ts
                    fixture.test.ts
                    fixture.ts
                    flock-worker.ts
                    plug-worker.ts
                    plugin-meta-worker.ts
                    tui-plugin.ts
                    tui-runtime.ts
                    lsp/
                        fake-lsp-server.js
                    skills/
                        index.json
                        agents-sdk/
                            SKILL.md
                            references/
                                callable.md
                        cloudflare/
                            SKILL.md
                format/
                    format.test.ts
                git/
                    git.test.ts
                global/
                    mimocode-home.test.ts
                    fixture/
                        global-paths-worker.ts
                history/
                    backfill.test.ts
                    extract.test.ts
                    fts-query.test.ts
                    resolve.test.ts
                    service.test.ts
                    writer.test.ts
                ide/
                    ide.test.ts
                inbox/
                    drain-in-loop.test.ts
                    fork-agent-compat.test.ts
                    gc-on-init.test.ts
                    send-no-block.test.ts
                    sender-cancel-independence.test.ts
                    wake-matrix.test.ts
                installation/
                    installation.test.ts
                lib/
                    effect.ts
                    filesystem.ts
                    llm-server.ts
                    scripted-llm-server.ts
                lsp/
                    client.test.ts
                    index.test.ts
                    launch.test.ts
                    lifecycle.test.ts
                mcp/
                    headers.test.ts
                    lifecycle.test.ts
                    oauth-auto-connect.test.ts
                    oauth-browser.test.ts
                    oauth-callback.test.ts
                memory/
                    abort-leak-webfetch.ts
                    abort-leak.test.ts
                    cc-frontmatter.test.ts
                    cc-paths.test.ts
                    cc-reconcile.test.ts
                    cc-search.test.ts
                    fts-query.test.ts
                    fts-rowid-stability.test.ts
                    paths.test.ts
                    reconcile.test.ts
                    service.test.ts
                patch/
                    patch.test.ts
                permission/
                    abort.test.ts
                    arity.test.ts
                    disabled.test.ts
                    next.test.ts
                    non-interactive.test.ts
                plugin/
                    actor-hooks.test.ts
                    auth-override.test.ts
                    checkpoint-splitover.test.ts
                    cloudflare.test.ts
                    codex.test.ts
                    github-copilot-models.test.ts
                    install-concurrency.test.ts
                    install.test.ts
                    loader-shared.test.ts
                    matcher.test.ts
                    meta.test.ts
                    mimo.test.ts
                    shared.test.ts
                    subagent-progress-checker.test.ts
                    trigger.test.ts
                    workspace-adaptor.test.ts
                project/
                    migrate-global.test.ts
                    project-id.test.ts
                    project.test.ts
                    vcs.test.ts
                    worktree-remove.test.ts
                    worktree.test.ts
                provider/
                    amazon-bedrock.test.ts
                    error.test.ts
                    gitlab-duo.test.ts
                    model-groups.test.ts
                    provider-chunk-timeout.test.ts
                    provider.test.ts
                    transform.test.ts
                    copilot/
                        convert-to-copilot-messages.test.ts
                        copilot-chat-model.test.ts
                pty/
                    pty-output-isolation.test.ts
                    pty-session.test.ts
                    pty-shell.test.ts
                question/
                    question.test.ts
                server/
                    global-session-list.test.ts
                    project-init-git.test.ts
                    session-actions.test.ts
                    session-list.test.ts
                    session-messages.test.ts
                    session-prompt-busy.test.ts
                    session-select.test.ts
                    session-task-route.test.ts
                    summarize-route-main-slice.test.ts
                    trace-attributes.test.ts
                    workflows-route.test.ts
                session/
                    bootstrap-skip-system.test.ts
                    boundary.test.ts
                    budgeted-read.test.ts
                    checkpoint-align.test.ts
                    checkpoint-boundary.test.ts
                    checkpoint-child-session.test.ts
                    checkpoint-context.test.ts
                    checkpoint-drain.test.ts
                    checkpoint-extract-titles.test.ts
                    checkpoint-fork-mode.test.ts
                    checkpoint-main-slice.test.ts
                    checkpoint-paths.test.ts
                    checkpoint-permission.test.ts
                    checkpoint-progress-reconcile.test.ts
                    checkpoint-rebuild-unify.test.ts
                    checkpoint-rebuild-v3.test.ts
                    checkpoint-render-verify.test.ts
                    checkpoint-retry.test.ts
                    checkpoint-splitover-integration.test.ts
                    checkpoint-templates.test.ts
                    checkpoint-thresholds.test.ts
                    checkpoint-validator.test.ts
                    classify-integration.test.ts
                    classify.test.ts
                    compaction-agent-scope.test.ts
                    context-inheritance.test.ts
                    fork-prefix-invariant.test.ts
                    goal.test.ts
                    instruction.test.ts
                    invalid-output-continuation.test.ts
                    last-message-info.test.ts
                    length-tool-safety.test.ts
                    llm-request-prefix.test.ts
                    llm-retry.test.ts
                    llm-system-prompt.test.ts
                    llm.test.ts
                    main-lifecycle.test.ts
                    main-runloop-history-invariant.test.ts
                    max-mode-econnreset.test.ts
                    max-mode.test.ts
                    message-v2-filter.test.ts
                    message-v2.test.ts
                    messages-default-main.test.ts
                    messages-pagination.test.ts
                    overflow.test.ts
                    processor-effect.test.ts
                    prompt-effect.test.ts
                    prompt-rebuild-loop.test.ts
                    prompt-rebuild-reset.test.ts
                    prompt-sweep.test.ts
                    prompt-task-gate.test.ts
                    prompt.test.ts
                    prune-main-slice.test.ts
                    prune-skip-system.test.ts
                    prune.test.ts
                    rebuild-microcompact.test.ts
                    recall-reminder.test.ts
                    retry.test.ts
                    revert-compact.test.ts
                    run-state-tuple-key.test.ts
                    session-create-registers-main.test.ts
                    session.test.ts
                    snapshot-tool-race.test.ts
                    structured-output-integration.test.ts
                    structured-output-retry.test.ts
                    structured-output.test.ts
                    summary-main-slice.test.ts
                    system.test.ts
                share/
                    share-next.test.ts
                shell/
                    shell.test.ts
                skill/
                    compose-review.test.ts
                    discovery.test.ts
                    skill.test.ts
                snapshot/
                    snapshot.test.ts
                storage/
                    db.test.ts
                    json-migration.test.ts
                    storage.test.ts
                sync/
                    index.test.ts
                task/
                    gate-state.test.ts
                    gate.test.ts
                    registry.test.ts
                    state-machine.test.ts
                team/
                    migrate-to-inbox.test.ts
                    team.test.ts
                tool/
                    actor-cancel.test.ts
                    actor-recover.test.ts
                    actor-send.test.ts
                    actor-status.test.ts
                    actor-wait.test.ts
                    actor.shell.test.ts
                    actor.test.ts
                    apply_patch.test.ts
                    bash.test.ts
                    describe-workflow.test.ts
                    edit.test.ts
                    external-directory.test.ts
                    glob.test.ts
                    grep.test.ts
                    history.test.ts
                    invocation-style.test.ts
                    memory-edit-ask-skip.test.ts
                    memory-path-guard.test.ts
                    memory.test.ts
                    question.test.ts
                    read.test.ts
                    registry-invocation-style.test.ts
                    registry.test.ts
                    shell-tokenize.test.ts
                    shell-wrap-missing-script.test.ts
                    shell-wrap.test.ts
                    skill.test.ts
                    task-recover.test.ts
                    task.shell.test.ts
                    task.test.ts
                    tool-def-shell-shape.test.ts
                    tool-define.test.ts
                    truncation.test.ts
                    webfetch.test.ts
                    whitelist.test.ts
                    write.test.ts
                    fixtures/
                        models-api.json
                    __snapshots__/
                        tool.test.ts.snap
                util/
                    data-url.test.ts
                    effect-zod.test.ts
                    error.test.ts
                    filesystem.test.ts
                    format.test.ts
                    glob.test.ts
                    iife.test.ts
                    lazy.test.ts
                    lock.test.ts
                    log.test.ts
                    module.test.ts
                    process.test.ts
                    timeout.test.ts
                    which.test.ts
                    wildcard.test.ts
                workflow/
                    builtin.test.ts
                    deep-research-cluster.test.ts
                    lib.ts
                    meta.test.ts
                    model-routing.test.ts
                    persistence.test.ts
                    resolve.test.ts
                    runtime-nested.test.ts
                    runtime-worktree.test.ts
                    runtime.test.ts
                    sandbox.test.ts
                    tool.test.ts
                    verify-wow.test.ts
                    workspace.test.ts
                workspace/
                    workspace-restore.test.ts
                worktree/
                    index.test.ts
        plugin/
            .gitignore
            package.json
            sst-env.d.ts
            tsconfig.json
            script/
                publish.ts
            src/
                example-workspace.ts
                example.ts
                index.ts
                shell.ts
                tool.ts
                tui.ts
        script/
            package.json
            sst-env.d.ts
            tsconfig.json
            src/
                index.ts
        sdk/
            .gitignore
            openapi.json
            js/
                package.json
                sst-env.d.ts
                tsconfig.json
                example/
                    example.ts
                script/
                    build.ts
                    publish.ts
                src/
                    client.ts
                    index.ts
                    process.ts
                    server.ts
                    gen/
                        client.gen.ts
                        sdk.gen.ts
                        types.gen.ts
                        client/
                            client.gen.ts
                            index.ts
                            types.gen.ts
                            utils.gen.ts
                        core/
                            auth.gen.ts
                            bodySerializer.gen.ts
                            params.gen.ts
                            pathSerializer.gen.ts
                            queryKeySerializer.gen.ts
                            serverSentEvents.gen.ts
                            types.gen.ts
                            utils.gen.ts
                    v2/
                        client.ts
                        data.ts
                        index.ts
                        server.ts
                        gen/
                            client.gen.ts
                            sdk.gen.ts
                            types.gen.ts
                            client/
                                client.gen.ts
                                index.ts
                                types.gen.ts
                                utils.gen.ts
                            core/
                                auth.gen.ts
                                bodySerializer.gen.ts
                                params.gen.ts
                                pathSerializer.gen.ts
                                queryKeySerializer.gen.ts
                                serverSentEvents.gen.ts
                                types.gen.ts
                                utils.gen.ts
        shared/
            package.json
            sst-env.d.ts
            tsconfig.json
            src/
                filesystem.ts
                global.ts
                types.d.ts
                util/
                    array.ts
                    binary.ts
                    effect-flock.ts
                    encode.ts
                    error.ts
                    flock.ts
                    fn.ts
                    glob.ts
                    hash.ts
                    identifier.ts
                    iife.ts
                    lazy.ts
                    module.ts
                    path.ts
                    retry.ts
                    slug.ts
            test/
                global.test.ts
                filesystem/
                    filesystem.test.ts
                fixture/
                    effect-flock-worker.ts
                    flock-worker.ts
                lib/
                    effect.ts
                util/
                    effect-flock.test.ts
                    flock.test.ts
        slack/
            .env.example
            .gitignore
            package.json
            README.md
            sst-env.d.ts
            tsconfig.json
            src/
                index.ts
        storybook/
            .gitignore
            debug-storybook.log
            package.json
            sst-env.d.ts
            tsconfig.json
            .storybook/
                main.ts
                manager.ts
                playground-css-plugin.ts
                preview.tsx
                theme-tool.ts
                mocks/
                    solid-router.tsx
                    app/
                        components/
                            dialog-select-model-unpaid.tsx
                            dialog-select-model.tsx
                        context/
                            command.ts
                            comments.ts
                            file.ts
                            global-sync.ts
                            language.ts
                            layout.ts
                            local.ts
                            permission.ts
                            platform.ts
                            prompt.ts
                            sdk.ts
                            sync.ts
                        hooks/
                            use-providers.ts
        ui/
            .gitignore
            package.json
            sst-env.d.ts
            tsconfig.json
            vite.config.ts
            script/
                colors.txt
                tailwind.ts
            src/
                custom-elements.d.ts
                assets/
                    audio/
                        alert-01.aac
                        alert-02.aac
                        alert-03.aac
                        alert-04.aac
                        alert-05.aac
                        alert-06.aac
                        alert-07.aac
                        alert-08.aac
                        alert-09.aac
                        alert-10.aac
                        bip-bop-01.aac
                        bip-bop-02.aac
                        bip-bop-03.aac
                        bip-bop-04.aac
                        bip-bop-05.aac
                        bip-bop-06.aac
                        bip-bop-07.aac
                        bip-bop-08.aac
                        bip-bop-09.aac
                        bip-bop-10.aac
                        nope-01.aac
                        nope-02.aac
                        nope-03.aac
                        nope-04.aac
                        nope-05.aac
                        nope-06.aac
                        nope-07.aac
                        nope-08.aac
                        nope-09.aac
                        nope-10.aac
                        nope-11.aac
                        nope-12.aac
                        staplebops-01.aac
                        staplebops-02.aac
                        staplebops-03.aac
                        staplebops-04.aac
                        staplebops-05.aac
                        staplebops-06.aac
                        staplebops-07.aac
                        yup-01.aac
                        yup-02.aac
                        yup-03.aac
                        yup-04.aac
                        yup-05.aac
                        yup-06.aac
                    favicon/
                        favicon-v3.ico
                        favicon.ico
                        site.webmanifest
                    icons/
                        app/
                        file-types/
                        provider/
                    images/
                components/
                    accordion.css
                    accordion.stories.tsx
                    accordion.tsx
                    animated-number.css
                    animated-number.tsx
                    app-icon.css
                    app-icon.stories.tsx
                    app-icon.tsx
                    apply-patch-file.test.ts
                    apply-patch-file.ts
                    avatar.css
                    avatar.stories.tsx
                    avatar.tsx
                    basic-tool.css
                    basic-tool.stories.tsx
                    basic-tool.tsx
                    button.css
                    button.stories.tsx
                    button.tsx
                    card.css
                    card.stories.tsx
                    card.tsx
                    checkbox.css
                    checkbox.stories.tsx
                    checkbox.tsx
                    collapsible.css
                    collapsible.stories.tsx
                    collapsible.tsx
                    context-menu.css
                    context-menu.stories.tsx
                    context-menu.tsx
                    dialog.css
                    dialog.stories.tsx
                    dialog.tsx
                    diff-changes.css
                    diff-changes.stories.tsx
                    diff-changes.tsx
                    dock-prompt.stories.tsx
                    dock-prompt.tsx
                    dock-surface.css
                    dock-surface.tsx
                    dropdown-menu.css
                    dropdown-menu.stories.tsx
                    dropdown-menu.tsx
                    favicon.stories.tsx
                    favicon.tsx
                    file-icon.css
                    file-icon.stories.tsx
                    file-icon.tsx
                    file-media.tsx
                    file-search.tsx
                    file-ssr.tsx
                    file.css
                    file.tsx
                    font.stories.tsx
                    font.tsx
                    hover-card.css
                    hover-card.stories.tsx
                    hover-card.tsx
                    icon-button.css
                    icon-button.stories.tsx
                    icon-button.tsx
                    icon.css
                    icon.stories.tsx
                    icon.tsx
                    image-preview.css
                    image-preview.stories.tsx
                    image-preview.tsx
                    inline-input.css
                    inline-input.stories.tsx
                    inline-input.tsx
                    keybind.css
                    keybind.stories.tsx
                    keybind.tsx
                    line-comment-annotations.tsx
                    line-comment-styles.ts
                    line-comment.stories.tsx
                    line-comment.tsx
                    list.css
                    list.stories.tsx
                    list.tsx
                    logo.css
                    logo.stories.tsx
                    logo.tsx
                    markdown-stream.test.ts
                    markdown-stream.ts
                    markdown.css
                    markdown.stories.tsx
                    markdown.tsx
                    message-file.test.ts
                    message-file.ts
                    message-nav.css
                    message-nav.stories.tsx
                    message-nav.tsx
                    message-part.css
                    message-part.stories.tsx
                    message-part.tsx
                    motion-spring.tsx
                    popover.css
                    popover.stories.tsx
                    popover.tsx
                    progress-circle.css
                    progress-circle.stories.tsx
                    progress-circle.tsx
                    progress.css
                    progress.stories.tsx
                    progress.tsx
                    provider-icon.css
                    provider-icon.stories.tsx
                    provider-icon.tsx
                    radio-group.css
                    radio-group.stories.tsx
                    radio-group.tsx
                    resize-handle.css
                    resize-handle.stories.tsx
                    resize-handle.tsx
                    scroll-view.css
                    scroll-view.test.ts
                    scroll-view.tsx
                    select.css
                    select.stories.tsx
                    select.tsx
                    session-diff.test.ts
                    session-diff.ts
                    session-retry.tsx
                    session-review.css
                    session-review.stories.tsx
                    session-review.tsx
                    session-turn.css
                    session-turn.stories.tsx
                    session-turn.tsx
                    shell-submessage-motion.stories.tsx
                    shell-submessage.css
                    spinner.css
                    spinner.stories.tsx
                    spinner.tsx
                    sticky-accordion-header.css
                    sticky-accordion-header.stories.tsx
                    sticky-accordion-header.tsx
                    switch.css
                    switch.stories.tsx
                    switch.tsx
                    tabs.css
                    tabs.stories.tsx
                    tabs.tsx
                    tag.css
                    tag.stories.tsx
                    tag.tsx
                    text-field.css
                    text-field.stories.tsx
                    text-field.tsx
                    text-reveal.css
                    text-reveal.stories.tsx
                    text-reveal.tsx
                    text-shimmer.css
                    text-shimmer.stories.tsx
                    text-shimmer.tsx
                    text-strikethrough.css
                    text-strikethrough.stories.tsx
                    text-strikethrough.tsx
                    thinking-heading.stories.tsx
                    timeline-playground.stories.tsx
                    toast.css
                    toast.stories.tsx
                    toast.tsx
                    todo-panel-motion.stories.tsx
                    tool-count-label.css
                    tool-count-label.tsx
                    tool-count-summary.css
                    tool-count-summary.stories.tsx
                    tool-count-summary.tsx
                    tool-error-card.css
                    tool-error-card.stories.tsx
                    tool-error-card.tsx
                    tool-status-title.css
                    tool-status-title.tsx
                    tooltip.css
                    tooltip.stories.tsx
                    tooltip.tsx
                    typewriter.css
                    typewriter.stories.tsx
                    typewriter.tsx
                    app-icons/
                        types.ts
                    file-icons/
                        types.ts
                    provider-icons/
                        types.ts
                context/
                    data.tsx
                    dialog.tsx
                    file.tsx
                    helper.tsx
                    i18n.tsx
                    index.ts
                    marked.tsx
                    worker-pool.tsx
                hooks/
                    create-auto-scroll.tsx
                    index.ts
                    use-filtered-list.tsx
                i18n/
                    ar.ts
                    br.ts
                    bs.ts
                    da.ts
                    de.ts
                    en.ts
                    es.ts
                    fr.ts
                    ja.ts
                    ko.ts
                    no.ts
                    pl.ts
                    ru.ts
                    th.ts
                    tr.ts
                    zh.ts
                    zht.ts
                pierre/
                    comment-hover.ts
                    commented-lines.ts
                    diff-selection.ts
                    file-find.ts
                    file-runtime.ts
                    file-selection.ts
                    index.ts
                    media.ts
                    selection-bridge.ts
                    virtualizer.ts
                    worker.ts
                storybook/
                    fixtures.ts
                    scaffold.tsx
                styles/
                    animations.css
                    base.css
                    colors.css
                    index.css
                    theme.css
                    utilities.css
                    tailwind/
                        colors.css
                        index.css
                        utilities.css
                theme/
                    color.ts
                    context.tsx
                    default-themes.ts
                    desktop-theme.schema.json
                    index.ts
                    loader.ts
                    resolve.ts
                    types.ts
                    themes/
                        amoled.json
                        aura.json
                        ayu.json
                        carbonfox.json
                        catppuccin-frappe.json
                        catppuccin-macchiato.json
                        catppuccin.json
                        cobalt2.json
                        cursor.json
                        dracula.json
                        everforest.json
                        flexoki.json
                        github.json
                        gruvbox.json
                        kanagawa.json
                        lucent-orng.json
                        material.json
                        matrix.json
                        mercury.json
                        monokai.json
                        nightowl.json
                        nord.json
                        oc-2.json
                        one-dark.json
                        onedarkpro.json
                        opencode.json
                        orng.json
                        osaka-jade.json
                        palenight.json
                        rosepine.json
                        shadesofpurple.json
                        solarized.json
                        synthwave84.json
                        tokyonight.json
                        vercel.json
                        vesper.json
                        zenburn.json
    patches/
        @npmcli%2Fagent@4.0.0.patch
        @standard-community%2Fstandard-openapi@0.2.9.patch
        gitlab-ai-provider@6.6.0.patch
        install-korean-ime-fix.sh
        solid-js@1.9.10.patch
    script/
        beta.ts
        changelog.ts
        format.ts
        generate.ts
        hooks
        publish.ts
        raw-changelog.ts
        release
        release.ts
        sign-windows.ps1
        stats.ts
        sync-zed.ts
        version.ts
        github/
            close-issues.ts
    sdks/
        vscode/
            .gitignore
            .vscode-test.mjs
            .vscodeignore
            bun.lock
            esbuild.js
            eslint.config.mjs
            package.json
            README.md
            sst-env.d.ts
            tsconfig.json
            images/
            script/
                publish
                release
            src/
                extension.ts
```

## Core Logic Samples

### `.oxlintrc.json`
```
{
  "$schema": "https://raw.githubusercontent.com/nicolo-ribaudo/oxc-project.github.io/refs/heads/json-schema/src/public/.oxlintrc.schema.json",
  "options": {
    "typeAware": true
  },
  "categories": {
    "suspicious": "warn"
  },
  "rules": {
    "typescript/no-base-to-string": "warn",
    // Effect uses `function*` with Effect.gen/Effect.fnUntraced that don't always yield
    "require-yield": "off",
    // SolidJS uses `let ref: T | undefined` for JSX ref bindings assigned at runtime
    "no-unassigned-vars": "off",
    // SolidJS tracks reactive deps by reading properties inside createEffect
    "no-unused-expressions": "off",
    // Intentional control char matching (ANSI escapes, null byte sanitization)
    "no-control-regex": "off",
    // SST and plugin tools require triple-slash references
    "triple-slash-reference": "off",

    // Suspicious category: suppress noisy rules
    // Effect's nested function* closures inherently shadow outer scope
    "no-shadow": "off",
    // Namespace-heavy codebase makes this too noisy
    "unicorn/consistent-function-scoping": "off",
    // Opinionated — .sort()/.reverse() mutation is fine in this codebase
    "unicorn/no-array-sort": "off",
    "unicorn/no-array-reverse": "off",
    // Not relevant — this isn't a DOM event handler codebase
    "unicorn/prefer-add-event-listener": "off",
    // Bundler handles module resolution
    "unicorn/require-module-specifiers": "off",
    // postMessage target origin not relevant for this codebase
    "unicorn/require-post-message-target-origin": "off",
    // Side-effectful constructors are intentional in some places
    "no-new": "off",

    // Type-aware: catch unhandled promises
    "typescript/no-floating-promises": "warn",
    // Warn when spreading non-plain objects (Headers, class instances, etc.)
    "typescript/no-misused-spread": "warn"
  },
  "options": {
    "typeAware": true
  },
  "options": {
    "typeAware": true
  },
  "ignorePatterns": ["**/node_modules", "**/dist", "**/.build", "**/.sst", "**/*.d.ts", "**/sdk.gen.ts"]
}
```

### `package.json`
```
{
  "$schema": "https://json.schemastore.org/package.json",
  "name": "mimocode",
  "description": "AI-powered development tool",
  "private": true,
  "type": "module",
  "packageManager": "bun@1.3.11",
  "scripts": {
    "dev": "MIMOCODE_HOME=$PWD/.dev-home bun run --cwd packages/opencode --conditions=browser src/index.ts",
    "dev:desktop": "bun --cwd packages/desktop dev",
    "dev:web": "bun --cwd packages/app dev",
    "dev:console": "ulimit -n 10240 2>/dev/null; bun run --cwd packages/console/app dev",
    "dev:storybook": "bun --cwd packages/storybook storybook",
    "lint": "oxlint",
    "typecheck": "bun turbo typecheck",
    "postinstall": "bun run --cwd packages/opencode fix-node-pty",
    "prepare": "husky",
    "random": "echo 'Random script'",
    "hello": "echo 'Hello World!'",
    "test": "echo 'do not run tests from root' && exit 1"
  },
  "workspaces": {
    "packages": [
      "packages/*",
      "packages/console/*",
      "packages/sdk/js",
      "packages/slack"
    ],
    "catalog": {
      "@effect/opentelemetry": "4.0.0-beta.48",
      "@effect/platform-node": "4.0.0-beta.48",
      "@npmcli/arborist": "9.4.0",
      "@types/bun": "1.3.11",
      "@types/cross-spawn": "6.0.6",
      "@octokit/rest": "22.0.0",
      "@hono/zod-validator": "0.4.2",
      "@opentui/core": "0.1.99",
      "@opentui/solid": "0.1.99",
      "ulid": "3.0.1",
      "@kobalte/core": "0.13.11",
      "@types/luxon": "3.7.1",
      "@types/node": "22.13.9",
      "@types/semver": "7.7.1",
      "@tsconfig/node22": "22.0.2",
      "@tsconfig/bun": "1.0.9",
      "@cloudflare/workers-types": "4.20251008.0",
      "@openauthjs/openauth": "0.0.0-20250322224806",
      "@pierre/diffs": "1.1.0-beta.18",
      "@solid-primitives/storage": "4.3.3",
      "@tailwindcss/vite": "4.1.11",
      "diff": "8.0.2",
      "dompurify": "3.3.1",
      "drizzle-kit": "1.0.0-beta.19-d95b7a4",
      "drizzle-orm": "1.0.0-beta.19-d95b7a4",
      "effect": "4.0.0-beta.48",
      "ai": "6.0.168",
      "cross-spawn": "7.0.6",
      "hono": "4.10.7",
      "hono-openapi": "1.1.2",
      "fuzzysort": "3.1.0",
      "luxon": "3.6.1",
      "marked": "17.0.1",
      "marked-shiki": "1.2.1",
      "remend": "1.3.0",
      "@playwright/test": "1.59.1",
      "semver": "7.7.4",
      "typescript": "5.8.2",
      "@typescript/native-preview": "7.0.0-dev.20251207.1",
      "zod": "4.1.8",
      "remeda": "2.26.0",
      "shiki": "3.20.0",
      "solid-list": "0.3.0",
      "tailwindcss": "4.1.11",
      "virtua": "0.42.3",
      "vite": "7.1.4",
      "@solidjs/meta": "0.29.4",
      "@solidjs/router": "0.15.4",
      "@solidjs/start": "https://pkg.pr.new/@solidjs/start@dfb2020",
      "solid-js": "1.9.10",
      "vite-plugin-solid": "2.11.10",
      "@lydell/node-pty": "1.2.0-beta.10"
    }
  },
  "devDependencies": {
    "@actions/artifact": "5.0.1",
    "@tsconfig/bun": "catalog:",
    "@types/mime-types": "3.0.1",
    "@typescript/native-preview": "catalog:",
    "glob": "13.0.5",
    "husky": "9.1.7",
    "oxlint": "1.60.0",
    "oxlint-tsgolint": "0.21.0",
    "prettier": "3.6.2",
    "semver": "^7.6.0",
    "sst": "3.18.10",
    "turbo": "2.8.13"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "3.933.0",
    "@mimo-ai/plugin": "workspace:*",
    "@mimo-ai/script": "workspace:*",
    "@mimo-ai/sdk": "workspace:*",
    "heap-snapshot-toolkit": "1.1.3",
    "typescript": "catalog:"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/XiaomiMiMo/MiMo-Code"
  },
  "license": "MIT",
  "prettier": {
    "semi": false,
    "printWidth": 120
  },
  "trustedDependencies": [
    "esbuild",
    "node-pty",
    "protobufjs",
    "tree-sitter",
    "tree-sitter-bash",
    "tree-sitter-powershell",
    "web-tree-sitter",
    "electron"
  ],
  "overrides": {
    "@types/bun": "catalog:",
    "@types/node": "catalog:"
  },
  "patchedDependencies": {
    "@npmcli/agent@4.0.0": "patches/@npmcli%2Fagent@4.0.0.patch",
    "@standard-community/standard-openapi@0.2.9": "patches/@standard-community%2Fstandard-openapi@0.2.9.patch",
    "solid-js@1.9.10": "patches/solid-js@1.9.10.patch",
    "gitlab-ai-provider@6.6.0": "patches/gitlab-ai-provider@6.6.0.patch"
  }
}
```

### `sst-env.d.ts`
```
/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */
/* biome-ignore-all lint: auto-generated */

declare module "sst" {
  export interface Resource {
    "ADMIN_SECRET": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "AUTH_API_URL": {
      "type": "sst.sst.Linkable"
      "value": string
    }
    "AWS_SES_ACCESS_KEY_ID": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "AWS_SES_SECRET_ACCESS_KEY": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "Api": {
      "type": "sst.cloudflare.Worker"
      "url": string
    }
    "AuthApi": {
      "type": "sst.cloudflare.Worker"
      "url": string
    }
    "AuthStorage": {
      "namespaceId": string
      "type": "sst.cloudflare.Kv"
    }
    "Bucket": {
      "name": string
      "type": "sst.cloudflare.Bucket"
    }
    "CLOUDFLARE_API_TOKEN": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "CLOUDFLARE_DEFAULT_ACCOUNT_ID": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "Console": {
      "type": "sst.cloudflare.SolidStart"
      "url": string
    }
    "DISCORD_SUPPORT_BOT_TOKEN": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "DISCORD_SUPPORT_CHANNEL_ID": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "Database": {
      "database": string
      "host": string
      "password": string
      "port": number
      "type": "sst.sst.Linkable"
      "username": string
    }
    "EMAILOCTOPUS_API_KEY": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "EnterpriseStorage": {
      "name": string
      "type": "sst.cloudflare.Bucket"
    }
    "FEISHU_APP_ID": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "FEISHU_APP_SECRET": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "GITHUB_APP_ID": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "GITHUB_APP_PRIVATE_KEY": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "GITHUB_CLIENT_ID_CONSOLE": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "GITHUB_CLIENT_SECRET_CONSOLE": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "GOOGLE_CLIENT_ID": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "GatewayKv": {
      "namespaceId": string
      "type": "sst.cloudflare.Kv"
    }
    "HONEYCOMB_API_KEY": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "LogProcessor": {
      "type": "sst.cloudflare.Worker"
    }
    "R2AccessKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "R2SecretKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "SALESFORCE_CLIENT_ID": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "SALESFORCE_CLIENT_SECRET": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "SALESFORCE_INSTANCE_URL": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "STRIPE_PUBLISHABLE_KEY": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "STRIPE_SECRET_KEY": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "STRIPE_WEBHOOK_SECRET": {
      "type": "sst.sst.Linkable"
      "value": string
    }
    "Teams": {
      "type": "sst.cloudflare.SolidStart"
      "url": string
    }
    "Web": {
      "type": "sst.cloudflare.Astro"
      "url": string
    }
    "WebApp": {
      "type": "sst.cloudflare.StaticSite"
      "url": string
    }
    "ZEN_BLACK_PRICE": {
      "plan100": string
      "plan20": string
      "plan200": string
      "product": string
      "type": "sst.sst.Linkable"
    }
    "ZEN_LIMITS": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ZEN_LITE_PRICE": {
      "firstMonth100Coupon": string
      "firstMonth50Coupon": string
      "price": string
      "priceInr": number
      "product": string
      "type": "sst.sst.Linkable"
    }
    "ZEN_MODELS1": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ZEN_MODELS10": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ZEN_MODELS11": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ZEN_MODELS12": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ZEN_MODELS13": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ZEN_MODELS14": {
      "type": "sst.sst.Secret"

... [TRUNCATED] ...
```

### `sst.config.ts`
```
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "opencode",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "cloudflare",
      providers: {
        stripe: {
          apiKey: process.env.STRIPE_SECRET_KEY!,
        },
        planetscale: "0.4.1",
      },
    }
  },
  async run() {
    await import("./infra/app.js")
    await import("./infra/console.js")
    await import("./infra/enterprise.js")
  },
})
```

### `tsconfig.json`
```
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@tsconfig/bun/tsconfig.json",
  "compilerOptions": {}
}
```

### `turbo.json`
```
{
  "$schema": "https://v2-8-13.turborepo.dev/schema.json",
  "globalEnv": ["CI", "OPENCODE_DISABLE_SHARE"],
  "globalPassThroughEnv": ["CI", "OPENCODE_DISABLE_SHARE"],
  "tasks": {
    "typecheck": {},
    "build": {
      "dependsOn": [],
      "outputs": ["dist/**"]
    },
    "opencode#test": {
      "dependsOn": ["^build"],
      "outputs": [],
      "passThroughEnv": ["*"]
    },
    "opencode#test:ci": {
      "dependsOn": ["^build"],
      "outputs": [".artifacts/unit/junit.xml"],
      "passThroughEnv": ["*"]
    },
    "@mimo-ai/app#test": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "@mimo-ai/app#test:ci": {
      "dependsOn": ["^build"],
      "outputs": [".artifacts/unit/junit.xml"],
      "passThroughEnv": ["*"]
    }
  }
}
```

### `.mimocode\env.d.ts`
```
declare module "*.txt" {
  const content: string
  export default content
}
```

### `.mimocode\tui.json`
```
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": [
    [
      "./plugins/tui-smoke.tsx",
      {
        "enabled": false,
        "label": "workspace",
        "keybinds": {
          "modal": "ctrl+alt+m",
          "screen": "ctrl+alt+o",
          "home": "escape,ctrl+shift+h",
          "dialog_close": "escape,q"
        }
      }
    ]
  ]
}
```

### `.mimocode\plugins\smoke-theme.json`
```
{
  "$schema": "https://opencode.ai/theme.json",
  "defs": {
    "nord0": "#2E3440",
    "nord1": "#3B4252",
    "nord2": "#434C5E",
    "nord3": "#4C566A",
    "nord4": "#D8DEE9",
    "nord5": "#E5E9F0",
    "nord6": "#ECEFF4",
    "nord7": "#8FBCBB",
    "nord8": "#88C0D0",
    "nord9": "#81A1C1",
    "nord10": "#5E81AC",
    "nord11": "#BF616A",
    "nord12": "#D08770",
    "nord13": "#EBCB8B",
    "nord14": "#A3BE8C",
    "nord15": "#B48EAD"
  },
  "theme": {
    "primary": {
      "dark": "nord10",
      "light": "nord9"
    },
    "secondary": {
      "dark": "nord9",
      "light": "nord9"
    },
    "accent": {
      "dark": "nord7",
      "light": "nord7"
    },
    "error": {
      "dark": "nord11",
      "light": "nord11"
    },
    "warning": {
      "dark": "nord12",
      "light": "nord12"
    },
    "success": {
      "dark": "nord14",
      "light": "nord14"
    },
    "info": {
      "dark": "nord8",
      "light": "nord10"
    },
    "text": {
      "dark": "nord6",
      "light": "nord0"
    },
    "textMuted": {
      "dark": "#8B95A7",
      "light": "nord1"
    },
    "background": {
      "dark": "nord0",
      "light": "nord6"
    },
    "backgroundPanel": {
      "dark": "nord1",
      "light": "nord5"
    },
    "backgroundElement": {
      "dark": "nord2",
      "light": "nord4"
    },
    "border": {
      "dark": "nord2",
      "light": "nord3"
    },
    "borderActive": {
      "dark": "nord3",
      "light": "nord2"
    },
    "borderSubtle": {
      "dark": "nord2",
      "light": "nord3"
    },
    "diffAdded": {
      "dark": "nord14",
      "light": "nord14"
    },
    "diffRemoved": {
      "dark": "nord11",
      "light": "nord11"
    },
    "diffContext": {
      "dark": "#8B95A7",
      "light": "nord3"
    },
    "diffHunkHeader": {
      "dark": "#8B95A7",
      "light": "nord3"
    },
    "diffHighlightAdded": {
      "dark": "nord14",
      "light": "nord14"
    },
    "diffHighlightRemoved": {
      "dark": "nord11",
      "light": "nord11"
    },
    "diffAddedBg": {
      "dark": "#36413C",
      "light": "#E6EBE7"
    },
    "diffRemovedBg": {
      "dark": "#43393D",
      "light": "#ECE6E8"
    },
    "diffContextBg": {
      "dark": "nord1",
      "light": "nord5"
    },
    "diffLineNumber": {
      "dark": "nord2",
      "light": "nord4"
    },
    "diffAddedLineNumberBg": {
      "dark": "#303A35",
      "light": "#DDE4DF"
    },
    "diffRemovedLineNumberBg": {
      "dark": "#3C3336",
      "light": "#E4DDE0"
    },
    "markdownText": {
      "dark": "nord4",
      "light": "nord0"
    },
    "markdownHeading": {
      "dark": "nord8",
      "light": "nord10"
    },
    "markdownLink": {
      "dark": "nord9",
      "light": "nord9"
    },
    "markdownLinkText": {
      "dark": "nord7",
      "light": "nord7"
    },
    "markdownCode": {
      "dark": "nord14",
      "light": "nord14"
    },
    "markdownBlockQuote": {
      "dark": "#8B95A7",
      "light": "nord3"
    },
    "markdownEmph": {
      "dark": "nord12",
      "light": "nord12"
    },
    "markdownStrong": {
      "dark": "nord13",
      "light": "nord13"
    },
    "markdownHorizontalRule": {
      "dark": "#8B95A7",
      "light": "nord3"
    },
    "markdownListItem": {
      "dark": "nord8",
      "light": "nord10"
    },
    "markdownListEnumeration": {
      "dark": "nord7",
      "light": "nord7"
    },
    "markdownImage": {
      "dark": "nord9",
      "light": "nord9"
    },
    "markdownImageText": {
      "dark": "nord7",
      "light": "nord7"
    },
    "markdownCodeBlock": {
      "dark": "nord4",
      "light": "nord0"
    },
    "syntaxComment": {
      "dark": "#8B95A7",
      "light": "nord3"
    },
    "syntaxKeyword": {
      "dark": "nord9",
      "light": "nord9"
    },
    "syntaxFunction": {
      "dark": "nord8",
      "light": "nord8"
    },
    "syntaxVariable": {
      "dark": "nord7",
      "light": "nord7"

... [TRUNCATED] ...
```

### `.mimocode\plugins\tui-smoke.tsx`
```
/** @jsxImportSource @opentui/solid */
import { useKeyboard, useTerminalDimensions, type JSX } from "@opentui/solid"
import { RGBA, VignetteEffect } from "@opentui/core"
import type {
  TuiKeybindSet,
  TuiPlugin,
  TuiPluginApi,
  TuiPluginMeta,
  TuiPluginModule,
  TuiSlotPlugin,
} from "@mimo-ai/plugin/tui"

const tabs = ["overview", "counter", "help"]
const bind = {
  modal: "ctrl+shift+m",
  screen: "ctrl+shift+o",
  home: "escape,ctrl+h",
  left: "left,h",
  right: "right,l",
  up: "up,k",
  down: "down,j",
  alert: "a",
  confirm: "c",
  prompt: "p",
  select: "s",
  modal_accept: "enter,return",
  modal_close: "escape",
  dialog_close: "escape",
  local: "x",
  local_push: "enter,return",
  local_close: "q,backspace",
  host: "z",
}

const pick = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback
  if (!value.trim()) return fallback
  return value
}

const num = (value: unknown, fallback: number) => {
  if (typeof value !== "number") return fallback
  return value
}

const rec = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return
  return Object.fromEntries(Object.entries(value))
}

type Cfg = {
  label: string
  route: string
  vignette: number
  keybinds: Record<string, unknown> | undefined
}

type Route = {
  modal: string
  screen: string
}

type State = {
  tab: number
  count: number
  source: string
  note: string
  selected: string
  local: number
}

const cfg = (options: Record<string, unknown> | undefined) => {
  return {
    label: pick(options?.label, "smoke"),
    route: pick(options?.route, "workspace-smoke"),
    vignette: Math.max(0, num(options?.vignette, 0.35)),
    keybinds: rec(options?.keybinds),
  }
}

const names = (input: Cfg) => {
  return {
    modal: `${input.route}.modal`,
    screen: `${input.route}.screen`,
  }
}

type Keys = TuiKeybindSet
const ui = {
  panel: "#1d1d1d",
  border: "#4a4a4a",
  text: "#f0f0f0",
  muted: "#a5a5a5",
  accent: "#5f87ff",
}

type Color = RGBA | string

const ink = (map: Record<string, unknown>, name: string, fallback: string): Color => {
  const value = map[name]
  if (typeof value === "string") return value
  if (value instanceof RGBA) return value
  return fallback
}

const look = (map: Record<string, unknown>) => {
  return {
    panel: ink(map, "backgroundPanel", ui.panel),
    border: ink(map, "border", ui.border),
    text: ink(map, "text", ui.text),
    muted: ink(map, "textMuted", ui.muted),
    accent: ink(map, "primary", ui.accent),
    selected: ink(map, "selectedListItemText", ui.text),
  }
}

const tone = (api: TuiPluginApi) => {
  return look(api.theme.current)
}

type Skin = {
  panel: Color
  border: Color
  text: Color
  muted: Color
  accent: Color
  selected: Color
}

const Btn = (props: { txt: string; run: () => void; skin: Skin; on?: boolean }) => {
  return (
    <box
      onMouseUp={() => {
        props.run()
      }}
      backgroundColor={props.on ? props.skin.accent : props.skin.border}
      paddingLeft={1}
      paddingRight={1}
    >
      <text fg={props.on ? props.skin.selected : props.skin.text}>{props.txt}</text>
    </box>
  )
}

const parse = (params: Record<string, unknown> | undefined) => {
  const tab = typeof params?.tab === "number" ? params.tab : 0
  const count = typeof params?.count === "number" ? params.count : 0
  const source = typeof params?.source === "string" ? params.source : "unknown"
  const note = typeof params?.note === "string" ? params.note : ""
  const selected = typeof params?.selected === "string" ? params.selected : ""
  const local = typeof params?.local === "number" ? params.local : 0
  return {
    tab: Math.max(0, Math.min(tab, tabs.length - 1)),
    count,
    source,
    note,
    selected,
    local: Math.max(0, local),
  }
}

const current = (api: TuiPluginApi, route: Route) => {
  const value = api.route.current
  const ok = Object.values(route).includes(value.name)
  if (!ok) return parse(undefined)
  if (!("params" in value)) return parse(undefined)
  return parse(value.params)
}

const opts = [
  {
    title: "Overview",
    value: 0,
    description: "Switch to overview tab",
  },
  {
    title: "Counter",
    value: 1,
    description: "Switch to counter tab",
  },
  {
    title: "Help",
    value: 2,
    description: "Switch to help tab",
  },
]

const host = (api: TuiPluginApi, input: Cfg, skin: Skin) => {
  api.ui.dialog.setSize("medium")
  api.ui.dialog.replace(() => (
    <box paddingBottom={1} paddingLeft={2} paddingRight={2} gap={1} flexDirection="column">
      <text fg={skin.text}>
        <b>{input.label} host overlay</b>
      </text>
      <text fg={skin.muted}>Using api.ui.dialog stack with built-in backdrop</text>
      <text fg={skin.muted}>esc closes · depth {api.ui.dialog.depth}</text>
      <box flexDirection="row" gap={1}>
        <Btn txt="close" run={() => api.ui.dialog.clear()} skin={skin} on />
      </box>
    </box>

... [TRUNCATED] ...
```
