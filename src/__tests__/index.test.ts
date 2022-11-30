import { jsonToRuntypes } from '../index';

describe('json-to-runtypes', () => {
  it('smoke test object root', () => {
    expect(
      jsonToRuntypes({
        name: 'rune',
        age: 41,
        tokens: [],
        posts: [
          { title: 'intro', published: true, tags: ['foo', 'bar', 'baz'] },
          { title: 'chapter-1', editorApproved: true, tags: [] },
          {
            title: 'chapter-2',
            heroImage: {
              title: 'image',
              src: 'https://example.org',
            },
          },
        ],
      }),
    ).toMatchInlineSnapshot(`
      "import * as rt from "runtypes";

      const HeroImageRt = rt.Record({ title: rt.String, src: rt.String });

      const PostsRt = rt.Intersect(
        rt.Record({ title: rt.String }),
        rt
          .Record({
            published: rt.Boolean,
            tags: rt.Array(rt.String),
            editorApproved: rt.Boolean,
            heroImage: HeroImageRt,
          })
          .asPartial()
      );

      export const RootRt = rt.Record({
        name: rt.String,
        age: rt.Number,
        tokens: rt.Array(rt.Never),
        posts: rt.Array(PostsRt),
      });
      "
    `);
  });

  it('Deals with invalid JS identifiers', () => {
    expect(jsonToRuntypes({ '0': { foo: 'value' } })).toMatchInlineSnapshot(`
      "import * as rt from "runtypes";

      const _0Rt = rt.Record({ foo: rt.String });

      export const RootRt = rt.Record({ "0": _0Rt });
      "
    `);
  });
});
