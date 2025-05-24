from abc import ABC
from tool import HandTool, ElectricTool, AccumulatorHandTool
from dataclasses import dataclass

class BaseToolStorage(ABC):
    def __init__(self, capacity: int, tool_type: str, current_tools_count: int = 0):
        if capacity <= 0:
            raise UserWarning("Значение вместимости хранилища должно быть больше 0")
        if current_tools_count < 0:
            raise UserWarning("Количество текущих инструментов должно быть больше 0")

        self.capacity = capacity
        self.tool_typy = tool_type
        self.current_tools_count = current_tools_count

    def add_tool(self, new_count_tools: int):
        self.current_tools_count += new_count_tools

class ToolStorageMixin:
    def __init__(self, current_tools: list):
        self.current_tools = current_tools

    def __add__(self, other):
        if isinstance(other, self.__class__):
            return self.__class__(
                capacity=self.capacity + other.capacity,
                tool_type=self.tool_typy,
                current_tools_count=self.current_tools_count + other.current_tools_count,
                current_tools=[*self.current_tools, *other.current_tools]
            )

@dataclass
class HandToolStorage(BaseToolStorage, ToolStorageMixin):
    def __init__(self, capacity: int, tool_type: str, current_tools_count: int, current_tools: list[HandTool]):
        BaseToolStorage.__init__(self, capacity, tool_type, current_tools_count)
        ToolStorageMixin.__init__(self, current_tools)

@dataclass
class ElectricToolStorage(BaseToolStorage, ToolStorageMixin):
    def __init__(self, capacity: int, tool_type: str, current_tools_count: int, current_tools: list[ElectricTool]):
        BaseToolStorage.__init__(self, capacity, tool_type, current_tools_count)
        ToolStorageMixin.__init__(self, current_tools)

@dataclass
class AccumulatorHandToolStorage(BaseToolStorage, ToolStorageMixin):
    def __init__(self, capacity: int, tool_type: str, current_tools_count: int, current_tools: list[AccumulatorHandTool]):
        BaseToolStorage.__init__(self, capacity, tool_type, current_tools_count)
        ToolStorageMixin.__init__(self, current_tools)



r = HandTool(name="ads", tool_type="dasd")  



a = HandToolStorage(capacity=30,tool_type="sdadsfda", current_tools_count=4, current_tools=[r])
b = HandToolStorage(capacity=30,tool_type="sdadsfda", current_tools_count=4, current_tools=[r])
c = a+b
print(c.current_tools)