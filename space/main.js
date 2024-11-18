const GameBoundary = document.getElementById('gameBoundary');

const GameRule = {
  scrollBgSpd: 0.4,
  bgY: 0
};

function scrollBackground() {
  GameRule.bgY += GameRule.scrollBgSpd;
  GameBoundary.style.backgroundPositionY = `${GameRule.bgY}px`;
  requestAnimationFrame(scrollBackground);
}

function startup() {
  scrollBackground();
};

startup();