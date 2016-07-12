var startBtn = null;
var size = 4;
startBtn = document.getElementById("startBtn");
startBtn.style.left = window.innerWidth / 2 - 400 + "px";
startBtn.style.top = window.innerHeight / 2 - 400 + "px";
var sizeBox = document.getElementById("sizeBox");
sizeBox.style.left = parseInt(startBtn.style.left) + 105 + "px";
sizeBox.style.top = startBtn.style.top;
var timer = document.getElementById("timer");
timer.style.left = parseInt(startBtn.style.left) + 160 + "px";
timer.style.top = sizeBox.style.top;
var isRunning = false;

function Game(size){
    this.size = size;
    this.field = null;
    var self = this;
    var values = null;
    this.emptySpace = {
        i: this.size - 1,
        j: this.size - 1,
        value: this.size * this.size
    };
    
    this.createField = function(){
        this.field = document.createElement("DIV");
        this.field.classList.add("gameField");
        this.field.id = "gameField";
        this.field.style.left = startBtn.style.left;
        this.field.style.top = parseInt(startBtn.style.top) + 45 + "px";
        this.field.style.width = size * 100 + "px";
        this.field.style.height = size * 100 + "px";
        if (!self.createButtons(this.field)){
            this.destroy();
            this.createField();
        }
        else {
            document.body.appendChild(this.field);
        }
        
    };
    this.createButtons = function (field){
        values = new Array(this.size);
        for (var i = 0; i < this.size; i++){
            values[i] = new Array(this.size);
        }
        var id = 0; var p = {x: 0, y: 0};
        var numbers = new Array(this.size * this.size - 1);
        for (var i = 0; i < this.size * this.size - 1; i++){
            numbers[i] = i + 1;
        }
        var ids = new Array();
        for (var i = 0; i < this.size; i++){
            for (var j = 0; j < this.size; j++){
                if (i == this.size - 1 && j == this.size - 1){
                    this.emptySpace.x = i * 100;
                    this.emptySpace.y = j * 100;
                    values[i][j] = this.emptySpace.value;
                    ids.push(0);
                    break;
                }
                var btn = document.createElement("BUTTON");
                btn.classList.add("gameBtn");
                id = Math.floor(Math.random() * (this.size * this.size - 1));
                if (numbers[id] != 0){
                    numbers[id] = 0;
                }
                else{
                    var idl = id;
                    var idr = id;
                    while (numbers[idl] == 0 && idl-- >= 0) ;
                    while (numbers[idr] == 0 && idr++ < this.size * this.size - 1);
                    id = (idl < 0) ? idr : idl;
                    numbers[id] = 0;
                        
                }
                btn.id = "g" + ++id;
                btn.style.left = p.x + "px";
                btn.innerHTML = id;
                btn.value = id;
                values[i][j] = id;
                ids.push(id);
                p.x += 100;
                btn.style.top = p.y + "px";
                btn.onclick = this.onGameBtnCLick.bind(this);
                field.appendChild(btn);
                
            }
            p.y += 100;
            p.x = 0;
        }
         return this.checkSolutionExistence(ids);
    };
    this.destroy = function () {
        for (var i = 1; i <= size * size; i++){
            var delBtn = document.getElementById("g" + i);
            if (delBtn != null){
                delBtn.remove();
            }
        }
        this.field.remove();
    };
    this.swap = function (row, col) {
        var tmp = values[this.emptySpace.i][this.emptySpace.j];
        values[this.emptySpace.i][this.emptySpace.j] = values[this.emptySpace.i + row][this.emptySpace.j + col];
        values[this.emptySpace.i + row][this.emptySpace.j + col] = tmp;
    };
    this.onGameBtnCLick = function (event) {
        if (!isRunning){
            isRunning = true;
            startTimer();
        }
        var canGoRight = false, canGoUp = false;
        var buttonCol = parseInt(event.currentTarget.style.left) / 100;
        var buttonRow = parseInt(event.currentTarget.style.top) / 100;
        if (((canGoRight = buttonCol - 1 == this.emptySpace.j) || buttonCol + 1 == this.emptySpace.j) &&
              this.emptySpace.i == buttonRow){
            if (canGoRight){
                this.swap(0, 1);
            }
            else{
                this.swap(0, -1);
            }
            var tmp = this.emptySpace.j * 100;
            this.emptySpace.j = buttonCol;
            event.currentTarget.style.left = tmp + "px";
        }
        else if (((canGoUp = buttonRow + 1 == this.emptySpace.i) || buttonRow - 1 == this.emptySpace.i) &&
                   buttonCol == this.emptySpace.j){
            if (canGoUp){
                this.swap(-1, 0);
            }
            else{
                this.swap(1, 0);
            }
            var tmp = this.emptySpace.i * 100;
            this.emptySpace.i = buttonRow;
            event.currentTarget.style.top = tmp + "px";
        }
        if (this.checkWinCondition()){
            isRunning = false;
            alert("Victory!");
        }

    };
    this.checkSolutionExistence = function (nums) {
        var inv = 0;
        for (var i = 0; i < this.size * this.size; i++){
                if (nums[i])
                    for (var j = 0; j < i; j++){
                        if (nums[j] > nums[i]){
                            inv++;
                        }
                    }
        }
        if (this.size & 1){
            return inv & 1 ? false : true;
        }
        for (i = 0; i < this.size * this.size; i++){
           if (!nums[i])
                inv += 1 + i / this.size;
        }
        return inv & 1 ? false : true;
    };
    this.checkWinCondition = function () {
        for (var i = 0; i < this.size; i++){
            for (var j = 0; j < this.size; j++){
                if (values[i][j] != i * this.size + j + 1){
                    return false;
                }
            }
        }
        return true;
    };
}

function startTimer() {
    if (!isRunning) {
        timer.innerHTML = 'Таймер: 00:00:00';
        return;
    }
    var time = timer.innerHTML;
    var HMS = time.split(":");
    var h = HMS[1];
    var m = HMS[2];
    var s = HMS[3];
    if (s == 60) {
        if (m == 60) {
            h++;
            m = 0;
            if (h < 10)
                h = "0" + h;
        }
        m++;
        if (m < 10)
            m = "0" + m;
        s = 0;
    }
    else
        s++;
    if (s < 10)
        s = "0" + s;
    document.getElementById("timer").innerHTML = "Таймер: " + h + ":" + m + ":" + s;
    setTimeout(startTimer, 1000);
}

var game = null;

startBtn.onclick =  function (){
    isRunning = false;
    if (game != null){
        game.destroy();
    }
    size = parseInt(document.getElementById("sizeBox").value);
    game = new Game(size);
    game.createField();
    
};