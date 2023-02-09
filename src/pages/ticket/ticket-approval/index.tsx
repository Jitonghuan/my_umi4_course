import React, { useRef} from 'react';
import PageContainer from '@/components/page-container';
import './index.less'
const TicketApproval=()=>{
    const frameRef = useRef<any>();
    const hideSlideMenu = () => {
        document?.getElementsByTagName('iframe')?.[0]?.contentWindow?.postMessage({ showMenu: false }, '*');
        // setTimeout(() => {
        //   setIframeLoading(true);
        // }, 800);
      };
    
    return(
        <PageContainer>
             <iframe 
             ref={frameRef}
             className="ticket-iframe"
             id="ticket-iframe"
             name="ticket-iframe-detail"
             src={"http://c2f.ace.cfuture.shop/ace/user/WorkOrderListAssignment?appCode=OPS&pageCode=WorkOrderListAssignment&modelCode=WorkOrder&menuId=51433"} 
             frameBorder="0"
            //  onLoad={hideSlideMenu}
             ></iframe>
        </PageContainer>
    )

}
export default TicketApproval;