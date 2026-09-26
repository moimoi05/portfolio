import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { expect, it } from 'vitest';

it('loads the emitted handler in plain Node ESM and returns 405 without Gemini', () => {
  const output = mkdtempSync(resolve('node_modules/.chat-runtime-'));
  try {
    writeFileSync(join(output, 'package.json'), '{"type":"module"}');
    // Preserve ESM specifiers, as the server compiler does; no Vite resolver or SDK mock.
    const program = ts.createProgram([resolve('api/chat.ts')], {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      rootDir: process.cwd(),
      outDir: output,
      skipLibCheck: true,
    });
    program.emit();
    const handlerUrl = pathToFileURL(join(output, 'api/chat.js')).href;
    const result = execFileSync(process.execPath, ['--input-type=module', '--eval', `
      import assert from 'node:assert/strict';
      const { default: handler } = await import(${JSON.stringify(handlerUrl)});
      const response = {
        setHeader() { return this; },
        status(code) { this.code = code; return this; },
        json(body) { this.body = body; return this; },
      };
      await handler({ method: 'GET', headers: {} }, response);
      assert.equal(response.code, 405);
      assert.deepEqual(response.body, { error: 'Method not allowed.' });
      console.log('handler startup OK');
    `], { encoding: 'utf8', env: { ...process.env, GEMINI_API_KEY: '' } });
    expect(result.trim()).toBe('handler startup OK');
  } finally {
    rmSync(output, { recursive: true, force: true });
  }
}, 30_000);
