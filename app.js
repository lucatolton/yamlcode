const yaml = require('yaml');
const fs = require('fs');

const file = fs.readFileSync('yamlcode.yml', 'utf8');
const { run } = yaml.parse(file);

let variables = [];
let tempvariables = [];

console.log('\n----- Starting -----');

run.forEach((item) => {
    console.log('');
    console.log(item);
    let toExec;
    let execData;
    if (typeof item === 'object') {
        for (let key in item) {
            toExec = key.replace(/ *\([^)]*\) */g, "");
            execData = item[key];
        }
    } else {
        toExec = item.replace(/ *\([^)]*\) */g, "");
        execData = item.replace( /(^.*\(|\).*$)/g, '' );
    }
    
    runCode(item, toExec, execData);
});

function runCode(item, toExec, execData) {
    switch (toExec) {
        case 'print':
            console.log('[LOG] ' + execData);
            break;
        case 'error':
            console.log('[ERROR] ' + execData);
            break;
        case 'store':
            let storeData = execData.split(', ');
            variables.push({
                name: storeData[0],
                value: storeData[1]
            });
            console.log('[STORE] Stored \'' + storeData[1] + '\' in variable \'' + storeData[0] + '\'');
            break;
        case 'get':
            let getData = execData.split(', ');
            let getValue = variables.find(item => item.name === getData[0]);
            console.log('[GET] Variable \'' + getData[0] + '\' is \'' + getValue.value + '\'');
            break;
        case 'if':
            for (let key in item) {
                let todo = key.slice(3).slice(0, -1);
                todo = todo.split(' ');
                let itemOne = variables.find(item => item.name === todo[0]);
                let itemTwo = variables.find(item => item.name === todo[1]);
                if (!itemOne || !itemTwo) {
                    console.log('[ERROR] Variable \'' + todo[0] + '\' or \'' + todo[1] + '\' does not exist');
                    break;
                }
                if (itemOne.value === itemTwo.value) {
                    toExec = item[key].replace(/ *\([^)]*\) */g, "");
                    execData = item[key].replace( /(^.*\(|\).*$)/g, '' );
                    runCode(item[key], toExec, execData);
                }
            }
            break;
        case 'ifnot':
            for (let key in item) {
                let todo = key.slice(6).slice(0, -1);
                todo = todo.split(' ');
                let itemOne = variables.find(item => item.name === todo[0]);
                let itemTwo = variables.find(item => item.name === todo[1]);
                if (!itemOne || !itemTwo) {
                    console.log('[ERROR] Variable \'' + todo[0] + '\' or \'' + todo[1] + '\' does not exist');
                    break;
                }
                if (itemOne.value !== itemTwo.value) {
                    toExec = item[key].replace(/ *\([^)]*\) */g, "");
                    execData = item[key].replace( /(^.*\(|\).*$)/g, '' );
                    runCode(item[key], toExec, execData);
                }
            }
            break;
        case 'exit':
            console.log('[EXIT] Exiting...');
            process.exit(1);
        default:
            console.log('[YAMLCODE] Invalid function \'' + toExec + '\'');
    }
}

console.log('\n----- Finished -----');
setTimeout(() => {
    process.exit(1);
}, 2500);