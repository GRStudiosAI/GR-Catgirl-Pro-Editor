import WaveSurfer from 'wavesurfer.js';

export function render() {
    return `
        <div class="flex flex-col h-full bg-[#0A0010] text-[#ffaa00]">
            <!-- Top Nav -->
            <div class="h-12 border-b border-[#ffaa00]/30 flex items-center px-4 justify-between bg-[#160024]">
                <div class="flex items-center gap-2">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                    <span class="font-bold tracking-tight uppercase">Audio Production Suite</span>
                </div>
                <div class="flex items-center gap-3">
                    <button id="aud-add-track" class="px-4 py-1 bg-[#ffaa00]/10 hover:bg-[#ffaa00]/20 text-xs font-bold rounded border border-[#ffaa00]/30 transition-all relative">
                        ADD TRACK
                        <input type="file" id="aud-file-input" class="absolute inset-0 opacity-0 cursor-pointer" accept="audio/*" multiple />
                    </button>
                    <button id="aud-export-btn" class="px-4 py-1 bg-[#ffaa00] text-black text-xs font-bold rounded hover:bg-[#ffcc00] transition-all shadow-[0_0_10px_rgba(255,170,0,0.3)]">
                        MIX & EXPORT
                    </button>
                </div>
            </div>

            <!-- Editor Area -->
            <div class="flex-1 flex overflow-hidden">
                <!-- Master Controls Side -->
                <div class="w-64 border-r border-[#ffaa00]/20 bg-[#0A0010] flex flex-col">
                    <div class="p-4 space-y-6">
                        <div>
                            <label class="text-[10px] uppercase font-bold text-[#ffaa00]/60 mb-2 block">Master Volume</label>
                            <input type="range" id="aud-master-vol" class="w-full accent-[#ffaa00] h-1 bg-[#160024] rounded-lg cursor-pointer" value="80">
                        </div>
                        <div class="p-4 rounded border border-[#ffaa00]/10 bg-[#ffaa00]/5">
                            <h4 class="text-xs font-bold mb-2">Project Info</h4>
                            <div class="space-y-1">
                                <div class="flex justify-between text-[10px]">
                                    <span class="text-[#ffaa00]/50">Sample Rate</span>
                                    <span>44.1 kHz</span>
                                </div>
                                <div class="flex justify-between text-[10px]">
                                    <span class="text-[#ffaa00]/50">Bit Depth</span>
                                    <span>24-bit</span>
                                </div>
                                <div class="flex justify-between text-[10px]">
                                    <span class="text-[#ffaa00]/50">Channels</span>
                                    <span>Stereo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-auto p-4 border-t border-[#ffaa00]/10">
                         <div class="text-[20px] font-mono text-center mb-2" id="aud-clock">00:00:00</div>
                         <div class="flex justify-center gap-2">
                            <button id="aud-btn-stop" class="p-2 bg-[#ffaa00]/10 rounded hover:bg-[#ffaa00]/20"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12"></rect></svg></button>
                            <button id="aud-btn-play" class="p-2 bg-[#ffaa00] text-black rounded hover:bg-[#ffcc00] shadow-[0_0_10px_rgba(255,170,0,0.5)]"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg></button>
                         </div>
                    </div>
                </div>

                <!-- Multi-track View -->
                <div class="flex-1 bg-[#050008] relative overflow-hidden flex flex-col">
                    <div id="aud-tracks-container" class="flex-1 overflow-y-auto overflow-x-hidden space-y-1 p-2 pt-8">
                         <!-- Multi-track waveform rows appear here -->
                         <div id="aud-empty-msg" class="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none">
                            <svg class="w-32 h-32 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19V6l12-3v13"></path></svg>
                            <span class="text-sm font-bold">DRAG AUDIO FILES HERE TO START MIXING</span>
                         </div>
                    </div>

                    <!-- Timeline Ruler -->
                    <div class="h-8 bg-[#160024] border-t border-[#ffaa00]/20 flex relative" id="aud-ruler">
                        <!-- Markers could go here -->
                    </div>

                    <!-- Global Playhead -->
                    <div id="aud-playhead" class="absolute top-0 bottom-0 left-0 w-[2px] bg-white z-[60] pointer-events-none hidden shadow-[0_0_10px_#fff]"></div>
                </div>
            </div>
        </div>

        <style>
            #aud-playhead {
                transition: left 0.1s linear;
            }
            .track-row {
                background: linear-gradient(90deg, #100018 0%, #0A0010 100%);
            }
            input[type='range'] {
                -webkit-appearance: none;
            }
            input[type='range']::-webkit-slider-thumb {
                -webkit-appearance: none;
                height: 12px;
                width: 12px;
                border-radius: 50%;
                background: #ffaa00;
                cursor: pointer;
            }
        </style>
    `;
}

export function init(container) {
    const fileInput = container.querySelector('#aud-file-input');
    const tracksContainer = container.querySelector('#aud-tracks-container');
    const emptyMsg = container.querySelector('#aud-empty-msg');
    const playBtn = container.querySelector('#aud-btn-play');
    const stopBtn = container.querySelector('#aud-btn-stop');
    const clock = container.querySelector('#aud-clock');
    const playhead = container.querySelector('#aud-playhead');
    const exportBtn = container.querySelector('#aud-export-btn');

    let tracks = []; // { id, name, wavesurfer, container, gainNode }
    let isPlaying = false;
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();

    fileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length) {
            emptyMsg.classList.add('hidden');
            for (const file of files) {
                createTrack(file);
            }
        }
    });

    function createTrack(file) {
        const trackId = Math.random().toString(36).substr(2, 9);
        
        // Track Row UI
        const row = document.createElement('div');
        row.className = 'track-row flex h-32 border border-[#ffaa00]/10 rounded overflow-hidden group';
        row.id = `track-${trackId}`;
        
        // Left Column: Controls
        const ctrl = document.createElement('div');
        ctrl.className = 'w-48 bg-[#160024] p-3 flex flex-col justify-between border-r border-[#ffaa00]/10';
        ctrl.innerHTML = `
            <div class="truncate">
                <span class="text-[10px] font-bold text-white">${file.name}</span>
            </div>
            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <button class="mute-btn text-[8px] px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded hover:bg-red-500/30">MUTE</button>
                    <button class="solo-btn text-[8px] px-2 py-1 bg-[#ffaa00]/10 text-[#ffaa00] border border-[#ffaa00]/20 rounded hover:bg-[#ffaa00]/30">SOLO</button>
                    <button class="remove-btn text-[8px] px-2 py-1 bg-white/5 text-white/40 border border-white/10 rounded hover:bg-red-500 hover:text-white transition-all">DEL</button>
                </div>
                <input type="range" class="vol-slider w-full accent-[#ffaa00] h-1" value="100">
            </div>
        `;

        // Right Column: Waveform
        const wave = document.createElement('div');
        wave.className = 'flex-1 relative cursor-pointer';
        
        row.appendChild(ctrl);
        row.appendChild(wave);
        tracksContainer.appendChild(row);

        // WaveSurfer Logic
        const ws = WaveSurfer.create({
            container: wave,
            waveColor: '#ffaa0055',
            progressColor: '#ffaa00',
            cursorColor: '#ffffff',
            barWidth: 2,
            barRadius: 3,
            responsive: true,
            height: 120,
            normalize: true,
            interact: true
        });

        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);

        // Load Audio
        ws.load(URL.createObjectURL(file));

        const trackData = {
            id: trackId,
            name: file.name,
            ws,
            gainNode,
            isMuted: false
        };

        tracks.push(trackData);

        // Event Handling for Track
        ctrl.querySelector('.vol-slider').addEventListener('input', (e) => {
            const val = e.target.value / 100;
            if (!trackData.isMuted) ws.setVolume(val);
        });

        ctrl.querySelector('.mute-btn').addEventListener('click', (e) => {
            trackData.isMuted = !trackData.isMuted;
            if (trackData.isMuted) {
                ws.setVolume(0);
                e.target.classList.add('bg-red-500', 'text-white');
            } else {
                ws.setVolume(ctrl.querySelector('.vol-slider').value / 100);
                e.target.classList.remove('bg-red-500', 'text-white');
            }
        });

        ctrl.querySelector('.remove-btn').addEventListener('click', () => {
            ws.destroy();
            row.remove();
            tracks = tracks.filter(t => t.id !== trackId);
            if (tracks.length === 0) {
                emptyMsg.classList.remove('hidden');
                stopAll();
            }
        });

        // Sync seeking
        ws.on('interaction', (newProgress) => {
            syncTracksToProgress(newProgress);
        });

        ws.on('audioprocess', (time) => {
             updateClock(time);
        });

        return trackData;
    }

    function syncTracksToProgress(progress) {
        tracks.forEach(t => {
            if (t.ws.isPlaying()) return; // don't jump while playing back-to-back
            t.ws.seekTo(progress);
        });
    }

    function updateClock(time) {
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60);
        const ms = Math.floor((time % 1) * 100);
        clock.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }

    playBtn.addEventListener('click', () => {
        if (tracks.length === 0) return;
        
        if (isPlaying) {
             pauseAll();
        } else {
             playAll();
        }
    });

    stopBtn.addEventListener('click', () => {
        stopAll();
    });

    function playAll() {
        isPlaying = true;
        playBtn.innerHTML = '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>';
        playhead.classList.remove('hidden');
        tracks.forEach(t => t.ws.play());
    }

    function pauseAll() {
        isPlaying = false;
        playBtn.innerHTML = '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>';
        tracks.forEach(t => t.ws.pause());
    }

    function stopAll() {
        pauseAll();
        tracks.forEach(t => t.ws.stop());
        updateClock(0);
        playhead.style.left = '0%';
    }

    exportBtn.addEventListener('click', async () => {
        if (tracks.length === 0) return;
        
        exportBtn.disabled = true;
        exportBtn.textContent = 'MIXING...';

        try {
            // Find maximum duration of the project
            let maxDuration = 0;
            tracks.forEach(t => {
                if (t.ws.getDuration() > maxDuration) maxDuration = t.ws.getDuration();
            });

            if (maxDuration === 0) throw new Error("No audio content found.");

            // Use the sample rate of the first track or default to 44.1kHz
            const sampleRate = tracks[0].ws.options.audioContext?.sampleRate || 44100;
            const offlineCtx = new OfflineAudioContext(2, sampleRate * maxDuration, sampleRate);

            for (const track of tracks) {
                const buffer = track.ws.getDecodedData();
                if (!buffer) continue;

                const source = offlineCtx.createBufferSource();
                source.buffer = buffer;

                const gainNode = offlineCtx.createGain();
                // Apply track-specific volume/mute settings
                gainNode.gain.value = track.isMuted ? 0 : track.ws.getVolume();

                source.connect(gainNode);
                gainNode.connect(offlineCtx.destination);
                source.start(0);
            }

            const renderedBuffer = await offlineCtx.startRendering();
            const wavBlob = bufferToWav(renderedBuffer);
            
            const url = URL.createObjectURL(wavBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mixed_master_${Date.now()}.wav`;
            a.click();
            URL.revokeObjectURL(url);

        } catch (err) {
            console.error("Export failed:", err);
            alert("Export failed: " + err.message);
        } finally {
            exportBtn.disabled = false;
            exportBtn.textContent = 'MIX & EXPORT';
        }
    });

    /**
     * Helper to encode AudioBuffer to WAV format
     */
    function bufferToWav(abuffer) {
        let numOfChan = abuffer.numberOfChannels,
            length = abuffer.length * numOfChan * 2 + 44,
            buffer = new ArrayBuffer(length),
            view = new DataView(buffer),
            channels = [], i, sample,
            offset = 0,
            pos = 0;

        function setUint16(data) {
            view.setUint16(pos, data, true);
            pos += 2;
        }
        function setUint32(data) {
            view.setUint32(pos, data, true);
            pos += 4;
        }

        // write WAVE header
        setUint32(0x46464952);                         // "RIFF"
        setUint32(length - 8);                         // file length - 8
        setUint32(0x45564157);                         // "WAVE"

        setUint32(0x20746d66);                         // "fmt " chunk
        setUint32(16);                                 // length = 16
        setUint16(1);                                  // PCM (uncompressed)
        setUint16(numOfChan);
        setUint32(abuffer.sampleRate);
        setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
        setUint16(numOfChan * 2);                      // block-align
        setUint16(16);                                 // 16-bit (hardcoded)

        setUint32(0x61746164);                         // "data" - chunk
        setUint32(length - pos - 4);                   // chunk length

        // write interleaved data
        for(i = 0; i < abuffer.numberOfChannels; i++)
            channels.push(abuffer.getChannelData(i));

        while(pos < length) {
            for(i = 0; i < numOfChan; i++) {             // interleave channels
                sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
                sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
                view.setInt16(pos, sample, true);          // write 16-bit sample
                pos += 2;
            }
            offset++                                     // next source sample
        }

        return new Blob([buffer], {type: "audio/wav"});
    }
}
