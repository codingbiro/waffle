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

    struct Update
    {
        string hash; // CID
        uint64 id; // id of the update
        bool isEnabled; // whether the firmware is enabled
        bool isStable; // whether the firmware is a stable release
        string name; // name of the firmware
        uint256 timestamp; // time of the creation of the update
        address uploader; // uploader of the firmware
        string version; // version of the firmware
    }
    
    // Input struct for creating an update
    struct CreateUpdateInput
    {
        string hash; // CID
        bool isEnabled; // whether the firmware is enabled
        bool isStable; // whether the firmware is a stable release
        string name; // name of the firmware
        string version; // version of the firmware
    }
    
    // Input struct for editing an update
    struct EditUpdateInput
    {
        bool isEnabled; // whether the firmware is enabled
        bool isStable; // whether the firmware is a stable release
        string name; // name of the firmware
        string version; // version of the firmware
    }

    Update[] private firmwareUpdates; // Firmware updates

    event Debug(string info); // For debugging

    /** 
     * @dev init
     */
    constructor()
    {
        owner = msg.sender; // Set the owner to the sender of the message
        updaters.push(msg.sender); // Add owner as updater
    }

    /*
     * Modifier and util functions
    */

    // Modifier to check if caller is owner
    modifier ownerGuard
    {
        require(msg.sender == owner, "Caller is not the owner.");
        _;
    }

    /** 
     * @dev Util function checking if address is updater
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
     * @dev Util function comparing 2 strings for equality with different data location
     * @param string1 storage string
     * @param string2 calldata string
     * @return true if string1 is equal to string2
    */
    function safeStringEquality(string storage string1, string calldata string2) private pure
        returns(bool)
    {
        return keccak256(bytes(string1)) == keccak256(bytes(string2));
    }

    // Modifier to check if update version is unique based on the name of the firmware
    modifier uniqueVersionGuard(string calldata firmwareName, string calldata version, int64 id)
    {
        for (uint p = 0; p < firmwareUpdates.length; p++)
        {
            if
            (
                safeStringEquality(firmwareUpdates[p].name, firmwareName) &&
                safeStringEquality(firmwareUpdates[p].version, version) &&
                id != int64(firmwareUpdates[p].id)
            )
            {
                revert("Update version must be unique.");
            }
        }
        _;
    }

    /*
     * Management functions (for the owner only)
    */
    
    /** 
     * @dev Transfer ownership of the contract
     * @param newOwner the address of the new owner
     */
    function transferOwnership(address newOwner) public ownerGuard()
    {
        int index = isUpdater(owner);
        // If previous owner is updater, remove them
        if (index > -1)
        {
            delete updaters[uint(index)];
        }
        owner = newOwner;
        index = isUpdater(newOwner);
        // Add new owner as updater, unless it is already one
        if (index == -1)
        {
            updaters.push(newOwner);
        }
    }
    
    /** 
     * @dev Adds an updater
     * @param newUpdater the updater
     */
    function addUpdater(address newUpdater) public ownerGuard()
    {
        require(isUpdater(newUpdater) == -1, "User is already an updater.");
        updaters.push(newUpdater);
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

    /*
     * Getter functions for updaters
    */

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
     * @dev Returns a firmware update (for updaters only)
     * @param id of firmware update
     * @return firmwareUpdate_ the requested firmware update
     */
    function getFirmwareUpdate(uint64 id) public view updaterGuard()
        returns (Update memory)
    {
        for (uint p = 0; p < firmwareUpdates.length; p++)
        {
            if (firmwareUpdates[p].id == id)
            {
                return firmwareUpdates[p];
            }
        }
        revert("Update not found");
    }

    /*
     * Public getter functions
    */

    /** 
     * @dev Returns a firmware update if available
     * @param id of firmware update
     * @return firmwareUpdate_ the requested firmware update
     */
    function getAvailableFirmwareUpdate(uint64 id) public view
        returns (Update memory)
    {
        for (uint p = 0; p < firmwareUpdates.length; p++)
        {
            if (firmwareUpdates[p].id == id && firmwareUpdates[p].isEnabled)
            {
                return firmwareUpdates[p];
            }
        }
        revert("Update not found");
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
            if (firmwareUpdates[p].isEnabled)
            {
                availableCounter = availableCounter + 1;
            }
        }
        firmwareUpdates_ = new Update[](availableCounter);
        uint counter = 0;
        for (uint p = 0; p < firmwareUpdates.length; p++)
        {
            if (firmwareUpdates[p].isEnabled)
            {
                firmwareUpdates_[counter] = firmwareUpdates[p];
                counter = counter + 1;
            }
        }
    }

    /*
     * Create/Edit functions (for updaters only)
    */

    /** 
     * @dev Creates a firmware update
     * @param update input of type CreateUpdateInput
     */
    function createFirmwareUpdate(CreateUpdateInput calldata update) public
        updaterGuard() uniqueVersionGuard(update.name, update.version, -1)
    {
        firmwareUpdates.push(Update(
            {
                id: uint64(firmwareUpdates.length),
                version: update.version,
                uploader: msg.sender,
                hash: update.hash, // CID
                name: update.name,
                isEnabled: update.isEnabled,
                isStable: update.isStable,
                // solhint-disable-next-line not-rely-on-time
                timestamp: block.timestamp
            }
        ));
    }
    
    /** 
     * @dev Edits a firmware update's enabled status
     * @param id id of edited update
     * @param newValues new values of type EditUpdateInput
     * @return firmwareUpdate_ the edited firmware update
     */
    function editFirmwareUpdate(uint64 id, EditUpdateInput calldata newValues) public
        updaterGuard() uniqueVersionGuard(newValues.name, newValues.version, int64(id))
        returns (Update memory firmwareUpdate_)
    {
        for (uint p = 0; p < firmwareUpdates.length; p++)
        {
            if (firmwareUpdates[p].id == id)
            {
                firmwareUpdates[p].isEnabled = newValues.isEnabled;
                firmwareUpdates[p].isStable = newValues.isStable;
                firmwareUpdates[p].name = newValues.name;
                firmwareUpdates[p].version = newValues.version;
                return firmwareUpdates[p];
            }
        }
    }
}
