export const addKeyboardListener = (type, handler, context) => {
  if (!context._listeners) {
    context._listeners = {};
  }
  context._listeners[type] = (event) => handler(event, context);
  document.addEventListener(type, context._listeners[type]);
};

export const mouseControls = (e, playerTank) => {
  const local = playerTank.mapContainer.toLocal(e.global);
  switch (e.button) {
    case 0:
      playerTank.setRotationToPoint(local.x, local.y, true, false);
      break;
    case 2:
      console.log('Правый клик');
      break;
    default:
      console.log('Другая кнопка');
  }
};

export const removeKeyboardListener = (type, context) => {
  if (!context._listeners) {
    return;
  }
  document.removeEventListener(type, context._listeners[type]);
  context._listeners[type] = null;
};

export const keyToProperty = {
  ArrowLeft: 'drivingLeft',
  ArrowRight: 'drivingRight',
  ArrowUp: 'drivingUp',
  ArrowDown: 'drivingDown',
};

export const keyDownHandler = (event, game) => {
  const direction = keyToProperty[event.key];
  if (direction) {
    game.tank.isMoving = true;
    game.tank.movingDirection = direction;
  }
  if (event.key === ' ') {
    game.tank.shoot();
  }

  if (event.key === '`') {
    game.addEnemy();
  }
};

export const menuControls = (event, game) => {
  if (event.key === 'Enter') {
    game.start();
  }
};

export const keyUpHandler = (event, game) => {
  const direction = keyToProperty[event.key];
  if (direction) {
    if (game.tank.movingDirection === direction) {
      game.tank.isMoving = false;
    }
  }
};

export const isCollision = (s1, s2) => {
  if (!s1 || !s2) return false;

  const b1 = s1.getBounds();
  const b2 = s2.getBounds();

  const isColliding =
    b1.x < b2.x + b2.width &&
    b1.x + b1.width > b2.x &&
    b1.y < b2.y + b2.height &&
    b1.y + b1.height > b2.y;

  if (!isColliding) return false;

  const b1CenterX = b1.x + b1.width / 2;
  const b1CenterY = b1.y + b1.height / 2;
  const b2CenterX = b2.x + b2.width / 2;
  const b2CenterY = b2.y + b2.height / 2;

  const dx = b1CenterX - b2CenterX;
  const dy = b1CenterY - b2CenterY;

  const halfWidths = (b1.width + b2.width) / 2;
  const halfHeights = (b1.height + b2.height) / 2;

  const overlapX = halfWidths - Math.abs(dx);
  const overlapY = halfHeights - Math.abs(dy);

  if (overlapX < overlapY) {
    return dx > 0 ? 'right' : 'left';
  } else {
    return dy > 0 ? 'bottom' : 'top';
  }
};

export const obstacleCollision = (s1, s2) => {
  if (!s1 || !s2) return false;

  const b1 = s1.getBounds();
  const b2 = s2.getBounds();

  return (
    b1.x < b2.x + b2.width &&
    b1.x + b1.width > b2.x &&
    b1.y < b2.y + b2.height &&
    b1.y + b1.height > b2.y
  );
};

export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getScreenSize = () => ({
  width: window.innerWidth - 20,
  height: window.innerHeight - 20,
});
