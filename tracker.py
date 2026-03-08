from pydantic import BaseModel


class Tracker(BaseModel):
    id: int
    title: str
    desc: str


class TrackerRequest(BaseModel):
    title: str
    desc: str
