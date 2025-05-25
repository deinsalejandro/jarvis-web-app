from flask import Blueprint, jsonify, request
import json
import os
import time
from datetime import datetime

# Crear el blueprint para la integración con ClickUp
clickup_bp = Blueprint('clickup', __name__)

# Datos simulados para desarrollo
MOCK_CONFIG = {
    'workspace': 'Mi Espacio',
    'connected': True,
    'lastSync': '2025-05-25T10:30:00'
}

# Tareas simuladas
MOCK_TASKS = [
    {'id': 't1', 'name': 'Preparar presentación para cliente', 'completed': False, 'due': 'Hoy, 14:00'},
    {'id': 't2', 'name': 'Revisar propuesta de diseño', 'completed': True, 'due': 'Hoy, 16:00'},
    {'id': 't3', 'name': 'Enviar correo a proveedores', 'completed': True, 'due': 'Hoy, 10:00'},
    {'id': 't4', 'name': 'Actualizar documentación del proyecto', 'completed': False, 'due': 'Hoy, 17:00'},
    {'id': 't5', 'name': 'Llamar al cliente', 'completed': False, 'due': 'Hoy, 15:00'}
]

# Ruta para obtener la configuración de ClickUp
@clickup_bp.route('/config', methods=['GET'])
def get_config():
    return jsonify({
        'success': True,
        'config': MOCK_CONFIG
    })

# Ruta para actualizar la configuración de ClickUp
@clickup_bp.route('/config', methods=['POST'])
def update_config():
    data = request.json
    
    if not data:
        return jsonify({
            'success': False,
            'message': 'Datos no proporcionados'
        }), 400
    
    # Actualizar configuración
    for key, value in data.items():
        if key in MOCK_CONFIG:
            MOCK_CONFIG[key] = value
    
    # Actualizar timestamp
    MOCK_CONFIG['lastSync'] = datetime.now().isoformat()
    
    return jsonify({
        'success': True,
        'message': 'Configuración actualizada correctamente',
        'config': MOCK_CONFIG
    })

# Ruta para obtener tareas
@clickup_bp.route('/tasks', methods=['GET'])
def get_tasks():
    # Verificar si está conectado
    if not MOCK_CONFIG['connected']:
        return jsonify({
            'success': False,
            'message': 'ClickUp no está conectado'
        }), 400
    
    # Simular obtención de tareas
    time.sleep(1)
    
    return jsonify({
        'success': True,
        'tasks': MOCK_TASKS
    })

# Ruta para crear una tarea
@clickup_bp.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    
    if not data or 'name' not in data:
        return jsonify({
            'success': False,
            'message': 'Nombre de tarea no proporcionado'
        }), 400
    
    # Verificar si está conectado
    if not MOCK_CONFIG['connected']:
        return jsonify({
            'success': False,
            'message': 'ClickUp no está conectado'
        }), 400
    
    # Simular creación de tarea
    time.sleep(1)
    
    # Crear nueva tarea
    new_task = {
        'id': f't{len(MOCK_TASKS) + 1}',
        'name': data['name'],
        'completed': False,
        'due': data.get('due', 'No especificado')
    }
    
    # Añadir a la lista
    MOCK_TASKS.append(new_task)
    
    return jsonify({
        'success': True,
        'message': 'Tarea creada correctamente',
        'task': new_task
    })

# Ruta para actualizar una tarea
@clickup_bp.route('/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    
    if not data:
        return jsonify({
            'success': False,
            'message': 'Datos no proporcionados'
        }), 400
    
    # Verificar si está conectado
    if not MOCK_CONFIG['connected']:
        return jsonify({
            'success': False,
            'message': 'ClickUp no está conectado'
        }), 400
    
    # Buscar tarea
    task_index = None
    for i, task in enumerate(MOCK_TASKS):
        if task['id'] == task_id:
            task_index = i
            break
    
    if task_index is None:
        return jsonify({
            'success': False,
            'message': f'Tarea {task_id} no encontrada'
        }), 404
    
    # Actualizar tarea
    for key, value in data.items():
        if key in MOCK_TASKS[task_index]:
            MOCK_TASKS[task_index][key] = value
    
    return jsonify({
        'success': True,
        'message': 'Tarea actualizada correctamente',
        'task': MOCK_TASKS[task_index]
    })

# Ruta para eliminar una tarea
@clickup_bp.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    # Verificar si está conectado
    if not MOCK_CONFIG['connected']:
        return jsonify({
            'success': False,
            'message': 'ClickUp no está conectado'
        }), 400
    
    # Buscar tarea
    task_index = None
    for i, task in enumerate(MOCK_TASKS):
        if task['id'] == task_id:
            task_index = i
            break
    
    if task_index is None:
        return jsonify({
            'success': False,
            'message': f'Tarea {task_id} no encontrada'
        }), 404
    
    # Eliminar tarea
    deleted_task = MOCK_TASKS.pop(task_index)
    
    return jsonify({
        'success': True,
        'message': 'Tarea eliminada correctamente',
        'task': deleted_task
    })
