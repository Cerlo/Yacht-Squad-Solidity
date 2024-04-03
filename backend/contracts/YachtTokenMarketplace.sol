// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IYachtSquadTokenization.sol";
import "./interfaces/IYachtSquadTokenHolder.sol";

///@dev envisager une pool de liquidité du token
contract YachtTokenMarketplace is Ownable {
    IERC1155 public yachtTokenContract;

    IYachtSquadTokenization public yachtSquadTokenizationContract;
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
        uint256 indexed _tokenId,
        uint256 _amount,
        uint256 _pricePerToken,
        address indexed _seller
    );
    event TokenSale(
        uint256 indexed _tokenId,
        uint256 _amount,
        uint256 _totalPrice,
        address indexed _buyer,
        address indexed _seller
    );

    constructor(
        address _yachtSquadTokenizationContractAddress,
        address _yachtSquadTokenHolderContractAddress
    ) Ownable(msg.sender) {
        yachtTokenContract = IERC1155(_yachtSquadTokenizationContractAddress);
        yachtSquadTokenizationContract = IYachtSquadTokenization(
            _yachtSquadTokenizationContractAddress
        );
        yachtSquadTokenHolderContract = IYachtSquadTokenHolder(
            _yachtSquadTokenHolderContractAddress
        );
    }

    /**
    *@notice Reject any direct Ether transfers to the contract
    *
    */
    receive() external payable {
        revert("Direct Ether transfers not allowed");
    }

    /**
    * @notice Allow Owner to Withdrawl funds This function must be safer 
    *
    * @param _amount The amount must be withdrawl by the Owner
    */
    function withdrawFunds(uint256 _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Amount exceed the available balance !");

        // Transfert des fonds
        payable(owner()).transfer(_amount);
    }

   
    /**
    * @notice Add token to the token sale listing
    *
    * @param _tokenId The ID of the token being sale
    * @param _amount The amount of token sale
    * @param _pricePerToken The unitary price
    */
    function listTokenForSale(
        uint256 _tokenId,
        uint256 _amount,
        uint256 _pricePerToken
    ) external {
        // Vérifier que le vendeur possède les tokens
        require(
            yachtTokenContract.balanceOf(msg.sender, _tokenId) >= _amount,
            "Insufficient token balance"
        );

        // Créer une offre de vente
        saleOffers[_tokenId] = SaleOffer(
            _tokenId,
            _amount,
            _pricePerToken,
            msg.sender
        );
        emit TokenListedForSale(_tokenId, _amount, _pricePerToken, msg.sender);
    }

    // Fonction pour acheter un token
    /**
    * @notice Function allow investor to buy token from token sale listing
    *
    * @param _tokenId The ID of the token being buy
    * @param _amount Tthe amounts of token the buyer want to buy
    */
    function buyToken(uint256 _tokenId, uint256 _amount) external payable {
        SaleOffer memory offer = saleOffers[_tokenId];
        require(offer.amount >= _amount, "Not enough tokens for sale");
        require(
            msg.value == _amount * offer.pricePerToken,
            "Incorrect payment amount"
        );
        // Update Sale offer
        if (offer.amount == _amount) {
            delete saleOffers[_tokenId];
        } else {
            saleOffers[_tokenId].amount -= _amount;
        }
        
        // Transfer token from seller to buyer
        yachtTokenContract.safeTransferFrom(
            offer.seller,
            msg.sender,
            _tokenId,
            _amount,
            ""
        );
        // Pay the seller
        payable(offer.seller).transfer(msg.value);



        emit TokenSale(_tokenId, _amount, msg.value, msg.sender, offer.seller);
    }

}
