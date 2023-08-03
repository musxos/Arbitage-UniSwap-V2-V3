// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; 
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";


interface IUniswapV2Router02 {
    function WETH() external pure returns (address);
    function getAmountsOut(uint amountIn, address[] memory path) external view returns (uint[] memory amounts);
    function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts);
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool); // added this line
}

contract ChainMasterX {
    address private owner;
    IUniswapV2Router02 public pancakeRouter;
    IUniswapV2Router02 public bakeryRouter;
    ISwapRouter public pancakeV3Router;
    // Pancake 0x10ED43C718714eb63d5aA57B78B54704E256024E V2
    // Baby 0x325E343f1dE602396E256B67eFd1F61C3A6B38Bd V2 
    // Pancake 0x1b81D678ffb9C0263b24A97847620C99d213eB14 V3


    constructor(address _bakeryRouter, address _pancakeRouter, address _pancakeV3) {
        bakeryRouter = IUniswapV2Router02(_bakeryRouter);
        pancakeRouter = IUniswapV2Router02(_pancakeRouter);
        pancakeV3Router = ISwapRouter(_pancakeV3);
        owner = msg.sender;
    }
    
    function setBakeryRouter(address _bakeryRouter) external {
        require(msg.sender == owner, "Caller is not the owner");
        bakeryRouter = IUniswapV2Router02(_bakeryRouter);
    }

    function setPancakeRouter(address _pancakeRouter) external {
        require(msg.sender == owner, "Caller is not the owner");
        pancakeRouter = IUniswapV2Router02(_pancakeRouter);
    }
    
    function tradeChainMasterX(uint amountIn, address[] calldata path0, address[] calldata path1, address[] calldata path2, address[] calldata approves) external {
        require(msg.sender == owner, "Caller is not the owner");
        uint deadline = block.timestamp + 12000; 

        // approve token to PancakeRouter
        IERC20(approves[0]).approve(address(pancakeRouter), amountIn);
        uint[] memory amounts = pancakeRouter.swapExactTokensForTokens(amountIn, 0, path0, address(this), deadline);
        amountIn = amounts[amounts.length - 1];

        // approve token to bakeryRouter
        IERC20(approves[1]).approve(address(bakeryRouter), amountIn);
        amounts = bakeryRouter.swapExactTokensForTokens(amountIn, 0, path1, address(this), deadline);
        amountIn = amounts[amounts.length - 1];

        // approve token to PancakeRouter again
        IERC20(approves[2]).approve(address(pancakeRouter), amountIn);
        pancakeRouter.swapExactTokensForTokens(amountIn, 0, path2, address(this), deadline);
    }

    function singleRouter(uint amountIn,uint amountOut, address[] calldata path, address approves, IUniswapV2Router02 router) external {
        require(msg.sender == owner, "Caller is not the owner");
        uint deadline = block.timestamp + 12000; // 2 hours from now

        // approve token to the Router
        IERC20(approves).approve(address(router), amountIn);
        router.swapExactTokensForTokens(amountIn, amountOut, path, address(this), deadline);
    }

    function pancakeV2toV3(uint _amountIn,uint amountOut, address[] calldata path,address approve,address tokenV3In, address tokenV3Out, uint24 _poolFee) external {
        require(msg.sender == owner, "Caller is not the owner");
        uint deadline = block.timestamp + 12000; // 2 hours from now

        // approve token to the Router
        IERC20(approve).approve(address(pancakeRouter), _amountIn);
        uint[] memory amounts = pancakeRouter.swapExactTokensForTokens(_amountIn, amountOut, path, address(this), deadline);

        uint amountIn = amounts[amounts.length - 1];

        IERC20(tokenV3In).approve(address(pancakeV3Router), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenV3In,
                tokenOut: tokenV3Out,
                fee: _poolFee,
                recipient: address(this),
                deadline: deadline,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        pancakeV3Router.exactInputSingle(params);

    }

    
    function customV2toV2(IUniswapV2Router02 routerOne,IUniswapV2Router02 routerTwo,uint _amountIn, address[] calldata path_one, address[] calldata path_two, address[] calldata approve) external {
        require(msg.sender == owner, "Caller is not the owner");
        uint deadline = block.timestamp + 12000; // 2 hours from now

        IERC20(approve[0]).approve(address(routerOne), _amountIn);
        uint[] memory amounts = routerOne.swapExactTokensForTokens(_amountIn, 0, path_one, address(this), deadline);
        uint amountIn = amounts[amounts.length - 1];
        IERC20(approve[1]).approve(address(routerTwo), amountIn);
        routerTwo.swapExactTokensForTokens(amountIn, 0, path_two, address(this), deadline);

    }
    
   
    function pancakeV3toV2(uint _amountIn, address[] calldata path,address approve,address tokenV3In, address tokenV3Out, uint24 _poolFee) external {
        require(msg.sender == owner, "Caller is not the owner");
        uint deadline = block.timestamp + 12000; // 2 hours from now        
        IERC20(tokenV3In).approve(address(pancakeV3Router), _amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenV3In,
                tokenOut: tokenV3Out,
                fee: _poolFee,
                recipient: address(this),
                deadline: deadline,
                amountIn: _amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        uint amountOut = pancakeV3Router.exactInputSingle(params);
        IERC20(approve).approve(address(pancakeRouter), amountOut);
        pancakeRouter.swapExactTokensForTokens(amountOut, 0, path, address(this), deadline);
    }

    function pancakeV3toCustomV2(uint _amountIn,IUniswapV2Router02 routerOne, address[] calldata path,address approve,address tokenV3In, address tokenV3Out, uint24 _poolFee) external {
        require(msg.sender == owner, "Caller is not the owner");
        uint deadline = block.timestamp + 12000; // 2 hours from now        
        IERC20(tokenV3In).approve(address(pancakeV3Router), _amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenV3In,
                tokenOut: tokenV3Out,
                fee: _poolFee,
                recipient: address(this),
                deadline: deadline,
                amountIn: _amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        uint amountOut = pancakeV3Router.exactInputSingle(params);
        IERC20(approve).approve(address(routerOne), amountOut);
        routerOne.swapExactTokensForTokens(amountOut, 0, path, address(this), deadline);
    }
    function customV2toV3(uint _amountIn, IUniswapV2Router02 routerOne, uint amountOut, address[] calldata path,address approve,address tokenV3In, address tokenV3Out, uint24 _poolFee) external {
        require(msg.sender == owner, "Caller is not the owner");
        uint deadline = block.timestamp + 12000; // 2 hours from now

        // approve token to the Router
        IERC20(approve).approve(address(routerOne), _amountIn);
        uint[] memory amounts = routerOne.swapExactTokensForTokens(_amountIn, amountOut, path, address(this), deadline);

        uint amountIn = amounts[amounts.length - 1];

        IERC20(tokenV3In).approve(address(pancakeV3Router), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenV3In,
                tokenOut: tokenV3Out,
                fee: _poolFee,
                recipient: address(this),
                deadline: deadline,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        pancakeV3Router.exactInputSingle(params);

    }
   

    function withdrawTokens(IERC20 token) external {
        require(msg.sender == owner, "Caller is not the owner");
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(msg.sender, balance), "Transfer failed");
    }
}
