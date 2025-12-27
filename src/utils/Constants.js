/**
 * 常量定义 - 游戏核心常量
 */
export default class Constants {
  // 屏幕尺寸
  static SCREEN_WIDTH = 1350;
  static SCREEN_HEIGHT = 620;

  // 格子大小（基础尺寸）px
  static BASE_CELL_SIZE = 80;

  // 像素分缩放比例
  static PIXEL_SCALE = 1;
  
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
    HIGHLIGHT: '#ffd700',
    SAFE_CELL: '#2a2a2a'
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
    small: {
      width: 8,
      height: 6,
      cellSize: 64
    },
    medium: {
      width: 12,
      height: 9,
      cellSize: 64
    },
    large: {
      width: 16,
      height: 12,
      cellSize: 64
    }
  };

  // 怪物模式
  static MONSTER_MODES = {
    1: '只有恶魔',
    2: '只有幽浮',
    3: '恶魔+幽浮(5种)',
    4: '6种怪物',
    5: '全部7种怪物'
  };

  // 难度
  static DIFFICULTY = {
    easy: '简单',
    normal: '普通',
    hard: '困难'
  };

  // 音效
  static SOUND_EFFECTS = {
    BUTTON: 'button',
    VICTORY: 'victory',
    DEFEAT: 'defeat'
  };

  // UI布局
  static UI_LAYOUT = {
    GAME_AREA_RATIO: 0.8, // 游戏区域占80%宽度
    INFO_BAR_HEIGHT: 80, // 信息栏高度
    MONSTER_INFO_HEIGHT: 60 // 怪物信息栏高度
  };
}