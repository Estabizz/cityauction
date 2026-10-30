import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// Execute the actual TypeScript handlers with isolated infrastructure mocks.
// Never connect to a database, email provider or legacy transaction service.
export function loadSource(relativePath, mocks = {}, globals = {}) {
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const compiledModule = { exports: {} };
    cache.set(filename, compiledModule);
    const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
      fileName: filename,
    }).outputText;
    const nativeRequire = createRequire(filename);
    const localRequire = (id) => {
      if (Object.hasOwn(mocks, id)) return mocks[id];
      const local = id.startsWith("@/")
        ? path.join(root, "src", id.slice(2))
        : id.startsWith(".") ? path.resolve(path.dirname(filename), id) : null;
      if (!local) return nativeRequire(id);
      if (/[/\\]services[/\\](bidding|payment)\.service$/.test(local) || local === path.join(root, "src/lib/db")) {
        throw new Error(`Unexpected infrastructure dependency: ${id}`);
      }
      return load(fs.existsSync(`${local}.ts`) ? `${local}.ts` : `${local}.tsx`);
    };
    vm.runInNewContext(compiled, {
      module: compiledModule, exports: compiledModule.exports, require: localRequire,
      console: { error() {}, info() {} }, Buffer, process, URL, URLSearchParams, Request, Response, AbortSignal, TextEncoder, TextDecoder, Date, ...globals,
    }, { filename });
    return compiledModule.exports;
  }
  return load(path.join(root, relativePath));
}

