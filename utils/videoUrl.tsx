// utils/videoUrl.ts
export const normalizeYouTubeUrl = (url: string) => {
    const idMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^\s&?/]+)/);
    if (!idMatch) return url;
    return `https://www.youtube.com/embed/${idMatch[1]}`;
};
