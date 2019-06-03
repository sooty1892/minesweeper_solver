import {Minesweeper, Square, Level} from './minesweeper'
import puppeteer, { Page, ElementHandle } from 'puppeteer';

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

const classMapping:{ [index:string] : string } = {
    'square open0': ZERO,
    'square open1': ONE,
    'square open2': TWO,
    'square open3': THREE,
    'square open4': FOUR,
    'square open5': FIVE,
    'square open6': SIX,
    'square open7': SEVEN,
    'square open8': EIGHT,
    'square blank': BLANK,
    'square bombflagged': BOMB
};

let currentLevel: Level;
let page: Page;
let finished: boolean = false;

const id = (hCoor: number, wCoor: number): string => {
    if (hCoor >= 10) {
        return `#\\31 ${hCoor-10}_${wCoor}`;
    } else {
        return `#\\3${hCoor}_${wCoor}`;
    }
}

const getElem = async (page: Page, hCoor: number, wCoor: number): Promise<ElementHandle> => {
    const elem = await page.$(id(hCoor, wCoor));
    if (elem) {
        return elem;
    }
    throw `Elem not found: h=${hCoor} w=${wCoor}`;
}

const checkFace = async (page: Page) => {
    const elem = await page.$('#face');
    if (elem) {
        const className = await (await elem.getProperty('className')).jsonValue();
        if (className === 'facedead') {
            throw "FACE IS DEAD :(";
        }
    } else {
        console.error('Not found');
    }
}

const markAsBomb = async (square: Square) => {
    const elem = await getElem(page, square.hCoor, square.wCoor);
    console.log('Bombing', square)
    await elem.click({button: 'right'});
};

const open = async (square: Square) => {
    const elem = await getElem(page, square.hCoor, square.wCoor);
    console.log('Opening', square)
    await elem.click();
}

const initiate = async (level: Level): Promise<void> => {
    //better way than this
    currentLevel = level;
    const browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    await page.setViewport({width: 1400, height: 800});
    await page.goto(level.url);
    await page.waitFor(id(1, 1));

    page.on('dialog', dialog => {
        console.log(dialog.message());
        finished = true;
    })
}

const board = async (): Promise<string[][]> => {
    console.log('Updating board');
    const board: string[][] = [];
    for (let h = 1; h <= currentLevel.height; h++) {
        board[h] = [];
        for (let w = 1; w <= currentLevel.width; w++) {
            const elem = await getElem(page, h, w);
            const className = await (await elem.getProperty('className')).jsonValue();
            const value = classMapping[className];
            if (!value) throw `Class value not found: ${className}`
            board[h][w] = value;
        }
    }
    return board;
}

const hasFinished = (): boolean => {
    return finished;
}

export const chrome: Minesweeper = {
    markAsBomb,
    open,
    initiate,
    board,
    hasFinished
}