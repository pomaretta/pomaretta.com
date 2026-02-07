'use client'

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { QuickPlayControls } from './QuickPlayControls'
import type { DailyChallenge } from '@/types/game'
import { updateChallengeProgress, isChallengeCompleted } from '@/lib/game/daily-challenges'

interface QuickPlayGameProps {
  onScoreUpdate?: (score: number) => void
  onGameOver?: (finalScore: number) => void
  activeChallenge?: DailyChallenge | null
  onChallengeProgress?: (progress: number, completed: boolean) => void
}

export interface QuickPlayGameHandle {
  startGame: () => void
}

export const QuickPlayGame = forwardRef<QuickPlayGameHandle, QuickPlayGameProps>(
  function QuickPlayGame({ onScoreUpdate, onGameOver, activeChallenge, onChallengeProgress }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const gameLoopRef = useRef<number | undefined>(undefined)
  const challengeMetricsRef = useRef({ coffeeCollected: 0, obstaclesAvoided: 0, timeSurvived: 0 })

  const startGame = () => {
    setScore(0)
    challengeMetricsRef.current = { coffeeCollected: 0, obstaclesAvoided: 0, timeSurvived: 0 }
    setGameState('playing')
  }

  const resetGame = () => {
    setScore(0)
    setGameState('idle')
  }

  // Expose startGame to parent via ref
  useImperativeHandle(ref, () => ({
    startGame
  }))

  useEffect(() => {
    // Load high score from localStorage
    const saved = localStorage.getItem('codeRunnerHighScore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  useEffect(() => {
    const canvasElement = canvasRef.current
    if (!canvasElement) return

    const ctxNullable = canvasElement.getContext('2d')
    if (!ctxNullable) return
    const ctx = ctxNullable
    const canvas = canvasElement

    // Game variables
    let animationId: number
    let frameCount = 0
    let currentScore = 0
    let gameSpeed = 6

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

    // Obstacles
    interface Obstacle {
      x: number
      y: number
      width: number
      height: number
      type: 'bug' | 'error' | 'breaking'
    }

    const obstacles: Obstacle[] = []
    let obstacleTimer = 0

    // Coffee collectibles
    interface Coffee {
      x: number
      y: number
      width: number
      height: number
      collected: boolean
    }

    const coffees: Coffee[] = []
    let coffeeTimer = 0

    // Challenge progress helper
    function updateChallengeMetrics() {
      if (!activeChallenge || !onChallengeProgress) return

      let current = 0
      let completed = false

      switch (activeChallenge.type) {
        case 'score':
          current = currentScore
          break
        case 'collect':
          current = challengeMetricsRef.current.coffeeCollected
          break
        case 'avoid':
          current = challengeMetricsRef.current.obstaclesAvoided
          break
        case 'survive':
          current = Math.floor(frameCount / 60) // Convert frames to seconds
          break
        default:
          return
      }

      const progress = Math.min(100, (current / activeChallenge.target) * 100)
      completed = isChallengeCompleted(activeChallenge, current)

      // Update localStorage
      updateChallengeProgress(activeChallenge, current, completed)

      // Notify parent
      onChallengeProgress(progress, completed)
    }

    // Colors matching site theme
    const colors = {
      player: '#60a5fa', // blue
      bug: '#ef4444', // red
      error: '#f59e0b', // orange
      breaking: '#8b5cf6', // purple
      coffee: '#10b981', // green
      ground: '#4b5563', // gray
      text: '#f3f4f6', // light gray
    }

    function drawPlayer() {
      ctx.fillStyle = colors.player
      ctx.fillRect(player.x, player.y, player.width, player.height)

      // Draw simple face
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(player.x + 10, player.y + 15, 8, 8) // left eye
      ctx.fillRect(player.x + 22, player.y + 15, 8, 8) // right eye

      // Draw smile
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(player.x + 20, player.y + 30, 8, 0, Math.PI)
      ctx.stroke()
    }

    function drawObstacle(obs: Obstacle) {
      // Different colors for different obstacles
      if (obs.type === 'bug') {
        ctx.fillStyle = colors.bug
      } else if (obs.type === 'error') {
        ctx.fillStyle = colors.error
      } else {
        ctx.fillStyle = colors.breaking
      }

      ctx.fillRect(obs.x, obs.y, obs.width, obs.height)

      // Draw icon representation
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 20px monospace'
      const icon = obs.type === 'bug' ? '🐛' : obs.type === 'error' ? '⚠️' : '💥'
      ctx.fillText(icon, obs.x + 5, obs.y + 25)
    }

    function drawCoffee(coffee: Coffee) {
      if (coffee.collected) return

      ctx.fillStyle = colors.coffee
      ctx.fillRect(coffee.x, coffee.y, coffee.width, coffee.height)

      // Draw coffee icon
      ctx.fillStyle = '#ffffff'
      ctx.font = '20px monospace'
      ctx.fillText('☕', coffee.x + 2, coffee.y + 22)
    }

    function drawGround() {
      ctx.fillStyle = colors.ground
      ctx.fillRect(0, groundY + 50, canvas.width, 30)

      // Draw scrolling code lines
      ctx.fillStyle = '#374151'
      ctx.font = '12px monospace'
      const codeLines = ['const x = 1;', 'function() {', 'return true;']
      codeLines.forEach((line, i) => {
        const x = ((frameCount * 2) % (canvas.width + 100)) - 100
        ctx.fillText(line, x + i * 150, groundY + 70)
      })
    }

    function updatePlayer() {
      // Apply gravity
      player.velocityY += gravity
      player.y += player.velocityY

      // Ground collision
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
      if (obstacleTimer > 80 - Math.min(currentScore / 10, 40)) {
        spawnObstacle()
        obstacleTimer = 0
      }

      obstacles.forEach((obs, index) => {
        obs.x -= gameSpeed

        // Remove off-screen obstacles
        if (obs.x + obs.width < 0) {
          obstacles.splice(index, 1)
          challengeMetricsRef.current.obstaclesAvoided++
          updateChallengeMetrics()
        }

        // Collision detection
        if (
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y
        ) {
          setGameState('gameOver')
          if (currentScore > highScore) {
            setHighScore(currentScore)
            localStorage.setItem('codeRunnerHighScore', currentScore.toString())
          }
          if (onGameOver) {
            onGameOver(currentScore)
          }
        }
      })
    }

    function updateCoffees() {
      coffeeTimer++
      if (coffeeTimer > 200) {
        spawnCoffee()
        coffeeTimer = 0
      }

      coffees.forEach((coffee, index) => {
        if (coffee.collected) return

        coffee.x -= gameSpeed

        // Remove off-screen coffees
        if (coffee.x + coffee.width < 0) {
          coffees.splice(index, 1)
        }

        // Collection detection
        if (
          player.x < coffee.x + coffee.width &&
          player.x + player.width > coffee.x &&
          player.y < coffee.y + coffee.height &&
          player.y + player.height > coffee.y
        ) {
          coffee.collected = true
          currentScore += 10
          challengeMetricsRef.current.coffeeCollected++
          setScore(currentScore)
          if (onScoreUpdate) {
            onScoreUpdate(currentScore)
          }
          updateChallengeMetrics()
        }
      })
    }

    function gameLoop() {
      if (gameState !== 'playing') return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawGround()
      updatePlayer()
      drawPlayer()

      updateObstacles()
      obstacles.forEach(drawObstacle)

      updateCoffees()
      coffees.forEach(drawCoffee)

      // Increase score
      frameCount++
      if (frameCount % 10 === 0) {
        currentScore++
        setScore(currentScore)
        if (onScoreUpdate) {
          onScoreUpdate(currentScore)
        }
        updateChallengeMetrics()

        // Gradually increase speed
        if (frameCount % 100 === 0 && gameSpeed < 12) {
          gameSpeed += 0.5
        }
      }

      animationId = requestAnimationFrame(gameLoop)
    }

    function handleKeyPress(e: KeyboardEvent) {
      if (e.code === 'Space') {
        e.preventDefault()
        if (gameState === 'idle') {
          setGameState('playing')
        } else if (gameState === 'playing') {
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

    if (gameState === 'playing') {
      player.y = groundY - player.height
      gameLoop()
    } else if (gameState === 'idle') {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      drawGround()
      player.y = groundY - player.height
      drawPlayer()
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      canvas.removeEventListener('click', handleClick)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [gameState, highScore, onScoreUpdate, onGameOver])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full rounded-lg border-2 border-white/20 cursor-pointer"
        onClick={() => {
          if (gameState === 'idle') startGame()
        }}
      />

      <QuickPlayControls
        gameState={gameState}
        score={score}
        highScore={highScore}
        onStart={startGame}
        onReset={resetGame}
      />
    </div>
  )
})
