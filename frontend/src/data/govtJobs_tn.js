// Tamil Nadu State Government Jobs by Qualification
// Recruitment: TNPSC, TANGEDCO, TWAD, TN Health, TN Education, etc.

const tnGovtJobs = [
  {
    course: "B.Tech / B.E.",
    jobs: [
      { name: "Assistant Engineer (AE) – TNPSC", org: "TN PWD, Highways, WRO, TWAD, CMWSSB", exam: "TNPSC Group-I / AE Direct Exam", website: "https://www.tnpsc.gov.in", salary: "Pay Scale 56100-177500", notes: "Civil, ME, EE, Chemical." },
      { name: "Assistant Engineer – TANGEDCO", org: "Tamil Nadu Generation & Distribution Corporation", exam: "TANGEDCO AE Recruitment", website: "https://www.tangedco.gov.in", salary: "~₹40,000-70,000/month", notes: "EE, ME." },
      { name: "Junior Engineer (JE) – TNPSC", org: "Various TN Depts", exam: "TNPSC JE Exam", website: "https://www.tnpsc.gov.in", salary: "Pay Scale 35900-113500", notes: "Civil, EE, ME, EC." },
      { name: "BHEL Tiruchirappalli – GET", org: "BHEL Trichy (one of largest BHEL units)", exam: "GATE Score", website: "https://careers.bhel.in", salary: "E1 Grade", notes: "ME, EE, EC, Chemical." },
      { name: "HCL Technologies / BEML Recruitment (PSU adjacent)", org: "HCL-Avionics (Defence PSU)", exam: "Direct Recruitment", website: "https://hclavionics.com/careers", salary: "Market pay", notes: "Avionics, EC, EE." },
      { name: "DRDO Lab – CVRDE Avadi / DEBEL Bangalore", org: "DRDO Combat Vehicles R&D Establishment", exam: "DRDO SET / CEPTAM", website: "https://www.drdo.gov.in/careers", salary: "Pay Level 6-10", notes: "ME, EE, EC." },
    ]
  },
  {
    course: "MBBS / MD / MS",
    jobs: [
      { name: "Assistant Surgeon", org: "TN Health & Family Welfare Dept", exam: "TNPSC Group-I / Direct Recruitment", website: "https://www.tnpsc.gov.in", salary: "Pay Scale 56100-177500", notes: "MBBS + Internship + TNMC registration." },
      { name: "Specialist Doctor", org: "TN Medical Services Dept / Govt Hospitals", exam: "Direct Recruitment", website: "https://www.tnhealth.tn.gov.in", salary: "Pay Scale 67700-208700", notes: "MD/MS required." },
      { name: "Medical Officer – ESI Chennai", org: "ESIC (Central scheme, TN region)", exam: "ESIC Recruitment", website: "https://esic.nic.in/careers", salary: "Pay Level 10", notes: "MBBS." },
    ]
  },
  {
    course: "B.Sc / M.Sc",
    jobs: [
      { name: "Agriculture Officer", org: "TN Agriculture Dept", exam: "TNPSC AO Exam", website: "https://www.tnpsc.gov.in", salary: "Pay Scale 36400-114800", notes: "B.Sc Agriculture." },
      { name: "Scientific Officer – TN Forensic Science Laboratory", org: "TN FSL Mylapore", exam: "TNPSC", website: "https://www.tnpsc.gov.in", salary: "Pay Scale 36400-114800", notes: "B.Sc Chemistry/Biology." },
      { name: "Lecturer – TN Polytechnic / Arts & Science Colleges", org: "TN Higher Education Dept", exam: "TNSET (TN State Eligibility Test) + TNPSC", website: "https://www.tnset.in", salary: "Pay Scale 56100-177500", notes: "M.Sc + TNSET/UGC-NET." },
    ]
  },
  {
    course: "B.Ed / M.Ed",
    jobs: [
      { name: "Primary School Teacher", org: "TN Elementary Education Dept", exam: "TNTET Paper I + TNPSC", website: "https://trb.tn.gov.in", salary: "Pay Scale 23400-92600", notes: "D.T.Ed/B.Ed + TN TET." },
      { name: "Secondary Grade Teacher (BT Asst)", org: "TN School Education Dept", exam: "TNTET Paper II + TRB Exam", website: "https://trb.tn.gov.in", salary: "Pay Scale 35900-113500", notes: "B.Sc/BA + B.Ed + TNTET." },
      { name: "Post Graduate Asst (PGA) / Graduate Asst", org: "TN School Education Dept", exam: "TRB PG Asst Exam", website: "https://trb.tn.gov.in", salary: "Pay Scale 36400-114800", notes: "M.Sc/MA + B.Ed + SET/NET." },
    ]
  },
  {
    course: "LLB",
    jobs: [
      { name: "District Munsiff cum Judicial Magistrate", org: "TN Judicial Service (HC Madras)", exam: "TNPSC Group-I / HC Madras Direct", website: "https://judgmenthcmadras.gov.in", salary: "Pay Scale 77840-137920", notes: "LLB + 2 years practice preferred." },
      { name: "Public Prosecutor / APP", org: "TN Home Dept / District Courts", exam: "TNPSC / HC Direct", website: "https://www.tnpsc.gov.in", salary: "Pay Scale 50100-158525", notes: "LLB." },
    ]
  },
  {
    course: "B.Pharm / D.Pharm",
    jobs: [
      { name: "Drug Inspector – TN DCA", org: "TN Drug Control Administration", exam: "TNPSC / Direct", website: "https://www.tnpsc.gov.in", salary: "Pay Scale 36400-114800", notes: "B.Pharm mandatory." },
      { name: "Pharmacist Grade II – Govt Hospitals", org: "TN Health Dept / TNMSC", exam: "TNPSC Para-Medical Recruitment", website: "https://www.tnpsc.gov.in", salary: "Pay Scale 20600-65400", notes: "D.Pharm/B.Pharm." },
    ]
  },
  {
    course: "B.Sc Nursing / GNM",
    jobs: [
      { name: "Staff Nurse Grade II", org: "TN Health Dept / Medical College Hospitals", exam: "TNPSC / TRB Para-Medical", website: "https://www.tnpsc.gov.in", salary: "Pay Scale 29150-77750", notes: "B.Sc Nursing/GNM." },
      { name: "ANM – NHM Tamil Nadu", org: "NHM Tamil Nadu", exam: "NHM TN Direct Recruitment", website: "https://www.nhm.tn.gov.in", salary: "~₹12,000-15,000/month", notes: "ANM diploma." },
    ]
  },
  {
    course: "MBA / B.Com / CA",
    jobs: [
      { name: "TNSC Bank – Officer", org: "Tamil Nadu State Apex Co-operative Bank", exam: "TNSC Bank Direct Recruitment", website: "https://www.tnscbank.com/careers", salary: "~₹35,000-55,000/month", notes: "Commerce/MBA." },
      { name: "Tamil Nadu Grama Bank – Officer (RRB)", org: "Tamil Nadu Grama Bank", exam: "IBPS RRB Officer Scale I", website: "https://www.ibps.in", salary: "~₹35,000/month", notes: "Any graduation." },
    ]
  },
];

export default tnGovtJobs;
