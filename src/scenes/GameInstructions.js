import Constants from '../utils/Constants.js';
import Button from '../ui/Button.js';

/**
 * 游戏说明场景
 */
export default class GameInstructions {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.buttons = [];
    this.title = "游戏说明";
    this.instructions = [
      "欢迎来到怪物扫雷！",
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
    const startY = Constants.SCREEN_HEIGHT - 150;
    
    this.buttons = [
      new Button(
        centerX - buttonWidth / 2,
        startY,
        buttonWidth,
        buttonHeight,
        "开始游戏",
        () => this.onNext()
      )
    ];
  }

  update(deltaTime) {
    // 更新逻辑
  }

  draw(ctx) {
    // 绘制背景
    ctx.fillStyle = Constants.COLORS.BACKGROUND;
    ctx.fillRect(0, 0, Constants.SCREEN_WIDTH, Constants.SCREEN_HEIGHT);
    
    // 绘制标题
    ctx.fillStyle = Constants.COLORS.HIGHLIGHT;
    ctx.font = `bold ${Constants.FONT_SIZES.TITLE}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(this.title, Constants.SCREEN_WIDTH / 2, 80);
    
    // 绘制说明文字
    ctx.fillStyle = Constants.COLORS.TEXT_PRIMARY;
    ctx.font = `${Constants.FONT_SIZES.NORMAL}px Arial`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    const textX = 300;
    const textY = 200;
    const lineHeight = 50;
    
    this.instructions.forEach((line, index) => {
      ctx.fillText(line, textX, textY + index * lineHeight);
    });
    
    // 绘制示例网格
    this.drawExampleGrid(ctx, Constants.SCREEN_WIDTH - 600, textY);
    
    // 绘制按钮
    this.buttons.forEach(button => button.draw(ctx));
  }

  drawExampleGrid(ctx, x, y) {
    const gridWidth = 5;
    const gridHeight = 5;
    const cellSize = 60;
    
    // 绘制标题
    ctx.fillStyle = Constants.COLORS.TEXT_PRIMARY;
    ctx.font = `bold ${Constants.FONT_SIZES.SUBTITLE}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText("游戏示例", x + (gridWidth * cellSize) / 2, y - 40);
    
    // 绘制网格
    ctx.strokeStyle = Constants.COLORS.GRID_LINE;
    ctx.lineWidth = 2;
    
    for (let i = 0; i <= gridWidth; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * cellSize, y);
      ctx.lineTo(x + i * cellSize, y + gridHeight * cellSize);
      ctx.stroke();
    }
    
    for (let j = 0; j <= gridHeight; j++) {
      ctx.beginPath();
      ctx.moveTo(x, y + j * cellSize);
      ctx.lineTo(x + gridWidth * cellSize, y + j * cellSize);
      ctx.stroke();
    }
    
    // 绘制示例内容
    ctx.font = `bold ${cellSize * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 示例数字
    ctx.fillStyle = Constants.COLORS.TEXT_PRIMARY;
    ctx.fillText('2', x + cellSize * 1.5, y + cellSize * 1.5);
    ctx.fillText('3', x + cellSize * 2.5, y + cellSize * 2.5);
    
    // 示例怪物
    ctx.fillStyle = Constants.COLORS.DANGER;
    ctx.fillText('_ghost', x + cellSize * 3.5, y + cellSize * 1.5);
    ctx.fillText('skull', x + cellSize * 1.5, y + cellSize * 3.5);
    
    // 示例标记
    ctx.fillStyle = Constants.COLORS.CELL_MARKED;
    ctx.fillText('ghost', x + cellSize * 3.5, y + cellSize * 3.5);
  }

  handleTouchStart(x, y) {
    this.buttons.forEach(button => {
      button.update(x, y);
      if (button.isHovered) {
        button.press();
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

  onNext() {
    // 播放按钮音效
    wx.vibrateShort();
    
    // 跳转到新手教程
    this.sceneManager.changeScene(Constants.SCENE_TUTORIAL);
  }

  resize(width, height) {
    this.buttons.forEach(button => button.resize(width, height));
  }

  destroy() {
    // 清理资源
  }
}