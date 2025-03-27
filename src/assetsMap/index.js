export const assetsMap = {
  name: 'tank',
  assets: [
    { alias: 'bodyRed', src: '/assets/tankBody_red_outline.png' },
    { alias: 'barrel1', src: '/assets/tankRed_barrel1_outline.png' },
    { alias: 'tracks', src: '/assets/tracksLarge.png' },
  ],
};

export const manifest = {
  bundles: [
    {
      name: 'tank-red',
      assets: [
        {
          alias: 'bodyRed',
          src: '/assets/tankBody_red_outline.png',
        },
        {
          alias: 'barrel',
          src: '/assets/tankRed_barrel1_outline.png',
        },
      ],
    },
  ],
};
