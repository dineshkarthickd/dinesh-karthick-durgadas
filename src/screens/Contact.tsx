import React from 'react';
import { Mail, MessageCircle, Phone, MapPin } from 'lucide-react';
import { ScreenShell } from '../ui/ScreenShell';
import { PrimaryButton } from '../ui/PrimaryButton';
import { contact } from '../data/portfolio';

const ACCENT = '#3d8bff';

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const Contact: React.FC = () => {
  const mailtoSubject = encodeURIComponent('Hello Dinesh — from your portfolio');
  const mailtoHref = `mailto:${contact.email}?subject=${mailtoSubject}`;

  return (
    <ScreenShell
      artSrc="/art/contact.webp"
      artAlt="Illustration of Dinesh Karthick on Midnight Avenue with phone in hand"
      title="CONTACT"
      subtitle="Let's Connect"
      accentColor={ACCENT}
      sectionId="contact"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 lg:gap-2">
        {/* EMAIL */}
        <a
          href={`mailto:${contact.email}`}
          className="p-[var(--m-card-pad)] lg:py-2.5 lg:px-3 rounded-r-lg bg-[rgba(10,10,14,0.75)] backdrop-blur-md border border-white/10 hover:border-white/30 transition-all hover:translate-x-1 flex items-center gap-2.5 group"
          style={{ borderLeft: `4px solid ${ACCENT}` }}
        >
          <div
            className="w-[var(--m-card-icon-box)] h-[var(--m-card-icon-box)] lg:w-7.5 lg:h-7.5 rounded flex items-center justify-center shrink-0 text-black shadow-md [&>svg]:w-[var(--m-card-icon-glyph)] [&>svg]:h-[var(--m-card-icon-glyph)] lg:[&>svg]:w-4 lg:[&>svg]:h-4"
            style={{ backgroundColor: ACCENT }}
          >
            <Mail size={16} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Barlow_Condensed'] font-bold card-title-mobile lg:text-[11.5px] uppercase tracking-wider text-white">
              EMAIL
            </span>
            <span className="font-['Inter'] card-text-mobile lg:text-[12.5px] text-[#b9b4ab] break-words group-hover:text-white transition-colors">
              {contact.email}
            </span>
          </div>
        </a>

        {/* WHATSAPP (Label: Chat on WhatsApp, DO NOT print phone number) */}
        <a
          href={contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="p-[var(--m-card-pad)] lg:py-2.5 lg:px-3 rounded-r-lg bg-[rgba(10,10,14,0.75)] backdrop-blur-md border border-white/10 hover:border-white/30 transition-all hover:translate-x-1 flex items-center gap-2.5 group"
          style={{ borderLeft: `4px solid ${ACCENT}` }}
        >
          <div
            className="w-[var(--m-card-icon-box)] h-[var(--m-card-icon-box)] lg:w-7.5 lg:h-7.5 rounded flex items-center justify-center shrink-0 text-black shadow-md [&>svg]:w-[var(--m-card-icon-glyph)] [&>svg]:h-[var(--m-card-icon-glyph)] lg:[&>svg]:w-4 lg:[&>svg]:h-4"
            style={{ backgroundColor: ACCENT }}
          >
            <MessageCircle size={16} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Barlow_Condensed'] font-bold card-title-mobile lg:text-[11.5px] uppercase tracking-wider text-white">
              WHATSAPP
            </span>
            <span className="font-['Inter'] card-text-mobile lg:text-[12.5px] text-[#b9b4ab] break-words group-hover:text-white transition-colors">
              Chat on WhatsApp
            </span>
          </div>
        </a>

        {/* CALL (Label: Call me, DO NOT print phone number) */}
        <a
          href={contact.phoneTel}
          className="p-[var(--m-card-pad)] lg:py-2.5 lg:px-3 rounded-r-lg bg-[rgba(10,10,14,0.75)] backdrop-blur-md border border-white/10 hover:border-white/30 transition-all hover:translate-x-1 flex items-center gap-2.5 group"
          style={{ borderLeft: `4px solid ${ACCENT}` }}
        >
          <div
            className="w-[var(--m-card-icon-box)] h-[var(--m-card-icon-box)] lg:w-7.5 lg:h-7.5 rounded flex items-center justify-center shrink-0 text-black shadow-md [&>svg]:w-[var(--m-card-icon-glyph)] [&>svg]:h-[var(--m-card-icon-glyph)] lg:[&>svg]:w-4 lg:[&>svg]:h-4"
            style={{ backgroundColor: ACCENT }}
          >
            <Phone size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Barlow_Condensed'] font-bold card-title-mobile lg:text-[11.5px] uppercase tracking-wider text-white">
              CALL
            </span>
            <span className="font-['Inter'] card-text-mobile lg:text-[12.5px] text-[#b9b4ab] break-words group-hover:text-white transition-colors">
              Call me
            </span>
          </div>
        </a>

        {/* LINKEDIN */}
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-[var(--m-card-pad)] lg:py-2.5 lg:px-3 rounded-r-lg bg-[rgba(10,10,14,0.75)] backdrop-blur-md border border-white/10 hover:border-white/30 transition-all hover:translate-x-1 flex items-center gap-2.5 group"
          style={{ borderLeft: `4px solid ${ACCENT}` }}
        >
          <div
            className="w-[var(--m-card-icon-box)] h-[var(--m-card-icon-box)] lg:w-7.5 lg:h-7.5 rounded flex items-center justify-center shrink-0 text-black shadow-md [&>svg]:w-[var(--m-card-icon-glyph)] [&>svg]:h-[var(--m-card-icon-glyph)] lg:[&>svg]:w-4 lg:[&>svg]:h-4"
            style={{ backgroundColor: ACCENT }}
          >
            <LinkedinIcon size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Barlow_Condensed'] font-bold card-title-mobile lg:text-[11.5px] uppercase tracking-wider text-white">
              LINKEDIN
            </span>
            <span className="font-['Inter'] card-text-mobile lg:text-[12.5px] text-[#b9b4ab] break-words group-hover:text-white transition-colors">
              dinesh-karthick-durgadas
            </span>
          </div>
        </a>

        {/* GITHUB */}
        <a
          href={contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-[var(--m-card-pad)] lg:py-2.5 lg:px-3 rounded-r-lg bg-[rgba(10,10,14,0.75)] backdrop-blur-md border border-white/10 hover:border-white/30 transition-all hover:translate-x-1 flex items-center gap-2.5 group"
          style={{ borderLeft: `4px solid ${ACCENT}` }}
        >
          <div
            className="w-[var(--m-card-icon-box)] h-[var(--m-card-icon-box)] lg:w-7.5 lg:h-7.5 rounded flex items-center justify-center shrink-0 text-black shadow-md [&>svg]:w-[var(--m-card-icon-glyph)] [&>svg]:h-[var(--m-card-icon-glyph)] lg:[&>svg]:w-4 lg:[&>svg]:h-4"
            style={{ backgroundColor: ACCENT }}
          >
            <GithubIcon size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Barlow_Condensed'] font-bold card-title-mobile lg:text-[11.5px] uppercase tracking-wider text-white">
              GITHUB
            </span>
            <span className="font-['Inter'] card-text-mobile lg:text-[12.5px] text-[#b9b4ab] break-words group-hover:text-white transition-colors">
              dineshkarthickd
            </span>
          </div>
        </a>

        {/* INSTAGRAM */}
        <a
          href={contact.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="p-[var(--m-card-pad)] lg:py-2.5 lg:px-3 rounded-r-lg bg-[rgba(10,10,14,0.75)] backdrop-blur-md border border-white/10 hover:border-white/30 transition-all hover:translate-x-1 flex items-center gap-2.5 group"
          style={{ borderLeft: `4px solid ${ACCENT}` }}
        >
          <div
            className="w-[var(--m-card-icon-box)] h-[var(--m-card-icon-box)] lg:w-7.5 lg:h-7.5 rounded flex items-center justify-center shrink-0 text-black shadow-md [&>svg]:w-[var(--m-card-icon-glyph)] [&>svg]:h-[var(--m-card-icon-glyph)] lg:[&>svg]:w-4 lg:[&>svg]:h-4"
            style={{ backgroundColor: ACCENT }}
          >
            <InstagramIcon size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Barlow_Condensed'] font-bold card-title-mobile lg:text-[11.5px] uppercase tracking-wider text-white">
              INSTAGRAM
            </span>
            <span className="font-['Inter'] card-text-mobile lg:text-[12.5px] text-[#b9b4ab] break-words group-hover:text-white transition-colors">
              @dinesh.durgadas
            </span>
          </div>
        </a>

        {/* LOCATION (not a link) */}
        <div
          className="p-[var(--m-card-pad)] lg:py-2.5 lg:px-3 rounded-r-lg bg-[rgba(10,10,14,0.75)] backdrop-blur-md border border-white/10 flex items-center gap-2.5 sm:col-span-2"
          style={{ borderLeft: `4px solid ${ACCENT}` }}
        >
          <div
            className="w-[var(--m-card-icon-box)] h-[var(--m-card-icon-box)] lg:w-7.5 lg:h-7.5 rounded flex items-center justify-center shrink-0 text-black shadow-md [&>svg]:w-[var(--m-card-icon-glyph)] [&>svg]:h-[var(--m-card-icon-glyph)] lg:[&>svg]:w-4 lg:[&>svg]:h-4"
            style={{ backgroundColor: ACCENT }}
          >
            <MapPin size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Barlow_Condensed'] font-bold card-title-mobile lg:text-[11.5px] uppercase tracking-wider text-white">
              LOCATION
            </span>
            <span className="font-['Inter'] card-text-mobile lg:text-[12.5px] text-[#b9b4ab] break-words">
              {contact.location}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Send Message Button */}
      <div className="mt-4">
        <PrimaryButton accentColor={ACCENT} href={mailtoHref}>
          SEND MESSAGE
        </PrimaryButton>
      </div>
    </ScreenShell>
  );
};
