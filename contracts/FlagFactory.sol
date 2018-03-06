pragma solidity ^0.4.19;

contract FlagFactory {

    event NewFlag(uint flagId, string name, uint pattern);

    uint patternDigits = 16;
    uint patternModulus = 10 ** patternDigits;

    struct Flag {
        string name;
        uint pattern;
    }

    Flag[] public flags;

    mapping (uint => address) public flagToOwner;
    mapping (address => uint) ownerFlagCount;

    function _createFlag(string _name, uint _pattern) internal {
        uint id = flags.push(Flag(_name, _pattern));
        flagToOwner[id] = msg.sender;
        ownerFlagCount[msg.sender]++;
        NewFlag(id, _name, _pattern);
    }

    function _generateRandomPattern(string _str) private view returns (uint) {
        uint rand = uint(keccak256(_str));
        return rand % patternModulus;
    }

    function createRandomFlag(string _name) public {
        require(ownerFlagCount[msg.sender] < 100);
        uint randPattern = _generateRandomPattern(_name);
        _createFlag(_name, randPattern);
    }

    function getFlagsByOwner(address _owner) external view returns(uint[]) {
        uint[] memory result = new uint[](ownerFlagCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < flags.length; i++) {
            if (flagToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function getFlagsCount() public constant returns(uint) {
        return flags.length;
    }

    function getFlag(uint index) public constant returns(string, uint) {
        return (flags[index].name, flags[index].pattern);
    }
}
