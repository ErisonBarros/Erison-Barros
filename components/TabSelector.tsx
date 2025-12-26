import React from 'react';
import { PropertyType } from '../types';
import { Home, Building2, Warehouse, Map } from 'lucide-react';

interface TabSelectorProps {
  current: PropertyType;
  onChange: (type: PropertyType) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ current, onChange }) => {
  const tabs = [
    { type: PropertyType.TERRENO, icon: Map, label: 'Terreno' },
    { type: PropertyType.CASA, icon: Home, label: 'Casa' },
    { type: PropertyType.APTO, icon: Building2, label: 'Cond/Apto' },
    { type: PropertyType.COMERCIAL, icon: Warehouse, label: 'Comercial' },
  ];

  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="flex justify-between px-2 pt-2">
        {tabs.map((tab) => {
          const isActive = current === tab.type;
          const Icon = tab.icon;
          return (
            <button
              key={tab.type}
              onClick={() => onChange(tab.type)}
              className={`flex flex-col items-center justify-center w-1/4 pb-2 pt-2 border-b-2 transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
              <span className="text-[10px] font-medium uppercase tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};