import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function mergeSubDirectory(folderPath, mergedData) {
    const items = fs.readdirSync(folderPath);
    items.forEach(item => {
        const itemPath = path.join(folderPath, item);
        if (fs.statSync(itemPath).isDirectory()) {
            mergeSubDirectory(itemPath, mergedData);
        } else if (item.endsWith('.json')) {
            const fileContent = JSON.parse(fs.readFileSync(itemPath, 'utf-8'));
            Object.assign(mergedData, fileContent);
        }
    });
}

function mergeJsonFiles() {
    const i18nGlobalFolder = path.join(__dirname, 'src/assets/i18n/global');
    const langDirectories = fs.readdirSync(i18nGlobalFolder);
    langDirectories.forEach(subDir => {
        const mergedData = {};
        const subDirPath = path.join(i18nGlobalFolder, subDir);
        if (fs.statSync(subDirPath).isDirectory() && subDir !== 'combined') {
            mergeSubDirectory(subDirPath, mergedData);
            var outputDir = path.join(i18nGlobalFolder, 'combined');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            const outputFilePath = path.join(outputDir, `${subDir}.json`);
            fs.writeFileSync(outputFilePath, JSON.stringify(mergedData, null, 2), 'utf-8');
        }
    });

    console.log("compiled completed: ", i18nGlobalFolder);
    const i18nModuleFolder = path.join(__dirname, 'src/assets/i18n/module');
    const moduleDirectories = fs.readdirSync(i18nModuleFolder);
    moduleDirectories.forEach(subModuleDir => {
        const subDirPath = path.join(i18nModuleFolder, subModuleDir);
        if (fs.statSync(subDirPath).isDirectory() && subModuleDir !== 'combined') {
            const langDirectories = fs.readdirSync(subDirPath);
            langDirectories.forEach(lang => {
                const outputDir = path.join(subDirPath, 'combined');
                const subLangDirPath = path.join(subDirPath, lang);
                if (fs.statSync(subLangDirPath).isDirectory() && lang !== 'combined') {
                    const mergedData = {};
                    mergeSubDirectory(subLangDirPath, mergedData);
                    if (!fs.existsSync(outputDir)) {
                        fs.mkdirSync(outputDir, { recursive: true });
                    }
                    const outputFilePath = path.join(outputDir, `${lang}.json`);
                    fs.writeFileSync(outputFilePath, JSON.stringify(mergedData, null, 2), 'utf-8');
                }
            });
        }
    });
    console.log("compiled completed: ", i18nModuleFolder);
}
mergeJsonFiles();
