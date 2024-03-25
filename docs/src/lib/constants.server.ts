import { PUBLIC_CANONICAL_URL } from "$env/static/public";
import { encodeBase64 } from "./base64";

export const ENCODED_CANONICAL_URL = encodeBase64(PUBLIC_CANONICAL_URL);
