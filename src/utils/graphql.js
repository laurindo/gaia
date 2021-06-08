/* eslint-disable no-unused-vars */
import { gqlClient } from '~/config/apollo-client';
import { INSERT_SALE_OFFER, EDIT_SALE_OFFER, UPDATE_IS_FOR_SALE } from '~/store/server/mutations';
import { CHECK_SALE_EXISTS } from '~/store/server/queries';
export const checkIfSaleExists = async itemID => {
  const { nft_sale_offer_aggregate } = await gqlClient.request(CHECK_SALE_EXISTS, { itemID });
  return nft_sale_offer_aggregate.aggregate.count > 0;
};

//check if sale is already on database
//if it is , edit with new info
//if is not , insert it
//needs to provide , asset_id , graphql id and price
export const checkAndInsertSale = async (itemID, id, price) => {
  const saleExists = await checkIfSaleExists(itemID);

  //SET NFT IS_FOR_SALE TRUE
  await gqlClient.request(UPDATE_IS_FOR_SALE, { id: id, is_for_sale: true });

  //IF DOESN'T HAVE A SALE CREATE
  if (!saleExists) {
    return await gqlClient.request(INSERT_SALE_OFFER, {
      price: price.toFixed(8),
      nft_id: id,
      status: 'active'
    });
  }
  //IF IT HAS A SALE , EDIT EXISTING ONE
  //This mutation updates the price and status to new price and "active" respectively
  return await gqlClient.request(EDIT_SALE_OFFER, {
    price: price.toFixed(8),
    asset_id: itemID,
    standard: 'flow'
  });
};
