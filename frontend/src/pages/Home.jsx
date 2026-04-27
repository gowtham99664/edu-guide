import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'
import dagre from 'dagre'
import '@xyflow/react/dist/style.css'
import engineeringExams from '../data/engineeringExams'
import { medicalExams, lawExams, managementExams } from '../data/otherExams'
import { designExams, architectureExams, agricultureExams, teachingExams, professionalExams, researchExams, culinaryExams, horticultureExams } from '../data/moreExams'
import colleges from '../data/colleges'
import statesData from '../data/statesData'
import schoolEntranceExams from '../data/schoolEntranceExams'
import { careerPaths } from '../data/careerPaths'
import { useLanguage } from '../utils/i18n.jsx'

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

const GRAD_GROUPS = [
  { id: 'management', label: 'Management & MBA', indices: [0, 1, 2] },
  { id: 'engineering-pg', label: 'Engineering & Tech PG', indices: [3, 4, 5, 6, 7, 8] },
  { id: 'law-pg', label: 'Law PG', indices: [9, 10] },
  { id: 'medical-pg', label: 'Medical PG', indices: [11, 12, 13, 14, 15, 16, 17] },
  { id: 'science-arts-pg', label: 'Science & Arts PG', indices: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
  { id: 'research', label: 'Research & Teaching', indices: [30, 31, 32, 33] },
  { id: 'professional', label: 'Professional Courses', indices: [34, 35] },
]

const STREAM_TO_GROUPS = {
  mpc: ['engineering-pg', 'science-arts-pg', 'management', 'research', 'professional', 'law-pg'],
  bipc: ['medical-pg', 'science-arts-pg', 'management', 'research', 'professional'],
  mbipc: ['engineering-pg', 'medical-pg', 'science-arts-pg', 'management', 'research', 'professional', 'law-pg'],
  commerce: ['management', 'law-pg', 'science-arts-pg', 'professional', 'research'],
  arts: ['law-pg', 'science-arts-pg', 'management', 'research', 'professional'],
  vocational: ['professional', 'management', 'science-arts-pg'],
}

const DEFAULT_EXPANDED = new Set(['root', 'school-nursery', 'school-lkg', 'school-primary', 'school-middle', 'school-secondary'])

function getSupportLinks(exams = '') {
  const text = exams.toUpperCase()
  const links = []

  if (text.includes('JEE') || text.includes('CUET') || text.includes('NEET')) links.push({ label: 'NTA', url: 'https://nta.ac.in' })
  if (text.includes('GATE')) links.push({ label: 'GATE', url: 'https://gate2026.iitr.ac.in' })
  if (text.includes('CAT')) links.push({ label: 'CAT', url: 'https://iimcat.ac.in' })
  if (text.includes('CLAT')) links.push({ label: 'CLAT', url: 'https://consortiumofnlus.ac.in' })
  if (text.includes('NIFT')) links.push({ label: 'NIFT', url: 'https://www.nift.ac.in' })
  if (text.includes('NID')) links.push({ label: 'NID', url: 'https://www.nid.edu' })
  if (text.includes('UPSC')) links.push({ label: 'UPSC', url: 'https://www.upsc.gov.in' })
  if (text.includes('ICAR')) links.push({ label: 'ICAR', url: 'https://icar.org.in' })

  const unique = new Map()
  links.forEach((item) => unique.set(item.url, item))
  return Array.from(unique.values())
}

function getLearningFocus(courseName = '', streamName = '') {
  const title = courseName.toLowerCase()
  const stream = streamName.toLowerCase()

  if (title.includes('b.tech') || title.includes('b.e.')) {
    return 'Core engineering fundamentals, mathematics, programming, design thinking, and practical problem-solving through labs and projects.'
  }
  if (title.includes('mbbs')) {
    return 'Human anatomy, physiology, pathology, diagnostics, and clinical decision-making through hospital postings and supervised patient care.'
  }
  if (title.includes('bds')) {
    return 'Oral anatomy, dental materials, restorative procedures, and clinical dental practice with patient-focused treatment planning.'
  }
  if (title.includes('b.pharm') || title.includes('m.pharm') || title.includes('d.pharm')) {
    return 'Pharmaceutics, medicinal chemistry, pharmacology, drug formulation, and safe dispensing with regulatory and quality standards.'
  }
  if (title.includes('nursing') || title.includes('anm') || title.includes('gnm')) {
    return 'Patient care, clinical procedures, community health, medical ethics, and hands-on hospital/ward practice.'
  }
  if (title.includes('law') || title.includes('llb') || title.includes('llm')) {
    return 'Constitutional law, legal reasoning, drafting, case analysis, and advocacy skills through moot courts and internships.'
  }
  if (title.includes('mba') || title.includes('pgdm') || title.includes('mha')) {
    return 'Business strategy, finance, marketing, operations, analytics, leadership, and real-world decision-making through case studies.'
  }
  if (title.includes('m.tech') || title.includes('me (2 yrs)') || title.includes('mca')) {
    return 'Advanced technical concepts, system design, research methods, and implementation skills in specialized engineering/computing domains.'
  }
  if (title.includes('m.sc') || title.includes('b.sc')) {
    return 'Scientific concepts, experimental methods, data interpretation, and discipline-specific analytical and research skills.'
  }
  if (title.includes('bca')) {
    return 'Programming, databases, web technologies, software development workflows, and practical application development.'
  }
  if (title.includes('b.arch') || title.includes('m.arch') || title.includes('b.planning') || title.includes('m.plan')) {
    return 'Design principles, spatial planning, studio practice, sustainability, and technical drawing with portfolio-driven work.'
  }
  if (title.includes('b.des') || title.includes('m.des') || title.includes('fashion')) {
    return 'User-centered design, visual communication, prototyping, material exploration, and portfolio development.'
  }
  if (title.includes('ca') || title.includes('cs') || title.includes('cma') || title.includes('cfa') || title.includes('frm')) {
    return 'Accounting standards, compliance, taxation, corporate governance, risk management, and financial analysis.'
  }
  if (title.includes('phd') || title.includes('fpm') || title.includes('post-doctoral')) {
    return 'Independent research, literature review, methodology design, publication writing, and advanced domain specialization.'
  }

  if (stream.includes('mpc')) {
    return 'Mathematical reasoning, physical science foundations, and technical problem-solving for engineering and science pathways.'
  }
  if (stream.includes('bipc')) {
    return 'Life sciences, healthcare fundamentals, laboratory methods, and patient/community-oriented scientific understanding.'
  }
  if (stream.includes('commerce')) {
    return 'Business economics, accounting, finance fundamentals, and managerial decision-making skills.'
  }
  if (stream.includes('arts')) {
    return 'Critical thinking, communication, social analysis, and interdisciplinary understanding across humanities and creative fields.'
  }

  return 'Foundational theory with practical application, communication skills, and career-oriented domain knowledge.'
}

function buildGraph() {
  const nodes = []
  const edges = []
  const nodeMeta = {}
  const childrenMap = {}

  const addNode = (node) => {
    nodes.push(node)
    nodeMeta[node.id] = node.meta || {}
  }

  const addEdge = (edge) => {
    edges.push(edge)
    if (!childrenMap[edge.source]) childrenMap[edge.source] = []
    childrenMap[edge.source].push(edge.target)
  }

  addNode({
    id: 'root',
    type: 'rootNode',
    data: { title: 'Start Your Journey', subtitle: 'Nursery to PhD', kind: 'root', color: '#f9a825' },
    meta: {
      title: 'Start Your Journey',
      howToReach: 'Begin with foundational schooling and progressively choose streams and courses based on your interests and strengths.',
      links: [{ label: 'NCERT', url: 'https://ncert.nic.in' }],
    },
  })

  const schoolNodeIds = ['school-nursery', 'school-lkg', 'school-primary', 'school-middle', 'school-secondary']
  schoolStages.forEach((stage, idx) => {
    addNode({
      id: schoolNodeIds[idx],
      type: 'stageNode',
      data: { title: stage.label, subtitle: stage.sub, kind: 'stage', color: '#1a237e' },
      meta: {
        title: stage.label,
        howToReach: `Progress through school level ${stage.label}.`,
        eligibility: stage.sub,
        links: idx === 4
          ? [
              { label: 'KVS Admissions', url: 'https://kvsangathan.nic.in' },
              { label: 'Navodaya', url: 'https://navodaya.gov.in' },
              { label: 'Sainik Schools', url: 'https://aissee.nta.nic.in' },
            ]
          : [{ label: 'NCERT', url: 'https://ncert.nic.in' }],
      },
    })

    if (idx === 0) {
      addEdge({ id: 'edge-root-nursery', source: 'root', target: schoolNodeIds[idx], label: 'Age 2.5-4' })
    } else {
      addEdge({
        id: `edge-school-${idx - 1}-${idx}`,
        source: schoolNodeIds[idx - 1],
        target: schoolNodeIds[idx],
        label: stage.sub,
      })
    }
  })

  const secondaryNode = 'school-secondary'
  nodeMeta[secondaryNode] = {
    ...nodeMeta[secondaryNode],
    exams: 'KVS, JNVST, Sainik AISSEE, NMMS, RIMC, NTSE, Olympiads',
  }

  const schoolPathOptions = [
    {
      id: 'school-path-preschool',
      parent: 'school-nursery',
      edgeLabel: 'Pre-school admission',
      title: 'Playgroup / Nursery Schools',
      subtitle: 'Foundational early learning',
      howToReach: 'Apply to nearby pre-schools with age proof, immunization records, and basic parent interaction where applicable.',
      eligibility: 'Typical entry age 2.5-4 years (school-specific cutoffs apply).',
      learning: 'Language readiness, social behavior, motor skills, routines, and classroom comfort before formal schooling.',
      links: [{ label: 'NCERT ECCE', url: 'https://ncert.nic.in' }],
    },
    {
      id: 'school-path-kvs',
      parent: 'school-lkg',
      edgeLabel: 'Lottery system for KVS',
      title: 'KVS Class 1 Route',
      subtitle: 'Central school admission path',
      howToReach: 'Track Kendriya Vidyalaya notifications, complete online registration, and participate in category-wise lottery/allotment.',
      eligibility: 'Class 1 age and category norms as per KVS admission guidelines.',
      learning: 'CBSE-aligned foundational academics, language skills, activity-based learning, and smooth continuity till higher classes.',
      links: [{ label: 'KVS Admissions', url: 'https://kvsangathan.nic.in' }],
    },
    {
      id: 'school-path-regular',
      parent: 'school-lkg',
      edgeLabel: 'Regular school route',
      title: 'Neighborhood / Private School Route',
      subtitle: 'State/CBSE/ICSE school entry',
      howToReach: 'Apply to local schools based on board preference, location, fee structure, and language medium.',
      eligibility: 'Age criteria and seat availability vary by school and board.',
      learning: 'Core literacy and numeracy, classroom discipline, communication, and grade-wise progression.',
      links: [{ label: 'NCERT', url: 'https://ncert.nic.in' }],
    },
    {
      id: 'school-path-jnv',
      parent: 'school-primary',
      edgeLabel: 'Prepare for JNVST',
      title: 'Navodaya Route (Class 6 Entry)',
      subtitle: 'JNV selection pathway',
      howToReach: 'Prepare for JNVST aptitude-based exam in Class 5 and apply during official admission cycle.',
      eligibility: 'Studying in eligible local school and meeting district-specific JNVST criteria.',
      learning: 'Strong academic foundation, competitive exam readiness, and holistic residential school development.',
      links: [{ label: 'Navodaya', url: 'https://navodaya.gov.in' }],
    },
    {
      id: 'school-path-sainik',
      parent: 'school-middle',
      edgeLabel: 'AISSEE pathway',
      title: 'Sainik School Route',
      subtitle: 'Defence-oriented schooling track',
      howToReach: 'Prepare for AISSEE exam, meet age/class criteria, and complete counselling/admission formalities.',
      eligibility: 'Age and class requirements as defined by AISSEE for Class 6/9 admissions.',
      learning: 'Academic rigor, discipline, leadership, physical fitness, and structured preparation for future defence academies.',
      links: [{ label: 'AISSEE (NTA)', url: 'https://aissee.nta.nic.in' }],
    },
    {
      id: 'school-path-olympiad',
      parent: 'school-middle',
      edgeLabel: 'Competitive prep track',
      title: 'Olympiad / Scholarship Track',
      subtitle: 'NMMS, Olympiads, talent exams',
      howToReach: 'Participate in school-led and national-level exams with concept-focused preparation and regular mock practice.',
      eligibility: 'Class-wise eligibility depends on each exam (NMMS/Olympiads/etc.).',
      learning: 'Advanced problem solving, conceptual depth in maths/science, and exam temperament.',
      links: [{ label: 'NCERT', url: 'https://ncert.nic.in' }],
    },
  ]

  schoolPathOptions.forEach((path) => {
    addNode({
      id: path.id,
      type: 'courseNode',
      data: { title: path.title, subtitle: path.subtitle, kind: 'course', color: '#1a237e' },
      meta: {
        title: path.title,
        howToReach: path.howToReach,
        eligibility: path.eligibility,
        learning: path.learning,
        links: path.links,
      },
    })

    addEdge({
      id: `edge-${path.parent}-${path.id}`,
      source: path.parent,
      target: path.id,
      label: path.edgeLabel,
    })
  })

  afterTenthStreams.forEach((stream) => {
    const streamId = `stream-${stream.id}`

    addNode({
      id: streamId,
      type: 'streamNode',
      data: { title: stream.name, subtitle: stream.full, kind: 'stream', color: stream.color, count: stream.courses.length },
      meta: {
        title: stream.name,
        howToReach: 'Complete Class 10 and choose this stream in Class 11-12.',
        eligibility: stream.full,
        learning: getLearningFocus(stream.name, stream.name),
        note: `${stream.courses.length} course paths available from this stream.`,
      },
    })

    addEdge({
      id: `edge-secondary-${stream.id}`,
      source: secondaryNode,
      target: streamId,
      label: 'Choose stream',
    })

    stream.courses.forEach((course, index) => {
      const courseId = `course-${stream.id}-${index}`

      addNode({
        id: courseId,
        type: 'courseNode',
        data: { title: course.name, subtitle: course.exams, kind: 'course', color: stream.color },
        meta: {
          title: course.name,
          howToReach: `Select ${stream.name} in Class 11-12 and satisfy eligibility criteria for this course.`,
          eligibility: course.eligibility,
          learning: getLearningFocus(course.name, stream.name),
          exams: course.exams,
          colleges: course.colleges,
          note: course.note,
          links: getSupportLinks(course.exams),
        },
      })

      addEdge({
        id: `edge-${stream.id}-course-${index}`,
        source: streamId,
        target: courseId,
        label: 'Course option',
      })

      ;(STREAM_TO_GROUPS[stream.id] || []).forEach((groupId) => {
        addEdge({
          id: `edge-${courseId}-group-${groupId}`,
          source: courseId,
          target: `group-${groupId}`,
          label: 'After graduation',
        })
      })
    })
  })

  GRAD_GROUPS.forEach((group) => {
    addNode({
      id: `group-${group.id}`,
      type: 'groupNode',
      data: { title: group.label, subtitle: `${group.indices.length} higher-study options`, kind: 'group', color: '#1a237e' },
      meta: {
        title: group.label,
        howToReach: 'Complete your undergraduate degree, then prepare for relevant PG entrance exams.',
        learning: 'Advanced specialization, deeper subject mastery, and role-focused skills for higher studies or professional growth.',
        note: `${group.indices.length} pathways available in this group.`,
      },
    })

    group.indices.forEach((idx) => {
      const pg = afterGradPaths[idx]
      const pgId = `pg-${idx}`
      addNode({
        id: pgId,
        type: 'courseNode',
        data: { title: pg.name, subtitle: pg.exams, kind: 'course', color: '#3949ab' },
        meta: {
          title: pg.name,
          howToReach: 'Finish the required UG degree, qualify in listed entrance exams, then apply through counselling/admission process.',
          eligibility: pg.eligibility,
          learning: getLearningFocus(pg.name, 'postgraduate'),
          exams: pg.exams,
          colleges: pg.colleges,
          note: pg.note,
          links: getSupportLinks(pg.exams),
        },
      })

      addEdge({
        id: `edge-group-${group.id}-${idx}`,
        source: `group-${group.id}`,
        target: pgId,
        label: 'PG path',
      })
    })
  })

  return { nodes, edges, childrenMap, nodeMeta }
}

function getLayoutedElements(rawNodes, rawEdges) {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'TB', ranksep: 100, nodesep: 50, marginx: 24, marginy: 24 })

  rawNodes.forEach((node) => {
    const dims = node.type === 'courseNode' ? { width: 260, height: 84 } : { width: 210, height: 72 }
    if (node.type === 'rootNode') {
      g.setNode(node.id, { width: 240, height: 76 })
    } else {
      g.setNode(node.id, dims)
    }
  })

  rawEdges.forEach((edge) => g.setEdge(edge.source, edge.target))
  dagre.layout(g)

  const nodes = rawNodes.map((node) => {
    const pos = g.node(node.id)
    const width = node.type === 'courseNode' ? 260 : node.type === 'rootNode' ? 240 : 210
    const height = node.type === 'courseNode' ? 84 : node.type === 'rootNode' ? 76 : 72
    return {
      ...node,
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      position: { x: pos.x - width / 2, y: pos.y - height / 2 },
    }
  })

  const edges = rawEdges.map((edge) => ({
    ...edge,
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: '#606985' },
    style: { stroke: '#606985', strokeWidth: 1.4 },
    labelStyle: { fill: '#424b63', fontSize: 11, fontWeight: 600 },
    labelBgStyle: { fill: '#ffffff', fillOpacity: 0.9 },
  }))

  return { nodes, edges }
}

function OrgChartNode({ data, selected }) {
  return (
    <div className={`oc-node oc-node--${data.kind}${selected ? ' is-selected' : ''}`} style={{ '--node-accent': data.color || '#1a237e' }}>
      <Handle type="target" position={Position.Top} className="oc-node-handle" />
      <div className="oc-node-title">{data.title}</div>
      {data.subtitle ? <div className="oc-node-subtitle">{data.subtitle}</div> : null}
      {typeof data.count === 'number' ? <div className="oc-node-count">{data.count} options</div> : null}
      <Handle type="source" position={Position.Bottom} className="oc-node-handle" />
    </div>
  )
}

const nodeTypes = {
  rootNode: OrgChartNode,
  stageNode: OrgChartNode,
  streamNode: OrgChartNode,
  groupNode: OrgChartNode,
  courseNode: OrgChartNode,
}

export default function Home() {
  const { t } = useLanguage()
  const quickLinks = [
    { title: t('stat.schoolExams'), count: schoolEntranceExams.length, link: '/school-exams' },
    { title: t('stat.entranceExams'), count: allExams.length, link: '/entrance-exams' },
    { title: t('stat.colleges'), count: colleges.length, link: '/colleges' },
    { title: t('stat.statesUTs'), count: statesData.length, link: '/states' },
    { title: t('stat.careerPaths'), count: careerPaths.length, link: '/career-paths' },
  ]

  const graph = useMemo(() => buildGraph(), [])
  const [expanded, setExpanded] = useState(() => new Set(DEFAULT_EXPANDED))
  const [selectedNodeId, setSelectedNodeId] = useState('root')

  const visible = useMemo(() => {
    const visibleIds = new Set(['root'])
    const stack = ['root']

    while (stack.length) {
      const current = stack.pop()
      if (!expanded.has(current)) continue
      const kids = graph.childrenMap[current] || []
      kids.forEach((child) => {
        if (!visibleIds.has(child)) {
          visibleIds.add(child)
          stack.push(child)
        }
      })
    }

    return {
      nodes: graph.nodes.filter((n) => visibleIds.has(n.id)),
      edges: graph.edges.filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target)),
    }
  }, [expanded, graph])

  const layouted = useMemo(() => getLayoutedElements(visible.nodes, visible.edges), [visible])
  const [nodes, setNodes, onNodesChange] = useNodesState(layouted.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(layouted.edges)
  const [rfInstance, setRfInstance] = useState(null)

  useEffect(() => setNodes(layouted.nodes), [layouted.nodes, setNodes])
  useEffect(() => setEdges(layouted.edges), [layouted.edges, setEdges])

  useEffect(() => {
    if (!rfInstance) return
    const timer = setTimeout(() => {
      rfInstance.fitView({ padding: 0.2, duration: 450 })
    }, 30)
    return () => clearTimeout(timer)
  }, [rfInstance, nodes, edges])

  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id)
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(node.id)) next.delete(node.id)
      else next.add(node.id)
      return next
    })
  }, [])

  const selectedMeta = graph.nodeMeta[selectedNodeId] || {}
  const nextStages = (graph.childrenMap[selectedNodeId] || [])
    .map((id) => graph.nodeMeta[id]?.title)
    .filter(Boolean)

  return (
    <div>
      <section className="home-hero">
        <div className="home-hero-text">
          <h1>{t('home.hero.title')}</h1>
          <p>{t('home.hero.subtitle')}</p>
          <div className="home-hero-actions">
            <Link to="/build-profile" className="btn btn-primary btn-lg">{t('home.hero.buildProfile')}</Link>
            <Link to="/my-path" className="btn btn-outline btn-lg">{t('home.hero.viewPath')}</Link>
          </div>
        </div>
        <div className="home-hero-stats">
          {quickLinks.map((q) => (
            <Link key={q.link} to={q.link} className="home-stat-link">
              <span className="home-stat-num">{q.count}+</span>
              <span className="home-stat-label">{q.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="quick-nav-row">
        <Link to="/scholarships" className="quick-nav-item">{t('quicknav.scholarships')}</Link>
        <Link to="/govt-jobs" className="quick-nav-item">{t('quicknav.govtJobs')}</Link>
        <Link to="/internships" className="quick-nav-item">{t('quicknav.internships')}</Link>
        <Link to="/mentors" className="quick-nav-item">{t('quicknav.findMentors')}</Link>
        <Link to="/my-mentorship" className="quick-nav-item">{t('quicknav.myMentorship')}</Link>
        <Link to="/mentor-hub" className="quick-nav-item">{t('quicknav.mentorHub')}</Link>
        <Link to="/exam-calendar" className="quick-nav-item">{t('quicknav.examCalendar')}</Link>
        <Link to="/college-predictor" className="quick-nav-item">{t('quicknav.collegePredictor')}</Link>
        <Link to="/ai-chat" className="quick-nav-item">{t('quicknav.aiChat')}</Link>
      </section>

      <section className="home-section oc-section">
        <div className="home-section-header">
          <h2>{t('home.pathway.title')}</h2>
          <p>{t('home.pathway.subtitle')}</p>
        </div>

        <div className="oc-flow-wrap">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onInit={setRfInstance}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.2}
            maxZoom={1.2}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={24} size={1} color="#e2e8f0" />
            <MiniMap zoomable pannable nodeColor={(n) => n?.data?.color || '#1a237e'} />
            <Controls />
          </ReactFlow>
        </div>

        <div className="oc-detail-card">
          <div className="oc-detail-header">
            <h3>{selectedMeta.title || 'Select a stage'}</h3>
            <span>{expanded.has(selectedNodeId) ? 'Expanded' : 'Collapsed'} node</span>
          </div>

          {selectedMeta.howToReach ? (
            <div className="oc-detail-row">
              <strong>How to reach:</strong>
              <p>{selectedMeta.howToReach}</p>
            </div>
          ) : null}

          {selectedMeta.eligibility ? (
            <div className="oc-detail-row">
              <strong>Eligibility:</strong>
              <p>{selectedMeta.eligibility}</p>
            </div>
          ) : null}

          {selectedMeta.learning ? (
            <div className="oc-detail-row">
              <strong>What you learn:</strong>
              <p>{selectedMeta.learning}</p>
            </div>
          ) : null}

          {selectedMeta.exams ? (
            <div className="oc-detail-row">
              <strong>Entrance exams:</strong>
              <p>{selectedMeta.exams}</p>
            </div>
          ) : null}

          {selectedMeta.colleges ? (
            <div className="oc-detail-row">
              <strong>Top colleges:</strong>
              <p>{selectedMeta.colleges}</p>
            </div>
          ) : null}

          {nextStages.length ? (
            <div className="oc-detail-row">
              <strong>What next:</strong>
              <div className="oc-next-list">
                {nextStages.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
          ) : null}

          {selectedMeta.links?.length ? (
            <div className="oc-detail-row">
              <strong>Useful URLs:</strong>
              <div className="oc-link-list">
                {selectedMeta.links.map((item) => (
                  <a key={item.url} href={item.url} target="_blank" rel="noreferrer">{item.label}</a>
                ))}
              </div>
            </div>
          ) : null}

          {selectedMeta.note ? <p className="oc-note">{selectedMeta.note}</p> : null}
        </div>
      </section>

      <div className="disclaimer-bar" style={{ marginTop: 20 }}>
        <strong>{t('common.important')}:</strong> {t('home.disclaimer')}
      </div>
    </div>
  )
}
