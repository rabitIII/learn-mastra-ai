import fs from "fs";
import path from "path";

export async function getFile() {
    const dirPath = path.join(__dirname, "../../../", "md");
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith(".md"));
    
    // console.log(files)
    const results = [];
    for (const file of files) {
        const content = fs.readFileSync(path.join(dirPath, file), "utf8");
        results.push(content)
    }

   return results
}
