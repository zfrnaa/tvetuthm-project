export const starDescriptions = [
    { stars: 1, text: "Kurang Memuaskan", description: "Program ini tidak memenuhi jangkaan dalam banyak aspek. Kelemahan serius dalam:\n(i) Jaringan Industri\n(ii) Pembangunan dan Penyampaian Program\n(iii) Kualiti Tenaga Pengajar dan Sumber TVET\n(iv) Akreditasi dan Pengiktirafan\n(v) Kebolehpasaran Graduan \nyang memerlukan penambahbaikan yang besar untuk meningkatkan kualiti keseluruhan program" },
    { stars: 2, text: "Memuaskan", description: "Program ini memenuhi keperluan asas tetapi mempunyai beberapa kelemahan yang ketara yang menjejaskan kualiti program keseluruhan. Penambahbaikan penting diperlukan dalam beberapa bidang." },
    { stars: 3, text: "Baik", description: "Program ini memenuhi standard yang ditetapkan, tetapi terdapat beberapa aspek penting yang memerlukan penambahbaikan untuk mencapai tahap kecemerlangan yang lebih tinggi." },
    { stars: 4, text: "Sangat Baik", description: "Program ini sangat baik dalam kebanyakan aspek tetapi mungkin mempunyai beberapa bidang kecil yang memerlukan penambahbaikan. Keseluruhannya, ia merupakan program yang kualitinya hampir sempurna." },
    { stars: 5, text: "Cemerlang", description: "Program ini mencapai kecemerlangan dalam semua aspek, termasuk:\n(i) Jaringan Industri\n(ii) Pembangunan dan Penyampaian Program\n(iii) Kualiti Tenaga Pengajar dan Sumber TVET\n(iv) Akreditasi dan Pengiktirafan dan\nKebolehpasaran Graduan. Tiada aspek yang perlu diperbaiki." }
];

export const tableCIPP = [
    { component: "Konteks", score: "x/12", percentage: "x/12 x 100" },
    { component: "Input", score: "x/50", percentage: "x/50 x 100" },
    { component: "Proses", score: "x/62", percentage: "x/62 x 100" },
    { component: "Produk", score: "x/11", percentage: "x/11 x 100" }
];

export const tableKluster = [
    { component: "Jaringan Industri", score: "x/22", percentage: "x/22 x 100" },
    { component: "Pembangunan dan Penyampaian Kurikulum", score: "x/75", percentage: "x/75 x 100" },
    { component: "Kualiti Tenaga Pengajar dan Sumber TVET", score: "x/27", percentage: "x/27 x 100" },
    { component: "Akreditasi dan Pengiktirafan", score: "x/3", percentage: "x/3 x 100" },
    { component: "Kebolehpasaran Graduan", score: "x/8", percentage: "x/8 x 100" }
];

export const headerKluster = [
    { id: 'component', field: 'component', label: 'Komponen CIPP' },
    { id: 'score', field: 'score', label: 'Skor' },
    { id: 'percentage', field: 'percentage', label: 'Skor dalam Peratusan' }
];

export const headerCIPP = [
    { id: 'component', field: 'component', label: 'Komponen CIPP' },
    { id: 'score', field: 'score', label: 'Skor' },
    { id: 'percentage', field: 'percentage', label: 'Skor dalam Peratusan' }
];