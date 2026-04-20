// Medical, Law, Management, Defence, and other entrance exams
const medicalExams = [
  {
    id: "neet_ug",
    name: "NEET UG (National Eligibility cum Entrance Test - Undergraduate)",
    category: "Medical",
    subcategory: "National",
    conductedBy: "National Testing Agency (NTA)",
    level: "Undergraduate",
    eligibility: "Class 12 with PCB (Physics, Chemistry, Biology). Minimum 50% aggregate (40% for SC/ST/OBC, 45% for PwD). Minimum age 17. No upper age limit (as per Supreme Court ruling).",
    examPattern: {
      papers: [{ name: "NEET UG", sections: "Physics (50), Chemistry (50), Botany (50), Zoology (50). Total 200 MCQs, attempt 180 (each section: 35 MCQ + 15 MCQ attempt 10).", marks: 720, duration: "3 hours 20 min" }],
      marking: "+4 correct, -1 wrong.",
      mode: "OMR based (Offline - Pen & Paper)"
    },
    syllabus: {
      physics: ["Physical World & Measurement", "Kinematics", "Laws of Motion", "Work, Energy & Power", "Motion of System of Particles", "Gravitation", "Properties of Bulk Matter", "Thermodynamics", "Kinetic Theory", "Oscillations & Waves", "Electrostatics", "Current Electricity", "Magnetic Effects & Magnetism", "EMI & AC", "EM Waves", "Optics", "Dual Nature of Matter", "Atoms & Nuclei", "Electronic Devices"],
      chemistry: ["Some Basic Concepts", "Structure of Atom", "Classification of Elements", "Chemical Bonding", "States of Matter", "Thermodynamics", "Equilibrium", "Redox Reactions", "Hydrogen", "s-Block", "p-Block Elements", "Organic Chemistry Basics", "Hydrocarbons", "Environmental Chemistry", "Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "Metallurgy", "d & f Block", "Coordination Compounds", "Haloalkanes", "Alcohols, Phenols, Ethers", "Aldehydes, Ketones, Carboxylic Acids", "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"],
      biology: ["Diversity in Living World", "Structural Organisation", "Cell Structure & Function", "Plant Physiology", "Human Physiology", "Reproduction", "Genetics & Evolution", "Biology & Human Welfare", "Biotechnology", "Ecology & Environment"]
    },
    frequency: "Once a year",
    applicationPeriod: "February-March",
    examMonth: "May",
    website: "https://neet.nta.nic.in",
    acceptedBy: "All government and private medical (MBBS), dental (BDS), AYUSH (BAMS, BHMS, BUMS, BSMS), veterinary, and nursing colleges in India. Also for AIIMS and JIPMER (merged into NEET).",
    importantNotes: "Single entrance exam for all medical admissions in India. About 20 lakh+ candidates appear annually. Approximately 1 lakh MBBS seats. 15% All India Quota counselled by MCC, 85% State Quota by state authorities."
  },
  {
    id: "neet_pg",
    name: "NEET PG (National Eligibility cum Entrance Test - Postgraduate)",
    category: "Medical",
    subcategory: "National",
    conductedBy: "National Board of Examinations (NBE)",
    level: "Postgraduate",
    eligibility: "MBBS degree from recognized university. Completion of internship. Registration with MCI/State Medical Council.",
    examPattern: {
      papers: [{ name: "NEET PG", sections: "200 MCQs covering all subjects of MBBS.", marks: 800, duration: "3.5 hours" }],
      marking: "+4 correct, -1 wrong.",
      mode: "Computer Based Test"
    },
    syllabus: { general: ["All subjects of MBBS: Anatomy, Physiology, Biochemistry, Pathology, Microbiology, Pharmacology, Forensic Medicine, Community Medicine, Medicine, Surgery, OBG, Pediatrics, Ophthalmology, ENT, Orthopedics, Dermatology, Psychiatry, Anesthesia, Radiology"] },
    frequency: "Once a year",
    applicationPeriod: "November-December",
    examMonth: "March",
    website: "https://natboard.edu.in",
    acceptedBy: "All MD/MS/Diploma PG medical seats in India",
    importantNotes: "Gateway to PG medical education. About 60,000+ PG seats. AIQ and State Quota counselling."
  },
  {
    id: "neet_ss",
    name: "NEET SS (Super Specialty)",
    category: "Medical",
    subcategory: "National",
    conductedBy: "NBE",
    level: "Super Specialty (DM/MCh)",
    eligibility: "MD/MS in relevant specialty.",
    examPattern: { papers: [{ name: "NEET SS", sections: "MCQs in relevant specialty.", marks: "Varies", duration: "3 hours" }] },
    frequency: "Once a year", applicationPeriod: "July-August", examMonth: "September",
    website: "https://natboard.edu.in", acceptedBy: "DM/MCh seats in India"
  },
  {
    id: "fmge",
    name: "FMGE (Foreign Medical Graduate Examination)",
    category: "Medical",
    subcategory: "National",
    conductedBy: "NBE",
    level: "Licensing Exam",
    eligibility: "Indian citizens with MBBS/equivalent from foreign medical institutions.",
    examPattern: { papers: [{ name: "FMGE", sections: "300 MCQs in Pre-clinical, Para-clinical, Clinical subjects.", marks: 300, duration: "5 hours" }], marking: "+1 correct, no negative.", mode: "CBT" },
    frequency: "Twice a year", applicationPeriod: "April and October", examMonth: "June and December",
    website: "https://natboard.edu.in", acceptedBy: "Required for practicing medicine in India with foreign MBBS degree"
  },
  {
    id: "aiapget",
    name: "AIAPGET (All India AYUSH Post Graduate Entrance Test)",
    category: "Medical",
    subcategory: "National",
    conductedBy: "NTA",
    level: "Postgraduate",
    eligibility: "Bachelor's degree in Ayurveda/Homeopathy/Unani/Siddha/Naturopathy from recognized college.",
    examPattern: { papers: [{ name: "AIAPGET", sections: "100 MCQs in respective AYUSH stream.", marks: 400, duration: "2 hours" }], marking: "+4 correct, -1 wrong.", mode: "CBT" },
    frequency: "Once a year", applicationPeriod: "June-July", examMonth: "August",
    website: "https://aiapget.nta.nic.in", acceptedBy: "PG AYUSH programs across India"
  }
];

const lawExams = [
  {
    id: "clat",
    name: "CLAT (Common Law Admission Test)",
    category: "Law",
    subcategory: "National",
    conductedBy: "Consortium of NLUs",
    level: "Undergraduate (5-year) and Postgraduate (1-year LLM)",
    eligibility: "UG: Class 12 passed with 45% (40% for SC/ST). No age limit. PG: LLB degree with 50% (45% SC/ST).",
    examPattern: {
      papers: [{ name: "CLAT UG", sections: "English Language (22-26 Qs), Current Affairs & GK (28-32 Qs), Legal Reasoning (28-32 Qs), Logical Reasoning (22-26 Qs), Quantitative Techniques (10-14 Qs). Total 120 MCQs.", marks: 120, duration: "2 hours" }],
      marking: "+1 correct, -0.25 wrong.",
      mode: "Offline (OMR) / Online"
    },
    syllabus: {
      english: ["Comprehension passages", "Vocabulary in context", "Grammar", "Critical reasoning from passages"],
      currentAffairs: ["Contemporary events", "Arts & Culture", "International affairs"],
      legalReasoning: ["Legal principles application", "Reading legal passages and applying rules"],
      logicalReasoning: ["Analogies", "Series", "Logical sequences", "Patterns", "Arguments"],
      quantitative: ["Data interpretation", "Ratios", "Percentages", "Fractions", "Basic algebra"]
    },
    frequency: "Once a year",
    applicationPeriod: "October-November",
    examMonth: "December",
    website: "https://consortiumofnlus.ac.in",
    acceptedBy: "23 NLUs: NLSIU Bangalore, NALSAR Hyderabad, NLU Jodhpur, WBNUJS Kolkata, NLU Delhi (AILET separate), GNLU Gandhinagar, RGNUL Punjab, RMLNLU Lucknow, NUALS Kochi, CNLU Patna, HNLU Raipur, NLU Odisha, NUSRL Ranchi, NLUJA Guwahati, DSNLU Visakhapatnam, TNNLS Tiruchirappalli, MNLU Mumbai, MNLU Nagpur, MNLU Aurangabad, HPNLU Shimla, DBRANLU Sonipat, NLU Tripura, NLU Meghalaya",
    importantNotes: "Most important law entrance exam. Comprehension-based pattern (changed from 2020). NLU Delhi has separate exam AILET."
  },
  {
    id: "ailet",
    name: "AILET (All India Law Entrance Test)",
    category: "Law",
    subcategory: "National",
    conductedBy: "National Law University, Delhi",
    level: "UG/PG/PhD",
    eligibility: "UG: Class 12 with 50% (45% SC/ST). No age limit.",
    examPattern: {
      papers: [{ name: "AILET", sections: "English (35), GK & Current Affairs (35), Legal Aptitude (35), Logical Reasoning (35), Mathematics (10). Total 150 MCQs.", marks: 150, duration: "1.5 hours" }],
      marking: "+1 correct, -0.25 wrong.",
      mode: "CBT"
    },
    frequency: "Once a year", applicationPeriod: "January-April", examMonth: "June",
    website: "https://nludelhi.ac.in", acceptedBy: "National Law University, Delhi only",
    importantNotes: "NLU Delhi is ranked #1 among law schools. Separate exam from CLAT."
  },
  {
    id: "lsat_india",
    name: "LSAT India (Law School Admission Test - India)",
    category: "Law",
    subcategory: "National",
    conductedBy: "Pearson VUE (under license from LSAC, USA)",
    level: "Undergraduate/Postgraduate",
    eligibility: "Class 12 passed for UG. LLB for PG.",
    examPattern: {
      papers: [{ name: "LSAT India", sections: "Analytical Reasoning (24), Logical Reasoning 1 (22-26), Logical Reasoning 2 (22-26), Reading Comprehension (24-28). Total ~100 MCQs.", marks: "Scaled score", duration: "2 hours 20 min" }],
      marking: "No negative marking.",
      mode: "Online proctored"
    },
    frequency: "Once a year", applicationPeriod: "November-April", examMonth: "May-June",
    website: "https://www.lsatindia.in", acceptedBy: "80+ law schools including Jindal Global Law School, UPES, Chandigarh University, ICFAI Law Schools"
  },
  {
    id: "mhcet_law",
    name: "MH CET Law (Maharashtra Common Entrance Test for Law)",
    category: "Law",
    subcategory: "State (Maharashtra)",
    conductedBy: "State CET Cell, Maharashtra",
    level: "UG (3-year LLB & 5-year BA LLB)",
    eligibility: "Class 12 (for 5-year) or Graduation (for 3-year). Maharashtra domicile.",
    examPattern: {
      papers: [{ name: "MH CET Law", sections: "5-year: Legal Aptitude (30), General Knowledge (30), Logical & Analytical Reasoning (30), English (30). Total 120. 3-year: Similar pattern.", marks: 120, duration: "2 hours" }],
      marking: "+1 correct, no negative.", mode: "CBT"
    },
    frequency: "Once a year", applicationPeriod: "March-April", examMonth: "May-June",
    website: "https://cetcell.mahacet.org", acceptedBy: "All law colleges in Maharashtra including ILS Pune, GLC Mumbai"
  },
  {
    id: "ap_lawcet",
    name: "AP LAWCET / AP PGLCET",
    category: "Law", subcategory: "State (AP)",
    conductedBy: "Sri Krishnadevaraya University (for APSCHE)",
    level: "UG/PG",
    eligibility: "AP domicile. Class 12 (5-year) or Degree (3-year).",
    examPattern: { papers: [{ name: "AP LAWCET", sections: "GK & Mental Ability (30), Current Affairs (30), Aptitude for Law (60). Total 120.", marks: 120, duration: "1.5 hours" }], marking: "+1, no negative.", mode: "CBT" },
    frequency: "Once a year", applicationPeriod: "March-April", examMonth: "June",
    website: "https://cets.apsche.ap.gov.in", acceptedBy: "Law colleges in Andhra Pradesh"
  },
  {
    id: "ts_lawcet",
    name: "TS LAWCET / TS PGLCET",
    category: "Law", subcategory: "State (Telangana)",
    conductedBy: "Osmania University (for TSCHE)",
    level: "UG/PG",
    eligibility: "TS domicile. Class 12 (5-year) or Degree (3-year).",
    examPattern: { papers: [{ name: "TS LAWCET", sections: "GK & Mental Ability (30), Current Affairs (30), Aptitude for Law (60). Total 120.", marks: 120, duration: "1.5 hours" }], marking: "+1, no negative.", mode: "CBT" },
    frequency: "Once a year", applicationPeriod: "March-April", examMonth: "June",
    website: "https://lawcet.tsche.ac.in", acceptedBy: "Law colleges in Telangana"
  },
  {
    id: "klee",
    name: "KLEE (Kerala Law Entrance Exam)",
    category: "Law", subcategory: "State (Kerala)",
    conductedBy: "CEE Kerala",
    level: "UG",
    eligibility: "Class 12 with 45%. Kerala nativity.",
    examPattern: { papers: [{ name: "KLEE", sections: "GK (25), English (25), General Aptitude (25), Legal Aptitude (25). Total 100.", marks: 100, duration: "1.5 hours" }], marking: "+1, -0.25 wrong.", mode: "CBT" },
    frequency: "Once a year", applicationPeriod: "March-April", examMonth: "June",
    website: "https://cee.kerala.gov.in", acceptedBy: "Government Law College Ernakulam, other law colleges in Kerala"
  }
];

const managementExams = [
  {
    id: "cat",
    name: "CAT (Common Admission Test)",
    category: "Management",
    subcategory: "National",
    conductedBy: "IIMs (rotating basis)",
    level: "Postgraduate (MBA/PGDM)",
    eligibility: "Bachelor's degree with minimum 50% (45% for SC/ST/PwD). Final year students can apply.",
    examPattern: {
      papers: [{ name: "CAT", sections: "Verbal Ability & Reading Comprehension (24 Qs, 40 min), Data Interpretation & Logical Reasoning (20 Qs, 40 min), Quantitative Ability (22 Qs, 40 min). Total 66 questions.", marks: 198, duration: "2 hours" }],
      marking: "+3 correct, -1 wrong (MCQ). No negative for non-MCQ (TITA).",
      mode: "Computer Based Test"
    },
    syllabus: {
      varc: ["Reading Comprehension (long passages)", "Para-jumbles", "Para-summary", "Odd sentence out", "Critical Reasoning"],
      dilr: ["Data Interpretation (Tables, Graphs, Charts)", "Logical Reasoning (Arrangements, Puzzles, Games & Tournaments, Network Diagrams, Venn Diagrams)"],
      qa: ["Number Systems", "Algebra", "Geometry & Mensuration", "Trigonometry", "Modern Math (P&C, Probability)", "Arithmetic (Time & Work, Percentages, Profit/Loss, SI/CI, Ratio, Mixtures)"]
    },
    frequency: "Once a year",
    applicationPeriod: "August-September",
    examMonth: "November",
    website: "https://iimcat.ac.in",
    acceptedBy: "All 21 IIMs + 1200+ B-schools across India. IIM Ahmedabad, IIM Bangalore, IIM Calcutta, IIM Lucknow, IIM Indore, IIM Kozhikode, FMS Delhi, MDI Gurgaon, IIT B-schools, NITIE, SPJIMR, JBIMS",
    importantNotes: "Most prestigious MBA entrance exam in India. 2.5 lakh+ applicants. 99+ percentile needed for top IIMs. Selection: CAT score + WAT (Written Ability Test) + PI (Personal Interview)."
  },
  {
    id: "xat",
    name: "XAT (Xavier Aptitude Test)",
    category: "Management", subcategory: "National",
    conductedBy: "XLRI Jamshedpur",
    level: "Postgraduate",
    eligibility: "Bachelor's degree (any discipline).",
    examPattern: {
      papers: [{ name: "XAT", sections: "Verbal & Logical Ability (26), Decision Making (21), Quantitative Ability & Data Interpretation (28), GK (25). Total 100 Qs.", marks: "Scaled", duration: "3 hours 10 min" }],
      marking: "+1 correct, -0.25 wrong. Additional -0.10 for every unanswered question beyond 8.",
      mode: "CBT"
    },
    frequency: "Once a year", applicationPeriod: "August-November", examMonth: "January",
    website: "https://xatonline.in", acceptedBy: "XLRI Jamshedpur, XIMB, XIME, XISS, GIM Goa, IMT, TAPMI, Great Lakes, LIBA + 160+ institutes"
  },
  {
    id: "mat",
    name: "MAT (Management Aptitude Test)",
    category: "Management", subcategory: "National",
    conductedBy: "AIMA (All India Management Association)",
    level: "Postgraduate",
    eligibility: "Bachelor's degree.",
    examPattern: {
      papers: [{ name: "MAT", sections: "Language Comprehension (40), Mathematical Skills (40), Data Analysis & Sufficiency (40), Intelligence & Critical Reasoning (40), Indian & Global Environment (40). Total 200.", marks: 200, duration: "2.5 hours" }],
      marking: "+1 correct, -0.25 wrong.", mode: "CBT/PBT/IBT"
    },
    frequency: "4 times a year (Feb, May, Sep, Dec)", applicationPeriod: "Rolling", examMonth: "Feb, May, Sep, Dec",
    website: "https://mat.aima.in", acceptedBy: "600+ B-schools across India"
  },
  {
    id: "cmat",
    name: "CMAT (Common Management Admission Test)",
    category: "Management", subcategory: "National",
    conductedBy: "NTA",
    level: "Postgraduate",
    eligibility: "Bachelor's degree with 50%.",
    examPattern: {
      papers: [{ name: "CMAT", sections: "Quantitative Techniques (25), Logical Reasoning (25), Language Comprehension (25), General Awareness (25), Innovation & Entrepreneurship (25). Total 125.", marks: 500, duration: "3 hours" }],
      marking: "+4 correct, -1 wrong.", mode: "CBT"
    },
    frequency: "Once a year", applicationPeriod: "January-February", examMonth: "March-April",
    website: "https://cmat.nta.nic.in", acceptedBy: "JBIMS Mumbai, KJ Somaiya, Welingkar, SIMSREE + AICTE approved B-schools"
  },
  {
    id: "snap",
    name: "SNAP (Symbiosis National Aptitude Test)",
    category: "Management", subcategory: "University",
    conductedBy: "Symbiosis International University",
    level: "Postgraduate",
    eligibility: "Bachelor's degree with 50% (45% SC/ST).",
    examPattern: {
      papers: [{ name: "SNAP", sections: "General English (15), Quantitative-Data Interpretation-Data Sufficiency (20), Analytical & Logical Reasoning (25). Total 60.", marks: 60, duration: "60 min" }],
      marking: "+1 correct (normal MCQ), +2 (special questions). -0.25 wrong.", mode: "CBT"
    },
    frequency: "Once a year (3 attempts in December)", applicationPeriod: "August-November", examMonth: "December",
    website: "https://www.snaptest.org", acceptedBy: "SIBM Pune, SCMHRD, SIIB, SIMS, SITM, SICSR, SSMC Bangalore"
  },
  {
    id: "nmat",
    name: "NMAT by GMAC",
    category: "Management", subcategory: "National",
    conductedBy: "GMAC",
    level: "Postgraduate",
    eligibility: "Bachelor's degree.",
    examPattern: {
      papers: [{ name: "NMAT", sections: "Language Skills (36, 28 min), Quantitative Skills (36, 52 min), Logical Reasoning (36, 40 min). Total 108.", marks: "Scaled 12-360", duration: "2 hours" }],
      marking: "No negative marking.", mode: "CBT"
    },
    frequency: "Flexible window (Oct-Jan, can attempt 3 times)", applicationPeriod: "August-October", examMonth: "October-January",
    website: "https://www.nmat.org", acceptedBy: "NMIMS Mumbai, Bangalore, Hyderabad, Navi Mumbai campuses, XIMR, Alliance University"
  },
  {
    id: "iift",
    name: "IIFT MBA Entrance (now through CUET PG/NTA)",
    category: "Management", subcategory: "National",
    conductedBy: "NTA",
    level: "Postgraduate",
    eligibility: "Bachelor's degree with 50%.",
    examPattern: { papers: [{ name: "IIFT", sections: "VARC, DILR, QA, GK. Total ~110-120 questions.", marks: "Varies", duration: "2 hours" }], marking: "Differential marking. Negative marking.", mode: "CBT" },
    frequency: "Once a year", applicationPeriod: "August-October", examMonth: "December",
    website: "https://iift.nta.nic.in", acceptedBy: "Indian Institute of Foreign Trade (Delhi, Kolkata, Kakinada)"
  },
  {
    id: "tissnet",
    name: "TISSNET (TISS National Entrance Test)",
    category: "Management", subcategory: "National",
    conductedBy: "Tata Institute of Social Sciences",
    level: "Postgraduate",
    eligibility: "Bachelor's degree. Varies by program.",
    examPattern: { papers: [{ name: "TISSNET", sections: "GK & Current Affairs (40), English Proficiency (30), Mathematical & Logical Reasoning (30). Total 100.", marks: 100, duration: "100 min" }], marking: "+1 correct, no negative.", mode: "CBT" },
    frequency: "Once a year", applicationPeriod: "November-January", examMonth: "February-March",
    website: "https://admissions.tiss.edu", acceptedBy: "TISS Mumbai, Hyderabad, Guwahati, Tuljapur campuses. Programs: HRM, Social Entrepreneurship, Health, Media, etc."
  },
  {
    id: "kmat",
    name: "KMAT (Karnataka/Kerala Management Aptitude Test)",
    category: "Management", subcategory: "State",
    conductedBy: "KPPGCA (Karnataka) / APJ Abdul Kalam Technological University (Kerala)",
    level: "Postgraduate",
    eligibility: "Bachelor's degree. State domicile/study.",
    examPattern: { papers: [{ name: "KMAT", sections: "Language Comprehension (40), Quantitative Ability (40), Logical Reasoning (40), General Awareness (40). Total 160.", marks: 160, duration: "2 hours" }], marking: "+1 correct, no negative.", mode: "CBT" },
    frequency: "Karnataka: Once a year. Kerala: 2-4 times a year.", applicationPeriod: "Varies", examMonth: "Varies",
    website: "https://kmatindia.com (Karnataka), https://cee.kerala.gov.in (Kerala)", acceptedBy: "MBA colleges in respective states"
  },
  {
    id: "mah_cet_mba",
    name: "MAH CET MBA/MMS",
    category: "Management", subcategory: "State (Maharashtra)",
    conductedBy: "State CET Cell, Maharashtra",
    level: "Postgraduate",
    eligibility: "Bachelor's degree with 50%.",
    examPattern: { papers: [{ name: "MAH CET", sections: "Logical Reasoning (75), Abstract Reasoning (25), Quantitative Aptitude (50), Verbal Ability/Reading Comprehension (50). Total 200.", marks: 200, duration: "2.5 hours" }], marking: "+1 correct, no negative.", mode: "CBT" },
    frequency: "Once a year", applicationPeriod: "January-February", examMonth: "March",
    website: "https://cetcell.mahacet.org", acceptedBy: "JBIMS, SIMSREE, KJ Somaiya, Welingkar + all Maharashtra MBA colleges"
  },
  {
    id: "ap_icet",
    name: "AP ICET (Integrated Common Entrance Test)",
    category: "Management", subcategory: "State (AP)",
    conductedBy: "Sri Venkateswara University (for APSCHE)",
    level: "Postgraduate (MBA/MCA)",
    eligibility: "Bachelor's degree. AP domicile.",
    examPattern: { papers: [{ name: "AP ICET", sections: "Analytical Ability (75), Mathematical Ability (75), Communication Ability (50). Total 200.", marks: 200, duration: "2.5 hours" }], marking: "+1, no negative.", mode: "CBT" },
    frequency: "Once a year", applicationPeriod: "March-April", examMonth: "June",
    website: "https://cets.apsche.ap.gov.in", acceptedBy: "MBA/MCA colleges in AP"
  },
  {
    id: "ts_icet",
    name: "TS ICET (Telangana State ICET)",
    category: "Management", subcategory: "State (Telangana)",
    conductedBy: "Kakatiya University (for TSCHE)",
    level: "Postgraduate (MBA/MCA)",
    eligibility: "Bachelor's degree. TS domicile.",
    examPattern: { papers: [{ name: "TS ICET", sections: "Analytical Ability (75), Mathematical Ability (75), Communication Ability (50). Total 200.", marks: 200, duration: "2.5 hours" }], marking: "+1, no negative.", mode: "CBT" },
    frequency: "Once a year", applicationPeriod: "March-April", examMonth: "June",
    website: "https://icet.tsche.ac.in", acceptedBy: "MBA/MCA colleges in Telangana"
  },
  {
    id: "tancet",
    name: "TANCET (Tamil Nadu Common Entrance Test)",
    category: "Management", subcategory: "State (Tamil Nadu)",
    conductedBy: "Anna University",
    level: "Postgraduate (MBA/MCA/M.E./M.Tech/M.Arch/M.Plan)",
    eligibility: "Bachelor's degree in relevant discipline.",
    examPattern: { papers: [{ name: "TANCET MBA", sections: "VA (25), QA (25), DA (25), Logical Reasoning (25), Comprehension (25). Total varies by program.", marks: "100-125", duration: "2 hours" }], marking: "+1 correct, -1/3 wrong.", mode: "Offline" },
    frequency: "Once a year", applicationPeriod: "January-February", examMonth: "March",
    website: "https://annauniv.edu", acceptedBy: "All MBA/MCA/M.E. colleges in Tamil Nadu"
  }
];

const defenceExams = [
  {
    id: "nda",
    name: "NDA (National Defence Academy) Exam",
    category: "Defence",
    subcategory: "National",
    conductedBy: "UPSC (Union Public Service Commission)",
    level: "After Class 12",
    eligibility: "Male candidates (unmarried). Age: 16.5-19.5 years. Class 12 passed/appearing. For Air Force & Navy: Class 12 with Physics & Mathematics.",
    examPattern: {
      papers: [
        { name: "Mathematics", sections: "120 MCQs", marks: 300, duration: "2.5 hours" },
        { name: "General Ability Test", sections: "Part A: English (50 Qs, 200 marks) + Part B: GK (100 Qs, 400 marks)", marks: 600, duration: "2.5 hours" }
      ],
      marking: "+2.5/+4 correct, -0.83/-1.33 wrong (varies by paper).",
      mode: "Offline (OMR)"
    },
    syllabus: {
      mathematics: ["Algebra", "Matrices & Determinants", "Trigonometry", "Analytical Geometry (2D & 3D)", "Differential Calculus", "Integral Calculus", "Vector Algebra", "Statistics & Probability"],
      gat: ["English: Grammar, Vocabulary, Comprehension, Cohesion, Usage", "Physics, Chemistry, General Science, History, Geography, Current Events"]
    },
    frequency: "Twice a year (NDA I & NDA II)",
    applicationPeriod: "December-January (NDA I), June-July (NDA II)",
    examMonth: "April (NDA I), September (NDA II)",
    website: "https://upsc.gov.in",
    acceptedBy: "National Defence Academy, Khadakwasla, Pune. Trains for Army, Navy, Air Force.",
    importantNotes: "After written exam: SSB Interview (5 days). Training: 3 years at NDA + 1 year at respective academy (IMA/INA/AFA). Degree awarded by JNU."
  },
  {
    id: "cds",
    name: "CDS (Combined Defence Services) Exam",
    category: "Defence", subcategory: "National",
    conductedBy: "UPSC",
    level: "After Graduation",
    eligibility: "Graduates. Unmarried (for IMA/INA/AFA). Age: 19-25 (IMA), 19-25 (INA), 19-24 (AFA), 19-25 (OTA - men/women). INA: Engineering degree.",
    examPattern: {
      papers: [
        { name: "English", sections: "120 MCQs", marks: 100, duration: "2 hours" },
        { name: "General Knowledge", sections: "120 MCQs", marks: 100, duration: "2 hours" },
        { name: "Elementary Mathematics (IMA/INA/AFA only)", sections: "100 MCQs", marks: 100, duration: "2 hours" }
      ],
      marking: "+1 correct, -0.33 wrong.", mode: "Offline"
    },
    frequency: "Twice a year", applicationPeriod: "Oct-Nov (CDS I), May-June (CDS II)", examMonth: "April (I), September (II)",
    website: "https://upsc.gov.in", acceptedBy: "IMA Dehradun, INA Ezhimala, AFA Dundigal (Hyderabad), OTA Chennai"
  },
  {
    id: "afcat",
    name: "AFCAT (Air Force Common Admission Test)",
    category: "Defence", subcategory: "National",
    conductedBy: "Indian Air Force",
    level: "After Graduation",
    eligibility: "Graduates (60% in graduation for most branches). Age: 20-26 (varies by branch). Men and Women both eligible.",
    examPattern: {
      papers: [{ name: "AFCAT", sections: "General Awareness (20), Verbal Ability in English (30), Numerical Ability (15), Reasoning & Military Aptitude (35). Total 100.", marks: 300, duration: "2 hours" }],
      marking: "+3 correct, -1 wrong.", mode: "CBT"
    },
    frequency: "Twice a year", applicationPeriod: "Dec-Jan (AFCAT 1), Jun-Jul (AFCAT 2)", examMonth: "February & August",
    website: "https://afcat.cdac.in", acceptedBy: "Indian Air Force - Flying, Technical, Ground Duty branches"
  },
  {
    id: "indian_navy",
    name: "Indian Navy AA/SSR/MR",
    category: "Defence", subcategory: "National",
    conductedBy: "Indian Navy",
    level: "After Class 10/12",
    eligibility: "AA (Artificer Apprentice): Class 12 with PCM, 60%. SSR (Senior Secondary Recruit): Class 12 with PCM, 50%. MR (Matric Recruit): Class 10.",
    examPattern: { papers: [{ name: "Varies by entry", sections: "English, Science, Mathematics, GK. Total 100 MCQs.", marks: 100, duration: "1 hour" }], marking: "+1 correct, -0.25 wrong.", mode: "CBT" },
    frequency: "Twice a year", applicationPeriod: "Rolling", examMonth: "Multiple batches",
    website: "https://www.joinindiannavy.gov.in", acceptedBy: "Indian Navy - Sailor entry"
  },
  {
    id: "icg",
    name: "Indian Coast Guard (Navik/Yantrik)",
    category: "Defence", subcategory: "National",
    conductedBy: "Indian Coast Guard",
    level: "After Class 10/12",
    eligibility: "Navik GD: Class 10, Navik DB: Class 12 with PCM, Yantrik: Class 12 with PCM or Diploma.",
    examPattern: { papers: [{ name: "ICG", sections: "Section 1 to 4 based on entry type. Maths, Science, English, GK, Reasoning.", marks: "Varies", duration: "Varies" }] },
    frequency: "Twice a year", applicationPeriod: "Rolling", examMonth: "Multiple",
    website: "https://joinindiancoastguard.cdac.in", acceptedBy: "Indian Coast Guard"
  }
];

const civilServicesExams = [
  {
    id: "upsc_cse",
    name: "UPSC Civil Services Examination (IAS/IPS/IFS)",
    category: "Civil Services",
    subcategory: "National",
    conductedBy: "Union Public Service Commission (UPSC)",
    level: "After Graduation",
    eligibility: "Bachelor's degree from recognized university. Age: 21-32 (General), 21-35 (OBC), 21-37 (SC/ST). Attempts: 6 (General), 9 (OBC), Unlimited (SC/ST) till age limit.",
    examPattern: {
      papers: [
        { name: "Prelims (Qualifying)", sections: "Paper 1 (GS): 100 MCQs, 200 marks. Paper 2 (CSAT): 80 MCQs, 200 marks (qualifying - 33%).", marks: 400, duration: "2 hours each" },
        { name: "Mains (9 papers)", sections: "Essay (250), GS-I (250), GS-II (250), GS-III (250), GS-IV Ethics (250), Optional Paper-I (250), Optional Paper-II (250), English (300, qualifying), Indian Language (300, qualifying).", marks: 1750, duration: "3 hours each" },
        { name: "Interview/Personality Test", sections: "Board interview", marks: 275, duration: "30-45 min" }
      ],
      marking: "Prelims: +2, -0.66. Mains: Descriptive, no negative.",
      mode: "Prelims: OMR. Mains: Written (pen & paper). Interview: In-person."
    },
    syllabus: {
      prelims_gs: ["Indian History & Culture", "Indian & World Geography", "Indian Polity & Governance", "Economic & Social Development", "Environmental Ecology", "General Science", "Current Affairs"],
      prelims_csat: ["Comprehension", "Interpersonal Skills", "Logical Reasoning & Analytical Ability", "Decision Making & Problem Solving", "General Mental Ability", "Basic Numeracy", "Data Interpretation", "English Language Comprehension"],
      mains: ["Essay on topics of national/international importance", "GS-I: Indian Heritage, History, Geography, Society", "GS-II: Governance, Constitution, Polity, Social Justice, International Relations", "GS-III: Technology, Economic Development, Biodiversity, Environment, Security, Disaster Management", "GS-IV: Ethics, Integrity, Aptitude, Case Studies", "Optional Subject (choose 1 from 48 subjects)"]
    },
    frequency: "Once a year",
    applicationPeriod: "February-March",
    examMonth: "Prelims: May/June, Mains: September, Interview: February-April",
    website: "https://upsc.gov.in",
    acceptedBy: "IAS (Indian Administrative Service), IPS (Indian Police Service), IFS (Indian Foreign Service), IRS, IRTS, ICAS, IDES, and 20+ other Central services.",
    importantNotes: "Most prestigious and competitive exam in India. About 10-12 lakh apply, ~1000 selected. Total process takes about 1 year. Optional subject choice is crucial."
  },
  {
    id: "state_psc",
    name: "State Public Service Commission Exams",
    category: "Civil Services", subcategory: "State",
    conductedBy: "Respective State PSCs",
    level: "After Graduation",
    eligibility: "Bachelor's degree. State domicile. Age varies by state (21-37 typically).",
    examPattern: { papers: [{ name: "State PSC", sections: "Generally: Prelims (MCQ) + Mains (Descriptive) + Interview. Pattern varies by state.", marks: "Varies", duration: "Varies" }] },
    frequency: "Once a year (most states)",
    website: "Varies by state",
    stateList: [
      { state: "Andhra Pradesh", body: "APPSC", website: "https://psc.ap.gov.in" },
      { state: "Arunachal Pradesh", body: "APPSC", website: "https://appsc.gov.in" },
      { state: "Assam", body: "APSC", website: "https://apsc.nic.in" },
      { state: "Bihar", body: "BPSC", website: "https://bpsc.bih.nic.in" },
      { state: "Chhattisgarh", body: "CGPSC", website: "https://psc.cg.gov.in" },
      { state: "Goa", body: "Goa PSC", website: "https://gpsc.goa.gov.in" },
      { state: "Gujarat", body: "GPSC", website: "https://gpsc.gujarat.gov.in" },
      { state: "Haryana", body: "HPSC", website: "https://hpsc.gov.in" },
      { state: "Himachal Pradesh", body: "HPPSC", website: "https://hppsc.hp.gov.in" },
      { state: "Jharkhand", body: "JPSC", website: "https://jpsc.gov.in" },
      { state: "Karnataka", body: "KPSC", website: "https://kpsc.kar.nic.in" },
      { state: "Kerala", body: "Kerala PSC", website: "https://keralapsc.gov.in" },
      { state: "Madhya Pradesh", body: "MPPSC", website: "https://mppsc.mp.gov.in" },
      { state: "Maharashtra", body: "MPSC", website: "https://mpsc.gov.in" },
      { state: "Manipur", body: "Manipur PSC", website: "https://manipurpsc.in" },
      { state: "Meghalaya", body: "Meghalaya PSC", website: "https://mpsc.nic.in" },
      { state: "Mizoram", body: "Mizoram PSC", website: "https://mpsc.mizoram.gov.in" },
      { state: "Nagaland", body: "NPSC", website: "https://npsc.nagaland.gov.in" },
      { state: "Odisha", body: "OPSC", website: "https://opsc.gov.in" },
      { state: "Punjab", body: "PPSC", website: "https://ppsc.gov.in" },
      { state: "Rajasthan", body: "RPSC", website: "https://rpsc.rajasthan.gov.in" },
      { state: "Sikkim", body: "SPSC", website: "https://spsc.sikkim.gov.in" },
      { state: "Tamil Nadu", body: "TNPSC", website: "https://tnpsc.gov.in" },
      { state: "Telangana", body: "TSPSC", website: "https://tspsc.gov.in" },
      { state: "Tripura", body: "TPSC", website: "https://tpsc.tripura.gov.in" },
      { state: "Uttar Pradesh", body: "UPPSC", website: "https://uppsc.up.nic.in" },
      { state: "Uttarakhand", body: "UKPSC", website: "https://ukpsc.gov.in" },
      { state: "West Bengal", body: "WBPSC", website: "https://wbpsc.gov.in" }
    ],
    importantNotes: "Each state PSC conducts its own exam for state civil services (SDM, DSP, etc.). Pattern is generally similar to UPSC but with state-specific syllabus."
  }
];

export { medicalExams, lawExams, managementExams, defenceExams, civilServicesExams };
