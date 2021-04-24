import { jsonToRuntypes } from '../index';

describe('json-to-runtypes', () => {
  it('smoke test object root', () => {
    expect(
      jsonToRuntypes({
        name: 'rune',
        age: 41,
        tags: ['foo', 'bar', 'baz'],
        posts: [
          { title: 'intro', published: true },
          { title: 'chapter-1', editorApproved: true },
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
      "import * as rt from \\"runtypes\\";

      const HeroImageRt = rt.Record({ title: rt.String, src: rt.String });

      type THeroImage = rt.Static<typeof HeroImageRt>;

      const PostsRt = rt.Intersect(
        rt.Record({ title: rt.String }),
        rt
          .Record({
            published: rt.Boolean,
            editorApproved: rt.Boolean,
            heroImage: HeroImageRt,
          })
          .asPartial()
      );

      type TPosts = rt.Static<typeof PostsRt>;

      export const RootRt = rt.Record({
        name: rt.String,
        age: rt.Number,
        tags: rt.Array(rt.String),
        posts: rt.Array(PostsRt),
      });

      export type TRoot = rt.Static<typeof RootRt>;
      "
    `);
  });
});
