export const addKeyboardListener = (type, handler, param) => {
  document.addEventListener(type, (event) => handler(event, param));
};

export const keySpaceHandler = (event, callback) => {
  if (event.key === ' ') {
    callback();
  }
};

export const keyDownHandler = (event, moving) => {
  switch (event.key) {
    case 'ArrowUp':
      moving.isMoving = true;
      moving.up = true;
      break;
    case 'ArrowDown':
      moving.isMoving = true;
      moving.down = true;
      break;
    case 'ArrowLeft':
      moving.isMoving = true;
      moving.left = true;
      break;
    case 'ArrowRight':
      moving.isMoving = true;
      moving.right = true;
      break;
    default:
      console.log(`keydown ${event.key}`);
  }
};

export const keyUpHandler = (event, moving) => {
  switch (event.key) {
    case 'ArrowUp':
      moving.isMoving = false;
      moving.up = false;
      break;
    case 'ArrowDown':
      moving.isMoving = false;
      moving.down = false;
      break;
    case 'ArrowLeft':
      moving.isMoving = false;
      moving.left = false;
      break;
    case 'ArrowRight':
      moving.isMoving = false;
      moving.right = false;
      break;
    default:
      console.log(`Keyup: ${event.key}`);
  }
};
