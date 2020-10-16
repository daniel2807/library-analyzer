export const compareByFinalScore = (a, b) => {
    if (a.finalScore < b.finalScore) return 1;
    if (a.finalScore > b.finalScore) return -1;
    return 0;
};
  
export const compareByName = (a, b) => {
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    return 0;
};
  
export const compareByDownloads = (a, b) => {
    if (a.downloads < b.downloads) return 1;
    if (a.downloads > b.downloads) return -1;
    return 0;
};
  
export const compareByStars = (a, b) => {
    if (a.stars < b.stars) return 1;
    if (a.stars > b.stars) return -1;
    return 0;
};