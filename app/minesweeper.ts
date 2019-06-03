export interface Minesweeper {
    initiate(level: Level): void;
    markAsBomb(square: Square): void;
    open(square: Square): void;
    board(): Promise<string[][]>;
    hasFinished(): boolean;
}

export interface Square {
    hCoor: number;
    wCoor: number;
}

export interface Level {
    url: string;
    height: number;
    width: number;
    middlePoint: Square;
    numberOfMines: number;
}

export const CustomLevel: Level = {
    url: 'http://google.com',
    height: 2,
    width: 5,
    middlePoint: {hCoor: 2, wCoor: 1},
    numberOfMines: 1
}

export const BeginnerLevel: Level = {
    url: 'http://minesweeperonline.com/#beginner-200',
    height: 9,
    width: 9,
    middlePoint: {hCoor: 5, wCoor: 5},
    numberOfMines: 10
}

export const IntermediateLevel: Level = {
    url: 'http://minesweeperonline.com/#intermediate-200',
    height: 16,
    width: 16,
    middlePoint: {hCoor: 8, wCoor: 8},
    numberOfMines: 40
}

export const ExpertLevel: Level = {
    url: 'http://minesweeperonline.com/#200',
    height: 16,
    width: 30,
    middlePoint: {hCoor: 8, wCoor: 15},
    numberOfMines: 99
}