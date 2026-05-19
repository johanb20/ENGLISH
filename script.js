// ===== SISTEMA DE UNIDADES =====
let currentUnit = 'unit1';

// Función para obtener el nivel actual basado en la clase del body
function getCurrentLevel() {
    if (document.body.classList.contains('theme-pink')) return 'A1';
    if (document.body.classList.contains('theme-blue')) return 'A2';
    return 'default';
}

// Función para abrir/cerrar el menú de unidades
function toggleUnitsMenu() {
    const unitsPanel = document.getElementById('unitsPanel');
    const unitsOverlay = document.getElementById('unitsOverlay');
    if (!unitsPanel || !unitsOverlay) return;
    unitsPanel.classList.toggle('open');
    unitsOverlay.classList.toggle('active');
    document.body.style.overflow = unitsPanel.classList.contains('open') ? 'hidden' : '';
}

// Función para cerrar el menú de unidades
function closeUnitsMenu() {
    const unitsPanel = document.getElementById('unitsPanel');
    const unitsOverlay = document.getElementById('unitsOverlay');
    if (!unitsPanel || !unitsOverlay) return;
    unitsPanel.classList.remove('open');
    unitsOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Función para cambiar de unidad
function switchUnit(unitId) {
    console.log('Cambiando a unidad:', unitId);

    document.querySelectorAll('.unit-container').forEach(unit => {
        unit.classList.remove('active');
    });

    const selectedUnit = document.getElementById(unitId);
    if (selectedUnit) {
        selectedUnit.classList.add('active');
        currentUnit = unitId;

        window.scrollTo({ top: 0, behavior: 'smooth' });

        const unitTitle = selectedUnit.querySelector('h1').textContent;
        const titleElement = document.getElementById('currentUnitTitle');
        if (titleElement) titleElement.textContent = unitTitle;

        document.querySelectorAll('.unit-link').forEach(link => {
            link.classList.toggle('active', link.dataset.unit === unitId);
        });

        closeUnitsMenu();

        // Guardar la última unidad vista por nivel en localStorage
        const level = getCurrentLevel();
        localStorage.setItem(`lastUnit_${level}`, unitId);
    } else {
        console.log('ERROR: No se encontró la unidad:', unitId);
    }
}

// Inicializar el sistema de unidades
function initUnitsSystem() {
    document.querySelectorAll('.unit-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const unitId = link.dataset.unit;
            if (unitId) switchUnit(unitId);
        });
    });

    const level = getCurrentLevel();
    // Clave de sessionStorage que los menu links activan al navegar hacia esta página
    const resetKey = `resetToUnit1_${level}`;

    if (sessionStorage.getItem(resetKey)) {
        // Venimos de hacer clic en un menu link → siempre unit1
        sessionStorage.removeItem(resetKey);
        console.log(`Menu link detectado → forzando unit1 en ${level}`);
        switchUnit('unit1');
    } else {
        // Recarga normal → restaurar la última unidad guardada
        const saved = localStorage.getItem(`lastUnit_${level}`);
        console.log(`Restaurando unidad guardada para ${level}:`, saved || 'unit1 (ninguna guardada)');
        switchUnit(saved || 'unit1');
    }

    const unitsOverlay = document.getElementById('unitsOverlay');
    if (unitsOverlay) unitsOverlay.addEventListener('click', closeUnitsMenu);

    console.log(`✅ Sistema de unidades inicializado para ${level}`);
}

// ===== MENÚ PRINCIPAL =====
function toggleMenu() {
    const menuPanel = document.getElementById('menuPanel');
    const overlay = document.getElementById('menuOverlay');
    const icon = document.querySelector('.menu-icon');
    if (!menuPanel || !overlay) return;
    menuPanel.classList.toggle('open');
    overlay.classList.toggle('active');
    if (icon) icon.textContent = menuPanel.classList.contains('open') ? '✕' : '☰';
    document.body.style.overflow = menuPanel.classList.contains('open') ? 'hidden' : '';
}

function closeMenu() {
    const menuPanel = document.getElementById('menuPanel');
    const overlay = document.getElementById('menuOverlay');
    const icon = document.querySelector('.menu-icon');
    if (!menuPanel || !overlay) return;
    menuPanel.classList.remove('open');
    overlay.classList.remove('active');
    if (icon) icon.textContent = '☰';
    document.body.style.overflow = '';
}

function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === currentPage);
    });
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function () {
    setActiveLink();

    const overlay = document.getElementById('menuOverlay');
    if (overlay) overlay.addEventListener('click', closeMenu);

    const closeBtn = document.querySelector('.menu-close');
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // Al hacer clic en un menu link, marcar la página destino para resetear a unit1
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            if (href && href !== 'index.html' && href !== '#') {
                if (href.includes('A1')) sessionStorage.setItem('resetToUnit1_A1', 'true');
                else if (href.includes('A2')) sessionStorage.setItem('resetToUnit1_A2', 'true');
                else if (href.includes('Grammar')) sessionStorage.setItem('resetToUnit1_default', 'true');
                else if (href.includes('Vocabulary')) sessionStorage.setItem('resetToUnit1_default', 'true');
            }
            closeMenu();
        });
    });

    // Las cards del index.html también deben resetear a unit1
    document.querySelectorAll('a.card').forEach(card => {
        card.addEventListener('click', () => {
            const href = card.getAttribute('href');
            if (href && href !== 'index.html' && href !== '#') {
                if (href.includes('A1')) sessionStorage.setItem('resetToUnit1_A1', 'true');
                else if (href.includes('A2')) sessionStorage.setItem('resetToUnit1_A2', 'true');
                else if (href.includes('Grammar')) sessionStorage.setItem('resetToUnit1_default', 'true');
                else if (href.includes('Vocabulary')) sessionStorage.setItem('resetToUnit1_default', 'true');
            }
        });
    });

    initUnitsSystem();

    console.log('✅ Todo inicializado correctamente');
});

// Exponer funciones globalmente
window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;
window.toggleUnitsMenu = toggleUnitsMenu;
window.closeUnitsMenu = closeUnitsMenu;
window.switchUnit = switchUnit;
