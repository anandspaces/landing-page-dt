import { Bot, Eye, Users, BarChart } from 'lucide-react';


function About() {
  return (
    <div className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Aura removed as requested */}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-electric-blue/10 border border-electric-blue/30 rounded-full mb-6">
              <span className="w-2 h-2 bg-electric-blue rounded-full animate-pulse" />
              <span className="text-sm text-electric-blue font-semibold">Our Vision</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              We Are Redefining <br />
              <span className="gradient-text">Education with AI</span>
            </h1>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Education has remained unchanged for decades, while students have changed completely.
              Dextora was created to solve this gap by building a personal AI tutor for every student, connected directly to their books, syllabus, learning behavior, and future goals.
            </p>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Dextora doesn’t just teach subjects — it understands students deeply and grows with them year after year.
            </p>

            <div className="space-y-6">
              <div className="glass-card p-6 border-l-4 border-l-electric-blue">
                <h3 className="text-xl font-bold text-white mb-2">Mission</h3>
                <p className="text-gray-400">To deliver personalized, intelligent education to every student.</p>
              </div>
              <div className="glass-card p-6 border-l-4 border-l-purple-500">
                <h3 className="text-xl font-bold text-white mb-2">Vision</h3>
                <p className="text-gray-400">To become the world’s most trusted AI-powered learning platform.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to the future of learning.</h2>
        </div>
      </div>
    </div>
  );
}

export default About;
