from pydantic import BaseModel, Field
from typing import Union, Literal

from domain.entities.tool import Tool, HandTool, ElectricTool, AccumulatorHandTool



ToolRequest = Union[HandTool, ElectricTool, AccumulatorHandTool]