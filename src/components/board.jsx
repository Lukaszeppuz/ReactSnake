export default function Board({ snake, food, boardSize }) {
  const cells = [];

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const isHead = snake[0]?.x === x && snake[0]?.y === y;
      const isSnake = snake.some(seg => seg.x === x && seg.y === y);
      const isFood = food?.x === x && food?.y === y;

      let className = 'w-10 h-10 border border-gray-700 ';
      if (isHead) className += 'bg-green-700';
      else if (isSnake) className += 'bg-green-400';
      else if (isFood) className += 'bg-red-500';
      else className += 'bg-gray-800';

      cells.push(<div key={`${x}-${y}`} className={className} />);
    }
  }

  return (
    <div
      className="grid gap-[2px] p-2 rounded bg-gray-900"
      style={{
        gridTemplateColumns: `repeat(${boardSize}, 2.5rem)`,
        gridTemplateRows: `repeat(${boardSize}, 2.5rem)`,
      }}
    >
      {cells}
    </div>
  );
}