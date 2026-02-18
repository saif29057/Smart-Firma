from django.urls import path
from .views import get_locations, predict_crop

urlpatterns = [
    path('predict_crop/', predict_crop, name='predict_crop'),
    path('locations/', get_locations, name='locations'),
]