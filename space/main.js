const GameBoundary = document.getElementById('gameBoundary');

const GameRule = {
  scrollBgSpd: 0.4,
  spaceshipSpd: 5,
  spaceshipX: 0,
  bgY: 0
};

function spawnAndShootBullets() {
  const spaceship = document.getElementById('spaceship');

  const bullet = document.createElement('div');
  bullet.classList.add('isBullet');

  spaceship.appendChild(bullet);

  // Shoot the bullet
  let bulletY = 0;

  const bulletInterval = setInterval(() => {
    bulletY += -5;
    bullet.style.transform = `translateY(${bulletY}px)`;

    if (Math.abs(bulletY) > (GameBoundary.clientHeight - spaceship.clientHeight - bullet.clientHeight)) {
      clearInterval(bulletInterval);
      bullet.remove();
    }
  }, 16); // Approx. 60 fps
};

function moveShip(direction) {
  const spaceship = document.getElementById('spaceship');

  const newSpaceshipX = GameRule.spaceshipX + GameRule.spaceshipSpd * direction;

  if (newSpaceshipX >= 0 && newSpaceshipX <= (GameBoundary.clientWidth - spaceship.clientWidth)) {
    GameRule.spaceshipX = newSpaceshipX;
    spaceship.style.transform = `translateX(${GameRule.spaceshipX}px)`;
  }
};

function spawnShip() {
  const spaceship = document.createElement('div');
  spaceship.id = 'spaceship';

  GameBoundary.appendChild(spaceship);
};

function scrollBackground() {
  GameRule.bgY += GameRule.scrollBgSpd;
  GameBoundary.style.backgroundPositionY = `${GameRule.bgY}px`;
  requestAnimationFrame(scrollBackground);
};

document.addEventListener('keydown', (ev) => {
  let direction = 0;

  switch (ev.code.toString().toUpperCase()) {
    case 'ARROWRIGHT':
      direction = 1;
      break;
    case 'ARROWLEFT':
      direction = -1;
      break;
    case 'SPACE':
      spawnAndShootBullets();
      break;
  }

  moveShip(direction);
});

function startup() {
  scrollBackground();
  spawnShip();
};

startup();