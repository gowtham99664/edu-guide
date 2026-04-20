// Special School Entrance Exams - exams students can take during school years for admission to special schools
const schoolEntranceExams = [
  {
    id: "jnvst",
    name: "Jawahar Navodaya Vidyalaya Selection Test (JNVST)",
    conductedBy: "Navodaya Vidyalaya Samiti (NVS)",
    forClass: "Class 6 and Class 9 (Lateral Entry)",
    eligibility: "Class 5 passed from government/recognized school in the same district. Age: 9-13 years as on May 1 of admission year.",
    examPattern: "Class 6: Mental Ability (40 marks), Arithmetic (20 marks), Language (20 marks). Total 80 marks, 2 hours. Class 9: English (15), Hindi (15), Maths (35), Science (35). Total 100 marks, 2.5 hours.",
    syllabus: {
      class6: ["Mental Ability: Odd one out, Pattern completion, Figure matching, Mirror image, Embedded figures, Spatial visualization", "Arithmetic: Number systems, HCF/LCM, Decimals, Fractions, Percentage, Simple interest, Distance/Time/Speed, Mensuration", "Language: Reading comprehension, Grammar, Vocabulary, Sentence formation"],
      class9: ["English: Comprehension, Grammar, Vocabulary", "Hindi: Comprehension, Grammar", "Mathematics: Rational numbers, Exponents, Algebraic expressions, Linear equations, Geometry, Mensuration, Data handling", "Science: Crop production, Microorganisms, Synthetic fibers, Metals, Coal/Petroleum, Cell, Reproduction, Force/Pressure, Friction, Sound, Light, Stars"]
    },
    frequency: "Once a year (January/April)",
    applicationPeriod: "September-November",
    examMonth: "January (Class 6), February (Class 9)",
    website: "https://navodaya.gov.in",
    schools: "661 Jawahar Navodaya Vidyalayas across India (one per district). Fully residential, co-educational, free education from Class 6 to 12.",
    statesCovered: "All states and UTs",
    importantNotes: "75% seats reserved for rural areas. Reservation as per government norms (SC/ST/OBC). Medium of instruction transitions from mother tongue to Hindi/English."
  },
  {
    id: "sainik",
    name: "Sainik School Entrance Exam (AISSEE)",
    conductedBy: "National Testing Agency (NTA)",
    forClass: "Class 6 and Class 9",
    eligibility: "Class 6: Boys aged 10-12, Class 9: Boys aged 13-15. Must have passed previous class. Some schools now admit girls.",
    examPattern: "Class 6: Mathematics (50 marks), Intelligence (25 marks), Language (25 marks), GK (25 marks). Total 125 marks. Class 9: Mathematics (50), Intelligence (25), English (25), GK (25), Science (25). Total 150 marks.",
    syllabus: {
      class6: ["Mathematics: Numbers, Operations, Fractions, Decimals, LCM/HCF, Geometry, Mensuration, Data handling", "Intelligence: Series, Analogies, Classification, Coding-Decoding, Direction sense, Blood relations", "Language: Comprehension, Grammar, Vocabulary", "General Knowledge: Current affairs, History, Geography, Science basics"],
      class9: ["Mathematics: Algebra, Geometry, Mensuration, Statistics, Number system", "Intelligence: Verbal/Non-verbal reasoning", "English: Grammar, Comprehension, Writing", "General Knowledge: Current affairs, Static GK", "Science: Physics, Chemistry, Biology basics"]
    },
    frequency: "Once a year",
    applicationPeriod: "October-December",
    examMonth: "January",
    website: "https://aissee.nta.nic.in",
    schools: "33 Sainik Schools across India: Sainik School Amaravathinagar (TN), Balachadi (Gujarat), Bhubaneswar (Odisha), Bijapur (Karnataka), Chittorgarh (Rajasthan), Chhingchhip (Mizoram), Coral (Manipur), East Siang (Arunachal Pradesh), Ghorakhal (Uttarakhand), Goalpara (Assam), Gopalganj (Bihar), Imphal (Manipur), Jhunjhunu (Rajasthan), Kalikiri (AP), Kapurthala (Punjab), Kazhakootam (Kerala), Kodagu (Karnataka), Korukonda (AP), Kunjpura (Haryana), Lucknow (UP), Mainpuri (UP), Nagrota (J&K), Purulia (WB), Rewa (MP), Rewari (Haryana), Sambhalpur (Odisha), Satara (Maharashtra), Sujanpur Tira (HP), Tilaiya (Jharkhand), Ambikapur (CG), Amethi (UP), Chhingchhip (Mizoram), Punglwa (Nagaland)",
    statesCovered: "All states",
    importantNotes: "Residential schools under Ministry of Defence. Prepares students for NDA/Armed Forces. Medium of instruction: English. Fees subsidized by government."
  },
  {
    id: "rms",
    name: "Rashtriya Military School Entrance Exam",
    conductedBy: "Directorate General of Military Training",
    forClass: "Class 6 and Class 9",
    eligibility: "Only boys. Class 6: Age 10-12, Class 9: Age 13-15. Must be Indian citizen.",
    examPattern: "Written test: Mathematics, General Knowledge, English, Intelligence. Plus Medical fitness test.",
    syllabus: {
      class6: ["Mathematics: Basic arithmetic, Geometry, Mensuration", "English: Grammar, Comprehension", "General Knowledge: Current affairs, History, Geography", "Intelligence: Reasoning, Pattern recognition"],
      class9: ["Mathematics: Algebra, Geometry, Trigonometry basics", "English: Advanced grammar, Comprehension, Essay", "General Knowledge: Current affairs, Indian history, World geography", "Science: Physics, Chemistry, Biology"]
    },
    frequency: "Once a year",
    applicationPeriod: "August-October",
    examMonth: "December/January",
    website: "https://www.rashtriyamilitaryschools.in",
    schools: "5 Schools: Belgaum (Karnataka), Chail (HP), Dholpur (Rajasthan), Ajmer (Rajasthan), Bangalore (Karnataka)",
    statesCovered: "All India",
    importantNotes: "Under Ministry of Defence. Focus on military training along with academics. Feeds into NDA."
  },
  {
    id: "kvs",
    name: "Kendriya Vidyalaya Sangathan (KVS) Admission",
    conductedBy: "Kendriya Vidyalaya Sangathan",
    forClass: "Class 1 onwards (Lottery based for Class 1, test for Class 2 onwards)",
    eligibility: "Priority: Children of transferable Central Government employees, Defence personnel, Ex-servicemen. Open to all for remaining seats.",
    examPattern: "Class 2 onwards: Written test in Hindi, English, Mathematics. Priority-based admission for Class 1 (lottery system).",
    syllabus: {
      general: ["Based on CBSE curriculum of the previous class", "Hindi: Reading, Writing, Grammar", "English: Reading, Writing, Grammar", "Mathematics: Concepts as per NCERT"]
    },
    frequency: "Once a year",
    applicationPeriod: "March-April",
    examMonth: "April (admission test)",
    website: "https://kvsangathan.nic.in",
    schools: "1,252 Kendriya Vidyalayas across India and abroad",
    statesCovered: "All states and UTs, plus some abroad",
    importantNotes: "CBSE affiliated. Highly subsidized fees. Transferable admission for government employees' children. Uniform curriculum across India."
  },
  {
    id: "aps",
    name: "Army Public School Entrance Exam",
    conductedBy: "Army Welfare Education Society (AWES)",
    forClass: "Class 2 to Class 12",
    eligibility: "Priority to wards of Army personnel. Open category seats available in some schools.",
    examPattern: "Written test: English, Mathematics, General Knowledge/Science. Interview.",
    syllabus: {
      general: ["English: Grammar, Comprehension, Vocabulary, Writing", "Mathematics: As per CBSE/respective board syllabus", "GK/Science: Current affairs, Basic science concepts"]
    },
    frequency: "Once a year",
    applicationPeriod: "Varies by school (typically March-May)",
    examMonth: "April-May",
    website: "https://www.awesindia.com",
    schools: "137 Army Public Schools across India",
    statesCovered: "All states where Army cantonments exist",
    importantNotes: "CBSE affiliated. Quality education with focus on discipline. Subsidized fees for defence wards."
  },
  {
    id: "ntse",
    name: "National Talent Search Examination (NTSE)",
    conductedBy: "NCERT (National Council of Educational Research and Training)",
    forClass: "Class 10 students",
    eligibility: "Students studying in Class 10 in recognized schools in India. Indian nationals and OCI cardholders.",
    examPattern: "Two stages. Stage 1 (State Level): MAT (Mental Ability Test) - 100 questions, 120 min + SAT (Scholastic Aptitude Test) - 100 questions, 120 min. Stage 2 (National Level): Same pattern conducted by NCERT.",
    syllabus: {
      mat: ["Verbal Reasoning: Analogies, Classification, Series, Pattern perception, Hidden figures, Coding-Decoding, Block assembly, Problem solving", "Non-Verbal Reasoning: Figure analogies, Series completion, Classification"],
      sat: ["Mathematics: Algebra, Geometry, Trigonometry, Number system, Statistics, Mensuration, Arithmetic", "Science: Physics (Motion, Force, Light, Electricity, Magnetism), Chemistry (Acids/Bases, Metals, Carbon compounds, Periodic table), Biology (Life processes, Heredity, Environment)", "Social Science: History (Indian freedom struggle, World history), Geography (Resources, Agriculture, Manufacturing), Civics (Democracy, Constitution), Economics (Development, Sectors, Money/Credit)"]
    },
    frequency: "Once a year",
    applicationPeriod: "August-September",
    examMonth: "Stage 1: November, Stage 2: May",
    website: "https://ncert.nic.in/national-talent-examination.php",
    scholarship: "INR 1,250/month for Class 11-12, INR 2,000/month for UG/PG. Up to PhD level.",
    statesCovered: "All states and UTs",
    importantNotes: "One of the most prestigious scholarships in India. About 2,000 scholars selected annually. Scholarship continues till PhD if academic criteria met."
  },
  {
    id: "olympiad_sof",
    name: "Science Olympiad Foundation (SOF) Olympiads",
    conductedBy: "Science Olympiad Foundation",
    forClass: "Class 1 to Class 12",
    eligibility: "Students from Class 1 to 12 of recognized schools.",
    examPattern: "Multiple Olympiads: NSO (National Science Olympiad), NCO (National Cyber Olympiad), IMO (International Mathematics Olympiad), IEO (International English Olympiad), IGKO (International General Knowledge Olympiad). Each: 35-50 MCQs, 60 min.",
    syllabus: {
      general: ["NSO: Science as per respective class CBSE/ICSE syllabus + Higher Order Thinking", "IMO: Mathematics as per respective class syllabus + Logical Reasoning", "IEO: English Language - Grammar, Vocabulary, Reading, Writing", "NCO: Computers, IT, Cyber awareness, Logical reasoning"]
    },
    frequency: "Once a year (Level 1: December/January, Level 2: February)",
    applicationPeriod: "Through schools (July-September)",
    examMonth: "Level 1: October-December, Level 2: February",
    website: "https://sofworld.org",
    statesCovered: "All India + International",
    importantNotes: "Medals, certificates, cash prizes. Top performers from Level 1 qualify for Level 2. Good for building academic profile."
  },
  {
    id: "kvpy",
    name: "Kishore Vaigyanik Protsahan Yojana (KVPY) - Now part of INSPIRE",
    conductedBy: "Department of Science & Technology (formerly IISc Bangalore)",
    forClass: "Class 11, Class 12, and 1st year UG in Basic Sciences",
    eligibility: "Students in Class 11/12 (Science stream) or 1st year BSc/BS/Integrated MS.",
    examPattern: "Now merged with INSPIRE SHE scholarship. Earlier: Aptitude test (MCQ) in Physics, Chemistry, Mathematics, Biology + Interview.",
    syllabus: {
      general: ["Physics: Mechanics, Electrodynamics, Optics, Modern Physics, Thermodynamics", "Chemistry: Physical, Organic, Inorganic Chemistry", "Mathematics: Algebra, Calculus, Coordinate Geometry, Trigonometry", "Biology: Cell Biology, Genetics, Physiology, Ecology"]
    },
    frequency: "Program discontinued in 2022. Replaced by INSPIRE SHE.",
    applicationPeriod: "N/A (Discontinued)",
    examMonth: "N/A",
    website: "https://www.online-inspire.gov.in",
    statesCovered: "All India",
    importantNotes: "KVPY fellowship discontinued from 2022. Students should now apply for INSPIRE Scholarship for Higher Education (SHE) which provides INR 80,000/year for BSc/BS/Integrated MS students in Natural and Basic Sciences."
  },
  {
    id: "hbcse_olympiad",
    name: "International Science Olympiads (HBCSE)",
    conductedBy: "Homi Bhabha Centre for Science Education (HBCSE/TIFR)",
    forClass: "Class 8 to Class 12",
    eligibility: "Indian students. Selection through multi-stage process.",
    examPattern: "Multi-stage: Stage 1 (NSEP/NSEC/NSEB/NSEA/NSEJS) → Stage 2 (INPhO/INChO/INBO/INAO) → Training Camps → International Olympiad. Stage 1: MCQ-based. Later stages: Subjective + Practical.",
    syllabus: {
      physics: ["Mechanics, Thermodynamics, Waves, Optics, Electricity & Magnetism, Modern Physics, Nuclear Physics, Relativity basics"],
      chemistry: ["Physical Chemistry, Organic Chemistry, Inorganic Chemistry, Analytical Chemistry, Spectroscopy basics"],
      biology: ["Cell Biology, Genetics, Molecular Biology, Physiology (Plant & Animal), Ecology, Evolution, Biosystematics, Bioinformatics"],
      astronomy: ["Celestial Mechanics, Astrophysics, Cosmology, Stellar Physics, Observational Astronomy, Data Analysis"],
      juniorScience: ["Physics, Chemistry, Biology, Mathematics at middle school level"]
    },
    frequency: "Once a year",
    applicationPeriod: "Stage 1: August-September",
    examMonth: "Stage 1: November, Stage 2: January-February, International: July",
    website: "https://olympiads.hbcse.tifr.res.in",
    statesCovered: "All India",
    importantNotes: "IPhO (Physics), IChO (Chemistry), IBO (Biology), IAO (Astronomy), IJSO (Junior Science). Representing India at international level. Huge recognition for academic career. Helps in IIT/IISc admissions."
  },
  {
    id: "nmms",
    name: "National Means-cum-Merit Scholarship (NMMS)",
    conductedBy: "State Education Departments (Scheme by MHRD)",
    forClass: "Class 8 students",
    eligibility: "Students in Class 8 from government/local body/aided schools. Family income < INR 3.5 lakh/year. Minimum 55% in Class 7.",
    examPattern: "MAT (Mental Ability Test): 90 questions, 90 min + SAT (Scholastic Aptitude Test): 90 questions, 90 min. Subjects: Science, Social Studies, Mathematics.",
    syllabus: {
      mat: ["Verbal/Non-verbal reasoning", "Analogies, Series, Classification", "Pattern perception, Coding-Decoding"],
      sat: ["Science: Class 7-8 level Physics, Chemistry, Biology", "Mathematics: Arithmetic, Algebra, Geometry", "Social Studies: History, Geography, Civics"]
    },
    frequency: "Once a year",
    applicationPeriod: "July-September",
    examMonth: "November",
    website: "https://scholarships.gov.in",
    scholarship: "INR 12,000/year from Class 9 to Class 12 (total INR 48,000)",
    statesCovered: "All states and UTs",
    importantNotes: "1 lakh scholarships awarded each year nationally. Students must maintain 55% in subsequent classes. Renewal-based scholarship."
  },
  {
    id: "ap_gurukul",
    name: "AP Gurukul Schools (APREIS/APTWREIS/APSWREIS/MJPTBCWREIS) Entrance - Andhra Pradesh",
    conductedBy: "AP Residential Educational Institutions Society / AP Social Welfare / AP Tribal Welfare",
    forClass: "Class 5 (entry to Class 5) for APREIS; Class 5, 8 for others",
    eligibility: "SC/ST/BC/Minority students of Andhra Pradesh. Family income criteria apply. Must have passed the qualifying class.",
    examPattern: "Written test: Telugu/Urdu, English, Mathematics, EVS/Science. Varies by society.",
    syllabus: {
      general: ["Telugu/Urdu: Reading comprehension, Grammar", "English: Grammar, Comprehension, Vocabulary", "Mathematics: Arithmetic, Basic geometry", "EVS/Science: Environmental studies, Basic science"]
    },
    frequency: "Once a year",
    applicationPeriod: "January-March",
    examMonth: "April-May",
    website: "https://apresidential.cgg.gov.in",
    schools: "APREIS: 188 schools, APTWREIS: 181 schools, APSWREIS: 193 schools, MJPTBCWREIS: 287+ Gurukul schools. Total: 800+ residential schools in AP.",
    statesCovered: "Andhra Pradesh",
    importantNotes: "Fully free residential education including food, clothing, books. Some schools like APRJC also conduct entrance for Intermediate (after 10th)."
  },
  {
    id: "ts_gurukul",
    name: "Telangana Gurukul Schools (TSREIS/TSWREIS/TTWREIS/TMREIS/MJPTBCWREIS-TS) Entrance",
    conductedBy: "Telangana Residential Educational Institutions / Social Welfare / Tribal Welfare / Minority / BC Welfare",
    forClass: "Class 5, Class 8 entry",
    eligibility: "SC/ST/BC/Minority students of Telangana. Income criteria apply.",
    examPattern: "Written test in Telugu/Urdu/English, Mathematics, Science/EVS.",
    syllabus: {
      general: ["As per Telangana State syllabus for the qualifying class"]
    },
    frequency: "Once a year",
    applicationPeriod: "February-April",
    examMonth: "May",
    website: "https://tsswreis.in",
    schools: "TSREIS: 176 schools, TSWREIS: 268 schools, TTWREIS: 115 schools, TMREIS: 204 schools. Total: 700+ residential schools in TS.",
    statesCovered: "Telangana",
    importantNotes: "Fully free residential education. TSRJC (Telangana State Residential Junior College) entrance for after 10th is very competitive."
  },
  {
    id: "aprjc",
    name: "APRJC CET - AP Residential Junior College Entrance (Intermediate)",
    conductedBy: "AP Residential Educational Institutions Society",
    forClass: "Intermediate (Class 11-12) admission after 10th",
    eligibility: "Students who passed 10th from AP. Must be AP resident. Age limit applies.",
    examPattern: "150 MCQs, 2.5 hours. English (40), Mathematics (40), Science (40), Social Studies (30).",
    syllabus: {
      general: ["English: Grammar, Comprehension, Vocabulary", "Mathematics: Class 10 level - Algebra, Geometry, Trigonometry, Statistics", "Physical Science: Physics and Chemistry of Class 10", "Biological Science: Botany and Zoology of Class 10", "Social Studies: History, Geography, Civics, Economics of Class 10"]
    },
    frequency: "Once a year",
    applicationPeriod: "March-April",
    examMonth: "May",
    website: "https://aprjdc.apcfss.in",
    schools: "18 AP Residential Junior Colleges across Andhra Pradesh",
    statesCovered: "Andhra Pradesh",
    importantNotes: "Highly competitive - less than 5% selection rate. These colleges have exceptional track record in IIT-JEE and NEET. Groups: MPC, BiPC, MEC, CEC."
  },
  {
    id: "tsrjc",
    name: "TSRJC CET - Telangana Residential Junior College Entrance",
    conductedBy: "Telangana Residential Educational Institutions Society",
    forClass: "Intermediate (Class 11-12) after 10th",
    eligibility: "10th pass from Telangana. Must be TS resident.",
    examPattern: "150 MCQs, 2.5 hours. English (40), Mathematics (40), Science (40), Social (30).",
    syllabus: {
      general: ["Based on Telangana State Class 10 syllabus", "English, Mathematics, Physical Science, Biological Science, Social Studies"]
    },
    frequency: "Once a year",
    applicationPeriod: "March-April",
    examMonth: "May",
    website: "https://tsrjdc.cgg.gov.in",
    schools: "24 TS Residential Junior Colleges",
    statesCovered: "Telangana",
    importantNotes: "Strong track record in competitive exams. Groups: MPC, BiPC, MEC, CEC."
  },
  {
    id: "rimc",
    name: "Rashtriya Indian Military College (RIMC) Entrance Exam",
    conductedBy: "Directorate General of Military Training",
    forClass: "Class 8 (admission to RIMC Dehradun for Class 8)",
    eligibility: "Boys studying in Class 7. Age: 11.5 to 13 years. Indian citizen.",
    examPattern: "Written: English (125 marks), Mathematics (200 marks), General Knowledge (75 marks). Total 400 marks, plus Interview and Medical.",
    syllabus: {
      general: ["English: Essay, Comprehension, Grammar, Letter writing", "Mathematics: Class 7 level - Numbers, Algebra, Geometry, Mensuration", "General Knowledge: Current affairs, History, Geography, Science, Sports"]
    },
    frequency: "Twice a year (June and December entrance)",
    applicationPeriod: "April and October",
    examMonth: "June and December",
    website: "https://rimc.gov.in",
    schools: "Single institution: Rashtriya Indian Military College, Dehradun",
    statesCovered: "All India (25 seats per term)",
    importantNotes: "One of the most prestigious military schools. Only 50 students admitted per year. Feeds into NDA. Students get Class 8-12 education with military training."
  },
  {
    id: "super30_type",
    name: "Various State Super 30/Free Coaching Entrance Tests",
    conductedBy: "Various state governments and private trusts",
    forClass: "After Class 10 (for IIT-JEE/NEET coaching)",
    eligibility: "Economically weaker section students who passed Class 10 with distinction.",
    examPattern: "Varies - typically aptitude test in Maths, Science, English.",
    syllabus: {
      general: ["Mathematics: Class 10 level advanced", "Science: Physics, Chemistry, Biology at Class 10 level", "Aptitude and reasoning"]
    },
    frequency: "Once a year",
    applicationPeriod: "April-June",
    examMonth: "June-July",
    website: "Varies by state/organization",
    schools: "Super 30 (Bihar - Anand Kumar), Dakshana Foundation, state government free coaching programs",
    statesCovered: "Various states",
    importantNotes: "Free coaching for IIT-JEE/NEET for underprivileged students. Dakshana Foundation operates in multiple states."
  }
];

export default schoolEntranceExams;
