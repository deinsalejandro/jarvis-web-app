from flask import Blueprint, jsonify, request
import json
import os
import time
from datetime import datetime

# Crear el blueprint para la integración con Google Drive
gdrive_bp = Blueprint('gdrive', __name__)

# Datos simulados para desarrollo
MOCK_CONFIG = {
    'account': 'maria.sanchez@gmail.com',
    'connected': True,
    'lastSync': '2025-05-25T09:45:00'
}

# Archivos simulados
MOCK_FILES = [
    {'id': 'f1', 'name': 'Presentación Cliente.pptx', 'type': 'presentation', 'modified': '2025-05-24T15:30:00'},
    {'id': 'f2', 'name': 'Propuesta Diseño.pdf', 'type': 'pdf', 'modified': '2025-05-23T10:15:00'},
    {'id': 'f3', 'name': 'Presupuesto 2025.xlsx', 'type': 'spreadsheet', 'modified': '2025-05-20T09:45:00'},
    {'id': 'f4', 'name': 'Documentación Proyecto.docx', 'type': 'document', 'modified': '2025-05-22T14:20:00'}
]

# Ruta para obtener la configuración de Google Drive
@gdrive_bp.route('/config', methods=['GET'])
def get_config():
    return jsonify({
        'success': True,
        'config': MOCK_CONFIG
    })

# Ruta para actualizar la configuración de Google Drive
@gdrive_bp.route('/config', methods=['POST'])
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

# Ruta para obtener archivos
@gdrive_bp.route('/files', methods=['GET'])
def get_files():
    # Verificar si está conectado
    if not MOCK_CONFIG['connected']:
        return jsonify({
            'success': False,
            'message': 'Google Drive no está conectado'
        }), 400
    
    # Simular obtención de archivos
    time.sleep(1)
    
    return jsonify({
        'success': True,
        'files': MOCK_FILES
    })

# Ruta para buscar archivos
@gdrive_bp.route('/search', methods=['GET'])
def search_files():
    # Verificar si está conectado
    if not MOCK_CONFIG['connected']:
        return jsonify({
            'success': False,
            'message': 'Google Drive no está conectado'
        }), 400
    
    query = request.args.get('query', '')
    
    if not query:
        return jsonify({
            'success': False,
            'message': 'Consulta de búsqueda no proporcionada'
        }), 400
    
    # Simular búsqueda
    time.sleep(1)
    
    # Filtrar archivos según la consulta
    results = [file for file in MOCK_FILES if query.lower() in file['name'].lower()]
    
    return jsonify({
        'success': True,
        'query': query,
        'results': results
    })

# Ruta para obtener detalles de un archivo
@gdrive_bp.route('/files/<file_id>', methods=['GET'])
def get_file_details(file_id):
    # Verificar si está conectado
    if not MOCK_CONFIG['connected']:
        return jsonify({
            'success': False,
            'message': 'Google Drive no está conectado'
        }), 400
    
    # Buscar archivo
    file = None
    for f in MOCK_FILES:
        if f['id'] == file_id:
            file = f
            break
    
    if file is None:
        return jsonify({
            'success': False,
            'message': f'Archivo {file_id} no encontrado'
        }), 404
    
    # Simular obtención de detalles
    time.sleep(0.5)
    
    # Añadir detalles adicionales
    file_details = file.copy()
    file_details['size'] = '2.4 MB'
    file_details['owner'] = 'María Sánchez'
    file_details['shared'] = True
    file_details['link'] = f'https://drive.google.com/file/d/{file_id}/view'
    
    return jsonify({
        'success': True,
        'file': file_details
    })

# Ruta para simular la subida de un archivo
@gdrive_bp.route('/upload', methods=['POST'])
def upload_file():
    # Verificar si está conectado
    if not MOCK_CONFIG['connected']:
        return jsonify({
            'success': False,
            'message': 'Google Drive no está conectado'
        }), 400
    
    data = request.json
    
    if not data or 'name' not in data:
        return jsonify({
            'success': False,
            'message': 'Nombre de archivo no proporcionado'
        }), 400
    
    # Simular subida
    time.sleep(2)
    
    # Crear nuevo archivo
    new_file = {
        'id': f'f{len(MOCK_FILES) + 1}',
        'name': data['name'],
        'type': data.get('type', 'document'),
        'modified': datetime.now().isoformat()
    }
    
    # Añadir a la lista
    MOCK_FILES.append(new_file)
    
    return jsonify({
        'success': True,
        'message': 'Archivo subido correctamente',
        'file': new_file
    })
