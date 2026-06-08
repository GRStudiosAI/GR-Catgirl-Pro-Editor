import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export function render() {
    return `
        <div class="flex flex-col h-full bg-[#0A0010] text-white">
            <!-- Header/Toolbar -->
            <div class="h-12 border-b border-[#9d00ff]/30 flex items-center px-4 justify-between bg-[#160024]">
                <div class="flex items-center gap-2">
                    <svg class="w-6 h-6 text-[#9d00ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                    <span class="font-bold tracking-tight text-[#e0a6ff]">PRO VIDEO STUDIO</span>
                </div>
                <div class="flex items-center gap-3">
                    <button id="vid-export-btn" class="px-4 py-1 bg-[#9d00ff] hover:bg-[#ff009d] text-xs font-bold rounded transition-all shadow-[0_0_10px_rgba(157,0,255,0.3)]">
                        EXPORT VIDEO
                    </button>
                </div>
            </div>

            <!-- Main Body -->
            <div class="flex-1 flex overflow-hidden">
                <!-- Sidebar: Media Assets -->
                <div class="w-64 border-r border-[#9d00ff]/20 bg-[#0A0010] flex flex-col">
                    <div class="p-3 border-b border-[#9d00ff]/10 text-[10px] uppercase font-bold text-[#b388ff] flex justify-between items-center">
                        <span>Project Media</span>
                        <button id="vid-add-media" class="hover:text-white transition-colors relative">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            <input type="file" id="vid-media-input" class="absolute inset-0 opacity-0 cursor-pointer" multiple accept="video/*,audio/*" />
                        </button>
                    </div>
                    <div id="vid-asset-list" class="flex-1 overflow-y-auto p-2 space-y-2 select-none">
                        <!-- Assets will appear here -->
                        <div class="text-[10px] text-center text-[#9d00ff]/40 mt-10">NO MEDIA LOADED</div>
                    </div>
                </div>

                <!-- Center: Preview -->
                <div class="flex-1 flex flex-col bg-[#050008] relative">
                    <div class="flex-1 flex items-center justify-center p-4">
                        <div class="aspect-video w-full max-w-2xl bg-black rounded shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden border border-[#9d00ff]/10">
                            <video id="vid-preview" class="w-full h-full object-contain"></video>
                            <div id="vid-preview-empty" class="absolute inset-0 flex flex-col items-center justify-center text-[#9d00ff]/30">
                                <svg class="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                <span class="text-xs">PREVIEW MONITOR</span>
                            </div>
                        </div>
                    </div>

                    <!-- Player Controls -->
                    <div class="h-12 bg-[#100018] border-t border-[#9d00ff]/10 flex items-center justify-center gap-6 px-4">
                        <button id="vid-btn-rev" class="text-[#b388ff] hover:text-[#e0a6ff] transition-colors">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6V6zm3.5 6L19 18V6l-9.5 6z"></path></svg>
                        </button>
                        <button id="vid-btn-play" class="w-8 h-8 rounded-full bg-[#9d00ff] flex items-center justify-center text-white hover:bg-[#ff009d] transition-all">
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                        </button>
                        <button id="vid-btn-fwd" class="text-[#b388ff] hover:text-[#e0a6ff] transition-colors">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 6h-2v12h2V6zM5 6v12l9.5-6L5 6z"></path></svg>
                        </button>
                        <div class="text-[10px] font-mono text-[#00ffcc] bg-[#00ffcc]/5 px-2 py-1 rounded border border-[#00ffcc]/10" id="vid-time-display">
                            00:00:00 / 00:00:00
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom: Timeline -->
            <div class="h-64 border-t border-[#9d00ff]/30 bg-[#0A0010] flex flex-col">
                <div class="h-8 border-b border-[#9d00ff]/10 flex items-center px-4 justify-between bg-[#160024]">
                    <div class="flex items-center gap-4">
                        <span class="text-[10px] font-bold text-[#b388ff] uppercase">Editor Timeline</span>
                        <div class="flex items-center gap-2">
                             <button id="vid-zoom-out" class="p-1 hover:text-white transition-colors"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M20 12H4"></path></svg></button>
                             <div class="w-20 h-1 bg-[#160024] rounded-full border border-[#9d00ff]/20 relative overflow-hidden">
                                <div id="vid-zoom-bar" class="absolute top-0 left-0 h-full bg-[#9d00ff] w-1/2"></div>
                             </div>
                             <button id="vid-zoom-in" class="p-1 hover:text-white transition-colors"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
                        </div>
                    </div>
                    <div class="text-[10px] text-[#9d00ff]/50 font-mono">FRAME INTERPOLATION: ACTIVE</div>
                </div>

                <div class="flex-1 relative overflow-x-auto overflow-y-hidden select-none bg-grid-pattern group" id="vid-timeline-container">
                    <!-- Playhead -->
                    <div id="vid-playhead" class="absolute top-0 bottom-0 w-[1px] bg-red-500 z-50 pointer-events-none shadow-[0_0_5px_rgba(239,68,68,0.5)]">
                        <div class="absolute top-0 -left-[5px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[8px] border-t-red-500"></div>
                    </div>

                     <!-- Track Labels -->
                    <div class="absolute top-0 left-0 w-24 bottom-0 bg-[#0A0010]/95 border-r border-[#9d00ff]/20 z-40 flex flex-col">
                        <div class="h-16 flex items-center px-3 border-b border-[#9d00ff]/10 gap-2">
                            <span class="text-[9px] font-bold text-[#9d00ff]">V1</span>
                            <span class="text-[8px] text-white/40">Video Track</span>
                        </div>
                        <div class="h-16 flex items-center px-3 border-b border-[#9d00ff]/10 gap-2">
                            <span class="text-[9px] font-bold text-[#00ffcc]">A1</span>
                            <span class="text-[8px] text-white/40">Audio Track</span>
                        </div>
                    </div>

                    <!-- Scrollable Area -->
                    <div id="vid-track-scroll" class="ml-24 min-w-full h-full relative">
                        <!-- Video Track 1 -->
                        <div id="vid-track-v1" class="h-16 border-b border-[#9d00ff]/10 relative">
                             <!-- Draggable items here -->
                        </div>
                        <!-- Audio Track 1 -->
                        <div id="vid-track-a1" class="h-16 border-b border-[#9d00ff]/10 relative">
                             <!-- Draggable items here -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Overlay: Exporting -->
            <div id="vid-export-overlay" class="fixed inset-0 bg-black/90 z-[100] hidden flex flex-col items-center justify-center p-10">
                <div class="w-full max-w-md bg-[#160024] border border-[#9d00ff]/30 p-8 rounded-xl shadow-[0_0_50px_rgba(157,0,255,0.2)]">
                    <h4 class="text-xl font-bold text-[#e0a6ff] mb-2">Rendering Project</h4>
                    <p class="text-sm text-[#b388ff] mb-6">Processing frames and multiplexing audio...</p>
                    
                    <div class="w-full h-2 bg-[#0A0010] rounded-full overflow-hidden mb-2">
                        <div id="vid-export-progress" class="h-full bg-gradient-to-r from-[#9d00ff] to-[#ff009d] w-0 transition-all duration-300"></div>
                    </div>
                    <div class="flex justify-between text-[10px] font-mono text-[#00ffcc]">
                        <span id="vid-export-status">Preparing FFmpeg...</span>
                        <span id="vid-export-percent">0%</span>
                    </div>

                    <button id="vid-cancel-export" class="mt-8 w-full py-2 bg-red-500/20 hover:bg-red-500/40 text-red-500 font-bold rounded text-xs transition-all">
                        CANCEL RENDERING
                    </button>
                </div>
            </div>
        </div>

        <style>
            .bg-grid-pattern {
                background-image: linear-gradient(to right, rgba(157, 0, 255, 0.05) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(157, 0, 255, 0.05) 1px, transparent 1px);
                background-size: 20px 20px;
            }
            .clip-item {
                cursor: grab;
                transition: transform 0.1s;
                user-select: none;
            }
            .clip-item:active {
                cursor: grabbing;
                transform: scale(0.98);
            }
        </style>
    `;
}

export function init(container) {
    const videoPreview = container.querySelector('#vid-preview');
    const previewEmpty = container.querySelector('#vid-preview-empty');
    const mediaInput = container.querySelector('#vid-media-input');
    const assetList = container.querySelector('#vid-asset-list');
    const videoTrack = container.querySelector('#vid-track-v1');
    const audioTrack = container.querySelector('#vid-track-a1');
    const timeDisplay = container.querySelector('#vid-time-display');
    const playBtn = container.querySelector('#vid-btn-play');
    const playhead = container.querySelector('#vid-playhead');
    const trackScroll = container.querySelector('#vid-track-scroll');
    const timelineContainer = container.querySelector('#vid-timeline-container');
    const exportBtn = container.querySelector('#vid-export-btn');
    const exportOverlay = container.querySelector('#vid-export-overlay');
    const exportProgress = container.querySelector('#vid-export-progress');
    const exportStatus = container.querySelector('#vid-export-status');
    const exportPercent = container.querySelector('#vid-export-percent');

    let projectAssets = []; // { id, name, file, type, url, duration }
    let timelineClips = []; // { id, assetId, track, startTime, duration, offset }
    let currentTime = 0;
    let totalDuration = 0;
    let isPlaying = false;
    let zoomScale = 10; // pixels per second
    let ffmpeg = null;

    // --- Media Loading ---
    mediaInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length) {
            if (projectAssets.length === 0) assetList.innerHTML = '';
            
            for (const file of files) {
                const id = Math.random().toString(36).substr(2, 9);
                const url = URL.createObjectURL(file);
                const type = file.type.startsWith('video/') ? 'video' : 'audio';

                // Get metadata
                const tempMedia = document.createElement(type);
                tempMedia.src = url;
                await new Promise((resolve) => {
                    tempMedia.onloadedmetadata = () => resolve();
                });

                const asset = {
                    id,
                    name: file.name,
                    file,
                    type,
                    url,
                    duration: tempMedia.duration
                };

                projectAssets.push(asset);
                renderAsset(asset);
            }
        }
    });

    function renderAsset(asset) {
        const div = document.createElement('div');
        div.className = 'p-2 bg-[#160024] border border-[#9d00ff]/20 rounded text-[10px] hover:border-[#9d00ff]/60 transition-all cursor-move group relative';
        div.draggable = true;
        div.innerHTML = `
            <div class="flex items-center gap-2">
                ${asset.type === 'video' 
                    ? '<svg class="w-3 h-3 text-[#9d00ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>'
                    : '<svg class="w-3 h-3 text-[#00ffcc]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19V6l12-3v13"></path></svg>'}
                <span class="truncate flex-1">${asset.name}</span>
                <span class="text-[#9d00ff]/60">${Math.round(asset.duration)}s</span>
            </div>
        `;

        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('assetId', asset.id);
        });

        assetList.appendChild(div);
    }

    // --- Timeline Drag & Drop ---
    [videoTrack, audioTrack].forEach(track => {
        track.addEventListener('dragover', (e) => e.preventDefault());
        track.addEventListener('drop', (e) => {
            e.preventDefault();
            const assetId = e.dataTransfer.getData('assetId');
            const asset = projectAssets.find(a => a.id === assetId);
            if (!asset) return;

            const rect = track.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const startTime = x / zoomScale;

            addClipToTimeline(asset, track.id.includes('v1') ? 'video' : 'audio', startTime);
        });
    });

    function addClipToTimeline(asset, trackType, startTime) {
        const id = Math.random().toString(36).substr(2, 9);
        const clip = {
            id,
            assetId: asset.id,
            track: trackType,
            startTime,
            duration: asset.duration,
            offset: 0
        };

        timelineClips.push(clip);
        renderTimeline();
        updateTotalDuration();
    }

    function renderTimeline() {
        videoTrack.innerHTML = '';
        audioTrack.innerHTML = '';

        timelineClips.forEach(clip => {
            const asset = projectAssets.find(a => a.id === clip.assetId);
            const parent = clip.track === 'video' ? videoTrack : audioTrack;
            const color = clip.track === 'video' ? '#9d00ff' : '#00ffcc';

            const div = document.createElement('div');
            div.className = 'absolute top-1 bottom-1 rounded border border-white/20 px-2 overflow-hidden clip-item flex flex-col justify-center';
            div.style.left = (clip.startTime * zoomScale) + 'px';
            div.style.width = (clip.duration * zoomScale) + 'px';
            div.style.backgroundColor = color + '22';
            div.style.borderColor = color + '44';

            div.innerHTML = `
                <span class="text-[8px] font-bold truncate">${asset.name}</span>
                <div class="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-white/40 resize-handle-left"></div>
                <div class="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-white/40 resize-handle-right"></div>
            `;

            // Simple Drag & Trim Logic for clips
            let isDragging = false;
            let isResizingLeft = false;
            let isResizingRight = false;
            let startX = 0;
            let originalStart = 0;
            let originalDuration = 0;
            let originalOffset = 0;

            div.addEventListener('mousedown', (e) => {
                startX = e.clientX;
                originalStart = clip.startTime;
                originalDuration = clip.duration;
                originalOffset = clip.offset;

                if (e.target.classList.contains('resize-handle-left')) {
                    isResizingLeft = true;
                } else if (e.target.classList.contains('resize-handle-right')) {
                    isResizingRight = true;
                } else {
                    isDragging = true;
                    div.style.zIndex = "100";
                }
                e.stopPropagation();

                const onMouseMove = (ev) => {
                    const deltaX = (ev.clientX - startX) / zoomScale;

                    if (isDragging) {
                        clip.startTime = Math.max(0, originalStart + deltaX);
                        div.style.left = (clip.startTime * zoomScale) + 'px';
                    } else if (isResizingLeft) {
                        const newStart = Math.max(0, originalStart + deltaX);
                        const diff = newStart - originalStart;
                        const newDuration = originalDuration - diff;
                        
                        if (newDuration > 0.1) {
                             clip.startTime = newStart;
                             clip.offset = originalOffset + diff;
                             clip.duration = newDuration;
                             div.style.left = (clip.startTime * zoomScale) + 'px';
                             div.style.width = (clip.duration * zoomScale) + 'px';
                        }
                    } else if (isResizingRight) {
                        const newDuration = Math.max(0.1, originalDuration + deltaX);
                        clip.duration = newDuration;
                        div.style.width = (clip.duration * zoomScale) + 'px';
                    }
                    
                    updateTotalDuration();
                    updatePreview();
                };

                const onMouseUp = () => {
                    isDragging = false;
                    isResizingLeft = false;
                    isResizingRight = false;
                    div.style.zIndex = "1";
                    window.removeEventListener('mousemove', onMouseMove);
                    window.removeEventListener('mouseup', onMouseUp);
                    renderTimeline();
                };

                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
            });

            parent.appendChild(div);
        });
    }

    function updateTotalDuration() {
        totalDuration = timelineClips.reduce((prev, curr) => Math.max(prev, curr.startTime + curr.duration), 0);
        updateTimeDisplay();
    }

    function updateTimeDisplay() {
        const format = (s) => {
            const h = Math.floor(s / 3600);
            const m = Math.floor((s % 3600) / 60);
            const sec = Math.floor(s % 60);
            const ms = Math.floor((s % 1) * 100);
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
        };
        timeDisplay.textContent = `${format(currentTime)} / ${format(totalDuration)}`;
        playhead.style.left = (96 + (currentTime * zoomScale)) + 'px';
    }

    // --- Playback ---
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    });

    function play() {
        if (currentTime >= totalDuration) currentTime = 0;
        isPlaying = true;
        playBtn.innerHTML = '<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>';
        requestAnimationFrame(tick);
    }

    function pause() {
        isPlaying = false;
        playBtn.innerHTML = '<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>';
        videoPreview.pause();
    }

    function tick() {
        if (!isPlaying) return;
        currentTime += 1/60; // Assume 60fps
        if (currentTime >= totalDuration) {
            currentTime = totalDuration;
            pause();
        }
        updateTimeDisplay();
        updatePreview();
        requestAnimationFrame(tick);
    }

    function updatePreview() {
        const clip = timelineClips.find(c => c.track === 'video' && currentTime >= c.startTime && currentTime <= (c.startTime + c.duration));
        
        if (clip) {
            const asset = projectAssets.find(a => a.id === clip.assetId);
            if (videoPreview.src !== asset.url) {
                videoPreview.src = asset.url;
                previewEmpty.classList.add('hidden');
            }
            const videoTime = currentTime - clip.startTime + clip.offset;
            if (Math.abs(videoPreview.currentTime - videoTime) > 0.3) {
                videoPreview.currentTime = videoTime;
            }
            if (isPlaying && videoPreview.paused) videoPreview.play();
        } else {
            videoPreview.pause();
            previewEmpty.classList.remove('hidden');
        }
    }

    // --- Timeline Interaction ---
    timelineContainer.addEventListener('mousedown', (e) => {
        const rect = trackScroll.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x >= 0) {
            currentTime = Math.max(0, x / zoomScale);
            if (currentTime > totalDuration) currentTime = totalDuration;
            updateTimeDisplay();
            updatePreview();
        }
    });

    // --- Export ---
    exportBtn.addEventListener('click', async () => {
        if (timelineClips.length === 0) return alert("Timeline is empty!");
        
        exportOverlay.classList.remove('hidden');
        exportStatus.textContent = "Loading FFmpeg...";
        
        try {
            if (!ffmpeg) {
                ffmpeg = new FFmpeg();
                await ffmpeg.load({
                    coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
                    wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm',
                });
            }

            ffmpeg.on('progress', ({ progress }) => {
                const p = Math.round(progress * 100);
                exportProgress.style.width = p + '%';
                exportPercent.textContent = p + '%';
            });

            exportStatus.textContent = "Uploading assets...";
            const writtenFiles = new Set();
            for (const clip of timelineClips) {
                const asset = projectAssets.find(a => a.id === clip.assetId);
                if (!writtenFiles.has(asset.id)) {
                    await ffmpeg.writeFile(asset.id, await fetchFile(asset.file));
                    writtenFiles.add(asset.id);
                }
            }

            exportStatus.textContent = "Encoding video stream...";
            const videoClips = timelineClips.filter(c => c.track === 'video').sort((a,b) => a.startTime - b.startTime);
            const audioClips = timelineClips.filter(c => c.track === 'audio').sort((a,b) => a.startTime - b.startTime);

            if (videoClips.length > 0) {
                const v = videoClips[0];
                const a = audioClips[0];
                const args = ['-i', v.assetId];
                if (a) args.push('-i', a.assetId);
                
                args.push('-ss', v.offset.toString());
                args.push('-t', v.duration.toString());

                if (a) {
                    args.push('-filter_complex', `[1:a]adelay=${a.startTime*1000}|${a.startTime*1000}[a1];[0:a][a1]amix=inputs=2[aout]`);
                    args.push('-map', '0:v', '-map', '[aout]');
                }

                args.push('-preset', 'ultrafast', 'output.mp4');
                await ffmpeg.exec(args);

                const data = await ffmpeg.readFile('output.mp4');
                const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = 'project_export.mp4';
                downloadLink.click();
            }

            exportStatus.textContent = "Render Complete!";
            setTimeout(() => exportOverlay.classList.add('hidden'), 2000);

        } catch (error) {
            console.error(error);
            exportStatus.textContent = "Error during render.";
            exportPercent.textContent = "FAILED";
        }
    });

     container.querySelector('#vid-cancel-export').addEventListener('click', () => {
        exportOverlay.classList.add('hidden');
    });
}
