// src/scenes/GameMain.js
import Constants from '../utils/Constants.js';
import GameState from '../core/GameState.js';
import Button from '../ui/Button.js';
import Panel from '../ui/Panel.js';
import Text from '../ui/Text.js';
import { MonsterFactory } from '../core/Monster.js';

/**
 * 游戏主场景
 * 包含完整的游戏UI和交互逻辑
 */
export default class GameMain {
  constructor() {
    this.gameState = new GameState();
    this.config = null;
    
    // UI元素
    this.buttons = [];
    this.panels = [];
    this.texts = [];
    
    // 拖拽系统
    this.draggedLabel = null;
    this.dragOffset = { x: 0, y: 0 };
    this.isDragging = false;
    this.touchStartPos = null;
    
    // 布局尺寸
    this.gameAreaWidth = 0;
    this.labelAreaWidth = 0;
    this.infoBarHeight = Constants.UI_LAYOUT.INFO_BAR_HEIGHT;
    this.monsterInfoHeight = Constants.UI_LAYOUT.MONSTER_INFO_HEIGHT;
    
    // 格子渲染相关
    this.cellSize = 0;
    this.gridOffsetX = 0;
    this.gridOffsetY = 0;
    
    // 标签相关
    this.monsterLabels = [];
    this.labelAreaX = 0;
    this.labelSize = 60;
    
    // 高亮的格子
    this.highlightedCell = null;
  }

  init(config) {
    // 如果通过changeScene调用，使用预设的config
    this.config = config || this.config || {
      mapSize: Constants.MAP_SIZES.small,
      lifeCount: 3,
      monsterMode: 1,
      difficulty: 'normal'
    };
    
    // 初始化游戏状态
    this.gameState.init(this.config);
    
    // 计算布局
    this.calculateLayout();
    
    // 创建UI
    this.createUI();
    
    // 创建怪物标签
    this.createMonsterLabels();
  }

  /**
   * 计算布局尺寸
   */
  calculateLayout() {
    // 游戏区域占80%宽度
    this.gameAreaWidth = Constants.SCREEN_WIDTH * Constants.UI_LAYOUT.GAME_AREA_RATIO;
    this.labelAreaWidth = Constants.SCREEN_WIDTH * (1 - Constants.UI_LAYOUT.GAME_AREA_RATIO);
    this.labelAreaX = this.gameAreaWidth;
    
    // 计算可用的游戏区域高度
    const availableHeight = Constants.SCREEN_HEIGHT - this.infoBarHeight - this.monsterInfoHeight;
    
    // 计算格子大小，确保网格适应屏幕
    const maxCellWidth = (this.gameAreaWidth - 40) / this.config.mapSize.width;
    const maxCellHeight = (availableHeight - 40) / this.config.mapSize.height;
    this.cellSize = Math.min(maxCellWidth, maxCellHeight, this.config.mapSize.cellSize);
    
    // 计算网格偏移，使其居中
    const gridWidth = this.cellSize * this.config.mapSize.width;
    const gridHeight = this.cellSize * this.config.mapSize.height;
    this.gridOffsetX = (this.gameAreaWidth - gridWidth) / 2;
    this.gridOffsetY = this.infoBarHeight + (availableHeight - gridHeight) / 2;
  }

  /**
   * 创建UI元素
   */
  createUI() {
    // 信息栏背景
    this.infoPanel = new Panel(
      0,
      0,
      Constants.SCREEN_WIDTH,
      this.infoBarHeight,
      {
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        borderColor: Constants.COLORS.PRIMARY,
        borderWidth: 2,
        cornerRadius: 0,
        opacity: 1
      }
    );
    
    // 计时器文本
    this.timerText = new Text(
      20,
      this.infoBarHeight / 2,
      '时间: 00:00',
      {
        fontSize: Constants.FONT_SIZES.NORMAL,
        align: 'left',
        baseline: 'middle',
        color: Constants.COLORS.TEXT_PRIMARY
      }
    );
    
    // 生命值文本
    this.livesText = new Text(
      200,
      this.infoBarHeight / 2,
      `生命: ${this.gameState.lifeCount}`,
      {
        fontSize: Constants.FONT_SIZES.NORMAL,
        align: 'left',
        baseline: 'middle',
        color: Constants.COLORS.DANGER
      }
    );
    
    // 重新开始按钮
    this.restartButton = new Button(
      this.gameAreaWidth - 170,
      this.infoBarHeight / 2 - 25,
      150,
      50,
      '重新开始',
      () => {
        this.restart();
        wx.vibrateShort({ type: 'light' });
      }
    );
    
    // 怪物图鉴按钮
    this.encyclopediaButton = new Button(
      this.gameAreaWidth - 350,
      this.infoBarHeight / 2 - 25,
      160,
      50,
      '怪物图鉴',
      () => {
        this.showEncyclopedia();
        wx.vibrateShort({ type: 'light' });
      }
    );
    
    // 底部怪物信息栏
    const bottomY = Constants.SCREEN_HEIGHT - this.monsterInfoHeight;
    this.monsterInfoPanel = new Panel(
      0,
      bottomY,
      this.gameAreaWidth,
      this.monsterInfoHeight,
      {
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        borderColor: Constants.COLORS.SECONDARY,
        borderWidth: 2,
        cornerRadius: 0,
        opacity: 1
      }
    );
    
    this.monsterCountText = new Text(
      20,
      bottomY + this.monsterInfoHeight / 2,
      `剩余怪物: ${this.gameState.remainingMonsters}`,
      {
        fontSize: Constants.FONT_SIZES.NORMAL,
        align: 'left',
        baseline: 'middle',
        color: Constants.COLORS.HIGHLIGHT
      }
    );
    
    // 标签区域背景
    this.labelAreaPanel = new Panel(
      this.labelAreaX,
      this.infoBarHeight,
      this.labelAreaWidth,
      Constants.SCREEN_HEIGHT - this.infoBarHeight - this.monsterInfoHeight,
      {
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        borderColor: Constants.COLORS.HIGHLIGHT,
        borderWidth: 2,
        cornerRadius: 0,
        opacity: 1,
        title: '怪物标签'
      }
    );
    
    // 添加到按钮数组
    this.buttons = [this.restartButton, this.encyclopediaButton];
  }

  /**
   * 创建怪物标签
   */
  createMonsterLabels() {
    this.monsterLabels = [];
    const monsters = MonsterFactory.getMonstersByMode(this.config.monsterMode);
    
    const startY = this.infoBarHeight + 80;
    const spacing = 80;
    const labelX = this.labelAreaX + (this.labelAreaWidth - this.labelSize) / 2;
    
    monsters.forEach((monster, index) => {
      this.monsterLabels.push({
        monster: monster,
        x: labelX,
        y: startY + index * spacing,
        originalX: labelX,
        originalY: startY + index * spacing,
        width: this.labelSize,
        height: this.labelSize,
        isDragging: false
      });
    });
  }

  /**
   * 更新游戏状态
   */
  update(deltaTime) {
    this.gameState.update();
    
    // 更新UI文本
    const minutes = Math.floor(this.gameState.elapsedTime / 60);
    const seconds = Math.floor(this.gameState.elapsedTime % 60);
    this.timerText.setText(
      `时间: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );
    
    this.livesText.setText(`生命: ${this.gameState.lifeCount}`);
    this.monsterCountText.setText(`剩余怪物: ${this.gameState.remainingMonsters}`);
    
    // 检查游戏状态
    if (this.gameState.gameState === 'won') {
      this.showVictoryScreen();
    } else if (this.gameState.gameState === 'lost') {
      this.showDefeatScreen();
    }
  }

  /**
   * 绘制场景
   */
  draw(ctx) {
    // 背景
    ctx.fillStyle = Constants.COLORS.BACKGROUND;
    ctx.fillRect(0, 0, Constants.SCREEN_WIDTH, Constants.SCREEN_HEIGHT);
    
    // 绘制信息栏
    this.infoPanel.draw(ctx, this.screenAdapter);
    this.timerText.draw(ctx);
    this.livesText.draw(ctx);
    
    // 绘制按钮
    this.buttons.forEach(button => button.draw(ctx));
    
    // 绘制底部怪物信息栏
    this.monsterInfoPanel.draw(ctx, this.screenAdapter);
    this.monsterCountText.draw(ctx);
    
    // 绘制游戏网格
    this.drawGrid(ctx);
    
    // 绘制标签区域
    this.labelAreaPanel.draw(ctx, this.screenAdapter);
    this.drawMonsterLabels(ctx);
  }

  /**
   * 绘制游戏网格
   */
  drawGrid(ctx) {
    for (let y = 0; y < this.config.mapSize.height; y++) {
      for (let x = 0; x < this.config.mapSize.width; x++) {
        const cell = this.gameState.getCell(x, y);
        if (!cell) continue;
        
        const screenX = this.gridOffsetX + x * this.cellSize;
        const screenY = this.gridOffsetY + y * this.cellSize;
        
        // 绘制格子
        this.drawCell(ctx, cell, screenX, screenY);
      }
    }
  }

  /**
   * 绘制单个格子
   */
  drawCell(ctx, cell, x, y) {
    const padding = 2;
    const innerX = x + padding;
    const innerY = y + padding;
    const innerSize = this.cellSize - padding * 2;
    
    // 格子背景
    if (cell.isRevealed) {
      ctx.fillStyle = Constants.COLORS.CELL_REVEALED;
    } else if (cell.isMarked) {
      ctx.fillStyle = Constants.COLORS.CELL_MARKED;
    } else if (this.highlightedCell && this.highlightedCell.x === cell.x && this.highlightedCell.y === cell.y) {
      ctx.fillStyle = Constants.COLORS.HIGHLIGHT;
    } else {
      ctx.fillStyle = Constants.COLORS.CELL_DEFAULT;
    }
    
    ctx.fillRect(innerX, innerY, innerSize, innerSize);
    
    // 格子边框
    ctx.strokeStyle = Constants.COLORS.GRID_LINE;
    ctx.lineWidth = 1;
    ctx.strokeRect(innerX, innerY, innerSize, innerSize);
    
    // 绘制内容
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const centerX = x + this.cellSize / 2;
    const centerY = y + this.cellSize / 2;
    
    if (cell.isRevealed) {
      if (cell.isMine) {
        // 绘制怪物图标
        this.drawMonsterSprite(ctx, cell.monsterType, centerX, centerY, innerSize * 0.8);
      } else if (cell.value > 0) {
        // 绘制数字
        ctx.fillStyle = this.getNumberColor(cell.value);
        ctx.font = `bold ${Math.floor(innerSize * 0.5)}px ${Constants.FONT_FAMILY}`;
        ctx.fillText(cell.value.toString(), centerX, centerY);
      }
    } else if (cell.isMarked && cell.markedMonsterType) {
      // 绘制标记的怪物
      const monster = MonsterFactory.createMonsters().find(m => m.id === cell.markedMonsterType);
      if (monster) {
        this.drawMonsterSprite(ctx, monster, centerX, centerY, innerSize * 0.7);
      }
    }
  }

  /**
   * 绘制怪物精灵
   */
  drawMonsterSprite(ctx, monster, centerX, centerY, size) {
    if (!window.resources || !window.resources.sprites || !window.resources.sprites.monsters) {
      // 如果资源未加载，绘制占位符
      ctx.fillStyle = '#ff5252';
      ctx.font = `${Math.floor(size * 0.5)}px ${Constants.FONT_FAMILY}`;
      ctx.fillText('M', centerX, centerY);
      return;
    }
    
    const img = window.resources.sprites.monsters;
    const halfSize = size / 2;
    
    try {
      ctx.drawImage(
        img,
        monster.spriteX, monster.spriteY, monster.spriteWidth, monster.spriteHeight,
        centerX - halfSize, centerY - halfSize, size, size
      );
    } catch (e) {
      // 绘制失败，显示占位符
      ctx.fillStyle = '#ff5252';
      ctx.fillRect(centerX - halfSize, centerY - halfSize, size, size);
    }
  }

  /**
   * 绘制怪物标签
   */
  drawMonsterLabels(ctx) {
    this.monsterLabels.forEach(label => {
      // 如果正在被拖拽，跳过（稍后单独绘制）
      if (label === this.draggedLabel) return;
      
      this.drawLabel(ctx, label);
    });
    
    // 绘制正在拖拽的标签（最后绘制，确保在最上层）
    if (this.draggedLabel) {
      this.drawLabel(ctx, this.draggedLabel);
    }
  }

  /**
   * 绘制单个标签
   */
  drawLabel(ctx, label) {
    // 标签背景
    ctx.fillStyle = 'rgba(60, 60, 60, 0.9)';
    ctx.fillRect(label.x, label.y, label.width, label.height);
    
    // 标签边框
    ctx.strokeStyle = Constants.COLORS.HIGHLIGHT;
    ctx.lineWidth = 2;
    ctx.strokeRect(label.x, label.y, label.width, label.height);
    
    // 绘制怪物精灵
    const centerX = label.x + label.width / 2;
    const centerY = label.y + label.height / 2;
    this.drawMonsterSprite(ctx, label.monster, centerX, centerY, label.width * 0.8);
    
    // 绘制怪物名称（在标签下方）
    ctx.fillStyle = Constants.COLORS.TEXT_PRIMARY;
    ctx.font = `${Constants.FONT_SIZES.SMALL}px ${Constants.FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.fillText(label.monster.name, centerX, label.y + label.height + 15);
  }

  /**
   * 获取数字颜色
   */
  getNumberColor(value) {
    const colors = [
      '#000', '#0080ff', '#00a000', '#ff0000', 
      '#000080', '#800000', '#008080', '#808080', '#888800'
    ];
    return colors[Math.min(value, colors.length - 1)] || '#000';
  }

  /**
   * 处理触摸开始
   */
  handleTouchStart(x, y) {
    this.touchStartPos = { x, y };
    
    // 开始游戏（如果还未开始）
    if (this.gameState.gameState === 'ready') {
      this.gameState.startGame();
    }
    
    // 检查按钮点击
    this.buttons.forEach(button => {
      button.update(x, y);
      if (button.isHovered) {
        button.press();
      }
    });
    
    // 检查标签拖拽
    for (let i = this.monsterLabels.length - 1; i >= 0; i--) {
      const label = this.monsterLabels[i];
      if (this.isPointInRect(x, y, label.x, label.y, label.width, label.height)) {
        this.draggedLabel = label;
        this.isDragging = true;
        this.dragOffset = {
          x: x - label.x,
          y: y - label.y
        };
        wx.vibrateShort({ type: 'light' });
        return;
      }
    }
    
    // 检查格子点击（只有在不拖拽标签时）
    if (!this.isDragging) {
      const gridPos = this.screenToGridCoords(x, y);
      if (gridPos) {
        this.gameState.handleCellClick(gridPos.x, gridPos.y);
        wx.vibrateShort({ type: 'medium' });
      }
    }
  }

  /**
   * 处理触摸移动
   */
  handleTouchMove(x, y) {
    // 更新按钮悬停状态
    this.buttons.forEach(button => button.update(x, y));
    
    // 处理标签拖拽
    if (this.isDragging && this.draggedLabel) {
      this.draggedLabel.x = x - this.dragOffset.x;
      this.draggedLabel.y = y - this.dragOffset.y;
      
      // 检查是否悬停在格子上
      const gridPos = this.screenToGridCoords(x, y);
      if (gridPos) {
        this.highlightedCell = gridPos;
      } else {
        this.highlightedCell = null;
      }
    }
  }

  /**
   * 处理触摸结束
   */
  handleTouchEnd(x, y) {
    // 处理按钮释放
    this.buttons.forEach(button => {
      button.update(x, y);
      button.release();
    });
    
    // 处理标签放置
    if (this.isDragging && this.draggedLabel) {
      const gridPos = this.screenToGridCoords(x, y);
      
      if (gridPos) {
        // 标记格子
        this.gameState.markCell(gridPos.x, gridPos.y, this.draggedLabel.monster.id);
        wx.vibrateShort({ type: 'heavy' });
      }
      
      // 重置标签位置
      this.draggedLabel.x = this.draggedLabel.originalX;
      this.draggedLabel.y = this.draggedLabel.originalY;
      this.draggedLabel = null;
      this.isDragging = false;
      this.highlightedCell = null;
    }
    
    this.touchStartPos = null;
  }

  /**
   * 屏幕坐标转换为网格坐标
   */
  screenToGridCoords(x, y) {
    const gridX = Math.floor((x - this.gridOffsetX) / this.cellSize);
    const gridY = Math.floor((y - this.gridOffsetY) / this.cellSize);
    
    if (gridX >= 0 && gridX < this.config.mapSize.width &&
        gridY >= 0 && gridY < this.config.mapSize.height) {
      return { x: gridX, y: gridY };
    }
    
    return null;
  }

  /**
   * 检查点是否在矩形内
   */
  isPointInRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
  }

  /**
   * 重新开始游戏
   */
  restart() {
    this.gameState.restart();
    this.highlightedCell = null;
    this.draggedLabel = null;
    this.isDragging = false;
  }

  /**
   * 显示怪物图鉴
   */
  showEncyclopedia() {
    // TODO: 实现怪物图鉴弹窗
    console.log('显示怪物图鉴');
  }

  /**
   * 显示胜利画面
   */
  showVictoryScreen() {
    // 播放胜利音效
    if (window.resources && window.resources.audio && window.resources.audio.victory) {
      window.resources.audio.victory.play();
    }
    
    // TODO: 可以添加胜利画面弹窗
    // 暂时使用setTimeout后跳转回模式选择
    setTimeout(() => {
      if (this.sceneManager) {
        this.sceneManager.changeScene(Constants.SCENE_MODE_SELECTION);
      }
    }, 2000);
  }

  /**
   * 显示失败画面
   */
  showDefeatScreen() {
    // 播放失败音效
    if (window.resources && window.resources.audio && window.resources.audio.defeat) {
      window.resources.audio.defeat.play();
    }
    
    // TODO: 可以添加失败画面弹窗
    // 暂时使用setTimeout后跳转回模式选择
    setTimeout(() => {
      if (this.sceneManager) {
        this.sceneManager.changeScene(Constants.SCENE_MODE_SELECTION);
      }
    }, 2000);
  }

  /**
   * 场景调整大小
   */
  resize() {
    this.calculateLayout();
    this.createMonsterLabels();
  }

  /**
   * 清理场景
   */
  destroy() {
    this.buttons = [];
    this.panels = [];
    this.texts = [];
    this.monsterLabels = [];
    this.draggedLabel = null;
  }
}
