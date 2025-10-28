import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Entity, EntityLevel, AllocationStrategy } from '@/types/allocation';
import { cn } from '@/lib/utils';
import { AllocationSubTable } from './AllocationSubTable';

interface AllocationRowProps {
  entity: Entity;
  depth: number;
  enabledLevels: Set<EntityLevel>;
  parentRenewableEnergy?: number;
  onAllocationChange: (entityId: string, strategy: AllocationStrategy, values?: Record<string, number>) => void;
  onRenewableEnergyChange?: (entityId: string, percentage: number) => void;
  allocationInput?: React.ReactNode;
}

export const AllocationRow: React.FC<AllocationRowProps> = ({
  entity,
  depth,
  enabledLevels,
  parentRenewableEnergy,
  onAllocationChange,
  onRenewableEnergyChange,
  allocationInput,
}) => {
  const indentPx = depth * 24;
  
  // Check if entity has any visible children based on enabled levels
  const getVisibleChildren = (children: Entity[]): Entity[] => {
    const visible: Entity[] = [];
    
    for (const child of children) {
      if (enabledLevels.has(child.level)) {
        visible.push(child);
      } else if (child.children) {
        // Skip this level and check its children
        visible.push(...getVisibleChildren(child.children));
      }
    }
    
    return visible;
  };
  
  const hasVisibleChildren = entity.children && getVisibleChildren(entity.children).length > 0;

  // Always show percentage of own consumption
  const percentage = entity.consumption > 0
    ? (entity.renewableEnergy / entity.consumption) * 100
    : 0;
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate snap points for this entity
  const getSnapPoints = (): number[] => {
    const snapPoints: number[] = [];
    
    // Snap point 1: Make allocation among siblings correct (if we have parent info)
    if (parentRenewableEnergy && entity.consumption > 0) {
      // This would be used when we know what siblings need, but we don't have that info here
      // This snap point will be more useful in the sub-table context
    }
    
    // Snap point 2: Make allocation among children correct
    // Only add this snap point if children have manual allocation (percentage or exact)
    if (entity.children && entity.children.length > 0 && entity.allocation && 
        (entity.allocation.strategy === 'percentage' || entity.allocation.strategy === 'exact')) {
      // Get visible children and calculate their total allocation based on allocation values
      const visibleChildren = getVisibleChildren(entity.children);
      const allocationValues = entity.allocation.values || {};
      
      let childrenTotal = 0;
      if (entity.allocation.strategy === 'percentage') {
        // Sum up the MWh that would result from each child's percentage allocation
        childrenTotal = visibleChildren.reduce((sum, child) => {
          const percentage = allocationValues[child.id] || 0;
          return sum + (child.consumption * percentage) / 100;
        }, 0);
      } else if (entity.allocation.strategy === 'exact') {
        // Sum up the exact MWh allocations
        childrenTotal = visibleChildren.reduce((sum, child) => {
          return sum + (allocationValues[child.id] || 0);
        }, 0);
      }
      
      const targetPercentage = entity.consumption > 0 ? (childrenTotal / entity.consumption) * 100 : 0;
      
      if (targetPercentage >= 0 && targetPercentage <= 100) {
        snapPoints.push(targetPercentage);
      }
    }
    
    return snapPoints;
  };
  
  const applyMultiSnap = (value: number): number => {
    const snapPoints = getSnapPoints();
    const snapThreshold = 3; // ~3% threshold (6px radius on typical slider)
    
    // Find the closest snap point within threshold
    for (const snapPoint of snapPoints) {
      if (Math.abs(value - snapPoint) <= snapThreshold) {
        return snapPoint;
      }
    }
    
    return value;
  };

  const handlePercentageChange = (newPercentage: number) => {
    const snappedPercentage = applyMultiSnap(newPercentage);
    if (onRenewableEnergyChange) {
      onRenewableEnergyChange(entity.id, snappedPercentage);
    }
  };

  // Format numbers with commas and convert to MWh
  const formatNumber = (num: number): string => {
    return (num / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 });
  };

  // Get label color based on entity level
  const getLevelColor = (level: EntityLevel): string => {
    const colors: Record<EntityLevel, string> = {
      company: 'bg-purple-100 text-purple-800 border-purple-300',
      region: 'bg-blue-100 text-blue-800 border-blue-300',
      country: 'bg-green-100 text-green-800 border-green-300',
      state: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      city: 'bg-orange-100 text-orange-800 border-orange-300',
      facility: 'bg-red-100 text-red-800 border-red-300',
      resource: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[level];
  };

  const handleToggle = () => {
    if (hasVisibleChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>
      {/* Main Row */}
      <tr className="border-b hover:bg-muted/50 transition-colors">
        {/* Entity Column */}
        <td 
          className={`py-3 px-4 ${hasVisibleChildren ? 'cursor-pointer' : ''}`}
          onClick={hasVisibleChildren ? handleToggle : undefined}
        >
          <div className="flex items-center" style={{ paddingLeft: `${indentPx}px` }}>
            {hasVisibleChildren && (
              <div className="mr-2 p-1">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'px-2 py-0.5 rounded text-xs font-medium border',
                  getLevelColor(entity.level)
                )}
              >
                {entity.level}
              </span>
              <span className="font-medium">{entity.name}</span>
            </div>
          </div>
        </td>

        {/* Renewable Energy Column (merged: stats + slider + input) */}
        <td 
          className="py-3 px-4 w-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            {/* Stats with fixed width */}
            <div 
              className={`flex flex-col items-start ${hasVisibleChildren ? 'cursor-pointer' : ''}`}
              style={{ width: '180px' }}
              onClick={hasVisibleChildren ? handleToggle : undefined}
            >
              <span className="text-sm text-muted-foreground">
                {formatNumber(entity.renewableEnergy)} MWh
              </span>
              <span className="text-xs text-muted-foreground">
                of {formatNumber(entity.consumption)} MWh consumed
              </span>
            </div>

            {/* Slider + Input */}
            {allocationInput ? (
              allocationInput
            ) : (
              <>
                <div className="relative" style={{ width: '200px' }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={percentage}
                    onChange={(e) => handlePercentageChange(parseFloat(e.target.value))}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchStart={() => setIsDragging(true)}
                    onTouchEnd={() => setIsDragging(false)}
                    className="range-slider"
                    style={{
                      width: '200px',
                      background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percentage}%, hsl(var(--muted)) ${percentage}%, hsl(var(--muted)) 100%)`
                    }}
                  />
                  {/* Snap point indicators - only show while dragging */}
                  {isDragging && getSnapPoints().map((snapPoint, idx) => {
                    const isAtSnapPoint = Math.abs(percentage - snapPoint) < 0.5;
                    if (isAtSnapPoint) return null; // Don't show if slider is already at this snap point
                    
                    return (
                      <div
                        key={idx}
                        className="absolute pointer-events-none"
                        style={{ 
                          left: `calc(${snapPoint}% + 2px)`,
                          top: `calc(50% + 2px)`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      </div>
                    );
                  })}
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={percentage.toFixed(1)}
                  onChange={(e) => handlePercentageChange(parseFloat(e.target.value) || 0)}
                  className="w-24 text-right border border-input rounded px-2 py-1 text-sm"
                />
                <span className="text-sm text-muted-foreground w-8">%</span>
              </>
            )}
          </div>
        </td>
      </tr>

      {/* Sub-table for allocation strategy when expanded */}
      {isExpanded && hasVisibleChildren && (
        <tr>
          <td colSpan={2} className="p-0">
            <AllocationSubTable
              entity={entity}
              depth={depth}
              enabledLevels={enabledLevels}
              onAllocationChange={onAllocationChange}
              onRenewableEnergyChange={onRenewableEnergyChange}
            />
          </td>
        </tr>
      )}
    </>
  );
};

