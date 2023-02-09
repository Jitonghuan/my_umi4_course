/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-08-09 14:46:09
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2023-02-09 15:36:13
 * @FilePath: /my_umi4_course/src/pages/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from "react";
import { Link, useSearchParams, createSearchParams, useLocation } from "umi";
import logoImg from "@/assets/umiLogo.png";
import "./index.less";

// 需要开启 svgr 配置之后才可用
// import UmiLogo from '@/assets/umi.svg';

export default () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  console.log(location);
  const a = searchParams.get("a");
  const b = searchParams.get("b");
  const exportBugs = () => {
    // void downloadRequest(exportBugList, { data: conditions }).then((res) => {
    //   const url = window.URL.createObjectURL(
    //     new Blob(
    //       [res],
    //       // 设置该文件的mime类型，这里对应的mime类型对应为.xlsx格式
    //       { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    //     ),
    //   );
    //   const link = document.createElement('a');
    //   link.href = url;
    //   // 设置下载文件名
    //   const timeStr = getCurrentTimeStr();
    //   const fileName = decodeURI('Bug导出' + timeStr);
    //   link.setAttribute('download', fileName);
    //   document.body.appendChild(link);
    //   link.click();
    // });
  };
  return (
    <div className="main">
      Index Page
      <img src={logoImg} width={150} />
      {/* <UmiLogo/> */}
      <p>
        <Link to="/user">Go to user page</Link>
      </p>
      <p>
        SearchParams ---- a:{a};b:{b}
      </p>
      <p>State ---- {JSON.stringify(location?.state)}</p>
      <button
        onClick={() => {
          setSearchParams(createSearchParams({ a: "123", b: "456" }));
        }}
      >
        Change SearchParams
      </button>
    </div>
  );
};
