/**
 * 格子对象 - 存储每个格子的状态和数据
 */
export default class Cell {
  constructor(x, y) {
    // 位置信息
    this.x = x;          // 格子在网格中的X坐标
    this.y = y;          // 格子在网格中的Y坐标
    
    // 状态信息
    this.isRevealed = false;    // 是否已被探索
    this.isMarked = false;      // 是否被标记
    this.isMine = false;        // 是否包含怪物
    this.markedMonsterType = null; // 标记的怪物类型ID
    
    // 数值信息
    this.value = 0;             // 周围怪物数值总和
    this.monsterType = null;    // 如果是怪物，存储怪物类型
    
    // 视觉状态
    this.isSelected = false;    // 是否被选中（高亮）
    this.isHighlighted = false; // 是否被高亮提示
  }

  /**
   * 重置格子状态
   */
  reset() {
    this.isRevealed = false;
    this.isMarked = false;
    this.isMine = false;
    this.value = 0;
    this.monsterType = null;
    this.markedMonsterType = null;
    this.isSelected = false;
    this.isHighlighted = false;
  }

  /**
   * 设置为怪物格子
   * @param {Monster} monsterType - 怪物类型对象
   */
  setAsMine(monsterType) {
    this.isMine = true;
    this.monsterType = monsterType;
    this.value = monsterType.value;
  }

  /**
   * 标记格子
   * @param {string|null} monsterTypeId - 怪物类型ID，null表示取消标记
   */
  mark(monsterTypeId) {
    if (this.isRevealed) return false; // 已探索的格子不能标记
    
    this.isMarked = monsterTypeId !== null;
    this.markedMonsterType = monsterTypeId;
    return true;
  }

  /**
   * 探索单元格
   * @returns {boolean} - 是否为怪物（触发失败）
   */
  reveal() {
    if (this.isRevealed || this.isMarked) return false;
    
    this.isRevealed = true;
    return this.isMine;
  }

  /**
   * 获取格子的显示文本
   * @returns {string} - 要显示的内容
   */
  getDisplayText() {
    if (!this.isRevealed) {
      return this.isMarked ? (this.markedMonsterType || '?') : '';
    }
    
    if (this.isMine) {
      return 'M'; // Monster
    }
    
    return this.value > 0 ? this.value.toString() : '';
  }

  /**
   * 获取格子的显示颜色
   * @returns {string} - 颜色值
   */
  getDisplayColor() {
    if (!this.isRevealed) {
      return this.isMarked ? '#ffd700' : '#555';
    }
    
    if (this.isMine) {
      return '#ff5252';
    }
    
    const colors = ['#000', '#00f', '#0a0', '#f00', '#008', '#800', '#088', '#808', '#880'];
    return colors[this.value] || '#000';
  }
}