class Game {
  constructor() {
    this.board = new Cells(4);
    this.view = new View();
    this.isGaming = true;
  }
  //游戏开局
  start() {
    this.board.init();
    let that = this;
    that.board.randomCell();
    let lists = that.board.getLists();
    that.view.setLists(lists);
    that.view.show()
    that.board.endRound();
    let e = document.querySelector('body');
    e.addEventListener('keydown', function (e) {
      let move = null;
      switch (e.keyCode) {
        case 37:
          move = {
            x: -1,
            y: 0
          }
          break;
        case 38:
          move = {
            x: 0,
            y: -1
          }
          break;
        case 39:
          move = {
            x: 1,
            y: 0
          }
          break;
        case 40:
          move = {
            x: 0,
            y: 1
          }
          break;
        default:
          break;
      }
      if (move && that.isGaming) {
        that.action(move);
      }
    });
  }
  action(move) {
    let that = this;
    that.board.moveCells(move);
    that.board.randomCell();
    let lists = that.board.getLists();
    that.view.setLists(lists);
    that.view.setScore(that.board.getScore());
    that.view.show();
    that.board.endRound();

    switch (that.board.isEnd()) {
      case 1:
        that.isGaming = true;
        break;
      case 2:
        that.isGaming = false;
        that.view.showResult("你输了");

        break;
      case 3:
        that.isGaming = false;
        that.view.showResult("你赢了");
        break;
    }
  }
}


// 棋盘的基本格子
class Cell {
  constructor(x, y, value, existed) {
    this.x = x;
    this.y = y;
    this.existed = existed || false;
    this.marged = false;
    this.chequer = null;

  }
  margeCell() {
    this.marged = true;
    this.chequer.doubleValue();
  }
  changCell(chequer) {
    this.existed = !this.existed;
    if (chequer) {
      this.chequer = chequer;
    } else {
      this.chequer = null;
    }
  }
}
// 代表棋盘
class Cells {
  constructor(size) {
    this.score = 0;
    this.size = size;
    this.cells = [];
    this.emptyCells = [];
    this.moveLists = [];
    this.removeLists = [];
    this.newLists = [];

  }
  getScore() {
    return this.score;
  }
  getLists() {
    return {
      moveLists: this.moveLists,
      removeLists: this.removeLists,
      newLists: this.newLists
    }
  }
  endRound() {
    this.moveLists = [];
    this.removeLists = [];
    this.newLists = [];
    this.getEmptyCells();
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.cells[i][j].marged = false;

      }
    }
  }
  // 单个格子上棋子的移动
  moveCell(newPos, oldPos, value) {
    if (this.cells[newPos.x][newPos.y].existed) {
      this.moveLists.push({
        newPos: newPos,
        oldPos: oldPos
      });
      this.removeLists.push({
        x: newPos.x,
        y: newPos.y,
        value: value
      });
      this.newLists.push({
        x: newPos.x,
        y: newPos.y,
        isMarged: true,
        value: value * 2
      });
      this.score += value;
      this.cells[oldPos.x][oldPos.y].changCell();
      this.cells[newPos.x][newPos.y].margeCell();
    } else {

      this.moveLists.push({
        newPos: newPos,
        oldPos: oldPos
      });
      this.cells[newPos.x][newPos.y].changCell(this.cells[oldPos.x][oldPos.y].chequer);
      this.cells[oldPos.x][oldPos.y].changCell();

    }
  }
  // 整个格子的移动
  // dir：移动的方向
  moveCells(dir) {
    if (dir.x === 0) {
      if (dir.y === -1) {
        for (let j = 0; j < this.size; j++) {
          let i = 0
          let index = -1;
          let index2 = -1;
          let value = 0;
          while (i < this.size) {
            if (this.cells[i][j].existed) {
              index = i;
              value = this.cells[i][j].chequer.value;
              for (let k = i - 1; k >= 0; k--) {
                if (!this.cells[k][j].existed) {
                  index2 = k;
                } else if (this.cells[k][j].chequer.value === value && !this.cells[k][j].marged) {
                  index2 = k;
                  break;
                } else {
                  break;
                }
              }
              if (index2 !== -1) {
                this.moveCell({
                  x: index2,
                  y: j
                }, {
                    x: index,
                    y: j
                  }, value)
              }
            }


            i++;
          }
        }
      } else {
        for (let j = 0; j < this.size; j++) {
          let i = this.size - 1
          let index = -1;
          let index2 = -1;
          let value = 0;
          while (i >= 0) {
            if (this.cells[i][j].existed) {
              index = i;
              value = this.cells[i][j].chequer.value;
              for (let k = i + 1; k < this.size; k++) {
                if (!this.cells[k][j].existed) {
                  index2 = k;
                } else if (this.cells[k][j].chequer.value === value && !this.cells[k][j].marged) {
                  index2 = k;
                  break;
                } else {
                  break;
                }
              }
              if (index2 !== -1) {
                this.moveCell({
                  x: index2,
                  y: j
                }, {
                    x: index,
                    y: j
                  }, value)
              }
            }


            i--;
          }
        }
      }
    }
    if (dir.y === 0) {
      if (dir.x === -1) {
        for (let i = 0; i < this.size; i++) {
          let j = 0
          let index = -1;
          let index2 = -1;
          let value = 0;
          while (j < this.size) {
            if (this.cells[i][j].existed) {
              index = j;
              value = this.cells[i][j].chequer.value;
              for (let k = j - 1; k >= 0; k--) {
                if (!this.cells[i][k].existed) {
                  index2 = k;
                } else if (this.cells[i][k].chequer.value === value && !this.cells[i][k].marged) {
                  index2 = k;
                  break;
                } else {
                  break;
                }
              }
              if (index2 !== -1) {
                this.moveCell({
                  x: i,
                  y: index2
                }, {
                    x: i,
                    y: index
                  }, value)
              }
            }


            j++;
          }
        }
      } else {
        for (let i = 0; i < this.size; i++) {
          let j = this.size - 1
          let index = -1;
          let index2 = -1;
          let value = 0;
          while (j >= 0) {
            if (this.cells[i][j].existed) {
              index = j;
              value = this.cells[i][j].chequer.value;
              for (let k = j + 1; k < this.size; k++) {
                if (!this.cells[i][k].existed) {
                  index2 = k;
                } else if (this.cells[i][k].chequer.value === value && !this.cells[i][k].marged) {
                  index2 = k;
                  break;
                } else {
                  break;
                }
              }
              if (index2 !== -1) {
                this.moveCell({
                  x: i,
                  y: index2
                }, {
                    x: i,
                    y: index
                  }, value)
              }
            }


            j--;
          }
        }
      }
    }
  }
  // 初始化
  init() {
    for (let i = 0; i < this.size; i++) {
      this.cells[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.cells[i][j] = new Cell(i, j);
        this.emptyCells.push(this.cells[i][j]);
      }
    }
  }
  // 获得剩余的空格子
  getEmptyCells() {
    this.emptyCells = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.cells[i][j].existed === false) {
          this.emptyCells.push(this.cells[i][j]);
        }
      }
    }
  }
  // 生成随机的格子
  randomCell() {
    this.getEmptyCells();
    if (this.emptyCells.length !== 0) {
      let position = Math.floor(Math.random() * this.emptyCells.length);
      let value = Math.round(Math.random()) === 1 ? 2 : 4;
      let newPos = this.emptyCells[position];
      this.cells[newPos.x][newPos.y].chequer = new Chequer(newPos.x, newPos.y, value);
      this.cells[newPos.x][newPos.y].existed = true;
      this.newLists.push({
        x: newPos.x,
        y: newPos.y,

        value: value
      });

    }
  }
  // 1游戏继续
  // 2游戏获胜
  // 3游戏失败
  isEnd() {
    this.getEmptyCells();
    if (this.emptyCells.length === 0) {
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size - 1; j++) {
          if (this.cells[i][j].chequer.value === this.cells[i][j + 1].chequer.value) {
            return 1;
          }
        }
      }
      for (let j = 0; j < this.size; j++) {
        for (let i = 0; i < this.size - 1; i++) {
          if (this.cells[i][j].chequer.value === this.cells[i + 1][j].chequer.value) {
            return 1;
          }
        }
      }
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          if (this.cells[i][j].chequer.value === 2048) {
            return 3;
          }
        }
      }
      return 2;

    } else {
      return 1;
    }
  }
}
// 代表棋子
class Chequer {
  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
  }
  doubleValue() {
    this.value *= 2;
  }
}
// 视图层
// 将dom节点存于board中，避免再次查找
// 同时，将整个动作拆分成棋子移动阶段、棋子生成阶段、以及棋子消除阶段（棋子合并由这三个阶段组成）
class View {
  constructor() {
    this.game = document.getElementById("game");
    this.message = document.getElementById("message");
    this.score = document.getElementById("score");
    this.scoreNum = 0;
    this.moveLists = [];
    this.removeLists = [];
    this.newLists = [];
    this.removeLists2 = [];
    this.board = [];
  }
  setScore(score) {
    this.score.innerText = "分数：" + score;
  }
  setLists(lists) {
    this.moveLists.push(...lists.moveLists);
    this.removeLists.push(...lists.removeLists);
    this.newLists.push(...lists.newLists);
  }
  show() {
    window.requestAnimationFrame(() => {
      this.removeItem();
      this.moveItem();
      this.newItem();
    });
  }
  showResult(msg) {
    window.requestAnimationFrame(() => {
      this.message.innerText = msg;
    });
  }
  moveItem() {
    let that = this;
    let item, newClass, oldClass;
    let x1, x2, y1, y2;
    while (this.moveLists.length !== 0) {
      item = this.moveLists.shift();
      x1 = item.newPos.x;
      y1 = item.newPos.y;
      x2 = item.oldPos.x;
      y2 = item.oldPos.y;
      newClass = `position-${x1}-${y1}`;
      oldClass = `position-${x2}-${y2}`;
      if (!this.board[x1 * 4 + y1]) {
        this.board[x1 * 4 + y1] = {
          old: [],
          now: this.board[x2 * 4 + y2].now
        }
        this.board[x2 * 4 + y2] = null;
      } else {
        this.board[x1 * 4 + y1].old.push(this.board[x1 * 4 + y1].now);
        this.board[x1 * 4 + y1].now = this.board[x2 * 4 + y2].now;
        this.board[x2 * 4 + y2] = null;
      }
      let el = this.board[x1 * 4 + y1].now;
      el.classList.remove(oldClass);
      el.classList.add(newClass);
    }
  }
  newItem() {
    let fragment = document.createDocumentFragment();
    let div, item;
    while (this.newLists.length !== 0) {
      div = document.createElement("div");
      item = this.newLists.shift();
      div.innerText = item.value;
      div.classList.add(`num-${item.value}`);
      div.classList.add(`cell`);
      div.classList.add(`position-${item.x}-${item.y}`);
      if (item.isMarged) {
        div.classList.add(`margeCell`);
      } else {
        div.classList.add(`appearCell`);
      }

      fragment.appendChild(div);
      if (!this.board[item.x * 4 + item.y]) {
        this.board[item.x * 4 + item.y] = {
          old: [],
          now: div
        }
      } else {
        this.board[item.x * 4 + item.y].old.push(this.board[item.x * 4 + item.y].now);
        this.board[item.x * 4 + item.y].now = div;
      }

    }
    this.game.appendChild(fragment);
  }
  removeItem() {
    let that = this;
    let item, el;
    while (this.removeLists2.length !== 0) {
      item = this.removeLists2.shift();
      while (this.board[item.x * 4 + item.y].old.length !== 0) {
        el = this.board[item.x * 4 + item.y].old.shift();

        that.game.removeChild(el);
      }
    }
    while (this.removeLists.length !== 0) {
      let el = that.removeLists.shift();
      this.removeLists2.push({
        x: el.x,
        y: el.y
      })
    }


  }
}
let game = new Game();
game.start();
