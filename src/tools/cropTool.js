import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

export function render() {
  return `
        <style>
            .cropper-view-box,
            .cropper-face {
              border-radius: 50%;
            }
            .cropper-modal {
                background-color: rgba(10, 0, 16, 0.8) !important;
            }
        </style>
        <div class="w-full max-w-4xl mx-auto rounded-xl border border-[#9d00ff]/30 bg-[#0A0010] p-8 mt-4 shadow-[0_4px_30px_rgba(157,0,255,0.15)] flex flex-col gap-6">
            <h2 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#e0a6ff] to-[#9d00ff] mb-2 tracking-wider">Circle Cropper</h2>
            
            <div class="flex flex-col md:flex-row gap-8">
                <!-- Dropzone -->
                <div class="flex-1 border-2 border-dashed border-[#9d00ff]/50 hover:border-[#ff009d] rounded-2xl bg-[#160024] flex flex-col items-center justify-center p-8 transition-colors min-h-[350px] relative group" id="crop-dropzone">
                    <input type="file" id="crop-file-input" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/png, image/jpeg, image/gif, image/webp" />
                    
                    <div class="w-20 h-20 rounded-full bg-[#9d00ff]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg class="w-10 h-10 text-[#9d00ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </div>
                    <p class="text-[#e0a6ff] text-lg font-medium text-center">Drag & drop image or GIF</p>
                    <p class="text-[#9d00ff]/60 text-sm mt-2 text-center">Supports PNG, JPG, WEBP, GIF</p>
                    
                    <!-- Preview Canvas container -->
                    <div id="crop-preview-container" class="absolute inset-0 bg-[#0A0010] rounded-2xl hidden overflow-hidden z-20">
                        <img id="crop-image" class="block max-w-full max-h-full" />
                        <button id="crop-clear-btn" class="absolute top-4 right-4 bg-red-500/20 text-red-400 p-2 rounded-full hover:bg-red-500/40 z-30">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
                
                <!-- Controls -->
                <div class="flex-1 flex flex-col gap-6">
                    <div class="bg-[#160024] border border-[#9d00ff]/20 rounded-xl p-6">
                        <h3 class="text-[#e0a6ff] font-bold mb-4 font-sans tracking-tight">Crop Settings</h3>
                        
                        <div class="space-y-6">
                            <div>
                                <label class="text-xs text-[#9d00ff] font-bold block mb-2 uppercase tracking-wider">Output Format</label>
                                <select id="crop-format" class="w-full bg-[#0A0010] border border-[#9d00ff]/30 text-[#e0a6ff] rounded p-2 focus:outline-none focus:border-[#ff009d]">
                                    <option value="png">PNG (Static)</option>
                                    <option value="gif">GIF (Animated if source is GIF)</option>
                                </select>
                            </div>
                            
                            <div class="bg-[#0A0010] rounded border border-[#9d00ff]/20 p-4">
                                <p class="text-xs text-[#9d00ff]/70 font-mono mb-1">Status</p>
                                <p id="crop-status-text" class="text-sm text-[#00ffcc]">Waiting for file...</p>
                            </div>
                            
                            <button id="crop-action-btn" class="w-full bg-[#9d00ff] hover:bg-[#ff009d] text-white font-bold py-4 rounded-lg shadow-[0_0_15px_rgba(157,0,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                PROCESS AND DOWNLOAD
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    `;
}

export function init(container) {
  const fileInput = document.getElementById("crop-file-input");
  const previewContainer = document.getElementById("crop-preview-container");
  const cropImageEl = document.getElementById("crop-image");
  const clearBtn = document.getElementById("crop-clear-btn");
  const actionBtn = document.getElementById("crop-action-btn");
  const statusText = document.getElementById("crop-status-text");
  const formatSelect = document.getElementById("crop-format");

  let currentFile = null;
  let cropper = null;

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    currentFile = file;

    statusText.textContent = `Loaded ${file.name}`;
    statusText.className = "text-sm text-[#00ffcc]";
    actionBtn.disabled = false;

    if (cropper) {
      cropper.destroy();
      cropper = null;
    }

    const url = URL.createObjectURL(file);

    if (file.type === "image/gif") {
      formatSelect.value = "gif";
      statusText.textContent = `Loaded Animated GIF`;
    } else {
      formatSelect.value = "png";
    }

    cropImageEl.onload = () => {
      previewContainer.classList.remove("hidden");
      cropper = new Cropper(cropImageEl, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: "move",
        background: false,
        autoCropArea: 0.8,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
      });
    };
    cropImageEl.src = url;
  });

  clearBtn.addEventListener("click", () => {
    currentFile = null;
    fileInput.value = "";
    previewContainer.classList.add("hidden");
    actionBtn.disabled = true;
    statusText.textContent = "Waiting for file...";
    statusText.className = "text-sm text-[#00ffcc]";
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
    cropImageEl.src = "";
  });

  actionBtn.addEventListener("click", async () => {
    if (!currentFile || !cropper) return;

    statusText.textContent = "Processing... Please wait.";
    statusText.className = "text-sm text-yellow-400 animate-pulse";
    actionBtn.disabled = true;

    if (formatSelect.value === "gif" && currentFile.type === "image/gif") {
      await processGifCircle();
    } else {
      processStaticCircle();
    }
  });

  function processStaticCircle() {
    const croppedCanvas = cropper.getCroppedCanvas();
    if (!croppedCanvas) {
      statusText.textContent = "Error generating crop.";
      statusText.className = "text-sm text-red-500";
      actionBtn.disabled = false;
      return;
    }

    const size = croppedCanvas.width;
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = size;
    finalCanvas.height = size;
    const ctx = finalCanvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(croppedCanvas, 0, 0);

    finalCanvas.toBlob((blob) => {
      downloadBlob(
        blob,
        `circle_${currentFile.name.replace(/\.[^/.]+$/, "")}.png`,
      );
      statusText.textContent = "Crop successful!";
      statusText.className = "text-sm text-green-400";
      actionBtn.disabled = false;
    }, "image/png");
  }

  async function processGifCircle() {
    try {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js",
      );
      const { parseGIF, decompressFrames } = await import("gifuct-js");

      const buffer = await currentFile.arrayBuffer();
      const parsedGif = parseGIF(buffer);
      const frames = decompressFrames(parsedGif, true);

      if (!frames || frames.length === 0) throw new Error("No frames found.");

      const width = frames[0].dims.width;
      const height = frames[0].dims.height;
      const cropData = cropper.getData(true); // gets rounded integers for x, y, width, height
      const size = cropData.width;

      statusText.textContent = `Cropping ${frames.length} frames...`;

      let workerBlobUrl;
      try {
        const workerRes = await fetch(
          "https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js",
        );
        const workerText = await workerRes.text();
        const workerBlob = new Blob([workerText], {
          type: "application/javascript",
        });
        workerBlobUrl = URL.createObjectURL(workerBlob);
      } catch (e) {
        console.error("Failed to load worker script:", e);
      }

      const gif = new window.GIF({
        workers: 2,
        quality: 10,
        width: size,
        height: size,
        transparent: 0xff00ff,
        workerScript:
          workerBlobUrl ||
          "https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js",
      });

      // Create temporary canvas for composite frame
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext("2d");

      const prevCanvas = document.createElement("canvas");
      prevCanvas.width = width;
      prevCanvas.height = height;
      const prevCtx = prevCanvas.getContext("2d");

      const patchCanvas = document.createElement("canvas");

      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];

        if (i > 0) {
          const prevFrame = frames[i - 1];
          if (prevFrame.disposalType === 2) {
            tempCtx.clearRect(
              prevFrame.dims.left,
              prevFrame.dims.top,
              prevFrame.dims.width,
              prevFrame.dims.height,
            );
          } else if (prevFrame.disposalType === 3) {
            tempCtx.clearRect(0, 0, width, height);
            tempCtx.drawImage(prevCanvas, 0, 0);
          }
        }

        if (frame.disposalType === 3) {
          prevCtx.clearRect(0, 0, width, height);
          prevCtx.drawImage(tempCanvas, 0, 0);
        }

        patchCanvas.width = frame.dims.width;
        patchCanvas.height = frame.dims.height;
        const patchCtx = patchCanvas.getContext("2d");
        const imgData = new ImageData(
          new Uint8ClampedArray(frame.patch),
          frame.dims.width,
          frame.dims.height,
        );
        patchCtx.putImageData(imgData, 0, 0);

        tempCtx.drawImage(patchCanvas, frame.dims.left, frame.dims.top);

        // Now crop it according to Cropperjs data
        const outCanvas = document.createElement("canvas");
        outCanvas.width = size;
        outCanvas.height = size;
        const outCtx = outCanvas.getContext("2d");

        outCtx.drawImage(
          tempCanvas,
          cropData.x,
          cropData.y,
          cropData.width,
          cropData.height,
          0,
          0,
          size,
          size,
        );

        // Manually apply chroma key color to corners without antialiasing
        const outImgData = outCtx.getImageData(0, 0, size, size);
        const data = outImgData.data;
        const cx = size / 2;
        const cy = size / 2;
        const r2 = (size / 2) * (size / 2);

        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const dx = x + 0.5 - cx;
            const dy = y + 0.5 - cy;
            if (dx * dx + dy * dy > r2) {
              const i = (y * size + x) * 4;
              data[i] = 255;
              data[i + 1] = 0;
              data[i + 2] = 255;
              data[i + 3] = 255;
            }
          }
        }
        outCtx.putImageData(outImgData, 0, 0);

        gif.addFrame(outCanvas, { delay: frame.delay || 100 });
      }

      gif.on("progress", function (p) {
        statusText.textContent = `Encoding GIF... ${Math.round(p * 100)}%`;
      });

      gif.on("finished", function (blob) {
        downloadBlob(
          blob,
          `circle_${currentFile.name.replace(/\.[^/.]+$/, "")}.gif`,
        );
        statusText.textContent = "GIF encoding successful!";
        statusText.className = "text-sm text-green-400";
        actionBtn.disabled = false;
        if (workerBlobUrl) {
          URL.revokeObjectURL(workerBlobUrl);
        }
      });

      gif.render();
    } catch (error) {
      console.error(error);
      statusText.textContent =
        "GIF processing failed, exporting static frame as fallback.";
      processStaticCircle();
    }
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

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}
