import { StateConfig } from '../types/state';

export const stateConfigs: Record<string, StateConfig> = {
  KA: {
    stateCode: 'KA',
    stateName: 'Karnataka',
    mapUrl: 'src/assets/Map.svg',
    leftLogoUrl: 'src/assets/icons/Seal_of_Karnataka 1.svg',
    rightLogoUrl: 'src/assets/icons/NHM PNG Logo.svg',
    nodalOfficer: 'Dr. Khanna, IAS (AMD-NHM)',
    helplineNumber: '+91-9999999999',
    email: 'HealthOfficials@karnataka.gov.in'
  },
  MH: {
    stateCode: 'MH',
    stateName: 'Maharashtra',
    mapUrl: '/src/assets/maps/maharashtra-map.svg',
    leftLogoUrl: '/src/assets/logos/maharashtra-left.svg',
    rightLogoUrl: 'src/assets/icons/NHM PNG Logo.svg',
    nodalOfficer: 'Dr. Sharma, IAS (AMD-NHM)',
    helplineNumber: '+91-8888888888',
    email: 'HealthOfficials@maharashtra.gov.in'
  },
  RJ: {
    stateCode: 'RJ',
    stateName: 'Rajasthan',
    mapUrl: 'src/assets/Map.png',
    leftLogoUrl: 'src/assets/left.png ',
    rightLogoUrl: 'src/assets/icons/NHM PNG Logo.svg',
    nodalOfficer: 'Dr. Rajesh, IAS (AMD-NHM)',
    helplineNumber: '+91-7777777777',
    email: 'HealthOfficials@rajasthan.gov.in'
  },
};

export const getStateConfig = (stateCode: string): StateConfig => {
  return stateConfigs[stateCode.toUpperCase()] || stateConfigs.KA; 
};