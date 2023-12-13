export class TreeNode {
  val: number | 'temp'
  left: TreeNode | null
  right: TreeNode | null
  x = 0
  y = 0
  constructor(
    val?: number | 'temp',
    left?: TreeNode | null,
    right?: TreeNode | null
  ) {
    this.val = val === undefined ? 0 : val
    this.left = left === undefined ? null : left
    this.right = right === undefined ? null : right
  }
}
