from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_image, name='upload_image'),
    path('history/', views.analysis_history, name='analysis_history'),
    path('<int:analysis_id>/', views.analysis_detail, name='analysis_detail'),
]
