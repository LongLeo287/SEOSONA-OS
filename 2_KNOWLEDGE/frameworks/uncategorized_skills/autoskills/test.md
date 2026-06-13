---
description: Ejecuta los tests de packages/autoskills con filtro opcional
---

Ejecuta los tests de `packages/autoskills`.

Argumentos recibidos: `$ARGUMENTS`

Reglas:

- Si no hay argumentos, ejecuta todos los tests:
  `pnpm --dir packages/autoskills test`
- Si hay argumentos, interprétalos como una pista flexible para elegir uno o varios archivos de `packages/autoskills/tests/*.test.ts`.
- No hace falta que el usuario escriba el nombre exacto. Acepta pistas como `cli`, `detect agents`, `detect-agents`, `workspace`, `collect`, `installer` o `claude`.
- Si el contexto actual menciona o está trabajando sobre una suite concreta, úsalo para desambiguar la pista.
- Si hay una única coincidencia, ejecuta solo ese archivo:
  `pnpm --dir packages/autoskills exec node --test tests/<archivo>.test.ts`
- Si hay varias coincidencias, elige la más probable por contexto. Si sigue siendo ambiguo, muestra las opciones y pregunta cuál usar.
- Si no hay coincidencias, muestra los archivos disponibles y pregunta cuál usar.

Para resolver coincidencias, lista los tests disponibles con:

```bash
rg --files packages/autoskills/tests -g "*.test.ts"
```

Después de ejecutar los tests, resume el resultado y destaca los fallos importantes si los hay. No modifiques archivos salvo que el usuario lo pida explícitamente.
