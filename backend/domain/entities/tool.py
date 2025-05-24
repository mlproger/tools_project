from abc import ABC, abstractmethod
from dataclasses import dataclass
from pydantic import BaseModel

"""
Геттеры и сеттеры для зарядки портативных предметов
Значения по умолчанию для вольтажа
"""


class Tool(ABC, BaseModel):
    name: str
    type: str

    @abstractmethod
    def use(self) -> None:
        pass

@dataclass
class ElectricTool(Tool):
    socket: str
    power: float
    voltage: float = 220

    def use(self) -> None:
        print("Включаю в розетку")

class HandTool(Tool): 
    def use(self) -> None:
        print("Беру в руку")



def require_charge(func):
    def wrapper(self, *args, **kwargs):
        if self.charge_tool <= 0:
            raise UserWarning("Нет заряда! Зарядите инструмент.")
        return func(self, *args, **kwargs)
    return wrapper

@dataclass
class AccumulatorHandTool(HandTool):
    __accumulatorCharge: int = 100

    @property
    def charge_tool(self):
        return self.__accumulatorCharge

    @charge_tool.setter
    def charge_tool(self, charge_level: int):
        self.__accumulatorCharge += charge_level

    @require_charge
    def use(self) -> None:
        print("Снимаю с зарядки и беру в руку")
        self.__accumulatorCharge -= 50

