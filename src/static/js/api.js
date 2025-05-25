/**
 * JARVIS Web App - JavaScript para la integración con el backend
 * Maneja las llamadas a la API y la comunicación con el servidor
 */

// Módulo de API
JARVIS.api = {
    // URL base de la API
    baseUrl: '/api',
    
    // Método para realizar peticiones HTTP
    request: async function(endpoint, method = 'GET', data = null) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }
            
            console.log(`Realizando petición ${method} a ${url}`);
            
            const response = await fetch(url, options);
            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(responseData.message || 'Error en la petición');
            }
            
            return responseData;
        } catch (error) {
            console.error(`Error en petición a ${endpoint}:`, error);
            throw error;
        }
    },
    
    // Métodos para endpoints específicos
    
    // Estado de JARVIS
    getStatus: async function() {
        return this.request('/status');
    },
    
    // Historial de conversación
    getConversationHistory: async function() {
        return this.request('/conversation/history');
    },
    
    // Enviar comando
    sendCommand: async function(command) {
        return this.request('/conversation/command', 'POST', { command });
    },
    
    // Servicios
    getServices: async function() {
        return this.request('/services');
    },
    
    connectService: async function(serviceId) {
        return this.request(`/services/${serviceId}/connect`, 'POST');
    },
    
    disconnectService: async function(serviceId) {
        return this.request(`/services/${serviceId}/disconnect`, 'POST');
    },
    
    updateApiKey: async function(serviceId, apiKey) {
        return this.request(`/services/${serviceId}/apikey`, 'POST', { apiKey });
    },
    
    // Preferencias
    getPreferences: async function() {
        return this.request('/preferences');
    },
    
    updatePreferences: async function(preferences) {
        return this.request('/preferences', 'POST', preferences);
    },
    
    // ChatGPT
    chatgptQuery: async function(query) {
        return this.request('/services/chatgpt/query', 'POST', { query });
    },
    
    getChatGPTConfig: async function() {
        return this.request('/services/chatgpt/config');
    },
    
    updateChatGPTConfig: async function(config) {
        return this.request('/services/chatgpt/config', 'POST', config);
    },
    
    // ClickUp
    getClickUpTasks: async function() {
        return this.request('/services/clickup/tasks');
    },
    
    createClickUpTask: async function(task) {
        return this.request('/services/clickup/tasks', 'POST', task);
    },
    
    updateClickUpTask: async function(taskId, task) {
        return this.request(`/services/clickup/tasks/${taskId}`, 'PUT', task);
    },
    
    deleteClickUpTask: async function(taskId) {
        return this.request(`/services/clickup/tasks/${taskId}`, 'DELETE');
    },
    
    getClickUpConfig: async function() {
        return this.request('/services/clickup/config');
    },
    
    updateClickUpConfig: async function(config) {
        return this.request('/services/clickup/config', 'POST', config);
    },
    
    // Google Drive
    getGDriveFiles: async function() {
        return this.request('/services/gdrive/files');
    },
    
    searchGDriveFiles: async function(query) {
        return this.request(`/services/gdrive/search?query=${encodeURIComponent(query)}`);
    },
    
    getGDriveFileDetails: async function(fileId) {
        return this.request(`/services/gdrive/files/${fileId}`);
    },
    
    uploadGDriveFile: async function(file) {
        return this.request('/services/gdrive/upload', 'POST', file);
    },
    
    getGDriveConfig: async function() {
        return this.request('/services/gdrive/config');
    },
    
    updateGDriveConfig: async function(config) {
        return this.request('/services/gdrive/config', 'POST', config);
    }
};

// Inicializar la verificación de estado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar estado del servidor
    JARVIS.api.getStatus()
        .then(response => {
            console.log('Estado del servidor:', response);
            
            // Actualizar estado de JARVIS
            if (response.success) {
                // Actualizar datos de usuario
                if (response.status.user) {
                    JARVIS.state.user = response.status.user;
                    
                    // Actualizar elementos de UI
                    const userNameElement = document.getElementById('user-name');
                    const userAvatarElement = document.getElementById('user-avatar');
                    
                    if (userNameElement) {
                        userNameElement.textContent = JARVIS.state.user.name;
                    }
                    
                    if (userAvatarElement) {
                        userAvatarElement.textContent = JARVIS.state.user.initials;
                    }
                }
                
                // Actualizar estado de JARVIS
                if (response.status.jarvis) {
                    JARVIS.state.jarvis = response.status.jarvis;
                }
                
                // Actualizar estado de servicios
                if (response.status.services) {
                    JARVIS.state.services = response.status.services;
                    JARVIS.updateServiceStatus();
                }
            }
        })
        .catch(error => {
            console.error('Error al verificar estado:', error);
            
            // Mostrar notificación de error
            JARVIS.ui.showToast({
                type: 'error',
                title: 'Error de conexión',
                message: 'No se pudo conectar con el servidor de JARVIS. Verifica tu conexión a internet.'
            });
        });
});
