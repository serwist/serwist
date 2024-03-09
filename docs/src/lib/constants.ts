import { PUBLIC_CANONICAL_URL } from "$env/static/public";
import { encodeBase64 } from "./base64";

export const COLOR_SCHEMES = ["dark", "light"] as const;

export const GITHUB_REPO_URL = "https://github.com/serwist/serwist";

export const ENCODED_CANONICAL_URL = encodeBase64(PUBLIC_CANONICAL_URL);
