// src/core/SceneManager.js
export default class SceneManager {
  constructor(canvas, screenAdapter) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.screenAdapter = screenAdapter;
    this.scenes = {};
    this.currentScene = null;
    this.transitioning = false;
  }

  registerScene(name, scene) {
    this.scenes[name] = scene;
    scene.sceneManager = this;
  }

  changeScene(name) {
    if (this.transitioning || !this.scenes[name]) return;
    
    const oldScene = this.currentScene;
    this.currentScene = this.scenes[name];
    
    if (oldScene) {
      oldScene.destroy();
    }
    
    this.currentScene.init();
    this.currentScene.resize(
      Constants.SCREEN_WIDTH, 
      Constants.SCREEN_HEIGHT
    );
  }

  update(deltaTime) {
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
  }

  draw() {
    if (!this.currentScene) return;
    
    // 清除画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制当前场景
    this.currentScene.draw(this.ctx);
  }
}