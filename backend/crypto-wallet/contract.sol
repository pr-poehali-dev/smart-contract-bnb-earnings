// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MultiLevelReferral
 * @dev Многоуровневая реферальная система для BNB Smart Chain
 * Владелец контракта: 0x98b49bb2c613700D3c31266d245392bCE61bD991
 */
contract MultiLevelReferral {
    address public owner;
    uint256 public constant MINIMUM_WITHDRAW = 0.01 ether;
    
    struct Package {
        uint256 price;
        uint256 commissionRate;
        uint256 levels;
        bool active;
    }
    
    struct User {
        address referrer;
        uint256 packageId;
        uint256 totalEarned;
        uint256 directReferrals;
        bool active;
    }
    
    mapping(uint256 => Package) public packages;
    mapping(address => User) public users;
    mapping(address => uint256) public balances;
    
    event PackagePurchased(address indexed user, uint256 packageId, uint256 amount, address indexed referrer);
    event CommissionPaid(address indexed recipient, uint256 amount, uint256 level);
    event Withdrawal(address indexed user, uint256 amount);
    
    constructor() {
        owner = 0x98b49bb2c613700D3c31266d245392bCE61bD991;
        
        packages[1] = Package({
            price: 0.1 ether,
            commissionRate: 3,
            levels: 1,
            active: true
        });
        
        packages[2] = Package({
            price: 0.5 ether,
            commissionRate: 5,
            levels: 3,
            active: true
        });
        
        packages[3] = Package({
            price: 1.0 ether,
            commissionRate: 10,
            levels: 5,
            active: true
        });
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    function buyPackage(uint256 packageId, address referrer) external payable {
        Package memory pkg = packages[packageId];
        require(pkg.active, "Package not active");
        require(msg.value == pkg.price, "Incorrect payment amount");
        require(referrer != msg.sender, "Cannot refer yourself");
        
        if (users[msg.sender].packageId == 0) {
            users[msg.sender] = User({
                referrer: referrer,
                packageId: packageId,
                totalEarned: 0,
                directReferrals: 0,
                active: true
            });
            
            if (referrer != address(0) && users[referrer].active) {
                users[referrer].directReferrals++;
            }
        } else {
            users[msg.sender].packageId = packageId;
        }
        
        distributeCommissions(msg.sender, msg.value, pkg.commissionRate, pkg.levels);
        
        emit PackagePurchased(msg.sender, packageId, msg.value, referrer);
    }
    
    function distributeCommissions(address buyer, uint256 amount, uint256 rate, uint256 levels) private {
        address current = users[buyer].referrer;
        uint256 level = 1;
        
        while (current != address(0) && level <= levels) {
            if (users[current].active) {
                uint256 commission = (amount * rate) / 100;
                balances[current] += commission;
                users[current].totalEarned += commission;
                
                emit CommissionPaid(current, commission, level);
                
                current = users[current].referrer;
                level++;
            } else {
                break;
            }
        }
        
        uint256 remaining = amount - ((amount * rate * levels) / 100);
        balances[owner] += remaining;
    }
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(amount >= MINIMUM_WITHDRAW, "Amount too small");
        
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        
        emit Withdrawal(msg.sender, amount);
    }
    
    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
    
    function getUserInfo(address user) external view returns (
        address referrer,
        uint256 packageId,
        uint256 totalEarned,
        uint256 directReferrals,
        bool active
    ) {
        User memory u = users[user];
        return (u.referrer, u.packageId, u.totalEarned, u.directReferrals, u.active);
    }
    
    function updatePackage(uint256 packageId, uint256 price, uint256 commissionRate, uint256 levels, bool active) external onlyOwner {
        packages[packageId] = Package(price, commissionRate, levels, active);
    }
    
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
