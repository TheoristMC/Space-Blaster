const GameBoundary = document.getElementById('gameBoundary');
const GameScore = document.getElementById('gameScore');

const GameRule = {
  spaceshipSpd: 5,
  spaceshipX: 0,
  spaceshipAmmo: 4,
  spaceshipShootCount: 0,
  isReloading: false, // To prevent setTimeout from stacking

  getElemPos(parent, child) {
    const childRect = child.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    return { x: childRect.left - parentRect.left, y: childRect.top - parentRect.top };  
  },

  scrollBgSpd: 0.4,
  bgY: 0
};

function spawnAndShootBullets() {
  const spaceship = document.getElementById('spaceship');
  const { x, y } = GameRule.getElemPos(GameBoundary, spaceship);

  const bullet = document.createElement('div');
  bullet.classList.add('isBullet');
  bullet.style.left = `${x + 20}px`; // 18 means. bullet width + 4(to center it to spaceship)
  bullet.style.top = `${y}px`;

  GameBoundary.appendChild(bullet);

  // Shoot the bullet
  let bulletY = 0;

  const bulletInterval = setInterval(() => {
    bulletY += -5;
    bullet.style.transform = `translateY(${bulletY}px)`;

    if (Math.abs(bulletY) > (GameBoundary.clientHeight - (spaceship.clientHeight * 2) - bullet.clientHeight)) {
      clearInterval(bulletInterval);
      bullet.remove();
    }
  }, 16);
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

function scrollBackgroundAndUpdateScore() {
  GameRule.bgY += GameRule.scrollBgSpd;
  GameBoundary.style.backgroundPositionY = `${GameRule.bgY}px`;

  // Might as well change the score text
  GameScore.textContent = `Score: 0 Ammo: ${GameRule.spaceshipAmmo - GameRule.spaceshipShootCount}/${GameRule.spaceshipAmmo}${GameRule.spaceshipShootCount >= GameRule.spaceshipAmmo ? '(Press spacebar to reload)' : ''}`;

  requestAnimationFrame(scrollBackgroundAndUpdateScore);
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
        }, 1000); // 1 seconds CD
      }
      break;
  }

  moveShip(direction);
});

function startup() {
  scrollBackgroundAndUpdateScore();
  spawnShip();
};

startup();