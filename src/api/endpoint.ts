import { Request, Response, NextFunction } from "express";
import { HttpMethod } from "./http-method";

export type RouteCallback = (req: Request, res: Response) => Promise<void>;

export interface Endpoint {
	reqMethod: HttpMethod;
	route: string;
	callback: RouteCallback,
	callbacks?: RouteCallback[];
}
