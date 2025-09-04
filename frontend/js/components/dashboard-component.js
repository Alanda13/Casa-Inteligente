// js/components/dashboard-component.js

const dashboardComponent = {
    render: async () => {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="dashboard-container">
                <h2 class="section-title">Dashboard</h2>
                <div class="top-row">
                    <div class="card main-status-card">
                        <div class="temp-value">0°C</div>
                        <div class="temp-label">Temperatura Ambiente</div>
                    </div>
                    <div class="room-cards-container" id="room-cards">
                    </div>
                </div>

                <div class="card scenes-card">
                    <div class="scene-flow-header">
                        <h3>Cenas</h3>
                    </div>
                    <div class="card-content" id="scene-cards">
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="card stats-card">
                        <h3>Dispositivos Ligados</h3>
                        <div class="stats-list" id="devices-on-list">
                        </div>
                    </div>
                    <div class="card stats-card">
                        <h3>Dispositivo Mais Usado</h3>
                        <div class="stats-list" id="most-used-list">
                        </div>
                    </div>
                    <div class="card stats-card">
                        <h3>Total de Dispositivos</h3>
                        <div class="stat-value" id="total-devices-count">0</div>
                    </div>
                </div>
            </div>
        `;
        await dashboardComponent.loadData();
    },

    loadData: async () => {
        try {
            const devices = await api.getDevices();
            const rooms = await api.getRooms();
            const scenes = await api.getScenes();

            dashboardComponent.renderRooms(rooms, devices);
            dashboardComponent.renderScenes(scenes, devices);
            dashboardComponent.renderStats(devices);

        } catch (error) {
            showNotification('Erro ao carregar os dados do painel.', 'error');
            console.error('Erro:', error);
        }
    },

    renderRooms: (rooms, devices) => {
        const roomCardsContainer = document.getElementById('room-cards');
        roomCardsContainer.innerHTML = '';
        rooms.forEach(room => {
            const roomDevices = devices.filter(d => d.comodo_id === room.id);
            const deviceNames = roomDevices.map(d => d.nome).join(', ');
            
            const roomCard = document.createElement('div');
            roomCard.className = 'room-card';
            roomCard.innerHTML = `
                <div class="room-icon-wrapper">
                    <i class="${getRoomIcon(room.nome)}"></i>
                </div>
                <div class="room-info">
                    <h3>${room.nome}</h3>
                    <p>${deviceNames || 'Nenhum dispositivo'}</p>
                </div>
            `;
            roomCardsContainer.appendChild(roomCard);
        });
    },

    renderScenes: (scenes, devices) => {
        const sceneCardsContainer = document.getElementById('scene-cards');
        sceneCardsContainer.innerHTML = '';
        scenes.forEach(async scene => {
            const sceneCard = document.createElement('div');
            sceneCard.className = 'scene-flow card';
            sceneCard.innerHTML = `
                <div class="scene-flow-header">
                    <h3>${scene.nome}</h3>
                    <button class="btn-icon execute-scene-btn" data-scene-id="${scene.id}" data-scene-name="${scene.nome}">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
                <div class="scene-flow-steps" id="scene-${scene.id}-steps">
                </div>
            `;
            sceneCardsContainer.appendChild(sceneCard);

            const actionsContainer = document.getElementById(`scene-${scene.id}-steps`);
            const actions = await api.getSceneActions(scene.id);
            if (actions.length > 0) {
                actions.forEach((action, index) => {
                    const stepEl = document.createElement('div');
                    stepEl.className = 'step';
                    stepEl.dataset.deviceId = action.dispositivo_id;
                    stepEl.innerHTML = `
                        <div class="step-icon">
                            <i class="${getDeviceIcon(devices.find(d => d.id === action.dispositivo_id)?.tipo)}"></i>
                        </div>
                        <div class="step-info">${action.acao}</div>
                    `;
                    actionsContainer.appendChild(stepEl);

                    if (index < actions.length - 1) {
                        const connector = document.createElement('div');
                        connector.className = 'connector';
                        actionsContainer.appendChild(connector);
                    }
                });
            } else {
                actionsContainer.innerHTML = `<p style="color:var(--font-color-medium)">Nenhuma ação definida.</p>`;
            }
        });

        document.querySelectorAll('.execute-scene-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const cenaId = e.currentTarget.dataset.sceneId;
                const cenaNome = e.currentTarget.dataset.sceneName;
                dashboardComponent.runSceneExecutionModal(cenaId, cenaNome);
            });
        });
    },

    runSceneExecutionModal: async (cenaId, cenaNome) => {
        const actions = await api.getSceneActions(cenaId);
        
        if (actions.length === 0) {
            showNotification('Esta cena não possui ações.', 'error');
            return;
        }

        const modalHtml = `
            <div class="execution-modal-overlay">
                <div class="execution-modal">
                    <h3>Executando Cena: ${cenaNome}</h3>
                    <div class="execution-modal-list" id="execution-steps">
                    </div>
                </div>
            </div>
        `;
        contentArea.insertAdjacentHTML('beforeend', modalHtml);
        const stepsContainer = document.getElementById('execution-steps');
        const devices = await api.getDevices();

        const stepElements = actions.map(action => {
            const device = devices.find(d => d.id === action.dispositivo_id);
            return `
                <div class="execution-step" data-action-id="${action.id}">
                    <i class="${getDeviceIcon(device?.tipo)}"></i>
                    <span>${device?.nome} - ${action.acao}</span>
                </div>
            `;
        }).join('');
        
        stepsContainer.innerHTML = stepElements;

        // Inicia a execução da cena no backend
        api.executeScene(cenaId)
            // A notificação de sucesso foi removida aqui
            .catch(error => showNotification('Erro ao iniciar a cena.', 'error'));

        // Simula o progresso no frontend
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            const currentStepEl = stepsContainer.children[i];
            
            // Pausa para o delay da ação anterior
            if (i > 0 && actions[i-1].delay_segundos > 0) {
                await new Promise(resolve => setTimeout(resolve, actions[i-1].delay_segundos * 1000));
            }

            // Destaca o passo atual
            currentStepEl.classList.add('current');

            // Pausa para a animação
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Marca o passo como concluído
            currentStepEl.classList.remove('current');
            currentStepEl.classList.add('completed');
        }

        // Fecha o modal e recarrega os dados do painel para mostrar o estado atualizado
        setTimeout(() => {
            document.querySelector('.execution-modal-overlay').remove();
            dashboardComponent.loadData();
        }, 1500);
    },

    renderStats: (devices) => {
        const devicesOn = devices.filter(d => d.estado === true);
        const mostUsed = dashboardComponent.getMostUsedDevice(devices);

        document.getElementById('total-devices-count').textContent = devices.length;

        const devicesOnList = document.getElementById('devices-on-list');
        devicesOnList.innerHTML = '';
        if (devicesOn.length === 0) {
            devicesOnList.innerHTML = `<p style="color:var(--font-color-medium)">Nenhum dispositivo ligado.</p>`;
        } else {
            devicesOn.forEach(device => {
                devicesOnList.innerHTML += `
                    <div class="stats-item">
                        <i class="${getDeviceIcon(device.tipo)}"></i>
                        <span>${device.nome}</span>
                    </div>
                `;
            });
        }

        const mostUsedList = document.getElementById('most-used-list');
        mostUsedList.innerHTML = '';
        if (mostUsed) {
            mostUsedList.innerHTML = `
                <div class="stats-item">
                    <i class="${getDeviceIcon(mostUsed.tipo)}"></i>
                    <span>${mostUsed.nome}</span>
                </div>
            `;
        } else {
            mostUsedList.innerHTML = `<p style="color:var(--font-color-medium)">Nenhum dado de uso.</p>`;
        }
    },

    getMostUsedDevice: (devices) => {
        if (devices.length === 0) return null;

        const deviceUsage = devices.reduce((acc, device) => {
            acc[device.nome] = (acc[device.nome] || 0) + 1;
            return acc;
        }, {});

        const mostUsedName = Object.keys(deviceUsage).reduce((a, b) => deviceUsage[a] > deviceUsage[b] ? a : b, '');
        return devices.find(d => d.nome === mostUsedName);
    }
};