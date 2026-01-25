function About() {
  return (
    <div className="relative min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-electric-blue/10 border border-electric-blue/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-electric-blue rounded-full animate-pulse" />
            <span className="text-sm text-electric-blue font-semibold">About Us</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">About Dextora AI</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            An AI-powered learning platform built on academic rigor and research-backed methodologies
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="glass-card p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Dextora AI is designed to transform how students learn through personalized AI mentorship. We combine advanced artificial intelligence with proven educational methodologies to create adaptive learning experiences.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Our platform serves students from Class 1–12, as well as those preparing for competitive exams like IIT-JEE and NEET, providing 24/7 AI-powered guidance tailored to individual learning styles.
            </p>
          </div>

          <div className="glass-card p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Academic Foundation</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Built with academic grounding aligned with methodologies from IIM Lucknow and IIT Kanpur, Dextora AI brings together expertise in management, engineering, and artificial intelligence.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Our approach is research-backed, focusing on measurable learning outcomes, retention improvement, and sustainable academic performance gains.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="glass-card p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-electric-blue/20 to-soft-cyan/20 border border-electric-blue/30 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                🤖
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Adaptive AI Tutoring</h3>
                <p className="text-gray-400 text-sm">Personalized learning pathways that adapt to your pace and style</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-electric-blue/20 to-soft-cyan/20 border border-electric-blue/30 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                👁️
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Vision Intelligence</h3>
                <p className="text-gray-400 text-sm">Computer vision for posture monitoring and note digitization</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-electric-blue/20 to-soft-cyan/20 border border-electric-blue/30 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                👥
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Multiple AI Mentors</h3>
                <p className="text-gray-400 text-sm">Access diverse teaching styles and mentor personalities</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-electric-blue/20 to-soft-cyan/20 border border-electric-blue/30 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                📊
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Performance Analytics</h3>
                <p className="text-gray-400 text-sm">Data-driven insights into learning patterns and progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
