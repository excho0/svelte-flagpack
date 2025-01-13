var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const countryCodeListPath = path.resolve(__dirname, '../node_modules/flagpack-core/countryCodeList.json');
const sourceDirPrefix = path.resolve(__dirname, '../node_modules/flagpack-core/svg');
const distDir = path.resolve(__dirname, '../dist/flags');
const readCountryCodeList = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fs.readFile(countryCodeListPath, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error(`Error reading countryCodeList.json:`, error);
        throw error;
    }
});
const createCountryObject = (countryCodeList) => {
    const countryObject = {};
    countryCodeList.forEach((country) => {
        countryObject[country.alpha2] = country;
    });
    return countryObject;
};
const sizes = ['s', 'm', 'l'];
const createDist = () => __awaiter(void 0, void 0, void 0, function* () {
    yield createFlagsDirectory();
    yield createSizeDirectories();
});
const createFlagsDirectory = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs.mkdir(distDir, { recursive: true });
        console.log(`Created directory: ${distDir}`);
    }
    catch (error) {
        if (error.code !== 'EEXIST') {
            console.error(`Error creating directory ${distDir}:`, error);
            throw error;
        }
    }
});
const createSizeDirectories = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const size of sizes) {
        const sizeDir = path.join(distDir, size);
        try {
            yield fs.mkdir(sizeDir, { recursive: true });
            console.log(`Created directory: ${sizeDir}`);
        }
        catch (error) {
            console.error(`Error creating directory ${sizeDir}:`, error);
            throw error;
        }
    }
});
const copyFlags = (countryObject) => __awaiter(void 0, void 0, void 0, function* () {
    for (const size of sizes) {
        const sourceSizeDir = path.join(sourceDirPrefix, size);
        try {
            const files = yield fs.readdir(sourceSizeDir);
            for (const file of files) {
                const fileName = file;
                const fileNameBase = path.parse(fileName).name;
                const suffix = '.svg';
                const country = countryObject[fileNameBase];
                if (!country) {
                    console.warn(`No country data found for file: ${fileNameBase}. Skipping.`);
                    continue;
                }
                const { alpha2, alpha3, numeric } = country;
                const values = [alpha2, alpha3, numeric].filter((v) => v !== undefined);
                console.log(`Flag for ${fileNameBase}: alpha2: ${alpha2} ${alpha3 ? `| alpha3: ${alpha3}` : ''} ${numeric ? `| numeric: ${numeric}` : ''}`);
                for (const value of values) {
                    const srcPath = path.join(sourceSizeDir, fileName);
                    const destPath = path.join(distDir, size, `${value}${suffix}`);
                    try {
                        yield fs.copyFile(srcPath, destPath);
                        console.log(`Copied ${srcPath} to ${destPath}`);
                    }
                    catch (error) {
                        console.error(`Error copying file from ${srcPath} to ${destPath}:`, error);
                        throw error;
                    }
                }
            }
        }
        catch (error) {
            console.error(`Error reading directory ${sourceSizeDir}:`, error);
            throw error;
        }
    }
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countryCodeList = yield readCountryCodeList();
        const countryObject = createCountryObject(countryCodeList);
        yield createDist();
        yield copyFlags(countryObject);
        console.log('Flag generation completed successfully.');
    }
    catch (error) {
        console.error('Flag generation failed:', error);
        process.exit(1);
    }
});
main();
