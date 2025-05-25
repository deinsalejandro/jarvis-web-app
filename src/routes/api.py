from flask import Blueprint, jsonify, request
import json
import os
import time
from datetime import datetime

# Crear el blueprint para la API
api_bp = Blueprint('api', __name__)

# Datos simulados para desarrollo
MOCK_DATA = {
    'user': {
        'name': 'María Sánchez',
        'initials': 'MS',
        'isLoggedIn': True
    },
    'jarvis': {
        'isActive': True,
        'version': '1.0.0'
    },
    'services': {
        'chatgpt': {'connected': True, 'lastSync': '2025-05-25T10:15:00', 'details': {'model': 'GPT-4'}},
        'clickup': {'connected': True, 'lastSync': '2025-05-25T10:30:00', 'details': {'workspace': 'Mi Espacio'}},
        'onedrive': {'connected': False, 'lastSync': None, 'details': {}},
        'gdrive': {'connected': True, 'lastSync': '2025-05-25T09:45:00', 'details': {'account': 'maria.sanchez@gmail.com'}},
        'slack': {'connected': False, 'lastSync': None, 'details': {}}
    },
    'preferences': {
        'theme': 'dark',
        'language': 'es',
        'neonColor': 'cyan',
        'autoStart': True,
        'showNotifications': True,
        'interfaceSounds': False,
        'highContrast': False
    }
}

# Historial de conversación simulado
MOCK_HISTORY = [
    {
        'id': '1',
        'sender': 'user',
        'senderName': 'María Sánchez',
        'text': 'JARVIS, muéstrame mis tareas pendientes en ClickUp para hoy.',
        'timestamp': '2025-05-25T10:30:00'
    },
    {
        'id': '2',
        'sender': 'jarvis',
        'senderName': 'JARVIS',
        'text': 'Claro, María. Aquí están tus tareas pendientes para hoy en ClickUp:',
        'timestamp': '2025-05-25T10:30:05',
        'integration': {
            'type': 'clickup',
            'title': 'ClickUp - Tareas para hoy',
            'data': {
                'tasks': [
                    {'id': 't1', 'name': 'Preparar presentación para cliente', 'completed': False, 'due': 'Hoy, 14:00'},
                    {'id': 't2', 'name': 'Revisar propuesta de diseño', 'completed': False, 'due': 'Hoy, 16:00'},
                    {'id': 't3', 'name': 'Enviar correo a proveedores', 'completed': True, 'due': 'Hoy, 10:00'},
                    {'id': 't4', 'name': 'Actualizar documentación del proyecto', 'completed': False, 'due': 'Hoy, 17:00'}
                ]
            }
        }
    },
    {
        'id': '3',
        'sender': 'user',
        'senderName': 'María Sánchez',
        'text': 'Gracias. Marca como completada la tarea "Revisar propuesta de diseño" y crea una nueva tarea para llamar al cliente a las 15:00.',
        'timestamp': '2025-05-25T10:32:00'
    },
    {
        'id': '4',
        'sender': 'jarvis',
        'senderName': 'JARVIS',
        'text': 'He marcado la tarea "Revisar propuesta de diseño" como completada y he creado una nueva tarea para llamar al cliente a las 15:00. Aquí está tu lista actualizada:',
        'timestamp': '2025-05-25T10:32:05',
        'integration': {
            'type': 'clickup',
            'title': 'ClickUp - Tareas para hoy',
            'data': {
                'tasks': [
                    {'id': 't1', 'name': 'Preparar presentación para cliente', 'completed': False, 'due': 'Hoy, 14:00'},
                    {'id': 't2', 'name': 'Revisar propuesta de diseño', 'completed': True, 'due': 'Hoy, 16:00'},
                    {'id': 't3', 'name': 'Enviar correo a proveedores', 'completed': True, 'due': 'Hoy, 10:00'},
                    {'id': 't4', 'name': 'Actualizar documentación del proyecto', 'completed': False, 'due': 'Hoy, 17:00'},
                    {'id': 't5', 'name': 'Llamar al cliente', 'completed': False, 'due': 'Hoy, 15:00'}
                ]
            }
        }
    }
]

# Ruta para obtener el estado de JARVIS
@api_bp.route('/status', methods=['GET'])
def get_status():
    return jsonify({
        'success': True,
        'status': {
            'user': MOCK_DATA['user'],
            'jarvis': MOCK_DATA['jarvis'],
            'services': MOCK_DATA['services']
        }
    })

# Ruta para obtener el historial de conversación
@api_bp.route('/conversation/history', methods=['GET'])
def get_conversation_history():
    return jsonify({
        'success': True,
        'history': MOCK_HISTORY
    })

# Ruta para enviar un comando a JARVIS
@api_bp.route('/conversation/command', methods=['POST'])
def send_command():
    data = request.json
    
    if not data or 'command' not in data:
        return jsonify({
            'success': False,
            'message': 'Comando no proporcionado'
        }), 400
    
    command = data['command']
    
    # Simular procesamiento
    time.sleep(1)
    
    # Generar respuesta simulada
    response = {
        'success': True,
        'message': 'Comando procesado correctamente',
        'response': {
            'text': f'He recibido tu comando: "{command}"',
            'type': 'text',
            'timestamp': datetime.now().isoformat()
        }
    }
    
    # Simular integración con ClickUp si el comando lo menciona
    if 'clickup' in command.lower() or 'tarea' in command.lower():
        response['response']['integration'] = {
            'type': 'clickup',
            'title': 'ClickUp - Tareas',
            'data': {
                'tasks': [
                    {'id': 't1', 'name': 'Preparar presentación para cliente', 'completed': False, 'due': 'Hoy, 14:00'},
                    {'id': 't2', 'name': 'Revisar propuesta de diseño', 'completed': True, 'due': 'Hoy, 16:00'},
                    {'id': 't3', 'name': 'Enviar correo a proveedores', 'completed': True, 'due': 'Hoy, 10:00'},
                    {'id': 't4', 'name': 'Actualizar documentación del proyecto', 'completed': False, 'due': 'Hoy, 17:00'},
                    {'id': 't5', 'name': 'Llamar al cliente', 'completed': False, 'due': 'Hoy, 15:00'}
                ]
            }
        }
    
    return jsonify(response)

# Rutas para gestionar servicios
@api_bp.route('/services', methods=['GET'])
def get_services():
    return jsonify({
        'success': True,
        'services': MOCK_DATA['services']
    })

@api_bp.route('/services/<service_id>/connect', methods=['POST'])
def connect_service(service_id):
    if service_id not in MOCK_DATA['services']:
        return jsonify({
            'success': False,
            'message': f'Servicio {service_id} no encontrado'
        }), 404
    
    # Simular conexión
    time.sleep(1.5)
    
    # Actualizar estado
    MOCK_DATA['services'][service_id]['connected'] = True
    MOCK_DATA['services'][service_id]['lastSync'] = datetime.now().isoformat()
    
    return jsonify({
        'success': True,
        'message': f'Servicio {service_id} conectado correctamente',
        'service': MOCK_DATA['services'][service_id]
    })

@api_bp.route('/services/<service_id>/disconnect', methods=['POST'])
def disconnect_service(service_id):
    if service_id not in MOCK_DATA['services']:
        return jsonify({
            'success': False,
            'message': f'Servicio {service_id} no encontrado'
        }), 404
    
    # Simular desconexión
    time.sleep(1)
    
    # Actualizar estado
    MOCK_DATA['services'][service_id]['connected'] = False
    MOCK_DATA['services'][service_id]['lastSync'] = None
    
    return jsonify({
        'success': True,
        'message': f'Servicio {service_id} desconectado correctamente',
        'service': MOCK_DATA['services'][service_id]
    })

@api_bp.route('/services/<service_id>/apikey', methods=['POST'])
def update_api_key(service_id):
    data = request.json
    
    if not data or 'apiKey' not in data:
        return jsonify({
            'success': False,
            'message': 'API key no proporcionada'
        }), 400
    
    if service_id not in MOCK_DATA['services']:
        return jsonify({
            'success': False,
            'message': f'Servicio {service_id} no encontrado'
        }), 404
    
    # Simular actualización
    time.sleep(1)
    
    # En una implementación real, aquí se guardaría la API key de forma segura
    
    return jsonify({
        'success': True,
        'message': f'API key para {service_id} actualizada correctamente'
    })

# Rutas para gestionar preferencias
@api_bp.route('/preferences', methods=['GET'])
def get_preferences():
    return jsonify({
        'success': True,
        'preferences': MOCK_DATA['preferences']
    })

@api_bp.route('/preferences', methods=['POST'])
def update_preferences():
    data = request.json
    
    if not data:
        return jsonify({
            'success': False,
            'message': 'Datos no proporcionados'
        }), 400
    
    # Simular actualización
    time.sleep(1)
    
    # Actualizar preferencias
    for key, value in data.items():
        if key in MOCK_DATA['preferences']:
            MOCK_DATA['preferences'][key] = value
    
    return jsonify({
        'success': True,
        'message': 'Preferencias actualizadas correctamente',
        'preferences': MOCK_DATA['preferences']
    })

# Rutas específicas para integraciones de servicios

# ChatGPT
@api_bp.route('/services/chatgpt/query', methods=['POST'])
def chatgpt_query():
    data = request.json
    
    if not data or 'query' not in data:
        return jsonify({
            'success': False,
            'message': 'Consulta no proporcionada'
        }), 400
    
    # Simular consulta a ChatGPT
    time.sleep(2)
    
    return jsonify({
        'success': True,
        'response': f'Respuesta simulada de ChatGPT para: "{data["query"]}"'
    })

# ClickUp
@api_bp.route('/services/clickup/tasks', methods=['GET'])
def clickup_tasks():
    # Simular obtención de tareas
    time.sleep(1)
    
    return jsonify({
        'success': True,
        'tasks': [
            {'id': 't1', 'name': 'Preparar presentación para cliente', 'completed': False, 'due': 'Hoy, 14:00'},
            {'id': 't2', 'name': 'Revisar propuesta de diseño', 'completed': True, 'due': 'Hoy, 16:00'},
            {'id': 't3', 'name': 'Enviar correo a proveedores', 'completed': True, 'due': 'Hoy, 10:00'},
            {'id': 't4', 'name': 'Actualizar documentación del proyecto', 'completed': False, 'due': 'Hoy, 17:00'},
            {'id': 't5', 'name': 'Llamar al cliente', 'completed': False, 'due': 'Hoy, 15:00'}
        ]
    })

@api_bp.route('/services/clickup/tasks', methods=['POST'])
def create_clickup_task():
    data = request.json
    
    if not data or 'name' not in data:
        return jsonify({
            'success': False,
            'message': 'Nombre de tarea no proporcionado'
        }), 400
    
    # Simular creación de tarea
    time.sleep(1)
    
    return jsonify({
        'success': True,
        'message': 'Tarea creada correctamente',
        'task': {
            'id': f't{int(time.time())}',
            'name': data['name'],
            'completed': False,
            'due': data.get('due', 'No especificado')
        }
    })

@api_bp.route('/services/clickup/tasks/<task_id>', methods=['PUT'])
def update_clickup_task(task_id):
    data = request.json
    
    if not data:
        return jsonify({
            'success': False,
            'message': 'Datos no proporcionados'
        }), 400
    
    # Simular actualización de tarea
    time.sleep(1)
    
    return jsonify({
        'success': True,
        'message': 'Tarea actualizada correctamente',
        'task': {
            'id': task_id,
            'name': data.get('name', 'Tarea sin nombre'),
            'completed': data.get('completed', False),
            'due': data.get('due', 'No especificado')
        }
    })

# Google Drive
@api_bp.route('/services/gdrive/files', methods=['GET'])
def gdrive_files():
    # Simular obtención de archivos
    time.sleep(1)
    
    return jsonify({
        'success': True,
        'files': [
            {'id': 'f1', 'name': 'Presentación Cliente.pptx', 'type': 'presentation', 'modified': '2025-05-24T15:30:00'},
            {'id': 'f2', 'name': 'Propuesta Diseño.pdf', 'type': 'pdf', 'modified': '2025-05-23T10:15:00'},
            {'id': 'f3', 'name': 'Presupuesto 2025.xlsx', 'type': 'spreadsheet', 'modified': '2025-05-20T09:45:00'},
            {'id': 'f4', 'name': 'Documentación Proyecto.docx', 'type': 'document', 'modified': '2025-05-22T14:20:00'}
        ]
    })

# OneDrive
@api_bp.route('/services/onedrive/files', methods=['GET'])
def onedrive_files():
    # Verificar si el servicio está conectado
    if not MOCK_DATA['services']['onedrive']['connected']:
        return jsonify({
            'success': False,
            'message': 'OneDrive no está conectado'
        }), 400
    
    # Simular obtención de archivos
    time.sleep(1)
    
    return jsonify({
        'success': True,
        'files': [
            {'id': 'f1', 'name': 'Informe Mensual.docx', 'type': 'document', 'modified': '2025-05-24T11:30:00'},
            {'id': 'f2', 'name': 'Fotos Evento.zip', 'type': 'archive', 'modified': '2025-05-23T16:45:00'},
            {'id': 'f3', 'name': 'Calendario 2025.xlsx', 'type': 'spreadsheet', 'modified': '2025-05-21T10:15:00'}
        ]
    })

# Slack
@api_bp.route('/services/slack/channels', methods=['GET'])
def slack_channels():
    # Verificar si el servicio está conectado
    if not MOCK_DATA['services']['slack']['connected']:
        return jsonify({
            'success': False,
            'message': 'Slack no está conectado'
        }), 400
    
    # Simular obtención de canales
    time.sleep(1)
    
    return jsonify({
        'success': True,
        'channels': [
            {'id': 'c1', 'name': 'general', 'unread': 5},
            {'id': 'c2', 'name': 'proyecto-jarvis', 'unread': 12},
            {'id': 'c3', 'name': 'marketing', 'unread': 0},
            {'id': 'c4', 'name': 'soporte', 'unread': 3}
        ]
    })

@api_bp.route('/services/slack/messages', methods=['POST'])
def send_slack_message():
    data = request.json
    
    if not data or 'channel' not in data or 'message' not in data:
        return jsonify({
            'success': False,
            'message': 'Canal o mensaje no proporcionados'
        }), 400
    
    # Verificar si el servicio está conectado
    if not MOCK_DATA['services']['slack']['connected']:
        return jsonify({
            'success': False,
            'message': 'Slack no está conectado'
        }), 400
    
    # Simular envío de mensaje
    time.sleep(1)
    
    return jsonify({
        'success': True,
        'message': 'Mensaje enviado correctamente',
        'details': {
            'channel': data['channel'],
            'timestamp': datetime.now().isoformat()
        }
    })
