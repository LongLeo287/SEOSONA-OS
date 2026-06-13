---
description: Ejecuta lint, formato, build, tests y registry
---

Ejecuta una validación completa del proyecto.

Argumentos recibidos: `$ARGUMENTS`

Pasos:

1. Ejecuta el lint del repo:
   `pnpm lint`
2. Comprueba el formato:
   `pnpm fmt:check`
3. Compila `packages/autoskills`:
   `pnpm --dir packages/autoskills build`
4. Ejecuta todos los tests de `packages/autoskills`:
   `pnpm --dir packages/autoskills test`
5. Valida el registry de skills:
   `pnpm --dir packages/autoskills validate:registry`

Si `$ARGUMENTS` incluye una pista como `quick`, `tests`, `lint`, `format`, `build` o `registry`, prioriza solo esos checks y explica qué has omitido.

Al terminar, resume el resultado separando los fallos por lint, formato, build, tests o registry.
