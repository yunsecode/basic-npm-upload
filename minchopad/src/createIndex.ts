import * as fs from 'fs';
import { readFile } from 'fs/promises';

const path = require('path');

interface MdHeaderData {
    [key: string]: string;
}

function getMdFileHeaderData(dividerIndexes: number[], fileContext: string[], filterKeys: string[]): MdHeaderData
{
    const result: MdHeaderData = {};

    for (let i = 0; i < dividerIndexes[1]; i++) {
        const colonIndex = fileContext[i].indexOf(":");
        const key = fileContext[i].slice(0, colonIndex).trim();
        const value = fileContext[i].slice(colonIndex + 1).trim();

        if (filterKeys.includes(key)) {
            result[key] = value;
        }
    }
    return result;
}

function createIndexErrorHandling(dividerIndexes: number[]): boolean
{
    if (dividerIndexes[0] != 0)
        return true;
    if (dividerIndexes.length < 2)
        return true;
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

async function readMdFile(filePath: string): Promise<string[]>
{
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

async function getFileData(all: MdHeaderData[], filterKeys: string[] = [], filePath: string)
{
    const fileContext = await readMdFile(filePath)
    const dividerIndexes = getDividerIndexes(fileContext);

    if (createIndexErrorHandling(dividerIndexes)) {
        return;
    }
    const result = getMdFileHeaderData(dividerIndexes, fileContext, filterKeys);
    const directoryPath = path.dirname(filePath);

    result["category"] = directoryPath;
    all.push(result)
}

async function findAllDirectories(all: MdHeaderData[], filterKeys: string[] = [], directoryPath: string) {
    try {
        const files = await fs.promises.readdir(directoryPath);

        for (const file of files) {
            const fullPath = path.join(directoryPath, file);
            const stats = await fs.promises.stat(fullPath);

            if (stats.isDirectory()) {
                await findAllDirectories(all, filterKeys, fullPath);
            } else if (file.slice(-3) === ".md" || file.slice(-9) === ".markdown") {
                await getFileData(all, filterKeys, fullPath);
            }
        }
    } catch (err) {
        console.log("here");

        throw new Error((err as Error).message);
    }
}

async function writingIndexingInFile(all: MdHeaderData[], resultPath: string, descending_order: boolean)
{
    try {
        if (descending_order) {
            all.sort((a, b) => b.date.localeCompare(a.date));
        } else {
            all.sort((a, b) => a.date.localeCompare(b.date));
        }
        await fs.promises.writeFile(resultPath, JSON.stringify(all))
    } catch (err) {
        throw new Error((err as Error).message);
    }
}

async function createIndex(filterKeys: string[] = [], directoryPath: string, resultPath: string, descending_order: boolean = true) {
    try {
        const all: MdHeaderData[] = [];

        filterKeys.push("date");

        await findAllDirectories(all, filterKeys, directoryPath);
        await writingIndexingInFile(all, resultPath, descending_order);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export { createIndex };
