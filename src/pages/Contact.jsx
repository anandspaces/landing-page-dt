import { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    phone: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // Allow only numbers and limit to 10 digits
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-electric-blue/10 border border-electric-blue/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-electric-blue rounded-full animate-pulse" />
            <span className="text-sm text-electric-blue font-semibold">Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Contact Us</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Have questions? We're here to help you get started with AI-powered learning
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-electric-blue/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-electric-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Phone</h3>
                    <a href="tel:+918447934906" className="text-electric-blue hover:underline">
                      +91 84479 34906
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-electric-blue/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-electric-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Email</h3>
                    <a href="mailto:info@dextora.ai" className="text-electric-blue hover:underline">
                      info@dextora.ai
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-electric-blue/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 text-electric-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Support Hours</h3>
                    <p className="text-gray-400">24X7 Available</p>
                    <p className="text-gray-400 text-sm">Human support: Mon-Fri, 9AM-6PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-4">Quick Response</h3>
              <p className="text-gray-400 mb-4">
                Our team typically responds within 24 hours. For urgent matters, please call us directly.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-electric-blue/30 rounded-full">
                <span className="text-xs text-gray-400">Trusted by Top Educators</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
                  placeholder="Enter your name"
                />
              </div>

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
                  pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                  title="Please enter a valid email address (e.g., user@example.com)"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="flex gap-4">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="w-24 px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-electric-blue transition-colors appearance-none cursor-pointer"
                  >
                    <option value="+91" className="text-black">IN +91</option>
                    <option value="+1" className="text-black">US +1</option>
                    <option value="+44" className="text-black">UK +44</option>
                    <option value="+61" className="text-black">AU +61</option>
                    <option value="+81" className="text-black">JP +81</option>
                    <option value="+86" className="text-black">CN +86</option>
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    title="Please enter exactly 10 digits"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
                    placeholder="XXXXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
