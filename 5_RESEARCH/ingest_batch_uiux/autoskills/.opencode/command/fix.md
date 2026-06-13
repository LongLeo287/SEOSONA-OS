---
description: Formatea y corrige lint automáticamente
---

Formatea el repo y corrige problemas simples de lint.

Argumentos recibidos: `$ARGUMENTS`

Ejecuta:

1. `pnpm fmt`
2. `pnpm lint:fix`
3. `pnpm lint`
4. `pnpm fmt:check`

Reglas:

- No modifiques `README.md` salvo que el usuario lo pida explícitamente.
- Si `$ARGUMENTS` menciona archivos o carpetas concretas, limita el análisis y el resumen a ese alcance cuando sea posible.
- Si quedan errores, resume cuáles requieren intervención manual.
- Al terminar, indica qué comandos pasaron y qué archivos quedaron modificados.
