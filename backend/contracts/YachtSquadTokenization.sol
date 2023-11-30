// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";


interface IERC2981Royalties {
    function royaltyInfo(uint256 _tokenId, uint256 _value) external view  returns (address _receiver, uint256 _royaltyAmount);
}

/**
    -Royalties sur la revente fixé à 200/10000 => 2%
*/
contract Royalties is IERC2981Royalties, ERC165{
    struct RoyaltyInfo {
        address recipient;
        uint24 amount;
    }
 
    mapping(uint256 => RoyaltyInfo) internal _royalties;
 
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC2981Royalties).interfaceId || super.supportsInterface(interfaceId);
    }
 
    function _setTokenRoyalty( uint256 tokenId, address recipient, uint256 value) internal {
        require(value <= 200, 'ERC2981Royalties: Too high');
        _royalties[tokenId] = RoyaltyInfo(recipient, uint24(value));
    }
 
    function royaltyInfo(uint256 tokenId, uint256 value) external view override returns (address receiver, uint256 royaltyAmount)
    {
        RoyaltyInfo memory royalties = _royalties[tokenId];
        receiver = royalties.recipient;
        royaltyAmount = (value * royalties.amount) / 200;
    }
}

 
contract YachtSquadTokenisation is Ownable, ERC1155, Royalties {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    struct Yachts{
        string name;
        uint mmsi; //mmsi/AIS
        string uri;//json
        string legal;
        address paymentWallet; // YCC / YachtSquad
    }

    Yachts[] yachts;

    constructor() Ownable(msg.sender) ERC1155("https://chocolate-manual-reindeer-776.mypinata.cloud/ipfs/{id}?pinataGatewayToken=eQDJhDlHEYMct0GhVYAIbxxg-rjz-G9Xp9sJmFTK98CltvbF7l0tDZgnzn1SKmFZ"){} //replace votre hash par le cid

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, Royalties) returns (bool){
        return super.supportsInterface(interfaceId);
    }

    function Mintyachts(address _investor, string memory _name, uint _mmsi, string memory _uri,  string memory _legal, address _paymentWallet, uint _number) public returns (uint){
        _tokenIds.increment();
		yachts.push(Yachts(_name, _mmsi, _uri, _legal, _paymentWallet));
        uint256 newItemId = _tokenIds.current();
        _mint(_investor, newItemId, _number, "");
        _setTokenRoyalty(newItemId, msg.sender, 200);
        return newItemId;
    }

        function init()public {
        Mintyachts(msg.sender, "YachtGenesys", 170, "bafkreihld7ihwhpy4dq4xsux5rbriijov6z4qiv4pkcsgzd6t34aizq2mi","coucou", msg.sender, 2*10**3 );
        Mintyachts(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, "An other yacht", 170, "QmaBowBdUxagTy2QYogUkFw1WQHg8Qd2Bs61Eh5Ycspbsi","coucou", msg.sender, 2*10**4 );
    }

}

