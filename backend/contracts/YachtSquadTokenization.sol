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

    struct Yachts{
        uint id;
        string name;
        uint mmsi; //mmsi/AIS yacht identification
        string uri;//json
        string legal;
        address paymentWallet; // YCC / YachtSquad
        uint maxSupply;
        //structure d'avancement du projet de tokenisation du yacht (ysInvestigation,contractRedaction,waitingForListing,listing,preSale,publicSale,soldOut) ??
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

    // doit être minté sur ERC1155Holders
    function Mintyachts(address _mintWallet, string memory _name, uint _mmsi, string memory _uri,  string memory _legal, address _paymentWallet, uint _amount) public returns (uint){
        uint256 newItemId = _tokenIds.current();
        _tokenIds.increment();
        yachts.push(Yachts(newItemId,_name, _mmsi, _uri, _legal, _paymentWallet, _amount));
        _mint(_mintWallet, newItemId, _amount, "");
        _tokenBalances[newItemId][_mintWallet] += _amount;
        _setURI(newItemId, _uri);
        _setTokenRoyalty(newItemId, msg.sender, 200); //2%
        return newItemId;
    }
    
    // Override de la fonction _burn pour suivre les balances || à revoir
    /*
    function _burn(address account, uint256 id, uint256 amount) internal virtual override {
        super._burn(account, id, amount);
        _tokenBalances[id][account] -= amount;
    }*/

    /*
    -
    ----- Premier jet de la fonction de transfert des token depuis YachtSquadTokenHolder
    -
    */
    function transferTokensFromHolder(address holderContract, address to, uint256 id, uint256 amount) public onlyOwner {
        YachtSquadTokenHolder(holderContract).transferToken(to, id, amount);
    }

    function transferTokensBatchFromHolder(address holderContract, address to, uint256[] calldata ids, uint256[] calldata amounts) public onlyOwner {
        YachtSquadTokenHolder(holderContract).transferTokenBatch(to, ids, amounts);
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