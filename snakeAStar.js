let grid;
let gridNodes;
let width, height;
let mass = 20;
let snake;
let food;

function setup()  {
  width = 400;
  height = 400;
  createCanvas(width, height);
  grid = new Array(height / mass);
  for ( let i = 0; i < grid.length; i++)  {
    grid[i] = new Array(width / mass);
    for ( let j = 0; j < grid[i].length; j++) {
      grid[i][j] = new Cell(j * mass, i * mass, mass);
    }
  }
  gridNodes = grid.length * grid[0].length;
  food = new Food();//snake, 3, 0.5 *  height / mass);
  snake = new Snake(0.5 * width / mass, 0.5 *  height / mass);

}

function draw() {

  

  snake.move();
  snake.eat(food);
  food.draw();

  for ( let arr of grid)  {
    for ( let a of arr) {
      a.draw();
      //console.log(a.getIndex());
    }
  }

  food.draw();
}

function getPath(parent, food)  {
  console.log(parent);
  if ( parent == undefined )  {
    return [getDir(snake)];
  }
  let startPos = {x: food.x, y: food.y};
  let index = grid[food.y][food.x].getIndex();
  //index = parent[index];
  let path = [];
  let walk = [];
  let i;
  for ( i = index;  i != -1; i = parent[i])  {
    let pos = getPosition(i);
    //grid[pos.y][pos.x].dy = true;

    walk.push({x: startPos.x - pos.x, y: startPos.y - pos.y});
    startPos = pos;
    path.push(pos);
  }
  walk.shift();
  return walk.reverse();
}

function getDir(snake)  {
  let loc = snake.headPos;
  if ( loc.x > 0 && ! grid[loc.y][loc.x - 1].snake ) return {x: -1, y: 0};
  if ( loc.x < grid.length - 1 && ! grid[loc.y][loc.x + 1].snake ) return {x: 1, y: 0};
  if ( loc.y > 0 && ! grid[loc.y - 1][loc.x].snake ) return {x: 0, y: -1};
  if ( loc.y < grid.length - 1 && ! grid[loc.y + 1][loc.x].snake ) return {x: 0, y: 1};
}

// function drawPath(parent, food) {
//   let index = grid[food.y][food.x].getIndex();

//   for ( let i = index; i != 0 && i != -1; i = parent[i])  {
//     let pos = getPosition(i);
//     console.log(i, pos);
//     grid[pos.y][pos.x].dye(color(0 ,255,0));
//   }
// }

function getPosition(index) {
  return {x: index % mass, y: Math.floor(index / mass)};
}

function aStar(snake, target) {
  let queue = [];
  let dist = new Array(gridNodes).fill(1000000);
  let parent = new Array(gridNodes).fill(-1);
  let head = grid[snake.headPos.y][snake.headPos.x].getIndex();
  //grid[snake.headPos.y][snake.headPos.x].dye(color(255, 0, 255));
  //console.log(head);
  dist[head] = 0;
  queue.push(getPriorityElement(snake.headPos, 0));
  while ( queue.length > 0 )  {
    let node = queue.shift();
    let nodeIndex = grid[node.y][node.x].getIndex();
    if ( node.x == target.x && node.y == target.y)  return parent;
    for ( let n of getNeighbors(node))  {
      //grid[n.y][n.x].dye(color(0, 0, 255));
      let ind = grid[n.y][n.x].getIndex();
      if ( dist[ind] > dist[nodeIndex] + 1)  {
        parent[ind] = nodeIndex;
        dist[ind] = dist[nodeIndex] + 1;
        let newElement = getPriorityElement(n, getHeuristic(n, target));
        let possibleIndex = contains(queue, newElement);
        if ( possibleIndex != null )  {
          queue[possibleIndex] = newElement;
        } else {
          queue.push(newElement);
        }
        queue.sort((a, b) => a.h - b.h);
      }
    }
  } 
}

function contains(arr, elem)  {
  for ( let i in arr )  {
    if ( arr[i].x == elem.x && arr[i].y == elem.y ) return i;
  }
  return null;
}
// Distance between obj and food
function getHeuristic(obj, food)  {
  let dx = Math.abs(obj.x - food.x);
  let dy = Math.abs(obj.y - food.y);

  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

function getPriorityElement(pos, heuristic) {
  return {x: pos.x, y: pos.y, h: heuristic};
}

function getNeighbors(loc)  {
  let neighbors = [];
  if ( loc.x > 0 && ! grid[loc.y][loc.x - 1].snake )//&& ! grid[loc.y][loc.x - 1].visited ) 
    neighbors.push({x: x - 1, y: y});
  if ( loc.y > 0 && ! grid[loc.y - 1][loc.x].snake ) //&& ! grid[loc.y - 1][loc.x].visited ) 
    neighbors.push({x: x, y: y - 1});
  if ( loc.x < grid[0].length - 1 && ! grid[loc.y][loc.x + 1].snake ) // && ! grid[loc.y][loc.x + 1].visited ) 
    neighbors.push({x: x + 1, y: y});
  if ( loc.y < grid.length - 1 && ! grid[loc.y + 1][loc.x].snake ) //&& ! grid[loc.y + 1][loc.x].visited ) 
    neighbors.push({x: x, y: y + 1});
  return neighbors;
}


function Food(x, y) {
  if ( x && y ) this.pos = {x, y};
  else {  

    this.pos = {x: Math.floor(Math.random() * (width/mass)), y: Math.floor(Math.random() * (width/mass))};
    // while ( snake.includes(this.pos) )  {
    //   this.pos = {x: Math.floor(Math.random() * (width/mass)), y: Math.floor(Math.random() * (width/mass))};
    // }
  }
  this.draw = function()  {
    grid[this.pos.y][this.pos.x].dye(color(255, 0, 0));
    //grid[this.pos.y][this.pos.x].draw();
  }

  this.resetPosition = function(body)  {
    this.pos = {x: Math.floor(Math.random() * (width/mass)), y: Math.floor(Math.random() * (width/mass))};
    while ( contains(body, this.pos) != null )  {
      this.pos = {x: Math.floor(Math.random() * (width/mass)), y: Math.floor(Math.random() * (width/mass))};
    }
  }
}

function Snake(x, y)  {
  this.headPos = {x, y};
  this.length = 1;
  this.dir = {x: 0, y: 0};
  this.body = [];
  this.ate = false;
  this.body.push(this.headPos);
  this.length = 1;

  this.walk = getPath(aStar(this, food.pos), food.pos);

  console.log(this.walk);

  this.eat = function(food) {
    if ( this.headPos.x == food.pos.x && this.headPos.y == food.pos.y ) {
      this.ate = true;
      food.resetPosition(this.body);
      food.draw();
      this.length ++;
      console.log(this.length);
      //drawGrid();
      //noLoop();
      this.walk = getPath(aStar(this, food.pos), food.pos);
    } else {
      this.ate = false;
    }
  }

  this.move = function()  {
    if ( this.walk.length <= 0 ) {
      console.log("RECALC");
      this.walk = getPath(aStar(this, food.pos), food.pos);
    }
    console.log(this.walk);
    let dir = this.walk.shift();
    console.log(dir);
    this.headPos = {x: this.headPos.x + dir.x, y: this.headPos.y + dir.y};
    if ( this.headPos.x < 0 || this.headPos.x >= grid.length || this.headPos.y < 0 || this.headPos.y >= grid.length)  {
      console.log("Overflow");
      noLoop();
      return;
    }
    grid[this.headPos.y][this.headPos.x].snake = 1;
    this.body.push({x: this.headPos.x, y: this.headPos.y});
    if ( ! this.ate ) {
      grid[this.body[0].y][this.body[0].x].snake = 0;
      this.body.shift();
    }
  }

  this.draw = function() {
    for ( let a of this.body )  {
      grid[a.y][a.x].dye(color(0, 255, 0));
    }
  }
}

function getNeighbors(node)  {
  let neighbors = [];
  if ( node.x > 0 && ! grid[node.y][node.x - 1].snake ) 
    neighbors.push({y: node.y, x: node.x - 1});
  if ( node.y > 0 && ! grid[node.y - 1][node.x].snake ) 
    neighbors.push({y:node.y - 1, x: node.x});
  if ( node.y < grid.length - 1 && ! grid[node.y + 1][node.x].snake)
    neighbors.push({y: node.y + 1, x: node.x});
  if ( node.x < grid.length - 1 && ! grid[node.y][node.x + 1].snake)    neighbors.push({y:node.y, x:node.x + 1});
  return neighbors;
}

function Cell(x, y, width)  {
  this.x = x;
  this.y = y;
  this.width = width;

  this.snake = 0;

  this.dist = 1000000;
  this.visited = 0;

  this.dye = function(col) {
    fill(col);
    rect(this.x, this.y, this.width, this.width);
  }

  this.draw = function()  {
    stroke(200);
    fill(this.snake ? color(0,255,0) : 100);
    //if ( this.dy ) fill(color(0, 0, 255));
    rect(this.x, this.y, this.width, this.width);
    //textAlign(CENTER);
    // noStroke();
    // fill(0);
    // textSize(10);
    // text(this.x/this.width + "/" + this.y/this.width, this.x, this.y + this.width);
  }

  this.getIndex = function()  {
    let x = this.x / this.width;
    let y = this.y / this.width;

    return y * width + x;
  }
}

function drawGrid() {
  console.log("drawing");
  for ( let arr of grid)  {
    for ( let a of arr) {
      a.draw();
      //console.log(a.getIndex());
    }
  }
}


// snake walk

// this.headPos = {x: this.headPos.x + this.dir.x, y: this.headPos.y + this.dir.y};
//     if ( this.headPos.x < 0 || this.headPos.x >= grid.length || this.headPos.y < 0 || this.headPos.y >= grid.length)  {
//       console.log("Overflow");
//       noLoop();
//       return;
//     }
//     grid[this.headPos.y][this.headPos.x].snake = 1;
//     this.body.push({x: this.headPos.x, y: this.headPos.y});
//     if ( ! this.ate ) {
//       grid[this.body[0].y][this.body[0].x].snake = 0;
//       this.body.shift();
//     }