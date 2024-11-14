const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function cloneRepository(repoUrl, cloneDir, commitHash) {
    if (fs.existsSync(cloneDir)) {
        console.log(`Directory ${cloneDir} already exists. Exiting...`);
        return false;
    }
    execSync(`git clone ${repoUrl} ${cloneDir}`, { stdio: 'inherit' });
    execSync(`git -C ${cloneDir} checkout ${commitHash}`, { stdio: 'inherit' });
    return true;
}

function replaceInFile(filePath, searchValue, replaceValue) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes(searchValue)) {
        const newContent = content.replace(new RegExp(searchValue, 'g'), replaceValue);
        fs.writeFileSync(filePath, newContent, 'utf8');
    }
}

function traverseAndReplace(dir, searchValue, replaceValue) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);

        if (fs.statSync(fullPath).isDirectory()) {
            if (!file.startsWith('.git')) {
                traverseAndReplace(fullPath, searchValue, replaceValue);
            }
        } else if (
            !file.endsWith('.jpeg') && 
            !file.endsWith('.jpg') && 
            !file.endsWith('.png') && 
            !file.endsWith('.icns') && 
            !file.endsWith('.ico') &&
            !file.endsWith('.r') &&
            !file.startsWith('.git')
        ) {
            replaceInFile(fullPath, 'Firestorm', 'qikfox3D');

            if (file.endsWith('.cpp') || file.endsWith('.xml')) {
                replaceInFile(fullPath, 'http://phoenixviewer.com/app/loginV3/', 'https://qikfox.com/3d-browser/');
                replaceInFile(fullPath, 'https://phoenixviewer.com/app/loginV3/', 'https://qikfox.com/3d-browser/');
            }
        }
    });
}

function renamePlistFile(directory) {
    const plistOldPath = path.join(directory, 'indra', 'newview', 'Info-Firestorm.plist');
    const plistNewPath = path.join(directory, 'indra', 'newview', 'Info-qikfox3D.plist');
    if (fs.existsSync(plistOldPath)) {
        fs.renameSync(plistOldPath, plistNewPath);
        console.log(`Renamed ${plistOldPath} to ${plistNewPath}`);
    } else {
        console.log(`File ${plistOldPath} does not exist.`);
    }
}

function copyNibFile(srcFile, destDir) {
    const destFile = path.join(destDir, 'qikfox3D.nib');
    if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, destFile);
        console.log(`Copied ${srcFile} to ${destFile}`);
    } else {
        console.log(`File ${srcFile} does not exist.`);
    }
}

function replaceIcnsFiles(dir, srcFile) { 
    const files = fs.readdirSync(dir, { withFileTypes: true }); 
    files.forEach(file => {
        const fullPath = path.join(dir, file.name); 
        if (file.isFile() && file.name.endsWith('.icns')) { 
            fs.copyFileSync(srcFile, fullPath);
        } else if (file.isDirectory() && !file.name.startsWith('.git')) {
            replaceIcnsFiles(fullPath, srcFile); 
        }
    });
}

function replacePngFile(filePath, srcFile) {
    if (fs.existsSync(filePath)) {
        fs.copyFileSync(srcFile, filePath); 
    } else {
        console.log(`File ${filePath} does not exist.`);
    }
}

function replaceBackgroundPng(dir, srcFile) { 
    const files = fs.readdirSync(dir, { withFileTypes: true }); 
    files.forEach(file => { const fullPath = path.join(dir, file.name); 
        if (file.isFile() && file.name === 'background.png') { 
            fs.copyFileSync(srcFile, fullPath); 
        } else if (file.isDirectory() && !file.name.startsWith('.git')) { 
            replaceBackgroundPng(fullPath, srcFile); 
        } 
    });
}

function main() {
    const repoUrl = 'https://github.com/FirestormViewer/phoenix-firestorm.git';
    const cloneDir = 'qikfox3D-viewer';
    const commitHash = '8926db526118de57aaa1288bd99f54397aa0d331';
    const nibFile = path.join(process.cwd(), 'qikfox3D-resources', 'qikfox3D.nib');
    const iconFile = path.join(process.cwd(), 'qikfox3D-resources', 'qikfox3D_icon.icns');
    const pngFile = path.join(process.cwd(), 'qikfox3D-resources', 'qikfox3D.png');
    const targetPngFile = path.join(cloneDir, 'indra', 'newview', 'skins', 'default', 'textures', 'windows', 'login_fs_logo.png');
    const installerDir = path.join(cloneDir, 'indra', 'newview', 'installers');
    const backgroundPng = path.join(process.cwd(), 'qikfox3D-resources', 'background.png');
    
    var success = cloneRepository(repoUrl, cloneDir, commitHash);
    if(success === true) {
        traverseAndReplace(cloneDir, 'Firestorm', 'qikfox3D');
        renamePlistFile(cloneDir);
        copyNibFile(nibFile, path.join(cloneDir, 'indra', 'newview'));
        replaceIcnsFiles(cloneDir, iconFile);
        replacePngFile(targetPngFile, pngFile);
        replaceBackgroundPng(installerDir, backgroundPng);
    }
}

main();
