import crypto from "node:crypto";
import fs from "node:fs";

export const getFileHash = (file: fs.PathOrFileDescriptor) => crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex");
