export function render() {
  return `
        <div class="w-full max-w-4xl mx-auto rounded-xl border border-[#9d00ff]/30 bg-[#0A0010] overflow-hidden flex flex-col relative shadow-[0_4px_30px_rgba(157,0,255,0.15)] mt-4">
            
            <!-- Main Display Area -->
            <div class="flex-1 min-h-[300px] flex flex-col items-center justify-center p-8 pb-4 relative">
                <!-- Large Music Icon -->
                <div class="w-24 h-24 mb-6 text-[#9d00ff]/40 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full drop-shadow-[0_0_15px_rgba(157,0,255,0.5)]">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                </div>
                
                <p class="text-[#ff009d] text-sm font-semibold tracking-widest mb-4 uppercase drop-shadow-[0_0_5px_rgba(255,0,157,0.5)]">Now Playing</p>
                <h3 class="text-xl text-center text-white font-bold max-w-2xl px-4 leading-relaxed font-sans tracking-tight drop-shadow-md">
                    Dax - _Lonely Dirt Road_ (MEGA REMIX) [Feat. Thagreatwhite, Jerome Dillard, Carly Pearl, Thesanity].mp3
                </h3>
            </div>
            
            <!-- Controls Area -->
            <div class="p-6 pt-4">
                <!-- Progress Bar -->
                <div class="flex items-center gap-4 mb-8">
                    <span class="text-xs text-[#e0a6ff] font-mono tracking-wider">3:48</span>
                    <div class="flex-1 h-1.5 bg-[#2a0044] rounded-full relative cursor-pointer group hover:h-2 transition-all">
                        <div class="absolute left-0 top-0 h-full bg-[#9d00ff] rounded-full w-[65%] shadow-[0_0_8px_#9d00ff]"></div>
                        <div class="absolute left-[65%] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#e0a6ff] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#ff009d]"></div>
                    </div>
                    <span class="text-xs text-[#e0a6ff] font-mono tracking-wider">5:07</span>
                </div>
                
                <!-- Bottom Controls Row -->
                <div class="flex items-center justify-between">
                    <!-- Volume -->
                    <div class="flex items-center gap-3 w-[200px]">
                        <button class="text-[#b388ff] hover:text-white transition-colors focus:outline-none">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                        </button>
                        <div class="w-24 h-1 bg-[#2a0044] rounded-full relative cursor-pointer group hover:h-1.5 transition-all">
                            <div class="absolute left-0 top-0 h-full bg-[#b388ff] rounded-full w-[40%] group-hover:bg-[#e0a6ff]"></div>
                            <div class="absolute left-[40%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
                        </div>
                    </div>
                    
                    <!-- Playback Controls -->
                    <div class="flex items-center gap-4">
                        <button class="w-9 h-9 flex items-center justify-center rounded-full text-[#00ffcc] bg-[#00ffcc]/10 hover:bg-[#00ffcc]/20 transition-colors focus:outline-none" title="Shuffle">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="16 3 21 3 21 8"></polyline>
                                <line x1="4" y1="20" x2="21" y2="3"></line>
                                <polyline points="21 16 21 21 16 21"></polyline>
                                <line x1="15" y1="15" x2="21" y2="21"></line>
                                <line x1="4" y1="4" x2="9" y2="9"></line>
                            </svg>
                        </button>
                        
                        <button class="w-10 h-10 flex items-center justify-center rounded-full text-[#b388ff] bg-[#b388ff]/10 hover:bg-[#b388ff]/20 hover:text-white transition-colors focus:outline-none">
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 4L4 12l8 8V4zM20 4l-8 8 8 8V4z"/>
                            </svg>
                        </button>
                        
                        <button class="w-14 h-14 flex items-center justify-center rounded-full bg-[#9d00ff] text-white hover:scale-105 hover:bg-[#8a00e0] shadow-[0_0_15px_rgba(157,0,255,0.5)] transition-all focus:outline-none">
                           <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                           </svg>
                        </button>
                        
                        <button class="w-10 h-10 flex items-center justify-center rounded-full text-[#b388ff] bg-[#b388ff]/10 hover:bg-[#b388ff]/20 hover:text-white transition-colors focus:outline-none">
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 4l8 8-8 8V4zM4 4l8 8-8 8V4z"/>
                            </svg>
                        </button>
                        
                        <button class="w-9 h-9 flex items-center justify-center rounded-full text-[#00ffcc] bg-[#00ffcc]/10 hover:bg-[#00ffcc]/20 transition-colors focus:outline-none" title="Repeat">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="17 1 21 5 17 9"></polyline>
                                <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                                <polyline points="7 23 3 19 7 15"></polyline>
                                <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Right Controls (Speed, Fullscreen) -->
                    <div class="flex items-center gap-4 w-[200px] justify-end">
                        <div class="relative">
                            <select class="appearance-none bg-transparent border border-[#9d00ff]/30 text-xs text-[#e0a6ff] py-1 pl-3 pr-7 rounded focus:outline-none focus:border-[#9d00ff] font-mono cursor-pointer hover:bg-[#9d00ff]/10 transition-colors">
                                <option>1.0x</option>
                                <option>1.25x</option>
                                <option>1.5x</option>
                                <option>2.0x</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-[#b388ff]">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </div>
                        <button class="text-[#b388ff] hover:text-white transition-colors focus:outline-none">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function init() {}
