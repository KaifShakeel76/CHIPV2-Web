export interface StateConfig {
  stateCode: string;
  stateName: string;
  mapUrl?: string;
  leftLogoUrl?: string;
  rightLogoUrl?: string;
  nodalOfficer?: string;
  helplineNumber?: string;
  email?: string;
}

export interface HeaderProps {
  stateConfig?: StateConfig;
}

export interface FooterProps {
  stateConfig?: StateConfig;
}