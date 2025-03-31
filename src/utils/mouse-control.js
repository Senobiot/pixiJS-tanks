import { keyToProperty } from ".";

let isRightBtnPress = false;
let direction = null;

export const addGameListener = (type, handler, param) => {
  param.app.canvas.addEventListener(type, (e) => handler(e, param));
};

export const canvasContextMenu = (e, game) => {
  e.preventDefault();
};

export const canvasMouseDown = (e, game) => {
  if (!game.tank) return;
  if (e.button === 0) game.tank.shoot();
  if (e.button === 2) {
    isRightBtnPress = true;
  }
}

export const canvasMouseUp = (event, game) => {
  if (!game.tank) return;
  if (event.button === 2) {
    isRightBtnPress = false;
    direction = null;
    game.tank.isMoving = false;
  }
};

export const canvasMouseMove = (e, game) => {
  if (!game.tank) return;
  setDirection(e, game);
  if (isRightBtnPress) {
    if (direction) {
      game.tank.isMoving = true;
      game.tank.movingDirection = direction;
    }
  }
};

export const setDirection = (e, game) => {
  const { x, y } = game.app.canvas.getBoundingClientRect(); //canvas coordinates
  const { clientX, clientY } = e;                           //mouse coordinates
  const mouseX = clientX - x;                               //mouseX by tank coordinates
  const mouseY = clientY - y;                               //mouseY by tank coordinates
  const tankX = game.getTankCoordinates().x;                //tankX coordinates
  const tankY = game.getTankCoordinates().y;                //tankY coordinates

  const nX = mouseX - tankX;
  const nY = mouseY - tankY;
  const nXA = Math.abs(nX);
  const nYA = Math.abs(nY);

  if (nX < 0 && nY < 0) {
    if (nXA > nYA) direction = keyToProperty.ArrowLeft;
    else direction = keyToProperty.ArrowUp;
  } else if (nX > 0 && nY < 0) {
    if (nXA > nYA) direction = keyToProperty.ArrowRight;
    else direction = keyToProperty.ArrowUp;
  } else if (nX > 0 && nY > 0) {
    if (nXA > nYA) direction = keyToProperty.ArrowRight;
    else direction = keyToProperty.ArrowDown;
  } else if (nX < 0 && nY > 0) {
    if (nXA > nYA) direction = keyToProperty.ArrowLeft;
    else direction = keyToProperty.ArrowDown;
  }
}
