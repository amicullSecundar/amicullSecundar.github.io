var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var scor = document.getElementById('scor');

//dimensiunea canvas (inaltime si latime), dimensiunea marului si a sarpelui sunt multiplii de dimensiunea totala a matricii pentru a functiona detectia coliziunilor
//exemplu: 16 * 25 = 400
var grid = 16;
var count = 0;

var snake = {
  x: 160, //pozitia din mijloc
  y: 160, //pozitia din mijloc
  dx: grid, //viteza sarpelui, se misca cate o celula
  dy: 0, //pe orizontala
  cells: [], //aici salvez dimensiunea sarpelui
	
  maxCells: 4 //dimensinea initiala a sarpelui
};
var apple = {
  x: 320,
  y: 320
};

function getRandomInt(min, max) { //pentru a plasa marul aleator pe grid
  return Math.floor(Math.random() * (max - min)) + min;
}

function loop() {
  requestAnimationFrame(loop);

  if (++count < 4) { //un counter (divizor de frecventa). 15 fps pe secunda in loc de 60. (60/4 = 15)
    return;
  }

  count = 0; //resetez counteru'
  context.clearRect(0,0,canvas.width,canvas.height);

  snake.x += snake.dx; //miscam sarpele cu viteza lui
  snake.y += snake.dy;

  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) { //"teleportam" sarpele in pozitia de jos orizontal
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) { //pozitia de sus
    snake.x = 0;
  }

  if (snake.y < 0) { // teeportat vertical dreapta
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) { //pozitia stanga
    snake.y = 0;
  }

  snake.cells.unshift({x: snake.x, y: snake.y}); //tinem cont de pozitia sarpelui (capul e mereu in poz 0 din array)

  if (snake.cells.length > snake.maxCells) { //stergem ultima celula a sarpelui cum ne miscam
    snake.cells.pop();
  }

  context.fillStyle = 'red'; //se deseneaza un mar
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  context.fillStyle = 'green'; //desenez corpul sarpelui unul cate unul
  snake.cells.forEach(function(cell, index) {
    context.fillRect(cell.x, cell.y, grid-1, grid-1); //sa se vada "bucatile" de sarpe, este cu un pixel mai mic
    if (cell.x === apple.x && cell.y === apple.y) { //sarpele a mancat marul
      snake.maxCells++; //crestem vectorul sarpelui
	  scor.innerHTML = 'Scor: ' + (parseInt(scor.innerHTML.slice(7)) + 1).toString().padStart(3, '0');
      apple.x = getRandomInt(0, 25) * grid; // canvasyl este 400x400 ceea ce in celule inseamna 25x25 celule
      apple.y = getRandomInt(0, 25) * grid;
    }
    for (var i = index + 1; i < snake.cells.length; i++) { //verificam pt coliziuni. (bubble sort modificat)

      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) { //daca capul ocupa aceasi pozitie din grid cu corpul, este resetat jocul
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
		
		scor.innerHTML = 'Scor: 000';
		
		alert("Sfarsit joc!");
      }
    }
  });
}

//listener pentru tastatura
document.addEventListener('keydown', function(e) {
//se verifica daca merge in stanga sarpele si apasam sageata stanga, nu "teleporteaza" sarpele in stanga
//se verifica daca merge intr-o directie, de ex: stanga, sa nu putem apasa dreapta.

//stanga
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
//sus
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
//dreapta
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
//jos
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

var hammertime = new Hammer(document.getElementById('game'));

hammertime.get('swipe').set({
    direction: Hammer.DIRECTION_ALL // Permite swipe în toate direcțiile
});

hammertime.on('swipeleft', function(ev) {
    if (snake.dx !== grid) {
        snake.dx = -grid;
        snake.dy = 0;
    }
});

hammertime.on('swiperight', function(ev) {
    if (snake.dx !== -grid) {
        snake.dx = grid;
        snake.dy = 0;
    }
});

hammertime.on('swipeup', function(ev) {
    if (snake.dy !== grid) {
        snake.dy = -grid;
        snake.dx = 0;
    }
});

hammertime.on('swipedown', function(ev) {
    if (snake.dy !== -grid) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

document.getElementById('sus').addEventListener('click', function() {
    if (snake.dy !== grid) {
        snake.dy = -grid;
        snake.dx = 0;
    }
});

document.getElementById('stanga').addEventListener('click', function() {
    if (snake.dx !== grid) {
        snake.dx = -grid;
        snake.dy = 0;
    }
});

document.getElementById('jos').addEventListener('click', function() {
    if (snake.dy !== -grid) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

document.getElementById('dreapta').addEventListener('click', function() {
    if (snake.dx !== -grid) {
        snake.dx = grid;
        snake.dy = 0;
    }
});


requestAnimationFrame(loop); //se incape jocul