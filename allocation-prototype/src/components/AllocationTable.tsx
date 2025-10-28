import React, { useState } from 'react';
import { Entity, EntityLevel, AllocationStrategy } from '@/types/allocation';
import { AllocationRow } from './AllocationRow';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AllocationTableProps {
  data: Entity | Entity[];
  enabledLevels: Set<EntityLevel>;
  onAllocationChange: (entityId: string, strategy: AllocationStrategy, values?: Record<string, number>) => void;
  onRenewableEnergyChange: (entityId: string, percentage: number) => void;
}

export const AllocationTable: React.FC<AllocationTableProps> = ({
  data,
  enabledLevels,
  onAllocationChange,
  onRenewableEnergyChange,
}) => {
  const entities = Array.isArray(data) ? data : [data];
  const [isExpanded, setIsExpanded] = useState(true);

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
                  Entity
                </div>
              </th>
              <th className="py-4 px-4 text-left font-semibold w-0 whitespace-nowrap">Consumption covered by renewables</th>
            </tr>
          </thead>
          {isExpanded && (
            <tbody>
              {entities.map((entity) => (
                <AllocationRow
                  key={entity.id}
                  entity={entity}
                  depth={0}
                  enabledLevels={enabledLevels}
                  onAllocationChange={onAllocationChange}
                  onRenewableEnergyChange={onRenewableEnergyChange}
                />
              ))}
            </tbody>
          )}
        </table>
      </div>
    </Card>
  );
};

