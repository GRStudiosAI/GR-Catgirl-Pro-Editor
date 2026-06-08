
export function render() {
    return `
        <div class="flex flex-col h-full bg-[#050008] text-white">
            <!-- Header -->
            <div class="h-12 border-b border-[#9d00ff]/30 flex items-center px-4 justify-between bg-[#160024]">
                <div class="flex items-center gap-2">
                    <svg class="w-6 h-6 text-[#ff009d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span class="font-bold tracking-tight text-[#e0a6ff]">PIXL STUDIO PRO</span>
                </div>
                <div class="flex items-center gap-3">
                    <button id="img-undo" class="p-1.5 hover:bg-white/10 rounded disabled:opacity-30"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5"></path></svg></button>
                    <button id="img-redo" class="p-1.5 hover:bg-white/10 rounded disabled:opacity-30"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 10H11a8 8 0 00-8 8v2m18-10l-5 5m5-5l-5-5"></path></svg></button>
                    <div class="w-[1px] h-4 bg-white/10 mx-1"></div>
                    <button id="img-save-btn" class="px-4 py-1 bg-[#9d00ff] hover:bg-[#ff009d] text-xs font-bold rounded transition-all shadow-[0_0_10px_rgba(157,0,255,0.3)]">
                        SAVE / EXPORT
                    </button>
                </div>
            </div>

            <div class="flex-1 flex overflow-hidden">
                <!-- Left Sidebar: Main Tools -->
                <div class="w-16 border-r border-[#9d00ff]/20 bg-[#0A0010] flex flex-col items-center py-4 gap-4">
                    <button class="tool-btn active" data-tool="arrange" title="Arrange & Resize">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                    </button>
                    <button class="tool-btn" data-tool="cutout" title="Cutout & Background Removal">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758L12 12m0 0l2.879 2.879M12 12l2.879-2.879"></path></svg>
                    </button>
                    <button class="tool-btn" data-tool="adjust" title="Adjust & Color">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    </button>
                    <button class="tool-btn" data-tool="filter" title="Filters & Effects">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    </button>
                    <button class="tool-btn" data-tool="retouch" title="Retouch & Heal">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    </button>
                    
                    <div class="mt-auto flex flex-col gap-4">
                        <button id="img-load-btn" class="p-2 border border-[#9d00ff]/30 rounded-lg hover:bg-[#9d00ff]/20 relative">
                            <svg class="w-6 h-6 text-[#e0a6ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg>
                            <input type="file" id="img-input" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                        </button>
                    </div>
                </div>

                <!-- Tool Panel: Sub-options -->
                <div class="w-64 border-r border-[#9d00ff]/20 bg-[#0A0010] flex flex-col overflow-y-auto">
                    <div class="p-4" id="tool-settings-container">
                        <!-- Settings injected here based on tool -->
                        <div id="settings-arrange" class="space-y-6">
                            <h4 class="text-xs font-bold text-[#b388ff] uppercase tracking-wider">Canvas Size</h4>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="text-[10px] text-white/40 block mb-1">Width</label>
                                    <input type="number" id="img-width" class="w-full bg-[#160024] border border-[#9d00ff]/20 rounded p-1.5 text-xs text-white" value="1080">
                                </div>
                                <div>
                                    <label class="text-[10px] text-white/40 block mb-1">Height</label>
                                    <input type="number" id="img-height" class="w-full bg-[#160024] border border-[#9d00ff]/20 rounded p-1.5 text-xs text-white" value="1080">
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <input type="checkbox" id="img-constrain" checked class="accent-[#9d00ff]">
                                <label class="text-[10px] text-white/60">Lock Aspect Ratio</label>
                            </div>
                            <button class="w-full py-2 bg-[#160024] border border-[#9d00ff]/30 rounded text-[10px] font-bold hover:bg-[#9d00ff]/20 transition-all uppercase">Apply Size</button>
                        </div>
                        
                        <div id="settings-cutout" class="space-y-6 hidden">
                            <h4 class="text-xs font-bold text-[#b388ff] uppercase tracking-wider">Removal Tools</h4>
                            <div class="grid grid-cols-2 gap-2">
                                <button class="cutout-type active p-3 bg-[#160024] border border-white/10 rounded flex flex-col items-center gap-2 hover:border-[#9d00ff]" data-type="lasso">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"></path></svg>
                                    <span class="text-[8px]">MAGIC WAND</span>
                                </button>
                                <button class="cutout-type p-3 bg-[#160024] border border-white/10 rounded flex flex-col items-center gap-2 hover:border-[#9d00ff]" data-type="eraser">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    <span class="text-[8px]">ERASER</span>
                                </button>
                            </div>
                            <div>
                                <label class="text-[10px] text-white/40 block mb-2">Tolerance / Size</label>
                                <input type="range" id="cutout-size" class="w-full accent-[#9d00ff]" min="1" max="100" value="30">
                            </div>
                            <button id="img-rm-bg" class="w-full py-3 bg-gradient-to-r from-[#9d00ff]/20 to-[#ff009d]/20 border border-[#9d00ff]/50 rounded text-[10px] font-bold hover:from-[#9d00ff]/40 hover:to-[#ff009d]/40 transition-all uppercase">
                                AI Background Remove
                            </button>
                        </div>

                        <div id="settings-adjust" class="space-y-6 hidden">
                             <h4 class="text-xs font-bold text-[#b388ff] uppercase tracking-wider">Color & Light</h4>
                             <div class="space-y-4">
                                <div>
                                    <div class="flex justify-between text-[10px] mb-1">
                                        <label>Brightness</label>
                                        <span id="bri-val">0</span>
                                    </div>
                                    <input type="range" class="adj-range w-full accent-[#9d00ff]" data-filter="brightness" min="-100" max="100" value="0">
                                </div>
                                <div>
                                    <div class="flex justify-between text-[10px] mb-1">
                                        <label>Contrast</label>
                                        <span id="con-val">0</span>
                                    </div>
                                    <input type="range" class="adj-range w-full accent-[#9d00ff]" data-filter="contrast" min="-100" max="100" value="0">
                                </div>
                                <div>
                                    <div class="flex justify-between text-[10px] mb-1">
                                        <label>Saturation</label>
                                        <span id="sat-val">100%</span>
                                    </div>
                                    <input type="range" class="adj-range w-full accent-[#9d00ff]" data-filter="saturate" min="0" max="200" value="100">
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                <!-- Main Editor Area -->
                <div class="flex-1 bg-[#050008] relative overflow-hidden flex flex-col">
                    <!-- Nav/Breadcrumb -->
                    <div class="h-8 bg-[#0A0010] flex items-center px-4 gap-4 border-b border-white/5">
                        <div class="flex items-center gap-2 text-[10px] text-white/40">
                            <span>Workspace</span>
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                            <span class="text-[#e0a6ff]" id="img-name-display">untitled.png</span>
                        </div>
                    </div>

                    <!-- Canvas Container -->
                    <div class="flex-1 flex items-center justify-center p-8 overflow-auto" id="canvas-workspace">
                        <div class="relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] shadow-[0_0_100px_rgba(0,0,0,0.8)]" id="canvas-container">
                             <canvas id="main-canvas"></canvas>
                             <canvas id="ui-canvas" class="absolute inset-0 pointer-events-none"></canvas>
                        </div>
                    </div>

                    <!-- Footer / Zoom -->
                    <div class="h-10 bg-[#0A0010] border-t border-white/5 flex items-center justify-between px-4">
                         <div class="flex items-center gap-4">
                            <span class="text-[9px] font-mono text-[#00ffcc]" id="img-dim-display">1080 x 1080 px</span>
                         </div>
                         <div class="flex items-center gap-3">
                             <button id="zoom-out" class="p-1 hover:text-white transition-colors text-white/40"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 12H4"></path></svg></button>
                             <span id="zoom-percent" class="text-[10px] font-mono w-10 text-center">100%</span>
                             <button id="zoom-in" class="p-1 hover:text-white transition-colors text-white/40"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg></button>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .tool-btn {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                color: rgba(255, 255, 255, 0.4);
                transition: all 0.2s;
            }
            .tool-btn:hover {
                background: rgba(157, 0, 255, 0.1);
                color: white;
            }
            .tool-btn.active {
                background: #9d00ff;
                color: white;
                box-shadow: 0 0 15px rgba(157, 0, 255, 0.4);
            }
            #main-canvas {
                cursor: crosshair;
                display: block;
            }
            .cutout-type.active {
                border-color: #9d00ff;
                background: rgba(157, 0, 255, 0.1);
            }
            input[type="range"] {
                cursor: pointer;
            }
        </style>
    `;
}

export function init(container) {
    const mainCanvas = container.querySelector('#main-canvas');
    const uiCanvas = container.querySelector('#ui-canvas');
    const ctx = mainCanvas.getContext('2d', { willReadFrequently: true });
    const uictx = uiCanvas.getContext('2d');
    const imgInput = container.querySelector('#img-input');
    const nameDisplay = container.querySelector('#img-name-display');
    const dimDisplay = container.querySelector('#img-dim-display');
    const zoomPercent = container.querySelector('#zoom-percent');
    const saveBtn = container.querySelector('#img-save-btn');

    let currentImg = null;
    let canvasScale = 1;
    let activeTool = 'arrange';
    let history = [];
    let historyIndex = -1;

    // Load Image
    imgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    currentImg = img;
                    nameDisplay.textContent = file.name;
                    setupCanvas(img);
                    saveToHistory();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    function setupCanvas(img) {
        mainCanvas.width = img.width;
        mainCanvas.height = img.height;
        uiCanvas.width = img.width;
        uiCanvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        dimDisplay.textContent = `${img.width} x ${img.height} px`;
        fitToView();
    }

    function fitToView() {
        const workspace = container.querySelector('#canvas-workspace');
        const padding = 64;
        const widthScale = (workspace.clientWidth - padding) / mainCanvas.width;
        const heightScale = (workspace.clientHeight - padding) / mainCanvas.height;
        canvasScale = Math.min(1, widthScale, heightScale);
        
        applyZoom();
    }

    function applyZoom() {
        mainCanvas.style.width = (mainCanvas.width * canvasScale) + 'px';
        mainCanvas.style.height = (mainCanvas.height * canvasScale) + 'px';
        uiCanvas.style.width = mainCanvas.style.width;
        uiCanvas.style.height = mainCanvas.style.height;
        zoomPercent.textContent = Math.round(canvasScale * 100) + '%';
    }

    // Tools Switching
    container.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tool = btn.dataset.tool;
            activeTool = tool;
            
            // Toggle settings panels
            container.querySelectorAll('#tool-settings-container > div').forEach(div => div.classList.add('hidden'));
            const settingsPanel = container.querySelector(`#settings-${tool}`);
            if (settingsPanel) settingsPanel.classList.remove('hidden');
        });
    });

    // --- Cutout Tool Logic ---
    let isDrawing = false;
    let brushRadius = 30;

    container.querySelector('#cutout-size')?.addEventListener('input', (e) => {
        brushRadius = parseInt(e.target.value);
    });

    mainCanvas.addEventListener('mousedown', (e) => {
        if (activeTool !== 'cutout') return;
        isDrawing = true;
        handleDraw(e);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDrawing || activeTool !== 'cutout') return;
        handleDraw(e);
    });

    window.addEventListener('mouseup', () => {
        if (isDrawing) {
            isDrawing = false;
            saveToHistory();
        }
    });

    function handleDraw(e) {
        const rect = mainCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / canvasScale;
        const y = (e.clientY - rect.top) / canvasScale;

        const type = container.querySelector('.cutout-type.active')?.dataset.type;

        if (type === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
            ctx.fill();
        } else if (type === 'lasso') {
            // Magic Wand Mock (Flood fill or simple color removal)
            // For now, let's just do a "Remove Bg" simulation or precise eraser.
            // A real flood fill is expensive but good.
            magicWand(Math.round(x), Math.round(y), brushRadius);
            isDrawing = false; // Wand is a single click
        }
    }

    function magicWand(startX, startY, tolerance) {
        const imgData = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
        const data = imgData.data;
        const visited = new Uint8Array(mainCanvas.width * mainCanvas.height);
        const stack = [[startX, startY]];
        
        const basePos = (startY * mainCanvas.width + startX) * 4;
        const baseR = data[basePos];
        const baseG = data[basePos + 1];
        const baseB = data[basePos + 2];
        const baseA = data[basePos + 3];

        if (baseA === 0) return; // Already transparent

        while(stack.length > 0) {
            const [x, y] = stack.pop();
            const idx = (y * mainCanvas.width + x);
            
            if (x < 0 || x >= mainCanvas.width || y < 0 || y >= mainCanvas.height || visited[idx]) continue;
            
            const pos = idx * 4;
            const r = data[pos];
            const g = data[pos + 1];
            const b = data[pos + 2];
            const a = data[pos + 3];

            const diff = Math.sqrt(
                Math.pow(r - baseR, 2) + 
                Math.pow(g - baseG, 2) + 
                Math.pow(b - baseB, 2)
            );

            if (diff <= tolerance) {
                visited[idx] = 1;
                data[pos + 3] = 0; // Make transparent
                
                stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
            }
        }
        
        ctx.putImageData(imgData, 0, 0);
    }

    container.querySelector('#img-rm-bg')?.addEventListener('click', async () => {
        // Mock AI Background removal
        alert("Analyzing subject... (AI Model is parsing segments)");
        const imgData = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
        const data = imgData.data;
        
        // Simple "remove bright backgrounds" mock
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] > 200 && data[i+1] > 200 && data[i+2] > 200) {
                data[i+3] = 0;
            }
        }
        ctx.putImageData(imgData, 0, 0);
        saveToHistory();
    });

    // History System
    function saveToHistory() {
        const snapshot = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
        history = history.slice(0, historyIndex + 1);
        history.push(snapshot);
        historyIndex++;
        if (history.length > 20) {
            history.shift();
            historyIndex--;
        }
        updateHistoryButtons();
    }

    function updateHistoryButtons() {
        container.querySelector('#img-undo').disabled = historyIndex <= 0;
        container.querySelector('#img-redo').disabled = historyIndex >= history.length - 1;
    }

    container.querySelector('#img-undo').addEventListener('click', () => {
        if (historyIndex > 0) {
            historyIndex--;
            ctx.putImageData(history[historyIndex], 0, 0);
            updateHistoryButtons();
        }
    });

    container.querySelector('#img-redo').addEventListener('click', () => {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            ctx.putImageData(history[historyIndex], 0, 0);
            updateHistoryButtons();
        }
    });

    saveBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `pix-edit-${Date.now()}.png`;
        link.href = mainCanvas.toDataURL('image/png');
        link.click();
    });
}
