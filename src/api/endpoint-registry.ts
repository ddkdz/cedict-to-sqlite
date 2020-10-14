import { Request, Response } from "express";
import { FilesController } from "./files-controller";
import { Endpoint } from "./endpoint";
import { HttpMethod } from "./http-method";

export type Endpoints = Endpoint[];

export class EndpointRegistry {
	private endpoints: Endpoints;

	constructor(private filesController: FilesController) {
		this.endpoints = new Array<Endpoint>();

		this.endpoints.push({reqMethod: HttpMethod.POST, route: "/files/upload", callback: async (req: Request, res: Response) => {
			this.filesController.uploadFile(req, res);
		}} as Endpoint);

		this.endpoints.push({reqMethod: HttpMethod.GET, route: "/files/download", callback: async (req: Request, res: Response) => {
			this.filesController.downloadFile(req, res);
		}} as Endpoint);
	}

	public getEndpoints(): Endpoints {
		return this.endpoints;
	}
}
