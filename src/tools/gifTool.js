import { bindDragAndDrop } from '../js/utilities.js';

export function render() {
    return `
        <div class="max-w-4xl mx-auto">
            <div class="bg-[#160024] border border-[#ff009d]/30 rounded-lg p-6 shadow-[0_0_20px_rgba(255,0,157,0.1)]">
                <div class="flex items-center justify-between mb-6 pb-4 border-b border-[#ff009d]/20">
                    <h3 class="text-xl font-bold flex items-center text-[#ff009d]">
                        <svg class="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect><path d="M12 12h.01"></path><path d="M16 12h.01"></path><path d="M8 12h.01"></path></svg>
                        Advanced GIF Editor
                    </h3>
                </div>
                
                <div id="gif-dropzone" class="drop-zone border-[#ff009d]/30 hover:border-[#ff009d] bg-[#0a0010] p-12 text-center rounded-xl mb-6">
                    <p class="text-lg text-[#e0a6ff]">Drop GIF file to optimize</p>
                    <button class="btn-secondary mt-4 border-[#ff009d]/50 text-[#ff009d] hover:bg-[#ff009d]/10">Select File</button>
                </div>
                
                <div class="grid grid-cols-2 gap-6 opacity-50 pointer-events-none" id="gif-controls">
                    <div class="bg-[#0a0010] p-4 border border-[#ff009d]/20 rounded-lg">
                        <label class="block text-xs font-bold uppercase text-[#b388ff] mb-2">Optimization Level</label>
                        <select class="w-full bg-[#160024] border border-[#ff009d]/50 rounded p-2 text-white">
                            <option>Lossless</option>
                            <option>Light (Colors: 128)</option>
                            <option>Medium (Colors: 64)</option>
                            <option>Heavy (Colors: 32)</option>
                        </select>
                    </div>
                    <div class="bg-[#0a0010] p-4 border border-[#ff009d]/20 rounded-lg flex items-center justify-between">
                        <div>
                            <label class="block text-xs font-bold uppercase text-[#b388ff] mb-1">Preserve Transparency</label>
                            <span class="text-[10px] text-gray-500">Keep alpha channels intact</span>
                        </div>
                        <input type="checkbox" checked class="form-checkbox h-6 w-6 text-[#ff009d] rounded bg-[#2a0044] border-none focus:ring-0">
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function init(container) {
    const dropzone = container.querySelector('#gif-dropzone');
    const controls = container.querySelector('#gif-controls');
    
    bindDragAndDrop(dropzone, (files) => {
        if(files.length > 0 && controls) {
            controls.classList.remove('opacity-50', 'pointer-events-none');
            dropzone.innerHTML = `<p class="text-[#00ffcc] font-bold py-4">Loaded: ${files[0].name}</p>`;
        }
    });
}
