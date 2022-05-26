import { Transfer, Table } from '@cffe/h2o-design';
import difference from 'lodash/difference';
import './index.less';

interface IProp {
  leftColumns: any;
  rightColumns: any;
  disabled: boolean;
  [x: string]: any;
}

// Customize Table Transfer
const TableTransfer: React.FC<IProp> = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps} className="customize-transfer">
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
        getCheckboxProps: (item: any) => ({ disabled: restProps.disabled || item.disabled }),
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
        />
      );
    }}
  </Transfer>
);
export default TableTransfer;
