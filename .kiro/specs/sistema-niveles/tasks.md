# Implementation Plan: Sistema de Niveles

## Overview

Este plan descompone la implementación del Sistema de Niveles en tareas ejecutables. El enfoque es incremental: primero implementamos el LevelSystem con sus rutas, luego los componentes de UI, después las pantallas, y finalmente validamos todo el sistema con tests.

El plan incluye property-based tests para validar propiedades universales y unit tests para casos específicos. Las tareas de testing están marcadas como opcionales (*) para permitir un MVP más rápido.

Esta fase construye sobre la infraestructura de Phase 1 (setup-inicial) y Phase 2 (sistema-rachas): Zustand Store, Mock API, Storage Service, utilidades, y sistema de rachas existente.

## Tasks

- [x] 1. Implementar LevelSystem Module
  - [x] 1.1 Crear estructura del módulo levelSystem
    - Crear carpeta src/modules/levelSystem/
    - Crear index.js con clase LevelSystem
    - Crear routes.js con definiciones de rutas
    - Crear experienceCalculator.js para cálculos de XP
    - Crear validators.js para funciones de validación
    - Exportar LevelSystem como singleton
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 1.2 Implementar calculateLevel
    - Implementar lógica para calcular nivel desde experiencia
    - Soportar las 4 rutas (beginner, intermediate, advanced, expert)
    - Manejar caso de experiencia = 0 (retornar nivel 1)
    - Validar que route es válida
    - Retornar nivel más alto alcanzado con la experiencia dada
    - _Requirements: 1.1, 1.2_
  
  - [x] 1.3 Implementar getLevelInfo
    - Obtener información de un nivel específico en una ruta
    - Retornar objeto con level, experienceRequired, title, unlockedFeatures
    - Retornar null si nivel no existe en la ruta
    - Validar inputs (level, route)
    - _Requirements: 1.4, 3.1_
  
  - [x] 1.4 Implementar getExperienceForNextLevel
    - Calcular experiencia necesaria para el siguiente nivel
    - Retornar 0 si ya está en el nivel máximo de la ruta
    - Validar que currentLevel es válido
    - _Requirements: 5.1, 5.2_
  
  - [x] 1.5 Implementar calculateProgress
    - Calcular progreso hacia el siguiente nivel
    - Retornar objeto con percent, current, needed
    - Manejar caso de nivel máximo (retornar 100%)
    - Asegurar que percent está entre 0 y 100
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [x] 1.6 Implementar getUnlockedFeatures
    - Obtener todas las features desbloqueadas hasta el nivel actual
    - Acumular features de todos los niveles anteriores
    - Retornar array de strings con IDs de features
    - Manejar caso de nivel 1 (solo features del nivel 1)
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 1.7 Implementar canChangeRoute
    - Verificar si usuario puede cambiar a una ruta específica
    - Validar que nueva ruta es la siguiente en secuencia
    - Verificar que nivel actual cumple requisito de completación
    - Retornar boolean
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 1.8 Implementar assessUserLevel
    - Evaluar puntaje de test y recomendar ruta
    - Mapear puntaje 0-30% → beginner
    - Mapear puntaje 31-60% → intermediate
    - Mapear puntaje 61-85% → advanced
    - Mapear puntaje 86-100% → expert
    - _Requirements: 7.1, 7.2, 7.3_

