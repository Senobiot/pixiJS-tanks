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
          alias: 'body-red',
          src: '/assets/tankBody_red_outline.png',
        },
        {
          alias: 'barrel-red',
          src: '/assets/tankRed_barrel1_outline.png',
        },
      ],
    },
    {
      name: 'tank-dark',
      assets: [
        {
          alias: 'body-dark',
          src: '/assets/tankBody_dark_outline.png',
        },
        {
          alias: 'barrel-dark',
          src: '/assets/tankDark_barrel1_outline.png',
        },
      ],
    },
    {
      name: 'tank-blue',
      assets: [
        {
          alias: 'body-blue',
          src: '/assets/tankBody_blue_outline.png',
        },
        {
          alias: 'barrel-blue',
          src: '/assets/tankBlue_barrel1_outline.png',
        },
      ],
    },
    {
      name: 'tank-green',
      assets: [
        {
          alias: 'body-green',
          src: '/assets/tankBody_green_outline.png',
        },
        {
          alias: 'barrel-green',
          src: '/assets/tankGreen_barrel1_outline.png',
        },
      ],
    },
    {
      name: 'tank-sand',
      assets: [
        {
          alias: 'body-sand',
          src: '/assets/tankBody_sand_outline.png',
        },
        {
          alias: 'barrel-sand',
          src: '/assets/tankSand_barrel1_outline.png',
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
    {
      name: 'bullets',
      assets: [
        { alias: 'bullet-red', src: '/assets/bulletRed3.png' },
        { alias: 'bullet-green', src: '/assets/bulletGreen3.png' },
        { alias: 'bullet-sand', src: '/assets/bulletSand3.png' },
        { alias: 'bullet-dark', src: '/assets/bulletDark3.png' },
        { alias: 'bullet-blue', src: '/assets/bulletBlue3.png' },
      ],
    },
  ],
};
