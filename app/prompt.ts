import prompts from 'prompts';
import {Minesweeper, Level} from './minesweeper';
import * as solver from './solver';

export const start = async (game: Minesweeper, level: Level) => {
    console.log('Starting in interactive mode');
    await solver.initiate(game, level);
    solver.print();
    await solver.start();
    while (true) {
        const func = (await prompts({
            type: 'text',
            name: 'function',
            message: 'n, p, x'
        })).function;
        if (func === 'n') {
            await solver.next();
        }
        if (func === 'p') {
            solver.print();
        }
        if (func === 'x') {
            process.exit();
        }
    }
}