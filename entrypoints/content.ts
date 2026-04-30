export default defineContentScript({
  matches: ["*://news.ycombinator.com/*"],
  main() {
    console.log("Hello content.")
  },
})
