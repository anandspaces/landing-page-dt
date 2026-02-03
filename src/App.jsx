import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import WorkflowSection from './components/WorkflowSection';
import PricingSection from './components/PricingSection';
import RoadmapSection from './components/RoadmapSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={
          <>
            <RoadmapSection />
            <HeroSection />
            <ServicesSection />
            <WorkflowSection />
            <PricingSection />
            <CTASection />
            <Footer />
          </>
        } />
        <Route path="chat" element={<Chat />} />
        <Route path="latency-test" element={<LatencyTest />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;