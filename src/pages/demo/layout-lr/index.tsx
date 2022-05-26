// 左右布局页面
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import {} from '@cffe/h2o-design';
import PageContainer from '@/components/page-container';
import { CardRowGroup, ContentCard } from '@/components/vc-page-content';

// export default function DemoPageLr() {
//   return (
//     <PageContainer>
//       <CardRowGroup>
//         <CardRowGroup.SlideCard width={200}>LEFT</CardRowGroup.SlideCard>
//         <ContentCard>RIGHT</ContentCard>
//       </CardRowGroup>
//     </PageContainer>
//   );
// }
class App extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      count: 1,
    };
  }

  handleClick = () => {
    setTimeout(() => {
      // this.setState({ number:this.state.count+1 })
      console.log(this.state);
    }, 1000);
  };

  render() {
    return <div></div>;
  }
}
