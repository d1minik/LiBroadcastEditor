document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    hideHeader: document.getElementById('hideHeader'),
    hideChat: document.getElementById('hideChat'),
    hideMoveTable: document.getElementById('hideMoveTable'),
    hideSide: document.getElementById('hideSide'),
    hideClocks: document.getElementById('hideClocks'),
    hideUnderboard: document.getElementById('hideUnderboard'),
    hideEval: document.getElementById('hideEval'),
    hideBoardCoords: document.getElementById('hideBoardCoords'),
    hideBoardResizeHandle: document.getElementById('hideBoardResizeHandle'),
    useCustomBoardColors: document.getElementById('useCustomBoardColors'),
    boardLightColor: document.getElementById('boardLightColor'),
    boardDarkColor: document.getElementById('boardDarkColor'),
    arrowPrimaryColor: document.getElementById('arrowPrimaryColor'),
    arrowSecondaryColor: document.getElementById('arrowSecondaryColor'),
    arrowTertiaryColor: document.getElementById('arrowTertiaryColor'),
    arrowQuaternaryColor: document.getElementById('arrowQuaternaryColor'),
    boardRadius: document.getElementById('boardRadius'),
    lastMoveColor: document.getElementById('lastMoveColor'),
    lastMoveOpacity: document.getElementById('lastMoveOpacity'),
    evalBarWidth: document.getElementById('evalBarWidth'),
    evalBarRadius: document.getElementById('evalBarRadius'),
    evalMarginLeft: document.getElementById('evalMarginLeft'),
    evalMarginRight: document.getElementById('evalMarginRight'),
    showEvalTicks: document.getElementById('showEvalTicks'),
    evalZeroColor: document.getElementById('evalZeroColor'),
    evalZeroOpacity: document.getElementById('evalZeroOpacity'),
    evalZeroThickness: document.getElementById('evalZeroThickness'),
    hideProfileBg: document.getElementById('hideProfileBg'),
    useCustomProfileBgColor: document.getElementById('useCustomProfileBgColor'),
    profileBgColor: document.getElementById('profileBgColor'),
    hidePhoto: document.getElementById('hidePhoto'),
    hideFlagOption: document.getElementById('hideFlagOption'),
    hideRatingOption: document.getElementById('hideRatingOption'),
    hideMaterial: document.getElementById('hideMaterial'),
    customPlayerOrder: document.getElementById('customPlayerOrder'),
    playerOrderGap12: document.getElementById('playerOrderGap12'),
    playerOrderGap23: document.getElementById('playerOrderGap23'),
    playerOrderGap34: document.getElementById('playerOrderGap34'),
    playerInfoLayout: document.getElementById('playerInfoLayout'),
    photoRadius: document.getElementById('photoRadius'),
    playerMargin: document.getElementById('playerMargin'),
    underboardMargin: document.getElementById('underboardMargin'),
    pageBgColor: document.getElementById('pageBgColor'),
    nameFont: document.getElementById('nameFont'),
    nameFontWeight: document.getElementById('nameFontWeight'),
    profileItemSize: document.getElementById('profileItemSize'),
    scaleTitle: document.getElementById('scaleTitle'),
    scaleName: document.getElementById('scaleName'),
    scaleRating: document.getElementById('scaleRating'),
    scaleFlag: document.getElementById('scaleFlag'),
    titleColor: document.getElementById('titleColor'),
    titleOpacity: document.getElementById('titleOpacity'),
    ratingColor: document.getElementById('ratingColor'),
    ratingOpacity: document.getElementById('ratingOpacity'),
    clockFont: document.getElementById('clockFont'),
    clockFontWeight: document.getElementById('clockFontWeight'),
    clockRadius: document.getElementById('clockRadius'),
    clockBorderColor: document.getElementById('clockBorderColor'),
    clockBorderOpacity: document.getElementById('clockBorderOpacity'),
    clockBorderWidth: document.getElementById('clockBorderWidth'),
    hideClockPauseIcon: document.getElementById('hideClockPauseIcon'),
    clockWhiteColor: document.getElementById('clockWhiteColor'),
    clockWhiteTextOpacity: document.getElementById('clockWhiteTextOpacity'),
    clockWhiteBgColor: document.getElementById('clockWhiteBgColor'),
    clockWhiteBgOpacity: document.getElementById('clockWhiteBgOpacity'),
    clockBlackColor: document.getElementById('clockBlackColor'),
    clockBlackTextOpacity: document.getElementById('clockBlackTextOpacity'),
    clockBlackBgColor: document.getElementById('clockBlackBgColor'),
    clockBlackBgOpacity: document.getElementById('clockBlackBgOpacity')
  };

  const resetButton = document.getElementById('resetProfileSizes');
  const playerOrderList = document.getElementById('playerOrderList');
  const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));
  const exportCssButton = document.getElementById('exportCssSettings');
  const importCssButton = document.getElementById('importCssSettings');
  const exportStandaloneCssButton = document.getElementById('exportStandaloneCss');
  const resetAllButton = document.getElementById('resetAllSettings');
  const importCssFileInput = document.getElementById('importCssFileInput');
  const useCustomProfileBgColorRow = document.getElementById('useCustomProfileBgColorRow');
  const profileBgColorRow = document.getElementById('profileBgColorRow');
  const playerInfoLayoutRow = document.getElementById('playerInfoLayoutRow');
  const playerInfoLayoutLockNotice = document.getElementById('playerInfoLayoutLockNotice');
  const fontStatusElements = {
    nameFont: document.getElementById('nameFontStatus'),
    clockFont: document.getElementById('clockFontStatus')
  };
  const fontPresetElements = {
    nameFont: document.getElementById('nameFontPreset'),
    clockFont: document.getElementById('clockFontPreset')
  };
  const fontWeightStatusElements = {
    nameFontWeight: document.getElementById('nameFontWeightStatus'),
    clockFontWeight: document.getElementById('clockFontWeightStatus')
  };

  const ORDER_ITEMS = ['title', 'name', 'flag', 'rating'];
  const ORDER_LABELS = {
    title: 'Title',
    name: 'Name',
    flag: 'Flag',
    rating: 'Rating'
  };
  const DEFAULT_ORDER = ORDER_ITEMS.join(',');
  const FONT_WEIGHT_BY_FONT_KEY = {
    nameFont: 'nameFontWeight',
    clockFont: 'clockFontWeight'
  };
  const FONT_WEIGHT_CONFIG = {
    nameFontWeight: {
      fontKey: 'nameFont',
      row: document.getElementById('nameFontWeightRow')
    },
    clockFontWeight: {
      fontKey: 'clockFont',
      row: document.getElementById('clockFontWeightRow')
    }
  };
  const FONT_WEIGHT_SAMPLE = 'Hamburgefonsiv 0123456789';

  let draggedItem = null;
  let cachedContentCssText = null;
  let layoutLockNoticeTimer = 0;
  let fontWeightMeasureRoot = null;

  const checkboxDefaultsTrue = new Set(['showEvalTicks', 'scaleTitle', 'scaleName', 'scaleRating', 'scaleFlag']);
  const FONT_INPUT_KEYS = new Set(['nameFont', 'clockFont']);
  const GENERIC_FONT_FAMILIES = new Set([
    'serif',
    'sans-serif',
    'monospace',
    'cursive',
    'fantasy',
    'system-ui',
    'emoji',
    'math',
    'fangsong',
    'ui-serif',
    'ui-sans-serif',
    'ui-monospace',
    'ui-rounded'
  ]);
  const FONT_PRESETS = [
    { label: 'Noto Sans', css: "'Noto Sans', sans-serif" },
    { label: 'Roboto', css: 'Roboto, sans-serif' },
    { label: 'System UI', css: "system-ui, -apple-system, 'Segoe UI', sans-serif" },
    { label: 'Arial', css: 'Arial, sans-serif' },
    { label: 'Verdana', css: 'Verdana, sans-serif' },
    { label: 'Trebuchet MS', css: "'Trebuchet MS', sans-serif" },
    { label: 'Tahoma', css: 'Tahoma, sans-serif' },
    { label: 'Times New Roman', css: "'Times New Roman', serif" },
    { label: 'Georgia', css: 'Georgia, serif' },
    { label: 'Courier New', css: "'Courier New', monospace" },
    { label: 'Lucida Console', css: "'Lucida Console', monospace" }
  ];

  const sanitizeOrderValue = (value) => {
    const list = String(value || '')
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter((item) => ORDER_ITEMS.includes(item));

    const unique = [];
    for (const item of list) {
      if (!unique.includes(item)) unique.push(item);
    }
    for (const item of ORDER_ITEMS) {
      if (!unique.includes(item)) unique.push(item);
    }
    return unique;
  };

  const stripMatchingQuotes = (value) => {
    const trimmed = String(value || '').trim();
    if (!trimmed) return '';

    const firstChar = trimmed[0];
    const lastChar = trimmed[trimmed.length - 1];
    if ((firstChar === '"' || firstChar === "'") && firstChar === lastChar) {
      return trimmed.slice(1, -1).trim();
    }

    return trimmed;
  };

  const parseFontFamilies = (value) => {
    const input = String(value || '');
    const families = [];
    let current = '';
    let quote = '';

    for (const char of input) {
      if (char === '"' || char === "'") {
        if (quote === char) {
          quote = '';
        } else if (!quote) {
          quote = char;
        }
        current += char;
        continue;
      }

      if (char === ',' && !quote) {
        const family = stripMatchingQuotes(current);
        if (family) families.push(family);
        current = '';
        continue;
      }

      current += char;
    }

    const trailingFamily = stripMatchingQuotes(current);
    if (trailingFamily) families.push(trailingFamily);
    return families;
  };

  const normalizeFontLabel = (value) => stripMatchingQuotes(value).replace(/\s+/g, ' ').toLowerCase();
  const normalizeFontStack = (value) =>
    parseFontFamilies(value)
      .map((family) => family.replace(/\s+/g, ' ').toLowerCase())
      .join(',');

  const fontPresetByLabel = new Map(FONT_PRESETS.map((preset) => [normalizeFontLabel(preset.label), preset]));
  const fontPresetByStack = new Map(FONT_PRESETS.map((preset) => [normalizeFontStack(preset.css), preset]));
  const fontWeightSupportCache = new Map();

  const resolveFontSetting = (value) => {
    const rawValue = String(value || '').trim();
    if (!rawValue) {
      return { label: '', css: '', preferredFamily: '' };
    }

    const preset = fontPresetByLabel.get(normalizeFontLabel(rawValue)) || fontPresetByStack.get(normalizeFontStack(rawValue));
    if (preset) {
      return {
        label: preset.label,
        css: preset.css,
        preferredFamily: parseFontFamilies(preset.css)[0] || ''
      };
    }

    const families = parseFontFamilies(rawValue);
    const preferredFamily = families.find((family) => !GENERIC_FONT_FAMILIES.has(family.toLowerCase())) || families[0] || '';
    return {
      label: rawValue,
      css: rawValue,
      preferredFamily
    };
  };

  const canonicalizeFontSetting = (value) => resolveFontSetting(value).label;
  const formatFontSettingForUi = (value) => resolveFontSetting(value).label;
  const resolveFontCssValue = (value) => resolveFontSetting(value).css;

  const isFontInstalled = (family) => {
    if (!family || GENERIC_FONT_FAMILIES.has(family.toLowerCase())) return true;
    if (!document.fonts || typeof document.fonts.check !== 'function') return true;

    try {
      const escapedFamily = family.replace(/["\\]/g, '\\$&');
      return document.fonts.check(`16px "${escapedFamily}"`);
    } catch (error) {
      return true;
    }
  };

  const ensureFontWeightMeasureRoot = () => {
    if (fontWeightMeasureRoot) return fontWeightMeasureRoot;
    const root = document.createElement('div');
    root.style.position = 'absolute';
    root.style.visibility = 'hidden';
    root.style.pointerEvents = 'none';
    root.style.inset = '0 auto auto -9999px';
    root.style.whiteSpace = 'pre';
    document.body.appendChild(root);
    fontWeightMeasureRoot = root;
    return fontWeightMeasureRoot;
  };

  const measureFontWeightWidth = (family, weight) => {
    const root = ensureFontWeightMeasureRoot();
    const probe = document.createElement('span');
    probe.textContent = FONT_WEIGHT_SAMPLE;
    probe.style.fontFamily = `"${family.replace(/["\\]/g, '\\$&')}", monospace`;
    probe.style.fontWeight = String(weight);
    probe.style.fontSize = '32px';
    probe.style.letterSpacing = '0';
    probe.style.lineHeight = '1';
    probe.style.fontSynthesis = 'none';
    root.appendChild(probe);
    const width = probe.getBoundingClientRect().width;
    probe.remove();
    return width;
  };

  const fontSupportsMultipleWeights = (family) => {
    if (!family) return true;
    const normalizedFamily = normalizeFontLabel(family);
    if (!normalizedFamily || GENERIC_FONT_FAMILIES.has(normalizedFamily)) return true;
    if (fontWeightSupportCache.has(normalizedFamily)) {
      return fontWeightSupportCache.get(normalizedFamily);
    }
    if (!isFontInstalled(family)) {
      fontWeightSupportCache.set(normalizedFamily, false);
      return false;
    }

    const measuredWidths = ['300', '400', '500', '700'].map((weight) => measureFontWeightWidth(family, weight));
    const supportsMultipleWeights = measuredWidths.some((width, index) =>
      measuredWidths.slice(index + 1).some((otherWidth) => Math.abs(width - otherWidth) > 0.25)
    );
    fontWeightSupportCache.set(normalizedFamily, supportsMultipleWeights);
    return supportsMultipleWeights;
  };

  const updateFontAvailabilityState = (key) => {
    const input = elements[key];
    const status = fontStatusElements[key];
    if (!input || !status) return;

    const resolvedFont = resolveFontSetting(input.value);
    const { css, preferredFamily } = resolvedFont;

    if (!css || !preferredFamily || isFontInstalled(preferredFamily)) {
      input.classList.remove('font-missing');
      status.textContent = '';
      return;
    }

    input.classList.add('font-missing');
    status.textContent = `${preferredFamily} is not installed on this system, so a fallback font will be used.`;
  };

  const syncFontPresetSelection = (key) => {
    const input = elements[key];
    const select = fontPresetElements[key];
    if (!input || !select) return;

    const label = formatFontSettingForUi(input.value);
    if (!label) {
      select.value = '';
      return;
    }

    const preset = fontPresetByLabel.get(normalizeFontLabel(label));
    select.value = preset ? preset.label : '__custom__';
  };

  const updateFontWeightControlState = (weightKey) => {
    const config = FONT_WEIGHT_CONFIG[weightKey];
    const control = elements[weightKey];
    const status = fontWeightStatusElements[weightKey];
    if (!config || !control || !status) return;

    const fontValue = elements[config.fontKey] ? elements[config.fontKey].value : '';
    const { css, preferredFamily } = resolveFontSetting(fontValue);

    let enabled = true;
    let reason = '';
    if (css) {
      if (!preferredFamily || !isFontInstalled(preferredFamily)) {
        enabled = false;
        reason = 'Weight options stay inactive until the selected font is available locally.';
      } else if (!fontSupportsMultipleWeights(preferredFamily)) {
        enabled = false;
        reason = `${preferredFamily} does not expose multiple weights on this system.`;
      }
    }

    if (enabled) {
      if (control.dataset.manualValue && !control.value) {
        control.value = control.dataset.manualValue;
      }
      delete control.dataset.manualValue;
      control.disabled = false;
      control.removeAttribute('title');
      status.textContent = '';
      if (config.row) config.row.classList.remove('is-disabled');
      return;
    }

    if (!control.dataset.manualValue) {
      control.dataset.manualValue = control.value;
    }
    control.value = '';
    control.disabled = true;
    control.title = reason;
    status.textContent = reason;
    if (config.row) config.row.classList.add('is-disabled');
  };

  const updateAllFontUiStates = () => {
    for (const key of FONT_INPUT_KEYS) {
      syncFontPresetSelection(key);
      updateFontAvailabilityState(key);
      const weightKey = FONT_WEIGHT_BY_FONT_KEY[key];
      if (weightKey) updateFontWeightControlState(weightKey);
    }
  };

  const renderOrderList = (value) => {
    const order = sanitizeOrderValue(value);
    const fragment = document.createDocumentFragment();

    for (const item of order) {
      const li = document.createElement('li');
      li.className = 'order-item';
      li.draggable = true;
      li.dataset.orderItem = item;
      li.textContent = ORDER_LABELS[item];
      fragment.appendChild(li);
    }

    playerOrderList.innerHTML = '';
    playerOrderList.appendChild(fragment);
  };

  const getOrderValue = () => {
    const items = Array.from(playerOrderList.querySelectorAll('.order-item'));
    const values = items.map((item) => item.dataset.orderItem).filter((item) => ORDER_ITEMS.includes(item));
    return sanitizeOrderValue(values.join(',')).join(',');
  };

  const getDragAfterElement = (container, y) => {
    const draggableElements = Array.from(container.querySelectorAll('.order-item:not(.dragging)'));
    let closest = null;

    for (const element of draggableElements) {
      const box = element.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && (!closest || offset > closest.offset)) {
        closest = { offset, element };
      }
    }

    return closest ? closest.element : null;
  };

  const wireOrderDnD = () => {
    if (!playerOrderList) return;

    playerOrderList.addEventListener('dragstart', (event) => {
      const item = event.target.closest('.order-item');
      if (!item) return;
      draggedItem = item;
      item.classList.add('dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', item.dataset.orderItem || '');
    });

    playerOrderList.addEventListener('dragover', (event) => {
      event.preventDefault();
      if (!draggedItem) return;
      const afterElement = getDragAfterElement(playerOrderList, event.clientY);
      if (afterElement) {
        playerOrderList.insertBefore(draggedItem, afterElement);
      } else {
        playerOrderList.appendChild(draggedItem);
      }
    });

    playerOrderList.addEventListener('drop', (event) => {
      event.preventDefault();
    });

    playerOrderList.addEventListener('dragend', () => {
      if (draggedItem) draggedItem.classList.remove('dragging');
      draggedItem = null;
      saveAndNotify();
    });
  };

  const activateTab = (tabId) => {
    tabButtons.forEach((button) => {
      const isActive = button.dataset.tabTarget === tabId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.tabPanel === tabId);
    });

    localStorage.setItem('bcPopupActiveTab', tabId);
  };

  if (tabButtons.length && tabPanels.length) {
    const storedTab = localStorage.getItem('bcPopupActiveTab');
    const defaultTab = tabButtons[0].dataset.tabTarget;
    const initialTab = tabButtons.some((button) => button.dataset.tabTarget === storedTab) ? storedTab : defaultTab;
    activateTab(initialTab);

    tabButtons.forEach((button) => {
      button.addEventListener('click', () => activateTab(button.dataset.tabTarget));
    });
  }

  const updateSliderLabels = () => {
    for (const key in elements) {
      if (elements[key].type === 'range') {
        const valLabel = document.getElementById(key + 'Val');
        if (valLabel) valLabel.textContent = elements[key].value;
      }
    }
  };

  const syncCustomOrderLayoutLock = () => {
    if (!elements.playerInfoLayout || !elements.customPlayerOrder) return;
    const customEnabled = Boolean(elements.customPlayerOrder.checked);
    if (customEnabled) {
      if (!elements.playerInfoLayout.dataset.manualValue) {
        elements.playerInfoLayout.dataset.manualValue = elements.playerInfoLayout.value;
      }
      elements.playerInfoLayout.value = 'inline';
      elements.playerInfoLayout.disabled = true;
      elements.playerInfoLayout.title = 'Disable "Custom Item Order" to switch back to "Below Name".';
      if (playerInfoLayoutRow) playerInfoLayoutRow.classList.add('is-locked', 'is-disabled');
    } else {
      if (elements.playerInfoLayout.dataset.manualValue) {
        elements.playerInfoLayout.value = elements.playerInfoLayout.dataset.manualValue;
        delete elements.playerInfoLayout.dataset.manualValue;
      }
      elements.playerInfoLayout.disabled = false;
      elements.playerInfoLayout.removeAttribute('title');
      if (playerInfoLayoutRow) playerInfoLayoutRow.classList.remove('is-locked', 'is-disabled');
      if (playerInfoLayoutLockNotice) {
        playerInfoLayoutLockNotice.classList.remove('is-visible');
        playerInfoLayoutLockNotice.textContent = '';
      }
    }
  };

  const showPlayerInfoLayoutLockNotice = () => {
    if (!playerInfoLayoutLockNotice || !elements.playerInfoLayout || !elements.playerInfoLayout.disabled) return;
    playerInfoLayoutLockNotice.textContent = 'Disable "Custom Item Order" if you want to switch this dropdown back to "Below Name".';
    playerInfoLayoutLockNotice.classList.add('is-visible');
    if (layoutLockNoticeTimer) clearTimeout(layoutLockNoticeTimer);
    layoutLockNoticeTimer = window.setTimeout(() => {
      playerInfoLayoutLockNotice.classList.remove('is-visible');
      playerInfoLayoutLockNotice.textContent = '';
    }, 2600);
  };

  const syncProfileBackgroundControls = () => {
    if (!elements.hideProfileBg || !elements.useCustomProfileBgColor || !elements.profileBgColor) return;

    const profileHidden = Boolean(elements.hideProfileBg.checked);
    const customColorEnabled = Boolean(elements.useCustomProfileBgColor.checked);

    elements.useCustomProfileBgColor.disabled = profileHidden;
    elements.profileBgColor.disabled = profileHidden || !customColorEnabled;

    if (useCustomProfileBgColorRow) {
      useCustomProfileBgColorRow.classList.toggle('is-disabled', profileHidden);
    }
    if (profileBgColorRow) {
      profileBgColorRow.classList.toggle('is-disabled', profileHidden || !customColorEnabled);
    }
  };

  const collectSettingsFromUi = () => {
    syncCustomOrderLayoutLock();
    syncProfileBackgroundControls();
    const settings = {};
    for (const key in elements) {
      if (elements[key].type === 'checkbox') {
        settings[key] = elements[key].checked;
      } else if (FONT_INPUT_KEYS.has(key)) {
        settings[key] = canonicalizeFontSetting(elements[key].value);
      } else {
        settings[key] = elements[key].value;
      }
    }
    if (elements.playerInfoLayout) {
      settings.playerInfoLayout = elements.playerInfoLayout.dataset.manualValue || elements.playerInfoLayout.value;
    }
    settings.playerOrderList = getOrderValue();
    return settings;
  };

  const getDefaultSettings = () => {
    const defaults = {};
    for (const key in elements) {
      if (elements[key].type === 'checkbox') {
        defaults[key] = checkboxDefaultsTrue.has(key);
      } else if (typeof elements[key].defaultValue !== 'undefined') {
        defaults[key] = elements[key].defaultValue;
      } else {
        defaults[key] = elements[key].value;
      }
    }
    defaults.playerOrderList = DEFAULT_ORDER;
    return defaults;
  };

  const applySettingsToUi = (settings) => {
    for (const key in elements) {
      if (settings[key] === undefined) continue;
      if (elements[key].type === 'checkbox') {
        elements[key].checked = Boolean(settings[key]);
      } else if (FONT_INPUT_KEYS.has(key)) {
        elements[key].value = formatFontSettingForUi(settings[key]);
      } else {
        elements[key].value = String(settings[key]);
      }
    }

    if (settings.playerOrderList !== undefined) {
      renderOrderList(settings.playerOrderList);
    }

    syncCustomOrderLayoutLock();
    syncProfileBackgroundControls();
    updateSliderLabels();
    updateAllFontUiStates();
  };

  const toCssSettingName = (key) => key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
  const fromCssSettingName = (key) => key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

  const serializeCssSettingValue = (key, value) => {
    if (typeof value === 'boolean') return value ? '1' : '0';
    if (key === 'playerOrderList') return JSON.stringify(sanitizeOrderValue(value).join(','));
    return JSON.stringify(String(value));
  };

  const parseQuotedValue = (rawValue) => {
    const value = rawValue.trim();
    if (!value) return '';

    if (value.startsWith('"')) {
      try {
        return JSON.parse(value);
      } catch (error) {
        return value.slice(1, -1);
      }
    }

    if (value.startsWith("'") && value.endsWith("'")) {
      return value.slice(1, -1).replace(/\\'/g, "'");
    }

    return value;
  };

  const parseBooleanSetting = (rawValue) => {
    const normalized = parseQuotedValue(rawValue).trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
    return null;
  };

  const buildCssExportText = (settings) => {
    const now = new Date();
    const lines = [
      '/* LiBroadcastEditor Settings Export */',
      `/* Generated: ${now.toISOString()} */`,
      ':root {'
    ];

    const sortedKeys = Object.keys(settings).sort();
    for (const key of sortedKeys) {
      lines.push(`  --bc-setting-${toCssSettingName(key)}: ${serializeCssSettingValue(key, settings[key])};`);
    }

    lines.push('}');
    lines.push('');
    return lines.join('\n');
  };

  const parseNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const parseOpacityPercent = (value, fallbackPercent) => {
    return clamp(parseNumber(value, fallbackPercent), 0, 100);
  };

  const parseHexColor = (value) => {
    if (typeof value !== 'string') return null;
    let hex = value.trim();
    if (!hex.startsWith('#')) return null;
    hex = hex.slice(1);

    if (hex.length === 3 || hex.length === 4) {
      hex = hex.split('').map((char) => char + char).join('');
    }

    if (hex.length !== 6 && hex.length !== 8) return null;

    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    if ([r, g, b].some((channel) => Number.isNaN(channel))) return null;
    return { r, g, b };
  };

  const colorWithOpacity = (color, opacityValue, fallbackColor, fallbackOpacityValue = 100) => {
    const parsedColor = parseHexColor(color) || parseHexColor(fallbackColor);
    if (!parsedColor) return fallbackColor;
    const alpha = parseOpacityPercent(opacityValue, fallbackOpacityValue) / 100;
    return `rgba(${parsedColor.r}, ${parsedColor.g}, ${parsedColor.b}, ${alpha})`;
  };

  const buildRuntimeCssVariables = (settings) => {
    const defaults = getDefaultSettings();
    const vars = {};
    const setVar = (name, value) => {
      if (value === undefined || value === null || value === '') return;
      vars[name] = value;
    };

    const defaultEvalWidth = parseNumber(defaults.evalBarWidth, 15);
    const evalWidth = parseNumber(settings.evalBarWidth, defaultEvalWidth);
    const evalRadius = Math.max(0, parseNumber(settings.evalBarRadius, parseNumber(defaults.evalBarRadius, 0)));
    const evalMarginLeft = Math.max(0, parseNumber(settings.evalMarginLeft, parseNumber(defaults.evalMarginLeft, 0)));
    const evalMarginRight = Math.max(0, parseNumber(settings.evalMarginRight, parseNumber(defaults.evalMarginRight, 0)));
    const evalZeroThickness = Math.max(1, parseNumber(settings.evalZeroThickness, parseNumber(defaults.evalZeroThickness, 7)));
    const underboardMargin = Math.max(0, parseNumber(settings.underboardMargin, parseNumber(defaults.underboardMargin, 0)));
    const evalToolsShift = settings.hideEval
      ? 0
      : Math.max(0, (evalWidth - defaultEvalWidth) + evalMarginLeft + evalMarginRight);

    const baseSize = parseNumber(settings.profileItemSize, parseNumber(defaults.profileItemSize, 14));
    const emSize = baseSize / 14;
    const resolvedNameFont = resolveFontCssValue(settings.nameFont);
    const resolvedClockFont = resolveFontCssValue(settings.clockFont);

    setVar('--bc-page-bg', settings.pageBgColor || defaults.pageBgColor);
    setVar('--bc-display-header', settings.hideHeader ? 'none' : 'flex');
    setVar('--bc-display-liveboard', settings.hideChat ? 'none' : 'flex');
    setVar('--bc-display-move-table', settings.hideMoveTable ? 'none' : 'flex');
    setVar('--bc-display-side', settings.hideSide ? 'none' : 'flex');
    setVar('--bc-display-clocks', settings.hideClocks ? 'none' : 'flex');
    setVar('--bc-display-underboard', settings.hideUnderboard ? 'none' : 'block');
    setVar('--bc-display-eval', settings.hideEval ? 'none' : 'block');
    setVar('--bc-display-board-coords', settings.hideBoardCoords ? 'none' : 'flex');
    setVar('--bc-display-board-resize-handle', settings.hideBoardResizeHandle ? 'none' : 'initial');
    setVar('--bc-player-order-gap-12', `${Math.max(0, parseNumber(settings.playerOrderGap12, parseNumber(defaults.playerOrderGap12, 6)))}px`);
    setVar('--bc-player-order-gap-23', `${Math.max(0, parseNumber(settings.playerOrderGap23, parseNumber(defaults.playerOrderGap23, 6)))}px`);
    setVar('--bc-player-order-gap-34', `${Math.max(0, parseNumber(settings.playerOrderGap34, parseNumber(defaults.playerOrderGap34, 6)))}px`);

    setVar('--bc-eval-width', `${evalWidth}px`);
    setVar('--bc-eval-radius', `${evalRadius}px`);
    setVar('--bc-eval-margin-left', `${evalMarginLeft}px`);
    setVar('--bc-eval-margin-right', `${evalMarginRight}px`);
    setVar('--bc-eval-ticks-display', settings.showEvalTicks ? 'block' : 'none');
    setVar(
      '--bc-eval-zero-color',
      colorWithOpacity(settings.evalZeroColor, settings.evalZeroOpacity, defaults.evalZeroColor, defaults.evalZeroOpacity)
    );
    setVar('--bc-eval-zero-thickness', `${evalZeroThickness}px`);
    setVar('--bc-eval-tools-shift', `${evalToolsShift}px`);
    setVar('--bc-underboard-margin', `${underboardMargin}px`);

    setVar('--bc-board-radius', `${Math.max(0, parseNumber(settings.boardRadius, parseNumber(defaults.boardRadius, 6)))}px`);
    setVar('--bc-board-light', settings.boardLightColor || defaults.boardLightColor);
    setVar('--bc-board-dark', settings.boardDarkColor || defaults.boardDarkColor);
    setVar('--bc-arrow-primary-color', settings.arrowPrimaryColor || defaults.arrowPrimaryColor);
    setVar('--bc-arrow-secondary-color', settings.arrowSecondaryColor || defaults.arrowSecondaryColor);
    setVar('--bc-arrow-tertiary-color', settings.arrowTertiaryColor || defaults.arrowTertiaryColor);
    setVar('--bc-arrow-quaternary-color', settings.arrowQuaternaryColor || defaults.arrowQuaternaryColor);
    setVar(
      '--bc-last-move-color',
      colorWithOpacity(settings.lastMoveColor, settings.lastMoveOpacity, defaults.lastMoveColor, defaults.lastMoveOpacity)
    );

    setVar('--bc-display-photo', settings.hidePhoto ? 'none' : 'block');
    if (settings.hideFlagOption) setVar('--bc-display-flag', 'none');
    setVar('--bc-display-rating', settings.hideRatingOption ? 'none' : 'inline');
    setVar('--bc-display-material', settings.hideMaterial ? 'none' : 'flex');
    if (!settings.hideProfileBg && settings.useCustomProfileBgColor) {
      setVar('--bc-profile-bg', settings.profileBgColor || defaults.profileBgColor);
    }
    setVar('--bc-photo-radius', `${Math.max(0, parseNumber(settings.photoRadius, parseNumber(defaults.photoRadius, 0)))}px`);
    setVar('--bc-player-margin', `${Math.max(0, parseNumber(settings.playerMargin, parseNumber(defaults.playerMargin, 0)))}px`);

    setVar('--bc-name-font', resolvedNameFont || 'inherit');
    if (settings.nameFontWeight) setVar('--bc-name-font-weight', settings.nameFontWeight);
    if (settings.scaleTitle) setVar('--bc-title-size', `${emSize}em`);
    if (settings.scaleName) setVar('--bc-name-size', `${baseSize}px`);
    if (settings.scaleRating) setVar('--bc-rating-size', `${emSize * 0.9}em`);
    setVar(
      '--bc-title-color',
      colorWithOpacity(settings.titleColor, settings.titleOpacity, defaults.titleColor, defaults.titleOpacity)
    );
    setVar(
      '--bc-rating-color',
      colorWithOpacity(settings.ratingColor, settings.ratingOpacity, defaults.ratingColor, defaults.ratingOpacity)
    );

    setVar('--bc-clock-font', resolvedClockFont || 'inherit');
    if (settings.clockFontWeight) setVar('--bc-clock-font-weight', settings.clockFontWeight);
    setVar('--bc-clock-radius', `${Math.max(0, parseNumber(settings.clockRadius, parseNumber(defaults.clockRadius, 3)))}px`);
    setVar('--bc-clock-border-width', `${Math.max(0, parseNumber(settings.clockBorderWidth, parseNumber(defaults.clockBorderWidth, 0)))}px`);
    setVar(
      '--bc-clock-border-color',
      colorWithOpacity(settings.clockBorderColor, settings.clockBorderOpacity, defaults.clockBorderColor, defaults.clockBorderOpacity)
    );
    setVar('--bc-clock-stop-icon-display', settings.hideClockPauseIcon ? 'none' : 'inline-block');
    setVar(
      '--bc-clock-white-color',
      colorWithOpacity(settings.clockWhiteColor, settings.clockWhiteTextOpacity, defaults.clockWhiteColor, defaults.clockWhiteTextOpacity)
    );
    setVar(
      '--bc-clock-white-bg',
      colorWithOpacity(settings.clockWhiteBgColor, settings.clockWhiteBgOpacity, defaults.clockWhiteBgColor, defaults.clockWhiteBgOpacity)
    );
    setVar(
      '--bc-clock-black-color',
      colorWithOpacity(settings.clockBlackColor, settings.clockBlackTextOpacity, defaults.clockBlackColor, defaults.clockBlackTextOpacity)
    );
    setVar(
      '--bc-clock-black-bg',
      colorWithOpacity(settings.clockBlackBgColor, settings.clockBlackBgOpacity, defaults.clockBlackBgColor, defaults.clockBlackBgOpacity)
    );

    const targetFlagSize = settings.scaleFlag ? `${emSize}em` : '1em';
    setVar('--bc-flag-width', targetFlagSize);
    setVar('--bc-flag-height', targetFlagSize);

    return vars;
  };

  const buildStandaloneActivationRules = (settings) => {
    const rules = [];
    const customOrder = sanitizeOrderValue(settings.playerOrderList);

    if (settings.useCustomBoardColors) {
      rules.push(`
.analyse__board.main-board cg-board::before {
  background-color: var(--bc-board-light, #f0d9b5) !important;
  background-image: conic-gradient(
    var(--bc-board-dark, #b58863) 0 25%,
    var(--bc-board-light, #f0d9b5) 0 50%,
    var(--bc-board-dark, #b58863) 0 75%,
    var(--bc-board-light, #f0d9b5) 0
  ) !important;
  background-size: 25% 25% !important;
  background-position: 0 0 !important;
  background-repeat: repeat !important;
  filter: none !important;
  opacity: 1 !important;
}`);
    }

    if (settings.customPlayerOrder) {
      const order = customOrder;
      const orderMap = {
        title: order.indexOf('title') + 1,
        name: order.indexOf('name') + 1,
        flag: order.indexOf('flag') + 1,
        rating: order.indexOf('rating') + 1
      };

      rules.push(`
.relay-board-player .info-split {
  display: flex !important;
  flex-direction: row !important;
  align-items: baseline !important;
  justify-content: flex-start !important;
  gap: 0 !important;
  flex-wrap: nowrap !important;
}
.relay-board-player .info-split > div,
.relay-board-player .info-split .info-secondary {
  display: contents !important;
}
.relay-board-player .info-split .utitle {
  order: ${orderMap.title};
  margin-inline-start: ${orderMap.title === 2 ? 'var(--bc-player-order-gap-12, 6px)' : orderMap.title === 3 ? 'var(--bc-player-order-gap-23, 6px)' : orderMap.title === 4 ? 'var(--bc-player-order-gap-34, 6px)' : '0'} !important;
  display: inline-flex !important;
  align-items: baseline !important;
  line-height: 1 !important;
}
.relay-board-player .info-split .name {
  order: ${orderMap.name};
  margin-inline-start: ${orderMap.name === 2 ? 'var(--bc-player-order-gap-12, 6px)' : orderMap.name === 3 ? 'var(--bc-player-order-gap-23, 6px)' : orderMap.name === 4 ? 'var(--bc-player-order-gap-34, 6px)' : '0'} !important;
  display: inline-flex !important;
  align-items: baseline !important;
  line-height: 1 !important;
}
.relay-board-player .info-split .mini-game__flag {
  order: ${orderMap.flag};
  margin-inline-start: ${orderMap.flag === 2 ? 'var(--bc-player-order-gap-12, 6px)' : orderMap.flag === 3 ? 'var(--bc-player-order-gap-23, 6px)' : orderMap.flag === 4 ? 'var(--bc-player-order-gap-34, 6px)' : '0'} !important;
  margin-inline-end: 0 !important;
  width: calc(var(--bc-flag-width, 1em) * 0.9) !important;
  height: calc(var(--bc-flag-height, 1em) * 0.9) !important;
  transform: translateY(15%) !important;
  vertical-align: text-bottom !important;
}
.relay-board-player .info-split .elo {
  order: ${orderMap.rating};
  margin-inline-start: ${orderMap.rating === 2 ? 'var(--bc-player-order-gap-12, 6px)' : orderMap.rating === 3 ? 'var(--bc-player-order-gap-23, 6px)' : orderMap.rating === 4 ? 'var(--bc-player-order-gap-34, 6px)' : '0'} !important;
  display: inline-flex !important;
  align-items: baseline !important;
  line-height: 1 !important;
  font-size: var(--bc-rating-size, 0.9em) !important;
}`);
    } else if (settings.playerInfoLayout === 'inline') {
      rules.push(`
.relay-board-player .info-split {
  flex-direction: row !important;
  align-items: baseline !important;
  justify-content: flex-start !important;
  gap: 8px !important;
}
.relay-board-player .info-split > div {
  display: flex !important;
  align-items: baseline !important;
  gap: 4px !important;
}`);
    }

    if (settings.hideProfileBg) {
      rules.push(`
.relay-board-player,
.relay-board-player::before {
  background: transparent !important;
  box-shadow: none !important;
}
.relay-board-player::before {
  display: none !important;
}`);
    }

    return rules.join('\n\n');
  };

  const getContentCssText = async () => {
    if (cachedContentCssText !== null) return cachedContentCssText;
    const response = await fetch(chrome.runtime.getURL('content.css'));
    if (!response.ok) {
      throw new Error('content.css konnte nicht geladen werden.');
    }
    cachedContentCssText = await response.text();
    return cachedContentCssText;
  };

  const buildStandaloneCssExportText = async (settings) => {
    const baseCssText = await getContentCssText();
    const vars = buildRuntimeCssVariables(settings);
    const activationRules = buildStandaloneActivationRules(settings);
    const rootVarLines = Object.keys(vars)
      .sort()
      .map((key) => `  ${key}: ${vars[key]};`);

    const lines = [
      '/* LiBroadcastEditor Standalone CSS Export */',
      `/* Generated: ${new Date().toISOString()} */`,
      '/* This file can be imported directly into Stylus. */',
      '@-moz-document domain("lichess.org") {',
      ':root {',
      ...rootVarLines,
      '}',
      '',
      baseCssText.trim()
    ];

    if (activationRules) {
      lines.push('', activationRules);
    }

    lines.push('}', '');
    return lines.join('\n');
  };

  const triggerCssDownload = (filename, content) => {
    const blob = new Blob([content], { type: 'text/css;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  };

  const parseCssSettings = (cssText) => {
    const parsed = {};
    const knownKeys = new Set([...Object.keys(elements), 'playerOrderList']);
    const declarationRegex = /--bc-setting-([a-z0-9-]+)\s*:\s*([^;]+);/gi;
    let match = declarationRegex.exec(cssText);

    while (match) {
      const key = fromCssSettingName(match[1]);
      const rawValue = match[2].trim();
      if (!knownKeys.has(key)) {
        match = declarationRegex.exec(cssText);
        continue;
      }

      if (key in elements && elements[key].type === 'checkbox') {
        const boolValue = parseBooleanSetting(rawValue);
        if (boolValue !== null) parsed[key] = boolValue;
      } else if (key === 'playerOrderList') {
        parsed[key] = sanitizeOrderValue(parseQuotedValue(rawValue)).join(',');
      } else {
        parsed[key] = parseQuotedValue(rawValue);
      }

      match = declarationRegex.exec(cssText);
    }

    return parsed;
  };

  const importCssSettingsText = (cssText) => {
    const importedSettings = parseCssSettings(cssText);
    if (!Object.keys(importedSettings).length) {
      throw new Error('Keine LiBroadcastEditor Settings im CSS gefunden.');
    }

    const mergedSettings = { ...collectSettingsFromUi(), ...importedSettings };
    applySettingsToUi(mergedSettings);
    saveAndNotify();
  };

  const handleCssImportFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importCssSettingsText(String(reader.result || ''));
      } catch (error) {
        alert(`CSS Import fehlgeschlagen: ${error.message}`);
      } finally {
        if (importCssFileInput) importCssFileInput.value = '';
      }
    };
    reader.onerror = () => {
      alert('CSS Datei konnte nicht gelesen werden.');
      if (importCssFileInput) importCssFileInput.value = '';
    };
    reader.readAsText(file);
  };

  const saveAndNotify = () => {
    syncCustomOrderLayoutLock();
    syncProfileBackgroundControls();
    updateSliderLabels();
    updateAllFontUiStates();
    const settings = collectSettingsFromUi();

    chrome.storage.sync.set(settings, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "updateStyles", settings });
        }
      });
    });
  };

  chrome.storage.sync.get([...Object.keys(elements), 'playerOrderList'], (result) => {
    const initialSettings = {};
    for (const key in elements) {
      if (result[key] !== undefined) {
        initialSettings[key] = result[key];
      } else if (elements[key].type === 'checkbox') {
        initialSettings[key] = checkboxDefaultsTrue.has(key);
      }
    }
    initialSettings.playerOrderList = result.playerOrderList || DEFAULT_ORDER;
    applySettingsToUi(initialSettings);
  });

  resetButton.addEventListener('click', () => {
    elements.profileItemSize.value = 14;
    updateSliderLabels();
    saveAndNotify();
  });

  for (const key of FONT_INPUT_KEYS) {
    const input = elements[key];
    if (!input) continue;
    const syncFontUi = () => {
      syncFontPresetSelection(key);
      updateFontAvailabilityState(key);
      const weightKey = FONT_WEIGHT_BY_FONT_KEY[key];
      if (weightKey) updateFontWeightControlState(weightKey);
    };
    input.addEventListener('input', syncFontUi);
    input.addEventListener('change', syncFontUi);
  }

  for (const key in fontPresetElements) {
    const select = fontPresetElements[key];
    if (!select) continue;
    select.addEventListener('change', () => {
      if (select.value === '') {
        elements[key].value = '';
      } else if (select.value !== '__custom__') {
        elements[key].value = select.value;
      }

      syncFontPresetSelection(key);
      updateFontAvailabilityState(key);
      const weightKey = FONT_WEIGHT_BY_FONT_KEY[key];
      if (weightKey) updateFontWeightControlState(weightKey);
      saveAndNotify();

      if (select.value === '__custom__') {
        elements[key].focus();
      }
    });
  }

  for (const key in elements) {
    elements[key].addEventListener('change', saveAndNotify);
    if (elements[key].type === 'text' || elements[key].type === 'number' || elements[key].type === 'range') {
      elements[key].addEventListener('input', saveAndNotify);
    }
  }

  if (exportCssButton) {
    exportCssButton.addEventListener('click', () => {
      const settings = collectSettingsFromUi();
      const cssText = buildCssExportText(settings);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      triggerCssDownload(`libroadcasteditor-settings-${timestamp}.css`, cssText);
    });
  }

  if (exportStandaloneCssButton) {
    exportStandaloneCssButton.addEventListener('click', async () => {
      try {
        const settings = collectSettingsFromUi();
        const cssText = await buildStandaloneCssExportText(settings);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        triggerCssDownload(`libroadcasteditor-standalone-${timestamp}.css`, cssText);
      } catch (error) {
        alert(`Standalone CSS Export fehlgeschlagen: ${error.message}`);
      }
    });
  }

  if (importCssButton && importCssFileInput) {
    importCssButton.addEventListener('click', () => importCssFileInput.click());
    importCssFileInput.addEventListener('change', (event) => {
      const file = event.target.files && event.target.files[0];
      handleCssImportFile(file);
    });
  }

  if (resetAllButton) {
    resetAllButton.addEventListener('click', () => {
      const defaults = getDefaultSettings();
      applySettingsToUi(defaults);
      saveAndNotify();
    });
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      updateAllFontUiStates();
    }).catch(() => {});
  }

  if (playerInfoLayoutRow) {
    playerInfoLayoutRow.addEventListener('click', () => {
      showPlayerInfoLayoutLockNotice();
    });
  }

  wireOrderDnD();
});
