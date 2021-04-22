export interface IProps {
  location: {
    pathname: string;
    query: {
      id: string;
      appCode: string;
    };
  };
  route: {
    name: string;
  };
}
