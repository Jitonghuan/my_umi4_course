import React, { useState, useEffect } from 'react';
import { Select, Input, Tree, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import OperateCaseLibModal from '../../test-case-library/oprate-case-lib-modal';
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
    updateLeftTree,
  } = props;
  const [keyword, setKeyword] = useState<string>('');
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [oprateCaseLibModalVisible, setOprateCaseLibModalVisible] = useState<boolean>(false);
  const [curChooseCate, setCurChooseCate] = useState<any>();

  useEffect(() => {
    void searchCateTreeData(rootCateId, keyword);
  }, [rootCateId, keyword]);

  useEffect(() => {
    void setSelectedKeys([cateTreeData[0]?.key]);
    void setCateId(cateTreeData[0]?.key);
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

  const handleDeleteCaseCate = (node: any) => {};

  return (
    <div className="test-workspace-test-case-left-tree">
      <div className="search-header">
        <Select
          className="case-cate-select"
          dropdownClassName="case-cate-select-dropdown"
          onChange={onCateChange}
          value={rootCateId}
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
              <div className="node-render">
                <span>{node.title}</span>
                <div className="oprate-btn-container">
                  <Button
                    type="link"
                    size="small"
                    onClick={(e) => {
                      void handleAddCaseCate(node);
                      void e.stopPropagation();
                    }}
                  >
                    新增
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    onClick={(e) => {
                      void handleEditCaseCate(node);
                      void e.stopPropagation();
                    }}
                  >
                    编辑
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    onClick={(e) => {
                      void handleDeleteCaseCate(node);
                      void e.stopPropagation();
                    }}
                  >
                    删除
                  </Button>
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
