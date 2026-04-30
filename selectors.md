Below is a practical selector map for a **Hacker News Chrome extension**.

---

## Global page structure

| Element               | Selector                           | Notes                                                                |
| --------------------- | ---------------------------------- | -------------------------------------------------------------------- |
| Whole HN page wrapper | `#hnmain`                          | Main outer table for the entire page.                                |
| Top orange header row | `#hnmain > tbody > tr:first-child` | Contains logo, nav links, login/user area.                           |
| Header nav text/links | `.pagetop` / `.pagetop a`          | `new`, `past`, `comments`, `ask`, `show`, `jobs`, `submit`, `login`. |
| HN brand name         | `.hnname` / `.hnname a`            | “Hacker News” link.                                                  |
| Page content area     | `#pagespace + tr`                  | Usually the row after spacing. Useful but slightly fragile.          |
| Spacer rows           | `.spacer`                          | HN uses empty spacer rows between sections.                          |

---

## Submission / story area

On item pages, the main story is inside a `table.fatitem`. The page shows the title row, then score/user/time/action metadata below it. ([Hacker News][1])

| Element              | Selector                       | Notes                                                    |
| -------------------- | ------------------------------ | -------------------------------------------------------- |
| Main story table     | `table.fatitem`                | The story block at the top of an item page.              |
| Story row            | `tr.athing`                    | Main submission row. Usually has `id="<itemId>"`.        |
| Story row by id      | `tr.athing[id]`                | Good for extracting the HN item ID.                      |
| Story title cell     | `td.title`                     | Contains rank/title/titleline depending on page.         |
| Story title wrapper  | `.titleline`                   | Modern HN title wrapper.                                 |
| Story title link     | `.titleline > a`               | Actual article link.                                     |
| Story domain wrapper | `.sitebit`                     | Contains domain text like `(noctua.at)`.                 |
| Story domain link    | `.sitebit a`                   | Domain link/search.                                      |
| Metadata row         | `td.subtext`                   | Score, author, age, hide, past, favorite, comment count. |
| Score                | `.score`                       | Example: `283 points`.                                   |
| Author link          | `a.hnuser`                     | Used for both story author and comment authors.          |
| Age / timestamp      | `.age` / `.age a`              | Usually links back to the item/comment.                  |
| Vote cell            | `td.votelinks`                 | Contains upvote arrow.                                   |
| Vote link            | `.votearrow` or `.votelinks a` | Upvote area. Exact child structure can vary.             |

Useful JS:

```js
const story = document.querySelector("table.fatitem tr.athing")
const storyId = story?.id

const title = document.querySelector("table.fatitem .titleline > a")
const titleText = title?.textContent?.trim()
const titleUrl = title?.href

const domain = document.querySelector("table.fatitem .sitebit a")?.textContent?.trim()
const score = document.querySelector("table.fatitem .score")?.textContent?.trim()
const author = document.querySelector("table.fatitem .subtext a.hnuser")?.textContent?.trim()
```

---

## Comment tree

The comments are rendered as a table with comment rows. The sample page shows each comment has author, time, navigation links like `parent`, `next`, collapse `[–]`, comment text, and `reply`. ([Hacker News][1])

| Element            | Selector                            | Notes                                                |
| ------------------ | ----------------------------------- | ---------------------------------------------------- |
| Comment tree table | `table.comment-tree`                | Main comments container.                             |
| Comment row        | `tr.athing.comtr`                   | One comment. Usually has `id="<commentId>"`.         |
| Comment row by id  | `tr.athing.comtr[id]`               | Best way to target a specific comment.               |
| Comment body cell  | `td.default`                        | Contains header + text + reply area.                 |
| Comment header     | `.comhead`                          | Author, age, parent/root/prev/next, collapse toggle. |
| Comment author     | `.comhead a.hnuser`                 | Author username.                                     |
| Comment timestamp  | `.comhead .age` / `.comhead .age a` | Comment age link.                                    |
| Comment text       | `.comment`                          | Main comment HTML/text.                              |
| Comment paragraphs | `.comment p`                        | HN comments often use `<p>`.                         |
| Reply area/link    | `.reply` / `.reply a`               | The `reply` link below the comment.                  |
| Collapse toggle    | `a.togg`                            | The `[–]` collapse control.                          |
| Comment nav links  | `.navs a`                           | `root`, `parent`, `prev`, `next`.                    |
| Indentation cell   | `td.ind`                            | Contains width-based indentation.                    |
| Indentation image  | `td.ind img`                        | HN uses image width for nesting depth.               |
| Comment vote links | `td.votelinks`                      | Upvote area beside each comment.                     |

The selector names above are also visible in community HN styling references, including `table.comment-tree`, `tr.athing.comtr[id]`, `.comhead`, `.comment`, `.reply`, `.navs`, `.votelinks`, `.titleline`, `.sitebit`, `.subtext`, and `.score`. ([Gist][2])

Useful JS:

```js
const comments = [...document.querySelectorAll("tr.athing.comtr")].map(row => {
  const id = row.id

  const author = row.querySelector(".comhead a.hnuser")?.textContent?.trim()
  const age = row.querySelector(".comhead .age a")?.textContent?.trim()
  const textEl = row.querySelector(".comment")
  const text = textEl?.innerText?.trim()

  const replyUrl = row.querySelector(".reply a")?.href

  const indentImg = row.querySelector("td.ind img")
  const indentWidth = Number(indentImg?.getAttribute("width") || 0)
  const depth = Math.round(indentWidth / 40) // common HN nesting unit

  return { id, author, age, text, replyUrl, depth }
})
```

---

## Action links

| Action                | Selector idea                          | Notes                                                     |
| --------------------- | -------------------------------------- | --------------------------------------------------------- |
| Hide story            | `td.subtext a[href^="hide"]`           | Usually in story metadata.                                |
| Favorite              | `td.subtext a[href^="fave"]`           | On item pages.                                            |
| Past / archive        | `td.subtext a[href*="hn.algolia.com"]` | “past” link.                                              |
| Comments link         | `td.subtext a[href^="item?id="]`       | On listing pages; on item page it may point to same item. |
| Reply to comment      | `tr.athing.comtr .reply a`             | Per-comment reply.                                        |
| Parent/root/next/prev | `.comhead a` or `.navs a`              | Filter by textContent.                                    |
| Collapse comment      | `tr.athing.comtr a.togg`               | `[–]` toggle.                                             |

Example:

```js
function findCommentAction(row, label) {
  return [...row.querySelectorAll(".comhead a, .reply a")].find(a => a.textContent.trim() === label)
}

const firstComment = document.querySelector("tr.athing.comtr")

const parentLink = findCommentAction(firstComment, "parent")
const nextLink = findCommentAction(firstComment, "next")
const replyLink = findCommentAction(firstComment, "reply")
```

---

## Recommended selectors for your extension

These are the ones I’d rely on first:

```css
#hnmain
.pagetop
.hnname

table.fatitem
table.fatitem tr.athing
table.fatitem .titleline > a
table.fatitem .sitebit a
table.fatitem .subtext
table.fatitem .score
table.fatitem .subtext a.hnuser

table.comment-tree
tr.athing.comtr
tr.athing.comtr[id]
tr.athing.comtr .comhead
tr.athing.comtr .comhead a.hnuser
tr.athing.comtr .comhead .age a
tr.athing.comtr .comment
tr.athing.comtr .reply a
tr.athing.comtr a.togg
tr.athing.comtr td.ind img
```

---

## Important warning

HN markup is simple but not semantic. Some selectors are stable, but page layout is table-based and sometimes uses spacing rows, image-based indentation, and repeated class names. For a Chrome extension, prefer:

```js
document.querySelectorAll("tr.athing.comtr")
```

over fragile structural selectors like:

```css
#hnmain > tbody > tr:nth-child(...)
```

For comments, the best anchor is:

```css
tr.athing.comtr[id]
```

For the main story, the best anchor is:

```css
table.fatitem tr.athing[id]
```

[1]: https://news.ycombinator.com/item?id=47927627 "Noctua releases official 3D CAD models for its cooling fans | Hacker News"
[2]: https://gist.github.com/christippett/5097af0ea59c867c4578996350933776?permalink_comment_id=5068453 "Hacker News Stylesheet"
