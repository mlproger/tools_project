from sqlalchemy import Column, Integer, String, Float
from .database import Base


class HandTool(Base):
    __tablename__ = "hand_tools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)




class ElectricTool(Base):
    __tablename__ = "electric_tools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)
    power = Column(Integer)
    voltage = Column(Integer)
    socket = Column(String)


class AccumulatorTool(Base):
    __tablename__ = "accumulator_tools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)
    charge = Column(Integer, default=100)