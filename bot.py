
from aiogram import Bot, Dispatcher, types, F
from aiogram.types import WebAppInfo, InlineKeyboardButton, WebAppData
from aiogram.filters import CommandStart, Command, CommandObject
from aiogram.utils.keyboard import InlineKeyboardBuilder

from aiogram.exceptions import TelegramBadRequest

from aiogram.utils.deep_linking import create_start_link, decode_payload

from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from contractXFI.ContractManager import xfi_sender 

import datetime

import logging
import asyncio


from apscheduler.schedulers.asyncio import AsyncIOScheduler


import base64


import kb_for_bot

from database.requests import add_user, get_user_by_id, update_user_data, get_all_users, increase_mpx_balance, null


API_TOKEN = 'YOUR_TOKEN'





# Создание бота и диспетчера
bot = Bot(token=API_TOKEN)
dp = Dispatcher()

scheduler: AsyncIOScheduler = AsyncIOScheduler(timezone="Europe/Moscow")

async def create_wallet(user_id: int):
    return base64.b64encode(str(user_id).encode()).decode()

async def decode_wallet(wallet: str):
    return int(base64.b64decode(wallet).decode())




@dp.message(CommandStart())
async def send_welcome(message: types.Message, command: CommandObject, bot: Bot):
    await add_user(tg_id=message.from_user.id, last_time_online=datetime.datetime.now())

    # logging.info(message)
    if command.args:
        referrer_id = decode_payload(command.args)
        if int(referrer_id) != message.from_user.id:
            # logging.info(f"{referrer_id} {type(referrer_id)}, {} {}")
            user = await get_user_by_id(message.from_user.id)
            if user.invited:
                await bot.send_message(chat_id=message.from_user.id, text="<strong>You've already followed a referral link!</strong>", parse_mode='html')
                await bot.send_message(chat_id=referrer_id, text=f"<strong>*{message.from_user.first_name}* has already been invited by another user!</strong>", parse_mode='html')
            else:
                await add_user(tg_id=message.from_user.id, invited=True)
                await increase_mpx_balance(user_id=referrer_id, amount=30)
                await bot.send_message(chat_id=referrer_id, 
                                    text=f'<strong>Congratulations! *{message.from_user.first_name}* followed your referral link!</strong>\n'
                                            f'<strong>You earned 30 MPX!</strong>\n\n'
                                            f'<strong>Now your balance is {(await get_user_by_id(referrer_id)).balance_mpx} MPX!</strong>\n\n',
                            
                                        parse_mode='html'
                                    )
        else:
            await bot.send_message(chat_id=referrer_id, text="<strong>You can't follow your referral link!</strong>", parse_mode='html')
        
    await add_user(tg_id=message.from_user.id, username=message.from_user.username if message.from_user.username else "USER_HAVE_NOT_USERNAME", first_name=message.from_user.first_name)
    butns=[
        InlineKeyboardButton(text="Open Tetris!", web_app=WebAppInfo(url="https://crossfigod.io/tetris.html")),
        InlineKeyboardButton(text="XFI Bot", url="https://t.me/xficonsolebot?start=6955245170"),
        InlineKeyboardButton(text="CrossFi Channel", url="https://t.me/crossfichain"),
        InlineKeyboardButton(text="Add New Network in METAMASK", callback_data="instruction")
        ]
    await message.answer(f"<strong>Hey, @{message.from_user.username if message.from_user.username else message.from_user.full_name}! This is the CrossFi Bot.</strong>", parse_mode='html', reply_markup= await kb_for_bot.create_menu())
    await message.answer("""<strong>
What can our bot do:

• Create a CrossFi crypto wallet;
• Mine MPX tokens in our game;
• Develop a referral network and much more.
➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
How to play and earn? It's very simple:

<i>
  ⚙️ 1. Creating a crypto wallet on the Cross Fi Network. 
  💳 2. Linking more than 7 wallets including Metamask. 
  💵 3. Referral program with earning MPX coins in the CrossFi Test Net blockchain network.
  💰 4. Earning MPX coins in the game itself. 
  🎁 5. Log in for 30 days in a row and open one of three chests where 100 XFI coins can drop. 
  💸 6. Exchange MPX for XFI and vice versa. 
  👏 7. Send MPX coins to friends and receive coins from friends to your unique wallet number.
  ✏️ 8. Track transactions in the Blockchain Explorer.
  💯 9. Send the earned coins to betting and get passive earnings. Comming soon…
  🌟 10. Buy boost with 15 XFI and get <code>x2</code> MPX in 24 hours.
  ✅ 11. Send 50 XFI and create your unic coin in CrossFi Testnet, in a matter of minutes by filling out the form and connecting Metamask.
</i>
➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
All the MPX you earn will be received on the testnet! How much you can earn and how long you will earn MPX depends only on you.

After the emission is complete, the MPX conversion rate to mainnet will be set.</strong>""",
 parse_mode='html',
 reply_markup=InlineKeyboardBuilder().row(*butns, width=1).as_markup())



@dp.callback_query(F.data == 'instruction')
async def test_instruction(cb: types.CallbackQuery):
    await cb.answer('')
    await cb.message.answer_photo(photo="AgACAgQAAxkBAAIFU2bV_cXvtJszGrCORgPM_Nmqhy6kAAKXxjEbhAOxUsiWgHS6WuznAQADAgADeQADNQQ", caption='''
<strong>❤️ Add New Network in METAMASK 🦊: CROSS FI ❤️</strong>

➡️ <strong>Step 1:</strong> Network Name  
 <strong>CROSS FI</strong>

➡️ <strong>Step 2:</strong> New RPC URL  
 <strong>https://rpc.testnet.ms</strong>

➡️ <strong>Step 3:</strong> Blockchain ID  
 <strong>4157</strong>

➡️ <strong>Step 4:</strong> Currency Symbol  
 <strong>XFI</strong>
                                  
➡️ <strong>Step 5:</strong> URL Blockchain EXPLORER
 <strong>https://scan.xfi.ms/</strong>
                                  
✅ Add the <strong>CROSS FI</strong> network and explore its features today! If you have any questions or need assistance, feel free to reach out. 

#Crypto #Blockchain #CROSSFI #XFI #CrossFiGod #Future
''', parse_mode='html')







@dp.message(F.text == '👤 Profile')
async def send_profile(message: types.Message):
    await add_user(tg_id=message.from_user.id, last_time_online=datetime.datetime.now())
    user = await get_user_by_id(message.from_user.id)
    await message.reply(f"Your Profile:\n\n"
                        f"Name: <strong>{message.from_user.full_name}</strong>\n"
                        f"Days Online: <strong>{user.days_online}</strong>\n\n"
                        f'Balance: <code>{user.balance_mpx}</code> MPX\n\n'
                        f'Your referral link: <a href="{await create_start_link(bot=bot, payload=message.from_user.id, encode=True)}">COPY</a>\n\n'
                        f'TON Wallet: <code>{user.ton_wallet_address}</code>\n\n'
                        f'MetaMask Wallet: <code>{user.metamask_wallet_address}</code>',
                        reply_markup= await kb_for_bot.create_inline_key(width=1, **{"buy_mpx":"Buy MPX", "withdraw_xfi":"SWAP >XFI to MPX<"}),
                        parse_mode='html')






class BuyMPX(StatesGroup):
    amount = State()
    confirm = State()


@dp.callback_query(F.data == 'buy_mpx')
async def buy_mpx(cb: types.CallbackQuery, state: FSMContext):
    await cb.answer('')
    await cb.message.answer('Enter the amount of MPX you want to buy, \n\n 1 XFI = 36 MPX')
    await state.set_state(BuyMPX.amount)


@dp.message(BuyMPX.amount)
async def process_transfer_amount(message: types.Message, state: FSMContext):
    try:
        amount = round(float(message.text)/36, ndigits=5)
        if int(message.text) > 99:
            await state.update_data(amount=float(message.text))
            await message.answer(f'<strong>You will get <code>{message.text} MPX</code> by <code>{amount}</code> XFI.\n'
                                f'Please send XFI to: \n\n<code>0x3f0f364124428BAff7A258a587eFC5ff6aed08AF</code>.\n\nThen, <code>search transaction hash</code> on <a href="https://scan.xfi.ms/">SCAN.XFI.MS</a>'
                                '\n\nPress "Check hash" button, to credit MPX\n\n'
                                '❗️Enter strictly the same number in MPX, use only your metamask address in profile, otherwise the bot will not be able to recognize it!</strong>', 
                                parse_mode='html',
                                reply_markup=kb_for_bot.InlineKeyboardBuilder().row(
                                        kb_for_bot.InlineKeyboardButton(text='Check hash', callback_data=f'check_hash'),
                                        width=1
                                    ).as_markup()
                                    )
        else:
            await message.answer('<strong>Invalid amount, minimum sum to convert is <code>100 MPX</code>. Please try later.</strong>', parse_mode='html')
            await state.clear()
    except:
        await message.answer('<strong>Invalid amount. Please try again.</strong>', parse_mode='html')
        await state.clear()
        
    

class WaitForHash(StatesGroup):
    amount = State()
    hash = State()


@dp.callback_query(F.data.startswith('check_hash'))
async def check_user_hash(cb: types.CallbackQuery, state: FSMContext):
    await cb.message.answer('<strong>Enter the hash that you received from transaction, you can search it on <a href="https://scan.xfi.ms/">SCAN.XFI.MS</a></strong>',
                            parse_mode='html')
    await state.set_state(WaitForHash.hash)

@dp.message(WaitForHash.hash)
async def process_hash(message: types.Message, state: FSMContext):
    data = await state.get_data()
    try:
        user = await get_user_by_id(message.from_user.id)
        if await xfi_sender.check_tx_hash(message.text, amount=round(float(data['amount'])/36, ndigits=5), _from=user.metamask_wallet_address, message=message):
            await message.answer(f'<strong>MPX has been credited successfully. You have <code>{ round(user.balance_mpx + data["amount"])} MPX</code> now.</strong>', parse_mode='html')
            await add_user(tg_id=message.from_user.id, balance_mpx=round(user.balance_mpx + data['amount']))
            await state.clear()
        else:
            await message.answer("<strong>Invalid hash or transaction wasn't found. Please try again.</strong>", parse_mode='html')
            await state.clear()
    except:
        await message.answer("<strong>Invalid hash or transaction wasn't found. Please try again.</strong>", parse_mode='html')
        await state.clear()
        




class WithdrawXFI(StatesGroup):
    amount = State()
    confirm = State()

@dp.callback_query(F.data=='withdraw_xfi')
async def buy_mpx(cb: types.CallbackQuery, state: FSMContext):
    await cb.answer('')
    await cb.message.answer('Enter the amount you want to withdraw in MPX, \n\n 36 MPX = 1 XFI')
    await state.set_state(WithdrawXFI.amount)

@dp.message(WithdrawXFI.amount)
async def process_transfer_amount(message: types.Message, state: FSMContext):
    try:
        amount = float(message.text)
        if amount < 200:
            await message.answer('<strong>Invalid amount, minimum sum to convert is <code>200 MPX</code>. Please try later.</strong>', parse_mode='html')
            await state.clear()
            return
        
        user = await get_user_by_id(message.from_user.id)
        if user.balance_mpx < amount:
            await message.answer('Insufficient funds')
            await state.clear()
            return

    except ValueError:
        await message.answer('<strong>Invalid amount. Please try again.</strong>', parse_mode='html')
        await state.clear()
        return
    
    await state.update_data(amount=float(amount))
    
    await message.answer('<strong>Confirm the transfer?\n'
                        f'Transfer Metamask Address: <code>{(await get_user_by_id(message.from_user.id)).metamask_wallet_address}</code>\n'
                        f'Transfer Amount: <code>{round(float(amount)/45, ndigits=5)}</code> XFI</strong>',
                        parse_mode='html',
                        reply_markup=InlineKeyboardBuilder().add(InlineKeyboardButton(text="Confirm", callback_data="confirm_transfer_xfi")).add(InlineKeyboardButton(text="Cancel", callback_data="cancel_transfer_xfi")).as_markup())
    await state.set_state(TransferFunds.confirm)

@dp.callback_query(F.data == 'confirm_transfer_xfi')
async def confirm_transfer(callback: types.CallbackQuery, bot: Bot, state: FSMContext):
    try:
        await bot.delete_message(chat_id=callback.from_user.id, message_id=callback.message.message_id)
    except:
        pass

    await callback.answer('')
    data = await state.get_data()
    

    user = await get_user_by_id(callback.from_user.id)

    try:
        await callback.message.answer("<strong>Please wait...</strong>", parse_mode='html')
        
        tx_hash, tx_block = await xfi_sender.transfer_to(round(float(data["amount"])/45, ndigits=5), user.metamask_wallet_address)
        new_balance = user.balance_mpx - int(data["amount"]) if user.balance_mpx - int(data["amount"]) > 0 else 0
        await add_user(tg_id=user.tg_id, balance_mpx=new_balance)
        
        await callback.message.answer(f'<strong>Money transfered, \ntransaction hash: <code>{tx_hash}</code>\ntransaction block number: <code>{tx_block}</code></strong>',
                                      parse_mode='html')
        
    except:
        await callback.message.answer('<strong>Error: Failed to send XFI. Please try again later.</strong>', parse_mode='html')
        await state.clear()
        return



@dp.callback_query(F.data == 'cancel_transfer_xfi')
async def cancel_transfer(callback: types.CallbackQuery, state: FSMContext):
    
    await callback.answer('')
    await state.clear()
    await callback.message.answer('Transfer canceled')









@dp.message(F.text == '💲 Earn')
async def send_reflink(message: types.Message, bot: Bot):
    await add_user(tg_id=message.from_user.id, last_time_online=datetime.datetime.now())
    user = await get_user_by_id(message.from_user.id)
    await message.reply(f"<strong>Your current balance: <code>{user.balance_mpx}</code> MPX</strong>\n\n"
                        f"<strong>To earn 30 MPX, send your referral link: <a href='{await create_start_link(bot=bot, payload=message.from_user.id, encode=True)}'>COPY</a></strong>\n\n",
                        parse_mode='html')



@dp.message(F.text == '🌐 XFI Site')
async def send_info1(message: types.Message, bot: Bot):
    await add_user(tg_id=message.from_user.id, last_time_online=datetime.datetime.now())
    await message.answer('<strong>Here CROSSFI Site:</strong> <a href="https://crossfi.org">CROSS FI</a>', parse_mode='html')


@dp.message(F.text == '📣 Our Channel')
async def send_info2(message: types.Message, bot: Bot):
    await add_user(tg_id=message.from_user.id, last_time_online=datetime.datetime.now())
    u_status = await bot.get_chat_member(chat_id=-1002222915855, user_id=message.from_user.id)
    if isinstance(u_status, types.ChatMemberMember) or isinstance(u_status, types.ChatMemberAdministrator) or isinstance(u_status, types.ChatMemberOwner):
        user = await get_user_by_id(message.from_user.id)
        await add_user(tg_id=message.from_user.id) if user.subscribed == 1 else  await add_user(tg_id=message.from_user.id, balance_mpx=user.balance_mpx+7,  subscribed=1)
        await message.answer('<strong>Thanks for subscribe!</strong>', parse_mode='html')

    await message.answer('<strong>Here Our Channel:</strong> <a href="https://t.me/crossfigod">СHANNEL</a> \n\nSubscribe and get 7 MPX!', parse_mode='html')

@dp.message(F.text == '🏆 Top Players')
async def send_players(message: types.Message, bot: Bot):
    await add_user(tg_id=message.from_user.id, last_time_online=datetime.datetime.now())
    users = await get_all_users()
    sp = 'TOP 10 PLAYERS:\n\n'
    c = 1
    for num, user in enumerate(sorted(users, key=lambda user: user.balance_mpx, reverse=True), start=1):
        sp += f'<strong>{num}. {"@"+user.username if user.username != None else user.first_name}: {user.balance_mpx} MPX</strong>\n'
        
        if c == 10:
            break
        c+=1

    await message.answer(sp, parse_mode='html')






class TransferFunds(StatesGroup):
    transfer_address = State()
    transfer_amount = State()
    confirm = State()

@dp.message(F.text == '💸 Transfer Funds')
async def send_transfer_funds(message: types.Message, state: FSMContext):
    await add_user(tg_id=message.from_user.id, last_time_online=datetime.datetime.now())
    await message.answer('Enter the wallet address you received in the bot @TetrisCrossfi_Bot')
    await state.set_state(TransferFunds.transfer_address)

@dp.message(TransferFunds.transfer_address)
async def process_transfer_address(message: types.Message, state: FSMContext):
    await state.update_data(transfer_address=message.text)
    await message.answer('Enter the amount you want to transfer in MPX')
    await state.set_state(TransferFunds.transfer_amount)

@dp.message(TransferFunds.transfer_amount)
async def process_transfer_amount(message: types.Message, state: FSMContext):
    try:
        amount = float(message.text)
    except ValueError:
        await message.answer('<strong>Invalid amount. Please try again.</strong>', parse_mode='html')
        await state.clear()
        return
    await state.update_data(transfer_amount=amount)
    data = await state.get_data()
    await message.answer('Confirm the transfer?\n'
                        f'Transfer Address: {data["transfer_address"]}\n'
                        f'Transfer Amount: {data["transfer_amount"]} MPX',
                        reply_markup=InlineKeyboardBuilder().add(InlineKeyboardButton(text="Confirm", callback_data="confirm_transfer")).add(InlineKeyboardButton(text="Cancel", callback_data="cancel_transfer")).as_markup())
    await state.set_state(TransferFunds.confirm)

@dp.callback_query(F.data == 'confirm_transfer')
async def confirm_transfer(callback: types.CallbackQuery, state: FSMContext):
    await callback.answer('')
    data = await state.get_data()
    try:
        id_to_transfer = await decode_wallet(data['transfer_address'])
    except ValueError:
        await callback.message.answer('Invalid wallet address')
        state.clear()
        return
    user = await get_user_by_id(callback.from_user.id)
    user_to_transfer = await get_user_by_id(int(id_to_transfer))

    if user.balance_mpx < data["transfer_amount"]:
        await callback.message.answer('Insufficient funds')
        state.clear()
        return
    try:
        logging.info(f"transfer: {id_to_transfer}")
        await bot.send_message(id_to_transfer, f'Transferred {data["transfer_amount"]} MPX from <code>{await create_wallet(callback.from_user.id)}</code>')
        user.balance_mpx -= data["transfer_amount"]

        await update_user_data(tg_id=user.tg_id, balance_mpx=user.balance_mpx)
        await update_user_data(tg_id=id_to_transfer, balance_mpx=user_to_transfer.balance_mpx + data['transfer_amount'])
        await callback.message.answer('Transfer successful')
        await state.clear()
    except TelegramBadRequest:
        await callback.message.answer('User is not authorized!\nPlease ask the user to press /start')
        await state.clear()

@dp.callback_query(F.data == 'cancel_transfer')
async def cancel_transfer(callback: types.CallbackQuery, state: FSMContext):
    await callback.answer('')
    await state.clear()
    await callback.message.answer('Transfer canceled')


@dp.message(F.text == '💰 Get Wallet')
async def send_get_wallet(message: types.Message):
    await add_user(tg_id=message.from_user.id, last_time_online=datetime.datetime.now())
    await message.answer(text=f'<strong>Your Wallet Address Is:</strong>\n\n<code>{await create_wallet(message.from_user.id)}</code>', parse_mode='html')


@dp.callback_query(F.data == 'cancel_state')
async def cancel_state(cb: types.CallbackQuery, bot: Bot, state: FSMContext):
    await bot.delete_message(chat_id=cb.from_user.id, message_id=cb.message.message_id)
    await cb.message.answer('Cancelled ...')
    await state.clear()

class CreateToken(StatesGroup):
    token_name = State()
    token_symbol = State()
    supply_amount = State()
    metamask_address = State()

@dp.message(F.text == '🪄 Create Token')
async def create_token(message: types.Message, state: FSMContext):
    await add_user(tg_id=message.from_user.id, last_time_online=datetime.datetime.now())
    await message.answer(text=f'''<strong>
1. Token Name - 
2. Token Symbol - 
3. Supply Amount -
4. Metamask CrossFi Chain Wallet Adress -
                         
❗️Enter token name: </strong>''', 
    reply_markup= await kb_for_bot.create_delete_message_kb(),
    parse_mode='html')
    await state.set_state(CreateToken.token_name)


@dp.message(CreateToken.token_name)
async def create_token1(message: types.Message, bot: Bot, state: FSMContext):
    await state.update_data(token_name=message.text)
    try:
        await bot.delete_messages(chat_id=message.from_user.id, message_ids=[message.message_id, message.message_id-1])
    except:
        pass

    await message.answer(text=f'''<strong>
1. Token Name - {message.text}
2. Token Symbol - 
3. Supply Amount -
4. Metamask CrossFi Chain Wallet Adress -
                         
❗️Enter token symbol: </strong>''', 
    reply_markup= await kb_for_bot.create_delete_message_kb(),
    parse_mode='html')
    await state.set_state(CreateToken.token_symbol)


@dp.message(CreateToken.token_symbol)
async def create_token_symbol(message: types.Message, bot: Bot, state: FSMContext):
    await state.update_data(token_symbol=message.text)
    data = await state.get_data()
    try:
        await bot.delete_messages(chat_id=message.from_user.id, message_ids=[message.message_id, message.message_id-1])
    except:
        pass
    
    await message.answer(text=f'''<strong>
1. Token Name - {data['token_name']}
2. Token Symbol - {message.text}
3. Supply Amount -
4. Metamask CrossFi Chain Wallet Adress -
                         
❗️Enter supply amount: </strong>''', 
    reply_markup= await kb_for_bot.create_delete_message_kb(),
    parse_mode='html')
    await state.set_state(CreateToken.supply_amount)



@dp.message(CreateToken.supply_amount)
async def create_supply_amount(message: types.Message, bot: Bot, state: FSMContext):
    await state.update_data(supply_amount=message.text)
    data = await state.get_data()
    try:
        await bot.delete_messages(chat_id=message.from_user.id, message_ids=[message.message_id, message.message_id-1])
    except:
        pass
    
    await message.answer(text=f'''<strong>
1. Token Name - {data['token_name']}
2. Token Symbol - {data['token_symbol']}
3. Supply Amount - {message.text}
4. Metamask CrossFi Chain Wallet Adress -
                         
❗️Enter metamask address: </strong>''', 
    reply_markup= await kb_for_bot.create_delete_message_kb(),
    parse_mode='html')
    await state.set_state(CreateToken.metamask_address)

@dp.message(CreateToken.metamask_address)
async def create_supply_amount(message: types.Message, bot: Bot, state: FSMContext):
    await state.update_data(metamask_address=message.text)
    data = await state.get_data()
    try:
        await bot.delete_messages(chat_id=message.from_user.id, message_ids=[message.message_id, message.message_id-1])
    except:
        pass
    
    await message.answer(text=f'''<strong>
1. Token Name - {data['token_name']}
2. Token Symbol - {data['token_symbol']}
3. Supply Amount - {data['supply_amount']}
4. Metamask CrossFi Chain Wallet Adress - <code>{message.text}</code>
                         
❗️Send to admin for review?</strong>''', 
    reply_markup= kb_for_bot.InlineKeyboardBuilder().row(
        kb_for_bot.InlineKeyboardButton(text='Yes!', callback_data=f"send_admin_{'~'.join([data['token_name'], data['token_symbol'], data['supply_amount'], message.text, '@'+message.from_user.username or message.from_user.url])}"),
        kb_for_bot.InlineKeyboardButton(text="I'm not ready", callback_data='cancel_state'),
        ).as_markup(),
    parse_mode='html')
    await state.clear()



@dp.callback_query(F.data.startswith('send_admin_'))
async def send_admin(cb: types.CallbackQuery, bot: Bot):
    data = cb.data.split('_')
    token_name, token_symbol, supply_amount, wallet_address, username = data[-1].split('~')
    logging.info(f"{token_name}, {token_symbol}, {supply_amount}, {wallet_address}, {username}")

    # 6955245170 admin id
    await bot.send_message(chat_id=6955245170, text=f'''<strong>
New user wants to create his/her token!
          
user: {username}
                           
1. Token Name - {token_name}
2. Token Symbol - {token_symbol}
3. Supply Amount - {supply_amount}
4. Metamask CrossFi Chain Wallet Adress - <code>{wallet_address}</code></strong>''')
    
    await cb.message.answer('<strong>The information has been sent to the admin, please wait...</strong>', parse_mode='html')






@dp.message(F.text == '🔝 Boost!')
async def create_token(message: types.Message):
    await add_user(tg_id=message.from_user.id, last_time_online=datetime.datetime.now())
    await message.answer(text=f"""<strong>Send 30 XFI to:\n\n <code>mx1xstspatexlx26tae59rfdc778mjzl3we9vu8cq</code>\n\n wallet in <i>MAINNET</i>!!!\n\nWhen you're ready, click on the "Send hash to admin" button</strong>""", 
                         reply_markup=kb_for_bot.InlineKeyboardBuilder().row(
                                kb_for_bot.InlineKeyboardButton(text='Send hash to admin', callback_data='send_hash_to_admin')
                             ).as_markup(),
                         parse_mode='html')
    


class WaitForHashToSend(StatesGroup):
    hash = State()


@dp.callback_query(F.data == 'send_hash_to_admin')
async def check_user_hash(cb: types.CallbackQuery, state: FSMContext):
    await cb.message.answer('<strong>Enter the hash that you received from transaction, you can search it on <a href="https://scan.xfi.ms/">SCAN.XFI.MS</a></strong>',
                            parse_mode='html')
    await state.set_state(WaitForHashToSend.hash)



@dp.message(WaitForHashToSend.hash)
async def send_hash_to_admin(message: types.Message, state: FSMContext):
    await bot.send_message(chat_id=6955245170, text=f'''<strong>
    New user wants to get 2x MPX in tetris!
            
    user: {"@"+message.from_user.username if message.from_user.username else message.from_user.url}
                   
    tx hash - <code>{message.text}</code></strong>''',
    reply_markup=kb_for_bot.InlineKeyboardBuilder().row(
                                kb_for_bot.InlineKeyboardButton(text='Confirm 2x MPX', callback_data=f'boost_confirm:{message.from_user.id}'),
                                kb_for_bot.InlineKeyboardButton(text='Decline 2x MPX', callback_data=f'boost_decline:{message.from_user.id}'),

                             ).as_markup(),
                         parse_mode='html')
    

    await bot.send_message(chat_id=1060834219, text=f'''<strong>
    New user wants to get 2x MPX in tetris!
            
    user: {"@"+message.from_user.username if message.from_user.username else message.from_user.url}
                   
    tx hash - <code>{message.text}</code></strong>''',
    reply_markup=kb_for_bot.InlineKeyboardBuilder().row(
                                kb_for_bot.InlineKeyboardButton(text='Confirm 2x MPX', callback_data=f'boost_confirm:{message.from_user.id}'),
                                kb_for_bot.InlineKeyboardButton(text='Decline 2x MPX', callback_data=f'boost_decline:{message.from_user.id}'),

                             ).as_markup(),
                         parse_mode='html')
        
    await message.answer('<strong>The information has been sent to the admin, please wait...</strong>', parse_mode='html')




async def null_user_boost(user_id):
    await add_user(tg_id=user_id, boost_expires_at=null())
    await bot.send_message(chat_id=user_id, text=f'''<strong>Your Boost Expired!</strong>''', parse_mode='html')

@dp.callback_query(F.data.startswith('boost_'))
async def confirm_or_decline(cb: types.CallbackQuery, bot: Bot):
    data = cb.data.split('_')
    action, user_id = data[-1].split(':')

    try:await bot.delete_message(chat_id=user_id, message_id=cb.message.message_id)
    except: pass

    if action == 'decline':
        await add_user(tg_id=user_id, boost_expires_at=null())
        await bot.send_message(chat_id=user_id, text=f'''<strong>Admin declined your boost.</strong>''', parse_mode='html')
        await cb.message.answer('<strong>You declined. The information has been sent to user</strong>', parse_mode='html')
    else:
        await bot.send_message(chat_id=6955245170, text=f'''Boost activated!\n<strong>2x MPX by user: {"@"+cb.from_user.username if cb.from_user.username else cb.from_user.url}</strong>''',
                            parse_mode='html')
        
        await add_user(tg_id=user_id, boost_expires_at=datetime.datetime.now() + datetime.timedelta(hours=24))
        scheduler.add_job(null_user_boost, 'date', run_date=datetime.datetime.now() + datetime.timedelta(hours=24), args=(cb.from_user.id,))


        await bot.send_message(chat_id=user_id, text='<strong>Congratulations, admin agreed 2x MPX in Tetris! 🎉</strong>', parse_mode='html')







async def check_users_online(bot1: Bot):
    users = await get_all_users()
    for user in users:
        try:
    
            if (int(user.days_online) == 30) or (int(user.days_online) == 31):
                
                await add_user(tg_id=user.tg_id, days_online=0)
                await bot1.send_message(chat_id=user.tg_id, text="<strong>Congratulations, you've been playing Tetris for a month! choose three gifts, one of them contains 36 XFI!</strong>",
                                    reply_markup=await kb_for_bot.create_lottery(),
                                    parse_mode='html') 
                
            elif user.last_time_online.day != datetime.datetime.now().day:
                await add_user(tg_id=user.tg_id,  days_online=0)
                await bot1.send_message(chat_id=user.tg_id, text="<strong>The day counter on your account has been reset due to inactivity!</strong>",
                                    parse_mode='html')


            else:
                await add_user(tg_id=user.tg_id, days_online=user.days_online + 1 if user.days_online else 1)
        except Exception as e:
            pass



@dp.callback_query(F.data.startswith('prize_'))
async def win_or_lose(cb: types.CallbackQuery):
    
    try: 
        await bot.delete_message(chat_id=cb.from_user.id, message_id=cb.message.message_id)
    except:
        pass

    await cb.answer('')
    data = cb.data.split('_')[-1]
    user = await get_user_by_id(cb.from_user.id)
    if data == 'win':
        try:
            tx_hash, tx_block = await xfi_sender.transfer_to(amount=0.36, recipient_address=user.metamask_wallet_address)
        except:
            await cb.message.answer("<strong>Error occurred while transferring funds to your wallet!</strong>", parse_mode='html')
            return
        
        await cb.message.answer(f'<strong>Congratulations! You won 36 XFI!</strong>', parse_mode='html')
        await cb.message.answer(f'<strong>Money transfered, \ntransaction hash: <code>{tx_hash}</code>\ntransaction block number: <code>{tx_block}</code></strong>',
                                      parse_mode='html')
    else:
        await bot.send_message(chat_id=user.tg_id, text="<strong>You chose the wrong box!</strong>", parse_mode='html')
    


async def main():
    scheduler.start()
    

    scheduler.add_job(func=check_users_online, trigger="cron", hour="23", minute="50", args=(bot, ))
    
    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s - [%(levelname)s] - %(asctime)s -  %(name)s - "
                               "(%(filename)s).%(funcName)s(%(lineno)d) - %(message)s"
                        )

    

    await dp.start_polling(bot, skip_updates=True)



# Запуск бота
if __name__ == '__main__':
    asyncio.run(main())
