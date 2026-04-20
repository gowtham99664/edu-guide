// Karnataka State Government Jobs by Qualification
// Recruitment: KPSC, BESCOM/MESCOM/GESCOM, KPTCL, KH&DP, Karnataka Health, etc.

const kaGovtJobs = [
  {
    course: "B.Tech / B.E.",
    jobs: [
      { name: "Assistant Executive Engineer (AEE) – KPSC", org: "Karnataka PWD / Irrigation / Rural Dev Dept", exam: "KPSC AEE Exam", website: "https://kpsc.kar.nic.in", salary: "Pay Scale 35600-63100", notes: "Civil, EE, ME." },
      { name: "Assistant Engineer – BESCOM / MESCOM / KPTCL", org: "Bangalore Electricity Supply Company / KPTCL", exam: "KPTCL/BESCOM AE Exam", website: "https://www.kptcl.com/careers", salary: "~₹40,000-65,000/month", notes: "EE, ME." },
      { name: "Junior Engineer – BBMP / BDA", org: "Bruhat Bengaluru Mahanagara Palike / BDA", exam: "KPSC / Direct", website: "https://bbmp.gov.in", salary: "~₹35,000/month", notes: "Civil." },
      { name: "ISRO Bangalore – Scientist/Engineer SC", org: "ISRO U R Rao Satellite Centre (URSC/ISAC) Bangalore", exam: "ICRB Written Test", website: "https://www.isro.gov.in/careers", salary: "Pay Level 10", notes: "EE, CS, ME, EC. Major ISRO base in Bangalore." },
      { name: "HAL Bangalore – GET", org: "Hindustan Aeronautics Limited HQ Bangalore", exam: "GATE + HAL Interview", website: "https://hal-india.co.in/careers", salary: "E1 Grade", notes: "ME, EE, EC, CS, Aerospace." },
      { name: "DRDO Bangalore Labs – Scientist B", org: "ADE / GTRE / ADE / LRDE / CABS Bangalore", exam: "DRDO SET", website: "https://www.drdo.gov.in/careers", salary: "Pay Level 10", notes: "Many DRDO labs in Bangalore." },
      { name: "NAL (National Aerospace Labs) – Scientist B", org: "CSIR-NAL Bangalore", exam: "CSIR Recruitment / NET", website: "https://nal.res.in/careers", salary: "Pay Level 10", notes: "Aerospace, ME, EE, CS." },
    ]
  },
  {
    course: "MBBS / MD / MS",
    jobs: [
      { name: "Medical Officer Grade I", org: "Karnataka Health & Family Welfare Dept", exam: "KPSC Medical Officer Exam", website: "https://kpsc.kar.nic.in", salary: "Pay Scale 56100-177500", notes: "MBBS + Internship + KMC registration." },
      { name: "NIMHANS Doctor / Faculty", org: "National Institute of Mental Health & Neurosciences", exam: "NIMHANS Direct Recruitment", website: "https://nimhans.ac.in/careers", salary: "Pay Scale 67700+", notes: "Psychiatry, Neurology, Neurosurgery." },
      { name: "ESI Bangalore Doctor", org: "ESIC Karnataka", exam: "ESIC Recruitment", website: "https://esic.nic.in/careers", salary: "Pay Level 10", notes: "MBBS." },
    ]
  },
  {
    course: "B.Sc / M.Sc",
    jobs: [
      { name: "Agriculture Officer", org: "Karnataka Agriculture Dept", exam: "KPSC AO Exam", website: "https://kpsc.kar.nic.in", salary: "Pay Scale 29600-65900", notes: "B.Sc Agriculture." },
      { name: "Scientist – JNCASR / IISc (Research Labs Bangalore)", org: "JNCASR / IISc Bangalore (Central aided)", exam: "Direct Recruitment / GATE / NET", website: "https://www.jncasr.ac.in/careers", salary: "Pay Level 10-14", notes: "Physics, Chemistry, Biology, Engg Sciences." },
      { name: "Scientific Assistant – NAL / CSIR Bangalore", org: "CSIR-NAL / CSIR-CFTRI", exam: "CSIR CEPTAM", website: "https://nal.res.in/careers", salary: "Pay Level 6", notes: "B.Sc / B.Tech." },
    ]
  },
  {
    course: "B.Ed / M.Ed",
    jobs: [
      { name: "Primary School Teacher (PST)", org: "Karnataka School Education Dept", exam: "KARTET + KPSC DSC", website: "https://kartet.kar.nic.in", salary: "Pay Scale 22400-62600", notes: "D.El.Ed/B.Ed + KARTET." },
      { name: "High School Teacher (HST)", org: "Karnataka School Education Dept", exam: "KARTET Paper II + KPSC", website: "https://kartet.kar.nic.in", salary: "Pay Scale 29600-65900", notes: "B.Sc/BA + B.Ed + KARTET." },
      { name: "Lecturer – Karnataka Degree Colleges", org: "Karnataka Higher Education Dept", exam: "KSET (Karnataka SET) + KPSC", website: "https://kset.uni-mysore.ac.in", salary: "Pay Scale 42700-134400", notes: "M.Sc/MA + KSET/NET." },
    ]
  },
  {
    course: "LLB",
    jobs: [
      { name: "Civil Judge – Karnataka Judicial Service", org: "Karnataka High Court", exam: "Karnataka Judicial Services Exam", website: "https://karnatakajudiciary.kar.nic.in", salary: "Pay Scale 77840-137920", notes: "LLB." },
      { name: "Public Prosecutor / APP", org: "Karnataka Law Dept", exam: "Direct Appointment via HC / KPSC", website: "https://kpsc.kar.nic.in", salary: "Pay Scale 50100-158525", notes: "LLB + practice." },
    ]
  },
  {
    course: "B.Pharm / D.Pharm",
    jobs: [
      { name: "Drug Inspector – Karnataka", org: "Karnataka Drugs Control Dept", exam: "KPSC / Direct", website: "https://kpsc.kar.nic.in", salary: "Pay Scale 29600-65900", notes: "B.Pharm." },
      { name: "Pharmacist – Govt Hospitals", org: "Karnataka Health Dept / ESIC", exam: "KPSC Para-Medical", website: "https://kpsc.kar.nic.in", salary: "Pay Scale 21400-42000", notes: "D.Pharm/B.Pharm." },
    ]
  },
  {
    course: "B.Sc Nursing / GNM",
    jobs: [
      { name: "Staff Nurse Grade 2", org: "Karnataka Health Dept / ESIC", exam: "KPSC Para-Medical Recruitment", website: "https://kpsc.kar.nic.in", salary: "Pay Scale 24900-55500", notes: "B.Sc Nursing/GNM." },
    ]
  },
  {
    course: "MBA / B.Com / CA",
    jobs: [
      { name: "Karnataka Grameena Bank – Officer (RRB)", org: "Karnataka Grameena Bank", exam: "IBPS RRB Officer Scale I", website: "https://www.ibps.in", salary: "~₹35,000/month", notes: "Any graduation." },
      { name: "KSB / KSFC Finance Officer", org: "Karnataka State Financial Corporation", exam: "KSFC Direct Recruitment", website: "https://ksfc.in/careers", salary: "~₹40,000-70,000/month", notes: "MBA Finance/Commerce." },
    ]
  },
];

export default kaGovtJobs;
