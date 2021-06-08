import gql from 'graphql-tag';
export const CHECK_SALE_EXISTS = gql`
  query checkSaleExists($itemID: bigint!) {
    nft_sale_offer_aggregate(where: { nft: { asset_id: { _eq: $itemID } } }) {
      aggregate {
        count
      }
    }
  }
`;
