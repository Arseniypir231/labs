const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

/**
 * Читает JSON файл с обработкой ошибок
 */
async function readJsonFile(filename) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Error reading file ${filename}: ${error.message}`);
    }
}

/**
 * Записывает данные в JSON файл
 */
async function writeJsonFile(filename, data) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        throw new Error(`Error writing file ${filename}: ${error.message}`);
    }
}

/**
 * Проверяет существование файла
 */
async function fileExists(filename) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

module.exports = {
    readJsonFile,
    writeJsonFile,
    fileExists,
    DATA_DIR
};
