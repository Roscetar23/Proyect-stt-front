---
name: "spec-task-executor"
displayName: "Spec Task Executor"
description: "Ejecuta tareas de implementación de specs de forma enfocada, leyendo requirements, design y tasks de una carpeta específica para evitar confusiones entre múltiples specs."
keywords: ["spec", "tasks", "implementation", "requirements", "design", "execution"]
author: "Tu Nombre"
---

# Spec Task Executor

## Overview

Este Power te ayuda a ejecutar tareas de implementación de specs de forma enfocada y organizada. Cuando tienes múltiples specs en tu proyecto (setup-inicial, sistema-rachas, sistema-niveles, etc.), este Power se enfoca exclusivamente en la carpeta de spec que le indiques, evitando confusiones y manteniendo el contexto claro.

El Spec Task Executor:
- Lee los documentos de spec (requirements.md, design.md, tasks.md) de la carpeta específica que indiques
- Ejecuta las tareas paso a paso según el plan definido
- Mantiene el foco en un solo spec a la vez
- Actualiza el estado de las tareas conforme avanzas
- Valida que se cumplan los requisitos y el diseño

## Onboarding

### Prerequisitos

- Tener specs creados en `.kiro/specs/{nombre-spec}/`
- Cada spec debe tener al menos:
  - `requirements.md` - Documento de requisitos
  - `design.md` - Documento de diseño técnico
  - `tasks.md` - Lista de tareas de implementación

### Cómo Usar

1. **Identifica el spec** que quieres implementar (ej: `setup-inicial`)
2. **Invoca este Power** indicando la carpeta del spec
3. **El Power leerá** automáticamente los 3 documentos del spec
4. **Ejecutará las tareas** una por una según el plan

### Ejemplo de Uso

```
"Ejecuta las tareas del spec setup-inicial"
```

El Power automáticamente:
- Lee `.kiro/specs/setup-inicial/requirements.md`
- Lee `.kiro/specs/setup-inicial/design.md`
- Lee `.kiro/specs/setup-inicial/tasks.md`
- Comienza a ejecutar las tareas en orden

## Common Workflows

### Workflow 1: Ejecutar Todas las Tareas de un Spec

**Objetivo**: Implementar completamente un spec ejecutando todas sus tareas.

**Pasos**:
1. Indica el nombre del spec: "Ejecuta todas las tareas del spec {nombre-spec}"
2. El Power lee los documentos del spec
3. Identifica todas las tareas pendientes
4. Ejecuta cada tarea en orden
5. Actualiza el estado de cada tarea (in_progress → completed)
6. Valida que se cumplan los requisitos

**Ejemplo**:
```
"Ejecuta todas las tareas del spec setup-inicial"
```

### Workflow 2: Ejecutar una Tarea Específica

**Objetivo**: Implementar solo una tarea específica del spec.

**Pasos**:
1. Indica el spec y la tarea: "Ejecuta la tarea 2.1 del spec {nombre-spec}"
2. El Power lee los documentos del spec
3. Localiza la tarea específica
4. Lee el contexto necesario (requisitos y diseño relacionados)
5. Ejecuta la tarea
6. Actualiza el estado de la tarea

**Ejemplo**:
```
"Ejecuta la tarea 2.1 del spec setup-inicial"
```

### Workflow 3: Continuar desde Donde se Quedó

**Objetivo**: Reanudar la ejecución de tareas desde la última tarea completada.

**Pasos**:
1. Indica: "Continúa con el spec {nombre-spec}"
2. El Power lee el tasks.md
3. Identifica la primera tarea pendiente
4. Continúa la ejecución desde ahí

**Ejemplo**:
```
"Continúa con el spec setup-inicial"
```

### Workflow 4: Validar Implementación

**Objetivo**: Verificar que la implementación cumple con los requisitos y diseño.

**Pasos**:
1. Indica: "Valida el spec {nombre-spec}"
2. El Power lee requirements.md y design.md
3. Revisa el código implementado
4. Verifica que se cumplan los criterios de aceptación
5. Ejecuta tests si están definidos
6. Reporta el estado de validación

**Ejemplo**:
```
"Valida el spec setup-inicial"
```

## Estructura de Specs

Los specs deben estar organizados en:

```
.kiro/specs/
├── {nombre-spec}/
│   ├── requirements.md    # Requisitos y criterios de aceptación
│   ├── design.md          # Diseño técnico y arquitectura
│   └── tasks.md           # Lista de tareas de implementación
```

### Formato de tasks.md

Las tareas usan formato markdown con checkboxes:

```markdown
- [ ] 1. Tarea principal
  - [ ] 1.1 Sub-tarea 1
  - [ ] 1.2 Sub-tarea 2
- [ ] 2. Otra tarea principal
```

Estados de tareas:
- `[ ]` - No iniciada
- `[~]` - En cola
- `[-]` - En progreso
- `[x]` - Completada

## Best Practices

- **Un spec a la vez**: Enfócate en completar un spec antes de pasar al siguiente
- **Sigue el orden**: Ejecuta las tareas en el orden definido en tasks.md
- **Valida frecuentemente**: Ejecuta tests después de cada tarea importante
- **Lee el contexto**: Siempre revisa requirements.md y design.md antes de implementar
- **Actualiza el estado**: Marca las tareas como completadas conforme avanzas
- **Documenta cambios**: Si te desvías del diseño, documenta por qué

## Troubleshooting

### Error: "Spec no encontrado"

**Causa**: La carpeta del spec no existe o el nombre está mal escrito

**Solución**:
1. Verifica que existe `.kiro/specs/{nombre-spec}/`
2. Revisa que el nombre esté en kebab-case (ej: `setup-inicial`, no `Setup Inicial`)
3. Lista los specs disponibles: `ls .kiro/specs/`

### Error: "Archivo de spec faltante"

**Causa**: Falta alguno de los archivos requeridos (requirements.md, design.md, o tasks.md)

**Solución**:
1. Verifica que existen los 3 archivos en la carpeta del spec
2. Si falta alguno, créalo antes de ejecutar tareas
3. Usa el workflow de creación de specs para generar los archivos faltantes

### Error: "Tarea no encontrada"

**Causa**: El número de tarea especificado no existe en tasks.md

**Solución**:
1. Abre `.kiro/specs/{nombre-spec}/tasks.md`
2. Verifica el número correcto de la tarea
3. Usa el formato correcto: "tarea 2.1" o "tarea 2"

### Problema: "Confusión entre múltiples specs"

**Causa**: Tienes varios specs y el contexto se mezcla

**Solución**:
1. Siempre especifica el nombre del spec explícitamente
2. Trabaja en un solo spec a la vez
3. Usa este Power para mantener el foco en un spec específico

## Configuration

**No se requiere configuración adicional** - el Power funciona automáticamente una vez que tienes specs creados en `.kiro/specs/`.

## Tips para Múltiples Specs

Cuando tienes varios specs en tu proyecto:

1. **Prioriza**: Decide qué spec implementar primero
2. **Completa uno antes de empezar otro**: Evita tener múltiples specs a medias
3. **Usa nombres descriptivos**: `setup-inicial`, `sistema-rachas`, `sistema-niveles`
4. **Mantén specs independientes**: Cada spec debe ser autocontenido
5. **Documenta dependencias**: Si un spec depende de otro, documéntalo en requirements.md

---

**Ubicación de Specs**: `.kiro/specs/{nombre-spec}/`
**Archivos Requeridos**: `requirements.md`, `design.md`, `tasks.md`
