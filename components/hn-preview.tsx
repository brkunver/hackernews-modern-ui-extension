import { For } from "solid-js"
import type { ThemeColors } from "@/utils/theme"

interface PreviewStory {
  rank: number
  title: string
  domain: string
  score: number
  user: string
  age: string
  comments: number
}

const previewStories: PreviewStory[] = [
  {
    rank: 1,
    title: "Show HN: A modern UI for Hacker News",
    domain: "github.com",
    score: 412,
    user: "kunver",
    age: "3 hours ago",
    comments: 128,
  },
  {
    rank: 2,
    title: "The unreasonable effectiveness of simple HTML",
    domain: "benhoyt.com",
    score: 287,
    user: "tosh",
    age: "5 hours ago",
    comments: 64,
  },
  {
    rank: 3,
    title: "Ask HN: What are you working on this week?",
    domain: "news.ycombinator.com",
    score: 96,
    user: "pg",
    age: "8 hours ago",
    comments: 203,
  },
]

const previewComment = {
  user: "tptacek",
  age: "1 hour ago",
  text: "Colour is a great way to make a dense page scannable. The important part is keeping the contrast high enough for long reading sessions.",
}

export interface HnPreviewProps {
  colors: ThemeColors
}

/** A mock Hacker News listing rendered with a theme's colors. */
export function HnPreview(props: HnPreviewProps) {
  const colors = () => props.colors

  return (
    <div
      class="hn-preview"
      style={`background-color: ${colors().background}; color: ${colors().text}; border-color: ${colors().border}`}
    >
      <div
        class="hn-preview__header"
        style={`background-color: ${colors().headerBg}; color: ${colors().accentText}`}
      >
        <span class="hn-preview__logo">Y</span>
        <span class="hn-preview__brand">Hacker News</span>
        <span class="hn-preview__nav">new | past | comments | ask | show | jobs | submit</span>
      </div>

      <ol class="hn-preview__list">
        <For each={previewStories}>
          {story => (
            <li class="hn-preview__row">
              <span class="hn-preview__rank" style={`color: ${colors().subtext}`}>
                {story.rank}.
              </span>
              <div class="hn-preview__story">
                <div class="hn-preview__title-row">
                  <span class="hn-preview__title" style={`color: ${colors().link}`}>
                    {story.title}
                  </span>
                  <span class="hn-preview__domain" style={`color: ${colors().domainText}`}>
                    ({story.domain})
                  </span>
                </div>
                <div class="hn-preview__subtext" style={`color: ${colors().subtext}`}>
                  {story.score} points by{" "}
                  <span style={`color: ${colors().link}`}>{story.user}</span>{" "}
                  <span style={`color: ${colors().subtext}`}>{story.age}</span> |{" "}
                  <span style={`color: ${colors().commentLink}; font-weight: 500`}>
                    {story.comments} comments
                  </span>
                </div>
              </div>
            </li>
          )}
        </For>
      </ol>

      <div class="hn-preview__comment" style={`background-color: ${colors().commentBg}`}>
        <span class="hn-preview__subtext" style={`color: ${colors().subtext}`}>
          <span style={`color: ${colors().link}`}>{previewComment.user}</span> {previewComment.age}
        </span>
        <p class="hn-preview__comment-text" style={`color: ${colors().text}`}>
          {previewComment.text}
        </p>
      </div>
    </div>
  )
}
