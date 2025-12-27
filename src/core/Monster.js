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
    
    // 怪物1：数值为1，范围为周围八格 + 上下左右各2格（共12格）
    const monster1Range = [
      // 周围8格
      [-1, -1], [0, -1], [1, -1],
      [-1, 0],           [1, 0],
      [-1, 1],  [0, 1],  [1, 1],
      // 上下左右各2格
      [0, -2], [0, 2], [-2, 0], [2, 0]
    ];
    monsters.push(new Monster('monster1', '小幽灵', 1, monster1Range, {row: 0, col: 0}));
    
    // 怪物2：数值为2，范围为周围8格
    const monster2Range = [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0],           [1, 0],
      [-1, 1],  [0, 1],  [1, 1]
    ];
    monsters.push(new Monster('monster2', '大幽灵', 2, monster2Range, {row: 0, col: 1}));
    
    // 怪物3：数值为3，范围为十字形（上下左右各3格）
    const monster3Range = [
      [0, -1], [0, -2], [0, -3],
      [-1, 0], [-2, 0], [-3, 0],
      [1, 0],  [2, 0],  [3, 0],
      [0, 1],  [0, 2],  [0, 3]
    ];
    monsters.push(new Monster('monster3', '骷髅王', 3, monster3Range, {row: 0, col: 2}));
    
    // 更多怪物类型可以在这里继续添加...
    
    return monsters;
  }
}