// Lichess owns this setting, even when its Multiboard controls aren't mounted.
document.addEventListener('bc:show-liveboard-evaluation', () => {
  const evaluation = globalThis.site?.analysis?.study?.multiCloudEval;
  if (evaluation && !evaluation.showEval()) evaluation.showEval(true);
});
