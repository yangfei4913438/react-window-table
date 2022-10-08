import Mockjs from 'mockjs';

// 多语言值的显示类型
export const PersonLabels = {
  root: '用户信息表',
  base: '基础资料',
  more: '更多信息',
  name: '姓名',
  age: '年龄',
  status: '状态',
  region: '区域',
  city: '城市',
  email: '电子邮件',
  phone: '手机号码',
  visits: '访问次数',
  ip: '访问IP',
  last_visit: '最近访问时间',
};

export interface IPerson {
  id: string;
  name: string;
  age: number;
  status: '已婚' | '未婚' | '恋爱中';
  region: string;
  city: string;
  email: string;
  phone: number;
  visits: number;
  ip: string;
  last_visit: string;
  children?: IPerson[];
}

export function makeData(lens: number): IPerson[] {
  const mock_data = {
    [`data|${lens}`]: [
      {
        id: '@id',
        name: '@cname',
        age: '@integer(18,60)',
        'status|1': ['已婚', '未婚', '恋爱中'],
        region: '@region',
        city: '@city(true)',
        email: '@email',
        phone: '@integer(13)',
        visits: '@integer(0,1000)',
        ip: '@ip',
        last_visit: '@datetime("yyyy-MM-dd HH:mm:ss")',
        [`children|0-3`]: [
          {
            id: '@id',
            name: '@cname',
            age: '@integer(18,60)',
            'status|1': ['已婚', '未婚', '恋爱中'],
            region: '@region',
            city: '@city(true)',
            email: '@email',
            phone: '@integer(13)',
            visits: '@integer(0,1000)',
            ip: '@ip',
            last_visit: '@datetime("yyyy-MM-dd HH:mm:ss")',
          },
        ],
      },
    ],
  };
  const result = Mockjs.mock(mock_data);

  return result.data;
}
