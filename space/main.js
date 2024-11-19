const GameBoundary = document.getElementById('gameBoundary');
const GameScore = document.getElementById('gameScore');

const GameRule = {
  spaceshipSpd: 5,
  spaceshipX: 0,
  spaceshipAmmo: 4,
  spaceshipShootCount: 0,
  isReloading: false, // To prevent setTimeout from stacking

  enemyShipSpd: 1.4,
  gameScore: 0,

  getElemPos(parent, child) {
    const childRect = child.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    return { x: childRect.left - parentRect.left, y: childRect.top - parentRect.top };  
  },

  scrollBgSpd: 0.4,
  bgY: 0
};

class EnemyShip {
  constructor(x, y, speed) {
    this.element = document.createElement('div');
    this.element.classList.add('enemyShip');
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    GameBoundary.appendChild(this.element);

    this.speed = speed;
    this.isDestroyed = false;

    this.moveInterval = setInterval(() => this.move(), 16);
  }

  move() {
    if (this.isDestroyed) return;

    const currentY = parseFloat(this.element.style.top);
    this.element.style.top = `${currentY + this.speed}px`;

    // 50 means height of the EnemyShip
    if (currentY > (GameBoundary.clientHeight - 50)) {
      this.destroy();
      GameRule.gameScore -= 5;
      console.log('hi')
    }
  }

  destroy() {
    this.isDestroyed = true;
    clearInterval(this.moveInterval);
    this.element.remove();
  }
}

function spawnEnemies() {
  setInterval(() => {
    const enemyX = Math.random() * (GameBoundary.clientWidth - 50); // 50 means width of the EnemyShip
    new EnemyShip(enemyX, 0, GameRule.enemyShipSpd);
  }, 2000);
}

function checkIfEnemyShot() {
  const bullets = Array.from(document.getElementsByClassName('isBullet'));
  const enemies = Array.from(document.getElementsByClassName('enemyShip'));

  bullets.forEach((bullet) => {
    const bulletRect = bullet.getBoundingClientRect();
    enemies.forEach((enemy) => {
      const enemyRect = enemy.getBoundingClientRect();

      if (
        bulletRect.left < enemyRect.right &&
        bulletRect.right > enemyRect.left &&
        bulletRect.top < enemyRect.bottom &&
        bulletRect.bottom > enemyRect.top
      ) {
        bullet.remove();
        enemy.remove();
        enemy.isDestroyed = true;

        GameRule.gameScore += 10;
      }
    });
  });
};

function spawnAndShootBullets() {
  const spaceship = document.getElementById('spaceship');
  const { x, y } = GameRule.getElemPos(GameBoundary, spaceship);

  const bullet = document.createElement('div');
  bullet.classList.add('isBullet');
  bullet.style.left = `${x + 20}px`; // 20 means. bullet width + 4(to center it to spaceship)
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

function updateEveryFrame() {
  GameRule.bgY += GameRule.scrollBgSpd;
  GameBoundary.style.backgroundPositionY = `${GameRule.bgY}px`;

  // Might as well change the score text
  checkIfEnemyShot();
  GameScore.textContent = `Score: ${GameRule.gameScore} Ammo: ${GameRule.spaceshipAmmo - GameRule.spaceshipShootCount}/${GameRule.spaceshipAmmo}${GameRule.spaceshipShootCount >= GameRule.spaceshipAmmo ? '(Press spacebar to reload)' : ''}`;

  requestAnimationFrame(updateEveryFrame);
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
  updateEveryFrame();
  spawnShip();
  spawnEnemies();
};

startup();