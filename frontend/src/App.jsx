import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
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
import Register from './pages/Register'
import Login from './pages/Login'
import BuildProfile from './pages/BuildProfile'
import MyPath from './pages/MyPath'
import Mentors from './pages/Mentors'
import MentorHub from './pages/MentorHub'
import MyMentorship from './pages/MyMentorship'
import AdminMentors from './pages/AdminMentors'
import AdminMentorship from './pages/AdminMentorship'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'Poppins,sans-serif',color:'#1a237e'}}>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function RoleRoute({ role, children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'Poppins,sans-serif',color:'#1a237e'}}>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  const roles = Array.isArray(user.roles) ? user.roles : []
  if (!roles.includes(role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/school-exams" element={<ProtectedRoute><SchoolExams /></ProtectedRoute>} />
          <Route path="/entrance-exams" element={<ProtectedRoute><EntranceExams /></ProtectedRoute>} />
          <Route path="/entrance-exams/:id" element={<ProtectedRoute><ExamDetail /></ProtectedRoute>} />
          <Route path="/colleges" element={<ProtectedRoute><Colleges /></ProtectedRoute>} />
          <Route path="/colleges/:id" element={<ProtectedRoute><CollegeDetail /></ProtectedRoute>} />
          <Route path="/states" element={<ProtectedRoute><StateInfo /></ProtectedRoute>} />
          <Route path="/states/:id" element={<ProtectedRoute><StateDetail /></ProtectedRoute>} />
          <Route path="/career-paths" element={<ProtectedRoute><CareerPaths /></ProtectedRoute>} />
          <Route path="/timeline" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/scholarships" element={<ProtectedRoute><Scholarships /></ProtectedRoute>} />
          <Route path="/govt-jobs" element={<ProtectedRoute><GovtJobs /></ProtectedRoute>} />
          <Route path="/internships" element={<ProtectedRoute><Internships /></ProtectedRoute>} />
          <Route path="/build-profile" element={<ProtectedRoute><BuildProfile /></ProtectedRoute>} />
          <Route path="/my-path" element={<ProtectedRoute><MyPath /></ProtectedRoute>} />
          <Route path="/mentors" element={<ProtectedRoute><Mentors /></ProtectedRoute>} />
          <Route path="/mentor-hub" element={<ProtectedRoute><MentorHub /></ProtectedRoute>} />
          <Route path="/my-mentorship" element={<ProtectedRoute><MyMentorship /></ProtectedRoute>} />
          <Route path="/admin/mentors" element={<RoleRoute role="admin"><AdminMentors /></RoleRoute>} />
          <Route path="/admin/mentorship" element={<RoleRoute role="admin"><AdminMentorship /></RoleRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}
