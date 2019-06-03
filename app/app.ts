import {chrome} from './chrome';
import {local} from './local';
import {Minesweeper, Level, BeginnerLevel, IntermediateLevel, ExpertLevel, CustomLevel} from './minesweeper';
import * as solver from './solver';
import * as prompt from './prompt';

const determineLevel = (): Level => {
    if (process.argv.includes('--beginner')) {
        return BeginnerLevel;
    } else if (process.argv.includes('--intermediate')) {
        return IntermediateLevel;
    } else if (process.argv.includes('--expert')) {
        return ExpertLevel;
    } else if (process.argv.includes('--custom')) {
        return CustomLevel;
    } else {
        console.warn('No level specified so defaulting to beginner');
        return BeginnerLevel;
    }
}

const determineInterface = (): Minesweeper => {
    if (process.argv.includes('--chrome')) {
        return chrome;
    } else if (process.argv.includes('--local')) {
        return local;
    } else {
        // should not default so prompt works better
        console.warn('No interface specified so defaulting to chrome');
        return chrome;
    }
}

(async () => {
    if (process.argv.length === 2) {
        throw 'Expected at least one argument!';
    }

    const game = determineInterface();
    const level = determineLevel();

    if (process.argv.includes('-i')) {
        await prompt.start(game, level);
    } else {
        await solver.initiate(game, level);
        await solver.solve();
    }

})();