import {
  AnyType as OutAnyType,
  RootType,
  generateRuntypes,
} from 'generate-runtypes';
import { AnyType as InAnyType, guess } from 'guess-json-shape';

function guessTypeToRuntypDef(inType: InAnyType): OutAnyType {
  switch (inType.kind) {
    case 'primitive': {
      const t = inType.type === 'null' ? 'unknown' : inType.type;
      return { kind: t };
    }

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

export function jsonToRuntypes(json: unknown): string {
  const guesses = guess(json);
  const roots = guesses.map<RootType>((guess) => {
    return {
      name: guess.name,
      export: guess.isRoot,
      type: guessTypeToRuntypDef(guess.type),
    };
  });

  const source = generateRuntypes(roots, {
    includeTypes: true,
    formatRuntypeName: (name) => `${name}Rt`,
    formatTypeName: (name) => `T${name}`,
  });
  return source;
}
