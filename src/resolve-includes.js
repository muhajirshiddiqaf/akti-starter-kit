import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

const INCLUDE_REGEX = /<include\s+src=["']([^"']+)["']\s*(?:\/>|>\s*<\/include>)/gi;

/**
 * Resolve <include src="path"> tags in HTML by replacing with file contents.
 * Paths are relative to the file that contains the include.
 * Recursively resolves includes in included files.
 * @param {string} html - HTML string
 * @param {string} baseDir - Absolute directory of the current file
 * @returns {string} HTML with includes resolved
 */
export function resolveIncludes(html, baseDir) {
  return html.replace(INCLUDE_REGEX, (match, srcPath) => {
    const fullPath = join(baseDir, srcPath.replace(/^\.\//, ""));
    if (!existsSync(fullPath)) {
      console.warn(`[resolve-includes] File not found: ${fullPath}`);
      return `<!-- include not found: ${srcPath} -->`;
    }
    const partialDir = dirname(fullPath);
    let content = readFileSync(fullPath, "utf-8");
    content = resolveIncludes(content, partialDir);
    return content;
  });
}

/**
 * Load an HTML file and resolve all includes.
 * @param {string} filePath - Absolute path to HTML file
 * @returns {string} Resolved HTML
 */
export function loadWithIncludes(filePath) {
  const baseDir = dirname(filePath);
  const html = readFileSync(filePath, "utf-8");
  return resolveIncludes(html, baseDir);
}
