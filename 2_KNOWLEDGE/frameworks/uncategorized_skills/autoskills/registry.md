---
description: Sincroniza y valida el registry de skills
---

Sincroniza y valida el registry de `packages/autoskills`.

Argumentos recibidos: `$ARGUMENTS`

Ejecuta:

1. `pnpm --dir packages/autoskills sync:skills`
2. `pnpm --dir packages/autoskills validate:registry`

Reglas:

- Si `$ARGUMENTS` menciona `validate`, ejecuta solo la validación.
- Si `$ARGUMENTS` menciona `sync`, ejecuta sincronización y después validación.
- Si falla la validación, identifica la skill, archivo o hash desactualizado cuando aparezca en la salida.
- No modifiques `README.md` salvo que el usuario lo pida explícitamente.

Al terminar, resume si el registry quedó sincronizado y validado.
