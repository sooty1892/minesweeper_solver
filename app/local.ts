import {Minesweeper, Square, Level} from './minesweeper'

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

let currentLevel: Level;
let finished: boolean = false;
let currentBoard: string[][] = [];
// maybe index from 0??? :)
const actualBoard = [
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
    [' ','X','X','X','X','X','X','X','X','X'],
    [' ','X','4','3','3','3','3','3','3','2'],
    [' ','0','0','0','0','0','0','0','0','0'],
    [' ','0','0','0','0','0','0','0','0','0'],
    [' ','0','0','0','0','0','0','0','0','0'],
    [' ','0','0','0','0','0','0','0','0','0'],
    [' ','0','0','0','0','0','0','0','0','0'],
    [' ','0','0','0','0','0','0','0','0','0'],
    [' ','0','0','0','0','0','0','0','0','0'],
]

const initiate = async (level: Level): Promise<void> => {
    console.log('Initiating local')
    //better way than this
    currentLevel = level;
    console.log(`height=${level.height} width=${level.width}`)
    for (let h = 1; h <= level.height; h++) {
        currentBoard[h] = [];
        for (let w = 1; w <= level.width; w++) {
            currentBoard[h][w] = BLANK;
        }
    }
}

const markAsBomb = async (square: Square) => {
    currentBoard[square.hCoor][square.wCoor] = BOMB;
};

const isValid = (hCoor: number, wCoor: number): boolean => {
    return hCoor >= 1 && hCoor <= currentLevel.height && wCoor >= 1 && wCoor <= currentLevel.width;
};

const surroundNotOpened = (square: Square) => {
    console.log('surroundNotOpened square=', square);
    let surroundOpened = true;
    if (isValid(square.hCoor, square.wCoor+1) && currentBoard[square.hCoor][square.wCoor+1] === BLANK) surroundOpened = false;
    if (isValid(square.hCoor, square.wCoor-1) && currentBoard[square.hCoor][square.wCoor-1] === BLANK) surroundOpened = false;
    if (isValid(square.hCoor+1, square.wCoor) && currentBoard[square.hCoor+1][square.wCoor] === BLANK) surroundOpened = false;
    if (isValid(square.hCoor-1, square.wCoor) && currentBoard[square.hCoor-1][square.wCoor] === BLANK) surroundOpened = false;
    if (isValid(square.hCoor+1, square.wCoor-1) && currentBoard[square.hCoor+1][square.wCoor-1] === BLANK) surroundOpened = false;
    if (isValid(square.hCoor-1, square.wCoor+1) && currentBoard[square.hCoor-1][square.wCoor+1] === BLANK) surroundOpened = false;
    if (isValid(square.hCoor+1, square.wCoor+1) && currentBoard[square.hCoor+1][square.wCoor+1] === BLANK) surroundOpened = false;
    if (isValid(square.hCoor-1, square.wCoor-1) && currentBoard[square.hCoor-1][square.wCoor-1] === BLANK) surroundOpened = false;
    return !surroundOpened;
}

const findOpenedZeroAndSurroundNotOpened = (): Square | undefined => {
    for (let h = 1; h <= currentLevel.height; h++) {
        for (let w = 1; w <= currentLevel.width; w++) {
            if (currentBoard[h][w] === ZERO && surroundNotOpened({
                hCoor: h,
                wCoor: w
            })) {
                return {
                    hCoor: h,
                    wCoor: w
                }
            }
        }
    }
    return undefined;
}

const openAllSquaresAround = (square: Square) => {
    if (isValid(square.hCoor, square.wCoor+1)) currentBoard[square.hCoor][square.wCoor+1] = actualBoard[square.hCoor][square.wCoor+1];
    if (isValid(square.hCoor, square.wCoor-1)) currentBoard[square.hCoor][square.wCoor-1] = actualBoard[square.hCoor][square.wCoor-1];
    if (isValid(square.hCoor+1, square.wCoor)) {
        console.log(`currentBoard[${square.hCoor+1}]=${currentBoard[square.hCoor+1]}`);
        console.log(`currentBoard[${square.hCoor+1}][${square.wCoor}]=${currentBoard[square.hCoor+1][square.wCoor]}`);
        console.log(`actualBoard[${square.hCoor+1}]=${actualBoard[square.hCoor+1]}`);
        console.log(`actualBoard[${square.hCoor+1}][${square.wCoor}]=${actualBoard[square.hCoor+1][square.wCoor]}`);
        currentBoard[square.hCoor+1][square.wCoor] = actualBoard[square.hCoor+1][square.wCoor];
    }
    if (isValid(square.hCoor-1, square.wCoor)) currentBoard[square.hCoor-1][square.wCoor] = actualBoard[square.hCoor-1][square.wCoor];
    if (isValid(square.hCoor+1, square.wCoor-1)) currentBoard[square.hCoor+1][square.wCoor-1] = actualBoard[square.hCoor+1][square.wCoor-1];
    if (isValid(square.hCoor-1, square.wCoor+1)) currentBoard[square.hCoor-1][square.wCoor+1] = actualBoard[square.hCoor-1][square.wCoor+1];
    if (isValid(square.hCoor+1, square.wCoor+1)) currentBoard[square.hCoor+1][square.wCoor+1] = actualBoard[square.hCoor+1][square.wCoor+1];
    if (isValid(square.hCoor-1, square.wCoor-1)) currentBoard[square.hCoor-1][square.wCoor-1] = actualBoard[square.hCoor-1][square.wCoor-1];
}

const open0s = () => {
    let anyChanged = true;
    while (anyChanged) {
        const zeroSquare = findOpenedZeroAndSurroundNotOpened();
        if (zeroSquare) {
            openAllSquaresAround(zeroSquare);
        } else {
            anyChanged = false;
        }
    }
}

const open = async (square: Square) => {
    currentBoard[square.hCoor][square.wCoor] = actualBoard[square.hCoor][square.wCoor];
    open0s();
}

const board = async (): Promise<string[][]> => {
    return currentBoard;
}

const hasFinished = (): boolean => {
    return finished;
}

export const local: Minesweeper =  {
    initiate,
    open,
    markAsBomb,
    board,
    hasFinished
}