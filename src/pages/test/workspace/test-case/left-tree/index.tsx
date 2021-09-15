import React, { useState, useEffect, useMemo } from 'react';
import { Select, Input, Tree, Space, Button, Popconfirm, message, Typography } from 'antd';
import { SearchOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { deleteCaseCategory } from '../../service';
import { postRequest } from '@/utils/request';
import OperateCaseLibModal from '../oprate-case-module-modal';
import CustomIcon from '@cffe/vc-custom-icon';
import './index.less';

const { DirectoryTree } = Tree;
const { Option } = Select;

export default function LeftTree(props: any) {
  const {
    caseCategories = [],
    cateTreeData = [],
    defaultCateId,
    searchCateTreeData,
    rootCateId,
    setRootCateId,
    cateId,
    setCateId,
    expandedKeys,
    setExpandedKeys,
  } = props;
  const [keyword, setKeyword] = useState<string>('');
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [oprateCaseLibModalVisible, setOprateCaseLibModalVisible] = useState<boolean>(false);
  const [curChooseCate, setCurChooseCate] = useState<any>();
  const [allDescendantsMap, setAllDescendantsMap] = useState<any>({});

  useEffect(() => {
    const ans: any = {};

    const dfs = (node: any): any[] => {
      const allDescendants = [node.key];
      if (node.children) {
        for (const child of node.children as any[]) {
          if (child.children?.length) void allDescendants.push(...dfs(child));
        }
      }
      ans[node.key] = [...allDescendants];
      return allDescendants;
    };

    void cateTreeData.forEach((node: any) => dfs(node));

    console.log('ans :>> ', ans);
    void setAllDescendantsMap(ans);
  }, [cateTreeData]);

  useEffect(() => {
    void searchCateTreeData(rootCateId, keyword);
  }, [rootCateId, keyword]);

  useEffect(() => {
    if (cateTreeData[0]?.key) {
      void setSelectedKeys([cateTreeData[0].key]);
      void setCateId(cateTreeData[0].key);
    }
  }, [cateTreeData]);

  const onCateChange = (val: any) => {
    if (!val) return;
    void setRootCateId(val);
  };

  const onKeywordChange = (e: any) => {
    void setKeyword(e.target.value);
  };

  const onSearch = () => {};

  const onExpand = (expandedKeysValue: React.Key[]) => {
    void setExpandedKeys(expandedKeysValue);
  };

  const onSelect = (selectedKeysValue: React.Key[]) => {
    void setSelectedKeys(selectedKeysValue);
    setCateId(selectedKeysValue);
  };

  const handleAddCaseCate = (node: any) => {
    void setCurChooseCate({
      parentId: node.id,
    });
    void setOprateCaseLibModalVisible(true);
  };

  const handleEditCaseCate = (node: any) => {
    void setCurChooseCate({
      id: node.id,
      name: node.name,
      parentId: node.parentId,
    });
    void setOprateCaseLibModalVisible(true);
  };

  const handleDeleteCaseCate = (node: any) => {
    // const loadEnd = message.loading('正在删除');
    postRequest(deleteCaseCategory + '/' + node.id).then(() => {
      // void loadEnd();
      void message.success('删除成功');
      void searchCateTreeData(rootCateId, keyword, true);
    });
  };

  const handleExpendChild = () => {
    //TODO:
  };

  return (
    <div className="test-workspace-test-case-left-tree">
      <div className="search-header">
        <Select
          className="case-cate-select"
          dropdownClassName="case-cate-select-dropdown"
          onChange={onCateChange}
          value={rootCateId.toString()}
        >
          {caseCategories.map((item: any) => (
            <Option key={item.id.toString()} value={item.id.toString()}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Input.Search
          className="case-cate-search"
          onChange={onKeywordChange}
          onPressEnter={onSearch}
          onSearch={onSearch}
          suffix={<SearchOutlined />}
        />
      </div>
      <div className="tree-container">
        <DirectoryTree
          className="custom-tree"
          treeData={cateTreeData}
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          onSelect={onSelect}
          onExpand={onExpand}
          showIcon={false}
          titleRender={(node) => {
            return (
              <div className="node-render custom-tree-node">
                <Typography.Text className="node-title" ellipsis={{ suffix: '' }}>
                  {node.title}
                </Typography.Text>
                <div className="oprate-btn-container">
                  <CustomIcon type="icon-linespace" />
                  <PlusSquareOutlined
                    onClick={(e) => {
                      void handleAddCaseCate(node);
                      void e.stopPropagation();
                    }}
                  />
                  <CustomIcon
                    type="icon-editblock"
                    onClick={(e) => {
                      void handleEditCaseCate(node);
                      void e.stopPropagation();
                    }}
                  />
                  <Popconfirm
                    title="确定要删除此测试用例库吗？"
                    onConfirm={(e) => {
                      void handleDeleteCaseCate(node);
                      void (e && e.stopPropagation());
                    }}
                    onCancel={(e) => e && e.stopPropagation()}
                  >
                    <CustomIcon type="icon-delete" onClick={(e) => e.stopPropagation()} />
                  </Popconfirm>
                </div>
              </div>
            );
          }}
        />
      </div>

      <OperateCaseLibModal
        visible={oprateCaseLibModalVisible}
        setVisible={setOprateCaseLibModalVisible}
        caseCateId={curChooseCate?.id}
        caseCateName={curChooseCate?.name}
        parentId={curChooseCate?.parentId}
        updateDatasource={() => searchCateTreeData(rootCateId, keyword, true)}
      />
    </div>
  );
}
