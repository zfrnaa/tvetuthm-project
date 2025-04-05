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
        name: "Bachelor of Vocational Education (General Machining) with Honours",
        shortName: "Vocational General Machining",
        faculty: "FPTV",
    },
    {
        id: "BBC",
        name: "Bachelor of Vocational Education (Building Construction) with Honours",
        shortName: "Vocational Building Construction",
        faculty: "FPTV",
    },
    {
        id: "BVC",
        name: "Bachelor of Vocational Education (Catering) with Honours",
        shortName: "Vocational Catering",
        faculty: "FPTV",
    },
    {
        id: "BWM",
        name: "Bachelor of Vocational Education (Welding and Metal Fabrication) with Honours",
        shortName: "Vocational Welding and Metal Fabrication",
        faculty: "FPTV",
    },
    {
        id: "BEE",
        name: "Bachelor of Vocational Education (Electrical and Electronic) with Honours",
        shortName: "Vocational Electrical and Electronic",
        faculty: "FPTV",
    },
    {
        id: "BCM",
        name: "Bachelor of Vocational Education (Creative Multimedia) with Honours",
        shortName: "Vocational Creative Multimedia",
        faculty: "FPTV",
    },
    {
        id: "BRAC",
        name: "Bachelor of Vocational Education (Refrigeration and Air Conditioning) with Honours",
        shortName: "Vocational Refrigeration and Air Conditioning",
        faculty: "FPTV",
    },

    {
        id: "BFST",
        name: "Bachelor in Food Service Technology with Honours",
        shortName: "Food Service Technology",
        faculty: "FPTV",
    },
    {
        id: "BTBC",
        name: "Bachelor of Technology in Building Construction with Honours",
        shortName: "Technology Building Construction",
        faculty: "FPTV",
    },
    {
        id: "BTRA",
        name: "Bachelor of Technology in Refrigeration and Air Conditioning with Honours",
        shortName: "Technology Refrigeration and Air Conditioning",
        faculty: "FPTV",
    },
    {
        id: "BTIA",
        name: "Bachelor of Technology in Industrial Electronic Automation with Honours",
        shortName: "Technology Industrial Electronic Automation",
        faculty: "FPTV",
    },
    {
        id: "BTEM",
        name: "Bachelor of Technology in Electrical Maintenance System with Honours",
        shortName: "Technology Electrical Maintenance System",
        faculty: "FPTV",
    },
        {
        id: "BTWD",
        name: "Bachelor of Technology in Welding with Honours",
        shortName: "Technology Welding",
        faculty: "FPTV",
    },
    {
        id: "BTIM",
        name: "Bachelor of Technology in Industrial Machining with Honours",
        shortName: "Technology Industrial Machining",
        faculty: "FPTV",
    },
    {
        id: "MTCV",
        name: "Master in Technical Education (Civil Engineering)",
        shortName: "Master Civil Engineering",
        faculty: "FPTV",
    },
    {
        id: "MTEE",
        name: "Master in Technical Education (Electrical Engineering)",
        shortName: "Master Electrical Engineering",
        faculty: "FPTV",
    },
    {
        id: "MTMC",
        name: "Master in Technical Education (Mechanical Engineering)",
        shortName: "Master Mechanical Engineering",
        faculty: "FPTV",
    },
    {
        id: "MIDT",
        name: "Master in Technical Education (Instructional Design and Technology)",
        shortName: "Master Instructional Design and Technology",
        faculty: "FPTV",
    },
    {
        id: "MTVEC",
        name: "Master in Technical and Vocational Education (Coursework)",
        shortName: "Master Technical and Vocational Education (C)",
        faculty: "FPTV",
    },
    {
        id: "MTVER",
        name: "Master in Technical and Vocational Education (Research)",
        shortName: "Master Technical and Vocational Education (R)",
        faculty: "FPTV",
    },
    {
        id: "DoE",
        name: "Doctor of Education",
        shortName: "Doctor of Education",
        faculty: "FPTV",
    },
    {
        id: "PhED",
        name: "Doctor of Philosophy in Education",
        shortName: "Philosophy(Dr.) in Education",
        faculty: "FPTV",
    },
    {
        id: "PhTVE",
        name: "Doctor of Philosophy in Technical and Vocational Education",
        shortName: "Philosophy(Dr.) in Technical and Vocational Education",
        faculty: "FPTV",
    },
];

export const getProgrammeById = (id: string): Programme | undefined => {
    return programmes.find(programme => programme.id === id);
};

export const getAllProgrammes = (): Programme[] => {
    return programmes;
};


// Here are all the short names for easy copying:
// Vocational General Machining
// Vocational Building Construction
// Vocational Catering
// Vocational Welding and Metal Fabrication
// Vocational Electrical and Electronic
// Vocational Creative Multimedia
// Vocational Refrigeration and Air Conditioning
// Food Service Technology
// Technology Building Construction
// Technology Refrigeration and Air Conditioning
// Technology Industrial Electronic Automation
// Technology Electrical Maintenance System
// Technology Welding
// Technology Industrial Machining
// Master Civil Engineering
// Master Electrical Engineering
// Master Mechanical Engineering
// Master Instructional Design and Technology
// Master Technical and Vocational Education (C)
// Master Technical and Vocational Education (R)
// Doctor of Education
// Philosophy(Dr.) in Education
// Philosophy(Dr.) in Technical and Vocational Education