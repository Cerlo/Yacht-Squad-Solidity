// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";



contract YachtSquadTokenHolder is ERC1155Holder, Ownable {
    // Link to maincontract
    IERC1155 public yachtTokenContract; //Référence au contrat ERC1155 des tokens de yacht.
    address public yachtSquadTokenisationContract;

    // Structure pour stocker les informations sur les tokens reçus
    struct TokenInfo {
        uint256 amount;
        address sender;
    }

    // Mapping pour suivre les tokens reçus par ID
    mapping(uint256 => TokenInfo) public receivedTokens;

    // Event pour signaler la réception d'un token
    event TokenReceived(
        address _operator, 
        address _from, 
        uint256 _id, 
        uint256 _value, 
        bytes _data
    );

    //Add ref to YachtSquadTokenisation
    constructor(address _yachtSquadTokenisationContractAddress) Ownable(msg.sender) {
        yachtTokenContract = IERC1155(_yachtSquadTokenisationContractAddress);
    }

    /**
    * @notice Override of onERC1155Received to manage received tokens
    * 
    * @param _operator The address which initiated the transfer (i.e. msg.sender)
    * @param _from The address which previously owned the token
    * @param _id The ID of the token being transferred
    * @param _value The amount of tokens being transferred
    * @param _data  Additional data with no specified format
    * @return `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))` if transfer is allowed
    **/
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
    /**
    * @notice Override of onERC1155BatchReceived to manage received batch tokens 
    * 
    * @param _operator The address which initiated the batch transfer (i.e. msg.sender)
    * @param _from The address which previously owned the token
    * @param _ids An array containing ids of each token being transferred (order and length must match values array)
    * @param _values An array containing amounts of each token being transferred (order and length must match ids array)
    * @param _data Additional data with no specified format
    * @return `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))` if transfer is allowed
    */
    function onERC1155BatchReceived(
        address _operator,
        address _from,
        uint256[] memory _ids,
        uint256[] memory _values,
        bytes memory _data
    ) public virtual override returns (bytes4) {
        require(_ids.length <= 100, "Array length exceeds limit");
        require(_ids.length == _values.length, "IDs and values length mismatch");
        for (uint256 i = 0; i < _ids.length; ++i) {
            receivedTokens[_ids[i]] = TokenInfo(_values[i], _from);
            emit TokenReceived(_operator, _from, _ids[i], _values[i], _data);
        }
        return this.onERC1155BatchReceived.selector;
    }


    /**
    * @notice 
    */
    function setYachtSquadTokenisationContract(address _contractAddress) external onlyOwner {
        yachtSquadTokenisationContract = _contractAddress;
    }

    /**
    *@notice Transfert token from this smart contract to the investor adress
    *
    * @param _to token reciver account
    * @param _id The token id
    * @param _amount Amount of tokens transfered
    */
    function transferToken(
        address _to, 
        uint256 _id, 
        uint256 _amount
    ) external {
        require(msg.sender == yachtSquadTokenisationContract, "Caller is not authorized");
        require(receivedTokens[_id].amount >= _amount, "Insufficient token balance");
        receivedTokens[_id].amount -= _amount;
        yachtTokenContract.safeTransferFrom(address(this), _to, _id, _amount, "");
    }

    /**
    *@notice Transfert tokens from this smart contract to the investor adress
    *
    * @param _to token reciver account
    * @param _ids[] The token ids
    * @param _amounts[] Amount of tokens transfered
    */
    function transferTokenBatch(
        address _to, 
        uint256[] calldata _ids, 
        uint256[] calldata _amounts
    ) external {
        require(msg.sender == yachtSquadTokenisationContract, "Caller is not authorized");
        require(_ids.length <= 100, "Array length exceeds limit");
        require(_ids.length == _amounts.length, "IDs and amounts length mismatch");

        for (uint256 i = 0; i < _ids.length; ++i) {
            require(receivedTokens[_ids[i]].amount >= _amounts[i], "Insufficient token balance for id");
            receivedTokens[_ids[i]].amount -= _amounts[i];
        }

        yachtTokenContract.safeBatchTransferFrom(address(this), _to, _ids, _amounts, "");
    }

    // Fonction pour récupérer les informations d'un token spécifique
    function getTokenInfo(uint256 _tokenId) external view returns (TokenInfo memory) {
        return receivedTokens[_tokenId];
    }
}