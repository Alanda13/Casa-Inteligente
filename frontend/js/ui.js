// js/ui.js

const notificationContainer = document.getElementById('notification-container');
const contentArea = document.getElementById('content-area');

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('hide');
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    }, 3000);
}

// Nova função para mostrar um modal de confirmação
function showConfirmation(message, onConfirm) {
    const modalHtml = `
        <div class="confirmation-modal-overlay">
            <div class="confirmation-modal">
                <p>${message}</p>
                <div class="modal-buttons">
                    <button id="modal-confirm-btn" class="btn-accent">Confirmar</button>
                    <button id="modal-cancel-btn" class="btn-outline">Cancelar</button>
                </div>
            </div>
        </div>
    `;

    contentArea.insertAdjacentHTML('beforeend', modalHtml);

    const modalOverlay = document.querySelector('.confirmation-modal-overlay');
    document.getElementById('modal-confirm-btn').addEventListener('click', () => {
        onConfirm();
        modalOverlay.remove();
    });

    document.getElementById('modal-cancel-btn').addEventListener('click', () => {
        modalOverlay.remove();
    });
}


function getRoomIcon(roomName) {
    const icons = {
        'sala': 'fas fa-couch',
        'quarto': 'fas fa-bed',
        'cozinha': 'fas fa-utensils',
        'banheiro': 'fas fa-bath',
        'escritorio': 'fas fa-desktop',
        'garagem': 'fas fa-car',
        'jardim': 'fas fa-seedling'
    };
    const key = roomName.toLowerCase().split(' ')[0];
    return icons[key] || 'fas fa-door-open';
}

function getDeviceIcon(deviceType) {
    const icons = {
        'lâmpada': 'fas fa-lightbulb',
        'ventilador': 'fas fa-fan',
        'tomada': 'fas fa-plug',
        'tv': 'fas fa-tv',
        'ar-condicionado': 'fas fa-snowflake',
        'computador': 'fas fa-desktop',
        'caixa de som': 'fas fa-volume-up'
    };
    const key = deviceType.toLowerCase().trim();
    return icons[key] || 'fas fa-cogs';
}

function renderLoading(targetElement) {
    targetElement.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Carregando...</span>
        </div>
    `;
}

function renderError(targetElement, message) {
    targetElement.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        </div>
    `;
}