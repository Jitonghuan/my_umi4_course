import ResizablePro from '@/components/resiable-pro';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import LeftList from './components/left-list';
import rightTrace from './components/right-trace';
import RrightTrace from './components/right-trace';
import './index.less';

export default function TraceDetail() {
  return (
    <PageContainer>
      <ContentCard>
        <div style={{ height: '100%' }}>
          <ResizablePro
            leftComp={<LeftList></LeftList>}
            rightComp={<RrightTrace></RrightTrace>}
            leftWidth={200}
          ></ResizablePro>
        </div>
      </ContentCard>
    </PageContainer>
  );
}
