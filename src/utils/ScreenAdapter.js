// src/utils/Constants.js (原 Costants.js)
export default class Constants {
  // 屏幕尺寸
  static SCREEN_WIDTH = 1920;
  static SCREEN_HEIGHT = 1080;
  
  // 格子大小
  static BASE_CELL_SIZE = 64; // 按照设计文档调整为64像素
  
  // 像素缩放
  static PIXEL_SCALE = 4;
  
  // 场景名称
  static SCENE_GAME_INSTRUCTIONS = 'game_instructions';
  static SCENE_TUTORIAL = 'tutorial';
  static SCENE_MODE_SELECTION = 'mode_selection';
  static SCENE_GAME_MAIN = 'game_main';
  
  // 颜色常量
  static COLORS = {
    BACKGROUND: '#1a1a1a',
    PRIMARY: '#4a90e2',
    SECONDARY: '#50e3c2',
    DANGER: '#ff5252',
    SUCCESS: '#4caf50',
    TEXT_PRIMARY: '#ffffff',
    TEXT_SECONDARY: '#aaa',
    GRID_LINE: '#444',
    CELL_DEFAULT: '#333',
    CELL_REVEALED: '#222',
    CELL_MARKED: '#ffd700',
    HIGHLIGHT: '#ffd700'
  };
  
  // 字体
  static FONT_FAMILY = 'Arial';
  static FONT_SIZES = {
    TITLE: 48,
    SUBTITLE: 32,
    NORMAL: 24,
    SMALL: 18,
    TINY: 14
  };
  
  // 地图配置
  static MAP_SIZES = {
    small: { width: 8, height: 6, cellSize: 64 },
    medium: { width: 12, height: 9, cellSize: 64 },
    large: { width: 16, height: 12, cellSize: 64 }
  };
  
  // 音效
  static SOUND_EFFECTS = {
    BUTTON: 'button',
    VICTORY: 'victory',
    DEFEAT: 'defeat'
  };
}