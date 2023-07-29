/**
 * Write an MD file from a JSON object.
 *
 * @param {Record<string, any>} jsonContent - The JSON content to be converted to MD.
 * @param {string} path - The path of the output MD file.
 * @param {string[]} additionalFields - (Optional) Additional fields to include in the MD file.
 * @returns {Promise<void>} A promise that resolves when the file is written successfully.
 */
declare function jsonToMd(jsonContent: Record<string, any>, path: string, additionalFields?: string[]): Promise<void>;
export { jsonToMd };
