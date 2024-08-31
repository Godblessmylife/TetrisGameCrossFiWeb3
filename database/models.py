from sqlalchemy import String, BigInteger, Boolean, DateTime, Integer
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from sqlalchemy.ext.asyncio import AsyncAttrs, async_sessionmaker, create_async_engine

from typing import List


from datetime import datetime

engine = create_async_engine(url="sqlite+aiosqlite:///database/db.sqlite3", echo=False)


async_session = async_sessionmaker(engine)


class Base(AsyncAttrs, DeclarativeBase):
    pass


class User(Base):
    __tablename__ = 'users'

    tg_id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    first_name: Mapped[int] = mapped_column(String)
    username: Mapped[str] = mapped_column(String)
    balance_mpx: Mapped[int] = mapped_column(BigInteger, default=0)
    ton_wallet_address: Mapped[str] = mapped_column(String, default='', nullable=True)
    metamask_wallet_address: Mapped[str] = mapped_column(String, default='', nullable=True)
    invited: Mapped[bool] = mapped_column(Boolean, default=False, nullable=True)
    last_time_online: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(), nullable=True)
    days_online: Mapped[int] = mapped_column(Integer, default=0, nullable=True)
    subscribed: Mapped[int] = mapped_column(Integer, default=0)
    
class Transaction(Base):
    __tablename__ = 'transactions'

    tx_hash: Mapped[int] = mapped_column(String, primary_key=True)
    _from: Mapped[int] = mapped_column(String)
    from_user_id: Mapped[int] = mapped_column(BigInteger)
    

    


async def async_main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# import asyncio

# asyncio.run(async_main())
