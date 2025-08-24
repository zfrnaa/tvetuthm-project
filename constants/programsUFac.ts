import { programmes } from "../model/listOfProgramName";

export const predefinedUniversities = [
    { name: "Universiti Tun Hussein Onn Malaysia", alternateName: "UTHM" },
    { name: "Universiti Malaysia Pahang Al-Sultan Abdullah", alternateName: "UMPSA"},
    { name: "Universiti Teknikal Melaka", alternateName: "UTEM"},
    { name: "Universiti Malaysia Perlis", alternateName: "UNIMAP"},
    { name: "Universiti Kuala Lumpur", alternateName: "UniKL"},
];
export const facultyNameMap = [
    { full: "Fakulti Pendidikan Teknikal dan Vokasional", short: "FPTV" },
    { full: "Fakulti Teknologi Pengurusan dan Perniagaan", short: "FPTP" },
    { full: "Fakulti Kejuruteraan Elektrik dan Elektronik", short: "FKEE" },
    { full: "Fakulti Kejuruteraan Awam dan Alam Bina", short: "FKAAB" },
    { full: "Fakulti Kejuruteraan Mekanikal dan Pembuatan", short: "FKMP" },
    { full: "Fakulti Teknologi Kejuruteraan", short: "FTK" },
];

// Export just the short names for filters, etc.
export const predefinedFaculties = facultyNameMap.map(f => f.short);

export const predefinedPrograms = programmes.map(program => ({
    id: program.id,
    name: program.name,
}));