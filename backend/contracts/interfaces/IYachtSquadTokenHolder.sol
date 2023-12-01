// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IYachtSquadTokenHolder {
    // Structure pour stocker les informations sur les tokens reçus
    struct TokenInfo {
        uint256 amount;
        address sender;
    }

    // Fonction pour définir le contrat YachtSquadTokenisation
    function setYachtSquadTokenisationContract(address _contractAddress) external;

    // Fonction pour transférer un token
    function transferToken(
        address to, 
        uint256 id, 
        uint256 amount
    ) external;

    // Fonction pour transférer un lot de tokens
    function transferTokenBatch(
        address to, 
        uint256[] calldata ids, 
        uint256[] calldata amounts
    ) external;

    // Fonction pour récupérer les informations d'un token spécifique
    function getTokenInfo(uint256 tokenId) external view returns (TokenInfo memory);
}