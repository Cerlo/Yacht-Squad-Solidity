// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YachtTokenMarketplace is Ownable {
    IERC1155 public yachtTokenContract;
    address public yachtSquadTokenHolderContract;

    // Structure pour une offre de vente
    struct SaleOffer {
        uint256 tokenId;
        uint256 amount;
        uint256 pricePerToken;
        address seller;
    }

    // Mapping des offres de vente
    mapping(uint256 => SaleOffer) public saleOffers;


    constructor(address _yachtTokenContract, address _yachtSquadTokenHolderContract) {
        yachtTokenContract = IERC1155(_yachtTokenContract);
        yachtSquadTokenHolderContract = _yachtSquadTokenHolderContract;
    }


}
