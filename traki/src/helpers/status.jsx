import React from 'react';

export function getTripStatusInfo(status) {
  switch ((status || '').toString()) {
    case 'TO_DO':
    case 'SCHEDULED':
      return {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        label: 'Scheduled'
      };
    case 'IN_PROGRESS':
      return {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        label: 'In Progress'
      };
    case 'DONE':
    case 'COMPLETED':
      return {
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        label: 'Completed'
      };
    default:
      return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: null, label: (status || '').toString().replace(/_/g, ' ') };
  }
}

export function getTruckStatusInfo(status) {
  const s = (status || '').toString();
  switch (s) {
    case 'ACTIVE':
      return { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ), label: 'Active' };
    case 'MAINTENANCE':
      return { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3v2.25M14.25 3v2.25M4.5 12.75h15M6 20.25h12" /></svg>
      ), label: 'Maintenance' };
    default:
      return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ), label: 'Inactive' };
  }
}
