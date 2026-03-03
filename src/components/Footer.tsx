import React from 'react';

const Footer: React.FC = () => {
    const currentYear: number = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 px-8 py-6 mt-auto">
        <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex-none">
        <p className="text-sm text-gray-600">
            © {currentYear} DocFlow. All rights reserved.
    </p>
    </div>

    <div className="flex items-center gap-3 flex-wrap">
    <a
        href="#"
    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
        Privacy Policy
    </a>
    <span className="text-gray-300 text-sm">•</span>
    <a
    href="#"
    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
        Terms of Service
    </a>
    <span className="text-gray-300 text-sm">•</span>
    <a
    href="#"
    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
        Contact Support
    </a>
    </div>
    </div>
    </footer>
);
};

export default Footer;