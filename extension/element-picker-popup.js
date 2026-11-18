const routes = {
  name: ['nameFontPreset', 'nameColor', 'playerInfoLayout'],
  title: ['titleColor', 'scaleTitle', 'playerInfoLayout'],
  flag: ['hideFlagOption', 'scaleFlag', 'playerInfoLayout'],
  rating: ['hideRatingOption', 'ratingColor', 'scaleRating'],
  photo: ['hidePhoto', 'photoRadius'],
  material: ['hideMaterial'],
  player: ['playerProfileHeight', 'playerInfoLayout', 'nameFontPreset'],
  whiteClock: ['clockWhiteColor', 'clockBorderWidth'],
  blackClock: ['clockBlackColor', 'clockBorderWidth'],
  board: ['useCustomBoardColors', 'lastMoveColor'],
  eval: ['evalBarWidth'],
  header: ['hideHeader'],
  games: ['hideSide'],
  liveboard: ['hideChat'],
  moves: ['hideMoveTable'],
  underboard: ['hideUnderboard'],
  background: ['pageBgColor'],
  liveGame: ['liveboardProfileHeight'],
  livePlayer: ['liveboardNameFontPreset'],
  liveFlag: ['hideLiveboardFlag'],
  livePhoto: ['hideLiveboardPhoto', 'liveboardPhotoRadius'],
  liveClock: ['liveboardClockScale', 'liveboardClockRadius'],
  liveBoard: ['useCustomLiveboardBoardColors', 'liveboardBoardRadius'],
  liveEval: ['liveboardEvalBarWidth', 'liveboardEvalBarRadius']
};

export async function initElementPicker(revealSettings) {
  const button = document.getElementById('pickElement');
  const status = document.getElementById('pickerStatus');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }).catch(() => []);

  if (tab?.id !== undefined) {
    const selection = await chrome.tabs.sendMessage(tab.id, { action: 'bc-picker:take' }).catch(() => null);
    if (selection && Object.hasOwn(routes, selection.key)) revealSettings(routes[selection.key]);
  }

  button.disabled = false;
  button.addEventListener('click', async () => {
    button.disabled = true;
    status.textContent = '';
    if (/^https?:\/\/lichess\.org\/broadcast\//.test(tab?.url)) {
      try {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'bc-picker:start' });
        if (response?.ok) {
          window.close();
          return;
        }
        status.textContent = 'Open a broadcast round to pick an element.';
      } catch {
        status.textContent = 'Reload the broadcast tab and try again.';
      }
    } else {
      status.textContent = 'Open a Lichess broadcast to pick an element.';
    }
    button.disabled = false;
    button.focus();
  });
}
