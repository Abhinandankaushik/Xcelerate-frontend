
export interface Industry {
    _id?: string; // MongoDB ID
    id?: string;  // Static ID (optional now)
    name: string;
    bounds: number[][]; // Array of points forming the polygon/bounds
    blueprintUrl: string;
    complianceScore: number;
    progressPhotos: string[];
}

export const INDUSTRIES: Industry[] = [
    {
        name: "Rikhi",
        bounds: [
            [22.981199, 82.909488], [22.981190, 82.911068], [22.980184, 82.910621], [22.980117, 82.910623],
            [22.980009, 82.911041], [22.979998, 82.911922], [22.979889, 82.911917], [22.979858, 82.911959],
            [22.979836, 82.912070], [22.978445, 82.912083], [22.978490, 82.912187], [22.978159, 82.912310],
            [22.978216, 82.912670], [22.977961, 82.912733], [22.977697, 82.911358], [22.977738, 82.909400],
            [22.981162, 82.909483]
        ],
        blueprintUrl: "https://res.cloudinary.com/du1v5ogcn/image/upload/v1771023108/map_a4-landscape_600dpi_2026-02-13_03-19-13_cgbjdk.png",
        complianceScore: 0,
        progressPhotos: ["https://res.cloudinary.com/du1v5ogcn/image/upload/v1771026386/Screenshot_2026-02-14_051136_my17li.png", "https://res.cloudinary.com/du1v5ogcn/image/upload/v1771030219/Gemini_Generated_Image_58akvj58akvj58ak_erbmrj.png"]
    },
    {
        name: "Tilda",
        bounds: [
            [21.493681, 81.803922], [21.494206, 81.804694], [21.494631, 81.804702], [21.494624, 81.804844],
            [21.494647, 81.804899], [21.494344, 81.804935], [21.495818, 81.807519], [21.495956, 81.807938],
            [21.496389, 81.808921], [21.497052, 81.810402], [21.497387, 81.810852], [21.497694, 81.810933],
            [21.497844, 81.810923], [21.497907, 81.811491], [21.497636, 81.811697], [21.497814, 81.812258],
            [21.497635, 81.812367], [21.498666, 81.815219], [21.497590, 81.815753], [21.497730, 81.816069],
            [21.497545, 81.816239], [21.497410, 81.816050], [21.497398, 81.816170], [21.497072, 81.816271],
            [21.497001, 81.816181], [21.497008, 81.816298], [21.496499, 81.816437], [21.496335, 81.814854],
            [21.495810, 81.815001], [21.495345, 81.814497], [21.495296, 81.814699], [21.494977, 81.814622],
            [21.495297, 81.813699], [21.493954, 81.813052], [21.493862, 81.813187], [21.493732, 81.813193],
            [21.493732, 81.812909], [21.493276, 81.812678], [21.493127, 81.808231], [21.492868, 81.808227],
            [21.492818, 81.808061], [21.492841, 81.807980], [21.493125, 81.807984], [21.493024, 81.804740],
            [21.493696, 81.803906]
        ],
        blueprintUrl: "https://res.cloudinary.com/du1v5ogcn/image/upload/v1771023109/map_a4-landscape_600dpi_2026-02-13_17-17-07_uxbybj.png",
        complianceScore: 0,
        progressPhotos: ["https://res.cloudinary.com/du1v5ogcn/image/upload/v1771026386/Screenshot_2026-02-14_051213_l68dqu.png", "https://res.cloudinary.com/du1v5ogcn/image/upload/v1771030213/Gemini_Generated_Image_egyx1zegyx1zegyx_nmlkoi.png"]
    },
    {
        name: "Barbaspur",
        bounds: [
            [23.068491, 82.591706], [23.067902, 82.592981], [23.066995, 82.592788], [23.066977, 82.592829],
            [23.067816, 82.593167], [23.067716, 82.593441], [23.067075, 82.593318], [23.066713, 82.593391],
            [23.065678, 82.596094], [23.064818, 82.595698], [23.064156, 82.595282], [23.064315, 82.593973],
            [23.065918, 82.593289], [23.065927, 82.592968], [23.064353, 82.592823], [23.064362, 82.591717],
            [23.065899, 82.591446], [23.066001, 82.591665], [23.068465, 82.591707]
        ],
        blueprintUrl: "https://res.cloudinary.com/du1v5ogcn/image/upload/v1771023109/map_a4-landscape_300dpi_2026-02-12_11-20-14_dwn4io.png",
        complianceScore: 0,
        progressPhotos: ["https://res.cloudinary.com/du1v5ogcn/image/upload/v1771026386/Screenshot_2026-02-14_051308_tapotr.png", "https://res.cloudinary.com/du1v5ogcn/image/upload/v1771030076/Gemini_Generated_Image_qx1cddqx1cddqx1c_hlpcem.png"]
    },
    {
        name: "Hathkera- bidbida",
        bounds: [
            [21.927063, 81.928541], [21.926231, 81.930303], [21.925275, 81.931978],
            [21.927993, 81.932786], [21.928241, 81.931988], [21.929549, 81.930626],
            [21.929191, 81.930150], [21.929110, 81.930490], [21.927074, 81.928540]
        ],
        blueprintUrl: "https://res.cloudinary.com/du1v5ogcn/image/upload/v1771023115/map_a4-landscape_600dpi_2026-02-13_14-30-55_craknj.png",
        complianceScore: 0,
        progressPhotos: ["https://res.cloudinary.com/du1v5ogcn/image/upload/v1771026386/Screenshot_2026-02-14_051352_mmcsyv.png", "https://res.cloudinary.com/du1v5ogcn/image/upload/v1771030091/Gemini_Generated_Image_qhbr96qhbr96qhbr_fmozmi.png"]
    },
    {
        name: "Farsabahar",
        bounds: [
            [22.516767, 83.854138], [22.516776, 83.854631], [22.516812, 83.854815], [22.516802, 83.854892],
            [22.517193, 83.856891], [22.519262, 83.856443], [22.518966, 83.854783], [22.518620, 83.854879],
            [22.518591, 83.854844], [22.518615, 83.854735], [22.518592, 83.854407], [22.518470, 83.854095],
            [22.518437, 83.853917], [22.518221, 83.853832], [22.516760, 83.854147], [22.516795, 83.854365]
        ],
        blueprintUrl: "https://res.cloudinary.com/du1v5ogcn/image/upload/v1771023108/map_a4-landscape_600dpi_2026-02-13_03-23-59_xaohwl.png",
        complianceScore: 0,
        progressPhotos: ["https://res.cloudinary.com/du1v5ogcn/image/upload/v1771026386/Screenshot_2026-02-14_051522_tjg96v.png", "https://res.cloudinary.com/du1v5ogcn/image/upload/v1771030073/Gemini_Generated_Image_s4axzis4axzis4ax_tgf6nd.png"]
    },
    {
        name: "ulakiya",
        bounds: [
            [22.677475, 83.507698], [22.677583, 83.508478], [22.676154, 83.510390], [22.675896, 83.511539],
            [22.674474, 83.510761], [22.674448, 83.510310], [22.674385, 83.509834], [22.674452, 83.509167],
            [22.674657, 83.508503], [22.675706, 83.507845], [22.676495, 83.507689], [22.676586, 83.507550],
            [22.676758, 83.507545], [22.677463, 83.507698]
        ],
        blueprintUrl: "https://res.cloudinary.com/du1v5ogcn/image/upload/v1771023109/map_a4-landscape_600dpi_2026-02-13_03-26-01_ukxhpd.png",
        complianceScore: 0,
        progressPhotos: ["https://res.cloudinary.com/du1v5ogcn/image/upload/v1771026386/Screenshot_2026-02-14_051434_bhuhcx.png", "https://res.cloudinary.com/du1v5ogcn/image/upload/v1771030088/Gemini_Generated_Image_vbj74wvbj74wvbj7_jvoljd.png"]
    }
];