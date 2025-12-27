// src/ui/Panel.js
import Constants from '../utils/Constants.js';

export default class Panel {
  constructor(x, y, width, height, config = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    // 面板配置
    this.config = {
      backgroundColor: config.backgroundColor || Constants.COLORS.BACKGROUND,
      borderColor: config.borderColor || Constants.COLORS.TEXT_PRIMARY,
      borderWidth: config.borderWidth || 2,
      cornerRadius: config.cornerRadius || 8,
      opacity: config.opacity || 0.8,
      hasShadow: config.hasShadow || false,
      title: config.title || '',
      titleColor: config.titleColor || Constants.COLORS.TEXT_PRIMARY,
      titleFontSize: config.titleFontSize || Constants.FONT_SIZES.SUBTITLE
    };
  }
  
  draw(ctx, screenAdapter) {
    ctx.save();
    
    // 绘制面板背景
    ctx.globalAlpha = this.config.opacity;
    ctx.fillStyle = this.config.backgroundColor;
    
    if (this.config.cornerRadius > 0) {
      // 圆角矩形
      this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, this.config.cornerRadius);
      ctx.fill();
    } else {
      // 直角矩形
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    // 绘制边框
    ctx.globalAlpha = 1;
    ctx.strokeStyle = this.config.borderColor;
    ctx.lineWidth = this.config.borderWidth;
    
    if (this.config.cornerRadius > 0) {
      this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, this.config.cornerRadius);
    } else {
      ctx.rect(this.x, this.y, this.width, this.height);
    }
    ctx.stroke();
    
    // 绘制标题
    if (this.config.title) {
      ctx.fillStyle = this.config.titleColor;
      ctx.font = `bold ${this.config.titleFontSize}px ${Constants.FONT_FAMILY}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(this.config.title, this.x + this.width / 2, this.y + 10);
    }
    
    ctx.restore();
  }
  
  // 绘制圆角矩形路径
  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }
  
  containsPoint(x, y) {
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height;
  }
  
  resize(screenWidth, screenHeight) {
    // 面板可以根据屏幕尺寸调整
  }
}