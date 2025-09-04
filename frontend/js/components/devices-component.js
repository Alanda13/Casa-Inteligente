// js/components/devices-component.js

const devicesComponent = {
    render: async () => {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <h2>Dispositivos</h2>
            <button class="btn-primary" id="add-device-btn">Adicionar Novo Dispositivo</button>
            <div class="devices-list" id="devices-list-container">
            </div>
        `;
        document.getElementById('add-device-btn').addEventListener('click', devicesComponent.renderAddForm);
        await devicesComponent.loadDevices();
    },

    loadDevices: async () => {
        const container = document.getElementById('devices-list-container');
        renderLoading(container);
        try {
            const devices = await api.getDevices();
            container.innerHTML = devicesComponent.renderList(devices);
        } catch (error) {
            renderError(container, 'Não foi possível carregar a lista de dispositivos.');
            showNotification('Erro ao carregar dispositivos.', 'error');
            console.error('Erro:', error);
        }
    },

    renderList: (devices) => {
        if (devices.length === 0) {
            return '<p>Nenhum dispositivo encontrado.</p>';
        }
        let html = '';
        devices.forEach(device => {
            html += `
                <div class="card device-card">
                    <div class="device-icon">
                        <i class="${getDeviceIcon(device.tipo)}"></i>
                    </div>
                    <div class="device-info">
                        <h3>${device.nome}</h3>
                        <p>${device.nome_comodo} - ${device.tipo}</p>
                    </div>
                    <div class="device-actions">
                        <span class="status-badge ${device.estado ? 'on' : 'off'}">${device.estado ? 'Ligado' : 'Desligado'}</span>
                        <button class="btn-icon toggle-state" data-id="${device.id}" data-estado="${device.estado}">
                            <i class="fas fa-power-off"></i>
                        </button>
                        <button class="btn-icon edit-device-btn" data-id="${device.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete-device-btn" data-id="${device.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
        });

        setTimeout(() => {
            document.querySelectorAll('.toggle-state').forEach(btn => btn.addEventListener('click', devicesComponent.toggleDeviceState));
            document.querySelectorAll('.edit-device-btn').forEach(btn => btn.addEventListener('click', devicesComponent.renderEditForm));
            document.querySelectorAll('.delete-device-btn').forEach(btn => btn.addEventListener('click', devicesComponent.handleDelete));
        }, 0);

        return html;
    },

    handleDelete: (e) => {
        const id = e.currentTarget.dataset.id;
        showConfirmation('Tem certeza que deseja excluir este dispositivo?', async () => {
            try {
                const result = await api.deleteDevice(id);
                showNotification('Dispositivo excluído com sucesso!', 'success');
                devicesComponent.loadDevices();
            } catch (error) {
                showNotification('Erro ao excluir dispositivo.', 'error');
                console.error('Erro:', error);
            }
        });
    },

    toggleDeviceState: async (e) => {
        const id = e.currentTarget.dataset.id;
        const currentState = e.currentTarget.dataset.estado === 'true';
        const newState = !currentState;

        try {
            const allDevices = await api.getDevices();
            const deviceToUpdate = allDevices.find(d => d.id == id);
            if (!deviceToUpdate) {
                showNotification('Dispositivo não encontrado.', 'error');
                return;
            }

            const updatedDevice = {
                nome: deviceToUpdate.nome,
                tipo: deviceToUpdate.tipo,
                estado: newState ? 'Ligado' : 'Desligado',
                comodo_id: deviceToUpdate.comodo_id
            };

            const result = await api.updateDevice(id, updatedDevice);
            showNotification(`Dispositivo ${result.nome} foi ${result.estado ? 'ligado' : 'desligado'}.`, 'success');
            devicesComponent.loadDevices();
        } catch (error) {
            showNotification('Erro ao alterar estado do dispositivo.', 'error');
            console.error('Erro:', error);
        }
    },

    renderAddForm: async () => {
        const contentArea = document.getElementById('content-area');
        const rooms = await api.getRooms();
        const roomOptions = rooms.map(room => `<option value="${room.id}">${room.nome}</option>`).join('');

        contentArea.innerHTML = `
            <h2>Adicionar Dispositivo</h2>
            <form id="device-form" class="card">
                <div class="form-group">
                    <label for="device-name">Nome do Dispositivo</label>
                    <input type="text" id="device-name" name="nome" required>
                </div>
                <div class="form-group">
                    <label for="device-type">Tipo</label>
                    <input type="text" id="device-type" name="tipo" required>
                </div>
                <div class="form-group">
                    <label for="device-comodo">Cômodo</label>
                    <select id="device-comodo" name="comodo_id" required>
                        ${roomOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="device-status">Estado</label>
                    <select id="device-status" name="estado" required>
                        <option value="Ligado">Ligado</option>
                        <option value="Desligado">Desligado</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary">Salvar Dispositivo</button>
            </form>
        `;
        document.getElementById('device-form').addEventListener('submit', devicesComponent.handleFormSubmit);
    },

    renderEditForm: async (e) => {
        const id = e.currentTarget.dataset.id;
        const allDevices = await api.getDevices();
        const device = allDevices.find(d => d.id == id);
        const rooms = await api.getRooms();
        const roomOptions = rooms.map(room => `<option value="${room.id}" ${room.id == device.comodo_id ? 'selected' : ''}>${room.nome}</option>`).join('');

        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <h2>Editar Dispositivo</h2>
            <form id="device-form" class="card">
                <input type="hidden" id="device-id" value="${device.id}">
                <div class="form-group">
                    <label for="device-name">Nome do Dispositivo</label>
                    <input type="text" id="device-name" name="nome" value="${device.nome}" required>
                </div>
                <div class="form-group">
                    <label for="device-type">Tipo</label>
                    <input type="text" id="device-type" name="tipo" value="${device.tipo}" required>
                </div>
                <div class="form-group">
                    <label for="device-comodo">Cômodo</label>
                    <select id="device-comodo" name="comodo_id" required>
                        ${roomOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="device-status">Estado</label>
                    <select id="device-status" name="estado" required>
                        <option value="Ligado" ${device.estado ? 'selected' : ''}>Ligado</option>
                        <option value="Desligado" ${!device.estado ? 'selected' : ''}>Desligado</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary">Atualizar Dispositivo</button>
            </form>
        `;
        document.getElementById('device-form').addEventListener('submit', devicesComponent.handleFormSubmit);
    },

    handleFormSubmit: async (e) => {
        e.preventDefault();
        const form = e.target;
        const id = form.querySelector('#device-id')?.value;
        const deviceData = {
            nome: form.querySelector('#device-name').value,
            tipo: form.querySelector('#device-type').value,
            estado: form.querySelector('#device-status').value,
            comodo_id: parseInt(form.querySelector('#device-comodo').value, 10),
        };

        try {
            if (id) {
                const result = await api.updateDevice(id, deviceData);
                showNotification(`Dispositivo ${result.nome} atualizado!`, 'success');
            } else {
                const result = await api.createDevice(deviceData);
                showNotification(`Dispositivo ${result.nome} criado com sucesso!`, 'success');
            }
            devicesComponent.render();
        } catch (error) {
            showNotification('Erro ao salvar dispositivo.', 'error');
            console.error('Erro:', error);
        }
    }
};