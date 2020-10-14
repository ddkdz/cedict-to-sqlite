import * as https from "https";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { __LOG__ } from "../../shared/logger";
import unzipper from "unzipper";

export class FilesService {

    private checkFileIntegrity() {
        // tslint:disable:no-empty
        // IMPLEMENT ME!
    }

    public async removeFile(atPath: string) {
        // tslint:disable:no-empty
        // IMPLEMENT ME!
    }

    // TODO: do some checks on the downloaded file, to make sure it is a ok archive
    public async downloadFile(fromUrl: string, fileName: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const tmpFilePath = path.join(os.tmpdir(), fileName);
            const file = fs.createWriteStream(tmpFilePath);

            https.get(fromUrl, res => {
                res.on('data', chunk => {
                    file.write(chunk)
                });

                res.on('end', () => {
                    resolve(tmpFilePath);
                });
            });
        });
    }

    // Note: Assumes there is only ONE file zipped in the archive
    // Also NO checks are performed on the archive
    public async unzipFile(atPath: string, fileName: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const outPath = path.join(os.tmpdir(), fileName);

            fs.createReadStream(atPath)
                .pipe(unzipper.ParseOne())
                .pipe(fs.createWriteStream(outPath)
                .on("finish", () => {
                    resolve(outPath);
                }));
        });
    }
}