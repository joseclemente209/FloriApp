import { Storage } from './storage.js';

export const UI = {
  renderHome() {
    const plants = Storage.getPlants();
    const list = document.getElementById('home-watering-list');
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
  },

  renderJardim() {
    const plants = Storage.getPlants();
    const list = document.getElementById('jardim-list');
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
};