import dynamic from 'dva/dynamic';
import {message} from 'antd';


// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});


const children = (root, ar) => {
  // return
  let nav = [];
  let allNav = root.children;
  allNav.map(m => {
    ar.map(m1 => {
      if (m1.scriptId == m.path) {
        nav.push(m);
        if (m1.children) {
          children(m, m1.children);
        } else {
          m.children = [];
        }
      }
    })
  });
  root.children = nav;
};


// nav data
export function getNavData(app, menu) {
  let fullNav = [
    {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
      layout: 'BasicLayout',
      name: '首页', // for breadcrumb
      path: '/',
      children: [
        {
          name: '用户管理',
          path: 'usermanage',
          icon: 'user',
          children: [
            {
              name: '用户列表',
              path: 'userinfo-list',
              component: dynamicWrapper(app, ['user_list'], () => import('../routes/UserManage/UserInfoList')),
            },
          ],
        },
        // {
        //   name: '订单管理',
        //   path: 'order',
        //   icon: 'profile',
        //   children: [
        //     // {
        //     //   name: '借款订单',
        //     //   path: 'borrow-order',
        //     //   component: dynamicWrapper(app, ['order_borrow'], () => import('../routes/OrderManage/BorrowOrderList')),
        //     // },
        //     {
        //       name: '贷款订单',
        //       path: 'lease',
        //       component: dynamicWrapper(app, ['order_borrow'], () => import('../routes/OrderManage/LeaseList')),
        //     },
        //     {
        //       name: '放款订单',
        //       path: 'youmiloanorder',
        //       component: dynamicWrapper(app, ['order_loan'], () => import('../routes/OrderManage/YouMiLoanOrderList')),
        //     }, {
        //       name: '还款订单',
        //       path: 'youmirepayorder',
        //       component: dynamicWrapper(app, [], () => import('../routes/OrderManage/RepaymentOrderList')),
        //     }

        //   ]
        // },
        {
          name: '订单管理',
          path: 'order',
          icon: 'profile',
          children: [
            {
              name: '贷款订单',
              path: 'lease',
              component: dynamicWrapper(app, ['order_borrow'], () => import('../routes/OrderManagement/GoodsOrder')),
            },
            {
              name: '放款订单',
              path: 'loan',
              component: dynamicWrapper(app, ['order_loan'], () => import('../routes/OrderManagement/LoanOrder')),
            }, {
              name: '还款订单',
              path: 'repayment',
              component: dynamicWrapper(app, [], () => import('../routes/OrderManagement/RepaymentOrder')),
            },
            {
              name: '线下还款申请',
              path: 'offlineRepay',
              component: dynamicWrapper(app, ['offlineCollection'], () => import('../routes/OrderManagement/OfflineRepayment')),
            }, {
              name: '线下还款初审',
              path: 'offlineRepayFrist',
              component: dynamicWrapper(app, ['offlineCollection'], () => import('../routes/OrderManagement/OfflineRepaymentFirst')),
            }
          ]
        },
        {
          name: '渠道管理',
          path: 'channel',
          icon: 'line-chart',
          children: [
            // {
            //   name: '渠道统计',
            //   path: 'channelMng',
            //   component: dynamicWrapper(app, [], () => import('../routes/channelManage/channelManage'))
            // },
            // {
            //   name: '渠道方合作',
            //   path: 'channelCooperation',
            //   component: dynamicWrapper(app, [], () => import('../routes/channelManage/channelCooperation'))
            // },
            {
              name: '渠道管理',
              path: 'channelMng',
              component: dynamicWrapper(app, [], () => import('../routes/channelManage/channelsManageDev'))
            },
            {
              name: '渠道数据',
              path: 'channelData',
              component: dynamicWrapper(app, [], () => import('../routes/channelManage/channelDataDev'))
            },
            {
              name: '第三方数据',
              path: 'thirdpartyData',
              component: dynamicWrapper(app, ['user'], () => import('../routes/channelManage/thirdpartyData'))
            },
            ]
        },
        // {
        //         //   name: '产品管理',
        //         //   path: 'staging',
        //         //   icon: 'appstore-o',
        //         //   children: [
        //         //     {
        //         //       name: '产品系列',
        //         //       path: 'product-series',
        //         //       component: dynamicWrapper(app, ['staging_product_list'], () => import('../routes/StagingProduct/ProductSeries')),
        //         //     },
        //         //     {
        //         //       name: '产品设置',
        //         //       path: 'product-set',
        //         //       component: dynamicWrapper(app, ['staging_product_list'], () => import('../routes/StagingProduct/ProductSet')),
        //         //     },
        //         //     {
        //         //       name: '费用设置',
        //         //       path: 'cost-set',
        //         //       component: dynamicWrapper(app, ['staging_product_list'], () => import('../routes/StagingProduct/CostSet')),
        //         //     },
        //         //   ],
        //         // },
        /*{
          name: '额度管理',
          path: 'limit',
          icon: 'red-envelope',
          children: [
            {
              name: '额度管理列表',
              path: 'limit-list',
              component: dynamicWrapper(app, ['user_list', 'limit_list'], () => import('../routes/LimitManage/LimitManageList')),
            },
            {
              name: '额度查询',
              path: 'limit-search',
              component: dynamicWrapper(app, ['user_list', 'limit_list'], () => import('../routes/LimitManage/LimitSearch')),
            },
          ],
        },*/
        {
          name: '路由配置',
          path: 'route',
          icon: 'link',
          children: [
            {
              name: '支付路由',
              path: 'payment-route',
              component: dynamicWrapper(app, [], () => import('../routes/routeManage/routeManage')),
            }, {
              name: '风控路由',
              path: 'audit-route',
              component: dynamicWrapper(app, [], () => import('../routes/auditRouteManage/auditRouteManage')),
            }
          ],
        },
        {
          name:"资金管理",
          path:"fundsmanage",
          icon:'pay-circle',
          children:[
            {
              name:"资金渠道管理",
              path:"fundschannel",
              component:dynamicWrapper(app,[],()=> import('../routes/FundManage/FundsChannel'))
            },
            {
              name: '支付渠道管理',
              path: 'paymentchannel',
              component: dynamicWrapper(app, [], () => import('../routes/FundManage/payChannel')),
            },
            {
              name:"资金结算",
              path:"fundssettle",
              component:dynamicWrapper(app,[],()=> import('../routes/FundManage/Settle'))
            },
            {
              name:"资金报表",
              path:"capitalreport",
              component:dynamicWrapper(app,[],()=> import('../routes/FundManage/capitalReport'))
            },
          ]
        },
        {
          name: '信用管理',
          path: 'credit',
          icon: 'red-envelope',
          children: [
            {
              name: '商家管理',
              path: 'shops-manage',
              component: dynamicWrapper(app, [], () => import('../routes/CreditManage/merchantManage')),
            },
            {
              name: '商品管理',
              path: 'commodity-manage',
              component: dynamicWrapper(app, [], () => import('../routes/CreditManage/commodityManage')),
            },
            {
              name: '物流管理',
              path: 'logistics-manage',
              component: dynamicWrapper(app, [], () => import('../routes/CreditManage/logisticsManage')),
            },
            {
              name: '信用审核',
              path: 'credit-check',
              component: dynamicWrapper(app, [], () => import('../routes/CreditManage/creditCheck')),
            }
          ],
        },
        // {
        //   name: '意见反馈',
        //   path: 'opiononSave',
        //   icon: 'save',
        //   children: [
        //     {
        //       name: '意见反馈',
        //       path: 'opiononSave',
        //       component: dynamicWrapper(app, ['opiononSave'], () => import('../routes/opiononSave/UserList')),
        //     }
        //   ]
        // },
        {
          name: '系统管理',
          path: 'systematic',
          icon: 'setting',
          children: [
            {
              name: '系统用户管理',
              path: 'system-user-manage',
              component: dynamicWrapper(app, ['system_user'], () => import('../routes/SystemManage/UserList')),
            },
            {
              name: '角色权限管理',
              path: 'role-manage',
              component: dynamicWrapper(app, ['role_manage'], () => import('../routes/SystemManage/roleManage')),
            },
            {
              name: '系统菜单管理',
              path: 'system-menu',
              component: dynamicWrapper(app, ['system_menu'], () => import('../routes/SystemManage/SystemMenu')),
            },
            {
              name: '系统参数设置',
              path: 'system-params',
              component: dynamicWrapper(app, [], () => import('../routes/SystemManage/SystemParams')),
            },

            {
              name: '数据库参数列表',
              path: 'system-dict',
              component: dynamicWrapper(app, ['system_dict'], () => import('../routes/SystemManage/SystemDictionary')),
            },
            {
              name: '定时任务',
              path: 'task',
              component: dynamicWrapper(app, ['system_user'], () => import('../routes/SystemManage/TimedTask')),
            },
            {
              name: '系统日志查看',
              path: 'systemlog-datajson',
              component: dynamicWrapper(app, ['system_user'], () => import('../routes/SystemLog/SystemLogjson')),
            },
            {
              name: '管理员操作表',
              path: 'manageHandle',
              component: dynamicWrapper(app, [], () => import('../routes/SystemManage/manageHandle')),
            }

          ],
        },
        {
          name: '风控管理',
          path: 'auditManagement',
          icon: 'eye-o',
          children: [
            {
              name: '风控统计表',
              path: 'statistics',
              component: dynamicWrapper(app, [], () => import('../routes/auditRouteManage/auditRouteStatisticsManage1')),
            },
            // {
            //     name: '入催数据表',
            //     path: 'urge',
            //     component: dynamicWrapper(app, [], () => import('../routes/auditRouteManage/urgeManage')),
            // },
            {
              name: '天启撞库',
              path: 'tianqi-validate',
              component: dynamicWrapper(app, [], () => import('../routes/validate/tianqiValidate')),
            },
            {
              name: '当天到期表',
              path: 'now',
              component: dynamicWrapper(app, [], () => import('../routes/auditRouteManage/now.js')),
            },
            {
              name: '逾期一天表',
              path: 'oneDay',
              component: dynamicWrapper(app, [], () => import('../routes/auditRouteManage/oneDay.js')),
            },
            {
              name: '逾期两天以上',
              path: 'twoDay',
              component: dynamicWrapper(app, [], () => import('../routes/auditRouteManage/towDay.js')),
            }
          ]
        },
        {
          name: '贷超管理',
          path: 'overlendingManagement',
          icon: 'switcher',
          children: [
            {
              name:'平台管理',
              path:'platformManagement',
              component:dynamicWrapper(app,[],()=>import('../routes/overlendingManagement/platform'))
            },
            {
              name: '数据管理',
              path: 'dataManagement',
              component: dynamicWrapper(app, [], () => import('../routes/overlendingManagement/dataManagement')),
            }
          ]
        },
        {
          name: '运营管理',
          path: 'business',
          icon: 'solution',
          children: [
            {
              name: '流程转换率',
              path: 'processTransformation',
              component: dynamicWrapper(app, [], () => import('../routes/statistics/processTransformationManage')),
            },
            {
              name:'素材管理',
              path:'materialmange',
              component:dynamicWrapper(app,['material_mange'],()=>import('../routes/MaterialManage/MaterialMange'))
            },
            {
              name: '通知管理',
              path: 'notification',
              component: dynamicWrapper(app, [], () => import('../routes/statistics/NotificationManagement')),
            }
          ]
        },
        {
          name: '财务管理',
          path: 'finance',
          icon: 'profile',
          children: [
          //   {
          //   name: '放款记录',
          //   path: 'LoanRecordMng',
          //   component: dynamicWrapper(app, ['financial'], () => import('../routes/FinanceManage/loanRecordManage'))
          // }, {
          //   name: '还款记录',
          //   path: 'repayRecordMng',
          //   component: dynamicWrapper(app, ['financial_list'], () => import('../routes/FinanceManage/repayRecordManage'))
          // },
          {
            name:"放款查询",
            path:"loanquerymng",
            component: dynamicWrapper(app,[],()=>import('../routes/FinanceManage/loanqueryManage'))
          },
          {
            name:"还款查询",
            path:"repayquerymanage",
            component: dynamicWrapper(app,[],()=>import('../routes/FinanceManage/repayquerymanage'))
          },
          {
            name:"线下还款复审",
            path:"offlinerepayreview",
            component: dynamicWrapper(app,[],()=>import('../routes/FinanceManage/offlinerepayreview'))
          }
//            , {
//              name: '财务对账',
//              path: 'reconciliations',
//              component: dynamicWrapper(app, [], () => import('../routes/FinanceManage/reconciliations'))
//            },

          ]
        },
      ],
    },
    {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
      path: '/user',
      layout: 'UserLayout',
      children: [
        {
          name: '帐户',
          icon: 'user',
          path: 'user',
          children: [
            {
              name: '登录',
              path: 'login',
              component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
            },
          ],
        },
      ],
    },
  ];
  children(fullNav[0], menu);
  return fullNav;
};
