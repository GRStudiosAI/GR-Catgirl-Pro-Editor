import { save, load } from './storage.js';

const SETTINGS_KEY = 'gr_studios_settings';

const defaultSettings = {
    theme: 'dark', // 'dark' or 'light'
    exportPath: '',
    hardwareAcceleration: true,
    autoSave: true
};

export let currentSettings = { ...defaultSettings };

export function loadSettings() {
    const saved = load(SETTINGS_KEY);
    if (saved) {
        currentSettings = { ...defaultSettings, ...saved };
    }
    return currentSettings;
}

export function saveSettings(newSettings) {
    currentSettings = { ...currentSettings, ...newSettings };
    save(SETTINGS_KEY, currentSettings);
    applyTheme();
}

export function applyTheme() {
    if (currentSettings.theme === 'light') {
        document.body.classList.add('theme-light');
    } else {
        document.body.classList.remove('theme-light');
    }
}

export function render() {
    return `
        <div class="max-w-2xl mx-auto space-y-8">
            <div class="bg-[#160024] p-6 rounded-lg border border-[#9d00ff]/30 shadow-lg">
                <h3 class="text-xl font-semibold mb-6 flex items-center text-[#ff009d]"><svg class="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Application Settings</h3>
                
                <div class="space-y-6">
                    <!-- Theme Settings -->
                    <div class="settings-group">
                        <label class="block text-[#b388ff] mb-2 font-medium">Visual Theme</label>
                        <select id="setting-theme" class="input-control w-full bg-[#2a0044] border-[#9d00ff]/30 rounded p-3 text-white">
                            <option value="dark" ${currentSettings.theme === 'dark' ? 'selected' : ''}>Dark Cyberpunk (Default)</option>
                            <option value="light" ${currentSettings.theme === 'light' ? 'selected' : ''}>Light Minimal</option>
                        </select>
                    </div>

                    <!-- Hardware Acceleration -->
                    <div class="settings-group">
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="setting-hw-accel" class="form-checkbox h-5 w-5 text-[#9d00ff] rounded bg-[#2a0044] border-[#9d00ff]/30 focus:ring-0 focus:ring-offset-0" ${currentSettings.hardwareAcceleration ? 'checked' : ''}>
                            <span class="text-[#e0a6ff]">Enable Hardware Acceleration (Requires Restart)</span>
                        </label>
                    </div>

                    <!-- Auto Save -->
                    <div class="settings-group">
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="setting-autosave" class="form-checkbox h-5 w-5 text-[#9d00ff] rounded bg-[#2a0044] border-[#9d00ff]/30 focus:ring-0 focus:ring-offset-0" ${currentSettings.autoSave ? 'checked' : ''}>
                            <span class="text-[#e0a6ff]">Enable Auto-save features</span>
                        </label>
                    </div>

                </div>
            </div>

            <div class="flex justify-end gap-4">
                <button id="btn-save-settings" class="btn-primary flex items-center shadow-[0_0_15px_rgba(157,0,255,0.4)]">
                    <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    Save Changes
                </button>
            </div>
        </div>
    `;
}

export function init(container) {
    const saveBtn = container.querySelector('#btn-save-settings');
    const themeSelect = container.querySelector('#setting-theme');
    const hwAccelCheckbox = container.querySelector('#setting-hw-accel');
    const autosaveCheckbox = container.querySelector('#setting-autosave');

    saveBtn.addEventListener('click', () => {
        saveSettings({
            theme: themeSelect.value,
            hardwareAcceleration: hwAccelCheckbox.checked,
            autoSave: autosaveCheckbox.checked
        });
        
        // Show success indicator
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<span class="text-[#00ffcc] font-bold">Saved!</span>';
        setTimeout(() => { saveBtn.innerHTML = originalText; }, 2000);
    });
}
