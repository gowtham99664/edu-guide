import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import EntranceExams from './pages/EntranceExams'
import Colleges from './pages/Colleges'
import StateInfo from './pages/StateInfo'
import CareerPaths from './pages/CareerPaths'
import SchoolExams from './pages/SchoolExams'
import ExamDetail from './pages/ExamDetail'
import CollegeDetail from './pages/CollegeDetail'
import StateDetail from './pages/StateDetail'
import Timeline from './pages/Timeline'
import Search from './pages/Search'
import Scholarships from './pages/Scholarships'
import GovtJobs from './pages/GovtJobs'
import Internships from './pages/Internships'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/school-exams" element={<SchoolExams />} />
        <Route path="/entrance-exams" element={<EntranceExams />} />
        <Route path="/entrance-exams/:id" element={<ExamDetail />} />
        <Route path="/colleges" element={<Colleges />} />
        <Route path="/colleges/:id" element={<CollegeDetail />} />
        <Route path="/states" element={<StateInfo />} />
        <Route path="/states/:id" element={<StateDetail />} />
        <Route path="/career-paths" element={<CareerPaths />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/search" element={<Search />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/govt-jobs" element={<GovtJobs />} />
        <Route path="/internships" element={<Internships />} />
      </Routes>
    </Layout>
  )
}
