---
description: Publica packages/autoskills con release segura
---

Prepara la publicación de `packages/autoskills`.

Bump solicitado: `$1`

Reglas:

- El bump debe ser `patch`, `minor` o `major`.
- Si `$1` está vacío o no es válido, pregunta cuál usar antes de continuar.
- Antes de publicar, explica que el script de release valida el registry, ejecuta tests, genera changelog, crea commit y tag, publica el paquete, pushea a GitHub y crea la GitHub Release.
- Comprueba que estás en `main` y que no hay cambios sin commitear:
  - `git branch --show-current`
  - `git status --short`
- Si no estás en `main`, detente y explica que la release solo debe hacerse desde `main`.
- Si hay cambios sin commitear, detente y lista los archivos pendientes.
- Si todo está listo, pide confirmación explícita antes de ejecutar.
- Solo después de recibir confirmación, ejecuta:
  `pnpm --dir packages/autoskills release $1`

Al terminar, resume la versión publicada, el tag creado y cualquier aviso importante del proceso.
