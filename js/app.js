// DADOS LOCAIS E ESTADO
const INITIAL_PLANTS = [
  { id: 1, name: 'Marta', species: 'Monstera deliciosa', location: 'Sala', lastWatered: '2026-10-19' },
  { id: 2, name: 'Zen Pothos', species: 'Epipremnum aureum', location: 'Cozinha', lastWatered: '2026-10-19' }
];

function getUser() {
  const data = localStorage.getItem('floriapp_session');
  return data ? JSON.parse(data) : null;
}

function setUser(userData) {
  localStorage.setItem('floriapp_session', JSON.stringify(userData));
}

function getPlants() {
  const data = localStorage.getItem('floriapp_plants');
  return data ? JSON.parse(data) : INITIAL_PLANTS;
}

function savePlants(plants) {
  localStorage.setItem('floriapp_plants', JSON.stringify(plants));
}

// LÓGICA DE INTERFACE
function checkAuthStatus() {
  const user = getUser();
  const authScreen = document.getElementById('auth-screen');
  const appScreen = document.getElementById('app-screen');

  if (user && user.loggedIn) {
    authScreen.classList.add('hidden');
    appScreen.classList.remove('hidden');

    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;

    const badge = document.getElementById('profile-badge');
    const upgradeSection = document.getElementById('upgrade-section');
    const btnRemoveCard = document.getElementById('btn-remove-card');

    if (user.isPremium) {
      badge.className = 'badge badge-premium';
      badge.textContent = 'Plano Profissional (Ilimitado)';
      if (btnRemoveCard) btnRemoveCard.style.display = 'block';
      upgradeSection.innerHTML = `
        <h3 style="font-size: 15px; color: #253d2f; margin-bottom: 4px;">✓ Subscrição Premium Ativa</h3>
        <p style="font-size: 12px; color: var(--text-muted);">A sua conta possui acesso ilimitado e pagamentos em dia.</p>
      `;
    } else {
      badge.className = 'badge badge-free';
      badge.textContent = 'Plano Standard (Até 5 exemplares)';
      if (btnRemoveCard) btnRemoveCard.style.display = 'none';
    }

    renderHome();
    renderJardim();
  } else {
    authScreen.classList.remove('hidden');
    appScreen.classList.add('hidden');
  }
}

function renderHome() {
  const plants = getPlants();
  const list = document.getElementById('home-watering-list');
  if (!list) return;
  list.innerHTML = '';

  if (plants.length === 0) {
    list.innerHTML = `<p style="text-align:center; color: var(--text-muted); padding: 20px; font-size: 13px;">Sem tarefas pendentes no momento.</p>`;
    return;
  }

  plants.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card plant-card';
    card.id = `plant-card-${p.id}`;
    card.innerHTML = `
      <div class="plant-info">
        <h4 style="font-size: 15px; font-weight: 600;">${p.name}</h4>
        <p style="font-size: 12px; color: var(--text-muted);"><strong>Espécie:</strong> <em>${p.species}</em></p>
        <p style="font-size: 12px; color: var(--text-muted);"><strong>Última rega:</strong> ${p.lastWatered}</p>
      </div>
      <div class="plant-actions">
        <button class="btn-action" onclick="window.markWatered(${p.id})">Regar</button>
        <button class="btn-rip" onclick="window.removePlant(${p.id})">RIP / Apagar</button>
      </div>
    `;
    list.appendChild(card);
  });
}

function renderJardim() {
  const plants = getPlants();
  const list = document.getElementById('jardim-list');
  if (!list) return;
  list.innerHTML = '';

  if (plants.length === 0) {
    list.innerHTML = `<p style="text-align:center; color: var(--text-muted); padding: 20px; font-size: 13px;">Nenhum exemplar registado na sua coleção.</p>`;
    return;
  }

  plants.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.display = 'flex';
    card.style.justifyContent = 'space-between';
    card.style.alignItems = 'center';
    card.innerHTML = `
      <div>
        <h4 style="font-size: 15px; font-weight: 600;">${p.name}</h4>
        <p style="color: var(--text-muted); font-size: 12px;"><em>${p.species}</em></p>
        <p style="margin-top: 4px; font-size: 12px; color: var(--primary-militar);">📍 Divisão: <strong>${p.location}</strong></p>
      </div>
      <button class="btn-rip" onclick="window.removePlant(${p.id})">RIP / Apagar</button>
    `;
    list.appendChild(card);
  });
}

// FUNÇÕES DE AÇÃO GLOBAIS
window.handleLogin = function(providedName, providedEmail) {
  const emailInput = document.getElementById('auth-email');
  const nameInput = document.getElementById('auth-name');
  
  const email = providedEmail || (emailInput ? emailInput.value : 'jose.clemente@email.pt');
  const name = providedName || (nameInput && nameInput.value ? nameInput.value : 'José Clemente');

  setUser({ name, email, loggedIn: true, isPremium: false });
  
  // Limpar formulário de login após entrar
  const form = document.getElementById('form-auth');
  if (form) form.reset();

  checkAuthStatus();
};

window.handleLogout = function() {
  localStorage.removeItem('floriapp_session');
  checkAuthStatus();
};

window.switchTab = function(target) {
  const navItems = document.querySelectorAll('.nav-item');
  const tabs = document.querySelectorAll('.tab-content');

  navItems.forEach(i => i.classList.remove('active'));
  tabs.forEach(t => t.classList.remove('active'));

  const activeNav = document.querySelector(`.nav-item[data-tab="${target}"]`);
  if (activeNav) activeNav.classList.add('active');

  const activeTab = document.getElementById(target);
  if (activeTab) activeTab.classList.add('active');
};

window.markWatered = function(id) {
  const card = document.getElementById(`plant-card-${id}`);
  if (!card) return;

  const btn = card.querySelector('.btn-action');
  btn.style.backgroundColor = '#2d6a4f';
  btn.textContent = '✓ Concluído';
  card.classList.add('watered-success');

  setTimeout(() => {
    card.classList.add('fade-out');
    setTimeout(() => {
      const plants = getPlants();
      const plant = plants.find(p => p.id === id);
      if (plant) {
        plant.lastWatered = new Date().toISOString().split('T')[0];
        savePlants(plants);
        renderHome();
      }
    }, 400);
  }, 600);
};

window.removePlant = function(id) {
  if (confirm('Tem a certeza que deseja apagar este exemplar da sua coleção?')) {
    let plants = getPlants();
    plants = plants.filter(p => p.id !== id);
    savePlants(plants);
    renderHome();
    renderJardim();
  }
};

window.handleAddPlant = function() {
  const name = document.getElementById('plant-name').value;
  const species = document.getElementById('plant-species').value;
  const location = document.getElementById('plant-location').value;

  const user = getUser();
  const plants = getPlants();

  if (!user.isPremium && plants.length >= 5) {
    alert('⚠️ Limite de 5 exemplares atingido no Plano Standard. Atualize para o Plano Premium no separador Conta.');
    return;
  }

  plants.push({ id: Date.now(), name, species, location, lastWatered: new Date().toISOString().split('T')[0] });
  savePlants(plants);
  alert('Exemplar registado com sucesso.');

  document.getElementById('form-add-plant').reset();
  window.switchTab('jardim');
  renderHome();
  renderJardim();
};

window.handlePayment = function() {
  const user = getUser();
  if (user) {
    user.isPremium = true;
    setUser(user);
    alert('🎉 Método de pagamento guardado e Subscrição Premium ativada com sucesso!');
    checkAuthStatus();
  }
};

window.handleRemoveCard = function() {
  const user = getUser();
  if (user) {
    user.isPremium = false;
    setUser(user);
    alert('Cartão removido e subscrição alterada para o Plano Standard.');
    checkAuthStatus();
  }
};

// EVENTOS AO CARREGAR A PÁGINA
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();

  // Botões de login social
  const btnGoogle = document.getElementById('btn-login-google');
  if (btnGoogle) {
    btnGoogle.addEventListener('click', () => {
      window.handleLogin('José Clemente (Google)', 'jose.clemente@gmail.com');
    });
  }

  const btnApple = document.getElementById('btn-login-apple');
  if (btnApple) {
    btnApple.addEventListener('click', () => {
      window.handleLogin('José Clemente (Apple)', 'jose.clemente@icloud.com');
    });
  }

  // Abas de Entrar / Criar Conta
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const tabRegisterBtn = document.getElementById('tab-register-btn');
  const groupName = document.getElementById('group-name');
  const authSubmitBtn = document.getElementById('auth-submit-btn');

  if (tabLoginBtn && tabRegisterBtn) {
    tabLoginBtn.addEventListener('click', () => {
      tabLoginBtn.classList.add('active');
      tabRegisterBtn.classList.remove('active');
      if (groupName) groupName.style.display = 'none';
      if (authSubmitBtn) authSubmitBtn.textContent = 'Iniciar Sessão';
    });

    tabRegisterBtn.addEventListener('click', () => {
      tabRegisterBtn.classList.add('active');
      tabLoginBtn.classList.remove('active');
      if (groupName) groupName.style.display = 'block';
      if (authSubmitBtn) authSubmitBtn.textContent = 'Criar Nova Conta';
    });
  }

  const btnGoPremium = document.getElementById('btn-go-premium');
  if (btnGoPremium) {
    btnGoPremium.addEventListener('click', () => {
      window.switchTab('perfil');
    });
  }
});