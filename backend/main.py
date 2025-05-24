from fastapi import FastAPI
import uvicorn
from api_v1 import router as router_v1
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from services.database import engine
from services.database import Base



@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        # await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
        print("Hello")
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(router_v1, tags=["Tools"])


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run(
        app=app,
        host="0.0.0.0",
        port=8000
    )