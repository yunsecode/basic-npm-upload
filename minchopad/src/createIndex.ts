import * as fs from 'fs';
import { readFile } from 'fs/promises';

const path = require('path');

interface MdHeaderData {
    [key: string]: string;
  }

  async function getAllMdFileNames(directoryPath: string): Promise<{ filenames: string[], dates: Date[] }> {
    try {
      let filteredFiles: string[] = [];
      let filteredFilesDate: Date[] = [];
      const files = fs.readdirSync(directoryPath);

      for (const file of files) {
        if (file.slice(-3) === ".md" || file.slice(-9) === ".markdown") {
          try {
            const stats = await fs.promises.stat(directoryPath + "/" + file);
            filteredFiles.push(file);
            filteredFilesDate.push(stats.birthtime);
          } catch (err) {
            console.error("Error reading file stats:", err);
          }
        }
      }

      return { filenames: filteredFiles, dates: filteredFilesDate };
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }



function getMdFileHeaderData(dividerIndexes: number[], fileContext: string[], filterKeys: string[]): MdHeaderData
{
    const result: MdHeaderData = {};

    for (let i = 0; i < dividerIndexes[1]; i++) {
        const [key, value] = fileContext[i].split(":").map((item) => item.trim());

        if (filterKeys.includes(key)) {
            result[key] = value;
        }
    }
    return result;
}


// TODO: 여기는 어떻게? 에러면그냥 pass 아님 다 멈추게?
function createIndexErrorHandling(dividerIndexes: number[]): boolean
{
    if (dividerIndexes[0] != 0) {
        return true;
    }

    if (dividerIndexes.length < 2) {
        return true;
    }
    return false;
}

function getDividerIndexes(fileData: string[]): number[]
{
    let dividerIndexes: number[] = [];

	for (let i = 0; i < fileData.length; i++) {
		if (fileData[i] == "---" || fileData[i] == "---\n" || fileData[i] == "---\r\n") {
            dividerIndexes.push(i);
            if (dividerIndexes.length == 2) {
                return dividerIndexes;
            }
		}
	}
	return dividerIndexes;
}

async function readMd(filePath: string): Promise<string[]>
{
    // const filePath = path.join(process.cwd(), directoryPath, filename);
    // console.log("aaa", filePath);

    try {
        const data = await readFile(filePath, 'utf-8');

        if (data.includes('\r\n')) { // CRLF
            return data.split('\r\n');
        } else if (data.includes('\n')) { // LF
            return data.split('\n');
        } else {
            return [];
        }
    } catch (err) {
        throw new Error((err as Error).message);
    }
}

async function findAllFiles(all: MdHeaderData[], filterKeys: string[] = [], filePath: string)
{
    // const mdFileNames = await getAllMdFileNames(directoryPath);
    // let index = 0;

    // for (const mdFileName of mdFileNames.filenames) {
        const fileContext = await readMd(filePath)
        const dividerIndexes = getDividerIndexes(fileContext);

        if (createIndexErrorHandling(dividerIndexes)) {
            console.log("err");

            return;
        }
        const result = getMdFileHeaderData(dividerIndexes, fileContext, filterKeys);
        const directoryPath = path.dirname(filePath);

        result["category"] = directoryPath;
        // index++;
        console.log("push");

        all.push(result)

    // }
}

async function findAllDirectories(all: MdHeaderData[], filterKeys: string[] = [], directoryPath: string, resultPath: string, descending_order: boolean = true) {
    try {
      const files = await fs.promises.readdir(directoryPath);

      for (const file of files) {
        const fullPath = path.join(directoryPath, file);
        const stats = await fs.promises.stat(fullPath);

        if (stats.isDirectory()) {
          console.log(`${fullPath} is directory`);
          await findAllDirectories(all, filterKeys, fullPath, resultPath, descending_order);
        } else {
          console.log(`${fullPath} is file`);
          await findAllFiles(all, filterKeys, fullPath);
        }
      }
    } catch (err) {
      console.error('디렉토리를 읽어오는 중 에러가 발생했습니다.', err);
    }
  }

  async function createIndex(filterKeys: string[] = [], directoryPath: string, resultPath: string, descending_order: boolean = true) {
    try {
      const all: MdHeaderData[] = [];
      await findAllDirectories(all, filterKeys, directoryPath, resultPath, descending_order);

      await fs.promises.writeFile(resultPath, JSON.stringify(all));
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

export { createIndex };
