// src/ui/Button.js
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
  }

  containsPoint(x, y) {
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height;
  }

  draw(ctx) {
    // 按钮背景
    const bgColor = this.isPressed ? '#4a90e2' : (this.isHovered ? '#50e3c2' : '#333');
    ctx.fillStyle = bgColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // 按钮边框
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // 按钮文字
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
  }

  update(x, y) {
    const wasHovered = this.isHovered;
    this.isHovered = this.containsPoint(x, y);
    
    if (wasHovered !== this.isHovered) {
      // 悬停状态变化
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
}