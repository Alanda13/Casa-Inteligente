// ------------------ DADOS SIMULADOS ------------------
let scenes = [
  { id: 1, name: "Cinema", active: true, actions: [] },
  { id: 2, name: "Dormir", active: true, actions: [] },
  { id: 3, name: "Trabalho", active: true, actions: [] },
  { id: 4, name: "Chegar em casa", active: true, actions: [] },
  { id: 5, name: "Jantar romântico", active: true, actions: [] },
  { id: 6, name: "Lavar banheiro", active: true, actions: [] }
];

let devices = [
  { id: 1, name: "Luz Sala", room: "Sala de estar", state: false },
  { id: 2, name: "TV Sala", room: "Sala de estar", state: false },
  { id: 3, name: "Som Ambiente", room: "Sala de estar", state: false },
  { id: 4, name: "Ventilador", room: "Sala de estar", state: false },
  { id: 5, name: "Tomada Sala", room: "Sala de estar", state: false },
  { id: 6, name: "Projetor Sala", room: "Sala de estar", state: false },
  { id: 7, name: "Luz Cozinha", room: "Cozinha", state: false },
  { id: 8, name: "Geladeira", room: "Cozinha", state: false },
  { id: 9, name: "Forno Elétrico", room: "Cozinha", state: false },
  { id: 10, name: "Micro-ondas", room: "Cozinha", state: false },
  { id: 11, name: "Máquina de Café", room: "Cozinha", state: false },
  { id: 12, name: "Purificador de Água", room: "Cozinha", state: false },
  { id: 13, name: "Luz Quarto", room: "Quarto", state: false },
  { id: 14, name: "Ventilador", room: "Quarto", state: false },
  { id: 15, name: "Tomada Quarto", room: "Quarto", state: false },
  { id: 16, name: "Abajur", room: "Quarto", state: false },
  { id: 17, name: "Aromatizador", room: "Quarto", state: false },
  { id: 18, name: "Carregador", room: "Quarto", state: false },
  { id: 19, name: "Luz Banheiro", room: "Banheiro", state: false },
  { id: 20, name: "Exaustor Banheiro", room: "Banheiro", state: false },
  { id: 21, name: "Aquecedor Toalhas", room: "Banheiro", state: false },
  { id: 22, name: "Chuveiro", room: "Banheiro", state: false },
  { id: 23, name: "Espelho LED", room: "Banheiro", state: false },
  { id: 24, name: "Tomada Banheiro", room: "Banheiro", state: false },
  { id: 25, name: "Computador", room: "Escritório", state: false },
  { id: 26, name: "Ar Condicionado", room: "Escritório", state: false },
  { id: 27, name: "Impressora", room: "Escritório", state: false },
  { id: 28, name: "Luz Escritório", room: "Escritório", state: false },
  { id: 29, name: "Tomada Escritório", room: "Escritório", state: false },
  { id: 30, name: "Irrigação Automática", room: "Jardim", state: false },
  { id: 31, name: "Luzes Jardim", room: "Jardim", state: false },
  { id: 32, name: "Cortador de Grama", room: "Jardim", state: false },
  { id: 33, name: "Sensor de Umidade", room: "Jardim", state: false },
  { id: 34, name: "Fonte de Água", room: "Jardim", state: false },
  { id: 35, name: "Luz Garagem", room: "Garagem", state: false },
  { id: 36, name: "Portão Automático", room: "Garagem", state: false },
  { id: 37, name: "Carregador de Carro Elétrico", room: "Garagem", state: false },
  { id: 38, name: "Câmera de Segurança", room: "Garagem", state: false },
  { id: 39, name: "Ventilador Garagem", room: "Garagem", state: false },
  { id: 40, name: "Máquina de Lavar", room: "Lavanderia", state: false },
  { id: 41, name: "Secadora", room: "Lavanderia", state: false },
  { id: 42, name: "Luz Lavanderia", room: "Lavanderia", state: false },
  { id: 43, name: "Ferro de Passar", room: "Lavanderia", state: false },
  { id: 44, name: "Tomada Lavanderia", room: "Lavanderia", state: false }
];


// ------------------ TOAST ------------------
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

// ------------------ MODAL ------------------
const modal = document.getElementById("sceneModal");
const sceneNameInput = document.getElementById("sceneName");
const sceneActionsContainer = document.getElementById("sceneActionsContainer");
const roomSelect = document.getElementById("roomSelect");

// Abrir modal criar cena
document.querySelector(".create-scene").addEventListener("click", () => {
  sceneNameInput.value = "";
  buildRoomSelect();       // Preenche select com cômodos
  sceneActionsContainer.innerHTML = ""; // Limpa ações
  modal.classList.remove("hidden");

  document.getElementById("saveScene").onclick = saveNewScene;
});

document.getElementById("cancelScene").addEventListener("click", () => modal.classList.add("hidden"));

// ------------------ POPULAR SELECT DE CÔMODOS ------------------
function buildRoomSelect() {
  const rooms = [...new Set(devices.map(d => d.room))];
  roomSelect.innerHTML = '<option value="">-- Selecione um cômodo --</option>';
  rooms.forEach(room => {
    const option = document.createElement("option");
    option.value = room;
    option.textContent = room;
    roomSelect.appendChild(option);
  });

  roomSelect.onchange = () => buildDevicesByRoom(roomSelect.value);
}

// ------------------ LISTAR DISPOSITIVOS DO CÔMODO SELECIONADO ------------------
function buildDevicesByRoom(room, existingActions = []) {
  sceneActionsContainer.innerHTML = "<h4>Definir ações:</h4>";
  if (!room) return;

  const devicesInRoom = devices.filter(d => d.room === room);
  devicesInRoom.forEach(device => {
    const div = document.createElement("div");
    div.className = "action-item";
    div.dataset.deviceId = device.id;

    const span = document.createElement("span");
    span.textContent = device.name;

    const select = document.createElement("select");
    const optionOn = document.createElement("option"); optionOn.value = "ligar"; optionOn.textContent = "Ligar";
    const optionOff = document.createElement("option"); optionOff.value = "desligar"; optionOff.textContent = "Desligar";
    select.append(optionOn, optionOff);

    const existingAction = existingActions.find(a => a.deviceId === device.id);
    select.value = existingAction ? existingAction.action : "desligar";

    div.append(span, select);
    sceneActionsContainer.appendChild(div);
  });
}

// ------------------ SALVAR NOVA CENA ------------------
function saveNewScene() {
  const name = sceneNameInput.value.trim();
  const room = roomSelect.value;

  if (!name) { showToast("Digite um nome válido!"); return; }
  if (!room) { showToast("Selecione um cômodo!"); return; }
  if (scenes.some(scene => scene.name.toLowerCase() === name.toLowerCase())) {
    showToast(`Cena "${name}" já existe!`); return;
  }

  const actions = Array.from(sceneActionsContainer.querySelectorAll(".action-item")).map(item => {
    const deviceId = parseInt(item.dataset.deviceId);
    const action = item.querySelector("select").value;
    return { deviceId, action };
  });

  const newId = scenes.length ? Math.max(...scenes.map(s => s.id)) + 1 : 1;
  scenes.push({ id: newId, name, active: true, actions });
  modal.classList.add("hidden");
  renderCards();
  showToast(`Cena "${name}" criada!`);
}

// ------------------ ABRIR MODAL PARA EDITAR CENA ------------------
function openEditModal(scene) {
  modal.classList.remove("hidden");
  sceneNameInput.value = scene.name;
  buildRoomSelect();  
  roomSelect.value = ""; // Pode escolher outro cômodo
  sceneActionsContainer.innerHTML = "";

  document.getElementById("saveScene").onclick = () => {
    const name = sceneNameInput.value.trim();
    const room = roomSelect.value;
    if (!name) { showToast("Digite um nome válido!"); return; }

    const actions = Array.from(sceneActionsContainer.querySelectorAll(".action-item")).map(item => {
      const deviceId = parseInt(item.dataset.deviceId);
      const action = item.querySelector("select").value;
      return { deviceId, action };
    });

    scene.name = name;
    if (actions.length) scene.actions = actions;

    modal.classList.add("hidden");
    renderCards();
    showToast(`Cena "${name}" atualizada!`);
  };
}

// ------------------ RENDERIZAÇÃO DE CENAS ------------------
function renderCards(filter = "") {
  const cardsContainer = document.querySelector(".cards");
  cardsContainer.innerHTML = "";

  const filteredScenes = scenes.filter(scene =>
    scene.name.toLowerCase().includes(filter.toLowerCase())
  );

  filteredScenes.forEach(scene => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = getSceneIcon(scene.name);
    img.alt = scene.name;

    const p = document.createElement("p");
    p.textContent = scene.name + (scene.active ? "" : " (Desativada)");

    const options = document.createElement("div");
    options.className = "options";

    const optionsBtn = document.createElement("button");
    optionsBtn.className = "options-btn";
    optionsBtn.textContent = "☰";

    const optionsMenu = document.createElement("div");
    optionsMenu.className = "options-menu hidden";

    const editOption = document.createElement("p");
    editOption.textContent = "Editar";
    editOption.onclick = e => { e.stopPropagation(); openEditModal(scene); optionsMenu.classList.add("hidden"); };

    const deleteOption = document.createElement("p");
    deleteOption.textContent = "Excluir";
    deleteOption.onclick = e => { e.stopPropagation(); 
      if(confirm(`Deseja realmente excluir "${scene.name}"?`)){
        scenes = scenes.filter(s => s.id !== scene.id);
        renderCards(filter); 
        showToast(`Cena "${scene.name}" excluída!`);
      }
    };

    const cancelOption = document.createElement("p");
    cancelOption.textContent = "Cancelar";
    cancelOption.onclick = e => { e.stopPropagation(); optionsMenu.classList.add("hidden"); };

    optionsMenu.append(editOption, deleteOption, cancelOption);
    options.append(optionsBtn, optionsMenu);
    card.append(img, p, options);
    cardsContainer.appendChild(card);

    optionsBtn.onclick = e => { 
      e.stopPropagation(); 
      document.querySelectorAll(".options-menu").forEach(menu => menu.classList.add("hidden"));
      optionsMenu.classList.toggle("hidden");
    }

    card.onclick = () => executeScene(scene.id);
  });
}

// ------------------ EXECUTAR CENA ------------------
function executeScene(id) {
  const scene = scenes.find(s => s.id === id);
  if(!scene) return;
  devices.forEach(d => d.state = false);
  scene.actions.forEach(action => {
    const device = devices.find(d => d.id === action.deviceId);
    if(device && action.action === "ligar") device.state = true;
  });
  renderDevices(scene.id);
  showToast(`Cena "${scene.name}" executada!`);
}

// ------------------ RENDERIZAÇÃO DE DISPOSITIVOS ------------------
function renderDevices(sceneId = null) {
  const container = document.querySelector(".devices-list");
  container.innerHTML = "";
  let filteredDevices;
  if(sceneId){
    const scene = scenes.find(s => s.id === sceneId);
    const deviceIds = scene.actions.filter(a => a.action === "ligar").map(a => a.deviceId);
    filteredDevices = devices.filter(d => deviceIds.includes(d.id));
  } else filteredDevices = devices;

  filteredDevices.forEach(device => {
    const card = document.createElement("div");
    card.className = "device-card";

    const name = document.createElement("p"); name.textContent = device.name;

    const label = document.createElement("label"); label.className = "switch";
    const input = document.createElement("input"); input.type = "checkbox"; input.checked = device.state;
    input.onchange = () => { device.state = input.checked; showToast(`${device.name} ${device.state ? "ligado" : "desligado"}`); };
    const span = document.createElement("span"); span.className = "slider";

    label.append(input, span);
    card.append(name, label);
    container.appendChild(card);
  });
}

// ------------------ FILTRAR POR CÔMODO ------------------
document.querySelectorAll(".sidebar ul li").forEach(li => {
  li.onclick = () => renderDevicesByRoom(li.textContent);
});

function renderDevicesByRoom(room){
  const container = document.querySelector(".devices-list");
  container.innerHTML = "";
  const filteredDevices = devices.filter(d => d.room === room);
  filteredDevices.forEach(device => {
    const card = document.createElement("div"); card.className = "device-card";

    const name = document.createElement("p"); name.textContent = device.name;

    const label = document.createElement("label"); label.className = "switch";
    const input = document.createElement("input"); input.type = "checkbox"; input.checked = device.state;
    input.onchange = () => { device.state = input.checked; showToast(`${device.name} ${device.state ? "ligado" : "desligado"}`); };
    const span = document.createElement("span"); span.className = "slider";

    label.append(input, span);
    card.append(name, label);
    container.appendChild(card);
  });
}

// ------------------ ÍCONES ------------------
function getSceneIcon(name) {
  switch (name.toLowerCase()) {
    case "cinema": return "https://img.icons8.com/ios-filled/100/000000/cinema-.png";
    case "dormir": return "https://img.icons8.com/ios-filled/100/000000/sleeping-in-bed.png";
    case "trabalho": return "https://img.icons8.com/ios-filled/100/000000/briefcase.png";
    case "chegar em casa": return "https://img.icons8.com/ios-filled/100/000000/home.png";
    case "jantar romântico": return "https://img.icons8.com/ios-filled/100/000000/dinner.png";
    case "lavar banheiro": return "https://img.icons8.com/ios-filled/100/000000/broom.png";
    default: return "https://img.icons8.com/ios-filled/100/000000/idea.png";
  }
}

// ------------------ BUSCA ------------------
document.querySelector(".search input").addEventListener("input", e => renderCards(e.target.value));

// ------------------ INICIALIZAÇÃO ------------------
renderCards();
renderDevices();