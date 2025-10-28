import { Entity } from '@/types/allocation';

export const mockCompanyData: Entity = {
  id: 'company-1',
  name: 'GreenTech Industries',
  level: 'company',
  consumption: 50000000,
  renewableEnergy: 50000000, // Set to max (100% of consumption)
  allocation: {
    strategy: 'balanced',
  },
  children: [
    {
      id: 'region-americas',
      name: 'Americas',
      level: 'region',
      consumption: 25000000,
      renewableEnergy: 25000000,
      allocation: {
        strategy: 'balanced',
      },
      children: [
        {
          id: 'country-usa',
          name: 'United States',
          level: 'country',
          consumption: 20000000,
          renewableEnergy: 20000000,
          allocation: {
            strategy: 'balanced',
          },
          children: [
            {
              id: 'state-california',
              name: 'California',
              level: 'state',
              consumption: 8000000,
              renewableEnergy: 8000000,
              allocation: {
                strategy: 'balanced',
              },
              children: [
                {
                  id: 'city-san-francisco',
                  name: 'San Francisco',
                  level: 'city',
                  consumption: 5000000,
                  renewableEnergy: 5000000,
                  allocation: {
                    strategy: 'balanced',
                  },
                  children: [
                    {
                      id: 'facility-sf-hq',
                      name: 'Headquarters',
                      level: 'facility',
                      consumption: 3000000,
                      renewableEnergy: 3000000,
                      allocation: {
                        strategy: 'balanced',
                      },
                      children: [
                        {
                          id: 'resource-sf-hq-prod-line-1',
                          name: 'Production Line 1',
                          level: 'resource',
                          consumption: 1200000,
                          renewableEnergy: 1200000,
                        },
                        {
                          id: 'resource-sf-hq-office',
                          name: 'Office Building',
                          level: 'resource',
                          consumption: 1000000,
                          renewableEnergy: 1000000,
                        },
                        {
                          id: 'resource-sf-hq-datacenter',
                          name: 'Data Center',
                          level: 'resource',
                          consumption: 800000,
                          renewableEnergy: 800000,
                        },
                      ],
                    },
                    {
                      id: 'facility-sf-warehouse',
                      name: 'Warehouse A',
                      level: 'facility',
                      consumption: 2000000,
                      renewableEnergy: 2000000,
                      children: [
                        {
                          id: 'resource-sf-wh-meter-1',
                          name: 'Main Meter',
                          level: 'resource',
                          consumption: 1200000,
                          renewableEnergy: 1200000,
                        },
                        {
                          id: 'resource-sf-wh-meter-2',
                          name: 'HVAC System',
                          level: 'resource',
                          consumption: 800000,
                          renewableEnergy: 800000,
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'city-los-angeles',
                  name: 'Los Angeles',
                  level: 'city',
                  consumption: 3000000,
                  renewableEnergy: 3000000,
                  children: [
                    {
                      id: 'facility-la-plant',
                      name: 'Manufacturing Plant',
                      level: 'facility',
                      consumption: 3000000,
                      renewableEnergy: 3000000,
                      children: [
                        {
                          id: 'resource-la-prod-line-1',
                          name: 'Production Line 1',
                          level: 'resource',
                          consumption: 1500000,
                          renewableEnergy: 1500000,
                        },
                        {
                          id: 'resource-la-prod-line-2',
                          name: 'Production Line 2',
                          level: 'resource',
                          consumption: 1500000,
                          renewableEnergy: 1500000,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'state-texas',
              name: 'Texas',
              level: 'state',
              consumption: 7000000,
              renewableEnergy: 7000000,
              children: [
                {
                  id: 'city-austin',
                  name: 'Austin',
                  level: 'city',
                  consumption: 7000000,
                  renewableEnergy: 7000000,
                  children: [
                    {
                      id: 'facility-austin-tech',
                      name: 'Tech Campus',
                      level: 'facility',
                      consumption: 7000000,
                      renewableEnergy: 7000000,
                      children: [
                        {
                          id: 'resource-austin-server-room',
                          name: 'Server Room',
                          level: 'resource',
                          consumption: 4000000,
                          renewableEnergy: 4000000,
                        },
                        {
                          id: 'resource-austin-labs',
                          name: 'Research Labs',
                          level: 'resource',
                          consumption: 3000000,
                          renewableEnergy: 3000000,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'state-new-york',
              name: 'New York',
              level: 'state',
              consumption: 5000000,
              renewableEnergy: 5000000,
              children: [
                {
                  id: 'city-new-york-city',
                  name: 'New York City',
                  level: 'city',
                  consumption: 5000000,
                  renewableEnergy: 5000000,
                  children: [
                    {
                      id: 'facility-nyc-office',
                      name: 'Regional Office',
                      level: 'facility',
                      consumption: 5000000,
                      renewableEnergy: 5000000,
                      children: [
                        {
                          id: 'resource-nyc-floors-1-10',
                          name: 'Floors 1-10',
                          level: 'resource',
                          consumption: 3000000,
                          renewableEnergy: 3000000,
                        },
                        {
                          id: 'resource-nyc-floors-11-20',
                          name: 'Floors 11-20',
                          level: 'resource',
                          consumption: 2000000,
                          renewableEnergy: 2000000,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'country-canada',
          name: 'Canada',
          level: 'country',
          consumption: 5000000,
          renewableEnergy: 5000000,
          children: [
            {
              id: 'state-ontario',
              name: 'Ontario',
              level: 'state',
              consumption: 5000000,
              renewableEnergy: 5000000,
              children: [
                {
                  id: 'city-toronto',
                  name: 'Toronto',
                  level: 'city',
                  consumption: 5000000,
                  renewableEnergy: 5000000,
                  children: [
                    {
                      id: 'facility-toronto-dist',
                      name: 'Distribution Center',
                      level: 'facility',
                      consumption: 5000000,
                      renewableEnergy: 5000000,
                      children: [
                        {
                          id: 'resource-toronto-warehouse',
                          name: 'Main Warehouse',
                          level: 'resource',
                          consumption: 3000000,
                          renewableEnergy: 3000000,
                        },
                        {
                          id: 'resource-toronto-cold-storage',
                          name: 'Cold Storage',
                          level: 'resource',
                          consumption: 2000000,
                          renewableEnergy: 2000000,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'region-europe',
      name: 'Europe',
      level: 'region',
      consumption: 15000000,
      renewableEnergy: 15000000,
      children: [
        {
          id: 'country-germany',
          name: 'Germany',
          level: 'country',
          consumption: 8000000,
          renewableEnergy: 8000000,
          children: [
            {
              id: 'state-bavaria',
              name: 'Bavaria',
              level: 'state',
              consumption: 8000000,
              renewableEnergy: 8000000,
              children: [
                {
                  id: 'city-munich',
                  name: 'Munich',
                  level: 'city',
                  consumption: 8000000,
                  renewableEnergy: 8000000,
                  children: [
                    {
                      id: 'facility-munich-factory',
                      name: 'Manufacturing Facility',
                      level: 'facility',
                      consumption: 8000000,
                      renewableEnergy: 8000000,
                      children: [
                        {
                          id: 'resource-munich-assembly',
                          name: 'Assembly Line',
                          level: 'resource',
                          consumption: 5000000,
                          renewableEnergy: 5000000,
                        },
                        {
                          id: 'resource-munich-testing',
                          name: 'Testing Facility',
                          level: 'resource',
                          consumption: 3000000,
                          renewableEnergy: 3000000,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'country-france',
          name: 'France',
          level: 'country',
          consumption: 7000000,
          renewableEnergy: 7000000,
          children: [
            {
              id: 'state-ile-de-france',
              name: 'Île-de-France',
              level: 'state',
              consumption: 7000000,
              renewableEnergy: 7000000,
              children: [
                {
                  id: 'city-paris',
                  name: 'Paris',
                  level: 'city',
                  consumption: 7000000,
                  renewableEnergy: 7000000,
                  children: [
                    {
                      id: 'facility-paris-office',
                      name: 'European HQ',
                      level: 'facility',
                      consumption: 7000000,
                      renewableEnergy: 7000000,
                      children: [
                        {
                          id: 'resource-paris-main-building',
                          name: 'Main Building',
                          level: 'resource',
                          consumption: 4000000,
                          renewableEnergy: 4000000,
                        },
                        {
                          id: 'resource-paris-annex',
                          name: 'Annex Building',
                          level: 'resource',
                          consumption: 3000000,
                          renewableEnergy: 3000000,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'region-asia',
      name: 'Asia Pacific',
      level: 'region',
      consumption: 10000000,
      renewableEnergy: 10000000,
      children: [
        {
          id: 'country-japan',
          name: 'Japan',
          level: 'country',
          consumption: 6000000,
          renewableEnergy: 6000000,
          children: [
            {
              id: 'state-tokyo',
              name: 'Tokyo Prefecture',
              level: 'state',
              consumption: 6000000,
              renewableEnergy: 6000000,
              children: [
                {
                  id: 'city-tokyo',
                  name: 'Tokyo',
                  level: 'city',
                  consumption: 6000000,
                  renewableEnergy: 6000000,
                  children: [
                    {
                      id: 'facility-tokyo-rnd',
                      name: 'R&D Center',
                      level: 'facility',
                      consumption: 6000000,
                      renewableEnergy: 6000000,
                      children: [
                        {
                          id: 'resource-tokyo-lab-1',
                          name: 'Laboratory 1',
                          level: 'resource',
                          consumption: 3500000,
                          renewableEnergy: 3500000,
                        },
                        {
                          id: 'resource-tokyo-lab-2',
                          name: 'Laboratory 2',
                          level: 'resource',
                          consumption: 2500000,
                          renewableEnergy: 2500000,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'country-singapore',
          name: 'Singapore',
          level: 'country',
          consumption: 4000000,
          renewableEnergy: 4000000,
          children: [
            {
              id: 'state-singapore',
              name: 'Singapore',
              level: 'state',
              consumption: 4000000,
              renewableEnergy: 4000000,
              children: [
                {
                  id: 'city-singapore',
                  name: 'Singapore',
                  level: 'city',
                  consumption: 4000000,
                  renewableEnergy: 4000000,
                  children: [
                    {
                      id: 'facility-singapore-hub',
                      name: 'Asia Pacific Hub',
                      level: 'facility',
                      consumption: 4000000,
                      renewableEnergy: 4000000,
                      children: [
                        {
                          id: 'resource-singapore-office',
                          name: 'Office Space',
                          level: 'resource',
                          consumption: 2000000,
                          renewableEnergy: 2000000,
                        },
                        {
                          id: 'resource-singapore-datacenter',
                          name: 'Regional Data Center',
                          level: 'resource',
                          consumption: 2000000,
                          renewableEnergy: 2000000,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

