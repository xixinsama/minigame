// src/core/SceneManager.js
export default class SceneManager {
  constructor(canvas, ctx, screenAdapter) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.screenAdapter = screenAdapter;
    this.scenes = {};
    this.currentScene = null;
  }

  registerScene(name, scene) {
    this.scenes[name] = scene;
    scene.sceneManager = this;
    scene.screenAdapter = this.screenAdapter;
  }

  changeScene(name) {
    if (!this.scenes[name]) {
      console.error(`场景 ${name} 未注册`);
      return;
    }
    
    const oldScene = this.currentScene;
    this.currentScene = this.scenes[name];
    
    if (oldScene && oldScene.destroy) {
      oldScene.destroy();
    }
    
    if (this.currentScene.init) {
      this.currentScene.init();
    }
    
    if (this.currentScene.resize) {
      this.currentScene.resize();
    }
  }

  update(deltaTime) {
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(deltaTime);
    }
  }

  draw(ctx) {
    if (this.currentScene && this.currentScene.draw) {
      this.currentScene.draw(ctx);
    }
  }
}