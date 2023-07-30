import * as fs from 'fs';
import { readFile } from 'fs/promises';

const path = require('path');

function getAllMdFileNames(path: string)
{
    var filteredFiles = []

	try {
        var files = fs.readdirSync(path);

        for (var i = 0; i < files.length; i++) {
            if (files[i].slice(-3) == ".md" || files[i].slice(-9) == ".markdown") {
                filteredFiles.push(files[i])
            }
        }
    } catch (err) {
        throw new Error((err as Error).message);
    }
    return filteredFiles;
}


function getMdFileHeaderData(dividerIndexes: number[], fileContext: string[], filterKeys: string[])
{
    const result: { [key: string]: string } = {};

    for (let i = 0; i < dividerIndexes[1]; i++) {
        const [key, value] = fileContext[i].split(":").map((item) => item.trim());
        // console.log(typeof key);

        if (filterKeys.includes(key)) {
            result[key] = value;
        }
    }
    return result;
}



function createIndexErrorHandling(dividerIndexes: number[], filename: string)
{
    if (dividerIndexes[0] != 0) {
        console.error(`file ${filename}: file have to start with divider "---"`);
        // TODO: throw 해야 함
        return true;
    }

    if (dividerIndexes.length < 2) {
        console.error(`file ${filename}: not divider "---" format`);
        // TODO: throw 해야 함
        return true;
    }
    return false;
}

function getDividerIndexes(fileData: string[])
{
    let dividerIndexes = [];

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

// async function createIndex() {
    //     const mdFileNames = getAllMdFileNames();
    // 	let successNum = 0;
    // 	let all = []

    // 	for (const filename of mdFileNames) {
        // 		const fileContext = await readMd(filename);
        // 		const dividerIndexes = getDividerIndexes(fileContext);

        // 		// error handling
        //         if (createIndexErrorHandling(dividerIndexes, filename)) {
            //             continue;
            //         }
            // 		// result.path = filename;
            //         const result = getMdFileHeaderData(dividerIndexes, fileContext); // TODO: 원하는 것만 가져오게
            // 		all.push(result)
            // 		successNum++;
            // 	}
            // 	console.log(`success ${successNum} / ${mdFileNames.length}`);

            // 	fs.promises.writeFile("data/test.json", JSON.stringify(all));
            // }

async function createIndex(filterKeys: string[] = [], directoryPath: string)
{
    let all = [];

    try {
        const mdFileNames = getAllMdFileNames(directoryPath);

        for (const mdFileName of mdFileNames) {
            const fileContext = await readMd(mdFileName, directoryPath)
            const dividerIndexes = getDividerIndexes(fileContext);

            if (createIndexErrorHandling(dividerIndexes, mdFileName)) {
                continue;
            }
            const result = getMdFileHeaderData(dividerIndexes, fileContext, filterKeys); // TODO: 원하는 것만 가져오게
            all.push(result)

        }
        fs.promises.writeFile("data/test.json", JSON.stringify(all));
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export { createIndex };
