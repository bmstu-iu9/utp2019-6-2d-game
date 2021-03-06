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
    
    let counts = [0, 0];
    let turn = true;
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
			alert("Данная версия предусматривает игру только с ИИ. Также присутствует генератор расположения кораблей. Ручной расстановки нет. Рекомендации по разработке находятся непосредственно в коде. Музыка: Саундтрек Warcraft2 Humans1. Авторы: Кулаков Андрей, Алексей Балабанов. "); 
		};
		//<!-- Функция "Главной кнопки"  -->
		buttonM.onclick = function () {
		player.play(); //<!-- Включение музыки -->
    buttonM.disabled = true;// <!-- Диактивация кнопки -->
    while(counts[1] != 20){
      counts[1] = 0;
      matrix2 = [];
      matrix2=matrixGenerator();// <!-- Генерация поля компьютера -->
      for(let i = 0; i < 10; i++) for(let j = 0; j < 10; j++) if(matrix2[i][j] == 's') counts[1]++;
    }
    alert("This version does not support ship placement so use random!");
    while(counts[0] != 20){
      counts[0] = 0;
      matrix1 = []
      matrix1=matrixGenerator();// <!-- Генерация поля игрока -->
      for(let i = 0; i < 10; i++) for(let j = 0; j < 10; j++) if(matrix1[i][j] == 's') counts[0]++;
    }
		//<!-- Заполнение системы вывода строками матрицы -->
		for (i = 0; i < 10; i++) {
			if (matrix1[i] != undefined) {
			outer.innerHTML += "<p class='testEnter'>" + matrix1[i] + "</p>";
			}
			if (matrix2[i] != undefined) {
				outer.innerHTML += "<p class='testEnter'>" + matrix2[i] + "</p>";
			}
		}
		//<!-- Далее циклы заполнения обоих полей, использующий данные из матрицы. Определяется класс, а затем элемент добавляется на поле. -->
    //<!--Также он содержит функцию клика на элемент, запускающий функцию атаки и атаки компьютера. В случае попадения дается дополнительный ход. -->
    
    for (i = 0; i < 10; i++){
      for (j = 0; j < 10; j++) {
        let col = document.createElement('div');
        col.id = 'p' + i + j;
        col.className = matrix1[i][j];
        field1.appendChild(col);
      }
    };

    for (i = 0; i < 10; i++){
      for (j = 0; j < 10; j++) {
        let col = document.createElement('div');
        col.id = 'c' + i + j;
        col.className = 'o'
        col.onclick = function () { 
          if(turn){
            if (attack(this)) {
              turn = false;
              setTimeout(computerAttack, 500);
            } 
          }
        };
        field2.appendChild(col);
      }
    };
  };
		
		//<!-- Функция сменяет статус атакуемой клетки и проверяет на условия победы. -->
		function attack(cage) {
      if (cage.className == 'y' || cage.className == 'n') return false;
      let target = cage.id[0] == 'p' ? 0 : 1, i = cage.id[1], j = cage.id[2];
      if(target ==  0){
        if (matrix1[i][j] == 's') {
          cage.className = 'y';
          counts[target]--;
        }
        else cage.className = 'n';
      }else{
        if (matrix2[i][j] == 's') {
          cage.className = 'y';
          counts[target]--;
        }
        else cage.className = 'n';
      }
			if (counts[target] == 0) {
        setTimeout(endOfGame, 100, target);
        return false;
			}
			if (cage.className == 'n') return true;
    }
    
    //Функция, используящая скрипт ИИ, которая бьет по клетке выбранной им . При этом включаются только неатакованые клетки.
    //Для подробностей смотри скрипт ai.js
		function computerAttack() {
      let x = AIAtack();
      if(attack(document.querySelector('#p' + Math.floor(x/10) + x%10))) turn = true; 
      else setTimeout(computerAttack, 500);
    }
    // Функция,завершающая игру
    function endOfGame(target){
      if(target == 0) alert('Computer is the winner');
      else alert('Player is the winner.'); 
      location.reload();
    }
