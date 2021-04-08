import React from 'react';

export interface IFEContent extends globalConfig {
  breadcrumbMap: any;
}

export default React.createContext<IFEContent>({
  title: '',
  favicon: '',
  logo: '',
  copyright: '',
  breadcrumbMap: {},
});
