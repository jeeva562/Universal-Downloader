import Hero from '@/components/Hero';
import DownloadForm from '@/components/DownloadForm';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen py-6 px-4 sm:py-8">
      <div className="container mx-auto max-w-6xl">
        <Hero />
        <DownloadForm />
        <Features />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
