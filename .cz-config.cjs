module.exports = {
  types: [
    {
      value: ':tada: init',
      name: '🎉 init: 项目初始化'
    },
    {
      value: ':sparkles: feat',
      name: '✨ feat: 新功能'
    },
    {
      value: ':bookmark: feat',
      name: '🔖 feat: 发布/版本标签'
    },
    {
      value: ':bug: fix',
      name: '🐛 fix: 修复bug'
    },
    {
      value: ':construction: chore',
      name: '🚧 chore: 工作正在进行中'
    },
    {
      value: ':zap: perf',
      name: '⚡️ perf: 性能提升'
    },
    {
      value: ':wheelchair: refactor',
      name: '♿️ refactor: 兼容性提升'
    },
    {
      value: ':recycle: refactor',
      name: '♻️ refactor: 重构'
    },
    {
      value: ':rewind: revert',
      name: '⏪️ revert: 分支回退'
    },
    {
      value: ':twisted_rightwards_arrows: chore',
      name: '🔀 chore: 合并分支'
    },
    {
      value: ':wastebasket: refactor',
      name: '🗑️ refactor: 废弃/移除'
    },
    {
      value: ':memo: docs',
      name: '📝 docs: 文档变更'
    },
    {
      value: ':globe_with_meridians: docs',
      name: '🌐 docs: 国际化和本地化'
    },
    {
      value: ':lipstick: style',
      name: '💄 style: 添加或更新，UI和样式'
    },
    {
      value: ':white_check_mark: test',
      name: '✅ test: 测试'
    },
    {
      value: ':package: build',
      name: '📦️ build: 打包'
    },
    {
      value: ':bricks: chore',
      name: '🧱 chore: 基础设施相关'
    },
    {
      value: ':clown_face: chore',
      name: '🤡 chore: Mock服务相关'
    }
  ],
  messages: {
    type: '请选择提交类型(必填)',
    customScope: '请输入文件修改范围(可选)',
    subject: '请简要描述提交(必填)',
    body: '请输入详细描述(可选)',
    breaking: '列出任何重大变化(可选)',
    footer: '请输入要关闭的issue(可选)',
    confirmCommit: '确定提交此说明吗？'
  },
  allowCustomScopes: true,
  allowBreakingChanges: [':sparkles: feat', ':bug: fix'],
  subjectLimit: 120
}