import { initPopupView, popupIcon } from './popup-ui.js';
import { initElementPicker } from './element-picker-popup.js';

document.addEventListener('DOMContentLoaded', () => {
  const shared = globalThis.LiBroadcastShared;
  if (!shared) {
    throw new Error('LiBroadcastShared was not loaded before popup.js.');
  }

  const {
    DEFAULT_SETTINGS,
    PLAYER_ORDER_ITEMS: ORDER_ITEMS,
    PLAYER_ORDER_PARTS: ORDER_SEQUENCE_PARTS,
    normalizeFontLabel,
    normalizePlayerOrderList,
    resolveFontSetting: resolveSharedFontSetting
  } = shared;

  const saveStatus = document.getElementById('saveStatus');
  const saveMessage = document.getElementById('saveMessage');
  const retryStorage = document.getElementById('retryStorage');
  const settingsContent = document.getElementById('settingsContent');
  const presetFeedback = document.getElementById('presetFeedback');
  const setSaveStatus = (state, message) => {
    saveStatus.dataset.state = state;
    if (saveMessage.textContent !== message) saveMessage.textContent = message;
    retryStorage.hidden = state !== 'error';
  };
  const showPresetFeedback = (message, isError = false) => {
    presetFeedback.toggleAttribute('data-error', isError);
    presetFeedback.textContent = message;
  };
  const reportBoundaryError = (boundary, error, message) => {
    console.error(`[LiBroadcastEditor] ${boundary}`, error);
    if (message) setSaveStatus('error', message);
  };

  const getRuntimeError = (fallbackMessage) => {
    if (!chrome.runtime || !chrome.runtime.lastError) return null;
    return new Error(chrome.runtime.lastError.message || fallbackMessage);
  };

  const collectSettingElements = () => {
    const expectedKeys = Object.keys(DEFAULT_SETTINGS).filter((key) => key !== 'playerOrderList');
    const mappedElements = {};
    const duplicateKeys = new Set();

    Array.from(document.querySelectorAll('[data-setting]')).forEach((element) => {
      const key = element.dataset.setting;
      if (!key || key === 'playerOrderList') return;

      if (mappedElements[key]) {
        duplicateKeys.add(key);
      }
      mappedElements[key] = element;
    });

    const missingKeys = expectedKeys.filter((key) => !mappedElements[key]);
    if (missingKeys.length || duplicateKeys.size) {
      const details = [];
      if (missingKeys.length) details.push(`missing: ${missingKeys.join(', ')}`);
      if (duplicateKeys.size) details.push(`duplicates: ${Array.from(duplicateKeys).join(', ')}`);
      throw new Error(`Popup settings markup is out of sync (${details.join('; ')})`);
    }

    return mappedElements;
  };

  const elements = collectSettingElements();
  const { refreshView, revealSettings } = initPopupView(elements, shared);

  const resetButton = document.getElementById('resetProfileSizes');
  const playerOrderList = document.getElementById('playerOrderList');
  const exportCssButton = document.getElementById('exportCssSettings');
  const importCssButton = document.getElementById('importCssSettings');
  const exportStandaloneCssButton = document.getElementById('exportStandaloneCss');
  const resetAllButton = document.getElementById('resetAllSettings');
  const importCssFileInput = document.getElementById('importCssFileInput');
  const playerInfoLayoutLockNotice = document.getElementById('playerInfoLayoutLockNotice');
  const playerOrderGapLabelElements = {
    playerOrderGap12: document.getElementById('playerOrderGap12Label'),
    playerOrderGap23: document.getElementById('playerOrderGap23Label'),
    playerOrderGap34: document.getElementById('playerOrderGap34Label')
  };
  const fontPresetElements = Object.fromEntries(
    Array.from(document.querySelectorAll('[data-font-for]'), select => [select.dataset.fontFor, select])
  );
  const STORAGE_WRITE_DEBOUNCE_MS = 250;

  const ORDER_LABELS = {
    titleName: 'Title + Name',
    flag: 'Flag',
    rating: 'Rating'
  };
  const LIVEBOARD_RADIUS_INHERIT_MAP = {
    liveboardPhotoRadius: 'photoRadius',
    liveboardBoardRadius: 'boardRadius',
    liveboardEvalBarRadius: 'evalBarRadius',
    liveboardClockRadius: 'clockRadius'
  };
  const ORDER_PART_LABELS = {
    title: 'Title',
    name: 'Name',
    flag: 'Flag',
    rating: 'Rating'
  };
  const FONT_WEIGHT_BY_FONT_KEY = { nameFont: 'nameFontWeight', clockFont: 'clockFontWeight' };
  const FONT_WEIGHT_SAMPLE = 'Hamburgefonsiv 0123456789';

  let draggedItem = null;
  let cachedContentCssText = null;
  let fontWeightMeasureRoot = null;
  const FONT_INPUT_KEYS = new Set(['nameFont', 'clockFont', 'liveboardNameFont', 'liveboardTitleFont', 'liveboardClockFont']);
  const OPTIONAL_COLOR_INPUT_FALLBACKS = {
    nameColor: '#ffffff'
  };
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
  const sanitizeOrderValue = (value) => normalizePlayerOrderList(value);

  const expandOrderValue = (value) => {
    return sanitizeOrderValue(value).flatMap((item) => ORDER_SEQUENCE_PARTS[item] || []);
  };

  const formatOrderGapLabel = (left, right) => {
    const leftLabel = ORDER_PART_LABELS[left];
    const rightLabel = ORDER_PART_LABELS[right];
    return leftLabel && rightLabel ? `${leftLabel} to ${rightLabel.toLowerCase()}` : 'Gap';
  };

  const updatePlayerOrderGapLabels = (value) => {
    const expandedOrder = expandOrderValue(value === undefined ? getOrderValue() : value);
    const gapPairs = [
      [expandedOrder[0], expandedOrder[1]],
      [expandedOrder[1], expandedOrder[2]],
      [expandedOrder[2], expandedOrder[3]]
    ];

    gapPairs.forEach(([left, right], index) => {
      const key = `playerOrderGap${index + 1}${index + 2}`;
      const label = playerOrderGapLabelElements[key];
      if (label) label.textContent = formatOrderGapLabel(left, right);
    });
  };

  const fontPresetByLabel = new Map(shared.FONT_PRESETS.map((preset) => [normalizeFontLabel(preset.label), preset]));
  const fontWeightSupportCache = new Map();

  const resolveFontSetting = (value) => {
    const resolved = resolveSharedFontSetting(value);
    if (!resolved.css) {
      return { label: '', css: '', preferredFamily: '' };
    }

    const families = resolved.families;
    const preferredFamily = families.find((family) => !GENERIC_FONT_FAMILIES.has(family.toLowerCase())) || families[0] || '';
    return {
      label: resolved.label,
      css: resolved.css,
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
    const status = document.getElementById(key + 'Status');
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
    const preset = fontPresetByLabel.get(normalizeFontLabel(label));
    select.value = preset ? preset.label : label ? '__custom__' : '';
    input.hidden = select.value !== '__custom__';
  };

  const updateFontWeightControlState = (fontKey) => {
    const weightKey = FONT_WEIGHT_BY_FONT_KEY[fontKey];
    if (!weightKey) return;
    const control = elements[weightKey];
    const status = document.getElementById(weightKey + 'Status');
    const { css, preferredFamily } = resolveFontSetting(elements[fontKey].value);
    let reason = '';
    if (css && !isFontInstalled(preferredFamily)) {
      reason = 'Install the selected font to choose a weight.';
    } else if (css && !fontSupportsMultipleWeights(preferredFamily)) {
      reason = `${preferredFamily} has a single weight on this system.`;
    }
    control.disabled = Boolean(reason);
    status.textContent = reason;
  };

  const updateFontUi = (key) => {
    updateFontAvailabilityState(key);
    updateFontWeightControlState(key);
  };

  const updateOrderButtons = () => {
    const items = Array.from(playerOrderList.children);
    items.forEach((item, index) => {
      item.querySelector('[data-move="up"]').disabled = index === 0;
      item.querySelector('[data-move="down"]').disabled = index === items.length - 1;
    });
  };

  const renderOrderList = (value) => {
    const order = sanitizeOrderValue(value);
    const fragment = document.createDocumentFragment();

    for (const item of order) {
      const li = document.createElement('li');
      li.className = 'order-item';
      li.draggable = true;
      li.dataset.orderItem = item;
      const label = document.createElement('span');
      label.textContent = ORDER_LABELS[item];
      li.append(popupIcon('grip-vertical'), label);
      for (const direction of ['up', 'down']) {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.move = direction;
        button.setAttribute('aria-label', `Move ${ORDER_LABELS[item]} ${direction}`);
        button.append(popupIcon('arrow-' + direction));
        li.append(button);
      }
      fragment.appendChild(li);
    }

    playerOrderList.replaceChildren(fragment);
    updateOrderButtons();
    updatePlayerOrderGapLabels(order.join(','));
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

  const wireOrderControls = () => {
    playerOrderList.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-move]');
      if (!button) return;
      const item = button.closest('.order-item');
      if (button.dataset.move === 'up') item.previousElementSibling.before(item);
      else item.nextElementSibling.after(item);
      updateOrderButtons();
      (button.disabled ? item.querySelector('button:enabled') : button).focus();
      saveAndNotify();
    });

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
      updateOrderButtons();
      saveAndNotify();
    });
  };

  const syncCustomOrderLayoutLock = () => {
    const layout = elements.playerInfoLayout;
    const locked = elements.customPlayerOrder.checked;
    if (locked && !layout.disabled) {
      layout.dataset.manualValue = layout.value;
      layout.value = 'inline';
    } else if (!locked && layout.disabled) {
      layout.value = layout.dataset.manualValue;
      delete layout.dataset.manualValue;
    }
    layout.disabled = locked;
    playerInfoLayoutLockNotice.hidden = !locked;
  };

  const syncInheritedLiveboardRadiusControls = () => {
    for (const [liveboardKey, sourceKey] of Object.entries(LIVEBOARD_RADIUS_INHERIT_MAP)) {
      const liveboardControl = elements[liveboardKey];
      if (!liveboardControl) continue;

      if (liveboardControl.dataset.inherit === '0') continue;

      const sourceControl = elements[sourceKey];
      const sourceValue = sourceControl ? String(sourceControl.value || DEFAULT_SETTINGS[sourceKey] || '0') : '0';
      liveboardControl.value = sourceValue;
      liveboardControl.dataset.inherit = '1';
    }
  };

  // Positive visibility switches still read and write the original hide* keys.
  const checkboxValue = (input, value) => input.hasAttribute('data-inverted') ? !value : value;

  const collectSettingsFromUi = () => {
    const settings = {};
    for (const key in elements) {
      if (elements[key].type === 'checkbox') {
        settings[key] = checkboxValue(elements[key], elements[key].checked);
      } else if (Object.prototype.hasOwnProperty.call(OPTIONAL_COLOR_INPUT_FALLBACKS, key)) {
        settings[key] = elements[key].dataset.customized === '1' ? elements[key].value : '';
      } else if (Object.prototype.hasOwnProperty.call(LIVEBOARD_RADIUS_INHERIT_MAP, key)) {
        settings[key] = elements[key].dataset.inherit === '0' ? elements[key].value : '';
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

  const getDefaultSettings = () => ({ ...DEFAULT_SETTINGS });

  const refreshControls = (resetDrafts = false) => {
    syncCustomOrderLayoutLock();
    syncInheritedLiveboardRadiusControls();
    updatePlayerOrderGapLabels();
    for (const [key, button] of inheritButtons) {
      button.hidden = key === 'nameColor' ? elements[key].dataset.customized !== '1' : elements[key].dataset.inherit !== '0';
    }
    refreshView(resetDrafts);
  };

  const applySettingsToUi = (settings) => {
    delete elements.playerInfoLayout.dataset.manualValue;
    elements.playerInfoLayout.disabled = false;
    for (const key in elements) {
      if (settings[key] === undefined) continue;
      if (elements[key].type === 'checkbox') {
        elements[key].checked = checkboxValue(elements[key], Boolean(settings[key]));
      } else if (Object.prototype.hasOwnProperty.call(OPTIONAL_COLOR_INPUT_FALLBACKS, key)) {
        const value = String(settings[key] ?? '').trim();
        elements[key].value = value || OPTIONAL_COLOR_INPUT_FALLBACKS[key];
        elements[key].dataset.customized = value ? '1' : '0';
      } else if (Object.prototype.hasOwnProperty.call(LIVEBOARD_RADIUS_INHERIT_MAP, key)) {
        if (String(settings[key] ?? '').trim() === '') {
          elements[key].dataset.inherit = '1';
        } else {
          elements[key].value = String(settings[key]);
          elements[key].dataset.inherit = '0';
        }
      } else if (FONT_INPUT_KEYS.has(key)) {
        elements[key].value = formatFontSettingForUi(settings[key]);
      } else {
        elements[key].value = String(settings[key]);
      }
    }

    if (settings.playerOrderList !== undefined) {
      renderOrderList(settings.playerOrderList);
    }

    for (const key of Object.keys(fontPresetElements)) {
      syncFontPresetSelection(key);
      updateFontUi(key);
    }
    refreshControls(true);
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
    const resolvedNameColor = parseHexColor(settings.nameColor);
    const nameOpacity = parseOpacityPercent(settings.nameOpacity, parseNumber(defaults.nameOpacity, 100)) / 100;
    const liveboardScale = clamp(parseNumber(settings.liveboardScale, parseNumber(defaults.liveboardScale, 82)), 55, 140) / 100;
    const liveboardFlagScale = clamp(
      parseNumber(settings.liveboardFlagScale, parseNumber(defaults.liveboardFlagScale, 100)),
      60,
      160
    ) / 100;
    const liveboardTextScale = clamp(parseNumber(settings.liveboardTextScale, parseNumber(defaults.liveboardTextScale, 100)), 60, 180) / 100;
    const liveboardNameScale = clamp(parseNumber(settings.liveboardNameScale, parseNumber(defaults.liveboardNameScale, 100)), 60, 180) / 100;
    const liveboardTitleScale = clamp(parseNumber(settings.liveboardTitleScale, parseNumber(defaults.liveboardTitleScale, 100)), 60, 180) / 100;
    const liveboardClockScale = clamp(parseNumber(settings.liveboardClockScale, parseNumber(defaults.liveboardClockScale, 100)), 60, 180) / 100;
    const liveboardEvalBarWidth = clamp(
      parseNumber(settings.liveboardEvalBarWidth, parseNumber(defaults.liveboardEvalBarWidth, 4)),
      1,
      12
    );
    const liveboardEvalBarGap = Math.max(
      0,
      parseNumber(settings.liveboardEvalBarGap, parseNumber(defaults.liveboardEvalBarGap, 4))
    );
    const liveboardTitleOpacity = parseOpacityPercent(
      settings.liveboardTitleOpacity,
      parseNumber(defaults.liveboardTitleOpacity, 100)
    );

    setVar('--bc-page-bg', settings.pageBgColor || defaults.pageBgColor);
    setVar('--bc-hide-top-menu', settings.hideHeader ? 'true' : '');
    setVar('--bc-display-liveboard', settings.hideChat ? 'none' : 'flex');
    setVar('--bc-display-move-table', settings.hideMoveTable ? 'none' : 'flex');
    setVar('--bc-display-side', settings.hideSide ? 'none' : 'flex');
    setVar('--bc-display-main-clocks', settings.hideClocks ? 'none' : 'flex');
    setVar('--bc-display-liveboard-clocks', settings.hideLiveboardClocks ? 'none' : 'flex');
    setVar('--bc-display-liveboard-photo', settings.hideLiveboardPhoto ? 'none' : 'block');
    setVar('--bc-display-liveboard-flag', settings.hideLiveboardFlag ? 'none' : 'inline-block');
    setVar('--bc-display-underboard', settings.hideUnderboard ? 'none' : 'block');
    setVar('--bc-display-eval', settings.hideEval ? 'none' : 'block');
    setVar('--bc-display-board-coords', settings.hideBoardCoords ? 'none' : 'flex');
    setVar('--bc-display-board-resize-handle', settings.hideBoardResizeHandle ? 'none' : 'initial');
    setVar('--bc-player-order-gap-12', `${Math.max(0, parseNumber(settings.playerOrderGap12, parseNumber(defaults.playerOrderGap12, 0)))}px`);
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

    const boardCoordinateScale = clamp(parseNumber(settings.boardCoordinateScale, 100), 100, 200);
    setVar('--bc-board-coordinate-scale', `${boardCoordinateScale}%`);
    setVar('--bc-board-radius', `${Math.max(0, parseNumber(settings.boardRadius, parseNumber(defaults.boardRadius, 6)))}px`);
    setVar('--bc-board-light', settings.boardLightColor || defaults.boardLightColor);
    setVar('--bc-board-dark', settings.boardDarkColor || defaults.boardDarkColor);
    setVar('--bc-arrow-primary-color', settings.arrowPrimaryColor || defaults.arrowPrimaryColor);
    setVar('--bc-arrow-secondary-color', settings.arrowSecondaryColor || defaults.arrowSecondaryColor);
    setVar('--bc-arrow-tertiary-color', settings.arrowTertiaryColor || defaults.arrowTertiaryColor);
    setVar('--bc-arrow-quaternary-color', settings.arrowQuaternaryColor || defaults.arrowQuaternaryColor);
    setVar(
      '--bc-engine-arrow-color',
      colorWithOpacity(
        settings.engineArrowColor,
        settings.engineArrowOpacity,
        defaults.engineArrowColor,
        defaults.engineArrowOpacity
      )
    );
    setVar(
      '--bc-last-move-color',
      colorWithOpacity(settings.lastMoveColor, settings.lastMoveOpacity, defaults.lastMoveColor, defaults.lastMoveOpacity)
    );

    setVar('--bc-display-photo', settings.hidePhoto ? 'none' : 'block');
    if (settings.hideFlagOption) setVar('--bc-display-flag', 'none');
    setVar('--bc-display-rating', settings.hideRatingOption ? 'none' : 'inline-flex');
    setVar('--bc-display-material', settings.hideMaterial ? 'none' : 'flex');
    if (!settings.hideProfileBg && settings.useCustomProfileBgColor) {
      setVar('--bc-profile-bg', settings.profileBgColor || defaults.profileBgColor);
    }
    setVar('--bc-photo-radius', `${Math.max(0, parseNumber(settings.photoRadius, parseNumber(defaults.photoRadius, 0)))}px`);
    setVar('--bc-player-margin', `${Math.max(0, parseNumber(settings.playerMargin, parseNumber(defaults.playerMargin, 0)))}px`);
    const playerProfileHeight = Math.max(
      45,
      parseNumber(settings.playerProfileHeight, parseNumber(defaults.playerProfileHeight, 45))
    );
    const playerProfileLeftMarginRaw = Math.max(
      0,
      parseNumber(settings.playerProfileLeftMargin, parseNumber(defaults.playerProfileLeftMargin, 0))
    );
    const playerProfileLeftMargin = settings.hidePhoto && playerProfileLeftMarginRaw === 0 ? 12 : playerProfileLeftMarginRaw;
    setVar('--bc-player-profile-height', `${playerProfileHeight}px`);
    setVar('--bc-player-profile-extra-height', `${Math.max(0, playerProfileHeight - 45)}px`);
    setVar('--bc-player-left-pad', `${playerProfileLeftMargin}px`);

    setVar('--bc-name-font', resolvedNameFont || 'inherit');
    if (settings.nameFontWeight) setVar('--bc-name-font-weight', settings.nameFontWeight);
    if (settings.scaleTitle) setVar('--bc-title-size', `${emSize}em`);
    if (settings.scaleName) setVar('--bc-name-size', `${baseSize}px`);
    if (settings.scaleRating) setVar('--bc-rating-size', `${emSize * 0.9}em`);
    if (resolvedNameColor) setVar('--bc-name-color', settings.nameColor);
    setVar('--bc-name-opacity', String(nameOpacity));
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
    setVar('--bc-liveboard-scale', String(liveboardScale));
    setVar('--bc-liveboard-flag-scale', String(liveboardFlagScale));
    setVar('--bc-liveboard-clock-scale', String(liveboardClockScale));
    setVar('--bc-liveboard-text-scale', String(liveboardTextScale));
    setVar('--bc-liveboard-name-scale', String(liveboardNameScale));
    setVar('--bc-liveboard-title-scale', String(liveboardTitleScale));
    setVar('--bc-liveboard-eval-width', `${liveboardEvalBarWidth}%`);
    setVar('--bc-liveboard-eval-gap', `${liveboardEvalBarGap}px`);
    const resolvedLiveboardNameFont = resolveFontCssValue(settings.liveboardNameFont);
    const resolvedLiveboardTitleFont = resolveFontCssValue(settings.liveboardTitleFont);
    const resolvedLiveboardClockFont = resolveFontCssValue(settings.liveboardClockFont);
    if (resolvedLiveboardNameFont) setVar('--bc-liveboard-name-font', resolvedLiveboardNameFont);
    if (resolvedLiveboardTitleFont) setVar('--bc-liveboard-title-font', resolvedLiveboardTitleFont);
    if (settings.useCustomLiveboardBoardColors) {
      setVar('--bc-liveboard-board-light', settings.liveboardBoardLightColor || defaults.liveboardBoardLightColor);
      setVar('--bc-liveboard-board-dark', settings.liveboardBoardDarkColor || defaults.liveboardBoardDarkColor);
    }
    if (settings.useCustomLiveboardStyle) {
      if (settings.liveboardNameFontWeight) setVar('--bc-liveboard-name-font-weight', settings.liveboardNameFontWeight);
      setVar(
        '--bc-liveboard-title-color',
        colorWithOpacity(
          settings.liveboardTitleColor,
          liveboardTitleOpacity,
          defaults.liveboardTitleColor,
          defaults.liveboardTitleOpacity
        )
      );
      if (resolvedLiveboardClockFont) setVar('--bc-liveboard-clock-font', resolvedLiveboardClockFont);
      if (settings.liveboardClockFontWeight) setVar('--bc-liveboard-clock-font-weight', settings.liveboardClockFontWeight);
    }

    const liveboardPhotoRadius = String(settings.liveboardPhotoRadius || '').trim() === ''
      ? NaN
      : parseNumber(settings.liveboardPhotoRadius, NaN);
    const liveboardBoardRadius = String(settings.liveboardBoardRadius || '').trim() === ''
      ? NaN
      : parseNumber(settings.liveboardBoardRadius, NaN);
    const liveboardEvalBarRadius = String(settings.liveboardEvalBarRadius || '').trim() === ''
      ? NaN
      : parseNumber(settings.liveboardEvalBarRadius, NaN);
    const liveboardClockRadius = String(settings.liveboardClockRadius || '').trim() === ''
      ? NaN
      : parseNumber(settings.liveboardClockRadius, NaN);
    const liveboardProfileHeight = Math.max(
      45,
      parseNumber(settings.liveboardProfileHeight, parseNumber(defaults.liveboardProfileHeight, 45))
    );
    const liveboardProfileLeftMarginRaw = Math.max(
      0,
      parseNumber(settings.liveboardProfileLeftMargin, parseNumber(defaults.liveboardProfileLeftMargin, 0))
    );
    const liveboardProfileLeftMargin =
      settings.hideLiveboardPhoto && liveboardProfileLeftMarginRaw === 0 ? 12 : liveboardProfileLeftMarginRaw;
    setVar('--bc-liveboard-player-profile-height', `${liveboardProfileHeight}px`);
    setVar('--bc-liveboard-player-left-pad', `${liveboardProfileLeftMargin}px`);
    if (Number.isFinite(liveboardPhotoRadius) && liveboardPhotoRadius >= 0) {
      setVar('--bc-liveboard-photo-radius', `${liveboardPhotoRadius}px`);
    }
    if (Number.isFinite(liveboardBoardRadius) && liveboardBoardRadius >= 0) {
      setVar('--bc-liveboard-board-radius', `${liveboardBoardRadius}px`);
    }
    if (Number.isFinite(liveboardEvalBarRadius) && liveboardEvalBarRadius >= 0) {
      setVar('--bc-liveboard-eval-radius', `${liveboardEvalBarRadius}px`);
    }
    if (Number.isFinite(liveboardClockRadius) && liveboardClockRadius >= 0) {
      setVar('--bc-liveboard-clock-radius', `${liveboardClockRadius}px`);
    }

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

    if (settings.useCustomBoardColors || settings.useCustomLiveboardBoardColors) {
      rules.push(`
main.analyse.is-relay .mchat .chat-liveboard .mini-game.bc-liveboard-mimic .mini-game__board cg-board::before,
main.analyse.is-relay .mchat-mod .chat-liveboard .mini-game.bc-liveboard-mimic .mini-game__board cg-board::before {
  background-color: var(--bc-liveboard-board-light, var(--bc-board-light, #f0d9b5)) !important;
  background-image: conic-gradient(
    var(--bc-liveboard-board-dark, var(--bc-board-dark, #b58863)) 0 25%,
    var(--bc-liveboard-board-light, var(--bc-board-light, #f0d9b5)) 0 50%,
    var(--bc-liveboard-board-dark, var(--bc-board-dark, #b58863)) 0 75%,
    var(--bc-liveboard-board-light, var(--bc-board-light, #f0d9b5)) 0
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
      const expandedOrder = expandOrderValue(order.join(','));
      const orderMap = expandedOrder.reduce((map, item, index) => {
        map[item] = index + 1;
        return map;
      }, {});
      const gapMap = expandedOrder.reduce((map, item, index) => {
        map[item] = index === 0 ? '0' : `var(--bc-player-order-gap-${index}${index + 1}, 6px)`;
        return map;
      }, {});
      const untitledNameGap = gapMap.title || '0';

      rules.push(`
.analyse__board.main-board .relay-board-player .info-split {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 0 !important;
  flex-wrap: nowrap !important;
  height: auto !important;
  min-height: 0 !important;
  align-self: center !important;
}
.analyse__board.main-board .relay-board-player .info-split > div,
.analyse__board.main-board .relay-board-player .info-split .info-secondary {
  display: contents !important;
}
.analyse__board.main-board .relay-board-player .info-split .utitle {
  order: ${orderMap.title};
  margin-inline-start: ${gapMap.title || '0'} !important;
  display: inline-flex !important;
  align-items: center !important;
  line-height: 1.12 !important;
}
.analyse__board.main-board .relay-board-player .info-split .name {
  order: ${orderMap.name};
  margin-inline-start: ${gapMap.name || '0'} !important;
  display: inline-flex !important;
  align-items: center !important;
  line-height: 1.15 !important;
}
.analyse__board.main-board .relay-board-player .info-split:not(:has(.utitle)) .name {
  margin-inline-start: ${untitledNameGap} !important;
}
.analyse__board.main-board .relay-board-player .info-split .mini-game__flag {
  order: ${orderMap.flag};
  margin-inline-start: ${gapMap.flag || '0'} !important;
  margin-inline-end: 0 !important;
  width: calc(var(--bc-flag-width, 1em) * 0.9) !important;
  height: calc(var(--bc-flag-height, 1em) * 0.9) !important;
  transform: none !important;
  vertical-align: middle !important;
}
.analyse__board.main-board .relay-board-player .info-split .elo {
  order: ${orderMap.rating};
  margin-inline-start: ${gapMap.rating || '0'} !important;
  display: var(--bc-display-rating, inline-flex) !important;
  align-items: center !important;
  line-height: 1.12 !important;
  font-size: var(--bc-rating-size, 0.9em) !important;
}
.analyse__board.main-board .relay-board-player .info-split .bc-order-rating {
  display: var(--bc-display-rating, inline-flex) !important;
}`);
    } else if (settings.playerInfoLayout === 'inline') {
      rules.push(`
.analyse__board.main-board .relay-board-player .info-split {
  flex-direction: row !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 8px !important;
  height: auto !important;
  min-height: 0 !important;
  align-self: center !important;
}
.analyse__board.main-board .relay-board-player .info-split > div {
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
}
.analyse__board.main-board .relay-board-player .info-secondary {
  align-items: center !important;
}
.analyse__board.main-board .relay-board-player .mini-game__flag {
  transform: none !important;
  vertical-align: middle !important;
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
      throw new Error('content.css could not be loaded.');
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
      throw new Error('No LiBroadcastEditor settings found in the CSS.');
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
        showPresetFeedback(`Imported ${file.name}.`);
      } catch (error) {
        showPresetFeedback(error.message, true);
      } finally {
        if (importCssFileInput) importCssFileInput.value = '';
      }
    };
    reader.onerror = () => {
      showPresetFeedback('The CSS file could not be read.', true);
      if (importCssFileInput) importCssFileInput.value = '';
    };
    reader.readAsText(file);
  };

  const STORAGE_KEYS = [...Object.keys(elements), 'playerOrderList'];

  const notifyActiveTab = (settings, showLiveboardEvaluation) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const queryError = getRuntimeError('The active tab could not be queried.');
      if (queryError) {
        reportBoundaryError('tabs.query', queryError);
        return;
      }

      const activeTab = tabs[0];
      if (!activeTab || activeTab.id === undefined) return;

      chrome.tabs.sendMessage(activeTab.id, { action: 'updateStyles', settings, showLiveboardEvaluation }, () => {
        const messageError = getRuntimeError('Updated settings could not be sent to the active tab.');
        if (!messageError) return;
        if (messageError.message.includes('Receiving end does not exist')) return;
        if (messageError.message.includes('The message port closed before a response was received')) return;
        reportBoundaryError('tabs.sendMessage', messageError);
      });
    });
  };

  let editRevision = 0;
  let pendingWrite = null;
  let writeTimer;

  const flushStorageWrite = () => {
    if (!pendingWrite) return;
    clearTimeout(writeTimer);
    const { settings, revision, showLiveboardEvaluation } = pendingWrite;
    pendingWrite = null;
    chrome.storage.sync.set(settings, () => {
      const error = getRuntimeError('Settings could not be saved.');
      if (revision !== editRevision) return;
      if (error) {
        reportBoundaryError('storage.sync.set', error, 'Could not save settings');
        return;
      }
      setSaveStatus('ready', 'Changes saved');
      notifyActiveTab(settings, showLiveboardEvaluation);
    });
  };

  const saveAndNotify = ({ debounceStorageWrite = false, showLiveboardEvaluation = false } = {}) => {
    refreshControls();
    const settings = collectSettingsFromUi();
    pendingWrite = { settings, revision: ++editRevision, showLiveboardEvaluation };
    clearTimeout(writeTimer);
    setSaveStatus('saving', 'Saving…');
    if (debounceStorageWrite) {
      notifyActiveTab(settings, showLiveboardEvaluation);
      writeTimer = setTimeout(flushStorageWrite, STORAGE_WRITE_DEBOUNCE_MS);
    } else {
      flushStorageWrite();
    }
  };
  window.addEventListener('pagehide', flushStorageWrite);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) flushStorageWrite();
  });

  const inheritButtons = new Map();
  for (const key of [...Object.keys(LIVEBOARD_RADIUS_INHERIT_MAP), 'nameColor']) {
    const input = elements[key];
    const label = input.closest('.setting-row').querySelector('.row-label');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'text-button';
    button.textContent = key === 'nameColor' ? 'Use Lichess default' : 'Use main board radius';
    button.setAttribute('aria-label', button.textContent + ' for ' + label.textContent.trim().toLowerCase());
    button.addEventListener('click', () => {
      if (key === 'nameColor') {
        input.dataset.customized = '0';
        input.value = OPTIONAL_COLOR_INPUT_FALLBACKS.nameColor;
      } else {
        input.dataset.inherit = '1';
      }
      input.focus();
      saveAndNotify();
    });
    label.append(button);
    inheritButtons.set(key, button);
  }

  const loadStoredSettings = () => {
    setSaveStatus('loading', 'Loading settings…');
    chrome.storage.sync.get(STORAGE_KEYS, (result) => {
      const error = getRuntimeError('Stored settings could not be loaded.');
      if (error) {
        reportBoundaryError('storage.sync.get', error, 'Could not load saved settings');
        return;
      }
      applySettingsToUi({ ...getDefaultSettings(), ...result });
      setSaveStatus('ready', 'Saves automatically');
      settingsContent.inert = false;
      initElementPicker(revealSettings);
    });
  };
  retryStorage.addEventListener('click', () => {
    if (settingsContent.inert) loadStoredSettings();
    else saveAndNotify();
  });
  loadStoredSettings();

  resetButton.addEventListener('click', () => {
    elements.profileItemSize.value = DEFAULT_SETTINGS.profileItemSize;
    saveAndNotify();
  });

  for (const [key, select] of Object.entries(fontPresetElements)) {
    const input = elements[key];
    input.addEventListener('input', () => updateFontUi(key));
    input.addEventListener('change', () => {
      syncFontPresetSelection(key);
      updateFontUi(key);
    });
    select.addEventListener('change', () => {
      if (select.value === '__custom__') {
        input.hidden = false;
        input.focus();
        input.select();
        return;
      }
      input.value = select.value;
      input.hidden = true;
      updateFontUi(key);
      saveAndNotify();
    });
  }

  for (const key in OPTIONAL_COLOR_INPUT_FALLBACKS) {
    const input = elements[key];
    if (!input) continue;
    const markCustomized = () => {
      input.dataset.customized = '1';
    };
    input.addEventListener('input', markCustomized);
    input.addEventListener('change', markCustomized);
  }

  for (const key in elements) {
    const input = elements[key];
    const showLiveboardEvaluation = key === 'liveboardEvalBarWidth';
    input.addEventListener('change', () => saveAndNotify({ showLiveboardEvaluation }));
    if (['text', 'number', 'range', 'color'].includes(input.type)) {
      input.addEventListener('input', () => {
        saveAndNotify({ debounceStorageWrite: true, showLiveboardEvaluation });
      });
    }
  }

  for (const liveboardKey of Object.keys(LIVEBOARD_RADIUS_INHERIT_MAP)) {
    const control = elements[liveboardKey];
    if (!control) continue;
    const markCustomized = () => {
      control.dataset.inherit = '0';
    };
    control.addEventListener('input', markCustomized, true);
    control.addEventListener('change', markCustomized, true);
  }

  if (exportCssButton) {
    exportCssButton.addEventListener('click', () => {
      const settings = collectSettingsFromUi();
      const cssText = buildCssExportText(settings);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      triggerCssDownload(`libroadcasteditor-settings-${timestamp}.css`, cssText);
      showPresetFeedback('Preset exported.');
    });
  }

  if (exportStandaloneCssButton) {
    exportStandaloneCssButton.addEventListener('click', async () => {
      try {
        const settings = collectSettingsFromUi();
        const cssText = await buildStandaloneCssExportText(settings);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        triggerCssDownload(`libroadcasteditor-standalone-${timestamp}.css`, cssText);
        showPresetFeedback('Stylesheet exported.');
      } catch (error) {
        showPresetFeedback(`Stylesheet export failed. ${error.message}`, true);
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

  const resetDialog = document.getElementById('resetDialog');
  resetAllButton.addEventListener('click', () => {
    resetDialog.returnValue = 'cancel';
    resetDialog.showModal();
  });
  resetDialog.addEventListener('close', () => {
    if (resetDialog.returnValue !== 'reset') return;
    applySettingsToUi(getDefaultSettings());
    saveAndNotify();
    showPresetFeedback('Default settings restored.');
  });

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => Object.keys(fontPresetElements).forEach(updateFontUi));
  }

  wireOrderControls();
});
