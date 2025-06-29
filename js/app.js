

import dataList from '../data.json' with { type: 'json' };
const toggleBtn = document.getElementById('toggle-theme');
const icon = document.getElementById('icon-theme');

// Aplica el tema desde localStorage al cargar
const aplicarTema = (tema) => {
    const isDark = tema === 'oscuro';
    document.body.classList.toggle('modo-oscuro', isDark);

    // Rota el ícono
    icon.classList.add('rotar');
    setTimeout(() => icon.classList.remove('rotar'), 400);

    icon.src = isDark
        ? './assets/images/icon-sun.svg'
        : './assets/images/icon-moon.svg';
    icon.alt = isDark
        ? 'Cambiar a modo claro'
        : 'Cambiar a modo oscuro';
};

// Cambiar y guardar el tema
const cambiarTema = () => {
    const temaActual = localStorage.getItem('tema') === 'oscuro' ? 'claro' : 'oscuro';
    localStorage.setItem('tema', temaActual);
    aplicarTema(temaActual);
};

// Event listener con función flecha
toggleBtn.addEventListener('click', cambiarTema);

// Al cargar, aplicar el tema guardado (si existe)
window.addEventListener('DOMContentLoaded', () => {
    const temaGuardado = localStorage.getItem('tema') || 'claro';
    aplicarTema(temaGuardado);
});

let filteredList = [...dataList]; // Copia interna que puedes modificar

const container = document.getElementById('cards');
const filterTabs = document.getElementById('filter-tabs');
const noResults = document.getElementById('no-results');
let currentFilter = 'all';

function createCard(data) {
    const card = document.createElement('div');
    card.className = 'card';

    // ——————————————————————
    // Header: imagen + bloque de título + descripción
    // ——————————————————————
    const header = document.createElement('div');
    header.className = 'card-header';

    const logo = document.createElement('img');
    logo.src = data.logo;
    logo.alt = `${data.name} logo`;
    logo.className = 'card-logo';
    header.appendChild(logo);

    const meta = document.createElement('div');
    meta.className = 'card-meta';

    const title = document.createElement('h2');
    title.textContent = data.name;
    title.className = 'card-title';

    const desc = document.createElement('p');
    desc.textContent = data.description;
    desc.className = 'card-desc';

    meta.appendChild(title);
    meta.appendChild(desc);
    header.appendChild(meta);

    card.appendChild(header);

    // ——————————————————————
    // Footer: acciones (Remove + Switch)
    // ——————————————————————
    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
        removeBtn.classList.toggle('inactive');
    });

    // Etiqueta accesible
    const label = document.createElement('label');
    label.className = 'switch';

    const hiddenText = document.createElement('span');
    hiddenText.className = 'visually-hidden';
    hiddenText.textContent = `Activar extensión ${data.name}`;

    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.checked = data.isActive;
    toggle.className = 'card-toggle';

    const slider = document.createElement('span');
    slider.className = 'slider';

    label.appendChild(hiddenText); // ¡Esto soluciona la advertencia!
    label.appendChild(toggle);
    label.appendChild(slider);

    actions.appendChild(removeBtn);
    actions.appendChild(label);
    card.appendChild(actions);

    return card;
}



// Renderiza tarjetas según el filtro actual
function renderCards(filter = 'all') {
    container.innerHTML = '';

    const visibleItems = filteredList.filter(data => {
        if (filter === 'active') return data.isActive;
        if (filter === 'inactive') return !data.isActive;
        return true; // 'all'
    });

    if (visibleItems.length === 0) {
        noResults.hidden = false;
    } else {
        noResults.hidden = true;
        visibleItems.forEach(data => {
            const card = createCard(data);
            container.appendChild(card);
        });
    }
}

// Evento para los botones de filtro
filterTabs.addEventListener('click', e => {
    if (e.target.matches('.tab')) {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });

        e.target.classList.add('active');
        e.target.setAttribute('aria-selected', 'true');

        currentFilter = e.target.dataset.filter;
        renderCards(currentFilter);
    }
});

// Inicializar
renderCards();
