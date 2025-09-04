// js/components/scenes-component.js

const scenesComponent = {
    render: async () => {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <h2>Cenas</h2>
            <button class="btn-primary" id="add-scene-btn">Adicionar Nova Cena</button>
            <div class="scenes-list" id="scenes-list-container">
            </div>
        `;
        document.getElementById('add-scene-btn').addEventListener('click', scenesComponent.renderAddForm);
        await scenesComponent.loadScenes();
    },

    loadScenes: async () => {
        const container = document.getElementById('scenes-list-container');
        renderLoading(container);
        try {
            const scenes = await api.getScenes();
            container.innerHTML = scenesComponent.renderList(scenes);
        } catch (error) {
            renderError(container, 'Não foi possível carregar a lista de cenas.');
            showNotification('Erro ao carregar cenas.', 'error');
            console.error('Erro:', error);
        }
    },

    renderList: (scenes) => {
        if (scenes.length === 0) {
            return '<p>Nenhuma cena encontrada.</p>';
        }
        let html = '';
        scenes.forEach(scene => {
            html += `
                <div class="card scene-item">
                    <div class="scene-info">
                        <h3>${scene.nome}</h3>
                        <p>Estado: ${scene.ativa ? 'Ativa' : 'Inativa'}</p>
                    </div>
                    <div class="scene-actions">
                        <button class="btn-icon" data-id="${scene.id}" onclick="scenesComponent.executeScene(${scene.id})"><i class="fas fa-play"></i></button>
                        <button class="btn-icon edit-scene-btn" data-id="${scene.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete-scene-btn" data-id="${scene.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
        });
        
        setTimeout(() => {
            document.querySelectorAll('.edit-scene-btn').forEach(btn => btn.addEventListener('click', scenesComponent.renderEditForm));
            document.querySelectorAll('.delete-scene-btn').forEach(btn => btn.addEventListener('click', scenesComponent.handleDelete));
        }, 0);

        return html;
    },

    handleDelete: (e) => {
        const id = e.currentTarget.dataset.id;
        showConfirmation('Tem certeza que deseja excluir esta cena e todas as suas ações?', async () => {
            try {
                const result = await api.deleteScene(id);
                showNotification(result.message, 'success');
                scenesComponent.loadScenes();
            } catch (error) {
                showNotification('Erro ao excluir a cena.', 'error');
                console.error('Erro:', error);
            }
        });
    },

    executeScene: async (id) => {
        try {
            const result = await api.executeScene(id);
            showNotification(result.message, 'success');
        } catch (error) {
            showNotification('Erro ao executar a cena.', 'error');
            console.error('Erro:', error);
        }
    },

    renderAddForm: () => {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <h2>Adicionar Cena</h2>
            <form id="scene-form" class="card">
                <div class="form-group">
                    <label for="scene-name">Nome da Cena</label>
                    <input type="text" id="scene-name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="scene-active">Ativa</label>
                    <select id="scene-active" name="ativa">
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary">Salvar Cena</button>
            </form>
        `;
        document.getElementById('scene-form').addEventListener('submit', scenesComponent.handleFormSubmit);
    },

    renderEditForm: async (e) => {
        const id = e.currentTarget.dataset.id;
        try {
            const allScenes = await api.getScenes();
            const scene = allScenes.find(s => s.id == id);
            
            const contentArea = document.getElementById('content-area');
            contentArea.innerHTML = `
                <h2>Editar Cena: ${scene.nome}</h2>
                <form id="scene-form" class="card">
                    <input type="hidden" id="scene-id" value="${scene.id}">
                    <div class="form-group">
                        <label for="scene-name">Nome da Cena</label>
                        <input type="text" id="scene-name" name="name" value="${scene.nome}" required>
                    </div>
                    <div class="form-group">
                        <label for="scene-active">Ativa</label>
                        <select id="scene-active" name="ativa">
                            <option value="true" ${scene.ativa ? 'selected' : ''}>Sim</option>
                            <option value="false" ${!scene.ativa ? 'selected' : ''}>Não</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">Atualizar Cena</button>
                </form>

                <hr style="margin-top: 20px; border-color: var(--border-color);">

                <h3>Ações da Cena</h3>
                <button class="btn-primary" id="add-action-btn" data-scene-id="${scene.id}">Adicionar Ação</button>
                <div id="scene-actions-list" class="card">
                </div>
            `;
            document.getElementById('scene-form').addEventListener('submit', scenesComponent.handleFormSubmit);
            document.getElementById('add-action-btn').addEventListener('click', scenesComponent.renderAddActionForm);

            await scenesComponent.loadSceneActions(scene.id);

        } catch (error) {
            showNotification('Erro ao carregar dados da cena para edição.', 'error');
            console.error('Erro:', error);
        }
    },

    handleFormSubmit: async (e) => {
        e.preventDefault();
        const form = e.target;
        const id = form.querySelector('#scene-id')?.value;
        const sceneData = {
            name: form.querySelector('#scene-name').value, 
            ativa: form.querySelector('#scene-active').value === 'true'
        };

        try {
            if (id) {
                const result = await api.updateScene(id, sceneData);
                showNotification(`Cena ${result.nome} atualizada!`, 'success');
            } else {
                const result = await api.createScene(sceneData);
                showNotification(`Cena ${result.nome} criada com sucesso!`, 'success');
            }
            scenesComponent.render();
        } catch (error) {
            showNotification('Erro ao salvar cena.', 'error');
            console.error('Erro:', error);
        }
    },

    loadSceneActions: async (sceneId) => {
        const container = document.getElementById('scene-actions-list');
        renderLoading(container);
        try {
            const actions = await api.getSceneActions(sceneId);
            const devices = await api.getDevices();
            container.innerHTML = scenesComponent.renderActionsList(actions, devices);
        } catch (error) {
            renderError(container, 'Não foi possível carregar as ações da cena.');
            showNotification('Erro ao carregar ações da cena.', 'error');
            console.error('Erro:', error);
        }
    },

    renderActionsList: (actions, devices) => {
        if (actions.length === 0) {
            return '<p>Nenhuma ação definida para esta cena.</p>';
        }
        let html = '';
        actions.forEach(action => {
            const device = devices.find(d => d.id === action.dispositivo_id);
            const deviceName = device ? device.nome : 'Dispositivo não encontrado';
            html += `
                <div class="action-item">
                    <span>Ordem ${action.ordem}: ${action.acao} ${deviceName} (delay: ${action.delay_segundos}s)</span>
                    <button class="btn-icon edit-action-btn" data-id="${action.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-action-btn" data-id="${action.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
        });

        setTimeout(() => {
            document.querySelectorAll('.edit-action-btn').forEach(btn => btn.addEventListener('click', scenesComponent.renderEditActionForm));
            document.querySelectorAll('.delete-action-btn').forEach(btn => btn.addEventListener('click', scenesComponent.handleDeleteAction));
        }, 0);

        return html;
    },

    handleDeleteAction: (e) => {
        const actionId = e.currentTarget.dataset.id;
        const sceneId = document.querySelector('#scene-id').value;
        showConfirmation('Tem certeza que deseja excluir esta ação?', async () => {
            try {
                const result = await api.deleteSceneAction(actionId);
                showNotification(result.message, 'success');
                scenesComponent.loadSceneActions(sceneId);
            } catch (error) {
                showNotification('Erro ao excluir a ação.', 'error');
                console.error('Erro:', error);
            }
        });
    },

    renderAddActionForm: async (e) => {
        const sceneId = e.currentTarget.dataset.sceneId;
        const devices = await api.getDevices();
        const deviceOptions = devices.map(d => `<option value="${d.id}">${d.nome}</option>`).join('');

        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <h2>Adicionar Ação à Cena</h2>
            <form id="action-form" class="card">
                <input type="hidden" id="action-scene-id" value="${sceneId}">
                <div class="form-group">
                    <label for="action-device">Dispositivo</label>
                    <select id="action-device" name="dispositivo_id" required>
                        ${deviceOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="action-order">Ordem de Execução</label>
                    <input type="number" id="action-order" name="ordem" value="1" min="1" required>
                </div>
                <div class="form-group">
                    <label for="action-delay">Atraso (segundos)</label>
                    <input type="number" id="action-delay" name="delay_segundos" value="0" min="0" required>
                </div>
                <div class="form-group">
                    <label for="action-status">Ação</label>
                    <select id="action-status" name="acao" required>
                        <option value="Ligado">Ligar</option>
                        <option value="Desligado">Desligar</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary">Salvar Ação</button>
            </form>
        `;
        document.getElementById('action-form').addEventListener('submit', scenesComponent.handleActionFormSubmit);
    },

    renderEditActionForm: async (e) => {
        const actionId = e.currentTarget.dataset.id;
        try {
            // Este é um ponto de otimização, pois busca todas as ações da cena
            const allActions = await api.getSceneActions(1);
            const action = allActions.find(a => a.id == actionId);
            const devices = await api.getDevices();
            const deviceOptions = devices.map(d => `<option value="${d.id}" ${d.id == action.dispositivo_id ? 'selected' : ''}>${d.nome}</option>`).join('');

            const contentArea = document.getElementById('content-area');
            contentArea.innerHTML = `
                <h2>Editar Ação</h2>
                <form id="action-form" class="card">
                    <input type="hidden" id="action-id" value="${action.id}">
                    <input type="hidden" id="action-scene-id" value="${action.cena_id}">
                    <div class="form-group">
                        <label for="action-device">Dispositivo</label>
                        <select id="action-device" name="dispositivo_id" required>
                            ${deviceOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="action-order">Ordem de Execução</label>
                        <input type="number" id="action-order" name="ordem" value="${action.ordem}" min="1" required>
                    </div>
                    <div class="form-group">
                        <label for="action-delay">Atraso (segundos)</label>
                        <input type="number" id="action-delay" name="delay_segundos" value="${action.delay_segundos}" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="action-status">Ação</label>
                        <select id="action-status" name="acao" required>
                            <option value="Ligado" ${action.acao === 'Ligado' ? 'selected' : ''}>Ligar</option>
                            <option value="Desligado" ${action.acao === 'Desligado' ? 'selected' : ''}>Desligar</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">Atualizar Ação</button>
                </form>
            `;
            document.getElementById('action-form').addEventListener('submit', scenesComponent.handleActionFormSubmit);
        } catch (error) {
            showNotification('Erro ao carregar dados da ação para edição.', 'error');
            console.error('Erro:', error);
        }
    },

    handleActionFormSubmit: async (e) => {
        e.preventDefault();
        const form = e.target;
        const actionId = form.querySelector('#action-id')?.value;
        const sceneId = form.querySelector('#action-scene-id').value;
        const actionData = {
            cena_id: parseInt(sceneId, 10),
            dispositivo_id: parseInt(form.querySelector('#action-device').value, 10),
            ordem: parseInt(form.querySelector('#action-order').value, 10),
            delay_segundos: parseInt(form.querySelector('#action-delay').value, 10),
            acao: form.querySelector('#action-status').value,
        };

        try {
            if (actionId) {
                const result = await api.updateSceneAction(actionId, actionData);
                showNotification('Ação atualizada com sucesso!', 'success');
            } else {
                const result = await api.createSceneAction(actionData);
                showNotification('Ação criada com sucesso!', 'success');
            }
            scenesComponent.renderEditForm({ currentTarget: { dataset: { id: sceneId } } });
        } catch (error) {
            showNotification('Erro ao salvar a ação da cena.', 'error');
            console.error('Erro:', error);
        }
    }
};