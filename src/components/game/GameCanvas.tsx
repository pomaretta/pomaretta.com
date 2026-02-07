'use client'

import { useEffect, useRef } from 'react'
import type { GameMode, Difficulty } from './types'

interface GameCanvasProps {
  gameState: 'idle' | 'playing' | 'paused' | 'gameOver'
  mode: GameMode
  difficulty: Difficulty
  onScoreUpdate: (score: number) => void
  onGameOver: (finalScore: number, stats: GameStats) => void
}

export interface GameStats {
  coffeeCollected: number
  obstaclesAvoided: number
  timeSurvived: number
  maxCombo: number
}

export function GameCanvas({ gameState, mode, difficulty, onScoreUpdate, onGameOver }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number | undefined>(undefined)
  const statsRef = useRef<GameStats>({
    coffeeCollected: 0,
    obstaclesAvoided: 0,
    timeSurvived: 0,
    maxCombo: 0,
  })

  useEffect(() => {
    const canvasElement = canvasRef.current
    if (!canvasElement) return

    const ctxNullable = canvasElement.getContext('2d')
    if (!ctxNullable) return
    const ctx = ctxNullable
    const canvas = canvasElement

    // Obstacles interface
    interface Obstacle {
      x: number
      y: number
      width: number
      height: number
      type: 'bug' | 'error' | 'breaking'
    }

    // Coffee interface
    interface Coffee {
      x: number
      y: number
      width: number
      height: number
      collected: boolean
    }

    // Game variables
    let frameCount = 0
    let currentScore = 0
    let gameSpeed = getDifficultySpeed(difficulty)
    let currentCombo = 0
    let isGameActive = false

    // Player
    const player = {
      x: 50,
      y: 0,
      width: 40,
      height: 50,
      velocityY: 0,
      jumping: false,
      grounded: false,
    }

    const gravity = 0.8
    const jumpForce = -15
    const groundY = canvas.height - 80

    const obstacles: Obstacle[] = []
    let obstacleTimer = 0

    const coffees: Coffee[] = []
    let coffeeTimer = 0

    // Colors
    const colors = {
      player: '#60a5fa',
      bug: '#ef4444',
      error: '#f59e0b',
      breaking: '#8b5cf6',
      coffee: '#10b981',
      ground: '#4b5563',
      text: '#f3f4f6',
    }

    function getDifficultySpeed(diff: Difficulty): number {
      switch (diff) {
        case 'easy': return 4
        case 'normal': return 6
        case 'hard': return 8
        case 'expert': return 10
      }
    }

    function drawPlayer() {
      ctx.fillStyle = colors.player
      ctx.fillRect(player.x, player.y, player.width, player.height)

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(player.x + 10, player.y + 15, 8, 8)
      ctx.fillRect(player.x + 22, player.y + 15, 8, 8)

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(player.x + 20, player.y + 30, 8, 0, Math.PI)
      ctx.stroke()
    }

    function drawObstacle(obs: Obstacle) {
      if (obs.type === 'bug') {
        ctx.fillStyle = colors.bug
      } else if (obs.type === 'error') {
        ctx.fillStyle = colors.error
      } else {
        ctx.fillStyle = colors.breaking
      }

      ctx.fillRect(obs.x, obs.y, obs.width, obs.height)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 20px monospace'
      const icon = obs.type === 'bug' ? '🐛' : obs.type === 'error' ? '⚠️' : '💥'
      ctx.fillText(icon, obs.x + 5, obs.y + 25)
    }

    function drawCoffee(coffee: Coffee) {
      if (coffee.collected) return

      ctx.fillStyle = colors.coffee
      ctx.fillRect(coffee.x, coffee.y, coffee.width, coffee.height)

      ctx.fillStyle = '#ffffff'
      ctx.font = '20px monospace'
      ctx.fillText('☕', coffee.x + 2, coffee.y + 22)
    }

    function drawGround() {
      ctx.fillStyle = colors.ground
      ctx.fillRect(0, groundY + 50, canvas.width, 30)

      ctx.fillStyle = '#374151'
      ctx.font = '12px monospace'
      const codeLines = ['const x = 1;', 'function() {', 'return true;']
      codeLines.forEach((line, i) => {
        const x = ((frameCount * 2) % (canvas.width + 100)) - 100
        ctx.fillText(line, x + i * 150, groundY + 70)
      })
    }

    function updatePlayer() {
      player.velocityY += gravity
      player.y += player.velocityY

      if (player.y + player.height >= groundY) {
        player.y = groundY - player.height
        player.velocityY = 0
        player.grounded = true
        player.jumping = false
      } else {
        player.grounded = false
      }
    }

    function jump() {
      if (player.grounded && !player.jumping) {
        player.velocityY = jumpForce
        player.jumping = true
      }
    }

    function spawnObstacle() {
      const types: Array<'bug' | 'error' | 'breaking'> = ['bug', 'error', 'breaking']
      const type = types[Math.floor(Math.random() * types.length)]

      obstacles.push({
        x: canvas.width,
        y: groundY - 30,
        width: 35,
        height: 35,
        type,
      })
    }

    function spawnCoffee() {
      coffees.push({
        x: canvas.width,
        y: groundY - 80 - Math.random() * 50,
        width: 30,
        height: 30,
        collected: false,
      })
    }

    function updateObstacles() {
      obstacleTimer++
      const spawnRate = 80 - Math.min(currentScore / 10, 40)

      if (obstacleTimer > spawnRate) {
        spawnObstacle()
        obstacleTimer = 0
      }

      for (let index = obstacles.length - 1; index >= 0; index--) {
        const obs = obstacles[index]
        obs.x -= gameSpeed

        if (obs.x + obs.width < 0) {
          obstacles.splice(index, 1)
          statsRef.current.obstaclesAvoided++
        }

        if (
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y
        ) {
          handleGameOver()
          return
        }
      }
    }

    function updateCoffees() {
      coffeeTimer++
      if (coffeeTimer > 200) {
        spawnCoffee()
        coffeeTimer = 0
      }

      for (let index = coffees.length - 1; index >= 0; index--) {
        const coffee = coffees[index]
        if (coffee.collected) continue

        coffee.x -= gameSpeed

        if (coffee.x + coffee.width < 0) {
          coffees.splice(index, 1)
          currentCombo = 0
        }

        if (
          player.x < coffee.x + coffee.width &&
          player.x + player.width > coffee.x &&
          player.y < coffee.y + coffee.height &&
          player.y + player.height > coffee.y
        ) {
          coffee.collected = true
          currentCombo++
          statsRef.current.coffeeCollected++
          statsRef.current.maxCombo = Math.max(statsRef.current.maxCombo, currentCombo)
          currentScore += 10 * currentCombo
          onScoreUpdate(currentScore)
        }
      }
    }

    function handleGameOver() {
      isGameActive = false
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
        gameLoopRef.current = undefined
      }
      statsRef.current.timeSurvived = Math.floor(frameCount / 60)
      onGameOver(currentScore, statsRef.current)
    }

    function gameLoop() {
      if (!isGameActive) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#1f2937'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawGround()
      updatePlayer()
      drawPlayer()

      updateObstacles()
      obstacles.forEach(drawObstacle)

      updateCoffees()
      coffees.forEach(drawCoffee)

      frameCount++
      if (frameCount % 10 === 0) {
        currentScore++
        onScoreUpdate(currentScore)

        if (frameCount % 100 === 0 && gameSpeed < 12) {
          gameSpeed += 0.3
        }
      }

      // Continue loop unconditionally while active (like QuickPlayGame)
      if (isGameActive) {
        gameLoopRef.current = requestAnimationFrame(gameLoop)
      }
    }

    function handleKeyPress(e: KeyboardEvent) {
      if (e.code === 'Space') {
        e.preventDefault()
        if (gameState === 'playing') {
          jump()
        }
      }
    }

    function handleClick() {
      if (gameState === 'playing') {
        jump()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    canvas.addEventListener('click', handleClick)

    if (gameState === 'playing' && !isGameActive) {
      // Only reset when transitioning TO playing, not when already playing
      isGameActive = true
      frameCount = 0
      currentScore = 0
      currentCombo = 0
      gameSpeed = getDifficultySpeed(difficulty)
      obstacles.length = 0
      coffees.length = 0
      obstacleTimer = 0
      coffeeTimer = 0

      player.y = groundY - player.height
      player.velocityY = 0
      player.jumping = false
      player.grounded = true

      statsRef.current = {
        coffeeCollected: 0,
        obstaclesAvoided: 0,
        timeSurvived: 0,
        maxCombo: 0,
      }

      gameLoop()
    } else if (gameState === 'idle') {
      isGameActive = false
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      drawGround()
      player.y = groundY - player.height
      drawPlayer()
    } else if (gameState === 'paused') {
      isGameActive = false
    } else if (gameState === 'gameOver') {
      isGameActive = false
    }

    return () => {
      isGameActive = false
      window.removeEventListener('keydown', handleKeyPress)
      canvas.removeEventListener('click', handleClick)
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
        gameLoopRef.current = undefined
      }
    }
  }, [gameState, mode, difficulty])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="w-full rounded-lg border-2 border-white/20 bg-gray-900"
    />
  )
}
