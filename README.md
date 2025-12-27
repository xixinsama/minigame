# 怪物扫雷 - 微信小游戏

## 项目说明

**怪物扫雷**是一款创新的扫雷游戏，将传统扫雷玩法与怪物收集元素相结合。游戏中，地雷被替换为不同类型的怪物，每种怪物具有独特的数值和影响范围。玩家需要通过逻辑推理找出所有怪物的位置，当所有怪物都被正确标记时即可通关。

### 核心特色

- **创新怪物系统**：不同怪物具有不同的数值和影响范围，例如怪物1的范围为周围8格+上下左右各2格（共12格）
- **数值叠加机制**：当多个怪物的影响范围重叠时，数值会自动叠加
- **触控优化**：专为手机触屏设计，支持点击、长按和拖拽操作
- **智能展开**：自动展开空白区域，提升游戏体验
- **动态适配**：自动适配各种手机屏幕尺寸，确保最佳显示效果
- **拖拽标注**：通过拖拽怪物标签到对应格子进行标记，替代传统的右键标记

### 游戏规则

1. 每个格子可能包含怪物或显示数字
2. 数字表示周围范围内怪物数值的总和（不包括自身）
3. 怪物会影响特定范围内的格子，不同怪物范围不同
4. 通过逻辑推理找出所有怪物位置
5. 使用拖拽方式将怪物标签拖到对应格子进行标记
6. 当所有怪物都被正确标记时，游戏胜利

## 项目目录结构
```
monster-minesweeper/
├── game.js # 游戏主入口文件
├── game.json # 游戏配置文件
├── project.config.json # 项目配置文件
├── project.private.config.json # 项目私有配置
├── js/
│ ├── core/
│ │ ├── GameEngine.js # 游戏核心引擎，处理游戏逻辑
│ │ ├── BoardManager.js # 棋盘管理器，处理格子生成和计算
│ │ ├── MonsterSystem.js # 怪物系统，定义怪物类型和范围
│ │ └── GameState.js # 游戏状态管理
│ ├── utils/
│ │ ├── ScreenAdapter.js # 屏幕适配工具
│ │ ├── TouchHandler.js # 触控事件处理器
│ │ ├── DragSystem.js # 拖拽系统实现
│ │ └── MathUtils.js # 数学工具函数
│ ├── components/
│ │ ├── GameBoard.js # 游戏棋盘组件
│ │ ├── CellRenderer.js # 格子渲染器
│ │ ├── MonsterMarker.js # 怪物标记组件
│ │ ├── HUDManager.js # 游戏界面HUD管理
│ │ └── PopupManager.js # 弹窗管理器
│ ├── scenes/
│ │ ├── StartScene.js # 开始场景
│ │ ├── GameScene.js # 游戏主场景
│ │ ├── WinScene.js # 胜利场景
│ │ └── LoseScene.js # 失败场景
│ └── managers/
│ ├── AudioManager.js # 音效管理器
│ ├── DataManager.js # 数据管理器（存档等）
│ └── UIManager.js # UI管理器
├── libs/
│ └── weapp-adapter.js # 微信小游戏适配库
└── assets/
├── scripts/ # 脚本资源
│ └── preload.js # 预加载脚本
└── config/
└── monsterConfig.js # 怪物配置数据
```


## 开发规范

### 代码规范
- 遵循微信小游戏开发规范，使用ES6+语法
- 模块化开发，每个功能模块独立封装
- 严格的命名规范：类名使用PascalCase，变量使用camelCase
- 详细的代码注释，特别是核心算法部分
- [文档参考](https://developers.weixin.qq.com/minigame/dev/guide/develop/start.html)

### 性能优化
- 使用对象池技术管理格子对象
- 避免频繁的DOM操作，使用Canvas渲染
- 懒加载资源，减少初始加载时间
- 内存管理，及时清理无用对象

### 兼容性
- 适配iOS和Android主流机型
- 支持微信基础库2.10.0及以上版本
- 屏幕适配支持从iPhone SE到全面屏的各种尺寸

## 快速开始

1. 使用微信开发者工具导入项目
2. 安装依赖（如有）
3. 运行调试
4. 构建发布

## 技术栈
- 微信小游戏API
- Canvas 2D渲染
- ES6+ JavaScript
- 模块化开发架构
