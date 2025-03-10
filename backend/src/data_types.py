from pydantic import BaseModel
from typing import List, Tuple, Union, Optional

class DataSet(BaseModel):
    dataset: str

class Search(BaseModel):
    searchSoundscape: str

class TemporalAudioFeatures(BaseModel):
    loudness: List[float]
    sharpness: List[float]
    roughness: List[float]

class Soundscape_List(BaseModel):
    file_name: str
    dataset: str
    audio_ip: str
    duration_s: float
    pleasant: int
    vibrant: int
    eventful: int
    chaotic: int
    annoying: int
    monotonous: int
    uneventful: int
    calm: int
    ISO_Pleasantness: float
    ISO_Eventfulness: float

    SC_Nature: float
    SC_Human: float
    SC_Household: float
    SC_Installation: float
    SC_Signals: float
    SC_Traffic: float
    SC_Speech: float
    SC_Music: float
    Activity: str
    Location8: str
    FGsource: str

    LAeq_default: float
    N5_default: float
    FavgArith_default: float
    RAavgArith: float
    SavgArith_default: float
    R_default: float 
    T_default: float

    temporal_audio_features: Optional[TemporalAudioFeatures] = None


class Radar_Attributes(BaseModel):
    pleasant: int
    vibrant: int
    eventful: int
    chaotic: int
    annoying: int
    monotonous: int
    uneventful: int
    calm: int

class Slider_Attributes(BaseModel):
    pleasant: List[Union[int, bool]]
    vibrant: List[Union[int, bool]]
    eventful: List[Union[int, bool]]
    chaotic: List[Union[int, bool]]
    annoying: List[Union[int, bool]]
    monotonous: List[Union[int, bool]]
    uneventful: List[Union[int, bool]]
    calm: List[Union[int, bool]]

    SC_Nature: List[Union[float, bool]]
    SC_Human: List[Union[float, bool]]
    SC_Household: List[Union[float, bool]]
    SC_Installation: List[Union[float, bool]]
    SC_Signals: List[Union[float, bool]]
    SC_Traffic: List[Union[float, bool]]
    SC_Speech: List[Union[float, bool]]
    SC_Music: List[Union[float, bool]]

    LAeq_default: List[Union[float, bool]]
    N5_default: List[Union[float, bool]]
    FavgArith_default: List[Union[float, bool]]
    RAavgArith: List[Union[float, bool]]
    SavgArith_default: List[Union[float, bool]]
    R_default: List[Union[float, bool]] 
    T_default: List[Union[float, bool]]

class ISO_Attributes(BaseModel):
    ISO_Pleasantness: List[Union[float, bool]]
    ISO_Eventfulness: List[Union[float, bool]]

class ResponseModel(BaseModel):
    soundscapes: List[Soundscape_List] 
    num_soundscapes_tabs: int 

class NumberOfTabs(BaseModel):
    num_soundscapes_tabs: int