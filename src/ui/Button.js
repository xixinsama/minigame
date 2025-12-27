import Constants from '../utils/Constants.js';

export default class Button {
  constructor(x, y, width, height, text, callback) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.callback = callback;
    this.isHovered = false;
    this.isPressed = false;
    this.fontSize = Constants.FONT_SIZES.NORMAL;
  }

  containsPoint(x, y) {
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height;
  }

  draw(ctx) {
    // 按钮背景
    ctx.fillStyle = this.isPressed ? Constants.COLORS.SECONDARY : 
                   (this.isHovered ? Constants.COLORS.PRIMARY : '#333333');
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // 按钮边框
    ctx.strokeStyle = Constants.COLORS.TEXT;
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // 按钮文字
    ctx.fillStyle = Constants.COLORS.TEXT;
    ctx.font = `${this.fontSize}px ${Constants.FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
  }

  update(x, y) {
    const wasHovered = this.isHovered;
    this.isHovered = this.containsPoint(x, y);
    
    // 检测点击状态变化
    if (this.isHovered && !wasHovered) {
      this.onHoverEnter();
    } else if (!this.isHovered && wasHovered) {
      this.onHoverExit();
      this.isPressed = false;
    }
  }

  press() {
    if (this.isHovered) {
      this.isPressed = true;
    }
  }

  release() {
    if (this.isPressed && this.isHovered && this.callback) {
      this.callback();
    }
    this.isPressed = false;
  }

  onHoverEnter() {
    // 可以添加悬停音效等
  }

  onHoverExit() {
    // 可以添加离开音效等
  }

  resize(screenWidth, screenHeight) {
    // 按钮位置和大小可以根据屏幕尺寸调整
    this.x = Math.min(this.x, screenWidth - this.width);
    this.y = Math.min(this.y, screenHeight - this.height);
  }
}