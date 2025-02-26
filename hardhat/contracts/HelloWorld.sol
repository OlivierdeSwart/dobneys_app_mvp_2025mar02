// HelloWorldModule#HelloWorld - 0x0ac539fbFb7E6E4911de16FE81be9028C34ccb32

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract HelloWorld {
    string public greeting;

    constructor() {
        greeting = "Hello, World!";
    }

    function changeGreeting(string memory newGreeting) public {
        greeting = newGreeting;
    }

    function hello() public view returns (string memory) {
        return greeting;
    }
}
