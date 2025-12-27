// src/ui/Text.js
import Constants from '../utils/Costants.js';

export default class Text {
  constructor(x, y, text, config = {}) {
    this.x = x;
    this.y = y;
    this.text = text || '';
    
    // 文本配置
    this.config = {
      color: config.color || Constants.COLORS.TEXT_PRIMARY,
      fontSize: config.fontSize || Constants.FONT_SIZES.NORMAL,
      fontFamily: config.fontFamily || Constants.FONT_FAMILY,
      align: config.align || 'left',       // left, center, right
      baseline: config.baseline || 'top',  // top, middle, bottom
      shadow: config.shadow || false,
      shadowColor: config.shadowColor || 'rgba(0,0,0,0.5)',
      shadowBlur: config.shadowBlur || 4,
      shadowOffsetX: config.shadowOffsetX || 2,
      shadowOffsetY: config.shadowOffsetY || 2,
      maxWidth: config.maxWidth || null,
      isStatic: config.isStatic || false // 静态文本不需要频繁重绘
    };
    
    this.visible = true;
  }
  
  draw(ctx) {
    if (!this.visible) return;
    
    ctx.save();
    
    // 设置阴影
    if (this.config.shadow) {
      ctx.shadowColor = this.config.shadowColor;
      ctx.shadowBlur = this.config.shadowBlur;
      ctx.shadowOffsetX = this.config.shadowOffsetX;
      ctx.shadowOffsetY = this.config.shadowOffsetY;
    }
    
    // 设置文字样式
    ctx.fillStyle = this.config.color;
    ctx.font = `${this.config.fontSize}px ${this.config.fontFamily}`;
    ctx.textAlign = this.config.align;
    ctx.textBaseline = this.config.baseline;
    
    // 绘制文本
    if (this.config.maxWidth) {
      ctx.fillText(this.text, this.x, this.y, this.config.maxWidth);
    } else {
      ctx.fillText(this.text, this.x, this.y);
    }
    
    ctx.restore();
  }
  
  setText(text) {
    this.text = text || '';
  }
  
  update(deltaTime) {
    // 文本动画等
  }
  
  resize(screenWidth, screenHeight) {
    // 根据屏幕尺寸调整位置
  }
  
  setVisible(visible) {
    this.visible = visible;
  }
}