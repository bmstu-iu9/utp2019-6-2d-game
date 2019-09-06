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
  }
  if(x > 9 || x < 0 || y > 9 || y < 0 || map[x][y] != -1) AIFind();
}