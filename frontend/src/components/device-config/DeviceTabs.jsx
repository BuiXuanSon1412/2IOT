import React, { useState } from 'react';

export default function DeviceTabs({ tabs }) {
  const [active, setActive] = useState(Object.keys(tabs)[0]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 border-b border-gray-200">
        {Object.keys(tabs).map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-2 px-1 font-medium transition ${active === tab
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-800'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>{tabs[active]}</div>
    </div>
  );
}
