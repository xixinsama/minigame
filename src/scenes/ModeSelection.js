// src/scenes/ModeSelection.js
import Constants from '../utils/Constants.js';
import Button from '../ui/Button.js';
import Panel from '../ui/Panel.js';
import Text from '../ui/Text.js';
import GameMain from './GameMain.js';

export default class ModeSelection {
  constructor() {
    this.selectedMapSize = 'small';
    this.selectedLifeCount = 3;
    this.selectedMonsterMode = 1;
    this.selectedDifficulty = 'normal';
    this.buttons = [];
    this.optionPanels = [];
  }

  init() {
    this.createUI();
  }

  createUI() {
    const centerX = Constants.SCREEN_WIDTH / 2;
    const startY = 150;
    const spacing = 80;
    const buttonWidth = 250;
    const buttonHeight = 60;
    
    // 标题
    this.titleText = new Text(
      centerX,
      80,
      "选择游戏模式",
      {
        color: Constants.COLORS.HIGHLIGHT,
        fontSize: Constants.FONT_SIZES.TITLE,
        align: 'center',
        fontWeight: 'bold'
      }
    );
    
    // 地图大小选项
    this.mapSizePanel = new Panel(
      centerX - 300,
      startY,
      250,
      300,
      {
        title: "地图大小",
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderColor: Constants.COLORS.PRIMARY
      }
    );
    
    this.mapSizeButtons = [
      new Button(
        centerX - 300 + 25,
        startY + 60,
        200,
        50,
        "小 (8×6)",
        () => { this.selectedMapSize = 'small'; }
      ),
      new Button(
        centerX - 300 + 25,
        startY + 120,
        200,
        50,
        "中 (12×9)",
        () => { this.selectedMapSize = 'medium'; }
      ),
      new Button(
        centerX - 300 + 25,
        startY + 180,
        200,
        50,
        "大 (16×12)",
        () => { this.selectedMapSize = 'large'; }
      )
    ];
    this.mapSizeButtons[0].isPressed = true; // 默认选中小地图
    
    // 生命值选项
    this.lifePanel = new Panel(
      centerX,
      startY,
      250,
      300,
      {
        title: "生命值",
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderColor: Constants.COLORS.SECONDARY
      }
    );
    
    this.lifeButtons = [
      new Button(
        centerX + 25,
        startY + 60,
        200,
        50,
        "1条生命",
        () => { this.selectedLifeCount = 1; }
      ),
      new Button(
        centerX + 25,
        startY + 120,
        200,
        50,
        "2条生命",
        () => { this.selectedLifeCount = 2; }
      ),
      new Button(
        centerX + 25,
        startY + 180,
        200,
        50,
        "3条生命",
        () => { this.selectedLifeCount = 3; }
      )
    ];
    this.lifeButtons[2].isPressed = true; // 默认选中3条生命
    
    // 怪物模式选项
    this.monsterModePanel = new Panel(
      centerX + 300,
      startY,
      250,
      300,
      {
        title: "怪物模式",
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderColor: Constants.COLORS.DANGER
      }
    );
    
    this.monsterModeButtons = [
      new Button(
        centerX + 325,
        startY + 60,
        200,
        50,
        "3种怪",
        () => { this.selectedMonsterMode = 1; }
      ),
      new Button(
        centerX + 325,
        startY + 120,
        200,
        50,
        "5种怪",
        () => { this.selectedMonsterMode = 2; }
      ),
      new Button(
        centerX + 325,
        startY + 180,
        200,
        50,
        "7种怪",
        () => { this.selectedMonsterMode = 3; }
      )
    ];
    this.monsterModeButtons[0].isPressed = true; // 默认选中3种怪
    
    // 难度选项
    this.difficultyPanel = new Panel(
      centerX - 150,
      startY + 350,
      300,
      150,
      {
        title: "难度",
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        borderColor: Constants.COLORS.SUCCESS
      }
    );
    
    this.difficultyButtons = [
      new Button(
        centerX - 125,
        startY + 410,
        120,
        50,
        "简单",
        () => { this.selectedDifficulty = 'easy'; }
      ),
      new Button(
        centerX + 5,
        startY + 410,
        120,
        50,
        "普通",
        () => { this.selectedDifficulty = 'normal'; }
      ),
      new Button(
        centerX + 135,
        startY + 410,
        120,
        50,
        "困难",
        () => { this.selectedDifficulty = 'hard'; }
      )
    ];
    this.difficultyButtons[1].isPressed = true; // 默认选中普通难度
    
    // 开始游戏按钮
    this.startButton = new Button(
      centerX - 150,
      Constants.SCREEN_HEIGHT - 100,
      300,
      80,
      "开始游戏",
      () => {
        this.startGame();
      }
    );
    
    // 返回按钮
    this.backButton = new Button(
      20,
      20,
      150,
      50,
      "返回",
      () => {
        if (this.sceneManager) {
          this.sceneManager.changeScene(Constants.SCENE_GAME_INSTRUCTIONS);
        }
      }
    );
    
    // 整理所有按钮
    this.buttons = [
      ...this.mapSizeButtons,
      ...this.lifeButtons,
      ...this.monsterModeButtons,
      ...this.difficultyButtons,
      this.startButton,
      this.backButton
    ];
  }

  draw(ctx) {
    // 绘制背景
    ctx.fillStyle = Constants.COLORS.BACKGROUND;
    ctx.fillRect(0, 0, Constants.SCREEN_WIDTH, Constants.SCREEN_HEIGHT);
    
    // 绘制标题
    this.titleText.draw(ctx);
    
    // 绘制面板
    this.mapSizePanel.draw(ctx, this.screenAdapter);
    this.lifePanel.draw(ctx, this.screenAdapter);
    this.monsterModePanel.draw(ctx, this.screenAdapter);
    this.difficultyPanel.draw(ctx, this.screenAdapter);
    
    // 绘制按钮
    this.buttons.forEach(button => button.draw(ctx));
    
    // 绘制当前选择信息
    this.drawSelectionInfo(ctx);
  }

  drawSelectionInfo(ctx) {
    ctx.fillStyle = Constants.COLORS.TEXT_SECONDARY;
    ctx.font = `${Constants.FONT_SIZES.SMALL}px ${Constants.FONT_FAMILY}`;
    ctx.textAlign = 'center';
    
    const centerX = Constants.SCREEN_WIDTH / 2;
    const y = Constants.SCREEN_HEIGHT - 180;
    
    ctx.fillText(
      `当前选择: ${Constants.MAP_SIZES[this.selectedMapSize].width}×${Constants.MAP_SIZES[this.selectedMapSize].height}格, ` +
      `${this.selectedLifeCount}条生命, ${Constants.MONSTER_MODES[this.selectedMonsterMode]}, ` +
      `${Constants.DIFFICULTY[this.selectedDifficulty]}难度`,
      centerX,
      y
    );
  }

  handleTouchStart(x, y) {
    this.buttons.forEach(button => {
      button.update(x, y);
      if (button.isHovered) {
        button.press();
        wx.vibrateShort({ type: 'light' });
      }
    });
  }

  handleTouchMove(x, y) {
    this.buttons.forEach(button => button.update(x, y));
  }

  handleTouchEnd(x, y) {
    this.buttons.forEach(button => {
      button.update(x, y);
      button.release();
    });
  }

  startGame() {
    // 保存选择到游戏状态
    const gameConfig = {
      mapSize: Constants.MAP_SIZES[this.selectedMapSize],
      lifeCount: this.selectedLifeCount,
      monsterMode: this.selectedMonsterMode,
      difficulty: this.selectedDifficulty
    };
    
    // 跳转到游戏主界面
    if (this.sceneManager) {
      const gameMain = new GameMain();
      this.sceneManager.registerScene(Constants.SCENE_GAME_MAIN, gameMain);
      // 传递配置，场景会在changeScene时调用init
      gameMain.config = gameConfig;
      this.sceneManager.changeScene(Constants.SCENE_GAME_MAIN);
    }
  }

  update(deltaTime) {
    // 更新逻辑
  }

  resize() {
    // 调整UI
  }

  destroy() {
    // 清理
  }
}