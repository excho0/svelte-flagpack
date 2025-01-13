import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

interface Country {
  alpha2: string;
  alpha3: string;
  numeric: string;
  // Add other properties if necessary
}

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const countryCodeListPath = path.resolve(__dirname, '../node_modules/flagpack-core/countryCodeList.json');
const sourceDirPrefix = path.resolve(__dirname, '../node_modules/flagpack-core/svg');
const distDir = path.resolve(__dirname, '../dist/flags');

const readCountryCodeList = async (): Promise<Country[]> => {
  try {
    const data = await fs.readFile(countryCodeListPath, 'utf-8');
    return JSON.parse(data) as Country[];
  } catch (error) {
    console.error(`Error reading countryCodeList.json:`, error);
    throw error;
  }
};

const createCountryObject = (countryCodeList: Country[]): Record<string, Country> => {
  const countryObject: Record<string, Country> = {};
  countryCodeList.forEach((country) => {
    countryObject[country.alpha2] = country;
  });
  return countryObject;
};

const sizes: string[] = ['s', 'm', 'l'];

const createDist = async (): Promise<void> => {
  await createFlagsDirectory();
  await createSizeDirectories();
};

const createFlagsDirectory = async (): Promise<void> => {
  try {
    await fs.mkdir(distDir, { recursive: true });
    console.log(`Created directory: ${distDir}`);
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      console.error(`Error creating directory ${distDir}:`, error);
      throw error;
    }
  }
};

const createSizeDirectories = async (): Promise<void> => {
  for (const size of sizes) {
    const sizeDir = path.join(distDir, size);
    try {
      await fs.mkdir(sizeDir, { recursive: true });
      console.log(`Created directory: ${sizeDir}`);
    } catch (error) {
      console.error(`Error creating directory ${sizeDir}:`, error);
      throw error;
    }
  }
};

const copyFlags = async (countryObject: Record<string, Country>): Promise<void> => {
  for (const size of sizes) {
    const sourceSizeDir = path.join(sourceDirPrefix, size);
    try {
      const files = await fs.readdir(sourceSizeDir);

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
        const values = [alpha2, alpha3, numeric].filter((v): v is string => v !== undefined);

        console.log(
          `Flag for ${fileNameBase}: alpha2: ${alpha2} ${alpha3 ? `| alpha3: ${alpha3}` : ''} ${
            numeric ? `| numeric: ${numeric}` : ''
          }`
        );

        for (const value of values) {
          const srcPath = path.join(sourceSizeDir, fileName);
          const destPath = path.join(distDir, size, `${value}${suffix}`);

          try {
            await fs.copyFile(srcPath, destPath);
            console.log(`Copied ${srcPath} to ${destPath}`);
          } catch (error) {
            console.error(`Error copying file from ${srcPath} to ${destPath}:`, error);
            throw error;
          }
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${sourceSizeDir}:`, error);
      throw error;
    }
  }
};

const main = async (): Promise<void> => {
  try {
    const countryCodeList = await readCountryCodeList();
    const countryObject = createCountryObject(countryCodeList);

    await createDist();
    await copyFlags(countryObject);

    console.log('Flag generation completed successfully.');
  } catch (error) {
    console.error('Flag generation failed:', error);
    process.exit(1);
  }
};

main();
