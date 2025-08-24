import { facultyNameMap } from "../../../constants/programsUFac";

export function getFacultyShortName(fullName: string): string {
    const found = facultyNameMap.find(f => f.full === fullName);
    return found ? found.short : fullName;
  }