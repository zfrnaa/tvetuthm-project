// Model for FPTV UTHM Programme List

export interface Programme {
    id: string;
    name: string;
    shortName: string;
    faculty: string;
}

// List of all programmes offered by FPTV UTHM (Real Data)
export const programmes: Programme[] = [
    {
        id: "BGM",
        name: "Sarjana Muda Pendidikan Vokasional (Pemesinan Am) dengan Kepujian",
        shortName: "Pendidikan Vokasional Pemesinan Am",
        faculty: "FPTV",
    },
    {
        id: "BBC",
        name: "Sarjana Muda Pendidikan Vokasional (Pembinaan Bangunan) dengan Kepujian",
        shortName: "Pendidikan Vokasional Pembinaan Bangunan",
        faculty: "FPTV",
    },
    {
        id: "BVC",
        name: "Sarjana Muda Pendidikan Vokasional (Katering) dengan Kepujian",
        shortName: "Pendidikan Vokasional Katering",
        faculty: "FPTV",
    },
    {
        id: "BWM",
        name: "Sarjana Muda Pendidikan Vokasional (Kimpalan dan Fabrikasi Logam) dengan Kepujian",
        shortName: "Pendidikan Vokasional Kimpalan dan Fabrikasi Logam",
        faculty: "FPTV",
    },
    {
        id: "BEE",
        name: "Sarjana Muda Pendidikan Vokasional (Elektrik dan Elektronik) dengan Kepujian",
        shortName: "Pendidikan Vokasional Elektrik dan Elektronik",
        faculty: "FPTV",
    },
    {
        id: "BCM",
        name: "Sarjana Muda Pendidikan Vokasional (Multimedia Kreatif) dengan Kepujian",
        shortName: "Pendidikan Vokasional Multimedia Kreatif",
        faculty: "FPTV",
    },
    {
        id: "BRAC",
        name: "Sarjana Muda Pendidikan Vokasional (Penyejukan dan Penyamanan Udara) dengan Kepujian",
        shortName: "Pendidikan Vokasional Penyejukan dan Penyamanan Udara",
        faculty: "FPTV",
    },
    {
        id: "BFST",
        name: "Sarjana Muda Teknologi Perkhidmatan Makanan dengan Kepujian",
        shortName: "Teknologi Perkhidmatan Makanan",
        faculty: "FPTV",
    },
    {
        id: "BTBC",
        name: "Sarjana Muda Teknologi dalam Pembinaan Bangunan dengan Kepujian",
        shortName: "Teknologi Pembinaan Bangunan",
        faculty: "FPTV",
    },
    {
        id: "BTRA",
        name: "Sarjana Muda Teknologi dalam Penyejukan dan Penyamanan Udara dengan Kepujian",
        shortName: "Teknologi Penyejukan dan Penyamanan Udara",
        faculty: "FPTV",
    },
    {
        id: "BTIA",
        name: "Sarjana Muda Teknologi dalam Automasi Elektronik Industri dengan Kepujian",
        shortName: "Teknologi Automasi Elektronik Industri",
        faculty: "FPTV",
    },
    {
        id: "BTEM",
        name: "Sarjana Muda Teknologi dalam Sistem Penyelenggaraan Elektrik dengan Kepujian",
        shortName: "Teknologi Sistem Penyelenggaraan Elektrik",
        faculty: "FPTV",
    },
    {
        id: "BTWD",
        name: "Sarjana Muda Teknologi dalam Kimpalan dengan Kepujian",
        shortName: "Teknologi Kimpalan",
        faculty: "FPTV",
    },
    {
        id: "BTIM",
        name: "Sarjana Muda Teknologi dalam Pemesinan Industri dengan Kepujian",
        shortName: "Teknologi Pemesinan Industri",
        faculty: "FPTV",
    },
    {
        id: "MTCV",
        name: "Sarjana dalam Pendidikan Teknikal (Kejuruteraan Awam)",
        shortName: "Sarjana Kejuruteraan Awam",
        faculty: "FPTV",
    },
    {
        id: "MTEE",
        name: "Sarjana dalam Pendidikan Teknikal (Kejuruteraan Elektrik)",
        shortName: "Sarjana Kejuruteraan Elektrik",
        faculty: "FPTV",
    },
    {
        id: "MTMC",
        name: "Sarjana dalam Pendidikan Teknikal (Kejuruteraan Mekanikal)",
        shortName: "Sarjana Kejuruteraan Mekanikal",
        faculty: "FPTV",
    },
    {
        id: "MIDT",
        name: "Sarjana dalam Pendidikan Teknikal (Reka Bentuk Pengajaran dan Teknologi)",
        shortName: "Sarjana Reka Bentuk Pengajaran dan Teknologi",
        faculty: "FPTV",
    },
    {
        id: "MTVEC",
        name: "Sarjana dalam Pendidikan Teknikal dan Vokasional (Kerja Kursus)",
        shortName: "Sarjana Pendidikan Teknikal dan Vokasional (K)",
        faculty: "FPTV",
    },
    {
        id: "MTVER",
        name: "Sarjana dalam Pendidikan Teknikal dan Vokasional (Penyelidikan)",
        shortName: "Sarjana Pendidikan Teknikal dan Vokasional (P)",
        faculty: "FPTV",
    },
    {
        id: "DoE",
        name: "Doktor Pendidikan",
        shortName: "Doktor Pendidikan",
        faculty: "FPTV",
    },
    {
        id: "PhED",
        name: "Doktor Falsafah dalam Pendidikan",
        shortName: "Doktor Falsafah dalam Pendidikan",
        faculty: "FPTV",
    },
    {
        id: "PhTVE",
        name: "Doktor Falsafah dalam Pendidikan Teknikal dan Vokasional",
        shortName: "Doktor Falsafah dalam Pendidikan Teknikal dan Vokasional",
        faculty: "FPTV",
    },
];

export const getProgrammeById = (id: string): Programme | undefined => {
    return programmes.find(programme => programme.id === id);
};

export const getAllProgrammes = (): Programme[] => {
    return programmes;
};
