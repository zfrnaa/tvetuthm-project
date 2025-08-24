import { predefinedUniversities } from "@/../constants/programsUFac";

export function generatePieData(programs: { starRating?: number }[]) {
    const counts: Record<number, number> = {};
    programs.forEach((p) => {
        const stars = p.starRating || 0;
        counts[stars] = (counts[stars] || 0) + 1;
    });
    return [1, 2, 3, 4, 5].map((stars) => ({
        stars,
        number: counts[stars] || 0,
        fill: getPieColor(stars),
    }));
}

export function getPieColor(stars: number) {
    switch (stars) {
        case 1: return "var(--color-chrome)";
        case 2: return "var(--color-safari)";
        case 3: return "var(--color-other)";
        case 4: return "var(--color-edge)";
        case 5: return "var(--color-firefox)";
        default: return "var(--color-other)";
    }
}

export const getShortInstitutionName = (fullName: unknown): string => {
    // Handle cases where fullName is not a valid string
    if (!fullName) {
      return 'N/A';
    }
    
    // Convert to string if it's not already a string
    let nameStr: string;
    try {
      if (typeof fullName === 'object' && fullName !== null) {
        // If it's an object, try to get a name property or stringify it
        const obj = fullName as Record<string, unknown>;
        nameStr = String(obj.name || obj.institution) || JSON.stringify(fullName);
      } else {
        nameStr = String(fullName);
      }
    } catch (error) {
      console.warn('Error converting institution name to string:', fullName, error);
      return 'N/A';
    }
    
    // Additional safety check to ensure we have a proper string
    nameStr = nameStr.trim();
    if (!nameStr || nameStr === 'null' || nameStr === 'undefined') {
      return 'N/A';
    }
    
    const found = predefinedUniversities.find(uni => uni.name === nameStr);
    if (found && found.alternateName) {
      return found.alternateName; // Return predefined short name/acronym
    }
    
    // If not found, generate acronym (first letter of each word)
    try {
      return nameStr
        .split(' ')
        .filter(word => word && word.length > 0) // Filter out empty words
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();
    } catch (error) {
      console.warn('Error processing institution name:', fullName, error);
      return 'N/A';
    }
  };