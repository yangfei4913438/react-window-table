import type { Meta, StoryObj } from '@storybook/react';

import { options } from '@/components/consts';
import Table from '@/components/Table';

const meta: Meta<typeof Table> = {
  title: 'Table',
  component: Table,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    fixedLeftCount: {
      name: '左边锁定多少列',
      description: '左边锁定多少列',
      defaultValue: options.fixedLeftCount,
      control: { type: 'number', min: 0, max: 10 },
    },
    fixedRightCount: {
      name: '右边锁定多少列',
      description: '右边锁定多少列',
      defaultValue: options.fixedRightCount,
      control: { type: 'number', min: 0, max: 10 },
    },
    fixedTopCount: {
      name: '顶部锁定多少行',
      description: '顶部锁定多少行',
      defaultValue: options.fixedTopCount,
      control: { type: 'number', min: 0, max: 10 },
    },
    multiTitle: {
      name: '是否显示多行标题',
      description: '是否开启多行标题',
      defaultValue: options.multiTitle,
      control: { type: 'boolean' },
    },
    showEmpty: {
      name: '是否显示空态图',
      description: '是否显示空态图',
      defaultValue: options.showEmpty,
      control: { type: 'boolean' },
    },
    showScrolling: {
      name: '是否开启滚动行渲染',
      description: '是否开启滚动行渲染',
      defaultValue: options.showScrolling,
      control: { type: 'boolean' },
    },
    canDragSortRow: {
      name: '是否启用行拖拽排序功能',
      description: '是否启用行拖拽排序功能',
      defaultValue: options.canDragSortRow,
      control: { type: 'boolean' },
    },
    canChecked: {
      name: '是否使用行选中功能',
      description: '是否使用行选中功能',
      defaultValue: options.canChecked,
      control: { type: 'boolean' },
    },
    canResize: {
      name: '是否使用列宽调整功能',
      description: '是否使用列宽调整功能',
      defaultValue: options.canResize,
      control: { type: 'boolean' },
    },
    canDragOrder: {
      name: '是否启用列头排序功能',
      description: '是否启用列头排序功能',
      defaultValue: options.canDragOrder,
      control: { type: 'boolean' },
    },
    canFilter: {
      name: '是否使用筛选功能',
      description: '是否使用筛选功能',
      defaultValue: options.canFilter,
      control: { type: 'boolean' },
    },
    canSort: {
      name: '是否使用数据排序功能',
      description: '是否使用数据排序功能',
      defaultValue: options.canSort,
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: options,
};
