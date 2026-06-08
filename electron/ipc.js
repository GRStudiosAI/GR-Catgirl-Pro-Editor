const { dialog, shell } = require('electron');
const fs = require('fs/promises');
const path = require('path');

module.exports = function(ipcMain, mainWindow) {
    
    // Dialog Handlers
    ipcMain.handle('dialog:openFile', async (event, options) => {
        const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, options);
        if (canceled) return null;
        return filePaths;
    });

    ipcMain.handle('dialog:saveFile', async (event, options) => {
        const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, options);
        if (canceled) return null;
        return filePath;
    });

    ipcMain.handle('dialog:showMessage', async (event, options) => {
        return dialog.showMessageBox(mainWindow, options);
    });

    // File System operations
    ipcMain.handle('fs:readFile', async (event, filePath) => {
        try {
            // Return base64 for ease of use in render process
            const buffer = await fs.readFile(filePath);
            return buffer.toString('base64');
        } catch (error) {
            console.error('Error reading file:', error);
            throw error;
        }
    });

    ipcMain.handle('fs:writeFile', async (event, filePath, dataBase64) => {
        try {
            const buffer = Buffer.from(dataBase64, 'base64');
            await fs.writeFile(filePath, buffer);
            return true;
        } catch (error) {
            console.error('Error writing file:', error);
            throw error;
        }
    });

    ipcMain.handle('shell:openExternal', async (event, url) => {
        await shell.openExternal(url);
    });

    // Stubs for native processing (In a real app, this would use ffmpeg, sharp, etc.)
    // For this boilerplate, we simulate the processing taking time.
    
    ipcMain.handle('tool:processVideo', async (event, config) => {
        console.log('Processing video with config:', config);
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { success: true, message: 'Video processed successfully (Simulated)', path: config.outputPath || 'output.mp4' };
    });

    ipcMain.handle('tool:processAudio', async (event, config) => {
        console.log('Processing audio with config:', config);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true, message: 'Audio processed successfully (Simulated)' };
    });

    ipcMain.handle('tool:processImage', async (event, config) => {
        console.log('Processing image with config:', config);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true, message: 'Image processed successfully (Simulated)' };
    });

    ipcMain.handle('tool:processGif', async (event, config) => {
        console.log('Processing GIF with config:', config);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true, message: 'GIF optimized successfully (Simulated)' };
    });
};
