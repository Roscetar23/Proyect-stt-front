---
name: "next-phase-spec-generator"
displayName: "Next Phase Spec Generator"
description: "Generate specs for subsequent project phases by analyzing solution documents and previous completed specs to maintain consistency and structure"
keywords: ["spec", "phase", "generator", "requirements", "design", "tasks", "workflow"]
author: "Kiro Assistant"
---

# Next Phase Spec Generator

## Overview

This power helps you create specs for the next phase of your project by analyzing:
- Your solution architecture document (solutions/*.md)
- The previous completed spec (e.g., .kiro/specs/setup-inicial/)
- The established patterns and structure

It generates a complete spec (requirements.md, design.md, tasks.md) for the next phase following the same methodology and structure as your previous specs.

## Onboarding

### Prerequisites
- A solution architecture document in `solutions/` directory
- At least one completed spec in `.kiro/specs/` directory
- Understanding of your project phases

### How It Works
1. Identifies available solution documents
2. Lists completed specs to understand the pattern
3. Extracts the next phase from the solution document
4. Generates requirements.md, design.md, and tasks.md following the established structure

## Common Workflows

### Workflow 1: Generate Next Phase Spec

**Goal:** Create a complete spec for the next project phase

**Steps:**
1. Identify the solution document (usually in `solutions/` directory)
2. Identify the last completed spec (e.g., `setup-inicial`)
3. Determine which phase is next from the solution document
4. Generate the new spec folder and files

**Example:**
```
User: "Create the spec for Phase 2 (Sistema de Rachas)"

Agent will:
1. Read solutions/architecture-gamification-system.md
2. Analyze .kiro/specs/setup-inicial/ structure
3. Extract Phase 2 details from solution
4. Create .kiro/specs/sistema-rachas/ with:
   - requirements.md
   - design.md
   - tasks.md
   - .config.kiro
```

### Workflow 2: Analyze Solution Document

**Goal:** Understand all phases in the solution document

**Steps:**
1. Read the solution document
2. Extract all phases with their descriptions
3. Identify which phases are completed
4. Show which phase should be next

**Example:**
```
User: "What phases are in my solution document?"

Agent will:
1. Read solutions/*.md
2. List all phases (Fase 1, Fase 2, Fase 3, etc.)
3. Show which specs already exist
4. Recommend which phase to create next
```

### Workflow 3: Maintain Consistency

**Goal:** Ensure new specs follow the same structure as previous ones

**Steps:**
1. Analyze the structure of completed specs
2. Identify patterns in:
   - Requirements format (user stories, acceptance criteria)
   - Design format (architecture, components, data models)
   - Tasks format (task breakdown, subtasks, requirements references)
3. Apply the same patterns to the new spec

**Example:**
```
The generator will maintain:
- Same requirements.md structure (Introduction, Glossary, Requirements with User Stories and Acceptance Criteria)
- Same design.md structure (Overview, Architecture, Components, Data Models, Correctness Properties)
- Same tasks.md structure (Overview, Tasks with subtasks and requirement references)
- Same naming conventions (kebab-case for folder names)
```

## Key Concepts

### Solution Document Structure

The solution document typically contains:
- **Executive Summary**: Project overview
- **Context and Objectives**: Goals and constraints
- **High-Level Architecture**: System design
- **Detailed Technical Design**: Components and patterns
- **Implementation Plan**: Phases with tasks

### Spec Structure

Each spec should have:
- **requirements.md**: Business requirements with user stories and acceptance criteria
- **design.md**: Technical design with architecture, components, and correctness properties
- **tasks.md**: Implementation tasks with subtasks and requirement references
- **.config.kiro**: Configuration (specType, workflowType)

### Phase Extraction

When extracting a phase from the solution document:
1. Identify the phase number and name
2. Extract the phase description and objectives
3. List all tasks/features for that phase
4. Identify dependencies on previous phases
5. Determine technical components needed

### Consistency Patterns

Maintain consistency in:
- **Naming**: Use kebab-case for folder names (e.g., sistema-rachas, sistema-niveles)
- **Structure**: Follow the same document sections
- **Format**: Use the same markdown formatting
- **References**: Link requirements to design to tasks
- **Property-Based Testing**: Include correctness properties in design

## Best Practices

### Before Generating

1. **Review the solution document** - Understand all phases
2. **Analyze completed specs** - Understand the established pattern
3. **Identify dependencies** - Know what the new phase depends on
4. **Clarify scope** - Ensure the phase scope is clear

### During Generation

1. **Follow the structure** - Use the same format as previous specs
2. **Reference requirements** - Link design and tasks to requirements
3. **Include properties** - Add correctness properties for testing
4. **Be specific** - Provide concrete, actionable tasks
5. **Consider dependencies** - Reference previous phase components

### After Generation

1. **Review for consistency** - Compare with previous specs
2. **Verify completeness** - Ensure all sections are filled
3. **Check references** - Verify requirement/design/task links
4. **Validate scope** - Ensure phase scope is appropriate

## Troubleshooting

### Issue: Can't find solution document

**Cause:** Solution document not in expected location

**Solution:**
1. Check `solutions/` directory
2. Look for `.md` files with architecture or solution in the name
3. Ask user for the correct path

### Issue: Previous spec structure unclear

**Cause:** First spec has unusual structure

**Solution:**
1. Ask user to clarify the intended structure
2. Review the spec-task-executor power documentation
3. Follow standard spec structure if unclear

### Issue: Phase details incomplete in solution

**Cause:** Solution document lacks detail for the phase

**Solution:**
1. Extract what's available from the solution
2. Ask user for additional details
3. Reference similar phases for patterns
4. Generate a draft and iterate with user

### Issue: Unclear which phase is next

**Cause:** Multiple phases could be next

**Solution:**
1. List all phases from solution
2. Show which specs already exist
3. Ask user which phase they want to create
4. Recommend based on dependencies

## Configuration

**No configuration required** - This is a Knowledge Base Power that provides guidance and workflows.

The power works by:
1. Reading your solution documents
2. Analyzing your existing specs
3. Generating new specs following established patterns

---

**Power Type:** Knowledge Base Power
**No MCP Server Required**
