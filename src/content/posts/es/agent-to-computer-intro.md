---
title: "Agent-to-Computer (A2C) : Protocolo de conexión a un agente remoto"
description: "Introducción a A2C como protocolo de conexión de un agente remoto a distintos dispositivos locales"
pubDate: 2026-04-30
author: aleph
tags: ["ai"]
image: "../../../assets/blog/agent-to-computer.jpg"
---

_(Repositorio: [aleph8/a2c-spec](https://github.com/aleph8/a2c-spec))_

Desde hace tiempo le estoy dando vueltas a una idea ... _"¿Cómo sería dar acceso a un agente remoto que reside en la nube a dispositivos locales?"_. Por ejemplo para un agente experto en ciberseguridad como [OmniaSec](https://omniasec.ai) para que audite mi dispositivo ... podría crear un pequeño programita para ejecutarlo en mi ordenador, pero ¿cómo hago que se comunique con [OmniaSec](https://omniasec.ai) y poder aprovechar todo su potencial? Es ahí donde nace Agent-to-Computer.

A2C (Agent-to-Computer) es un protocolo abierto que permite a un agente de IA remoto (el **Cerebro**) delegar la ejecución de herramientas en una máquina local (el **Cuerpo**), recibir los resultados y continuar razonando - todo a través de un canal de comunicación bidireccional y persistente.

### Conceptos clave: El Cerebro y el Cuerpo

Para entender A2C, hay que separar los roles:
*   **Cerebro (Brain)**: El agente de IA que reside en la nube o en un servidor. Es quien decide qué herramientas llamar y razona sobre los resultados.
*   **Cuerpo (Body)**: El cliente que corre en tu máquina local. Es quien realmente ejecuta las herramientas (comandos de shell, scripts, etc.) y le devuelve la "observación" al Cerebro.

### ¿Qué problemas soluciona A2C?

Aunque existen soluciones como [MCP (Model Context Protocol)](https://modelcontextprotocol.io/), A2C atiende a una serie de necesidades o "gaps" que los protocolos actuales no cubren del todo:

1.  **Direccionalidad Invertida**: Mientras que MCP permite que un host local acceda a herramientas en servidores remotos, A2C permite que un **Cerebro experto en la nube** acceda a los recursos locales del usuario para ejecutar comandos, scripts u operaciones a nivel de sistema operativo.
2.  **Conectividad sin puertos abiertos**: A2C utiliza una conexión **saliente iniciada por el Cuerpo**. Esto significa que tu máquina local se conecta al agente remoto (o a un relay), eliminando la necesidad de abrir puertos en tu router o configurar firewalls complejos.
3.  **Modelo de Consentimiento y Seguridad**: A diferencia de otros protocolos donde el acceso es total o requiere configuraciones tediosas, A2C define un modelo de confianza basado en el consentimiento explícito. El "Cuerpo" envía un mensaje `PENDING` al "Cerebro" mientras espera que el usuario apruebe una acción, y solo entonces se ejecuta. El usuario mantiene el control total, con la opción de activar un `yolo_mode` solo si confía plenamente en la fuente.
4.  **Eficiencia y Persistencia**: Al usar canales bidireccionales (como gRPC o WebSockets), A2C reduce la latencia y el consumo de tokens. El protocolo utiliza números de secuencia (`seq`) para garantizar que los mensajes lleguen en orden y no se pierda nada en la comunicación.
5.  **Ejecución de herramientas híbrida**: Permite un equilibrio donde ciertas herramientas se ejecutan en el Cuerpo (local), pero otras pueden residir y ejecutarse en el Cerebro (servidor). Esto es ideal para procesos de carga pesada, herramientas propietarias que no se pueden distribuir, o acceso a información sensible de manera controlada sin que el dato bruto tenga que viajar al dispositivo local.

### ¿Qué puertas nos abre esto?

Lo interesante no es solo conectar tu PC. Al tener un cliente tan ligero, las posibilidades se disparan:

*   **Redes de dispositivos**: Podrías conectar toda una flota de dispositivos a un solo agente centralizado. Imagina un agente que coordine tareas entre varios servidores, móviles o sensores.
*   **IoT y Robótica**: Dispositivos con recursos limitados (como una Raspberry Pi, un robot o un Android) podrían tener un "Cuerpo" mínimo que les dé conexión directa con un "Cerebro" potente en la nube.
*   **Seguridad total desde el cliente**: La clave es que el usuario (el Cuerpo) decide qué puede hacer el agente. La idea es que las acciones y los tipos sean totalmente configurables, de modo que el agente actúe siempre dentro de unos márgenes seguros definidos por ti.

### Casos de uso que nos facilitan la vida

Seguramente estés pensando: *"Pero esto ya lo hace Claude Code o Codex"*. Y tienes razón, pero hay una diferencia fundamental: **Claude Code es una herramienta local que llama a una IA. A2C es un protocolo que permite que CUALQUIER IA remota se conecte a tu máquina.**

*   **Agnosticismo total**: Claude Code está atado a Anthropic. A2C permite que cualquier "Cerebro" (ya sea un GPT personalizado, un agente de ciberseguridad especializado o tu propio modelo en un servidor) hable con cualquier "Cuerpo" (tu PC, un servidor, un robot).
*   **Inversión de la conexión**: En lugar de que tú abras una aplicación para "llamar" a la IA, el Cuerpo mantiene una conexión con el Cerebro. Esto permite que el agente sea proactivo o que trabaje de forma autónoma en tareas largas sin que tengas que tener una terminal abierta bloqueada.
*   **Seguridad granular y bajo control**: La gestión de la seguridad no es un "todo o nada". Se basa en tres pilares:
    *   **Filtrado en el cliente**: El Cuerpo solo declara en el `HANDSHAKE` las herramientas que quiere exponer. Si el Cerebro pide algo que no está en la lista, se rechaza automáticamente.
    *   **Consentimiento interactivo**: Cada vez que el Cerebro pide ejecutar una acción sensible, el Cuerpo envía un mensaje `PENDING` y te pregunta a ti (mediante una notificación o en la TUI) si le das permiso.
    *   **Políticas por dispositivo**: Gracias al `device_id`, el servidor puede aplicar reglas específicas. Por ejemplo, puedes configurar que tu PC de casa acepte comandos de `git` automáticamente (`yolo_mode`), pero que tu servidor de producción requiera aprobación manual para cualquier cosa.

Para bajarlo a la tierra, imagina estas situaciones en tu día a día:

*   **Organización inteligente**: "Oye, revisa mi carpeta de Descargas, clasifica los archivos por contenido (no solo por extensión) y muévelos a las carpetas correspondientes".
*   **Asistente de desarrollo real**: El agente experto en la nube puede ejecutar tus tests locales, ver los errores de la consola en tiempo real y proponerte el fix directamente en tu editor.
*   **Mantenimiento proactivo**: "Mira por qué tengo el disco casi lleno y sugiereme qué archivos grandes o temporales puedo borrar de forma segura".
*   **Auditoría de red doméstica**: El agente puede escanear tu red local desde tu PC y avisarte si hay algún dispositivo desconocido o vulnerable conectado a tu WiFi.
*   **Privacidad por diseño**: Puedes pedirle que analice un documento local muy sensible. El agente enviará el "código" para analizarlo localmente y solo recibirá el resultado final (el resumen o el dato que buscas), sin que el documento completo llegue nunca a salir de tu máquina.

### Estado actual

Actualmente el protocolo está en fase de borrador (v0.2.0) y estoy trabajando en la implementación de referencia en Python. Puedes encontrar más detalles sobre la especificación en el repositorio oficial [aleph8/a2c-spec](https://github.com/aleph8/a2c-spec).

### Próximos pasos

Todavía queda mucho camino por recorrer, pero los objetivos a corto plazo son claros:
*   **Estabilizar la v1.0**: Pulir la especificación actual con el feedback de la comunidad y cerrar el esquema definitivo de mensajes.
*   **Cuerpos especializados**: Desarrollar clientes mínimos (minimal bodies) para Android y entornos IoT (Raspberry Pi), permitiendo que cualquier dispositivo sea una extensión del agente.


