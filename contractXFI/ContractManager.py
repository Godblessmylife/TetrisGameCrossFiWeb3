
from web3 import Web3
from eth_account.signers.local import LocalAccount

from aiogram.types import Message

from web3.exceptions import TransactionNotFound

from database import requests

import asyncio


class XFISender:
    def __init__(self, private_key: str):        
        
        provider_url = "https://rpc.testnet.ms"

        self.private_key = private_key 

        # Create a provider and wallet to interact with the blockchain
        self.w3 = Web3(Web3.HTTPProvider(provider_url))
        self.account: LocalAccount = self.w3.eth.account.from_key(private_key)

    
    async def transfer_to(self, amount: float | int, recipient_address: str):
        myaddress = self.account.address
        

        # Replace with the recipient address
        nonce = self.w3.eth.get_transaction_count(myaddress)

        

        # Amount to send
        transfer_amount = self.w3.to_wei(amount, 'ether')

        # Construct transaction
        transaction = {
            'chainId': 4157,
            'from': myaddress,
            'to': recipient_address,
            'value': transfer_amount,
            'gas': 21384,
            'gasPrice': self.w3.eth.gas_price,
            'nonce':nonce,
            'data': bytes(f'amount: {amount}', encoding='utf-8')
        }

        # Send transaction
        
        signed_txn = self.account.sign_transaction(transaction)

        transaction_hash = self.w3.eth.send_raw_transaction(self.w3.to_hex(signed_txn.raw_transaction))
        receipt = self.w3.eth.wait_for_transaction_receipt(transaction_hash)

        print(signed_txn)
        print(receipt)

        return transaction_hash.hex(), receipt['blockNumber']
    
    async def check_tx_hash(self, tx_hash, amount: int | float, _from: str, message: Message):
        try:
            if await requests.add_transaction(tx_hash=tx_hash, _from=_from, from_user_id=message.from_user.id):
                    
                tx = self.w3.eth.get_transaction(tx_hash)
                if tx["from"] == _from and \
                        tx["to"] == self.account.address and \
                            tx['value'] == self.w3.to_wei(amount, 'ether'):
                
                    tx_receipt = self.w3.eth.get_transaction_receipt(tx_hash)
                    
            
                    return True if tx_receipt['status'] == 1 else False
                
            return False
        
        except TransactionNotFound:
            return False
       
    

    async def get_balance(self):
        # Future is comming ...
        return self.w3.from_wei(self.w3.eth.get_balance(self.account.address), 'ether')
    
    async def get_some_balance(self, address: str):
        try:
            return self.w3.from_wei(self.w3.eth.get_balance(address), 'ether')
        except:
            return "Invalid address"


xfi_sender = XFISender(private_key="PRIVATE_KEY_FROM_ENV")
