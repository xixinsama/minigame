// src/core/InputManager.js
export default class InputManager {
  constructor(canvas, sceneManager) {
    this.canvas = canvas;
    this.sceneManager = sceneManager;
    this.isTouching = false;
    this.lastTouch = null;
    
    this.init();
  }

  init() {
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    this.canvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this));
  }

  handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const gamePos = this.sceneManager.screenAdapter.screenToGameCoords(touch.clientX, touch.clientY);
    
    this.isTouching = true;
    this.lastTouch = gamePos;
    
    if (this.sceneManager.currentScene) {
      this.sceneManager.currentScene.handleTouchStart(gamePos.x, gamePos.y);
    }
  }

  handleTouchMove(e) {
    e.preventDefault();
    if (!this.isTouching) return;
    
    const touch = e.touches[0];
    const gamePos = this.sceneManager.screenAdapter.screenToGameCoords(touch.clientX, touch.clientY);
    
    if (this.sceneManager.currentScene) {
      this.sceneManager.currentScene.handleTouchMove(gamePos.x, gamePos.y);
    }
    
    this.lastTouch = gamePos;
  }

  handleTouchEnd(e) {
    e.preventDefault();
    if (!this.isTouching) return;
    
    const touch = e.changedTouches[0];
    const gamePos = this.sceneManager.screenAdapter.screenToGameCoords(touch.clientX, touch.clientY);
    
    if (this.sceneManager.currentScene) {
      this.sceneManager.currentScene.handleTouchEnd(gamePos.x, gamePos.y);
    }
    
    this.isTouching = false;
    this.lastTouch = null;
  }
}