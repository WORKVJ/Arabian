'use client';

import { useState, useRef, useEffect } from 'react';
import { submitQuoteRequest, APIError } from '@/lib/api/client';
import { Loader2, CheckCircle2, AlertTriangle, Paperclip, X, Trash2 } from 'lucide-react';

const ALLOWED_EXTENSIONS = ['.pdf', '.dwg', '.dxf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Fallback product list — used if API is unavailable
const FALLBACK_PRODUCTS = [
  'Electroforged Welded Steel Grating',
  'Moulded GRP Walkway Grating',
  'Stainless Steel SS316 Floor Grating',
  'Aluminium Access Grating Walkway',
  'Ductile Iron Double Sealed Manhole Cover',
  'M-Clip Grating Fastening Clamp',
  'Ductile Iron Plastic Encapsulated Step Iron',
  'Stainless Steel Tactile Stud',
];

export default function QuoteForm({ initialProduct }: { initialProduct?: string }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: initialProduct || '',
    material: '',
    quantity: '',
    dimensions: '',
    project_requirements: '',
    message: initialProduct ? `Enquiry regarding: ${initialProduct}` : '',
  });

  const [drawing, setDrawing] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [productOptions, setProductOptions] = useState<string[]>(FALLBACK_PRODUCTS);

  const drawingInputRef = useRef<HTMLInputElement>(null);
  const attachmentsInputRef = useRef<HTMLInputElement>(null);

  // Fetch live product list from Django API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiBase}/api/v1/products/?page_size=100&is_active=true`);
        if (!res.ok) return;
        const data = await res.json();
        const names: string[] = (data.results || []).map((p: { name: string }) => p.name);
        if (names.length > 0) setProductOptions(names);
      } catch {
        // silently keep fallback list
      }
    };
    fetchProducts();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File '${file.name}' exceeds the maximum allowed size of 10MB.`;
    }
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `File extension '${ext}' for file '${file.name}' is not allowed. Allowed types are: ${ALLOWED_EXTENSIONS.join(', ')}`;
    }
    return null;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleDrawingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setFieldErrors((prev) => ({ ...prev, drawing: [error] }));
        if (drawingInputRef.current) drawingInputRef.current.value = '';
      } else {
        setDrawing(file);
        setFieldErrors((prev) => {
          const copy = { ...prev };
          delete copy.drawing;
          return copy;
        });
      }
    }
  };

  const handleAttachmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setFieldErrors((prev) => ({ ...prev, attachments: errors }));
    } else {
      setAttachments((prev) => [...prev, ...validFiles]);
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy.attachments;
        return copy;
      });
    }

    if (attachmentsInputRef.current) attachmentsInputRef.current.value = '';
  };

  const removeDrawing = () => {
    setDrawing(null);
    if (drawingInputRef.current) drawingInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const validateClientSide = () => {
    const errors: Record<string, string[]> = {};
    if (!formData.name.trim()) errors.name = ['Name is required.'];
    if (!formData.company.trim()) errors.company = ['Company is required.'];
    if (!formData.email.trim()) {
      errors.email = ['Email is required.'];
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = ['Please enter a valid email address.'];
    }
    if (!formData.phone.trim()) errors.phone = ['Phone number is required.'];
    if (!formData.product) errors.product = ['Product type is required.'];
    if (!formData.material) errors.material = ['Material selection is required.'];
    if (!formData.quantity.trim()) errors.quantity = ['Quantity is required.'];
    if (!formData.dimensions.trim()) errors.dimensions = ['Dimensions are required.'];

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateClientSide()) return;

    setIsLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      data.append(key, val);
    });

    if (drawing) {
      data.append('drawing', drawing);
    }

    attachments.forEach((file) => {
      data.append('attachments', file);
    });

    try {
      await submitQuoteRequest(data);
      setIsSuccess(true);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        product: '',
        material: '',
        quantity: '',
        dimensions: '',
        project_requirements: '',
        message: '',
      });
      setDrawing(null);
      setAttachments([]);
    } catch (err) {
      if (err instanceof APIError) {
        if (err.status === 400 && err.data) {
          setFieldErrors(err.data);
        } else if (err.status === 429) {
          setGeneralError('Too many request submissions. Please wait an hour before submitting again.');
        } else {
          setGeneralError('Something went wrong. Please check your inputs or try again later.');
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
          RFQ Transmitted
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 font-sans leading-relaxed">
          Your Request for Quotation has been received. Our sales desk will verify the dimensions and drawings before sending a custom proposal.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="inline-flex items-center justify-center px-4 py-2 border border-border-color font-display text-[10px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-colors rounded-sm"
        >
          Submit another RFQ
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {generalError && (
        <div className="p-4 bg-red-55 border border-red-200 rounded-sm flex gap-3 text-xs text-red-700 font-sans" role="alert">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Section 1: Contact Information */}
      <div>
        <h3 className="text-xs font-bold text-foreground uppercase tracking-widest border-b border-border-color pb-2 mb-4 font-display">
          1. Company & Contact Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label htmlFor="name-field" className="text-[10px] font-mono font-bold text-slate-grey uppercase block">
              Contact Name <span className="text-accent">*</span>
            </label>
            <input
              id="name-field"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleTextChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-border-color rounded-sm text-xs bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 font-sans"
            />
            {fieldErrors.name && <p className="text-xs text-red-500 font-semibold font-sans mt-1">{fieldErrors.name[0]}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="company-field" className="text-[10px] font-mono font-bold text-slate-grey uppercase block">
              Company Name <span className="text-accent">*</span>
            </label>
            <input
              id="company-field"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleTextChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-border-color rounded-sm text-xs bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 font-sans"
            />
            {fieldErrors.company && <p className="text-xs text-red-500 font-semibold font-sans mt-1">{fieldErrors.company[0]}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="email-field" className="text-[10px] font-mono font-bold text-slate-grey uppercase block">
              Email Address <span className="text-accent">*</span>
            </label>
            <input
              id="email-field"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleTextChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-border-color rounded-sm text-xs bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 font-sans"
            />
            {fieldErrors.email && <p className="text-xs text-red-500 font-semibold font-sans mt-1">{fieldErrors.email[0]}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="phone-field" className="text-[10px] font-mono font-bold text-slate-grey uppercase block">
              Phone Number <span className="text-accent">*</span>
            </label>
            <input
              id="phone-field"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleTextChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-border-color rounded-sm text-xs bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 font-sans"
            />
            {fieldErrors.phone && <p className="text-xs text-red-500 font-semibold font-sans mt-1">{fieldErrors.phone[0]}</p>}
          </div>
        </div>
      </div>

      {/* Section 2: Technical Specifications */}
      <div>
        <h3 className="text-xs font-bold text-foreground uppercase tracking-widest border-b border-border-color pb-2 mb-4 font-display">
          2. Product & Loading Specifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label htmlFor="product-field" className="text-[10px] font-mono font-bold text-slate-grey uppercase block">
              Product Category / Type <span className="text-accent">*</span>
            </label>
            <select
              id="product-field"
              name="product"
              value={formData.product}
              onChange={handleTextChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-border-color rounded-sm text-xs bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 font-sans"
            >
              <option value="">Select a product line...</option>
              {/* If initialProduct is set and not in the dynamic list, show it as a distinct option */}
              {initialProduct && !productOptions.includes(initialProduct) && (
                <option value={initialProduct}>{initialProduct}</option>
              )}
              {productOptions.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            {fieldErrors.product && <p className="text-xs text-red-500 font-semibold font-sans mt-1">{fieldErrors.product[0]}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="material-field" className="text-[10px] font-mono font-bold text-slate-grey uppercase block">
              Material / Finish <span className="text-accent">*</span>
            </label>
            <select
              id="material-field"
              name="material"
              value={formData.material}
              onChange={handleTextChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-border-color rounded-sm text-xs bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 font-sans"
            >
              <option value="">Select material finish...</option>
              <option value="Hot Dip Galvanized Steel">Hot Dip Galvanized Steel</option>
              <option value="Stainless Steel (304 / 316)">Stainless Steel (304 / 316)</option>
              <option value="FRP Polyester Resin">FRP Polyester Resin (Standard)</option>
              <option value="FRP Vinyl Ester Resin">FRP Vinyl Ester Resin (Chemical)</option>
              <option value="Aluminum">Aluminum</option>
            </select>
            {fieldErrors.material && <p className="text-xs text-red-500 font-semibold font-sans mt-1">{fieldErrors.material[0]}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="quantity-field" className="text-[10px] font-mono font-bold text-slate-grey uppercase block">
              Required Quantity <span className="text-accent">*</span>
            </label>
            <input
              id="quantity-field"
              name="quantity"
              type="text"
              placeholder="e.g., 250 panels"
              value={formData.quantity}
              onChange={handleTextChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-border-color rounded-sm text-xs bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 font-sans"
            />
            {fieldErrors.quantity && <p className="text-xs text-red-500 font-semibold font-sans mt-1">{fieldErrors.quantity[0]}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="dimensions-field" className="text-[10px] font-mono font-bold text-slate-grey uppercase block">
              Design Dimensions (Length x Width x Height) <span className="text-accent">*</span>
            </label>
            <input
              id="dimensions-field"
              name="dimensions"
              type="text"
              placeholder="e.g., 1000mm x 5800mm span"
              value={formData.dimensions}
              onChange={handleTextChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-border-color rounded-sm text-xs bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 font-sans"
            />
            {fieldErrors.dimensions && <p className="text-xs text-red-500 font-semibold font-sans mt-1">{fieldErrors.dimensions[0]}</p>}
          </div>
        </div>
      </div>

      {/* Section 3: Engineering Drawings & Uploads */}
      <div>
        <h3 className="text-xs font-bold text-foreground uppercase tracking-widest border-b border-border-color pb-2 mb-4 font-display">
          3. Technical Layout Drawings (Max 10MB)
        </h3>
        <div className="space-y-4">
          
          {/* Primary drawing */}
          <div className="border border-dashed border-border-color p-4 rounded-sm bg-slate-50">
            <span className="text-[10px] font-mono font-bold text-slate-grey uppercase block mb-2">
              Primary Site Drawing
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                id="primary-drawing"
                ref={drawingInputRef}
                onChange={handleDrawingChange}
                accept={ALLOWED_EXTENSIONS.join(',')}
                className="hidden"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => drawingInputRef.current?.click()}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-2 border border-border-color rounded-sm text-xs font-bold uppercase tracking-wider text-slate-700 bg-white hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Paperclip className="w-3.5 h-3.5 mr-1 text-accent" />
                Attach Primary file
              </button>
              {drawing && (
                <div className="flex items-center gap-2 px-3 py-1 bg-white border border-border-color rounded-sm text-xs">
                  <span className="font-semibold truncate max-w-[200px]">{drawing.name}</span>
                  <span className="text-[10px] text-slate-400">({formatFileSize(drawing.size)})</span>
                  <button type="button" onClick={removeDrawing} className="text-slate-400 hover:text-red-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            {fieldErrors.drawing && <p className="text-xs text-red-500 font-semibold font-sans mt-2">{fieldErrors.drawing[0]}</p>}
          </div>

          {/* Multiple attachments */}
          <div className="border border-dashed border-border-color p-4 rounded-sm bg-slate-50">
            <span className="text-[10px] font-mono font-bold text-slate-grey uppercase block mb-2">
              Supporting Detail Sheets / Specifications
            </span>
            <div className="flex items-center gap-3">
              <input
                type="file"
                id="additional-docs"
                multiple
                ref={attachmentsInputRef}
                onChange={handleAttachmentsChange}
                accept={ALLOWED_EXTENSIONS.join(',')}
                className="hidden"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => attachmentsInputRef.current?.click()}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-2 border border-border-color rounded-sm text-xs font-bold uppercase tracking-wider text-slate-700 bg-white hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Paperclip className="w-3.5 h-3.5 mr-1 text-accent" />
                Attach supporting documents
              </button>
            </div>
            {attachments.length > 0 && (
              <ul className="mt-3 space-y-2">
                {attachments.map((file, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 bg-white border border-border-color rounded-sm text-xs max-w-md">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-semibold truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-400">({formatFileSize(file.size)})</span>
                    </div>
                    <button type="button" onClick={() => removeAttachment(idx)} className="text-slate-455 hover:text-red-500 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {fieldErrors.attachments && <p className="text-xs text-red-500 font-semibold font-sans mt-2">{fieldErrors.attachments[0]}</p>}
          </div>

        </div>
      </div>

      {/* Section 4: Specifications Notes */}
      <div>
        <h3 className="text-xs font-bold text-foreground uppercase tracking-widest border-b border-border-color pb-2 mb-4 font-display">
          4. Load Spans & Project details
        </h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="req-field" className="text-[10px] font-mono font-bold text-slate-grey uppercase block">
              Deflection limits or span calculations (e.g. Concentrated Point Load / UDL)
            </label>
            <textarea
              id="req-field"
              name="project_requirements"
              rows={3}
              placeholder="Specify structural deflection parameters..."
              value={formData.project_requirements}
              onChange={handleTextChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-border-color rounded-sm text-xs bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 font-sans leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="msg-field" className="text-[10px] font-mono font-bold text-slate-grey uppercase block">
              Additional specifications notes
            </label>
            <textarea
              id="msg-field"
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleTextChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-border-color rounded-sm text-xs bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 font-sans leading-relaxed"
            />
          </div>
        </div>
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
            Transmitting RFQ...
          </>
        ) : (
          'Submit RFQ request'
        )}
      </button>

    </form>
  );
}
