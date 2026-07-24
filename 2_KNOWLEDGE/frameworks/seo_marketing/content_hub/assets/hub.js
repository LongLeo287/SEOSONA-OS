/**
 * Content Hub - Client-side JavaScript
 * Handles gallery rendering, filtering, search, actions, and AI editing
 */

(function() {
  'use strict';

  // State
  let assets = [];
  let brand = null;
  let currentAsset = null;
  let filterType = '';
  let searchQuery = '';
  let aiAvailable = false;
  let editorOriginalContent = '';

  // DOM Elements
  const elements = {
    grid: document.getElementById('asset-grid'),
    emptyState: document.getElementById('empty-state'),
    assetCount: document.getElementById('asset-count'),
    search: document.getElementById('search'),
    typeFilter: document.getElementById('type-filter'),
    rescanBtn: document.getElementById('rescan-btn'),
    generateBtn: document.getElementById('generate-btn'),
    brandSummary: document.getElementById('brand-summary'),
    colorPalette: document.getElementById('color-palette'),
    voiceTraits: document.getElementById('voice-traits'),
    modal: document.getElementById('preview-modal'),
    modalBackdrop: document.getElementById('modal-backdrop'),
    modalClose: document.getElementById('modal-close'),
    modalPreview: document.getElementById('modal-preview'),
    modalName: document.getElementById('modal-name'),
    modalPath: document.getElementById('modal-path'),
    modalMeta: document.getElementById('modal-meta'),
    actionEdit: document.getElementById('action-edit'),
    actionCopy: document.getElementById('action-copy'),
    actionR2: document.getElementById('action-r2'),
    toast: document.getElementById('toast'),
    // Editor modal
    editorModal: document.getElementById('editor-modal'),
    editorBackdrop: document.getElementById('editor-backdrop'),
    editorClose: document.getElementById('editor-close'),
    editorTitle: document.getElementById('editor-title'),
    editorContent: document.getElementById('editor-content'),
    editorPath: document.getElementById('editor-path'),
    enhanceInstruction: document.getElementById('enhance-instruction'),
    enhanceBtn: document.getElementById('enhance-btn'),
    editorCancel: document.getElementById('editor-cancel'),
    editorSave: document.getElementById('editor-save'),
    aiStatus: document.getElementById('ai-status'),
    aiStatusText: document.getElementById('ai-status-text')
  };

  // Editable file types
  const EDITABLE_FORMATS = ['md', 'txt', 'html', 'css', 'js', 'json', 'csv'];

  // Format icons by type
  const FORMAT_ICONS = {
    image: '🖼️',
    video: '🎬',
    document: '📄',
    design: '🎨',
    data: '📊',
    other: '📁'
  };

  // Initialize
  async function init() {
    await Promise.all([loadAssets(), loadBrand(), checkAIStatus()]);
    setupEventListeners();
    render();
  }

  // Check AI (Claude Code) availability
  async function checkAIStatus() {
    try {
      const res = await fetch('/api/ai/status');
      const data = await res.json();
      aiAvailable = data.available;
      updateAIStatusUI();
    } catch (err) {
      console.error('Failed to check AI status:', err);
      aiAvailable = false;
      updateAIStatusUI();
    }
  }

  // Update AI status indicator
  function updateAIStatusUI() {
    if (aiAvailable) {
      elements.aiStatus.classList.add('ready');
      elements.aiStatus.classList.remove('unavailable');
      elements.aiStatusText.textContent = 'AI Ready';
      elements.enhanceBtn.disabled = false;
    } else {
      elements.aiStatus.classList.add('unavailable');
      elements.aiStatus.classList.remove('ready');
      elements.aiStatusText.textContent = 'AI Unavailable';
      elements.enhanceBtn.disabled = true;
    }
  }

  // Load assets from API
  async function loadAssets() {
    try {
      const res = await fetch('/api/assets');
      const data = await res.json();
      assets = data.assets || [];
      elements.assetCount.textContent = `${assets.length} assets`;
    } catch (err) {
      console.error('Failed to load assets:', err);
      assets = [];
    }
  }

  // Load brand context
  async function loadBrand() {
    try {
      const res = await fetch('/api/brand');
      brand = await res.json();
      renderBrand();
    } catch (err) {
      console.error('Failed to load brand:', err);
      brand = null;
    }
  }

  // Render brand sidebar
  function renderBrand() {
    if (!brand || !brand.exists) {
      elements.brandSummary.textContent = 'No brand guidelines found. Run /marketing:init';
      elements.colorPalette.innerHTML = '';
      elements.voiceTraits.innerHTML = '';
      return;
    }

    elements.brandSummary.textContent = brand.summary;

    // Render colors
    const allColors = [
      ...brand.colors.primary,
      ...brand.colors.secondary,
      ...brand.colors.neutral
    ].slice(0, 10);

    elements.colorPalette.innerHTML = allColors.map(color => `
      <div class="color-swatch"
           style="background: ${color}"
           title="${color}"
           data-color="${color}">
      </div>
    `).join('');

    // Render voice traits
    elements.voiceTraits.innerHTML = brand.voice.traits.map(trait => `
      <span class="voice-tag">${trait}</span>
    `).join('');
  }

  // Filter assets
  function getFilteredAssets() {
    return assets.filter(asset => {
      // Type filter
      if (filterType && asset.category !== filterType) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return asset.name.toLowerCase().includes(query) ||
               asset.path.toLowerCase().includes(query) ||
               asset.tags.some(t => t.toLowerCase().includes(query));
      }

      return true;
    });
  }

  // Render asset grid
  function render() {
    const filtered = getFilteredAssets();

    if (filtered.length === 0) {
      elements.grid.innerHTML = '';
      elements.emptyState.style.display = 'block';
      return;
    }

    elements.emptyState.style.display = 'none';
    elements.grid.innerHTML = filtered.map(asset => renderAssetCard(asset)).join('');
  }

  // Render single asset card
  function renderAssetCard(asset) {
    const isImage = asset.formatType === 'image';
    const thumbContent = isImage
      ? `<img src="/file/${asset.path}" alt="${asset.name}" loading="lazy">`
      : `<span class="placeholder">${FORMAT_ICONS[asset.formatType] || FORMAT_ICONS.other}</span>`;

    const r2Status = asset.r2?.status || 'local';
    const r2Icon = r2Status === 'synced' ? '☁️' : r2Status === 'pending' ? '⏳' : '💾';

    return `
      <div class="asset-card" data-id="${asset.id}">
        <div class="asset-thumb">${thumbContent}</div>
        <div class="asset-info">
          <div class="asset-name" title="${asset.name}">${asset.name}</div>
          <div class="asset-meta">
            <span class="asset-type">${asset.category}</span>
            <span class="asset-r2 ${r2Status}">${r2Icon} ${r2Status}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Open asset modal
  function openModal(assetId) {
    currentAsset = assets.find(a => a.id === assetId);
    if (!currentAsset) return;

    const isImage = currentAsset.formatType === 'image';
    elements.modalPreview.innerHTML = isImage
      ? `<img src="/file/${currentAsset.path}" alt="${currentAsset.name}">`
      : `<span class="placeholder">${FORMAT_ICONS[currentAsset.formatType] || FORMAT_ICONS.other}</span>`;

    elements.modalName.textContent = currentAsset.name;
    elements.modalPath.textContent = currentAsset.path;

    const size = formatFileSize(currentAsset.size);
    const date = new Date(currentAsset.modifiedAt).toLocaleDateString();
    elements.modalMeta.innerHTML = `
      <span>${currentAsset.format.toUpperCase()}</span>
      <span>${size}</span>
      <span>Modified: ${date}</span>
    `;

    elements.modal.classList.add('active');
  }

  // Close modal
  function closeModal() {
    elements.modal.classList.remove('active');
    currentAsset = null;
  }

  // Check if file is editable
  function isEditable(asset) {
    return EDITABLE_FORMATS.includes(asset.format.toLowerCase());
  }

  // Open editor modal
  async function openEditor(asset) {
    currentAsset = asset;
    elements.editorTitle.textContent = `Edit: ${asset.name}`;
    elements.editorPath.textContent = asset.path;
    elements.editorContent.value = 'Loading...';
    elements.editorContent.disabled = true;
    elements.enhanceInstruction.value = '';

    // Close preview modal and open editor
    closeModal();
    elements.editorModal.classList.add('active');

    // Load file content
    try {
      const res = await fetch(`/api/file/read?path=${encodeURIComponent(asset.path)}`);
      const data = await res.json();
      if (data.success) {
        elements.editorContent.value = data.content;
        editorOriginalContent = data.content;
      } else {
        elements.editorContent.value = `Error: ${data.error}`;
      }
    } catch (err) {
      elements.editorContent.value = `Error loading file: ${err.message}`;
    }
    elements.editorContent.disabled = false;
  }

  // Close editor modal
  function closeEditor() {
    const hasChanges = elements.editorContent.value !== editorOriginalContent;
    if (hasChanges && !confirm('Discard unsaved changes?')) {
      return;
    }
    elements.editorModal.classList.remove('active');
    currentAsset = null;
    editorOriginalContent = '';
  }

  // Save file
  async function saveFile() {
    if (!currentAsset) return;

    elements.editorSave.classList.add('loading');
    elements.editorSave.disabled = true;

    try {
      const res = await fetch('/api/file/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: currentAsset.path,
          content: elements.editorContent.value
        })
      });

      const data = await res.json();
      if (data.success) {
        editorOriginalContent = elements.editorContent.value;
        showToast('File saved');
      } else {
        showToast('Save failed: ' + data.error);
      }
    } catch (err) {
      showToast('Save failed: ' + err.message);
    }

    elements.editorSave.classList.remove('loading');
    elements.editorSave.disabled = false;
  }

  // Enhance content with AI
  async function enhanceContent() {
    if (!currentAsset || !aiAvailable) return;

    const instruction = elements.enhanceInstruction.value.trim();
    if (!instruction) {
      showToast('Enter an instruction for AI');
      elements.enhanceInstruction.focus();
      return;
    }

    elements.enhanceBtn.classList.add('loading');
    elements.enhanceBtn.disabled = true;
    elements.editorContent.disabled = true;

    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: elements.editorContent.value,
          instruction: instruction,
          filePath: currentAsset.path
        })
      });

      const data = await res.json();
      if (data.success) {
        elements.editorContent.value = data.content;
        showToast('Content enhanced');
        elements.enhanceInstruction.value = '';
      } else {
        showToast('AI error: ' + data.error);
      }
    } catch (err) {
      showToast('AI error: ' + err.message);
    }

    elements.enhanceBtn.classList.remove('loading');
    elements.enhanceBtn.disabled = !aiAvailable;
    elements.editorContent.disabled = false;
  }

  // Show toast notification
  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => elements.toast.classList.remove('show'), 2000);
  }

  // Copy to clipboard
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // Rescan assets
  async function rescan() {
    elements.rescanBtn.disabled = true;
    try {
      await fetch('/api/scan', { method: 'POST' });
      await loadAssets();
      render();
      showToast('Assets rescanned');
    } catch (err) {
      showToast('Failed to rescan');
    }
    elements.rescanBtn.disabled = false;
  }

  // Setup event listeners
  function setupEventListeners() {
    // Search
    elements.search.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      render();
    });

    // Type filter
    elements.typeFilter.addEventListener('change', (e) => {
      filterType = e.target.value;
      render();
    });

    // Rescan
    elements.rescanBtn.addEventListener('click', rescan);

    // Generate new (copy command)
    elements.generateBtn.addEventListener('click', async () => {
      const cmd = '/design:generate "new marketing asset"';
      await copyToClipboard(cmd);
      showToast('Command copied: ' + cmd);
    });

    // Asset card click
    elements.grid.addEventListener('click', (e) => {
      const card = e.target.closest('.asset-card');
      if (card) {
        openModal(card.dataset.id);
      }
    });

    // Color swatch click
    elements.colorPalette.addEventListener('click', async (e) => {
      const swatch = e.target.closest('.color-swatch');
      if (swatch) {
        await copyToClipboard(swatch.dataset.color);
        showToast('Copied: ' + swatch.dataset.color);
      }
    });

    // Modal close
    elements.modalClose.addEventListener('click', closeModal);
    elements.modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Action: Edit in Claude
    elements.actionEdit.addEventListener('click', async () => {
      if (!currentAsset) return;
      // If file is editable, open in-app editor
      if (isEditable(currentAsset)) {
        openEditor(currentAsset);
      } else {
        // For non-editable files, copy command for Claude
        const cmd = `Edit the asset at ${currentAsset.path}`;
        await copyToClipboard(cmd);
        showToast('Command copied - paste in Claude');
        closeModal();
      }
    });

    // Action: Copy path
    elements.actionCopy.addEventListener('click', async () => {
      if (!currentAsset) return;
      await copyToClipboard(currentAsset.path);
      showToast('Path copied');
    });

    // Action: Upload R2 (disabled for now)
    elements.actionR2.addEventListener('click', () => {
      showToast('R2 upload coming soon');
    });

    // Editor modal events
    elements.editorClose.addEventListener('click', closeEditor);
    elements.editorBackdrop.addEventListener('click', closeEditor);
    elements.editorCancel.addEventListener('click', closeEditor);
    elements.editorSave.addEventListener('click', saveFile);
    elements.enhanceBtn.addEventListener('click', enhanceContent);

    // Enter key in enhance input triggers enhance
    elements.enhanceInstruction.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enhanceContent();
      }
    });

    // Escape closes editor
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.editorModal.classList.contains('active')) {
        closeEditor();
      }
    });

    // Ctrl/Cmd+S to save in editor
    elements.editorContent.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveFile();
      }
    });
  }

  // Start
  init();
})();
