export interface ThemeColors {
  background: string
  text: string
  link: string
  linkHover: string
  border: string
  tableBg: string
  headerBg: string
  subtext: string
  commentBg: string
}

export const darkTheme: ThemeColors = {
  background: "#0f0f0f",
  text: "#e6e6e6",
  link: "#e6e6e6",
  linkHover: "#ffb86c",
  border: "#2b2b2b",
  tableBg: "#121212",
  headerBg: "#1a1a1a",
  subtext: "#9a9a9a",
  commentBg: "#181818",
}

export const lightTheme: ThemeColors = {
  background: "#f6f6ef",
  text: "#000000",
  link: "#000000",
  linkHover: "#ff6600",
  border: "#ff6600",
  tableBg: "#f6f6ef",
  headerBg: "#ff6600",
  subtext: "#828282",
  commentBg: "#f6f6ef",
}

export function injectThemeStyles(theme: ThemeColors) {
  const style = document.createElement("style")
  style.id = "hackernews-theme-styles"
  style.textContent = `
    body {
      background-color: ${theme.background} !important;
      color: ${theme.text} !important;
    }

    #hnmain {
      background-color: ${theme.tableBg} !important;
    }

    td[bgcolor="#ff6600"] {
      background-color: ${theme.headerBg} !important;
    }

    a {
      color: ${theme.link} !important;
    }

    a:hover {
      color: ${theme.linkHover} !important;
    }

    .titleline a {
      color: ${theme.link} !important;
    }

    .subtext {
      color: ${theme.subtext} !important;
    }

    .commtext {
      color: ${theme.text} !important;
    }

    .comment {
      background-color: ${theme.commentBg} !important;
    }

    .comhead {
      color: ${theme.subtext} !important;
    }

    .hnuser {
      color: ${theme.link} !important;
    }

    .age a {
      color: ${theme.subtext} !important;
    }

    .togg {
      color: ${theme.link} !important;
    }

    textarea {
      background-color: ${theme.commentBg} !important;
      color: ${theme.text} !important;
      border-color: ${theme.border} !important;
    }

    input[type="submit"] {
      background-color: ${theme.headerBg} !important;
      color: white !important;
      border: none !important;
    }
  `

  // Remove existing styles if any
  const existing = document.getElementById("hackernews-theme-styles")
  if (existing) {
    existing.remove()
  }

  document.head.appendChild(style)
}

export function removeThemeStyles() {
  const existing = document.getElementById("hackernews-theme-styles")
  if (existing) {
    existing.remove()
  }
}
