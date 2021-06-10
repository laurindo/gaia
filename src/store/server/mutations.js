import gql from 'graphql-tag';

export const FUSD_FAUCET = gql`
  mutation FUSDfaucet($receiver: String!, $amount: bigint!) {
    FUSDfaucet(arg1: { amount: $amount, receiver: $receiver }) {
      errors
    }
  }
`;

export const CREATE_TEMPLATE = gql`
  mutation createTemplate($metadata: json!, $id: bigint!, $recipientAddr: String!) {
    createTemplate(arg1: { metadata: $metadata, setID: $id, recipientAddr: $recipientAddr }) {
      errors
    }
  }
`;

export const MINT = gql`
  mutation mint($recipient: String!, $setID: bigint!, $templateID: bigint!) {
    mint(arg1: { recipientAddr: $recipient, setID: $setID, templateID: $templateID }) {
      errors
    }
  }
`;

export const CREATE_SET = gql`
  mutation createSet(
    $name: String!
    $description: String!
    $image: String!
    $website: String!
    $creator: String!
    $marketFee: float8!
  ) {
    createSet(
      arg1: {
        name: $name
        description: $description
        image: $image
        website: $website
        creator: $creator
        marketFee: $marketFee
      }
    ) {
      errors
    }
  }
`;

export const UPDATE_OWNER = gql`
  mutation update_owner($assetId: bigint!, $owner: String!) {
    update_nft(where: { asset_id: { _eq: $assetId } }, _set: { owner: $owner }) {
      affected_rows
    }
  }
`;

export const UPDATE_IS_FOR_SALE = gql`
  mutation updateIsForSale($id: uuid!, $is_for_sale: Boolean!) {
    update_nft_by_pk(pk_columns: { id: $id }, _set: { is_for_sale: $is_for_sale }) {
      is_for_sale
    }
  }
`;

export const INSERT_SALE_OFFER = gql`
  mutation createSaleOffer($price: String!, $nft_id: uuid!, $status: String!) {
    insert_nft_sale_offer_one(object: { price: $price, nft_id: $nft_id, status: $status }) {
      created_at
      id
      nft_id
      price
      status
      updated_at
    }
  }
`;
export const EDIT_SALE_OFFER = gql`
  mutation editSaleOffer($asset_id: bigint!, $price: String!, $standard: String!) {
    update_nft_sale_offer(
      where: { nft: { asset_id: { _eq: $asset_id }, _and: { standard: { _eq: $standard } } } }
      _set: { price: $price, status: "active" }
    ) {
      returning {
        nft {
          id
        }
      }
    }
  }
`;

export const UPDATE_SALE_PRICE = gql`
  mutation UpdateSalePrice($asset_id: bigint!, $price: String!) {
    update_nft_sale_offer(
      where: { nft: { asset_id: { _eq: $asset_id } } }
      _set: { price: $price }
    ) {
      returning {
        price
      }
    }
  }
`;
