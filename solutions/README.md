# Documentación de Arquitectura - Solutions

Este directorio contiene la documentación técnica de arquitectura para el proyecto.

## 📚 Índice de Documentos

### 1. [Sistema de Gamificación](./architecture-gamification-system.md)
**Fecha**: Febrero 2026  
**Descripción**: Arquitectura completa para el sistema de gamificación que incluye:
- Rachas Multi-Factor con Pilar del Día
- Sistema de Niveles de Maestría tipo RPG
- Sistema de Logros y Celebraciones
- Notificaciones Push con Expo

**Tecnologías**: React Native, Expo, Zustand, AsyncStorage, Expo Notifications

**Estado**: ✅ Diseño Completo

---

## 🎯 Propósito de este Directorio

Este directorio sirve como repositorio central de documentación técnica de arquitectura, incluyendo:
- Diseños de alto nivel
- Patrones técnicos y estructuras de datos
- Consideraciones de infraestructura
- Flujos de usuario y diagramas
- Planes de implementación

## 📖 Convenciones

### Nomenclatura de Archivos
- `architecture-[nombre-sistema].md` - Documentos principales de arquitectura
- `design-[nombre-feature].md` - Diseños técnicos específicos
- `adr-[numero]-[titulo].md` - Architecture Decision Records

### Estructura de Documentos
Cada documento de arquitectura sigue esta estructura estándar:
1. Resumen Ejecutivo
2. Contexto y Objetivos
3. Arquitectura de Alto Nivel
4. Diseño Técnico Detallado
5. Flujos de Usuario
6. Consideraciones de Infraestructura
7. Riesgos y Mitigaciones
8. Próximos Pasos
9. Referencias

### Diagramas
- Usamos Mermaid para diagramas embebidos en Markdown
- Los diagramas complejos pueden estar en archivos separados

## 🔄 Proceso de Actualización

1. Los documentos se actualizan cuando hay cambios significativos en la arquitectura
2. Cada actualización debe incluir fecha y descripción de cambios
3. Los documentos obsoletos se marcan con `[DEPRECATED]` en el título

## 🤝 Contribución

Para agregar nueva documentación:
1. Usa el agente `@solution-architect` para generar documentación estructurada
2. Sigue las convenciones de nomenclatura
3. Actualiza este README con el nuevo documento

---

*Última actualización: Febrero 2026*
