import{j as n}from"./jsx-runtime-d673cef9.js";import{M as r}from"./index-9f556d49.js";import{u as s}from"./index-63317901.js";import"./index-cdf295ea.js";import"./iframe-9a6205e6.js";import"../sb-preview/runtime.js";import"./index-d475d2ea.js";import"./isNativeReflectConstruct-1da304ae.js";import"./index-d37d4223.js";import"./index-9828acaf.js";import"./index-356e4a49.js";function l(i){const e=Object.assign({h2:"h2",p:"p",h4:"h4",code:"code",pre:"pre",ul:"ul",li:"li"},s(),i.components);return n.jsxs(n.Fragment,{children:[n.jsx(r,{title:"Readme"}),`
`,n.jsx(e.h2,{id:"项目说明",children:"项目说明："}),`
`,n.jsx(e.p,{children:"一个基于 react-window 的全功能表单组件。"}),`
`,n.jsx(e.h4,{id:"重要提示",children:"重要提示"}),`
`,n.jsxs(e.p,{children:[`我在仓库的项目介绍页面，放了一个演示 demo, 看上去是有一些小 'bug', 但实际是没有问题的，是环境问题。
大家可以直接安装到本地去演示，演示代码直接拷贝 `,n.jsx(e.code,{children:"stories/components"}),` 这个目录下的就行，
但是记得更换 `,n.jsx(e.code,{children:"stories/components/Table.tsx"}),` 里面的表格引入代码。
因为这个文件是直接引用库代码的，你得改成下载的包名，也就是 `,n.jsx(e.code,{children:"@yf-ui/react-window-table"})]}),`
`,n.jsx(e.p,{children:"还有就是，组件不支持服务端渲染，如果要在服务端渲染组件内引入，请注意渲染成非 ssr组件。"}),`
`,n.jsx(e.p,{children:"next 里面的非 ssr 组件引入方式。"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`import dynamic from "next/dynamic";

const Tab = dynamic(() => import('./tab'), { ssr: false })
`})}),`
`,n.jsx(e.h4,{id:"安装",children:"安装"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-shell",children:`npm install @yf-ui/react-window-table
`})}),`
`,n.jsx(e.p,{children:"或"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-shell",children:`yarn add @yf-ui/react-window-table
`})}),`
`,n.jsx(e.h4,{id:"启动开发环境",children:"启动开发环境"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-shell",children:`yarn
yarn dev
`})}),`
`,n.jsx(e.h4,{id:"重构计划",children:"重构计划"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"抽离拖拽组件，降低耦合度，使用封装好的拖拽组件，进行处理"}),`
`,n.jsx(e.li,{children:"增加自定义增删列功能，也就是说，用户可以直接在界面操作增加列，减少列"}),`
`,n.jsx(e.li,{children:"单元格配置化封装，增强单元格的扩展能力和想象力"}),`
`,n.jsx(e.li,{children:"支持基础表格显示，增加简单表格的使用场景"}),`
`,n.jsx(e.li,{children:"支持纯数据结构的参数传入，生成表格，降低使用难度"}),`
`,n.jsx(e.li,{children:"支持css全局变量，进行样式调整"}),`
`]}),`
`,n.jsx(e.h4,{id:"功能特点",children:"功能特点"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"表格渲染，使用虚拟列表，支持滚动分页请求数据。"}),`
`,n.jsx(e.li,{children:"滚动分页的触发位置，支持自定义。"}),`
`,n.jsx(e.li,{children:"每个表头的单元格，自定义渲染"}),`
`,n.jsx(e.li,{children:"每个列的单元格，自定义单独渲染, 函数渲染，返回参数：行数据、行索引。"}),`
`,n.jsx(e.li,{children:"支持排序组件，自定义渲染，多列排序，支持主动开启关闭。"}),`
`,n.jsx(e.li,{children:"支持筛选组件，自定义渲染，多列筛选，支持主动开启关闭。"}),`
`,n.jsx(e.li,{children:"表头宽度，可拖拽，支持自定义默认宽度, 支持关闭拖拽"}),`
`,n.jsx(e.li,{children:"表格支持，行在滚动的时候，渲染不一样的内容"}),`
`,n.jsx(e.li,{children:"表格行高，表头行高，都支持自定义高度"}),`
`,n.jsx(e.li,{children:"文字布局，支持设置，左对齐和居中对齐"}),`
`,n.jsx(e.li,{children:"支持表头行的样式自定义"}),`
`,n.jsx(e.li,{children:"支持表格行的样式自定义，使用函数渲染，返回参数：行索引。"}),`
`,n.jsx(e.li,{children:"表头列的顺序支持拖拽变更，支持开关该功能"}),`
`,n.jsx(e.li,{children:"支持行选中，行反选，全部选中，全部反选。支持主动启用关闭该功能。"}),`
`,n.jsx(e.li,{children:"支持分别或同时锁定左右 n 列，传参数生效。"}),`
`,n.jsx(e.li,{children:"表格支持，顶部 n 列锁定，传参数生效。"}),`
`,n.jsx(e.li,{children:"支持自定义空态图渲染，传参数生效。"}),`
`,n.jsx(e.li,{children:"表格支持多行标题，传参数生效。（注: 多行之间的列存在上下级的树形关系，列拖拽不能跨越父分支）。"}),`
`,n.jsx(e.li,{children:"表格支持行点击事件，传参数生效。"}),`
`,n.jsx(e.li,{children:"支持分组展示，需要自己在外部定义渲染逻辑。"}),`
`,n.jsx(e.li,{children:"行选中，默认显示行号，hover之后显示checkbox, 自身被选中或者子元素被选中，则checkbox选项框会持续显示。"}),`
`]}),`
`,n.jsx(e.h4,{id:"其他说明",children:"其他说明"}),`
`,n.jsx(e.p,{children:`如果大家发现什么 bug, 可以给我提 issue，看到了我会安排时间修复。不过可能没那么及时，因为我目前在做我的一个大前端博客项目，
包含了，桌面客户端，web端，移动端。`}),`
`,n.jsx(e.p,{children:"当然了，更欢迎大家给我提 pr, 如果没啥问题我就会合并的。"}),`
`,n.jsx(e.p,{children:"我也在看合适的工作机会，欢迎联系我:)"})]})}function b(i={}){const{wrapper:e}=Object.assign({},s(),i.components);return e?n.jsx(e,Object.assign({},i,{children:n.jsx(l,i)})):l(i)}export{b as default};
//# sourceMappingURL=readme-df79b601.js.map
