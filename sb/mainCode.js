//<!-- Функция, стартующая при прогрузке страницы. Далее обьявления основных переменных. -->
"use strict"
		let field1 = document.getElementById('matrixInterface1');
		let field2 = document.getElementById('matrixInterface2');
		let matrix1 = [];
        let matrix2 = [];
        let outer = document.getElementById("output");
        let buttonM = document.getElementById('mainButton');
		let player = document.getElementById('player');
		let playerB=document.getElementById('playerButton');
		let quest= document.getElementById('ref');
		// Далее переменные вспомогательных счетчиков
		let i = 0;
		let j = 0;
		let k = 0;
		let r = 0;
		//<!-- Функция выключения и включения музыки. Хотел добавить включение победного саундтрека при победе соответственно, но как-то лень -->
		playerB.onclick = function () {
			if(player.paused) player.play();
			else player.pause();
		};
		//<!-- Функция справки -->
		quest.onclick = function () {
			alert("Данная версия предусматривает игру только с ИИ, атакующим случайные клетки. Также присутствует генератор расположения кораблей. Ручной расстановки нет. Рекомендации по разработке находятся непосредственно в коде. Музыка: Саундтрек Warcraft2 Humans1 "); 
		};
		//<!-- Функция "Главной кнопки"  -->
		buttonM.onclick = function () {
		player.play(); //<!-- Включение музыки -->
		buttonM.disabled = true;// <!-- Диактивация кнопки -->
		matrix2=matrixGenerator();// <!-- Генерация поля компьютера -->
		alert("This version does not support ship placement so use random!");
		matrix1=matrixGenerator();// <!-- Генерация поля игрока -->
		//<!-- Заполнение системы вывода строками матрицы -->
		for (i = 0; i < 10; i++) {
			if (matrix1[i] != undefined) {
			outer.innerHTML += "<p class='testEnter'>" + matrix1[i] + "</p>";
			}
			if (matrix2[i] != undefined) {
				outer.innerHTML += "<p class='testEnter'>" + matrix2[i] + "</p>";
			}
		}
		//<!-- Далее цикл заполнения обоих полей, использующий данные из матрицы. Определяется класс, а затем элемент добавляется на поле. -->
		//<!--Также он содержит функцию клика на элемент, запускающий функцию атаки и атаки компьютера. В случае попадения дается дополнительный ход. -->
		for (i = 0; i < 10; i++) for (j = 0; j < 10; j++) {
			
			let buf1 = document.createElement('div');
			buf1.id = i+'_'+j;
			buf1.className = matrix1[i][j];
			if (matrix1[i][j] == 's') {
			buf1.className = 's';
			} else {
			buf1.className = 'o';
			}
			field1.appendChild(buf1);
			let buf2 = document.createElement('div');
			if (matrix2[i][j] == 's') {
			buf2.className = 's';
			} else {
			buf2.className = 'o';
			}
			buf2.onclick = function () { 
				if (attack(this)) computerAttack(); 
			};
			field2.appendChild(buf2);
      } 
    };
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
		
		//<!-- Функция сменяет статус атакуемой клетки и проверяет на условия победы игрока. Для компьютера проверка всегда будет ложной, так как проверяется его же матрица. В случае победы перезагружает страницу. -->
		function attack(cage) {
			if (cage.className == 'y' || cage.className == 'n') return false;
			if (cage.className == 's') cage.className = 'y';
			else cage.className = 'n';
			if (document.querySelectorAll('#matrixInterface2 .s').length === 0) {
				alert('Player is the winner.'); 
				location.reload();
				return false;
			}
			if (cage.className == 'n') return true;
		}
		
		//<!-- Функция, позволяющая генерировать компьютеру номер клетки для атаки. При этом включаются только неатакованые клетки. Также проверяет условия победы компьютера. -->
		function computerAttack() {
			for (i = 10 * 10; i > 0; i--) {
				let cages = document.querySelectorAll('#matrixInterface1 .s, #matrixInterface1 .o');
				if (cages.length == 0 || attack(cages[getRandomInt(0,(cages.length-1))])) break;
			}
			if (document.querySelectorAll('#matrixInterface1 .s').length == 0) {
				alert('Computer is the winner.');
				location.reload();
			}
		} 
