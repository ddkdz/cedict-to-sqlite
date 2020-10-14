import * as path from "path";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import compression from "compression";
import { __LOG__ } from "../../shared/logger";
import { MainRouter } from "./router";
import { EndpointRegistry } from "./endpoint-registry";
import { FilesController } from "./files-controller";
import { DictService } from "../svc/dict-service";
import { FilesService } from "../svc/files-service";

export class Server {
	private app: express.Express;
	private dictService: DictService;
	private filesService: FilesService;
	private filesController: FilesController;
	private registry: EndpointRegistry;
	private router: MainRouter;

	constructor(private port: number) {
		this.app = express();
		this.dictService = new DictService();
		this.filesService = new FilesService();
		this.filesController = new FilesController(this.filesService, this.dictService);
		this.registry = new EndpointRegistry(this.filesController);
		this.router = new MainRouter(this.registry);
		this.app.use(cors())
		// this.app.use(helmet())
		// this.app.use(compression())
		this.app.use(bodyParser.urlencoded({ extended: false }))
		this.app.use(bodyParser.json())
		this.app.use("/v1", this.router.getRouter());
		const clientDir = path.join(__dirname + "/../..", "client");
		this.app.use(express.static(path.join(clientDir, "build")));
		this.app.get("/*", (req: Request, res: Response) => {
			res.sendFile(path.join(clientDir, "build", "index.html"));
		});
	}

	public start(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.app.listen(this.port, () => {
				__LOG__(`INFO: Server listening at: http://localhost:${this.port}`);
				resolve();
			});
		});
	}

	public shutdown(): Promise<void> {
		return new Promise((resolve, reject) => {
				// do cleanup stuff if neccessary
				__LOG__("INFO: Server shuting down...");
				resolve();
		});
	}
}
