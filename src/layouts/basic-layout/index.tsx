import { useMemo, useState, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
// import FELayout from '@cffe/vc-layout';
import { BasicLayout } from '@cffe/layout';
import PositionSwitcher, { UserPositionProps } from '@hbos/component-position-switcher';
import { ChartsContext } from '@cffe/fe-datav-components';
import { useSize, useDebounce } from '@umijs/hooks';
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

  function getEnv() {
    if (window.location.href.includes('fygs')) {
      return 'fygs';
    }
    if (window.location.href.includes('zslnyy')) {
      return 'zslnyy';
    }
    return appConfig.BUILD_ENV === 'prod' ? 'prod' : 'dev';
  }

  let LogoName = window.location.href.includes('fygs')
    ? '--富阳骨伤'
    : window.location.href.includes('zslnyy')
    ? '--中山老年医院'
    : '';

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
              env: getEnv(),
              onClickPosition: () => {
                setPosVisible(true);
                loadStaffOrgData();
                setUserPosition({
                  orgId: userInfo?.orgId,
                  // campusId: 2000001,
                  deptId: userInfo.deptInfo.deptId,
                });
              },
              title: (
                <div>
                  <img src={appConfig.logo} style={{ marginRight: '5px' }} />
                  {appConfig.title + LogoName}
                </div>
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
    </ConfigProvider>
  );
}
