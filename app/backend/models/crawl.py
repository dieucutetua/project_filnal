

from roboflow import Roboflow
rf = Roboflow(api_key="MLlGMOfNaHlUhVNNMpWG")
project = rf.workspace("ltd").project("food-ttntd")
version = project.version(2)
dataset = version.download("yolov8")