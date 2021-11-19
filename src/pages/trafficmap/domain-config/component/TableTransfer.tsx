/*
 * @Author: shixia.ds
 * @Date: 2021-11-19 15:09:54
 * @Description:
 */
import { Transfer, Table, Select, Button } from 'antd';
import difference from 'lodash/difference';

interface IProp {
  leftColumns: any;
  rightColumns: any;
  [x: string]: any;
}

// Customize Table Transfer
const TableTransfer: React.FC<IProp> = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection = {
        getCheckboxProps: (item: any) => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected: boolean, selectedRows: any[]) {
          const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }: { key: any }, selected: boolean) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems as any[]}
          showHeader={false}
          size="small"
          style={{ pointerEvents: listDisabled ? 'none' : void 0 }}
          onRow={
            direction === 'left'
              ? ({ key }) => ({
                  onClick: () => {
                    if (listDisabled) return;
                    onItemSelect(key, !listSelectedKeys.includes(key));
                  },
                })
              : undefined
          }
          pagination={false}
        ></Table>
      );
    }}
  </Transfer>
);
export default TableTransfer;
