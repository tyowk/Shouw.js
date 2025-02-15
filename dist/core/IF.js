'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.IF = IF;
const Interpreter_1 = require('./Interpreter');
async function IF(code, ctx) {
    if (!code.toLowerCase().includes('$if[')) return code;
    for (let statement of code.split(/\$if\[/gi).slice(1)) {
        const length = code.toLowerCase().split(/\$if\[/i).length - 1;
        if (!code.match(/\$endif/gi)) {
            console.log('Invalid $if usage: Missing $endif');
            return code;
        }
        const everything = code.split(/\$if\[/gi)[length].split(/\$endif/gi)[0];
        statement = code.split(/\$if\[/gi)[length].split(/\$endif/gi)[0];
        let condition = statement.split(/\n/)[0].trim();
        condition = condition.slice(0, condition.length - 1);
        const pass =
            (
                await new Interpreter_1.Interpreter(
                    {
                        code: `$checkCondition[${condition}]`,
                        name: 'if'
                    },
                    ctx
                ).initialize()
            ).result === 'true';
        const elseIfAction = statement.match(/\$elseif/i);
        const elseIfs = {};
        if (statement.match(/\$elseif/i)) {
            for (const data of statement.split(/\$elseif\[/gi).slice(1)) {
                if (!data.toLowerCase().includes('$endelseif')) {
                    console.log('Invalid $elseif usage: Missing $endelseif');
                    return code;
                }
                const inside = data.split(/\$endelseIf/gi)[0];
                let elseifCondition = inside.split(/\n/)[0].trim();
                elseifCondition = elseifCondition.slice(0, elseifCondition.length - 1);
                elseIfs[elseifCondition] = inside.split(/\n/).slice(1).join('\n');
                statement = statement.replace(new RegExp(`\\$elseif\\[${escapeRegExp(inside)}\\$endelseif`, 'mi'), '');
            }
        }
        const elseAction = statement.match(/\$else/i);
        const ifCode = elseAction
            ? statement
                  .split('\n')
                  .slice(1)
                  .join('\n')
                  .split(/\$else/gi)[0]
            : statement
                  .split('\n')
                  .slice(1)
                  .join('\n')
                  .split(/\$endif/gi)[0];
        const elseCode = elseAction ? statement.split(/\$else/gi)[1].split(/\$endif/gi)[0] : '';
        let passes = false;
        let lastCode = '';
        if (elseIfAction) {
            for (const data of Object.entries(elseIfs)) {
                if (!passes) {
                    const response =
                        (
                            await new Interpreter_1.Interpreter(
                                {
                                    code: `$checkCondition[${data[0]}]`,
                                    name: 'if'
                                },
                                ctx
                            ).initialize()
                        ).result === 'true';
                    if (response) {
                        passes = true;
                        lastCode = data[1];
                    }
                }
            }
        }
        code = code.replace(/\$if\[/gi, '$if[').replace(/\$endif/gi, '$endif');
        code = code.replace(`$if[${everything}$endif`, pass ? ifCode : passes ? lastCode : elseCode);
    }
    return code;
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\\n]/g, '\\$&');
}
