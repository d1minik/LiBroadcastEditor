const defaultSettings = {
  hideHeader: false,
  hideChat: false,
  hideMoveTable: false,
  hideSide: false,
  hideClocks: false,
  hideUnderboard: false,
  hideEval: false,
  hideBoardCoords: false,
  hideBoardResizeHandle: false,
  evalBarWidth: '15',
  evalBarRadius: '0',
  evalMarginLeft: '0',
  evalMarginRight: '0',
  showEvalTicks: true,
  evalZeroColor: '#d79b00',
  evalZeroOpacity: '100',
  evalZeroThickness: '7',
  useCustomBoardColors: false,
  boardLightColor: '#f0d9b5',
  boardDarkColor: '#b58863',
  arrowPrimaryColor: '#15781b',
  arrowSecondaryColor: '#882020',
  arrowTertiaryColor: '#003088',
  arrowQuaternaryColor: '#e68f00',
  boardRadius: '6',
  lastMoveColor: '#9bc700',
  lastMoveOpacity: '41',
  hideProfileBg: false,
  useCustomProfileBgColor: false,
  profileBgColor: '#403a34',
  hidePhoto: false,
  hideFlagOption: false,
  hideRatingOption: false,
  hideMaterial: false,
  customPlayerOrder: false,
  playerOrderList: 'title,name,flag,rating',
  playerOrderGap12: '6',
  playerOrderGap23: '6',
  playerOrderGap34: '6',
  playerInfoLayout: 'default',
  photoRadius: '0',
  playerMargin: '0',
  underboardMargin: '0',
  pageBgColor: '#161512',
  nameFont: '',
  nameFontWeight: '',
  profileItemSize: '14',
  scaleTitle: true,
  scaleName: true,
  scaleRating: true,
  scaleFlag: true,
  titleColor: '#ffaa00',
  titleOpacity: '100',
  ratingColor: '#aaaaaa',
  ratingOpacity: '100',
  clockFont: '',
  clockFontWeight: '',
  clockRadius: '3',
  clockBorderWidth: '0',
  clockBorderColor: '#000000',
  clockBorderOpacity: '100',
  hideClockPauseIcon: false,
  clockWhiteColor: '#ffffff',
  clockWhiteTextOpacity: '100',
  clockWhiteBgColor: '#262421',
  clockWhiteBgOpacity: '100',
  clockBlackColor: '#ffffff',
  clockBlackTextOpacity: '100',
  clockBlackBgColor: '#262421',
  clockBlackBgOpacity: '100'
};

const PLAYER_ORDER_ITEMS = ['title', 'name', 'flag', 'rating'];
let latestSettings = { ...defaultSettings };
let playerOrderObserver = null;
let playerOrderRaf = 0;
let liveboardObserver = null;
let liveboardRaf = 0;
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
const FONT_PRESET_BY_LABEL = new Map(FONT_PRESETS.map((preset) => [normalizeFontLabel(preset.label), preset]));
const FONT_PRESET_BY_STACK = new Map(FONT_PRESETS.map((preset) => [normalizeFontStack(preset.css), preset]));

function stripMatchingQuotes(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  const firstChar = trimmed[0];
  const lastChar = trimmed[trimmed.length - 1];
  if ((firstChar === '"' || firstChar === "'") && firstChar === lastChar) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function parseFontFamilies(value) {
  const input = String(value || '');
  const families = [];
  let current = '';
  let quote = '';

  for (const char of input) {
    if ((char === '"' || char === "'")) {
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
}

function normalizeFontLabel(value) {
  return stripMatchingQuotes(value).replace(/\s+/g, ' ').toLowerCase();
}

function normalizeFontStack(value) {
  return parseFontFamilies(value)
    .map((family) => family.replace(/\s+/g, ' ').toLowerCase())
    .join(',');
}

function resolveFontCssValue(value) {
  const rawValue = String(value || '').trim();
  if (!rawValue) return '';

  const preset =
    FONT_PRESET_BY_LABEL.get(normalizeFontLabel(rawValue)) ||
    FONT_PRESET_BY_STACK.get(normalizeFontStack(rawValue));

  return preset ? preset.css : rawValue;
}

function normalizePlayerOrderList(value) {
  const raw = String(value || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter((item) => PLAYER_ORDER_ITEMS.includes(item));

  const unique = [];
  for (const item of raw) {
    if (!unique.includes(item)) unique.push(item);
  }
  for (const item of PLAYER_ORDER_ITEMS) {
    if (!unique.includes(item)) unique.push(item);
  }
  return unique;
}

function resolvePlayerOrder(settings) {
  const listFromString = normalizePlayerOrderList(settings.playerOrderList);
  if (listFromString.length === PLAYER_ORDER_ITEMS.length) return listFromString;

  // Backward compatibility for older numeric order settings.
  const legacyItems = PLAYER_ORDER_ITEMS.map((key) => {
    const settingKey = `playerOrder${key.charAt(0).toUpperCase()}${key.slice(1)}`;
    const orderValue = Number(settings[settingKey]);
    return {
      key,
      order: Number.isFinite(orderValue) ? orderValue : 99
    };
  });

  legacyItems.sort((a, b) => a.order - b.order);
  const legacyOrder = legacyItems.map((item) => item.key);
  return normalizePlayerOrderList(legacyOrder.join(','));
}

function collectPlayerInfoElements(infoSplit) {
  const titleEl = infoSplit.querySelector('.utitle');
  const nameEl = infoSplit.querySelector('.name');
  const flagEl = infoSplit.querySelector('.mini-game__flag');
  const ratingEl = infoSplit.querySelector('.elo');

  return {
    title: titleEl,
    name: nameEl,
    flag: flagEl,
    rating: ratingEl
  };
}

function restoreOriginalInfoSplit(infoSplit) {
  const elementMap = collectPlayerInfoElements(infoSplit);
  const primary = document.createElement('div');
  const secondary = document.createElement('div');
  secondary.className = 'info-secondary';

  if (elementMap.title) primary.appendChild(elementMap.title);
  if (elementMap.name) primary.appendChild(elementMap.name);
  if (elementMap.flag) secondary.appendChild(elementMap.flag);
  if (elementMap.rating) secondary.appendChild(elementMap.rating);

  infoSplit.innerHTML = '';
  if (primary.childNodes.length) infoSplit.appendChild(primary);
  if (secondary.childNodes.length) infoSplit.appendChild(secondary);
}

function applyCustomOrderToInfoSplit(infoSplit, order) {
  const currentItems = Array.from(infoSplit.children);
  const hasOnlyOrderItems = currentItems.length > 0 && currentItems.every((item) => item.classList.contains('bc-order-item'));
  if (hasOnlyOrderItems) {
    const currentOrder = currentItems
      .map((item) => PLAYER_ORDER_ITEMS.find((key) => item.classList.contains(`bc-order-${key}`)))
      .filter(Boolean)
      .join(',');
    if (currentOrder === order.join(',')) return;
  }

  const elementMap = collectPlayerInfoElements(infoSplit);

  infoSplit.innerHTML = '';
  for (const key of order) {
    const node = elementMap[key];
    if (!node) continue;
    const item = document.createElement('div');
    item.className = `bc-order-item bc-order-${key}`;
    item.appendChild(node);
    infoSplit.appendChild(item);
  }
}

function applyPlayerOrderLayout(settings) {
  const infoSplits = document.querySelectorAll('.relay-board-player .info-split');
  if (!infoSplits.length) return;

  const order = resolvePlayerOrder(settings);
  if (!settings.customPlayerOrder) {
    infoSplits.forEach(restoreOriginalInfoSplit);
    return;
  }

  infoSplits.forEach((infoSplit) => applyCustomOrderToInfoSplit(infoSplit, order));
}

function schedulePlayerOrderReapply() {
  if (playerOrderRaf) return;
  playerOrderRaf = requestAnimationFrame(() => {
    playerOrderRaf = 0;
    applyPlayerOrderLayout(latestSettings);
  });
}

function ensurePlayerOrderObserver() {
  if (playerOrderObserver || !document.body) return;
  playerOrderObserver = new MutationObserver(() => {
    if (!latestSettings.customPlayerOrder) return;
    schedulePlayerOrderReapply();
  });
  playerOrderObserver.observe(document.body, { childList: true, subtree: true });
}

function activateLiveboardTab(chatBox) {
  if (!chatBox) return;
  const liveboardTab = chatBox.querySelector('.mchat__tab.liveboard');
  if (!liveboardTab || liveboardTab.classList.contains('mchat__tab-active')) return;
  liveboardTab.click();
}

function enforceLiveboardMode() {
  const chatBoxes = document.querySelectorAll('.mchat, .mchat-mod');
  if (!chatBoxes.length) return;
  chatBoxes.forEach((chatBox) => activateLiveboardTab(chatBox));
}

function scheduleLiveboardSync() {
  if (liveboardRaf) return;
  liveboardRaf = requestAnimationFrame(() => {
    liveboardRaf = 0;
    enforceLiveboardMode();
  });
}

function ensureLiveboardObserver() {
  if (liveboardObserver || !document.body) return;
  liveboardObserver = new MutationObserver(() => {
    scheduleLiveboardSync();
  });
  liveboardObserver.observe(document.body, { childList: true, subtree: true });
}

function applySettings(settings) {
  const mergedSettings = { ...defaultSettings, ...latestSettings, ...settings };
  latestSettings = mergedSettings;
  settings = mergedSettings;

  const root = document.documentElement;
  const parseNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const parseOpacity = (value, fallback) => clamp(parseNumber(value, fallback), 0, 100) / 100;
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
  const colorWithOpacity = (color, opacity, fallbackColor) => {
    const parsedColor = parseHexColor(color) || parseHexColor(fallbackColor);
    if (!parsedColor) return fallbackColor;
    const alpha = clamp(opacity, 0, 1);
    return `rgba(${parsedColor.r}, ${parsedColor.g}, ${parsedColor.b}, ${alpha})`;
  };

  // Global Settings
  root.style.setProperty('--bc-page-bg', settings.pageBgColor);

  // Visibility Toggles
  root.style.setProperty('--bc-display-header', settings.hideHeader ? 'none' : '');
  root.style.setProperty('--bc-display-liveboard', settings.hideChat ? 'none' : '');
  root.style.setProperty('--bc-display-move-table', settings.hideMoveTable ? 'none' : '');
  root.style.setProperty('--bc-display-side', settings.hideSide ? 'none' : '');
  root.style.setProperty('--bc-display-clocks', settings.hideClocks ? 'none' : '');
  root.style.setProperty('--bc-display-underboard', settings.hideUnderboard ? 'none' : '');
  root.style.setProperty('--bc-display-eval', settings.hideEval ? 'none' : '');
  root.style.setProperty('--bc-display-board-coords', settings.hideBoardCoords ? 'none' : 'flex');
  root.style.setProperty('--bc-display-board-resize-handle', settings.hideBoardResizeHandle ? 'none' : 'initial');

  const defaultEvalWidth = parseNumber(defaultSettings.evalBarWidth, 15);
  const evalWidth = parseNumber(settings.evalBarWidth, defaultEvalWidth);
  const evalRadius = Math.max(0, parseNumber(settings.evalBarRadius, parseNumber(defaultSettings.evalBarRadius, 0)));
  const evalMarginLeft = Math.max(0, parseNumber(settings.evalMarginLeft, parseNumber(defaultSettings.evalMarginLeft, 0)));
  const evalMarginRight = Math.max(0, parseNumber(settings.evalMarginRight, parseNumber(defaultSettings.evalMarginRight, 0)));
  const evalZeroThickness = Math.max(1, parseNumber(settings.evalZeroThickness, parseNumber(defaultSettings.evalZeroThickness, 7)));
  const evalZeroOpacity = parseOpacity(settings.evalZeroOpacity, parseNumber(defaultSettings.evalZeroOpacity, 100));
  const underboardMargin = Math.max(0, parseNumber(settings.underboardMargin, parseNumber(defaultSettings.underboardMargin, 0)));
  const playerOrderGap12 = Math.max(0, parseNumber(settings.playerOrderGap12, parseNumber(defaultSettings.playerOrderGap12, 6)));
  const playerOrderGap23 = Math.max(0, parseNumber(settings.playerOrderGap23, parseNumber(defaultSettings.playerOrderGap23, 6)));
  const playerOrderGap34 = Math.max(0, parseNumber(settings.playerOrderGap34, parseNumber(defaultSettings.playerOrderGap34, 6)));
  const lastMoveOpacity = parseOpacity(settings.lastMoveOpacity, parseNumber(defaultSettings.lastMoveOpacity, 41));
  const titleOpacity = parseOpacity(settings.titleOpacity, parseNumber(defaultSettings.titleOpacity, 100));
  const ratingOpacity = parseOpacity(settings.ratingOpacity, parseNumber(defaultSettings.ratingOpacity, 100));
  const clockBorderOpacity = parseOpacity(settings.clockBorderOpacity, parseNumber(defaultSettings.clockBorderOpacity, 100));
  const clockWhiteTextOpacity = parseOpacity(settings.clockWhiteTextOpacity, parseNumber(defaultSettings.clockWhiteTextOpacity, 100));
  const clockWhiteBgOpacity = parseOpacity(settings.clockWhiteBgOpacity, parseNumber(defaultSettings.clockWhiteBgOpacity, 100));
  const clockBlackTextOpacity = parseOpacity(settings.clockBlackTextOpacity, parseNumber(defaultSettings.clockBlackTextOpacity, 100));
  const clockBlackBgOpacity = parseOpacity(settings.clockBlackBgOpacity, parseNumber(defaultSettings.clockBlackBgOpacity, 100));
  const evalToolsShift = settings.hideEval
    ? 0
    : Math.max(0, (evalWidth - defaultEvalWidth) + evalMarginLeft + evalMarginRight);

  root.style.setProperty('--bc-eval-width', `${evalWidth}px`);
  root.style.setProperty('--bc-eval-radius', `${evalRadius}px`);
  root.style.setProperty('--bc-eval-margin-left', `${evalMarginLeft}px`);
  root.style.setProperty('--bc-eval-margin-right', `${evalMarginRight}px`);
  root.style.setProperty('--bc-eval-ticks-display', settings.showEvalTicks ? 'block' : 'none');
  root.style.setProperty(
    '--bc-eval-zero-color',
    colorWithOpacity(settings.evalZeroColor, evalZeroOpacity, defaultSettings.evalZeroColor)
  );
  root.style.setProperty('--bc-eval-zero-thickness', `${evalZeroThickness}px`);
  root.style.setProperty('--bc-eval-tools-shift', `${evalToolsShift}px`);
  root.style.setProperty('--bc-underboard-margin', `${underboardMargin}px`);
  root.style.setProperty('--bc-player-order-gap-12', `${playerOrderGap12}px`);
  root.style.setProperty('--bc-player-order-gap-23', `${playerOrderGap23}px`);
  root.style.setProperty('--bc-player-order-gap-34', `${playerOrderGap34}px`);
  
  if (settings.useCustomBoardColors) {
      root.classList.add('bc-custom-board');
  } else {
      root.classList.remove('bc-custom-board');
  }
  const boardRadius = Math.max(0, parseNumber(settings.boardRadius, parseNumber(defaultSettings.boardRadius, 6)));
  root.style.setProperty('--bc-board-radius', `${boardRadius}px`);
  root.style.setProperty('--bc-board-light', settings.boardLightColor);
  root.style.setProperty('--bc-board-dark', settings.boardDarkColor);
  root.style.setProperty('--bc-arrow-primary-color', settings.arrowPrimaryColor || defaultSettings.arrowPrimaryColor);
  root.style.setProperty('--bc-arrow-secondary-color', settings.arrowSecondaryColor || defaultSettings.arrowSecondaryColor);
  root.style.setProperty('--bc-arrow-tertiary-color', settings.arrowTertiaryColor || defaultSettings.arrowTertiaryColor);
  root.style.setProperty('--bc-arrow-quaternary-color', settings.arrowQuaternaryColor || defaultSettings.arrowQuaternaryColor);
  root.style.setProperty(
    '--bc-last-move-color',
    colorWithOpacity(settings.lastMoveColor, lastMoveOpacity, defaultSettings.lastMoveColor)
  );

  // Player Profile
  if (settings.hideProfileBg) {
    root.classList.add('bc-hide-profile-bg');
  } else {
    root.classList.remove('bc-hide-profile-bg');
  }
  if (!settings.hideProfileBg && settings.useCustomProfileBgColor) {
    root.style.setProperty('--bc-profile-bg', settings.profileBgColor || defaultSettings.profileBgColor);
  } else {
    root.style.removeProperty('--bc-profile-bg');
  }
  root.style.setProperty('--bc-display-photo', settings.hidePhoto ? 'none' : '');
  root.style.setProperty('--bc-display-flag', settings.hideFlagOption ? 'none' : '');
  root.style.setProperty('--bc-display-rating', settings.hideRatingOption ? 'none' : '');
  root.style.setProperty('--bc-display-material', settings.hideMaterial ? 'none' : 'flex');
  
  if (settings.photoRadius !== undefined) {
    root.style.setProperty('--bc-photo-radius', `${settings.photoRadius}px`);
  }
  if (settings.playerMargin !== undefined) {
    root.style.setProperty('--bc-player-margin', `${settings.playerMargin}px`);
  }

  const useCustomPlayerOrder = Boolean(settings.customPlayerOrder);

  if (useCustomPlayerOrder) {
    root.classList.add('bc-player-order-custom');
  } else {
    root.classList.remove('bc-player-order-custom');
  }
  
  if (settings.playerInfoLayout === 'inline' || useCustomPlayerOrder) {
    root.classList.add('bc-layout-inline');
  } else {
    root.classList.remove('bc-layout-inline');
  }
  applyPlayerOrderLayout(settings);
  ensurePlayerOrderObserver();
  scheduleLiveboardSync();
  ensureLiveboardObserver();

  // Typography & Colors
  const resolvedNameFont = resolveFontCssValue(settings.nameFont);
  if (resolvedNameFont) {
    root.style.setProperty('--bc-name-font', resolvedNameFont);
  } else {
    root.style.removeProperty('--bc-name-font');
  }
  if (settings.nameFontWeight) {
    root.style.setProperty('--bc-name-font-weight', settings.nameFontWeight);
  } else {
    root.style.removeProperty('--bc-name-font-weight');
  }

  const baseSize = settings.profileItemSize !== undefined ? settings.profileItemSize : 14;
  const emSize = baseSize / 14;

  if (settings.scaleTitle) {
      root.style.setProperty('--bc-title-size', `${emSize}em`);
  } else {
      root.style.removeProperty('--bc-title-size');
  }

  if (settings.scaleName) {
      root.style.setProperty('--bc-name-size', `${baseSize}px`);
  } else {
      root.style.removeProperty('--bc-name-size');
  }

  if (settings.scaleRating) {
      root.style.setProperty('--bc-rating-size', `${emSize * 0.9}em`); // Default rating is slightly smaller
  } else {
      root.style.removeProperty('--bc-rating-size');
  }

  root.style.setProperty(
    '--bc-title-color',
    colorWithOpacity(settings.titleColor, titleOpacity, defaultSettings.titleColor)
  );
  root.style.setProperty(
    '--bc-rating-color',
    colorWithOpacity(settings.ratingColor, ratingOpacity, defaultSettings.ratingColor)
  );

  // Clock Settings
  const resolvedClockFont = resolveFontCssValue(settings.clockFont);
  if (resolvedClockFont) {
    root.style.setProperty('--bc-clock-font', resolvedClockFont);
  } else {
    root.style.removeProperty('--bc-clock-font');
  }
  if (settings.clockFontWeight) {
    root.style.setProperty('--bc-clock-font-weight', settings.clockFontWeight);
  } else {
    root.style.removeProperty('--bc-clock-font-weight');
  }
  if (settings.clockRadius !== undefined) {
    root.style.setProperty('--bc-clock-radius', `${settings.clockRadius}px`);
  }
  const clockBorderWidth = Math.max(0, parseNumber(settings.clockBorderWidth, parseNumber(defaultSettings.clockBorderWidth, 0)));
  root.style.setProperty('--bc-clock-border-width', `${clockBorderWidth}px`);
  root.style.setProperty(
    '--bc-clock-border-color',
    colorWithOpacity(settings.clockBorderColor, clockBorderOpacity, defaultSettings.clockBorderColor)
  );
  root.style.setProperty('--bc-clock-stop-icon-display', settings.hideClockPauseIcon ? 'none' : 'inline-block');
  root.style.setProperty(
    '--bc-clock-white-color',
    colorWithOpacity(settings.clockWhiteColor, clockWhiteTextOpacity, defaultSettings.clockWhiteColor)
  );
  root.style.setProperty(
    '--bc-clock-white-bg',
    colorWithOpacity(settings.clockWhiteBgColor, clockWhiteBgOpacity, defaultSettings.clockWhiteBgColor)
  );
  root.style.setProperty(
    '--bc-clock-black-color',
    colorWithOpacity(settings.clockBlackColor, clockBlackTextOpacity, defaultSettings.clockBlackColor)
  );
  root.style.setProperty(
    '--bc-clock-black-bg',
    colorWithOpacity(settings.clockBlackBgColor, clockBlackBgOpacity, defaultSettings.clockBlackBgColor)
  );

  // Flag sizing
  const targetFlagSize = settings.scaleFlag ? `${emSize}em` : '1em';
  root.style.setProperty('--bc-flag-width', targetFlagSize);
  root.style.setProperty('--bc-flag-height', targetFlagSize);
}

// Initial load
chrome.storage.sync.get(defaultSettings, (settings) => {
  applySettings(settings);
});

// Listen for updates from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateStyles") {
    applySettings(request.settings);
  }
});
