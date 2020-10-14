import { Request, Response, NextFunction, Router } from "express";
import { __LOG__ } from "../../shared/logger";
import { EndpointRegistry } from "./endpoint-registry";
import { Endpoint } from "./endpoint";
import { HttpMethod } from "./http-method";

export class MainRouter {
	private router: Router;

	constructor(private endpointRegistry: EndpointRegistry) {
		this.router = Router();
		this.setupMiddleware();
		this.setupRouteHandlers();
	}

	public getRouter(): Router {
		return this.router;
	}

	private setupMiddleware() {
		this.router.use((req: Request, res: Response, next: NextFunction) => {
			const timestamp = new Date(Date.now());
			const log = `[${timestamp.toTimeString()} | ${req.method} | ${req.originalUrl}]`;
			__LOG__(log);
			next();
		});
	}

	private routeExceptionWrap(endpoint: Endpoint, req: Request, res: Response) {
		try {
			endpoint.callback(req, res);
		} catch (e) {
			res.status(500).send(e.message);
		}
	}

	private setupRouteHandlers() {
		this.endpointRegistry.getEndpoints().forEach((endpoint: Endpoint) => {
			switch (endpoint.reqMethod) {
				case HttpMethod.GET: {
					this.router.get(endpoint.route, async (req: Request, res: Response) => { this.routeExceptionWrap(endpoint, req, res); });
					break;
				}
				case HttpMethod.POST: {
					this.router.post(endpoint.route, async (req: Request, res: Response) => { this.routeExceptionWrap(endpoint, req, res); });
					break;
				}
				case HttpMethod.PUT: {
					this.router.put(endpoint.route, async (req: Request, res: Response) => { this.routeExceptionWrap(endpoint, req, res); });
					break;
				}
				default: {
					__LOG__(`WARNING: handler for ${endpoint.reqMethod} not implemented!`);
					break;
				}
			}
		});
	}
}
