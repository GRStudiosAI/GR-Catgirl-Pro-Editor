import { initNavigation, renderNavigation } from './navigation.js';
import { loadSettings, applyTheme } from './settings.js';
import { initStorage } from './storage.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('GR Studios Standalone Tools Initializing...');
    
    // Check if running in Electron
    const isElectron = window.electronAPI !== undefined;
    if (isElectron) {
        document.body.classList.add('electron-env');
    }

    // Initialize core services
    initStorage();
    loadSettings();
    applyTheme();
    
    // Initialize UI
    renderNavigation();
    initNavigation();
    
    // Setup Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    
    // Simulate clicking the first nav item to load Dashboard
    setTimeout(() => {
        const firstNav = document.querySelector('.nav-item');
        if (firstNav) firstNav.click();
    }, 100);
});
