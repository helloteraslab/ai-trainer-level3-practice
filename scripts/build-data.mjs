import { readFile, writeFile } from "node:fs/promises";

const json = await readFile(new URL("../questions.json", import.meta.url), "utf8");
const data = JSON.parse(json);
const output = `window.QUESTION_BANK = ${JSON.stringify(data, null, 2)};\n`;

await writeFile(new URL("../questions-data.js", import.meta.url), output, "utf8");
console.log("OK: questions-data.js updated.");
