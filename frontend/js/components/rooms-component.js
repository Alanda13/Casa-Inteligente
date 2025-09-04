// js/components/rooms-component.js

const roomsComponent = {
    render: async () => {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <h2>Cômodos</h2>
            <button class="btn-primary" id="add-room-btn">Adicionar Novo Cômodo</button>
            <div class="rooms-list" id="rooms-list-container">
            </div>
        `;
        document.getElementById('add-room-btn').addEventListener('click', roomsComponent.renderAddForm);
        await roomsComponent.loadRooms();
    },

    loadRooms: async () => {
        const container = document.getElementById('rooms-list-container');
        renderLoading(container);
        try {
            const rooms = await api.getRooms();
            container.innerHTML = roomsComponent.renderList(rooms);
        } catch (error) {
            renderError(container, 'Não foi possível carregar a lista de cômodos.');
            showNotification('Erro ao carregar cômodos.', 'error');
            console.error('Erro:', error);
        }
    },

    renderList: (rooms) => {
        if (rooms.length === 0) {
            return '<p>Nenhum cômodo encontrado.</p>';
        }
        let html = '';
        rooms.forEach(room => {
            html += `
                <div class="card room-item">
                    <div class="room-info">
                        <h3>${room.nome}</h3>
                        <p>${room.descricao}</p>
                    </div>
                    <div class="room-actions">
                        <button class="btn-icon edit-room-btn" data-id="${room.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete-room-btn" data-id="${room.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
        });
        
        setTimeout(() => {
            document.querySelectorAll('.edit-room-btn').forEach(btn => btn.addEventListener('click', roomsComponent.renderEditForm));
            document.querySelectorAll('.delete-room-btn').forEach(btn => btn.addEventListener('click', roomsComponent.handleDelete));
        }, 0);

        return html;
    },

    handleDelete: (e) => {
        const id = e.currentTarget.dataset.id;
        showConfirmation('Tem certeza que deseja excluir este cômodo?', async () => {
            try {
                const result = await api.deleteRoom(id);
                showNotification('Cômodo excluído com sucesso!', 'success');
                roomsComponent.loadRooms();
            } catch (error) {
                showNotification('Erro ao excluir o cômodo.', 'error');
                console.error('Erro:', error);
            }
        });
    },

    renderAddForm: async () => {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <h2>Adicionar Cômodo</h2>
            <form id="room-form" class="card">
                <div class="form-group">
                    <label for="room-name">Nome do Cômodo</label>
                    <input type="text" id="room-name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="room-description">Descrição</label>
                    <input type="text" id="room-description" name="description">
                </div>
                <button type="submit" class="btn-primary">Salvar Cômodo</button>
            </form>
        `;
        document.getElementById('room-form').addEventListener('submit', roomsComponent.handleFormSubmit);
    },

    renderEditForm: async (e) => {
        const id = e.currentTarget.dataset.id;
        try {
            const rooms = await api.getRooms();
            const room = rooms.find(r => r.id == id);
            if (!room) {
                showNotification('Cômodo não encontrado.', 'error');
                return;
            }

            const contentArea = document.getElementById('content-area');
            contentArea.innerHTML = `
                <h2>Editar Cômodo</h2>
                <form id="room-form" class="card">
                    <input type="hidden" id="room-id" value="${room.id}">
                    <div class="form-group">
                        <label for="room-name">Nome do Cômodo</label>
                        <input type="text" id="room-name" name="nome" value="${room.nome}" required>
                    </div>
                    <div class="form-group">
                        <label for="room-description">Descrição</label>
                        <input type="text" id="room-description" name="descricao" value="${room.descricao || ''}">
                    </div>
                    <button type="submit" class="btn-primary">Atualizar Cômodo</button>
                </form>
            `;
            document.getElementById('room-form').addEventListener('submit', roomsComponent.handleFormSubmit);
        } catch (error) {
            showNotification('Erro ao carregar dados do cômodo para edição.', 'error');
            console.error('Erro:', error);
        }
    },

    handleFormSubmit: async (e) => {
        e.preventDefault();
        const form = e.target;
        const id = form.querySelector('#room-id')?.value;
        const roomData = {
            name: form.querySelector('#room-name').value,
            description: form.querySelector('#room-description').value,
        };

        try {
            if (id) {
                const result = await api.updateRoom(id, roomData);
                showNotification(`Cômodo ${result.nome} atualizado!`, 'success');
            } else {
                const result = await api.createRoom(roomData);
                showNotification(`Cômodo ${result.nome} criado com sucesso!`, 'success');
            }
            roomsComponent.render();
        } catch (error) {
            showNotification('Erro ao salvar cômodo.', 'error');
            console.error('Erro:', error);
        }
    }
};