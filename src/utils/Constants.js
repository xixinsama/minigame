/**
 * 常量定义 - 游戏核心常量
 */
export default class Constants {
  // 屏幕尺寸
  static SCREEN_WIDTH = 1920;
  static SCREEN_HEIGHT = 1080;
  
  // 格子大小（基础尺寸）
  static BASE_CELL_SIZE = 80;
  
  // 像素分缩放比例
  static PIXEL_SCALE = 4;
  
  // 地图尺寸配置
  static MAP_SIZES = {
    small: { width: 8, height: 6 },
    medium: { width: 12, height: 9 },
    large: { width: 16, height: 12 }
  };
  
  // 生命值配置
  static LIFE_OPTIONS = [1, 2, 3];
  
  // 怪物模式配置
  static MONSTER_MODES = {
    1: '3种怪',
    2: '5种怪', 
    3: '6种怪',
    4: '7种怪'
  };
  
  // 难度配置
  static DIFFICULTY_OPTIONS = ['easy', 'normal', 'hard'];
  static DIFFICULTY_NAMES = {
    easy: '简单',
    normal: '普通', 
    hard: '困难'
  };
  
  // 颜色常量
  static COLORS = {
    BACKGROUND: '#1a1a1a',
    GRID_LINE: '#444',
    CELL_DEFAULT: '#333',
    CELL_REVEALED: '#222',
    CELL_MARKED: '#ffd700',
    TEXT_PRIMARY: '#ffffff',
    TEXT_SECONDARY: '#aaa',
    HIGHLIGHT: '#50e3c2',
    DANGER: '#ff5252',
    SUCCESS: '#4caf50'
  };
  
  // 字体配置
  static FONT_SIZES = {
    TITLE: 48,
    SUBTITLE: 32,
    NORMAL: 24,
    SMALL: 18,
    TINY: 14
  };
  
  // UI布局
  static UI_LAYOUT = {
    GAME_AREA_RATIO: 0.8,  // 游戏区域占80%宽度
    INFO_BAR_HEIGHT: 80,   // 信息栏高度
    MONSTER_INFO_HEIGHT: 60 // 怪物信息栏高度
  };
  
  // 音效配置
  static SOUND_EFFECTS = {
    BUTTON_CLICK: 'button_click',
    VICTORY: 'victory',
    DEFEAT: 'defeat'
  };
}