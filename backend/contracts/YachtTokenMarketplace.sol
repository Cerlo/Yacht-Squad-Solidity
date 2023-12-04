// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IYachtSquadTokenization.sol";
import "./interfaces/IYachtSquadTokenHolder.sol";

///@dev envisager une pool de liquidité du token
contract YachtTokenMarketplace is Ownable {
    
    IERC1155 public yachtTokenContract;
    
    IYachtSquadTokenisation public yachtSquadTokenisationContract;
    IYachtSquadTokenHolder public yachtSquadTokenHolderContract;

    // Structure pour une offre de vente
    struct SaleOffer {
        uint256 tokenId;
        uint256 amount;
        uint256 pricePerToken;
        address seller;
    }

    // Mapping des offres de vente
    mapping(uint256 => SaleOffer) public saleOffers;

    // Événements pour les actions du marché
    event TokenListedForSale(
        uint256 indexed tokenId, 
        uint256 amount, 
        uint256 pricePerToken, 
        address indexed seller
    );
    event TokenSale(
        uint256 indexed tokenId, 
        uint256 amount, 
        uint256 totalPrice, 
        address indexed buyer, 
        address indexed seller
    );

    constructor(address _yachtSquadTokenisationContractAddress, address _yachtSquadTokenHolderContractAddress) Ownable(msg.sender){
        yachtTokenContract = IERC1155(_yachtSquadTokenisationContractAddress);
        yachtSquadTokenisationContract = IYachtSquadTokenisation(_yachtSquadTokenisationContractAddress);
        yachtSquadTokenHolderContract = IYachtSquadTokenHolder(_yachtSquadTokenHolderContractAddress);
    }

    // Fonction pour lister un token à vendre
    function listTokenForSale(uint256 tokenId, uint256 amount, uint256 pricePerToken) external {
        // Vérifier que le vendeur possède les tokens
        require(yachtTokenContract.balanceOf(msg.sender, tokenId) >= amount, "Insufficient token balance");

        // Créer une offre de vente
        saleOffers[tokenId] = SaleOffer(tokenId, amount, pricePerToken, msg.sender);
        emit TokenListedForSale(tokenId, amount, pricePerToken, msg.sender);
    }

    // Fonction pour acheter un token 
    function buyToken(uint256 tokenId, uint256 amount) external payable {
        SaleOffer memory offer = saleOffers[tokenId];
        require(offer.amount >= amount, "Not enough tokens for sale");
        require(msg.value == amount * offer.pricePerToken, "Incorrect payment amount");

        // Transférer les fonds au vendeur
        payable(offer.seller).transfer(msg.value);

        // Transférer les tokens à l'acheteur
        yachtTokenContract.safeTransferFrom(offer.seller, msg.sender, tokenId, amount, "");

        // Mettre à jour l'offre de vente
        if (offer.amount == amount) {
            delete saleOffers[tokenId];
        } else {
            saleOffers[tokenId].amount -= amount;
        }

        emit TokenSale(tokenId, amount, msg.value, msg.sender, offer.seller);
    }
    

    // 

}
