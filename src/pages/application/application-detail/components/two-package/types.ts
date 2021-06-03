import { ReactNode } from 'react';

export interface IProps {
  children: ReactNode;
  location: {
    pathname: string;
    query: {
      id: string;
      appCode: string;
      isContainClient: string;
    };
  };
  route: {
    name: string;
  };
}
