/**
 * JARVIS Web App - JavaScript principal
 * Contiene funcionalidades comunes y la inicialización de la aplicación
 */

// Configuración global
const JARVIS = {
    config: {
        apiBaseUrl: '/api',
        refreshInterval: 30000, // 30 segundos
        toastDuration: 5000,    // 5 segundos
        debug: false
    },
    
    // Estado de la aplicación
    state: {
        user: {
            name: 'María Sánchez',
            initials: 'MS',
            isLoggedIn: true
        },
        jarvis: {
            isActive: true,
            version: '1.0.0'
        },
        services: {
            chatgpt: { connected: true, lastSync: '2025-05-25T10:15:00', details: { model: 'GPT-4' } },
            clickup: { connected: true, lastSync: '2025-05-25T10:30:00', details: { workspace: 'Mi Espacio' } },
            onedrive: { connected: false, lastSync: null, details: {} },
            gdrive: { connected: true, lastSync: '2025-05-25T09:45:00', details: { account: 'maria.sanchez@gmail.com' } },
            slack: { connected: false, lastSync: null, details: {} }
        },
        preferences: {
            theme: 'dark',
            language: 'es',
            neonColor: 'cyan',
            autoStart: true,
            showNotifications: true,
            interfaceSounds: false,
            highContrast: false
        },
        ui: {
            sidebarCollapsed: false,
            immersiveMode: false
        }
    },
    
    // Inicialización de la aplicación
    init: function() {
        this.setupEventListeners();
        this.updateServiceStatus();
        this.setupTheme();
        
        // Inicializar componentes específicos de la página
        if (typeof JARVIS.conversation !== 'undefined') {
            JARVIS.conversation.init();
        }
        
        if (typeof JARVIS.settings !== 'undefined') {
            JARVIS.settings.init();
        }
        
        // Mostrar notificación de bienvenida
        this.ui.showToast({
            type: 'info',
            title: 'JARVIS Iniciado',
            message: 'Bienvenido/a ' + this.state.user.name + '. JARVIS está listo para asistirte.',
            duration: 3000
        });
        
        // Iniciar intervalo de actualización de estado
        setInterval(() => this.updateServiceStatus(), this.config.refreshInterval);
        
        console.log('JARVIS Web App inicializada');
    },
    
    // Configurar escuchadores de eventos
    setupEventListeners: function() {
        // Toggle del sidebar
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.ui.toggleSidebar());
        }
        
        // Modo inmersivo
        const immersiveBtn = document.getElementById('immersive-mode-btn');
        if (immersiveBtn) {
            immersiveBtn.addEventListener('click', () => this.ui.toggleImmersiveMode());
        }
        
        // Botón de notificaciones
        const notificationsBtn = document.getElementById('notifications-btn');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', () => {
                this.ui.showToast({
                    type: 'info',
                    title: 'Notificaciones',
                    message: 'No tienes notificaciones nuevas.'
                });
            });
        }
    },
    
    // Actualizar estado de los servicios
    updateServiceStatus: function() {
        // En una implementación real, esto haría una llamada a la API
        // Por ahora, usamos datos de muestra
        
        for (const service in this.state.services) {
            const statusElement = document.querySelector(`.nav-item[data-service="${service}"] .service-status`);
            if (statusElement) {
                if (this.state.services[service].connected) {
                    statusElement.classList.remove('offline');
                } else {
                    statusElement.classList.add('offline');
                }
            }
        }
    },
    
    // Configurar tema
    setupTheme: function() {
        const theme = this.state.preferences.theme;
        const neonColor = this.state.preferences.neonColor;
        
        // Aplicar tema
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
        
        // Aplicar color neón
        document.body.setAttribute('data-neon-color', neonColor);
        
        // Aplicar alto contraste si está activado
        if (this.state.preferences.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    },
    
    // Funciones de API
    api: {
        // Enviar comando a JARVIS
        sendCommand: async function(command) {
            try {
                // En una implementación real, esto haría una llamada a la API
                // Por ahora, simulamos una respuesta
                
                console.log('Enviando comando:', command);
                
                // Simular tiempo de respuesta
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Respuesta simulada
                return {
                    success: true,
                    message: 'Comando procesado correctamente',
                    response: {
                        text: `He recibido tu comando: "${command}"`,
                        type: 'text',
                        timestamp: new Date().toISOString()
                    }
                };
            } catch (error) {
                console.error('Error al enviar comando:', error);
                return {
                    success: false,
                    message: 'Error al procesar el comando',
                    error: error.message
                };
            }
        },
        
        // Obtener historial de conversación
        getHistory: async function() {
            try {
                // En una implementación real, esto haría una llamada a la API
                // Por ahora, simulamos una respuesta
                
                console.log('Obteniendo historial de conversación');
                
                // Simular tiempo de respuesta
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Historial simulado
                return {
                    success: true,
                    history: [
                        {
                            id: '1',
                            sender: 'user',
                            senderName: JARVIS.state.user.name,
                            text: 'JARVIS, muéstrame mis tareas pendientes en ClickUp para hoy.',
                            timestamp: '2025-05-25T10:30:00'
                        },
                        {
                            id: '2',
                            sender: 'jarvis',
                            senderName: 'JARVIS',
                            text: 'Claro, María. Aquí están tus tareas pendientes para hoy en ClickUp:',
                            timestamp: '2025-05-25T10:30:05',
                            integration: {
                                type: 'clickup',
                                title: 'ClickUp - Tareas para hoy',
                                data: {
                                    tasks: [
                                        { id: 't1', name: 'Preparar presentación para cliente', completed: false, due: 'Hoy, 14:00' },
                                        { id: 't2', name: 'Revisar propuesta de diseño', completed: false, due: 'Hoy, 16:00' },
                                        { id: 't3', name: 'Enviar correo a proveedores', completed: true, due: 'Hoy, 10:00' },
                                        { id: 't4', name: 'Actualizar documentación del proyecto', completed: false, due: 'Hoy, 17:00' }
                                    ]
                                }
                            }
                        },
                        {
                            id: '3',
                            sender: 'user',
                            senderName: JARVIS.state.user.name,
                            text: 'Gracias. Marca como completada la tarea "Revisar propuesta de diseño" y crea una nueva tarea para llamar al cliente a las 15:00.',
                            timestamp: '2025-05-25T10:32:00'
                        },
                        {
                            id: '4',
                            sender: 'jarvis',
                            senderName: 'JARVIS',
                            text: 'He marcado la tarea "Revisar propuesta de diseño" como completada y he creado una nueva tarea para llamar al cliente a las 15:00. Aquí está tu lista actualizada:',
                            timestamp: '2025-05-25T10:32:05',
                            integration: {
                                type: 'clickup',
                                title: 'ClickUp - Tareas para hoy',
                                data: {
                                    tasks: [
                                        { id: 't1', name: 'Preparar presentación para cliente', completed: false, due: 'Hoy, 14:00' },
                                        { id: 't2', name: 'Revisar propuesta de diseño', completed: true, due: 'Hoy, 16:00' },
                                        { id: 't3', name: 'Enviar correo a proveedores', completed: true, due: 'Hoy, 10:00' },
                                        { id: 't4', name: 'Actualizar documentación del proyecto', completed: false, due: 'Hoy, 17:00' },
                                        { id: 't5', name: 'Llamar al cliente', completed: false, due: 'Hoy, 15:00' }
                                    ]
                                }
                            }
                        }
                    ]
                };
            } catch (error) {
                console.error('Error al obtener historial:', error);
                return {
                    success: false,
                    message: 'Error al obtener historial',
                    error: error.message
                };
            }
        },
        
        // Obtener estado de los servicios
        getServiceStatus: async function() {
            try {
                // En una implementación real, esto haría una llamada a la API
                // Por ahora, simulamos una respuesta
                
                console.log('Obteniendo estado de servicios');
                
                // Simular tiempo de respuesta
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Estado simulado
                return {
                    success: true,
                    services: JARVIS.state.services
                };
            } catch (error) {
                console.error('Error al obtener estado de servicios:', error);
                return {
                    success: false,
                    message: 'Error al obtener estado de servicios',
                    error: error.message
                };
            }
        },
        
        // Conectar servicio
        connectService: async function(service) {
            try {
                // En una implementación real, esto iniciaría el flujo OAuth
                // Por ahora, simulamos una respuesta
                
                console.log('Conectando servicio:', service);
                
                // Simular tiempo de respuesta
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Actualizar estado
                JARVIS.state.services[service].connected = true;
                JARVIS.state.services[service].lastSync = new Date().toISOString();
                
                // Respuesta simulada
                return {
                    success: true,
                    message: `Servicio ${service} conectado correctamente`,
                    service: JARVIS.state.services[service]
                };
            } catch (error) {
                console.error(`Error al conectar servicio ${service}:`, error);
                return {
                    success: false,
                    message: `Error al conectar servicio ${service}`,
                    error: error.message
                };
            }
        },
        
        // Desconectar servicio
        disconnectService: async function(service) {
            try {
                // En una implementación real, esto revocaría los tokens
                // Por ahora, simulamos una respuesta
                
                console.log('Desconectando servicio:', service);
                
                // Simular tiempo de respuesta
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Actualizar estado
                JARVIS.state.services[service].connected = false;
                JARVIS.state.services[service].lastSync = null;
                
                // Respuesta simulada
                return {
                    success: true,
                    message: `Servicio ${service} desconectado correctamente`,
                    service: JARVIS.state.services[service]
                };
            } catch (error) {
                console.error(`Error al desconectar servicio ${service}:`, error);
                return {
                    success: false,
                    message: `Error al desconectar servicio ${service}`,
                    error: error.message
                };
            }
        },
        
        // Actualizar API key
        updateApiKey: async function(service, apiKey) {
            try {
                // En una implementación real, esto actualizaría la API key en el backend
                // Por ahora, simulamos una respuesta
                
                console.log(`Actualizando API key para ${service}`);
                
                // Simular tiempo de respuesta
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Respuesta simulada
                return {
                    success: true,
                    message: `API key para ${service} actualizada correctamente`
                };
            } catch (error) {
                console.error(`Error al actualizar API key para ${service}:`, error);
                return {
                    success: false,
                    message: `Error al actualizar API key para ${service}`,
                    error: error.message
                };
            }
        },
        
        // Guardar preferencias
        savePreferences: async function(preferences) {
            try {
                // En una implementación real, esto guardaría las preferencias en el backend
                // Por ahora, simulamos una respuesta
                
                console.log('Guardando preferencias:', preferences);
                
                // Simular tiempo de respuesta
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Actualizar estado
                Object.assign(JARVIS.state.preferences, preferences);
                
                // Respuesta simulada
                return {
                    success: true,
                    message: 'Preferencias guardadas correctamente',
                    preferences: JARVIS.state.preferences
                };
            } catch (error) {
                console.error('Error al guardar preferencias:', error);
                return {
                    success: false,
                    message: 'Error al guardar preferencias',
                    error: error.message
                };
            }
        }
    },
    
    // Funciones de UI
    ui: {
        // Toggle del sidebar
        toggleSidebar: function() {
            const sidebar = document.getElementById('sidebar');
            const sidebarToggle = document.getElementById('sidebar-toggle');
            
            if (sidebar) {
                sidebar.classList.toggle('sidebar-collapsed');
                JARVIS.state.ui.sidebarCollapsed = sidebar.classList.contains('sidebar-collapsed');
                
                if (sidebarToggle) {
                    if (JARVIS.state.ui.sidebarCollapsed) {
                        sidebarToggle.innerHTML = '<i class="fas fa-chevron-right"></i>';
                    } else {
                        sidebarToggle.innerHTML = '<i class="fas fa-chevron-left"></i>';
                    }
                }
            }
        },
        
        // Toggle del modo inmersivo
        toggleImmersiveMode: function() {
            const appContainer = document.querySelector('.app-container');
            const immersiveBtn = document.getElementById('immersive-mode-btn');
            
            if (appContainer) {
                appContainer.classList.toggle('immersive-mode');
                JARVIS.state.ui.immersiveMode = appContainer.classList.contains('immersive-mode');
                
                if (immersiveBtn) {
                    if (JARVIS.state.ui.immersiveMode) {
                        immersiveBtn.innerHTML = '<i class="fas fa-compress header-button-icon"></i><span>Modo Normal</span>';
                    } else {
                        immersiveBtn.innerHTML = '<i class="fas fa-expand header-button-icon"></i><span>Modo Inmersivo</span>';
                    }
                }
                
                // Mostrar notificación
                if (JARVIS.state.ui.immersiveMode) {
                    this.showToast({
                        type: 'info',
                        title: 'Modo Inmersivo Activado',
                        message: 'Mueve el cursor a la parte superior para mostrar los controles.',
                        duration: 3000
                    });
                }
            }
        },
        
        // Mostrar notificación toast
        showToast: function(options) {
            const { type = 'info', title, message, duration = JARVIS.config.toastDuration } = options;
            
            // Obtener el contenedor de toasts
            const toastContainer = document.getElementById('toast-container');
            if (!toastContainer) return;
            
            // Crear el toast a partir del template
            const toastTemplate = document.getElementById('toast-template');
            if (!toastTemplate) {
                console.error('Template de toast no encontrado');
                return;
            }
            
            const toast = document.importNode(toastTemplate.content, true).querySelector('.toast');
            
            // Configurar el toast
            toast.classList.add(`toast-${type}`);
            
            // Configurar el icono
            const iconElement = toast.querySelector('.toast-icon');
            if (iconElement) {
                let iconClass = 'fas fa-info-circle';
                
                switch (type) {
                    case 'success':
                        iconClass = 'fas fa-check-circle';
                        break;
                    case 'error':
                        iconClass = 'fas fa-exclamation-circle';
                        break;
                    case 'warning':
                        iconClass = 'fas fa-exclamation-triangle';
                        break;
                }
                
                iconElement.className = `toast-icon ${iconClass}`;
            }
            
            // Configurar el título y mensaje
            const titleElement = toast.querySelector('.toast-title');
            const messageElement = toast.querySelector('.toast-message');
            
            if (titleElement) titleElement.textContent = title;
            if (messageElement) messageElement.textContent = message;
            
            // Configurar el botón de cierre
            const closeButton = toast.querySelector('.toast-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    toast.classList.add('fade-out');
                    setTimeout(() => {
                        toast.remove();
                    }, 300);
                });
            }
            
            // Añadir el toast al contenedor
            toastContainer.appendChild(toast);
            
            // Reproducir sonido si está activado
            if (JARVIS.state.preferences.interfaceSounds) {
                // Reproducir sonido según el tipo
                // (En una implementación real, se reproduciría un sonido)
            }
            
            // Eliminar el toast después del tiempo especificado
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.classList.add('fade-out');
                    setTimeout(() => {
                        toast.remove();
                    }, 300);
                }
            }, duration);
            
            return toast;
        },
        
        // Formatear fecha
        formatDate: function(dateString) {
            const date = new Date(dateString);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        },
        
        // Formatear fecha completa
        formatFullDate: function(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }
};

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    JARVIS.init();
});
