from database.models import async_session, User, Transaction


import logging
from sqlalchemy import select, update, null
from sqlalchemy.exc import IntegrityError

# from models import async_session, User, Transaction


async def add_user(**data: dict):
    """
    Добавление нового пользователя
    :param data:
    :return:
    """
    logging.info(f"add_user")
    
    try:
        async with async_session() as session:
            
                session.add(User(**data))
                await session.commit()
                
                
        
    except:
        await session.execute(update(User).where(User.tg_id == data['tg_id']).values(**data))
        await session.commit()
     
            

async def add_transaction(**data: dict):
    """
    Добавление новой транзакции\n
    :param: tx_hash - transaction hash\n
            _from - address\n
            from_user_id - tg_usr_id
    :return: 
    """
    try:
        async with async_session() as session:
            
                session.add(Transaction(**data))
                await session.commit()
            
                return True
                
    except IntegrityError:

        return False




async def update_user_data(**data):
    """
    Обновление данных о пользователе
    :param data:
    :return:
    """
    logging.info("update_user_data")
    async with async_session() as session:
        await session.execute(update(User).where(User.tg_id == data['tg_id']).values(**data))
        await session.commit()


async def get_user_by_id(tg_id: int) -> User:
    """
    Получение пользователя по tg_id
    :param tg_id:
    :return:
    """
    logging.info("get_user_by_id")
    query = select(User).where(User.tg_id == tg_id)
    async with async_session() as session:
        result = await session.execute(query)
        return result.first()[0]


async def get_all_users() -> list[User]:
    """
    Получение всех пользователей
    :return:
    """
    logging.info("get_all_user")
    query = select(User)
    async with async_session() as session:
        result = await session.execute(query)
        return [i[0] for i in result.fetchall()]




async def increase_mpx_balance(user_id: int, amount: int):
    """
    Увеличение баланса mpx
    :param user_id:
    :param amount:
    :return:
    """
    logging.info(f"increase_mpx_balance {user_id} -> {amount}")
    async with async_session() as session:
        await session.execute(update(User).where(User.tg_id == user_id).values(balance_mpx=User.balance_mpx + amount))
        await session.commit()


async def increase_snake_balance(user_id: int, amount: int):
    """
    Increase snake token balance
    """
    logging.info(f"increase_snake_balance {user_id} -> {amount}")
    async with async_session() as session:
        await session.execute(update(User).where(User.tg_id == user_id).values(balance_snake=User.balance_snake + amount))
        await session.commit()


# import asyncio
# import datetime

# asyncio.run(add_user(tg_id=1060834219, last_time_online = datetime.datetime.now() - datetime.timedelta(days=2)))