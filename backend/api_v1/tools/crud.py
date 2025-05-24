from sqlalchemy.ext.asyncio import AsyncSession
from .shema import ToolRequest
from sqlalchemy import select
from services.model import HandTool, ElectricTool, AccumulatorTool
import logging


async def create_tool(session: AsyncSession, tool: ToolRequest):
    try:
        if tool.type == "HandTool":
            new_tool = HandTool(**tool.model_dump())
        elif tool.type == "ElectricTool":
            new_tool = ElectricTool(**tool.model_dump())
        elif tool.type == "AccumulatorHandTool" or tool.type == "AccumulatorTool":
            new_tool = AccumulatorTool(**tool.model_dump())
        session.add(new_tool)
        await session.commit()
        await session.refresh(new_tool)
        return new_tool
    except Exception as e:
        return {
            "error": str(e)
        }
    

async def get_all_tools(session: AsyncSession, tool_type: str) -> list[ToolRequest]:
    if tool_type == "HandTool":
        stmt = select(HandTool).order_by(HandTool.id)
    elif tool_type == "ElectricTool":
        stmt = select(ElectricTool).order_by(ElectricTool.id)
    elif tool_type == "AccumulatorTool":
        stmt = select(AccumulatorTool).order_by(AccumulatorTool.id)
    resulst = await session.execute(stmt)
    toos = resulst.scalars().all()
    return list(toos)


async def use(session: AsyncSession, tool_type: str, tool_id: int):
    if tool_type == "HandTool":
        tool = await session.get(HandTool, tool_id)
        if tool:
            return "используем ручной инструмент"
        return "инструмент не найден"
    elif tool_type == "ElectricTool":
        tool = await session.get(ElectricTool, tool_id)
        if tool:
            return "использую электрический инструмент"
        return "инструмент не найден"
    elif tool_type == "AccumulatorTool" or tool_type == "AccumulatorHandTool":
        tool = await session.get(AccumulatorTool, tool_id)
        if not tool:
            return "инструмент не найден"
        if getattr(tool, "charge", None) is not None and tool.charge >= 10:
            tool.charge -= 10
            await session.commit()
            return "используем инструмент с аккумулятором"
        else:
            return "нет заряда"
    else:
        return "неизвестный тип инструмента"



async def get_all_tools_all_types(session: AsyncSession):
    hand_tools = (await session.execute(select(HandTool))).scalars().all()
    electric_tools = (await session.execute(select(ElectricTool))).scalars().all()
    accumulator_tools = (await session.execute(select(AccumulatorTool))).scalars().all()
    all_tools = hand_tools + electric_tools + accumulator_tools
    return [
        {
            "id": tool.id,
            "name": tool.name,
            "type": tool.type,
        }
        for tool in all_tools
    ]


async def charge_tool(session: AsyncSession, tool_id: int):
    tool = await session.get(AccumulatorTool, tool_id)
    if not tool:
        return {"message": "инструмент не найден"}
    tool.charge = 100
    await session.commit()
    return {"message": "инструмент заряжен"}


async def get_charge(session: AsyncSession, tool_id: int):
    tool = await session.get(AccumulatorTool, tool_id)
    if not tool:
        return {"message": "инструмент не найден"}
    return {"charge": tool.charge}