var gameScreen = document.querySelector('.game__screen');
var gameOptions = document.querySelector('.game__options');
var canvas = document.querySelector('.animation');
canvas.width = 147;
canvas.height = 147;

class Game {
  constructor(canvas) {
    const context = canvas.getContext('2d');
    context.font = '24px VT323';
    context.fillText('Start', 24, 24);

    this.started = false;
    this.paused = false; // flag to disable button presses during animations
    this.optionsVisible = false;
    this.userEvents = [];

    this.start = this.start.bind(this);
    this.startLoop = this.startLoop.bind(this);
    this.isPending = this.isPending.bind(this);
    this.loop = this.loop.bind(this);
    this.showOptions = this.showOptions.bind(this);
    this.hideOptions = this.hideOptions.bind(this);
  }

  start() {
    this.paused = true;
    show_tama_options();
    coroutine(function* () {
      yield* egg.hatch();
      yield egg.delay(500);
    }).then(() => {
      this.paused = false;
      this.started = true;
      init_option();
      this.startLoop();
    });
  }

  isPending() {
    return this.userEvents.length;
  }

  startLoop() {
    coroutine(this.loop());
  }

  loop() {
    const {
      isPending,
      userEvents,
    } = this;

    return function* loop() {
      let idle = tamagotchi.idle();
      let done = false;

      while (game.started) {
        if (isPending()) {
          const event = userEvents.shift();
          idle.return();
          yield tamagotchi.reset;
          yield* event();
        }

        while (!done && !isPending()) {
          const next = idle.next();
          done = next.done;
          yield next.value;
        }

        idle = tamagotchi.idle();
        done = false;
      }
    }
  }

  showOptions() {
    this.optionsVisible = true;
    gameOptions.classList.add('visible');
    const options = gameOptions.children;
    options.item(0).innerText = 'Feed';
    options.item(0).onclick = () => this.showFoodOptions();
    options.item(1).innerText = 'Play';
  }

  showFoodOptions() {
    this.optionsVisible = true;
    gameOptions.classList.add('visible');
    const options = gameOptions.children;
    options.item(0).innerText = 'Burger';
    options.item(0).onclick = () => feed('burger');
    options.item(1).innerText = 'Candy';
    options.item(1).onclick = () => feed('candy');
  }

  hideOptions() {
    this.optionsVisible = false;
    gameOptions.classList.remove('visible');
  }
}

var egg = new Egg(canvas);
var tamagotchi = new Tamagotchi(canvas);
var game = new Game(canvas);

// https://www.erikagoering.com/tamagotchi-collection/images/infographic%20sketches-09.png
var options = ["stats", "food", "toilet", "games", "connect", "discipline", "medicine", "lights", "guestbook", "attention"];
var curr_option = 0;

var buttonA = document.querySelector('.a');
var buttonB = document.querySelector('.b');
var buttonC = document.querySelector('.c');

// functionality to allow finger to follow the cursor
document.addEventListener('mousemove', e => {
  document.getElementById('finger').style.left = (e.pageX - 30) + "px";
  document.getElementById('finger').style.top = (e.pageY - 30) + "px";
});

function feed(food) {
  if (game.started) {
    game.userEvents.push(tamagotchi.feed.bind(null, food));
    game.hideOptions();
  }
}

buttonA.addEventListener('click', () => {
  if (game.paused) { return; }
  if (game.started) {
    // game.showOptions();
    move_option('left');
  }
});

buttonB.addEventListener('click', () => {
  if (game.paused) { return; }
  if (!game.started) {
    game.start();
  }
  if (game.started) {
    if (options[curr_option] == "food") {
      game.showFoodOptions();
    } else {
      displayDebugMsg("Action for '" + options[curr_option] + "' not yet implemented");
    }
  }
});

buttonC.addEventListener('click', () => {
  if (game.paused) { return; }
  if (game.started) {
    move_option('right');
  }
});

function show_tama_options() {
  document.getElementById("tama_options").style.display = 'block';
}
function init_option() {
  document.getElementById("tama_options_" + options[curr_option]).classList.add("tama_options_active");
}

function move_option(direction) {
  document.getElementById("tama_options_" + options[curr_option]).classList.remove("tama_options_active");
  if (direction == 'left') {
    curr_option = curr_option - 1;
    if (curr_option < 0) {
      curr_option = options.length - 1;
    }
  } else if (direction == 'right') {
    curr_option = curr_option + 1
    if (curr_option == options.length) {
      curr_option = 0;
    }
  }
  document.getElementById("tama_options_" + options[curr_option]).classList.add("tama_options_active");
}

function displayDebugMsg(message) {
  debug = document.getElementById("debug");
  debug.innerHTML = message;
  debug.style.display = 'block';
  setTimeout(function(){ debug.style.display = 'none'; }, 3000);
}
