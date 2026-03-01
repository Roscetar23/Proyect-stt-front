# 🗺️ El Camino de Leyendas: Sistema de Progresión Gamificado

¡Adiós a las listas aburridas! Hemos evolucionado el sistema de niveles hacia un **Sendero de Aventura Interactivo** (estilo Duolingo). Cada nivel ahora es una parada en tu viaje, con retroalimentación visual, anillos de progreso y recompensas que hacen que subir de rango sea adictivo.

## 📊 Barra de Estado Global
```
🔥 Rachas: 12 Días   |   💎 XP Actual: 3,733   |   🛡️ Rango: Estudiante
```

## 🚀 Cómo Acceder al Mapa

### Ejecutar la Aplicación
```bash
# Inicia la app y presiona 'w' para verla en el navegador o ábrela en tu emulador
npm start
```

### Navegar al Camino
Una vez dentro, dirígete a la pestaña de navegación inferior: **🗺️ Camino**.

## 🛤️ ¿Cómo Funciona el Mapa de Aventura?

El mapa está diseñado en un formato de **scroll vertical** con un diseño en **"zig-zag"**. A medida que deslizas la pantalla, verás tu recorrido:

### 🟢 Nodos Completados (Tu Legado)
- **✨ Visual**: Círculos de color sólido con un icono de "Check" (✔) o el emblema del hito
- **👆 Interacción**: Toca cualquier nodo pasado para recordar qué funcionalidades desbloqueaste en ese momento
- **🎁 Recompensa**: ¡Cofre del Tesoro Abierto! Muestra las features que desbloqueaste

### 🔄 El Nodo Actual (Tu Meta Inmediata)
- **🎯 Visual**: Un círculo más grande que los demás, rodeado por un **Anillo de Progreso** que se va llenando a medida que ganas XP
- **💬 Tooltip**: Un globo de diálogo flotante que dice "START" o "CONTINUAR" salta suavemente sobre este nodo
- **👆 Interacción**: Al presionarlo, ves exactamente cuánta XP te falta para llenar el anillo y avanzar al siguiente paso
- **� Animación**: Pulsa suavementve para llamar tu atención

### 🔒 Nodos Bloqueados (El Futuro)
- **⚪ Visual**: Círculos en color gris/desaturado con iconos de candados o trofeos grises
- **👆 Interacción**: Tócalos para obtener un **Sneak Peek** (Vistazo) del título o la recompensa que te espera si llegas allí
- **🔮 Misterio**: "¿Qué me espera en el nivel 15?" - Descúbrelo avanzando

## 🎨 Los Cuatro Mundos (Rutas de Aprendizaje)

A medida que avanzas por el mapa, el entorno y los colores cambian para dar una sensación de verdadero progreso:

### 🌿 Bosque Principiante (Verde)
- **Niveles**: 1 - 10
- **Ambiente**: Pradera verde, senderos simples, flores y hojas
- **Descripción**: Tu punto de partida. Aprende los fundamentos de los pilares
- **Nodos**: Círculos verdes con iconos de hojas y flores

### 🌊 Costa Intermedia (Azul)  
- **Niveles**: 11 - 20
- **Ambiente**: Río serpenteante, puentes, olas y corrientes
- **Descripción**: ¡Has dejado de ser un novato! Domina los pilares para alcanzar la maestría
- **Nodos**: Hexágonos azules con iconos de olas y puentes

### 🔮 Valle Avanzado (Morado)
- **Niveles**: 21 - 25
- **Ambiente**: Montañas místicas, cristales, senderos rocosos
- **Descripción**: Para los usuarios dedicados. El camino se vuelve desafiante
- **Nodos**: Diamantes morados con efectos brillantes y cristales

### 🔥 Cumbre Experta (Dorado)
- **Niveles**: 26 - 30
- **Ambiente**: Cielo estrellado, camino dorado, auras celestiales
- **Descripción**: La cima de las rachas y los pilares. Solo para leyendas
- **Nodos**: Estrellas doradas con auras especiales y efectos de fuego

## 🕹️ Cómo Probar la Interfaz (Modo Desarrollador)

### Simulando Progreso
En la parte inferior de la pantalla (o manteniendo presionado el título), encontrarás el **Panel de Pruebas**:

#### Botón [+50 XP]
- Presiónalo y observa cómo el **anillo de progreso** del nodo actual se va llenando con una animación fluida
- **¡Subida de Nivel!** Cuando el anillo se llena:
  - Explota confeti (o el personaje celebra)
  - El nodo actual se vuelve verde
  - El indicador de "START" salta al siguiente nodo gris, desbloqueándolo

#### Selector de XP Directo
- Ingresa `10000 XP` de golpe y mira cómo el mapa hace **scroll automático** hasta llevarte al Mundo Azul (Intermedio)
- Prueba con `40000 XP` para llegar al Valle Avanzado
- Experimenta con diferentes valores para ver las transiciones entre mundos

### Interacciones Especiales

#### 🎯 Nodo Actual
```
Al tocar tu nodo actual verás:
┌─────────────────────────────┐
│  🎯 Nivel 8: Dedicado       │
│  ━━━━━━━━░░ 80% Completado   │
│  2,400 / 3,000 XP          │
│  ¡Solo 600 XP más!         │
│  � Próxima recompensa:     │
│     📊 Estadísticas Avanzadas│
└─────────────────────────────┘
```

#### 🟢 Nodo Completado
```
Al tocar un nodo completado:
┌─────────────────────────────┐
│  ✅ Nivel 5: Estudiante     │
│  🗓️ Completado: 15 Feb 2026 │
│  🎁 Desbloqueaste:          │
│     🏆 Sistema de Logros    │
│     📈 Gráficos de Progreso │
│  💎 XP Ganado: +50          │
└─────────────────────────────┘
```

#### 🔒 Nodo Bloqueado
```
Al tocar un nodo futuro:
┌─────────────────────────────┐
│  🔒 Nivel 15: ???           │
│  🎁 Recompensa Misteriosa   │
│  📋 Requisitos:             │
│     • Completar Nivel 14    │
│     • 10,500 XP Total       │
│  🔮 "Algo increíble te      │
│      espera aquí..."        │
└─────────────────────────────┘
```

## 🧩 Elementos Técnicos Clave para la UI Final

Para que esto no sea solo un diseño cuadrado, estamos implementando:

### 🎨 Diseño Visual Avanzado
- **Contenedores SVG / Caminos Curvos**: Líneas vectoriales que conectan los nodos para que no estén en una simple línea recta aburrida
- **Patrón Zig-Zag**: Los nodos alternan entre izquierda y derecha creando un sendero serpenteante
- **Gradientes de Fondo**: Cada mundo tiene su propio gradiente que se desvanece suavemente

### ⚡ Animaciones (Reanimated / Lottie)
- **Anillo de Progreso**: Animación fluida del llenado circular
- **Celebraciones**: Confeti, partículas y efectos cuando subes de nivel
- **Personaje/Mascota**: Un compañero animado que celebra tus logros
- **Transiciones**: Morphing suave entre mundos

### 🎯 Scroll Inteligente
- **Auto-Scroll**: Al entrar a la pestaña, el mapa hace scroll directamente a tu **Nodo Actual** para que no tengas que buscar por dónde ibas
- **Smooth Scrolling**: Animaciones de 60fps para una experiencia fluida
- **Zoom Adaptativo**: Se ajusta automáticamente para mostrar el contexto perfecto

### 🎮 Interactividad Gamificada
- **Feedback Háptico**: Vibraciones sutiles al tocar nodos (móvil)
- **Sonidos**: Efectos de audio para completar niveles y desbloquear recompensas
- **Micro-animaciones**: Cada elemento responde al toque con animaciones deliciosas

## 🎯 Ejemplos de Navegación en Acción

### 🌱 Escenario 1: Usuario Nuevo (Nivel 1)
```
🗺️ Vista del Mapa:
   🎯 [1] ← Nodo actual pulsando (START)
   🔒 [2] ← Gris con candado
   🔒 [3] ← Gris con candado
   ...
   
💬 Tooltip: "¡Completa pilares para avanzar!"
🌿 Ambiente: Bosque verde, música relajante
```

### 🌊 Escenario 2: Usuario Intermedio (Nivel 15)
```
🗺️ Vista del Mapa:
   ✅ [1-14] ← Nodos verdes completados
   � [15] ← Nodo actual en mundo azul
   🔒 [16-20] ← Próximos niveles visibles
   
💬 Tooltip: "¡Estás en racha! Sigue así"
🌊 Ambiente: Costa azul, sonidos de olas
```

### 🔮 Escenario 3: Usuario Avanzado (Nivel 25)
```
🗺️ Vista del Mapa:
   ✅ [1-24] ← Dos mundos completados
   🎯 [25] ← Final del Valle Avanzado
   🌟 [26] ← Portal dorado al mundo Expert
   
💬 Tooltip: "¡Casi eres una leyenda!"
🔮 Ambiente: Montañas místicas, efectos mágicos
```

## 🎉 Próximos Pasos de Desarrollo

### Fase 1: Estructura Base ✅
- [x] Mapa vertical con scroll
- [x] Nodos básicos con estados
- [x] Mundos con colores temáticos
- [x] Panel de información

### Fase 2: Gamificación Avanzada 🔄
- [ ] Anillos de progreso animados
- [ ] Efectos de partículas y confeti
- [ ] Transiciones suaves entre mundos
- [ ] Personaje/mascota animado

### Fase 3: Interactividad Premium 📋
- [ ] Caminos curvos SVG
- [ ] Sonidos y música ambiental
- [ ] Feedback háptico
- [ ] Modo oscuro/claro

### Fase 4: Social y Personalización 🚀
- [ ] Compartir progreso
- [ ] Temas desbloqueables
- [ ] Logros especiales del mapa
- [ ] Competencias entre usuarios

## 🎮 ¡Prepárate para la Aventura Definitiva!

El nuevo **Camino de Leyendas** transformará completamente cómo experimentas tu progreso. Cada nivel completado será una victoria épica, cada mundo desbloqueado será un nuevo capítulo en tu historia de crecimiento personal.

**¡Tu leyenda comienza ahora! 🌟**