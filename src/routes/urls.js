export const URLs = {
  root: '/',
  home: '/',
  marketplace: '/market',
  sale: saleId => `/market/sale/${saleId ?? ':id'}`,
  profile: address => `/profile/${address || ':id'}`,
  editProfile: '/profile/edit',
  templates: collectionId => `/creator/collection/${collectionId}/templates`,
  nfts: templateId => `/creator/template/${templateId}/nfts`,
  create: '/creator',
  createNFT: templateId => `/creator/template/${templateId}/create`,
  createCollection: '/creator/collection',
  createTemplate: collectionId => `/creator/collection/${collectionId}/create`,
  explorer: assetId => `/explorer/asset/${assetId ?? ':id'}`
};
