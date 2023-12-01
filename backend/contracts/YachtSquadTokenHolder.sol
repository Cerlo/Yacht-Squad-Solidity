// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

contract YachtSquadTokenHolder is ERC1155Holder {

    // Structure pour stocker les informations sur les tokens reçus
    struct TokenInfo {
        uint256 amount;
        address sender;
    }

    // Mapping pour suivre les tokens reçus par ID
    mapping(uint256 => TokenInfo) public receivedTokens;

    // Event pour signaler la réception d'un token
    event TokenReceived(address operator, address from, uint256 id, uint256 value, bytes data);

    /*
    -
    ---- Reception des tokens
    -
     */
    // Override de onERC1155Received pour gérer les tokens reçus
    function onERC1155Received(
        address _operator,
        address _from,
        uint256 _id,
        uint256 _value,
        bytes memory _data
    ) public virtual override returns (bytes4) {
        receivedTokens[_id] = TokenInfo(_value, _from);
        emit TokenReceived(_operator, _from, _id, _value, _data);
        return this.onERC1155Received.selector;
    }

    // Override de onERC1155BatchReceived pour gérer les tokens reçus en lot
    function onERC1155BatchReceived(
        address _operator,
        address _from,
        uint256[] memory _ids,
        uint256[] memory _values,
        bytes memory _data
    ) public virtual override returns (bytes4) {
        for (uint256 i = 0; i < _ids.length; ++i) {
            receivedTokens[_ids[i]] = TokenInfo(_values[i], _from);
            emit TokenReceived(_operator, _from, _ids[i], _values[i], _data);
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