// Master index for all Government Jobs data files
// Import this single file to access all central + state govt jobs

import { centralGovtJobs, majorPSUs } from './govtJobs_central';
import apGovtJobs from './govtJobs_ap';
import tsGovtJobs from './govtJobs_ts';
import tnGovtJobs from './govtJobs_tn';
import kaGovtJobs from './govtJobs_ka';
import mhGovtJobs from './govtJobs_mh';
import upGovtJobs from './govtJobs_up';
import rjGovtJobs from './govtJobs_rj';
import gjGovtJobs from './govtJobs_gj';
import wbGovtJobs from './govtJobs_wb';
import { biharGovtJobs, jharkhandGovtJobs, odishaGovtJobs } from './govtJobs_br_jh_or';
import { mpGovtJobs, cgGovtJobs } from './govtJobs_mp_cg';
import { keralaGovtJobs, goaGovtJobs } from './govtJobs_kl_ga';
import { delhiGovtJobs, uttarakhandGovtJobs, jkGovtJobs } from './govtJobs_dl_uk_jk';
import { punjabGovtJobs, haryanaGovtJobs, hpGovtJobs } from './govtJobs_ph_hr_hp';
import { assamGovtJobs, northeastOtherGovtJobs } from './govtJobs_northeast';

export const stateJobsMap = [
  { stateId: "andhra-pradesh", stateName: "Andhra Pradesh", pscName: "APPSC", pscWebsite: "https://psc.ap.gov.in", jobs: apGovtJobs },
  { stateId: "telangana", stateName: "Telangana", pscName: "TSPSC", pscWebsite: "https://www.tspsc.gov.in", jobs: tsGovtJobs },
  { stateId: "tamil-nadu", stateName: "Tamil Nadu", pscName: "TNPSC", pscWebsite: "https://www.tnpsc.gov.in", jobs: tnGovtJobs },
  { stateId: "karnataka", stateName: "Karnataka", pscName: "KPSC", pscWebsite: "https://kpsc.kar.nic.in", jobs: kaGovtJobs },
  { stateId: "maharashtra", stateName: "Maharashtra", pscName: "MPSC", pscWebsite: "https://mpsc.gov.in", jobs: mhGovtJobs },
  { stateId: "uttar-pradesh", stateName: "Uttar Pradesh", pscName: "UPPSC", pscWebsite: "https://uppsc.up.nic.in", jobs: upGovtJobs },
  { stateId: "rajasthan", stateName: "Rajasthan", pscName: "RPSC", pscWebsite: "https://rpsc.rajasthan.gov.in", jobs: rjGovtJobs },
  { stateId: "gujarat", stateName: "Gujarat", pscName: "GPSC", pscWebsite: "https://gpsc.gujarat.gov.in", jobs: gjGovtJobs },
  { stateId: "west-bengal", stateName: "West Bengal", pscName: "WBPSC", pscWebsite: "https://www.pscwbapplication.in", jobs: wbGovtJobs },
  { stateId: "bihar", stateName: "Bihar", pscName: "BPSC", pscWebsite: "https://www.bpsc.bih.nic.in", jobs: biharGovtJobs },
  { stateId: "jharkhand", stateName: "Jharkhand", pscName: "JPSC", pscWebsite: "https://jpsc.gov.in", jobs: jharkhandGovtJobs },
  { stateId: "odisha", stateName: "Odisha", pscName: "OPSC", pscWebsite: "https://opsc.gov.in", jobs: odishaGovtJobs },
  { stateId: "madhya-pradesh", stateName: "Madhya Pradesh", pscName: "MPPSC", pscWebsite: "https://mppsc.mp.gov.in", jobs: mpGovtJobs },
  { stateId: "chhattisgarh", stateName: "Chhattisgarh", pscName: "CGPSC", pscWebsite: "https://psc.cg.gov.in", jobs: cgGovtJobs },
  { stateId: "kerala", stateName: "Kerala", pscName: "KPSC", pscWebsite: "https://www.keralapsc.gov.in", jobs: keralaGovtJobs },
  { stateId: "goa", stateName: "Goa", pscName: "GPSC Goa", pscWebsite: "https://gpsc.goa.gov.in", jobs: goaGovtJobs },
  { stateId: "delhi", stateName: "Delhi (NCT)", pscName: "DSSSB", pscWebsite: "https://dsssb.delhi.gov.in", jobs: delhiGovtJobs },
  { stateId: "uttarakhand", stateName: "Uttarakhand", pscName: "UKPSC", pscWebsite: "https://ukpsc.net.in", jobs: uttarakhandGovtJobs },
  { stateId: "jammu-kashmir", stateName: "Jammu & Kashmir", pscName: "JKPSC", pscWebsite: "https://jkpsc.nic.in", jobs: jkGovtJobs },
  { stateId: "punjab", stateName: "Punjab", pscName: "PPSC", pscWebsite: "https://ppsc.gov.in", jobs: punjabGovtJobs },
  { stateId: "haryana", stateName: "Haryana", pscName: "HPSC/HSSC", pscWebsite: "https://hpsc.gov.in", jobs: haryanaGovtJobs },
  { stateId: "himachal-pradesh", stateName: "Himachal Pradesh", pscName: "HPPSC", pscWebsite: "https://www.hppsc.hp.gov.in", jobs: hpGovtJobs },
  { stateId: "assam", stateName: "Assam", pscName: "APSC", pscWebsite: "https://apsc.nic.in", jobs: assamGovtJobs },
];

export { centralGovtJobs, majorPSUs, northeastOtherGovtJobs };
