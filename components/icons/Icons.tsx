import React from 'react';

export const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </svg>
);

// FIX: Add missing HomeIcon component
export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955M3.75 11.25V21a2.25 2.25 0 002.25 2.25h12A2.25 2.25 0 0020.25 21V11.25m-16.5 0L12 3.75m0 0l8.25 7.5M12 3.75v8.25" />
  </svg>
);

export const HistoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const TargetIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a12.025 12.025 0 01-4.132 4.132m0 0a6 6 0 01-7.38-5.84m-2.56 5.84a12.025 12.025 0 014.132-4.132m0 0a6 6 0 015.84-7.38m-5.84 2.56a12.025 12.025 0 014.132-4.132m-4.132 4.132a6 6 0 01-7.38 5.84m7.38-5.84a12.025 12.025 0 01-4.132 4.132" />
    </svg>
);


export const ProfileIcon = (props: React.SVGProps<SVGSVGElement>) => (
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
);

export const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 3.75a2.25 2.25 0 00-2.25 2.25c0 1.24.502 2.372 1.32 3.194.818.822 1.954 1.32 3.194 1.32a2.25 2.25 0 002.25-2.25c0-1.24-.502-2.372-1.32-3.194A3.01 3.01 0 0012 6z" />
    </svg>
);

export const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

export const FireIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12.25 6.168a1.75 1.75 0 10-3.483-1.095 6.25 6.25 0 00-3.656 5.242 1.75 1.75 0 103.492.057 2.75 2.75 0 015.424-2.133 1.75 1.75 0 00-1.777-2.07zM14.938 10.5a1.75 1.75 0 10-3.492-.057 2.75 2.75 0 01-5.424-2.133A1.75 1.75 0 004.246 6.32a6.25 6.25 0 003.656 5.242 1.75 1.75 0 103.483 1.095 2.75 2.75 0 01-1.636 4.887 1.75 1.75 0 10-2.918 1.977 6.25 6.25 0 009.646-4.993a1.75 1.75 0 00-1.777-2.07z" clipRule="evenodd" />
    </svg>
);

export const WaterDropIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M15.25 10.322a5.25 5.25 0 01-10.5 0c0-1.95.84-3.722 2.207-4.96a5.283 5.283 0 013.043-1.06c1.01.124 1.95.58 2.65 1.28l.1.101.1.101c.7.7 1.156 1.64 1.28 2.65a5.283 5.283 0 01-1.06 3.043 5.373 5.373 0 01-2.22 1.844zM10 3.75a6.75 6.75 0 00-6.75 6.75c0 2.513 1.39 4.73 3.456 5.895a6.784 6.784 0 006.588 0C15.36 15.23 16.75 13.013 16.75 10.5a6.75 6.75 0 00-6.75-6.75z" clipRule="evenodd" />
    </svg>
);

export const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
);