## 项目说明：

#### 启动

```shell
yarn 
yarn dev
```

#### 重构计划

- 基础设施更新
- 示例代码，单独封装到一个example目录里面
- 抽离拖拽组件，降低耦合度，使用封装好的拖拽组件，进行处理
- 增加自定义增删列功能，也就是说，用户可以直接在界面操作增加列，减少列
- 单元格配置化封装，增强单元格的扩展能力和想象力
- 支持基础表格显示，增加简单表格的使用场景
- 支持纯数据结构的参数传入，生成表格，降低使用难度
- 支持css全局变量，进行样式调整
- 开发专业的国际化项目文档站点

#### 功能特点

- 表格渲染，使用虚拟列表，支持滚动分页请求数据。
- 滚动分页的触发位置，支持自定义。
- 每个表头的单元格，自定义渲染
- 每个列的单元格，自定义单独渲染, 函数渲染，返回参数：行数据、行索引。
- 支持排序组件，自定义渲染，多列排序，支持主动开启关闭。
- 支持筛选组件，自定义渲染，多列筛选，支持主动开启关闭。
- 表头宽度，可拖拽，支持自定义默认宽度, 支持关闭拖拽
- 表格支持，行在滚动的时候，渲染不一样的内容
- 表格行高，表头行高，都支持自定义高度
- 文字布局，支持设置，左对齐和居中对齐
- 支持表头行的样式自定义
- 支持表格行的样式自定义，使用函数渲染，返回参数：行索引。
- 表头列的顺序支持拖拽变更，支持开关该功能
- 支持行选中，行反选，全部选中，全部反选。支持主动启用关闭该功能。
- 支持分别或同时锁定左右 n 列，传参数生效。
- 表格支持，顶部 n 列锁定，传参数生效。
- 支持自定义空态图渲染，传参数生效。
- 表格支持多行标题，传参数生效。（注: 多行之间的列存在上下级的树形关系，列拖拽不能跨越父分支）。
- 表格支持行点击事件，传参数生效。
- 支持分组展示，需要自己在外部定义渲染逻辑。

#### 开发资源

- [icons](https://icons.bootcss.com/)
- [ui](https://www.material-tailwind.com/)