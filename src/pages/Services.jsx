import ServicesSection from '../components/ServicesSection';

function Services() {
  return (
    <div className="relative min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-electric-blue/10 border border-electric-blue/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-electric-blue rounded-full animate-pulse" />
            <span className="text-sm text-electric-blue font-semibold">Our Services</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Learning Solutions</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive AI-powered tools designed to enhance your learning experience
          </p>
        </div>
      </div>

      {/* Services Section Component */}
      <ServicesSection />
    </div>
  );
}

export default Services;
