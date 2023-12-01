// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract YachtSquadTokenHolder is ERC1155Holder {

    // Structure pour stocker les informations sur les tokens reçus
    struct TokenInfo {
        uint256 amount;
        address sender;
    }

    // Mapping pour suivre les tokens reçus par ID
    mapping(uint256 => TokenInfo) public receivedTokens;

    // Event pour signaler la réception d'un token
    event TokenReceived(address operator, address from, uint256 id, uint256 value);

    /*
    -
    ---- Reception des tokens
    -
     */
    // Override de onERC1155Received pour gérer les tokens reçus
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) public virtual override returns (bytes4) {
        receivedTokens[id] = TokenInfo(value, from);
        emit TokenReceived(operator, from, id, value);
        return this.onERC1155Received.selector;
    }

    // Override de onERC1155BatchReceived pour gérer les tokens reçus en lot
    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) public virtual override returns (bytes4) {
        for (uint256 i = 0; i < ids.length; ++i) {
            receivedTokens[ids[i]] = TokenInfo(values[i], from);
            emit TokenReceived(operator, from, ids[i], values[i]);
        }
        return this.onERC1155BatchReceived.selector;
    }

    // Fonction pour récupérer les informations d'un token spécifique
    function getTokenInfo(uint256 tokenId) external view returns (TokenInfo memory) {
        return receivedTokens[tokenId];
    }

    /*
    -
    ----- Gestion des tokens
    -
    */

}