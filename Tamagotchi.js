class Tamagotchi {
  constructor(canvas) {
    this.sprite = {
      image: new Image(),
      height: 480,
      width: 360,
      rows: 4,
      columns: 3,
      frameCount: 3,
    };

    this.sprite.image.src = 'images/TamagotchiSprite.png';

    this.sprite.frameWidth = this.sprite.width / this.sprite.columns;
    this.sprite.frameHeight = this.sprite.height / this.sprite.rows;

    this.animation = {
      dislike: 0,
      jump: 1,
      eat: 2,
      bounce: 3,
      move: 3,
    };

    this.initialPositionX = (canvas.width / 2) - (this.sprite.frameWidth / 2);
    this.initialPositionY = 0;

    this.positionX = (canvas.width / 2) - (this.sprite.frameWidth / 2);
    this.positionY = 0;
    this.ms = 300;

    this.eatCount = 0;
    this.maxEat = 10;

    this.reset = this.reset.bind(this);
    this.drawFrame = this.drawFrame.bind(this);
    this.idle = this.idle.bind(this);
    this.dislike = this.dislike.bind(this);
    this.eat = this.eat.bind(this);
    this.jump = this.jump.bind(this);
    this.moveRight = this.move.bind(this, this.animation.move, 'right', 40);
    this.moveLeft = this.move.bind(this, this.animation.move, 'left', 40);
    this.bounce = this.bounce.bind(this);
  }

  reset() {
    this.positionX = this.initialPositionX;
    this.positionY = this.initialPositionY;
  }

  drawFrame(action, frame, positionX = this.positionX, positionY = this.positionY) {
    const {
      image,
      frameCount,
      frameHeight,
      frameWidth,
    } = this.sprite;

    const {
      animation,
    } = this;

    return () => context.drawImage(image,
      frame * frameWidth, animation[action] * frameHeight,
      frameWidth, frameHeight,
      positionX, positionY,
      frameWidth, frameHeight);
  }

  idle() {
    function* animation() {
      yield* this.bounce();
      yield this.moveRight();
      yield this.moveRight();
      yield this.moveLeft();
      yield this.moveLeft();
      yield this.moveLeft();
      yield* this.bounce();
      yield this.moveRight();
    };

    return animation.bind(this);
  }

  feed() {
    // Check if eatCount === maxEat
    // If not, eat()
    // If yes, dislike()
  }

  poop() {
    // If eatCount === maxEat
    // poop()
    // decrement eatCount
  }

  dislike() {
    const {
      image,
      frameCount,
      frameHeight,
      frameWidth,
    } = this.sprite;

    const {
      animation,
    } = this;

    var currentFrame = 0;
    var increment = 1;

    return animate((resolve) => {
      context.drawImage(image, currentFrame * frameWidth, animation.dislike * frameHeight, frameWidth, frameHeight, this.positionX, 0, frameWidth, frameHeight);

      if (currentFrame === 1) {
        resolve();
        return true;
      }

      currentFrame += increment;
    }, this.ms);
  }

  eat() {
    const {
      image,
      frameCount,
      frameHeight,
      frameWidth,
    } = this.sprite;

    const {
      animation,
    } = this;

    var currentFrame = 0;
    var increment = 1;

    return animate((resolve) => {
      context.drawImage(image, currentFrame * frameWidth, animation.eat * frameHeight, frameWidth, frameHeight, this.positionX, 0, frameWidth, frameHeight);

      if (currentFrame === 1) {
        resolve();
        return true;
      }

      currentFrame += increment;
    }, this.ms);
  }

  jump() {
    const {
      image,
      frameCount,
      frameHeight,
      frameWidth,
    } = this.sprite;

    const {
      animation,
    } = this;

    var currentFrame = 0;
    var increment = 1;

    return animate((resolve) => {
      context.drawImage(image, currentFrame * frameWidth, animation.jump * frameHeight, frameWidth, frameHeight, this.positionX, 0, frameWidth, frameHeight);

      if (currentFrame === 1) {
        resolve();
        return true;
      }

      currentFrame += increment;
    }, this.ms);
  }

  move(animation, direction = 'right', moveXBy = 0, moveYBy = 0) {
    const {
      image,
      frameCount,
      frameHeight,
      frameWidth,
    } = this.sprite;

    var moveTo = {
      right: 1,
      left: -1,
      up: 1,
      down: -1,
    };

    var currentFrame = 0;
    var increment = moveTo[direction];
    var boundaryX = this.positionX + (moveXBy * increment);
    var boundaryY = this.positionY + (moveYBy * increment);

    return animate((resolve) => {
      context.drawImage(image, currentFrame * frameWidth, animation * frameHeight, frameWidth, frameHeight, this.positionX, this.positionY, frameWidth, frameHeight);
      if (this.positionX === boundaryX && this.positionY === boundaryY) {
        resolve();
        return true;
      }

      if (moveXBy) this.positionX += increment;
      if (moveYBy) this.positionY += increment;
    }, 20);
  }

  bounce() {
    const { drawFrame } = this;

    return animateWithGenerator(
      function* () {
        yield drawFrame('bounce', 0);
        yield drawFrame('bounce', 1);
        yield drawFrame('bounce', 2);
        yield drawFrame('bounce', 1);
        yield drawFrame('bounce', 0);
      },
      this.ms
    );
  }
}