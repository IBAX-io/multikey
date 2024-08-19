import Home from '@/pages/home/Home';

const Routes = [
  {
    index: true,
    element: <Home />,
    meta: {
      key: '3'
    }
  },
  {
    path: '/receive/:tokenSymbol/:id/:keyId',
    title: 'home.receive',
    // Single route in lazy file
    lazy: () => import('@/pages/home/receive/Receive'),
    meta: {
      key: '4'
    }
  },
  {
    path: '/collection/:tokenSymbol/:id/:keyId/:amount',
    title: 'home.receive',
    // Single route in lazy file
    lazy: () => import('@/pages/home/transfer/Collection'),
    meta: {
      key: '5'
    }
  },
  {
    path: '/transfer/:tokenSymbol/:id/:keyId',
    title: 'home.transfer',
    // Single route in lazy file
    lazy: () => import('@/pages/home/transfer/Transfer'),
    meta: {
      key: '6'
    }
  },
  {
    path: '/create',
    title: 'home.create',
    // Single route in lazy file
    lazy: () => import('@/pages/home/createTeam/CreateTeam'),
    meta: {
      key: '7'
    }
  },
  {
    path: '/record',
    title: 'nav.record',
    // Single route in lazy file
    lazy: () => import('@/pages/home/record/Record'),
    meta: {
      key: '8'
    }
  },
  {
    path: 'message',
    title: 'home.message',
    // Single route in lazy file
    lazy: () => import('@/pages/home/message/Message'),
    meta: {
      key: '9'
    },
    children: [
      {
        index: true,
        title: 'home.message',
        // Single route in lazy file
        lazy: () => import('@/pages/home/message/messageList/MessageList'),
        meta: {
          key: '10'
        }
      },
      {
        path: 'details',
        title: 'home.details',
        // Single route in lazy file
        lazy: () => import('@/pages/home/message/details/Details'),
        meta: {
          key: '11'
        }
      }
    ]
  },
  {
    path: '/manage',
    title: 'nav.manage',
    // Single route in lazy file
    lazy: () => import('@/pages/manage/Manage'),
    meta: {
      key: '9'
    }
  }
];
export default Routes;
