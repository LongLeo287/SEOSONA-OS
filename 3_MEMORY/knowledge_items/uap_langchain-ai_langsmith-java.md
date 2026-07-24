# KI: langchain-ai/langsmith-java

## Overview
The [LangSmith](https://www.langchain.com/langsmith/observability) Java SDK provides convenient access to the LangSmith [REST API](https://api.smith.langchain.com/docs) from applications written in Java.

## Architecture & Tech Stack
- Could not detect automatically
- **Total files:** 94 files across 44 directories
- **File types:** .kt: 62, .kts: 9, .yml: 7, .md: 6, .json: 3, .properties: 2, .gitignore: 1

## Documentation Sections
- LangSmith Java SDK
- Installation
- Gradle
- Maven
- Requirements
- Usage
- Examples
- Running Examples
- Set required environment variables
- Run a specific example
- Available Examples
- Client configuration
- Modifying configuration
- Requests and responses
- Immutability
- Asynchronous execution
- File uploads
- Raw responses

## Core Structure
```
  .gitignore
  .release-please-manifest.json
  .stats.yml
  AGENTS.md
  CHANGELOG.md
  CONTRIBUTING.md
  LICENSE
  README.md
  SECURITY.md
  SECURITY_FIX_PLAN.md
  build.gradle.kts
  gradle.properties
  gradlew
  gradlew.bat
  release-please-config.json
  settings.gradle.kts
  .devcontainer/
    Dockerfile
    devcontainer.json
  .github/
    dependabot.yml
    codeql/
      codeql-config.yml
    workflows/
      ci.yml
      codeql.yml
      publish-sonatype.yml
      release-doctor.yml
  bin/
    check-release-environment
  buildSrc/
    build.gradle.kts
    src/
      main/
        kotlin/
          langchain.java.gradle.kts
          langchain.kotlin.gradle.kts
          langchain.publish.gradle.kts
  gradle/
    wrapper/
      gradle-wrapper.jar
      gradle-wrapper.properties
  langchain-java-lib/
    .keep
  langsmith-java/
    build.gradle.kts
  langsmith-java-client-okhttp/
    build.gradle.kts
    src/
      main/
        kotlin/
          com/
            langchain/
              smith/
                client/
                  okhttp/
                    LangsmithOkHttpClient.kt
                    LangsmithOkHttpClientAsync.kt
                    OkHttpClient.kt
                    OkHttpLangsmithClientProvider.kt
        resources/
          META-INF/
            services/
              com.langchain.smith.tracing.LangsmithClientProvider
      test/
        kotlin/
          com/
            langchain/
              smith/
                client/
                  okhttp/
                    OkHttpClientTest.kt
  langsmith-java-core/
    build.gradle.kts
    src/
      main/
        kotlin/
          com/
            langchain/
              smith/
                client/
                  AutoBatchIngestLimits.kt
                  AutoBatchQueue.kt
                  LangsmithClient.kt
                  LangsmithClientAsync.kt
                  LangsmithClientAsyncImpl.kt
                  LangsmithClientImpl.kt
                  RunMultipartBatch.kt
                core/
                  AutoPager.kt
                  AutoPagerAsync.kt
                  BaseDeserializer.kt
                  BaseSerializer.kt
                  Check.kt
                  ClientOptions.kt
                  DefaultSleeper.kt
                  LogLevel.kt
                  ObjectMappers.kt
                  Page.kt
                  PageAsync.kt
                  Params.kt
                  PhantomReachable.kt
                  PhantomReachableExecutorService.kt
```

## Quick Start
```bash
<!-- x-release-please-end -->
This library requires Java 8 or later.
This repository includes runnable examples in the `langsmith-java-example` module to help you get started.
Examples can be run using Gradle:
All examples are available in [`langsmith-java-example`](langsmith-java-example).
Configure the client using system properties or environment variables:
```

## Agent Configuration

--- AGENTS.md ---
# Agent Guidelines

Code conventions and patterns for this project, learned from review feedback.

## Code structure

### Break up complex functions with helpers

When a function has deeply nested logic or multiple concerns, extract helpers. Use `flatMap` + small named functions instead of imperative loops with nested `when`/`if`:

```kotlin
// Good
fun format(variables: Map<String, Any>): PromptMessages {
    val formatted = messages.flatMap { msg ->
        if (msg.isPlaceholder()) expandPlaceholder(msg, variables)
        else listOf(PromptMessage.withTemplate(msg, msg.format(variables)))
    }
    return PromptMessages(formatted, inputVariables, outputSchema)
}

private fun expandPlaceholder(msg: PromptMessage, variables: Map<String, Any>): List<PromptMessage> {
    val items = variables[msg.template] as? List<*> ?: return emptyList()
    return items.mapNotNull(::toPromptMessage)
}

// Bad — deeply nested imperative loop
fun format(variables: Map<String, Any>): PromptMessages {
    val formatted = mutableListOf<PromptMessage>()
    for (msg in messages) {
        if (msg.isPlaceholder()) {
            val value = variables[msg.template]
            if (value is List<*>) {
                for (item in value) {
                    when (item) {
                        is PromptMessage -> formatted.add(item)
                        is Map<*, *> -> { /* 15 more lines */ }
                    }
                }
            }
        } else { ... }
    }
}
```

## Kotlin idioms

### Prefer immutable collection transformations

Avoid mutable accumulators when `map`, `filter`, `partition`, `associate`, `buildMap`, or `buildList` express the same logic clearly. Use mutation only when it materially improves readability, performance, or is required by an API.

### Use `buildMap` / `buildList` instead of mutable + convert

```kotlin
// Good
val messages = items.map { msg ->
    buildMap<String, String> {
        put("role", msg.role)
        put("content", msg.content)
  

--- CONTRIBUTING.md ---
# Contributing

Thanks for your interest in contributing to the LangSmith Java SDK!

## Overview

This SDK is **auto-generated by [Stainless](https://www.stainless.com/)** from our OpenAPI spec. Custom code (prompts, OTel wrappers, etc.) lives alongside generated code — Stainless is configured to [preserve custom code](https://www.stainless.com/docs/sdks/configure/custom-code/) and never overwrite it.

> **Important:** Most files in the SDK are genera

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
