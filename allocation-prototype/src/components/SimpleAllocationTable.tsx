import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SimpleAllocationItem {
  id: string;
  name: string;
  consumption: number;
  renewableEnergy: number;
}

interface SimpleAllocationTableProps {
  title: string;
  items: SimpleAllocationItem[];
  onRenewableEnergyChange: (itemId: string, percentage: number) => void;
}

export const SimpleAllocationTable: React.FC<SimpleAllocationTableProps> = ({
  title,
  items,
  onRenewableEnergyChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatNumber = (num: number): string => {
    return (num / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 });
  };

  return (
    <Card className="mb-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th 
                className="py-4 px-4 text-left font-semibold cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  {title}
                </div>
              </th>
              <th className="py-4 px-4 text-left font-semibold w-0 whitespace-nowrap">
                Consumption covered by renewables
              </th>
            </tr>
          </thead>
          {isExpanded && (
            <tbody>
              {items.map((item) => {
                const percentage = item.consumption > 0
                  ? (item.renewableEnergy / item.consumption) * 100
                  : 0;

                return (
                  <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 pl-12">
                      <span className="font-medium">{item.name}</span>
                    </td>

                    <td className="py-3 px-4 w-0">
                      <div className="flex items-center gap-3">
                        {/* Stats with fixed width */}
                        <div 
                          className="flex flex-col items-start"
                          style={{ width: '180px' }}
                        >
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(item.renewableEnergy)} MWh
                          </span>
                          <span className="text-xs text-muted-foreground">
                            of {formatNumber(item.consumption)} MWh consumed
                          </span>
                        </div>

                        {/* Slider */}
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="0.1"
                          value={percentage}
                          onChange={(e) => onRenewableEnergyChange(item.id, parseFloat(e.target.value))}
                          className="range-slider"
                          style={{
                            width: '200px',
                            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percentage}%, hsl(var(--muted)) ${percentage}%, hsl(var(--muted)) 100%)`
                          }}
                        />

                        {/* Input */}
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={percentage.toFixed(1)}
                          onChange={(e) => onRenewableEnergyChange(item.id, parseFloat(e.target.value) || 0)}
                          className="w-24 text-right border border-input rounded px-2 py-1 text-sm"
                        />
                        <span className="text-sm text-muted-foreground w-8">%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </Card>
  );
};

