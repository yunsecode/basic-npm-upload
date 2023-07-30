import * as fs from 'fs';

// Constants
const BASIC_FIELDS = [
  'layout',
  'title',
  'description',
  'author',
  'date',
  'category',
  'tags'
];

const MD_CONTENT_KEY_BODY = "body";
const START_END_MARKER = "---\n";

// Function to convert JSON content to a string
function contentToString(jsonContent: Record<string, any>, allFields: string[]): string {
	let content = "";

	content += START_END_MARKER;
	allFields.forEach(key => {
		const value = jsonContent[key] !== undefined ? jsonContent[key] : "";
		content += `${key}:${value !== "" ? " " : ""}${value}\n`;
	});
	content += START_END_MARKER;
	content += `${jsonContent[MD_CONTENT_KEY_BODY]}\n`;
	return content;
}

// Function to write content to an MD file
function writeContentToMdFile(path: string, stringContent: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, stringContent, (err) => {
            if (err) {
                reject(new Error(`Failed to write to file:`));
            } else {
                resolve();
            }
        });
    });
}

/**
 * Write an MD file from a JSON object.
 *
 * @param {Record<string, any>} jsonContent - The JSON content to be converted to MD.
 * @param {string} path - The path of the output MD file.
 * @param {string[]} additionalFields - (Optional) Additional fields to include in the MD file.
 * @returns {Promise<void>} A promise that resolves when the file is written successfully.
 */
async function jsonToMd(
	jsonContent: Record<string, any>, path: string, additionalFields: string[] = []): Promise<void> {
    const allFields = [...BASIC_FIELDS, ...additionalFields];
    const stringContent = contentToString(jsonContent, allFields);

    try {
        await writeContentToMdFile(path, stringContent);
    } catch (error) {
        throw new Error("Failed to write MD file.");
    }
}

export { jsonToMd };
