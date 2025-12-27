// src/scenes/GameInstructions.js
import Constants from '../utils/Constants.js';
import Button from '../ui/Button.js';

export default class GameInstructions {
  constructor() {
    this.title = "怪物扫雷";
    this.subtitle = "游戏说明";
    this.instructions = [
      "欢迎来到怪物扫雷！",
      "",
      "游戏规则：",
      "1. 每个格子下可能是安全区域或怪物",
      "2. 点击格子探明区域，数字表示周围怪物数值总和",
      "3. 将右侧怪物标签拖拽到对应位置进行标注",
      "4. 标注正确可避免点击损失生命值",
      "5. 生命值耗尽则游戏失败",
      "6. 找出所有怪物即可获胜"
    ];
  }

  init() {
    // 创建按钮
    const buttonWidth = 300;
    const buttonHeight = 60;
    const centerX = Constants.SCREEN_WIDTH / 2;
    
    this.startButton = new Button(
      centerX - buttonWidth / 2,
      Constants.SCREEN_HEIGHT - 150,
      buttonWidth,
      buttonHeight,
      "开始游戏",
      () => {
        if (this.sceneManager) {
          // 检查是否已完成教程
          const tutorialCompleted = wx.getStorageSync('tutorialCompleted') || false;
          
          if (tutorialCompleted) {
            this.sceneManager.changeScene(Constants.SCENE_MODE_SELECTION);
          } else {
            this.sceneManager.changeScene(Constants.SCENE_TUTORIAL);
          }
          
          wx.vibrateShort({ type: 'light' });
        }
      }
    );
  }

  draw(ctx) {
    // 背景
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, Constants.SCREEN_WIDTH, Constants.SCREEN_HEIGHT);
    
    // 标题
    ctx.fillStyle = '#ffd700';
    ctx.font = `bold 48px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(this.title, Constants.SCREEN_WIDTH / 2, 80);
    
    // 副标题
    ctx.fillStyle = '#50e3c2';
    ctx.font = `32px Arial`;
    ctx.fillText(this.subtitle, Constants.SCREEN_WIDTH / 2, 140);
    
    // 说明文字
    ctx.fillStyle = '#ffffff';
    ctx.font = `24px Arial`;
    ctx.textAlign = 'left';
    
    const textX = 150;
    const textY = 220;
    const lineHeight = 40;
    
    this.instructions.forEach((line, index) => {
      ctx.fillText(line, textX, textY + index * lineHeight);
    });
    
    // 按钮
    this.startButton.draw(ctx);
  }

  handleTouchStart(x, y) {
    this.startButton.update(x, y);
    if (this.startButton.isHovered) {
      this.startButton.press();
      wx.vibrateShort({ type: 'light' });
    }
  }

  handleTouchMove(x, y) {
    this.startButton.update(x, y);
  }

  handleTouchEnd(x, y) {
    this.startButton.update(x, y);
    this.startButton.release();
  }

  update(deltaTime) {
    // 更新逻辑
  }

  resize() {
    // 调整大小
  }

  destroy() {
    // 清理
  }
}