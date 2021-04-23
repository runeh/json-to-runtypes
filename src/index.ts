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

export function doit(json: unknown): string {
  const guesses = guess(json);
  const roots = guesses.map<RootType>((guess) => {
    return {
      name: guess.name,
      export: guess.isRoot,
      type: guessTypeToRuntypDef(guess.type),
    };
  });

  const source = generateRuntypes(roots, {
    includeTypes: false,
    formatRuntypeName: (name) => `${name}Rt`,
    formatTypeName: (name) => `T${name}`,
  });
  return source;
}

const data = doit({
  _links: {
    self: {
      href: 'http://example.com/api/book/hal-cookbook',
    },
    next: {
      href: 'http://example.com/api/book/hal-case-study',
    },
    prev: {
      href: 'http://example.com/api/book/json-and-beyond',
    },
    first: {
      href: 'http://example.com/api/book/catalog',
    },
    last: {
      href: 'http://example.com/api/book/upcoming-books',
    },
  },
  _embedded: {
    author: {
      _links: {
        self: {
          href: 'http://example.com/api/author/shahadat',
        },
      },
      id: 'shahadat',
      name: 'Shahadat Hossain Khan',
      homepage: 'http://author-example.com',
    },
  },
  id: 'hal-cookbook',
  name: 'HAL Cookbook',
});

console.log(data);
