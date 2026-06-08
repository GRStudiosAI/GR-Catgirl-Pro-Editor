const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Dialogs
    openFileDialog: (options) => ipcRenderer.invoke('dialog:openFile', options),
    saveFileDialog: (options) => ipcRenderer.invoke('dialog:saveFile', options),
    showMessageBox: (options) => ipcRenderer.invoke('dialog:showMessage', options),
    
    // Path Operations
    getAppPath: () => ipcRenderer.invoke('app:getPath'),
    
    // Process Execution & Tooling Bridge (Stubs for native functionality)
    processVideo: (config) => ipcRenderer.invoke('tool:processVideo', config),
    processAudio: (config) => ipcRenderer.invoke('tool:processAudio', config),
    processImage: (config) => ipcRenderer.invoke('tool:processImage', config),
    processGif: (config) => ipcRenderer.invoke('tool:processGif', config),
    
    // System Utilities
    readLocalFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
    writeLocalFile: (filePath, data) => ipcRenderer.invoke('fs:writeFile', filePath, data),
    
    // Open External
    openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url)
});
