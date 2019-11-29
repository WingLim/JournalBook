export const getTrackingQuestions = async () => {
  await Promise.resolve();
  return [
    // {
    //   id: 'c1234',
    //   groupId: '',
    //   title: 'Paracetemol?',
    //   priority: 0,
    //   type: 'options',
    //   createdAt: Date.now(),
    //   expiryDate: null,
    //   notes: true,
    //   status: 'live',
    //   settings: { type: 'checkbox', calculation: '', default: null },
    // },
    {
      id: '1234',
      groupId: '4321',
      title: 'How did you sleep?',
      priority: 0,
      type: 'number',
      createdAt: Date.now(),
      expiryDate: null,
      notes: true,
      status: 'draft',
      settings: { type: 'star', calculation: 'average', default: null },
    },
    {
      id: 'a1234',
      groupId: '4321',
      title: 'How many hours did you sleep for?',
      priority: 0,
      type: 'number',
      createdAt: Date.now(),
      expiryDate: null,
      notes: false,
      status: 'draft',
      settings: { type: 'number', calculation: 'average', default: null },
    },
    {
      id: 'b1234',
      groupId: '',
      title: 'How far did you run today? (km)',
      priority: 0,
      type: 'number',
      createdAt: Date.now(),
      expiryDate: null,
      notes: false,
      status: 'draft',
      settings: { type: 'number', calculation: 'total', default: null },
    },
  ];
};
