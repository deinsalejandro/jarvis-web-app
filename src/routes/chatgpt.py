from flask import Blueprint, jsonify, request
import json
import os
import time
from datetime import datetime

# Crear el blueprint para la integración con ChatGPT
chatgpt_bp = Blueprint('chatgpt', __name__)

# Datos simulados para desarrollo
MOCK_CONFIG = {
    'model': 'GPT-4',
    'connected': True,
    'lastSync': '2025-05-25T10:15:00'
}

# Ruta para obtener la configuración de ChatGPT
@chatgpt_bp.route('/config', methods=['GET'])
def get_config():
    return jsonify({
        'success': True,
        'config': MOCK_CONFIG
    })

# Ruta para actualizar la configuración de ChatGPT
@chatgpt_bp.route('/config', methods=['POST'])
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

# Ruta para enviar una consulta a ChatGPT
@chatgpt_bp.route('/query', methods=['POST'])
def query():
    data = request.json
    
    if not data or 'query' not in data:
        return jsonify({
            'success': False,
            'message': 'Consulta no proporcionada'
        }), 400
    
    # Verificar si está conectado
    if not MOCK_CONFIG['connected']:
        return jsonify({
            'success': False,
            'message': 'ChatGPT no está conectado'
        }), 400
    
    # Simular consulta a ChatGPT
    time.sleep(1.5)
    
    # Generar respuesta simulada
    query_text = data['query']
    
    # Respuestas simuladas basadas en palabras clave
    if 'tiempo' in query_text.lower() or 'clima' in query_text.lower():
        response = "Según los datos actuales, hoy se espera un clima soleado con temperaturas entre 22°C y 28°C. Hay una probabilidad de lluvia del 10% por la tarde."
    elif 'tarea' in query_text.lower() or 'recordatorio' in query_text.lower():
        response = "He creado un recordatorio para ti. ¿Quieres que lo añada a tu lista de tareas en ClickUp?"
    elif 'archivo' in query_text.lower() or 'documento' in query_text.lower():
        response = "He encontrado varios documentos relacionados en tu Google Drive. ¿Quieres que te muestre los más recientes?"
    elif 'reunión' in query_text.lower() or 'cita' in query_text.lower():
        response = "Según tu calendario, tienes una reunión programada para mañana a las 10:00 AM con el equipo de desarrollo."
    elif 'resumen' in query_text.lower() or 'síntesis' in query_text.lower():
        response = "He generado un resumen de los puntos clave del documento. ¿Quieres que lo guarde en tus notas o lo comparta con tu equipo?"
    else:
        response = f"He procesado tu consulta: '{query_text}'. ¿Hay algo específico en lo que pueda ayudarte con esta información?"
    
    return jsonify({
        'success': True,
        'response': response,
        'model': MOCK_CONFIG['model'],
        'timestamp': datetime.now().isoformat()
    })
