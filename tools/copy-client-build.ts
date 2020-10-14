import * as shell from "shelljs";
import * as path from "path";

const source = path.join(__dirname + "/../client/build");
const dest = path.join(__dirname + "/../dist/client")

shell.mkdir("-p", dest);
shell.cp("-r", source, dest);