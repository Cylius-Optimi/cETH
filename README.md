# cETH
cETH is an extension for Google Chrome that displays the price of a single ETH in mɃ, $, and €. cETH was written entirely in one day, as a break from other projects. 

##FAQ
- Q: Why does it want access to "my data on api.fixer.io and bittrex.com"? I don't like the sound of that.
- A: Chrome's permission warnings are notoriously frugal. In the manifest.json file within cETH/source, you can see that cETH only requests access to two URLs in particular- fixer.io's latest FOREX prices, and Bittrex's public ticker API. I don't get access to anything else.
