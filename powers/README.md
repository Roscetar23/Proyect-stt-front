# Kiro Powers

Esta carpeta contiene 3 Kiro Powers personalizados para gestión de proyectos y arquitectura.

## Powers Disponibles

### 1. Spec Task Executor
**Ubicación**: `powers/spec-task-executor/`
**Tipo**: Knowledge Base Power (sin MCP)

Ejecuta tareas de implementación de specs de forma enfocada, leyendo requirements, design y tasks de una carpeta específica para evitar confusiones entre múltiples specs.

**Características**:
- Lee documentos de spec (requirements.md, design.md, tasks.md)
- Ejecuta tareas paso a paso según el plan
- Mantiene foco en un solo spec a la vez
- Actualiza estado de tareas automáticamente
- Incluye subagent en `.kiro/agents/`

**Uso**: `"Ejecuta las tareas del spec setup-inicial"`

---

### 2. Initiative Architect
**Ubicación**: `powers/initiative-architect/`
**Tipo**: Knowledge Base Power (sin MCP)

Ingeniero especializado en entrevistar clientes para documentar iniciativas de negocio. Hace preguntas estratégicas para extraer contexto completo y genera documentación README estructurada.

**Características**:
- Conduce entrevistas estructuradas
- Hace preguntas sobre objetivos, alcance, stakeholders
- Puede investigar industrias y mejores prácticas (con permiso)
- Genera README profesional completo
- Comunicación en español

**Uso**: `"Quiero documentar una nueva iniciativa de negocio"`

---

### 3. Solution Architect
**Ubicación**: `powers/solution-architect/`
**Tipo**: Knowledge Base Power (sin MCP)

Arquitecto de soluciones especializado en diseño de arquitectura de alto nivel, patrones técnicos y consideraciones de infraestructura. Genera documentación técnica en español.

**Características**:
- Analiza código existente
- Diseña arquitecturas de alto nivel
- Recomienda patrones y tecnologías
- Considera infraestructura y deployment
- Genera documentación en `solutions/`
- Siempre pide permiso para búsquedas web

**Uso**: `"Necesito diseñar la arquitectura para el sistema de gamificación"`

---

## Instalación

Para usar estos Powers en Kiro:

1. Copia la carpeta `powers/` a tu proyecto
2. Los Powers estarán disponibles automáticamente
3. Invoca cada Power según su uso específico

## Estructura de Archivos

```
powers/
├── README.md (este archivo)
├── spec-task-executor/
│   ├── POWER.md
│   └── .kiro/
│       └── agents/
│           └── spec-task-executor.md
├── initiative-architect/
│   └── POWER.md
└── solution-architect/
    └── POWER.md
```

## Notas

- Todos son **Knowledge Base Powers** (no requieren mcp.json)
- La documentación completa está en cada archivo POWER.md
- El spec-task-executor incluye un subagent adicional
- Toda la comunicación es en español
