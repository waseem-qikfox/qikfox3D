// const { execSync } = require('child_process');
// const fs = require('fs');
// const path = require('path');
// const { DOMParser, XMLSerializer } = require('xmldom');

// function cloneRepository(repoUrl, cloneDir) {
//     if (fs.existsSync(cloneDir)) {
//         console.log(`Directory ${cloneDir} already exists. Deleting...`);
//         fs.rmdirSync(cloneDir, { recursive: true });
//     }
//     execSync(`git clone ${repoUrl} ${cloneDir}`, { stdio: 'inherit' });
// }

// function replaceText(nodeValue) {
//     return nodeValue
//         .replace(/firestorm/gi, 'qikfox3D');
// }

// function modifyXml(filePath) {
//     let data = fs.readFileSync(filePath, 'utf-8');
//     data = replaceText(data); // Replace all instances in the raw string

//     const doc = new DOMParser().parseFromString(data, 'application/xml');

//     function traverseAndModify(node) {
//         if (node.nodeType === 3 || node.nodeType === 8) { // Text node or Comment node
//             node.nodeValue = replaceText(node.nodeValue);
//         }
//         if (node.attributes) {
//             for (let i = 0; i < node.attributes.length; i++) {
//                 let attr = node.attributes[i];
//                 attr.value = replaceText(attr.value);
//             }
//         }
//         for (let child = node.firstChild; child; child = child.nextSibling) {
//             traverseAndModify(child);
//         }
//     }

//     traverseAndModify(doc);

//     const serializer = new XMLSerializer();
//     const xmlString = serializer.serializeToString(doc);
//     fs.writeFileSync(filePath, xmlString);
// }

// function modifyFilesInDirectory(directory) {
//     fs.readdirSync(directory).forEach(file => {
//         const filePath = path.join(directory, file);
//         if (fs.statSync(filePath).isDirectory()) {
//             modifyFilesInDirectory(filePath);
//         } else if (filePath.endsWith('.xml') || filePath.endsWith('.xib')) {
//             modifyXml(filePath);
//         }
//     });
// }

// function renameScript(directory) {
//     const oldPath = path.join(directory, 'scripts', 'configure_firestorm.sh');
//     const newPath = path.join(directory, 'scripts', 'configure_qikfox3D.sh');

//     if (fs.existsSync(oldPath)) {
//         fs.renameSync(oldPath, newPath);
//         console.log(`Renamed ${oldPath} to ${newPath}`);
//     } else {
//         console.log(`File ${oldPath} does not exist.`);
//     }
// }

// function main() {
//     const repoUrl = 'https://github.com/qikfox3DViewer/phoenix-firestorm.git';
//     const cloneDir = 'qikfox3D-viewer';
//     cloneRepository(repoUrl, cloneDir);
//     modifyFilesInDirectory(cloneDir);
//     renameScript(cloneDir);
// }

// main();


const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function cloneRepository(repoUrl, cloneDir) {
    if (fs.existsSync(cloneDir)) {
        console.log(`Directory ${cloneDir} already exists. Deleting...`);
        fs.rmdirSync(cloneDir, { recursive: true });
    }
    execSync(`git clone ${repoUrl} ${cloneDir}`, { stdio: 'inherit' });
}

function main() {
    const repoUrl = 'https://github.com/qikfox3DViewer/phoenix-firestorm.git';
    const cloneDir = 'qikfox3D-viewer';
    cloneRepository(repoUrl, cloneDir);
}

main();
