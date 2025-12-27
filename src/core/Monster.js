/**
 * 怪物类型定义 - 包含不同怪物的属性和范围
 */
export default class Monster {
  constructor(id, name, value, rangeVectors, spritePos) {
    this.id = id;              // 怪物ID
    this.name = name;          // 怪物名称
    this.value = value;        // 怪物数值
    this.rangeVectors = rangeVectors; // 影响范围向量
    this.spritePos = spritePos; // 在精灵图中的位置 {row, col}
    
    // 计算精灵图中的实际像素位置 (72x72 像素每个精灵)
    this.spriteX = spritePos.col * 72;
    this.spriteY = spritePos.row * 72;
    this.spriteWidth = 72;
    this.spriteHeight = 72;
  }

  /**
   * 获取怪物在格子上影响的所有位置
   * @param {number} centerX - 中心X坐标
   * @param {number} centerY - 中心Y坐标
   * @param {number} width - 网格宽度
   * @param {number} height - 网格高度
   * @returns {Array} - 有效的相邻位置数组
   */
  getAffectedPositions(centerX, centerY, width, height) {
    const positions = [];
    
    for (const vector of this.rangeVectors) {
      const x = centerX + vector[0];
      const y = centerY + vector[1];
      
      // 检查是否在网格范围内
      if (x >= 0 && x < width && y >= 0 && y < height) {
        positions.push({x, y});
      }
    }
    
    return positions;
  }
}

/**
 * 怪物配置工厂 - 创建预定义的怪物类型
 */
export class MonsterFactory {
  static createMonsters() {
    const monsters = [];
    
    // 怪物1
    const monster1Range = [
      // 周围8格
      [-1, -1], [0, -1], [1, -1],
      [-1, 0],           [1, 0],
      [-1, 1],  [0, 1],  [1, 1],
      // 上下左右各2格
      [0, -2], [0, 2], [-2, 0], [2, 0]
    ];
    monsters.push(new Monster('monster1', '恶魔A', 1, monster1Range, {row: 0, col: 0}));
    
    // 怪物2
    const monster2Range = [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0],           [1, 0],
      [-1, 1],  [0, 1],  [1, 1],
      [0, -2], [0, 2], [-2, 0], [2, 0]
    ];
    monsters.push(new Monster('monster2', '恶魔B', 2, monster2Range, {row: 0, col: 1}));
    
    // 怪物3
    const monster3Range = [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0],           [1, 0],
      [-1, 1],  [0, 1],  [1, 1],
      [0, -2], [0, 2], [-2, 0], [2, 0]
    ];
    monsters.push(new Monster('monster3', '恶魔C', 3, monster3Range, {row: 0, col: 2}));
    
    // 怪物4
    const monster4Range = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0],           [1, 0],
    [-1, 1],  [0, 1],  [1, 1]
  ];
    monsters.push(new Monster('monster3', '幽浮A', 1, monster4Range, {row: 0, col: 3}));
    
    // 怪物5
    const monster5Range = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0],           [1, 0],
    [-1, 1],  [0, 1],  [1, 1]
  ];
    monsters.push(new Monster('monster3', '幽浮B', 2, monster5Range, {row: 2, col: 0}));
    
    // 怪物6
   const monster6Range = [
    [-1, 0], [0, 1], [1, 0], [0, -1],
    [-2, 0], [0, 2], [2, 0], [0, -2]
  ];
    monsters.push(new Monster('monster3', '淤泥怪A', 2, monster6Range, {row: 2, col: 1}));
  
    // 怪物7
   const monster7Range = [
    [-1, -1], [1, 1], [1, -1], [-1, 1],
    [-2, -2], [2, 2], [2, -2], [-2, 2]
  ];
    monsters.push(new Monster('monster3', '淤泥怪B', 2, monster7Range, {row: 2, col: 2}));
    
    return monsters;
  }
/**
   * 获取指定模式的怪物类型
   * @param {number} mode - 怪物模式 (1-5)
   * @returns {Array} - 该模式下可用的怪物类型
   */
  static getMonstersByMode(mode) {
    const allMonsters = this.createMonsters();
    
    switch(mode) {
      case 1: // 只有前三种（恶魔A,B,C）
        return allMonsters.slice(0, 3);
      case 2: // 只有第四第五种（幽浮A,B）
        return allMonsters.slice(3, 5);
      case 3: // 有前五种（恶魔A,B,C + 幽浮A,B）
        return allMonsters.slice(0, 5);
      case 4: // 有前六种
        return allMonsters.slice(0, 6);
      case 5: // 有全部七种
        return allMonsters;
      default:
        return allMonsters.slice(0, 3); // 默认返回前三种
    }
  }
}