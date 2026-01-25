import { useState } from 'react';

function Admission() {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phone: '',
    grade: '',
    course: 'Class 1-12',
    parentName: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Admission form submitted:', formData);
    alert('Thank you for your interest! Our admissions team will contact you within 24 hours.');
    setFormData({
      studentName: '',
      email: '',
      phone: '',
      grade: '',
      course: 'Class 1-12',
      parentName: '',
      message: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="relative min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-electric-blue/10 border border-electric-blue/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-electric-blue rounded-full animate-pulse" />
            <span className="text-sm text-electric-blue font-semibold">Start Your Journey</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Admission Process</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Begin your AI-powered learning journey. Fill out the form below and our team will guide you through the next steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Admission Steps */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-6">Admission Steps</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-soft-cyan rounded-lg flex items-center justify-center text-deep-navy font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Submit Application</h3>
                    <p className="text-gray-400 text-sm">Fill out the admission form</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-soft-cyan rounded-lg flex items-center justify-center text-deep-navy font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Initial Assessment</h3>
                    <p className="text-gray-400 text-sm">Brief learning evaluation</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-soft-cyan rounded-lg flex items-center justify-center text-deep-navy font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Counseling Session</h3>
                    <p className="text-gray-400 text-sm">Meet with our education specialists</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-soft-cyan rounded-lg flex items-center justify-center text-deep-navy font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Start Learning</h3>
                    <p className="text-gray-400 text-sm">Begin your personalized journey</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-3">Questions?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Call us for immediate assistance
              </p>
              <a
                href="tel:+918447934906"
                className="text-electric-blue font-semibold hover:underline"
              >
                +91 84479 34906
              </a>
            </div>
          </div>

          {/* Admission Form */}
          <div className="lg:col-span-2 glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Admission Form</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="studentName" className="block text-sm font-medium text-gray-300 mb-2">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
                    placeholder="Enter student's name"
                  />
                </div>

                <div>
                  <label htmlFor="parentName" className="block text-sm font-medium text-gray-300 mb-2">
                    Parent/Guardian Name *
                  </label>
                  <input
                    type="text"
                    id="parentName"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
                    placeholder="Enter parent's name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-300 mb-2">
                    Current Grade/Class *
                  </label>
                  <input
                    type="text"
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
                    placeholder="e.g., Class 10"
                  />
                </div>

                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-300 mb-2">
                    Course Interested In *
                  </label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-electric-blue transition-colors"
                  >
                    <option value="Class 1-12">Class 1-12</option>
                    <option value="IIT-JEE Preparation">IIT-JEE Preparation</option>
                    <option value="NEET Preparation">NEET Preparation</option>
                    <option value="All Programs">All Programs</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors resize-none"
                  placeholder="Any specific learning goals or requirements..."
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  I agree to the terms and conditions and understand that Dextora AI will process my information to provide educational services. *
                </label>
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admission;
