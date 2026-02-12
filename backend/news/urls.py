from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_news, name='get_news'),
    path('categories/', views.get_categories, name='get_categories'),
]
