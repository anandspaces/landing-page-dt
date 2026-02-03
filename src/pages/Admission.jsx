import { useState } from 'react';

function Admission() {
  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    gender: '',
    grade: '',
    schoolName: '',
    educationBoard: '',
    subjectsStudied: '',
    competitiveExamGoal: '',
    weakSubjects: '',
    strongSubjects: '',
    preferredLanguage: '',
    parentName: '',
    relationship: '',
    phone: '',
    email: '',
    studyTime: '',
    learningStyle: '',
    consentAnalysis: false,
    consentTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Admission form submitted:', formData);
    alert('Thank you! Your application has been submitted successfully.');
    // Reset form logic here if needed
  };

  return (
    <div className="relative min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Student Application</span>
          </h1>
          <p className="text-gray-400">Join Dextora to transform your learning journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 space-y-8">

          {/* Section 1: Student Details */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Student Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="studentName" placeholder="Full Name" value={formData.studentName} onChange={handleChange} required className="input-field" />
              <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} required className="input-field" />
              <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                <option value="">Gender (Optional)</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input type="text" name="grade" placeholder="Class / Grade" value={formData.grade} onChange={handleChange} required className="input-field" />
              <input type="text" name="schoolName" placeholder="School Name" value={formData.schoolName} onChange={handleChange} required className="input-field" />
              <input type="text" name="educationBoard" placeholder="Education Board (CBSE, ICSE, etc.)" value={formData.educationBoard} onChange={handleChange} required className="input-field" />
            </div>
          </div>

          {/* Section 2: Academic Information */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="subjectsStudied" placeholder="Subjects Studied" value={formData.subjectsStudied} onChange={handleChange} required className="input-field" />
              <input type="text" name="competitiveExamGoal" placeholder="Competitive Exam Goal (Optional)" value={formData.competitiveExamGoal} onChange={handleChange} className="input-field" />
              <input type="text" name="weakSubjects" placeholder="Weak Subjects (Optional)" value={formData.weakSubjects} onChange={handleChange} className="input-field" />
              <input type="text" name="strongSubjects" placeholder="Strong Subjects (Optional)" value={formData.strongSubjects} onChange={handleChange} className="input-field" />
              <input type="text" name="preferredLanguage" placeholder="Preferred Learning Language" value={formData.preferredLanguage} onChange={handleChange} required className="input-field" />
            </div>
          </div>

          {/* Section 3: Parent / Guardian Details */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Parent / Guardian Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="parentName" placeholder="Parent Name" value={formData.parentName} onChange={handleChange} required className="input-field" />
              <input type="text" name="relationship" placeholder="Relationship" value={formData.relationship} onChange={handleChange} required className="input-field" />
              <input type="tel" name="phone" placeholder="Mobile Number" value={formData.phone} onChange={handleChange} required className="input-field" />
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="input-field" />
            </div>
          </div>

          {/* Section 4: Learning Preferences */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Learning Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="studyTime" placeholder="Preferred Study Time" value={formData.studyTime} onChange={handleChange} required className="input-field" />
              <input type="text" name="learningStyle" placeholder="Learning Style (Optional)" value={formData.learningStyle} onChange={handleChange} className="input-field" />
            </div>
          </div>

          {/* Section 5: Consent */}
          <div className="space-y-4 pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="consentAnalysis" checked={formData.consentAnalysis} onChange={handleChange} required className="mt-1 w-4 h-4 text-electric-blue" />
              <span className="text-sm text-gray-300">I allow Dextora to analyze learning behavior to personalize education.</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="consentTerms" checked={formData.consentTerms} onChange={handleChange} required className="mt-1 w-4 h-4 text-electric-blue" />
              <span className="text-sm text-gray-300">I agree to the Terms & Conditions and Privacy Policy.</span>
            </label>
          </div>

          <button type="submit" className="w-full btn-primary py-4 text-lg font-bold">Submit Application</button>

        </form>
      </div>
      <style>{`
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: white;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus {
          border-color: #00d4ff;
        }
        .input-field::placeholder {
          color: #9ca3af;
        }
        select.input-field option {
          background-color: #1a1a2e;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default Admission;
