const defaultSettings = {
  hideHeader: false,
  hideChat: false,
  hideMoveTable: false,
  hideSide: false,
  hideClocks: false,
  hideLiveboardClocks: false,
  hideLiveboardPhoto: false,
  hideLiveboardFlag: false,
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
  engineArrowColor: '#003088',
  engineArrowOpacity: '40',
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
  playerOrderList: 'titleName,flag,rating',
  playerOrderGap12: '6',
  playerOrderGap23: '6',
  playerOrderGap34: '6',
  playerInfoLayout: 'default',
  photoRadius: '0',
  playerMargin: '0',
  playerProfileHeight: '45',
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
  clockBlackBgOpacity: '100',
  useCustomLiveboardStyle: false,
  showLiveboardBg: true,
  liveboardBgColor: '#2b2825',
  useCustomLiveboardBoardColors: false,
  liveboardBoardLightColor: '#f0d9b5',
  liveboardBoardDarkColor: '#b58863',
  liveboardPhotoRadius: '',
  liveboardBoardRadius: '',
  liveboardEvalBarRadius: '',
  liveboardClockRadius: '',
  liveboardTextScale: '100',
  liveboardNameScale: '100',
  liveboardTitleScale: '100',
  liveboardScale: '82',
  liveboardFlagScale: '100',
  liveboardClockScale: '100',
  liveboardEvalBarWidth: '4',
  liveboardEvalBarGap: '4',
  liveboardNameFont: '',
  liveboardNameFontWeight: '',
  liveboardTitleFont: '',
  liveboardTitleColor: '#ffaa00',
  liveboardTitleOpacity: '100',
  liveboardClockFont: '',
  liveboardClockFontWeight: ''
};

const LEGACY_PLAYER_ORDER_ITEMS = ['title', 'name', 'flag', 'rating'];
const PLAYER_ORDER_ITEMS = ['titleName', 'flag', 'rating'];
const PLAYER_ORDER_PARTS = {
  titleName: ['title', 'name'],
  flag: ['flag'],
  rating: ['rating']
};
const PLAYER_ORDER_GAP_CLASSES = ['bc-gap-before-12', 'bc-gap-before-23', 'bc-gap-before-34'];
let latestSettings = { ...defaultSettings };
let playerOrderObserver = null;
let playerOrderRaf = 0;
let liveboardObserver = null;
let liveboardRaf = 0;
let liveboardResizeBound = false;
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
  const normalizeOrderToken = (item) => {
    const trimmed = String(item || '').trim().toLowerCase();
    const compact = trimmed.replace(/[\s+_-]/g, '');
    if (trimmed === 'title' || trimmed === 'name') return 'titleName';
    if (trimmed === 'flag' || compact === 'flag') return 'flag';
    if (trimmed === 'rating' || compact === 'rating') return 'rating';
    if (trimmed === 'titlename' || compact === 'titlename') return 'titleName';
    return '';
  };
  const raw = String(value || '')
    .split(',')
    .map((item) => normalizeOrderToken(item))
    .filter(Boolean);

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
  const legacyItems = LEGACY_PLAYER_ORDER_ITEMS.map((key) => {
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

function cleanupCustomOrderClasses(elementMap) {
  Object.values(elementMap).forEach((node) => {
    if (!node || !node.classList) return;
    PLAYER_ORDER_GAP_CLASSES.forEach((className) => node.classList.remove(className));
  });
}

function buildPlayerOrderGapClassMap(order) {
  const expandedOrder = order.flatMap((item) => PLAYER_ORDER_PARTS[item] || []);
  const gapClassMap = {};

  for (let index = 1; index < expandedOrder.length; index += 1) {
    const key = expandedOrder[index];
    gapClassMap[key] = `bc-gap-before-${index}${index + 1}`;
  }

  return gapClassMap;
}

function restoreOriginalInfoSplit(infoSplit) {
  const elementMap = collectPlayerInfoElements(infoSplit);
  cleanupCustomOrderClasses(elementMap);
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
  const elementMap = collectPlayerInfoElements(infoSplit);
  const gapClassMap = buildPlayerOrderGapClassMap(order);
  cleanupCustomOrderClasses(elementMap);

  infoSplit.innerHTML = '';
  for (const key of order) {
    if (key === 'titleName') {
      const item = document.createElement('div');
      item.className = 'bc-order-item bc-order-title-name';
      if (gapClassMap.title) item.classList.add(gapClassMap.title);
      if (elementMap.title) item.appendChild(elementMap.title);
      if (elementMap.name) {
        if (elementMap.title && gapClassMap.name) {
          elementMap.name.classList.add(gapClassMap.name);
        }
        item.appendChild(elementMap.name);
      }
      if (item.childNodes.length) infoSplit.appendChild(item);
      continue;
    }

    const node = elementMap[key];
    if (!node) continue;
    const item = document.createElement('div');
    item.className = `bc-order-item bc-order-${key}`;
    if (gapClassMap[key]) item.classList.add(gapClassMap[key]);
    item.appendChild(node);
    infoSplit.appendChild(item);
  }
}

function applyPlayerOrderLayout(settings) {
  const infoSplits = document.querySelectorAll('.analyse__board.main-board .relay-board-player .info-split');
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

function escapeCssClass(value) {
  const rawValue = String(value || '');
  if (!rawValue) return '';
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(rawValue);
  }
  return rawValue.replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`);
}

function getLiveboardChapterId(liveboardGame) {
  if (!liveboardGame || !liveboardGame.classList) return '';
  const chapterClass = Array.from(liveboardGame.classList).find((className) => className.startsWith('liveboard-chapter-'));
  return chapterClass ? chapterClass.slice('liveboard-chapter-'.length) : '';
}

function getMainBoardForLiveboard(liveboardGame) {
  const chapterId = getLiveboardChapterId(liveboardGame);
  if (chapterId) {
    const chapterBoard = document.querySelector(`.analyse__board.main-board.${escapeCssClass(chapterId)}`);
    if (chapterBoard) return chapterBoard;
  }
  return document.querySelector('.analyse__board.main-board');
}

function createLiveboardProfileWrap(sourceProfile, wrapClass) {
  const wrap = document.createElement('div');
  wrap.className = `bc-liveboard-profile-wrap ${wrapClass}`;
  wrap.dataset.bcSignature = sourceProfile.outerHTML;

  const clone = sourceProfile.cloneNode(true);
  clone.classList.add('bc-liveboard-profile');
  normalizeLiveboardProfileClone(clone);
  wrap.appendChild(clone);
  return wrap;
}

function normalizeLiveboardProfileClone(profileClone) {
  const infoSplit = profileClone.querySelector('.info-split');
  if (!infoSplit) return;

  const titleEl = infoSplit.querySelector('.utitle');
  const nameEl = infoSplit.querySelector('.name');
  const flagEl = infoSplit.querySelector('.mini-game__flag');
  const primary = document.createElement('div');
  const secondary = document.createElement('div');
  secondary.className = 'info-secondary';

  if (titleEl) primary.appendChild(titleEl);
  if (nameEl) primary.appendChild(nameEl);
  if (flagEl) secondary.appendChild(flagEl);

  infoSplit.innerHTML = '';
  if (primary.childNodes.length) infoSplit.appendChild(primary);
  if (secondary.childNodes.length) infoSplit.appendChild(secondary);
}

function getLiveboardScale() {
  const scaleValue = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--bc-liveboard-scale')
  );
  return Number.isFinite(scaleValue) && scaleValue > 0 ? scaleValue : 0.82;
}

function syncLiveboardProfileWrapLayout(wrap) {
  if (!wrap) return;
  const profile = wrap.querySelector('.bc-liveboard-profile.relay-board-player');
  if (!profile) return;

  const scale = getLiveboardScale();
  const wrapWidth = wrap.getBoundingClientRect().width;
  if (wrapWidth > 0 && scale > 0) {
    profile.style.width = `${wrapWidth / scale}px`;
  } else {
    profile.style.removeProperty('width');
  }

  profile.classList.remove('bc-liveboard-auto-hide-flag');
  if (latestSettings.hideLiveboardFlag) return;

  const infoSplit = profile.querySelector('.info-split');
  if (!infoSplit || !profile.querySelector('.mini-game__flag')) return;
  if (infoSplit.scrollWidth - infoSplit.clientWidth > 1) {
    profile.classList.add('bc-liveboard-auto-hide-flag');
  }
}

function syncLiveboardProfileLayouts(liveboardGame) {
  if (!liveboardGame) return;
  liveboardGame.querySelectorAll('.bc-liveboard-profile-wrap').forEach(syncLiveboardProfileWrapLayout);
}

function syncLiveboardProfileWrap(liveboardGame, sourceProfile, wrapClass, beforeNode) {
  const existingWrap = Array.from(liveboardGame.children).find(
    (child) => child.classList && child.classList.contains(wrapClass)
  );

  if (!sourceProfile) {
    if (existingWrap) existingWrap.remove();
    return;
  }

  const signature = sourceProfile.outerHTML;
  if (existingWrap && existingWrap.dataset.bcSignature === signature) return;

  const nextWrap = createLiveboardProfileWrap(sourceProfile, wrapClass);
  if (existingWrap) {
    existingWrap.replaceWith(nextWrap);
    return;
  }

  if (beforeNode) {
    liveboardGame.insertBefore(nextWrap, beforeNode);
  } else {
    liveboardGame.appendChild(nextWrap);
  }
}

function syncLiveboardGame(liveboardGame) {
  const playerRows = Array.from(liveboardGame.children).filter(
    (child) => child.classList && child.classList.contains('mini-game__player')
  );
  const topRow = playerRows[0];
  if (!topRow) return;

  const bottomRow = playerRows[1] || null;
  const mainBoard = getMainBoardForLiveboard(liveboardGame);
  const topSource = mainBoard ? mainBoard.querySelector('.relay-board-player-top') : null;
  const bottomSource = mainBoard ? mainBoard.querySelector('.relay-board-player-bot') : null;

  liveboardGame.classList.add('bc-liveboard-mimic');
  topRow.classList.add('bc-liveboard-stage');
  if (bottomRow) bottomRow.classList.add('bc-liveboard-source-bottom');

  syncLiveboardProfileWrap(liveboardGame, topSource, 'bc-liveboard-profile-top', topRow);
  syncLiveboardProfileWrap(liveboardGame, bottomSource, 'bc-liveboard-profile-bot', bottomRow);
  syncLiveboardProfileLayouts(liveboardGame);
}

function syncLiveboardProfiles() {
  const liveboardGames = document.querySelectorAll('main.analyse.is-relay .chat-liveboard .mini-game');
  if (!liveboardGames.length) return;
  liveboardGames.forEach(syncLiveboardGame);
}

function enforceLiveboardMode() {
  const chatBoxes = document.querySelectorAll('.mchat, .mchat-mod');
  if (!chatBoxes.length) return;
  chatBoxes.forEach((chatBox) => activateLiveboardTab(chatBox));
  syncLiveboardProfiles();
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
  liveboardObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });
}

function ensureLiveboardResizeListener() {
  if (liveboardResizeBound) return;
  window.addEventListener('resize', scheduleLiveboardSync, { passive: true });
  liveboardResizeBound = true;
}

function applySettings(settings) {
  const mergedSettings = { ...defaultSettings, ...latestSettings, ...settings };
  latestSettings = mergedSettings;
  settings = mergedSettings;
  const showLiveboardBg =
    settings.showLiveboardBg !== undefined
      ? Boolean(settings.showLiveboardBg)
      : !Boolean(settings.hideLiveboardBg);

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
  const setOrRemoveProperty = (name, value) => {
    if (value === undefined || value === null || value === '') {
      root.style.removeProperty(name);
    } else {
      root.style.setProperty(name, value);
    }
  };

  // Global Settings
  root.style.setProperty('--bc-page-bg', settings.pageBgColor);

  // Visibility Toggles
  root.style.setProperty('--bc-display-header', settings.hideHeader ? 'none' : '');
  root.style.setProperty('--bc-display-liveboard', settings.hideChat ? 'none' : '');
  root.style.setProperty('--bc-display-move-table', settings.hideMoveTable ? 'none' : '');
  root.style.setProperty('--bc-display-side', settings.hideSide ? 'none' : '');
  root.style.setProperty('--bc-display-main-clocks', settings.hideClocks ? 'none' : 'flex');
  root.style.setProperty('--bc-display-liveboard-clocks', settings.hideLiveboardClocks ? 'none' : 'flex');
  root.style.setProperty(
    '--bc-display-liveboard-photo',
    settings.hideLiveboardPhoto ? 'none' : 'var(--bc-display-photo, block)'
  );
  root.style.setProperty(
    '--bc-display-liveboard-flag',
    settings.hideLiveboardFlag ? 'none' : 'var(--bc-display-flag, inline-block)'
  );
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
  const liveboardScale = clamp(parseNumber(defaultSettings.liveboardScale, 82), 55, 140) / 100;
  const liveboardFlagScale = clamp(parseNumber(defaultSettings.liveboardFlagScale, 100), 60, 160) / 100;
  const liveboardTextScale = clamp(
    parseNumber(settings.liveboardTextScale, parseNumber(defaultSettings.liveboardTextScale, 100)),
    60,
    180
  ) / 100;
  const liveboardNameScale = clamp(
    parseNumber(settings.liveboardNameScale, parseNumber(defaultSettings.liveboardNameScale, 100)),
    60,
    180
  ) / 100;
  const liveboardTitleScale = clamp(
    parseNumber(settings.liveboardTitleScale, parseNumber(defaultSettings.liveboardTitleScale, 100)),
    60,
    180
  ) / 100;
  const liveboardClockScale = clamp(
    parseNumber(settings.liveboardClockScale, parseNumber(defaultSettings.liveboardClockScale, 100)),
    60,
    180
  ) / 100;
  const liveboardEvalBarWidth = clamp(
    parseNumber(settings.liveboardEvalBarWidth, parseNumber(defaultSettings.liveboardEvalBarWidth, 4)),
    1,
    12
  );
  const liveboardEvalBarGap = Math.max(0, parseNumber(defaultSettings.liveboardEvalBarGap, 4));
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
  if (settings.useCustomLiveboardBoardColors) {
      root.classList.add('bc-custom-liveboard-board');
  } else {
      root.classList.remove('bc-custom-liveboard-board');
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
    '--bc-engine-arrow-color',
    colorWithOpacity(
      settings.engineArrowColor,
      parseOpacity(settings.engineArrowOpacity, parseNumber(defaultSettings.engineArrowOpacity, 40)),
      defaultSettings.engineArrowColor
    )
  );
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
  const playerProfileHeight = Math.max(
    45,
    parseNumber(settings.playerProfileHeight, parseNumber(defaultSettings.playerProfileHeight, 45))
  );
  root.style.setProperty('--bc-player-profile-height', `${playerProfileHeight}px`);
  root.style.setProperty('--bc-player-profile-extra-height', `${Math.max(0, playerProfileHeight - 45)}px`);

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
  ensureLiveboardResizeListener();

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
  root.style.setProperty('--bc-liveboard-panel-bg', defaultSettings.liveboardBgColor);
  root.style.removeProperty('--bc-liveboard-panel-border');
  root.style.removeProperty('--bc-liveboard-panel-shadow');
  root.style.removeProperty('--bc-liveboard-panel-radius');
  root.style.setProperty('--bc-liveboard-scale', String(liveboardScale));
  root.style.setProperty('--bc-liveboard-flag-scale', String(liveboardFlagScale));
  root.style.setProperty('--bc-liveboard-clock-scale', String(liveboardClockScale));
  root.style.setProperty('--bc-liveboard-text-scale', String(liveboardTextScale));
  root.style.setProperty('--bc-liveboard-name-scale', String(liveboardNameScale));
  root.style.setProperty('--bc-liveboard-title-scale', String(liveboardTitleScale));
  root.style.setProperty('--bc-liveboard-eval-width', `${liveboardEvalBarWidth}%`);
  root.style.setProperty('--bc-liveboard-eval-gap', `${liveboardEvalBarGap}px`);

  const resolvedLiveboardNameFont = resolveFontCssValue(settings.liveboardNameFont);
  const resolvedLiveboardTitleFont = resolveFontCssValue(settings.liveboardTitleFont);
  setOrRemoveProperty('--bc-liveboard-name-font', resolvedLiveboardNameFont);
  setOrRemoveProperty('--bc-liveboard-title-font', resolvedLiveboardTitleFont);
  setOrRemoveProperty(
    '--bc-liveboard-board-light',
    settings.useCustomLiveboardBoardColors ? settings.liveboardBoardLightColor || defaultSettings.liveboardBoardLightColor : ''
  );
  setOrRemoveProperty(
    '--bc-liveboard-board-dark',
    settings.useCustomLiveboardBoardColors ? settings.liveboardBoardDarkColor || defaultSettings.liveboardBoardDarkColor : ''
  );
  root.style.removeProperty('--bc-liveboard-name-font-weight');
  root.style.removeProperty('--bc-liveboard-title-color');
  root.style.removeProperty('--bc-liveboard-clock-font');
  root.style.removeProperty('--bc-liveboard-clock-font-weight');

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
  setOrRemoveProperty(
    '--bc-liveboard-photo-radius',
    Number.isFinite(liveboardPhotoRadius) && liveboardPhotoRadius >= 0 ? `${liveboardPhotoRadius}px` : ''
  );
  setOrRemoveProperty(
    '--bc-liveboard-board-radius',
    Number.isFinite(liveboardBoardRadius) && liveboardBoardRadius >= 0 ? `${liveboardBoardRadius}px` : ''
  );
  setOrRemoveProperty(
    '--bc-liveboard-eval-radius',
    Number.isFinite(liveboardEvalBarRadius) && liveboardEvalBarRadius >= 0 ? `${liveboardEvalBarRadius}px` : ''
  );
  setOrRemoveProperty(
    '--bc-liveboard-clock-radius',
    Number.isFinite(liveboardClockRadius) && liveboardClockRadius >= 0 ? `${liveboardClockRadius}px` : ''
  );

  // Flag sizing
  const targetFlagSize = settings.scaleFlag ? `${emSize}em` : '1em';
  root.style.setProperty('--bc-flag-width', targetFlagSize);
  root.style.setProperty('--bc-flag-height', targetFlagSize);
}

// Initial load
chrome.storage.sync.get({ ...defaultSettings, showLiveboardBg: null, hideLiveboardBg: null }, (settings) => {
  const normalizedSettings = { ...defaultSettings, ...settings };
  normalizedSettings.showLiveboardBg =
    settings.showLiveboardBg === null
      ? settings.hideLiveboardBg === null
        ? defaultSettings.showLiveboardBg
        : !Boolean(settings.hideLiveboardBg)
      : Boolean(settings.showLiveboardBg);
  applySettings(normalizedSettings);
});

// Listen for updates from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateStyles") {
    applySettings(request.settings);
  }
});
