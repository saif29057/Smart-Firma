from django.urls import path
from . import views

urlpatterns = [
    path('inbox/', views.inbox, name='inbox'),
    path('sent/', views.sent_messages, name='sent_messages'),
    path('send/', views.send_message, name='send_message'),
    path('<int:message_id>/', views.message_detail, name='message_detail'),
    path('<int:message_id>/delete/', views.delete_message, name='delete_message'),
    path('unread/count/', views.unread_count, name='unread_count'),
]
