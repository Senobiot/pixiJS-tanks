export const addKeyboardListener = (type, handler, context) => {
  if (!context._listeners) {
    context._listeners = {};
  }
  context._listeners[type] = (event) => handler(event, context);
  document.addEventListener(type, context._listeners[type]);
};

export const removeKeyboardListener = (type, context) => {
  document.removeEventListener(type, context._listeners[type]);
  context._listeners[type] = null;
};

export const startGame = (type, handler, context) => {};

const keyToProperty = {
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

export const keyUpHandler = (event, game) => {
  const direction = keyToProperty[event.key];
  if (direction) {
    if (game.tank.movingDirection === direction) {
      game.tank.isMoving = false;
      //  tank.movingDirection = null;
    }
  }
};

export const isCollision = (s1, s2) => {
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
