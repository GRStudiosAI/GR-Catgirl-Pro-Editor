export function render() {
  return `
        <div class="w-full max-w-4xl mx-auto rounded-xl border border-[#9d00ff]/30 bg-[#0A0010] p-8 mt-4 shadow-[0_4px_30px_rgba(157,0,255,0.15)] flex flex-col gap-6">
            <h2 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#e0a6ff] to-[#9d00ff] mb-2 tracking-wider">Icon Maker (.ico)</h2>
            
            <div class="flex flex-col md:flex-row gap-8">
                <!-- Dropzone -->
                <div class="flex-1 border-2 border-dashed border-[#9d00ff]/50 hover:border-[#ff009d] rounded-2xl bg-[#160024] flex flex-col items-center justify-center p-8 transition-colors min-h-[350px] relative group" id="icon-dropzone">
                    <input type="file" id="icon-file-input" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/png, image/jpeg, image/webp" />
                    
                    <div class="w-20 h-20 rounded-xl bg-[#9d00ff]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg class="w-10 h-10 text-[#9d00ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p class="text-[#e0a6ff] text-lg font-medium text-center">Drag & drop image</p>
                    <p class="text-[#9d00ff]/60 text-sm mt-2 text-center">PNG, JPG recommended</p>
                    
                    <!-- Preview Canvas container -->
                    <div id="icon-preview-container" class="absolute inset-0 bg-[#0A0010] rounded-2xl hidden flex flex-col items-center justify-center p-4">
                        <img id="icon-preview" class="max-w-full max-h-[80%] object-contain border border-[#9d00ff]/30 border-dashed rounded-md" />
                        <button id="icon-clear-btn" class="absolute top-4 right-4 bg-red-500/20 text-red-400 p-2 rounded-full hover:bg-red-500/40 z-20">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
                
                <!-- Controls -->
                <div class="flex-1 flex flex-col gap-6">
                    <div class="bg-[#160024] border border-[#9d00ff]/20 rounded-xl p-6">
                        <h3 class="text-[#e0a6ff] font-bold mb-4 font-sans tracking-tight">Icon Settings</h3>
                        
                        <div class="space-y-6">
                            <div>
                                <label class="text-xs text-[#9d00ff] font-bold block mb-2 uppercase tracking-wider">Included Sizes</label>
                                <div class="grid grid-cols-3 gap-2 text-[#e0a6ff] text-sm">
                                    <label class="flex items-center gap-2"><input type="checkbox" value="16" checked class="accent-[#9d00ff]"> 16x16</label>
                                    <label class="flex items-center gap-2"><input type="checkbox" value="32" checked class="accent-[#9d00ff]"> 32x32</label>
                                    <label class="flex items-center gap-2"><input type="checkbox" value="48" checked class="accent-[#9d00ff]"> 48x48</label>
                                    <label class="flex items-center gap-2"><input type="checkbox" value="64" checked class="accent-[#9d00ff]"> 64x64</label>
                                    <label class="flex items-center gap-2"><input type="checkbox" value="128" checked class="accent-[#9d00ff]"> 128x128</label>
                                    <label class="flex items-center gap-2"><input type="checkbox" value="256" checked class="accent-[#9d00ff]"> 256x256</label>
                                </div>
                            </div>
                            
                            <div class="bg-[#0A0010] rounded border border-[#9d00ff]/20 p-4">
                                <p class="text-xs text-[#9d00ff]/70 font-mono mb-1">Status</p>
                                <p id="icon-status-text" class="text-sm text-[#00ffcc]">Waiting for file...</p>
                            </div>
                            
                            <button id="icon-action-btn" class="w-full bg-[#9d00ff] hover:bg-[#ff009d] text-white font-bold py-4 rounded-lg shadow-[0_0_15px_rgba(157,0,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                GENERATE .ICO
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    `;
}

export function init(container) {
  const fileInput = document.getElementById("icon-file-input");
  const previewContainer = document.getElementById("icon-preview-container");
  const previewImage = document.getElementById("icon-preview");
  const clearBtn = document.getElementById("icon-clear-btn");
  const actionBtn = document.getElementById("icon-action-btn");
  const statusText = document.getElementById("icon-status-text");

  let currentImage = new Image();
  let currentFileName = "";

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    currentFileName = file.name.replace(/\.[^/.]+$/, "");

    statusText.textContent = `Loaded ${file.name}`;
    statusText.className = "text-sm text-[#00ffcc]";
    actionBtn.disabled = false;

    const url = URL.createObjectURL(file);

    currentImage.onload = () => {
      previewContainer.classList.remove("hidden");
      previewImage.src = url;
      URL.revokeObjectURL(url);
    };
    currentImage.src = url;
  });

  clearBtn.addEventListener("click", () => {
    fileInput.value = "";
    previewContainer.classList.add("hidden");
    actionBtn.disabled = true;
    statusText.textContent = "Waiting for file...";
    statusText.className = "text-sm text-[#00ffcc]";
    previewImage.src = "";
  });

  actionBtn.addEventListener("click", async () => {
    if (!currentImage.src) return;

    statusText.textContent = "Generating true .ico file...";
    statusText.className = "text-sm text-yellow-400 animate-pulse";
    actionBtn.disabled = true;

    const sizes = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked'),
    ).map((cb) => parseInt(cb.value));
    if (sizes.length === 0) {
      statusText.textContent = "Please select at least one size.";
      statusText.className = "text-sm text-red-500";
      actionBtn.disabled = false;
      return;
    }

    try {
      const pngBuffers = await Promise.all(
        sizes.map((size) => createResizedPngBuffer(currentImage, size)),
      );
      const icoBlob = generateIcoBlob(sizes, pngBuffers);

      downloadBlob(icoBlob, `${currentFileName || "icon"}.ico`);

      statusText.textContent = "Icon generated successfully!";
      statusText.className = "text-sm text-green-400";
    } catch (err) {
      console.error(err);
      statusText.textContent = "Error generating icon.";
      statusText.className = "text-sm text-red-500";
    }

    actionBtn.disabled = false;
  });

  function createResizedPngBuffer(img, size) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      // smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Maintain aspect ratio and center
      let scaledW = size;
      let scaledH = size;
      if (img.width > img.height) {
        scaledH = size * (img.height / img.width);
      } else {
        scaledW = size * (img.width / img.height);
      }
      const dx = (size - scaledW) / 2;
      const dy = (size - scaledH) / 2;

      ctx.drawImage(img, dx, dy, scaledW, scaledH);

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas to Blob failed"));
        blob.arrayBuffer().then(resolve).catch(reject);
      }, "image/png");
    });
  }

  function generateIcoBlob(sizes, pngBuffers) {
    // ICO Header length: 6 bytes
    // Directory Header length: 16 bytes per image
    const count = sizes.length;
    const headerSize = 6 + 16 * count;

    const totalSize =
      headerSize + pngBuffers.reduce((acc, buf) => acc + buf.byteLength, 0);
    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);
    const uint8View = new Uint8Array(buffer);

    // 1. Write Header
    view.setUint16(0, 0, true); // Reserved
    view.setUint16(2, 1, true); // Type: 1 for ICO
    view.setUint16(4, count, true); // Number of images

    let offset = headerSize;

    // 2. Write Directory and Image Data
    for (let i = 0; i < count; i++) {
      const size = sizes[i];
      const pngBuf = pngBuffers[i];
      const pngLen = pngBuf.byteLength;

      const dirPos = 6 + i * 16;

      // Directory Entry
      view.setUint8(dirPos, size === 256 ? 0 : size); // Width
      view.setUint8(dirPos + 1, size === 256 ? 0 : size); // Height
      view.setUint8(dirPos + 2, 0); // Color count (0 for 32bpp)
      view.setUint8(dirPos + 3, 0); // Reserved
      view.setUint16(dirPos + 4, 1, true); // Planes
      view.setUint16(dirPos + 6, 32, true); // Bits per pixel
      view.setUint32(dirPos + 8, pngLen, true); // Image data size
      view.setUint32(dirPos + 12, offset, true); // Image data offset

      // Write Image Data
      uint8View.set(new Uint8Array(pngBuf), offset);
      offset += pngLen;
    }

    return new Blob([buffer], { type: "image/x-icon" });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
