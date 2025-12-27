// src/core/GameState.js
import Cell from './Cell.js';
import { MonsterFactory } from './Monster.js';
import Constants from '../utils/Constants.js';

/**
 * 游戏状态管理器
 */
export default class GameState {
  constructor() {
    // 游戏配置
    this.mapSize = Constants.MAP_SIZES.small; // 默认小地图
    this.lifeCount = 3;                       // 默认生命值
    this.monsterMode = 1;                     // 怪物模式（1-5）
    this.difficulty = 'normal';               // 难度
    
    // 游戏数据
    this.grid = [];                           // 网格数据
    this.monsters = [];                       // 当前关卡的怪物
    this.availableMonsters = [];              // 可用的怪物类型
    this.remainingMonsters = 0;               // 剩余未标记的怪物数量
    this.correctlyMarked = 0;                 // 正确标记的怪物数量
    
    // 游戏状态
    this.gameState = 'ready';                 // ready, playing, won, lost
    this.startTime = 0;                       // 游戏开始时间
    this.elapsedTime = 0;                     // 已用时间
    
    // 初始化可用怪物
    this.availableMonsters = MonsterFactory.createMonsters();
    
    // 用于空格展开的队列
    this.expandQueue = [];
  }

  /**
   * 初始化游戏
   * @param {Object} config - 游戏配置
   */
  init(config = {}) {
    // 应用配置
    this.mapSize = config.mapSize || Constants.MAP_SIZES.small;
    this.lifeCount = config.lifeCount !== undefined ? config.lifeCount : 3;
    this.monsterMode = config.monsterMode || 1;
    this.difficulty = config.difficulty || 'normal';
    
    // 创建网格
    this.createGrid();
    
    // 生成怪物
    this.generateMonsters();
    
    // 重置状态
    this.gameState = 'ready';
    this.elapsedTime = 0;
    this.correctlyMarked = 0;
    this.remainingMonsters = this.monsters.length;
  }

  /**
   * 创建网格
   */
  createGrid() {
    this.grid = [];
    for (let y = 0; y < this.mapSize.height; y++) {
      const row = [];
      for (let x = 0; x < this.mapSize.width; x++) {
        row.push(new Cell(x, y));
      }
      this.grid.push(row);
    }
  }

  /**
   * 生成怪物
   */
  generateMonsters() {
    this.monsters = [];
    
    // 根据怪物模式获取可用怪物类型
    const availableTypes = MonsterFactory.getMonstersByMode(this.monsterMode);
    
    // 根据难度计算怪物数量
    let monsterCount;
    const totalCells = this.mapSize.width * this.mapSize.height;
    
    switch (this.difficulty) {
      case 'easy':
        monsterCount = Math.floor(totalCells * 0.08); // 8%
        break;
      case 'hard':
        monsterCount = Math.floor(totalCells * 0.20); // 20%
        break;
      default: // normal
        monsterCount = Math.floor(totalCells * 0.12); // 12%
    }
    
    // 确保怪物数量合理
    monsterCount = Math.max(1, Math.min(monsterCount, Math.floor(totalCells * 0.3)));
    
    // 生成随机位置
    const positions = [];
    for (let y = 0; y < this.mapSize.height; y++) {
      for (let x = 0; x < this.mapSize.width; x++) {
        positions.push({x, y});
      }
    }
    
    // 随机打乱位置
    this.shuffleArray(positions);
    
    // 选择前monsterCount个位置
    const selectedPositions = positions.slice(0, monsterCount);
    
    // 为每个位置分配怪物类型
    selectedPositions.forEach(pos => {
      const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      const monster = {
        x: pos.x,
        y: pos.y,
        type: randomType
      };
      this.monsters.push(monster);
      
      // 设置格子为怪物
      this.grid[pos.y][pos.x].setAsMine(randomType);
    });
    
    // 计算所有格子的数值
    this.calculateValues();
  }

  /**
   * 计算所有格子的数值
   */
  calculateValues() {
    // 重置所有非怪物格子的数值
    for (let y = 0; y < this.mapSize.height; y++) {
      for (let x = 0; x < this.mapSize.width; x++) {
        if (!this.grid[y][x].isMine) {
          this.grid[y][x].value = 0;
        }
      }
    }
    
    // 为每个怪物计算影响范围并累加数值
    this.monsters.forEach(monster => {
      const affectedPositions = monster.type.getAffectedPositions(
        monster.x, monster.y,
        this.mapSize.width, this.mapSize.height
      );
      
      affectedPositions.forEach(pos => {
        if (!this.grid[pos.y][pos.x].isMine) {
          this.grid[pos.y][pos.x].value += monster.type.value;
        }
      });
    });
  }

  /**
   * 开始游戏
   */
  startGame() {
    if (this.gameState !== 'ready') return;
    
    this.gameState = 'playing';
    this.startTime = Date.now();
  }

  /**
   * 处理格子点击
   * @param {number} x - 格子X坐标
   * @param {number} y - 格子Y坐标
   * @returns {boolean} - 是否触发失败
   */
  handleCellClick(x, y) {
    if (this.gameState !== 'playing') return false;
    if (x < 0 || x >= this.mapSize.width || y < 0 || y >= this.mapSize.height) return false;
    
    const cell = this.getCell(x, y);
    
    // 如果是标记过的格子，不能点击
    if (cell.isMarked) return false;
    
    // 如果已经揭开，不能再次点击
    if (cell.isRevealed) return false;
    
    // 探索单元格
    const isMine = cell.reveal();
    
    if (isMine) {
      // 触发怪物，扣减生命值
      this.lifeCount--;
      
      // 检查是否失败
      if (this.lifeCount <= 0) {
        this.gameState = 'lost';
        this.revealAllMines();
        return true;
      }
      
      // 如果还有生命值，继续游戏
      return false;
    }
    
    // 如果是空格子（数值为0），自动展开周围
    if (cell.value === 0) {
      this.autoRevealEmptyArea(x, y);
    }
    
    // 检查胜利条件
    this.checkWinCondition();
    
    return false;
  }

  /**
   * 自动展开空白区域
   * @param {number} startX - 起始X坐标
   * @param {number} startY - 起始Y坐标
   */
  autoRevealEmptyArea(startX, startY) {
    const visited = new Set();
    const stack = [{x: startX, y: startY}];
    
    while (stack.length > 0) {
      const pos = stack.pop();
      const key = `${pos.x},${pos.y}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      if (pos.x < 0 || pos.x >= this.mapSize.width || 
          pos.y < 0 || pos.y >= this.mapSize.height) continue;
      
      const cell = this.getCell(pos.x, pos.y);
      
      // 如果已探索或已标记，跳过
      if (cell.isRevealed || cell.isMarked) continue;
      
      // 探索单元格
      cell.reveal();
      
      // 如果是空白格子，继续探索周围
      if (cell.value === 0) {
        // 周围8个方向
        const directions = [
          [-1, -1], [0, -1], [1, -1],
          [-1, 0],           [1, 0],
          [-1, 1],  [0, 1],  [1, 1]
        ];
        
        directions.forEach(dir => {
          const newX = pos.x + dir[0];
          const newY = pos.y + dir[1];
          
          if (newX >= 0 && newX < this.mapSize.width && 
              newY >= 0 && newY < this.mapSize.height) {
            stack.push({x: newX, y: newY});
          }
        });
      }
    }
  }

  /**
   * 标记格子
   * @param {number} x - 格子X坐标
   * @param {number} y - 格子Y坐标
   * @param {string|null} monsterTypeId - 怪物类型ID，null表示取消标记
   */
  markCell(x, y, monsterTypeId) {
    if (this.gameState !== 'playing') return;
    if (x < 0 || x >= this.mapSize.width || y < 0 || y >= this.mapSize.height) return;
    
    const cell = this.getCell(x, y);
    const oldMarkedType = cell.markedMonsterType;
    const success = cell.mark(monsterTypeId);
    
    if (success) {
      // 如果是标记而不是取消标记
      if (monsterTypeId !== null) {
        // 检查是否标记正确
        const monster = this.monsters.find(m => m.x === x && m.y === y);
        if (monster && monster.type.id === monsterTypeId) {
          this.correctlyMarked++;
        } else if (oldMarkedType && oldMarkedType !== monsterTypeId) {
          // 如果之前标记正确，现在改了，需要减去
          const wasCorrect = this.monsters.find(m => m.x === x && m.y === y && m.type.id === oldMarkedType);
          if (wasCorrect) {
            this.correctlyMarked--;
          }
        }
      } else if (oldMarkedType !== null) {
        // 取消标记
        const wasCorrect = this.monsters.find(m => m.x === x && m.y === y && m.type.id === oldMarkedType);
        if (wasCorrect) {
          this.correctlyMarked--;
        }
      }
      
      // 更新剩余怪物数量
      this.updateRemainingMonsters();
      
      // 检查胜利条件
      this.checkWinCondition();
    }
  }

  /**
   * 更新剩余怪物数量
   */
  updateRemainingMonsters() {
    this.remainingMonsters = this.monsters.length - this.correctlyMarked;
  }

  /**
   * 检查胜利条件
   */
  checkWinCondition() {
    // 检查是否所有怪物都被正确标记
    if (this.correctlyMarked === this.monsters.length) {
      // 还需确保所有非怪物格子都被探索
      let allSafeCellsRevealed = true;
      
      for (let y = 0; y < this.mapSize.height; y++) {
        for (let x = 0; x < this.mapSize.width; x++) {
          const cell = this.getCell(x, y);
          if (!cell.isMine && !cell.isRevealed) {
            allSafeCellsRevealed = false;
            break;
          }
        }
        if (!allSafeCellsRevealed) break;
      }
      
      if (allSafeCellsRevealed) {
        this.gameState = 'won';
        // 标记所有怪物
        this.monsters.forEach(monster => {
          this.getCell(monster.x, monster.y).mark(monster.type.id);
        });
      }
    }
  }

  /**
   * 重新开始游戏
   */
  restart() {
    this.init({
      mapSize: this.mapSize,
      lifeCount: this.lifeCount,
      monsterMode: this.monsterMode,
      difficulty: this.difficulty
    });
  }

  /**
   * 更新游戏时间
   */
  update() {
    if (this.gameState === 'playing') {
      this.elapsedTime = (Date.now() - this.startTime) / 1000;
    }
  }

  /**
   * 数组随机打乱
   * @param {Array} array - 要打乱的数组
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * 获取格子
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   * @returns {Cell|null} - 格子对象
   */
  getCell(x, y) {
    if (x < 0 || x >= this.mapSize.width || y < 0 || y >= this.mapSize.height) {
      return null;
    }
    return this.grid[y][x];
  }

  /**
   * 揭示所有怪物
   */
  revealAllMines() {
    this.monsters.forEach(monster => {
      const cell = this.getCell(monster.x, monster.y);
      if (!cell.isRevealed) {
        cell.isRevealed = true;
      }
    });
  }

  /**
   * 获取游戏统计信息
   */
  getStats() {
    return {
      totalMines: this.monsters.length,
      remainingMines: this.remainingMonsters,
      correctlyMarked: this.correctlyMarked,
      lifeCount: this.lifeCount,
      gameState: this.gameState,
      elapsedTime: this.elapsedTime
    };
  }
}