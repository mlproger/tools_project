from fastapi import APIRouter
from .tools.view import router as tools_router

router = APIRouter()
router.include_router(router=tools_router, prefix="/tools")