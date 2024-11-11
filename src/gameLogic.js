import { Chess } from 'chess.js';

const game = new Chess();

export const getGameState = () => game.fen();

export const getMoveSuggestions = () => {
  const moves = game.moves({ verbose: true });
  return moves.map((move) => ({
    from: move.from,
    to: move.to,
    san: move.san,
  }));
};

export const makeMove = (move) => {
  const result = game.move(move);
  return result !== null;
};

export const undoMove = () => game.undo();

export const resetGame = () => game.reset();

export const isCheck = () => game.isCheck();

export const isCheckmate = () => game.isCheckmate();

export const isGameOver = () => game.isGameOver();