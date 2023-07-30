import * as fs from 'fs';
import { readFile } from 'fs/promises';

const path = require('path');

function getAllMdFileNames() {
    const fs = require('fs');
	var files = fs.readdirSync('data/posts');
	var filteredFiles = []

	for (var i = 0; i < files.length; i++) {
		if (files[i].slice(-3) == ".md" || files[i].slice(-9) == ".markdown") {
			filteredFiles.push(files[i])
		}
	}
	return filteredFiles;
}


function getMdFileHeaderData(dividerIndexes: number[], fileContext: string[]) {
    const result: { [key: string]: string } = {};

    for (let i = 0; i < dividerIndexes[1]; i++) {
        const [key, value] = fileContext[i].split(":").map((item) => item.trim());
        if (key && value) {
            result[key] = value;
        }
    }
    return result;
}


function indexMarkdownContentErrorHandling(dividerIndexes: number[], filename: string) {
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

function getDividerIndexes(fileData: string[]) {
	let dividerIndexes = [];

	for (let i = 0; i < fileData.length; i++) {
		if (fileData[i] == "---" || fileData[i] == "---\n" || fileData[i] == "---\r\n") {
			dividerIndexes.push(i);
            // 최적화: dividerIndexes.Length가 2면더 안 읽고 return dividerIndexes
		}
	}
	return dividerIndexes;
}

async function readMd(filename: string): Promise<string[]> {
    const filePath = path.join(process.cwd(), 'data', 'posts', filename);

    try {
        const data = await readFile(filePath, 'utf-8');

        if (data.includes('\r\n')) { // CRLF
            return data.split('\r\n');
        } else if (data.includes('\n')) { // LF
            return data.split('\n');
        } else {
            return [];
            // TODO: throw 해야 함
        }
    } catch (err) {
        console.error('MD 파일 읽기 오류:', err);
        // TODO: throw 해야 함
        return [];
    }
}

async function indexMarkdownContent() {
    const mdFileNames = getAllMdFileNames();
	let successNum = 0;
	let all = []

	for (const filename of mdFileNames) {
		const fileContext = await readMd(filename);
		const dividerIndexes = getDividerIndexes(fileContext);

		// error handling
        if (indexMarkdownContentErrorHandling(dividerIndexes, filename)) {
            continue;
        }
		// result.path = filename;
        const result = getMdFileHeaderData(dividerIndexes, fileContext); // TODO: 원하는 것만 가져오게
		all.push(result)
		successNum++;
	}
	console.log(`success ${successNum} / ${mdFileNames.length}`);

	// fs.writeFile("asd.json", JSON.stringify(jsonData));
	fs.promises.writeFile("data/test.json", JSON.stringify(all));
	// return NextResponse.json({ products });
    // return
}

export { indexMarkdownContent };
