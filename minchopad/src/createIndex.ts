import * as fs from 'fs';
import { readFile } from 'fs/promises';

const path = require('path');

interface MdHeaderData {
    [key: string]: string;
  }

async function getAllMdFileNames(directoryPath: string): Promise<string[]>
{
    try {
        const filteredFiles: string[] = [];
        const files = fs.readdirSync(directoryPath);

        for (const file of files) {
            if (file.slice(-3) == ".md" || file.slice(-9) == ".markdown") {
                filteredFiles.push(file)
            }
        }
        return filteredFiles;
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

async function readMd(filename: string, directoryPath: string): Promise<string[]>
{
    const filePath = path.join(process.cwd(), directoryPath, filename);

    try {
        const data = await readFile(filePath, 'utf-8');

        if (data.includes('\r\n')) { // CRLF
            return data.split('\r\n');
        } else if (data.includes('\n')) { // LF
            return data.split('\n');
        } else {
            throw new Error("not a lf / crlf format");
        }
    } catch (err) {
        throw new Error((err as Error).message);
    }
}

async function createIndex(filterKeys: string[] = [], directoryPath: string, resultPath: string)
{
    try {
        const all: MdHeaderData[] = [];
        const mdFileNames = await getAllMdFileNames(directoryPath);

        for (const mdFileName of mdFileNames) {
            const fileContext = await readMd(mdFileName, directoryPath)
            const dividerIndexes = getDividerIndexes(fileContext);

            if (createIndexErrorHandling(dividerIndexes)) {
                continue;
            }
            const result = getMdFileHeaderData(dividerIndexes, fileContext, filterKeys);
            all.push(result)

        }
        fs.promises.writeFile(resultPath, JSON.stringify(all));
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export { createIndex };
