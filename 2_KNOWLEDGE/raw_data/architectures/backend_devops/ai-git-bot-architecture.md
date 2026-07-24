# Architecture Extract: ai-git-bot

## Directory Structure
```text
ai-git-bot/
    .dockerignore
    .gitignore
    CHANGELOG.md
    CITATION.cff
    codemeta.json
    CODE_OF_CONDUCT.md
    CONTRIBUTING.md
    docker-compose.yml
    Dockerfile
    LICENSE
    llms-full.txt
    llms.txt
    pom.xml
    README.ja.md
    README.ko.md
    README.md
    README.zh.md
    SECURITY.md
    .github/
        workflows/
            ci.yml
            docker-publish.yml
            guard-main.yml
            preview.yml
    doc/
        AGENT.md
        ARCHITECTURE.md
        BITBUCKET_SETUP.md
        BOT_TOOL_CONFIGURATIONS.md
        DEPLOYMENT.md
        DOCKERHUB_README.md
        DOCKERHUB_SHORT_DESCRIPTION.txt
        GITEA_SETUP.md
        GITHUB_SETUP.md
        GITLAB_SETUP.md
        LLAMACPP.md
        LOCAL_DEVELOPMENT.md
        MCP_SERVER_HANDLING.md
        MIGRATION_1.0_TO_1.1.md
        MIGRATION_1.6_TO_1.7.md
        OLLAMA.md
        PR_WORKFLOWS.md
        PR_WORKFLOWS_AGENTIC_REVIEW.md
        PR_WORKFLOWS_CI_ACTIONS.md
        PR_WORKFLOWS_E2E.md
        PR_WORKFLOWS_UNIT_TEST.md
        PR_WORKFLOWS_WEBHOOK_RECIPES.md
        README.md
        TESTING_GUIDE.md
        TOOL_CALLING.md
        USER_GUIDE.md
        USING_THE_BOT.md
        agentic-workflows/
            CI_ACTION_DEPLOYMENT_USER_STORY.md
            CONCEPT_AND_ARCHITECTURE.md
            INTERNALS.md
            MCP_DEPLOYMENT_USER_STORY.md
            README.md
            STATIC_DEPLOYMENT_USER_STORY.md
            SUITE_PROMOTION_USER_STORY.md
            WEBHOOK_DEPLOYMENT_USER_STORY.md
        images/
        pitch/
            ideas.md
            PITCH.md
        screenshots/
            bitbucket/
            gitea/
            github/
            gitlab/
            mcp/
            pr-workflow/
        work/
            AGENTIC_PR_REVIEW_PLAN.md
            UNIT_TEST_AUTHOR_PLAN.md
    prompts/
        agent.md
        default.md
        local-llm.md
    src/
        main/
            java/
                org/
                    remus/
                        giteabot/
                            GiteaBotApplication.java
                            admin/
                                AdminService.java
                                AdminUser.java
                                AdminUserRepository.java
                                AgentServiceFactory.java
                                AiClientFactory.java
                                AiIntegration.java
                                AiIntegrationController.java
                                AiIntegrationRepository.java
                                AiIntegrationService.java
                                AutoLoginConfig.java
                                Bot.java
                                BotController.java
                                BotRepository.java
                                BotService.java
                                BotType.java
                                BotWebhookService.java
                                DashboardController.java
                                EncryptionService.java
                                GiteaClientFactory.java
                                GitIntegration.java
                                GitIntegrationController.java
                                GitIntegrationRepository.java
                                GitIntegrationService.java
                                SecurityConfig.java
                                SetupController.java
                            agent/
                                AgentCollaborators.java
                                AgentErrorNotificationService.java
                                IssueImplementationContext.java
                                IssueImplementationService.java
                                critic/
                                    CriticAgent.java
                                    ReflectionResult.java
                                issueimpl/
                                    AgentPromptBuilder.java
                                    AiResponseParser.java
                                    CodingAgentStrategy.java
                                    IssueNotificationService.java
                                loop/
                                    AgentBudget.java
                                    AgentLoop.java
                                    AgentRunContext.java
                                    AgentStrategy.java
                                    LoopOutcome.java
                                    StepDecision.java
                                    ToolingMode.java
                                model/
                                    ImplementationPlan.java
                                session/
                                    AgentSession.java
                                    AgentSessionRepository.java
                                    AgentSessionService.java
                                shared/
                                    AgentJackson.java
                                    AgentMetrics.java
                                    AgentMetricsHolder.java
                                    AgentSchema.java
                                    AgentSchemaValidator.java
                                    AgentSchemaValidatorHolder.java
                                    BranchRefs.java
                                    BranchSwitcher.java
                                    LegacyToolProtocolRenderer.java
                                    McpTools.java
                                    SystemPromptAssembler.java
                                    ToolFailures.java
                                tools/
                                    AgentToolRouter.java
                                    ToolCallContext.java
                                    ToolCatalog.java
                                    ToolKind.java
                                validation/
                                    CommandResult.java
                                    ToolExecutionService.java
                                    ToolResult.java
                                    WorkspaceResult.java
                                    WorkspaceService.java
                                writerimpl/
                                    WriterAgentService.java
                                    WriterAgentStrategy.java
                                    WriterPlan.java
                                    WriterPromptBuilder.java
                                    WriterResponseParser.java
                            ai/
                                AbstractAiClient.java
                                AiAuditContext.java
                                AiAuditContextClearingTaskDecorator.java
                                AiAuditRecorder.java
                                AiClient.java
                                AiClientDelegateSupport.java
                                AiMessage.java
                                AiProviderMetadata.java
                                AiProviderRegistry.java
                                AuditingAiClient.java
                                ChatTurn.java
                                StopReason.java
                                ToolCall.java
                                ToolDescriptor.java
                                ToolNameSanitizer.java
                                anthropic/
                                    AnthropicAiClient.java
                                    AnthropicProviderMetadata.java
                                    AnthropicRequest.java
                                    AnthropicResponse.java
                                google/
                                    GoogleAiClient.java
                                    GoogleAiProviderMetadata.java
                                    GoogleAiRequest.java
                                    GoogleAiResponse.java
                                llamacpp/
                                    LlamaCppClient.java
                                    LlamaCppProviderMetadata.java
                                    LlamaCppRequest.java
                                    LlamaCppResponse.java
                                ollama/
                                    OllamaClient.java
                                    OllamaProviderMetadata.java
                                    OllamaRequest.java
                                    OllamaResponse.java
                                openai/
                                    OpenAiClient.java
                                    OpenAiProviderMetadata.java
                                    OpenAiRequest.java
                                    OpenAiResponse.java
                            aiusage/
                                AiErrorLog.java
                                AiErrorLogRepository.java
                                AiUsageLog.java
                                AiUsageLogRepository.java
                                AiUsageService.java
                                UsageController.java
                            bitbucket/
                                BitbucketApiClient.java
                                BitbucketWebhookHandler.java
                                model/
                                    BitbucketReview.java
                                    BitbucketReviewComment.java
                            config/
                                AgentConfigProperties.java
                                AsyncConfig.java
                                PromptConfig.java
                                PromptConfigProperties.java
                                PromptService.java
                                ReviewConfigProperties.java
                            gitea/
                                GiteaApiClient.java
                                GiteaWebhookHandler.java
                                model/
                                    GiteaReview.java
                                    GiteaReviewComment.java
                                    WebhookPayload.java
                            github/
                                GitHubApiClient.java
                                GitHubWebhookHandler.java
                                model/
                                    GitHubReview.java
                                    GitHubReviewComment.java
                            gitlab/
                                GitLabApiClient.java
                                GitLabWebhookHandler.java
                                model/
                                    GitLabReview.java
                                    GitLabReviewComment.java
                            mcp/
                                McpConfigurationParser.java
                                McpOrchestrationService.java
                                McpServerDefinition.java
                                McpServerDiscovery.java
                                McpToolCatalog.java
                                McpToolDefinition.java
                                McpToolPromptRenderer.java
                            prworkflow/
                                PrWorkflow.java
                                PrWorkflowCategory.java
                                PrWorkflowContext.java
                                PrWorkflowMetrics.java
                                PrWorkflowOrchestrator.java
                                PrWorkflowRegistry.java
                                PrWorkflowRun.java
                                PrWorkflowRunLockManager.java
                                PrWorkflowRunRepository.java
                                PrWorkflowRunService.java
                                PrWorkflowRunStatus.java
                                PrWorkflowStep.java
                                PrWorkflowStepRepository.java
                                WorkflowCancelledException.java
                                WorkflowParamField.java
                                WorkflowParamName.java
                                WorkflowParamsSchema.java
                                WorkflowResult.java
                                WorkflowResultStatus.java
                                agentreview/
                                    AgentReviewContext.java
                                    AgentReviewParam.java
                                    AgentReviewService.java
                                    AgentReviewServiceFactory.java
                                    AgentReviewWorkflow.java
                                    ReviewAgentStrategy.java
                                config/
                                    DeploymentTarget.java
                                    DeploymentTargetController.java
                                    DeploymentTargetRepository.java
                                    DeploymentTargetService.java
                                    WorkflowConfiguration.java
                                    WorkflowConfigurationController.java
                                    WorkflowConfigurationRepository.java
                                    WorkflowConfigurationService.java
                                    WorkflowParamsValidator.java
                                    WorkflowSelection.java
                                    WorkflowSelectionParam.java
                                    WorkflowSelectionRepository.java
                                    WorkflowSelectionRow.java
                                    WorkflowSelectionService.java
                                deployment/
                                    CiActionPoller.java
                                    CiActionTriggerStrategy.java
                                    DeploymentCallbackNotifier.java
                                    DeploymentOrchestrator.java
                                    DeploymentRequest.java
                                    DeploymentResult.java
                                    DeploymentStatus.java
                                    DeploymentStrategy.java
                                    DeploymentStrategyRegistry.java
                                    DeploymentStrategyType.java
                                    StaticPreviewUrlStrategy.java
                                    WebhookTriggerStrategy.java
                                    WorkflowCallbackController.java
                                    mcp/
                                        McpDeploymentConfig.java
                                        MCPDeploymentStrategy.java
                                        McpDeploymentTemplating.java
                                e2e/
                                    E2eTestFramework.java
                                    E2eTestParam.java
                                    E2eTestPrCloseHandler.java
                                    E2eTestSlashCommandHandler.java
                                    E2eTestSummaryRenderer.java
                                    E2ETestWorkflow.java
                                    PrTestCase.java
                                    PrTestCaseRepository.java
                                    PrTestCaseStatus.java
                                    PrTestSuite.java
                                    PrTestSuiteRepository.java
                                    SuiteLifecycleMode.java
                                    agents/
                                        E2eAgentRunner.java
                                        E2ePromptLibrary.java
                                        NarratedToolCallParser.java
                                        TestAuthorAgent.java
                                        TestPlan.java
                                        TestPlannerAgent.java
                                        TestPlanParser.java
                                        TestRunnerAgent.java
                                    promotion/
                                        PromotedSuiteGarbageCollector.java
                                        SuitePromotionService.java
                                    runner/
                                        NoopTestSuiteRunner.java
                                        PlaywrightTestSuiteRunner.java
                                        TestSuiteOutcome.java
                                        TestSuiteOutcomeStatus.java
                                        TestSuiteRequest.java
                                        TestSuiteRunner.java
                                        TestSuiteRunnerRegistry.java
                                    tools/
                                        PreviewHttpProbe.java
                                        PrWorkflowToolContext.java
                                        PrWorkflowToolExecutor.java
                                        WorkspaceProcessRunner.java
                                    workspace/
                                        PrTestWorkspaceManager.java
                                review/
                                    CodeReviewServiceFactory.java
                                    ReviewWorkflow.java
                                unittest/
                                    FrameworkDetector.java
                                    UnitTestCase.java
                                    UnitTestCaseRepository.java
                                    UnitTestCaseStatus.java
                                    UnitTestFramework.java
                                    UnitTestParam.java
                                    UnitTestPathGuard.java
                                    UnitTestService.java
                                    UnitTestServiceFactory.java
                                    UnitTestSlashCommandHandler.java
                                    UnitTestSuite.java
                                    UnitTestSuiteRepository.java
                                    UnitTestSummaryRenderer.java
                                    UnitTestWorkflow.java
                                    agents/
                                        UnitTestAgentRunner.java
                                        UnitTestAuthorAgent.java
                                        UnitTestPromptLibrary.java
                                    coverage/
                                        CoverageParser.java
                                        CoverageResult.java
                                    runner/
                                        UnitTestOutcome.java
                                        UnitTestOutcomeStatus.java
                                        UnitTestRunner.java
                                        UnitTestRunRequest.java
                                    tools/
                                        UnitTestToolContext.java
                                        UnitTestToolExecutor.java
                            repository/
                                ArtifactCommentRenderer.java
                                ArtifactUploadSupport.java
                                BitbucketProviderMetadata.java
                                GiteaProviderMetadata.java
                                GitHubProviderMetadata.java
                                GitLabProviderMetadata.java
                                PostReviewAction.java
                                RepositoryApiClient.java
                                RepositoryProviderMetadata.java
                                RepositoryProviderRegistry.java
                                RepositoryType.java
                                WorkflowDispatchRequest.java
                                WorkflowRunStatus.java
                                model/
                                    RepositoryCredentials.java
                                    Review.java
                                    ReviewComment.java
                            review/
                                CodeReviewService.java
                                enrichment/
                                    ChangedFileContentsEnricher.java
                                    CommitMessagesEnricher.java
                                    ContextEnricher.java
                                    EnrichmentContext.java
                                    PrContextEnricher.java
                                    ReferencedIssuesEnricher.java
                                    RepositoryTreeEnricher.java
                            session/
                                ConversationMessage.java
                                ReviewSession.java
                                ReviewSessionRepository.java
                                SessionService.java
                            systemsettings/
                                BotToolConfiguration.java
                                BotToolConfigurationRepository.java
                                BotToolConfigurationService.java
                                BotToolSelection.java
                                BotToolSelectionRepository.java
                                BotToolSelectionRow.java
                                BotToolSelectionService.java
                                BuiltinToolRegistry.java
                                McpConfiguration.java
                                McpConfigurationRepository.java
                                McpConfigurationService.java
                                McpSelectedTool.java
                                McpSelectedToolRepository.java
                                McpToolSelectionRow.java
                                McpToolSelectionService.java
                                SystemPrompt.java
                                SystemPromptRepository.java
                                SystemPromptService.java
                                SystemSettingsController.java
                            webhook/
                                UnifiedWebhookController.java
            resources/
                application-docker.properties
                application.properties
                agent/
                    schemas/
                        coding-plan.schema.json
                        writer-plan.schema.json
                db/
                    migration/
                        h2/
                            V10__step6_step7_schema_and_prompt_updates.sql
                            V11__bot_tool_configurations.sql
                            V12__bots_tool_configuration_fk.sql
                            V13__prworkflow_runs.sql
                            V14__workflow_configurations.sql
                            V15__workflow_configurations_default.sql
                            V16__deployment_targets.sql
                            V17__pr_test_suites.sql
                            V18__workflow_configurations_full_stack_qa.sql
                            V19__pr_workflow_runs_follow_up_pr.sql
                            V1__init_schema.sql
                            V20__system_prompts_e2e.sql
                            V21__bots_user_whitelist.sql
                            V22__system_prompts_agentic_review.sql
                            V23__system_prompts_unit_test.sql
                            V24__unit_test_suites.sql
                            V25__bots_run_on_pr_creation.sql
                            V26__ai_usage_audit.sql
                            V2__increase_apikey_length.sql
                            V3__system_prompts.sql
                            V4__align_text_columns_with_hibernate.sql
                            V5__technical_writer_agent.sql
                            V6__post_review_action.sql
                            V7__mcp_configurations.sql
                            V8__mcp_selected_tools.sql
                            V9__dotnet_validation_prompt.sql
                        postgresql/
                            V10__step6_step7_schema_and_prompt_updates.sql
                            V11__bot_tool_configurations.sql
                            V12__bots_tool_configuration_fk.sql
                            V13__prworkflow_runs.sql
                            V14__workflow_configurations.sql
                            V15__workflow_configurations_default.sql
                            V16__deployment_targets.sql
                            V17__pr_test_suites.sql
                            V18__workflow_configurations_full_stack_qa.sql
                            V19__pr_workflow_runs_follow_up_pr.sql
                            V1__init_schema.sql
                            V20__system_prompts_e2e.sql
                            V21__bots_user_whitelist.sql
                            V22__system_prompts_agentic_review.sql
                            V23__system_prompts_unit_test.sql
                            V24__unit_test_suites.sql
                            V25__bots_run_on_pr_creation.sql
                            V26__ai_usage_audit.sql
                            V2__increase_apikey_length.sql
                            V3__system_prompts.sql
                            V5__technical_writer_agent.sql
                            V6__post_review_action.sql
                            V7__mcp_configurations.sql
                            V8__mcp_selected_tools.sql
                            V9__dotnet_validation_prompt.sql
                prompts/
                    critic.md
                    default.md
                    local-llm.md
                    native/
                        e2e-agent-tool-protocol.md
                        issue-agent-tool-protocol.md
                        writer-agent-tool-protocol.md
                static/
                    images/
                    js/
                        collapsible-sections.js
                        theme-init.js
                templates/
                    dashboard.html
                    layout.html
                    login.html
                    setup.html
                    ai-integrations/
                        form.html
                        list.html
                    bots/
                        form.html
                        list.html
                    git-integrations/
                        form.html
                        list.html
                    system-settings/
                        bot-tools-form.html
                        bot-tools-selection.html
                        form.html
                        list.html
                        mcp-form.html
                        mcp-tool-selection.html
                        deployment-targets/
                            form.html
                        workflow-configurations/
                            form.html
                            workflows.html
                    usage/
                        list.html
        test/
            java/
                org/
                    remus/
                        giteabot/
                            ArchitectureTest.java
                            GiteaBotApplicationTests.java
                            admin/
                                AdminServiceTest.java
                                AiClientFactoryTest.java
                                AiIntegrationControllerTest.java
                                AiIntegrationServiceTest.java
                                BotControllerTest.java
                                BotServiceTest.java
                                BotWebhookServiceTest.java
                                DashboardControllerTest.java
                                EncryptionServiceTest.java
                                SetupControllerTest.java
                            agent/
                                AgentErrorNotificationServiceTest.java
                                IssueImplementationServiceTest.java
                                critic/
                                    CriticAgentTest.java
                                issueimpl/
                                    AgentPromptBuilderTest.java
                                    AiResponseParserTest.java
                                    CodingAgentStrategyTest.java
                                loop/
                                    AgentLoopNativeToolResultTest.java
                                    AgentLoopTest.java
                                    AgentLoopToolModeTest.java
                                    ToolingModeResolveTest.java
                                session/
                                    AgentSessionServicePlanPersistenceTest.java
                                    AgentSessionServiceToAiMessagesTest.java
                                shared/
                                    AgentMetricsTest.java
                                    AgentSchemaValidatorTest.java
                                    SystemPromptAssemblerTest.java
                                tools/
                                    AgentToolRouterWhitelistTest.java
                                    ToolCatalogTest.java
                                validation/
                                    ToolExecutionServiceTest.java
                                    WorkspaceServiceTest.java
                                writerimpl/
                                    WriterResponseParserTest.java
                            ai/
                                AbstractAiClientTest.java
                                AiProviderRegistryTest.java
                                AuditingAiClientTest.java
                                ChatTurnTest.java
                                anthropic/
                                    AnthropicAiClientTest.java
                                google/
                                    GoogleAiClientTest.java
                                llamacpp/
                                    LlamaCppClientTest.java
                                ollama/
                                    OllamaClientTest.java
                                openai/
                                    OpenAiClientTest.java
                            aiusage/
                                AiUsageServiceTest.java
                                UsageControllerTest.java
                            bitbucket/
                                BitbucketApiClientArtifactUploadTest.java
                                BitbucketApiClientTest.java
                                BitbucketPayloadTranslationTest.java
                                BitbucketWebhookHandlerTest.java
                            config/
                                AgentConfigPropertiesBudgetTest.java
                                PromptServiceTest.java
                            gitea/
                                GiteaApiClientArtifactUploadTest.java
                                GiteaApiClientTest.java
                                GiteaWebhookHandlerTest.java
                            github/
                                GitHubApiClientDispatchCorrelationTest.java
                                GitHubApiClientTest.java
                                GitHubWebhookHandlerTest.java
                            gitlab/
                                GitLabApiClientArtifactUploadTest.java
                                GitLabApiClientTest.java
                                GitLabWebhookHandlerTest.java
                                GitLabWebhookPayloadTranslationTest.java
                            integration/
                                WebhookIntegrationTest.java
                            mcp/
                                McpConfigurationParserTest.java
                                McpOrchestrationServiceTest.java
                                McpToolPromptRendererTest.java
                            prworkflow/
                                PrWorkflowOrchestratorTest.java
                                PrWorkflowRegistryTest.java
                                PrWorkflowRunServiceTest.java
                                agentreview/
                                    AgentReviewWorkflowTest.java
                                    ReviewAgentStrategyLegacyTest.java
                                config/
                                    DeploymentTargetServiceTest.java
                                    WorkflowConfigurationControllerMvcTest.java
                                    WorkflowConfigurationControllerTest.java
                                    WorkflowConfigurationServiceTest.java
                                    WorkflowSelectionServiceIntegrationTest.java
                                    WorkflowSelectionServiceTest.java
                                deployment/
                                    CiActionPollerTest.java
                                    CiActionTriggerStrategyTest.java
                                    DeploymentOrchestratorTest.java
                                    StaticPreviewUrlStrategyTest.java
                                    WebhookTriggerStrategyTest.java
                                    WorkflowCallbackControllerTest.java
                                    mcp/
                                        McpDeploymentConfigTest.java
                                        MCPDeploymentStrategyTest.java
                                        McpDeploymentTemplatingTest.java
                                e2e/
                                    E2eTestPrCloseHandlerTest.java
                                    E2eTestSlashCommandHandlerTest.java
                                    E2eTestSummaryRendererTest.java
                                    E2ETestWorkflowPromotionThresholdTest.java
                                    E2ETestWorkflowTest.java
                                    agents/
                                        StubAiClient.java
                                        TestAuthorAgentTest.java
                                        TestPlannerAgentTest.java
                                        TestPlanParserTest.java
                                        TestRunnerAgentTest.java
                                    promotion/
                                        PromotedSuiteGarbageCollectorTest.java
                                        SuitePromotionServiceTest.java
                                    runner/
                                        PlaywrightTestSuiteRunnerTest.java
                                        TestSuiteRunnerRegistryTest.java
                                    tools/
                                        PrWorkflowToolExecutorTest.java
                                    workspace/
                                        PrTestWorkspaceManagerTest.java
                                review/
                                    ReviewWorkflowTest.java
                                unittest/
                                    FrameworkDetectorTest.java
                                    UnitTestFrameworkTest.java
                                    UnitTestPathGuardTest.java
                                    UnitTestServiceParseChangedFilesTest.java
                                    UnitTestSummaryRendererTest.java
                                    coverage/
                                        CoverageParserTest.java
                                    runner/
                                        UnitTestRunnerTest.java
                                    tools/
                                        UnitTestToolExecutorTest.java
                            repository/
                                ArtifactCommentRendererTest.java
                                ArtifactUploadSupportTest.java
                                BitbucketProviderMetadataTest.java
                                GiteaProviderMetadataTest.java
                                GitHubProviderMetadataTest.java
                                GitLabProviderMetadataTest.java
                                WorkflowRunStatusMappingTest.java
                            review/
                                CodeReviewServiceTest.java
                                enrichment/
                                    ChangedFileContentsEnricherTest.java
                                    CommitMessagesEnricherTest.java
                                    PrContextEnricherTest.java
                                    ReferencedIssuesEnricherTest.java
                                    RepositoryTreeEnricherTest.java
                            session/
                                SessionServiceTest.java
                            systemsettings/
                                BotToolConfigurationServiceTest.java
                                BotToolSelectionServiceTest.java
                                BuiltinToolRegistryTest.java
                                McpConfigurationServiceTest.java
                                McpToolSelectionServiceTest.java
                                SystemPromptServiceTest.java
                                SystemSettingsControllerTest.java
                            webhook/
                                UnifiedWebhookControllerTest.java
            resources/
                application-test.properties
                data.sql
                ai-responses/
                    coding/
                        01-runTools.json
                        02-context-request.json
                        03-legacy-aliases.json
                    writer/
                        01-ready.json
                        02-questions.json
                        03-context-request.json
    systemtest/
        docker-compose-ci-action.yml
        docker-compose-e2e-sample.yml
        docker-compose-llamacpp.yml
        docker-compose-local-gitea.yml
        docker-compose-local-gitlab.yml
        docker-compose-mcp-deployment.yml
        docker-compose-mcp-github.yml
        docker-compose-ollama.yml
        README-ci-action.md
        README-mcp-deployment.md
        README-mcp-github.md
        README-suite-promotion.md
        README.md
        gitea-runner/
            config.yaml
        sample-ci-action-server/
            Dockerfile
            package.json
            server.js
        sample-e2e-app/
            Dockerfile
            package.json
            server.js
        sample-mcp-deploy-server/
            Dockerfile
            package.json
            server.js
```

## Core Logic Samples

### `codemeta.json`
```
{
  "@context": "https://doi.org/10.5063/schema/codemeta-2.0",
  "@type": "SoftwareSourceCode",
  "name": "AI-Git-Bot",
  "codeRepository": "https://github.com/tmseidel/ai-git-bot",
  "url": "https://github.com/tmseidel/ai-git-bot",
  "issueTracker": "https://github.com/tmseidel/ai-git-bot/issues",
  "license": "https://spdx.org/licenses/MIT.html",
  "version": "1.12.0",
  "programmingLanguage": [
    "Java",
    "HTML",
    "Shell",
    "Dockerfile"
  ],
  "runtimePlatform": [
    "Java 21",
    "Spring Boot",
    "Docker",
    "PostgreSQL"
  ],
  "applicationCategory": [
    "DeveloperApplication",
    "CodeReviewTool",
    "AutomationTool"
  ],
  "keywords": [
    "AI code review",
    "code review bot",
    "pull request automation",
    "coding agent",
    "AI unit tests",
    "unit test author",
    "white-box test generation",
    "technical writer agent",
    "issue implementation agent",
    "self-hosted AI",
    "Git automation",
    "Gitea",
    "GitHub",
    "GitHub Enterprise",
    "GitLab",
    "Bitbucket",
    "Anthropic Claude",
    "OpenAI",
    "Google Gemini",
    "Ollama",
    "llama.cpp",
    "local LLM",
    "Model Context Protocol",
    "MCP",
    "Spring Boot",
    "Docker",
    "PostgreSQL"
  ],
  "description": "AI-Git-Bot is a lightweight, self-hostable gateway application that connects Git platforms with AI providers for pull-request code reviews, interactive PR conversations, AI unit-test authoring, autonomous issue implementation, and technical-writing issue refinement.",
  "author": [
    {
      "@type": "Person",
      "givenName": "Tom",
      "familyName": "Seidel",
      "url": "https://github.com/tmseidel"
    }
  ],
  "maintainer": [
    {
      "@type": "Person",
      "givenName": "Tom",
      "familyName": "Seidel",
      "url": "https://github.com/tmseidel"
    }
  ],
  "softwareRequirements": [
    "Java 21 or later",
    "Maven 3.9+",
    "PostgreSQL for production deployments",
    "Docker Compose for containerized deployments"
  ],
  "isAccessibleForFree": true,
  "developmentStatus": "active"
}


```

### `src\main\resources\agent\schemas\coding-plan.schema.json`
```
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://github.com/anthropic-gitea-bot/agent/schemas/coding-plan.schema.json",
  "title": "CodingAgentPlan",
  "description": "Structured output contract for the coding agent (issue implementation). Field aliases (requestedFiles, requestedTools) are accepted to remain compatible with current AI responses.",
  "type": "object",
  "additionalProperties": true,
  "properties": {
    "summary": {
      "type": "string",
      "description": "Short summary of the planned implementation."
    },
    "branchName": {
      "type": "string",
      "description": "Branch name suggested by the AI (informational)."
    },
    "requestFiles": {
      "type": "array",
      "items": { "type": "string", "minLength": 1 },
      "description": "Files the AI requests to see before proceeding."
    },
    "requestedFiles": {
      "type": "array",
      "items": { "type": "string", "minLength": 1 },
      "description": "Alias for requestFiles (legacy)."
    },
    "requestTools": {
      "type": "array",
      "items": { "$ref": "#/$defs/toolRequest" },
      "description": "Repository exploration tools the AI wants to run."
    },
    "requestedTools": {
      "type": "array",
      "items": { "$ref": "#/$defs/toolRequest" },
      "description": "Alias for requestTools (legacy)."
    },
    "runTool": {
      "$ref": "#/$defs/toolRequest",
      "description": "Single tool to run (legacy single-tool form)."
    },
    "runTools": {
      "type": "array",
      "items": { "$ref": "#/$defs/toolRequest" },
      "description": "Tools to run (file modifications, validation, MCP). Preferred over runTool."
    }
  },
  "anyOf": [
    { "required": ["summary"] },
    { "required": ["requestFiles"] },
    { "required": ["requestedFiles"] },
    { "required": ["requestTools"] },
    { "required": ["requestedTools"] },
    { "required": ["runTool"] },
    { "required": ["runTools"] }
  ],
  "$defs": {
    "toolRequest": {
      "type": "object",
      "additionalProperties": true,
      "required": ["tool"],
      "properties": {
        "id": { "type": "string" },
        "tool": { "type": "string", "minLength": 1 },
        "args": {
          "description": "Tool arguments. May be a single string, a list of strings, or any JSON value (will be normalized).",
          "anyOf": [
            { "type": "string" },
            { "type": "array" },
            { "type": "object" },
            { "type": "number" },
            { "type": "boolean" },
            { "type": "null" }
          ]
        }
      }
    }
  }
}
```

### `src\main\resources\agent\schemas\writer-plan.schema.json`
```
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://github.com/anthropic-gitea-bot/agent/schemas/writer-plan.schema.json",
  "title": "WriterAgentPlan",
  "description": "Structured output contract for the writer agent (issue refinement / drafting).",
  "type": "object",
  "additionalProperties": true,
  "properties": {
    "qualityAssessment": {
      "type": "string",
      "description": "Free-form assessment of the current issue quality."
    },
    "clarifyingQuestions": {
      "type": "array",
      "items": { "type": "string", "minLength": 1 },
      "description": "Open questions the writer wants the user to answer."
    },
    "revisedIssueDraft": {
      "type": "string",
      "description": "Proposed revised issue body."
    },
    "assumptions": {
      "type": "array",
      "items": { "type": "string", "minLength": 1 }
    },
    "openQuestions": {
      "type": "array",
      "items": { "type": "string", "minLength": 1 }
    },
    "readyToCreate": {
      "type": "boolean",
      "description": "True when the draft is ready to be turned into a real issue."
    },
    "requestFiles": {
      "type": "array",
      "items": { "type": "string", "minLength": 1 },
      "description": "Files the writer wants to consult before drafting."
    },
    "requestTools": {
      "type": "array",
      "items": { "$ref": "#/$defs/toolRequest" },
      "description": "Repository exploration tools the writer wants to invoke."
    }
  },
  "anyOf": [
    { "required": ["qualityAssessment"] },
    { "required": ["clarifyingQuestions"] },
    { "required": ["revisedIssueDraft"] },
    { "required": ["readyToCreate"] },
    { "required": ["requestFiles"] },
    { "required": ["requestTools"] }
  ],
  "$defs": {
    "toolRequest": {
      "type": "object",
      "additionalProperties": true,
      "required": ["tool"],
      "properties": {
        "id": { "type": "string" },
        "tool": { "type": "string", "minLength": 1 },
        "args": {
          "anyOf": [
            { "type": "string" },
            { "type": "array" },
            { "type": "object" },
            { "type": "number" },
            { "type": "boolean" },
            { "type": "null" }
          ]
        }
      }
    }
  }
}
```

### `src\main\resources\static\js\collapsible-sections.js`
```
/**
 * Reusable collapsible-section helper.
 *
 * Persists the collapsed state of a group of Bootstrap `.collapse` elements
 * to `localStorage` and wires optional "Expand all" / "Collapse all" buttons.
 *
 * Usage:
 *   initCollapsibleSections({
 *       storageKey:        'systemSettings.collapsedSections',
 *       collapses:         document.querySelectorAll('[id^="section-"].collapse'),
 *       expandButton:      document.getElementById('expandAllSections'),
 *       collapseButton:    document.getElementById('collapseAllSections'),
 *       allowMultipleOpen: false
 *   });
 *
 * Options:
 *   storageKey         (string, required) localStorage key used to persist the
 *                      set of currently collapsed element IDs.
 *   collapses          (NodeList|Array, required) collapse elements to manage.
 *                      Each element must have an `id`. The button toggling it
 *                      is located via `[data-bs-target="#<id>"]`.
 *   expandButton       (Element, optional) clicking opens every collapse.
 *   collapseButton     (Element, optional) clicking closes every collapse.
 *   allowMultipleOpen  (bool, optional) when true, removes `data-bs-parent`
 *                      from the collapses so Bootstrap accordions can keep
 *                      multiple items open at once.
 */
(function (global) {
    function initCollapsibleSections(options) {
        const opts = options || {};
        const storageKey = opts.storageKey;
        const collapses = Array.from(opts.collapses || []);
        if (!storageKey || collapses.length === 0) {
            return;
        }

        if (opts.allowMultipleOpen) {
            collapses.forEach(function (el) {
                el.removeAttribute('data-bs-parent');
            });
        }

        // Persisted as { "<id>": true|false } where true = open, false = collapsed.
        // Using an explicit map (rather than just a set of collapsed IDs) ensures
        // that sections which the user *opened* in addition to the HTML default
        // are also restored correctly (important for Bootstrap accordions where
        // only the first item ships with `.show`).
        function loadStates() {
            try {
                const raw = JSON.parse(localStorage.getItem(storageKey));
                if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
                    return raw;
                }
                // Backward-compatibility: previous versions stored an array of
                // collapsed IDs. Convert it transparently.
                if (Array.isArray(raw)) {
                    const migrated = {};
                    raw.forEach(function (id) { migrated[id] = false; });
                    return migrated;
                }
            } catch (e) { /* ignore */ }
            return {};
        }

        function saveStates(states) {
            try {
                localStorage.setItem(storageKey, JSON.stringify(states));
            } catch (e) { /* ignore */ }
        }

        const states = loadStates();

        function findHeader(el) {
            return document.querySelector('[data-bs-target="#' + el.id + '"]');
        }

        function applyState(el, open) {
            const header = findHeader(el);
            if (open) {
                el.classList.add('show');
                if (header) {
                    header.classList.remove('collapsed');
                    header.setAttribute('aria-expanded', 'true');
                }
            } else {
                el.classList.remove('show');
                if (header) {
                    header.classList.add('collapsed');
                    header.setAttribute('aria-expanded', 'false');
                }
            }
        }

        // Apply persisted state before Bootstrap initializes transitions.
        collapses.forEach(function (el) {
            if (Object.prototype.hasOwnProperty.call(states, el.id)) {
                applyState(el, states[el.id] === true);
            }
        });

        collapses.forEach(function (el) {
            el.addEventListener('shown.bs.collapse', function () {
                states[el.id] = true;
                saveStates(states);
            });
            el.addEventListener('hidden.bs.collapse', function () {
                states[el.id] = false;
                saveStates(states);
            });
        });

        if (opts.expandButton) {
            opts.expandButton.addEventListener('click', function () {
                collapses.forEach(function (el) {
                    bootstrap.Collapse.getOrCreateInstance(el, { toggle: false }).show();
                });
            });
        }
        if (opts.collapseButton) {
            opts.collapseButton.addEventListener('click', function () {
                collapses.forEach(function (el) {
                    bootstrap.Collapse.getOrCreateInstance(el, { toggle: false }).hide();
                });
            });
        }
    }

    global.initCollapsibleSections = initCollapsibleSections;
})(window);


```

### `src\main\resources\static\js\theme-init.js`
```
(function() {
    const getStoredTheme = () => {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    };

    const setStoredTheme = theme => {
        try {
            if (theme === 'auto') {
                localStorage.removeItem('theme');
            } else {
                localStorage.setItem('theme', theme);
            }
        } catch (e) {}
    };

    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme();
        if (storedTheme) {
            return storedTheme;
        }
        return 'auto';
    };

    const setTheme = theme => {
        let actualTheme = theme;
        if (theme === 'auto') {
            actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            document.documentElement.style.colorScheme = 'light dark';
        } else {
            document.documentElement.style.colorScheme = theme;
        }
        document.documentElement.setAttribute('data-bs-theme', actualTheme);
        updateUI(theme, actualTheme);
    };

    const updateUI = (theme, actualTheme) => {
        // Update icons and buttons if they exist
        const themeIcon = document.getElementById('theme-icon');
        const themeToggle = document.getElementById('bd-theme');

        if (themeIcon) {
            if (actualTheme === 'dark') {
                themeIcon.classList.remove('bi-sun-fill');
                themeIcon.classList.add('bi-moon-stars-fill');
            } else {
                themeIcon.classList.remove('bi-moon-stars-fill');
                themeIcon.classList.add('bi-sun-fill');
            }
        }

        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', actualTheme === 'dark');
        }
    };

    // Initialize theme immediately to prevent flash
    setTheme(getPreferredTheme());

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const storedTheme = getStoredTheme();
        if (!storedTheme) {
            setTheme('auto');
        }
    });

    // Expose toggle function globally
    window.toggleTheme = () => {
        const currentTheme = getPreferredTheme();
        let newTheme;
        // Cycle: auto -> dark -> light -> auto
        if (currentTheme === 'auto') {
            newTheme = 'dark';
        } else if (currentTheme === 'dark') {
            newTheme = 'light';
        } else {
            newTheme = 'auto';
        }
        setStoredTheme(newTheme);
        setTheme(newTheme);
    };

    // When DOM is loaded, update UI again to catch any elements that weren't ready
    document.addEventListener('DOMContentLoaded', () => {
        setTheme(getPreferredTheme());

        const themeToggle = document.getElementById('bd-theme');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                window.toggleTheme();
            });
        }
    });
})();
```

### `src\test\resources\ai-responses\coding\01-runTools.json`
```
{
  "summary": "Added Hello World feature",
  "branchName": "ai-agent/hello-world",
  "runTools": [
    {
      "id": "tool-1",
      "tool": "patch-file",
      "args": ["src/main/java/Hello.java", "@@\n+ public class Hello {}\n"]
    },
    {
      "id": "tool-2",
      "tool": "mvn",
      "args": ["-B", "test"]
    }
  ]
}
```

### `src\test\resources\ai-responses\coding\02-context-request.json`
```
{
  "summary": "Need more context before implementing",
  "requestFiles": [
    "src/main/java/org/remus/giteabot/agent/IssueImplementationService.java",
    "src/main/java/org/remus/giteabot/agent/writerimpl/WriterAgentService.java"
  ],
  "requestTools": [
    { "id": "ctx-1", "tool": "rg", "args": ["AgentLoop", "src", "-n"] }
  ]
}
```

### `src\test\resources\ai-responses\coding\03-legacy-aliases.json`
```
{
  "summary": "Legacy single-tool form with field aliases",
  "requestedFiles": ["README.md"],
  "requestedTools": [
    { "tool": "ls", "args": "doc/" }
  ],
  "runTool": {
    "tool": "patch-file",
    "args": ["README.md", "@@\n+ updated\n"]
  }
}

```

### `src\test\resources\ai-responses\writer\01-ready.json`
```
{
  "qualityAssessment": "Issue is well-defined and ready to be turned into a real ticket.",
  "clarifyingQuestions": [],
  "revisedIssueDraft": "## Summary\nAdd dark mode toggle to the dashboard.\n\n## Acceptance criteria\n- Toggle persisted in localStorage\n- Defaults to system preference",
  "assumptions": ["Bootstrap 5 is already on the page"],
  "openQuestions": [],
  "readyToCreate": true,
  "requestFiles": [],
  "requestTools": []
}
```

### `src\test\resources\ai-responses\writer\02-questions.json`
```
{
  "qualityAssessment": "Need more information to draft a meaningful issue.",
  "clarifyingQuestions": [
    "Which user role should see the new button?",
    "Should the action be auditable?"
  ],
  "readyToCreate": false
}
```
