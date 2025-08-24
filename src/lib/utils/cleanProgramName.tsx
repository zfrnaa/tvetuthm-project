export const cleanProgramName = (name: string | undefined | null): string => {
    if (!name) return "N/A";
    return name
      .replace(/bachelor of|with honours|with hons|dengan kepujian|sarjana muda/gi, '') // Remove keywords (case-insensitive)
      .replace(/\(\)/g, '') // Remove empty parentheses if any
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim() || "N/A"; // Return cleaned name or N/A if cleaning results in empty string
  };