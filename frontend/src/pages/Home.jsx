import { useState } from 'react'
import { Link } from 'react-router-dom'
import engineeringExams from '../data/engineeringExams'
import { medicalExams, lawExams, managementExams } from '../data/otherExams'
import { designExams, architectureExams, agricultureExams, teachingExams, professionalExams, researchExams, culinaryExams, horticultureExams } from '../data/moreExams'
import colleges from '../data/colleges'
import statesData from '../data/statesData'
import schoolEntranceExams from '../data/schoolEntranceExams'
import { careerPaths } from '../data/careerPaths'

const allExams = [...engineeringExams, ...medicalExams, ...lawExams, ...managementExams, ...designExams, ...architectureExams, ...agricultureExams, ...teachingExams, ...professionalExams, ...researchExams, ...culinaryExams, ...horticultureExams]

/* ── Pathway data ── */
const afterTenthStreams = [
  {
    id: 'mpc', name: 'MPC / PCM', full: 'Maths, Physics, Chemistry', color: '#2563eb',
    courses: [
      { name: 'B.Tech / B.E. (4 yrs)', eligibility: 'Class 12 with PCM, min 75% (65% SC/ST). Age: no limit for most.', exams: 'JEE Main, JEE Advanced, BITSAT, VITEEE, SRMJEEE, COMEDK, MHT CET, KCET, AP/TS EAMCET, WBJEE, KEAM, GUJCET, UPCET, CUET', colleges: 'IITs, NITs, IIITs, BITS, VIT, SRM, State Engg Colleges' },
      { name: 'B.Arch (5 yrs)', eligibility: 'Class 12 with PCM, min 50%. Maths mandatory.', exams: 'NATA, JEE Main Paper 2A', colleges: 'SPA Delhi, IIT Roorkee/Kharagpur, NIT Trichy, CEPT' },
      { name: 'B.Sc Maths/Physics/Chemistry (3 yrs)', eligibility: 'Class 12 with relevant subjects.', exams: 'CUET UG, University entrances', colleges: 'DU, BHU, JNU, St. Stephens, Presidency, IISc (BS), IISERs (BS-MS)' },
      { name: 'BS-MS Dual Degree (5 yrs)', eligibility: 'Class 12 with PCM. JEE Advanced / KVPY / IISER Aptitude Test.', exams: 'JEE Advanced, IISER Aptitude Test', colleges: 'IISc Bangalore, 7 IISERs' },
      { name: 'B.Des (Design) (4 yrs)', eligibility: 'Class 12 any stream (PCM preferred for some).', exams: 'NID DAT, UCEED, NIFT Entrance', colleges: 'NID, IIT Bombay IDC, IIT Delhi/Guwahati/Hyderabad, NIFT' },
      { name: 'B.Sc Nautical Science (3 yrs)', eligibility: 'Class 12 PCM, min 60%. Age: 17-25.', exams: 'IMU CET', colleges: 'IMU Chennai, MERI Mumbai, TS Chanakya' },
      { name: 'BCA (3 yrs)', eligibility: 'Class 12 with Maths (some accept without).', exams: 'CUET, University entrances', colleges: 'Christ, Symbiosis, NIT Trichy (MCA integrated), State Universities' },
      { name: 'B.Sc Aviation (3 yrs)', eligibility: 'Class 12 PCM, min 50%.', exams: 'University entrances', colleges: 'Rajiv Gandhi Aviation University, Amity, Hindustan University' },
      { name: 'NDA (Army/Navy/Air Force)', eligibility: 'Class 12 PCM (for Navy/AF). Age: 16.5-19.5. Unmarried males & females.', exams: 'NDA Exam (UPSC) + SSB Interview', colleges: 'NDA Khadakwasla then IMA/INA/AFA' },
      { name: 'Merchant Navy (DNS/B.Sc Nautical)', eligibility: 'Class 12 PCM, min 60%. Age: 17-25.', exams: 'IMU CET', colleges: 'IMU, TS Chanakya, MERI' },
      { name: 'B.Planning (4 yrs)', eligibility: 'Class 12 with Maths.', exams: 'JEE Main Paper 2B', colleges: 'SPA Delhi/Bhopal/Vijayawada, IIT Kharagpur/Roorkee' },
      { name: 'Integrated M.Sc (5 yrs)', eligibility: 'Class 12 PCM.', exams: 'JAM, IIT entrance, CUET', colleges: 'IITs, Central Universities, NISERs' },
    ]
  },
  {
    id: 'bipc', name: 'BiPC / PCB', full: 'Biology, Physics, Chemistry', color: '#dc2626',
    courses: [
      { name: 'MBBS (5.5 yrs)', eligibility: 'Class 12 with PCB, min 50% (40% SC/ST). Age: 17-25 at admission.', exams: 'NEET UG (only exam)', colleges: 'AIIMS (23), JIPMER, CMC Vellore, AFMC, Govt & Pvt Medical Colleges' },
      { name: 'BDS (Dental) (5 yrs)', eligibility: 'Class 12 with PCB, min 50%. NEET qualified.', exams: 'NEET UG', colleges: 'Maulana Azad Dental, Manipal, SDM, Govt Dental Colleges' },
      { name: 'BAMS / BHMS / BUMS / BSMS (AYUSH) (5.5 yrs)', eligibility: 'Class 12 with PCB, min 50%. NEET qualified.', exams: 'NEET UG', colleges: 'Govt AYUSH colleges, NIA Jaipur, RGUHS affiliates' },
      { name: 'B.Pharm (4 yrs)', eligibility: 'Class 12 with PCB/PCM, min 50%.', exams: 'State Pharmacy CETs, NEET (some states), WBJEE', colleges: 'NIPER, Jamia Hamdard, Manipal, BITS, State Pharmacy Colleges' },
      { name: 'B.Sc Nursing (4 yrs)', eligibility: 'Class 12 PCB, min 45%. Age: 17-35.', exams: 'NEET UG (for AIIMS Nursing), State Nursing CETs', colleges: 'AIIMS, CMC Vellore, RGUHS, Govt Nursing Colleges' },
      { name: 'BVSc (Veterinary) (5 yrs)', eligibility: 'Class 12 PCB, min 50%. Age: 17-25.', exams: 'NEET UG (counselling via VCI)', colleges: 'IVRI Izatnagar, GADVASU, TANUVAS, State Veterinary Colleges' },
      { name: 'B.Sc Agriculture (4 yrs)', eligibility: 'Class 12 PCB/PCM with Agriculture (some states). Min 50%.', exams: 'ICAR AIEEA, AP/TS EAMCET (Agri), State Agri CETs', colleges: 'IARI, PAU, TNAU, ANGRAU, GBPUAT, State Agri Universities' },
      { name: 'B.Sc Horticulture (4 yrs)', eligibility: 'Class 12 PCB/Agriculture, min 50%.', exams: 'ICAR AIEEA, State Agri CETs', colleges: 'UHS Bagalkot, Dr. YSPUHF Nauni, IIHR Bangalore, State Horti Colleges' },
      { name: 'B.Sc Forestry (4 yrs)', eligibility: 'Class 12 PCB/PCM, min 50%.', exams: 'ICAR AIEEA, State CETs', colleges: 'FRI Dehradun, State Forestry Colleges' },
      { name: 'B.Sc Biotechnology (3 yrs)', eligibility: 'Class 12 PCB, min 50%.', exams: 'CUET, University entrances', colleges: 'JNU, DU, VIT, Amity, Manipal, State Universities' },
      { name: 'B.Sc Fisheries (4 yrs)', eligibility: 'Class 12 PCB, min 50%.', exams: 'ICAR AIEEA, State CETs', colleges: 'CIFE Mumbai, State Fisheries Colleges' },
      { name: 'B.Sc Microbiology / Genetics / Zoology (3 yrs)', eligibility: 'Class 12 PCB.', exams: 'CUET, University entrances', colleges: 'Central & State Universities' },
      { name: 'Allied Health Sciences (B.Sc MLT/Radiology/Physio)', eligibility: 'Class 12 PCB, min 50%.', exams: 'NEET (some), State CET, University entrance', colleges: 'AIIMS, CMC, Manipal, Govt Medical College affiliates' },
      { name: 'BPT (Physiotherapy) (4.5 yrs)', eligibility: 'Class 12 PCB, min 50%.', exams: 'State CET, CET BPT, University entrance', colleges: 'CMC, KIPT, State Medical Universities' },
    ]
  },
  {
    id: 'mbipc', name: 'MBiPC / PCMB', full: 'Maths, Biology, Physics, Chemistry', color: '#7c3aed',
    courses: [
      { name: 'All MPC courses + All BiPC courses', eligibility: 'Keeps both Engineering AND Medical paths open. Heavy workload in Class 11-12.', exams: 'JEE + NEET + all exams from both streams', colleges: 'All colleges from both MPC and BiPC streams' },
    ]
  },
  {
    id: 'commerce', name: 'Commerce (CEC/MEC)', full: 'Accountancy, Business Studies, Economics', color: '#d97706',
    courses: [
      { name: 'B.Com (Hons) (3 yrs)', eligibility: 'Class 12 Commerce, min 50-60%.', exams: 'CUET UG, DU JAT', colleges: 'SRCC, Hindu College, Christ, St. Xavier\'s, Loyola, State Universities' },
      { name: 'BBA / BMS (3 yrs)', eligibility: 'Class 12 any stream (Commerce preferred). Min 50%.', exams: 'CUET, DU JAT, IPMAT, SET, Christ entrance', colleges: 'IIM Indore (IPM), DU, Christ, Symbiosis, NMIMS, Shaheed Sukhdev College' },
      { name: 'CA (Chartered Accountant)', eligibility: 'Can register for CA Foundation after Class 12. Any stream.', exams: 'CA Foundation, Intermediate, Final (ICAI exams)', colleges: 'ICAI - self study + coaching. Can do alongside B.Com.' },
      { name: 'CS (Company Secretary)', eligibility: 'Can register after Class 12. Any stream.', exams: 'CS Foundation, Executive, Professional (ICSI exams)', colleges: 'ICSI - self study + coaching' },
      { name: 'CMA (Cost & Management Accountant)', eligibility: 'Can register after Class 12. Any stream.', exams: 'CMA Foundation, Intermediate, Final (ICMAI exams)', colleges: 'ICMAI - self study + coaching' },
      { name: 'BA LLB / BBA LLB (5 yrs)', eligibility: 'Class 12 any stream, min 45% (40% SC/ST). Age: max 20 (22 SC/ST).', exams: 'CLAT, AILET, LSAT India, MH CET Law, AP/TS LAWCET', colleges: '23 NLUs, DU Law Faculty, ILS Pune, GLC Mumbai, Symbiosis Law' },
      { name: 'B.Com LLB (5 yrs)', eligibility: 'Class 12 Commerce preferred.', exams: 'CLAT, University entrances', colleges: 'GNLU, NLU Jodhpur, Symbiosis' },
      { name: 'BBA LLB (5 yrs)', eligibility: 'Class 12 any stream.', exams: 'CLAT, AILET, University entrances', colleges: 'NLUs, NLSIU, Symbiosis Law' },
      { name: 'B.Sc Economics (Hons) (3 yrs)', eligibility: 'Class 12 with Maths (for top colleges).', exams: 'CUET, University entrance', colleges: 'DSE (DU), ISI, Presidency, St. Stephens, Madras School of Economics' },
      { name: 'Actuarial Science', eligibility: 'Class 12 with Maths. Any stream.', exams: 'IAI (Institute of Actuaries of India) exams', colleges: 'IAI, Bishop Heber, Amity, Christ' },
      { name: 'IPM - Integrated MBA (5 yrs)', eligibility: 'Class 12 any stream. Age: max 20.', exams: 'IPMAT (IIM Indore/Rohtak), JIPMAT', colleges: 'IIM Indore, IIM Rohtak, IIM Ranchi, IIM Bodh Gaya, NALSAR' },
    ]
  },
  {
    id: 'arts', name: 'Arts / Humanities', full: 'History, Pol Sci, Geography, Psychology, Sociology, Languages', color: '#0d9488',
    courses: [
      { name: 'BA (Hons) (3 yrs)', eligibility: 'Class 12 any stream.', exams: 'CUET UG', colleges: 'DU, JNU, BHU, Jadavpur, Presidency, HCU, JMI, AMU, Christ, St. Xaviers' },
      { name: 'BA LLB (5 yrs)', eligibility: 'Class 12 any stream, min 45%.', exams: 'CLAT, AILET, LSAT India, State LAWCETs', colleges: '23+ NLUs, DU Law Faculty, ILS Pune, GLC Mumbai' },
      { name: 'B.Des / Fashion Design (4 yrs)', eligibility: 'Class 12 any stream.', exams: 'NID DAT, NIFT Entrance, UCEED', colleges: 'NID, NIFT (17 campuses), Pearl Academy, IIFT' },
      { name: 'BJ / BJMC (Journalism & Mass Comm) (3 yrs)', eligibility: 'Class 12 any stream, min 50%.', exams: 'CUET, IIMC entrance, IPU CET, University entrances', colleges: 'IIMC, Jamia, DU, Symbiosis (SIC), ACJ Chennai, Xavier\'s Mumbai' },
      { name: 'B.Sc HHA - Hotel Management (4 yrs)', eligibility: 'Class 12 any stream. Age: max 25 (Gen).', exams: 'NCHMCT JEE', colleges: 'IHM Mumbai, Delhi, Bangalore, Hyderabad + 30 IHMs' },
      { name: 'Culinary Arts / B.Sc Culinary Arts (3-4 yrs)', eligibility: 'Class 12 any stream. Age: 17-25.', exams: 'NCHMCT JEE, Institute-specific entrance', colleges: 'IHM (Culinary programs), Welcomgroup WGSHA Manipal, IICA Tirupati, Culinary Academy of India Hyderabad' },
      { name: 'BFA (Fine Arts) (4 yrs)', eligibility: 'Class 12 any stream. Portfolio/sketch test.', exams: 'BHU UET, CUET, College entrance + Drawing test', colleges: 'BHU Fine Arts, MSU Baroda, JJ School of Art Mumbai, Govt College of Art Delhi/Chennai' },
      { name: 'BPA (Performing Arts - Music/Dance/Theatre)', eligibility: 'Class 12 any stream. Audition based.', exams: 'University auditions', colleges: 'NSD (Drama), SRFTI, FTII, BHU Music, DU Music' },
      { name: 'B.Ed (After Graduation) (2 yrs)', eligibility: 'Graduation with 50% (45% SC/ST).', exams: 'State B.Ed CET, CUET B.Ed', colleges: 'CIE DU, State B.Ed colleges, IGNOU' },
      { name: 'BA Social Work (BSW) (3 yrs)', eligibility: 'Class 12 any stream.', exams: 'CUET, TISS BAT', colleges: 'TISS, DU, JMI, Loyola, Madras Christian College' },
      { name: 'B.El.Ed (Elementary Education) (4 yrs)', eligibility: 'Class 12 any stream, min 50%.', exams: 'DU B.El.Ed entrance', colleges: 'DU affiliated colleges (Lady Irwin, IASE, Aditi Mahavidyalaya)' },
      { name: 'BA Psychology (3 yrs)', eligibility: 'Class 12 any stream.', exams: 'CUET', colleges: 'DU, Christ, Fergusson, JMI, Lady Shri Ram' },
      { name: 'B.Lib.I.Sc (Library Science) (1 yr after grad)', eligibility: 'Graduation in any subject.', exams: 'University entrance', colleges: 'DU, BHU, AMU, State Universities' },
      { name: 'B.Sc / Diploma in Photography (1-3 yrs)', eligibility: 'Class 12 any stream. Portfolio may be required.', exams: 'Institute entrance / portfolio review', colleges: 'NIP Mumbai, Light & Life Academy Ooty, AJK MCRC (JMI), Sri Aurobindo Centre Delhi, NID' },
      { name: 'B.Mus / BPA Music (3 yrs)', eligibility: 'Class 12 any stream. Audition/practical test required.', exams: 'University auditions, CUET', colleges: 'KM Conservatory Chennai (AR Rahman), DU Faculty of Music, BHU, Bhatkhande Lucknow, RMTMAU Gwalior, Rabindra Bharati Kolkata' },
      { name: 'BPA Dance / Diploma in Dance (3-4 yrs)', eligibility: 'Class 12 any stream. Audition/practical test.', exams: 'Institute auditions', colleges: 'Kalakshetra Chennai, Kerala Kalamandalam, Visva-Bharati Shantiniketan, Nalanda Dance Centre Mumbai, JNMDA Imphal' },
      { name: 'B.Sc Film Making / Direction (3 yrs)', eligibility: 'Class 12 any stream. Age: 20-25 typically.', exams: 'FTII entrance (written + interview), SRFTI entrance', colleges: 'FTII Pune, SRFTI Kolkata, Whistling Woods Mumbai, LV Prasad Academy Chennai, AAFT Noida' },
      { name: 'B.Sc Animation & VFX / Multimedia (3 yrs)', eligibility: 'Class 12 any stream. Drawing/aptitude test.', exams: 'NID entrance, Institute tests', colleges: 'NID Ahmedabad, MAAC, Arena Animation, Frameboxx, Whistling Woods, Govt College of Fine Arts' },
      { name: 'B.P.Ed (Physical Education) (2 yrs after grad) / B.Sc Sports Science (3 yrs)', eligibility: 'B.P.Ed: Graduation + physical fitness. B.Sc: Class 12 with sports background.', exams: 'State B.P.Ed CET, University entrance, Physical fitness test', colleges: 'LNIPE Gwalior, NIS Patiala, IGIPESS Delhi, TAM University Manipur, State Universities' },
      { name: 'B.Sc Yoga / Certificate in Yoga (1-3 yrs)', eligibility: 'Class 12 any stream.', exams: 'University entrance', colleges: 'Morarji Desai Natl Inst of Yoga Delhi, S-VYASA Bangalore, Patanjali University, Dev Sanskriti Vishwavidyalaya, Lakulish Yoga University' },
      { name: 'B.A / Diploma in Drama & Theatre (3 yrs)', eligibility: 'Class 12 any stream. Audition required.', exams: 'NSD entrance, University auditions', colleges: 'National School of Drama Delhi, Bharatendu Natya Akademi Lucknow, School of Drama Calicut, Rabindra Bharati' },
    ]
  },
  {
    id: 'vocational', name: 'Vocational / Diploma', full: 'Polytechnic, ITI, Skill courses', color: '#059669',
    courses: [
      { name: 'Polytechnic Diploma (3 yrs)', eligibility: 'Class 10 passed.', exams: 'State POLYCET / DET', colleges: 'Govt Polytechnics in every state. Lateral entry to B.Tech 2nd year after diploma.' },
      { name: 'ITI (Industrial Training, 1-2 yrs)', eligibility: 'Class 8/10 depending on trade.', exams: 'State ITI entrance / merit based', colleges: 'Govt & Pvt ITIs. Trades: Fitter, Electrician, Welder, Mechanic, COPA, etc.' },
      { name: 'Diploma in Engineering (3 yrs)', eligibility: 'Class 10 passed.', exams: 'State POLYCET', colleges: 'Govt Polytechnics, lateral entry to B.Tech 2nd year' },
      { name: 'Diploma in Pharmacy (D.Pharm) (2 yrs)', eligibility: 'Class 12 PCB/PCM.', exams: 'State POLYCET / Pharmacy CET', colleges: 'State Pharmacy Councils, Govt Pharmacy Colleges' },
      { name: 'ANM / GNM Nursing (1.5-3.5 yrs)', eligibility: 'Class 12 (ANM: Class 10 also). Age: 17-35.', exams: 'State Nursing CET', colleges: 'Govt Nursing Schools, District Hospitals' },
    ]
  },
]

const afterGradPaths = [
  // === Management (0-2) ===
  { name: 'MBA / PGDM (2 yrs)', eligibility: 'Any Bachelor\'s degree (any stream). Min 50%.', exams: 'CAT, XAT, MAT, CMAT, SNAP, NMAT, IIFT, GMAT', colleges: '21 IIMs, XLRI, FMS Delhi, ISB, MDI, SPJIMR, JBIMS, NMIMS, SIBM' },
  { name: 'PGDM in Specialized Areas (1-2 yrs)', eligibility: 'Any Bachelor\'s degree. Work experience preferred for some.', exams: 'CAT/XAT/GMAT (for top institutes). Institute-specific tests for others.', colleges: 'ISB Hyderabad (PGP), XLRI (HRM), IRMA (Rural Mgmt), MANAGE (Agri Mgmt), IIFM Bhopal, TISS (HRM/Social Enterprise)' },
  { name: 'MHA / MBA Healthcare (2 yrs)', eligibility: 'Any graduation (MBBS/BDS/BPT/B.Sc Nursing preferred). Min 50%.', exams: 'TISS entrance, CAT/XAT (for IIMs), CUET PG, Institute entrance', colleges: 'TISS Mumbai, IIM Lucknow (HM), IIHMR Jaipur, Symbiosis (SCHM), AIIMS (MHA), NIHFW Delhi' },

  // === Engineering & Tech PG (3-8) ===
  { name: 'M.Tech / ME (2 yrs)', eligibility: 'B.Tech/B.E. in relevant branch. Min 60%.', exams: 'GATE (primary), PGCET (Karnataka, AP, TS), CCMT (NIT/IIIT counselling via GATE), IIT-specific written tests, BITS HD, University entrance exams', colleges: 'IITs, IISc, NITs, IIITs, BITS (M.E.), IIIT Hyderabad, COEP, State Tech Universities', note: 'GATE is the main route but NOT the only one. Some IITs conduct their own written tests + interview. State universities have PGCET. BITS has its own HD entrance.' },
  { name: 'MCA (2 yrs)', eligibility: 'Any graduation with Maths at 12th/grad level. Min 50%.', exams: 'NIMCET (NIT MCA Common Entrance), State MCA CET, CUET PG, IPU CET, TANCET', colleges: 'NIT Trichy/Warangal/Allahabad/Surathkal, JNU, BHU, Anna University, DU, Pune University' },
  { name: 'M.Des (2 yrs)', eligibility: 'B.Des / B.Arch / B.Tech / any graduation (varies by institute). Portfolio required.', exams: 'CEED (IITs/IISc), NID M.Des entrance, NIFT M.Des entrance', colleges: 'IIT Bombay IDC, IIT Delhi, IIT Guwahati, IIT Hyderabad, IISc, NID (4 campuses), NIFT, DSK ISD Pune' },
  { name: 'M.Arch (2 yrs)', eligibility: 'B.Arch degree. Min 55%. Valid GATE score (Architecture).', exams: 'GATE (Architecture & Planning), CEED (some IITs), SPA entrance, Institute tests', colleges: 'SPA Delhi, IIT Roorkee/Kharagpur, CEPT, JJ College of Architecture, NIT Trichy' },
  { name: 'M.Plan (Master of Planning, 2 yrs)', eligibility: 'B.Plan / B.Arch / B.Tech (Civil/relevant). Min 55%.', exams: 'GATE (Planning), IIT entrance, CEPT entrance, SPA entrance', colleges: 'SPA Delhi/Bhopal/Vijayawada, IIT Kharagpur/Roorkee, CEPT Ahmedabad' },
  { name: 'M.Sc Data Science / AI / ML (2 yrs)', eligibility: 'B.Tech / B.Sc / BCA with Maths background. Min 55%.', exams: 'GATE, IIT JAM, Institute entrance, CUET PG', colleges: 'IIT Madras, IIT Hyderabad, IISc, CMI, ISI Kolkata, IIIT Hyderabad, Chennai Mathematical Institute' },

  // === Law PG (9-10) ===
  { name: 'LLB (3 yrs) — after ANY graduation', eligibility: 'Any Bachelor\'s degree. Min 45%. No age limit.', exams: 'MH CET Law (3yr), DU LLB entrance, BHU LLB, University entrances', colleges: 'DU Law Faculty, BHU, Symbiosis, GLC Mumbai, ILS Pune, State Law Colleges', note: 'Engineers, Doctors, Commerce, Arts — ALL can do LLB after graduation!' },
  { name: 'LLM (1-2 yrs)', eligibility: 'LLB/BA LLB degree.', exams: 'CLAT PG, AILET PG, University entrances', colleges: 'NLUs, DU, NLU Delhi, NALSAR, NLSIU, NUJS Kolkata' },

  // === Medical PG (11-17) ===
  { name: 'MD / MS (Medical PG, 3 yrs)', eligibility: 'MBBS degree + Internship completion.', exams: 'NEET PG (only exam for all MD/MS admissions)', colleges: 'AIIMS (23), PGI Chandigarh, CMC Vellore, JIPMER, NIMHANS, Govt Medical Colleges' },
  { name: 'DM / MCh (Super Specialty, 3 yrs)', eligibility: 'MD/MS degree in relevant specialty.', exams: 'NEET SS (only exam)', colleges: 'AIIMS, PGI, NIMHANS, CMC, SGPGI Lucknow' },
  { name: 'DNB (Diplomate of National Board, 3 yrs)', eligibility: 'MBBS degree + Internship.', exams: 'NEET PG (counselling via NBE)', colleges: 'NBE-accredited hospitals (Apollo, Fortis, Max, Medanta, Narayana Health)', note: 'DNB is equivalent to MD/MS. Training happens in accredited hospitals, not just medical colleges.' },
  { name: 'PG Diploma in Clinical Specialties (2 yrs)', eligibility: 'MBBS degree.', exams: 'NEET PG, DNB CET, State PG CET', colleges: 'District hospitals, Medical colleges. Specialties: Anaesthesia, Obstetrics, Paediatrics, Ortho, etc.', note: 'Shorter than MD/MS. Good for those wanting to practice quickly in rural/district areas.' },
  { name: 'M.Sc Nursing (2 yrs)', eligibility: 'B.Sc Nursing with 55%. 1 year clinical experience required.', exams: 'State PG Nursing CET, AIIMS M.Sc Nursing entrance', colleges: 'AIIMS, CMC Vellore, NIMHANS, RAK CON Delhi, State Nursing Colleges' },
  { name: 'MPH (Master of Public Health, 2 yrs)', eligibility: 'MBBS / BDS / BAMS / B.Sc Nursing / any health-related graduation.', exams: 'Institute entrance, CUET PG', colleges: 'IIPH (Gandhinagar, Hyderabad, Delhi), AIIMS, JNU, TISS, Manipal, CMC Vellore' },
  { name: 'M.Pharm (2 yrs)', eligibility: 'B.Pharm degree. Min 55%.', exams: 'GPAT (primary), NIPER JEE, State PG Pharmacy CET', colleges: 'NIPER (7 campuses), BITS, Jamia Hamdard, Manipal, ICT Mumbai' },

  // === Science & Arts PG (18-30) ===
  { name: 'M.Sc (2 yrs)', eligibility: 'B.Sc in relevant subject. Min 50%.', exams: 'IIT JAM, CUET PG, BHU PET, University entrances', colleges: 'IITs, IISc, IISERs, JNU, BHU, DU, Central & State Universities' },
  { name: 'MA (2 yrs)', eligibility: 'BA in relevant subject (some accept any grad).', exams: 'CUET PG, JNU entrance, BHU PET, University entrances', colleges: 'JNU, DU, BHU, HCU, Jadavpur, AMU, TISS' },
  { name: 'M.Com (2 yrs)', eligibility: 'B.Com / BBA / related degree. Min 50%.', exams: 'CUET PG, DU entrance, BHU PET, University entrances', colleges: 'DU (SRCC, Hindu, Hansraj), DSE, BHU, Christ University, Loyola, JMI, Symbiosis' },
  { name: 'M.Sc Agriculture / M.Sc Horticulture (2 yrs)', eligibility: 'B.Sc Agriculture / B.Sc Horticulture. Min 55%.', exams: 'ICAR AIEEA PG, State Agri University entrance, CUET PG', colleges: 'IARI Delhi, TNAU, PAU, ANGRAU, GBPUAT, UHS Bagalkot, State Agri Universities' },
  { name: 'MVSc (Master of Veterinary Science, 2 yrs)', eligibility: 'BVSc & AH degree.', exams: 'ICAR AIEEA PG, State Vet CET', colleges: 'IVRI Izatnagar, GADVASU, TANUVAS, MAFSU, State Veterinary Universities' },
  { name: 'MSW (Master of Social Work, 2 yrs)', eligibility: 'Any Bachelor\'s degree. Min 50%.', exams: 'TISS entrance (TISSNET + GD/PI), CUET PG, University entrances', colleges: 'TISS Mumbai/Tuljapur/Guwahati/Hyderabad, DU, JMI, Loyola Chennai' },
  { name: 'M.Ed (Master of Education, 2 yrs)', eligibility: 'B.Ed degree with 50%.', exams: 'State M.Ed CET, CUET PG, University entrances', colleges: 'CIE DU, BHU, Jamia Millia Islamia, State Universities, IGNOU' },
  { name: 'MFA / M.Mus / MA Performing Arts (2 yrs)', eligibility: 'BFA/BPA/BA in relevant art form. Audition/portfolio.', exams: 'University entrance + audition/portfolio', colleges: 'MSU Baroda, BHU, Hyderabad Univ, JJ School of Art, Rabindra Bharati, Kalakshetra' },
  { name: 'M.P.Ed / M.Sc Sports Science (2 yrs)', eligibility: 'B.P.Ed / B.Sc Sports Science / any graduation with sports background.', exams: 'University entrance + physical fitness', colleges: 'LNIPE Gwalior, NIS Patiala, IGIPESS Delhi, Pune University, State Universities' },
  { name: 'PG Diploma in Film / Mass Communication (1-2 yrs)', eligibility: 'Any graduation. Age varies.', exams: 'FTII entrance, IIMC entrance, Institute tests', colleges: 'FTII Pune, SRFTI Kolkata, IIMC Delhi, ACJ Chennai, Symbiosis, XIC Mumbai' },
  { name: 'MA / M.Sc Yoga & Naturopathy (2 yrs)', eligibility: 'BNYS / B.Sc Yoga / BA Yoga / Related graduation.', exams: 'University entrance', colleges: 'S-VYASA Bangalore, Morarji Desai National Inst Delhi, Patanjali University, Dev Sanskriti Vishwavidyalaya' },
  { name: 'M.Lib.I.Sc (Library & Info Science, 1 yr)', eligibility: 'B.Lib.I.Sc or equivalent. Min 50%.', exams: 'University entrance, CUET PG', colleges: 'DU, BHU, AMU, JMI, IGNOU, State Universities' },

  // === Research & Teaching (31-34) ===
  { name: 'UGC NET / CSIR NET (Teaching & Research eligibility)', eligibility: 'Master\'s degree with 55% (50% SC/ST/OBC/PwD).', exams: 'UGC NET (Humanities/Social Sci/Commerce), CSIR NET (Science subjects)', colleges: 'Qualifies for Assistant Professor in any University/College. JRF provides fellowship for PhD.', note: 'NET is an eligibility test, not an admission exam. JRF provides Rs. 37,000/month fellowship for PhD.' },
  { name: 'PhD / FPM (3-5 yrs)', eligibility: 'Master\'s degree (PhD). B.Tech+GATE or NET/JRF for some. FPM: any PG or B.Tech with good scores.', exams: 'GATE, UGC NET, CSIR NET, JEST, TIFR GS, NBHM, IIT/IISc written tests, University entrance', colleges: 'IITs, IISc, IISERs, TIFR, HRI, CMI, IIMs (FPM), JNU, Central Universities' },
  { name: 'Integrated PhD / BS-MS-PhD (5-6 yrs)', eligibility: 'B.Sc / B.Tech / M.Sc (varies). Strong academic record.', exams: 'IISc entrance, IISER entrance, JEST, TIFR GS, NBHM, Institute tests', colleges: 'IISc Bangalore, IISERs, TIFR, HRI, IMSc, CMI, NISER' },
  { name: 'Post-Doctoral Research (1-3 yrs)', eligibility: 'PhD in relevant field. Published research papers.', exams: 'No exam. Application + research proposal + interview.', colleges: 'IITs, IISc, IISERs, TIFR, NCBS, JNU, International universities. Funded by DST, CSIR, DBT, SERB fellowships.' },

  // === Professional Courses (35-36) ===
  { name: 'CA / CS / CMA (Professional Courses)', eligibility: 'CA: Can register after graduation (skip Foundation, direct Intermediate). CS/CMA: Similar.', exams: 'CA Intermediate + Final (ICAI), CS Executive + Professional (ICSI), CMA Intermediate + Final (ICMAI)', colleges: 'Self-study + coaching. Articleship (CA) under practicing CA for 3 years.', note: 'If you already have a Commerce/relevant graduation, you can skip Foundation and enter at Intermediate level directly.' },
  { name: 'CFA / FRM (Global Finance Certifications)', eligibility: 'Any Bachelor\'s degree (CFA). CFA requires 4 yrs work exp for charter. FRM: no degree required.', exams: 'CFA Level 1, 2, 3 (CFA Institute, USA). FRM Part 1, 2 (GARP, USA).', colleges: 'Self-study + coaching. Globally recognized. CFA is gold standard for investment/equity research/portfolio mgmt.' },
]

const schoolStages = [
  { label: 'Nursery', sub: 'Age 2.5-4', num: 1 },
  { label: 'LKG-UKG', sub: 'Age 4-6', num: 2 },
  { label: 'Primary 1-5', sub: 'Age 6-11', num: 3 },
  { label: 'Middle 6-8', sub: 'Age 11-14', num: 4 },
  { label: 'Secondary 9-10', sub: 'Age 14-16', num: 5 },
]

export default function Home() {
  const [activeStream, setActiveStream] = useState('mpc')
  const [openCourses, setOpenCourses] = useState({})
  const [activeGradTab, setActiveGradTab] = useState(null)
  const [openGradCourse, setOpenGradCourse] = useState({})

  const toggleCourse = (key) => setOpenCourses(p => ({...p, [key]: !p[key]}))
  const toggleGradCourse = (i) => setOpenGradCourse(p => ({...p, [i]: !p[i]}))

  const selectedStream = afterTenthStreams.find(s => s.id === activeStream)

  const quickLinks = [
    { icon: '~', title: 'School Exams', count: schoolEntranceExams.length, link: '/school-exams' },
    { icon: '~', title: 'Entrance Exams', count: allExams.length, link: '/entrance-exams' },
    { icon: '~', title: 'Colleges', count: colleges.length, link: '/colleges' },
    { icon: '~', title: 'States & UTs', count: statesData.length, link: '/states' },
    { icon: '~', title: 'Career Paths', count: careerPaths.length, link: '/career-paths' },
  ]

  const moreLinks = [
    { title: 'Prep Timeline', desc: 'Grade-wise roadmap', link: '/timeline' },
    { title: 'Scholarships', desc: '40+ scholarships', link: '/scholarships' },
    { title: 'Govt Jobs', desc: 'Central, State & PSU', link: '/govt-jobs' },
    { title: 'Internships', desc: '50+ opportunities', link: '/internships' },
    { title: 'Search All', desc: 'Exams, colleges & more', link: '/search' },
  ]

  // Group grad paths for tabbed view
  // Management: 0-2, Engineering: 3-8, Law: 9-10, Medical: 11-17, Science&Arts: 18-29, Research: 30-33, Professional: 34-35
  const gradGroups = [
    { id: 'management', label: 'Management & MBA', indices: [0, 1, 2] },
    { id: 'engineering-pg', label: 'Engineering & Tech PG', indices: [3, 4, 5, 6, 7, 8] },
    { id: 'law-pg', label: 'Law PG', indices: [9, 10] },
    { id: 'medical-pg', label: 'Medical PG', indices: [11, 12, 13, 14, 15, 16, 17] },
    { id: 'science-arts-pg', label: 'Science & Arts PG', indices: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
    { id: 'research', label: 'Research & Teaching', indices: [30, 31, 32, 33] },
    { id: 'professional', label: 'Professional Courses', indices: [34, 35] },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-text">
          <h1>Your Complete Education Guide</h1>
          <p>From nursery to PhD — explore every pathway, entrance exam, college, and career option across India.</p>
          <div className="home-hero-actions">
            <Link to="/build-profile" className="btn btn-primary btn-lg">Build Your Profile</Link>
            <Link to="/my-path" className="btn btn-outline btn-lg">View My Path</Link>
          </div>
        </div>
        <div className="home-hero-stats">
          {quickLinks.map(q => (
            <Link key={q.link} to={q.link} className="home-stat-link">
              <span className="home-stat-num">{q.count}+</span>
              <span className="home-stat-label">{q.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick navigation */}
      <section className="home-nav-grid">
        {moreLinks.map(l => (
          <Link key={l.link} to={l.link} className="home-nav-item">
            <div>
              <strong>{l.title}</strong>
              <span>{l.desc}</span>
            </div>
          </Link>
        ))}
      </section>

      {/* Disclaimer */}
      <div className="disclaimer-bar">
        <strong>Disclaimer:</strong> We have tried our best to gather all the information, but there might be some deviations. Kindly verify everything directly with the respective institutions. Data is as of 2025.
      </div>

      {/* ===== EDUCATION JOURNEY ===== */}
      <section className="home-section">
        <div className="home-section-header">
          <h2>Complete Education Pathway</h2>
          <p>Explore the full journey from school to career — click on any stage to learn more.</p>
        </div>

        {/* Phase 1: School Stages */}
        <div className="ej-phase">
          <div className="ej-phase-label">Phase 1</div>
          <h3 className="ej-phase-title">School Education</h3>
          <div className="ej-stepper">
            {schoolStages.map((s, i) => (
              <div key={i} className="ej-step">
                <div className="ej-step-circle">{s.num}</div>
                <div className="ej-step-text">
                  <strong>{s.label}</strong>
                  <span>{s.sub}</span>
                </div>
                {i < schoolStages.length - 1 && <div className="ej-step-line"></div>}
              </div>
            ))}
          </div>
          <div className="ej-school-exams">
            <span>Key school-level exams: KVS, JNVST, Sainik AISSEE, NMMS, RIMC, NTSE, Olympiads</span>
            <Link to="/school-exams">View all school exams</Link>
          </div>
        </div>

        {/* Phase 2: After Class 10 */}
        <div className="ej-phase">
          <div className="ej-phase-label">Phase 2</div>
          <h3 className="ej-phase-title">After Class 10 — Choose Your Stream</h3>
          <p className="ej-phase-desc">Select a stream below to see all available courses, entrance exams, and top colleges.</p>

          <div className="ej-tabs">
            {afterTenthStreams.map(s => (
              <button
                key={s.id}
                className={'ej-tab' + (activeStream === s.id ? ' ej-tab-active' : '')}
                style={activeStream === s.id ? {'--tab-color': s.color} : {}}
                onClick={() => { setActiveStream(s.id); setOpenCourses({}) }}
              >
                <strong>{s.name}</strong>
                <span>{s.courses.length} courses</span>
              </button>
            ))}
          </div>

          {selectedStream && (
            <div className="ej-stream-panel">
              <div className="ej-stream-header" style={{'--sc': selectedStream.color}}>
                <div>
                  <h4>{selectedStream.name}</h4>
                  <p>{selectedStream.full}</p>
                </div>
                <span className="ej-stream-count">{selectedStream.courses.length} courses available</span>
              </div>
              <div className="ej-course-list">
                {selectedStream.courses.map((c, i) => {
                  const key = selectedStream.id + '_' + i
                  const isOpen = openCourses[key]
                  return (
                    <div key={key} className={'ej-course' + (isOpen ? ' ej-course-open' : '')}>
                      <div className="ej-course-header" onClick={() => toggleCourse(key)}>
                        <span className="ej-course-name">{c.name}</span>
                        <span className="ej-course-toggle">{isOpen ? '−' : '+'}</span>
                      </div>
                      {isOpen && (
                        <div className="ej-course-detail">
                          <div className="ej-detail-row">
                            <span className="ej-detail-label">Eligibility</span>
                            <span className="ej-detail-value">{c.eligibility}</span>
                          </div>
                          <div className="ej-detail-row">
                            <span className="ej-detail-label">Entrance Exams</span>
                            <span className="ej-detail-value">{c.exams}</span>
                          </div>
                          <div className="ej-detail-row">
                            <span className="ej-detail-label">Top Colleges</span>
                            <span className="ej-detail-value">{c.colleges}</span>
                          </div>
                          {c.note && <div className="ej-detail-note">{c.note}</div>}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Phase 3: After Graduation */}
        <div className="ej-phase">
          <div className="ej-phase-label">Phase 3</div>
          <h3 className="ej-phase-title">After Graduation — Higher Studies & Cross Paths</h3>
          <p className="ej-phase-desc">Any graduate can pursue these paths regardless of their undergraduate stream.</p>

          <div className="ej-tabs">
            {gradGroups.map(g => (
              <button
                key={g.id}
                className={'ej-tab' + (activeGradTab === g.id ? ' ej-tab-active' : '')}
                onClick={() => { setActiveGradTab(activeGradTab === g.id ? null : g.id); setOpenGradCourse({}) }}
              >
                <strong>{g.label}</strong>
                <span>{g.indices.length} {g.indices.length === 1 ? 'path' : 'paths'}</span>
              </button>
            ))}
          </div>

          {activeGradTab && (
            <div className="ej-stream-panel">
              <div className="ej-course-list">
                {gradGroups.find(g => g.id === activeGradTab)?.indices.map(idx => {
                  const c = afterGradPaths[idx]
                  const isOpen = openGradCourse[idx]
                  return (
                    <div key={idx} className={'ej-course' + (isOpen ? ' ej-course-open' : '')}>
                      <div className="ej-course-header" onClick={() => toggleGradCourse(idx)}>
                        <span className="ej-course-name">{c.name}</span>
                        <span className="ej-course-toggle">{isOpen ? '−' : '+'}</span>
                      </div>
                      {isOpen && (
                        <div className="ej-course-detail">
                          <div className="ej-detail-row">
                            <span className="ej-detail-label">Eligibility</span>
                            <span className="ej-detail-value">{c.eligibility}</span>
                          </div>
                          <div className="ej-detail-row">
                            <span className="ej-detail-label">Entrance Exams</span>
                            <span className="ej-detail-value">{c.exams}</span>
                          </div>
                          <div className="ej-detail-row">
                            <span className="ej-detail-label">Top Colleges</span>
                            <span className="ej-detail-value">{c.colleges}</span>
                          </div>
                          {c.note && <div className="ej-detail-note">{c.note}</div>}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="home-section">
        <div className="home-section-header">
          <h2>Popular Categories</h2>
          <p>Jump to the most searched education pathways</p>
        </div>
        <div className="home-cat-grid">
          {[
            { title: 'Engineering', sub: 'JEE Main, JEE Advanced, BITSAT, CUET', bottom: '23 IITs | 31 NITs | 26 IIITs', link: '/entrance-exams?category=Engineering', color: '#2563eb' },
            { title: 'Medical', sub: 'NEET UG — the only exam for all medical admissions', bottom: 'AIIMS | JIPMER | CMC Vellore | AFMC', link: '/entrance-exams?category=Medical', color: '#dc2626' },
            { title: 'MBA / Management', sub: 'CAT, XAT, MAT, CMAT, SNAP, NMAT, IIFT', bottom: '21 IIMs | XLRI | FMS | ISB', link: '/entrance-exams?category=Management', color: '#d97706' },
            { title: 'Law', sub: 'CLAT, AILET, LSAT India, MH CET Law', bottom: 'NLSIU | NALSAR | NLU Delhi | NUJS', link: '/entrance-exams?category=Law', color: '#7c3aed' },
            { title: 'Design & Architecture', sub: 'NID DAT, NIFT, UCEED, NATA, JEE Paper 2', bottom: 'NID | NIFT | SPA Delhi | IIT B.Des', link: '/entrance-exams?category=Design', color: '#0d9488' },
            { title: 'Scholarships', sub: 'Central, State, Private, NGO & International', bottom: 'NSP | Post Matric | Merit-cum-Means', link: '/scholarships', color: '#059669' },
          ].map(c => (
            <Link key={c.link} to={c.link} className="home-cat-card">
              <div className="home-cat-accent" style={{background: c.color}}></div>
              <div className="home-cat-body">
                <h3>{c.title}</h3>
                <p className="home-cat-sub">{c.sub}</p>
                <p className="home-cat-bottom">{c.bottom}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Notes */}
      <section className="home-section">
        <div className="home-section-header">
          <h2>Important Notes for Students (2025)</h2>
        </div>
        <div className="home-notes">
          {[
            { text: 'NEET UG is the single entrance exam for ALL MBBS, BDS, AYUSH, Veterinary admissions.', tag: 'Medical' },
            { text: 'CUET UG is mandatory for ALL Central University admissions (DU, JNU, BHU, JMI, AMU) from 2022.', tag: 'Central' },
            { text: 'JEE Main is conducted twice a year (Jan & Apr). Best score counts. Top 2.5 lakh qualify for JEE Advanced.', tag: 'Engineering' },
            { text: 'Engineering graduates CAN do Law — 3-year LLB after any graduation.', tag: 'Cross-path' },
            { text: 'GATE score is valid for 3 years and is used for M.Tech admissions + PSU recruitment.', tag: 'PG' },
            { text: 'IIM Indore & IIM Rohtak offer 5-year IPM directly after Class 12.', tag: 'MBA' },
            { text: 'CA Foundation can be registered after Class 12. Many do B.Com + CA simultaneously.', tag: 'Commerce' },
            { text: 'NDA exam is now open to women as well (Supreme Court order).', tag: 'Defence' },
          ].map((n, i) => (
            <div key={i} className="home-note">
              <span className="home-note-tag">{n.tag}</span>
              <span>{n.text}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="disclaimer-bar" style={{marginTop: 20}}>
        <strong>Important:</strong> All information is indicative and based on data as of 2025. Fees and criteria change every year. Please verify all details from official websites before making decisions.
      </div>
    </div>
  )
}
