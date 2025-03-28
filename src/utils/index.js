export const addKeyboardListener = (type, handler, param) => {
  document.addEventListener(type, (event) => handler(event, param));
};

const keyToProperty = {
  ArrowLeft: 'drivingLeft',
  ArrowRight: 'drivingRight',
  ArrowUp: 'drivingUp',
  ArrowDown: 'drivingDown',
};

export const keyDownHandler = (event, tank) => {
  const direction = keyToProperty[event.key];
  if (direction) {
    tank.isMoving = true;
    tank.movingDirection = direction;
  }
  if (event.key === ' ') {
    tank.shoot();
  }
};

export const keyUpHandler = (event, tank) => {
  const direction = keyToProperty[event.key];
  if (direction) {
    if (tank.movingDirection === direction) {
      tank.isMoving = false;
      //  tank.movingDirection = null;
    }
  }
};
