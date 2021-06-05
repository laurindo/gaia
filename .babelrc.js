module.exports = {
  presets: ['next/babel'],
  plugins: [
    ['styled-components', { ssr: true, pure: true }],
    ['import', { libraryName: 'antd', style: true }, 'antd'],
    [
      'import',
      {
        libraryName: '@ant-design',
        libraryDirectory: 'icons',
        camel2DashComponentName: false // default: true
      },
      '@ant-design'
    ]
  ],
  ignore: ['node_modules']
};
