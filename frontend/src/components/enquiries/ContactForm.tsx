'use client';

import { useState } from 'react';
import { submitContactEnquiry, APIError } from '@/lib/api/client';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const validateClientSide = () => {
    const errors: Record<string, string[]> = {};
    if (!formData.name.trim()) errors.name = ['Name is required.'];
    if (!formData.email.trim()) {
      errors.email = ['Email is required.'];
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = ['Please enter a valid email address.'];
    }
    if (!formData.phone.trim()) errors.phone = ['Phone number is required.'];
    if (!formData.message.trim()) errors.message = ['Message is required.'];
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateClientSide()) return;

    setIsLoading(true);
    try {
      await submitContactEnquiry(formData);
      setIsSuccess(true);
      setFormData({ name: '', company: '', email: '', phone: '', message: '' });
    } catch (err) {
      if (err instanceof APIError) {
        if (err.status === 400 && err.data) {
          setFieldErrors(err.data);
        } else if (err.status === 429) {
          setGeneralError('Too many enquiries sent. Please wait an hour before submitting again.');
        } else {
          setGeneralError('Something went wrong. Please check your submission or try again later.');
        }
      } else {
        setGeneralError('Network unavailable. Please check your internet connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-10" role="alert" aria-live="polite">
        <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
        <h3 className="text-lg font-display font-bold text-foreground uppercase tracking-wide mb-2">
          Enquiry Transmitted
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 font-sans leading-relaxed">
          Thank you for contacting Arabian Gratings Saudi Arabia. Your enquiry has been successfully logged and routed to our sales division.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="inline-flex items-center justify-center px-4 py-2 border border-border-color font-display text-[10px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-colors rounded-sm"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {generalError && (
        <div className="p-4 bg-red-55 border border-red-200 rounded-sm flex gap-3 text-xs text-red-700 font-sans" role="alert">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Name input */}
        <div className="space-y-1">
          <label htmlFor="name-input" className="text-[10px] font-mono font-bold text-slate-grey uppercase tracking-wider block">
            Full Name <span className="text-accent">*</span>
          </label>
          <input
            id="name-input"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? 'name-error' : undefined}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-border-color rounded-sm text-xs bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 font-sans"
          />
          {fieldErrors.name && (
            <p id="name-error" className="text-xs text-red-500 font-semibold font-sans mt-1" role="alert">
              {fieldErrors.name[0]}
            </p>
          )}
        </div>

        {/* Company input */}
        <div className="space-y-1">
          <label htmlFor="company-input" className="text-[10px] font-mono font-bold text-slate-grey uppercase tracking-wider block">
            Company Name
          </label>
          <input
            id="company-input"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-border-color rounded-sm text-xs bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 font-sans"
          />
        </div>

        {/* Email input */}
        <div className="space-y-1">
          <label htmlFor="email-input" className="text-[10px] font-mono font-bold text-slate-grey uppercase tracking-wider block">
            Email Address <span className="text-accent">*</span>
          </label>
          <input
            id="email-input"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-border-color rounded-sm text-xs bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 font-sans"
          />
          {fieldErrors.email && (
            <p id="email-error" className="text-xs text-red-500 font-semibold font-sans mt-1" role="alert">
              {fieldErrors.email[0]}
            </p>
          )}
        </div>

        {/* Phone input */}
        <div className="space-y-1">
          <label htmlFor="phone-input" className="text-[10px] font-mono font-bold text-slate-grey uppercase tracking-wider block">
            Phone Number <span className="text-accent">*</span>
          </label>
          <input
            id="phone-input"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            aria-invalid={!!fieldErrors.phone}
            aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-border-color rounded-sm text-xs bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 font-sans"
          />
          {fieldErrors.phone && (
            <p id="phone-error" className="text-xs text-red-500 font-semibold font-sans mt-1" role="alert">
              {fieldErrors.phone[0]}
            </p>
          )}
        </div>

      </div>

      {/* Message input */}
      <div className="space-y-1">
        <label htmlFor="message-input" className="text-[10px] font-mono font-bold text-slate-grey uppercase tracking-wider block">
          Message / Inquiry Details <span className="text-accent">*</span>
        </label>
        <textarea
          id="message-input"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? 'message-error' : undefined}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-border-color rounded-sm text-xs bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 resize-y font-sans leading-relaxed"
        />
        {fieldErrors.message && (
          <p id="message-error" className="text-xs text-red-500 font-semibold font-sans mt-1" role="alert">
            {fieldErrors.message[0]}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent font-display text-xs font-bold uppercase tracking-widest text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm disabled:opacity-50 cursor-pointer w-full sm:w-auto"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Transmitting...
          </>
        ) : (
          'Submit Enquiry'
        )}
      </button>

    </form>
  );
}
