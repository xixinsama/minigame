// src/scenes/TutorialLevel.js
import Constants from '../utils/Constants.js';
import GameState from '../core/GameState.js';
import Button from '../ui/Button.js';
import Panel from '../ui/Panel.js';
import Text from '../ui/Text.js';

export default class TutorialLevel {
  constructor() {
    this.gameState = null;
    this.buttons = [];
    this.tutorialStep = 0; // 教程步骤
    this.tutorialMessages = [
      "新手教程：点击格子探明区域",
      "数字表示周围怪物的数值总和",
      "将右侧的怪物标签拖到对应位置进行标注",
      "标注正确可避免损失生命值"
    ];
    this.isDragging = false;
    this.draggedMonster = null;
    this.dragStartPos = null;
  }

  init() {
    // 初始化游戏状态 - 新手教程关配置
    this.gameState = new GameState();
    this.gameState.init({
      mapSize: Constants.MAP_SIZES.small, // 小地图
      lifeCount: 3,                       // 3条生命
      monsterMode: 1,                     // 怪物模式1（前3种怪）
      difficulty: 'easy'                  // 简单难度
    });
    
    this.gameState.startGame();
    
    // 创建UI元素
    this.createUI();
  }

  createUI() {
    const buttonWidth = 200;
    const buttonHeight = 50;
    
    // 返回按钮
    this.backButton = new Button(
      20,
      20,
      buttonWidth,
      buttonHeight,
      "返回",
      () => {
        if (this.sceneManager) {
          this.sceneManager.changeScene(Constants.SCENE_GAME_INSTRUCTIONS);
        }
      }
    );
    
    // 重新开始按钮
    this.restartButton = new Button(
      Constants.SCREEN_WIDTH - buttonWidth - 20,
      20,
      buttonWidth,
      buttonHeight,
      "重来",
      () => {
        this.gameState.restart();
      }
    );
    
    // 下一步按钮
    this.nextButton = new Button(
      Constants.SCREEN_WIDTH / 2 - 100,
      Constants.SCREEN_HEIGHT - 80,
      200,
      60,
      "下一步",
      () => {
        this.tutorialStep++;
        if (this.tutorialStep >= this.tutorialMessages.length) {
          this.completeTutorial();
        }
      }
    );
    
    // 状态面板
    this.infoPanel = new Panel(
      Constants.SCREEN_WIDTH / 2 - 150,
      20,
      300,
      60,
      {
        title: "新手教程",
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderColor: Constants.COLORS.HIGHLIGHT,
        borderWidth: 2
      }
    );
    
    // 怪物标签（教程用）
    this.monsterLabels = [
      { id: 'monster1', name: '恶魔A', x: Constants.SCREEN_WIDTH - 120, y: 200 },
      { id: 'monster2', name: '恶魔B', x: Constants.SCREEN_WIDTH - 120, y: 280 },
      { id: 'monster3', name: '恶魔C', x: Constants.SCREEN_WIDTH - 120, y: 360 }
    ];
  }

  draw(ctx) {
    // 绘制背景
    ctx.fillStyle = Constants.COLORS.BACKGROUND;
    ctx.fillRect(0, 0, Constants.SCREEN_WIDTH, Constants.SCREEN_HEIGHT);
    
    // 绘制游戏网格
    this.drawGrid(ctx);
    
    // 绘制UI
    this.infoPanel.draw(ctx, this.screenAdapter);
    
    // 绘制教程信息
    ctx.fillStyle = Constants.COLORS.TEXT_PRIMARY;
    ctx.font = `${Constants.FONT_SIZES.NORMAL}px ${Constants.FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.fillText(
      this.tutorialMessages[this.tutorialStep] || "教程完成！",
      Constants.SCREEN_WIDTH / 2,
      45
    );
    
    // 绘制生命值
    ctx.fillStyle = Constants.COLORS.DANGER;
    ctx.font = `${Constants.FONT_SIZES.NORMAL}px ${Constants.FONT_FAMILY}`;
    ctx.textAlign = 'left';
    ctx.fillText(`生命: ${this.gameState.lifeCount}`, 20, 100);
    
    // 绘制计时
    const minutes = Math.floor(this.gameState.elapsedTime / 60);
    const seconds = Math.floor(this.gameState.elapsedTime % 60);
    ctx.fillText(`时间: ${minutes}:${seconds.toString().padStart(2, '0')}`, 20, 140);
    
    // 绘制按钮
    this.backButton.draw(ctx);
    this.restartButton.draw(ctx);
    this.nextButton.draw(ctx);
    
    // 绘制怪物标签
    this.drawMonsterLabels(ctx);
    
    // 绘制拖拽中的怪物
    if (this.isDragging && this.draggedMonster) {
      this.drawDraggingMonster(ctx);
    }
  }

  drawGrid(ctx) {
    const cellSize = this.screenAdapter.getAdaptedCellSize();
    const gridWidth = this.gameState.mapSize.width;
    const gridHeight = this.gameState.mapSize.height;
    
    // 计算网格起始位置（居中）
    const startX = (Constants.SCREEN_WIDTH - gridWidth * cellSize) / 2;
    const startY = (Constants.SCREEN_HEIGHT - gridHeight * cellSize) / 2 + 40; // 从信息栏下方开始
    
    // 绘制网格
    ctx.strokeStyle = Constants.COLORS.GRID_LINE;
    ctx.lineWidth = 2;
    
    for (let y = 0; y <= gridHeight; y++) {
      ctx.beginPath();
      ctx.moveTo(startX, startY + y * cellSize);
      ctx.lineTo(startX + gridWidth * cellSize, startY + y * cellSize);
      ctx.stroke();
    }
    
    for (let x = 0; x <= gridWidth; x++) {
      ctx.beginPath();
      ctx.moveTo(startX + x * cellSize, startY);
      ctx.lineTo(startX + x * cellSize, startY + gridHeight * cellSize);
      ctx.stroke();
    }
    
    // 绘制格子内容
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const cell = this.gameState.getCell(x, y);
        const cellX = startX + x * cellSize;
        const cellY = startY + y * cellSize;
        
        // 绘制格子背景
        if (cell.isRevealed) {
          ctx.fillStyle = Constants.COLORS.CELL_REVEALED;
          ctx.fillRect(cellX, cellY, cellSize, cellSize);
        } else if (cell.isMarked) {
          ctx.fillStyle = Constants.COLORS.CELL_MARKED;
          ctx.fillRect(cellX, cellY, cellSize, cellSize);
        } else {
          ctx.fillStyle = Constants.COLORS.CELL_DEFAULT;
          ctx.fillRect(cellX, cellY, cellSize, cellSize);
        }
        
        // 绘制格子内容
        if (cell.isRevealed || cell.isMarked) {
          ctx.fillStyle = cell.getDisplayColor();
          ctx.font = `${cellSize * 0.5}px ${Constants.FONT_FAMILY}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(cell.getDisplayText(), cellX + cellSize / 2, cellY + cellSize / 2);
        }
      }
    }
  }

  drawMonsterLabels(ctx) {
    ctx.fillStyle = Constants.COLORS.TEXT_PRIMARY;
    ctx.font = `${Constants.FONT_SIZES.SMALL}px ${Constants.FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    this.monsterLabels.forEach(label => {
      // 绘制标签背景
      ctx.fillStyle = Constants.COLORS.CELL_DEFAULT;
      ctx.fillRect(label.x - 50, label.y - 20, 100, 40);
      
      // 绘制边框
      ctx.strokeStyle = Constants.COLORS.TEXT_SECONDARY;
      ctx.lineWidth = 2;
      ctx.strokeRect(label.x - 50, label.y - 20, 100, 40);
      
      // 绘制文字
      ctx.fillStyle = Constants.COLORS.TEXT_PRIMARY;
      ctx.fillText(label.name, label.x, label.y);
    });
  }

  drawDraggingMonster(ctx) {
    if (!this.draggedMonster) return;
    
    const pos = this.screenAdapter.screenToGameCoords(this.dragStartPos.x, this.dragStartPos.y);
    
    ctx.fillStyle = Constants.COLORS.CELL_MARKED;
    ctx.fillRect(pos.x - 40, pos.y - 20, 80, 40);
    
    ctx.strokeStyle = Constants.COLORS.HIGHLIGHT;
    ctx.lineWidth = 2;
    ctx.strokeRect(pos.x - 40, pos.y - 20, 80, 40);
    
    ctx.fillStyle = Constants.COLORS.TEXT_PRIMARY;
    ctx.font = `${Constants.FONT_SIZES.SMALL}px ${Constants.FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.draggedMonster.name, pos.x, pos.y);
  }

  handleTouchStart(x, y) {
    // 检查按钮
    this.backButton.update(x, y);
    this.restartButton.update(x, y);
    this.nextButton.update(x, y);
    
    // 检查怪物标签（仅在标注教程步骤）
    if (this.tutorialStep === 2) {
      for (const label of this.monsterLabels) {
        if (Math.abs(x - label.x) < 50 && Math.abs(y - label.y) < 20) {
          this.isDragging = true;
          this.draggedMonster = label;
          this.dragStartPos = { x, y };
          return;
        }
      }
    }
    
    // 处理网格点击
    this.handleGridTouch(x, y, 'start');
  }

  handleTouchMove(x, y) {
    this.backButton.update(x, y);
    this.restartButton.update(x, y);
    this.nextButton.update(x, y);
    
    if (this.isDragging && this.draggedMonster) {
      this.dragStartPos = { x, y };
    }
    
    this.handleGridTouch(x, y, 'move');
  }

  handleTouchEnd(x, y) {
    this.backButton.update(x, y);
    this.restartButton.update(x, y);
    this.nextButton.update(x, y);
    
    // 处理按钮点击
    if (this.backButton.isHovered && this.backButton.isPressed) {
      this.backButton.release();
    }
    
    if (this.restartButton.isHovered && this.restartButton.isPressed) {
      this.restartButton.release();
    }
    
    if (this.nextButton.isHovered && this.nextButton.isPressed) {
      this.nextButton.release();
    }
    
    // 处理拖拽结束
    if (this.isDragging && this.draggedMonster) {
      const pos = this.screenAdapter.screenToGameCoords(x, y);
      
      // 计算网格位置
      const cellSize = this.screenAdapter.getAdaptedCellSize();
      const gridWidth = this.gameState.mapSize.width;
      const gridHeight = this.gameState.mapSize.height;
      const startX = (Constants.SCREEN_WIDTH - gridWidth * cellSize) / 2;
      const startY = (Constants.SCREEN_HEIGHT - gridHeight * cellSize) / 2 + 40;
      
      const gridX = Math.floor((pos.x - startX) / cellSize);
      const gridY = Math.floor((pos.y - startY) / cellSize);
      
      // 检查是否在有效网格内
      if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        this.gameState.markCell(gridX, gridY, this.draggedMonster.id);
      }
      
      this.isDragging = false;
      this.draggedMonster = null;
    }
    
    this.handleGridTouch(x, y, 'end');
  }

  handleGridTouch(x, y, type) {
    if (this.gameState.gameState !== 'playing') return;
    
    const cellSize = this.screenAdapter.getAdaptedCellSize();
    const gridWidth = this.gameState.mapSize.width;
    const gridHeight = this.gameState.mapSize.height;
    const startX = (Constants.SCREEN_WIDTH - gridWidth * cellSize) / 2;
    const startY = (Constants.SCREEN_HEIGHT - gridHeight * cellSize) / 2 + 40;
    
    // 转换为网格坐标
    const gridX = Math.floor((x - startX) / cellSize);
    const gridY = Math.floor((y - startY) / cellSize);
    
    // 检查是否在有效范围内
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
      if (type === 'start') {
        // 在教程第一步，只允许点击特定格子
        if (this.tutorialStep === 0) {
          this.gameState.handleCellClick(gridX, gridY);
        } else if (this.tutorialStep === 1) {
          // 第二步展示数字
          this.gameState.handleCellClick(gridX, gridY);
        }
      }
    }
  }

  completeTutorial() {
    // 标记教程完成（实际项目中应保存到本地存储）
    wx.setStorageSync('tutorialCompleted', true);
    
    // 跳转到模式选择界面
    if (this.sceneManager) {
      this.sceneManager.changeScene(Constants.SCENE_MODE_SELECTION);
    }
  }

  update(deltaTime) {
    if (this.gameState) {
      this.gameState.update();
      
      // 检查游戏结束状态
      if (this.gameState.gameState === 'won' && this.tutorialStep >= 3) {
        this.completeTutorial();
      } else if (this.gameState.gameState === 'lost' && this.tutorialStep >= 3) {
        // 失败时自动重来
        this.gameState.restart();
      }
    }
  }

  resize() {
    // 调整UI元素位置
  }

  destroy() {
    // 清理资源
  }
}