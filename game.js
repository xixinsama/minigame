// game.js
import SceneManager from './src/core/SceneManager.js';
import InputManager from './src/core/InputManager.js';
import Constants from './src/utils/Costants.js';
import GameInstructions from './src/scenes/GameInstructions.js';
import ScreenAdapter from './src/utils/ScreenAdapter.js';

// 全局游戏对象
window.Game = {
  sceneManager: null,
  inputManager: null,
  screenAdapter: null,
  canvas: null,
  
  init() {
    // 创建画布
    this.canvas = wx.createCanvas();
    this.canvas.width = Constants.SCREEN_WIDTH;
    this.canvas.height = Constants.SCREEN_HEIGHT;
    
    // 初始化屏幕适配
    this.screenAdapter = new ScreenAdapter(this.canvas);
    
    // 初始化场景管理器
    this.sceneManager = new SceneManager(this.canvas, this.screenAdapter);
    
    // 初始化输入管理器
    this.inputManager = new InputManager(this.canvas, this.sceneManager);
    
    // 注册场景
    this.sceneManager.registerScene(Constants.SCENE_GAME_INSTRUCTIONS, new GameInstructions());
    
    // 切换到初始场景
    this.sceneManager.changeScene(Constants.SCENE_GAME_INSTRUCTIONS);
    
    // 开始游戏主循环
    this.gameLoop();
  },
  
  gameLoop() {
    const now = performance.now();
    const deltaTime = (now - (this.lastTime || now)) / 1000;
    this.lastTime = now;
    
    // 更新游戏状态
    if (this.sceneManager.currentScene) {
      this.sceneManager.currentScene.update(deltaTime);
    }
    
    // 绘制游戏
    if (this.sceneManager.currentScene) {
      this.sceneManager.currentScene.draw();
    }
    
    // 继续下一帧
    requestAnimationFrame(this.gameLoop.bind(this));
  },
  
  // 加载资源
  loadResources(callback) {
    const resources = {
      sprites: {
        monsters: wx.createImage(),
      },
      audio: {
        button: wx.createInnerAudioContext(),
        victory: wx.createInnerAudioContext(),
        defeat: wx.createInnerAudioContext()
      }
    };
    
    // 加载怪物精灵图
    resources.sprites.monsters.src = 'assets/images/Basic Demons 4x.png';
    
    // 加载音效
    resources.audio.button.src = 'assets/audio/button-press-382713.mp3';
    resources.audio.victory.src = 'assets/audio/orchestral-win-331233.mp3';
    resources.audio.defeat.src = 'assets/audio/fail-trumpet-02-383962.mp3';
    
    let loadedCount = 0;
    const totalCount = 4; // 1 sprite + 3 audio files
    
    // 图片加载完成
    resources.sprites.monsters.onload = () => {
      loadedCount++;
      if (loadedCount >= totalCount && callback) {
        callback(resources);
      }
    };
    
    // 音效加载完成
    const audioFiles = [resources.audio.button, resources.audio.victory, resources.audio.defeat];
    audioFiles.forEach(audio => {
      audio.onCanplay(() => {
        loadedCount++;
        if (loadedCount >= totalCount && callback) {
          callback(resources);
        }
      });
    });
    
    // 处理加载错误
    const handleError = (e) => {
      console.error('资源加载失败:', e);
      loadedCount++;
    };
    
    resources.sprites.monsters.onerror = handleError;
    audioFiles.forEach(audio => {
      audio.onError = handleError;
    });
  }
};

// 游戏启动
wx.onShow(() => {
  wx.setPreferredFramesPerSecond(60);
  Game.loadResources((resources) => {
    window.resources = resources;
    Game.init();
  });
});