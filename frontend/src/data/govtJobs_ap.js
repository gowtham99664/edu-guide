// Andhra Pradesh State Government Jobs by Qualification
// Recruitment boards: APPSC, APSPSC, APRJC, AP Police, AP Health Dept, etc.

const apGovtJobs = [
  {
    course: "B.Tech / B.E.",
    jobs: [
      { name: "AEE (Assistant Executive Engineer)", org: "AP Public Works Dept / Panchayati Raj / R&B", exam: "APPSC AEE Exam", website: "https://psc.ap.gov.in", salary: "Pay Scale 40270-113960", notes: "CE, ME, EE branches." },
      { name: "Assistant Engineer (AE) – APSPDCL / APEPDCL", org: "AP Southern / Eastern Power Distribution Companies", exam: "APGENCO / DISCOM Direct Recruitment", website: "https://apspdcl.in/careers", salary: "~₹35,000-60,000/month", notes: "EE, EC." },
      { name: "Assistant Engineer – APGENCO", org: "AP Power Generation Corporation", exam: "APGENCO AE Recruitment", website: "https://apgenco.gov.in/careers", salary: "~₹40,000/month", notes: "EE, ME." },
      { name: "Junior Engineer (JE) – AP Roads & Buildings", org: "AP Roads & Buildings Dept", exam: "APPSC JE", website: "https://psc.ap.gov.in", salary: "Pay Scale 35120-87130", notes: "Civil, EE, ME." },
      { name: "Assistant Engineer – AP Irrigation", org: "AP Water Resources Dept", exam: "APPSC AEE (WRD)", website: "https://psc.ap.gov.in", salary: "Pay Scale 40270-113960", notes: "Civil/Agri Engineering." },
      { name: "ECIL / BHEL Visakhapatnam (Central PSU in AP)", org: "BHEL Tirupattur / ECIL Hyderabad (nearby)", exam: "GATE Score", website: "https://careers.bhel.in", salary: "E1 Grade", notes: "EE, EC, ME." },
    ]
  },
  {
    course: "MBBS / MD",
    jobs: [
      { name: "Civil Assistant Surgeon", org: "AP Health, Medical & Family Welfare Dept", exam: "APSPSC CAS Recruitment", website: "https://psc.ap.gov.in", salary: "Pay Scale 62575-164775", notes: "MBBS + Internship completion." },
      { name: "AP Vaidya Vidhana Parishad (APVVP) Doctor", org: "APVVP (Govt hospitals below district HQ)", exam: "APVVP Direct Recruitment", website: "https://apvvp.ap.gov.in", salary: "~₹60,000-80,000/month", notes: "Specialist vacancies (MD/MS) periodically." },
      { name: "AP Medical Education (Teaching) – Asst Professor", org: "AP Institute of Medical Sciences & Research", exam: "Govt Medical Colleges Direct Recruitment", website: "https://aphealth.ap.gov.in", salary: "Pay Scale 67700-208700", notes: "MD/MS required." },
    ]
  },
  {
    course: "B.Sc / M.Sc",
    jobs: [
      { name: "Agriculture Officer / Agricultural Officer", org: "AP Agriculture Dept", exam: "APPSC AO Exam", website: "https://psc.ap.gov.in", salary: "Pay Scale 40270-113960", notes: "B.Sc Agriculture." },
      { name: "Horticulture Officer", org: "AP Horticulture Dept", exam: "APPSC", website: "https://psc.ap.gov.in", salary: "Pay Scale 37100-107800", notes: "B.Sc Horticulture." },
      { name: "Scientific Officer – AP Forensic Labs", org: "AP Forensic Science Laboratory", exam: "APPSC", website: "https://psc.ap.gov.in", salary: "Pay Scale 40270-113960", notes: "B.Sc Chemistry/Biology/Physics." },
      { name: "Lecturer in Govt Junior Colleges", org: "AP Intermediate Education Dept", exam: "APSET (AP State Eligibility Test)", website: "https://apset.net.in", salary: "Pay Scale 37100-107800", notes: "B.Sc + B.Ed or M.Sc + SET." },
    ]
  },
  {
    course: "B.Ed / M.Ed",
    jobs: [
      { name: "Secondary Grade Teacher (SGT)", org: "AP School Education Dept", exam: "AP TET + DSC (District Selection Committee)", website: "https://aptet.apcfss.in", salary: "Pay Scale 30000-95820", notes: "D.El.Ed/B.Ed." },
      { name: "School Assistant (SA)", org: "AP School Education Dept", exam: "AP TET Paper II + DSC", website: "https://aptet.apcfss.in", salary: "Pay Scale 35120-87130", notes: "B.Sc/BA + B.Ed + AP TET Paper II." },
      { name: "Physical Education Teacher (PET)", org: "AP School Education Dept", exam: "AP TET + DSC", website: "https://aptet.apcfss.in", salary: "Pay Scale 30000-95820", notes: "B.P.Ed required." },
      { name: "KVS Teacher in AP (Central)", org: "Kendriya Vidyalaya Sangathan", exam: "KVS Recruitment", website: "https://kvsangathan.nic.in/careers", salary: "Pay Level 6-8", notes: "TGT/PGT for KVs in AP." },
    ]
  },
  {
    course: "LLB",
    jobs: [
      { name: "Civil Judge (Junior Division)", org: "AP Judicial Service", exam: "APPSC Group-I + AP Judicial Services Exam", website: "https://psc.ap.gov.in", salary: "Pay Scale 77840-137920", notes: "3-year LLB or integrated 5-year LLB." },
      { name: "Public Prosecutor / Additional Public Prosecutor", org: "AP Home Dept / District Courts", exam: "Direct appointment / APPSC", website: "https://psc.ap.gov.in", salary: "Pay Scale 50100-158525", notes: "LLB with 7 years practice for PP." },
    ]
  },
  {
    course: "MBA / BBA",
    jobs: [
      { name: "APSFC Finance Officer", org: "AP State Financial Corporation", exam: "APSFC Direct Recruitment", website: "https://www.apsfc.com", salary: "~₹40,000-70,000/month", notes: "MBA Finance / Commerce." },
      { name: "AP Grameen Vikas Bank – Officer", org: "AP Grameen Vikas Bank (RRB)", exam: "IBPS RRB Officer Scale I", website: "https://www.ibps.in", salary: "~₹35,000-40,000/month", notes: "Graduation. MBA preferred for Scale II." },
    ]
  },
  {
    course: "B.Pharm / D.Pharm",
    jobs: [
      { name: "Drug Inspector", org: "AP Drugs Control Administration", exam: "APPSC / Direct", website: "https://psc.ap.gov.in", salary: "Pay Scale 37100-107800", notes: "B.Pharm mandatory." },
      { name: "Pharmacist – Govt Hospitals", org: "AP Health Dept / APVVP", exam: "Para-Medical Recruitment Board", website: "https://aphealth.ap.gov.in", salary: "Pay Scale 23650-73550", notes: "D.Pharm/B.Pharm." },
    ]
  },
  {
    course: "B.Sc Nursing / GNM",
    jobs: [
      { name: "Staff Nurse – Govt Hospitals", org: "AP Health Dept / APVVP", exam: "Para-Medical Recruitment Board", website: "https://aphealth.ap.gov.in", salary: "Pay Scale 29150-77750", notes: "B.Sc Nursing or GNM + INC registration." },
      { name: "ANM (Auxiliary Nurse Midwife) – NHM AP", org: "NHM Andhra Pradesh", exam: "NHM AP Recruitment", website: "https://arogya.ap.gov.in", salary: "~₹12,000-15,000/month (contractual)", notes: "ANM certificate required." },
    ]
  },
  {
    course: "B.Sc Agriculture / Horticulture",
    jobs: [
      { name: "Agriculture Extension Officer (AEO)", org: "AP Agriculture & Cooperation Dept", exam: "APPSC AEO", website: "https://psc.ap.gov.in", salary: "Pay Scale 30000-95820", notes: "B.Sc Agriculture." },
      { name: "Horticulture Extension Officer", org: "AP Horticulture Dept", exam: "APPSC", website: "https://psc.ap.gov.in", salary: "Pay Scale 30000-95820", notes: "B.Sc Horticulture." },
    ]
  },
];

export default apGovtJobs;
