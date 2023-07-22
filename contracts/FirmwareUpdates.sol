// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

/** 
 * @title FirmwareUpdates
 * @dev Implements a firmware dispatch system for IoT devices
 */
contract FirmwareUpdates
{
    address private owner; // Owner of the contract
    address[] private updaters; // Users with uploader rights

    event Debug(string info);

    struct Update
    {
        uint64 id; // id of the update
        string version; // version of the firmware
        address uploader;
        string hash; // hash of the firmware
        bool enabled; // whether the firmware is enabled
        bool stable; // whether the firmware is a stable release
        uint256 timestamp; // time of the creation of the update
    }
    
    struct UpdateInput
    {
        string version; // version of the firmware
        string hash; // hash of the firmware
        bool enabled; // whether the firmware is enabled
        bool stable; // whether the firmware is a stable release
    }

    Update[] private firmwareUpdates;

    /** 
     * @dev init
     */
    constructor()
    {
        owner = msg.sender;
        updaters.push(msg.sender);
        firmwareUpdates.push(Update(
            {
                id: uint64(firmwareUpdates.length),
                version: "0.0.0-test",
                uploader: msg.sender,
                hash: "vrQWhFysPKY211X2Kyq3WZuhs",
                enabled: true,
                stable: false,
                // solhint-disable-next-line not-rely-on-time
                timestamp: block.timestamp
            }
        ));
    }

    // Modifier to check if caller is owner
    modifier ownerGuard
    {
        require(msg.sender == owner, "Caller is not the owner.");
        _;
    }

    /** 
     * @dev Check if address is updater
     * @param updater the updater
     * @return idx index of the updater if found, otherwise -1
    */
    function isUpdater(address updater) private view returns(int)
    {
        for (uint p = 0; p < updaters.length; p++)
        {
            if (updaters[p] == updater)
            {
                return int(p);
            }
        }
        return -1;
    }
     
    // Modifier to check if caller is updater
    modifier updaterGuard()
    {
        require(isUpdater(msg.sender) > -1, "Caller is not an updater.");
        _;
    }

    /** 
     * @dev Compares 2 strings for equality with different data location
     * @param string1 storage string
     * @param string2 calldata string
     * @return true if string1 is equal to string2
    */
    function safeStringEquality(string storage string1, string calldata string2) private pure returns(bool)
    {
        return keccak256(bytes(string1)) == keccak256(bytes(string2));
    }

    // Modifier to check if update version is unique
    modifier uniqueVersionGuard(string calldata version)
    {
        bool found = false;
        for (uint p = 0; p < firmwareUpdates.length; p++)
        {
            if (safeStringEquality(firmwareUpdates[p].version, version))
            {
                found = true;
                revert("Update version must be unique.");
            }
        }
        _;
    }
    
    /** 
     * @dev Transfer ownership of the contract
     * @param recipient the address of the new owner
     */
    function transferOwnership(address recipient) public ownerGuard()
    {
        int index = isUpdater(owner);
        if (index > -1)
        {
            delete updaters[uint(index)];
        }
        
        owner = recipient;
        index = isUpdater(recipient);
        if (index == -1)
        {
            updaters.push(recipient);
        }
    }
    
    /** 
     * @dev Add an updater
     * @param updater the updater
     */
    function addUpdater(address updater) public ownerGuard()
    {
        require(isUpdater(updater) == -1, "User is already an updater.");
        updaters.push(updater);
    }
    
    /** 
     * @dev Remove an updater
     * @param updater the updater to be removed
     */
    function removeUpdater(address updater) public ownerGuard()
    {
        int index = isUpdater(updater);
        require(index > -1, "User is not an updater.");
        delete updaters[uint(index)];
    }

    /** 
     * @dev Returns available firmware updates
     */
    function getAvailableFirmwareUpdates() public view
        returns (Update[] memory firmwareUpdates_)
    {
        uint availableCounter = 0;
        for (uint p = 0; p < firmwareUpdates.length; p++)
        {
            if (firmwareUpdates[p].enabled)
            {
                availableCounter = availableCounter + 1;
            }
        }
        firmwareUpdates_ = new Update[](availableCounter);
        uint counter = 0;
        for (uint p = 0; p < firmwareUpdates.length; p++)
        {
            if (firmwareUpdates[p].enabled)
            {
                firmwareUpdates_[counter] = firmwareUpdates[p];
                counter = counter + 1;
            }
        }
    }

    /** 
     * @dev Returns all firmware updates (for updaters only)
     * @return firmwareUpdates all firmware updates
     */
    function getFirmwareUpdates() public view updaterGuard()
        returns (Update[] memory)
    {
        return firmwareUpdates;
    }

    /** 
     * @dev Returns a firmware update
     * @param id of firmware update
     * @return firmwareUpdate_ the requested firmware update
     */
    function getFirmwareUpdate(uint64 id) public view
        returns (Update memory firmwareUpdate_)
    {
        for (uint p = 0; p < firmwareUpdates.length; p++)
        {
            if (firmwareUpdates[p].id == id)
            {
                firmwareUpdate_ = firmwareUpdates[p];
            }
        }
    }

    /** 
     * @dev Creates a firmware update
     * @param update input of type UpdateInput
     */
    function createFirmwareUpdate(UpdateInput calldata update) public uniqueVersionGuard(update.version) updaterGuard()
    {
        firmwareUpdates.push(Update(
            {
                id: uint64(firmwareUpdates.length),
                version: update.version,
                uploader: msg.sender,
                hash: update.hash,
                enabled: update.enabled,
                stable: update.stable,
                // solhint-disable-next-line not-rely-on-time
                timestamp: block.timestamp
            }
        ));
    }
    
    /** 
     * @dev Edits a firmware update's enabled status
     * @param id of firmware update
     * @param enabled whether updates is enabled
     * @return firmwareUpdate_ the edited firmware update
     */
    function editFirmwareUpdate(uint64 id, bool enabled) public updaterGuard()
        returns (Update memory firmwareUpdate_)
    {
        for (uint p = 0; p < firmwareUpdates.length; p++)
        {
            if (firmwareUpdates[p].id == id)
            {
                firmwareUpdates[p].enabled = enabled;
                return firmwareUpdates[p];
            }
        }
    }
}
