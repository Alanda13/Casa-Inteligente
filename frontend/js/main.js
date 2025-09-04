
const routes = {
    'dashboard': dashboardComponent,
    'rooms': roomsComponent,
    'devices': devicesComponent,
    'scenes': scenesComponent,
};

// Função para gerenciar a navegação
async function navigate(page) {
    // Remove a classe 'active' de todos os links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
    });

    // Adiciona a classe 'active' no link clicado
    const activeLink = document.getElementById(`nav-${page}`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Renderiza o componente correspondente
    if (routes[page]) {
        await routes[page].render();
    } else {
        contentArea.innerHTML = '<h2>Página não encontrada</h2>';
    }
}

// Adiciona event listeners para os links de navegação
document.getElementById('nav-dashboard').addEventListener('click', (e) => {
    e.preventDefault();
    navigate('dashboard');
});

document.getElementById('nav-rooms').addEventListener('click', (e) => {
    e.preventDefault();
    navigate('rooms');
});

document.getElementById('nav-devices').addEventListener('click', (e) => {
    e.preventDefault();
    navigate('devices');
});

document.getElementById('nav-scenes').addEventListener('click', (e) => {
    e.preventDefault();
    navigate('scenes');
});
document.addEventListener('DOMContentLoaded', () => {
    navigate('dashboard');
});