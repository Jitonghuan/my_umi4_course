import { ReactNode } from 'react';

export interface IProps {
  children: ReactNode;
  location: {
    pathname: string;
    query: {
      id: string;
      isClient: string;
      isContainClient: string;
      appType: string;
    };
  };
  route: {
    name: string;
  };
}
