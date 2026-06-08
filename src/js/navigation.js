// Define navigation items
export const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
  },
  {
    id: "imageTool",
    label: "Image Tools",
    icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>',
  },
  {
    id: "gifTool",
    label: "GIF Tools",
    icon: '<rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect><path d="M12 12h.01"></path><path d="M16 12h.01"></path><path d="M8 12h.01"></path>',
  },
  {
    id: "videoTool",
    label: "Video Tools",
    icon: '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>',
  },
  {
    id: "audioTool",
    label: "Audio Tools",
    icon: '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>',
  },
  {
    id: "converterTool",
    label: "Converters",
    icon: '<path d="M17 3v18"></path><path d="M10 8l7-5 7 5"></path><path d="M7 21V3"></path><path d="M14 16l-7 5-7-5"></path>',
  },
  {
    id: "cropTool",
    label: "Circle Cropper",
    icon: '<circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 10 10"></path>',
  },
  {
    id: "iconTool",
    label: "Icon Maker",
    icon: '<path d="M12 2L2 22h20L12 2z"></path>',
  },
  {
    id: "settings",
    label: "Settings",
    icon: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
  },
];

export function renderNavigation() {
  const navMenu = document.querySelector("#nav-menu");
  if (!navMenu) return;

  navMenu.innerHTML = navItems
    .map(
      (item) => `
        <a href="#" class="nav-item w-12 h-12 mx-auto rounded-2xl flex items-center justify-center text-[#b388ff] hover:text-white hover:bg-[#9d00ff]/20 transition-all duration-200 group" data-tool="${item.id}" title="${item.label}">
            <svg class="w-6 h-6 stroke-current pointer-events-none" viewBox="0 0 24 24" fill="none" stroke-width="2">${item.icon}</svg>
        </a>
    `,
    )
    .join("");
}

export function initNavigation() {
  const navMenu = document.getElementById("nav-menu");
  const titleEl = document.getElementById("current-tool-title");
  const container = document.getElementById("tool-container");

  if (!navMenu) return;

  navMenu.addEventListener("click", async (e) => {
    const item = e.target.closest(".nav-item");
    if (!item) return;

    e.preventDefault();

    // Update active state
    document
      .querySelectorAll(".nav-item")
      .forEach((el) => el.classList.remove("active"));
    item.classList.add("active");

    const toolId = item.dataset.tool;
    const toolLabel = navItems.find((t) => t.id === toolId)?.label || "Tool";

    // Load content
    await loadTool(toolId, container);
  });
}

async function loadTool(toolId, container) {
  if (!container) return;

  // Show loading state
  container.innerHTML = `<div class="flex items-center justify-center p-12"><div class="animate-pulse text-[#9d00ff]">Loading ${toolId}...</div></div>`;

  try {
    let module;
    switch (toolId) {
      case "dashboard":
        module = await import("../tools/dashboard.js");
        break;
      case "imageTool":
        module = await import("../tools/imageTool.js");
        break;
      case "gifTool":
        module = await import("../tools/gifTool.js");
        break;
      case "videoTool":
        module = await import("../tools/videoTool.js");
        break;
      case "audioTool":
        module = await import("../tools/audioTool.js");
        break;
      case "converterTool":
        module = await import("../tools/converterTool.js");
        break;
      case "cropTool":
        module = await import("../tools/cropTool.js");
        break;
      case "iconTool":
        module = await import("../tools/iconTool.js");
        break;
      case "settings":
        module = await import("./settings.js");
        break;
      default:
        throw new Error("Module not found");
    }

    if (module && module.render) {
      container.innerHTML = module.render();
      if (module.init) {
        module.init(container);
      }
    }
  } catch (error) {
    console.error(`Failed to load tool ${toolId}:`, error);
    container.innerHTML = `
            <div class="text-red-500 p-6 bg-red-500/10 rounded-lg border border-red-500/30">
                <h3 class="text-lg font-bold mb-2">Error Loading Tool</h3>
                <p>Could not load the requested module. Check console for details.</p>
            </div>
        `;
  }
}
