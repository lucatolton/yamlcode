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
    let toExec = item.replace(/ *\([^)]*\) */g, "");
    let execData = item.replace( /(^.*\(|\).*$)/g, '' );
    
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
        case 'exit':
            console.log('[EXIT] Exiting...');
            process.exit(1);
    }
});

console.log('\n----- Finished -----');
setTimeout(() => {
    process.exit(1);
}, 2500);