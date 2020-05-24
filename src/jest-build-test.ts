import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join, parse, relative } from 'path';
import * as ts from 'typescript';
import tsConfig = require('../tsconfig.json');

declare var jestTestPath: string;

const rootDir = join(__dirname, '../src');
const testDir = relative(rootDir, dirname(jestTestPath));
const targetDir = join(rootDir, '../dist', testDir);
const { name } = parse(jestTestPath);
const targetPath = join(targetDir, `${name}.js`);

test(`builds ${targetPath}`, async () => {
  const src: string = await readFile(jestTestPath, { encoding: 'utf-8' });
  expect(src).toBeDefined();

  const compiledSource = ts.transpile(
    src,
    tsConfig.compilerOptions as Omit<ts.CompilerOptions, 'jsx'>,
    jestTestPath,
    []
  );

  expect(compiledSource).toBeDefined();

  // TODO sourceMap for TS ?

  await mkdir(targetDir, { recursive: true });
  await writeFile(targetPath, compiledSource);
});