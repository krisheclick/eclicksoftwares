export const limitHtmlLetters = (
  html: string,
  maxLetters: number,
  subString = ""
): string => {
  const temp = document.createElement("div");
  temp.innerHTML = html;

  let result = "";
  let letterCount = 0;

  const walker = document.createTreeWalker(temp, NodeFilter.SHOW_TEXT);

  while (walker.nextNode() && letterCount < maxLetters) {
    const text = walker.currentNode.nodeValue;
    if (!text) continue;

    for (const char of text) {
      if (letterCount >= maxLetters) break;

      result += char;
      if (char !== " ") letterCount++;
    }
  }

  return letterCount === maxLetters ? result + subString : result;
};
