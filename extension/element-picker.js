(() => {
  const broadcast = 'main.analyse.is-relay';
  const mainBoard = '.analyse__board.main-board';
  const miniGame = ':is(.chat-liveboard, .relay-tour > .study__multiboard) .mini-game';
  const player = '.relay-board-player';

  // Match specific targets before their enclosing regions.
  const targets = [
    ['liveClock', 'Liveboard clock', `${miniGame} :is(.analyse__clock, .mini-game__clock)`],
    ['livePhoto', 'Liveboard player photo', `${miniGame} .relay-board-player__photo`],
    ['liveFlag', 'Liveboard player flag', `${miniGame} .mini-game__flag`],
    ['liveEval', 'Liveboard evaluation bar', `${miniGame} .mini-game__gauge`],
    ['liveBoard', 'Liveboard playing surface', `${miniGame} .mini-game__board`],
    ['livePlayer', 'Liveboard player', `${miniGame} :is(${player}, .mini-game__player)`],
    ['liveGame', 'Liveboard game', miniGame],
    ['blackClock', 'Top player clock', `${mainBoard} .relay-board-player-top .analyse__clock`],
    ['whiteClock', 'Bottom player clock', `${mainBoard} .relay-board-player-bot .analyse__clock`],
    ['photo', 'Player photo', `${mainBoard} ${player} .relay-board-player__photo`],
    ['title', 'Player title', `${mainBoard} ${player} .utitle`],
    ['name', 'Player name', `${mainBoard} ${player} .name`],
    ['flag', 'Player flag', `${mainBoard} ${player} .mini-game__flag`],
    ['rating', 'Player rating', `${mainBoard} ${player} .elo`],
    ['material', 'Captured pieces', `${mainBoard} ${player} .material`],
    ['player', 'Player profile', `${mainBoard} ${player}`],
    ['eval', 'Evaluation bar', `${broadcast} .eval-gauge`],
    ['board', 'Main board', `${mainBoard} .cg-wrap`],
    ['header', 'Top menu', '#top, .site-header'],
    ['games', 'Games list', '.relay-tour__side, .study__side'],
    ['liveboard', 'Liveboard', '.mchat, .mchat-mod, .study__multiboard'],
    ['moves', 'Move list and tools', '.analyse__tools, .analyse__controls'],
    ['underboard', 'Underboard panel', '.analyse__underboard']
  ];

  let stopPicking;
  let selection;
  let dismissNotice;

  function findTarget(x, y) {
    const hit = document.elementFromPoint(x, y);
    if (!hit) return null;
    for (const [key, label, selector] of targets) {
      const element = hit.closest(selector);
      if (element) return { key, label, element };
    }
    if (hit.matches(`html, body, #main-wrap, ${broadcast}`)) {
      return { key: 'background', label: 'Page background', element: hit };
    }
    return null;
  }

  function createOverlay(message) {
    const overlay = document.createElement('div');
    overlay.id = 'bc-element-picker';
    const bar = document.createElement('div');
    bar.className = 'bc-picker-bar';
    const hint = document.createElement('span');
    hint.setAttribute('role', 'status');
    hint.textContent = message;
    const button = document.createElement('button');
    button.type = 'button';
    bar.append(hint, button);
    overlay.append(bar);
    document.documentElement.append(overlay);
    return { overlay, hint, button };
  }

  function showReopenNotice() {
    const { overlay, button } = createOverlay('Open LiBroadcastEditor to edit the selected element.');
    button.textContent = 'Dismiss';
    dismissNotice = () => {
      overlay.remove();
      dismissNotice = undefined;
    };
    button.addEventListener('click', () => {
      selection = undefined;
      dismissNotice();
    });
  }

  function startPicking() {
    stopPicking?.();
    dismissNotice?.();
    selection = undefined;
    const instruction = 'Click an element to edit its settings.';
    const { overlay, hint, button } = createOverlay(instruction);
    overlay.classList.add('bc-picking');
    button.textContent = 'Cancel';
    button.title = 'Cancel (Esc)';
    const outline = document.createElement('div');
    outline.className = 'bc-picker-outline';
    outline.hidden = true;
    overlay.append(outline);

    const controller = new AbortController();
    const options = { signal: controller.signal };
    const previousFocus = document.activeElement;
    stopPicking = (restoreFocus = true) => {
      const shouldRestore = restoreFocus && overlay.contains(document.activeElement);
      controller.abort();
      overlay.remove();
      stopPicking = undefined;
      if (shouldRestore) previousFocus?.focus({ preventScroll: true });
    };
    button.focus({ preventScroll: true });
    button.addEventListener('click', () => stopPicking(), options);

    let point;
    function targetAt(x, y) {
      // Hit-test the page behind the glass without exposing clicks to Lichess.
      overlay.classList.add('bc-picker-hit-test');
      try {
        return findTarget(x, y);
      } finally {
        overlay.classList.remove('bc-picker-hit-test');
      }
    }
    function renderOutline() {
      const target = point && targetAt(point.x, point.y);
      outline.hidden = !target;
      const message = target ? 'Click to edit ' + target.label.toLowerCase() : instruction;
      if (hint.textContent !== message) hint.textContent = message;
      if (!target) return;
      const { top, left, right, bottom } = target.element.getBoundingClientRect();
      const x = Math.max(0, left);
      const y = Math.max(0, top);
      outline.style.left = x + 'px';
      outline.style.top = y + 'px';
      outline.style.width = Math.max(0, Math.min(innerWidth, right) - x) + 'px';
      outline.style.height = Math.max(0, Math.min(innerHeight, bottom) - y) + 'px';
    }

    overlay.addEventListener('pointermove', event => {
      point = event.target.closest('.bc-picker-bar') ? undefined : { x: event.clientX, y: event.clientY };
      renderOutline();
    }, options);
    overlay.addEventListener('pointerleave', () => {
      point = undefined;
      renderOutline();
    }, options);
    overlay.addEventListener('contextmenu', event => event.preventDefault(), options);
    window.addEventListener('scroll', renderOutline, { ...options, capture: true, passive: true });
    window.addEventListener('resize', renderOutline, options);
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        stopPicking();
      }
    }, { ...options, capture: true });
    window.addEventListener('pagehide', () => stopPicking(false), options);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopPicking(false);
    }, options);

    overlay.addEventListener('click', async event => {
      if (event.target.closest('.bc-picker-bar')) return;
      event.preventDefault();
      event.stopPropagation();
      const target = targetAt(event.clientX, event.clientY);
      if (!target) {
        hint.textContent = 'Choose an outlined element on the broadcast.';
        return;
      }
      stopPicking();
      const picked = { key: target.key };
      selection = picked;
      try {
        const result = await chrome.runtime.sendMessage({ action: 'bc-picker:open-popup' });
        if (result?.ok) return;
      } catch {
        // The next manual opening can still retrieve the selection from this tab.
      }
      if (selection === picked) showReopenNotice();
    }, options);
  }

  chrome.runtime.onMessage.addListener((request, sender, respond) => {
    if (request.action === 'bc-picker:start') {
      if (!document.querySelector(broadcast)) {
        respond({ ok: false });
        return;
      }
      startPicking();
      respond({ ok: true });
    } else if (request.action === 'bc-picker:take') {
      stopPicking?.(false);
      dismissNotice?.();
      respond(selection ?? null);
      selection = undefined;
    }
  });
})();
