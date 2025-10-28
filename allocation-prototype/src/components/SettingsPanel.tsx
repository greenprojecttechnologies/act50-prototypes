import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { EntityLevel, LevelToggle } from '@/types/allocation';

interface SettingsPanelProps {
  levelToggles: LevelToggle[];
  onToggleLevel: (level: EntityLevel) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  levelToggles,
  onToggleLevel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const enabledCount = levelToggles.filter(t => t.enabled).length;

  return (
    <div className="mb-6 relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-input rounded-md bg-background hover:bg-accent transition-colors"
      >
        <span className="text-sm font-medium">Entity levels shown</span>
        <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
          {enabledCount}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="p-2">
            {levelToggles.map((toggle) => (
              <label
                key={toggle.level}
                className="flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-md cursor-pointer transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleLevel(toggle.level);
                }}
              >
                <input
                  type="checkbox"
                  checked={toggle.enabled}
                  onChange={() => {}}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                />
                <span className="text-sm select-none">{toggle.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

