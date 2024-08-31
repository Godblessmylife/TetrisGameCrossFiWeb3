from quart import Quart,  render_template, websocket, request, send_file

import aiohttp

from bot import bot
from database.requests import update_user_data, increase_mpx_balance, get_user_by_id

import logging as lg

import json


app: Quart = Quart(__name__)


async def check_if_user():
    # print(request.referrer)
    if request.referrer == None:
        return False
    if (request.referrer.split('/')[-1] != "game.html") and (request.referrer.split('/')[-1] != "metamask.html") and (request.referrer.split('/')[-1] != "wallet.html"):
        return True
    return False


async def get_user_friendly_address(address: str, attempt: int = 1):
    async with aiohttp.ClientSession() as session:
        response = await session.get(f'https://toncenter.com/api/v3/addressBook?address={address}')
        json_answer = await response.json()
        # print(json_answer)
        try:
            if json_answer['ok'] == False and json_answer["code"] == 429:
                print(f'limit exceed, trying again... attempt: {attempt}')
                return await get_user_friendly_address(address=address, attempt=attempt+1)
        except KeyError:
            pass
        return json_answer[address]['user_friendly']




@app.route('/<string:file>.html', methods=['GET'])
async def main(file) -> str:
    return await render_template(f'{file}.html')





@app.route('/js/<string:file>', methods=['GET'])
async def get_js(file):
    return await send_file(f'js/{file}', mimetype='text/javascript')


@app.route('/sprites/<string:file>', methods=['GET'])
async def get_sprites(file):
    return await send_file(f'sprites/{file}', mimetype='image/jpeg')
    
@app.route('/css/<string:file>', methods=['GET'])
async def get_css(file):
    return await send_file(f'css/{file}', mimetype='text/css')

@app.route('/sounds/<string:file>', methods=['GET'])
async def get_sounds(file):
    return await send_file(f'sounds/{file}', mimetype='audio/mpeg')


@app.route('/favicon.ico', methods=['GET'])
async def get_fav():
    return await send_file('favicon.ico')

@app.route('/manifest.json', methods=['GET'])
async def send_manifest() -> str:
    return await send_file(f'manifest.json', mimetype='text/json')


@app.route('/datafromgame', methods=['POST'])
async def get_data_from_game() -> str:
    try:
        if await check_if_user():
            return json.dumps({'success': False, 'error': "you doesn't have permission"})
    except:
        pass

    data = await request.get_json()
    id = data['from_tg']['user']['id']

    if data['score'] != 0:
        await increase_mpx_balance(user_id=id, amount=data['score'])
        user = await get_user_by_id(tg_id=id)
        await bot.send_message(chat_id=id, text=f"Congratulations, <strong>{data['from_tg']['user']['first_name']}</strong>!\n"
                               f"You earned <code>{data['score']}</code> <strong>MPX</strong> points!\n\n"
                               f"Now, your balance is {user.balance_mpx} <strong>MPX</strong>", 
                               parse_mode='html')
 
    return json.dumps({'success': True})



@app.route('/datafrommetamask', methods=['POST'])
async def get_data_from_metaMask() -> str:
    try:
        if await check_if_user():
            return json.dumps({'success': False, 'error': "you doesn't have permission"})
    except:
        pass

    data = await request.get_json()
    try: id = data['from_tg']['user']['id']
    except: return json.dumps({'success': False, 'error': "you aren't using telegram"})

    await update_user_data(tg_id=id, metamask_wallet_address=data['MetaMaskWallet'])

    await bot.send_message(chat_id=id, text=f"New connection, your wallet is {data['MetaMaskWallet']}")

    return json.dumps({'success': True})


@app.route('/datafromtonconnect', methods=['POST'])
async def get_data_from_tonconnect() -> str:
    try:
        if await check_if_user():

            return json.dumps({'success': False, 'error': "you doesn't have permission"})
    except:
        pass


    data = await request.get_json()
    try: id = data['from_tg']['user']['id']
    except: return json.dumps({'success': False, 'error': "you aren't using telegram"})

    uf_addres = await get_user_friendly_address(address=data['ton_connect_address'])
    await update_user_data(tg_id=id, ton_wallet_address=uf_addres)

    return json.dumps({'success': True})





import asyncio



if __name__ == '__main__':
    asyncio.run(app.run(debug=False, host='127.0.0.1', port=5500))
