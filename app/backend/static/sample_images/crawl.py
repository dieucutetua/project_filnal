# from roboflow import Roboflow
# rf = Roboflow(api_key="MLlGMOfNaHlUhVNNMpWG")
# project = rf.workspace("ltd").project("food-ttntd")
# version = project.version(1)
# dataset = version.download("yolov8")
# # dataset = version.download("yolov8", location="/backend/static")


# !pip install roboflow

# !pip install roboflow

from roboflow import Roboflow
rf = Roboflow(api_key="MLlGMOfNaHlUhVNNMpWG")
project = rf.workspace("ltd").project("vegetables-2mlqo")
version = project.version(3)
dataset = version.download("yolov8")
                