// src/core/InputManager.js
export default class InputManager {
  constructor(canvas, sceneManager, screenAdapter) {
    this.canvas = canvas;
    this.sceneManager = sceneManager;
    this.screenAdapter = screenAdapter;
    this.isTouching = false;
    this.lastTouch = null;
    
    this.init();
  }

  init() {
    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      
      // 检查点是否在游戏区域内
      if (!this.screenAdapter.isPointInGameArea(touch.clientX, touch.clientY)) {
        return;
      }
      
      // 转换为游戏坐标
      const gamePos = this.screenAdapter.screenToGameCoords(touch.clientX, touch.clientY);
      
      this.isTouching = true;
      this.lastTouch = { x: touch.clientX, y: touch.clientY };
      
      if (this.sceneManager.currentScene && this.sceneManager.currentScene.handleTouchStart) {
        this.sceneManager.currentScene.handleTouchStart(gamePos.x, gamePos.y);
      }
    };
    
    const handleTouchMove = (e) => {
      e.preventDefault();
      if (!this.isTouching) return;
      
      const touch = e.touches[0];
      const gamePos = this.screenAdapter.screenToGameCoords(touch.clientX, touch.clientY);
      
      if (this.sceneManager.currentScene && this.sceneManager.currentScene.handleTouchMove) {
        this.sceneManager.currentScene.handleTouchMove(gamePos.x, gamePos.y);
      }
      
      this.lastTouch = { x: touch.clientX, y: touch.clientY };
    };
    
    const handleTouchEnd = (e) => {
      e.preventDefault();
      if (!this.isTouching) return;
      
      const touch = e.changedTouches[0];
      const gamePos = this.screenAdapter.screenToGameCoords(touch.clientX, touch.clientY);
      
      if (this.sceneManager.currentScene && this.sceneManager.currentScene.handleTouchEnd) {
        this.sceneManager.currentScene.handleTouchEnd(gamePos.x, gamePos.y);
      }
      
      this.isTouching = false;
      this.lastTouch = null;
    };
    
    this.canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    this.canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });
  }
}