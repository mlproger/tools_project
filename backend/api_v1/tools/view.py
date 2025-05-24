from fastapi import APIRouter, Depends
from typing import Any
from services.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from .shema import ToolRequest
from . import crud
from services.model import HandTool
import logging

router = APIRouter(tags=["Tools"])


@router.post("/")
async def create_tool(tool: ToolRequest, session: AsyncSession = Depends(get_db)):
    return await crud.create_tool(session=session, tool=tool)


@router.post("/charge/{tool_id}")
async def charge_tools(tool_id: int, session: AsyncSession = Depends(get_db)):
    return await crud.charge_tool(session=session, tool_id=tool_id)

@router.get("/charge/{tool_id}")
async def charge_tools(tool_id: int, session: AsyncSession = Depends(get_db)):
    return await crud.get_charge(session=session, tool_id=tool_id)

@router.get("/use/{tool_type}/{tool_id}")
async def use_tool(tool_type: str, tool_id:int, db: AsyncSession = Depends(get_db)):
    return await crud.use(db, tool_type, tool_id)

@router.get("/all")
async def get_all_tools(db: AsyncSession = Depends(get_db)) :
    return await crud.get_all_tools_all_types(db)

@router.get("/{tool_type}")
async def get_tools(tool_type: str, db: AsyncSession = Depends(get_db)):
    return await crud.get_all_tools(db, tool_type)






