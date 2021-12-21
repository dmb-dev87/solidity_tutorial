// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Ownable.sol";
import "./Stakable.sol";

contract DevToken is Ownable, Stakeable {

  uint private _totalSupply;
  uint8 private _decimals;
  string private _symbol;
  string private _name;

  mapping (address => uint256) private _balances;
  mapping (address => mapping (address => uint256)) private _allowances;

  event Transfer(address indexed from, address indexed to, uint256 value);

  event Approval(address indexed owner, address indexed spender, uint256 value);

  constructor(string memory token_name, string memory short_symbol, uint8 token_decimals, uint256 token_totalSupply){
    _name = token_name;
    _symbol = short_symbol;
    _decimals = token_decimals;
    _totalSupply = token_totalSupply;
    _balances[msg.sender] = _totalSupply;
    emit Transfer(address(0), msg.sender, _totalSupply);
  }

  function decimals() external view returns (uint8) {
    return _decimals;
  }

  function symbol() external view returns (string memory) {
    return _symbol;
  }

  function name() external view returns (string memory) {
    return _name;
  }

  function totalSupply() external view returns (uint256) {
    return _totalSupply;
  }

  function balanceOf(address account) external view returns (uint256) {
    return _balances[account];
  }

  function getOwner() external view returns (address) {
    return owner();
  }

  function allowance(address owner, address spender) external view returns(uint256){
    return _allowances[owner][spender];
  }

  function mint(address account, uint256 amount) public onlyOwner returns(bool){
    _mint(account, amount);
    return true;
  }

  function burn(address account, uint256 amount) public onlyOwner returns(bool) {
    _burn(account, amount);
    return true;
  }

  function transfer(address recipient, uint256 amount) external returns (bool) {
    _transfer(msg.sender, recipient, amount);
    return true;
  }

  function approve(address spender, uint256 amount) external returns (bool) {
    _approve(msg.sender, spender, amount);
    return true;
  }

  function transferFrom(address spender, address recipient, uint256 amount) external returns(bool){
    require(_allowances[spender][msg.sender] >= amount, "DevToken: You cannot spend that much on this account");

    _transfer(spender, recipient, amount);
    _approve(spender, msg.sender, _allowances[spender][msg.sender] - amount);
    return true;
  }

  function increaseAllowance(address spender, uint256 amount) public returns (bool) {
    _approve(msg.sender, spender, _allowances[msg.sender][spender]+amount);
    return true;
  }

  function decreaseAllowance(address spender, uint256 amount) public returns (bool) {
    _approve(msg.sender, spender, _allowances[msg.sender][spender]-amount);
    return true;
  }

  function _transfer(address sender, address recipient, uint256 amount) internal {
    require(sender != address(0), "DevToken: transfer from zero address");
    require(recipient != address(0), "DevToken: transfer to zero address");
    require(_balances[sender] >= amount, "DevToken: cant transfer more than your account holds");

    _balances[sender] = _balances[sender] - amount;
    _balances[recipient] = _balances[recipient] + amount;
    emit Transfer(sender, recipient, amount);
  }

  function _mint(address account, uint256 amount) internal {
    require(account != address(0), "DevToken: cannot mint to zero address");

    _totalSupply = _totalSupply + (amount);
    _balances[account] = _balances[account] + amount;
    emit Transfer(address(0), account, amount);
  }

  function _burn(address account, uint256 amount) internal {
    require(account != address(0), "DevToken: cannot burn from zero address");
    require(_balances[account] >= amount, "DevToken: Cannot burn more than the account owns");

    _balances[account] = _balances[account] - amount;
    _totalSupply = _totalSupply - amount;
    emit Transfer(account, address(0), amount);
  }

  function _approve(address owner, address spender, uint256 amount) internal {
    require(owner != address(0), "DevToken: approve cannot be done from zero address");
    require(spender != address(0), "DevToken: approve cannot be to zero address");

    _allowances[owner][spender] = amount;
    emit Approval(owner,spender,amount);
  }

  function stake(uint256 _amount) public {
    require(_amount < _balances[msg.sender], "DevToken: Cannot stake more than you own");

    _stake(_amount);
    _burn(msg.sender, _amount);
  }
}
