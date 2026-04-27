const placements = [
  {
    collegeId: "iit_madras",
    year: 2024,
    stats: {
      studentsPlaced: 1200,
      totalEligible: 1350,
      placementPercentage: 89,
      averagePackage: "21.48 LPA",
      medianPackage: "18.0 LPA",
      highestPackage: "3.67 Cr (International)",
      highestDomestic: "1.31 Cr",
    },
    topRecruiters: ["Google", "Microsoft", "Goldman Sachs", "Amazon", "Qualcomm", "Texas Instruments", "DE Shaw", "Samsung", "Uber", "Flipkart"],
    sectorWise: {
      "IT/Software": 35,
      "Core Engineering": 18,
      "Finance/Consulting": 20,
      "Analytics/Data Science": 12,
      "Research/Higher Studies": 10,
      "Others": 5
    }
  },
  {
    collegeId: "iit_delhi",
    year: 2024,
    stats: {
      studentsPlaced: 1100,
      totalEligible: 1250,
      placementPercentage: 88,
      averagePackage: "22.16 LPA",
      medianPackage: "18.5 LPA",
      highestPackage: "3.80 Cr (International)",
      highestDomestic: "1.40 Cr",
    },
    topRecruiters: ["Google", "Microsoft", "Goldman Sachs", "Amazon", "JP Morgan", "Uber", "Flipkart", "McKinsey", "BCG", "Adobe"],
    sectorWise: {
      "IT/Software": 38,
      "Core Engineering": 14,
      "Finance/Consulting": 22,
      "Analytics/Data Science": 13,
      "Research/Higher Studies": 8,
      "Others": 5
    }
  },
  {
    collegeId: "iit_bombay",
    year: 2024,
    stats: {
      studentsPlaced: 1350,
      totalEligible: 1500,
      placementPercentage: 90,
      averagePackage: "23.5 LPA",
      medianPackage: "20.0 LPA",
      highestPackage: "4.31 Cr (International)",
      highestDomestic: "1.68 Cr",
    },
    topRecruiters: ["Google", "Microsoft", "Apple", "Goldman Sachs", "Amazon", "Uber", "Tower Research", "DE Shaw", "McKinsey", "BCG"],
    sectorWise: {
      "IT/Software": 40,
      "Core Engineering": 12,
      "Finance/Consulting": 24,
      "Analytics/Data Science": 11,
      "Research/Higher Studies": 8,
      "Others": 5
    }
  },
  {
    collegeId: "iit_kanpur",
    year: 2024,
    stats: {
      studentsPlaced: 950,
      totalEligible: 1100,
      placementPercentage: 86,
      averagePackage: "20.12 LPA",
      medianPackage: "17.0 LPA",
      highestPackage: "2.80 Cr (International)",
      highestDomestic: "1.10 Cr",
    },
    topRecruiters: ["Google", "Microsoft", "Samsung", "Amazon", "Goldman Sachs", "Qualcomm", "Texas Instruments", "DE Shaw", "Flipkart", "Oracle"],
    sectorWise: {
      "IT/Software": 36,
      "Core Engineering": 20,
      "Finance/Consulting": 18,
      "Analytics/Data Science": 12,
      "Research/Higher Studies": 9,
      "Others": 5
    }
  },
  {
    collegeId: "iit_kharagpur",
    year: 2024,
    stats: {
      studentsPlaced: 1500,
      totalEligible: 1750,
      placementPercentage: 86,
      averagePackage: "19.84 LPA",
      medianPackage: "16.5 LPA",
      highestPackage: "2.60 Cr (International)",
      highestDomestic: "1.05 Cr",
    },
    topRecruiters: ["Google", "Microsoft", "Amazon", "Goldman Sachs", "Tata Steel", "JP Morgan", "Samsung", "Shell", "Schlumberger", "BCG"],
    sectorWise: {
      "IT/Software": 33,
      "Core Engineering": 22,
      "Finance/Consulting": 17,
      "Analytics/Data Science": 11,
      "Research/Higher Studies": 11,
      "Others": 6
    }
  },
  {
    collegeId: "iit_roorkee",
    year: 2024,
    stats: {
      studentsPlaced: 1050,
      totalEligible: 1220,
      placementPercentage: 86,
      averagePackage: "18.62 LPA",
      medianPackage: "15.5 LPA",
      highestPackage: "2.40 Cr (International)",
      highestDomestic: "95 LPA",
    },
    topRecruiters: ["Google", "Microsoft", "Amazon", "Samsung", "Goldman Sachs", "Qualcomm", "Adobe", "Flipkart", "Tata", "L&T"],
    sectorWise: {
      "IT/Software": 34,
      "Core Engineering": 24,
      "Finance/Consulting": 16,
      "Analytics/Data Science": 10,
      "Research/Higher Studies": 10,
      "Others": 6
    }
  },
  {
    collegeId: "nit_trichy",
    year: 2024,
    stats: {
      studentsPlaced: 1050,
      totalEligible: 1200,
      placementPercentage: 88,
      averagePackage: "12.5 LPA",
      medianPackage: "10.0 LPA",
      highestPackage: "1.20 Cr (International)",
      highestDomestic: "62 LPA",
    },
    topRecruiters: ["Google", "Microsoft", "Amazon", "Goldman Sachs", "Samsung", "Caterpillar", "Oracle", "Infosys", "TCS", "Wipro"],
    sectorWise: {
      "IT/Software": 42,
      "Core Engineering": 20,
      "Finance/Consulting": 12,
      "Analytics/Data Science": 10,
      "Research/Higher Studies": 8,
      "Others": 8
    }
  },
  {
    collegeId: "nit_warangal",
    year: 2024,
    stats: {
      studentsPlaced: 900,
      totalEligible: 1050,
      placementPercentage: 86,
      averagePackage: "11.8 LPA",
      medianPackage: "9.5 LPA",
      highestPackage: "1.05 Cr (International)",
      highestDomestic: "55 LPA",
    },
    topRecruiters: ["Google", "Microsoft", "Amazon", "Samsung", "Oracle", "Deloitte", "Goldman Sachs", "Infosys", "TCS", "Wipro"],
    sectorWise: {
      "IT/Software": 44,
      "Core Engineering": 18,
      "Finance/Consulting": 10,
      "Analytics/Data Science": 10,
      "Research/Higher Studies": 10,
      "Others": 8
    }
  },
  {
    collegeId: "nit_surathkal",
    year: 2024,
    stats: {
      studentsPlaced: 850,
      totalEligible: 1000,
      placementPercentage: 85,
      averagePackage: "12.0 LPA",
      medianPackage: "9.8 LPA",
      highestPackage: "1.10 Cr (International)",
      highestDomestic: "58 LPA",
    },
    topRecruiters: ["Google", "Microsoft", "Amazon", "Samsung", "Oracle", "Goldman Sachs", "Cisco", "Infosys", "TCS", "Flipkart"],
    sectorWise: {
      "IT/Software": 43,
      "Core Engineering": 19,
      "Finance/Consulting": 11,
      "Analytics/Data Science": 10,
      "Research/Higher Studies": 9,
      "Others": 8
    }
  },
  {
    collegeId: "bits_pilani",
    year: 2024,
    stats: {
      studentsPlaced: 1400,
      totalEligible: 1600,
      placementPercentage: 88,
      averagePackage: "16.5 LPA",
      medianPackage: "14.0 LPA",
      highestPackage: "1.80 Cr (International)",
      highestDomestic: "82 LPA",
    },
    topRecruiters: ["Google", "Microsoft", "Amazon", "Goldman Sachs", "Samsung", "Uber", "Flipkart", "DE Shaw", "Oracle", "Adobe"],
    sectorWise: {
      "IT/Software": 42,
      "Core Engineering": 14,
      "Finance/Consulting": 18,
      "Analytics/Data Science": 12,
      "Research/Higher Studies": 7,
      "Others": 7
    }
  },
  {
    collegeId: "iim_ahmedabad",
    year: 2024,
    stats: {
      studentsPlaced: 415,
      totalEligible: 420,
      placementPercentage: 99,
      averagePackage: "35.88 LPA",
      medianPackage: "32.0 LPA",
      highestPackage: "1.15 Cr (International)",
      highestDomestic: "75 LPA",
    },
    topRecruiters: ["McKinsey", "BCG", "Bain", "Goldman Sachs", "Amazon", "Google", "Accenture Strategy", "Avendus", "JP Morgan", "Flipkart"],
    sectorWise: {
      "Consulting": 30,
      "Finance/Banking": 25,
      "IT/E-commerce": 18,
      "FMCG/Consumer Goods": 10,
      "General Management": 10,
      "Others": 7
    }
  },
  {
    collegeId: "iim_bangalore",
    year: 2024,
    stats: {
      studentsPlaced: 520,
      totalEligible: 530,
      placementPercentage: 98,
      averagePackage: "34.21 LPA",
      medianPackage: "31.0 LPA",
      highestPackage: "1.10 Cr (International)",
      highestDomestic: "72 LPA",
    },
    topRecruiters: ["McKinsey", "BCG", "Bain", "Amazon", "Google", "Goldman Sachs", "Microsoft", "Accenture Strategy", "Deloitte", "JP Morgan"],
    sectorWise: {
      "Consulting": 28,
      "Finance/Banking": 22,
      "IT/E-commerce": 22,
      "FMCG/Consumer Goods": 10,
      "General Management": 11,
      "Others": 7
    }
  },
  {
    collegeId: "iim_calcutta",
    year: 2024,
    stats: {
      studentsPlaced: 480,
      totalEligible: 490,
      placementPercentage: 98,
      averagePackage: "33.82 LPA",
      medianPackage: "30.0 LPA",
      highestPackage: "1.08 Cr (International)",
      highestDomestic: "70 LPA",
    },
    topRecruiters: ["McKinsey", "BCG", "Goldman Sachs", "JP Morgan", "Amazon", "Google", "Bain", "Citibank", "Deloitte", "Flipkart"],
    sectorWise: {
      "Consulting": 25,
      "Finance/Banking": 28,
      "IT/E-commerce": 20,
      "FMCG/Consumer Goods": 9,
      "General Management": 11,
      "Others": 7
    }
  },
  {
    collegeId: "aiims_delhi",
    year: 2024,
    stats: {
      studentsPlaced: null,
      totalEligible: null,
      placementPercentage: null,
      averagePackage: null,
      medianPackage: null,
      highestPackage: null,
      highestDomestic: null,
    },
    topRecruiters: [],
    sectorWise: {
      "Clinical Practice": 40,
      "Super Specialization (DM/MCh)": 30,
      "Research/Academia": 15,
      "Public Health/Government": 10,
      "Others": 5
    },
    note: "Medical colleges do not have traditional campus placements. AIIMS graduates pursue super-specialization, clinical practice, research, or government service. Data shown represents career path distribution of graduates."
  },
  {
    collegeId: "nlu_delhi",
    year: 2024,
    stats: {
      studentsPlaced: 140,
      totalEligible: 155,
      placementPercentage: 90,
      averagePackage: "22.0 LPA",
      medianPackage: "18.0 LPA",
      highestPackage: "52 LPA",
      highestDomestic: "52 LPA",
    },
    topRecruiters: ["AZB & Partners", "Cyril Amarchand Mangaldas", "Khaitan & Co", "Trilegal", "S&R Associates", "Shardul Amarchand", "Luthra & Luthra", "JSA", "Lakshmikumaran & Sridharan", "IndusLaw"],
    sectorWise: {
      "Corporate Law Firms": 45,
      "Litigation": 15,
      "Policy/Government": 12,
      "Legal Process Outsourcing": 8,
      "Judiciary Preparation": 12,
      "Others": 8
    }
  },
  {
    collegeId: "iisc",
    year: 2024,
    stats: {
      studentsPlaced: 600,
      totalEligible: 750,
      placementPercentage: 80,
      averagePackage: "18.0 LPA",
      medianPackage: "15.0 LPA",
      highestPackage: "1.50 Cr (International)",
      highestDomestic: "65 LPA",
    },
    topRecruiters: ["Google", "Microsoft", "Amazon", "Intel", "Samsung", "Qualcomm", "Goldman Sachs", "ISRO", "DRDO", "TCS Research"],
    sectorWise: {
      "IT/Software": 28,
      "Core Engineering/R&D": 22,
      "Research/Academia": 25,
      "Finance/Consulting": 8,
      "Government/PSU": 10,
      "Others": 7
    },
    note: "IISc is primarily a research institution. Many graduates pursue PhD, post-doctoral research, or academic careers rather than industry placements."
  }
]

export default placements
