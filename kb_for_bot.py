from aiogram.types import KeyboardButton, InlineKeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder, InlineKeyboardBuilder

import random

async def create_menu():
    menu: ReplyKeyboardBuilder = ReplyKeyboardBuilder()
    buttons1: list[KeyboardButton] = []
    buttons2: list[KeyboardButton] = []

    # '👤 Profile', '💸 Transfer funds', '💰 Get Wallet'
    buttons1.append(KeyboardButton(text='👤 Profile'))
    buttons1.append(KeyboardButton(text='💲 Earn'))
    menu.row(*buttons1, width=1)
    buttons2.append(KeyboardButton(text='💸 Transfer Funds'))
    buttons2.append(KeyboardButton(text='💰 Get Wallet'))
    buttons2.append(KeyboardButton(text='📣 Our Channel'))
    buttons2.append(KeyboardButton(text='🌐 XFI Site'))
    buttons2.append(KeyboardButton(text='🏆 Top Players'))


    menu.row(*buttons2, width=2)

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