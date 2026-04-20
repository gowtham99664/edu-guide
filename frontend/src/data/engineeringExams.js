// Comprehensive Entrance Exams Data - Engineering
const engineeringExams = [
  {
    id: "jee_main",
    name: "JEE Main (Joint Entrance Examination Main)",
    category: "Engineering",
    subcategory: "National",
    conductedBy: "National Testing Agency (NTA)",
    level: "Undergraduate",
    eligibility: "Passed Class 12 or equivalent with Physics, Mathematics, and one of Chemistry/Biology/Biotechnology/Technical Vocational. No age limit. Can attempt for 3 consecutive years.",
    examPattern: {
      papers: [
        { name: "Paper 1 (B.E./B.Tech)", sections: "Physics (30 Qs), Chemistry (30 Qs), Mathematics (30 Qs). Each section: 20 MCQ + 10 Numerical (attempt 5). Total 90 questions, attempt 75.", marks: 300, duration: "3 hours" },
        { name: "Paper 2A (B.Arch)", sections: "Mathematics, Aptitude, Drawing. Total 82 questions.", marks: 400, duration: "3 hours" },
        { name: "Paper 2B (B.Planning)", sections: "Mathematics, Aptitude, Planning. Total 105 questions.", marks: 400, duration: "3 hours" }
      ],
      marking: "+4 for correct MCQ, -1 for wrong MCQ. Numerical: +4 correct, 0 wrong.",
      mode: "Computer Based Test (CBT). Paper 2A Drawing: Pen and paper."
    },
    syllabus: {
      physics: ["Units & Measurements", "Kinematics", "Laws of Motion", "Work, Energy & Power", "Rotational Motion", "Gravitation", "Properties of Solids & Liquids", "Thermodynamics", "Kinetic Theory of Gases", "Oscillations & Waves", "Electrostatics", "Current Electricity", "Magnetic Effects of Current & Magnetism", "Electromagnetic Induction & AC", "Electromagnetic Waves", "Optics", "Dual Nature of Matter & Radiation", "Atoms & Nuclei", "Electronic Devices", "Communication Systems"],
      chemistry: ["Some Basic Concepts in Chemistry", "Atomic Structure", "Chemical Bonding", "Chemical Thermodynamics", "Solutions", "Equilibrium", "Redox Reactions & Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "Classification of Elements", "Hydrogen", "s-Block Elements", "p-Block Elements", "d and f Block Elements", "Coordination Compounds", "Organic Chemistry Basics", "Hydrocarbons", "Organic Compounds with Functional Groups", "Biomolecules", "Polymers", "Chemistry in Everyday Life", "Environmental Chemistry"],
      mathematics: ["Sets, Relations & Functions", "Complex Numbers", "Matrices & Determinants", "Permutations & Combinations", "Binomial Theorem", "Sequences & Series", "Limit, Continuity & Differentiability", "Integral Calculus", "Differential Equations", "Coordinate Geometry", "3D Geometry", "Vector Algebra", "Statistics & Probability", "Trigonometry", "Mathematical Reasoning"]
    },
    frequency: "Twice a year (January and April sessions)",
    applicationPeriod: "November-December (Session 1), February-March (Session 2)",
    examMonth: "January and April",
    website: "https://jeemain.nta.nic.in",
    acceptedBy: "NITs (31), IIITs (26), GFTIs (33), and other state/private colleges accepting JEE Main scores. Also used as eligibility for JEE Advanced.",
    importantNotes: "Top 2,50,000 qualifiers from JEE Main are eligible for JEE Advanced. Best of two session scores considered. Normalization using percentile scores."
  },
  {
    id: "jee_advanced",
    name: "JEE Advanced (Joint Entrance Examination Advanced)",
    category: "Engineering",
    subcategory: "National",
    conductedBy: "One of the 7 Zonal IITs (rotational basis)",
    level: "Undergraduate",
    eligibility: "Must be in top 2,50,000 in JEE Main. Must have passed Class 12 in the year of exam or the year before. Maximum 2 attempts in consecutive years. Age: Must be born on or after October 1 (25 years back).",
    examPattern: {
      papers: [
        { name: "Paper 1", sections: "Physics, Chemistry, Mathematics. Multiple question types: MCQ single correct, MCQ multiple correct, Integer type, Matrix match, Paragraph-based.", marks: "Varies (typically 180-186)", duration: "3 hours" },
        { name: "Paper 2", sections: "Same subjects, different questions.", marks: "Varies (typically 180-186)", duration: "3 hours" }
      ],
      marking: "Varies by question type. +3/+4 for correct, -1 for wrong (MCQ single). Partial marking for multiple correct.",
      mode: "Computer Based Test (CBT)"
    },
    syllabus: {
      physics: ["General Physics", "Mechanics", "Thermal Physics", "Electricity & Magnetism", "Optics", "Modern Physics"],
      chemistry: ["Physical Chemistry (Gaseous/Liquid state, Atomic structure, Chemical bonding, Chemical equilibrium, Electrochemistry, Chemical kinetics, Solid state, Nuclear chemistry, Solutions, Surface chemistry)", "Inorganic Chemistry (Isolation/purification of metals, Groups classification, Hydrogen, Transition elements, Ores/Minerals, Extractive metallurgy, Coordination compounds)", "Organic Chemistry (Concepts of organic chemistry, Alkanes/Alkenes/Alkynes, Reactions of benzene, Phenols, Carboxylic acids, Amines, Carbohydrates, Amino acids, Polymers)"],
      mathematics: ["Algebra", "Trigonometry", "Analytical Geometry (2D & 3D)", "Differential Calculus", "Integral Calculus", "Vectors"]
    },
    frequency: "Once a year",
    applicationPeriod: "April-May",
    examMonth: "May/June",
    website: "https://jeeadv.ac.in",
    acceptedBy: "All 23 IITs, ISM Dhanbad, IISER (some seats), IIST Thiruvananthapuram",
    importantNotes: "Considered toughest undergraduate entrance exam in the world. About 10,000-12,000 seats in all IITs combined."
  },
  {
    id: "bitsat",
    name: "BITSAT (Birla Institute of Technology & Science Admission Test)",
    category: "Engineering",
    subcategory: "University",
    conductedBy: "BITS Pilani",
    level: "Undergraduate",
    eligibility: "Class 12 with PCM. Minimum 75% aggregate in PCM. First attempt at Class 12.",
    examPattern: {
      papers: [{ name: "BITSAT", sections: "Physics (30), Chemistry (30), Mathematics (45), English Proficiency (15), Logical Reasoning (10). Total 130 questions.", marks: 390, duration: "3 hours" }],
      marking: "+3 correct, -1 wrong. If all 130 answered correctly, bonus 12 questions.",
      mode: "Computer Based Test"
    },
    syllabus: { general: ["Physics, Chemistry, Mathematics at Class 11-12 NCERT level", "English Proficiency: Grammar, Vocabulary, Comprehension, Verbal Ability", "Logical Reasoning: Verbal/Non-verbal"] },
    frequency: "Once a year (multiple sessions over several days)",
    applicationPeriod: "January-April",
    examMonth: "May-June",
    website: "https://www.bitsadmission.com",
    acceptedBy: "BITS Pilani (Pilani, Goa, Hyderabad campuses)",
    importantNotes: "One of India's top private engineering institutions. Strong focus on dual degree programs. Industry partnerships with major tech companies."
  },
  {
    id: "viteee",
    name: "VITEEE (VIT Engineering Entrance Examination)",
    category: "Engineering",
    subcategory: "University",
    conductedBy: "Vellore Institute of Technology",
    level: "Undergraduate",
    eligibility: "Class 12 with PCM or PCB. Minimum 60% in PCM/PCB.",
    examPattern: {
      papers: [{ name: "VITEEE", sections: "Mathematics/Biology (40), Physics (35), Chemistry (35), Aptitude (10), English (5). Total 125 questions.", marks: 125, duration: "2.5 hours" }],
      marking: "+1 for correct, no negative marking.",
      mode: "Computer Based Test"
    },
    syllabus: { general: ["Class 11-12 level Physics, Chemistry, Mathematics/Biology", "Aptitude: Data interpretation, Data sufficiency", "English: Grammar, Comprehension"] },
    frequency: "Once a year",
    applicationPeriod: "November-March",
    examMonth: "April-May",
    website: "https://viteee.vit.ac.in",
    acceptedBy: "VIT Vellore, VIT Chennai, VIT Bhopal, VIT AP",
    importantNotes: "One of the largest private engineering entrance exams. No negative marking makes it student-friendly."
  },
  {
    id: "srmjee",
    name: "SRMJEEE (SRM Joint Engineering Entrance Examination)",
    category: "Engineering",
    subcategory: "University",
    conductedBy: "SRM Institute of Science and Technology",
    level: "Undergraduate",
    eligibility: "Class 12 with PCM/PCB. Minimum 50% in PCM.",
    examPattern: {
      papers: [{ name: "SRMJEEE", sections: "Physics (35), Chemistry (35), Mathematics/Biology (40), English (5), Aptitude (5). Total 120 questions.", marks: 120, duration: "2.5 hours" }],
      marking: "+1 correct, no negative marking.",
      mode: "Computer Based Test"
    },
    frequency: "Once a year (multiple phases)",
    applicationPeriod: "November-May",
    examMonth: "April-June",
    website: "https://www.srmist.edu.in",
    acceptedBy: "SRM IST (Kattankulathur, Ramapuram, Vadapalani, NCR, AP, Sikkim campuses)"
  },
  {
    id: "comedk",
    name: "COMEDK UGET (Consortium of Medical, Engineering and Dental Colleges of Karnataka)",
    category: "Engineering",
    subcategory: "State (Karnataka)",
    conductedBy: "COMEDK",
    level: "Undergraduate",
    eligibility: "Class 12 with PCM from any recognized board. Minimum 45% (40% for SC/ST/OBC of Karnataka).",
    examPattern: {
      papers: [{ name: "COMEDK UGET", sections: "Physics (60), Chemistry (60), Mathematics (60). Total 180 MCQs.", marks: 180, duration: "3 hours" }],
      marking: "+1 correct, no negative marking.",
      mode: "Computer Based Test"
    },
    frequency: "Once a year",
    applicationPeriod: "January-April",
    examMonth: "May",
    website: "https://www.comedk.org",
    acceptedBy: "150+ private engineering colleges in Karnataka",
    importantNotes: "Does not cover government engineering colleges in Karnataka (those use KCET scores)."
  },
  {
    id: "mhtcet",
    name: "MHT CET (Maharashtra Common Entrance Test)",
    category: "Engineering",
    subcategory: "State (Maharashtra)",
    conductedBy: "State CET Cell, Maharashtra",
    level: "Undergraduate",
    eligibility: "Class 12 from Maharashtra board or domiciled in Maharashtra. PCM for engineering.",
    examPattern: {
      papers: [{ name: "PCM Group", sections: "Physics (50), Chemistry (50), Mathematics (50). Total 150 questions.", marks: 200, duration: "3 hours 10 min" }],
      marking: "+2 for Maths correct, +1 for Phy/Chem correct. No negative marking.",
      mode: "Computer Based Test"
    },
    frequency: "Once a year",
    applicationPeriod: "February-March",
    examMonth: "May",
    website: "https://cetcell.mahacet.org",
    acceptedBy: "All engineering colleges in Maharashtra (government, aided, unaided)",
    importantNotes: "One of the largest state-level engineering exams. Also used for Pharmacy admissions."
  },
  {
    id: "kcet",
    name: "KCET (Karnataka Common Entrance Test)",
    category: "Engineering",
    subcategory: "State (Karnataka)",
    conductedBy: "Karnataka Examinations Authority (KEA)",
    level: "Undergraduate",
    eligibility: "Class 12 from Karnataka board or studied in Karnataka for 7+ years. PCM for engineering.",
    examPattern: {
      papers: [{ name: "KCET", sections: "Biology (60), Mathematics (60), Physics (60), Chemistry (60). Each paper: 60 MCQs, 80 min.", marks: 240, duration: "80 min per paper" }],
      marking: "+1 correct, no negative marking.",
      mode: "OMR based (Offline)"
    },
    frequency: "Once a year",
    applicationPeriod: "January-February",
    examMonth: "April-May",
    website: "https://cetonline.karnataka.gov.in/kea",
    acceptedBy: "Government and aided engineering/medical colleges in Karnataka"
  },
  {
    id: "ap_eamcet",
    name: "AP EAMCET (Andhra Pradesh Engineering, Agriculture & Medical Common Entrance Test)",
    category: "Engineering",
    subcategory: "State (Andhra Pradesh)",
    conductedBy: "JNTU (on behalf of APSCHE)",
    level: "Undergraduate",
    eligibility: "Class 12 with relevant subjects. AP/TS resident or studied in AP.",
    examPattern: {
      papers: [{ name: "Engineering", sections: "Mathematics (80), Physics (40), Chemistry (40). Total 160 MCQs.", marks: 160, duration: "3 hours" }],
      marking: "+1 correct, no negative marking.",
      mode: "Computer Based Test"
    },
    frequency: "Once a year",
    applicationPeriod: "March-April",
    examMonth: "May-June",
    website: "https://cets.apsche.ap.gov.in",
    acceptedBy: "All engineering colleges in Andhra Pradesh"
  },
  {
    id: "ts_eamcet",
    name: "TS EAMCET (Telangana State Engineering, Agriculture & Medical Common Entrance Test)",
    category: "Engineering",
    subcategory: "State (Telangana)",
    conductedBy: "JNTU Hyderabad (on behalf of TSCHE)",
    level: "Undergraduate",
    eligibility: "Class 12 with relevant subjects. TS resident or studied in TS.",
    examPattern: {
      papers: [{ name: "Engineering", sections: "Mathematics (80), Physics (40), Chemistry (40). Total 160 MCQs.", marks: 160, duration: "3 hours" }],
      marking: "+1 correct, no negative marking.",
      mode: "Computer Based Test"
    },
    frequency: "Once a year",
    applicationPeriod: "March-April",
    examMonth: "May",
    website: "https://eamcet.tsche.ac.in",
    acceptedBy: "All engineering colleges in Telangana"
  },
  {
    id: "wbjee",
    name: "WBJEE (West Bengal Joint Entrance Examination)",
    category: "Engineering",
    subcategory: "State (West Bengal)",
    conductedBy: "West Bengal Joint Entrance Examinations Board",
    level: "Undergraduate",
    eligibility: "Class 12 with PCM. Domicile of WB or studied in WB.",
    examPattern: {
      papers: [
        { name: "Paper 1", sections: "Mathematics (75 MCQs)", marks: 100, duration: "2 hours" },
        { name: "Paper 2", sections: "Physics (40) + Chemistry (40) MCQs", marks: 100, duration: "2 hours" }
      ],
      marking: "+1/+2 for correct (category based), -0.25/-0.5 for wrong.",
      mode: "OMR based (Offline)"
    },
    frequency: "Once a year",
    applicationPeriod: "December-January",
    examMonth: "April",
    website: "https://wbjeeb.nic.in",
    acceptedBy: "Government and private engineering colleges in West Bengal including Jadavpur University"
  },
  {
    id: "gujcet",
    name: "GUJCET (Gujarat Common Entrance Test)",
    category: "Engineering",
    subcategory: "State (Gujarat)",
    conductedBy: "Gujarat Secondary and Higher Secondary Education Board",
    level: "Undergraduate",
    eligibility: "Class 12 from Gujarat board. PCM/PCB.",
    examPattern: {
      papers: [{ name: "GUJCET", sections: "Physics (40), Chemistry (40), Mathematics/Biology (40). Total 120 MCQs.", marks: 120, duration: "3 hours" }],
      marking: "+1 correct, -0.25 wrong.",
      mode: "OMR based"
    },
    frequency: "Once a year",
    applicationPeriod: "January-February",
    examMonth: "March-April",
    website: "https://gujcet.gseb.org",
    acceptedBy: "Engineering and medical colleges in Gujarat"
  },
  {
    id: "upsee",
    name: "UPCET/AKTU (Uttar Pradesh Combined Entrance Test)",
    category: "Engineering",
    subcategory: "State (Uttar Pradesh)",
    conductedBy: "NTA (on behalf of Dr. APJ Abdul Kalam Technical University)",
    level: "Undergraduate",
    eligibility: "Class 12 with PCM. UP domicile or studied in UP.",
    examPattern: {
      papers: [{ name: "UPCET", sections: "Physics (50), Chemistry (50), Mathematics (50). Total 150 MCQs.", marks: 600, duration: "3 hours" }],
      marking: "+4 correct, -1 wrong.",
      mode: "Computer Based Test"
    },
    frequency: "Once a year",
    applicationPeriod: "March-April",
    examMonth: "May-June",
    website: "https://upcet.admissions.nic.in",
    acceptedBy: "AKTU affiliated colleges and other state universities in UP"
  },
  {
    id: "bcece",
    name: "BCECE (Bihar Combined Entrance Competitive Examination)",
    category: "Engineering",
    subcategory: "State (Bihar)",
    conductedBy: "Bihar Combined Entrance Competitive Examination Board",
    level: "Undergraduate",
    eligibility: "Class 12 with PCM/PCB. Bihar domicile.",
    examPattern: {
      papers: [{ name: "BCECE", sections: "Physics (50), Chemistry (50), Mathematics (50). Total 150 MCQs.", marks: 150, duration: "2.5 hours" }],
      marking: "+1 correct, no negative marking.",
      mode: "Computer Based Test"
    },
    frequency: "Once a year",
    applicationPeriod: "March-April",
    examMonth: "June",
    website: "https://bceceboard.bihar.gov.in",
    acceptedBy: "Engineering colleges in Bihar"
  },
  {
    id: "ojee",
    name: "OJEE (Odisha Joint Entrance Examination)",
    category: "Engineering",
    subcategory: "State (Odisha)",
    conductedBy: "Odisha JEE Committee",
    level: "Undergraduate/Lateral Entry",
    eligibility: "Class 12 with PCM. Odisha domicile.",
    examPattern: {
      papers: [{ name: "OJEE", sections: "Physics (30), Chemistry (30), Mathematics (60). Total 120 MCQs.", marks: 120, duration: "3 hours" }],
      marking: "+4 correct, -1 wrong.",
      mode: "Computer Based Test"
    },
    frequency: "Once a year",
    applicationPeriod: "February-March",
    examMonth: "May",
    website: "https://ojee.nic.in",
    acceptedBy: "Engineering colleges in Odisha"
  },
  {
    id: "keam",
    name: "KEAM (Kerala Engineering Architecture Medical)",
    category: "Engineering",
    subcategory: "State (Kerala)",
    conductedBy: "Commissioner for Entrance Examinations (CEE), Kerala",
    level: "Undergraduate",
    eligibility: "Class 12 with PCM. Kerala nativity or studied in Kerala.",
    examPattern: {
      papers: [
        { name: "Paper 1", sections: "Physics (24) + Chemistry (24). Total 48 MCQs.", marks: 192, duration: "2.5 hours" },
        { name: "Paper 2", sections: "Mathematics (72 MCQs).", marks: 288, duration: "2.5 hours" }
      ],
      marking: "+4 correct, -1 wrong.",
      mode: "OMR based"
    },
    frequency: "Once a year",
    applicationPeriod: "January-February",
    examMonth: "April-May",
    website: "https://cee.kerala.gov.in",
    acceptedBy: "Government and private engineering colleges in Kerala"
  },
  {
    id: "tnea",
    name: "TNEA (Tamil Nadu Engineering Admissions)",
    category: "Engineering",
    subcategory: "State (Tamil Nadu)",
    conductedBy: "Anna University",
    level: "Undergraduate",
    eligibility: "Class 12 from TN board or recognized board. PCM with minimum marks.",
    examPattern: {
      papers: [{ name: "No separate exam", sections: "Admission based on Class 12 marks. Cutoff = Mathematics + Physics + Chemistry normalized marks.", marks: "200 (Normalized)", duration: "N/A" }],
      marking: "Based on board exam marks only.",
      mode: "No entrance test - Merit based"
    },
    frequency: "Once a year (Counselling based)",
    applicationPeriod: "May-June",
    examMonth: "No exam. Board marks considered.",
    website: "https://tneaonline.org",
    acceptedBy: "All engineering colleges in Tamil Nadu",
    importantNotes: "Tamil Nadu is one of the few states that does NOT conduct a separate engineering entrance exam. Admission purely on Class 12 marks."
  },
  {
    id: "cuet_ug",
    name: "CUET UG (Common University Entrance Test - Undergraduate)",
    category: "Engineering",
    subcategory: "National",
    conductedBy: "National Testing Agency (NTA)",
    level: "Undergraduate",
    eligibility: "Class 12 passed. Specific subject requirements vary by university/program.",
    examPattern: {
      papers: [
        { name: "Section IA", sections: "13 Languages (choose 1). 40 MCQs, attempt 30.", marks: "200", duration: "45 min" },
        { name: "Section IB", sections: "20 Languages (choose 1, optional). 40 MCQs, attempt 30.", marks: "200", duration: "45 min" },
        { name: "Section II", sections: "27 Domain Subjects (choose up to 6). 40 MCQs, attempt 35 per subject.", marks: "200 per subject", duration: "45 min per subject" },
        { name: "Section III", sections: "General Test. 50 MCQs, attempt 40.", marks: "200", duration: "60 min" }
      ],
      marking: "+5 correct, -1 wrong.",
      mode: "Computer Based Test"
    },
    frequency: "Once a year",
    applicationPeriod: "February-March",
    examMonth: "May",
    website: "https://cuet.nta.nic.in",
    acceptedBy: "All Central Universities (45+), many state and private universities. JNU, DU, BHU, JMI, AMU, HCU, etc.",
    importantNotes: "Mandatory for admission to all Central Universities from 2022 onwards. Also accepted by many state and private universities."
  },
  {
    id: "hp_cet",
    name: "HP CET (Himachal Pradesh Common Entrance Test)",
    category: "Engineering",
    subcategory: "State (Himachal Pradesh)",
    conductedBy: "HP Technical University",
    level: "Undergraduate",
    eligibility: "Class 12 with PCM. HP domicile.",
    examPattern: { papers: [{ name: "HP CET", sections: "Physics, Chemistry, Mathematics. Total 150 MCQs.", marks: 150, duration: "3 hours" }], marking: "+1 correct, no negative.", mode: "Offline/Online" },
    frequency: "Once a year", applicationPeriod: "March-April", examMonth: "June",
    website: "https://himtu.ac.in", acceptedBy: "Engineering colleges in Himachal Pradesh"
  },
  {
    id: "uk_cet",
    name: "Uttarakhand CET (UKSEE)",
    category: "Engineering",
    subcategory: "State (Uttarakhand)",
    conductedBy: "Uttarakhand Technical University",
    level: "Undergraduate",
    eligibility: "Class 12 with PCM. Uttarakhand domicile.",
    examPattern: { papers: [{ name: "UKSEE", sections: "Physics, Chemistry, Mathematics. 150 MCQs.", marks: 600, duration: "3 hours" }], marking: "+4 correct, -1 wrong.", mode: "Offline" },
    frequency: "Once a year", applicationPeriod: "March-April", examMonth: "May-June",
    website: "https://uktech.ac.in", acceptedBy: "Engineering colleges in Uttarakhand"
  },
  {
    id: "jk_cet",
    name: "JKCET (Jammu & Kashmir Common Entrance Test)",
    category: "Engineering",
    subcategory: "State (J&K)",
    conductedBy: "J&K Board of Professional Entrance Examinations (BOPEE)",
    level: "Undergraduate",
    eligibility: "Class 12 with PCM. J&K/Ladakh domicile.",
    examPattern: { papers: [{ name: "JKCET", sections: "Physics (60), Chemistry (60), Mathematics (60). Total 180 MCQs.", marks: 180, duration: "3 hours" }], marking: "+1 correct, -0.25 wrong.", mode: "OMR based" },
    frequency: "Once a year", applicationPeriod: "March-April", examMonth: "June",
    website: "https://jkbopee.gov.in", acceptedBy: "Engineering colleges in J&K and Ladakh"
  },
  {
    id: "assam_cee",
    name: "Assam CEE (Combined Entrance Examination)",
    category: "Engineering",
    subcategory: "State (Assam)",
    conductedBy: "Directorate of Technical Education, Assam",
    level: "Undergraduate",
    eligibility: "Class 12 with PCM. Assam domicile.",
    examPattern: { papers: [{ name: "Assam CEE", sections: "Physics (40), Chemistry (40), Mathematics (40). Total 120 MCQs.", marks: 120, duration: "3 hours" }], marking: "+1 correct, no negative.", mode: "OMR based" },
    frequency: "Once a year", applicationPeriod: "March-April", examMonth: "June",
    website: "https://dte.assam.gov.in", acceptedBy: "Engineering colleges in Assam"
  },
  {
    id: "cg_pet",
    name: "CG PET (Chhattisgarh Pre-Engineering Test)",
    category: "Engineering",
    subcategory: "State (Chhattisgarh)",
    conductedBy: "CG Vyapam",
    level: "Undergraduate",
    eligibility: "Class 12 with PCM. CG domicile.",
    examPattern: { papers: [{ name: "CG PET", sections: "Physics (50), Chemistry (50), Mathematics (50). Total 150 MCQs.", marks: 150, duration: "3 hours" }], marking: "+1 correct, no negative.", mode: "Offline" },
    frequency: "Once a year", applicationPeriod: "March-May", examMonth: "June",
    website: "https://vyapam.cgstate.gov.in", acceptedBy: "Engineering colleges in Chhattisgarh"
  },
  {
    id: "mp_pet",
    name: "MP PET (Madhya Pradesh Pre-Engineering Test) - Now JEE Main based",
    category: "Engineering",
    subcategory: "State (Madhya Pradesh)",
    conductedBy: "Department of Technical Education, MP",
    level: "Undergraduate",
    eligibility: "Class 12 with PCM. MP domicile.",
    examPattern: { papers: [{ name: "JEE Main Score", sections: "MP uses JEE Main scores for engineering admissions since 2019.", marks: "JEE Main Percentile", duration: "N/A" }], marking: "JEE Main based.", mode: "No separate exam" },
    frequency: "As per JEE Main schedule", applicationPeriod: "As per MP DTE counselling schedule", examMonth: "JEE Main exam months",
    website: "https://dte.mponline.gov.in", acceptedBy: "Engineering colleges in Madhya Pradesh"
  },
  {
    id: "reap",
    name: "REAP (Rajasthan Engineering Admission Process) - Now JEE Main based",
    category: "Engineering",
    subcategory: "State (Rajasthan)",
    conductedBy: "Rajasthan Technical University",
    level: "Undergraduate",
    eligibility: "Class 12 with PCM. Rajasthan domicile.",
    examPattern: { papers: [{ name: "JEE Main Score", sections: "Rajasthan uses JEE Main scores for engineering admissions.", marks: "JEE Main Percentile", duration: "N/A" }] },
    frequency: "As per JEE Main", applicationPeriod: "June-July", examMonth: "N/A",
    website: "https://engineering.rajasthan.gov.in", acceptedBy: "Engineering colleges in Rajasthan"
  }
];

export default engineeringExams;
