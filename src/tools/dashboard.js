export function render() {
  return `
        <div class="max-w-4xl mx-auto space-y-8">
            <!-- Hero Header -->
            <div class="bg-gradient-to-br from-[#160024] to-[#0A0010] border border-[#9d00ff]/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(157,0,255,0.1)] relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-10">
                    <svg class="w-32 h-32 text-[#9d00ff]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"></path></svg>
                </div>
                <h1 class="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome to <span class="text-[#9d00ff]">Pro Studio</span></h1>
                <p class="text-[#b388ff] text-lg max-w-xl">Your all-in-one local media workstation. All processing happens 100% on your device for maximum privacy and speed.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Recent Updates -->
                <div class="space-y-4">
                    <h2 class="text-sm font-bold text-[#9d00ff] uppercase tracking-widest flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        Recent Updates
                    </h2>
                    
                    <div class="space-y-3">
                        <div class="bg-[#160024]/50 border border-[#9d00ff]/10 p-4 rounded-xl hover:border-[#9d00ff]/30 transition-all">
                            <div class="flex justify-between items-start mb-1">
                                <h3 class="font-bold text-white text-sm">Pro Video Multi-track</h3>
                                <span class="text-[9px] bg-[#9d00ff]/20 text-[#9d00ff] px-2 py-0.5 rounded-full uppercase">v1.2</span>
                            </div>
                            <p class="text-xs text-[#b388ff]">Added a professional timeline with trimming, clip dragging, and multi-track audio multiplexing.</p>
                        </div>

                        <div class="bg-[#160024]/50 border border-[#9d00ff]/10 p-4 rounded-xl hover:border-[#9d00ff]/30 transition-all">
                            <div class="flex justify-between items-start mb-1">
                                <h3 class="font-bold text-white text-sm">Audio Production Suite</h3>
                                <span class="text-[9px] bg-[#ffaa00]/20 text-[#ffaa00] px-2 py-0.5 rounded-full uppercase">v1.1</span>
                            </div>
                            <p class="text-xs text-[#b388ff]">Launched the multi-track audio mixer with waveform synchronization and WAV master export.</p>
                        </div>

                        <div class="bg-[#160024]/50 border border-[#9d00ff]/10 p-4 rounded-xl hover:border-[#9d00ff]/30 transition-all">
                            <div class="flex justify-between items-start mb-1">
                                <h3 class="font-bold text-white text-sm">Pixl Studio Pro</h3>
                                <span class="text-[9px] bg-[#ff009d]/20 text-[#ff009d] px-2 py-0.5 rounded-full uppercase">v1.0</span>
                            </div>
                            <p class="text-xs text-[#b388ff]">Implemented Magic Wand cutout tools and AI-assisted background removal for images.</p>
                        </div>
                    </div>
                </div>

                <!-- Roadmap / Coming Soon -->
                <div class="space-y-4">
                    <h2 class="text-sm font-bold text-[#00ffcc] uppercase tracking-widest flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        What's Coming
                    </h2>

                    <div class="space-y-3">
                         <div class="bg-[#160024]/20 border border-dashed border-[#00ffcc]/20 p-4 rounded-xl">
                            <h3 class="font-bold text-white/50 text-sm mb-1 uppercase tracking-tighter">AI Voice Synthesis</h3>
                            <p class="text-xs text-[#b388ff]/40">Generating professional voiceovers directly within the video timeline via local model inference.</p>
                        </div>

                        <div class="bg-[#160024]/20 border border-dashed border-[#00ffcc]/20 p-4 rounded-xl">
                            <h3 class="font-bold text-white/50 text-sm mb-1 uppercase tracking-tighter">Vector Illustration</h3>
                            <p class="text-xs text-[#b388ff]/40">An SVG-based character creator for custom assets and stream overlays.</p>
                        </div>

                        <div class="bg-[#160024]/20 border border-dashed border-[#00ffcc]/20 p-4 rounded-xl">
                            <h3 class="font-bold text-white/50 text-sm mb-1 uppercase tracking-tighter">Collaborative Sync</h3>
                            <p class="text-xs text-[#b388ff]/40">Real-time room sessions for mixing music and editing projects with a team (coming Q4).</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar Pro Tip -->
            <div class="bg-[#00ffcc]/5 border border-[#00ffcc]/20 p-4 rounded-xl flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-[#00ffcc]/10 flex items-center justify-center text-[#00ffcc]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p class="text-[10px] text-[#00ffcc]/70 uppercase font-bold tracking-widest">Tip: Use the sidebar navigation to switch between production tools instantaneously.</p>
            </div>
        </div>
    `;
}

export function init(container) {
}
