"use strict"

let isinit = false;
let count = [];
let map = [];
let mode, stage;
let x, y;
let offset;
let shipx, shipy;
let rotation, direct;

let AIInit = () => {
  for(let i = 0; i < 10; i++){
    map[i] = new Array(10);
    for(let j = 0; j < 10; j++){
      map[i][j] = -1;
    }
  }
  mode = 0;
  stage = 0;
  count = [4, 3, 2, 1];
  y = 0;
  x = -1;
  offset = 2;
};

function AIAtack(){
  if(!isinit){ AIInit(); isinit = true};
  AIFind();
  console.log(x + " " + y + " " + matrix1[x][y]);
  if(matrix1[x][y] == 's'){
    if(mode == 0){
      shipx = x;
      shipy = y;
      mode = 1;
      rotation = 0;
      direct = 1;
    }
    map[x][y] = 2;
  }else{
    map[x][y] = 1;
  }
  return x*10+y;
}

let AIFind = () => {
  if(mode == 0){
    if(stage == 0){
      x += 4;
      if(x >= 10){
        y+=1;
        x=offset;
        offset--;
        if(offset < 0){
          offset = 3;
        }
      }
      if(y>9){
        stage = 1;
        y = 0;
        x = 1;
        offset = 0;
      }
    }else if(stage == 1){
      x += 2;
      if(x >= 10){
        y+=1;
        x=offset;
        offset--;
        if(offset < 0){
          offset = 1;
        }
      }
      if(y>9){
        stage = 2;
        y = 0;
        x = 0;
      }
    }else if(stage == 2){
      x++;
      if(x >= 10){
        y++;
        x=0;
      }
    }
  }else{
    let kill = isKilled(shipx, shipy);
    if(kill != -1){
      console.log("FINISHED");
      console.log(map);
      count[kill]--;
      mode = 0;
      x = shipx;
      y = shipy;
      AIFind();
    }else{
      console.log(rotation +" " + direct);
      if(map[x][y] == 1) changeDirect();
      if(rotation == 0){
        x+=direct;
        if(x > 9 || x < 0 || map[x][y] != -1){
          changeDirect();
        }
      } else{
        y+=direct;
        if(y > 9 || y < 0 || map[x][y] != -1){
          changeDirect();
        }
      }
    }
  }
  if(x > 9 || x < 0 || y > 9 || y < 0 || map[x][y] != -1) AIFind();
}

let changeDirect = () => {
  x = shipx;
  y = shipy;
  if(rotation == 0){
    if(direct == 1) direct = -1;
    else{
      rotation = 1;
      direct = 1;
    }
  }else{
    if(direct == 1) direct = -1;
    else console.log("ERROR! CANT FINISH SHIP");
  }
}

let isKilled = (x, y) => {
  console.log("check");
  if(matrix1[x][y] == 's' && map[x][y] != 2) return -1;
  if((x+1 < 10 && matrix1[x+1][y] == 's') || (x-1 >= 0 && matrix1[x-1][y] == 's')){
    let currX = x;
    while(currX+1 < 10 && matrix1[currX+1][y] == 's'){
      currX++;
    }
    let count = 0
    while(currX-1 >= 0 && matrix1[currX-1][y] == 's'){
      if(map[currX][y] != 2){
        return -1;
      }
      currX--;
      count++;
    }
    if(map[currX][y] != 2){
      return -1;
    }
    //filling arounds with .(1)
    if(currX-1 >= 0){
      if(y+1 < 10) map[currX-1][y+1] = 1;
      if(y-1 >= 0) map[currX-1][y-1] = 1;
      map[currX-1][y] = 1;
    }
    while(currX+1 < 10 && map[currX+1][y] == 2){
      if(y+1 < 10) map[currX][y+1] = 1;
      if(y-1 >= 0) map[currX][y-1] = 1;
      currX++;
    }
    if(y+1 < 10) map[currX][y+1] = 1;
    if(y-1 >= 0) map[currX][y-1] = 1;
    if(currX+1 < 10){
      if(y+1 < 10) map[currX+1][y+1] = 1;
      if(y-1 >= 0) map[currX+1][y-1] = 1;
      map[currX+1][y] = 1;
    }

    return count;

  }else if((y+1 < 10 && matrix1[x][y+1] == 's') || (y-1 >= 0 && matrix1[x][y-1] == 's')){
    let currY = y;
    while(currY+1 < 10 && matrix1[x][currY+1] == 's'){
      currY++;
    }
    let count = 0;
    while(currY-1 >= 0 && matrix1[x][currY-1] == 's'){
      if(map[x][currY] != 2){
        return -1;
      }
      currY--;
      count++;
    }
    if(map[x][currY] != 2){
      return -1;
    }
    //filling arounds with .(1)
    if(currY-1 >= 0){
      if(x+1 < 10) map[x+1][currY-1] = 1;
      if(x-1 >= 0) map[x-1][currY-1] = 1;
      map[x][currY-1] = 1;
    }
    while(currY+1 < 10 && map[x][currY+1] == 2){
      if(x+1 < 10) map[x+1][currY] = 1;
      if(x-1 >= 0) map[x-1][currY] = 1;
      currY++;
    }
    if(x+1 < 10) map[x+1][currY] = 1;
    if(x-1 >= 0) map[x-1][currY] = 1;
    if(currY+1 < 10){
      if(x+1 < 10) map[x+1][currY+1] = 1;
      if(x-1 >= 0) map[x-1][currY+1] = 1;
      map[x][currY+1] = 1;
    }
    
    return count;
  } else{
    if(y-1 >= 0){
      if(x+1 < 10) map[x+1][y-1] = 1;
      if(x-1 >= 0) map[x-1][y-1] = 1;
      map[x][y-1] = 1;
    }
    if(x+1 < 10) map[x+1][y] = 1;
    if(x-1 >= 0) map[x-1][y] = 1;
    if(y+1 < 10){
      if(x+1 < 10) map[x+1][y+1] = 1;
      if(x-1 >= 0) map[x-1][y+1] = 1;
      map[x][y+1] = 1;
    }
    return 0;
  }
}