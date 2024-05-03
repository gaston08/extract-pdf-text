import { readPdfText } from "pdf-text-reader";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

fs.readdirSync("./pdfs").forEach((file) => {
  main(file);
});

async function main(file) {
  const pdf_text = await readPdfText({ url: `pdfs/${file}` });
  const formatted_text = pdf_text
    .replaceAll(/\n(?=[a-z])/g, " ")
    .replaceAll(/\s((?=\.)|(?=\,))/g, "");
  const arr = formatted_text.split(/\n/g);
  const exercises = [];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i].startsWith("Pregunta")) {
      const reg_exp = arr[i].match(/(?<=\x28)\d+(\.\d{1,})?/);
      i += 1;
      if (arr[i] !== undefined && arr[i] !== "") {
        let points;
        if (reg_exp !== null) {
          points = reg_exp[0];
        } else {
          points = "0";
        }
        exercises.push({
          question: [arr[i]],
          points,
          options: [[]],
        });
      }
    } else {
      if (arr[i][1] === ".") {
        exercises[exercises.length - 1].options[0].push(arr[i]);
      }
    }
  }

  //fs.writeFile("/extracted/1.txt", formatted_text, { flag: "w+" }, (err) => {});
  const txtFile = file.replace("pdf", "js");
  fs.writeFile(
    `${__dirname}/extracted/${txtFile}`,
    JSON.stringify(exercises),
    { flag: "w+" },
    (err) => {
      console.log(err);
    },
  );
}

//main();
