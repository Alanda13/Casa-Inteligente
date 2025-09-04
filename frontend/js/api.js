// js/api.js

const API_BASE_URL = 'http://localhost:3000/api';

const api = {
    // Endpoints de Cômodos
    getRooms: async () => {
        const response = await fetch(`${API_BASE_URL}/rooms`);
        return response.json();
    },
    createRoom: async (room) => {
        const response = await fetch(`${API_BASE_URL}/rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(room)
        });
        return response.json();
    },
    updateRoom: async (id, room) => {
        const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(room)
        });
        return response.json();
    },
    deleteRoom: async (id) => {
        const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
            method: 'DELETE'
        });
        return response.text();
    },

    // Endpoints de Dispositivos
    getDevices: async () => {
        const response = await fetch(`${API_BASE_URL}/devices`);
        return response.json();
    },
    createDevice: async (device) => {
        const response = await fetch(`${API_BASE_URL}/devices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(device)
        });
        return response.json();
    },
    updateDevice: async (id, device) => {
        const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(device)
        });
        return response.json();
    },
    deleteDevice: async (id) => {
        const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
            method: 'DELETE'
        });
        return response.text();
    },

    // Endpoints de Cenas
    getScenes: async () => {
        const response = await fetch(`${API_BASE_URL}/scenes`);
        return response.json();
    },
    createScene: async (scene) => {
        const response = await fetch(`${API_BASE_URL}/scenes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scene)
        });
        return response.json();
    },
    updateScene: async (id, scene) => {
        const response = await fetch(`${API_BASE_URL}/scenes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scene)
        });
        return response.json();
    },
    deleteScene: async (id) => {
        const response = await fetch(`${API_BASE_URL}/scenes/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    },
    executeScene: async (cenaId) => {
        const response = await fetch(`${API_BASE_URL}/execute-scene`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cena_id: cenaId })
        });
        return response.json();
    },

    // Endpoints de Ações de Cena
    getSceneActions: async (cenaId) => {
        const response = await fetch(`${API_BASE_URL}/scene-actions/${cenaId}`);
        return response.json();
    },
    createSceneAction: async (action) => {
        const response = await fetch(`${API_BASE_URL}/scene-actions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action)
        });
        return response.json();
    },
    updateSceneAction: async (id, action) => {
        const response = await fetch(`${API_BASE_URL}/scene-actions/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action)
        });
        return response.json();
    },
    deleteSceneAction: async (id) => {
        const response = await fetch(`${API_BASE_URL}/scene-actions/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    },
};