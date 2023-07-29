"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonToMd = void 0;
const fs = require("fs");
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
function contentToString(jsonContent, allFields) {
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
function writeContentToMdFile(path, stringContent) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, stringContent, (err) => {
            // if (err) {
            reject(new Error(`Failed to write to file:`));
            // } else {
            //     resolve();
            // }
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
function jsonToMd(jsonContent, path, additionalFields = []) {
    return __awaiter(this, void 0, void 0, function* () {
        const allFields = [...BASIC_FIELDS, ...additionalFields];
        const stringContent = contentToString(jsonContent, allFields);
        try {
            yield writeContentToMdFile(path, stringContent);
        }
        catch (error) {
            throw new Error("Failed to write MD file.");
        }
    });
}
exports.jsonToMd = jsonToMd;
