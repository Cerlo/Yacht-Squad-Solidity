// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IYachtSquadTokenization {
    // Structure pour les yachts
    struct Yachts {
        uint id;
        uint mmsi;
        uint tokenPrice;
        uint maxSupply;
        string name;
        string uri;
        string legal;
        address paymentWallet; 
    }

    // Fonction pour mint des yachts
    function Mintyachts(
        address _mintWallet, 
        uint _mmsi, 
        uint _tokenPrice,
        uint _maxSupply,
        string memory _name, 
        string memory _uri,  
        string memory _legal, 
        address _paymentWallet
    ) external;

    // Fonction pour transférer des tokens de manière sécurisée
    function safeTransferFrom(
        address from, 
        address to, 
        uint256 id, 
        uint256 amount, 
        bytes memory data
    ) external;

    // Fonction pour transférer des lots de tokens de manière sécurisée
    function safeBatchTransferFrom(
        address from, 
        address to, 
        uint256[] memory ids, 
        uint256[] memory amounts, 
        bytes memory data
    ) external;

    // Fonction pour obtenir les informations sur les yachts
    function getYachts() external view returns (Yachts[] memory);

    // Fonction pour obtenir les investissements d'un investisseur
    function getInvestments(address investor) external view returns (Yachts[] memory);
}