export const limitHtmlWords = (html: string, maxWords: number) => {
  const temp = document.createElement("div");
  temp.innerHTML = html;

  const words = [];
  const walker = document.createTreeWalker(temp, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const text = walker.currentNode.nodeValue?.trim();
    if (!text) continue;

    const split = text.split(/\s+/);
    for (const w of split) {
      if (words.length < maxWords) words.push(w);
    }
  }

  return words.join(" ") +'';
};