# Documentación JARVIS Web App

## Índice
1. [Introducción](#introducción)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Arquitectura](#arquitectura)
5. [Frontend](#frontend)
6. [Backend](#backend)
7. [API REST](#api-rest)
8. [Integraciones](#integraciones)
9. [Guía de Extensión](#guía-de-extensión)
10. [Solución de Problemas](#solución-de-problemas)

## Introducción

JARVIS Web App es un asistente virtual con interfaz web que permite a los usuarios interactuar mediante comandos de texto y recibir respuestas contextuales. La aplicación integra diversos servicios externos como ChatGPT, ClickUp, Google Drive, OneDrive y Slack para proporcionar una experiencia unificada y eficiente.

La interfaz sigue un diseño futurista con tema neón, ofreciendo una experiencia visual atractiva y moderna, con microinteracciones y animaciones que enriquecen la experiencia de usuario.

## Estructura del Proyecto

El proyecto está organizado en dos componentes principales:

### Frontend
```
/jarvis_frontend/
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── api.js
│   ├── conversation.js
│   └── ui.js
├── img/
├── index.html
└── settings.html
```

### Backend
```
/jarvis_backend/
├── venv/
├── src/
│   ├── models/
│   │   └── user.py
│   ├── routes/
│   │   ├── api.py
│   │   ├── chatgpt.py
│   │   ├── clickup.py
│   │   ├── gdrive.py
│   │   └── user.py
│   ├── static/
│   │   ├── css/
│   │   ├── js/
│   │   ├── img/
│   │   ├── index.html
│   │   └── settings.html
│   └── main.py
└── requirements.txt
```

## Instalación y Configuración

### Requisitos Previos
- Python 3.8+
- Pip
- Navegador web moderno (Chrome, Firefox, Edge, Safari)

### Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/jarvis-web-app.git
cd jarvis-web-app
```

2. Configurar el entorno virtual y las dependencias:
```bash
cd jarvis_backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Iniciar el servidor:
```bash
python src/main.py
```

4. Acceder a la aplicación:
Abrir un navegador y visitar `http://localhost:5000`

## Arquitectura

JARVIS Web App sigue una arquitectura cliente-servidor:

- **Frontend**: Interfaz de usuario desarrollada con HTML, CSS y JavaScript vanilla.
- **Backend**: API REST desarrollada con Flask (Python).
- **Comunicación**: Peticiones HTTP/JSON entre frontend y backend.

### Diagrama de Componentes

```
+-------------------+        +-------------------+
|                   |        |                   |
|     Frontend      |        |      Backend      |
|                   |        |                   |
| +---------------+ |        | +---------------+ |
| |    UI Layer   | |        | |   API Layer   | |
| +---------------+ |        | +---------------+ |
|         |         |        |         |         |
| +---------------+ |        | +---------------+ |
| |   API Client  |<-------->|   Controllers  | |
| +---------------+ |        | +---------------+ |
|                   |        |         |         |
+-------------------+        | +---------------+ |
                             | |    Services   | |
                             | +---------------+ |
                             |         |         |
                             | +---------------+ |
                             | |  Integrations | |
                             | +---------------+ |
                             |                   |
                             +-------------------+
```

## Frontend

### Estructura de Archivos

- **index.html**: Página principal con la interfaz de conversación.
- **settings.html**: Página de configuración de servicios y preferencias.
- **css/styles.css**: Estilos globales de la aplicación.
- **js/main.js**: Inicialización y configuración global.
- **js/api.js**: Cliente para comunicación con el backend.
- **js/conversation.js**: Lógica de la conversación con JARVIS.
- **js/ui.js**: Componentes y utilidades de interfaz.

### Componentes Principales

1. **Sidebar**: Navegación principal y acceso a integraciones.
2. **Conversation Area**: Área de chat con historial de mensajes.
3. **Command Input**: Campo para enviar comandos a JARVIS.
4. **Integration Cards**: Tarjetas para mostrar información de servicios integrados.
5. **Settings Panels**: Paneles para configurar servicios y preferencias.

### Estado Global

El estado de la aplicación se gestiona a través del objeto `JARVIS.state` que contiene:

- Información del usuario
- Estado de JARVIS
- Estado de los servicios conectados
- Preferencias de usuario
- Estado de la interfaz

## Backend

### Estructura de Archivos

- **main.py**: Punto de entrada de la aplicación Flask.
- **models/**: Modelos de datos (actualmente simulados).
- **routes/**: Controladores de la API REST.
  - **api.py**: Endpoints generales.
  - **chatgpt.py**: Endpoints para integración con ChatGPT.
  - **clickup.py**: Endpoints para integración con ClickUp.
  - **gdrive.py**: Endpoints para integración con Google Drive.
  - **user.py**: Endpoints para gestión de usuarios.

### Blueprints

El backend utiliza blueprints de Flask para organizar los endpoints:

- **/api**: Endpoints generales.
- **/api/services/chatgpt**: Endpoints de ChatGPT.
- **/api/services/clickup**: Endpoints de ClickUp.
- **/api/services/gdrive**: Endpoints de Google Drive.
- **/api/user**: Endpoints de usuario.

## API REST

### Endpoints Principales

#### General

- `GET /api/status`: Obtener estado general de JARVIS.
- `GET /api/health`: Verificar salud del servidor.

#### Conversación

- `GET /api/conversation/history`: Obtener historial de conversación.
- `POST /api/conversation/command`: Enviar comando a JARVIS.

#### Servicios

- `GET /api/services`: Obtener estado de todos los servicios.
- `POST /api/services/{service_id}/connect`: Conectar servicio.
- `POST /api/services/{service_id}/disconnect`: Desconectar servicio.
- `POST /api/services/{service_id}/apikey`: Actualizar API key.

#### Preferencias

- `GET /api/preferences`: Obtener preferencias de usuario.
- `POST /api/preferences`: Actualizar preferencias.

#### ChatGPT

- `GET /api/services/chatgpt/config`: Obtener configuración.
- `POST /api/services/chatgpt/config`: Actualizar configuración.
- `POST /api/services/chatgpt/query`: Enviar consulta a ChatGPT.

#### ClickUp

- `GET /api/services/clickup/config`: Obtener configuración.
- `POST /api/services/clickup/config`: Actualizar configuración.
- `GET /api/services/clickup/tasks`: Obtener tareas.
- `POST /api/services/clickup/tasks`: Crear tarea.
- `PUT /api/services/clickup/tasks/{task_id}`: Actualizar tarea.
- `DELETE /api/services/clickup/tasks/{task_id}`: Eliminar tarea.

#### Google Drive

- `GET /api/services/gdrive/config`: Obtener configuración.
- `POST /api/services/gdrive/config`: Actualizar configuración.
- `GET /api/services/gdrive/files`: Obtener archivos.
- `GET /api/services/gdrive/search`: Buscar archivos.
- `GET /api/services/gdrive/files/{file_id}`: Obtener detalles de archivo.
- `POST /api/services/gdrive/upload`: Subir archivo.

### Formato de Respuesta

Todas las respuestas siguen un formato estándar:

```json
{
  "success": true|false,
  "message": "Mensaje descriptivo (opcional)",
  "data": { ... } // Datos específicos del endpoint
}
```

## Integraciones

### ChatGPT

Integración con la API de OpenAI para proporcionar respuestas inteligentes a consultas de usuario.

**Configuración**:
- API Key
- Modelo (GPT-4, GPT-3.5, etc.)

### ClickUp

Integración con ClickUp para gestión de tareas y proyectos.

**Configuración**:
- API Key
- Espacio de trabajo

**Funcionalidades**:
- Listar tareas
- Crear tareas
- Actualizar estado de tareas
- Eliminar tareas

### Google Drive

Integración con Google Drive para gestión de archivos.

**Configuración**:
- OAuth (simulado)
- Cuenta asociada

**Funcionalidades**:
- Listar archivos
- Buscar archivos
- Ver detalles de archivos
- Subir archivos

### OneDrive y Slack

Estas integraciones están preparadas en la estructura pero no implementadas completamente en esta versión.

## Guía de Extensión

### Añadir Nuevas Integraciones

1. **Backend**:
   - Crear un nuevo archivo en `src/routes/` para la integración.
   - Definir los endpoints necesarios.
   - Registrar el blueprint en `main.py`.

2. **Frontend**:
   - Añadir métodos en `js/api.js` para los nuevos endpoints.
   - Crear componentes UI necesarios.
   - Actualizar la sidebar y las páginas relevantes.

### Ejemplo: Integración con Trello

**Backend (src/routes/trello.py)**:
```python
from flask import Blueprint, jsonify, request
import json
import time
from datetime import datetime

trello_bp = Blueprint('trello', __name__)

# Datos simulados
MOCK_CONFIG = {
    'connected': False,
    'lastSync': None
}

@trello_bp.route('/config', methods=['GET'])
def get_config():
    return jsonify({
        'success': True,
        'config': MOCK_CONFIG
    })

# Añadir más endpoints...
```

**Registrar en main.py**:
```python
from src.routes.trello import trello_bp
app.register_blueprint(trello_bp, url_prefix='/api/services/trello')
```

**Frontend (js/api.js)**:
```javascript
// Trello
getTrelloConfig: async function() {
    return this.request('/services/trello/config');
},

updateTrelloConfig: async function(config) {
    return this.request('/services/trello/config', 'POST', config);
}
```

## Solución de Problemas

### Problemas Comunes

1. **Error al iniciar el servidor**:
   - Verificar que todas las dependencias estén instaladas: `pip install -r requirements.txt`
   - Verificar que el puerto 5000 no esté en uso.

2. **Error de conexión frontend-backend**:
   - Verificar que el servidor esté corriendo.
   - Revisar la consola del navegador para errores CORS.
   - Verificar que las URLs en el cliente API sean correctas.

3. **Errores en integraciones**:
   - Verificar que las API keys sean válidas.
   - Revisar los logs del servidor para errores específicos.

### Logs

Los logs del servidor se muestran en la consola donde se ejecuta `python src/main.py`.

Para habilitar logs más detallados, modificar `main.py`:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Contacto

Para soporte adicional, contactar a:
- Email: soporte@jarvis-webapp.com
- GitHub: https://github.com/tu-usuario/jarvis-web-app/issues
