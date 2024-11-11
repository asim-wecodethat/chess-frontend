import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import {
    getGameState,
    makeMove,
    getMoveSuggestions,
    undoMove,
    resetGame,
    isCheck,
    isCheckmate,
    isGameOver,
} from '../gameLogic.js';
import './Chessboard.css';

const ChessApp = () => {
    const [boardState, setBoardState] = useState(getGameState());
    const [moveSuggestions, setMoveSuggestions] = useState([]);
    const [status, setStatus] = useState('');
    const [moveHistory, setMoveHistory] = useState([]);
    const moveSound = new Audio('/sounds/move.mp3');
    const captureSound = new Audio('/sounds/capture.mp3');

    useEffect(() => {
        setMoveSuggestions(getMoveSuggestions());
    }, [boardState]);

    useEffect(() => {
        if (isCheckmate()) {
            setStatus('Checkmate!');
        } else if (isCheck()) {
            setStatus('Check!');
        } else if (isGameOver()) {
            setStatus('Game Over!');
        } else {
            setStatus('');
        }
    }, [boardState]);

    const handleMove = (from, to) => {
        const isCapture = Boolean(getMoveSuggestions().find((move) => move.to === to));
        const moveMade = makeMove({ from, to });
        if (moveMade) {
            isCapture ? captureSound.play() : moveSound.play();
            setBoardState(getGameState());
            setMoveHistory((prevHistory) => [...prevHistory, { from, to }]);
        }
        return moveMade;
    };

    const handleUndo = () => {
        undoMove();
        setBoardState(getGameState());
        setMoveHistory((prevHistory) => prevHistory.slice(0, -1));
    };

    const handleReset = () => {
        resetGame();
        setBoardState(getGameState());
        setMoveHistory([]);
        setStatus('');
    };

    return (
        <div className="chess-app">
            <div className="chessboard-container">
                <Chessboard 
                    position={boardState} 
                    onPieceDrop={handleMove}
                    boardWidth={560} 
                    animationDuration={200}
                />
            </div>
            <div className="sidebar">
                <h2>Current Status</h2>
                {status && <p className="status">{status}</p>}
                <h3>Move History</h3>
                <ol className="move-history">
                    {moveHistory.map((move, index) => (
                        <li key={index}>
                            {move.from} → {move.to}
                        </li>
                    ))}
                </ol>
                <h3>Move Suggestions</h3>
                <ul className="move-suggestions">
                    {moveSuggestions.map((move, index) => (
                        <li key={index}>
                            {move.san} ({move.from} → {move.to})
                        </li>
                    ))}
                </ul>
                <div className="button-container">
                    <button onClick={handleUndo} disabled={!moveHistory.length}>Undo</button>
                    <button onClick={handleReset}>Reset Game</button>
                </div>
            </div>
        </div>
    );
};

export default ChessApp;