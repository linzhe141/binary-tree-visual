'use client'
import { useEffect, useRef, useState } from 'react'
import { TreeNode } from './treeNode'
import message from './message'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wraperRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ height: 0, width: 0 })
  const [input, setInput] = useState('[1,2,3,4,5,6,7,8,9]')

  const distance = 50
  const height = 100

  function draw() {
    if (!verifyInput(input)) {
      message({ type: 'error', text: '数据错误！' })
      return
    }
    const ctx = canvasRef.current?.getContext('2d')!
    ctx.clearRect(0, 0, containerSize.width, containerSize.height)

    const formatInput: (number | null)[] = JSON.parse(input)
    const root = createBinaryTreeFromArray(formatInput)

    // 根据input，生成一个对应的完全二叉树
    const fullBTNodesLength = Math.pow(2, getTreeHeight(root) + 1) - 1
    const arr: any[] = []
    for (let i = 0; i < fullBTNodesLength; i++) {
      arr[i] = formatInput[i] ?? 'temp'
    }
    const fullBTRoot = createBinaryTreeFromArray(arr)
    const fullBfsNodeList = bfs(fullBTRoot)
    const treeHeight = getTreeHeight(root)
    const flagCoordX =
      containerSize.width / 2 - (Math.pow(2, treeHeight) * distance) / 2
    const flagCoordY = containerSize.height / 2 + (treeHeight * height) / 2
    const flagCoord: [number, number] = [flagCoordX, flagCoordY]
    setCoord(fullBfsNodeList, flagCoord, distance, height)

    if (fullBTRoot) {
      drawLine(fullBTRoot)
      drawCircle()
      drawText()
    }
    function drawText() {
      for (let i = 0; i < fullBfsNodeList.length; i++) {
        if (formatInput[i] === null || formatInput[i] === undefined) continue
        ctx.beginPath()
        const node = fullBfsNodeList[i]
        ctx.font = '14px serif'
        ctx.fillStyle = '#fff'
        ctx.fillText(formatInput[i] + '', node.x - 4, node.y + 4)
        ctx.closePath()
      }
    }
    function drawLine(node: TreeNode) {
      ctx.moveTo(node.x, node.y)
      if (node.left && node.left.val !== 'temp') {
        ctx.lineTo(node.left.x, node.left.y)
        drawLine(node.left)
      }

      ctx.closePath()
      ctx.stroke()
      ctx.beginPath()
      ctx.lineTo(node.x, node.y)

      if (node.right && node.right.val !== 'temp') {
        ctx.lineTo(node.right.x, node.right.y)
        drawLine(node.right)
      }
    }
    function drawCircle() {
      for (let i = 0; i < fullBfsNodeList.length; i++) {
        if (formatInput[i] === null || formatInput[i] === undefined) continue
        const node = fullBfsNodeList[i]
        ctx.beginPath()
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI)
        ctx.fillStyle = '#4ade80'
        ctx.fill()
        ctx.closePath()
      }
    }
  }

  function resizeHandle() {
    const wraperHeight = wraperRef.current!.clientHeight
    const wraperWidth = wraperRef.current!.clientWidth
    setContainerSize({ height: wraperHeight, width: wraperWidth })
  }
  useEffect(() => {
    resizeHandle()
    window.addEventListener('resize', resizeHandle)

    return () => {
      window.removeEventListener('resize', resizeHandle)
    }
  }, [])
  useEffect(() => {
    draw()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerSize])
  return (
    <div className='relative h-screen items-center' ref={wraperRef}>
      <div className='absolute left-4 top-4 flex'>
        <input type='file' multiple />
        <textarea
          value={input}
          className='w-[400px] rounded-lg border border-gray-300 px-4 py-2 focus:border-green-400 focus:outline-none'
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <button
          onClick={draw}
          type='button'
          className={`ml-4 h-10 rounded-lg bg-green-400 px-4 py-2 text-white hover:bg-green-500 hover:shadow-green-400 focus:border-green-400 focus:outline-none`}
        >
          确认
        </button>
      </div>
      <canvas
        width={containerSize.width + 'px'}
        height={containerSize.height + 'px'}
        ref={canvasRef}
      ></canvas>
    </div>
  )
}

function createBinaryTreeFromArray(
  data: (number | null | 'temp')[]
): TreeNode | null {
  if (data.length === 0 || data[0] === null) return null

  const root = new TreeNode(data[0])
  const queue: TreeNode[] = [root]

  for (let i = 1; i < data.length; i++) {
    const currentNode = queue[0]

    if (data[i] !== null) {
      const newNode = new TreeNode(data[i]!)
      if (i % 2 !== 0) {
        currentNode.left = newNode
      } else {
        currentNode.right = newNode
        queue.shift()
      }
      queue.push(newNode)
    } else {
      if (i % 2 === 0) {
        queue.shift()
      }
    }
  }

  return root
}

function getMaxLevel(node: TreeNode) {
  let r1 = 1
  let r2 = 1
  if (node.left) r1 = getMaxLevel(node.left) + 1
  if (node.right) r2 = getMaxLevel(node.right) + 1
  if (!node.left && !node.right) return 1
  return Math.max(r1, r2)
}

function getTreeHeight(node: TreeNode | null) {
  if (!node) return 0
  return getMaxLevel(node) - 1
}

function setCoord(
  nodes: TreeNode[],
  flagCoord: [number, number],
  distance: number,
  height: number
) {
  const index = Math.floor((0 + nodes.length - 1) / 2)
  const item = nodes[index]
  item.x = flagCoord[0]
  item.y = flagCoord[1]

  for (let i = index + 1; i < nodes.length; i++) {
    const it = nodes[i]
    const prevIt = nodes[i - 1]
    it.x = prevIt.x + distance
    it.y = prevIt.y
  }
  for (let i = index - 1; i >= 0; i--) {
    const it = nodes[i]
    const leftNode = nodes[2 * i + 1]
    const rightNode = nodes[2 * i + 2]
    it.x = Math.floor((leftNode.x + rightNode.x) / 2)
    it.y = leftNode.y - height
  }
}

function bfs(root: TreeNode | null) {
  if (!root) return []
  const result: TreeNode[] = []
  const list = [root]
  while (list.length) {
    const head = list.shift()!
    result.push(head)
    if (head.left) {
      list.push(head.left)
    }
    if (head.right) {
      list.push(head.right)
    }
  }
  return result
}

function verifyInput(input: string) {
  try {
    if (!Array.isArray(JSON.parse(input))) {
      return false
    }
    const parseInput: any[] = JSON.parse(input)
    for (let i = 0; i < parseInput.length; i++) {
      const it = parseInput[i]
      if (it === null) {
        const leftNode = parseInput[2 * i + 1]
        const rightNode = parseInput[2 * i + 2]
        if (leftNode && leftNode !== null && rightNode && rightNode !== null)
          return false
      }
    }
    return true
  } catch (e) {
    return false
  }
}
