window.walletAddress = null;
            const connectWallet = document.getElementById("connectMetaMaskButton");
            const walletAddress = document.getElementById("walletAddress");
            const walletBalance = document.getElementById("walletBalance");


            function checkInstalled(){
                if (typeof window.ethereum == 'undefined'){
                    
                    walletAddress.innerHTML = 'MetaMask is not installed, so install it.<br> Or you are using Telegram desktop.<br> Please use <a style="text-decoration: underline;" href="http://web.telegram.org/#@testtestetetetet_bot" target="_blank">Telegram Web</a> to connect MetaMask';
                    console.log(navigator.userAgent)
                    return false;
                }
                connectWallet.addEventListener('click', connectToMetaMask);
            }

            async function connectToMetaMask(){
                checkInstalled();

                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
                .catch(e => {
                    console.error(e.message);
                    return;
                })
                if (!accounts){ return; }
                window.walletAddress = accounts[0]; // wallet address
                // console.log(accounts);
                // walletAddress.innerText = window.walletAddress;
                let tg = window.Telegram.WebApp; 
        
                const url='https://crossfigod.io/datafrommetamask';
                const data_to_tg = {
                    "MetaMaskWallet": window.walletAddress,
                    "from_tg": tg.initDataUnsafe
                };
                
                const otherParam = {
                    headers: {
                        "content-type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify(data_to_tg),
                    method: "POST",
                };

                fetch(url, otherParam)
                    .then(data => data.json())
                    .then(response => response)
                    .catch(error => error);
                
                walletAddress.innerText = 'MetaMask Successfully Connected!';

                // connectWallet.innerText = 'Sign Out';
                // connectWallet.removeEventListener('click', connectToMetaMask);
                // setTimeout(()=>{
                //     connectWallet.addEventListener('click', signOutOfMetaMask);
                // }, 200)
            };


            // function signOutOfMetaMask() { 
            //     window.walletAddress = null;
            //     // walletAddress.innerText = '';
            //     connectWallet.innerText = 'Connect Wallet';
            //     connectWallet.removeEventListener('click', connectToMetaMask);
            //     setTimeout(()=>{
            //         connectWallet.addEventListener('click', connectToMetaMask);
            //     }, 1000)
                
            //  }


             window.addEventListener('DOMContentloaded', ()=>{
                checkInstalled();
             });