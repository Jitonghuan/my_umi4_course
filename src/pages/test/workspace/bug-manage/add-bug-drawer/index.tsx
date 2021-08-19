import React, { useState, useEffect, useContext } from 'react';
import { Select, Input, Switch, Button, Table, Form, Space, Drawer } from 'antd';

export default function BugManage(props: any) {
  const { visible, setVisible } = props;

  return <Drawer visible={visible} onClose={() => setVisible(false)}></Drawer>;
}
