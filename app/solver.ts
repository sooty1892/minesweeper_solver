import {Minesweeper, Square, Level} from './minesweeper';

const of = (hCoor: number, wCoor: number): Square => {
    return {
        hCoor,
        wCoor
    }
}

const BLANK = ' ';
const BOMB = 'X';
const ZERO = '0';
const ONE = '1';
const TWO = '2';
const THREE = '3';
const FOUR = '4';
const FIVE = '5';
const SIX = '6';
const SEVEN = '7';
const EIGHT = '8';

let game: Minesweeper;
let level: Level;
let board: string[][] = [];

const bombsLeft = (): number => {
    let bombsMarked = 0;
    for (let h = 1; h <= level.height; h++) {
        for (let w = 1; w <= level.width; w++) {
            if (board[h][w] === BOMB) {
                bombsMarked++;
            }
        }
    }
    return level.numberOfMines-bombsMarked;
};

const printBoard = () => {
    console.log(`Current Board (Bombs left = ${bombsLeft()})`);
    let str = '';
    for (let h = 1; h <= level.height; h++) {
        for (let w = 1; w <= level.width; w++) {
            str += board[h][w];
        }
        console.log(str);
        str = '';
    }
};

const isOpen = (hCoor: number, wCoor: number): boolean => !isClosed(hCoor, wCoor) && !isBomb(hCoor, wCoor);

const isClosed = (hCoor: number, wCoor: number): boolean => board[hCoor][wCoor] === BLANK;

const isBomb = (hCoor: number, wCoor: number): boolean => board[hCoor][wCoor] === BOMB;

const isEdge = (hCoor: number, wCoor: number): boolean => hCoor === 1 || hCoor === level.height || wCoor === 1 || wCoor === level.width;

const isCorner = (hCoor: number, wCoor: number): boolean => {
    if (hCoor === 1 && wCoor === 1) return true;
    if (hCoor === 1 && wCoor === level.width) return true;
    if (hCoor === level.height && wCoor === 1) return true;
    if (hCoor === level.height && wCoor === level.width) return true;
    return false;
};

const numSquaresSurroundingSquare = (hCoor: number, wCoor: number): number => {
    if (isCorner(hCoor, wCoor)) return 3;
    if (isEdge(hCoor, wCoor) && !isCorner(hCoor, wCoor)) return 5;
    return 8;
}

const countBombsSurroundingSquare = (hCoor: number, wCoor: number): number => {
    let count = 0;
    if (isValid(hCoor, wCoor+1) && isBomb(hCoor, wCoor+1)) count++;
    if (isValid(hCoor, wCoor-1) && isBomb(hCoor, wCoor-1)) count++;
    if (isValid(hCoor+1, wCoor) && isBomb(hCoor+1, wCoor)) count++;
    if (isValid(hCoor-1, wCoor) && isBomb(hCoor-1, wCoor)) count++;
    if (isValid(hCoor+1, wCoor-1) && isBomb(hCoor+1, wCoor-1)) count++;
    if (isValid(hCoor-1, wCoor+1) && isBomb(hCoor-1, wCoor+1)) count++;
    if (isValid(hCoor+1, wCoor+1) && isBomb(hCoor+1, wCoor+1)) count++;
    if (isValid(hCoor-1, wCoor-1) && isBomb(hCoor-1, wCoor-1)) count++;
    return count;
};

const isValid = (hCoor: number, wCoor: number): boolean => {
    return hCoor >= 1 && hCoor <= level.height && wCoor >= 1 && wCoor <= level.width;
};

const findOpenSquaresSurroundingSquare = (hCoor: number, wCoor: number): number => {
    let count = 0;
    if (isValid(hCoor, wCoor+1) && isOpen(hCoor, wCoor+1)) count++;
    if (isValid(hCoor, wCoor-1) && isOpen(hCoor, wCoor-1)) count++;
    if (isValid(hCoor+1, wCoor) && isOpen(hCoor+1, wCoor)) count++;
    if (isValid(hCoor-1, wCoor) && isOpen(hCoor-1, wCoor)) count++;
    if (isValid(hCoor+1, wCoor-1) && isOpen(hCoor+1, wCoor-1)) count++;
    if (isValid(hCoor-1, wCoor+1) && isOpen(hCoor-1, wCoor+1)) count++;
    if (isValid(hCoor+1, wCoor+1) && isOpen(hCoor+1, wCoor+1)) count++;
    if (isValid(hCoor-1, wCoor-1) && isOpen(hCoor-1, wCoor-1)) count++;
    return count;
};

const toNumber = (num: string): number => {
    if (num === ZERO) {
        return 0;
    } else if (num === ONE) {
        return 1;
    } else if (num === TWO) {
        return 2;
    } else if (num === THREE) {
        return 3;
    } else if (num === FOUR) {
        return 4;
    } else if (num === FIVE) {
        return 5;
    } else if (num === SIX) {
        return 6;
    } else if (num === SEVEN) {
        return 7;
    } else if (num === EIGHT) {
        return 8;
    } else {
        console.error('Error decoding number', num);
        return 0;
    }
}

const findListOfClosedSquaresSurroundingSquare = (hCoor: number, wCoor: number): Square[] => {
    let res = [];
    if (isValid(hCoor, wCoor+1) && isClosed(hCoor, wCoor+1)) res.push(of(hCoor, wCoor+1));
    if (isValid(hCoor, wCoor-1) && isClosed(hCoor, wCoor-1)) res.push(of(hCoor, wCoor-1));
    if (isValid(hCoor+1, wCoor) && isClosed(hCoor+1, wCoor)) res.push(of(hCoor+1, wCoor));
    if (isValid(hCoor-1, wCoor) && isClosed(hCoor-1, wCoor)) res.push(of(hCoor-1, wCoor));
    if (isValid(hCoor+1, wCoor-1) && isClosed(hCoor+1, wCoor-1)) res.push(of(hCoor+1, wCoor-1));
    if (isValid(hCoor-1, wCoor+1) && isClosed(hCoor-1, wCoor+1)) res.push(of(hCoor-1, wCoor+1));
    if (isValid(hCoor+1, wCoor+1) && isClosed(hCoor+1, wCoor+1)) res.push(of(hCoor+1, wCoor+1));
    if (isValid(hCoor-1, wCoor-1) && isClosed(hCoor-1, wCoor-1)) res.push(of(hCoor-1, wCoor-1));
    return res;
};

const open = async () => {
    for (let h = 1; h <= level.height; h++) {
        for (let w = 1; w <= level.width; w++) {
            if (isOpen(h, w) &&
                countBombsSurroundingSquare(h, w) === toNumber(board[h][w]) &&
                toNumber(board[h][w]) !== 0 &&
                findOpenSquaresSurroundingSquare(h, w) + countBombsSurroundingSquare(h, w) !== numSquaresSurroundingSquare(h, w)) {
                console.log(`open: ${h} ${w}`);
                const list = findListOfClosedSquaresSurroundingSquare(h, w);
                console.log('list:', list);
                for (let index = 0; index < list.length; index++) {
                    const el = list[index];
                    game.open(el);
                }
            }
        }
    }
};

const runTouchingSquaresMatchesNumber = async () => {
    for (let h = 1; h <= level.height; h++) {
        for (let w = 1; w <= level.width; w++) {
            if (isOpen(h, w) &&
                findOpenSquaresSurroundingSquare(h, w) === numSquaresSurroundingSquare(h, w)-toNumber(board[h][w]) &&
                findOpenSquaresSurroundingSquare(h, w) + countBombsSurroundingSquare(h, w) !== numSquaresSurroundingSquare(h, w)) {
                console.log(`analyse: ${h} ${w}`);
                const list = findListOfClosedSquaresSurroundingSquare(h, w);
                console.log('list:', list);
                for (let index = 0; index < list.length; index++) {
                    const el = list[index];
                    if (board[el.hCoor][el.wCoor] !== BOMB) {
                        board[el.hCoor][el.wCoor] = BOMB;
                        game.markAsBomb(el);
                    }
                }
            }
        }
    }
};

export const initiate = async (game1: Minesweeper, level1: Level): Promise<void> => {
    game = game1;
    level = level1;
    await game.initiate(level);

    for (let h = 1; h <= level.height; h++) {
        board[h] = [];
        for (let w = 1; w <= level.width; w++) {
            board[h][w] = BLANK;
        }
    }
}

export const print = () => {
    printBoard();
}

export const start = async () => {
    await game.open(level.middlePoint);
    board = await game.board();
    printBoard();
}

export const next = async () => {
    await runTouchingSquaresMatchesNumber();
    await open();
    board = await game.board();
}

export const solve = async (): Promise<void> => {
    await start();

    while (!game.hasFinished()) {
        await next();
    }
}