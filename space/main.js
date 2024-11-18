const GameBoundary = document.getElementById('gameBoundary');

const GameRule = {
  spaceshipSpd: 5,
  spaceshipX: 0,
  spaceshipAmmo: 4,
  spaceshipShootCount: 0,
  isReloading: false, // To prevent setTimeout from stacking

  scrollBgSpd: 0.4,
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
    case 'KEYD':
    case 'ARROWRIGHT':
      direction = 1;
      break;
    case 'KEYA':
    case 'ARROWLEFT':
      direction = -1;
      break;
    case 'SPACE':
      if (GameRule.spaceshipShootCount < GameRule.spaceshipAmmo) {
        GameRule.spaceshipShootCount++
        spawnAndShootBullets();
      } else if (!GameRule.isReloading) { 
        GameRule.isReloading = true;
        setTimeout(() =>{
          GameRule.spaceshipShootCount = 0;
          GameRule.isReloading = false;
        }, 1500); // 1.5 seconds CD
      }
      break;
  }

  moveShip(direction);
});

function startup() {
  scrollBackground();
  spawnShip();
};

startup();