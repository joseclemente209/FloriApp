const INITIAL_PLANTS = [
  { id: 1, name: 'Marta', species: 'Monstera deliciosa', location: 'Sala', lastWatered: '2026-10-19' },
  { id: 2, name: 'Zen Pothos', species: 'Epipremnum aureum', location: 'Cozinha', lastWatered: '2026-10-19' }
];

export const Storage = {
  getUser() {
    const user = localStorage.getItem('floriapp_session');
    return user ? JSON.parse(user) : null;
  },

  setUser(userData) {
    localStorage.setItem('floriapp_session', JSON.stringify(userData));
  },

  logout() {
    localStorage.removeItem('floriapp_session');
  },

  getPlants() {
    const data = localStorage.getItem('floriapp_plants');
    return data ? JSON.parse(data) : INITIAL_PLANTS;
  },

  savePlants(plants) {
    localStorage.setItem('floriapp_plants', JSON.stringify(plants));
  },

  addPlant(plant) {
    const plants = this.getPlants();
    const user = this.getUser();
    const isPremium = user && user.isPremium;

    if (!isPremium && plants.length >= 5) {
      alert('⚠️ Limite de 5 exemplares atingido no Plano Standard. Atualize para o Plano Premium no separador Conta.');
      return false;
    }
    plants.push({ ...plant, id: Date.now() });
    this.savePlants(plants);
    return true;
  },

  deletePlant(id) {
    let plants = this.getPlants();
    plants = plants.filter(p => p.id !== id);
    this.savePlants(plants);
  },

  upgradeToPremium() {
    const user = this.getUser();
    if (user) {
      user.isPremium = true;
      user.hasCard = true;
      this.setUser(user);
    }
  },

  removeCard() {
    const user = this.getUser();
    if (user) {
      user.isPremium = false;
      user.hasCard = false;
      this.setUser(user);
    }
  }
};