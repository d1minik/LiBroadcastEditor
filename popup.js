document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    hideHeader: document.getElementById('hideHeader'),
    hideChat: document.getElementById('hideChat'),
    hideMoveTable: document.getElementById('hideMoveTable'),
    hideSide: document.getElementById('hideSide'),
    hideClocks: document.getElementById('hideClocks'),
    hideUnderboard: document.getElementById('hideUnderboard'),
    hideEval: document.getElementById('hideEval'),
    hideBoardShadow: document.getElementById('hideBoardShadow'),
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
    clockBlackBgOpacity: document.getElementById('clockBlackBgOpacity'),
    flagShape: document.getElementById('flagShape')
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

  const ORDER_ITEMS = ['title', 'name', 'flag', 'rating'];
  const ORDER_LABELS = {
    title: 'Title',
    name: 'Name',
    flag: 'Flag',
    rating: 'Rating'
  };
  const DEFAULT_ORDER = ORDER_ITEMS.join(',');

  let draggedItem = null;
  let cachedContentCssText = null;

  const checkboxDefaultsTrue = new Set(['showEvalTicks', 'scaleTitle', 'scaleName', 'scaleRating', 'scaleFlag']);

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
      elements.playerInfoLayout.value = 'inline';
      elements.playerInfoLayout.disabled = true;
      elements.playerInfoLayout.title = 'Custom order requires "Right of Name" layout';
    } else {
      elements.playerInfoLayout.disabled = false;
      elements.playerInfoLayout.removeAttribute('title');
    }
  };

  const collectSettingsFromUi = () => {
    syncCustomOrderLayoutLock();
    const settings = {};
    for (const key in elements) {
      if (elements[key].type === 'checkbox') {
        settings[key] = elements[key].checked;
      } else {
        settings[key] = elements[key].value;
      }
    }
    if (settings.customPlayerOrder) {
      settings.playerInfoLayout = 'inline';
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
      } else {
        elements[key].value = String(settings[key]);
      }
    }

    if (settings.playerOrderList !== undefined) {
      renderOrderList(settings.playerOrderList);
    }

    syncCustomOrderLayoutLock();
    updateSliderLabels();
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

    setVar('--bc-page-bg', settings.pageBgColor || defaults.pageBgColor);
    setVar('--bc-display-header', settings.hideHeader ? 'none' : 'flex');
    setVar('--bc-display-chat', settings.hideChat ? 'none' : 'flex');
    setVar('--bc-display-move-table', settings.hideMoveTable ? 'none' : 'flex');
    setVar('--bc-display-side', settings.hideSide ? 'none' : 'flex');
    setVar('--bc-display-clocks', settings.hideClocks ? 'none' : 'flex');
    setVar('--bc-display-underboard', settings.hideUnderboard ? 'none' : 'block');
    setVar('--bc-display-eval', settings.hideEval ? 'none' : 'block');
    setVar('--bc-display-board-coords', settings.hideBoardCoords ? 'none' : 'initial');
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
    setVar('--bc-photo-radius', `${Math.max(0, parseNumber(settings.photoRadius, parseNumber(defaults.photoRadius, 0)))}px`);
    setVar('--bc-player-margin', `${Math.max(0, parseNumber(settings.playerMargin, parseNumber(defaults.playerMargin, 0)))}px`);

    setVar('--bc-name-font', settings.nameFont || 'inherit');
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

    setVar('--bc-clock-font', settings.clockFont || 'inherit');
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

    let flagRadius = '3px';
    let flagDisplay = 'inline-block';
    let flagWidth = '1em';
    let flagHeight = '1em';
    const targetFlagSize = settings.scaleFlag ? `${emSize}em` : '1em';

    if (settings.flagShape === 'circle') {
      flagRadius = '50%';
      flagWidth = targetFlagSize;
      flagHeight = targetFlagSize;
    } else if (settings.flagShape === 'square') {
      flagRadius = '0';
      flagWidth = targetFlagSize;
      flagHeight = targetFlagSize;
    } else if (settings.flagShape === 'hidden') {
      flagDisplay = 'none';
    } else if (settings.scaleFlag) {
      flagWidth = targetFlagSize;
      flagHeight = targetFlagSize;
    }

    setVar('--bc-flag-radius', flagRadius);
    setVar('--bc-flag-width', flagWidth);
    setVar('--bc-flag-height', flagHeight);
    setVar('--bc-flag-display', flagDisplay);

    return vars;
  };

  const buildStandaloneActivationRules = (settings) => {
    const rules = [];

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
      const order = sanitizeOrderValue(settings.playerOrderList);
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
  align-items: center !important;
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
  align-items: center !important;
  line-height: 1 !important;
}
.relay-board-player .info-split .name {
  order: ${orderMap.name};
  margin-inline-start: ${orderMap.name === 2 ? 'var(--bc-player-order-gap-12, 6px)' : orderMap.name === 3 ? 'var(--bc-player-order-gap-23, 6px)' : orderMap.name === 4 ? 'var(--bc-player-order-gap-34, 6px)' : '0'} !important;
  display: inline-flex !important;
  align-items: center !important;
  line-height: 1 !important;
}
.relay-board-player .info-split .mini-game__flag {
  order: ${orderMap.flag};
  margin-inline-start: ${orderMap.flag === 2 ? 'var(--bc-player-order-gap-12, 6px)' : orderMap.flag === 3 ? 'var(--bc-player-order-gap-23, 6px)' : orderMap.flag === 4 ? 'var(--bc-player-order-gap-34, 6px)' : '0'} !important;
  margin-inline-end: 0 !important;
  transform: translateY(0) !important;
  vertical-align: middle !important;
}
.relay-board-player .info-split .elo {
  order: ${orderMap.rating};
  margin-inline-start: ${orderMap.rating === 2 ? 'var(--bc-player-order-gap-12, 6px)' : orderMap.rating === 3 ? 'var(--bc-player-order-gap-23, 6px)' : orderMap.rating === 4 ? 'var(--bc-player-order-gap-34, 6px)' : '0'} !important;
  display: inline-flex !important;
  align-items: center !important;
  line-height: 1 !important;
  transform: translateY(0) !important;
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
    updateSliderLabels();
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

  wireOrderDnD();
});
