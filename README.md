# json-to-runtypes

Convert JSON into [runtypes](https://github.com/pelotom/runtypes/) cabable of
parsing the same JSON shape.

## Example

Given some JSON from a made up blog JSON API, we can generate runtypes that can
parse those JSON replies:

```javascript
import { jsonToRuntypes } from 'json-to-runtypes';

const json = {
  title: 'my blog',
  posts: [
    {
      title: 'first!',
      id: 1,
      published: true,
      author: {
        name: 'Rune',
        id: 1,
      },
    },
    {
      title: 'second',
      id: 2,
      slug: 'post-the-second',
      author: {
        name: 'Frank',
        id: 2,
        avatarSrc: 'https://example.org/avatar.png',
      },
    },
  ],
  links: {
    totalPages: 3,
    currentPage: 2,
    self: 'https://example.org/2',
    next: 'https://example.org/3',
    prev: 'https://example.org/1',
  },
};

const typescript = jsonToRuntypes(json);

console.log(typescript);
```

The generated TypesScript code looks like this:

```typescript
import * as rt from 'runtypes';

const AuthorRt = rt.Intersect(
  rt.Record({ name: rt.String, id: rt.Number }),
  rt.Record({ avatarSrc: rt.String }).asPartial(),
);

type TAuthor = rt.Static<typeof AuthorRt>;

const PostsRt = rt.Intersect(
  rt.Record({ title: rt.String, id: rt.Number, author: AuthorRt }),
  rt.Record({ published: rt.Boolean, slug: rt.String }).asPartial(),
);

type TPosts = rt.Static<typeof PostsRt>;

const LinksRt = rt.Record({
  totalPages: rt.Number,
  currentPage: rt.Number,
  self: rt.String,
  next: rt.String,
  prev: rt.String,
});

type TLinks = rt.Static<typeof LinksRt>;

export const RootRt = rt.Record({
  title: rt.String,
  posts: rt.Array(PostsRt),
  links: LinksRt,
});

export type TRoot = rt.Static<typeof RootRt>;
```

## API

fixme
