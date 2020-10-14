import { Request, Response } from "express";
import { __LOG__ } from "../../shared/logger";
import { FilesService } from "../svc/files-service";
import { DictService } from "../svc/dict-service";
import { Utils } from "../../shared/utils";
import path from "path";
import os from "os";

export class FilesController {
    constructor(private filesSvc: FilesService,
                private dictSvc: DictService) {
    }

    public async uploadFile(req: Request, res: Response) {
        const uuid = Utils.createUUID();
        const pathToArchive = await this.filesSvc.downloadFile(req.body.cedictUrl, `cedict-${uuid}.zip`);
        const pathToUnzipped = await this.filesSvc.unzipFile(pathToArchive, `cedict-${uuid}.u8`);
        const pathToDBFile = await this.dictSvc.prepareDBFile(pathToUnzipped, `cedict-${uuid}.sqlite`);
        res.json({dbFile: pathToDBFile});
    }

    public async downloadFile(req: Request, res: Response) {
        const filePath = path.join(os.tmpdir(), req.query.file as string);
        res.download(filePath);
    }
}