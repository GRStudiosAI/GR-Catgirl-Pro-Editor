import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import JSZip from "jszip";

export function render() {
  return `
        <div class="w-full max-w-5xl mx-auto rounded-xl border border-[#9d00ff]/30 bg-[#0A0010] p-8 mt-4 shadow-[0_4px_30px_rgba(157,0,255,0.15)] flex flex-col gap-6">
            <h2 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#e0a6ff] to-[#9d00ff] mb-2 tracking-wider flex items-center gap-3">
                <svg class="w-8 h-8 text-[#9d00ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3v18"></path><path d="M10 8l7-5 7 5"></path><path d="M7 21V3"></path><path d="M14 16l-7 5-7-5"></path></svg>
                Universal Converter
            </h2>
            
            <div id="converter-setup-area" class="flex flex-col gap-6">
                <!-- Dropzone -->
                <div class="border-2 border-dashed border-[#9d00ff]/50 hover:border-[#ff009d] rounded-2xl bg-[#160024] flex flex-col items-center justify-center p-12 transition-colors relative group" id="conv-dropzone">
                    <input type="file" id="conv-file-input" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" multiple />
                    
                    <div class="w-24 h-24 rounded-full bg-[#9d00ff]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(157,0,255,0.2)]">
                        <svg class="w-12 h-12 text-[#9d00ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </div>
                    <div class="text-3xl text-white font-bold mb-2">Select Files</div>
                    <p class="text-[#e0a6ff] text-lg text-center font-medium">Drag & drop files here</p>
                    <p class="text-[#9d00ff]/60 text-sm mt-2 text-center">Video, Audio, Images supported</p>
                </div>
            </div>

            <div id="converter-list-area" class="hidden flex-col gap-6">
                <div class="flex justify-between items-center mb-2">
                    <div class="text-[#e0a6ff] font-bold">Files to convert</div>
                    <button id="conv-add-more" class="px-4 py-2 bg-[#160024] text-[#e0a6ff] hover:text-white rounded border border-[#9d00ff]/30 hover:border-[#9d00ff] transition-colors text-sm font-bold relative">
                        Add more files
                        <input type="file" id="conv-add-more-input" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" multiple />
                    </button>
                </div>
                
                <div id="conv-file-list" class="flex flex-col gap-4">
                    <!-- Files injected here -->
                </div>
                
                <div class="flex justify-between items-center mt-4 bg-[#160024] p-4 rounded-xl border border-[#9d00ff]/20">
                    <div class="flex items-center gap-4">
                        <select id="conv-global-format" class="bg-[#0A0010] border border-[#9d00ff]/50 text-white rounded p-2 focus:outline-none focus:border-[#ff009d]">
                            <option value="">Convert all to...</option>
                            <optgroup label="Video">
                                <option value="mp4">MP4</option>
                                <option value="mkv">MKV</option>
                                <option value="avi">AVI</option>
                                <option value="webm">WEBM</option>
                            </optgroup>
                            <optgroup label="Audio">
                                <option value="mp3">MP3</option>
                                <option value="wav">WAV</option>
                                <option value="aac">AAC</option>
                                <option value="ogg">OGG</option>
                            </optgroup>
                            <optgroup label="Image">
                                <option value="png">PNG</option>
                                <option value="jpg">JPG</option>
                                <option value="webp">WEBP</option>
                                <option value="gif">GIF</option>
                            </optgroup>
                        </select>
                    </div>
                    
                    <div class="flex items-center gap-4">
                        <button id="conv-download-all" class="px-6 py-3 bg-[#0A0010] border border-[#00ffcc]/50 text-[#00ffcc] hover:bg-[#00ffcc]/20 font-bold rounded-lg shadow-[0_0_15px_rgba(0,255,204,0.3)] transition-all hidden">
                            Download ZIP
                        </button>
                        <button id="conv-start-all" class="px-8 py-3 bg-[#9d00ff] hover:bg-[#ff009d] text-white font-bold rounded-lg shadow-[0_0_15px_rgba(157,0,255,0.4)] transition-all">
                            Convert All
                        </button>
                    </div>
                </div>
            </div>
            
        </div>
    `;
}

export function init(container) {
  const fileInput = document.getElementById("conv-file-input");
  const addMoreInput = document.getElementById("conv-add-more-input");
  const listArea = document.getElementById("converter-list-area");
  const fileListEl = document.getElementById("conv-file-list");
  const globalFormatSelect = document.getElementById("conv-global-format");
  const startAllBtn = document.getElementById("conv-start-all");
  const downloadAllBtn = document.getElementById("conv-download-all");

  let files = []; // Array of objects: { id, file, targetExt, state, resultBlob }
  let idCounter = 0;

  let ffmpeg = null;
  let ffmpegLoading = false;

  async function loadFFmpeg() {
    if (ffmpeg) return ffmpeg;
    if (ffmpegLoading) {
      while (ffmpegLoading) await new Promise((r) => setTimeout(r, 100));
      return ffmpeg;
    }
    ffmpegLoading = true;
    try {
      const instance = new FFmpeg();
      // Since we don't have COOP/COEP headers easily, we'll try to load from unpkg.
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await instance.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript",
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm",
        ),
      });
      ffmpeg = instance;
    } catch (e) {
      console.error("FFmpeg load generic error, trying without util: ", e);
      const instance = new FFmpeg();
      await instance.load(); // might fallback to defaults
      ffmpeg = instance;
    } finally {
      ffmpegLoading = false;
    }
    return ffmpeg;
  }

  async function toBlobURL(url, mimeType) {
    const resp = await fetch(url);
    const blob = await resp.blob();
    return URL.createObjectURL(new Blob([blob], { type: mimeType }));
  }

  function handleFiles(newFiles) {
    Array.from(newFiles).forEach((f) => {
      const ext = f.name.split(".").pop().toLowerCase();
      let defaultTarget = "mp4";
      if (f.type.startsWith("audio/")) defaultTarget = "mp3";
      else if (f.type.startsWith("image/")) defaultTarget = "png";

      files.push({
        id: idCounter++,
        file: f,
        targetExt: defaultTarget,
        state: "ready", // ready, converting, done, error
        resultBlob: null,
        progress: 0,
      });
    });

    renderList();
  }

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      listArea.classList.remove("hidden");
      listArea.classList.add("flex");
      handleFiles(e.target.files);
      e.target.value = "";
    }
  });

  addMoreInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  });

  globalFormatSelect.addEventListener("change", (e) => {
    const v = e.target.value;
    if (v) {
      files.forEach((f) => {
        if (f.state === "ready") f.targetExt = v;
      });
      renderList();
    }
  });

  startAllBtn.addEventListener("click", async () => {
    const readyFiles = files.filter((f) => f.state === "ready");
    if (readyFiles.length === 0) return;

    startAllBtn.disabled = true;
    startAllBtn.textContent = "Converting...";

    await loadFFmpeg(); // warm up

    for (const f of readyFiles) {
      await convertFile(f);
    }

    startAllBtn.disabled = false;
    startAllBtn.textContent = "Convert All";

    checkAllFinished();
  });

  downloadAllBtn.addEventListener("click", async () => {
    const doneFiles = files.filter((f) => f.state === "done" && f.resultBlob);
    if (doneFiles.length === 0) return;

    downloadAllBtn.textContent = "Zipping...";
    downloadAllBtn.disabled = true;

    const zip = new JSZip();
    doneFiles.forEach((f) => {
      const oldName = f.file.name.replace(/\.[^/.]+$/, "");
      zip.file(`${oldName}.${f.targetExt}`, f.resultBlob);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted_files.zip";
    a.click();
    URL.revokeObjectURL(url);

    downloadAllBtn.textContent = "Download ZIP";
    downloadAllBtn.disabled = false;
  });

  function checkAllFinished() {
    const doneCount = files.filter((f) => f.state === "done").length;
    if (
      doneCount > 0 &&
      doneCount ===
        files.filter((f) => f.state === "done" || f.state === "error").length
    ) {
      downloadAllBtn.classList.remove("hidden");
    } else {
      downloadAllBtn.classList.add("hidden");
    }
  }

  async function convertFile(f) {
    f.state = "converting";
    f.progress = 0;
    renderList();

    try {
      // Fast-path for images using Canvas
      if (
        f.file.type.startsWith("image/") &&
        ["jpg", "jpeg", "png", "webp"].includes(f.targetExt)
      ) {
        const img = new Image();
        const objUrl = URL.createObjectURL(f.file);
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = objUrl;
        });
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const mimeMap = {
          png: "image/png",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          webp: "image/webp",
        };

        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, mimeMap[f.targetExt], 0.9),
        );
        f.resultBlob = blob;
        f.state = "done";
        f.progress = 100;
        URL.revokeObjectURL(objUrl);
      } else {
        // Video, audio, or other conversions using FFmpeg
        const ff = await loadFFmpeg();
        const inName = `in_${f.id}_${f.file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
        const outName = `out_${f.id}.${f.targetExt}`;

        ff.on("progress", ({ progress }) => {
          f.progress = Math.round(progress * 100);
          const progEl = document.getElementById(`prog-${f.id}`);
          if (progEl) {
            progEl.style.width = `${Math.max(0, Math.min(100, f.progress))}%`;
          }
          const textEl = document.getElementById(`stat-${f.id}`);
          if (textEl) {
            textEl.textContent = `Converting... ${f.progress}%`;
          }
        });

        await ff.writeFile(inName, await fetchFile(f.file));

        let extraArgs = [];
        // Tweaks for standard conversions
        if (f.targetExt === "mp4")
          extraArgs = ["-c:v", "libx264", "-preset", "ultrafast"];
        if (f.targetExt === "mp3") extraArgs = ["-b:a", "192k"];

        await ff.exec(["-i", inName, ...extraArgs, outName]);

        const data = await ff.readFile(outName);
        f.resultBlob = new Blob([data.buffer]);
        f.state = "done";
        f.progress = 100;

        // Cleanup
        await ff.deleteFile(inName);
        await ff.deleteFile(outName);
      }
    } catch (e) {
      console.error(e);
      f.state = "error";
    }
    renderList();
  }

  // Attach delegated events for individual item actions
  fileListEl.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-id]");
    if (!btn) return;
    const id = parseInt(btn.dataset.id);
    const action = btn.dataset.action;
    const f = files.find((x) => x.id === id);

    if (action === "convert") {
      await convertFile(f);
      checkAllFinished();
    } else if (action === "download") {
      if (f.resultBlob) {
        const oldName = f.file.name.replace(/\.[^/.]+$/, "");
        const url = URL.createObjectURL(f.resultBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${oldName}.${f.targetExt}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } else if (action === "remove") {
      files = files.filter((x) => x.id !== id);
      if (files.length === 0) {
        listArea.classList.add("hidden");
        listArea.classList.remove("flex");
      }
      renderList();
    }
  });

  fileListEl.addEventListener("change", (e) => {
    const sel = e.target.closest("select[data-id]");
    if (!sel) return;
    const id = parseInt(sel.dataset.id);
    const f = files.find((x) => x.id === id);
    if (f) {
      f.targetExt = sel.value;
    }
  });

  function renderList() {
    fileListEl.innerHTML = files
      .map((f) => {
        const isReady = f.state === "ready";
        const isConverting = f.state === "converting";
        const isDone = f.state === "done";
        const isError = f.state === "error";

        return `
            <div class="bg-[#160024] rounded-lg border ${isDone ? "border-[#00ffcc]/50" : "border-[#9d00ff]/20"} p-4 flex items-center justify-between group overflow-hidden relative">
                ${isConverting ? `<div class="absolute top-0 left-0 h-1 bg-[#ff009d] transition-all duration-300" id="prog-${f.id}" style="width: ${f.progress}%"></div>` : ""}
                
                <!-- Left Details -->
                <div class="flex items-center gap-4 flex-1 truncate">
                    <div class="text-[#e0a6ff] w-8 flex-shrink-0 flex items-center justify-center">
                        ${
                          f.file.type.startsWith("video/")
                            ? '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>'
                            : f.file.type.startsWith("audio/")
                              ? '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>'
                              : '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
                        }
                    </div>
                    
                    <div class="truncate max-w-[200px]" title="${f.file.name}">
                        <span class="text-white font-medium">${f.file.name}</span>
                        <div class="text-xs text-[#b388ff] mt-1">${(f.file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                    
                    <span class="text-[#9d00ff] mx-4 font-bold flex-shrink-0">to</span>
                    
                    ${
                      isReady || isError
                        ? `
                    <select data-id="${f.id}" class="bg-[#0A0010] border border-[#9d00ff]/30 text-[#e0a6ff] rounded p-1.5 focus:outline-none focus:border-[#ff009d] text-sm w-24 flex-shrink-0">
                        <option value="mp4" ${f.targetExt === "mp4" ? "selected" : ""}>MP4</option>
                        <option value="mkv" ${f.targetExt === "mkv" ? "selected" : ""}>MKV</option>
                        <option value="webm" ${f.targetExt === "webm" ? "selected" : ""}>WEBM</option>
                        <option value="mp3" ${f.targetExt === "mp3" ? "selected" : ""}>MP3</option>
                        <option value="wav" ${f.targetExt === "wav" ? "selected" : ""}>WAV</option>
                        <option value="png" ${f.targetExt === "png" ? "selected" : ""}>PNG</option>
                        <option value="jpg" ${f.targetExt === "jpg" ? "selected" : ""}>JPG</option>
                        <option value="webp" ${f.targetExt === "webp" ? "selected" : ""}>WEBP</option>
                        <option value="gif" ${f.targetExt === "gif" ? "selected" : ""}>GIF</option>
                    </select>
                    `
                        : `
                    <span class="bg-[#0A0010] border border-[#ff009d]/30 text-[#ff009d] rounded py-1.5 px-3 font-bold text-sm">${f.targetExt.toUpperCase()}</span>
                    `
                    }
                </div>
                
                <!-- Right Status / Actions -->
                <div class="flex flex-shrink-0 items-center justify-end min-w-[200px]">
                    ${
                      isReady
                        ? `
                    <span class="text-[#9d00ff]/70 text-sm mr-4">Ready</span>
                    <button data-id="${f.id}" data-action="convert" class="bg-[#2a0044] hover:bg-[#9d00ff] text-white px-4 py-1.5 rounded transition-colors text-sm shadow-[0_0_10px_rgba(157,0,255,0.2)]">Convert</button>
                    `
                        : ""
                    }
                    
                    ${
                      isConverting
                        ? `
                    <span id="stat-${f.id}" class="text-yellow-400 text-sm font-mono mr-4">Converting... ${f.progress}%</span>
                    <div class="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    `
                        : ""
                    }
                    
                    ${
                      isDone
                        ? `
                    <span class="text-[#00ffcc] text-sm mr-4 flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        Finished
                    </span>
                    <button data-id="${f.id}" data-action="download" class="bg-green-600/30 border border-green-500/50 hover:bg-green-600/50 text-green-400 px-4 py-1.5 rounded transition-colors text-sm shadow-[0_0_10px_rgba(0,255,204,0.2)]">Download</button>
                    `
                        : ""
                    }
                    
                    ${
                      isError
                        ? `
                    <span class="text-red-500 text-sm mr-4">Error</span>
                    <button data-id="${f.id}" data-action="convert" class="bg-red-900/40 text-red-400 hover:text-white px-4 py-1.5 rounded transition-colors text-sm border border-red-500/30 border">Retry</button>
                    `
                        : ""
                    }
                    
                    ${
                      !isConverting
                        ? `
                    <button data-id="${f.id}" data-action="remove" class="text-[#9d00ff]/50 hover:text-red-400 ml-4 transition-colors focus:outline-none" title="Remove">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    `
                        : ""
                    }
                </div>
            </div>
            `;
      })
      .join("");
  }
}
