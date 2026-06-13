# TypeScript & Effect Patterns

Distilled knowledge from the `autoskills`, `Effect`, and `Types` ecosystem by Kit Langton.

## 1. Advanced TypeScript

- **Type-Level Programming:** TypeScript serves not merely as a type checker, but as a Turing-complete language capable of executing logic at the type level (utilizing Conditional Types, Mapped Types, and Template Literal Types).
- **Discriminated Unions (Tagged Unions):** It is mandatory to use this pattern when defining State or API responses. Instead of a single object bloated with optional fields, split it into distinct objects sharing a discriminator field (usually `_tag` or `status`).
  ```ts
  type APIResponse =
    | { status: 'loading' }
    | { status: 'success'; data: User }
    | { status: 'error'; message: string };
  ```
- **Opaque Types (Branded Types):** Employ Branded Types to distinguish primitive types that share the same base type but carry distinct semantics (e.g., distinguishing a `UserId` from a `PostId` even though both are `string` at runtime).

## 2. The Effect Ecosystem (Effect TS)

Effect is a comprehensive standard library for TypeScript, unlocking the power of Functional Programming and highly robust Side Effect management.

- **Effect<Success, Error, Requirements>:** Every operation in Effect returns a type parameterized by three arguments:
  - `Success`: The return type upon successful execution (similar to the generic type in a Promise).
  - `Error`: The specific, strongly-typed errors that may occur (eliminating the implicit `any` of traditional `try/catch`).
  - `Requirements` (Context): The dependencies required for the operation to execute (e.g., a Database connection or Logger configuration).
- **Eliminating Try/Catch:** Effect treats Errors as Values. By explicitly typing the Error in the second parameter, TypeScript forces developers to handle ALL potential errors at compile time.
- **Seamless Dependency Injection (DI):** The ability to inject Requirements (the third parameter) makes mocking data and writing Unit Tests exceptionally simple, avoiding the need for heavy OOP-style DI frameworks.

## 3. Auto-skills Architecture

Constructing "Skills" for AI Agents requires a highly modular design:
- **Strict Input Schemas:** Each "Skill" must define a precise input schema using `Zod` or `Typebox` so the AI explicitly understands the expected parameters.
- **Structured Output:** The output must always be structured data (JSON), allowing the AI to seamlessly parse the information and pass it to subsequent Skills, avoiding unpredictable free-text responses.
