#!/usr/bin/env node
/* eslint no-console:off */

import fs from 'fs/promises';
import { program } from 'commander';
import getStdin from 'get-stdin';
import { jsonToRuntypes } from '.';

const main = async () => {
  const prog = program
    .name('json-to-runtypes')
    .description(
      'Convert JSON into Runtypes capable of parsing the same JSON shape.',
    )
    .option('-i, --input <input file>', 'Path to JSON. Can also be stdin.')
    .option('-o, --output <output file>', 'Output file.')
    .parse(process.argv);

  const { input, output } = prog.opts();
  const jsonContent = input
    ? await fs.readFile(input, 'utf-8')
    : await getStdin();

  if (!jsonContent) {
    throw new Error('Could not find any input.');
  }

  const out = await jsonToRuntypes(JSON.parse(jsonContent));
  if (output) {
    await fs.writeFile(output, out);
  } else {
    process.stdout.write(out);
  }
};

main().catch(console.error);
