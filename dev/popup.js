document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    hideHeader: document.getElementById('hideHeader'),
    hideChat: document.getElementById('hideChat'),
    hideMoveTable: document.getElementById('hideMoveTable'),
    hideSide: document.getElementById('hideSide'),
    hideClocks: document.getElementById('hideClocks'),
    hideLiveboardClocks: document.getElementById('hideLiveboardClocks'),
    hideLiveboardPhoto: document.getElementById('hideLiveboardPhoto'),
    hideLiveboardFlag: document.getElementById('hideLiveboardFlag'),
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
    engineArrowColor: document.getElementById('engineArrowColor'),
    engineArrowOpacity: document.getElementById('engineArrowOpacity'),
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
    playerProfileHeight: document.getElementById('playerProfileHeight'),
    playerProfileLeftMargin: document.getElementById('playerProfileLeftMargin'),
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
    clockBlackBgOpacity: document.getElementById('clockBlackBgOpacity'),
    useCustomLiveboardStyle: document.getElementById('useCustomLiveboardStyle'),
    showLiveboardBg: document.getElementById('showLiveboardBg'),
    liveboardBgColor: document.getElementById('liveboardBgColor'),
    useCustomLiveboardBoardColors: document.getElementById('useCustomLiveboardBoardColors'),
    liveboardBoardLightColor: document.getElementById('liveboardBoardLightColor'),
    liveboardBoardDarkColor: document.getElementById('liveboardBoardDarkColor'),
    liveboardPhotoRadius: document.getElementById('liveboardPhotoRadius'),
    liveboardBoardRadius: document.getElementById('liveboardBoardRadius'),
    liveboardEvalBarRadius: document.getElementById('liveboardEvalBarRadius'),
    liveboardClockRadius: document.getElementById('liveboardClockRadius'),
    liveboardProfileHeight: document.getElementById('liveboardProfileHeight'),
    liveboardProfileLeftMargin: document.getElementById('liveboardProfileLeftMargin'),
    liveboardTextScale: document.getElementById('liveboardTextScale'),
    liveboardNameScale: document.getElementById('liveboardNameScale'),
    liveboardTitleScale: document.getElementById('liveboardTitleScale'),
    liveboardScale: document.getElementById('liveboardScale'),
    liveboardFlagScale: document.getElementById('liveboardFlagScale'),
    liveboardClockScale: document.getElementById('liveboardClockScale'),
    liveboardEvalBarWidth: document.getElementById('liveboardEvalBarWidth'),
    liveboardEvalBarGap: document.getElementById('liveboardEvalBarGap'),
    liveboardNameFont: document.getElementById('liveboardNameFont'),
    liveboardNameFontWeight: document.getElementById('liveboardNameFontWeight'),
    liveboardTitleFont: document.getElementById('liveboardTitleFont'),
    liveboardTitleColor: document.getElementById('liveboardTitleColor'),
    liveboardTitleOpacity: document.getElementById('liveboardTitleOpacity'),
    liveboardClockFont: document.getElementById('liveboardClockFont'),
    liveboardClockFontWeight: document.getElementById('liveboardClockFontWeight')
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
  const showLiveboardBgRow = document.getElementById('showLiveboardBgRow');
  const liveboardBgColorRow = document.getElementById('liveboardBgColorRow');
  const useCustomLiveboardBoardColorsRow = document.getElementById('useCustomLiveboardBoardColorsRow');
  const liveboardBoardLightColorRow = document.getElementById('liveboardBoardLightColorRow');
  const liveboardBoardDarkColorRow = document.getElementById('liveboardBoardDarkColorRow');
  const playerInfoLayoutRow = document.getElementById('playerInfoLayoutRow');
  const playerInfoLayoutLockNotice = document.getElementById('playerInfoLayoutLockNotice');
  const playerOrderGapLabelElements = {
    playerOrderGap12: document.getElementById('playerOrderGap12Label'),
    playerOrderGap23: document.getElementById('playerOrderGap23Label'),
    playerOrderGap34: document.getElementById('playerOrderGap34Label')
  };
  const liveboardCustomControlBlocks = Array.from(document.querySelectorAll('[data-liveboard-custom-control]'));
  const fontStatusElements = {
    nameFont: document.getElementById('nameFontStatus'),
    clockFont: document.getElementById('clockFontStatus'),
    liveboardNameFont: document.getElementById('liveboardNameFontStatus'),
    liveboardTitleFont: document.getElementById('liveboardTitleFontStatus'),
    liveboardClockFont: document.getElementById('liveboardClockFontStatus')
  };
  const fontPresetElements = {
    nameFont: document.getElementById('nameFontPreset'),
    clockFont: document.getElementById('clockFontPreset'),
    liveboardNameFont: document.getElementById('liveboardNameFontPreset'),
    liveboardTitleFont: document.getElementById('liveboardTitleFontPreset'),
    liveboardClockFont: document.getElementById('liveboardClockFontPreset')
  };
  const fontWeightStatusElements = {
    nameFontWeight: document.getElementById('nameFontWeightStatus'),
    clockFontWeight: document.getElementById('clockFontWeightStatus'),
    liveboardNameFontWeight: document.getElementById('liveboardNameFontWeightStatus'),
    liveboardClockFontWeight: document.getElementById('liveboardClockFontWeightStatus')
  };

  const LEGACY_ORDER_ITEMS = ['title', 'name', 'flag', 'rating'];
  const ORDER_ITEMS = ['titleName', 'flag', 'rating'];
  const ORDER_LABELS = {
    titleName: 'Title + Name',
    flag: 'Flag',
    rating: 'Rating'
  };
  const ORDER_SEQUENCE_PARTS = {
    titleName: ['title', 'name'],
    flag: ['flag'],
    rating: ['rating']
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
  const DEFAULT_ORDER = ORDER_ITEMS.join(',');
  const FONT_WEIGHT_BY_FONT_KEY = {
    nameFont: 'nameFontWeight',
    clockFont: 'clockFontWeight',
    liveboardNameFont: 'liveboardNameFontWeight',
    liveboardClockFont: 'liveboardClockFontWeight'
  };
  const FONT_UI_TOGGLE_BY_KEY = {};
  const FONT_WEIGHT_CONFIG = {
    nameFontWeight: {
      fontKey: 'nameFont',
      row: document.getElementById('nameFontWeightRow')
    },
    clockFontWeight: {
      fontKey: 'clockFont',
      row: document.getElementById('clockFontWeightRow')
    },
    liveboardNameFontWeight: {
      fontKey: 'liveboardNameFont',
      row: document.getElementById('liveboardNameFontWeightRow'),
      toggleKey: 'useCustomLiveboardStyle'
    },
    liveboardClockFontWeight: {
      fontKey: 'liveboardClockFont',
      row: document.getElementById('liveboardClockFontWeightRow'),
      toggleKey: 'useCustomLiveboardStyle'
    }
  };
  const FONT_WEIGHT_SAMPLE = 'Hamburgefonsiv 0123456789';
  const DEFAULT_SETTINGS = {
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
    evalBarWidth: '15',
    evalBarRadius: '0',
    evalMarginLeft: '0',
    evalMarginRight: '0',
    showEvalTicks: true,
    evalZeroColor: '#d79b00',
    evalZeroOpacity: '100',
    evalZeroThickness: '7',
    hideProfileBg: false,
    useCustomProfileBgColor: false,
    profileBgColor: '#403a34',
    hidePhoto: false,
    hideFlagOption: false,
    hideRatingOption: false,
    hideMaterial: false,
    customPlayerOrder: false,
    playerOrderList: DEFAULT_ORDER,
    playerOrderGap12: '0',
    playerOrderGap23: '6',
    playerOrderGap34: '6',
    playerInfoLayout: 'default',
    photoRadius: '0',
    playerMargin: '0',
    playerProfileHeight: '45',
    playerProfileLeftMargin: '0',
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
    clockBorderColor: '#000000',
    clockBorderOpacity: '100',
    clockBorderWidth: '0',
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
    liveboardProfileHeight: '45',
    liveboardProfileLeftMargin: '0',
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

  let draggedItem = null;
  let cachedContentCssText = null;
  let layoutLockNoticeTimer = 0;
  let fontWeightMeasureRoot = null;

  const checkboxDefaultsTrue = new Set(
    Object.entries(DEFAULT_SETTINGS)
      .filter(([, value]) => value === true)
      .map(([key]) => key)
  );
  const FONT_INPUT_KEYS = new Set(['nameFont', 'clockFont', 'liveboardNameFont', 'liveboardTitleFont', 'liveboardClockFont']);
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
    const normalizeOrderToken = (item) => {
      const trimmed = String(item || '').trim().toLowerCase();
      const compact = trimmed.replace(/[\s+_-]/g, '');
      if (trimmed === 'title' || trimmed === 'name') return 'titleName';
      if (trimmed === 'flag' || compact === 'flag') return 'flag';
      if (trimmed === 'rating' || compact === 'rating') return 'rating';
      if (trimmed === 'titlename' || compact === 'titlename') return 'titleName';
      return '';
    };
    const list = String(value || '')
      .split(',')
      .map((item) => normalizeOrderToken(item))
      .filter(Boolean);

    const unique = [];
    for (const item of list) {
      if (!unique.includes(item)) unique.push(item);
    }
    for (const item of ORDER_ITEMS) {
      if (!unique.includes(item)) unique.push(item);
    }
    return unique;
  };

  const expandOrderValue = (value) => {
    return sanitizeOrderValue(value).flatMap((item) => ORDER_SEQUENCE_PARTS[item] || []);
  };

  const formatOrderGapLabel = (left, right) => {
    const leftLabel = ORDER_PART_LABELS[left];
    const rightLabel = ORDER_PART_LABELS[right];
    return leftLabel && rightLabel ? `Gap ${leftLabel}-${rightLabel}` : 'Gap';
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

    const toggleKey = FONT_UI_TOGGLE_BY_KEY[key];
    if (toggleKey && elements[toggleKey] && !elements[toggleKey].checked) {
      input.classList.remove('font-missing');
      status.textContent = '';
      return;
    }

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
    if (config.toggleKey && elements[config.toggleKey] && !elements[config.toggleKey].checked) {
      enabled = false;
      reason = '';
    } else if (css) {
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
      updatePlayerOrderGapLabels();
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
    updatePlayerOrderGapLabels();
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

  const syncLiveboardBackgroundControls = () => {
    if (!elements.showLiveboardBg || !elements.liveboardBgColor) return;

    const backgroundVisible = Boolean(elements.showLiveboardBg.checked);

    elements.liveboardBgColor.disabled = !backgroundVisible;

    if (showLiveboardBgRow) {
      showLiveboardBgRow.classList.remove('is-disabled');
    }
    if (liveboardBgColorRow) {
      liveboardBgColorRow.classList.toggle('is-disabled', !backgroundVisible);
    }
  };

  const syncLiveboardBoardColorControls = () => {
    if (
      !elements.useCustomLiveboardBoardColors ||
      !elements.liveboardBoardLightColor ||
      !elements.liveboardBoardDarkColor
    ) {
      return;
    }

    const customEnabled = Boolean(elements.useCustomLiveboardBoardColors.checked);
    elements.liveboardBoardLightColor.disabled = !customEnabled;
    elements.liveboardBoardDarkColor.disabled = !customEnabled;

    if (useCustomLiveboardBoardColorsRow) {
      useCustomLiveboardBoardColorsRow.classList.remove('is-disabled');
    }
    if (liveboardBoardLightColorRow) {
      liveboardBoardLightColorRow.classList.toggle('is-disabled', !customEnabled);
    }
    if (liveboardBoardDarkColorRow) {
      liveboardBoardDarkColorRow.classList.toggle('is-disabled', !customEnabled);
    }
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

  const syncLiveboardCustomControls = () => {
    return;
  };

  const collectSettingsFromUi = () => {
    syncCustomOrderLayoutLock();
    syncProfileBackgroundControls();
    syncLiveboardBackgroundControls();
    syncLiveboardBoardColorControls();
    syncInheritedLiveboardRadiusControls();
    syncLiveboardCustomControls();
    const settings = {};
    for (const key in elements) {
      if (elements[key].type === 'checkbox') {
        settings[key] = elements[key].checked;
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

  const clearTransientUiState = () => {
    if (layoutLockNoticeTimer) {
      clearTimeout(layoutLockNoticeTimer);
      layoutLockNoticeTimer = 0;
    }
    if (playerInfoLayoutLockNotice) {
      playerInfoLayoutLockNotice.classList.remove('is-visible');
      playerInfoLayoutLockNotice.textContent = '';
    }
    if (elements.playerInfoLayout) {
      delete elements.playerInfoLayout.dataset.manualValue;
      elements.playerInfoLayout.disabled = false;
      elements.playerInfoLayout.removeAttribute('title');
    }
    if (playerInfoLayoutRow) {
      playerInfoLayoutRow.classList.remove('is-locked', 'is-disabled');
    }
    for (const weightKey in FONT_WEIGHT_CONFIG) {
      const control = elements[weightKey];
      if (!control) continue;
      delete control.dataset.manualValue;
      control.disabled = false;
      control.removeAttribute('title');
    }
  };

  const applySettingsToUi = (settings) => {
    clearTransientUiState();
    for (const key in elements) {
      if (settings[key] === undefined) continue;
      if (elements[key].type === 'checkbox') {
        elements[key].checked = Boolean(settings[key]);
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

    syncCustomOrderLayoutLock();
    syncProfileBackgroundControls();
    syncLiveboardBackgroundControls();
    syncLiveboardBoardColorControls();
    syncInheritedLiveboardRadiusControls();
    updateSliderLabels();
    updateAllFontUiStates();
    syncLiveboardCustomControls();
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
    const liveboardScale = clamp(parseNumber(defaults.liveboardScale, 82), 55, 140) / 100;
    const liveboardFlagScale = clamp(parseNumber(defaults.liveboardFlagScale, 100), 60, 160) / 100;
    const liveboardTextScale = clamp(parseNumber(settings.liveboardTextScale, parseNumber(defaults.liveboardTextScale, 100)), 60, 180) / 100;
    const liveboardNameScale = clamp(parseNumber(settings.liveboardNameScale, parseNumber(defaults.liveboardNameScale, 100)), 60, 180) / 100;
    const liveboardTitleScale = clamp(parseNumber(settings.liveboardTitleScale, parseNumber(defaults.liveboardTitleScale, 100)), 60, 180) / 100;
    const liveboardClockScale = clamp(parseNumber(settings.liveboardClockScale, parseNumber(defaults.liveboardClockScale, 100)), 60, 180) / 100;
    const liveboardEvalBarWidth = clamp(
      parseNumber(settings.liveboardEvalBarWidth, parseNumber(defaults.liveboardEvalBarWidth, 4)),
      1,
      12
    );
    const liveboardEvalBarGap = Math.max(0, parseNumber(defaults.liveboardEvalBarGap, 4));

    setVar('--bc-page-bg', settings.pageBgColor || defaults.pageBgColor);
    setVar('--bc-display-header', settings.hideHeader ? 'none' : 'flex');
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
    setVar('--bc-display-rating', settings.hideRatingOption ? 'none' : 'inline');
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
    setVar('--bc-liveboard-panel-bg', defaults.liveboardBgColor);
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
    if (resolvedLiveboardNameFont) setVar('--bc-liveboard-name-font', resolvedLiveboardNameFont);
    if (resolvedLiveboardTitleFont) setVar('--bc-liveboard-title-font', resolvedLiveboardTitleFont);
    if (settings.useCustomLiveboardBoardColors) {
      setVar('--bc-liveboard-board-light', settings.liveboardBoardLightColor || defaults.liveboardBoardLightColor);
      setVar('--bc-liveboard-board-dark', settings.liveboardBoardDarkColor || defaults.liveboardBoardDarkColor);
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
  display: inline-flex !important;
  align-items: center !important;
  line-height: 1.12 !important;
  font-size: var(--bc-rating-size, 0.9em) !important;
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
    const knownKeys = new Set([...Object.keys(elements), 'playerOrderList', 'hideLiveboardBg', 'useCustomLiveboardBgColor']);
    const legacySettings = {};
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
      } else if (key === 'hideLiveboardBg' || key === 'useCustomLiveboardBgColor') {
        const boolValue = parseBooleanSetting(rawValue);
        if (boolValue !== null) legacySettings[key] = boolValue;
      } else if (key === 'playerOrderList') {
        parsed[key] = sanitizeOrderValue(parseQuotedValue(rawValue)).join(',');
      } else {
        parsed[key] = parseQuotedValue(rawValue);
      }

      match = declarationRegex.exec(cssText);
    }

    if (parsed.showLiveboardBg === undefined && legacySettings.hideLiveboardBg !== undefined) {
      parsed.showLiveboardBg = !legacySettings.hideLiveboardBg;
    }

    if (legacySettings.useCustomLiveboardBgColor === false) {
      parsed.liveboardBgColor = getDefaultSettings().liveboardBgColor;
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
    syncLiveboardBackgroundControls();
    syncLiveboardBoardColorControls();
    updateSliderLabels();
    updateAllFontUiStates();
    syncLiveboardCustomControls();
    const settings = collectSettingsFromUi();

    chrome.storage.sync.set(settings, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "updateStyles", settings });
        }
      });
    });
  };

  chrome.storage.sync.get(
    [...Object.keys(elements), 'playerOrderList', 'hideLiveboardBg', 'useCustomLiveboardBgColor'],
    (result) => {
      const initialSettings = { ...getDefaultSettings() };
      for (const key in elements) {
        if (result[key] !== undefined) {
          initialSettings[key] = result[key];
        }
      }
      if (result.showLiveboardBg === undefined && result.hideLiveboardBg !== undefined) {
        initialSettings.showLiveboardBg = !Boolean(result.hideLiveboardBg);
      }
      if (result.showLiveboardBg === undefined && result.useCustomLiveboardBgColor === false) {
        initialSettings.liveboardBgColor = getDefaultSettings().liveboardBgColor;
      }
      initialSettings.playerOrderList = result.playerOrderList || DEFAULT_ORDER;
      applySettingsToUi(initialSettings);
    }
  );

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

  for (const liveboardKey of Object.keys(LIVEBOARD_RADIUS_INHERIT_MAP)) {
    const control = elements[liveboardKey];
    if (!control) continue;
    const markCustomized = () => {
      control.dataset.inherit = '0';
    };
    control.addEventListener('input', markCustomized, true);
    control.addEventListener('change', markCustomized, true);
  }

  for (const sourceKey of Object.values(LIVEBOARD_RADIUS_INHERIT_MAP)) {
    const control = elements[sourceKey];
    if (!control) continue;
    const syncInheritedControls = () => {
      syncInheritedLiveboardRadiusControls();
      updateSliderLabels();
    };
    control.addEventListener('input', syncInheritedControls);
    control.addEventListener('change', syncInheritedControls);
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
      syncLiveboardCustomControls();
    }).catch(() => {});
  }

  if (playerInfoLayoutRow) {
    playerInfoLayoutRow.addEventListener('click', () => {
      showPlayerInfoLayoutLockNotice();
    });
  }

  wireOrderDnD();
});
