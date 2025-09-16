/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const BrandSparkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a12.06 12.06 0 0 1-4.5 0m3.75 2.311a12.063 12.063 0 0 1-4.5 0M9.75 6.75h4.5M9.75 6.75a1.5 1.5 0 0 1-1.5-1.5V3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v1.875a1.5 1.5 0 0 1-1.5 1.5M9.75 6.75h4.5" />
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-8 border-b border-gray-700 bg-gray-800/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-center gap-3">
          <BrandSparkIcon className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold tracking-tight text-gray-100">
            BrandSpark
          </h1>
      </div>
    </header>
  );
};

export default Header;