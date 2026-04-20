import { preparationTimeline } from '../data/careerPaths'

export default function Timeline() {
  return (
    <div>
      <div className="section-header">
        <h1>Preparation Timeline</h1>
        <p>Grade-wise guide on what to focus, which exams to prepare for, and how to build your academic profile from Class 6 to post-graduation.</p>
      </div>

      <div className="timeline">
        {preparationTimeline.map((item, i) => (
          <div key={i} className="timeline-item">
            <div className="card" style={{borderLeft: '4px solid var(--primary)'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
                <h3>{item.grade}</h3>
                <span className="badge badge-primary">{item.title}</span>
              </div>
              <ul style={{paddingLeft: 20}}>
                {item.activities.map((a, j) => (
                  <li key={j} style={{marginBottom: 6, fontSize:'0.9rem'}}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{marginTop:32, background:'#f0fdf4', borderColor:'#86efac'}}>
        <h2 style={{color:'var(--primary-dark)', marginBottom:12}}>General Tips for All Students</h2>
        <ul style={{paddingLeft: 20, lineHeight: 2}}>
          <li><strong>NCERT textbooks</strong> are the foundation for almost every competitive exam in India (JEE, NEET, UPSC, SSC).</li>
          <li><strong>Start early but don't burn out.</strong> Consistent daily study of 4-6 hours is better than 14-hour cramming sessions.</li>
          <li><strong>Mock tests are essential.</strong> Take as many full-length mock tests as possible in the last 3-6 months.</li>
          <li><strong>Don't limit yourself to one option.</strong> Apply for multiple exams to keep backup options open.</li>
          <li><strong>Physical fitness and mental health</strong> are as important as studies. Exercise regularly, sleep 7-8 hours.</li>
          <li><strong>Previous year papers</strong> are the best study material. Solve at least 10 years of PYQs for your target exam.</li>
          <li><strong>Online resources:</strong> NPTEL, Khan Academy, Unacademy, BYJU'S, PhysicsWallah, YouTube educators are excellent supplements.</li>
          <li><strong>Scholarships:</strong> Always check for scholarship opportunities - NTSE, KVPY/INSPIRE, state scholarships, college-specific aid.</li>
          <li><strong>Official websites only:</strong> Always verify exam dates, syllabus, and patterns from official websites. Don't trust random sources.</li>
        </ul>
      </div>
    </div>
  )
}
