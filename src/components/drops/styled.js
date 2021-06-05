import styled from 'styled-components';
import { Row } from 'antd';

export const DropListWrapper = styled(Row)`
  .drop {
    background-color: white;
    border-radius: 20px;
    padding: 20px;
  }

  .drop :nth-child(2n) {
    background-color: rgba(214, 207, 214, 0.1) !important;
  }

  .infoCard {
    background-color: white;
    border-radius: 20px;
    border-width: 0;
    align-items: center;

    -webkit-box-shadow: -2px 4px 17px 1px rgba(214, 207, 214, 1);
    -moz-box-shadow: -2px 4px 17px 1px rgba(214, 207, 214, 1);
    box-shadow: -2px 4px 17px 1px rgba(214, 207, 214, 1);
  }

  .title {
    font-weight: bold;
    font-size: 16px;
    text-align: left;
  }

  .infoRow {
    margin: 10px 0;
    justify-content: flex-start;
  }
`;

export const AssetWrapper = styled.div`
  -webkit-box-shadow: -2px 4px 17px 1px rgba(214, 207, 214, 1);
  -moz-box-shadow: -2px 4px 17px 1px rgba(214, 207, 214, 1);
  box-shadow: -2px 4px 17px 1px rgba(214, 207, 214, 1);

  border-radius: 20px;

  height: 264px;
  width: 165px;

  margin: 5px;

  .imageContainer {
    position: relative;
    padding: 8px 8px 15px;
    /* background: #14192e linear-gradient(180deg, #1a203c, #14192e) 0 0 no-repeat padding-box; */
    background-color: #eee;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }

  .imagePreview {
    height: 147px;
    width: 100%;
    position: relative;
  }

  .image {
    position: absolute;
    top: 50%;
    left: 50%;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .contentContainer {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    position: relative;
  }

  .content {
    padding: 22px 10px 10px;
    align-items: center;
    text-align: center;
    display: flex;
    flex-direction: column;
  }

  .assetId {
    font-size: 16px;
    font-weight: bold;
  }

  .assetName {
    font-size: 12px;
  }

  .assetQuantity {
    font-size: 12px;
  }
`;
