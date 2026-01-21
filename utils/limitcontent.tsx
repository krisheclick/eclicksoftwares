export const limitHtmlWords = ( html: string, maxWords: number, subString = "" ): string => {
  const temp = document.createElement("div");
  temp.innerHTML = html;

  const words: string[] = [];
  const walker = document.createTreeWalker(temp, NodeFilter.SHOW_TEXT);

  while (walker.nextNode() && words.length < maxWords) {
    const text = walker.currentNode.nodeValue;
    if (!text) continue;

    const split = text.split(/\s+/).filter(Boolean);

    for (const w of split) {
      if (words.length >= maxWords) break;
      words.push(w);
    }
  }

  const result = words.join(" ");
  return words.length === maxWords ? result + subString : result;
};
