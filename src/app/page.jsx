'use client';

import React, { useState, useEffect, useRef } from 'react';
import Board from '../components/board';

const BOARD_SIZE = 10;

const getRandomPosition = () => ({
  x: Math.floor(Math.random() * BOARD_SIZE),
  y: Math.floor(Math.random() * BOARD_SIZE),
});

const getValidSnakeAndFood = () => {
  const snake = [getRandomPosition()];
  let food = getRandomPosition();
  while (food.x === snake[0].x && food.y === snake[0].y) {
    food = getRandomPosition();
  }
  return { snake, food };
};

export default function Main() {
  const [snake, setSnake] = useState([]);
  const [food, setFood] = useState(null);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState(null);
  const intervalRef = useRef(null);

  // initialize game 
  useEffect(() => {
    const { snake: initSnake, food: initFood } = getValidSnakeAndFood();
    setSnake(initSnake);
    setFood(initFood);
  }, []);

  const restartGame = () => {
    const { snake: newSnake, food: newFood } = getValidSnakeAndFood();
    setSnake(newSnake);
    setFood(newFood);
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
  };

  // keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver && e.key === 'Enter') {
        restartGame();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  // Game loop
  useEffect(() => {
    if (!snake.length || !food || gameOver) return;


    intervalRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };


        // Wall or self collision
        if (
          newHead.x < 0 || newHead.x >= BOARD_SIZE ||
          newHead.y < 0 || newHead.y >= BOARD_SIZE ||
          prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          setGameOver(true);
          clearInterval(intervalRef.current);

          setBestScore(prev => {
            if (prev === null || score > prev) return score;
            return prev;
          });

          return prevSnake;
        }



        const ateFood = newHead.x === food.x && newHead.y === food.y;

        let newSnake = [newHead, ...prevSnake];
        if (ateFood) {
          
          setScore(score + 1);
          
          let newFood;
          do {
            newFood = getRandomPosition();
          } while (newSnake.some(pos => pos.x === newFood.x && pos.y === newFood.y));
          setFood(newFood);
        } else {
          newSnake = newSnake.slice(0, -1);
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(intervalRef.current);
  }, [direction, food, gameOver, snake]);

  return (
    <main className="flex flex-col items-center mt-16 ">
      
      <h1 className="text-3xl font-bold mb-4">Score: {score}</h1>

      {bestScore !== null && (
        <div className="text-sm text-yellow-500 font-semibold mb-8">
          Best: {bestScore}
        </div>
      )}


      <Board snake={snake} food={food} boardSize={BOARD_SIZE} />

      {gameOver && (
        <div className="mt-6 text-red-600 font-bold text-xl flex flex-col items-center">
          Game Over!
          <button
            onClick={restartGame}
            className="mt-3 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Restart
          </button>
          <p className="mt-1 text-sm text-gray-400">or press Enter</p>
        </div>
      )}
    </main>
  );
}
