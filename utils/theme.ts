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
  background: "#121212",
  text: "#d4d4d4",
  link: "#d4d4d4",
  linkHover: "#7aa2f7",
  border: "#2a2a2a",
  tableBg: "#121212",
  headerBg: "#2a2a2a",
  subtext: "#a0a0a0",
  commentBg: "#1a1a1a",
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
