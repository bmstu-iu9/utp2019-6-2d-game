//<!-- Функция, корректно генерирующая случайное число в определенном диапазоне, использующая встроенную функцию Math.random. --> 
function getRandomInt(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

//<!-- Логическая функция, проверяющая наличие числа в массиве. -->
function contains(arr, elem) {
  return (arr.includes(Number(elem)));
}

//<!-- Генератор матриц для полей боя. Основные переменные: собственно матрица, координаты начала корабля, направление корабля(0 вправо, 1 вниз), список свободных для кораблей клеток. -->
function matrixGenerator(){
let matrix = [],
x,y,directionS,
excludes = [];
//<!-- Заполнение матрицы океаном и массива числами -->
for (i=0;i<10;i++){
matrix.push('oooooooooo');
}
for (i=0;i<100;i++){
  excludes.push(i);
}
//<!-- f - случайное двухзначное число из excludes распадающееся на координаты. Далее начало основного цикла генерации. i - размер корабля j - номер. -->
//<!--Так как в случае неудачного ввода цикл делает откат, инициация j вынесена за цикл(Возможно оформление можно сделать лучше) --> 
let f;
j=1
Label : for (i = 4; i > 0; i--) for (j ; j <= 5-i; j++) {
  f = getRandomInt(0,excludes.length);
  f = excludes[f-1];
  x = (f-f%10)/10;
  y = f%10;
  directionS = getRandomInt(0,1);
  //<!-- Далее разные варианты для разных направлений. Отличия минимальные, но для вертикального изменение матрицы сложнее. -->
  let str = "";
  switch (directionS) {
    case 0 :
      if (y+i > 10) {  i++;   continue Label;}// <!-- Откат в случае слишком большой длины -->
      
      for(k=f;k<f+i;k++){
        if(!contains(excludes,k)){
          i++;
          continue Label; //<!-- Откат в случае, если други клетки корабля заняты или находятся впритык к другим. -->
        }
      }
      //<!-- Удаление из свободных клеток корабля и его окрестности в одну клетку -->
      for(k=x-1;k<=x+1; k++){
        if (k<0 || k>9) continue;
        for(r=y-1;r<=y+i;r++){
          if (r<0 || r>9) continue;
            if (contains(excludes,k*10+r))
              excludes.splice(excludes.indexOf(Number(k*10+r)),1);
        }
      }
      str = "";
      //<!-- Изменение матрицы. Берется строка,копируется до начала корабля, вставляется корабля и затем копирование до конца строки. -->
      for (k=0;k<y;k++){
        str+= matrix[x][k];
      }
      for (k = y; k < y+i; k++) { 
        str+= 's';
      }
      for(k = y+i; k<10;k++){
        str+= matrix[x][k];
      }
      matrix[x]=str;
      str = "";
      break;
    case 1 :
      if (x+i > 10) {  i++;  continue Label;}
      
      for(k=f;k<f+i*10;k+=10){
        if(!contains(excludes,k)){
          i++;
          continue Label;
        }
      }
      
      for(k=y-1;k<=y+1; k++){
        if (k<0 || k>9) continue;
        for(r=x-1;r<=x+i;r++){
          if (r<0 || r>9) continue;
            if (contains(excludes,r*10+k)){
              excludes.splice(excludes.indexOf(Number(r*10+k)),1);
            }
        }
      }
      str = "";
      //<!-- Здесь берутся все строки корабля и изменяется по элементу в каждой, как в горизонтальном случае -->
      for(k=x;k<x+i;k++){
        for(r=0;r<y;r++){
          str+=matrix[k][r];
        }
        str+='s';
        for(r=y+1;r<10;r++){
          str+=matrix[k][r];
        }
        matrix[k]=str;
        str = "";
      }
    }
    //<!-- Данная проверка нормализует цикл в случае откатов, а так же завершает его. -->
    if (5-j == i) {  if (j != 4) {j=0; i--;} else break Label; }
  }
  return matrix;
}