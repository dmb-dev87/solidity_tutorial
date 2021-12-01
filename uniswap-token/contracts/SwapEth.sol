// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

interface IERC20 {

  function totalSupply() external view returns (uint256);

  function balanceOf(address account) external view returns (uint256);

  function transfer(address recipient, uint256 amount) external returns (bool);

  function allowance(address owner, address spender) external view returns (uint256);

  function approve(address spender, uint256 amount) external returns (bool);

  function trasnferFrom(address sender, address recipient, uint256 amount) external returns (bool);

  event Transfer(address indexed from, address indexed to, uint256 value);

  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract UniswapExample {
  address internal constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

  IUniswapV2Router02 public uniswapRouter;

  IERC20 ercToken;

  constructor(address _ercTokenAddress) {
    uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
    ercToken = IERC20(_ercTokenAddress);
  }

  function convertEthToToken(uint amountOut, address to, uint valid_upto_seconds) public payable {
    uint deadline = block.timestamp + valid_upto_seconds;
    uniswapRouter.swapETHForExactTokens{ value: msg.value }(amountOut, getPathForETHtoToken(), to, deadline);

    (bool success,) = msg.sender.call{ value: address(this).balance }("");
    require(success, "refund failed");
  }

  function convertTokenToEth(uint amountIn, uint amountOutMin, address to, uint valid_upto_seconds) public payable returns (uint[] memory amounts)
  {
    IERC20 token = IERC20(ercToken);

    require(token.balanceOf(address(this)) >= amountIn, "token balance not enough for swap to ether");
    require(token.approve(address(uniswapRouter), 0), "approve failed");
    require(token.approve(address(uniswapRouter), amountIn), "approve failed");

    uint deadline = block.timestamp + valid_upto_seconds;
    uint[] memory output_amounts = uniswapRouter.swapExactTokensForETH(amountIn, amountOutMin, getPathForTokentoETH(), to, deadline);
    return output_amounts;   
  }

  function getMinOutputforInput(uint tokenAmount) public view returns (uint[] memory) {
    return uniswapRouter.getAmountsIn(tokenAmount, getPathForETHtoToken());
  }

  function getMaxOutputForInput(uint EthAmount) public view returns (uint[] memory) {
    return uniswapRouter.getAmountsOut(EthAmount, getPathForTokentoETH());
  }

  function getPathForETHtoToken() private view returns (address[] memory) {
    address[] memory path = new address[](2);
    path[0] = uniswapRouter.WETH();
    path[1] = address(ercToken);

    return path;
  }

  function getPathForTokentoETH() private view returns (address[] memory) {
    address[] memory path = new address[](2);
    path[0] = address(ercToken);
    path[1] = uniswapRouter.WETH();
    
    return path;
  }

  function tokenBalaceOf(address account) private view returns (uint256) {
    return IERC20(ercToken).balanceOf(account);
  }

  function etherBalanceOf() private view returns (uint256) {
    return address(this).balance;
  }

  receive() payable external {}
}