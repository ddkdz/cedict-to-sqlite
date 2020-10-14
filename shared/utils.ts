import uuid from "uuid-random";

export abstract class Utils {
    public static createUUID(): string {
        return uuid();
    }
}