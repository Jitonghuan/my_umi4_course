import { useMemo, useState } from 'react';
import { ConfigProvider } from '@cffe/h2o-design';
import zhCN from 'antd/lib/locale/zh_CN';
import { BasicLayout } from '@cffe/layout';
import { Modal, Badge } from 'antd';
import { BellFilled } from '@ant-design/icons';
import 'antd/dist/antd.variable.min.css';
import PositionSwitcher, { UserPositionProps } from '@hbos/component-position-switcher';
import { ChartsContext } from '@cffe/fe-datav-components';
import '@arco-design/web-react/dist/css/arco.css';
import { useSize, useDebounce } from '@umijs/hooks';
import { WaterMark } from '@ant-design/pro-layout';
import appConfig from '@/app.config';
import { DFSFunc } from '@/utils';
import { IconMap } from '@/components/vc-icons';
import {
  FeContext,
  useDocumentTitle,
  usePermissionData,
  useCategoryData,
  useBusinessData,
  useStaffOrgData,
  useChooseDept,
  useStaffDepData,
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
  const { fromThird } = props.location.query;

  const [userPosition, setUserPosition] = useState<UserPositionProps>({
    orgId: userInfo?.orgId,
    // campusId: 2000001,
    deptId: userInfo?.deptInfo?.deptId,
  });
  //所属机构数据
  const [staffOrgData, loadStaffOrgData] = useStaffOrgData();
  const [chooseDept] = useChooseDept();
  const [staffDepData, loadStaffDepData] = useStaffDepData();
  const [style, setStyle] = useState<any>('foneLight');

  // 处理 breadcrumb, 平铺所有的路由
  const breadcrumbMap = useMemo(() => {
    const map = {} as Record<string, any>;
    DFSFunc(props.routes, 'routes', (node) => (map[node.path] = node));
    return map;
  }, [props.routes]);

  // 页面图表宽度自动适配
  const [{ width }] = useSize(() => document.querySelector(`.vc-layout-inner`) as HTMLElement);
  const effectResize = useDebounce(width, 100);
  const [posVisible, setPosVisible] = useState<boolean>(false);

  //切换所属机构
  const onOrgChange = (orgId: any, defaultCampusId?: any, defaultDeptId?: any) => {
    //请求所属部门数据
    loadStaffDepData(orgId);
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
      primaryColor: '#1973CC',

      //#92a6bb
    },
  });

  const changeTheme = () => {
    if (style == 'foneDark') {
      setStyle('globalLight');
      document.body.removeAttribute('fone-theme');
      document.body.setAttribute('arco-theme', 'light');
    } else {
      setStyle('foneDark');
      document.body.setAttribute('fone-theme', 'foneDark');
      document.body.setAttribute('arco-theme', 'dark');
    }
  };
  return (
    <ConfigProvider locale={zhCN}>
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
      <WaterMark content={appConfig.waterMarkName} zIndex={0} fontSize={22} fontColor="#B0C4DE2B">
        <FeContext.Provider
          value={{
            breadcrumbMap,
            isOpenPermission: appConfig.isOpenPermission,
            permissionData,
            businessData,
            categoryData,
          }}
        >
          <ChartsContext.Provider value={{ effectResize }}>
            <BasicLayout
              {...(props as any)}
              isOpenLogin={true}
              pagePrefix={appConfig.pagePrefix}
              siderMenuProps={{
                isOpenPermission: appConfig.isOpenPermission,
                permissionData,
                IconMap,
              }}
              showHeader={!fromThird}
              showSiderMenu={!fromThird}
              headerProps={{
                // env: getEnv(),
                userApi: `${appConfig.apexDomainName}/kapi/apex-sso/getLoginUserInfo`,
                logoutApi: `${appConfig.apexDomainName}/kapi/apex-sso/logout`,
                loginUrl: `${appConfig.apexDomainName}/login`,
                onClickPosition: () => {
                  setPosVisible(true);
                  loadStaffOrgData();
                  setUserPosition({
                    orgId: userInfo?.orgId,
                    // campusId: 2000001,
                    deptId: userInfo.deptInfo.deptId,
                  });
                },
                notification: {
                  count: 9,
                  data: [
                    {
                      id: 1,
                      level: '',
                      title: '标题',
                    },
                  ],
                  render: (active: true) => {},
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
                  // {
                  //   iconName: 'BellFilled',
                  //   iconType: 'antd',
                  //   type: 'customize',
                  //   content: (visible, setVisible) => {
                  //     return (
                  //       <Modal visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
                  //         您当前暂无通知消息!
                  //       </Modal>
                  //     );
                  //   },
                  // },
                ],
                title: (
                  <>
                    <div className="matrix-title">
                      <span>
                        <img src={appConfig.logo} style={{ marginRight: '5px', height: 30, width: 30 }} />
                        {appConfig.title + appConfig.logoName}
                      </span>
                      {/* 
                      <span  >
                        <AlertOutlined />
                      </span> */}
                    </div>
                  </>
                ),
                positionText: '部门',
                isShowGlobalMenu: false,
                onBrandClick: () => {
                  props.history.push('/matrix/index');
                },
              }}
            />
          </ChartsContext.Provider>
        </FeContext.Provider>
      </WaterMark>
    </ConfigProvider>
  );
}
