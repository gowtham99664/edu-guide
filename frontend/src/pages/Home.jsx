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

/* ── Pathway tree data ── */
const afterTenthStreams = [
  {
    id: 'mpc', name: 'MPC / PCM', full: 'Maths, Physics, Chemistry', color: '#2563eb', icon: '🔢',
    courses: [
      { name: 'B.Tech / B.E. (4 yrs)', eligibility: 'Class 12 with PCM, min 75% (65% SC/ST). Age: no limit for most.', exams: 'JEE Main, JEE Advanced, BITSAT, VITEEE, SRMJEEE, COMEDK, MHT CET, KCET, AP/TS EAMCET, WBJEE, KEAM, GUJCET, UPCET, CUET', colleges: 'IITs, NITs, IIITs, BITS, VIT, SRM, State Engg Colleges' },
      { name: 'B.Arch (5 yrs)', eligibility: 'Class 12 with PCM, min 50%. Maths mandatory.', exams: 'NATA, JEE Main Paper 2A', colleges: 'SPA Delhi, IIT Roorkee/Kharagpur, NIT Trichy, CEPT' },
      { name: 'B.Sc Maths/Physics/Chemistry (3 yrs)', eligibility: 'Class 12 with relevant subjects.', exams: 'CUET UG, University entrances', colleges: 'DU, BHU, JNU, St. Stephens, Presidency, IISc (BS), IISERs (BS-MS)' },
      { name: 'BS-MS Dual Degree (5 yrs)', eligibility: 'Class 12 with PCM. JEE Advanced / KVPY / IISER Aptitude Test.', exams: 'JEE Advanced, IISER Aptitude Test', colleges: 'IISc Bangalore, 7 IISERs' },
      { name: 'B.Des (Design) (4 yrs)', eligibility: 'Class 12 any stream (PCM preferred for some).', exams: 'NID DAT, UCEED, NIFT Entrance', colleges: 'NID, IIT Bombay IDC, IIT Delhi/Guwahati/Hyderabad, NIFT' },
      { name: 'B.Sc Nautical Science (3 yrs)', eligibility: 'Class 12 PCM, min 60%. Age: 17-25.', exams: 'IMU CET', colleges: 'IMU Chennai, MERI Mumbai, TS Chanakya' },
      { name: 'BCA (3 yrs)', eligibility: 'Class 12 with Maths (some accept without).', exams: 'CUET, University entrances', colleges: 'Christ, Symbiosis, NIT Trichy (MCA integrated), State Universities' },
      { name: 'B.Sc Aviation (3 yrs)', eligibility: 'Class 12 PCM, min 50%.', exams: 'University entrances', colleges: 'Rajiv Gandhi Aviation University, Amity, Hindustan University' },
      { name: 'NDA (Army/Navy/Air Force)', eligibility: 'Class 12 PCM (for Navy/AF). Age: 16.5-19.5. Unmarried males & females.', exams: 'NDA Exam (UPSC) + SSB Interview', colleges: 'NDA Khadakwasla → IMA/INA/AFA' },
      { name: 'Merchant Navy (DNS/B.Sc Nautical)', eligibility: 'Class 12 PCM, min 60%. Age: 17-25.', exams: 'IMU CET', colleges: 'IMU, TS Chanakya, MERI' },
      { name: 'B.Planning (4 yrs)', eligibility: 'Class 12 with Maths.', exams: 'JEE Main Paper 2B', colleges: 'SPA Delhi/Bhopal/Vijayawada, IIT Kharagpur/Roorkee' },
      { name: 'Integrated M.Sc (5 yrs)', eligibility: 'Class 12 PCM.', exams: 'JAM, IIT entrance, CUET', colleges: 'IITs, Central Universities, NISERs' },
    ]
  },
  {
    id: 'bipc', name: 'BiPC / PCB', full: 'Biology, Physics, Chemistry', color: '#dc2626', icon: '🧬',
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
    id: 'mbipc', name: 'MBiPC / PCMB', full: 'Maths, Biology, Physics, Chemistry', color: '#7c3aed', icon: '🔬',
    courses: [
      { name: 'All MPC courses + All BiPC courses', eligibility: 'Keeps both Engineering AND Medical paths open. Heavy workload in Class 11-12.', exams: 'JEE + NEET + all exams from both streams', colleges: 'All colleges from both MPC and BiPC streams' },
    ]
  },
  {
    id: 'commerce', name: 'Commerce (CEC/MEC)', full: 'Accountancy, Business Studies, Economics', color: '#d97706', icon: '💰',
    courses: [
      { name: 'B.Com (Hons) (3 yrs)', eligibility: 'Class 12 Commerce, min 50-60%.', exams: 'CUET UG, DU JAT', colleges: 'SRCC, Hindu College, Christ, St. Xavier\'s, Loyola, State Universities' },
      { name: 'BBA / BMS (3 yrs)', eligibility: 'Class 12 any stream (Commerce preferred). Min 50%.', exams: 'CUET, DU JAT, IPMAT, SET, Christ entrance', colleges: 'IIM Indore (IPM), DU, Christ, Symbiosis, NMIMS, Shaheed Sukhdev College' },
      { name: 'CA (Chartered Accountant)', eligibility: 'Can register for CA Foundation after Class 12. Any stream.', exams: 'CA Foundation → Intermediate → Final (ICAI exams)', colleges: 'ICAI - self study + coaching. Can do alongside B.Com.' },
      { name: 'CS (Company Secretary)', eligibility: 'Can register after Class 12. Any stream.', exams: 'CS Foundation → Executive → Professional (ICSI exams)', colleges: 'ICSI - self study + coaching' },
      { name: 'CMA (Cost & Management Accountant)', eligibility: 'Can register after Class 12. Any stream.', exams: 'CMA Foundation → Intermediate → Final (ICMAI exams)', colleges: 'ICMAI - self study + coaching' },
      { name: 'BA LLB / BBA LLB (5 yrs)', eligibility: 'Class 12 any stream, min 45% (40% SC/ST). Age: max 20 (22 SC/ST).', exams: 'CLAT, AILET, LSAT India, MH CET Law, AP/TS LAWCET', colleges: '23 NLUs, DU Law Faculty, ILS Pune, GLC Mumbai, Symbiosis Law' },
      { name: 'B.Com LLB (5 yrs)', eligibility: 'Class 12 Commerce preferred.', exams: 'CLAT, University entrances', colleges: 'GNLU, NLU Jodhpur, Symbiosis' },
      { name: 'BBA LLB (5 yrs)', eligibility: 'Class 12 any stream.', exams: 'CLAT, AILET, University entrances', colleges: 'NLUs, NLSIU, Symbiosis Law' },
      { name: 'B.Sc Economics (Hons) (3 yrs)', eligibility: 'Class 12 with Maths (for top colleges).', exams: 'CUET, University entrance', colleges: 'DSE (DU), ISI, Presidency, St. Stephens, Madras School of Economics' },
      { name: 'Actuarial Science', eligibility: 'Class 12 with Maths. Any stream.', exams: 'IAI (Institute of Actuaries of India) exams', colleges: 'IAI, Bishop Heber, Amity, Christ' },
      { name: 'IPM - Integrated MBA (5 yrs)', eligibility: 'Class 12 any stream. Age: max 20.', exams: 'IPMAT (IIM Indore/Rohtak), JIPMAT', colleges: 'IIM Indore, IIM Rohtak, IIM Ranchi, IIM Bodh Gaya, NALSAR' },
    ]
  },
  {
    id: 'arts', name: 'Arts / Humanities (HEC)', full: 'History, Pol Sci, Geography, Psychology, Sociology, Languages', color: '#0d9488', icon: '🎨',
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
    id: 'vocational', name: 'Vocational / Diploma / ITI', full: 'Polytechnic, ITI, Skill courses', color: '#059669', icon: '🔧',
    courses: [
      { name: 'Polytechnic Diploma (3 yrs)', eligibility: 'Class 10 passed.', exams: 'State POLYCET / DET', colleges: 'Govt Polytechnics in every state. Lateral entry to B.Tech 2nd year after diploma.' },
      { name: 'ITI (Industrial Training, 1-2 yrs)', eligibility: 'Class 8/10 depending on trade.', exams: 'State ITI entrance / merit based', colleges: 'Govt & Pvt ITIs. Trades: Fitter, Electrician, Welder, Mechanic, COPA, etc.' },
      { name: 'Diploma in Engineering (3 yrs)', eligibility: 'Class 10 passed.', exams: 'State POLYCET', colleges: 'Govt Polytechnics → Lateral entry to B.Tech 2nd year' },
      { name: 'Diploma in Pharmacy (D.Pharm) (2 yrs)', eligibility: 'Class 12 PCB/PCM.', exams: 'State POLYCET / Pharmacy CET', colleges: 'State Pharmacy Councils, Govt Pharmacy Colleges' },
      { name: 'ANM / GNM Nursing (1.5-3.5 yrs)', eligibility: 'Class 12 (ANM: Class 10 also). Age: 17-35.', exams: 'State Nursing CET', colleges: 'Govt Nursing Schools, District Hospitals' },
    ]
  },
]

/* After Graduation cross-paths */
const afterGradPaths = [
  { name: 'MBA / PGDM (2 yrs)', eligibility: 'Any Bachelor\'s degree (any stream). Min 50%.', exams: 'CAT, XAT, MAT, CMAT, SNAP, NMAT, IIFT, GMAT', colleges: '21 IIMs, XLRI, FMS Delhi, ISB, MDI, SPJIMR, JBIMS, NMIMS, SIBM' },
  { name: 'M.Tech / ME (2 yrs)', eligibility: 'B.Tech/B.E. in relevant branch. Min 60%.', exams: 'GATE', colleges: 'IITs, IISc, NITs. Also: PSU recruitment (IOCL, NTPC, BHEL, ONGC) via GATE' },
  { name: 'LLB (3 yrs) — after ANY graduation', eligibility: 'Any Bachelor\'s degree. Min 45%. No age limit.', exams: 'MH CET Law (3yr), DU LLB entrance, BHU LLB, University entrances', colleges: 'DU Law Faculty, BHU, Symbiosis, GLC Mumbai, ILS Pune, State Law Colleges', note: 'Engineers, Doctors, Commerce, Arts — ALL can do LLB after graduation!' },
  { name: 'MD / MS (Medical PG, 3 yrs)', eligibility: 'MBBS degree + Internship.', exams: 'NEET PG', colleges: 'AIIMS, PGI, CMC, JIPMER, Govt Medical Colleges' },
  { name: 'LLM (1-2 yrs)', eligibility: 'LLB/BA LLB degree.', exams: 'CLAT PG, University entrances', colleges: 'NLUs, DU, NLU Delhi, NALSAR' },
  { name: 'M.Sc (2 yrs)', eligibility: 'B.Sc in relevant subject. Min 50%.', exams: 'IIT JAM, CUET PG, University entrances', colleges: 'IITs, IISc, IISERs, Central & State Universities' },
  { name: 'MA (2 yrs)', eligibility: 'BA in relevant subject (some accept any grad).', exams: 'CUET PG, University entrances', colleges: 'JNU, DU, BHU, HCU, Jadavpur, AMU' },
  { name: 'MCA (2 yrs)', eligibility: 'Any graduation with Maths at 12th/grad level. Min 50%.', exams: 'NIMCET, State MCA CET, CUET PG', colleges: 'NIT Trichy/Warangal, JNU, BHU, Anna University' },
  { name: 'M.Pharm (2 yrs)', eligibility: 'B.Pharm degree.', exams: 'GPAT', colleges: 'NIPER, BITS, Jamia Hamdard, Manipal' },
  { name: 'UGC NET / CSIR NET (Teaching/Research)', eligibility: 'Master\'s degree with 55%.', exams: 'UGC NET, CSIR NET', colleges: 'Assistant Professor in Universities. JRF for PhD research.' },
  { name: 'PhD / FPM (3-5 yrs)', eligibility: 'Master\'s degree (PhD). B.Tech+GATE or NET for some.', exams: 'GATE, UGC NET, CSIR NET, JEST, TIFR GS, University entrance', colleges: 'IITs, IISc, IISERs, TIFR, IIMs (FPM), Central Universities' },
  { name: 'DM / MCh (Super Specialty, 3 yrs)', eligibility: 'MD/MS degree.', exams: 'NEET SS', colleges: 'AIIMS, PGI, NIMHANS, CMC, top medical institutes' },
  { name: 'MFA / M.Mus / MA Performing Arts (2 yrs)', eligibility: 'BFA/BPA/BA in relevant art form. Audition/portfolio.', exams: 'University entrance + audition/portfolio', colleges: 'MSU Baroda, BHU, Hyderabad Univ, JJ School of Art, Rabindra Bharati, Kalakshetra' },
  { name: 'M.P.Ed / M.Sc Sports Science (2 yrs)', eligibility: 'B.P.Ed / B.Sc Sports Science / any graduation with sports background.', exams: 'University entrance + physical fitness', colleges: 'LNIPE Gwalior, NIS Patiala, IGIPESS Delhi, Pune University, State Universities' },
  { name: 'PG Diploma in Film / Mass Communication (1-2 yrs)', eligibility: 'Any graduation. Age varies.', exams: 'FTII entrance, IIMC entrance, Institute tests', colleges: 'FTII Pune, SRFTI Kolkata, IIMC Delhi, ACJ Chennai, Symbiosis, XIC Mumbai' },
]

export default function Home() {
  const [openStreams, setOpenStreams] = useState({})
  const [openCourses, setOpenCourses] = useState({})
  const [openGradCourse, setOpenGradCourse] = useState({})

  const toggleStream = (id) => setOpenStreams(p => ({...p, [id]: !p[id]}))
  const toggleCourse = (key) => setOpenCourses(p => ({...p, [key]: !p[key]}))
  const toggleGradCourse = (i) => setOpenGradCourse(p => ({...p, [i]: !p[i]}))

  const expandAllStreams = () => {
    const all = {}
    afterTenthStreams.forEach(s => { all[s.id] = true })
    setOpenStreams(all)
  }
  const collapseAllStreams = () => { setOpenStreams({}); setOpenCourses({}) }
  const expandAllGrad = () => {
    const all = {}
    afterGradPaths.forEach((_, i) => { all[i] = true })
    setOpenGradCourse(all)
  }
  const collapseAllGrad = () => setOpenGradCourse({})

  const categories = [
    { icon: '🏫', title: 'School Entrance Exams', desc: 'Navodaya, Sainik, NTSE & more', link: '/school-exams', count: schoolEntranceExams.length, countLabel: 'exams' },
    { icon: '📝', title: 'Entrance Exams', desc: 'JEE, NEET, CLAT, CAT & 100+ exams', link: '/entrance-exams', count: allExams.length, countLabel: 'exams' },
    { icon: '🎓', title: 'Colleges & Universities', desc: 'IITs, NITs, AIIMS, IIMs & more', link: '/colleges', count: colleges.length, countLabel: 'colleges' },
    { icon: '🗺️', title: 'State-wise Info', desc: 'All 28 States + 8 UTs covered', link: '/states', count: statesData.length, countLabel: 'states/UTs' },
    { icon: '🧭', title: 'Career Paths', desc: '15+ career streams explored', link: '/career-paths', count: careerPaths.length, countLabel: 'paths' },
    { icon: '📅', title: 'Prep Timeline', desc: 'Grade-wise preparation roadmap', link: '/timeline', count: 6, countLabel: 'stages' },
    { icon: '🎓', title: 'Scholarships', desc: 'Central, Private, NGO & International', link: '/scholarships', count: 40, countLabel: 'scholarships' },
    { icon: '🏛️', title: 'Government Jobs', desc: 'Central, State & PSU by qualification', link: '/govt-jobs', count: 15, countLabel: 'qualification groups' },
    { icon: '💼', title: 'Internships', desc: 'Govt, Research, Corporate & International', link: '/internships', count: 50, countLabel: 'opportunities' },
    { icon: '🔍', title: 'Search Everything', desc: 'Search across all exams & colleges', link: '/search', count: null, countLabel: '' },
  ]

  return (
    <div>
      <div className="hero">
        <h1>Vidya Maarg — Your Complete Education Guide</h1>
        <p>From school entrance exams to post-graduation — explore every pathway, entrance exam, college, and career option across all states and union territories.</p>
        <div className="hero-cards">
          {categories.map(c => (
            <Link key={c.link} to={c.link} className="hero-card">
              <div className="icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.count ? `${c.count}+ ${c.countLabel} | ` : ''}{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* DISCLAIMER */}
      <div className="disclaimer-bar">
        <strong>Disclaimer:</strong> We have tried our best to gather all the information, but there might be some deviations. Kindly verify everything — especially fees, eligibility, and dates — directly with the respective colleges, universities, schools, or official exam websites before proceeding. Data is as of 2025.
      </div>

      {/* ===== AT-A-GLANCE PATHWAY TREE DIAGRAM ===== */}
      <div className="section-header" style={{marginTop: 8}}>
        <h1>Complete Education Pathway — Tree Diagram</h1>
        <p>Click any node to expand. Lines show the flow from school to career.</p>
      </div>

      <div className="td">
        {/* ── LEVEL 0: Root ── */}
        <div className="td-root">
          <div className="td-node td-node-root">Education Pathway<br/><small>India — Nursery to PhD</small></div>
        </div>
        <div className="td-vline td-vline-root"></div>

        {/* ── LEVEL 1: School Stages (horizontal) ── */}
        <div className="td-level td-level-school">
          <div className="td-hline-wrap"><div className="td-hline"></div></div>
          <div className="td-children">
            <div className="td-branch">
              <div className="td-connector"></div>
              <div className="td-node td-node-nursery">Nursery<br/><small>Age 2.5–4</small></div>
            </div>
            <div className="td-branch">
              <div className="td-connector"></div>
              <div className="td-node td-node-lkg">LKG–UKG<br/><small>Age 4–6</small></div>
            </div>
            <div className="td-branch">
              <div className="td-connector"></div>
              <div className="td-node td-node-primary">Primary 1–5<br/><small>Age 6–11</small></div>
            </div>
            <div className="td-branch">
              <div className="td-connector"></div>
              <div className="td-node td-node-middle">Middle 6–8<br/><small>Age 11–14</small></div>
            </div>
            <div className="td-branch">
              <div className="td-connector"></div>
              <div className="td-node td-node-secondary">Secondary 9–10<br/><small>Age 14–16</small></div>
            </div>
          </div>
        </div>

        {/* School exams note */}
        <div className="td-note-bar">
          <strong>School exams:</strong> KVS, JNVST, Sainik AISSEE, NMMS, RIMC, NTSE, Olympiads
          <Link to="/school-exams" style={{marginLeft:8, fontWeight:600}}>View all →</Link>
        </div>

        {/* ── Big connector: After Class 10 ── */}
        <div className="td-vline"></div>
        <div className="td-node td-node-decision">After Class 10 — Choose Your Stream</div>
        <div className="td-vline"></div>

        {/* ── LEVEL 2: 6 Streams ── */}
        <div className="td-controls">
          <button className="td-ctrl-btn" onClick={expandAllStreams}>Expand All Streams</button>
          <button className="td-ctrl-btn" onClick={collapseAllStreams}>Collapse All</button>
        </div>
        <div className="td-level td-level-streams">
          <div className="td-hline-wrap"><div className="td-hline"></div></div>
          <div className="td-children">
            {afterTenthStreams.map(stream => (
              <div key={stream.id} className="td-branch">
                <div className="td-connector"></div>
                <div className={'td-node td-node-stream' + (openStreams[stream.id] ? ' td-node-open' : '')} style={{'--sc': stream.color}} onClick={() => toggleStream(stream.id)}>
                  <span className="td-stream-icon">{stream.icon}</span>
                  <strong>{stream.name}</strong>
                  <div className="td-node-sub">{stream.full}</div>
                  <div className="td-node-count">{stream.courses.length} courses {openStreams[stream.id] ? '▲' : '▼'}</div>
                </div>

                {/* ── LEVEL 3: Courses under each stream ── */}
                {openStreams[stream.id] && (
                  <div className="td-subtree">
                    <div className="td-vline-sub"></div>
                    {stream.courses.map((c, i) => {
                      const key = stream.id + '_' + i
                      return (
                        <div key={key} className="td-leaf-row">
                          <div className="td-leaf-hline" style={{'--sc': stream.color}}></div>
                          <div className={'td-node td-node-leaf' + (openCourses[key] ? ' td-node-open' : '')} style={{'--sc': stream.color}} onClick={() => toggleCourse(key)}>
                            <span>{c.name}</span>
                            <span className="td-expand-icon">{openCourses[key] ? '−' : '+'}</span>
                          </div>
                          {openCourses[key] && (
                            <div className="td-leaf-detail" style={{'--sc': stream.color}}>
                              <div className="tcd-row"><span className="tcd-label">Eligibility:</span> {c.eligibility}</div>
                              <div className="tcd-row"><span className="tcd-label">Entrance Exams:</span> {c.exams}</div>
                              <div className="tcd-row"><span className="tcd-label">Top Colleges:</span> {c.colleges}</div>
                              {c.note && <div className="tcd-note">{c.note}</div>}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Big connector: After Graduation ── */}
        <div className="td-vline" style={{marginTop:24}}></div>
        <div className="td-node td-node-decision">After Graduation — Cross-Eligibility Paths</div>
        <div className="td-note-bar" style={{fontSize:'0.82rem'}}>
          Engineers → Law/MBA | Doctors → MBA/Public Health | Arts → Law/MA/M.Ed | Commerce → CA/CS/MBA | ANY grad → LLB/MBA/M.Ed/PhD
        </div>
        <div className="td-vline"></div>

        {/* ── LEVEL 2b: Post-grad paths ── */}
        <div className="td-controls">
          <button className="td-ctrl-btn" onClick={expandAllGrad}>Expand All PG Paths</button>
          <button className="td-ctrl-btn" onClick={collapseAllGrad}>Collapse All</button>
        </div>
        <div className="td-level td-level-postgrad">
          <div className="td-hline-wrap"><div className="td-hline"></div></div>
          <div className="td-children">
            {afterGradPaths.map((c, i) => (
              <div key={i} className="td-branch">
                <div className="td-connector"></div>
                <div className={'td-node td-node-grad' + (openGradCourse[i] ? ' td-node-open' : '')} onClick={() => toggleGradCourse(i)}>
                  <span>{c.name}</span>
                  <span className="td-expand-icon">{openGradCourse[i] ? '−' : '+'}</span>
                </div>
                {openGradCourse[i] && (
                  <div className="td-leaf-detail" style={{'--sc': '#6366f1'}}>
                    <div className="tcd-row"><span className="tcd-label">Eligibility:</span> {c.eligibility}</div>
                    <div className="tcd-row"><span className="tcd-label">Entrance Exams:</span> {c.exams}</div>
                    <div className="tcd-row"><span className="tcd-label">Top Colleges:</span> {c.colleges}</div>
                    {c.note && <div className="tcd-note">{c.note}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
      {/* ===== END PATHWAY TREE DIAGRAM ===== */}

      <div className="stats-row">
        <div className="stat-card"><div className="number">{allExams.length + schoolEntranceExams.length}+</div><div className="label">Entrance Exams</div></div>
        <div className="stat-card"><div className="number">{colleges.length}+</div><div className="label">Colleges Listed</div></div>
        <div className="stat-card"><div className="number">{statesData.length}</div><div className="label">States & UTs</div></div>
        <div className="stat-card"><div className="number">{careerPaths.length}+</div><div className="label">Career Paths</div></div>
        <div className="stat-card"><div className="number">2025</div><div className="label">Data Updated</div></div>
      </div>

      <div className="section-header">
        <h1>Quick Access - Popular Categories</h1>
        <p>Jump to the most searched education pathways</p>
      </div>

      <div className="card-grid">
        <div className="card qa-card">
          <h3>Engineering (B.Tech/B.E.)</h3>
          <p className="qa-card-exams">National: JEE Main, JEE Advanced, BITSAT, CUET | State: KCET, MHT CET, AP/TS EAMCET, WBJEE, KEAM, COMEDK</p>
          <p className="qa-card-colleges">Top Colleges: 23 IITs | 31 NITs | 26 IIITs | BITS Pilani | VIT | SRM</p>
          <Link to="/entrance-exams?category=Engineering" className="qa-card-link">Explore Engineering Exams &rarr;</Link>
        </div>
        <div className="card qa-card">
          <h3>Medical (MBBS/BDS/AYUSH)</h3>
          <p className="qa-card-exams">NEET UG is the ONLY exam for all medical admissions in India (since 2016)</p>
          <p className="qa-card-colleges">Top Colleges: AIIMS (23) | JIPMER | CMC Vellore | AFMC | State Medical Colleges</p>
          <Link to="/entrance-exams?category=Medical" className="qa-card-link">Explore Medical Exams &rarr;</Link>
        </div>
        <div className="card qa-card">
          <h3>MBA/Management</h3>
          <p className="qa-card-exams">CAT, XAT, MAT, CMAT, SNAP, NMAT, IIFT, TISSNET + State CETs</p>
          <p className="qa-card-colleges">Top Colleges: 21 IIMs | XLRI | FMS Delhi | ISB | SPJIMR | JBIMS</p>
          <Link to="/entrance-exams?category=Management" className="qa-card-link">Explore MBA Exams &rarr;</Link>
        </div>
        <div className="card qa-card">
          <h3>Law (LLB/BA LLB)</h3>
          <p className="qa-card-exams">CLAT (23 NLUs), AILET (NLU Delhi), LSAT India, MH CET Law, State LAWCETs</p>
          <p className="qa-card-colleges">Top Colleges: NLSIU Bangalore | NALSAR | NLU Delhi | NUJS Kolkata</p>
          <Link to="/entrance-exams?category=Law" className="qa-card-link">Explore Law Exams &rarr;</Link>
        </div>
        <div className="card qa-card">
          <h3>Design & Architecture</h3>
          <p className="qa-card-exams">NID DAT, NIFT Entrance, UCEED, CEED, NATA, JEE Main Paper 2</p>
          <p className="qa-card-colleges">Top Colleges: NID | NIFT | SPA Delhi | IIT B.Des | Srishti</p>
          <Link to="/entrance-exams?category=Design" className="qa-card-link">Explore Design Exams &rarr;</Link>
        </div>
        <div className="card qa-card">
          <h3>Scholarships & Cutoffs</h3>
          <p className="qa-card-exams">Central & State scholarships, NIRF rankings, latest cutoff data for all major exams</p>
          <p className="qa-card-colleges">NSP, Post Matric, Merit-cum-Means, Minority, SC/ST/OBC scholarships</p>
          <Link to="/scholarships" className="qa-card-link">Explore Scholarships &rarr;</Link>
        </div>
      </div>

      <div style={{marginTop: 40}}>
        <div className="section-header">
          <h1>Important Notes for Students (2025)</h1>
        </div>
        <div className="card notes-card">
          <ul>
            <li><strong>NEET UG</strong> is the single entrance exam for ALL MBBS, BDS, AYUSH, Veterinary admissions. No separate AIIMS/JIPMER exams anymore.</li>
            <li><strong>CUET UG</strong> is mandatory for ALL Central University admissions (DU, JNU, BHU, JMI, AMU, etc.) from 2022 onwards.</li>
            <li><strong>JEE Main</strong> is conducted twice a year (Jan & Apr). Best score counts. Top 2.5 lakh qualify for JEE Advanced.</li>
            <li><strong>Engineering graduates CAN do Law</strong> — 3-year LLB after any graduation. Many engineers become successful lawyers.</li>
            <li><strong>GATE</strong> score is valid for 3 years and is used for M.Tech admissions at IITs/NITs.</li>
            <li><strong>IIM Indore & IIM Rohtak</strong> offer 5-year IPM (Integrated Program in Management) directly after Class 12.</li>
            <li><strong>CA Foundation</strong> can be registered after Class 12. Many students do B.Com + CA simultaneously.</li>
            <li><strong>NDA exam</strong> is now open to women as well (Supreme Court order).</li>
            <li><strong>KVPY</strong> scholarship has been discontinued from 2022. Replaced by INSPIRE SHE scholarship.</li>
            <li>Many states (MP, Rajasthan, etc.) now use <strong>JEE Main scores</strong> instead of separate state engineering exams.</li>
            <li><strong>Tamil Nadu (TNEA)</strong> does NOT have a separate engineering entrance exam — admissions purely on Class 12 marks.</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM DISCLAIMER */}
      <div className="disclaimer-bar" style={{marginTop: 30}}>
        <strong>Important:</strong> All information including fees, eligibility criteria, exam patterns, and college details are indicative and based on data available as of 2025. Fees and criteria change every year. Please verify all details from official websites and prospectuses before making any decisions. We are not responsible for any discrepancies.
      </div>
    </div>
  )
}
