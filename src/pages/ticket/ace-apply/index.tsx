import React, { useRef} from 'react';
import PageContainer from '@/components/page-container';
import { UserManage } from '@cffe/fe-zero-code-solution';
import modulesMap from '@cffe/hmos-zero-code-material';
// import React from 'react';
import './index.less'
const AceTicketApply=()=>{
    const frameRef = useRef<any>();
    const hideSlideMenu = () => {
      };
    
    return(
        // <PageContainer>
        <div className="fe-hmos-nocode-user">
        <UserManage modulesMap={modulesMap} />
      </div>

          
            // <iframe 
            //  ref={frameRef}
            //  className="ticket-apply-iframe"
            //  id="ticket-iframe"
            //  name="ticket-iframe-detail"
            //  src={"http://c2f.ace.cfuture.shop/user/:10001004?appCode=OPS&pageCode=WorkOrderList&modelCode=WorkOrder&menuId=46701"} 
            //  frameBorder="0"
            // //  onLoad={hideSlideMenu}
            //  ></iframe>

          

        // </PageContainer>
    )

}
export default AceTicketApply;