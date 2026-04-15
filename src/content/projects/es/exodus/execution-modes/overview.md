---
order: 3
sidebar_label: "Modos de Ejecución"
title: "Motores de Ejecución"
---

EXODUS proporciona dos motores de ejecución distintos diseñados para diferentes escenarios operativos:

## Modo Interactivo (Human-in-the-Loop)

El **motor por defecto** para la operación manual donde un operador humano (pentester, analista de seguridad) mantiene el control y dirige las acciones del agente en tiempo real.

```bash
# Iniciar sesión de chat interactiva
exodus-cli chat --agent triage_agent
```

**Casos de Uso:**
- **Pentesting manual**: El operador analiza los resultados y decide los próximos pasos
- **Reconocimiento exploratorio**: La experiencia humana guía la investigación
- **Entrenamiento y aprendizaje**: Entender cómo funcionan los agentes paso a paso
- **Requisitos de cumplimiento**: Mantener la supervisión humana para operaciones sensibles

**Características:**
- El operador humano controla el flujo
- El agente responde a cada mensaje del usuario
- Visibilidad completa del razonamiento del agente
- Aprobación manual antes de acciones críticas
- Retroalimentación interactiva y corrección de curso

**Flujo de trabajo de ejemplo:**
```
Tú: "Escanea este objetivo en busca de puertos abiertos"
Agente: [Ejecuta escaneo nmap, muestra resultados]
Tú: "Ahora enumera el servicio HTTP en el puerto 80"
Agente: [Realiza enumeración HTTP]
Tú: "Parece vulnerable, prueba fuerza bruta de directorios"
Agente: [Ejecuta gobuster]
```

## Modo Automatizado (Ejecución Autónoma)

El **motor automatizado** (`exodus-cli auto`) permite la operación completamente autónoma con capacidades avanzadas de planificación, reflexión y autocorrección. Diseñado para tareas que requieren una intervención humana mínima.

```bash
# Ejecutar misión autónoma
exodus-cli auto "Realizar reconocimiento completo en exodialabs.xyz" \
  --agent recon_agent \
  --session scan_20250107 \
  --verbose
```

**Casos de Uso:**
- **Escaneo automatizado**: Programar reconocimiento desatendido de infraestructura
- **Pruebas de seguridad CI/CD**: Integrar en pipelines para evaluación continua
- **Automatización de bug bounty**: Descubrimiento autónomo de vulnerabilidades
- **Operaciones a gran escala**: Desplegar enjambres de agentes para tareas distribuidas
- **Flujos de trabajo repetitivos**: Automatizar evaluaciones de seguridad rutinarias

### Características Avanzadas

#### 1. Planificación Dinámica
El agente genera un plan de tareas estructurado basado en el objetivo:
```
Objetivo: "Escanear objetivo y encontrar vulnerabilidades"
Plan:
  ├─ task_1: Escaneo de puertos y descubrimiento de servicios
  ├─ task_2: Enumeración HTTP/SMB (depende de task_1)
  ├─ task_3: Identificación de vulnerabilidades
  ├─ task_4: Validación de exploits
  └─ task_5: Generación de informe
```

#### 2. Reflexión Estratégica
Autoevaluación periódica para asegurar el progreso:
- **Basada en iteraciones**: Revisa el progreso cada N pasos (por defecto: 25)
- **Basada en tareas**: Evalúa después de N tareas completadas (por defecto: 3)
- **Acciones**: `CONTINUE`, `REPLAN`, `ESCALATE`, o `COMPLETE`

#### 3. Replanificación Dinámica
El agente puede regenerar el plan a mitad de la ejecución si:
- La estrategia no está funcionando (fallos repetidos)
- El entorno cambió (nuevos servicios descubiertos)
- La tarea se vuelve irrelevante (objetivo ya alcanzado)

#### 4. Punto de Control y Reanudación
El estado de ejecución se guarda automáticamente:
```bash
# Iniciar misión
exodus-cli auto "Tarea de larga duración" --session my_mission

# Interrumpir con Ctrl+C o tiempo de espera
^C Interrumpido por el usuario

# Reanudar desde el punto de control
exodus-cli auto --resume --session my_mission
```

#### 5. Escalada a Humano
El agente puede solicitar asistencia cuando se queda atascado:
```
Reflexión: ESCALATE
  Razonamiento: "Se requieren credenciales para proceder. Se necesita intervención manual."

El agente solicita asistencia humana
```

## Modos de Ejecución Segura

EXODUS proporciona múltiples drivers de ejecución para ejecutar herramientas de forma segura:

**Modo Docker** (Recomendado para ejecución aislada):
```toml
[agent]
execution_mode = "docker"

[agent.execution.docker]
default_image = "debian:latest"
default_image_name = "exodus_container"
```

- Entorno aislado usando cualquier imagen de Docker (Debian, Ubuntu, Kali, ParrotSec, Alpine, etc.)
- Gestión automática del ciclo de vida del contenedor
- Ejecución segura de comandos sin afectar al sistema host
- Perfecto para herramientas de seguridad o ejecución de código no confiable

**Modo Local**:
```toml
[agent]
execution_mode = "local"
```

- Ejecución directa en tu entorno
- Más rápido para herramientas confiables
- Usar para desarrollo y pruebas

## Contenedor Exodus Security Executor

EXODUS proporciona un contenedor Docker especializado que ejecuta un demonio `exodus-server` para ejecutar herramientas basadas en Python en un entorno aislado de ParrotSec. Los agentes pueden comunicarse con este servidor a través de sockets Unix para ejecutar herramientas de EXODUS remotamente.

```bash
# Construir la imagen
docker build -t exodus-security-executor -f docker/exodus_security_executor/Dockerfile .

# Ejecutar el contenedor
docker run -d --name exodus-executor exodus-security-executor
```