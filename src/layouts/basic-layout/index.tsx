import { useMemo, useState, useEffect } from 'react';
import { ConfigProvider } from '@cffe/h2o-design';
import zhCN from 'antd/lib/locale/zh_CN';
import { BasicLayout } from '@cffe/layout';
import 'antd/dist/antd.variable.min.css';
import PositionSwitcher, { UserPositionProps } from '@hbos/component-position-switcher';
import { ChartsContext } from '@cffe/fe-datav-components';
import '@arco-design/web-react/dist/css/arco.css';
import { useSize, useDebounce } from '@umijs/hooks';
import { WaterMark } from '@ant-design/pro-layout';
import appConfig from '@/app.config';
import { DFSFunc } from '@/utils';
import { IconMap } from '@/components/vc-icons';
import AllMessage from '@/components/all-message';
import {
  FeContext,
  useDocumentTitle,
  usePermissionData,
  useCategoryData,
  useBusinessData,
  useStaffOrgData,
  useChooseDept,
  useStaffDepData,
  useQueryUnreadNum,
  useQueryStemNoticeList,
  useReadList,
  getMatrixEnvConfig,
} from '@/common/hooks';
import './index.less';
import 'antd/dist/antd.variable.min.css';

// 屏蔽掉 React Development 模式下红色的警告
if (appConfig.isLocal) {
  const oldError = console.error.bind(console);
  console.error = (...args: string[]) => {
    if (args?.find((n) => n?.includes?.('Warning: '))) {
      return console.log('%c[React Warning] ', 'color:orange', args?.[0]);
    }
    oldError(...args);
  };
}
export default function Layout(props: any) {
  // 初始化 doc title hook
  useDocumentTitle('', props?.location?.pathname);
  // 权限数据
  const [permissionData] = usePermissionData();
  // 所属数据
  const [categoryData] = useCategoryData();
  // 业务线
  const [businessData] = useBusinessData();
  let userInfo = JSON.parse(localStorage.getItem('USER_INFO') || '{}');

  const [userPosition, setUserPosition] = useState<UserPositionProps>({
    orgId: userInfo?.orgId,
    // campusId: 2000001,
    deptId: userInfo?.deptInfo?.deptId,
  });
  //所属机构数据
  const [staffOrgData, loadStaffOrgData] = useStaffOrgData();
  const [chooseDept] = useChooseDept();
  const [staffDepData, loadStaffDepData] = useStaffDepData();
  const [unreadNum, loadUnreadNum] = useQueryUnreadNum();
  const [stemNoticeListData, loadStemNoticeList] = useQueryStemNoticeList();
  const [getReadList] = useReadList();
  const [matrixConfigInfo, setMatrixConfigInfo] = useState<any>({});
  const [style, setStyle] = useState<any>('matrixLight');
  // 页面图表宽度自动适配
  const [{ width }] = useSize(() => document.querySelector(`.vc-layout-inner`) as HTMLElement);
  const effectResize = useDebounce(width, 100);
  const [posVisible, setPosVisible] = useState<boolean>(false);
  const [allMessageMode, setAllMessageMode] = useState<EditorMode>('HIDE');
  const [initFlg, setInitFlg] = useState(false);
  const isPageInIFrame = () => window.self !== window.top;
  const oneKeyRead = (idsArry: any) => {
    getReadList(idsArry).then((res) => {
      loadUnreadNum();
      loadStemNoticeList();
    });
  };

  async function getConfig() {
    const res = await getMatrixEnvConfig();
    console.log('res-->',res)
    setMatrixConfigInfo(res);
     // @ts-ignore
     window.matrixConfigData = res 
    setInitFlg(true);
  }

  useEffect(() => {
    getConfig();
  }, []);

  // 处理 breadcrumb, 平铺所有的路由
  const breadcrumbMap = useMemo(() => {
    const map = {} as Record<string, any>;
    DFSFunc(props.routes, 'routes', (node) => (map[node.path] = node));
    return map;
  }, [props.routes]);

  useEffect(() => {
    if (unreadNum !== 0) {
      loadStemNoticeList();
    }
  }, [unreadNum]);
  useEffect(()=>{
    const localstorageTheme = JSON.parse(localStorage.getItem('__matrix_theme') || '{}');
    if(localstorageTheme==="matrixDark"){
      setStyle('matrixDark');
      document.body.setAttribute('matrix-theme', 'matrixDark');
      document.body.setAttribute('arco-theme', 'dark');
    }else{
      setStyle('globalLight');
      document.body.removeAttribute('matrix-theme');
      document.body.setAttribute('arco-theme', 'light');
    }

  },[])

  //切换所属机构
  const onOrgChange = (orgId: any, defaultCampusId?: any, defaultDeptId?: any) => {
    //请求所属部门数据
    // @ts-ignore
    if (window.matrixConfigData?.domainName) {
      loadStaffDepData(orgId);
    }
  };

  //切换部门确认
  const onPositionSubmit = (data: UserPositionProps) => {
    chooseDept(data.deptId);
    setPosVisible(false);
    setUserPosition({
      orgId: data?.orgId,
      deptId: data.deptId,
    });
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };
  let deptitle = { modal_title: '切换部门' };
  ConfigProvider.config({
    theme: {
      primaryColor: '#3591ff'
    },
  });

  const changeTheme = () => {
    if (style == 'matrixDark') {
      setStyle('globalLight');
      localStorage.setItem('__matrix_theme', JSON.stringify('globalLight') );
      document.body.removeAttribute('matrix-theme');

      document.body.setAttribute('arco-theme', 'light');
    } else {
      setStyle('matrixDark');
      localStorage.setItem('__matrix_theme', JSON.stringify('matrixDark') );
      document.body.setAttribute('matrix-theme', 'matrixDark');
      document.body.setAttribute('arco-theme', 'dark');
    }
  };
  return (
    <ConfigProvider locale={zhCN} >
      <AllMessage
        mode={allMessageMode}
        allData={stemNoticeListData}
        onClose={() => {
          setAllMessageMode('HIDE');
        }}
        unreadNum={unreadNum}
        loadStemNoticeList={loadStemNoticeList}
        loadUnreadNum={loadUnreadNum}
      />
      <PositionSwitcher
        propsTitle={{
          modal_title: '切换部门',
        }}
        visible={posVisible}
        userPosition={userPosition} //用户当前所在的机构、院区、科室或者部门
        orgData={staffOrgData} //机构数据
        // campusData={[]}
        deptData={staffDepData} //科室｜|部门数据
        onOrgChange={onOrgChange} //选择机构触发
        // onCampusChange={onCampusChange}
        onSubmit={onPositionSubmit}
        onCancel={() => setPosVisible(false)}
      />
      <WaterMark content={matrixConfigInfo?.waterMarkName} zIndex={0} fontSize={22} fontColor="#B0C4DE2B">
        <FeContext.Provider
          value={{
            breadcrumbMap,
            isOpenPermission: appConfig.isOpenPermission,
            permissionData,
            businessData,
            categoryData,
            matrixConfigData: matrixConfigInfo,
          }}
        >
          <ChartsContext.Provider value={{ effectResize }}>
            {initFlg && (
              <BasicLayout
                {...(props as any)}
                isOpenLogin={true}
                className='test'
                layout='LTB'
                pagePrefix={appConfig.pagePrefix}
                siderMenuProps={{
                  isOpenPermission: appConfig.isOpenPermission,
                  permissionData,
                  IconMap,
                  title: (
                    <>
                      <div className="matrix-title">
                        <img src={appConfig.logo}
                          style={{ marginRight: '5px', height: 45, width: 45 }}
                          onClick={() => {
                            props.history.push('/matrix/index');
                          }}
                        />
                        <div className='matrix-title-matrix'>{appConfig.title}</div>
                        <div className='matrix-title-env'>{matrixConfigInfo?.LogoName}</div>
                      </div>
                    </>
                  ),
                }}
                showHeader={!isPageInIFrame()}
                showSiderMenu={!isPageInIFrame()}
                headerProps={{
                  // env: getEnv(),
                  defaultTitle: appConfig.title,
                  userApi: `${matrixConfigInfo?.domainName}/kapi/apex-sso/getLoginUserInfo`,
                  logoutApi: `${matrixConfigInfo?.domainName}/kapi/apex-sso/logout`,
                  loginUrl:  `${matrixConfigInfo?.domainName}/login`,
                  onClickPosition: () => {
                    setPosVisible(true);
                    // @ts-ignore
                    if (window.matrixConfigData?.domainName) {
                      loadStaffOrgData();
                    }
                    setUserPosition({
                      orgId: userInfo?.orgId,
                      // campusId: 2000001,
                      deptId: userInfo.deptInfo.deptId,
                    });
                  },
                  notification: {
                    count: unreadNum,
                    data: stemNoticeListData,
                    onClickMsgEntry: (id: number, msg: any) => {
                      setAllMessageMode('VIEW');
                      oneKeyRead([id]);

                      return <a href={`'#'+${msg.systemNoticeId}`}>{msg.title}</a>;
                    },
                    onClickAllMsg: () => {
                      setAllMessageMode('VIEW');
                    },
                    render: (active: boolean, setActive: (status: boolean) => void) => {
                      <h3>一共{unreadNum}条数据</h3>;
                    },
                  },
                  extensions: [
                    {
                      iconName: 'AlertOutlined',
                      iconType: 'antd',
                      type: 'customize',
                      content: () => {
                        changeTheme();
                      },
                    },
                  ],
                  title: (<></>),
                  // title: (
                  //   <>
                  //     <div className="matrix-title">
                  //       <span>
                  //         <img src={appConfig.logo} style={{ marginRight: '5px', height: 30, width: 30 }} />

                  //         {appConfig.title}
                  //         {matrixConfigInfo?.LogoName}
                  //       </span>
                  //     </div>
                  //   </>
                  // ),
                  positionText: '部门',
                  isShowGlobalMenu: false,
                }}
              />
            )}
          </ChartsContext.Provider>
        </FeContext.Provider>
      </WaterMark>
    </ConfigProvider>
  );
}
