import * as fs from "fs";
import * as readline from "readline";
import * as path from "path";
import * as os from "os";
import sqlite3 from "sqlite3";
import { CedictEntry, CedictEntries } from "../model/cedict-entry";
import { __LOG__ } from "../../shared/logger";

export class DictService {

    private explodeLine(line: string): CedictEntry {
        return {
            traditional: line.match(/^([^\s]*)\s/g)[0].trim(),
            simplified: line.match(/\s(.*?)\s/g)[0].trim(),
            pinyin: line.match(/\[(.[^\]]*)\]/g)[0],
            translation: line.match(/\s\/(.*)/g)[0].trim()
        } as CedictEntry;
    }

    private async serializeCedictFile(pathToFile: string) : Promise<CedictEntries> {
        return new Promise(async (resolve, reject) => {
            const rl = readline.createInterface({
                input: fs.createReadStream(pathToFile),
                crlfDelay: Infinity
            });

            const entries = new Array<CedictEntry>();

            for await (const line of rl) {
                if (line.startsWith("#") === false) { // ignore comment lines
                    const entry: CedictEntry = this.explodeLine(line);
                    entries.push(entry);
                }
            }

            resolve(entries);
        });
    }

    public async prepareDBFile(atPath: string, outFileName: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const cedictEntries = await this.serializeCedictFile(atPath);
            const db = new sqlite3.Database(path.join(os.tmpdir(), outFileName));

            db.serialize(async () => {
                db.run("BEGIN");
                db.run("CREATE TABLE dictionary (id text, trad TEXT, simpl TEXT, pinyin TEXT, trans TEXT)");

                let id = 1;
                const stmt = db.prepare("INSERT INTO dictionary VALUES (?, ?, ?, ?, ?)");

                cedictEntries.forEach(entry => {
                    stmt.run(id, entry.traditional, entry.simplified, entry.pinyin, entry.translation);
                    id += 1;
                });

                stmt.finalize();

                db.run("COMMIT");
            });

            db.close((error)=>{
                if (error) {
                    __LOG__("ERROR: " + error);
                } else {
                    resolve(outFileName);
                }
            });
        });
    }
}