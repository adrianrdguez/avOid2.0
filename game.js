
var CANVAS = document.getElementById('canvas');
var context = this.canvas.getContext('2d')

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var mouseX = (window.innerWidth - SCREEN_WIDTH - 10);
var mouseY = SCREEN_HEIGHT + 10;

var startBtn = document.getElementById('start-button');
var PLAYING = false;
var PAUSE = false;

var enemies = [];
var enemiesQty = 80;

var boost = [];
var boostQty = 3;

var DRAWSCORE = false;
var drawsScoreTimer;
var SHIELD = false;
var shieldTimer;

var STAR = document.getElementById('source');
var RAINBOW = false;
var rainbowTimer;

var DARK = false;
var darknessTimer;

var particles = [];
var particlesQty = 20;

var score = 0;
var scoreBase = 500;
var scoreMultiply = 1;
var scoreSum = 0;
var level = 1;
var fps = 0;

// if (SCREEN_WIDTH < 800) {
//   enemiesQty = 100
// } else {
//   enemiesQty = 100
// }

function loadGame() {
  //REGISTER EVENT LISTENER
  document.addEventListener('mousemove', function (event) {
    mouseX = event.clientX - (window.innerWidth - SCREEN_WIDTH) * .5;
    mouseY = event.clientY - (window.innerHeight - SCREEN_HEIGHT) * .5;
  }, false);

  // MAP
  this.map = new Map()
  this.map.create()

  //PLAYER
  this.player = new Player();
  this.player.distCollision = this.player.radius - 2;

  //ENEMIES QUANTITY
  for (let i = 0; i < enemiesQty; i++) {
    const x = Math.random() * (SCREEN_WIDTH * 2);
    const y = Math.random() * -SCREEN_HEIGHT;
    this.enemies.push(new Enemy({ x, y }));
  }

  //BOOST QUANTITY
  for (let i = 0; i < boostQty; i++) {
    const x = Math.random() * (SCREEN_WIDTH * 2);
    const y = Math.random() * -SCREEN_HEIGHT;
    this.boost.push(new Boost({ x, y }));
  }
  animation();
}

function animation() {
  if (!PAUSE) {
    //RESPONSIVE MAP
    if (SCREEN_WIDTH != window.innerWidth || SCREEN_HEIGHT != window.innerHeight) {
      SCREEN_WIDTH = window.innerWidth;
      SCREEN_HEIGHT = window.innerHeight;
      map.resize()
    }

    //ERASE CANVAS
    context.clearRect(0, 0, this.CANVAS.width, this.CANVAS.height);

    //BACKGROUND BOOST
    for (let b = 0; b < this.boost.length - 1; b++) {
      this.boost[b].create();
      //CHECK BOOST COLLISION PLAYING
      if (PLAYING) {
        boostCollision(b);
        //CREATE SHIELD
        if (this.player.invencible && SHIELD) {
          this.player.shield();
        }
        //RAINBOW PROTECTION
        else if (this.player.invencible && RAINBOW) {
          this.player.rainbow();
        }
      }
    }

    //PLAYER APPEARS WHEN START BTN PRESSED
    if (PLAYING) {
      //PLAYER MOVES
      this.player.create();
      //SCORE COUNTS
      score++;
      //LEVEL COUNT
      if (score > 0 && score < 1000) {
        level = 1
      } else if (score > 1000 && score < 2000) {
        level = 2
      } else if (score > 2000 && score < 3000) {
        level = 3
      } else if (score > 3000 && score < 4000) {
        level = 4
      } else if (score > 4000 && score < 5000) {
        level = 5
      } else if (score > 5000 && score < 6000) {
        level = 6
      } else if (score > 6000 && score < 7000) {
        level = 7
      } else if (score > 7000 && score < 8000) {
        level = 8
      } else if (score > 8000 && score < 9000) {
        level = 9
      } else {
        level = 10
      }
      //FINISH GAME
      if (this.player.lifeCount === -1) {
        endGame();
        startGame();
      }
    }

    //BACKGROUND ENEMIES
    for (let j = 0; j < this.enemies.length - 1; j++) {
      this.enemies[j].create();
      //CHECK ENEMIES COLLISION PLAYING
      if (PLAYING) {
        enemyCollision(j);
        if (DRAWSCORE) {
          this.context.fillStyle = "rgba(255,255,255, 1)";
          this.context.font = "12px Quicksand";
          this.context.fillText('+' + scoreSum, this.player.position.x - 15, this.player.position.y -10)
        }
        //PARTICLES EXPLOSION
        for (let k = 0; k < this.particles.length - 1; k++) {
          this.particles[k].create();
        }
      }
    }

    if (DARK) {
      this.player.darkness();
    }
    //GAME PANEL (LEVEL & SCORE)
    context.fillStyle = "rgba(0,0,0, 0.8)";
    context.fillRect(0, 0, this.CANVAS.width, 40);
    context.fillStyle = "rgba(255,255,255, 1)";
    context.font = "20px Quicksand";
    context.fillText("avOid", 20, 27);
    context.font = "14px Quicksand";
    context.fillText("Level: "+ level, 114, 27);
    context.fillText("Score: " + score, 184, 27);
    context.fillText("FPS: 60", this.CANVAS.width - 60, 27);

  }
  requestAnimationFrame(animation);
}

function enemyCollision(j) {
  if (this.player && this.player.position.x - this.player.distCollision < this.enemies[j].position.x + this.enemies[j].radius &&
    this.player.position.y - this.player.distCollision < this.enemies[j].position.y + this.enemies[j].radius &&
    this.player.position.x + this.player.distCollision > this.enemies[j].position.x - this.enemies[j].radius &&
    this.player.position.y + this.player.distCollision > this.enemies[j].position.y - this.enemies[j].radius) {
    if (!this.player.invencibleDmg && !this.player.invencible) {
      //LIFE -1
      this.player.lifeCount--
      DARK = false;
      //DAMAGE BLINK
      var OFF = setInterval(function () { this.player.fillColor = '#111'; }, 10);
      var ON = setInterval(function () { this.player.fillColor = '#FFF'; }, 20);
      //MAKE PLAYER INVENCIBLE
      this.player.invencibleDmg = true;
      //END BLINK & INVENCIBLE
      setTimeout(() => {
        clearInterval(OFF);
        clearInterval(ON);
        this.player.invencibleDmg = false;
      }, 1000);
    } else { //PLAYER IS INVENCIBLE
      clearTimeout(drawsScoreTimer);
      if (DRAWSCORE) {
        scoreMultiply++;
        scoreSum = scoreBase * scoreMultiply
      } else {
        scoreSum = scoreBase
      }
      score += scoreBase;
      DRAWSCORE = true;
      drawsScoreTimer = setTimeout(() => {
        DRAWSCORE = false;
        scoreMultiply = 1;
      }, 1200)

    }

    //PARTICLES EXPLOSION QUANTITY
    particles = []
    for (let i = 0; i < particlesQty; i++) {
      particles.push(new Particle(this.enemies[j].position, this.enemies[j].radius));
    };

    //DELETE THAT ENEMY
    this.enemies.splice(j, 1)
    //CREATE NEW ENEMY
    const x = Math.random() * (SCREEN_WIDTH * 2);
    const y = Math.random() * -SCREEN_HEIGHT;
    this.enemies.push(new Enemy({ x, y }));
  }
}

function boostCollision(b) {
  if (this.player && this.player.position.x - this.player.distCollision < this.boost[b].position.x + this.boost[b].radius &&
    this.player.position.y - this.player.distCollision < this.boost[b].position.y + this.boost[b].radius &&
    this.player.position.x + this.player.distCollision > this.boost[b].position.x - this.boost[b].radius &&
    this.player.position.y + this.player.distCollision > this.boost[b].position.y - this.boost[b].radius) {

    //SHIELD
    if (this.boost[b].fillColor === '#00B2FF') {
      clearTimeout(shieldTimer);
      //MAKE PLAYER INVENCIBLE, ACTIVATE SHIELD & BIGGER RADIUS
      this.player.invencible = true;
      SHIELD = true;
      this.player.distCollision = this.player.shieldRadius - 2;
      //END INVENCIBLE, SHIELD & SMALLER RADIUS
      shieldTimer = setTimeout(() => {
        this.player.invencible = false;
        SHIELD = false;
        this.player.distCollision = this.player.radius - 2
      }, 5000);
      //RAINBOW
    } else if (this.boost[b].fillColor === 'yellow') {
      clearTimeout(rainbowTimer);
      this.player.invencible = true;
      RAINBOW = true;
      // END INVENCIBLE & RAINBOW
      rainbowTimer = setTimeout(() => {
        this.player.invencible = false;
        RAINBOW = false;
        this.player.fillColor = '#FFF';
      }, 10000);
      //DARKNESS
    } else if (this.boost[b].fillColor === '#0F0F0F') {
      clearTimeout(darknessTimer);
      DARK = true;
      darknessTimer = setTimeout(() => {
        DARK = false;
      }, 8000)
    };

    //DELETE THAT BOOST
    this.boost.splice(b, 1)
    //CREATE NEW BOOST
    const x = Math.random() * (SCREEN_WIDTH * 2);
    const y = Math.random() * -SCREEN_HEIGHT;
    this.boost.push(new Boost({ x, y }));
  }
}

function startGame() {
  //RESET ENEMIES
  enemies = [];
  enemiesQty = 80;
  //RESET ENEMIES POSITION
  for (let i = 0; i < enemiesQty; i++) {
    const x = Math.random() * (SCREEN_WIDTH * 2);
    const y = Math.random() * -SCREEN_HEIGHT;
    this.enemies.push(new Enemy({ x, y }));
  };
  //RESET BOOST
  boost = [];
  boostQty = 3;
  //RESET BOOST POSITION
  for (let i = 0; i < boostQty; i++) {
    const x = Math.random() * (SCREEN_WIDTH * 2);
    const y = Math.random() * -SCREEN_HEIGHT;
    this.boost.push(new Boost({ x, y }));
  };
  if (startBtn.classList[0] === undefined) { //START GAME
    //RESET PLAYER
    this.player.lifeCount = 2;
    this.player.position = { x: -10, y: this.canvas.height + 10 };
    this.player.shift = { x: -10, y: this.canvas.height + 10 };
    this.player.positions = [];
    startBtn.classList.add("desactivate");
    PLAYING = true;
  } else { //LOAD PREGAME
    startBtn.classList.remove("desactivate");
    PLAYING = false;
  }
}

function endGame() {
  PLAYING = false;
  alert('¿QUÉ TE CREÍSTE JORÍO QUE ESTO ES JAUJA O QUÉ? PERDISTE MI NIÑO NO TE QUEDAN VIDAS PERDISTEEE')
}

function pauseGame() {
  PAUSE = !PAUSE;
  if (PAUSE) {
    context.fillStyle = "rgba(255,255,255, 1)"
    context.fillRect(this.CANVAS.width / 2 - 50, this.CANVAS.height / 2 - 90, 30, 90);
    context.fillRect(this.CANVAS.width / 2 + 10, this.CANVAS.height / 2 - 90, 30, 90);
  }
}


//CHETOS
var color;
function applyRandomColor() {
  var letters = '0123456789ABCDEF';
  color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  this.player.fillColor = color;
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'q') {
    this.player.lifeCount = 3;
  }
  if (event.key === 'w') {
    if (this.player.invencible) {
      clearInterval(COLOR);
      this.player.fillColor = '#FFF';
    } else {
      COLOR = setInterval(applyRandomColor, 100);
    }
    this.player.invencible = !this.player.invencible;
  }
  if (event.key === 'e') {
    if (PLAYING) {
      pauseGame();
    }
  }
  // const keyName = event.key;
  // alert('keydown event\n\n' + 'key: ' + keyName);
});
