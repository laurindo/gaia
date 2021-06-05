import gql from 'graphql-tag';

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
