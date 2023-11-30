// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
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



contract YachtSquadTokenisation is Ownable, ERC1155, Royalties  {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Optional base URI
    string private _baseURI = "https://chocolate-manual-reindeer-776.mypinata.cloud/ipfs/";
    string private _endURI = "?pinataGatewayToken=eQDJhDlHEYMct0GhVYAIbxxg-rjz-G9Xp9sJmFTK98CltvbF7l0tDZgnzn1SKmFZ";
    // Mapping for token URIs
    mapping(uint256 tokenId => string) private _tokenURIs;

    struct Yachts{
        string name;
        uint mmsi; //mmsi/AIS yacht identification
        string uri;//json
        string legal;
        address paymentWallet; // YCC / YachtSquad
        uint maxSupply;
    }
    Yachts[] yachts;

    //event MintNewBatch(uint _tokenIds, string yachtName);

    /*
    * @ERC1155("") => mettre une URI de base pour le projet
    */
    constructor() Ownable(msg.sender) ERC1155(""){} 


    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, Royalties) returns (bool){
        return super.supportsInterface(interfaceId);
    }

    // doit être minté sur une address générique qui envera SFT lors de la fin du listing
    function Mintyachts(address _mintWallet, string memory _name, uint _mmsi, string memory _uri,  string memory _legal, address _paymentWallet, uint _amount) public returns (uint){
        _tokenIds.increment();
		yachts.push(Yachts(_name, _mmsi, _uri, _legal, _paymentWallet, _amount));
        uint256 newItemId = _tokenIds.current();
        _mint(_mintWallet, newItemId, _amount, "");
        _setURI(newItemId, _uri);
        _setTokenRoyalty(newItemId, msg.sender, 200);
        return newItemId;
    }

    /**
    URI PART
    */
    function _setURI(uint256 tokenId, string memory tokenURI) internal virtual {
        _tokenURIs[tokenId] = tokenURI;
        emit URI(uri(tokenId), tokenId);
    }

    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        string memory tokenURI = _tokenURIs[tokenId];
        // If token URI is set, concatenate base URI and tokenURI (via string.concat).
        return bytes(tokenURI).length > 0 ? string.concat(_baseURI, tokenURI, _endURI) : super.uri(tokenId);
    }

    /**
    GETTERS
     */
    function getYachts() external view returns(Yachts[] memory){
    return yachts;
    }

}