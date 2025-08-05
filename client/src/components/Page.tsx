import React, {type ReactNode} from 'react';
interface PageProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

export default function Page({ title, children, className = '' }: PageProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      </div>

      {/* Page Content */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
} 