// src/utils/ScreenAdapter.js
import Constants from './Constants.js';

export default class ScreenAdapter {
  constructor() {
    this.init();
  }

  init() {
    // 获取窗口信息 - 使用现代API
    try {
      if (wx.getWindowInfo) {
        const windowInfo = wx.getWindowInfo();
        this.windowWidth = windowInfo.windowWidth;
        this.windowHeight = windowInfo.windowHeight;
        this.pixelRatio = windowInfo.pixelRatio;
      } else {
        // 旧版本回退
        const systemInfo = wx.getSystemInfoSync();
        this.windowWidth = systemInfo.windowWidth;
        this.windowHeight = systemInfo.windowHeight;
        this.pixelRatio = windowInfo.pixelRatio;
      }
    } catch (error) {
      console.error('获取窗口信息失败:', error);
      // 安全回退值
      this.windowWidth = 750;
      this.windowHeight = 1334;
    }

    // 确保横屏 - 如果设备是竖屏且宽度小于高度，交换尺寸
    if (this.windowWidth < this.windowHeight) {
      [this.windowWidth, this.windowHeight] = [this.windowHeight, this.windowWidth];
      console.log('设备为竖屏，已交换尺寸以适配横屏');
    }

    // 计算缩放比例 - 不保持比例，而是分别计算X和Y的缩放
    this.scaleX = this.windowWidth / Constants.SCREEN_WIDTH;
    this.scaleY = this.windowHeight / Constants.SCREEN_HEIGHT;
    
    // 确保内容完整可见 - 取较大的缩放比例，确保不裁剪任何内容
    this.scale = Math.max(this.scaleX, this.scaleY);
    
    // 计算实际渲染区域
    this.renderWidth = Constants.SCREEN_WIDTH * this.scale;
    this.renderHeight = Constants.SCREEN_HEIGHT * this.scale;
    
    // 计算偏移量，使内容居中
    this.offsetX = Math.max(0, (this.windowWidth - this.renderWidth) / 2);
    this.offsetY = Math.max(0, (this.windowHeight - this.renderHeight) / 2);
    
    // 计算适配后的格子大小
    this.cellSize = Constants.BASE_CELL_SIZE * this.scale;
    
    console.log(`ScreenAdapter 初始化完成 (优化版):`);
    console.log(`- 设备尺寸: ${this.windowWidth}x${this.windowHeight}`);
    console.log(`- 设备像素缩放: ${this.pixelRatio}`);
    console.log(`- 设计尺寸: ${Constants.SCREEN_WIDTH}x${Constants.SCREEN_HEIGHT}`);
    console.log(`- X缩放: ${this.scaleX.toFixed(3)}, Y缩放: ${this.scaleY.toFixed(3)}`);
    console.log(`- 最终缩放: ${this.scale.toFixed(3)}`);
    console.log(`- 渲染区域: ${this.renderWidth.toFixed(1)}x${this.renderHeight.toFixed(1)}`);
    console.log(`- 格子大小: ${this.cellSize.toFixed(1)}px`);
    console.log(`- 偏移量: X=${this.offsetX.toFixed(1)}, Y=${this.offsetY.toFixed(1)}`);
  }

  /**
   * 转换屏幕坐标到游戏坐标
   */
  screenToGameCoords(screenX, screenY) {
    // 转换为游戏坐标（考虑偏移和缩放）
    const gameX = (screenX - this.offsetX) / this.scale;
    const gameY = (screenY - this.offsetY) / this.scale;
    
    return { x: gameX, y: gameY };
  }

  /**
   * 获取适配后的格子大小
   */
  getAdaptedCellSize() {
    return this.cellSize;
  }

  /**
   * 应用变换到Canvas上下文
   */
  applyTransform(ctx) {
    // 保存当前状态
    ctx.save();
    
    // 应用偏移和缩放，使内容居中
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);
    
    return () => {
      // 恢复状态
      ctx.restore();
    };
  }

  /**
   * 检查点是否在游戏区域内
   */
  isPointInGameArea(x, y) {
    const gameX = (x - this.offsetX) / this.scale;
    const gameY = (y - this.offsetY) / this.scale;
    
    return gameX >= 0 && gameX <= Constants.SCREEN_WIDTH &&
           gameY >= 0 && gameY <= Constants.SCREEN_HEIGHT;
  }

  /**
   * 重新计算适配
   */
  recalculate() {
    this.init();
  }
}