(function attachLiBroadcastShared(globalScope) {
  const LEGACY_PLAYER_ORDER_ITEMS = Object.freeze(['title', 'name', 'flag', 'rating']);
  const PLAYER_ORDER_ITEMS = Object.freeze(['titleName', 'flag', 'rating']);
  const PLAYER_ORDER_PARTS = Object.freeze({
    titleName: Object.freeze(['title', 'name']),
    flag: Object.freeze(['flag']),
    rating: Object.freeze(['rating'])
  });
  const DEFAULT_PLAYER_ORDER = PLAYER_ORDER_ITEMS.join(',');

  const DEFAULT_SETTINGS = Object.freeze({
    hideHeader: false,
    hideChat: false,
    hideMoveTable: false,
    hideSide: false,
    hideClocks: false,
    hideLiveboardClocks: false,
    hideLiveboardPhoto: true,
    hideLiveboardFlag: true,
    hideUnderboard: false,
    hideEval: false,
    hideBoardCoords: true,
    hideBoardResizeHandle: true,
    useCustomBoardColors: true,
    boardLightColor: '#f0d9b5',
    boardDarkColor: '#b58863',
    arrowPrimaryColor: '#15781b',
    arrowSecondaryColor: '#882020',
    arrowTertiaryColor: '#003088',
    arrowQuaternaryColor: '#e68f00',
    engineArrowColor: '#003088',
    engineArrowOpacity: '40',
    boardRadius: '0',
    lastMoveColor: '#9bc700',
    lastMoveOpacity: '41',
    evalBarWidth: '30',
    evalBarRadius: '0',
    evalMarginLeft: '0',
    evalMarginRight: '30',
    showEvalTicks: true,
    evalZeroColor: '#171717',
    evalZeroOpacity: '100',
    evalZeroThickness: '5',
    hideProfileBg: false,
    useCustomProfileBgColor: true,
    profileBgColor: '#212121',
    hidePhoto: false,
    hideFlagOption: false,
    hideRatingOption: false,
    hideMaterial: true,
    customPlayerOrder: false,
    playerOrderList: DEFAULT_PLAYER_ORDER,
    playerOrderGap12: '0',
    playerOrderGap23: '6',
    playerOrderGap34: '6',
    playerInfoLayout: 'inline',
    photoRadius: '0',
    playerMargin: '0',
    playerProfileHeight: '45',
    playerProfileLeftMargin: '0',
    underboardMargin: '30',
    pageBgColor: '#161512',
    nameFont: '',
    nameFontWeight: '',
    profileItemSize: '18',
    scaleTitle: true,
    scaleName: true,
    scaleRating: true,
    scaleFlag: true,
    nameColor: '',
    nameOpacity: '100',
    titleColor: '#ffaa00',
    titleOpacity: '100',
    ratingColor: '#aaaaaa',
    ratingOpacity: '100',
    clockFont: '',
    clockFontWeight: '',
    clockRadius: '0',
    clockBorderColor: '#000000',
    clockBorderOpacity: '100',
    clockBorderWidth: '0',
    hideClockPauseIcon: false,
    clockWhiteColor: '#262421',
    clockWhiteTextOpacity: '100',
    clockWhiteBgColor: '#ffffff',
    clockWhiteBgOpacity: '100',
    clockBlackColor: '#ffffff',
    clockBlackTextOpacity: '100',
    clockBlackBgColor: '#262421',
    clockBlackBgOpacity: '100',
    useCustomLiveboardStyle: false,
    useCustomLiveboardBoardColors: false,
    liveboardBoardLightColor: '#f0d9b5',
    liveboardBoardDarkColor: '#b58863',
    liveboardPhotoRadius: '',
    liveboardBoardRadius: '',
    liveboardEvalBarRadius: '',
    liveboardClockRadius: '',
    liveboardProfileHeight: '45',
    liveboardProfileLeftMargin: '0',
    liveboardTextScale: '93',
    liveboardNameScale: '100',
    liveboardTitleScale: '100',
    liveboardScale: '82',
    liveboardFlagScale: '100',
    liveboardClockScale: '100',
    liveboardEvalBarWidth: '6',
    liveboardEvalBarGap: '4',
    liveboardNameFont: '',
    liveboardNameFontWeight: '',
    liveboardTitleFont: '',
    liveboardTitleColor: '#ffaa00',
    liveboardTitleOpacity: '100',
    liveboardClockFont: '',
    liveboardClockFontWeight: ''
  });

  const FONT_PRESETS = Object.freeze([
    Object.freeze({ label: 'Noto Sans', css: "'Noto Sans', sans-serif" }),
    Object.freeze({ label: 'Roboto', css: 'Roboto, sans-serif' }),
    Object.freeze({ label: 'System UI', css: "system-ui, -apple-system, 'Segoe UI', sans-serif" }),
    Object.freeze({ label: 'Arial', css: 'Arial, sans-serif' }),
    Object.freeze({ label: 'Verdana', css: 'Verdana, sans-serif' }),
    Object.freeze({ label: 'Trebuchet MS', css: "'Trebuchet MS', sans-serif" }),
    Object.freeze({ label: 'Tahoma', css: 'Tahoma, sans-serif' }),
    Object.freeze({ label: 'Times New Roman', css: "'Times New Roman', serif" }),
    Object.freeze({ label: 'Georgia', css: 'Georgia, serif' }),
    Object.freeze({ label: 'Courier New', css: "'Courier New', monospace" }),
    Object.freeze({ label: 'Lucida Console', css: "'Lucida Console', monospace" })
  ]);

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
  }

  function normalizeFontLabel(value) {
    return stripMatchingQuotes(value).replace(/\s+/g, ' ').toLowerCase();
  }

  function normalizeFontStack(value) {
    return parseFontFamilies(value)
      .map((family) => family.replace(/\s+/g, ' ').toLowerCase())
      .join(',');
  }

  const FONT_PRESET_BY_LABEL = new Map(FONT_PRESETS.map((preset) => [normalizeFontLabel(preset.label), preset]));
  const FONT_PRESET_BY_STACK = new Map(FONT_PRESETS.map((preset) => [normalizeFontStack(preset.css), preset]));

  function resolveFontSetting(value) {
    const rawValue = String(value || '').trim();
    if (!rawValue) {
      return { label: '', css: '', families: [], preset: null };
    }

    const preset =
      FONT_PRESET_BY_LABEL.get(normalizeFontLabel(rawValue)) ||
      FONT_PRESET_BY_STACK.get(normalizeFontStack(rawValue)) ||
      null;

    if (preset) {
      return {
        label: preset.label,
        css: preset.css,
        families: parseFontFamilies(preset.css),
        preset
      };
    }

    const families = parseFontFamilies(rawValue);
    return {
      label: rawValue,
      css: rawValue,
      families,
      preset: null
    };
  }

  function resolveFontCssValue(value) {
    return resolveFontSetting(value).css;
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

    const normalizedItems = String(value || '')
      .split(',')
      .map((item) => normalizeOrderToken(item))
      .filter(Boolean);

    const uniqueItems = [];
    for (const item of normalizedItems) {
      if (!uniqueItems.includes(item)) uniqueItems.push(item);
    }
    for (const item of PLAYER_ORDER_ITEMS) {
      if (!uniqueItems.includes(item)) uniqueItems.push(item);
    }
    return uniqueItems;
  }

  function resolvePlayerOrder(settings) {
    const listFromString = normalizePlayerOrderList(settings.playerOrderList);
    if (listFromString.length === PLAYER_ORDER_ITEMS.length) return listFromString;

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

  globalScope.LiBroadcastShared = Object.freeze({
    DEFAULT_PLAYER_ORDER,
    DEFAULT_SETTINGS,
    FONT_PRESETS,
    LEGACY_PLAYER_ORDER_ITEMS,
    PLAYER_ORDER_ITEMS,
    PLAYER_ORDER_PARTS,
    normalizeFontLabel,
    normalizeFontStack,
    normalizePlayerOrderList,
    parseFontFamilies,
    resolveFontCssValue,
    resolveFontSetting,
    resolvePlayerOrder,
    stripMatchingQuotes
  });
})(globalThis);
