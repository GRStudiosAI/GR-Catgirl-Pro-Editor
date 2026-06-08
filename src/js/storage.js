// Simple wrapper around localStorage for this boilerplate
export function initStorage() {
    if (!window.localStorage) {
        console.warn('LocalStorage not available');
    }
}

export function save(key, data) {
    try {
        localStorage.setItem(`gr_app_${key}`, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Storage save error:', e);
        return false;
    }
}

export function load(key) {
    try {
        const item = localStorage.getItem(`gr_app_${key}`);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Storage load error:', e);
        return null;
    }
}

export function remove(key) {
    localStorage.removeItem(`gr_app_${key}`);
}
