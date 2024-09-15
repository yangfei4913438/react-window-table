## 项目说明：
一个基于 react-window 的全功能表单组件。

### 提示

表格可以直接在右上角 About 里面的找到链接，点击就能查看在线演示。

如果你想要下载到本地尝试，可以直接复制 `dev/demo` 这个目录下的代码到你的项目里，

但是记得更换 `dev/demo/Table.tsx` 里面的表格引入代码。

`import { VirtualTable } from 'lib';` 这行代码替换成 `import { VirtualTable } from '@yf-ui/react-window-table';`

因为这个文件是直接引用库代码的，你得改成下载的包名，也就是 `@yf-ui/react-window-table`

`import { Button } from 'ui/button';` 这行代码，换成你用的 button 组件。 

如果你还没有，当然也可以从源码里面, 直接复制 button 组件使用，路径 `lib/ui/button.tsx`，一样很方便。

还有就是，表格组件是不支持服务端渲染的。 如果要在服务端渲染组件内引入，请注意渲染成非 ssr 组件。

next 里面的非 ssr 组件引入方式。
```typescript
import dynamic from "next/dynamic";

const Tab = dynamic(() => import('./tab'), { ssr: false })
```

其他项目开始之前，准备把这个项目优化一下：

- [x] 全面移除 antd 相关代码
- [x] 引入 shadcn 相关生态
- [x] 回归传统的组件开发模式
- [x] 移除 storybook 相关代码

---

### 安装

```shell
npm install @yf-ui/react-window-table
```

或

```shell
yarn add @yf-ui/react-window-table
```

### 启动开发环境

```shell
yarn 
yarn dev
```

#### 添加 shadcn 的 ui组件

```shell
# 添加 button 组件
yarn ui button
```

执行后，button 组件的代码自动出现在 lib/ui 目录下。

> 补充说明：cva 官方提供了，常见 ide 中 tailwind 类名的正则提示支持。如果你的 ide 不支持，你可以去 cva 官网寻求支持。


---


### 重构计划

- [ ] 抽离拖拽组件，降低耦合度，使用封装好的拖拽组件，进行处理
- [ ] 增加自定义增删列功能，也就是说，用户可以直接在界面操作增加列，减少列
- [ ] 单元格配置化封装，增强单元格的扩展能力和想象力
- [ ] 支持基础表格显示，增加简单表格的使用场景
- [ ] 支持纯数据结构的参数传入，生成表格，降低使用难度
- [ ] 支持css全局变量，进行样式调整

---

### 功能特点

- [x] 表格渲染，使用虚拟列表，支持滚动分页请求数据。
- [x] 滚动分页的触发位置，支持自定义。
- [x] 每个表头的单元格，自定义渲染
- [x] 每个列的单元格，自定义单独渲染, 函数渲染，返回参数：行数据、行索引。
- [x] 支持排序组件，自定义渲染，多列排序，支持主动开启关闭。
- [x] 支持筛选组件，自定义渲染，多列筛选，支持主动开启关闭。
- [x] 表头宽度，可拖拽，支持自定义默认宽度, 支持关闭拖拽
- [x] 表格支持，行在滚动的时候，渲染不一样的内容
- [x] 表格行高，表头行高，都支持自定义高度
- [x] 文字布局，支持设置，左对齐和居中对齐
- [x] 支持表头行的样式自定义
- [x] 支持表格行的样式自定义，使用函数渲染，返回参数：行索引。
- [x] 表头列的顺序支持拖拽变更，支持开关该功能
- [x] 支持行选中，行反选，全部选中，全部反选。支持主动启用关闭该功能。
- [x] 支持分别或同时锁定左右 n 列，传参数生效。
- [x] 表格支持，顶部 n 列锁定，传参数生效。 
- [x] 支持自定义空态图渲染，传参数生效。
- [x] 表格支持多行标题，传参数生效。（注: 多行之间的列存在上下级的树形关系，列拖拽不能跨越父分支）。
- [x] 表格支持行点击事件，传参数生效。
- [x] 支持分组展示，需要自己在外部定义渲染逻辑。
- [x] 行选中，默认显示行号，hover之后显示checkbox, 自身被选中或者子元素被选中，则checkbox选项框会持续显示。

---

### 其他说明

如果大家发现什么 bug, 可以给我提 issue，看到了我会安排时间修复。

当然了，更欢迎大家给我提 pr, 如果没啥问题我就会合并的。
