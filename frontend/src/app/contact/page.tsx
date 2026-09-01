import { Metadata } from 'next';
import { defaultMetadata } from '@/lib/seo/config';
import ContactForm from '@/components/enquiries/ContactForm';
import ContactMap from '@/components/contact/ContactMap';
import Reveal from '@/components/animations/Reveal';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Contact Us | Arabian Gratings Saudi Arabia',
  description: 'Get in touch with Arabian Gratings Saudi Arabia. Contact our engineering office in Saudi Arabia for sales enquiries, product layout specifications, and support.',
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Hero */}
        <Reveal direction="up" delay={0.1}>
          <div className="max-w-3xl mb-12">
            <span className="text-accent font-mono font-bold tracking-widest text-[10px] uppercase block mb-3">
              Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-foreground uppercase mb-4 leading-tight">
              Contact Sales & Engineering
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">
              Have technical questions about load spans, custom configurations, or project rates? Reach out to our engineering team using the form below or our direct contact channels.
            </p>
          </div>
        </Reveal>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Form & Map */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-border-color p-8 rounded-sm shadow-sm">
              <Reveal direction="up" delay={0.15}>
                <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-6">
                  Send an Enquiry
                </h2>
                <ContactForm />
              </Reveal>
            </div>

            <Reveal direction="up" delay={0.2}>
              <ContactMap />
            </Reveal>
          </div>

          {/* Right Column: Office Details */}
          <aside className="lg:col-span-5 space-y-6">
            <Reveal direction="right" delay={0.2}>
              <div className="bg-charcoal text-white p-8 rounded-sm border border-slate-800 space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 tech-grid-overlay-dark" />
                <h2 className="text-sm font-display font-bold uppercase tracking-widest border-b border-slate-800 pb-3 text-slate-350 relative z-10">
                  Head Office & Manufacturing
                </h2>

                <div className="flex items-start gap-4 relative z-10">
                  <MapPin className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-1">Head Office — Jeddah</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Arabian Gratings & Manufacturing Company<br />
                      Othman Bin Afan Street, Jeddah 22234<br />
                      Saudi Arabia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10 border-t border-slate-800 pt-4">
                  <MapPin className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-1">Branch — Dammam</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Petromin Business Center<br />
                      4648 King Saud Bin Abdulaziz Rd, Arabia An Nawras<br />
                      Dammam 32214, Saudi Arabia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10 border-t border-slate-800 pt-4">
                  <Phone className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-1">Direct Call</h3>
                    <p className="text-xs text-slate-400">
                      <a href="tel:+966126576896" className="hover:text-accent transition-colors font-mono">
                        +966 12 657 6896
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10 border-t border-slate-800 pt-4">
                  <Mail className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-1">Email Correspondence</h3>
                    <p className="text-xs text-slate-400">
                      <a href="mailto:sales@arabiangratings.com" className="hover:text-accent transition-colors">
                        sales@arabiangratings.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10 border-t border-slate-800 pt-4">
                  <Clock className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-1">Operational Hours</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-mono">
                      Monday – Friday: 8:00 AM – 5:30 PM<br />
                      Saturday – Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </aside>

        </div>

      </div>
    </div>
  );
}
