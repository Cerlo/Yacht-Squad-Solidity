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
    // Mapping project => address => _tokenBalances
    mapping(uint256 id => mapping(address account => uint256)) private _tokenBalances;

    enum YachtStatus {
        IntialMint,     // The yacht is listed and available for sale
        PreSale,        // Sale for holders of at least one SFT of yacht
        PublicSale,     // Public sale open to new investors
        Chartered,      // The yacht is currently chartered
        Maintenance,    // The yacht is under maintenance
        Sold            // The yacht has been sold
    }


    struct Yachts{
        uint id;
        uint mmsi; //mmsi/AIS => yacht identification
        uint tokenPrice;
        uint maxSupply;
        string name;
        string uri;
        string legal;
        address paymentWallet;
        YachtStatus status;
    }
    Yachts[] yachts;

    // penser à utiliser des données indexed pour une meilleure exploitation côté front
    event NewBatchMinted(uint _tokenIds, uint maxSupply, string yachtName);
    event RecivedToken(address from, address to, uint _tokenIds, uint amount);
    event RecivedTokens(address from, address to, uint[] ids, uint[]amounts);

    /*
    * @ERC1155("") => mettre une URI de base pour le projet
    */
    constructor() Ownable(msg.sender) ERC1155(""){} 


    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, Royalties) returns (bool){
        return super.supportsInterface(interfaceId);
    }

    // doit être minté sur ERC1155Holders
    function Mintyachts(
        address _mintWallet, 
        uint _mmsi, 
        uint _tokenPrice,
        uint _maxSupply,
        string memory _name, 
        string memory _uri,  
        string memory _legal, 
        address _paymentWallet
    ) public {
        uint256 newItemId = _tokenIds.current();
        _tokenIds.increment();
        yachts.push(Yachts(
            newItemId,
            _mmsi,
            _tokenPrice,
            _maxSupply,
            _name,
            _uri,
            _legal,
            _paymentWallet,
            YachtStatus.IntialMint
        ));

        _mint(_mintWallet, newItemId, _amount, "");
        _tokenBalances[newItemId][_mintWallet] += _maxSupply;
        _setURI(newItemId, _uri);
        _setTokenRoyalty(newItemId, msg.sender, 200); //2%
        emit NewBatchMinted(newItemId, yachts[newItemId].maxSupply ,yachts[newItemId].name);
    }

    // Surcharge de la fonction safeTransferFrom pour mettre à jour _tokenBalances
    function safeTransferFrom(
        address from, 
        address to, 
        uint256 id, 
        uint256 amount, 
        bytes memory data
    ) public virtual override {
        _tokenBalances[id][from] -= amount;
        _tokenBalances[id][to] += amount;
        super.safeTransferFrom(from, to, id, amount, data);
        emit RecivedToken(from, to, id, amount);
    }

    // Surcharge de la fonction safeBatchTransferFrom pour mettre à jour _tokenBalances
    function safeBatchTransferFrom(
        address from, 
        address to, 
        uint256[] memory ids, 
        uint256[] memory amounts, 
        bytes memory data
    ) public virtual override {
        for (uint256 i = 0; i < ids.length; ++i) {
            _tokenBalances[ids[i]][from] -= amounts[i];
            _tokenBalances[ids[i]][to] += amounts[i];
        }
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
        emit RecivedTokens(from, to, ids, amounts);
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
    GETERS
     */
    function getYachts() external view returns(Yachts[] memory){
        return yachts;
    }

    /*
    optimisation en frais de gaz à vérifier
    */
    function getInvestments(address investor) external view returns (Yachts[] memory) {
        uint totalYachts = yachts.length;
        uint count = 0;

        // Première boucle pour compter le nombre de yachts détenus par l'investisseur
        for (uint i = 0; i < totalYachts; i++) {
            if (_tokenBalances[i][investor] > 0) {
                count++;
            }
        }

        // Créer un tableau de la taille exacte nécessaire 
        Yachts[] memory ownedYachts = new Yachts[](count);
        uint index = 0;

        // Deuxième boucle pour remplir le tableau avec les yachts détenus
        for (uint i = 0; i < totalYachts; i++) {
            if (_tokenBalances[i][investor] > 0) {
                ownedYachts[index] = yachts[i];
                index++;
            }
        }

        return ownedYachts;
    }

}