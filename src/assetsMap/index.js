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
    {
      name: 'explosion',
      assets: [
        { alias: 'explosionFrame1', src: '/assets/explosion1.png' },
        { alias: 'explosionFrame2', src: '/assets/explosion2.png' },
        { alias: 'explosionFrame3', src: '/assets/explosion3.png' },
        { alias: 'explosionFrame4', src: '/assets/explosion4.png' },
        { alias: 'explosionFrame5', src: '/assets/explosion5.png' },
      ],
    },
  ],
};
