from aiogram.types import KeyboardButton, InlineKeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder, InlineKeyboardBuilder

import random

async def create_menu():
    menu: ReplyKeyboardBuilder = ReplyKeyboardBuilder()
    buttons: list[KeyboardButton] = []

    # '👤 Profile', '💸 Transfer funds', '💰 Get Wallet'
    buttons.append(KeyboardButton(text='👤 Profile'))
    buttons.append(KeyboardButton(text='💲 Earn'))
    buttons.append(KeyboardButton(text='💸 Transfer Funds'))
    buttons.append(KeyboardButton(text='💰 Get Wallet'))
    buttons.append(KeyboardButton(text='📣 Our Channel'))
    buttons.append(KeyboardButton(text='🌐 XFI Site'))
    buttons.append(KeyboardButton(text='🏆 Top Players'))
    buttons.append(KeyboardButton(text='🪄 Create Token'))
    buttons.append(KeyboardButton(text='🔝 Boost!'))

    menu.row(*buttons, width=2)

    return menu.as_markup(resize_keyboard=True)



async def create_reply_key(width : int, *args: str, **kwargs: str ):

    menu: ReplyKeyboardBuilder = ReplyKeyboardBuilder()
    buttons: list[KeyboardButton] = []

    if args:
        for button in args:
            buttons.append(KeyboardButton(text=button))
    if kwargs:
        for key, val in kwargs.items():
            buttons.append(KeyboardButton(text=val))
    menu.row(*buttons, width=width)

    return menu.as_markup(resize_keyboard=True)



async def create_inline_key(width : int, *args: str, **kwargs: str ):
    kb_bld: InlineKeyboardBuilder = InlineKeyboardBuilder()

    buttons: list[InlineKeyboardButton] = []
    if args:
        for button in args:
            buttons.append(InlineKeyboardButton(text=kb_bld[button] if button in kb_bld else button, callback_data=button))
    if kwargs:
        for key, button in kwargs.items():
            buttons.append(InlineKeyboardButton(text=button, callback_data=key))
    kb_bld.row(*buttons, width=width)
    return kb_bld.as_markup()



async def create_lottery():
    bldr: InlineKeyboardBuilder = InlineKeyboardBuilder()

    buttons: list[InlineKeyboardButton] = [
        InlineKeyboardButton(text='1🎁', callback_data='prize_win'),
        InlineKeyboardButton(text='🎁', callback_data='prize_lose'),
        InlineKeyboardButton(text='🎁', callback_data='prize_lose')
    ]

    random.shuffle(buttons)
    bldr.row(*buttons, width=3)

    return bldr.as_markup()






async def create_delete_message_kb():
    kb_bld: InlineKeyboardBuilder = InlineKeyboardBuilder()
    buttons: list[InlineKeyboardButton] = [
        InlineKeyboardButton(text='❌ Cancel', callback_data='cancel_state'),
    ]
    kb_bld.row(*buttons, width=1)
    return kb_bld.as_markup()