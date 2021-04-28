import {
  GenerateOptions,
  AnyType as OutAnyType,
  RootType,
  generateRuntypes,
} from 'generate-runtypes';
import { AnyType as InAnyType, guess } from 'guess-json-shape';

type GuessOptions = GenerateOptions;

function guessTypeToRuntypDef(inType: InAnyType): OutAnyType {
  switch (inType.kind) {
    case 'primitive':
      return { kind: inType.type };

    case 'named':
      return { kind: 'named', name: inType.name };

    case 'union':
      return { kind: 'union', types: inType.types.map(guessTypeToRuntypDef) };

    case 'array':
      return { kind: 'array', type: guessTypeToRuntypDef(inType.type) };

    case 'object': {
      return {
        kind: 'record',
        fields: inType.fields.map(({ name, type, nullable }) => ({
          name,
          nullable,
          type: guessTypeToRuntypDef(type),
        })),
      };
    }
  }
}

const defaultOptions: GuessOptions = {
  includeTypes: false,
  formatRuntypeName: (name) => `${name}Rt`,
};

export function jsonToRuntypes(
  json: unknown,
  opts: GuessOptions = defaultOptions,
): string {
  const guesses = guess(json);
  const roots = guesses.map<RootType>((guess) => {
    return {
      name: guess.name,
      export: guess.isRoot,
      type: guessTypeToRuntypDef(guess.type),
    };
  });

  const source = generateRuntypes(roots, opts);
  return source;
}
