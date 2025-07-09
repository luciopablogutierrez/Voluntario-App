export const volunteerColors = [
  '#FFADAD', // Light Red
  '#FFD6A5', // Light Orange
  '#FDFFB6', // Light Yellow
  '#CAFFBF', // Light Green
  '#9BF6FF', // Light Cyan
  '#A0C4FF', // Light Blue
  '#BDB2FF', // Light Purple
  '#FFC6FF', // Light Magenta
];

export function getNextColor(existingColors: string[]): string {
  const colorCounts: Record<string, number> = {};
  volunteerColors.forEach(c => colorCounts[c] = 0);
  
  existingColors.forEach(c => {
    if(c in colorCounts) {
      colorCounts[c]++;
    }
  });

  let minCount = Infinity;
  let nextColor = volunteerColors[0];

  // Find the color with the minimum usage count
  for (const color of volunteerColors) {
    if (colorCounts[color] < minCount) {
      minCount = colorCounts[color];
      nextColor = color;
    }
  }

  return nextColor;
}
