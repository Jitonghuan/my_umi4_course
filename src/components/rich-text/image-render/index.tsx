import React from 'react';
import { Image } from 'antd';
import { IRenderElementProps, useSelected, useSonaContext } from '@cffe/sona';
import './index.less';

const prefix = 'sona-editor-img';

export interface SonaContext {
  $readOnly: boolean;
  $changeReadOnly: (value: boolean) => void;
  $effectRender: number;
  $forceRender: () => void;
}

export const cls = (...rest: any[]): string => {
  const classes = [];

  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    // eslint-disable-next-line no-continue
    if (!arg) continue;

    const argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = cls(...arg);
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (argType === 'object') {
      if (arg.toString === Object.prototype.toString) {
        Object.keys(arg).forEach((key) => {
          if (arg[key]) {
            classes.push(key);
          }
        });
      } else {
        classes.push(arg.toString());
      }
    }
  }

  return classes.join(' ');
};

interface IProps {
  url?: string;
}

export default ({ element, attributes, children }: IRenderElementProps) => {
  const { props = {} } = element;
  const { url } = props as IProps;
  const selected = useSelected();

  const sona = useSonaContext<SonaContext>();
  const { $readOnly } = sona;

  return (
    <div {...attributes} className={`${prefix}-wrap`}>
      <Image
        className={cls({ [prefix]: !$readOnly }, { [`${prefix}-selected`]: selected && !$readOnly })}
        // contentEditable={false}
        src={url}
        width={120}
        // alt="图片"
        // style={{ width: '50%' }}
      />
      {children}
    </div>
  );
};
