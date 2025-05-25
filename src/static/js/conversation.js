/**
 * JARVIS Web App - JavaScript para la página de conversación
 * Maneja la interacción con el chat y las respuestas de JARVIS
 */

// Módulo de conversación
JARVIS.conversation = {
    // Inicialización del módulo
    init: function() {
        this.setupEventListeners();
        this.loadConversationHistory();
        this.setupCommandSuggestions();
    },
    
    // Configurar escuchadores de eventos
    setupEventListeners: function() {
        // Envío de comandos
        const commandInput = document.getElementById('command-input');
        const sendCommandBtn = document.getElementById('send-command-btn');
        
        if (commandInput && sendCommandBtn) {
            // Enviar comando al hacer clic en el botón
            sendCommandBtn.addEventListener('click', () => {
                this.sendCommand();
            });
            
            // Enviar comando al presionar Enter
            commandInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    this.sendCommand();
                }
            });
            
            // Mostrar sugerencias al escribir
            commandInput.addEventListener('input', () => {
                this.showCommandSuggestions(commandInput.value);
            });
            
            // Ocultar sugerencias al perder el foco
            commandInput.addEventListener('blur', () => {
                setTimeout(() => {
                    const suggestions = document.getElementById('command-suggestions');
                    if (suggestions) {
                        suggestions.style.display = 'none';
                    }
                }, 200);
            });
        }
    },
    
    // Cargar historial de conversación
    loadConversationHistory: async function() {
        const conversationHistory = document.getElementById('conversation-history');
        if (!conversationHistory) return;
        
        // Mostrar indicador de carga
        conversationHistory.innerHTML = `
            <div class="loader-container">
                <div class="loader"></div>
            </div>
        `;
        
        try {
            // Obtener historial
            const response = await JARVIS.api.getHistory();
            
            if (response.success) {
                // Limpiar contenedor
                conversationHistory.innerHTML = '';
                
                // Renderizar mensajes
                response.history.forEach(message => {
                    this.renderMessage(message);
                });
                
                // Scroll al final
                this.scrollToBottom();
            } else {
                // Mostrar error
                conversationHistory.innerHTML = `
                    <div class="text-center p-lg">
                        <i class="fas fa-exclamation-circle" style="font-size: 48px; color: var(--neon-error);"></i>
                        <p class="mt-md">Error al cargar el historial de conversación.</p>
                        <button class="integration-button primary mt-md" onclick="JARVIS.conversation.loadConversationHistory()">
                            <i class="fas fa-sync-alt mr-sm"></i> Reintentar
                        </button>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error al cargar historial:', error);
            
            // Mostrar error
            conversationHistory.innerHTML = `
                <div class="text-center p-lg">
                    <i class="fas fa-exclamation-circle" style="font-size: 48px; color: var(--neon-error);"></i>
                    <p class="mt-md">Error al cargar el historial de conversación.</p>
                    <button class="integration-button primary mt-md" onclick="JARVIS.conversation.loadConversationHistory()">
                        <i class="fas fa-sync-alt mr-sm"></i> Reintentar
                    </button>
                </div>
            `;
        }
    },
    
    // Enviar comando
    sendCommand: async function() {
        const commandInput = document.getElementById('command-input');
        if (!commandInput) return;
        
        const command = commandInput.value.trim();
        if (!command) return;
        
        // Limpiar input
        commandInput.value = '';
        
        // Renderizar mensaje del usuario
        const userMessage = {
            id: Date.now().toString(),
            sender: 'user',
            senderName: JARVIS.state.user.name,
            text: command,
            timestamp: new Date().toISOString()
        };
        
        this.renderMessage(userMessage);
        this.scrollToBottom();
        
        // Mostrar indicador de escritura
        this.showTypingIndicator();
        
        try {
            // Enviar comando a la API
            const response = await JARVIS.api.sendCommand(command);
            
            // Ocultar indicador de escritura
            this.hideTypingIndicator();
            
            if (response.success) {
                // Renderizar respuesta
                const jarvisMessage = {
                    id: Date.now().toString(),
                    sender: 'jarvis',
                    senderName: 'JARVIS',
                    text: response.response.text,
                    timestamp: response.response.timestamp,
                    integration: response.response.integration
                };
                
                this.renderMessage(jarvisMessage);
                this.scrollToBottom();
            } else {
                // Mostrar error
                JARVIS.ui.showToast({
                    type: 'error',
                    title: 'Error',
                    message: response.message || 'Error al procesar el comando'
                });
            }
        } catch (error) {
            console.error('Error al enviar comando:', error);
            
            // Ocultar indicador de escritura
            this.hideTypingIndicator();
            
            // Mostrar error
            JARVIS.ui.showToast({
                type: 'error',
                title: 'Error',
                message: 'Error al enviar el comando'
            });
        }
    },
    
    // Renderizar mensaje
    renderMessage: function(message) {
        const conversationHistory = document.getElementById('conversation-history');
        if (!conversationHistory) return;
        
        // Obtener template
        const messageTemplate = document.getElementById('message-template');
        if (!messageTemplate) {
            console.error('Template de mensaje no encontrado');
            return;
        }
        
        // Clonar template
        const messageElement = document.importNode(messageTemplate.content, true).querySelector('.message');
        
        // Configurar clase según el remitente
        if (message.sender === 'user') {
            messageElement.classList.add('user-message');
        } else {
            messageElement.classList.add('jarvis-message');
        }
        
        // Configurar avatar
        const avatarElement = messageElement.querySelector('.message-avatar');
        if (avatarElement) {
            if (message.sender === 'user') {
                avatarElement.classList.add('user-avatar');
            } else {
                avatarElement.classList.add('jarvis-avatar');
            }
            
            const initialsElement = avatarElement.querySelector('.avatar-initials');
            if (initialsElement) {
                initialsElement.textContent = message.sender === 'user' ? JARVIS.state.user.initials : 'J';
            }
        }
        
        // Configurar remitente
        const senderElement = messageElement.querySelector('.message-sender');
        if (senderElement) {
            senderElement.textContent = message.senderName;
        }
        
        // Configurar hora
        const timeElement = messageElement.querySelector('.message-time');
        if (timeElement) {
            timeElement.textContent = JARVIS.ui.formatDate(message.timestamp);
        }
        
        // Configurar texto
        const textElement = messageElement.querySelector('.message-text');
        if (textElement) {
            textElement.textContent = message.text;
        }
        
        // Añadir tarjeta de integración si existe
        if (message.integration) {
            this.renderIntegrationCard(message.integration, messageElement);
        }
        
        // Añadir mensaje al historial
        conversationHistory.appendChild(messageElement);
    },
    
    // Renderizar tarjeta de integración
    renderIntegrationCard: function(integration, messageElement) {
        // Obtener el contenedor de texto del mensaje
        const textElement = messageElement.querySelector('.message-bubble');
        if (!textElement) return;
        
        // Obtener template
        const cardTemplate = document.getElementById('integration-card-template');
        if (!cardTemplate) {
            console.error('Template de tarjeta de integración no encontrado');
            return;
        }
        
        // Clonar template
        const cardElement = document.importNode(cardTemplate.content, true).querySelector('.integration-card');
        
        // Configurar título
        const titleElement = cardElement.querySelector('.integration-title');
        if (titleElement) {
            titleElement.textContent = integration.title;
        }
        
        // Configurar icono según el tipo
        const iconElement = cardElement.querySelector('.integration-icon i');
        if (iconElement) {
            let iconClass = '';
            
            switch (integration.type) {
                case 'chatgpt':
                    iconClass = 'fas fa-robot chatgpt-icon';
                    break;
                case 'clickup':
                    iconClass = 'fas fa-tasks clickup-icon';
                    break;
                case 'onedrive':
                    iconClass = 'fab fa-microsoft onedrive-icon';
                    break;
                case 'gdrive':
                    iconClass = 'fab fa-google-drive gdrive-icon';
                    break;
                case 'slack':
                    iconClass = 'fab fa-slack slack-icon';
                    break;
                default:
                    iconClass = 'fas fa-plug';
            }
            
            iconElement.className = iconClass;
        }
        
        // Configurar contenido según el tipo
        const contentElement = cardElement.querySelector('.integration-content');
        if (contentElement) {
            switch (integration.type) {
                case 'clickup':
                    this.renderClickUpTasks(integration.data, contentElement);
                    break;
                // Otros tipos de integración se manejarían aquí
            }
        }
        
        // Configurar acciones
        const actionsElement = cardElement.querySelector('.integration-actions');
        if (actionsElement) {
            switch (integration.type) {
                case 'clickup':
                    actionsElement.innerHTML = `
                        <button class="integration-button">Ver todas</button>
                        <button class="integration-button primary">Crear tarea</button>
                    `;
                    break;
                // Otros tipos de integración se manejarían aquí
            }
        }
        
        // Añadir tarjeta al mensaje
        textElement.appendChild(cardElement);
    },
    
    // Renderizar tareas de ClickUp
    renderClickUpTasks: function(data, container) {
        if (!data || !data.tasks || !container) return;
        
        // Crear lista de tareas
        const taskList = document.createElement('div');
        taskList.className = 'task-list';
        
        // Añadir tareas
        data.tasks.forEach(task => {
            // Obtener template
            const taskTemplate = document.getElementById('task-item-template');
            if (!taskTemplate) {
                console.error('Template de tarea no encontrado');
                return;
            }
            
            // Clonar template
            const taskElement = document.importNode(taskTemplate.content, true).querySelector('.task-item');
            
            // Configurar checkbox
            const checkboxElement = taskElement.querySelector('.task-checkbox');
            if (checkboxElement) {
                if (task.completed) {
                    checkboxElement.classList.add('checked');
                }
                
                // Añadir evento de clic
                checkboxElement.addEventListener('click', () => {
                    checkboxElement.classList.toggle('checked');
                    // En una implementación real, esto actualizaría el estado de la tarea en la API
                });
            }
            
            // Configurar nombre
            const nameElement = taskElement.querySelector('.task-name');
            if (nameElement) {
                nameElement.textContent = task.name;
            }
            
            // Configurar fecha de vencimiento
            const dueElement = taskElement.querySelector('.task-due');
            if (dueElement) {
                dueElement.textContent = task.due;
            }
            
            // Añadir tarea a la lista
            taskList.appendChild(taskElement);
        });
        
        // Añadir lista al contenedor
        container.appendChild(taskList);
    },
    
    // Mostrar indicador de escritura
    showTypingIndicator: function() {
        const conversationHistory = document.getElementById('conversation-history');
        if (!conversationHistory) return;
        
        // Crear indicador
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message jarvis-message';
        typingIndicator.id = 'typing-indicator';
        
        typingIndicator.innerHTML = `
            <div class="message-avatar jarvis-avatar">J</div>
            <div class="message-content">
                <div class="message-header">
                    <div class="message-sender">JARVIS</div>
                    <div class="message-time">${JARVIS.ui.formatDate(new Date().toISOString())}</div>
                </div>
                <div class="message-bubble">
                    <div class="message-text">
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Añadir estilos para los puntos
        const style = document.createElement('style');
        style.textContent = `
            .typing-dots {
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }
            
            .typing-dots span {
                width: 8px;
                height: 8px;
                margin: 0 2px;
                background-color: var(--neon-primary);
                border-radius: 50%;
                opacity: 0.6;
                animation: typingAnimation 1.4s infinite ease-in-out;
            }
            
            .typing-dots span:nth-child(1) {
                animation-delay: 0s;
            }
            
            .typing-dots span:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .typing-dots span:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes typingAnimation {
                0%, 100% {
                    transform: scale(1);
                    opacity: 0.6;
                }
                50% {
                    transform: scale(1.5);
                    opacity: 1;
                }
            }
        `;
        
        document.head.appendChild(style);
        
        // Añadir indicador al historial
        conversationHistory.appendChild(typingIndicator);
        
        // Scroll al final
        this.scrollToBottom();
    },
    
    // Ocultar indicador de escritura
    hideTypingIndicator: function() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    },
    
    // Scroll al final de la conversación
    scrollToBottom: function() {
        const conversationHistory = document.getElementById('conversation-history');
        if (conversationHistory) {
            conversationHistory.scrollTop = conversationHistory.scrollHeight;
        }
    },
    
    // Configurar sugerencias de comandos
    setupCommandSuggestions: function() {
        // Sugerencias predefinidas
        this.suggestions = [
            {
                text: 'Mostrar tareas pendientes en ClickUp',
                icon: 'fas fa-tasks',
                command: 'Muéstrame mis tareas pendientes en ClickUp para hoy'
            },
            {
                text: 'Buscar archivos en Google Drive',
                icon: 'fab fa-google-drive',
                command: 'Busca archivos recientes en Google Drive'
            },
            {
                text: 'Enviar mensaje a Slack',
                icon: 'fab fa-slack',
                command: 'Envía un mensaje a Slack'
            },
            {
                text: 'Crear nueva tarea en ClickUp',
                icon: 'fas fa-plus-circle',
                command: 'Crea una nueva tarea en ClickUp'
            },
            {
                text: 'Buscar información con ChatGPT',
                icon: 'fas fa-robot',
                command: 'Busca información sobre'
            }
        ];
    },
    
    // Mostrar sugerencias de comandos
    showCommandSuggestions: function(query) {
        const suggestionsContainer = document.getElementById('command-suggestions');
        if (!suggestionsContainer) return;
        
        // Filtrar sugerencias según la consulta
        const filteredSuggestions = query
            ? this.suggestions.filter(s => s.text.toLowerCase().includes(query.toLowerCase()))
            : this.suggestions;
        
        // Si no hay sugerencias o la consulta está vacía, ocultar el contenedor
        if (filteredSuggestions.length === 0 || !query) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        // Limpiar contenedor
        suggestionsContainer.innerHTML = '';
        
        // Añadir sugerencias
        filteredSuggestions.forEach(suggestion => {
            // Obtener template
            const suggestionTemplate = document.getElementById('suggestion-item-template');
            if (!suggestionTemplate) {
                console.error('Template de sugerencia no encontrado');
                return;
            }
            
            // Clonar template
            const suggestionElement = document.importNode(suggestionTemplate.content, true).querySelector('.suggestion-item');
            
            // Configurar icono
            const iconElement = suggestionElement.querySelector('.suggestion-icon');
            if (iconElement) {
                iconElement.className = `suggestion-icon ${suggestion.icon}`;
            }
            
            // Configurar texto
            const textElement = suggestionElement.querySelector('.suggestion-text');
            if (textElement) {
                textElement.textContent = suggestion.text;
            }
            
            // Añadir evento de clic
            suggestionElement.addEventListener('click', () => {
                const commandInput = document.getElementById('command-input');
                if (commandInput) {
                    commandInput.value = suggestion.command;
                    commandInput.focus();
                    suggestionsContainer.style.display = 'none';
                }
            });
            
            // Añadir sugerencia al contenedor
            suggestionsContainer.appendChild(suggestionElement);
        });
        
        // Mostrar contenedor
        suggestionsContainer.style.display = 'block';
    }
};
